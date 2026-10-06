// MovTabla.tsx — MOVIMIENTO 3 de `cmebateria` (canal Claudio Mendoza Constructor).
// "¿Esta Batería de Auto Puede Reemplazar al Generador a Nafta en un Apagón?" · S07 / P41–P47 (~55 s).
//
// ES **EL PICO DEL VIDEO**: la página que borra todas las cuentas. Arriba, las baterías por tamaño.
// A la izquierda, las cosas que uno quiere tener prendidas cuando se corta la luz. Donde se cruzan,
// las horas. No hay nada que calcular. Es el momento en que el espectador pausa y saca la foto.
//
// Los números NO se inventan: salen de `guias-claudio-energia/anexo-durar.mjs` (Anexo 4 del producto
// real del creador), con la reserva de descarga y el 12% del inversor YA descontados.
//
// ⛔ LO QUE NO ES: una planilla animada. Tres decisiones lo evitan, y son la columna vertebral:
//   1. **LA HOJA ES MÁS GRANDE QUE EL CUADRO.** Nunca se ve la tabla entera. La cámara viaja por el
//      papel como una mano que busca: baja, se pasa, vuelve. Seis baterías arriba se leen TRUCKEANDO
//      de una a la otra a tamaño real, no apretando seis columnas en 1920 px.
//   2. **CADA CARGA LLEVA SU MATERIAL REAL AL LADO.** Siete `MediaCard` con el clip del router, del
//      foco, del celular, de la heladera de noche, de la bomba, del microondas. Ver el aparato
//      mientras se lee su número es la diferencia entre una tabla y una escena.
//   3. **LA CIFRA QUE SE DICE SE VA DEL PAPEL.** En la heladera la cámara ENTRA en el casillero de
//      5 h 45 y sale adentro de la heladera de noche, con el número escrito sobre el material real;
//      después el mismo empuje la devuelve al casillero. El número es un objeto, no una celda.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — acto por acto (cámara · luz · partículas · materia)                        ║
// ╠══╤═══════════════════════╤══════════════════════════════════╤═══════════════════════════════╣
// ║ 1│ LA HOJA ATERRIZA      │ enterFrom: z0 20, panY -90 · volt│ exitTo: la hoja cubre el 100% ║
// ║  │ Y SE LEE EL TÍTULO    │ sobre PAPEL · .05 · materia: el  │ y ES la página · materia: la  ║
// ║  │ (0 → .072 D)          │ 440 aplanado, hoja en el aire    │ HOJA impresa                  ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │ F1 = MATCH-SHAPE: el rectángulo de la hoja que cae CALZA exacto con el rectángulo de la    ║
// ║  │ página (mismo tamaño, misma inclinación 0°); en el golpe salta polvo de papel que tapa el  ║
// ║  │ reemplazo. ⛔ el polvo y la banda son color PAPEL, jamás el fondo.                          ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 2│ LA FILA DE ARRIBA:    │ enterFrom: página en blanco, la  │ exitTo: las seis en la hoja   ║
// ║  │ LAS SEIS BATERÍAS     │ cámara arriba · .05              │ vistas de lejos, la hoja se   ║
// ║  │ (.072 → .262 D)       │ materia: la hoja impresa         │ ve entera y no entra          ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │ F2 = CORTE EN EL BEAT (+ `SeamFlash` voltio de 5 frames): en el golpe cambia el encuadre   ║
// ║  │ del plano general de la hoja al plano de lectura. Misma hoja, misma luz, otro encuadre.    ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 3│ LA COLUMNA IZQUIERDA: │ enterFrom: plano de lectura,     │ exitTo: siete cargas escritas ║
// ║  │ LAS CARGAS Y SUS W    │ header pegado · .05              │ con su clip real, la cámara   ║
// ║  │ (.262 → .436 D)       │ materia: la página               │ abajo del todo                ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │ F3 = OCLUSIÓN: LA MANO cruza el cuadro entera (clip real `dedoFila` escalado + `SeamOcclude`║
// ║  │ color PIEL). Debajo de la mano la hoja ya volvió arriba, a la primera fila.                ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 4│ EL DEDO BAJA:         │ enterFrom: mano en cuadro, fila 1│ exitTo: dedo sobre la heladera║
// ║  │ 33 h · 29 h 20 · 22 h │ luz voltio sobre papel · .05     │ el casillero de 5 h 45 servido║
// ║  │ (.436 → .620 D)       │ materia: la mano sobre el papel  │ materia: el casillero         ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │ F4 = ZOOM-THROUGH: la cámara ENTRA en el casillero de 5 h 45 y SALE dentro de la heladera  ║
// ║  │ de noche (clip a sangre). El número se escribe sobre el material real.                     ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 5│ LA HELADERA:          │ enterFrom: heladera a sangre,    │ exitTo: el mismo empuje       ║
// ║  │ 5 h 45 y 11 h 30      │ Readout sobre material real      │ devuelve la cifra al papel;   ║
// ║  │ (.620 → .810 D)       │ materia: la heladera de noche    │ fila 127 W encendida          ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │ F5 = MATCH-MOVE: el dedo NO corta: sigue bajando y la hoja sube con él. Las dos últimas    ║
// ║  │ filas llegan montadas en ese mismo vector. No hay costura visible, hay continuidad.        ║
// ║──┴───────────────────────┴──────────────────────────────────┴───────────────────────────────╢
// ║ 6│ EL LÍMITE: BOMBA 0 h 42 · MICROONDAS RAYA  (.810 → 1.0 D)                                  ║
// ║  │ exitTo (contrato con MovGuia): z1 60, panX +40 · papel virando a CÁLIDO · .05              ║
// ║  │ materia: LA ESQUINA DE LA HOJA YA DESPEGADA, y debajo asoma otra hoja.                     ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
//
// MATERIAL REAL POR FILA (⛔ toda tarjeta flotante lleva clip o foto adentro):
//   Router 8 W       → CLIP  cmeb_mv_tabla_router          · ícono cmeb_ic_router
//   Lámpara LED 9 W  → CLIP  cmeb_mv_tabla_focoLed         · ícono cmeb_ic_foco
//   Celular 12 W     → CLIP  cmeb_mv_tabla_celularCarga    · ícono cmeb_ic_celular
//   Heladera 46 W    → CLIP  cmeb_mv_tabla_heladeraNoche   · ícono cmeb_ic_heladera   (+ a sangre)
//   Todo junto 127 W → FOTO  cmeb_mv_tabla_heladeraNoche   · ícono cmeb_ic_heladera
//   Bomba 375 W      → CLIP  cmeb_mv_tabla_bombaAgua       · ícono cmeb_ic_bomba
//   Microondas 1200W → CLIP  cmeb_mv_tabla_microondas      · ícono cmeb_ic_microondas
//   la mano → CLIP cmeb_mv_tabla_dedoFila · la mesa/2ª hoja → FOTO cmeb_mv_tabla_hojaMesa
//   cama de papel impresa debajo de toda la tipografía → FOTO cmeb_lam_durar
//
// CONTRATO TÉCNICO: sin Math.random/Date.now (todo `rnd(k)`), sin backdrop-filter, sin blur grande a
// pantalla completa, Easing.poly(5) en vez del inexistente Easing.quint, safe area 60 px, imports
// sólo de `remotion`, `react` y `./VoltStage`.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, WindField, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout, WhiteRoom,
  SeamOcclude, SeamWipeMatter, SeamFlash,
} from "./VoltStage";

