import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const urlConfig = {
    "100K": process.env.API_URL_100K,
    "1M": process.env.API_URL_1M,
    "2M": process.env.API_URL_2M
};

