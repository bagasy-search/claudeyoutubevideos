// MovS9C.tsx — MOVIMIENTO S9C · "LAS 14 ACCIONES" (⭐ LA CTA QUE CONVIERTE + EL QR)
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 11 actos · 1.401.890 → 1.465.370 ms · 1904 frames @30.
//
// LA IDEA: una PÁGINA REAL de los manuales de Claudio — "14 ACCIONES QUE BAJAN LA FACTURA SIN COMPRAR
// NADA" — se apoya casi de frente y NO SE VA MÁS. Todo lo que pasa en 57 segundos pasa SOBRE LA MISMA
// HOJA: se marcan los 11 gratis, se encienden una por una las cuatro que él nombra, las cifras se
// apilan, los catorce renglones se reordenan, y recién al final la pila de hojas se acuesta y se
// convierte en el panel del QR.
//
// ⛔ LO QUE NO SE NEGOCIA EN ESTE MOVIMIENTO:
//   · el texto de los renglones es TEXTO REAL de React (nítido, sin erratas). Nunca una imagen con texto.
//   · la hoja NO se remonta y NO cambia de escala entre el acto 1 y el 9: `Lamina` es función pura de
//     gFrame, así que el CLIP que va entre el acto 2 y el 3 la deja EXACTAMENTE donde estaba.
//   · cada renglón que se enciende abre una tarjeta con MATERIAL REAL adentro (foto o video), nunca
//     una forma con texto.
//   · CERO precio y CERO dirección legible en pantalla. Las cifras que se ven son AHORROS MENSUALES,
//     que es lo que él dice en voz alta.
//   · el QR va grande, plano, con quiet zone blanca y NADA encima: si no decodifica, no sirve. Por eso
//     el acto 11 se dibuja FUERA de `<Layers>` (sin perspectiva ni rotación) y la cámara sólo lo
//     traslada en píxeles enteros.
//
// LA MATERIA QUE CRUZA LAS DIEZ FRONTERAS: **LA HOJA**.
//   1→2 la hoja entra y se queda · 2→3 el clip pasa por delante y la hoja sigue en el MISMO encuadre
//   3→4→5→6 el objeto encendido de una tarjeta se convierte en el de la siguiente (resistencia → cuarto
//   → foco → led del control) · 7→8 la pila de cifras no se reinicia, sigue creciendo · 9 los renglones
//   se cruzan en el aire y vuelven a apoyarse ordenados · 10 la hoja se despega y se le apilan las otras
//   dos · 11 la pila se acuesta y ES el panel oscuro del QR.
//
// UNA cámara: `camAt(gFrame)`, un solo `gcam` de recorrido cortísimo mientras se lee (la hoja no puede
// bailar) y una grúa que recién sube con la pila y baja con las hojas. Nunca vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch. LA LUZ: la lámpara desnuda
// sobre el papel — TORCH cálido de punta a punta, subiendo un punto cuando se marcan los gratis.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1  · g0-191    · LA LÁMINA           material: FOTO banco de trabajo (cama, desenfocada)
// ACTO 2  · g191-273  · LOS 11 GRATIS       material: la misma cama; la hoja NO se mueve
// ACTO 3  · g358-526  · ESTUFA · 36         material: FOTO horno al rojo
// ACTO 4  · g526-673  · CALEFACTOR · 13,50  material: CLIP enchufa el calefactor
// ACTO 5  · g673-799  · 10 FOCOS · 11,48    material: FOTO foco viejo
// ACTO 6  · g799-919  · AIRE +3° · 5        material: CLIP termostato de placa
// ACTO 7  · g919-1046 · LA PILA · 45        material: las cuatro tarjetas cerrándose
// ACTO 8  · g1046-1277· LOS CUATRO GRANDES · 94   material: horno · calefactor · termotanque · aire
// ACTO 9  · g1277-1435· ORDENADA            material: la hoja, siempre la misma hoja
// ACTO 10 · g1435-1633· LAS TRES HOJAS      material: FOTO primera fila + FOTO dos calibres
// ACTO 11 · g1633-1904· ⭐ EL QR            material: FOTO banco (cama) + el PNG del QR
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 191, A3 = 358, A4 = 526, A5 = 673, A6 = 799,
  A7 = 919, A8 = 1046, A9 = 1277, A10 = 1435, A11 = 1633;
const G_END = 1904;
const START: Record<number, number> = {
  1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7, 8: A8, 9: A9, 10: A10, 11: A11,
};

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  bancoF: "img/cmeenchufe/cmee_s8_banco_cuaderno_abre.png",
  hornoF: "img/cmeenchufe/cmee_s5_horno_rojo.png",
  calefactorV: "broll/cmeenchufe/cmee_s7_enchufa_calentador.mp4",
  focoF: "img/cmeenchufe/cmee_s1_foco_viejo.png",
  termostatoV: "broll/cmeenchufe/cmee_s7_termostato_placa.mp4",
  tanqueV: "broll/cmeenchufe/cmee_s7_palma_tanque.mp4",
  aireF: "img/cmeenchufe/cmee_s8_aire_sala_led.png",
  filaF: "img/cmeenchufe/cmee_s5_senala_primera_fila.png",
  calibresF: "img/cmeenchufe/cmee_s6_dos_calibres.png",
  qr: "img/cmeenchufe/cmee_qr.png",
  icFlecha: "img/cmeenchufe/cmee_ic_flecha.png",
  icCuaderno: "img/cmeenchufe/cmee_ic_cuaderno.png",
};

