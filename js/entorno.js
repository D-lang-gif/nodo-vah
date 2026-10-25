import * as THREE from "../vendor/three.module.min.js";
import { W, rnd, canvasTex } from "./util.js";
import { M } from "./materiales.js";

export function crearEntorno(scene, D) {
  const out = { lamparas: [], luces: [], bloques: {} };
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), M.desierto); suelo.rotation.x = -Math.PI / 2; suelo.position.y = -.05; suelo.receiveShadow = true; scene.add(suelo); out.suelo = suelo;
  // parcelas agrícolas alrededor (contexto ejidal)
  const r = rnd(4); const verdes = [0x7d8f45, 0x9a9a52, 0x6b7f3a, 0xb2a46a, 0x8a9a4a];
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    if (Math.abs(i) <= 1 && Math.abs(j) <= 1) continue; if (r() < .25) continue;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(210 + r() * 20, 210 + r() * 20), new THREE.MeshStandardMaterial({ color: verdes[Math.floor(r() * 5)], roughness: 1, map: M.pasto.map }));
    p.rotation.x = -Math.PI / 2; p.position.set(i * 240, -.03, j * 240); p.receiveShadow = true; scene.add(p);
  }
  // camino de acceso exterior y canal de riego
  const cam = new THREE.Mesh(new THREE.PlaneGeometry(3000, 14), M.asfalto); cam.rotation.x = -Math.PI / 2; cam.position.set(0, -.02, 100 + 14); cam.receiveShadow = true; scene.add(cam);
  const canal = new THREE.Mesh(new THREE.PlaneGeometry(3000, 5), M.agua); canal.rotation.x = -Math.PI / 2; canal.position.set(0, -.01, -100 - 12); scene.add(canal);
  // terraplén del predio
  const pad = new THREE.Mesh(new THREE.BoxGeometry(204, .6, 204), M.terraplen); pad.position.set(0, -.28, 0); pad.receiveShadow = true; pad.userData.capa = "PREDIO"; scene.add(pad);
  // bloques (tinte de piso)
  for (const b of D.bloques) {
    const w = b.x1 - b.x0, d = b.y1 - b.y0; let mat;
    if (b.id === "PATIO") mat = M.asfalto; else if (b.id === "BLQ-D") mat = M.pasto; else if (b.id === "ZONA-F") mat = M.terraplen;
    else mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(b.color).lerp(new THREE.Color("#d9d2c0"), .82), roughness: .95 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w - .6, d - .6), mat.clone ? mat.clone() : mat); m.rotation.x = -Math.PI / 2; m.position.copy(W((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, .04)); m.receiveShadow = true; m.userData.bloque = b.id; m.userData.matOrig = m.material; m.userData.capa = "BLOQUES"; scene.add(m); out.bloques[b.id] = m;
    const pts = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1], [b.x0, b.y0]].map(([x, y]) => W(x, y, .12));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: b.color, transparent: true, opacity: .8 })); l.userData.capa = "BLOQUES"; scene.add(l);
  }
  // vialidades
  const tLin = canvasTex(64, 256, (c, w, h) => { c.fillStyle = "#3a3e43"; c.fillRect(0, 0, w, h); c.fillStyle = "#f2f2f2"; c.fillRect(w / 2 - 2, 0, 4, h * .5); c.fillStyle = "#d6d6d6"; c.fillRect(1, 0, 3, h); c.fillRect(w - 4, 0, 3, h); }, [1, 1]);
  for (const v of D.vias) {
    const w = v.x1 - v.x0, d = v.y1 - v.y0; const t = tLin.clone(); t.needsUpdate = true; const vert = d > w;
    t.repeat.set(1, (vert ? d : w) / 8); if (!vert) { t.rotation = Math.PI / 2; t.center.set(.5, .5); }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, roughness: .85 })); m.rotation.x = -Math.PI / 2; m.position.copy(W((v.x0 + v.x1) / 2, (v.y0 + v.y1) / 2, .08)); m.receiveShadow = true; m.userData.capa = "VIALIDADES"; scene.add(m);
    // banquetas
    const bq = new THREE.MeshStandardMaterial({ color: 0xcfc9bb, roughness: .9 });
    if (vert) { for (const x of [v.x0 - .6, v.x1 + .6]) { const s = new THREE.Mesh(new THREE.BoxGeometry(1.2, .18, d), bq); s.position.copy(W(x, (v.y0 + v.y1) / 2, .09)); s.receiveShadow = true; s.userData.capa = "VIALIDADES"; scene.add(s); } }
    else { for (const y of [v.y0 - .6, v.y1 + .6]) { const s = new THREE.Mesh(new THREE.BoxGeometry(w, .18, 1.2), bq); s.position.copy(W((v.x0 + v.x1) / 2, y, .09)); s.receiveShadow = true; s.userData.capa = "VIALIDADES"; scene.add(s); } }
  }
  // cerca perimetral
  const postes = new THREE.InstancedMesh(new THREE.CylinderGeometry(.05, .05, 2.4, 6), M.cerca, 280); const o = new THREE.Object3D(); let k = 0;
  const lados = [[0, 0, 200, 0], [200, 0, 200, 200], [200, 200, 0, 200], [0, 200, 0, 0]];
  const ac = D.acceso;
  for (const [x0, y0, x1, y1] of lados) {
    const L = Math.hypot(x1 - x0, y1 - y0); const n = Math.floor(L / 3);
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; if (y === 0 && Math.abs(x - ac.x) < ac.ancho / 2) continue; o.position.copy(W(x, y, 1.2)); o.updateMatrix(); if (k < 280) postes.setMatrixAt(k++, o.matrix); }
    const segs = (y0 === 0 && y1 === 0) ? [[0, ac.x - ac.ancho / 2], [ac.x + ac.ancho / 2, 200]] : [[0, L]];
    for (const [a, b] of segs) {
      const ll = b - a; const mm = M.malla.clone(); mm.map = M.malla.map.clone(); mm.map.needsUpdate = true; mm.map.repeat.set(ll / 1.2, 1);
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(ll, 2.2), mm); const dx = (x1 - x0) / L, dy = (y1 - y0) / L; const cx = x0 + dx * (a + ll / 2), cy = y0 + dy * (a + ll / 2);
      pl.position.copy(W(cx, cy, 1.15)); pl.rotation.y = Math.atan2(dy, dx); scene.add(pl);
    }
  }
  postes.count = k; postes.castShadow = true; scene.add(postes);
  // acceso A: portones y caseta
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.6, 4, .6), M.concreto); p.position.copy(W(ac.x + s * ac.ancho / 2, 0, 2)); p.castShadow = true; scene.add(p); }
  const arco = new THREE.Mesh(new THREE.BoxGeometry(ac.ancho + 1, .9, .9), M.aceroPintado); arco.position.copy(W(ac.x, 0, 4.3)); arco.castShadow = true; scene.add(arco);
  const letrero = new THREE.Mesh(new THREE.PlaneGeometry(9, .8), new THREE.MeshBasicMaterial({ map: canvasTex(512, 48, (c, w, h) => { c.fillStyle = "#0c1620"; c.fillRect(0, 0, w, h); c.fillStyle = "#5fd1ff"; c.font = "bold 30px sans-serif"; c.textAlign = "center"; c.fillText("NODO VAH · ACCESO A", w / 2, 34); }, [1, 1]) }));
  letrero.position.copy(W(ac.x, -.47, 4.3)); scene.add(letrero);
  const pluma = new THREE.Mesh(new THREE.BoxGeometry(5.5, .12, .12), new THREE.MeshStandardMaterial({ color: 0xe23b3b })); pluma.position.copy(W(ac.x - 2.8, 1.5, 1.1)); scene.add(pluma);
  // árboles
  const nArb = 520; const tr = new THREE.InstancedMesh(new THREE.CylinderGeometry(.15, .22, 2.2, 6), M.tronco, nArb); const co = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), M.copa, nArb);
  const ra = rnd(42); const colr = new THREE.Color(); let na = 0;
  const arbol = (x, y, s = 1) => { if (na >= nArb) return; const h = 2.2 * s; o.position.copy(W(x, y, h / 2)); o.scale.set(s, s, s); o.rotation.set(0, 0, 0); o.updateMatrix(); tr.setMatrixAt(na, o.matrix); o.position.copy(W(x, y, h + 1.1 * s)); o.scale.set(s * (1.6 + ra() * .6), s * (1.2 + ra() * .4), s * (1.6 + ra() * .6)); o.rotation.y = ra() * 6; o.updateMatrix(); co.setMatrixAt(na, o.matrix); co.setColorAt(na, colr.setHSL(.2 + ra() * .08, .38 + ra() * .15, .22 + ra() * .1)); na++; };
  for (let t = 4; t < 197; t += 7) { arbol(t, 197.5, .9 + ra() * .4); arbol(2.5, t, .9 + ra() * .4); arbol(197.5, t, .9 + ra() * .4); if (Math.abs(t - ac.x) > 12 && t > 112) arbol(t, 2.5, .9 + ra() * .4); }
  for (let y = 6; y < 186; y += 9) { arbol(109, y + 3, .8); arbol(121, y, .8); }
  for (let i = 0; i < 40; i++) { const x = 62 + ra() * 46, y = 22 + ra() * 56; if ((x > 66 && x < 104 && y > 30 && y < 74)) continue; arbol(x, y, .7 + ra() * .5); }
  for (let i = 0; i < 26; i++) arbol(128 + ra() * 60, 133 + ra() * 18 > 150 ? 182 + ra() * 10 : 96 + ra() * 2, .7 + ra() * .4);
  tr.count = co.count = na; tr.castShadow = co.castShadow = true; co.receiveShadow = true; scene.add(tr, co);
  // luminarias
  const lampG = new THREE.Group(); const poste = new THREE.CylinderGeometry(.08, .1, 8, 6), cab = new THREE.BoxGeometry(1.2, .2, .4);
  for (let y = 10; y < 190; y += 22) for (const x of [110.2, 119.8]) { const p = new THREE.Mesh(poste, M.aceroPintado); p.position.copy(W(x, y, 4)); const c = new THREE.Mesh(cab, M.lampara); c.position.copy(W(x + (x < 115 ? .5 : -.5), y, 8)); lampG.add(p, c); out.lamparas.push(c.position.clone()); }
  scene.add(lampG);
  // vehículos (pipas y tractocamiones)
  const veh = (x, y, rot, color) => { const g = new THREE.Group(); const cabm = new THREE.MeshStandardMaterial({ color, metalness: .4, roughness: .4 });
    const cb = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.8, 2.4), cabm); cb.position.set(5.2, 1.9, 0); g.add(cb);
    const tq = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 8.5, 20), M.acero); tq.rotation.z = Math.PI / 2; tq.position.set(-.6, 2.0, 0); g.add(tq);
    const ch = new THREE.Mesh(new THREE.BoxGeometry(12, .4, 2.3), M.aceroPintado); ch.position.set(0, .8, 0); g.add(ch);
    for (const xx of [-4, -2.8, 4.8]) for (const zz of [-1.1, 1.1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .4, 12), M.tubos); w.rotation.x = Math.PI / 2; w.position.set(xx, .5, zz); g.add(w); }
    g.position.copy(W(x, y)); g.rotation.y = rot; g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); scene.add(g); };
  veh(70, 10, 0, 0xc23b2a); veh(85, 14, Math.PI, 0x2a5fc2); veh(33, 30.5, Math.PI / 2, 0xe8e8e8); veh(115, 40, Math.PI / 2, 0xc23b2a);
  // estacionamiento (cajones)
  for (let i = 0; i < 16; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(.12, 5), new THREE.MeshBasicMaterial({ color: 0xffffff })); l.rotation.x = -Math.PI / 2; l.position.copy(W(64 + i * 2.8, 25, .1)); scene.add(l); }
  const est = new THREE.Mesh(new THREE.PlaneGeometry(46, 7), M.asfalto); est.rotation.x = -Math.PI / 2; est.position.copy(W(86, 25, .07)); est.receiveShadow = true; scene.add(est);
  const rc = rnd(77); const colores = [0xd8d8d8, 0x2a2a2a, 0x8a1c1c, 0x1c3f8a, 0xb0b0b0];
  for (let i = 0; i < 11; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 4.4), new THREE.MeshStandardMaterial({ color: colores[Math.floor(rc() * 5)], metalness: .6, roughness: .3 })); const ii = Math.floor(rc() * 15); c.position.copy(W(65.4 + ii * 2.8, 25, .75)); c.castShadow = true; scene.add(c); }
  return out;
}
