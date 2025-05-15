import express from 'express';
import {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
} from '../controllers/profileController';
import upload from '../utils/multer';
import { protectedRoute } from '../controllers/userController';

const router = express.Router();
router.use(protectedRoute);

router.post('/profiles', upload.single('image'), createProfile);
router.route('/profile/:id').get(getProfileById);
router.get('/me', getMyProfile);
router.put('/me', upload.single('image'), updateProfile);

export default router;
