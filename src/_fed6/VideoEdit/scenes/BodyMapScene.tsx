import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media } from "../components/Media";
import { THEME_MEDICO } from "../kit/premium/theme";

/* ============================================================================
 * BodyMapScene — el MAPA DEL CUERPO: la revisión que se enciende en orden
 * ----------------------------------------------------------------------------
 * Silueta humana de frente dibujada en SVG (contorno teal luminoso que se
 * traza solo al empezar) y encima las paradas de revisión, que se encienden
 * UNA POR UNA repartiendo `durationInFrames`. Las ya encendidas NO se apagan:
 * quedan prendidas y atenuadas, así al final se lee el MAPA COMPLETO.
 *
 * Los rótulos se acomodan solos: izquierda si x < 0.5, derecha si no, y se
 * escalonan verticalmente para que NUNCA se pisen entre ellos.
 *
 * MODELO DE CAPAS (stagecraft L1→L9), cada una a su ritmo:
 *   L1 PLATE    foto de cama (`bed`) escalada+desenfocada · o degradé profundo
 *   L2 GRADE    scrim que hunde el plate y unifica la paleta
 *   L3 AURORA   luz que respira detrás de la silueta (periodo larguísimo)
 *   L4 GRID     retícula clínica + barrido vertical
 *   L5 GLOW     relleno interno de la silueta (clip) con luz que viaja
 *   L6 LINE     contorno trazado con stroke-dashoffset + parallax
 *   L7 STOPS    puntos, pulsos, anillos y guías hacia los rótulos
 *   L8 CARDS    tarjetas claras con número grande + etiqueta
 *   L9 ATMOS    motas, halación y viñeta de lente
 *
 * 100% determinista (rand por índice, cero Date.now/Math.random). 1920x1080.
 * ========================================================================== */

const T = THEME_MEDICO;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* --------------------------------- paleta -------------------------------- */
const BG_HI = "#0E1D23";
const BG_LO = "#071216";
const TEAL = "#12B3AE";
const TEAL_HI = "#5AE7DE";
const TEAL_DEEP = "#063B40";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";

/* ------------------------------- utilidades ------------------------------ */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => {
  const k = cl01(t);
  return k * k * (3 - 2 * k);
};

/* ------------------------ silueta: mitad + espejo ------------------------ */
/** Mitad izquierda del contorno, de la base del cuello a la entrepierna.
 *  Espacio normalizado 400 x 900 (después se escala y se centra). */
const HALF: [number, number][] = [
  [182, 120], [176, 150], [148, 162], [112, 180], [90, 206],
  [78, 250], [70, 300], [64, 352], [56, 404], [50, 452],
  [46, 486], [44, 512], [58, 522], [70, 500], [76, 452],
  [84, 396], [92, 344], [100, 292], [108, 236], [118, 212],
  [122, 250], [126, 300], [124, 352], [128, 400], [136, 448],
  [140, 500], [144, 556], [148, 620], [152, 690], [156, 754],
  [158, 812], [150, 856], [178, 864], [176, 812], [174, 750],
  [172, 690], [176, 620], [182, 560], [190, 522], [200, 508],
];

/** polilínea suavizada (cuadráticas por punto medio): contorno limpio, sin picos */
const smooth = (pts: [number, number][]) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q ${cx} ${cy} ${((cx + nx) / 2).toFixed(1)} ${((cy + ny) / 2).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
};

const MIRROR: [number, number][] = HALF.map(([x, y]) => [400 - x, y] as [number, number]).reverse();
const BODY_D = `${smooth([...HALF, ...MIRROR])} Z`;

/* colocación de la figura en el lienzo de 1920x1080 */
const FIG_S = 0.95;
const FIG_W = 400 * FIG_S;
const FIG_H = 900 * FIG_S;
const FIG_X = 960 - FIG_W / 2;
const FIG_Y = (1080 - FIG_H) / 2 + 8;

