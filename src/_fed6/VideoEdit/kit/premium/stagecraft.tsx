import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { spring } from "remotion";
import { Theme, useTheme } from "./theme";

// Azar determinístico por índice. Se define ACÁ (y no se importa de core) a
// propósito: core importa `Cinema` de este archivo, y traer `rand` de vuelta
// cerraría un ciclo de imports que el bundler resuelve con TDZ y explota.
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

// ═══════════════════════════════════════════════════════════════════════════
// STAGECRAFT — el modelo de CAPAS del kit premium (nivel After Effects).
//
// El problema que resuelve: los componentes se veían "flojos" porque eran
// 2 capas planas (tarjeta crema + texto) sobre un b-roll TAPADO. Un plano de
// AE que se ve caro tiene 6-9 capas que se mueven a RITMOS DISTINTOS:
//
//   L1 PLATE    el b-roll real (vive DEBAJO, en el Main — no lo tapamos)
//   L2 GRADE    scrim de color que hunde el plate y unifica la paleta
//   L3 DEPTH    desenfoque REAL de lo que hay detrás (backdrop-filter) = foco
//   L4 SHAFTS   haces de luz con volumen, que respiran
//   L5 SCRIM    el "papel": degradé direccional con borde vivo, NO una cajita
//   L6 GRAIN    grano de película animado + halación en las luces
//   L7 MID      fotos/medallones con sombra de contacto y parallax propio
//   L8 FORE     tipografía con stack de sombras y reglas dibujadas
//   L9 ATMOS    motas de polvo, barrido de luz, viñeta de lente
//
// Reglas: todo determinista (rand por índice/frame, cero Date.now/Math.random),
// todo themeable, y NADA opaco de borde a borde — el b-roll SIEMPRE respira.
// ═══════════════════════════════════════════════════════════════════════════

// ── Zona de composición: de qué lado se apoya el contenido y por dónde respira
// el b-roll. Los cues viejos ya pasan estos nombres por `zone`.
export type StageZone = "topLeft" | "left" | "top" | "full" | "center";

export type StageInfo = {
  zone: StageZone;
  /** lado por el que entra la luz y donde queda el aire del plano */
  breathe: "right" | "bottom" | "none";
  /** true = el MONTAJE (PremiumOverlay) ya pintó el tratamiento del fondo.
   *  El componente no debe volver a pintarlo. Ver `Backdrop`. */
  managed?: boolean;
};

export const StageCtx = React.createContext<StageInfo>({ zone: "center", breathe: "right" });
export const useStage = () => React.useContext(StageCtx);

export const ZONE_INFO: Record<StageZone, StageInfo> = {
  topLeft: { zone: "topLeft", breathe: "right" },
  left: { zone: "left", breathe: "right" },
  top: { zone: "top", breathe: "bottom" },
  full: { zone: "full", breathe: "none" },
  center: { zone: "center", breathe: "right" },
};

// ── SUPERFICIE / TINTA ──────────────────────────────────────────────────────
// Sin marco de papel, el texto cae sobre b-roll oscurecido: la tinta casi negra
// del theme (pensada para crema) se vuelve invisible. `SurfaceCtx` dice sobre
// QUÉ está apoyado el texto y `useInk` devuelve el color y la sombra correctos.
// Es un Provider puro: NO crea nodo DOM, así no rompe los `display:flex`.
export type Surface = "paper" | "footage";
export const SurfaceCtx = React.createContext<Surface>("paper");

export const useInk = (theme?: Theme) => {
  const t = useTheme(theme);
  const surface = React.useContext(SurfaceCtx);
  if (surface === "paper") {
    return {
      surface,
      text: t.color.text,
      soft: t.color.textSoft,
      dim: t.color.textDim,
      accent: t.color.gold,
      shadow: t.mode === "dark"
        ? "0 1px 0 rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.55)"
        : `0 1px 0 rgba(255,255,255,0.55), 0 3px 10px ${t.color.shadow}`,
      shadowStrong: t.mode === "dark"
        ? "0 1px 0 rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.55), 0 18px 44px rgba(0,0,0,0.5)"
        : `0 1px 0 rgba(255,255,255,0.55), 0 3px 10px ${t.color.shadow}, 0 22px 50px ${t.color.shadow}`,
    };
  }
  // sobre footage: tinta clara + sombras profundas (nunca "outline")
  return {
    surface,
    text: "#F8F3E4",
    soft: "rgba(248,243,228,0.80)",
    dim: "rgba(248,243,228,0.55)",
    accent: t.color.gold,
    shadow: "0 2px 8px rgba(0,0,0,0.75), 0 10px 30px rgba(0,0,0,0.5)",
    shadowStrong: "0 2px 8px rgba(0,0,0,0.8), 0 12px 34px rgba(0,0,0,0.6), 0 34px 80px rgba(0,0,0,0.5)",
  };
};

/** Marca una rama del árbol como apoyada sobre papel (o sobre footage).
 *  Provider puro, sin DOM: seguro dentro de contenedores flex. */
export const OnPaper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement(SurfaceCtx.Provider, { value: "paper" as Surface }, children);
export const OnFootage: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement(SurfaceCtx.Provider, { value: "footage" as Surface }, children);

