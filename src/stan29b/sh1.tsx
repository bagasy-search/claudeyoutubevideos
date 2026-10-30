// stan29b · componentes únicos 1-14 (min 0-9). Hamburguesa: cada uno es el OBJETO de la idea dentro del escenario Stage.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const RAW = [196, 78, 70], BRN = [107, 58, 28], FAT = "#f3e3cf", STEEL = "#9aa3ad";
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 0:08 · EL ENCAJE: la hamburguesa se dora y alrededor le crece un borde calado como un encaje ----
export const HLace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.4, 3.6), N = 48;
  return <>
    <Head tt={tt} kick="THE $20 BAR BURGER" title="THE LACE EDGE" />
    <SV>
      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2, k = cl(g * 1.6 - (i % 12) * 0.05), r = 262 + (34 + 26 * rnd(i)) * k;
        return <circle key={i} cx={960 + Math.cos(a) * r} cy={570 + Math.sin(a) * r * 0.78} r={(14 + 14 * rnd(i + 9)) * k} fill="none" stroke={mix([150, 90, 40], [90, 46, 18], g)} strokeWidth={8 * k} opacity={k} />;
      })}
      <ellipse cx={960} cy={570} rx={268} ry={210} fill={mix(RAW, BRN, g)} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={960 + (rnd(i) - 0.5) * 420} cy={570 + (rnd(i + 40) - 0.5) * 300} r={5 + 6 * rnd(i + 3)} fill={`rgba(40,18,6,${0.5 * g})`} />)}
    </SV>
    <Tag tt={tt} at={3.2} x={960} y={900} txt="CRISPY LIKE LACE" col={AMB} size={56} />
  </>;
}}</Stage>;

// ---- 1:00 · LA REPISA: salsa secreta, parrilla especial y pan especial se caen de la repisa; queda la caja de los 10 trucos ----
export const HShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const items = ["SECRET SAUCE", "SPECIAL GRILL", "FANCY BUN"];
  const box = phys(tt, 3.6, 6, 0.45);
  return <>
    <div style={{ position: "absolute", left: 360, top: 640, width: 1200, height: 34, borderRadius: 6, background: "linear-gradient(180deg,#8a5a33,#5b3a1f)", boxShadow: sh(24) }} />
    {items.map((s, i) => {
      const f = eio(tt, 1.0 + i * 0.7, 2.2 + i * 0.7), x = 520 + i * 380;
      return <div key={s} style={{ position: "absolute", left: x, top: 400, width: 240, height: 240, transformOrigin: "100% 100%", transform: `translateY(${f * f * 700}px) translateX(${f * 120}px) rotate(${f * 95}deg)`, opacity: 1 - eio(tt, 1.8 + i * 0.7, 2.4 + i * 0.7) }}>
        <div style={{ width: 240, height: 240, borderRadius: i === 0 ? "70px 70px 20px 20px" : 22, background: ["#b8261b", "#2f3238", "#d9a35c"][i], display: "grid", placeItems: "center", textAlign: "center", fontWeight: 900, fontSize: 30, color: TX, padding: 20, boxShadow: sh(20) }}>{s}</div>
      </div>;
    })}
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - box) * -800}px) rotate(${(1 - box) * -12}deg)`, opacity: cl(box * 3) }}>
      <div style={{ width: 520, height: 230, background: "linear-gradient(180deg,#c49a63,#9b7140)", border: "6px solid #6d4c26", borderRadius: 14, display: "grid", placeItems: "center", boxShadow: sh(40) }}>
        <div style={{ fontFamily: MARK, fontSize: 64, color: "#2b1c0c" }}>10 OLD TRICKS</div>
      </div>
    </div>
  </>;
}}</Stage>;

// ---- 2:02 · LA GRASA ES EL JUGO: cubitos de grasa se derriten, gotean y llenan un vaso que dice JUICE ----
export const HMelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const m = eio(tt, 0.8, 4.2), lvl = eio(tt, 1.4, 5.0);
  return <>
    <Head tt={tt} kick="NUMBER ONE" title="THE FAT IS THE JUICE" />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 620 + i * 120, top: 300 + 80 * m, width: 90, height: 90 * (1 - 0.85 * m), borderRadius: 14 + 30 * m, background: FAT, boxShadow: sh(14), opacity: 1 - 0.4 * m }} />)}
    {Array.from({ length: 14 }, (_, i) => { const d = ((tt * 1.3 + i * 0.37) % 1.6) / 1.6; return m > 0.15 && <div key={i} style={{ position: "absolute", left: 665 + (i % 6) * 120, top: 420 + d * 300, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#f2c46b", opacity: (1 - d) * cl(m * 3) }} />; })}
    <div style={{ position: "absolute", left: 760, top: 720, width: 400, height: 300, border: "6px solid rgba(255,255,255,.55)", borderTop: "none", borderRadius: "0 0 40px 40px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 85}%`, background: "linear-gradient(180deg,#f6cf7a,#d99a3c)" }} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 64, color: "#3a2410", opacity: cl(lvl * 2 - 0.5) }}>JUICE</div>
    </div>
  </>;
}}</Stage>;

