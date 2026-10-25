// MODO CAD · vistas ortogonales, corte, capas, snap, medición, cotas, rejilla, recorrido en primera persona, interiores
import * as THREE from "../vendor/three.module.min.js";
import { W, P } from "./util.js";
import { INTERIORES } from "./interiores.js";

const $ = (s) => document.querySelector(s);
const f2 = (v) => v.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const CAPAS = [
  ["PREDIO", "#ffffff"], ["BLOQUES", "#9a9a9a"], ["VIALIDADES", "#c8c8c8"], ["INSTALACIONES", "#4f7bff"], ["TEXTOS", "#ffffff"],
  ["AR_AGUA_RESIDUAL", "#ff9f00", "agua_residual"], ["AP_AGUA_PROCESO", "#0089ff", "agua_proceso"], ["AT_AGUA_TRATADA", "#00ffff", "agua_tratada"],
  ["EL_ENERGIA", "#ffff00", "energia"], ["BG_BIOGAS", "#00ff00", "biogas"], ["LE_LECHE", "#ffbf00", "leche"], ["FO_DATOS", "#ff00ff", "datos"], ["COTAS_UTM", "#ff3030"]];
const ALT = { agua_residual: 1.0, agua_proceso: 1.4, agua_tratada: 1.8, energia: 2.6, biogas: 2.2, leche: .9, datos: 3.0 };
const NO_SOLIDO = new Set(["slab", "reserve", "pvfield", "well", "wetland"]);

