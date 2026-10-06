// MovEscalones.tsx — MOVIMIENTO S8 · "ESCALON UNO (200) Y ESCALON DOS (650)"
// Video `cmegenerador` (Claudio Mendoza Constructor, ES neutro). 5 actos · 1950 frames @30 (65 s).
// Arranca en el segundo 880.0 del video.
//
// LA ESPINA: escalón uno de 200 dólares y escalón dos de 650 — qué mueve cada uno y dónde se termina.
//
// LA MATERIA QUE CRUZA LAS CUATRO FRONTERAS: **EL CABLE**, y después **LA LINEA**.
//   acto 1 → la hoja de la guía (la lámina EQUIPO A) que venía de `MovTresNumeros` se corre a un lado
//            y deja ver el piso de la cocina: la estación chica de 600 Wh. De su costado sale EL CABLE.
//   acto 2 → la cámara SIGUE ese cable y sale del otro lado en el macro del enchufe del refrigerador:
//            el mismo cable entra por el borde izquierdo con el mismo ángulo y la misma altura (y 68%).
//   acto 3 → la GOMA del cable (V.ink2) cruza el cuadro y detrás ya es de noche; el mismo cable
//            alimenta la cocina a oscuras y el display de la estación deja UNA LINEA verde en y 46%.
//   acto 4 → esa línea verde ES el eje de la onda: corte seco en la palabra, misma altura, misma luz.
//   acto 5 → la onda limpia se aplana y su trazo se vuelve EL BORDE SUPERIOR del panel plegable abierto.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (z −200 → +140) + un RECORRIDO continuo que
// viaja tras el cable hacia la derecha, baja al piso de la cocina de noche, se inclina sobre la placa
// y vuelve a abrir al patio, más un `push` keyframeado que NUNCA salta (en el corte del beat vale lo
// mismo de los dos lados). Es función pura de `gFrame`: ningún acto la reinicia.
// UNA atmósfera: `<VoltAtmos/>` montada UNA vez, fuera del switch de actos.
// LA LUZ evoluciona sin saltar: AMBER (la mesa de la guía) → BONE (producto neutro) → TORCH (la noche
// del apagón) → VOLT (el laboratorio de la placa) → BONE (luz de producto en el garaje, la salida).
//
// ⚠️ LA CAPA DE LECTURA (titulares, cifras, rótulos, íconos de anotación) vive FUERA de `<Layers>`:
// dentro del mundo 3D la perspectiva la AGRANDA y un bloque anclado al 6,5% del borde se sale del
// cuadro cuando la cámara empuja. Afuera respeta la safe area de 60 px al pixel, y igual respira con
// un 7% del recorrido de la cámara (parallax lite: nada queda muerto).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF  (el `enterFrom` de cada acto ES el `exitTo` del anterior)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0 → g390 · "ESCALON UNO. DOSCIENTOS"          material: LAMINA equipoA + CLIP esca1
//   entra  cam {z −200, push 1.00, travel 0 · plano medio sobre la mesa}
//          luz {AMBER cálida de mesa, key 0.30, int 0.95, floor 0.52}
//          materia {LA HOJA DE LA GUIA apoyada, grande y centrada  ← viene de MovTresNumeros}
//   sale   cam {z −47, push 1.14, travel X −180 · viajando a la DERECHA tras el cable}
//          luz {BONE neutra, key 0.42, int 1.05, floor 0.55}
//          materia {EL CABLE saliendo de la estación · y 68%, rot −7°, plano z 150}
//   ── FRONTERA A ·· MATCH-MOVE: la cámara no frena, sigue el vector del cable; detrás ya está el
//                    macro del enchufe. El cable entra por la izquierda con el MISMO ángulo. ·······
// ACTO 2 · g390 → g810 · "NUEVE HORAS DE REFRIGERADOR"    material: CLIP esca2 + LAMINA horas
//   entra  cam {z −47, push 1.14 → 1.00, travel X −180}
//          luz {BONE neutra, key 0.42}   materia {EL CABLE · y 68%, rot −7°, plano z 150}
//   sale   cam {z +45, push 1.02, travel Y +80 · bajando al piso}
//          luz {BONE → VOLT, key 0.52}   materia {LA GOMA NEGRA del cable llenando el cuadro}
//   ── FRONTERA B ·· OCLUSION con V.ink2 (la goma) + su alma de cobre: tapa el 100% seis frames y
//                    detrás ya es de noche. ⛔ no es el color del fondo, es el de LA MATERIA. ······
// ACTO 3 · g810 → g1260 · "EL APAGON DE NOCHE"            material: CLIP esca3 (+ FOTO esca3 al fondo)
//   entra  cam {z +45, push 1.02, travel Y +80 · a ras del piso}
//          luz {VOLT+TORCH, key 0.58, int 0.70, floor 0.78}   materia {el cable alimentando la cocina}
//   sale   cam {z +102, push 1.16 · metida en el display de la estación}
//          luz {TORCH plena, key 0.64}   materia {UNA LINEA VERDE encendida en y 46%, plano z 40}
//   ── FRONTERA C ·· CORTE EN EL BEAT sobre "onda senoidal pura": corte seco · misma altura de línea,
//                    misma escala (el push vale 1.16 de los dos lados) y el mismo verde. ···········
// ACTO 4 · g1260 → g1740 · "ONDA SENOIDAL PURA"           material: CLIP esca4 a sangre + en tarjeta
//   entra  cam {z +102, push 1.16 → 1.00}
//          luz {TORCH → VOLT dura de laboratorio, key 0.34, floor 0.70}   materia {LA LINEA en y 46%}
//   sale   cam {z +135, push 1.04, travel X −30 · abriendo al patio}
//          luz {VOLT → BONE, key 0.46}   materia {la onda limpia APLANADA = una franja horizontal}
//   ── FRONTERA D ·· MATCH-SHAPE: la franja crece en w/h/x/y hasta ser exactamente la tarjeta del
//                    panel (misma `panelGeom(g)`, mismo plano z 40) y el material se revela
//                    ABRIENDO desde esa misma línea. ⛔ no hay opacidad de por medio. ·············
// ACTO 5 · g1740 → g1950 · "ESCALON DOS. SEISCIENTOS CINCUENTA"  material: CLIP esca5 + LAMINA equipoB
//   entra  cam {z +135, push 1.04, travel X −30}
//          luz {BONE, key 0.46}   materia {la franja convirtiéndose en el borde del panel}
//   sale   cam {z +140, push 1.02, travel X −110 · asentada}
//          luz {LUZ DE PRODUCTO NEUTRA en el garaje, key 0.50, int 1.00, floor 0.48}
//          materia {EL PANEL SOLAR PLEGABLE ABIERTO  → lo agarra MovLlave}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero Easing.quint · cero
// ruta por template literal · cero marca ni logo · las láminas SIEMPRE 1588×2246 (0.707 vertical).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamFlash, Kick, Head, Body, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 390, A3 = 810, A4 = 1260, A5 = 1740;
const G_END = 1950;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5 };

