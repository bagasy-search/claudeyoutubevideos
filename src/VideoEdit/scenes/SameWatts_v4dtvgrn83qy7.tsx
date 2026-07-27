import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT } from "../theme";

// SameWatts — LA idea central del video, en una sola imagen comparada.
// Una vela entrega 80 watts térmicos SIEMPRE. La maceta no multiplica nada:
// lo único que cambia es EL DESTINO de esos mismos 80 watts.
//   · Izquierda (sin maceta): convección — el calor sube derechito al techo y ahí se queda.
//   · Derecha (con maceta):  radiación — el barro lo atrapa y lo devuelve en línea
//     recta a la altura del pecho de quien está sentado.
// El MISMO contador de 80 W en las dos mitades + un "=" en el divisor: la energía
// es idéntica, cambia dónde la pones. Look terroso: ocre, terracota, madera, pizarra.

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const CREAM = COLORS.bg0; // #EFE7D3
const DIM = "rgba(239,231,211,0.56)";
const FAINT = "rgba(239,231,211,0.24)";
const WOOD = "#5A4130";
const WOOD_HI = "#7A5B41";
const TERRA = "#B4623F";
const TERRA_DK = "#7E4229";
const SLATE0 = "#141110";
const SLATE1 = "#241C16";

// ── Mitad izquierda: la vela sola. El calor sube y se estanca contra el techo ──
const CandleAlone: React.FC<{ frame: number; fps: number; accent: string; rise: number }> = ({
  frame,
  fps,
  accent,
  rise,
}) => {
  const t = frame / fps;
  const flameTip = 380 + Math.sin(t * 5.2) * 3;
  const pool = interpolate(rise, [0.55, 1], [0, 1], CLAMP);
  const cols = [0, 1, 2, 3, 4];

  return (
    <svg width="100%" height="100%" viewBox="0 0 960 590" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="swPool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.55} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="swFlameL" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#FFE6B0" stopOpacity={0.5} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* calor estancado bajo el techo */}
      <ellipse cx={480} cy={74} rx={310} ry={46} fill="url(#swPool)" opacity={pool} />

      {/* techo / viga de madera */}
      <rect x={110} y={16} width={740} height={22} rx={4} fill={WOOD} />
      <rect x={110} y={16} width={740} height={5} rx={2} fill={WOOD_HI} />

      {/* columnas de convección: suben y se abren contra el techo */}
      {cols.map((i) => {
        const cx = 480 + (i - 2) * 52;
        const seg = 14;
        const pts: string[] = [];
        for (let k = 0; k <= seg; k++) {
          const p = k / seg;
          if (p > rise) break;
          const yy = 400 - p * 340;
          const wobble = Math.sin(t * 1.9 + k * 0.55 + i * 1.2) * (2 + p * 9);
          const spread = p > 0.7 ? ((p - 0.7) / 0.3) * (i - 2) * 66 : 0;
          pts.push(`${(cx + wobble + spread).toFixed(1)},${yy.toFixed(1)}`);
        }
        if (pts.length < 2) return null;
        return (
          <polyline
            key={i}
            points={pts.join(" ")}
            fill="none"
            stroke={accent}
            strokeWidth={3.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.46 + 0.34 * (1 - Math.abs(i - 2) / 2.6)}
          />
        );
      })}

      {/* el calor se derrama de costado bajo la viga: se queda arriba */}
      {[-1, 1].map((d) => (
        <path
          key={d}
          d={`M ${480 + d * 250} 62 L ${480 + d * 330} 62 M ${480 + d * 312} 52 L ${480 + d * 330} 62 L ${480 + d * 312} 72`}
          fill="none"
          stroke={accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={pool * 0.85}
        />
      ))}
      <text x={654} y={126} fill={accent} fontFamily={FONT_STACK} fontSize={27} opacity={pool}>
        y aquí se queda
      </text>

      {/* etiqueta del mecanismo */}
      <text
        x={630}
        y={300}
        fill={DIM}
        fontFamily={FONT_STACK}
        fontSize={23}
        letterSpacing={6}
        opacity={interpolate(rise, [0.2, 0.6], [0, 1], CLAMP)}
      >
        CONVECCIÓN
      </text>

      {/* mesa */}
      <rect x={296} y={520} width={368} height={15} rx={4} fill={WOOD} />
      <rect x={296} y={520} width={368} height={4} rx={2} fill={WOOD_HI} />

      {/* vela */}
      <ellipse cx={480} cy={455} rx={130} ry={92} fill="url(#swFlameL)" />
      <rect x={458} y={430} width={44} height={90} rx={5} fill={CREAM} />
      <rect x={458} y={430} width={44} height={7} rx={3} fill="#CFC1A0" />
      <line x1={480} y1={432} x2={480} y2={416} stroke="#3B322A" strokeWidth={3} />
      <path
        d={`M 480 ${flameTip} C 496 ${flameTip + 20}, 500 ${flameTip + 32}, 480 ${flameTip + 40} C 460 ${flameTip + 32}, 464 ${flameTip + 20}, 480 ${flameTip} Z`}
        fill="#F0A93C"
      />
      <path
        d={`M 480 ${flameTip + 14} C 488 ${flameTip + 24}, 489 ${flameTip + 31}, 480 ${flameTip + 38} C 471 ${flameTip + 31}, 472 ${flameTip + 24}, 480 ${flameTip + 14} Z`}
        fill="#FFE9B4"
      />
    </svg>
  );
};

