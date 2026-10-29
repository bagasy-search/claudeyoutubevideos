// lou29 · componentes únicos 3/3
import React from "react";
import { H, Mode, Stage, Tag, cl, eio, TX, DIM, AMB, RED, MARK, HAND } from "./hkit";
import { At, STEEL, Steam, pop } from "./lou_h1";

const S: React.FC<{ t: number; h: H; f: (tt: number) => React.ReactNode }> = ({ t, h, f }) => <Stage t={t} h={h} mode={(h.mode as Mode) ?? "iris"}>{f}</Stage>;
const Plate: React.FC<{ d: number; children?: React.ReactNode }> = ({ d, children }) =>
  <div style={{ width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle,#fffdf8 55%,#e6dfd1 57%,#fffaf1 66%,#cfc6b6)", boxShadow: "0 40px 80px rgba(0,0,0,.65)", position: "relative" }}>{children}</div>;

// m23 · la sartén desde arriba: cubos amontonados largan vapor y quedan grises; separados se doran
export const HCrowdPan: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const sp = eio(tt, 3.4, 4.6), sear = eio(tt, 4.6, 8);
  return <>
    <At x={960} y={560} s={pop(tt, 0.05, 4.5, 0.55)} rx={44}>
      <div style={{ width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle,#2b2b2e 60%,#18181a 68%,#3a3a3e 70%,#0e0e10)", boxShadow: "0 80px 140px rgba(0,0,0,.8)", position: "relative" }}>
        {Array.from({ length: 12 }, (_, i) => {
          const cx = i % 4, cy = Math.floor(i / 4), g = 1 + 0.7 * sp, x = 410 + (cx - 1.5) * 96 * g, y = 410 + (cy - 1) * 96 * g;
          const col = sp < 0.5 ? (tt > 1.2 ? "#8c7a74" : "#b9534a") : `rgb(${150 - 70 * sear},${80 - 40 * sear},${50 - 30 * sear})`;
          return <div key={i} style={{ position: "absolute", left: x - 46, top: y - 46, width: 92, height: 92, borderRadius: 16, background: col, boxShadow: "inset 0 -10px 18px rgba(0,0,0,.35)", transform: `scale(${pop(tt, 0.3 + i * 0.05, 9, 0.4)})` }} />;
        })}
      </div>
    </At>
    {sp < 0.6 && <Steam tt={tt} x={960} y={420} n={7} w={420} a={1.4 * cl(tt - 1.0) * (1 - sp)} />}
    <Tag tt={tt} at={1.6} x={1580} y={420} txt="TOUCHING = STEAM" col={RED} size={46} />
    <Tag tt={tt} at={4.8} x={1580} y={500} txt="SPACED = BROWN" col={AMB} size={46} />
  </>;
}} />;

// m24 · el vaso de jugo de Gus cortando la masa: girado sella el borde y el bizcocho no sube; derecho sube alto
export const HJuiceGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const c1 = eio(tt, 0.8, 1.6) * (1 - eio(tt, 2.0, 2.6)), c2 = eio(tt, 2.8, 3.4) * (1 - eio(tt, 3.6, 4.0)), rise = eio(tt, 4.4, 6.6);
  const Glass: React.FC<{ x: number; dn: number; tw: number }> = ({ x, dn, tw }) => <At x={x} y={300 + dn * 210} r={tw}><div style={{ width: 200, height: 300, borderRadius: "10px 10px 18px 18px", background: "linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.4) 30%,rgba(255,255,255,.08) 60%,rgba(255,255,255,.3))", border: "4px solid rgba(255,255,255,.5)" }} /></At>;
  const Bis: React.FC<{ x: number; hgt: number }> = ({ x, hgt }) => <div style={{ position: "absolute", left: x - 100, top: 720 - hgt, width: 200, height: hgt, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(#e8b062,#f6e3bf 40%,#f4e7cc)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />;
  return <>
    <div style={{ position: "absolute", left: 260, right: 260, top: 700, height: 70, borderRadius: 16, background: "linear-gradient(#f4ecda,#d8c9a8)", opacity: pop(tt, 0.05) }} />
    <Bis x={600} hgt={60 + 30 * rise} /><Bis x={1320} hgt={60 + 140 * rise} />
    <Glass x={600} dn={c1} tw={c1 * 40 * Math.sin(tt * 6)} /><Glass x={1320} dn={c2} tw={0} />
    <Tag tt={tt} at={1.6} x={600} y={860} txt="TWISTED" col={RED} size={56} />
    <Tag tt={tt} at={3.6} x={1320} y={860} txt="STRAIGHT DOWN" col={AMB} size={56} />
  </>;
}} />;

// m25 · doble pasada: harina → suero → harina, y después la rejilla con el reloj de 10 minutos
export const HDoubleDip: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const B = [{ x: 420, c: "#f6f2ea" }, { x: 820, c: "#f3efe4" }, { x: 1220, c: "#f6f2ea" }];
  const hop = eio(tt, 0.8, 3.8) * 3, f = hop % 1, i = Math.min(3, Math.floor(hop)), rest = eio(tt, 4.0, 8.5);
  const x = hop < 3 ? 420 + hop * 400 : 1620, y = hop < 3 ? 520 - Math.sin(f * Math.PI) * 200 : 520;
  return <>
    {B.map((b, k) => <At key={k} x={b.x} y={600} s={pop(tt, 0.1 + k * 0.15)} rx={56}><div style={{ width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle,${k === 1 ? "#fbf7ec" : "#ffffff"} 55%,#cfc6b6 58%,#e9e2d4 70%)`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} /></At>)}
    {B.map((b, k) => <Tag key={"l" + k} tt={tt} at={0.4 + k * 0.3} x={b.x} y={800} txt={k === 1 ? "BUTTERMILK" : "FLOUR"} col={i === k ? AMB : DIM} size={40} />)}
    <At x={1620} y={640} s={pop(tt, 3.6)}><div style={{ width: 300, height: 30, background: "repeating-linear-gradient(90deg,#c9ced4 0 8px,transparent 8px 28px)", borderTop: "6px solid #c9ced4", borderBottom: "6px solid #c9ced4" }} /></At>
    <At x={x} y={y} r={Math.sin(f * Math.PI) * 25 * (hop < 3 ? 1 : 0)}><div style={{ width: 210, height: 130, borderRadius: "46% 54% 48% 52%", background: i >= 2 ? "linear-gradient(#efe6d2,#d8c7a2)" : "linear-gradient(#c08a6c,#92553a)", boxShadow: "0 18px 26px rgba(0,0,0,.45)" }} /></At>
    <At x={1620} y={330} s={pop(tt, 4.0, 7, 0.45)}><div style={{ width: 200, height: 200, borderRadius: "50%", background: `conic-gradient(${AMB} ${rest * 360}deg, rgba(255,255,255,.1) 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 160, height: 160, borderRadius: "50%", background: "#151210", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64, color: AMB }}>{Math.round(rest * 10)}′</div></div></At>
    <Tag tt={tt} at={4.4} x={1620} y={170} txt="REST 10" col={TX} size={46} />
  </>;
}} />;

// m26 · el plato de Earl armado en capas que caen: pan, medallón, papas y la salsa que lo tapa todo
export const HStackPlate: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const L: [number, React.ReactNode][] = [
    [0.8, <div style={{ width: 330, height: 300, borderRadius: "40px 40px 16px 16px", background: "linear-gradient(#f9f1de,#e8d6b0)", border: "10px solid #c8954e" }} />],
    [1.8, <div style={{ width: 300, height: 240, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#8a4a26,#4a2210)" }} />],
    [2.8, <div style={{ width: 420, height: 200, position: "relative" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 230 + (i * 23) % 180, top: (i * 37) % 160, width: 140, height: 28, borderRadius: 8, background: "linear-gradient(#f2c25c,#d48f24)", transform: `rotate(${(i * 41) % 90 - 45}deg)` }} />)}</div>],
  ];
  const gravy = eio(tt, 3.8, 6.0);
  return <>
    <At x={960} y={600} s={pop(tt, 0.05, 4.5, 0.55)} rx={46}><Plate d={820}>
      {L.map(([a, el], i) => { const s = pop(tt, a, 8, 0.42); return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-${i === 2 ? 30 : 50}%,-50%) translateY(${(1 - s) * -400}px)`, opacity: cl(s * 3) }}>{el}</div>; })}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 640 * gravy, height: 520 * gravy, transform: "translate(-50%,-50%)", borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 40% 35%,rgba(140,80,40,.95),rgba(80,40,16,.95))", boxShadow: "inset 0 10px 30px rgba(255,200,140,.25)" }} />
    </Plate></At>
    {gravy > 0 && gravy < 1 && <div style={{ position: "absolute", left: 950, top: 0, width: 26, height: 560, background: "linear-gradient(#6b3414,#8a4a20)", borderRadius: 13, opacity: 1 - gravy }} />}
    <Tag tt={tt} at={1.0} x={1560} y={360} txt="BREAD" col={TX} size={46} />
    <Tag tt={tt} at={2.0} x={1560} y={430} txt="PATTY" col={TX} size={46} />
    <Tag tt={tt} at={3.0} x={1560} y={500} txt="FRIES" col={TX} size={46} />
    <Tag tt={tt} at={4.4} x={1560} y={590} txt="GRAVY OVER ALL" col={AMB} size={50} />
  </>;
}} />;

// m27 · la olla de los jugos: cada hora la espátula de Gus empuja lo de la plancha y el nivel sube hasta las 2
export const HDrippings: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hrs = eio(tt, 0.8, 7.0) * 4, k = Math.floor(hrs), f = hrs % 1, push = Math.sin(cl(f * 2) * Math.PI);
  const HR = ["10 PM", "11 PM", "MIDNIGHT", "1 AM", "2 AM"];
  return <>
    <div style={{ position: "absolute", left: 160, width: 1000, top: 620, height: 150, background: "linear-gradient(#3a3a3e,#151517)", borderRadius: 10, transform: "perspective(900px) rotateX(40deg)", boxShadow: "0 40px 80px rgba(0,0,0,.7)", opacity: pop(tt, 0.05) }} />
    {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: 260 + i * 210, top: 600, width: 150, height: 60, borderRadius: "50%", background: "radial-gradient(#7a3a1c,#3e1a0b)", opacity: pop(tt, 0.3 + i * 0.1) }} />)}
    <div style={{ position: "absolute", left: 220 + push * 820, top: 650, width: 40, height: 110, borderRadius: 6, background: STEEL, transform: "rotate(-14deg)" }} />
    {push > 0.2 && <div style={{ position: "absolute", left: 180 + push * 820, top: 690, width: 60, height: 22, borderRadius: 11, background: "#5a2a10", opacity: push }} />}
    <At x={1460} y={680} s={pop(tt, 0.4)}>
      <div style={{ width: 380, height: 360, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, top: 30, background: STEEL, borderRadius: "0 0 40px 40px", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${18 + 18 * hrs}%`, background: "linear-gradient(#6b3414,#3c180a)" }} /></div>
        <div style={{ position: "absolute", left: -6, right: -6, top: 10, height: 44, borderRadius: "50%", background: "radial-gradient(#3c180a,#c9ced4 66%,#7b8088)" }} />
      </div>
    </At>
    <At x={1460} y={360} s={pop(tt, 0.8, 7, 0.45)}><div style={{ fontWeight: 900, fontSize: 96, color: k >= 4 ? AMB : TX, textShadow: "0 10px 30px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{HR[Math.min(4, k + (f > 0.6 ? 1 : 0))]}</div></At>
    <Tag tt={tt} at={1.4} x={660} y={480} txt="EVERY HOUR" col={DIM} size={46} />
  </>;
}} />;

// m27-28 · media taza de café de la jarra cae en la salsa y la oscurece sin que sepa a café
export const HCoffeeGravy: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const fill = eio(tt, 0.8, 2.4), tilt = eio(tt, 2.8, 3.6), dark = eio(tt, 3.4, 5.6);
  return <>
    <At x={560} y={380} s={pop(tt, 0.05)} r={-20 * eio(tt, 0.6, 1.0) * (1 - eio(tt, 2.4, 2.6))}><div style={{ width: 230, height: 300, position: "relative" }}><div style={{ position: "absolute", left: 0, right: 0, top: 60, bottom: 0, borderRadius: "40% 40% 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.18),rgba(60,30,10,.85) 20%,#2a1306 80%,rgba(255,255,255,.2))", border: "4px solid rgba(255,255,255,.45)" }} /><div style={{ position: "absolute", left: 50, right: 50, top: 0, height: 70, background: "#1b1b1d", borderRadius: "16px 16px 0 0" }} /></div></At>
    <At x={980} y={470 + tilt * 40} s={pop(tt, 0.4)} r={tilt * 70}><div style={{ width: 220, height: 220, borderRadius: "10px 10px 26px 26px", border: "6px solid rgba(255,255,255,.6)", background: "rgba(255,255,255,.08)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${50 * fill * (1 - tilt)}%`, background: "#2a1306" }} />
      <div style={{ position: "absolute", right: 12, top: "50%", width: 50, height: 4, background: AMB }} />
    </div></At>
    <At x={1360} y={740} s={pop(tt, 0.2)} rx={50}><div style={{ width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,#232325 64%,#3a3a3e 66%,#101012)", padding: 70 }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,rgb(${190 - 90 * dark},${130 - 70 * dark},${80 - 50 * dark}),rgb(${120 - 60 * dark},${70 - 40 * dark},${40 - 26 * dark}))` }} /></div></At>
    {tilt > 0.6 && tilt < 1 && <div style={{ position: "absolute", left: 1090, top: 540, width: 18, height: 220, background: "#2a1306", borderRadius: 9 }} />}
    <Tag tt={tt} at={1.6} x={980} y={260} txt="½ CUP COFFEE" col={AMB} size={58} />
    <Tag tt={tt} at={4.8} x={1360} y={420} txt="DARK, NOT BITTER" col={TX} size={46} />
  </>;
}} />;

