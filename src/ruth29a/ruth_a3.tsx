// ruth29a · 3ª tanda tras el EVALUADOR (29-oct): las piezas de nota 6 rehechas como objetos 3D sobre la mesa de Ruth.
import React from "react";
import { H, Mode, Stage, cl, eio, HAND, MARK } from "./hkit";
import { FONT } from "./lib";
import { pop, Stamp, INK, STAMP } from "./ruth_a";
import { CShadow, Grain, Sheet, Box, Coin, Ant3, Mound, WOOD, WOODTOP, WOODSIDE } from "./obj";

const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode; bg?: string }> = ({ t, h, f, bg }) => <Stage t={t} h={h} bg={bg} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
const bt = (h: H, i: number, d: number) => (h.bt && h.bt[i] != null ? h.bt[i] : d);
const fall = (tt: number, at: number) => { const s = pop(tt, at, 9, 0.38); return { s, y: (1 - s) * -520, k: cl(s) }; };

// el SUR recortado en papel (estados estilizados) para mapas sobre la mesa
export const SOUTH: [string, string][] = [["TX", "40,120 260,120 260,60 330,60 340,250 300,330 230,420 180,460 160,380 110,300 40,260"], ["OK", "140,40 340,40 340,130 260,120 260,60 140,60"],
  ["AR", "340,60 450,60 445,190 350,190"], ["LA", "340,250 350,190 445,190 440,230 470,300 400,330 340,310"], ["MS", "450,170 510,170 515,300 470,300 445,230"],
  ["AL", "510,165 580,165 600,300 540,300 525,320 515,300"], ["TN", "420,120 680,110 680,160 450,165"], ["GA", "580,165 660,160 720,260 700,300 600,300"],
  ["FL", "540,300 700,300 760,420 780,520 740,540 700,420 650,340 560,320"], ["SC", "660,160 760,150 800,200 720,260"], ["NC", "680,110 860,90 840,150 760,150 680,160"]];
export const SouthMap: React.FC<{ red: (k: string) => number; w?: number }> = ({ red, w = 900 }) =>
  <svg width={w} height={w * 0.64} viewBox="20 20 860 560" style={{ overflow: "visible" }}>
    {SOUTH.map(([k, pts]) => { const r = red(k); return <g key={k}>
      <polygon points={pts} fill="rgba(0,0,0,.35)" transform="translate(6,9)" />
      <polygon points={pts} fill={r > 0 ? `rgb(${236 - 60 * r},${226 - 170 * r},${200 - 160 * r})` : "#ece2c8"} stroke="#6a5a3a" strokeWidth={3} transform={`translate(0,${-8 * r})`} />
    </g>; })}
  </svg>;

