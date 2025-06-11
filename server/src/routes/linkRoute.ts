import express from 'express';
import {
  saveLinks,
  getLinks,
  getOflineLinks,
} from '../controllers/linkController';
import { protectedRoute } from '../controllers/userController';

const router = express.Router();

router.route('/save-links').post(protectedRoute, saveLinks);
router.route('/get-links').get(protectedRoute, getLinks);
// router.route('/shared-links').get(getOflineLinks);
router.get('/shared-links/:id', getOflineLinks);
// router.route('/shared-links/:profileId').get(getOflineLinks);

export default router;
