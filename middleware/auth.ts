import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_DISCORD_ID, MODERATOR_IDS, AUTH_SERVICE_URL } from '../config';

declare global {
    namespace Express {
        interface Request {
            user?: {
                discordId: string;
            };
        }
    }
}

let cachedPublicKey: string | null = null;
let publicKeyFetchTime: number = 0;
const PUBLIC_KEY_CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getPublicKey(): Promise<string> {
    const now = Date.now();
    if (cachedPublicKey && (now - publicKeyFetchTime) < PUBLIC_KEY_CACHE_TTL) {
        return cachedPublicKey;
    }

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/public-key`);
        if (!response.ok) {
            throw new Error(`Failed to fetch public key: ${response.statusText}`);
        }
        const data = await response.json() as { public_key: string };
        cachedPublicKey = data.public_key;
        publicKeyFetchTime = now;
        return cachedPublicKey;
    } catch (err) {
        if (cachedPublicKey) {
            console.warn('Failed to refresh public key, using cached version');
            return cachedPublicKey;
        }
        throw err;
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.substring(7);
    try {
        const publicKey = await getPublicKey();
        const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { discordId: string };
        req.user = { discordId: payload.discordId };
        (req as any).jwtPayload = payload;
        next();
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return res.status(401).json({ error: "Invalid token: " + errorMsg });
    }
};


export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    authenticateToken(req, res, () => {
        const discordId = req.user?.discordId;
        if (!discordId || discordId !== ADMIN_DISCORD_ID) {
            return res.status(403).json({ error: 'Forbidden: Invalid discordId (' + discordId + ') is not admin' });
        }
        next();
    });
}

export function requireModeratorAuth(req: Request, res: Response, next: NextFunction) {
    authenticateToken(req, res, () => {
        console.log('Moderator access to', req.path, "with discordId", req.user?.discordId);
        const discordId = req.user?.discordId;
        if (!discordId || (!MODERATOR_IDS.includes(discordId) && discordId !== ADMIN_DISCORD_ID)) {
            return res.status(403).json({ error: 'Forbidden: Invalid discordId (' + discordId + ') neither admin nor moderator' });
        }
        next();
    });
}