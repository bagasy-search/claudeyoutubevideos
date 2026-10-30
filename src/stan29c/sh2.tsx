// stan29c · componentes únicos 15-28 (min 10-20).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PALE = [238, 214, 190], GOLD = [176, 104, 40];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---- 10:05 · LA ESPOSA: el globo de queja gira como una moneda y del otro lado aparece la pregunta contenta ----
export const HWife: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const r = eio(tt, 2.0, 3.0) * 180;
  const face = (txt: string, col: string, back: boolean) => <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: col, display: "grid", placeItems: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#2b2620", backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined, boxShadow: sh(30) }}>{txt}</div>;
  return <>
    <div style={{ position: "absolute", left: 960, top: 480, transform: "translate(-50%,-50%)", width: 820, height: 340, perspective: 1600 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${r}deg)` }}>{face("«Again, a chicken?»", "#e7d6c4", false)}{face("«Is it in there?»", "#d8f0c4", true)}</div>
      <div style={{ position: "absolute", left: 140, bottom: -60, width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderTop: `70px solid ${r > 90 ? "#d8f0c4" : "#e7d6c4"}` }} />
    </div>
    <Tag tt={tt} at={3.4} x={960} y={850} txt="EVERY THURSDAY NIGHT · ON A RACK" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 10:55 · LA FRAZADA DE POLLO: el pollo plano tapa las papas y la grasa gotea; las papas se doran de abajo ----
export const HDrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const c = phys(tt, 0.3, 5, 0.6), g = eio(tt, 1.4, 4.6);
  return <>
    <Head tt={tt} kick="NUMBER SEVEN" title="THE CHICKEN IS THE BLANKET" />
    <div style={{ position: "absolute", left: 460, top: 720, width: 1000, height: 60, background: "#2a2a2d", borderRadius: 10 }} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 500 + i * 104, top: 660, width: 100, height: 60, borderRadius: 18, background: mix([236, 214, 160], [200, 140, 50], g), boxShadow: "inset 0 -8px 12px rgba(0,0,0,.2)" }} />)}
    <div style={{ position: "absolute", left: 470, top: 420 + (1 - cl(c)) * -500, width: 980, height: 230, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: mix(PALE, GOLD, g * 0.8), boxShadow: sh(30) }} />
    {Array.from({ length: 10 }, (_, i) => { const d = ((tt * 1.1 + rnd(i)) % 1); return tt > 1.4 && <div key={i} style={{ position: "absolute", left: 520 + i * 95, top: 640 + d * 30, width: 12, height: 18, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#f2c46b", opacity: 1 - d }} />; })}
  </>;
}}</Stage>;

// ---- 11:30 · LA LUZ DEL HORNO: la puerta queda cerrada; se prende la luz y el vidrio muestra cómo se dora ----
export const HOvenLight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const on = tt > 1.0 ? 1 : 0, g = eio(tt, 1.2, 4.6);
  return <>
    <div style={{ position: "absolute", left: 560, top: 200, width: 800, height: 700, borderRadius: 30, background: "linear-gradient(180deg,#3b3e43,#25272b)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 80, top: 30, width: 640, height: 50, borderRadius: 25, background: "#c9d0d8" }} />
      <div style={{ position: "absolute", left: 80, top: 140, width: 640, height: 440, borderRadius: 20, background: on ? "radial-gradient(ellipse at 50% 30%, #ffcf7a, #7a3a10 80%)" : "#0b0b0c", overflow: "hidden" }}>
        {on > 0 && <div style={{ position: "absolute", left: 120, top: 200, width: 400, height: 160, borderRadius: "50% 50% 30% 30%", background: mix(PALE, GOLD, g) }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,.15), transparent 40%)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1420, top: 300, width: 90, height: 90, borderRadius: 18, background: on ? "#ffd27a" : "#444", boxShadow: on ? "0 0 40px #ffd27a" : "none", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 22, color: "#222" }}>LIGHT</div>
    <Tag tt={tt} at={2.0} x={960} y={960} txt="DON'T OPEN THE DOOR" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 11:45 · LA PATA QUE SE MENEA: la pata se bambolea con líneas de movimiento y signos de pregunta; cae una cruz ----
export const HWiggle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = 18 * Math.sin(tt * 7) * (1 - eio(tt, 3.0, 3.6)), x = phys(tt, 3.6, 8, 0.4);
  return <>
    <div style={{ position: "absolute", left: 900, top: 340, transformOrigin: "40px 40px", transform: `rotate(${a}deg)` }}>
      <div style={{ width: 120, height: 360, borderRadius: "60px 60px 40px 40px", background: mix(PALE, GOLD, 0.6) }} />
      <div style={{ position: "absolute", left: 30, top: 340, width: 60, height: 90, borderRadius: 30, background: "#efe3c8" }} />
    </div>
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 960 + s * 220, top: 500, fontWeight: 900, fontSize: 120, color: DIM, transform: `rotate(${s * 15}deg)`, opacity: 0.5 + 0.5 * Math.sin(tt * 5) }}>?</div>)}
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${2.4 - 1.4 * cl(x)})`, opacity: cl(x * 2), fontWeight: 900, fontSize: 400, color: RED }}>✕</div>
    <Tag tt={tt} at={1.0} x={420} y={260} txt="«WIGGLE THE LEG» = A GUESS" col={RED} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 12:35 · LA CARPA DE PAPEL ALUMINIO: el aluminio baja, adentro gotea el vapor y la piel pasa de crocante a lisa ----
