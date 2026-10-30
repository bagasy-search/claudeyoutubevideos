// stan29e · componentes únicos 1-17 (min 0-10). Mundo: kotlet schabowy / milanesa de cerdo.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const RAW = [236, 196, 180], CRUST = [214, 150, 60];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 0:18 · LA QUE NO ENTRA EN EL PLATO: la milanesa crece y se desborda por los dos lados ----
export const HOverhang: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.4, 2.4);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 640, height: 420, borderRadius: "50%", background: "radial-gradient(circle,#fbfaf6 0 60%,#e2ddd2 62%,#f4f1ea 70%)", boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 960, top: 545, transform: `translate(-50%,-50%) rotate(-6deg)`, width: 380 + 700 * g, height: 260 + 90 * g, borderRadius: "46% 54% 50% 50% / 55% 45% 55% 45%", background: `radial-gradient(ellipse at 40% 35%, #f2c46b, rgb(${CRUST.join(",")}) 70%)`, boxShadow: "0 18px 30px rgba(0,0,0,.45)" }} />
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 + d * 480 - 40, top: 440, fontSize: 80, color: AMB, opacity: cl((tt - 2.0) * 3), transform: `translateX(${d * 20 * Math.sin(tt * 5)}px)` }}>{d < 0 ? "◀" : "▶"}</div>)}
    <Tag tt={tt} at={2.4} x={960} y={880} txt="$30 · HANGS OFF BOTH SIDES" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 0:39 · DURO COMO UN CINTO: la milanesa casera se dobla como cuero y le aparece una hebilla ----
export const HBelt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const b = eio(tt, 0.5, 2.2), buck = cl(phys(tt, 2.2, 9, 0.4));
  return <>
    <SV><path d={`M360 ${560} C ${700} ${560 - 260 * b}, ${1220} ${560 + 260 * b}, 1560 560`} stroke="#6b4022" strokeWidth={120} fill="none" strokeLinecap="round" />
      <path d={`M360 ${560} C ${700} ${560 - 260 * b}, ${1220} ${560 + 260 * b}, 1560 560`} stroke="#8a5530" strokeWidth={90} fill="none" strokeDasharray="14 18" opacity={0.5} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={1280 + i * 60} cy={560 + 30 * b - i * 6} r={12} fill="#2a1a10" opacity={b} />)}</SV>
    <div style={{ position: "absolute", left: 300, top: 470, width: 140, height: 180, borderRadius: 18, border: "20px solid #d7b45a", transform: `scale(${buck})`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    <Tag tt={tt} at={0.4} x={960} y={220} txt="SOGGY BREADING · TOUGH MEAT" col={RED} size={48} />
    <Tag tt={tt} at={2.6} x={960} y={860} txt="TOUGH AS A BELT" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 1:05 · EL MAPA DE CHICAGO: tres alfileres caen en tres barrios, cada uno con su nombre para la misma milanesa ----
export const HPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#e9e3d4,#d8d0bc)">{(tt) => {
  const pins: [number, number, string, string, string][] = [[700, 380, "KOTLET SCHABOWY", "ARCHER AVE", "#d23b3b"], [1180, 300, "SCHNITZEL", "LINCOLN SQ", "#e7b53a"], [960, 640, "MILANESE", "TAYLOR ST", "#3aa86b"]];
  return <>
    <SV>{Array.from({ length: 12 }, (_, i) => <line key={"v" + i} x1={200 + i * 140} y1={60} x2={200 + i * 140 + 40} y2={1020} stroke="#c3b9a2" strokeWidth={i % 4 ? 4 : 12} />)}
      {Array.from({ length: 8 }, (_, i) => <line key={"hz" + i} x1={140} y1={120 + i * 120} x2={1780} y2={100 + i * 124} stroke="#c3b9a2" strokeWidth={i % 3 ? 4 : 12} />)}
      <path d="M1600 60 Q1520 400 1680 1020 L1920 1020 L1920 60 Z" fill="#8cb7d6" /></SV>
    {pins.map(([x, y, n, st, c], i) => { const d = phys(tt, 0.4 + i * 0.6, 9, 0.4); return <div key={i} style={{ position: "absolute", left: x, top: y - (1 - cl(d)) * 400, opacity: cl(d * 4) }}>
      <div style={{ width: 60, height: 60, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: c, boxShadow: "0 8px 14px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 80, top: -10, whiteSpace: "nowrap", background: "#1a1410", color: TX, padding: "8px 16px", borderRadius: 10, fontWeight: 900, fontSize: 34 }}>{n}<div style={{ fontSize: 22, color: DIM }}>{st}</div></div>
    </div>; })}
    <Tag tt={tt} at={2.6} x={960} y={960} txt="SAME CUTLET · SAME COUNTER" col="#1a1410" size={44} />
  </>;
}}</Stage>;

// ---- 2:13 · LOS OJOS VENDADOS: un pañuelo tapa los ojos y el cuchillo igual marca medio pulgada exacta ----
export const HBlindfold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const bf = eio(tt, 0.2, 0.9), cut = eio(tt, 1.2, 3.0);
  return <>
    <div style={{ position: "absolute", left: 360, top: 200, width: 380, height: 120, borderRadius: 60, background: "#f4efe6" }} />
    <div style={{ position: "absolute", left: 340 - 400 * (1 - bf), top: 220, width: 420, height: 90, background: "linear-gradient(180deg,#2a2a2e,#141416)", borderRadius: 12, transform: "rotate(-3deg)" }} />
    <div style={{ position: "absolute", left: 500, top: 520, width: 1000, height: 200, borderRadius: 100, background: `linear-gradient(180deg, rgb(${RAW.join(",")}), #d9a493)` }} />
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 640 + i * 230, top: 500, width: 6, height: 240 * cl(cut * 4 - i), background: "#2a1a10" }} />)}
    <div style={{ position: "absolute", left: 600 + 920 * cut, top: 380, width: 40, height: 180, background: "linear-gradient(90deg,#e7ecef,#9aa3ab)", borderRadius: "0 0 20px 20px", transform: "rotate(8deg)" }} />
    <Tag tt={tt} at={1.4} x={1460} y={300} txt="«HALF AN INCH · NO BONE»" col={AMB} size={46} />
    <Tag tt={tt} at={3.2} x={960} y={870} txt="MRS. NOWAK · 30 YEARS OF SATURDAYS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 2:43 · LA MANO DE MEDIDA: una mano abierta se apoya; el lomo coincide con su ancho, el filet queda finito ----
