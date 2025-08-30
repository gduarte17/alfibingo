import { Telegraf } from 'telegraf';
import { BOT_TOKEN, TARGET_CHAT_ID } from './config';
import { getTodayDraw } from './bingo/today';
import { renderCard } from './bingo/image';

export const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bem-vindo ao Alfibet! Use /bingo para ver o bingo de hoje.'));
bot.command('bingo', async (ctx) => {
  const { isoDate, items } = getTodayDraw(new Date());
  const buf = await renderCard(`Alfibet – ${isoDate}`, items!);
  await ctx.replyWithPhoto({ source: buf }, { caption: 'Bingo do dia 🎉' });
});

export async function postDaily() {
  const { isoDate, items } = getTodayDraw(new Date());
  const buf = await renderCard(`Alfibet – ${isoDate}`, items!);
  await bot.telegram.sendPhoto(TARGET_CHAT_ID, { source: buf }, { caption: 'Bingo do dia 🎉' });
}
