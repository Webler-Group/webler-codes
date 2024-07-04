import { configDotenv } from 'dotenv';

configDotenv();

export const NODE_ENV = process.env.NODE_ENV;

export const BACKEND_PORT = process.env.BACKEND_PORT as unknown as number;

export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT as number | undefined;
export const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const API_PREFIX = '/api';

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const LOG_DIR = process.env.LOG_DIR || 'logs';