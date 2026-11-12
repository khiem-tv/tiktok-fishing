// Logger không cần thư viện ngoài: màu trên console + file theo ngày trong thư mục logs/
const fs = require('fs'), path = require('path'), cfg = require('./config');
const LV = { debug: 0, info: 1, warn: 2, error: 3 };
const COL = { debug: '\x1b[90m', info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' };
const dir = path.join(__dirname, '..', 'logs');
const ts = () => new Date().toLocaleString('sv-SE');           // 2026-11-11 10:00:00

if (cfg.logToFile) {
  fs.mkdirSync(dir, { recursive: true });
  const limit = Date.now() - cfg.logKeepDays * 864e5;           // xoá log cũ hơn LOG_KEEP_DAYS ngày
  for (const f of fs.readdirSync(dir)) { try { const p = path.join(dir, f); if (fs.statSync(p).mtimeMs < limit) fs.unlinkSync(p); } catch {} }
}
function write(level, tag, msg) {
  if (LV[level] < (LV[cfg.logLevel] ?? 1)) return;
  const line = `${ts()} [${level.toUpperCase().padEnd(5)}] [${tag}] ${msg}`;
  console.log(COL[level] + line + '\x1b[0m');
  if (cfg.logToFile) fs.appendFile(path.join(dir, line.slice(0, 10) + '.log'), line + '\n', () => {});
}
const log = {}; for (const l of Object.keys(LV)) log[l] = (tag, msg) => write(l, tag, msg);
log.levels = LV;
module.exports = log;
