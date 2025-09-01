import express, { Request, Response } from 'express';
import { getAssignmentsForAllSignedUpUsers } from "../../middleware/assignments";
import { requireModeratorAuth } from '../../middleware/auth';

const router = express.Router();


router.get('/', requireModeratorAuth, async (req: Request, res: Response) => {
    try {
        const assignments = await getAssignmentsForAllSignedUpUsers();
        res.json({ assignments });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;