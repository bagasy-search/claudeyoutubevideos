// ruth29a «Fire Ant War» · componentes únicos (uno por minuto). Cada uno es un OBJETO de la mesa de Ruth (papeles, frascos,
// mapas, sellos) que cuenta la idea de ese segundo; viven dentro del Stage (foto del momento desenfocada + piso + luz + polvo)
// y entran de a uno con resorte. Sin rótulos en la esquina superior izquierda.
import React from "react";
import { Img } from "remotion";
import { H, Mode, Stage, phys, cl, eio, eIn, TX, DIM, AMB, RED, MARK, HAND, img } from "./hkit";
import { FONT } from "./lib";

export const pop = (tt: number, at: number, w = 7, z = 0.45) => phys(tt, at, w, z);
export const At: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; ry?: number; rx?: number; children: React.ReactNode }> = ({ x, y, s = 1, r = 0, o = 1, ry = 0, rx = 0, children }) =>
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${r}deg) scale(${s})`, opacity: cl(o) }}>{children}</div>;
const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode }> = ({ t, h, f }) => <Stage t={t} h={h} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
const bt = (h: H, i: number, d: number) => (h.bt && h.bt[i] != null ? h.bt[i] : d);
export const PAPER = "linear-gradient(160deg,#f3ead6,#e2d4b4)", MANILA = "linear-gradient(160deg,#e8cf94,#c9a965)", INK = "#2a2118", STAMP = "#b3322a";
const shadow = "0 50px 110px rgba(0,0,0,.65)";
// sello de goma que cae con peso y queda torcido
export const Stamp: React.FC<{ tt: number; at: number; txt: string; x: number; y: number; r?: number; size?: number; col?: string }> = ({ tt, at, txt, x, y, r = -9, size = 70, col = STAMP }) => {
  const s = pop(tt, at, 9, 0.35); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${2.2 - 1.2 * s})`, opacity: cl(s * 1.6) * 0.92, border: `7px solid ${col}`, borderRadius: 10, padding: "6px 26px", color: col, fontFamily: MARK, fontSize: size, letterSpacing: 4, whiteSpace: "nowrap", mixBlendMode: "multiply" }}>{txt}</div>;
};
// hormiga colorada vista de arriba (cabeza, tórax, abdomen, 6 patas que caminan)
export const Ant: React.FC<{ x: number; y: number; s?: number; r?: number; tt?: number; col?: string; o?: number }> = ({ x, y, s = 1, r = 0, tt = 0, col = "#9b2a14", o = 1 }) => {
  const w = Math.sin(tt * 22) * 9;
  return <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - 60, top: y - 60, transform: `rotate(${r}deg) scale(${s})`, opacity: o, overflow: "visible" }}>
    {[-1, 1].map((sd) => [-14, 0, 14].map((yy, i) => <path key={sd + "" + i} d={`M0 ${yy} L${sd * 30} ${yy - 10 + (i % 2 ? w : -w) * sd * 0.6} L${sd * 40} ${yy + 6}`} stroke={col} strokeWidth={3} fill="none" />))}
    <ellipse cx={0} cy={-28} rx={10} ry={11} fill={col} /><ellipse cx={0} cy={-6} rx={8} ry={13} fill={col} /><ellipse cx={0} cy={24} rx={15} ry={21} fill={col} />
    <path d={`M-5 -38 Q-14 -54 -20 -50 M5 -38 Q14 -54 20 -50`} stroke={col} strokeWidth={2.5} fill="none" />
  </svg>;
};

// m0 · el avión amarillo bajo sobre el potrero, la nube blanca que baja sobre las vacas
export const HPlaneDust: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const px = 2200 - eio(tt, 0.3, 9) * 2700, py = 360 + 18 * Math.sin(tt * 1.3);
  return <>
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 820, borderRadius: 24, overflow: "hidden", boxShadow: shadow, background: "linear-gradient(#f6c98a 0%,#f3dcb0 38%,#c9d6a0 52%,#6f8c3c 70%,#4f6a2a 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, height: 6, background: "rgba(80,90,40,.4)" }} />
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 180 + i * 190 + (i % 2) * 40, top: 560 + (i % 3) * 50, width: 110, height: 52, borderRadius: "40% 45% 30% 30%", background: i % 2 ? "#3a2a1c" : "#6b4a2c", boxShadow: "0 10px 0 -4px rgba(0,0,0,.25)" }} />)}
      {Array.from({ length: 70 }, (_, i) => {
        const born = 0.3 + i * 0.075, age = tt - born; if (age < 0) return null;
        const bx = 2200 - eio(born, 0.3, 9) * 2700 - 160 + (i % 5) * 9, x = bx - 140 + 30 * Math.sin(i), y = 380 + age * 70 + (i % 7) * 6, r = 40 + age * 46;
        return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "rgba(250,250,245,.32)", filter: `blur(${10 + age * 6}px)`, opacity: cl(1 - age / 6) }} />;
      })}
      <svg width={360} height={160} viewBox="0 0 360 160" style={{ position: "absolute", left: px - 160, top: py - 80, transform: `rotate(${-3 + 2 * Math.sin(tt * 1.7)}deg)` }}>
        <rect x={40} y={70} width={240} height={34} rx={17} fill="#e8b81c" /><rect x={110} y={40} width={110} height={10} rx={4} fill="#d9a612" /><rect x={110} y={110} width={110} height={10} rx={4} fill="#d9a612" />
        <line x1={150} y1={50} x2={150} y2={110} stroke="#5a4a20" strokeWidth={4} /><line x1={190} y1={50} x2={190} y2={110} stroke="#5a4a20" strokeWidth={4} />
        <path d="M280 72 L340 52 L340 112 L280 100 Z" fill="#d9a612" /><ellipse cx={40} cy={87} rx={6} ry={36 * Math.abs(Math.sin(tt * 40))} fill="rgba(60,60,60,.6)" />
        <circle cx={150} cy={66} r={9} fill="#3a3020" />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 960, top: 990, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 6, color: TX, whiteSpace: "nowrap", opacity: cl(pop(tt, 3.6) * 1.5), textShadow: "0 6px 24px #000" }}>AUGUST 1958 · SOUTH ALABAMA</div>
  </>;
}} />;

// m1 · la carpeta del caso: tres pestañas que se levantan de a una (quién decidió / quién avisó / quién pagó)
export const HCaseFile: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const open = eio(tt, 0.2, 1.4), tabs = ["WHO DECIDED?", "WHO SAID STOP?", "WHY WAS THE CURE WORSE?"], at = [0.9, bt(h, 0, 3), bt(h, 1, 5.5)];
  return <At x={960} y={560} rx={40 - 14 * open}>
    <div style={{ width: 1300, height: 760, position: "relative", transformStyle: "preserve-3d" }}>
      {tabs.map((tb, i) => { const u = pop(tt, at[i], 7, 0.4); return <div key={i} style={{ position: "absolute", left: 120 + i * 360, top: 40 - 250 * u, width: 340, height: 520, borderRadius: "12px 12px 4px 4px", background: PAPER, boxShadow: "0 20px 40px rgba(0,0,0,.4)", padding: 26, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: INK, lineHeight: 1.05 }}>
        <div style={{ width: 70, height: 6, background: STAMP, marginBottom: 18, transform: `scaleX(${u})`, transformOrigin: "0 0" }} />{tb}</div>; })}
      <div style={{ position: "absolute", left: 0, top: 150, right: 0, bottom: 0, borderRadius: 14, background: MANILA, boxShadow: shadow }}>
        <div style={{ position: "absolute", left: 60, bottom: 60, fontFamily: MARK, fontSize: 66, color: "#6a3a1a", opacity: 0.85 }}>FIRE ANT PROGRAM · 1957</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, right: 0, height: 610, borderRadius: 14, background: "linear-gradient(170deg,#efd8a2,#d3b474)", transformOrigin: "50% 0", transform: `rotateX(${-170 * open}deg)`, backfaceVisibility: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }} />
    </div>
  </At>;
}} />;

