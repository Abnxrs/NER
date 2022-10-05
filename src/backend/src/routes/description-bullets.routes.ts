import express from 'express';
import { body } from 'express-validator';
import { editDescriptionBullets } from '../utils/projects.utils';

const descriptionBulletsRouter = express.Router();

descriptionBulletsRouter.post("\check",
   body('submitterId').isInt({ min: 0 }).not().isString(),
   body('descriptionBulletId').isInt({ min: 0 }).not().isString(),
   editDescriptionBullets
);

