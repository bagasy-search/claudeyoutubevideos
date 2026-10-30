// l9229b «Neighbor» · los componentes únicos (uno por minuto) sobre Elm Street: objetos FOTORREALES recortados (agnes → rembg)
// animados por código sobre fotos reales del barrio (desenfocadas = profundidad). Lo aprendido en a: manos de foto, el objeto que
// hace la acción, la acción clave a los ≈0,6 s y a la mitad, todo el texto adentro del cuadro y escrito EN la escena (tiza, tinta, pintura).
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

const Tiza: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; size?: number; r?: number }> = ({ tt, at, x, y, txt, size = 110, r = -3 }) => {
  const p = cl((tt - at) / 0.8); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: size, color: "rgba(250,248,240,.92)", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, textShadow: "0 0 2px rgba(255,255,255,.6)", whiteSpace: "nowrap" }}>{txt}</div>;
};

// m0 · la mudanza: el camión entra marcha atrás al garaje de enfrente, las balizas ámbar titilan y cada «bip» sale en anillos
const HDollyBeep: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.2, d * 0.62), x = 2250 - 1050 * p, blink = Math.floor(tt * 2.5) % 2 === 0 && p < 0.99;
  return <Cam tt={tt} d={d} z={0.05} fx={1100}>
    <Fondo id="lb_e02" tt={tt} b={3} br={0.7} />
    <Prop id="moving_truck" x={x} y={1000 + 3 * Math.sin(tt * 14) * (p < 0.99 ? 1 : 0)} w={820} sh={1} />
    <Glow x={x - 500} y={720} r={140} o={blink ? 1.4 : 0.1} col="255,170,40" />
    <Glow x={x - 500} y={880} r={110} o={blink ? 1.2 : 0.1} col="255,90,40" />
    {Array.from({ length: 8 }, (_, i) => <Rings key={i} tt={tt} at={0.4 + i * 0.8} x={x - 520} y={800} s={0.7} />)}
  </Cam>;
}} />;

// m1 · la ventana de Lou: la cinta métrica se estira por el piso del living y sus marcas son años, hasta frenar en 66
const HTapeSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d / 2 + 0.6) , len = 1150 * p, yrs = Math.round(66 * p);
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lb_e02" tt={tt} b={9} br={0.45} />
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: "repeating-linear-gradient(90deg,#7a5232 0 6px,#a0724a 6px 180px)", transform: "perspective(900px) rotateX(55deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 360, top: 830, width: len, height: 70, background: "linear-gradient(#f6d23a,#d8a812)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: 67 }, (_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 20.6, top: 0, width: 3, height: i % 10 === 0 ? 46 : 22, background: "#222" }} />)}
      {Array.from({ length: 7 }, (_, i) => <div key={"n" + i} style={{ position: "absolute", left: 24 + i * 206, top: 30, fontFamily: SER, fontWeight: 900, fontSize: 34, color: "#222" }}>{i * 10}</div>)}
    </div>
    <Prop id="tape_measure" x={300} y={960} w={300} />
    <div style={{ position: "absolute", left: 360 + len - 70, top: 650, width: 220, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 150, color: "#fff4d6", textShadow: "0 8px 20px rgba(0,0,0,.7)", opacity: cl(p * 4) }}>{yrs}</div>
  </Cam>;
}} />;

// m2 · se van de a una casa: el piano vertical baja por el tablón de la mudanza, frena a la mitad y aterriza en la vereda con polvo
const HPianoRamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = tt < mid ? 0.55 * eio(tt, 0.3, mid - 0.4) : 0.55 + 0.45 * eio(tt, mid, mid + 0.9), ang = -16;
  const x = 560 + 820 * p, y = 640 + 300 * p, landed = p > 0.99;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e03" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "linear-gradient(#9a948a,#6a665e)" }} />
    <div style={{ ...BOX, transformOrigin: "560px 700px", transform: `rotate(${-ang}deg)` }}><Prop id="wood_plank" x={1000} y={720} w={1000} sh={0} /></div>
    <Prop id="upright_piano" x={x} y={y + 40 + (landed ? 0 : 0)} w={460} r={landed ? 0 : 16} sq={landed ? cl(1 - (tt - mid - 0.9) * 3) : 0} />
    {landed && <Dust tt={tt} at={mid + 0.9} x={x} y={1000} w={500} />}
  </Cam>;
}} />;

// m3 · la nota de bienvenida de 1960: el imán de ananá cae sobre la heladera (clac) y la nota que sostiene aletea y se queda
const HPineappleNote: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), m = land(tt, 0.4, 500, 10, 0.3), fl = swing(tt, 0.6, 9, 4, 0.7);
  return <Cam tt={tt} d={d} z={0.07} fy={420}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Prop id="fridge" x={960} y={1120} w={900} />
    <div style={{ position: "absolute", left: 790, top: 250, width: 360, height: 300, transformOrigin: "50% 0", transform: `rotate(${fl + 2}deg)`, background: "linear-gradient(#fffbea,#f2e8c8)", boxShadow: "8px 14px 18px rgba(0,0,0,.35)", padding: 26, opacity: m.on ? 1 : 0 }}>
      <Ink tt={tt} at={1.2} dur={2.2} x={26} y={50} txt="Welcome to Elm St." size={52} w={320} />
      <Ink tt={tt} at={3.6} dur={1.6} x={26} y={190} txt="— the Haversons" size={44} w={320} col="#5a3a2a" />
    </div>
    {m.on && <Prop id="pineapple_magnet" x={970} y={330 + m.dy} w={130} sq={m.sq} sh={0.4} />}
  </Cam>;
}} />;