// m2 · bajo la lupa: la hormiga junto a un grano de arroz, misma escala
export const HRiceScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.2, 5, 0.5), sweep = eio(tt, 1.2, 3.2);
  return <>
    <At x={960} y={540} s={0.85 + 0.15 * s}>
      <div style={{ width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#f7f1e3,#d8ccb0 70%)", border: "26px solid #3a2a1a", boxShadow: `${shadow}, inset 0 0 60px rgba(0,0,0,.25)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 120, top: 300, width: 220, height: 92, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffefa,#e7e1d2)", boxShadow: "0 18px 26px rgba(0,0,0,.25)", transform: `rotate(-8deg) scale(${pop(tt, 0.7)})` }} />
        <Ant x={500} y={340} s={2.6 * pop(tt, 1.1)} r={-80 + 6 * Math.sin(tt)} tt={tt} />
        <svg width={700} height={120} style={{ position: "absolute", left: 30, top: 470 }}>{Array.from({ length: 31 }, (_, i) => <line key={i} x1={20 + i * 21} y1={20} x2={20 + i * 21} y2={i % 10 === 0 ? 70 : i % 5 === 0 ? 55 : 42} stroke={INK} strokeWidth={3} opacity={cl(sweep * 31 - i)} />)}
          <line x1={20} y1={20} x2={20 + 630 * sweep} y2={20} stroke={INK} strokeWidth={3} /></svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: HAND, fontSize: 64, color: INK, opacity: cl(sweep * 2 - 1) }}>≈ 3 mm</div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 22%,rgba(255,255,255,.45),transparent 30%)" }} />
      </div>
    </At>
    <div style={{ position: "absolute", left: 1180, top: 760, width: 420, height: 60, borderRadius: 30, background: "linear-gradient(90deg,#2a1c10,#5a3a20)", transform: `rotate(38deg) scaleX(${s})`, transformOrigin: "0 50%", boxShadow: shadow }} />
  </>;
}} />;

// m3 · la ruta del barco: del río Paraná al puerto de Mobile, en el lastre de tierra
export const HPortRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = eio(tt, 0.8, 5.2), pts = (u: number) => { const x = 1180 - 740 * u + 260 * Math.sin(u * Math.PI) * 0.9, y = 860 - 640 * u; return [x, y]; };
  const [sx, sy] = pts(d), [sx2, sy2] = pts(Math.min(1, d + 0.01));
  return <At x={960} y={540} rx={18} s={0.96 + 0.04 * pop(tt, 0)}>
    <div style={{ width: 1500, height: 900, borderRadius: 18, background: "radial-gradient(ellipse at 60% 40%,#2c5d7a,#173548)", boxShadow: shadow, position: "relative", overflow: "hidden" }}>
      <svg width={1500} height={900} style={{ position: "absolute", inset: 0 }}>
        <path d="M120 0 L700 0 L620 120 L470 160 L430 260 L300 230 L210 120 Z" fill="#c9b98a" stroke="#8a7a50" strokeWidth={3} />
        <path d="M1000 560 L1300 520 L1440 640 L1400 900 L1080 900 L980 760 Z" fill="#c9b98a" stroke="#8a7a50" strokeWidth={3} />
        <path d="M1100 620 Q1180 720 1250 860" stroke="#5aa0c8" strokeWidth={6} fill="none" />
        <path d={Array.from({ length: 41 }, (_, i) => { const [x, y] = pts(i / 40); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ")} stroke="#f3ead6" strokeWidth={5} strokeDasharray="18 16" fill="none" opacity={0.85} style={{ clipPath: `inset(${(1 - d) * 100}% 0 0 0)` }} />
        <circle cx={470} cy={215} r={16 + 6 * Math.sin(tt * 4)} fill={RED} opacity={cl(d * 3 - 2.2)} />
      </svg>
      <div style={{ position: "absolute", left: sx - 50, top: sy - 30, transform: `rotate(${Math.atan2(sy2 - sy, sx2 - sx) * 57.3}deg)` }}>
        <div style={{ width: 100, height: 34, borderRadius: "6px 30px 30px 6px", background: "#2a2a2a", boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} /><div style={{ position: "absolute", left: 22, top: -18, width: 34, height: 20, background: "#6b4a2c" }} />
      </div>
      <div style={{ position: "absolute", left: 1090, top: 470, fontFamily: HAND, fontSize: 50, color: "#f3ead6", opacity: cl(pop(tt, 0.4) * 1.4) }}>Paraná River</div>
      <div style={{ position: "absolute", left: 380, top: 250, fontFamily: HAND, fontSize: 58, color: "#fff", opacity: cl(d * 3 - 2.2) }}>Mobile, Alabama</div>
      <div style={{ position: "absolute", right: 60, top: 50, fontFamily: MARK, fontSize: 80, color: "#f3ead6", opacity: cl(pop(tt, 2.5)) }}>1930s</div>
    </div>
  </At>;
}} />;

// m3-4 · la libreta del chico de 13 años: el lápiz escribe el hallazgo
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lines = ["Mobile, 1942", "red ants — big mound", "vacant lot by the house", "— E.O.W., age 13"], per = 1.3;
  const tot = lines.join("").length, done = Math.max(0, (tt - 0.8) / (per * lines.length)) * tot;
  let acc = 0;
  return <At x={960} y={560} rx={30} r={-3 + Math.sin(tt * 0.3)}>
    <div style={{ width: 1100, height: 760, borderRadius: 10, background: "repeating-linear-gradient(#fbf7ec 0 74px,#9fbdd8 74px 77px)", boxShadow: shadow, position: "relative", padding: "90px 80px 0 150px" }}>
      <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 3, background: "#e08a8a" }} />
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 22, top: 40 + i * 72, width: 46, height: 46, borderRadius: "50%", border: "6px solid #8a8f96", background: "#2a2a2a" }} />)}
      {lines.map((l, i) => { const n = Math.max(0, Math.min(l.length, Math.floor(done - acc))); acc += l.length; return <div key={i} style={{ fontFamily: HAND, fontSize: 70, color: "#23324f", height: 77, lineHeight: "77px" }}>{l.slice(0, n)}</div>; })}
      <Ant x={880} y={260} s={0.9 * pop(tt, 2.2)} r={30} tt={tt} />
    </div>
  </At>;
}} />;

// m4 · el hormiguero en corte (túneles) y la barra de la segadora que se traba contra él
export const HMoundMower: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.2, 5, 0.55), hit = bt(h, 0, 5), mx = -700 + eio(tt, hit - 2, hit) * 760, jolt = tt > hit ? Math.exp(-(tt - hit) * 5) * Math.sin((tt - hit) * 60) * 16 : 0;
  return <>
    <At x={1060} y={600} s={0.9 + 0.1 * s}>
      <svg width={1100} height={620} viewBox="0 0 1100 620">
        <rect x={0} y={330} width={1100} height={290} fill="#5b3d22" /><rect x={0} y={322} width={1100} height={14} fill="#6c8f34" />
        <path d={`M240 336 Q550 ${336 - 300 * s} 860 336 Z`} fill="#8a5a32" />
        {[[550, 120, 0.8], [470, 230, 1.2], [620, 270, 1.5], [520, 340, 1.8], [400, 380, 2.1], [680, 390, 2.4]].map(([x, y, d], i, A) => { const u = eio(tt, d, d + 0.6); const pr = A[Math.max(0, i - 1)];
          return <g key={i} opacity={u}><line x1={pr[0]} y1={pr[1] + 336 - 200} x2={x} y2={y + 336 - 200} stroke="#3a2412" strokeWidth={14} /><ellipse cx={x} cy={y + 336 - 200} rx={46} ry={24} fill="#2a180a" /></g>; })}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={470 + ((i * 53 + tt * 60) % 260)} cy={330 + 100 * Math.sin(i * 1.7 + tt)} r={6} fill="#c23a1a" />)}
        <line x1={900} y1={336} x2={900} y2={336 - 300 * s} stroke={TX} strokeWidth={4} /><text x={920} y={336 - 150 * s} fill={TX} fontFamily={HAND} fontSize={52}>1 ft +</text>
      </svg>
    </At>
    <div style={{ position: "absolute", left: mx, top: 520 + jolt, width: 720, height: 46, background: "repeating-linear-gradient(90deg,#c9cdd2 0 40px,#7c8188 40px 46px)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", boxShadow: "0 16px 30px rgba(0,0,0,.6)" }} />
    {tt > hit && <div style={{ position: "absolute", left: 700, top: 470, fontFamily: MARK, fontSize: 90, color: RED, transform: `rotate(-8deg) scale(${pop(tt, hit, 9, 0.35)})` }}>CLANG</div>}
  </>;
}} />;

