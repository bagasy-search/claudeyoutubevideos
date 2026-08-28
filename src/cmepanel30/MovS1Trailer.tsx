// MovS1Trailer.tsx — MOVIMIENTO S1 · "EL TRAILER DE LOS 30 DÍAS"
// Video `cmepanel30` (Claudio Mendoza Constructor, ES). 5 actos · 0 → 2452 frames @30 = 81,73 s.
// Se monta ENCIMA del avatar real de Claudio. ⛔ CERO filtros sobre el avatar: no hay una sola capa
// con opacidad apoyada sobre su cara en todo el movimiento. Todo el diseño vive ALREDEDOR de él.
//
// ── CÓMO ESTÁ CONSTRUIDO (lo que hay que entender antes de tocar una línea) ───────────────────
// 1. EL MUNDO (atmósfera + sol + fondos + la forma madre) vive DENTRO de un único contenedor
//    recortado por LA APERTURA (`coverAt` → `clipOf`): un polígono en U que deja un hueco central
//    abierto hacia abajo. Hueco cerrado = el mundo tapa la pantalla entera. Hueco abierto = el
//    mundo queda SOLO en los tercios laterales y la banda superior, y Claudio se ve LIMPIO en el
//    medio. La apertura es GEOMETRÍA, nunca opacidad: no existe un fundido sobre su cara.
//    Las cuatro ventanas de avatar usan cuatro gestos DISTINTOS de apertura/cierre:
//      W1 (168-505)  laterales que se abren y se vuelven a juntar   → los dos paneles del kit
//      W2 (1000-1156) CORTE seco + GUILLOTINA que baja desde arriba → la compañía, en frío
//      W3 (1294-1466) abre detrás de la OCLUSIÓN + muro que barre    → la pared del patio
//      W4 (2288-fin)  la persiana LEVANTA desde abajo y ya no baja   → se va abriendo al final
// 2. EL PRIMER PLANO (tarjetas con material real, números, íconos, titulares) NO está recortado.
//    Por eso, mientras la apertura está abierta, TODO vive en x<26 % o x>74 %: nada entra jamás
//    en la caja de la cara (30-70 % · 10-90 %).
// 3. UNA sola cámara `camAt(g)`, función pura de g, monótona, con deriva viva. Ningún acto la
//    reinicia: el acto 5 hereda la inercia del 4. UNA sola atmósfera montada una vez.
// 4. LA MATERIA QUE CRUZA: el PANEL (`PanelForm`) es literalmente EL MISMO objeto del frame 6 al
//    1000 — entra en el patio, se estaciona en el tercio izquierdo, crece a pantalla completa y
//    SE ACUESTA hasta ser la barra de los 142 kWh. Y de esa barra se despega el 53, que es el
//    único objeto que sobrevive al corte del frame 1000 y el que se va de cuadro.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · 0-508 · "LOS TREINTA DÍAS"        protagonista: EL PANEL   texto: SIN NADA DE ESO (4 tags)
//   entra  cam {z −300, grúa +46, push 1.18, foco 58/56}  luz {brasa −18°, amb 0.16 → rampa 15 f}
//          materia {el patio al amanecer a sangre}
//   sale   cam {grúa −8, push 1.06, foco 44/48}           luz {limpio +22°, amb 0.62, key 0.40}
//          materia {UN PANEL A PANTALLA COMPLETA, grilla de celdas frontal}
//   ── FRONTERA A @508 ···· MATCH-SHAPE: el mismo `PanelForm` se acuesta y su grilla es la barra
//      de 142 kWh. No hay corte: es un objeto que cambia de forma sin soltar el cuadro. ·········
// ACTO 2 · 508-1000 · "LOS NÚMEROS"          protagonista: LA BARRA   texto: NADIE ME LO DESCONTÓ
//   entra  cam {grúa −8, push 1.06}                       luz {limpio → cenital 90°, amb 1.0}
//          materia {la barra de 142, ticks encendidos}
//   sale   cam {grúa −12, push 1.0, foco 50/44}           luz {penumbra: todo se apaga menos el 53}
//          materia {EL 53 solo, tibio, colgado sin piso, ya derivado al tercio derecho}
//   ── FRONTERA B @1000 ···· CORTE EN EL BEAT: la apertura salta de 0 a 62 % en UN frame sobre
//      "¿sabes dónde fueron a parar?". Bisagra: el 53 está en la MISMA x, y, escala y rotación a
//      los dos lados del corte. Sin flash sobre la cara. ······································
// ACTO 3 · 1000-1294 · "A DÓNDE FUERON"      protagonista: EL 53 QUE SE VA  texto: SE LOS REGALÉ
//   entra  cam {grúa −12, push 1.0}                       luz {mediodía 88°, frío desde arriba}
//          materia {el 53, ahora enfriándose}
//   sale   cam {grúa +18, push 1.05, foco 50/44}          luz {mediodía pleno, key 0.62}
//          materia {el hormigón del poste de la calle}
//   ── FRONTERA C @1294 ···· OCLUSIÓN: una losa de HORMIGÓN (la vereda del poste, `Ocluye`) cruza
//      de derecha a izquierda y tapa el 100 % en los frames 1293-1296 — y el cambio de acto Y la
//      apertura de la ventana caen los dos ADENTRO de esa ventana. El color es el de LA MATERIA, no
//      el del fondo (con el del fondo esto es un fundido a negro y SE VE). ····················
// ACTO 4 · 1294-1706 · "LA HERIDA"           protagonista: EL PANEL INOCENTE  texto: EL PROBLEMA NO ERA EL PANEL
//   entra  cam {grúa −6, push 1.10, foco 42/52}           luz {penumbra 8°, amb 0.22, frío}
//          materia {el escalón y la factura, en los tercios}
//   sale   cam {grúa −40 → clavada en una celda, push 1.36} luz {rasante 6°, ámbar desde ABAJO}
//          materia {UNA celda del panel, encendida}
//   ── FRONTERA D @1706 ···· ZOOM-THROUGH: la cámara entra en esa celda y sale del otro lado ya
//      dentro de la casa. El acto 5 se monta 20 frames antes, DEBAJO, para que nunca haya un
//      frame de negro (un zoom-through contra nada es un fundido a negro). ···················
// ACTO 5 · 1706-2452 · "EL NÚMERO ESCONDIDO" protagonista: EL HUECO DEL NÚMERO  texto: UN NÚMERO QUE NUNCA MEDÍ
//   entra  cam {saliendo del túnel, push 1.40 → 1.03}     luz {papel 70°, amb 0.88}
//          materia {el medidor de la casa, con "??" encima}
//   sale   cam {grúa +168, push 1.0, SIGUE ANDANDO}       luz {cierre 12°, ámbar de tarde}
//          materia {la mesa con lo que ya tienes + la pinza encendida}
//   (costura INTERNA @2118 ···· WIPE POR MATERIA: las hojas del manual cruzan y detrás ya están
//    los tres NO. Y @1548 MATCH-MOVE: el 142 sale de la etiqueta del panel y entra en la pinza
//    con la misma velocidad y la misma dirección.)
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade en ninguna frontera · cero capa de
// color con opacidad sobre el avatar · toda tarjeta flotante lleva FOTO o CLIP real adentro.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rgba, rnd,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamWipeMatter, zoomThrough, PanelForm, SunKey, HORA, flujo,
  Head, Body, Num, Bed,
} from "./PanelStage";

// ── EL RELOJ DEL MOVIMIENTO (frames del movimiento, 30 fps, anclados al ms de Whisper) ───────
const A1 = 0, A2 = 508, A3 = 1000, A4 = 1294, A5 = 1706;
const G_END = 2452;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla
const xp = (px: number) => (px / 1920) * 100;   // px horizontales → % de pantalla
const es = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
const esOut = (t: number) =>
  interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.42, 0, 0.24, 1) });

// ── EL MATERIAL REAL. Las rutas van LITERALES en el punto de uso (`MediaCard src="..."`,
//    `PhotoPlane src="..."`, `IconPng src="..."`): el build escanea este .tsx por TEXTO y una
//    ruta armada por template literal no viaja en el tar → 404 → chunk muerto con un error que
//    miente ("source image cannot be decoded"). Por eso acá no hay ningún mapa de assets: cada
//    string aparece entero donde se usa, y no se declara ni un asset que no se dibuje.

