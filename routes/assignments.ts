import express, { Request, Response } from 'express';
import { getAllAssignments } from '../db/assignments';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

/**
 * GET /api/assignments
 * Get all assignments for a campaign (public access)
 * Query params:
 *   - campaignId: Filter assignments for a specific campaign (optional)
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const { campaignId } = req.query;

    const assignments = await getAllAssignments();

    if (assignments.length === 0) {
        return res.status(204).send();
    }

    // TODO: When campaigns are linked to assignments, filter by campaignId
    // For now, just return all assignments
    res.json({ assignments });
}));

export default router;