// m5 · los fajos que se apilan hasta 2,4 millones (Congreso, 1957)
export const HMoneyStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = Math.floor(cl((tt - 0.4) / 3.6) * 24), v = Math.round(cl((tt - 0.4) / 3.6) * 2.4 * 10) / 10;
  return <>
    <At x={760} y={700} rx={52} r={-14}>
      <div style={{ width: 600, height: 600, position: "relative", transformStyle: "preserve-3d" }}>
        {Array.from({ length: 24 }, (_, i) => i < n && <div key={i} style={{ position: "absolute", left: 60 + (i % 3) * 8, top: 120 + (i % 2) * 6, width: 480, height: 230, borderRadius: 8, background: "linear-gradient(135deg,#a9c79a,#6f9364)", border: "3px solid #3f5e38", transform: `translateY(${-i * 13}px)`, boxShadow: "0 3px 0 #e8f0de, 0 6px 10px rgba(0,0,0,.35)" }}>
          <div style={{ position: "absolute", left: 190, top: 0, width: 80, height: "100%", background: "#c9b47a" }} /></div>)}
      </div>
    </At>
    <div style={{ position: "absolute", left: 1150, top: 380, fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#cde7b8", textShadow: "0 12px 40px #000" }}>${v.toFixed(1)}M</div>
    <div style={{ position: "absolute", left: 1160, top: 590, fontFamily: HAND, fontSize: 62, color: TX, opacity: cl(pop(tt, 2.8)) }}>Congress, 1957 — goal: eradication</div>
  </>;
}} />;

// m5-6 · «la última»: el contador baja de un millón y se traba en 1 — nunca llega a cero
export const HLastAnt: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = cl((tt - 0.4) / 4.2), v = Math.max(1, Math.round(1000000 * Math.pow(1 - k, 4))), stuck = tt > 4.6, bl = stuck ? (Math.sin(tt * 9) > 0 ? 1 : 0.35) : 1;
  return <At x={960} y={540}>
    <div style={{ width: 1200, height: 520, borderRadius: 30, background: "linear-gradient(#1b1d20,#0e0f11)", boxShadow: `${shadow}, inset 0 0 0 6px #33363b`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: DIM }}>ANTS LEFT</div>
      <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 210, color: stuck ? RED : "#ffcf6a", opacity: bl, textShadow: `0 0 40px ${stuck ? RED : "#ffb340"}` }}>{v.toLocaleString("en-US")}</div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: TX, opacity: cl(pop(tt, 5)) }}>the goal was zero. Every last one.</div>
    </div>
    {stuck && <Ant x={1080} y={60} s={1.4} r={200 + 20 * Math.sin(tt * 2)} tt={tt} />}
  </At>;
}} />;

// m6 · un acre visto en perspectiva y los gránulos que llueven: 2 libras por acre
export const HAcreSquare: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const f = eio(tt, 0.8, 5);
  return <>
    <At x={960} y={620} rx={62} r={-30} s={0.95}>
      <div style={{ width: 860, height: 860, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.08) 0 2px,transparent 2px 86px),repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 86px),linear-gradient(135deg,#7a9b44,#56742c)", boxShadow: shadow, position: "relative" }}>
        {Array.from({ length: 160 }, (_, i) => { const a = (i * 0.618) % 1, x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * 840, y = (Math.sin(i * 78.233) * 12345.678 % 1 + 1) % 1 * 840; return a < f ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 9, height: 9, borderRadius: "50%", background: "#efe6cf", boxShadow: "0 0 6px rgba(255,255,255,.6)" }} /> : null; })}
      </div>
    </At>
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 0.9 + i / 40) % 1; return tt > 0.6 && tt < 5.4 ? <div key={i} style={{ position: "absolute", left: 600 + (i * 97) % 760, top: 80 + ph * 560, width: 7, height: 16, borderRadius: 4, background: "#f3ead6", opacity: 0.7 * Math.sin(ph * Math.PI) }} /> : null; })}
    <div style={{ position: "absolute", left: 1460, top: 200, width: 260, height: 300, borderRadius: 20, background: "linear-gradient(#c9cdd2,#8a9099)", boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - pop(tt, 1.4)) * -400}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#22262b" }}>2 lb</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#3a3f45", letterSpacing: 4 }}>PER ACRE</div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 990, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 62, color: TX, opacity: cl(pop(tt, 4)) }}>…talk of up to 20 million acres</div>
  </>;
}} />;

// m6-7 · las cartas de advertencia llegan de a una… y a cada una le cae el sello ARCHIVADO
export const HWarnLetters: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["Wildlife biologists", "This will kill fish and birds."], ["Fish & Wildlife Service", "We have serious questions."], ["State game departments", "Please reconsider."], ["Ant experts", "Eradication is not possible."]];
  const at = [0.4, bt(h, 0, 2.4), bt(h, 1, 4.2), bt(h, 2, 6)];
  return <>{L.map(([from, msg], i) => { const s = pop(tt, at[i], 6, 0.5); if (s <= 0.01) return null; return <div key={i} style={{ position: "absolute", left: 180 + i * 400, top: 230 + (i % 2) * 70, transform: `translateY(${(1 - s) * 700}px) rotate(${-6 + i * 4}deg)` }}>
    <div style={{ width: 380, height: 500, background: PAPER, boxShadow: shadow, padding: "40px 34px", position: "relative" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: "#5a4a32" }}>{from.toUpperCase()}</div>
      <div style={{ height: 3, background: "#5a4a32", opacity: 0.4, margin: "16px 0 22px" }} />
      <div style={{ fontFamily: HAND, fontSize: 50, color: "#23324f", lineHeight: 1.1 }}>{msg}</div>
      <Stamp tt={tt} at={at[i] + 1.1} txt="FILED" x={190} y={380} r={-14} size={64} />
    </div></div>; })}</>;
}} />;

// m7 · el pizarrón de conteo de codornices: ANTES con palotes, DESPUÉS vacío
export const HQuailTally: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = Math.floor(cl((tt - 0.6) / 2.4) * 23);
  const tally = (k: number) => Array.from({ length: k }, (_, i) => { const g = Math.floor(i / 5), j = i % 5; return j === 4
    ? <line key={i} x1={g * 150 - 8} y1={20} x2={g * 150 + 110} y2={110} stroke="#f3f0e6" strokeWidth={8} strokeLinecap="round" />
    : <line key={i} x1={g * 150 + j * 26} y1={10} x2={g * 150 + j * 26 + 4} y2={120} stroke="#f3f0e6" strokeWidth={8} strokeLinecap="round" />; });
  return <At x={960} y={540} rx={14}>
    <div style={{ width: 1440, height: 780, borderRadius: 16, background: "radial-gradient(ellipse at 40% 30%,#2f4a3a,#1c2e24)", border: "26px solid #6b4a2c", boxShadow: shadow, position: "relative" }}>
      <div style={{ position: "absolute", left: 80, top: 60, fontFamily: HAND, fontSize: 80, color: "#f3f0e6" }}>Coveys counted — BEFORE</div>
      <svg width={1200} height={140} style={{ position: "absolute", left: 90, top: 190 }}>{tally(n)}</svg>
      <div style={{ position: "absolute", left: 80, top: 400, fontFamily: HAND, fontSize: 80, color: "#f3f0e6", opacity: cl(pop(tt, 3.6)) }}>AFTER the spraying</div>
      <div style={{ position: "absolute", left: 120, top: 520, fontFamily: HAND, fontSize: 140, color: "#ff8a7a", opacity: cl(pop(tt, 4.6)), transform: `scale(${0.8 + 0.2 * pop(tt, 4.6)})`, transformOrigin: "0 50%" }}>0</div>
      {Array.from({ length: 5 }, (_, i) => <svg key={i} width={120} height={80} style={{ position: "absolute", left: 600 + i * 150, top: 560 - eio(tt, 4 + i * 0.15, 6) * 300, opacity: 1 - eio(tt, 4 + i * 0.15, 6) }}>
        <ellipse cx={60} cy={45} rx={42} ry={28} fill="#c9b48a" /><circle cx={98} cy={30} r={16} fill="#c9b48a" /><path d="M110 30 L124 34 L110 38" fill="#c9b48a" /></svg>)}
    </div>
  </At>;
}} />;

