const Gfx = (() => {
  const cache = {};
  const load = src => { if (!src) return null; let c = cache[src];
    if (!c) { c = cache[src] = { i: new Image(), ok: false }; c.i.onload = () => c.ok = true; c.i.src = src; }
    return c.ok ? c.i : null; };
  const skin = p => GRAPHICS.characters[hue(p.name || '?') % GRAPHICS.characters.length];
  return {
    sprite: e => load(GRAPHICS.sprites[e]),
    body(g, p, x, y) { const s = skin(p), im = load(s.sprite);
      if (im) return g.drawImage(im, x - 35, y - 100, 70, 100);
      g.fillStyle = s.color || `hsl(${hue(p.name || '?')},60%,45%)`; g.fillRect(x - 17, y - 46, 34, 46); },
    hat(g, p, x, y) { const s = skin(p); if (s.hat) emo(s.hat, x, y - 98, 28); }
  };
})();
