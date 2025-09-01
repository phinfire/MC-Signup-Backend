import express from 'express';
import { getAllSignups } from '../db/registrations';
import { getDiscordUser } from '../db/user_db';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const signups = await getAllSignups();
        const discordIds = Array.from(new Set(signups.map(s => s.discord_id)));
        const userTuplesPromises = discordIds.map(async (id) => {
            const user: any = await getDiscordUser(id);
            if (!user || typeof user !== 'object') {
                return {
                    id,
                    global_name: '',
                    username: '',
                    avatar: '',
                    discriminator: ''
                };
            }
            const userData = user.user_json && typeof user.user_json === 'object' ? user.user_json : user;
            return {
                id: userData.id || id,
                global_name: userData.global_name || '',
                username: userData.username || '',
                avatar: userData.avatar || '',
                discriminator: userData.discriminator || ''
            };
        });
        const userTuples = await Promise.all(userTuplesPromises);
        userTuples.sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: 'base' }));
        res.json({ users: userTuples });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch signed up usernames.' });
    }
});

export default router;