// m8 · la botella de leche se llena… y le cuelga la etiqueta NO SE PUEDE VENDER (FDA 1959)
export const HMilkBottle: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fill = eio(tt, 0.4, 3), tag = pop(tt, 3.4, 4, 0.18), sw = tt > 3.4 ? 14 * Math.exp(-(tt - 3.4) * 1.2) * Math.sin((tt - 3.4) * 5) : 0;
  return <>
    <At x={840} y={560}>
      <svg width={420} height={760} viewBox="0 0 420 760">
        <defs><clipPath id="mb"><path d="M150 20 L270 20 L270 140 Q370 200 370 320 L370 700 Q370 740 330 740 L90 740 Q50 740 50 700 L50 320 Q50 200 150 140 Z" /></clipPath></defs>
        <g clipPath="url(#mb)"><rect x={0} y={0} width={420} height={760} fill="rgba(220,235,240,.25)" />
          <rect x={0} y={740 - 640 * fill} width={420} height={760} fill="#fbfbf6" /><path d={`M0 ${740 - 640 * fill} Q105 ${730 - 640 * fill + 10 * Math.sin(tt * 3)} 210 ${740 - 640 * fill} T420 ${740 - 640 * fill}`} fill="#fff" /></g>
        <path d="M150 20 L270 20 L270 140 Q370 200 370 320 L370 700 Q370 740 330 740 L90 740 Q50 740 50 700 L50 320 Q50 200 150 140 Z" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={8} />
        <rect x={140} y={4} width={140} height={30} rx={8} fill="#c9cdd2" /><rect x={90} y={300} width={30} height={380} rx={14} fill="rgba(255,255,255,.35)" />
      </svg>
    </At>
    {tag > 0.01 && <div style={{ position: "absolute", left: 980, top: 300, transformOrigin: "0 0", transform: `rotate(${-6 + sw}deg)` }}>
      <svg width={120} height={120} style={{ position: "absolute", left: -110, top: -10 }}><path d="M0 10 Q60 40 110 20" stroke="#c9b48a" strokeWidth={4} fill="none" /></svg>
      <div style={{ width: 520, padding: "34px 40px", background: PAPER, borderRadius: "10px 40px 10px 10px", boxShadow: shadow, transform: `scale(${tag})`, transformOrigin: "0 0" }}>
        <div style={{ fontFamily: MARK, fontSize: 70, color: STAMP }}>NOT FOR SALE</div>
        <div style={{ fontFamily: HAND, fontSize: 48, color: INK, marginTop: 10 }}>FDA, 1959: zero heptachlor allowed in milk</div>
      </div>
    </div>}
  </>;
}} />;

