import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONT_STACK } from "../theme";

// ColdCalV4dt — variante ES-MX de ColdCalendar, adaptada al calefactor de macetas.
// Tira de los 12 meses; un playhead barre el año y marca cuándo hay que tenerlo
// ARMADO: antes de la primera helada (octubre). Los meses fríos se prenden en
// terracota. Cierra con "6 MESES DE FRÍO". Paleta terrosa: ocre, barro, madera.
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
// índices de los meses fríos (oct-mar)
const FRIOS = [0, 1, 2, 9, 10, 11];
const HELADA = 9; // OCT — primera helada
const OCRE = "#E8B36A";
const TERRA = "#C2622F";

export const ColdCalV4dt: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trackW = 1180;
  const cellW = trackW / MESES.length;
  const x0 = (width - trackW) / 2;
  const trackY = 470;

  // playhead 0..1 sobre el primer 75% del beat
  const sweep = interpolate(t, [0.08, 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const headX = x0 + sweep * trackW;
  const potGrow = interpolate(sweep, [0, 1], [0.86, 1.06]);

  const bigIn = spring({
    frame: frame - Math.round(durationInFrames * 0.72),
    fps,
    config: { damping: 14, mass: 0.8 },
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: inO * outO,
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #17110B 0%, #241A11 60%, #332517 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 250,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_STACK,
        }}
      >
        <div
          style={{
            color: OCRE,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Antes de la primera helada
        </div>
        <div style={{ color: "#F4E6CF", fontSize: 58, fontWeight: 800, marginTop: 4 }}>
          Ármalo en octubre, no en enero
        </div>
      </div>

      <svg width={width} height={300} style={{ position: "absolute", top: trackY - 70 }}>
        {/* celdas de meses */}
        {MESES.map((m, i) => {
          const frio = FRIOS.includes(i);
          const passed = headX >= x0 + i * cellW + cellW * 0.5;
          return (
            <g key={i}>
              <rect
                x={x0 + i * cellW + 4}
                y={70}
                width={cellW - 8}
                height={70}
                rx={12}
                fill={
                  frio
                    ? `rgba(194,98,47,${passed ? 0.34 : 0.14})`
                    : `rgba(169,121,74,${passed ? 0.18 : 0.07})`
                }
                stroke={passed && frio ? TERRA : "rgba(169,121,74,0.35)"}
                strokeWidth={passed && frio ? 2.8 : 1.5}
              />
              <text
                x={x0 + i * cellW + cellW / 2}
                y={114}
                textAnchor="middle"
                fontFamily={FONT_STACK}
                fontSize={27}
                fontWeight={700}
                fill={passed ? "#F4E6CF" : "rgba(212,196,166,0.45)"}
              >
                {m}
              </text>
            </g>
          );
        })}

        {/* marca de la primera helada */}
        <g opacity={0.9}>
          <line
            x1={x0 + HELADA * cellW + 4}
            y1={54}
            x2={x0 + HELADA * cellW + 4}
            y2={158}
            stroke={COLORS.danger}
            strokeWidth={3}
            strokeDasharray="6 6"
          />
          <text
            x={x0 + HELADA * cellW + 12}
            y={44}
            fontFamily={FONT_STACK}
            fontSize={24}
            fontWeight={800}
            fill={COLORS.danger}
          >
            primera helada
          </text>
        </g>

        {/* la maceta que se va cargando de calor mientras avanza el año */}
        <g transform={`translate(${headX}, ${105})`}>
          <path
            d={`M ${-30 * potGrow} ${-34} L ${-19 * potGrow} ${-78} L ${19 * potGrow} ${-78} L ${30 * potGrow} ${-34} Z`}
            fill="#8A5330"
            stroke={OCRE}
            strokeWidth={3}
            transform="translate(0,-14)"
          />
          <line
            x1={-16 * potGrow}
            y1={-96}
            x2={-16 * potGrow}
            y2={-118}
            stroke={TERRA}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.85}
          />
          <line
            x1={14 * potGrow}
            y1={-96}
            x2={14 * potGrow}
            y2={-124}
            stroke={TERRA}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.7}
          />
          {/* playhead */}
          <line x1={0} y1={-78} x2={0} y2={48} stroke={COLORS.danger} strokeWidth={3} />
          <circle cx={0} cy={-82} r={6} fill={COLORS.danger} />
        </g>
      </svg>

      {/* cierre: 6 MESES DE FRÍO */}
      <div
        style={{
          position: "absolute",
          top: trackY + 120,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_STACK,
          transform: `scale(${interpolate(bigIn, [0, 1], [0.7, 1])})`,
          opacity: bigIn,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: TERRA,
            textShadow: "0 3px 0 rgba(0,0,0,0.08)",
          }}
        >
          6
        </span>
        <span style={{ fontSize: 56, fontWeight: 800, color: "#F4E6CF", marginLeft: 14 }}>
          MESES DE FRÍO
        </span>
      </div>
    </AbsoluteFill>
  );
};