// ── LA PÁGINA (px de la comp 1920×1080) ──────────────────────────────────────────────────────
const P = { x: 566, y: 46, w: 1180, h: 986 };
const COL_T = P.x + 64;          // el título del renglón
const COL_TAG = P.x + 854;       // la etiqueta GRATIS / CUESTA
const COL_NUM = P.x + 1146;      // la columna de ahorro, alineada a la derecha
const ROW_Y0 = 296, ROW_H = 48;
const PAPER = { hi: "#F7F3E5", mid: "#EDE7D4", lo: "#DFD8C1", ink: "#26281E", inkSoft: "rgba(38,40,30,0.5)" };

// ── LOS CATORCE RENGLONES — texto REAL, nunca una imagen con texto ───────────────────────────
type Fila = { n: number; t: string; v: string; num: number; free: boolean };
const FILAS: Fila[] = [
  { n: 1, t: "Dejar de calentar con estufa eléctrica", v: "36,00", num: 36, free: true },
  { n: 2, t: "Calefactor sólo en el cuarto donde estás", v: "13,50", num: 13.5, free: true },
  { n: 3, t: "Cambiar 10 focos viejos por led", v: "11,48", num: 11.48, free: false },
  { n: 4, t: "Subir el aire acondicionado 3 grados", v: "5,00", num: 5, free: true },
  { n: 5, t: "Regleta de la tele apagada de noche", v: "2,80", num: 2.8, free: true },
  { n: 6, t: "Lavar la ropa en tu franja de valle", v: "4,20", num: 4.2, free: true },
  { n: 7, t: "Ducha cuatro minutos más corta", v: "3,60", num: 3.6, free: true },
  { n: 8, t: "Temporizador al calentador de agua", v: "1,60", num: 1.6, free: false },
  { n: 9, t: "Goma nueva en la puerta del congelador", v: "2,40", num: 2.4, free: false },
  { n: 10, t: "Refrigerador un dedo separado de la pared", v: "0,80", num: 0.8, free: true },
  { n: 11, t: "Horno eléctrico con la puerta cerrada", v: "1,90", num: 1.9, free: true },
  { n: 12, t: "Secar la ropa al aire dos veces por semana", v: "1,70", num: 1.7, free: true },
  { n: 13, t: "Cargadores fuera del enchufe de noche", v: "1,20", num: 1.2, free: true },
  { n: 14, t: "Filtro del aire limpio cada mes", v: "1,10", num: 1.1, free: true },
];
// once de los catorce son GRATIS: se marcan uno tras otro, de arriba abajo, en el acto 2
const FREE_ORDER: number[] = [];
FILAS.forEach((fi, i) => { if (fi.free) FREE_ORDER.push(i); });
const freeRank = (i: number) => FREE_ORDER.indexOf(i);

// el reordenado del acto 9: de mayor a menor devolución
const ORDEN = FILAS.map((_, i) => i).slice().sort((a, b) => FILAS[b].num - FILAS[a].num);
const POS: number[] = FILAS.map(() => 0);
ORDEN.forEach((idx, k) => { POS[idx] = k; });
const MAXNUM = FILAS[0].num;

// las cuatro que él nombra (renglones 1..4) y su tarjeta de material real
type Nombrada = { row: number; at: number; land: number; src: string; kind: "video" | "photo"; label: string; cy: number; from: [number, number] };
const NOM: Nombrada[] = [
  { row: 0, at: A3, land: A3 + 84, src: M.hornoF, kind: "photo", label: "LAS RESISTENCIAS AL ROJO", cy: 30, from: [300, 324] },
  { row: 1, at: A4, land: A4 + 66, src: M.calefactorV, kind: "video", label: "SÓLO ESE CUARTO", cy: 35, from: [300, 378] },
  { row: 2, at: A5, land: A5 + 62, src: M.focoF, kind: "photo", label: "DIEZ FOCOS EN EL BANCO", cy: 41, from: [300, 443] },
  { row: 3, at: A6, land: A6 + 58, src: M.termostatoV, kind: "video", label: "DE 21 A 24", cy: 47, from: [300, 508] },
];
const landedAt = (row: number) => {
  for (let k = 0; k < NOM.length; k++) if (NOM[k].row === row) return NOM[k].land;
  return -1;
};

