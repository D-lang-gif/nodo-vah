import * as THREE from "../vendor/three.module.min.js";
import { OrbitControls } from "../vendor/addons/OrbitControls.js";
import { RoomEnvironment } from "../vendor/addons/RoomEnvironment.js";
import { W, P } from "./util.js";
import { crearMateriales, M } from "./materiales.js";
import { construir } from "./constructores.js";
import { crearEntorno } from "./entorno.js";
import { crearFlujos, uTiempo } from "./flujos.js";
import { initCAD } from "./cad.js";
import { initPresupuesto } from "./presupuesto.js";

const D = window.NODO_DATA; const Q = new URLSearchParams(location.search + location.hash.replace(/^#/, "&"));
const $ = (s) => document.querySelector(s);
if (Q.get("ui") === "0") document.body.classList.add("sinui");

// ---------- Render ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82; renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$("#lienzo").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .5, 6000);
const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = .08; controls.maxPolarAngle = Math.PI * .495; controls.minDistance = 4; controls.maxDistance = 1400;
const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;

// cielo con gradiente
const cieloU = { top: { value: new THREE.Color("#3f7fc4") }, bot: { value: new THREE.Color("#e9e1cf") }, sol: { value: new THREE.Vector3(0, 1, 0) }, noche: { value: 0 } };
const cielo = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: cieloU,
  vertexShader: `varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform vec3 top; uniform vec3 bot; uniform vec3 sol; uniform float noche; varying vec3 vP;
   float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,45.164)))*43758.5453);}
   void main(){ float t=pow(max(vP.y,0.),.55); vec3 c=mix(bot,top,t); float s=max(dot(vP,normalize(sol)),0.); c+= vec3(1.,.85,.6)*pow(s,350.)*(1.-noche)*3.+vec3(1.,.8,.5)*pow(s,8.)*.25*(1.-noche);
   if(noche>.5 && vP.y>0.05){ vec3 q=floor(vP*420.); float st=step(.9975,h(q)); c+=vec3(st)*.9*(vP.y);} gl_FragColor=vec4(c,1.);} ` }));
scene.add(cielo);
scene.fog = new THREE.Fog(0xe2d9c6, 500, 2600);

const hemi = new THREE.HemisphereLight(0xbcd8ff, 0x6b5638, .45); scene.add(hemi);
const sol = new THREE.DirectionalLight(0xffe9cc, 3.2); sol.castShadow = true; sol.shadow.mapSize.set(3072, 3072);
Object.assign(sol.shadow.camera, { left: -140, right: 140, top: 140, bottom: -140, near: 10, far: 700 }); sol.shadow.bias = -.0004; sol.shadow.normalBias = .4; sol.shadow.radius = 3;
sol.position.set(-210, 170, 150); scene.add(sol); scene.add(sol.target);

crearMateriales();
const ent = crearEntorno(scene, D);
const fac = {}; const pick = [];
for (const f of D.instalaciones) { const g = construir(f); scene.add(g); fac[f.id] = g; g.traverse((m) => { if (m.isMesh || m.isInstancedMesh) pick.push(m); }); }
const flujos = crearFlujos(scene, D);
const luzNoche = []; for (const p of ent.lamparas.filter((_, i) => i % 3 === 0)) { const l = new THREE.PointLight(0xffc77a, 0, 40, 1.6); l.position.copy(p).add(new THREE.Vector3(0, -.5, 0)); scene.add(l); luzNoche.push(l); }