// m29 · la cámara frigorífica a las 10 de la noche: lo que sobró del día decide el plato
export const HWalkIn: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const R = [{ a: "ROAST", b: "COTTAGE PIE", c: "#8a4a26" }, { a: "CHILI", b: "CHILI MAC", c: "#9a3a1e" }, { a: "TURKEY", b: "POT PIE", c: "#d8b07a" }];
  const door = eio(tt, 0.3, 1.4);
  return <>
    <At x={960} y={540} s={pop(tt, 0.05, 4.5, 0.6)}>
      <div style={{ width: 1400, height: 760, borderRadius: 16, background: "linear-gradient(#cfe3ee,#9fb8c6)", position: "relative", boxShadow: "0 60px 120px rgba(0,0,0,.75), inset 0 0 120px rgba(255,255,255,.4)", overflow: "hidden" }}>
        {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 40, right: 40, top: 230 + r * 220, height: 14, background: STEEL }} />)}
        {R.map((x, i) => {
          const s = pop(tt, 1.4 + i * 1.3, 7, 0.45), m = eio(tt, 2.2 + i * 1.3, 3.0 + i * 1.3);
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 120, top: 120 + i * 220, width: 220, height: 110, borderRadius: 16, background: `linear-gradient(${x.c},#2a1408)`, transform: `scale(${s})`, boxShadow: "0 16px 24px rgba(0,0,0,.4)" }} />
            <div style={{ position: "absolute", left: 120, top: 80 + i * 220, fontWeight: 900, fontSize: 34, color: "#24323c", opacity: s }}>{x.a}</div>
            <div style={{ position: "absolute", left: 380, top: 172 + i * 220, height: 8, width: 520 * m, borderRadius: 4, background: AMB }} />
            <div style={{ position: "absolute", left: 920, top: 110 + i * 220, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,#fffdf8 55%,#e6dfd1 57%,#cfc6b6)", transform: `scale(${pop(tt, 3.0 + i * 1.3, 8, 0.4)})` }}><div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: x.c }} /></div>
            <div style={{ position: "absolute", left: 1090, top: 160 + i * 220, fontWeight: 900, fontSize: 40, color: "#24323c", opacity: cl(m * 2), whiteSpace: "nowrap" }}>{x.b}</div>
          </React.Fragment>;
        })}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#8a9099,#c9ced4,#7b8088)", transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-100 * door}deg)`, opacity: 1 - door * 0.2 }} />
      </div>
    </At>
  </>;
}} />;

