# NODO VAH · Nodo de Valor Agregado Hídrico-Energético (INOVA AGRO) — Gómez Palacio, Dgo.

Anteproyecto conceptual: visor 3D con modo CAD, planos, DXF, memoria técnica y presupuesto con precios de mercado (México, oct-2026).

> **ANTEPROYECTO CONCEPTUAL — NO VÁLIDO PARA CONSTRUCCIÓN.** Requiere validación y firma de perito/DRO.

## Visor 3D (GitHub Pages)
Abrir `index.html` (página publicada). Funciones:
- Vistas aérea, isométrica, recorrido, órbita; capas de redes (agua, biogás, energía, leche, datos).
- **Modo CAD**: planta y alzados ortográficos, plano de corte móvil (X/Y/Z), alambre y rayos X, administrador con las 13 capas del DXF, snap a vértices/aristas, medición de distancia, polilínea, área, altura y ángulo (m, 2 decimales), cotas permanentes, lectura local + UTM 13R, rejilla con escala.
- **Primera persona**: ojo a 1.70 m, WASD + ratón, colisiones, interiores (tren SIBRA/sopladores, filtros UV, planta láctea, administración); joystick táctil en móvil.
- **Panel Presupuesto** y costo por ficha de instalación.
- Botón **Descargar DXF**.

Parámetros URL útiles: `?cad=planta`, `?cad=walk&at=PL-501`, `?cad=alzS&corte=y:51`, `?pres=1`.

## Contenido
| Ruta | Descripción |
|---|---|
| `planos/` | PL-01 a PL-06 (PDF en la página publicada; fuente en `_bin/planos`) y DXF conjunto UTM 13R |
| `data/` | Datos del sitio, presupuesto para el visor, DXF |
| `presupuesto/` | `presupuesto.json`, `partidas.csv`; XLSX con fórmulas y PDF resumen en la página publicada |
| `presupuesto/solicitudes_cotizacion/` | 12 borradores de solicitud de cotización (no enviados) |
| `memoria_tecnica/` | Memoria MT-NVAH-01 (PDF, generado en la publicación) |
| `_bin/` | PDF/XLSX en base64; el workflow de Pages los decodifica al publicar |

## Presupuesto (sin IVA, MXN, oct-2026)
- Alcance completo del plan maestro: **$162,882,386** + IVA $26,061,182 = **$188,943,567**
- Solo alcance del documento (CAPEX ref. 70 MDP, rango 55–85): **$80,519,911** sin IVA
- Tipos de línea: catálogo 26, paramétrica 35, tarifa oficial 1, sin precio de mercado verificado 18, cotización directa 0.
- Tipo de cambio: USD 18.7005 (FIX DOF 23-oct-2026), EUR 20.8986 (Banxico). Factores de importación supuestos.

Cada línea registra URL, fecha de consulta, precio y moneda originales y método. Las cifras son estimaciones de mercado, no cotizaciones formales.