// ── LA PILA DE CIFRAS (actos 7 y 8) ──────────────────────────────────────────────────────────
const PILE_X = P.x + 1010;
const PILE_Y0 = 880, PILE_STEP = 58;
const coinP = (g: number, k: number) => {
  const up = clamp01((g - (A7 + 12 + k * 20)) / 26);
  const back = clamp01((g - A9) / 30);
  return up * (1 - back);
};
// los cuatro aparatos grandes del acto 8 empujan la pila un poco más arriba
const pilePush = (g: number) =>
  interpolate(g, [A8 + 14, A8 + 38, A8 + 62, A8 + 86, A9], [0, 20, 40, 60, 78], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

// ── LA CÁMARA · recorrido cortísimo mientras se lee; nunca vuelve a cero ─────────────────────
const camAt = (g: number) => {
  const gg = Math.min(g, A11);   // en el acto del QR la cámara deja de mover el escenario
  const base = gcam(gg, { z0: -20, z1: 190, panX: -58, panY: -20, ry: -2.1, rx: 0.85, dur: G_END });
  const crane = interpolate(
    gg,
    [0, A3, A7, A8, A8 + 120, A9, A10, A11],
    [0, 10, 22, 76, 122, 138, 84, 26],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  return `${base.transform} translateY(${crane.toFixed(1)}px)`;
};

// ══ LA LÁMINA — función PURA de gFrame: sobrevive intacta al clip que va entre el acto 2 y el 3 ══
const Lamina: React.FC<{ g: number; detach?: number }> = ({ g, detach = 0 }) => {
  const entra = clamp01(g / 34);
  const luz = interpolate(g, [A2, A2 + 60], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sortP = interpolate(g, [A9 + 26, A9 + 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const barP = clamp01((g - (A9 + 126)) / 26);
  return (
    <div style={{
      position: "absolute", left: P.x, top: P.y, width: P.w, height: P.h,
      transform:
        `translateY(${eio(64, 0, entra).toFixed(1)}px) translateX(${(detach * -286).toFixed(1)}px) ` +
        `rotateX(${eio(9, 1.4, entra).toFixed(2)}deg) rotateY(${(eio(-6, -1.6, entra) + detach * 5).toFixed(2)}deg) ` +
        `scale(${lerp(1, 0.86, detach).toFixed(3)})`,
      transformOrigin: "50% 100%",
      opacity: entra,
      borderRadius: 6,
      background: `linear-gradient(163deg, ${PAPER.hi} 0%, ${PAPER.mid} 58%, ${PAPER.lo} 100%)`,
      boxShadow: `0 40px 90px ${rgba(V.ink0, 0.86)}, 0 6px 22px ${rgba(V.ink0, 0.7)}`,
      overflow: "hidden",
    }}>
      {/* la lámpara desnuda lamiendo el papel */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(78% 52% at 34% -6%, rgba(255,244,214,${(0.5 * luz).toFixed(3)}) 0%, rgba(0,0,0,0) 62%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 84% at 60% 116%, rgba(120,112,88,0.22) 0%, rgba(0,0,0,0) 58%)" }} />
      {/* el grano del papel */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.055, mixBlendMode: "multiply",
        backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "multiply",
        backgroundImage: "repeating-linear-gradient(94deg, rgba(60,58,44,0.5) 0px, rgba(60,58,44,0.5) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 6px)",
      }} />

      {/* CABECERA */}
      <div style={{ position: "absolute", left: 64, top: 48, width: 720 }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 47, lineHeight: 1.02, letterSpacing: 0.6, color: PAPER.ink }}>
          14 ACCIONES QUE BAJAN LA FACTURA
        </div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 47, lineHeight: 1.02, letterSpacing: 0.6, color: "#5C7300" }}>
          SIN COMPRAR NADA
        </div>
      </div>
      {/* RÓTULO DE ESQUINA — discreto, y sin una sola dirección legible */}
      <div style={{ position: "absolute", right: 60, top: 52, textAlign: "right" }}>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 3.2, color: PAPER.inkSoft }}>
          PÁGINA DE LA GUÍA
        </div>
        <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 18, letterSpacing: 1.6, color: "rgba(38,40,30,0.38)", marginTop: 5 }}>
          ESTÁ ABAJO, EN LA DESCRIPCIÓN
        </div>
      </div>

      {/* regla y encabezados de columna */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 186, height: 2, background: "rgba(38,40,30,0.28)" }} />
      <div style={{ position: "absolute", left: 64, top: 200, fontFamily: F_BODY, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: PAPER.inkSoft }}>ACCIÓN</div>
      <div style={{ position: "absolute", left: COL_TAG - P.x, top: 200, fontFamily: F_BODY, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: PAPER.inkSoft }}>COSTO</div>
      <div style={{ position: "absolute", left: 0, width: COL_NUM - P.x, top: 200, textAlign: "right", fontFamily: F_BODY, fontWeight: 700, fontSize: 19, letterSpacing: 3.4, color: PAPER.inkSoft }}>AHORRO AL MES</div>

      {/* LOS CATORCE RENGLONES */}
      {FILAS.map((fi, i) => {
        const yBase = ROW_Y0 - P.y + POS[i] * ROW_H * sortP + i * ROW_H * (1 - sortP);
        // el cruce en el aire: cada renglón se levanta, cruza y se vuelve a apoyar
        const air = Math.sin(clamp01(sortP) * Math.PI) * (12 + rnd(i * 3.3) * 22);
        const gr = fi.free ? clamp01((g - (A2 + 10 + freeRank(i) * 5)) / 9) : 0;
        const paid = !fi.free ? clamp01((g - (A2 + 12)) / 12) : 0;
        const lRow = landedAt(i);
        const hot = lRow > 0 ? clamp01((g - (lRow - 78)) / 14) * (1 - clamp01((g - (lRow + 120)) / 30) * 0.55) : 0;
        const numShown = lRow > 0 ? clamp01((g - lRow) / 6) : 1;
        const inPile = i < 4 ? coinP(g, i) : 0;
        const rowLit = Math.max(gr, hot);
        return (
          <div key={fi.n} style={{
            position: "absolute", left: 40, right: 40, top: yBase, height: ROW_H,
            transform: `translateY(${(-air).toFixed(2)}px) rotate(${(air * 0.06).toFixed(3)}deg)`,
          }}>
            {/* la banda voltio del renglón encendido */}
            <div style={{
              position: "absolute", left: 0, right: 0, top: 2, bottom: 2, borderRadius: 4,
              background: `linear-gradient(90deg, rgba(200,240,0,${(0.3 * rowLit).toFixed(3)}) 0%, rgba(200,240,0,${(0.08 * rowLit).toFixed(3)}) 82%, rgba(200,240,0,0) 100%)`,
              borderLeft: `5px solid rgba(110,140,0,${(0.9 * rowLit).toFixed(3)})`,
            }} />
            <div style={{
              position: "absolute", left: 26, top: 9, width: 34,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 29,
              color: rowLit > 0.2 ? "#4E6100" : "rgba(38,40,30,0.36)",
            }}>{fi.n}</div>
            <div style={{
              position: "absolute", left: COL_T - P.x - 40 + 34, top: 10,
              fontFamily: F_BODY, fontWeight: rowLit > 0.5 ? 700 : 500, fontSize: 29, letterSpacing: 0.1,
              color: rowLit > 0.2 ? PAPER.ink : "rgba(38,40,30,0.44)", whiteSpace: "nowrap",
            }}>{fi.t}</div>
            {/* GRATIS / CUESTA */}
            <div style={{ position: "absolute", left: COL_TAG - P.x - 40, top: 11, opacity: Math.max(gr, paid) }}>
              {fi.free ? (
                <div style={{
                  padding: "3px 13px", borderRadius: 4, background: "#6E8A00",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 21, letterSpacing: 2.6, color: "#F7F3E5", display: "inline-block",
                }}>GRATIS</div>
              ) : (
                <div style={{
                  padding: "2px 12px", borderRadius: 4, border: "1.5px solid rgba(38,40,30,0.4)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6, color: "rgba(38,40,30,0.55)", display: "inline-block",
                }}>CUESTA</div>
              )}
            </div>
            {/* la columna de ahorro */}
            <div style={{
              position: "absolute", left: 0, width: COL_NUM - P.x - 40, top: 9, textAlign: "right",
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30,
              color: rowLit > 0.2 ? "#3F5200" : "rgba(38,40,30,0.4)",
              opacity: numShown * (1 - inPile),
            }}>{numShown >= 1 ? fi.v : "· · ·"}</div>
            {/* durante el reordenado, la cifra corre mientras cambia de lugar */}
            {sortP > 0.02 && sortP < 0.98 && (
              <div style={{
                position: "absolute", left: 0, width: COL_NUM - P.x - 40, top: 9, textAlign: "right",
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, color: "#4E6100",
                opacity: Math.sin(sortP * Math.PI) * 0.9,
              }}>{fi.v}</div>
            )}
          </div>
        );
      })}

      {/* la barra voltio del margen izquierdo: larga en el primero, corta en el último */}
      {barP > 0 && FILAS.map((fi, i) => (
        <div key={`b${fi.n}`} style={{
          position: "absolute", left: 14, top: ROW_Y0 - P.y + POS[i] * ROW_H + 14,
          height: 20, width: 10 + (FILAS[i].num / MAXNUM) * 26 * barP, borderRadius: 3,
          background: "linear-gradient(90deg, #8FAD00, #C8F000)", opacity: barP,
        }} />
      ))}
    </div>
  );
};

