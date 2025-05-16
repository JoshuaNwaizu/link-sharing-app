"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkController_1 = require("../controllers/linkController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route('/save-links').post(userController_1.protectedRoute, linkController_1.saveLinks);
router.route('/get-links').get(userController_1.protectedRoute, linkController_1.getLinks);
exports.default = router;
//# sourceMappingURL=linkRoute.js.map