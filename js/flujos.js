import * as THREE from "../vendor/three.module.min.js";
import { W } from "./util.js";

const ALT = { agua_residual: 1.0, agua_proceso: 1.4, agua_tratada: 1.8, energia: 2.6, biogas: 2.2, leche: .9, datos: 3.0 };
export const uTiempo = { value: 0 };

function materialFlujo(color) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uT: uTiempo, uC: { value: new THREE.Color(color) }, uLen: { value: 10 }, uBrillo: { value: 1 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; void main(){ vUv=uv; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float uT; uniform vec3 uC; uniform float uLen; uniform float uBrillo; varying vec2 vUv; varying vec3 vN;
      void main(){ float s = vUv.x*uLen; float d = fract((s - uT*6.0)/4.0); float pulso = smoothstep(0.0,0.15,d)*(1.0-smoothstep(0.35,0.6,d));
        float borde = pow(1.0-abs(vN.z),1.5); vec3 c = uC*(0.55+1.4*pulso)*uBrillo; gl_FragColor = vec4(c, 0.55+0.45*pulso + 0.2*borde); }`
  });
}

export function crearFlujos(scene, D) {
  const capas = {};
  for (const red of D.redes) {
    const g = new THREE.Group(); g.name = "red_" + red.capa; const h = ALT[red.capa] ?? 1.5;
    for (const t of red.tramos) {
      const pts = t.pts.map(([x, y]) => W(x, y, h));
      const path = new THREE.CurvePath(); let L = 0;
      for (let i = 0; i < pts.length - 1; i++) { path.add(new THREE.LineCurve3(pts[i], pts[i + 1])); L += pts[i].distanceTo(pts[i + 1]); }
      const rad = red.capa === "datos" ? .22 : red.capa === "energia" ? .3 : .42;
      const geo = new THREE.TubeGeometry(path, Math.max(8, Math.ceil(L / 1.5)), rad, 8, false);
      const mat = materialFlujo(red.color); mat.uniforms.uLen.value = L;
      const m = new THREE.Mesh(geo, mat); m.renderOrder = 3; m.userData.tag = t.tag; m.userData.red = red.nombre; m.userData.nota = t.nota || ""; g.add(m);
      // soportes de rack
      const sop = new THREE.MeshStandardMaterial({ color: 0x55606b, metalness: .6, roughness: .5 });
      for (let i = 0; i < pts.length; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, h, 6), sop); p.position.set(pts[i].x, h / 2, pts[i].z); g.add(p); }
      // marcador de origen/destino
      const e = new THREE.Mesh(new THREE.SphereGeometry(rad * 1.9, 12, 8), new THREE.MeshBasicMaterial({ color: red.color })); e.position.copy(pts[pts.length - 1]); g.add(e);
    }
    g.visible = false; scene.add(g); capas[red.capa] = { grupo: g, red };
  }
  return capas;
}
