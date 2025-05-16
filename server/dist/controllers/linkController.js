"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinks = exports.saveLinks = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const LinkModel_1 = __importDefault(require("../models/LinkModel"));
const saveLinks = (0, catchAsync_1.default)(async (req, res) => {
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
        .filter((link) => link.url && typeof link.url === 'string' && link.url.trim() !== '');
    if (validLinks.length === 0) {
        res.status(400).json({
            message: 'Please provide at least one valid link with a URL',
        });
        return;
    }
    await LinkModel_1.default.deleteMany({ user: userId });
    //Save new links
    const linksToSave = links.map((link, index) => ({
        user: userId,
        platform: link.platform || 'github',
        url: link.url,
        order: index,
    }));
    try {
        const savedLinks = await LinkModel_1.default.insertMany(linksToSave);
        res.status(201).json({
            message: 'Links saved successfully',
            data: { links: savedLinks },
        });
        return;
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to save links to database' });
        return;
    }
});
exports.saveLinks = saveLinks;
const getLinks = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const userLinks = await LinkModel_1.default.find({ user: userId })
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
    }
    catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch links',
        });
        return;
    }
});
exports.getLinks = getLinks;
//# sourceMappingURL=linkController.js.map