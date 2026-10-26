import React from "react";
import { rnd } from "../soot/lib";
import { C, ent } from "./kit";

// Kit vikingo de soot12 — todo vector plano en código (cero imágenes). Mismo idioma que kit2: cada objeto centrado
// en (x, y), con t/t0 entra con rebote y con t1 sale. Paleta de noche: azules y violetas fríos + fuego cálido.
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; t1?: number; rot?: number; op?: number; flip?: boolean };
export const V = {
  noche0: "#0b0a24", noche1: "#16123d", noche2: "#241a5c", luna: "#fff4d6", pasto: "#1f3b4a", pasto2: "#173040", pasto3: "#10232f",
  tierra: "#3a2a4a", tierra2: "#2a1d38", barro: "#4a3326", rio: "#1d4f7a", rio2: "#2f78a8", madera: "#8a5a32", madera2: "#5e3a1e",
  vela1: "#d6283e", vela2: "#f4ead2", fuego: "#ffb020", fuego2: "#ff5a2a", piedra: "#8c86a8", piedra2: "#5e5880", plata: "#dfe6f2",
};
export const Obj: React.FC<Pos & { w: number; h: number; children: React.ReactNode }> = ({ x, y, s = 1, t = 0, t0, t1 = 1e9, rot = 0, op = 1, w, h, flip, children }) => {
  if (t0 !== undefined && t < t0) return null;
  if (t > t1 + 0.25) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  const out = t > t1 ? Math.max(0, 1 - (t - t1) / 0.2) : 1;
  return (
    <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - (h / 2) * s, overflow: "visible", opacity: op * out, transform: `scale(${(flip ? -1 : 1) * e * (0.8 + 0.2 * out)}, ${e * (0.8 + 0.2 * out)}) rotate(${rot + (1 - e) * -14}deg)` }} width={w * s} height={h * s} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
      {children}
    </svg>
  );
};
const Brillo: React.FC<{ d: string; w?: number; o?: number }> = ({ d, w = 10, o = 0.5 }) => <path d={d} stroke="#fff" strokeOpacity={o} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ── escudo redondo (Gokstad: mitades amarillo/negro) con umbo
export const ESCUDOS = [["#f2c230", "#1d1a2a"], ["#d6283e", "#f4ead2"], ["#2f78a8", "#f4ead2"], ["#1d1a2a", "#f2c230"], ["#3f9a5a", "#f4ead2"]];
export const EscudoR: React.FC<{ r?: number; k?: number; cx?: number; cy?: number }> = ({ r = 60, k = 0, cx = 0, cy = 0 }) => {
  const [a, b] = ESCUDOS[k % ESCUDOS.length];
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill={a} stroke="#2a1530" strokeWidth={r * 0.1} />
      {k % 2 === 0 ? <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`} fill={b} /> : [0, 1, 2, 3].map((i) => <path key={i} d={`M 0 0 L ${r * Math.cos(i * 1.57)} ${r * Math.sin(i * 1.57)} A ${r} ${r} 0 0 1 ${r * Math.cos(i * 1.57 + 0.785)} ${r * Math.sin(i * 1.57 + 0.785)} Z`} fill={b} />)}
      <circle r={r * 0.28} fill="#b9c2cf" stroke="#2a1530" strokeWidth={r * 0.06} />
      <circle r={r} fill="none" stroke="#2a1530" strokeWidth={r * 0.1} />
    </g>
  );
};
export const Escudo: React.FC<Pos & { k?: number }> = ({ k = 0, ...p }) => (
  <Obj {...p} w={200} h={200}><EscudoR r={88} k={k} /><Brillo d="M -50 -54 Q -20 -76 16 -76" /></Obj>
);

// ── drakkar: casco curvo de tingladillo, proa de dragón, fila de escudos, mástil y vela a rayas, remos
export const Drakkar: React.FC<Pos & { vela?: number; remos?: number; escudos?: boolean; quema?: number; varado?: boolean }> = ({ vela = 0, remos = 0, escudos = true, quema = 0, varado, ...p }) => {
  const t = p.t ?? 0;
  const mece = varado ? 0 : Math.sin(t * 1.3 + p.x * 0.01) * 2;
  const sube = varado ? 0 : Math.sin(t * 1.1 + p.x * 0.01) * 6;
  return (
    <Obj {...p} w={1100} h={720}>
      <g transform={`translate(0 ${sube}) rotate(${mece})`}>
        {/* mástil y vela */}
        {vela > 0 && (
          <g>
            <rect x={-10} y={-330} width={20} height={400} fill={V.madera2} />
            <rect x={-200 * vela} y={-310} width={400 * vela} height={16} rx={8} fill={V.madera2} />
            <path d={`M ${-190 * vela} -300 L ${190 * vela} -300 Q ${210 * vela} -120 ${180 * vela} 20 L ${-180 * vela} 20 Q ${-210 * vela} -120 ${-190 * vela} -300 Z`} fill={V.vela2} />
            {[-3, -1, 1, 3].map((i) => <path key={i} d={`M ${(i * 38 - 19) * vela} -300 L ${(i * 38 + 19) * vela} -300 L ${(i * 44 + 22) * vela} 20 L ${(i * 44 - 22) * vela} 20 Z`} fill={V.vela1} />)}
            <path d={`M ${-190 * vela} -300 L ${190 * vela} -300`} stroke={V.madera2} strokeWidth={8} />
          </g>
        )}
        {/* remos */}
        {remos > 0 && Array.from({ length: 9 }, (_, i) => {
          const a = Math.sin(t * remos * 3 + i * 0.2) * 14;
          return <line key={i} x1={-300 + i * 75} y1={70} x2={-300 + i * 75 - 40 + a * 2} y2={230} stroke="#6b4426" strokeWidth={9} strokeLinecap="round" />;
        })}
        {/* casco */}
        <path d="M -470 -60 Q -440 40 -330 90 Q 0 150 330 90 Q 440 40 470 -60 Q 400 30 300 40 L -300 40 Q -400 30 -470 -60 Z" fill={V.madera} stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${-440 + i * 20} ${-20 + i * 30} Q 0 ${110 + i * 10} ${440 - i * 20} ${-20 + i * 30}`} stroke={V.madera2} strokeWidth={6} fill="none" />)}
        <path d="M -300 40 L 300 40" stroke="#2a1530" strokeWidth={10} />
        {/* proa: cuello de dragón con cabeza, mandíbula abierta, dientes, cresta y ojo que brilla */}
        <path d="M 440 -30 Q 520 -120 510 -230 Q 505 -300 560 -330 L 600 -300 Q 560 -280 560 -220 Q 570 -120 480 -10 Z" fill={V.madera} stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${505 - i * 4} ${-150 - i * 40} l -40 -14 l 34 -22 Z`} fill={V.madera2} stroke="#2a1530" strokeWidth={5} strokeLinejoin="round" />)}
        <path d="M 540 -340 Q 600 -390 680 -372 L 700 -352 L 640 -344 L 690 -322 L 676 -300 Q 610 -300 570 -296 Z" fill={V.madera} stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
        <path d="M 572 -296 Q 620 -268 676 -276 L 668 -256 Q 610 -250 560 -276 Z" fill={V.madera} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
        {[600, 624, 648].map((tx) => <path key={tx} d={`M ${tx} -340 l 8 14 l 8 -14`} fill="#f4ead2" />)}
        {[606, 630].map((tx) => <path key={tx} d={`M ${tx} -278 l 8 -12 l 8 12`} fill="#f4ead2" />)}
        <path d="M 560 -350 L 520 -400 L 576 -362 Z M 548 -340 L 500 -372 L 556 -348 Z" fill={V.madera2} stroke="#2a1530" strokeWidth={5} />
        <circle cx={590} cy={-354} r={12} fill="#ffcc4a" />
        <circle cx={590} cy={-354} r={26} fill="#ffcc4a" opacity={0.25 + 0.15 * Math.sin(t * 4)} />
        <circle cx={593} cy={-354} r={4} fill="#2a1530" />
        {/* popa: voluta */}
        <path d="M -455 -40 Q -520 -150 -490 -230 Q -470 -270 -440 -250 Q -420 -230 -450 -210 Q -470 -190 -458 -170" stroke="#2a1530" strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d="M -455 -40 Q -520 -150 -490 -230 Q -470 -270 -440 -250 Q -420 -230 -450 -210 Q -470 -190 -458 -170" stroke={V.madera} strokeWidth={20} fill="none" strokeLinecap="round" />
        {/* escudos en la borda */}
        {escudos && Array.from({ length: 11 }, (_, i) => <EscudoR key={i} cx={-330 + i * 66} cy={16} r={30} k={i} />)}
        <Brillo d="M -380 -10 Q 0 60 380 -10" w={6} o={0.25} />
        {/* fuego */}
        {quema > 0 && <Llamas t={t} x={0} y={0} s={quema} ancho={700} />}
      </g>
    </Obj>
  );
};

// ── llamas animadas (para fogatas, techos y barcos que arden)
export const Llamas: React.FC<{ t: number; x: number; y: number; s?: number; ancho?: number; seed?: number }> = ({ t, x, y, s = 1, ancho = 120, seed = 1 }) => {
  const n = Math.max(3, Math.round(ancho / 40));
  const r = rnd(seed * 13 + Math.round(ancho));
  const fs = Array.from({ length: n }, () => [r(), r(), r()]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {fs.map(([a, b, c], i) => {
        const fx = -ancho / 2 + (i + 0.5) * (ancho / n);
        const h = 60 + a * 70 + Math.sin(t * (9 + b * 5) + i) * 18;
        const w = (ancho / n) * 0.9;
        const sw = Math.sin(t * 7 + c * 6) * 10;
        return (
          <g key={i}>
            <path d={`M ${fx - w / 2} 0 Q ${fx - w / 2} ${-h * 0.6} ${fx + sw} ${-h} Q ${fx + w / 2} ${-h * 0.6} ${fx + w / 2} 0 Z`} fill={V.fuego2} />
            <path d={`M ${fx - w / 3} 0 Q ${fx - w / 3} ${-h * 0.45} ${fx + sw * 0.6} ${-h * 0.72} Q ${fx + w / 3} ${-h * 0.45} ${fx + w / 3} 0 Z`} fill={V.fuego} />
            <path d={`M ${fx - w / 6} 0 Q ${fx - w / 6} ${-h * 0.3} ${fx + sw * 0.3} ${-h * 0.42} Q ${fx + w / 6} ${-h * 0.3} ${fx + w / 6} 0 Z`} fill="#fff3b0" />
          </g>
        );
      })}
    </g>
  );
};
// ── fogata con halo
export const Fogata: React.FC<Pos & { brasa?: boolean }> = ({ brasa, ...p }) => (
  <Obj {...p} w={400} h={400}>
    <defs><radialGradient id={`fg${p.x}`}><stop offset="0" stopColor="#ffb347" stopOpacity={0.55} /><stop offset="1" stopColor="#ff7a3d" stopOpacity={0} /></radialGradient></defs>
    <circle cx={0} cy={60} r={190 + Math.sin((p.t ?? 0) * 6) * 8} fill={`url(#fg${p.x})`} />
    {!brasa && <Llamas t={p.t ?? 0} x={0} y={110} s={1} ancho={110} seed={Math.round(p.x)} />}
    {brasa && [0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={104} r={12} fill={V.fuego2} opacity={0.6 + 0.4 * Math.sin((p.t ?? 0) * 3 + i)} />)}
    <rect x={-70} y={100} width={140} height={22} rx={11} fill={V.madera2} transform="rotate(14 0 111)" />
    <rect x={-70} y={100} width={140} height={22} rx={11} fill={V.madera} transform="rotate(-14 0 111)" />
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-80 + i * 32} cy={128} r={16} fill="#6e6a8a" />)}
  </Obj>
);