// las fronteras
const F_B = 803;          // OCLUSION de la goma (tapa el 100% en g810)
const F_C = A4;           // CORTE EN EL BEAT
const F_D0 = A5 - 56;     // arranque del MATCH-SHAPE (la onda empieza a ser panel)
const F_D1 = A5 + 56;     // fin del MATCH-SHAPE

const EI = Easing.bezier(0.4, 0, 0.24, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── EL MATERIAL REAL (⛔ SOLO los de la ficha, escritos como literal string) ──────────────────
const M = {
  est1V: "broll/cmegenerador/cmeg_mv_esca1.mp4",
  est1F: "img/cmegenerador/cmeg_mv_esca1.jpg",
  cableV: "broll/cmegenerador/cmeg_mv_esca2.mp4",
  nocheV: "broll/cmegenerador/cmeg_mv_esca3.mp4",
  nocheF: "img/cmegenerador/cmeg_mv_esca3.jpg",
  placaV: "broll/cmegenerador/cmeg_mv_esca4.mp4",
  panelV: "broll/cmegenerador/cmeg_mv_esca5.mp4",
  panelF: "img/cmegenerador/cmeg_mv_esca5.jpg",
  lamA: "img/cmegenerador/cmeg_lam_equipoA.jpg",
  lamB: "img/cmegenerador/cmeg_lam_equipoB.jpg",
  lamH: "img/cmegenerador/cmeg_lam_horas.jpg",
  icCongelador: "img/cmegenerador/cmeg_ic_congelador.png",
  icFoco: "img/cmegenerador/cmeg_ic_foco.png",
  icTelefono: "img/cmegenerador/cmeg_ic_telefono.png",
  icBreaker: "img/cmegenerador/cmeg_ic_breaker.png",
  icCalentador: "img/cmegenerador/cmeg_ic_calentador.png",
  icCalendario: "img/cmegenerador/cmeg_ic_calendario.png",
  icEnchufe: "img/cmegenerador/cmeg_ic_enchufe.png",
  icBombilla: "img/cmegenerador/cmeg_ic_bombillanoche.png",
  icRayo: "img/cmegenerador/cmeg_ic_rayo.png",
  icPanel: "img/cmegenerador/cmeg_ic_panelsolar.png",
};

// las láminas son páginas REALES del PDF: 1588×2246 → SIEMPRE esta proporción, nunca estiradas.
const LAM = 2246 / 1588;                       // 1.4144
const altoLam = (w: number) => Math.round(w * LAM);

// ── LA CAMARA · una sola función de gFrame, monótona, que NUNCA vuelve a cero ────────────────
// El rango de z es corto A PROPOSITO: la perspectiva magnifica todo lo que vive lejos del centro y
// las láminas (que son el material del CTA) tienen que seguir enteras en cuadro.
const travelXAt = (g: number) => interpolate(
  g, [0, 300, A2, A2 + 120, A3, A3 + 260, A4, A4 + 260, A5, G_END],
  [0, -28, -180, -142, -118, -50, 38, 78, -30, -110],
  { ...cl, easing: EI },
);
const travelYAt = (g: number) => interpolate(
  g, [0, A2, A2 + 160, A3, A3 + 300, A4, A4 + 300, A5, G_END],
  [0, 14, 46, 80, 62, -22, -40, 10, 34],
  { ...cl, easing: EI },
);
// el push: entra al cable, sale, se apoya en el display en el remate del acto 3 — y ese valor CRUZA
// el corte del beat SIN saltar (vale 1.16 a los dos lados de g1260) — y abre al patio.
const pushAt = (g: number) => interpolate(
  g, [0, 300, A2, A2 + 130, A3 + 120, A4 - 70, A4, A4 + 100, A5 - 40, A5 + 100, G_END],
  [1, 1.05, 1.14, 1.0, 1.02, 1.16, 1.16, 1.0, 1.04, 1.02, 1.02],
  { ...cl, easing: EI },
);
const camAt = (g: number) => {
  const base = gcam(g, { z0: -200, z1: 140, panX: -70, panY: 18, ry: -6, rx: 2, dur: G_END });
  return `${base.transform} translate(${travelXAt(g).toFixed(1)}px, ${travelYAt(g).toFixed(1)}px) scale(${pushAt(g).toFixed(3)})`;
};

// ── LA LUZ · continua, evoluciona por tramos que empalman en los extremos ────────────────────
const tintAt = (g: number) => {
  if (g < A2) return light(clamp01(g / A2), "amber", "bone");
  if (g < A3) return light(clamp01((g - A2) / (A3 - A2)), "bone", "volt");
  if (g < A4) return light(clamp01((g - A3) / (A4 - A3)), "volt", "torch");
  if (g < A5) return light(clamp01((g - A4) / (A5 - A4)), "torch", "volt");
  return light(clamp01((g - A5) / (G_END - A5)), "volt", "bone");
};
const tint2At = (g: number) => {
  if (g < A4) return V.amber;
  if (g < A5) return light(clamp01((g - A4) / (A5 - A4)), "amber", "danger");
  return light(clamp01((g - A5) / (G_END - A5)), "danger", "amber");
};

// ── EL CABLE · la materia que cruza la frontera A (goma ink2 + alma de cobre) ────────────────
const Cable: React.FC<{ x: number; y: number; w: number; rot: number; th?: number; lit?: number; frame: number }> = ({
  x, y, w, rot, th = 26, lit = 1, frame,
}) => {
  const wob = Math.sin(frame / 37 + x) * 1.1;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: th, marginTop: -th / 2,
      transform: `rotate(${(rot + wob).toFixed(2)}deg)`, transformOrigin: "0% 50%",
      borderRadius: th, overflow: "hidden",
      background: `linear-gradient(180deg, ${rgba(V.ink2, 0.55)} 0%, #14170F 34%, #080A05 100%)`,
      boxShadow: `0 ${Math.round(th * 0.5)}px ${Math.round(th * 0.9)}px ${rgba(V.ink0, 0.8)}`,
    }}>
      {/* el brillo de la goma: sin esto se lee como una barra, no como un cable */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: th * 0.16, height: Math.max(2, th * 0.16),
        borderRadius: th,
        background: `linear-gradient(90deg, ${rgba(V.white, 0)} 0%, ${rgba(V.white, 0.26 * lit)} 22%, ${rgba(V.white, 0.10 * lit)} 78%, ${rgba(V.white, 0)} 100%)`,
      }} />
      {/* el alma de cobre asomando en la punta */}
      <div style={{
        position: "absolute", right: 0, top: th * 0.34, width: th * 1.5, height: Math.max(3, th * 0.3),
        background: `linear-gradient(90deg, ${rgba(V.copper, 0)} 0%, ${rgba(V.copper, 0.92)} 70%, ${rgba(V.copper, 0.5)} 100%)`,
        boxShadow: `0 0 14px ${rgba(V.copper, 0.5)}`,
      }} />
    </div>
  );
};