// ── useEntrance — entrada con DESENFOQUE DE MOVIMIENTO que decae. Es el tell
//    número uno de un plano hecho en AE: nada aparece "nítido de una", llega
//    movido y se resuelve. Barato (un filter que decae en ~7 frames).
export const useEntrance = (at = 0, opts?: { dur?: number; blur?: number; rise?: number; scale?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = opts?.dur ?? 18;
  const maxBlur = opts?.blur ?? 10;
  const rise = opts?.rise ?? 34;
  const over = opts?.scale ?? 0.06;
  const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.8, stiffness: 150 }, durationInFrames: dur });
  const blur = interpolate(frame - at, [0, dur * 0.42], [maxBlur, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    s,
    op: Math.min(1, s * 1.7),
    blur,
    y: (1 - s) * rise,
    scale: 1 - (1 - s) * over,
    /** listo para pegar en style */
    style: {
      opacity: Math.min(1, s * 1.7),
      filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined,
      transform: `translateY(${((1 - s) * rise).toFixed(2)}px) scale(${(1 - (1 - s) * over).toFixed(4)})`,
    } as React.CSSProperties,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFUNDIDAD — los 3 sistemas que hacen que un plano se sienta 3D y no una
// pila de rectángulos: UNA luz para toda la escena, objetos con canto y brillo
// especular, y un FOCO que viaja siguiendo lo que se está contando.
// ═══════════════════════════════════════════════════════════════════════════

/** spread duplicado (core lo exporta, pero core importa de acá: traerlo cerraría
 *  el ciclo de imports). Mantener en sync con `core.spread`. */
const spreadAt = (durationInFrames: number, count: number, i: number) => {
  const start = 12;
  const end = durationInFrames * 0.7;
  const step = Math.max(9, Math.min(64, count > 1 ? (end - start) / count : 0));
  return start + i * step;
};

/** LUZ DE ESCENA — una sola fuente para TODO el plano. Los haces, el brillo
 *  especular de cada tarjeta y la dirección de cada sombra salen de acá; por eso
 *  el conjunto se lee como un espacio y no como capas sueltas. Respira despacio. */
export const useKeyLight = (zone: StageZone = "center") => {
  const frame = useCurrentFrame();
  // la luz entra desde arriba, del lado por el que respira la imagen
  const baseX = zone === "topLeft" || zone === "left" ? 0.74 : zone === "top" ? 0.5 : 0.62;
  const x = baseX + Math.sin(frame / 190) * 0.03;
  const y = 0.12 + Math.cos(frame / 240) * 0.02;
  // vector luz→centro: lo usan sombras y specular
  const dx = 0.5 - x;
  const dy = 0.5 - y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x,
    y,
    /** dirección normalizada de la sombra (hacia dónde cae) */
    sx: dx / len,
    sy: dy / len,
    /** ángulo en grados, para gradientes */
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
};

export type KeyLight = ReturnType<typeof useKeyLight>;

/** tilt3d — perspectiva REAL por elemento. No usa `transform-style: preserve-3d`
 *  a propósito: eso crea un *backdrop root* y mataría el `backdrop-filter` de las
 *  tarjetas de vidrio. Con `perspective()` dentro del propio transform se logra
 *  el volumen sin romper el desenfoque. */
export const tilt3d = (opts: {
  /** 0 = plano, 1 = inclinación marcada */
  amount?: number;
  /** semilla para que cada pieza tenga su propio ángulo */
  seed?: number;
  frame?: number;
  /** giro extra fijo (grados) */
  rx?: number;
  ry?: number;
  z?: number;
}) => {
  const a = opts.amount ?? 1;
  const seed = opts.seed ?? 0;
  const f = opts.frame ?? 0;
  const wobX = Math.sin(f / 165 + seed * 1.7) * 0.9 * a;
  const wobY = Math.cos(f / 205 + seed * 2.3) * 1.3 * a;
  const rx = (opts.rx ?? 0) + wobX;
  const ry = (opts.ry ?? 0) + wobY;
  const z = opts.z ?? 0;
  return `perspective(1600px) translateZ(${z}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
};

/** slabShadow — sombra de un objeto SÓLIDO: canto duro (el espesor de la placa),
 *  contacto cercano, y dos difusas lejanas. Todas caen del lado contrario a la
 *  luz. Una sola sombra genérica es lo que delata al "div con box-shadow". */
export const slabShadow = (light: KeyLight, opts?: { lift?: number; edge?: string; tint?: string }) => {
  const lift = opts?.lift ?? 1;
  const edge = opts?.edge ?? "rgba(58,44,28,0.55)";
  const tint = opts?.tint ?? "rgba(0,0,0,0.42)";
  const ox = light.sx * 3 * lift;
  const oy = Math.max(2, light.sy * 3 * lift + 3);
  return [
    `${(ox * 1.2).toFixed(1)}px ${(oy * 1.1).toFixed(1)}px 0 ${edge}`, // canto = espesor
    `${(ox * 3).toFixed(1)}px ${(oy * 3 + 6).toFixed(1)}px 16px ${tint}`,
    `${(ox * 8).toFixed(1)}px ${(oy * 8 + 18).toFixed(1)}px 46px ${tint}`,
    `${(ox * 16).toFixed(1)}px ${(oy * 16 + 40).toFixed(1)}px 96px ${tint}`,
  ].join(", ");
};

/** specular — capa de brillo que sigue a la luz de escena. Va como PRIMERA capa
 *  de `background` (CSS admite varias), así no hace falta un div extra que
 *  rompería los `display:flex` de las tarjetas. */
export const specular = (light: KeyLight, strength = 1) =>
  `radial-gradient(120% 90% at ${(light.x * 100).toFixed(0)}% ${(light.y * 100 - 8).toFixed(0)}%, rgba(255,255,255,${(0.5 * strength).toFixed(3)}) 0%, rgba(255,255,255,${(0.12 * strength).toFixed(3)}) 34%, rgba(255,255,255,0) 68%)`;

/**
 * useRack — RACK FOCUS: el foco viaja siguiendo lo que se está contando.
 * Mientras se revela el ítem i, ese ítem está nítido y adelante; los otros se
 * van de foco y retroceden. Cuando terminó de revelarse todo, TODO vuelve a
 * foco (el espectador tiene que poder leer la lista completa).
 *
 * Es el equivalente a que el camarógrafo mueva el foco al sujeto del que se
 * habla — y es la diferencia entre "capas apiladas" y "un espacio con profundidad".
 */
export const useRack = (
  count: number,
  durationInFrames: number,
  opts?: { blur?: number; dim?: number; shrink?: number; resolve?: boolean },
) => {
  const frame = useCurrentFrame();
  const maxBlur = opts?.blur ?? 3.4;
  const dim = opts?.dim ?? 0.42;
  const shrink = opts?.shrink ?? 0.022;
  const resolveAll = opts?.resolve ?? true;
  const lastAt = spreadAt(durationInFrames, count, count - 1);
  // a partir de acá ya se reveló todo → foco general, nada borroso
  const resolved = resolveAll
    ? interpolate(frame, [lastAt + 20, lastAt + 44], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (i: number) => {
    const at = spreadAt(durationInFrames, count, i);
    const next = spreadAt(durationInFrames, count, i + 1);
    // peso de atención: sube al aparecer, se sostiene su turno, baja al pasar
    const q0 = at - 6, q1 = Math.max(q0 + 0.01, at + 8), q2 = Math.max(q1 + 0.01, next - 2), q3 = Math.max(q2 + 0.01, next + 14);
    const w = interpolate(frame, [q0, q1, q2, q3], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const focus = Math.max(w, resolved);
    const off = 1 - focus;
    const blur = off * maxBlur;
    return {
      focus,
      blur,
      opacity: 1 - off * dim,
      scale: 1 - off * shrink,
      /** listo para pegar en style */
      style: {
        filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
        opacity: 1 - off * dim,
      } as React.CSSProperties,
    };
  };
};

/** Reflection — reflejo suave bajo un objeto flotante. Barato y muy efectivo:
 *  da la sensación de que el objeto está APOYADO en algo, no pegado al frame. */
export const Reflection: React.FC<{
  theme?: Theme;
  width: number;
  height?: number;
  y?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ theme, width, height, y = 0, opacity = 0.22, style }) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: "translateX(-50%) scaleY(-1)",
        width,
        height: height ?? width * 0.28,
        borderRadius: t.radius,
        background: `linear-gradient(180deg, ${t.color.surfaceStrong}55, rgba(255,255,255,0) 78%)`,
        filter: "blur(8px)",
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/** Bokeh — discos desenfocados MUY al fondo, con parallax propio. Es la capa que
 *  convence al ojo de que hay distancia detrás del contenido. */
export const Bokeh: React.FC<{ theme?: Theme; count?: number; opacity?: number; seed?: number }> = ({
  theme,
  count = 9,
  opacity = 0.5,
  seed = 0,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity, mixBlendMode: "screen" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = 60 + rand(i, seed + 1) * 190;
        const x = rand(i, seed + 2) * 100 + Math.sin(frame / (220 + i * 30)) * 1.6;
        const y = rand(i, seed + 3) * 100 + Math.cos(frame / (260 + i * 24)) * 1.2;
        const pulse = 0.6 + 0.4 * Math.sin(frame / (90 + i * 17) + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: r,
              height: r,
              marginLeft: -r / 2,
              marginTop: -r / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle at 42% 38%, ${t.color.gold}22 0%, ${t.color.gold}10 58%, rgba(0,0,0,0) 72%)`,
              filter: `blur(${8 + rand(i, seed + 4) * 14}px)`,
              opacity: pulse * (0.25 + rand(i, seed + 5) * 0.5),
            }}
          />
        );
      })}
    </div>
  );
};

