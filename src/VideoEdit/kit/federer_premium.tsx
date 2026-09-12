import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { F_INTER } from "./premium/theme";
import { slabShadow, specular } from "./premium/stagecraft";

// ═══════════════════════════════════════════════════════════════════════════
// DR. FEDERER · LÍNEA PREMIUM — componentes de estatus para elevar la marca.
// Profundidad real: glass con blur + rim-light + sombras en capas · motivo de
// marca (línea EKG viva, monograma, anillos de progreso) · tipografía fina ·
// hairline de ORO que da autoridad. RENDER-SAFE (todo determinista).
// ═══════════════════════════════════════════════════════════════════════════
const INK0 = "#040d10";
const TEAL = "#19CDC6", TEALd = "#0B8681", TEALhi = "#8BF6EF";
const GOLD = "#E7C27D", GOLDd = "#C99A4E";
const W = "#F4FBFB", WSOFT = "rgba(226,244,243,0.64)", WDIM = "rgba(226,244,243,0.34)";
const HAIR = "rgba(255,255,255,0.10)";

const easeOut = { damping: 200, mass: 0.7 } as const;
const useIn = (delay = 0, cfg = easeOut) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: cfg });
};

// ── LUZ DE ESCENA FIJA ──────────────────────────────────────────────────────
// El canal tiene una key desde arriba-izquierda (el propio backdrop la declara
// en `at 25% 15%`). Se fija como constante en vez de hook para que `glass()`
// siga siendo una función PURA: varios componentes la esparcen dentro de un
// `.map()` y un hook ahí sería violación de reglas de hooks. Que sea la MISMA
// para todo el kit es justamente lo que hace que se lea como una escena.
const FED_LIGHT = { x: 0.25, y: 0.12, sx: 0.549, sy: 0.835, angle: 56.6 };

// ── glass — ★ AHORA CON VOLUMEN. Antes: un degradé plano + una sombra genérica.
//    Ahora suma brillo especular que sigue a la key (primera capa de
//    `background`, sin div extra para no romper los `display:flex`) y sombra de
//    objeto sólido: canto duro = espesor de la placa, más tres difusas.
const glass = (r = 24): React.CSSProperties => ({
  background: `${specular(FED_LIGHT, 0.22)}, linear-gradient(180deg, rgba(20,46,52,0.84), rgba(5,15,19,0.9))`,
  borderRadius: r,
  border: `1px solid ${HAIR}`,
  boxShadow: `${slabShadow(FED_LIGHT, { lift: 1.5, edge: "rgba(0,0,0,0.62)", tint: "rgba(0,0,0,0.5)" })}, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5), inset 0 0 46px rgba(25,205,198,0.07)`,
  backdropFilter: "blur(18px) saturate(1.06)",
  WebkitBackdropFilter: "blur(18px) saturate(1.06)",
});

// ── grano de película en la paleta del canal (no el del theme terroso) ───────
const FedGrain: React.FC<{ amount?: number }> = ({ amount = 0.1 }) => {
  const f = useCurrentFrame();
  const dx = Math.round((((f * 37 + 13) * 9301 + 49297) % 233280) / 233280 * 60) - 30;
  const dy = Math.round((((f * 61 + 7) * 9301 + 49297) % 233280) / 233280 * 60) - 30;
  return (
    <svg width="120%" height="120%" style={{ position: "absolute", left: -60, top: -60, opacity: amount, mixBlendMode: "screen", pointerEvents: "none", transform: `translate(${dx}px, ${dy}px)` }}>
      <filter id="fedgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={11} stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.72  0 0 0 0 0.86  0 0 0 0 0.86  0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#fedgrain)" />
    </svg>
  );
};

