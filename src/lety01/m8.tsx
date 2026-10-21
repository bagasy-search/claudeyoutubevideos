// lety01 · TRAMO 8 (603,7-721,9 s): SECRETO 6 · EL CHORRITO (una taza de leche guardada, al final: brilloso y suelto, como la
// cuchara del principio) → fuera la raja (si no, amanece amargoso) → SECRETO 7 · MÁS AGUADO (sigue espesando al enfriar; si no,
// plasta) → el caminito que se cierra solo → reposar destapado → vasitos tapados → ojo: no más de 2 h fuera del refri → frío con
// canela → al otro día: una cucharada de leche tibia y queda como nuevo.
import React from "react";
import { AbsoluteFill } from "remotion";
import { PT, VASOS, WorldProps, screenOf, setKeys } from "./cocina3d";
import { Avatar, World3, AV } from "./comun";
import { Clip, Escrito, Sello, Vaho, Whip } from "./Min1";
import { M7_END } from "./m7";
import { SecretoTitulo } from "./m3";
import { FONT, HAND, LT, SERIF, Tag, at, e, ei, extrude, spr } from "./lib";

const O = PT.olla, SY = PT.sup[1], M = PT.mesa;
const LECH: [number, number, number] = [M[0] + 0.62, 0.8, M[2] - 0.28];
const T = {
  num: at("secreto numero seis", 603), guarda: at("leche se guarda", 605), fiesta: at("de fiesta", 609), nadie: at("casi nadie", 610), toda: at("toda la leche", 613), chorrito: at("guardas un chorrito", 615),
  taza: at("una taza por cada litro", 617), echas: at("le echas esa leche", 622), cinco: at("cinco minutos mas", 625), paraque: at("para que", 626), brilloso: at("brilloso", 628), suelto: at("suelto", 629),
  espeso: at("espeso", 633), opaco: at("opaco", 634), pesado: at("pesado", 635), ultimo: at("ese ultimo chorrito", 636), brillo: at("el brillo", 638), afloja: at("afloja", 639), resbala: at("resbala", 642),
  principio: at("como la que viste al principio", 643), fresca: at("fresca de leche", 646), sacas: at("sacas la raja", 649), dio: at("ya dio todo", 651), noche: at("toda la noche", 654), amargoso: at("amargoso", 655),
  fuera: at("fuera la raja", 657), apagas: at("apagas el fuego", 658), num7: at("secreto 7", 659), aguado: at("mas aguado", 662), paciencia: at("paciencia", 664), cuece: at("cuece lo cuece", 666),
  plato: at("en el plato", 670), enfria: at("se enfria", 672), plasta: at("plasta", 673), cuchillo: at("cuchillo", 675), sigue: at("sigue espesando", 677), chupando: at("chupando", 680),
  apagas2: at("lo apagas cuando", 682), caminito: at("caminito", 688), cierra: at("se cierra solo", 689), ahi: at("ahi esta", 690), reposar: at("reposar destapado", 691), tibio: at("ya tibio", 695),
  tazas: at("tazas o vasitos", 697), tapas: at("lo tapas", 698), ojo: at("ojo con esto", 699), refri: at("fuera del refri", 703), horas: at("dos horas", 705), alrefri: at("al refri", 707),
  chiquitos: at("chiquitos", 708), rapido: at("rapido", 710), frio: at("se comia frio", 711), canela: at("con canela en polvo arriba", 712), otro: at("al otro dia", 714), cucharada: at("una cucharada", 717),
  nuevo: at("como nuevo", 720),
};
export const M8_END = at("entonces vamos a repasar", 721) - 0.05;
const A = [AV(610.7), AV(626.8), AV(645.1), AV(664), AV(679.3), AV(695.3), AV(710.9)];

