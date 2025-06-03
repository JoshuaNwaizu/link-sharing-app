import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import Profile from '../models/ProfileModel';
import cloudinary from '../utils/cloudinary';
import streamifier from 'streamifier';
import validator from 'validator';

const createProfile = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const userId = (req as any).user._id;

  // Check for existing profile
  const existingProfile = await Profile.findOne({ user: userId });
  if (existingProfile) {
    res.status(200).json(existingProfile);
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'Image file is required' });
    return;
  }

  // Validate email if provided
  const profileData: any = {
    user: userId,
    firstName,
    lastName,
  };
  if (email && validator.isEmail(email)) {
    profileData.email = email;
  }

  // Upload image to Cloudinary
  const uploadResult = cloudinary.uploader.upload_stream(
    { folder: 'profile_images' },
    async (error, result) => {
      if (error || !result) {
        return res.status(500).json({ message: 'Cloudinary upload failed' });
      }

      profileData.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      try {
        const profile = new Profile(profileData);
        await profile.save();
        res.status(201).json(profile);
      } catch (error: any) {
        console.error('Error saving profile:', error);
        res.status(500).json({ message: error.message });
      }
    },
  );

  streamifier.createReadStream(file.buffer).pipe(uploadResult);
});
const getProfileById = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// controllers/profileController.ts
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  try {
    // Assuming you have user ID in req.user from auth middleware
    const userId = (req as any).user._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const file = req.file;
  const userId = (req as any).user._id;

  // Check if profile exists
  const existingProfile = await Profile.findOne({ user: userId });
  if (!existingProfile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  let imageUpdate = {};
  if (file) {
    // Delete old image from Cloudinary if exists
    if (existingProfile.image?.public_id) {
      await cloudinary.uploader.destroy(existingProfile.image.public_id);
    }

    // Upload new image
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profile_images' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    imageUpdate = {
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    };
  }

  // Build update object
  const updateData: any = {
    firstName: firstName || existingProfile.firstName,
    lastName: lastName || existingProfile.lastName,
    ...imageUpdate,
  };
  if (email && validator.isEmail(email)) {
    updateData.email = email;
  } else if (email === '') {
    updateData.email = undefined; // Explicitly unset email if empty
  }

  // Update profile
  const updatedProfile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updateData },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    data: updatedProfile,
  });
});

export { createProfile, getProfileById, getMyProfile, updateProfile };
