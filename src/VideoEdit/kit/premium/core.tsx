import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Envuelve un path relativo (img/x.png) en staticFile; deja pasar http/data/blob/absolutos.
const asset = (s: string) =>
  /^(https?:|data:|blob:|\/)/.test(s) ? s : staticFile(s);
import { SPR, Theme, useTheme } from "./theme";
import { Cinema, OnFootage, OnPaper, slabShadow, specular, tilt3d, useInk, useKeyLight, useStage } from "./stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM KIT — CORE: primitivas compartidas por todas las familias.
// Todo determinista (rand por índice, cero Date.now/Math.random), todo
// clampeado, todo themeable. Estas piezas son las que le dan a cada
// componente el LAYER MODEL (fondo texturado → midground → foreground),
// las sombras de contacto, el rim light y la jerarquía tipográfica.
// ═══════════════════════════════════════════════════════════════════════════

// Azar determinístico [0..1) por índice (mismo LCG que kit/depth).
export const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

export const wob = (i: number, frame: number, speed = 1): number =>
  Math.sin((frame * speed) / 14 + i * 1.7);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** miles con punto (es-AR) — determinista, sin toLocaleString. */
export const fmt = (n: number): string => {
  const neg = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const fromEnd = s.length - i;
    out += s[i];
    if (fromEnd > 1 && (fromEnd - 1) % 3 === 0) out += ".";
  }
  return (neg ? "-" : "") + out;
};

// ── useBeat — entrada con spring + salida con fade en los últimos frames ─────
export const useBeat = (
  durationInFrames: number,
  opts?: { outLen?: number; enterCfg?: (typeof SPR)[keyof typeof SPR] },
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 8 frames, no 12: el canal manda CORTE LIMPIO (feedback_video_clean_cuts) y
  // medio segundo de disolvencia deja el gráfico fantasma sobre el b-roll.
  const outLen = opts?.outLen ?? 8;
  const enter = spring({ frame, fps, config: opts?.enterCfg ?? SPR.soft });
  const exit = interpolate(
    frame,
    [durationInFrames - outLen, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return { frame, fps, enter, exit, op: enter * exit };
};

/** spring arrancando en `at` — helper NO-hook para usar dentro de .map() */
export const kick = (
  frame: number,
  fps: number,
  at: number,
  cfg: { damping: number; mass: number; stiffness: number } = SPR.snappy,
) => spring({ frame: frame - at, fps, config: cfg });

/**
 * spread — reparte `count` ítems A LO LARGO de la duración del beat (no en el
 * primer ~medio segundo). Devuelve el frame `at` del ítem `i`. Deja un HOLD al
 * final (holdFrac) donde ya está todo revelado. Así el ritmo sigue los timestamps
 * y cada ítem "se toma su tiempo" en beats largos, sin arruinar los cortos.
 */
export const spread = (
  durationInFrames: number,
  count: number,
  i: number,
  opts?: { start?: number; holdFrac?: number; minStep?: number; maxStep?: number },
) => {
  const start = opts?.start ?? 12;
  const holdFrac = opts?.holdFrac ?? 0.3;
  const minStep = opts?.minStep ?? 9;
  const maxStep = opts?.maxStep ?? 64;
  const end = durationInFrames * (1 - holdFrac);
  const raw = count > 1 ? (end - start) / count : 0;
  const step = Math.max(minStep, Math.min(maxStep, raw));
  return start + i * step;
};

// ── Texture — grano/papel según theme (multiply en claro, screen en oscuro) ──
export const Texture: React.FC<{ theme?: Theme; opacity?: number }> = ({
  theme,
  opacity,
}) => {
  const t = useTheme(theme);
  if (t.texture === "none") return null;
  const paper = t.texture === "paper";
  const op = opacity ?? (paper ? 0.1 : 0.09);
  const dark = t.mode === "dark";
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        mixBlendMode: dark ? "screen" : "multiply",
        pointerEvents: "none",
      }}
    >
      <filter id={`pxtex-${t.name}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={paper ? 0.9 : 0.65}
          numOctaves={paper ? 3 : 2}
          seed={7}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values={
            dark
              ? "0 0 0 0 0.85  0 0 0 0 0.83  0 0 0 0 0.75  0 0 0 0.6 0"
              : "0 0 0 0 0.16  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.55 0"
          }
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#pxtex-${t.name})`} />
    </svg>
  );
};