// m8-9 · la cincha: Agricultura tira para un lado, la FDA para el otro, y el balde del granjero en el medio
export const HTugOfWar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.3, 5, 0.5), j = 22 * Math.sin(tt * 2.1) + 8 * Math.sin(tt * 5.3);
  const side = (x: number, label: string, sub: string, col: string, d: number) => <div style={{ position: "absolute", left: x, top: 330, width: 380, padding: "30px 30px", borderRadius: 16, background: col, boxShadow: shadow, transform: `translateY(${(1 - pop(tt, d)) * 500}px)`, fontFamily: FONT, color: "#fff" }}>
    <div style={{ fontWeight: 900, fontSize: 64 }}>{label}</div><div style={{ fontFamily: HAND, fontSize: 46, marginTop: 6 }}>{sub}</div></div>;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M440 600 Q${960 + j} ${640 + 20 * Math.sin(tt * 3)} 1480 600`} stroke="#c9a65a" strokeWidth={26} fill="none" strokeDasharray={`${1100 * s} 2000`} strokeLinecap="round" />
      <path d={`M440 600 Q${960 + j} ${640 + 20 * Math.sin(tt * 3)} 1480 600`} stroke="#8a6a2a" strokeWidth={26} fill="none" strokeDasharray="6 22" opacity={0.6 * s} />
    </svg>
    {side(80, "USDA", "spray the pasture", "#3a5a2a", 0.6)}{side(1460, "FDA", "not one trace in milk", "#5a2a2a", 1.2)}
    <div style={{ position: "absolute", left: 960 + j - 80, top: 680, width: 160, height: 150, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(90deg,#7c8188,#d4d8dc,#8a9099)", boxShadow: shadow, opacity: cl(pop(tt, 2)) }} />
    <div style={{ position: "absolute", left: 960 + j, top: 860, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 56, color: TX, opacity: cl(pop(tt, 2.6)), whiteSpace: "nowrap" }}>the farmer, in the middle</div>
  </>;
}} />;

// m9-10 · la arena: hormigas nativas de todos los colores, el veneno barre parejo… y entran sólo las coloradas
export const HAntArena: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const wave = eio(tt, 1.2, 3.2), back = eio(tt, 3.3, 6.5);
  const cols = ["#2b2b2b", "#6b4a2c", "#a68a4a", "#3a3020"];
  return <At x={960} y={560} rx={50}>
    <div style={{ width: 1400, height: 820, borderRadius: "50%", background: "radial-gradient(#8a6a40,#5b4228)", boxShadow: shadow, position: "relative", overflow: "hidden" }}>
      {Array.from({ length: 56 }, (_, i) => { const x = 100 + (i * 233) % 1200, y = 80 + (i * 157) % 660, red = i % 9 === 0, dead = (x / 1400) < wave;
        if (red && dead) return null;
        return !red && dead ? null : <Ant key={i} x={x + 8 * Math.sin(tt * 1.4 + i)} y={y} s={0.7} r={(i * 47) % 360 + tt * 20} tt={tt + i} col={red ? "#c23a1a" : cols[i % 4]} />; })}
      {Array.from({ length: 40 }, (_, i) => { const k = (i + 1) / 40; return k < back ? <Ant key={"r" + i} x={100 + (i * 311) % 1200} y={80 + (i * 197) % 660} s={0.72} r={(i * 71) % 360 + tt * 30} tt={tt + i} col="#c23a1a" /> : null; })}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: wave * 1400 - 220, width: 220, background: "linear-gradient(90deg,transparent,rgba(240,240,230,.55))", filter: "blur(18px)", opacity: wave < 1 ? 1 : 0 }} />
    </div>
    <div style={{ position: "absolute", left: 700, top: 900, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 60, color: TX, whiteSpace: "nowrap", opacity: cl(back * 2) }}>the empty field goes to the fire ant first</div>
  </At>;
}} />;

// m10-11 · el libro se abre sobre la mesa: un capítulo entero sobre el programa
export const HBookChapter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const o = eio(tt, 0.4, 2), hl = eio(tt, 2.4, 4.4);
  return <At x={960} y={580} rx={46}>
    <div style={{ width: 1400, height: 820, position: "relative", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 700, top: 0, width: 680, height: 820, background: PAPER, boxShadow: shadow, padding: "70px 60px" }}>
        {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ height: 14, margin: "22px 0", width: `${88 - (i * 7) % 20}%`, background: "rgba(42,33,24,.35)", borderRadius: 4, position: "relative" }}>
          {i >= 3 && i <= 6 && <div style={{ position: "absolute", left: -6, top: -10, height: 34, width: `${cl(hl * 4 - (i - 3)) * 104}%`, background: "rgba(255,214,70,.55)" }} />}</div>)}
      </div>
      <div style={{ position: "absolute", left: 20, top: 0, width: 680, height: 820, transformOrigin: "100% 50%", transform: `rotateY(${180 - 180 * o}deg)`, background: o > 0.5 ? PAPER : "linear-gradient(135deg,#2f4a5a,#1a2c38)", boxShadow: shadow, padding: "120px 60px" }}>
        {o > 0.5 ? <><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: "#7a6a4a" }}>A WHOLE CHAPTER</div>
          <div style={{ fontFamily: MARK, fontSize: 84, color: INK, marginTop: 30, lineHeight: 1 }}>the fire ant program</div>
          <div style={{ fontFamily: HAND, fontSize: 52, color: "#5a2a2a", marginTop: 50 }}>“badly planned, badly done”</div></>
          : <div style={{ transform: "scaleX(-1)", fontFamily: MARK, fontSize: 96, color: "#e8dcc0", textAlign: "center", marginTop: 160 }}>SILENT SPRING<div style={{ fontSize: 50, marginTop: 30 }}>1962</div></div>}
      </div>
    </div>
  </At>;
}} />;

// m11 · la bolsa con cordón: el que maneja el presupuesto aprieta los cordones
export const HPurse: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const pull = eio(tt, 1.6, 3.2), sw = 4 * Math.sin(tt * 1.6);
  return <>
    <At x={900} y={600} r={sw}>
      <svg width={700} height={760} viewBox="0 0 700 760">
        <path d={`M${200 + 60 * pull} 220 Q120 380 140 560 Q170 720 350 730 Q530 720 560 560 Q580 380 ${500 - 60 * pull} 220 Z`} fill="#6b4226" stroke="#3a2412" strokeWidth={6} />
        <path d={`M${200 + 60 * pull} 220 Q350 ${180 + 40 * pull} ${500 - 60 * pull} 220`} fill="none" stroke="#3a2412" strokeWidth={10} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${260 + i * 30} 240 Q${255 + i * 30} 480 ${250 + i * 32} 700`} stroke="rgba(0,0,0,.18)" strokeWidth={4} fill="none" />)}
        <path d={`M350 ${200 + 30 * pull} Q${300 - 40 * pull} ${80 - 40 * pull} ${260 - 60 * pull} ${20 - 30 * pull}`} stroke="#d9c28a" strokeWidth={9} fill="none" />
        <path d={`M350 ${200 + 30 * pull} Q${400 + 40 * pull} ${80 - 40 * pull} ${440 + 60 * pull} ${20 - 30 * pull}`} stroke="#d9c28a" strokeWidth={9} fill="none" />
        <text x={350} y={520} textAnchor="middle" fontFamily={MARK} fontSize={78} fill="#e8d3a0">USDA $</text>
      </svg>
    </At>
    <div style={{ position: "absolute", left: 1290, top: 380, width: 470, padding: "36px 40px", background: PAPER, boxShadow: shadow, transform: `rotate(3deg) translateY(${(1 - pop(tt, 0.8)) * 500}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: "#7a6a4a" }}>HOUSE APPROPRIATIONS</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: INK, marginTop: 10, lineHeight: 1.05 }}>Jamie Whitten, Mississippi</div>
      <div style={{ fontFamily: HAND, fontSize: 48, color: "#5a2a2a", marginTop: 16, opacity: cl(pop(tt, 3)) }}>held the purse strings</div>
    </div>
  </>;
}} />;

// m12 · el grano de cebo en corte: marlo de maíz, aceite de soja y el veneno adentro
export const HBaitGrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["corn cob grit", "#d9b46a", 0.4], ["soybean oil", "#e8c94a", 1.8], ["mirex", "#c23a1a", 3.2]] as const;
  return <>
    <At x={760} y={560} s={0.9 + 0.1 * pop(tt, 0)}>
      <svg width={760} height={760} viewBox="-380 -380 760 760">
        {L.map(([, c, d], i) => { const r = [330, 230, 120][i] * pop(tt, d as number, 6, 0.5); return <circle key={i} cx={0} cy={0} r={Math.max(0, r)} fill={c} stroke="rgba(0,0,0,.25)" strokeWidth={4} />; })}
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={260 * Math.cos(i * 2.4)} cy={260 * Math.sin(i * 2.4)} r={10} fill="rgba(120,80,30,.4)" opacity={pop(tt, 0.6)} />)}
        <path d={`M-330 0 A330 330 0 0 1 330 0`} fill="rgba(255,255,255,.08)" />
      </svg>
    </At>
    {L.map(([n, c, d], i) => <div key={i} style={{ position: "absolute", left: 1220, top: 300 + i * 170, display: "flex", alignItems: "center", gap: 26, opacity: cl(pop(tt, (d as number) + 0.3) * 1.5), transform: `translateX(${(1 - pop(tt, (d as number) + 0.3)) * 200}px)` }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: c as string, boxShadow: "0 8px 20px rgba(0,0,0,.5)" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: i === 2 ? "#ff8a7a" : TX, textTransform: "uppercase" }}>{n}</div></div>)}
    <div style={{ position: "absolute", left: 1220, top: 830, fontFamily: HAND, fontSize: 52, color: TX, opacity: cl(pop(tt, 5)) }}>the ants carry it home to the queen</div>
  </>;
}} />;

// m13 · el lago: el río del norte tiñe el lago Ontario, y el pescado con la cruz
export const HLakeMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fl = eio(tt, 1, 4.5);
  return <At x={960} y={560} rx={30}>
    <div style={{ width: 1500, height: 820, borderRadius: 18, background: "linear-gradient(#cdbf96,#b7a87e)", boxShadow: shadow, position: "relative", overflow: "hidden" }}>
      <svg width={1500} height={820} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="ct" cx="0.15" cy="0.7" r={0.2 + fl}><stop offset="0" stopColor="#a8402a" stopOpacity={0.85} /><stop offset="1" stopColor="#a8402a" stopOpacity={0} /></radialGradient></defs>
        <path d="M200 380 Q420 230 800 260 Q1180 270 1300 360 Q1240 480 900 500 Q520 520 300 480 Z" fill="#4a7fa0" stroke="#2c5d7a" strokeWidth={5} />
        <path d="M200 380 Q420 230 800 260 Q1180 270 1300 360 Q1240 480 900 500 Q520 520 300 480 Z" fill="url(#ct)" />
        <path d="M280 800 Q260 640 290 470" stroke="#4a7fa0" strokeWidth={22} fill="none" /><path d="M280 800 Q260 640 290 470" stroke="#a8402a" strokeWidth={14} fill="none" strokeDasharray={340} strokeDashoffset={340 * (1 - eio(tt, 0.3, 1.4))} />
      </svg>
      <div style={{ position: "absolute", left: 320, top: 640, fontFamily: HAND, fontSize: 50, color: INK }}>Niagara River</div>
      <div style={{ position: "absolute", left: 640, top: 340, fontFamily: MARK, fontSize: 64, color: "#e8f0f4" }}>LAKE ONTARIO</div>
      <div style={{ position: "absolute", left: 1050, top: 560, transform: `scale(${pop(tt, 3.8)}) rotate(-6deg)` }}>
        <svg width={300} height={160}><ellipse cx={130} cy={80} rx={110} ry={50} fill="#9fb2bc" /><path d="M230 80 L290 30 L290 130 Z" fill="#9fb2bc" /><circle cx={70} cy={70} r={8} fill={INK} />
          <path d="M40 20 L260 140 M260 20 L40 140" stroke={STAMP} strokeWidth={16} strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: "absolute", right: 60, bottom: 50, fontFamily: HAND, fontSize: 52, color: "#5a2a2a", opacity: cl(pop(tt, 5)) }}>a thousand miles from the South</div>
    </div>
  </At>;
}} />;

// m14 · el registro del mirex y el sello CANCELLED 1978
export const HCancelStamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const arm = eio(tt, 1.2, 1.9), up = eIn(tt, 2.1, 2.7);
  return <>
    <At x={960} y={560} rx={36} r={-2}>
      <div style={{ width: 1000, height: 760, background: PAPER, boxShadow: shadow, padding: "70px 80px", position: "relative" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: "#7a6a4a" }}>PESTICIDE REGISTRATION</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: INK, marginTop: 12 }}>MIREX</div>
        {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ height: 12, margin: "26px 0", width: `${90 - (i * 11) % 30}%`, background: "rgba(42,33,24,.28)", borderRadius: 4 }} />)}
        <Stamp tt={tt} at={1.9} txt="CANCELLED · 1978" x={500} y={430} r={-12} size={92} />
      </div>
    </At>
    <div style={{ position: "absolute", left: 860, top: -360 + 680 * arm - 300 * up, width: 200, height: 300 }}>
      <div style={{ width: 70, height: 200, margin: "0 auto", borderRadius: 30, background: "linear-gradient(90deg,#5a3a20,#8a5a32,#5a3a20)" }} />
      <div style={{ width: 200, height: 70, borderRadius: 10, background: "#2a2a2a", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
    </div>
  </>;
}} />;

// m14-15 · el cuentakilómetros de acres: 370 millones bajo cuarentena
export const HOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const v = Math.round(370 * eio(tt, 0.5, 4)), digs = String(v).padStart(3, "0").split("");
  return <At x={960} y={520} rx={10}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "40px 50px", borderRadius: 26, background: "linear-gradient(#2a2c30,#141518)", boxShadow: `${shadow}, inset 0 0 0 5px #44474d` }}>
      {digs.map((d, i) => <div key={i} style={{ width: 170, height: 230, borderRadius: 12, background: "linear-gradient(#f3efe6,#cfc8b8 48%,#b9b2a2 52%,#f0ebe0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 190, color: "#1a1a1a", overflow: "hidden" }}>{d}</div>)}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: TX, marginLeft: 20 }}>M</div>
    </div>
    <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: TX, marginTop: 36, opacity: cl(pop(tt, 3)) }}>ACRES UNDER QUARANTINE</div>
    <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 58, color: AMB, marginTop: 14, opacity: cl(pop(tt, 4.2)) }}>15 states + Puerto Rico · in 1957 it was 9</div>
  </At>;
}} />;

