"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDraw = getTodayDraw;
const planner_1 = require("./planner");
const storage_1 = require("./storage");
function getTodayDraw(date = new Date()) {
    const isoDate = new Date(date).toISOString().slice(0, 10);
    const plan = (0, planner_1.ensureWeekPlan)(date);
    const items = plan.days[isoDate];
    // salva no histórico
    const state = (0, storage_1.loadState)();
    state.history = state.history || {};
    state.history[isoDate] = items;
    (0, storage_1.saveState)(state);
    return { isoDate, items };
}
//# sourceMappingURL=today.js.map