// ---------- Etiquetas ----------
const etDiv = $("#etiquetas"); const etiquetas = [];
for (const b of D.bloques) { const e = document.createElement("div"); e.className = "et"; e.style.setProperty("--c", b.color); e.textContent = b.nombre.replace(" (supuesto)", ""); etDiv.appendChild(e); etiquetas.push({ e, p: W((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, b.id === "BLQ-C" || b.id === "BLQ-D" ? 16 : 12) }); }
function actualizarEtiquetas() {
  if (!$("#chkEtiq").checked) { etDiv.style.display = "none"; return; } etDiv.style.display = "";
  for (const t of etiquetas) { const v = t.p.clone().project(CAM()); const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1; t.e.style.display = vis ? "" : "none"; if (vis) { t.e.style.left = (v.x * .5 + .5) * innerWidth + "px"; t.e.style.top = (-v.y * .5 + .5) * innerHeight + "px"; } }
}

// ---------- Capas UI ----------
const cont = $("#capas");
for (const k in flujos) { const r = flujos[k].red; const l = document.createElement("label"); l.className = "sw"; l.style.setProperty("--c", r.color); l.innerHTML = `<input type="checkbox" data-capa="${k}"><span></span><i></i> ${r.nombre}`; cont.appendChild(l); }
const lb = document.createElement("label"); lb.className = "sw"; lb.innerHTML = `<input type="checkbox" id="chkTodas"><span></span> <b>Todas las redes</b>`; cont.prepend(lb);
cont.addEventListener("change", (e) => { const c = e.target.dataset.capa; if (c) flujos[c].grupo.visible = e.target.checked; if (e.target.id === "chkTodas") cont.querySelectorAll("[data-capa]").forEach((i) => { i.checked = e.target.checked; flujos[i.dataset.capa].grupo.visible = i.checked; }); });
$("#kpis").innerHTML = Object.entries(D.kpi).map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("");

// ---------- Fases ----------
const matFase = D.fases.map((f) => new THREE.MeshStandardMaterial({ color: f.color, roughness: .6, metalness: .1 }));
$("#faseLeyenda").innerHTML = D.fases.map((f) => `<span><i style="background:${f.color}"></i>${f.n} ${f.nombre.split("·")[1]}</span>`).join("");
let modoFases = false;
function aplicarFases() {
  const v = +$("#faseSlider").value; const F = D.fases[v]; $("#faseNom").textContent = F.nombre; $("#faseDet").textContent = F.periodo + " · " + F.detalle;
  for (const id in fac) { const g = fac[id]; const f = g.userData.f; g.visible = !modoFases || f.fase <= v;
    g.traverse((m) => { if (!(m.isMesh || m.isInstancedMesh)) return; if (m.userData.mo === undefined) m.userData.mo = m.material; m.material = modoFases ? matFase[f.fase] : m.userData.mo; }); }
  for (const b of D.bloques) { const m = ent.bloques[b.id]; if (!m) continue; m.material = modoFases ? (b.fase <= v ? matFase[b.fase] : m.userData.matOrig) : m.userData.matOrig; }
  $("#linea").classList.toggle("oculto", !modoFases); $("#linea").classList.toggle("forzar", modoFases);
}
$("#chkFases").addEventListener("change", (e) => { modoFases = e.target.checked; aplicarFases(); });
$("#faseSlider").addEventListener("input", aplicarFases);
$("#chkSup").addEventListener("change", (e) => { const on = e.target.checked; const ms = new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0x5a3000, roughness: .6 });
  for (const id in fac) { const g = fac[id]; g.traverse((m) => { if (!(m.isMesh || m.isInstancedMesh)) return; if (m.userData.mo === undefined) m.userData.mo = m.material; m.material = on && g.userData.f.fuente === "sup" ? ms : m.userData.mo; }); } });