// m4 · Elm Street en 1960: las casitas brotan de a una en dos hileras hacia el fondo y se les prende la luz del porche
const HHouseRows: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06} fy={560}>
    <Fondo id="lb_e05" tt={tt} b={10} br={0.35} />
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 520, background: "linear-gradient(#3a4a2a,#1e2814)" }} />
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 520, clipPath: "polygon(48% 0,52% 0,80% 100%,20% 100%)", background: "linear-gradient(#6a665e,#3a3832)" }} />
    {Array.from({ length: 22 }, (_, i) => { const side = i % 2 ? 1 : -1, k = 10 - Math.floor(i / 2), v = k / 10, at = 0.2 + (10 - k) * 0.35, L = land(tt, at, 300 * (1 - v * 0.5), 10, 0.35);
      const x = 960 + side * (90 + 760 * (1 - v)), y = 590 + 470 * (1 - v), w = 90 + 330 * (1 - v);
      return L.on ? <React.Fragment key={i}><Prop id="small_house" x={x} y={y + L.dy} w={w} flip={side > 0} sq={L.sq} sh={0.6} />
        <Glow x={x + side * -w * 0.1} y={y - w * 0.25} r={w * 0.3} o={cl((tt - at - 0.5) * 2) * 0.9} /></React.Fragment> : null; })}
  </Cam>;
}} />;

// m5 · la kringle de Navidad de la señora Lindqvist: el glaseado cae en zigzag sobre la masa caliente, con nieve detrás de la ventana
const HKringleIce: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.5), N = 9, pts = Array.from({ length: N * 2 + 2 }, (_, i) => `${600 + i * 36},${i % 2 ? 530 + 20 * Math.sin(i) : 690 + 14 * Math.cos(i)}`).join(" ");
  return <Cam tt={tt} d={d} z={0.07} fy={680}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Nieve tt={tt} n={60} wind={0.4} o={0.5} />
    <Formica y0={720} />
    <div style={{ position: "absolute", left: 470, top: 640, width: 980, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,#fbfaf4 55%,#d8d4c8 70%)", boxShadow: "0 18px 24px rgba(0,0,0,.4)" }} />
    <Prop id="kringle" x={960} y={890} w={900} sh={0} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><polyline points={pts} fill="none" stroke="#fffdf4" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={3400} strokeDashoffset={3400 * (1 - p)} style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,.3))" }} /></svg>
    {Array.from({ length: 3 }, (_, k) => { const q = (tt * 0.45 + k / 3) % 1; return <Puff key={k} x={760 + k * 200 + 30 * Math.sin(q * 6)} y={700 - 260 * q} r={40 + 60 * q} o={(1 - q) * 0.35} />; })}
  </Cam>;
}} />;

// m6 · la pelota de los Kowalski: llega girando desde el fondo de la calle y a la mitad estalla contra el vidrio en una telaraña de grietas
const HBallCrack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = d / 2, p = cl((tt - 0.4) / (hit - 0.4)), cr = cl((tt - hit) / 0.35), sh = tt > hit && tt < hit + 0.25 ? 10 * Math.sin((tt - hit) * 90) : 0;
  const bx = 1500 - 560 * p, by = 300 + 200 * p - 160 * Math.sin(p * Math.PI), bw = 40 + 170 * p * p;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e07" tt={tt} b={6} br={0.55} />
    <div style={{ ...BOX, transform: `translate(${sh}px,${sh * 0.5}px)` }}><Prop id="window_pane" x={960} y={1060} w={1000} sh={0} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2 + rnd(i), L = (180 + 260 * rnd(i + 4)) * cr; return <path key={i} d={`M940,500 L${940 + Math.cos(a) * L * 0.5 + 20 * rnd(i + 8)},${500 + Math.sin(a) * L * 0.5} L${940 + Math.cos(a) * L},${500 + Math.sin(a) * L}`} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={3} />; })}
      {[70, 140].map((r, i) => <circle key={i} cx={940} cy={500} r={r * cr} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={2} strokeDasharray="30 18" />)}
    </svg>
    {tt < hit + 0.05 ? <Prop id="baseball" x={bx} y={by + bw / 2} w={bw} r={tt * 600} sh={0} /> : <Prop id="baseball" x={940 + 200 * (tt - hit)} y={600 + 900 * (tt - hit) ** 2} w={200} r={tt * 300} sh={0} />}
  </Cam>;
}} />;

// m7 · Bud el cartero: del bolso de cuero salen los sobres en abanico, cada uno con el apellido de una casa
const HMailFan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), nm = ["Lindqvist", "Kowalski", "Dietz", "Haverson", "Pruitt", "Lou & June", "Nguyen"];
  return <Cam tt={tt} d={d} z={0.06} fy={800}>
    <Fondo id="lb_e08" tt={tt} b={9} br={0.45} />
    <Mesa y0={880} tone="#7a5a3a" />
    {nm.map((n, i) => { const at = 0.3 + i * (d / 2 - 0.3) / nm.length, p = phys(tt, at, 6, 0.5), a = (-60 + i * 20) * p;
      return tt > at ? <div key={i} style={{ position: "absolute", left: 960 - 230, top: 470, width: 460, height: 290, transformOrigin: "50% 160%", transform: `rotate(${a}deg) translateY(${-60 * p}px)`, background: "linear-gradient(#f6efdc,#e2d6b6)", boxShadow: "6px 12px 16px rgba(0,0,0,.4)", border: "1px solid #c8b890" }}>
        <div style={{ position: "absolute", left: 30, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: "#22314f" }}>{n}</div>
        <div style={{ position: "absolute", right: 24, top: 20, width: 60, height: 74, background: "#b3322a", border: "4px dashed #fff" }} /></div> : null; })}
    <Prop id="mail_bag" x={960} y={1060} w={620} />
  </Cam>;
}} />;