/** mblur — desenfoque de movimiento a partir de un valor de spring (0→1).
 *  Pegalo en `filter` de cualquier elemento que entre con `kick()`/spring:
 *  llega movido y se resuelve en ~4 frames. Devuelve undefined cuando ya asentó
 *  (así no deja un filter activo todo el plano, que cuesta render). */
export const mblur = (s: number, amount = 7): string | undefined => {
  const b = (1 - Math.min(1, Math.max(0, s))) * amount;
  return b > 0.2 ? `blur(${b.toFixed(2)}px)` : undefined;
};

// ── drift — parallax determinista por CAPA. `depth` 0 = fondo (se mueve poco y
//    lento), 1 = primer plano (se mueve más). Es lo que separa las capas al ojo.
export const useDrift = (depth: number, seed = 0) => {
  const frame = useCurrentFrame();
  const a = frame / 130 + seed * 1.3;
  const b = frame / 91 + seed * 2.1;
  const amp = 4 + depth * 16;
  return {
    x: Math.sin(a) * amp,
    y: Math.cos(b) * amp * 0.6,
    scale: 1 + depth * 0.006 * Math.sin(a * 0.8),
  };
};

/** push lento de cámara sobre toda la escena (nunca queda un plano clavado) */
export const usePush = (durationInFrames: number, amount = 0.035) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, durationInFrames], [1, 1 + amount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ── autoSize — la tipografía NO puede romper el layout. Achica cuando el texto
//    es largo, con piso duro (legibilidad en celular manda).
export const autoSize = (text: string | undefined, base: number, idealChars: number, min?: number) => {
  const n = (text ?? "").length;
  if (n <= idealChars) return base;
  const k = Math.sqrt(idealChars / n);
  return Math.max(min ?? base * 0.62, Math.round(base * k));
};

// ═══════════════════════════════════════════════════════════════════════════
// L2 · GRADE — hunde el plate y lo tiñe con la sombra del theme. Sin esto, un
// b-roll claro y un papel crema tienen el MISMO valor y no hay figura/fondo.
// ═══════════════════════════════════════════════════════════════════════════
// ★ CONVENCIÓN de `side` en Grade y DepthBlur: es DONDE ESTÁ EL PAPEL, y el
// tratamiento se aplica al lado OPUESTO — el que el espectador realmente ve.
// (Primera versión lo tenía al revés: oscurecía debajo del papel, que ya tapa
// todo, y dejaba el b-roll visible crudo y brillante compitiendo con el texto.)
export const Grade: React.FC<{
  theme?: Theme;
  /** 0..1 cuánto se hunde el plate */
  strength?: number;
  side?: "left" | "top" | "center" | "full";
}> = ({ theme, strength = 1, side = "left" }) => {
  const t = useTheme(theme);
  const dark = t.mode === "dark";
  // tinte cálido en claro, frío-profundo en oscuro
  const tint = dark ? "8,12,14" : "34,25,16";
  const g =
    side === "left"
      ? `linear-gradient(100deg, rgba(${tint},${0.3 * strength}) 0%, rgba(${tint},${0.34 * strength}) 44%, rgba(${tint},${0.62 * strength}) 70%, rgba(${tint},${0.84 * strength}) 100%)`
      : side === "top"
        ? `linear-gradient(182deg, rgba(${tint},${0.8 * strength}) 0%, rgba(${tint},${0.34 * strength}) 24%, rgba(${tint},${0.34 * strength}) 70%, rgba(${tint},${0.86 * strength}) 100%)`
        : side === "full"
          ? `linear-gradient(120deg, rgba(${tint},${0.66 * strength}) 0%, rgba(${tint},${0.58 * strength}) 46%, rgba(${tint},${0.7 * strength}) 100%)`
          : `radial-gradient(74% 76% at 48% 48%, rgba(${tint},${0.22 * strength}) 0%, rgba(${tint},${0.52 * strength}) 56%, rgba(${tint},${0.88 * strength}) 100%)`;
  return (
    <div style={{ position: "absolute", inset: 0, background: g, pointerEvents: "none" }}>
      {/* rebote de color del acento en la sombra: une la paleta con el b-roll */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 70% at 12% 88%, ${t.color.accent}22, rgba(0,0,0,0) 70%)`,
          mixBlendMode: dark ? "screen" : "multiply",
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L3 · DEPTH — desenfoque REAL de lo que hay detrás, con máscara suave. Es
// profundidad de campo de verdad sobre el b-roll vivo (no una copia pegada).
// ═══════════════════════════════════════════════════════════════════════════
export const DepthBlur: React.FC<{
  radius?: number;
  side?: "left" | "top" | "center" | "full";
  saturate?: number;
}> = ({ radius = 26, side = "left", saturate = 0.86 }) => {
  // igual que Grade: `side` = dónde está el papel, se desenfoca lo OPUESTO (el
  // b-roll que sí se ve). Así el contenido queda en foco contra un fondo suave.
  const mask =
    side === "left"
      ? "linear-gradient(100deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.65) 66%, rgba(0,0,0,1) 88%)"
      : side === "top"
        ? "linear-gradient(182deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 68%, rgba(0,0,0,1) 92%)"
        : side === "full"
          ? "linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,1))"
          : "radial-gradient(70% 72% at 48% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,1) 92%)";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backdropFilter: `blur(${radius}px) saturate(${saturate})`,
        WebkitBackdropFilter: `blur(${radius}px) saturate(${saturate})`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L4 · SHAFTS — haces de luz con volumen (no las 6 barritas planas de antes):
// cada haz tiene ancho propio, gradiente en el eje corto y respira distinto.
// ═══════════════════════════════════════════════════════════════════════════
export const Shafts: React.FC<{
  theme?: Theme;
  x?: number;
  angle?: number;
  count?: number;
  opacity?: number;
}> = ({ theme, x = 62, angle = 18, count = 5, opacity = 1 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  if (!t.rays) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: count }, (_, i) => {
        const breathe = 0.55 + 0.45 * Math.sin(frame / (58 + i * 13) + i * 1.9);
        const w = 3 + rand(i, 2) * 7;
        const sway = Math.sin(frame / 150 + i) * 1.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + (i - count / 2) * 6 + sway}%`,
              top: "-18%",
              width: `${w}%`,
              height: "175%",
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${t.raysColor} 45%, rgba(0,0,0,0) 100%)`,
              transform: `rotate(${angle + rand(i, 5) * 4}deg)`,
              transformOrigin: "top center",
              filter: `blur(${18 + rand(i, 3) * 22}px)`,
              opacity: breathe * opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L5 · SCRIM / PARCHMENT — el "papel" donde vive el texto. NO es una tarjeta
// con borde: es un degradé direccional de borde a borde con un canto vivo
// (rim light) del lado donde muere. Así el plano se lee como UNA imagen, no
// como una diapositiva pegada encima del video.
// ═══════════════════════════════════════════════════════════════════════════
export const Scrim: React.FC<{
  theme?: Theme;
  side?: "left" | "top" | "center" | "full";
  /** 0..1 opacidad del papel en su parte más sólida */
  strength?: number;
  /** dónde termina el papel (0..1 del ancho/alto) */
  edge?: number;
}> = ({ theme, side = "left", strength = 0.95, edge = 0.62 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const paper = t.color.surfaceStrong;
  const paper2 = t.color.bg1;
  const e = Math.round(edge * 100);
  const body =
    side === "left"
      ? `linear-gradient(100deg, ${paper}${alpha(strength)} 0%, ${paper}${alpha(strength * 0.99)} ${e - 22}%, ${paper2}${alpha(strength * 0.72)} ${e}%, rgba(0,0,0,0) ${e + 16}%)`
      : side === "top"
        ? `linear-gradient(184deg, ${paper}${alpha(strength)} 0%, ${paper}${alpha(strength * 0.96)} ${e - 18}%, ${paper2}${alpha(strength * 0.6)} ${e}%, rgba(0,0,0,0) ${e + 14}%)`
        : side === "full"
          ? `linear-gradient(118deg, ${paper}${alpha(strength)} 0%, ${paper2}${alpha(strength * 0.96)} 100%)`
          : `radial-gradient(66% 74% at 46% 50%, ${paper}${alpha(strength)} 0%, ${paper}${alpha(strength * 0.9)} 46%, ${paper2}${alpha(strength * 0.5)} 72%, rgba(0,0,0,0) 92%)`;
  // canto vivo: una línea de luz donde el papel se corta
  const rimPos = side === "top" ? `${e}%` : `${e}%`;
  const glowBreath = 0.7 + 0.3 * Math.sin(frame / 64);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: body }} />
      {/* luz que entra por el canto del papel */}
      {side !== "full" && side !== "center" && (
        <div
          style={{
            position: "absolute",
            ...(side === "left"
              ? { left: rimPos, top: 0, bottom: 0, width: 3, transform: "skewX(-10deg)" }
              : { top: rimPos, left: 0, right: 0, height: 3, transform: "skewY(-1.2deg)" }),
            background: `linear-gradient(${side === "left" ? "180deg" : "90deg"}, rgba(0,0,0,0), ${t.color.gold}, rgba(0,0,0,0))`,
            opacity: 0.5 * glowBreath,
            filter: "blur(1.5px)",
          }}
        />
      )}
      {/* sombra que el papel PROYECTA sobre el b-roll (lo asienta en el plano) */}
      {side !== "full" && (
        <div
          style={{
            position: "absolute",
            ...(side === "left"
              ? { left: rimPos, top: 0, bottom: 0, width: 120, transform: "skewX(-10deg)" }
              : { top: rimPos, left: 0, right: 0, height: 110 }),
            background: `linear-gradient(${side === "left" ? "90deg" : "180deg"}, ${t.color.shadow}, rgba(0,0,0,0))`,
            opacity: 0.85,
          }}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BACKDROP — el tratamiento del b-roll, montado por el OVERLAY (no por el
// componente). Dos razones:
//   1) El blur real usa `backdrop-filter`, y cualquier ancestro con
//      `opacity < 1` crea un "backdrop root" que lo ANULA. Los componentes se
//      funden con `useBeat` → si el tratamiento vivía adentro, el desenfoque se
//      apagaba justo durante la entrada y la salida.
//   2) El fondo tiene que desenfocarse ANTES de que aparezcan las piezas: el
//      blur entra en ~14 frames, las tarjetas llegan encima, y al final el
//      fondo vuelve a resolverse. Eso es lo que se lee como "de After Effects".
// ═══════════════════════════════════════════════════════════════════════════
export const Backdrop: React.FC<{
  theme?: Theme;
  durationInFrames: number;
  zone?: StageZone;
  /** desenfoque máximo del fondo */
  blur?: number;
  /** 0..1 cuánto se hunde el plate */
  grade?: number;
}> = ({ theme, durationInFrames, zone = "center", blur = 30, grade = 1 }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  // ★ El tratamiento es UNIFORME, no direccional. La versión direccional tenía
  //   sentido cuando una columna/banda de papel tapaba medio frame: se trataba
  //   sólo el lado visible. Sin marco, el contenido flota sobre TODO el fondo →
  //   si se desenfoca medio frame queda la mitad nítida compitiendo con el
  //   texto. `zone` ya sólo orienta los haces de luz.
  const shaftX = zone === "topLeft" || zone === "left" ? 72 : zone === "top" ? 50 : 62;
  // rampa: entra en 14 frames, se sostiene, y suelta el foco en los últimos 10
  const ramp = interpolate(
    frame,
    [0, 14, Math.max(15, durationInFrames - 10), durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const push = interpolate(frame, [0, durationInFrames], [1.015, 1.055], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = Math.sin(frame / 130) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: -40, transform: `scale(${push}) translateX(${drift}px)` }}>
        <DepthBlur radius={blur * ramp} side="full" saturate={1 - 0.24 * ramp} />
        <Grade theme={t} strength={grade * ramp} side="full" />
        {/* bokeh MUY al fondo: la capa que convence al ojo de que hay distancia */}
        <Bokeh theme={t} count={9} opacity={0.55 * ramp} />
        <Shafts theme={t} x={shaftX} opacity={ramp} />
      </div>
      <Grain theme={t} />
      <Halation theme={t} x={shaftX + 10} />
      <Dust theme={t} count={18} opacity={0.5 * ramp} />
      <LensVignette theme={t} strength={0.6 + 0.55 * ramp} />
      <ChromaEdge strength={ramp} />
    </div>
  );
};

/** ChromaEdge — aberración cromática en las esquinas. Sutil, pero es lo que
 *  separa "render de navegador" de "pasó por una lente". */
export const ChromaEdge: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5 * strength }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        mixBlendMode: "screen",
        background:
          "radial-gradient(84% 78% at 49.4% 50%, rgba(0,0,0,0) 62%, rgba(90,140,255,0.13) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        mixBlendMode: "screen",
        background:
          "radial-gradient(84% 78% at 50.6% 50%, rgba(0,0,0,0) 62%, rgba(255,110,90,0.13) 100%)",
      }}
    />
  </div>
);

// ── Band / Column — REGIONES de papel con canto duro. Un scrim global deja el
//    frame "lechoso"; una región definida con borde vivo + sombra proyectada
//    sobre el b-roll es lo que se lee como diseñado. El b-roll queda oscuro
//    alrededor: ahí está el contraste que hacía falta.
export const Band: React.FC<{
  theme?: Theme;
  top: number;
  height: number;
  /** frames en los que la banda se abre */
  at?: number;
  dur?: number;
  children?: React.ReactNode;
}> = ({ theme, top, height, at = 0, dur = 20, children }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h = height * (0.86 + p * 0.14);
  const cy = top + height / 2;
  // El papel es TRANSLÚCIDO y desenfoca lo que tiene detrás: se ve la veta del
  // b-roll fantasmeando a través. Opaco al 100% es lo que se leía como "cartel
  // pegado encima del video".
  const A = alpha(0.9);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: cy - h / 2,
          height: h,
          background: `linear-gradient(178deg, ${t.color.surfaceStrong}${A} 0%, ${t.color.bg0}${alpha(0.88)} 52%, ${t.color.bg1}${alpha(0.86)} 100%)`,
          backdropFilter: "blur(26px) saturate(0.9)",
          WebkitBackdropFilter: "blur(26px) saturate(0.9)",
          boxShadow: `0 -30px 60px ${t.color.shadow}, 0 40px 80px ${t.color.shadow}`,
          opacity: Math.min(1, p * 1.6),
        }}
      >
        {/* cantos vivos arriba y abajo (luz que pega en el borde del papel) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, rgba(0,0,0,0), ${t.color.gold}CC 22%, ${t.color.gold}CC 78%, rgba(0,0,0,0))` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: `linear-gradient(90deg, rgba(0,0,0,0), ${t.color.shadow}, rgba(0,0,0,0))` }} />
        <Grain theme={t} amount={0.07} />
      </div>
      {children}
    </>
  );
};