// m30 · el reloj de pared del turno: la aguja barre de las 10 de la noche a las 6 de la mañana, los picos se encienden
export const HNightClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const hr = 22 + 8 * eio(tt, 0.6, 7.8), a = ((hr % 12) / 12) * 360, mins = ((hr % 1) * 360);
  const M: [number, string][] = [[24, "RUSH"], [26, "BISCUITS"], [28, "RUSH"], [30, "HOME"]];
  return <>
    <At x={900} y={540} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fffaf0,#e3dac7 70%)", border: "26px solid #c9ced4", boxShadow: "0 60px 120px rgba(0,0,0,.75), 0 0 80px rgba(255,90,74,.25)", position: "relative" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", transform: `rotate(${i * 30}deg) translateY(-300px) rotate(${-i * 30}deg) translate(-50%,-50%)`, fontWeight: 900, fontSize: 52, color: "#2a2522" }}>{i === 0 ? 12 : i}</div>)}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 18, height: 200, background: "#1a1716", borderRadius: 9, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${a}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 280, background: RED, borderRadius: 5, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${mins}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 40, borderRadius: "50%", background: "#1a1716", transform: "translate(-50%,-50%)" }} />
      </div>
    </At>
    {M.map(([hh, txt], i) => <Tag key={i} tt={tt} at={0.6 + 7.2 * (hh - 22) / 8} x={1530} y={300 + i * 130} txt={`${hh % 12 === 0 ? 12 : hh % 12} · ${txt}`} col={hr >= hh ? AMB : DIM} size={50} anchor="l" />)}
  </>;
}} />;