// m1 · la carpeta del caso sobre la mesa: tres pestañas que se levantan, cada una con su OBJETO (mazo = quién decidió, campana = quién avisó, moneda = quién pagó)
export const HCaseFile: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const open = eio(tt, 0.3, 1.5), at = [1.2, bt(h, 0, 3.5), bt(h, 1, 6)];
  const obj = (i: number) => i === 0 ? <svg width={200} height={150}><rect x={20} y={30} width={140} height={60} rx={14} fill="#7a4a24" stroke="#3a2010" strokeWidth={4} /><rect x={20} y={46} width={140} height={10} fill="#c9a060" /><rect x={84} y={86} width={16} height={60} rx={6} fill="#5a3418" /></svg>
    : i === 1 ? <svg width={200} height={170}><path d="M100 20 Q40 30 40 120 L160 120 Q160 30 100 20Z" fill="#d9a83a" stroke="#7a5a10" strokeWidth={4} /><rect x={28} y={118} width={144} height={16} rx={6} fill="#b8862a" /><circle cx={100} cy={146} r={14} fill="#7a5a10" /><ellipse cx={78} cy={64} rx={12} ry={30} fill="rgba(255,255,255,.4)" /></svg>
      : <div style={{ position: "relative", width: 200, height: 160 }}><Coin x={100} y={90} s={1.2} tilt={30} /></div>;
  const word = ["who decided?", "who warned?", "who paid?"];
  return <>
    <CShadow x={960} y={930} w={1300} />
    <div style={{ position: "absolute", left: 960, top: 640, width: 1300, height: 640, transform: "translate(-50%,-50%) perspective(1600px) rotateX(38deg)" }}>
      {[0, 1, 2].map((i) => { const u = pop(tt, at[i], 7, 0.42); return <div key={i} style={{ position: "absolute", left: 110 + i * 380, top: 30 - 300 * u, width: 340, height: 470, borderRadius: "14px 14px 4px 4px", background: "linear-gradient(170deg,#f6efdc,#dccca4)", boxShadow: "0 30px 40px rgba(0,0,0,.45)", transform: `rotateX(${-28 * u}deg)`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * pop(tt, at[i] + 0.25, 8, 0.4)})` }}>{obj(i)}</div>
        <div style={{ fontFamily: HAND, fontSize: 66, color: INK, marginTop: 6 }}>{word[i]}</div>
      </div>; })}
      <div style={{ position: "absolute", left: 0, top: 160, right: 0, bottom: 0, borderRadius: 16, background: "linear-gradient(170deg,#e8cf94,#c4a35e)", boxShadow: "0 20px 50px rgba(0,0,0,.5)", overflow: "hidden" }}>
        <Grain id="cfg" o={0.25} />
        <div style={{ position: "absolute", left: 60, bottom: 50, fontFamily: MARK, fontSize: 76, color: "#6a3a1a", opacity: 0.85 }}>FIRE ANT PROGRAM · 1957</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 160, right: 0, height: 480, borderRadius: 16, background: "linear-gradient(170deg,#f0daa6,#d3b474)", transformOrigin: "50% 0", transform: `rotateX(${-178 * open}deg)`, backfaceVisibility: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }} />
    </div>
  </>;
}} />;

// m3 · la ruta del barco sobre el mapa de papel: el barco lleva tierra de lastre en la bodega; en Mobile la vuelca y salen las hormigas
export const HPortRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = eio(tt, 0.8, 5.6), pts = (u: number) => [1240 - 760 * u + 220 * Math.sin(u * Math.PI), 760 - 470 * u] as const;
  const [sx, sy] = pts(d), dump = eio(tt, 5.8, 6.8);
  const land = ["M100 0 L760 0 L680 130 L520 170 L480 280 L330 250 L230 130 Z", "M1040 560 L1360 520 L1520 650 L1480 900 L1120 900 L1020 760 Z"];
  return <>
    <Sheet x={960} y={600} w={1600} h={900} rx={42} id="prg" bg="radial-gradient(ellipse at 60% 40%,#7aa6bc,#4f7f98)">
      <svg width={1600} height={900} style={{ position: "absolute", inset: 0 }}>
        {land.map((p, i) => <g key={i}><path d={p} fill="rgba(0,0,0,.3)" transform="translate(10,14)" /><path d={p} fill="#e6d8b0" stroke="#8a7a50" strokeWidth={3} /></g>)}
        <path d="M1150 640 Q1230 740 1300 880" stroke="#4f7f98" strokeWidth={10} fill="none" />
        <path d={Array.from({ length: 41 }, (_, i) => { const [x, y] = pts((i / 40) * d); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ")} stroke="#a8301e" strokeWidth={7} strokeDasharray="22 16" fill="none" />
        <text x={1120} y={500} fontFamily={HAND} fontSize={64} fill={INK}>Paraná River</text>
        <text x={360} y={330} fontFamily={HAND} fontSize={72} fill={INK} opacity={cl(d * 3 - 2.2)}>Mobile, Alabama</text>
        <text x={1240} y={120} fontFamily={MARK} fontSize={90} fill="#f3ead6" opacity={cl(pop(tt, 2.5))}>1930s</text>
      </svg>
    </Sheet>
    {/* el barco de carga con la bodega llena de tierra */}
    <div style={{ position: "absolute", left: sx, top: sy, transform: "translate(-50%,-70%) scaleX(-1)" }}>
      <svg width={300} height={170} viewBox="0 0 300 170" style={{ filter: "drop-shadow(10px 18px 10px rgba(0,0,0,.45))", overflow: "visible" }}>
        <defs><linearGradient id="prh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a3a" /><stop offset="1" stopColor="#141414" /></linearGradient></defs>
        <path d="M10 90 L290 90 L260 150 L40 150 Z" fill="url(#prh)" /><rect x={10} y={84} width={280} height={10} fill="#8a2a1e" />
        <path d={`M60 90 Q110 ${40 + 45 * dump} 170 90 Z`} fill="#7a5232" /><rect x={200} y={40} width={60} height={50} fill="#d8d2c4" /><rect x={222} y={10} width={18} height={34} fill="#8a2a1e" />
      </svg>
    </div>
    {dump > 0 && Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2, r = 30 + dump * (60 + (i * 37) % 140); return <Ant3 key={i} x={sx + Math.cos(a) * r} y={sy + 40 + Math.sin(a) * r * 0.5} s={0.22} r={a * 57} tt={tt + i} o={cl(dump * 2)} />; })}
  </>;
}} />;

// m4 · la segadora de verdad: la barra de cuchillas avanza por el pasto, se traba contra el montículo, salta tierra y salen las hormigas
export const HMoundMower: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hit = bt(h, 0, 5), mx = 1900 - eio(tt, hit - 3.2, hit) * 780, j = tt > hit ? Math.exp(-(tt - hit) * 4) * Math.sin((tt - hit) * 40) : 0, out = eio(tt, hit + 0.2, hit + 1.4);
  return <>
    <div style={{ position: "absolute", left: -40, right: -40, top: 760, bottom: -40, background: "linear-gradient(#6a8a34 0 18px, #5a3e22 18px)" }}><Grain id="mmg" o={0.45} f={0.8} /></div>
    {Array.from({ length: 70 }, (_, i) => { const x = (i * 29) % 1960, cut = x > mx + 40; return <div key={i} style={{ position: "absolute", left: x, top: 760 - (cut ? 14 : 40 + (i % 5) * 8), width: 6, height: cut ? 14 : 44 + (i % 5) * 8, background: i % 2 ? "#7aa040" : "#5a8028", transform: `rotate(${(i % 7) - 3 + 4 * Math.sin(tt * 2 + i)}deg)`, transformOrigin: "50% 100%", borderRadius: 3 }} />; })}
    <Mound x={760} y={780} w={640} sx={1} sy={1 - 0.08 * Math.abs(j)} id="mmm" />
    {tt > hit && Array.from({ length: 24 }, (_, i) => { const e = tt - hit, a = -Math.PI * (0.15 + 0.7 * (i / 24)), v = 260 + (i * 61) % 260; if (e > 1.3) return null;
      return <div key={i} style={{ position: "absolute", left: 1000 + Math.cos(a) * v * e, top: 600 + Math.sin(a) * v * e + 600 * e * e, width: 16 + (i % 4) * 6, height: 14, borderRadius: "40%", background: i % 2 ? "#6a4a2a" : "#9a7048" }} />; })}
    {out > 0 && Array.from({ length: 30 }, (_, i) => { const a = -Math.PI * (0.1 + 0.8 * ((i * 0.37) % 1)), r = out * (40 + (i * 47) % 300); return <Ant3 key={i} x={780 + Math.cos(a) * r * 1.5} y={600 + Math.sin(a) * r * 0.3 + r * 0.4} s={0.3} r={a * 57 + 90} tt={tt + i} />; })}
    <div style={{ position: "absolute", left: mx + 18 * j, top: 520 - 20 * Math.abs(j), transform: `rotate(${-3 * j}deg)` }}>
      <CShadow x={260} y={250} w={460} />
      <svg width={560} height={300} viewBox="0 0 560 300" style={{ overflow: "visible" }}>
        <defs><linearGradient id="mmr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2483a" /><stop offset="1" stopColor="#7a1a12" /></linearGradient></defs>
        <rect x={-120} y={196} width={260} height={24} fill="#b8bec4" /><path d={Array.from({ length: 10 }, (_, i) => `M${-120 + i * 26} 220 L${-107 + i * 26} 236 L${-94 + i * 26} 220`).join(" ")} fill="#dfe4e8" stroke="#6a7076" strokeWidth={2} />
        <rect x={120} y={120} width={300} height={90} rx={14} fill="url(#mmr)" /><path d="M410 130 L520 30" stroke="#3a3a3a" strokeWidth={14} strokeLinecap="round" />
        <g transform={`translate(330 220) rotate(${-tt * 120})`}><circle r={74} fill="none" stroke="#2a2a2a" strokeWidth={14} />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} y1={0} x2={70 * Math.cos(i)} y2={70 * Math.sin(i)} stroke="#3a3a3a" strokeWidth={8} />)}<circle r={14} fill="#8a8a8a" /></g>
        <path d="M150 130 L400 130" stroke="rgba(255,255,255,.4)" strokeWidth={6} />
      </svg>
    </div>
  </>;
}} />;

// m5 · los fajos caen de a uno sobre la mesa y se apilan; el contador mecánico rueda hasta 2,4 millones
export const HMoneyStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 16, per = 0.32, v = 2.4 * cl((tt - 0.4) / (N * per)), dig = (v * 10).toFixed(0).padStart(2, "0");
  return <>
    <CShadow x={760} y={905} w={640} />
    {Array.from({ length: N }, (_, i) => { const f = fall(tt, 0.4 + i * per); if (f.s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: 760 + (i % 3 - 1) * 10, top: 860 - i * 30 + f.y, width: 520, height: 230, transform: `translate(-50%,-50%) perspective(1200px) rotateX(64deg) rotate(${(i * 37) % 9 - 4}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "linear-gradient(135deg,#b9d4a8,#6f9364)", border: "3px solid #3f5e38", boxShadow: "0 9px 0 #dfe9d4, 0 14px 0 #9fb894, 0 22px 20px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", left: 210, top: 0, width: 90, height: "100%", background: "linear-gradient(90deg,#d9c48a,#b89a5a)" }} />
        <div style={{ position: "absolute", left: 30, top: 70, width: 90, height: 90, borderRadius: "50%", border: "4px solid rgba(40,70,40,.5)" }} />
      </div>; })}
    <div style={{ position: "absolute", left: 1450, top: 520, transform: "translate(-50%,-50%)", padding: "30px 36px", borderRadius: 24, background: "linear-gradient(180deg,#e2bf6e,#9a7024)", boxShadow: "0 40px 60px rgba(0,0,0,.55), inset 0 4px 0 rgba(255,255,255,.4)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#2a1a08" }}>$</div>
      {[dig[0], ".", dig[1]].map((d, i) => d === "." ? <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#2a1a08" }}>.</div> :
        <div key={i} style={{ width: 120, height: 170, borderRadius: 10, overflow: "hidden", background: "linear-gradient(#bdb6a6,#f6f2e8 30%,#f6f2e8 70%,#bdb6a6)", boxShadow: "inset 0 0 0 4px #5a4210" }}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 150, lineHeight: "170px", textAlign: "center", color: "#1a1a1a" }}>{d}</div></div>)}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#2a1a08" }}>M</div>
    </div>
    <div style={{ position: "absolute", left: 1450, top: 700, transform: "translate(-50%,0) rotate(-2deg)", padding: "12px 30px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 66, color: INK, boxShadow: "0 14px 24px rgba(0,0,0,.45)", opacity: cl(pop(tt, 2.6) * 1.5), whiteSpace: "nowrap" }}>Congress, 1957</div>
  </>;
}} />;