// m8 · Peter se cae de la bici: la rueda delantera queda girando y frena; en la vereda, la tiza escribe su nombre
const HWheelName: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fall = phys(tt, 0.2, 6, 0.45);
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="L_porche" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 320, background: "repeating-linear-gradient(90deg,#9a968e 0 360px,#7a766e 360px 366px)", transform: "perspective(800px) rotateX(50deg)", transformOrigin: "50% 0" }} />
    <Prop id="kids_bike" x={820} y={1000} w={700} r={-14 * fall} />
    <Tiza tt={tt} at={d / 2} x={1300} y={980} txt="Peter" size={170} r={-6} />
  </Cam>;
}} />;

// m9 · la ficha de June: en una ficha pegada a la heladera la mano dibuja la calle, las cajitas de las casas y escribe un nombre en cada una
const HStreetCard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), road = eio(tt, 0.3, 1.2), nm = ["Lindqvist", "Kowalski", "Dietz", "Pruitt", "Haverson", "Ruth", "Bud", "Peter"];
  const cur = Math.min(7, Math.max(0, Math.floor((tt - 1.4) / ((d - 2.2) / 8)))), bx = (i: number) => 120 + (i % 4) * 330, by = (i: number) => i < 4 ? 120 : 520;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 300, top: 120, width: 1400, height: 820, background: "repeating-linear-gradient(#fdfaf0 0 58px,#b9cfe2 58px 60px)", borderTop: "14px solid #c0392b", transform: "rotate(-1.5deg)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 40, top: 400, width: 1320 * road, height: 26, background: "#555", borderRadius: 13 }} />
      {nm.map((n, i) => <React.Fragment key={i}>
        <div style={{ position: "absolute", left: bx(i), top: by(i), width: 260, height: 180, border: "5px solid #444", opacity: cl((tt - 0.8 - i * 0.07) * 4), borderRadius: 4 }} />
        <Ink tt={tt} at={1.4 + i * (d - 2.2) / 8} dur={(d - 2.2) / 8 * 0.8} x={bx(i) + 14} y={by(i) + 50} txt={n} size={56} w={240} />
      </React.Fragment>)}
    </div>
    <Prop id="hand_pen" x={300 + bx(cur) + 230 + 200 * cl(((tt - 1.4) % ((d - 2.2) / 8)) / ((d - 2.2) / 8))} y={120 + by(cur) + 360} w={480} sh={0.4} />
  </Cam>;
}} />;

// m10 · los diarios del señor Dietz se apilan en el escalón, uno por día, y la tiza va contando
const HPaperStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.2, 1.2, 2.2, 3.2];
  return <Cam tt={tt} d={d} z={0.08} fy={800}>
    <Fondo id="lb_e11" tt={tt} b={8} br={0.45} />
    <div style={{ position: "absolute", left: 300, top: 800, width: 1320, height: 280, background: "linear-gradient(#8a847a,#5a564e)", boxShadow: "inset 0 14px 0 #a8a298" }} />
    {st.map((a, i) => { const L = land(tt, a, 600, 10, 0.35); return L.on ? <Prop key={i} id="newspaper" x={900 + 20 * (rnd(i) - 0.5)} y={870 - i * 46 + L.dy} w={520} r={(rnd(i + 3) - 0.5) * 12} sq={L.sq} sh={i === 0 ? 1 : 0.5} /> : null; })}
    {st.map((a, i) => <div key={"t" + i} style={{ position: "absolute", left: 1350 + i * 44, top: 520, width: 10, height: 150, background: "rgba(250,248,240,.9)", transform: "rotate(6deg)", opacity: cl((tt - a - 0.4) * 4) }} />)}
  </Cam>;
}} />;

// m11 · la señal del señor Dietz: la cortina se abre cada mañana (luz que entra en cuña) — a la mitad, no se abre y el cuarto queda en sombra
const HCurtainSun: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, op = tt < mid ? eio(tt, 0.3, 1.4) : 1 - eio(tt, mid, mid + 1.0), dark = eio(tt, mid, mid + 1.4);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e12" tt={tt} b={5} br={0.75 - 0.4 * dark} />
    <div style={{ position: "absolute", left: 560, top: 100, width: 800, height: 620, background: "linear-gradient(#bcd8ec,#f2e6c4)", boxShadow: "inset 0 0 0 26px #efe8d6, 0 20px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 600, top: 140, width: 720, height: 540, background: "linear-gradient(90deg, transparent 49%, #efe8d6 49% 51%, transparent 51%), linear-gradient(transparent 49%, #efe8d6 49% 51%, transparent 51%)" }} />
    {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: s < 0 ? 520 : 960 + 420 * op * 0.95, top: 70, width: 440 - 420 * op * 0.95 + (s < 0 ? 0 : 0), height: 700, ...(s < 0 ? { width: 440 - 400 * op } : {}), background: "repeating-linear-gradient(90deg,#a84a3a 0 30px,#8a3a2c 30px 60px)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />)}
    <div style={{ position: "absolute", left: 480, top: 700, width: 1100, height: 380, background: "rgba(255,226,160,.5)", clipPath: "polygon(10% 0,90% 0,100% 100%,0 100%)", opacity: op, mixBlendMode: "screen", filter: "blur(10px)" }} />
    <div style={{ ...BOX, background: "rgba(10,14,24,.45)", opacity: dark }} />
  </Cam>;
}} />;

// m12 · el canje de llaves: la llave de bronce y la plateada cruzan en arco por encima de la mesa y cada una cae en la mano del otro
const HKeySwap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d / 2), arc = Math.sin(p * Math.PI) * 300, Lb = phys(tt, d / 2, 7, 0.4);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e29" tt={tt} b={10} br={0.45} />
    <Mesa y0={760} />
    <Prop id="hand_flat" x={460} y={980} w={460} sh={0.5} />
    <Prop id="hand_flat" x={1460} y={980} w={460} flip sh={0.5} />
    <Prop id="brass_key" x={460 + 1000 * p} y={900 - arc + (p >= 1 ? 10 * (1 - Lb) : 0)} w={170} r={90 + p * 360} sh={p >= 1 ? 1 : 0} />
    <Prop id="silver_key" x={1460 - 1000 * p} y={900 - arc * 0.8 + (p >= 1 ? 10 * (1 - Lb) : 0)} w={170} r={-90 - p * 360} sh={p >= 1 ? 1 : 0} />
    <Glow x={960} y={600} r={300} o={cl(1 - Math.abs(p - 0.5) * 4) * 0.8} />
  </Cam>;
}} />;