// ── LAS ONDAS · esto SI es un gráfico (mide algo), por eso va en vector ──────────────────────
const sinePath = (w: number, h: number, amp: number, phase: number, cycles: number) => {
  const N = 168;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = t * w;
    const y = h / 2 - Math.sin((t * cycles + phase) * Math.PI * 2) * amp;
    d += (i === 0 ? "M " : " L ") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
};
// la ONDA MODIFICADA: escalones con SOBRETIRO en cada flanco. Ese pico es lo que zumba y quema.
const modPath = (w: number, h: number, amp: number, phase: number, cycles: number, over: number) => {
  const N = 260;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = t * w;
    const u = (t * cycles + phase) % 1;
    const s = u < 0.36 ? 1 : u < 0.5 ? 0 : u < 0.86 ? -1 : 0;
    let y = h / 2 - s * amp;
    if (u < 0.035) y -= over * amp * (1 - u / 0.035);
    if (u > 0.5 && u < 0.535) y += over * amp * (1 - (u - 0.5) / 0.035);
    d += (i === 0 ? "M " : " L ") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
};

// ── LA GEOMETRIA DEL MATCH-SHAPE · la comparten el acto 4 y el acto 5, por eso empalma al frame ──
const panelGeom = (g: number) => {
  const t = clamp01((g - F_D0) / (F_D1 - F_D0));
  return {
    t,
    w: eio(1180, 900, t),
    h: eio(96, 530, t),
    x: eio(50, 45.5, t),
    y: eio(46, 51, t),
    rot: eio(0, -1.6, t),
  };
};

// ── el reloj que corre (sin padStart: `lib` es es2015) ───────────────────────────────────────
const dos = (n: number) => (n < 10 ? "0" + n : "" + n);
const reloj = (minutos: number) => {
  const total = Math.max(0, Math.floor(minutos));
  return dos(Math.floor(total / 60) % 24) + ":" + dos(total % 60);
};

// ── rótulo de detalle (F_BODY, 30 px, con sombra fuerte sobre el negro) ──────────────────────
const Rot: React.FC<{ x: number; y: number; texto: string; color?: string; p: number }> = ({
  x, y, texto, color = V.bone, p,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,0)",
    opacity: p, whiteSpace: "nowrap",
    fontFamily: F_BODY, fontWeight: 600, fontSize: 30, letterSpacing: 0.6, color,
    textShadow: "0 3px 16px rgba(0,0,0,0.95)",
  }}>{texto}</div>
);

// el tachado: gráfico puro, mide una negación
const Tacha: React.FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: 5, marginLeft: -w / 2,
    transform: `rotate(-24deg) scaleX(${p.toFixed(3)})`, transformOrigin: "50% 50%",
    background: rgba(V.danger, 0.95), boxShadow: `0 0 18px ${rgba(V.danger, 0.7)}`,
  }} />
);

