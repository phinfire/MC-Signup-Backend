import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { getAssignmentForUser } from '../../middleware/assignments';
import { setStartingPosition } from '../../db/assignments';
import { getRegionPicksByUser } from '../../db/registrations';

const router = express.Router();


router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    const picks = await getRegionPicksByUser(discordId);
    if (picks.length === 0) {
        return res.status(400).json({ error: 'User has not signed up yet.' });
    }
    const { start_key, start_data } = req.body;
    if (!start_key || !start_data) {
        return res.status(400).json({ error: 'start_key and start_data are required.' });
    }
    try {
        await setStartingPosition(discordId, start_key, start_data);
        return res.status(200).json({ message: 'Starting position set successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to set starting position.' });
    }
});

export default router;