import { Telegraf } from 'telegraf';
import { BOT_TOKEN, TARGET_CHAT_ID } from './config';
import { getTodayDraw } from './bingo/today';
import { renderCard } from './bingo/image';
import path from 'path';

export const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bem-vindo ao Alfibet! Use /bingo para ver o bingo de hoje.'));

bot.command('bingo', async (ctx) => {
  const { isoDate, items } = getTodayDraw(new Date());

  const buf = await renderCard({
    title: `Alfibet — ${isoDate}`,
    items,
    cols: 4,
    rows: 3,
    theme: 'dark', // ou 'light'
    logoPath: path.join(process.cwd(), 'assets', 'logo.png'), // opcional
    footerText: '@alfibet' // opcional
  });

  await ctx.replyWithPhoto({ source: buf }, { caption: 'Bingo do dia 🎉' });
});

export async function postDaily() {
  const { isoDate, items } = getTodayDraw(new Date());

  const buf = await renderCard({
    title: `Alfibet — ${isoDate}`,
    items,
    cols: 4,
    rows: 3,
    theme: 'dark'
  });

  await bot.telegram.sendPhoto(TARGET_CHAT_ID, { source: buf }, { caption: 'Bingo do dia 🎉' });
}
