// lou29 · componentes únicos 2/3
import React from "react";
import { H, Mode, Stage, Tag, phys, cl, eio, TX, DIM, AMB, RED, MARK, HAND } from "./hkit";
import { At, STEEL, Steam, pop } from "./lou_h1";

const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode }> = ({ t, h, f }) => <Stage t={t} h={h} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
const Pot: React.FC<{ w: number; h: number; children?: React.ReactNode; liquid?: string }> = ({ w, h, children, liquid = "#6b2e14" }) =>
  <div style={{ position: "relative", width: w, height: h }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 0, background: STEEL, borderRadius: `0 0 ${w / 8}px ${w / 8}px`, boxShadow: "inset 0 -30px 50px rgba(0,0,0,.5), 0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: -6, right: -6, top: 10, height: 56, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 60%,${liquid},#2a1408 60%,#c9ced4 62%,#7b8088 80%)`, overflow: "hidden" }}>{children}</div>
  </div>;

// m13 · la vasija de barro donde Gus curaba el pecho: el dial de días gira de 1 a 10
export const HCrock: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = 1 + Math.floor(eio(tt, 0.9, 5.2) * 9.99);
  return <>
    <At x={760} y={600} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 520, height: 560, borderRadius: "46% 46% 30% 30% / 30% 30% 16% 16%", background: "linear-gradient(90deg,#6e5236,#c9a77a 30%,#e7cfa4 42%,#a7845a 70%,#5a4029)", boxShadow: "0 60px 120px rgba(0,0,0,.75)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 70, background: "linear-gradient(#3f5f8f,#2a4470)", opacity: 0.85 }} />
        <div style={{ position: "absolute", left: "50%", top: 250, transform: "translateX(-50%)", fontFamily: MARK, fontSize: 56, color: "#2a4470", whiteSpace: "nowrap" }}>WALK-IN</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: -26, height: 70, borderRadius: "50%", background: "radial-gradient(#b25a52,#6a2622 70%,#c9a77a 72%)" }} />
      </div>
    </At>
    <At x={1380} y={500} s={pop(tt, 0.6)}>
      <div style={{ width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffaf0,#e3dac7)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", position: "relative" }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + 120 * Math.sin((i / 10) * 6.283) - 22, top: 160 - 120 * Math.cos((i / 10) * 6.283) - 22, width: 44, height: 44, borderRadius: "50%", background: i < d ? RED : "#d6ccb8", transform: `scale(${i < d ? 1 : 0.7})` }} />)}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120, color: "#2a2522" }}>{d}</div>
      </div>
    </At>
    <Tag tt={tt} at={1.4} x={1380} y={720} txt="DAYS CURING" col={TX} size={48} />
    <Tag tt={tt} at={2.4} x={1380} y={300} txt="MARCH 1972" col={AMB} size={52} />
  </>;
}} />;

// m14 · dos ollas: el hervor fuerte (burbujas grandes, carne dura) contra las burbujitas (carne tierna)
export const HBubbles: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const B: React.FC<{ big: boolean }> = ({ big }) => <>{Array.from({ length: big ? 9 : 26 }, (_, i) => {
    const sp = big ? 2.2 : 0.7, ph = (tt * sp + i * 0.37) % 1, r = big ? 40 + (i % 3) * 18 : 7 + (i % 3) * 3;
    return <div key={i} style={{ position: "absolute", left: 30 + ((i * 113) % 420), top: 6 + ((i * 7) % 30) - (big ? ph * 30 : 0), width: r * 2, height: r, borderRadius: "50%", border: "3px solid rgba(255,240,215,.75)", transform: `scale(${Math.sin(ph * Math.PI)})` }} />;
  })}</>;
  return <>
    <At x={560} y={600} s={pop(tt, 0.1)}><Pot w={480} h={400} liquid="#a0602e"><B big /></Pot></At>
    <At x={1360} y={600} s={pop(tt, 0.4)}><Pot w={480} h={400} liquid="#8a5228"><B big={false} /></Pot></At>
    <Steam tt={tt} x={560} y={420} n={7} w={420} a={1.2} />
    <Steam tt={tt * 0.6} x={1360} y={420} n={4} w={300} a={0.6} />
    <Tag tt={tt} at={1.2} x={560} y={860} txt="HARD BOIL" col={RED} size={54} />
    <Tag tt={tt} at={2.4} x={1360} y={860} txt="TINY BUBBLES" col={AMB} size={54} />
  </>;
}} />;