// m30-31 · una olla, tres platos: la olla del medio alimenta el guiso, la salsa y el caldo
export const HOnePot: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const P: [number, number, string, string][] = [[420, 760, "STEW", "#8a4a26"], [960, 860, "GRAVY", "#6b3414"], [1500, 760, "STOCK", "#c9a46a"]];
  return <>
    <At x={960} y={360} s={pop(tt, 0.05, 4.5, 0.55)}><div style={{ width: 420, height: 300, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 0, background: STEEL, borderRadius: "0 0 60px 60px", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: -6, right: -6, top: 10, height: 56, borderRadius: "50%", background: "radial-gradient(#7a3a1c,#2a1408 60%,#c9ced4 62%,#7b8088)" }} />
      <Steam tt={tt} x={210} y={10} n={4} w={260} />
    </div></At>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {P.map(([x, y], i) => { const d = eio(tt, 1.0 + i * 0.8, 2.2 + i * 0.8); return <path key={i} d={`M960 520 Q ${(960 + x) / 2} ${520 + 40} ${x} ${y - 120}`} fill="none" stroke={AMB} strokeWidth={10} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - d)} opacity={0.8} />; })}
    </svg>
    {P.map(([x, y, n, c], i) => <React.Fragment key={i}><At x={x} y={y} s={pop(tt, 2.0 + i * 0.8, 8, 0.4)} rx={50}><Plate d={300}><div style={{ position: "absolute", inset: 80, borderRadius: "50%", background: c }} /></Plate></At><Tag tt={tt} at={2.3 + i * 0.8} x={x} y={y + 140} txt={n} col={TX} size={44} /></React.Fragment>)}
    <Tag tt={tt} at={1.0} x={960} y={110} txt="ONE POT" col={AMB} size={66} />
  </>;
}} />;

