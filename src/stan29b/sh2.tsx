// stan29b · componentes únicos 15-27 (min 9-20).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const RAW = [196, 78, 70], BRN = [107, 58, 28], STEEL = "#9aa3ad";
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 9:15 · DE HAMBURGUESA A SALCHICHA: la sal cae adentro y la bola floja se estira en un embutido brillante ----
export const HMorph: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const m = eio(tt, 1.4, 4.0), w = 380 + 520 * m, hh = 340 - 170 * m;
  return <>
    <Head tt={tt} kick="NUMBER SIX" title="SALT INSIDE → SAUSAGE" col={RED} />
    {Array.from({ length: 26 }, (_, i) => { const d = cl((tt - 0.3 - rnd(i) * 1.2) / 0.8); return d > 0 && d < 1 && <div key={i} style={{ position: "absolute", left: 800 + rnd(i + 3) * 320, top: 200 + d * 300, width: 12, height: 12, background: "#fff", transform: `rotate(${i * 30}deg)`, opacity: 0.9 }} />; })}
    <div style={{ position: "absolute", left: 960 - w / 2, top: 560 - hh / 2, width: w, height: hh, borderRadius: m < 0.5 ? "46% 54% 50% 50%" : hh / 2, background: m < 0.6 ? mix(RAW, [214, 110, 98], m) : `linear-gradient(180deg, #e98a7a, #b94c3f 70%, #8d3328)`, boxShadow: `${sh(30)}, inset 0 ${20 * m}px ${30 * m}px rgba(255,255,255,${0.25 * m})` }}>
      {m < 0.5 && Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * (w - 30), top: rnd(i + 7) * (hh - 30), width: 26, height: 18, borderRadius: 9, background: "rgba(90,20,15,.35)", opacity: 1 - 2 * m }} />)}
    </div>
    <Tag tt={tt} at={4.2} x={960} y={850} txt="SPRINGY · BOUNCY · HOT DOG" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 9:50 · LA PIZCA DESDE ALTO: dos manos, una cerca (montoncito) y otra alta (lluvia pareja) ----
export const HPinch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 0.6, 3.6);
  const side = (cx: number, hi: boolean) => <g>
    <ellipse cx={cx} cy={760} rx={250} ry={70} fill="#7a3f22" />
    <ellipse cx={cx} cy={740} rx={250} ry={70} fill="#9a5332" />
    <circle cx={cx} cy={hi ? 200 : 560} r={36} fill="#e2b9a0" />
    {Array.from({ length: 40 }, (_, i) => { const d = cl(f * 1.6 - rnd(i) * 0.6), y0 = hi ? 230 : 590, spread = hi ? 230 : 34; const x = cx + (rnd(i + 11) - 0.5) * 2 * spread * d, y = y0 + (740 - y0) * d; return d > 0 && <rect key={i} x={x} y={y - (d >= 1 ? 4 * rnd(i) : 0)} width={9} height={9} fill="#fff" transform={`rotate(45 ${x} ${y})`} />; })}
    <text x={cx} y={900} textAnchor="middle" fontSize={44} fontWeight={900} fill={hi ? GRN : RED}>{hi ? "FROM HIGH UP · EVEN" : "LOW · ONE SALTY SPOT"}</text>
  </g>;
  return <SV>{side(560, false)}{side(1360, true)}</SV>;
}}</Stage>;