// ---- 2:20 · EL ANILLO 80/20: un anillo se llena en rojo hasta 80 y el resto se pinta de grasa ----
export const HPie: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.5, 2.8), b = eio(tt, 2.9, 3.8), R = 250, C = 2 * Math.PI * R;
  return <>
    <SV>
      <circle cx={960} cy={540} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={90} />
      <circle cx={960} cy={540} r={R} fill="none" stroke="#c4473a" strokeWidth={90} strokeDasharray={`${C * 0.8 * a} ${C}`} transform="rotate(-90 960 540)" />
      <circle cx={960} cy={540} r={R} fill="none" stroke={FAT} strokeWidth={90} strokeDasharray={`${C * 0.2 * b} ${C}`} transform={`rotate(${-90 + 288} 960 540)`} />
    </SV>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 150, fontVariantNumeric: "tabular-nums" }}>{Math.round(80 * a)}/{Math.round(20 * b)}</div>
      <div style={{ fontWeight: 800, fontSize: 30, color: DIM, letterSpacing: 4 }}>LEAN / FAT</div>
    </div>
    <Tag tt={tt} at={3.9} x={1500} y={300} txt="20% = JUICE" col={AMB} size={50} />
    <Tag tt={tt} at={4.4} x={420} y={820} txt="NEVER 90/10" col={RED} size={46} />
  </>;
}}</Stage>;

// ---- 2:55 · LA TOLVA MISTERIOSA: a la boca de la picadora caen recortes sin nombre, cada uno con un signo de pregunta ----
export const HHopper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Head tt={tt} kick="NUMBER TWO" title="«GROUND BEEF» = ?" col={RED} />
  <SV><path d="M680 560 L1240 560 L1080 860 L840 860 Z" fill="#7c858f" stroke="#4a5058" strokeWidth={8} /><rect x={880} y={860} width={160} height={140} fill="#5c636b" /></SV>
  {Array.from({ length: 9 }, (_, i) => {
    const s = 0.4 + i * 0.42, f = cl((tt - s) / 1.1), y = 120 + f * f * 520, x = 760 + rnd(i) * 360 + Math.sin(i) * 40 * (1 - f);
    return tt > s && f < 1 && <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 80, borderRadius: "40% 55% 45% 60%", background: mix(RAW, [230, 200, 180], rnd(i + 5) * 0.6), transform: `rotate(${f * 300 * (rnd(i + 2) - 0.5)}deg)`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 48, color: "#2b1010", boxShadow: sh(10) }}>?</div>;
  })}
  <Tag tt={tt} at={2.8} x={1500} y={760} txt="WHATEVER WAS LEFT" col={RED} size={44} />
</>}</Stage>;

