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
import { useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";

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
