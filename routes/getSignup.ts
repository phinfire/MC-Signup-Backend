import express, { Request, Response } from 'express';
import { getRegionPicksByUser } from '../db/registrations';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const discordId = req.user!.discordId;
    try {
        const picks = await getRegionPicksByUser(discordId);
        res.json({ picks });
    } catch (err) {
        return res.status(500).json({ error: 'Internal error', details: err instanceof Error ? err.message : err });
    }
});

export default router;