// ---- 3:08 · LA PIZARRA DEL PADRE: la tiza escribe la mezcla, trazo a trazo, con polvo de tiza ----
export const HChalk: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lines = ["Chuck ......... 80%", "Brisket ...... 20%", "that's it."];
  return <>
    <div style={{ position: "absolute", left: 420, top: 200, width: 1080, height: 640, background: "radial-gradient(ellipse at 40% 40%, #2f3b33, #1b231e)", border: "26px solid #7a5232", borderRadius: 10, boxShadow: sh(50) }}>
      {lines.map((l, i) => { const w = eio(tt, 0.6 + i * 1.3, 1.8 + i * 1.3); return <div key={i} style={{ position: "absolute", left: 90, top: 90 + i * 150, fontFamily: HAND, fontWeight: 700, fontSize: 104, color: "rgba(240,240,232,.92)", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, whiteSpace: "nowrap" }}>{l}</div>; })}
      {Array.from({ length: 16 }, (_, i) => { const d = (tt * 0.6 + rnd(i)) % 1; return <div key={i} style={{ position: "absolute", left: 120 + rnd(i + 1) * 820, top: 140 + rnd(i + 2) * 380 + d * 120, width: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,.5)", opacity: 1 - d }} />; })}
    </div>
    <Tag tt={tt} at={4.4} x={960} y={930} txt="UP THERE FOR 30 YEARS" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 3:56 · EL MENÚ FINO SE MARCHITA: «Ground Sirloin» en letra dorada; la carta se dobla y cae el sello SAD BURGER ----
export const HWilt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = eio(tt, 1.6, 3.4), st = phys(tt, 3.4, 8, 0.4);
  return <>
    <div style={{ position: "absolute", left: 960, top: 500, transformOrigin: "50% 0", transform: `translate(-50%,-50%) perspective(1200px) rotateX(${w * 38}deg) skewX(${w * -6}deg)` }}>
      <div style={{ width: 640, height: 640, background: "#f6f0e2", border: "3px double #b89a5a", padding: 60, textAlign: "center", boxShadow: sh(40), filter: `saturate(${1 - 0.7 * w}) brightness(${1 - 0.3 * w})` }}>
        <div style={{ fontSize: 26, letterSpacing: 10, color: "#8a7340" }}>— CHEF'S SELECTION —</div>
        <div style={{ fontFamily: HAND, fontSize: 104, fontWeight: 700, color: "#9b7a2c", marginTop: 70 }}>Ground Sirloin</div>
        <div style={{ fontFamily: HAND, fontSize: 64, color: "#9b7a2c" }}>& Round</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: "#5b4a2a", marginTop: 60 }}>$24</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${2.4 - 1.4 * st}) rotate(-8deg)`, opacity: cl(st * 2), border: "8px solid #d23a2c", borderRadius: 16, padding: "10px 40px", fontFamily: MARK, fontSize: 92, color: "#d23a2c" }}>SAD BURGER</div>
  </>;
}}</Stage>;

// ---- 4:18 · EL TERMÓMETRO DE PARED, 1977: la columna sube a 98 °F y el aire tiembla de calor ----
export const HMercury: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const v = 60 + 38 * eio(tt, 0.5, 3.4), y = (f: number) => 880 - ((f - 40) / 70) * 640;
  return <>
    <div style={{ position: "absolute", left: 820, top: 160, width: 280, height: 820, borderRadius: 30, background: "linear-gradient(90deg,#d9cfb8,#f2ead6,#cfc4ab)", boxShadow: sh(40) }} />
    <SV>
      <rect x={945} y={220} width={30} height={680} rx={15} fill="#fff" stroke="#999" strokeWidth={3} />
      <rect x={951} y={y(v)} width={18} height={900 - y(v)} rx={9} fill="#d32b1f" />
      <circle cx={960} cy={910} r={42} fill="#d32b1f" />
      {[40, 60, 80, 100].map((f) => <g key={f}><line x1={985} x2={1015} y1={y(f)} y2={y(f)} stroke="#333" strokeWidth={4} /><text x={1025} y={y(f) + 12} fontSize={34} fontWeight={800} fill="#333">{f}</text></g>)}
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${300 + i * 260} 1000 ${Array.from({ length: 10 }, (_, k) => `Q${300 + i * 260 + 22 * Math.sin(tt * 3 + k + i)} ${960 - k * 80 - 40} ${300 + i * 260} ${960 - k * 80 - 80}`).join(" ")}`} fill="none" stroke="rgba(255,190,120,.16)" strokeWidth={6} />)}
    </SV>
    <div style={{ position: "absolute", left: 1220, top: 380, fontWeight: 900, fontSize: 170, color: v > 95 ? RED : TX, fontVariantNumeric: "tabular-nums" }}>{Math.round(v)}°</div>
    <Tag tt={tt} at={2.8} x={1380} y={600} txt="CHICAGO · SUMMER 1977" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 4:50 · MANTECA SOBRE PAN: el cuchillo cruza la rebanada y deja la grasa untada, así queda la carne tibia ----
