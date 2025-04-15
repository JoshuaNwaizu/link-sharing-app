import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import Profile from '../models/ProfileModel';
import cloudinary from '../utils/cloudinary';
import streamifier from 'streamifier';

const createProfile = catchAsync(async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Check for existing profile
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      res.status(400).json({ message: 'Profile already exists' });
      return;
    }

    // Upload image to Cloudinary
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Image file is required' });
      return;
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: 'profile_images' },
      async (error, result) => {
        if (error || !result) {
          res.status(500).json({ message: 'Cloudinary upload failed' });
          return;
        }

        // Save profile with uploaded image data
        const profile = new Profile({
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
        return;
      },
    );

    // Use Node.js stream to send the file buffer
    if (file.buffer) {
      streamifier.createReadStream(file.buffer).pipe(uploadResult);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }
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

export { createProfile, getProfileById };
