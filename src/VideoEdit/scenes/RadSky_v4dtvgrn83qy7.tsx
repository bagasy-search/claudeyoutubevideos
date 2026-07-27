import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { FONT_STACK } from "../theme";

// RadSkyV4dt — variante ES-MX de ColdRadiationSky, adaptada al calefactor de macetas.
// Idea: el AIRE del cuarto sigue frío (termómetro clavado en 12°) y aun así el calor
// TE PEGA EN LA PIEL, como el sol en un día de invierno. El aire caliente se escapa
// al techo (columnas que suben), pero la RADIACIÓN sale de lado y te alcanza.
// Paleta terrosa: ocre, terracota, barro, negro pizarra.
const MOTES = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: (i * 53.3) % 56,
  r: ((i * 7) % 3) * 0.6 + 0.7,
  ph: (i % 7) / 7,
}));
const OCRE = "#E8B36A";
const TERRA = "#C2622F";
const BARRO = "#A9794A";

export const RadSkyV4dt: React.FC<{ durationInFrames: number; airTemp?: string }> = ({
  durationInFrames,
  airTemp = "12°",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1

  const inO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // la radiación lateral aparece en el último ~40%
  const radiate = interpolate(t, [0.55, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const potCx = width * 0.56;
  const potCy = height * 0.78;
  const potRx = 240;
  const potRy = 56;

  // 7 columnas de aire caliente que suben hacia el techo
  const cols = Array.from({ length: 7 }, (_, i) => potCx - 180 + i * 60);

  return (
    <AbsoluteFill style={{ opacity: inO * outO }}>
      {/* cuarto en penumbra, tonos tierra */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, #14100C 0%, #1E1710 38%, #2C2116 66%, #3A2B1B 100%)",
        }}
      />
      {/* polvo suspendido en el aire */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {MOTES.map((s, i) => {
          const tw = 0.55 + 0.45 * Math.sin((frame / fps) * 1.6 + s.ph * 6.28);
          return (
            <circle
              key={i}
              cx={(s.x / 100) * width}
              cy={(s.y / 100) * height}
              r={s.r}
              fill="#F4E6CF"
              opacity={tw * 0.55}
            />
          );
        })}

        {/* el aire caliente se escapa hacia el techo */}
        {cols.map((cx, i) => {
          const seg = 9;
          const pts = [];
          for (let k = 0; k <= seg; k++) {
            const yy = potCy - (k / seg) * (potCy - height * 0.1);
            const wobble = Math.sin((frame / fps) * 2.2 + k * 0.7 + i) * (6 + k * 1.4);
            pts.push(`${cx + wobble},${yy}`);
          }
          return (
            <polyline
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke={OCRE}
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={interpolate(t, [0, 0.5, 1], [0.0, 0.55, 0.3])}
            />
          );
        })}
        {/* puntas de flecha hacia el techo */}
        {cols.map((cx, i) => {
          const yTip = height * 0.12 + Math.sin((frame / fps) * 2 + i) * 4;
          const a = interpolate(t, [0.1, 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <path
              key={i}
              d={`M ${cx - 7} ${yTip + 12} L ${cx} ${yTip} L ${cx + 7} ${yTip + 12}`}
              fill="none"
              stroke={OCRE}
              strokeWidth={2.4}
              strokeLinecap="round"
              opacity={a * 0.8}
            />
          );
        })}

        {/* radiación lateral: ondas que salen del barro hacia el que mira */}
        {radiate > 0.02 &&
          Array.from({ length: 4 }).map((_, i) => {
            const ph = ((frame / fps) * 0.7 + i * 0.25) % 1;
            const rr = interpolate(ph, [0, 1], [potRx * 0.5, potRx * 2.6]);
            const op = interpolate(ph, [0, 0.15, 0.8, 1], [0, 1, 0.7, 0]) * radiate;
            return (
              <ellipse
                key={i}
                cx={potCx}
                cy={potCy - 60}
                rx={rr}
                ry={rr * 0.42}
                fill="none"
                stroke={TERRA}
                strokeWidth={5}
                opacity={op * 0.75}
              />
            );
          })}

        {/* base de la maceta */}
        <ellipse cx={potCx} cy={potCy} rx={potRx} ry={potRy} fill="#241A11" stroke={BARRO} strokeWidth={6} />
        {/* barro caliente */}
        <ellipse
          cx={potCx}
          cy={potCy}
          rx={potRx - 10}
          ry={potRy - 8}
          fill={radiate > 0.5 ? "#D2743A" : "#7A4B2A"}
          opacity={0.94}
        />
        {/* cúpula de la maceta invertida */}
        <path
          d={`M ${potCx - potRx + 26} ${potCy} L ${potCx - 96} ${potCy - 170} L ${potCx + 96} ${potCy - 170} L ${potCx + potRx - 26} ${potCy} Z`}
          fill="#8A5330"
          stroke={BARRO}
          strokeWidth={5}
          opacity={0.95}
        />
        {/* brillo del barro cargado */}
        {radiate > 0.15 &&
          Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={potCx - 70 + i * 35}
              y1={potCy - 20}
              x2={potCx - 70 + i * 35}
              y2={potCy - 150}
              stroke="#FFD79A"
              strokeWidth={2}
              opacity={radiate * 0.45}
            />
          ))}
      </svg>

      {/* termómetro clavado en 12° */}
      <div
        style={{
          position: "absolute",
          left: width * 0.14,
          top: height * 0.3,
          textAlign: "center",
          fontFamily: FONT_STACK,
        }}
      >
        <div
          style={{
            width: 26,
            height: 200,
            borderRadius: 14,
            background: "rgba(255,255,255,0.1)",
            border: "3px solid rgba(244,230,207,0.85)",
            position: "relative",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 12,
              height: 62,
              borderRadius: 8,
              background: TERRA,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: TERRA,
              border: "3px solid rgba(244,230,207,0.85)",
            }}
          />
        </div>
        <div
          style={{
            color: "#F4E6CF",
            fontSize: 40,
            fontWeight: 700,
            marginTop: 22,
            textShadow: "0 2px 8px #000",
          }}
        >
          Aire {airTemp}
        </div>
        <div style={{ color: "#C9B79A", fontSize: 24 }}>el cuarto sigue frío</div>
      </div>

      {/* etiquetas */}
      <div
        style={{
          position: "absolute",
          left: potCx + 60,
          top: height * 0.3,
          fontFamily: FONT_STACK,
          color: OCRE,
          fontSize: 30,
          fontWeight: 700,
          opacity: interpolate(t, [0.1, 0.35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          textShadow: "0 2px 8px #000",
        }}
      >
        El calor se va al techo ↑
      </div>
      <div
        style={{
          position: "absolute",
          left: potCx - 220,
          top: potCy + 72,
          width: 560,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: TERRA,
          fontSize: 38,
          fontWeight: 800,
          opacity: radiate,
          textShadow: "0 2px 10px #000",
          letterSpacing: 1,
        }}
      >
        La radiación te llega igual
      </div>
    </AbsoluteFill>
  );
};
