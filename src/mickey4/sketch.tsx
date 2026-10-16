// ── mickey · texturas y dibujos PURO CSS/SVG para los héroes (pedido del creador 16-oct: cero imágenes adentro de los componentes).
//    Tex = textura del oficio dibujada con gradientes (lino, kraft, acero cepillado, arce, heladera, pizarra, papel de carnicería, aluminio).
//    Sketch = ilustración vectorial del objeto que nombra la frase (jamón, pavo, termómetro, horno, bolsa de hielo…), elegida por palabras de la clave.
//    estilo "ink" = trazo de tinta sobre colores pálidos (grabado de carnicería) · "flat" = plano cálido con sombras de gradiente, sin contorno.
import React from "react";
import { AbsoluteFill } from "remotion";

const TEX: Record<string, string> = {
  linen: "repeating-linear-gradient(0deg, rgba(90,70,40,0.05) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(90,70,40,0.045) 0 2px, transparent 2px 7px), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(120,90,50,0.10), transparent 70%), linear-gradient(160deg, #F1E8D8, #E2D5BE)",
  kraft: "repeating-linear-gradient(23deg, rgba(80,50,20,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-67deg, rgba(255,240,210,0.07) 0 1px, transparent 1px 13px), radial-gradient(ellipse 30% 22% at 20% 30%, rgba(90,55,20,0.16), transparent 70%), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,230,190,0.18), transparent 70%), linear-gradient(170deg, #CDA878, #B88D5C)",
  paper: "repeating-linear-gradient(90deg, rgba(150,120,90,0.05) 0 1px, transparent 1px 11px), radial-gradient(ellipse 40% 30% at 30% 30%, rgba(255,255,255,0.5), transparent 70%), linear-gradient(170deg, #F4EDE0, #E6DAC6)",
  steel: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, rgba(0,0,0,0.05) 1px 2px, transparent 2px 4px), conic-gradient(from 200deg at 30% 40%, #9EA5AC, #D9DDE1, #A7AEB5, #E8EBEE, #9EA5AC)",
  foil: "repeating-linear-gradient(115deg, rgba(255,255,255,0.35) 0 18px, rgba(120,128,136,0.25) 18px 30px, transparent 30px 60px), repeating-linear-gradient(-35deg, rgba(255,255,255,0.25) 0 25px, rgba(90,98,106,0.2) 25px 40px, transparent 40px 80px), linear-gradient(160deg, #C9CED3, #EEF0F2 45%, #B4BAC0)",
  wood: "repeating-linear-gradient(92deg, rgba(60,30,10,0.18) 0 3px, transparent 3px 26px, rgba(255,220,170,0.08) 26px 31px, transparent 31px 57px), repeating-linear-gradient(88deg, rgba(60,30,10,0.10) 0 1px, transparent 1px 9px), radial-gradient(ellipse 12% 3% at 40% 30%, rgba(60,30,10,0.35), transparent 80%), radial-gradient(ellipse 10% 2.5% at 75% 70%, rgba(60,30,10,0.3), transparent 80%), linear-gradient(180deg, #9C6A3E, #7E5230)",
  fridge: "linear-gradient(90deg, rgba(0,0,0,0.06), transparent 8%, transparent 92%, rgba(0,0,0,0.08)), linear-gradient(180deg, transparent 0 63%, rgba(0,0,0,0.10) 63% 63.4%, transparent 63.4%), radial-gradient(ellipse 50% 40% at 35% 25%, rgba(255,255,255,0.9), transparent 70%), linear-gradient(180deg, #F3F3EF, #DEDFDA)",
  green: "radial-gradient(ellipse 35% 25% at 25% 30%, rgba(255,255,255,0.06), transparent 70%), radial-gradient(ellipse 30% 20% at 75% 70%, rgba(255,255,255,0.05), transparent 70%), repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 5px), linear-gradient(180deg, #23503F, #183A2D)",
  chalk: "radial-gradient(ellipse 40% 18% at 30% 35%, rgba(255,255,255,0.08), transparent 70%), radial-gradient(ellipse 30% 14% at 70% 65%, rgba(255,255,255,0.07), transparent 70%), repeating-linear-gradient(170deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px), linear-gradient(180deg, #2F3A34, #232C27)",
};
const texOf = (k: string) => Object.keys(TEX).find((t) => k.includes(t)) || "paper";