// ── PremiumBackdrop — ★ REESCRITO. Antes eran 3 degradés planos + una grilla:
//    el fondo de los takeover no tenía NINGUNA distancia, así que las tarjetas
//    de vidrio flotaban sobre una pared lisa. Ahora es un espacio: bokeh muy al
//    fondo, haces de luz que respiran, deriva lenta por capa, grano y viñeta de
//    lente. Sigue siendo sobrio — el canal manda "menos es más".
export const PremiumBackdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 210) * 10;
  const breathe = 0.72 + 0.28 * Math.sin(f / 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(130% 100% at ${25 + drift * 0.3}% 15%, #123b42, ${INK0} 72%)` }} />
      {/* bokeh profundo: la capa que convence al ojo de que hay distancia */}
      <AbsoluteFill style={{ mixBlendMode: "screen", transform: `translateX(${drift}px)` }}>
        {Array.from({ length: 7 }, (_, i) => {
          const r = ((i * 37 + 13) % 9) / 9;
          const size = 180 + r * 340;
          const col = i % 3 === 0 ? GOLD : TEAL;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(((i * 53 + 11) % 97) / 97) * 100}%`,
                top: `${(((i * 71 + 29) % 89) / 89) * 100}%`,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderRadius: "50%",
                background: `radial-gradient(circle at 42% 38%, ${col}1E 0%, ${col}0C 56%, rgba(0,0,0,0) 72%)`,
                filter: `blur(${16 + r * 22}px)`,
                opacity: 0.5 + 0.5 * Math.sin(f / (120 + i * 21) + i),
              }}
            />
          );
        })}
      </AbsoluteFill>
      {/* haces: entran por la key, con volumen y respiración */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: breathe }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${12 + i * 9 + Math.sin(f / 190 + i) * 1.4}%`,
              top: "-20%",
              width: `${4 + ((i * 29) % 7)}%`,
              height: "175%",
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${TEALhi}12 45%, rgba(0,0,0,0))`,
              transform: `rotate(${16 + i * 2}deg)`,
              transformOrigin: "top center",
              filter: `blur(${22 + i * 8}px)`,
            }}
          />
        ))}
      </AbsoluteFill>
      {/* la grilla clínica queda, pero al fondo y con deriva propia */}
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          transform: `translate(${drift * 0.5}px, ${drift * 0.2}px)`,
        }}
      />
      <FedGrain amount={0.09} />
      {/* viñeta de lente: cierra el plano y empuja el foco al centro */}
      <AbsoluteFill style={{ background: `radial-gradient(118% 88% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.34) 76%, rgba(0,0,0,0.62) 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.4))" }} />
    </AbsoluteFill>
  );
};

// hairline dorado (detalle de estatus)
const GoldLine: React.FC<{ w: number; delay?: number }> = ({ w, delay = 4 }) => {
  const p = useIn(delay);
  return <div style={{ height: 2, width: w * p, background: `linear-gradient(90deg, ${GOLD}, ${GOLDd} 60%, transparent)`, borderRadius: 2, boxShadow: `0 0 10px ${GOLD}66` }} />;
};

