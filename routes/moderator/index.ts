import express, { Request, Response } from 'express';
import { getAllSignups } from '../../db/registrations';
import { getAssignmentsForAllSignedUpUsers } from '../../middleware/assignments';
import { updateAssignments } from '../../db/assignments';
import { requireModeratorAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = express.Router();

/**
 * GET /api/moderator/signups
 * Get all signups with full details
 */
router.get('/signups', requireModeratorAuth, asyncHandler(async (req: Request, res: Response) => {
    const signups = await getAllSignups(true);
    res.json({ signups });
}));

/**
 * GET /api/moderator/assignments
 * Get all assignments for signed up users
 */
router.get('/assignments', requireModeratorAuth, asyncHandler(async (req: Request, res: Response) => {
    const assignments = await getAssignmentsForAllSignedUpUsers();
    res.json({ assignments });
}));

/**
 * POST /api/moderator/assignments
 * Bulk update assignments
 */
router.post('/assignments', requireModeratorAuth, asyncHandler(async (req: Request, res: Response) => {
    const { assignments } = req.body;
    if (!Array.isArray(assignments) || !assignments.every(a =>
        typeof a.discord_id === 'string' &&
        typeof a.region_key === 'string' &&
        (typeof a.start_key === 'string' || a.start_key === null) &&
        (typeof a.start_data === 'object' || a.start_data === null)
    )) {
        return res.status(400).json({ error: 'Invalid assignments format' });
    }
    await updateAssignments(assignments);
    res.status(200).json({ message: 'Assignments updated successfully' });
}));

export default router;
