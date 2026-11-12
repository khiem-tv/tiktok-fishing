// NHẠC TỰ SINH (dự phòng) — chỉ dùng khi thư mục packages/music/tracks/ chưa có file nhạc nào.
// Nhạc thật: chỉ cần thả file mp3/ogg/wav/m4a vào packages/music/tracks/ (không cần khai báo gì).
const MUSIC_TRACKS = {
  calm:   { scale: [261, 294, 329, 392, 440, 523], octave: 1, wave: 'triangle', stepMs: 430, vol: .04 },
  frenzy: { scale: [261, 329, 392, 523, 659, 784], octave: 2, wave: 'square',   stepMs: 200, vol: .04 }
};
