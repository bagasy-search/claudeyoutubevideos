// MovS3Ernesto.tsx — MOVIMIENTO S3 · "ERNESTO Y LA PRESIÓN"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 1667 frames @30 = 55,57 s.
// Tramo global 8666 → 10333. Se monta ENCIMA del avatar real de Claudio.
// ⛔ CERO capas de color con opacidad sobre su cara: las ventanas de avatar son GEOMETRÍA
//    (`clip-path`), nunca un fundido.
//
// ── CÓMO ESTÁ CONSTRUIDO ──────────────────────────────────────────────────────────────────────
// 1. EL MUNDO (atmósfera + sol + fondos + el caño de presión) vive DENTRO de un único contenedor
//    recortado por LA APERTURA (`coverAt` → `clipOf`): un polígono en U con el hueco central
//    abierto hacia abajo. Hueco cerrado = el mundo tapa la pantalla. Hueco abierto = el mundo
//    queda SOLO en los tercios laterales y la banda superior, y Claudio se ve LIMPIO en el medio.
//    Las CUATRO ventanas usan cuatro gestos DISTINTOS (y ninguno repite los de MovS1):
//      W1 (118-476)   se abre de un golpe HACIA LA DERECHA (la reja que se corre) y cierra con
//                     la GUILLOTINA: la banda superior baja hasta tapar todo.
//      W2 (596-726)   la banda superior se RETRAE hacia arriba (persiana) y el hueco muere de un
//                     CORTE SECO de UN frame en el beat de "eso está al revés".
//      W3 (1348-1442) IRIS DESCENTRADO: nace angosto pegado a la izquierda y se ensancha hacia la
//                     derecha; cierra con la banda DERECHA barriendo de derecha a izquierda.
//      W4 (1552-1636) apertura EN CRUZ (laterales y banda superior a la vez) y cierre por
//                     convergencia rápida de las dos hojas sobre el centro.
// 2. EL PRIMER PLANO (tarjetas con material real, números, íconos, titulares) NO está recortado.
//    Mientras la apertura esté ABIERTA todo vive en x<29 % o x>71 %: nada entra jamás en la caja
//    de la cara (30-70 % · 10-90 %). Con la apertura cerrada el centro queda liberado.
// 3. UNA sola cámara `camAt(g)`, función pura de g, con deriva viva. Ningún acto la reinicia: el
//    acto 5 hereda la inercia del 4. UNA sola atmósfera montada una vez, luz que EVOLUCIONA.
// 4. LA MATERIA QUE CRUZA: el TOMACORRIENTE. Del frame 740 al 1152 es literalmente EL MISMO
//    objeto (`Tubo`, con la foto real del enchufe adentro): entra como la placa gris de la pared,
//    se estira, se acuesta y se convierte en el CAÑO por el que corre la carga. La cámara le
//    entra por la boca y sale del otro lado ya en el patio.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ENTRA DESDE (fin de la instalación en el patio):
//   cam {ABIERTA, exterior, derivando a la DERECHA, push 1.00}   luz {mediodía 88°, blanco, amb 0.95}
//   materia {EL CABLE que va del microinversor al tomacorriente exterior}
//
// ACTO 1 · 0-515 · "LLEGA ERNESTO"           protagonista: ERNESTO      texto: ME APOSTÓ 10 DÓLARES
//   entra  cam {push 1.00, grúa −16, foco 56/46}          luz {mediodía 88°, amb 0.95, sin rampa}
//          materia {el cable al tomacorriente, en tarjeta, aún en cuadro}
//   sale   cam {push 1.06, grúa +8, foco 50/48}           luz {mediodía 88°, amb 0.90}
//          materia {LA CARA DE ERNESTO viajando hacia la izquierda a velocidad constante}
//   ── FRONTERA A @515 ···· MATCH-MOVE: la cara de Ernesto sale de cuadro hacia la izquierda a
//      −0,62 %/frame y la tarjeta de LOS PANELES entra por la derecha con EXACTAMENTE la misma
//      velocidad, la misma dirección y la misma y. Nada frena, nada arranca de cero. ···········
// ACTO 2 · 515-843 · "ESO ESTÁ AL REVÉS"     protagonista: EL ENCHUFE   texto: POR AHÍ SALE LA LUZ
//   entra  cam {push 1.06, grúa +14, foco 44/50}          luz {mediodía 88° → 86°, amb 0.88}
//          materia {los paneles y el cable, viajando}
//   sale   cam {push 1.12 → 1.02, grúa −4, foco 58/44}    luz {86° → 84°, amb 0.78, frío desde arriba}
//          materia {LA PLACA GRIS DEL TOMACORRIENTE, ya estirándose}
//   ── FRONTERA B @843 ···· MATCH-SHAPE: esa misma placa (la foto real del enchufe exterior
//      adentro de su marco) se acuesta, se alarga y su radio crece hasta ser EL CAÑO del acto 3.
//      Es un objeto que cambia de forma sin soltar el cuadro: no hay corte. ···················
// ACTO 3 · 843-1152 · "UN CABLE NO SABE"     protagonista: EL CAÑO      texto: VA DE MÁS A MENOS
//   entra  cam {push 1.02, grúa +4, foco 50/48}           luz {mediodía 88°, amb 0.86}
//          materia {el caño, con la carga corriendo adentro}
//   sale   cam {push 1.16 → 1.30 entrando en la boca}     luz {88°, amb 0.92, key al centro}
//          materia {LA BOCA DEL CAÑO, abierta hacia la cámara}
//   ── FRONTERA C @1152 ···· ZOOM-THROUGH: la cámara entra por la boca del caño (fx 61/fy 52) y
//      sale del otro lado ya en el patio, en la cajita gris colgada del gancho. El acto 4 se monta
//      20 frames ANTES, debajo: un zoom-through contra nada es un fundido a negro. ············
// ACTO 4 · 1152-1442 · "LA CASA NO PREGUNTA" protagonista: LOS DOS MANÓMETROS  texto: LA CASA NO PREGUNTA
//   entra  cam {saliendo del túnel, push 1.30 → 1.04}     luz {88°, amb 0.90, ámbar desde ABAJO}
//          materia {la cajita gris a la sombra}
//   sale   cam {push 1.08, grúa +4, foco 48/50}           luz {88°, amb 0.84, cálido de interior}
//          materia {LA CHAPA BLANCA de la puerta del refrigerador}
//   ── FRONTERA D @1442 ···· OCLUSIÓN: la puerta esmaltada del refrigerador cruza de derecha a
//      izquierda y tapa el 100 % entre los frames 1441-1446; ahí adentro cambia el acto. El color
//      es el del ESMALTE BLANCO (la materia que cruza), nunca el del fondo. ··················
// ACTO 5 · 1442-1667 · "SOSTÉN LA PINZA"     protagonista: LA PINZA     texto: SOSTÉN LA PINZA
//   entra  cam {push 1.02, grúa −18, foco 50/54}          luz {84°, amb 0.72, interior de cocina}
//          materia {el refrigerador abierto y la carga entrando a él}
//   sale   cam {CERRADO sobre el cable, push 1.30, BAJANDO (grúa −140), foco 50/62}
//          luz {cenital 90°, hueso, amb 1.00}
//          materia {LA PINZA AMARILLA a punto de abrazar el cable de entrada}
//   (costura INTERNA @1533 ···· WIPE POR MATERIA: el polvo seco del patio cruza y detrás ya está
//    la pared con el cable de entrada. Distinta de las cuatro fronteras de acto.)
//
// SALE HACIA (el momento de la pinza, 310 → 40):
//   cam {CERRADO sobre el cable de entrada, bajando hacia la pinza}  luz {cenital 90°, hueso, 1.00}
//   materia {la pinza amarilla a punto de abrazar el cable}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade en ninguna frontera · dos costuras
//    seguidas nunca repiten · toda tarjeta flotante lleva FOTO o CLIP real adentro.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamWipeMatter, zoomThrough, SunKey, HORA, flujo,
  Head, Body, Em, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames locales, 30 fps, anclados al ms de Whisper) ───────────────
const A1 = 0, A2 = 515, A3 = 843, A4 = 1152, A5 = 1442;
const G_END = 1667;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla
const xp = (px: number) => (px / 1920) * 100;   // px horizontales → % de pantalla
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });

