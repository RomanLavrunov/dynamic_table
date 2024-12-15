import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    server: process.env.SERVER_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};