export const HButter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.6, 3.4), x = 600 + 720 * k;
  return <>
    <Head tt={tt} kick="NUMBER THREE" title="WARM FAT SMEARS" col={RED} />
    <div style={{ position: "absolute", left: 540, top: 330, width: 840, height: 520, borderRadius: "120px 120px 40px 40px", background: "#d8a868", padding: 30, boxShadow: sh(40) }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "100px 100px 26px 26px", background: "#f1dcb2" }} />
    </div>
    <div style={{ position: "absolute", left: 600, top: 470, width: x - 600, height: 230, borderRadius: 60, background: "linear-gradient(180deg,rgba(255,232,170,.95),rgba(246,214,140,.9))", filter: "blur(1px)" }} />
    <div style={{ position: "absolute", left: x - 40, top: 420, width: 460, height: 70, transformOrigin: "0 50%", transform: `rotate(${-18 + 4 * Math.sin(tt * 4)}deg)` }}>
      <div style={{ width: 300, height: 56, background: "linear-gradient(180deg,#e6e9ee,#9aa3ad)", borderRadius: "0 40px 40px 0" }} />
      <div style={{ position: "absolute", left: 290, top: 4, width: 170, height: 48, background: "#3b2a1c", borderRadius: 12 }} />
    </div>
    <Tag tt={tt} at={3.6} x={960} y={930} txt="COLD FAT CUTS · WARM FAT SMEARS" col={ICE} size={44} />
  </>;
}}</Stage>;

// ---- 5:05 · LA ESCARCHA: sobre la placa de acero de la picadora crece hielo desde el borde hacia los agujeros ----
export const HFrost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 45%, #13202b, #050709 75%)">{(tt) => {
  const f = eio(tt, 0.5, 4.2);
  return <>
    <SV>
      <circle cx={960} cy={540} r={330} fill="url(#st)" stroke="#5d6670" strokeWidth={10} />
      <defs><radialGradient id="st"><stop offset="0" stopColor="#c9d0d8" /><stop offset="1" stopColor="#7d8791" /></radialGradient></defs>
      {Array.from({ length: 19 }, (_, i) => { const a = i * 2.4, r = i === 0 ? 0 : 60 + (i % 3) * 80; return <circle key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={30} fill="#1b1f24" />; })}
      {Array.from({ length: 64 }, (_, i) => { const a = (i / 64) * Math.PI * 2, L = (60 + 160 * rnd(i)) * f; const x0 = 960 + Math.cos(a) * 330, y0 = 540 + Math.sin(a) * 330; return <g key={i} stroke="rgba(220,240,255,.85)" strokeWidth={3}><line x1={x0} y1={y0} x2={x0 - Math.cos(a) * L} y2={y0 - Math.sin(a) * L} /><line x1={x0 - Math.cos(a) * L * 0.5} y1={y0 - Math.sin(a) * L * 0.5} x2={x0 - Math.cos(a + 0.5) * L * 0.75} y2={y0 - Math.sin(a + 0.5) * L * 0.75} /></g>; })}
      <circle cx={960} cy={540} r={330} fill={`rgba(210,235,255,${0.25 * f})`} />
    </SV>
    <Tag tt={tt} at={1.2} x={1560} y={360} txt="MEAT · BLADE · PLATE" col={ICE} size={40} />
    <Tag tt={tt} at={2.6} x={1560} y={440} txt="20 MIN IN THE FREEZER" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 5:55 · LAS DOS PLACAS: fina y gruesa giran; de abajo salen los hilos de carne finos o gruesos ----
