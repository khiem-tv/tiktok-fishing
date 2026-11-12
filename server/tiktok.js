// Gói kết nối TikTok LIVE → phát sự kiện chuẩn hoá qua Socket.io (tương thích v1 & v2)
const fs = require('fs'), path = require('path'), log = require('./logger'), cfg = require('./config');
// Chuẩn hoá người dùng (học từ project village): v1 phẳng, v2 lồng d.user, có bản lồng thêm lớp; ảnh ở profilePicture.urls (v2) / .url / .urlList
const ID_KEYS = ['uniqueId', 'userId', 'secUid', 'displayId', 'id', 'nickname'];
const okv = v => v !== undefined && v !== null && v !== '' && v !== 0 && v !== '0';
const hasId = o => o && typeof o === 'object' && ID_KEYS.some(k => okv(o[k]));
let warnedId = false, warnedAv = false;
const user = d => {
  const x = [d && d.user, d && d.user && d.user.user, d && d.userInfo, d].find(hasId) || {};
  const pp = x.profilePicture || x.avatarThumb || x.avatarMedium || {};
  const img = x.profilePictureUrl || (Array.isArray(pp.urls) && pp.urls[0]) || (Array.isArray(pp.url) && pp.url[0]) || (Array.isArray(pp.urlList) && pp.urlList[0]) || (typeof pp === 'string' ? pp : '') || '';
  let id = ''; for (const k of ID_KEYS) if (okv(x[k])) { id = String(x[k]); break; }
  const L = require('./logger');
  if (!id && !warnedId) { warnedId = true; L.warn('tiktok', 'Không đọc được ID người dùng. Trường nhận được: ' + Object.keys(d || {}).join(',') + ' | user: ' + (d && d.user ? Object.keys(d.user).join(',') : '—')); }
  if (!img && !warnedAv) { warnedAv = true; L.warn('tiktok', 'Không đọc được ảnh đại diện (game dùng chữ cái đầu). Trường user: ' + Object.keys(x).join(',')); }
  return { id: id || 'anon' + Math.random().toString(36).slice(2, 7), name: x.nickname || x.uniqueId || 'Ẩn danh', img };
};
const hint = m => /business plan|requires a/i.test(m) ? 'Tính năng này cần gói trả phí của Euler Stream → để EXTENDED_GIFT_INFO=false trong .env'
  : /offline|not.?live|UserOffline/i.test(m) ? 'Kênh KHÔNG đang LIVE hoặc sai tên kênh (điền không có @, đúng chữ trong link tiktok.com/@tenkenh/live)'
  : /sign|api.?key|401|403|429|rate|euler/i.test(m) ? 'Lỗi máy chủ ký (Euler Stream): thử đặt/đổi SIGN_API_KEY trong .env, hoặc đợi vài phút nếu bị giới hạn lượt'
  : /ENOTFOUND|ECONN|ETIMEDOUT|EAI_AGAIN|network|socket hang/i.test(m) ? 'Lỗi mạng: kiểm tra Internet / VPN / tường lửa' : '';
// Bảng giá quà tự khai báo (khi không có gói trả phí): server/gifts.json  { "id": { "name": "...", "coins": N } }
const GIFTS = path.join(__dirname, 'gifts.json');
const giftTable = () => { try { return JSON.parse(fs.readFileSync(GIFTS, 'utf8')); } catch { return {}; } };

