// GÓI ĐỒ HỌA — chỉnh file này để thay hình nhân vật / cá. Bỏ ảnh PNG vào thư mục tương ứng.
const GRAPHICS = {
  // Skin nhân vật: chọn theo tên người xem. sprite = PNG (vd '/packages/graphics/characters/pirate.png'), để '' dùng nhân vật vẽ sẵn
  characters: [
    { id: 'fisher', color: '#2f7ddb', hat: '👒', sprite: '' },
    { id: 'pirate', color: '#7a2f2f', hat: '🎩', sprite: '' },
    { id: 'sporty', color: '#2fa36b', hat: '🧢', sprite: '' },
    { id: 'rescue', color: '#e0a030', hat: '⛑️', sprite: '' },
    { id: 'scholar', color: null,     hat: '🎓', sprite: '' }   // color null = màu theo tên
  ],
  // Thay emoji bằng ảnh: '🦈': '/packages/graphics/sprites/shark.png'
  sprites: {}
};
