// lety01 · TRAMO 4 (277-346 s): SECRETO 2 · EL ARROZ APARTE — nunca directo a la leche → las recetas dicen "todo junto" → duro por
// dentro (la olla en corte) → por qué: el grano necesita AGUA, en la leche la grasa y el azúcar lo frenan → se pega al fondo →
// primero en agua: 1 taza (200 g) lavado + 1 L de agua, fuego medio 15 min → floreado → ahí y sólo ahí la leche → a granel $30/kg
// = $6 → nada de quebrado ni viejo (engrudo).
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M3_END, SecretoTitulo } from "./m3";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1], C = PT.corte;
const T = {
  num: at("secreto numero dos", 276), arroz: at("el arroz nunca", 278), directo: at("directo", 279), recetas: at("recetas", 283), junto: at("todo junto", 285),
  duro: at("arroz duro", 287), mira: at("mira lo que pasa", 289), grano: at("el grano de arroz", 290), agua: at("necesita agua", 292), grasa: at("grasa", 294), azucar: at("azucar", 295),
  lento: at("mas lento", 298), adentro: at("duro adentro", 299), pega: at("se pega al fondo", 301), primero: at("primero cocia", 304), taza: at("una taza", 306), g200: at("200", 308),
  lavado: at("lavado", 309), litro: at("un litro de agua", 310), medio: at("fuego medio", 311), min15: at("15", 313), gordito: at("gordito", 317), floreado: at("floreado", 319),
  ahi: at("ahi y solo ahi", 320), entra: at("entra la leche", 321), abierto: at("ya va abierto", 323), crema: at("volverlo crema", 327), blanco: at("blanco comun", 330),
  granel: at("granel", 332), p30: at("30 pesos", 333), p6: at("6 pesos", 337), caro: at("arroz caro", 338), quebrado: at("quebrado", 341), viejo: at("viejo", 341), engrudo: at("grudo", 345),
};
export const M4_END = at("secreto numero 3", 345) - 0.05;
const A = [AV(278.3), AV(295.1), AV(312.8), AV(328.5), AV(345.6)];

setKeys([
  { t: M3_END + 0.1, p: [VASOS[1][0] + 0.45, 1.75, -1.95], l: [VASOS[1][0] + 0.15, 1.55, -2.84], fov: 40 },
  { t: A[0][0], p: [VASOS[1][0] + 0.25, 1.68, -2.25], l: [VASOS[1][0], 1.56, -2.84], fov: 36 },
  { t: A[0][1], p: [C[0] + 0.9, 1.55, C[2] + 1.3], l: [C[0], 0.95, C[2]], fov: 44 },
  { t: T.duro + 0.4, p: [C[0] + 0.15, 1.2, C[2] + 0.75], l: [C[0], 0.95, C[2]], fov: 36, arc: 0.05 },
  { t: T.mira, p: [C[0] + 0.3, 1.3, C[2] + 0.95], l: [C[0], 0.95, C[2]], fov: 40 },
  { t: A[1][0], p: [C[0] + 0.5, 1.4, C[2] + 1.15], l: [C[0], 0.95, C[2]], fov: 44 },
  { t: A[1][1], p: [O[0] + 0.9, SY + 0.8, O[2] + 1.4], l: [O[0], SY - 0.05, O[2]], fov: 42 },
  { t: T.primero - 0.05, p: [O[0] + 0.7, SY + 0.6, O[2] + 1.15], l: [O[0], SY - 0.05, O[2]], fov: 40 },
  { t: T.ahi - 0.05, p: [O[0] + 0.8, SY + 0.75, O[2] + 1.3], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.abierto - 0.05, p: [O[0] + 0.55, SY + 0.55, O[2] + 1.0], l: [O[0], SY, O[2]], fov: 40, arc: -0.04 },
]);