// ── TINTA SOBRE PAPEL ───────────────────────────────────────────────────────────────────────
// La página es clara: la tipografía del Stage trae sombra pensada para el negro, así que acá la
// tinta usa las MISMAS familias (F_DISPLAY / F_BODY) con contraste de papel.
const INK = "#171A0F";        // tinta principal
const INK2 = "#5C6149";       // tinta secundaria
const VOLT_INK = "#5E7A00";   // el voltio, legible sobre papel
const AMB_INK = "#8A5B00";    // el ámbar, legible sobre papel
const DANGER_INK = "#A3321A"; // la raya del microondas
const PAPER = "#EDE8DA";      // LA MATERIA de la costura F1
const PAPER_BACK = "#D9D2BE"; // el dorso de la hoja (la esquina que se levanta)
const SKIN = "#C9A184";       // LA MATERIA de la costura F3 (la mano que cruza)

// ── GEOMETRÍA DE LA PÁGINA (px sobre 1920×1080 · safe area 60) ──────────────────────────────
const PX = (px: number) => (px / 1920) * 100;
const PY = (py: number) => (py / 1080) * 100;

// plano de LECTURA (actos 3–6): pasillo del dedo · clip real · nombre+vatios · 3 columnas grandes
const PTR_X = 175;            // centro del pasillo de la mano
const CARD_X = 430;           // centro del clip real de la carga
const NAME_X = 560;           // nombre + vatios
const NAME_W = 360;
const COL_B = [1080, 1370, 1660];   // 50 Ah · 100 Ah · 200 Ah  (borde derecho 1800 → safe 60 ✓)
const COL_HW = 140;
// plano GENERAL de la fila de arriba (acto 2): la hoja es MÁS ANCHA que el cuadro
const COL_WIDE = [300, 730, 1160, 1590, 2020, 2450];
const CHIP_W = 380;
const WIDE_MID = 1375;

const Y_KICK = 96;
const Y_TITLE = 138;
const Y_HEAD_TOP = 216;
const HEAD_H = 196;
const Y_RULE = 436;
const ROW_Y = [530, 690, 850, 1010, 1170, 1330, 1490];
const ROW_H = 152;
const SHEET_BOT = 1640;       // el borde de abajo de la hoja (ahí vive la esquina que se despega)