// m5-6 · el cuentavueltas de bronce que baja de un millón y se traba en 1; la última hormiga camina sobre el rodillo
export const HLastAnt: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = cl((tt - 0.5) / 4.6), v = Math.max(1, Math.round(999999 * Math.pow(1 - k, 4))), stuck = tt > 5.1, jolt = stuck ? Math.exp(-(tt - 5.1) * 5) * Math.sin((tt - 5.1) * 40) * 10 : 0;
  const ds = String(v).padStart(6, "0").split("");
  return <>
    <CShadow x={960} y={760} w={1350} />
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) perspective(1600px) rotateX(14deg) translateY(${jolt}px)`, padding: "40px 46px", borderRadius: 30, background: "linear-gradient(180deg,#e6c47a,#a0762a 60%,#6a4a12)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.4), inset 0 -8px 0 rgba(0,0,0,.3)", display: "flex", gap: 14 }}>
      {ds.map((d, i) => <div key={i} style={{ width: 170, height: 240, borderRadius: 14, overflow: "hidden", position: "relative", background: "linear-gradient(#8a8476,#f6f2e8 28%,#fffdf6 50%,#f6f2e8 72%,#8a8476)", boxShadow: "inset 0 0 0 5px #4a3410" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: "monospace", fontWeight: 700, fontSize: 200, lineHeight: "240px", textAlign: "center", color: stuck && i === 5 ? "#b3221a" : "#1a1a1a" }}>{d}</div>
      </div>)}
    </div>
    {tt > 3.6 && <Ant3 x={1330 - 40 * eio(tt, 3.6, 6.5)} y={410} s={0.8} r={180} tt={tt} />}
  </>;
}} />;

// m6 · un acre de verdad en perspectiva: surcos, el avión que pasa soltando la lluvia de gránulos; al costado, la bolsa de 2 libras en la balanza de cocina
export const HAcreSquare: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const u = eio(tt, 0.8, 6.5), px = -300 + u * 1700, g = eio(tt, 1.6, 6.5), sc = eio(tt, 6.2, 7.4);
  return <>
    <div style={{ position: "absolute", left: 760, top: 720, width: 1300, height: 900, transform: "translate(-50%,-50%) perspective(1200px) rotateX(64deg)", overflow: "hidden", borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,.6)", background: "repeating-linear-gradient(90deg,#5a3e22 0 34px,#7a9b44 34px 64px)" }}>
      <Grain id="acg" o={0.5} f={0.7} />
      {Array.from({ length: 220 }, (_, i) => { const x = (i * 0.618 * 1300) % 1300, y = (i * 0.377 * 900 + i * 13) % 900; return x / 1300 < g ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 12, height: 12, borderRadius: "50%", background: "#f3ead6", boxShadow: "0 2px 0 rgba(0,0,0,.3)" }} /> : null; })}
    </div>
    {Array.from({ length: 40 }, (_, i) => { const ph = (tt * 1.2 + i / 40) % 1, x = px - 60 + (i % 8) * 18; return tt > 1 && tt < 7 ? <div key={i} style={{ position: "absolute", left: x, top: 260 + ph * 420, width: 9, height: 22, borderRadius: 4, background: "#f3ead6", opacity: 0.8 * Math.sin(ph * Math.PI) }} /> : null; })}
    <div style={{ position: "absolute", left: px, top: 210, transform: "translate(-50%,-50%)" }}>
      <svg width={380} height={150} viewBox="0 0 380 150" style={{ filter: "drop-shadow(0 30px 18px rgba(0,0,0,.4))" }}><path d="M20 66 Q30 50 120 52 L300 58 Q350 62 360 80 Q350 96 300 98 L120 102 Q30 102 20 86 Z" fill="#c9cdd2" stroke="#4a5056" strokeWidth={3} /><path d="M150 56 L210 4 L246 4 L222 58 Z M150 98 L210 146 L246 146 L222 98 Z" fill="#aab0b6" stroke="#4a5056" strokeWidth={3} /></svg>
    </div>
    <CShadow x={1580} y={900} w={360} />
    <div style={{ position: "absolute", left: 1580, top: 800, transform: "translate(-50%,-50%)", width: 300, height: 190, borderRadius: "30px 30px 16px 16px", background: "linear-gradient(#f0ece2,#bdb6a6)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.15)" }}>
      <div style={{ position: "absolute", left: 90, top: 40, width: 120, height: 120, borderRadius: "50%", background: "#fffdf6", border: "6px solid #6a6458" }}>
        <div style={{ position: "absolute", left: 51, top: 4, width: 6, height: 52, background: "#b3221a", transformOrigin: "50% 100%", transform: `rotate(${-120 + 160 * eio(tt, 2.4, 3.4)}deg)` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1580, top: 560 + (1 - pop(tt, 1.6, 7, 0.4)) * -500, transform: "translate(-50%,-50%)", width: 260, height: 300, borderRadius: "30px 30px 14px 14px", background: "linear-gradient(160deg,#efe2c2,#c9b07a)", boxShadow: "0 20px 30px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: INK }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1 }}>2 lb</div><div style={{ fontFamily: HAND, fontSize: 56 }}>per acre</div>
    </div>
    {sc > 0 && <div style={{ position: "absolute", left: 760, top: 990, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * sc})`, opacity: sc, fontFamily: HAND, fontSize: 70, color: "#f3ead6", textShadow: "0 6px 20px #000", whiteSpace: "nowrap" }}>× 20 million acres</div>}
  </>;
}} />;

// m9-10 · la arena de tierra: hormigas nativas grandes; la niebla del veneno pasa y las apaga de a una; entran las coloradas desde el borde
export const HAntArena: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const wave = eio(tt, 1.2, 4.6), back = eio(tt, bt(h, 0, 6.6) - 0.6, bt(h, 0, 6.6) + 3.6);
  const nat = Array.from({ length: 16 }, (_, i) => [260 + (i * 233) % 1400, 600 + (i * 157) % 300, i] as const);
  return <>
    <div style={{ position: "absolute", left: 960, top: 760, width: 1800, height: 700, transform: "translate(-50%,-50%) perspective(1300px) rotateX(56deg)", borderRadius: "50%", overflow: "hidden", background: "radial-gradient(#9a7448,#5b4228 70%)", boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}><Grain id="aag" o={0.55} f={0.75} /></div>
    {nat.map(([x, y, i]) => { const dead = cl((wave * 1900 - x) / 160); return <Ant3 key={i} x={x + 10 * Math.sin(tt + i) * (1 - dead)} y={y} s={0.55 + (y - 600) / 900} r={(i * 47) % 360} tt={tt * (1 - dead) + i} col={["#2b2b2b", "#6b4a2c", "#8a6a3a", "#3a3020"][i % 4]} o={1 - 0.85 * dead} />; })}
    <div style={{ position: "absolute", top: 380, height: 640, left: wave * 2200 - 520, width: 520, background: "radial-gradient(ellipse at 70% 50%, rgba(235,238,225,.75), rgba(235,238,225,.2) 60%, transparent 75%)", filter: "blur(22px)", opacity: wave > 0 && wave < 1 ? 1 : 0 }} />
    {Array.from({ length: 22 }, (_, i) => { const p = cl(back * 1.3 - i * 0.02); if (p <= 0) return null; const x = 1950 - p * (300 + (i * 97) % 1500), y = 620 + (i * 71) % 300;
      return <Ant3 key={"r" + i} x={x} y={y} s={0.6 + (y - 600) / 900} r={180 + 10 * Math.sin(i)} tt={tt * 2 + i} />; })}
  </>;
}} />;

