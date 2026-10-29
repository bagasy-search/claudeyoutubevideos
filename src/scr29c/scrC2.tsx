// scr29c · componentes únicos 14-26 (uno por minuto, ninguno repetido con scr29a ni scr29b). Mismo idioma hkit que scrC1.
import React from "react";
import { AMB, DIM, H, MARK, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => (h.items?.[i]?.at as number | undefined) ?? d;
const BLU = "#5aa8ff", GRN = "#6fe39a", EXT = "linear-gradient(90deg,#7a1410 0%,#d8352a 30%,#ff6a5a 42%,#b8241c 62%,#5a0e0a 100%)";
const steel = "linear-gradient(90deg,#3a3d42 0%,#8a9098 22%,#c9ced4 34%,#6b7077 55%,#2e3135 100%)";
const Flame: React.FC<{ x: number; y: number; w: number; hgt: number; b: number; tt: number; o?: number }> = ({ x, y, w, hgt, b, tt, o = 1 }) =>
  <div style={{ position: "absolute", left: x - w / 2, top: y - hgt, width: w, height: hgt, opacity: o, borderRadius: "50% 50% 42% 42%", transformOrigin: "50% 100%", transform: `scaleY(${0.95 + 0.05 * Math.sin(tt * 2 * Math.PI * 1.5)})`,
    background: `radial-gradient(ellipse at 50% 88%, #fff, rgb(${255 - 190 * b},${140 + 30 * b},${40 + 215 * b}) 45%, rgba(0,0,0,0) 74%)` }} />;

// ---- 12:42 · LA TAPA QUE AHOGA: un tubo de aire con su tapita; la tapa baja enroscando, las flechas azules de arriba se cortan y la llama se ensucia ----
export const HCapoff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const cap = eio(tt, it(h, 0) - 0.3, it(h, 0) + 1.0), none = eio(tt, it(h, 1) - 0.3, it(h, 1) + 0.6);
  return <>
    <div style={{ position: "absolute", left: 960, top: 220, transform: "translate(-50%,0)", width: 180, height: 760, borderRadius: 14, background: steel, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3, 4].map((r) => <div key={r} style={{ position: "absolute", left: 66, top: 80 + r * 110, width: 48, height: 48, borderRadius: "50%", background: "#0b0b0c" }} />)}
    </div>
    <div style={{ position: "absolute", left: 960, top: 220 - 260 * (1 - cap), transform: `translate(-50%,-60%) rotate(${(1 - cap) * 540}deg)`, width: 230, height: 90, borderRadius: 16, background: "linear-gradient(180deg,#9aa0a8,#4a4e54)", opacity: cl(cap * 4) }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 1080, top: 300 + i * 110, width: 260, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${BLU}, rgba(90,168,255,0))`, opacity: 1 - none }} />)}
    <Flame x={1500} y={880} w={260} hgt={420} b={0.8 * (1 - none)} tt={tt} />
    {none > 0.1 && Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.5 + i / 5) % 1; return <div key={i} style={{ position: "absolute", left: 1440 + Math.sin(i * 2 + ph * 5) * 30, top: 460 - ph * 380, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(25,22,20,.8), rgba(25,22,20,0) 70%)", opacity: none * (1 - ph) }} />; })}
    <Tag tt={tt} at={it(h, 0)} x={1250} y={190} txt="A CAP" col={TX} size={50} />
    <Tag tt={tt} at={it(h, 1)} x={1500} y={980} txt="NO SECONDARY AIR" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 13:28 · LOS MELLIZOS: estufa cohete de leña a la izquierda, estufa de aceite a la derecha; las dos llamas laten iguales y se juntan en un signo «=» ----
export const HTwins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = phys(tt, 0.4, 6, 0.5), b = phys(tt, it(h, 0), 6, 0.5), eq = phys(tt, it(h, 1), 7, 0.4);
  return <>
    <div style={{ position: "absolute", left: 360, top: 420, opacity: cl(a * 2), transform: `translateY(${(1 - a) * 120}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 260, width: 420, height: 130, background: "linear-gradient(180deg,#5a5f66,#2e3135)", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 280, top: 0, width: 140, height: 300, background: "linear-gradient(90deg,#3a3d42,#6b7077,#3a3d42)", borderRadius: 8 }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: -180 + i * 20, top: 290 + i * 26, width: 240, height: 22, borderRadius: 6, background: "linear-gradient(90deg,#6a4220,#a8743a)" }} />)}
      <Flame x={350} y={20} w={150} hgt={240} b={0.15} tt={tt} />
    </div>
    <div style={{ position: "absolute", left: 1260, top: 380, opacity: cl(b * 2), transform: `translateY(${(1 - b) * 120}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 300, height: 520, borderRadius: "130px 130px 40px 40px", background: EXT }} />
      <div style={{ position: "absolute", left: 110, top: -60, width: 80, height: 200, background: steel, borderRadius: 6 }} />
      <Flame x={150} y={-40} w={150} hgt={240} b={0.85} tt={tt} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 420, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * cl(eq)})`, opacity: cl(eq * 2), fontFamily: MARK, fontSize: 220, color: TX, textShadow: "0 20px 40px rgba(0,0,0,.6)" }}>=</div>
    <Tag tt={tt} at={0.8} x={500} y={900} txt="WOOD" col={AMB} size={56} />
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1410} y={1000} txt="OIL VAPOR" col={BLU} size={56} />
    <Tag tt={tt} at={it(h, 1) + 0.3} x={960} y={620} txt="SAME IDEA" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 14:35 · EL DOMINÓ: tres fichas gigantes de dominó con la rutina (tubo recto, obturador, diario) caen una sobre otra hasta encender un fósforo ----