// ══ LA APERTURA ══════════════════════════════════════════════════════════════════════════════
// gL = borde derecho de la banda IZQUIERDA · gR = borde izquierdo de la banda DERECHA
// sh = altura de la banda SUPERIOR. El hueco (donde se ve Claudio limpio) = (gL..gR) × (sh..100).
type Cover = { gL: number; gR: number; sh: number; open: boolean };
const CERRADO: Cover = { gL: 50, gR: 50, sh: 0, open: false };

const coverAt = (g: number): Cover => {
  // W1 · ACTO 1 — los dos paneles se abren y se vuelven a juntar sobre él
  if (g >= 168 && g < 505) {
    const abre = es(clamp01((g - 168) / 38));
    const junta = es(clamp01((g - 470) / 34));
    const sp = Math.min(abre, 1 - junta);
    return { gL: lerp(50, 20, sp), gR: lerp(50, 80, sp), sh: 9 * clamp01(sp * 3), open: sp > 0.006 };
  }
  // W2 · ACTO 3 — CORTE seco en 1000 (un frame) y GUILLOTINA que baja desde arriba (la compañía)
  if (g >= 1000 && g < 1160) {
    const sh = lerp(9, 100, esOut(clamp01((g - 1104) / 46)));
    return { gL: 19, gR: 81, sh, open: sh < 98.5 };
  }
  // W3 · ACTO 4 — abre DETRÁS de la oclusión; cierra con la banda izquierda barriendo el cuadro
  if (g >= 1294 && g < 1466) {
    const barre = esOut(clamp01((g - 1420) / 46));
    return { gL: lerp(20, 81, barre), gR: 81, sh: 10, open: barre < 0.985 };
  }
  // W4 · ACTO 5 — la persiana LEVANTA desde abajo y ya no vuelve a bajar
  if (g >= 2288) {
    const sube = esOut(clamp01((g - 2288) / 54));
    return { gL: 18, gR: 82, sh: lerp(100, 6, sube), open: sube > 0.015 };
  }
  return CERRADO;
};

const clipOf = (c: Cover) =>
  c.open
    ? `polygon(0% 0%, 100% 0%, 100% 100%, ${c.gR.toFixed(2)}% 100%, ` +
      `${c.gR.toFixed(2)}% ${c.sh.toFixed(2)}%, ${c.gL.toFixed(2)}% ${c.sh.toFixed(2)}%, ` +
      `${c.gL.toFixed(2)}% 100%, 0% 100%)`
    : "inset(0px)";

// ── LOS CANTOS DE LA APERTURA. Todo su brillo sale HACIA AFUERA (hacia el mundo): ni un píxel
//    de gradiente se apoya sobre la cara. Es lo que hace que la apertura se lea como DOS PANELES
//    con el canto lamido por la luz y no como una máscara.
const CantoV: React.FC<{ x: number; dir: -1 | 1; hot: number }> = ({ x, dir, hot }) => (
  <div style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 0 }}>
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 3, left: dir === -1 ? -3 : 0,
      background: `linear-gradient(180deg, ${rgba(V.volt, 0.32 * hot)}, ${rgba(V.bone, 0.7 * hot)} 42%, ${rgba(V.volt, 0.26 * hot)})`,
    }} />
    <div style={{
      position: "absolute", top: 0, bottom: 0, width: 120,
      left: dir === -1 ? -123 : 3,
      background: dir === -1
        ? `linear-gradient(270deg, ${rgba(V.bone, 0.16 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(270deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.62)})`
        : `linear-gradient(90deg, ${rgba(V.bone, 0.16 * hot)}, rgba(0,0,0,0) 46%), linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.62)})`,
    }} />
  </div>
);
const CantoH: React.FC<{ y: number; x0: number; x1: number; hot: number }> = ({ y, x0, x1, hot }) => (
  <div style={{ position: "absolute", left: `${x0}%`, width: `${x1 - x0}%`, top: `${y}%`, height: 0 }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: 3, top: -3,
      background: `linear-gradient(90deg, ${rgba(V.sky, 0.2 * hot)}, ${rgba(V.bone, 0.62 * hot)} 50%, ${rgba(V.sky, 0.2 * hot)})`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, height: 96, top: -99,
      background: `linear-gradient(0deg, ${rgba(V.bone, 0.13 * hot)}, rgba(0,0,0,0) 60%), linear-gradient(0deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.6)})`,
    }} />
  </div>
);

// ── LA OCLUSIÓN (frontera C). NO uso `SeamOcclude` del Stage a propósito: su losa mide 320 % y
//    arranca en left −170 %, así que en p=0 YA está tapando la pantalla → aparece de golpe y se
//    lee como un flash a losa. Ésta entra desde fuera de cuadro, tapa el 100 % durante ~5 frames
//    y se va. El color es el del HORMIGÓN de la vereda del poste (la materia), nunca el del fondo.
const Ocluye: React.FC<{ at: number; dur?: number }> = ({ at, dur = 22 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const L = lerp(112, -162, esOut(p));
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-24%", left: `${L.toFixed(2)}%`, width: "150%", height: "148%",
        transform: "rotate(6deg)",
        background:
          `linear-gradient(96deg, ${rgba(V.bone, 0.5)} 0%, rgba(255,255,255,0) 2.4%),` +
          `linear-gradient(180deg, ${V.concrete} 0%, #56554F 46%, #3A3A35 100%)`,
        boxShadow: `0 0 120px ${rgba(V.ink0, 0.9)}`,
      }}>
        {/* vetas del hormigón: la losa tiene materia, no es un rectángulo plano */}
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${(rnd(i * 4.7) * 96).toFixed(1)}%`, left: `${(rnd(i * 2.3) * 70).toFixed(1)}%`,
            width: `${(12 + rnd(i * 8.1) * 30).toFixed(1)}%`, height: 2 + rnd(i * 5.5) * 5,
            background: rgba(V.ink0, 0.16 + rnd(i * 6.2) * 0.2), transform: `rotate(${(-2 + rnd(i * 3.1) * 4).toFixed(2)}deg)`,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── HOJAS DE PAPEL que cruzan (refuerzan el WIPE POR MATERIA de la frontera interna @2118) ────
const HojasCruzan: React.FC<{ at: number; dur?: number }> = ({ at, dur = 26 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const o = rnd(i * 3.7);
        const q = clamp01(p * 1.42 - o * 0.34);
        const x = lerp(-46, 138, esOut(q));
        const y = 6 + o * 66 + Math.sin(q * 3.1 + i) * 6;
        const rot = -26 + rnd(i * 9.3) * 52 + q * 90;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%`,
            width: 460 + o * 320, height: 300 + o * 200,
            transform: `rotate(${rot.toFixed(1)}deg) skewX(${(-8 + o * 16).toFixed(1)}deg)`,
            background: `linear-gradient(160deg, #F4F2E8 0%, #DCD9CB 54%, #B9B6A8 100%)`,
            boxShadow: `0 30px 80px ${rgba(V.ink0, 0.8)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── EL BLOQUE DE ENERGÍA (hormigón con el canto lamido por su luz y con ESPESOR) ──────────────
const Bloque: React.FC<{
  cx: number; cy: number; w: number; h: number; tint: string;
  ry?: number; rx?: number; lit?: number; ticks?: number; sinPiso?: boolean; pulse?: number;
}> = ({ cx, cy, w, h, tint, ry = 0, rx = 0, lit = 1, ticks = 0, sinPiso = false, pulse = 0 }) => {
  const k = 1 + pulse;
  return (
    <div style={{
      position: "absolute", left: `${xp(cx)}%`, top: `${pc(cy)}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      transform: `rotateY(${ry}deg) rotateX(${rx}deg) scale(${k.toFixed(4)})`,
      transformStyle: "preserve-3d",
      background: `linear-gradient(180deg, ${rgba(tint, 0.46 * lit)} 0%, ${rgba(tint, 0.2 * lit)} 26%, ${rgba(V.ink1, 0.98)} 100%)`,
      borderTop: `4px solid ${rgba(tint, 0.96 * lit)}`,
      boxShadow: `0 ${Math.round(h * 0.14)}px ${Math.round(h * 0.3)}px ${rgba(V.ink0, 0.86)}, ` +
        `0 0 ${Math.round(h * 0.34)}px ${rgba(tint, 0.3 * lit)}, inset -18px 0 34px ${rgba(V.ink0, 0.66)}`,
    }}>
      {ticks > 0 && (
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5 * lit,
          backgroundImage: `linear-gradient(90deg, ${rgba(V.bone, 0.34)} 1px, transparent 1px)`,
          backgroundSize: `${(w / ticks).toFixed(3)}px 100%`,
        }} />
      )}
      {/* el canto: tiene espesor, no es un rectángulo */}
      <div style={{
        position: "absolute", right: -16, top: 5, width: 16, height: Math.max(0, h - 5),
        background: `linear-gradient(180deg, ${rgba(tint, 0.2 * lit)}, ${rgba(V.ink0, 0.98)})`,
        transform: "skewY(-9deg)", transformOrigin: "left top",
      }} />
      {/* SOMBRA DE CONTACTO QUE NO ATERRIZA EN NADA: es lo que hace que el 53 duela */}
      {sinPiso && (
        <div style={{
          position: "absolute", left: "8%", right: "8%", bottom: -Math.round(h * 0.42), height: Math.round(h * 0.3),
          borderRadius: "50%", background: `radial-gradient(closest-side, ${rgba(V.ink0, 0.8)}, rgba(0,0,0,0) 74%)`,
          filter: "blur(14px)",
        }} />
      )}
    </div>
  );
};

