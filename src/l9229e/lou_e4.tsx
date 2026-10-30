// l9229e · vuelta 3 (última): los 4 que quedaron ≤6 con más contexto físico (mano en la llave, luces del tablero, guirnalda de bombitas, botas sobre el techo, mano que plancha el doblez)
import React from "react";
import { Img, staticFile } from "remotion";
import { cl, eio } from "./hkit";
import { S, D, bt, C, Prop, Cam, Glow, Dust, land, swing, rnd } from "./pk";
import { Fondo } from "./lk";

const OAK = "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 190px),repeating-linear-gradient(90deg,rgba(255,230,190,.05) 0 1px,transparent 1px 23px),linear-gradient(180deg,#a8763e,#7e5428)";

// «The engine is off»: tablero de madera del auto viejo; la mano de Lou gira la llave hacia atrás, las luces testigo parpadean y se apagan de a una, la aguja cae y el tablero queda a oscuras
const HEngineOff: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.8), p = eio(tt, at, at + 0.4), dash = 1 - eio(tt, at + 0.15, at + 1.0), needle = 40 + 150 * (1 - eio(tt, at + 0.1, at + 1.2)) + 3 * Math.sin(tt * 9) * dash;
  const LAMPS = ["255,60,40", "255,180,40", "80,220,90", "255,60,40"];
  return <Cam tt={tt} d={d} z={0.06} fx={860} fy={560}>
    <Fondo id="le_e01" tt={tt} b={8} br={0.25 + 0.2 * dash} />
    <div style={{ position: "absolute", left: 0, top: 620, width: 1920, height: 460, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 60px),linear-gradient(#6a4224,#3c2412)", borderTop: "8px solid #8a8a8a", boxShadow: "inset 0 30px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1080, top: 230, width: 640, height: 560, borderRadius: 40, background: "radial-gradient(#1c1814,#0a0806)", boxShadow: "inset 0 0 40px #000, 0 0 0 10px #9a9a9a, 0 0 0 14px #444" }} />
    <div style={{ position: "absolute", left: 1140, top: 250, width: 520, height: 520 }}>
      <Prop id="dash_gauge" x={260} y={1080} w={520} sh={0} style={{ filter: `drop-shadow(0 0 ${30 * dash}px rgba(255,170,80,${0.8 * dash})) brightness(${0.5 + 0.5 * dash})` }} />
      <div style={{ position: "absolute", left: 255, top: 60, width: 10, height: 200, background: "linear-gradient(#fff,#ffb070)", borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${needle - 120}deg)`, boxShadow: `0 0 ${14 * dash}px rgba(255,160,80,${dash})` }} />
      <div style={{ position: "absolute", left: 230, top: 230, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#555,#111)" }} />
    </div>
    {LAMPS.map((c, k) => { const off = at + 0.25 + k * 0.22, blink = tt > off - 0.2 && tt < off ? (Math.sin(tt * 40) > 0 ? 1 : 0.3) : 1, o = tt < off ? blink : 0.08; return <div key={k} style={{ position: "absolute", left: 1210 + k * 120, top: 820, width: 46, height: 46, borderRadius: "50%", background: `rgba(${c},${o})`, boxShadow: `0 0 ${30 * o}px rgba(${c},${o})`, border: "4px solid #2a2a2a" }} />; })}
    <Glow x={1400} y={500} r={380} o={0.55 * dash} col="255,160,70" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "640px 640px", transform: `rotate(${-28 * p}deg)` }}>
      <Prop id="car_ignition" x={640} y={1000} w={720} sh={1} />
      <Prop id="hand_pinch" x={760} y={760} w={520} r={-20} sh={0} o={1 - eio(tt, at + 0.7, at + 1.1)} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.25 * (1 - dash)})` }} />
  </Cam>;
}} />;