// m13 · la inundación del 93: la olla de sopa se inclina y llena cuatro frascos uno tras otro
const HFloodJars: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tilt = eio(tt, 0.3, 0.9), seg = (d - 1.6) / 4, cur = Math.min(3, Math.floor(cl((tt - 0.9) / (d - 1.6)) * 4)), lvl = (i: number) => cl((tt - 0.9 - i * seg) / seg);
  const X = [600, 840, 1080, 1320], px = X[cur] - 160;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e14" tt={tt} b={8} br={0.45} />
    <Formica y0={820} />
    {X.map((x, i) => <React.Fragment key={i}>
      <Prop id="mason_jar" x={x} y={960} w={200} />
      <div style={{ position: "absolute", left: x - 74, top: 935 - 200 * lvl(i), width: 148, height: 200 * lvl(i), background: "linear-gradient(rgba(214,130,50,.85),rgba(150,74,24,.9))", borderRadius: "0 0 16px 16px", boxShadow: "inset 10px 0 12px rgba(255,220,170,.35)" }} />
    </React.Fragment>)}
    {tt > 0.9 && tt < d - 0.7 && <div style={{ position: "absolute", left: X[cur] - 8, top: 520, width: 16, height: 420 - 230 * lvl(cur), background: "linear-gradient(90deg,#a8601e,#d8903e,#a8601e)", borderRadius: 8 }} />}
    <div style={{ ...BOX, transformOrigin: `${px + 200}px 460px`, transform: `translateX(${tt > 0.9 ? 0 : 0}px) rotate(${-55 * tilt}deg)` }}><Prop id="soup_pot" x={px + 260} y={560} w={420} sh={0} style={{ transition: "none" }} /></div>
  </Cam>;
}} />;

// m14 · la escalera prestada: la sección de arriba sube tramo a tramo contra la canaleta, con el clac de cada traba
const HLadderUp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), steps = [0.4, 1.4, 2.4, d / 2], ext = steps.reduce((a, s, i) => a + 170 * phys(tt, s, 9, 0.35) * (i < 4 ? 1 : 0), 0);
  return <Cam tt={tt} d={d} z={0.05} fy={500}>
    <Fondo id="lb_e15" tt={tt} b={6} br={0.6} />
    <div style={{ ...BOX, transformOrigin: "960px 1060px", transform: "rotate(8deg)" }}>
      <Prop id="ladder" x={960} y={1080} w={300} sh={1} />
      <div style={{ ...BOX, transform: `translateY(${-ext}px)` }}><Prop id="ladder" x={975} y={1000} w={280} sh={0} style={{ filter: "brightness(.9)" }} /></div>
    </div>
  </Cam>;
}} />;

// m15 · la taza de azúcar es un bumerán: se va vacía por la derecha y vuelve llena, con un frasco de mermelada de regalo al lado
const HSugarBack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, go = eio(tt, 0.4, mid - 0.4), back = eio(tt, mid, mid + 1.4), x = 760 + 1500 * go - 1500 * back, full = tt > mid;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={760} />
    <Prop id="sugar_cup" x={x}  y={930 - 120 * Math.sin(Math.PI * (go - back) ) * (go < 1 || back > 0 ? 1 : 0)} w={380} r={tt < mid ? 20 * go : -20 * (1 - back)} />
    {full && <div style={{ position: "absolute", left: x - 100, top: 770, width: 200, height: 40, borderRadius: "50%", background: "radial-gradient(#ffffff,#e8e4dc)" }} />}
    {back > 0.6 && <Prop id="mason_jar" x={x + 260 + 400 * (1 - back)} y={940} w={170} r={0} sh={1} />}
  </Cam>;
}} />;

// m16 · el vecino que te sopla la nieve: la sopladora cruza la entrada y tira un arco de nieve que llueve sobre la vereda de Lou
const HBlowerArc: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), x = 300 + 1100 * eio(tt, 0.2, d - 0.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e16" tt={tt} b={5} br={0.6} />
    <Nieve tt={tt} n={50} wind={0.8} o={0.6} />
    <div style={{ position: "absolute", left: 0, top: 880, width: 1920, height: 200, background: "linear-gradient(#f2f6f8,#cfd8de)" }} />
    <div style={{ position: "absolute", left: 0, top: 880, width: x, height: 200, background: "linear-gradient(#8a8a86,#6a6a66)" }} />
    {Array.from({ length: 70 }, (_, k) => { const q = ((tt * 1.3 + rnd(k)) % 1); return <div key={k} style={{ position: "absolute", left: x - 40 - 700 * q, top: 600 - 520 * Math.sin(q * Math.PI) + 40 * rnd(k + 2) + 260 * q, width: 10 + 10 * rnd(k), height: 10 + 10 * rnd(k), borderRadius: "50%", background: "#fff", opacity: 0.9 * (1 - q * 0.5) }} />; })}
    <Prop id="snowblower" x={x} y={1010 + 3 * Math.sin(tt * 20)} w={520} flip />
  </Cam>;
}} />;