// ── la cifra que VIAJA / CUENTA (Readout salta; esto se mueve con el objeto) ──────────────────
const Ticker: React.FC<{
  text: string; x: number; y: number; size: number; color: string; opacity?: number; scale?: number; unit?: string;
}> = ({ text, x, y, size, color, opacity = 1, scale = 1, unit }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    transform: `translate(-50%,-50%) scale(${scale.toFixed(3)})`,
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, opacity,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
  }}>
    {text}
    {unit && <span style={{ fontSize: Math.round(size * 0.34), marginLeft: 9, color: rgba(color, 0.84) }}>{unit}</span>}
  </div>
);

// ── rótulo de escena (detalle ≥30 px, cama oscura obligatoria sobre el negro) ─────────────────
const Rotulo: React.FC<{ children: React.ReactNode; x: number; y: number; color?: string; size?: number; op?: number }> = ({
  children, x, y, color = V.bone, size = 31, op = 1,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", opacity: op,
    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 3.2, color,
    textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.95)",
  }}>{children}</div>
);

// ── LOS "SIN": tags que ATERRIZAN (nada arranca de cero: entran con desplazamiento y escala) ──
const Tag: React.FC<{
  g: number; at: number; out: number; x: number; y: number; color?: string; children: React.ReactNode;
}> = ({ g, at, out, x, y, color = V.white, children }) => {
  const inP = es(clamp01((g - at) / 12));
  const outP = clamp01((g - out) / 14);
  if (g < at || outP >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      transform: `translate(-50%,-50%) translateY(${((1 - inP) * 30 + outP * 22).toFixed(1)}px) ` +
        `scale(${(0.9 + 0.1 * inP - outP * 0.06).toFixed(3)})`,
      opacity: Math.min(1, inP * 1.6) * (1 - outP),
    }}>
      <Bed pad={20}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 2, color,
          textTransform: "uppercase", lineHeight: 1.1, whiteSpace: "nowrap",
          textShadow: "0 4px 18px rgba(0,0,0,0.95)",
        }}>{children}</div>
      </Bed>
    </div>
  );
};

// ── LA FORMA MADRE, frame a frame. UN SOLO objeto del frame 6 al 1000. ───────────────────────
const panelAt = (g: number) => {
  const inn = es(clamp01((g - 6) / 46));        // sube al patio
  const park = es(clamp01((g - 152) / 58));     // se estaciona en el tercio izquierdo
  const grow = es(clamp01((g - 462) / 48));     // crece a pantalla completa (origen del MATCH-SHAPE)
  const lay = es(clamp01((g - 512) / 58));      // SE ACUESTA: ya es la barra de 142 kWh
  const w = lerp(lerp(lerp(600, 404, park), 2200, grow), 1380, lay);
  const h = lerp(lerp(lerp(348, 234, park), 1276, grow), 230, lay);
  const x = lerp(lerp(64, 15, park), 50, grow);
  const y = lerp(lerp(lerp(106, 56, inn), 34, park), 50, grow);
  return {
    w, h, cx: (x / 100) * 1920, cy: (lerp(y, 45, lay) / 100) * 1080,
    ry: lerp(lerp(-28, -15, park), 0, grow),
    rx: lerp(lerp(7, 0, grow), 6, lay),
    cells: lerp(1, 0.34, lay),
    inn, park, grow, lay,
  };
};

// ── EL 53: nace pegado al extremo derecho de la barra y se despega ────────────────────────────
const cincoAt = (g: number) => {
  const det = es(clamp01((g - 726) / 40));
  const dri = es(clamp01((g - 890) / 112));
  const away = esOut(clamp01((g - 1052) / 66));
  const cool = clamp01((g - 946) / 118);
  const p = panelAt(Math.min(g, 999));
  const barRight = p.cx + p.w / 2;
  const w0 = p.w * 0.3732;
  const cx0 = barRight - w0 / 2;
  return {
    cx: lerp(lerp(lerp(cx0, cx0 + 30, det), 1540, dri), 1706, away),
    cy: lerp(lerp(lerp(p.cy, p.cy - 34, det), 408, dri), -210, away),
    w: lerp(lerp(lerp(w0, w0 - 46, det), 380, dri), 190, away),
    h: lerp(lerp(lerp(p.h, p.h + 22, det), 232, dri), 104, away),
    ry: lerp(lerp(lerp(0, -17, det), -13, dri), -32, away),
    tint: light(cool, "amber", "sky"),
    det, dri, away, cool,
  };
};