// m15 · corte de la olla de porotos: la cuchara aprieta contra la pared y los porotos se vuelven crema
export const HBeanMash: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const pr = eio(tt, 1.0, 2.0) * (1 - eio(tt, 2.4, 2.9)) + eio(tt, 3.1, 3.9) * (1 - eio(tt, 4.3, 4.8)), cream = eio(tt, 1.4, 5.5);
  return <>
    <At x={960} y={620} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 900, height: 520, position: "relative", borderRadius: "0 0 60px 60px", background: `linear-gradient(90deg,#4a4e55 0 22px,transparent 22px calc(100% - 22px),#4a4e55 calc(100% - 22px))`, borderBottom: "22px solid #3a3d42", boxShadow: "0 60px 120px rgba(0,0,0,.7)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 0, height: 380, background: `linear-gradient(${cream > 0.5 ? "#8c3a26" : "#5a1e14"},#3c120a)` }} />
        {Array.from({ length: 70 }, (_, i) => {
          const x = 40 + (i * 97) % 820, y = 170 + (i * 53) % 320, near = x > 640 ? 1 : 0, sm = near * cream;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 46 + sm * 30, height: 26 - sm * 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#c4553a,#7b2316)", opacity: 1 - sm * 0.6, filter: sm > 0.4 ? "blur(3px)" : undefined }} />;
        })}
      </div>
    </At>
    <At x={1260 + pr * 70} y={430 + pr * 120} r={-38}><div style={{ width: 120, height: 170, borderRadius: "50%", background: STEEL, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} /><div style={{ position: "absolute", left: 50, top: -380, width: 22, height: 400, borderRadius: 10, background: STEEL }} /></At>
    <Tag tt={tt} at={2.2} x={560} y={300} txt="1 CUP MASHED" col={AMB} size={58} />
    <Tag tt={tt} at={3.8} x={560} y={380} txt="= CREAMY" col={TX} size={50} />
  </>;
}} />;

// m16 · la pila de postales de Luisiana: una por Navidad, de 1975 a 1990
export const HPostcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const n = Math.min(16, Math.floor(eio(tt, 0.6, 6.0) * 16.99));
  return <>
    {Array.from({ length: 16 }, (_, i) => {
      const s = pop(tt, 0.6 + i * 0.33, 8, 0.45), top = i === n - 1;
      if (s < 0.01) return null;
      return <At key={i} x={900 + ((i * 37) % 60) - 30} y={560 - i * 6 - (1 - s) * 500} s={0.95} r={((i * 47) % 24) - 12} rx={30} o={s}>
        <div style={{ width: 640, height: 400, borderRadius: 10, background: "linear-gradient(135deg,#fdf7ea,#ece0c8)", boxShadow: "0 30px 60px rgba(0,0,0,.55)", position: "relative" }}>
          <div style={{ position: "absolute", right: 28, top: 26, width: 96, height: 116, background: "repeating-linear-gradient(45deg,#2f6f4f 0 8px,#3e8a62 8px 16px)", border: "6px dashed #fdf7ea" }} />
          <div style={{ position: "absolute", left: 320, top: 40, bottom: 40, width: 2, background: "rgba(80,60,40,.35)" }} />
          <div style={{ position: "absolute", left: 36, top: 70, fontFamily: HAND, fontSize: 52, color: "#26324f", lineHeight: 1.1 }}>Merry<br />Christmas,<br />Lou</div>
          {top && <div style={{ position: "absolute", left: 360, top: 200, fontFamily: HAND, fontSize: 64, color: "#7a2e1f" }}>{1974 + i + 1}</div>}
        </div>
      </At>;
    })}
    <Tag tt={tt} at={1.6} x={1520} y={260} txt="1975 → 1990" col={AMB} size={56} />
  </>;
}} />;

// m17 · la fuente de puré vista desde arriba: el tenedor marca surcos y los surcos se doran en el horno
export const HForkRidges: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const draw = eio(tt, 0.8, 3.6), brown = eio(tt, 4.0, 7.5), fx = 360 + 1200 * ((draw * 7) % 1), fy = 300 + Math.floor(draw * 7) * 80;
  return <>
    <At x={960} y={560} s={pop(tt, 0.05, 4.5, 0.55)} rx={34}>
      <div style={{ width: 1300, height: 760, borderRadius: 70, background: "linear-gradient(#e9e3d8,#b8b0a2)", padding: 40, boxShadow: "0 70px 130px rgba(0,0,0,.75)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 40, background: `linear-gradient(${brown > 0.5 ? "#e8c27a" : "#f5ecd2"},${brown > 0.5 ? "#c48b3e" : "#ece0bd"})`, position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 7 }, (_, i) => { const len = cl(draw * 7 - i); return <div key={i} style={{ position: "absolute", left: 30, top: 50 + i * 90, width: `${len * 95}%`, height: 26, borderRadius: 13, background: `linear-gradient(rgba(120,70,20,${0.12 + 0.6 * brown}),rgba(255,255,240,.5))`, boxShadow: brown > 0.3 ? `0 0 ${20 * brown}px rgba(170,90,20,${0.5 * brown})` : undefined }} />; })}
        </div>
      </div>
    </At>
    {draw < 1 && <At x={fx} y={fy} r={-20}><div style={{ display: "flex", gap: 10 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 12, height: 180, borderRadius: 6, background: STEEL }} />)}</div></At>}
    <Tag tt={tt} at={4.4} x={960} y={950} txt="RIDGES = CRUST" col={AMB} size={58} />
  </>;
}} />;

