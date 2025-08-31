type WeekPlan = {
    isoWeekId: string;
    days: Record<string, string[]>;
};
type State = {
    weekPlan?: WeekPlan;
    history?: Record<string, string[]>;
};
export declare function loadState(): State;
export declare function saveState(s: State): void;
export {};
//# sourceMappingURL=storage.d.ts.map