// m31 · los platos en el horno a 200 grados: se calientan (brillan) y la comida dura caliente el doble
export const HWarmPlates: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const door = eio(tt, 0.4, 1.4), warm = eio(tt, 1.6, 4.6);
  return <>
    <At x={900} y={560} s={pop(tt, 0.05, 4.5, 0.55)}>
      <div style={{ width: 1000, height: 640, borderRadius: 24, background: "linear-gradient(#3a3a3e,#1a1a1c)", padding: 40, boxShadow: "0 60px 120px rgba(0,0,0,.75)", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 14, background: `radial-gradient(ellipse at 50% 60%,rgba(255,${140 + 40 * warm},60,${0.25 + 0.5 * warm}),#0f0f10 70%)`, position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 220, right: 220, bottom: 80 + i * 26, height: 24, borderRadius: "50%", background: `linear-gradient(#fffaf1,#cfc6b6)`, boxShadow: `0 0 ${30 * warm}px rgba(255,170,80,${0.6 * warm})`, transform: `scale(${pop(tt, 1.0 + i * 0.12, 9, 0.45)})` }} />)}
          <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 10, background: `rgba(255,${90 + 60 * warm},40,${0.4 + 0.6 * warm})`, borderRadius: 5, boxShadow: `0 0 30px rgba(255,120,40,${warm})` }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%", borderRadius: 24, background: "linear-gradient(#5a5a60,#2a2a2e)", transformOrigin: "50% 100%", transform: `perspective(1600px) rotateX(${88 * door}deg)` }} />
      </div>
    </At>
    <At x={1600} y={420} s={pop(tt, 1.8, 7, 0.45)}><div style={{ fontWeight: 900, fontSize: 150, color: AMB, textShadow: "0 12px 40px rgba(0,0,0,.7)" }}>200°</div></At>
    <Tag tt={tt} at={2.6} x={1600} y={540} txt="5 MINUTES" col={TX} size={52} />
    <Tag tt={tt} at={4.4} x={1600} y={620} txt="HOT TWICE AS LONG" col={DIM} size={36} />
  </>;
}} />;

