// arboles60 — personajes originales articulados (vector puro). Tito (el contador) y Luma (la que mira el cielo).
// Partes separadas: cuerpo, panza, cabeza, ojos, párpados, cejas, pico, alas, patas, cola, cresta, accesorios.
import React from "react";
import { C } from "./lib";

export type Mood = "neutral" | "happy" | "confused" | "surprised" | "worried";
export type Pose = {
  x: number; y: number; s?: number; face?: 1 | -1;
  turn?: number;          // 0 = frente, 0,5 = tres cuartos, 1 = perfil
  back?: boolean;         // de espaldas
  jy?: number;            // altura del salto (la sombra queda en el piso)
  sq?: number;            // aplastar/estirar (1 = normal; <1 aplasta, >1 estira; volumen constante)
  lean?: number;          // grados
  head?: number;          // giro de cabeza ±3-8°
  lx?: number; ly?: number; // mirada -1..1
  blink?: number;         // 0..1
  mood?: Mood;
  beak?: number;          // apertura 0..1
  wl?: number; wr?: number; // alas (grados; negativo = levantar)
  walk?: number | null;   // fase de caminata en radianes
  bob?: number;
  handR?: React.ReactNode; handL?: React.ReactNode; // accesorio en la punta del ala
  front?: React.ReactNode; // accesorio delante del cuerpo
};

type Spec = {
  id: string; body: string; shade: string; belly: string; wing: string; beakC: string; beakD: string; leg: string;
  bodyCy: number; bodyRx: number; bodyRy: number; headCy: number; headR: number; neckY: number;
  eyeDx: number; eyeY: number; eyeR: number; ring?: { r: number; color: string; stroke?: number; fill?: boolean };
  wingX: number; wingY: number; wingLen: number; beakY: number; crest: "leaves" | "star"; hipX: number;
};

const TITO: Spec = {
  id: "tito", body: C.teal, shade: "#14A3B4", belly: "#A6F3EF", wing: "#129BB0", beakC: C.orange, beakD: "#D9600C", leg: "#FF8A24",
  bodyCy: -92, bodyRx: 66, bodyRy: 74, headCy: -180, headR: 60, neckY: -140,
  eyeDx: 24, eyeY: -186, eyeR: 15, ring: { r: 21, color: C.ink, stroke: 6 },
  wingX: 60, wingY: -122, wingLen: 74, beakY: -162, crest: "leaves", hipX: 22,
};
const LUMA: Spec = {
  id: "luma", body: "#7A45C9", shade: "#5A2E9E", belly: "#BC9BF2", wing: "#4E2590", beakC: "#FF9F43", beakD: "#E0701C", leg: "#FF8A24",
  bodyCy: -96, bodyRx: 84, bodyRy: 80, headCy: -192, headR: 56, neckY: -150,
  eyeDx: 23, eyeY: -198, eyeR: 13, ring: { r: 19, color: C.yellow, fill: true },
  wingX: 78, wingY: -118, wingLen: 70, beakY: -176, crest: "star", hipX: 26,
};

const wingD = (L: number) => `M0 0 C ${L * 0.32} ${L * 0.08}, ${L * 0.36} ${L * 0.62}, ${L * 0.08} ${L} C ${-L * 0.12} ${L * 0.7}, ${-L * 0.16} ${L * 0.2}, 0 0 Z`;
const leafD = "M0 0 C 10 -10, 12 -30, 0 -46 C -12 -30, -10 -10, 0 0 Z";
const star5 = (r: number) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.45 : r; d += `${i ? "L" : "M"}${(Math.cos(a) * q).toFixed(1)} ${(Math.sin(a) * q).toFixed(1)}`; } return d + "Z"; };

