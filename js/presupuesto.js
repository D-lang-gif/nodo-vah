// Panel de presupuesto (datos: data/presupuesto.js generado por scripts/presupuesto.py)
const $ = (s) => document.querySelector(s);
const PR = window.NODO_PRESUPUESTO;
const m = (v) => "$" + Math.round(v).toLocaleString("es-MX");
const mdp = (v) => (v / 1e6).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const BASE_ARCH = location.pathname.includes("/visor_3d/") ? "../" : "./";
const ZN = { "BLQ-A": "Bloque A · SIBRA", "BLQ-B": "Bloque B · Energía", "BLQ-C": "Bloque C · Lácteos", "BLQ-D": "Bloque D · Admin + IA", PATIO: "Patio y acceso", NORTE: "Franja Norte", "ZONA-E": "Zona E · Pulimento/recarga", Redes: "Redes", Vialidades: "Vialidades", Predio: "Predio / urbanización", "Instr.": "Instrumentación", Global: "Ingeniería, permisos y contingencias" };
export function initPresupuesto(irAInst) {
  if (!PR) return { ficha: () => "" };
  const p = document.createElement("aside"); p.id = "panelPres"; p.className = "panel oculto";
  const maxv = Math.max(...Object.values(PR.partidas).map((v) => Math.max(v.importe, v.doc[1] * 1e6)));
  const bars = Object.entries(PR.partidas).map(([k, v]) => { const [mn, mx, rf] = v.doc; const ds = PR.doc_scope_partidas[k];
    return `<div class="pb"><div class="pn">${k}</div><div class="pt"><span class="rg" style="left:${mn * 1e6 / maxv * 100}%;width:${(mx - mn) * 1e6 / maxv * 100}%"></span><span class="rf" style="left:${rf * 1e6 / maxv * 100}%"></span>
      <span class="bv d" style="width:${ds / maxv * 100}%"></span><span class="bv" style="width:${v.importe / maxv * 100}%"></span></div><div class="pv"><b>${mdp(v.importe)}</b> <small>doc ${rf} (${mn}–${mx}) · alc. doc ${mdp(ds)}</small></div></div>`; }).join("");
  const zonas = Object.entries(PR.zonas).sort((a, b) => b[1] - a[1]).map(([z, v]) => `<tr><td>${ZN[z] || z}</td><td>${m(v)}</td><td>${(v / PR.subtotal * 100).toFixed(1)}%</td></tr>`).join("");
  const ct = PR.conteo_tipos;
  p.innerHTML = `<button class="cerrar" id="cerrarPres">×</button><h2>Presupuesto real · Nodo VAH</h2>
   <div class="peq">Precios web consultados ${PR.fecha} · MXN · TC USD ${PR.tc.USD} (FIX DOF) · EUR ${PR.tc.EUR} (Banxico)</div>
   <div class="tot"><div><small>Sin IVA</small><b>${m(PR.subtotal)}</b></div><div><small>IVA 16%</small><b>${m(PR.iva_monto)}</b></div><div><small>Con IVA</small><b>${m(PR.total)}</b></div></div>
   <div class="tot alt"><div><small>Solo alcance del documento (sin IVA)</small><b>${m(PR.doc_scope.subtotal)}</b></div><div><small>CAPEX documento §6.1</small><b>$70,000,000</b><small>rango 55–85 MDP</small></div></div>
   <h3>Por partida (MDP sin IVA) · <span class="ley"><i class="l1"></i>completo <i class="l2"></i>alcance doc <i class="l3"></i>rango doc <i class="l4"></i>ref.</span></h3>${bars}
   <h3>Por zona</h3><table class="tz"><tr><th>Zona</th><th>Sin IVA</th><th>%</th></tr>${zonas}</table>
   <h3>Calidad de las fuentes</h3><div class="peq">${Object.entries(ct).map(([k, v]) => `${k}: <b>${v}</b>`).join(" · ")} · Cotizaciones directas: <b>${ct["Cotización directa"] || 0}</b> (no se contactó a proveedores; RFQ listas)</div>
   <div class="acc"><a class="btn" href="${BASE_ARCH}presupuesto/NODO_VAH_Presupuesto_Real.xlsx" download>⬇ XLSX con fórmulas</a><a class="btn" href="${BASE_ARCH}presupuesto/NODO_VAH_Presupuesto_Resumen.pdf" target="_blank">PDF resumen</a></div>
   <p class="peq">Clic en una instalación para ver su costo en la ficha. Valores paramétricos y “sin precio verificado” requieren cotización formal.</p>`;
  document.body.appendChild(p);
  $("#cerrarPres").onclick = () => toggle(false);
  function toggle(on) { p.classList.toggle("oculto", !on); $("#btnPres").classList.toggle("on", on); }
  $("#btnPres").onclick = () => toggle(p.classList.contains("oculto"));
  function ficha(id) { const L = PR.instalaciones[id]; if (!L) return `<h3 style="margin-top:14px">Costo estimado</h3><div class="peq">Sin líneas directas: incluido en partidas globales (redes, urbanización, ingeniería).</div>`;
    const t = L.reduce((s, l) => s + l.imp, 0);
    return `<h3 style="margin-top:14px">Costo estimado (sin IVA)</h3><div class="costo">${m(t)} <small>+ IVA ${m(t * .16)}</small></div><table>${L.map((l) => `<tr><td>${m(l.imp)}</td><td>${l.c}<br><small class="${/Sin precio/.test(l.tipo) ? "sup" : ""}">${l.tipo}</small></td></tr>`).join("")}</table>`; }
  return { ficha, toggle };
}
