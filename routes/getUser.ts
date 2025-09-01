import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDiscordUser } from '../db/user_db';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(400).json({ error: 'Missing user' });
        }
        const discordId = req.user?.discordId;
        if (!discordId) {
            return res.status(400).json({ error: 'Token missing discordId' });
        }
        const user = await getDiscordUser(discordId);
        res.json({ user });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
    }
});

export default router;
