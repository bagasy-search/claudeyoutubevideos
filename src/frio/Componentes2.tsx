// KIT DE COMPONENTES (2) — "Archivos del Frío". Las 6 familias que faltaban para cubrir los
// 30 momentos de componente del guion. Mismo marco que Componentes.tsx: papel de expediente,
// tinta, ámbar como único acento, serif. Todo el contenido vive dentro de x ∈ [120, 1690]
// (fuera de ahí el margen de la hoja lo recorta — ya costó un render).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { Hoja, TINTA, AMBAR, SERIF } from "./Componentes";

const ease = Easing.bezier(0.33, 0, 0.15, 1);
const VB = { viewBox: "0 0 1808 968", preserveAspectRatio: "xMidYMid meet" as const };

// ── 7. CITA DEL CUADERNO — lo que ella escribió, con su fecha. La firma emocional del canal.
//      Va CENTRADA y grande: es la pieza que la gente recorta y comparte, no una nota al pie.
export const CitaCuaderno: React.FC<{ dur: number; texto: string; fecha?: string; atribucion?: string }> = ({
  dur, texto, fecha, atribucion,
}) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const palabras = texto.split(/\s+/);
  const porPalabra = Math.max(2, Math.floor((dur * 0.42) / Math.max(1, palabras.length)));
  const vistas = palabras.filter((_, i) => f >= 18 + i * porPalabra).length;
  const pie = interpolate(f, [Math.round(dur * 0.60), Math.round(dur * 0.76)], [0, 1], { extrapolateRight: "clamp", easing: ease });

  // reparto equilibrado: nunca un renglón final huérfano de una sola palabra
  const MAXC = 26;
  const lineas: string[][] = [[]];
  let largo = 0;
  palabras.forEach((w) => {
    if (largo + w.length > MAXC && lineas[lineas.length - 1].length) { lineas.push([]); largo = 0; }
    lineas[lineas.length - 1].push(w); largo += w.length + 1;
  });
  if (lineas.length > 1 && lineas[lineas.length - 1].length === 1) {
    const prev = lineas[lineas.length - 2];
    if (prev.length > 1) lineas[lineas.length - 1].unshift(prev.pop() as string);
  }

  const SALTO = 104;
  const Y0 = 484 - ((lineas.length - 1) * SALTO) / 2;
  let idx = 0;
  return (
    <Hoja inn={inn} giro={0.3}>
      <svg width="100%" height="100%" {...VB}>
        <line x1={300} y1={200} x2={300} y2={820} stroke="#B4553A" strokeWidth={2} opacity={0.30} />
        {fecha ? (
          <text x={904} y={236} textAnchor="middle" fill="#7A6A44" fontFamily={SERIF} fontSize={29} letterSpacing={7} opacity={inn}>
            {fecha.toUpperCase()}
          </text>
        ) : null}
        <text x={470} y={Y0 - 96} fill={AMBAR} fontFamily={SERIF} fontSize={150} opacity={inn * 0.45}>&#8220;</text>
        {lineas.map((ln, li) => (
          <text key={li} x={904} y={Y0 + li * SALTO} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={70} fontStyle="italic">
            {ln.map((w) => {
              const mostrar = idx < vistas; idx += 1;
              return <tspan key={idx} opacity={mostrar ? 1 : 0}>{w} </tspan>;
            })}
          </text>
        ))}
        {atribucion ? (
          <g opacity={pie}>
            <line x1={764} y1={Y0 + lineas.length * SALTO + 26} x2={1044} y2={Y0 + lineas.length * SALTO + 26} stroke={AMBAR} strokeWidth={2} />
            <text x={904} y={Y0 + lineas.length * SALTO + 78} textAnchor="middle" fill="#6B5B36" fontFamily={SERIF} fontSize={28} letterSpacing={6}>
              {atribucion.toUpperCase()}
            </text>
          </g>
        ) : null}
      </svg>
    </Hoja>
  );
};

