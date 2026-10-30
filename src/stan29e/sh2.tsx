// stan29e · componentes únicos 18-33 (min 9-22).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const RAW = [236, 196, 180], CRUST = [214, 150, 60];
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * cl(k))).join(",")})`;
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;
const SV: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wavy = (x0: number, w: number, y: number, amp: number, n: number, ph: number) => `M${x0} ${y} ` + Array.from({ length: n }, (_, i) => { const xa = x0 + (i + 0.5) * (w / n), xb = x0 + (i + 1) * (w / n); return `Q${xa} ${y - amp * (1 + 0.3 * Math.sin(ph + i))} ${xb} ${y}`; }).join(" ");

// ---- 9:28 · LA GALLETA: la costra prensada se vuelve una plancha plana que se quiebra como cracker ----
export const HCracker: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const br = eio(tt, 1.6, 2.4);
  return <>
    {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: d < 0 ? 560 : 960, top: 420 + 60 * br, width: 400, height: 260, background: "linear-gradient(180deg,#e2b46a,#c48a3a)", backgroundImage: "radial-gradient(circle, rgba(120,70,20,.6) 4px, transparent 5px)", backgroundSize: "60px 60px", clipPath: d < 0 ? "polygon(0 0,100% 0,88% 30%,100% 55%,84% 100%,0 100%)" : "polygon(0 0,100% 0,100% 100%,-16% 100%,0 55%,-12% 30%)", transform: `rotate(${d * 12 * br}deg) translateX(${d * 40 * br}px)`, boxShadow: sh(20) }} />)}
    {Array.from({ length: 10 }, (_, i) => { const k = cl((tt - 1.6) * 1.5); return <div key={i} style={{ position: "absolute", left: 940 + (rnd(i) - 0.5) * 120, top: 600 + k * k * 300 * (0.6 + rnd(i + 1)), width: 14, height: 10, background: "#d9a85a", opacity: k > 0 && k < 1 ? 1 : 0 }} />; })}
    <Tag tt={tt} at={0.4} x={960} y={240} txt="PRESSED = HARD AND FLAT" col={RED} size={48} />
    <Tag tt={tt} at={2.6} x={960} y={900} txt="LIKE EATING A PLATE" col={TX} size={52} />
  </>;
}}</Stage>;

// ---- 9:56 · EL CORTE TRANSVERSAL: carne, huevo y miga en capas; entre el huevo y la miga aparecen burbujas de aire ----
export const HAirgap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const a = eio(tt, 0.8, 2.8);
  return <>
    <Head tt={tt} kick="LOOSE CRUMBS" title="A LITTLE AIR IN BETWEEN" />
    <div style={{ position: "absolute", left: 360, top: 600, width: 1200, height: 120, background: `linear-gradient(180deg, rgb(${RAW.join(",")}), #d39a8c)`, borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 360, top: 580, width: 1200, height: 22, background: "#f6d35a", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 360, top: 520 - 60 * a, width: 1200, height: 50, borderRadius: 10, background: "#d9a85a", backgroundImage: "radial-gradient(circle,#b97a2a 3px,transparent 4px)", backgroundSize: "18px 18px" }} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 400 + i * 72, top: 580 - 50 * a + Math.sin(tt * 3 + i) * 4, width: 46 * a, height: 34 * a, borderRadius: "50%", border: "3px solid rgba(220,240,255,.8)", background: "rgba(220,240,255,.15)" }} />)}
    <Tag tt={tt} at={2.6} x={1600} y={420} txt="← THIS PUFFS" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 10:28 · EL CARTEL DE TOMMY: veinte años después se enciende el letrero de su propia carnicería ----
export const HSign: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#0e1320,#05070b)">{(tt) => <>
  <div style={{ position: "absolute", left: 960, top: 200, transform: "translateX(-50%)", fontWeight: 900, fontSize: 48, color: DIM }}>{tt < 1.2 ? "1986" : tt < 1.8 ? "1996" : "2006"}</div>
  <div style={{ position: "absolute", left: 460, top: 340, width: 1000, height: 240, borderRadius: 20, background: "#1b1d22", border: "10px solid #2c2f35", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
    {"TOMMY'S MEATS".split("").map((ch, i) => { const on = tt > 1.9 + i * 0.07; return <span key={i} style={{ fontWeight: 900, fontSize: 110, color: on ? "#fff2d6" : "#3a3d44", textShadow: on ? "0 0 20px #ffb35a, 0 0 50px #ff8a2a" : "none" }}>{ch}</span>; })}
  </div>
  <Tag tt={tt} at={3.0} x={960} y={760} txt="«I STILL SHAKE TOO»" col={AMB} size={56} />
</>}</Stage>;

// ---- 10:50 · LA REGLITA EN EL ACEITE: el nivel sube por una regla hasta ½ pulgada y la milanesa despega del fondo ----
export const HDepth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lv = eio(tt, 0.3, 2.2), fl = eio(tt, 2.0, 3.0);
  return <>
    <div style={{ position: "absolute", left: 460, top: 400, width: 1000, height: 420, borderRadius: "0 0 50px 50px", border: "26px solid #1c1c1e", borderTop: "none", overflow: "hidden", background: "#0b0b0c" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${55 * lv}%`, background: "linear-gradient(180deg,rgba(242,196,107,.85),rgba(200,130,40,.9))" }} />
      <div style={{ position: "absolute", left: 200, bottom: 10 + 60 * fl, width: 560, height: 40, borderRadius: 20, background: `rgb(${CRUST.join(",")})`, transform: `rotate(${Math.sin(tt * 3) * 2 * fl}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 1500, top: 400, width: 60, height: 400, background: "#f3efe6", borderRadius: 6 }}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 400 - i * 50, width: i % 2 ? 24 : 44, height: 4, background: "#1a1410" }} />)}
      <div style={{ position: "absolute", left: -40, top: 400 - 220 * lv, width: 140, height: 6, background: AMB }} />
    </div>
    <Tag tt={tt} at={2.2} x={1580} y={330} txt="½ INCH" col={AMB} size={52} />
    <Tag tt={tt} at={2.8} x={960} y={920} txt="THE CUTLET FLOATS A LITTLE" col={TX} size={44} />
  </>;
}}</Stage>;