// m32 · el repaso en el riel de comandas: las 15 comandas se cuelgan de a una con su número y su precio
export const HTicketRail: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const IT = (h.items as { n: number; price: string; at: number }[] | undefined) ?? [];
  const slide = 1400 * eio(tt, 6, (h.out - h.at) - 0.5);
  return <>
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 30, background: STEEL, borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.6)", opacity: pop(tt, 0.05) }} />
    {IT.map((it, i) => {
      const s = pop(tt, Math.max(0.2, it.at - h.at), 8, 0.42), sw = 4 * Math.sin(tt * 1.4 + i) * (1 - cl(tt - (it.at - h.at) - 2) * 0.6);
      return <div key={i} style={{ position: "absolute", left: 120 + i * 118 - slide * 0, top: 320, width: 108, height: 260, transformOrigin: "50% 0", transform: `translateY(${(1 - s) * -160}px) rotate(${sw}deg)`, opacity: cl(s * 3), background: "linear-gradient(#fffdf6,#efe7d4)", borderRadius: "4px 4px 8px 8px", boxShadow: "0 18px 30px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
        <div style={{ fontFamily: MARK, fontSize: 48, color: "#26324f" }}>{it.n}</div>
        <div style={{ width: 70, height: 2, background: "rgba(40,50,80,.3)", margin: "12px 0" }} />
        <div style={{ fontFamily: HAND, fontSize: 44, color: "#b3241b" }}>{it.price}</div>
      </div>;
    })}
    <Tag tt={tt} at={0.6} x={960} y={160} txt="ALL 15" col={AMB} size={66} />
  </>;
}} />;

