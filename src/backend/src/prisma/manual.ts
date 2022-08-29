/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import prisma from './prisma';
import { Role } from '@prisma/client';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * This file is purely used for DevOps and database management.
 * @see {@link https://github.com/Northeastern-Electric-Racing/FinishLine/blob/develop/docs/Deployment.md docs/Deployment.md} for details
 */

/** Execute all given prisma database interaction scripts written in this function */
const executeScripts = async () => {};

/**
 * Update user's role given userId and new role
 * Example: await setUserRole(8, Role.MEMBER);
 */
const setUserRole = async (id: number, role: Role) => {
  await prisma.user.update({ where: { userId: id }, data: { role } });
};

/**
 * Print metrics on accepted Change Requests with timeline impact
 */
const checkTimelineImpact = async () => {
  const res = await prisma.change_Request.findMany({
    where: {
      accepted: true,
      scopeChangeRequest: {
        timelineImpact: {
          gt: 0
        }
      }
    },
    include: {
      scopeChangeRequest: true
    }
  });
  const calc = res.reduce((acc, curr) => {
    return acc + (curr.scopeChangeRequest?.timelineImpact || 0);
  }, 0);
  console.log('total accepted CRs w/ timeline impact:', res.length);
  console.log('total accepted delays', calc, 'weeks');
};

/**
 * Print count of total work packages
 */
const countWorkPackages = async () => {
  const res = await prisma.work_Package.count();
  console.log('total work packages:', res);
};

/**
 * Calculate active users by week
 */
const activeUserMetrics = async () => {
  // sad dev doesn't feel like converting SQL to Prisma
  // select extract(week from "created") as wk, count(distinct "userId") as "# users", count(distinct "sessionId") as "# sessions" from "Session" group by wk order by wk;
};

/**
 * migrate all Change Requests to use Proposed Solutions
 */
const migrateToProposedSolutions = async () => {
  const crs = await prisma.scope_CR.findMany({ include: { changeRequest: true } });
  crs.forEach(async (cr) => {
    const alreadyHasSolution = await prisma.proposedSolution.findFirst({
      where: { changeRequestId: cr.scopeCrId }
    });

    if (!alreadyHasSolution) {
      await prisma.proposedSolution.create({
        data: {
          description: '',
          timelineImpact: cr.timelineImpact,
          scopeImpact: cr.scopeImpact,
          budgetImpact: cr.budgetImpact,
          changeRequestId: cr.scopeCrId,
          createdByUserId: cr.changeRequest.submitterId,
          dateCreated: cr.changeRequest.dateSubmitted
        }
      });
    }
  });
};

executeScripts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Done!');
  });
