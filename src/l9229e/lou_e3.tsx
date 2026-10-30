// l9229e · vuelta 2: los 9 flojos rehechos con props reales (contacto del auto, serpentinas de crepé, funda pintada, tejas asfálticas, servilleta a cuadros, despertador, silla de cocina)
import React from "react";
import { Img, staticFile } from "remotion";
import { cl, eio } from "./hkit";
import { S, D, bt, C, Prop, Cam, Mesa, Glow, Rings, land, swing, rnd } from "./pk";
import { Fondo } from "./lk";

const OAK = "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 190px),repeating-linear-gradient(90deg,rgba(255,230,190,.05) 0 1px,transparent 1px 23px),linear-gradient(180deg,#a8763e,#7e5428)";
const HAND = "'Segoe Print','Bradley Hand','Comic Sans MS',cursive";

// «The engine is off»: primer plano del contacto con la llave; la llave gira hacia atrás, la aguja del velocímetro cae a cero y el tablero se apaga
const HEngineOff: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, 0.8), p = eio(tt, at, at + 0.4), dash = 1 - eio(tt, at + 0.15, at + 1.0), needle = 40 + 150 * (1 - eio(tt, at + 0.1, at + 1.2)) + 3 * Math.sin(tt * 9) * dash;
  return <Cam tt={tt} d={d} z={0.06} fx={760} fy={560}>
    <Fondo id="le_e01" tt={tt} b={6} br={0.3 + 0.2 * dash} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0) 30%,rgba(10,8,6,.75))" }} />
    <div style={{ position: "absolute", left: 1150, top: 260, width: 520, height: 520 }}>
      <Prop id="dash_gauge" x={260} y={1080} w={520} sh={0} style={{ filter: `drop-shadow(0 0 ${30 * dash}px rgba(255,170,80,${0.8 * dash})) brightness(${0.55 + 0.45 * dash})` }} />
      <div style={{ position: "absolute", left: 255, top: 260 - 200, width: 10, height: 200, background: `linear-gradient(#fff,#ffb070)`, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${needle - 120}deg)`, boxShadow: `0 0 ${14 * dash}px rgba(255,160,80,${dash})` }} />
      <div style={{ position: "absolute", left: 230, top: 230, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#555,#111)" }} />
    </div>
    <Glow x={1410} y={520} r={360} o={0.6 * dash} col="255,160,70" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "640px 640px", transform: `rotate(${-28 * p}deg)` }}>
      <Prop id="car_ignition" x={640} y={1000} w={720} sh={1} />
    </div>
  </Cam>;
}} />;

// «a band from Waterloo, paper streamers»: serpentinas de crepé amarillas y rojas bajan desenrollándose desde el techo del salón y quedan balanceándose
const HStreamersHall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 9;
  return <Cam tt={tt} d={d} z={0.07} fy={420}>
    <Fondo id="le_e02" tt={tt} b={5} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 60, background: "linear-gradient(#5a3e24,#3a2614)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    {Array.from({ length: N }, (_, k) => { const at = 0.2 + k * 0.16, p = eio(tt, at, at + 0.9), x = 120 + k * 210 + (k % 2) * 30, len = 560 + 220 * rnd(k + 3), a = swing(tt, at + 0.9, 5, 2.6 + rnd(k) * 0.8, 0.4); return tt < at ? null : <div key={k} style={{ position: "absolute", left: x - 90, top: 40, width: 180, height: len * p, overflow: "hidden", transformOrigin: "50% 0", transform: `rotate(${a}deg)` }}>
      <Img src={staticFile(`img/l9229e/cut/${k % 2 ? "crepe_streamer_red" : "crepe_streamer"}.webp`)} style={{ position: "absolute", left: 15, top: 0, height: len, width: 150, objectFit: "fill", filter: "drop-shadow(10px 14px 10px rgba(0,0,0,.4))" }} />
    </div>; })}
    <Glow x={960} y={300} r={600} o={0.3} col="255,210,150" />
  </Cam>;
}} />;

// «And the band started playing Tennessee Waltz»: la funda pintada con la pareja bailando cae en la mesa y el disco sale de adentro girando
const HWaltzSleeve: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 600, 9, 0.4), out = eio(tt, 1.1, 2.0), ang = 140 * Math.max(0, tt - 1.1);
  return <Cam tt={tt} d={d} z={0.07} fx={1060}>
    <Fondo id="le_e04" tt={tt} b={12} br={0.4} />
    <Mesa y0={780} tone="#8a5e34" />
    {L.on && <div style={{ position: "absolute", inset: 0, transform: `translateY(${L.dy}px)` }}>
      <Prop id="vinyl_record" x={820 + 560 * out} y={990 - 20 * out} w={600} sh={out} r={ang} style={{ transformOrigin: "50% 50%" }} />
      <div style={{ position: "absolute", left: 820 + 560 * out - 75, top: 690 - 20 * out - 75, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(#111 0 9%, #c0392b 10% 100%)", opacity: out > 0.05 ? 1 : 0, transform: `rotate(${ang}deg)` }} />
      <Prop id="record_sleeve_art" x={760} y={1010} w={640} r={-3} sq={L.sq} />
    </div>}
    {out > 0.9 && <Glow x={1380} y={690} r={340} o={0.5} />}
  </Cam>;
}} />;

// «the roof on this house needed to be redone»: sobre las tablas del techo, las tejas asfálticas bajan de a una hilera por hilera, cada una con su sombra
const HShingleRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), R = 4, Cn = 4, step = Math.min(0.35, (d - 1.4) / (R * Cn));
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="le_e08" tt={tt} b={8} br={0.6} />
    <div style={{ position: "absolute", left: 0, top: 300, width: 1920, height: 780, background: "repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 3px,transparent 3px 130px),linear-gradient(#b08a58,#8a6638)", transform: "perspective(1400px) rotateX(30deg)", transformOrigin: "50% 100%", boxShadow: "0 -20px 40px rgba(0,0,0,.4)" }}>
      {Array.from({ length: R * Cn }, (_, i) => { const r = Math.floor(i / Cn), c = i % Cn, at = 0.3 + i * step, L = land(tt, at, 220, 11, 0.45); return L.on ? <div key={i} style={{ position: "absolute", left: -120 + c * 560 + (r % 2) * 280, top: 560 - r * 170 + L.dy, width: 540, height: 200 }}><Img src={staticFile("img/l9229e/cut/asphalt_shingle.webp")} style={{ width: 540, height: 200, objectFit: "fill", filter: "drop-shadow(0 12px 8px rgba(0,0,0,.55))" }} /></div> : null; })}
    </div>
  </Cam>;
}} />;

// «with June's napkins»: la servilleta de cuadros de June se apoya abierta junto al plato, se dobla por la mitad en 3D y queda doblada en triángulo
const HNapkinFold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 400, 10, 0.4), f1 = eio(tt, 0.9, 1.6), sw = eio(tt, 1.6, 2.0), X = 680, Y = 560, W = 560;
  return <Cam tt={tt} d={d} z={0.07} fx={X + 200}>
    <div style={{ position: "absolute", inset: 0, background: OAK }} />
    <Prop id="dinner_plate" x={1340} y={820} w={560} sh={0.7} />
    <Prop id="fork" x={1020} y={760} w={380} r={90} sh={0.5} />
    {L.on && sw < 1 && <div style={{ position: "absolute", left: X - W / 2, top: Y - W / 2 + L.dy, width: W, height: W, perspective: 1600, opacity: 1 - sw }}>
      <div style={{ position: "absolute", left: 0, top: W / 2, width: W, height: W / 2, overflow: "hidden", boxShadow: "0 18px 24px rgba(0,0,0,.35)" }}><Img src={staticFile("img/l9229e/cut/check_napkin_flat.webp")} style={{ width: W, height: W, marginTop: -W / 2 }} /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: W / 2, overflow: "hidden", transformOrigin: "50% 100%", transform: `rotateX(${-178 * f1}deg)`, filter: `brightness(${1 - 0.25 * Math.sin(f1 * Math.PI)})`, boxShadow: "0 10px 18px rgba(0,0,0,.3)" }}><Img src={staticFile("img/l9229e/cut/check_napkin_flat.webp")} style={{ width: W, height: W }} /></div>
    </div>}
    {sw > 0 && <Prop id="check_napkin_folded" x={X + 60 * sw} y={Y + 300} w={460 - 40 * sw} r={8 * sw} o={sw} sh={0.8} />}
  </Cam>;
}} />;

// «I sent one of my meatloaf last week»: la foto del pan de carne en un celular; el pulgar toca enviar, la foto vuela en arco y aterriza en otro celular que se ilumina
const HPhotoSend: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), go = bt(h, 0, 1.5), q = eio(tt, go, go + 0.9), land2 = tt > go + 0.9, thumb = eio(tt, go - 0.5, go - 0.1) * (1 - eio(tt, go + 0.1, go + 0.4));
  const A = { x: 520, y: 1040, w: 420 }, B = { x: 1420, y: 1000, w: 360 };
  const sx = A.x, sy = 540, ex = B.x, ey = 560, fx = sx + (ex - sx) * q, fy = sy + (ey - sy) * q - 380 * Math.sin(q * Math.PI), fs = 1 - 0.55 * Math.sin(q * Math.PI);
  const Shot = ({ w }: { w: number }) => <div style={{ width: w, height: w * 0.78, borderRadius: 10, overflow: "hidden", background: "#f3ece0", boxShadow: "0 10px 20px rgba(0,0,0,.35)", position: "relative" }}><div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 70%,#f6e6c4,#d8c09a)" }} /><Img src={staticFile("img/l9229e/cut/meatloaf_pan.webp")} style={{ position: "absolute", left: "8%", bottom: "6%", width: "84%" }} /></div>;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="le_e25" tt={tt} b={14} br={0.45} />
    <Mesa y0={820} tone="#c8a060" />
    <Prop id="smartphone" x={A.x} y={A.y} w={A.w} />
    <div style={{ position: "absolute", left: A.x - A.w * 0.4, top: A.y - A.w * 1.85, width: A.w * 0.8, height: A.w * 1.6, borderRadius: 18, background: "#1c2228", overflow: "hidden" }}>
      {q === 0 && <div style={{ position: "absolute", left: A.w * 0.04, top: A.w * 0.4 }}><Shot w={A.w * 0.72} /></div>}
      <div style={{ position: "absolute", left: "50%", bottom: 26, width: 140, height: 50, marginLeft: -70, borderRadius: 25, background: "#2f8ae0", color: "#fff", fontFamily: "Arial", fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.1 * thumb})` }}>SEND</div>
    </div>
    <Prop id="smartphone" x={B.x} y={B.y} w={B.w} r={4} />
    <div style={{ position: "absolute", left: B.x - B.w * 0.4, top: B.y - B.w * 1.85, width: B.w * 0.8, height: B.w * 1.6, borderRadius: 16, background: land2 ? "#2a3038" : "#14181c", overflow: "hidden", transform: "rotate(4deg)", boxShadow: land2 ? "0 0 60px rgba(255,220,150,.5)" : "none" }}>
      {land2 && <div style={{ position: "absolute", left: B.w * 0.04, top: B.w * 0.4, transform: `scale(${0.9 + 0.1 * eio(tt, go + 0.9, go + 1.2)})` }}><Shot w={B.w * 0.72} /></div>}
    </div>
    {q > 0 && q < 1 && <div style={{ position: "absolute", left: fx - 150 * fs, top: fy - 117 * fs, transform: `scale(${fs}) rotate(${-12 * Math.sin(q * Math.PI)}deg)` }}><Shot w={300} /></div>}
    <Prop id="hand_pinch" x={A.x + 230 + 60 * (1 - thumb)} y={A.y + 260 - 80 * thumb} w={520} sh={0} r={-24} />
  </Cam>;
}} />;

