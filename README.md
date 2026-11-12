# TikTok Live Fishing 🎣
```
.env / .env.example       ← cấu hình (kênh, cổng, gameplay, âm lượng)
server/   index.js · config.js · tiktok.js
packages/
  graphics/   manifest.js (skin nhân vật, sprite cá) · gfx.js · characters/ · sprites/
  music/      tracks.js (nhạc nền calm/frenzy) · music.js · tracks/ (mp3, ogg)
public/       index.html + js/01..10 (game: loot, state, sfx-tts, logic, fish, update, render, events, main)
```
Log: console có màu + file `logs/YYYY-MM-DD.log` (chỉnh `LOG_LEVEL`, `LOG_TO_FILE`, `LOG_KEEP_DAYS` trong `.env`; sự kiện game ở trình duyệt cũng được gửi về server).

Giá quà (gói free): khi gặp quà lạ, log sẽ in sẵn dòng cần dán vào `server/gifts.json` (`"id": {"name":"Rose","coins":1}`); sửa file là có hiệu lực ngay, không cần restart.

Giằng co (QTE): chỉ Thủy Quái (hoặc đồ troll dính Fake Focus) mới bật camera zoom + đếm ngược 12s + thanh lực kéo; bình luận (từ khoá KEO ×1.5) và tim đẩy lực lên, quà của chủ cần = Giật Điện (thắng ngay), hết giờ = đứt dây. Sự kiện ngoại cảnh mỗi 60-90s (ca-nô, sét, mực); `nemdep` hoặc quà 1 xu = ném dép Top 1. Chỉnh trong `.env` (QTE_*, EVENT_*, FAKE_FOCUS_CHANCE, INK_LIKES).

Spotlight (zoom/MVP/VIP): cá Hiếm/Huyền Thoại hoặc quà lớn → camera zoom 1.8x + vignette + chùm sáng, 3s đấu cá hồi hộp, thẻ MVP 4s, rồi nhân vật lên du thuyền VIP 3 phút (tối đa 3 người). Chỉnh bằng các biến `SPOTLIGHT_*`, `SUSPENSE_SECONDS`, `VIP_SECONDS` trong `.env`; thử nhanh bằng nút 🎬 Spotlight / 💎 Quà lớn trên thanh test.

Avatar: server đọc ảnh ở `profilePicture.urls/url/urlList`, `avatarThumb`, `profilePictureUrl` (v1 & v2, kể cả user lồng 2 lớp); trình duyệt tải trực tiếp không gửi Referer, lỗi thì thử qua `/avatar`, vẫn lỗi thì hiện chữ cái đầu tên.

Chạy: `npm install` → sửa `.env` → `npm start` → http://localhost:3000
OBS (1080x1920): `http://localhost:3000/?transparent=1&mock=0`
Nhạc nền TỰ ĐỘNG: thả file mp3/ogg/wav/m4a vào `packages/music/tracks/` (tên hoặc thư mục chứa chữ `frenzy` = nhạc Bão Cá Vàng, còn lại = nhạc thường). Không cần khai báo, không cần restart (nhận trong ≤15s). Chưa có file → nhạc tự sinh.

Đổi hình: sửa `packages/graphics/manifest.js`. Đổi nhạc: bỏ mp3 vào `packages/music/tracks/` và điền `file` trong `tracks.js`.
