import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const db_url = process.env.DB_URL;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expires_in = process.env.JWT_EXPIRES_IN;

export const config = {
    PORT: port,
    DB_URL: db_url,
    JWT_SECRET: jwt_secret,
    JWT_EXPIRES_IN: jwt_expires_in,
};