// m15 · ¿quién pagó?: cada pagador cae como una pesa en el platillo, que se hunde
export const HPayScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const W = [["QUAIL", 0.6], ["SONGBIRDS", bt(h, 0, 1.6)], ["FISH", bt(h, 0, 1.6) + 0.8], ["DAIRY FARMERS", bt(h, 1, 3.2)], ["CATTLE", bt(h, 1, 3.2) + 1.2], ["TAXPAYERS", bt(h, 2, 6)]] as [string, number][];
  const n = W.filter(([, d]) => tt > d + 0.4).length, tilt = 4 * n + 1.5 * Math.sin(tt * 2) * Math.exp(-tt * 0.1);
  return <At x={960} y={580}>
    <svg width={1400} height={800} viewBox="-700 -400 1400 800">
      <rect x={-14} y={-260} width={28} height={600} fill="#8a6a3a" /><rect x={-160} y={330} width={320} height={40} rx={10} fill="#6b4a2c" />
      <g transform={`rotate(${tilt} 0 -260)`}><rect x={-560} y={-272} width={1120} height={24} rx={12} fill="#c9a65a" />
        <path d="M480 -260 L420 -20 M480 -260 L540 -20" stroke="#8a7a50" strokeWidth={4} /><path d="M-480 -260 L-540 -20 M-480 -260 L-420 -20" stroke="#8a7a50" strokeWidth={4} /></g>
    </svg>
    {(() => { const ry = -20 + 480 * Math.sin(tilt / 57.3), ly = -20 - 480 * Math.sin(tilt / 57.3); return <>
      <div style={{ position: "absolute", left: 700 - 480 - 130, top: 400 + ly, width: 260, height: 30, borderRadius: "0 0 130px 130px", background: "#a8884a" }} />
      <div style={{ position: "absolute", left: 700 + 480 - 170, top: 400 + ry, width: 340, height: 30, borderRadius: "0 0 170px 170px", background: "#a8884a" }} />
      {W.map(([w, d], i) => { const s = pop(tt, d, 7, 0.45); return s > 0.01 && <div key={i} style={{ position: "absolute", left: 700 + 480 - 170 + (i % 2) * 14, top: 400 + ry - 70 - i * 64 - (1 - s) * 600, width: 340, height: 58, borderRadius: 8, background: "linear-gradient(#5b5f66,#2f3236)", color: TX, fontFamily: FONT, fontWeight: 900, fontSize: 28, whiteSpace: "nowrap", letterSpacing: 2, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{w}</div>; })}
      <div style={{ position: "absolute", left: 700 - 480 - 110, top: 400 + ly - 80, fontFamily: HAND, fontSize: 56, color: TX }}>the ant</div>
    </>; })()}
  </At>;
}} />;

// m18 · la vía del tiempo: un riel con los años que se clavan uno por uno
export const HTimelineRail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Y = [["1918", "black fire ant in Mobile", 0.4], ["1930s", "the red one arrives", bt(h, 0, 2)], ["1942", "a boy writes it down", bt(h, 1, 3.5)], ["1957", "eradication funded", bt(h, 2, 5.5)],
    ["1958", "dead birds · Alabama pulls out", bt(h, 3, 7.5)], ["1959", "the milk rule", bt(h, 4, 9.5)], ["1962", "Silent Spring · mirex", bt(h, 5, 11)], ["1978", "EPA cancels mirex", bt(h, 6, 14)]] as [string, string, number][];
  const n = Y.filter(([, , d]) => tt > d).length, cam = -Math.max(0, n - 4) * 230 * 1 + 0;
  return <>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${cam + 40 * Math.sin(tt * 0.2)}px)`, transition: "none" }}>
      <div style={{ position: "absolute", left: 120, top: 600, width: 2600, height: 14, background: "linear-gradient(90deg,#8a9099,#d4d8dc,#8a9099)" }} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 90, top: 580, width: 30, height: 54, background: "#5a3a20" }} />)}
      {Y.map(([y, d, at], i) => { const s = pop(tt, at, 7, 0.4); return s > 0.01 && <div key={i} style={{ position: "absolute", left: 220 + i * 300, top: 600, transform: `translate(-50%,-100%) translateY(${(1 - s) * -300}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: i === 7 ? "#ff8a7a" : TX }}>{y}</div>
        <div style={{ fontFamily: HAND, fontSize: 40, color: AMB, width: 280, margin: "6px auto 20px", lineHeight: 1 }}>{d}</div>
        <div style={{ width: 8, height: 90, background: "#c9cdd2", margin: "0 auto" }} /></div>; })}
      <div style={{ position: "absolute", left: 220 + 8 * 300, top: 470, fontFamily: HAND, fontSize: 64, color: "#ff8a7a", opacity: cl(pop(tt, (Y[7][2] as number) + 1.5)) }}>…and the ant? still marching</div>
    </div>
  </>;
}} />;

// m19-20 · los dos escalones del método, con el termómetro del suelo
export const HTwoStep: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s1 = pop(tt, 0.5, 6, 0.45), s2 = pop(tt, bt(h, 0, 3), 6, 0.45), th = eio(tt, bt(h, 1, 6), bt(h, 1, 6) + 2);
  const step = (x: number, hgt: number, n: string, a: string, s: number) => <div style={{ position: "absolute", left: x, top: 900 - hgt * s, width: 520, height: hgt * s, background: "linear-gradient(#d9cba6,#a8946a)", boxShadow: shadow, borderRadius: "10px 10px 0 0", overflow: "hidden", padding: 34 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: INK }}>{n}</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: INK, lineHeight: 1.05 }}>{a}</div></div>;
  return <>
    {step(240, 340, "1", "BAIT THE WHOLE AREA", s1)}{step(780, 560, "2", "TREAT ONLY THE PROBLEM MOUNDS", s2)}
    <div style={{ position: "absolute", left: 1460, top: 170, width: 90, height: 700, borderRadius: 45, background: "rgba(255,255,255,.12)", border: "6px solid #d4d8dc", opacity: cl(th * 3) }}>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 40 + 520 * th * 0.75, borderRadius: 30, background: "linear-gradient(#ff8a5a,#c23a1a)" }} />
      <div style={{ position: "absolute", left: 120, top: 700 - 18 - 40 - 520 * 0.6, width: 300, borderTop: "4px dashed #ffd27a" }} />
      <div style={{ position: "absolute", left: 120, top: 700 - 18 - 40 - 520 * 0.78, width: 300, borderTop: "4px dashed #ffd27a" }} />
      <div style={{ position: "absolute", left: 140, top: 700 - 40 - 520 * 0.74, fontFamily: HAND, fontSize: 54, color: "#ffd27a", whiteSpace: "nowrap" }}>70–90 °F</div>
      <div style={{ position: "absolute", left: 140, top: 700 - 40 - 520 * 0.6 + 30, fontFamily: HAND, fontSize: 42, color: TX, whiteSpace: "nowrap" }}>ants out foraging</div>
    </div>
  </>;
}} />;

// m20-21 · la patada al hormiguero: la colonia entera se muda tres metros y arma otro
export const HKickedMound: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = 1.4, burst = eio(tt, k, k + 0.6), mv = eio(tt, k + 0.8, k + 4), nm = pop(tt, k + 3.4, 5, 0.5);
  return <At x={960} y={560} rx={58}>
    <div style={{ width: 1500, height: 900, borderRadius: 30, background: "radial-gradient(#7a9b44,#4f6a2a)", boxShadow: shadow, position: "relative" }}>
      <div style={{ position: "absolute", left: 260, top: 340, width: 260, height: 220, borderRadius: "50%", background: "radial-gradient(#9a6a3a,#6b4426)", transform: `scale(${1 - 0.5 * burst}, ${1 - 0.7 * burst})`, opacity: 1 - 0.6 * burst }} />
      {Array.from({ length: 36 }, (_, i) => { const a = i * 0.7, r0 = 60 * burst, x = 390 + Math.cos(a) * r0 + (1000 - 0) * mv + 30 * Math.sin(i + tt * 3) * mv * (1 - mv), y = 450 + Math.sin(a) * r0 * 0.7 + 20 * Math.sin(i * 1.3);
        return tt > k ? <Ant key={i} x={x} y={y} s={0.8} r={mv > 0 && mv < 1 ? 90 : a * 57} tt={tt + i} col="#c23a1a" /> : null; })}
      <div style={{ position: "absolute", left: 1270, top: 330, width: 240, height: 210, borderRadius: "50%", background: "radial-gradient(#9a6a3a,#6b4426)", transform: `translate(-50%,0) scale(${nm})` }} />
      <svg width={1500} height={900} style={{ position: "absolute", inset: 0 }}><path d="M420 600 Q840 760 1240 600" stroke="#f3ead6" strokeWidth={6} strokeDasharray="20 18" fill="none" opacity={cl(mv * 3)} /></svg>
      <div style={{ position: "absolute", left: 830, top: 690, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 56, color: "#f3ead6", opacity: cl(mv * 2), whiteSpace: "nowrap" }}>10 feet away</div>
      <div style={{ position: "absolute", left: 1150, top: 120, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", opacity: cl(nm), whiteSpace: "nowrap", textShadow: "0 4px 16px #000" }}>SAME COLONY · NEW ADDRESS</div>
    </div>
    {tt > k - 0.6 && tt < k + 0.6 && <div style={{ position: "absolute", left: -200 + 500 * eio(tt, k - 0.6, k), top: 300, width: 260, height: 120, borderRadius: "40px 80px 30px 30px", background: "linear-gradient(#5a3a20,#2a1a0c)", transform: "rotate(-10deg)" }} />}
  </At>;
}} />;

