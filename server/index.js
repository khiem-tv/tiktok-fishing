const path = require('path'), express = require('express'), http = require('http'), { Server } = require('socket.io');
const cfg = require('./config'), log = require('./logger'), music = require('./music');
const app = express(), srv = http.createServer(app), io = new Server(srv, { cors: { origin: '*' } });

process.on('uncaughtException',  e => log.error('process', e.stack || e));
process.on('unhandledRejection', e => log.error('process', (e && e.stack) || e));

app.get('/config.js', (_, res) => res.type('js').send('window.GAME_CONFIG=' + JSON.stringify(cfg.game) + ';'));
// Proxy ảnh đại diện: tránh lỗi CORS/Referer của CDN TikTok (chỉ cho phép tên miền CDN của TikTok)
const AV = new Map();
app.get('/avatar', async (req, res) => { try {
  const u = new URL(String(req.query.u || ''));
  if (u.protocol !== 'https:' || !/(tiktokcdn|byteoversea|ibyteimg|ibytedtos|muscdn|tiktokv)/i.test(u.hostname)) return res.sendStatus(400);
  let e = AV.get(u.href);
  if (!e) { const r = await fetch(u.href, { signal: AbortSignal.timeout(8000) }); if (!r.ok) return res.sendStatus(502);
    e = { type: r.headers.get('content-type') || 'image/jpeg', buf: Buffer.from(await r.arrayBuffer()) };
    if (AV.size > 300) AV.delete(AV.keys().next().value); AV.set(u.href, e); }
  res.set({ 'Content-Type': e.type, 'Cache-Control': 'public, max-age=3600' }).send(e.buf);
} catch (err) { log.debug('avatar', err.message); res.sendStatus(502); } });
app.get('/api/music', (_, res) => res.set('Cache-Control', 'no-store').json(music.scan()));
app.use('/packages', express.static(path.join(__dirname, '..', 'packages')));
app.use(express.static(path.join(__dirname, '..', 'public')));

io.on('connection', s => {
  log.info('socket', `client vào (${s.handshake.address}) — đang online: ${io.engine.clientsCount}`);
  s.emit('status', io.ttStatus);
  s.on('clientlog', d => { if (d && typeof d.m === 'string') log[log.levels[d.l] !== undefined ? d.l : 'info']('game', d.m); });
  s.on('disconnect', () => log.info('socket', `client rời — đang online: ${io.engine.clientsCount}`));
});

srv.listen(cfg.port, () => {
  log.info('server', `Chạy tại http://localhost:${cfg.port}  (OBS: /?transparent=1&mock=0)`);
  log.info('server', `Log: level=${cfg.logLevel}, file=${cfg.logToFile}, giữ ${cfg.logKeepDays} ngày | cấu hình game: ${JSON.stringify(cfg.game)}`);
  music.watch();
  if (cfg.tiktokUsername) require('./tiktok')(cfg.tiktokUsername, io, cfg.retryMs).catch(e => log.error('tiktok', e.stack || e));
  else io.ttStatus = { state: 'mock', msg: 'Chưa đặt TIKTOK_USERNAME trong .env → chỉ chạy Mock' };
  if (!cfg.tiktokUsername) log.warn('tiktok', 'Chưa đặt TIKTOK_USERNAME trong .env → dùng thanh Mock trên trình duyệt');
});