// ── Rays — haz de luz diagonal themeable (godrays de establo o de selva) ─────
export const Rays: React.FC<{
  theme?: Theme;
  x?: number;
  angle?: number;
  count?: number;
}> = ({ theme, x = 64, angle = 20, count = 6 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  if (!t.rays) return null;
  const breathe = interpolate(Math.sin(frame / 70), [-1, 1], [0.7, 1]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: breathe,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x + (i - count / 2) * 5}%`,
            top: "-12%",
            width: `${4 + rand(i) * 6}%`,
            height: "170%",
            background: `linear-gradient(to bottom, ${t.raysColor}, rgba(0,0,0,0))`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "top center",
            filter: "blur(16px)",
          }}
        />
      ))}
    </div>
  );
};

// ── Vignette — oscurece/aclara bordes para foco central ─────────────────────
export const Vignette: React.FC<{ theme?: Theme; strength?: number }> = ({
  theme,
  strength = 1,
}) => {
  const t = useTheme(theme);
  const c = t.mode === "dark" ? "0,0,0" : "42,38,32";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(120% 90% at 50% 42%, rgba(${c},0) 55%, rgba(${c},${0.22 * strength}) 100%)`,
      }}
    />
  );
};

// ── Panel — el ESCENARIO de cada componente. ★ REESCRITO (jul 2026).
//    Antes: un rectángulo crema OPACO con borde y radio que tapaba el b-roll y
//    dejaba el plano en 2 capas planas (fondo + texto). Encima, el
//    PremiumOverlay pintaba OTRA tarjeta crema igual → crema sobre crema, sin
//    figura/fondo, y el video de atrás invisible.
//    Ahora: delega en `Cinema` (stagecraft) el stack de 9 capas y SANGRA hasta
//    el borde del frame, así el b-roll vivo sigue siendo la capa 1 del plano.
//    El box de layout (inset:60 = 1800x960) NO cambia: las coordenadas de todos
//    los componentes existentes siguen valiendo.
export const Panel: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  radius?: number;
  raysX?: number;
  children?: React.ReactNode;
  /** true = sin tratamiento (overlay puro sobre footage) */
  transparent?: boolean;
  /** de qué lado se apoya el papel; por defecto lo decide la zona del cue */
  side?: "left" | "top" | "center" | "full";
  /** solidez del papel (0.94 = casi opaco, 0.6 = se ve el b-roll a través) */
  paper?: number;
}> = ({ theme, style, radius, raysX, children, transparent = false, side, paper }) => {
  const t = useTheme(theme);
  const stage = useStage();
  void radius;
  // Sin `side` explícito: los componentes que aún reparten contenido por TODO
  // el box necesitan papel centrado (si fuera direccional, media composición
  // caería sobre b-roll pelado). Los reescritos sí piden su lado.
  const s = side ?? (stage.zone === "full" ? "full" : "center");
  // ★ NADA DE PLACA/MARCO. La versión anterior pintaba un rectángulo crema
  //   redondeado dentro del box, con el b-roll asomando alrededor: se leía como
  //   un marco blanco pegado encima del video. Ahora el fondo se DESENFOCA
  //   (lo hace el `Backdrop` del overlay) y las piezas del componente flotan
  //   directamente sobre él. Sin papel detrás, el texto queda sobre footage →
  //   la tinta la resuelve `useInk` vía SurfaceCtx (el overlay ya puso
  //   "footage"; cada `Card` la vuelve a "paper" para su interior).
  return (
    <div style={{ position: "relative", ...style }}>
      {/* Sólo si NADIE montó el tratamiento (uso directo del componente fuera
          del PremiumOverlay, p.ej. la Gallery): lo pinta el Panel. */}
      {!transparent && !stage.managed && (
        <div style={{ position: "absolute", inset: -64, pointerEvents: "none" }}>
          <Cinema
            theme={t}
            side={s}
            paper={0}
            edge={0.62}
            shaftsX={raysX ?? (s === "left" ? 68 : 58)}
            dust={14}
          />
        </div>
      )}
      {/* El Panel YA NO pinta papel en ningún modo → todo lo que cuelga de él
          está apoyado sobre el b-roll graduado. Hay que declararlo: sin esto,
          el camino STANDALONE (componentes usados sin PremiumOverlay, p.ej. la
          copia _fed6 del canal Federer y la Gallery) hereda el default "paper"
          y renderiza tinta casi negra sobre fondo oscuro. Cada Card vuelve a
          "paper" para su interior. */}
      <div style={{ position: "absolute", inset: 0 }}>
        <OnFootage>{children}</OnFootage>
      </div>
    </div>
  );
};

