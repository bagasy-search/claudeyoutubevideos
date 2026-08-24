import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── ColadorEscala — la DEMO DE ESCALA con profundidad ─────────────────────────
// "Una crema de colágeno no entra en la piel". No es que sea difícil: NO CABE.
// La cámara viaja hacia un corte transversal de piel; la capa superior se revela
// como un COLADOR hexagonal finísimo; partículas chicas lo ATRAVIESAN y se
// pierden en la profundidad (achicándose y desenfocándose); entra una MADEJA
// gigante (la molécula de colágeno) que REBOTA y se queda arriba.
// 100% dibujado en SVG · determinista (random sembrado) · sin assets externos.
// Todos los tiempos son FRACCIONES de durationInFrames.

const INTER = loadInter().fontFamily;

const TEAL = "#12B3AE";
const TEAL_LIGHT = "#3FE0D6";
const CREAM = "#F3ECDD";
const AMBER = "#E8B96B";
const CORAL = "#E0523E";

const ACCENTS: Record<"teal" | "warn" | "danger", { main: string; soft: string }> = {
  teal: { main: TEAL_LIGHT, soft: TEAL },
  warn: { main: AMBER, soft: "#A8792F" },
  danger: { main: CORAL, soft: "#8E3123" },
};

// ── beats (fracciones de D) ───────────────────────────────────────────────────
const B = {
  meshIn: 0.15,
  meshFull: 0.31,
  fall: 0.32,
  smallIn: 0.35,
  ballIn: 0.52,
  impact: 0.635,
  bigIn: 0.68,
  noteIn: 0.84,
};

// geometría de escena (viewBox 1920x1080)
const MESH_Y = 590; // borde frontal del colador
const VP_Y = 1015; // punto de fuga hacia el interior
const BALL_R = 196;
const BALL_X = 720;
const BALL_Y = MESH_Y - BALL_R + 4;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const N_PARTS = 18;

