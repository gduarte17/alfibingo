"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAILY_POST_CRON = exports.TZ = exports.TARGET_CHAT_ID = exports.WEBHOOK_BASE_URL = exports.BOT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || '';
exports.TARGET_CHAT_ID = process.env.TELEGRAM_TARGET_CHAT_ID;
exports.TZ = process.env.TZ || 'America/Sao_Paulo';
exports.DAILY_POST_CRON = process.env.DAILY_POST_CRON || '0 9 * * *';
if (!exports.BOT_TOKEN)
    throw new Error('BOT_TOKEN não definido');
if (!exports.TARGET_CHAT_ID)
    throw new Error('TELEGRAM_TARGET_CHAT_ID não definido');
//# sourceMappingURL=config.js.map