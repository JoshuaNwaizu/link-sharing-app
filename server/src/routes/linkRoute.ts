import express from 'express';
import { saveLinks, getLinks } from '../controllers/linkController';
import { protectedRoute } from '../controllers/userController';

const router = express.Router();

router.route('/save-links').post(protectedRoute, saveLinks);
router.route('/get-links').get(protectedRoute, getLinks);

export default router;