// «a band from Waterloo, paper streamers»: en el salón de 1955 se prende de a una la guirnalda de bombitas, bajan las serpentinas de crepé y abajo esperan las sillas plegables junto a la ponchera
const HStreamersHall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 9, B = 14;
  return <Cam tt={tt} d={d} z={0.07} fy={460}>
    <Fondo id="le_e02" tt={tt} b={5} br={0.4 + 0.15 * eio(tt, 0.2, 1.6)} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 60, background: "linear-gradient(#5a3e24,#3a2614)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 0 }}><path d="M 0 80 Q 480 330 960 120 Q 1440 330 1920 80" stroke="#222" strokeWidth={4} fill="none" /></svg>
    {Array.from({ length: B }, (_, k) => { const u = k / (B - 1), half = u < 0.5 ? u * 2 : (u - 0.5) * 2, x = u * 1920, y = (1 - half) * (1 - half) * 80 + 2 * (1 - half) * half * 330 + half * half * 120 - (u < 0.5 ? 0 : 0) + (u >= 0.5 ? 0 : 0), on = cl((tt - 0.2 - k * 0.08) / 0.2); return <React.Fragment key={k}><div style={{ position: "absolute", left: x - 14, top: y, width: 28, height: 36, borderRadius: "50% 50% 45% 45%", background: on > 0.5 ? "radial-gradient(#fff6d0,#ffc860)" : "#6a5a40", boxShadow: `0 0 ${36 * on}px rgba(255,200,100,${on})` }} />{on > 0 && <Glow x={x} y={y + 20} r={120} o={0.35 * on} col="255,200,120" />}</React.Fragment>; })}
    {Array.from({ length: N }, (_, k) => { const at = 0.6 + k * 0.16, p = eio(tt, at, at + 0.9), x = 120 + k * 210 + (k % 2) * 30, len = 420 + 200 * rnd(k + 3), a = swing(tt, at + 0.9, 5, 2.6 + rnd(k) * 0.8, 0.4); return tt < at ? null : <div key={k} style={{ position: "absolute", left: x - 70, top: 40, width: 140, height: len * p, overflow: "hidden", transformOrigin: "50% 0", transform: `rotate(${a}deg)` }}>
      <Img src={staticFile(`img/l9229e/cut/${k % 2 ? "crepe_streamer_red" : "crepe_streamer"}.webp`)} style={{ position: "absolute", left: 12, top: 0, height: len, width: 116, objectFit: "fill", filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.4))" }} />
    </div>; })}
    {[0, 1, 2].map((k) => <Prop key={k} id="folding_chair" x={160 + k * 190} y={1080} w={240} sh={0.6} style={{ filter: "brightness(.8) blur(1px)" }} />)}
    {[0, 1, 2].map((k) => <Prop key={k} id="folding_chair" x={1400 + k * 190} y={1080} w={240} flip sh={0.6} style={{ filter: "brightness(.8) blur(1px)" }} />)}
    <Prop id="punch_bowl" x={960} y={1110} w={520} sh={0.8} style={{ filter: "blur(3px) brightness(.85)" }} />
  </Cam>;
}} />;

