"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadState = loadState;
exports.saveState = saveState;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const statePath = path_1.default.join(process.cwd(), 'data', 'state.json');
function loadState() {
    try {
        const raw = fs_1.default.readFileSync(statePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
function saveState(s) {
    fs_1.default.mkdirSync(path_1.default.dirname(statePath), { recursive: true });
    fs_1.default.writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf-8');
}
//# sourceMappingURL=storage.js.map