// ── LA CÁMARA · una sola función de g, monótona, que NUNCA vuelve a cero ──────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -300, z1: 620, panX: -212, panY: 26, ry: -6.8, rx: 2.2, dur: G_END });
  const crane = interpolate(
    g,
    [0, 190, A2, 760, A3, 1150, A4, 1470, 1700, A5, 1900, 2118, G_END],
    [46, 14, -8, -30, -12, 18, -6, -40, -54, 30, 84, 120, 168],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  const push = interpolate(
    g,
    [0, 190, A2, 700, A3, 1150, A4, 1560, 1700, A5, 1790, 2118, 2300, G_END],
    [1.18, 1.0, 1.06, 1.0, 1.0, 1.05, 1.10, 1.26, 1.36, 1.40, 1.03, 1.0, 1.04, 1.0],
    { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) },
  );
  const fx = interpolate(g, [0, A2, A3, A4, 1600, A5, 2118, G_END], [58, 44, 50, 42, 44, 50, 52, 48], CL);
  const fy = interpolate(g, [0, A2, A3, A4, 1600, A5, 2118, G_END], [56, 48, 44, 52, 46, 50, 48, 46], CL);
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(4)})`
  );
};

// bezier cuadrática en px de la comp 1920×1080 (el camino que hace el dinero)
const qbez = (p: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
  const u = 1 - p;
  return { x: u * u * x0 + 2 * u * p * cx + p * p * x1, y: u * u * y0 + 2 * u * p * cy + p * p * y1 };
};

const dosDig = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovS1Trailer: React.FC<{ acto?: number; gFrame?: number }> = ({ gFrame }) => {
  const cf = useCurrentFrame();
  const g = gFrame === undefined ? cf : gFrame;
  const toCF = (t: number) => cf - g + t;      // pasa un frame mío al reloj interno de las primitivas

  // ── LA LUZ: función continua de g. Evoluciona, nunca salta entre actos. ──────────────────
  const sunAng = interpolate(
    g, [0, 120, A2, 760, A3, 1200, A4, 1470, 1700, 1790, 2118, G_END],
    [HORA.brasa.ang, HORA.limpio.ang, HORA.limpio.ang, HORA.cenital.ang, HORA.mediodia.ang,
      HORA.mediodia.ang, HORA.penumbra.ang, HORA.penumbra.ang, HORA.rasante.ang, HORA.papel.ang,
      HORA.papel.ang, HORA.cierre.ang], CL,
  );
  const amb = interpolate(
    g, [0, 15, 120, A2, 760, A3, 1160, A4, 1470, 1700, 1810, 2118, 2300, G_END],
    [HORA.brasa.amb, 0.5, HORA.limpio.amb, HORA.limpio.amb, HORA.cenital.amb, HORA.mediodia.amb,
      HORA.mediodia.amb, HORA.penumbra.amb, 0.3, HORA.rasante.amb, HORA.papel.amb, HORA.papel.amb,
      0.7, HORA.cierre.amb], CL,
  );
  const warmW = interpolate(g, [0, 120, A2, 700, A3, A4, 1470, 1700, 1830, 2118, 2300, G_END],
    [0.95, 0.5, 0.4, 0.2, 0.16, 0.3, 0.5, 0.9, 0.34, 0.36, 0.66, 0.86], CL);
  const coldW = interpolate(g, [0, A2, 700, 900, A3, 1160, A4, 1500, A5, 2118, G_END],
    [0.14, 0.3, 0.5, 0.62, 0.82, 0.88, 0.5, 0.2, 0.34, 0.4, 0.22], CL);
  const coolMix = interpolate(g, [0, A2, A3, 1160, A4, 1500, A5, G_END],
    [0, 0.1, 0.38, 0.8, 0.55, 0.14, 0.3, 0.1], CL);
  const keyFrom = interpolate(g, [0, A2, A3, A4, A5, G_END], [0.24, 0.4, 0.62, 0.3, 0.46, 0.7], CL);
  const inten = interpolate(g, [0, 15, A2, 760, 906, A3, A4, 1470, A5, 2118, G_END],
    [0.66, 1.0, 1.0, 1.08, 0.66, 1.05, 0.5, 0.74, 1.0, 1.0, 0.9], CL);
  const floorDim = interpolate(g, [0, A2, A3, A4, A5, G_END], [0.6, 0.55, 0.62, 0.82, 0.6, 0.55], CL);

  const cam = camAt(g);
  const cov = coverAt(g);
  const clip = clipOf(cov);
  const cantoHot = cov.open ? clamp01((cov.gR - cov.gL) / 24) : 0;

  const a1 = g < A2;
  const a2 = g >= A2 && g < A3;
  const a3 = g >= A3 && g < A4;
  const a4 = g >= A4 && g < A5;
  const a5 = g >= A5 - 20;                        // se monta 20 f antes: el zoom-through cae ADENTRO
  const z4 = g >= 1688 ? zoomThrough(g, 1688, 18, 44, 42) : null;
  const w4 = { transform: z4 ? z4.out : undefined, opacity: z4 ? z4.opacity : 1 };

  const pn = panelAt(g);
  const c53 = cincoAt(g);
  const verPanel = g < 1002;
  const ver53 = g >= 726 && g < 1122;

  // ACTO 2 · el vaciado de los 89 (la barra se vacía de izquierda a derecha)
  const drain = es(clamp01((g - 616) / 84));
  const money89 = qbez(drain, 620, 486, 700, 720, 470, 812);

  // ACTO 3 · el reloj de 11:00 a 15:00
  const relojP = es(clamp01((g - 1160) / 116));
  const mins = lerp(660, 900, relojP);
  const hora = `${Math.floor(mins / 60)}:${dosDig(Math.floor(mins % 60))}`;

  // ACTO 5 · el carrusel de los tres NO
  const spin = interpolate(g, [2126, 2152, 2176, 2196, 2222, 2258], [0, -1 / 3, -1 / 3, -1 / 3, -2 / 3, -2 / 3],
    { ...CL, easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const caen = esOut(clamp01((g - 2258) / 34)) * 1060;

  return (
    <AbsoluteFill>
      {/* ════ EL MUNDO — todo lo que puede tapar al avatar vive acá dentro, y ESTO es lo único
          que la apertura recorta. Ni un solo píxel de estas capas llega nunca a su cara. ════ */}
      <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
        {/* la atmósfera se monta UNA vez para los 81 s: nunca se remonta entre actos */}
        <VoltAtmos
          tint={light(coolMix, "volt", "sky")} tint2={V.amber}
          keyFrom={keyFrom} intensity={inten} floor={floorDim}
        />
        {/* el SOL es un personaje: su ángulo marca la hora. El FRÍO entra siempre desde arriba. */}
        <SunKey ang={sunAng} temp="torch" amb={warmW * amb} soft={66} />
        <SunKey ang={98} temp="sky" amb={coldW * amb * 0.8} soft={78} />

        <Layers cam={cam}>
          {/* ── ACTO 1 · el patio ──────────────────────────────────────────────────────── */}
          {a1 && (
            <>
              <Plane z={-820}>
                <PhotoPlane src="img/cmepanel30/cmep30_s1_patio_kit_amanecer.png" kind="photo" z={0}
                  scale={1.24} dim={interpolate(g, [0, 14, 300, A2], [0.5, 0.4, 0.38, 0.5], CL)} tint={V.volt} />
              </Plane>
              <Plane z={-520}>
                {/* el aire caliente del patio: estrías finas que suben (hold vivo del fondo) */}
                {Array.from({ length: 10 }, (_, i) => {
                  const o = rnd(i * 5.1);
                  const yy = ((rnd(i * 2.9) * 100 - (g * (0.3 + o * 0.5)) / 9) % 104 + 104) % 104;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${(6 + rnd(i * 7.3) * 88).toFixed(1)}%`, top: `${yy.toFixed(1)}%`,
                      width: 1.5, height: 40 + o * 90,
                      background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.torch, 0.12 + o * 0.1)}, rgba(0,0,0,0))`,
                    }} />
                  );
                })}
              </Plane>
            </>
          )}

          {/* ── ACTO 2 · la libreta de las 30 casillas al fondo ────────────────────────── */}
          {a2 && (
            <Plane z={-780}>
              <PhotoPlane src="img/cmepanel30/cmep30_s1_libreta_treinta_casillas.png" kind="photo" z={0}
                scale={1.3} dim={interpolate(g, [A2, 700, 906, A3], [0.64, 0.58, 0.86, 0.9], CL)} tint={V.sky} />
            </Plane>
          )}

          {/* ── LA FORMA MADRE: el MISMO PanelForm del frame 6 al 1000. Cruza la frontera A. ── */}
          {verPanel && (
            <Plane z={-280}>
              <div style={{
                position: "absolute", left: `${xp(pn.cx).toFixed(3)}%`, top: `${pc(pn.cy).toFixed(3)}%`,
                marginLeft: -pn.w / 2, marginTop: -pn.h / 2,
                transform: `rotateY(${pn.ry.toFixed(2)}deg) rotateX(${pn.rx.toFixed(2)}deg)`,
                transformStyle: "preserve-3d",
              }}>
                <PanelForm w={pn.w} h={pn.h} cells={pn.cells} tint="#0E1A2B">
                  {/* ACTO 1 · las 30 casillas del mes, encendiéndose una por una SOBRE el panel */}
                  {a1 && Array.from({ length: 30 }, (_, i) => {
                    const on = clamp01((g - 16 - i * 3.6) / 8);
                    const col = i % 6, row = Math.floor(i / 6);
                    const cw = pn.w / 6, ch = pn.h / 5;
                    return (
                      <div key={i} style={{
                        position: "absolute", left: col * cw + cw * 0.1, top: row * ch + ch * 0.1,
                        width: cw * 0.8, height: ch * 0.8,
                        background: `linear-gradient(160deg, ${rgba(V.volt, 0.5 * on)}, ${rgba(V.volt, 0.12 * on)})`,
                        boxShadow: on > 0.4 ? `inset 0 0 ${Math.round(ch * 0.3)}px ${rgba(V.volt, 0.4 * on)}` : undefined,
                        transform: `scale(${(0.72 + 0.28 * on).toFixed(3)})`,
                      }} />
                    );
                  })}
                  {/* ACTO 2 · los 142 ticks: la grilla del panel ES la escala de kWh (MATCH-SHAPE) */}
                  {pn.lay > 0.02 && (
                    <>
                      <div style={{
                        position: "absolute", inset: 0, opacity: 0.44 * pn.lay,
                        backgroundImage: `linear-gradient(90deg, ${rgba(V.bone, 0.5)} 1px, transparent 1px)`,
                        backgroundSize: `${(pn.w / 142).toFixed(3)}px 100%`,
                      }} />
                      <div style={{
                        position: "absolute", inset: 0, opacity: 0.6 * pn.lay,
                        backgroundImage: `linear-gradient(90deg, ${rgba(V.bone, 0.72)} 2px, transparent 2px)`,
                        backgroundSize: `${(pn.w / 14.2).toFixed(3)}px 100%`,
                      }} />
                      {/* EL RELLENO: los 142 kWh producidos. Se VACÍA de izquierda a derecha:
                          los 89 se van a la factura y lo que queda encendido es el 53. */}
                      <div style={{
                        position: "absolute", inset: 0, opacity: pn.lay * (g < 738 ? 1 : clamp01(1 - (g - 738) / 10)),
                        clipPath: `inset(0% 0% 0% ${(drain * 62.68).toFixed(2)}%)`,
                        background: `linear-gradient(180deg, ${rgba(V.amber, 0.5)} 0%, ${rgba(V.amber, 0.2)} 30%, ${rgba(V.voltSoft, 0.16)} 100%)`,
                        boxShadow: `inset 0 3px 0 ${rgba(V.amber, 0.9)}`,
                      }} />
                    </>
                  )}
                </PanelForm>
              </div>
            </Plane>
          )}

          {/* ── ACTO 3 · el mediodía: la casa vacía y el sol cruzando ──────────────────── */}
          {a3 && (
            <>
              <Plane z={-820}>
                <PhotoPlane src="img/cmepanel30/cmep30_s1_casa_vacia_mediodia.png" kind="photo" z={0}
                  scale={1.22} dim={interpolate(g, [1150, 1210, A4], [0.72, 0.5, 0.52], CL)} tint={V.sky} />
              </Plane>
              <Plane z={-420}>
                {/* el arco del sol de 11 a 3, y la sombra del panel girando en el piso */}
                <div style={{
                  position: "absolute", left: `${lerp(24, 76, relojP).toFixed(2)}%`,
                  top: `${(13 + Math.sin(relojP * Math.PI) * -4).toFixed(2)}%`,
                  width: 190, height: 190, marginLeft: -95, borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(V.torch, 0.95)} 0%, ${rgba(V.torch, 0.34)} 34%, rgba(0,0,0,0) 70%)`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: 858, width: 760, height: 34, marginLeft: -380,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.86)} 22%, ${rgba(V.ink0, 0.86)} 78%, rgba(0,0,0,0))`,
                  transform: `rotate(${lerp(-16, 16, relojP).toFixed(2)}deg) scaleX(${lerp(1.5, 0.7, Math.sin(relojP * Math.PI)).toFixed(3)})`,
                  filter: "blur(6px)",
                }} />
              </Plane>
            </>
          )}

          {/* ── ACTO 5 · adentro de la casa (se monta 20 f antes: salimos del túnel EN ella) ── */}
          {a5 && (
            <>
              <Plane z={-860}>
                <PhotoPlane src="img/cmepanel30/cmep30_s1_claudio_medidor_libreta.png" kind="photo" z={0}
                  scale={1.26} dim={interpolate(g, [1686, 1780, 2118, 2288, G_END], [0.8, 0.54, 0.56, 0.62, 0.5], CL)} tint={V.sky} />
              </Plane>
              <Plane z={-460}>
                {/* la bifurcación: ARRIBA y en FRÍO lo que te sacan · ABAJO y en CÁLIDO lo que queda */}
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 900 470 Q 640 350 420 246" fill="none" stroke={V.sky} strokeWidth={5} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((g - 1874) / 54)}
                      style={{ filter: `drop-shadow(0 0 16px ${rgba(V.sky, 0.6)})` }} />
                    <path d="M 980 560 Q 1290 720 1510 800" fill="none" stroke={V.amber} strokeWidth={6} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((g - 1912) / 58)}
                      style={{ filter: `drop-shadow(0 0 20px ${rgba(V.amber, 0.66)})` }} />
                  </svg>
                </AbsoluteFill>
              </Plane>
            </>
          )}
          {/* ── ACTO 4 · la penumbra del escalón, y después el panel exonerado ─────────── */}
          {a4 && (
            <AbsoluteFill style={{ ...w4, transformStyle: "preserve-3d" }}>
              <Plane z={-820}>
                <PhotoPlane src="img/cmepanel30/cmep30_s1_claudio_junto_kit.png" kind="photo" z={0}
                  scale={1.3} dim={interpolate(g, [A4, 1466, 1560, A5], [0.86, 0.8, 0.6, 0.58], CL)} tint={V.amber} />
              </Plane>
              {/* EL PANEL VUELVE, entero, iluminado desde ABAJO: hizo lo que dijo que iba a hacer */}
              {g >= 1466 && (
                <Plane z={-300}>
                  <div style={{
                    position: "absolute", left: "43%", top: "48%", marginLeft: -490, marginTop: -280,
                    transform: `rotateY(${lerp(-19, -6, es(clamp01((g - 1470) / 220))).toFixed(2)}deg) rotateX(4deg)`,
                    transformStyle: "preserve-3d",
                  }}>
                    <PanelForm w={980} h={560} cells={1} tint="#0E1A2B" />
                  </div>
                  <div style={{
                    position: "absolute", left: "43%", top: "78%", width: 900, height: 220, marginLeft: -450,
                    background: `radial-gradient(60% 100% at 50% 0%, ${rgba(V.amber, 0.26)} 0%, rgba(0,0,0,0) 72%)`,
                  }} />
                  {/* LA CELDA por la que vamos a entrar (frontera D · zoom-through) */}
                  <div style={{
                    position: "absolute", left: "44%", top: "42%", width: 152, height: 132, marginLeft: -76, marginTop: -66,
                    border: `2px solid ${rgba(V.volt, 0.5 + 0.4 * clamp01((g - 1640) / 48))}`,
                    background: `radial-gradient(circle, ${rgba(V.volt, 0.28 * clamp01((g - 1640) / 48))}, rgba(0,0,0,0) 72%)`,
                    boxShadow: `0 0 ${Math.round(40 * clamp01((g - 1640) / 48))}px ${rgba(V.volt, 0.6)}`,
                  }} />
                </Plane>
              )}
            </AbsoluteFill>
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
          vive en x<26 % o x>74 %: nunca en la caja de la cara. ════ */}
      <Layers cam={cam}>

        {/* ═══ ACTO 1 · LOS TREINTA DÍAS ══════════════════════════════════════════════════ */}
        {a1 && (
          <>
            <Plane z={110}>
              {/* el sol cruzando los paneles: 30 días en un clip */}
              {g >= 40 && g < 348 && (
                <MediaCard src="broll/cmepanel30/cmep30_s1_clip_sol_cruza_paneles.mp4" kind="video"
                  w={400} h={236}
                  x={lerp(106, 82.5, es(clamp01((g - 40) / 34))) + lerp(0, 26, es(clamp01((g - 330) / 20)))}
                  y={32} z={0} ry={-13} rx={2} startFrom={12} lit={0.95} litColor={V.volt}
                  label="30 DÍAS" sheenAt={toCF(66)} radius={10} />
              )}
            </Plane>
            <Plane z={150}>
              {/* "enchufado a un tomacorriente común" — entra cuando se abre la apertura */}
              {g >= 176 && g < 372 && (
                <MediaCard src="broll/cmepanel30/cmep30_s1_clip_enchufar_panel.mp4" kind="video"
                  w={370} h={222}
                  x={18} y={lerp(112, 68, es(clamp01((g - 176) / 34))) + lerp(0, 48, es(clamp01((g - 348) / 24)))}
                  z={0} ry={12} rx={-2} startFrom={10} lit={1} litColor={V.amber}
                  label="UN ENCHUFE COMÚN" sheenAt={toCF(206)} radius={10} />
              )}
              {/* "el mismo donde antes conectaba la lavadora" */}
              {g >= 256 && g < 356 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_enchufe.png" x={17} y={44}
                    size={lerp(0, 104, es(clamp01((g - 256) / 18)))} z={0} opacity={1} glow={V.ink0} />
                  <Rotulo x={17} y={53} color={rgba(V.bone, 0.92)} size={30} op={clamp01((g - 270) / 12)}>
                    EL DE LA LAVADORA
                  </Rotulo>
                </>
              )}
              {/* "sin abrir el tablero" — el tablero, cerrado y con candado */}
              {g >= 396 && g < 506 && (
                <>
                  <MediaCard src="img/cmepanel30/cmep30_s1_tablero_cerrado.png" kind="photo"
                    w={370} h={222} x={82} y={lerp(114, 58, es(clamp01((g - 396) / 32)))} z={0}
                    ry={-12} rx={2} lit={0.9} litColor={V.sky} label="EL TABLERO" sheenAt={toCF(424)} radius={10} />
                  <IconPng src="img/cmepanel30/cmep30_ic_candado.png" x={88} y={46}
                    size={lerp(0, 86, es(clamp01((g - 420) / 16)))} z={0} opacity={0.96} glow={V.ink0} />
                </>
              )}
            </Plane>

            {/* EL NÚMERO 30: nace grande en el centro (todavía tapado el avatar) y viaja al
                tercio izquierdo antes de que la apertura llegue a abrirse. */}
            <Plane z={60}>
              {g >= 20 && (
                <Ticker
                  text="30" unit="DÍAS"
                  x={lerp(33, 14, es(clamp01((g - 150) / 60)))}
                  y={lerp(31, 22, es(clamp01((g - 150) / 60)))}
                  size={lerp(196, 76, es(clamp01((g - 150) / 60)))}
                  scale={1 + (1 - clamp01((g - 20) / 10)) * 0.14}
                  color={V.volt}
                />
              )}
              {g >= 34 && g < 160 && (
                <IconPng src="img/cmepanel30/cmep30_ic_calendario.png" x={44} y={31}
                  size={lerp(0, 118, es(clamp01((g - 34) / 16)))} z={0}
                  opacity={clamp01(1 - (g - 138) / 22)} glow={V.ink0} />
              )}
            </Plane>

            {/* LOS CUATRO "SIN": una sola idea, escalonada en el tiempo, siempre en los tercios */}
            <Plane z={60}>
              <Tag g={g} at={332} out={424} x={17} y={13}>SIN ELECTRICISTA</Tag>
              <Tag g={g} at={356} out={424} x={83} y={13}>SIN PERMISO</Tag>
              <Tag g={g} at={402} out={488} x={83} y={86}>SIN ABRIR<br />EL TABLERO</Tag>
              <Tag g={g} at={434} out={488} x={17} y={86} color={V.volt}>SIN TOCAR<br />UN CABLE</Tag>
            </Plane>
          </>
        )}

        {/* ═══ ACTO 2 · LOS NÚMEROS ═══════════════════════════════════════════════════════ */}
        {a2 && (
          <>
            {/* 142 — el instrumento que lo midió, y la cifra que SALTA */}
            <Plane z={150}>
              {g >= 540 && g < 902 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_pinza_142.png" kind="photo"
                  w={390} h={234}
                  x={lerp(112, 79, es(clamp01((g - 540) / 34))) + lerp(0, 30, es(clamp01((g - 880) / 22)))}
                  y={22} z={0} ry={-13} rx={2} lit={1} litColor={V.volt}
                  label="LO QUE MIDIÓ LA PINZA" sheenAt={toCF(576)} radius={10} />
              )}
              {g >= 568 && g < 986 && (
                <Readout
                  value="142" unit="kWh" at={toCF(568)}
                  x={lerp(lerp(37, 15, es(clamp01((g - 700) / 60))), -18, esOut(clamp01((g - 946) / 40)))}
                  y={lerp(lerp(30, 15, es(clamp01((g - 700) / 60))), 20, es(clamp01((g - 946) / 40)))}
                  size={lerp(150, 86, es(clamp01((g - 700) / 60)))} color={V.volt}
                />
              )}
              {g >= 578 && g < 706 && (
                <Rotulo x={37} y={38} color={rgba(V.bone, 0.86)} size={31}
                  op={clamp01((g - 578) / 12) * clamp01(1 - (g - 690) / 14)}>
                  LO QUE PRODUJO EL PANEL
                </Rotulo>
              )}
            </Plane>

            {/* LOS 89 SE VAN A LA FACTURA: la masa cálida sale de la barra y entra por ABAJO */}
            <Plane z={130}>
              {g >= 600 && g < 960 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_claudio_factura_mano.png" kind="photo"
                  w={430} h={262} x={24}
                  y={lerp(116, 76, es(clamp01((g - 600) / 36))) + lerp(0, 52, es(clamp01((g - 928) / 26)))}
                  z={0} ry={11} rx={-2} lit={1} litColor={V.amber}
                  label="MI FACTURA" sheenAt={toCF(700)} radius={10} />
              )}
              {drain > 0.01 && drain < 0.995 && (
                <>
                  <div style={{
                    position: "absolute", left: `${xp(money89.x).toFixed(2)}%`, top: `${pc(money89.y).toFixed(2)}%`,
                    width: lerp(760, 150, drain), height: lerp(200, 52, drain),
                    marginLeft: -lerp(760, 150, drain) / 2, marginTop: -lerp(200, 52, drain) / 2,
                    borderRadius: lerp(4, 10, drain),
                    background: `linear-gradient(180deg, ${rgba(V.amber, 0.62)} 0%, ${rgba(V.amber, 0.24)} 60%, ${rgba(V.amber, 0.1)} 100%)`,
                    boxShadow: `0 0 ${Math.round(lerp(90, 30, drain))}px ${rgba(V.amber, 0.5)}, inset 0 3px 0 ${rgba(V.amber, 0.9)}`,
                    transform: `rotate(${lerp(0, 13, drain).toFixed(2)}deg)`,
                  }} />
                  <Ticker text="−89" unit="kWh" x={xp(money89.x)} y={pc(money89.y - 118)}
                    size={lerp(112, 74, drain)} color={V.amber} />
                </>
              )}
              {g >= 700 && g < 946 && (
                <Rotulo x={24} y={90} color={rgba(V.amber, 0.95)} size={31}
                  op={clamp01((g - 700) / 14) * clamp01(1 - (g - 920) / 20)}>
                  ESO SÍ ME LO DESCONTARON
                </Rotulo>
              )}
            </Plane>

            {/* "que sí entraron a mi casa" — el medidor, material real, entra por ABAJO y cálido */}
            <Plane z={180}>
              {g >= 790 && g < 934 && (() => {
                const fl = flujo("queda", clamp01((g - 790) / 30));
                return (
                  <>
                    <MediaCard src="broll/cmepanel30/cmep30_s1_clip_medidor_led_parpadea.mp4" kind="video"
                      w={356} h={216} x={78}
                      y={78 + pc(fl.dy) + lerp(0, 26, es(clamp01((g - 906) / 24)))}
                      z={0} ry={-12} rx={2} startFrom={14} lit={1} litColor={V.amber}
                      label="SÍ ENTRARON A MI CASA" sheenAt={toCF(824)} radius={10} opacity={1} />
                    <IconPng src="img/cmepanel30/cmep30_ic_casa.png" x={87} y={62}
                      size={lerp(0, 88, es(clamp01((g - 812) / 18)))} z={0} opacity={0.94} glow={V.ink0} />
                  </>
                );
              })()}
            </Plane>

            {/* EL TITULAR DEL ACTO (la apertura está cerrada: puede vivir en el centro) */}
            {g >= 902 && g < 992 && (
              <Plane z={220}>
                <div style={{
                  position: "absolute", left: "31%", top: `${lerp(84, 76, es(clamp01((g - 902) / 22))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 902) / 10) * clamp01(1 - (g - 974) / 18),
                }}>
                  <Head size={62} color={V.white}>NADIE ME LO DESCONTÓ</Head>
                </div>
              </Plane>
            )}
          </>
        )}

        {/* ═══ EL 53 · el único objeto que sobrevive al CORTE del frame 1000 ═════════════ */}
        {ver53 && (
          <Plane z={lerp(-280, 180, c53.det)}>
            <Bloque
              cx={c53.cx} cy={c53.cy} w={c53.w} h={c53.h} tint={c53.tint}
              ry={c53.ry} rx={3} lit={1} ticks={53}
              sinPiso={c53.det > 0.3}
              pulse={c53.det > 0.5 ? Math.sin(g / 8.5) * 0.011 : 0}
            />
            <Readout
              value="53" unit="kWh" label={g < 900 ? "LO QUE FALTA" : "NO ME LO DIERON"}
              at={toCF(732)}
              x={xp(c53.cx)} y={pc(c53.cy)}
              size={lerp(lerp(lerp(196, 214, c53.det), 150, c53.dri), 132, c53.away)} color={c53.tint}
            />
          </Plane>
        )}

        {/* ═══ ACTO 3 · A DÓNDE FUERON ════════════════════════════════════════════════════ */}
        {a3 && (
          <>
            {/* el titular: nace en el tercio izquierdo y sólo se centra cuando la guillotina
                ya pasó por ese punto — nunca se apoya sobre la cara. */}
            <Plane z={210}>
              {g >= 1058 && g < 1272 && (() => {
                const k = clamp01(((cov.open ? cov.sh : 100) - 42) / 46);
                return (
                  <div style={{
                    position: "absolute", left: `${lerp(17, 31, k).toFixed(2)}%`, top: `${lerp(44, 29, k).toFixed(2)}%`,
                    transform: `translate(-50%,-50%) translateY(${(es(clamp01((g - 1246) / 26)) * 90).toFixed(1)}px)`,
                    opacity: clamp01((g - 1058) / 12) * clamp01(1 - (g - 1252) / 18),
                  }}>
                    <Head size={lerp(52, 78, k)} color={V.white}>SE LOS<br />REGALÉ</Head>
                  </div>
                );
              })()}
            </Plane>

            {/* el cable de la calle: entra desde ARRIBA y en FRÍO (lo que te cobran) */}
            <Plane z={120}>
              {g >= 1150 && (() => {
                const fl = flujo("cobran", clamp01((g - 1150) / 34));
                return (
                  <MediaCard src="broll/cmepanel30/cmep30_s1_clip_cable_poste_calle.mp4" kind="video"
                    w={620} h={372} x={66} y={54 + pc(fl.dy)} z={0} ry={-10} rx={2}
                    startFrom={16} lit={0.94} litColor={V.sky}
                    label="A LA COMPAÑÍA DE LUZ" sheenAt={toCF(1196)} radius={10} />
                );
              })()}
              {g >= 1188 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_claudio_espalda_poste.png" kind="photo"
                  w={400} h={240} x={lerp(-16, 23, es(clamp01((g - 1188) / 32)))} y={70} z={0}
                  ry={13} rx={-2} lit={0.9} litColor={V.sky}
                  label="TODOS LOS DÍAS" sheenAt={toCF(1236)} radius={10} />
              )}
            </Plane>

            {/* el reloj de 11:00 a 15:00 — el número como objeto, con su instrumento al lado */}
            <Plane z={90}>
              {g >= 1158 && (
                <>
                  <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={38} y={17} size={92} z={0}
                    opacity={clamp01((g - 1158) / 14)} glow={V.ink0} />
                  <Ticker text={hora} x={49} y={17} size={92} color={V.sky}
                    opacity={clamp01((g - 1158) / 14)} />
                  <Rotulo x={49} y={24} color={rgba(V.sky, 0.9)} size={30} op={clamp01((g - 1178) / 16)}>
                    MIENTRAS YO NO ESTABA
                  </Rotulo>
                </>
              )}
              {g >= 1148 && (
                <IconPng src="img/cmepanel30/cmep30_ic_sol.png" x={lerp(24, 76, relojP)} y={13}
                  size={78} z={0} opacity={0.9 * clamp01((g - 1148) / 12)} glow={V.torch} />
              )}
            </Plane>

            {/* el regalo, día tras día: pequeños 53 que suben en frío por el cable y se van */}
            <Plane z={240}>
              {g >= 1186 && Array.from({ length: 7 }, (_, i) => {
                const t = clamp01((g - 1186 - i * 13) / 74);
                if (t <= 0 || t >= 1) return null;
                const e = esOut(t);
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${(60 + rnd(i * 4.4) * 12 + e * 6).toFixed(2)}%`,
                    top: `${lerp(66, -10, e).toFixed(2)}%`, transform: "translate(-50%,-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: lerp(58, 30, e),
                    color: rgba(V.sky, 0.9), textShadow: `0 0 24px ${rgba(V.sky, 0.6)}, 0 4px 16px rgba(0,0,0,0.9)`,
                  }}>53</div>
                );
              })}
            </Plane>
          </>
        )}

        {/* ═══ ACTO 5 · EL NÚMERO ESCONDIDO ═══════════════════════════════════════════════ */}
        {a5 && (
          <>
            {/* EL HUECO DEL NÚMERO: material real (el medidor parpadeando) con el "??" encima */}
            <Plane z={80}>
              {g >= 1706 && g < 2124 && (
                <MediaCard src="broll/cmepanel30/cmep30_s1_clip_medidor_led_parpadea.mp4" kind="video"
                  w={760} h={430} x={46}
                  y={lerp(58, 46, es(clamp01((g - 1712) / 46))) + lerp(0, 30, es(clamp01((g - 2098) / 26)))}
                  z={0} ry={-8} rx={3} startFrom={8} lit={1} litColor={V.sky}
                  label="EL NÚMERO DE TU CASA" sheenAt={toCF(1760)} radius={12} />
              )}
              {g >= 1748 && g < 2116 && (
                <>
                  <div style={{
                    position: "absolute", left: "46%", top: `${(lerp(58, 46, es(clamp01((g - 1712) / 46))) - 1).toFixed(2)}%`,
                    transform: `translate(-50%,-50%) scale(${(1 + Math.sin(g / 11) * 0.016).toFixed(4)})`,
                    opacity: clamp01((g - 1748) / 14),
                  }}>
                    <Num size={186} color={rgba(V.bone, 0.9)}>??</Num>
                  </div>
                  <IconPng src="img/cmepanel30/cmep30_ic_lupa.png"
                    x={46 + Math.cos(g / 34) * 11} y={44 + Math.sin(g / 34) * 9}
                    size={96} z={0} opacity={0.9 * clamp01((g - 1772) / 16)} glow={V.ink0} />
                  <IconPng src="img/cmepanel30/cmep30_ic_candado.png" x={62} y={31}
                    size={78} z={0} opacity={0.85 * clamp01((g - 1790) / 16)} glow={V.ink0} />
                </>
              )}
            </Plane>

            {/* EL TITULAR DEL ACTO (apertura cerrada: puede vivir centrado y grande) */}
            <Plane z={210}>
              {g >= 1792 && g < 2112 && (
                <div style={{
                  position: "absolute", left: "50%", top: `${lerp(88, 82, es(clamp01((g - 1792) / 24))).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((g - 1792) / 12) * clamp01(1 - (g - 2094) / 18),
                }}>
                  <Head size={62} color={V.white}>UN NÚMERO QUE NUNCA MEDÍ</Head>
                </div>
              )}
            </Plane>

            {/* LA BIFURCACIÓN: arriba y frío lo que te sacan · abajo y cálido lo que te queda */}
            <Plane z={160}>
              {g >= 1930 && g < 2110 && (() => {
                const fl = flujo("queda", clamp01((g - 1930) / 32));
                return (
                  <MediaCard src="img/cmepanel30/cmep30_s1_dos_facturas.png" kind="photo"
                    w={392} h={236} x={79} y={76 + pc(fl.dy) + lerp(0, 26, es(clamp01((g - 2086) / 22)))}
                    z={0} ry={-12} rx={2} lit={1} litColor={V.amber}
                    label="UNA FORTUNA" sheenAt={toCF(1978)} radius={10} />
                );
              })()}
              {g >= 1896 && g < 2110 && (() => {
                const fl = flujo("cobran", clamp01((g - 1896) / 32));
                return (
                  <div style={{
                    position: "absolute", left: "21%", top: `${(22 + pc(fl.dy)).toFixed(2)}%`,
                    transform: "translate(-50%,-50%)", textAlign: "center",
                    opacity: clamp01(1 - (g - 2086) / 22),
                  }}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 116, lineHeight: 0.9, color: V.sky,
                      textShadow: `0 0 46px ${rgba(V.sky, 0.44)}, 0 6px 24px rgba(0,0,0,0.94)`,
                    }}>LA MITAD</div>
                    <div style={{ marginTop: 12 }}>
                      <Body size={31} color={rgba(V.sky, 0.92)}>de lo que podría ahorrarte</Body>
                    </div>
                  </div>
                );
              })()}
            </Plane>

            {/* LOS TRES "NO": tres tarjetas con material real orbitando en un cilindro de verdad */}
            <Plane z={40}>
              {g >= 2122 && g < 2300 && (
                <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateY(${caen.toFixed(1)}px)` }}>
                  <Carousel3D
                    items={[
                      { src: "img/cmepanel30/cmep30_s1_caja_kit_carton.png", kind: "photo", label: "NO ESTÁ EN LA CAJA" },
                      { src: "img/cmepanel30/cmep30_s1_manual_hojas.png", kind: "photo", label: "NI EN EL MANUAL" },
                      { src: "broll/cmepanel30/cmep30_s1_clip_hojas_libreta_viento.mp4", kind: "video", label: "NI QUIEN TE LO VENDE" },
                    ]}
                    spin={spin} radius={620} cardW={452} cardH={272} y={46} focus={0} litColor={V.sky}
                  />
                  {["NO ESTÁ EN LA CAJA", "NI EN EL MANUAL", "NI QUIEN TE LO VENDE"].map((t, i) => {
                    const at = [2130, 2178, 2224][i];
                    const op = clamp01((g - at) / 10) * clamp01(1 - (g - at - 54) / 14);
                    if (op <= 0) return null;
                    return (
                      <div key={`h${i}`} style={{
                        position: "absolute", left: "50%", top: "16%", transform: "translate(-50%,-50%)",
                        opacity: op, whiteSpace: "nowrap",
                      }}>
                        <Head size={54} color={i === 2 ? V.danger : V.white}>{t}</Head>
                      </div>
                    );
                  })}
                  {[2140, 2186, 2232].map((at, i) => {
                    const t = clamp01((g - at) / 14);
                    if (t <= 0) return null;
                    return (
                      <div key={i} style={{
                        position: "absolute", left: "50%", top: "46%", width: 700, height: 9, marginLeft: -350,
                        transform: `rotate(-8deg) scaleX(${t.toFixed(3)})`, transformOrigin: "left center",
                        background: `linear-gradient(90deg, ${rgba(V.danger, 0.9)}, ${rgba(V.danger, 0.55)})`,
                        boxShadow: `0 0 26px ${rgba(V.danger, 0.6)}`,
                        opacity: clamp01(1 - (g - at - 62) / 20),
                      }} />
                    );
                  })}
                </AbsoluteFill>
              )}
            </Plane>

            {/* EL CIERRE: la persiana levanta, Claudio limpio, y los números como objetos */}
            <Plane z={150}>
              {g >= 2300 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_mesa_lo_que_tienes.png" kind="photo"
                  w={392} h={236}
                  x={19 - lerp(0, 8, es(clamp01((g - 2410) / 42)))}
                  y={lerp(120, 64, es(clamp01((g - 2300) / 38)))} z={0}
                  ry={12} rx={-2} lit={1} litColor={V.amber}
                  label="LO QUE YA TIENES EN CASA" sheenAt={toCF(2352)} radius={10} />
              )}
              {g >= 2324 && (
                <MediaCard src="broll/cmepanel30/cmep30_s1_clip_pinza_enciende.mp4" kind="video"
                  w={382} h={230}
                  x={lerp(116, 82, es(clamp01((g - 2324) / 36))) + lerp(0, 8, es(clamp01((g - 2410) / 42)))}
                  y={36} z={0} ry={-12} rx={2} startFrom={10} lit={1} litColor={V.volt}
                  label="LA PINZA" sheenAt={toCF(2380)} radius={10} />
              )}
            </Plane>
            <Plane z={90}>
              {g >= 2316 && (() => {
                const fl = flujo("queda", clamp01((g - 2316) / 28));
                return (
                  <>
                    <IconPng src="img/cmepanel30/cmep30_ic_billete.png" x={16} y={20 + pc(fl.dy)}
                      size={96} z={0} opacity={0.95} glow={V.ink0} />
                    <Ticker text="$0" x={16} y={30 + pc(fl.dy)} size={116} color={V.amber} />
                    <Rotulo x={16} y={37 + pc(fl.dy)} color={rgba(V.amber, 0.95)} size={31}>HOY, GRATIS</Rotulo>
                  </>
                );
              })()}
              {g >= 2354 && (() => {
                const fl = flujo("queda", clamp01((g - 2354) / 28));
                return (
                  <>
                    <IconPng src="img/cmepanel30/cmep30_ic_reloj.png" x={84} y={62 + pc(fl.dy)}
                      size={92} z={0} opacity={0.95} glow={V.ink0} />
                    <Ticker text="10" unit="MIN" x={84} y={73 + pc(fl.dy)} size={112} color={V.volt} />
                  </>
                );
              })()}
            </Plane>
          </>
        )}
        {/* ═══ ACTO 4 · LA HERIDA ═════════════════════════════════════════════════════════ */}
        {a4 && (
          <AbsoluteFill style={{ ...w4, transformStyle: "preserve-3d" }}>
            {/* ventana de avatar: sólo tercios. El escalón a la izquierda, la factura a la derecha */}
            <Plane z={150}>
              {g >= 1300 && g < 1456 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_claudio_sentado_escalon.png" kind="photo"
                  w={390} h={234}
                  x={lerp(-14, 18, es(clamp01((g - 1300) / 34))) - lerp(0, 34, es(clamp01((g - 1414) / 30)))}
                  y={58} z={0} ry={12} rx={-2} lit={0.86} litColor={V.sky}
                  label="EL ESCALÓN" sheenAt={toCF(1338)} radius={10} />
              )}
              {g >= 1322 && g < 1456 && (
                <MediaCard src="broll/cmepanel30/cmep30_s1_clip_claudio_mira_factura.mp4" kind="video"
                  w={380} h={228}
                  x={lerp(114, 82, es(clamp01((g - 1322) / 34))) + lerp(0, 34, es(clamp01((g - 1414) / 30)))}
                  y={38} z={0} ry={-12} rx={2} startFrom={12} lit={0.9} litColor={V.sky}
                  label="LA MITAD, OTRA VEZ" sheenAt={toCF(1364)} radius={10} />
              )}
            </Plane>

            {/* el 53 vuelve, ya frío y chico, y se posa sobre el escalón: la herida */}
            <Plane z={200}>
              {g >= 1310 && g < 1440 && (() => {
                const t = es(clamp01((g - 1310) / 62));
                return (
                  <Ticker text="53" x={lerp(22, 16, t)} y={lerp(-10, 45, t)}
                    size={lerp(96, 66, t)} color={V.sky}
                    opacity={clamp01(1 - (g - 1414) / 24)} />
                );
              })()}
            </Plane>

            {/* EL TITULAR DEL ACTO: tres líneas para que entre entero en la banda izquierda */}
            <Plane z={120}>
              {g >= 1352 && g < 1462 && (
                <div style={{
                  position: "absolute", left: "19%", top: "82%", transform: "translate(-50%,-50%)",
                  opacity: clamp01((g - 1352) / 12) * clamp01(1 - (g - 1440) / 18),
                }}>
                  <Bed pad={22}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 1.02, color: V.white,
                      textTransform: "uppercase", textShadow: "0 6px 26px rgba(0,0,0,0.95)",
                    }}>EL PROBLEMA<br /><span style={{ color: V.volt }}>NO ERA<br />EL PANEL</span></div>
                  </Bed>
                </div>
              )}
            </Plane>

            {/* EL PANEL EXONERADO: prometía 142, dio 142. Y el 142 se MUEVE de la etiqueta a la
                pinza con la misma velocidad y la misma dirección (MATCH-MOVE interno @1548). */}
            <Plane z={140}>
              {g >= 1490 && (
                <Readout value="142" unit="kWh" label="LO QUE PROMETÍA" at={toCF(1490)}
                  x={74} y={30} size={150} color={rgba(V.bone, 0.92)} />
              )}
              {g >= 1546 && (
                <Readout value="142" unit="kWh" label="LO QUE DIO" at={toCF(1546)}
                  x={74} y={64} size={150} color={V.volt} />
              )}
              {g >= 1552 && (
                <div style={{
                  position: "absolute", left: "74%", top: "47%", transform: "translate(-50%,-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 88, color: V.volt,
                  opacity: clamp01((g - 1552) / 10),
                  textShadow: `0 0 40px ${rgba(V.volt, 0.6)}, 0 6px 22px rgba(0,0,0,0.92)`,
                }}>=</div>
              )}
              {g >= 1560 && (
                <MediaCard src="img/cmepanel30/cmep30_s1_pinza_142.png" kind="photo"
                  w={420} h={252} x={21} y={lerp(118, 70, es(clamp01((g - 1560) / 34)))} z={0}
                  ry={13} rx={-2} lit={1} litColor={V.volt} label="LA PINZA" sheenAt={toCF(1608)} radius={10} />
              )}
              {g >= 1596 && g < 1660 && (() => {
                const t = clamp01((g - 1596) / 52);      // velocidad CONSTANTE: es un match-move
                return <Ticker text="142" x={lerp(43, 21, t)} y={lerp(44, 62, t)} size={lerp(96, 62, t)} color={V.volt} />;
              })()}
              {g >= 1636 && (
                <Rotulo x={43} y={80} color={rgba(V.amber, 0.95)} size={34} op={clamp01((g - 1636) / 14)}>
                  EL PANEL CUMPLIÓ
                </Rotulo>
              )}
            </Plane>
          </AbsoluteFill>
        )}

      </Layers>

      {/* ════ LAS COSTURAS, siempre por encima de todo ════ */}
      {/* FRONTERA C @1294 · OCLUSIÓN — el hormigón de la vereda del poste cruza y tapa el 100 %
          entre los frames 1293 y 1296: ahí adentro cambia el acto Y se abre la ventana. */}
      <Ocluye at={1284} dur={22} />
      {/* COSTURA INTERNA @2118 · WIPE POR MATERIA — las hojas del manual, y detrás ya están los NO */}
      <SeamWipeMatter at={2116} dur={26} tint={V.bone} />
      <HojasCruzan at={2114} dur={28} />
    </AbsoluteFill>
  );
};
