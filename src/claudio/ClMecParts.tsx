// Piezas chicas compartidas por los kits por video del Mecánico (ClMec_<slug>.tsx, eps. 4+): etiqueta, nota, cámara three, círculo a mano,
// el tablero oscuro con agujas. Copia IDÉNTICA en cada rama de video (así el merge de integración no choca).
import React from "react";
import { useThree } from "@react-three/fiber";
import { CL, LABEL, SERIF, HAND, clamp01 } from "./ClTheme";
import { Card } from "./ClParts";

export const Cam: React.FC<{ pos: any; target: any }> = ({ pos, target }) => {
  const { camera } = useThree(); camera.position.copy(pos); camera.lookAt(target); camera.updateProjectionMatrix(); return null;
};
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${color === CL.nitrile ? CL.navy : CL.nitrile}` }}>{text}</div>
);
export const Note: React.FC<{ x: number; y: number; o: number; big: string; small?: string; color?: string; w?: number }> = ({ x, y, o, big, small, color = CL.nitrile, w }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px)`, width: w }}>
    <Card style={{ padding: "14px 30px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{big}</div>
      {small ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color }}>{small}</div> : null}
    </Card>
  </div>
);
export const HandCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; k: number; color?: string; w?: number }> = ({ cx, cy, rx, ry, k, color = CL.nitrile, w = 10 }) => {
  const L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.08;
  const d = `M ${cx + rx} ${cy - 6} A ${rx} ${ry} 0 1 1 ${cx + rx - 4} ${cy - 22} A ${rx * 1.04} ${ry * 1.06} 0 0 1 ${cx + rx + 8} ${cy + 4}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - clamp01(k))} />;
};
// esfera de instrumento del tablero (negra, borde metálico): ang en grados (-120 izquierda … +120 derecha); marks = arcos de color
export const Dial: React.FC<{ x: number; y: number; d?: number; ang: number; label?: string; marks?: { a0: number; a1: number; c: string }[]; lo?: string; hi?: string; glow?: number }> = ({ x, y, d = 420, ang, label, marks = [], lo, hi, glow = 0 }) => {
  const r = d / 2, R = r * 0.72;
  const arc = (a0: number, a1: number) => { const p = (a: number) => [r + Math.cos((a - 90) * Math.PI / 180) * R, r + Math.sin((a - 90) * Math.PI / 180) * R]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  return (
    <div style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: "radial-gradient(#1C2330,#07090D)", boxShadow: `0 30px 50px rgba(0,0,0,0.5), inset 0 0 0 ${d * 0.033}px #9EA4AB, 0 0 ${60 * glow}px rgba(255,80,40,${0.6 * glow})` }}>
      <svg width={d} height={d} style={{ position: "absolute" }}>
        {marks.map((m, i) => <path key={i} d={arc(m.a0, m.a1)} fill="none" stroke={m.c} strokeWidth={d * 0.045} />)}
        {Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30) * Math.PI / 180 - Math.PI / 2; return <line key={i} x1={r + Math.cos(a) * r * 0.82} y1={r + Math.sin(a) * r * 0.82} x2={r + Math.cos(a) * r * 0.69} y2={r + Math.sin(a) * r * 0.69} stroke="#E7E9EC" strokeWidth={d * 0.014} />; })}
        {lo ? <text x={r * 0.3} y={r * 1.3} fill="#E7E9EC" fontFamily={LABEL} fontWeight={700} fontSize={d * 0.09}>{lo}</text> : null}
        {hi ? <text x={r * 1.55} y={r * 1.3} fill="#E7E9EC" fontFamily={LABEL} fontWeight={700} fontSize={d * 0.09}>{hi}</text> : null}
      </svg>
      <div style={{ position: "absolute", left: r - d * 0.014, top: r - r * 0.72, width: d * 0.028, height: r * 0.72, background: "#F27A1A", borderRadius: 6, transformOrigin: "50% 100%", rotate: `${ang}deg`, boxShadow: "0 0 10px rgba(242,122,26,0.6)" }} />
      <div style={{ position: "absolute", left: r - d * 0.05, top: r - d * 0.05, width: d * 0.1, height: d * 0.1, borderRadius: "50%", background: "#3A3F48" }} />
      {label ? <div style={{ position: "absolute", left: 0, right: 0, bottom: d * 0.17, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: d * 0.095, color: "#E7E9EC" }}>{label}</div> : null}
    </div>
  );
};
