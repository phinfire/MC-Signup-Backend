import { getAllAssignments } from '../db/assignments';
import pool from '../db/pool';
import { getAllSignups } from '../db/registrations';
import { StartAssignment } from '../entities/StartAssignment';

export async function getAssignmentsForAllSignedUpUsers() {
    const allSignups = await getAllSignups();
    const allAssignments = await getAllAssignments();

    const result: { discord_id: string; region_key: string | null; province_key: string | null }[] = [];
    for (const signup of allSignups) {
        const userAssignments = allAssignments.filter(assignment => assignment.discord_id === signup.discord_id);
        if (userAssignments.length) {
            const assignment = userAssignments[0];
            result.push({
                discord_id: signup.discord_id,
                region_key: assignment.region_key,
                province_key: assignment.province_key,
            });
        } else {
            result.push({
                discord_id: signup.discord_id,
                region_key: null,
                province_key: null
            });
        }
    }
    return result;
}

export async function getAssignmentsForUser(discordId: string) {
    const allAssignments = await getAllAssignments();
    return allAssignments.filter(assignment => assignment.discord_id === discordId);
}

export async function updateAssignments(assignments: StartAssignment[]) {
    for (const assignment of assignments) {
        await pool.query(
            `INSERT INTO start_assignments (discord_id, region_key, province_key)
             VALUES ($1, $2, $3)
             ON CONFLICT (discord_id)
             DO UPDATE SET region_key = EXCLUDED.region_key, province_key = EXCLUDED.province_key`,
            [assignment.discord_id, assignment.region_key, assignment.province_key]
        );
    }
}