/* columnas de rótulos: nunca invaden la figura */
const CARD_W = 520;
const LEFT_X = 168;
const LEFT_EDGE = LEFT_X + CARD_W; // 688
const RIGHT_X = 1232;
const RIGHT_EDGE = RIGHT_X; // 1232
const ELBOW_L = 736;
const ELBOW_R = 1184;
const CARD_MIN = 130;
const CARD_MAX = 950;
const CARD_GAP = 168;

type Stop = { n: number; label: string; x: number; y: number };

/* ═══════════════════════════ L1 · PLATE (cama) ═══════════════════════════ */
const Bed: React.FC<{ bed?: string; frame: number }> = ({ bed, frame }) => {
  const dx = Math.sin(frame / 230) * 13;
  const dy = Math.cos(frame / 275) * 8;
  if (!bed) {
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 100% at 50% 26%, #163038 0%, ${BG_HI} 46%, ${BG_LO} 100%)`,
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(58% 70% at 50% 58%, ${TEAL_DEEP}AA 0%, transparent 70%)`,
            transform: `translate(${dx * 0.5}px, ${dy * 0.5}px)`,
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: BG_LO }}>
      <AbsoluteFill style={{ transform: `scale(1.18) translate(${dx}px, ${dy}px)` }}>
        <Media
          src={bed}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(28px) saturate(0.7) brightness(0.42) contrast(1.06)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 88% at 50% 50%, ${BG_HI}C4 0%, ${BG_LO}F0 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const BodyMapScene: React.FC<{
  durationInFrames: number;
  title?: string;
  stops: Stop[];
  bed?: string;
}> = ({ durationInFrames, title = "Dónde se nota primero", stops, bed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(60, durationInFrames);
  const list = stops ?? [];
  const N = Math.max(1, list.length);

  /* ── reparto del tiempo: contorno primero, después las paradas ── */
  const IN = 8;
  const OUT = 12;
  const DRAW = 40; // trazado del contorno
  const usable = Math.max(30, D - OUT - IN - DRAW);
  const slot = usable / N;
  const at = (i: number) => IN + DRAW + i * slot;
  const activeIdx = Math.min(N - 1, Math.max(0, Math.floor((frame - IN - DRAW) / slot)));

  /* ── entrada / salida de la escena entera ── */
  const intro = interpolate(frame, [0, IN + 4], [0, 1], CLAMP);
  const outro = interpolate(frame, [D - OUT, D - 1], [1, 0], CLAMP);
  const outScale = interpolate(frame, [D - OUT, D - 1], [1, 0.984], CLAMP);

  /* ── cámara: push lentísimo + deriva de parallax de la silueta ── */
  const push = interpolate(frame, [0, D], [1.0, 1.055], CLAMP);
  const figX = Math.sin(frame / 172) * 9;
  const figY = Math.cos(frame / 214) * 6;

  /* ── contorno trazado ── */
  const LEN = 4200;
  const dHead = ease((frame - IN) / 22);
  const dBody = ease((frame - IN - 8) / 34);

  /* ── posición de cada parada, en píxeles ── */
  const px = (s: Stop) => FIG_X + cl01(s.x) * FIG_W;
  const py = (s: Stop) => FIG_Y + cl01(s.y) * FIG_H;

  /* ── layout de rótulos: por lado, escalonados, sin pisarse ── */
  const cardY: number[] = React.useMemo(() => {
    const out = new Array<number>(list.length).fill(0);
    (["left", "right"] as const).forEach((side) => {
      const items = list
        .map((s, i) => ({ s, i }))
        .filter((o) => (o.s.x < 0.5 ? "left" : "right") === side)
        .sort((a, b) => a.s.y - b.s.y);
      let prev = -Infinity;
      items.forEach((o) => {
        const want = FIG_Y + cl01(o.s.y) * FIG_H;
        const y = Math.max(want, prev + CARD_GAP, CARD_MIN);
        out[o.i] = y;
        prev = y;
      });
      if (items.length) {
        const ys = items.map((o) => out[o.i]);
        const over = Math.max(0, ys[ys.length - 1] - CARD_MAX);
        const room = Math.max(0, Math.min(...ys) - CARD_MIN);
        const shift = Math.min(over, room);
        if (shift > 0) items.forEach((o) => (out[o.i] -= shift));
      }
    });
    return out;
  }, [list]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: T.fontBody,
        backgroundColor: BG_LO,
        overflow: "hidden",
        opacity: intro * outro,
        transform: `scale(${outScale})`,
      }}
    >
      {/* L1 · PLATE */}
      <Bed bed={bed} frame={frame} />

      {/* L2 · GRADE */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,10,13,0.62) 0%, rgba(3,10,13,0.12) 30%, rgba(3,10,13,0.10) 70%, rgba(3,10,13,0.66) 100%)",
        }}
      />

      {/* L3 · AURORA — respiración larguísima detrás de la figura */}
      <AbsoluteFill>
        {Array.from({ length: 4 }, (_, i) => {
          const bx = 26 + rand(i, 11) * 52 + Math.sin(frame / (268 + i * 43)) * 2.2;
          const by = 20 + rand(i, 12) * 60 + Math.cos(frame / (312 + i * 39)) * 1.6;
          const size = 460 + rand(i, 13) * 520;
          const col = i === 2 ? GOLD : TEAL;
          const breath = 0.5 + 0.5 * Math.sin(frame / (104 + i * 27) + i * 1.3);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${bx}%`,
                top: `${by}%`,
                width: size,
                height: size * 0.78,
                marginLeft: -size / 2,
                marginTop: -size * 0.39,
                borderRadius: "50%",
                background: `radial-gradient(closest-side, ${col}, transparent 72%)`,
                filter: `blur(${58 + rand(i, 14) * 44}px)`,
                opacity: 0.08 + breath * 0.13,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* L4 · GRID — retícula clínica + barrido vertical (ritmo medio) */}
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${TEAL}0D 1px, transparent 1px), linear-gradient(90deg, ${TEAL}0D 1px, transparent 1px)`,
            backgroundSize: "108px 108px",
            backgroundPosition: `${(frame * 0.12) % 108}px ${(frame * 0.2) % 108}px`,
            maskImage: "radial-gradient(62% 70% at 50% 52%, #000 0%, transparent 84%)",
            WebkitMaskImage: "radial-gradient(62% 70% at 50% 52%, #000 0%, transparent 84%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 260,
            top: `${((frame * 1.1) % 1600) - 260}px`,
            background: `linear-gradient(180deg, transparent, ${TEAL}12, transparent)`,
            filter: "blur(8px)",
          }}
        />
      </AbsoluteFill>

      {/* L5·L6·L7 · la figura y sus paradas (con push + parallax propios) */}
      <AbsoluteFill
        style={{
          transform: `scale(${push}) translate(${figX}px, ${figY}px)`,
          transformOrigin: "50% 52%",
        }}
      >
        <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="bms_fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={TEAL} stopOpacity="0.30" />
              <stop offset="0.55" stopColor={TEAL_DEEP} stopOpacity="0.42" />
              <stop offset="1" stopColor="#03181C" stopOpacity="0.52" />
            </linearGradient>
            <radialGradient id="bms_dot" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={TEAL_HI} stopOpacity="0.9" />
              <stop offset="1" stopColor={TEAL_HI} stopOpacity="0" />
            </radialGradient>
            <filter id="bms_blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <clipPath id="bms_clip">
              <g transform={`translate(${FIG_X} ${FIG_Y}) scale(${FIG_S})`}>
                <path d={BODY_D} />
                <ellipse cx={200} cy={72} rx={44} ry={52} />
              </g>
            </clipPath>
          </defs>

          {/* L5 · relleno interno + luz que viaja por dentro (ritmo lento propio) */}
          <g clipPath="url(#bms_clip)" opacity={cl01(ease((frame - IN) / 26))}>
            <rect x={FIG_X - 40} y={FIG_Y - 80} width={FIG_W + 80} height={FIG_H + 160} fill="url(#bms_fill)" />
            <rect
              x={FIG_X - 60}
              y={FIG_Y + ((frame * 2.1) % (FIG_H + 420)) - 300}
              width={FIG_W + 120}
              height={230}
              fill={TEAL_HI}
              opacity={0.1}
              filter="url(#bms_blur)"
            />
          </g>

          {/* L6 · CONTORNO — se dibuja solo (halo + trazo) */}
          <g transform={`translate(${FIG_X} ${FIG_Y}) scale(${FIG_S})`}>
            <path
              d={BODY_D}
              fill="none"
              stroke={TEAL}
              strokeOpacity={0.35}
              strokeWidth={16}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#bms_blur)"
              strokeDasharray={LEN}
              strokeDashoffset={LEN * (1 - dBody)}
            />
            <path
              d={BODY_D}
              fill="none"
              stroke={TEAL_HI}
              strokeWidth={4.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LEN}
              strokeDashoffset={LEN * (1 - dBody)}
            />
            <ellipse
              cx={200}
              cy={72}
              rx={44}
              ry={52}
              fill="none"
              stroke={TEAL_HI}
              strokeWidth={4.2}
              strokeDasharray={340}
              strokeDashoffset={340 * (1 - dHead)}
            />
            {/* eje central tenue: da simetría sin detalle anatómico crudo */}
            <path
              d="M 200 140 L 200 500"
              stroke={TEAL}
              strokeOpacity={0.22 * dBody}
              strokeWidth={2}
              strokeDasharray="10 14"
            />
          </g>

          {/* L7 · PARADAS — guía, anillo y punto */}
          {list.map((s, i) => {
            const on = ease((frame - at(i)) / 16);
            if (on <= 0.001) return null;
            const isActive = i === activeIdx;
            const dim = isActive ? 1 : 0.55;
            const X = px(s);
            const Y = py(s);
            const left = s.x < 0.5;
            const cy = cardY[i] ?? Y;
            const elbow = left ? ELBOW_L : ELBOW_R;
            const edge = left ? LEFT_EDGE : RIGHT_EDGE;
            const guide = `M ${X.toFixed(1)} ${Y.toFixed(1)} L ${elbow} ${Y.toFixed(1)} L ${elbow} ${cy.toFixed(
              1
            )} L ${edge} ${cy.toFixed(1)}`;
            const gl = 1400;
            const gd = ease((frame - at(i) - 4) / 20);
            // anillo que se expande: fuerte al encender, después latido suave
            const burst = cl01((frame - at(i)) / 24);
            const ringR = 16 + burst * 66;
            const pulse = 0.5 + 0.5 * Math.sin(frame / 9 + i * 1.1);
            const dotS = 1 + (isActive ? 0.14 * pulse : 0.05 * pulse);
            return (
              <g key={i} opacity={on * dim}>
                <path
                  d={guide}
                  fill="none"
                  stroke={TEAL_HI}
                  strokeOpacity={isActive ? 0.85 : 0.4}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={gl}
                  strokeDashoffset={gl * (1 - gd)}
                />
                <circle cx={X} cy={Y} r={54} fill="url(#bms_dot)" opacity={(isActive ? 0.5 : 0.24) * (0.5 + pulse * 0.5)} />
                <circle
                  cx={X}
                  cy={Y}
                  r={ringR}
                  fill="none"
                  stroke={TEAL_HI}
                  strokeWidth={3}
                  opacity={(1 - burst) * 0.8}
                />
                {isActive && (
                  <circle
                    cx={X}
                    cy={Y}
                    r={22 + pulse * 12}
                    fill="none"
                    stroke={TEAL_HI}
                    strokeOpacity={0.35 * (1 - pulse * 0.6)}
                    strokeWidth={2}
                  />
                )}
                <circle cx={X} cy={Y} r={13 * dotS} fill={isActive ? "#EAFFFC" : TEAL_HI} />
                <circle cx={X} cy={Y} r={13 * dotS} fill="none" stroke={TEAL} strokeOpacity={0.8} strokeWidth={2.5} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* L8 · CARDS — tarjetas claras, número grande + etiqueta */}
      {list.map((s, i) => {
        const sp = spring({
          frame: frame - Math.round(at(i)) - 5,
          fps,
          config: { damping: 18, mass: 0.9, stiffness: 135 },
          durationInFrames: 20,
        });
        if (sp <= 0.001) return null;
        const isActive = i === activeIdx;
        const left = s.x < 0.5;
        const cy = cardY[i] ?? py(s);
        const blur = (1 - sp) * 9;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: left ? LEFT_X : RIGHT_X,
              top: cy,
              width: CARD_W,
              transform: `translateY(-50%) translateX(${(1 - sp) * (left ? -40 : 40)}px) scale(${isActive ? 1 : 0.955})`,
              opacity: sp * (isActive ? 1 : 0.56),
              filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: left ? "row-reverse" : "row",
                alignItems: "center",
                gap: 22,
                padding: "20px 26px",
                borderRadius: T.radius,
                background: isActive ? T.color.surfaceStrong : "rgba(238,246,248,0.90)",
                border: `1px solid ${isActive ? TEAL : "rgba(255,255,255,0.5)"}`,
                boxShadow: isActive
                  ? `0 24px 58px rgba(0,0,0,0.48), 0 0 0 4px ${TEAL}2E`
                  : "0 14px 32px rgba(0,0,0,0.36)",
              }}
            >
              <div
                style={{
                  flex: "0 0 auto",
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  background: isActive ? TEAL : TEAL_DEEP,
                  color: isActive ? "#04252A" : CREAM,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 900,
                  boxShadow: isActive ? `0 0 30px ${TEAL}99` : "none",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  textAlign: left ? "right" : "left",
                  fontSize: s.label.length > 30 ? 32 : 37,
                  lineHeight: 1.16,
                  fontWeight: 800,
                  color: INK,
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* L8b · TÍTULO */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 46,
          textAlign: "center",
          opacity: interpolate(frame, [2, 20], [0, 1], CLAMP),
          transform: `translateY(${interpolate(frame, [2, 20], [18, 0], CLAMP)}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ width: 56, height: 4, borderRadius: 2, background: TEAL_HI, opacity: 0.9 }} />
          <span style={{ fontSize: 25, fontWeight: 800, letterSpacing: 7, color: TEAL_HI, textTransform: "uppercase" }}>
            revisión
          </span>
          <div style={{ width: 56, height: 4, borderRadius: 2, background: TEAL_HI, opacity: 0.9 }} />
        </div>
        <div
          style={{
            fontSize: title.length > 32 ? 52 : 60,
            fontWeight: 900,
            color: CREAM,
            lineHeight: 1.08,
            textShadow: "0 2px 10px rgba(0,0,0,0.62), 0 18px 46px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </div>
      </div>

      {/* L9 · ATMOS — motas, halación, viñeta */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 20 }, (_, i) => {
          const depth = rand(i, 51);
          const span = 260 + rand(i, 52) * 220;
          const p = ((frame * (0.4 + depth) + rand(i, 53) * span) % span) / span;
          const x = rand(i, 54) * 100 + Math.sin(frame / 62 + i * 1.9) * (1 + depth * 3);
          const y = 104 - p * 112;
          const size = 2 + depth * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: "50%",
                background: i % 6 === 0 ? GOLD : TEAL_HI,
                opacity: Math.sin(p * Math.PI) * (0.1 + depth * 0.24),
                filter: `blur(${depth * 2.4}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(34% 42% at 50% 48%, ${TEAL}12 0%, transparent 72%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(122% 92% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.3) 76%, rgba(0,0,0,0.58) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