// ── línea EKG viva (motivo de marca) — un blip que viaja ─────────────────────
const EkgLine: React.FC<{ width: number; height?: number; color?: string; speed?: number }> = ({ width, height = 40, color = TEAL, speed = 7 }) => {
  const f = useCurrentFrame();
  const midY = height / 2;
  const beat = (x: number) => `L ${x} ${midY} L ${x + 8} ${midY - height * 0.34} L ${x + 16} ${midY + height * 0.42} L ${x + 24} ${midY - height * 0.9} L ${x + 32} ${midY + height * 0.5} L ${x + 40} ${midY}`;
  let d = `M 0 ${midY} `;
  for (let x = 10; x < width; x += 120) d += beat(x) + ` L ${x + 110} ${midY} `;
  const dash = 90;
  const off = -((f * speed) % (width + dash));
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={`${color}44`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${width}`} strokeDashoffset={off} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
};

// monograma F en anillo con arco de progreso
const Monogram: React.FC<{ size?: number; delay?: number }> = ({ size = 78, delay = 2 }) => {
  const p = useIn(delay);
  const R = size / 2 - 4;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={HAIR} strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p * 0.82)} style={{ filter: `drop-shadow(0 0 5px ${GOLD}88)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${TEAL}, ${TEALd})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 2px 10px rgba(255,255,255,0.3), 0 6px 18px rgba(0,0,0,0.4)` }}>
        <span style={{ color: W, fontFamily: F_INTER, fontWeight: 900, fontSize: size * 0.42, letterSpacing: -1 }}>F</span>
      </div>
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = WDIM }) => (
  <div style={{ color, fontFamily: F_INTER, fontWeight: 700, fontSize: 15, letterSpacing: 4, textTransform: "uppercase" }}>{children}</div>
);

// ─────────────────────────────────────────────────────────────────────────
// P1) LOWER-THIRD PREMIUM — glass + monograma + EKG viva + hairline oro
// ─────────────────────────────────────────────────────────────────────────
export const PremiumLowerThird: React.FC<{ name?: string; credential?: string; title: string }> = ({
  name = "DR. FEDERER", credential = "Medicina · Salud natural", title,
}) => {
  const p = useIn(0);
  const p2 = useIn(8);
  const x = interpolate(p, [0, 1], [-70, 0]);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER }}>
      <div style={{ position: "absolute", left: 100, bottom: 110, display: "flex", alignItems: "center", gap: 22, ...glass(22), padding: "22px 40px 22px 26px", opacity: p, transform: `translateX(${x}px)`, minWidth: 300 }}>
        <Monogram />
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ color: W, fontWeight: 800, fontSize: 30, letterSpacing: 0.5 }}>{name}</span>
            <span style={{ color: GOLD, fontWeight: 600, fontSize: 17, letterSpacing: 2 }}>{credential}</span>
          </div>
          <GoldLine w={interpolate(p2, [0, 1], [0, 210])} />
          <div style={{ color: W, fontWeight: 700, fontSize: 34, marginTop: 8, letterSpacing: -0.4, lineHeight: 1.05, whiteSpace: "nowrap", opacity: p2 }}>{title}</div>
          <div style={{ marginTop: 8, opacity: interpolate(p2, [0, 1], [0, 0.9]) }}>
            <EkgLine width={420} height={22} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// P2) STAT RING PREMIUM — número tabular + anillo de progreso + contexto
// ─────────────────────────────────────────────────────────────────────────
export const PremiumStatRing: React.FC<{ value: number; suffix?: string; eyebrow?: string; support?: string; pct?: number }> = ({
  value, suffix, eyebrow = "DATO CLAVE", support, pct = 78,
}) => {
  const f = useCurrentFrame();
  const p = useIn(0);
  const n = Math.round(interpolate(f, [6, 30], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const size = 240, R = 104, C = 2 * Math.PI * R;
  const arc = interpolate(f, [6, 34], [0, pct / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center" }}>
      <PremiumBackdrop />
      <div style={{ ...glass(30), padding: "48px 70px", display: "flex", alignItems: "center", gap: 54, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <defs>
              <linearGradient id="psr" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={TEALhi} /><stop offset="1" stopColor={TEALd} />
              </linearGradient>
            </defs>
            <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
            <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="url(#psr)" strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - arc)} style={{ filter: `drop-shadow(0 0 12px ${TEAL}aa)` }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ color: W, fontWeight: 900, fontSize: 92, letterSpacing: -3, lineHeight: 0.9, fontVariantNumeric: "tabular-nums" }}>{n}</span>
              {suffix && <span style={{ color: TEALhi, fontWeight: 800, fontSize: 34 }}>{suffix}</span>}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 360 }}>
          <Label color={TEAL}>{eyebrow}</Label>
          <div style={{ marginTop: 10, marginBottom: 14 }}><GoldLine w={90} /></div>
          {support && <div style={{ color: W, fontWeight: 600, fontSize: 30, lineHeight: 1.24 }}>{support}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// P3) CITA DE AUTORIDAD PREMIUM — glyph oro + cita + atribución Federer
// ─────────────────────────────────────────────────────────────────────────
export const PremiumAuthorityQuote: React.FC<{ quote: string; by?: string; role?: string }> = ({
  quote, by = "Dr. Federer", role = "Medicina · Salud natural",
}) => {
  const p = useIn(0);
  const p2 = useIn(10);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center" }}>
      <PremiumBackdrop />
      <div style={{ ...glass(30), padding: "56px 70px 46px", maxWidth: 1200, position: "relative", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>
        <div style={{ position: "absolute", top: 8, left: 40, color: GOLD, fontFamily: "Georgia, serif", fontSize: 160, lineHeight: 1, opacity: 0.5 }}>“</div>
        <div style={{ color: W, fontWeight: 700, fontSize: 52, lineHeight: 1.18, letterSpacing: -0.6, marginLeft: 40, marginTop: 30 }}>{quote}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 34, marginLeft: 40, opacity: p2 }}>
          <Monogram size={62} delay={10} />
          <div>
            <div style={{ color: TEALhi, fontWeight: 800, fontSize: 26 }}>{by}</div>
            <Label>{role}</Label>
          </div>
          <div style={{ flex: 1 }} />
          <EkgLine width={200} height={26} color={GOLD} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// P4) CAPÍTULO CINEMÁTICO — kicker + título gradiente + número fantasma + oro
// ─────────────────────────────────────────────────────────────────────────
export const PremiumChapter: React.FC<{ index?: number; kicker?: string; title: string }> = ({
  index = 1, kicker = "EL MÉTODO", title,
}) => {
  const p = useIn(0);
  const p2 = useIn(8);
  const p3 = useIn(16);
  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <PremiumBackdrop />
      {/* número fantasma gigante */}
      <div style={{ position: "absolute", fontWeight: 900, fontSize: 900, color: "rgba(255,255,255,0.035)", letterSpacing: -40, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, lineHeight: 1 }}>{String(index).padStart(2, "0")}</div>
      <div style={{ position: "relative", textAlign: "center", opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <Label color={GOLD}>{kicker} · {String(index).padStart(2, "0")}</Label>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 96, letterSpacing: -2, lineHeight: 1.02, background: `linear-gradient(180deg, ${W}, ${TEALhi})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", transform: `translateY(${interpolate(p2, [0, 1], [26, 0])}px)`, opacity: p2 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26, opacity: p3 }}>
          <EkgLine width={560} height={34} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// P5) PROTOCOLO PREMIUM — pasos en tiles glass con badge dorado + línea guía
// ─────────────────────────────────────────────────────────────────────────
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const PremiumProtocol: React.FC<{ title?: string; steps: { title: string; sub?: string }[]; zoom?: number }> = ({
  title = "PROTOCOLO NOCTURNO", steps, zoom = 1.28,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = steps.length;

  // ── geometría fija (para conocer el centro de cada tarjeta) ──
  const cardW = 300, cardH = 306, gap = 28;
  const totalW = n * cardW + (n - 1) * gap;
  const startX = 960 - totalW / 2;
  const centers = steps.map((_, i) => startX + i * (cardW + gap) + cardW / 2);
  const cy = 566, top = cy - cardH / 2;

  // ── línea de tiempo duración-dependiente: la cámara llega a cada tarjeta ──
  const intro = Math.round(durationInFrames * 0.06);
  const outro = Math.round(durationInFrames * 0.10);
  const usable = Math.max(1, durationInFrames - intro - outro);
  const seg = usable / n;                       // tiempo por tarjeta
  const trans = Math.min(seg * 0.6, 18);        // suavidad de la transición cámara→tarjeta
  // pos ∈ [0, n-1]: acumula un smoothstep por cada llegada de tarjeta
  let pos = 0;
  for (let i = 1; i < n; i++) {
    const arrive = intro + i * seg;
    pos += smoothstep(arrive - trans, arrive + trans, frame);
  }
  // empuje de cámara inicial (push-in sobre la 1ª tarjeta)
  const zoomAmt = smoothstep(0, Math.max(6, intro), frame);
  const Z = 1 + (zoom - 1) * zoomAmt;
  // centro X seguido por la cámara (interpola entre los centros de tarjeta)
  const cxFocus = centers.length === 1 ? centers[0]
    : interpolate(pos, centers.map((_, i) => i), centers, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = 960 - cxFocus, ty = 540 - cy;

  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, overflow: "hidden" }}>
      <PremiumBackdrop />
      {/* título — fijo, se desvanece cuando arranca el recorrido */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", opacity: (1 - zoomAmt) * 0.9 + 0.1 }}>
        <Label color={TEAL}>{title}</Label>
      </div>

      {/* STAGE — la cámara (transform) recorre y hace zoom a cada tarjeta */}
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${Z})`, transformOrigin: `${cxFocus}px ${cy}px` }}>
        {/* línea guía teal→oro entre badges */}
        <div style={{ position: "absolute", top: top + 46, left: centers[0], width: centers[n - 1] - centers[0], height: 2, background: `linear-gradient(90deg, ${TEAL}66, ${GOLD}66)` }} />
        {steps.map((s, i) => {
          const appear = smoothstep(i - 0.72, i - 0.12, pos);
          const passed = smoothstep(i + 0.5, i + 1.3, pos);
          const focus = 1 - Math.min(1, Math.abs(pos - i));       // 1 cuando la cámara está en ella
          const op = appear * (1 - 0.5 * passed);
          const cardScale = 1 + 0.05 * focus;
          const left = startX + i * (cardW + gap);
          // ★ RACK FOCUS — lo que faltaba y lo que la propia skill del canal pide
          //   ("escenas de profundidad con blur/glow/parallax/rack-focus"). La
          //   cámara ya recorría las tarjetas, pero TODAS quedaban nítidas: el
          //   recorrido se sentía un carrusel, no una lente. Ahora la que no está
          //   en foco se va de foco de verdad.
          const off = 1 - focus;
          const rackBlur = off * 4.2 + (1 - appear) * 8; // desenfoque de foco + de entrada
          // giro sutil HACIA la cámara: la fila deja de ser plana y se lee como
          // un arco físico. perspective() por elemento (nunca preserve-3d: crea
          // un backdrop root y mataría el vidrio).
          const yaw = Math.max(-9, Math.min(9, (i - pos) * -5.5));
          return (
            <div key={i} style={{
              position: "absolute", left, top, width: cardW, height: cardH, boxSizing: "border-box",
              ...glass(24), padding: "28px 26px",
              opacity: op,
              filter: rackBlur > 0.2 ? `blur(${rackBlur.toFixed(2)}px)` : undefined,
              transform: `perspective(1500px) translateY(${(1 - appear) * 34}px) rotateY(${yaw.toFixed(2)}deg) scale(${cardScale})`,
              borderColor: focus > 0.6 ? `${TEAL}66` : HAIR,
              // la sombra de objeto sólido de glass() se CONSERVA y se le suma el
              // glow de foco (antes se pisaba entera y se perdía el canto).
              boxShadow: `${slabShadow(FED_LIGHT, { lift: 1.4 + focus, edge: "rgba(0,0,0,0.62)", tint: "rgba(0,0,0,0.52)" })}, inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5)${focus > 0.5 ? `, 0 0 ${Math.round(40 + 40 * focus)}px rgba(25,205,198,${(0.08 + 0.16 * focus).toFixed(3)})` : ""}`,
            }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${GOLD}, ${GOLDd})`, display: "flex", alignItems: "center", justifyContent: "center", color: INK0, fontWeight: 900, fontSize: 32, marginBottom: 20, boxShadow: `0 8px 20px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.35)` }}>{i + 1}</div>
              <div style={{ color: W, fontWeight: 800, fontSize: 29, lineHeight: 1.1 }}>{s.title}</div>
              {s.sub && <div style={{ color: WSOFT, fontWeight: 500, fontSize: 21, marginTop: 10, lineHeight: 1.32 }}>{s.sub}</div>}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// P6) AVATAR EXPLICA — avatar full con zoom lento (Ken Burns) + tarjeta lateral