export const HFoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const d = eio(tt, 0.4, 1.6), soft = eio(tt, 1.8, 4.6);
  return <>
    <Head tt={tt} kick="REST 10 MIN" title="NO FOIL" col={RED} />
    <div style={{ position: "absolute", left: 620, top: 560, width: 680, height: 220, borderRadius: "50% 50% 20% 20%", background: mix(GOLD, [210, 170, 120], soft) }}>
      {Array.from({ length: 50 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 600, top: 20 + rnd(i + 2) * 160, width: 18, height: 12, borderRadius: 6, background: "rgba(90,40,10,.5)", opacity: 1 - soft }} />)}
    </div>
    <SV><path d={`M560 ${780 - 420 * d} L960 ${420 - 400 * (1 - d)} L1360 ${780 - 420 * d}`} fill="none" stroke="#d8dde2" strokeWidth={18} opacity={cl(d * 2)} />
      {Array.from({ length: 12 }, (_, i) => { const dd = ((tt * 0.7 + rnd(i)) % 1); return <ellipse key={i} cx={640 + i * 58} cy={560 - 40 * (1 - dd) + dd * 30} rx={8} ry={12} fill="rgba(180,220,255,.7)" opacity={soft * (1 - dd)} />; })}</SV>
    <Tag tt={tt} at={3.4} x={1560} y={460} txt="STEAM SOFTENS IT" col={ICE} size={42} />
  </>;
}}</Stage>;

// ---- 13:50 · EL LETRERO DE NEÓN: se enciende titilando el cartel del restaurante de la Wentworth ----
export const HNeon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#07080d,#020203)">{(tt) => {
  const fl = tt < 1.4 ? (Math.sin(tt * 40) > 0.3 ? 1 : 0.15) : 1;
  const glow = (c: string) => `0 0 10px ${c}, 0 0 30px ${c}, 0 0 70px ${c}`;
  return <>
    <div style={{ position: "absolute", left: 960, top: 420, transform: "translate(-50%,-50%)", padding: "40px 80px", border: `8px solid rgba(255,90,74,${0.4 + 0.6 * fl})`, borderRadius: 30, boxShadow: glow(`rgba(255,90,74,${0.6 * fl})`), textAlign: "center" }}>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 120, color: "#ffe3c0", textShadow: glow(`rgba(255,170,90,${fl})`), opacity: 0.3 + 0.7 * fl }}>Golden Wok</div>
      <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 10, color: "#9fe8ff", textShadow: glow("rgba(120,220,255,.8)"), opacity: cl(tt - 1.6) }}>WENTWORTH AVE</div>
    </div>
    <Tag tt={tt} at={2.4} x={960} y={780} txt="1991 · DANNY'S WINGS" col={AMB} size={48} />
  </>;
}}</Stage>;