export const HHandspan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const hd = eio(tt, 0.4, 1.4);
  return <>
    <div style={{ position: "absolute", left: 560, top: 360, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, rgb(${RAW.join(",")}) 0 70%, #f3e8de 72%)`, opacity: cl(tt * 3) }} />
    <div style={{ position: "absolute", left: 1160, top: 470, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, #c9776a 0 70%, #f0ddd2 72%)`, opacity: cl(tt * 3) }} />
    <div style={{ position: "absolute", left: 540, top: 300 - 300 * (1 - hd), opacity: hd * 0.65 }}>
      <div style={{ width: 400, height: 280, borderRadius: "30% 30% 40% 40%", background: "#e7c3a6" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 98, top: -170 + Math.abs(i - 1.5) * 24, width: 76, height: 200, borderRadius: 38, background: "#e7c3a6" }} />)}
    </div>
    <Tag tt={tt} at={1.6} x={740} y={820} txt="LOIN ✓ · AS WIDE AS YOUR HAND" col={GRN} size={40} />
    <Tag tt={tt} at={2.2} x={1230} y={700} txt="TENDERLOIN ✕" col={RED} size={38} />
  </>;
}}</Stage>;

// ---- 3:05 · LA JERINGA: la aguja inyecta agua salada y la carne se infla y transpira gotas ----
export const HSyringe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.6, 2.4), sw = eio(tt, 1.0, 3.0);
  return <>
    <div style={{ position: "absolute", left: 640, top: 540 - 40 * sw, width: 640, height: 200 + 80 * sw, borderRadius: "50%", background: `radial-gradient(ellipse, ${mix(RAW, [250, 214, 214], sw)}, #d39a8c)` }} />
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 700 + rnd(i) * 520, top: 560 + rnd(i + 3) * 120 + ((tt * 40 + i * 13) % 40) * sw, width: 18, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,220,255,.85)", opacity: sw }} />)}
    <div style={{ position: "absolute", left: 1060, top: 200, transform: "rotate(30deg)", transformOrigin: "50% 100%" }}>
      <div style={{ width: 4, height: 120, margin: "0 auto", background: "#cfd4d8" }} />
      <div style={{ width: 110, height: 300, borderRadius: 14, border: "6px solid rgba(255,255,255,.7)", background: "rgba(255,255,255,.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${80 * (1 - p)}%`, background: "rgba(140,200,240,.7)" }} />
      </div>
      <div style={{ width: 30, height: 100 + 220 * p, margin: "0 auto", background: "#9aa3ab", transform: `translateY(${-220 * p}px)` }} />
    </div>
    <Tag tt={tt} at={1.4} x={420} y={300} txt="«ENHANCED» = SALT WATER" col={RED} size={44} anchor="l" />
    <Tag tt={tt} at={3.2} x={960} y={900} txt="IT SWEATS · THE CRUST SLIDES OFF" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 3:52 · EL EDIFICIO: el cuarto del medio retumba ¡BANG! y se prenden de a una las ventanas de los vecinos ----
export const HBuilding: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#0d1424,#05070c)">{(tt) => {
  const beat = (tt * 2.5) % 1, hit = beat < 0.15 ? 1 : 0;
  return <>
    <div style={{ position: "absolute", left: 620, top: 160 + hit * 4, width: 680, height: 860, background: "linear-gradient(180deg,#6b4434,#4a2c22)", boxShadow: sh(40) }}>
      {Array.from({ length: 20 }, (_, i) => { const c = i % 4, r = Math.floor(i / 4), center = i === 13, on = center || tt > 0.6 + (Math.abs(c - 1.5) + Math.abs(r - 3)) * 0.35; return <div key={i} style={{ position: "absolute", left: 60 + c * 150, top: 50 + r * 150, width: 110, height: 100, background: on ? (center ? "#ffd27a" : "#f2c46b") : "#1a1d26", boxShadow: on ? "0 0 30px rgba(255,200,110,.6)" : "none", border: "6px solid #3a2418" }} />; })}
    </div>
    {hit > 0 && <div style={{ position: "absolute", left: 1330, top: 640, fontFamily: MARK, fontSize: 110, color: AMB, transform: `rotate(${-10 + rnd(Math.floor(tt * 2.5)) * 20}deg)` }}>BANG!</div>}
    <Tag tt={tt} at={1.6} x={1330} y={420} txt="1955 · A MILK BOTTLE" col={TX} size={36} anchor="l" />
    <Tag tt={tt} at={2.6} x={1330} y={490} txt="= SUNDAY" col={AMB} size={56} anchor="l" />
  </>;
}}</Stage>;