// ── Silueta de persona sentada, de perfil, mirando hacia la maceta (izquierda) ──
const SeatedFigure: React.FC<{ fill: string; stroke?: string; opacity?: number }> = ({
  fill,
  stroke,
  opacity = 1,
}) => (
  <g fill={fill} stroke={stroke ?? "none"} strokeWidth={stroke ? 2 : 0} opacity={opacity}>
    {/* respaldo y asiento */}
    <rect x={800} y={318} width={16} height={168} rx={6} />
    <rect x={734} y={470} width={82} height={16} rx={6} />
    <rect x={742} y={486} width={12} height={74} rx={5} />
    <rect x={798} y={486} width={12} height={74} rx={5} />
    {/* cabeza */}
    <circle cx={744} cy={296} r={33} />
    {/* torso */}
    <path d="M 726 328 L 772 324 L 788 462 L 722 466 Z" />
    {/* muslo hacia la maceta */}
    <rect x={668} y={442} width={122} height={38} rx={19} />
    {/* pantorrilla y pie */}
    <rect x={662} y={462} width={36} height={96} rx={15} />
    <rect x={640} y={544} width={70} height={17} rx={8} />
    {/* brazo apoyado */}
    <path d="M 732 348 L 690 428" stroke={fill} strokeWidth={23} strokeLinecap="round" />
  </g>
);