export const Tex: React.FC<{ k: string; f: number; T: number; dark?: number }> = ({ k, f, T, dark = 0 }) => {
  const sweep = -40 + 180 * (f / Math.max(1, T));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: TEX[texOf(k)], transform: `scale(${1.06 + 0.04 * f / Math.max(1, T)})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,250,235,0.10) ${sweep}%, transparent ${sweep + 12}%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 30% 10%, rgba(255,214,160,0.20), rgba(255,214,160,0) 70%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(30,15,5,${0.30 + dark}), rgba(0,0,0,${dark * 0.6}) 60%)` }} />
    </AbsoluteFill>
  );
};

// ── piezas de dibujo (viewBox 400×260) ────────────────────────────────────
type St = { ink: boolean };
const sk = (s: St, w = 3) => (s.ink ? { stroke: "#2B2118", strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const } : {});
const Ham: React.FC<St & { x: number; y: number; s?: number; spiral?: boolean; scored?: boolean; glaze?: boolean; id: string }> = ({ x, y, s = 1, spiral, scored, glaze, ink, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><radialGradient id={id + "h"} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor={glaze ? "#D9823B" : "#E7A57E"} /><stop offset="1" stopColor={glaze ? "#8E3E14" : "#B4643F"} /></radialGradient></defs>
    <ellipse cx={4} cy={58} rx={92} ry={14} fill="rgba(0,0,0,0.22)" />
    <path d="M -90 10 C -95 -40 -40 -70 10 -62 C 60 -55 95 -20 92 10 C 90 45 40 60 -10 58 C -60 56 -88 40 -90 10 Z" fill={`url(#${id}h)`} {...sk({ ink }, 3)} />
    <path d="M 60 -40 C 80 -20 88 0 86 20" stroke="#F3D9B8" strokeWidth={10} fill="none" opacity={0.8} />
    <ellipse cx={-80} cy={8} rx={14} ry={34} fill="#F6C9B4" {...sk({ ink }, 2.5)} />
    <circle cx={-80} cy={8} r={8} fill="#F4ECDD" {...sk({ ink }, 2)} />
    {spiral ? [-50, -25, 0, 25, 50].map((dx) => <path key={dx} d={`M ${dx} -58 C ${dx + 12} -20 ${dx + 12} 20 ${dx} 56`} stroke="#8A3F22" strokeWidth={2.5} fill="none" opacity={0.7} />) : null}
    {scored ? [-60, -30, 0, 30, 60].flatMap((dx) => [<path key={"a" + dx} d={`M ${dx - 30} -50 L ${dx + 30} 50`} stroke="#7A3615" strokeWidth={2} opacity={0.6} />, <path key={"b" + dx} d={`M ${dx + 30} -50 L ${dx - 30} 50`} stroke="#7A3615" strokeWidth={2} opacity={0.6} />]) : null}
    {glaze ? <path d="M -40 -50 C 0 -60 40 -50 70 -30" stroke="rgba(255,240,200,0.7)" strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
  </g>
);
const Turkey: React.FC<St & { x: number; y: number; s?: number; raw?: boolean; pop?: number; id: string }> = ({ x, y, s = 1, raw, pop, ink, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><radialGradient id={id + "t"} cx="45%" cy="30%" r="75%"><stop offset="0" stopColor={raw ? "#F7DCC6" : "#E5A15A"} /><stop offset="1" stopColor={raw ? "#D9A98A" : "#9A5420"} /></radialGradient></defs>
    <ellipse cx={0} cy={72} rx={125} ry={16} fill="rgba(0,0,0,0.22)" />
    <path d="M -110 30 C -118 -30 -60 -70 0 -70 C 60 -70 118 -30 110 30 C 104 62 60 74 0 74 C -60 74 -104 62 -110 30 Z" fill={`url(#${id}t)`} {...sk({ ink }, 3)} />
    <path d="M -60 -50 C -20 -64 30 -64 64 -48" stroke={raw ? "rgba(255,255,255,0.5)" : "rgba(255,230,180,0.55)"} strokeWidth={8} fill="none" strokeLinecap="round" />
    {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 82} 40) rotate(${sd * -28})`}>
      <path d="M -26 0 C -30 -34 30 -34 26 0 C 22 30 8 52 6 70 L -6 70 C -8 52 -22 30 -26 0 Z" fill={`url(#${id}t)`} {...sk({ ink }, 2.5)} />
      <circle cx={-5} cy={74} r={8} fill="#F4ECDD" {...sk({ ink }, 2)} /><circle cx={6} cy={74} r={8} fill="#F4ECDD" {...sk({ ink }, 2)} />
    </g>)}
    {pop != null ? <g transform="translate(-10 -62)"><rect x={-7} y={-6 - 26 * pop} width={14} height={26} rx={4} fill="#E33A2E" /><rect x={-12} y={-4} width={24} height={9} rx={3} fill="#C62D22" /></g> : null}
  </g>
);
const Board: React.FC<St & { x: number; y: number; w: number; h: number }> = ({ x, y, w, h, ink }) => (
  <g><rect x={x + 6} y={y + 10} width={w} height={h} rx={18} fill="rgba(0,0,0,0.22)" />
    <rect x={x} y={y} width={w} height={h} rx={18} fill="#B98252" {...sk({ ink }, 3)} />
    {[0.25, 0.5, 0.75].map((p) => <path key={p} d={`M ${x + 14} ${y + h * p} C ${x + w * 0.4} ${y + h * p - 6} ${x + w * 0.6} ${y + h * p + 6} ${x + w - 14} ${y + h * p}`} stroke="rgba(90,50,20,0.35)" strokeWidth={2} fill="none" />)}
  </g>
);
const Slices: React.FC<St & { x: number; y: number; n?: number; color?: string; s?: number }> = ({ x, y, n = 6, color = "#F1D7BE", s = 1, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{Array.from({ length: n }, (_, i) => (
    <g key={i} transform={`translate(${i * 22 - n * 11} ${Math.abs(i - n / 2) * 2}) rotate(${(i - n / 2) * 6})`}>
      <ellipse cx={0} cy={0} rx={26} ry={42} fill={color} {...sk({ ink }, 2)} /><ellipse cx={0} cy={-34} rx={22} ry={7} fill="#C9884E" opacity={0.9} />
    </g>))}</g>
);
const Pan: React.FC<St & { x: number; y: number; w: number }> = ({ x, y, w, ink }) => (
  <g><ellipse cx={x + w / 2} cy={y + 70} rx={w / 2 + 10} ry={12} fill="rgba(0,0,0,0.22)" />
    <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w - 20} ${y + 64} L ${x + 20} ${y + 64} Z`} fill="#8E969D" {...sk({ ink }, 3)} />
    <rect x={x - 8} y={y - 8} width={w + 16} height={12} rx={6} fill="#B9C0C6" {...sk({ ink }, 2)} /></g>
);
const Thermo: React.FC<St & { x: number; y: number; v: string; s?: number }> = ({ x, y, v, s = 1, ink }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(18)`}>
    <rect x={-4} y={20} width={8} height={120} rx={4} fill="#C9CED3" {...sk({ ink }, 2)} />
    <circle cx={0} cy={0} r={34} fill="#FBFBF7" stroke="#2B2B2B" strokeWidth={6} />
    <text x={0} y={10} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={26} fill="#8C1D2F">{v}</text>
  </g>
);
const Pack: React.FC<St & { x: number; y: number; w: number; h: number; tag: string; accent: string }> = ({ x, y, w, h, tag, accent, ink }) => (
  <g><rect x={x + 8} y={y + 12} width={w} height={h} rx={26} fill="rgba(0,0,0,0.22)" />
    <rect x={x} y={y} width={w} height={h} rx={26} fill="#EFC4A6" {...sk({ ink }, 3)} />
    <path d={`M ${x + 20} ${y + 20} C ${x + w * 0.4} ${y + 6} ${x + w * 0.6} ${y + 34} ${x + w - 20} ${y + 18}`} stroke="rgba(255,255,255,0.7)" strokeWidth={8} fill="none" strokeLinecap="round" />
    <rect x={x + w * 0.18} y={y + h * 0.36} width={w * 0.64} height={h * 0.42} rx={8} fill="#FFFDF7" {...sk({ ink }, 2)} />
    <rect x={x + w * 0.18} y={y + h * 0.36} width={w * 0.64} height={h * 0.12} rx={6} fill={accent} />
    <text x={x + w / 2} y={y + h * 0.62} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={20} fill="#2B2118">{tag}</text>
    {[0.68, 0.73].map((p) => <rect key={p} x={x + w * 0.26} y={y + h * p} width={w * 0.48} height={3} fill="#9b9184" />)}
  </g>
);
const Bowl: React.FC<St & { x: number; y: number; fill: string; brush?: boolean }> = ({ x, y, fill, brush, ink }) => (
  <g transform={`translate(${x} ${y})`}><ellipse cx={4} cy={44} rx={70} ry={10} fill="rgba(0,0,0,0.22)" />
    <path d="M -64 0 C -60 50 60 50 64 0 Z" fill="#E9E2D3" {...sk({ ink }, 3)} /><ellipse cx={0} cy={0} rx={64} ry={14} fill={fill} {...sk({ ink }, 2)} />
    {brush ? <g transform="translate(20 -10) rotate(-35)"><rect x={-4} y={-90} width={8} height={70} rx={3} fill="#8A5A30" /><rect x={-10} y={-24} width={20} height={26} rx={4} fill="#E8D6AE" /></g> : null}</g>
);
const Pot: React.FC<St & { x: number; y: number; f: number; soup: string }> = ({ x, y, f, soup, ink }) => (
  <g transform={`translate(${x} ${y})`}><ellipse cx={0} cy={66} rx={90} ry={12} fill="rgba(0,0,0,0.22)" />
    <rect x={-80} y={-10} width={160} height={74} rx={14} fill="#3D4A55" {...sk({ ink }, 3)} /><ellipse cx={0} cy={-10} rx={80} ry={16} fill={soup} {...sk({ ink }, 2)} />
    <rect x={-100} y={4} width={22} height={10} rx={5} fill="#2C353D" /><rect x={78} y={4} width={22} height={10} rx={5} fill="#2C353D" />
    {[-30, 0, 30].map((dx, i) => <path key={dx} d={`M ${dx} -30 C ${dx - 12} -50 ${dx + 12} -64 ${dx} -84`} stroke="rgba(255,255,255,0.55)" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5 + 0.4 * Math.sin(f / 8 + i)} />)}</g>
);
const Cup: React.FC<St & { x: number; y: number }> = ({ x, y, ink }) => (
  <g transform={`translate(${x} ${y})`}><ellipse cx={0} cy={74} rx={60} ry={10} fill="rgba(0,0,0,0.22)" />
    <path d="M -50 -60 L 50 -60 L 44 70 L -44 70 Z" fill="rgba(235,245,250,0.55)" {...sk({ ink }, 3)} stroke={ink ? "#2B2118" : "#c9d6dd"} strokeWidth={3} />
    <path d="M -47 0 L 47 0 L 44 70 L -44 70 Z" fill="#8A4A1E" opacity={0.9} /><path d="M -48 -22 L 48 -22 L 47 0 L -47 0 Z" fill="#F2C14E" opacity={0.85} />
    <path d="M 50 -40 C 80 -40 80 30 47 30" stroke={ink ? "#2B2118" : "#c9d6dd"} strokeWidth={8} fill="none" />
    {[-30, -10, 10, 30, 50].map((yy) => <rect key={yy} x={-48} y={yy} width={16} height={3} fill="#5c6a72" />)}</g>
);
const IceBag: React.FC<St & { x: number; y: number; r?: number }> = ({ x, y, r = 0, ink }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}><rect x={-50} y={-36} width={100} height={72} rx={14} fill="rgba(215,238,255,0.85)" {...sk({ ink }, 2.5)} stroke={ink ? "#2B2118" : "#9fd0f2"} strokeWidth={3} />
    <rect x={-50} y={-36} width={100} height={10} rx={4} fill="#4F8FD8" />
    {[[-28, -8], [-4, -12], [20, -6], [-18, 14], [8, 12], [30, 16]].map(([cx, cy], i) => <rect key={i} x={cx - 9} y={cy - 9} width={18} height={18} rx={4} fill="rgba(255,255,255,0.9)" stroke="#bfe2ff" strokeWidth={2} />)}</g>
);
const SaltBox: React.FC<St & { x: number; y: number }> = ({ x, y, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-46} y={70} width={110} height={10} rx={5} fill="rgba(0,0,0,0.22)" />
    <rect x={-50} y={-80} width={100} height={150} rx={6} fill="#2F67B1" {...sk({ ink }, 3)} /><rect x={-50} y={-80} width={100} height={24} fill="#244F8A" />
    <rect x={-36} y={-30} width={72} height={60} rx={6} fill="#F7F4EC" /><text x={0} y={8} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={20} fill="#2F67B1">SALT</text>
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={60 + (i * 17) % 50} y={50 + (i * 11) % 20} width={6} height={6} fill="#fff" stroke="#ccc" />)}</g>
);
const Fridge: React.FC<St & { x: number; y: number }> = ({ x, y, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-120} y={-110} width={240} height={220} rx={14} fill="#EEF0EC" {...sk({ ink }, 3)} />
    <rect x={-104} y={-94} width={208} height={190} rx={6} fill="#DDE9EF" /><rect x={-104} y={-20} width={208} height={6} fill="#B8C4CA" /><rect x={-104} y={50} width={208} height={6} fill="#B8C4CA" />
    <rect x={-90} y={60} width={180} height={34} rx={6} fill="#9AA4AA" opacity={0.6} /></g>
);
const Oven: React.FC<St & { x: number; y: number; hot?: number }> = ({ x, y, hot = 0.6, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-150} y={-110} width={300} height={220} rx={14} fill="#2E2A27" {...sk({ ink }, 3)} />
    <rect x={-126} y={-80} width={252} height={160} rx={8} fill={`rgba(255,${120 + 40 * hot},40,${0.25 + 0.4 * hot})`} />
    <rect x={-120} y={30} width={240} height={5} fill="#9aa0a6" /><rect x={-120} y={-20} width={240} height={5} fill="#9aa0a6" opacity={0.5} />
    {[-110, -60, -10].map((cx) => <circle key={cx} cx={cx + 60} cy={-96} r={7} fill="#C9CED3" />)}</g>
);
const Store: React.FC<St & { x: number; y: number; line?: boolean }> = ({ x, y, line, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-150} y={-100} width={300} height={200} fill="#2D5A45" {...sk({ ink }, 3)} />
    <path d="M -160 -70 L 160 -70 L 150 -40 L -150 -40 Z" fill="#8C1D2F" />{[-120, -80, -40, 0, 40, 80, 120].map((xx) => <path key={xx} d={`M ${xx} -70 L ${xx + 20} -70 L ${xx + 18} -40 L ${xx + 2} -40 Z`} fill="#F7EEDD" />)}
    <rect x={-130} y={-28} width={150} height={100} fill="#F3D9A0" opacity={0.85} /><rect x={40} y={-28} width={70} height={128} fill="#1B3A2C" /><circle cx={98} cy={40} r={4} fill="#E8C55A" />
    <rect x={-150} y={-100} width={300} height={28} fill="#1E4637" /><rect x={-80} y={-96} width={160} height={20} rx={3} fill="#F7EEDD" />
    {line ? [-120, -80, -40, 0].map((xx, i) => <g key={xx} transform={`translate(${xx + 260} ${70 + (i % 2) * 4})`}><circle cx={0} cy={-56} r={11} fill="#3A2E25" /><rect x={-13} y={-44} width={26} height={50} rx={10} fill={["#5A4A3B", "#6E3B2E", "#3F4B5A", "#55603F"][i]} /></g>) : null}</g>
);
const Butcher: React.FC<St & { x: number; y: number; wave?: number }> = ({ x, y, wave = 0, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-150} y={60} width={300} height={40} fill="#C9D3D6" {...sk({ ink }, 2)} />
    <path d="M -70 60 C -70 0 -50 -20 0 -22 C 50 -20 70 0 70 60 Z" fill="#2E3C5A" {...sk({ ink }, 3)} />
    <path d="M -36 60 L -30 -14 L 30 -14 L 36 60 Z" fill="#B22234" /><path d="M -30 -14 L 30 -14" stroke="#fff" strokeWidth={3} />{[-20, -8, 4, 16].map((xx) => <rect key={xx} x={xx} y={-12} width={3} height={72} fill="rgba(255,255,255,0.7)" />)}
    <circle cx={0} cy={-52} r={30} fill="#E7B69A" {...sk({ ink }, 2.5)} /><path d="M -36 -66 C -30 -96 30 -96 36 -66 L 42 -60 L -42 -60 Z" fill="#7B7F84" {...sk({ ink }, 2.5)} />
    <g transform={`translate(78 ${-10}) rotate(${-20 + 18 * Math.sin(wave)})`}><rect x={-10} y={-60} width={20} height={70} rx={10} fill="#2E3C5A" /><circle cx={0} cy={-64} r={12} fill="#E7B69A" /></g></g>
);
const Plate: React.FC<St & { x: number; y: number; rx: number }> = ({ x, y, rx, ink }) => (
  <g><ellipse cx={x + 6} cy={y + 12} rx={rx} ry={rx * 0.42} fill="rgba(0,0,0,0.2)" /><ellipse cx={x} cy={y} rx={rx} ry={rx * 0.42} fill="#FBF8F2" {...sk({ ink }, 3)} /><ellipse cx={x} cy={y} rx={rx * 0.78} ry={rx * 0.32} fill="none" stroke="#7C9A6E" strokeWidth={3} opacity={0.7} /></g>
);
const Bin: React.FC<St & { x: number; y: number }> = ({ x, y, ink }) => (
  <g transform={`translate(${x} ${y})`}><path d="M -60 -40 L 60 -40 L 48 80 L -48 80 Z" fill="#6E7378" {...sk({ ink }, 3)} /><rect x={-70} y={-52} width={140} height={16} rx={6} fill="#868B90" {...sk({ ink }, 2)} />
    {[-24, 0, 24].map((xx) => <rect key={xx} x={xx - 3} y={-24} width={6} height={90} rx={3} fill="rgba(0,0,0,0.25)" />)}</g>
);
const Foil: React.FC<St & { x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g><path d={`M ${x} ${y + 40} L ${x + w * 0.12} ${y} L ${x + w * 0.3} ${y + 16} L ${x + w * 0.5} ${y - 10} L ${x + w * 0.7} ${y + 14} L ${x + w * 0.88} ${y - 4} L ${x + w} ${y + 40} Z`} fill="#D6DBDF" stroke="#9AA3AA" strokeWidth={2} />
    <path d={`M ${x + w * 0.2} ${y + 20} L ${x + w * 0.45} ${y + 5}`} stroke="#fff" strokeWidth={4} opacity={0.8} /></g>
);
const Table: React.FC<St & { x: number; y: number }> = ({ x, y, ink }) => (
  <g transform={`translate(${x} ${y})`}><rect x={-190} y={-20} width={380} height={120} rx={14} fill="#F4EBDD" {...sk({ ink }, 2)} />
    {[-130, -45, 45, 130].map((xx) => <g key={xx}><ellipse cx={xx} cy={20} rx={34} ry={14} fill="#FFFFFF" stroke="#7C9A6E" strokeWidth={2} /><ellipse cx={xx} cy={18} rx={16} ry={6} fill="#E7A57E" /></g>)}
    {[-130, -45, 45, 130].map((xx) => <g key={"b" + xx}><ellipse cx={xx} cy={74} rx={34} ry={14} fill="#FFFFFF" stroke="#7C9A6E" strokeWidth={2} /><ellipse cx={xx} cy={72} rx={16} ry={6} fill="#E7A57E" /></g>)}</g>
);