setKeys([
  { t: M7_END + 0.1, p: [VASOS[5][0] + 0.45, 1.75, -1.95], l: [VASOS[5][0] + 0.1, 1.55, -2.84], fov: 40 },
  { t: T.guarda - 0.05, p: [VASOS[5][0] + 0.25, 1.68, -2.25], l: [VASOS[5][0], 1.56, -2.84], fov: 36 },
  { t: T.guarda + 0.05, p: [LECH[0] + 1.3, 1.55, LECH[2] + 1.6], l: [LECH[0], 0.98, LECH[2]], fov: 44 },
  { t: A[0][0], p: [LECH[0] + 0.9, 1.35, LECH[2] + 1.15], l: [LECH[0], 0.98, LECH[2]], fov: 40, arc: 0.05 },
  { t: A[1][1], p: [O[0] + 0.8, SY + 0.7, O[2] + 1.3], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.ultimo - 0.05, p: [O[0] + 0.55, SY + 0.55, O[2] + 1.0], l: [O[0], SY, O[2]], fov: 40 },
  { t: A[2][0], p: [O[0] + 0.35, SY + 0.42, O[2] + 0.75], l: [O[0], SY, O[2]], fov: 36, arc: -0.04 },
  { t: T.fuera - 0.05, p: [O[0] + 0.8, SY + 0.6, O[2] + 1.3], l: [O[0], SY - 0.05, O[2]], fov: 42 },
  { t: T.num7 - 0.1, p: [O[0] + 0.6, SY + 0.35, O[2] + 1.2], l: [O[0], SY - 0.2, O[2]], fov: 44 },
  { t: T.num7 + 0.6, p: [VASOS[6][0] + 0.45, 1.75, -1.95], l: [VASOS[6][0] + 0.1, 1.55, -2.84], fov: 40 },
  { t: A[3][0], p: [VASOS[6][0] + 0.25, 1.68, -2.25], l: [VASOS[6][0], 1.56, -2.84], fov: 36 },
  { t: A[3][1], p: [O[0] + 0.85, SY + 0.75, O[2] + 1.35], l: [O[0], SY, O[2]], fov: 42 },
  { t: T.enfria - 0.05, p: [O[0] + 0.5, SY + 0.5, O[2] + 0.9], l: [O[0], SY, O[2]], fov: 38 },
  { t: T.sigue - 1.0, p: [O[0] + 0.7, SY + 0.6, O[2] + 1.15], l: [O[0], SY, O[2]], fov: 42 },
  { t: A[4][0], p: [O[0] + 0.5, SY + 0.5, O[2] + 0.95], l: [O[0], SY, O[2]], fov: 40 },
  { t: T.reposar - 0.9, p: [O[0] + 0.9, SY + 0.85, O[2] + 1.4], l: [O[0], SY, O[2]], fov: 44 },
  { t: A[5][0], p: [O[0] + 0.6, SY + 0.65, O[2] + 1.05], l: [O[0], SY, O[2]], fov: 40, arc: 0.04 },
]);

const st = (t: number): WorldProps => {
  const chorr = t > A[1][1] && t < T.fuera;
  return {
    t, steam: t > T.apagas ? 0.6 : 1, vasos: VASOS.map((_, i) => (t > T.num7 ? (i === 6 ? 1 : 0.45) : i <= 5 ? (i === 5 ? 1 : 0.45) : 0.2)),
    cream: chorr ? 0.55 + 0.45 * e(t, T.ultimo + 0.4, T.brillo + 0.6) : t > A[3][1] && t < T.sigue - 1 ? 0.55 : 1,
    drop: chorr && t > T.ultimo - 0.2 ? { leche: Math.max(0, (t - T.ultimo + 0.2) / 1.8) } : {},
    raja: t > T.sacas && t < T.num7 ? 1 - e(t, T.fuera - 0.3, T.fuera + 0.3) : t > T.num7 ? 0 : undefined,
    fire: t > T.apagas && t < T.num7 + 1 ? 1 - e(t, T.apagas, T.apagas + 0.8) : t > T.num7 + 1 ? 0.15 : 1,
    trail: t > T.reposar - 1 && t < A[5][0] ? 0 : 0,
    agua: t > A[3][1] && t < T.plasta - 1.5 ? 0 : 0,
  };
};
const W = (k: string, t: number) => <World3 key={k} t={t} st={st} />;