// ---------- Info / selección ----------
const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let hover = null, sel = null;
const halo = new THREE.Mesh(new THREE.RingGeometry(1, 1.15, 64), new THREE.MeshBasicMaterial({ color: 0x5fd1ff, transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false })); halo.rotation.x = -Math.PI / 2; halo.visible = false; scene.add(halo);
const utmTxt = (x, y) => `E ${(D.utm.E0 + x).toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · N ${(D.utm.N0 + y).toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
function centro(f) { return f.geom === "circ" ? [f.cx, f.cy] : [(f.x0 + f.x1) / 2, (f.y0 + f.y1) / 2]; }
function tam(f) { return f.geom === "circ" ? f.d : Math.max(f.x1 - f.x0, f.y1 - f.y0); }
function mostrarInfo(id) {
  const g = fac[id]; if (!g) return; const f = g.userData.f; sel = id; const [x, y] = centro(f); const blq = D.bloques.find((b) => b.id === f.bloque);
  const fila = (k, v) => `<tr><td>${k}</td><td class="${/SUPUESTO/.test(v) ? "sup" : ""}">${v}</td></tr>`;
  $("#infoCont").innerHTML = `<span class="tag">${f.id}</span><span class="badge ${f.fuente === "doc" ? "b-doc" : "b-sup"}">${f.fuente === "doc" ? "DATO DE DOCUMENTO" : "SUPUESTO"}</span>
   <h2>${f.nombre}</h2><div style="color:#8ba0b4;font-size:12px">${blq ? blq.nombre : ""}</div>
   <table>${Object.entries(f.datos).map(([k, v]) => fila(k, v)).join("")}
   ${fila("Fase", D.fases[f.fase].nombre + " · " + D.fases[f.fase].periodo)}
   ${fila("Coordenada UTM 13R (centro)", utmTxt(x, y))}${fila("Coordenada local", `X ${x.toFixed(1)} m · Y ${y.toFixed(1)} m`)}
   ${blq ? fila("Cota de desplante", blq.cota.toFixed(2) + " msnm" + (blq.fuente === "doc" ? "" : " (SUPUESTO)")) : ""}</table>${PRES ? PRES.ficha(f.id) : ""}`;
  $("#panelInfo").classList.remove("oculto");
  const r = tam(f) / 2 + 2; halo.scale.set(r, r, r); halo.position.copy(W(x, y, .3)); halo.visible = true;
}
$("#cerrarInfo").onclick = () => { $("#panelInfo").classList.add("oculto"); halo.visible = false; sel = null; };
const suelo0 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
renderer.domElement.addEventListener("pointermove", (e) => {
  ptr.set(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1); ray.setFromCamera(ptr, CAM());
  const pt = new THREE.Vector3(); if (ray.ray.intersectPlane(suelo0, pt)) { const p = P(pt); const blq = D.bloques.find((b) => p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1);
    $("#utm").innerHTML = `UTM 13R · ${utmTxt(p.x, p.y)}<br><span style="color:#8ba0b4">Local X ${p.x.toFixed(1)} · Y ${p.y.toFixed(1)} m${blq ? " · cota " + blq.cota.toFixed(2) : ""}</span>`; }
  const hits = ray.intersectObjects(pick.filter((m) => m.visible), false); const h = hits.find((x) => x.object.userData.fid);
  const flj = ray.intersectObjects(Object.values(flujos).filter((c) => c.grupo.visible).map((c) => c.grupo), true).find((x) => x.object.userData.tag);
  const tip = $("#tip");
  if (flj && (!h || flj.distance < h.distance)) { tip.style.display = "block"; tip.innerHTML = `<b style="color:${flj.object.material.uniforms.uC.value.getStyle()}">${flj.object.userData.tag}</b> · ${flj.object.userData.red}${flj.object.userData.nota ? "<br>" + flj.object.userData.nota : ""}`; }
  else if (h) { const f = fac[h.object.userData.fid].userData.f; tip.style.display = "block"; tip.innerHTML = `<b>${f.id}</b> · ${f.nombre}`; hover = f.id; renderer.domElement.style.cursor = "pointer"; }
  else { tip.style.display = "none"; hover = null; renderer.domElement.style.cursor = ""; }
  tip.style.left = e.clientX + 14 + "px"; tip.style.top = e.clientY + 12 + "px";
});
let downXY = null; renderer.domElement.addEventListener("pointerdown", (e) => downXY = [e.clientX, e.clientY]);
renderer.domElement.addEventListener("pointerup", (e) => { if (downXY && Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]) < 4 && hover && !(CAD && CAD.ocupado())) mostrarInfo(hover); });

// ---------- Cámaras ----------
const VISTAS = {
  aerea: { p: [6, 285, 60], t: [6, 0, -4] },
  iso: { p: [-138, 112, 166], t: [10, 0, -14] },
  sibra: { p: [-120, 55, -5], t: [-70, 0, -15] },
  peatonal: { p: [15, 1.7, 112], t: [15, 1.7, 60] },
  orbita: { p: [190, 110, -150], t: [0, 0, 0] },
  noreste: { p: [190, 95, -170], t: [0, 0, 0] },
};
let anim = null, modoVista = "iso", caminar = false;
function irA(n, inst = false) {
  if (CAD && CAD.S.activo) CAD.activar(false);
  const v = VISTAS[n]; if (!v) return; modoVista = n; caminar = n === "peatonal"; controls.autoRotate = n === "orbita"; controls.autoRotateSpeed = .6;
  document.querySelectorAll("#vistas button").forEach((b) => b.classList.toggle("on", b.dataset.vista === n));
  const p = new THREE.Vector3(...v.p), t = new THREE.Vector3(...v.t);
  if (n === "peatonal") { controls.maxPolarAngle = Math.PI * .62; controls.minDistance = .1; } else { controls.maxPolarAngle = Math.PI * .495; controls.minDistance = 4; }
  if (inst) { camera.position.copy(p); controls.target.copy(t); controls.update(); return; }
  anim = { p0: camera.position.clone(), t0: controls.target.clone(), p, t, k: 0 };
}
document.querySelectorAll("#vistas button").forEach((b) => b.onclick = () => irA(b.dataset.vista));
const teclas = {}; addEventListener("keydown", (e) => teclas[e.key.toLowerCase()] = true); addEventListener("keyup", (e) => teclas[e.key.toLowerCase()] = false);
function moverPeaton(dt) {
  if (!caminar) return; const f = new THREE.Vector3().subVectors(controls.target, camera.position); f.y = 0; f.normalize(); const r = new THREE.Vector3(-f.z, 0, f.x); const v = 9 * dt; const d = new THREE.Vector3();
  if (teclas.w || teclas.arrowup) d.add(f); if (teclas.s || teclas.arrowdown) d.sub(f); if (teclas.d || teclas.arrowright) d.add(r); if (teclas.a || teclas.arrowleft) d.sub(r);
  if (d.lengthSq()) { d.normalize().multiplyScalar(v); camera.position.add(d); controls.target.add(d); camera.position.y = 1.7; }
}

// ---------- Día / noche ----------
let noche = false;
function aplicarNoche(n) {
  noche = n; $("#btnNoche").textContent = n ? "☾ Noche" : "☀ Día";
  cieloU.top.value.set(n ? "#050b18" : "#3f7fc4"); cieloU.bot.value.set(n ? "#1a2233" : "#e9e1cf"); cieloU.noche.value = n ? 1 : 0;
  scene.fog.color.set(n ? 0x0d1420 : 0xe2d9c6); sol.intensity = n ? .25 : 3.2; sol.color.set(n ? 0x8fb0ff : 0xfff1dc); hemi.intensity = n ? .12 : .45; renderer.toneMappingExposure = n ? 1.2 : .82;
  scene.environmentIntensity = n ? .15 : .6;
  for (const id in fac) { const m = fac[id].userData.ventanas; if (m) { m.emissive.set(n ? 0xffffff : 0x000000); m.emissiveIntensity = n ? 1.1 : 0; } }
  M.lampara.emissive.set(n ? 0xffd28a : 0x000000); M.lampara.emissiveIntensity = n ? 4 : 0; for (const l of luzNoche) l.intensity = n ? 140 : 0;
  for (const k in flujos) flujos[k].grupo.traverse((m) => { if (m.material?.uniforms) m.material.uniforms.uBrillo.value = n ? 1.6 : 1; });
}
$("#btnNoche").onclick = () => aplicarNoche(!noche);
$("#btnAyuda").onclick = () => $("#ayuda").classList.toggle("oculto");

// ---------- Minimapa, norte, escala ----------
const mc = $("#miniCanvas"), mx = mc.getContext("2d"); const S = 220 / 210, O = 5;
const mm = (x, y) => [O + x * S, 220 - O - y * S];
function fondoMini() {
  const c = document.createElement("canvas"); c.width = c.height = 220; const g = c.getContext("2d"); g.fillStyle = "#121b25"; g.fillRect(0, 0, 220, 220);
  g.strokeStyle = "#5fd1ff"; g.lineWidth = 1.2; g.strokeRect(...mm(0, 200), 200 * S, 200 * S);
  for (const b of D.bloques) { const [x, y] = mm(b.x0, b.y1); g.fillStyle = b.color + "40"; g.fillRect(x, y, (b.x1 - b.x0) * S, (b.y1 - b.y0) * S); g.strokeStyle = b.color; g.strokeRect(x, y, (b.x1 - b.x0) * S, (b.y1 - b.y0) * S); }
  g.fillStyle = "#454d56"; for (const v of D.vias) { const [x, y] = mm(v.x0, v.y1); g.fillRect(x, y, (v.x1 - v.x0) * S, (v.y1 - v.y0) * S); }
  for (const f of D.instalaciones) { g.fillStyle = "#e7edf3"; if (f.geom === "circ") { const [x, y] = mm(f.cx, f.cy); g.beginPath(); g.arc(x, y, f.d / 2 * S, 0, 7); g.fill(); } else { const [x, y] = mm(f.x0, f.y1); g.globalAlpha = f.tipo === "reserve" ? .2 : .85; g.fillRect(x, y, (f.x1 - f.x0) * S, (f.y1 - f.y0) * S); g.globalAlpha = 1; } }
  g.fillStyle = "#ffcf73"; g.font = "bold 9px sans-serif"; const [ax, ay] = mm(D.acceso.x, 0); g.fillText("A", ax - 3, ay + 9); return c;
}
const miniBG = fondoMini();
function dibujaMini() {
  mx.drawImage(miniBG, 0, 0); const p = P(camera.position), t = P(controls.target); const [cx, cy] = mm(p.x, p.y), [tx, ty] = mm(t.x, t.y);
  const ang = Math.atan2(ty - cy, tx - cx); mx.fillStyle = "rgba(95,209,255,.18)"; mx.beginPath(); mx.moveTo(cx, cy); mx.arc(cx, cy, 70, ang - .4, ang + .4); mx.closePath(); mx.fill();
  mx.fillStyle = "#5fd1ff"; mx.beginPath(); mx.arc(Math.max(4, Math.min(216, cx)), Math.max(4, Math.min(216, cy)), 4, 0, 7); mx.fill(); mx.strokeStyle = "#fff"; mx.beginPath(); mx.arc(tx, ty, 3, 0, 7); mx.stroke();
}
mc.onclick = (e) => { const r = mc.getBoundingClientRect(); const x = (e.clientX - r.left - O) / S, y = (220 - O - (e.clientY - r.top)) / S; const nt = W(x, y); const d = new THREE.Vector3().subVectors(camera.position, controls.target); anim = { p0: camera.position.clone(), t0: controls.target.clone(), p: nt.clone().add(d), t: nt, k: 0 }; };
function norteEscala() {
  const az = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z); $("#rosa").setAttribute("transform", `rotate(${(az * 180 / Math.PI).toFixed(1)} 30 30)`);
  const dist = camera.position.distanceTo(controls.target); const mpp = 2 * dist * Math.tan(camera.fov * Math.PI / 360) / innerHeight; const objetivo = 120 * mpp;
  const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find((n) => n >= objetivo * .6) || 500; $("#escBar").style.width = (nice / mpp).toFixed(0) + "px"; $("#escTxt").textContent = nice + " m (al centro de la vista)";
}

// ---------- Bucle ----------
const reloj = new THREE.Clock(); let frames = 0;
function loop() {
  const dt = Math.min(reloj.getDelta(), .05); uTiempo.value += dt;
  M.aguaNormal.offset.x += dt * .01; M.aguaNormal.offset.y += dt * .006;
  for (const id in fac) { const gg = fac[id].userData.giro; if (gg) gg.rotation.y += dt * .08; }
  if (anim) { anim.k = Math.min(1, anim.k + dt * .9); const e = anim.k < .5 ? 4 * anim.k ** 3 : 1 - (-2 * anim.k + 2) ** 3 / 2; camera.position.lerpVectors(anim.p0, anim.p, e); controls.target.lerpVectors(anim.t0, anim.t, e); if (anim.k >= 1) anim = null; }
  halo.material.opacity = .55 + .35 * Math.sin(uTiempo.value * 3);
  moverPeaton(dt); if (CAD) CAD.update(dt); if (!(CAD && CAD.bloquea())) controls.update(); renderer.render(scene, CAM()); actualizarEtiquetas(); dibujaMini(); if (!(CAD && CAD.esOrto())) norteEscala();
  if (++frames === 40) { window.__LISTO = true; document.title = "NODO VAH · listo"; }
  requestAnimationFrame(loop);
}
addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

// ---------- CAD + presupuesto ----------
let CAD = null; const CAM = () => (CAD ? CAD.cam() : camera);
const PRES = initPresupuesto();
CAD = initCAD({ scene, camera, controls, renderer, fac, flujos, D, pick, utmTxt });
$("#btnCAD").onclick = () => CAD.activar(!CAD.S.activo);
// ---------- Parámetros iniciales ----------
irA(Q.get("vista") || "iso", true);
scene.environmentIntensity = .6;
$("#utm").innerHTML = `UTM 13R · ${utmTxt(100, 100)}<br><span style="color:#8ba0b4">Centro del predio · BM ${D.bm.toFixed(2)} msnm</span>`;
if (Q.get("flujos")) { const lista = Q.get("flujos") === "1" ? Object.keys(flujos) : Q.get("flujos").split(","); cont.querySelectorAll("[data-capa]").forEach((i) => { i.checked = lista.includes(i.dataset.capa); flujos[i.dataset.capa].grupo.visible = i.checked; }); }
if (Q.get("fases") === "1") { $("#chkFases").checked = true; modoFases = true; $("#faseSlider").value = Q.get("fase") ?? 4; }
aplicarFases();
if (Q.get("noche") === "1") aplicarNoche(true);
if (Q.get("info")) mostrarInfo(Q.get("info"));
if (Q.get("etiquetas") === "0") $("#chkEtiq").checked = false;
setTimeout(() => { $("#carga").style.opacity = 0; setTimeout(() => $("#carga").remove(), 600); }, 150);
if (Q.get("cad")) { const c = Q.get("cad"); CAD.activar(true); if (c === "walk") CAD.caminar(true, Q.get("at") || "PL-501"); else CAD.vista(c);
  if (Q.get("corte")) { const [e, v] = Q.get("corte").split(":"); CAD.corte(e, +v); }
  if (Q.get("disp")) CAD.display(Q.get("disp")); if (Q.get("inter") === "1") CAD.verInteriores(true, false);
  if (Q.get("zoom")) { const [x, y, s] = Q.get("zoom").split(",").map(Number); CAD.O.c.copy(CAD.W(x, y, 0)); CAD.O.s = s; CAD.ponerOrto(); }
  if (Q.get("yaw")) CAD.WK.yaw = +Q.get("yaw") * Math.PI / 180;
  if (Q.get("cam")) { const [a, b, c2, d, e2, f2] = Q.get("cam").split(",").map(Number); camera.position.set(a, b, c2); controls.target.set(d, e2, f2); controls.update(); } }
if (Q.get("medir") === "demo") { const w = CAD.W; // demostración: distancia, área, altura y ángulo con puntos de vértices reales
  CAD.usarHerr("dist"); CAD.agregarPunto(w(8, 36, 0)); CAD.agregarPunto(w(52, 36, 0));
  CAD.usarHerr("area"); [[68, 56], [102, 56], [102, 72], [68, 72]].forEach((q) => CAD.agregarPunto(w(q[0], q[1], 8))); CAD.terminar();
  CAD.usarHerr("alt"); CAD.agregarPunto(w(14, 117, 0)); CAD.agregarPunto(w(14, 117, 7));
  CAD.usarHerr("poli"); [[115, 0], [115, 80], [62, 80], [62, 150]].forEach((q) => CAD.agregarPunto(w(q[0], q[1], .08))); CAD.terminar();
  CAD.usarHerr("ang"); CAD.agregarPunto(w(128, 150, 0)); CAD.agregarPunto(w(128, 138, 0)); CAD.agregarPunto(w(146, 138, 0)); CAD.usarHerr("dist"); }
if (Q.get("pres") === "1") PRES.toggle(true);
loop();
window.NODO = { irA, mostrarInfo, aplicarNoche, scene, camera, controls, CAD, PRES };
