import express from 'express';
import { body } from 'express-validator';
import { intMinZero, isMaterialStatus, nonEmptyString } from '../utils/validation.utils';
import { validateInputs } from '../utils/utils';
import ProjectsController from '../controllers/projects.controllers';

const projectRouter = express.Router();

projectRouter.get('/', ProjectsController.getAllProjects);
projectRouter.get('/link-types', ProjectsController.getAllLinkTypes);
projectRouter.get('/:wbsNum', ProjectsController.getSingleProject);
projectRouter.post(
  '/create',
  intMinZero(body('crId')),
  nonEmptyString(body('name')),
  intMinZero(body('carNumber')),
  nonEmptyString(body('summary')),
  validateInputs,
  ProjectsController.createProject
);

projectRouter.post(
  '/edit',
  intMinZero(body('projectId')),
  intMinZero(body('crId')),
  nonEmptyString(body('name')),
  intMinZero(body('budget')),
  nonEmptyString(body('summary')),
  body('rules').isArray(),
  nonEmptyString(body('rules.*')),
  body('goals').isArray(),
  body('goals.*.id').isInt({ min: -1 }).not().isString(),
  nonEmptyString(body('goals.*.detail')),
  body('features').isArray(),
  body('features.*.id').isInt({ min: -1 }).not().isString(),
  nonEmptyString(body('features.*.detail')),
  body('otherConstraints').isArray(),
  body('otherConstraints.*.id').isInt({ min: -1 }).not().isString(),
  nonEmptyString(body('otherConstraints.*.detail')),
  body('links').isArray(),
  nonEmptyString(body('links.*.url')),
  nonEmptyString(body('links.*.linkTypeName')),
  intMinZero(body('projectLeadId').optional()),
  intMinZero(body('projectManagerId').optional()),
  validateInputs,
  ProjectsController.editProject
);
projectRouter.post('/:wbsNum/set-team', nonEmptyString(body('teamId')), validateInputs, ProjectsController.setProjectTeam);
projectRouter.delete('/:wbsNum/delete', ProjectsController.deleteProject);
projectRouter.post('/:wbsNum/favorite', ProjectsController.toggleFavorite);

/**************** BOM Section ****************/
projectRouter.post(
  '/bom/manufacturer/create',
  nonEmptyString(body('name')),
  validateInputs,
  ProjectsController.createManufacturer
);
projectRouter.post('/bom/material-type/create', nonEmptyString(body('name')), ProjectsController.createMaterialType);
projectRouter.post(
  '/bom/assembly/:wbsNum/create',
  nonEmptyString(body('name')),
  nonEmptyString(body('pdmFileName')).optional(),
  ProjectsController.createAssembly
);
projectRouter.post(
  '/material/:wbsNum/create',
  nonEmptyString(body('name')),
  nonEmptyString(body('assemblyId').optional()),
  isMaterialStatus(body('status')),
  nonEmptyString(body('materialTypeName')),
  nonEmptyString(body('manufacturerName')),
  nonEmptyString(body('manufacturerPartNumber')),
  nonEmptyString(body('pdmFileName').optional()),
  intMinZero(body('quantity')),
  nonEmptyString(body('unitName')),
  intMinZero(body('price')), // in cents
  intMinZero(body('subtotal')), // in cents
  nonEmptyString(body('linkUrl').isURL()),
  body('notes').isString(),
  validateInputs,
  ProjectsController.createMaterial
);
projectRouter.post(
  '/bom/material/:wbsNum/edit',
  nonEmptyString(body('name')),
  intMinZero(body('assembly.assemblyId').optional()),
  nonEmptyString(body('assembly.name').optional()),
  nonEmptyString(body('assembly.pdmFileName').optional()),
  isMaterialStatus(body('status')),
  nonEmptyString(body('manufacturerName')),
  nonEmptyString(body('manufacturerPartNumber')),
  nonEmptyString(body('pdmFileName').optional()),
  intMinZero(body('quantity')),
  nonEmptyString(body('quantityUnit.name').optional()),
  nonEmptyString(body('unitName')),
  intMinZero(body('price')), // in cents
  intMinZero(body('subtotal')), // in cents
  nonEmptyString(body('linkUrl').isURL()),
  body('notes').isString(),
  validateInputs,
  ProjectsController.editMaterial
);

export default projectRouter;