// ── tienda vikinga en A (como las de Gokstad): tablas cruzadas con cabezas talladas
export const Tienda: React.FC<Pos & { luz?: boolean; k?: number }> = ({ luz, k = 0, ...p }) => {
  const tela = ["#c9b48a", "#b89e72", "#d6c49a"][k % 3], raya = ["#a8432e", "#2f5e8a", "#5a7a3a"][k % 3];
  return (
    <Obj {...p} w={520} h={460}>
      <path d="M -220 180 L 0 -120 L 220 180 Z" fill={tela} stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
      <path d="M -150 180 L 0 -30 L 150 180" fill="none" stroke={raya} strokeWidth={26} />
      <path d="M -60 180 Q 0 40 60 180 Z" fill={luz ? "#ffcf6a" : "#1d1430"} />
      {luz && <path d="M -60 180 Q 0 40 60 180 Z" fill="#ff9a3d" opacity={0.4 + 0.2 * Math.sin((p.t ?? 0) * 7)} />}
      {/* tablas cruzadas con dragones */}
      <path d="M -30 -100 L 60 -200 Q 80 -214 92 -196 L 70 -186 L 10 -110" fill={V.madera} stroke="#2a1530" strokeWidth={8} />
      <path d="M 30 -100 L -60 -200 Q -80 -214 -92 -196 L -70 -186 L -10 -110" fill={V.madera} stroke="#2a1530" strokeWidth={8} />
      <circle cx={78} cy={-198} r={4} fill="#ffcc4a" /><circle cx={-78} cy={-198} r={4} fill="#ffcc4a" />
      <Brillo d="M -160 120 L -20 -80" w={8} o={0.3} />
    </Obj>
  );
};