// ---- 14:05 · LA LATITA: gira en 3D sobre el estante hasta mostrar la etiqueta BAKING POWDER ----
export const HCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = 540 * (1 - eio(tt, 0.4, 3.0)), sh2 = Math.cos((r * Math.PI) / 180);
  return <>
    <div style={{ position: "absolute", left: 460, top: 780, width: 1000, height: 30, background: "linear-gradient(180deg,#8a5a33,#5b3a1f)", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 960, top: 780, transform: "translate(-50%,-100%)", width: 300, height: 420 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "20px/14px", background: `linear-gradient(90deg, #7a1f15, #c4382a ${40 + 20 * sh2}%, #7a1f15)`, boxShadow: sh(30), overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#fff3d6", transform: `scaleX(${Math.max(0.05, sh2)})`, opacity: sh2 > 0 ? 1 : 0 }}>BAKING<br />POWDER</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontWeight: 800, fontSize: 22, color: "#fff3d6", transform: `scaleX(${Math.max(0.05, sh2)})`, opacity: sh2 > 0 ? 1 : 0 }}>ALUMINUM FREE</div>
      </div>
      <div style={{ position: "absolute", left: -6, top: -14, width: 312, height: 30, borderRadius: "50%", background: "#c9d0d8" }} />
    </div>
    <Tag tt={tt} at={3.0} x={1500} y={420} txt="NOT BAKING SODA" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 14:18 · LA TIRA DE pH: escala del 1 al 14 en colores; el puntero viaja del agua al polvo de hornear ----
export const HPh: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const v = 7 + 1.6 * eio(tt, 1.2, 3.2), x = 360 + ((v - 1) / 13) * 1200;
  const cols = ["#e53935", "#f4511e", "#fb8c00", "#fdd835", "#c0ca33", "#7cb342", "#43a047", "#26a69a", "#00acc1", "#1e88e5", "#3949ab", "#5e35b1", "#8e24aa", "#6a1b9a"];
  return <>
    <Head tt={tt} kick="WHY IT WORKS" title="SLIGHTLY ALKALINE" />
    {cols.map((c, i) => <div key={i} style={{ position: "absolute", left: 360 + i * (1200 / 14), top: 500, width: 1200 / 14 - 6, height: 120, background: c, borderRadius: 8, opacity: cl(tt * 3 - i * 0.12) }} />)}
    {cols.map((_, i) => <div key={"n" + i} style={{ position: "absolute", left: 360 + i * (1200 / 14), width: 1200 / 14, top: 640, textAlign: "center", fontWeight: 800, fontSize: 26, color: DIM }}>{i + 1}</div>)}
    <div style={{ position: "absolute", left: x, top: 380, transform: "translateX(-50%)", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 48, color: tt > 3 ? GRN : TX }}>{tt > 3 ? "BAKING POWDER" : "WATER"}</div>
      <div style={{ margin: "6px auto 0", width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "40px solid #fff" }} />
    </div>
    <Tag tt={tt} at={3.6} x={960} y={820} txt="BROWNS FASTER · DRIES THE SKIN" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 16:08 · LA ARTICULACIÓN: rótula y cavidad del muslo; la pata gira hacia afuera y ¡pop!, la bola sale ----
export const HJoint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const r = eio(tt, 0.6, 2.4) * 40, pop = phys(tt, 2.5, 8, 0.35), pb = cl(pop);
  return <>
    <Head tt={tt} kick="NUMBER TEN" title="THE JOINT POPS RIGHT OUT" />
    <SV>
      <path d="M560 360 L860 360 Q900 420 860 480 L560 480 Z" fill="#efe3c8" />
      <path d="M860 360 Q930 420 860 480" stroke="#c9b48e" strokeWidth={14} fill="none" />
      <g transform={`translate(${80 * pb} ${-40 * pb}) rotate(${r} 900 420)`}>
        <circle cx={900} cy={420} r={52} fill="#f6ecd6" stroke="#c9b48e" strokeWidth={6} />
        <rect x={940} y={380} width={460} height={80} rx={40} fill="#efe3c8" />
        <path d="M1000 330 Q1300 300 1420 420 Q1300 560 1000 520 Z" fill={mix(PALE, GOLD, 0.5)} opacity={0.85} />
      </g>
      {pb > 0.05 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={900 + Math.cos(a) * 70} y1={420 + Math.sin(a) * 70} x2={900 + Math.cos(a) * (70 + 80 * pb)} y2={420 + Math.sin(a) * (70 + 80 * pb)} stroke={AMB} strokeWidth={6} opacity={1 - pb * 0.6} />; })}
    </SV>
    <Tag tt={tt} at={2.7} x={900} y={640} txt="POP!" col={AMB} size={90} />
  </>;
}}</Stage>;