// ── LOS DATOS REALES (anexo-durar.mjs · Anexo 4 "¿Cuánto me va a durar?") ───────────────────
// cells = [18 Ah plomo, 50 Ah plomo, 100 Ah plomo, 200 Ah plomo, 100 Ah litio, 200 Ah litio]
// En el plano de lectura se muestran los índices 1, 2 y 3 — los tres que el guion lee en voz alta.
type Row = {
  name: string; sub?: string; w: string;
  cells: string[]; src: string; kind: "video" | "photo"; from: number; ic: string;
};
const ROWS: Row[] = [
  { name: "Router de internet", w: "8", cells: ["11 h 50", "33 h", "66 h", "132 h", "118 h", "237 h"],
    src: "broll/cmebateria/cmeb_mv_tabla_router.mp4", kind: "video", from: 10, ic: "router" },
  { name: "Una lámpara LED", w: "9", cells: ["10 h 30", "29 h 20", "58 h 40", "117 h", "105 h", "211 h"],
    src: "broll/cmebateria/cmeb_mv_tabla_focoLed.mp4", kind: "video", from: 18, ic: "foco" },
  { name: "Un celular cargando", w: "12", cells: ["7 h 55", "22 h", "44 h", "88 h", "79 h", "158 h"],
    src: "broll/cmebateria/cmeb_mv_tabla_celularCarga.mp4", kind: "video", from: 14, ic: "celular" },
  { name: "Heladera", sub: "promedio real de las 24 h", w: "46", cells: ["2 h 05", "5 h 45", "11 h 30", "23 h", "20 h 40", "41 h 20"],
    src: "broll/cmebateria/cmeb_mv_tabla_heladeraNoche.mp4", kind: "video", from: 22, ic: "heladera" },
  { name: "Heladera + freezer", sub: "+ router + 4 luces", w: "127", cells: ["0 h 45", "2 h 05", "4 h 10", "8 h 20", "7 h 30", "15 h"],
    src: "img/cmebateria/cmeb_mv_tabla_heladeraNoche.jpg", kind: "photo", from: 0, ic: "heladera" },
  { name: "Bomba de agua", sub: "andando", w: "375", cells: ["0 h 15", "0 h 42", "1 h 25", "2 h 50", "2 h 30", "5 h 05"],
    src: "broll/cmebateria/cmeb_mv_tabla_bombaAgua.mp4", kind: "video", from: 12, ic: "bomba" },
  { name: "Microondas", w: "1.200", cells: ["—", "—", "0 h 26", "0 h 53", "0 h 47", "1 h 35"],
    src: "broll/cmebateria/cmeb_mv_tabla_microondas.mp4", kind: "video", from: 8, ic: "microondas" },
];
const COLS = [
  { ah: "18 Ah", t: "PLOMO" }, { ah: "50 Ah", t: "PLOMO" }, { ah: "100 Ah", t: "PLOMO" },
  { ah: "200 Ah", t: "PLOMO" }, { ah: "100 Ah", t: "LITIO" }, { ah: "200 Ah", t: "LITIO" },
];
const SHOW = [1, 2, 3];       // los tres casilleros que el guion recorre en voz alta

// ── HELPERS PUROS ───────────────────────────────────────────────────────────────────────────
const EO = Easing.bezier(0.22, 0.61, 0.28, 1);
const SNAP = Easing.bezier(0.7, 0, 0.18, 1);
const IN_HARD = Easing.bezier(0.6, 0, 0.9, 0.4);
const ramp = (frame: number, at: number, dur: number, easing = EO) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const win = (f: number, a: number, b: number) => clamp01(Math.min((f - a) / 9, (b - f) / 13));