// ---- 10:20 · EL APLASTE DE PERFIL: la espátula baja sobre el papel y la bola se abre a un disco de ¼" más ancho que el pan ----
export const HSmash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = phys(tt, 1.2, 9, 0.55), rr = 170 - 140 * cl(p), w = 340 + 520 * cl(p), top = 760 - rr * 2;
  return <>
    <Head tt={tt} kick="NUMBER SEVEN" title="THE SMASH" />
    <SV>
      <rect x={360} y={760} width={1200} height={50} rx={12} fill="#1f1f22" />
      <rect x={360} y={810} width={1200} height={14} fill="#111" />
      <path d={`M${960 - w / 2} 760 Q${960 - w / 2 + 20} ${top} ${960} ${top} Q${960 + w / 2 - 20} ${top} ${960 + w / 2} 760 Z`} fill={mix(RAW, [150, 70, 45], cl(p))} />
      <rect x={960 - 300} y={top - 12} width={600} height={10} fill="rgba(240,235,225,.9)" />
      <rect x={960 - 260} y={top - 70} width={520} height={56} rx={6} fill={STEEL} />
      <rect x={960 + 230} y={top - 140} width={60} height={90} rx={10} fill="#3b2a1c" />
      <rect x={960 - 380} y={top - 4} width={760} height={4} fill="rgba(255,255,255,.0)" />
    </SV>
    <div style={{ position: "absolute", left: 960 - 380, top: 860, width: 760, borderTop: "4px dashed rgba(255,255,255,.4)", textAlign: "center", paddingTop: 10, fontWeight: 900, fontSize: 36, color: DIM, opacity: cl(p) }}>WIDER THAN THE BUN · ¼ IN</div>
    <Tag tt={tt} at={3.4} x={1560} y={420} txt="ONCE · FIRST 30 SEC" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 11:05 · LA ONDA DEL CHISPORROTEO: cada pico del sonido escupe una gota y el tanque de jugo baja ----
export const HSizzle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lvl = 1 - 0.55 * eio(tt, 0.8, 4.6);
  return <>
    <Head tt={tt} kick="DON'T PRESS IT" title="THAT SIZZLE = YOUR JUICE" col={RED} />
    <SV>{Array.from({ length: 64 }, (_, i) => { const a = Math.abs(Math.sin(i * 0.7 + tt * 9) * Math.sin(i * 0.23 + tt * 3)) * 220 * cl(tt - 0.4); return <rect key={i} x={260 + i * 15} y={560 - a} width={9} height={2 * a + 4} rx={4} fill={a > 150 ? "#ffb257" : "rgba(255,255,255,.55)"} />; })}
      {Array.from({ length: 10 }, (_, i) => { const d = ((tt * 0.9 + i * 0.1) % 1); return <circle key={i} cx={300 + i * 92 + d * 40} cy={330 - d * 160 + d * d * 300} r={10} fill="#e6a54a" opacity={(1 - d) * cl(tt - 0.6)} />; })}
    </SV>
    <div style={{ position: "absolute", left: 1420, top: 280, width: 200, height: 560, border: "6px solid rgba(255,255,255,.6)", borderRadius: 30, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,#f0b75e,#b86a2a)" }} />
    </div>
    <div style={{ position: "absolute", left: 1520, top: 880, transform: "translateX(-50%)", fontWeight: 900, fontSize: 60, color: lvl < 0.6 ? RED : TX, fontVariantNumeric: "tabular-nums" }}>{Math.round(lvl * 100)}%</div>
  </>;
}}</Stage>;

// ---- 12:05 · LA CAMPANA: baja la tapa de metal, se llena de vapor y el queso se derrama por los bordes ----
export const HDome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = phys(tt, 0.4, 6, 0.6), stm = eio(tt, 1.2, 3.0), drp = eio(tt, 1.6, 4.2), lift = eio(tt, 4.6, 5.6), y = -500 * (1 - cl(d)) - 420 * lift;
  return <>
    <SV>
      <rect x={560} y={720} width={800} height={40} rx={10} fill="#202022" />
      <ellipse cx={960} cy={690} rx={300} ry={50} fill="#6b3a1c" />
      <path d={`M${740 - 30 * drp} ${650 + 70 * drp} L780 640 L1140 640 L${1180 + 30 * drp} ${650 + 70 * drp} L1120 ${680 + 40 * drp} L960 700 L800 ${680 + 40 * drp} Z`} fill="#f2b632" />
      <g transform={`translate(0 ${y})`}>
        <path d="M600 700 Q600 360 960 340 Q1320 360 1320 700 Z" fill="rgba(200,210,220,.35)" stroke="#c9d0d8" strokeWidth={10} />
        <circle cx={960} cy={326} r={30} fill="#c9d0d8" />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={700 + i * 80} cy={600 - ((tt * 60 + i * 40) % 220)} r={40 + 10 * Math.sin(i)} fill={`rgba(255,255,255,${0.12 * stm})`} />)}
      </g>
    </SV>
    <div style={{ position: "absolute", left: 1480, top: 360, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 130, fontVariantNumeric: "tabular-nums", color: AMB }}>{Math.min(30, Math.round(30 * eio(tt, 0.8, 4.6)))}</div>
      <div style={{ fontWeight: 800, fontSize: 30, color: DIM, letterSpacing: 4 }}>SECONDS · LID ON</div>
    </div>
  </>;
}}</Stage>;