export const HDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T = [1.0, it(h, 0), it(h, 1)], lab = ["TUBE STRAIGHT", "SHUTTER CLOSED", "NEWSPAPER"], icn = ["┃", "◐", "▤"];
  const lit = eio(tt, it(h, 1) + 1.2, it(h, 1) + 1.8);
  return <>
    <div style={{ position: "absolute", left: 200, top: 860, width: 1520, height: 10, background: "rgba(255,255,255,.2)" }} />
    {T.map((a, i) => { const f = eio(tt, a + 0.6, a + 1.3), ang = 70 * f;
      return <div key={i} style={{ position: "absolute", left: 420 + i * 380, top: 860, width: 180, height: 400, transformOrigin: "100% 100%", transform: `translate(0,-100%) rotate(${ang}deg)`, opacity: cl((tt - a + 0.8) * 2) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 22, background: "linear-gradient(135deg,#f5f1e6,#d9d2c0)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", border: "4px solid #1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
          <div style={{ fontSize: 120, color: "#1a1a1a", lineHeight: 1 }}>{icn[i]}</div>
          <div style={{ width: "80%", height: 6, background: "#1a1a1a" }} />
          <div style={{ fontSize: 96, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>{i + 1}</div>
        </div>
      </div>; })}
    <div style={{ position: "absolute", left: 1560, top: 640, width: 14, height: 220, background: "#d9b07a", borderRadius: 4 }} />
    <Flame x={1567} y={650} w={70} hgt={120 * lit} b={0.1} tt={tt} o={lit} />
    {T.map((a, i) => { const nx = T[i + 1] ?? 1e9; return <div key={i} style={{ opacity: 1 - eio(tt, nx - 0.3, nx) }}><Tag tt={tt} at={a} x={960} y={990} txt={lab[i]} col={i === 2 ? AMB : TX} size={64} /></div>; })}
  </>;
}}</Stage>;

// ---- 16:14 · LA ENCUESTA: tres fichas de color de llama (naranja, amarilla, azul) giran como monedas sobre la mesa y caen boca arriba; burbujas de comentario suben ----
export const HPoll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const C: [string, string][] = [["#ff7a1a", "ORANGE"], ["#ffd24a", "YELLOW"], [BLU, "BLUE"]], cm = eio(tt, it(h, 1) - 0.2, it(h, 1) + 1.2);
  return <>
    {C.map(([c, n], i) => { const s = phys(tt, Math.min(it(h, 0) - 0.6, 0.15) + i * 0.45, 5, 0.5), spin = Math.max(0, 1 - cl(s)) * 6;
      return <div key={i} style={{ position: "absolute", left: 540 + i * 420, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - cl(s)) * -260}px) rotateY(${spin * 180}deg)`, opacity: cl(s * 3) }}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 34% 28%, #fff 0 6%, ${c} 38%, #1a1a1a 105%)`, boxShadow: `0 0 70px ${c}, 0 60px 50px -20px rgba(0,0,0,.8), inset -30px -40px 60px rgba(0,0,0,.45)` }} />
        <div style={{ textAlign: "center", marginTop: 30, fontWeight: 900, fontSize: 52, color: c, letterSpacing: 4 }}>{n}</div>
      </div>; })}
    <Tag tt={tt} at={0.6} x={960} y={160} txt="YOUR FLAME?" col={TX} size={66} />
  </>;
}}</Stage>;

