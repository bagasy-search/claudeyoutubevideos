import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Media } from "../components/Media";
import { Dust, Grain, LensVignette } from "../kit/premium/stagecraft";
import { SPR, THEME_MEDICO } from "../kit/premium/theme";
import type { Theme } from "../kit/premium/theme";

/* ============================================================================
 * PlateOrderScene — EL ORDEN DEL PLATO · Dr. Federer (_fed6)
 * ----------------------------------------------------------------------------
 * Una escena de MECANISMO con dos lecturas simultáneas:
 *
 *   ADELANTE  los 3 platos reales llegan EN ORDEN (uno por tercio de escena).
 *             El activo está grande y nítido, inclinado en 3D al entrar y
 *             enderezándose; los ya servidos se corren a la fila de abajo,
 *             más chicos, atenuados y fuera de foco. Cada uno con su número
 *             (1·2·3), su rótulo en tarjeta clara y su sombra de contacto.
 *
 *   DETRÁS    se DIBUJA la curva de azúcar (stroke-dashoffset): primero el pico
 *             alto y agudo en alerta, y a medida que los platos llegan en orden
 *             una segunda curva teal, mucho más plana, se dibuja debajo. Al
 *             final un tirante punteado marca el HUECO entre las dos: ese
 *             contraste es el remate del plano.
 *
 * CAPAS (ritmos distintos): L1 cama · L2 grade · L3 bokeh/polvo · L4 gráfico
 * dibujado · L5 platos · L6 tipografía · L7 leyenda · L8 grano · L9 viñeta.
 * Todo determinista (rand puro por índice) y todo el timing sale de
 * `durationInFrames`, entrada y SALIDA incluidas. 1920x1080 @ 30fps.
 * ========================================================================== */

const INTER = loadInter().fontFamily;

/* --------------------------------- paleta -------------------------------- */
const BG = "#0E1D23";
const BG_DEEP = "#08151A";
const TEAL = "#12B3AE";
const TEAL_DEEP = "#063B40";
const TEAL_HI = "#5CE7DE";
const CREAM = "#F5F9FA";
const INK = "#0E1B22";
const GOLD = "#E6A23C";
const ALERT = "#E0523E";