// ── perro (lobero): duerme enroscado / alerta / ladra
export const Perro: React.FC<Pos & { modo?: "duerme" | "alerta" | "ladra" | "aulla"; color?: string }> = ({ modo = "alerta", color = "#7a6a62", ...p }) => {
  const t = p.t ?? 0;
  const osc = "#4e423c";
  if (modo === "duerme")
    return (
      <Obj {...p} w={360} h={240}>
        <ellipse cx={0} cy={60} rx={150} ry={64} fill={color} stroke="#2a1530" strokeWidth={8} />
        <ellipse cx={0} cy={60 + Math.sin(t * 2) * 2} rx={150} ry={64} fill="none" />
        <path d="M 110 40 Q 170 30 160 80 Q 120 100 90 80 Z" fill={color} stroke="#2a1530" strokeWidth={8} />
        <path d="M 120 34 L 108 4 L 138 30 Z" fill={osc} />
        <path d="M 128 64 Q 140 70 152 64" stroke="#2a1530" strokeWidth={5} fill="none" />
        <path d="M -150 70 Q -170 120 -100 118" stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" />
      </Obj>
    );
  const ladra = modo === "ladra" && Math.sin(t * 9) > 0;
  const aulla = modo === "aulla";
  const cola = Math.sin(t * (modo === "alerta" ? 3 : 10)) * 12;
  const boca = ladra || aulla ? 1 : 0;
  // perro de presa de perfil (mira a +x): pecho hondo, cintura recogida, patas con garrón, hocico largo y oreja caída
  return (
    <Obj {...p} w={420} h={340}>
      <path d={`M -150 -14 Q -190 ${-60 + cola} -176 ${-112 + cola}`} stroke={color} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d={`M -150 -14 Q -190 ${-60 + cola} -176 ${-112 + cola}`} stroke="#2a1530" strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.0} />
      {/* patas de atrás (la lejana más oscura) */}
      <path d="M -70 10 Q -96 60 -70 84 L -78 128" stroke={osc} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 70 20 L 74 128" stroke={osc} strokeWidth={24} strokeLinecap="round" />
      {/* cuerpo */}
      <path d="M -152 -8 Q -150 -62 -90 -62 L 70 -68 Q 126 -70 146 -36 Q 162 4 132 42 Q 70 36 10 22 Q -70 40 -128 34 Q -164 22 -152 -8 Z" fill={color} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
      <path d="M -120 -48 Q -20 -64 90 -58" stroke="#fff" strokeOpacity={0.18} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M 40 10 Q 90 30 130 30" stroke="#2a1530" strokeOpacity={0.25} strokeWidth={8} fill="none" />
      {/* patas de adelante: muslo con garrón atrás, recta adelante */}
      <path d="M -112 0 Q -150 56 -114 84 L -122 128" stroke={color} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -112 0 Q -150 56 -114 84 L -122 128" stroke="#2a1530" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.35} />
      <path d="M 108 26 L 112 128" stroke={color} strokeWidth={28} strokeLinecap="round" />
      {[[-124, 132, color], [-80, 132, osc], [76, 132, osc], [114, 132, color]].map(([x, y, c], i) => <ellipse key={i} cx={(x as number) + 8} cy={y as number} rx={22} ry={10} fill={c as string} stroke="#2a1530" strokeWidth={5} />)}
      {/* cuello y cabeza */}
      <path d="M 96 -52 Q 120 -112 166 -128 L 196 -98 Q 160 -70 146 -24 Z" fill={color} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
      <g transform={`translate(182 -128) rotate(${aulla ? -38 : ladra ? -6 : 0})`}>
        <ellipse cx={0} cy={0} rx={48} ry={42} fill={color} stroke="#2a1530" strokeWidth={8} />
        <path d={`M 26 -24 Q 70 -26 104 -8 Q 112 4 104 12 L 30 ${18 - boca * 4} Z`} fill={color} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
        <g transform={`rotate(${boca * 22} 30 14)`}>
          <path d="M 30 14 L 96 14 Q 98 30 84 32 L 34 34 Z" fill={color} stroke="#2a1530" strokeWidth={7} strokeLinejoin="round" />
          {boca > 0 && [44, 60, 76].map((tx) => <path key={tx} d={`M ${tx} 15 l 5 -9 l 5 9`} fill="#fff" stroke="#2a1530" strokeWidth={2} />)}
        </g>
        {boca > 0 && <path d="M 32 10 L 98 8 L 92 18 L 34 18 Z" fill="#7a1a2a" />}
        {boca > 0 && [48, 66, 82].map((tx) => <path key={tx} d={`M ${tx} 10 l 5 9 l 5 -9`} fill="#fff" stroke="#2a1530" strokeWidth={2} />)}
        <ellipse cx={104} cy={-6} rx={12} ry={10} fill="#1d1430" />
        <circle cx={100} cy={-10} r={3} fill="#fff" opacity={0.6} />
        <ellipse cx={22} cy={-14} rx={11} ry={10} fill="#fff" stroke="#2a1530" strokeWidth={3} />
        <circle cx={25} cy={-13} r={6} fill="#1d1430" />
        {modo !== "alerta" && <path d="M 6 -32 L 40 -26" stroke="#2a1530" strokeWidth={7} strokeLinecap="round" />}
        <path d="M -16 -36 Q -54 -30 -50 18 Q -34 22 -14 -6 Z" fill={osc} stroke="#2a1530" strokeWidth={7} strokeLinejoin="round" />
      </g>
      {ladra && [0, 1, 2].map((i) => <path key={i} d={`M ${310 + i * 26} ${-170 - i * 10} Q ${330 + i * 26} -140 ${310 + i * 26} ${-110 + i * 10}`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    </Obj>
  );
};

// ── iglesia sajona de piedra (St Wystan, Repton) con torre
export const Iglesia: React.FC<Pos & { arde?: number }> = ({ arde = 0, ...p }) => (
  <Obj {...p} w={720} h={720}>
    <rect x={-300} y={20} width={420} height={300} fill={V.piedra} stroke="#2a1530" strokeWidth={10} />
    <path d="M -320 30 L -90 -130 L 140 30 Z" fill="#5a4a6a" stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
    <rect x={120} y={-200} width={170} height={520} fill={V.piedra} stroke="#2a1530" strokeWidth={10} />
    <path d="M 110 -200 L 205 -320 L 300 -200 Z" fill="#5a4a6a" stroke="#2a1530" strokeWidth={10} strokeLinejoin="round" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-290 + (i % 7) * 60} y={60 + Math.floor(i / 7) * 120 + (i % 2) * 20} width={44} height={16} rx={4} fill={V.piedra2} opacity={0.6} />)}
    {[-230, -90, 40].map((wx) => <path key={wx} d={`M ${wx - 18} 150 L ${wx - 18} 110 Q ${wx} 86 ${wx + 18} 110 L ${wx + 18} 150 Z`} fill={arde ? "#ffcf6a" : "#1d1430"} />)}
    <path d="M 175 -90 L 175 -130 Q 205 -160 235 -130 L 235 -90 Z" fill="#1d1430" />
    <path d="M 160 320 L 160 210 Q 205 160 250 210 L 250 320 Z" fill="#2a1d38" stroke="#2a1530" strokeWidth={8} />
    <rect x={196} y={-370} width={18} height={60} fill="#3b2a4a" /><rect x={180} y={-352} width={50} height={14} fill="#3b2a4a" />
    {arde > 0 && <Llamas t={p.t ?? 0} x={-90} y={30} s={arde * 1.6} ancho={360} seed={7} />}
    {arde > 0 && <Llamas t={p.t ?? 0} x={205} y={-180} s={arde * 1.3} ancho={160} seed={9} />}
  </Obj>
);