const st = (t: number): WorldProps => ({
  t, steam: 1, vasos: VASOS.map((_, i) => (i <= 1 ? (i === 1 ? 1 : 0.45) : 0.2)),
  corte: t > A[0][1] - 0.1 && t < A[1][1] ? ei(t, A[0][1], T.duro - 0.2) : 0,
  corteGlow: [0, t > T.duro ? e(t, T.duro, T.duro + 0.4) : 0, 0],
  burnt: t > A[1][1] && t < T.primero ? e(t, T.pega - 0.4, T.pega + 0.6) * 0.7 : 0,
  smoke: t > A[1][1] && t < T.primero ? e(t, T.pega, T.pega + 0.8) * 0.6 : 0,
  cream: t > A[1][1] && t < T.primero ? 0.3 : t > T.ahi - 0.1 ? e(t, T.entra + 0.4, T.entra + 2.5) : 1,
  agua: t > T.ahi - 0.1 ? 1 - e(t, T.entra + 0.3, T.entra + 1.6) : 0,
  grains: t > T.ahi - 0.1 ? 1 - e(t, T.entra + 0.6, T.entra + 2.5) : t > A[1][1] && t < T.primero ? 0.6 : 0,
  drop: t > T.ahi - 0.1 ? { leche: Math.max(0, (t - T.entra + 0.3) / 1.6) } : {},
});
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// señal de tránsito: tazón de arroz → flecha → lechera, con el círculo rojo de prohibido
const Prohibido: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), d = e(t, a, a + 0.5), b = e(t, a + 0.45, a + 0.8);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, a - 0.2, 1))})` }}>
    <svg width={620} height={360} viewBox="-310 -180 620 360" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={175} fill="rgba(255,250,240,.94)" />
      <g transform="translate(-95 20)"><path d="M -70 -10 Q 0 80 70 -10 Z" fill="#c2552d" /><ellipse cy={-10} rx={70} ry={20} fill="#f6f1e4" />{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-50 + (i * 23) % 100} cy={-16 - (i % 3) * 6} rx={7} ry={3} fill="#e8e0cc" transform={`rotate(${i * 40} ${-50 + (i * 23) % 100} ${-16 - (i % 3) * 6})`} />)}</g>
      <path d={`M -20 0 L ${-20 + 80 * d} 0`} stroke={LT.tinta} strokeWidth={14} strokeLinecap="round" /><path d={`M ${50 * d + 10} -22 L ${50 * d + 40} 0 L ${50 * d + 10} 22`} stroke={LT.tinta} strokeWidth={14} fill="none" strokeLinecap="round" opacity={d} />
      <g transform="translate(110 10)"><path d="M -40 60 L -45 -40 Q -45 -70 -20 -75 L 25 -75 Q 45 -70 45 -40 L 40 60 Z" fill="#c9cdd0" /><rect x={-25} y={-95} width={50} height={22} rx={6} fill="#b0b5b9" /></g>
      <circle r={168} fill="none" stroke="#e23a2a" strokeWidth={30} strokeDasharray={1056} strokeDashoffset={1056 * (1 - b)} transform="rotate(-90)" />
      <path d="M -118 -118 L 118 118" stroke="#e23a2a" strokeWidth={30} strokeLinecap="round" opacity={b} />
    </svg>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: LT.crema, textShadow: "0 4px 10px #000", marginTop: 4, opacity: b }}>NUNCA DIRECTO</div>
  </div>;
};

// ficha de receta de internet con "todo junto" subrayado en rojo
const TodoJunto: React.FC<{ t: number; at: number; junto: number; out: number; x: number; y: number }> = ({ t, at: a, junto, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), u = e(t, junto, junto + 0.6);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-4deg) translateY(${(1 - Math.min(1, spr(t, a - 0.2, 1))) * 300}px)` }}>
    <div style={{ width: 600, padding: "26px 34px", background: "#fff", borderRadius: 16, boxShadow: "0 30px 50px rgba(0,0,0,.55)", fontFamily: FONT }}>
      <div style={{ fontWeight: 900, fontSize: 24, color: "#9aa", letterSpacing: 2 }}>RECETA · 4 PORCIONES</div>
      <div style={{ fontWeight: 900, fontSize: 46, color: "#333", margin: "6px 0 14px" }}>Arroz con leche fácil</div>
      {["1 taza de arroz", "1 litro de leche", "1 raja de canela", "1 taza de azúcar"].map((r, i) => <div key={i} style={{ fontSize: 32, color: "#555", fontWeight: 600, lineHeight: 1.4 }}>• {r}</div>)}
      <div style={{ position: "relative", display: "inline-block", marginTop: 14, fontSize: 40, fontWeight: 900, color: "#333" }}>Pon <span style={{ position: "relative" }}>todo junto<svg style={{ position: "absolute", left: -10, top: -14, overflow: "visible" }} width={230} height={70}><ellipse cx={115} cy={34} rx={120} ry={36} fill="none" stroke="#e23a2a" strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} /></svg></span> en la olla.</div>
    </div>
  </div>;
};