/* theme del kit premium, en variante oscura para este plano nocturno */
const T = THEME_MEDICO;
const T_DARK: Theme = {
  ...T,
  name: "medico-dark",
  mode: "dark",
  color: { ...T.color, gold: GOLD, accent: TEAL, danger: ALERT },
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** azar determinístico por índice (mismo esquema que stagecraft.tsx) */
const rand = (i: number, salt = 0): number =>
  (((i * 37 + salt * 101 + 13) * 9301 + 49297) % 233280) / 233280;

/* ----------------------------- el gráfico -------------------------------- */
const CX0 = 200;
const CX1 = 1720;
const CW = CX1 - CX0;
const BASE_Y = 646;
const LIFT = 26;
const NS = 96;

const gauss = (t: number, c: number, s: number) => Math.exp(-((t - c) * (t - c)) / (2 * s * s));

/** pico alto y agudo + rebote por debajo de la línea (el bajón de después) */
const yHigh = (t: number) => BASE_Y - LIFT - 330 * gauss(t, 0.32, 0.075) + 44 * gauss(t, 0.62, 0.1);
/** onda ancha y baja: la misma comida, en orden */
const yLow = (t: number) => BASE_Y - LIFT - 116 * gauss(t, 0.44, 0.2);

type Pt = { x: number; y: number };
const sampleCurve = (f: (t: number) => number): Pt[] =>
  Array.from({ length: NS }, (_, i) => {
    const t = i / (NS - 1);
    return { x: CX0 + t * CW, y: f(t) };
  });

const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const pathLen = (pts: Pt[]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return L;
};

const HI_PTS = sampleCurve(yHigh);
const LO_PTS = sampleCurve(yLow);
const HI_D = toPath(HI_PTS);
const LO_D = toPath(LO_PTS);
const HI_LEN = pathLen(HI_PTS);
const LO_LEN = pathLen(LO_PTS);
const HI_AREA = `${HI_D} L${CX1},${BASE_Y} L${CX0},${BASE_Y} Z`;
const LO_AREA = `${LO_D} L${CX1},${BASE_Y} L${CX0},${BASE_Y} Z`;

/** x del pico alto — ahí se cuelga el tirante que mide el hueco entre curvas */
const PEAK_T = 0.32;
const PEAK_X = CX0 + PEAK_T * CW;
const PEAK_HI_Y = yHigh(PEAK_T);
const PEAK_LO_Y = yLow(PEAK_T);

/* ------------------------------ los platos ------------------------------- */
const ACTIVE_X = 1288;
const ACTIVE_Y = 760;
const ACTIVE_S = 348;
const SERVED_Y = 856;
const SERVED_S = 164;

type Props = {
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  plates: { image: string; label: string; sub?: string }[];
  curveLabelHigh?: string;
  curveLabelLow?: string;
  bed?: string;
};

export const PlateOrderScene: React.FC<Props> = ({
  durationInFrames,
  eyebrow = "EL ORDEN DEL PLATO",
  title = "La misma comida, otro orden",
  plates,
  curveLabelHigh = "Comiendo al revés",
  curveLabelLow = "Comiendo en orden",
  bed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = Math.max(1, plates.length);
  const D = Math.max(60, durationInFrames);

  /* — ritmo maestro: un plato por tercio, la curva teal acompaña — */
  const P0 = 22;
  const PEND = Math.max(P0 + 44, Math.round(D * 0.7));
  const stepF = n > 1 ? (PEND - P0) / (n - 1) : 0;
  const plateAt = (i: number) => P0 + i * stepF;

  const HI_AT = 14;
  const LO_AT = plateAt(0) + 6;

  /* — L0 · entrada y SALIDA de la escena entera — */
  const inOp = interpolate(frame, [0, 12], [0, 1], CLAMP);
  const outOp = interpolate(frame, [D - 12, D - 1], [1, 0], CLAMP);
  const outSc = interpolate(frame, [D - 12, D - 1], [1, 0.955], CLAMP);
  const shell: React.CSSProperties = {
    opacity: Math.min(inOp, outOp),
    transform: `scale(${outSc.toFixed(4)})`,
  };

  /* — L1 · cama: push lentísimo, distinto ritmo que todo lo demás — */
  const bedPush = interpolate(frame, [0, D], [1.1, 1.2], CLAMP);
  const bedDrift = Math.sin(frame / 220) * 10;

  /* — L4 · trazado de las curvas — */
  const hiP = interpolate(frame, [HI_AT, HI_AT + 46], [0, 1], CLAMP);
  const loP = interpolate(frame, [LO_AT, plateAt(n - 1) + 26], [0, 1], CLAMP);
  const hiHead = HI_PTS[Math.min(NS - 1, Math.round(hiP * (NS - 1)))];
  const loHead = LO_PTS[Math.min(NS - 1, Math.round(loP * (NS - 1)))];
  const axisIn = interpolate(frame, [6, 26], [0, 1], CLAMP);
  const hiFill = interpolate(hiP, [0.55, 1], [0, 1], CLAMP);
  const loFill = interpolate(loP, [0.6, 1], [0, 1], CLAMP);
  /* cuando la teal termina, la roja se atenúa: gana el contraste */
  const hiDim = interpolate(loP, [0.75, 1], [1, 0.62], CLAMP);

  /* — remate: el tirante que mide el hueco entre las dos curvas — */
  const gapSp = spring({
    frame: frame - Math.round(D * 0.8),
    fps,
    config: SPR.settle,
    durationInFrames: 22,
  });
  const gapY = PEAK_HI_Y + (PEAK_LO_Y - PEAK_HI_Y) * gapSp;

  /* — L6 · titulares — */
  const eyeSp = spring({ frame: frame - 6, fps, config: SPR.settle, durationInFrames: 20 });
  const titSp = spring({ frame: frame - 12, fps, config: SPR.settle, durationInFrames: 26 });
  const ruleW = interpolate(frame, [20, 44], [0, 420], CLAMP);
  const titleSize = title.length > 34 ? 66 : title.length > 26 ? 74 : 82;

  /* — L7 · leyenda de las curvas (chips claros, tinta oscura) — */
  const chipHi = spring({ frame: frame - (HI_AT + 10), fps, config: SPR.pop, durationInFrames: 20 });
  const chipLo = spring({ frame: frame - (LO_AT + 8), fps, config: SPR.pop, durationInFrames: 20 });

  /* — L5 · estado continuo de cada plato (aparecer → ser desplazado) — */
  const servedGap = n > 1 ? Math.min(250, 920 / (n - 1)) : 0;
  const servedX = (i: number) => 296 + i * servedGap;

  const state = plates.map((p, i) => {
    const ap = spring({ frame: frame - plateAt(i), fps, config: SPR.settle, durationInFrames: 24 });
    const dm =
      i + 1 < n
        ? spring({ frame: frame - plateAt(i + 1), fps, config: SPR.settle, durationInFrames: 28 })
        : 0;
    const size = ACTIVE_S + (SERVED_S - ACTIVE_S) * dm;
    const cx = ACTIVE_X + (servedX(i) - ACTIVE_X) * dm + (1 - ap) * 200;
    const cy = ACTIVE_Y + (SERVED_Y - ACTIVE_Y) * dm - (1 - ap) * 30 + Math.sin(frame / 46 + i * 1.9) * (5 - dm * 3.4);
    return {
      ...p,
      i,
      ap,
      dm,
      size,
      cx,
      cy,
      op: Math.min(1, ap * 1.6) * (1 - dm * 0.46),
      blur: dm * 1.7 + (1 - ap) * 7,
      ry: -16 * (1 - ap) + 4 * dm,
      rx: 7 * (1 - ap),
      scale: 0.86 + 0.14 * ap,
    };
  });

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: BG_DEEP, overflow: "hidden", ...shell }}>
      {/* ── L1 · CAMA — nunca un color plano: degradé profundo SIEMPRE debajo ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 22% 18%, ${TEAL_DEEP} 0%, ${BG} 46%, ${BG_DEEP} 100%)`,
        }}
      />
      {bed ? (
        <AbsoluteFill
          style={{
            transform: `scale(${bedPush.toFixed(4)}) translateX(${bedDrift.toFixed(2)}px)`,
            filter: "blur(26px) saturate(0.66) brightness(0.5)",
            opacity: 0.72,
          }}
        >
          <Media src={bed} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}

      {/* ── L2 · GRADE — hunde la cama y unifica la paleta del canal ── */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(178deg, rgba(14,29,35,0.86) 0%, rgba(6,59,64,0.44) 44%, rgba(8,21,26,0.94) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(78% 62% at 62% 56%, rgba(18,179,174,0.14) 0%, rgba(0,0,0,0) 68%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* ── L3 · BOKEH lento (fondo real) + polvo del kit (ritmo propio) ── */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 }}>
        {Array.from({ length: 8 }, (_, i) => {
          const r = 180 + rand(i, 3) * 300;
          const x = 8 + rand(i, 1) * 88 + Math.sin(frame / (250 + i * 34)) * 1.4;
          const y = 10 + rand(i, 2) * 84 + Math.cos(frame / (300 + i * 27)) * 1.1;
          const pulse = 0.55 + 0.45 * Math.sin(frame / (110 + i * 21) + i);
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
                background: `radial-gradient(circle at 40% 36%, ${TEAL}1F 0%, ${TEAL}0D 56%, rgba(0,0,0,0) 72%)`,
                filter: `blur(${18 + rand(i, 4) * 22}px)`,
                opacity: pulse * (0.3 + rand(i, 5) * 0.5),
              }}
            />
          );
        })}
      </AbsoluteFill>
      <Dust theme={T_DARK} count={16} opacity={0.34} />

      {/* ── L4 · GRÁFICO — ejes insinuados y curvas que se DIBUJAN ── */}
      <AbsoluteFill style={{ opacity: 0.98 }}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="poHiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ALERT} stopOpacity="0.34" />
              <stop offset="100%" stopColor={ALERT} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="poLoFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity="0.36" />
              <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ejes insinuados: hairlines, sin un solo número */}
          <g opacity={axisIn * 0.5}>
            <line
              x1={CX0 - 34}
              y1={BASE_Y}
              x2={CX0 - 34 + (CW + 68) * axisIn}
              y2={BASE_Y}
              stroke={CREAM}
              strokeOpacity={0.34}
              strokeWidth={2}
            />
            <line
              x1={CX0 - 34}
              y1={BASE_Y}
              x2={CX0 - 34}
              y2={BASE_Y - (BASE_Y - 214) * axisIn}
              stroke={CREAM}
              strokeOpacity={0.24}
              strokeWidth={2}
            />
            {[0.34, 0.62, 0.86].map((k, i) => (
              <line
                key={i}
                x1={CX0 - 34}
                y1={BASE_Y - (BASE_Y - 214) * k}
                x2={CX0 - 34 + (CW + 68) * axisIn}
                y2={BASE_Y - (BASE_Y - 214) * k}
                stroke={CREAM}
                strokeOpacity={0.09}
                strokeWidth={1.5}
                strokeDasharray="10 16"
              />
            ))}
          </g>

          {/* curva ALTA — el pico agudo */}
          <g opacity={hiDim}>
            <path d={HI_AREA} fill="url(#poHiFill)" opacity={hiFill * 0.9} />
            <path
              d={HI_D}
              fill="none"
              stroke={ALERT}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={HI_LEN}
              strokeDashoffset={HI_LEN * (1 - hiP)}
              style={{ filter: `drop-shadow(0 0 22px ${ALERT}88)` }}
            />
            {hiP > 0.02 && hiP < 0.995 ? (
              <circle cx={hiHead.x} cy={hiHead.y} r={13} fill={CREAM} stroke={ALERT} strokeWidth={6} />
            ) : null}
          </g>

          {/* curva BAJA — la misma comida, en orden */}
          <g>
            <path d={LO_AREA} fill="url(#poLoFill)" opacity={loFill * 0.95} />
            <path
              d={LO_D}
              fill="none"
              stroke={TEAL}
              strokeWidth={11}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LO_LEN}
              strokeDashoffset={LO_LEN * (1 - loP)}
              style={{ filter: `drop-shadow(0 0 26px ${TEAL}99)` }}
            />
            {loP > 0.02 && loP < 0.995 ? (
              <circle cx={loHead.x} cy={loHead.y} r={14} fill={CREAM} stroke={TEAL} strokeWidth={6} />
            ) : null}
          </g>

          {/* remate: el tirante dorado que mide el hueco entre las dos */}
          <g opacity={gapSp}>
            <line
              x1={PEAK_X}
              y1={PEAK_HI_Y}
              x2={PEAK_X}
              y2={gapY}
              stroke={GOLD}
              strokeWidth={4}
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
            <line x1={PEAK_X - 30} y1={PEAK_HI_Y} x2={PEAK_X + 30} y2={PEAK_HI_Y} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
            <line x1={PEAK_X - 30} y1={gapY} x2={PEAK_X + 30} y2={gapY} stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
          </g>
        </svg>
      </AbsoluteFill>

      {/* ── L5a · guías entre platos ya servidos ── */}
      {state.slice(0, -1).map((s, i) => {
        const on = state[i + 1]?.dm ?? 0;
        return (
          <div
            key={`ch-${i}`}
            style={{
              position: "absolute",
              left: servedX(i) + servedGap / 2,
              top: SERVED_Y,
              transform: "translate(-50%,-50%)",
              opacity: on * 0.7,
              color: TEAL,
              fontSize: 54,
              fontWeight: 300,
              lineHeight: 1,
              textShadow: `0 0 22px ${TEAL}66`,
            }}
          >
            ›
          </div>
        );
      })}

      {/* ── L5b · LOS PLATOS ── */}
      {state.map((s) => {
        const ring = Math.max(5, s.size * 0.024);
        const badge = Math.max(48, s.size * 0.25);
        const cardW = s.size * 1.34;
        const labSize = 20 + (34 - 20) * (1 - s.dm);
        return (
          <div key={s.i} style={{ position: "absolute", inset: 0, opacity: s.op }}>
            {/* sombra de contacto */}
            <div
              style={{
                position: "absolute",
                left: s.cx,
                top: s.cy + s.size * 0.5,
                width: s.size * 0.94,
                height: s.size * 0.17,
                marginLeft: -(s.size * 0.94) / 2,
                borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(0,0,0,0.6), rgba(0,0,0,0))",
                filter: "blur(14px)",
                opacity: 0.8 - s.dm * 0.25,
              }}
            />
            {/* el plato */}
            <div
              style={{
                position: "absolute",
                left: s.cx,
                top: s.cy,
                width: s.size,
                height: s.size,
                marginLeft: -s.size / 2,
                marginTop: -s.size / 2,
                borderRadius: "50%",
                overflow: "hidden",
                boxSizing: "border-box",
                border: `${ring}px solid ${CREAM}`,
                boxShadow: `0 ${18 - s.dm * 10}px ${44 - s.dm * 22}px rgba(0,0,0,0.55), 0 ${44 - s.dm * 26}px ${96 - s.dm * 50}px rgba(0,0,0,0.42), 0 0 0 ${ring * 0.5}px rgba(18,179,174,${(0.3 - s.dm * 0.2).toFixed(3)})`,
                transform: `perspective(1600px) rotateY(${s.ry.toFixed(2)}deg) rotateX(${s.rx.toFixed(2)}deg) scale(${s.scale.toFixed(4)})`,
                filter: s.blur > 0.2 ? `blur(${s.blur.toFixed(2)}px)` : undefined,
              }}
            >
              <Media
                src={s.image}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${(1.07 + 0.04 * Math.sin(frame / 74 + s.i * 1.4)).toFixed(4)})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(74% 58% at 30% 20%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 46%, rgba(0,0,0,0) 70%), radial-gradient(120% 100% at 50% 118%, rgba(6,59,64,0.55) 0%, rgba(0,0,0,0) 56%)",
                }}
              />
            </div>
            {/* número 1·2·3 */}
            <div
              style={{
                position: "absolute",
                left: s.cx - s.size * 0.42,
                top: s.cy - s.size * 0.42,
                width: badge,
                height: badge,
                marginLeft: -badge / 2,
                marginTop: -badge / 2,
                borderRadius: "50%",
                background: `linear-gradient(160deg, ${GOLD} 0%, #C98526 100%)`,
                boxShadow: `0 10px 26px rgba(0,0,0,0.5), 0 0 0 ${Math.max(3, badge * 0.06)}px rgba(14,29,35,0.85)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: INK,
                fontSize: badge * 0.56,
                fontWeight: 900,
                letterSpacing: -1,
                transform: `scale(${(0.7 + 0.3 * s.ap).toFixed(3)})`,
              }}
            >
              {s.i + 1}
            </div>
            {/* rótulo en tarjeta CLARA, tinta oscura */}
            <div
              style={{
                position: "absolute",
                left: s.cx,
                top: s.cy + s.size * 0.56,
                width: cardW,
                marginLeft: -cardW / 2,
                boxSizing: "border-box",
                background: T.color.surfaceStrong,
                borderRadius: T.radius * (1 - s.dm * 0.4),
                padding: `${14 - s.dm * 7}px ${22 - s.dm * 10}px`,
                textAlign: "center",
                boxShadow: "0 14px 36px rgba(0,0,0,0.5), 0 34px 72px rgba(0,0,0,0.34)",
                borderTop: `${4 - s.dm * 2}px solid ${TEAL}`,
                transform: `translateY(${((1 - s.ap) * 16).toFixed(2)}px)`,
              }}
            >
              <div
                style={{
                  color: T.color.text,
                  fontSize: labSize,
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: -0.3,
                }}
              >
                {s.label}
              </div>
              {s.sub ? (
                <div
                  style={{
                    color: T.color.textSoft,
                    fontSize: labSize * 0.66,
                    fontWeight: 600,
                    marginTop: 4,
                    opacity: 1 - s.dm,
                    lineHeight: 1.2,
                  }}
                >
                  {s.sub}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {/* ── L6 · TIPOGRAFÍA ── */}
      <div style={{ position: "absolute", left: 116, top: 74, maxWidth: 900 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: eyeSp,
            transform: `translateX(${((1 - eyeSp) * -22).toFixed(2)}px)`,
          }}
        >
          <div style={{ width: 18, height: 18, background: TEAL, boxShadow: `0 0 20px ${TEAL}AA` }} />
          <span
            style={{
              color: TEAL_HI,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: T.labelSpacing + 2,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          style={{
            marginTop: 14,
            color: CREAM,
            fontSize: titleSize,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: -1.6,
            opacity: Math.min(1, titSp * 1.5),
            transform: `translateY(${((1 - titSp) * 26).toFixed(2)}px)`,
            filter: titSp < 0.94 ? `blur(${((1 - titSp) * 8).toFixed(2)}px)` : undefined,
            textShadow: "0 3px 12px rgba(0,0,0,0.6), 0 22px 54px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 20,
            width: ruleW,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${TEAL} 0%, ${GOLD} 100%)`,
            boxShadow: `0 0 22px ${TEAL}66`,
          }}
        />
      </div>

      {/* ── L7 · LEYENDA de las dos curvas — tarjetas claras, tinta oscura ── */}
      <div style={{ position: "absolute", right: 96, top: 84, display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { txt: curveLabelHigh, col: ALERT, sp: chipHi },
          { txt: curveLabelLow, col: TEAL, sp: chipLo },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: T.color.surfaceStrong,
              borderRadius: 18,
              padding: "16px 26px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              opacity: Math.min(1, c.sp * 1.6),
              transform: `translateX(${((1 - c.sp) * 44).toFixed(2)}px) scale(${(0.92 + 0.08 * c.sp).toFixed(3)})`,
            }}
          >
            <div style={{ width: 46, height: 10, borderRadius: 5, background: c.col, boxShadow: `0 0 16px ${c.col}88` }} />
            <span style={{ color: T.color.text, fontSize: 32, fontWeight: 800, letterSpacing: -0.4, whiteSpace: "nowrap" }}>
              {c.txt}
            </span>
          </div>
        ))}
      </div>

      {/* ── L8/L9 · grano, halación y viñeta de lente ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          background: `radial-gradient(52% 46% at 22% 16%, ${TEAL}1A 0%, rgba(0,0,0,0) 62%)`,
          opacity: 0.7 + 0.3 * Math.sin(frame / 96),
        }}
      />
      <Grain theme={T_DARK} amount={0.09} />
      <LensVignette theme={T_DARK} strength={1.15} />
    </AbsoluteFill>
  );
};