// ---- 4:22 · MISMA CARNE, MÁS PLANA: un bloque se aplasta en una lámina ancha; el volumen no cambia ----
export const HVolume: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 0.6, 2.6), w = 300 * (1 + 2 * f), hh = 300 / (1 + 2 * f) ** 2 * 1 + 40 * (1 - f);
  return <>
    <div style={{ position: "absolute", left: 960, top: 700, transform: "translate(-50%,-100%) perspective(1600px) rotateX(55deg)", width: w, height: w, borderRadius: 30 * (1 - f) + 60 * f, background: `radial-gradient(ellipse, rgb(${RAW.join(",")}), #d39a8c)`, boxShadow: `0 ${hh}px 0 #b97a6c` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontWeight: 900, fontSize: 60, color: TX }}>{(0.5 - 0.25 * f).toFixed(2)}" thick</div>
    <Tag tt={tt} at={2.6} x={960} y={990} txt="NOT BIGGER · FLATTER" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 4:39 · EL MAZO DA VUELTA: la cara con púas se tacha; el mazo gira y muestra la cara lisa ----
export const HMallet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const r = 180 * eio(tt, 1.4, 2.4), x = eio(tt, 0.6, 1.1);
  const spiky = r < 90;
  return <>
    <div style={{ position: "absolute", left: 960, top: 480, transform: `translate(-50%,-50%) rotate(-20deg)` }}>
      <div style={{ position: "absolute", left: 160, top: 120, width: 70, height: 440, background: "linear-gradient(90deg,#8a5a33,#b07a48)", borderRadius: 20 }} />
      <div style={{ width: 400, height: 200, borderRadius: 20, background: "linear-gradient(180deg,#d8dde2,#8a939c)", transform: `perspective(1200px) rotateY(${r}deg)`, display: "grid", gridTemplateColumns: "repeat(6,1fr)", padding: 16, boxSizing: "border-box", gap: 6 }}>
        {spiky && Array.from({ length: 18 }, (_, i) => <div key={i} style={{ background: "#6a737c", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />)}
      </div>
    </div>
    {spiky && <div style={{ position: "absolute", left: 700, top: 380, width: 520 * x, height: 16, background: RED, transform: "rotate(-20deg)" }} />}
    <Tag tt={tt} at={0.4} x={960} y={150} txt={spiky ? "SPIKES SHRED THE MEAT" : "FLAT SIDE · PUSH OUTWARD"} col={spiky ? RED : GRN} size={48} />
  </>;
}}</Stage>;

