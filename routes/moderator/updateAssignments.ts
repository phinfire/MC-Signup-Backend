import express, { Request, Response } from 'express';
import { getAssignmentsForAllSignedUpUsers, updateAssignments } from "../../middleware/assignments";
import { requireModeratorAuth } from '../../middleware/auth';

const router = express.Router();

router.get('/', requireModeratorAuth, async (req: Request, res: Response) => {
    try {
        const { assignments } = req.body;
        if (!Array.isArray(assignments) || !assignments.every(a =>
            typeof a.discord_id === 'string' &&
            typeof a.region_key === 'string' &&
            (typeof a.province_key === 'string' || a.province_key === null)
        )) {
            return res.status(400).json({ error: 'Invalid assignments format' });
        }
        await updateAssignments(assignments);
        res.status(200).json({ message: 'Assignments updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});
export default router;