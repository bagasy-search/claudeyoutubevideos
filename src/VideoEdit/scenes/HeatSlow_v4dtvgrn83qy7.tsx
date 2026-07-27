import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FONT_STACK } from "../theme";

// HeatSlowV4dt — variante ES-MX de HeatSlowDiagram, adaptada al calefactor de macetas.
// Ya no se trata de derretirse: el BARRO se carga despacio (primera mitad, flechas que
// entran) y suelta despacio (segunda mitad, flechas que salen) — sigue calentando 30 a
// 45 minutos después de apagar la vela. Paleta terrosa: ocre, terracota, barro.
const OCRE = "#E8B36A";
const TERRA = "#C2622F";
const BARRO = "#A9794A";

export const HeatSlowV4dt: React.FC<{ durationInFrames: number; title?: string }> = ({
  durationInFrames,
  title = "Tarda en calentar y tarda en enfriarse",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames;

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = width / 2,
    cy = height * 0.56;
  const barroR = 110,
    capaR = 200;
  const ringIn = spring({ frame: frame - 14, fps, config: { damping: 15 }, durationInFrames: 18 });
  const labO = interpolate(t, [0.5, 0.68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // primera mitad: se CARGA (flechas hacia adentro). segunda: SUELTA (hacia afuera).
  const suelta = t > 0.52;
  // qué tan cargado está el barro (color del centro)
  const carga = interpolate(t, [0.05, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flechas = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        opacity: inO * outO,
        background: "linear-gradient(160deg, #201A14 0%, #2A2318 60%, #2F2719 100%)",
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
          Todo el secreto
        </div>
        <div style={{ color: "#F4E6CF", fontSize: 52, fontWeight: 800, marginTop: 2 }}>{title}</div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {flechas.map((a, i) => {
          const prog = (t * 1.4 + (i % 6) / 6) % 1;
          const rFar = capaR + 230;
          const rNear = capaR + 18;
          // cargando: de afuera hacia adentro. soltando: de adentro hacia afuera.
          const r = suelta
            ? interpolate(prog, [0, 1], [rNear, rFar])
            : interpolate(prog, [0, 1], [rFar, rNear]);
          const op = interpolate(prog, [0, 0.15, 0.8, 1], [0, 1, 1, 0]) * 0.85;
          const dir = suelta ? 1 : -1; // hacia dónde apunta la punta
          const x = cx + Math.cos(a) * r,
            y = cy + Math.sin(a) * r;
          const x2 = cx + Math.cos(a) * (r + dir * 26),
            y2 = cy + Math.sin(a) * (r + dir * 26);
          const color = suelta ? TERRA : OCRE;
          const ang = suelta ? a : a + Math.PI;
          return (
            <g key={i} opacity={op}>
              <line x1={x} y1={y} x2={x2} y2={y2} stroke={color} strokeWidth={4} strokeLinecap="round" />
              <path
                d={`M ${x2} ${y2} l ${Math.cos(ang + 2.5) * 12} ${Math.sin(ang + 2.5) * 12} M ${x2} ${y2} l ${Math.cos(ang - 2.5) * 12} ${Math.sin(ang - 2.5) * 12}`}
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        })}
        {/* capa exterior: la maceta grande + el aire atrapado */}
        <circle
          cx={cx}
          cy={cy}
          r={capaR * ringIn}
          fill="none"
          stroke={BARRO}
          strokeWidth={36}
          opacity={0.5}
          strokeDasharray="3 9"
        />
        {/* el barro, que se va poniendo caliente */}
        <circle
          cx={cx}
          cy={cy}
          r={barroR * ringIn}
          fill={carga > 0.55 ? "#C2622F" : "#7A4B2A"}
          stroke={OCRE}
          strokeWidth={4}
        />
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontSize={30}
          fontWeight={800}
          fill="#F4E6CF"
          opacity={ringIn}
        >
          BARRO
        </text>
      </svg>

      <div
        style={{
          position: "absolute",
          left: width * 0.06,
          top: cy - 30,
          fontFamily: FONT_STACK,
          color: OCRE,
          fontSize: 30,
          fontWeight: 700,
          opacity: labO,
          maxWidth: 280,
          textShadow: "0 2px 8px #000",
        }}
      >
        Se carga despacio: 20 minutos de llama
      </div>
      <div
        style={{
          position: "absolute",
          right: width * 0.06,
          top: cy - 30,
          fontFamily: FONT_STACK,
          color: TERRA,
          fontSize: 30,
          fontWeight: 700,
          opacity: labO,
          maxWidth: 280,
          textAlign: "right",
          textShadow: "0 2px 8px #000",
        }}
      >
        Y suelta 30 a 45 minutos después de apagar la vela
      </div>
    </AbsoluteFill>
  );
};
