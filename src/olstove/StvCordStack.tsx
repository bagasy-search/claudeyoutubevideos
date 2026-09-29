// StvCordStack — un CORD medido con cinta: pila 4 pies de alto × 4 de fondo × 8 de largo = 128 pies cúbicos.
// PAGO: «wood is sold by the cord… watch out for a face cord». Los troncos llegan en filas, la cinta se estira en 3 medidas y la pila se
// compara con un "face cord" (una fracción). Etiquetas por props (sin texto quemado).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, LABEL, HAND, woodBg, hexA, rnd } from "./OleTheme";
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const StvCordStack: React.FC<{ labels?: { h: string; d: string; l: string; total: string; face: string }; t0?: number }> = ({ t0 = 0, labels = { h: "4 ft", d: "4 ft", l: "8 ft", total: "128 cubic feet", face: "a face cord: a fraction" } }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps + t0;
  const cols = 16, rows = 8, cw = 44, ch = 44;
  const ox = 420, oy = 780;
  const logs: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, a = c01((t - 0.2 - r * 0.16 - c * 0.012) / 0.35), drop = (1 - ease(a)) * 240;
    if (a <= 0) continue;
    const cx = ox + c * cw + cw / 2, cy = oy - r * ch - ch / 2 - drop, rr = cw / 2 - 2 + rnd(i) * 2;
    const tone = 0.85 + rnd(i * 3) * 0.3;
    logs.push(<g key={i} opacity={a}><circle cx={cx + 6} cy={cy + 6} r={rr} fill="rgba(30,16,6,0.25)" /><circle cx={cx} cy={cy} r={rr} fill={`rgb(${Math.round(150 * tone)},${Math.round(104 * tone)},${Math.round(62 * tone)})`} stroke="#4C3320" strokeWidth="3" /><circle cx={cx} cy={cy} r={rr * 0.62} fill="none" stroke="rgba(90,55,25,0.55)" strokeWidth="2" /><circle cx={cx} cy={cy} r={rr * 0.3} fill="none" stroke="rgba(90,55,25,0.55)" strokeWidth="2" /></g>);
  }
  const m1 = c01((t - 2.6) / 0.7), m2 = c01((t - 3.5) / 0.7), m3 = c01((t - 4.4) / 0.7);
  const W = cols * cw, H = rows * ch;
  return (
    <AbsoluteFill style={woodBg("#B98C5A")}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 40%, ${hexA("#FFF4DE", 0.5)}, transparent 62%)` }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect x={ox - 30} y={oy} width={W + 60} height="26" fill="#4a3826" /><rect x={ox - 30} y={oy + 26} width={W + 60} height="12" fill="rgba(0,0,0,0.25)" />
        {logs}
        <g opacity={m1}><line x1={ox - 60} y1={oy} x2={ox - 60} y2={oy - H * m1} stroke="#F2C230" strokeWidth="14" /><line x1={ox - 80} y1={oy - H * m1} x2={ox - 40} y2={oy - H * m1} stroke="#111" strokeWidth="5" />
          <text x={ox - 90} y={oy - H / 2} textAnchor="end" fontFamily={HAND} fontSize="56" fill={OLE.iron} fontWeight={700}>{labels.h}</text></g>
        <g opacity={m3}><line x1={ox} y1={oy + 74} x2={ox + W * m3} y2={oy + 74} stroke="#F2C230" strokeWidth="14" /><line x1={ox + W * m3} y1={oy + 54} x2={ox + W * m3} y2={oy + 94} stroke="#111" strokeWidth="5" />
          <text x={ox + W / 2} y={oy + 150} textAnchor="middle" fontFamily={HAND} fontSize="56" fill={OLE.iron} fontWeight={700}>{labels.l}</text></g>
        <g opacity={m2}><line x1={ox + W + 40} y1={oy - 10} x2={ox + W + 40 + 130 * m2} y2={oy - 10 - 70 * m2} stroke="#F2C230" strokeWidth="14" />
          <text x={ox + W + 190} y={oy - 40} fontFamily={HAND} fontSize="56" fill={OLE.iron} fontWeight={700}>{labels.d}</text></g>
        <text x={960} y={120} textAnchor="middle" fontFamily={LABEL} fontSize="66" letterSpacing="6" fill={OLE.iron} opacity={c01((t - 5.3) / 0.6)}>{labels.total.toUpperCase()}</text>
        <g opacity={c01((t - 6.6) / 0.6)}>
          <rect x={ox} y={oy - H} width={W / 3} height={H} fill={hexA("#B3261E", 0.16)} stroke="#B3261E" strokeWidth="6" strokeDasharray="18 12" />
          <text x={ox + W / 6} y={oy - H - 20} textAnchor="middle" fontFamily={HAND} fontSize="42" fill="#B3261E" fontWeight={700}>{labels.face}</text></g>
      </svg>
    </AbsoluteFill>
  );
};
export default StvCordStack;