// ── Card — ★ REESCRITO (jul 2026). Antes era `surface` (crema translúcido)
//    apoyado sobre el `bg0` del Panel (crema): ~2% de diferencia de luminancia,
//    o sea la tarjeta NO SE VEÍA como capa aparte. Ahora tiene separación de
//    valor real (cara con degradé propio), rim light arriba, canto oscuro abajo
//    y sombra en 3 distancias — que es lo que hace que "flote" de verdad.
export const Card: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  accent?: string;
  strong?: boolean;
  /** semilla del cabeceo 3D: dos tarjetas seguidas no deben inclinarse igual */
  seed?: number;
  /** 0 = plana, 1 = volumen completo (canto + inclinación + specular) */
  dimension?: number;
  children?: React.ReactNode;
}> = ({ theme, style, accent, strong = false, seed = 0, dimension = 1, children }) => {
  const t = useTheme(theme);
  const stage = useStage();
  const frame = useCurrentFrame();
  const light = useKeyLight(stage.zone);
  const dark = t.mode === "dark";
  // OJO: `strong` se expresa SÓLO con el degradé de la cara. No agregar un div
  // de brillo encima ni envolver a los children: varios componentes le pasan
  // `display:flex` a la Card por `style`, y cualquier wrapper convierte esa fila
  // en un solo item (MythTruth apilaba el chip "MITO" ENCIMA del texto).
  // Vidrio: cara translúcida + desenfoque de lo que hay detrás. Sobre un fondo
  // ya desenfocado por el `Backdrop`, esto da la doble profundidad que se lee
  // como plano compuesto. La cara igual es sólida al ~93%: si el
  // `backdrop-filter` se desactiva (ancestro con opacity<1), el texto se sigue
  // leyendo — la legibilidad nunca depende del efecto.
  const face = dark
    ? `linear-gradient(168deg, ${t.color.bg2}F0, ${t.color.bg1}${strong ? "FA" : "EC"})`
    : strong
      ? `linear-gradient(168deg, #FFFFFFFC, #FFFBEFF8 46%, ${t.color.surfaceStrong}F4)`
      : `linear-gradient(168deg, #FFFEF9F8, ${t.color.surfaceStrong}F0)`;
  // VOLUMEN: el brillo especular va como PRIMERA capa de `background` (CSS
  // admite varias) en vez de un div extra — un wrapper rompería los
  // `display:flex` que varias tarjetas pasan por `style`. El canto sólido sale
  // de la primera sombra de `slabShadow` (offset 0 blur = espesor de la placa),
  // y la inclinación usa `perspective()` dentro del propio transform: poner
  // `transform-style: preserve-3d` en un ancestro crearía un backdrop root y
  // mataría el vidrio.
  const edge = dark ? "rgba(0,0,0,0.55)" : "rgba(96,74,48,0.42)";
  return (
    <div
      style={{
        position: "relative",
        background: dimension > 0 ? `${specular(light, 0.24 * dimension)}, ${face}` : face,
        backdropFilter: "blur(18px) saturate(1.05)",
        WebkitBackdropFilter: "blur(18px) saturate(1.05)",
        border: accent ? `3px solid ${accent}` : `1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.55)"}`,
        borderRadius: t.radius,
        transform: dimension > 0 ? tilt3d({ amount: 0.32 * dimension, seed, frame }) : undefined,
        boxShadow: [
          `inset 0 2px 0 ${dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.95)"}`,
          `inset 0 -2px 0 ${dark ? "rgba(0,0,0,0.45)" : "rgba(42,38,32,0.10)"}`,
          slabShadow(light, { lift: 1 + dimension * 0.4, edge }),
        ].join(", "),
        ...style,
      }}
    >
      <OnPaper>{children}</OnPaper>
    </div>
  );
};