// ── empalizada de troncos con punta
export const Empalizada: React.FC<{ x: number; y: number; n: number; h?: number; paso?: number; seed?: number }> = ({ x, y, n, h = 170, paso = 46, seed = 3 }) => {
  const r = rnd(seed);
  return (
    <svg style={{ position: "absolute", left: x, top: y - h - 40, overflow: "visible" }} width={n * paso} height={h + 40}>
      {Array.from({ length: n }, (_, i) => {
        const hh = h - r() * 26;
        const bx = i * paso;
        return (
          <g key={i}>
            <path d={`M ${bx} ${h + 40} L ${bx} ${h + 40 - hh} L ${bx + paso / 2} ${h + 40 - hh - 30} L ${bx + paso} ${h + 40 - hh} L ${bx + paso} ${h + 40} Z`} fill={i % 2 ? V.madera : "#7a4d2a"} stroke="#2a1530" strokeWidth={6} strokeLinejoin="round" />
            <line x1={bx + 12} y1={h + 30 - hh * 0.6} x2={bx + 12} y2={h + 30} stroke="#5e3a1e" strokeWidth={4} />
          </g>
        );
      })}
    </svg>
  );
};

// ── objetos chicos
export const Cuerno: React.FC<Pos> = (p) => (
  <Obj {...p} w={300} h={200}>
    <path d="M -120 -40 Q 0 -20 80 30 Q 120 60 130 20 L 120 -10 Q 60 10 -110 -70 Z" fill="#e8d7a8" stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
    {[-60, 0, 60].map((bx) => <path key={bx} d={`M ${bx} ${-40 + bx * 0.35} l 14 30`} stroke="#c9a24a" strokeWidth={10} />)}
    <ellipse cx={-116} cy={-56} rx={14} ry={22} fill="#3b2a1a" transform="rotate(30 -116 -56)" />
  </Obj>
);
export const Hacha: React.FC<Pos> = (p) => (
  <Obj {...p} w={200} h={520}>
    <rect x={-10} y={-220} width={20} height={460} rx={8} fill={V.madera} stroke="#2a1530" strokeWidth={6} />
    <path d="M 8 -210 Q 90 -250 110 -170 Q 120 -110 100 -60 Q 60 -110 8 -120 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
    <Brillo d="M 40 -200 Q 90 -200 98 -140" w={7} />
  </Obj>
);
export const Lanza: React.FC<Pos & { largo?: number }> = ({ largo = 600, ...p }) => (
  <Obj {...p} w={120} h={largo + 120}>
    <rect x={-8} y={-largo / 2 + 60} width={16} height={largo} rx={6} fill={V.madera} stroke="#2a1530" strokeWidth={5} />
    <path d={`M 0 ${-largo / 2 - 50} L 24 ${-largo / 2 + 30} L 0 ${-largo / 2 + 70} L -24 ${-largo / 2 + 30} Z`} fill="#c8d0dc" stroke="#2a1530" strokeWidth={6} />
  </Obj>
);
export const Antorcha: React.FC<Pos & { apagada?: boolean }> = ({ apagada, ...p }) => {
  // antorcha de verdad: palo largo, cabeza de trapo con brea atada con cuerda, llama grande con halo
  const t = p.t ?? 0;
  return (
    <Obj {...p} w={220} h={520}>
      {!apagada && <circle cx={0} cy={-150} r={120} fill="#ffb347" opacity={0.18 + Math.sin(t * 9) * 0.04} />}
      <path d="M -10 -40 L 10 -40 L 16 260 L -16 260 Z" fill={V.madera} stroke="#2a1530" strokeWidth={6} strokeLinejoin="round" />
      <path d="M -36 -110 Q -40 -60 -26 -30 L 26 -30 Q 40 -60 36 -110 Q 0 -124 -36 -110 Z" fill="#3a2418" stroke="#2a1530" strokeWidth={6} />
      {[-96, -74, -52].map((y) => <path key={y} d={`M -36 ${y} Q 0 ${y + 10} 36 ${y}`} stroke="#c9a66b" strokeWidth={6} fill="none" />)}
      {apagada
        ? [0, 1, 2].map((i) => <path key={i} d={`M ${-10 + i * 10} -116 Q ${-30 + i * 10} ${-170 - (t * 60 + i * 30) % 80} ${-6 + i * 10} -230`} stroke="#8a8aa0" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />)
        : <Llamas t={t} x={0} y={-112} s={1.5} ancho={80} seed={3} />}
    </Obj>
  );
};
export const Caballo: React.FC<Pos & { come?: boolean; color?: string }> = ({ come, color = "#8a5a3a", ...p }) => {
  // caballo de perfil: lomo largo, cuello arqueado, cabeza larga con hocico, crin, cola, patas finas con cascos
  const t = p.t ?? 0;
  const L = "#2a1530", osc = "#4a2a18";
  const cola = Math.sin(t * 2.4) * 8;
  const pata = (x: number, d: string, k: number) => (
    <g key={k} transform={`translate(${x} 30)`}>
      <path d={d} fill={k % 2 ? "#6e4428" : color} stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-14} y={170} width={30} height={20} rx={4} fill="#2a1a14" stroke={L} strokeWidth={4} />
    </g>
  );
  return (
    <Obj {...p} w={560} h={460}>
      <path d={`M -190 -40 Q -250 ${10 + cola} -240 ${120 + cola}`} stroke={osc} strokeWidth={34} fill="none" strokeLinecap="round" />
      {pata(-150, "M -26 0 Q -20 60 -12 100 L -14 172 L 16 172 L 14 96 Q 26 50 24 0 Z", 0)}
      {pata(-110, "M -22 0 Q -16 60 -10 100 L -12 172 L 16 172 L 14 96 Q 22 50 26 0 Z", 1)}
      {pata(110, "M -20 0 L -12 172 L 16 172 L 18 0 Z", 2)}
      {pata(150, "M -18 0 L -10 172 L 18 172 L 22 0 Z", 3)}
      <path d="M -200 -30 Q -210 -90 -120 -96 Q 0 -86 120 -96 Q 196 -96 200 -20 Q 196 50 120 56 Q 0 66 -130 56 Q -206 50 -200 -30 Z" fill={color} stroke={L} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -150 -70 Q 0 -60 150 -78" stroke="#fff" strokeOpacity={0.15} strokeWidth={14} fill="none" />
      <g transform={`translate(150 -60) rotate(${come ? 58 + Math.sin(t * 2) * 5 : Math.sin(t * 0.8) * 3})`}>
        <path d="M -30 30 Q 0 -60 40 -140 L 96 -126 Q 70 -40 50 30 Z" fill={color} stroke={L} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 30 -150 Q 70 -180 110 -160 L 196 -96 Q 210 -76 190 -64 L 166 -60 Q 120 -76 76 -100 Z" fill={color} stroke={L} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={192} cy={-80} rx={9} ry={6} fill={L} />
        <path d="M 170 -62 Q 184 -54 196 -64" stroke={L} strokeWidth={4} fill="none" />
        <circle cx={104} cy={-138} r={9} fill="#1d1430" /><circle cx={107} cy={-141} r={3} fill="#fff" />
        <path d="M 60 -160 L 54 -204 L 84 -164 Z" fill={color} stroke={L} strokeWidth={6} strokeLinejoin="round" />
        <path d="M 40 -150 Q 10 -110 -4 -40 Q -20 10 -30 30 Q -50 -20 -30 -80 Q -10 -130 40 -150 Z" fill={osc} />
      </g>
    </Obj>
  );
};
// plata cortada (hacksilver), pesas y fichas de juego (Torksey)
export const Plata: React.FC<Pos & { n?: number }> = ({ n = 9, ...p }) => {
  const r = rnd(n * 7);
  return (
    <Obj {...p} w={360} h={220}>
      {Array.from({ length: n }, (_, i) => {
        const x = -130 + r() * 260, y = 30 - r() * 60, a = r() * 180, k = Math.floor(r() * 3);
        return k === 0 ? <circle key={i} cx={x} cy={y} r={26} fill={V.plata} stroke="#5e6a80" strokeWidth={6} />
          : k === 1 ? <rect key={i} x={x - 30} y={y - 10} width={60} height={20} rx={6} fill={V.plata} stroke="#5e6a80" strokeWidth={5} transform={`rotate(${a} ${x} ${y})`} />
          : <path key={i} d={`M ${x - 26} ${y} Q ${x} ${y - 30} ${x + 26} ${y}`} stroke={V.plata} strokeWidth={14} fill="none" strokeLinecap="round" />;
      })}
    </Obj>
  );
};
export const Ficha: React.FC<Pos & { color?: string }> = ({ color = "#9aa6b8", ...p }) => (
  <Obj {...p} w={140} h={160}>
    <path d="M -50 60 Q -60 0 -20 -20 Q -40 -60 0 -70 Q 40 -60 20 -20 Q 60 0 50 60 Z" fill={color} stroke="#2a1530" strokeWidth={8} />
    <Brillo d="M -24 -40 Q -10 -60 6 -58" w={6} />
  </Obj>
);
export const Corona: React.FC<Pos> = (p) => (
  <Obj {...p} w={240} h={180}>
    <path d="M -100 60 L -110 -40 L -55 10 L 0 -60 L 55 10 L 110 -40 L 100 60 Z" fill={C.oro} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
    {[-55, 0, 55].map((cx, i) => <circle key={i} cx={cx} cy={36} r={12} fill={i === 1 ? C.rojo : C.teal} />)}
  </Obj>
);
export const Cruz: React.FC<Pos> = (p) => (
  <Obj {...p} w={200} h={280}>
    <rect x={-18} y={-120} width={36} height={240} rx={6} fill={C.oro} stroke="#2a1530" strokeWidth={6} />
    <rect x={-80} y={-60} width={160} height={36} rx={6} fill={C.oro} stroke="#2a1530" strokeWidth={6} />
  </Obj>
);
export const Runa: React.FC<Pos & { lineas?: string[] }> = ({ lineas = [], ...p }) => (
  <Obj {...p} w={520} h={720}>
    <path d="M -200 330 L -230 -200 Q -200 -330 0 -330 Q 200 -330 230 -200 L 200 330 Z" fill="#8c86a8" stroke="#2a1530" strokeWidth={12} />
    <path d="M -150 280 L -170 -180 Q -150 -270 0 -270 Q 150 -270 170 -180 L 150 280" fill="none" stroke={C.rojo} strokeWidth={22} strokeLinejoin="round" />
    {lineas.map((l, i) => <text key={i} x={0} y={-130 + i * 70} textAnchor="middle" fontSize={44} fontWeight={700} fill="#2a1530" fontFamily="Fredoka">{l}</text>)}
  </Obj>
);
// esqueleto acostado (fosa)
export const Esqueleto: React.FC<Pos> = (p) => {
  // esqueleto humano tendido (vista desde arriba): cráneo con mandíbula, columna, costillas, brazos, pelvis y piernas
  const H = "#efe6cf", L = "#2a1530";
  const hueso = (x1: number, y1: number, x2: number, y2: number, w = 13) => (
    <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={L} strokeWidth={w + 8} strokeLinecap="round" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={H} strokeWidth={w} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={w * 0.75} fill={H} stroke={L} strokeWidth={4} /><circle cx={x2} cy={y2} r={w * 0.75} fill={H} stroke={L} strokeWidth={4} /></g>
  );
  return (
    <Obj {...p} w={440} h={200}>
      {/* piernas */}
      {hueso(70, -16, 150, -24)}{hueso(150, -24, 220, -20)}{hueso(70, 16, 150, 26)}{hueso(150, 26, 220, 24)}
      <path d="M 218 -30 l 22 -4 l 4 12 l -24 4 Z M 218 18 l 24 2 l -2 12 l -24 -2 Z" fill={H} stroke={L} strokeWidth={4} />
      {/* pelvis */}
      <path d="M 40 -34 Q 90 -40 84 0 Q 90 40 40 34 Q 58 0 40 -34 Z" fill={H} stroke={L} strokeWidth={6} strokeLinejoin="round" />
      {/* columna */}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-118 + i * 18} y={-7} width={14} height={14} rx={4} fill={H} stroke={L} strokeWidth={4} />)}
      {/* costillas (caja torácica) */}
      <path d="M -120 -4 Q -100 -64 -40 -56 Q -10 -50 -6 -10 L -6 10 Q -10 50 -40 56 Q -100 64 -120 4 Z" fill="#2a1530" opacity={0.35} />
      {[-104, -84, -64, -44, -24].map((rx, i) => (
        <g key={rx}><path d={`M ${rx} -6 Q ${rx + 6} ${-52 + i * 3} ${rx + 30} ${-48 + i * 4}`} stroke={L} strokeWidth={14} fill="none" strokeLinecap="round" /><path d={`M ${rx} -6 Q ${rx + 6} ${-52 + i * 3} ${rx + 30} ${-48 + i * 4}`} stroke={H} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d={`M ${rx} 6 Q ${rx + 6} ${52 - i * 3} ${rx + 30} ${48 - i * 4}`} stroke={L} strokeWidth={14} fill="none" strokeLinecap="round" /><path d={`M ${rx} 6 Q ${rx + 6} ${52 - i * 3} ${rx + 30} ${48 - i * 4}`} stroke={H} strokeWidth={8} fill="none" strokeLinecap="round" /></g>
      ))}
      {/* brazos a los costados */}
      {hueso(-112, -50, -40, -78, 11)}{hueso(-40, -78, 30, -64, 10)}{hueso(-112, 50, -40, 78, 11)}{hueso(-40, 78, 30, 64, 10)}
      {[-1, 1].map((s) => <g key={s}>{[0, 1, 2, 3].map((k) => <line key={k} x1={34} y1={s * (64 - k * 4)} x2={52} y2={s * (60 - k * 7)} stroke={H} strokeWidth={5} strokeLinecap="round" />)}</g>)}
      {/* cráneo de frente con cuencas, nariz y dientes */}
      <path d="M -150 -46 Q -210 -46 -214 0 Q -210 46 -150 46 Q -132 30 -132 0 Q -132 -30 -150 -46 Z" fill={H} stroke={L} strokeWidth={6} />
      <path d="M -150 -30 Q -118 -24 -116 0 Q -118 24 -150 30" fill={H} stroke={L} strokeWidth={6} />
      <ellipse cx={-176} cy={-18} rx={14} ry={12} fill={L} /><ellipse cx={-176} cy={18} rx={14} ry={12} fill={L} />
      <path d="M -160 -5 l 10 5 l -10 5 Z" fill={L} />
      {[-12, -4, 4, 12].map((dy) => <line key={dy} x1={-140} y1={dy} x2={-126} y2={dy} stroke={L} strokeWidth={3} />)}
    </Obj>
  );
};
// pastel de Alfred (los panes que se queman)
export const Panes: React.FC<Pos & { quema?: number }> = ({ quema = 0, ...p }) => (
  <Obj {...p} w={360} h={200}>
    <rect x={-160} y={40} width={320} height={30} rx={12} fill="#3b3048" />
    {[-90, 0, 90].map((cx, i) => <ellipse key={i} cx={cx} cy={20} rx={46} ry={28} fill={quema > 0.5 ? "#2a1a14" : "#d99a4a"} stroke="#2a1530" strokeWidth={6} />)}
    {quema > 0 && [-90, 0, 90].map((cx, i) => <path key={i} d={`M ${cx} -10 Q ${cx - 20} -50 ${cx} -80 Q ${cx + 20} -110 ${cx} -140`} stroke="#6e6a8a" strokeWidth={14} fill="none" strokeLinecap="round" opacity={quema * 0.8} />)}
  </Obj>
);
// vikingo durmiendo en el suelo: manta con bulto, cabeza con barba, hacha al lado (respira)
export const Durmiente: React.FC<Pos & { manta?: string; barba?: string; pelo?: string; piel?: string; hacha?: boolean }> = ({ manta = "#3f6a9a", barba = "#d9a441", pelo = "#c9773a", piel = "#f2c4a0", hacha = true, ...p }) => {
  const t = p.t ?? 0;
  const resp = Math.sin(t * 1.8 + p.x * 0.01) * 4;
  return (
    <Obj {...p} w={420} h={200}>
      {hacha && <g transform="rotate(-6)"><rect x={-40} y={70} width={250} height={12} rx={6} fill={V.madera} stroke="#2a1530" strokeWidth={4} /><path d="M 196 60 Q 240 40 246 76 Q 248 104 230 116 Q 220 90 196 92 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} /></g>}
      <path d={`M -120 80 Q -110 ${-6 - resp} 0 ${-14 - resp} Q 120 ${-20 - resp} 170 30 Q 190 70 170 80 Z`} fill={manta} stroke="#2a1530" strokeWidth={8} strokeLinejoin="round" />
      <path d={`M -60 20 Q 40 ${0 - resp} 150 40`} stroke="#fff" strokeOpacity={0.18} strokeWidth={10} fill="none" />
      <ellipse cx={-150} cy={64} rx={60} ry={22} fill="#e8dcc0" stroke="#2a1530" strokeWidth={6} />
      <circle cx={-150} cy={30} r={46} fill={piel} stroke="#2a1530" strokeWidth={6} />
      <path d="M -196 24 Q -190 -26 -146 -18 Q -110 -14 -104 14 Q -130 -4 -160 0 Q -186 2 -196 24 Z" fill={pelo} />
      <path d="M -186 44 Q -150 100 -112 44 Q -130 58 -150 56 Q -170 58 -186 44 Z" fill={barba} />
      <path d="M -170 28 q 8 6 16 0 M -142 28 q 8 6 16 0" stroke="#2a1530" strokeWidth={4} fill="none" strokeLinecap="round" />
    </Obj>
  );
};