// m10 · el caño de la plata del estado: la llave de rueda gira, el chorro de monedas se corta a goteo, el manómetro cae a cero
export const HValveShut: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const turn = eio(tt, 2.4, 4.4), flow = 1 - turn;
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs><linearGradient id="vsp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a6068" /><stop offset=".35" stopColor="#eef2f5" /><stop offset=".7" stopColor="#8a9098" /><stop offset="1" stopColor="#3a4048" /></linearGradient>
        <linearGradient id="vsv" x1="0" x2="1"><stop offset="0" stopColor="#5a6068" /><stop offset=".35" stopColor="#eef2f5" /><stop offset=".7" stopColor="#8a9098" /><stop offset="1" stopColor="#3a4048" /></linearGradient></defs>
      <rect x={-40} y={300} width={1240} height={110} fill="url(#vsp)" /><rect x={1150} y={300} width={110} height={300} rx={20} fill="url(#vsv)" />
      <rect x={1130} y={580} width={150} height={40} rx={10} fill="url(#vsv)" />
      {[200, 980].map((x) => <rect key={x} x={x} y={290} width={40} height={130} rx={8} fill="url(#vsv)" />)}
      <rect x={600} y={250} width={120} height={210} rx={20} fill="url(#vsv)" />
    </svg>
    <div style={{ position: "absolute", left: 660, top: 170, transform: "translate(-50%,-50%) perspective(900px) rotateX(58deg)" }}>
      <svg width={300} height={300} viewBox="-150 -150 300 300" style={{ transform: `rotate(${turn * 540}deg)`, filter: "drop-shadow(0 18px 12px rgba(0,0,0,.5))" }}><circle r={120} fill="none" stroke="#c23a1a" strokeWidth={30} /><circle r={120} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={6} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={0} y1={0} x2={120 * Math.cos(i * 1.2566)} y2={120 * Math.sin(i * 1.2566)} stroke="#a82a12" strokeWidth={22} />)}<circle r={34} fill="#7a1a10" /></svg>
    </div>
    <div style={{ position: "absolute", left: 470, top: 520, width: 440, padding: "20px 26px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "14px 22px 30px rgba(0,0,0,.5)", transform: `rotate(${-4 + 3 * Math.sin(tt * 1.4)}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: INK, lineHeight: 1 }}>ALABAMA</div><div style={{ fontFamily: HAND, fontSize: 58, color: "#7a2a1e", lineHeight: 1 }}>state money cut off</div>
    </div>
    <div style={{ position: "absolute", left: 980, top: 180, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(#fffdf6,#d8d2c4)", border: "12px solid #8a9098", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 75, top: 14, width: 7, height: 66, background: "#b3221a", transformOrigin: "50% 100%", transform: `rotate(${60 - 160 * turn + 3 * Math.sin(tt * 9) * flow}deg)` }} />
    </div>
    {Array.from({ length: 20 }, (_, i) => { const ph = (tt * 1.5 + i / 20) % 1, alive = i / 20 < flow + 0.05; return alive ? <Coin key={i} x={1205 + 10 * Math.sin(i)} y={640 + ph * 300} s={0.55} r={i * 40 + tt * 200} tilt={40 + (i * 23) % 40} o={Math.sin(ph * Math.PI)} /> : null; })}
    <CShadow x={1205} y={960} w={300} o={0.5} />
  </>;
}} />;

// m12 · el grano de cebo: una bola rugosa de marlo; el cuchillo la corta al medio y se ven la capa de aceite y el núcleo rojo del veneno
export const HBaitGrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cut = eio(tt, 1.6, 2.4), sp = eio(tt, 2.4, 3.4), kn = eio(tt, 0.9, 1.7) - eio(tt, 2.4, 3);
  const flags: [string, number, number][] = [["corn cob grit", 3.6, 360], ["soybean oil", 4.6, 520], ["mirex", 5.6, 680]];
  const half = (sd: number) => <div style={{ position: "absolute", left: 860 + sd * 150 * sp, top: 560, transform: `translate(-50%,-50%) rotate(${sd * 12 * sp}deg)` }}>
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ overflow: "visible", filter: "drop-shadow(14px 26px 16px rgba(0,0,0,.45))" }}>
      <defs><radialGradient id={"bgr" + sd} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#f0d088" /><stop offset=".6" stopColor="#c09040" /><stop offset="1" stopColor="#6a4a14" /></radialGradient>
        <filter id={"bgf" + sd}><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves={3} seed={5} /><feDisplacementMap in="SourceGraphic" scale={20} /></filter>
        <clipPath id={"bgc" + sd}><rect x={sd < 0 ? -300 : 0} y={-300} width={300} height={600} /></clipPath></defs>
      <g clipPath={`url(#bgc${sd})`}><circle r={230} fill={`url(#bgr${sd})`} filter={`url(#bgf${sd})`} />
        {cut > 0.99 && <><circle r={200 * sp} fill="none" stroke="#f6dc6a" strokeWidth={26} opacity={0.85} /><circle r={110 * sp} fill="#c22a12" /><circle r={110 * sp} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={6} /></>}</g>
    </svg>
  </div>;
  return <>
    <CShadow x={860} y={820} w={560 + 300 * sp} />
    {half(-1)}{half(1)}
    <div style={{ position: "absolute", left: 860, top: 120 + 380 * kn, transform: "translate(-50%,-50%)" }}>
      <svg width={120} height={620} viewBox="0 0 120 620"><path d="M40 260 L80 260 L80 600 Q60 620 40 560 Z" fill="#dfe4e8" stroke="#6a7076" strokeWidth={3} /><path d="M44 270 L50 560" stroke="rgba(255,255,255,.8)" strokeWidth={6} /><rect x={30} y={10} width={60} height={250} rx={18} fill="#4a2e18" /></svg>
    </div>
    {flags.map(([n, d, y], i) => { const s = pop(tt, d, 7, 0.4); return s > 0.01 && <div key={i} style={{ position: "absolute", left: 1180 + (1 - s) * 200, top: y - 40, opacity: cl(s * 2), display: "flex", alignItems: "center" }}>
      <div style={{ width: 110, height: 4, background: "#c9cdd2" }} /><div style={{ padding: "12px 26px", background: i === 2 ? "#b3221a" : "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: HAND, fontSize: 64, color: i === 2 ? "#fff4ec" : INK, boxShadow: "10px 16px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap" }}>{n}</div></div>; })}
  </>;
}} />;

// m14-15 · el cuentakilómetros de bronce sobre la mesa; detrás el mapa del Sur se tiñe de rojo a medida que suben los acres
export const HOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = eio(tt, 0.6, 5), v = Math.round(370 * k), ds = String(v).padStart(3, "0").split(""), stop = tt > 5 ? Math.exp(-(tt - 5) * 5) * Math.sin((tt - 5) * 40) * 8 : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 330, transform: "translate(-50%,-50%) perspective(1400px) rotateX(18deg)", filter: "drop-shadow(0 30px 30px rgba(0,0,0,.5))" }}>
      <SouthMap w={1100} red={(s) => cl(k * 11 - SOUTH.findIndex(([q]) => q === s))} />
    </div>
    <CShadow x={960} y={940} w={1000} />
    <div style={{ position: "absolute", left: 960, top: 800, transform: `translate(-50%,-50%) translateY(${stop}px)`, padding: "26px 36px", borderRadius: 26, background: "linear-gradient(180deg,#e6c47a,#a0762a 60%,#6a4a12)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.4), 0 30px 50px rgba(0,0,0,.5)", display: "flex", alignItems: "center", gap: 12 }}>
      {ds.map((d, i) => <div key={i} style={{ width: 130, height: 180, borderRadius: 12, overflow: "hidden", background: "linear-gradient(#8a8476,#f6f2e8 28%,#fffdf6 50%,#f6f2e8 72%,#8a8476)", boxShadow: "inset 0 0 0 5px #4a3410", fontFamily: "monospace", fontWeight: 700, fontSize: 150, lineHeight: "180px", textAlign: "center", color: "#1a1a1a" }}>{d}</div>)}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#2a1a08", lineHeight: 1, marginLeft: 10 }}>MILLION<br />ACRES</div>
    </div>
  </>;
}} />;

// m21 · el corte de tierra tipo diorama: a la izquierda UNA cámara con una reina gorda; a la derecha decenas de montículos unidos por túneles, cada uno con su corona
export const HQueenNet: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const g = eio(tt, 2.2, 8), zoom = 1.25 - 0.25 * eio(tt, 2, 8), M = Array.from({ length: 12 }, (_, i) => 760 + i * 95);
  const Crown: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <svg width={60} height={40} viewBox="0 0 60 40" style={{ position: "absolute", left: x - 30, top: y - 20, transform: `scale(${s})` }}><path d="M4 36 L4 12 L16 24 L30 4 L44 24 L56 12 L56 36 Z" fill="#e3c27a" stroke="#8a6a2a" strokeWidth={3} /></svg>;
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "25% 55%" }}>
    <div style={{ position: "absolute", left: 110, top: 450, width: 1700, height: 520, background: "linear-gradient(#6a4a2a,#3a2614)", borderTop: "26px solid #5e8030", boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <Grain id="qng" o={0.5} f={0.6} />
      <div style={{ position: "absolute", left: 160, top: 180, width: 320, height: 200, borderRadius: "50%", background: "radial-gradient(#2a1608,#120a04)" }} />
      <div style={{ position: "absolute", left: 300, top: 0, width: 28, height: 190, background: "#22140a" }} />
      <Ant3 x={320} y={280} s={1.1} tt={tt * 0.2} />
      <svg width={1700} height={520} style={{ position: "absolute", inset: 0 }}>
        {M.map((x, i) => i / M.length < g && <g key={i}><path d={`M${x - 110 + 50} 0 Q${x - 90} 120 ${x - 60} 200`} stroke="#22140a" strokeWidth={18} fill="none" />{i > 0 && <path d={`M${M[i - 1] - 60} 200 Q${x - 110} ${260 + (i % 2) * 60} ${x - 60} 200`} stroke="#22140a" strokeWidth={16} fill="none" />}<ellipse cx={x - 60} cy={210} rx={40} ry={24} fill="#160c04" /></g>)}
      </svg>
      {M.map((x, i) => i / M.length < g && <Ant3 key={i} x={x - 60 + 30 * Math.sin(tt * 2 + i)} y={250 + (i % 2) * 40} s={0.3} r={i % 2 ? 0 : 180} tt={tt + i} />)}
    </div>
    <Mound x={430} y={470} w={190} id="qn0" /><Crown x={440} y={370} s={1.4} />
    {M.map((x, i) => { const s = pop(tt, 2.2 + (i / M.length) * 5.8, 8, 0.4); return s > 0.01 && <React.Fragment key={i}><Mound x={x + 60} y={470} w={110} sx={s} sy={s} id={"qnm" + i} /><Crown x={x + 60} y={420 - 30 * s} s={cl(s)} /></React.Fragment>; })}
  </div>;
}} />;

// m21-22 · macro: la hormiga sobre la tierra con luz de costado; la mosca fórida baja en picada y la toca; la hormiga se encoge y se esconde
export const HPhoridFly: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fx = 1250 + 140 * Math.sin(tt * 1.5), fy = 280 + 50 * Math.sin(tt * 2.7), dive = eio(tt, 3.6, 4.1) * (1 - eio(tt, 4.3, 5)), shrink = eio(tt, 4.1, 4.6), hide = eio(tt, 5.6, 8.5);
  return <>
    <div style={{ position: "absolute", left: -40, right: -40, top: 640, bottom: -40, background: "radial-gradient(ellipse at 40% 0%, #9a7448, #4a3420 70%)" }}><Grain id="pfg" o={0.6} f={0.5} /></div>
    {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 113) % 1900, top: 650 + (i * 37) % 120, width: 30 + (i % 4) * 14, height: 20 + (i % 3) * 8, borderRadius: "45%", background: "radial-gradient(circle at 35% 30%, #b98a58, #5a3a1e)", boxShadow: "6px 8px 6px rgba(0,0,0,.4)" }} />)}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(255,220,160,.18), transparent 50%)" }} />
    <Ant3 x={880 - 700 * hide} y={620} s={3.6 * (1 - 0.18 * shrink)} r={0} tt={tt * (shrink > 0 ? 3 : 0.6)} />
    <div style={{ position: "absolute", left: fx - (fx - 1020) * dive, top: fy + (500 - fy) * dive, transform: "translate(-50%,-50%) scale(2.6)" }}>
      <svg width={120} height={90} viewBox="-60 -45 120 90" style={{ overflow: "visible", filter: "drop-shadow(0 30px 10px rgba(0,0,0,.35))" }}>
        <ellipse cx={-16} cy={-16} rx={30} ry={10} fill="rgba(220,235,255,.55)" stroke="rgba(255,255,255,.6)" transform={`rotate(${-24 + 34 * Math.sin(tt * 90)})`} />
        <ellipse cx={16} cy={-16} rx={30} ry={10} fill="rgba(220,235,255,.55)" stroke="rgba(255,255,255,.6)" transform={`rotate(${24 - 34 * Math.sin(tt * 90)})`} />
        <path d="M-18 6 Q-6 -16 16 -4 Q24 6 14 16 Q-2 22 -18 6Z" fill="#5a4214" /><circle cx={-20} cy={4} r={8} fill="#3a2a08" /><circle cx={-24} cy={2} r={3} fill="#c23a1a" />
        {[-6, 2, 10].map((x) => <path key={x} d={`M${x} 14 L${x - 6} 30`} stroke="#3a2a08" strokeWidth={2.5} />)}
      </svg>
    </div>
  </>;
}} />;

