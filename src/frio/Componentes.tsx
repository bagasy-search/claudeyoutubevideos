// KIT DE COMPONENTES — "Archivos del Frío".
// La idea rectora: los componentes NO son carteles sobre el video. Son PIEZAS DE EXPEDIENTE que
// alguien apoya sobre la mesa: papel, tinta, sellos, cinta métrica, termómetro. Por eso todos
// comparten la misma mesa oscura, la misma luz rasante y la misma tipografía serif.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";

const ease = Easing.bezier(0.33, 0, 0.15, 1);
export const TINTA = "#2C2318";
export const PAPEL0 = "#E7DCC0";
export const PAPEL1 = "#D3C4A0";
export const AMBAR = "#B8641A";
export const SERIF = "'Georgia','Times New Roman',serif";

// mesa + papel: el marco común de todo el kit
export const Hoja: React.FC<{ children: React.ReactNode; margen?: number; giro?: number; inn: number }> = ({
  children, margen = 56, giro = -0.35, inn,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
    <AbsoluteFill
      style={{
        margin: margen,
        background: `radial-gradient(120% 130% at 22% 8%, ${PAPEL0} 0%, ${PAPEL1} 55%, #C2B292 100%)`,
        boxShadow: "0 30px 90px rgba(0,0,0,0.62), inset 0 0 140px rgba(120,92,44,0.28)",
        opacity: inn,
        transform: `scale(${0.985 + 0.015 * inn}) rotate(${giro}deg)`,
        overflow: "hidden",
      }}
    >
      {children}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.26, mixBlendMode: "multiply" }}>
        <svg width="100%" height="100%">
          <filter id="fib"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={4} seed={5} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#fib)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(130% 110% at 50% 48%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)" }} />
  </AbsoluteFill>
);

// ── 1. CORTE DEL SUELO — la pieza del pivote de física. Las capas se revelan de arriba a abajo
//      y el termómetro de cada profundidad va apareciendo con ellas.
export const CorteSuelo: React.FC<{
  dur: number;
  capas: { prof: string; temp: string; nota: string; color: string }[];
  titulo?: string;
}> = ({ dur, capas, titulo = "LO QUE PASA ABAJO" }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const H = 640, Y0 = 190, W = 1120, X = 300;
  return (
    <Hoja inn={inn} giro={-0.2}>
      <svg width="100%" height="100%" viewBox="0 0 1812 972" preserveAspectRatio="xMidYMid slice">
        <text x={906} y={124} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={40} letterSpacing={10} opacity={inn}>
          {titulo}
        </text>
        {capas.map((c, i) => {
          const h = H / capas.length;
          const y = Y0 + i * h;
          const at = 18 + i * 16;
          const ap = interpolate(f, [at, at + 20], [0, 1], { extrapolateRight: "clamp", easing: ease });
          const anc = interpolate(f, [at + 6, at + 26], [0, 1], { extrapolateRight: "clamp", easing: ease });
          return (
            <g key={i} opacity={ap}>
              <rect x={X} y={y} width={W * anc} height={h - 3} fill={c.color} />
              <line x1={X} y1={y} x2={X + W * anc} y2={y} stroke={TINTA} strokeWidth={1.5} opacity={0.35} />
              {/* profundidad, a la izquierda */}
              <text x={X - 34} y={y + h / 2 + 12} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={38}>{c.prof}</text>
              {/* temperatura, adentro de la capa */}
              <text x={X + 34} y={y + h / 2 + 14} fill={i < 2 ? TINTA : "#F2ECDC"} fontFamily={SERIF} fontSize={46}>{c.temp}</text>
              {/* nota, a la derecha */}
              <text x={X + W + 34} y={y + h / 2 + 10} fill={TINTA} fontFamily={SERIF} fontSize={29} opacity={0.82}>{c.nota}</text>
            </g>
          );
        })}
        {/* la superficie, arriba de todo */}
        <line x1={X} y1={Y0} x2={X + W} y2={Y0} stroke={TINTA} strokeWidth={4} opacity={inn} />
      </svg>
    </Hoja>
  );
};

