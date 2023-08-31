import { Prisma } from '@prisma/client';
import taskQueryArgs from './tasks.query-args';
import linkQueryArgs from './links.query-args';

const projectQueryArgs = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    wbsElement: {
      include: {
        projectLead: true,
        projectManager: true,
        tasks: { where: { dateDeleted: null }, ...taskQueryArgs },
        links: { ...linkQueryArgs },
        changes: { where: { changeRequest: { dateDeleted: null } }, include: { implementer: true } }
      }
    },
    teams: { include: { members: true, head: true, leads: true } },
    goals: { where: { dateDeleted: null } },
    features: { where: { dateDeleted: null } },
    otherConstraints: { where: { dateDeleted: null } },
    workPackages: {
      where: {
        wbsElement: {
          dateDeleted: null
        }
      },
      include: {
        wbsElement: {
          include: {
            projectLead: true,
            projectManager: true,
            links: { ...linkQueryArgs },
            changes: { where: { changeRequest: { dateDeleted: null } }, include: { implementer: true } }
          }
        },
        blockedBy: { where: { dateDeleted: null } },
        expectedActivities: { where: { dateDeleted: null } },
        deliverables: { where: { dateDeleted: null } }
      }
    },
    favoritedBy: true
  }
});

export default projectQueryArgs;