// ── Plate — región de papel RECTANGULAR con canto, rim light y sombra sobre el
//    b-roll. Es el fallback honesto para los componentes que reparten contenido
//    por todo el box: un scrim global los dejaba "lechosos" (el b-roll asomando
//    al 15% en todas partes desatura todo). Una placa definida sobre footage
//    graduado y desenfocado se lee compuesta, no lavada.
export const Plate: React.FC<{ theme?: Theme; radius?: number; at?: number; dur?: number }> = ({
  theme,
  radius,
  at = 0,
  dur = 20,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r = radius ?? t.radius + 14;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: r,
        overflow: "hidden",
        background: `radial-gradient(120% 100% at 34% 18%, #FFFDF4 0%, ${t.color.surfaceStrong} 42%, ${t.color.bg1} 100%)`,
        boxShadow: [
          `inset 0 2px 0 rgba(255,255,255,0.9)`,
          `inset 0 0 90px ${t.color.shadow}`,
          `0 24px 50px ${t.color.shadow}`,
          `0 60px 120px ${t.color.shadow}`,
        ].join(", "),
        border: `1px solid ${t.color.line}`,
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${0.985 + p * 0.015})`,
      }}
    >
      {/* canto de luz superior + veta de papel */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, rgba(0,0,0,0), ${t.color.gold}AA 24%, ${t.color.gold}AA 76%, rgba(0,0,0,0))` }} />
      <Grain theme={t} amount={0.07} />
    </div>
  );
};

