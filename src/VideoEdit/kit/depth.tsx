import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// ═══════════════════════════════════════════════════════════════════════════
// KIT DE PROFUNDIDAD COMPARTIDO — marca terrosa-vintage (huertas · amish · reparaciones)
// Helpers REUTILIZABLES y RENDER-SAFE. Deterministas: PROHIBIDO Date.now() /
// Math.random() / new Date(). Toda animación deriva de useCurrentFrame(). El
// "azar" es una función determinística por índice: rand(i).
// Paleta: ámbar/óxido + verde profundo + marrón tierra + crema. NADA cian/neón/alarma.
// ═══════════════════════════════════════════════════════════════════════════

// Azar determinístico [0..1) por índice — reemplazo de Math.random (render-safe).
export const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

// Ruido seno suave [-1..1] por índice+frame — para drift orgánico determinístico.
export const wobble = (i: number, frame: number, speed = 1): number =>
  Math.sin((frame * speed) / 14 + i * 1.7);

// ── ParallaxLayer — capa que se desplaza a una fracción del "scroll" para dar profundidad.
export const ParallaxLayer: React.FC<{
  depth?: number; // 0 = fondo lejano, 1 = frente cercano
  driftX?: number; // px de deriva horizontal en el rango de vida
  driftY?: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ depth = 0.5, driftX = 0, driftY = 20, scale = 1, children }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 90) * driftX * depth;
  const dy = Math.cos(frame / 110) * driftY * depth;
  const sc = scale + depth * 0.02 * Math.sin(frame / 120);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${sc})`, willChange: "transform" }}>
      {children}
    </div>
  );
};

type ParticleKind = "bubbles" | "dust" | "embers" | "spores" | "flakes";

// ── ParticleField — campo de partículas terrosas (burbujas/polvo/brasas/esporas/copos) que suben o flotan.
export const ParticleField: React.FC<{
  count?: number;
  kind?: ParticleKind;
  rise?: boolean; // true = suben (brasas/burbujas), false = flotan/caen
  drift?: number; // amplitud de deriva lateral
  color?: string;
  width?: number; // viewBox interno
  height?: number;
  opacity?: number;
}> = ({ count = 24, kind = "dust", rise = true, drift = 20, color, width = 1600, height = 900, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const palette: Record<ParticleKind, string> = {
    bubbles: COLORS.cold,
    dust: COLORS.amber,
    embers: COLORS.danger,
    spores: COLORS.accentSoft,
    flakes: "#EDE4CE",
  };
  const col = color ?? palette[kind];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const span = 120 + Math.floor(rand(i, 1) * 120);
        const p = ((frame + rand(i, 2) * span) % span) / span; // 0→1 en loop
        const bx = rand(i) * width + wobble(i, frame, 1.2) * drift;
        const y0 = rand(i, 3) * height;
        const by = rise ? y0 - p * (height * 0.5) : y0 + p * (height * 0.4);
        const r = 3 + rand(i, 4) * (kind === "embers" ? 5 : kind === "flakes" ? 8 : 7);
        const life = Math.sin(p * Math.PI); // aparece/desaparece suave
        const glow = kind === "embers" || kind === "bubbles";
        return (
          <g key={i} opacity={life * (0.35 + rand(i, 5) * 0.5)}>
            <circle cx={bx} cy={by} r={r} fill={col} opacity={glow ? 0.55 : 0.7} />
            {glow && <circle cx={bx} cy={by} r={r} fill="none" stroke={col} strokeWidth={2} />}
            {(kind === "bubbles" || kind === "flakes") && (
              <ellipse cx={bx - r * 0.3} cy={by - r * 0.3} rx={r * 0.35} ry={r * 0.25} fill="#fff" opacity={0.5} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── PaperGrain — grano/textura de papel-almanaque con feTurbulence (overlay sutil, sin costo de blur vivo).
export const PaperGrain: React.FC<{
  opacity?: number;
  scale?: number; // baseFrequency: mayor = grano más fino
  seed?: number;
  blend?: React.CSSProperties["mixBlendMode"];
}> = ({ opacity = 0.12, scale = 0.9, seed = 7, blend = "multiply" }) => {
  const id = `paperGrain${seed}`;
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, mixBlendMode: blend, pointerEvents: "none" }}>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency={scale} numOctaves={3} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

// ── GodRays — rayos de luz cálida de establo/taller cayendo en diagonal (haz volumétrico).
export const GodRays: React.FC<{
  x?: number; // origen del haz (% ancho)
  y?: number;
  angle?: number; // grados de inclinación del haz
  color?: string;
  intensity?: number;
  rays?: number;
}> = ({ x = 68, y = -10, angle = 22, color = "rgba(169,121,74,0.20)", intensity = 1, rays = 7 }) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame / 70), [-1, 1], [0.75, 1.05]) * intensity;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: breathe }}>
      {Array.from({ length: rays }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x + (i - rays / 2) * 5}%`,
            top: `${y}%`,
            width: `${5 + rand(i) * 6}%`,
            height: "160%",
            background: `linear-gradient(to bottom, ${color}, rgba(0,0,0,0))`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "top center",
            filter: "blur(14px)",
          }}
        />
      ))}
    </div>
  );
};