// ---- 16:40 · EL ABANICO: la pechuga entera se rebana y las tajadas se abren en abanico, cada una con su piel ----
export const HFan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = eio(tt, 1.0, 3.4);
  return <>
    {Array.from({ length: 7 }, (_, i) => { const a = (i - 3) * 13 * f; return <div key={i} style={{ position: "absolute", left: 960 - 60, top: 300, width: 120, height: 460, transformOrigin: "50% 100%", transform: `translateX(${(i - 3) * 30 * (1 - f)}px) rotate(${a}deg)` }}>
      <div style={{ width: 120, height: 460, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(180deg,#f4e4d2,#e6cdb6)", boxShadow: "0 10px 30px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 40, borderRadius: "60px 60px 0 0", background: "linear-gradient(180deg,#8a4512,#c27a35)" }} />
    </div>; })}
    <div style={{ position: "absolute", left: 600, top: 760, width: 720, height: 30, borderRadius: 15, background: "#e9e4dc" }} />
    <Tag tt={tt} at={3.0} x={960} y={880} txt="EVERY SLICE GETS SKIN" col={AMB} size={48} />
  </>;
}}</Stage>;

// ---- 17:20 · EL BOWL: un montón de sal blanca y uno de polvo; la cuchara gira y se funden en espiral ----
export const HSwirl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const m = eio(tt, 1.2, 4.0);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%)", width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle,#f3efe6 0 58%,#c9c2b2 60%,#e9e4dc 72%)", boxShadow: sh(40) }} />
    <SV>{Array.from({ length: 90 }, (_, i) => { const salt = i < 72; const a0 = salt ? Math.PI : 0, r0 = 40 + rnd(i) * 70, a = a0 + rnd(i + 1) * 1.2 + m * (3 + rnd(i) * 4), r = r0 + m * (rnd(i + 4) * 120); return <rect key={i} x={960 + Math.cos(a) * (salt ? r + 60 * (1 - m) : r + 60 * (1 - m))} y={560 + Math.sin(a) * r} width={10} height={10} fill={salt ? "#ffffff" : "#ffe9a8"} transform={`rotate(45 ${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r})`} />; })}</SV>
    <Tag tt={tt} at={0.6} x={960} y={150} txt="4 TSP KOSHER SALT" col={TX} size={44} />
    <Tag tt={tt} at={0.9} x={1560} y={520} txt="+ ½ TSP POWDER" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 18:30 · EL FRASCO DE GRASA: la grasa dorada cae al frasco y al enfriarse se vuelve capa blanca ----