// ---- 11:53 · LA TAPA QUE APAGA: una llama sube, baja la tapa, la perilla gira a OFF y la llama se ahoga ----
export const HSnuff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lid = eio(tt, 1.0, 1.6), off = eio(tt, 1.8, 2.4), fl = (1 - cl((tt - 1.5) * 2));
  return <>
    <div style={{ position: "absolute", left: 660, top: 640, width: 600, height: 140, borderRadius: "0 0 80px 80px", background: "#1c1c1e" }} />
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 720 + i * 80, top: 640 - (180 + 60 * Math.sin(tt * 9 + i)) * fl, width: 70, height: (180 + 60 * Math.sin(tt * 9 + i)) * fl, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "linear-gradient(0deg,#ff5a1a,#ffd36a)", opacity: fl }} />)}
    <div style={{ position: "absolute", left: 640, top: 160 + 440 * lid, width: 640, height: 60, borderRadius: "320px 320px 10px 10px", background: "linear-gradient(180deg,#c9d0d8,#7a838c)" }} />
    <div style={{ position: "absolute", left: 1420, top: 680, width: 120, height: 120, borderRadius: 60, background: "#2c2f35", border: "6px solid #555", transform: `rotate(${-120 * off}deg)` }}><div style={{ position: "absolute", left: 54, top: 8, width: 12, height: 40, background: "#fff", borderRadius: 6 }} /></div>
    <div style={{ position: "absolute", left: 1420, top: 820, width: 120, textAlign: "center", fontWeight: 900, fontSize: 30, color: off > 0.5 ? GRN : DIM }}>OFF</div>
    <div style={{ position: "absolute", left: 300, top: 300, fontWeight: 900, fontSize: 64, color: RED, opacity: cl((tt - 2.4) * 3) }}>NEVER WATER</div>
  </>;
}}</Stage>;

