import express, { Request, Response } from 'express';
import { removeSignup as removeSignupFromDb } from '../../db/registrations';
import { removeAssignment } from '../../db/assignments';
import { requireAdminAuth } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = express.Router();

/**
 * DELETE /api/admin/signups/:discordId
 * Remove a signup and associated assignment (admin only)
 */
router.delete('/:discordId', requireAdminAuth, asyncHandler(async (req: Request, res: Response) => {
    const { discordId } = req.params;
    if (!discordId) {
        return res.status(400).json({ error: 'Missing discordId' });
    }
    if (typeof discordId !== 'string') {
        return res.status(400).json({ error: 'discordId must be a string' });
    }
    const removed = await removeSignupFromDb(discordId);
    if (removed) {
        await removeAssignment(discordId);
        res.json({ success: true, message: 'Signup and associated assignment removed successfully' });
    } else {
        res.status(404).json({ error: 'No signup found for the specified discordId' });
    }
}));

export default router;