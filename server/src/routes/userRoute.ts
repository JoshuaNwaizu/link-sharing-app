import express from 'express';
import { createAccount, login } from '../controllers/userController';
import { protectedRoute } from '../controllers/userController';

const router = express.Router();
// router.use(protectedRoute);

router.route('/create-account').post(createAccount);
router.route('/login').post(login);
export default router;