// ---- 5:29 · LA PAPA FRITA: la milanesa se curva en taza; cortes en el borde y vuelve a quedar plana ----
export const HCurl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const c = eio(tt, 0.4, 1.6) * (1 - eio(tt, 3.0, 4.0)), n = eio(tt, 1.8, 2.8);
  return <>
    <SV>
      <path d={`M460 ${600 - 260 * c} Q960 ${600 + 140 * c} 1460 ${600 - 260 * c}`} stroke="#d9a493" strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d={`M460 ${600 - 260 * c} Q960 ${600 + 140 * c} 1460 ${600 - 260 * c}`} stroke="#fbf5ea" strokeWidth={14} fill="none" strokeLinecap="round" transform="translate(0 -34)" />
      {Array.from({ length: 9 }, (_, i) => { const x = 520 + i * 110, y = 600 - 260 * c * ((x - 960) / 500) ** 2 + 140 * c * (1 - ((x - 960) / 500) ** 2) - 50; return <line key={i} x1={x} y1={y - 20} x2={x} y2={y + 20} stroke={RED} strokeWidth={6} opacity={cl(n * 9 - i)} />; })}
      <line x1={400} y1={680} x2={1520} y2={680} stroke="rgba(255,190,90,.6)" strokeWidth={6} />
    </SV>
    <Tag tt={tt} at={0.8} x={960} y={220} txt="CURLS LIKE A POTATO CHIP" col={RED} size={48} />
    <Tag tt={tt} at={3.2} x={960} y={860} txt="NOTCH THE FAT EVERY INCH" col={GRN} size={46} />
  </>;
}}</Stage>;

