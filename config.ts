import dotenv from 'dotenv';
dotenv.config();

export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'https://codingafterdark.de/authentication';
export const PORT = Number(process.env.PORT!);

export const ADMIN_DISCORD_ID = process.env.ADMIN_DISCORD_ID as string;
export const MODERATOR_IDS = (process.env.MODERATOR_IDS?.split(',') || []).map(id => id.trim());

export const allowedOrigins = [
    'http://localhost',
    process.env.ALLOWED_ORIGIN!
];

export const POSTGRES_CONFIG = {
    host: process.env.POSTGRES_HOST || 'db',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
};
