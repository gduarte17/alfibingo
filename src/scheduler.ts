import cron from 'node-cron';
import { DAILY_POST_CRON, TZ } from './config';
import { postDaily } from './bot';

export function startScheduler() {
  cron.schedule(DAILY_POST_CRON, async () => {
    try {
      await postDaily();
      // eslint-disable-next-line no-console
      console.log('[cron] postado com sucesso');
    } catch (e) {
      console.error('[cron] falhou:', e);
    }
  }, { timezone: TZ });
}
