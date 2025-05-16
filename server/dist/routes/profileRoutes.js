"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const multer_1 = __importDefault(require("../utils/multer"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.use(userController_1.protectedRoute);
router.post('/profiles', multer_1.default.single('image'), profileController_1.createProfile);
router.route('/profile/:id').get(profileController_1.getProfileById);
router.get('/me', profileController_1.getMyProfile);
router.put('/me', multer_1.default.single('image'), profileController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=profileRoutes.js.map