// ── Mitad derecha: la misma vela bajo la maceta. Radiación al pecho ──
const CandlePot: React.FC<{ frame: number; fps: number; accent: string; rise: number }> = ({
  frame,
  fps,
  accent,
  rise,
}) => {
  const t = frame / fps;
  const flameTip = 404 + Math.sin(t * 5.2) * 3;
  const hot = interpolate(rise, [0.15, 0.8], [0, 1], CLAMP);
  const rays = [0, 1, 2, 3, 4];
  const POT = "292,270 368,270 412,408 248,408";

  return (
    <svg width="100%" height="100%" viewBox="0 0 960 590" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="swClay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TERRA} />
          <stop offset="100%" stopColor={TERRA_DK} />
        </linearGradient>
        <linearGradient id="swHot" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity={0.85} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="swWarm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity={0.75} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="swHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* techo / viga: acá NO se acumula nada */}
      <rect x={110} y={16} width={740} height={22} rx={4} fill={WOOD} />
      <rect x={110} y={16} width={740} height={5} rx={2} fill={WOOD_HI} />
      <text
        x={230}
        y={80}
        fill={FAINT}
        fontFamily={FONT_STACK}
        fontSize={24}
        opacity={interpolate(rise, [0.5, 0.9], [0, 1], CLAMP)}
      >
        nada se va arriba
      </text>

      {/* mesa */}
      <rect x={186} y={520} width={300} height={15} rx={4} fill={WOOD} />
      <rect x={186} y={520} width={300} height={4} rx={2} fill={WOOD_HI} />

      {/* halo de la maceta caliente */}
      <ellipse cx={330} cy={356} rx={196} ry={158} fill="url(#swHalo)" opacity={hot} />

      {/* la MISMA vela, ahora debajo del barro */}
      <rect x={310} y={452} width={40} height={68} rx={5} fill={CREAM} />
      <rect x={310} y={452} width={40} height={6} rx={3} fill="#CFC1A0" />
      <path
        d={`M 330 ${flameTip} C 345 ${flameTip + 19}, 348 ${flameTip + 30}, 330 ${flameTip + 38} C 312 ${flameTip + 30}, 315 ${flameTip + 19}, 330 ${flameTip} Z`}
        fill="#F0A93C"
      />
      <path
        d={`M 330 ${flameTip + 13} C 338 ${flameTip + 23}, 339 ${flameTip + 30}, 330 ${flameTip + 36} C 321 ${flameTip + 30}, 322 ${flameTip + 23}, 330 ${flameTip + 13} Z`}
        fill="#FFE9B4"
      />

      {/* ladrillos que sostienen la maceta */}
      <rect x={248} y={408} width={44} height={112} rx={3} fill="#57493C" />
      <rect x={368} y={408} width={44} height={112} rx={3} fill="#57493C" />

      {/* maceta de barro invertida */}
      <polygon points={POT} fill="url(#swClay)" />
      <rect x={284} y={244} width={92} height={28} rx={7} fill={TERRA} />
      <rect x={284} y={244} width={92} height={6} rx={3} fill="#C97A55" />
      {/* el barro se carga de calor */}
      <polygon points={POT} fill="url(#swHot)" opacity={hot * 0.75} />
      <ellipse cx={330} cy={248} rx={30} ry={10} fill={accent} opacity={hot * 0.7} />

      {/* etiqueta del mecanismo */}
      <text
        x={166}
        y={202}
        fill={DIM}
        fontFamily={FONT_STACK}
        fontSize={23}
        letterSpacing={6}
        opacity={interpolate(rise, [0.2, 0.6], [0, 1], CLAMP)}
      >
        RADIACIÓN
      </text>

      {/* rayos rectos hacia el pecho */}
      {rays.map((i) => {
        const y = 320 + i * 38;
        const p = interpolate(rise, [0.18 + i * 0.07, 0.62 + i * 0.07], [0, 1], CLAMP);
        if (p <= 0.02) return null;
        const x0 = 420 + Math.abs(i - 2) * 6;
        const x1 = x0 + p * ((i <= 2 ? 702 : 654) - x0);
        return (
          <g key={i} opacity={0.55 + 0.35 * (1 - Math.abs(i - 2) / 3)}>
            <line
              x1={x0}
              y1={y}
              x2={x1}
              y2={y}
              stroke={accent}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="30 18"
              strokeDashoffset={-((frame * 2.4) % 48)}
            />
            <path
              d={`M ${x1 - 16} ${y - 11} L ${x1} ${y} L ${x1 - 16} ${y + 11}`}
              fill="none"
              stroke={accent}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={p}
            />
          </g>
        );
      })}

      {/* persona sentada + la luz cálida que le llega */}
      <SeatedFigure fill="#2C231C" stroke="rgba(239,231,211,0.22)" />
      <SeatedFigure fill="url(#swWarm)" opacity={hot * 0.9} />

      <text
        x={700}
        y={200}
        fill={accent}
        fontFamily={FONT_STACK}
        fontSize={27}
        opacity={interpolate(rise, [0.6, 1], [0, 1], CLAMP)}
      >
        aquí lo sientes
      </text>
    </svg>
  );
};

