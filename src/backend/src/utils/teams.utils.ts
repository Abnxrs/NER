import { Prisma, User } from '@prisma/client';

const teamQueryArgsMembersOnly = Prisma.validator<Prisma.TeamArgs>()({
  include: {
    members: true,
    head: true,
    leads: true
  }
});

/**
 * Returns true if every given user is on the given team (either a member, head, or lead)
 * @param team the given team with members, lead, and head included in the get payload
 * @param users the given users
 * @returns true or false
 */
export const allUsersOnTeam = (team: Prisma.TeamGetPayload<typeof teamQueryArgsMembersOnly>, users: User[]): boolean => {
  return users.every((user) => isUserOnTeam(team, user));
};

/**
 * Returns true if the user is a member, head, or lead of a team
 */
export const isUserOnTeam = (team: Prisma.TeamGetPayload<typeof teamQueryArgsMembersOnly>, user: User): boolean => {
  return (
    team.headId === user.userId ||
    team.leads.map((lead) => lead.userId).includes(user.userId) ||
    team.members.map((member) => member.userId).includes(user.userId)
  );
};

/**
 * Validates that all of the users are at least part of one of the teams of the given project
 *
 * @param teams the teams to check the users are on
 * @param users the users to check are on at least one of the projects teams
 * @returns if all of the users are part of at least one of the projects teams
 */
export const areUsersPartOfProjectTeams = (
  teams: Prisma.TeamGetPayload<typeof teamQueryArgsMembersOnly>[],
  users: User[]
) => {
  return users.every((user) => teams.some((team) => isUserOnTeam(team, user)));
};
