import express from 'express';
import { bot } from './bot';
import { WEBHOOK_BASE_URL } from './config';

export function createServer() {
  const app = express();
  app.get('/health', (_req, res) => res.send('ok'));

  if (WEBHOOK_BASE_URL) {
    const path = '/telegram/webhook';
    app.use(bot.webhookCallback(path));
    // registra webhook ao subir
    bot.telegram.setWebhook(`${WEBHOOK_BASE_URL}${path}`).catch(console.error);
  }

  return app;
}
