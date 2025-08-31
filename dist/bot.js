"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
exports.postDaily = postDaily;
const telegraf_1 = require("telegraf");
const config_1 = require("./config");
const today_1 = require("./bingo/today");
const image_1 = require("./bingo/image");
exports.bot = new telegraf_1.Telegraf(config_1.BOT_TOKEN);
exports.bot.start((ctx) => ctx.reply('Bem-vindo ao Alfibet! Use /bingo para ver o bingo de hoje.'));
exports.bot.command('bingo', async (ctx) => {
    const { isoDate, items } = (0, today_1.getTodayDraw)(new Date());
    const buf = await (0, image_1.renderCard)(`Alfibet – ${isoDate}`, items);
    await ctx.replyWithPhoto({ source: buf }, { caption: 'Bingo do dia 🎉' });
});
async function postDaily() {
    const { isoDate, items } = (0, today_1.getTodayDraw)(new Date());
    const buf = await (0, image_1.renderCard)(`Alfibet – ${isoDate}`, items);
    await exports.bot.telegram.sendPhoto(config_1.TARGET_CHAT_ID, { source: buf }, { caption: 'Bingo do dia 🎉' });
}
//# sourceMappingURL=bot.js.map