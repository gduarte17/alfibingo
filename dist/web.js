"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const bot_1 = require("./bot");
const config_1 = require("./config");
function createServer() {
    const app = (0, express_1.default)();
    app.get('/health', (_req, res) => {
        res.send('ok');
    });
    if (config_1.WEBHOOK_BASE_URL) {
        const path = '/telegram/webhook';
        // middleware JSON é opcional, mas ajuda se quiser ler body em outras rotas
        app.use(express_1.default.json());
        app.use(path, bot_1.bot.webhookCallback(path));
        bot_1.bot.telegram.setWebhook(`${config_1.WEBHOOK_BASE_URL}${path}`).catch(console.error);
    }
    return app;
}
//# sourceMappingURL=web.js.map