// ---- 16:47 · LA LIMA REDONDA: un agujero recién taladrado con rebaba de puntas; la lima entra y sale y las virutas caen hasta dejar el borde liso ----
export const HBurr: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const drill = eio(tt, 0.4, 2.0), fileOn = tt > it(h, 0) - 0.3, smooth = eio(tt, it(h, 0), it(h, 0) + 3.2), stroke = fileOn ? Math.sin((tt - it(h, 0)) * Math.PI * 1.6) : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", width: 1000, height: 700, borderRadius: 40, background: steel, boxShadow: "0 60px 110px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 500 - 140 * drill, top: 350 - 140 * drill, width: 280 * drill, height: 280 * drill, borderRadius: "50%", background: "#0b0b0c" }} />
      {Array.from({ length: 18 }, (_, k) => { const a = (k / 18) * Math.PI * 2, r = 140 * drill; return <div key={k} style={{ position: "absolute", left: 500 + Math.cos(a) * r - 8, top: 350 + Math.sin(a) * r - 8, width: 16, height: 30 * (1 - smooth), background: "#d9dde2", transform: `rotate(${(a * 180) / Math.PI + 90}deg)`, opacity: drill }} />; })}
    </div>
    <div style={{ position: "absolute", left: 1000 + stroke * 50, top: 470 + stroke * 90, transform: "translate(-50%,-50%) rotate(-38deg)", width: 460, height: 64, borderRadius: 32, opacity: fileOn ? 1 : 0, background: "repeating-linear-gradient(90deg,#55595f 0 6px,#8a9098 6px 12px)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", right: -150, top: -12, width: 170, height: 88, borderRadius: 30, background: "linear-gradient(180deg,#c43a1a,#7a1a0a)" }} />
    </div>
    {fileOn && Array.from({ length: 10 }, (_, i) => { const ph = ((tt - it(h, 0)) * 0.7 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 940 + Math.sin(i * 3) * 120, top: 600 + ph * 420, width: 10, height: 18, background: "#c9ced4", transform: `rotate(${i * 40 + ph * 200}deg)`, opacity: smooth > 0.95 ? 0 : 1 - ph }} />; })}
    <Tag tt={tt} at={1.0} x={700} y={1000} txt="SHARP BURRS" col={RED} size={46} />
    <Tag tt={tt} at={it(h, 0) + 2.8} x={1260} y={1000} txt="SMOOTH" col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 18:13 · LOS ENGRANAJES: un engranaje ACEITE y otro AIRE engranados; cuando uno acelera el otro tiene que seguirlo ----