// m17 · las cercas: los paneles brotan del pasto de a uno y tapan las casas de atrás
const HFenceRise: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e17" tt={tt} b={4} br={0.65} />
    {Array.from({ length: 5 }, (_, i) => { const p = phys(tt, 0.3 + i * 0.6, 8, 0.4); return <div key={i} style={{ ...BOX, clipPath: "inset(0 0 0 0)" }}><Prop id="fence_panel" x={200 + i * 380} y={1040 + 700 * (1 - p)} w={640} sh={p > 0.9 ? 1 : 0} /></div>; })}
  </Cam>;
}} />;

// m18 · una sola silla al frente: la reposera plegada se abre de un golpe en el porche, con el rebote del aluminio
const HChairUnfold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = phys(tt, 0.5, 8, 0.38);
  return <Cam tt={tt} d={d} z={0.08} fy={800}>
    <Fondo id="lb_e18" tt={tt} b={7} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 880, width: 1920, height: 200, background: "repeating-linear-gradient(90deg,#8a6a4a 0 6px,#a8845e 6px 200px)" }} />
    <Prop id="lawn_chair" x={960} y={1010} w={560} style={{ transform: `scale(${0.25 + 0.75 * p},${1.1 - 0.1 * p})`, transformOrigin: "50% 100%" }} />
    <Glow x={960} y={780} r={360} o={cl((tt - 1.2) * 2) * 0.6} />
  </Cam>;
}} />;

// m19 · dos minutos en los escalones: el termo y la taza se acercan y chocan a la mitad, con vapor
const HTwoCups: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), bump = tt > mid ? swing(tt, mid, 14, 9, 3) : 0;
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lb_e19" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 840, width: 1920, height: 240, background: "linear-gradient(#8a847a,#5a564e)", boxShadow: "inset 0 10px 0 #a8a298" }} />
    <Prop id="thermos_cup" x={420 + 420 * p - bump} y={960} w={300} r={tt > mid ? -bump * 0.4 : 0} />
    <Prop id="coffee_mug2" x={1500 - 420 * p + bump} y={960} w={320} flip r={tt > mid ? bump * 0.4 : 0} />
    <Glow x={960} y={760} r={200} o={tt > mid ? cl(1 - (tt - mid) * 1.5) * 1.4 : 0} col="255,255,230" />
    {Array.from({ length: 4 }, (_, k) => { const q = (tt * 0.5 + k / 4) % 1; return <Puff key={k} x={k % 2 ? 1500 - 420 * p : 420 + 420 * p} y={720 - 260 * q} r={30 + 50 * q} o={(1 - q) * 0.35} />; })}
  </Cam>;
}} />;

// m20 · la noche del abrigo finito: el termómetro del porche se desploma bajo cero y la escarcha avanza desde los bordes
const HMercuryDrop: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d * 0.6), fr = eio(tt, 0.8, d - 0.4);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lb_e20" tt={tt} b={9} br={0.4} />
    <Prop id="thermometer" x={860} y={1040} w={560} />
    <div style={{ position: "absolute", left: 1200, top: 560, fontFamily: SER, fontWeight: 900, fontSize: 170, color: "#e8f2f8", textShadow: "0 6px 16px rgba(0,0,0,.6)" }}>{Math.round(30 - 52 * p)}°</div>
    <div style={{ ...BOX, background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 55%, rgba(230,242,250,.85) 100%)", opacity: fr }} />
    <div style={{ ...BOX, background: "repeating-conic-gradient(from 10deg at 0 0, rgba(255,255,255,.08) 0 3deg, transparent 3deg 9deg)", opacity: fr * 0.8 }} />
  </Cam>;
}} />;

// m21 · el piloto: en la caldera fría se prende la llama azul a los 0,6 s y a la mitad el cuarto entero se tiñe de calor naranja
const HPilotRelight: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), on = eio(tt, 0.5, 0.9), warm = eio(tt, d / 2, d / 2 + 1.6);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lb_e21" tt={tt} b={9} br={0.3 + 0.3 * warm} />
    <Prop id="furnace" x={960} y={1060} w={760} />
    <div style={{ position: "absolute", left: 820, top: 690, width: 280, height: 110, background: "#080808", borderRadius: 10, boxShadow: "inset 0 0 20px #000" }}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 18 + i * 28, bottom: 14, width: 18, height: (34 + 14 * Math.sin(tt * 18 + i * 1.7)) * on, borderRadius: "50% 50% 30% 30%", background: "linear-gradient(#bfe6ff,#2a6aff 60%,#0a2a8a)", boxShadow: "0 0 14px #4a8aff" }} />)}
    </div>
    <Glow x={960} y={740} r={260} o={on * 1.2} col="90,150,255" />
    <div style={{ ...BOX, background: "radial-gradient(ellipse at 50% 70%, rgba(255,150,60,.45), rgba(255,120,40,.12) 60%, transparent)", opacity: warm, mixBlendMode: "screen" }} />
  </Cam>;
}} />;

