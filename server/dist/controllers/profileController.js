"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMyProfile = exports.getProfileById = exports.createProfile = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ProfileModel_1 = __importDefault(require("../models/ProfileModel"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const createProfile = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const userId = req.user._id;
        // Check for existing profile
        const existingProfile = await ProfileModel_1.default.findOne({ user: userId });
        if (existingProfile) {
            res.status(200).json(existingProfile);
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: 'Image file is required' });
            return;
        }
        const uploadResult = cloudinary_1.default.uploader.upload_stream({ folder: 'profile_images' }, async (error, result) => {
            if (error || !result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }
            const profile = new ProfileModel_1.default({
                user: userId,
                firstName,
                lastName,
                email,
                image: {
                    url: result.secure_url,
                    public_id: result.public_id,
                },
            });
            await profile.save();
            res.status(201).json(profile);
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.createProfile = createProfile;
const getProfileById = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await ProfileModel_1.default.findById(id);
        if (!profile) {
            res.status(404).json({ message: 'Profile not found' });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProfileById = getProfileById;
// controllers/profileController.ts
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    try {
        // Assuming you have user ID in req.user from auth middleware
        const userId = req.user._id;
        const profile = await ProfileModel_1.default.findOne({ user: userId });
        if (!profile) {
            res.status(404).json({ message: 'Profile not found' });
            return;
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMyProfile = getMyProfile;
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const file = req.file;
        const userId = req.user._id;
        // First check if profile exists
        const existingProfile = await ProfileModel_1.default.findOne({ user: userId });
        if (!existingProfile) {
            res.status(404).json({ message: 'Profile not found' });
            return;
        }
        let imageUpdate = {};
        if (file) {
            // If updating image, delete old image from Cloudinary if exists
            if (existingProfile.image?.public_id) {
                await cloudinary_1.default.uploader.destroy(existingProfile.image.public_id);
            }
            // Upload new image
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'profile_images' }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
            imageUpdate = {
                image: {
                    url: result.secure_url,
                    public_id: result.public_id,
                },
            };
        }
        // Update profile
        const updatedProfile = await ProfileModel_1.default.findOneAndUpdate({ user: userId }, {
            $set: {
                firstName: firstName || existingProfile.firstName,
                lastName: lastName || existingProfile.lastName,
                email: email || existingProfile.email,
                ...imageUpdate,
            },
        }, { new: true });
        res.status(200).json({
            status: 'success',
            data: updatedProfile,
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=profileController.js.map