export const HGears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sp = 1 + 1.4 * eio(tt, it(h, 0) - 0.2, it(h, 0) + 1.0), ang = tt * 40 * sp;
  const Gear = ({ x, y, r, a, col, lab }: { x: number; y: number; r: number; a: number; col: string; lab: string }) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${a}deg)` }}>
    {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: -26, top: -r - 30, width: 52, height: 70, background: col, borderRadius: 8, transformOrigin: `26px ${r + 30}px`, transform: `rotate(${k * 30}deg)` }} />)}
    <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #fff 0%, ${col} 35%, #222 120%)` }} />
    <div style={{ position: "absolute", left: -r, top: -24, width: 2 * r, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#111", transform: `rotate(${-a}deg)` }}>{lab}</div>
  </div>;
  return <>
    <Gear x={760} y={540} r={200} a={ang} col={AMB} lab="OIL" />
    <Gear x={760 + 452} y={540} r={200} a={-ang + 15} col={BLU} lab="AIR" />
    <Tag tt={tt} at={0.6} x={960} y={140} txt="MORE OIL, MORE AIR" col={TX} size={52} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={960} txt="ADJUST BOTH" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 18:43 · LA MANGA DE VIENTO: en el techo, una manga de aeropuerto se infla con viento (la llama tira fuerte) y cae lacia en un día pesado (la llama se acuesta) ----
export const HWindsock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const calm = eio(tt, it(h, 0) - 0.4, it(h, 0) + 1.2), wind = 1 - calm, flap = Math.sin(tt * 2 * Math.PI * 1.2) * 6 * wind;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1080, background: `linear-gradient(180deg, rgba(${120 - 50 * calm},${170 - 70 * calm},${220 - 110 * calm},.35), rgba(0,0,0,0) 70%)` }} />
    <div style={{ position: "absolute", left: 540, top: 200, width: 18, height: 700, background: "#c9ced4" }} />
    <div style={{ position: "absolute", left: 556, top: 210, width: 560, height: 160, transformOrigin: "0 30px", transform: `rotate(${10 + 72 * calm + flap}deg) scaleY(${1 - 0.45 * calm})` }}>
      {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: k * 110, top: k * 9, width: 112, height: 160 - k * 18, background: k % 2 ? "#f5f1e6" : "#ff6a1a", clipPath: "polygon(0 0,100% 6%,100% 94%,0 100%)" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1420, top: 600, width: 260, height: 380, borderRadius: "110px 110px 30px 30px", background: EXT }} />
    <div style={{ position: "absolute", left: 1520, top: 120, width: 60, height: 500, background: steel }} />
    <Flame x={1550} y={700} w={180} hgt={300 - 120 * calm} b={0.85 - 0.55 * calm} tt={tt} />
    <Tag tt={tt} at={0.6} x={960} y={140} txt="WINDY: STRONG DRAFT" col={BLU} size={46} />
    <Tag tt={tt} at={it(h, 0)} x={960} y={980} txt="DAMP: LAZY FLAME" col={AMB} size={46} />
  </>;
}}</Stage>;

// ---- 19:02 · EL PISO LADRÓN: la estufa sobre el concreto, el calor se escurre hacia abajo en ondas rojas; dos ladrillos entran por debajo y las ondas suben a la sala ----
export const HFloorheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const br = eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.9), lift = 140 * br;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: "linear-gradient(180deg,#6b6862,#3a3834)" }} />
    {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 790 + k * 230 + (k ? 1 : -1) * 400 * (1 - br), top: 860 - lift, width: 200, height: lift, background: "linear-gradient(180deg,#b5502e,#7a2e18)", border: "4px solid #4a1a0a", borderRadius: 4, opacity: cl(br * 3) }} />)}
    <div style={{ position: "absolute", left: 800, top: 860 - lift - 440, width: 320, height: 440, borderRadius: "130px 130px 30px 30px", background: EXT, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.5 + i / 4) % 1;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: 960 - 160 - ph * 300, top: 870 + ph * 160, width: 320 + ph * 600, height: 20, borderRadius: "50%", border: `5px solid rgba(255,80,40,${(1 - ph) * (1 - br)})` }} />
        <div style={{ position: "absolute", left: 960 - 200 - ph * 340, top: 860 - lift - 220 - ph * 40, width: 400 + ph * 680, height: 440, borderRadius: "50%", border: `5px solid rgba(255,140,60,${(1 - ph) * br * 0.7})` }} />
      </React.Fragment>; })}
    <Tag tt={tt} at={0.8} x={420} y={980} txt="FLOOR STEALS HEAT" col={RED} size={44} />
    <Tag tt={tt} at={it(h, 0) + 0.6} x={1500} y={300} txt="TWO BRICKS" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 19:36 · LAS MATRIOSKAS: tres tubos de aire se meten uno dentro del otro vistos de punta; el de 2" crece y los agujeros pasan a 3/8 ----
