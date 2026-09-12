// MovVeredicto.tsx — MOVIMIENTO 6 · EL ÚLTIMO · "EL VEREDICTO" · ~1260 frames @30fps (42 s)
// Canal Claudio Mendoza Constructor (ES) · video `cmeduelo` · sección S11 (s196–s203).
//
// UN SOLO PLANO SECUENCIA. Una atmósfera (<VoltAtmos/>) montada UNA vez para los 42 s, UNA foto de
// fondo que nunca se cambia (el patio, `cmed_o_1023_planoFinalPatio`), UNA cámara `gcam(f, …)` que
// viaja z 200 → 330 con panX −40 y NUNCA vuelve a cero, y una LUZ que hace el argumento entero:
// ÁMBAR PLENO (la factura, donde el panel gana) → VOLTIO ganando el careo (el dato duro) → papel
// (la cuenta del mes) → TORCH (la noche del apagón) → **ÁMBAR Y VOLTIO EN EQUILIBRIO**. En el
// último acto los dos rims —voltio por izquierda, ámbar por derecha— están encendidos AL MISMO
// TIEMPO en el mismo cuadro: la reconciliación se VE en la luz, no sólo se lee en el texto.
//
// EL VIENTO CUENTA LA EXCEPCIÓN (es literal): .10 en el duelo (patio quieto = gana el panel) · .08
// en "es aburrido" · **.85–.90** en "donde el viento es de verdad" · .35 en la alianza.
//
// LA MATERIA QUE CRUZA TODAS LAS FRONTERAS: **LAS DOS COLUMNAS**. Llegan de MovMarcador (voltio
// alta, ámbar baja, de pie sobre la losa y=838). Acá se MORFAN a las dos tarjetas del careo
// (panel / turbina), la losa donde estaban paradas se vuelve el RIEL DEL MARCADOR 8 a 1, y en el
// último acto cada aparato suelta un CABLE DE SU PROPIO COLOR (voltio el del panel, ámbar el de la
// turbina) que converge en la misma estación.
//      columna → tarjeta → riel → cable → batería.  Un solo hilo, cuarenta y dos segundos.
//
// Detalle deliberado: en el duelo la turbina es una FOTO QUIETA (todavía es un adorno) y el panel
// un CLIP que corre; en la noche la turbina pasa a ser CLIP y el panel desaparece del cuadro. El
// material mismo dice quién manda en cada acto.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos (todo en fracciones de `durationInFrames` = D)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · 0.000–0.126 D · "EL CAREO"        (protagonista: las dos tarjetas enfrentadas)
//   enterFrom cam {z0 200, ry −10, view 0.90 — EXACTO donde lo dejó MovMarcador}
//             luz {ÁMBAR PLENO, key a la derecha 0.70, intensidad 1.00}   viento {.10}
//             materia {LAS DOS COLUMNAS del gráfico, de pie sobre la losa}
//   exitTo    cam {z ~243, ry −4}   luz {ámbar, la key empezando a correrse a la izquierda}
//             viento {.10}   materia {las dos tarjetas ya formadas: panel izq. / turbina der.}
//   (beat interno f 0–72 · MATCH-SHAPE DE ENTRADA: el rect de cada columna se convierte en el
//    rect de su tarjeta y la PIEL de la columna se DRENA por wipe dejando ver el material real)
//   ── FRONTERA A @0.116 D ····· MATCH-MOVE ·······································
//      El dolly hacia el panel YA viene andando. La tarjeta del panel conserva su rect en pantalla
//      mientras TODO cambia detrás: la turbina retrocede y se apaga, la key salta de ámbar
//      (derecha) a voltio (izquierda) y el riel del marcador se dibuja sobre la losa.
//      Por qué: los dos lados comparten sujeto y vector — cortar acá sería un salto de eje.
//
// ACTO 2 · 0.126–0.335 D · "LA PALIZA"       (protagonista: la tarjeta del PANEL, adelantada)
//   enterFrom cam {z ~243}   luz {ámbar → VOLTIO sobre el panel}   viento {.10}
//             materia {las dos tarjetas + la losa}
//   exitTo    cam {z ~286}   luz {voltio pleno sobre el panel, contra ámbar vivo}  viento {.10}
//             materia {el marcador 8 a 1 completo sobre el riel + el panel casi a pantalla}
//   (beats: @0.205 nace el riel · @0.252 el remate "8 A 1" con <SeamFlash/> voltio de 5 frames =
//    CORTE EN EL BEAT interno, sobre la palabra "ocho")
//   ── FRONTERA B @0.318 D ····· ZOOM-THROUGH ·····································
//      La cámara ENTRA en la tarjeta del panel (×7.5 hacia su centro: nos la comemos) y sale en la
//      cuenta del mes, la escena casi blanca. Por qué: es el único modo de justificar el salto de
//      luma patio-nocturno → papel sin que sea un fundido. No cortamos: atravesamos el material.
//
// ACTO 3 · 0.335–0.535 D · "LA CUENTA"       (protagonista: los $50 sobre papel — <WhiteRoom/>)
//   enterFrom cam {z ~286, view 0.86}   luz {PAPEL cálido, ámbar}   viento {.10 → .08}
//             materia {el panel, ahora como FOTO quieta sobre la hoja}
//   exitTo    cam {z ~307}   luz {papel bajando}   viento {.08}
//             materia {la foto del panel, deliberadamente aburrida, en el centro de la hoja}
//   (beat @0.448 "es aburrido, no gira, no hace ruido": todo se aquieta, el viento cae a .08)
//   ── FRONTERA C @0.518 D ····· OCLUSIÓN ·········································
//      DOS PALAS del rotor (`V.blade`, el plástico blanco — ⛔ NUNCA el color del fondo) cruzan el
//      cuadro a 8° y −14° con 7 frames de diferencia: es un rotor pasando delante del lente. Bajo
//      la cobertura opaca se hace TODO el giro día→noche (luz a torch, viento a .85, la hoja se
//      desmonta). Por qué acá: es el cambio de tema más fuerte del movimiento y la materia que
//      tapa ES la protagonista del acto que entra.
//
// ACTO 4 · 0.535–0.775 D · "LA EXCEPCIÓN"    (protagonista: la turbina de noche, con el carrusel
//                                             de condiciones REALES orbitándola)
//   enterFrom cam {z ~307, rx −3}   luz {TORCH, única fuente}   viento {.85}
//             materia {la silueta de la turbina — es lo que acaba de cruzar}
//   exitTo    cam {z ~322}   luz {torch empezando a levantar}   viento {.85}
//             materia {la turbina a pantalla, girando, cargando}
//   (beats: @0.565 el <Carousel3D/> de 4 condiciones orbita alrededor de la turbina ·
//    @0.688 las condiciones COLAPSAN hacia ella y la turbina crece: se meten adentro)
//   ── FRONTERA D @0.758 D ····· WIPE POR MATERIA ·································
//      La lluvia del temporal (<SeamWipeMatter/> en `V.sky`) cruza el cuadro; debajo la luz sube de
//      torch a ámbar+voltio y el panel vuelve a entrar por la izquierda. La turbina NO se desmonta:
//      viaja entera de un acto al otro. Por qué: acá no hay que ocultar un cambio de tema, hay que
//      ocultar un cambio de LUZ mientras el sujeto sigue en cuadro.
//
// ACTO 5 · 0.775–1.000 D · "LA ALIANZA"      (protagonista: la estación donde entran los dos cables)
//   enterFrom cam {z ~322}   luz {torch → ámbar+voltio}   viento {.85 → .35}
//             materia {la turbina viajando hacia la derecha}
//   exitTo    cam {z1 330, panX −40, view 0.74 — plano ABIERTO, los dos del MISMO lado}
//             luz {ÁMBAR Y VOLTIO EN EQUILIBRIO: los dos rims al 100 %}   viento {.35}
//             materia {LOS DOS CABLES CONVERGIENDO EN LA MISMA ESTACIÓN} ← último plano del video
//   (beat @0.902 los cables aterrizan en la batería: <SeamFlash/> voltio corto)
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero blur grande a pantalla · cero fade ·
// ⛔ ningún precio de la guía ni URL en pantalla (los $50 son los del guion: el presupuesto).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, rgba, lerp, clamp01, rnd, gcam, light,
  VoltAtmos, WindField, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, WhiteRoom, SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVVEREDICTO_FRAMES = 1260;

