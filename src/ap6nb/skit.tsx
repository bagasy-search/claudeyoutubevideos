// skit — el tiburón de Groenlandia y la foca dibujados por código (perfil, mira a la derecha, x,y = centro).
import React from "react";
export const ICE = "#bfe3f1", SLATE = "#3c4750", COLD = "#7fd1e8";
export const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const R = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const Shark: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; eyeGlow?: boolean; flip?: boolean; thread?: boolean; op?: number }> = ({ x, y, s = 1, t = 0, c = SLATE, eyeGlow, flip, thread, op = 1 }) => {
  const a = Math.sin(t * (2 * Math.PI) / 210) * 11;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={op}>
      <g transform={`translate(-290,3) rotate(${a})`}><path d="M6,-14 L-112,-98 L-82,-10 L-128,44 L8,18 Z" fill={c} /></g>
      <path d="M300,10 C290,-30 230,-62 120,-70 C20,-78 -120,-60 -240,-22 L-300,-10 L-300,14 C-200,46 -60,74 80,72 C200,70 280,50 300,10 Z" fill={c} />
      <path d="M296,20 C260,54 180,70 80,72 C-60,74 -200,46 -300,14 C-180,28 -40,44 100,40 C190,38 260,32 296,20 Z" fill="rgba(0,0,0,.22)" />
      <path d="M-20,-74 L-62,-114 L-92,-68 Z M-138,-50 L-174,-84 L-198,-40 Z M150,58 L92,130 L60,68 Z M-118,42 L-174,84 L-186,32 Z" fill={c} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${176 - i * 16},-22 q-8,22 0,44`} stroke="rgba(0,0,0,.35)" strokeWidth={3.5} fill="none" />)}
      {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${-240 + R(i, 2) * 440},${-50 + R(i, 3) * 90} l${14 + R(i, 4) * 26},${-6 + R(i, 5) * 12}`} stroke="rgba(226,232,236,.32)" strokeWidth={2.5} />)}
      {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={-250 + R(i, 6) * 470} cy={-56 + R(i, 7) * 90} r={3 + R(i, 8) * 5} fill="rgba(0,0,0,.2)" />)}
      <circle cx={238} cy={-14} r={eyeGlow ? 10 : 7} fill={eyeGlow ? "#dff5ff" : "#c9d6dc"} />
      {thread && <path d={`M238,-8 q${6 + Math.sin(t / 22) * 10},24 ${-6 + Math.sin(t / 18) * 12},52`} stroke="#ece4cf" strokeWidth={5} fill="none" strokeLinecap="round" />}
    </g>
  );
};
export const Seal: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; rot?: number; flip?: boolean; op?: number }> = ({ x, y, s = 1, t = 0, c = "#59636b", rot = 0, flip, op = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`} opacity={op}>
    <path d={`M-160,8 L-262,${-40 + Math.sin(t / 26) * 8} L-236,10 L-266,${58 + Math.sin(t / 26) * 8} Z`} fill={c} />
    <path d="M186,-12 C176,-58 128,-74 96,-66 C40,-92 -84,-74 -164,-18 C-186,-2 -186,20 -164,30 C-84,70 54,76 126,44 C164,36 196,20 186,-12 Z" fill={c} />
    <path d="M186,-12 C192,18 164,36 126,44 C54,76 -84,70 -164,30 C-90,44 40,50 110,26 C150,14 176,4 186,-12 Z" fill="rgba(255,255,255,.14)" />
    <path d={`M44,44 C40,74 ${14 + Math.sin(t / 30) * 6},108 -26,112 C-20,88 -14,62 -6,46 Z`} fill={c} />
    {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={-130 + R(i, 9) * 240} cy={-46 + R(i, 11) * 56} rx={5 + R(i, 12) * 8} ry={3 + R(i, 13) * 5} fill="rgba(0,0,0,.22)" />)}
    <circle cx={146} cy={-30} r={8} fill="#0c1216" /><circle cx={148} cy={-33} r={2.4} fill="#e6edf2" />
    <ellipse cx={186} cy={-8} rx={7} ry={5} fill="#0c1216" />
    {[-7, 2, 11].map((d, i) => <path key={i} d={`M176,${2 + i * 3} q24,${d * 0.4} 46,${d * 1.6}`} stroke="rgba(235,240,245,.7)" strokeWidth={2} fill="none" />)}
  </g>
);