module.exports = async function startTikTok(username, io, retryMs) {
  let TL; try { TL = await import('tiktok-live-connector'); } catch (e) { return log.error('tiktok', 'Không nạp được tiktok-live-connector (chạy: npm install): ' + e.message); }
  if (!TL.TikTokLiveConnection && !TL.WebcastPushConnection && TL.default) TL = TL.default;
  const Conn = TL.TikTokLiveConnection || TL.WebcastPushConnection;
  if (!Conn) return log.error('tiktok', 'Không tìm thấy lớp kết nối. Export hiện có: ' + Object.keys(TL).join(','));
  const E = TL.WebcastEvent || {}, C = TL.ControlEvent || {};
  const st = { chat: 0, like: 0, gift: 0, coins: 0, follow: 0 }, seen = {}, streak = new Map(), unknown = new Set();
  let dumped = 0, total = 0, tries = 0, timer = null;
  const status = (state, msg) => { io.ttStatus = { state, msg, user: username }; io.emit('status', io.ttStatus); };
  setInterval(() => { log.info('stats', `1 phút qua: ${st.chat} chat, ${st.like} tim, ${st.follow} follow, ${st.gift} quà (${st.coins} xu) | client: ${io.engine.clientsCount}`);
    for (const k in st) st[k] = 0; }, 60000).unref();
  const out = (ev, payload) => { total++; if (!seen[ev]) { seen[ev] = 1; log.info('tiktok', `Nhận sự kiện "${ev}" đầu tiên từ ${payload.name || '?'} ✔`); } io.emit(ev, payload); if (total <= 3) log.info('tiktok', `Mẫu dữ liệu #${total}: ${ev} ${JSON.stringify(payload).slice(0, 220)}`); };

  function onGift(d) {
    const gd = d.giftDetails || d.gift || {}, u = user(d), n = d.repeatCount || 1, gid = d.giftId || gd.id || gd.giftId;
    const tbl = giftTable()[gid] || {};
    const name = gd.giftName || gd.name || d.giftName || (d.gift && d.gift.name) || tbl.name || ('quà #' + (gid || '?'));
    const raw = gd.diamondCount ?? gd.diamond_count ?? d.diamondCount ?? (d.extendedGiftInfo && d.extendedGiftInfo.diamond_count), per = raw ?? tbl.coins ?? cfg.unknownGiftCoins;
    if (raw === undefined && tbl.coins === undefined && !unknown.has(gid)) {
      unknown.add(gid);
      log.warn('gift', `Chưa biết giá quà id=${gid} (${name}) → tạm tính ${cfg.unknownGiftCoins} xu. Thêm vào server/gifts.json: "${gid}": { "name": "${name}", "coins": GIÁ }`);
      if (!dumped) { dumped = 1; log.warn('gift', 'Dữ liệu quà thô (để dò trường): ' + JSON.stringify(d, (k, v) => k === 'user' ? undefined : v).slice(0, 400)); } }
    // Chống tính trùng quà liên hoàn (streak): chỉ tính phần tăng thêm của mỗi nhóm
    let delta = n;
    if (d.groupId) { const key = u.id + ':' + d.groupId, prev = streak.get(key) || 0; delta = Math.max(0, n - prev);
      if (d.repeatEnd) streak.delete(key); else streak.set(key, n); if (streak.size > 500) streak.clear(); }
    else if ((d.giftType ?? gd.giftType) === 1 && !d.repeatEnd) return;
    if (!delta) return;
    const coins = per * delta; st.gift++; st.coins += coins;
    log.info('gift', `${u.name} tặng ${name} x${delta} = ${coins} xu`);
    out('gift', { ...u, coins, giftName: name, comment: d.comment || '' });
  }

  const again = msg => { tries++; const h = hint(String(msg));
    log.error('tiktok', `${msg} — thử lại lần ${tries} sau ${retryMs / 1000}s`); if (h) log.warn('tiktok', '👉 ' + h);
    status('error', (h || String(msg)).slice(0, 160)); setTimeout(run, retryMs); };
  const run = () => {
    let c; clearTimeout(timer);
    log.info('tiktok', `Đang kết nối @${username}${cfg.signApiKey ? ' (có SIGN_API_KEY)' : ''}${cfg.extendedGifts ? ' (extended gift info)' : ''}...`); status('connecting', 'Đang kết nối @' + username);
    try { c = new Conn(username, { processInitialData: true, enableExtendedGiftInfo: cfg.extendedGifts, ...(cfg.signApiKey ? { signApiKey: cfg.signApiKey } : {}) }); }
    catch (e) { return again(e.message || e); }
    c.on(E.CHAT || 'chat', d => { st.chat++; const u = user(d); log.debug('chat', `${u.name}: ${d.comment}`); out('chat', { ...u, comment: d.comment }); });
    c.on(E.LIKE || 'like', d => { st.like += d.likeCount || 1; out('like', { ...user(d), count: d.likeCount || 1 }); });
    c.on(E.FOLLOW || 'follow', d => { st.follow++; const u = user(d); log.info('follow', u.name); out('follow', u); });
    c.on(E.GIFT || 'gift', onGift);
    c.on(C.DISCONNECTED || 'disconnected', () => { log.warn('tiktok', 'Mất kết nối, thử lại sau 5s'); status('error', 'Mất kết nối'); setTimeout(run, 5000); });
    c.on(C.ERROR || 'error', e => log.warn('tiktok', (e && (e.message || e.info)) || e));
    Promise.resolve().then(() => c.connect()).then(state => {
      tries = 0; log.info('tiktok', `✅ Đã kết nối LIVE @${username}${state && state.roomId ? ' (room ' + state.roomId + ')' : ''}`);
      status('connected', 'Đã kết nối @' + username); total = 0;
      timer = setTimeout(() => { if (!total) log.warn('tiktok', '⚠️ Đã kết nối 45s nhưng chưa nhận sự kiện nào — hãy thử bình luận/thả tim vào live (người xem khác, không phải chính bạn) và đặt LOG_LEVEL=debug'); }, 45000);
    }).catch(e => again(e.message || e));
  };
  run();
};
