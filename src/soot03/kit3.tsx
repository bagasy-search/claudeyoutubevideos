import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd, at } from "./lib";
import { C, fontFamily, fontMano, ent, prog, Chip, Grande } from "./kit";
import { Persona, Ropa as RopaT, CIVIL, Expr } from "./persona";
import { Obj } from "./kit2";
import { Cuenta } from "./P1";

// Kit del video 3 (Muro de Adriano): protagonista auxiliar, utilería nueva y atajos sincronizados a la voz.
const TINTA = "#2a1530";

// ── sincronía: w = frase dicha, d = desde qué segundo buscar
export const T = (w: string, d = 0, dt = 0) => at(w, d) + dt;
export type K = [number, number, number, number];
export const ck = (w: string, d: number, x: number, y: number, z: number, dt = 0): K => [at(w, d) + dt, x, y, z];

// texto que entra y SALE (los de kit no salen)
export const Sale: React.FC<{ t: number; t0: number; t1: number; children: React.ReactNode }> = ({ t, t0, t1, children }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const o = interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - o) * -30}px)` }}>{children}</div>;
};
type TxtP = { t: number; w: string; d: number; txt: string; x?: number; y?: number; c?: string; tinta?: string; size?: number; dur?: number; dt?: number; centro?: boolean };
export const Ch: React.FC<TxtP> = ({ t, w, d, txt, x = 960, y = 150, c = C.violeta, tinta = "#fff", size = 66, dur = 2.6, dt = 0, centro = true }) => {
  const t0 = at(w, d) + dt;
  return <Chip t={t} t0={t0} t1={t0 + dur} text={txt} color={c} tinta={tinta} x={x} y={y} size={size} centro={centro} />;
};
export const Gr: React.FC<TxtP & { borde?: string }> = ({ t, w, d, txt, x = 960, y = 540, c = C.crema, size = 150, dur = 2.4, dt = 0, borde = TINTA }) => {
  const t0 = at(w, d) + dt;
  return <Sale t={t} t0={t0} t1={t0 + dur}><Grande t={t} t0={t0} text={txt} x={x} y={y} size={size} color={c} borde={borde} /></Sale>;
};
export const Cu: React.FC<{ t: number; w: string; d: number; de: number; a: number; dur?: number; sube?: number; x?: number; y?: number; size?: number; suf?: string; pre?: string; color?: string; dt?: number }> = ({ t, w, d, de, a, dur = 3, sube = 0.9, x = 960, y = 540, size = 170, suf = "", pre = "", color = "#fff", dt = 0 }) => {
  const t0 = at(w, d) + dt;
  return <Sale t={t} t0={t0} t1={t0 + dur}><Cuenta t={t} t0={t0} t1={t0 + sube} de={de} a={a} x={x} y={y} size={size} suf={suf} pre={pre} color={color} /></Sale>;
};

// ── el protagonista: auxiliar tungro (Bélgica), malla de hierro, casco, capa verde cuando hace frío
export const TUNGRO: RopaT = { tunica: "#2e9b8f", tunica2: "#1c6a62", cinto: "#5a3418", piel: "#f2c09a", piel2: "#d99a72", pelo: "#a0602c" };
export const AUX = (i: number): RopaT => {
  const t = [["#3d7fc9", "#25548f"], ["#c9a23d", "#8f7025"], ["#a04ac9", "#6a2a8f"], ["#c95a3d", "#8f3a25"], ["#4ac98a", "#2a8f5a"], ["#c93d6a", "#8f2547"]][i % 6];
  const p = [["#f2c09a", "#d99a72"], ["#8d5a3b", "#6a3f26"], ["#c98b62", "#a2643f"], ["#5a3a26", "#3f2618"], ["#e8b48a", "#c98d66"], ["#a8724a", "#80522f"]][i % 6];
  return { tunica: t[0], tunica2: t[1], cinto: "#4a2a17", piel: p[0], piel2: p[1], pelo: ["#1d1410", "#2b1c14", "#7a4a22", "#1d1410", "#c9a05a", "#2b1c14"][i % 6] };
};
type YoP = { x: number; y: number; h?: number; t: number; expr?: Expr; habla?: boolean; camina?: number; frio?: boolean; flip?: boolean; bI?: number; bD?: number; cI?: number; cD?: number; mira?: number; miraY?: number; manoD?: React.ReactNode; manoI?: React.ReactNode; salta?: number; viejo?: boolean; inclina?: number; casco?: boolean; aparece?: number; sombra?: string; ladea?: number };
export const Yo: React.FC<YoP> = ({ h = 230, frio, casco = true, ...p }) => (
  <Persona {...p} h={h} seed={3} ropa={TUNGRO} casco={casco ? "legion" : "no"} malla pantalon={frio ? "#6b4a2f" : undefined} capa={frio ? "#3f6b2a" : undefined} />
);
export const Otro: React.FC<YoP & { i: number }> = ({ i, h = 230, casco = true, ...p }) => (
  <Persona {...p} h={h} seed={20 + i} ropa={AUX(i)} casco={casco ? "legion" : "no"} malla={i % 2 === 0} />
);
export { CIVIL };

// ── utilería nueva
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; t1?: number; rot?: number; op?: number };
export const Barril: React.FC<Pos & { vacio?: boolean }> = ({ vacio, ...p }) => (
  <Obj {...p} w={240} h={300}>
    <path d="M -90 -130 Q -120 0 -90 130 L 90 130 Q 120 0 90 -130 Z" fill="#a8622c" />
    {[-90, -30, 30, 90].map((y) => <path key={y} d={`M ${-104 + Math.abs(y) * 0.1} ${y} L ${104 - Math.abs(y) * 0.1} ${y}`} stroke="#5d6577" strokeWidth={16} />)}
    {[-50, 0, 50].map((x) => <line key={x} x1={x} y1={-130} x2={x * 1.1} y2={130} stroke="#7a4520" strokeWidth={5} />)}
    <ellipse cx={0} cy={-130} rx={90} ry={22} fill="#7a4520" />
    {!vacio && <ellipse cx={0} cy={-130} rx={74} ry={16} fill="#e8a83a" />}
    <path d="M -70 -90 Q -84 0 -66 90" stroke="#fff" strokeOpacity={0.35} strokeWidth={12} fill="none" strokeLinecap="round" />
    {!vacio && <text x={0} y={20} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#fff6c8" stroke={TINTA} strokeWidth={6} paintOrder="stroke">BEER</text>}
  </Obj>
);
export const Jarro: React.FC<Pos & { lleno?: number }> = ({ lleno = 1, ...p }) => (
  <Obj {...p} w={200} h={240}>
    <path d="M -60 -90 L 60 -90 L 50 100 L -50 100 Z" fill="#e8d8b0" opacity={0.6} />
    <path d={`M ${-60 + (1 - lleno) * 10} ${100 - 190 * lleno} L ${60 - (1 - lleno) * 10} ${100 - 190 * lleno} L 50 100 L -50 100 Z`} fill="#e8a83a" />
    {lleno > 0.9 && <><ellipse cx={0} cy={-92} rx={66} ry={22} fill="#fff8e8" /><circle cx={-34} cy={-100} r={20} fill="#fff8e8" /><circle cx={24} cy={-104} r={24} fill="#fff8e8" /></>}
    <path d="M 58 -50 Q 110 -40 96 30 L 54 40" stroke="#c9b890" strokeWidth={16} fill="none" />
    <path d="M -60 -90 L 60 -90 L 50 100 L -50 100 Z" fill="none" stroke="#c9b890" strokeWidth={8} />
  </Obj>
);
export const Guantes: React.FC<Pos> = (p) => (
  <Obj {...p} w={320} h={240}>
    {[-1, 1].map((s) => <g key={s} transform={`translate(${s * 70} 0) scale(${s} 1)`}><path d="M -50 -80 Q 40 -110 60 -20 Q 70 50 20 80 L -40 80 Q -70 0 -50 -80 Z" fill="#8a4a20" /><path d="M -40 80 L 20 80 L 20 110 L -40 110 Z" fill="#6b3a1f" /><path d="M -30 -60 Q 20 -80 40 -30" stroke="#c98a5a" strokeWidth={8} fill="none" strokeLinecap="round" /></g>)}
  </Obj>
);
export const Dado: React.FC<Pos & { n?: number }> = ({ n = 6, ...p }) => {
  const P: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-22, -22], [22, 22]], 3: [[-22, -22], [0, 0], [22, 22]], 4: [[-22, -22], [22, -22], [-22, 22], [22, 22]], 5: [[-22, -22], [22, -22], [0, 0], [-22, 22], [22, 22]], 6: [[-22, -24], [22, -24], [-22, 0], [22, 0], [-22, 24], [22, 24]] };
  return (
    <Obj {...p} w={130} h={130}>
      <rect x={-50} y={-50} width={100} height={100} rx={18} fill="#f2ead8" stroke="#c9bca0" strokeWidth={6} />
      {P[n].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={9} fill={TINTA} />)}
    </Obj>
  );
};
export const Tablero: React.FC<Pos> = (p) => (
  <Obj {...p} w={420} h={300}>
    <rect x={-200} y={-130} width={400} height={260} rx={14} fill="#b5a48a" stroke="#8a7a60" strokeWidth={8} />
    {Array.from({ length: 8 }, (_, i) => <line key={"v" + i} x1={-180 + i * 51} y1={-110} x2={-180 + i * 51} y2={110} stroke="#6a5a40" strokeWidth={4} />)}
    {Array.from({ length: 5 }, (_, i) => <line key={"h" + i} x1={-180} y1={-110 + i * 55} x2={177} y2={-110 + i * 55} stroke="#6a5a40" strokeWidth={4} />)}
    {[[-154, -82, 0], [-52, -28, 0], [50, 26, 1], [101, -82, 1], [-103, 80, 0], [152, 80, 1]].map(([a, b, k], i) => <circle key={i} cx={a} cy={b} r={20} fill={k ? TINTA : "#fff6e8"} stroke="#6a5a40" strokeWidth={4} />)}
  </Obj>
);
export const Esqueleto: React.FC<Pos & { cuchillo?: boolean }> = ({ cuchillo, ...p }) => (
  <Obj {...p} w={560} h={200}>
    <circle cx={-220} cy={0} r={44} fill="#f2ead8" />
    <circle cx={-232} cy={-8} r={9} fill={TINTA} /><circle cx={-206} cy={-8} r={9} fill={TINTA} />
    <line x1={-176} y1={0} x2={40} y2={0} stroke="#f2ead8" strokeWidth={14} strokeLinecap="round" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${-150 + i * 26} -44 Q ${-140 + i * 26} 0 ${-150 + i * 26} 44`} stroke="#f2ead8" strokeWidth={9} fill="none" strokeLinecap="round" />)}
    {[-1, 1].map((s) => <path key={s} d={`M 40 0 L 150 ${s * 30} L 250 ${s * 20}`} stroke="#f2ead8" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    {[-1, 1].map((s) => <path key={"b" + s} d={`M -150 ${s * 40} L -60 ${s * 76} L 20 ${s * 60}`} stroke="#f2ead8" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    {cuchillo && <g transform="translate(-86 -30) rotate(-60)"><path d="M 0 0 L 12 -70 L 24 0 Z" fill="#c8ccd4" stroke="#7d8796" strokeWidth={4} /><circle cx={12} cy={2} r={30} fill="none" stroke={C.rojo} strokeWidth={6} strokeDasharray="8 8" /></g>}
  </Obj>
);
export const Lapida2: React.FC<Pos & { lineas?: string[]; pie?: string }> = ({ lineas = [], pie, ...p }) => (
  <Obj {...p} w={520} h={720}>
    <path d="M -230 340 L -230 -220 Q -230 -330 0 -330 Q 230 -330 230 -220 L 230 340 Z" fill="rgba(20,8,40,.3)" transform="translate(16 16)" />
    <path d="M -230 340 L -230 -220 Q -230 -330 0 -330 Q 230 -330 230 -220 L 230 340 Z" fill="#e0d4bc" stroke="#a89878" strokeWidth={10} />
    <path d="M -170 -60 L -170 -200 Q -170 -270 0 -270 Q 170 -270 170 -200 L 170 -60 Z" fill="#cdbfa4" />
    {/* Regina sentada con su canasto (silueta) */}
    <circle cx={0} cy={-190} r={34} fill="#a89878" />
    <path d="M -60 -60 Q -50 -150 0 -150 Q 50 -150 60 -60 Z" fill="#a89878" />
    <rect x={60} y={-110} width={60} height={50} rx={10} fill="#a89878" />
    {lineas.map((l, i) => <text key={i} x={0} y={10 + i * 56} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={44} fill="#6a5a40" letterSpacing={3}>{l}</text>)}
    {pie && <text x={0} y={300} textAnchor="middle" fontFamily="Georgia, serif" fontSize={40} fill="#8a3a2a" fontStyle="italic">{pie}</text>}
  </Obj>
);
export const Carro: React.FC<Pos & { carga?: "grano" | "barril" | "nada" }> = ({ carga = "grano", ...p }) => {
  const g = (p.t ?? 0) * 200;
  return (
    <Obj {...p} w={560} h={360}>
      {carga === "grano" && [-120, -20, 80].map((x, i) => <g key={i}><path d={`M ${x - 50} -20 Q ${x - 60} -110 ${x} -120 Q ${x + 60} -110 ${x + 50} -20 Z`} fill="#d9b878" /><rect x={x - 22} y={-128} width={44} height={16} rx={6} fill="#a8783a" /></g>)}
      {carga === "barril" && [-110, 20].map((x) => <g key={x}><path d={`M ${x - 50} -20 Q ${x - 64} -80 ${x - 50} -150 L ${x + 50} -150 Q ${x + 64} -80 ${x + 50} -20 Z`} fill="#a8622c" /><line x1={x - 56} y1={-110} x2={x + 56} y2={-110} stroke="#5d6577" strokeWidth={10} /><line x1={x - 56} y1={-60} x2={x + 56} y2={-60} stroke="#5d6577" strokeWidth={10} /></g>)}
      <rect x={-220} y={-30} width={440} height={80} rx={10} fill="#8a5a2a" />
      <rect x={-220} y={-30} width={440} height={16} fill="#a8783a" />
      <line x1={220} y1={10} x2={300} y2={-10} stroke="#6b3a1f" strokeWidth={14} />
      {[-130, 130].map((x) => <g key={x} transform={`translate(${x} 90) rotate(${g})`}><circle r={70} fill="none" stroke="#5a3418" strokeWidth={18} />{[0, 60, 120].map((a) => <line key={a} x1={-66} y1={0} x2={66} y2={0} stroke="#5a3418" strokeWidth={10} transform={`rotate(${a})`} />)}<circle r={16} fill="#3a2418" /></g>)}
    </Obj>
  );
};
export const Banio: React.FC<Pos & { t: number }> = ({ t = 0, ...p }) => (
  <Obj {...p} t={t} w={900} h={620}>
    <rect x={-400} y={-120} width={800} height={380} fill="#e8b98a" />
    <path d="M -440 -110 L 0 -290 L 440 -110 Z" fill="#b5452c" />
    {[-260, 0, 260].map((x) => <path key={x} d={`M ${x - 80} 260 L ${x - 80} 40 Q ${x} -60 ${x + 80} 40 L ${x + 80} 260 Z`} fill="#ffb347" opacity={0.9} />)}
    {[-300, -60, 180, 320].map((x, i) => {
      const k = ((t * 0.5 + i * 0.27) % 1);
      return <circle key={x} cx={x + Math.sin(t * 2 + i) * 30} cy={-300 - k * 260} r={50 + k * 60} fill="#fff" opacity={0.5 * (1 - k)} />;
    })}
    <rect x={-400} y={250} width={800} height={30} fill="#8a4a2a" />
    {[-330, -200, 200, 330].map((x) => <g key={x}><rect x={x - 26} y={210} width={52} height={50} fill="#3a2418" /><path d={`M ${x - 18} 220 Q ${x} ${180 + Math.sin(t * 9 + x) * 14} ${x + 18} 220`} fill="#ff7a3d" /></g>)}
  </Obj>
);
export const Salon: React.FC<Pos> = (p) => (
  <Obj {...p} w={900} h={560}>
    <path d="M -420 -40 L 0 -260 L 420 -40 Z" fill="#7a5a2a" />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-380 + i * 95} y1={-40 + Math.abs(i - 4) * -40 - 30} x2={-400 + i * 100} y2={-40} stroke="#5a4020" strokeWidth={8} />)}
    <rect x={-380} y={-40} width={760} height={300} fill="#a8783a" />
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={-380 + i * 50} y1={-40} x2={-380 + i * 50} y2={260} stroke="#7a5a2a" strokeWidth={6} />)}
    <path d="M -60 260 L -60 90 Q 0 40 60 90 L 60 260 Z" fill="#3a2418" />
    <path d="M -40 260 L -40 110 Q 0 74 40 110 L 40 260 Z" fill="#ffb347" opacity={0.7} />
  </Obj>
);
// diploma de bronce (dos hojas abisagradas que se abren)
export const DiplomaBronce: React.FC<Pos & { abre?: number }> = ({ abre = 1, ...p }) => (
  <Obj {...p} w={700} h={460}>
    <defs><linearGradient id="bronceD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd59a" /><stop offset="0.5" stopColor="#c98a3a" /><stop offset="1" stopColor="#7a4a1a" /></linearGradient></defs>
    {[-1, 1].map((s) => (
      <g key={s} transform={`scale(${s === 1 ? Math.max(0.05, abre) : 1} 1)`}>
        <rect x={s === 1 ? 0 : -300} y={-200} width={300} height={400} rx={14} fill="url(#bronceD)" stroke="#7a4a1a" strokeWidth={8} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={s === 1 ? 30 : -270} y={-160 + i * 42} width={180 + ((i * 53) % 60)} height={12} rx={6} fill="#7a4a1a" opacity={0.6} />)}
      </g>
    ))}
    {[[-280, -180], [280, -180], [-280, 180], [280, 180]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={10} fill="#5a3410" />)}
    <path d="M -270 -170 Q -200 -200 -120 -186" stroke="#fff6d0" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
  </Obj>
);
// tablilla de Vindolanda en primer plano: la tinta se escribe sola
export const TablillaGrande: React.FC<{ t: number; t0: number; lineas: string[]; x?: number; y?: number; w?: number; vel?: number; titulo?: string }> = ({ t, t0, lineas, x = 960, y = 560, w = 1500, vel = 22, titulo }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 13, stiffness: 150 });
  const tot = lineas.join("").length;
  const n = Math.floor(Math.max(0, t - t0 - 0.3) * vel);
  let resto = n;
  const h = 200 + lineas.length * 92;
  // la letra se achica para que la línea más larga entre siempre en la tablilla
  const fs = Math.min(64, (w - 120) / (Math.max(...lineas.map((l) => l.length)) * 0.56));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${e}) rotate(${(1 - e) * -6 - 1.5}deg)` }}>
      <div style={{ position: "absolute", inset: 0, transform: "translate(18px,18px)", background: "rgba(20,8,40,.35)", borderRadius: 18 }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "repeating-linear-gradient(178deg, #c9a46a 0 26px, #c29c60 26px 30px, #cfaa72 30px 58px)", border: "6px solid #8a6a3a", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, background: "#8a6a3a", opacity: 0.6 }} />
        {titulo && <div style={{ position: "absolute", left: 40, top: 26, fontFamily, fontWeight: 700, fontSize: 40, color: "#7a4a1a", letterSpacing: 2 }}>{titulo}</div>}
        {lineas.map((l, i) => {
          const vis = Math.max(0, Math.min(l.length, resto));
          resto -= l.length;
          return <div key={i} style={{ position: "absolute", left: 60, top: 100 + i * 92, fontFamily: fontMano, fontWeight: 700, fontSize: fs, color: "#1d120a", whiteSpace: "nowrap" }}>{l.slice(0, vis)}{vis > 0 && vis < l.length ? <span style={{ opacity: 0.5 }}>|</span> : null}</div>;
        })}
      </div>
      {n < tot && <div />}
    </div>
  );
};
// enemigo del norte (picto) con cuerpo pintado
export const Picto: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; sube?: number; grita?: boolean }> = ({ x, y, s = 1, t, seed = 1, sube, grita }) => {
  const r = rnd(seed);
  const ph = r() * 6;
  const u = sube === undefined ? 1 : Math.min(1, Math.max(0, (t - sube) / 0.4));
  if (u <= 0) return null;
  const bob = Math.sin(t * 5 + ph) * 4;
  return (
    <svg style={{ position: "absolute", left: x - 70 * s, top: y - 240 * s, overflow: "visible" }} width={140 * s} height={240 * s} viewBox="-70 -240 140 240">
      <g transform={`translate(0 ${(1 - u) * 240 + bob})`}>
        <rect x={-6} y={-240} width={10} height={220} rx={5} fill="#3a2418" transform="rotate(10 0 -120)" />
        <path d="M 6 -246 L 22 -214 L -8 -216 Z" fill="#9aa4b4" transform="rotate(10 0 -120)" />
        <rect x={-30} y={-130} width={60} height={118} rx={20} fill="#2a2350" />
        <path d="M -20 -110 q 10 20 0 40 M 10 -100 q 14 10 4 40" stroke="#4fb0d8" strokeWidth={6} fill="none" />
        <circle cx={0} cy={-158} r={32} fill="#2a2350" />
        <path d="M -34 -170 Q -46 -214 -14 -196 Q 0 -226 16 -198 Q 46 -214 34 -170 Z" fill="#a0602c" />
        <circle cx={-11} cy={-160} r={7} fill="#fff" /><circle cx={11} cy={-160} r={7} fill="#fff" />
        <line x1={-20} y1={-174} x2={-4} y2={-168} stroke="#fff" strokeWidth={4} /><line x1={20} y1={-174} x2={4} y2={-168} stroke="#fff" strokeWidth={4} />
        {grita && <ellipse cx={0} cy={-140} rx={9} ry={8 + Math.abs(Math.sin(t * 12 + ph)) * 6} fill="#5a1a22" />}
        <rect x={-22} y={-14} width={16} height={14} fill="#2a2350" /><rect x={6} y={-14} width={16} height={14} fill="#2a2350" />
      </g>
    </svg>
  );
};
// ojos que se abren en lo oscuro
export const Ojos: React.FC<{ x: number; y: number; t: number; t0: number; s?: number; seed?: number }> = ({ x, y, t, t0, s = 1, seed = 1 }) => {
  if (t < t0) return null;
  const ph = rnd(seed)() * 3;
  const ab = Math.min(1, (t - t0) / 0.18) * ((t + ph) % 2.7 < 0.12 ? 0.1 : 1);
  return (
    <svg style={{ position: "absolute", left: x - 60 * s, top: y - 30 * s, overflow: "visible" }} width={120 * s} height={60 * s} viewBox="-60 -30 120 60">
      {[-1, 1].map((k) => <g key={k} transform={`translate(${k * 26} 0) scale(1 ${ab})`}><ellipse rx={20} ry={13} fill="#ffe27a" /><ellipse rx={6} ry={11} fill={TINTA} /></g>)}
      <line x1={-46} y1={-22} x2={-10} y2={-12} stroke="#ffe27a" strokeWidth={6} strokeLinecap="round" /><line x1={46} y1={-22} x2={10} y2={-12} stroke="#ffe27a" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};
// rayitas de conteo raspadas en la piedra
export const Rayitas: React.FC<{ t: number; t0: number; t1: number; n: number; x: number; y: number; s?: number }> = ({ t, t0, t1, n, x, y, s = 1 }) => {
  const k = Math.floor(n * prog(t, t0, t1));
  if (t < t0) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      {Array.from({ length: k }, (_, i) => {
        const g = Math.floor(i / 5), j = i % 5;
        const gx = (g % 3) * 150 * s, gy = Math.floor(g / 3) * 110 * s;
        return j < 4
          ? <line key={i} x1={gx + j * 26 * s} y1={gy} x2={gx + j * 26 * s + 6 * s} y2={gy + 80 * s} stroke="#2a1530" strokeWidth={9 * s} strokeLinecap="round" />
          : <line key={i} x1={gx - 14 * s} y1={gy + 66 * s} x2={gx + 104 * s} y2={gy + 12 * s} stroke={C.rojo} strokeWidth={9 * s} strokeLinecap="round" />;
      })}
    </svg>
  );
};
// pin numerado de trampa sobre un milecastle
export const Pin: React.FC<{ t: number; t0: number; n: number; x: number; y: number; s?: number; icono?: string; act?: boolean }> = ({ t, t0, n, x, y, s = 1, icono, act }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 200 });
  const p = act ? 1 + 0.12 * Math.sin(t * 8) : 1;
  return (
    <div style={{ position: "absolute", left: x - 90 * s, top: y - 230 * s, width: 180 * s, height: 230 * s, transform: `scale(${e * p})`, transformOrigin: "50% 100%" }}>
      <svg width={180 * s} height={230 * s} viewBox="-90 -230 180 230" style={{ overflow: "visible" }}>
        <path d="M 0 0 Q -80 -110 -80 -150 A 80 80 0 1 1 80 -150 Q 80 -110 0 0 Z" fill={C.rojo} stroke="#fff" strokeWidth={10} />
        <text x={0} y={-118} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={96} fill="#fff">{n}</text>
      </svg>
      {icono && <div style={{ position: "absolute", left: -60 * s, right: -60 * s, top: -70 * s, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 44 * s, color: "#fff", WebkitTextStroke: `${6 * s}px ${TINTA}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{icono}</div>}
    </div>
  );
};
// globito de pensamiento con contenido
export const Burbuja: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; r?: number; children: React.ReactNode }> = ({ t, t0, t1, x, y, r = 300, children }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0) * interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${e})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", boxShadow: "0 12px 0 rgba(20,8,40,.3)" }} />
      <div style={{ position: "absolute", inset: 14, borderRadius: "50%", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
export const Easing_ = Easing;


// gestos sincronizados: devuelve props de Persona para el beat activo (sirve para cualquier personaje ya puesto)
export const gesto = (t: number, beats: [number, Gesto][]) => {
  let i = 0;
  for (let k = 0; k < beats.length; k++) if (beats[k][0] <= t) i = k;
  const [tb, g] = beats[i];
  const d = t - tb;
  const ciclo = (f: number, a: number) => Math.sin(d * f) * a;
  let expr: Expr = "neutro", habla = false, bI = 8, bD = 8, cI = 10, cD = 10, inclina = 0, salta: number | undefined, ladea = 0, dy = 0, dx = 0;
  switch (t < beats[0][0] ? "nada" : g) {
    case "señala": bD = 115 + ciclo(5, 6); cD = 5; expr = "sorpresa"; habla = true; inclina = 4; break;
    case "habla": bD = 50 + ciclo(4, 25); cD = 60 + ciclo(3, 20); bI = 30 + ciclo(3.3, 15); habla = true; expr = "neutro"; break;
    case "sorpresa": bD = 150; bI = 150; cD = 30; cI = 30; expr = "sorpresa"; salta = tb; break;
    case "miedo": bD = 120 + ciclo(30, 4); bI = 120 + ciclo(31, 4); cD = 110; cI = 110; expr = "miedo"; dx = ciclo(40, 3); inclina = -6; break;
    case "tiembla": bD = 70; bI = 70; cD = 140; cI = 140; expr = "triste"; dx = ciclo(45, 4); break;
    case "cava": bD = 60 + ciclo(7, 45); bI = 40 + ciclo(7, 45); cD = 40; cI = 40; inclina = 12 + ciclo(7, 8); expr = "enojado"; break;
    case "carga": bD = 165; bI = 165; cD = 20; cI = 20; inclina = -4; expr = "enojado"; dy = Math.abs(ciclo(6, 6)); break;
    case "lee": bD = 75; bI = 75; cD = 95; cI = 95; expr = "neutro"; ladea = ciclo(1.5, 5); inclina = 6; break;
    case "festeja": bD = 160 + ciclo(9, 15); bI = 160 + ciclo(9, 15); cD = 20; cI = 20; expr = "feliz"; salta = tb + Math.floor(d / 0.8) * 0.8; habla = true; break;
    case "niega": bD = 40; bI = 40; cD = 90; cI = 90; expr = "enojado"; ladea = ciclo(10, 10); habla = true; break;
    case "encoge": bD = 50; bI = 50; cD = 120 + ciclo(3, 10); cI = 120 + ciclo(3, 10); expr = "triste"; ladea = 8; break;
    case "duerme": bD = 10; bI = 10; expr = "dormido"; inclina = 6 + ciclo(1.2, 3); break;
    case "triste": bD = 15; bI = 15; expr = "triste"; inclina = 8; ladea = -6; break;
    case "enojado": bD = 100 + ciclo(8, 25); cD = 70; bI = 20; expr = "enojado"; habla = true; break;
    case "escribe": bD = 70 + ciclo(12, 6); cD = 100 + ciclo(9, 8); bI = 60; cI = 90; expr = "neutro"; inclina = 10; break;
    case "golpea": bD = 120 + Math.abs(ciclo(9, 50)); cD = 30; expr = "enojado"; habla = true; break;
    default: break;
  }
  return { expr, habla, bI, bD, cI, cD, inclina, salta, ladea, dx, dy };
};

// ── ACTÚA: personaje de cuerpo entero que entra caminando, frena y hace gestos sincronizados a la voz.
// beats = [t, gesto] en orden; el gesto vale desde su t hasta el siguiente. Nunca queda clavado: cada gesto tiene su ciclo.
export type Gesto = "camina" | "señala" | "habla" | "sorpresa" | "miedo" | "tiembla" | "cava" | "carga" | "lee" | "festeja" | "niega" | "encoge" | "duerme" | "triste" | "enojado" | "escribe" | "golpea";
export const Actua: React.FC<{ t: number; beats: [number, Gesto][]; x0: number; x1: number; y: number; h?: number; quien?: number; frio?: boolean; manoD?: React.ReactNode; manoI?: React.ReactNode; vuelta?: number; sale?: number; casco?: boolean; ropa?: RopaT }> = ({ t, beats, x0, x1, y, h = 300, quien = -1, frio, manoD, manoI, vuelta, sale, casco = true, ropa }) => {
  if (!beats.length || t < beats[0][0]) return null;
  let i = 0;
  for (let k = 0; k < beats.length; k++) if (beats[k][0] <= t) i = k;
  const [tb, g] = beats[i];
  const d = t - tb;
  // camina desde x0 hasta x1 en el primer beat "camina"; si hay "sale", se va por x0
  const tc = beats[0][0];
  const llega = beats.length > 1 ? beats[1][0] : tc + 1.2;
  let x = interpolate(t, [tc, llega], [x0, x1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  if (sale !== undefined && t > sale) x = interpolate(t, [sale, sale + 1.4], [x1, x0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const anda = (t < llega && g === "camina") || (sale !== undefined && t > sale);
  const flip = sale !== undefined && t > sale ? x0 > x1 : x0 > x1 ? true : false;
  const G = gesto(t, beats);
  const { expr, habla, bI, bD, cI, cD, inclina, salta, ladea } = G, dx = G.dx, dy = G.dy;
  const P = { x: x + dx, y: y + dy, h, t, expr, habla, camina: anda ? 1.3 : 0, bI, bD, cI, cD, inclina, salta, ladea, flip: vuelta !== undefined && t > vuelta ? !flip : flip, manoD, manoI };
  if (ropa) return <Persona {...P} seed={40 + quien} ropa={ropa} casco={casco ? "legion" : "no"} />;
  return quien < 0 ? <Yo {...P} frio={frio} casco={casco} /> : <Otro {...P} i={quien} casco={casco} />;
};

// termómetro que baja/sube con número que corre
export const Termometro: React.FC<{ t: number; t0: number; de: number; a: number; dur?: number; x: number; y: number; s?: number }> = ({ t, t0, de, a, dur = 1.2, x, y, s = 1 }) => {
  if (t < t0) return null;
  const k = prog(t, t0 + 0.2, t0 + 0.2 + dur);
  const v = Math.round(de + (a - de) * k);
  const f = Math.max(0.08, Math.min(1, (v + 5) / 45));
  const col = v > 20 ? C.rojo : v > 10 ? C.naranja : "#4ab8ff";
  return (
    <div style={{ position: "absolute", left: x - 70 * s, top: y - 260 * s, width: 140 * s, height: 420 * s, transform: `scale(${ent(t, t0)})` }}>
      <div style={{ position: "absolute", left: 40 * s, top: 0, width: 60 * s, height: 320 * s, borderRadius: 30 * s, background: "#fff", border: `${6 * s}px solid #2a1530` }} />
      <div style={{ position: "absolute", left: 56 * s, top: (16 + 290 * (1 - f)) * s, width: 28 * s, height: 290 * f * s, borderRadius: 14 * s, background: col }} />
      <div style={{ position: "absolute", left: 20 * s, top: 290 * s, width: 100 * s, height: 100 * s, borderRadius: "50%", background: col, border: `${6 * s}px solid #2a1530` }} />
      <div style={{ position: "absolute", left: -60 * s, width: 260 * s, top: 400 * s, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 64 * s, color: "#fff", WebkitTextStroke: `${8 * s}px #2a1530`, paintOrder: "stroke fill" }}>{v}°C</div>
    </div>
  );
};