// grupo con transform propio que conserva las coordenadas de pantalla de los hijos
const G: React.FC<{ t?: string; o?: number; children: React.ReactNode }> = ({ t, o = 1, children }) => (
  <div style={{
    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
    transform: t, transformOrigin: "0% 0%", transformStyle: "preserve-3d", opacity: o,
  }}>{children}</div>
);
// la tipografía se ESCRIBE de izquierda a derecha (⛔ nunca un fade)
const ClipIn: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <div style={{ clipPath: `inset(0 ${((1 - clamp01(p)) * 100).toFixed(2)}% 0 0)`, ...style }}>{children}</div>
);
// el slot de TITULAR: una idea por acto, siempre en el mismo lugar, cambiando por rolado mecánico
const TitleRoll: React.FC<{ frame: number; items: { at: number; text: string; color: string }[] }> = ({ frame, items }) => {
  const H = 74;
  let ty = 0;
  for (let i = 1; i < items.length; i++) ty += ramp(frame, items[i].at, 11, SNAP) * H;
  return (
    <div style={{ position: "absolute", left: 60, top: Y_TITLE, width: 900, height: H, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-ty.toFixed(2)}px)` }}>
        {items.map((it, i) => (
          <div key={i} style={{
            height: H, display: "flex", alignItems: "center",
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 1, letterSpacing: 0.4,
            color: it.color, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{it.text}</div>
        ))}
      </div>
    </div>
  );
};

export const MovTabla: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const frame = useCurrentFrame();
  const A = (f: number) => Math.round(D * f);

  // ── LOS TIEMPOS (fracciones de D, para sobrevivir al re-anclaje al Whisper) ────────────────
  const T = {
    land: A(0.010),
    f1: A(0.072),                                                              // F1 · MATCH-SHAPE
    chips: [A(0.096), A(0.120), A(0.144), A(0.168), A(0.192), A(0.214)],
    wide: A(0.234),
    f2: A(0.262),                                                              // F2 · CORTE EN EL BEAT
    rowsIn: [A(0.272), A(0.292), A(0.312), A(0.334), A(0.356), A(0.378), A(0.400)],
    f3: A(0.436),                                                              // F3 · OCLUSIÓN (la mano)
    read: [A(0.472), A(0.520), A(0.566)],                                      // 33 h · 29 h 20 · 22 h
    f4: A(0.620),                                                              // F4 · ZOOM-THROUGH
    fr50: A(0.660), fr100: A(0.702),
    back: A(0.742),
    combo: A(0.782),
    f5: A(0.810),                                                              // F5 · MATCH-MOVE
    bomba: A(0.838),
    micro: A(0.886),
    corner: A(0.928),
  };

  // ── LA CÁMARA (una sola, frame GLOBAL, nunca vuelve a 0) ───────────────────────────────────
  // Contrato: entra en `z0:20, panY:-90` y sale en `z1:60, panX:+40`. El panY del enterFrom va como
  // offset CONSTANTE (-90) y lo cancela el viaje propio de gcam (panY +90). El panX viaja 0 → +40.
  const cam = gcam(frame, { z0: 20, z1: 60, panX: 40, panY: 90, dur: D });
  const camStr = cam.transform + ` translate3d(0px, -90px, 0)`;
  // la página es un objeto físico: compensa la magnificación del dolly y deja pasar ~3% de empuje
  const magz = 1500 / (1500 - cam.z);
  const pageFit = (1 / magz) * (0.972 + 0.03 * cam.e);

  // ── LA LUZ (evoluciona, no salta) ──────────────────────────────────────────────────────────
  const warm = ramp(frame, T.f5 - 40, Math.max(30, D - T.f5 + 40));   // el papel vira a CÁLIDO
  const roomTint = light(warm, "volt", "amber");
  const atmosTint = light(ramp(frame, T.f4, Math.max(30, D - T.f4)) * 0.75, "volt", "amber");
  const keyFrom = interpolate(frame, [0, D], [0.22, 0.55], { extrapolateRight: "clamp" });
  const atmosI = interpolate(frame, [0, T.f1, T.f4, D], [1.05, 0.85, 0.85, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── LAS PARTÍCULAS (contrato: .05 de punta a punta — la sala de papel está quieta) ─────────
  const wind = 0.05 + Math.sin(frame / 211) * 0.012;

  // ── ACTO 1 · la hoja que viene de MovCuenta (el 440 aplanado) aterriza ─────────────────────
  const landP = ramp(frame, T.land, T.f1 - T.land, Easing.bezier(0.30, 0.86, 0.28, 1));
  const act1Alive = frame < T.f1 + 12;
  const paperOn = frame >= T.f1;

  // ── EL RECORRIDO DE LECTURA (la hoja es más grande que el cuadro: la cámara la busca) ──────
  const scrollY = frame < T.f2
    ? -230
    : interpolate(
      frame,
      [T.f2, T.rowsIn[3], T.rowsIn[6], T.f3 + 2, T.f3 + 9, T.read[2], T.f4, T.back, T.combo, T.f5 + 18, T.bomba, T.micro, D],
      [0, 250, 560, 560, 40, 120, 330, 420, 520, 640, 700, 760, 800],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
    );
  // acto 2: la cámara TRUCKEA de una batería a la otra a tamaño real, y al final se va lejos
  const aim = interpolate(
    frame,
    [T.f1, T.chips[0], T.chips[1], T.chips[2], T.chips[3], T.chips[4], T.chips[5], T.wide],
    [COL_WIDE[0], COL_WIDE[0], COL_WIDE[1], COL_WIDE[2], COL_WIDE[3], COL_WIDE[4], COL_WIDE[5], WIDE_MID],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );
  const wideScale = interpolate(frame, [T.f1, T.chips[5] + 12, T.wide], [1, 1, 0.60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  const pageScale = frame < T.f2 ? wideScale : 1;
  const pageX = frame < T.f2 ? 960 - aim * wideScale : 0;

  // ── F4 · ZOOM-THROUGH por el casillero de 5 h 45 (y su regreso por el mismo punto) ─────────
  const FX = PX(COL_B[0]);                                    // 56.25 %
  const FY = PY(ROW_Y[3] - 330);                              // 62.96 %
  const zin = ramp(frame, T.f4, 24, IN_HARD);
  const zout = ramp(frame, T.back, 30, Easing.bezier(0.16, 0.7, 0.3, 1));
  const zk = zin * (1 - zout);
  const thru = (k: number) =>
    `translate(${((50 - FX) * (k - 1)).toFixed(2)}%, ${((50 - FY) * (k - 1)).toFixed(2)}%) scale(${k.toFixed(4)})`;
  const pageZoom = thru(lerp(1, 7.2, zk));
  const pageAlpha = clamp01(1 - (zk - 0.60) / 0.28);
  const fridgeK = lerp(0.13, 1.08, zk);
  const fridgeAlpha = clamp01((zk - 0.40) / 0.24);

  // ── QUÉ FILA SE ESTÁ LEYENDO (manda el dedo, el scroll y el brillo de los casilleros) ──────
  const readRow = interpolate(
    frame,
    [T.f3, T.read[0], T.read[1], T.read[2], T.f4, T.back, T.combo, T.f5, T.bomba, T.micro, D],
    [0, 0, 1, 2, 3, 3, 4, 4.6, 5, 6, 6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO },
  );
  const flat = 1 - ramp(frame, T.f3 - 12, 22);          // en el acto 3 la página se lee entera
  const emphOf = (i: number) => flat + (1 - flat) * lerp(0.26, 1, clamp01(1 - Math.abs(readRow - i) / 2.0));

  // ── LOS CASILLEROS QUE SE ENCIENDEN (fila, columna mostrada, ventana) ─────────────────────
  const FOCI: { r: number; c: number; a: number; b: number }[] = [
    { r: 0, c: 0, a: T.read[0], b: T.read[1] - 4 },
    { r: 1, c: 0, a: T.read[1], b: T.read[2] - 4 },
    { r: 2, c: 0, a: T.read[2], b: T.f4 - 14 },
    { r: 3, c: 0, a: T.back + 4, b: T.combo - 6 },
    { r: 3, c: 1, a: T.back + 28, b: T.f5 - 6 },
    { r: 4, c: 0, a: T.combo, b: T.f5 + 10 },
    { r: 4, c: 2, a: T.combo + 18, b: T.f5 + 10 },
    { r: 5, c: 0, a: T.bomba, b: T.micro - 8 },
    { r: 6, c: 0, a: T.micro, b: D },
    { r: 6, c: 1, a: T.micro + 34, b: D },
  ];
  const focusOf = (r: number, c: number) => {
    let m = 0;
    for (const f of FOCI) if (f.r === r && f.c === c) m = Math.max(m, win(frame, f.a, f.b));
    return m;
  };

  // ── LA MANO (material real): ocluye en F3, señala en 4-6, y en F5 arrastra la hoja ─────────
  const handDip = interpolate(frame, [T.f5 - 14, T.f5 + 16, T.f5 + 44], [0, 210, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  const handY = 530 + readRow * 160 - scrollY + handDip;
  const handOn = clamp01(Math.min(ramp(frame, T.f3 + 8, 14), 1 - ramp(frame, T.f4 - 16, 12)))
    + clamp01(Math.min(ramp(frame, T.back + 10, 14), 1 - ramp(frame, T.micro + 26, 20)));
  const coverK = win(frame, T.f3 - 2, T.f3 + 20);        // la mano tapando el 100 % del cuadro

  // ── LA ESQUINA QUE SE DESPEGA (la materia que se lleva MovGuia) ────────────────────────────
  const cornerP = ramp(frame, T.corner, Math.max(24, D - T.corner - 6), Easing.poly(3));

  const pageT = `translate(${pageX.toFixed(2)}px, ${(-scrollY).toFixed(2)}px) scale(${pageScale.toFixed(4)})`;
  const fitT = `translate(${(960 * (1 - pageFit)).toFixed(2)}px, ${(540 * (1 - pageFit)).toFixed(2)}px) scale(${pageFit.toFixed(4)})`;
  const stickyP = clamp01((scrollY - 40) / 120);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ───────────────────────────── */}
      <VoltAtmos tint={atmosTint} tint2={V.amber} keyFrom={keyFrom} intensity={atmosI} floor={0.42} />
      <WindField speed={wind} tint={V.white} count={18} opacity={0.8} />

      {/* ── LA SALA DE PAPEL. Antes del aterrizaje el mundo es LA MESA REAL; después, la HOJA. */}
      {act1Alive && (
        <PhotoPlane src="img/cmebateria/cmeb_mv_tabla_hojaMesa.jpg" kind="photo" z={-380}
          scale={1.24} dim={0.30} tint={V.volt} />
      )}
      <AbsoluteFill style={{
        transform: `translate3d(0px, ${(Math.sin(frame / 103) * 3).toFixed(2)}px, 0)`, overflow: "hidden",
      }}>
        <WhiteRoom at={T.f1} dur={7} tint={roomTint}>
          {/* la lámina impresa REAL como cama de papel bajo toda la tipografía */}
          <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: "multiply" }}>
            <Img src={staticFile("img/cmebateria/cmeb_lam_durar.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          {/* fibra del papel (determinista, sin Math.random) */}
          <AbsoluteFill style={{ opacity: 0.55 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 4.7) * 100).toFixed(2)}%`, top: `${(rnd(i * 8.3) * 100).toFixed(2)}%`,
                width: 1 + rnd(i * 2.1) * 2, height: 1 + rnd(i * 5.9) * 2, borderRadius: "50%",
                background: rgba(INK, 0.05 + rnd(i * 3.3) * 0.05),
              }} />
            ))}
          </AbsoluteFill>
        </WhiteRoom>
      </AbsoluteFill>

      {/* ── LA ESCENA (una sola cámara para todos los planos) ─────────────────────────────── */}
      <Layers cam={camStr}>

        {/* ═══ ACTO 1 · LA HOJA ATERRIZA ══════════════════════════════════════════════════ */}
        {act1Alive && (
          <Plane z={30}>
            {/* viene de MovCuenta: el 440 se aplanó y es esto. Cae, gira a 0° y CALZA con la página */}
            <MediaCard
              src="img/cmebateria/cmeb_lam_durar.jpg" kind="photo"
              w={Math.round(lerp(360, 2360, landP))} h={Math.round(lerp(240, 1420, landP))}
              x={lerp(58, 50, landP)} y={lerp(38, 50, landP)}
              z={lerp(180, 0, landP)}
              rot={lerp(-19, 0, landP)} ry={lerp(31, 0, landP)} rx={lerp(-22, 0, landP)}
              lit={0.95} litColor={V.volt} radius={lerp(12, 2, landP)}
              sheenAt={T.land + 10} grade opacity={1 - ramp(frame, T.f1 + 2, 8)}
            />
          </Plane>
        )}

        {/* ═══ LA PÁGINA (tinta) ═════════════════════════════════════════════════════════ */}
        {paperOn && (
          <Plane z={0}>
            <G t={fitT}>
              <G t={pageZoom} o={pageAlpha}>
                <G t={pageT}>

                  {/* ── el encabezado impreso de la hoja (se va con el scroll, como en el papel) */}
                  <ClipIn p={ramp(frame, T.f1 + 3, 14)} style={{ position: "absolute", left: 60, top: Y_KICK, width: 1100 }}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 4.4,
                      color: VOLT_INK, textTransform: "uppercase",
                    }}>ANEXO 4 · ¿CUÁNTO ME VA A DURAR? · SIN UNA SOLA CUENTA</div>
                  </ClipIn>

                  {/* ── LA FILA DE ARRIBA: las seis baterías (acto 2, plano general de la hoja) */}
                  {COLS.map((c, i) => {
                    const cp = ramp(frame, T.chips[i], 13, SNAP);
                    if (cp <= 0) return null;
                    const wideOn = 1 - ramp(frame, T.f2 - 1, 1);   // en el corte del beat cambia el encuadre
                    if (wideOn <= 0) return null;
                    const pop = 1 + (1 - cp) * 0.14;
                    const lit = i === 1 || i === 2 || i === 3;
                    return (
                      <div key={i} style={{
                        position: "absolute", left: COL_WIDE[i] - CHIP_W / 2, top: Y_HEAD_TOP,
                        width: CHIP_W, height: HEAD_H, opacity: cp,
                        transform: `translateY(${((1 - cp) * 26).toFixed(1)}px) scale(${pop.toFixed(3)})`,
                        transformOrigin: "50% 100%",
                        border: `2px solid ${rgba(lit ? VOLT_INK : INK, lit ? 0.55 : 0.24)}`,
                        borderRadius: 10,
                        background: lit
                          ? `linear-gradient(180deg, ${rgba(V.volt, 0.10)} 0%, ${rgba(V.volt, 0.03)} 100%)`
                          : "rgba(255,255,255,0.28)",
                      }}>
                        <div style={{
                          position: "absolute", left: 0, right: 0, top: 26, textAlign: "center",
                          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 1,
                          color: lit ? INK : INK2,
                        }}>{c.ah}</div>
                        <div style={{
                          position: "absolute", left: 0, right: 0, top: 140, textAlign: "center",
                          fontFamily: F_BODY, fontWeight: 800, fontSize: 27, letterSpacing: 6,
                          color: c.t === "LITIO" ? AMB_INK : INK2,
                        }}>{c.t}</div>
                      </div>
                    );
                  })}

                  {/* ── el plano de LECTURA (actos 3-6): encabezados, filete y las siete filas ── */}
                  {frame >= T.f2 && (
                    <>
                      <div style={{
                        position: "absolute", left: 60, top: Y_HEAD_TOP + 96, width: 860,
                        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.4,
                        color: INK2, textTransform: "uppercase",
                      }}>LO QUE TIENES PRENDIDO</div>
                      {SHOW.map((ci, k) => (
                        <div key={k} style={{
                          position: "absolute", left: COL_B[k] - COL_HW, top: Y_HEAD_TOP + 62,
                          width: COL_HW * 2, textAlign: "center",
                        }}>
                          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 1, color: INK }}>
                            {COLS[ci].ah}
                          </div>
                          <div style={{ fontFamily: F_BODY, fontWeight: 800, fontSize: 23, letterSpacing: 5, color: INK2, marginTop: 6 }}>
                            {COLS[ci].t}
                          </div>
                        </div>
                      ))}
                      <div style={{
                        position: "absolute", left: 60, top: Y_RULE, height: 3,
                        width: 1740 * ramp(frame, T.f2 + 2, 18), background: rgba(INK, 0.6),
                      }} />

                      {ROWS.map((r, i) => {
                        const rp = ramp(frame, T.rowsIn[i], 16);
                        if (rp <= 0) return null;
                        const emph = emphOf(i) * rp;
                        const band = clamp01(1 - Math.abs(readRow - i) / 0.62) * (1 - flat);
                        const last = i === 6;
                        return (
                          <div key={i} style={{ opacity: emph }}>
                            {/* cama de la fila que se está leyendo */}
                            <div style={{
                              position: "absolute", left: 60, top: ROW_Y[i] - ROW_H / 2, width: 1740, height: ROW_H,
                              background: rgba(V.volt, 0.17 * band), borderRadius: 8,
                            }} />
                            {band > 0.2 && (
                              <div style={{
                                position: "absolute", left: 60, top: ROW_Y[i] - ROW_H / 2, width: 8, height: ROW_H,
                                background: rgba(VOLT_INK, band), borderRadius: 4,
                              }} />
                            )}
                            {/* hairline de la grilla */}
                            <div style={{
                              position: "absolute", left: 60, top: ROW_Y[i] + ROW_H / 2, height: 1,
                              width: 1740 * rp, background: rgba(INK, 0.14),
                            }} />

                            {/* nombre de la carga + sus vatios */}
                            <div style={{
                              position: "absolute", left: NAME_X, top: ROW_Y[i] - (r.sub ? 54 : 40), width: NAME_W,
                              fontFamily: F_BODY, fontWeight: 700, fontSize: 33, lineHeight: 1.14, color: INK,
                              transform: `translateX(${((1 - rp) * -18).toFixed(1)}px)`,
                            }}>
                              {r.name}
                              {r.sub && (
                                <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 24, color: INK2, marginTop: 2 }}>{r.sub}</div>
                              )}
                              <div style={{
                                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 1.2,
                                color: VOLT_INK, marginTop: 6,
                              }}>{r.w}<span style={{ fontSize: 24, color: INK2, marginLeft: 5 }}>W</span></div>
                            </div>

                            {/* LOS CASILLEROS: la cifra que se dice crece y se tiñe de voltio */}
                            {SHOW.map((ci, k) => {
                              const fo = focusOf(i, k);
                              const txt = r.cells[ci];
                              const dash = txt === "—";
                              const size = lerp(58, 78, fo);
                              return (
                                <div key={k}>
                                  {fo > 0.02 && (
                                    <div style={{
                                      position: "absolute", left: COL_B[k] - COL_HW + 8, top: ROW_Y[i] - 54,
                                      width: COL_HW * 2 - 16, height: 108, borderRadius: 8,
                                      background: dash ? rgba(V.danger, 0.16 * fo) : rgba(V.volt, 0.24 * fo),
                                      border: `2px solid ${rgba(dash ? DANGER_INK : VOLT_INK, 0.75 * fo)}`,
                                    }} />
                                  )}
                                  <div style={{
                                    position: "absolute", left: COL_B[k] - COL_HW, top: ROW_Y[i] - size * 0.62,
                                    width: COL_HW * 2, textAlign: "center", whiteSpace: "nowrap",
                                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1,
                                    color: dash ? DANGER_INK : (fo > 0.4 ? INK : (last ? INK2 : INK)),
                                    transform: `scale(${(1 + (1 - ramp(frame, T.rowsIn[i] + 4, 10, SNAP)) * 0.18).toFixed(3)})`,
                                    transformOrigin: "50% 50%",
                                  }}>{txt}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* ── el borde de abajo de la hoja + la SEGUNDA HOJA que asoma ─────────── */}
                      <div style={{
                        position: "absolute", left: 0, top: SHEET_BOT, width: 1920, height: 260,
                        background: `linear-gradient(180deg, ${rgba(INK, 0.22)} 0px, rgba(0,0,0,0) 26px)`,
                      }} />
                      <div style={{
                        position: "absolute", left: 40, top: SHEET_BOT + 16, width: 1840, height: 200,
                        borderRadius: 4, overflow: "hidden", opacity: 0.5 + 0.5 * cornerP,
                        transform: `rotate(${(-0.7 + cornerP * 0.5).toFixed(2)}deg)`,
                        boxShadow: `0 -10px 30px ${rgba(INK, 0.25)}`,
                      }}>
                        <Img src={staticFile("img/cmebateria/cmeb_mv_tabla_hojaMesa.jpg")}
                          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                        <AbsoluteFill style={{ background: rgba(PAPER, 0.62) }} />
                      </div>

                      {/* ── LA ESQUINA QUE SE DESPEGA (se la lleva MovGuia) ──────────────────── */}
                      {cornerP > 0.01 && (
                        <div style={{ position: "absolute", left: 1300, top: SHEET_BOT - 420, width: 560, height: 420 }}>
                          {/* el hueco que deja: se ve la hoja de abajo */}
                          <div style={{
                            position: "absolute", inset: 0,
                            clipPath: `polygon(100% ${(100 - 74 * cornerP).toFixed(1)}%, 100% 100%, ${(100 - 74 * cornerP).toFixed(1)}% 100%)`,
                            background: `linear-gradient(135deg, ${PAPER_BACK} 0%, ${rgba(INK, 0.42)} 100%)`,
                          }} />
                          {/* el DORSO de la esquina levantada, con su sombra sobre la hoja */}
                          <div style={{
                            position: "absolute", inset: 0,
                            clipPath: `polygon(100% ${(100 - 74 * cornerP).toFixed(1)}%, ${(100 - 74 * cornerP).toFixed(1)}% 100%, ${(52 - 16 * cornerP).toFixed(1)}% ${(58 - 14 * cornerP).toFixed(1)}%)`,
                            background: `linear-gradient(128deg, #F6F3E9 0%, ${PAPER_BACK} 58%, #C7BFA8 100%)`,
                            filter: `drop-shadow(-14px -10px 22px ${rgba(INK, 0.34)})`,
                          }} />
                        </div>
                      )}
                    </>
                  )}
                </G>
              </G>
            </G>
          </Plane>
        )}

        {/* ═══ EL MATERIAL REAL (flota sobre la página, con su propio parallax) ═══════════ */}
        {paperOn && frame >= T.f2 && (
          <Plane z={60}>
            <G t={fitT}>
              <G t={pageZoom} o={pageAlpha}>
                <G t={pageT}>
                  {ROWS.map((r, i) => {
                    const rp = ramp(frame, T.rowsIn[i], 16);
                    if (rp <= 0) return null;
                    const emph = emphOf(i);
                    const band = clamp01(1 - Math.abs(readRow - i) / 0.8) * (1 - flat);
                    return (
                      <React.Fragment key={i}>
                        <MediaCard
                          src={r.src} kind={r.kind} startFrom={r.from}
                          w={200} h={118}
                          x={PX(CARD_X)} y={PY(ROW_Y[i] + (1 - rp) * 24)}
                          z={8 + i * 2}
                          lit={0.5 + 0.5 * band} litColor={i >= 5 ? V.danger : V.volt}
                          radius={8} opacity={rp * emph} sheenAt={T.rowsIn[i] + 6} grade
                        />
                        <IconPng src={`img/cmebateria/cmeb_ic_${r.ic}.png`}
                          x={PX(918)} y={PY(ROW_Y[i] - 36)} size={44} z={22}
                          opacity={0.9 * rp * emph} glow={INK} />
                      </React.Fragment>
                    );
                  })}

                  {/* el ícono de batería como objeto impreso de la fila de arriba */}
                  {SHOW.map((_, k) => (
                    <IconPng key={k} src="img/cmebateria/cmeb_ic_bateria.png"
                      x={PX(COL_B[k])} y={PY(Y_HEAD_TOP + 6)} size={46} z={20}
                      opacity={0.8 * ramp(frame, T.f2 + 6 + k * 4, 14)} glow={INK} />
                  ))}
                </G>
              </G>
            </G>
          </Plane>
        )}

        {/* ═══ ACTO 5 · LA HELADERA A SANGRE: la cifra sale del papel y cae sobre el objeto ═ */}
        {fridgeAlpha > 0.01 && (
          <Plane z={140}>
            <AbsoluteFill style={{ opacity: fridgeAlpha, overflow: "hidden" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                transform: thru(fridgeK), transformOrigin: "0% 0%", overflow: "hidden",
              }}>
                <PhotoPlane src="broll/cmebateria/cmeb_mv_tabla_heladeraNoche.mp4" kind="video"
                  z={0} scale={1.1} dim={0.46} tint={V.volt} startFrom={30} />
              </div>
              {/* las cifras VIAJAN con el material: entran y vuelven al casillero por el mismo punto */}
              <div style={{
                position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                transform: thru(fridgeK), transformOrigin: "0% 0%",
                opacity: clamp01((zk - 0.84) / 0.12),
              }}>
                <Readout value="5 h 45" at={T.fr50} x={30} y={50} size={150}
                  color={V.volt} label="CON LA BATERÍA DE 50 Ah" />
                <Readout value="11 h 30" at={T.fr100} x={72} y={50} size={150}
                  color={V.volt} label="CON LA DE 100 Ah" />
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 96, textAlign: "center",
                  opacity: ramp(frame, T.fr100 + 16, 14),
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 3.2,
                  color: V.white, textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.92)",
                }}>LA HELADERA CRUZA LA NOCHE ENTERA</div>
              </div>
            </AbsoluteFill>
          </Plane>
        )}

        {/* ═══ LA MANO: ocluye en F3, señala en 4-6 y en F5 arrastra la hoja ═══════════════ */}
        {coverK > 0.01 && (
          <Plane z={300}>
            <MediaCard
              src="broll/cmebateria/cmeb_mv_tabla_dedoFila.mp4" kind="video" startFrom={4}
              w={Math.round(lerp(900, 3000, coverK))} h={Math.round(lerp(560, 1900, coverK))}
              x={lerp(-18, 52, coverK)} y={lerp(126, 50, coverK)}
              z={0} rot={lerp(-26, -6, coverK)} radius={0}
              lit={0.7} litColor={V.volt} grade={false} opacity={1}
            />
          </Plane>
        )}
        {handOn > 0.01 && coverK <= 0.01 && (
          <Plane z={210}>
            <MediaCard
              src="broll/cmebateria/cmeb_mv_tabla_dedoFila.mp4" kind="video" startFrom={26}
              w={300} h={200}
              x={PX(PTR_X) - 3} y={PY(handY + 78)}
              z={0} rot={-13} radius={10}
              lit={0.85} litColor={V.volt} opacity={clamp01(handOn)} sheenAt={T.f3 + 24} grade
            />
            {/* la punta: el vector que en F5 se lleva la hoja para arriba */}
            <div style={{
              position: "absolute", left: PTR_X + 128, top: handY - 17, width: 0, height: 0,
              borderTop: "17px solid transparent", borderBottom: "17px solid transparent",
              borderLeft: `22px solid ${VOLT_INK}`, opacity: clamp01(handOn),
            }} />
          </Plane>
        )}
      </Layers>

      {/* ── EL RÓTULO FIJO: 1 idea por acto, siempre en el mismo lugar, sobre un lavado de luz ─ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* la luz que cae sobre el borde de arriba de la hoja: garantiza el rótulo y come el scroll */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: "100%", height: 268,
          background: `linear-gradient(180deg, ${rgba(PAPER, 0.94)} 0%, ${rgba(PAPER, 0.86)} 42%, rgba(0,0,0,0) 100%)`,
          opacity: paperOn ? Math.max(0.55, stickyP) * (1 - clamp01(zk * 2)) : 0,
        }} />
        {paperOn && (
          <div style={{ opacity: 1 - clamp01((zk - 0.25) * 2.4) }}>
            <div style={{
              position: "absolute", left: 60, top: Y_KICK, width: 900,
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 4.6,
              color: VOLT_INK, textTransform: "uppercase",
            }}>LA TABLA QUE BORRA TODAS LAS CUENTAS</div>
            <TitleRoll frame={frame} items={[
              { at: T.f1, text: "La hoja que no tiene cuentas", color: INK },
              { at: T.chips[0], text: "Tu batería, arriba", color: INK },
              { at: T.f2, text: "Lo que quieres prendido", color: INK },
              { at: T.f3, text: "Lo chico dura días", color: VOLT_INK },
              { at: T.f4, text: "La heladera aguanta la noche", color: VOLT_INK },
              { at: T.f5, text: "Y acá está el límite", color: DANGER_INK },
            ]} />
          </div>
        )}
        {/* el encabezado de columna PEGADO: nunca se pierde qué batería es cada casillero */}
        {paperOn && stickyP > 0.02 && (
          <div style={{ opacity: stickyP * 0.94 * (1 - clamp01(zk * 2)) }}>
            {SHOW.map((ci, k) => (
              <div key={k} style={{
                position: "absolute", left: COL_B[k] - COL_HW, top: 150, width: COL_HW * 2, textAlign: "center",
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, letterSpacing: 1.4, color: INK,
              }}>
                {COLS[ci].ah}
                <div style={{ height: 3, width: 74, margin: "8px auto 0", background: rgba(VOLT_INK, 0.7) }} />
              </div>
            ))}
          </div>
        )}
      </AbsoluteFill>

      {/* ══ LAS COSTURAS · una distinta por frontera · ⛔ ninguna es un fade ═════════════════ */}
      {/* F1 · MATCH-SHAPE: en el golpe del aterrizaje salta POLVO DE PAPEL y la hoja pasa a ser
          la página. El color de la banda y del polvo es el del PAPEL, nunca el del fondo. */}
      <SeamWipeMatter at={T.f1 - 12} dur={26} tint={PAPER} />
      <SeamOcclude at={T.f1 - 5} dur={18} color={PAPER} angle={-6} />
      {/* F2 · CORTE EN EL BEAT: flash voltio de 5 frames y cambia el encuadre de la misma hoja */}
      <SeamFlash at={T.f2} color={V.volt} dur={5} />
      {/* F3 · OCLUSIÓN: la MANO cruza el cuadro (arriba va el clip real; esto garantiza el 100 %) */}
      <SeamOcclude at={T.f3} dur={16} color={SKIN} angle={7} />
      {/* F4 = ZOOM-THROUGH y F5 = MATCH-MOVE: no llevan overlay, son movimiento puro. */}
    </AbsoluteFill>
  );
};

export default MovTabla;
