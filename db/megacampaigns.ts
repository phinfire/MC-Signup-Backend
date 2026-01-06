import pool from './pool';

export interface MegaCampaign {
    id: string;
    name: string;
    regionDeadlineDate: string;
    startDeadlineDate: string;
    firstSessionDate: string;
    firstEu4Session: string | null;
    ck3SaveFiles?: string;
    eu4SaveFiles?: string;
    vic3SaveFiles?: string;
    createdAt?: string;
}

export async function createMegacampaignsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS megacampaigns (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            region_deadline_date TIMESTAMP NOT NULL,
            start_deadline_date TIMESTAMP NOT NULL,
            first_session_date TIMESTAMP NOT NULL,
            first_eu4_session TIMESTAMP,
            ck3_save_files TEXT,
            eu4_save_files TEXT,
            vic3_save_files TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await pool.query(`ALTER TABLE megacampaigns ADD COLUMN IF NOT EXISTS ck3_save_files TEXT`);
    await pool.query(`ALTER TABLE megacampaigns ADD COLUMN IF NOT EXISTS eu4_save_files TEXT`);
    await pool.query(`ALTER TABLE megacampaigns ADD COLUMN IF NOT EXISTS vic3_save_files TEXT`);
}

export async function getAllMegacampaigns(): Promise<MegaCampaign[]> {
    await createMegacampaignsTable();
    const result = await pool.query('SELECT * FROM megacampaigns ORDER BY created_at DESC');
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        regionDeadlineDate: row.region_deadline_date,
        startDeadlineDate: row.start_deadline_date,
        firstSessionDate: row.first_session_date,
        firstEu4Session: row.first_eu4_session,
        ck3SaveFiles: row.ck3_save_files,
        eu4SaveFiles: row.eu4_save_files,
        vic3SaveFiles: row.vic3_save_files,
        createdAt: row.created_at
    }));
}

export async function getMegacampaignById(id: string): Promise<MegaCampaign | null> {
    await createMegacampaignsTable();
    const result = await pool.query('SELECT * FROM megacampaigns WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        regionDeadlineDate: row.region_deadline_date,
        startDeadlineDate: row.start_deadline_date,
        firstSessionDate: row.first_session_date,
        firstEu4Session: row.first_eu4_session,
        ck3SaveFiles: row.ck3_save_files,
        eu4SaveFiles: row.eu4_save_files,
        vic3SaveFiles: row.vic3_save_files,
        createdAt: row.created_at
    };
}

export async function createMegacampaign(campaign: MegaCampaign): Promise<MegaCampaign> {
    await createMegacampaignsTable();
    const result = await pool.query(
        `INSERT INTO megacampaigns (id, name, region_deadline_date, start_deadline_date, first_session_date, first_eu4_session, ck3_save_files, eu4_save_files, vic3_save_files)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
            campaign.id,
            campaign.name,
            campaign.regionDeadlineDate,
            campaign.startDeadlineDate,
            campaign.firstSessionDate,
            campaign.firstEu4Session,
            campaign.ck3SaveFiles,
            campaign.eu4SaveFiles,
            campaign.vic3SaveFiles
        ]
    );
    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        regionDeadlineDate: row.region_deadline_date,
        startDeadlineDate: row.start_deadline_date,
        firstSessionDate: row.first_session_date,
        firstEu4Session: row.first_eu4_session,
        ck3SaveFiles: row.ck3_save_files,
        eu4SaveFiles: row.eu4_save_files,
        vic3SaveFiles: row.vic3_save_files,
        createdAt: row.created_at
    };
}

export async function deleteMegacampaign(id: string): Promise<boolean> {
    await createMegacampaignsTable();
    const result = await pool.query('DELETE FROM megacampaigns WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
}