export const ColadorEscala: React.FC<{
  durationInFrames: number;
  smallLabel?: string; // rótulo de lo que pasa
  bigLabel?: string; // rótulo de lo que NO pasa
  note?: string; // remate abajo
  tone?: "teal" | "warn" | "danger";
}> = ({
  durationInFrames,
  smallLabel = "LO CHICO PASA",
  bigLabel = "EL COLÁGENO NO",
  note = "No es que sea difícil: es que no cabe",
  tone = "teal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = Math.max(1, durationInFrames);
  const t = frame / D;
  const A = ACCENTS[tone];

  // ── CÁMARA: viaje continuo hacia la superficie + creep final ────────────────
  const dolly = interpolate(t, [0, 0.31, 0.635, 1], [0.58, 1, 1.05, 1.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const panY = interpolate(t, [0, 0.31, 1], [-160, 0, 34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const roll = interpolate(t, [0, 0.46], [1.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IO,
  });

  // parallax: cada capa consume una fracción del dolly según su profundidad
  const layer = (depth: number) => {
    const s = 1 + (dolly - 1) * depth;
    const ty = panY * depth;
    return `translate(960 560) scale(${s.toFixed(4)}) translate(-960 -560) translate(0 ${ty.toFixed(2)})`;
  };

  // ── revelado de la malla (barrido + línea de escaneo) ───────────────────────
  const revealW = interpolate(t, [B.meshIn, B.meshFull], [0, 2460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const scanOp = interpolate(t, [B.meshIn, B.meshIn + 0.03, B.meshFull], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const meshOp = interpolate(t, [B.meshIn, B.meshFull], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  // la malla "se energiza" mientras la atraviesan las partículas
  const live = interpolate(t, [B.fall, B.fall + 0.06, B.ballIn], [0, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── impacto: temblor de la malla ───────────────────────────────────────────
  const since = t - B.impact;
  const dent =
    since >= 0 ? Math.exp(-since * 24) * Math.sin(since * 88) * 27 : 0;
  const flash = since >= 0 ? Math.exp(-since * 46) : 0;

  // ── madeja: caída, rebote, asentado ────────────────────────────────────────
  const ballT = clamp01((t - B.ballIn) / (B.impact - B.ballIn));
  const grav = ballT * ballT * 0.82 + ballT * 0.18;
  const ballX = interpolate(grav, [0, 1], [392, BALL_X]);
  const bounce =
    since > 0 ? Math.exp(-since * 19) * Math.abs(Math.sin(since * 58)) : 0;
  const ballY = interpolate(grav, [0, 1], [-430, BALL_Y]) - bounce * 158;
  const sq = since >= 0 ? Math.exp(-since * 52) : 0;
  const ballSX = 1 + 0.13 * sq;
  const ballSY = 1 - 0.15 * sq;
  const ballRot =
    interpolate(grav, [0, 1], [-22, 4]) +
    (since > 0 ? Math.exp(-since * 12) * Math.sin(since * 34) * 5 : 0);
  const ballIn = ballT > 0 ? 1 : 0;

  // sombra proyectada sobre la malla (se cierra al acercarse)
  const gap = clamp01((BALL_Y - ballY) / 520);
  const shOp = ballIn * (0.5 - gap * 0.4);
  const shRx = 118 + gap * 130;

  // polvo del impacto
  const dust = clamp01(since / 0.11);

  // ── partículas chicas (máx 18) ─────────────────────────────────────────────
  const parts = Array.from({ length: N_PARTS }, (_, i) => {
    const delay = random(`ce-d${i}`) * 0.17;
    const speed = 0.86 + random(`ce-s${i}`) * 0.55;
    const u = clamp01((t - (B.fall + delay)) / (0.34 / speed));
    const y0 = -110 - random(`ce-y${i}`) * 190;
    const x0 = 250 + random(`ce-x${i}`) * 1430;
    const g = u * u * 0.56 + u * 0.44;
    const y = y0 + (VP_Y - y0) * g;
    const below = y > MESH_Y;
    const depth = below ? clamp01((y - MESH_Y) / (VP_Y - MESH_Y)) : 0;
    const x = x0 + (960 - x0) * depth * 0.58 + Math.sin(u * 7 + i) * 9 * (1 - depth);
    const r = (4.6 + random(`ce-r${i}`) * 4.2) * (1 - 0.74 * depth);
    const op =
      (u > 0 ? Math.min(1, u * 7) : 0) * (below ? 1 - 0.86 * depth : 1);
    return { x, y, r, op, below, i };
  });
  const near = parts.filter((p) => !p.below && p.op > 0.01);
  const far = parts.filter((p) => p.below && p.op > 0.01);

  // ── rótulos ────────────────────────────────────────────────────────────────
  const smSp = spring({
    frame: frame - Math.round(D * B.smallIn),
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });
  const bgSp = spring({
    frame: frame - Math.round(D * B.bigIn),
    fps,
    config: { damping: 17, stiffness: 120, mass: 0.9 },
  });
  const ntSp = spring({
    frame: frame - Math.round(D * B.noteIn),
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.9 },
  });
  const outO = interpolate(t, [0.965, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inO = interpolate(t, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: INTER,
        background:
          "radial-gradient(115% 88% at 50% 34%, #0E1D23 0%, #0B191F 58%, #08151A 100%)",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `rotate(${roll.toFixed(3)}deg) scale(1.05)`,
          opacity: inO * outO,
        }}
      >
        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="ce_deep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#123039" />
              <stop offset="1" stopColor="#07141A" />
            </linearGradient>
            <linearGradient id="ce_slab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2A5A5E" />
              <stop offset="0.45" stopColor="#17383E" />
              <stop offset="1" stopColor="#0A1D24" />
            </linearGradient>
            <linearGradient id="ce_fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ce_core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={A.soft} stopOpacity="0.32" />
              <stop offset="1" stopColor={A.soft} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ce_ball" cx="0.36" cy="0.3" r="0.78">
              <stop offset="0" stopColor="#6B5230" />
              <stop offset="0.55" stopColor="#3A2C1A" />
              <stop offset="1" stopColor="#160F08" />
            </radialGradient>
            <pattern
              id="ce_hex"
              width="56"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.46)"
            >
              <path
                d="M28 66 L0 50 L0 16 L28 0 L56 16 L56 50 L28 66 L28 100"
                fill="none"
                stroke={A.main}
                strokeWidth="5"
                strokeLinejoin="round"
              />
            </pattern>
            <mask id="ce_wipe">
              <rect
                x={-260}
                y={330}
                width={Math.max(0, revealW)}
                height={300}
                fill="url(#ce_fade)"
              />
            </mask>
            <clipPath id="ce_ballclip">
              <circle cx="0" cy="0" r={BALL_R - 4} />
            </clipPath>
          </defs>

          {/* ── CAPA PROFUNDA (parallax lento + desenfoque de distancia) ───── */}
          <g
            transform={layer(0.3)}
            style={{ filter: "blur(4px)" }}
            opacity={0.85}
          >
            <rect x={-200} y={MESH_Y + 190} width={2320} height={520} fill="url(#ce_deep)" />
            <ellipse cx={960} cy={VP_Y + 30} rx={760} ry={230} fill="url(#ce_core)" />
            <path
              d={`M -200 ${MESH_Y + 236} C 500 ${MESH_Y + 206}, 1400 ${MESH_Y + 268}, 2120 ${MESH_Y + 232}`}
              stroke="#1B4149"
              strokeWidth={22}
              fill="none"
              opacity={0.7}
            />
            <path
              d={`M -200 ${MESH_Y + 330} C 620 ${MESH_Y + 366}, 1320 ${MESH_Y + 300}, 2120 ${MESH_Y + 344}`}
              stroke="#153138"
              strokeWidth={30}
              fill="none"
              opacity={0.8}
            />
          </g>

          {/* ── CAPA MEDIA (dermis) ──────────────────────────────────────────── */}
          <g transform={layer(0.56)} style={{ filter: "blur(2px)" }} opacity={0.9}>
            <path
              d={`M -200 ${MESH_Y + 96} C 480 ${MESH_Y + 72}, 1380 ${MESH_Y + 128}, 2120 ${MESH_Y + 90}`}
              stroke="#1E4A51"
              strokeWidth={26}
              fill="none"
              opacity={0.78}
            />
            <path
              d={`M -200 ${MESH_Y + 152} C 560 ${MESH_Y + 182}, 1300 ${MESH_Y + 126}, 2120 ${MESH_Y + 166}`}
              stroke="#17383F"
              strokeWidth={18}
              fill="none"
              opacity={0.7}
            />
            <circle cx={430} cy={MESH_Y + 128} r={9} fill={A.soft} opacity={0.35} />
            <circle cx={1290} cy={MESH_Y + 174} r={7} fill={A.soft} opacity={0.28} />
            <circle cx={1660} cy={MESH_Y + 112} r={6} fill={CREAM} opacity={0.14} />
          </g>

          {/* ── PARTÍCULAS YA DEL OTRO LADO (fondo: se alejan y se desenfocan) ─ */}
          <g transform={layer(0.82)} style={{ filter: "blur(2.4px)" }}>
            {far.map((p) => (
              <circle
                key={`f${p.i}`}
                cx={p.x}
                cy={p.y}
                r={Math.max(0.6, p.r)}
                fill={CREAM}
                opacity={p.op * 0.92}
              />
            ))}
          </g>

          {/* ── LA MALLA / COLADOR (capa superior, apretada) ─────────────────── */}
          <g transform={layer(1)}>
            <g transform={`translate(0 ${dent.toFixed(2)})`} opacity={meshOp}>
              {/* superficie del colador vista en escorzo */}
              <g mask="url(#ce_wipe)">
                <rect
                  x={-260}
                  y={340}
                  width={2440}
                  height={250}
                  fill="url(#ce_hex)"
                  opacity={0.5 + live * 0.42}
                />
              </g>
              {/* canto: espesor de la capa superior */}
              <rect x={-260} y={MESH_Y} width={2440} height={30} fill="url(#ce_slab)" />
              <line
                x1={-260}
                y1={MESH_Y}
                x2={2180}
                y2={MESH_Y}
                stroke={A.main}
                strokeWidth={4}
                opacity={0.55 + live * 0.35}
              />
              <line
                x1={-260}
                y1={MESH_Y + 30}
                x2={2180}
                y2={MESH_Y + 30}
                stroke="#0A1B21"
                strokeWidth={5}
                opacity={0.85}
              />
              {/* barrido de revelado */}
              <line
                x1={-260 + revealW}
                y1={318}
                x2={-260 + revealW}
                y2={MESH_Y + 34}
                stroke={CREAM}
                strokeWidth={6}
                opacity={scanOp}
              />
              {/* destello del impacto sobre la malla */}
              <line
                x1={-260}
                y1={MESH_Y}
                x2={2180}
                y2={MESH_Y}
                stroke={CORAL}
                strokeWidth={12}
                opacity={flash * 0.75}
              />
            </g>
          </g>

          {/* ── PARTÍCULAS EN EL AIRE (nítidas, delante de la malla) ─────────── */}
          <g transform={layer(1)}>
            {near.map((p) => (
              <circle
                key={`n${p.i}`}
                cx={p.x}
                cy={p.y}
                r={Math.max(0.6, p.r)}
                fill={CREAM}
                opacity={p.op}
              />
            ))}
          </g>

          {/* ── SOMBRA + POLVO + MADEJA GIGANTE ─────────────────────────────── */}
          <g transform={layer(1)}>
            <ellipse
              cx={ballX}
              cy={MESH_Y + 10 + dent}
              rx={shRx}
              ry={20}
              fill="#04090C"
              opacity={Math.max(0, shOp)}
            />

            {dust > 0 && dust < 1
              ? Array.from({ length: 8 }, (_, k) => {
                  const ang = (-166 + k * 19 + random(`ce-du${k}`) * 12) * (Math.PI / 180);
                  const rad = dust * (86 + random(`ce-dr${k}`) * 128);
                  return (
                    <circle
                      key={`d${k}`}
                      cx={BALL_X + Math.cos(ang) * rad}
                      cy={MESH_Y + 6 + Math.sin(ang) * rad * 0.42}
                      r={Math.max(0.5, (9 + random(`ce-dz${k}`) * 8) * (1 - dust))}
                      fill={CREAM}
                      opacity={(1 - dust) * 0.42}
                    />
                  );
                })
              : null}

            {/* anillo de impacto */}
            <circle
              cx={BALL_X}
              cy={MESH_Y + 4}
              r={40 + dust * 210}
              fill="none"
              stroke={CORAL}
              strokeWidth={5}
              opacity={dust > 0 && dust < 1 ? (1 - dust) * 0.6 : 0}
            />

            <g
              transform={`translate(${ballX.toFixed(1)} ${ballY.toFixed(1)}) scale(${ballSX.toFixed(3)} ${ballSY.toFixed(3)}) rotate(${ballRot.toFixed(2)})`}
              opacity={ballIn}
            >
              <circle cx={0} cy={0} r={BALL_R} fill="url(#ce_ball)" />
              <g clipPath="url(#ce_ballclip)">
                {Array.from({ length: 11 }, (_, k) => (
                  <ellipse
                    key={`s${k}`}
                    rx={BALL_R - 10}
                    ry={(BALL_R - 10) * (0.2 + random(`ce-sb${k}`) * 0.6)}
                    transform={`rotate(${((k * 180) / 11 + random(`ce-sa${k}`) * 16 - 8).toFixed(2)})`}
                    fill="none"
                    stroke={k % 3 === 0 ? CREAM : AMBER}
                    strokeWidth={6 + random(`ce-sc${k}`) * 8}
                    opacity={0.3 + random(`ce-sd${k}`) * 0.42}
                  />
                ))}
              </g>
              <circle
                cx={0}
                cy={0}
                r={BALL_R - 2}
                fill="none"
                stroke={CREAM}
                strokeWidth={3}
                opacity={0.3}
              />
              <path
                d={`M ${-BALL_R * 0.72} ${-BALL_R * 0.5} A ${BALL_R * 0.9} ${BALL_R * 0.9} 0 0 1 ${BALL_R * 0.2} ${-BALL_R * 0.86}`}
                fill="none"
                stroke={CREAM}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={0.4}
              />
            </g>
          </g>
        </svg>
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 40%, rgba(3,9,12,0.72) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── RÓTULO: LO QUE PASA (abajo-izquierda, del lado de las partículas) ── */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 752,
          opacity: smSp * outO,
          transform: `translateY(${((1 - smSp) * 34).toFixed(2)}px)`,
          maxWidth: 620,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: A.main,
              boxShadow: `0 0 22px ${A.main}`,
            }}
          />
          <div
            style={{
              height: 3,
              width: Math.round(smSp * 190),
              background: A.main,
              opacity: 0.75,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 3,
            color: CREAM,
            textTransform: "uppercase",
            lineHeight: 1.08,
            textShadow: "0 10px 34px rgba(0,0,0,0.75)",
          }}
        >
          {smallLabel}
        </div>
      </div>

      {/* ── RÓTULO: LO QUE NO PASA (arriba-derecha, del lado de la madeja) ──── */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 196,
          width: 560,
          textAlign: "right",
          opacity: bgSp * outO,
          transform: `translateX(${((1 - bgSp) * 46).toFixed(2)}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              height: 5,
              width: Math.round(bgSp * 150),
              background: CORAL,
              boxShadow: `0 0 26px ${CORAL}`,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            letterSpacing: 1.5,
            color: CREAM,
            textTransform: "uppercase",
            lineHeight: 1.04,
            textShadow: "0 14px 44px rgba(0,0,0,0.85)",
          }}
        >
          {bigLabel}
        </div>
      </div>

      {/* ── REMATE (sólo el tramo final, centrado abajo) ─────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 916,
          textAlign: "center",
          opacity: ntSp * outO,
          transform: `translateY(${((1 - ntSp) * 26).toFixed(2)}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "14px 40px",
            borderRadius: 999,
            border: `1px solid ${A.soft}`,
            background: "rgba(8,21,26,0.62)",
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 1.2,
            color: "rgba(243,236,221,0.92)",
            maxWidth: 1500,
          }}
        >
          {note}
        </div>
      </div>
    </AbsoluteFill>
  );
};