// m33 · la balanza de dos platos: el de 1972 a 45 centavos y el de hoy, en tu cocina, por unos 2 dólares
export const HTwoDollar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const tilt = 9 * eio(tt, 1.4, 3.0) - 3 * Math.sin(tt * 1.2) * cl(tt - 3) * 0.3;
  const Pan: React.FC<{ x: number; dy: number; lab: string; v: string; col: string }> = ({ x, dy, lab, v, col }) => <div style={{ position: "absolute", left: x - 200, top: 520 + dy }}>
    <div style={{ width: 4, height: 120, background: "#c9ced4", margin: "0 auto" }} />
    <div style={{ width: 400, height: 40, borderRadius: "0 0 200px 200px", background: STEEL }} />
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40, color: DIM, marginTop: 20 }}>{lab}</div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 110, color: col }}>{v}</div>
  </div>;
  const dx = 380, dy = Math.sin((tilt * Math.PI) / 180) * dx;
  return <>
    <At x={960} y={540} s={pop(tt, 0.05, 4.5, 0.55)}><div style={{ position: "relative", width: 1920, height: 1080 }}>
      <div style={{ position: "absolute", left: 950, top: 500, width: 20, height: 420, background: STEEL }} />
      <div style={{ position: "absolute", left: 800, top: 900, width: 320, height: 40, borderRadius: 20, background: STEEL }} />
      <div style={{ position: "absolute", left: 960 - dx, top: 500, width: dx * 2, height: 16, borderRadius: 8, background: STEEL, transform: `rotate(${tilt}deg)` }} />
      <Pan x={960 - dx} dy={-dy - 12} lab="1972" v="45¢" col={TX} />
      <Pan x={960 + dx} dy={dy - 12} lab="TONIGHT" v="$2" col={AMB} />
    </div></At>
  </>;
}} />;


// m3 · el bowl de chili mac desde arriba: el cheddar rallado cae en hilos y después la cebolla cruda, como lo pedían los choferes
export const HCheddar: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => <>
  <At x={960} y={580} s={pop(tt, 0.05, 4.5, 0.55)} rx={42}><Plate d={760}><div style={{ position: "absolute", inset: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#b0452a,#6e2414)", overflow: "hidden" }}>
    {Array.from({ length: 34 }, (_, i) => { const a = 0.6 + i * 0.07, s = pop(tt, a, 9, 0.5); return <div key={i} style={{ position: "absolute", left: 60 + (i * 79) % 400, top: 60 + (i * 131) % 400, width: 90, height: 12, borderRadius: 6, background: "linear-gradient(#ffcf4a,#e79a16)", transform: `translateY(${(1 - s) * -500}px) rotate(${(i * 57) % 180}deg)`, opacity: cl(s * 3) }} />; })}
    {Array.from({ length: 14 }, (_, i) => { const s = pop(tt, 3.4 + i * 0.09, 9, 0.5); return <div key={"o" + i} style={{ position: "absolute", left: 110 + (i * 97) % 300, top: 110 + (i * 61) % 300, width: 30, height: 30, borderRadius: 6, background: "rgba(250,248,240,.95)", transform: `translateY(${(1 - s) * -500}px) rotate(${i * 33}deg)`, opacity: cl(s * 3) }} />; })}
  </div></Plate></At>
  <Tag tt={tt} at={1.2} x={1560} y={460} txt="SHARP CHEDDAR" col={AMB} size={50} />
  <Tag tt={tt} at={3.6} x={1560} y={540} txt="RAW ONION" col={TX} size={46} />
</>} />;

// m12 · la milanesa de perfil: la salsa ENCIMA ablanda la costra en 30 segundos; DEBAJO la costra queda crocante
export const HGravyUnder: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const pour = eio(tt, 0.8, 2.0), soggy = eio(tt, 2.0, 4.5), pool = eio(tt, 2.6, 3.8);
  const Cut: React.FC<{ x: number; top: boolean }> = ({ x, top }) => <At x={x} y={600} s={pop(tt, top ? 0.1 : 0.4)}>
    <div style={{ position: "relative", width: 480, height: 260 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 30, borderRadius: "50%", background: "linear-gradient(#fffaf1,#cfc6b6)" }} />
      {!top && <div style={{ position: "absolute", left: 20 - 30 * pool, right: 20 - 30 * pool, bottom: 14, height: 34 * pool, borderRadius: "50%", background: "#b8432a" }} />}
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 30, height: 90, borderRadius: "46% 54% 30% 30%", background: top ? `linear-gradient(rgb(${200 - 60 * soggy},${140 - 40 * soggy},${70 - 10 * soggy}),#8a5a2c)` : "linear-gradient(#e2a24c,#a8641e)", filter: top && soggy > 0.4 ? "blur(1.5px)" : undefined, transform: top ? `scaleY(${1 - 0.25 * soggy})` : undefined, transformOrigin: "50% 100%" }} />
      {top && <div style={{ position: "absolute", left: 90, right: 90, bottom: 100 - 25 * soggy, height: 40 * pour, borderRadius: "50%", background: "#b8432a" }} />}
    </div>
  </At>;
  return <><Cut x={560} top /><Cut x={1360} top={false} />
    <Tag tt={tt} at={2.2} x={560} y={820} txt="ON TOP: SOGGY" col={RED} size={52} />
    <Tag tt={tt} at={3.4} x={1360} y={820} txt="UNDER: CRISP" col={AMB} size={52} />
  </>;
}} />;