export const MovEscalones: React.FC<{ acto: number; gFrame: number }> = ({ acto: actoIn, gFrame }) => {
  const cf = useCurrentFrame();
  const g = Math.max(0, Math.min(G_END, gFrame));
  // Igual que en MovPapel: el build monta el movimiento entero en UNA <Sequence> con acto={0}
  // (asi useCurrentFrame() no se reinicia en las fronteras). Con acto=0, el acto sale de g.
  const acto = actoIn > 0 ? actoIn : (g >= A5 ? 5 : g >= A4 ? 4 : g >= A3 ? 3 : g >= A2 ? 2 : 1);
  const f = g - (START[acto] ?? 0);            // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toG = (t: number) => cf + (t - g);     // un frame GLOBAL mío → el reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(g, [0, A2, A3, A3 + 300, A4, A4 + 300, A5, G_END],
    [0.30, 0.42, 0.58, 0.64, 0.34, 0.30, 0.46, 0.50], { ...cl, easing: EI });
  const inten = interpolate(g, [0, A2, A3, A3 + 200, A4, A4 + 200, A5, G_END],
    [0.95, 1.05, 0.70, 0.66, 1.10, 1.02, 1.00, 1.00], { ...cl, easing: EI });
  const floorDim = interpolate(g, [0, A2, A3, A4, A5, G_END],
    [0.52, 0.55, 0.78, 0.70, 0.52, 0.48], { ...cl, easing: EI });
  const cam = camAt(g);

  // el MATCH-SHAPE lo comparten los dos últimos actos: misma función, mismo frame, mismo plano z40
  const P = panelGeom(g);

  // la capa de lectura respira un 7% del recorrido de la cámara (nada queda muerto, y no se sale)
  const readShift = `translate(${(travelXAt(g) * 0.07).toFixed(1)}px, ${(travelYAt(g) * 0.07).toFixed(1)}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ══ LA ATMOSFERA: se monta UNA sola vez, jamás se remonta entre actos ══════════════ */}
      <VoltAtmos tint={tintAt(g)} tint2={tint2At(g)} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      {/* ══ EL MUNDO 3D ═══════════════════════════════════════════════════════════════════ */}
      <Layers cam={cam}>
        {/* ═══ ACTO 1 · g0-390 · la hoja de la guía se corre y aparece la estación de 200 ══════ */}
        {acto === 1 && (() => {
          // la lámina viene de MovTresNumeros: grande, centrada, con luz de mesa cálida.
          const salida = clamp01((f - 18) / 76);                 // se corre a la derecha y se achica
          const lw = eio(520, 286, salida);
          const lx = eio(50, 80, salida);
          const ly = eio(50, 61, salida);
          // la estación sube desde el piso de la cocina
          const sube = clamp01((f - 26) / 62);
          const cableP = clamp01((f - 288) / 78);                // el cable sale de su costado
          return (
            <>
              <Plane z={-760}><PhotoPlane src={M.est1F} kind="photo" z={0} scale={1.34} dim={0.70} tint={V.amber} /></Plane>
              <Plane z={-320}><PadPlane y={86} w={1500} h={300} rx={64} lit={0.55} z={0} /></Plane>

              {/* EL PROTAGONISTA: la estación chica de 600 Wh sobre el piso de la cocina */}
              <Plane z={0}>
                <MediaCard src={M.est1V} kind="video" w={900} h={506} x={41} y={eio(122, 53, sube)}
                  z={eio(-90, 60, sube)} ry={eio(-21, -6, sube)} rx={eio(9, 1.6, sube)} startFrom={8}
                  lit={1} litColor={V.volt} sheenAt={toG(38)} radius={12} label="ESTACION DE 600 Wh" />
              </Plane>

              {/* EL CABLE: la materia que va a cruzar la frontera A */}
              <Plane z={150}>
                {cableP > 0 && <Cable x={58} y={68} w={eio(120, 980, cableP)} rot={-7} th={26} lit={1} frame={cf} />}
              </Plane>

              {/* la LAMINA = página real de la guía, apoyada como papel de verdad */}
              <Plane z={150}>
                <MediaCard src={M.lamA} kind="photo" w={lw} h={altoLam(lw)} x={lx} y={ly} z={0}
                  ry={eio(-4, -15, salida)} rx={2} rot={eio(-1.2, 2.4, salida)}
                  lit={eio(1, 0.74, salida)} litColor={V.amber} sheenAt={toG(10)} radius={8} label="EQUIPO A" />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · g390-810 · el cable llega al refrigerador · nueve horas ═══════════════ */}
        {acto === 2 && (() => {
          const llega = clamp01(f / 40);
          const tabla = clamp01((f - 96) / 30);
          const gomaP = clamp01((g - (F_B - 34)) / 34);          // la goma se acerca: la frontera B
          const lw = 270;
          return (
            <>
              <Plane z={-760}><PhotoPlane src={M.est1F} kind="photo" z={0} scale={1.22} dim={0.76} tint={V.volt} /></Plane>
              <Plane z={-320}><PadPlane y={88} w={1560} h={300} rx={64} lit={0.42} z={0} /></Plane>

              {/* EL PROTAGONISTA: el macro real del enchufe del refrigerador entrando al alargue */}
              <Plane z={0}>
                <MediaCard src={M.cableV} kind="video" w={1060} h={596} x={eio(56, 46, llega)} y={44}
                  z={eio(-140, 40, llega)} ry={eio(-14, -3, llega)} rx={eio(6, 1.2, llega)} startFrom={6}
                  lit={1} litColor={V.volt} sheenAt={toG(A2 + 30)} radius={12} label="SE ENCHUFA A LA ESTACION" />
              </Plane>

              {/* el MISMO cable de la frontera A: entra por la izquierda con el mismo ángulo y altura */}
              <Plane z={150}>
                <Cable x={-8} y={68} w={eio(980, 640, llega)} rot={-7} th={eio(26, 30, llega)} lit={1} frame={cf} />
                {/* y en el remate se acerca a cámara hasta llenar el cuadro: ahí ocluye */}
                {gomaP > 0 && (
                  <Cable x={-30} y={eio(68, 52, gomaP)} w={2400} rot={eio(-7, -10, gomaP)}
                    th={eio(30, 240, gomaP)} lit={0.9} frame={cf} />
                )}
              </Plane>

              {/* la LAMINA de horas: página real de la guía, vertical */}
              <Plane z={150}>
                {tabla > 0 && (
                  <MediaCard src={M.lamH} kind="photo" w={lw} h={altoLam(lw)} x={eio(96, 80, tabla)} y={60} z={0}
                    ry={-13} rx={2} rot={1.8} lit={0.9} litColor={V.volt} sheenAt={toG(A2 + 120)} radius={8}
                    label="CUANTAS HORAS" opacity={tabla} />
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · g810-1260 · el apagón de noche ════════════════════════════════════════ */}
        {acto === 3 && (() => {
          const abre = clamp01(f / 34);
          // LA LINEA VERDE del display: la materia que cruza el corte del beat (misma altura, y 46%)
          const linea = clamp01((f - 372) / 76);
          const lw = eio(240, 1180, linea);
          return (
            <>
              <Plane z={-760}><PhotoPlane src={M.nocheF} kind="photo" z={0} scale={1.30} dim={0.64} tint={V.torch} /></Plane>
              <Plane z={-320}><PadPlane y={90} w={1620} h={300} rx={64} lit={0.30} z={0} /></Plane>

              {/* EL PROTAGONISTA: la cocina a oscuras con la estación encendida y todo andando */}
              <Plane z={0}>
                <MediaCard src={M.nocheV} kind="video" w={1180} h={664} x={48} y={eio(53, 47, abre)}
                  z={eio(-120, 40, abre)} ry={eio(-11, -2.5, abre)} rx={eio(5, 1, abre)} startFrom={10}
                  lit={0.95} litColor={V.torch} sheenAt={toG(A3 + 34)} radius={12} label="TODO SIGUE ANDANDO" />
              </Plane>

              {/* el cable sigue ahí, ahora apenas lamido por la linterna */}
              <Plane z={150}>
                <Cable x={-6} y={74} w={720} rot={-6} th={26} lit={0.45} frame={cf} />
              </Plane>

              {/* LA LINEA VERDE en y 46%, plano z40: es el eje de la onda del acto 4 */}
              {linea > 0 && (
                <Plane z={40}>
                  <div style={{
                    position: "absolute", left: "50%", top: "46%", width: lw, height: 5,
                    marginLeft: -lw / 2, marginTop: -2.5,
                    background: `linear-gradient(90deg, ${rgba(V.volt, 0)} 0%, ${rgba(V.volt, 0.95)} 14%, ${rgba(V.volt, 0.95)} 86%, ${rgba(V.volt, 0)} 100%)`,
                    boxShadow: `0 0 ${Math.round(18 + 34 * linea)}px ${rgba(V.volt, 0.8 * linea)}`,
                    opacity: 0.35 + 0.65 * linea,
                  }} />
                </Plane>
              )}
            </>
          );
        })()}

        {/* ═══ ACTO 4 · g1260-1740 · onda senoidal pura contra onda modificada ════════════════ */}
        {acto === 4 && (() => {
          const drawA = clamp01((f - 8) / 46);                    // se dibuja la limpia
          const drawB = clamp01((f - 150) / 46);                  // baja la modificada (g1410+)
          const quema = clamp01((f - 266) / 30);                  // g1526: zumba, calienta, quema
          const fase = f / 64;
          const aplana = clamp01((g - F_D0) / (A5 - F_D0));       // la limpia se aplana hacia el panel
          const ampA = lerp(74, 2, aplana);
          const ampB = lerp(62, 0, clamp01((g - (F_D0 - 40)) / 60));
          const WW = 1180, HH = 220;
          return (
            <>
              {/* el MACRO REAL de la placa, a sangre, detrás del gráfico */}
              <Plane z={-760}><PhotoPlane src={M.placaV} kind="video" z={0} scale={1.24} dim={0.62} tint={V.volt} startFrom={4} /></Plane>
              <Plane z={-320}><PadPlane y={92} w={1680} h={300} rx={64} lit={0.26} z={0} /></Plane>

              {/* LA ONDA LIMPIA — hereda la línea verde del acto 3 en y 46% y el mismo plano z40 */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: `${P.x}%`, top: `${P.y}%`, width: P.w, height: HH,
                  marginLeft: -P.w / 2, marginTop: -HH / 2,
                }}>
                  <svg width={P.w} height={HH} viewBox={`0 0 ${WW} ${HH}`} preserveAspectRatio="none"
                    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <line x1={0} y1={HH / 2} x2={WW} y2={HH / 2} stroke={rgba(V.white, 0.2)} strokeWidth={2} />
                    <path d={sinePath(WW, HH, ampA, fase, 3.2)} fill="none" stroke={V.volt} strokeWidth={7}
                      strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
                      strokeDashoffset={1 - drawA}
                      style={{ filter: `drop-shadow(0 0 ${Math.round(14 + 16 * drawA)}px ${rgba(V.volt, 0.75)})` }} />
                  </svg>
                  {/* el rótulo va DENTRO del gráfico: viaja con él y nunca se despega */}
                  <div style={{
                    position: "absolute", left: 4, top: -34, opacity: drawA,
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.4,
                    color: V.volt, textTransform: "uppercase", textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                  }}>LIMPIA</div>
                </div>
              </Plane>

              {/* LA ONDA MODIFICADA, enfrentada abajo — con su sobretiro */}
              {drawB > 0 && (
                <Plane z={40}>
                  <div style={{
                    position: "absolute", left: "50%", top: "71%", width: WW, height: HH,
                    marginLeft: -WW / 2, marginTop: -HH / 2, opacity: drawB,
                  }}>
                    <svg width={WW} height={HH} viewBox={`0 0 ${WW} ${HH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                      <line x1={0} y1={HH / 2} x2={WW} y2={HH / 2} stroke={rgba(V.white, 0.18)} strokeWidth={2} />
                      <path d={modPath(WW, HH, ampB, fase, 3.2, 0.22 + 0.5 * quema)} fill="none"
                        stroke={light(quema, "bone", "danger")} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
                        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawB}
                        style={{ filter: `drop-shadow(0 0 ${Math.round(10 + 26 * quema)}px ${rgba(V.danger, 0.3 + 0.5 * quema)})` }} />
                    </svg>
                    <div style={{
                      position: "absolute", left: 4, top: -34,
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.4,
                      color: light(quema, "bone", "danger"), textTransform: "uppercase",
                      textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                    }}>MODIFICADA</div>
                  </div>
                </Plane>
              )}

              {/* el macro de la placa TAMBIEN dentro de vidrio: material real, no sólo el gráfico */}
              <Plane z={40}>
                <MediaCard src={M.placaV} kind="video" w={430} h={248} x={73} y={26} z={0} ry={-13} rx={3}
                  startFrom={22} lit={0.6 + 0.4 * quema} litColor={light(quema, "volt", "danger")}
                  sheenAt={toG(A4 + 40)} radius={10} label="LA PLACA POR DENTRO" />
              </Plane>

              {/* el remate: la onda YA APLANADA es la franja que se vuelve el panel */}
              {P.t > 0 && (
                <Plane z={40}>
                  <div style={{
                    position: "absolute", left: `${P.x}%`, top: `${P.y}%`, width: P.w, height: P.h,
                    marginLeft: -P.w / 2, marginTop: -P.h / 2, transform: `rotate(${P.rot}deg)`,
                    borderRadius: 12, border: `2px solid ${rgba(V.volt, 0.5 * P.t)}`,
                    boxShadow: `0 0 ${Math.round(24 * P.t)}px ${rgba(V.volt, 0.35 * P.t)}`,
                  }} />
                </Plane>
              )}
            </>
          );
        })()}

        {/* ═══ ACTO 5 · g1740-1950 · escalón dos: la estación grande y el panel abierto ═══════ */}
        {acto === 5 && (() => {
          // el MATCH-SHAPE: el material se revela ABRIENDO desde la línea de la onda (⛔ no es un fade)
          const rev = clamp01((g - A5) / 46);
          const halfPct = ((P.h / 2) / 1080) * 100;
          const band = halfPct * rev;
          const top = Math.max(0, P.y - band);
          const bot = Math.max(0, 100 - (P.y + band));
          const lam = clamp01((f - 62) / 28);
          const lw = 270;
          return (
            <>
              <Plane z={-760}><PhotoPlane src={M.panelF} kind="photo" z={0} scale={1.26} dim={0.56} tint={V.bone} /></Plane>
              <Plane z={-320}><PadPlane y={88} w={1560} h={300} rx={64} lit={0.5} z={0} /></Plane>

              {/* EL PROTAGONISTA: el panel plegable abierto, con la geometría EXACTA que dejó la onda */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                  clipPath: `inset(${top.toFixed(2)}% 0% ${bot.toFixed(2)}% 0%)`,
                }}>
                  <MediaCard src={M.panelV} kind="video" w={P.w} h={P.h} x={P.x} y={P.y} z={0}
                    ry={-3} rx={1} rot={P.rot} startFrom={6} lit={1} litColor={V.bone}
                    sheenAt={toG(A5 + 54)} radius={12} label="PANEL PLEGABLE ABIERTO" />
                </div>
                {/* el trazo de la onda que todavía vive como borde superior del panel */}
                <div style={{
                  position: "absolute", left: `${P.x}%`, top: `${(P.y - (P.h / 2 / 1080) * 100).toFixed(2)}%`,
                  width: P.w, height: 4, marginLeft: -P.w / 2, transform: `rotate(${P.rot}deg)`,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0)} 0%, ${rgba(V.volt, 0.9)} 16%, ${rgba(V.volt, 0.9)} 84%, ${rgba(V.volt, 0)} 100%)`,
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.6)}`,
                  opacity: clamp01(1 - (g - A5) / 70),
                }} />
              </Plane>

              {/* la LAMINA equipo B: la página real de la guía con la lista y sus precios */}
              <Plane z={150}>
                {lam > 0 && (
                  <MediaCard src={M.lamB} kind="photo" w={lw} h={altoLam(lw)} x={eio(97, 78, lam)} y={54} z={0}
                    ry={-14} rx={2} rot={2} lit={0.92} litColor={V.amber} sheenAt={toG(A5 + 96)} radius={8}
                    label="EQUIPO B" opacity={lam} />
                )}
              </Plane>

              {/* polvo del patio delante de todo: el plano más cercano (hold vivo) */}
              <Plane z={260}>
                {Array.from({ length: 12 }, (_, i) => {
                  const sp = 0.3 + rnd(i * 4.7) * 0.7;
                  const yy = ((rnd(i * 8.3) * 120 - (cf * sp) / 14) % 120 + 120) % 120;
                  const d = 3 + rnd(i * 6.1) * 3;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${(20 + rnd(i * 2.9) * 60).toFixed(2)}%`, top: `${(yy - 10).toFixed(2)}%`,
                      width: d, height: d, borderRadius: "50%",
                      background: rgba(V.bone, 0.10 + rnd(i * 3.7) * 0.14),
                    }} />
                  );
                })}
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* ══ LA CAPA DE LECTURA · fuera del mundo 3D: safe area exacta, legibilidad garantizada ══ */}
      <AbsoluteFill style={{ transform: readShift, pointerEvents: "none" }}>
        {/* ── ACTO 1: el precio + qué mueve ─────────────────────────────────────────────── */}
        {acto === 1 && (() => {
          const p = clamp01((f - 40) / 18);
          const nueve = clamp01((f - 213) / 22);
          const seis = clamp01((f - 317) / 20);
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", bottom: "13%", opacity: p, transform: `translateY(${((1 - p) * 26).toFixed(1)}px)` }}>
                <Bed pad={30}>
                  <Kick color={V.volt}>ESCALON UNO</Kick>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 88, color: V.white, lineHeight: 0.9 }}>$</div>
                    <Num size={164} color={V.white}>200</Num>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Body size={32}>600 Wh · onda senoidal pura · dos alargues</Body>
                  </div>
                </Bed>
              </div>
              {/* la data sobre el objeto: qué mueve */}
              {nueve > 0 && seis <= 0 && (
                <>
                  <IconPng src={M.icCongelador} x={79} y={16} size={96} z={0} opacity={0.92 * nueve} glow={V.ink0} />
                  <Readout value="9" unit="h" label="SOLO EL REFRIGERADOR" at={toG(213)} x={79} y={34} size={152} color={V.volt} />
                </>
              )}
              {seis > 0 && (
                <>
                  <IconPng src={M.icCongelador} x={79} y={11} size={66} z={0} opacity={0.8} glow={V.ink0} />
                  <Readout value="9" unit="h" at={toG(213)} x={79} y={22} size={92} color={V.volt} />
                  <Rot x={79} y={26} texto="solo el refrigerador" color={rgba(V.bone, 0.8)} p={1} />
                  <IconPng src={M.icFoco} x={74} y={35} size={60} z={0} opacity={0.9 * seis} glow={V.ink0} />
                  <IconPng src={M.icTelefono} x={84} y={35} size={60} z={0} opacity={0.9 * seis} glow={V.ink0} />
                  <Readout value="6" unit="h" label="+ LUCES Y TELEFONOS" at={toG(317)} x={79} y={49} size={152} color={V.amber} />
                </>
              )}
            </>
          );
        })()}

        {/* ── ACTO 2: nueve horas + el ciclo del compresor + sin tocar el tablero ────────── */}
        {acto === 2 && (() => {
          const p = clamp01((f - 44) / 26);
          const noTablero = clamp01((f - 178) / 24);             // g434: "no toca tu tablero"
          const mins = interpolate(f, [30, 400], [0, 540], cl);
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", bottom: "17%", opacity: p, transform: `translateY(${((1 - p) * 22).toFixed(1)}px)` }}>
                <Bed pad={28} w={700}>
                  <Kick color={V.volt}>QUE MUEVE</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={72}>NUEVE HORAS<br />DE REFRIGERADOR</Head>
                  </div>
                </Bed>
              </div>
              <Readout value={reloj(mins)} label="CORRIDO EN LA ESTACION" at={toG(A2 + 30)} x={21} y={19} size={150} color={V.volt} />
              {/* el compresor NO anda todo el tiempo: ocho celdas de cada treinta */}
              <div style={{ opacity: 0.9 * p }}>
                <DutyField duty={8 / 30} cells={30} on={p} tint={V.volt} y={85} w={1180} h={38} cycle={150} />
              </div>
              <Rot x={50} y={88.5} texto="el compresor arranca 8 minutos de cada 30" color={rgba(V.bone, 0.82)} p={p} />
              {noTablero > 0 && (
                <>
                  <IconPng src={M.icBreaker} x={80} y={14} size={96} z={0} opacity={0.88 * noTablero} glow={V.ink0} />
                  <Tacha x={80} y={21} w={124} p={noTablero} />
                  <Rot x={80} y={26} texto="SIN TOCAR EL TABLERO" p={noTablero} />
                </>
              )}
            </>
          );
        })()}

        {/* ── ACTO 3: el reloj del apagón + lo que NO hace ───────────────────────────────── */}
        {acto === 3 && (() => {
          const p = clamp01((f - 24) / 20);
          const duro = clamp01((f - 212) / 22);                  // g1022: el apagón más común
          const noHace = clamp01((f - 382) / 26);                // g1192: lo que no hace
          const mins = interpolate(f, [50, 250], [19 * 60, 26 * 60], cl);
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", bottom: "17%", opacity: p, transform: `translateY(${((1 - p) * 24).toFixed(1)}px)` }}>
                <Bed pad={28} w={620}>
                  <Kick color={V.torch}>PARA QUE SIRVE DE VERDAD</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={80}>EL APAGON<br />DE NOCHE</Head>
                  </div>
                </Bed>
              </div>
              <IconPng src={M.icBombilla} x={79} y={10} size={80} z={0} opacity={0.8 * p} glow={V.ink0} />
              <Readout value={reloj(mins)} label="SE CORTO A LAS 19:00" at={toG(A3 + 40)} x={79} y={26} size={150} color={V.torch} />
              {duro > 0 && (
                <Readout value="7" unit="h" label="Y NO SE ECHO A PERDER NADA" at={toG(A3 + 212)} x={79} y={44} size={132} color={V.volt} />
              )}
              {noHace > 0 && (
                <>
                  <Rot x={50} y={66} texto="LO QUE NO HACE" color={rgba(V.danger, 0.95)} p={noHace} />
                  {[
                    { ic: M.icCalendario, t: "ni un dia entero", x: 25 },
                    { ic: M.icCalentador, t: "ni la caldera", x: 50 },
                    { ic: M.icEnchufe, t: "se enchufa a mano", x: 75 },
                  ].map((it, i) => {
                    const q = clamp01((f - 382 - i * 22) / 20);
                    return (
                      <div key={it.t}>
                        <IconPng src={it.ic} x={it.x} y={72} size={74} z={0} opacity={0.86 * q} glow={V.ink0} />
                        <Tacha x={it.x} y={77} w={100} p={q} />
                        <Rot x={it.x} y={82} texto={it.t} p={q} />
                      </div>
                    );
                  })}
                </>
              )}
            </>
          );
        })()}

        {/* ── ACTO 4: la palabra que hay que mirar ───────────────────────────────────────── */}
        {acto === 4 && (() => {
          const p = clamp01((f - 16) / 20);
          const quema = clamp01((f - 266) / 30);
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", bottom: "12%", opacity: p, transform: `translateY(${((1 - p) * 24).toFixed(1)}px)` }}>
                <Bed pad={28} w={680}>
                  <Kick color={V.volt}>OJO CON ESTA PALABRA</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={80}>ONDA SENOIDAL<br />PURA</Head>
                  </div>
                  {quema > 0 && (
                    <div style={{ marginTop: 14, opacity: quema }}>
                      <Body size={34} color={V.bone}>La modificada zumba, calienta y quema la placa.</Body>
                    </div>
                  )}
                </Bed>
              </div>
              {quema > 0 && <IconPng src={M.icRayo} x={73} y={40} size={78} z={0} opacity={0.9 * quema} glow={V.danger} />}
            </>
          );
        })()}

        {/* ── ACTO 5: el precio del escalón dos + la advertencia ─────────────────────────── */}
        {acto === 5 && (() => {
          const p = clamp01((f - 30) / 22);
          const nunca = clamp01((f - 97) / 24);                  // g1837
          return (
            <>
              <div style={{ position: "absolute", left: "6.5%", bottom: "14%", opacity: p, transform: `translateY(${((1 - p) * 26).toFixed(1)}px)` }}>
                <Bed pad={30}>
                  <Kick color={V.amber}>ESCALON DOS</Kick>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 88, color: V.white, lineHeight: 0.9 }}>$</div>
                    <Num size={164} color={V.white}>650</Num>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Body size={32}>Estación grande + panel solar plegable</Body>
                  </div>
                </Bed>
              </div>
              <IconPng src={M.icPanel} x={16} y={16} size={88} z={0} opacity={0.85 * p} glow={V.ink0} />
              {nunca > 0 && (
                <div style={{
                  position: "absolute", right: "6.5%", bottom: "13%", opacity: nunca,
                  transform: `translateY(${((1 - nunca) * 18).toFixed(1)}px)`,
                  padding: "14px 22px", borderRadius: 10, background: rgba(V.ink0, 0.88),
                  borderLeft: `5px solid ${rgba(V.danger, 0.95)}`, boxShadow: `0 18px 50px ${rgba(V.ink0, 0.7)}`,
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 2.2,
                    color: V.danger, textTransform: "uppercase", textShadow: "0 4px 18px rgba(0,0,0,0.95)",
                  }}>NUNCA UN COMPRESOR EN ONDA MODIFICADA</div>
                </div>
              )}
            </>
          );
        })()}
      </AbsoluteFill>

      {/* ══ LAS COSTURAS · viven FUERA del switch de actos para cruzar la frontera enteras ══ */}

      {/* FRONTERA B (g810) · OCLUSION con la GOMA del cable (V.ink2) ⛔ nunca el color del fondo */}
      <SeamOcclude at={toG(F_B)} dur={14} color={V.ink2} angle={-10} />
      {(() => {
        const p = clamp01((g - F_B) / 14);
        if (p <= 0 || p >= 1) return null;
        // el alma de cobre viajando dentro de la goma: sin esto la oclusión se lee como una barra
        return (
          <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: `${lerp(46, 54, p).toFixed(1)}%`, left: `${lerp(-180, 180, p).toFixed(1)}%`,
              width: "320%", height: 10, transform: "rotate(-10deg)",
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.copper, 0.85)} 22%, ${rgba(V.copper, 0.85)} 78%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 26px ${rgba(V.copper, 0.5)}`,
            }} />
          </AbsoluteFill>
        );
      })()}

      {/* FRONTERA C (g1260) · CORTE EN EL BEAT sobre "onda senoidal pura" + acento óptico de 4 frames */}
      <SeamFlash at={toG(F_C)} color={V.volt} dur={4} />
    </AbsoluteFill>
  );
};