// ================= PIEZAS NUEVAS =================
// estrella de piñata con listones: EL DE FIESTA
const EstrellaFiesta: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = Math.min(1.12, spr(t, a - 0.2, 1)), o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), sw = Math.sin(t * 2.5) * 5;
  if (o <= 0.01) return null;
  const pts = Array.from({ length: 7 }, (_, i) => { const an = (i / 7) * Math.PI * 2 - Math.PI / 2; return [Math.cos(an) * 150, Math.sin(an) * 150]; });
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k}) rotate(${sw}deg)` }}>
    <svg width={460} height={520} viewBox="-230 -230 460 520" style={{ overflow: "visible", filter: "drop-shadow(0 26px 30px rgba(0,0,0,.6))" }}>
      {pts.map(([px, py], i) => <g key={i}><path d={`M ${px * 0.5} ${py * 0.5} L ${px * 1.35} ${py * 1.35} L ${px * 0.5 + py * 0.25} ${py * 0.5 - px * 0.25} Z`} fill={["#e2457a", "#f2a31b", "#22b3a6", "#7b4bd1", "#3c8be6", "#f25f2b", "#e2457a"][i]} /><path d={`M ${px * 1.35} ${py * 1.35} q ${10 + i * 3} 60 ${-5} 120`} stroke={["#e2457a", "#f2a31b", "#22b3a6"][i % 3]} strokeWidth={8} fill="none" /></g>)}
      <circle r={110} fill="#fffaf0" />
      <text y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={LT.canela}>EL DE</text>
      <text y={44} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={64} fill="#e2457a">FIESTA</text>
    </svg>
  </div>;
};

// diez cucharitas grises y sólo una encendida: casi nadie lo hace
const CasiNadie: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 74px)", gap: 10 }}>
      {Array.from({ length: 10 }, (_, i) => { const on = i === 7, k = on ? Math.min(1.25, spr(t, a + 0.5, 1.3)) : 1; return <svg key={i} width={74} height={90} viewBox="0 0 74 90" style={{ transform: `scale(${k})`, opacity: e(t, a - 0.3 + i * 0.03, a - 0.1 + i * 0.03) }}><circle cx={37} cy={22} r={16} fill={on ? LT.turq : "#8a8a8a"} /><path d="M 10 88 Q 10 46 37 46 Q 64 46 64 88 Z" fill={on ? LT.turq : "#8a8a8a"} /></svg>; })}
    </div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: LT.crema, textShadow: extrude(6, "#0e5a54"), marginTop: 8 }}>CASI NADIE</div>
  </div>;
};

// proporción vector: 1 taza de leche aparte por cada litro
const Proporcion: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.08, spr(t, a - 0.2, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, padding: "26px 40px", background: "rgba(255,250,240,.95)", borderRadius: 26, boxShadow: "0 28px 40px rgba(0,0,0,.55)", display: "flex", alignItems: "center", gap: 26 }}>
    <svg width={110} height={130} viewBox="0 0 110 130"><path d="M 20 20 L 90 20 L 82 120 L 28 120 Z" fill="#e8f0f4" stroke="#3b2414" strokeWidth={5} /><path d="M 23 45 L 87 45 L 82 120 L 28 120 Z" fill="#fff" /><path d="M 88 40 Q 108 45 104 70 Q 100 90 84 88" stroke="#3b2414" strokeWidth={6} fill="none" /></svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: LT.tinta }}>1 taza</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LT.canela }}>por cada</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#2a6fc0" }}>1 L</div>
  </div>;
};

// marcador de futbol: +5 MIN
const Marcador: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.2, a) * (1 - e(t, out, out + 0.3)), f = ei(t, a, a + 0.5);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 8, perspective: 800 }}>
    <div style={{ padding: "16px 28px", background: "#1b1b1b", borderRadius: 14, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#ffd34a", boxShadow: "0 24px 36px rgba(0,0,0,.6)", transform: `rotateX(${(1 - f) * 90}deg)`, textShadow: "0 0 18px rgba(255,211,74,.7)" }}>+5</div>
    <div style={{ alignSelf: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: LT.crema, textShadow: "0 4px 10px #000", opacity: f }}>MIN MÁS</div>
  </div>;
};

// palabras con destellos: BRILLOSO · SUELTO
const Destellos: React.FC<{ t: number; a1: number; a2: number; out: number; x: number; y: number }> = ({ t, a1, a2, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a1 - 0.1 || o <= 0.01) return null;
  const Star = ({ sx, sy, s, ph }: { sx: number; sy: number; s: number; ph: number }) => { const k = Math.max(0, Math.sin(t * 5 + ph)); return <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ position: "absolute", left: sx, top: sy, transform: `scale(${s * k})` }}><path d="M 0 -28 Q 4 -4 28 0 Q 4 4 0 28 Q -4 4 -28 0 Q -4 -4 0 -28 Z" fill="#fff8d6" /></svg>; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    {[["BRILLOSO", a1, "#fff1d6"], ["SUELTO", a2, "#bfe9e4"]].map(([w, a, c], i) => <div key={i} style={{ position: "relative", fontFamily: SERIF, fontWeight: 900, fontSize: 118, color: c as string, textShadow: extrude(8, "#7a3412"), opacity: e(t, (a as number) - 0.1, (a as number) + 0.1), transform: `scale(${Math.min(1.1, spr(t, (a as number) - 0.1, 1.2))})`, transformOrigin: "0 50%", lineHeight: 1.05 }}>
      {w as string}
      <Star sx={-30} sy={-10} s={1} ph={i * 2} /><Star sx={360 - i * 60} sy={-20} s={0.8} ph={1 + i} /><Star sx={420 - i * 80} sy={70} s={0.6} ph={2.5 + i} />
    </div>)}
  </div>;
};

// tres palabras que caen como pesas: ESPESO · OPACO · PESADO
const Pesas: React.FC<{ t: number; at: number[]; out: number; x: number; y: number }> = ({ t, at: as, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < as[0] - 0.2 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", gap: 24, alignItems: "flex-end" }}>
    {["ESPESO", "OPACO", "PESADO"].map((w, i) => { const d = e(t, as[i] - 0.2, as[i] + 0.1), bo = Math.abs(Math.sin((t - as[i]) * 12)) * 14 * Math.exp(-(t - as[i]) * 5); return <div key={i} style={{ transform: `translateY(${(1 - d) * -500 - (t > as[i] ? bo : 0)}px)`, opacity: d > 0 ? 1 : 0, padding: "14px 26px 10px", background: "#5d6670", borderRadius: "18px 18px 8px 8px", fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#e6e6e6", boxShadow: "0 22px 0 #3a4048, 0 34px 30px rgba(0,0,0,.5)", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: -30, width: 60, height: 34, marginLeft: -30, border: "10px solid #5d6670", borderBottom: "none", borderRadius: "30px 30px 0 0" }} />{w}
    </div>; })}
  </div>;
};

// deslizador: OPACO → BRILLOSO (la perilla corre al echarle el chorrito)
const Deslizador: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), v = ei(t, a, a + 1.4);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", width: 700 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: LT.crema, textShadow: "0 3px 8px #000", marginBottom: 12 }}><span style={{ opacity: 1 - 0.6 * v }}>OPACO</span><span style={{ color: "#fff8d6", opacity: 0.4 + 0.6 * v }}>BRILLOSO ✦</span></div>
    <div style={{ height: 34, borderRadius: 17, background: "linear-gradient(90deg,#b9b3a6,#fff8e6)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.4), 0 16px 30px rgba(0,0,0,.5)", position: "relative" }}>
      <div style={{ position: "absolute", left: `calc(${v * 100}% - 34px)`, top: -17, width: 68, height: 68, borderRadius: 34, background: "radial-gradient(circle at 35% 30%,#fff,#e8d6b0)", boxShadow: `0 10px 20px rgba(0,0,0,.5), 0 0 ${30 * v}px rgba(255,248,214,${v})` }} />
    </div>
  </div>;
};

// la noche pasa (luna → sol) y amanece AMARGOSO
const Amanece: React.FC<{ t: number; at: number; am: number; out: number; x: number; y: number }> = ({ t, at: a, am, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), p = ei(t, a, am);
  if (o <= 0.01) return null;
  const an = Math.PI * (1 - p);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={460} height={260} viewBox="-230 -230 460 260" style={{ overflow: "visible", filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
      <path d="M -200 0 A 200 200 0 0 1 200 0" stroke="rgba(255,255,255,.4)" strokeWidth={5} strokeDasharray="12 12" fill="none" />
      {p < 0.5 ? <g transform={`translate(${Math.cos(an) * 200} ${-Math.sin(an) * 200})`}><circle r={44} fill="#e9eef8" /><circle cx={18} cy={-12} r={40} fill="rgba(30,30,60,.85)" /></g>
        : <g transform={`translate(${Math.cos(an) * 200} ${-Math.sin(an) * 200})`}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={-4} y={-72} width={8} height={20} fill="#ffd34a" transform={`rotate(${i * 45})`} />)}<circle r={44} fill="#ffc21a" /></g>}
      <rect x={-230} y={0} width={460} height={8} fill="#5a3014" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#c8a03a", textShadow: extrude(7, "#3a2a06"), opacity: e(t, am, am + 0.3), transform: `scale(${Math.min(1.1, spr(t, am, 1.2))})` }}>AMARGOSO</div>
  </div>;
};

// velita que se consume: PACIENCIA
const Vela: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), h = 220 - 90 * e(t, a, a + 3.5), fl = 1 + 0.12 * Math.sin(t * 19);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={220} height={340} viewBox="-110 -330 220 340" style={{ overflow: "visible", filter: "drop-shadow(0 0 30px rgba(255,200,90,.5))" }}>
      <rect x={-45} y={-h} width={90} height={h} rx={10} fill="#fff1d6" /><path d={`M -45 ${-h + 10} q 12 30 0 50`} stroke="#f0dcb0" strokeWidth={10} fill="none" />
      <rect x={-3} y={-h - 22} width={6} height={22} fill="#3b2414" />
      <path d={`M 0 ${-h - 22} C ${-24 * fl} ${-h - 50} ${-6} ${-h - 90 * fl} 0 ${-h - 100 * fl} C ${6} ${-h - 90 * fl} ${24 * fl} ${-h - 50} 0 ${-h - 22} Z`} fill="#ffb03a" />
      <rect x={-80} y={0} width={160} height={14} rx={7} fill="#c2552d" />
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: LT.crema, textShadow: extrude(6, "#7a3412") }}>PACIENCIA</div>
  </div>;
};

// gráfica a mano: la temperatura baja… y lo espeso SUBE
const Grafica: React.FC<{ t: number; at: number; chu: number; out: number; x: number; y: number }> = ({ t, at: a, chu, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), d = e(t, a, a + 2.0);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "24px 30px", background: "rgba(255,250,240,.95)", borderRadius: 22, boxShadow: "0 26px 40px rgba(0,0,0,.55)" }}>
    <svg width={560} height={330} viewBox="0 0 560 330">
      <path d="M 50 20 L 50 280 L 540 280" stroke={LT.tinta} strokeWidth={5} fill="none" />
      <path d="M 60 60 C 200 80 320 200 520 250" stroke="#e23a2a" strokeWidth={9} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} strokeLinecap="round" />
      <path d="M 60 250 C 200 230 320 110 520 60" stroke="#2a6fc0" strokeWidth={9} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} strokeLinecap="round" />
      <text x={70} y={50} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#e23a2a">CALOR ↓</text>
      <text x={330} y={50} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#2a6fc0" opacity={d}>ESPESO ↑</text>
      <text x={300} y={318} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={36} fill={LT.canela}>mientras se enfría</text>
    </svg>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#2a6fc0", textAlign: "center", opacity: e(t, chu, chu + 0.3) }}>el grano sigue chupando leche</div>
  </div>;
};

// el caminito dibujado que se cierra solo
const Caminito: React.FC<{ t: number; at: number; cierra: number; out: number; x: number; y: number }> = ({ t, at: a, cierra, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), d = e(t, a - 0.3, a + 0.4), c = e(t, cierra, cierra + 1.2);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={700} height={240} viewBox="0 0 700 240" style={{ overflow: "visible" }}>
      <path d="M 40 140 C 200 60 420 220 660 110" stroke="rgba(120,80,40,.75)" strokeWidth={46 * (1 - c) + 2} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
      <path d="M 40 140 C 200 60 420 220 660 110" stroke="#fff8e6" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="4 22" opacity={1 - c} />
      <text x={350} y={40} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill={LT.crema} style={{ filter: "drop-shadow(0 4px 8px #000)" }}>{c > 0.5 ? "…se cierra solo" : "el caminito"}</text>
    </svg>
  </div>;
};

// tres vasitos que reciben su platito de tapa
const Tapados: React.FC<{ t: number; at: number; tap: number; out: number; x: number; y: number }> = ({ t, at: a, tap, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30 }}>
    {[0, 1, 2].map((i) => { const k = Math.min(1.12, spr(t, a + i * 0.15, 1.2)), lid = e(t, tap - 0.2 + i * 0.18, tap + 0.15 + i * 0.18); return <svg key={i} width={150} height={210} viewBox="-75 -110 150 210" style={{ transform: `scale(${k})`, filter: "drop-shadow(0 16px 20px rgba(0,0,0,.55))" }}>
      <g transform={`translate(0 ${-140 * (1 - lid)}) rotate(${(1 - lid) * -25})`} opacity={lid > 0 ? 1 : 0}><ellipse cy={-58} rx={70} ry={14} fill="#f6f1e4" stroke="#c2552d" strokeWidth={4} /></g>
      <path d="M -55 -50 L -42 90 L 42 90 L 55 -50 Z" fill="#c2552d" /><ellipse cy={-50} rx={55} ry={12} fill="#fff1d6" />
    </svg>; })}
  </div>;
};

// refri con reloj: máximo 2 HORAS fuera
const Refri2h: React.FC<{ t: number; at: number; horas: number; out: number; x: number; y: number }> = ({ t, at: a, horas, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.08, spr(t, a - 0.3, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 20, padding: "24px 34px", background: "rgba(255,250,240,.95)", borderRadius: 26, border: "6px solid #ffc21a", boxShadow: "0 28px 40px rgba(0,0,0,.55)" }}>
    <svg width={140} height={200} viewBox="0 0 140 200"><rect x={10} y={5} width={120} height={190} rx={16} fill="#dfe8ee" stroke="#5d6670" strokeWidth={6} /><line x1={10} y1={70} x2={130} y2={70} stroke="#5d6670" strokeWidth={6} /><rect x={110} y={25} width={8} height={30} rx={4} fill="#5d6670" /><rect x={110} y={90} width={8} height={40} rx={4} fill="#5d6670" /></svg>
    <div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#b8860b" }}>⚠ FUERA DEL REFRI</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: LT.tinta, lineHeight: 1, opacity: e(t, horas - 0.2, horas + 0.1) }}>máx. 2 h</div>
    </div>
  </div>;
};

// copo de nieve que gira: FRÍO (con su polvito de canela)
const Copo: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const o = e(t, a - 0.3, a) * (1 - e(t, out, out + 0.3)), k = Math.min(1.1, spr(t, a - 0.3, 1));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ transform: `rotate(${(t - a) * 25}deg)`, filter: "drop-shadow(0 0 24px rgba(160,220,255,.7))" }}>
      {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`rotate(${i * 60})`}><line x1={0} y1={0} x2={0} y2={-115} stroke="#dff4ff" strokeWidth={12} strokeLinecap="round" /><path d="M -30 -70 L 0 -45 L 30 -70 M -22 -100 L 0 -82 L 22 -100" stroke="#dff4ff" strokeWidth={10} fill="none" strokeLinecap="round" /></g>)}
    </svg>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#dff4ff", textShadow: extrude(6, "#2a6fc0") }}>FRÍO</div>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#ffd27a", textShadow: "0 4px 10px #000" }}>con canela arriba</div>
  </div>;
};

// el rescate en 3 pasos: muy espeso → +1 cucharada tibia → ¡como nuevo!
const Rescate: React.FC<{ t: number; at: number[]; out: number; x: number; y: number }> = ({ t, at: as, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < as[0] - 0.3 || o <= 0.01) return null;
  const labs = [["MUY ESPESO", "#9aa7b0"], ["+1 cucharada tibia", "#f2a31b"], ["¡COMO NUEVO!", LT.turq]];
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, display: "flex", alignItems: "center", gap: 14 }}>
    {labs.map(([l, c], i) => <React.Fragment key={i}>
      {i > 0 && <div style={{ fontSize: 60, color: LT.crema, opacity: e(t, as[i] - 0.3, as[i]), textShadow: "0 3px 8px #000" }}>→</div>}
      <div style={{ padding: "16px 24px", background: c, borderRadius: 18, fontFamily: i === 1 ? HAND : FONT, fontWeight: 900, fontSize: i === 1 ? 50 : 44, color: "#fff", whiteSpace: "nowrap", boxShadow: "0 20px 30px rgba(0,0,0,.5)", opacity: e(t, as[i] - 0.3, as[i]), transform: `scale(${Math.min(1.1, spr(t, as[i] - 0.3, 1.2))})` }}>{l}</div>
    </React.Fragment>)}
  </div>;
};

// ---------------- EL TRAMO ----------------
export const M8: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const inA = (i: number) => t >= A[i][0] && t < A[i][1];
  if (A.some((_, i) => inA(i))) L.push(<Avatar key="av" t={t} />);

  // 603,7-610,7 · repisa: vasito 6 → SECRETO 6 · EL CHORRITO → la lechera de la mesa: el de fiesta
  if (t < A[0][0] + 0.02) {
    L.push(W("w1", t));
    L.push(<SecretoTitulo key="st" t={t} at={T.num} word={T.guarda - 0.4} n={6} text="EL CHORRITO" out={T.guarda + 1.2} col="#3c8be6" />);
    L.push(<EstrellaFiesta key="ef" t={t} at={T.fiesta} out={A[0][0] - 0.1} x={1460} y={420} />);
  }
  // 610,7-615,3 (avatar) · casi nadie lo hace
  L.push(<CasiNadie key="cn" t={t} at={T.nadie} out={A[0][1] - 0.15} x={1480} y={460} />);
  // 615,3-622,8 · Lety aparta una taza: 1 taza por cada litro
  if (t >= A[0][1] && t < T.echas - 0.05) { L.push(<Clip key="cg" k="r_lety_guarda" t={t} a={A[0][1]} z={[1.03, 1.1]} />); L.push(<Proporcion key="pr" t={t} at={T.taza} out={T.echas - 0.3} x={1300} y={880} />); }
  // 622,8-626,8 · el chorrito al final + 5 minutos más
  if (t >= T.echas - 0.05 && t < A[1][0] + 0.02) { L.push(<Whip key="wc" t={t} at={T.echas - 0.05} d={0.35} a={<Clip k="r_lety_guarda" t={t} a={A[0][1]} z={[1.03, 1.1]} />} b={<Clip k="r_chorrito" t={t} a={T.echas} z={[1.1, 1.03]} />} />); L.push(<Marcador key="mc" t={t} at={T.cinco} out={A[1][0] - 0.1} x={1450} y={250} />); }
  // 626,8-633,1 (avatar) · ¿para qué? brilloso y suelto
  if (inA(1)) L.push(<Destellos key="ds" t={t} a1={T.brilloso} a2={T.suelto} out={A[1][1] - 0.15} x={1180} y={280} />);
  // 633,1-636,1 · la olla: espeso, opaco, pesado
  if (t >= A[1][1] && t < T.ultimo - 0.05) { L.push(W("w2", t)); L.push(<Pesas key="ps" t={t} at={[T.espeso, T.opaco, T.pesado]} out={T.ultimo - 0.25} x={420} y={180} />); }
  // 636,1-645,1 · el último chorrito le regresa el brillo → se resbala, como la cuchara del principio
  if (t >= T.ultimo - 0.05 && t < A[2][0] + 0.02) {
    L.push(W("w3", t));
    L.push(<Deslizador key="dz" t={t} at={T.brillo - 0.3} out={T.resbala - 0.2} x={960} y={180} />);
    L.push(<Escrito key="cp" t={t} at={T.principio} out={A[2][0] - 0.1} x={220} y={200} text="como al principio ♥" size={96} col="#ffd27a" dur={0.7} />);
  }
  // 645,1-651,3 (avatar) · sabor fresco de leche · aquí sacas la raja
  if (inA(2)) L.push(<Sello key="sf" t={t} at={T.fresca} text="SABOR FRESCO" x={1460} y={280} out={A[2][1] - 0.2} rot={-5} col="#3c8be6" size={80} />);
  // 651,3-657,2 · Lety saca la raja: ya dio todo · si la dejas toda la noche, amanece amargoso
  if (t >= A[2][1] && t < T.fuera - 0.05) { L.push(<Clip key="cr" k="r_lety_saca_raja" t={t} a={A[2][1]} z={[1.03, 1.1]} />); L.push(<Amanece key="am" t={t} at={T.noche - 0.2} am={T.amargoso} out={T.fuera - 0.3} x={1480} y={420} />); }
  L.push(<Vaho key="v1" t={t} mid={T.fuera - 0.05} w={0.3} />);
  // 657,2-664 · la olla: fuera la raja y apagas el fuego → la repisa: SECRETO 7 · MÁS AGUADO
  if (t >= T.fuera - 0.05 && t < A[3][0] + 0.02) {
    L.push(W("w4", t));
    if (t < T.num7) { const p = screenOf(t, [O[0], SY + 0.1, O[2]]); L.push(<Tag key="fr" t={t} at={T.fuera} x={p.x} y={p.y} dx={-320} dy={-180} text="FUERA LA RAJA" col="#ffd27a" out={T.num7 - 0.3} size={60} />); L.push(<Tag key="af" t={t} at={T.apagas} x={p.x} y={p.y + 140} dx={260} dy={60} text="Y APAGAS" col="#ff9a7a" out={T.num7 - 0.3} size={56} />); }
  }
  L.push(<SecretoTitulo key="st7" t={t} at={T.num7 + 0.2} word={T.aguado - 0.1} n={7} text="MÁS AGUADO" out={A[3][0] + 1.0} y={inA(3) ? 700 : 330} col={LT.turq} />);
  // 664-668,2 (avatar) · el de la paciencia
  if (inA(3)) L.push(<Vela key="vl" t={t} at={T.paciencia} out={A[3][1] - 0.15} x={1500} y={430} />);
  // 668,2-671,6 · la olla espesa como en el plato
  if (t >= A[3][1] && t < T.enfria - 0.05) { L.push(W("w5", t)); L.push(<Escrito key="ep" t={t} at={T.cuece} out={T.enfria - 0.2} x={1000} y={200} text="lo cuece y lo cuece…" size={96} dur={0.7} />); }
  // 671,6-676,4 · se enfría y se hace una plasta
  if (t >= T.enfria - 0.05 && t < T.sigue - 1.0) { L.push(<Whip key="wp" t={t} at={T.enfria - 0.05} d={0.35} a={W("w5b", Math.min(t, T.enfria - 0.06))} b={<Clip k="r_plasta" t={t} a={T.enfria} z={[1.03, 1.12]} />} />); L.push(<Sello key="pl" t={t} at={T.plasta} text="UNA PLASTA" x={1300} y={240} out={T.sigue - 1.2} rot={-7} col="#e23a2a" size={110} />); L.push(<Escrito key="cu" t={t} at={T.cuchillo - 0.4} out={T.sigue - 1.2} x={200} y={880} text="…se corta con cuchillo" size={84} dur={0.6} />); }
  L.push(<Vaho key="v2" t={t} mid={T.sigue - 1.0} w={0.3} />);
  // 676,4-683,5 · sigue espesando mientras se enfría (la gráfica sigue en el avatar)
  if (t >= T.sigue - 1.0 && t < A[4][0] + 0.02) L.push(W("w6", t));
  L.push(<Grafica key="gf" t={t} at={T.sigue - 0.4} chu={T.chupando} out={T.apagas2 - 0.2} x={inA(4) ? 1460 : 1250} y={inA(4) ? 470 : 500} />);
  if (inA(4)) L.push(<Sello key="ma" t={t} at={T.apagas2 + 0.3} text="APÁGALO MÁS AGUADO" x={1400} y={300} out={A[4][1] - 0.1} rot={-4} col={LT.turq} size={64} />);
  // 683,5-691,2 · el caminito que se cierra solo → ¡ahí está!
  if (t >= A[4][1] && t < T.reposar - 0.9) { L.push(<Clip key="ck" k="r_caminito" t={t} a={A[4][1]} z={[1.03, 1.1]} />); L.push(<Caminito key="cm" t={t} at={T.caminito} cierra={T.cierra} out={T.ahi - 0.1} x={960} y={190} />); L.push(<Sello key="ae" t={t} at={T.ahi} text="¡AHÍ ESTÁ!" x={960} y={220} out={T.reposar - 1.0} rot={-6} col={LT.turq} size={120} />); }
  L.push(<Vaho key="v3" t={t} mid={T.reposar - 0.9} w={0.3} />);
  // 691,2-695,3 · la olla reposa destapada
  if (t >= T.reposar - 0.9 && t < A[5][0] + 0.02) { L.push(W("w7", t)); const p = screenOf(t, [O[0], SY + 0.05, O[2]]); L.push(<Tag key="rp" t={t} at={T.reposar} x={p.x} y={p.y} dx={-320} dy={-190} text="REPOSA DESTAPADO" col={LT.crema} out={A[5][0] - 0.1} size={60} />); }
  // 695,3-699,7 (avatar) · a tazas o vasitos, y lo tapas
  if (inA(5)) L.push(<Tapados key="tp" t={t} at={T.tazas} tap={T.tapas} out={A[5][1] - 0.1} x={1460} y={480} />);
  // 699,7-705,4 · Lety sirve los vasitos · ojo: no más de 2 h fuera del refri
  if (t >= A[5][1] && t < T.alrefri - 0.1) { L.push(<Clip key="cv" k="r_lety_vasitos" t={t} a={A[5][1]} z={[1.03, 1.1]} />); L.push(<Refri2h key="rf" t={t} at={T.ojo + 0.3} horas={T.horas} out={T.alrefri - 0.3} x={1420} y={300} />); }
  // 705,4-710,9 · al refri, en recipientes chiquitos para que enfríe rápido
  if (t >= T.alrefri - 0.1 && t < A[6][0] + 0.02) { L.push(<Whip key="wr" t={t} at={T.alrefri - 0.1} d={0.35} a={<Clip k="r_lety_vasitos" t={t} a={A[5][1]} z={[1.03, 1.1]} />} b={<Clip k="r_refri" t={t} a={T.alrefri} z={[1.1, 1.03]} />} />); L.push(<Sello key="ar" t={t} at={T.alrefri} text="AL REFRI" x={1450} y={230} out={A[6][0] - 0.1} rot={-6} col="#3c8be6" size={100} />); L.push(<Escrito key="ch" t={t} at={T.chiquitos - 0.2} out={A[6][0] - 0.1} x={200} y={880} text="chiquitos, pa' que enfríe rápido" size={76} dur={0.8} />); }
  // 710,9-714,5 (avatar) · se comía frío, con canela arriba
  if (inA(6)) L.push(<Copo key="cp2" t={t} at={T.frio} out={A[6][1] - 0.15} x={1500} y={450} />);
  // 714,5-721,9 · Lety come frío en el patio · al otro día: +1 cucharada tibia → como nuevo
  if (t >= A[6][1]) { L.push(<Clip key="cf" k="r_lety_come_frio" t={t} a={A[6][1]} z={[1.03, 1.1]} />); L.push(<Rescate key="rs" t={t} at={[T.otro + 1.0, T.cucharada, T.nuevo - 0.2]} out={M8_END - 0.2} x={200} y={860} />); }
  return <AbsoluteFill>{L}</AbsoluteFill>;
};
