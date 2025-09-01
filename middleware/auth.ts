import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_DISCORD_ID, MODERATOR_IDS } from '../config';

declare global {
    namespace Express {
        interface Request {
            user?: {
                discordId: string;
            };
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.substring(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { discordId: string };
        req.user = { discordId: payload.discordId };
        (req as any).jwtPayload = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    authenticateToken(req, res, () => {
        const discordId = req.user?.discordId;
        if (!discordId || discordId !== ADMIN_DISCORD_ID) {
            return res.status(403).json({ error: 'Forbidden: Invalid discordId' });
        }
        next();
    });
}

export function requireModeratorAuth(req: Request, res: Response, next: NextFunction) {
    authenticateToken(req, res, () => {
        const discordId = req.user?.discordId;
        if (!discordId || (!MODERATOR_IDS.includes(discordId) && discordId !== ADMIN_DISCORD_ID)) {
            return res.status(403).json({ error: 'Forbidden: Invalid discordId' });
        }
        next();
    });
}