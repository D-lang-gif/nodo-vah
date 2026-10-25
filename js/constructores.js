import * as THREE from "../vendor/three.module.min.js";
import { W, rnd } from "./util.js";
import { M } from "./materiales.js";

const sombra = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
const caja = (w, h, d, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; };

// Arreglo de paneles FV instanciados sobre un rectángulo (dimensiones locales), inclinados 25° al Sur
function paneles(g, w, d, y0, filas, paso = 1.15, inc = 25, lp = 2.0, ap = 1.1) {
  const nx = Math.floor(w / paso), nz = filas; const geo = new THREE.BoxGeometry(paso * .96, .05, lp);
  const inst = new THREE.InstancedMesh(geo, M.panel, nx * nz); const o = new THREE.Object3D(); let k = 0;
  const sep = d / nz;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    o.position.set(-w / 2 + paso * (i + .5), y0 + Math.sin(inc * Math.PI / 180) * lp / 2 + .25, -d / 2 + sep * (j + .5));
    o.rotation.set(inc * Math.PI / 180, 0, 0); o.updateMatrix(); inst.setMatrixAt(k++, o.matrix);
  }
  inst.castShadow = true; inst.receiveShadow = true; g.add(inst); return nx * nz;
}

export function edificio(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0, h = f.h;
  const col = "#" + new THREE.Color(f.color || "#e8e3d9").getHexString();
  const mat = M.ventanas(col); mat.map.repeat.set(Math.max(1, w / 8), Math.max(1, h / 4)); mat.emissiveMap.repeat.copy(mat.map.repeat);
  const top = new THREE.MeshStandardMaterial({ color: 0x9a9890, roughness: .9 });
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [mat, mat, top, top, mat, mat]); cuerpo.position.y = h / 2; g.add(cuerpo);
  // pretil
  const pt = .25, ph = .8;
  g.add(caja(w, ph, pt, M.blanco, 0, h + ph / 2, d / 2 - pt / 2), caja(w, ph, pt, M.blanco, 0, h + ph / 2, -d / 2 + pt / 2), caja(pt, ph, d, M.blanco, w / 2 - pt / 2, h + ph / 2, 0), caja(pt, ph, d, M.blanco, -w / 2 + pt / 2, h + ph / 2, 0));
  // base / zócalo
  g.add(caja(w + .6, .35, d + .6, M.concretoOsc, 0, .17, 0));
  if (f.solar) { const filas = Math.max(2, Math.floor((d - 2) / 3.2)); g.userData.modulos = paneles(g, w - 2, d - 2, h, filas); }
  else { // equipos de azotea
    const r = rnd(w * 7 + d); for (let i = 0; i < Math.max(1, Math.floor(w * d / 120)); i++) g.add(caja(1.6, 1.1, 1.2, M.aceroPintado, (r() - .5) * (w - 4), h + .55, (r() - .5) * (d - 4)));
  }
  g.userData.ventanas = mat; return sombra(g);
}

export function tanque(f) {
  const g = new THREE.Group(); const r = f.d / 2, h = f.h;
  const mat = f.steel ? M.acero : new THREE.MeshStandardMaterial({ color: new THREE.Color(f.color || "#c7ccd1"), metalness: .55, roughness: .35 });
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 48), mat); c.position.y = h / 2; g.add(c);
  const tapa = new THREE.Mesh(new THREE.ConeGeometry(r * 1.02, r * .35, 48), mat); tapa.position.y = h + r * .175; g.add(tapa);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(r * 1.01, .06, 6, 48), M.amarilloSeg); aro.rotation.x = Math.PI / 2; aro.position.y = h + .9; g.add(aro);
  for (let i = 1; i < h / 1.6; i++) { const b = new THREE.Mesh(new THREE.TorusGeometry(r * 1.005, .04, 4, 48), M.aceroPintado); b.rotation.x = Math.PI / 2; b.position.y = i * 1.6; g.add(b); }
  if (r > 2) { const esc = caja(.6, h, .1, M.amarilloSeg, r + .1, h / 2, 0); g.add(esc); }
  g.add(caja(f.d + .8, .3, f.d + .8, M.concretoOsc, 0, .15, 0));
  return sombra(g);
}