// ---- 6:17 · EL MOÑO: dos cordones se cruzan y se atan solos como cuando uno se ata las zapatillas ----
export const HShoelace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.4, 2.4), lp = eio(tt, 1.6, 3.0);
  return <>
    <div style={{ position: "absolute", left: 660, top: 520, width: 600, height: 300, borderRadius: "40% 60% 20% 20%", background: "linear-gradient(180deg,#3a3d44,#1e2024)", boxShadow: sh(30) }}>
      {[0, 1, 2].map((i) => [0, 1].map((j) => <div key={i + "" + j} style={{ position: "absolute", left: 230 + j * 120, top: 40 + i * 60, width: 22, height: 22, borderRadius: 11, background: "#c9d0d8" }} />))}
    </div>
    <SV>
      <path d={`M920 540 C ${880 - 200 * k} ${460 - 60 * k}, ${860 - 120 * lp} ${360}, ${960 - 160 * lp} ${420 - 40 * lp}`} stroke="#f4efe6" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M1000 540 C ${1040 + 200 * k} ${460 - 60 * k}, ${1060 + 120 * lp} ${360}, ${960 + 160 * lp} ${420 - 40 * lp}`} stroke="#f4efe6" strokeWidth={14} fill="none" strokeLinecap="round" />
      {lp > 0.1 && <><ellipse cx={960 - 90 * lp} cy={420} rx={80 * lp} ry={44 * lp} fill="none" stroke="#f4efe6" strokeWidth={12} /><ellipse cx={960 + 90 * lp} cy={420} rx={80 * lp} ry={44 * lp} fill="none" stroke="#f4efe6" strokeWidth={12} /><circle cx={960} cy={430} r={18 * lp} fill="#f4efe6" /></>}
    </SV>
    <Tag tt={tt} at={2.8} x={960} y={900} txt="LITTLE NOTCHES · WITHOUT THINKING" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 6:36 · LAS GOTAS QUE SUBEN: dos milanesas, 1 minuto vs 1 hora; en la de la hora suben gotas y el pan rallado se vuelve pasta ----
export const HBeads: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const w = eio(tt, 0.8, 3.4);
  const cut = (x: number, wet: boolean, lbl: string, col: string) => <div style={{ position: "absolute", left: x, top: 420, width: 560 }}>
    <div style={{ width: 560, height: 240, borderRadius: "48% 52% 50% 50%", background: `radial-gradient(ellipse, ${wet ? mix(RAW, [245, 210, 200], w) : `rgb(${RAW.join(",")})`}, #d39a8c)`, position: "relative" }}>
      {wet && Array.from({ length: 26 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 460, top: 30 + rnd(i + 2) * 170, width: 26 * cl(w * 2 - rnd(i)), height: 26 * cl(w * 2 - rnd(i)), borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#fff,rgba(160,210,255,.8))" }} />)}
    </div>
    <div style={{ textAlign: "center", marginTop: 30, fontWeight: 900, fontSize: 52, color: col }}>{lbl}</div>
  </div>;
  return <>
    {cut(300, false, "SALT · 1 MINUTE", GRN)}{cut(1060, true, "SALT · 1 HOUR", RED)}
    <Tag tt={tt} at={3.0} x={1340} y={330} txt="WET = BREADING SLIDES" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 7:15 · LA LÍNEA DE MONTAJE: los tres platos llegan deslizándose por una cinta y se ponen nombre ----
export const HLineup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const items: [string, string][] = [["FLOUR", "#f6f2e8"], ["EGG + MILK", "#f6d35a"], ["FINE CRUMBS", "#d9a85a"]];
  return <>
    <div style={{ position: "absolute", left: 160, right: 160, top: 690, height: 40, background: "repeating-linear-gradient(90deg,#2a2c30 0 40px,#34373c 40px 80px)", backgroundPosition: `${-tt * 200}px 0`, borderRadius: 20 }} />
    {items.map(([n, c], i) => { const x = 360 + i * 440 + (1 - eio(tt, 0.2 + i * 0.4, 1.2 + i * 0.4)) * 1600; return <div key={i} style={{ position: "absolute", left: x, top: 470 }}>
      <div style={{ width: 360, height: 220, borderRadius: "50%", background: "radial-gradient(circle,#fbfaf6 0 54%,#e2ddd2 56%,#f4f1ea 70%)", boxShadow: sh(20), display: "grid", placeItems: "center" }}>
        <div style={{ width: 200, height: 110, borderRadius: "50%", background: c, filter: i === 2 ? "contrast(1.2)" : undefined }} />
      </div>
      <div style={{ textAlign: "center", marginTop: 70, fontWeight: 900, fontSize: 44, color: TX }}>{i + 1}. {n}</div>
    </div>; })}
    <Tag tt={tt} at={2.4} x={960} y={300} txt="EVERY RESTAURANT KITCHEN" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 7:44 · EL TAMIZ: el pan rallado pasa por un colador; lo fino cae, las escamas grandes quedan arriba ----
export const HSieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = Math.sin(tt * 14) * 10 * cl(tt - 0.4) * (1 - cl(tt - 3.6));
  return <>
    <div style={{ position: "absolute", left: 660 + s, top: 300, width: 600, height: 120, borderRadius: "0 0 300px 300px", background: "repeating-linear-gradient(45deg,#9aa3ab 0 3px,transparent 3px 14px),repeating-linear-gradient(-45deg,#9aa3ab 0 3px,transparent 3px 14px)", border: "8px solid #c9d0d8" }} />
    {Array.from({ length: 9 }, (_, i) => <div key={"f" + i} style={{ position: "absolute", left: 720 + i * 56 + s, top: 270 - rnd(i) * 30, width: 50, height: 22, borderRadius: 6, background: "#e8c88a", transform: `rotate(${rnd(i) * 60 - 30}deg)` }} />)}
    {Array.from({ length: 60 }, (_, i) => { const k = ((tt * 0.8 + rnd(i)) % 1) * cl(tt - 0.4); return <div key={i} style={{ position: "absolute", left: 720 + rnd(i + 5) * 480, top: 420 + k * 360, width: 8, height: 8, borderRadius: 2, background: "#c98a3a", opacity: 1 - k * 0.3 }} />; })}
    <div style={{ position: "absolute", left: 700, top: 800, width: 520, height: 80, borderRadius: "50%", background: "#c98a3a" }} />
    <Tag tt={tt} at={1.2} x={1500} y={300} txt="FLAKY ✕" col={RED} size={44} />
    <Tag tt={tt} at={1.8} x={1500} y={820} txt="FINE ✓" col={GRN} size={48} />
  </>;
}}</Stage>;

// ---- 7:59 · LOS DEDOS GARROTE: los dedos se van empanando capa sobre capa hasta parecer un garrote ----
export const HClubs: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.3, 3.0);
  return <>
    <div style={{ position: "absolute", left: 960, top: 640, transform: "translate(-50%,-50%)" }}>
      <div style={{ width: 360, height: 280, borderRadius: "30% 30% 40% 40%", background: mix([231, 195, 166], [214, 160, 80], g * 0.7) }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 10 + i * 88 - 14 * g, top: -200 - 40 * g + Math.abs(i - 1.5) * 20, width: 70 + 40 * g, height: 230 + 50 * g, borderRadius: 40 + 20 * g, background: mix([231, 195, 166], [214, 150, 60], g), backgroundImage: g > 0.2 ? `radial-gradient(circle, rgba(120,70,20,.5) 2px, transparent 3px)` : undefined, backgroundSize: "14px 14px" }} />)}
    </div>
    <Tag tt={tt} at={1.8} x={960} y={200} txt="BOTH HANDS = BREADED CLUBS" col={RED} size={48} />
  </>;
}}</Stage>;