/* ── easings (⛔ Easing.quint NO EXISTE → Easing.poly(5)) ─────────────────────────────────── */
type Ease = (t: number) => number;
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1) as Ease,
  push: Easing.bezier(0.58, 0.0, 0.22, 1) as Ease,
  snap: Easing.bezier(0.14, 0.86, 0.22, 1) as Ease,
  soft: Easing.bezier(0.42, 0.06, 0.36, 1) as Ease,
  brake: Easing.bezier(0.05, 0.84, 0.12, 1) as Ease,
  settle: Easing.poly(5) as Ease,
  lin: ((t: number) => t) as Ease,
};

/** rampa multi-key con easing POR SEGMENTO — el easing nunca es constante en toda la pieza */
const keyed = (f: number, ks: number[], vs: number[], e: Ease | Ease[] = EZ.glide): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const w = ks[i + 1] - ks[i];
  const t = w <= 0 ? 1 : clamp01((f - ks[i]) / w);
  const ef: Ease = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/** mezcla dos colores (acepta "#rrggbb" y "rgb(r,g,b)"): encadena las cuatro temperaturas del
 *  Stage sin que la luz SALTE nunca de una a otra. */
const parseC = (c: string): number[] => {
  if (c.charAt(0) === "#") {
    const x = parseInt(c.slice(1), 16);
    return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
  }
  const m = c.replace(/[^0-9,]/g, "").split(",");
  return [Number(m[0]) || 0, Number(m[1]) || 0, Number(m[2]) || 0];
};
const mixc = (a: string, b: string, t: number): string => {
  const A = parseC(a);
  const B = parseC(b);
  const k = clamp01(t);
  return `rgb(${Math.round(lerp(A[0], B[0], k))},${Math.round(lerp(A[1], B[1], k))},${Math.round(lerp(A[2], B[2], k))})`;
};

/* ── MATERIAL REAL (⛔ SÓLO nombres de _v3/material_MovVeredicto.txt + los íconos del kit) ─── */
const M = {
  patio: "img/cmeduelo/cmed_o_1023_planoFinalPatio.jpg",
  panelClip: "broll/cmeduelo/cmed_h_1005_claudioPalmeaPanel.mp4",
  panelFoto: "img/cmeduelo/cmed_h_1005_claudioPalmeaPanel.jpg",
  turbinaFoto: "img/cmeduelo/cmed_o_1009_ernestoLlevaTurbina.jpg",
  turbinaNoche: "broll/cmeduelo/cmed_o_1007_turbinaNocheGira.mp4",
  paga: "img/cmeduelo/cmed_o_1002_ernestoPagaDiez.jpg",
  tela: "broll/cmeduelo/cmed_o_1013_telaAlViento.mp4",
  anemo: "broll/cmeduelo/cmed_o_1010_ernestoAnemometro.mp4",
  apagon: "img/cmeduelo/cmed_o_1006_patioApagon.jpg",
  estacion: "img/cmeduelo/cmed_o_1020_dosCablesUnaBateria.jpg",
  icSol: "img/cmeduelo/cmed_ic_sol.png",
  icViento: "img/cmeduelo/cmed_ic_viento.png",
  icPanel: "img/cmeduelo/cmed_ic_panel.png",
  icTurbina: "img/cmeduelo/cmed_ic_turbina.png",
  icNoche: "img/cmeduelo/cmed_ic_bombillanoche.png",
  icTormenta: "img/cmeduelo/cmed_ic_tormenta.png",
  icBateria: "img/cmeduelo/cmed_ic_bateria.png",
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   GEOMETRÍA COMPARTIDA — las dos columnas que llegan de MovMarcador y la losa donde se paran.
   Todo el movimiento cuelga de estos números: la losa (BASE_Y) es después el riel del marcador,
   y el riel es después el nivel del que salen los dos cables.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BASE_Y = 838;                                   // la losa: el suelo del gráfico
const COL_V = { w: 168, h: 436, cx: 706 };            // columna VOLTIO  (el panel)
const COL_A = { w: 168, h: 252, cx: 1214 };           // columna ÁMBAR   (la turbina)
const pctX = (px: number) => (px / 1920) * 100;
const pctY = (px: number) => (px / 1080) * 100;
const colCenterY = (c: { h: number }) => pctY(BASE_Y - c.h / 2);

/* ── LA PIEL DE LA COLUMNA: se DRENA por wipe dejando ver el material real que hay debajo.
      Éste es el MATCH-SHAPE de entrada: mismo rect, otro contenido, cero fade. ─────────────── */
const ColumnSkin: React.FC<{
  x: number; y: number; w: number; h: number; drain: number; color: string; radius: number;
}> = ({ x, y, w, h, drain, color, radius }) => {
  if (drain >= 0.999) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      borderRadius: radius, pointerEvents: "none",
      clipPath: `inset(${(drain * 100).toFixed(2)}% 0px 0px 0px)`,
      background: `linear-gradient(180deg, ${rgba(color, 0.96)} 0%, ${rgba(color, 0.58)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.42)}, 0 0 34px ${rgba(color, 0.3)}`,
    }} />
  );
};