// ── 2. EL CUADERNO QUE SUMA — las cargas de carretilla día por día, con el total que se acumula.
export const CuadernoCargas: React.FC<{
  dur: number;
  filas: { dia: string; n: number; nota?: string }[];
  total: number;
  pie?: string;
}> = ({ dur, filas, total, pie = "CARGAS DE CARRETILLA" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const paso = Math.max(6, Math.floor((dur * 0.55) / Math.max(1, filas.length)));
  const vistas = filas.filter((_, i) => f >= 16 + i * paso).length;
  const acum = filas.slice(0, vistas).reduce((a, r) => a + r.n, 0);
  const tot = spring({ frame: f - Math.round(dur * 0.62), fps, config: { damping: 200, stiffness: 60 } });
  const cifra = Math.round(acum + (total - acum) * tot);
  return (
    <Hoja inn={inn} giro={0.25}>
      <svg width="100%" height="100%" viewBox="0 0 1812 972" preserveAspectRatio="xMidYMid slice">
        {/* renglones del cuaderno */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={150} y1={190 + i * 52} x2={1080} y2={190 + i * 52} stroke="#9A8A62" strokeWidth={1} opacity={0.30} />
        ))}
        <line x1={980} y1={140} x2={980} y2={900} stroke={AMBAR} strokeWidth={2} opacity={0.5} />
        {filas.map((r, i) => {
          const at = 16 + i * paso;
          const ap = interpolate(f, [at, at + 10], [0, 1], { extrapolateRight: "clamp", easing: ease });
          const y = 232 + i * 52;
          return (
            <g key={i} opacity={ap}>
              <text x={170} y={y} fill={TINTA} fontFamily={SERIF} fontSize={34}>{r.dia}</text>
              <text x={960} y={y} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={34}>{r.n}</text>
              {r.nota ? <text x={1006} y={y} fill="#7A6A44" fontFamily={SERIF} fontSize={26} fontStyle="italic">{r.nota}</text> : null}
            </g>
          );
        })}
        {/* el total, a la derecha, con su regla */}
        <g opacity={interpolate(f, [Math.round(dur * 0.55), Math.round(dur * 0.68)], [0, 1], { extrapolateRight: "clamp", easing: ease })}>
          <text x={1560} y={470} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={172} letterSpacing={-4}>{cifra}</text>
          <line x1={1330} y1={520} x2={1790} y2={520} stroke={AMBAR} strokeWidth={3} />
          <text x={1560} y={572} textAnchor="middle" fill="#6B5B36" fontFamily={SERIF} fontSize={26} letterSpacing={7}>{pie}</text>
        </g>
      </svg>
    </Hoja>
  );
};

