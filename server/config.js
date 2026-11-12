const fs = require('fs'), P = require('path');
const envF = P.join(__dirname, '..', '.env'), tplF = envF + '.example';   // chưa có .env → tự tạo từ mẫu (không bao giờ ghi đè .env có sẵn)
if (!fs.existsSync(envF) && fs.existsSync(tplF)) { fs.copyFileSync(tplF, envF); console.log('Đã tạo .env từ .env.example — hãy điền TIKTOK_USERNAME'); }
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const num = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? Number(process.env[k]) : d);
module.exports = {
  port: num('PORT', 3000),
  tiktokUsername: (process.env.TIKTOK_USERNAME || '').trim().replace(/^@/, ''),
  extendedGifts: process.env.EXTENDED_GIFT_INFO === 'true',
  unknownGiftCoins: num('UNKNOWN_GIFT_COINS', 1),
  signApiKey: (process.env.SIGN_API_KEY || process.env.EULER_API_KEY || '').trim(),
  logLevel: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  logToFile: process.env.LOG_TO_FILE !== 'false',
  logKeepDays: num('LOG_KEEP_DAYS', 7),
  retryMs: num('RETRY_MS', 10000),
  game: {                       // gửi xuống frontend qua /config.js
    maxFishers: num('MAX_FISHERS', 36), frenzySeconds: num('FRENZY_SECONDS', 45), frenzyCooldown: num('FRENZY_COOLDOWN_SECONDS', 90),
    bigGiftCoins: num('BIG_GIFT_COINS', 50), giftKeepSeconds: num('GIFT_KEEP_SECONDS', 25),
    chatEnergy: num('CHAT_ENERGY', 0.6), likeEnergy: num('LIKE_ENERGY', .1),
    spotlight: process.env.SPOTLIGHT_ENABLED !== 'false', spotZoom: num('SPOTLIGHT_ZOOM', 1.8), spotCooldown: num('SPOTLIGHT_COOLDOWN', 6), qteSeconds: num('QTE_SECONDS', 12), qteStart: num('QTE_START', 35), qteDecay: num('QTE_DECAY', 3.5), qtePush: num('QTE_PUSH', 7), qtePushOwner: num('QTE_PUSH_OWNER', 12), qteLike: num('QTE_LIKE', 1),
    fakeFocusChance: num('FAKE_FOCUS_CHANCE', .6), eventMin: num('EVENT_MIN_SECONDS', 60), eventMax: num('EVENT_MAX_SECONDS', 90), inkLikes: num('INK_LIKES', 60),
    vipSeconds: num('VIP_SECONDS', 180), spotMinTier: (process.env.SPOTLIGHT_MIN_TIER || 'rare').toLowerCase(),
    debug: process.env.CLIENT_DEBUG === 'true',
    tts: process.env.TTS_ENABLED !== 'false', ttsLang: process.env.TTS_LANG || 'vi-VN',
    sfxVolume: num('SFX_VOLUME', .5), musicVolume: num('MUSIC_VOLUME', .35),
    musicShuffle: process.env.MUSIC_SHUFFLE !== 'false', musicFadeMs: num('MUSIC_FADE_MS', 1500)
  }
};
