import express, { Request, Response } from 'express';
import { updateSignup, getRegionPicksByUser, getPickCounts, getAllSignups } from '../db/registrations';
import { getDiscordUser } from '../db/user_db';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

/**
 * POST /api/signup
 * Create or update user signup with region picks
 */
router.post('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    const { picks } = req.body;
    if (!picks) {
        return res.status(400).json({ error: 'Missing picks' });
    }
    const discordId = req.user!.discordId;
    await updateSignup(discordId, picks);
    res.json({ success: true, discordId, picks });
}));

/**
 * GET /api/signup
 * Get signup info for current user
 */
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    const picks = await getRegionPicksByUser(discordId);
    res.json({ picks });
}));

/**
 * GET /api/signup/counts
 * Get aggregate pick counts across all users
 */
router.get('/counts', asyncHandler(async (req: Request, res: Response) => {
    const counts = await getPickCounts();
    res.json({ counts });
}));

/**
 * GET /api/signup/users
 * Get list of all signed up users with their info
 */
router.get('/users', asyncHandler(async (req: Request, res: Response) => {
    const signups = await getAllSignups();
    const discordIds = Array.from(new Set(signups.map(s => s.discord_id)));
    const userTuplesPromises = discordIds.map(async (id) => {
        const user: any = await getDiscordUser(id);
        if (!user || typeof user !== 'object') {
            return {
                id,
                global_name: '',
                username: '',
                avatar: '',
                discriminator: ''
            };
        }
        const userData = user.user_json && typeof user.user_json === 'object' ? user.user_json : user;
        return {
            id: userData.id || id,
            global_name: userData.global_name || '',
            username: userData.username || '',
            avatar: userData.avatar || '',
            discriminator: userData.discriminator || ''
        };
    });
    const userTuples = await Promise.all(userTuplesPromises);
    userTuples.sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: 'base' }));
    res.json({ users: userTuples });
}));

export default router;