// m28 · la promesa a Earl: la hoja del almanaque pasa de 1985 a hoy y la olla de la salsa sigue humeando
export const HPromise: React.FC<{ t: number; h: H }> = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const yr = 1985 + Math.floor(eio(tt, 0.9, 6.0) * 40.99), flip = (tt * 7) % 1;
  return <>
    <At x={720} y={520} s={pop(tt, 0.05, 4.5, 0.55)}><div style={{ width: 480, height: 560, borderRadius: 12, background: "linear-gradient(#fffdf6,#e9e1cf)", boxShadow: "0 50px 100px rgba(0,0,0,.7)", position: "relative", overflow: "hidden" }}>
      <div style={{ height: 120, background: "#b3241b", display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>{[0, 1].map((i) => <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "#1a1716" }} />)}</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 150, color: "#1d2440", marginTop: 90 }}>{yr}</div>
      {tt < 6.0 && <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 440, background: "linear-gradient(#fffdf6,#ddd3bd)", transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${flip * 160}deg)`, opacity: 1 - flip }} />}
    </div></At>
    <At x={1340} y={640} s={pop(tt, 0.5)}><div style={{ width: 380, height: 300, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, bottom: 0, background: STEEL, borderRadius: "0 0 50px 50px", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: -6, right: -6, top: 10, height: 50, borderRadius: "50%", background: "radial-gradient(#6b3414,#2a1408 60%,#c9ced4 62%,#7b8088)" }} />
      <Steam tt={tt} x={190} y={10} n={4} w={240} />
    </div></At>
    <Tag tt={tt} at={2.0} x={1340} y={360} txt="EARL, I WILL" col={AMB} size={58} />
    <Tag tt={tt} at={5.4} x={1340} y={880} txt="40 YEARS" col={TX} size={52} />
  </>;
}} />;

export const HC3: Record<string, React.FC<{ t: number; h: H }>> = { crowdPan: HCrowdPan, juiceGlass: HJuiceGlass, doubleDip: HDoubleDip, stackPlate: HStackPlate, drippings: HDrippings,
  coffeeGravy: HCoffeeGravy, walkIn: HWalkIn, nightClock: HNightClock, onePot: HOnePot, warmPlates: HWarmPlates, ticketRail: HTicketRail, twoDollar: HTwoDollar, cheddar: HCheddar, gravyUnder: HGravyUnder, promise: HPromise };