export const HJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fill = eio(tt, 0.4, 2.4), set = eio(tt, 2.6, 4.6);
  return <>
    <div style={{ position: "absolute", left: 960 - 15, top: 160, width: 30, height: 380 * (1 - set), background: "linear-gradient(180deg,#f2c46b,#d8952f)", borderRadius: 15, opacity: fill < 1 ? 1 : 1 - set }} />
    <div style={{ position: "absolute", left: 760, top: 500, width: 400, height: 440, borderRadius: "40px 40px 60px 60px", border: "8px solid rgba(255,255,255,.55)", overflow: "hidden", background: "rgba(255,255,255,.04)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 70}%`, background: `linear-gradient(180deg, ${mix([242, 196, 107], [246, 240, 228], set)}, ${mix([200, 140, 50], [232, 222, 200], set)})` }} />
    </div>
    <div style={{ position: "absolute", left: 740, top: 470, width: 440, height: 50, borderRadius: 14, background: "#c9b07a" }} />
    <Tag tt={tt} at={3.2} x={1460} y={600} txt="FOR FRYING POTATOES" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 19:25 · LA FREIDORA DE AIRE: el canasto con alitas y el aire que gira en remolino alrededor ----
export const HVortex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const g = eio(tt, 0.6, 4.4);
  return <>
    <div style={{ position: "absolute", left: 700, top: 260, width: 520, height: 600, borderRadius: "80px 80px 40px 40px", background: "linear-gradient(180deg,#2a2c30,#141517)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 60, top: 260, width: 400, height: 260, borderRadius: 30, background: "#0b0b0c", overflow: "hidden" }}>
        {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 92, top: 110 + (i % 2) * 30, width: 80, height: 60, borderRadius: 30, background: mix(PALE, GOLD, g) }} />)}
      </div>
    </div>
    <SV>{Array.from({ length: 22 }, (_, i) => { const a = tt * 3 + (i / 22) * Math.PI * 2, rx = 360 + 40 * Math.sin(i), ry = 120; const x = 960 + Math.cos(a) * rx, y = 640 + Math.sin(a) * ry; return <circle key={i} cx={x} cy={y} r={10} fill="rgba(255,200,140,.7)" opacity={Math.sin(a) > 0 ? 1 : 0.3} />; })}</SV>
    <Tag tt={tt} at={1.4} x={1500} y={380} txt="400 °F · SKIN UP" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 19:55 · LA BAÑERA: el pollo en la bañera; se tira del tapón, el agua se va en remolino y queda seco ----
export const HTub: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const dr = eio(tt, 1.0, 4.0);
  return <>
    <div style={{ position: "absolute", left: 460, top: 440, width: 1000, height: 380, borderRadius: "40px 40px 200px 200px", background: "linear-gradient(180deg,#f4f4f2,#d9dcdf)", boxShadow: sh(40), overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${70 * (1 - dr)}%`, background: "linear-gradient(180deg,rgba(143,214,255,.75),rgba(80,160,220,.8))" }} />
      <div style={{ position: "absolute", left: 360, top: 70 + 120 * dr, width: 280, height: 170, borderRadius: "50% 50% 40% 40%", background: mix([236, 222, 206], [230, 200, 170], dr) }} />
    </div>
    <SV>{Array.from({ length: 3 }, (_, i) => <ellipse key={i} cx={1300} cy={780} rx={(60 - i * 18) * (1 - dr * 0.5)} ry={(18 - i * 5)} fill="none" stroke="rgba(80,160,220,.8)" strokeWidth={4} transform={`rotate(${tt * 200 + i * 40} 1300 780)`} opacity={1 - dr} />)}</SV>
    <Tag tt={tt} at={3.4} x={960} y={260} txt="«I JUST DON'T GIVE IT A BATH»" col={AMB} size={50} />
  </>;
}}</Stage>;
