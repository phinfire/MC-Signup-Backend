import pool from './pool';
import { Signup } from '../entities/Signup';

export async function createSignupsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS signups (
            id SERIAL PRIMARY KEY,
            discord_id VARCHAR(32) NOT NULL,
            picks TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export async function getAllSignups(latestOnly: boolean = false): Promise<Signup[]> {
    await createSignupsTable();
    let result;
    if (latestOnly) {
        result = await pool.query(`
            SELECT DISTINCT ON (discord_id) *
            FROM signups
            ORDER BY discord_id, timestamp DESC
        `);
    } else {
        result = await pool.query('SELECT * FROM signups');
    }
    return result.rows.map((row: {
        id: number;
        discord_id: string;
        picks: string;
        timestamp: Date;
    }) => ({
        ...row,
        picks: JSON.parse(row.picks)
    }));
}

export async function updateSignup(userId: string, picks: string[]) {
    const client = await pool.connect();
    await createSignupsTable();
    try {
        await client.query('BEGIN');
        const timestamp = new Date();
        const picksSerialized = JSON.stringify(picks);
        await client.query(
            'INSERT INTO signups (discord_id, picks, timestamp) VALUES ($1, $2, $3)',
            [userId, picksSerialized, timestamp]
        );
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function getPickCounts() {
    await createSignupsTable();
    const result = await pool.query(`
        SELECT DISTINCT ON (discord_id) picks
        FROM signups
        ORDER BY discord_id, timestamp DESC
    `);
    const pickCounts: Record<string, number> = {};
    for (const row of result.rows) {
        const picks: string[] = JSON.parse(row.picks);
        for (const pick of picks) {
            pickCounts[pick] = (pickCounts[pick] || 0) + 1;
        }
    }
    return Object.entries(pickCounts)
        .map(([pick, count]) => ({ pick, count }))
        .sort((a, b) => b.count - a.count);
}

export async function getRegionPicksByUser(userId: string): Promise<string[]> {
    await createSignupsTable();
    const result = await pool.query(
        'SELECT picks FROM signups WHERE discord_id = $1 ORDER BY timestamp DESC LIMIT 1',
        [userId]
    );
    if (result.rows.length === 0) return [];
    return JSON.parse(result.rows[0].picks);
}

export async function removeSignup(userId: string): Promise<boolean> {
    await createSignupsTable();
    const result = await pool.query(
        'DELETE FROM signups WHERE discord_id = $1',
        [userId]
    );
    return (result.rowCount ?? 0) > 0;
}