/* ── EL MARCADOR 8 A 1 — helper DIBUJADO (es un gráfico, no un objeto): nueve casilleros sobre
      la MISMA losa donde estaban paradas las columnas. Ocho se encienden voltio, uno ámbar. ── */
const ScoreRail: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const grow = EZ.brake(clamp01((f - at) / 30));
  if (grow <= 0.002) return null;
  const RX = 360, PITCH = 92, PW = 86, PH = 24;
  return (
    <div style={{ position: "absolute", left: RX, top: BASE_Y }}>
      {/* el riel: la losa donde se pararon las columnas, ahora con marcas */}
      <div style={{
        position: "absolute", left: 0, top: 0, height: 4, width: (8 * PITCH + PW) * grow, borderRadius: 2,
        background: `linear-gradient(90deg, ${rgba(V.white, 0.1)} 0%, ${rgba(V.white, 0.42)} 12%, ${rgba(V.white, 0.34)} 88%, ${rgba(V.white, 0.08)} 100%)`,
        boxShadow: `0 6px 20px ${rgba(V.ink0, 0.8)}`,
      }} />
      {Array.from({ length: 9 }, (_, i) => {
        const on = EZ.snap(clamp01((f - (at + 14 + i * 6)) / 11));
        const col = i < 8 ? V.volt : V.amber;
        return (
          <div key={i} style={{
            position: "absolute", left: i * PITCH, top: -PH - 12, width: PW, height: PH, borderRadius: 4,
            transform: `translateY(${((1 - on) * 16).toFixed(2)}px) scaleY(${(0.3 + on * 0.7).toFixed(3)})`,
            transformOrigin: "50% 100%",
            background: on > 0.02
              ? `linear-gradient(180deg, ${rgba(col, 0.95)} 0%, ${rgba(col, 0.55)} 100%)`
              : `linear-gradient(180deg, ${rgba(V.white, 0.07)} 0%, ${rgba(V.ink0, 0.3)} 100%)`,
            border: `1px solid ${rgba(col, 0.2 + 0.4 * on)}`,
            boxShadow: on > 0.02
              ? `0 0 ${(10 + 18 * on).toFixed(0)}px ${rgba(col, 0.4 * on)}, inset 0 1px 0 ${rgba(V.white, 0.4)}`
              : `inset 0 1px 0 ${rgba(V.white, 0.08)}`,
          }} />
        );
      })}
    </div>
  );
};

/* ── LOS DOS CABLES — trazo dibujado (helper legítimo) de cada aparato a la MISMA estación.
      Cada cable conserva el color de SU columna del acto 1: voltio el del panel, ámbar el de la
      turbina. Lleva un pulso de carga bajando: la energía entrando a la batería. ───────────── */
const qPoint = (p0: number[], p1: number[], p2: number[], t: number): number[] => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
};
const qLen = (p0: number[], p1: number[], p2: number[]): number => {
  let L = 0;
  let prev = p0;
  for (let i = 1; i <= 24; i++) {
    const q = qPoint(p0, p1, p2, i / 24);
    const dx = q[0] - prev[0];
    const dy = q[1] - prev[1];
    L += Math.sqrt(dx * dx + dy * dy);
    prev = q;
  }
  return L;
};
const Cable: React.FC<{
  f: number; from: number[]; ctrl: number[]; to: number[]; color: string; grow: number; seed: number;
}> = ({ f, from, ctrl, to, color, grow, seed }) => {
  if (grow <= 0.004) return null;
  const g = EZ.glide(clamp01(grow));
  const L = qLen(from, ctrl, to);
  const d = `M ${from[0].toFixed(1)} ${from[1].toFixed(1)} Q ${ctrl[0].toFixed(1)} ${ctrl[1].toFixed(1)} ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;
  const pt = ((f * 0.014 + seed) % 1 + 1) % 1;
  const P = qPoint(from, ctrl, to, pt * g);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <path d={d} fill="none" stroke={rgba(color, 0.16)} strokeWidth={17} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      <path d={d} fill="none" stroke={rgba(V.ink0, 0.92)} strokeWidth={9} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      <path d={d} fill="none" stroke={rgba(color, 0.9)} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${L.toFixed(1)} ${L.toFixed(1)}`} strokeDashoffset={(L * (1 - g)).toFixed(1)} />
      {g > 0.14 && <circle cx={P[0].toFixed(1)} cy={P[1].toFixed(1)} r={16} fill={rgba(color, 0.16)} />}
      {g > 0.14 && <circle cx={P[0].toFixed(1)} cy={P[1].toFixed(1)} r={7} fill={rgba(color, 0.95)} />}
    </svg>
  );
};