// ── Contador de watts: idéntico en las dos mitades ──
const WattsBadge: React.FC<{ value: number; accent: string; appear: number }> = ({
  value,
  accent,
  appear,
}) => (
  <div
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px 46px 12px",
      borderRadius: 20,
      border: `2px solid ${accent}55`,
      background: "rgba(240,169,60,0.08)",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 16}px)`,
    }}
  >
    <div style={{ color: DIM, fontSize: 21, letterSpacing: 5 }}>LA MISMA VELA</div>
    <div
      style={{
        color: accent,
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1.05,
        fontVariantNumeric: "lining-nums",
      }}
    >
      {value} W
    </div>
    <div style={{ color: DIM, fontSize: 22 }}>de calor</div>
  </div>
);

export const SameWattsV4dt: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  watts?: number;
  accent?: string;
}> = ({
  durationInFrames,
  eyebrow = "La misma energía",
  title = "Lo único que cambia es a dónde va",
  watts = 80,
  accent = "#E0912F",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // el guion está pensado para ~6 s; si la toma dura menos, todo se comprime.
  const k = Math.min(1, durationInFrames / (6 * fps));
  const s = (v: number) => Math.round(v * fps * k);

  const inO = interpolate(frame, [0, 8], [0, 1], CLAMP);
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], CLAMP);

  const head = interpolate(frame, [s(0.05), s(0.6)], [0, 1], CLAMP);

  // las mitades entran ESCALONADAS: primero el problema, después la solución.
  const inL = spring({ frame: frame - s(0.25), fps, config: SPRING_SOFT });
  const inR = spring({ frame: frame - s(1.15), fps, config: SPRING_SOFT });
  const riseL = interpolate(frame, [s(0.35), s(2.1)], [0, 1], CLAMP);
  const riseR = interpolate(frame, [s(1.25), s(3.1)], [0, 1], CLAMP);
  const eq = spring({ frame: frame - s(3.3), fps, config: SPRING_SOFT });

  const wattsL = Math.round(watts * interpolate(frame, [s(0.3), s(0.8)], [0, 1], CLAMP));
  const wattsR = Math.round(watts * interpolate(frame, [s(1.3), s(1.8)], [0, 1], CLAMP));

  const half: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    overflow: "hidden",
  };

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, opacity: inO * outO }}>
      {/* fondo pizarra cálida */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 42%, ${SLATE1} 0%, ${SLATE0} 72%)`,
        }}
      />

      {/* ─────────── IZQUIERDA: vela sola ─────────── */}
      <div
        style={{
          ...half,
          left: 0,
          opacity: inL,
          transform: `translateX(${(1 - inL) * -70}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 176,
            left: 0,
            right: 0,
            textAlign: "center",
            color: CREAM,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 7,
          }}
        >
          SIN MACETA
        </div>
        <div style={{ position: "absolute", top: 234, left: 0, right: 0, height: 590 }}>
          <CandleAlone frame={frame} fps={fps} accent={accent} rise={riseL} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 842,
            left: 120,
            width: 720,
            textAlign: "center",
            color: DIM,
            fontSize: 31,
            lineHeight: 1.25,
          }}
        >
          El calor sube derecho al techo.
        </div>
        <div
          style={{
            position: "absolute",
            top: 906,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WattsBadge value={wattsL} accent={accent} appear={inL} />
        </div>
      </div>

      {/* ─────────── DERECHA: vela con maceta ─────────── */}
      <div
        style={{
          ...half,
          right: 0,
          opacity: inR,
          transform: `translateX(${(1 - inR) * 70}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 176,
            left: 0,
            right: 0,
            textAlign: "center",
            color: CREAM,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 7,
          }}
        >
          CON MACETA
        </div>
        <div style={{ position: "absolute", top: 234, left: 0, right: 0, height: 590 }}>
          <CandlePot frame={frame} fps={fps} accent={accent} rise={riseR} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 842,
            left: 120,
            width: 720,
            textAlign: "center",
            color: DIM,
            fontSize: 31,
            lineHeight: 1.25,
          }}
        >
          El barro lo devuelve a la altura de tu pecho.
        </div>
        <div
          style={{
            position: "absolute",
            top: 906,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WattsBadge value={wattsR} accent={accent} appear={inR} />
        </div>
      </div>

      {/* divisor */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 168,
          bottom: 54,
          width: 2,
          transform: "translateX(-50%)",
          background: `linear-gradient(${FAINT}, ${accent}66, ${FAINT})`,
          opacity: Math.min(inL, inR),
        }}
      />

      {/* el "=" que prueba que la energía no cambió */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 975,
          transform: `translate(-50%,-50%) scale(${0.6 + eq * 0.4})`,
          width: 74,
          height: 74,
          borderRadius: "50%",
          background: SLATE0,
          border: `2px solid ${accent}`,
          color: accent,
          fontSize: 46,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: eq,
        }}
      >
        =
      </div>

      {/* encabezado */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: head,
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: 25,
            letterSpacing: 9,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            color: CREAM,
            fontSize: 62,
            fontWeight: 700,
            marginTop: 8,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
