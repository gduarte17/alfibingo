import express, { Request, Response } from 'express';
import { bot } from './bot';
import { WEBHOOK_BASE_URL } from './config';

export function createServer() {
  const app = express();

  app.get('/health', (_req: Request, res: Response) => {
    res.send('ok');
  });

  if (WEBHOOK_BASE_URL) {
    const path = '/telegram/webhook';
    // middleware JSON é opcional, mas ajuda se quiser ler body em outras rotas
    app.use(express.json());
    app.use(path, bot.webhookCallback(path));
    bot.telegram.setWebhook(`${WEBHOOK_BASE_URL}${path}`).catch(console.error);
  }

  return app;
}