// ---- 12:55 · AFUERA VA ADENTRO: el cubo de bife tiene los puntitos sólo en la cara; molido, quedan repartidos por todo ----
export const HMix: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const g = eio(tt, 1.8, 4.0);
  return <>
    <Head tt={tt} kick="NUMBER NINE" title="THE OUTSIDE GOES INSIDE" />
    <div style={{ position: "absolute", left: 360, top: 360, width: 380, height: 380, background: "#b84a3e", border: "14px solid #7f2e25", borderRadius: 24, boxShadow: sh(30), transform: `rotate(${-6 + 3 * Math.sin(tt)}deg)` }}>
      <div style={{ position: "absolute", left: 30, top: 30, right: 30, bottom: 30, background: "#cf6a5c", borderRadius: 12 }} />
    </div>
    <SV>
      {Array.from({ length: 40 }, (_, i) => { const edge = i % 4; const u = rnd(i) * 380; const sx = 360 + (edge === 0 ? u : edge === 1 ? 380 : edge === 2 ? u : 0), sy = 360 + (edge === 0 ? 0 : edge === 1 ? u : edge === 2 ? 380 : u);
        const ex = 1180 + rnd(i + 20) * 420, ey = 360 + rnd(i + 40) * 380; return <circle key={i} cx={sx + (ex - sx) * g} cy={sy + (ey - sy) * g - Math.sin(g * Math.PI) * 120} r={9} fill="#7cf06a" opacity={0.9} />; })}
      <path d="M800 550 L1080 550" stroke="rgba(255,255,255,.6)" strokeWidth={10} strokeDasharray="20 16" /><path d="M1080 520 L1130 550 L1080 580 Z" fill="rgba(255,255,255,.6)" />
    </SV>
    <div style={{ position: "absolute", left: 1150, top: 340, width: 480, height: 420, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(circle at 40% 35%, #d77a6c, #a3443a)", opacity: cl(g * 2 - 0.2), boxShadow: sh(30) }} />
    <Tag tt={tt} at={4.2} x={1390} y={880} txt="SO: 160 °F IN THE CENTER" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 13:45 · LA MUESTRA DE COLORES: el puntero salta entre rosas y grises sin decidir; cae la chapa 160 °F ----
export const HSwatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cols = ["#e8a0a0", "#d98a86", "#c9787a", "#b8807a", "#a48e86", "#968a84", "#8c7d74"], j = Math.floor(tt * 3) % cols.length, st = phys(tt, 3.4, 8, 0.4);
  return <>
    <Head tt={tt} kick="DON'T CUT IT OPEN" title="COLOR IS NOT A NUMBER" />
    {cols.map((c, i) => <div key={i} style={{ position: "absolute", left: 420 + i * 160, top: 360, width: 140, height: 300, background: c, borderRadius: 10, boxShadow: sh(14), transform: `translateY(${i === j && tt < 3.4 ? -24 : 0}px)` }} />)}
    {tt < 3.4 && <div style={{ position: "absolute", left: 470 + j * 160, top: 690, fontWeight: 900, fontSize: 90, color: AMB }}>?</div>}
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${2.6 - 1.6 * st}) rotate(-5deg)`, opacity: cl(st * 2), background: "#123826", border: "8px solid #6fe39a", borderRadius: 26, padding: "16px 50px", fontWeight: 900, fontSize: 130, color: GRN, boxShadow: sh(40) }}>160 °F</div>
  </>;
}}</Stage>;

// ---- 14:50 · EL CLAVO DE PEDIDOS: los lunes los papelitos de los bares caen y se ensartan uno arriba del otro ----
export const HSpike: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const slips = ["Joe's Tap — 20 lb", "Polonia Inn — 15 lb", "Red Rooster — 25 lb", "Chuck + brisket", "coarse · once · cold"];
  return <>
    <SV><rect x={900} y={300} width={12} height={560} fill="#c9d0d8" /><path d="M900 300 L906 250 L912 300 Z" fill="#c9d0d8" /><ellipse cx={906} cy={870} rx={160} ry={34} fill="#3a2d20" /></SV>
    {slips.map((s, i) => { const f = phys(tt, 0.4 + i * 0.7, 7, 0.5), y = 760 - i * 70; return <div key={i} style={{ position: "absolute", left: 906, top: y, transform: `translate(-50%,-50%) translateY(${(1 - cl(f)) * -700}px) rotate(${(rnd(i) - 0.5) * 18}deg)`, opacity: cl(f * 3), width: 440, padding: "16px 24px", background: i > 2 ? "#fff7d6" : "#f2efe6", borderRadius: 4, boxShadow: sh(10), fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#2b2620", textAlign: "center" }}>{s}</div>; })}
    <Tag tt={tt} at={0.6} x={420} y={260} txt="EVERY MONDAY" col={AMB} size={50} anchor="l" />
  </>;
}}</Stage>;

// ---- 15:40 · LOS CUATRO DÍAS: la misma carne en bandejas de lunes a jueves, se va apagando de rojo a gris ----
export const HFade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.6, 4.2), days = ["MON", "TUE", "WED", "THU"];
  return <>
    <Head tt={tt} kick="WHY FRESH THAT DAY" title="AIR TAKES THE TASTE" />
    {days.map((d, i) => { const on = cl(k * 4 - i); return <div key={d} style={{ position: "absolute", left: 300 + i * 340, top: 380, opacity: 0.3 + 0.7 * on, transform: `translateY(${(1 - on) * 30}px)` }}>
      <div style={{ width: 300, height: 220, borderRadius: 18, background: "#e9e4dc", padding: 24, boxShadow: sh(20) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "40% 50% 45% 50%", background: mix([206, 72, 66], [128, 98, 88], i / 3) }} />
      </div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40, marginTop: 18, color: i === 0 ? GRN : DIM }}>{d}</div>
    </div>; })}
    <div style={{ position: "absolute", left: 300, top: 760, width: 1320 * k, height: 12, borderRadius: 6, background: `linear-gradient(90deg, ${GRN}, ${RED})` }} />
    <Tag tt={tt} at={4.4} x={960} y={880} txt="THE BARS COOKED IT THE SAME DAY" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 16:25 · EL ROAST EN CUBOS: el bloque de paleta se parte en una grilla de cubos de una pulgada que se separan ----
export const HCubes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = phys(tt, 1.4, 6, 0.5), cut = eio(tt, 0.4, 1.3);
  return <>
    <Head tt={tt} kick="NO BUTCHER?" title="CHUCK ROAST · 1-INCH CUBES" />
    {Array.from({ length: 24 }, (_, i) => { const cx = i % 6, cy = Math.floor(i / 6), dx = (cx - 2.5) * 40 * cl(p), dy = (cy - 1.5) * 40 * cl(p); return <div key={i} style={{ position: "absolute", left: 600 + cx * 120 + dx, top: 320 + cy * 110 + dy, width: 120 - 6 * cut, height: 110 - 6 * cut, background: "#c4574b", borderRadius: 6 + 8 * cl(p), boxShadow: `inset 0 0 0 ${4 + 6 * rnd(i)}px #efd9c4`, transform: `rotate(${(rnd(i) - 0.5) * 16 * cl(p)}deg)` }} />; })}
    <Tag tt={tt} at={3.2} x={960} y={880} txt="THEN SHORT PULSES · COLD" col={ICE} size={44} />
  </>;
}}</Stage>;

