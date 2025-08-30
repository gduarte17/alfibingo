import { bot } from './bot';
import { createServer } from './web';
import { startScheduler } from './scheduler';
import { WEBHOOK_BASE_URL } from './config';

const PORT = Number(process.env.PORT || 3000);

async function main() {
  if (!WEBHOOK_BASE_URL) {
    // modo desenvolvimento: long polling
    await bot.launch();
    console.log('Bot em long polling na dev.');
  }
  const app = createServer();
  app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
  await bot.launch();

  startScheduler();

  // graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