/* ── LA LLUVIA DE LA NOCHE (con `rnd` del Stage, jamás Math.random) ───────────────────────── */
const NightRain: React.FC<{ f: number; on: number; tint: string }> = ({ f, on, tint }) => {
  if (on <= 0.02) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: on }}>
      {Array.from({ length: 34 }, (_, i) => {
        const a = rnd(i * 3.71);
        const b = rnd(i * 8.13);
        const sp = 26 + b * 34;
        const yy = ((a * 1400 + f * sp) % 1400) - 200;
        const len = 60 + b * 130;
        return (
          <div key={i} style={{
            position: "absolute", left: `${(a * 108 - 4).toFixed(2)}%`, top: yy.toFixed(1),
            width: 2, height: len, transform: "rotate(-15deg)",
            background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(tint, 0.1 + b * 0.2)} 60%, rgba(0,0,0,0))`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ── CUE de texto: entra y sale por WIPE (clip-path), jamás por opacity ───────────────────── */
const CueBed: React.FC<{
  f: number; from: number; to: number; box: React.CSSProperties; children: React.ReactNode;
}> = ({ f, from, to, box, children }) => {
  if (f < from || f > to) return null;
  const i = EZ.snap(clamp01((f - from) / 18));
  const o = EZ.push(clamp01((f - (to - 15)) / 15));
  return (
    <div style={{
      position: "absolute", ...box,
      transform: `translateY(${((1 - i) * 32 - o * 26).toFixed(2)}px)`,
      clipPath: `inset(${(o * 100).toFixed(1)}% 0px ${((1 - i) * 100).toFixed(1)}% 0px)`,
    }}>{children}</div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovVeredicto: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const END = Math.max(360, D);
  /** los actos son FRACCIONES de la duración: aguanta el re-anclaje al Whisper ±20 % */
  const A = (x: number) => Math.round(END * x);
  const f = Math.min(Math.max(frame, 0), END - 1);

  /* ── los cinco actos y las cuatro fronteras ─────────────────────────────────────────────── */
  const A1 = 0;
  const A2 = A(0.126);
  const A3 = A(0.335);
  const A4 = A(0.535);
  const A5 = A(0.775);
  const FA = A(0.116);   // MATCH-MOVE
  const FB = A(0.318);   // ZOOM-THROUGH
  const FC = A(0.518);   // OCLUSIÓN (dos palas del rotor)
  const FD = A(0.758);   // WIPE POR MATERIA (la lluvia del temporal)
  const B_RAIL = A(0.205);
  const B_EIGHT = A(0.252);
  const B_BORING = A(0.448);
  const B_CARO = A(0.565);
  const B_COLL = A(0.688);
  const B_LAND = A(0.902);

  /* ── LA CÁMARA: UNA sola llamada a gcam sobre el frame GLOBAL. Nunca vuelve a 0. ────────── */
  const G = gcam(f, { z0: 200, z1: 330, panX: -40, panY: -16, dur: END });
  const mz = keyed(f, [A1, FA, A2, FB, A3, FC, A4, B_COLL, A5, END],
    [0, 12, 18, 70, -10, 4, 6, 46, 26, 40],
    [EZ.soft, EZ.glide, EZ.push, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.soft, EZ.settle]);
  const mx = keyed(f, [A1, FA, A2, B_EIGHT, A3, FC, B_CARO, A5, END],
    [0, -14, -22, 10, 6, -8, 4, 18, 0],
    [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.settle]);
  const my = keyed(f, [A1, A2, A3, FC, A4, B_COLL, A5, END],
    [0, 6, -12, -4, 10, -6, 4, 16],
    [EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.settle]);
  // el careo arranca EXACTO en ry −10 (lo que dejó MovMarcador) y se abre a 0: los dos del mismo lado
  const ryX = keyed(f, [A1, A2, A3, A4, B_COLL, A5, END],
    [-10, -4.2, 0.6, 3.4, 1.2, -2.4, 0], [EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.push, EZ.settle]);
  const rxX = keyed(f, [A1, A3, FC, A4, A5, END], [2, 0, -1.4, -3, 1, 2.2], EZ.soft);
  // el ENCUADRE se cierra sobre el argumento y ABRE en la resolución (plano final abierto)
  const view = keyed(f, [A1, A2, A3, A4, B_COLL, A5, END],
    [0.9, 0.88, 0.86, 0.84, 0.82, 0.78, 0.74],
    [EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.settle]);
  const camStr =
    `${G.transform} translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, ${mz.toFixed(2)}px) ` +
    `rotateY(${ryX.toFixed(3)}deg) rotateX(${rxX.toFixed(3)}deg) scale(${view.toFixed(4)})`;

  /* ── LA LUZ ES EL ARGUMENTO: ámbar pleno → voltio gana el careo → papel → torch → EQUILIBRIO */
  const voltMix = keyed(f, [A1, A2, A2 + 70, FB, A3, FC, A4, A5, A5 + 90, END],
    [0, 0.02, 0.58, 0.5, 0.1, 0.1, 0.3, 0.36, 0.5, 0.5],
    [EZ.soft, EZ.push, EZ.soft, EZ.push, EZ.lin, EZ.glide, EZ.soft, EZ.glide, EZ.settle]);
  // la noche del apagón: entra y sale ENTERA debajo de las costuras C y D
  const nightP = keyed(f, [FC, FC + 6, FD + 2, FD + 34], [0, 1, 1, 0], [EZ.snap, EZ.lin, EZ.glide]);
  const tint = mixc(light(voltMix, "amber", "volt"), V.torch, nightP);
  const tint2 = mixc(V.amber, V.sky, nightP * 0.62);
  const keyPos = keyed(f, [A1, A2, A2 + 60, A3, FC, A4, A5, END],
    [0.7, 0.62, 0.3, 0.55, 0.5, 0.46, 0.5, 0.52],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.glide, EZ.soft, EZ.settle]);
  const intensity = keyed(f, [A1, A2, B_EIGHT, A3, FC, FC + 8, B_COLL, FD + 20, A5 + 70, END],
    [1, 1.08, 1.18, 0.92, 0.9, 0.5, 0.56, 0.78, 1, 1],
    [EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.snap, EZ.glide, EZ.push, EZ.glide, EZ.lin]);
  // LOS DOS RIMS: en el último acto los dos están al 100 % en el MISMO cuadro (el equilibrio se VE)
  const rimV = keyed(f, [A1, A2, A2 + 60, A3, FC, FD, A5 + 90, END],
    [0.06, 0.1, 0.9, 0.16, 0.1, 0.2, 1, 1],
    [EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.glide, EZ.settle, EZ.lin]);
  const rimA = keyed(f, [A1, A2 + 60, A3, FC, FD, A5 + 90, END],
    [1, 0.24, 0.86, 0.2, 0.3, 1, 1],
    [EZ.push, EZ.glide, EZ.lin, EZ.glide, EZ.settle, EZ.lin]);

  /* ── EL VIENTO cuenta la excepción (literal: el espectador tiene que VERLO) ─────────────── */
  const wind = keyed(f, [A1, A3, B_BORING, FC, FC + 10, B_COLL, FD, FD + 42, END],
    [0.1, 0.1, 0.08, 0.1, 0.85, 0.9, 0.85, 0.35, 0.35],
    [EZ.lin, EZ.soft, EZ.lin, EZ.snap, EZ.glide, EZ.soft, EZ.push, EZ.lin]);
  const windTint = mixc(V.white, V.torch, nightP);
  const dim = keyed(f, [A1, A3, FC, FC + 8, FD, FD + 42, END],
    [0.52, 0.6, 0.6, 0.88, 0.86, 0.56, 0.54],
    [EZ.soft, EZ.lin, EZ.snap, EZ.lin, EZ.glide, EZ.lin]);

  /* ── ACTO 1 · MATCH-SHAPE de entrada: la columna se vuelve tarjeta y su piel se drena ───── */
  const morph = EZ.snap(clamp01((f - 4) / 62));
  const drainV = EZ.push(clamp01((f - 18) / 52));
  const drainA = EZ.push(clamp01((f - 30) / 52));
  const radMorph = lerp(4, 14, morph);

  /* la tarjeta del PANEL: UNA rampa continua columna → careo → adelantada (no se reinicia) */
  const pW = keyed(f, [A1, 66, A2, A2 + 96], [COL_V.w, 640, 640, 760], [EZ.snap, EZ.lin, EZ.push]);
  const pH = keyed(f, [A1, 66, A2, A2 + 96], [COL_V.h, 360, 360, 428], [EZ.snap, EZ.lin, EZ.push]);
  const pX = keyed(f, [A1, 66, A2, A2 + 96], [pctX(COL_V.cx), 31.5, 31.5, 47], [EZ.snap, EZ.lin, EZ.push]);
  const pY = keyed(f, [A1, 66, A2, A2 + 96], [colCenterY(COL_V), 47, 47, 53], [EZ.snap, EZ.lin, EZ.push]);
  const pZ = keyed(f, [A1, 66, A2, A2 + 96], [0, 0, 0, 150], [EZ.snap, EZ.lin, EZ.push]);
  const pRy = keyed(f, [A1, 66, A2, A2 + 96], [0, 9, 9, 2], [EZ.snap, EZ.lin, EZ.push]);
  const pLit = keyed(f, [A1, A2, A2 + 60], [0.5, 0.8, 1], EZ.glide);
  const pLitCol = mixc(V.amber, V.volt, keyed(f, [A1, A2, A2 + 70], [0, 0, 1], EZ.push));

  /* la tarjeta de la TURBINA en el duelo: se forma y en la paliza retrocede y se apaga */
  const tW = keyed(f, [A1, 66, A2, A2 + 96], [COL_A.w, 560, 560, 340], [EZ.snap, EZ.lin, EZ.push]);
  const tH = keyed(f, [A1, 66, A2, A2 + 96], [COL_A.h, 315, 315, 191], [EZ.snap, EZ.lin, EZ.push]);
  const tX = keyed(f, [A1, 66, A2, A2 + 96], [pctX(COL_A.cx), 69.5, 69.5, 78], [EZ.snap, EZ.lin, EZ.push]);
  const tY = keyed(f, [A1, 66, A2, A2 + 96], [colCenterY(COL_A), 52, 52, 34], [EZ.snap, EZ.lin, EZ.push]);
  const tZ = keyed(f, [A1, 66, A2, A2 + 96], [0, 0, 0, -180], [EZ.snap, EZ.lin, EZ.push]);
  const tLit = keyed(f, [A1, A2, A2 + 80], [0.5, 0.8, 0.24], EZ.glide);
  const tOp = keyed(f, [A1, A2, A2 + 80], [1, 1, 0.46], EZ.glide);

  /* ── FRONTERA B · ZOOM-THROUGH: entramos EN la tarjeta del panel, en su centro exacto ───── */
  const ZT = zoomThrough(f, FB, 40, 47, 53);

  /* ── ACTO 4 y 5 · LA TURBINA: nace del rotor que ocluyó y NO se desmonta más ───────────── */
  const nW = keyed(f, [FC, FC + 26, B_CARO, B_COLL, B_COLL + 60, FD, A5 + 80],
    [300, 470, 430, 470, 900, 860, 440], [EZ.snap, EZ.glide, EZ.soft, EZ.push, EZ.brake, EZ.glide]);
  const nH = keyed(f, [FC, FC + 26, B_CARO, B_COLL, B_COLL + 60, FD, A5 + 80],
    [169, 264, 242, 264, 506, 484, 248], [EZ.snap, EZ.glide, EZ.soft, EZ.push, EZ.brake, EZ.glide]);
  const nX = keyed(f, [FC, B_CARO, B_COLL, FD, FD + 44, A5 + 90],
    [50, 50, 50, 50, 66, 79], [EZ.glide, EZ.lin, EZ.soft, EZ.push, EZ.settle]);
  const nY = keyed(f, [FC, B_CARO, B_COLL, FD, FD + 44, A5 + 90],
    [48, 46, 46, 48, 44, 46], [EZ.glide, EZ.lin, EZ.soft, EZ.push, EZ.settle]);
  const nZ = keyed(f, [FC, B_CARO, B_COLL, B_COLL + 60, A5 + 90],
    [-120, -220, -180, 150, 30], [EZ.glide, EZ.soft, EZ.push, EZ.settle]);
  const nRy = keyed(f, [FC, B_COLL, FD, A5 + 90], [0, 0, -4, -11], EZ.glide);
  const nLit = keyed(f, [FC, FC + 30, FD, A5 + 80], [0.4, 0.95, 0.95, 1], EZ.glide);
  const nLitCol = mixc(V.torch, V.amber, keyed(f, [FD, FD + 44], [0, 1], EZ.glide));

  /* el carrusel de condiciones ORBITA la turbina y después COLAPSA hacia ella (se meten adentro) */
  const caroOn = f > B_CARO - 26 && f < B_COLL + 38;
  const spin = keyed(f, [B_CARO - 26, B_CARO + 34, B_CARO + 96, B_CARO + 158, B_COLL + 38],
    [0.12, 0, -0.25, -0.5, -0.78], [EZ.push, EZ.snap, EZ.snap, EZ.glide]) + Math.sin(f / 101) * 0.005;
  const caroFocus = f < B_CARO + 62 ? 0 : f < B_CARO + 124 ? 1 : f < B_COLL ? 2 : 3;
  const caroR = keyed(f, [B_CARO - 26, B_CARO, B_COLL, B_COLL + 34], [820, 560, 560, 130], [EZ.brake, EZ.lin, EZ.push]);
  const caroW = keyed(f, [B_CARO, B_COLL, B_COLL + 34], [470, 470, 24], [EZ.lin, EZ.push]);

  /* ── ACTO 5 · el panel vuelve por la izquierda DEBAJO de la lluvia y los cables convergen ── */
  const rW = keyed(f, [FD, FD + 44, A5 + 90], [470, 500, 440], [EZ.brake, EZ.glide]);
  const rX = keyed(f, [FD, FD + 46, A5 + 90], [-16, 26, 21], [EZ.brake, EZ.settle]);
  const rY = keyed(f, [FD, FD + 46, A5 + 90], [44, 44, 46], [EZ.brake, EZ.settle]);
  const stY = keyed(f, [A5 + 6, A5 + 70], [106, 79], EZ.brake);
  const cableV = clamp01((f - (A5 + 62)) / 64);
  const cableA = clamp01((f - (A5 + 74)) / 64);

  /* la boca de la estación: el MISMO punto de llegada para los dos cables */
  const stTop = 1080 * (stY / 100) - 169;
  const JY = stTop + 10;
  const JX = 960;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los 42 s. NUNCA se remonta entre actos. */}
      <VoltAtmos tint={tint} tint2={tint2} keyFrom={keyPos} intensity={intensity} floor={0.58} />

      {/* EL MUNDO, bajo UNA sola cámara, en planos con parallax propio */}
      <Layers cam={camStr}>
        {/* z −620 · EL PATIO: una sola foto de fondo para el movimiento entero */}
        <Plane z={-620}>
          <PhotoPlane src={M.patio} z={0} scale={1.22} dim={dim} tint={tint} />
        </Plane>

        {/* z −300 · LAS DOS LUCES. En el acto 5 las dos están al 100 % a la vez: el equilibrio. */}
        <Plane z={-300}>
          <AbsoluteFill style={{
            background: `linear-gradient(96deg, ${rgba(V.volt, 0.17 * rimV)} 0%, rgba(0,0,0,0) 44%)`,
            mixBlendMode: "screen",
          }} />
          <AbsoluteFill style={{
            background: `linear-gradient(276deg, ${rgba(V.amber, 0.17 * rimA)} 0%, rgba(0,0,0,0) 44%)`,
            mixBlendMode: "screen",
          }} />
          {/* el haz de la linterna: en la noche del apagón es la ÚNICA fuente */}
          {nightP > 0.02 && (
            <div style={{
              position: "absolute", left: "-8%", top: "-46%", width: 720, height: "180%",
              transform: `rotate(${(17 + Math.sin(f / 71) * 1.7).toFixed(2)}deg)`,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.torch, 0.15 * nightP)} 46%, rgba(0,0,0,0) 100%)`,
              mixBlendMode: "screen",
            }} />
          )}
        </Plane>

        {/* z −180 · el viento LEJOS (parallax de la atmósfera) */}
        <Plane z={-180}>
          <WindField speed={wind * 0.7} tint={windTint} count={16} opacity={0.5} />
        </Plane>

        {/* z 0 · EL GRÁFICO: la losa donde estaban las columnas es ahora el riel del marcador */}
        <Plane z={0}>
          {f > B_RAIL - 6 && f < FB + 26 && <ScoreRail f={f} at={B_RAIL} />}
        </Plane>

        {/* z +60 · LAS TARJETAS DEL CAREO — ACTOS 1 y 2. Siempre con material real adentro.
            Todo el plano se lo come el ZOOM-THROUGH en la frontera B. */}
        {f < FB + 42 && (
          <Plane z={60} style={{
            transform: `translateZ(60px)${ZT.out === "none" ? "" : ` ${ZT.out}`}`,
            opacity: ZT.opacity,
          }}>
            {/* LA TURBINA en el duelo: una FOTO QUIETA — todavía es un adorno */}
            {f < FB + 14 && (
              <MediaCard src={M.turbinaFoto} kind="photo"
                w={tW} h={tH} x={tX} y={tY} z={tZ} ry={-11} rx={1}
                radius={radMorph} lit={tLit} litColor={V.amber} opacity={tOp}
                sheenAt={74} label={f > 76 && f < A2 + 40 ? "LA TURBINA" : undefined} />
            )}
            {/* EL PANEL: un CLIP que corre — el que va a ganar la categoría */}
            <MediaCard src={M.panelClip} kind="video" startFrom={6}
              w={pW} h={pH} x={pX} y={pY} z={pZ} ry={pRy} rx={-1}
              radius={radMorph} lit={pLit} litColor={pLitCol}
              sheenAt={f < A2 ? 66 : A2 + 20} label={f > 68 && f < A2 + 40 ? "EL PANEL" : undefined} />
            {/* la PIEL de cada columna drenándose: el MATCH-SHAPE de entrada */}
            <ColumnSkin x={pX} y={pY} w={pW} h={pH} drain={drainV} color={V.volt} radius={radMorph} />
            <ColumnSkin x={tX} y={tY} w={tW} h={tH} drain={drainA} color={V.amber} radius={radMorph} />
          </Plane>
        )}

        {/* z +40 · ACTO 3 · LA CUENTA DEL MES — la escena casi blanca (salimos del zoom-through) */}
        {f > FB + 18 && f < FC + 5 && (
          <Plane z={40}>
            <WhiteRoom at={FB + 20} dur={5} tint={V.amber}>
              {/* protagonista: el dinero que se paga todos los meses */}
              <MediaCard src={M.paga} kind="photo"
                w={keyed(f, [FB + 20, FB + 70, B_BORING], [560, 700, 660], [EZ.brake, EZ.soft])}
                h={keyed(f, [FB + 20, FB + 70, B_BORING], [315, 394, 371], [EZ.brake, EZ.soft])}
                x={keyed(f, [FB + 20, FB + 74, B_BORING - 10, B_BORING + 40], [40, 34, 34, 30], [EZ.brake, EZ.lin, EZ.push])}
                y={keyed(f, [FB + 20, FB + 74, B_BORING + 40], [62, 58, 58], [EZ.brake, EZ.soft])}
                z={40} ry={7} rx={-2} radius={12} lit={0.5} litColor={V.amber} grade={false}
                sheenAt={FB + 30} label="LA CUENTA DEL MES" />
              {/* el MISMO panel del acto 2, ahora quieto sobre la hoja: "es aburrido, no gira" */}
              {f > B_BORING - 24 && (
                <MediaCard src={M.panelFoto} kind="photo"
                  w={keyed(f, [B_BORING - 24, B_BORING + 34], [380, 470], EZ.brake)}
                  h={keyed(f, [B_BORING - 24, B_BORING + 34], [214, 264], EZ.brake)}
                  x={keyed(f, [B_BORING - 24, B_BORING + 34], [84, 70], EZ.brake)}
                  y={keyed(f, [B_BORING - 24, B_BORING + 34], [66, 62], EZ.brake)}
                  z={90} ry={-9} rx={2} radius={12} lit={0.42} litColor={V.amber} grade={false}
                  sheenAt={B_BORING + 4} label="TODOS LOS DÍAS LO MISMO" />
              )}
              {/* EL SELLO — tipografía real del kit sobre papel (⛔ nunca se le pide al generador) */}
              {f > FB + 54 && (
                <div style={{
                  position: "absolute", left: "68%", top: "30%",
                  transform: `translate(-50%,-50%) rotate(-7deg) scale(${(0.86 + EZ.snap(clamp01((f - (FB + 56)) / 12)) * 0.14).toFixed(3)})`,
                  padding: "12px 40px", borderRadius: 8, background: V.volt,
                  boxShadow: `0 16px 40px ${rgba(V.ink0, 0.24)}`,
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 1,
                    letterSpacing: 8, color: V.ink0,
                  }}>PANEL</div>
                </div>
              )}
              {f > FB + 36 && f < FC && (
                <Readout value="$50" label="SI TENÉS" at={FB + 38} x={68} y={14} size={128} color={V.ink1} />
              )}
              {/* 1 idea de texto por acto, en tinta oscura sobre el papel */}
              {f > FB + 46 && (
                <div style={{ position: "absolute", left: 190, top: 118, width: 620 }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6,
                    textTransform: "uppercase", color: rgba(V.ink1, 0.62),
                  }}>UN NÚMERO MÁS CHICO</div>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 68, lineHeight: 1.02,
                    color: V.ink0, marginTop: 8,
                  }}>No lo dudes<br />ni un segundo.</div>
                  {f > B_BORING - 10 && (
                    <div style={{ marginTop: 22 }}>
                      <Body size={30} color={V.ink1}>No gira · no hace ruido · no falla</Body>
                    </div>
                  )}
                </div>
              )}
            </WhiteRoom>
          </Plane>
        )}

        {/* z +30 · LA TURBINA de la noche: cruza entera la frontera D y llega hasta el final */}
        {f > FC && (
          <Plane z={30}>
            <MediaCard src={M.turbinaNoche} kind="video" startFrom={10}
              w={nW} h={nH} x={nX} y={nY} z={nZ} ry={nRy} rx={1} radius={14}
              lit={nLit} litColor={nLitCol} sheenAt={B_COLL + 14}
              label={f > B_COLL + 20 && f < A5 + 30 ? "A LAS 3 DE LA MAÑANA" : undefined} />
          </Plane>
        )}

        {/* z +10 · EL CARRUSEL DE LA EXCEPCIÓN — 4 condiciones, TODAS con material real adentro.
            Orbita alrededor de la turbina y al final colapsa hacia ella. */}
        {caroOn && (
          <Plane z={10}>
            <Carousel3D
              items={[
                { src: M.anemo, kind: "video", label: "VIENTO DE VERDAD" },
                { src: M.tela, kind: "video", label: "SECA EN 20 MINUTOS" },
                { src: M.turbinaFoto, kind: "photo", label: "A SEIS METROS" },
                { src: M.apagon, kind: "photo", label: "LA CUADRA A OSCURAS" },
              ]}
              spin={spin} radius={caroR} cardW={caroW} cardH={caroW * 0.5625}
              y={46} focus={caroFocus} litColor={V.torch}
            />
          </Plane>
        )}

        {/* z +30 · ACTO 5 · EL PANEL VUELVE por la izquierda, debajo de la lluvia de la costura D */}
        {f > FD - 4 && (
          <Plane z={30}>
            <MediaCard src={M.panelClip} kind="video" startFrom={40}
              w={rW} h={rW * 0.5625} x={rX} y={rY} z={40} ry={10} rx={1} radius={14}
              lit={1} litColor={V.volt} sheenAt={FD + 30}
              label={f > FD + 40 && f < A5 + 30 ? "DE DÍA, CON SOL" : undefined} />
          </Plane>
        )}

        {/* z +20 · LOS DOS CABLES Y LA ESTACIÓN — el último plano del video */}
        {f > A5 && (
          <Plane z={20}>
            <Cable f={f}
              from={[1920 * (rX / 100), 1080 * (rY / 100) + rW * 0.5625 * 0.46]}
              ctrl={[1920 * (rX / 100) + 120, JY - 34]}
              to={[JX - 58, JY]}
              color={V.volt} grow={cableV} seed={0.13} />
            <Cable f={f}
              from={[1920 * (nX / 100), 1080 * (nY / 100) + nH * 0.46]}
              ctrl={[1920 * (nX / 100) - 120, JY - 34]}
              to={[JX + 58, JY]}
              color={V.amber} grow={cableA} seed={0.61} />
            <MediaCard src={M.estacion} kind="photo"
              w={600} h={338} x={50} y={stY} z={60} ry={0} rx={-3} radius={16}
              lit={1} litColor={mixc(V.volt, V.amber, 0.5)} sheenAt={A5 + 44}
              label="LA MISMA BATERÍA" />
          </Plane>
        )}

        {/* z +260 · LOS ÍCONOS como objetos de la escena (PNG sin fondo) */}
        <Plane z={260}>
          {f > 70 && f < A2 + 60 && <IconPng src={M.icSol} x={46} y={16} size={84} opacity={0.9} glow={V.amber} />}
          {f > 84 && f < A2 + 60 && <IconPng src={M.icViento} x={88} y={18} size={78} opacity={0.82} glow={V.amber} />}
          {f > B_RAIL + 6 && f < FB && <IconPng src={M.icPanel} x={15} y={73} size={66} opacity={0.9} glow={V.volt} />}
          {f > B_RAIL + 6 && f < FB && <IconPng src={M.icTurbina} x={64} y={73} size={66} opacity={0.62} glow={V.amber} />}
          {f > FC + 18 && f < FD + 30 && <IconPng src={M.icNoche} x={90} y={14} size={80} opacity={0.82 * nightP} glow={V.torch} />}
          {f > B_CARO && f < FD + 24 && <IconPng src={M.icTormenta} x={90} y={62} size={82} opacity={0.7} glow={V.sky} />}
          {f > A5 + 40 && <IconPng src={M.icSol} x={12} y={16} size={86} opacity={0.92} glow={V.amber} />}
          {f > A5 + 40 && <IconPng src={M.icTormenta} x={88} y={16} size={86} opacity={0.88} glow={V.sky} />}
          {f > A5 + 70 && <IconPng src={M.icBateria} x={50} y={pctY(JY - 74)} size={58} opacity={0.94} glow={V.volt} />}
        </Plane>

        {/* z +320 · el viento CERCA y la lluvia de la noche: el aire delante de la cámara */}
        <Plane z={320}>
          <WindField speed={wind} tint={windTint} count={20} opacity={0.85} />
          <NightRain f={f} on={nightP} tint={V.torch} />
        </Plane>

        {/* z 0 · TIPOGRAFÍA — 1 idea por acto, titular ≤7 palabras, siempre con cama oscura */}
        <Plane z={0}>
          {/* ACTO 1 · el careo */}
          <CueBed f={f} from={12} to={A2 + 22} box={{ left: 190, top: 128 }}>
            <Bed pad={28}>
              <Kick color={V.amber}>EL VEREDICTO</Kick>
              <div style={{ marginTop: 10 }}><Head size={92}>¿Quién ganó?</Head></div>
            </Bed>
          </CueBed>
          {/* ACTO 2 · la paliza */}
          <CueBed f={f} from={A2 + 24} to={FB + 16} box={{ left: 190, top: 128 }}>
            <Bed pad={28}>
              <Kick color={V.volt}>PARA BAJAR LA FACTURA</Kick>
              <div style={{ marginTop: 10 }}><Head size={84}>Ganó el <Em>panel</Em>.</Head></div>
            </Bed>
          </CueBed>
          {/* ACTO 2 · el remate: la cifra la escribe el kit, jamás el generador de imagen */}
          <CueBed f={f} from={B_EIGHT - 4} to={FB + 14} box={{ right: 150, bottom: 96 }}>
            <Bed pad={26}>
              <Kick color={rgba(V.white, 0.7)}>NO FUE PAREJA</Kick>
              <div style={{ marginTop: 6 }}><Num size={158}>8 A 1</Num></div>
            </Bed>
          </CueBed>
          {/* ACTO 4 · la excepción — el corazón dramático */}
          <CueBed f={f} from={FC + 12} to={B_COLL + 8} box={{ left: 190, top: 124 }}>
            <Bed pad={28}>
              <Kick color={V.torch}>PERO SI TE PREOCUPA</Kick>
              <div style={{ marginTop: 10 }}><Head size={84}>La noche del <Em color={V.torch}>apagón</Em>.</Head></div>
              <div style={{ marginTop: 12 }}>
                <Body size={30} color={rgba(V.bone, 0.86)}>Costa · campo abierto · viento de verdad</Body>
              </div>
            </Bed>
          </CueBed>
          {f > B_CARO + 8 && f < B_COLL - 6 && (
            <Readout value="3:00" label="LA CUADRA A OSCURAS" at={B_CARO + 10} x={80} y={72} size={104} color={V.torch} />
          )}
          {f > B_COLL + 30 && f < FD + 12 && (
            <Readout value="6" unit="m" label="LEJOS DE LA CASA" at={B_COLL + 32} x={20} y={70} size={120} color={V.volt} />
          )}
          {/* ACTO 5 · la alianza — el último titular del tramo */}
          <CueBed f={f} from={A5 + 14} to={END + 60} box={{ left: 0, right: 0, top: 68, display: "flex", justifyContent: "center" }}>
            <Bed pad={28}>
              <div style={{ textAlign: "center" }}>
                <Kick color={V.volt}>LO MEJOR NO ES ELEGIR UNO</Kick>
                <div style={{ marginTop: 10 }}><Head size={76}>Que entren <Em color={V.amber}>los dos</Em>.</Head></div>
                {f > B_LAND - 44 && (
                  <div style={{ marginTop: 14 }}>
                    <Body size={29} color={rgba(V.bone, 0.9)}>Casi nunca fallan los dos juntos</Body>
                  </div>
                )}
              </div>
            </Bed>
          </CueBed>
        </Plane>
      </Layers>

      {/* ══ LAS COSTURAS ══ (⛔ nunca un fade; una distinta por frontera) ══════════════════ */}
      {/* CORTE EN EL BEAT (interno al acto 2): el flash sobre la palabra "ocho" */}
      <SeamFlash at={B_EIGHT} color={V.volt} dur={5} />
      {/* FRONTERA C · OCLUSIÓN: dos palas del rotor cruzan el lente. El color es el de LA MATERIA
          (`V.blade`, el plástico blanco de las palas) — ⛔ JAMÁS el color del fondo. */}
      <SeamOcclude at={FC} dur={22} color={V.blade} angle={8} />
      <SeamOcclude at={FC + 7} dur={20} color={V.blade} angle={-14} />
      {/* FRONTERA D · WIPE POR MATERIA: la lluvia del temporal. La turbina cruza entera debajo. */}
      <SeamWipeMatter at={FD} dur={28} tint={V.sky} />
      {/* el beat en que los dos cables aterrizan en la batería */}
      <SeamFlash at={B_LAND} color={V.volt} dur={6} />

      {/* viñeta del canal, constante: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill style={{
        background: "radial-gradient(128% 100% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 64, bottom: 44, opacity: 0.3,
        fontFamily: F_BODY, fontWeight: 600, fontSize: 20, letterSpacing: 4,
        color: rgba(V.white, 0.7), textTransform: "uppercase",
      }}>EL VEREDICTO</div>
    </AbsoluteFill>
  );
};

export default MovVeredicto;