// ---- 18:25 · BOLSA FINA: la carne en bulto y la carne aplastada en bolsa; el hielo llena la plana mucho antes ----
export const HFlatBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse 70% 60% at 50% 45%, #13202b, #050709 75%)">{(tt) => {
  const a = eio(tt, 0.6, 4.4), b = eio(tt, 0.6, 2.2);
  const bar = (x: number, v: number, lab: string) => <div style={{ position: "absolute", left: x, top: 800 }}><div style={{ width: 460, height: 30, borderRadius: 15, background: "rgba(255,255,255,.12)", overflow: "hidden" }}><div style={{ width: `${v * 100}%`, height: "100%", background: ICE }} /></div><div style={{ fontWeight: 900, fontSize: 34, marginTop: 14, color: v >= 1 ? GRN : DIM }}>{lab} · {Math.round(v * 100)}%</div></div>;
  return <>
    <Head tt={tt} kick="MY FATHER" title="FLAT, IN A THIN BAG" col={ICE} />
    <div style={{ position: "absolute", left: 380, top: 380, width: 360, height: 330, borderRadius: "45% 50% 40% 55%", background: mix(RAW, [180, 190, 210], a * 0.5), boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 1080, top: 520, width: 520, height: 130, borderRadius: 16, background: mix(RAW, [190, 205, 225], b * 0.7), border: "4px solid rgba(255,255,255,.5)", boxShadow: sh(20) }} />
    {bar(330, a * 0.45, "LUMP")}{bar(1110, b, "FLAT")}
  </>;
}}</Stage>;

