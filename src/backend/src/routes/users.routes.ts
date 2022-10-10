import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getSingleUser,
  getUserSettings,
  logUserIn,
  updateUserSettings,
  updateUserRole
} from '../controllers/users.controllers';
import { intMinZero } from '../utils/validation.utils';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getSingleUser);
userRouter.get('/:userId/settings', getUserSettings);
userRouter.post('/:userId/settings', updateUserSettings);
userRouter.post('/auth/:login', logUserIn);
userRouter.post(
  '/:userId/change-role',
  intMinZero(body('userId')),
  body('promoteToRole').isBoolean(),
  updateUserRole
);

export default userRouter;
