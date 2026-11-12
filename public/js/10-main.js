let last=performance.now();(function loop(n){const d=(n-last)/1000;update(Math.min(.1,d),Math.min(5,d));last=n;draw();requestAnimationFrame(loop)})(last);
// Nhạc tự chạy: thử ngay khi tải trang (OBS cho phép), nếu trình duyệt chặn thì chạy ở lần chạm/bấm phím đầu tiên
try{startAudio()}catch(e){}
['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,()=>startAudio()));