// m18 · la gota de agua sobre la plancha a 375: baila, se parte y corre
export const HWaterDance: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fall = eio(tt, 0.5, 1.3), dance = Math.max(0, tt - 1.3);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, bottom: 0, background: "linear-gradient(#2e2e31,#111113)", transform: "perspective(900px) rotateX(58deg)", transformOrigin: "50% 0", boxShadow: "inset 0 40px 80px rgba(255,120,40,.12)", opacity: pop(tt, 0.05) }} />
    {fall < 1 && <At x={960} y={200 + fall * 450}><div style={{ width: 60, height: 80, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 35%,#fff,#9fd2f4 60%,#5aa2d6)" }} /></At>}
    {fall >= 1 && Array.from({ length: 7 }, (_, i) => {
      const a = i * 0.9, x = 960 + Math.cos(a) * dance * (60 + i * 30) + Math.sin(dance * 9 + i) * 14, y = 680 + Math.sin(a) * dance * 18 - Math.abs(Math.sin(dance * (8 + i))) * 26;
      return <div key={i} style={{ position: "absolute", left: x - 16, top: y - 12, width: 32 - i * 2, height: 24 - i, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#9fd2f4 60%,#4e8fc2)", opacity: cl(1 - dance / 6), boxShadow: "0 6px 6px rgba(0,0,0,.5)" }} />;
    })}
    <At x={960} y={340} s={pop(tt, 1.6, 8, 0.4)}><div style={{ fontWeight: 900, fontSize: 170, color: AMB, textShadow: "0 12px 40px rgba(0,0,0,.7)" }}>375°</div></At>
    <Tag tt={tt} at={2.4} x={960} y={470} txt="IT SHOULD DANCE" col={TX} size={50} />
  </>;
}} />;

// m19 · el pastel de pavo en corte: la tapa de abajo sale deslizándose y en su lugar aparece el dólar ahorrado
export const HDollarCrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const out = eio(tt, 1.6, 3.0), bill = pop(tt, 3.0, 6, 0.5);
  return <>
    <At x={900} y={560} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 900, height: 400, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 70, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(#e2a24c,#a8641e)", boxShadow: "inset 0 10px 20px rgba(255,220,150,.4)" }} />
        <div style={{ position: "absolute", left: 30, right: 30, top: 100, height: 200, background: "linear-gradient(#e9d6a6,#cfa86a)", overflow: "hidden" }}>{Array.from({ length: 20 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 71) % 800, top: 20 + (i * 43) % 150, width: 46, height: 36, borderRadius: 8, background: i % 3 ? "#f2e8d4" : "#e07d2a" }} />)}</div>
        <div style={{ position: "absolute", left: 30 + out * 1000, right: 30 - out * 1000, top: 300, height: 46, borderRadius: 8, background: "linear-gradient(#d8a058,#9a5e22)", opacity: 1 - out * 0.8 }} />
        <div style={{ position: "absolute", left: -10, right: -10, top: 300, height: 80, borderRadius: "0 0 40px 40px", border: "10px solid #c9ced4", borderTop: "none" }} />
      </div>
    </At>
    <At x={900} y={830} s={bill} r={-4}><div style={{ width: 420, height: 180, borderRadius: 10, background: "linear-gradient(135deg,#cfe0c3,#8fb07c)", border: "6px solid #e9f1e1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 110, color: "#2f4b28", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>$1</div></At>
    <Tag tt={tt} at={1.4} x={1540} y={420} txt="NO BOTTOM" col={RED} size={56} />
    <Tag tt={tt} at={3.4} x={1540} y={500} txt="SAVED A PLATE" col={AMB} size={48} />
  </>;
}} />;

// m20 · el pastel desde arriba: el cuchillo hace tres tajos y por cada uno sale el vapor
export const HSteamSlits: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const cuts = [1.0, 1.7, 2.4], k = cuts.filter((c) => tt > c + 0.4).length, kx = [820, 960, 1100];
  return <>
    <At x={960} y={600} s={pop(tt, 0.05, 4.5, 0.55)} rx={48}>
      <div style={{ width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle,#e3a656 0%,#c98a3a 60%,#a86a26 70%,#c9ced4 72%,#8a9099 80%)", boxShadow: "0 80px 140px rgba(0,0,0,.75)", position: "relative" }}>
        {cuts.map((c, i) => <div key={i} style={{ position: "absolute", left: 380 + (i - 1) * 140 - 10, top: 380 - 100, width: 20, height: 200 * eio(tt, c, c + 0.4), borderRadius: 10, background: "#5c2e0e" }} />)}
      </div>
    </At>
    {cuts.map((c, i) => i < k ? <Steam key={i} tt={tt - c} x={kx[i]} y={460} n={3} w={60} a={1.3} /> : null)}
    {k < 3 && tt > 0.8 && <At x={kx[Math.min(2, k)]} y={330 + 100 * (tt % 0.7)} r={20}><div style={{ width: 26, height: 260, borderRadius: "12px 12px 4px 4px", background: STEEL }} /></At>}
    <Tag tt={tt} at={2.9} x={960} y={950} txt="THREE SLITS" col={AMB} size={58} />
  </>;
}} />;

// m21 · la ventana del Blue Moon en enero del 77: la nieve se apila afuera, adentro 30 camioneros en la barra
export const HSnowIn: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const pile = eio(tt, 0.5, 7.5), n = Math.min(30, Math.floor(eio(tt, 1.2, 5.5) * 30.99));
  return <>
    <At x={960} y={500} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 1300, height: 640, borderRadius: 18, border: "26px solid #c9ced4", background: "linear-gradient(#202b3f,#4b5d7a)", position: "relative", overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.75)" }}>
        {Array.from({ length: 80 }, (_, i) => { const ph = (tt * (0.12 + (i % 5) * 0.03) + i / 80) % 1; return <div key={i} style={{ position: "absolute", left: (i * 157) % 1260 + 30 * Math.sin(tt + i), top: ph * 600, width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />; })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60 + 300 * pile, background: "linear-gradient(#ffffff,#d9e4f2)", borderRadius: "60% 40% 0 0 / 30% 20% 0 0" }} />
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: MARK, fontSize: 64, color: "rgba(255,90,74,.9)", transform: "scaleX(-1)", textShadow: "0 0 20px rgba(255,90,74,.7)" }}>OPEN</div>
      </div>
    </At>
    <div style={{ position: "absolute", left: 300, right: 300, top: 840, display: "flex", justifyContent: "space-between" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ width: 26, height: 44, borderRadius: "13px 13px 4px 4px", background: i < n ? ["#d8352a", "#2a62c9", "#6b5a3e", "#e6b422"][i % 4] : "transparent", transform: `translateY(${i < n ? 0 : 30}px)` }} />)}
    </div>
    <Tag tt={tt} at={1.4} x={960} y={950} txt={`${n} DRIVERS · 2 DAYS`} col={AMB} size={50} />
  </>;
}} />;