// m23 · el fichero de biblioteca: una ficha enorme sale del cajón, se da vuelta (pregunta → respuesta); sobre la primera cae el sello REAL
export const HQCards: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const Q = [["Was the fire ant a real threat?", "Yes. The cure was the problem."], ["Did the spraying kill people?", "No documented case. Wildlife, yes."], ["Is mirex still around?", "Cancelled 1978."]];
  const per = Math.max(2.6, (h.out - h.at - 0.6) / Q.length), i = Math.min(Q.length - 1, Math.floor(Math.max(0, tt - 0.3) / per)), lt = tt - 0.3 - i * per;
  const up = pop(lt, 0, 7, 0.45), fl = eio(lt, per * 0.45, per * 0.45 + 0.6);
  return <>
    <CShadow x={960} y={960} w={1000} />
    <Box x={960} y={960} w={760} h={260} d={420} rx={-12} ry={0} front={WOOD} top={WOODTOP} side={WOODSIDE}>
      <div style={{ position: "absolute", left: 300, top: 150, width: 160, height: 50, borderRadius: 12, background: "linear-gradient(#e6c47a,#8a6224)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 300, top: 50, width: 160, height: 70, background: "#f6efdc", fontFamily: HAND, fontSize: 48, color: INK, textAlign: "center", lineHeight: "70px" }}>ANTS</div>
    </Box>
    {i < Q.length - 1 && <div style={{ position: "absolute", left: 960, top: 620, width: 700, height: 420, transform: "translate(-50%,-50%) rotate(2deg)", background: "repeating-linear-gradient(#fbf7ec 0 70px,#9fbdd8 70px 72px)", borderTop: `14px solid ${STAMP}`, boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />}
    <div style={{ position: "absolute", left: 960, top: 720 - 300 * up, width: 820, height: 500, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${180 * fl}deg) rotate(-2deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "repeating-linear-gradient(#fbf7ec 0 84px,#9fbdd8 84px 87px)", borderTop: `16px solid ${STAMP}`, boxShadow: "0 40px 60px rgba(0,0,0,.5)", padding: "50px 60px", fontFamily: HAND, fontSize: 84, color: "#22314f", lineHeight: 1.05 }}>{Q[i][0]}</div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(160deg,#f6efdc,#e0d2ae)", borderTop: "16px solid #3a5a2a", boxShadow: "0 40px 60px rgba(0,0,0,.5)", padding: "60px 60px", fontFamily: FONT, fontWeight: 900, fontSize: 76, color: INK, lineHeight: 1.05 }}>
        {Q[i][1]}{i === 0 && <Stamp tt={lt} at={per * 0.45 + 0.9} txt="REAL" x={600} y={360} size={96} r={-10} />}
      </div>
    </div>
  </>;
}} />;

// m24 · el repaso: la tira de película sale del proyector de mesa; el haz de luz pasa por cada cuadro (dibujos del archivo), que sale hacia cámara con resorte
const RICON: Record<string, React.ReactNode> = {
  ship: <svg width={300} height={200}><path d="M30 120 L270 120 L240 170 L60 170 Z" fill="#2a2a2a" /><path d="M80 120 Q130 80 180 120Z" fill="#7a5232" /><rect x={200} y={70} width={50} height={50} fill="#d8d2c4" /></svg>,
  news: <svg width={300} height={200}><rect x={50} y={30} width={200} height={150} fill="#efe8d6" /><rect x={70} y={50} width={160} height={30} fill="#1e1a14" />{[0, 1, 2, 3].map((i) => <rect key={i} x={70} y={95 + i * 18} width={160} height={8} fill="#8a8476" />)}</svg>,
  plane: <svg width={300} height={200}><path d="M40 100 Q50 84 140 86 L250 90 Q280 94 284 108 Q280 120 250 122 L140 126 Q50 126 40 112Z" fill="#f0b81c" /><path d="M150 88 L190 40 L214 40 L200 90Z" fill="#d9a612" />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={60 - i * 10} cy={140 + i * 8} r={14 + i * 3} fill="rgba(255,255,255,.6)" />)}</svg>,
  quail: <svg width={300} height={200}><ellipse cx={140} cy={120} rx={70} ry={44} fill="#8a6a44" /><circle cx={200} cy={88} r={26} fill="#7a5a38" /><path d="M60 170 L240 170" stroke="#5a7a2c" strokeWidth={8} /><path d="M100 60 L200 170 M200 60 L100 170" stroke={STAMP} strokeWidth={12} /></svg>,
  milk: <svg width={300} height={200}><path d="M130 20 H170 V50 Q200 64 200 90 V180 H100 V90 Q100 64 130 50Z" fill="#f8f6ee" stroke="#9aa6ac" strokeWidth={4} /><rect x={190} y={100} width={90} height={40} fill={STAMP} transform="rotate(-12 235 120)" /></svg>,
  ants: <svg width={300} height={200}>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={60 + i * 45} cy={100 + (i % 2) * 30} rx={16} ry={10} fill={i === 4 ? "#a3301a" : "#2b2b2b"} opacity={i === 4 ? 1 : 0.35} />)}</svg>,
  stamp: <svg width={300} height={200}><rect x={60} y={30} width={180} height={140} fill="#efe8d6" /><rect x={70} y={80} width={160} height={46} fill="none" stroke={STAMP} strokeWidth={8} transform="rotate(-10 150 103)" /></svg>,
  map: <svg width={300} height={200}><rect x={30} y={30} width={240} height={140} fill="#ece2c8" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={50 + (i % 3) * 70} y={50 + Math.floor(i / 3) * 55} width={60} height={45} fill="#c84a3a" opacity={0.85} />)}</svg>,
  hand: <svg width={300} height={200}><circle cx={150} cy={100} r={70} fill="none" stroke="#3a8a5a" strokeWidth={12} /><path d="M115 100 L140 125 L190 75" stroke="#3a8a5a" strokeWidth={14} fill="none" /></svg>,
};
export const HRecapReel: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const caps: [string, string][] = [["ship", "a ship to Mobile"], ["news", "panic"], ["plane", "planes of poison"], ["quail", "quail & fish die"], ["milk", "milk flagged"], ["ants", "natives wiped out"], ["stamp", "mirex till 1978"], ["map", "370 M acres"], ["hand", "control, not war"]];
  const per = (h.out - h.at - 0.8) / caps.length, a = Math.min(caps.length - 1, Math.max(0, Math.floor((tt - 0.4) / per))), lt = tt - 0.4 - a * per, slide = a + eio(lt, 0, 0.35) - 1 + (a === 0 ? 1 - eio(lt, 0, 0.35) : 0);
  return <>
    <CShadow x={260} y={930} w={360} />
    <div style={{ position: "absolute", left: 260, top: 800, transform: "translate(-50%,-50%)", width: 300, height: 220, borderRadius: 30, background: "linear-gradient(160deg,#5a5f66,#22252a)", boxShadow: "inset 0 5px 0 rgba(255,255,255,.2)" }}>
      <div style={{ position: "absolute", right: -40, top: 60, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(#fff8e0,#ffcf6a 40%,#5a4a2a 72%)", boxShadow: "0 0 60px 20px rgba(255,220,140,.4)" }} />
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 30 + i * 140, top: -130, width: 120, height: 120, borderRadius: "50%", border: "10px solid #2a2a2a", background: "#3a3a3a", transform: `rotate(${tt * 200}deg)` }}><div style={{ width: 8, height: 50, background: "#666", margin: "25px auto" }} /></div>)}
    </div>
    <div style={{ position: "absolute", left: 300, top: 300, width: 1500, height: 520, background: "linear-gradient(90deg, rgba(255,230,170,.32), rgba(255,230,170,.04))", clipPath: "polygon(0 88%, 100% 0, 100% 100%, 0 100%)", filter: "blur(8px)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: 0, top: 160, width: 1920, height: 600, perspective: 1600 }}>
      <div style={{ position: "absolute", left: 1000 - slide * 520 - 230, top: 60, height: 460, width: caps.length * 520 + 100, transform: "rotateY(-12deg)", transformOrigin: "50% 50%", background: "#141414", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
        {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 0, right: 0, top: r ? 418 : 12, height: 30, backgroundImage: "repeating-linear-gradient(90deg,transparent 0 30px,#f3ead6 30px 54px,transparent 54px 84px)" }} />)}
        {caps.map(([ic], i) => { const act = i === a, s = act ? pop(lt, 0.2, 8, 0.45) : 0;
          return <div key={i} style={{ position: "absolute", left: 50 + i * 520, top: 56, width: 460, height: 350, borderRadius: 8, overflow: "hidden", background: act ? "linear-gradient(#fff6dc,#e8d8b0)" : "#3a352e", transform: `translateZ(${120 * s}px) scale(${1 + 0.12 * s})`, boxShadow: act ? "0 30px 50px rgba(0,0,0,.6)" : "none", filter: act ? "none" : "brightness(.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: "scale(1.3)" }}>{RICON[ic]}</div>
            <div style={{ position: "absolute", left: 20, top: 14, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: act ? STAMP : "#999" }}>{i + 1}</div>
          </div>; })}
      </div>
    </div>
    <div style={{ position: "absolute", left: 1100, top: 900, transform: `translate(-50%,-50%) rotate(-1.5deg) scale(${0.85 + 0.15 * pop(lt, 0.3, 8, 0.4)})`, padding: "10px 40px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", fontFamily: HAND, fontSize: 80, color: INK, whiteSpace: "nowrap" }}>{caps[a][1]}</div>
  </>;
}} />;

// ——— las de nota 7 ———
// m4 · el diario cae girando sobre la mesa; encima se apoya el mapa del Sur de papel y se tiñen los 9 estados de a uno
export const HNewsMenace: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const s = pop(tt, 0.2, 4, 0.6), spin = (1 - s) * 400, mp = pop(tt, 4.2, 7, 0.45), NINE = ["TX", "LA", "AR", "MS", "AL", "GA", "FL", "SC", "NC"];
  return <>
    <Sheet x={820} y={560} w={1200} h={800} rx={36} r={-spin - 5} s={0.3 + 0.7 * s} id="nmg" bg="linear-gradient(160deg,#efe8d6,#d8cfb8)">
      <div style={{ padding: "40px 60px", fontFamily: "Georgia, serif", color: "#1e1a14" }}>
        <div style={{ textAlign: "center", fontSize: 40, letterSpacing: 6, borderBottom: "3px double #1e1a14", paddingBottom: 12 }}>THE SOUTHERN COUNTY HERALD · 1956</div>
        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 150, lineHeight: 1, margin: "30px 0 20px", letterSpacing: -2 }}>FIRE ANT MENACE</div>
        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 50 }}>Calves killed? Children attacked?</div>
        <div style={{ display: "flex", gap: 30, marginTop: 36 }}>{[0, 1, 2].map((c) => <div key={c} style={{ flex: 1 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ height: 10, margin: "14px 0", background: "rgba(30,26,20,.3)", width: `${92 - (i * 13 + c * 7) % 24}%` }} />)}</div>)}</div>
      </div>
    </Sheet>
    {mp > 0.01 && <div style={{ position: "absolute", left: 1380, top: 640 + (1 - mp) * -600, transform: `translate(-50%,-50%) perspective(1400px) rotateX(30deg) rotate(6deg)`, filter: "drop-shadow(20px 30px 20px rgba(0,0,0,.5))" }}>
      <SouthMap w={760} red={(k) => { const i = NINE.indexOf(k); return i < 0 ? 0 : cl(pop(tt, 5 + i * 0.45, 8, 0.4)); }} />
    </div>}
  </>;
}} />;