// escena según las palabras de la clave de la foto que reemplaza
const scene = (k: string, s: St, f: number, id: string): { bg: string; sepia?: boolean; el: React.ReactNode } => {
  const has = (...w: string[]) => w.some((x) => k.includes(x));
  const warm = "radial-gradient(ellipse 70% 60% at 50% 40%, #FFF6E6, #F0DFC4)", cool = "radial-gradient(ellipse 70% 60% at 50% 40%, #F4F8FA, #D9E3E8)", wood = "linear-gradient(180deg,#C99B6B,#A97B4E)";
  const old = has("old_");
  if (has("counter_lean", "counter_wave", "warm_ham", "father")) return { bg: warm, sepia: old, el: <><Butcher {...s} x={200} y={150} wave={f / 7} />{has("ham") ? <Ham {...s} id={id} x={300} y={200} s={0.5} /> : null}{has("turkey") ? <Turkey {...s} id={id} x={300} y={205} s={0.42} /> : null}</> };
  if (has("old_shop", "turkey_line")) return { bg: "linear-gradient(180deg,#d9e2e6,#b9c4c8)", sepia: true, el: <Store {...s} x={has("line") ? 160 : 200} y={140} line={has("line")} /> };
  if (has("dial_scale")) return { bg: cool, el: <><rect x={110} y={150} width={180} height={60} rx={10} fill="#E8E2D6" /><circle cx={200} cy={110} r={70} fill="#FBFBF7" stroke="#2B2B2B" strokeWidth={8} /><path d={`M 200 110 L ${200 + 55 * Math.sin(f / 30)} ${110 - 55 * Math.cos(f / 30)}`} stroke="#8C1D2F" strokeWidth={5} /><Ham {...s} id={id} x={200} y={150} s={0.45} /></> };
  if (has("oven_knob", "oven_rack")) return { bg: cool, el: <Oven {...s} x={200} y={130} hot={0.5 + 0.3 * Math.sin(f / 20)} /> };
  if (has("thermo", "probe")) return { bg: wood, el: <>{has("turkey") ? <><Board {...s} x={30} y={150} w={340} h={100} /><Turkey {...s} id={id} x={200} y={130} s={1.05} /></> : <><Board {...s} x={40} y={150} w={320} h={100} /><Ham {...s} id={id} x={200} y={140} s={1.1} /></>}<Thermo {...s} x={has("turkey") ? 300 : 250} y={60} v={has("turkey") ? "160" : "140"} /></> };
  if (has("ham_pack", "turkey_label")) return { bg: cool, el: <Pack {...s} x={60} y={40} w={280} h={190} tag={has("turkey") ? "WHOLE TURKEY" : "HAM · WATER ADDED"} accent={has("turkey") ? "#D9772B" : "#9E1F2A"} /> };
  if (has("popup")) return { bg: warm, el: <><Pan {...s} x={60} y={170} w={280} /><Turkey {...s} id={id} x={200} y={150} s={1} pop={0.5 + 0.5 * Math.sin(f / 10)} /></> };
  if (has("ice_bags")) return { bg: cool, el: <><Pan {...s} x={60} y={175} w={280} /><Turkey {...s} id={id} x={200} y={150} s={1} raw /><IceBag {...s} x={165} y={95} r={-8} /><IceBag {...s} x={245} y={98} r={7} /></> };
  if (has("kosher_salt")) return { bg: wood, el: <><SaltBox {...s} x={140} y={130} /><Turkey {...s} id={id} x={290} y={170} s={0.55} raw /></> };
  if (has("fridge")) return { bg: cool, el: <><Fridge {...s} x={200} y={130} /><Pan {...s} x={110} y={100} w={180} /><Turkey {...s} id={id} x={200} y={86} s={0.55} raw /></> };
  if (has("drippings")) return { bg: warm, el: <><Cup {...s} x={150} y={130} /><Bowl {...s} x={290} y={170} fill="#8A4A1E" /></> };
  if (has("breast_trash")) return { bg: cool, el: <><Bin {...s} x={200} y={150} /><Slices {...s} x={200} y={100} n={5} s={0.8} /></> };
  if (has("legs_off", "breast_off", "breast_whole", "breast_slices")) return { bg: wood, el: <><Board {...s} x={30} y={70} w={340} h={170} />{has("slices") ? <Slices {...s} x={200} y={150} n={7} /> : has("legs") ? <><Turkey {...s} id={id} x={170} y={140} s={0.75} /><path d="M 270 120 L 330 180" stroke="#C9CED3" strokeWidth={10} strokeLinecap="round" /></> : <ellipse cx={200} cy={150} rx={110} ry={56} fill="#F1D7BE" stroke="#C9884E" strokeWidth={10} />}</> };
  if (has("platter", "fancy", "resting", "golden")) return { bg: warm, el: <><Plate {...s} x={200} y={175} rx={180} /><Turkey {...s} id={id} x={200} y={140} s={1} />{has("resting") ? <Foil {...s} x={80} y={60} w={240} /> : null}</> };
  if (has("glaze_bowl", "scrape_glaze")) return { bg: wood, el: <><Bowl {...s} x={140} y={150} fill="#A8521B" brush /><Ham {...s} id={id} x={290} y={160} s={0.6} glaze /></> };
  if (has("ham_soak", "pea_soup", "simmer")) return { bg: warm, el: <Pot {...s} x={200} y={150} f={f} soup={has("pea") ? "#9DB34A" : "#E7C8A0"} /> };
  if (has("juice_slices", "dry_ham")) return { bg: warm, el: <><Plate {...s} x={200} y={170} rx={170} /><Slices {...s} x={200} y={150} n={6} color={has("dry") ? "#E8C9A9" : "#F0B49A"} /></> };
  if (has("foil")) return { bg: cool, el: <><Pan {...s} x={70} y={160} w={260} /><Ham {...s} id={id} x={200} y={140} s={0.9} /><Foil {...s} x={70} y={70} w={260} /></> };
  if (has("plates_table")) return { bg: wood, el: <Table {...s} x={200} y={120} /> };
  if (has("big_pan", "snug_pan")) return { bg: cool, el: <><Pan {...s} x={has("big") ? 30 : 100} y={160} w={has("big") ? 340 : 200} /><Ham {...s} id={id} x={200} y={145} s={0.8} /></> };
  if (has("scored")) return { bg: wood, el: <><Board {...s} x={30} y={150} w={340} h={100} /><Ham {...s} id={id} x={200} y={135} s={1.4} scored /></> };
  if (has("spiral")) return { bg: warm, el: <><Plate {...s} x={200} y={185} rx={170} /><Ham {...s} id={id} x={200} y={140} s={1.2} spiral /></> };
  if (has("glazed", "ham_rest", "cut_face", "counter_ham", "half_ham", "bone_ham", "city_ham", "ham")) return { bg: has("paper", "counter") ? "linear-gradient(180deg,#F4EDE0,#E2D5BE)" : wood, el: <><Board {...s} x={30} y={150} w={340} h={100} /><Ham {...s} id={id} x={200} y={135} s={1.3} glaze={has("glazed")} /></> };
  if (has("turkey")) return { bg: warm, el: <Turkey {...s} id={id} x={200} y={130} s={1} /> };
  return { bg: warm, el: <Plate {...s} x={200} y={150} rx={150} /> };
};

export const Sketch: React.FC<{ k: string; w: number; h: number; f: number; style: "ink" | "flat" }> = ({ k, w, h, f, style }) => {
  const id = "s" + k.replace(/[^a-z0-9]/gi, "");
  const sc = scene(k, { ink: style === "ink" }, f, id);
  return (
    <div style={{ position: "absolute", inset: 0, background: sc.bg, filter: sc.sepia ? "sepia(0.75) contrast(0.95)" : undefined }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 4px)" }} />
      <svg width={w} height={h} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1.02 + 0.03 * Math.sin(f / 60)})` }}>{sc.el}</svg>
    </div>
  );
};