// ---- 19:12 · LA CEBOLLA ADENTRO: gotas de agua salen del aro, se vuelven vapor y la hamburguesa se raja ----
export const HOnion: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = eio(tt, 0.6, 2.6), cr = eio(tt, 2.6, 4.2);
  return <>
    <SV>
      <g transform={`translate(${-60 * cr} 0)`}><path d="M960 300 A250 250 0 0 0 960 800 Z" fill="#a85a3a" /></g>
      <g transform={`translate(${60 * cr} 0)`}><path d="M960 300 A250 250 0 0 1 960 800 Z" fill="#a85a3a" /></g>
      {[160, 120, 80].map((r, i) => <circle key={i} cx={960} cy={550} r={r} fill="none" stroke="#efe6c8" strokeWidth={16} opacity={1 - cr} />)}
      {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2, d = ((tt * 0.8 + rnd(i)) % 1) * w; return <circle key={i} cx={960 + Math.cos(a) * (160 + d * 260)} cy={550 + Math.sin(a) * (160 + d * 260) - d * 80} r={12 + 22 * d} fill={d > 0.5 ? "rgba(255,255,255,.18)" : "#8fd6ff"} opacity={(1 - d) * w} />; })}
    </SV>
    <Tag tt={tt} at={1.0} x={1560} y={380} txt="ONIONS = WATER" col={ICE} size={46} />
    <Tag tt={tt} at={3.0} x={1560} y={460} txt="STEAM SPLITS THE PATTY" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 19:50 · LAS REJAS: el aplaste sobre la parrilla y los pedazos se caen entre las barras; entra la sartén de hierro ----