// m6-7 · las cartas de advertencia: sobres que se deslizan por la mesa de a uno, a cada uno le cae el sello FILED y todos terminan en el cajón que se cierra
export const HWarnLetters: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L = [["Wildlife biologists", "This will kill fish and birds."], ["Fish & Wildlife Service", "We have serious questions."], ["State game departments", "Please reconsider."], ["Ant experts", "Eradication is not possible."]];
  const at = [0.4, bt(h, 1, 3.4), bt(h, 2, 6.2), bt(h, 2, 6.2) + 2.2], cur = Math.max(0, at.filter((a) => tt > a).length - 1), drawer = eio(tt, h.out - h.at - 2.2, h.out - h.at - 1.2);
  return <>
    {/* el cajón de archivo, a la derecha */}
    <CShadow x={1560} y={930} w={520} />
    <Box x={1560} y={930} w={460} h={300} d={380} ry={-24} rx={-10} front={WOOD} top={WOODTOP} side={WOODSIDE}>
      <div style={{ position: "absolute", left: 170, top: 120, width: 120, height: 40, borderRadius: 10, background: "linear-gradient(#e6c47a,#8a6224)" }} />
    </Box>
    {L.map(([from, msg], i) => { const s = pop(tt, at[i], 6, 0.5); if (s <= 0.01) return null; const gone = i < cur ? 1 : drawer, x = 760 + (1 - s) * -1300 + gone * 800, y = 560 - i * 8 + gone * 180;
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) perspective(1500px) rotateX(${30 + 20 * gone}deg) rotate(${-4 + i * 3}deg) scale(${1 - 0.5 * gone})`, opacity: 1 - gone * (i < cur ? 1 : 0.2) }}>
        <div style={{ width: 900, height: 560, background: "linear-gradient(160deg,#f6efdc,#e0d2ae)", boxShadow: "20px 34px 40px rgba(0,0,0,.5)", padding: "54px 64px", position: "relative" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 3, color: "#5a4a32" }}>{from.toUpperCase()}</div>
          <div style={{ height: 3, background: "#5a4a32", opacity: 0.4, margin: "20px 0 30px" }} />
          <div style={{ fontFamily: HAND, fontSize: 96, color: "#23324f", lineHeight: 1.05 }}>{msg}</div>
          <Stamp tt={tt} at={at[i] + 1.3} txt="FILED" x={640} y={430} r={-14} size={96} />
        </div></div>; })}
  </>;
}} />;

// m7 · el pizarrón: codornices de papel recortado paradas en el borde; un trapo de tiza las borra de a una hasta dejarlo limpio
export const HQuailTally: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const N = 7, wipe = eio(tt, 3, 8.6), rx = 180 + wipe * 1500;
  return <>
    <div style={{ position: "absolute", left: 960, top: 470, width: 1560, height: 720, transform: "translate(-50%,-50%)", borderRadius: 14, background: "radial-gradient(ellipse at 40% 30%,#35503f,#1c2e24)", border: "26px solid #6b4a2c", boxShadow: "0 50px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <Grain id="qtg" o={0.25} f={1.2} blend="screen" />
      <div style={{ position: "absolute", left: 70, top: 50, fontFamily: HAND, fontSize: 96, color: "#f3f0e6" }}>Bobwhite coveys counted</div>
      <svg width={1500} height={300} style={{ position: "absolute", left: 60, top: 200 }}>{Array.from({ length: 30 }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, x0 = 40 + g * 230;
        return <line key={i} x1={j === 4 ? x0 - 10 : x0 + j * 36} y1={j === 4 ? 40 : 20} x2={j === 4 ? x0 + 160 : x0 + j * 36 + 6} y2={j === 4 ? 200 : 220} stroke="#f3f0e6" strokeWidth={10} strokeLinecap="round" opacity={cl(pop(tt, 0.3 + i * 0.07) * 1.4)} />; })}</svg>
      {/* lo borrado: el trapo deja un velo de tiza */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(0, rx - 180), background: "linear-gradient(90deg, rgba(200,210,200,.18), rgba(200,210,200,.08))", backdropFilter: "none" }} />
      <div style={{ position: "absolute", left: 0, top: 160, bottom: 140, width: Math.max(0, rx - 180), background: "radial-gradient(ellipse at 40% 30%,#35503f,#1c2e24)" }} />
      <div style={{ position: "absolute", left: 120, top: 470, fontFamily: HAND, fontSize: 130, color: "#ff9a8a", opacity: cl(pop(tt, 8.4) * 1.5) }}>after: 0</div>
    </div>
    {/* el borde de madera con las codornices de papel */}
    <div style={{ position: "absolute", left: 180, top: 838, width: 1560, height: 30, background: "linear-gradient(#8a6038,#4a2e16)", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
    {Array.from({ length: N }, (_, i) => { const x = 330 + i * 200, gone = cl((rx - x) / 140); return <svg key={i} width={160} height={110} viewBox="0 0 160 110" style={{ position: "absolute", left: x - 80, top: 730, opacity: 1 - gone, transform: `translateY(${gone * 30}px) rotate(${gone * 30}deg)`, filter: "drop-shadow(6px 10px 6px rgba(0,0,0,.45))" }}>
      <ellipse cx={70} cy={66} rx={56} ry={36} fill="#9a7a4a" stroke="#4a3418" strokeWidth={3} /><circle cx={120} cy={40} r={22} fill="#8a6a3a" stroke="#4a3418" strokeWidth={3} /><path d="M126 22 Q136 8 142 20" stroke="#3a2a1a" strokeWidth={4} fill="none" /><circle cx={126} cy={38} r={4} fill="#111" /><path d="M108 48 L136 48" stroke="#f3ead6" strokeWidth={5} />{[0, 1, 2].map((k) => <circle key={k} cx={50 + k * 22} cy={62} r={6} fill="#f0e6d0" />)}<path d="M60 100 L60 110 M90 100 L90 110" stroke="#3a2a1a" strokeWidth={4} /></svg>; })}
    {/* el trapo */}
    {wipe > 0 && wipe < 1 && <div style={{ position: "absolute", left: rx - 130, top: 540 + 60 * Math.sin(tt * 6), width: 260, height: 170, borderRadius: "40% 50% 45% 55%", background: "radial-gradient(circle at 40% 35%, #e8e4da, #b8b2a4)", boxShadow: "0 20px 30px rgba(0,0,0,.45)", transform: `rotate(${10 * Math.sin(tt * 6)}deg)` }} />}
  </>;
}} />;

// m22 · el reloj de arena de vidrio sobre la mesa: arriba un avioncito de 1957 hundido en la arena; abajo se junta el montón con una mosca posada; al vaciarse gira y aparece 40 años tallado
export const HHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const k = eio(tt, 0.8, 7.5), flip = eio(tt, 7.8, 8.6), tag = pop(tt, 8.6, 8, 0.4);
  return <>
    <CShadow x={960} y={960} w={560} />
    <div style={{ position: "absolute", left: 960, top: 590, transform: `translate(-50%,-50%) rotate(${180 * flip}deg)` }}>
      <svg width={520} height={760} viewBox="-260 -380 520 760" style={{ overflow: "visible" }}>
        <defs><linearGradient id="hgw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a30" /><stop offset="1" stopColor="#4a2a12" /></linearGradient>
          <linearGradient id="hgg" x1="0" x2="1"><stop offset="0" stopColor="rgba(200,225,235,.45)" /><stop offset=".2" stopColor="rgba(255,255,255,.06)" /><stop offset=".8" stopColor="rgba(255,255,255,.05)" /><stop offset="1" stopColor="rgba(160,190,200,.45)" /></linearGradient>
          <clipPath id="hgc"><path d="M-180 -340 Q-180 -60 -16 0 Q-180 60 -180 340 L180 340 Q180 60 16 0 Q180 -60 180 -340 Z" /></clipPath></defs>
        {[-1, 1].map((s) => <rect key={s} x={-235} y={s < 0 ? -380 : 340} width={470} height={44} rx={14} fill="url(#hgw)" />)}
        {[-200, 200].map((x) => <rect key={x} x={x - 9} y={-340} width={18} height={680} fill="url(#hgw)" />)}
        <g clipPath="url(#hgc)">
          <rect x={-200} y={-340 + 300 * k} width={400} height={340} fill="#e3c27a" />
          <path d={`M-200 340 L-200 ${330 - 260 * k + 40} Q0 ${330 - 300 * k} 200 ${330 - 260 * k + 40} L200 340 Z`} fill="#d9b468" />
          {k > 0 && k < 1 && <rect x={-4} y={0} width={8} height={340} fill="#e3c27a" />}
        </g>
        <path d="M-180 -340 Q-180 -60 -16 0 Q-180 60 -180 340 L180 340 Q180 60 16 0 Q180 -60 180 -340 Z" fill="url(#hgg)" stroke="rgba(235,245,250,.7)" strokeWidth={6} />
        <path d="M-150 -300 Q-150 -120 -60 -40" stroke="rgba(255,255,255,.6)" strokeWidth={12} fill="none" strokeLinecap="round" />
        {/* el avioncito hundiéndose arriba */}
        {k < 0.85 && <g transform={`translate(0 ${-300 + 290 * k}) scale(.55)`} opacity={1 - k}><path d="M-120 0 Q-110 -14 -20 -12 L90 -8 Q120 -4 124 10 Q120 22 90 24 L-20 28 Q-110 28 -120 14Z" fill="#f0b81c" stroke="#6a4a08" strokeWidth={4} /><path d="M-10 -10 L30 -60 L54 -60 L40 -8Z" fill="#d9a612" /></g>}
        {/* la mosquita posada sobre el montón de abajo */}
        {k > 0.5 && <g transform={`translate(30 ${330 - 300 * k - 6})`} opacity={cl(k * 3 - 1.5)}><ellipse cx={-7} cy={-9} rx={13} ry={5} fill="rgba(220,235,255,.8)" transform="rotate(-20)" /><ellipse cx={7} cy={-9} rx={13} ry={5} fill="rgba(220,235,255,.8)" transform="rotate(20)" /><ellipse cx={0} cy={0} rx={9} ry={6} fill="#3a2a10" /></g>}
      </svg>
    </div>
    <div style={{ position: "absolute", left: 470, top: 300, transform: `translate(-50%,-50%) rotate(-4deg) scale(${pop(tt, 0.8, 7, 0.4)})`, padding: "14px 30px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: INK, boxShadow: "0 18px 30px rgba(0,0,0,.5)" }}>1957</div>
    <div style={{ position: "absolute", left: 1450, top: 820, transform: `translate(-50%,-50%) rotate(3deg) scale(${pop(tt, 6.4, 7, 0.4)})`, padding: "14px 30px", background: "linear-gradient(160deg,#f3e6c6,#d6bf8e)", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: INK, boxShadow: "0 18px 30px rgba(0,0,0,.5)" }}>1997</div>
    {tag > 0.01 && <div style={{ position: "absolute", left: 960, top: 1000, transform: `translate(-50%,-50%) scale(${tag})`, fontFamily: MARK, fontSize: 96, color: "#f3e6c6", textShadow: "0 8px 0 #4a2a12, 0 14px 30px #000" }}>40 YEARS</div>}
  </>;
}} />;

// m2 · la lupa de verdad se corre sobre la mesa y encuadra la hormiga 3D al lado de un grano de arroz; adentro del vidrio todo se agranda
export const HRiceScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lx = 1500 - 560 * eio(tt, 0.4, 2.4), ly = 560 - 20 * eio(tt, 0.4, 2.4), ruler = eio(tt, 3.2, 5.2);
  const scene = (m: number) => <>
    <div style={{ position: "absolute", left: 820 * m - (m - 1) * lx, top: 640 * m - (m - 1) * ly, width: 110 * m, height: 44 * m, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffefa,#e2dccb)", boxShadow: `0 ${8 * m}px ${10 * m}px rgba(0,0,0,.35)`, transform: "translate(-50%,-50%) rotate(-8deg)" }} />
    <Ant3 x={1010 * m - (m - 1) * lx} y={630 * m - (m - 1) * ly} s={0.62 * m} r={0} tt={tt * 0.5} />
  </>;
  return <>
    <CShadow x={920} y={650} w={420} o={0.35} />
    {scene(1)}
    {/* la regla de madera que aparece con los milímetros */}
    <div style={{ position: "absolute", left: 960, top: 860, transform: `translate(-50%,-50%) perspective(1200px) rotateX(50deg) scaleX(${ruler})`, width: 900, height: 110, background: "linear-gradient(#e8c88a,#b88e52)", boxShadow: "0 16px 20px rgba(0,0,0,.45)" }}>
      {Array.from({ length: 31 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 28, top: 0, width: 4, height: i % 10 === 0 ? 60 : i % 5 === 0 ? 44 : 28, background: INK }} />)}
    </div>
    {ruler > 0.6 && <div style={{ position: "absolute", left: 1010, top: 760, transform: "translate(-50%,-50%)", fontFamily: HAND, fontSize: 90, color: "#f3ead6", textShadow: "0 6px 20px #000", opacity: cl(ruler * 3 - 1.8) }}>≈ 3 mm</div>}
    {/* la lupa: vidrio que agranda lo que tiene abajo */}
    <div style={{ position: "absolute", left: lx - 260, top: ly - 260, width: 520, height: 520, borderRadius: "50%", overflow: "hidden", border: "26px solid #3a2a1a", boxShadow: "0 50px 70px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: -(lx - 260) - 26, top: -(ly - 260) - 26, width: 1920, height: 1080 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, #6a4a2c, #3a2716)" }} />
        {scene(1.9)}
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 22%,rgba(255,255,255,.45),transparent 32%)" }} />
    </div>
    <div style={{ position: "absolute", left: lx + 160, top: ly + 160, width: 70, height: 340, borderRadius: 30, background: "linear-gradient(90deg,#2a1c10,#6a4a2a,#2a1c10)", transform: "rotate(-45deg)", transformOrigin: "50% 0", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
  </>;
}} />;

// m3-4 · la libreta en la mesa: un lápiz de verdad escribe cada renglón en vivo y al final subraya el 13
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const lines = ["Mobile, 1942", "red ants — big mound", "vacant lot by the house", "E.O.W., age 13"], per = 1.25;
  const tot = lines.join("").length, done = Math.max(0, (tt - 0.6) / (per * lines.length)) * tot, ul = eio(tt, 0.6 + per * lines.length + 0.1, 0.6 + per * lines.length + 0.7);
  let acc = 0, px = 0, py = 0;
  const rows = lines.map((l, i) => { const n = Math.max(0, Math.min(l.length, Math.floor(done - acc))); if (n > 0 && n <= l.length) { px = 300 + n * 30; py = 250 + i * 110; } acc += l.length; return l.slice(0, n); });
  if (ul > 0) { px = 520 + 200 * ul; py = 250 + 3 * 110 + 40; }
  return <>
    <Sheet x={960} y={560} w={1300} h={820} rx={34} r={-3} id="nbg" bg="repeating-linear-gradient(#fbf7ec 0 107px,#9fbdd8 107px 110px)">
      <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 3, background: "#e08a8a" }} />
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30, top: 40 + i * 88, width: 50, height: 50, borderRadius: "50%", border: "7px solid #8a8f96", background: "#2a2a2a" }} />)}
      <div style={{ position: "absolute", left: 180, top: 140 }}>{rows.map((r, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 92, color: "#23324f", height: 110, lineHeight: "110px", whiteSpace: "nowrap" }}>{r}</div>)}</div>
      <svg width={1300} height={820} style={{ position: "absolute", inset: 0 }}><path d="M530 590 Q630 600 740 586" stroke="#b3221a" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ul} 1`} /></svg>
    </Sheet>
    {/* el lápiz amarillo con su sombra */}
    <div style={{ position: "absolute", left: px + 300, top: py + 120 + 6 * Math.sin(tt * 14), transform: "rotate(38deg)", transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 460, height: 30, background: "rgba(0,0,0,.35)", filter: "blur(8px)" }} />
      <svg width={500} height={50} viewBox="0 0 500 50"><path d="M0 25 L50 8 L50 42 Z" fill="#e8c898" /><path d="M0 25 L14 20 L14 30Z" fill="#2a2a2a" /><rect x={50} y={8} width={380} height={34} fill="#f0b81c" /><rect x={50} y={8} width={380} height={10} fill="#ffd96a" /><rect x={430} y={6} width={30} height={38} fill="#b8bec4" /><rect x={460} y={6} width={36} height={38} rx={8} fill="#e88a8a" /></svg>
    </div>
  </>;
}} />;