export function initCAD(ctx) {
  const { scene, camera, controls, renderer, fac, flujos, D, pick, utmTxt } = ctx;
  const S = { activo: false, vista: "planta", herr: null, pts: [], corte: null, walk: false, disp: "sombreado", inter: false };
  const touch = matchMedia("(pointer: coarse)").matches;
  const raiz = new THREE.Group(); raiz.name = "CAD"; scene.add(raiz);
  const grupos = {}; for (const [n] of CAPAS) { const g = new THREE.Group(); g.name = "CAD_" + n; raiz.add(g); grupos[n] = g; }
  const etq = document.createElement("div"); etq.id = "cadEt"; document.body.appendChild(etq);
  const etiquetas = []; // {el, p, capa, a, b, min}
  function etiqueta(txt, p, capa, cls = "", a = null, b = null, min = 26) { const el = document.createElement("div"); el.className = "ce " + cls; el.innerHTML = txt; etq.appendChild(el); const o = { el, p, capa, a, b, min }; etiquetas.push(o); return o; }
  const lm = (color, op = 1) => new THREE.LineBasicMaterial({ color, transparent: true, opacity: op, depthTest: false });
  function linea(pts, mat, capa) { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat); l.renderOrder = 900; (capa ? grupos[capa] : raiz).add(l); return l; }
  function segs(pares, mat, capa) { const l = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pares), mat); l.renderOrder = 900; grupos[capa].add(l); return l; }
  const rectPts = (x0, y0, x1, y1, h) => [W(x0, y0, h), W(x1, y0, h), W(x1, y1, h), W(x0, y1, h), W(x0, y0, h)];
  const circPts = (cx, cy, r, h, n = 64) => Array.from({ length: n + 1 }, (_, i) => W(cx + r * Math.cos(i / n * 2 * Math.PI), cy + r * Math.sin(i / n * 2 * Math.PI), h));

  // ---------- Geometría CAD (espejo de capas DXF) ----------
  linea(rectPts(0, 0, 200, 200, .16), lm(0xffffff), "PREDIO");
  for (const b of D.bloques) linea(rectPts(b.x0, b.y0, b.x1, b.y1, .14), lm(0x9a9a9a, .9), "BLOQUES");
  for (const v of D.vias) linea(rectPts(v.x0, v.y0, v.x1, v.y1, .15), lm(0xc8c8c8, .9), "VIALIDADES");
  const SNAPV = [], SNAPE = [];
  const addV = (p) => SNAPV.push(p), addE = (a, b) => SNAPE.push([a, b]);
  for (const v of [[0, 0], [200, 0], [200, 200], [0, 200]]) addV(W(v[0], v[1], 0));
  for (const v of D.vias) { const c = [[v.x0, v.y0], [v.x1, v.y0], [v.x1, v.y1], [v.x0, v.y1]]; c.forEach((q, i) => { addV(W(q[0], q[1], .08)); const r = c[(i + 1) % 4]; addE(W(q[0], q[1], .08), W(r[0], r[1], .08)); }); }
  for (const b of D.bloques) { const c = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]; c.forEach((q, i) => { const r = c[(i + 1) % 4]; addE(W(q[0], q[1], 0), W(r[0], r[1], 0)); }); }
  const matInst = lm(0x4f7bff), matInstT = lm(0x8fb0ff, .55);
  for (const f of D.instalaciones) {
    if (f.geom === "circ") { const r = f.d / 2; linea(circPts(f.cx, f.cy, r, .17), matInst, "INSTALACIONES"); linea(circPts(f.cx, f.cy, r, f.h), matInstT, "INSTALACIONES");
      for (const h of [0, f.h]) { addV(W(f.cx, f.cy, h)); const n = 48; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, b2 = (i + 1) / n * 2 * Math.PI; const p = W(f.cx + r * Math.cos(a), f.cy + r * Math.sin(a), h); if (i % 12 === 0) addV(p); addE(p, W(f.cx + r * Math.cos(b2), f.cy + r * Math.sin(b2), h)); } }
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; addE(W(f.cx + r * Math.cos(a), f.cy + r * Math.sin(a), 0), W(f.cx + r * Math.cos(a), f.cy + r * Math.sin(a), f.h)); }
    } else {
      linea(rectPts(f.x0, f.y0, f.x1, f.y1, .17), matInst, "INSTALACIONES"); if (f.h > .5) linea(rectPts(f.x0, f.y0, f.x1, f.y1, f.h), matInstT, "INSTALACIONES");
      const c = [[f.x0, f.y0], [f.x1, f.y0], [f.x1, f.y1], [f.x0, f.y1]];
      c.forEach((q, i) => { const r = c[(i + 1) % 4]; for (const h of [0, f.h]) { addV(W(q[0], q[1], h)); addE(W(q[0], q[1], h), W(r[0], r[1], h)); } addE(W(q[0], q[1], 0), W(q[0], q[1], f.h)); });
    }
  }
  // redes (polilíneas en su capa DXF)
  const capaDeRed = Object.fromEntries(CAPAS.filter((c) => c[2]).map((c) => [c[2], c]));
  for (const r of D.redes) { const c = capaDeRed[r.capa]; if (!c) continue; const m = lm(new THREE.Color(c[1]), .95);
    for (const t of r.tramos) { const pts = t.pts.map((q) => W(q[0], q[1], ALT[r.capa] ?? 1.5)); linea(pts, m, c[0]); t.pts.forEach((q) => addV(W(q[0], q[1], ALT[r.capa] ?? 1.5))); } }
  // textos (IDs)
  for (const f of D.instalaciones) { const [x, y] = f.geom === "circ" ? [f.cx, f.cy] : [(f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2]; const sz = f.geom === "circ" ? f.d : Math.min(f.x1 - f.x0, f.y1 - f.y0);
    etiqueta(f.id + (f.fuente === "sup" ? "*" : ""), W(x, y, f.h + .2), "TEXTOS", "cid", W(x - sz / 2, y, 0), W(x + sz / 2, y, 0), 22); }
  // ---------- Cotas permanentes desde el modelo de datos ----------
  const mc = lm(0xff4040, .95);
  function cota(a, b, off, txt, capa = "COTAS_UTM", min = 34) { // a,b locales [x,y,h]; off vector local [dx,dy]
    const A = W(a[0] + off[0], a[1] + off[1], a[2]), B = W(b[0] + off[0], b[1] + off[1], b[2]);
    const k = Math.hypot(...off) || 1, e = [off[0] / k * .6, off[1] / k * .6];
    segs([W(a[0], a[1], a[2]), W(a[0] + off[0] + e[0], a[1] + off[1] + e[1], a[2]), W(b[0], b[1], b[2]), W(b[0] + off[0] + e[0], b[1] + off[1] + e[1], b[2]), A, B], mc, capa);
    const t = 0.35, d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...d) || 1, u = [d[0] / L * t, d[1] / L * t];
    segs([W(a[0] + off[0] - u[0] + u[1], a[1] + off[1] - u[1] - u[0], a[2]), W(a[0] + off[0] + u[0] - u[1], a[1] + off[1] + u[1] + u[0], a[2]), W(b[0] + off[0] - u[0] + u[1], b[1] + off[1] - u[1] - u[0], b[2]), W(b[0] + off[0] + u[0] - u[1], b[1] + off[1] + u[1] + u[0], b[2])], mc, capa);
    etiqueta(txt, A.clone().lerp(B, .5), capa, "cota", A, B, min);
  }
  function cotaV(x, y, h0, h1, txt) { const A = W(x, y, h0), B = W(x, y, h1); segs([A, B, W(x - .4, y, h1), W(x + .4, y, h1), W(x - .4, y, h0), W(x + .4, y, h0)], mc, "COTAS_UTM"); etiqueta(txt, A.clone().lerp(B, .5), "COTAS_UTM", "cota cv", A, B, 30); }
  for (const f of D.instalaciones) {
    if (f.tipo === "reserve") continue;
    if (f.geom === "circ") { const r = f.d / 2; cota([f.cx - r, f.cy, f.h + .05], [f.cx + r, f.cy, f.h + .05], [0, 0], "Ø " + f2(f.d) + " m"); cotaV(f.cx + r + .8, f.cy, 0, f.h, "h " + f2(f.h)); }
    else { const w = f.x1 - f.x0, d = f.y1 - f.y0; cota([f.x0, f.y0, .2], [f.x1, f.y0, .2], [0, -1.6], f2(w) + " m"); cota([f.x0, f.y0, .2], [f.x0, f.y1, .2], [-1.6, 0], f2(d) + " m"); if (f.h >= 1) cotaV(f.x1 + .8, f.y0 - .8, 0, f.h, "h " + f2(f.h)); }
  }
  for (const v of D.vias) { const w = v.x1 - v.x0, d = v.y1 - v.y0; if (d > w) { const ym = v.y0 + d * .37; cota([v.x0, ym, .2], [v.x1, ym, .2], [0, 0], f2(w) + " m"); cota([v.x0 + w / 2, v.y0, .2], [v.x0 + w / 2, v.y1, .2], [0, 0], "L " + f2(d) + " m", "COTAS_UTM", 60); }
    else { const xm = v.x0 + w * .63; cota([xm, v.y0, .2], [xm, v.y1, .2], [0, 0], f2(d) + " m"); cota([v.x0, v.y0 + d / 2, .2], [v.x1, v.y0 + d / 2, .2], [0, 0], "L " + f2(w) + " m", "COTAS_UTM", 60); } }
  cota([0, 0, .2], [200, 0, .2], [0, -6], "200.00 m"); cota([200, 0, .2], [200, 200, .2], [6, 0], "200.00 m"); cota([0, 200, .2], [200, 200, .2], [0, 6], "200.00 m"); cota([0, 0, .2], [0, 200, .2], [-6, 0], "200.00 m");
  for (const [n, x, y] of D.predio.vertices) etiqueta(`<b>${n}</b><br>E ${f2(D.utm.E0 + x)}<br>N ${f2(D.utm.N0 + y)}`, W(x, y, .3), "COTAS_UTM", "cutm");

  // ---------- Rejilla ----------
  const rej = new THREE.Group(); raiz.add(rej);
  const g10 = new THREE.GridHelper(400, 40, 0x5fd1ff, 0x5fd1ff); g10.material.transparent = true; g10.material.opacity = .28; g10.material.depthTest = false; g10.position.y = .12; g10.renderOrder = 800;
  const g1 = new THREE.GridHelper(200, 200, 0x5fd1ff, 0x5fd1ff); g1.material.transparent = true; g1.material.opacity = .09; g1.material.depthTest = false; g1.position.y = .11; g1.renderOrder = 800;
  rej.add(g10, g1); const rejEt = []; for (let v = 0; v <= 200; v += 20) { rejEt.push(etiqueta(String(v), W(v, -12, .1), "_rej", "crej")); rejEt.push(etiqueta(String(v), W(-12, v, .1), "_rej", "crej")); }

  // ---------- Interiores ----------
  const inter = new THREE.Group(); inter.name = "interiores"; inter.visible = false; scene.add(inter);
  const mMuro = new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: .85, side: THREE.DoubleSide });
  const mPiso = new THREE.MeshStandardMaterial({ color: 0x9aa7ad, roughness: .35, metalness: .05 });
  const mTecho = new THREE.MeshStandardMaterial({ color: 0xd9dde0, roughness: .9, side: THREE.DoubleSide });
  const mEq = new THREE.MeshStandardMaterial({ color: 0xc9d2d8, metalness: .75, roughness: .28 });
  const mEq2 = new THREE.MeshStandardMaterial({ color: 0x2f7d9a, metalness: .2, roughness: .5 });
  const mLuz = new THREE.MeshBasicMaterial({ color: 0xfffbea });
  const mPant = new THREE.MeshBasicMaterial({ color: 0x1b8fd1 });
  const COL = { seg: [], circ: [] }; const techos = []; const lucesInt = []; const intEt = [];
  function caja(w, h, d, m, x, y, z) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; b.userData.int = 1; return b; }
  function muroLocal(g, f, x0, y0, x1, y1, h, gaps, esp = .2) {
    const hor = Math.abs(y1 - y0) < 1e-6; const a0 = hor ? Math.min(x0, x1) : Math.min(y0, y1), a1 = hor ? Math.max(x0, x1) : Math.max(y0, y1);
    const tramos = []; let c = a0; for (const [cen, an] of [...gaps].sort((p, q) => p[0] - q[0])) { tramos.push([c, cen - an / 2]); c = cen + an / 2; } tramos.push([c, a1]);
    for (const [s0, s1] of tramos) { if (s1 - s0 < .05) continue; const m = (s0 + s1) / 2, L = s1 - s0;
      const p = hor ? W(f.x0 + m, f.y0 + y0, h / 2) : W(f.x0 + x0, f.y0 + m, h / 2);
      g.add(caja(hor ? L : esp, h, hor ? esp : L, mMuro, p.x, p.y, p.z));
      COL.seg.push(hor ? [[f.x0 + s0, f.y0 + y0], [f.x0 + s1, f.y0 + y0], esp / 2] : [[f.x0 + x0, f.y0 + s0], [f.x0 + x0, f.y0 + s1], esp / 2]);
      const A = hor ? [f.x0 + s0, f.y0 + y0] : [f.x0 + x0, f.y0 + s0], B = hor ? [f.x0 + s1, f.y0 + y0] : [f.x0 + x0, f.y0 + s1]; addV(W(A[0], A[1], 0)); addV(W(B[0], B[1], 0)); addE(W(A[0], A[1], 0), W(B[0], B[1], 0));
      // puerta: marco y hoja
    }
    for (const [cen, an] of gaps) { const p = hor ? W(f.x0 + cen, f.y0 + y0, 0) : W(f.x0 + x0, f.y0 + cen, 0); const dintel = Math.min(2.4, h);
      if (h > dintel + .05) g.add(caja(hor ? an : esp, h - dintel, hor ? esp : an, mMuro, p.x, dintel + (h - dintel) / 2, p.z));
      const marco = new THREE.MeshStandardMaterial({ color: 0x3b4650, metalness: .5, roughness: .4 });
      g.add(caja(hor ? an + .1 : esp + .04, .08, hor ? esp + .04 : an + .1, marco, p.x, dintel, p.z)); }
  }
  for (const id in INTERIORES) {
    const f = D.instalaciones.find((q) => q.id === id); if (!f) continue; const I = INTERIORES[id]; const w = f.x1 - f.x0, d = f.y1 - f.y0, h = I.techo;
    const g = new THREE.Group(); g.name = "INT_" + id; g.userData.fid = id; inter.add(g);
    const c = W((f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2, 0);
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mPiso); piso.rotation.x = -Math.PI / 2; piso.position.set(c.x, .03, c.z); piso.receiveShadow = true; g.add(piso);
    const te = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mTecho); te.rotation.x = Math.PI / 2; te.position.set(c.x, h, c.z); g.add(te); techos.push(te);
    for (let i = 0; i < Math.max(1, Math.floor(w / 6)); i++) for (let j = 0; j < Math.max(1, Math.floor(d / 6)); j++) { const lp = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .6), mLuz); lp.rotation.x = Math.PI / 2; const q = W(f.x0 + (i + .5) * w / Math.max(1, Math.floor(w / 6)), f.y0 + (j + .5) * d / Math.max(1, Math.floor(d / 6)), h - .02); lp.position.copy(q); g.add(lp); techos.push(lp); }
    const pz = I.puertas;
    muroLocal(g, f, 0, 0, w, 0, h, pz.S || []); muroLocal(g, f, 0, d, w, d, h, pz.N || []); muroLocal(g, f, 0, 0, 0, d, h, pz.W || []); muroLocal(g, f, w, 0, w, d, h, pz.E || []);
    for (const m of I.muros) muroLocal(g, f, m[0], m[1], m[2], m[3], Math.min(h, id === "AD-601" ? 4 : 4.5), m[4], .15);
    if (I.camara) { const [a, b, cc, dd, hh, pc] = I.camara; const mf = new THREE.MeshStandardMaterial({ color: 0xf4f6f7, roughness: .5, side: THREE.DoubleSide });
      const sv = mMuro; mMuro.userData.sv = 1; const old = mMuro.color.getHex(); // muros de panel
      const gg = new THREE.Group(); muroLocal(gg, f, a, b, cc, b, hh, [[pc, 1.2]], .1); muroLocal(gg, f, a, dd, cc, dd, hh, [], .1); muroLocal(gg, f, a, b, a, dd, hh, [], .1); muroLocal(gg, f, cc, b, cc, dd, hh, [], .1);
      gg.traverse((m) => { if (m.isMesh) m.material = mf; }); g.add(gg);
      const tc = new THREE.Mesh(new THREE.BoxGeometry(cc - a, .1, dd - b), mf); tc.position.copy(W(f.x0 + (a + cc) / 2, f.y0 + (b + dd) / 2, hh)); g.add(tc); }
    for (const [n, a, b, cc, dd, hh, tipo] of I.equipos) {
      const cx = f.x0 + (a + cc) / 2, cy = f.y0 + (b + dd) / 2, ew = cc - a, ed = dd - b; const p = W(cx, cy, 0);
      let m; if (tipo === "cil") { m = new THREE.Mesh(new THREE.CylinderGeometry(ew / 2, ew / 2, hh, 28), mEq); COL.circ.push([[cx, cy], ew / 2]); }
      else { m = new THREE.Mesh(new THREE.BoxGeometry(ew, hh, ed), /Rack|Consola|CCM|Escritorio|Sala/.test(n) ? mEq2 : mEq); const c4 = [[cx - ew / 2, cy - ed / 2], [cx + ew / 2, cy - ed / 2], [cx + ew / 2, cy + ed / 2], [cx - ew / 2, cy + ed / 2]]; c4.forEach((q, i) => COL.seg.push([q, c4[(i + 1) % 4], 0])); }
      m.position.set(p.x, hh / 2, p.z); m.castShadow = m.receiveShadow = true; g.add(m);
      const hu = new THREE.Line(new THREE.BufferGeometry().setFromPoints(tipo === "cil" ? circPts(cx, cy, ew / 2 + .15, .06, 32) : rectPts(cx - ew / 2 - .15, cy - ed / 2 - .15, cx + ew / 2 + .15, cy + ed / 2 + .15, .06)), new THREE.LineDashedMaterial({ color: 0xffc400, dashSize: .25, gapSize: .15 })); hu.computeLineDistances(); g.add(hu);
      intEt.push(etiqueta(n + `<br><small>${f2(ew)} × ${f2(ed)} × h ${f2(hh)} m</small>`, W(cx, cy, hh + .35), "_int", "ceq"));
    }
    if (I.pantalla) { const [a, b, cc, h0, h1] = I.pantalla; const s = new THREE.Mesh(new THREE.PlaneGeometry(cc - a, h1 - h0), mPant); s.position.copy(W(f.x0 + (a + cc) / 2, f.y0 + b, (h0 + h1) / 2)); s.rotation.y = Math.PI; g.add(s); }
    for (const [n, x, y] of I.cuartos) intEt.push(etiqueta(n, W(f.x0 + x, f.y0 + y, 2.6), "_int", "ccu"));
    const L = new THREE.PointLight(0xfff3dd, 0, Math.max(w, d) * 1.2, 1.2); L.position.copy(W((f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2, h - .6)); g.add(L); lucesInt.push(L);
  }
  function verInteriores(on, conTecho = false) {
    S.inter = on; inter.visible = on && grupos.INSTALACIONES.visible;
    for (const id in INTERIORES) if (fac[id]) fac[id].visible = !on && grupos.INSTALACIONES.visible;
    for (const t of techos) t.visible = conTecho; for (const l of lucesInt) l.intensity = on && conTecho ? 60 : 0;
    $("#cadInt") && ($("#cadInt").checked = on);
  }
  inter.traverse((m) => { if (m.isMesh) pick.push(m); });

  // ---------- Cámara ortogonal + navegación 2D ----------
  const orto = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 5000);
  const O = { c: new THREE.Vector3(0, 0, 0), s: 120, dir: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, -1) };
  const VDIR = { planta: [[0, 1, 0], [0, 0, -1]], alzS: [[0, 0, 1], [0, 1, 0]], alzN: [[0, 0, -1], [0, 1, 0]], alzE: [[1, 0, 0], [0, 1, 0]], alzO: [[-1, 0, 0], [0, 1, 0]] };
  function ponerOrto() { const a = innerWidth / innerHeight; Object.assign(orto, { left: -O.s * a, right: O.s * a, top: O.s, bottom: -O.s }); orto.updateProjectionMatrix();
    orto.up.copy(O.up); orto.position.copy(O.c).addScaledVector(O.dir, 1500); orto.lookAt(O.c); orto.updateMatrixWorld(); }
  const esOrto = () => S.activo && S.vista !== "3d" && !S.walk;
  const cam = () => (esOrto() ? orto : camera);
  const punteros = new Map(); let pinch0 = null, arr = null;
  const dom = renderer.domElement;
  dom.addEventListener("wheel", (e) => { if (!esOrto()) return; e.preventDefault(); zoomEn(e.clientX, e.clientY, Math.exp(e.deltaY * .0012)); }, { passive: false });
  function zoomEn(x, y, k) { const a = innerWidth / innerHeight; const nx = x / innerWidth * 2 - 1, ny = -y / innerHeight * 2 + 1;
    const R = new THREE.Vector3().setFromMatrixColumn(orto.matrixWorld, 0), U = new THREE.Vector3().setFromMatrixColumn(orto.matrixWorld, 1);
    const pw = O.c.clone().addScaledVector(R, nx * O.s * a).addScaledVector(U, ny * O.s); O.s = THREE.MathUtils.clamp(O.s * k, 2, 400);
    O.c.copy(pw).addScaledVector(R, -nx * O.s * a).addScaledVector(U, -ny * O.s); ponerOrto(); }
  dom.addEventListener("pointerdown", (e) => { punteros.set(e.pointerId, [e.clientX, e.clientY]); arr = { x: e.clientX, y: e.clientY, mov: 0 }; if (punteros.size === 2) { const [a, b] = [...punteros.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: O.s }; } });
  addEventListener("pointerup", (e) => { punteros.delete(e.pointerId); if (punteros.size < 2) pinch0 = null; });
  dom.addEventListener("pointermove", (e) => {
    const prev = punteros.get(e.pointerId); if (prev) { const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; punteros.set(e.pointerId, [e.clientX, e.clientY]); if (arr) arr.mov += Math.abs(dx) + Math.abs(dy);
      if (S.walk) { if (!document.pointerLockElement && !(e.pointerType === "touch" && joy.id === e.pointerId)) mirar(dx, dy); }
      else if (esOrto()) { if (punteros.size === 2 && pinch0) { const [a, b] = [...punteros.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); O.s = THREE.MathUtils.clamp(pinch0.s * pinch0.d / Math.max(d, 1), 2, 400); ponerOrto(); }
        else if (arr && arr.mov > 4) { const mpp = 2 * O.s / innerHeight; const R = new THREE.Vector3().setFromMatrixColumn(orto.matrixWorld, 0), U = new THREE.Vector3().setFromMatrixColumn(orto.matrixWorld, 1); O.c.addScaledVector(R, -dx * mpp).addScaledVector(U, dy * mpp); ponerOrto(); } } }
    if (S.activo && !S.walk) hoverSnap(e);
  });
  dom.addEventListener("pointerup", (e) => { if (!S.activo || S.walk || !S.herr) return; if (arr && arr.mov < 6) { const sp = snapEn(e.clientX, e.clientY, e.pointerType === "touch" ? 26 : 14); if (sp) agregarPunto(sp.p); } });
  dom.addEventListener("dblclick", () => { if (S.herr === "poli" || S.herr === "area") terminar(); });

  // ---------- Snap ----------
  const ray = new THREE.Raycaster(); const suelo = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const visHondo = (o) => { while (o) { if (!o.visible) return false; o = o.parent; } return true; };
  const marca = document.createElement("div"); marca.id = "cadSnap"; document.body.appendChild(marca);
  const aPant = (v) => { const q = v.clone().project(cam()); return [(q.x * .5 + .5) * innerWidth, (-q.y * .5 + .5) * innerHeight, q.z]; };
  function snapEn(x, y, thr = 14) {
    const c = cam(); ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), c);
    let best = null, bd = thr;
    if (grupos.INSTALACIONES.visible || true) for (const v of SNAPV) { const [sx, sy, sz] = aPant(v); if (sz > 1 || sz < -1) continue; const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = { p: v.clone(), t: "vértice" }; } }
    if (best) return best;
    const pr = new THREE.Vector3(), ps = new THREE.Vector3(); bd = thr;
    for (const [a, b] of SNAPE) { ray.ray.distanceSqToSegment(a, b, pr, ps); const [sx, sy, sz] = aPant(ps); if (sz > 1) continue; const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = { p: ps.clone(), t: "arista" }; } }
    if (best) return best;
    const hits = ray.intersectObjects(pick.filter(visHondo), false); if (hits.length) return { p: hits[0].point.clone(), t: "superficie" };
    const g = new THREE.Vector3(); if (ray.ray.intersectPlane(suelo, g)) return { p: g, t: "terreno" };
    return null;
  }
  let ultimoSnap = null;
  function hoverSnap(e) {
    if (e.pointerType === "touch") return; const sp = snapEn(e.clientX, e.clientY); ultimoSnap = sp; if (!sp) { marca.style.display = "none"; return; }
    const [sx, sy] = aPant(sp.p); marca.style.display = "block"; marca.className = sp.t === "vértice" ? "sv" : sp.t === "arista" ? "se" : "sl"; marca.style.left = sx + "px"; marca.style.top = sy + "px"; marca.title = sp.t;
    const q = P(sp.p); $("#utm").innerHTML = `<b style="color:#ffde59">SNAP · ${sp.t}</b><br>Local X ${f2(q.x)} · Y ${f2(q.y)} · Z ${f2(sp.p.y)} m<br>UTM 13R · E ${f2(D.utm.E0 + q.x)} · N ${f2(D.utm.N0 + q.y)}`;
    if (S.herr && S.pts.length) previa(sp.p);
  }

  // ---------- Medición ----------
  const medG = new THREE.Group(); raiz.add(medG); const mMed = lm(0xffde59), mPrev = lm(0xffde59, .6); const medidas = [];
  let prevL = null, prevE = null;
  const herrNom = { dist: "Distancia", poli: "Longitud de polilínea", area: "Área", alt: "Altura", ang: "Ángulo" };
  function usarHerr(h) { S.herr = S.herr === h ? null : h; S.pts = []; limpiarPrev(); document.querySelectorAll("[data-herr]").forEach((b) => b.classList.toggle("on", b.dataset.herr === S.herr)); estado(); }
  function estado(txt) { const el = $("#cadEstado"); if (!el) return; el.innerHTML = txt || (S.herr ? `<b>${herrNom[S.herr]}</b> · ${S.herr === "ang" ? "clic: punto A, vértice, punto B" : S.herr === "poli" || S.herr === "area" ? "clic para añadir puntos · doble clic / Enter / ✔ para terminar" : "clic en 2 puntos"} · snap a vértices y aristas` : "Seleccione una herramienta de medición"); }
  function limpiarPrev() { if (prevL) { medG.remove(prevL); prevL = null; } if (prevE) { prevE.el.remove(); etiquetas.splice(etiquetas.indexOf(prevE), 1); prevE = null; } }
  function previa(p) { limpiarPrev(); const last = S.pts[S.pts.length - 1]; const pts = S.herr === "area" && S.pts.length > 1 ? [...S.pts, p, S.pts[0]] : [last, p];
    prevL = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mPrev); prevL.renderOrder = 950; medG.add(prevL);
    const d = last.distanceTo(p); prevE = etiqueta(f2(d) + " m", last.clone().lerp(p, .5), "_med", "cmed prev"); }
  function punto(p, grupo) { const s = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffde59, depthTest: false })); s.renderOrder = 960; s.position.copy(p); grupo.add(s); }
  function agregarPunto(p) {
    S.pts.push(p.clone()); const g = new THREE.Group(); medG.add(g); punto(p, g); if (!S.tmp) S.tmp = []; S.tmp.push(g);
    if (S.pts.length > 1 && S.herr !== "alt") { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(S.pts.slice(-2)), mMed); l.renderOrder = 950; g.add(l); }
    const n = S.pts.length;
    if ((S.herr === "dist" || S.herr === "alt") && n === 2) terminar(); else if (S.herr === "ang" && n === 3) terminar();
    limpiarPrev();
  }
  function terminar() {
    const pts = S.pts; if (!pts.length) return; const g = new THREE.Group(); medG.add(g); (S.tmp || []).forEach((t) => { medG.remove(t); t.traverse((o) => g.add(o.clone())); }); S.tmp = [];
    const ets = []; let res = "";
    const loc = (v) => P(v);
    if (S.herr === "dist" && pts.length === 2) { const d = pts[0].distanceTo(pts[1]); const a = loc(pts[0]), b = loc(pts[1]); const dh = Math.hypot(a.x - b.x, a.y - b.y);
      res = `Distancia ${f2(d)} m · horizontal ${f2(dh)} m · Δz ${f2(pts[1].y - pts[0].y)} m`; ets.push(etiqueta(`<b>${f2(d)} m</b>`, pts[0].clone().lerp(pts[1], .5), "_med", "cmed")); }
    else if (S.herr === "poli" && pts.length >= 2) { let L = 0; for (let i = 1; i < pts.length; i++) { const d = pts[i - 1].distanceTo(pts[i]); L += d; ets.push(etiqueta(f2(d), pts[i - 1].clone().lerp(pts[i], .5), "_med", "cmed peq")); }
      res = `Polilínea ${pts.length - 1} tramos · L = ${f2(L)} m`; ets.push(etiqueta(`<b>L = ${f2(L)} m</b>`, pts[pts.length - 1].clone().add(new THREE.Vector3(0, 1.2, 0)), "_med", "cmed")); }
    else if (S.herr === "area" && pts.length >= 3) { const q = pts.map(loc); let A = 0, per = 0; for (let i = 0; i < q.length; i++) { const j = (i + 1) % q.length; A += q[i].x * q[j].y - q[j].x * q[i].y; per += Math.hypot(q[j].x - q[i].x, q[j].y - q[i].y); } A = Math.abs(A) / 2;
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pts[pts.length - 1], pts[0]]), mMed); l.renderOrder = 950; g.add(l);
      const sh = new THREE.Shape(q.map((v) => new THREE.Vector2(v.x - 100, v.y - 100))); const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0xffde59, transparent: true, opacity: .22, depthTest: false, side: THREE.DoubleSide }));
      m.rotation.x = -Math.PI / 2; m.position.y = Math.max(...pts.map((p) => p.y)) + .05; m.renderOrder = 940; g.add(m);
      const c = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
      res = `Área ${f2(A)} m² · perímetro ${f2(per)} m`; ets.push(etiqueta(`<b>${f2(A)} m²</b><br><small>P ${f2(per)} m</small>`, c, "_med", "cmed")); }
    else if (S.herr === "alt" && pts.length === 2) { const [a, b] = pts; const top = new THREE.Vector3(a.x, b.y, a.z); const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, top, b]), mMed); l.renderOrder = 950; g.add(l);
      res = `Altura Δh = ${f2(Math.abs(b.y - a.y))} m (de Z ${f2(a.y)} a Z ${f2(b.y)})`; ets.push(etiqueta(`<b>Δh ${f2(Math.abs(b.y - a.y))} m</b>`, a.clone().lerp(top, .5), "_med", "cmed")); }
    else if (S.herr === "ang" && pts.length === 3) { const u = pts[0].clone().sub(pts[1]).normalize(), v = pts[2].clone().sub(pts[1]).normalize(); const ang = Math.acos(THREE.MathUtils.clamp(u.dot(v), -1, 1)) * 180 / Math.PI;
      res = `Ángulo ${f2(ang)}°`; ets.push(etiqueta(`<b>∠ ${f2(ang)}°</b>`, pts[1].clone(), "_med", "cmed")); }
    else { medG.remove(g); S.pts = []; return; }
    medidas.push({ g, ets, res }); S.pts = []; limpiarPrev(); estado(`<b style="color:#ffde59">${res}</b>`); listaMed();
  }
  function borrarMed() { for (const m of medidas) { medG.remove(m.g); for (const e of m.ets) { e.el.remove(); etiquetas.splice(etiquetas.indexOf(e), 1); } } medidas.length = 0; (S.tmp || []).forEach((t) => medG.remove(t)); S.tmp = []; S.pts = []; limpiarPrev(); listaMed(); estado(); }
  function listaMed() { const el = $("#cadMeds"); if (el) el.innerHTML = medidas.map((m, i) => `<div>${i + 1}. ${m.res}</div>`).join(""); }
  addEventListener("keydown", (e) => { if (!S.activo) return; if (e.key === "Enter") terminar(); if (e.key === "Escape") { S.pts = []; (S.tmp || []).forEach((t) => medG.remove(t)); S.tmp = []; limpiarPrev(); } });

  // ---------- Visualización: alambre / rayos X / corte ----------
  const mats = new Set(); const recolecta = () => { mats.clear(); scene.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && !raiz.getObjectById(o.id)) { (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m && !m.isShaderMaterial && m !== undefined) mats.add(m); }); } }); };
  function display(modo) { S.disp = modo; recolecta(); for (const m of mats) { if (m.userData.d0 === undefined) m.userData.d0 = { t: m.transparent, o: m.opacity, dw: m.depthWrite, w: m.wireframe, s: m.side };
      const d0 = m.userData.d0; m.wireframe = modo === "alambre" ? true : d0.w; m.transparent = modo === "rayosx" ? true : d0.t; m.opacity = modo === "rayosx" ? Math.min(d0.o, .22) : d0.o; m.depthWrite = modo === "rayosx" ? false : d0.dw;
      m.side = S.corte ? THREE.DoubleSide : d0.s; m.needsUpdate = true; }
    document.querySelectorAll("[data-disp]").forEach((b) => b.classList.toggle("on", b.dataset.disp === modo)); }
  const plano = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  const helper = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: .08, side: THREE.DoubleSide, depthWrite: false })); helper.visible = false; scene.add(helper);
  const helperBorde = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), lm(0xff3b3b, .9)); helper.add(helperBorde);
  function corte(eje, val) { // eje: null|'x'|'y'|'z' ; val en metros locales (x,y) o altura
    S.corte = eje ? { eje, val } : null; helper.visible = !!eje;
    if (!eje) renderer.clippingPlanes = []; else {
      if (eje === "x") { plano.normal.set(-1, 0, 0); plano.constant = val - 100; helper.position.set(val - 100, 15, 0); helper.rotation.set(0, Math.PI / 2, 0); helper.scale.set(210, 30, 1); }
      if (eje === "y") { plano.normal.set(0, 0, 1); plano.constant = val - 100; helper.position.set(0, 15, 100 - val); helper.rotation.set(0, 0, 0); helper.scale.set(210, 30, 1); }
      if (eje === "z") { plano.normal.set(0, -1, 0); plano.constant = val; helper.position.set(0, val, 0); helper.rotation.set(-Math.PI / 2, 0, 0); helper.scale.set(210, 210, 1); }
      renderer.clippingPlanes = [plano]; }
    display(S.disp); const sl = $("#cadCorteV"); if (sl && eje) { sl.max = eje === "z" ? 12 : 200; sl.step = eje === "z" ? .1 : .5; sl.value = val; $("#cadCorteTxt").textContent = (eje === "z" ? "Z = " : eje.toUpperCase() + " = ") + f2(val) + " m"; }
    document.querySelectorAll("[data-corte]").forEach((b) => b.classList.toggle("on", b.dataset.corte === (eje || "off")));
  }
  // Líneas de corte no deben recortarse (rejilla/etiquetas): las de CAD sí siguen al plano para leer la sección.

  // ---------- Capas ----------
  const capaVis = Object.fromEntries(CAPAS.map(([n]) => [n, true]));
  const entTag = {}; scene.traverse((o) => { if (o.userData.capa) (entTag[o.userData.capa] ||= []).push(o); });
  function capa(n, on) { capaVis[n] = on; grupos[n].visible = on; const c = CAPAS.find((q) => q[0] === n);
    if (c[2] && flujos[c[2]]) flujos[c[2]].grupo.visible = on && S.redes3d;
    if (n === "INSTALACIONES") { for (const id in fac) fac[id].visible = on && !(S.inter && INTERIORES[id]); inter.visible = on && S.inter; }
    if (n === "TEXTOS") document.querySelector("#etiquetas").style.visibility = on ? "" : "hidden";
    (entTag[n] || []).forEach((o) => (o.visible = on));
    const i = document.querySelector(`[data-capacad="${n}"]`); if (i) i.checked = on; }

  // ---------- Recorrido en primera persona ----------
  const WK = { yaw: 0, pitch: 0, x: 115, y: 4, v: new THREE.Vector3() };
  const joy = { id: null, x: 0, y: 0, cx: 0, cy: 0 };
  const teclas = {}; addEventListener("keydown", (e) => (teclas[e.key.toLowerCase()] = true)); addEventListener("keyup", (e) => (teclas[e.key.toLowerCase()] = false));
  function colisiones() { const seg = [...COL.seg], circ = [...COL.circ];
    const r4 = (x0, y0, x1, y1) => { const c = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; c.forEach((q, i) => seg.push([q, c[(i + 1) % 4], 0])); };
    for (const f of D.instalaciones) { if (NO_SOLIDO.has(f.tipo) || INTERIORES[f.id] && S.inter) continue; if (f.geom === "circ") circ.push([[f.cx, f.cy], f.d / 2]); else r4(f.x0, f.y0, f.x1, f.y1); }
    seg.push([[0, 0], [109, 0], 0], [[121, 0], [200, 0], 0], [[200, 0], [200, 200], 0], [[200, 200], [0, 200], 0], [[0, 200], [0, 0], 0]); return { seg, circ }; }
  let CL = null; const RAD = .35;
  function resolver(p) { for (let it = 0; it < 3; it++) { for (const [a, b, e] of CL.seg) { const dx = b[0] - a[0], dy = b[1] - a[1]; const L2 = dx * dx + dy * dy || 1; let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2; t = Math.max(0, Math.min(1, t)); const qx = a[0] + t * dx, qy = a[1] + t * dy; const ex = p[0] - qx, ey = p[1] - qy; const d = Math.hypot(ex, ey), R = RAD + e;
        if (d < R) { if (d < 1e-6) { p[0] += R; continue; } p[0] = qx + ex / d * R; p[1] = qy + ey / d * R; } }
      for (const [c, r] of CL.circ) { const ex = p[0] - c[0], ey = p[1] - c[1]; const d = Math.hypot(ex, ey), R = RAD + r; if (d < R && d > 1e-6) { p[0] = c[0] + ex / d * R; p[1] = c[1] + ey / d * R; } } } return p; }
  function mirar(dx, dy) { WK.yaw -= dx * .0035; WK.pitch = THREE.MathUtils.clamp(WK.pitch - dy * .0035, -1.4, 1.4); }
  function caminar(on, en) {
    S.walk = on; document.body.classList.toggle("cadwalk", on); controls.enabled = !on;
    if (on) { if (en) { const f = D.instalaciones.find((q) => q.id === en); const I = INTERIORES[en]; if (f && I) { WK.x = f.x0 + I.inicio[0]; WK.y = f.y0 + I.inicio[1]; WK.yaw = I.inicio[2] * Math.PI / 180; } else if (f) { WK.x = (f.x0 ?? f.cx) - 3; WK.y = f.y0 ?? f.cy; } }
      else { const p = P(camera.position); if (p.x > 0 && p.x < 200 && p.y > 0 && p.y < 200 && camera.position.y < 30) { WK.x = p.x; WK.y = p.y; } else { WK.x = 115; WK.y = 6; WK.yaw = 0; } }
      WK.pitch = -.05; verInteriores(true, true); CL = colisiones(); resolver([WK.x, WK.y]); camera.fov = 68; camera.near = .05; camera.updateProjectionMatrix(); camera.rotation.order = "YXZ"; display(S.disp === "rayosx" ? "sombreado" : S.disp);
      $("#cadWalkHud").classList.remove("oculto"); }
    else { if (document.pointerLockElement) document.exitPointerLock(); camera.fov = 42; camera.near = .5; camera.updateProjectionMatrix(); verInteriores(S.inter, false);
      const p = W(WK.x, WK.y, 1.7); const fw = new THREE.Vector3(-Math.sin(WK.yaw), 0, -Math.cos(WK.yaw)); controls.target.copy(p).addScaledVector(fw, 10); camera.position.copy(p).addScaledVector(fw, -25).add(new THREE.Vector3(0, 18, 0)); controls.update(); $("#cadWalkHud").classList.add("oculto"); }
    $("#cadWalk") && $("#cadWalk").classList.toggle("on", on);
  }
  dom.addEventListener("click", () => { if (S.walk && !touch && dom.requestPointerLock && !document.pointerLockElement) try { dom.requestPointerLock(); } catch (e) {} });
  document.addEventListener("mousemove", (e) => { if (S.walk && document.pointerLockElement === dom) mirar(e.movementX, e.movementY); });
  function walkUpdate(dt) {
    const fw = [-Math.sin(WK.yaw), Math.cos(WK.yaw)], rt = [Math.cos(WK.yaw), Math.sin(WK.yaw)]; // local: y Norte
    let mx = 0, my = 0; if (teclas.w || teclas.arrowup) my += 1; if (teclas.s || teclas.arrowdown) my -= 1; if (teclas.d || teclas.arrowright) mx += 1; if (teclas.a || teclas.arrowleft) mx -= 1;
    if (joy.id !== null) { mx += joy.x; my += -joy.y; }
    const v = (teclas.shift ? 7 : 3) * dt; const L = Math.hypot(mx, my); if (L > 0) { const k = v / Math.max(1, L); const p = [WK.x + (fw[0] * my + rt[0] * mx) * k, WK.y + (fw[1] * my + rt[1] * mx) * k]; resolver(p); WK.x = p[0]; WK.y = p[1]; }
    camera.position.copy(W(WK.x, WK.y, 1.7)); camera.rotation.set(WK.pitch, WK.yaw, 0, "YXZ");
    const q = P(camera.position); $("#utm").innerHTML = `<b style="color:#7cf0a9">PRIMERA PERSONA · ojo 1.70 m</b><br>Local X ${f2(q.x)} · Y ${f2(q.y)} m · rumbo ${f2(((-WK.yaw * 180 / Math.PI) % 360 + 360) % 360)}°<br>UTM 13R · E ${f2(D.utm.E0 + q.x)} · N ${f2(D.utm.N0 + q.y)}`;
  }
  // joystick táctil
  const jz = document.createElement("div"); jz.id = "cadJoy"; jz.innerHTML = "<i></i>"; document.body.appendChild(jz);
  jz.addEventListener("pointerdown", (e) => { joy.id = e.pointerId; const r = jz.getBoundingClientRect(); joy.cx = r.left + r.width / 2; joy.cy = r.top + r.height / 2; jz.setPointerCapture(e.pointerId); e.stopPropagation(); });
  jz.addEventListener("pointermove", (e) => { if (e.pointerId !== joy.id) return; let dx = (e.clientX - joy.cx) / 50, dy = (e.clientY - joy.cy) / 50; const L = Math.hypot(dx, dy); if (L > 1) { dx /= L; dy /= L; } joy.x = dx; joy.y = dy; jz.firstChild.style.transform = `translate(${dx * 40}px,${dy * 40}px)`; });
  const sueltaJoy = (e) => { if (e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.y = 0; jz.firstChild.style.transform = ""; }; jz.addEventListener("pointerup", sueltaJoy); jz.addEventListener("pointercancel", sueltaJoy);

  // ---------- UI ----------
  const bar = document.createElement("div"); bar.id = "cadBar"; bar.className = "panel oculto";
  bar.innerHTML = `<div class="cg"><h4>Vista</h4><button data-cv="planta">Planta</button><button data-cv="alzS">Alzado S</button><button data-cv="alzN">Alzado N</button><button data-cv="alzE">Alzado E</button><button data-cv="alzO">Alzado O</button><button data-cv="3d">3D</button></div>
  <div class="cg"><h4>Estilo</h4><button data-disp="sombreado" class="on">Sombreado</button><button data-disp="alambre">Alambre</button><button data-disp="rayosx">Rayos X</button></div>
  <div class="cg"><h4>Corte</h4><button data-corte="off" class="on">Sin corte</button><button data-corte="x">X (E-O)</button><button data-corte="y">Y (N-S)</button><button data-corte="z">Z (altura)</button><input type="range" id="cadCorteV" min="0" max="200" step=".5" value="30"><span id="cadCorteTxt"></span></div>
  <div class="cg"><h4>Medir</h4><button data-herr="dist" title="Distancia">⟷ Dist.</button><button data-herr="poli" title="Longitud de polilínea">〰 Polilínea</button><button data-herr="area" title="Área">▱ Área</button><button data-herr="alt" title="Altura">↕ Altura</button><button data-herr="ang" title="Ángulo">∠ Ángulo</button><button id="cadFin" title="Terminar">✔</button><button id="cadBorrar" title="Borrar medidas">🗑</button></div>
  <div class="cg"><h4>Ver</h4><label class="sw"><input type="checkbox" id="cadCotas" checked><span></span>Cotas</label><label class="sw"><input type="checkbox" id="cadRej" checked><span></span>Rejilla</label><label class="sw"><input type="checkbox" id="cadInt"><span></span>Interiores</label><label class="sw"><input type="checkbox" id="cadRedes"><span></span>Redes 3D</label></div>
  <div class="cg"><button id="cadWalk">🚶 Primera persona</button><button id="cadCapasBtn">☰ Capas</button><a id="cadDxf" class="btn" href="data/NODO_VAH_PL-01_a_PL-05_conjunto_UTM13R.dxf" download>⬇ Descargar DXF</a></div>
  <div id="cadEstado"></div><div id="cadMeds"></div>`;
  document.body.appendChild(bar);
  const pc = document.createElement("div"); pc.id = "cadCapas"; pc.className = "panel oculto"; pc.innerHTML = `<button class="cerrar" id="cadCapasX">×</button><h3>Administrador de capas (DXF)</h3>` + CAPAS.map(([n, c]) => `<label class="sw" style="--c:${c}"><input type="checkbox" data-capacad="${n}" checked><span></span><i></i><code>${n}</code></label>`).join("") + `<p class="peq">Mismas capas que el DXF UTM 13R de planos/.</p>`;
  document.body.appendChild(pc);
  const hud = document.createElement("div"); hud.id = "cadWalkHud"; hud.className = "panel oculto"; hud.innerHTML = `<b>Primera persona</b> · ${touch ? "joystick para caminar, arrastre para mirar" : "W A S D / flechas · ratón para mirar (clic para capturar) · Shift = correr"} · colisiones activas <button id="cadWalkX">Salir</button><div class="ir">Ir a: <button data-ir="PL-501">Planta láctea</button><button data-ir="AD-601">Administración</button><button data-ir="FA-701">Filtros/UV</button><button data-ir="B-301">Sopladores</button></div>`;
  document.body.appendChild(hud); const mira = document.createElement("div"); mira.id = "cadMira"; document.body.appendChild(mira);
  bar.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.cv) vista(b.dataset.cv); if (b.dataset.disp) display(b.dataset.disp); if (b.dataset.herr) usarHerr(b.dataset.herr);
    if (b.dataset.corte) corte(b.dataset.corte === "off" ? null : b.dataset.corte, b.dataset.corte === "z" ? 3 : 60);
    if (b.id === "cadFin") terminar(); if (b.id === "cadBorrar") borrarMed(); if (b.id === "cadWalk") caminar(!S.walk); if (b.id === "cadCapasBtn") pc.classList.toggle("oculto"); });
  $("#cadCorteV").addEventListener("input", (e) => S.corte && corte(S.corte.eje, +e.target.value));
  $("#cadCotas").addEventListener("change", (e) => capa("COTAS_UTM", e.target.checked));
  $("#cadRej").addEventListener("change", (e) => (rej.visible = e.target.checked));
  $("#cadInt").addEventListener("change", (e) => verInteriores(e.target.checked, S.walk));
  $("#cadRedes").addEventListener("change", (e) => { S.redes3d = e.target.checked; for (const c of CAPAS) if (c[2] && flujos[c[2]]) flujos[c[2]].grupo.visible = e.target.checked && capaVis[c[0]]; });
  pc.addEventListener("change", (e) => { const n = e.target.dataset.capacad; if (n) capa(n, e.target.checked); }); $("#cadCapasX").onclick = () => pc.classList.add("oculto");
  $("#cadWalkX").onclick = () => caminar(false); hud.addEventListener("click", (e) => { const b = e.target.closest("[data-ir]"); if (b) caminar(true, b.dataset.ir); });

  function vista(v) {
    S.vista = v; document.querySelectorAll("[data-cv]").forEach((b) => b.classList.toggle("on", b.dataset.cv === v)); if (S.walk) caminar(false);
    if (v !== "3d") { const [d, u] = VDIR[v]; O.dir.set(...d); O.up.set(...u); if (v === "planta") { O.c.set(0, 0, 0); O.s = 112; } else { O.c.set(0, 12, 0); O.s = 40; } ponerOrto(); controls.enabled = false; scene.fog = null; }
    else { controls.enabled = true; scene.fog = S.fog; }
  }
  function activar(on) { S.activo = on; bar.classList.toggle("oculto", !on); document.body.classList.toggle("cad", on); raiz.visible = on; etq.style.display = on ? "" : "none";
    $("#btnCAD").classList.toggle("on", on);
    if (on) { S.fog = S.fog || scene.fog; vista(S.vista || "planta"); estado(); if (innerWidth > 820) pc.classList.remove("oculto"); } else { if (S.walk) caminar(false); controls.enabled = true; scene.fog = S.fog || scene.fog; corte(null); display("sombreado"); verInteriores(false); usarHerr(null); marca.style.display = "none"; } }
  raiz.visible = false; etq.style.display = "none";

  // ---------- por cuadro ----------
  const tmp = new THREE.Vector3();
  function update(dt) {
    if (!S.activo) return;
    if (S.walk) walkUpdate(dt);
    const c = cam(); c.updateMatrixWorld();
    const mpp = esOrto() ? 2 * O.s / innerHeight : null;
    g1.visible = esOrto() ? O.s < 45 : camera.position.y < 60;
    for (const t of etiquetas) {
      const vis = (t.capa[0] === "_" ? (t.capa === "_int" ? S.inter && inter.visible && (S.walk ? c.position.distanceTo(t.p) < 18 : esOrto() ? O.s < 30 : c.position.distanceTo(t.p) < 60) : t.capa === "_rej" ? rej.visible && esOrto() && S.vista === "planta" : true) : capaVis[t.capa]) && !(S.walk && t.capa !== "_int" && t.capa !== "_med");
      if (!vis) { t.el.style.display = "none"; continue; }
      tmp.copy(t.p).project(c); if (tmp.z > 1 || tmp.z < -1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05) { t.el.style.display = "none"; continue; }
      if (t.a) { const A = t.a.clone().project(c), B = t.b.clone().project(c); const px = Math.hypot((A.x - B.x) * innerWidth / 2, (A.y - B.y) * innerHeight / 2); if (px < t.min) { t.el.style.display = "none"; continue; } }
      if (S.corte && t.capa !== "_med") { const d = plano.distanceToPoint(t.p); if (d < -0.01) { t.el.style.display = "none"; continue; } }
      t.el.style.display = ""; t.el.style.transform = `translate(${((tmp.x * .5 + .5) * innerWidth).toFixed(1)}px,${((-tmp.y * .5 + .5) * innerHeight).toFixed(1)}px) translate(-50%,-50%)`;
    }
    if (esOrto()) { const nice = [1, 2, 5, 10, 20, 25, 50, 100].find((n) => n / mpp >= 70) || 100; $("#escBar").style.width = (nice / mpp).toFixed(0) + "px"; $("#escTxt").textContent = nice + " m · escala gráfica (" + (S.vista === "planta" ? "planta" : "alzado") + ")"; }
    if (ultimoSnap && marca.style.display === "block") { const [sx, sy] = aPant(ultimoSnap.p); marca.style.left = sx + "px"; marca.style.top = sy + "px"; }
  }
  window.addEventListener("resize", () => esOrto() && ponerOrto());
  const api = { activar, vista, display, corte, capa, usarHerr, agregarPunto, terminar, borrarMed, caminar, verInteriores, update, cam, esOrto, bloquea: () => S.activo && (S.walk || esOrto()), ocupado: () => S.activo && (!!S.herr || S.walk), S, O, ponerOrto, zoomEn, W, P, WK };
  return api;
}