// ── RimLight — luz de borde cálida que recorta un elemento del fondo (halo direccional).
export const RimLight: React.FC<{
  color?: string;
  spread?: number; // px del halo
  x?: number; // 0..1 dirección de la luz
  y?: number;
  children: React.ReactNode;
}> = ({ color = COLORS.amber, spread = 26, x = 0.7, y = 0.2, children }) => {
  const dx = (x - 0.5) * spread;
  const dy = (y - 0.5) * spread;
  return (
    <div style={{ position: "relative", filter: `drop-shadow(${dx}px ${dy}px ${spread}px ${color})` }}>
      {children}
    </div>
  );
};

// ── DepthShadow — sombra 3D multicapa (varias sombras apiladas) para levantar cards del papel.
export const DepthShadow: React.FC<{
  layers?: number;
  distance?: number; // px totales de caída
  color?: string;
  radius?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ layers = 5, distance = 44, color = "rgba(42,38,32,0.16)", radius = 22, children, style }) => {
  const shadow = Array.from({ length: layers }, (_, i) => {
    const t = (i + 1) / layers;
    return `0 ${Math.round(t * distance)}px ${Math.round(t * distance * 1.4)}px ${color}`;
  }).join(", ");
  return <div style={{ borderRadius: radius, boxShadow: shadow, ...style }}>{children}</div>;
};

// ── Odometer — dígitos que ruedan verticalmente hacia un número objetivo (contador tipo almanaque).
export const Odometer: React.FC<{
  value: number; // valor objetivo
  digits?: number; // ancho mínimo en dígitos
  durationInFrames?: number;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, digits = 3, durationInFrames = 60, size = 90, color = COLORS.text, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200, mass: 1, stiffness: 55 }, durationInFrames });
  const current = value * s;
  const str = Math.floor(current).toString();
  const padded = str.length < digits ? "0".repeat(digits - str.length) + str : str;
  const chars = padded.split("");
  const cellH = size * 1.2;
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", fontFamily: FONT_STACK, color, fontSize: size, fontWeight: 900, lineHeight: 1 }}>
      {prefix && <span style={{ marginRight: size * 0.08 }}>{prefix}</span>}
      {chars.map((ch, i) => {
        const target = parseInt(ch, 10);
        const roll = target + (1 - s) * 6; // "rueda" de más al entrar
        const off = (roll % 10) * cellH;
        return (
          <span key={i} style={{ display: "inline-block", height: cellH, width: size * 0.62, overflow: "hidden", position: "relative", textAlign: "center" }}>
            <span style={{ position: "absolute", top: -off, left: 0, right: 0, transition: "none" }}>
              {/* reel plano 0..9 repetido; el scroll (off) ya incorpora `target` vía `roll`,
                  así que el contenido NO debe volver a sumarlo (antes: (d+target)%10 duplicaba
                  el corrimiento y el dígito final mostrado quedaba mal, ej. target=4 → mostraba 8). */}
              {Array.from({ length: 20 }, (_, d) => (
                <span key={d} style={{ display: "block", height: cellH }}>{d % 10}</span>
              ))}
            </span>
          </span>
        );
      })}
      {suffix && <span style={{ marginLeft: size * 0.08 }}>{suffix}</span>}
    </div>
  );
};