// m10-11 · el libro de tapas duras se abre sobre la mesa, se pasa una hoja con curva y el resaltador amarillo subraya el capítulo en vivo
export const HBookChapter: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const o = eio(tt, 0.4, 1.8), pg = eio(tt, 2.2, 3.2), hl = eio(tt, 3.8, 6.2);
  return <>
    <CShadow x={960} y={940} w={1500} />
    <div style={{ position: "absolute", left: 960, top: 600, width: 1440, height: 860, transform: "translate(-50%,-50%) perspective(1800px) rotateX(36deg)", transformStyle: "preserve-3d" }}>
      {/* tapa trasera y bloque de páginas (grosor) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#1a2c38", borderRadius: 10, transform: "translateZ(-30px)" }} />
      {[0, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: sd ? 720 : 20, top: 14, width: 700, height: 830, background: "repeating-linear-gradient(90deg,#efe6cf 0 2px,#d9cdb0 2px 4px)", transform: "translateZ(-16px)" }} />)}
      <div style={{ position: "absolute", left: 720, top: 10, width: 700, height: 840, background: "linear-gradient(90deg,#d9cdb0,#f6efdc 8%)", padding: "80px 70px 0 80px", overflow: "hidden" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 8, color: "#7a6a4a" }}>CHAPTER 10</div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 70, color: INK, marginTop: 18, lineHeight: 1 }}>Indiscriminately from the Skies</div>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "relative", fontFamily: "Georgia, serif", fontSize: 44, color: "#3a3026", marginTop: 22, whiteSpace: "nowrap" }}>
          {i === 2 || i === 3 ? <>{i === 2 ? "the fire ant program —" : "badly planned, badly done"}<div style={{ position: "absolute", left: -10, top: 4, height: 50, width: `${cl(hl * 2 - (i - 2)) * 104}%`, background: "rgba(255,214,70,.55)", mixBlendMode: "multiply" }} /></> : <div style={{ height: 14, marginTop: 20, width: `${86 - (i * 9) % 20}%`, background: "rgba(42,33,24,.3)", borderRadius: 4 }} />}
        </div>)}
      </div>
      <div style={{ position: "absolute", left: 20, top: 10, width: 700, height: 840, background: "linear-gradient(270deg,#d9cdb0,#f6efdc 8%)" }} />
      {/* la hoja que se da vuelta con curva */}
      <div style={{ position: "absolute", left: 720, top: 10, width: 700, height: 840, transformOrigin: "0 50%", transform: `rotateY(${-178 * pg}deg) skewY(${-4 * Math.sin(pg * Math.PI)}deg)`, background: `linear-gradient(${pg < 0.5 ? 90 : 270}deg,#d9cdb0,#fbf5e6 20%,#efe6cf)`, boxShadow: `${-30 * Math.sin(pg * Math.PI)}px 10px 40px rgba(0,0,0,.35)`, opacity: pg > 0.001 && pg < 0.999 ? 1 : 0 }} />
      {/* la tapa que se abre */}
      <div style={{ position: "absolute", left: 720, top: 0, width: 720, height: 860, transformOrigin: "0 50%", transform: `rotateY(${-180 * (1 - o)}deg) translateZ(4px)`, background: "linear-gradient(135deg,#2f4a5a,#1a2c38)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backfaceVisibility: "hidden", opacity: o < 1 ? 1 : 0 }}>
        <div style={{ fontFamily: MARK, fontSize: 110, color: "#e8dcc0", textAlign: "center", lineHeight: 1 }}>SILENT<br />SPRING</div><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#e8dcc0", marginTop: 30 }}>1962</div>
      </div>
    </div>
  </>;
}} />;