// ── 3. LOS TRES TERMÓMETROS — afuera / el granero / la cámara. La comparación que prueba todo.
export const TresTermometros: React.FC<{
  dur: number;
  medidas: { donde: string; valor: number; unidad?: string }[];
}> = ({ dur, medidas }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const MIN = -20, MAX = 20, H = 520, Y = 250;
  const yDe = (v: number) => Y + H * (1 - (v - MIN) / (MAX - MIN));
  return (
    <Hoja inn={inn} giro={-0.15}>
      <svg width="100%" height="100%" viewBox="0 0 1812 972" preserveAspectRatio="xMidYMid slice">
        {/* la línea del cero: la referencia que hace legible todo */}
        <line x1={200} y1={yDe(0)} x2={1620} y2={yDe(0)} stroke={TINTA} strokeWidth={2} strokeDasharray="10 8" opacity={0.55} />
        <text x={172} y={yDe(0) + 10} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={30} opacity={0.7}>0°</text>
        {medidas.map((m, i) => {
          const at = 16 + i * 22;
          const g = interpolate(f, [at, at + 26], [0, 1], { extrapolateRight: "clamp", easing: ease });
          const x = 420 + i * 480;
          const y1 = yDe(0), y2 = yDe(m.valor);
          const yy = y1 + (y2 - y1) * g;
          const frio = m.valor < 0;
          return (
            <g key={i}>
              {/* tubo */}
              <rect x={x - 26} y={Y} width={52} height={H} rx={26} fill="#EFE7D2" stroke={TINTA} strokeWidth={2} opacity={0.9} />
              {/* columna */}
              <rect x={x - 14} y={Math.min(y1, yy)} width={28} height={Math.abs(yy - y1)} fill={frio ? "#4E7C93" : AMBAR} />
              <circle cx={x} cy={Y + H + 6} r={34} fill={frio ? "#4E7C93" : AMBAR} stroke={TINTA} strokeWidth={2} />
              {/* valor */}
              <text x={x} y={yy + (frio ? 54 : -26)} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={62} opacity={g}>
                {m.valor > 0 ? "+" : ""}{m.valor}{m.unidad ?? "°"}
              </text>
              {/* dónde */}
              <text x={x} y={Y + H + 108} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={30} letterSpacing={4} opacity={g}>
                {m.donde.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </Hoja>
  );
};

// ── 4. LOS DOS CAÑOS — el efecto chimenea. Aire frío entra abajo, aire viciado sale arriba.
export const DosCanos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const corte = interpolate(f, [14, 44], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const flujo = (f % 60) / 60;
  return (
    <Hoja inn={inn} giro={0.18}>
      <svg width="100%" height="100%" viewBox="0 0 1812 972" preserveAspectRatio="xMidYMid slice">
        {/* la tierra en corte */}
        <rect x={300} y={330} width={1210} height={470} fill="#B9A67E" opacity={0.55 * corte} />
        <line x1={300} y1={330} x2={1510} y2={330} stroke={TINTA} strokeWidth={4} opacity={corte} />
        {/* el piso de tablones del granero, y el hueco de 40 cm */}
        <rect x={300} y={252} width={1210} height={26} fill="#8A6B42" opacity={corte} />
        <text x={1546} y={272} fill={TINTA} fontFamily={SERIF} fontSize={26} opacity={corte}>piso de tablones</text>
        <text x={1546} y={318} fill={TINTA} fontFamily={SERIF} fontSize={26} opacity={corte}>hueco de 40 cm</text>
        {/* la cámara */}
        <rect x={620} y={470} width={580} height={280} fill="#241C12" opacity={0.86 * corte} />
        <text x={910} y={628} textAnchor="middle" fill="#E7DCC0" fontFamily={SERIF} fontSize={34} opacity={corte} letterSpacing={5}>LA CÁMARA</text>
        {/* caño de ENTRADA: abajo, a la izquierda */}
        <path d="M 300 300 L 560 300 L 560 720 L 640 720" stroke="#4E7C93" strokeWidth={16} fill="none" strokeLinecap="round" opacity={corte} />
        {/* caño de SALIDA: arriba, a la derecha */}
        <path d="M 1180 500 L 1300 500 L 1300 180 L 1360 180" stroke={AMBAR} strokeWidth={16} fill="none" strokeLinecap="round" opacity={corte} />
        {/* las partículas que muestran el sentido del aire */}
        {[0, 1, 2].map((k) => {
          const p = (flujo + k / 3) % 1;
          return <circle key={"e" + k} cx={560} cy={300 + 420 * p} r={9} fill="#4E7C93" opacity={corte * 0.9} />;
        })}
        {[0, 1, 2].map((k) => {
          const p = (flujo + k / 3) % 1;
          return <circle key={"s" + k} cx={1300} cy={500 - 320 * p} r={9} fill={AMBAR} opacity={corte * 0.9} />;
        })}
        <text x={470} y={860} textAnchor="middle" fill="#4E7C93" fontFamily={SERIF} fontSize={32} opacity={corte}>ENTRA FRÍO, ABAJO</text>
        <text x={1360} y={128} textAnchor="middle" fill={AMBAR} fontFamily={SERIF} fontSize={32} opacity={corte}>SALE VICIADO, ARRIBA</text>
      </svg>
    </Hoja>
  );
};
