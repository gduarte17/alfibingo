"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const web_1 = require("./web");
const scheduler_1 = require("./scheduler");
const config_1 = require("./config");
const PORT = Number(process.env.PORT || 3000);
async function main() {
    if (!config_1.WEBHOOK_BASE_URL) {
        // modo desenvolvimento: long polling
        await bot_1.bot.launch();
        console.log('Bot em long polling na dev.');
    }
    const app = (0, web_1.createServer)();
    app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
    await bot_1.bot.launch();
    (0, scheduler_1.startScheduler)();
    // graceful stop
    process.once('SIGINT', () => bot_1.bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot_1.bot.stop('SIGTERM'));
}
main();
//# sourceMappingURL=index.js.map