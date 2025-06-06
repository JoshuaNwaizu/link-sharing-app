import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import User from '../models/UserModel';
import Link from '../models/LinkModel';

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
// server/src/controllers/linkController.ts

export { saveLinks, getLinks };
