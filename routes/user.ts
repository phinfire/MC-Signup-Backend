import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAssignmentForUser } from '../middleware/assignments';
import { setStartingPosition } from '../db/assignments';
import { getDiscordUser } from '../db/user_db';
import { getRegionPicksByUser } from '../db/registrations';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

/**
 * GET /api/user
 * Get current authenticated user profile
 */
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(400).json({ error: 'Missing user' });
    }
    const discordId = req.user.discordId;
    if (!discordId) {
        return res.status(400).json({ error: 'Token missing discordId' });
    }
    const user = await getDiscordUser(discordId);
    res.json({ user });
}));

/**
 * GET /api/user/assignment
 * Get my current assignment
 */
router.get('/assignment', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    const picks = await getAssignmentForUser(discordId);
    const assignment = await getAssignmentForUser(discordId);
    if (!picks) {
        return res.status(400).json({ error: 'No picks found for user.' });
    }
    if (!assignment) {
        return res.status(204).json({ error: 'No assignment found for user.' });
    }
    res.json({ assignment });
}));

/**
 * POST /api/user/startingPosition
 * Set my starting position for assignment
 */
router.post('/startingPosition', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    const picks = await getRegionPicksByUser(discordId);
    if (picks.length === 0) {
        return res.status(400).json({ error: 'User has not signed up yet.' });
    }
    const { start_key, start_data } = req.body;
    if (!start_key || !start_data) {
        return res.status(400).json({ error: 'start_key and start_data are required.' });
    }
    await setStartingPosition(discordId, start_key, start_data);
    res.status(200).json({ message: 'Starting position set successfully.' });
}));

export default router;