export const Column: React.FC<{
  theme?: Theme;
  /** ancho en px del papel (desde el borde izquierdo) */
  width: number;
  at?: number;
  dur?: number;
  side?: "left" | "right";
}> = ({ theme, width, at = 0, dur = 22, side = "left" }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = width * (0.94 + p * 0.06);
  const pos = side === "left" ? { left: -40, paddingLeft: 40 } : { right: -40, paddingRight: 40 };
  return (
    <div
      style={{
        position: "absolute",
        top: -40,
        bottom: -40,
        ...pos,
        width: w,
        background: `linear-gradient(${side === "left" ? 96 : 264}deg, ${t.color.surfaceStrong}${alpha(0.92)} 0%, ${t.color.bg0}${alpha(0.89)} 68%, ${t.color.bg1}${alpha(0.86)} 100%)`,
        backdropFilter: "blur(26px) saturate(0.9)",
        WebkitBackdropFilter: "blur(26px) saturate(0.9)",
        boxShadow: `${side === "left" ? "" : "-"}34px 0 90px ${t.color.shadow}, ${side === "left" ? "" : "-"}10px 0 30px ${t.color.shadow}`,
        opacity: Math.min(1, p * 1.6),
        transform: `skewX(${side === "left" ? -1.1 : 1.1}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          ...(side === "left" ? { right: 0 } : { left: 0 }),
          width: 3,
          background: `linear-gradient(180deg, rgba(0,0,0,0), ${t.color.gold}CC 18%, ${t.color.gold}CC 82%, rgba(0,0,0,0))`,
        }}
      />
      <Grain theme={t} amount={0.07} />
    </div>
  );
};

const alpha = (a: number) => {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255);
  return v.toString(16).padStart(2, "0").toUpperCase();
};

// ═══════════════════════════════════════════════════════════════════════════
// L6 · GRAIN — grano de película. Un tile de ruido que se DESPLAZA por frame
// (barato) en vez de re-generar turbulencia cada frame (carísimo y titila).
// ═══════════════════════════════════════════════════════════════════════════
export const Grain: React.FC<{ theme?: Theme; amount?: number }> = ({ theme, amount }) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const dark = t.mode === "dark";
  const op = amount ?? (dark ? 0.13 : 0.11);
  const dx = Math.round(rand(frame % 23, 1) * 60) - 30;
  const dy = Math.round(rand(frame % 29, 2) * 60) - 30;
  return (
    <svg
      width="120%"
      height="120%"
      style={{
        position: "absolute",
        left: -60,
        top: -60,
        opacity: op,
        mixBlendMode: dark ? "screen" : "multiply",
        pointerEvents: "none",
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    >
      <filter id={`pxgrain-${t.name}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves={3} seed={7} stitchTiles="stitch" />
        <feColorMatrix
          type="matrix"
          values={
            dark
              ? "0 0 0 0 0.86  0 0 0 0 0.84  0 0 0 0 0.76  0 0 0 0.62 0"
              : "0 0 0 0 0.17  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.6 0"
          }
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#pxgrain-${t.name})`} />
    </svg>
  );
};

/** halación: las luces sangran un poco, como una lente vieja */
export const Halation: React.FC<{ theme?: Theme; x?: number; y?: number; size?: number }> = ({
  theme,
  x = 74,
  y = 26,
  size = 62,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const b = 0.72 + 0.28 * Math.sin(frame / 88);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        background: `radial-gradient(${size}% ${size}% at ${x}% ${y}%, ${t.color.gold}22 0%, rgba(0,0,0,0) 62%)`,
        opacity: b,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L9 · ATMOS — barrido de luz, polvo y viñeta de lente.
// ═══════════════════════════════════════════════════════════════════════════
/** Sweep — un barrido de luz que cruza UNA vez (el brillo que "pasa" en AE) */
export const Sweep: React.FC<{ theme?: Theme; at?: number; dur?: number; angle?: number }> = ({
  theme,
  at = 14,
  dur = 46,
  angle = 104,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [-0.35, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame - at, [0, Math.min(8, dur / 2), Math.max(Math.min(8, dur / 2) + 0.01, dur - 10), dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: "-20%",
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: 0.5 * fade,
        background: `linear-gradient(${angle}deg, rgba(0,0,0,0) ${(p - 0.16) * 100}%, ${t.color.gold}3A ${p * 100}%, rgba(0,0,0,0) ${(p + 0.16) * 100}%)`,
      }}
    />
  );
};

/** Dust — motas con PROFUNDIDAD: las de adelante son grandes, borrosas y rápidas */
export const Dust: React.FC<{ theme?: Theme; count?: number; opacity?: number }> = ({
  theme,
  count = 22,
  opacity = 0.55,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const depth = rand(i, 9); // 0 = lejos, 1 = cerca
        const span = 210 + rand(i, 1) * 190;
        const p = ((frame * (0.5 + depth) + rand(i, 2) * span) % span) / span;
        const x = rand(i) * 100 + Math.sin(frame / 60 + i * 1.7) * (1 + depth * 3);
        const y = 104 - p * 118;
        const r = 1.5 + depth * 6;
        const life = Math.sin(p * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: t.color.gold,
              opacity: life * (0.18 + depth * 0.5),
              filter: `blur(${depth * 3.4}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/** LensVignette — viñeta + caída de nitidez en las esquinas */
export const LensVignette: React.FC<{ theme?: Theme; strength?: number }> = ({ theme, strength = 1 }) => {
  const t = useTheme(theme);
  const c = t.mode === "dark" ? "0,0,0" : "30,22,14";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(126% 96% at 50% 44%, rgba(${c},0) 46%, rgba(${c},${0.2 * strength}) 78%, rgba(${c},${0.42 * strength}) 100%)`,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CINEMA — arma L2·L3·L4·L6·L9 alrededor del contenido (L7/L8). Es el envoltorio
// que hace que CUALQUIER componente se lea como un plano compuesto y no como
// una diapositiva. Los hijos son el mid/foreground.
// ═══════════════════════════════════════════════════════════════════════════
export const Cinema: React.FC<{
  theme?: Theme;
  /** por defecto, la duración de la Sequence que envuelve al componente */
  durationInFrames?: number;
  side?: "left" | "top" | "center" | "full";
  /** solidez del papel (0.9 = casi opaco, 0.6 = el b-roll se ve a través) */
  paper?: number;
  edge?: number;
  grade?: number;
  blur?: number;
  shaftsX?: number;
  dust?: number;
  sweepAt?: number;
  children?: React.ReactNode;
}> = ({
  theme,
  durationInFrames,
  side = "left",
  paper = 0.94,
  edge = 0.62,
  grade = 1,
  blur = 24,
  shaftsX,
  dust = 20,
  sweepAt = 16,
  children,
}) => {
  const t = useTheme(theme);
  const stage = useStage();
  const { durationInFrames: seqDur } = useVideoConfig();
  const push = usePush(durationInFrames ?? seqDur, 0.03);
  const back = useDrift(0.15, 3);
  // Si el MONTAJE ya trató el fondo (`Backdrop` del PremiumOverlay), Cinema no
  // vuelve a hacerlo: duplicar grade/blur/polvo/viñeta apaga el plano y cuesta
  // el doble de render. Queda como pasarela para el papel y el contenido.
  if (stage.managed) {
    return <div style={{ position: "absolute", inset: 0 }}>{children}</div>;
  }
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* L2·L3·L4 — tratamiento del plate, con su propio parallax lento */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          transform: `scale(${push}) translate(${back.x * 0.4}px, ${back.y * 0.4}px)`,
        }}
      >
        <DepthBlur radius={blur} side={side} />
        <Grade theme={t} strength={grade} side={side} />
        <Shafts theme={t} x={shaftsX ?? (side === "left" ? 68 : 58)} />
      </div>
      {/* L5 — el papel. `paper={0}` lo saltea: lo pone el componente con
          <Band>/<Column>, que es una región con canto duro en vez de una
          neblina global (que deja el frame lechoso). */}
      {paper > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + (push - 1) * 0.35})` }}>
          <Scrim theme={t} side={side} strength={paper} edge={edge} />
        </div>
      )}
      {/* L6 — grano + halación */}
      <Grain theme={t} />
      <Halation theme={t} x={side === "left" ? 78 : 68} />
      {/* L7·L8 — contenido */}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      {/* L9 — atmósfera */}
      <Dust theme={t} count={dust} />
      <Sweep theme={t} at={sweepAt} />
      <LensVignette theme={t} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L7 — piezas de midground con peso real
// ═══════════════════════════════════════════════════════════════════════════

/** Slab — cuando SÍ hace falta una tarjeta: con separación de valor real,
 *  rim light arriba, sombra de contacto abajo y canto interno. No es el
 *  rectángulo crema-sobre-crema que no se leía. */
export const Slab: React.FC<{
  theme?: Theme;
  style?: React.CSSProperties;
  accent?: string;
  /** -1 hunde (más oscuro que el papel), +1 levanta (más claro) */
  lift?: number;
  children?: React.ReactNode;
}> = ({ theme, style, accent, lift = 1, children }) => {
  const t = useTheme(theme);
  const dark = t.mode === "dark";
  const up = lift >= 0;
  const face = up
    ? dark
      ? `linear-gradient(168deg, ${t.color.bg2}, ${t.color.bg1})`
      : `linear-gradient(168deg, #FFFDF6, ${t.color.surfaceStrong})`
    : dark
      ? `linear-gradient(168deg, ${t.color.bg0}, #000)`
      : `linear-gradient(168deg, ${t.color.bg2}, ${t.color.bg1})`;
  return (
    <div
      style={{
        position: "relative",
        background: face,
        borderRadius: t.radius,
        border: accent ? `3px solid ${accent}` : `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(42,38,32,0.10)"}`,
        boxShadow: [
          `0 2px 0 ${dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.85)"} inset`,
          `0 -2px 0 ${dark ? "rgba(0,0,0,0.4)" : "rgba(42,38,32,0.08)"} inset`,
          `0 10px 22px ${t.color.shadow}`,
          `0 34px 60px ${t.color.shadow}`,
          `0 64px 110px ${t.color.shadow}`,
        ].join(", "),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Plinth — sombra de contacto direccional bajo un objeto flotante */
export const Plinth: React.FC<{ theme?: Theme; width: number; y?: number; opacity?: number; style?: React.CSSProperties }> = ({
  theme,
  width,
  y = 0,
  opacity = 0.55,
  style,
}) => {
  const t = useTheme(theme);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: "translateX(-50%)",
        width,
        height: width * 0.17,
        borderRadius: "50%",
        background: `radial-gradient(50% 50% at 50% 50%, ${t.color.shadow} 0%, rgba(0,0,0,0) 72%)`,
        opacity,
        filter: "blur(6px)",
        ...style,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// L8 — tipografía con peso de broadcast
// ═══════════════════════════════════════════════════════════════════════════

/** stack de sombras para texto sobre imagen (una sola sombra = look barato) */
export const typeShadow = (t: Theme, strong = false) =>
  t.mode === "dark"
    ? `0 1px 0 rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.55)${strong ? ", 0 18px 44px rgba(0,0,0,0.5)" : ""}`
    : `0 1px 0 rgba(255,255,255,0.55), 0 3px 10px ${t.color.shadow}${strong ? `, 0 22px 50px ${t.color.shadow}` : ""}`;

/** Kicker — eyebrow de broadcast: regla que se dibuja + texto que entra */
export const Kicker: React.FC<{
  theme?: Theme;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, at = 2, size = 30, color, style, children }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const frame = useCurrentFrame();
  const col = color ?? t.color.gold;
  const w = interpolate(frame - at, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame - at, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, ...style }}>
      <div style={{ width: 66 * w, height: 4, background: col, borderRadius: 2, boxShadow: `0 0 18px ${col}66`, flexShrink: 0 }} />
      <div
        style={{
          fontFamily: t.fontLabel,
          fontSize: size,
          fontWeight: 700,
          letterSpacing: t.labelSpacing + 2,
          textTransform: t.upperLabels ? "uppercase" : "none",
          color: col,
          opacity: o,
          transform: `translateX(${(1 - o) * -12}px)`,
          textShadow: ink.shadow,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Headline — display con máscara de entrada (sube desde su propia línea base) */
export const Headline: React.FC<{
  theme?: Theme;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ theme, at = 6, size = 84, color, style, children }) => {
  const t = useTheme(theme);
  const ink = useInk(t);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = interpolate(frame - at, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  void fps;
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6 }}>
      <div
        style={{
          fontFamily: t.fontDisplay,
          fontSize: size,
          fontWeight: t.displayWeight,
          color: color ?? ink.text,
          lineHeight: 1.08,
          letterSpacing: -0.5,
          textShadow: ink.shadowStrong,
          opacity: Math.min(1, s * 1.5),
          transform: `translateY(${(1 - s) * size * 0.9}px)`,
          textTransform: t.name === "alarm" ? "uppercase" : "none",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Underline — subrayado a pluma bajo una palabra clave */
export const Underline: React.FC<{ theme?: Theme; at?: number; width: number; color?: string; style?: React.CSSProperties }> = ({
  theme,
  at = 24,
  width,
  color,
  style,
}) => {
  const t = useTheme(theme);
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const col = color ?? t.color.gold;
  const L = width * 1.1;
  return (
    <svg viewBox={`0 0 ${width} 22`} width={width} height={22} style={style}>
      <path
        d={`M 4 14 C ${width * 0.3} 6, ${width * 0.62} 20, ${width - 4} 9`}
        fill="none"
        stroke={col}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={L}
        strokeDashoffset={L * (1 - p)}
        style={{ filter: `drop-shadow(0 2px 4px ${t.color.shadow})` }}
      />
    </svg>
  );
};

