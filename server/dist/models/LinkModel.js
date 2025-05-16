"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const linkSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
});
exports.default = mongoose_1.default.model('Link', linkSchema);
//# sourceMappingURL=LinkModel.js.map