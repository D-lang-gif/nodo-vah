import * as THREE from "../vendor/three.module.min.js";
import { canvasTex, ruido, rnd } from "./util.js";
export const M = {};
export function crearMateriales() {
  const tSuelo = canvasTex(512, 512, (c, w, h) => { ruido(c, w, h, "#a88e66", .18, 26000, rnd(3), 3); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(120,100,60,${Math.random() * .08})`; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 0, 7); c.fill(); } }, [60, 60]);
  M.desierto = new THREE.MeshStandardMaterial({ map: tSuelo, roughness: 1 });
  const tPad = canvasTex(512, 512, (c, w, h) => ruido(c, w, h, "#c4b597", .12, 20000, rnd(5), 2), [20, 20]);
  M.terraplen = new THREE.MeshStandardMaterial({ map: tPad, roughness: .95 });
  const tAsf = canvasTex(256, 256, (c, w, h) => ruido(c, w, h, "#3b3f44", .12, 9000, rnd(9), 2), [1, 1]);
  M.asfalto = new THREE.MeshStandardMaterial({ map: tAsf, roughness: .9, color: 0xffffff });
  M.concreto = new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => ruido(c, w, h, "#b9b6ae", .12, 8000, rnd(11), 2), [2, 2]), roughness: .85 });
  M.concretoOsc = new THREE.MeshStandardMaterial({ color: 0x8f8c86, roughness: .9 });
  M.grava = new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => ruido(c, w, h, "#8a5a4a", .3, 14000, rnd(13), 3), [10, 6]), roughness: 1 });
  M.pasto = new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => ruido(c, w, h, "#6f8f3c", .22, 15000, rnd(17), 2), [8, 8]), roughness: 1 });
  M.acero = new THREE.MeshStandardMaterial({ color: 0xdfe4e8, metalness: .85, roughness: .28 });
  M.aceroPintado = new THREE.MeshStandardMaterial({ color: 0x5d6b78, metalness: .5, roughness: .45 });
  M.amarilloSeg = new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: .3, roughness: .5 });
  M.vidrio = new THREE.MeshPhysicalMaterial({ color: 0xcfe8ef, metalness: 0, roughness: .05, transmission: 0, transparent: true, opacity: .28, side: THREE.DoubleSide, depthWrite: false });
  M.panel = new THREE.MeshStandardMaterial({ map: canvasTex(128, 256, (c, w, h) => { c.fillStyle = "#0e1f3d"; c.fillRect(0, 0, w, h); c.strokeStyle = "#5c7290"; c.lineWidth = 2; for (let x = 0; x <= w; x += w / 6) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += h / 10) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.strokeStyle = "#c9d3de"; c.lineWidth = 6; c.strokeRect(0, 0, w, h); }), metalness: .6, roughness: .18, color: 0xffffff });
  M.tubos = new THREE.MeshStandardMaterial({ color: 0x1b2633, metalness: .7, roughness: .25 });
  // agua
  const tNorm = canvasTex(256, 256, (c, w, h) => { const id = c.createImageData(w, h); const r = rnd(21); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; const a = Math.sin(x * .19 + Math.sin(y * .07) * 3) * .5 + Math.sin(y * .23 + x * .05) * .5; id.data[i] = 128 + a * 40 + (r() - .5) * 20; id.data[i + 1] = 128 + Math.cos(x * .11 + y * .17) * 40; id.data[i + 2] = 255; id.data[i + 3] = 255; } c.putImageData(id, 0, 0); }, [6, 6], false);
  M.aguaNormal = tNorm;
  M.agua = new THREE.MeshPhysicalMaterial({ color: 0x1f5f73, metalness: .05, roughness: .06, normalMap: tNorm, normalScale: new THREE.Vector2(.35, .35), clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 1.4 });
  M.aguaResidual = new THREE.MeshPhysicalMaterial({ color: 0x4d4a32, roughness: .15, normalMap: tNorm, normalScale: new THREE.Vector2(.3, .3), clearcoat: .6 });
  M.aguaAireacion = new THREE.MeshStandardMaterial({ color: 0x8a8a6a, roughness: .5, map: canvasTex(256, 256, (c, w, h) => { ruido(c, w, h, "#6f7058", .5, 9000, rnd(31), 4); }, [4, 2]) });
  M.aguaClara = new THREE.MeshPhysicalMaterial({ color: 0x2f6f6a, roughness: .05, normalMap: tNorm, normalScale: new THREE.Vector2(.25, .25), clearcoat: 1 });
  M.ventanas = (base) => {
    const tex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let y = 40; y < h - 30; y += 110) { c.fillStyle = "#2a3a48"; c.fillRect(0, y, w, 46); c.fillStyle = "#8ba3b3"; for (let x = 0; x < w; x += 64) c.fillRect(x + 2, y + 2, 2, 42); } }, [1, 1]);
    const em = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#000"; c.fillRect(0, 0, w, h); const r = rnd(base.length * 13); for (let y = 40; y < h - 30; y += 110) for (let x = 0; x < w; x += 64) { c.fillStyle = r() > .3 ? "#ffcf87" : "#3a2a10"; c.fillRect(x + 5, y + 4, 56, 38); } }, [1, 1]);
    return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: em, emissive: 0x000000, roughness: .7, metalness: .05 });
  };
  M.blanco = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: .7 });
  M.tronco = new THREE.MeshStandardMaterial({ color: 0x5b4632, roughness: 1 });
  M.copa = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .95, flatShading: true });
  M.cerca = new THREE.MeshStandardMaterial({ color: 0x9aa3ab, metalness: .7, roughness: .4 });
  M.malla = new THREE.MeshStandardMaterial({ map: canvasTex(64, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = "rgba(200,210,220,.9)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, h); c.moveTo(w, 0); c.lineTo(0, h); c.stroke(); }, [200, 1]), transparent: true, alphaTest: .3, side: THREE.DoubleSide, metalness: .6, roughness: .5 });
  M.junco = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
  M.lampara = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x000000, roughness: .3 });
  return M;
}
