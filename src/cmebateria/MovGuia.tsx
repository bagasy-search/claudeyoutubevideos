// MovGuia.tsx — MOVIMIENTO 4 de `cmebateria` (canal Claudio Mendoza Constructor).
// "¿Esta Batería de Auto Puede Reemplazar al Generador a Nafta en un Apagón?" · P48→P52 (~35 s).
//
// ES EL MOMENTO DE CONVERSIÓN, y por eso es el más delicado de los siete: tiene que sentirse como un
// tipo mostrando algo que hizo. **Primero el valor, después el acceso.** Claudio acaba de mostrar la
// tabla de las horas; levanta esa hoja, aparece SU favorita — la Hoja del Refrigerador —, la pega con
// un imán en la puerta de la heladera, recién ahí aparece el código para llegar a todo, y cierra con
// el renglón que le escribió Ricardo. Nunca hay una placa de venta: hay una página, una puerta blanca
// y una nota al margen.
//
// ⛔ NO es una sucesión de tarjetas: es UN movimiento continuo.
//    · UNA sola atmósfera (`VoltAtmos`) montada una vez y jamás remontada.
//    · UNA sola cámara (`gcam` con el frame GLOBAL) que nunca vuelve a 0. Entra en (z 60, panX +40)
//      porque el offset constante +40 px que le appendeo cancela el viaje panX −40 de la propia gcam;
//      sale exactamente en (z 0, panX 0), que es el enterFrom de MovNoche.
//    · La cámara ADEMÁS viaja 1500 px hacia arriba: el acto 1 pasa en la MESA (la sala de papel) y
//      los actos 2-4 en la PUERTA de la heladera. Es un solo espacio físico, no dos escenas.
//    · La luz EVOLUCIONA: papel cálido (ámbar sobre `WhiteRoom`) → la cocina apagada → voltio otra vez
//      cuando el video vuelve al mundo.
//    · MATERIA QUE CRUZA cada frontera: la esquina levantada que dejó MovTabla se termina de levantar
//      y debajo asoma la Hoja del Refrigerador; la hoja viaja en la mano hasta la puerta; el esmalte
//      blanco de la puerta cruza y detrás ya están el QR y la portada; el rectángulo apaisado del QR
//      se aplana y se vuelve el renglón de Ricardo; y la puerta blanca, al final, se vuelve la pared
//      del garaje.
//
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — acto por acto (cámara · luz · partículas · materia)                        ║
// ╠══╤═══════════════════════╤══════════════════════════════════╤═══════════════════════════════╣
// ║ 1│ LA SEGUNDA HOJA:      │ enterFrom: z0 60, panX +40, la   │ exitTo: la hoja entera escrita║
// ║  │ EL ORDEN DE LAS       │ cámara MIRA LA MESA (camY 1500,  │ (6 pasos + el renglón NUNCA), ║
// ║  │ PRIMERAS DOS HORAS    │ rx 5°) · papel CÁLIDO · .05      │ papel cálido · .05            ║
// ║  │ (0 → .438 D)          │ materia: LA ESQUINA LEVANTADA de │ materia: LA HOJA DEL          ║
// ║  │                       │ la hoja anterior, y debajo la mía│ REFRIGERADOR, suelta y viva   ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F1 = MATCH-MOVE. La hoja se despega de la mesa y NO corta: sigue su vector. La cámara sube ║
// ║  │  los 1500 px con ella, así que la hoja queda CLAVADA en el centro del cuadro mientras el    ║
// ║  │  fondo se raya hacia abajo; al llegar, la hoja se endereza (rx 9°→0°) contra la puerta.     ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 2│ EL IMÁN               │ enterFrom: camY 0, rx 0, la      │ exitTo: la hoja pegada arriba ║
// ║  │ (.438 → .632 D)       │ cocina apagada alrededor · luz   │ a la izquierda de la puerta,  ║
// ║  │                       │ torch/ámbar · .07                │ el imán quieto · .09          ║
// ║  │                       │ materia: la hoja en la mano      │ materia: EL ESMALTE BLANCO    ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F2 = OCLUSIÓN. `SeamOcclude` con el color del ESMALTE de la puerta (#EDEFE7) — la propia   ║
// ║  │  puerta cruza el cuadro; detrás ya están puestos el QR y la portada. ⛔ NO es el color del  ║
// ║  │  fondo (el fondo es la cocina oscura): por eso lee como chapa blanca y no como un pozo.     ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 3│ EL QR AL COSTADO      │ enterFrom: puerta + hoja + imán  │ exitTo: la tarjeta del QR     ║
// ║  │ (.632 → .836 D)       │ intactos a la izquierda; tarjeta │ quieta 6 s, la portada detrás ║
// ║  │                       │ apaisada a la derecha · .09      │ · .10                         ║
// ║  │                       │ materia: la tarjeta crema        │ materia: EL RECTÁNGULO APAISADO║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║  │  F3 = CORTE EN EL BEAT (+ `SeamFlash` ámbar de 5 frames, la cocina respirando). Encuadre y  ║
// ║  │  luz calzan a los dos lados: mismo z, misma puerta, mismo slot. Sólo cambia el contenido.   ║
// ║──┼───────────────────────┼──────────────────────────────────┼───────────────────────────────╢
// ║ 4│ EL RENGLÓN DE RICARDO │ enterFrom: el rectángulo del QR  │ exitTo: z1 0, panX 0 · VOLT   ║
// ║  │ (.836 → 1.0 D)        │ colapsado en tres renglones      │ otra vez · .25 · materia: LA  ║
// ║  │                       │ rayados · .12                    │ PUERTA BLANCA convertida en   ║
// ║  │                       │ materia: los renglones           │ LA PARED DEL GARAJE           ║
// ║──┴───────────────────────┴──────────────────────────────────┴───────────────────────────────╢
// ║  F4 (salida hacia MovNoche) = MATCH-SHAPE + OCLUSIÓN: el rectángulo blanco de la puerta crece  ║
// ║  hasta ser el rectángulo del cuadro, la hoja se va por arriba, y una banda de HORMIGÓN         ║
// ║  (`V.concrete`, la materia que llega) barre; detrás ya está la pared del garaje con el voltio  ║
// ║  y las partículas en .25. MovNoche arranca exactamente ahí.                                   ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
//
// LOS PASOS SON REALES: salen tal cual de `anexo-heladera.mjs` (Anexo 1 · La hoja del refrigerador).
// No están inventados para el video, y por eso la página lleva hasta su renglón de NUNCA.
//
// CONTRATO TÉCNICO: sin Math.random/Date.now (todo `rnd(k)`), sin backdrop-filter, sin blur grande a
// pantalla completa, Easing.poly(5) en vez del inexistente Easing.quint, safe area 60 px, imports
// sólo de `remotion`, `react` y `./VoltStage`.
// ⚠️ EL QR: tarjeta apaisada, QUIETA (sin drift, sin sheen, sin grade encima, sin rotación 3D) y
// grande durante 6 segundos seguidos, entre las frames T.qr y T.f3. Nada se le pone arriba.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, WindField, Layers, Plane, MediaCard, PhotoPlane, IconPng, WhiteRoom,
  SeamOcclude, SeamFlash, Body, Bed,
} from "./VoltStage";