// m22 · el día de la basura: el tacho baja rodando por la entrada hasta el cordón, se tambalea y queda; el almanaque marca TUESDAY
const HGarbageTuesday: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), wob = tt > mid ? swing(tt, mid, 8, 8, 2.2) : Math.sin(tt * 22) * 2;
  return <Cam tt={tt} d={d} z={0.05} fy={800}>
    <Fondo id="lb_e22" tt={tt} b={5} br={0.6} />
    <Prop id="garbage_can" x={400 + 900 * p} y={700 + 280 * p} w={260 + 160 * p} r={-6 + wob} />
    <div style={{ position: "absolute", left: 1480, top: 120, width: 330, height: 380, background: "#fbf6e6", boxShadow: "10px 18px 26px rgba(0,0,0,.45)", transform: "rotate(3deg)" }}>
      <div style={{ height: 90, background: "#b3322a", color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 46, textAlign: "center", lineHeight: "90px" }}>OCTOBER</div>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 150, textAlign: "center", color: "#222" }}>14</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, textAlign: "center", color: "#b3322a", clipPath: `inset(0 ${(1 - cl((tt - mid) / 0.8)) * 100}% 0 0)` }}>TUESDAY</div>
    </div>
  </Cam>;
}} />;

// m23 · el libro de firmas del velorio de la señora Lindqvist: nueve firmas se escriben solas, y el resto de la hoja queda en blanco
const HGuestBook: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sg = ["Lou", "June", "Peter L.", "Bud Pruitt", "Rev. Olsen", "A. Kowalski", "Danny N.", "M. Dietz", "Ruth"], seg = (d / 2) / 9;
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lb_e23" tt={tt} b={10} br={0.4} />
    <Prop id="guest_book" x={960} y={1040} w={1300} />
    <div style={{ position: "absolute", left: 470, top: 300, width: 460, height: 560, transform: "rotate(-1deg)" }}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: 50 + i * 50, width: 440, height: 2, background: "rgba(80,80,100,.35)" }} />)}
      {sg.map((s_, i) => <Ink key={i} tt={tt} at={0.4 + i * seg} dur={seg * 0.9} x={14} y={i * 50 + 2} txt={s_} size={44} w={420} col="#1e2a48" />)}
    </div>
    <div style={{ position: "absolute", left: 1560, top: 260, fontFamily: SER, fontWeight: 900, fontSize: 240, color: "#f3e6c6", textShadow: "0 10px 30px rgba(0,0,0,.7)", opacity: cl((tt - d / 2 - 0.4) * 2) }}>9</div>
  </Cam>;
}} />;