// ── 8. LÍNEA DE TIEMPO — hitos que aparecen sobre una regla que se dibuja.
export const LineaTiempo: React.FC<{
  dur: number; titulo?: string; hitos: { cuando: string; que: string }[];
}> = ({ dur, titulo, hitos }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const regla = interpolate(f, [12, Math.max(34, dur * 0.42)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const X0 = 220, X1 = 1620, Y = 520;
  return (
    <Hoja inn={inn} giro={-0.22}>
      <svg width="100%" height="100%" {...VB}>
        {titulo ? (
          <text x={904} y={168} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={38} letterSpacing={9} opacity={inn}>
            {titulo.toUpperCase()}
          </text>
        ) : null}
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * regla} y2={Y} stroke={TINTA} strokeWidth={3} />
        {hitos.map((h, i) => {
          const x = X0 + ((X1 - X0) * (i + 0.5)) / hitos.length;
          const at = 20 + i * 15;
          const ap = interpolate(f, [at, at + 18], [0, 1], { extrapolateRight: "clamp", easing: ease });
          const arriba = i % 2 === 0;
          return (
            <g key={i} opacity={ap}>
              <line x1={x} y1={Y} x2={x} y2={arriba ? Y - 62 : Y + 62} stroke={AMBAR} strokeWidth={2.5} />
              <circle cx={x} cy={Y} r={10} fill={TINTA} />
              <text x={x} y={arriba ? Y - 84 : Y + 116} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={46}>{h.cuando}</text>
              <text x={x} y={arriba ? Y - 138 : Y + 158} textAnchor="middle" fill="#6B5B36" fontFamily={SERIF} fontSize={27}>{h.que}</text>
            </g>
          );
        })}
      </svg>
    </Hoja>
  );
};

// ── 9. INVENTARIO — la lista del expediente, con su renglón y su cantidad. Cada ítem entra solo.
export const ListaExpediente: React.FC<{
  dur: number; titulo?: string; items: { que: string; cuanto?: string }[]; pie?: string;
}> = ({ dur, titulo, items, pie }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const paso = Math.max(5, Math.floor((dur * 0.6) / Math.max(1, items.length)));
  const alto = Math.min(74, Math.floor(560 / Math.max(1, items.length)));
  const Y0 = 300 - (items.length * alto) / 2 + 180;
  return (
    <Hoja inn={inn} giro={0.16}>
      <svg width="100%" height="100%" {...VB}>
        {titulo ? (
          <text x={904} y={166} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={38} letterSpacing={9} opacity={inn}>
            {titulo.toUpperCase()}
          </text>
        ) : null}
        {items.map((it, i) => {
          const at = 16 + i * paso;
          const ap = interpolate(f, [at, at + 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
          const dx = interpolate(f, [at, at + 12], [-26, 0], { extrapolateRight: "clamp", easing: ease });
          const y = Y0 + i * alto;
          return (
            <g key={i} opacity={ap} transform={`translate(${dx},0)`}>
              <line x1={300} y1={y + 12} x2={1560} y2={y + 12} stroke="#9A8A62" strokeWidth={1} opacity={0.30} />
              <circle cx={276} cy={y + 2} r={6} fill={AMBAR} />
              <text x={318} y={y} fill={TINTA} fontFamily={SERIF} fontSize={Math.max(30, alto - 30)}>{it.que}</text>
              {it.cuanto ? (
                <text x={1560} y={y} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={Math.max(30, alto - 30)}>{it.cuanto}</text>
              ) : null}
            </g>
          );
        })}
        {pie ? (
          <text x={904} y={892} textAnchor="middle" fill="#6B5B36" fontFamily={SERIF} fontSize={27} letterSpacing={7}
            opacity={interpolate(f, [Math.round(dur * 0.7), Math.round(dur * 0.84)], [0, 1], { extrapolateRight: "clamp", easing: ease })}>
            {pie.toUpperCase()}
          </text>
        ) : null}
      </svg>
    </Hoja>
  );
};

// ── 10. BARRAS COMPARADAS — dos o tres magnitudes que se miden entre sí (420 ovejas contra 41).
export const BarrasComparadas: React.FC<{
  dur: number; titulo?: string; barras: { rotulo: string; valor: number; sufijo?: string; acento?: boolean }[];
}> = ({ dur, titulo, barras }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const max = Math.max(...barras.map((b) => b.valor)) || 1;
  const X = 420, W = 1140, Y0 = 300, ALTO = Math.min(120, Math.floor(480 / barras.length));
  return (
    <Hoja inn={inn} giro={-0.28}>
      <svg width="100%" height="100%" {...VB}>
        {titulo ? (
          <text x={904} y={168} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={38} letterSpacing={9} opacity={inn}>
            {titulo.toUpperCase()}
          </text>
        ) : null}
        {barras.map((b, i) => {
          const at = 18 + i * 18;
          const g = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 55 } });
          const w = (W * b.valor * g) / max;
          const y = Y0 + i * (ALTO + 46);
          const n = Math.round(b.valor * g);
          return (
            <g key={i}>
              <text x={X - 34} y={y + ALTO * 0.68} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={34}>{b.rotulo}</text>
              <rect x={X} y={y} width={w} height={ALTO} fill={b.acento ? AMBAR : "#8A7A54"} opacity={b.acento ? 0.95 : 0.62} />
              <text x={X + w + 26} y={y + ALTO * 0.72} fill={TINTA} fontFamily={SERIF} fontSize={54}>
                {n}{b.sufijo ?? ""}
              </text>
            </g>
          );
        })}
      </svg>
    </Hoja>
  );
};