// bezier cuadrática en px de la comp 1920×1080 (el camino que hace la corriente)
const qbez = (p: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  const u = 1 - p;
  return { x: u * u * x0 + 2 * u * p * cx + p * p * x1, y: u * u * y0 + 2 * u * p * cy + p * p * y1 };
};

// ── EL MATERIAL REAL. Las rutas van LITERALES en el punto de uso (`MediaCard src="..."`,
//    `PhotoPlane src="..."`, `IconPng src="..."`, `staticFile("...")`): el build escanea este
//    .tsx por TEXTO y una ruta armada por template literal no viaja en el tar → 404 → chunk
//    muerto con un error que miente. Por eso no hay ningún mapa de assets acá arriba.

// ══ LA APERTURA ══════════════════════════════════════════════════════════════════════════════
// gL = borde derecho de la banda IZQUIERDA · gR = borde izquierdo de la banda DERECHA
// sh = altura de la banda SUPERIOR. El hueco (donde se ve Claudio limpio) = (gL..gR) × (sh..100).
type Cover = { gL: number; gR: number; sh: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, sh: 0, open: false };

const coverAt = (g: number): Cover => {
  // W1 · ACTO 1 — se abre HACIA LA DERECHA (la reja) y cierra con la GUILLOTINA superior
  if (g >= 118 && g < 476) {
    const abreR = es(clamp01((g - 118) / 26));      // la derecha primero: el hueco "se corre"
    const abreL = es(clamp01((g - 124) / 46));
    const sh0 = lerp(0, 10, es(clamp01((g - 118) / 28)));
    const cae = esOut(clamp01((g - 440) / 34));     // la banda superior BAJA y tapa
    const sh = lerp(sh0, 100, cae);
    return { gL: lerp(50, 19, abreL), gR: lerp(50, 81, abreR), sh, open: sh < 98.5 };
  }
  // W2 · ACTO 2 — la banda superior se RETRAE hacia arriba; muere de un CORTE SECO en 726
  if (g >= 596 && g < 726) {
    const sube = esOut(clamp01((g - 596) / 44));
    return { gL: 19, gR: 81, sh: lerp(100, 11, sube), open: sube > 0.015 };
  }
  // W3 · ACTO 4 — IRIS DESCENTRADO: angosto a la izquierda, se ensancha a la derecha;
  //   cierra con la banda DERECHA barriendo el cuadro de derecha a izquierda.
  if (g >= 1348 && g < 1442) {
    const abre = es(clamp01((g - 1348) / 40));
    const barre = esOut(clamp01((g - 1418) / 24));
    const gR = lerp(lerp(44, 81, abre), 19, barre);
    return { gL: 19, gR, sh: lerp(0, 10, es(clamp01((g - 1348) / 26))), open: gR - 19 > 1.2 };
  }
  // W4 · ACTO 5 — apertura EN CRUZ (todo a la vez) y cierre por convergencia de las dos hojas
  if (g >= 1552 && g < 1636) {
    const abre = es(clamp01((g - 1552) / 38));
    const junta = esOut(clamp01((g - 1608) / 28));
    const k = Math.min(abre, 1 - junta);
    return { gL: lerp(50, 20, k), gR: lerp(50, 80, k), sh: lerp(100, 8, k), open: k > 0.02 };
  }
  return CERRADO;
};

const clipOf = (c: Cover) =>
  c.open
    ? `polygon(0% 0%, 100% 0%, 100% 100%, ${c.gR.toFixed(2)}% 100%, ` +
      `${c.gR.toFixed(2)}% ${c.sh.toFixed(2)}%, ${c.gL.toFixed(2)}% ${c.sh.toFixed(2)}%, ` +
      `${c.gL.toFixed(2)}% 100%, 0% 100%)`
    : "inset(0px)";