// m24 · los 30 días: cuatro tablas se clavan una debajo de otra al ritmo de «week one… four»; el martillo baja en cada una
const HSignNails: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, bt(h, 0, 3.4), bt(h, 1, 6.4), bt(h, 2, 9.2)], tx = ["Week 1 · the card", "Week 2 · a key", "Week 3 · borrow", "Week 4 · host"];
  const cur = Math.max(0, st.filter((x) => tt >= x).length - 1), hit = (i: number) => tt > st[i] + 0.35, ham = cl(1 - Math.abs(tt - st[cur] - 0.3) / 0.3);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_taller" tt={tt} b={8} br={0.45} />
    {tx.map((s_, i) => { const L = land(tt, st[i], 500, 10, 0.35); return L.on ? <div key={i} style={{ ...BOX, transform: `translateY(${L.dy}px) rotate(${(rnd(i) - 0.5) * 3}deg)`, transformOrigin: "960px 500px" }}>
      <div style={{ position: "absolute", left: 460, top: 110 + i * 220, width: 900, height: 170, borderRadius: 10, background: "repeating-linear-gradient(0deg,#a8784a 0 18px,#9a6a3e 18px 22px,#b0824e 22px 40px)", boxShadow: "0 16px 24px rgba(0,0,0,.5), inset 0 0 0 5px rgba(60,30,10,.4)" }} />
      <div style={{ position: "absolute", left: 470, top: 150 + i * 220, width: 860, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#2a1606", textShadow: "0 2px 0 rgba(255,220,170,.4)" }}>{s_}</div>
      {hit(i) && [440, 1360].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 180 + i * 220, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(#ddd,#555)" }} />)}
    </div> : null; })}
    <Prop id="hammer" x={1560} y={330 + cur * 220 + 120 * (1 - ham)} w={420} r={-40 + 50 * ham} sh={0} />
  </Cam>;
}} />;

// m25 · seis millas a la redonda: sobre el mapa del condado, el compás abre un círculo desde la granja y caen los alfileres de cada familia
const HSixMiles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), r = 380 * eio(tt, 0.3, 2.2);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="lb_e24" tt={tt} b={9} br={0.4} />
    <div style={{ position: "absolute", left: 300, top: 60, width: 1320, height: 960, background: "#efe6c8", boxShadow: "0 30px 60px rgba(0,0,0,.5)", transform: "perspective(1800px) rotateX(20deg)", transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 160px, rgba(120,100,60,.45) 160px 164px), repeating-linear-gradient(0deg, transparent 0 160px, rgba(120,100,60,.45) 160px 164px)" }} />
      <svg width={1320} height={960} style={{ position: "absolute", left: 0, top: 0 }}><circle cx={660} cy={480} r={r} fill="rgba(179,50,42,.08)" stroke="#b3322a" strokeWidth={8} strokeDasharray="24 14" /><circle cx={660} cy={480} r={16} fill="#2a2a2a" /></svg>
      {Array.from({ length: 14 }, (_, i) => { const a = rnd(i) * Math.PI * 2, rr = 80 + 280 * rnd(i + 9), at = 1.6 + i * 0.22, L = land(tt, at, 200, 12, 0.3); return L.on ? <div key={i} style={{ position: "absolute", left: 660 + rr * Math.cos(a) - 12, top: 480 + rr * Math.sin(a) - 46 + L.dy, width: 24, height: 24, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff8a7a,#b3322a)", boxShadow: "4px 20px 6px rgba(0,0,0,.35)" }} /> : null; })}
    </div>
  </Cam>;
}} />;

// m26 · no se hacen amigos apurado: el reloj de arena se da vuelta de golpe y la arena empieza a caer
const HHourglassFlip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = phys(tt, 0.3, 7, 0.4), sand = cl((tt - 0.9) / (d - 1.2));
  return <Cam tt={tt} d={d} z={0.08} fy={600}>
    <Fondo id="L_cocina" tt={tt} b={9} br={0.45} />
    <Formica y0={820} />
    <div style={{ ...BOX, transformOrigin: "960px 600px", transform: `rotate(${180 * fl}deg)` }}><Prop id="hourglass" x={960} y={960} w={360} sh={0} /></div>
    {tt > 0.9 && <div style={{ position: "absolute", left: 956, top: 600, width: 8, height: 280 - 80 * sand, background: "linear-gradient(#e2c27a,#c8a050)", opacity: 0.9 }} />}
    {tt > 0.9 && <div style={{ position: "absolute", left: 960 - 90 * sand, top: 940 - 90 * sand, width: 180 * sand, height: 90 * sand, background: "#d8b468", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />}
  </Cam>;
}} />;

// m27 · la mañana que encontró la vereda limpia: la nieve se corre a pala desde la calle hasta la puerta y aparece el camino
const HShovelPath: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.0), sx = 1700 - 1300 * p;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e25" tt={tt} b={2} br={0.8} />
    <div style={{ position: "absolute", left: 0, top: 640, width: sx + 60, height: 440, background: "linear-gradient(#f4f8fa,#dce6ec)", borderRadius: "0 60px 0 0", boxShadow: "inset -20px 10px 30px rgba(150,170,190,.6)" }} />
    <div style={{ position: "absolute", left: sx + 40, top: 600, width: 1920 - sx, height: 90, background: "linear-gradient(#ffffff,#d8e2ea)", borderRadius: "50% 50% 0 0" }} />
    <Nieve tt={tt} n={40} wind={0.3} o={0.7} />
    <Prop id="snow_shovel" x={sx + 80} y={980} w={460} r={-20 + 8 * Math.sin(tt * 6)} />
    {Array.from({ length: 16 }, (_, k) => { const q = ((tt * 1.6 + rnd(k)) % 1); return <div key={k} style={{ position: "absolute", left: sx - 60 - 160 * q, top: 820 - 160 * Math.sin(q * Math.PI), width: 16, height: 16, borderRadius: "50%", background: "#fff", opacity: 1 - q }} />; })}
  </Cam>;
}} />;

// m28 · la nota en la bolsita: se despega de la puerta, viene a cámara y se despliega con la letra de Danny
const HNoteBag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), peel = eio(tt, 0.4, 1.2), come = eio(tt, 1.2, 2.6), unf = eio(tt, 2.6, 3.4);
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="lb_e26" tt={tt} b={8} br={0.45} />
    <Prop id="front_door" x={960} y={1120} w={760} />
    {unf < 0.05 && <Prop id="ziploc_note" x={960 + 0 * come} y={560 + 300 * come} w={260 + 400 * come} r={-6 + 10 * peel} sh={peel} />}
    {unf > 0 && <div style={{ position: "absolute", left: 960 - 520, top: 140, width: 1040, height: 760, transformOrigin: "50% 0", transform: `scaleY(${unf})`, background: "linear-gradient(#fdfbf2,#efe8d2)", boxShadow: "0 40px 70px rgba(0,0,0,.55)", padding: 60, backgroundImage: "linear-gradient(rgba(255,255,255,.25),rgba(255,255,255,.05)), linear-gradient(#fdfbf2,#efe8d2)" }}>
      <Ink tt={tt} at={3.5} dur={2.2} x={70} y={90} txt="Mr. Lou," size={100} w={900} />
      <Ink tt={tt} at={5.8} dur={2.6} x={70} y={260} txt="we shovel your walk now." size={92} w={920} />
      <Ink tt={tt} at={8.6} dur={1.4} x={520} y={520} txt="— Danny" size={92} w={460} col="#4a2a1a" />
    </div>}
  </Cam>;
}} />;

// m29 · cuarenta minutos: el cronómetro arranca, la aguja da vueltas y el contador de rodillos llega a 40
const HStopwatch40: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2), click = phys(tt, 0.3, 10, 0.3);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="lb_e20" tt={tt} b={10} br={0.35} />
    <div style={{ ...BOX, transform: `translateY(${-10 * (1 - click)}px)` }}><Prop id="stopwatch" x={760} y={980} w={720} /></div>
    <div style={{ position: "absolute", left: 756, top: 600, width: 8, height: 230, background: "#b3322a", transformOrigin: "50% 100%", transform: `translateY(-230px) rotate(${p * 40 * 36}deg)`, boxShadow: "0 0 6px rgba(0,0,0,.4)" }} />
    <Odo x={1460} y={540} v={40 * p} n={2} size={170} />
    <div style={{ position: "absolute", left: 1300, top: 700, width: 320, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#f3e6c6" }}>minutes</div>
  </Cam>;
}} />;

// m30 · todo lo que te perdés: los bowls de papel se apilan en una torre que sube y el contador llega a 792
const HChiliTower: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1.2), n = Math.floor(14 * p);
  return <Cam tt={tt} d={d} z={0.05} fy={400}>
    <Fondo id="lb_e28" tt={tt} b={9} br={0.45} />
    <Mesa y0={900} />
    {Array.from({ length: n }, (_, i) => <Prop key={i} id="paper_bowl" x={760 + 6 * Math.sin(i * 1.3)} y={980 - i * 52} w={300} sh={i === 0 ? 1 : 0.2} />)}
    {n < 14 && <Prop id="paper_bowl" x={760} y={980 - n * 52 - 300 * (1 - ((14 * p) % 1))} w={300} sh={0} />}
    <Odo x={1400} y={520} v={792 * p} n={3} size={150} />
  </Cam>;
}} />;