// ── 11. LA CUENTA QUE NO CIERRA — lo que el cuerpo pierde contra lo que produce. Dos columnas
//        enfrentadas: es la pieza del bloque de hipotermia.
export const CuentaQueNoCierra: React.FC<{
  dur: number; pierde: { valor: number; unidad: string; rotulo: string }; produce: { valor: number; unidad: string; rotulo: string };
  veredicto?: string;
}> = ({ dur, pierde, produce, veredicto }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const gA = spring({ frame: f - 16, fps, config: { damping: 200, stiffness: 55 } });
  const gB = spring({ frame: f - 34, fps, config: { damping: 200, stiffness: 55 } });
  const ver = interpolate(f, [Math.round(dur * 0.62), Math.round(dur * 0.78)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const H = 420, Y = 250;
  const hA = H * gA, hB = H * (produce.valor / pierde.valor) * gB;
  return (
    <Hoja inn={inn} giro={0.2}>
      <svg width="100%" height="100%" {...VB}>
        <line x1={904} y1={190} x2={904} y2={760} stroke={TINTA} strokeWidth={1.5} opacity={0.28} strokeDasharray="8 8" />
        {[{ x: 560, h: hA, d: pierde, col: "#4E7C93", g: gA }, { x: 1250, h: hB, d: produce, col: AMBAR, g: gB }].map((c, i) => (
          <g key={i}>
            <rect x={c.x - 96} y={Y + H - c.h} width={192} height={c.h} fill={c.col} opacity={0.88} />
            <text x={c.x} y={Y + H - c.h - 30} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={76}>
              {Math.round(c.d.valor * c.g)}<tspan fontSize={38} dx={8}>{c.d.unidad}</tspan>
            </text>
            <text x={c.x} y={Y + H + 62} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={30} letterSpacing={5}>
              {c.d.rotulo.toUpperCase()}
            </text>
          </g>
        ))}
        <line x1={420} y1={Y + H} x2={1400} y2={Y + H} stroke={TINTA} strokeWidth={3} />
        {veredicto ? (
          <text x={904} y={862} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={44} opacity={ver} fontStyle="italic">
            {veredicto}
          </text>
        ) : null}
      </svg>
    </Hoja>
  );
};

// ── 12. PLANTA CON MEDIDAS — el granero, la cámara: el plano acotado del expediente.
export const PlantaMedidas: React.FC<{
  dur: number; titulo?: string; ancho: string; alto: string; nota?: string; interior?: { ancho: string; alto: string; rotulo: string };
}> = ({ dur, titulo, ancho, alto, nota, interior }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const traza = interpolate(f, [14, Math.max(38, dur * 0.45)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const cot = interpolate(f, [Math.max(30, dur * 0.42), Math.max(46, dur * 0.60)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const inte = interpolate(f, [Math.max(42, dur * 0.58), Math.max(58, dur * 0.74)], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const X = 420, Y = 280, W = 980, H = 420;
  const per = 2 * (W + H);
  return (
    <Hoja inn={inn} giro={-0.12}>
      <svg width="100%" height="100%" {...VB}>
        {titulo ? (
          <text x={904} y={168} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={38} letterSpacing={9} opacity={inn}>
            {titulo.toUpperCase()}
          </text>
        ) : null}
        <rect x={X} y={Y} width={W} height={H} fill="none" stroke={TINTA} strokeWidth={4}
          strokeDasharray={per} strokeDashoffset={per * (1 - traza)} />
        {/* cota horizontal */}
        <g opacity={cot}>
          <line x1={X} y1={Y + H + 74} x2={X + W} y2={Y + H + 74} stroke={AMBAR} strokeWidth={2} />
          <line x1={X} y1={Y + H + 60} x2={X} y2={Y + H + 88} stroke={AMBAR} strokeWidth={2} />
          <line x1={X + W} y1={Y + H + 60} x2={X + W} y2={Y + H + 88} stroke={AMBAR} strokeWidth={2} />
          <text x={X + W / 2} y={Y + H + 132} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={44}>{ancho}</text>
        </g>
        {/* cota vertical */}
        <g opacity={cot}>
          <line x1={X - 74} y1={Y} x2={X - 74} y2={Y + H} stroke={AMBAR} strokeWidth={2} />
          <line x1={X - 88} y1={Y} x2={X - 60} y2={Y} stroke={AMBAR} strokeWidth={2} />
          <line x1={X - 88} y1={Y + H} x2={X - 60} y2={Y + H} stroke={AMBAR} strokeWidth={2} />
          <text x={X - 104} y={Y + H / 2 + 14} textAnchor="end" fill={TINTA} fontFamily={SERIF} fontSize={44}>{alto}</text>
        </g>
        {interior ? (
          <g opacity={inte}>
            <rect x={X + W * 0.58} y={Y + H * 0.42} width={W * 0.30} height={H * 0.44} fill="#241C12" opacity={0.86} />
            <text x={X + W * 0.73} y={Y + H * 0.66} textAnchor="middle" fill="#E7DCC0" fontFamily={SERIF} fontSize={28} letterSpacing={3}>
              {interior.rotulo.toUpperCase()}
            </text>
            <text x={X + W * 0.73} y={Y + H * 0.94} textAnchor="middle" fill={TINTA} fontFamily={SERIF} fontSize={30}>
              {interior.ancho} × {interior.alto}
            </text>
          </g>
        ) : null}
        {nota ? (
          <text x={904} y={880} textAnchor="middle" fill="#6B5B36" fontFamily={SERIF} fontSize={28} letterSpacing={5} opacity={cot}>
            {nota.toUpperCase()}
          </text>
        ) : null}
      </svg>
    </Hoja>
  );
};
