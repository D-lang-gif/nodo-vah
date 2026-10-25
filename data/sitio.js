// Generado por scripts/sitio.py — no editar a mano
window.NODO_DATA = {
 "proyecto": "NODO VAH — Nodo de Valor Agregado Hídrico-Energético (piloto)",
 "ubicacion": "Gómez Palacio, Durango — Comarca Lagunera",
 "utm": {
  "zona": "13R",
  "E0": 654200.0,
  "N0": 2854600.0
 },
 "bm": 1112.5,
 "predio": {
  "vertices": [
   [
    "A (NO)",
    0,
    200
   ],
   [
    "B (NE)",
    200,
    200
   ],
   [
    "C (SE)",
    200,
    0
   ],
   [
    "D (SO)",
    0,
    0
   ]
  ],
  "area_m2": 40000
 },
 "fases": [
  {
   "n": 0,
   "nombre": "Fase 0 · Preparación",
   "detalle": "Estudios, permisos, terraplenes compactados al 95% Proctor, cerca y accesos",
   "periodo": "T1–T2 (meses 1–6)",
   "color": "#b9b4a6"
  },
  {
   "n": 1,
   "nombre": "Fase 1 · Obra civil núcleo y tratamiento SIBRA",
   "detalle": "Cárcamo, RAFA, biológico, clarificación, pulimento y recarga",
   "periodo": "T3–T4 (meses 7–12)",
   "color": "#5b6b7c"
  },
  {
   "n": 2,
   "nombre": "Fase 2 · Procesamiento y energía",
   "detalle": "Equipamiento eléctrico, FV 500 kWp, BESS, térmico y planta láctea",
   "periodo": "T5–T6 (meses 13–18)",
   "color": "#d9824b"
  },
  {
   "n": 3,
   "nombre": "Fase 3 · Puesta en marcha operativa",
   "detalle": "Administración, Motor IA-VAH™, laboratorio, pruebas y ramp-up",
   "periodo": "T7–T8 (meses 19–24)",
   "color": "#6fbf73"
  },
  {
   "n": 4,
   "nombre": "Fase 4 · Expansión futura",
   "detalle": "Reserva para nodos 2–4 de la red (escala 3–4 nodos)",
   "periodo": "Posterior al mes 24",
   "color": "#a8d5a2"
  }
 ],
 "bloques": [
  {
   "id": "BLQ-A",
   "nombre": "Bloque A · Sistema SIBRA (Agua)",
   "x0": 0,
   "y0": 80,
   "x1": 60,
   "y1": 140,
   "area": 3600,
   "cota": 1112.3,
   "color": "#3a7bd5",
   "fase": 1,
   "fuente": "doc"
  },
  {
   "id": "BLQ-B",
   "nombre": "Bloque B · Energía FV + Térmico",
   "x0": 60,
   "y0": 80,
   "x1": 110,
   "y1": 140,
   "area": 3000,
   "cota": 1112.4,
   "color": "#f2c230",
   "fase": 2,
   "fuente": "doc"
  },
  {
   "id": "BLQ-C",
   "nombre": "Bloque C · Procesamiento Lácteo",
   "x0": 0,
   "y0": 20,
   "x1": 60,
   "y1": 80,
   "area": 3600,
   "cota": 1112.5,
   "color": "#e07b39",
   "fase": 2,
   "fuente": "doc"
  },
  {
   "id": "BLQ-D",
   "nombre": "Bloque D · Administración + IA",
   "x0": 60,
   "y0": 20,
   "x1": 110,
   "y1": 80,
   "area": 3000,
   "cota": 1112.6,
   "color": "#8e6fd8",
   "fase": 3,
   "fuente": "doc"
  },
  {
   "id": "PATIO",
   "nombre": "Patio de Maniobras y Acceso",
   "x0": 0,
   "y0": 0,
   "x1": 110,
   "y1": 20,
   "area": 2200,
   "cota": 1112.0,
   "color": "#9a9a9a",
   "fase": 0,
   "fuente": "doc"
  },
  {
   "id": "NORTE",
   "nombre": "Franja Norte · Servicios y almacenes (supuesto)",
   "x0": 0,
   "y0": 143,
   "x1": 110,
   "y1": 188,
   "area": 4950,
   "cota": 1112.2,
   "color": "#9aa7b4",
   "fase": 2,
   "fuente": "sup"
  },
  {
   "id": "ZONA-E",
   "nombre": "Zona E · Pulimento, regulación y recarga (supuesto)",
   "x0": 120,
   "y0": 95,
   "x1": 200,
   "y1": 200,
   "area": 8400,
   "cota": 1112.2,
   "color": "#2bb3c0",
   "fase": 1,
   "fuente": "sup"
  },
  {
   "id": "ZONA-F",
   "nombre": "Zona F · Reserva de expansión (Fase 4)",
   "x0": 124,
   "y0": 8,
   "x1": 194,
   "y1": 84,
   "area": 5320,
   "cota": 1112.1,
   "color": "#a8d5a2",
   "fase": 4,
   "fuente": "sup"
  }
 ],
 "instalaciones": [
  {
   "id": "TK-101",
   "nombre": "Cárcamo de bombeo de entrada",
   "tipo": "basin",
   "geom": "rect",
   "x0": 3,
   "y0": 130,
   "x1": 8,
   "y1": 133,
   "h": 3.5,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Dimensiones": "5.0 × 3.0 × 3.5 m prof. útil (doc)",
    "Volumen": "52.5 m³ (doc)",
    "Equipos": "2 bombas sumergibles trituradoras 15 HP c/u, 1 op + 1 respaldo, con VFD (doc)",
    "Caudal de diseño": "Qd = 22.5 L/s; rango 19–29 L/s (doc)"
   }
  },
  {
   "id": "TK-102",
   "nombre": "Estanque amortiguador / desviación de emergencia",
   "tipo": "basin",
   "geom": "rect",
   "x0": 40,
   "y0": 129,
   "x1": 57,
   "y1": 137,
   "h": 3.0,
   "fase": 1,
   "fuente": "sup",
   "bloque": "BLQ-A",
   "datos": {
    "Función": "Rechazo automático de picos tóxicos (doc, cap. 12)",
    "Dimensiones": "17 × 8 × 3.0 m ≈ 408 m³ (SUPUESTO ≈ 5 h de Qd)"
   }
  },
  {
   "id": "SC-102",
   "nombre": "Separadores coalescentes y trampas de grasa",
   "tipo": "basin",
   "geom": "rect",
   "x0": 11,
   "y0": 129,
   "x1": 25,
   "y1": 134,
   "h": 2.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Capacidad hidráulica": "35 L/s con bafles de retención de hidrocarburos libres (doc)",
    "Dimensiones en planta": "14 × 5 m (SUPUESTO)"
   }
  },
  {
   "id": "R-201A",
   "nombre": "Reactor anaerobio RAFA/UASB A",
   "tipo": "tank",
   "geom": "circ",
   "cx": 10,
   "cy": 117,
   "d": 8.0,
   "h": 7.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Diámetro / altura útil": "8.0 m / 7.0 m (doc)",
    "Volumen unitario": "351.8 m³ (doc)",
    "TRH": "8.6 h (doc)",
    "Remoción DBO₅": "hasta 65% (doc)",
    "Biogás (2 unidades)": "115 m³/día → caldera de pasteurización (doc)"
   },
   "color": "#c7ccd1"
  },
  {
   "id": "R-201B",
   "nombre": "Reactor anaerobio RAFA/UASB B",
   "tipo": "tank",
   "geom": "circ",
   "cx": 21,
   "cy": 117,
   "d": 8.0,
   "h": 7.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Diámetro / altura útil": "8.0 m / 7.0 m (doc)",
    "Volumen unitario": "351.8 m³ (doc)",
    "TRH": "8.6 h (doc)"
   },
   "color": "#c7ccd1"
  },
  {
   "id": "TK-301",
   "nombre": "Tanque de aeración · lodos activados (aireación extendida)",
   "tipo": "basin",
   "geom": "rect",
   "x0": 30,
   "y0": 111,
   "x1": 50,
   "y1": 119,
   "h": 3.9,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Volumen": "620 m³ (doc)",
    "Dimensiones": "20 × 8 × 3.9 m (SUPUESTO para 620 m³)",
    "Difusión": "Parrillas de burbuja fina, SOTR = 14.2 kg O₂/h (doc)",
    "Efluente": "DBO₅ y SST < 20 mg/L (doc)"
   },
   "agua": "aire"
  },
  {
   "id": "B-301",
   "nombre": "Casa de sopladores",
   "tipo": "building",
   "geom": "rect",
   "x0": 51,
   "y0": 111,
   "x1": 58,
   "y1": 119,
   "h": 4.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Equipos": "2 sopladores rotativos de lóbulos 25 HP c/u (doc)",
    "Edificio": "7 × 8 × 4 m (SUPUESTO)"
   },
   "color": "#d8d4cc"
  },
  {
   "id": "CL-401A",
   "nombre": "Clarificador secundario A (puente giratorio)",
   "tipo": "clarifier",
   "geom": "circ",
   "cx": 38,
   "cy": 95,
   "d": 11.0,
   "h": 3.5,
   "fase": 1,
   "fuente": "sup",
   "bloque": "BLQ-A",
   "datos": {
    "Función": "Separación de lodos del biológico (necesario en lodos activados)",
    "Diámetro / tirante": "11 m / 3.5 m (SUPUESTO)",
    "Carga superficial": "≈ 0.85 m/h a 22.5 L/s con 2 unidades (SUPUESTO)"
   }
  },
  {
   "id": "CL-401B",
   "nombre": "Clarificador secundario B (puente giratorio)",
   "tipo": "clarifier",
   "geom": "circ",
   "cx": 51.5,
   "cy": 95,
   "d": 11.0,
   "h": 3.5,
   "fase": 1,
   "fuente": "sup",
   "bloque": "BLQ-A",
   "datos": {
    "Diámetro / tirante": "11 m / 3.5 m (SUPUESTO)"
   }
  },
  {
   "id": "BF-402A",
   "nombre": "Biofiltro percolador de pulimento A",
   "tipo": "tank",
   "geom": "circ",
   "cx": 10,
   "cy": 96,
   "d": 7.0,
   "h": 4.5,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Tipo": "Biofiltro de lecho fijo (doc)",
    "Diámetro / altura": "7 m / 4.5 m (SUPUESTO)",
    "Remoción": "N y P (doc)"
   },
   "color": "#9fa8a3"
  },
  {
   "id": "BF-402B",
   "nombre": "Biofiltro percolador de pulimento B",
   "tipo": "tank",
   "geom": "circ",
   "cx": 20,
   "cy": 96,
   "d": 7.0,
   "h": 4.5,
   "fase": 1,
   "fuente": "doc",
   "bloque": "BLQ-A",
   "datos": {
    "Diámetro / altura": "7 m / 4.5 m (SUPUESTO)"
   },
   "color": "#9fa8a3"
  },
  {
   "id": "AL-001",
   "nombre": "Almacén de insumos y lodos deshidratados",
   "tipo": "building",
   "geom": "rect",
   "x0": 6,
   "y0": 148,
   "x1": 52,
   "y1": 182,
   "h": 8.0,
   "fase": 2,
   "fuente": "sup",
   "bloque": "NORTE",
   "datos": {
    "Función": "Almacén de químicos, refacciones y lodos deshidratados (SUPUESTO)",
    "Nave": "46 × 34 × 8 m (SUPUESTO)",
    "Cubierta": "FV de expansión Fase 4 — NO incluida en los 500 kWp del doc"
   },
   "solar": true,
   "color": "#e3ddd0"
  },
  {
   "id": "TM-001",
   "nombre": "Taller de mantenimiento y nave de usos múltiples",
   "tipo": "building",
   "geom": "rect",
   "x0": 66,
   "y0": 150,
   "x1": 106,
   "y1": 180,
   "h": 7.0,
   "fase": 2,
   "fuente": "sup",
   "bloque": "NORTE",
   "datos": {
    "Función": "Mantenimiento predictivo (sensores V/T, doc) y taller (SUPUESTO)",
    "Nave": "40 × 30 × 7 m (SUPUESTO)",
    "Cubierta": "FV de expansión Fase 4 — NO incluida en los 500 kWp del doc"
   },
   "solar": true,
   "color": "#e3ddd0"
  },
  {
   "id": "FV-01",
   "nombre": "Campo fotovoltaico en piso (bifacial, 25° al Sur)",
   "tipo": "pvfield",
   "geom": "rect",
   "x0": 62,
   "y0": 110,
   "x1": 108,
   "y1": 138,
   "h": 2.4,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-B",
   "datos": {
    "Total del sistema": "1,250 módulos bifaciales de 400 W = 500 kWp (doc)",
    "Inclinación": "25°, orientados al Sur, estructura fija (doc)",
    "Reparto": "≈ 560 módulos en piso + ≈ 690 en cubiertas de C y D (SUPUESTO de distribución)"
   }
  },
  {
   "id": "BESS-01",
   "nombre": "Almacenamiento en baterías LFP (BESS)",
   "tipo": "container",
   "geom": "rect",
   "x0": 63,
   "y0": 84,
   "x1": 69.1,
   "y1": 86.5,
   "h": 2.6,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-B",
   "datos": {
    "Capacidad": "250 kWh LFP (doc)",
    "Uso": "Picos de arranque de bombas y respaldo nocturno de instrumentación (doc)",
    "Envolvente": "Contenedor 20 ft (SUPUESTO)"
   },
   "color": "#e9eef2"
  },
  {
   "id": "SE-01",
   "nombre": "Subestación pad-mounted 500 kVA",
   "tipo": "container",
   "geom": "rect",
   "x0": 72,
   "y0": 84,
   "x1": 74.5,
   "y1": 86.2,
   "h": 1.8,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-B",
   "datos": {
    "Capacidad": "500 kVA, 13.8 kV / 440–220 V (doc)",
    "Acometida": "Media tensión 13.8 kV trifásica CFE (doc)",
    "Demanda máx. coincidente": "385 kW, FD 0.77 (doc)"
   },
   "color": "#6c7a3c"
  },
  {
   "id": "ST-01",
   "nombre": "Colectores solares térmicos de tubo evacuado",
   "tipo": "collectors",
   "geom": "rect",
   "x0": 78,
   "y0": 88,
   "x1": 98,
   "y1": 98,
   "h": 1.6,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-B",
   "datos": {
    "Área": "200 m² (doc)",
    "Uso": "Precalentamiento agua CIP y digestor a 80 °C (doc)"
   }
  },
  {
   "id": "CB-01",
   "nombre": "Caldera biogás / cuarto térmico",
   "tipo": "building",
   "geom": "rect",
   "x0": 100,
   "y0": 83,
   "x1": 108,
   "y1": 90,
   "h": 5.0,
   "fase": 2,
   "fuente": "sup",
   "bloque": "BLQ-B",
   "datos": {
    "Combustible": "Biogás RAFA 115 m³/día (doc)",
    "Edificio": "8 × 7 × 5 m (SUPUESTO)"
   },
   "color": "#cfc7b8"
  },
  {
   "id": "GB-01",
   "nombre": "Gasómetro de biogás (membrana doble)",
   "tipo": "dome",
   "geom": "circ",
   "cx": 103,
   "cy": 101,
   "d": 7.0,
   "h": 4.0,
   "fase": 2,
   "fuente": "sup",
   "bloque": "BLQ-B",
   "datos": {
    "Volumen": "≈ 100 m³ ≈ 0.9 días de producción (SUPUESTO)"
   }
  },
  {
   "id": "PL-501",
   "nombre": "Nave de procesamiento lácteo (cubierta solar)",
   "tipo": "building",
   "geom": "rect",
   "x0": 8,
   "y0": 36,
   "x1": 52,
   "y1": 66,
   "h": 7.5,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-C",
   "datos": {
    "Pasteurizador": "HTST de placas 2,000 L/h, 72 °C × 15 s, recuperación 90% (doc)",
    "Tinas de coagulación": "2 × 500 L doble pared (doc)",
    "Cámara de maduración": "40 m³ a 2–4 °C, HR 85%, condensadoras 10 kW (doc)",
    "Leche procesada": "8–12 ML/año (doc)",
    "Nave": "44 × 30 × 7.5 m (SUPUESTO)"
   },
   "solar": true,
   "color": "#e8e3d9"
  },
  {
   "id": "TQ-501A",
   "nombre": "Tanque nodriza de leche A",
   "tipo": "tank",
   "geom": "circ",
   "cx": 14,
   "cy": 29,
   "d": 2.6,
   "h": 4.2,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-C",
   "datos": {
    "Capacidad": "10,000 L, acero inoxidable AISI 304, camisa de refrigeración a 4 °C (doc)",
    "Dimensiones": "Ø2.6 × 4.2 m (SUPUESTO)"
   },
   "color": "#e6ebee",
   "steel": true
  },
  {
   "id": "TQ-501B",
   "nombre": "Tanque nodriza de leche B",
   "tipo": "tank",
   "geom": "circ",
   "cx": 18,
   "cy": 29,
   "d": 2.6,
   "h": 4.2,
   "fase": 2,
   "fuente": "doc",
   "bloque": "BLQ-C",
   "datos": {
    "Capacidad": "10,000 L AISI 304 (doc)"
   },
   "color": "#e6ebee",
   "steel": true
  },
  {
   "id": "AN-501",
   "nombre": "Andén de recepción y embarque",
   "tipo": "slab",
   "geom": "rect",
   "x0": 24,
   "y0": 26,
   "x1": 46,
   "y1": 36,
   "h": 1.2,
   "fase": 2,
   "fuente": "sup",
   "bloque": "BLQ-C",
   "datos": {
    "Andén": "22 × 10 m, 3 posiciones de pipa (SUPUESTO)"
   }
  },
  {
   "id": "AD-601",
   "nombre": "Edificio de Administración y Centro de Control IA-VAH™",
   "tipo": "building",
   "geom": "rect",
   "x0": 68,
   "y0": 56,
   "x1": 102,
   "y1": 72,
   "h": 8.0,
   "fase": 3,
   "fuente": "doc",
   "bloque": "BLQ-D",
   "datos": {
    "Control": "PLC modular OPC-UA / Modbus TCP (doc)",
    "Servidor edge": "2× Xeon Silver, 128 GB RAM, 20 TB NVMe (doc)",
    "Instrumentación": "~105 puntos: 10 FT, 15 AT, 40 V/T (doc)",
    "Edificio": "34 × 16 m, 2 niveles (SUPUESTO)"
   },
   "solar": true,
   "color": "#f0ede6"
  },
  {
   "id": "LB-602",
   "nombre": "Laboratorio de calidad de agua e inocuidad",
   "tipo": "building",
   "geom": "rect",
   "x0": 66,
   "y0": 34,
   "x1": 82,
   "y1": 46,
   "h": 5.0,
   "fase": 3,
   "fuente": "sup",
   "bloque": "BLQ-D",
   "datos": {
    "Función": "Protocolos de calidad de agua y monitoreo biológico (Anexo D)",
    "Edificio": "16 × 12 m (SUPUESTO)"
   },
   "solar": true,
   "color": "#f0ede6"
  },
  {
   "id": "IV-603",
   "nombre": "Invernadero demostrativo de forraje hidropónico",
   "tipo": "greenhouse",
   "geom": "rect",
   "x0": 88,
   "y0": 32,
   "x1": 104,
   "y1": 46,
   "h": 4.5,
   "fase": 3,
   "fuente": "sup",
   "bloque": "BLQ-D",
   "datos": {
    "Función": "Demostración de reúso de agua tratada (SUPUESTO)"
   }
  },
  {
   "id": "BS-001",
   "nombre": "Báscula camionera",
   "tipo": "slab",
   "geom": "rect",
   "x0": 30,
   "y0": 6,
   "x1": 48,
   "y1": 9.2,
   "h": 0.3,
   "fase": 0,
   "fuente": "sup",
   "bloque": "PATIO",
   "datos": {
    "Capacidad": "60 t, 18 × 3.2 m (SUPUESTO)"
   }
  },
  {
   "id": "CS-001",
   "nombre": "Caseta de vigilancia · Acceso A",
   "tipo": "building",
   "geom": "rect",
   "x0": 122,
   "y0": 2,
   "x1": 127,
   "y1": 6,
   "h": 3.2,
   "fase": 0,
   "fuente": "sup",
   "bloque": "PATIO",
   "datos": {
    "Función": "Control de acceso principal A"
   },
   "color": "#f0ede6"
  },
  {
   "id": "HS-601",
   "nombre": "Humedal artificial subsuperficial",
   "tipo": "wetland",
   "geom": "rect",
   "x0": 132,
   "y0": 100,
   "x1": 182,
   "y1": 130,
   "h": 1.2,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Área": "1,500 m² de lecho filtrante (doc)",
    "Medio": "Grava volcánica (tezontle) (doc)",
    "Vegetación": "Macrófitas Typha domingensis (doc)",
    "Geometría": "50 × 30 m, ubicación en Zona E (SUPUESTO)"
   }
  },
  {
   "id": "FA-701",
   "nombre": "Filtros de arena (3 trenes) + desinfección UV",
   "tipo": "building",
   "geom": "rect",
   "x0": 128,
   "y0": 138,
   "x1": 146,
   "y1": 150,
   "h": 5.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Filtración": "3 trenes de filtración rápida multimedia, arena sílica (doc)",
    "UV": "2 reactores modulares, 254 nm, 35 mJ/cm², sin cloro residual (doc)",
    "Edificio": "18 × 12 m (SUPUESTO)"
   },
   "solar": true,
   "color": "#e4e8ea"
  },
  {
   "id": "ER-801",
   "nombre": "Estanque de regulación de agua tratada",
   "tipo": "pond",
   "geom": "rect",
   "x0": 150,
   "y0": 152,
   "x1": 194,
   "y1": 194,
   "h": 2.5,
   "fase": 1,
   "fuente": "sup",
   "bloque": "ZONA-E",
   "datos": {
    "Volumen útil": "≈ 3,000 m³ ≈ 1.5 días de Qd (SUPUESTO)",
    "Destino": "Riego de forrajes de corte e infiltración inducida (doc)"
   }
  },
  {
   "id": "EB-802",
   "nombre": "Estación de bombeo a riego ejidal",
   "tipo": "building",
   "geom": "rect",
   "x0": 136,
   "y0": 170,
   "x1": 143,
   "y1": 176,
   "h": 3.5,
   "fase": 1,
   "fuente": "sup",
   "bloque": "ZONA-E",
   "datos": {
    "Bombas": "2 × 10 HP con VFD (SUPUESTO)"
   },
   "color": "#e4e8ea"
  },
  {
   "id": "PI-803A",
   "nombre": "Pozo de infiltración inducida 1",
   "tipo": "well",
   "geom": "circ",
   "cx": 192,
   "cy": 140,
   "d": 2.0,
   "h": 1.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Función": "Recarga del acuífero (doc)",
    "Ubicación y número": "4 pozos (SUPUESTO)"
   }
  },
  {
   "id": "PI-803B",
   "nombre": "Pozo de infiltración inducida 2",
   "tipo": "well",
   "geom": "circ",
   "cx": 192,
   "cy": 128,
   "d": 2.0,
   "h": 1.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Función": "Recarga del acuífero (doc)"
   }
  },
  {
   "id": "PI-803C",
   "nombre": "Pozo de infiltración inducida 3",
   "tipo": "well",
   "geom": "circ",
   "cx": 192,
   "cy": 116,
   "d": 2.0,
   "h": 1.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Función": "Recarga del acuífero (doc)"
   }
  },
  {
   "id": "PI-803D",
   "nombre": "Pozo de infiltración inducida 4",
   "tipo": "well",
   "geom": "circ",
   "cx": 192,
   "cy": 104,
   "d": 2.0,
   "h": 1.0,
   "fase": 1,
   "fuente": "doc",
   "bloque": "ZONA-E",
   "datos": {
    "Función": "Recarga del acuífero (doc)"
   }
  },
  {
   "id": "EX-901",
   "nombre": "Reserva · Nodo modular 2 (expansión)",
   "tipo": "reserve",
   "geom": "rect",
   "x0": 128,
   "y0": 46,
   "x1": 190,
   "y1": 80,
   "h": 0.2,
   "fase": 4,
   "fuente": "sup",
   "bloque": "ZONA-F",
   "datos": {
    "Escala de red": "3–4 nodos: 2.0–3.2 Mm³/año, 24–40 ML/año (doc)",
    "Uso del área": "Reserva sin diseño (SUPUESTO)"
   }
  },
  {
   "id": "IV-902",
   "nombre": "Reserva · Invernaderos de forraje (expansión)",
   "tipo": "greenhouse",
   "geom": "rect",
   "x0": 130,
   "y0": 12,
   "x1": 188,
   "y1": 40,
   "h": 4.5,
   "fase": 4,
   "fuente": "sup",
   "bloque": "ZONA-F",
   "datos": {
    "Uso": "Invernaderos futuros (SUPUESTO, inspirado en imágenes de referencia)"
   }
  }
 ],
 "vias": [
  {
   "id": "V-01",
   "nombre": "Avenida principal N-S (8 m)",
   "x0": 111,
   "y0": 0,
   "x1": 119,
   "y1": 196
  },
  {
   "id": "V-02",
   "nombre": "Calle E-O entre bloques (6 m)",
   "x0": 0,
   "y0": 77,
   "x1": 111,
   "y1": 83
  },
  {
   "id": "V-03",
   "nombre": "Calle E-O Zona E (6 m)",
   "x0": 119,
   "y0": 87,
   "x1": 196,
   "y1": 93
  },
  {
   "id": "V-04",
   "nombre": "Calle perimetral norte (6 m)",
   "x0": 4,
   "y0": 190,
   "x1": 119,
   "y1": 196
  },
  {
   "id": "V-05",
   "nombre": "Calle Bloque A–B (6 m)",
   "x0": 57,
   "y0": 83,
   "x1": 62,
   "y1": 190
  }
 ],
 "acceso": {
  "id": "ACC-A",
  "nombre": "Acceso principal A",
  "x": 115,
  "y": 0,
  "ancho": 12
 },
 "redes": [
  {
   "capa": "agua_residual",
   "nombre": "Agua residual cruda",
   "color": "#a0703a",
   "tramos": [
    {
     "tag": "8\"-AR-101-PEAD",
     "pts": [
      [
       5,
       200
      ],
      [
       5,
       131.5
      ]
     ],
     "nota": "Llegada SIDEAPA/PIL (punto de entrega SUPUESTO al norte)"
    },
    {
     "tag": "8\"-AR-102-AC",
     "pts": [
      [
       8,
       131.5
      ],
      [
       11,
       131.5
      ]
     ]
    },
    {
     "tag": "8\"-AR-103-AC",
     "pts": [
      [
       25,
       131.5
      ],
      [
       33,
       131.5
      ],
      [
       33,
       123
      ],
      [
       15.5,
       123
      ],
      [
       15.5,
       121
      ]
     ]
    },
    {
     "tag": "6\"-AR-104-AC",
     "pts": [
      [
       38,
       131.5
      ],
      [
       40,
       131.5
      ]
     ],
     "nota": "Desvío de emergencia a TK-102"
    }
   ]
  },
  {
   "capa": "agua_proceso",
   "nombre": "Agua en proceso / lodos",
   "color": "#3f8fd8",
   "tramos": [
    {
     "tag": "8\"-AP-201-AC",
     "pts": [
      [
       15.5,
       113
      ],
      [
       15.5,
       108
      ],
      [
       28,
       108
      ],
      [
       28,
       115
      ],
      [
       30,
       115
      ]
     ]
    },
    {
     "tag": "8\"-AP-301-AC",
     "pts": [
      [
       50,
       111
      ],
      [
       50,
       104
      ],
      [
       44.5,
       104
      ],
      [
       44.5,
       100.5
      ]
     ]
    },
    {
     "tag": "8\"-AP-401-PEAD",
     "pts": [
      [
       44.5,
       89.5
      ],
      [
       44.5,
       86
      ],
      [
       15,
       86
      ],
      [
       15,
       92.5
      ]
     ]
    },
    {
     "tag": "4\"-LR-402-AC",
     "pts": [
      [
       38,
       100.5
      ],
      [
       38,
       108
      ],
      [
       30,
       108
      ]
     ],
     "nota": "Retorno de lodos (RAS)"
    }
   ]
  },
  {
   "capa": "agua_tratada",
   "nombre": "Agua tratada / reúso y recarga",
   "color": "#2fd3e6",
   "tramos": [
    {
     "tag": "8\"-AT-501-PEAD",
     "pts": [
      [
       15,
       99.5
      ],
      [
       15,
       104
      ],
      [
       56,
       104
      ],
      [
       56,
       85
      ],
      [
       121,
       85
      ],
      [
       121,
       115
      ],
      [
       132,
       115
      ]
     ]
    },
    {
     "tag": "8\"-AT-601-PEAD",
     "pts": [
      [
       182,
       115
      ],
      [
       186,
       115
      ],
      [
       186,
       134
      ],
      [
       137,
       134
      ],
      [
       137,
       138
      ]
     ]
    },
    {
     "tag": "8\"-AT-701-PEAD",
     "pts": [
      [
       146,
       144
      ],
      [
       160,
       144
      ],
      [
       160,
       152
      ]
     ]
    },
    {
     "tag": "6\"-AT-801-PEAD",
     "pts": [
      [
       150,
       173
      ],
      [
       143,
       173
      ]
     ]
    },
    {
     "tag": "6\"-AT-802-PEAD",
     "pts": [
      [
       136,
       173
      ],
      [
       126,
       173
      ],
      [
       126,
       200
      ]
     ],
     "nota": "A canal de riego ejidal (forrajes de corte)"
    },
    {
     "tag": "4\"-AT-803-PEAD",
     "pts": [
      [
       194,
       152
      ],
      [
       197,
       152
      ],
      [
       197,
       104
      ],
      [
       193,
       104
      ]
     ],
     "nota": "Ramal a pozos de infiltración"
    }
   ]
  },
  {
   "capa": "energia",
   "nombre": "Energía eléctrica (MT/BT/FV)",
   "color": "#ffd23f",
   "tramos": [
    {
     "tag": "MT-13.8kV-01",
     "pts": [
      [
       110,
       0
      ],
      [
       110,
       76
      ],
      [
       73,
       76
      ],
      [
       73,
       84
      ]
     ],
     "nota": "Acometida CFE 13.8 kV, ductos subterráneos"
    },
    {
     "tag": "FV-CC-01",
     "pts": [
      [
       85,
       110
      ],
      [
       85,
       100
      ],
      [
       74,
       100
      ],
      [
       74,
       86.2
      ]
     ]
    },
    {
     "tag": "BT-440V-01",
     "pts": [
      [
       72,
       85
      ],
      [
       69.1,
       85
      ]
     ]
    },
    {
     "tag": "BT-440V-02",
     "pts": [
      [
       63,
       86
      ],
      [
       56,
       88
      ],
      [
       56,
       123
      ],
      [
       54,
       123
      ]
     ],
     "nota": "Sopladores B-301 y bombas TK-101"
    },
    {
     "tag": "BT-440V-03",
     "pts": [
      [
       56,
       123
      ],
      [
       56,
       127
      ],
      [
       9,
       127
      ],
      [
       6,
       130
      ]
     ]
    },
    {
     "tag": "BT-440V-04",
     "pts": [
      [
       72,
       84
      ],
      [
       72,
       74
      ],
      [
       52,
       74
      ],
      [
       52,
       60
      ]
     ],
     "nota": "Nave láctea"
    },
    {
     "tag": "BT-220V-05",
     "pts": [
      [
       73,
       76
      ],
      [
       85,
       76
      ],
      [
       85,
       72
      ]
     ],
     "nota": "Administración / IA"
    },
    {
     "tag": "BT-440V-06",
     "pts": [
      [
       110,
       76
      ],
      [
       123,
       76
      ],
      [
       123,
       144
      ],
      [
       128,
       144
      ]
     ],
     "nota": "Filtros/UV y bombeo a riego"
    },
    {
     "tag": "BT-440V-07",
     "pts": [
      [
       123,
       144
      ],
      [
       123,
       166
      ],
      [
       139,
       166
      ],
      [
       139,
       170
      ]
     ]
    }
   ]
  },
  {
   "capa": "biogas",
   "nombre": "Biogás y energía térmica",
   "color": "#58d68d",
   "tramos": [
    {
     "tag": "3\"-BG-201-PEAD",
     "pts": [
      [
       15.5,
       121
      ],
      [
       15.5,
       125
      ],
      [
       59,
       125
      ],
      [
       59,
       101
      ],
      [
       99.5,
       101
      ]
     ],
     "nota": "115 m³/día (doc)"
    },
    {
     "tag": "3\"-BG-202-PEAD",
     "pts": [
      [
       103,
       97.5
      ],
      [
       103,
       90
      ]
     ]
    },
    {
     "tag": "2\"-AC-301-AI",
     "pts": [
      [
       100,
       86
      ],
      [
       76,
       86
      ],
      [
       76,
       77
      ],
      [
       52,
       77
      ],
      [
       52,
       66
      ]
     ],
     "nota": "Agua caliente 80 °C a pasteurizador y CIP"
    },
    {
     "tag": "2\"-AC-302-AI",
     "pts": [
      [
       88,
       88
      ],
      [
       88,
       86
      ]
     ]
    }
   ]
  },
  {
   "capa": "leche",
   "nombre": "Leche y producto terminado",
   "color": "#fff1c7",
   "tramos": [
    {
     "tag": "RUTA-L-01",
     "pts": [
      [
       115,
       0
      ],
      [
       115,
       12
      ],
      [
       40,
       12
      ],
      [
       35,
       26
      ]
     ],
     "nota": "Pipas de leche → andén AN-501"
    },
    {
     "tag": "2\"-L-501-AI",
     "pts": [
      [
       16,
       30.3
      ],
      [
       16,
       36
      ]
     ],
     "nota": "Tanques nodriza → pasteurizador HTST"
    }
   ]
  },
  {
   "capa": "datos",
   "nombre": "Control y datos (Motor IA-VAH™)",
   "color": "#c08cff",
   "tramos": [
    {
     "tag": "FO-01",
     "pts": [
      [
       85,
       72
      ],
      [
       85,
       79
      ],
      [
       57.5,
       79
      ],
      [
       57.5,
       115
      ],
      [
       30,
       127
      ]
     ]
    },
    {
     "tag": "FO-02",
     "pts": [
      [
       102,
       64
      ],
      [
       117,
       64
      ],
      [
       117,
       125
      ],
      [
       137,
       138
      ]
     ]
    },
    {
     "tag": "FO-03",
     "pts": [
      [
       80,
       56
      ],
      [
       80,
       46
      ]
     ]
    }
   ]
  }
 ],
 "supuestos": [
  "S-01 Predio: se toma el cuadrado de 200 × 200 m definido por las coordenadas UTM del documento (40,000 m²). El mismo documento indica 'Superficie asignada 20,000 m² (2.0 ha)'; existe una DISCREPANCIA que debe aclararse con el levantamiento topográfico.",
  "S-02 Las coordenadas relativas de los bloques A–D y del patio (doc) se interpretan con origen en el vértice D (SO), X al Este y Y al Norte.",
  "S-03 Las imágenes de referencia (renders y maqueta) muestran un predio rectangular ~2:1 con la planta de tratamiento al Oriente; se respetó la distribución de bloques del documento técnico y se ubicó la Zona E (pulimento/recarga) y la Zona F (expansión) en la franja Oriente, inspirado en dichas imágenes.",
  "S-04 Dimensiones de edificios (nave láctea 44 × 30 m, administración 34 × 16 m, laboratorio, casa de sopladores, filtros/UV, caldera) son supuestas.",
  "S-15 Franja Norte (y 143–188 m): almacén y taller supuestos, inspirados en las naves con cubierta solar de las imágenes de referencia; su FV sería expansión y no forma parte de los 500 kWp.",
  "S-05 Clarificadores secundarios CL-401A/B (Ø11 m, tirante 3.5 m) no aparecen en el documento; se agregan porque un sistema de lodos activados los requiere.",
  "S-06 Dimensiones del tanque de aeración 20 × 8 × 3.9 m elegidas para cumplir los 620 m³ del documento.",
  "S-07 Biofiltros Ø7 × 4.5 m, estanque amortiguador TK-102 (≈408 m³), estanque de regulación ER-801 (≈3,000 m³), gasómetro (≈100 m³) y estación de bombeo a riego son supuestos.",
  "S-08 Reparto de los 1,250 módulos FV: ≈560 en piso (Bloque B) y ≈690 en cubiertas; el doc solo da el total (500 kWp).",
  "S-09 Diámetros de tubería: 8\" (200 mm) en línea principal (v ≈ 0.9 m/s a 29 L/s), 6\" y 4\" en ramales, 3\" biogás, 2\" agua caliente/leche. Materiales PEAD/AC (acero al carbón)/AI (acero inoxidable). Todos SUPUESTOS.",
  "S-10 Punto de entrega del agua residual al norte del predio, acometida CFE por el sur junto al acceso, y salida a canal ejidal al norte: SUPUESTOS hasta contar con factibilidades de SIDEAPA y CFE.",
  "S-11 Vialidades: avenida principal de 8 m y calles internas de 6 m; acceso A de 12 m al sur. Radios y pavimentos por definir.",
  "S-12 Mapeo de fases 0–4 (imagen 'Total Development Phases Master Plan') con el cronograma T1–T8 del documento maestro: es una interpretación.",
  "S-13 Cotas de desplante de bloques: doc. Cotas de Zonas E y F (1,112.20 y 1,112.10 msnm): supuestas. Pendiente natural 0.4% S→N (doc).",
  "S-14 Pozos de infiltración: número (4) y ubicación supuestos; su diseño requiere estudio geohidrológico y permiso CONAGUA."
 ],
 "kpi": {
  "Caudal de diseño": "22.5 L/s (19–29)",
  "Volumen tratado": "0.71 Mm³/año",
  "FV": "500 kWp · 1,250 módulos",
  "BESS": "250 kWh LFP",
  "Subestación": "500 kVA · 13.8 kV",
  "Leche": "8–12 ML/año",
  "CAPEX ref.": "70 MDP",
  "Empleos": "80–125"
 }
};
