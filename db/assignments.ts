import pool from './pool';
import { StartAssignment } from '../entities/StartAssignment';

export async function createAssignmentsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS start_assignments (
            discord_id VARCHAR(32) PRIMARY KEY,
            region_key TEXT NOT NULL,
            province_key TEXT
        );
    `);
}

export async function getAllAssignments(): Promise<StartAssignment[]> {
    await createAssignmentsTable();
    const result = await pool.query('SELECT * FROM start_assignments');
    return result.rows.map(row => ({
        discord_id: row.discord_id,
        region_key: row.region_key,
        province_key: row.province_key
    }));
}

function createAssignmentFor(discordId: string, regionKey: string, provinceKey: string | null) {
    return pool.query(
        'INSERT INTO assignments (discord_id, region_key, province_key) VALUES ($1, $2, $3)',
        [discordId, regionKey, provinceKey]
    );
}

function updateAssignedRegion(discordId: string, regionKey: string) {
    return pool.query(
        'UPDATE assignments SET region_key = $1 WHERE discord_id = $2',
        [regionKey, discordId]
    );
}

function deleteAssignment(discordId: string) {
    return pool.query(
        'DELETE FROM assignments WHERE discord_id = $1',
        [discordId]
    );
}