// m31 · la olla de chili del mes pasado: de la pila de bowls se van llevando uno por uno, siete, y la tiza los cuenta
const HBowlsTaken: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), seg = (d - 1.4) / 7;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lb_e27" tt={tt} b={8} br={0.5} />
    <Mesa y0={880} tone="#7a5a3a" />
    <Prop id="slow_cooker" x={700} y={990} w={560} />
    {Array.from({ length: 4 }, (_, k) => { const q = (tt * 0.4 + k / 4) % 1; return <Puff key={k} x={700 + 30 * Math.sin(q * 6)} y={700 - 240 * q} r={40 + 50 * q} o={(1 - q) * 0.4} />; })}
    {Array.from({ length: 7 }, (_, i) => { const at = 0.4 + i * seg, go = eio(tt, at, at + 0.7), on = tt < at + 0.7; const y = 980 - (6 - i) * 34;
      return on ? <Prop key={i} id="paper_bowl" x={1220 + 700 * go * (i % 2 ? 1 : 0.6)} y={y - 500 * go} w={240} r={30 * go} sh={go > 0 ? 0 : 0.3} /> : null; })}
    {Array.from({ length: 7 }, (_, i) => <div key={"t" + i} style={{ position: "absolute", left: 1500 + (i % 5) * 40 + (i >= 5 ? 220 : 0), top: 250, width: 10, height: 140, background: "rgba(250,248,240,.92)", transform: i === 4 ? "translate(-90px,60px) rotate(-62deg) scaleY(1.6)" : "rotate(5deg)", opacity: cl((tt - 0.4 - i * seg - 0.6) * 4) }} />)}
  </Cam>;
}} />;

// m32 · la tarea: el cartel pintado por la bisnieta cuelga de dos cadenas y se hamaca hasta quedar quieto
const HSignSwing: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = swing(tt, 0.2, 22, 3.4, 0.55) + (tt < 0.2 ? 22 : 0), drop = eio(tt, 0, 0.3);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lb_e32" tt={tt} b={8} br={0.45} />
    <div style={{ ...BOX, transformOrigin: "960px 0", transform: `translateY(${-300 * (1 - drop)}px) rotate(${a}deg)` }}>
      {[700, 1220].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 8, height: 380, background: "repeating-linear-gradient(#aaa 0 14px,#555 14px 18px)" }} />)}
      <Prop id="porch_sign" x={960} y={760} w={760} sh={0} />
      <div style={{ position: "absolute", left: 600, top: 520, width: 720, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 112, color: "#b3322a", textShadow: "0 3px 0 rgba(255,255,255,.4)" }}>HOMEWORK</div>
    </div>
  </Cam>;
}} />;

// m33 · el repaso: Elm Street al anochecer, y con cada consejo se prende la luz de un porche más
const HPorchLights: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, ...Array.from({ length: 6 }, (_, i) => bt(h, i, 2 + i * 1.7))];
  const P = [[300, 640, 1.0], [1620, 640, 1.0], [560, 590, 0.75], [1360, 590, 0.75], [740, 560, 0.55], [1180, 560, 0.55], [960, 520, 0.4]];
  return <Cam tt={tt} d={d} z={0.05} fy={560}>
    <Fondo id="lb_e34" tt={tt} b={4} br={0.3} />
    <div style={{ ...BOX, background: "linear-gradient(rgba(10,14,40,.5), rgba(10,10,20,.2))" }} />
    {P.map(([x, y, s], i) => { const on = cl((tt - st[i]) * 5), fl = tt > st[i] && tt < st[i] + 0.25 ? 0.5 + 0.5 * Math.sin(tt * 80) : 1; return <React.Fragment key={i}>
      <Glow x={x} y={y} r={150 * s} o={on * fl * 1.3} />
      <div style={{ position: "absolute", left: x - 14 * s, top: y - 20 * s, width: 28 * s, height: 40 * s, borderRadius: 8, background: on ? "radial-gradient(#fffbe0,#ffcc66)" : "#333", boxShadow: on ? `0 0 ${40 * s}px #ffd27a` : "none" }} />
    </React.Fragment>; })}
  </Cam>;
}} />;

export const HCB: Record<string, C> = {
  dollyBeep: HDollyBeep, tapeSteps: HTapeSteps, pianoRamp: HPianoRamp, pineappleNote: HPineappleNote, houseRows: HHouseRows, kringleIce: HKringleIce,
  ballCrack: HBallCrack, mailFan: HMailFan, wheelName: HWheelName, streetCard: HStreetCard, paperStack: HPaperStack, curtainSun: HCurtainSun,
  keySwap: HKeySwap, floodJars: HFloodJars, ladderUp: HLadderUp, sugarBack: HSugarBack, blowerArc: HBlowerArc, fenceRise: HFenceRise,
  chairUnfold: HChairUnfold, twoCups: HTwoCups, mercuryDrop: HMercuryDrop, pilotRelight: HPilotRelight, garbageTuesday: HGarbageTuesday,
  guestBook: HGuestBook, signNails: HSignNails, sixMiles: HSixMiles, hourglassFlip: HHourglassFlip, shovelPath: HShovelPath, noteBag: HNoteBag,
  stopwatch40: HStopwatch40, chiliTower: HChiliTower, bowlsTaken: HBowlsTaken, signSwing: HSignSwing, porchLights: HPorchLights,
};
