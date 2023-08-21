import { Project, validateWBS, WbsNumber, wbsPipe } from 'shared';
import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { getCurrentUser } from '../utils/auth.utils';
import ProjectsService from '../services/projects.services';

export default class ProjectsController {
  static async getAllProjects(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects: Project[] = await ProjectsService.getAllProjects();
      return res.status(200).json(projects);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getSingleProject(req: Request, res: Response, next: NextFunction) {
    try {
      const wbsNumber: WbsNumber = validateWBS(req.params.wbsNum);

      const project: Project = await ProjectsService.getSingleProject(wbsNumber);

      return res.status(200).json(project);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = await getCurrentUser(res);
      const { crId, carNumber, name, summary, teamId } = req.body;

      const createdWbsNumber: WbsNumber = await ProjectsService.createProject(user, crId, carNumber, name, summary, teamId);

      return res.status(200).json(wbsPipe(createdWbsNumber));
    } catch (error: unknown) {
      next(error);
    }
  }

  static async editProject(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getCurrentUser(res);
      const {
        projectId,
        crId,
        name,
        budget,
        summary,
        rules,
        goals,
        features,
        otherConstraints,
        links,
        projectLeadId,
        projectManagerId
      } = req.body;

      const editedProject: Project = await ProjectsService.editProject(
        user,
        projectId,
        crId,
        name,
        budget,
        summary,
        rules,
        goals,
        features,
        otherConstraints,
        links,
        projectLeadId || null,
        projectManagerId || null
      );

      return res.status(200).json(editedProject);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async setProjectTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = await getCurrentUser(res);
      const wbsNumber: WbsNumber = validateWBS(req.params.wbsNum);
      const { teamId } = req.body;

      await ProjectsService.setProjectTeam(user, wbsNumber, teamId);

      return res.status(200).json({ message: `Project ${wbsPipe(wbsNumber)} successfully assigned to team ${teamId}.` });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = await getCurrentUser(res);
      const wbsNumber: WbsNumber = validateWBS(req.params.wbsNum);
      const deletedProject: Project = await ProjectsService.deleteProject(user, wbsNumber);
      res.status(200).json(deletedProject);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const wbsNum: WbsNumber = validateWBS(req.params.wbsNum);
      const user = await getCurrentUser(res);

      const targetProject = await ProjectsService.toggleFavorite(wbsNum, user);

      res.status(200).json(targetProject);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getAllLinkTypes(_req: Request, res: Response, next: NextFunction) {
    try {
      const linkTypes = await ProjectsService.getAllLinkTypes();
      res.status(200).json(linkTypes);
    } catch (error: unknown) {
      next(error);
    }
  }
}
