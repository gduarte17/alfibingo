import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || '';
export const TARGET_CHAT_ID = process.env.TELEGRAM_TARGET_CHAT_ID!;
export const TZ = process.env.TZ || 'America/Sao_Paulo';
export const DAILY_POST_CRON = process.env.DAILY_POST_CRON || '0 9 * * *';

if (!BOT_TOKEN) throw new Error('BOT_TOKEN não definido');
if (!TARGET_CHAT_ID) throw new Error('TELEGRAM_TARGET_CHAT_ID não definido');