// m14 · la hoja de registro apoyada en la mesa con la esquina levantada; el sello baja, se aplasta y deja la tinta con borde irregular
export const HCancelStamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const down = eio(tt, 1.4, 2.0), squash = tt > 2 ? Math.exp(-(tt - 2) * 8) : 0, up = eio(tt, 2.3, 3), ink = tt > 2 ? 1 : 0, bounce = tt > 2 ? Math.exp(-(tt - 2) * 6) * Math.sin((tt - 2) * 30) * 6 : 0;
  return <>
    <Sheet x={960} y={590 + bounce} w={1100} h={820} rx={40} r={-2} id="csg">
      <div style={{ padding: "70px 90px", fontFamily: "'Courier New', monospace", color: "#2a2118" }}>
        <div style={{ fontSize: 40, letterSpacing: 4 }}>U.S. ENVIRONMENTAL PROTECTION AGENCY</div>
        <div style={{ fontSize: 40, letterSpacing: 4, marginTop: 6 }}>PESTICIDE REGISTRATION</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, marginTop: 30 }}>MIREX</div>
        <div style={{ fontSize: 44, marginTop: 20, position: "relative", display: "inline-block" }}>Registration No. 1159-42<div style={{ position: "absolute", left: -10, right: -10, top: 26, height: 6, background: "#2a2118", transform: `scaleX(${eio(tt, 3.4, 4)})`, transformOrigin: "0 50%" }} /></div>
        {["Use: fire ant bait, granular", "Area: Southern states", "Status:"].map((l, i) => <div key={i} style={{ fontSize: 44, marginTop: 18 }}>{l}</div>)}
      </div>
      {ink > 0 && <div style={{ position: "absolute", left: 300, top: 520, transform: "rotate(-12deg)", padding: "8px 34px", border: "9px solid #b3221a", borderRadius: 10, color: "#b3221a", fontFamily: MARK, fontSize: 110, letterSpacing: 4, mixBlendMode: "multiply", opacity: 0.9, filter: "url(#csrough)", whiteSpace: "nowrap" }}>CANCELLED 1978</div>}
      <svg width={0} height={0}><filter id="csrough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale={7} /></filter></svg>
    </Sheet>
    {/* el sello de goma con mango de madera */}
    <div style={{ position: "absolute", left: 760, top: -420 + 860 * down - 700 * up, transform: `scaleY(${1 - 0.12 * squash}) rotate(-12deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 120, height: 260, margin: "0 auto", borderRadius: "60px 60px 20px 20px", background: "radial-gradient(circle at 35% 25%, #c48a52, #6a3e18 70%)" }} />
      <div style={{ width: 560, height: 70, marginLeft: -220, borderRadius: 10, background: "linear-gradient(#5a3a20,#2a1a0c)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <div style={{ width: 540, height: 26, marginLeft: -210, background: "#7a1a12" }} />
    </div>
  </>;
}} />;

export const HCA3: Record<string, React.FC<{ t: number; h: H }>> = {
  newsMenace: HNewsMenace, warnLetters: HWarnLetters, quailTally: HQuailTally, hourglass: HHourglass, riceScale: HRiceScale, notebook: HNotebook, bookChapter: HBookChapter, cancelStamp: HCancelStamp,
  caseFile: HCaseFile, portRoute: HPortRoute, moundMower: HMoundMower, moneyStack: HMoneyStack, lastAnt: HLastAnt, acreSquare: HAcreSquare,
  antArena: HAntArena, valveShut: HValveShut, baitGrain: HBaitGrain, odometer: HOdometer, queenNet: HQueenNet, phoridFly: HPhoridFly, qCards: HQCards, recapReel: HRecapReel,
};