// ---- 8:37 · EL ESPEJO: la mano de la nieta se refleja y las etiquetas SECA / MOJADA cambian de lado ----
export const HMirror: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const f = eio(tt, 1.0, 2.4);
  const hand = (x: number, flip: number) => <div style={{ position: "absolute", left: x, top: 420, transform: `scaleX(${flip})` }}>
    <div style={{ width: 220, height: 200, borderRadius: "30% 30% 40% 40%", background: "#e7c3a6" }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 6 + i * 54, top: -130 + Math.abs(i - 1.5) * 16, width: 44, height: 150, borderRadius: 22, background: "#e7c3a6" }} />)}
    <div style={{ position: "absolute", left: 200, top: 60, width: 90, height: 140, borderRadius: 40, background: "#e7c3a6", transform: "rotate(30deg)" }} />
  </div>;
  return <>
    <div style={{ position: "absolute", left: 958, top: 180, width: 4, height: 720, background: "linear-gradient(180deg,transparent,#cfe8ff,transparent)", boxShadow: "0 0 30px #cfe8ff" }} />
    {hand(560, 1)}{hand(1140, -1)}
    <div style={{ position: "absolute", left: 420 + 760 * f, top: 760, width: 320, textAlign: "center", fontWeight: 900, fontSize: 48, color: AMB }}>DRY</div>
    <div style={{ position: "absolute", left: 1180 - 760 * f, top: 760, width: 320, textAlign: "center", fontWeight: 900, fontSize: 48, color: ICE }}>WET</div>
    <Tag tt={tt} at={2.6} x={960} y={220} txt="LEFT-HANDED · STILL WORKS" col={TX} size={44} />
  </>;
}}</Stage>;
