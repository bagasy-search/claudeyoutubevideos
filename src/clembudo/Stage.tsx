// Stage.tsx — ESCENARIO COMPARTIDO de los movimientos de `clembudo` (El Constructor Libre).
//
// Se escribe UNA vez, ANTES de lanzar los agentes de movimiento, y todos lo consumen.
// Motivo (suites_premium §7): si cada movimiento monta su propia cámara y su propia atmósfera,
// la unión ENTRE movimientos vuelve a ser el punto débil aunque cada uno sea perfecto por dentro.
//
// ⛔ CONTRATO TÉCNICO (cada punto costó un render, no lo relajes):
//  · CERO `Math.random()` / `Date.now()` / `new Date()`: el farm rinde en chunks PARALELOS, así que
//    todo tiene que ser función pura de `useCurrentFrame()`. Acá va `hash()` determinístico.
//  · CERO `backdrop-filter`: multiplica x5 el tiempo de render. El vidrio se hace con gradientes +
//    box-shadow inset + una copia del fondo detrás.
//  · CERO `filter: blur()` grande sobre imágenes a pantalla completa (se recalcula por frame).
//  · `Easing.quint` NO EXISTE → `Easing.poly(5)`. `Easing.out(undefined)` compila y explota en render.
//  · Safe area 60px. En planos con `translateZ` alto la perspectiva AGRANDA: anclá por bottom/right.
//  · Imports SÓLO de `remotion` y `react`.
import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const SAFE = 60;

// ── PALETA (THEME_EARTH del kit, replicada acá para no acoplar los movimientos al barrel) ──
export const C = {
  bg0: "#EFE7D3",
  bg1: "#E6DCC4",
  bg2: "#D8CBAD",
  ink: "#2A2620",
  inkSoft: "rgba(42,38,32,0.68)",
  inkDim: "rgba(42,38,32,0.42)",
  accent: "#7C8A5A",      // verde oliva (la camisa de Claudio)
  accentSoft: "#AEBA8C",
  gold: "#A9794A",        // el cuero del delantal
  danger: "#B0503C",      // el error / el moho
  good: "#6E8B47",
  line: "rgba(42,38,32,0.16)",
  shadow: "rgba(42,38,32,0.20)",
  paper: "rgba(245,238,220,0.92)",
};
export const FONT = '"EB Garamond","Garamond",Georgia,serif';

// ── AZAR DETERMINÍSTICO ──────────────────────────────────────────────────────────────────────
// ⛔ `Math.sin(seed*12.9898)*43758.5453` con seeds grandes PIERDE PRECISIÓN y se correlaciona
// (medido: rachas de 11 donde el azar justo da 8). Va hash entero tipo mulberry.
export const hash = (n: number): number => {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const rng = (seed: number, i: number) => hash(seed * 7919 + i * 104729);

// ── CÁMARA ÚNICA Y CONTINUA ──────────────────────────────────────────────────────────────────
// Función del frame GLOBAL del movimiento. El acto 3 HEREDA lo que dejó el acto 2.
// ⛔ Está PROHIBIDO que un acto reinicie la cámara en 0: por eso la cámara no recibe el frame
// local del acto, sino el del movimiento entero, y la deriva es monótona.
export type Cam = { z: number; panX: number; panY: number; ry: number; rx: number };

export const cam = (f: number, dur: number, from: Partial<Cam> = {}, to: Partial<Cam> = {}): Cam => {
  const a: Cam = { z: 1, panX: 0, panY: 0, ry: 0, rx: 0, ...from };
  const b: Cam = { ...a, ...to };
  // easing NO constante (un lerp lineal se lee como máquina)
  const k = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.24, 1),
  });
  // deriva lenta permanente: la cámara nunca queda del todo quieta (hold VIVO)
  const drift = Math.sin(f / 74) * 0.0016 + Math.sin(f / 131) * 0.0009;
  return {
    z: a.z + (b.z - a.z) * k + drift,
    panX: a.panX + (b.panX - a.panX) * k + Math.sin(f / 97) * 1.6,
    panY: a.panY + (b.panY - a.panY) * k + Math.cos(f / 113) * 1.1,
    ry: a.ry + (b.ry - a.ry) * k,
    rx: a.rx + (b.rx - a.rx) * k,
  };
};