export function clarificador(f) {
  const g = new THREE.Group(); const r = f.d / 2, h = 1.4;
  const muro = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true), M.concreto); muro.material.side = THREE.DoubleSide; muro.position.y = h / 2; g.add(muro);
  const borde = new THREE.Mesh(new THREE.TorusGeometry(r, .18, 6, 64), M.concreto); borde.rotation.x = Math.PI / 2; borde.position.y = h; g.add(borde);
  const vert = new THREE.Mesh(new THREE.RingGeometry(r - .8, r - .55, 64), M.concretoOsc); vert.rotation.x = -Math.PI / 2; vert.position.y = h - .25; g.add(vert);
  const agua = new THREE.Mesh(new THREE.CircleGeometry(r - .2, 64), M.aguaClara); agua.rotation.x = -Math.PI / 2; agua.position.y = h - .35; g.add(agua);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, 2.2, 24), M.concreto); col.position.y = 1.1; g.add(col);
  const puente = new THREE.Group(); puente.position.y = h + .5;
  puente.add(caja(r, .35, 1.1, M.aceroPintado, r / 2, 0, 0)); puente.add(caja(r, .9, .05, M.amarilloSeg, r / 2, .6, .55)); puente.add(caja(r, .9, .05, M.amarilloSeg, r / 2, .6, -.55));
  puente.add(caja(1.6, 1, 1.6, M.amarilloSeg, 0, .5, 0)); puente.add(caja(.5, 1.5, .5, M.aceroPintado, r - .3, -.6, 0));
  const desn = caja(r - 1, .1, .2, M.aceroPintado, r / 2, -1.6, 0); puente.add(desn);
  g.add(puente); g.userData.giro = puente;
  return sombra(g);
}

export function pila(f) { // tanques rectangulares abiertos con agua
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0, h = Math.min(f.h, 1.6), t = .35;
  g.add(caja(w, h, t, M.concreto, 0, h / 2, d / 2 - t / 2), caja(w, h, t, M.concreto, 0, h / 2, -d / 2 + t / 2), caja(t, h, d, M.concreto, w / 2 - t / 2, h / 2, 0), caja(t, h, d, M.concreto, -w / 2 + t / 2, h / 2, 0));
  const mat = f.agua === "aire" ? M.aguaAireacion : (f.id.startsWith("TK-1") || f.id.startsWith("SC") ? M.aguaResidual : M.aguaClara);
  const a = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * t, d - 2 * t), mat); a.rotation.x = -Math.PI / 2; a.position.y = h - .3; g.add(a);
  // pasarela
  g.add(caja(w, .1, 1.0, M.aceroPintado, 0, h + .05, 0)); g.add(caja(w, .8, .04, M.amarilloSeg, 0, h + .45, .5));
  if (w > 10 && d > 4) for (let i = 1; i < 3; i++) g.add(caja(t, h, d, M.concreto, -w / 2 + w * i / 3, h / 2, 0));
  return sombra(g);
}

export function campoFV(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0;
  const filas = Math.floor(d / 4.2); g.userData.modulos = paneles(g, w, d, .6, filas, 1.15, 25, 3.9, 1.1);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(w + 2, d + 2), M.terraplen); piso.rotation.x = -Math.PI / 2; piso.position.y = .03; piso.receiveShadow = true; g.add(piso);
  return g;
}

export function colectores(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0; const filas = Math.floor(d / 2.5);
  const mt = new THREE.MeshStandardMaterial({ color: 0x1a1f26, metalness: .9, roughness: .1 });
  for (let j = 0; j < filas; j++) { const fila = new THREE.Group(); const tubo = caja(w, .12, 1.9, mt); fila.add(tubo); const cab = caja(w, .25, .25, M.acero, 0, .1, -1); fila.add(cab); fila.rotation.x = .6; fila.position.set(0, 1, -d / 2 + 1.25 + j * 2.5); g.add(fila); }
  return sombra(g);
}

export function contenedor(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0, h = f.h;
  const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(f.color || "#e9eef2"), metalness: .4, roughness: .5 });
  g.add(caja(w, h, d, mat, 0, h / 2 + .3, 0)); g.add(caja(w + .4, .3, d + .4, M.concretoOsc, 0, .15, 0));
  for (let i = 0; i < w / .6; i++) g.add(caja(.08, h * .9, d + .04, M.aceroPintado, -w / 2 + .3 + i * .6, h / 2 + .3, 0));
  return sombra(g);
}

export function domo(f) {
  const g = new THREE.Group(); const r = f.d / 2;
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x4f7d4a, roughness: .55 }));
  m.scale.y = f.h / r; g.add(m); g.add(new THREE.Mesh(new THREE.CylinderGeometry(r + .4, r + .4, .4, 48), M.concreto));
  return sombra(g);
}