export const HHoles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ex = eio(tt, 1.2, 4.5);
  const plate = (cx: number, n: number, r: number, col: string, lab: string, ok: boolean) => <g>
    <g transform={`rotate(${tt * 30} ${cx} 380)`}><circle cx={cx} cy={380} r={190} fill="#8d969f" stroke="#555c63" strokeWidth={8} />
      {Array.from({ length: n }, (_, i) => { const a = i * 2.39996, rr = Math.sqrt(i / n) * 160; return <circle key={i} cx={cx + Math.cos(a) * rr} cy={380 + Math.sin(a) * rr} r={r} fill="#1a1d21" />; })}</g>
    {Array.from({ length: ok ? 6 : 12 }, (_, i) => <rect key={i} x={cx - 150 + i * (ok ? 54 : 26)} y={580} width={ok ? 40 : 14} height={280 * ex * (0.8 + 0.2 * rnd(i))} rx={ok ? 18 : 6} fill={col} />)}
    <text x={cx} y={960} textAnchor="middle" fontSize={44} fontWeight={900} fill={ok ? GRN : RED}>{lab}</text>
  </g>;
  return <SV>{plate(620, 90, 9, "#c4574b", "⅛ IN · PASTE", false)}{plate(1300, 22, 26, "#b6493d", "⅜ IN · JUICE POCKETS", true)}</SV>;
}}</Stage>;

