import express from 'express';
import {
  createProfile,
  getProfileById,
} from '../controllers/profileController';
import upload from '../utils/multer';
import { protectedRoute } from '../controllers/userController';

const router = express.Router();
router.use(protectedRoute);
// 'image' is the name of the field for the uploaded file
router.post('/profiles', upload.single('image'), createProfile);
router.route('/profile/:id').get(getProfileById);

export default router;
