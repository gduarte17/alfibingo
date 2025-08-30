import fs from 'fs';
import path from 'path';

const statePath = path.join(process.cwd(), 'data', 'state.json');

type WeekPlan = {
  isoWeekId: string;                 // ex: "2025-W35"
  days: Record<string, string[]>;    // "2025-08-30": ["Opção", ... 12 itens]
};

type State = {
  weekPlan?: WeekPlan;
  history?: Record<string, string[]>; // histórico diário (data ISO -> 12 itens)
};

export function loadState(): State {
  try {
    const raw = fs.readFileSync(statePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveState(s: State) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf-8');
}