export function humedal(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0;
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, .5, d), M.grava); base.position.y = .25; base.receiveShadow = true; g.add(base);
  const bord = (ww, dd, x, z) => g.add(caja(ww, .8, dd, M.concreto, x, .4, z)); bord(w, .4, 0, d / 2); bord(w, .4, 0, -d / 2); bord(.4, d, w / 2, 0); bord(.4, d, -w / 2, 0);
  for (let i = 1; i < 3; i++) bord(.3, d, -w / 2 + w * i / 3, 0);
  const n = 9000, geo = new THREE.ConeGeometry(.16, 1.8, 4); const inst = new THREE.InstancedMesh(geo, M.junco, n); const o = new THREE.Object3D(); const r = rnd(99); const col = new THREE.Color();
  for (let i = 0; i < n; i++) { o.position.set((r() - .5) * (w - 1), .5 + .7, (r() - .5) * (d - 1)); const s = .8 + r() * .9; o.scale.set(s, s, s); o.rotation.set((r() - .5) * .3, r() * 6, (r() - .5) * .3); o.updateMatrix(); inst.setMatrixAt(i, o.matrix); inst.setColorAt(i, col.setHSL(.22 + r() * .06, .45, .28 + r() * .15)); }
  inst.castShadow = true; g.add(inst); return g;
}

export function estanque(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0; const s = new THREE.Shape(); const rr = 8;
  s.moveTo(-w / 2 + rr, -d / 2); s.lineTo(w / 2 - rr, -d / 2); s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + rr); s.lineTo(w / 2, d / 2 - rr); s.quadraticCurveTo(w / 2, d / 2, w / 2 - rr, d / 2); s.lineTo(-w / 2 + rr, d / 2); s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - rr); s.lineTo(-w / 2, -d / 2 + rr); s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + rr, -d / 2);
  const talud = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .6, bevelEnabled: true, bevelSize: 1.6, bevelThickness: .4, bevelSegments: 3 }), M.concreto); talud.rotation.x = -Math.PI / 2; talud.position.y = -.4; talud.receiveShadow = true; g.add(talud);
  const a = new THREE.Mesh(new THREE.ShapeGeometry(s, 24), M.agua); a.rotation.x = -Math.PI / 2; a.position.y = .62; a.scale.set(.97, .97, 1); g.add(a);
  return g;
}

export function pozo(f) {
  const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .8, 24), M.concreto)); g.children[0].position.y = .4;
  g.add(caja(.3, 1.6, .3, M.acero, 0, 1.2, 0)); g.add(caja(1.2, .2, .3, M.acero, 0, 1.9, 0)); return sombra(g);
}

export function invernadero(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0, h = f.h; const n = Math.max(1, Math.round(w / 8)); const bw = w / n;
  for (let i = 0; i < n; i++) {
    const s = new THREE.Shape(); s.moveTo(-bw / 2, 0); s.lineTo(bw / 2, 0); s.lineTo(bw / 2, h * .7); s.lineTo(0, h); s.lineTo(-bw / 2, h * .7); s.lineTo(-bw / 2, 0);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }), M.vidrio); m.position.set(-w / 2 + bw * (i + .5), 0, -d / 2); g.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0xdfe8ef, transparent: true, opacity: .8 })); e.position.copy(m.position); g.add(e);
  }
  const r = rnd(w); const cult = new THREE.MeshStandardMaterial({ color: 0x4f8a35, roughness: 1 });
  for (let z = -d / 2 + 1.5; z < d / 2 - 1; z += 1.6) g.add(caja(w - 2, .5, .8, cult, 0, .25, z));
  return sombra(g);
}

export function losa(f) { const w = f.x1 - f.x0, d = f.y1 - f.y0; const g = new THREE.Group(); g.add(caja(w, f.h, d, M.concreto, 0, f.h / 2, 0)); return sombra(g); }

export function reserva(f) {
  const g = new THREE.Group(); const w = f.x1 - f.x0, d = f.y1 - f.y0;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: 0xa8d5a2, transparent: true, opacity: .22, roughness: 1 })); p.rotation.x = -Math.PI / 2; p.position.y = .06; g.add(p);
  const pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2], [-w / 2, -d / 2]].map(([x, z]) => new THREE.Vector3(x, .15, z));
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x6fbf73, dashSize: 2, gapSize: 1.5 })); l.computeLineDistances(); g.add(l);
  return g;
}

export const CONSTRUCTOR = { building: edificio, tank: tanque, clarifier: clarificador, basin: pila, pvfield: campoFV, collectors: colectores, container: contenedor, dome: domo, wetland: humedal, pond: estanque, well: pozo, greenhouse: invernadero, slab: losa, reserve: reserva };

export function construir(f) {
  const g = (CONSTRUCTOR[f.tipo] || losa)(f);
  const c = f.geom === "circ" ? W(f.cx, f.cy) : W((f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2);
  g.position.copy(c); g.userData.f = f; g.name = f.id;
  g.traverse((m) => { if (m.isMesh || m.isInstancedMesh) m.userData.fid = f.id; });
  return g;
}