const Eye: React.FC<{ sp: Spec; uid: string; cx: number; cy: number; sx: number; sgn: number; p: Pose }> = ({ sp, uid, cx, cy, sx, sgn, p }) => {
  const mood = p.mood || "neutral";
  const big = mood === "surprised" ? 1.16 : 1;
  const r = sp.eyeR * big;
  const lx = (p.lx || 0) * r * 0.42, ly = ((p.ly || 0) + (mood === "worried" ? 0.45 : 0)) * r * 0.42;
  const pr = r * (mood === "surprised" ? 0.38 : 0.5);
  // párpado superior (0..1) e inferior (0..1)
  let top = p.blink || 0, bot = 0, lidRot = 0;
  if (mood === "happy") bot = 0.62;
  if (mood === "worried") { top = Math.max(top, 0.28); lidRot = -sgn * 16; }
  if (mood === "confused" && sgn < 0) top = Math.max(top, 0.4);
  const cid = `${uid}-e${sgn}`;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${sx} 1)`}>
      <defs><clipPath id={cid}><circle cx={0} cy={0} r={r} /></clipPath></defs>
      {sp.ring && (sp.ring.fill
        ? <circle r={sp.ring.r * big} fill={sp.ring.color} />
        : <circle r={sp.ring.r * big} fill="none" stroke={sp.ring.color} strokeWidth={sp.ring.stroke} />)}
      <circle r={r} fill="#fff" />
      <g clipPath={`url(#${cid})`}>
        <circle cx={lx} cy={ly} r={pr} fill={C.ink} />
        <circle cx={lx + pr * 0.35} cy={ly - pr * 0.4} r={pr * 0.32} fill="#fff" />
        {top > 0 && <rect x={-r * 1.6} y={-r * 1.05} width={r * 3.2} height={2 * r * top + 0.5} fill={sp.body} transform={`rotate(${lidRot})`} />}
        {bot > 0 && <ellipse cx={0} cy={r * 1.45} rx={r * 1.5} ry={r * (0.45 + bot)} fill={sp.body} />}
      </g>
    </g>
  );
};

const Brow: React.FC<{ sp: Spec; cx: number; cy: number; sgn: number; mood: Mood; sx: number }> = ({ sp, cx, cy, sgn, mood, sx }) => {
  let a = 0, dy = 0;
  if (mood === "worried") a = sgn * 18;
  if (mood === "surprised") dy = -9;
  if (mood === "happy") dy = -4;
  if (mood === "confused") { if (sgn < 0) { a = 10; dy = 2; } else { a = -10; dy = -10; } }
  const r = (sp.ring ? sp.ring.r : sp.eyeR) + 9;
  return <rect x={-13} y={-3.5} width={26} height={7} rx={3.5} fill={sp.shade} transform={`translate(${cx} ${cy - r + dy}) rotate(${a}) scale(${sx} 1)`} />;
};

const Beak: React.FC<{ sp: Spec; x: number; y: number; turn: number; open: number; mood: Mood }> = ({ sp, x, y, turn, open, mood }) => {
  const o = Math.max(open, mood === "surprised" ? 0.75 : mood === "happy" ? 0.4 : 0);
  if (turn > 0.55) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <path d={`M-4 ${2 + o * 6} L26 ${4 + o * 7} L-4 ${10 + o * 12} Z`} fill={sp.beakD} />
        {o > 0.05 && <path d={`M-2 ${4} L18 ${5 + o * 4} L-2 ${8 + o * 9} Z`} fill="#5B1E3A" />}
        <path d="M-6 -9 L34 2 L-6 5 Z" fill={sp.beakC} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {o > 0.05 && <ellipse cx={0} cy={6 + o * 6} rx={9} ry={3 + o * 8} fill="#5B1E3A" />}
      <path d={`M-10 ${3 + o * 4} L10 ${3 + o * 4} L0 ${13 + o * 12} Z`} fill={sp.beakD} />
      <path d="M-15 -5 Q0 -11 15 -5 L0 11 Z" fill={sp.beakC} />
      {mood === "worried" && <rect x={-7} y={20} width={14} height={3} rx={1.5} fill={sp.shade} opacity={0.0} />}
    </g>
  );
};

