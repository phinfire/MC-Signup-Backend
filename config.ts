import dotenv from 'dotenv';
dotenv.config();

export const CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
export const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
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
