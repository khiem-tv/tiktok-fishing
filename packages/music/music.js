// Trình phát nhạc nền tự động: đọc danh sách từ /api/music (server tự quét thư mục tracks/)
// - Phát lần lượt (hoặc xáo trộn) các bài "calm"; vào Bão Cá Vàng thì chuyển sang bài "frenzy" (fade chéo)
// - Chưa có bài frenzy → vẫn phát bài thường nhưng nhanh hơn 15%; chưa có file nào → nhạc tự sinh
// - Thêm/xoá file khi đang chạy: tự cập nhật sau tối đa 15 giây, không cần khởi động lại
const Music = (() => {
  let lib = { calm: [], frenzy: [] }, mode = 'calm', running = false, el = null, last = { calm: '', frenzy: '' }, errs = 0, sig = '';
  const fade = (a, to, ms, done) => { clearInterval(a._f); const from = a.volume, n = Math.max(1, ms / 50); let i = 0;
    a._f = setInterval(() => { i++; a.volume = Math.max(0, Math.min(1, from + (to - from) * i / n));
      if (i >= n) { clearInterval(a._f); done && done(); } }, 50); };
  const list = () => lib[mode].length ? lib[mode] : (mode === 'frenzy' ? lib.calm : []);
  const rate = () => (mode === 'frenzy' && !lib.frenzy.length) ? 1.15 : 1;
  function nextTrack() { const l = list(); if (!l.length) return null; let t;
    if (GC.musicShuffle && l.length > 1) { do t = pick(l); while (t === last[mode]); }
    else t = l[(l.indexOf(last[mode]) + 1) % l.length];
    return last[mode] = t; }
  function stopEl(ms) { const old = el; el = null; if (old) { old.onended = old.onerror = null; fade(old, 0, ms, () => old.pause()); } }
  function play(ms = GC.musicFadeMs) {
    stopEl(ms); const t = nextTrack(); if (!t) return;           // không có file → synth() lo
    const a = el = new Audio(t); a.volume = 0; a.playbackRate = rate(); LOG('♪ ' + decodeURIComponent(t.split('/').pop()));
    a.onended = () => play(800);
    a.onerror = () => { if (el !== a) return; if (++errs > list().length) { LOG('Không phát được file nhạc nào → dùng nhạc tự sinh', 'warn'); stopEl(0); return; } setTimeout(() => play(0), 300); };
    a.onplaying = () => { errs = 0; };
    a.play().then(() => fade(a, GC.musicVolume, ms)).catch(() => {});   // bị chặn autoplay → thử lại khi người dùng bấm
  }
  function synth() { setTimeout(synth, MUSIC_TRACKS[mode].stepMs); const t = MUSIC_TRACKS[mode];
    if (running && !el && !list().length && AC) tone(pick(t.scale) * t.octave, .25, t.wave, t.vol * GC.musicVolume * 3); }
  function refresh() { fetch('/api/music', { cache: 'no-store' }).then(r => r.json()).then(j => {
    const s = JSON.stringify(j); if (s === sig) return; sig = s; lib = j;
    LOG(`Thư viện nhạc: ${j.calm.length} thường, ${j.frenzy.length} frenzy`); errs = 0;
    if (running && (!el || !list().includes(last[mode]))) play(); }).catch(() => {}); }
  refresh(); setInterval(refresh, 15000); synth();
  return {
    start() { if (running) { if (el && el.paused) el.play().catch(() => {}); return; } running = true; play(0); },
    setMode(m) { if (m === mode) return; mode = m; if (running) play(); }
  };
})();