// «the roof on this house needed to be redone»: las botas de Lou arriba del techo de tablas; las tejas asfálticas caen hilera por hilera con su polvito y las botas suben un paso por cada hilera
const HShingleRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), R = 4, Cn = 4, step = Math.min(0.32, (d - 1.6) / (R * Cn)), done = cl((tt - 0.3) / (step * R * Cn));
  return <Cam tt={tt} d={d} z={0.06} fy={620}>
    <Fondo id="le_e08" tt={tt} b={8} br={0.6} />
    <Glow x={1600} y={140} r={420} o={0.5} col="255,220,150" />
    <div style={{ position: "absolute", left: -100, top: 300, width: 2120, height: 780, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 3px,transparent 3px 130px),repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 480px),linear-gradient(#a07a48,#6e4e28)", transform: "perspective(1400px) rotateX(30deg)", transformOrigin: "50% 100%", boxShadow: "0 -20px 40px rgba(0,0,0,.4)", borderTop: "14px solid #4a3218" }}>
      {Array.from({ length: R * Cn }, (_, i) => { const r = Math.floor(i / Cn), c = i % Cn, at = 0.3 + i * step, L = land(tt, at, 220, 11, 0.45); return L.on ? <div key={i} style={{ position: "absolute", left: -20 + c * 560 + (r % 2) * 280, top: 560 - r * 170 + L.dy, width: 540, height: 200 }}><Img src={staticFile("img/l9229e/cut/asphalt_shingle.webp")} style={{ width: 540, height: 200, objectFit: "fill", filter: "drop-shadow(0 12px 8px rgba(0,0,0,.55))" }} /></div> : null; })}
    </div>
    {Array.from({ length: R * Cn }, (_, i) => { const at = 0.3 + i * step + 0.12; return tt > at && tt < at + 1.2 ? <Dust key={i} tt={tt} at={at} x={300 + (i % Cn) * 440} y={980 - Math.floor(i / Cn) * 110} w={220} col="#6a6a6a" /> : null; })}
    <Prop id="work_boots" x={1500 - 120 * done} y={1080 - 260 * done + 10 * Math.abs(Math.sin(tt * 6)) * (done < 1 ? 1 : 0)} w={420} sh={0.9} />
  </Cam>;
}} />;

// «with June's napkins»: la servilleta de cuadros se apoya abierta, se dobla en 3D, y la mano de Lou la aplana pasando la palma sobre el doblez como hacía June
const HNapkinFold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 400, 10, 0.4), f1 = eio(tt, 0.9, 1.6), sw = eio(tt, 1.6, 2.0), X = 680, Y = 560, W = 560;
  const hp = eio(tt, 2.1, 2.5) * (1 - eio(tt, 3.6, 4.0)), hx = X - 160 + 320 * eio(tt, 2.5, 3.5);
  return <Cam tt={tt} d={d} z={0.07} fx={X + 200}>
    <div style={{ position: "absolute", inset: 0, background: OAK }} />
    <Glow x={900} y={300} r={700} o={0.35} col="255,220,170" />
    <Prop id="dinner_plate" x={1340} y={820} w={560} sh={0.7} />
    <Prop id="fork" x={1020} y={760} w={380} r={90} sh={0.5} />
    {L.on && sw < 1 && <div style={{ position: "absolute", left: X - W / 2, top: Y - W / 2 + L.dy, width: W, height: W, perspective: 1600, opacity: 1 - sw }}>
      <div style={{ position: "absolute", left: 0, top: W / 2, width: W, height: W / 2, overflow: "hidden", boxShadow: "0 18px 24px rgba(0,0,0,.35)" }}><Img src={staticFile("img/l9229e/cut/check_napkin_flat.webp")} style={{ width: W, height: W, marginTop: -W / 2 }} /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: W / 2, overflow: "hidden", transformOrigin: "50% 100%", transform: `rotateX(${-178 * f1}deg)`, filter: `brightness(${1 - 0.25 * Math.sin(f1 * Math.PI)})`, boxShadow: "0 10px 18px rgba(0,0,0,.3)" }}><Img src={staticFile("img/l9229e/cut/check_napkin_flat.webp")} style={{ width: W, height: W }} /></div>
    </div>}
    {sw > 0 && <Prop id="check_napkin_folded" x={X + 60 * sw} y={Y + 300} w={460 - 40 * sw} r={8 * sw} o={sw} sh={0.8} sq={1 - 0.03 * hp} />}
    {hp > 0 && <Prop id="hand_flat" x={hx} y={Y + 260 + 420 * (1 - hp)} w={520} r={-8} sh={0} o={hp} />}
  </Cam>;
}} />;

export const HCE4: Record<string, C> = { engineOff: HEngineOff, streamersHall: HStreamersHall, shingleRoof: HShingleRoof, napkinFold: HNapkinFold };