// m21 · una reina vs muchas: un hormiguero solo frente a una red de cientos conectados por túneles
export const HQueenNet: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 1.8, 6);
  const N = Array.from({ length: 34 }, (_, i) => [1080 + (i % 6) * 120 + (Math.floor(i / 6) % 2) * 60, 260 + Math.floor(i / 6) * 110] as [number, number]);
  return <>
    <div style={{ position: "absolute", left: 200, top: 300, width: 600, height: 560, borderRadius: 24, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", transform: `translateY(${(1 - pop(tt, 0.3)) * 400}px)` }}>
      <div style={{ position: "absolute", left: 210, top: 200, width: 180, height: 140, borderRadius: "50%", background: "radial-gradient(#9a6a3a,#6b4426)" }} />
      <svg width={70} height={50} style={{ position: "absolute", left: 255, top: 240 }}><path d="M5 45 L5 15 L20 30 L35 5 L50 30 L65 15 L65 45 Z" fill="#e3c27a" stroke="#8a6a2a" strokeWidth={3} /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: TX }}>ONE QUEEN</div>
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {N.map(([x, y], i) => i > 0 && i / N.length < g && <line key={i} x1={x} y1={y} x2={N[i - 1][0]} y2={N[i - 1][1]} stroke="#6b4426" strokeWidth={8} />)}
      {N.map(([x, y], i) => i > 5 && i / N.length < g && <line key={"v" + i} x1={x} y1={y} x2={N[i - 6][0]} y2={N[i - 6][1]} stroke="#6b4426" strokeWidth={6} opacity={0.7} />)}
    </svg>
    {N.map(([x, y], i) => i / N.length < g + 0.03 && <div key={i} style={{ position: "absolute", left: x - 34, top: y - 26, width: 68, height: 52, borderRadius: "50%", background: "radial-gradient(#b07a44,#6b4426)", transform: `scale(${pop(tt, 1.8 + (i / N.length) * 4.2, 8, 0.4)})` }} />)}
    <div style={{ position: "absolute", left: 1320, top: 930, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: TX, opacity: cl(g * 2), whiteSpace: "nowrap" }}>MANY QUEENS · HUNDREDS OF MOUNDS</div>
  </>;
}} />;

// m21-22 · la mosca fórida sobre la hormiga, en macro: el aleteo, el ataque, la hormiga que se esconde
export const HPhoridFly: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fx = 1100 + 120 * Math.sin(tt * 1.7), fy = 300 + 40 * Math.sin(tt * 3.1), dive = eio(tt, 3, 3.5) * (1 - eio(tt, 3.6, 4.2)), hide = eio(tt, 4.2, 5.6);
  return <>
    <div style={{ position: "absolute", left: 160, top: 700, width: 1600, height: 260, borderRadius: "50% 50% 0 0", background: "radial-gradient(ellipse at 50% 0,#8a6a40,#4a3420)" }} />
    <Ant x={900 - 500 * hide} y={680} s={5} r={-90} tt={tt * (1 + 2 * hide)} />
    <div style={{ position: "absolute", left: fx - 60 - 200 * dive, top: fy - 40 + 260 * dive, width: 120, height: 80 }}>
      <svg width={120} height={80} viewBox="-60 -40 120 80" style={{ transform: "scale(3)", overflow: "visible" }}>
        <ellipse cx={-14} cy={-14} rx={26} ry={9} fill="rgba(220,235,255,.55)" transform={`rotate(${-20 + 30 * Math.sin(tt * 90)})`} />
        <ellipse cx={14} cy={-14} rx={26} ry={9} fill="rgba(220,235,255,.55)" transform={`rotate(${20 - 30 * Math.sin(tt * 90)})`} />
        <ellipse cx={0} cy={4} rx={16} ry={11} fill="#3a2a10" /><circle cx={-14} cy={0} r={8} fill="#2a1a08" />
      </svg>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 140, width: 480, padding: "30px 34px", background: PAPER, boxShadow: shadow, transform: `rotate(3deg) translateY(${(1 - pop(tt, 1)) * -500}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: INK }}>PHORID FLY</div>
      <div style={{ fontFamily: HAND, fontSize: 46, color: "#5a2a2a", marginTop: 8 }}>smaller than a grain of rice · from the ant's own homeland</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 980, fontFamily: HAND, fontSize: 56, color: TX, opacity: cl(hide * 2) }}>scared ants stop foraging — the natives get room</div>
  </>;
}} />;

// m22 · el reloj de arena: de los aviones (1957) a la mosca (1997), 40 años
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = eio(tt, 0.5, 5.5), rot = 180 * eio(tt, 0, 0.5) - 180;
  return <>
    <At x={960} y={540} r={rot}>
      <svg width={480} height={760} viewBox="-240 -380 480 760">
        <rect x={-220} y={-380} width={440} height={40} rx={12} fill="#6b4426" /><rect x={-220} y={340} width={440} height={40} rx={12} fill="#6b4426" />
        <path d="M-180 -340 Q-180 -60 -16 0 Q-180 60 -180 340 L180 340 Q180 60 16 0 Q180 -60 180 -340 Z" fill="rgba(220,235,240,.18)" stroke="rgba(255,255,255,.6)" strokeWidth={6} />
        <path d={`M${-170 + 150 * k} ${-330 + 300 * k} Q0 ${-20} ${170 - 150 * k} ${-330 + 300 * k} L${16 + 150 * (1 - k)} -30 Q0 -6 ${-16 - 150 * (1 - k)} -30 Z`} fill="#e3c27a" opacity={1 - k * 0.9} />
        <path d={`M-170 330 Q0 ${330 - 300 * k} 170 330 Z`} fill="#e3c27a" />
        {k > 0 && k < 1 && <line x1={0} y1={0} x2={0} y2={330 - 120 * k} stroke="#e3c27a" strokeWidth={5} />}
      </svg>
    </At>
    <div style={{ position: "absolute", left: 360, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: TX, opacity: cl(pop(tt, 0.8)) }}>1957<div style={{ fontFamily: HAND, fontWeight: 400, fontSize: 52, color: AMB }}>planes of poison</div></div>
    <div style={{ position: "absolute", left: 1300, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: TX, opacity: cl(pop(tt, 4.4)) }}>1997<div style={{ fontFamily: HAND, fontWeight: 400, fontSize: 52, color: AMB }}>a fly the size of a pinhead</div></div>
    <div style={{ position: "absolute", left: 960, top: 980, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: 10, color: TX, opacity: cl(pop(tt, 5.6)) }}>40 YEARS</div>
  </>;
}} />;

// m23 · las preguntas: fichas de biblioteca que se dan vuelta de a una
export const HQCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["Was the ant a real threat?", "Yes. The cure was the problem."], ["Did the spraying kill people?", "No documented case. Wildlife, yes."], ["Is mirex still around?", "Cancelled 1978. Traces lingered."], ["Can I just pour something on it?", "Call your county extension office."]];
  return <>{Q.map(([q, a], i) => { const s = pop(tt, 0.3 + i * 0.5, 6, 0.5), fl = eio(tt, 3 + i * 2.2, 3.8 + i * 2.2); return <div key={i} style={{ position: "absolute", left: 130 + i * 420, top: 300 + (i % 2) * 60, perspective: 1600, transform: `translateY(${(1 - s) * 600}px) rotate(${-4 + i * 3}deg)` }}>
    <div style={{ width: 390, height: 460, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${180 * fl}deg)` }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "repeating-linear-gradient(#fbf7ec 0 58px,#9fbdd8 58px 60px)", borderTop: `10px solid ${STAMP}`, boxShadow: shadow, padding: 30, fontFamily: HAND, fontSize: 52, color: "#22314f", lineHeight: 1.1 }}>{q}</div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: PAPER, borderTop: "10px solid #3a5a2a", boxShadow: shadow, padding: 30, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: INK, lineHeight: 1.1 }}>{a}</div>
    </div></div>; })}</>;
}} />;