// ── LOS CANTOS DE LA APERTURA. Todo su brillo sale HACIA AFUERA (hacia el mundo): ni un píxel de
//    gradiente se apoya sobre la cara. Es lo que hace que la apertura se lea como dos hojas con el
//    canto lamido por el sol y no como una máscara.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.bone, 0.42 * hot)}, ${rgba(V.white, 0.72 * hot)} 46%, ${rgba(V.bone, 0.3 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 118,
      left: dir === -1 ? -121 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.15 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.15 * hot)}, rgba(0,0,0,0) 48%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`,
    }} />
  </div>
);
const CantoH: React.FC<{ y: number; x0: number; x1: number; hot: number }> = ({ y, x0, x1, hot }) => (
  <div style={{ position: "absolute", left: `${x0}%`, width: `${x1 - x0}%`, top: `${y}%`, height: 0 }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: 3, top: -3,
      background: `linear-gradient(90deg, ${rgba(V.sky, 0.22 * hot)}, ${rgba(V.white, 0.62 * hot)} 50%, ${rgba(V.sky, 0.22 * hot)})`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, height: 92, top: -95,
      background: `linear-gradient(0deg, ${rgba(V.bone, 0.12 * hot)}, rgba(0,0,0,0) 60%), linear-gradient(0deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.58)})`,
    }} />
  </div>
);

// ── FRONTERA D · LA OCLUSIÓN. La puerta esmaltada del refrigerador cruza de derecha a izquierda
//    y tapa el 100 % ~5 frames. Su color es el del ESMALTE BLANCO (la materia), NUNCA el del
//    fondo: con el color del fondo esto es un fundido a negro y se ve. Tiene tirador y canto, así
//    que se lee como una puerta que pasa, no como un flash.
const PuertaOcluye: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 24 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(114, -164, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-22%", left: `${L.toFixed(2)}%`, width: "152%", height: "146%",
        transform: "rotate(-4deg)",
        background:
          `linear-gradient(94deg, ${rgba(V.white, 0.55)} 0%, rgba(255,255,255,0) 2.2%),` +
          `linear-gradient(176deg, ${V.blade} 0%, #D3D3CB 40%, #AFAFA6 78%, #8C8C84 100%)`,
        boxShadow: `0 0 130px ${rgba(V.ink0, 0.92)}`,
      }}>
        {/* el tirador cromado: la puerta tiene espesor y herrajes, no es un rectángulo */}
        <div style={{
          position: "absolute", left: "18%", top: "16%", width: 26, height: "62%", borderRadius: 13,
          background: `linear-gradient(90deg, #6E6E68, ${V.bone} 42%, #9A9A92 100%)`,
          boxShadow: `0 14px 30px ${rgba(V.ink0, 0.7)}`,
        }} />
        {/* la junta de goma del marco */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "8%", height: 8,
          background: rgba(V.ink0, 0.22),
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ── COSTURA INTERNA @1533 · POLVO SECO DEL PATIO que cruza (WIPE POR MATERIA) ─────────────────
const PolvoCruza: React.FC<{ g: number; at: number; dur?: number }> = ({ g, at, dur = 30 }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => {
        const o = rnd(i * 3.9);
        const q = clamp01(p * 1.5 - o * 0.36);
        const x = lerp(-24, 128, esOut(q));
        const y = 4 + o * 88 + Math.sin(q * 3.4 + i) * 7;
        const s = 130 + o * 300;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%`,
            width: s, height: s * 0.72, marginLeft: -s / 2, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(V.concrete, 0.3 * Math.sin(p * Math.PI))}, rgba(0,0,0,0) 70%)`,
            filter: "blur(12px)",
          }} />
        );
      })}
      {/* briznas de pasto seco: la materia tiene grano, no es sólo humo */}
      {Array.from({ length: 14 }, (_, i) => {
        const o = rnd(i * 7.1);
        const q = clamp01(p * 1.62 - o * 0.3);
        return (
          <div key={`b${i}`} style={{
            position: "absolute", left: `${lerp(-14, 122, esOut(q)).toFixed(1)}%`,
            top: `${(6 + o * 86).toFixed(1)}%`, width: 40 + o * 96, height: 2.5,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.amber, 0.42 * Math.sin(p * Math.PI))}, rgba(0,0,0,0))`,
            transform: `rotate(${(-16 + o * 34).toFixed(1)}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ══ LA MATERIA QUE CRUZA LA FRONTERA B ═══════════════════════════════════════════════════════
// UN SOLO objeto del frame 740 al 1152. Nace como la PLACA GRIS del tomacorriente exterior —con
// la FOTO REAL del enchufe adentro, no un vector haciendo de objeto— y se acuesta, se alarga y su
// radio crece hasta ser EL CAÑO por el que corre la carga. El diagrama (brillo del tubo, la carga,
// las bocas) es la capa de apoyo que se enciende ENCIMA del material real, nunca en su lugar.
const tuboAt = (g: number) => {
  const m = es(clamp01((g - 806) / 76));        // la placa se acuesta y se vuelve caño
  const s = es(clamp01((g - 1028) / 58));       // el caño se acorta y baja entre las dos tarjetas
  const w = lerp(lerp(520, 1250, m), 980, s);
  const h = lerp(lerp(306, 182, m), 148, s);
  return {
    cx: lerp(lerp(1206, 960, m), 960, s),
    cy: lerp(lerp(516, 500, m), 566, s),
    w, h,
    rot: lerp(-7, 0, m),
    radius: lerp(16, h / 2, m),
    tube: m,
  };
};

const Tubo: React.FC<{ g: number; fase: number }> = ({ g, fase }) => {
  const t = tuboAt(g);
  const drift = Math.sin(g / 47) * 2.2;
  const bead = Math.max(16, t.h * 0.26);
  return (
    <div style={{
      position: "absolute", left: `${xp(t.cx).toFixed(3)}%`, top: `${pc(t.cy).toFixed(3)}%`,
      width: t.w, height: t.h, marginLeft: -t.w / 2, marginTop: -t.h / 2,
      transform: `rotate(${t.rot.toFixed(2)}deg) translateY(${drift.toFixed(2)}px)`,
      borderRadius: t.radius, overflow: "hidden",
      boxShadow: `0 ${Math.round(t.h * 0.2)}px ${Math.round(t.h * 0.34)}px ${rgba(V.ink0, 0.82)}, ` +
        `0 0 ${Math.round(t.h * 0.5)}px ${rgba(V.volt, 0.16 * t.tube)}`,
      border: `1px solid ${rgba(V.bone, 0.24)}`,
    }}>
      {/* MATERIAL REAL adentro: la foto del tomacorriente exterior de la pared */}
      <Img src={staticFile("img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* grade del canal + oscurecido progresivo: la foto se vuelve el interior del caño */}
      <AbsoluteFill style={{ background: rgba(V.volt, 0.06), mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: rgba(V.ink0, lerp(0.1, 0.62, t.tube)) }} />
      {/* el brillo cilíndrico: lo que hace que un rectángulo se lea como TUBO */}
      <AbsoluteFill style={{
        opacity: t.tube,
        background:
          `linear-gradient(180deg, ${rgba(V.ink0, 0.86)} 0%, ${rgba(V.bone, 0.16)} 24%, ` +
          `rgba(0,0,0,0) 48%, ${rgba(V.ink0, 0.5)} 78%, ${rgba(V.ink0, 0.9)} 100%)`,
      }} />
      {/* LA CARGA corriendo adentro. `fase` es la integral del sentido: si baja, la carga va al revés */}
      {Array.from({ length: 15 }, (_, i) => {
        const u = ((rnd(i * 4.7) + fase * 0.086) % 1 + 1) % 1;
        const yy = 50 + (rnd(i * 9.3) - 0.5) * 26;
        return (
          <div key={i} style={{
            position: "absolute", left: `${(u * 100).toFixed(2)}%`, top: `${yy.toFixed(1)}%`,
            width: bead, height: bead, marginLeft: -bead / 2, marginTop: -bead / 2,
            borderRadius: "50%", opacity: t.tube * (0.5 + 0.5 * Math.sin(u * Math.PI)),
            background: `radial-gradient(circle at 34% 30%, ${rgba(V.volt, 0.98)}, ${rgba(V.voltSoft, 0.42)} 58%, rgba(0,0,0,0) 72%)`,
            boxShadow: `0 0 ${Math.round(bead * 1.1)}px ${rgba(V.volt, 0.6)}`,
          }} />
        );
      })}
      {/* las dos BOCAS del caño: por una entra la presión, por la otra sale */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: Math.round(t.h * 0.36), opacity: t.tube,
        background: `linear-gradient(90deg, ${rgba(V.ink0, 0.95)}, rgba(0,0,0,0))`,
        borderRight: `2px solid ${rgba(V.amber, 0.5)}`,
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: Math.round(t.h * 0.36), opacity: t.tube,
        background: `linear-gradient(270deg, ${rgba(V.ink0, 0.95)}, rgba(0,0,0,0))`,
        borderLeft: `2px solid ${rgba(V.sky, 0.5)}`,
      }} />
      {/* bisel de vidrio (la misma piel que las MediaCard del video) */}
      <AbsoluteFill style={{
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.26)}, inset 0 0 ${Math.round(t.h * 0.3)}px ${rgba(V.ink0, 0.6)}`,
      }} />
    </div>
  );
};

// ── EL MANÓMETRO. Gráfica dibujada, sí — pero SIEMPRE apoyada sobre una tarjeta con material
//    real debajo. Es el instrumento que hace VISIBLE la palabra "presión".
const Manometro: React.FC<{
  x: number; y: number; size?: number; val: number; color: string; label: string; op?: number;
}> = ({ x, y, size = 138, val, color, label, op = 1 }) => {
  const a = lerp(-124, 124, clamp01(val));
  const rad = (a * Math.PI) / 180;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size,
      marginLeft: -size / 2, marginTop: -size / 2, opacity: op,
      filter: `drop-shadow(0 14px 30px ${rgba(V.ink0, 0.85)})`,
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="rgba(8,9,6,0.9)" stroke={rgba(color, 0.8)} strokeWidth="3" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={rgba(V.bone, 0.16)} strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const tt = ((-124 + i * 31) * Math.PI) / 180;
          return (
            <line key={i}
              x1={50 + Math.sin(tt) * 32} y1={50 - Math.cos(tt) * 32}
              x2={50 + Math.sin(tt) * 40} y2={50 - Math.cos(tt) * 40}
              stroke={rgba(V.bone, 0.5)} strokeWidth="2" />
          );
        })}
        <line x1="50" y1="50" x2={50 + Math.sin(rad) * 33} y2={50 - Math.cos(rad) * 33}
          stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="50" cy="50" r="5.5" fill={color} />
      </svg>
      <div style={{
        position: "absolute", left: "50%", top: size + 10, transform: "translateX(-50%)",
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 2.6, color,
        textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
      }}>{label}</div>
    </div>
  );
};

// ── LA CORRIENTE por un camino real (acto 4 y 5). Las cuentas de carga van sobre una bezier: es
//    el MISMO material que corría adentro del caño, ahora suelto en el patio.
const Corriente: React.FC<{
  g: number; at: number; color: string; n?: number; speed?: number; op?: number;
  x0: number; y0: number; cx: number; cy: number; x1: number; y1: number;
}> = ({ g, at, color, n = 9, speed = 0.0105, op = 1, x0, y0, cx, cy, x1, y1 }) => {
  if (g < at) return null;
  const draw = clamp01((g - at) / 34);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={"M " + x0 + " " + y0 + " Q " + cx + " " + cy + " " + x1 + " " + y1}
          fill="none" stroke={rgba(color, 0.28)} strokeWidth={5} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 16px ${rgba(color, 0.5)})` }} />
      </svg>
      {Array.from({ length: n }, (_, i) => {
        const u = ((rnd(i * 5.9) + (g - at) * speed) % 1 + 1) % 1;
        if (u > draw) return null;
        const p = qbez(u, x0, y0, cx, cy, x1, y1);
        const s = 20 + rnd(i * 2.7) * 15;
        return (
          <div key={i} style={{
            position: "absolute", left: `${xp(p.x).toFixed(2)}%`, top: `${pc(p.y).toFixed(2)}%`,
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            opacity: 0.32 + 0.68 * Math.sin(u * Math.PI),
            background: `radial-gradient(circle at 34% 30%, ${rgba(color, 0.98)}, ${rgba(color, 0.36)} 58%, rgba(0,0,0,0) 72%)`,
            boxShadow: `0 0 ${Math.round(s * 1.1)}px ${rgba(color, 0.66)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── la cifra que VIAJA (Readout salta en su sitio; esto se mueve con el objeto) ───────────────
const Ticker: React.FC<{
  text: string; x: number; y: number; size: number; color: string; opacity?: number; unit?: string;
}> = ({ text, x, y, size, color, opacity = 1, unit }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, opacity,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
  }}>
    {text}
    {unit && <span style={{ fontSize: Math.round(size * 0.34), marginLeft: 9, color: rgba(color, 0.84) }}>{unit}</span>}
  </div>
);

// ── rótulo de escena (detalle ≥30 px, sombra dura obligatoria sobre el negro) ─────────────────
const Rotulo: React.FC<{
  children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number;
}> = ({ children, x, y, color = V.bone, size = 31, op = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// ── LA CÁMARA · una sola función de g. Entra ABIERTA derivando a la derecha y aterriza CERRADA
//    bajando sobre el cable. Ningún acto la reinicia.
const camAt = (g: number) => {
  const base = gcam(g, { z0: 30, z1: 500, panX: -152, panY: 22, ry: -4.2, rx: 1.6, dur: G_END });
  const crane = interpolate(
    g,
    [A1, 190, A2, 700, A3, 1000, 1128, A4, 1300, A5, 1500, 1560, 1616, G_END],
    [-16, 2, 14, -4, 4, 18, 26, -8, 4, -18, -26, -46, -84, -140],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g,
    [A1, 190, A2, 700, 740, A3, 1000, 1128, A4, 1300, 1400, A5, 1500, 1560, 1616, G_END],
    [1.0, 1.06, 1.06, 1.12, 1.02, 1.02, 1.08, 1.16, 1.30, 1.04, 1.08, 1.02, 1.06, 1.04, 1.10, 1.30],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const fx = interpolate(g, [A1, A2, 740, A3, 1100, A4, 1300, A5, 1560, G_END],
    [56, 44, 58, 50, 61, 42, 48, 50, 48, 50], CL);
  const fy = interpolate(g, [A1, A2, 740, A3, 1100, A4, 1300, A5, 1560, G_END],
    [46, 50, 44, 48, 52, 46, 50, 54, 56, 62], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS3Ernesto: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;      // pasa un frame mío al reloj interno de las primitivas

  // ── LA LUZ: función continua de g. Entra en `mediodia` (88°, blanco, amb 0.95) sin rampa —
  //    hereda la del vecino— y sale en `cenital` (90°, hueso, amb 1.00). Nunca salta.
  const sunAng = interpolate(
    g, [A1, 300, A2, 740, A3, 1030, A4, 1300, A5, 1500, 1560, 1616, G_END],
    [HORA.mediodia.ang, HORA.mediodia.ang, 86, 84, HORA.mediodia.ang, HORA.mediodia.ang,
      HORA.mediodia.ang, HORA.mediodia.ang, 84, 82, 86, HORA.mediodia.ang, HORA.cenital.ang], CL,
  );
  const amb = interpolate(
    g, [A1, 300, A2, 740, A3, 1030, A4, 1300, A5, 1500, 1560, 1616, G_END],
    [HORA.mediodia.amb, 0.92, 0.88, 0.78, 0.86, 0.92, 0.9, 0.84, 0.72, 0.66, 0.9, 0.96,
      HORA.cenital.amb], CL,
  );
  const warmW = interpolate(g, [A1, A2, 740, A3, 1030, A4, 1300, A5, 1533, 1616, G_END],
    [0.5, 0.44, 0.3, 0.36, 0.56, 0.72, 0.8, 0.72, 0.5, 0.4, 0.3], CL);
  const boneW = interpolate(g, [A1, A2, A3, A4, A5, 1560, 1616, G_END],
    [0.34, 0.36, 0.4, 0.42, 0.34, 0.5, 0.74, 1.0], CL);
  const coldW = interpolate(g, [A1, A2, 700, 740, A3, 1030, A4, 1300, A5, G_END],
    [0.2, 0.28, 0.5, 0.7, 0.6, 0.5, 0.34, 0.4, 0.5, 0.34], CL);
  const coolMix = interpolate(g, [A1, A2, 740, A3, 1030, A4, 1300, A5, G_END],
    [0.08, 0.16, 0.46, 0.34, 0.2, 0.12, 0.3, 0.34, 0.14], CL);
  const keyFrom = interpolate(g, [A1, A2, A3, 1030, A4, 1300, A5, G_END],
    [0.28, 0.44, 0.5, 0.34, 0.62, 0.4, 0.3, 0.56], CL);
  const inten = interpolate(g, [A1, 300, A2, 740, A3, 1128, A4, 1300, A5, 1533, G_END],
    [1.0, 1.0, 0.96, 0.8, 0.94, 1.1, 0.7, 1.0, 0.78, 0.96, 1.06], CL);
  const floorDim = interpolate(g, [A1, A2, A3, A4, A5, G_END], [0.5, 0.54, 0.6, 0.52, 0.62, 0.48], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 24) : 0;

  const a1 = g < A2;
  const a2 = g >= A2 && g < A3;
  const a3 = g >= A3 && g < A4;
  const a4 = g >= A4 - 20 && g < A5;           // se monta 20 f antes: el zoom-through cae ADENTRO
  const a5 = g >= A5;

  // FRONTERA C · ZOOM-THROUGH por la boca del caño (el acto 3 es el que escala hacia el punto)
  const z3 = g >= 1134 ? zoomThrough(g, 1134, 18, 61, 52) : null;
  const w3 = { transform: z3 ? z3.out : undefined, opacity: z3 ? z3.opacity : 1 };

  // FRONTERA A · MATCH-MOVE. UNA sola velocidad a los dos lados del corte: −0,62 %/frame.
  const MMV = -0.62;
  const mmErnesto = 34 + (g - 486) * MMV;      // la cara de Ernesto sale por la izquierda
  const mmPanel = 112 + (g - 515) * MMV;       // los paneles entran por la derecha, MISMA velocidad
  const mmParkP = es(clamp01((g - 566) / 46)); // recién después frena y se estaciona

  // EL CAÑO: `fase` es la INTEGRAL del sentido de la corriente. Si baja, la carga va al revés —
  // es lo que hace visible que "un cable no sabe para qué lado va".
  const fase = interpolate(
    g, [A3, 958, 974, 1000, 1016, 1152],
    [0, 48, 48, 24, 24, 196], { ...CL, easing: Easing.bezier(0.34, 0, 0.32, 1) },
  );
  const verTubo = g >= 740 && g < A4;
  const sentido = g < 974 ? 1 : g < 1016 ? -1 : 1;

  // ACTO 4 · el duelo de manómetros. La cajita cruza a la red en 1214: ahí la corriente da vuelta.
  const pMicro = interpolate(g, [1166, 1206, 1226, 1300, 1420], [0.42, 0.5, 0.63, 0.66, 0.68], CL);
  const pRed = interpolate(g, [1166, 1226, 1420], [0.58, 0.58, 0.57], CL);

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único que
          la apertura recorta. Ni un píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 55 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: entra de arriba y su temperatura marca la hora */}
        <SunKey ang={sunAng} temp="torch" amb={warmW * amb} soft={66} />
        <SunKey ang={sunAng} temp="bone" amb={boneW * amb} soft={72} />
        <SunKey ang={100} temp="sky" amb={coldW * amb * 0.8} soft={78} />

        <Layers cam={cam}>
          {/* ── ACTO 1 · el patio con el kit ya armado (y la manguera enroscada al lado: la que
                  vuelve en el acto 3 convertida en la idea de presión) ────────────────────── */}
          {a1 && (
            <Plane z={-840}>
              <PhotoPlane src="img/cmepanel30/cmep30_s3_kit_terminado.png" kind="photo" z={0}
                scale={1.24} dim={interpolate(g, [A1, 120, 380, A2], [0.42, 0.46, 0.44, 0.54], CL)}
                tint={V.volt} />
            </Plane>
          )}

          {/* ── ACTO 2 · el dedo de Ernesto contra el enchufe, a sangre ───────────────────── */}
          {a2 && (
            <Plane z={-820}>
              <PhotoPlane src="img/cmepanel30/cmep30_s3_ernesto_senala_cable.png" kind="photo" z={0}
                scale={1.26} dim={interpolate(g, [A2, 600, 726, 760, A3], [0.6, 0.52, 0.5, 0.6, 0.66], CL)}
                tint={V.sky} />
            </Plane>
          )}

          {/* ── ACTO 3 · el cable real detrás del diagrama: la idea se apoya en materia ───── */}
          {a3 && (
            <AbsoluteFill style={{ ...w3, transformStyle: "preserve-3d" }}>
              <Plane z={-840}>
                <PhotoPlane src="img/cmepanel30/cmep30_s3_cable_al_tomacorriente.png" kind="photo" z={0}
                  scale={1.28} dim={interpolate(g, [A3, 900, 1028, 1128, A4], [0.66, 0.6, 0.66, 0.72, 0.72], CL)}
                  tint={V.sky} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── LA MATERIA QUE CRUZA LA FRONTERA B: la placa del tomacorriente que se vuelve
                  caño. UN solo objeto del 740 al 1152 — por eso vive FUERA de a2/a3. ─────── */}
          {verTubo && (
            <Plane z={-260}>
              <AbsoluteFill style={g >= A3 ? { ...w3, transformStyle: "preserve-3d" } : undefined}>
                <Tubo g={g} fase={fase} />
              </AbsoluteFill>
            </Plane>
          )}

          {/* ── ACTO 4 · salimos del túnel en la cajita gris colgada a la sombra ──────────── */}
          {a4 && (
            <Plane z={-860}>
              <PhotoPlane src="img/cmepanel30/cmep30_s3_cajita_gancho_sombra.png" kind="photo" z={0}
                scale={1.3} dim={interpolate(g, [1132, 1200, 1300, 1400, A5], [0.34, 0.5, 0.56, 0.62, 0.64], CL)}
                tint={V.amber} />
            </Plane>
          )}

          {/* ── ACTO 5 · primero la cocina (el refrigerador abierto), después el patio ───── */}
          {a5 && g < 1546 && (
            <Plane z={-820}>
              <PhotoPlane src="img/cmepanel30/cmep30_s3_refrigerador_abierto.png" kind="photo" z={0}
                scale={1.22} dim={interpolate(g, [A5, 1470, 1520, 1546], [0.3, 0.34, 0.4, 0.5], CL)}
                tint={V.amber} />
            </Plane>
          )}
          {a5 && g >= 1526 && (
            <Plane z={-860}>
              <PhotoPlane src="img/cmepanel30/cmep30_s4_dos_parados_patio.png" kind="photo" z={0}
                scale={1.26} dim={interpolate(g, [1526, 1580, 1616, G_END], [0.44, 0.5, 0.56, 0.68], CL)}
                tint={V.volt} />
            </Plane>
          )}
        </Layers>
      </AbsoluteFill>

      {/* los cantos de la apertura: el brillo sale SIEMPRE hacia el mundo, jamás hacia la cara */}
      {cov.open && (
        <>
          <CantoV x={cov.gL} dir={-1} hot={cantoHot} />
          <CantoV x={cov.gR} dir={1} hot={cantoHot} />
          {cov.sh > 0.5 && cov.sh < 99 && <CantoH y={cov.sh} x0={cov.gL} x1={cov.gR} hot={cantoHot} />}
        </>
      )}

      {/* ════ EL PRIMER PLANO — no está recortado. Mientras la apertura esté ABIERTA todo esto
          vive en x<29 % o x>71 %: nunca en la caja de la cara. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · LLEGA ERNESTO ═════════════════════════════════════════════════════ */}
        {a1 && (
          <>
            {/* LA MATERIA QUE ENTRA del movimiento anterior: el cable del microinversor al
                tomacorriente. Todavía está en cuadro y recién ahí se va. */}
            <Plane z={140}>
              {g < 132 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_cable_al_tomacorriente.png" kind="photo"
                  w={430} h={258}
                  x={lerp(72, 79, es(clamp01(g / 60)))}
                  y={58 + lerp(0, 62, es(clamp01((g - 96) / 32)))}
                  z={0} ry={-11} rx={2} lit={0.95} litColor={V.volt}
                  label="AL TOMACORRIENTE" sheenAt={toCF(18)} radius={10} />
              )}
            </Plane>

            {/* Ernesto LLEGA a la reja (clip real) y se queda de brazos cruzados */}
            <Plane z={160}>
              {g >= 36 && g < 214 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_ernesto_llega_reja.mp4" kind="video"
                  w={382} h={230}
                  x={lerp(120, 81, es(clamp01((g - 36) / 40)))}
                  y={lerp(38, 34, es(clamp01((g - 36) / 40)))}
                  z={0} ry={-12} rx={2} startFrom={8} lit={1} litColor={V.volt}
                  label="ERNESTO" sheenAt={toCF(84)} radius={10} />
              )}
              {g >= 206 && g < 320 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_ernesto_brazos_cruzados.png" kind="photo"
                  w={382} h={230}
                  x={81} y={lerp(112, 36, es(clamp01((g - 206) / 30))) + lerp(0, 60, es(clamp01((g - 298) / 22)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.bone}
                  label="LOS BRAZOS CRUZADOS" sheenAt={toCF(240)} radius={10} />
              )}
              {g >= 312 && g < 452 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_claudio_ernesto_charla.png" kind="photo"
                  w={382} h={230}
                  x={81 + lerp(0, 26, es(clamp01((g - 430) / 22)))}
                  y={lerp(112, 40, es(clamp01((g - 312) / 32)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.volt}
                  label="EL VECINO DE SIEMPRE" sheenAt={toCF(350)} radius={10} />
              )}
            </Plane>

            {/* LA APUESTA: 10 dólares. Entra desde ABAJO y en cálido — es plata que va a
                terminar del lado de Claudio (ley de dirección del Stage). */}
            <Plane z={90}>
              {g >= 204 && g < 312 && (() => {
                const fl = flujo("queda", clamp01((g - 204) / 28));
                const sale = es(clamp01((g - 292) / 20));
                return (
                  <>
                    <IconPng src="img/cmepanel30/cmep30_ic_billete.png"
                      x={19} y={20 + pc(fl.dy) + sale * 8} size={104} z={0} opacity={0.96} glow={V.ink0} />
                    <Readout value="$10" label="LA APUESTA" at={toCF(216)}
                      x={19} y={30 + pc(fl.dy) + sale * 8} size={136} color={V.amber} />
                  </>
                );
              })()}
              {g >= 226 && g < 306 && (
                <Rotulo x={19} y={40} color={rgba(V.amber, 0.95)} size={32}
                  op={clamp01((g - 226) / 12) * clamp01(1 - (g - 288) / 16)}>
                  ME APOSTÓ 10 DÓLARES
                </Rotulo>
              )}
            </Plane>

            {/* "NI UN CENTAVO LA FACTURA": la factura entra desde ARRIBA y en FRÍO (te la cobran) */}
            <Plane z={110}>
              {g >= 318 && g < 452 && (() => {
                const fl = flujo("cobran", clamp01((g - 318) / 30));
                const sale = es(clamp01((g - 428) / 22));
                return (
                  <MediaCard src="img/cmepanel30/cmep30_s4_factura_blanca_mesa.png" kind="photo"
                    w={378} h={228} x={19 - sale * 26} y={64 + pc(fl.dy)}
                    z={0} ry={11} rx={-2} lit={0.94} litColor={V.sky}
                    label="LA FACTURA" sheenAt={toCF(356)} radius={10} />
                );
              })()}
              {g >= 344 && g < 448 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_moneda.png" x={19} y={26}
                    size={lerp(0, 92, es(clamp01((g - 344) / 18)))} z={0}
                    opacity={0.95 * clamp01(1 - (g - 428) / 18)} glow={V.ink0} />
                  <Rotulo x={19} y={36} color={rgba(V.sky, 0.95)} size={32}
                    op={clamp01((g - 360) / 12) * clamp01(1 - (g - 428) / 18)}>
                    NI UN CENTAVO
                  </Rotulo>
                  {/* la tachadura: la apuesta de Ernesto, negada */}
                  <div style={{
                    position: "absolute", left: "19%", top: "36%", width: 300, height: 8, marginLeft: -150,
                    transform: `rotate(-7deg) scaleX(${es(clamp01((g - 382) / 18)).toFixed(3)})`,
                    transformOrigin: "left center",
                    background: `linear-gradient(90deg, ${rgba(V.danger, 0.92)}, ${rgba(V.danger, 0.5)})`,
                    boxShadow: `0 0 24px ${rgba(V.danger, 0.6)}`,
                    opacity: clamp01(1 - (g - 428) / 18),
                  }} />
                </>
              )}
            </Plane>

            {/* "Y DESPUÉS TUVO QUE MIRAR LA PINZA CON SUS PROPIOS OJOS" — apertura ya cerrada:
                los dos planos grandes pueden ocupar el centro. Y acá nace el MATCH-MOVE. */}
            <Plane z={190}>
              {g >= 446 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cara_ernesto_asombro.png" kind="photo"
                  w={560} h={336}
                  x={g < 486 ? lerp(-16, 34, es(clamp01((g - 446) / 34))) : mmErnesto}
                  y={46} z={0} ry={9} rx={-2} lit={1} litColor={V.bone}
                  label="CON SUS PROPIOS OJOS" sheenAt={toCF(478)} radius={12} />
              )}
              {g >= 458 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_pinza_macro_display.png" kind="photo"
                  w={520} h={312}
                  x={lerp(118, 74, es(clamp01((g - 458) / 36)))}
                  y={54} z={0} ry={-11} rx={2} lit={1} litColor={V.volt}
                  label="LA PINZA" sheenAt={toCF(492)} radius={12} />
              )}
              {g >= 470 && (
                <IconPng src="img/cmepanel30/cmep30_ic_pinza.png" x={74} y={30}
                  size={lerp(0, 100, es(clamp01((g - 470) / 18)))} z={0} opacity={0.95} glow={V.ink0} />
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 2 · "ESO ESTÁ AL REVÉS" ═══════════════════════════════════════════════ */}
        {a2 && (
          <>
            {/* MATCH-MOVE: la cara de Ernesto todavía se va (misma velocidad) y LOS PANELES
                entran con la misma velocidad y la misma y. */}
            <Plane z={190}>
              {g < 566 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cara_ernesto_asombro.png" kind="photo"
                  w={560} h={336} x={mmErnesto} y={46} z={0} ry={9} rx={-2} lit={1} litColor={V.bone}
                  label="CON SUS PROPIOS OJOS" radius={12} />
              )}
              {g < 614 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_claudio_agachado_paneles.png" kind="photo"
                  w={540} h={324}
                  x={lerp(mmPanel, 30, mmParkP)}
                  y={46} z={0} ry={-10} rx={2} lit={1} litColor={V.volt}
                  label="MIRÓ LOS PANELES" sheenAt={toCF(556)} radius={12} />
              )}
            </Plane>

            {/* "miró el cable que iba a la pared" */}
            <Plane z={150}>
              {g >= 552 && g < 644 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_lleva_cable.mp4" kind="video"
                  w={520} h={312}
                  x={lerp(120, 72, es(clamp01((g - 552) / 36))) + lerp(0, 52, es(clamp01((g - 598) / 40)))}
                  y={lerp(58, 50, es(clamp01((g - 552) / 36)))}
                  z={0} ry={-11} rx={2} startFrom={10} lit={1} litColor={V.sky}
                  label="EL CABLE A LA PARED" sheenAt={toCF(578)} radius={12} />
              )}
            </Plane>

            {/* VENTANA W2 abierta (596-726): sólo tercios. Él señala a la derecha, el enchufe
                real a la izquierda. Nada entra jamás en 29-71 %. */}
            <Plane z={170}>
              {g >= 610 && g < 726 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_ernesto_senala_cable.mp4" kind="video"
                  w={380} h={228}
                  x={lerp(118, 81, es(clamp01((g - 610) / 32)))}
                  y={42} z={0} ry={-12} rx={2} startFrom={6} lit={1} litColor={V.sky}
                  label="Y ME DIJO" sheenAt={toCF(648)} radius={10} />
              )}
              {g >= 636 && g < 726 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_enchufe_pared_exterior.png" kind="photo"
                  w={378} h={228}
                  x={19} y={lerp(116, 62, es(clamp01((g - 636) / 32)))}
                  z={0} ry={11} rx={-2} lit={0.96} litColor={V.sky}
                  label="EL TOMACORRIENTE" sheenAt={toCF(676)} radius={10} />
              )}
              {g >= 660 && g < 726 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_enchufe.png" x={19} y={28}
                    size={lerp(0, 100, es(clamp01((g - 660) / 16)))} z={0} opacity={0.96} glow={V.ink0} />
                  <Rotulo x={81} y={70} color={rgba(V.bone, 0.94)} size={32} op={clamp01((g - 682) / 12)}>
                    LO QUE TÚ PENSASTE
                  </Rotulo>
                </>
              )}
            </Plane>

            {/* ── EL BEAT @732 · CORTE SECO de la ventana y la frase a pantalla completa ──── */}
            <Plane z={230}>
              {g >= 734 && g < 844 && (
                <div style={{
                  position: "absolute", left: "27%",
                  top: `${lerp(52, 46, es(clamp01((g - 734) / 24))).toFixed(2)}%`,
                  transform: `translate(-50%,-50%) translateY(${(es(clamp01((g - 826) / 18)) * 64).toFixed(1)}px)`,
                  opacity: clamp01((g - 734) / 8) * clamp01(1 - (g - 830) / 14),
                }}>
                  <Bed pad={26} w={720}>
                    <Head size={96} color={V.white}>ESO ESTÁ<br /><Em color={V.danger}>AL REVÉS</Em></Head>
                    <div style={{ marginTop: 16 }}>
                      <Body size={38} color={rgba(V.bone, 0.95)}>Por ahí sale la luz, no entra.</Body>
                    </div>
                  </Bed>
                </div>
              )}
              {/* la flecha que sale de la pared: el modelo mental EQUIVOCADO, frío y desde arriba */}
              {g >= 756 && g < 830 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_flecha.png"
                    x={lerp(66, 82, es(clamp01((g - 756) / 46)))} y={28}
                    size={116} z={0} rot={0}
                    opacity={0.95 * clamp01((g - 756) / 12) * clamp01(1 - (g - 812) / 16)}
                    glow={V.sky} />
                  <Rotulo x={78} y={20} color={rgba(V.sky, 0.95)} size={32}
                    op={clamp01((g - 774) / 12) * clamp01(1 - (g - 812) / 16)}>
                    ASÍ LO VE ÉL
                  </Rotulo>
                </>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 3 · UN CABLE NO SABE PARA QUÉ LADO VA ═════════════════════════════════ */}
        {a3 && (
          <AbsoluteFill style={{ ...w3, transformStyle: "preserve-3d" }}>
            {/* "y tiene razón en cómo lo ve" — se lo concedemos con material real, no con texto */}
            <Plane z={160}>
              {g < 906 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_claudio_explica_presion.mp4" kind="video"
                  w={420} h={252}
                  x={lerp(118, 80, es(clamp01((g - 846) / 32))) + lerp(0, 30, es(clamp01((g - 884) / 20)))}
                  y={26} z={0} ry={-12} rx={2} startFrom={6} lit={1} litColor={V.bone}
                  label="Y TIENE RAZÓN" sheenAt={toCF(872)} radius={10} />
              )}
              {g >= 852 && g < 900 && (
                <Rotulo x={30} y={22} color={rgba(V.bone, 0.94)} size={34}
                  op={clamp01((g - 852) / 12) * clamp01(1 - (g - 882) / 14)}>
                  TIENE RAZÓN EN CÓMO LO VE
                </Rotulo>
              )}
            </Plane>

            {/* EL TITULAR DEL TRAMO (apertura cerrada: puede vivir centrado y grande) */}
            <Plane z={220}>
              {g >= 900 && g < 1032 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${lerp(18, 14, es(clamp01((g - 900) / 24))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((g - 900) / 10) * clamp01(1 - (g - 1016) / 14),
                }}>
                  <Head size={70} color={V.white}>UN CABLE NO SABE<br /><Em>PARA QUÉ LADO VA</Em></Head>
                </div>
              )}
            </Plane>

            {/* las dos flechas que se turnan sobre el caño: el sentido cambia, el cable NO */}
            <Plane z={200}>
              {g >= 912 && g < 1030 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_flecha.png" x={66} y={33} size={96} z={0}
                    rot={0} opacity={(sentido > 0 ? 0.96 : 0.14) * clamp01((g - 912) / 14)} glow={V.ink0} />
                  <IconPng src="img/cmepanel30/cmep30_ic_flecha.png" x={34} y={33} size={96} z={0}
                    rot={180} opacity={(sentido < 0 ? 0.96 : 0.14) * clamp01((g - 912) / 14)} glow={V.ink0} />
                </>
              )}
            </Plane>

            {/* material real que sostiene la idea: dos cables iguales, un conector sin lado */}
            <Plane z={140}>
              {g >= 906 && g < 1032 && (
                <MediaCard src="img/cmepanel30/cmep30_s2_cajita_dos_cables.png" kind="photo"
                  w={430} h={258}
                  x={lerp(-14, 24, es(clamp01((g - 906) / 32)))}
                  y={77 + lerp(0, 40, es(clamp01((g - 1012) / 20)))}
                  z={0} ry={11} rx={-2} lit={0.96} litColor={V.bone}
                  label="DOS CABLES IGUALES" sheenAt={toCF(944)} radius={10} />
              )}
              {g >= 950 && g < 1032 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_une_conectores.mp4" kind="video"
                  w={430} h={258}
                  x={lerp(116, 76, es(clamp01((g - 950) / 32)))}
                  y={77 + lerp(0, 40, es(clamp01((g - 1012) / 20)))}
                  z={0} ry={-11} rx={2} startFrom={8} lit={0.96} litColor={V.volt}
                  label="NINGUNO TIENE LADO" sheenAt={toCF(986)} radius={10} />
              )}
            </Plane>

            {/* ── LA IDEA FÍSICA: DOS PRESIONES. La manguera del patio (la misma que está
                    enroscada junto a los paneles) contra la lámpara que consume. El caño los une
                    por detrás y la carga corre SIEMPRE del manómetro alto al bajo. ────────── */}
            <Plane z={150}>
              {g >= 1032 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_manguera_presion.mp4" kind="video"
                  w={620} h={372}
                  x={lerp(-18, 27, es(clamp01((g - 1032) / 34)))}
                  y={48} z={0} ry={10} rx={-2} startFrom={8} lit={1} litColor={V.amber}
                  label="LA MANGUERA DEL PATIO" sheenAt={toCF(1072)} radius={12} />
              )}
              {g >= 1046 && (
                <MediaCard src="img/cmepanel30/cmep30_s3_lampara_enchufada.png" kind="photo"
                  w={620} h={372}
                  x={lerp(118, 73, es(clamp01((g - 1046) / 34)))}
                  y={48} z={0} ry={-10} rx={2} lit={0.94} litColor={V.sky}
                  label="LO QUE CONSUME" sheenAt={toCF(1090)} radius={12} />
              )}
            </Plane>

            {/* LOS MANÓMETROS: la gráfica que hace visible la palabra "presión", apoyada sobre
                las dos tarjetas de material real. */}
            <Plane z={210}>
              {g >= 1064 && (
                <>
                  <Manometro x={12} y={24} val={interpolate(g, [1064, 1104, 1152], [0.3, 0.78, 0.8], CL)}
                    color={V.amber} label="MÁS" op={clamp01((g - 1064) / 14)} />
                  <Manometro x={88} y={24} val={interpolate(g, [1064, 1104, 1152], [0.3, 0.24, 0.22], CL)}
                    color={V.sky} label="MENOS" op={clamp01((g - 1072) / 14)} />
                </>
              )}
            </Plane>

            {/* EL TITULAR DE LA LEY */}
            <Plane z={230}>
              {g >= 1034 && g < 1150 && (
                <div style={{
                  position: "absolute", left: "50%",
                  top: `${lerp(88, 84, es(clamp01((g - 1034) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((g - 1034) / 10) * clamp01(1 - (g - 1136) / 12),
                }}>
                  <Bed pad={22}>
                    <Head size={72} color={V.white}>VA DE <Em color={V.amber}>MÁS</Em> A <Em color={V.sky}>MENOS</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>
          </AbsoluteFill>
        )}

        {/* ═══ ACTO 4 · LA CASA NO PREGUNTA ══════════════════════════════════════════════ */}
        {a4 && (
          <>
            {/* EL DUELO: la cajita empuja desde ABAJO y en cálido; la red desde ARRIBA y en frío */}
            <Plane z={150}>
              {g >= 1166 && (() => {
                const fl = flujo("queda", clamp01((g - 1166) / 30));
                const t = es(clamp01((g - 1292) / 46));     // migra al tercio ANTES de abrir W3
                return (
                  <MediaCard src="img/cmepanel30/cmep30_s2_cajita_gris_gancho.png" kind="photo"
                    w={lerp(580, 372, t)} h={lerp(348, 224, t)}
                    x={lerp(27, 19, t)} y={lerp(42, 66, t) + pc(fl.dy)}
                    z={0} ry={10} rx={-2} lit={1} litColor={V.amber}
                    label="EL MICROINVERSOR" sheenAt={toCF(1210)} radius={12} />
                );
              })()}
              {g >= 1176 && g < 1372 && (() => {
                const fl = flujo("cobran", clamp01((g - 1176) / 30));
                const t = es(clamp01((g - 1292) / 46));
                return (
                  <MediaCard src="img/cmepanel30/cmep30_s4_medidor_pared.png" kind="photo"
                    w={lerp(580, 372, t)} h={lerp(348, 224, t)}
                    x={lerp(73, 81, t)} y={lerp(42, 30, t) + pc(fl.dy) + lerp(0, 40, es(clamp01((g - 1356) / 18)))}
                    z={0} ry={-10} rx={2} lit={0.94} litColor={V.sky}
                    label="LA RED" sheenAt={toCF(1224)} radius={12} />
                );
              })()}
            </Plane>

            {/* los mismos manómetros del acto 3, ahora con nombre y apellido. La aguja de la
                cajita PASA a la de la red en 1214: ahí la corriente da vuelta. */}
            <Plane z={210}>
              {g >= 1170 && g < 1330 && (
                <>
                  <Manometro x={12} y={22} val={pMicro} color={V.amber} label="LA CAJITA"
                    op={clamp01((g - 1170) / 14) * clamp01(1 - (g - 1312) / 16)} />
                  <Manometro x={88} y={22} val={pRed} color={V.sky} label="LA RED"
                    op={clamp01((g - 1178) / 14) * clamp01(1 - (g - 1312) / 16)} />
                </>
              )}
              {g >= 1226 && g < 1318 && (
                <Rotulo x={50} y={16} color={rgba(V.volt, 0.98)} size={36}
                  op={clamp01((g - 1226) / 12) * clamp01(1 - (g - 1300) / 16)}>
                  APENAS UN POCO MÁS FUERTE
                </Rotulo>
              )}
            </Plane>

            {/* LA CORRIENTE. Primero baja de la RED a la casa (frío); cuando la cajita gana la
                pulseada, cambia de origen y baja del MICROINVERSOR (cálido). Mismo destino. */}
            <Plane z={120}>
              {g >= 1178 && g < 1252 && (
                <Corriente g={g} at={1178} color={V.sky} n={8}
                  x0={1400} y0={470} cx={1250} cy={760} x1={960} y1={868}
                  op={clamp01(1 - (g - 1226) / 24)} />
              )}
              {g >= 1230 && g < 1330 && (
                <Corriente g={g} at={1230} color={V.amber} n={10} speed={0.013}
                  x0={520} y0={470} cx={700} cy={770} x1={960} y1={868}
                  op={clamp01((g - 1230) / 16) * clamp01(1 - (g - 1300) / 26)} />
              )}
              {g >= 1236 && g < 1318 && (
                <IconPng src="img/cmepanel30/cmep30_ic_casa.png" x={50}
                  y={82 + lerp(0, 12, es(clamp01((g - 1296) / 22)))}
                  size={124} z={0}
                  opacity={0.96 * clamp01((g - 1236) / 14) * clamp01(1 - (g - 1300) / 18)} glow={V.ink0} />
              )}
            </Plane>

            {/* VENTANA W3 abierta (1306-1442): sólo tercios. La casa se come lo que le llega. */}
            <Plane z={170}>
              {g >= 1368 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_modem_luces.png" kind="photo"
                  w={366} h={220}
                  x={81} y={lerp(112, 32, es(clamp01((g - 1368) / 30)))}
                  z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                  label="EL MÓDEM" sheenAt={toCF(1400)} radius={10} />
              )}
              {g >= 1386 && (
                <MediaCard src="broll/cmepanel30/cmep30_s4c_congelador_vibra.mp4" kind="video"
                  w={366} h={220}
                  x={81} y={lerp(118, 72, es(clamp01((g - 1386) / 30)))}
                  z={0} ry={-12} rx={2} startFrom={8} lit={1} litColor={V.amber}
                  label="EL CONGELADOR" sheenAt={toCF(1416)} radius={10} />
              )}
            </Plane>

            {/* EL TITULAR DEL ACTO — en el tercio izquierdo, dos líneas, con cama oscura */}
            <Plane z={220}>
              {g >= 1372 && (
                <div style={{
                  position: "absolute", left: "19%",
                  top: `${lerp(30, 26, es(clamp01((g - 1372) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1372) / 10),
                }}>
                  <Bed pad={22}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 1.02,
                      color: V.white, textTransform: "uppercase", textShadow: "0 6px 26px rgba(0,0,0,0.95)",
                    }}>LA CASA<br /><span style={{ color: V.volt }}>NO PREGUNTA</span></div>
                  </Bed>
                </div>
              )}
              {g >= 1404 && (
                <Rotulo x={19} y={44} color={rgba(V.bone, 0.9)} size={31} op={clamp01((g - 1404) / 14)}>
                  DE DÓNDE VIENE
                </Rotulo>
              )}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 5 · SOSTÉN LA PINZA ══════════════════════════════════════════════════ */}
        {a5 && (
          <>
            {/* la carga que venía del acto 4 llega al refrigerador y se la come */}
            <Plane z={110}>
              {g >= 1452 && g < 1540 && (
                <Corriente g={g} at={1452} color={V.amber} n={9} speed={0.0125}
                  x0={-60} y0={700} cx={420} cy={640} x1={880} y1={600}
                  op={clamp01((g - 1452) / 14) * clamp01(1 - (g - 1516) / 22)} />
              )}
              {g >= 1466 && g < 1546 && (
                <IconPng src="img/cmepanel30/cmep30_ic_congelador.png" x={81} y={26}
                  size={lerp(0, 112, es(clamp01((g - 1466) / 18)))} z={0}
                  opacity={0.95 * clamp01(1 - (g - 1516) / 20)} glow={V.ink0} />
              )}
            </Plane>

            {/* EL TITULAR (apertura cerrada hasta 1548: puede vivir centrado y grande) */}
            <Plane z={230}>
              {g >= 1448 && g < 1550 && (
                <div style={{
                  position: "absolute", left: "34%",
                  top: `${lerp(86, 82, es(clamp01((g - 1448) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1448) / 10) * clamp01(1 - (g - 1536) / 12),
                }}>
                  <Bed pad={24}>
                    <Head size={64} color={V.white}>CONSUME <Em>LO QUE TIENE ENFRENTE</Em></Head>
                  </Bed>
                </div>
              )}
            </Plane>

            {/* "ENTONCES ENCHUFÉ" — el clip entra desde fuera de cuadro y se estaciona en el
                tercio izquierdo ANTES de que W4 se abra en cruz: nunca pisa la caja de la cara. */}
            <Plane z={160}>
              {g >= 1532 && g < 1636 && (
                <MediaCard src="broll/cmepanel30/cmep30_s3c_enchufa_tomacorriente.mp4" kind="video"
                  w={372} h={224}
                  x={lerp(-16, 19, es(clamp01((g - 1532) / 34))) - lerp(0, 40, es(clamp01((g - 1606) / 26)))}
                  y={40} z={0} ry={11} rx={-2} startFrom={8} lit={1} litColor={V.volt}
                  label="ENCHUFÉ" sheenAt={toCF(1560)} radius={10} />
              )}
            </Plane>

            {/* Ernesto recibe la pinza y la sostiene: el gesto que abre el corazón del video */}
            <Plane z={180}>
              {g >= 1556 && g < 1604 && (
                <MediaCard src="broll/cmepanel30/cmep30_s4c_ernesto_recibe_pinza.mp4" kind="video"
                  w={372} h={224}
                  x={lerp(118, 81, es(clamp01((g - 1556) / 30)))}
                  y={42} z={0} ry={-12} rx={2} startFrom={6} lit={1} litColor={V.volt}
                  label="SOSTÉN ESTO" sheenAt={toCF(1582)} radius={10} />
              )}
              {g >= 1596 && g < 1642 && (
                <MediaCard src="broll/cmepanel30/cmep30_s4c_ernesto_sostiene_quieto.mp4" kind="video"
                  w={372} h={224}
                  x={81 + lerp(0, 30, es(clamp01((g - 1616) / 24)))}
                  y={lerp(114, 42, es(clamp01((g - 1596) / 28)))}
                  z={0} ry={-12} rx={2} startFrom={4} lit={1} litColor={V.volt}
                  label="ERNESTO" sheenAt={toCF(1618)} radius={10} />
              )}
              {g >= 1540 && g < 1610 && (
                <MediaCard src="img/cmepanel30/cmep30_s4_cable_entrada_casa.png" kind="photo"
                  w={372} h={224}
                  x={81} y={74 + lerp(0, 46, es(clamp01((g - 1584) / 24)))}
                  z={0} ry={-12} rx={2} lit={0.96} litColor={V.sky}
                  label="EL CABLE QUE ENTRA" sheenAt={toCF(1556)} radius={10} />
              )}
            </Plane>

            {/* EL TITULAR DEL ACTO, en el tercio izquierdo mientras la ventana está abierta */}
            <Plane z={220}>
              {g >= 1560 && g < 1638 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_pinza.png" x={19} y={62}
                    size={lerp(0, 106, es(clamp01((g - 1560) / 18)))} z={0}
                    opacity={0.96 * clamp01(1 - (g - 1622) / 14)} glow={V.ink0} />
                  <div style={{
                    position: "absolute", left: "19%",
                    top: `${lerp(84, 80, es(clamp01((g - 1566) / 20))).toFixed(2)}%`,
                    transform: "translate(-50%,-50%)",
                    opacity: clamp01((g - 1566) / 10) * clamp01(1 - (g - 1622) / 14),
                  }}>
                    <Bed pad={20}>
                      <Head size={54} color={V.white}>SOSTÉN<br /><Em>LA PINZA</Em></Head>
                    </Bed>
                  </div>
                </>
              )}
            </Plane>

            {/* ── EL ATERRIZAJE: la pinza a punto de abrazar el cable de entrada. Crece hasta
                    casi pantalla completa mientras la cámara BAJA sobre ella. Es la materia que
                    le entrego al movimiento siguiente (310 → 40). ───────────────────────── */}
            <Plane z={60}>
              {g >= 1622 && (() => {
                const t = es(clamp01((g - 1622) / 44));
                const c = es(clamp01((g - 1634) / 30));   // se centra sólo con la apertura YA cerrada
                return (
                  <MediaCard src="broll/cmepanel30/cmep30_s4c_pinza_abraza_cable.mp4" kind="video"
                    w={lerp(520, 1480, t)} h={lerp(312, 888, t)}
                    x={lerp(79, 50, c)} y={lerp(60, 52, t)}
                    z={0} ry={lerp(-11, 0, t)} rx={lerp(3, 0, t)}
                    startFrom={4} lit={1} litColor={V.volt}
                    label={t < 0.7 ? "LA PINZA" : undefined}
                    sheenAt={toCF(1650)} radius={lerp(12, 4, t)} />
                );
              })()}
              {g >= 1648 && (
                <Rotulo x={50} y={91} color={rgba(V.volt, 0.96)} size={34}
                  op={clamp01((g - 1648) / 14)}>
                  EL CABLE QUE ENTRA A LA CASA
                </Rotulo>
              )}
            </Plane>
          </>
        )}

      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════ */}
      {/* FRONTERA D @1442 · OCLUSIÓN — la puerta esmaltada del refrigerador cruza y tapa el 100 %
          entre 1441 y 1446: ahí adentro cambia el acto. Color = el ESMALTE, no el fondo. */}
      <PuertaOcluye g={g} at={1432} dur={24} />
      {/* COSTURA INTERNA @1533 · WIPE POR MATERIA — el polvo seco del patio, y detrás ya está la
          pared con el cable de entrada. Ninguna frontera repite la costura de su vecina. */}
      <SeamWipeMatter at={toCF(1524)} dur={30} tint={V.concrete} />
      <PolvoCruza g={g} at={1522} dur={32} />
    </AbsoluteFill>
  );
};
