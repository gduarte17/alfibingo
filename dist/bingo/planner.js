"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureWeekPlan = ensureWeekPlan;
const options_json_1 = __importDefault(require("./options.json"));
const storage_1 = require("./storage");
function getISOWeekId(d) {
    // ISO week (YYYY-Www)
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
function ensureWeekPlan(today = new Date()) {
    const state = (0, storage_1.loadState)();
    const isoWeekId = getISOWeekId(today);
    if (state.weekPlan?.isoWeekId === isoWeekId)
        return state.weekPlan;
    // 84 slots na semana
    const totalSlots = 84;
    const base = Math.floor(totalSlots / options_json_1.default.length); // 2
    const remainder = totalSlots - base * options_json_1.default.length; // 24
    // quem ganha 1 extra essa semana?
    const indices = [...options_json_1.default.keys()];
    shuffle(indices);
    const withExtra = new Set(indices.slice(0, remainder));
    // cria multiconjunto
    const bag = [];
    options_json_1.default.forEach((opt, i) => {
        for (let k = 0; k < base; k++)
            bag.push(opt);
        if (withExtra.has(i))
            bag.push(opt);
    });
    shuffle(bag);
    // fatiar em 7 dias × 12
    const days = {};
    const monday = startOfISOWeek(today);
    for (let d = 0; d < 7; d++) {
        const cur = new Date(monday);
        cur.setDate(monday.getDate() + d);
        const isoDate = cur.toISOString().slice(0, 10);
        days[isoDate] = draw12Unique(bag);
    }
    state.weekPlan = { isoWeekId, days };
    (0, storage_1.saveState)(state);
    return state.weekPlan;
}
function startOfISOWeek(d) {
    const copy = new Date(d);
    const day = copy.getDay() || 7; // dom=7
    if (day !== 1)
        copy.setDate(copy.getDate() - (day - 1));
    copy.setHours(0, 0, 0, 0);
    return copy;
}
function draw12Unique(bag) {
    const picked = new Set();
    const result = [];
    let guard = 0;
    while (result.length < 12 && bag.length > 0 && guard < 5000) {
        guard++;
        const i = Math.floor(Math.random() * bag.length);
        const [item] = bag.splice(i, 1);
        if (!picked.has(item)) {
            picked.add(item);
            result.push(item);
        }
    }
    // Se, por qualquer motivo, não conseguimos 12 únicos (bag acabou),
    // completa com itens não escolhidos ainda:
    if (result.length < 12) {
        const remaining = options_json_1.default.filter(o => !picked.has(o));
        shuffle(remaining);
        for (const r of remaining) {
            if (result.length < 12)
                result.push(r);
        }
    }
    return result;
}
//# sourceMappingURL=planner.js.map