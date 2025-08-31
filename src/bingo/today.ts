import { ensureWeekPlan } from './planner';
import { loadState, saveState } from './storage';

export function getTodayDraw(date = new Date()): { isoDate: string; items: string[] } {
  const isoDate = new Date(date).toISOString().slice(0, 10);
  const plan = ensureWeekPlan(date);
  const items = plan.days[isoDate] ?? []; // fallback evita undefined

  const state = loadState();
  state.history = state.history || {};
  state.history[isoDate] = items;
  saveState(state);

  return { isoDate, items };
}