export const HNesting: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const big = phys(tt, 0.4, 5, 0.5), holes = eio(tt, it(h, 0) - 0.3, it(h, 0) + 0.8);
  const R: [number, string, number][] = [[120, '1"', 0], [190, '1½"', 0.15], [300, '2"', 0.3]];
  return <>
    {R.map(([r, , d], i) => { const s = i === 2 ? cl(big) : phys(tt, d, 6, 0.5); return Array.from({ length: 8 }, (_, z) => <div key={i + "-" + z} style={{ position: "absolute", left: 700 + (8 - z) * 9, top: 540 + (8 - z) * 7, transform: `translate(-50%,-50%) scale(${s})`, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${i === 2 ? 26 : 18}px solid rgb(${40 + z * 6},${42 + z * 6},${46 + z * 6})` }} />); })}
    {R.map(([r, lab, d], i) => { const s = i === 2 ? cl(big) : phys(tt, d, 6, 0.5); return <div key={i} style={{ position: "absolute", left: 700, top: 540, transform: `translate(-50%,-50%) scale(${s})`, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${i === 2 ? 26 : 18}px solid ${i === 2 ? "#c9ced4" : "#8d9399"}`, background: i === 0 ? "radial-gradient(circle, #050505 40%, #1a1a1c)" : "transparent", boxShadow: i === 2 ? "0 0 0 6px #2e3135, 0 40px 80px rgba(0,0,0,.6)" : "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -70 - (i === 2 ? 20 : 0), textAlign: "center", fontWeight: 900, fontSize: i === 2 ? 72 : 58, color: i === 2 ? TX : "#c9ced4" }}>{lab}</div></div>; })}
    <div style={{ position: "absolute", left: 1180, top: 300, width: 520, height: 480, borderRadius: 20, background: steel, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 12 }, (_, k) => { const d = 40 + 30 * holes; return <div key={k} style={{ position: "absolute", left: 60 + (k % 4) * 120 - d / 2 + 30, top: 80 + Math.floor(k / 4) * 140 - d / 2 + 30, width: d, height: d, borderRadius: "50%", background: "#0b0b0c" }} />; })}
    </div>
    <Tag tt={tt} at={it(h, 0)} x={1440} y={880} txt='3/8" HOLES' col={AMB} size={58} />
  </>;
}}</Stage>;

// ---- 20:58 · LA VELA Y EL SORBETE: una vela; un sorbete sopla en la base y el pie de la llama se vuelve azul; después el sorbete se cambia por un caño agujereado ----
export const HCandle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const blow = eio(tt, 0.8, 2.0), swap = eio(tt, it(h, 1) - 0.4, it(h, 1) + 0.8);
  return <>
    <div style={{ position: "absolute", left: 960, top: 640, transform: "translate(-50%,0)", width: 170, height: 380, borderRadius: "10px 10px 6px 6px", background: "linear-gradient(90deg,#e8e0c8,#fffaf0 40%,#d6ccb0)" }} />
    <div style={{ position: "absolute", left: 957, top: 600, width: 6, height: 44, background: "#222" }} />
    <Flame x={960} y={620} w={130} hgt={280} b={0} tt={tt} />
    <div style={{ position: "absolute", left: 960 - 34, top: 520, width: 68, height: 100, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 80%, rgba(90,168,255,${0.95 * blow}), rgba(90,168,255,0) 70%)` }} />
    <div style={{ position: "absolute", left: 400 + 160 * blow, top: 590, width: 420, height: 34, borderRadius: 17, background: "repeating-linear-gradient(90deg,#ff4a6a 0 30px,#f5f1e6 30px 60px)", opacity: 1 - swap, transform: "rotate(-4deg)" }} />
    <div style={{ position: "absolute", left: 560 - 400 * (1 - swap), top: 576, width: 300, height: 60, borderRadius: 12, background: steel, opacity: swap }}>
      {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 60, top: 18, width: 24, height: 24, borderRadius: "50%", background: "#0b0b0c" }} />)}
    </div>
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.9 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 720 + ph * 200, top: 600 + Math.sin(i * 2) * 6, width: 40, height: 6, borderRadius: 3, background: BLU, opacity: blow * (1 - ph) }} />; })}
    <Tag tt={tt} at={it(h, 0)} x={1400} y={360} txt="SECONDARY AIR" col={BLU} size={50} />
    <Tag tt={tt} at={it(h, 1) + 0.4} x={960} y={1010} txt="HOLES, NOT A STRAW" col={TX} size={56} />
  </>;
}}</Stage>;

// ---- 21:14 · EL ANILLO DE LA HORNALLA: vista de arriba de una hornalla de cocina, la corona de llamitas azules; la grasa tapa la mitad de los orificios y esas llamitas se ponen amarillas ----
export const HGasring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const on = eio(tt, 0.0, 0.7), grease = eio(tt, it(h, 0) - 0.3, it(h, 0) + 1.4), N = 24;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%) perspective(1400px) rotateX(48deg)", width: 760, height: 760 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #2a2a2e 0 38%, #55595f 40%, #1c1c1f 60%, #0e0e10 70%)" }} />
      {Array.from({ length: N }, (_, k) => { const a = (k / N) * Math.PI * 2, bad = k < N / 2 && grease > k / (N / 2) * 0.8;
        return <div key={k} style={{ position: "absolute", left: 380 + Math.cos(a) * 230 - 18, top: 380 + Math.sin(a) * 230 - 18, width: 36, height: 36 }}>
          {k < N / 2 && <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "#4a3410", opacity: bad ? 1 : 0 }} />}
          <div style={{ position: "absolute", left: 6, top: -80 * on, width: 24, height: 90 * on, borderRadius: "50% 50% 40% 40%", transform: "rotateX(-48deg)", transformOrigin: "50% 100%", background: bad ? "radial-gradient(ellipse at 50% 85%, #fff2c0, #ffae2a 50%, rgba(0,0,0,0) 76%)" : "radial-gradient(ellipse at 50% 85%, #e6f4ff, #3a8aff 50%, rgba(0,0,0,0) 76%)" }} />
        </div>; })}
    </div>
    <Tag tt={tt} at={0.8} x={960} y={130} txt="THE SAME SLEEVE" col={BLU} size={52} />
    <Tag tt={tt} at={it(h, 0) + 0.8} x={960} y={1000} txt="CLOGGED = YELLOW" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 22:52 · EL REMIENDO: una estufa vieja de cuenco abierto, humeando; un caño agujereado baja desde arriba, se clava en el centro del cuenco y el humo se vuelve llama azul ----
export const HRetrofit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pipe = phys(tt, 0.15, 5, 0.55), sit = eio(tt, it(h, 0) - 0.2, it(h, 0) + 0.8), fix = eio(tt, it(h, 0) + 0.8, it(h, 0) + 2.4);
  return <>
    <div style={{ position: "absolute", left: 960, top: 820, transform: "translate(-50%,-50%)", width: 700, height: 180, borderRadius: "0 0 200px 200px", background: "linear-gradient(180deg,#4a4540,#1a1816)", boxShadow: "inset 0 26px 0 #2a1a0a, 0 40px 80px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.45 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 860 + Math.sin(i * 2 + ph * 4) * 80, top: 700 - ph * 520, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,18,16,.85), rgba(20,18,16,0) 70%)", opacity: (1 - fix) * (1 - ph) }} />; })}
    <div style={{ position: "absolute", left: 960, top: -700 + 880 * cl(pipe) + 60 * sit, transform: "translate(-50%,0)", width: 110, height: 600, borderRadius: 12, background: steel, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3].map((r) => <div key={r} style={{ position: "absolute", left: 34, top: 60 + r * 110, width: 42, height: 42, borderRadius: "50%", background: "#0b0b0c" }} />)}
    </div>
    <Flame x={960} y={760} w={300} hgt={420 * fix} b={0.9} tt={tt} o={fix} />
    <Tag tt={tt} at={0.8} x={420} y={1000} txt="ANY OLD STOVE" col={TX} size={48} />
    <Tag tt={tt} at={it(h, 0) + 1.6} x={1500} y={240} txt="NOW IT'S BLUE" col={BLU} size={56} />
  </>;
}}</Stage>;