// «Step three. Set the time»: el despertador rojo cae en la mesa de la cocina; una cuña roja se pinta en la esfera hasta la hora elegida y las campanas vibran
const HSetTime: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 600, 9, 0.4), p = eio(tt, 0.9, 2.2), ring = tt > 2.3 && tt < 3.3 ? 3 * Math.sin(tt * 70) : 0, X = 960, Y = 1000, W = 520, FX = X, FY = Y - W * 1.25 * 0.47, FR = W * 0.25;
  return <Cam tt={tt} d={d} z={0.06} fy={620}>
    <Fondo id="le_e11" tt={tt} b={10} br={0.55} />
    <Mesa y0={800} tone="#9a6c3e" />
    {L.on && <div style={{ position: "absolute", inset: 0, transform: `translateY(${L.dy}px) rotate(${ring}deg)`, transformOrigin: `${X}px ${Y}px` }}>
      <Prop id="alarm_clock" x={X} y={Y} w={W} sq={L.sq} />
      <div style={{ position: "absolute", left: FX - FR, top: FY - FR, width: 2 * FR, height: 2 * FR, borderRadius: "50%", background: `conic-gradient(from 0deg, rgba(200,40,30,.8) ${120 * p}deg, #f2ead6 ${120 * p}deg)` }} />
      <div style={{ position: "absolute", left: FX - 5, top: FY - FR * 0.92, width: 10, height: FR * 0.92, background: "#151515", borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${120 * p}deg)` }} />
      <div style={{ position: "absolute", left: FX - 7, top: FY - FR * 0.6, width: 14, height: FR * 0.6, background: "#151515", borderRadius: 7, transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", left: FX - 12, top: FY - 12, width: 24, height: 24, borderRadius: "50%", background: "#151515" }} />
    </div>}
    {ring !== 0 && <Rings tt={tt} at={2.3} x={X} y={Y - W * 1.1} s={1.1} />}
  </Cam>;
}} />;

// «write down what happened. One line»: en la ficha el lápiz escribe a mano una sola línea de verdad y la fecha arriba
const HWriteLine: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 400, 10, 0.4), dt = eio(tt, 0.6, 1.0), p = eio(tt, 1.1, Math.min(d - 0.6, 3.2)), px = 560 + 860 * p, py = 600;
  return <Cam tt={tt} d={d} z={0.08} fx={px} fy={560}>
    <div style={{ position: "absolute", inset: 0, background: OAK }} />
    {L.on && <div style={{ position: "absolute", left: 460, top: 300 + L.dy, width: 1040, height: 560, background: "repeating-linear-gradient(transparent 0 78px,rgba(70,110,180,.35) 78px 81px),#fbf8f0", borderTop: "10px solid #e05050", boxShadow: "0 24px 40px rgba(0,0,0,.4)", transform: "rotate(-2deg)" }}>
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: HAND, fontSize: 46, color: "#3a3a4a", clipPath: `inset(0 ${100 - 100 * dt}% 0 0)` }}>Tues.</div>
      <div style={{ position: "absolute", left: 90, top: 250, fontFamily: HAND, fontSize: 62, color: "#22223a", whiteSpace: "nowrap", clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }}>Called Earl. He came over.</div>
    </div>}
    <Prop id="pencil" x={px + 70} y={py + 300} w={150} r={28} sh={0.3} />
  </Cam>;
}} />;

// «I set the table for one»: la mesa de roble desde arriba; plato, tenedor, cuchillo, vaso y servilleta llegan de a uno, y del otro lado la silla de June queda vacía
const HTableForOne: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.2, bt(h, 0, 1.2), bt(h, 1, 2.0), bt(h, 2, 2.8), bt(h, 3, 3.6)], ch = eio(tt, at[4] + 0.5, at[4] + 1.4);
  const it = [{ id: "dinner_plate", x: 960, y: 820, w: 500, fx: 960, fy: -400 }, { id: "fork", x: 620, y: 770, w: 380, fx: -400, fy: 770 }, { id: "table_knife", x: 1300, y: 770, w: 400, fx: 2400, fy: 770 }, { id: "water_glass", x: 1360, y: 560, w: 170, fx: 2300, fy: 300 }, { id: "check_napkin_folded", x: 470, y: 860, w: 260, fx: -400, fy: 1000 }];
  return <Cam tt={tt} d={d} z={0.07} fy={600 - 120 * ch}>
    <div style={{ position: "absolute", inset: 0, background: "#3a2a1c" }} />
    <Img src={staticFile("img/l9229e/cut/dinner_table_wood.webp")} style={{ position: "absolute", left: 160, top: 80, width: 1600, height: 1000, objectFit: "fill", filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }} />
    {it.map((o, k) => { const p = eio(tt, at[k], at[k] + 0.45); return tt < at[k] ? null : <Prop key={k} id={o.id} x={o.fx + (o.x - o.fx) * p} y={o.fy + (o.y - o.fy) * p} w={o.w} r={k === 1 || k === 2 ? 90 : 0} sh={0.6} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 300px", transform: `scaleY(${1 - 0.15 * ch})`, opacity: 0.35 + 0.65 * ch }}>
      <Prop id="kitchen_chair" x={960} y={330} w={300} r={180} sh={0} style={{ transformOrigin: "50% 50%", filter: "brightness(.8) drop-shadow(0 -10px 14px rgba(0,0,0,.5))" }} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(0,0,0,.5))" }} />
  </Cam>;
}} />;

export const HCE3: Record<string, C> = {
  engineOff: HEngineOff, streamersHall: HStreamersHall, waltzSleeve: HWaltzSleeve, shingleRoof: HShingleRoof, napkinFold: HNapkinFold,
  photoSend: HPhotoSend, setTime: HSetTime, writeLine: HWriteLine, tableForOne: HTableForOne,
};
