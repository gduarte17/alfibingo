"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const bot_1 = require("./bot");
function startScheduler() {
    node_cron_1.default.schedule(config_1.DAILY_POST_CRON, async () => {
        try {
            await (0, bot_1.postDaily)();
            // eslint-disable-next-line no-console
            console.log('[cron] postado com sucesso');
        }
        catch (e) {
            console.error('[cron] falhou:', e);
        }
    }, { timezone: config_1.TZ });
}
//# sourceMappingURL=scheduler.js.map