// ---- 6:32 · EL BOTÓN DE PULSOS: se aprieta doce veces; abajo la carne pasa de trozos a grava ----
export const HPulse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.min(12, Math.floor(cl((tt - 0.6) / 4.0) * 12.99)), ph = ((tt - 0.6) * 12 / 4.0) % 1, down = tt > 0.6 && n < 12 && ph < 0.35;
  return <>
    <Head tt={tt} kick="FOOD PROCESSOR" title="SHORT PULSES" />
    <div style={{ position: "absolute", left: 520, top: 380, width: 300, height: 300, borderRadius: "50%", background: "#3a3d42", boxShadow: sh(30), display: "grid", placeItems: "center" }}>
      <div style={{ width: 210, height: 210, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ff7a6a, #c42619)", transform: `translateY(${down ? 14 : 0}px) scale(${down ? 0.94 : 1})`, boxShadow: down ? "0 4px 10px rgba(0,0,0,.5)" : "0 18px 30px rgba(0,0,0,.6)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 40 }}>PULSE</div>
    </div>
    <div style={{ position: "absolute", left: 560, top: 740, fontWeight: 900, fontSize: 120, fontVariantNumeric: "tabular-nums" }}>{n}<span style={{ fontSize: 50, color: DIM }}> × 1 SEC</span></div>
    <SV>{Array.from({ length: 60 }, (_, i) => { const s = 46 - 30 * (n / 12); return <rect key={i} x={1060 + (i % 10) * 64 + rnd(i) * 10} y={360 + Math.floor(i / 10) * 64 + rnd(i + 1) * 10} width={s} height={s * 0.8} rx={s / 3} fill={mix(RAW, [150, 60, 55], rnd(i + 2))} />; })}</SV>
    <Tag tt={tt} at={4.6} x={1380} y={830} txt="COARSE GRAVEL, NOT PASTE" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 7:15 · LA TARJETA DE EDDIE: entra al reloj de fichar, ¡clunk!, sale con la hora y el sello TOUGH ----
export const HTimecard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ins = eio(tt, 0.4, 1.6), out = eio(tt, 2.2, 3.2), st = phys(tt, 3.5, 8, 0.4), y = 300 + 260 * ins - 300 * out;
  return <>
    <div style={{ position: "absolute", left: 1060, top: 300, width: 520, height: 520, borderRadius: 30, background: "linear-gradient(180deg,#5e4a35,#3a2d20)", boxShadow: sh(40) }}>
      <div style={{ margin: "60px auto", width: 300, height: 300, borderRadius: "50%", background: "#f4ecd8", border: "10px solid #2b2016", position: "relative" }}>
        <div style={{ position: "absolute", left: 140, top: 50, width: 10, height: 100, background: "#222", transformOrigin: "50% 100%", transform: `rotate(${tt * 40}deg)` }} />
        <div style={{ position: "absolute", left: 141, top: 80, width: 8, height: 70, background: "#a52a1f", transformOrigin: "50% 100%", transform: `rotate(${120 + tt * 6}deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 40, width: 280, height: 20, background: "#111", borderRadius: 6 }} />
    </div>
    <div style={{ position: "absolute", left: 470, top: y, width: 420, height: 560, background: "#efe6cf", borderRadius: 8, boxShadow: sh(30), padding: 30, fontFamily: "Courier New, monospace", color: "#2b2620", transform: `rotate(${-4 + 4 * ins}deg)` }}>
      <div style={{ fontWeight: 900, fontSize: 30 }}>STAN'S MEATS</div>
      <div style={{ fontSize: 34, marginTop: 30 }}>NAME: <b>EDDIE</b></div>
      <div style={{ fontSize: 34 }}>AGE: <b>16</b></div>
      <div style={{ fontSize: 34 }}>JOB: <b>PATTIES</b></div>
      <div style={{ fontSize: 40, marginTop: 40, color: "#7a1f15", opacity: cl(out * 3) }}>IN 06:58</div>
      <div style={{ position: "absolute", left: 60, top: 380, transform: `scale(${2 - st}) rotate(-12deg)`, opacity: cl(st * 2), border: "6px solid #c4241b", padding: "4px 24px", fontFamily: MARK, fontSize: 58, color: "#c4241b" }}>TOO TOUGH</div>
    </div>
  </>;
}}</Stage>;

// ---- 8:20 · EL HOYUELO: dos hamburguesas de perfil al fuego; la lisa se infla en albóndiga, la del hoyuelo queda chata ----
export const HDimple: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const c = eio(tt, 1.0, 4.4), press = eio(tt, 0.3, 1.0);
  const prof = (cx: number, dimple: boolean) => {
    const top = dimple ? 470 : 470 - 120 * c, mid = dimple ? 470 + 40 * press * (1 - c) : top;
    return <g>
      <path d={`M${cx - 260} 600 Q${cx - 250} ${top} ${cx - 120} ${top} Q${cx} ${mid} ${cx + 120} ${top} Q${cx + 250} ${top} ${cx + 260} 600 Z`} fill={mix(RAW, BRN, c)} />
      <rect x={cx - 300} y={600} width={600} height={30} rx={8} fill="#2b2b2e" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${cx - 240 + i * 80} 660 q10 -20 0 -40`} stroke="rgba(255,140,60,.6)" strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(tt * 6 + i)} />)}
      <text x={cx} y={780} textAnchor="middle" fontSize={46} fontWeight={900} fill={dimple ? GRN : RED}>{dimple ? "THUMB DIMPLE · FLAT" : "NO DIMPLE · MEATBALL"}</text>
    </g>;
  };
  return <><SV>{prof(560, false)}{prof(1360, true)}</SV>
    <div style={{ position: "absolute", left: 1330, top: 330 + 60 * press, width: 60, height: 90, borderRadius: 30, background: "#e2b9a0", opacity: 1 - eio(tt, 1.0, 1.6) }} />
  </>;
}}</Stage>;
