import 'dotenv/config';
import { postDaily } from '../bot';

postDaily()
  .then(() => {
    console.log('[cron-job] enviado com sucesso');
    process.exit(0);
  })
  .catch((e) => {
    console.error('[cron-job] falhou:', e);
    process.exit(1);
  });
