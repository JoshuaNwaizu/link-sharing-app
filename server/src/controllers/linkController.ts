import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import User from '../models/UserModel';
import mongoose from 'mongoose';
import Link from '../models/LinkModel';
import Profile from '../models/ProfileModel';

const saveLinks = catchAsync(async (req: Request, res: Response) => {
  const links = req.body.links || req.body.linksToSave || [];
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  if (!Array.isArray(links)) {
    res.status(400).json({ message: 'Links must be an array' });
    return;
  }

  const validLinks = links
    .filter((link) => link && typeof link === 'object')
    .filter(
      (link) =>
        link.url && typeof link.url === 'string' && link.url.trim() !== '',
    );

  if (validLinks.length === 0) {
    res.status(400).json({
      message: 'Please provide at least one valid link with a URL',
    });
    return;
  }
  await Link.deleteMany({ user: userId });

  //Save new links
  const linksToSave = links.map((link: any, index: number) => ({
    user: userId,
    platform: link.platform || 'github',
    url: link.url,
    order: index,
  }));

  try {
    const savedLinks = await Link.insertMany(linksToSave);
    res.status(201).json({
      message: 'Links saved successfully',
      data: { links: savedLinks },
    });
    return;
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Failed to save links to database' });
    return;
  }
});

const getLinks = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const userLinks = await Link.find({ user: userId })
      .select('platform url order -_id') // Only select needed fields, exclude _id
      .sort('order')
      .lean();

    if (!userLinks || userLinks.length === 0) {
      res.status(200).json({
        status: 'success',
        data: { links: [] },
      });
      return;
    }
    res.status(200).json({ data: { links: userLinks } });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch links',
    });
    return;
  }
});

const getOflineLinks = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid userId format');
      res.status(400).json({
        status: 'error',
        message: 'Invalid user ID format',
      });
      return;
    }

    // First check if this is a profile ID and get the user info
    const profile = await Profile.findById(userId);

    // If profile exists, use its user ID, otherwise use the provided ID
    const queryUserId = profile ? profile.user : userId;

    // Find links for the user
    const userLinks = await Link.find({
      user: new mongoose.Types.ObjectId(queryUserId),
    })
      .select('platform url order _id user') // Added 'user' to selected fields
      .sort('order')
      .lean();

    res.status(200).json({
      status: 'success',
      data: {
        links: userLinks.map((link) => ({
          id: link._id,
          platform: link.platform,
          url: link.url,
          order: link.order,
        })),
      },
      debug: {
        queriedId: queryUserId,
        foundLinks: userLinks.length,
      },
    });
    return;
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch links',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
});
export { saveLinks, getLinks, getOflineLinks };
