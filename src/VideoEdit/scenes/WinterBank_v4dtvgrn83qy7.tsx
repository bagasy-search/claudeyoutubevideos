import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { FONT_STACK } from "../theme";

// WinterBankV4dt — variante ES-MX de WinterBank, adaptada al calefactor de macetas.
// Ya NO es hielo ni enero: es la MASA. El barro es una alcancía de calor — lo cargas
// con la llama (brasas que caen a la bóveda, el nivel sube) y te lo devuelve de noche
// (flecha → luna). Paleta terrosa: ocre, terracota, madera, negro pizarra.
const OCRE = "#E8B36A";
const TERRA = "#C2622F";
const MADERA = "#8A5330";

const brasas = Array.from({ length: 26 }, (_, i) => ({
  x: 0.3 + (((i * 53) % 100) / 100) * 0.16, // caen sobre la bóveda (~0.30-0.46)
  delay: (i % 13) / 13,
  drift: ((i * 31) % 20) - 10,
  r: ((i * 7) % 3) + 3,
}));

export const WinterBankV4dt: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vaultSpr = spring({ frame: frame - 6, fps, config: { damping: 15 }, durationInFrames: 16 });
  const fill = interpolate(t, [0.2, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const arrow = interpolate(t, [0.62, 0.82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vx = width * 0.38,
    vy = height * 0.46,
    vw = 280,
    vh = 240;

  const moonCx = vx + vw + 270;
  const moonCy = vy + vh / 2;

  return (
    <AbsoluteFill
      style={{
        opacity: inO * outO,
        background: "linear-gradient(to bottom, #17110B 0%, #241A11 60%, #33251A 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 90,
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
          Lo que de verdad calienta
        </div>
        <div style={{ color: "#F4E6CF", fontSize: 52, fontWeight: 800, marginTop: 2 }}>
          El barro no da calor: lo guarda y te lo regresa
        </div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* brasas cayendo a la alcancía */}
        {brasas.map((f, i) => {
          const p = (t * 1.6 + f.delay) % 1;
          const fy = interpolate(p, [0, 1], [height * 0.28, vy]);
          const fo = interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);
          return (
            <circle
              key={i}
              cx={f.x * width + f.drift}
              cy={fy}
              r={f.r}
              fill={i % 3 === 0 ? "#FFD79A" : OCRE}
              opacity={fo * 0.95}
            />
          );
        })}

        {/* la masa = el ladrillo/alcancía de calor */}
        <g
          style={{
            opacity: vaultSpr,
            transform: `scale(${interpolate(vaultSpr, [0, 1], [0.85, 1])})`,
            transformOrigin: `${vx + vw / 2}px ${vy + vh / 2}px`,
          }}
        >
          <rect x={vx} y={vy} width={vw} height={vh} rx={16} fill="#2B1F14" stroke={OCRE} strokeWidth={5} />
          {/* calor acumulado adentro */}
          <rect
            x={vx + 14}
            y={vy + vh - 14 - (vh - 40) * fill}
            width={vw - 28}
            height={(vh - 40) * fill}
            rx={6}
            fill={TERRA}
            opacity={0.88}
          />
          {/* juntas del ladrillo */}
          {[0.33, 0.66].map((k) => (
            <line
              key={k}
              x1={vx + 14}
              y1={vy + vh * k}
              x2={vx + vw - 14}
              y2={vy + vh * k}
              stroke={MADERA}
              strokeWidth={2}
              opacity={0.5}
            />
          ))}
          <circle cx={vx + vw / 2} cy={vy + vh / 2} r={42} fill="none" stroke={OCRE} strokeWidth={5} opacity={0.6} />
          <circle cx={vx + vw / 2} cy={vy + vh / 2} r={8} fill={OCRE} opacity={0.7} />
          <text
            x={vx + vw / 2}
            y={vy + vh + 44}
            textAnchor="middle"
            fontFamily={FONT_STACK}
            fontSize={30}
            fontWeight={800}
            fill={OCRE}
          >
            LA MASA GUARDA
          </text>
        </g>

        {/* flecha → noche */}
        <g style={{ opacity: arrow }}>
          <line
            x1={vx + vw + 30}
            y1={vy + vh / 2}
            x2={vx + vw + 200}
            y2={vy + vh / 2}
            stroke={OCRE}
            strokeWidth={4}
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
          <path
            d={`M ${vx + vw + 192} ${vy + vh / 2 - 9} L ${vx + vw + 208} ${vy + vh / 2} L ${vx + vw + 192} ${vy + vh / 2 + 9}`}
            fill="none"
            stroke={OCRE}
            strokeWidth={4}
            strokeLinecap="round"
          />
          {/* luna */}
          <circle cx={moonCx} cy={moonCy} r={34} fill="#E8C98D" />
          <circle cx={moonCx + 14} cy={moonCy - 8} r={28} fill="#33251A" />
          {/* ondas de calor que salen del ladrillo hacia la noche */}
          {[0, 1, 2].map((i) => {
            const ph = (frame / 16 + i * 0.7) % 1;
            return (
              <path
                key={i}
                d={`M ${vx + vw + 60 + i * 30} ${vy + vh / 2 + 70} q 16 24 0 48`}
                fill="none"
                stroke={TERRA}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={(0.35 + 0.4 * Math.sin(ph * Math.PI * 2)) * arrow}
              />
            );
          })}
          <text
            x={moonCx}
            y={moonCy + 90}
            textAnchor="middle"
            fontFamily={FONT_STACK}
            fontSize={28}
            fontWeight={800}
            fill="#F4E6CF"
          >
            te lo devuelve de noche
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