const Crest: React.FC<{ sp: Spec; t: number; top: number }> = ({ sp, t, top }) => {
  if (sp.crest === "leaves") {
    const sway = Math.sin(t * 2.1) * 4;
    return (
      <g transform={`translate(0 ${top + 6})`}>
        <path d={leafD} fill={C.leaf2} transform={`rotate(${-28 + sway})`} />
        <path d={leafD} fill={C.leaf3} transform={`rotate(${22 + sway}) scale(0.9)`} />
        <path d="M0 0 L0 -18" stroke={C.leaf2} strokeWidth={4} strokeLinecap="round" transform={`rotate(${-28 + sway})`} />
      </g>
    );
  }
  const sway = Math.sin(t * 1.7) * 5;
  return (
    <g transform={`translate(0 ${top + 6}) rotate(${sway})`}>
      <path d="M0 0 C 4 -18, 18 -26, 24 -44" stroke={C.pink} strokeWidth={7} fill="none" strokeLinecap="round" />
      <g transform="translate(24 -50)"><circle r={15} fill={C.yellow} opacity={0.25} /><path d={star5(12)} fill={C.yellow} /></g>
    </g>
  );
};

export const Bird: React.FC<{ who: "tito" | "luma"; p: Pose; t: number; uid?: string }> = ({ who, p, t, uid }) => {
  const sp = who === "tito" ? TITO : LUMA;
  const id = uid || sp.id;
  const s = p.s ?? 1, face = p.face ?? 1, turn = p.turn ?? 0, sq = p.sq ?? 1, jy = p.jy ?? 0;
  const mood = p.mood || "neutral";
  const breath = Math.sin(t * 2.2) * 0.012;
  const w = p.walk;
  const walking = w !== null && w !== undefined;
  const bob = (p.bob || 0) + (walking ? -Math.abs(Math.sin(w!)) * 7 : 0);
  const legA = walking ? Math.sin(w!) * 26 : 0;
  const sh = 1 / (1 + jy / 300);
  // ojos y pico se corren con el giro
  const ex = (sgn: number) => sgn * sp.eyeDx * (1 - 0.5 * turn) + turn * 26;
  const esx = (sgn: number) => (sgn < 0 ? 1 - 0.55 * turn : 1 - 0.1 * turn);
  const showFar = turn < 0.82;
  const wingNear = (sgn: number) => (turn > 0.5 ? sgn > 0 : true);
  const WingG: React.FC<{ sgn: number }> = ({ sgn }) => {
    const ang = sgn > 0 ? (p.wr ?? 0) : (p.wl ?? 0);
    const wx = sgn * sp.wingX * (1 - 0.75 * turn) - turn * 14;
    return (
      <g transform={`translate(${wx} ${sp.wingY}) scale(${sgn} 1)`}>
        <g transform={`rotate(${ang})`}>
          <path d={wingD(sp.wingLen)} fill={sp.wing} />
          {sgn > 0 && p.handR && <g transform={`translate(${sp.wingLen * 0.1} ${sp.wingLen}) scale(${sgn} 1)`}>{p.handR}</g>}
          {sgn < 0 && p.handL && <g transform={`translate(${sp.wingLen * 0.1} ${sp.wingLen}) scale(${sgn} 1)`}>{p.handL}</g>}
        </g>
      </g>
    );
  };
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${s * face} ${s})`}>
      <ellipse cx={0} cy={2} rx={sp.bodyRx * 0.95 * sh} ry={12 * sh} fill="#000" opacity={0.22 * sh} />
      <g transform={`translate(0 ${-jy}) rotate(${p.lean || 0}) scale(${1 / Math.sqrt(sq)} ${sq})`}>
        {/* patas */}
        {[-1, 1].map((sg) => (
          <g key={sg} transform={`translate(${sg * sp.hipX * (1 - 0.5 * turn)} ${-24}) rotate(${sg * legA})`}>
            <line x1={0} y1={0} x2={0} y2={22} stroke={sp.leg} strokeWidth={9} strokeLinecap="round" />
            <ellipse cx={turn > 0.5 ? 8 : sg * 3} cy={23} rx={turn > 0.5 ? 14 : 11} ry={5} fill={sp.leg} />
          </g>
        ))}
        <g transform={`translate(0 ${bob}) scale(${1 - breath} ${1 + breath})`}>
          {/* cola */}
          {(turn > 0.3 || p.back) && <path d="M-40 -60 L-92 -86 L-80 -46 Z" fill={sp.shade} transform={p.back ? "translate(40 6) scale(0.8)" : ""} />}
          {/* ala lejana */}
          {!p.back && turn > 0.5 && <WingG sgn={-1} />}
          {/* cuerpo */}
          <ellipse cx={0} cy={sp.bodyCy} rx={sp.bodyRx} ry={sp.bodyRy} fill={sp.body} />
          <path d={`M${-sp.bodyRx} ${sp.bodyCy} A ${sp.bodyRx} ${sp.bodyRy} 0 0 0 ${sp.bodyRx} ${sp.bodyCy} A ${sp.bodyRx} ${sp.bodyRy * 0.55} 0 0 1 ${-sp.bodyRx} ${sp.bodyCy} Z`} fill={sp.shade} opacity={0.5} />
          {!p.back && <ellipse cx={turn * 36} cy={sp.bodyCy + 12} rx={sp.bodyRx * 0.64 * (1 - 0.42 * turn)} ry={sp.bodyRy * 0.66} fill={sp.belly} />}
          
          {/* alas cercanas */}
          {(p.back || turn <= 0.5) && <WingG sgn={-1} />}
          {p.front}
          {/* cabeza */}
          <g transform={`translate(0 ${sp.neckY}) rotate(${p.head || 0}) translate(0 ${-sp.neckY})`}>
            <circle cx={0} cy={sp.headCy} r={sp.headR} fill={sp.body} />
            <path d={`M${-sp.headR} ${sp.headCy} A ${sp.headR} ${sp.headR} 0 0 0 ${sp.headR} ${sp.headCy} A ${sp.headR} ${sp.headR * 0.4} 0 0 1 ${-sp.headR} ${sp.headCy} Z`} fill={sp.shade} opacity={0.35} />
            <Crest sp={sp} t={t} top={sp.headCy - sp.headR} />
            {!p.back && (
              <g>
                {/* mejillas */}
                <ellipse cx={ex(1) + 8} cy={sp.eyeY + 30} rx={10} ry={6} fill={C.pink} opacity={mood === "happy" ? 0.55 : 0.28} />
                {showFar && <ellipse cx={ex(-1) - 8 * (1 - turn)} cy={sp.eyeY + 30} rx={10 * (1 - 0.6 * turn)} ry={6} fill={C.pink} opacity={mood === "happy" ? 0.55 : 0.28} />}
                {showFar && <Eye sp={sp} uid={id} cx={ex(-1)} cy={sp.eyeY} sx={esx(-1)} sgn={-1} p={p} />}
                <Eye sp={sp} uid={id} cx={ex(1)} cy={sp.eyeY} sx={esx(1)} sgn={1} p={p} />
                {sp.ring && !sp.ring.fill && showFar && turn < 0.5 && <path d={`M${ex(-1) + sp.ring.r - 2} ${sp.eyeY - 2} Q${(ex(-1) + ex(1)) / 2} ${sp.eyeY - 9} ${ex(1) - sp.ring.r + 2} ${sp.eyeY - 2}`} stroke={C.ink} strokeWidth={5} fill="none" />}
                {showFar && <Brow sp={sp} cx={ex(-1)} cy={sp.eyeY} sgn={-1} mood={mood} sx={esx(-1)} />}
                <Brow sp={sp} cx={ex(1)} cy={sp.eyeY} sgn={1} mood={mood} sx={1} />
                <Beak sp={sp} x={turn * 44} y={sp.beakY} turn={turn} open={p.beak || 0} mood={mood} />
              </g>
            )}
          </g>
          {/* ala cercana derecha */}
          {(p.back || turn <= 0.5 || wingNear(1)) && <WingG sgn={1} />}
        </g>
      </g>
    </g>
  );
};

// ── accesorios ──
export const Clipboard: React.FC<{ ticks?: number; flip?: number }> = ({ ticks = 0, flip = 0 }) => (
  <g transform="rotate(-8) translate(-26 -10)">
    <rect x={0} y={0} width={52} height={66} rx={6} fill="#B5743A" />
    <rect x={5} y={7} width={42} height={55} rx={3} fill="#FFF7E8" />
    {flip > 0 && <rect x={5} y={7} width={42} height={55 * (1 - flip)} rx={3} fill="#FFE9C4" />}
    <rect x={16} y={-5} width={20} height={11} rx={3} fill="#5C6A80" />
    {Array.from({ length: 5 }, (_, i) => (
      <g key={i}>
        <rect x={20} y={15 + i * 9} width={22} height={3} rx={1.5} fill="#C9C2B4" />
        {i < ticks && <path d={`M9 ${16 + i * 9} l3 3 l5 -6`} stroke={C.leaf2} strokeWidth={2.6} fill="none" strokeLinecap="round" />}
      </g>
    ))}
  </g>
);

export const Tape: React.FC<{ len?: number }> = ({ len = 0 }) => (
  <g>
    <circle r={17} fill={C.yellow} />
    <circle r={6} fill="#C99A1E" />
    {len > 0 && <rect x={10} y={8} width={len} height={7} fill="#FFE27A" stroke="#C99A1E" strokeWidth={1} />}
  </g>
);

export const Telescope: React.FC<{ x: number; y: number; a: number; s?: number }> = ({ x, y, a, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={-70} x2={-34} y2={0} stroke="#3A2A6B" strokeWidth={7} strokeLinecap="round" />
    <line x1={0} y1={-70} x2={30} y2={0} stroke="#3A2A6B" strokeWidth={7} strokeLinecap="round" />
    <line x1={0} y1={-70} x2={0} y2={0} stroke="#2B1F55" strokeWidth={6} strokeLinecap="round" />
    <g transform={`translate(0 -76) rotate(${a})`}>
      <rect x={-48} y={-13} width={110} height={26} rx={12} fill={C.pink} />
      <rect x={52} y={-17} width={22} height={34} rx={8} fill="#C23383" />
      <rect x={-58} y={-8} width={14} height={16} rx={5} fill="#2B1F55" />
      <rect x={-10} y={-13} width={14} height={26} fill={C.yellow} opacity={0.9} />
      <circle r={8} fill="#2B1F55" />
    </g>
  </g>
);

// figura humana genérica geométrica (escala de comparación)
export const Person: React.FC<{ x: number; y: number; s?: number; color?: string; wave?: number }> = ({ x, y, s = 1, color = C.royal, wave = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={42} ry={8} fill="#000" opacity={0.2} />
    <rect x={-20} y={-80} width={16} height={80} rx={8} fill={C.ink} />
    <rect x={4} y={-80} width={16} height={80} rx={8} fill={C.ink} />
    <rect x={-32} y={-180} width={64} height={110} rx={28} fill={color} />
    <g transform={`translate(30 -165) rotate(${-20 - wave * 120})`}><rect x={-8} y={0} width={16} height={70} rx={8} fill={color} /></g>
    <g transform="translate(-30 -165) rotate(18)"><rect x={-8} y={0} width={16} height={70} rx={8} fill={color} /></g>
    <circle cx={0} cy={-218} r={34} fill="#F2B48C" />
    <path d="M-34 -222 Q-30 -258 0 -256 Q32 -258 34 -222 Q20 -238 0 -236 Q-18 -238 -34 -222 Z" fill="#2B1F55" />
    <circle cx={-11} cy={-216} r={4} fill={C.ink} /><circle cx={11} cy={-216} r={4} fill={C.ink} />
    <path d="M-9 -200 Q0 -193 9 -200" stroke={C.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);