// ── TINTA SOBRE PAPEL ───────────────────────────────────────────────────────────────────────
const INK = "#171A0F";        // tinta principal
const INK2 = "#5C6149";       // tinta secundaria
const VOLT_INK = "#6E8A00";   // el voltio, legible sobre papel
const AMB_INK = "#8A5B00";    // el ámbar, legible sobre papel
const RED_INK = "#A33B18";    // el renglón de NUNCA (la hoja real lo tiene)
const DOOR = "#EDEFE7";       // EL ESMALTE de la puerta — LA MATERIA de la costura F2

// ── GEOMETRÍA DEL ESPACIO (un solo espacio físico; el cuadro es 1920×1080) ──────────────────
const TABLE_Y = 1500;         // la mesa vive 1500 px por debajo de la puerta
const DOOR_CX = 590;          // la puerta ocupa el 55% izquierdo; a la derecha vive la cocina
const DOOR_W = 960;
const DOOR_H = 1460;
const SX = (px: number) => (px / 1920) * 100;
const SY = (py: number) => (py / 1080) * 100;

// ── GEOMETRÍA DE LA PÁGINA (coordenadas locales de la hoja; safe area resuelta al escalar) ──
const PAGE_W = 1560;
const PAGE_H = 880;
const P_L = 56;               // margen izquierdo de la página
const P_R = 1504;             // margen derecho
const Y_KICK = 40;
const Y_TITLE = 80;
const Y_RULE1 = 164;
const Y_HEAD = 186;
const Y_RULE2 = 228;
const ROW_Y = [284, 378, 472, 566, 660, 754];
const Y_NEVER = 806;
const RAIL_X = 118;           // la espina de la cuenta regresiva al revés
const WHEN_R = 372;           // "CUÁNDO" alineado a la derecha
const IC_X = 428;
const TXT_X = 486;
const PGX = (px: number) => (px / PAGE_W) * 100;
const PGY = (py: number) => (py / PAGE_H) * 100;

// ── LOS PASOS REALES (anexo-heladera.mjs · Anexo 1) ─────────────────────────────────────────
const STEPS: { when: string; ic: string; hero?: boolean }[] = [
  { when: "AHORA", ic: "heladera", hero: true },
  { when: "MINUTO 1", ic: "candado" },
  { when: "MINUTO 2", ic: "heladera" },
  { when: "MINUTO 5", ic: "router" },
  { when: "MINUTO 6", ic: "foco" },
  { when: "MINUTO 10", ic: "celular" },
];