export const camStyle = (c: Cam): React.CSSProperties => ({
  transform: `perspective(1600px) translate3d(${c.panX}px, ${c.panY}px, 0) rotateY(${c.ry}deg) rotateX(${c.rx}deg) scale(${c.z})`,
  transformStyle: "preserve-3d",
  willChange: "transform",
});

// ── LUZ QUE EVOLUCIONA ───────────────────────────────────────────────────────────────────────
// temp 0 = día frío de ventana · 1 = tarde ámbar. NO salta entre actos: se interpola.
export const luz = (f: number, dur: number, t0: number, t1: number) =>
  interpolate(f, [0, dur], [t0, t1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

export const tint = (t: number) =>
  `linear-gradient(${120 + t * 40}deg, rgba(169,121,74,${0.05 + t * 0.13}) 0%, rgba(124,138,90,${0.06 - t * 0.03}) 60%, rgba(42,38,32,${0.10 + t * 0.06}) 100%)`;

// ── L9 ATMOS — polvo, haces, viñeta. Se monta UNA vez por movimiento y NUNCA se remonta ──────
export const Atmos: React.FC<{ t?: number; dust?: number }> = ({ t = 0.3, dust = 26 }) => {
  const f = useCurrentFrame();
  const motas = new Array(dust).fill(0).map((_, i) => {
    const sx = rng(11, i), sy = rng(23, i), sp = 0.18 + rng(37, i) * 0.5;
    const y = (sy * H + f * sp * 6) % (H + 120) - 60;
    const x = sx * W + Math.sin((f + i * 31) / 88) * 26;
    const o = 0.05 + rng(51, i) * 0.16;
    const r = 1 + rng(67, i) * 2.4;
    return { x, y, o, r, k: i };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* L4 SHAFTS — haces de luz que respiran (no son decoración: dan volumen al aire) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(104deg, rgba(255,246,222,${0.00}) 38%, rgba(255,246,222,${0.10 + Math.sin(f / 96) * 0.035}) 52%, rgba(255,246,222,0) 66%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* L2 GRADE — tiñe y hunde el plate */}
      <AbsoluteFill style={{ background: tint(t) }} />
      {/* L9 polvo en suspensión */}
      {motas.map((m) => (
        <div
          key={m.k}
          style={{
            position: "absolute", left: m.x, top: m.y, width: m.r, height: m.r,
            borderRadius: "50%", background: "#FFF6DE", opacity: m.o,
          }}
        />
      ))}
      {/* L6 halación suave en las altas luces */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 80% at 22% 14%, rgba(255,244,214,0.13) 0%, rgba(255,244,214,0) 55%)",
          mixBlendMode: "screen",
        }}
      />
      {/* L9 viñeta de lente */}
      <AbsoluteFill
        style={{ background: "radial-gradient(130% 92% at 50% 46%, rgba(0,0,0,0) 52%, rgba(28,24,18,0.30) 100%)" }}
      />
      {/* L6 grano — determinístico, barato (una capa repetida, no ruido por píxel) */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 2px), repeating-linear-gradient(90deg, rgba(0,0,0,.5) 0 1px, rgba(0,0,0,0) 1px 2px)",
          transform: `translate(${(f % 3) - 1}px, ${((f * 7) % 3) - 1}px)`,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

// ── L7 VIDRIO — tarjeta flotante. ⛔ SIEMPRE lleva material real adentro (foto o clip) ────────
// Una tarjeta que es sólo forma + texto se lee como código en pantalla. `children` es el material.
export const Glass: React.FC<{
  x: number; y: number; w: number; h: number; z?: number; ry?: number; rx?: number;
  radius?: number; children?: React.ReactNode; lift?: number;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, radius = 18, children, lift = 1 }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`,
      transformStyle: "preserve-3d",
      borderRadius: radius,
      overflow: "hidden",
      // iluminación de producto: key arriba-izq + rim + SOMBRA DE CONTACTO que aterriza
      boxShadow: [
        `0 ${18 * lift}px ${44 * lift}px rgba(42,38,32,${0.30 * lift})`,
        `0 ${3 * lift}px ${8 * lift}px rgba(42,38,32,0.22)`,
        "inset 0 1px 0 rgba(255,248,230,0.55)",
        "inset 0 -1px 0 rgba(42,38,32,0.20)",
      ].join(","),
      background: C.bg1,
    }}
  >
    {children}
    {/* barrido especular — el "hold vivo": nada quieto más de 1,5 s */}
    <Sweep />
  </div>
);

const Sweep: React.FC = () => {
  const f = useCurrentFrame();
  const p = ((f % 150) / 150) * 260 - 60;
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(100deg, rgba(255,250,236,0) ${p - 16}%, rgba(255,250,236,0.16) ${p}%, rgba(255,250,236,0) ${p + 16}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// ── TIPOGRAFÍA (L8) — legibilidad +60: titular ≥48px, detalle ≥30px, sombra sobre b-roll ─────
export const Head: React.FC<{ children: React.ReactNode; size?: number; color?: string; align?: "left" | "center" }> =
  ({ children, size = 62, color = "#F7F1DF", align = "left" }) => (
    <div
      style={{
        fontFamily: FONT, fontSize: size, fontWeight: 800, color, textAlign: align,
        lineHeight: 1.06, letterSpacing: -0.5,
        textShadow: "0 2px 0 rgba(42,38,32,0.55), 0 10px 30px rgba(42,38,32,0.55)",
      }}
    >
      {children}
    </div>
  );

export const Kick: React.FC<{ children: React.ReactNode; size?: number; color?: string }> =
  ({ children, size = 30, color = C.accentSoft }) => (
    <div
      style={{
        fontFamily: FONT, fontSize: size, fontWeight: 700, color,
        letterSpacing: 4, textTransform: "uppercase",
        textShadow: "0 2px 10px rgba(42,38,32,0.6)",
      }}
    >
      {children}
    </div>
  );

// ── COSTURAS — una por frontera, ⛔ NUNCA un fade, y dos seguidas NO pueden ser la misma ──────
// OCLUSIÓN: una banda cruza y tapa el 100% durante 3-6 frames.
// ⛔⛔ El color NO puede ser el del fondo: eso no ocluye, hace un FUNDIDO A NEGRO y se ve un flash
//    (medido: luma 229 → 10 → 235 en una costura que "pasaba" todas las demás compuertas).
//    La banda tiene que SER un objeto de la escena (la espátula, el cuero del delantal, la pared).
// ⛔⛔ LA GEOMETRÍA POR DEFECTO TIENE QUE TAPAR EL CUADRO ENTERO, Y LA PRIMERA VERSIÓN NO LO HACÍA.
// Medido: con `width:150%` viajando de -140% a +140% e inclinada 8°, sólo 20 de 200 posiciones
// cubren [0,100] del ancho a la altura de las esquinas → sobre 24 frames son ~2, y muchas veces 0.
// Una oclusión que no llega a tapar del todo NO es una oclusión: es un destello, que es justo el
// defecto que esta costura viene a evitar. La inclinación se come `tan(8°)*alto` de ancho útil
// (con alto 200% son 28 puntos), así que el ancho tiene que pagar ESE peaje además del 100% del cuadro.
//   ancho útil = W - tan(angle)*alto - 100
//   frames tapados = 2*len * anchoÚtil / recorrido
// Con W=190, alto=200, recorrido 280 y len=12 dan ~4,9 frames tapados (objetivo 3-6). ✅
export const Occluder: React.FC<{ at: number; len?: number; color?: string; angle?: number; width?: number }> =
  ({ at, len = 12, color = C.gold, angle = -8, width = 190 }) => {
    const f = useCurrentFrame();
    if (f < at - len || f > at + len) return null;
    const k = interpolate(f, [at - len, at + len], [-140, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    return (
      <div
        style={{
          position: "absolute", left: `${k}%`, top: "-50%", width: `${width}%`, height: "200%",
          // el cuerpo de la banda es OPACO de punta a punta; sólo los cantos se degradan, y apenas.
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color} 6%, ${color} 94%, rgba(0,0,0,0) 100%)`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  };

// Entrada del ambiente: ≤15 frames. ⛔ Nada de 2s subiendo desde negro (se lee como hueco).
export const rampIn = (f: number, frames = 14) =>
  interpolate(f, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

// ═════════════════════════════════════════════════════════════════════════════════════════════
// PRIMITIVOS DE LA REHECHURA (sep-2026) — cada uno existe porque un defecto MEDIDO sobre el
// render lo pedía. Los siete defectos no dispararon ni UNA compuerta automática: se ven mirando.
// ═════════════════════════════════════════════════════════════════════════════════════════════

export const AR = 16 / 9; // todo el material (fotos 1792x1008 y clips i2v) es 16:9

// ── D1 · TARJETAS APLASTADAS A UNA TIRA ───────────────────────────────────────────────────────
// Medido: una tarjeta de 1240x120 con una foto adentro en `objectFit:cover` recorta el material a
// una franja y CORTA LAS CABEZAS. Pasaba en dos lugares distintos por el mismo motivo de fondo:
// el contenedor elegía su alto por razones de composición (una BARRA de dinero de 794x206) y el
// material se acomodaba como podía.
// `Plate` NO acepta un alto libre: la altura SIEMPRE sale del ancho y del aspecto del material.
// Si un acto necesita una barra, la barra es una barra — pero entonces NO lleva foto adentro.
export const Plate: React.FC<{
  cx: number; cy: number; w: number; ar?: number;
  z?: number; ry?: number; rx?: number; rot?: number;
  radius?: number; lift?: number; dim?: number; frame?: boolean;
  children?: React.ReactNode;
}> = ({ cx, cy, w, ar = AR, z = 0, ry = 0, rx = 0, rot = 0, radius = 16, lift = 1, dim = 0, frame = true, children }) => {
  const h = w / ar;
  return (
    <div
      style={{
        position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
        transform: `translateZ(${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
        borderRadius: radius,
        overflow: "hidden",
        // ⛔ OPACO SIEMPRE (D4): el fondo de la tarjeta no puede dejar ver el b-roll de atrás.
        background: "#1C1812",
        boxShadow: [
          `0 ${(20 * lift).toFixed(0)}px ${(52 * lift).toFixed(0)}px rgba(20,16,10,${(0.4 * lift).toFixed(2)})`,
          `0 ${(4 * lift).toFixed(0)}px ${(10 * lift).toFixed(0)}px rgba(20,16,10,0.30)`,
          "inset 0 1px 0 rgba(255,248,230,0.50)",
          "inset 0 -1px 0 rgba(20,16,10,0.34)",
        ].join(","),
      }}
    >
      {children}
      {frame ? (
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 0 0 0 3px rgba(245,238,220,0.30), inset 0 0 74px rgba(20,16,10,0.42)",
          }}
        />
      ) : null}
      {/* D4 · la PROFUNDIDAD se pinta, no se transparenta: un velo NEGRO adentro de la tarjeta.
          Así una tarjeta del fondo se ve hundida y sigue siendo opaca. */}
      {dim > 0.002 ? (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `rgba(16,13,8,${Math.min(0.82, dim).toFixed(3)})` }} />
      ) : null}
      <PlateSweep />
    </div>
  );
};

const PlateSweep: React.FC = () => {
  const f = useCurrentFrame();
  const p = ((f % 168) / 168) * 260 - 60;
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(102deg, rgba(255,250,236,0) ${p - 15}%, rgba(255,250,236,0.13) ${p}%, rgba(255,250,236,0) ${p + 15}%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// ── MATERIAL REAL adentro de una Plate ────────────────────────────────────────────────────────
// La foto es el frame 0 del clip i2v (el clip nació de ella), así que encender el video encima NO
// se ve: es el mismo cuadro. ⛔ `loop` no es prop de OffthreadVideo y el clip dura 151 f.
export const Mat: React.FC<{
  img: string; clip?: string; from?: number; dur?: number; rate?: number; kb?: number; mirror?: boolean;
}> = ({ img, clip, from = 0, dur = 151, rate = 1, kb = 1.04, mirror = false }) => (
  <div style={{ position: "absolute", inset: 0, transform: mirror ? "scaleX(-1)" : undefined }}>
    <Img
      src={staticFile(`img/clembudo/${img}.png`)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${kb.toFixed(4)})` }}
    />
    {clip ? (
      <Sequence from={from} durationInFrames={Math.max(1, Math.min(dur, Math.floor(151 / Math.max(rate, 0.01))))} layout="absolute-fill">
        <OffthreadVideo
          src={staticFile(`broll/clembudo/${clip}.mp4`)}
          muted
          playbackRate={rate}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    ) : null}
  </div>
);

// ── D7 · TÍTULOS SIN CONTRASTE ────────────────────────────────────────────────────────────────
// Tinta oscura sobre cama oscura desaparece. `Paper` es la cama de papel crema del canal: si el
// texto va en tinta (C.ink), va SOBRE esto. Si no hay papel, el texto va claro con sombra.
export const Paper: React.FC<{ children?: React.ReactNode; pad?: number; radius?: number; tilt?: number; style?: React.CSSProperties }> =
  ({ children, pad = 26, radius = 8, tilt = 0, style }) => (
    <div
      style={{
        background: "linear-gradient(168deg, #FBF4E2 0%, #F1E7CD 58%, #E6DBBD 100%)",
        padding: pad, borderRadius: radius,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        boxShadow: "0 20px 46px rgba(20,16,10,0.42), 0 3px 8px rgba(20,16,10,0.30), inset 0 1px 0 rgba(255,255,255,0.85)",
        ...style,
      }}
    >
      {children}
    </div>
  );

// Titular EN TINTA — sólo válido dentro de <Paper>. >=48 px (legibilidad +60).
export const Ink: React.FC<{ children: React.ReactNode; size?: number; weight?: number; color?: string }> =
  ({ children, size = 58, weight = 800, color = C.ink }) => (
    <div style={{ fontFamily: FONT, fontSize: Math.max(48, size), fontWeight: weight, color, lineHeight: 1.06, letterSpacing: -0.4 }}>
      {children}
    </div>
  );

// ── D3 · TEXTO CORTADO POR EL BORDE ───────────────────────────────────────────────────────────
// Causa medida: el texto vivía DENTRO de la cámara. Con `scale(z)` > 1 y `translateZ` alto la
// perspectiva AGRANDA, así que un `left: 70` en coordenadas de mundo termina en x ~ 14 o fuera.
// `Lower` vive en ESPACIO DE PANTALLA (fuera de camStyle) y se ancla por bottom/left en píxeles
// reales: no hay cámara que lo pueda mover. Nada que lleve texto puede ir adentro del mundo.
export const LOWER_L = 104; // > SAFE(60), holgado para la sombra
export const LOWER_B = 118;
export const LOWER_W = 880;

export const Lower: React.FC<{
  f: number; from: number; to: number; kick?: string; head?: string; onPaper?: boolean; w?: number; size?: number;
}> = ({ f, from, to, kick, head, onPaper = false, w = LOWER_W, size = 56 }) => {
  if (f < from - 2 || f > to + 12) return null;
  const a = interpolate(f, [from, from + 11, to, to + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const dy = interpolate(f, [from, from + 14], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cuerpo = (
    <>
      {kick ? <div style={{ marginBottom: 12 }}><Kick size={30} color={onPaper ? C.gold : C.accentSoft}>{kick}</Kick></div> : null}
      {head ? (onPaper ? <Ink size={size}>{head}</Ink> : <Head size={size}>{head}</Head>) : null}
    </>
  );
  return (
    <div
      style={{
        position: "absolute", left: LOWER_L, bottom: LOWER_B, width: w,
        opacity: a, transform: `translateY(${dy.toFixed(2)}px)`,
      }}
    >
      {onPaper ? <Paper pad={28} tilt={-0.4}>{cuerpo}</Paper> : cuerpo}
    </div>
  );
};

// Cama oscura para que el texto claro lea sobre cualquier material (no es un fade: es constante).
export const LowerBed: React.FC<{ o?: number }> = ({ o = 0.84 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none", opacity: o,
      background: "linear-gradient(18deg, rgba(20,16,10,0.86) 0%, rgba(20,16,10,0.46) 32%, rgba(20,16,10,0) 58%)",
    }}
  />
);

// ── D1(b) · EL PISO QUE SE COMÍA LAS TARJETAS ─────────────────────────────────────────────────
// Medido en MovCierre: un plano de 1760 px de alto con `rotateX(56deg)` y `transformOrigin:50% 0%`
// lleva su borde CERCANO a z = -190 + 1760*sin(56) = +1269, o sea MUY por delante de las tarjetas
// (z ~ +170). El piso les tapaba la mitad de abajo y las tarjetas se leían como una tira.
// `Ground` gira sobre su borde INFERIOR y hacia atrás: todo el plano queda detrás de z0.
export const Ground: React.FC<{ img?: string; y: number; h?: number; z0?: number; tilt?: number; veil?: number }> =
  ({ img, y, h = 1500, z0 = -240, tilt = 62, veil = 0.62 }) => (
    <div
      style={{
        position: "absolute", left: -560, top: y - h, width: 3040, height: h,
        // ⛔⛔ EL SIGNO IMPORTA Y ES CONTRAINTUITIVO. En CSS, rotateX(t) manda (y,z) a
        // (y·cos t − z·sin t, y·sin t + z·cos t), con `y` hacia ABAJO. Con el origen en el borde
        // INFERIOR, el borde lejano está en y = −h, así que su z queda en −h·sin(t): sólo es
        // NEGATIVO (se va hacia atrás) si t es POSITIVO. Con rotateX(−62°) el borde lejano
        // terminaría en z = +1324 y volvería a taparle la mitad de abajo a las tarjetas, que es
        // justo el defecto D1 que este helper viene a matar.
        transform: `translateZ(${z0}px) rotateX(${tilt}deg)`,
        transformOrigin: "50% 100%", // el borde de abajo: desde ahí el plano se va HACIA ATRÁS
        overflow: "hidden",
        background: "linear-gradient(180deg, #241D13 0%, #3A3020 40%, #4A3C27 100%)",
      }}
    >
      {img ? (
        <Img src={staticFile(`img/clembudo/${img}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(20,16,10,${veil}) 0%, rgba(20,16,10,0.20) 62%, rgba(20,16,10,0.06) 100%)` }} />
      {/* canto iluminado del borde cercano: da contacto y separa el piso del fondo */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "linear-gradient(90deg, rgba(255,226,168,0) 0%, rgba(255,226,168,0.50) 30%, rgba(255,226,168,0.54) 70%, rgba(255,226,168,0) 100%)" }} />
    </div>
  );

// ── D2 · ACTOS VACÍOS ─────────────────────────────────────────────────────────────────────────
// Un acto sin objeto protagonista no es un acto. `Backplate` es el material REAL que ocupa el
// cuadro entero detrás de todo: ningún acto puede quedarse con un degradé plano y nada más.
export const Backplate: React.FC<{ img: string; clip?: string; from?: number; dur?: number; rate?: number; z?: number; scale?: number; veil?: number }> =
  ({ img, clip, from = 0, dur = 151, rate = 1, z = -560, scale = 1.5, veil = 0.46 }) => (
    <div
      style={{
        position: "absolute", inset: -200,
        transform: `translateZ(${z}px) scale(${(((1600 - z) / 1600) * scale).toFixed(4)})`,
        transformStyle: "preserve-3d",
        overflow: "hidden",
        background: "#1C1812",
      }}
    >
      <Img src={staticFile(`img/clembudo/${img}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {clip ? (
        <Sequence from={from} durationInFrames={Math.max(1, Math.min(dur, Math.floor(151 / Math.max(rate, 0.01))))} layout="absolute-fill">
          <OffthreadVideo src={staticFile(`broll/clembudo/${clip}.mp4`)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: `rgba(18,14,9,${veil})` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(96% 76% at 50% 44%, rgba(0,0,0,0) 44%, rgba(18,14,9,0.52) 100%)" }} />
    </div>
  );

// ── LA LÁMINA DEL CURSO ───────────────────────────────────────────────────────────────────────
// Regla del canal: entera, nítida y QUIETA, sin tipografía encima y sin recortar. Por eso vive en
// ESPACIO DE PANTALLA (⛔ nunca dentro de la cámara: el zoom la sacaba del cuadro por la izquierda,
// medido — "EL AIRE" cortado y "10 a 15 litros" leyéndose "0 a 15 litros").
export const Lamina: React.FC<{ src: string; cx: number; cy: number; w: number; tilt?: number }> =
  ({ src, cx, cy, w, tilt = 0 }) => {
    const h = w / AR;
    // se clava dentro del cuadro con 60 px de margen REAL, ya en píxeles de pantalla
    const x = Math.min(Math.max(cx - w / 2, SAFE), W - SAFE - w);
    const y = Math.min(Math.max(cy - h / 2, SAFE), H - SAFE - h);
    return (
      <div
        style={{
          position: "absolute", left: x, top: y, width: w, height: h,
          background: "#FCF8EE", padding: Math.max(7, w * 0.011),
          transform: tilt ? `rotate(${tilt}deg)` : undefined,
          boxShadow: `0 ${Math.round(w * 0.02)}px ${Math.round(w * 0.052)}px rgba(20,16,10,0.44), 0 3px 8px rgba(20,16,10,0.32), inset 0 1px 0 rgba(255,255,255,0.92)`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(126deg, rgba(255,250,232,0.16) 0%, rgba(255,250,232,0) 32%, rgba(20,16,10,0) 70%, rgba(20,16,10,0.09) 100%)",
          }}
        />
      </div>
    );
  };

// ── D3(b) · LO MISMO QUE LE PASABA AL TEXTO, PERO A LAS TARJETAS ──────────────────────────────
// El texto lo saqué de la cámara y dejó de cortarse. Las tarjetas HÉROE no pueden salir: son el
// objeto protagonista del acto. Pero viven en coordenadas de MUNDO, así que la cámara las mueve:
// medido sobre el render, las tres manchas del cierre de MovTresAguas y la foto de los billetes de
// MovDinero quedaban cortadas contra el borde, aunque en mundo estuvieran holgadas.
//
// `fitCx` proyecta la tarjeta a PANTALLA y corre su `cx` lo justo para que entre con `margin` px
// de aire REAL. La proyección de `camStyle` es, en orden:
//   scale(z) → rotateY(ry) → translate3d(panX) → perspective(1600)
// `scale()` es 2D: NO toca el translateZ de la tarjeta. Por eso el factor de perspectiva sale del
// z de la tarjeta y el zoom sólo escala el dx.
//
// ⚠️ Si la tarjeta NO ENTRA ni centrada (un zoom-through que crece hasta tapar el cuadro), devuelve
// el cx original: ahí salirse es la intención, y clavarla al centro arruinaría la costura.
export const fitCx = (cx: number, w: number, zp: number, K: Cam, margin = SAFE): number => {
  const ry = (K.ry * Math.PI) / 180;
  const P = 1600 / (1600 - zp * Math.cos(ry));          // agrandamiento por perspectiva
  const half = (w / 2) * K.z * P;
  const lim = W / 2 - margin - half;
  if (lim <= 0) return cx;                              // no entra ni centrada → es a propósito
  const k = K.z * Math.cos(ry) * P;
  const off = (zp * Math.sin(ry) + K.panX) * P;
  const dx = Math.min(Math.max(cx - W / 2, (-lim - off) / k), (lim - off) / k);
  return W / 2 + dx;
};