// ── InkDraw — traza un path como dibujado a pluma (strokeDashoffset animado por spring).
export const InkDraw: React.FC<{
  d: string;
  at?: number; // frame de inicio del trazo
  duration?: number;
  color?: string;
  width?: number;
  length?: number; // longitud estimada del path (para el dash)
  fill?: string;
  dropShadow?: boolean;
}> = ({ d, at = 0, duration = 30, color = COLORS.ink, width = 5, length = 1400, fill = "none", dropShadow = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
      style={dropShadow ? { filter: "drop-shadow(0 2px 3px rgba(42,38,32,0.28))" } : undefined}
    />
  );
};

// ── WaxSeal — sello de lacre con relieve (emboss vía gradientes radiales) que se estampa con rebote.
export const WaxSeal: React.FC<{
  at?: number;
  size?: number;
  color?: string;
  initials?: string; // texto/monograma grabado
  emblem?: React.ReactNode; // alternativa al texto
}> = ({ at = 0, size = 150, color = COLORS.danger, initials = "★", emblem }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 9, mass: 0.7, stiffness: 170 } });
  const r = size / 2;
  return (
    <div style={{ width: size, height: size, transform: `scale(${s})`, opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }) }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <radialGradient id="waxG" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
            <stop offset="45%" stopColor={color} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
          </radialGradient>
        </defs>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={r + Math.cos(a) * r * 0.92} cy={r + Math.sin(a) * r * 0.92} r={r * 0.16} fill={color} opacity={0.9} />;
        })}
        <circle cx={r} cy={r} r={r * 0.86} fill="url(#waxG)" />
        <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke="#000" strokeOpacity={0.28} strokeWidth={size * 0.02} />
        <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke="#fff" strokeOpacity={0.18} strokeWidth={size * 0.012} transform={`translate(0 ${-size * 0.01})`} />
        {emblem ?? (
          <text x={r} y={r + size * 0.13} textAnchor="middle" fontFamily={FONT_STACK} fontWeight={900} fontSize={size * 0.4} fill="#fff" fillOpacity={0.82} style={{ paintOrder: "stroke", stroke: "#000", strokeOpacity: 0.3, strokeWidth: size * 0.01 }}>
            {initials}
          </text>
        )}
      </svg>
    </div>
  );
};

// ── Frame3D — envuelve contenido en una tarjeta con perspectiva real (rotateY + translateZ) que se asienta.
export const Frame3D: React.FC<{
  at?: number;
  rotateY?: number; // grados de giro en reposo
  rotateX?: number;
  depth?: number; // translateZ px
  perspective?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at = 0, rotateY = 14, rotateX = 4, depth = 60, perspective = 1200, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.9, stiffness: 120 } });
  const ry = interpolate(s, [0, 1], [rotateY + 12, rotateY]);
  const tz = interpolate(s, [0, 1], [-depth, depth]);
  return (
    <div style={{ perspective, opacity: s }}>
      <div style={{ transform: `rotateY(${ry}deg) rotateX(${rotateX}deg) translateZ(${tz}px)`, transformStyle: "preserve-3d", ...style }}>
        {children}
      </div>
    </div>
  );
};

// ── SvgFilters — batería de filtros SVG reutilizables (turbulence/displace/blur) referenciables por id.
export const SvgFilters: React.FC<{ prefix?: string }> = ({ prefix = "kit" }) => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      {/* ondulación de papel/agua: desplaza con ruido */}
      <filter id={`${prefix}-ripple`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={4} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {/* borde rugoso hecho a mano (rough ink edge) */}
      <filter id={`${prefix}-rough`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={9} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3} />
      </filter>
      {/* desenfoque suave reutilizable para halos/sombras */}
      <filter id={`${prefix}-soft`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={6} />
      </filter>
      {/* relieve/emboss para sellos y grabados */}
      <filter id={`${prefix}-emboss`}>
        <feGaussianBlur stdDeviation={2} result="b" />
        <feSpecularLighting in="b" surfaceScale={3} specularConstant={0.8} specularExponent={12} lightingColor="#fff" result="s">
          <feDistantLight azimuth={235} elevation={55} />
        </feSpecularLighting>
        <feComposite in="s" in2="SourceGraphic" operator="in" result="sc" />
        <feComposite in="SourceGraphic" in2="sc" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} />
      </filter>
    </defs>
  </svg>
);