// m24 · el repaso en una tira de película que corre con las fotos del archivo
export const HRecapReel: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const caps = ["a ship to Mobile", "panic", "planes of heptachlor", "quail & fish die", "milk flagged", "natives wiped out", "mirex until 1978", "370 M acres", "control, not war"];
  const x = 200 - tt * 210;
  return <div style={{ position: "absolute", left: 0, top: 290, width: 1920, height: 520, transform: "rotate(-4deg)" }}>
    <div style={{ position: "absolute", left: x, top: 0, height: 520, width: caps.length * 560 + 200, background: "#141414", boxShadow: shadow, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 30px,#f3ead6 30px 54px,transparent 54px 84px)", backgroundSize: "84px 40px", backgroundRepeat: "repeat-x", backgroundPosition: "0 14px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, height: 40, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 30px,#f3ead6 30px 54px,transparent 54px 84px)" }} />
      {caps.map((c, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 560, top: 76, width: 520, height: 368, borderRadius: 8, overflow: "hidden", background: "#2a2622" }}>
        {h.imgs?.[i] && <Img src={img(h.imgs[i] as string)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25)" }} />}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 22px 18px", background: "linear-gradient(transparent,rgba(0,0,0,.8))", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: TX }}>{i + 1}. {c}</div></div>)}
    </div>
  </div>;
}} />;


// m4 · el diario que cae girando sobre la mesa: «FIRE ANT MENACE», y el sello de los nueve estados
export const HNewsMenace: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.2, 4, 0.6), spin = (1 - s) * 540;
  return <>
    <At x={900} y={540} s={0.3 + 0.7 * s} r={-spin - 5} rx={20}>
      <div style={{ width: 1200, height: 800, background: "linear-gradient(160deg,#efe8d6,#d8cfb8)", boxShadow: shadow, padding: "40px 60px", fontFamily: "Georgia, serif", color: "#1e1a14" }}>
        <div style={{ textAlign: "center", fontSize: 40, letterSpacing: 6, borderBottom: "3px double #1e1a14", paddingBottom: 12 }}>THE SOUTHERN COUNTY HERALD · 1956</div>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 150, lineHeight: 1, margin: "30px 0 20px", letterSpacing: -2 }}>FIRE ANT MENACE</div>
        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 44 }}>Stories of calves killed and children attacked spread across the South</div>
        <div style={{ display: "flex", gap: 30, marginTop: 36 }}>{[0, 1, 2].map((c) => <div key={c} style={{ flex: 1 }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 10, margin: "14px 0", background: "rgba(30,26,20,.3)", width: `${92 - (i * 13 + c * 7) % 24}%` }} />)}</div>)}</div>
      </div>
    </At>
    <Stamp tt={tt} at={2.6} txt="9 STATES" x={1500} y={300} r={10} size={90} col="#c23a1a" />
    <div style={{ position: "absolute", left: 1320, top: 880, fontFamily: HAND, fontSize: 58, color: TX, opacity: cl(pop(tt, 3.6)) }}>some true · a lot blown up</div>
  </>;
}} />;

// m10 · la canilla de la plata del estado: Alabama cierra la llave y el caño se seca
export const HValveShut: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const turn = eio(tt, 2, 3.2), flow = 1 - turn;
  return <>
    <div style={{ position: "absolute", left: 120, top: 330, width: 1100, height: 90, borderRadius: 45, background: "linear-gradient(#9aa1aa,#e4e8ec 40%,#6a7078)", boxShadow: shadow, transform: `scaleX(${pop(tt, 0.2, 5, 0.6)})`, transformOrigin: "0 50%" }} />
    <div style={{ position: "absolute", left: 1150, top: 330, width: 90, height: 260, borderRadius: "0 0 30px 30px", background: "linear-gradient(90deg,#6a7078,#e4e8ec 40%,#9aa1aa)" }} />
    <div style={{ position: "absolute", left: 560, top: 230, width: 220, height: 220, transform: `rotate(${turn * 270}deg)` }}>
      <svg width={220} height={220} viewBox="-110 -110 220 220"><circle r={90} fill="none" stroke="#c23a1a" strokeWidth={22} />{[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={0} x2={90 * Math.cos(i * Math.PI / 2)} y2={90 * Math.sin(i * Math.PI / 2)} stroke="#c23a1a" strokeWidth={18} />)}<circle r={24} fill="#7a1a10" /></svg>
    </div>
    {Array.from({ length: 22 }, (_, i) => { const ph = (tt * 1.6 + i / 22) % 1; return <div key={i} style={{ position: "absolute", left: 1175 + 8 * Math.sin(i), top: 600 + ph * 380, width: 40, height: 22, borderRadius: 6, background: "#8fbf7a", opacity: flow * Math.sin(ph * Math.PI), transform: `rotate(${i * 40 + tt * 90}deg)` }} />; })}
    <div style={{ position: "absolute", left: 380, top: 520, width: 620, padding: "30px 40px", background: PAPER, boxShadow: shadow, transform: `rotate(-3deg) translateY(${(1 - pop(tt, 0.8)) * 500}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: INK }}>ALABAMA LEGISLATURE</div>
      <div style={{ fontFamily: HAND, fontSize: 50, color: "#5a2a2a", marginTop: 8 }}>state money cut off after year one</div>
    </div>
    <div style={{ position: "absolute", left: 1320, top: 760, fontFamily: HAND, fontSize: 56, color: TX, opacity: cl(pop(tt, 4)) }}>the biologists at home were heard</div>
  </>;
}} />;

// m24 · desde abajo: la sombra del avión que tapa a la figura parada en el potrero
export const HUnderneath: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sx = -600 + eio(tt, 0.2, 4.4) * 2600, over = Math.max(0, 1 - Math.abs(sx - 960) / 500);
  return <>
    <div style={{ position: "absolute", left: 160, top: 140, width: 1600, height: 800, borderRadius: 24, background: "radial-gradient(ellipse at 50% 60%,#86a54e,#4f6a2a)", boxShadow: shadow, overflow: "hidden" }}>
      <svg width={700} height={420} viewBox="0 0 700 420" style={{ position: "absolute", left: sx - 160 - 350, top: 190, opacity: 0.55, filter: "blur(6px)" }}>
        <rect x={50} y={170} width={600} height={80} rx={40} fill="#000" /><rect x={250} y={20} width={200} height={380} rx={20} fill="#000" /><rect x={20} y={150} width={80} height={120} rx={12} fill="#000" />
      </svg>
      <div style={{ position: "absolute", left: 790, top: 360, width: 20, height: 20, borderRadius: "50%", background: "#3a2a1a", boxShadow: `0 0 0 ${8 + 6 * over}px rgba(255,255,255,${0.15 * over})` }} />
      <div style={{ position: "absolute", left: 786, top: 376, width: 28, height: 40, borderRadius: 10, background: "#6a5a8a" }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 990, transform: "translateX(-50%)", fontFamily: HAND, fontSize: 72, color: TX, whiteSpace: "nowrap", opacity: cl(pop(tt, 1.2)) }}>ask who's standing underneath</div>
  </>;
}} />;

export const HCA: Record<string, React.FC<{ t: number; h: H }>> = {
  planeDust: HPlaneDust, caseFile: HCaseFile, riceScale: HRiceScale, portRoute: HPortRoute, notebook: HNotebook, moundMower: HMoundMower,
  moneyStack: HMoneyStack, lastAnt: HLastAnt, acreSquare: HAcreSquare, warnLetters: HWarnLetters, quailTally: HQuailTally, milkBottle: HMilkBottle,
  tugOfWar: HTugOfWar, antArena: HAntArena, bookChapter: HBookChapter, purse: HPurse, baitGrain: HBaitGrain, lakeMap: HLakeMap,
  cancelStamp: HCancelStamp, odometer: HOdometer, payScale: HPayScale, timelineRail: HTimelineRail, twoStep: HTwoStep, kickedMound: HKickedMound,
  queenNet: HQueenNet, newsMenace: HNewsMenace, valveShut: HValveShut, underneath: HUnderneath, phoridFly: HPhoridFly, hourglass: HHourglass, qCards: HQCards, recapReel: HRecapReel,
};
