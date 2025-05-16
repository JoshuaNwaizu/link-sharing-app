"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const Schema = mongoose_1.default.Schema;
const profileSchema = new Schema({
    //   user: { type: Sche  ma.Types.ObjectId, ref: 'User', required: true },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // ✅ Ensures only one profile per user
    },
    image: {
        url: {
            type: String,
            required: true,
        },
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxLength: [50, 'First name must not exceed 50 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxLength: [50, 'Last name must not exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: validator_1.default.isEmail,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Add a virtual property for fullName
profileSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.default = mongoose_1.default.model('Profile', profileSchema);
//# sourceMappingURL=ProfileModel.js.map