// el GRANO por dentro: en AGUA las gotitas entran y se abre; en LECHE la grasa y el azúcar rebotan y se queda duro
const Grano: React.FC<{ t: number; at: number; agua: number; grasa: number; azucar: number; out: number; x: number; y: number }> = ({ t, at: a, agua, grasa, azucar, out, x, y }) => {
  const o = e(t, a - 0.2, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const sw = e(t, agua + 0.3, agua + 1.6), gL = e(t, grasa - 0.2, grasa + 0.3), zL = e(t, azucar, azucar + 0.4);
  const G = ({ s, lab, col }: { s: number; lab: string; col: string }) => <g>
    <ellipse rx={150 * (1 + 0.25 * s)} ry={62 * (1 + 0.55 * s)} fill="#f5efe0" stroke="#d8cdb2" strokeWidth={5} />
    <ellipse rx={95 * (1 - 0.6 * s)} ry={30 * (1 - 0.6 * s)} fill="#e2d7bd" opacity={1 - 0.7 * s} />
    {s > 0.5 && [[-160, -40], [-170, 30], [165, -35], [172, 28]].map(([xx, yy], i) => <path key={i} d={`M ${xx * (1 + 0.2 * s)} ${yy} q ${xx > 0 ? 30 : -30} ${-10} ${xx > 0 ? 40 : -40} 10`} stroke="#f5efe0" strokeWidth={14} strokeLinecap="round" fill="none" opacity={(s - 0.5) * 2} />)}
    <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={col}>{lab}</text>
  </g>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={1300} height={520} viewBox="-650 -250 1300 520" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.55))" }}>
      <rect x={-640} y={-240} width={1280} height={500} rx={36} fill="rgba(30,18,10,.72)" />
      <g transform="translate(-320 0)"><G s={sw} lab="EN AGUA: SE ABRE" col="#8fd6ff" />
        {Array.from({ length: 10 }, (_, i) => { const ph = ((t - a) * 0.9 + i / 10) % 1, r = 260 - 170 * ph, an = i * 0.63; return <path key={i} d="M 0 -14 Q 10 0 0 10 Q -10 0 0 -14 Z" fill="#6fc3ff" transform={`translate(${Math.cos(an) * r} ${Math.sin(an) * r * 0.6}) scale(1.6)`} opacity={t > agua ? 1 - ph * 0.6 : 0} />; })}
      </g>
      <g transform="translate(320 0)" opacity={gL}><G s={0} lab="EN LECHE: SE QUEDA DURO" col="#ffb257" />
        {Array.from({ length: 8 }, (_, i) => { const an = i * 0.785, bo = 205 + 18 * Math.abs(Math.sin((t - grasa) * 4 + i)); return <circle key={i} cx={Math.cos(an) * bo} cy={Math.sin(an) * bo * 0.6} r={16} fill="#f2cf6a" />; })}
        {Array.from({ length: 8 }, (_, i) => { const an = i * 0.785 + 0.4, bo = 215 + 18 * Math.abs(Math.cos((t - azucar) * 4 + i)); return <rect key={i} x={Math.cos(an) * bo - 9} y={Math.sin(an) * bo * 0.6 - 9} width={18} height={18} fill="#fff" stroke="#ccc" strokeWidth={2} opacity={zL} transform={`rotate(${i * 30} ${Math.cos(an) * bo} ${Math.sin(an) * bo * 0.6})`} />; })}
        <text x={-230} y={-170} fontFamily={HAND} fontWeight={700} fontSize={44} fill="#f2cf6a">grasa</text><text x={130} y={-170} fontFamily={HAND} fontWeight={700} fontSize={44} fill="#fff" opacity={zL}>azúcar</text>
      </g>
    </svg>
  </div>;
};