// ── LA CIFRA QUE VUELA DESDE EL MATERIAL HASTA LA COLUMNA ────────────────────────────────────
const CifraVuela: React.FC<{ p: number; from: [number, number]; toY: number; value: string }> = ({ p, from, toY, value }) => {
  if (p <= 0 || p >= 1.001) return null;
  const e = interpolate(clamp01(p), [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const x = lerp(from[0], COL_NUM - 60, e);
  const y = lerp(from[1], toY, e) - Math.sin(e * Math.PI) * 96;
  const s = lerp(1.5, 1, e);
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s.toFixed(3)})`,
      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, color: V.volt, whiteSpace: "nowrap",
      textShadow: `0 0 34px ${rgba(V.volt, 0.6)}, 0 6px 24px rgba(0,0,0,0.9)`,
    }}>{value}</div>
  );
};

// ── EL CONECTOR: del renglón encendido sale la tarjeta hacia la izquierda ────────────────────
const Conector: React.FC<{ p: number; y: number; toX: number }> = ({ p, y, toX }) => {
  const pp = clamp01(p);
  const x1 = lerp(P.x + 30, toX, pp);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <path d={`M ${P.x + 30} ${y} L ${x1.toFixed(1)} ${y}`}
        stroke={V.volt} strokeWidth={3} fill="none" opacity={0.85 * pp}
        style={{ filter: `drop-shadow(0 0 12px ${rgba(V.volt, 0.7)})` }} />
      <circle cx={x1} cy={y} r={7 * pp} fill={V.volt} opacity={0.95 * pp} />
    </svg>
  );
};

export const MovS9C: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto
  const toCF = (t: number) => cf - f + t;    // mi frame → reloj interno de las primitivas

  // LA LUZ: la lámpara desnuda sobre el papel. Cálida de punta a punta, sube un punto en los gratis.
  const keyFrom = interpolate(gFrame, [0, A2, A7, A10, A11], [0.3, 0.34, 0.4, 0.32, 0.26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A2 + 60, A9, A11, G_END], [0.86, 0.9, 1.04, 1.08, 0.9, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A9, G_END], [0.56, 0.62, 0.74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [A10, A11], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  const detach = acto === 10 ? clamp01((f - 10) / 40) : acto === 11 ? 1 : 0;
  const pilePx = pilePush(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: una sola vez, fuera del switch ─────────────────────────────────── */}
      <VoltAtmos tint={light(cool, "torch", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      {acto !== 11 && (
        <Layers cam={cam}>
          {/* la cama de foto REAL del banco de trabajo, desenfocada: vive bajo TODO el movimiento */}
          <Plane z={-660}>
            <PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.3} dim={0.76} tint={V.torch} />
          </Plane>

          {/* ⭐ LA LÁMINA: la MISMA hoja en los diez actos, función pura de gFrame */}
          <Plane z={0} style={{ perspective: 2200 }}>
            <Lamina g={gFrame} detach={detach} />
          </Plane>

          {/* ═══ ACTOS 3-6 · las cuatro que él nombra, una por una ═════════════════════════ */}
          {acto >= 3 && acto <= 6 && (() => {
            const nm = NOM[acto - 3];
            const open = clamp01(f / 20);
            const salida = acto === 6 ? 0 : clamp01((f - (START[acto + 1] - START[acto]) + 34) / 26);
            const rowY = ROW_Y0 + nm.row * ROW_H + ROW_H / 2;
            const fly = clamp01((gFrame - (nm.land - 26)) / 26);
            return (
              <>
                <Plane z={120}>
                  <Conector p={open} y={rowY} toX={538} />
                </Plane>
                <Plane z={200}>
                  <MediaCard src={nm.src} kind={nm.kind} w={470} h={296}
                    x={eio(20, 15.6, open) - salida * 22} y={nm.cy} z={0}
                    ry={eio(-26, -9, open)} rx={2} startFrom={12}
                    lit={0.5 + 0.5 * open} litColor={V.volt} label={nm.label} sheenAt={toCF(16)} radius={10}
                    opacity={open * (1 - salida)} />
                </Plane>

                {/* acto 4 · la casa se apaga cuarto por cuarto hasta quedar UNO encendido */}
                {acto === 4 && (
                  <Plane z={260}>
                    <div style={{ position: "absolute", left: 96, top: 690, width: 400, height: 250 }}>
                      {[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]].map((c, i) => {
                        const off = clamp01((f - (24 + i * 9)) / 12);
                        const keep = i === 4;
                        const on = keep ? 1 : 1 - off;
                        return (
                          <div key={i} style={{
                            position: "absolute", left: c[0] * 134, top: c[1] * 126, width: 126, height: 118,
                            border: `2px solid ${rgba(V.bone, 0.28)}`,
                            background: keep && off > 0.4
                              ? `linear-gradient(180deg, ${rgba(V.amber, 0.42)}, ${rgba(V.amber, 0.16)})`
                              : `${rgba(V.amber, 0.3 * on)}`,
                            boxShadow: keep && off > 0.4 ? `0 0 40px ${rgba(V.amber, 0.55)}` : "none",
                          }} />
                        );
                      })}
                      <div style={{
                        marginTop: 262, fontFamily: F_BODY, fontWeight: 700, fontSize: 24, letterSpacing: 3,
                        color: rgba(V.bone, 0.7),
                      }}>SÓLO EL CUARTO DONDE ESTÁS</div>
                    </div>
                  </Plane>
                )}

                {/* acto 5 · el contador de focos: de 1 a 10 mientras se enfrían de amarillo a blanco */}
                {acto === 5 && (() => {
                  const cnt = Math.min(10, Math.max(0, Math.floor((f - 16) / 5) + 1));
                  if (cnt <= 0) return null;
                  return (
                    <Plane z={300}>
                      <div style={{ position: "absolute", left: 300, top: 690, transform: "translateX(-50%)", textAlign: "center" }}>
                        <div style={{
                          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 116, lineHeight: 0.9,
                          color: light(cnt / 10, "amber", "torch"),
                          textShadow: `0 0 42px ${rgba(V.amber, 0.5)}, 0 6px 24px rgba(0,0,0,0.9)`,
                        }}>{cnt}</div>
                        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 25, letterSpacing: 3.4, color: rgba(V.bone, 0.72), marginTop: 4 }}>
                          DE 10 FOCOS
                        </div>
                      </div>
                    </Plane>
                  );
                })()}

                {/* acto 6 · la sala de atrás se pone un punto más cálida en cada grado */}
                {acto === 6 && (() => {
                  const gr = Math.min(3, Math.max(0, Math.floor((f - 14) / 12) + 1));
                  return (
                    <Plane z={300}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, width: 560, height: 1080,
                        background: `linear-gradient(90deg, ${rgba(V.amber, 0.06 * gr)} 0%, rgba(0,0,0,0) 100%)`,
                      }} />
                      <div style={{ position: "absolute", left: 300, top: 700, transform: "translateX(-50%)", textAlign: "center" }}>
                        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 88, color: V.amber, textShadow: "0 6px 24px rgba(0,0,0,0.9)" }}>
                          {20 + gr + 1}°
                        </div>
                        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 25, letterSpacing: 3.4, color: rgba(V.bone, 0.72) }}>
                          DE 21 A 24
                        </div>
                      </div>
                    </Plane>
                  );
                })()}

                {/* la cifra sale DESDE el material y se posa en la columna de su renglón */}
                <Plane z={400}>
                  <CifraVuela p={fly} from={nm.from} toY={rowY} value={FILAS[nm.row].v} />
                </Plane>
              </>
            );
          })()}

          {/* ═══ ACTOS 7-8 · la pila de cifras en el margen derecho de la lámina ═══════════ */}
          {(acto === 7 || acto === 8) && (
            <Plane z={420}>
              {NOM.map((nm, k) => {
                const p = coinP(gFrame, k);
                if (p <= 0.001) return null;
                const y = PILE_Y0 - k * PILE_STEP - pilePx;
                return (
                  <div key={nm.row} style={{
                    position: "absolute", left: PILE_X, top: lerp(ROW_Y0 + nm.row * ROW_H + 8, y, p),
                    transform: `translateX(-50%) rotate(${((1 - p) * 8).toFixed(2)}deg)`,
                    padding: "6px 20px", borderRadius: 6,
                    background: `linear-gradient(180deg, ${rgba(V.volt, 0.94)}, ${rgba(V.voltSoft, 0.94)})`,
                    boxShadow: `0 ${Math.round(10 + k * 2)}px ${Math.round(20 + k * 4)}px ${rgba(V.ink0, 0.72)}`,
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color: V.ink0, whiteSpace: "nowrap",
                  }}>{FILAS[nm.row].v}</div>
                );
              })}
              {/* el total del mes */}
              {(() => {
                const t45 = clamp01((gFrame - (A7 + 98)) / 14);
                const t94 = clamp01((gFrame - (A8 + 96)) / 14);
                if (t45 <= 0) return null;
                const topY = PILE_Y0 - 3 * PILE_STEP - pilePx;
                const y = lerp(PILE_Y0 + 74, topY - 118, t94);
                return (
                  <div style={{ position: "absolute", left: PILE_X, top: y, transform: `translateX(-50%) scale(${lerp(1.25, 1, Math.max(t45 * (1 - t94), t94)).toFixed(3)})`, textAlign: "center" }}>
                    <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 3.2, color: rgba(V.bone, 0.72), whiteSpace: "nowrap" }}>
                      {t94 > 0.5 ? "CON LOS CUATRO GRANDES" : "EN UNA CASA COMÚN"}
                    </div>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.92, color: V.volt,
                      textShadow: `0 0 52px ${rgba(V.volt, 0.45)}, 0 6px 26px rgba(0,0,0,0.92)`,
                    }}>{t94 > 0.5 ? "94" : "45"}</div>
                    <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2, color: rgba(V.bone, 0.66) }}>AL MES</div>
                  </div>
                );
              })()}
            </Plane>
          )}

          {/* ═══ ACTO 8 · los cuatro aparatos grandes, con material REAL, empujando la pila ═ */}
          {acto === 8 && (
            <Plane z={330}>
              {[
                { src: M.hornoF, kind: "photo" as const, label: "LA ESTUFA", y: 22 },
                { src: M.calefactorV, kind: "video" as const, label: "EL CALEFACTOR", y: 41 },
                { src: M.tanqueV, kind: "video" as const, label: "EL CALENTADOR DE AGUA", y: 60 },
                { src: M.aireF, kind: "photo" as const, label: "EL AIRE", y: 79 },
              ].map((o, i) => {
                const on = clamp01((f - (10 + i * 24)) / 18);
                if (on <= 0) return null;
                return (
                  <MediaCard key={o.label} src={o.src} kind={o.kind} w={352} h={196}
                    x={eio(11, 15, on)} y={o.y} z={0} ry={eio(-22, -11, on)} startFrom={10}
                    lit={0.4 + 0.6 * on} litColor={V.amber} label={o.label} sheenAt={toCF(12 + i * 24)}
                    radius={9} opacity={on} />
                );
              })}
            </Plane>
          )}

          {/* ═══ ACTO 9 · el rótulo del reordenado ════════════════════════════════════════ */}
          {acto === 9 && (
            <Plane z={340}>
              <div style={{ position: "absolute", left: 96, top: 300, width: 400 }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 60, lineHeight: 1.02, color: V.volt, textShadow: "0 6px 26px rgba(0,0,0,0.92)" }}>
                  DEL QUE MÁS TE DEVUELVE
                </div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 60, lineHeight: 1.02, color: rgba(V.bone, 0.72), textShadow: "0 6px 26px rgba(0,0,0,0.92)" }}>
                  AL QUE MENOS
                </div>
              </div>
              <IconPng src={M.icCuaderno} x={16} y={62} size={112} z={0} opacity={0.4} glow={V.ink0} />
            </Plane>
          )}

          {/* ═══ ACTO 10 · las OTRAS DOS HOJAS entran, se apilan y bajan al borde ═════════ */}
          {acto === 10 && (() => {
            const h1 = clamp01((f - 20) / 34);
            const h2 = clamp01((f - 48) / 34);
            const bajan = clamp01((f - 118) / 44);
            const HOJAS = [
              { p: h1, src: M.filaF, ttl: "LOS 60 APARATOS", sub: "ordenados por lo que te comen", x0: 130, x1: 44, y: 18, lines: ["Aire acondicionado", "Calentador de agua", "Estufa eléctrica", "Horno eléctrico", "Secadora", "Congelador viejo"] },
              { p: h2, src: M.calibresF, ttl: "LAS CONEXIONES", sub: "cable y fusible por consumo", x0: 136, x1: 62, y: 30, lines: ["2,5 mm² · 16 A", "4 mm² · 20 A", "6 mm² · 25 A", "10 mm² · 32 A"] },
            ];
            return (
              <Plane z={220}>
                <div style={{ transform: `translateY(${(bajan * 470).toFixed(1)}px)` }}>
                  {HOJAS.map((h) => (
                    <div key={h.ttl} style={{
                      position: "absolute", left: `${lerp(h.x0, h.x1, h.p).toFixed(2)}%`, top: `${h.y}%`,
                      width: 560, height: 700, marginLeft: -280, opacity: h.p,
                      transform: `rotate(${lerp(9, 3.2, h.p).toFixed(2)}deg)`,
                      borderRadius: 6, overflow: "hidden",
                      background: `linear-gradient(163deg, ${PAPER.hi} 0%, ${PAPER.mid} 60%, ${PAPER.lo} 100%)`,
                      boxShadow: `0 36px 80px ${rgba(V.ink0, 0.84)}`,
                    }}>
                      <div style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "multiply", backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px" }} />
                      <div style={{ position: "absolute", left: 34, top: 30, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color: PAPER.ink }}>{h.ttl}</div>
                      <div style={{ position: "absolute", left: 34, top: 78, fontFamily: F_BODY, fontWeight: 500, fontSize: 23, color: PAPER.inkSoft }}>{h.sub}</div>
                      <div style={{ position: "absolute", left: 34, right: 34, top: 118, height: 2, background: "rgba(38,40,30,0.26)" }} />
                      {h.lines.map((ln, k) => (
                        <div key={ln} style={{
                          position: "absolute", left: 34, top: 140 + k * 40,
                          fontFamily: F_BODY, fontWeight: 600, fontSize: 25, color: "rgba(38,40,30,0.6)",
                        }}>{`${k + 1}.  ${ln}`}</div>
                      ))}
                      {/* la miniatura REAL que hace reconocible la hoja de un vistazo */}
                      <div style={{ position: "absolute", left: 34, right: 34, bottom: 30, height: 250 }}>
                        <MediaCard src={h.src} kind="photo" w={492} h={250} x={50} y={50} z={0}
                          lit={0.9} litColor={V.torch} radius={6} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* la flecha corta apuntando hacia abajo, y nada más */}
                {bajan > 0.5 && (
                  <>
                    <IconPng src={M.icFlecha} x={78} y={eio(66, 74, clamp01((bajan - 0.5) / 0.5))} size={104} z={0}
                      opacity={clamp01((bajan - 0.5) / 0.5)} rot={90} glow={V.volt} />
                    <div style={{
                      position: "absolute", left: "78%", top: "84%", transform: "translateX(-50%)",
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.4, color: V.volt,
                      opacity: clamp01((bajan - 0.6) / 0.4), whiteSpace: "nowrap",
                      textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                    }}>ESTÁN ABAJO</div>
                  </>
                )}
              </Plane>
            );
          })()}
        </Layers>
      )}

      {/* ══════ ACTO 11 · ⭐ EL QR — fuera de <Layers>: sin perspectiva, sin rotación ══════ */}
      {acto === 11 && (() => {
        // la pila de hojas del acto 10 se acuesta y SE CONVIERTE en el panel: sube desde el borde
        const rise = clamp01(f / 18);
        const drift = clamp01((f - 24) / 236);
        const dx = -Math.round(24 * drift);          // píxeles ENTEROS: el QR nunca se resamplea
        const dy = -Math.round(8 * drift);
        const step = (k: number) => clamp01((f - (58 + k * 15)) / 14);
        const sweep = clamp01((f - 40) / 40);        // barre UNA sola vez y se apaga
        const qrIn = clamp01((f - 26) / 16);
        const PANEL = { x: 1140, y: 220, s: 560 };   // el panel blanco
        const QRS = 460;                             // el QR: 460 px + 50 px de quiet zone añadida
        return (
          <AbsoluteFill style={{ overflow: "hidden" }}>
            {/* la cama de foto REAL del banco del garaje, desenfocada */}
            <AbsoluteFill style={{ transform: "scale(1.16)" }}>
              <Img src={staticFile(M.bancoF)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(9px)" }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ background: rgba(V.ink0, 0.72) }} />
            {/* EL PANEL OSCURO: es la pila acostada, entra desde abajo y tapa. No es un fundido. */}
            <AbsoluteFill style={{
              transform: `translateY(${((1 - eio(0, 1, rise)) * 1080).toFixed(1)}px)`,
              background: `linear-gradient(152deg, ${rgba(V.ink1, 0.97)} 0%, ${rgba(V.ink0, 0.99)} 62%, ${rgba(V.ink2, 0.97)} 100%)`,
              boxShadow: `inset 0 2px 0 ${rgba(V.volt, 0.2)}`,
            }} />
            {/* la lámpara desnuda sigue arriba */}
            <AbsoluteFill style={{
              opacity: rise,
              background: `radial-gradient(72% 48% at 26% -8%, ${rgba(V.torch, 0.16)} 0%, rgba(0,0,0,0) 62%)`,
            }} />
            {/* el polvo sigue suspendido */}
            <AbsoluteFill style={{ opacity: 0.4 * rise }}>
              {Array.from({ length: 18 }, (_, i) => {
                const yy = (rnd(i * 4.7) * 116 - (f * (0.3 + rnd(i * 2.9) * 0.8)) / 15) % 116;
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${(rnd(i * 7.3) * 100).toFixed(2)}%`, top: `${((yy + 116) % 116 - 8).toFixed(2)}%`,
                    width: 3, height: 3, borderRadius: "50%", background: rgba(V.torch, 0.18 + rnd(i * 5.5) * 0.2),
                  }} />
                );
              })}
            </AbsoluteFill>

            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: `translate(${dx}px, ${dy}px)`, opacity: rise }}>
              {/* ── IZQUIERDA · el título a dos líneas + los tres pasos ─────────────────── */}
              <div style={{ position: "absolute", left: 148, top: 236, width: 900 }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 82, lineHeight: 1.0, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.92)" }}>
                  MI CUADERNO DE DOS AÑOS
                </div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 82, lineHeight: 1.0, color: V.volt, textShadow: `0 0 46px ${rgba(V.volt, 0.32)}, 0 6px 30px rgba(0,0,0,0.92)` }}>
                  PASADO EN LIMPIO
                </div>
                <div style={{ marginTop: 14, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, color: rgba(V.bone, 0.7) }}>
                  las 14 acciones · los 60 aparatos · las conexiones
                </div>
                <div style={{ marginTop: 46 }}>
                  {["ABRE LA CÁMARA", "APUNTA AL CÓDIGO", "TOCA EL AVISO"].map((t, k) => {
                    const p = step(k);
                    if (p <= 0) return null;
                    return (
                      <div key={t} style={{
                        display: "flex", alignItems: "center", marginBottom: 22,
                        opacity: p, transform: `translateX(${((1 - p) * -34).toFixed(1)}px)`,
                      }}>
                        <div style={{
                          width: 58, height: 58, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                          background: rgba(V.volt, 0.95), color: V.ink0,
                          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 36,
                          boxShadow: `0 10px 26px ${rgba(V.ink0, 0.7)}`,
                        }}>{k + 1}</div>
                        <div style={{
                          marginLeft: 22, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: 2.2,
                          color: V.white, textShadow: "0 5px 22px rgba(0,0,0,0.9)",
                        }}>{t}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── DERECHA · EL QR · panel blanco, quiet zone generosa, NADA encima ─────── */}
              <div style={{
                position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.s, height: PANEL.s,
                background: "#FFFFFF", borderRadius: 8,
                boxShadow: `0 34px 78px ${rgba(V.ink0, 0.9)}, 0 4px 18px ${rgba(V.ink0, 0.8)}`,
                opacity: qrIn,
              }}>
                <Img src={staticFile(M.qr)} style={{
                  position: "absolute", left: (PANEL.s - QRS) / 2, top: (PANEL.s - QRS) / 2,
                  width: QRS, height: QRS,
                }} />
              </div>
              {/* el marco de escaneo: cuatro esquinas POR FUERA del panel blanco */}
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map((c, i) => {
                const p = clamp01((f - (34 + i * 4)) / 12);
                const L = 74, W = 6, O = 28;   // O=28 deja 4 px de aire: NINGUNA esquina toca el QR
                const left = PANEL.x - O + c[0] * (PANEL.s + 2 * O - L);
                const top = PANEL.y - O + c[1] * (PANEL.s + 2 * O - L);
                return (
                  <div key={i} style={{ position: "absolute", left, top, width: L, height: L, opacity: p }}>
                    <div style={{ position: "absolute", left: c[0] ? "auto" : 0, right: c[0] ? 0 : "auto", top: c[1] ? "auto" : 0, bottom: c[1] ? 0 : "auto", width: L, height: W, background: V.volt, boxShadow: `0 0 16px ${rgba(V.volt, 0.7)}` }} />
                    <div style={{ position: "absolute", left: c[0] ? "auto" : 0, right: c[0] ? 0 : "auto", top: c[1] ? "auto" : 0, bottom: c[1] ? 0 : "auto", width: W, height: L, background: V.volt, boxShadow: `0 0 16px ${rgba(V.volt, 0.7)}` }} />
                  </div>
                );
              })}
              {/* la línea que barre UNA sola vez y se apaga (después el QR queda limpio 7,5 s) */}
              {sweep > 0 && sweep < 1 && (
                <div style={{
                  position: "absolute", left: PANEL.x - 12, top: PANEL.y + lerp(6, PANEL.s - 6, sweep),
                  width: PANEL.s + 24, height: 3, background: rgba(V.volt, 0.7 * Math.sin(sweep * Math.PI)),
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.6 * Math.sin(sweep * Math.PI))}`,
                }} />
              )}
              <div style={{
                position: "absolute", left: PANEL.x, top: PANEL.y + PANEL.s + 26, width: PANEL.s, textAlign: "center",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6, color: rgba(V.bone, 0.74),
                opacity: clamp01((f - 96) / 16),
              }}>TAMBIÉN EN LA DESCRIPCIÓN</div>
            </div>
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};