// ── HELPERS PUROS ───────────────────────────────────────────────────────────────────────────
const EO = Easing.bezier(0.22, 0.61, 0.28, 1);
const SNAP = Easing.bezier(0.7, 0, 0.18, 1);
const WHIP = Easing.bezier(0.62, 0.02, 0.2, 1);
const ramp = (frame: number, at: number, dur: number, easing = EO) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// revelado por BARRIDO (⛔ nunca un fade): la tipografía se ESCRIBE de izquierda a derecha
const ClipIn: React.FC<{ p: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, children, style }) => (
  <div style={{ clipPath: `inset(0 ${((1 - clamp01(p)) * 100).toFixed(2)}% 0 0)`, ...style }}>{children}</div>
);

// la cifra que SALTA dentro del renglón (el kit escribe los números, no el motor de imagen)
const Pop: React.FC<{ p: number; color: string; children: React.ReactNode }> = ({ p, color, children }) => (
  <span style={{
    display: "inline-block", fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, lineHeight: 1,
    color, transform: `scale(${(1 + (1 - clamp01(p)) * 0.34).toFixed(3)})`, transformOrigin: "50% 62%",
    opacity: clamp01(p * 2.2),
  }}>{children}</span>
);

// el slot de TITULAR: una idea por acto, siempre en el mismo lugar, cambiando por ROLADO mecánico
const TitleRoll: React.FC<{
  frame: number; items: { at: number; text: string; color: string }[];
  w: number; h: number; size: number;
}> = ({ frame, items, w, h, size }) => {
  let ty = 0;
  for (let i = 1; i < items.length; i++) ty += ramp(frame, items[i].at, 12, SNAP) * h;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-ty.toFixed(2)}px)` }}>
        {items.map((it, i) => (
          <div key={i} style={{
            height: h, display: "flex", alignItems: "center",
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1,
            letterSpacing: 0.4, color: it.color, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{it.text}</div>
        ))}
      </div>
    </div>
  );
};

export const MovGuia: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;
  const A = (f: number) => Math.round(D * f);

  // ── LOS TIEMPOS (fracciones de D, para que sobrevivan al re-anclaje al Whisper) ────────────
  const T = {
    peel: A(0.008),                                                   // la esquina termina de levantarse
    page: A(0.048),                                                   // la Hoja del Refrigerador queda sola
    kick: A(0.060),
    title1: A(0.072),
    rows: [A(0.104), A(0.158), A(0.208), A(0.256), A(0.300), A(0.344)],
    big1: A(0.126),                                                   // "4 horas" cerrada
    big2: A(0.146),                                                   // "40 minutos" abierta
    never: A(0.392),                                                  // el renglón de NUNCA
    f1: A(0.438),                                                     // F1 · MATCH-MOVE hacia la puerta
    a2: A(0.470),
    pega: A(0.492),                                                   // insert: Claudio pegando
    iman: A(0.548),                                                   // insert: el imán (el beat)
    why: A(0.566),                                                    // la razón por la que la hoja existe
    f2: A(0.632),                                                     // F2 · OCLUSIÓN (esmalte)
    a3: A(0.646),
    port: A(0.652),                                                   // la portada, detrás
    qr: A(0.664),                                                     // ⚠️ el QR QUIETO desde acá…
    f3: A(0.836),                                                     // …hasta acá (6,0 s) · F3 · corte en el beat
    note: A(0.850),
    firma: A(0.912),
    exit: A(0.928),                                                   // F4 · MATCH-SHAPE puerta → pared
    occl: A(0.950),
  };
  const OCC_D = Math.max(18, Math.round(D * 0.023));

  // ── LA CÁMARA (una sola, frame GLOBAL, nunca vuelve a 0) ───────────────────────────────────
  // gcam viaja panX −40 sobre TODO el movimiento; el offset constante +40 px es el enterFrom que
  // dejó MovTabla. Se cancelan: entra en (z 60, +40) y sale en (z 0, 0) = enterFrom de MovNoche.
  const cam = gcam(frame, { z0: 60, z1: 0, panX: -40, dur: D });
  // el viaje vertical MESA → PUERTA: es la costura F1, hecha con la cámara y no con un corte
  const camY = interpolate(frame, [0, T.f1, T.f1 + 52, D], [TABLE_Y, TABLE_Y, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: WHIP });
  const camRx = interpolate(frame, [0, T.f1, T.f1 + 52], [5, 5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: WHIP });
  const camStr = cam.transform + ` translate3d(40px, ${(-camY).toFixed(2)}px, 0) rotateX(${camRx.toFixed(3)}deg)`;

  // ── LA LUZ (evoluciona, no salta) ──────────────────────────────────────────────────────────
  const toVolt = ramp(frame, T.f2, Math.max(40, A(0.30)));            // ámbar de la casa → voltio del garaje
  const atmosTint = light(toVolt, "amber", "volt");
  const roomTint = light(ramp(frame, 0, Math.max(30, A(0.24))), "amber", "torch");
  const atmosI = interpolate(frame, [0, T.f1, T.exit, D], [0.85, 0.9, 1, 1.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(frame, [0, D], [0.62, 0.2], { extrapolateRight: "clamp" });

  // ── LAS PARTÍCULAS (.05 la sala de papel → .25 el mundo) ───────────────────────────────────
  const wind = interpolate(frame, [0, T.f1, T.a3, T.exit, D], [0.05, 0.07, 0.1, 0.14, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EO });
  const windOp = interpolate(frame, [0, T.f2, T.exit, D], [0.3, 0.5, 0.9, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── ACTO 1 · la esquina levantada se termina de levantar ───────────────────────────────────
  const peelP = ramp(frame, T.peel, T.page - T.peel, Easing.bezier(0.4, 0.02, 0.3, 1));
  const peelAlive = peelP < 0.999;
  const pageAlive = ramp(frame, T.page, 10);

  // ── F1 · MATCH-MOVE · la hoja viaja (adelanta 2 frames a la cámara: es la mano, no la grúa) ─
  const move = ramp(frame, T.f1 - 2, 54, WHIP);
  // la hoja queda clavada en el centro del cuadro mientras el fondo se raya: ése es el match-move
  const pageCX = lerp(960, DOOR_CX, move);
  const pageCY = lerp(TABLE_Y + 540, 428, move);
  const pageS = lerp(1, 0.335, move);
  const pageRX = lerp(9, 0, move);
  const pageRZ = lerp(-0.9, -1.7, move);

  // ── ACTO 2 · el imán ───────────────────────────────────────────────────────────────────────
  const pegaP = ramp(frame, T.pega, 14, SNAP) * (1 - ramp(frame, T.iman - 6, 10, SNAP));
  const imanP = ramp(frame, T.iman, 14, SNAP) * (1 - ramp(frame, T.f2 - 4, 8, SNAP));
  const whyP = ramp(frame, T.why, 22);

  // ── ACTO 3 · el QR (quieto) + la portada detrás ────────────────────────────────────────────
  const portP = ramp(frame, T.port, 18, SNAP);
  const qrP = ramp(frame, T.qr - 10, 12, SNAP);        // llega ANTES de T.qr y después no se toca

  // ── ACTO 4 · el renglón de Ricardo (MATCH-SHAPE del rectángulo del QR) ─────────────────────
  const flat = ramp(frame, T.f3, 12, SNAP);            // la tarjeta apaisada se aplana en renglones
  const noteP = [ramp(frame, T.note, 20), ramp(frame, T.note + 16, 20), ramp(frame, T.note + 32, 20)];
  const firmaP = ramp(frame, T.firma, 14);

  // ── F4 · MATCH-SHAPE · la puerta blanca se vuelve la pared del garaje ──────────────────────
  const grow = ramp(frame, T.exit, Math.max(16, T.occl - T.exit + 6), Easing.poly(2));
  const doorG = lerp(1, 2.2, grow);
  const doorDX = (960 - DOOR_CX) * grow;
  const sheetFly = -760 * ramp(frame, T.exit + 2, 22, Easing.poly(2));   // la hoja se va por arriba
  const rightOut = 980 * ramp(frame, T.exit, 20, Easing.poly(2));        // la columna derecha sale de cuadro
  const world = frame >= T.occl + 5;                                     // detrás de la oclusión: la pared

  // ── LA PÁGINA: escala compensada para que sea un OBJETO y no un plano de HUD ───────────────
  const magz = 1500 / (1500 - cam.z);
  const pageFit = pageS / magz;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ───────────────────────────── */}
      <VoltAtmos tint={atmosTint} tint2={V.amber} keyFrom={keyFrom} intensity={atmosI} floor={0.5} />

      {/* ── LA SALA DE PAPEL: el suelo de todo el acto 1, con parallax propio ─────────────── */}
      <AbsoluteFill style={{
        transform: `translate3d(${(40 * (1 - cam.e) * 0.3).toFixed(2)}px, ${(Math.sin(frame / 103) * 3 - camY * 0.06).toFixed(2)}px, 0)`,
        overflow: "hidden",
      }}>
        <WhiteRoom at={-6} dur={1} tint={roomTint}>
          {/* fibra del papel (determinista, sin Math.random) */}
          <AbsoluteFill style={{ opacity: 0.45 }}>
            {Array.from({ length: 20 }, (_, i) => (
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

        {world ? (
          /* ═══ LA PARED DEL GARAJE — el match-shape resuelto: mismo rectángulo, otra materia ═══ */
          <>
            <PhotoPlane src="img/cmebateria/cmeb_mv_guia_imanPuerta.jpg" kind="photo"
              z={-240} scale={2.45} dim={0.42} tint={V.volt} />
            <Plane z={-120}>
              <AbsoluteFill style={{ background: `linear-gradient(172deg, ${rgba(V.concrete, 0.5)} 0%, ${rgba(V.ink1, 0.42)} 100%)`, mixBlendMode: "multiply" }} />
              <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 22% 4%, ${rgba(V.volt, 0.16)} 0%, rgba(0,0,0,0) 62%)` }} />
            </Plane>
          </>
        ) : (
          <>
            {/* ── LA COCINA APAGADA: cama de material real de los actos 2-4 ─────────────── */}
            <PhotoPlane src="broll/cmebateria/cmeb_mv_guia_cocinaApagada.mp4" kind="video"
              z={-300} scale={1.24} dim={0.62} tint={V.torch} startFrom={12} />

            {/* ── LA MESA: las otras páginas de la colección, como cama del acto 1 ──────── */}
            <div style={{ position: "absolute", left: 0, top: TABLE_Y, width: 1920, height: 1080, transformStyle: "preserve-3d" }}>
              <PhotoPlane src="img/cmebateria/cmeb_lam_sistemas.jpg" kind="photo"
                z={-320} scale={1.5} dim={0.12} tint={V.amber} />
            </div>

            {/* ═══ LA PUERTA + LA HOJA (crecen juntas en el match-shape final) ════════════ */}
            <div style={{
              position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
              transformStyle: "preserve-3d", transformOrigin: `${DOOR_CX}px 540px`,
              transform: `translate(${doorDX.toFixed(1)}px, 0px) scale(${doorG.toFixed(4)})`,
            }}>
              {/* la puerta: esmalte blanco con la textura REAL de la puerta adentro */}
              <div style={{
                position: "absolute", left: DOOR_CX - DOOR_W / 2, top: 540 - DOOR_H / 2,
                width: DOOR_W, height: DOOR_H, borderRadius: 26, overflow: "hidden",
                background: `linear-gradient(104deg, ${DOOR} 0%, #E2E5DB 44%, #D3D7CB 100%)`,
                boxShadow: `0 40px 90px ${rgba(V.ink0, 0.72)}, inset 0 2px 0 ${rgba(V.white, 0.7)}, inset -18px 0 44px ${rgba(V.ink0, 0.18)}`,
              }}>
                <AbsoluteFill style={{ opacity: lerp(0.16, 0.5, grow), mixBlendMode: "multiply" }}>
                  <Img src={staticFile("img/cmebateria/cmeb_mv_guia_imanPuerta.jpg")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </AbsoluteFill>
                <AbsoluteFill style={{ background: `linear-gradient(120deg, ${rgba(V.torch, 0.3)} 0%, rgba(0,0,0,0) 46%)` }} />
                <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 58%, ${rgba(V.ink0, 0.26)} 100%)` }} />
                {/* la manija: la puerta es un objeto de la casa, no un panel */}
                <div style={{
                  position: "absolute", right: 44, top: 250, width: 22, height: 380, borderRadius: 12,
                  background: "linear-gradient(90deg, #B9BDB1 0%, #F2F4EC 38%, #9EA396 100%)",
                  boxShadow: `0 10px 24px ${rgba(V.ink0, 0.4)}`, opacity: 1 - grow * 0.8,
                }} />
              </div>

              {/* ═══ LA HOJA DEL REFRIGERADOR — el objeto que cruza TODAS las fronteras ═══ */}
              <div style={{
                position: "absolute",
                left: pageCX - PAGE_W / 2, top: pageCY - PAGE_H / 2 + sheetFly,
                width: PAGE_W, height: PAGE_H,
                transformStyle: "preserve-3d", transformOrigin: "50% 50%",
                transform: `rotateX(${pageRX.toFixed(2)}deg) rotate(${pageRZ.toFixed(2)}deg) scale(${pageFit.toFixed(4)})`,
                borderRadius: 5, overflow: "hidden", opacity: pageAlive,
                boxShadow: `0 ${Math.round(lerp(26, 9, move))}px ${Math.round(lerp(54, 22, move))}px ${rgba(V.ink0, lerp(0.28, 0.6, move))}, 0 3px 10px ${rgba(V.ink0, 0.3)}`,
                background: "linear-gradient(166deg, #FCFBF6 0%, #F4F2E9 62%, #EAE7DA 100%)",
              }}>
                {/* la lámina REAL como textura: la página es un objeto impreso, no un HUD */}
                <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: "multiply" }}>
                  <Img src={staticFile("img/cmebateria/cmeb_lam_heladera.jpg")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </AbsoluteFill>
                <AbsoluteFill style={{ background: `radial-gradient(88% 66% at 18% 4%, ${rgba(V.amber, 0.12)} 0%, rgba(0,0,0,0) 64%)` }} />

                {/* kicker + el cuaderno del que salió */}
                <ClipIn p={ramp(frame, T.kick, 14)} style={{ position: "absolute", left: P_L + 52, top: Y_KICK, width: 1200 }}>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 4.4, color: VOLT_INK, textTransform: "uppercase" }}>
                    ANEXO 1 · LA HOJA DEL REFRIGERADOR
                  </div>
                </ClipIn>
                <IconPng src="img/cmebateria/cmeb_ic_cuaderno.png"
                  x={PGX(P_L + 20)} y={PGY(Y_KICK - 6)} size={40} opacity={0.8 * ramp(frame, T.kick + 4, 14)} glow={INK} />

                {/* el slot de TITULAR: una idea por acto, siempre en el mismo lugar */}
                <div style={{ position: "absolute", left: P_L, top: Y_TITLE }}>
                  <TitleRoll frame={frame} w={1300} h={72} size={54} items={[
                    { at: T.title1, text: "El orden de las primeras dos horas", color: INK },
                  ]} />
                </div>

                <div style={{ position: "absolute", left: P_L, top: Y_RULE1, height: 3, background: rgba(INK, 0.66), width: (P_R - P_L) * ramp(frame, T.title1 + 4, 20) }} />

                {/* encabezados de columna */}
                <ClipIn p={ramp(frame, T.title1 + 8, 16)} style={{ position: "absolute", left: 0, top: Y_HEAD, width: PAGE_W, height: 34 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: WHEN_R, textAlign: "right", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: INK2, textTransform: "uppercase" }}>CUÁNDO</div>
                  <div style={{ position: "absolute", left: TXT_X, top: 0, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4, color: INK2, textTransform: "uppercase" }}>QUÉ HACES</div>
                </ClipIn>
                <div style={{ position: "absolute", left: P_L, top: Y_RULE2, height: 1.5, background: rgba(INK, 0.34), width: (P_R - P_L) * ramp(frame, T.title1 + 10, 20) }} />

                {/* LA ESPINA: la cuenta regresiva al revés, dibujada como vector (sí es un gráfico) */}
                <div style={{
                  position: "absolute", left: RAIL_X, top: ROW_Y[0] - 26, width: 2.5,
                  height: (ROW_Y[5] + 26 - (ROW_Y[0] - 26)) * ramp(frame, T.rows[0] - 6, 40),
                  background: `linear-gradient(180deg, ${rgba(VOLT_INK, 0.7)} 0%, ${rgba(INK2, 0.35)} 100%)`,
                }} />
                {STEPS.map((_, i) => {
                  const p = ramp(frame, T.rows[i], 10, SNAP);
                  return (
                    <div key={`d${i}`} style={{
                      position: "absolute", left: RAIL_X - 7.5, top: ROW_Y[i] - 7.5, width: 17, height: 17,
                      borderRadius: "50%", background: i === 0 ? VOLT_INK : "#FBFAF5",
                      border: `3px solid ${i === 0 ? VOLT_INK : INK2}`,
                      transform: `scale(${(0.2 + 0.8 * p).toFixed(3)})`, opacity: p,
                      boxShadow: i === 0 ? `0 0 0 6px ${rgba(V.volt, 0.22)}` : "none",
                    }} />
                  );
                })}

                {/* LOS SEIS PASOS, uno por uno */}
                {STEPS.map((s, i) => {
                  const p = ramp(frame, T.rows[i], 16);
                  if (p <= 0) return null;
                  return (
                    <div key={i} style={{ opacity: p, transform: `translateY(${((1 - p) * 14).toFixed(1)}px)` }}>
                      <div style={{
                        position: "absolute", left: 0, top: ROW_Y[i] - 44, width: WHEN_R, textAlign: "right",
                        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 38, letterSpacing: 1.6,
                        color: i === 0 ? VOLT_INK : INK2, textTransform: "uppercase",
                      }}>{s.when}</div>
                      <IconPng src={`img/cmebateria/cmeb_ic_${s.ic}.png`}
                        x={PGX(IC_X)} y={PGY(ROW_Y[i] - 44)} size={44} opacity={0.9 * p} glow={INK} />
                      <ClipIn p={ramp(frame, T.rows[i] + 3, 18)} style={{ position: "absolute", left: TXT_X, top: ROW_Y[i] - 46, width: P_R - TXT_X }}>
                        {i === 0 ? (
                          <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 34, lineHeight: 1.24, color: INK }}>
                            <span style={{ fontWeight: 800, color: RED_INK }}>NO</span> abrir el refrigerador. Cerrado aguanta{" "}
                            <Pop p={ramp(frame, T.big1, 9)} color={VOLT_INK}>4 horas</Pop>; abierto,{" "}
                            <Pop p={ramp(frame, T.big2, 9)} color={AMB_INK}>40 minutos</Pop>.
                          </div>
                        ) : (
                          <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 34, lineHeight: 1.24, color: INK }}>
                            {i === 1 && <>Prender el inversor primero, <b style={{ color: AMB_INK }}>sin nada enchufado</b>.</>}
                            {i === 2 && <>Enchufar la heladera. <b style={{ color: AMB_INK }}>Sola</b>, sin nada más prendido.</>}
                            {i === 3 && <>Enchufar el router de internet.</>}
                            {i === 4 && <><b style={{ color: AMB_INK }}>Una sola</b> luz LED en la cocina.</>}
                            {i === 5 && <>Poner los celulares a cargar.</>}
                          </div>
                        )}
                      </ClipIn>
                    </div>
                  );
                })}

                {/* el renglón de NUNCA — la hoja real lo tiene, y es lo que la hace creíble */}
                <ClipIn p={ramp(frame, T.never, 22)} style={{ position: "absolute", left: P_L, top: Y_NEVER, width: P_R - P_L }}>
                  <div style={{ borderLeft: `5px solid ${RED_INK}`, paddingLeft: 18 }}>
                    <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2, color: RED_INK, textTransform: "uppercase", marginRight: 14 }}>NUNCA</span>
                    <span style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 28, color: INK2 }}>
                      nada que caliente: pava, plancha, estufa, secador.
                    </span>
                  </div>
                </ClipIn>
              </div>

              {/* LA ESQUINA LEVANTADA que entrega MovTabla — se termina de despegar y se va ─── */}
              {peelAlive && (
                <MediaCard
                  src="img/cmebateria/cmeb_lam_sistemas.jpg" kind="photo"
                  w={Math.round(lerp(1610, 880, peelP))} h={Math.round(lerp(910, 510, peelP))}
                  x={SX(lerp(984, 210, peelP))} y={SY(lerp(TABLE_Y + 552, TABLE_Y - 380, peelP))}
                  z={lerp(28, 190, peelP)}
                  rot={lerp(-3, -23, peelP)} ry={lerp(-14, -44, peelP)} rx={lerp(8, 34, peelP)}
                  lit={0.85} litColor={V.amber} radius={6} sheenAt={T.peel + 6} grade
                />
              )}
            </div>

            {/* ═══ LA COLUMNA DERECHA: inserts · QR · portada · el renglón de Ricardo ═════ */}
            <Plane z={40} style={{ transform: `translateZ(40px) translateX(${rightOut.toFixed(1)}px)` }}>

              {/* ACTO 2 · Claudio pegando la hoja (material real, no un ícono) */}
              {pegaP > 0.01 && (
                <MediaCard
                  src="broll/cmebateria/cmeb_mv_guia_claudioPega.mp4" kind="video" startFrom={8}
                  w={640} h={368} x={SX(1470)} y={SY(lerp(322, 300, pegaP))} z={20}
                  lit={0.85} litColor={V.torch} radius={12} opacity={pegaP} sheenAt={T.pega + 6} grade
                  label="LA PEGA EN LA PUERTA"
                />
              )}

              {/* ACTO 2 · EL IMÁN: el gesto doméstico, en macro */}
              {imanP > 0.01 && (
                <MediaCard
                  src="broll/cmebateria/cmeb_mv_guia_imanPuerta.mp4" kind="video" startFrom={16}
                  w={640} h={368} x={SX(1470)} y={SY(lerp(316, 300, imanP))} z={34}
                  lit={0.95} litColor={V.torch} radius={12} opacity={imanP} sheenAt={T.iman + 5} grade
                  label="UN IMÁN"
                />
              )}

              {/* ACTO 3 · LA PORTADA, detrás (objeto de la mesa, no un banner) */}
              {portP > 0.01 && frame < T.exit + 24 && (
                <div style={{
                  position: "absolute", left: 1140, top: 168, width: 330, height: 452,
                  transform: `rotate(${lerp(-11, -7, portP).toFixed(2)}deg) translateY(${((1 - portP) * 26).toFixed(1)}px)`,
                  transformOrigin: "50% 100%", opacity: portP * (1 - flat * 0.55),
                  borderRadius: 6, overflow: "hidden",
                  boxShadow: `0 26px 54px ${rgba(V.ink0, 0.7)}, 0 4px 12px ${rgba(V.ink0, 0.5)}`,
                }}>
                  <Img src={staticFile("img/cmebateria/cmeb_portada.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <AbsoluteFill style={{ background: `linear-gradient(200deg, rgba(0,0,0,0) 30%, ${rgba(V.ink0, 0.4)} 100%)` }} />
                </div>
              )}

              {/* ACTO 3 · ⚠️ EL QR — tarjeta apaisada, QUIETA, sin nada encima, 6 s seguidos.
                  ACTO 4 · MATCH-SHAPE: el mismo rectángulo se aplana y se vuelve el renglón. */}
              {qrP > 0.01 && frame < T.exit + 24 && (
                <div style={{
                  position: "absolute",
                  left: 1120, top: lerp(190, 372, flat),
                  width: 700, height: lerp(420, 5, flat),
                  borderRadius: lerp(10, 2, flat), overflow: "hidden",
                  opacity: qrP,
                  boxShadow: flat > 0.5 ? "none" : `0 24px 50px ${rgba(V.ink0, 0.66)}, 0 4px 12px ${rgba(V.ink0, 0.5)}`,
                }}>
                  <Img src={staticFile("img/cmebateria/cmeb_qrcard.png")}
                    style={{ width: 700, height: 420, objectFit: "cover" }} />
                </div>
              )}

              {/* ACTO 4 · el renglón de Ricardo: una nota al margen, no un testimonio de landing */}
              {flat > 0.5 && (
                <>
                  {[1, 2].map((i) => (
                    <div key={i} style={{
                      position: "absolute", left: 1120, top: 372 + i * 62, height: 2, width: 700 * clamp01(flat * 2 - 1),
                      background: rgba(V.white, 0.22),
                    }} />
                  ))}
                  <div style={{ position: "absolute", left: 1120, top: 300, width: 700 }}>
                    {["Ahora ya sé qué puedo dejar", "conectado, qué apagar primero,", "y cuánto me aguanta cada cosa."].map((ln, i) => (
                      <ClipIn key={i} p={noteP[i]} style={{ height: 62, display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                          fontFamily: F_BODY, fontWeight: 500, fontStyle: "italic", fontSize: 33,
                          lineHeight: 1.1, color: V.white, textShadow: "0 3px 16px rgba(0,0,0,0.9)", whiteSpace: "nowrap",
                        }}>{ln}</div>
                      </ClipIn>
                    ))}
                  </div>
                  <div style={{
                    position: "absolute", left: 1120, top: 502, opacity: firmaP,
                    transform: `translateX(${((1 - firmaP) * -18).toFixed(1)}px)`,
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3.4,
                    color: rgba(V.white, 0.6), textTransform: "uppercase",
                  }}>RICARDO · 61 AÑOS</div>
                  <IconPng src="img/cmebateria/cmeb_ic_casa.png" x={SX(1788)} y={SY(486)} size={44} opacity={0.7 * firmaP} glow={V.ink0} />
                </>
              )}

              {/* EL SLOT DE TEXTO de los actos 2-4: mismo lugar, misma tipografía, misma cama.
                  El acto 3 (el acceso) NO cambia de idioma ni de forma: por eso no lee a anuncio. */}
              {frame >= T.a2 - 6 && (
                <div style={{
                  position: "absolute", left: 1120, top: 664, width: 700,
                  opacity: ramp(frame, T.a2 - 6, 16),
                  transform: `translateY(${((1 - ramp(frame, T.a2 - 6, 18)) * 24).toFixed(1)}px)`,
                }}>
                  <Bed pad={30} w={700}>
                    <div style={{ height: 30, overflow: "hidden" }}>
                      <TitleRoll frame={frame} w={640} h={30} size={22} items={[
                        { at: T.a2, text: "LA HOJA DEL REFRIGERADOR", color: V.volt },
                        { at: T.a3, text: "SI TIENES EL TELÉFONO EN LA MANO", color: V.volt },
                        { at: T.f3, text: "ME ESCRIBIÓ HACE UNAS SEMANAS", color: V.amber },
                      ]} />
                    </div>
                    <div style={{ height: 12 }} />
                    <div style={{ height: 118, overflow: "hidden" }}>
                      <TitleRoll frame={frame} w={640} h={118} size={50} items={[
                        { at: T.a2, text: "En la puerta, no en un cajón", color: V.white },
                        { at: T.a3, text: "Apunta la cámara acá", color: V.white },
                        { at: T.f3, text: "Para eso la hice", color: V.white },
                      ]} />
                    </div>
                    <div style={{ height: 10 }} />
                    <div style={{ position: "relative", height: 92 }}>
                      <div style={{ position: "absolute", left: 0, top: 0, width: 640, opacity: whyP * (1 - ramp(frame, T.f2, 12)) }}>
                        <Body size={29}>El que está en casa esa noche muchas veces no eres tú.</Body>
                      </div>
                      <div style={{ position: "absolute", left: 0, top: 0, width: 640, opacity: ramp(frame, T.a3 + 10, 16) * (1 - ramp(frame, T.f3, 10)) }}>
                        <Body size={29}>También está abajo, en la descripción.</Body>
                      </div>
                      <div style={{ position: "absolute", left: 0, top: 0, width: 640, opacity: ramp(frame, T.f3 + 8, 16) }}>
                        <Body size={29}>Sesenta y uno, y se corta casi todas las semanas.</Body>
                      </div>
                    </div>
                  </Bed>
                  <IconPng src="img/cmebateria/cmeb_ic_celular.png" x={SX(1795)} y={SY(690)} size={46}
                    opacity={0.85 * ramp(frame, T.a3 + 6, 14) * (1 - ramp(frame, T.f3, 10))} glow={V.ink0} />
                </div>
              )}
            </Plane>
          </>
        )}
      </Layers>

      {/* ── EL AIRE: .05 en la sala de papel → .25 cuando el video vuelve al mundo ────────── */}
      <WindField speed={wind} tint={V.white} count={22} opacity={windOp} />

      {/* ── LAS COSTURAS (⛔ ninguna es un fade; una distinta por frontera) ─────────────────── */}
      {/* F1 · MATCH-MOVE: no lleva componente — la hace la cámara + la hoja clavada en el cuadro. */}
      {/* F2 · OCLUSIÓN: cruza EL ESMALTE de la puerta (NO el color del fondo, que es la cocina). */}
      <SeamOcclude at={T.f2} dur={OCC_D} color={DOOR} angle={-6} />
      {/* F3 · CORTE EN EL BEAT: 5 frames de ámbar, la cocina respirando. No es un fade. */}
      <SeamFlash at={T.f3} color={V.amber} dur={5} />
      {/* F4 · MATCH-SHAPE + OCLUSIÓN: barre el HORMIGÓN (la materia que llega) y detrás, la pared. */}
      <SeamOcclude at={T.occl} dur={OCC_D + 6} color={V.concrete} angle={7} />
    </AbsoluteFill>
  );
};

export default MovGuia;
