/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { User, UserPreview } from './user-types';
import { ImplementedChange } from './change-request-types';
import { TimelineStatus, WorkPackageStage } from './work-package-types';
import { TeamPreview } from './team-types';
import { Task } from 'shared';

export interface WbsNumber {
  carNumber: number;
  projectNumber: number;
  workPackageNumber: number;
}

export interface WbsElement {
  id: number;
  wbsNum: WbsNumber;
  dateCreated: Date;
  name: string;
  status: WbsElementStatus;
  projectLead?: User;
  projectManager?: User;
  changes: ImplementedChange[];
}

export enum WbsElementStatus {
  Inactive = 'INACTIVE',
  Active = 'ACTIVE',
  Complete = 'COMPLETE'
}

export interface Project extends WbsElement {
  summary: string;
  budget: number;
  links: Link[];
  rules: string[];
  endDate?: Date;
  duration: number;
  startDate?: Date;
  goals: DescriptionBullet[];
  features: DescriptionBullet[];
  otherConstraints: DescriptionBullet[];
  workPackages: WorkPackage[];
  team?: TeamPreview;
  tasks: Task[];
}

export type ProjectPreview = Pick<Project, 'id' | 'name' | 'wbsNum' | 'status'>;

export interface WorkPackage extends WbsElement {
  orderInProject: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  duration: number;
  expectedProgress: number;
  timelineStatus: TimelineStatus;
  blockedBy: WbsNumber[];
  expectedActivities: DescriptionBullet[];
  deliverables: DescriptionBullet[];
  projectName: string;
  stage?: WorkPackageStage;
}

export interface DescriptionBullet {
  id: number;
  detail: string;
  dateAdded: Date;
  dateDeleted?: Date;
  userChecked?: User;
}

export interface LinkType {
  linkTypeId: string;
  dateCreated: Date;
  creator: UserPreview;
  name: string;
}

export interface Link {
  linkId: string;
  linkType: LinkType;
  dateCreated: Date;
  creator: User;
  url: string;
}

export interface LinkCreateArgs {
  linkId: string;
  linkTypeId: string;
  url: string;
}
