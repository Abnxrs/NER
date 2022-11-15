import { Role, User } from '@prisma/client';
import { Risk } from 'shared';
import prisma from '../prisma/prisma';
import { throwAccessDeniedError, throwError, throwNotFoundError } from '../utils/response.utils';
import { hasRiskPermissions, riskQueryArgs, riskTransformer } from '../utils/risks.utils';

/**
 * Gets all the risks for the given project
 * @param projectId the project to get the risks for
 * @returns a list of risks
 * @throws if the given project doesn't exist
 */
export const getRisksForProject = async (projectId: number): Promise<Risk[]> => {
  const requestedProject = await prisma.project.findUnique({ where: { projectId } });
  if (!requestedProject) throwNotFoundError('Project', projectId);

  const risks = await prisma.risk.findMany({ where: { projectId }, ...riskQueryArgs });

  return risks.map(riskTransformer);
};

/**
 * Creates a Risk in the database
 * @param user the user creating the risk
 * @param projectId the project to create the risk for
 * @param detail the detail (description) of the risk
 * @returns the id of the successfully created risk
 * @throws if the user does not have access to create a risk
 */
export const createRisk = async (user: User, projectId: number, detail: string): Promise<string> => {
  if (user.role === Role.GUEST) throwAccessDeniedError('Guests cannot create risks!');

  const createdRisk = await prisma.risk.create({
    data: {
      project: { connect: { projectId } },
      detail,
      createdBy: { connect: { userId: user.userId } }
    }
  });

  return createdRisk.id;
};

/**
 * Edits a Risk in the database
 * @param user the user editing the risk
 * @param riskId the id of the risk
 * @param detail the new detail of the risk
 * @param resolved the new resolved state of the risk
 * @returns the updated risk
 * @throws if the risk does not exist, the risk is already deleted, or if the user does not have permissions
 */
export const editRisk = async (user: User, riskId: string, detail: string, resolved: boolean): Promise<Risk> => {
  // get the original risk and check if it exists
  const originalRisk = await prisma.risk.findUnique({ where: { id: riskId } });
  if (!originalRisk) return throwNotFoundError('Risk', riskId);
  if (originalRisk.dateDeleted) throwError(400, 'Cant edit a deleted Risk!');

  const hasPerms = await hasRiskPermissions(user.userId, originalRisk.projectId);
  if (!hasPerms) throwAccessDeniedError();

  let updatedRisk;

  if (originalRisk.isResolved && !resolved) {
    // if the risk is already resolved and we are unresolving it, we need to take away the resolved data in the db
    updatedRisk = await prisma.risk.update({
      where: { id: riskId },
      data: {
        detail,
        isResolved: resolved,
        resolvedByUserId: null,
        resolvedAt: null
      },
      ...riskQueryArgs
    });
  } else if (!originalRisk.isResolved && resolved) {
    // if it's not resolved and we're resolving it, we need to set the resolved data in the db
    updatedRisk = await prisma.risk.update({
      where: { id: riskId },
      data: {
        detail,
        isResolved: resolved,
        resolvedByUserId: user.userId,
        resolvedAt: new Date()
      },
      ...riskQueryArgs
    });
  } else {
    // any other case we are only changing the detail
    updatedRisk = await prisma.risk.update({
      where: { id: riskId },
      data: {
        detail
      },
      ...riskQueryArgs
    });
  }

  // return the updated risk
  return riskTransformer(updatedRisk);
};

/**
 * Deletes a Risk in the database
 * @param user the user deleting the risk
 * @param riskId the id of the risk being deleted
 * @returns the deleted risk
 * @throws if the risk does not exist, the risk has already been deleted, or the user does not have permission
 */
export const deleteRisk = async (user: User, riskId: string): Promise<Risk> => {
  const targetRisk = await prisma.risk.findUnique({ where: { id: riskId }, ...riskQueryArgs });
  if (!targetRisk) return throwNotFoundError('Risk', riskId);

  if (targetRisk.dateDeleted || targetRisk.deletedBy) return throwError(400, 'This risk has already been deleted!');

  const selfDelete = targetRisk.createdByUserId === user.userId;
  const hasPerms = await hasRiskPermissions(user.userId, targetRisk.projectId);
  if (!selfDelete && !hasPerms) return throwAccessDeniedError();

  const updatedRisk = await prisma.risk.update({
    where: { id: riskId },
    data: {
      deletedByUserId: user.userId,
      dateDeleted: new Date()
    },
    ...riskQueryArgs
  });

  return riskTransformer(updatedRisk);
};
