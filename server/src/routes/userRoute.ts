import express from 'express';
import {
  createAccount,
  getUserById,
  login,
} from '../controllers/userController';

const router = express.Router();

router.route('/create-account').post(createAccount);
router.route('/login').post(login);
router.route('/user/:id').get(getUserById);
export default router;
