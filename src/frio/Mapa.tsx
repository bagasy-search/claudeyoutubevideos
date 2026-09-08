// MAPA DE DISTANCIA — pieza firma de "Archivos del Frío".
// Se dibuja en código (SVG) y no se hornea con un motor de imagen: así el texto es REAL,
// la ruta se dibuja sola y el papel envejece con la escala del video.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { FRIO } from "./Piezas";

const ease = Easing.bezier(0.33, 0, 0.15, 1);

export const MapaDistancia: React.FC<{
  origen: string;
  destino: string;
  cifra: string;
  unidad: string;
  pie?: string;
  dur: number;
}> = ({ origen, destino, cifra, unidad, pie, dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const ruta = interpolate(f, [14, Math.max(30, dur * 0.62)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const cif = interpolate(f, [Math.max(24, dur * 0.42), Math.max(40, dur * 0.66)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const pO = interpolate(f, [12, 26], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const pD = interpolate(f, [Math.max(30, dur * 0.6), Math.max(44, dur * 0.78)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* papel de expediente: crema envejecido, con manchas y fibra */}
      <AbsoluteFill
        style={{
          margin: 54,
          borderRadius: 3,
          background: "radial-gradient(120% 130% at 22% 8%, #E7DCC0 0%, #DCCFAE 42%, #C9BB98 100%)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.62), inset 0 0 140px rgba(120,92,44,0.30)",
          opacity: inn,
          transform: `scale(${0.985 + 0.015 * inn}) rotate(-0.35deg)`,
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1812 972" preserveAspectRatio="xMidYMid slice">
          {/* curvas de nivel de la meseta, muy tenues */}
          <g stroke="#8E7746" fill="none" opacity={0.22}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M ${-40 + i * 22} ${700 - i * 46} C ${420} ${610 - i * 52}, ${900} ${790 - i * 40}, ${1860} ${640 - i * 48}`}
                strokeWidth={1.4}
              />
            ))}
          </g>
          {/* el río, en trazo más grueso */}
          <path d="M 120 900 C 500 820, 760 930, 1180 800 C 1460 712, 1600 760, 1840 700" stroke="#7E8E8C" strokeWidth={4} fill="none" opacity={0.4} />

          {/* la ruta entre los dos puntos, punteada, que se DIBUJA */}
          <path
            d="M 430 640 C 700 560, 980 520, 1330 386"
            stroke={FRIO.amber}
            strokeWidth={5}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ruta}
            strokeLinecap="round"
            opacity={0.95}
          />

          {/* punto de ORIGEN */}
          <g opacity={pO}>
            <circle cx={430} cy={640} r={13} fill="#2C2318" />
            <circle cx={430} cy={640} r={26} fill="none" stroke="#2C2318" strokeWidth={2} opacity={0.5} />
            <text x={430} y={716} textAnchor="middle" fill="#2C2318" fontFamily={FRIO.serif} fontSize={34} letterSpacing={1}>
              {origen}
            </text>
          </g>

          {/* punto de DESTINO */}
          <g opacity={pD}>
            <circle cx={1330} cy={386} r={13} fill="#2C2318" />
            <rect x={1300} y={356} width={60} height={60} fill="none" stroke="#2C2318" strokeWidth={2} opacity={0.55} />
            <text x={1366} y={366} fill="#2C2318" fontFamily={FRIO.serif} fontSize={38} letterSpacing={1}>
              {destino}
            </text>
          </g>

          {/* la cifra, sobre la ruta */}
          <g opacity={cif} transform={`translate(0, ${(1 - cif) * 14})`}>
            <text x={880} y={470} textAnchor="middle" fill="#2C2318" fontFamily={FRIO.serif} fontSize={132} letterSpacing={-2}>
              {cifra}
              <tspan fontSize={62} dx={12} fill="#6B5B36">
                {unidad}
              </tspan>
            </text>
            <line x1={640} y1={506} x2={1120} y2={506} stroke={FRIO.amber} strokeWidth={3} opacity={0.85} />
            {pie ? (
              <text x={880} y={556} textAnchor="middle" fill="#6B5B36" fontFamily={FRIO.serif} fontSize={30} letterSpacing={8}>
                {pie.toUpperCase()}
              </text>
            ) : null}
          </g>
        </svg>

        {/* manchas y fibra del papel */}
        <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.30, mixBlendMode: "multiply" }}>
          <svg width="100%" height="100%">
            <filter id="pap">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={3} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#pap)" />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* la hoja se apoya sobre negro, con sombra: es un documento, no una diapositiva */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(130% 110% at 50% 48%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