export const HGrates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const fall = cl((tt - 0.8) / 2.2), pan = phys(tt, 3.2, 6, 0.55);
  return <>
    <SV>
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={420 + i * 110} y={360} width={40} height={420} rx={20} fill="#2a2a2d" stroke="#555" strokeWidth={3} />)}
      {Array.from({ length: 14 }, (_, i) => { const gx = 460 + (i % 10) * 110 + 35, y = 520 + fall * fall * 600 * (0.6 + 0.4 * rnd(i)); return tt > 0.8 && <ellipse key={i} cx={gx} cy={y} rx={26} ry={18} fill="#a85040" opacity={1 - fall * 0.6} />; })}
    </SV>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) translateX(${(1 - cl(pan)) * 1300}px)`, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #3b3b3f, #151517 70%)", border: "18px solid #0d0d0e", boxShadow: sh(40), opacity: cl(pan * 3) }}>
      <div style={{ position: "absolute", right: -300, top: 230, width: 320, height: 70, borderRadius: 30, background: "#0d0d0e" }} />
    </div>
    <Tag tt={tt} at={3.8} x={960} y={930} txt="CAST IRON RIGHT ON THE GRILL" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 17:30 · EL PAN EN LA SARTÉN SECA: las dos tapas boca abajo y el dorado sube desde el corte ----
export const HBun: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const g = eio(tt, 0.6, 4.0), flip = eio(tt, 4.0, 4.8);
  const half = (x: number) => <div style={{ position: "absolute", left: x, top: 380, width: 440, height: 300, transform: `perspective(1200px) rotateX(${180 * flip}deg)`, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "220px 220px 30px 30px", background: "linear-gradient(180deg,#d28a3e,#b46a28)", backfaceVisibility: "hidden" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "30px 30px 220px 220px", background: `linear-gradient(180deg, ${mix([240, 222, 190], [196, 132, 60], g)}, #f2e2c4)`, transform: "rotateX(180deg)", backfaceVisibility: "hidden" }} />
  </div>;
  return <>
    <Head tt={tt} kick="SATURDAY · 6 PM" title="TOAST THE BUN · DRY PAN" />
    <div style={{ position: "absolute", left: 360, top: 700, width: 1200, height: 40, borderRadius: 12, background: "#1d1d20", boxShadow: sh(20) }} />
    {half(470)}{half(1010)}
    <Tag tt={tt} at={4.6} x={960} y={880} txt="A TOASTED BUN DOESN'T GET SOGGY" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 20:15 · LA BOLSA DE PAPEL: la clienta vuelve; la bolsa marrón cae al mostrador, se dobla y queda el sello 2 LB CHUCK ----
export const HPaperBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const d = phys(tt, 0.4, 6, 0.5), fold = eio(tt, 1.8, 2.8), st = phys(tt, 3.0, 8, 0.4);
  return <>
    <div style={{ position: "absolute", left: 300, top: 800, width: 1320, height: 40, background: "linear-gradient(180deg,#6b4a2c,#3d2a18)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 960, top: 800, transform: `translate(-50%,-100%) translateY(${(1 - cl(d)) * -700}px)` }}>
      <div style={{ width: 420, height: 160 * (1 - 0.6 * fold), background: "#a87a4a", transformOrigin: "50% 100%", borderRadius: "6px 6px 0 0", marginLeft: 0, boxShadow: "inset 0 -10px 20px rgba(0,0,0,.25)" }} />
      <div style={{ width: 420, height: 420, background: "linear-gradient(90deg,#b98b58,#c99c68 40%,#a77a48)", boxShadow: sh(30), display: "grid", placeItems: "center" }}>
        <div style={{ transform: `scale(${2 - st}) rotate(-8deg)`, opacity: cl(st * 2), border: "6px solid #8a1d14", padding: "6px 20px", fontFamily: MARK, fontSize: 60, color: "#8a1d14", textAlign: "center" }}>2 LB<br />CHUCK</div>
      </div>
    </div>
    <Tag tt={tt} at={3.6} x={1500} y={340} txt="«LET HIM EAT ONE OF MINE»" col={AMB} size={40} />
  </>;
}}</Stage>;