// ---- 12:04 · LA ESPONJA: la milanesa en aceite tibio se llena de aceite como una esponja amarilla ----
export const HSponge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.6, 3.0);
  return <>
    <div style={{ position: "absolute", left: 660, top: 380, width: 600, height: 320, borderRadius: 40, background: mix([242, 214, 110], [214, 160, 50], s), transform: `scale(${1 + 0.08 * s})`, boxShadow: sh(30), overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 560, top: rnd(i + 8) * 280, width: 20 + rnd(i + 2) * 30, height: 16 + rnd(i + 3) * 24, borderRadius: "50%", background: mix([200, 160, 60], [150, 100, 20], s) }} />)}
    </div>
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.9 + i / 8) % 1); return <div key={i} style={{ position: "absolute", left: 700 + i * 70, top: 700 + k * 120, width: 16, height: 22, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#f2c46b", opacity: s * (1 - k) }} />; })}
    <div style={{ position: "absolute", left: 1360, top: 300, width: 90, height: 380, borderRadius: 45, background: "#1a1b1e", border: "5px solid #444", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "35%", background: ICE }} />
    </div>
    <Tag tt={tt} at={0.4} x={1400} y={240} txt="TOO COOL" col={ICE} size={40} />
    <Tag tt={tt} at={2.6} x={960} y={900} txt="SOAKS UP OIL LIKE A SPONGE" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 13:02 · LA MIGA QUE BAILA: tres miguitas caen en el aceite; una se hunde, otra se quema, la del medio baila ----
export const HDance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const d = cl(tt - 0.3);
  const lane = (x: number, kind: 0 | 1 | 2, lbl: string, col: string) => {
    const y = kind === 0 ? 400 + 340 * d : 400 + 160 * d - (kind === 1 ? 30 * Math.abs(Math.sin(tt * 6)) : 0);
    const c = kind === 2 ? mix([217, 168, 90], [30, 20, 10], cl(tt - 1.0)) : kind === 1 ? mix([217, 168, 90], [214, 150, 60], cl(tt - 1)) : "#d9a85a";
    return <div style={{ position: "absolute", left: x, top: 300, width: 400, height: 560 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, bottom: 0, background: "linear-gradient(180deg,rgba(242,196,107,.7),rgba(200,130,40,.85))", borderRadius: "0 0 30px 30px" }} />
      <div style={{ position: "absolute", left: 180 + (kind === 1 ? 40 * Math.sin(tt * 4) : 0), top: y - 300, width: 36, height: 28, borderRadius: 6, background: c, transform: `rotate(${kind === 1 ? tt * 200 : 0}deg)` }} />
      {kind === 1 && Array.from({ length: 6 }, (_, i) => { const k = (tt * 1.5 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 160 + 40 * Math.sin(tt * 4) + (rnd(i) - 0.5) * 80, top: 250 - k * 60, width: 10, height: 10, borderRadius: 5, border: "2px solid #fff", opacity: 1 - k }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontWeight: 900, fontSize: 40, color: col }}>{lbl}</div>
    </div>;
  };
  return <>
    {lane(300, 0, "SINKS · COLD", ICE)}{lane(760, 1, "DANCES · READY", GRN)}{lane(1220, 2, "BURNS · HOT", RED)}
    <Tag tt={tt} at={1.2} x={960} y={200} txt="THE CRUMB TEST" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 14:33 · LA CUNA: la sartén se mece como una cuna sobre un arco y el aceite va y viene ----
export const HCradle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = 9 * Math.sin(tt * 2.6), slosh = Math.sin(tt * 2.6 - 0.8);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${a}deg)`, transformOrigin: "50% 300%" }}>
      <div style={{ width: 760, height: 200, borderRadius: "0 0 200px 200px", background: "#1c1c1e", overflow: "hidden", position: "relative" }}>
        <SV><path d={`M0 ${70 - 30 * slosh} Q190 ${70 + 30 * slosh} 380 70 T760 ${70 + 30 * slosh} L760 200 L0 200 Z`} fill="rgba(242,196,107,.85)" /></SV>
        <div style={{ position: "absolute", left: 200, top: 70, width: 360, height: 40, borderRadius: 20, background: `rgb(${CRUST.join(",")})` }} />
      </div>
      <div style={{ position: "absolute", left: 740, top: 40, width: 320, height: 40, borderRadius: 20, background: "#2c2c2e" }} />
    </div>
    <SV><path d="M560 840 Q960 960 1360 840" stroke="rgba(255,255,255,.25)" strokeWidth={10} fill="none" strokeDasharray="20 16" /></SV>
    <Tag tt={tt} at={1.4} x={960} y={200} txt="ROCKING A BABY" col={AMB} size={52} />
  </>;
}}</Stage>;

// ---- 14:40 · LA SÁBANA EN LA SOGA: una sábana dorada se infla con el viento en ondas, como la costra ----
export const HClothesline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#8cc4e6,#d8eef8)">{(tt) => {
  const amp = 30 + 50 * eio(tt, 0.3, 1.8);
  return <>
    <SV>
      <line x1={260} y1={300} x2={1660} y2={300} stroke="#5a4a35" strokeWidth={6} />
      <path d={`${wavy(420, 1080, 310, amp * 0.3, 6, tt * 3)} L1500 ${640 + amp * Math.sin(tt * 2)} ${wavy(420, 1080, 640, -amp, 6, tt * 3 + 1).replace("M420 640", "")} L420 310 Z`} fill="url(#gold)" />
      <defs><linearGradient id="gold" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f2c46b" /><stop offset="1" stopColor="#c47a2a" /></linearGradient></defs>
      {[480, 960, 1440].map((x, i) => <rect key={i} x={x - 10} y={280} width={20} height={50} rx={4} fill="#8a6238" />)}
    </SV>
    <Tag tt={tt} at={1.8} x={960} y={900} txt="THE CRUST LIFTS IN WAVES" col="#3a2414" size={50} />
  </>;
}}</Stage>;

// ---- 15:08 · EL SOUFFLÉ: el ramequín crece por arriba del borde y el texto «SOUFFLIERT» se infla ----
export const HSouffle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = eio(tt, 0.4, 2.6);
  return <>
    <div style={{ position: "absolute", left: 760, top: 680 - 260 * r, width: 400, height: 140 + 260 * r, borderRadius: "200px 200px 0 0 / 120px 120px 0 0", background: "radial-gradient(ellipse at 50% 20%,#f8d68a,#d89a3a 70%)" }} />
    <div style={{ position: "absolute", left: 740, top: 640, width: 440, height: 240, background: "repeating-linear-gradient(90deg,#fbfaf6 0 24px,#e9e4dc 24px 30px)", borderRadius: "0 0 20px 20px", boxShadow: sh(20) }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 160, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 80 + 50 * r, color: AMB, letterSpacing: 4 * r }}>souffliert</div>
    <Tag tt={tt} at={2.6} x={960} y={960} txt="THE EGG TURNS TO STEAM · IT PUFFS" col={TX} size={40} />
  </>;
}}</Stage>;

// ---- 16:29 · LAS HUELLAS DE BAILE: pasos de vals aparecen numerados alrededor de la cocina ----
export const HFootprints: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const steps = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return { x: 960 + Math.cos(a) * 300, y: 560 + Math.sin(a) * 220, r: (a * 180) / Math.PI + 90, l: i % 2 }; });
  return <>
    <div style={{ position: "absolute", left: 860, top: 500, width: 200, height: 120, borderRadius: "0 0 60px 60px", background: "#1c1c1e" }} />
    {steps.map((s, i) => { const k = cl((tt - 0.3 - i * 0.4) * 3); return <div key={i} style={{ position: "absolute", left: s.x - 30, top: s.y - 50, width: 60, height: 100, borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%", background: i % 2 ? "#f4efe6" : AMB, transform: `rotate(${s.r}deg) scale(${k})`, opacity: k }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontWeight: 900, fontSize: 26, color: "#1a1410" }}>{i + 1}</div>
    </div>; })}
    <Tag tt={tt} at={2.8} x={960} y={900} txt="«LIKE I'M DANCING WITH IT»" col={AMB} size={48} />
  </>;
}}</Stage>;

// ---- 16:47 · EL VAPOR ATRAPADO: la milanesa sobre papel; el vapor no tiene salida y la base se pone blanda ----
export const HTrap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = eio(tt, 0.6, 3.0);
  return <>
    <div style={{ position: "absolute", left: 360, top: 700, width: 520, height: 30, background: "#f6f4ee" }} />
    <div style={{ position: "absolute", left: 400, top: 600, width: 440, height: 100, borderRadius: 30, background: `linear-gradient(180deg, rgb(${CRUST.join(",")}), ${mix(CRUST, [190, 160, 110], s)})` }} />
    {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 420 + i * 52, top: 690 + Math.sin(tt * 4 + i) * 4, width: 40, height: 18, borderRadius: "50%", background: "rgba(230,240,250,.7)", filter: "blur(3px)", opacity: s }} />)}
    <div style={{ position: "absolute", left: 1040, top: 700, width: 520, height: 14, background: "repeating-linear-gradient(90deg,#9aa3ab 0 6px,transparent 6px 40px)" }} />
    <div style={{ position: "absolute", left: 1080, top: 600, width: 440, height: 100, borderRadius: 30, background: `rgb(${CRUST.join(",")})` }} />
    {Array.from({ length: 8 }, (_, i) => { const k = (tt * 0.8 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 1100 + i * 52, top: 720 + k * 160, width: 30, height: 30, borderRadius: 15, background: "rgba(230,240,250,.6)", filter: "blur(6px)", opacity: 1 - k }} />; })}
    <Tag tt={tt} at={0.4} x={620} y={460} txt="PAPER TOWEL ✕" col={RED} size={44} />
    <Tag tt={tt} at={0.8} x={1300} y={460} txt="WIRE RACK ✓" col={GRN} size={44} />
    <Tag tt={tt} at={2.8} x={620} y={860} txt="STEAM TRAPPED = SOGGY" col={DIM} size={36} />
  </>;
}}</Stage>;

// ---- 17:19 · EL LIMÓN: la rodaja se exprime en cámara lenta y cada gota que cae enciende un brillo en la costra ----
export const HLemon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sq = eio(tt, 0.4, 1.4);
  return <>
    <div style={{ position: "absolute", left: 460, top: 640, width: 1000, height: 220, borderRadius: "48% 52% 50% 50%", background: `radial-gradient(ellipse at 40% 35%, #f2c46b, rgb(${CRUST.join(",")}) 70%)` }} />
    <div style={{ position: "absolute", left: 860, top: 180, width: 260, height: 160 * (1 - 0.3 * sq), borderRadius: "130px 130px 20px 20px", background: "radial-gradient(circle at 50% 100%,#fff6b0 0 50%,#f5dc3a 52%,#e6c41a)", transform: `rotate(${180 + 10 * sq}deg)` }} />
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt - 1.0) * 0.9 + i / 10) % 1; return tt > 1.0 && <div key={i} style={{ position: "absolute", left: 960 + (rnd(i) - 0.5) * 120, top: 360 + k * 300, width: 16, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(255,250,170,.9)", opacity: 1 - k }} />; })}
    {Array.from({ length: 10 }, (_, i) => <div key={"s" + i} style={{ position: "absolute", left: 620 + rnd(i + 20) * 680, top: 660 + rnd(i + 30) * 160, fontSize: 40, color: "#fff9c0", textShadow: "0 0 20px #fff", opacity: cl((tt - 1.6 - i * 0.15) * 3) * (0.5 + 0.5 * Math.sin(tt * 5 + i)) }}>✦</div>)}
    <Tag tt={tt} at={2.2} x={1560} y={300} txt="CUTS THE RICHNESS" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 19:05 · EL COLECTIVO: dos milanesas suben a la sartén-colectivo, la puerta se cierra y la tercera queda en la parada ----
export const HBus: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const door = eio(tt, 1.8, 2.3), go = eio(tt, 3.2, 4.6);
  return <>
    <div style={{ position: "absolute", left: 400 + 900 * go, top: 360, width: 900, height: 360, borderRadius: 40, background: "linear-gradient(180deg,#f2b33a,#d48a1a)", boxShadow: sh(30) }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 220, top: 60, width: 190, height: 130, borderRadius: 16, background: "#9fd0ee" }}><div style={{ position: "absolute", left: 30, top: 50, width: 130, height: 50, borderRadius: 25, background: `rgb(${CRUST.join(",")})`, opacity: cl((tt - 0.6 - i * 0.5) * 3) }} /></div>)}
      <div style={{ position: "absolute", left: 560, top: 60, width: 180, height: 300, background: "#2a2c30", transformOrigin: "0 50%", transform: `scaleX(${door})` }} />
      <div style={{ position: "absolute", left: 600, top: 20, fontWeight: 900, fontSize: 36, color: "#1a1410" }}>FULL</div>
      {[0, 1].map((i) => <div key={"w" + i} style={{ position: "absolute", left: 120 + i * 560, top: 320, width: 120, height: 120, borderRadius: 60, background: "#1a1b1e", border: "16px solid #555" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1500 - 600 * go, top: 640, width: 200, height: 70, borderRadius: 35, background: `rgb(${CRUST.join(",")})`, opacity: cl((tt - 2.0) * 3) }} />
    <Tag tt={tt} at={0.6} x={960} y={200} txt="«THE PAN IS NOT A BUS»" col={AMB} size={52} />
    <Tag tt={tt} at={2.6} x={960} y={900} txt="TWO AT A TIME" col={TX} size={48} />
  </>;
}}</Stage>;