// m22 · la chuleta: a los 15 minutos se encoge dura; a los 45 se relaja tierna (dos esferas de reloj)
export const HChop45: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const a = eio(tt, 0.6, 2.4) * 15, b = eio(tt, 2.4, 6.2) * 45;
  const Dial: React.FC<{ m: number; x: number; col: string; chop: number }> = ({ m, x, col, chop }) => <At x={x} y={540} s={pop(tt, x < 900 ? 0.1 : 0.4)}>
    <div style={{ width: 460, height: 460, borderRadius: "50%", background: `conic-gradient(${col} ${(m / 60) * 360}deg, rgba(255,255,255,.08) 0)`, padding: 22, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(#2a2522,#151210)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 240 * chop, height: 150 * chop, borderRadius: "46% 54% 50% 50%", background: "linear-gradient(#b9764a,#7a3f1e)", boxShadow: "inset 0 -10px 20px rgba(0,0,0,.4)", transform: `rotate(${(1 - chop) * 30}deg)` }} />
      </div>
    </div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 80, color: col, marginTop: 10 }}>{Math.round(m)} MIN</div>
  </At>;
  return <>
    <Dial m={a} x={560} col={RED} chop={1 - 0.25 * eio(tt, 0.6, 2.4)} />
    <Dial m={b} x={1360} col={AMB} chop={0.75 + 0.3 * eio(tt, 2.4, 6.2)} />
    <Tag tt={tt} at={2.0} x={560} y={110} txt="TOUGH" col={RED} size={56} />
    <Tag tt={tt} at={5.4} x={1360} y={110} txt="TENDER" col={AMB} size={56} />
  </>;
}} />;

export const HC2: Record<string, React.FC<{ t: number; h: H }>> = { crock: HCrock, bubbles: HBubbles, beanMash: HBeanMash, postcard: HPostcard, forkRidges: HForkRidges, waterDance: HWaterDance,
  dollarCrust: HDollarCrust, steamSlits: HSteamSlits, snowIn: HSnowIn, chop45: HChop45 };