// (imagen arriba, texto debajo) que entra cuando explica. Llena el hueco al
// costado y sube la retención. mode: "imgtext" | "text".
// ─────────────────────────────────────────────────────────────────────────
export const AvatarExplain: React.FC<{
  avatarSrc: string; image?: string; kicker?: string; title: string; body?: string; bullets?: string[];
  side?: "left" | "right"; mode?: "imgtext" | "text" | "split"; blur?: boolean; startFrom?: number; appearAt?: number;
}> = ({ avatarSrc, image, kicker = "EN DETALLE", title, body, bullets, side = "right", mode = "imgtext", blur = false, startFrom = 0, appearAt = 10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inp = spring({ frame: frame - appearAt, fps: 30, config: { damping: 200, mass: 0.7 } });
  const isImg = (p?: string) => !!p && /\.(png|jpe?g|webp)$/i.test(p);
  const mediaEl = (src: string, style: React.CSSProperties) =>
    isImg(src) ? <Img src={staticFile(src)} style={style} /> : <OffthreadVideo src={staticFile(src)} muted style={style} />;

  // ── MODO SPLIT: pizarra un lado, Federer (vivo, muteado) el otro ──
  if (mode === "split") {
    const avRight = side !== "left"; // por defecto Federer DERECHA, pizarra IZQUIERDA
    const avatarPanel = (
      <div style={{ flex: "0 0 44%", position: "relative", overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(avatarSrc)} startFrom={startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 130px rgba(4,13,16,0.55)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, [avRight ? "left" : "right"]: 0, width: 3, background: `linear-gradient(180deg, ${TEALhi}, ${TEALd})`, boxShadow: `0 0 26px ${TEAL}` } as React.CSSProperties} />
      </div>
    );
    const pizarra = (
      <div style={{ flex: 1, padding: "0 72px", display: "flex", flexDirection: "column", justifyContent: "center", opacity: inp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 34, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLDd})`, borderRadius: 2 }} />
          <Label color={GOLD}>{kicker}</Label>
        </div>
        <div style={{ color: W, fontWeight: 900, fontSize: 54, lineHeight: 1.05, letterSpacing: -0.8, marginBottom: 30 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {(bullets || []).map((bt, i) => {
            const bi = spring({ frame: frame - (appearAt + 8 + i * 7), fps: 30, config: { damping: 200, mass: 0.6 } });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: bi, transform: `translateX(${interpolate(bi, [0, 1], [-26, 0])}px)` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL}, ${TEALd})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: W, fontWeight: 900, fontSize: 17 }}>✓</div>
                <div style={{ color: W, fontWeight: 600, fontSize: 31, lineHeight: 1.2 }}>{bt}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
    return (
      <AbsoluteFill style={{ fontFamily: F_INTER, display: "flex", flexDirection: "row", backgroundColor: INK0 }}>
        <PremiumBackdrop />
        {avRight ? <>{pizarra}{avatarPanel}</> : <>{avatarPanel}{pizarra}</>}
      </AbsoluteFill>
    );
  }

  // ── MODOS full: imgtext / text — con opción BLUR (Federer se desenfoca al explicar) ──
  const zp = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(zp, [0, 1], [1.03, 1.12]);
  const tyk = interpolate(zp, [0, 1], [0, -18]);
  const blurPx = blur ? interpolate(frame, [appearAt, appearAt + 16], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const dx = interpolate(inp, [0, 1], [side === "right" ? 90 : -90, 0]);
  const isR = side === "right";
  const CARD_W = 560;

  return (
    <AbsoluteFill style={{ fontFamily: F_INTER, backgroundColor: INK0, overflow: "hidden" }}>
      {/* AVATAR full con zoom (se DESENFOCA si blur) */}
      <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${tyk}px)`, transformOrigin: "50% 46%", filter: blurPx > 0.3 ? `blur(${blurPx}px)` : undefined }}>
        {/* OffthreadVideo + muted: la voz la da el AvatarLayer off-screen (evita voz cruzada) */}
        <OffthreadVideo src={staticFile(avatarSrc)} startFrom={startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* scrim: blur→oscurece todo; si no, degradé lateral */}
      <AbsoluteFill style={{ background: blur ? `rgba(4,13,16,${0.5 * inp})` : `linear-gradient(${isR ? "270deg" : "90deg"}, rgba(4,13,16,0.82) 0%, rgba(4,13,16,0.5) 28%, transparent 52%)`, opacity: inp }} />

      {/* TARJETA LATERAL */}
      <div style={{ position: "absolute", top: 150, [isR ? "right" : "left"]: 90, width: CARD_W, opacity: inp, transform: `translateX(${dx}px)` } as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 34, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLDd})`, borderRadius: 2 }} />
          <Label color={GOLD}>{kicker}</Label>
        </div>
        {mode === "imgtext" && (
          <div style={{ ...glass(24), padding: 12, marginBottom: 20 }}>
            <div style={{ width: "100%", height: 360, borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
              {image
                ? mediaEl(image, { width: "100%", height: "100%", objectFit: "cover" })
                : <div style={{ width: "100%", height: "100%", background: `radial-gradient(120% 100% at 40% 30%, #16323b, #061318)` }} />}
              <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 -40px 60px rgba(4,13,16,0.5)` }} />
            </div>
          </div>
        )}
        <div style={{ ...glass(22), padding: mode === "text" ? "30px 30px 34px" : "22px 28px 26px", borderLeft: `4px solid ${TEAL}` }}>
          <div style={{ color: W, fontWeight: 800, fontSize: mode === "text" ? 44 : 36, lineHeight: 1.1, letterSpacing: -0.4 }}>{title}</div>
          {body && <div style={{ color: WSOFT, fontWeight: 500, fontSize: mode === "text" ? 26 : 23, lineHeight: 1.36, marginTop: 12 }}>{body}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── DEMO wrapper premium (fondo clínico profundo) ────────────────────────────
export const PremiumDemo: React.FC<{ which?: string }> = ({ which = "lowerthird" }) => {
  const bg = (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(130% 100% at 25% 15%, #123b42, #040d10 72%)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "54px 54px" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45))" }} />
      <div style={{ position: "absolute", right: 140, top: 120, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, rgba(25,205,198,0.12), transparent 70%)` }} />
    </AbsoluteFill>
  );
  let c: React.ReactNode = null;
  if (which === "lowerthird") c = <PremiumLowerThird title="El romero borra las manchas de noche" />;
  else if (which === "stat") c = <PremiumStatRing value={15} suffix="días" eyebrow="Maceración del aceite" support="El tiempo exacto para que el romero cargue todo su poder." pct={72} />;
  else if (which === "quote") c = <PremiumAuthorityQuote quote="La mancha no se tapa, se trata desde la raíz. El romero trabaja mientras duermes." />;
  else if (which === "chapter") c = <PremiumChapter index={1} kicker="EL MÉTODO" title="El ritual nocturno" />;
  else if (which === "protocol") c = <PremiumProtocol steps={[{ title: "Limpia la piel", sub: "rostro seco, sin restos de crema" }, { title: "3 gotas de aceite", sub: "romero macerado, tibio" }, { title: "Masajea 60s", sub: "en círculos, hacia arriba" }, { title: "Deja actuar", sub: "toda la noche" }]} />;
  else if (which === "avatar") return <AvatarExplain avatarSrc="romnoc_opt.mp4" image="broll/rnrb010.mp4" kicker="POR QUÉ FUNCIONA" title="Mejora la microcirculación" body="Más sangre = más oxígeno y nutrientes que reparan la piel mientras duermes." side="right" mode="imgtext" startFrom={280} />;
  else if (which === "avatartext") return <AvatarExplain avatarSrc="romnoc_opt.mp4" kicker="LA CLAVE" title="Trátala desde la raíz" body="Tapar la mancha no sirve. Hay que apagar la inflamación que la genera." side="left" mode="text" startFrom={520} />;
  return <AbsoluteFill>{bg}{c}</AbsoluteFill>;
};