// ---- 20:07 · LA LICUADORA: las escamas del panko dan vueltas y salen hechas miga fina ----
export const HBlender: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const f = eio(tt, 0.8, 3.0);
  return <>
    <div style={{ position: "absolute", left: 760, top: 200, width: 400, height: 520, borderRadius: "30px 30px 60px 60px", border: "10px solid rgba(255,255,255,.55)", background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
      {Array.from({ length: 40 }, (_, i) => { const a = tt * (4 + rnd(i) * 3) + i, r = 60 + rnd(i + 1) * 110, s = 30 * (1 - f) + 6; return <div key={i} style={{ position: "absolute", left: 190 + Math.cos(a) * r, top: 300 + Math.sin(a) * r * 0.5 - (1 - f) * 40, width: s * 1.6, height: s, borderRadius: f > 0.5 ? 3 : 8, background: "#e2c084", transform: `rotate(${a * 60}deg)` }} />; })}
    </div>
    <div style={{ position: "absolute", left: 720, top: 720, width: 480, height: 160, borderRadius: "20px 20px 40px 40px", background: "linear-gradient(180deg,#2c2f35,#15161a)", boxShadow: sh(30) }} />
    <Tag tt={tt} at={0.4} x={480} y={400} txt="PANKO" col={TX} size={50} />
    <Tag tt={tt} at={2.6} x={1460} y={400} txt="→ FINE CRUMBS" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 21:01 · LA FOTO DEL CHICO: una polaroid aparece revelándose y muestra una costra con olas; pulgar arriba ----
export const HPhoto: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const dev = eio(tt, 0.6, 2.6), th = cl(phys(tt, 2.8, 9, 0.4));
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(${-4 + 4 * eio(tt, 0, 0.8)}deg)`, width: 520, height: 620, background: "#fbfaf6", boxShadow: sh(30), padding: 30, boxSizing: "border-box" }}>
      <div style={{ width: 460, height: 460, background: mix([40, 40, 40], [120, 90, 60], dev), position: "relative", overflow: "hidden" }}>
        <SV><g transform="translate(-700 -150)" opacity={dev}>{[0, 1, 2, 3].map((i) => <path key={i} d={wavy(730, 400, 330 + i * 70, 22, 6, i)} stroke="#f2c46b" strokeWidth={30} fill="none" strokeLinecap="round" />)}</g></SV>
      </div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#2b241c", textAlign: "center", marginTop: 20, opacity: dev }}>Waves!</div>
    </div>
    <div style={{ position: "absolute", left: 1320, top: 600, fontSize: 160, transform: `scale(${th})` }}>👍</div>
    <Tag tt={tt} at={1.0} x={460} y={300} txt="STOP PRESSING · START ROCKING" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 22:03 · LA CANASTA: caen cerdo, miga y huevo con su precio; el total de $4 contra el cartel de $30 ----
export const HBasket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const items: [string, number, string][] = [["PORK", 3.2, "#e8b8a8"], ["CRUMBS", 0.4, "#d9a85a"], ["EGG", 0.4, "#f6efe0"]];
  const tot = items.reduce((s, [, v], i) => s + (tt > 0.8 + i * 0.5 ? v : 0), 0);
  return <>
    <div style={{ position: "absolute", left: 660, top: 560, width: 600, height: 300, borderRadius: "10px 10px 80px 80px", background: "repeating-linear-gradient(45deg,#a8763c 0 14px,#8a5a28 14px 28px)", boxShadow: sh(30) }} />
    {items.map(([n, , c], i) => { const d = phys(tt, 0.4 + i * 0.5, 9, 0.4); return <div key={i} style={{ position: "absolute", left: 720 + i * 170, top: 480 - (1 - cl(d)) * 500, width: 150, height: 110, borderRadius: 30, background: c, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 26, color: "#1a1410", opacity: cl(d * 4) }}>{n}</div>; })}
    <div style={{ position: "absolute", left: 300, top: 300, fontWeight: 900, fontSize: 130, color: GRN, fontVariantNumeric: "tabular-nums" }}>${tot.toFixed(2)}</div>
    <div style={{ position: "absolute", left: 1400, top: 300, fontFamily: MARK, fontSize: 130, color: RED, opacity: cl((tt - 2.2) * 3) }}>$30</div>
    <Tag tt={tt} at={3.0} x={960} y={960} txt="+ A GENTLE ROCK OF THE PAN" col={AMB} size={44} />
  </>;
}}</Stage>;
