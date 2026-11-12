// Tự quét packages/music/tracks/: mọi file nhạc thêm vào đều được game tự nhận.
// Quy ước: đường dẫn (tên file hoặc tên thư mục) có chữ "frenzy" → nhạc Bão Cá Vàng; còn lại → nhạc thường.
const fs = require('fs'), path = require('path'), log = require('./logger');
const DIR = path.join(__dirname, '..', 'packages', 'music', 'tracks'), EXT = /\.(mp3|ogg|wav|m4a|aac|flac)$/i;
const url = rel => '/packages/music/tracks/' + rel.split('/').map(encodeURIComponent).join('/');
function scan() {
  const out = { calm: [], frenzy: [] };
  const walk = (d, rel = '') => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walk(path.join(d, e.name), r);
    else if (EXT.test(e.name)) (/frenzy/i.test(r) ? out.frenzy : out.calm).push(url(r)); } };
  try { walk(DIR); } catch {}
  out.calm.sort(); out.frenzy.sort(); return out;
}
function watch() {
  let sig = '';
  const check = () => { const m = scan(), s = JSON.stringify(m);
    if (s !== sig) { sig = s; log.info('music', `Thư viện nhạc: ${m.calm.length} bài thường, ${m.frenzy.length} bài Bão Cá Vàng`);
      if (!m.calm.length && !m.frenzy.length) log.warn('music', 'Chưa có file nhạc trong packages/music/tracks/ → dùng nhạc tự sinh'); } };
  check(); setInterval(check, 10000).unref();
}
module.exports = { scan, watch };
