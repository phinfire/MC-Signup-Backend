import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { createSignupsTable } from '../db/registrations';
import { AUTH_SERVICE_URL, ADMIN_DISCORD_ID, MODERATOR_IDS } from '../config';

const router = express.Router();

type UserRole = 'admin' | 'moderator' | 'user';

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

async function getUserRole(authHeader?: string): Promise<UserRole | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const publicKey = await getPublicKey();
        const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { discordId: string };
        const discordId = payload.discordId;
        if (discordId === ADMIN_DISCORD_ID) {
            return 'admin';
        }
        if (MODERATOR_IDS.includes(discordId)) {
            return 'moderator';
        }
        return 'user';
    } catch {
        return null;
    }
}

router.get('/', async (req: Request, res: Response) => {
    let db_up = false;
    let num_signups = 0;
    try {
        await createSignupsTable();
        const client = await pool.connect();
        const result = await client.query('SELECT COUNT(*) FROM signups');
        num_signups = parseInt(result.rows[0].count, 10);
        client.release();
        db_up = true;
    } catch {
        db_up = false;
    }

    const authHeader = req.headers.authorization;
    const userRole = await getUserRole(authHeader);

    const response: any = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        db_up,
        num_signups
    };
    response.user_role = userRole;

    res.status(200).json(response);
});

export default router;