// ── Jerarquía tipográfica ────────────────────────────────────────────────────
export const Eyebrow: React.FC<{
  theme?: Theme;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, color, size = 28, style, children }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const col = color ?? ink.accent;
  return (
    <div
      style={{
        fontFamily: t.fontLabel,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: t.labelSpacing + 2,
        textTransform: t.upperLabels ? "uppercase" : "none",
        color: col,
        textShadow: ink.shadow,
        display: "flex",
        alignItems: "center",
        gap: 16,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 44,
          height: 4,
          background: col,
          borderRadius: 2,
          boxShadow: `0 0 16px ${col}66`,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
};

export const Display: React.FC<{
  theme?: Theme;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, size = 64, color, style, children }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  return (
    <div
      style={{
        fontFamily: t.fontDisplay,
        fontSize: size,
        fontWeight: t.displayWeight,
        color: color ?? ink.text,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        textShadow: size >= 56 ? ink.shadowStrong : ink.shadow,
        textTransform: t.name === "alarm" ? "uppercase" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Support: React.FC<{
  theme?: Theme;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, size = 32, color, style, children }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  // piso duro de legibilidad: por debajo de 26px sobre 1080p no se lee en celular
  const s = Math.max(26, size);
  return (
    <div
      style={{
        fontFamily: t.fontBody,
        fontSize: s,
        fontWeight: 500,
        color: color ?? ink.soft,
        lineHeight: 1.34,
        textShadow: ink.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── ImgOr — Img real si hay src; si no, "foto" placeholder determinista ──────
//    (paisaje abstracto themeado: cielo gradiente + sol + cordón montañoso).
//    Así el kit funciona SIN assets y la Gallery muestra composición real.
export const ImgOr: React.FC<{
  src?: string;
  seed?: number;
  theme?: Theme;
  style?: React.CSSProperties;
}> = ({ src, seed = 0, theme, style }) => {
  const t = useTheme(theme);
  if (src) {
    return (
      <Img
        src={asset(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    );
  }
  // ★ SIN src: superficie neutra themeada. NUNCA el paisaje sembrado — en un video real ese
  // placeholder (cielo + sol + montaña) se leía como un asset ROTO/genérico y el usuario lo
  // marcó como error recurrente. De raíz: un slot de imagen sin foto ahora se ve INTENCIONAL,
  // no roto. Los componentes con foto (CtaCard=portada, VsDuel=fotos reales, FramedPhoto…)
  // deben pasar `src`; si no, cae limpio a esta superficie.
  void seed;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: t.color.surfaceStrong,
        backgroundImage: `radial-gradient(120% 90% at 30% 22%, ${t.color.accentSoft}40, rgba(0,0,0,0) 62%)`,
        ...style,
      }}
    />
  );
};

// ── PhotoBlock — foto (o placeholder) con marco marcador + gradiente pie + ───
//    sombra de profundidad. El "recorte midground" estándar del kit.
export const PhotoBlock: React.FC<{
  theme?: Theme;
  src?: string;
  seed?: number;
  width: number;
  height: number;
  accent?: string;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ theme, src, seed = 0, width, height, accent, radius, style, children }) => {
  const t = useTheme(theme);
  const r = radius ?? t.radius;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        filter: `drop-shadow(0 24px 30px ${t.color.shadow})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          borderRadius: r,
          overflow: "hidden",
          border: `${Math.max(4, t.strokeW)}px solid ${accent ?? t.color.ink}`,
        }}
      >
        <ImgOr src={src} seed={seed} theme={t} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        {children}
      </div>
    </div>
  );
};

// ── ContactShadow — sombra elíptica bajo elementos flotantes (los "asienta") ─
export const ContactShadow: React.FC<{
  theme?: Theme;
  width?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ theme, width = 240, opacity = 0.4, style }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        width,
        height: width * 0.16,
        borderRadius: "50%",
        background: `radial-gradient(50% 50% at 50% 50%, ${t.color.shadow} 0%, rgba(0,0,0,0) 70%)`,
        opacity,
        filter: "blur(4px)",
        ...style,
      }}
    />
  );
};

// ── Stroke — path que se dibuja a pluma (InkDraw themeado) ───────────────────
export const Stroke: React.FC<{
  d: string;
  at?: number;
  dur?: number;
  color: string;
  width?: number;
  length?: number;
  fill?: string;
  shadow?: boolean;
}> = ({ d, at = 0, dur = 22, color, width = 6, length = 1200, fill = "none", shadow = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - p)}
      style={shadow ? { filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" } : undefined}
    />
  );
};

// ── Arrow — flecha curva que se dibuja + punta que aparece al final ──────────
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curve?: number; // px de curvatura perpendicular (+ = "arriba")
  at?: number;
  dur?: number;
  color: string;
  width?: number;
}> = ({ x1, y1, x2, y2, curve = 0, at = 0, dur = 20, color, width = 8 }) => {
  const frame = useCurrentFrame();
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  // ángulo de llegada (tangente control→fin)
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const headL = width * 2.6;
  const ha = 0.5;
  const hx1 = x2 - Math.cos(ang - ha) * headL;
  const hy1 = y2 - Math.sin(ang - ha) * headL;
  const hx2 = x2 - Math.cos(ang + ha) * headL;
  const hy2 = y2 - Math.sin(ang + ha) * headL;
  const p = interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headOp = interpolate(p, [0.78, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = dist * 1.35 + Math.abs(curve);
  return (
    <g style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <path
        d={`M ${hx1} ${hy1} L ${x2} ${y2} L ${hx2} ${hy2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={headOp}
      />
    </g>
  );
};

// ── Tick / Cross — check y tacha dibujados (en un svg 40x40) ─────────────────
export const Tick: React.FC<{ at?: number; color: string; size?: number }> = ({
  at = 0,
  color,
  size = 56,
}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
    <circle cx={20} cy={20} r={17} fill="none" stroke={color} strokeWidth={2.6} opacity={0.55} />
    <Stroke d="M 11 21 L 18 28 L 30 12" at={at} dur={12} length={46} color={color} width={4.6} />
  </svg>
);

export const Cross: React.FC<{ at?: number; color: string; size?: number }> = ({
  at = 0,
  color,
  size = 56,
}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ flexShrink: 0 }}>
    <circle cx={20} cy={20} r={17} fill="none" stroke={color} strokeWidth={2.6} opacity={0.55} />
    <Stroke d="M 12 12 L 28 28" at={at} dur={9} length={26} color={color} width={4.6} />
    <Stroke d="M 28 12 L 12 28" at={at + 5} dur={9} length={26} color={color} width={4.6} />
  </svg>
);

// ── Odo — odómetro themeado: dígitos que ruedan y ASIENTAN en el valor ───────
export const Odo: React.FC<{
  value: number;
  theme?: Theme;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  at?: number;
  dur?: number;
  grouped?: boolean; // separador de miles
}> = ({ value, theme, size = 96, color, prefix = "", suffix = "", at = 0, dur = 55, grouped = true }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 200, mass: 1, stiffness: 55 }, durationInFrames: dur });
  // Layout FIJO desde el frame 0 (el string final define las columnas y los
  // puntos de miles); cada dígito rueda por separado hasta asentar. Así nunca
  // salta el ancho ni se desalinean los separadores durante la animación.
  const padded = grouped ? fmt(value) : Math.round(value).toString();
  const cellH = size * 1.14;
  const col = color ?? ink.text;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: t.fontDisplay,
        color: col,
        fontSize: size,
        fontWeight: Math.max(t.displayWeight, 700),
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        textShadow: ink.shadowStrong,
      }}
    >
      {prefix && <span style={{ marginRight: size * 0.06 }}>{prefix}</span>}
      {padded.split("").map((ch, i) => {
        if (ch === "." || ch === "," || ch === " ") {
          return (
            <span key={i} style={{ display: "inline-block", width: ch === " " ? size * 0.18 : size * 0.24, textAlign: "center" }}>
              {ch === " " ? "" : ch}
            </span>
          );
        }
        const target = parseInt(ch, 10);
        const roll = target + (1 - s) * (5 + (i % 3) * 2); // columnas ruedan distinto
        const off = (roll % 10) * cellH;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              height: cellH,
              width: size * 0.6,
              overflow: "hidden",
              position: "relative",
              textAlign: "center",
            }}
          >
            <span style={{ position: "absolute", top: -off, left: 0, right: 0 }}>
              {Array.from({ length: 20 }, (_, d) => (
                <span key={d} style={{ display: "block", height: cellH }}>
                  {d % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {suffix && <span style={{ marginLeft: size * 0.08, fontSize: size * 0.5 }}>{suffix}</span>}
    </div>
  );
};

// ── Burst — explosión radial de motas en un instante (para sellos/slams) ─────
export const Burst: React.FC<{
  at: number;
  color: string;
  size?: number;
  count?: number;
}> = ({ at, color, size = 300, count = 14 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const half = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: count }, (_, i) => {
        const a = rand(i, 3) * Math.PI * 2;
        const d = p * (half * 0.35 + rand(i, 1) * half * 0.62);
        const op = interpolate(p, [0, 0.14, 1], [0, 0.85, 0]);
        return (
          <circle
            key={i}
            cx={half + Math.cos(a) * d}
            cy={half + Math.sin(a) * d}
            r={2.5 + rand(i, 2) * 5}
            fill={color}
            opacity={op}
          />
        );
      })}
    </svg>
  );
};

// ── Motas — partículas ambiente sutiles flotando (atmósfera de midground) ────
export const Motas: React.FC<{
  theme?: Theme;
  count?: number;
  color?: string;
  opacity?: number;
}> = ({ theme, count = 16, color, opacity = 0.5 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const col = color ?? t.color.gold;
  return (
    <svg
      viewBox="0 0 1600 900"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
    >
      {Array.from({ length: count }, (_, i) => {
        const span = 150 + Math.floor(rand(i, 1) * 130);
        const p = ((frame + rand(i, 2) * span) % span) / span;
        const x = rand(i) * 1600 + wob(i, frame, 1.1) * 24;
        const y = rand(i, 3) * 900 - p * 260;
        const life = Math.sin(p * Math.PI);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.6 + rand(i, 4) * 3.4}
            fill={col}
            opacity={life * (0.25 + rand(i, 5) * 0.45)}
          />
        );
      })}
    </svg>
  );
};

// ── Stage — AbsoluteFill raíz de cada componente (fuente body del theme) ─────
export const Stage: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, style, children }) => {
  const t = useTheme(theme);
  return (
    <AbsoluteFill style={{ fontFamily: t.fontBody, ...style }}>
      {children}
    </AbsoluteFill>
  );
};
