import * as THREE from "../vendor/three.module.min.js";
// Conversión plano (x Este, y Norte; origen vértice D) → mundo Three (X, Z=-Norte)
export const CX = 100, CY = 100;
export const W = (x, y, h = 0) => new THREE.Vector3(x - CX, h, CY - y);
export const P = (v) => ({ x: v.x + CX, y: CY - v.z });
export function rnd(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function canvasTex(w, h, draw, rep = [1, 1], srgb = true) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]);
  t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function ruido(ctx, w, h, base, var_, n = 9000, r = rnd(7), sz = 2) {
  ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) { const k = (r() - .5) * var_; ctx.fillStyle = `rgba(${k > 0 ? 255 : 0},${k > 0 ? 255 : 0},${k > 0 ? 240 : 0},${Math.abs(k)})`; ctx.fillRect(r() * w, r() * h, sz * r() + .5, sz * r() + .5); }
}
