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
router.route('/profile/:id').get(getProfileById);
router.post('/profiles', upload.single('image'), protectedRoute, createProfile);
router.get('/me', protectedRoute, getMyProfile);
router.put('/me', upload.single('image'), protectedRoute, updateProfile);

export default router;