// caracolito que cruza lento: MÁS LENTO
const Caracol: React.FC<{ t: number; at: number; out: number; y: number }> = ({ t, at: a, out, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const x = 1250 + (t - a) * 60;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg width={220} height={150} viewBox="0 0 220 150" style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,.5))" }}>
      <path d="M 10 130 Q 60 110 200 128 L 200 140 L 10 140 Z" fill="#b9c27a" /><circle cx={180} cy={110} r={6} fill="#5a3014" />
      <path d="M 165 110 L 172 70 M 185 112 L 195 74" stroke="#9aa45a" strokeWidth={6} strokeLinecap="round" />
      <g transform={`translate(95 82) rotate(${(t - a) * 30})`}><path d="M 0 0 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 M -32 0 a 32 32 0 1 1 64 0 a 32 32 0 1 1 -64 0 M -14 0 a 14 14 0 1 0 28 0" fill="#c2552d" stroke="#7a2f14" strokeWidth={6} /></g>
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: LT.crema, textShadow: extrude(6, "#5a3014"), whiteSpace: "nowrap", marginTop: -6 }}>MÁS LENTO…</div>
  </div>;
};

// pizarrón de cocina: la receta de mi mamá se escribe con gis renglón por renglón
const Pizarron: React.FC<{ t: number; at: number; rows: [string, number][]; out: number; x: number; y: number; sc?: number }> = ({ t, at: a, rows, out, x, y, sc = 1 }) => {
  const o = e(t, a - 0.25, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
    <div style={{ width: 620, padding: "30px 40px 34px", background: "linear-gradient(160deg,#2e4a3a,#1d3328)", border: "18px solid #8a5a2a", borderRadius: 10, boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#f6f1e4", marginBottom: 6, borderBottom: "3px dashed rgba(246,241,228,.5)" }}>El arroz, primero en agua</div>
      {rows.map(([r, ra], i) => { const w = e(t, ra, ra + 0.6); return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: i % 2 ? "#ffd27a" : "#f6f1e4", whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)`, lineHeight: 1.25 }}>{r}</div>; })}
    </div>
  </div>;
};

// timer de cocina de cuerda: gira hasta 15 MIN y tiembla
const Timer: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a - 0.2, 1)), o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ang = -270 * ei(t, a, a + 1.2) + 2 * Math.sin(t * 40) * e(t, a + 1.2, a + 1.3);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={280} height={280} viewBox="-140 -140 280 280" style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,.6))" }}>
      <circle r={130} fill="#e2457a" /><circle r={104} fill="#fff7ea" />
      <g transform={`rotate(${ang})`}>{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><rect x={-3} y={-100} width={6} height={i % 3 ? 12 : 22} fill="#3b2414" />{i % 3 === 0 && <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#3b2414">{(i * 5) % 60}</text>}</g>)}</g>
      <path d="M 0 -128 L -12 -104 L 12 -104 Z" fill="#3b2414" /><circle r={26} fill="#e2457a" /><rect x={-8} y={-40} width={16} height={34} rx={6} fill="#c23562" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LT.crema, textShadow: extrude(6, "#7a1f3a"), marginTop: -6 }}>15 MIN</div>
  </div>;
};

// la cuenta con gis: $30 el kilo → 200 g = $6
const CuentaGis: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = e(t, a1 - 0.2, a1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const L = (txt: string, a: number, col: string, sz: number) => <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: sz, color: col, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * e(t, a, a + 0.6)}% -20% 0)`, textShadow: "0 4px 10px rgba(0,0,0,.8)" }}>{txt}</div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "20px 36px", background: "rgba(25,30,24,.78)", borderRadius: 18 }}>
    {L("1 kilo = $30", a1, "#f6f1e4", 76)}{L("1 taza (200 g) =", a1 + 1.0, "#f6f1e4", 64)}
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#ffd27a", lineHeight: 1, transform: `scale(${Math.min(1.1, spr(t, a2, 1.2))})`, transformOrigin: "0 50%", textShadow: extrude(8, "#6a4206") }}>$6</div>
  </div>;
};

// lupa que pasa sobre los granos: QUEBRADO · VIEJO
const Lupa: React.FC<{ t: number; a1: number; a2: number; out: number }> = ({ t, a1, a2, out }) => {
  const o = e(t, a1 - 0.3, a1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const mv = ei(t, a1 - 0.3, a2 + 0.4), x = 700 + 330 * mv, y = 640 - 60 * mv;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg width={420} height={420} viewBox="-210 -210 420 420" style={{ position: "absolute", left: -210, top: -210, overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      <circle r={150} fill="rgba(200,230,255,.18)" stroke="#2a1a10" strokeWidth={22} /><circle r={150} fill="none" stroke="#c9a24a" strokeWidth={8} />
      <rect x={100} y={100} width={46} height={150} rx={18} fill="#5a3014" transform="rotate(-45 100 100)" />
      <path d="M -90 -80 Q -40 -120 20 -110" stroke="rgba(255,255,255,.6)" strokeWidth={12} fill="none" strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 160, top: -220, whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {[["QUEBRADO", a1], ["VIEJO", a2]].map(([w, a], i) => <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", background: "#e23a2a", padding: "4px 22px", borderRadius: 10, margin: "0 0 12px", display: "inline-block", marginRight: 16, opacity: e(t, a as number, (a as number) + 0.15), transform: `scale(${Math.min(1, spr(t, a as number, 1.3))}) rotate(${i ? 4 : -3}deg)` }}>✗ {w as string}</div>)}
    </div>
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M4: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 277-278,3 · la repisa: vasito 2 → SECRETO 2 · EL ARROZ (sigue abajo cuando entra Leti)
  if (t < A[0][0] + 0.02) L.push(W("w1", t));
  L.push(<SecretoTitulo key="st" t={t} at={T.num} word={T.arroz} n={2} text="EL ARROZ" out={T.directo - 0.1} y={700} col="#f2a31b" />);
  // 278,3-282,8 (avatar) · nunca directo a la leche
  L.push(<Prohibido key="ph" t={t} at={T.directo} out={A[0][1] - 0.2} x={1470} y={420} />);
  // 282,8-289,2 · la receta de internet "todo junto" → la olla en corte: duro por dentro
  if (t >= A[0][1] && t < A[1][0] + 0.02) {
    L.push(W("w2", t));
    L.push(<TodoJunto key="tj" t={t} at={T.recetas} junto={T.junto} out={T.duro - 0.3} x={1340} y={480} />);
    const p = screenOf(t, [C[0], 0.92, C[2]]);
    L.push(<Tag key="dd" t={t} at={T.duro + 0.2} x={p.x} y={p.y} dx={260} dy={-180} text="DURO POR DENTRO" col="#ffd27a" out={T.mira + 0.2} size={62} />);
    L.push(<Grano key="gn" t={t} at={T.mira + 0.2} agua={T.agua} grasa={T.grasa} azucar={T.azucar} out={A[1][0] + 1.2} x={960} y={560} />);
  }
  // 295,1-301 (avatar) · más lento… se queda duro adentro
  L.push(<Caracol key="cc" t={t} at={T.lento} out={A[1][1] - 0.2} y={720} />);
  // 301-303,9 · la olla: la leche se pega al fondo esperándolo
  if (t >= A[1][1] && t < T.primero - 0.05) { L.push(W("w3", t)); const p = screenOf(t, [O[0], SY - 0.1, O[2] + 0.25]); L.push(<Tag key="pf" t={t} at={T.pega} x={p.x} y={p.y} dx={-300} dy={-200} text="SE PEGA AL FONDO" col="#ff9a7a" out={T.primero - 0.3} size={62} />); }
  // 303,9-306,8 · el arroz en agua, primero
  if (t >= T.primero - 0.05 && t < T.taza - 0.1) {
    L.push(<Whip key="wa" t={t} at={T.primero - 0.05} d={0.4} a={W("w3b", Math.min(t, T.primero - 0.06))} b={<Clip k="r_arroz_agua" t={t} a={T.primero} z={[1.1, 1.03]} />} />);
    L.push(<Escrito key="pa" t={t} at={T.primero + 0.3} out={T.taza - 0.3} x={1100} y={200} text="primero, en agua" size={110} dur={0.7} />);
  }
  // 306,8-312,8 · Lety lava el arroz · el pizarrón con las medidas (sigue en el avatar)
  if (t >= T.taza - 0.1 && t < A[2][0] + 0.02) L.push(<Whip key="wl" t={t} at={T.taza - 0.1} d={0.35} a={<Clip k="r_arroz_agua" t={t} a={T.primero} z={[1.1, 1.03]} />} b={<Clip k="r_lety_lava" t={t} a={T.taza} z={[1.03, 1.1]} />} />);
  L.push(<Pizarron key="pz" t={t} at={T.taza} rows={[["1 taza de arroz (200 g)", T.taza + 0.1], ["bien lavado", T.lavado], ["1 litro de agua", T.litro], ["fuego medio", T.medio]]} out={A[2][1] - 0.3} x={inA(2) ? 1180 : 1220} y={inA(2) ? 230 : 150} sc={inA(2) ? 0.95 : 1} />);
  // 312,8-318,4 (avatar) · 15 minutos
  if (inA(2)) L.push(<Timer key="tm" t={t} at={T.min15} out={A[2][1] - 0.2} x={480} y={330} />);
  // 318,4-320,3 · el grano gordito, floreado
  if (t >= A[2][1] && t < T.ahi - 0.05) { L.push(<Clip key="cf" k="r_lety_floreado" t={t} a={A[2][1]} z={[1.04, 1.12]} />); L.push(<Escrito key="fl" t={t} at={T.floreado} out={T.ahi - 0.2} x={1200} y={200} text="floreado" size={130} col="#ffd27a" dur={0.5} />); }
  L.push(<Vaho key="v1" t={t} mid={T.ahi - 0.05} w={0.3} />);
  // 320,3-323,3 · la olla con el arroz en agua: ahí y sólo ahí, entra la leche
  if (t >= T.ahi - 0.05 && t < T.abierto - 0.05) { L.push(W("w4", t)); L.push(<Sello key="ah" t={t} at={T.ahi} text="AHÍ, Y SÓLO AHÍ" x={560} y={220} out={T.abierto - 0.3} rot={-5} col={LT.turq} size={90} />); }
  // 323,3-328,5 · el grano crudo vs abierto · la leche lo vuelve crema
  if (t >= T.abierto - 0.05 && t < A[3][0] + 0.02) {
    L.push(<Whip key="wg" t={t} at={T.abierto - 0.05} d={0.4} a={W("w4b", Math.min(t, T.abierto - 0.06))} b={<Clip k="r_grano_macro" t={t} a={T.abierto} z={[1.03, 1.12]} />} />);
    L.push(<Tag key="ab" t={t} at={T.abierto + 0.5} x={1260} y={560} dx={180} dy={-260} text="YA VA ABIERTO" col="#ffd27a" out={A[3][0] - 0.15} size={58} />);
    L.push(<Escrito key="vc" t={t} at={T.crema} out={A[3][0] - 0.15} x={200} y={880} text="…y lo vuelve crema" size={90} dur={0.6} />);
  }
  // 328,5-333,4 (avatar) · blanco común, a granel
  if (inA(3)) { L.push(<Sello key="bc" t={t} at={T.blanco} text="BLANCO COMÚN" x={1450} y={250} out={A[3][1] - 0.2} rot={-6} col="#f2a31b" size={74} />); L.push(<Sello key="gr" t={t} at={T.granel} text="A GRANEL" x={1460} y={420} out={A[3][1] - 0.2} rot={4} col={LT.turq} size={74} />); }
  // 333,4-338,3 · el puesto a granel: $30 el kilo → $6
  if (t >= A[3][1] && t < T.caro - 0.05) { L.push(<Clip key="cg" k="r_granel" t={t} a={A[3][1]} z={[1.1, 1.03]} />); L.push(<CuentaGis key="cu" t={t} a1={T.p30 - 0.2} a2={T.p6} out={T.caro - 0.3} x={1180} y={180} />); }
  // 338,3-345,6 · nada de quebrado ni viejo → engrudo
  if (t >= T.caro - 0.05 && t < A[4][0] + 0.02) {
    L.push(<Clip key="cq" k="r_arroz_quebrado" t={t} a={T.caro} z={[1.03, 1.1]} />);
    L.push(<Escrito key="nc" t={t} at={T.caro} out={T.quebrado - 0.3} x={1100} y={180} text="no necesitas arroz caro" size={84} dur={0.7} />);
    L.push(<Lupa key="lp" t={t} a1={T.quebrado} a2={T.viejo} out={T.engrudo - 0.4} />);
    L.push(<Sello key="en" t={t} at={T.engrudo} text="ENGRUDO" x={960} y={480} out={A[4][0] + 0.2} rot={-8} col="#e23a2a" size={140} />);
  }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
