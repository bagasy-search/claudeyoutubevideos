// l9229c «Grudges» · componentes únicos (uno por minuto) del rencor de 37 años con Ray Tolliver: objetos FOTORREALES recortados
// (agnes → rembg) animados por código sobre fotos reales de Iowa. Lo aprendido en a y b: objetos grandes y enteros en cuadro,
// la acción clave a los ≈0,6 s y a la mitad, física (rebote, polvo, vapor, chispa), casi nada de texto y el que hay, grande y EN la escena.
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

// m0 · las dos de la mañana: el despertador cae sobre la mesa de luz y a la mitad empieza a sonar, sacudiéndose, con anillos en la luz de luna
const HClock2am: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.3, 600, 9, 0.3), ring = tt > d / 2 ? Math.sin(tt * 70) * 6 : 0, tl = cl((tt - d / 2) / 0.3);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="lc_e01" tt={tt} b={8} br={0.4} />
    <div style={{ ...BOX, background: "linear-gradient(120deg,rgba(120,150,220,.25),transparent 50%)", mixBlendMode: "screen" }} />
    <Mesa y0={880} tone="#4a3424" />
    {L.on && <Prop id="alarm_clock" x={960 + ring} y={950 + L.dy} w={520} r={ring * 0.8} sq={L.sq} />}
    {L.on && <Dust tt={tt} at={0.75} x={960} y={950} w={420} />}
    {tl > 0 && Array.from({ length: 6 }, (_, i) => <Rings key={i} tt={tt} at={d / 2 + i * 0.7} x={960} y={620} s={1.1} />)}
    <Glow x={960} y={650} r={300} o={tl * (0.8 + 0.2 * Math.sin(tt * 6))} col="200,220,255" />
  </Cam>;
}} />;

// m1 · la tumba de Ray: en la nieve del cementerio aparecen pisadas de a una hasta la lápida; a la mitad, otras pisadas llegan desde atrás
const HGraveHat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2;
  const step = (i: number, at: number, x0: number, y0: number, dx: number, dy: number, s: number) => { const a = cl((tt - at) / 0.25); const x = x0 + dx * i, y = y0 + dy * i, side = i % 2 ? 1 : -1;
    return a > 0 ? <div key={at + "_" + i} style={{ position: "absolute", left: x + side * 22 * s, top: y, width: 46 * s, height: 90 * s, borderRadius: "50% 50% 45% 45%", background: "radial-gradient(ellipse,rgba(110,130,160,.75),rgba(150,170,200,.35) 70%,transparent)", opacity: a, transform: `rotate(${side * 6 - 8}deg)` }} /> : null; };
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e02" tt={tt} b={6} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: "linear-gradient(#e8eef4,#c8d4de)" }} />
    <Prop id="gravestone" x={1120} y={760} w={420} />
    {Array.from({ length: 8 }, (_, i) => step(i, 0.3 + i * 0.45, 360, 960, 100, -36, 2.2 - i * 0.14))}
    {Array.from({ length: 6 }, (_, i) => step(i, mid + 0.4 + i * 0.45, 1800, 1000, -90, -34, 2.2 - i * 0.14))}
    <Nieve tt={tt} n={70} wind={20} o={0.85} />
  </Cam>;
}} />;

// m2 · el taller: una sábana vieja tapa algo sobre el banco; a la mitad se levanta con viento y aparece el cepillo de carpintero
const HPlaneBench: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, d / 2 - 0.4, d / 2 + 0.8), L = land(tt, 0.3, 500, 9, 0.35);
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lc_e03" tt={tt} b={8} br={0.5} />
    <Mesa y0={840} tone="#7a5838" />
    <Prop id="hand_plane" x={960} y={980} w={680} />
    <Glow x={960} y={820} r={360} o={up * 0.8} />
    {L.on && <Prop id="drape_cloth" x={960 + 620 * up} y={1010 + L.dy - 260 * up + 90 * Math.sin(up * Math.PI)} w={900} r={22 * up} sq={L.sq} sh={1 - up} style={{ opacity: 1 - up * 0.85 }} />}
    {up > 0.05 && Array.from({ length: 16 }, (_, k) => { const q = cl(up * 1.2 - rnd(k) * 0.2); return <div key={k} style={{ position: "absolute", left: 700 + 500 * rnd(k + 3) + 200 * q, top: 900 - 300 * q * rnd(k + 5), width: 6, height: 6, borderRadius: "50%", background: "#f2e8d0", opacity: (1 - q) * 0.8 }} />; })}
  </Cam>;
}} />;

// m3 · 37: el hierro de marcar al rojo baja sobre la tabla y quema el número, con humo y brasas
const HGrudgeNumber: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), down = eio(tt, 0.3, 0.7), burn = cl((tt - 0.7) / (d / 2 - 0.7)), lift = eio(tt, d / 2, d / 2 + 0.6);
  return <Cam tt={tt} d={d} z={0.08} fy={720}>
    <Fondo id="lc_e03" tt={tt} b={10} br={0.4} />
    <Prop id="wood_board" x={960} y={1000} w={1500} />
    <div style={{ position: "absolute", left: 560, top: 560, width: 800, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 360, color: "#2a1206", opacity: burn, clipPath: `inset(0 ${(1 - burn) * 100}% 0 0)`, textShadow: `0 0 ${30 * (1 - lift)}px rgba(255,120,30,${0.9 * (1 - lift)}), 0 0 18px rgba(40,18,6,.9), 0 0 40px rgba(60,30,10,.6)`, transform: "perspective(900px) rotateX(35deg)" }}>37</div>
    <Prop id="branding_iron" x={620 + 700 * burn} y={760 - 200 * (1 - down) - 500 * lift} w={520} r={-30} sh={0} />
    {Array.from({ length: 6 }, (_, k) => { const q = (tt * 0.6 + k / 6) % 1; return burn > 0 && burn < 1.05 ? <Puff key={k} x={620 + 700 * burn - 60 * k + 40 * Math.sin(q * 6)} y={720 - 320 * q} r={60 + 160 * q} col="rgba(210,210,215,.85)" o={(1 - q) * 0.7} /> : null; })}
    {burn > 0 && burn < 1 && Array.from({ length: 10 }, (_, k) => { const q = (tt * 1.3 + rnd(k)) % 1; return <div key={"e" + k} style={{ position: "absolute", left: 640 + 700 * burn + 60 * (rnd(k + 2) - 0.5), top: 760 - 260 * q, width: 7, height: 7, borderRadius: "50%", background: "#ffb040", boxShadow: "0 0 10px #ff7a20", opacity: 1 - q }} />; })}
  </Cam>;
}} />;

// m4 · los trabajos: cuatro puertas de alacena en fila se abren una tras otra como un dominó, con un destello de laca
const HKitchenCabinet: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lc_e04" tt={tt} b={7} br={0.5} />
    <div style={{ position: "absolute", left: 230, top: 200, width: 1460, height: 620, background: "linear-gradient(#5a3a22,#3a2414)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 4 }, (_, i) => { const at = 0.5 + i * 0.9, o = phys(tt, at, 6, 0.25), x = 260 + i * 360;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 230, width: 340, height: 560, background: "radial-gradient(ellipse at 50% 40%,#f6e6c4,#c8a878)", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }}>
          {[0, 1].map((j) => <div key={j} style={{ position: "absolute", left: 20, top: 160 + j * 200, width: 300, height: 14, background: "#8a6a44" }} />)}
        </div>
        <div style={{ position: "absolute", left: x, top: 230, width: 340, height: 560, transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-100 * o}deg)` }}><Prop id="cabinet_door" x={170} y={1080} w={340} sh={0} style={{ height: 560, objectFit: "fill" }} /></div>
        <Glow x={x + 170} y={300} r={160} o={cl(1 - Math.abs(tt - at - 0.4) * 3)} col="255,250,230" />
      </React.Fragment>; })}
  </Cam>;
}} />;

// m5 · Ray cobró y se quedó la plata: el sobre lleno cae en la mesa, una mano lo pellizca y a la mitad se lo lleva fuera de cuadro; queda un billete planeando
const HCashEnvelope: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, L = land(tt, 0.3, 500, 9, 0.35), reach = eio(tt, 1.2, mid), pull = eio(tt, mid, mid + 0.9);
  const bx = 960 + 900 * pull, bill = cl((tt - mid) / (d - mid));
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lc_e05" tt={tt} b={9} br={0.45} />
    <Mesa y0={820} tone="#6a4a2c" />
    {L.on && <Prop id="cash_envelope" x={bx} y={960 + L.dy} w={560} r={-4 + 8 * pull} sq={L.sq} />}
    <Prop id="hand_pinch" x={2200 - 1060 * reach + 900 * pull} y={820} w={520} r={-10} sh={0} />
    {tt > mid && <div style={{ position: "absolute", left: 900 - 200 * Math.sin(bill * 5), top: 300 + 600 * bill, width: 420, height: 190, background: "linear-gradient(#cfdcb8,#a8bc8a)", border: "6px solid #e6eed8", boxShadow: "6px 10px 14px rgba(0,0,0,.35)", transform: `rotate(${30 * Math.sin(bill * 7)}deg) rotateX(${50 * Math.sin(bill * 9)}deg)` }}>
      <div style={{ position: "absolute", left: 160, top: 40, width: 96, height: 104, borderRadius: "50%", border: "4px solid #6a7a5a" }} /></div>}
  </Cam>;
}} />;

// m6 · un rencor es una bolsa de alimento: la bolsa cuelga de una soga y a la mitad cae a plomo, estira la soga y la mesa salta con polvo
const HSackHook: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, sw = swing(tt, 0.2, 10, 3, 0.5), drop = phys(tt, mid, 6, 0.3), y = 480 + 200 * drop;
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e08" tt={tt} b={8} br={0.5} />
    <div style={{ ...BOX, transformOrigin: "960px 0", transform: `rotate(${tt < mid ? sw : sw * 0.3}deg)` }}>
      <div style={{ position: "absolute", left: 952, top: 0, width: 16, height: y - 260, background: "repeating-linear-gradient(45deg,#c8a870 0 6px,#9a7a48 6px 12px)" }} />
      <Prop id="burlap_sack" x={960} y={y + 260} w={460} r={0} sq={tt > mid ? cl((drop - 1) * 4) : 0} sh={0} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 1000, width: 1920, height: 80, background: "linear-gradient(#6a4a2c,#4a3018)", transform: `translateY(${tt > mid + 0.3 ? 8 * Math.exp(-(tt - mid - 0.3) * 6) * Math.sin((tt - mid) * 40) : 0}px)` }} />
    {tt > mid + 0.25 && <><Dust tt={tt} at={mid + 0.3} x={960} y={1000} w={1100} /><Dust tt={tt} at={mid + 0.4} x={800} y={980} w={700} /></>}
  </Cam>;
}} />;

// m7 · Ray se compró un bote: el bote flota en un agua que respira, con el reflejo temblando y destellos de sol
const HBoatFloat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), inx = eio(tt, 0.2, 1.4), bob = Math.sin(tt * 2.2) * 10, rk = Math.sin(tt * 1.7) * 3;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="lc_e09" tt={tt} b={6} br={0.6} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "linear-gradient(#5a7a8a,#2a4252)" }} />
    {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: -100 + ((i * 160 + tt * 40) % 2100), top: 720 + (i % 5) * 70, width: 200, height: 6, borderRadius: 3, background: "rgba(220,240,250,.35)" }} />)}
    <div style={{ position: "absolute", left: 1450 - 600 * inx - 450, top: 760, width: 900, height: 240, overflow: "hidden", opacity: 0.35, transform: `scaleY(-1) skewX(${3 * Math.sin(tt * 3)}deg)`, filter: "blur(3px)" }}><Prop id="small_boat" x={450} y={1080 + bob} w={900} sh={0} /></div>
    <Prop id="small_boat" x={1450 - 600 * inx} y={800 + bob} w={900} r={rk} sh={0} />
    {Array.from({ length: 6 }, (_, k) => { const q = (tt * 0.8 + k / 6) % 1; return <div key={"g" + k} style={{ position: "absolute", left: 400 + 1100 * rnd(k), top: 760 + 200 * rnd(k + 3), width: 30, height: 30, background: "radial-gradient(#fff,transparent 60%)", opacity: Math.sin(q * Math.PI) }} />; })}
  </Cam>;
}} />;

// m8 · la lista era más larga que la hoja: el rollo de papel se desenrolla sobre la mesa, cae por el borde y sigue
const HCostList: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1), L = 1300 * p, it = ["the parties", "the sleep", "Sundays", "the fishing", "what I didn't say", "June's patience", "37 years"];
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lc_e10" tt={tt} b={9} br={0.45} />
    <Mesa y0={620} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 640, top: 380, width: 640, height: Math.min(L, 300), background: "linear-gradient(90deg,#efe8d4,#fbf6e8 40%,#e8e0c8)", transform: "perspective(900px) rotateX(48deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 640, top: 600, width: 640, height: Math.max(0, L - 300), background: "linear-gradient(90deg,#e8e0c8,#fbf6e8 40%,#ddd4bc)", boxShadow: "14px 0 30px rgba(0,0,0,.4)" }}>
      {it.map((s_, i) => <Ink key={i} tt={tt} at={0.8 + i * (d - 2) / it.length} dur={0.7} x={40} y={30 + i * 96} txt={"— " + s_} size={78} w={580} />)}
    </div>
    <Prop id="paper_roll" x={960} y={440} w={700} r={0} sh={0.4} />
  </Cam>;
}} />;

// m9 · contarlo al centavo: la sumadora imprime la cinta y el contador de rodillos BAJA de 4.000 a 1.150
const HAddingMachine: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, v = tt < mid ? 4000 : 4000 - 2850 * eio(tt, mid, mid + 2), tape = eio(tt, 0.5, d - 1);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="lc_e12" tt={tt} b={9} br={0.45} />
    <Mesa y0={860} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 620, top: 560 - 380 * tape, width: 200, height: 40 + 380 * tape, background: "linear-gradient(90deg,#e8e2d0,#fffdf6,#e8e2d0)", boxShadow: "6px 0 10px rgba(0,0,0,.3)", overflow: "hidden" }}>
      {["412.00", "88.50", "300.00", "349.50"].map((s_, i) => <div key={i} style={{ position: "absolute", left: 20, bottom: 40 + i * 60, fontFamily: "monospace", fontSize: 34, color: "#333", opacity: cl((tape - i * 0.2) * 5) }}>{s_}</div>)}
    </div>
    <Prop id="adding_machine" x={720} y={1010} w={640} />
    <div style={{ position: "absolute", left: 1180, top: 260, padding: "30px 40px", background: "rgba(20,14,8,.6)", borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "relative", width: 560, height: 220 }}><Odo x={280} y={110} v={Math.round(v)} n={4} size={190} /></div>
      <div style={{ position: "absolute", left: 20, top: 120, width: 560, height: 10, background: "#b3322a", transformOrigin: "0 50%", transform: `rotate(-8deg) scaleX(${tt > mid - 0.8 && tt < mid + 0.2 ? cl((tt - mid + 0.8) / 0.5) : 0})` }} />
    </div>
  </Cam>;
}} />;

// m10 · el rencor creció en la oscuridad como moho: en el sótano, manchas de moho se expanden sobre el frasco y la cifra se infla
const HMoldGrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 0.4, d - 0.8), sz = 140 + 160 * g;
  return <Cam tt={tt} d={d} z={0.07} fy={600}>
    <Fondo id="lc_e13" tt={tt} b={8} br={0.3} />
    <div style={{ ...BOX, background: "radial-gradient(circle at 50% 30%,rgba(255,220,150,.25),transparent 40%)" }} />
    <Prop id="milk_bottle" x={960} y={1000} w={360} />
    {Array.from({ length: 22 }, (_, k) => { const a = cl(g * 1.4 - rnd(k) * 0.5), r = (30 + 70 * rnd(k + 2)) * a; return r > 1 ? <div key={k} style={{ position: "absolute", left: 830 + 260 * rnd(k + 5) - r, top: 640 + 340 * rnd(k + 8) - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle,rgba(70,90,50,.85),rgba(110,130,70,.5) 50%,transparent 70%)" }} /> : null; })}
    <div style={{ position: "absolute", left: 560, top: 180, width: 800, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: sz, color: "#e8dcb8", textShadow: "0 8px 20px rgba(0,0,0,.7)", opacity: cl((tt - 0.6) * 2) }}>${tt < d / 2 ? "1,150" : "4,000"}</div>
  </Cam>;
}} />;

// m11 · ¿el recibo o la historia?: el libro gordo de la historia se hincha; a la mitad el foco se corre al recibo flaco en el pinche
const HReceiptOrStory: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, sw = eio(tt, mid, mid + 0.8), sw2 = 1 + 0.25 * eio(tt, 0.4, mid);
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lc_e12" tt={tt} b={9} br={0.35 - 0.1 * sw} />
    <Mesa y0={840} tone="#6a4a2c" />
    <div style={{ ...BOX, filter: `brightness(${1 - 0.6 * sw})` }}><Prop id="story_book" x={640} y={1000} w={760 * sw2} /></div>
    <div style={{ ...BOX, filter: `brightness(${0.45 + 0.6 * sw})` }}><Prop id="receipt_spike" x={1320} y={1000} w={360} /></div>
    <div style={{ position: "absolute", left: 640 + 680 * sw - 420, top: -80, width: 840, height: 1200, background: "radial-gradient(ellipse 40% 50% at 50% 80%,rgba(255,236,190,.35),transparent 70%)", clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)", mixBlendMode: "screen" }} />
  </Cam>;
}} />;

// m12 · perdonar no es volver a confiar: el candado de bronce cae sobre la caja de herramientas y el arco se cierra de golpe
const HToolsLock: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.9, 900, 8, 0.4), sh = eio(tt, d / 2, d / 2 + 0.25);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="lc_e15" tt={tt} b={9} br={0.45} />
    <Prop id="toolbox_wood" x={960} y={1040} w={1000} />
    {L.on && <div style={{ ...BOX, transform: `translateY(${L.dy}px)` }}>
      <div style={{ position: "absolute", left: 960 - 60, top: 470 - 70 * (1 - sh), width: 120, height: 150, border: "22px solid #b0b4b8", borderBottom: "none", borderRadius: "70px 70px 0 0", boxShadow: "inset 0 4px 6px rgba(0,0,0,.4)" }} />
      <Prop id="padlock" x={960} y={820} w={300} sh={0.6} sq={L.sq} />
    </div>}
    {sh >= 1 && <Rings tt={tt} at={d / 2 + 0.25} x={960} y={560} s={0.6} />}
    <Glow x={960} y={560} r={180} o={tt > d / 2 + 0.25 ? Math.exp(-(tt - d / 2 - 0.25) * 4) * 1.5 : 0} col="255,250,220" />
  </Cam>;
}} />;

// m13 · una raya al medio de la hoja: el lápiz baja por el centro del cuaderno y escribe «forgive» a un lado y «trust» al otro
const HTwoColumns: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ln = eio(tt, 0.4, 1.6), pen = tt < 1.6 ? [960, 220 + 620 * ln] : tt < 3.6 ? [560 + 300 * cl((tt - 2) / 1.4), 330] : [1180 + 300 * cl((tt - 4) / 1.2), 330];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lc_e14" tt={tt} b={10} br={0.4} />
    <Prop id="notebook_open" x={960} y={1040} w={1400} />
    <div style={{ position: "absolute", left: 954, top: 200, width: 10, height: 640 * ln, background: "#3a3a40", borderRadius: 5 }} />
    <Ink tt={tt} at={2} dur={1.4} x={420} y={260} txt="forgive" size={120} w={480} col="#22314f" />
    <Ink tt={tt} at={4} dur={1.2} x={1040} y={260} txt="trust" size={120} w={420} col="#b3322a" />
    <Ink tt={tt} at={d - 2.4} dur={0.6} x={600} y={480} txt="yes" size={110} w={300} col="#2a6a3a" />
    <Ink tt={tt} at={d - 1.6} dur={0.6} x={1150} y={480} txt="not yet" size={100} w={380} col="#b3322a" />
    <Prop id="pencil" x={pen[0] + 120} y={pen[1] + 40} w={360} r={-50} sh={0} />
  </Cam>;
}} />;

// m14 · el perdón pasa adentro tuyo: la hoja escrita se dobla en dos, en cuatro, y se mete bajo la azucarera de la mesa
const HKitchenTableIn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), f1 = eio(tt, 0.5, 1.2), f2 = eio(tt, d / 2 - 0.6, d / 2), go = eio(tt, d / 2 + 0.4, d / 2 + 1.4);
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lc_e19" tt={tt} b={10} br={0.45} />
    <Formica y0={760} />
    <div style={{ position: "absolute", left: 420 + 500 * go, top: 380 + 200 * go, width: 900 * (1 - 0.5 * f2), height: 560 * (1 - 0.5 * f1), background: "repeating-linear-gradient(#fdfaf0 0 40px,#c8d8e8 40px 42px)", boxShadow: `0 ${20 + 30 * f1}px 30px rgba(0,0,0,.4)`, transform: `perspective(1200px) rotateX(${50}deg) scale(${1 - 0.5 * go})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: `linear-gradient(${f2 > 0 ? 90 : 0}deg,transparent 48%,rgba(0,0,0,.18) 50%,transparent 52%)` }} />
      <Ink tt={tt} at={0.2} dur={0.1} x={40} y={40} txt="I forgive you, Ray." size={92} w={820} />
    </div>
    <Prop id="milk_bottle" x={1500} y={1000} w={300} />
  </Cam>;
}} />;

// m15 · el brindis de Harold: la copa de ponche sube, se inclina en la risa y una gota roja cae y se agranda como mancha en el mantel blanco
const HPunchToast: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, up = eio(tt, 0.3, 1.0), tilt = tt > mid - 0.5 ? swing(tt, mid - 0.5, 14, 6, 1.2) + 10 * eio(tt, mid - 0.5, mid) : 0, dropy = cl((tt - mid) / 0.5), st = eio(tt, mid + 0.5, mid + 2.2);
  return <Cam tt={tt} d={d} z={0.07} fy={720}>
    <Fondo id="lc_e16" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "linear-gradient(#fbfaf4,#dcd8cc)" }} />
    <Prop id="punch_glass" x={900} y={980 - 340 * up} w={360} r={tilt} sh={0.3 * (1 - up)} />
    {tt > mid && dropy < 1 && <div style={{ position: "absolute", left: 1010, top: 560 + 380 * dropy * dropy, width: 26, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#c01020" }} />}
    {st > 0 && <div style={{ position: "absolute", left: 1020 - 220 * st, top: 950 - 50 * st, width: 440 * st, height: 100 * st, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(ellipse,rgba(190,20,40,.85),rgba(210,60,80,.45) 60%,transparent 75%)" }} />}
  </Cam>;
}} />;

// m16 · frío como la manija de una bomba en enero: la escarcha trepa por la manija de hierro y el aliento sale en nubes
const HPumpFrost: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fr = eio(tt, 0.4, d - 1);
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e17" tt={tt} b={6} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 180, background: "linear-gradient(#eef3f6,#c8d4dc)" }} />
    <Prop id="hand_pump" x={960} y={1000} w={760} />
    <div style={{ position: "absolute", left: 960 - 380, top: 1000 - 760 * 1.2, width: 760, height: 760 * 1.2, WebkitMaskImage: `linear-gradient(to top, black ${fr * 100}%, transparent ${fr * 100 + 8}%)`, maskImage: `linear-gradient(to top, black ${fr * 100}%, transparent ${fr * 100 + 8}%)`, mixBlendMode: "screen", opacity: 0.85 }}>
      <Prop id="hand_pump" x={380} y={1080} w={760} sh={0} style={{ filter: "grayscale(1) brightness(2.4) contrast(.7) blur(1px)" }} />
    </div>
    {Array.from({ length: 3 }, (_, k) => { const q = (tt * 0.35 + k / 3) % 1; return <Puff key={k} x={300 + 180 * q} y={520 - 80 * q} r={50 + 120 * q} col="rgba(240,246,250,.9)" o={(1 - q) * 0.5} />; })}
    <Nieve tt={tt} n={40} wind={10} o={0.6} />
  </Cam>;
}} />;

// m17 · pedí perdón por tu 10 %: el pastel cortado en diez porciones; a la mitad UNA porción se separa y avanza hacia cámara
const HTenPercent: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = eio(tt, 0.4, 2.2), out = eio(tt, d / 2, d / 2 + 1.2), cx = 960, cy = 700, R = 360;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lc_e19" tt={tt} b={10} br={0.45} />
    <Formica y0={640} />
    <div style={{ position: "absolute", left: cx - R - 40, top: cy - R * 0.5 - 30, width: (R + 40) * 2, height: R + 60, borderRadius: "50%", background: "radial-gradient(ellipse,#f4f2ea 60%,#c8c4b8 72%,transparent 74%)" }} />
    <div style={{ position: "absolute", left: cx - R, top: cy - R * 0.5, width: R * 2, height: R, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(ellipse,#a8201c 0 30%,#d8a058 31% 33%,#8a1418 34% 60%,#d8a058 62% 72%,#b07a3a 74% 100%)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2 - Math.PI / 2, k = cl(cut * 10 - i); return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R * k} y2={cy + Math.sin(a) * R * 0.5 * k} stroke="#f2e2c0" strokeWidth={8} />; })}
      {(() => { const a0 = -Math.PI / 2 + 2 * Math.PI * 0.35, a1 = a0 + Math.PI * 2 / 10, ox = 120 * out, oy = 90 * out, s = 1 + 0.3 * out;
        const P = (a: number) => `${cx + ox + Math.cos(a) * R * s},${cy + oy + Math.sin(a) * R * 0.5 * s}`;
        return out > 0 ? <g style={{ filter: "drop-shadow(10px 20px 14px rgba(0,0,0,.5))" }}><path d={`M${cx + ox},${cy + oy} L${P(a0)} A${R * s},${R * 0.5 * s} 0 0,1 ${P(a1)} Z`} fill="#a01a1a" stroke="#d8a058" strokeWidth={14} /></g> : null; })()}
    </svg>
  </Cam>;
}} />;

// m18 · tres oraciones: en la soga de tender, tres broches muerden tres tarjetas de a una, con su hamaca
const HThreeSentences: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.4, 0.4 + (d - 1.4) / 3, 0.4 + 2 * (d - 1.4) / 3], tx = ["what happened", "what I did wrong", "I'm sorry"];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lc_e18" tt={tt} b={8} br={0.5} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M-20,220 Q960,320 1940,220" stroke="#d8cfb8" strokeWidth={6} fill="none" /></svg>
    {tx.map((s_, i) => { const L = land(tt, at[i], 500, 9, 0.35), sw = swing(tt, at[i] + 0.4, 8, 4, 0.8), x = 380 + i * 580, y = 270 + (i === 1 ? 40 : 18);
      return L.on ? <div key={i} style={{ ...BOX, transformOrigin: `${x}px ${y}px`, transform: `translateY(${L.dy}px) rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: x - 230, top: y + 10, width: 460, height: 300, background: "linear-gradient(#fdfaf0,#efe6cc)", boxShadow: "10px 18px 24px rgba(0,0,0,.45)" }}>
          <div style={{ position: "absolute", left: 0, width: 460, top: 70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: i === 2 ? "#b3322a" : "#22314f" }}>{s_}</div></div>
        <Prop id="clothespin" x={x} y={y + 90} w={70} r={90} sh={0} />
      </div> : null; })}
  </Cam>;
}} />;

// m19 · el aserradero de 1953: la sierra circular gira, escupe aserrín en abanico y a la mitad frena hasta quedar quieta
const HSawBlade: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, ang = tt < mid ? 1100 * tt : 1100 * mid + 1100 * (1 - Math.exp(-(tt - mid) * 1.2)) / 1.2, sp = tt < mid ? 1 : Math.exp(-(tt - mid) * 1.2);
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e20" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 320, background: "linear-gradient(#7a5a3a,#4a321e)" }} />
    <div style={{ position: "absolute", left: 960 - 380, top: 560 - 380, width: 760, height: 760, transform: `rotate(${ang}deg)`, filter: `blur(${4 * sp}px)` }}><Prop id="saw_blade" x={380} y={1080} w={760} sh={0} style={{ height: 760, objectFit: "contain" }} /></div>
    <div style={{ position: "absolute", left: 0, top: 740, width: 1920, height: 340, background: "linear-gradient(#a07a4e,#6a4a2c 12%,#4a321e)", boxShadow: "0 -10px 20px rgba(0,0,0,.4)" }} />
    {Array.from({ length: 60 }, (_, k) => { const q = (tt * 2 + rnd(k)) % 1, a = -0.3 - 0.9 * rnd(k + 1); return sp > 0.1 ? <div key={k} style={{ position: "absolute", left: 1180 + Math.cos(a) * 700 * q, top: 740 + Math.sin(a) * 500 * q + 400 * q * q, width: 8 + 6 * rnd(k + 2), height: 5, borderRadius: 2, background: "#e8c890", opacity: (1 - q) * sp }} /> : null; })}
  </Cam>;
}} />;

// m20 · dos minutos tarde en la ventisca: la tarjeta entra al reloj de fichar, ¡chac!, y sale con la hora estampada en rojo
const HPunchClock: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, inn = eio(tt, 0.4, mid - 0.2), outc = eio(tt, mid + 0.3, mid + 1.4), cx = 1500 - 540 * inn + 520 * outc, y = 620 + 60 * inn - 80 * outc, sc = 1 + 0.35 * outc, bump = tt > mid && tt < mid + 0.3 ? 8 * Math.sin((tt - mid) * 60) : 0;
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lc_e21" tt={tt} b={8} br={0.45} />
    <Nieve tt={tt} n={30} wind={40} o={0.3} />
    <div style={{ ...BOX, transform: `translateY(${bump}px)` }}><Prop id="time_clock" x={760} y={1000} w={560} /></div>
    <div style={{ position: "absolute", left: cx - 160, top: y - 520, width: 320, height: 520, transform: `scale(${sc}) rotate(${-4 * outc}deg)`, boxShadow: "16px 24px 30px rgba(0,0,0,.45)" }}>
      <Prop id="time_card" x={160} y={1080} w={320} sh={0} style={{ height: 520, objectFit: "fill" }} />
      <div style={{ position: "absolute", left: 30, top: 280, fontFamily: "monospace", fontWeight: 700, fontSize: 92, color: "#c0181c", opacity: tt > mid + 0.2 ? 1 : 0, transform: "rotate(-4deg)", textShadow: "0 0 2px #c0181c" }}>7:02</div>
    </div>
  </Cam>;
}} />;

// m21 · el obituario: el diario doblado se abre en dos sobre la mesa y a la mitad cae encima una chapa militar
const HObituaryFold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.4), L = land(tt, d / 2, 500, 10, 0.3);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lc_e22" tt={tt} b={10} br={0.4} />
    <Mesa y0={760} tone="#6a4a2c" />
    <div style={{ position: "absolute", left: 460, top: 360, width: 1000, height: 560, transform: "perspective(1400px) rotateX(40deg)", transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 500, top: 0, width: 500, height: 560, background: "linear-gradient(#f2eee2,#ddd6c4)", backgroundImage: "repeating-linear-gradient(#ddd6c4 0 3px,#f2eee2 3px 22px)" }}>
        <div style={{ position: "absolute", left: 40, top: 40, width: 160, height: 200, background: "linear-gradient(#8a8a86,#5a5a56)" }} />
        <div style={{ position: "absolute", left: 220, top: 40, fontFamily: SER, fontWeight: 900, fontSize: 48, color: "#222", lineHeight: 1 }}>NOVAK<br />1897–1988</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 500, height: 560, transformOrigin: "100% 50%", transform: `rotateY(${180 - 180 * op}deg)`, background: "linear-gradient(#ece6d6,#d4ccb8)", backgroundImage: "repeating-linear-gradient(#d4ccb8 0 3px,#ece6d6 3px 22px)", backfaceVisibility: "hidden" }} />
    </div>
    {L.on && <Prop id="dog_tag" x={1180} y={840 + L.dy} w={260} r={-20} sq={L.sq} sh={0.8} />}
    {L.on && <Rings tt={tt} at={d / 2 + 0.3} x={1180} y={780} s={0.5} />}
  </Cam>;
}} />;

// m22 · ¿qué le pasaba a esa persona ese invierno?: la mano limpia un círculo en el vidrio empañado y aparece la iglesia con la bandera a media asta
const HThatWinter: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), w = eio(tt, 0.5, d / 2 + 0.5), a = tt * 7, hx = 960 + 260 * w * Math.cos(a), hy = 520 + 200 * w * Math.sin(a);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lc_e23" tt={tt} b={0} br={0.65} />
    <div style={{ ...BOX, backdropFilter: "blur(14px)", background: "rgba(220,228,236,.55)", WebkitMaskImage: `radial-gradient(ellipse ${380 * w}px ${300 * w}px at 960px 520px, transparent 80%, black 100%)`, maskImage: `radial-gradient(ellipse ${380 * w}px ${300 * w}px at 960px 520px, transparent 80%, black 100%)` }} />
    {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 200 + 1500 * rnd(k), top: 100 + 400 * rnd(k + 4), width: 6, height: 60 + 200 * rnd(k + 7) * cl(tt / 3), background: "linear-gradient(rgba(255,255,255,.5),transparent)", borderRadius: 3 }} />)}
    {tt > 0.5 && tt < d / 2 + 0.7 && <Prop id="hand_flat" x={hx} y={hy + 300} w={420} sh={0} />}
  </Cam>;
}} />;

// m23 · la Navidad que Mike no vino: la tarjeta navideña se abre parada sobre la mesa y a la mitad se cae de cara, cerrada
const HCardPopup: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.4), fall = tt > d / 2 ? phys(tt, d / 2, 6, 0.5) : 0;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lc_e24" tt={tt} b={10} br={0.45} />
    <Mesa y0={820} tone="#6a4a2c" />
    <div style={{ ...BOX, transformOrigin: "960px 980px", transform: `perspective(1400px) rotateX(${-85 * fall}deg)` }}>
      <Prop id="christmas_card" x={960} y={980} w={620 + 120 * op} sh={1 - fall} />
    </div>
    {fall > 0.9 && <Dust tt={tt} at={d / 2 + 0.45} x={960} y={980} w={600} />}
    <Glow x={960} y={700} r={300} o={op * (1 - fall) * 0.7} col="255,220,160" />
  </Cam>;
}} />;

// m24 · le puse esa bolsa en los hombros a un nene: la bolsa de alimento baja sobre el carrito rojo de juguete y lo aplasta
const HSackSmall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, d / 2 - 0.6, 700, 7, 0.3), sq = L.on ? cl(L.k) : 0;
  return <Cam tt={tt} d={d} z={0.07} fy={800}>
    <Fondo id="lc_e24" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: 0, top: 920, width: 1920, height: 160, background: "linear-gradient(#8a6a4a,#5a4028)" }} />
    <Prop id="wood_wagon" x={960} y={1010 + 14 * sq} w={980} style={{ transform: `scale(1,${1 - 0.12 * sq})`, transformOrigin: "50% 100%" }} />
    {L.on && <Prop id="burlap_sack" x={960} y={850 + L.dy + 14 * sq} w={560} sq={L.sq} sh={0} />}
    {L.on && L.k > 0.95 && <Dust tt={tt} at={d / 2} x={960} y={1000} w={700} />}
  </Cam>;
}} />;

// m25 · Tommy tiene 34: en el marco de la puerta, las rayitas de lápiz de cada cumpleaños suben de 9 a 34
const HDoorHeights: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ages = [9, 12, 15, 18, 22, 27, 34], seg = (d - 1.6) / ages.length, cur = Math.min(ages.length - 1, Math.floor(cl((tt - 0.4) / (d - 1.6)) * ages.length));
  const Y = (i: number) => 900 - i * 110;
  return <Cam tt={tt} d={d} z={0.05} fy={540}>
    <Fondo id="lc_e24" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: 760, top: -40, width: 220, height: 1160, background: "linear-gradient(90deg,#d8ccb4,#f4ecd8 40%,#cfc2a8)", boxShadow: "20px 0 40px rgba(0,0,0,.4)" }} />
    {ages.map((a, i) => { const at = 0.4 + i * seg, p = cl((tt - at) / 0.4); return p > 0 ? <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 790, top: Y(i), width: 150 * p, height: 7, background: "#3a3a44", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 1000, top: Y(i) - 46, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: "#f3e6c6", opacity: p, textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>{a}</div>
    </React.Fragment> : null; })}
    <Prop id="pencil" x={940 + 60} y={Y(cur) + 30} w={300} r={-60} sh={0} />
  </Cam>;
}} />;

// m26 · dos horas en la estación: la valija sola en el andén; la luz pasa del atardecer a la noche y la nieve se le junta arriba
const HSuitcaseWait: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.6), L = land(tt, 0.3, 300, 10, 0.4);
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lc_e25" tt={tt} b={5} br={0.6 - 0.35 * p} />
    <div style={{ ...BOX, background: "linear-gradient(rgba(20,30,70,.0),rgba(10,16,40,.5))", opacity: p }} />
    <Nieve tt={tt} n={80} wind={14} o={0.8} />
    {L.on && <Prop id="suitcase" x={960} y={1000 + L.dy} w={420} sq={L.sq} />}
    <div style={{ position: "absolute", left: 960 - 190, top: 700 - 34 * p + L.dy, width: 380, height: 44 * p, borderRadius: "50% 50% 10% 10%", background: "linear-gradient(#ffffff,#dfe8ee)" }} />
    <div style={{ position: "absolute", left: 1350, top: 180, padding: "20px 36px", background: "rgba(10,10,20,.55)", borderRadius: 16 }}>
      <div style={{ position: "relative", width: 260, height: 150 }}><Odo x={130} y={75} v={120 * p} n={3} size={130} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#f3e6c6", textAlign: "center" }}>minutes</div>
    </div>
  </Cam>;
}} />;

// m27 · más bueno con extraños que con uno mismo: el portoncito se abre de par en par para el de afuera; a la mitad se cierra de un golpe
const HMirrorSack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, op = tt < mid ? eio(tt, 0.4, 1.4) : 1 - phys(tt, mid, 9, 0.35);
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lc_e18" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 960, width: 1920, height: 120, background: "linear-gradient(#6a8a4a,#3a5a2a)" }} />
    <div style={{ position: "absolute", left: 560, top: 520, width: 800, height: 460, background: "radial-gradient(ellipse at 50% 100%,rgba(255,230,170,.5),transparent 70%)", opacity: tt < mid ? op : 0 }} />
    <div style={{ ...BOX, transformOrigin: "640px 980px", transform: `perspective(1400px) rotateY(${-75 * op}deg)` }}><Prop id="garden_gate" x={960} y={1000} w={640} /></div>
    {tt > mid + 0.15 && <Rings tt={tt} at={mid + 0.15} x={1280} y={760} s={0.7} />}
  </Cam>;
}} />;

// m28 · la rutina de siete días: siete fichas de madera en fila se dan vuelta de a una, cada una cuando Lou nombra el día
const HDayTiles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, 1.6, ...Array.from({ length: 5 }, (_, i) => bt(h, i, 3 + i * 2.6))];
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lc_e19" tt={tt} b={10} br={0.45} />
    <Mesa y0={700} tone="#6a4a2c" />
    {st.map((a, i) => { const f = phys(tt, a, 8, 0.4), x = 230 + i * 245, lif = Math.sin(cl(f) * Math.PI) * 60;
      return <div key={i} style={{ position: "absolute", left: x - 110, top: 640 - lif, width: 220, height: 220, transform: `perspective(1000px) rotateY(${180 - 180 * Math.min(1.08, f)}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><Prop id="wood_tile" x={110} y={1080} w={220} sh={0} style={{ height: 220, objectFit: "cover", filter: "brightness(.7)" }} /></div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}><Prop id="wood_tile" x={110} y={1080} w={220} sh={0} style={{ height: 220, objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, width: 220, top: 40, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 120, color: i === 6 ? "#b3322a" : "#3a2010" }}>{i + 1}</div></div>
      </div>; })}
  </Cam>;
}} />;

// m29 · quemá el papel en la estufa: la hoja doblada vuela a la boca de la estufa, se enrosca, se ennegrece y suben brasas
const HStoveBurn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fly = eio(tt, 0.4, 1.6), burn = cl((tt - 1.6) / (d - 2.4)), sx = 400 + 600 * fly, sy = 300 + 520 * fly - 220 * Math.sin(fly * Math.PI);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="lc_e26" tt={tt} b={10} br={0.4} />
    <Prop id="wood_stove" x={1000} y={1060} w={820} />
    <Glow x={1000} y={760} r={340} o={0.7 + 0.5 * burn + 0.2 * Math.sin(tt * 9)} col="255,140,40" />
    {burn < 1 && <Prop id="folded_paper" x={sx} y={sy + 120} w={240 * (1 - 0.7 * burn)} r={fly * 220 + burn * 90} sh={0} style={{ filter: `brightness(${1 - 0.8 * burn}) sepia(${burn}) drop-shadow(0 0 ${4 + 14 * burn}px rgba(255,120,20,${0.9 * Math.min(1, burn * 3)}))` }} />}
    {burn > 0 && Array.from({ length: 20 }, (_, k) => { const q = (tt * 0.9 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 960 + 120 * (rnd(k + 2) - 0.5) + 60 * Math.sin(q * 8 + k), top: 760 - 600 * q, width: 8, height: 8, borderRadius: "50%", background: "#ffc050", boxShadow: "0 0 12px #ff7a20", opacity: (1 - q) * cl(burn * 3) }} />; })}
  </Cam>;
}} />;

// m30 · el cepillo del abuelo Olaf: el cepillo de madera corre por la tabla y la viruta se enrosca larga y dorada detrás
const HPlaneShaving: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2), x = 520 + 900 * p;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="lc_e27" tt={tt} b={10} br={0.45} />
    <Prop id="wood_board" x={960} y={1000} w={1700} />
    <div style={{ position: "absolute", left: 400, top: 830, width: x - 400, height: 30, background: "linear-gradient(#f4dcae,#e8c890)", opacity: 0.7 }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {p > 0.02 && (() => { const N = Math.max(2, Math.floor(160 * p)), cx = x - 230, cy = 640, pts = Array.from({ length: N }, (_, i) => { const a = i / 160 * Math.PI * 5, r = 170 - 130 * i / 160; return `${cx + Math.cos(a + 0.4) * r * 1.2},${cy + Math.sin(a + 0.4) * r}`; });
        return <><polyline points={`${x - 80},${830} ${pts.join(" ")}`} fill="none" stroke="#b8894a" strokeWidth={34} strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(6px 10px 8px rgba(0,0,0,.4))" }} /><polyline points={`${x - 80},${830} ${pts.join(" ")}`} fill="none" stroke="#f2d49a" strokeWidth={20} strokeLinejoin="round" strokeLinecap="round" /></>; })()}
    </svg>
    <Prop id="old_plane2" x={x} y={860} w={520} sh={0.8} />
  </Cam>;
}} />;

// m31 · que no se ponga el sol sobre el enojo: el sol baja hasta el horizonte de la granja y se prende la ventana de la casa
const HSunsetBed: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 1), sy = 200 + 560 * p, win = cl((p - 0.55) * 4);
  return <Cam tt={tt} d={d} z={0.04} fy={600}>
    <Fondo id="lc_e28" tt={tt} b={2} br={0.75 - 0.4 * p} />
    <div style={{ ...BOX, background: `linear-gradient(rgba(255,140,60,${0.25 * p}),rgba(80,40,90,${0.4 * p}))`, mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 720, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 260 - 110, top: sy - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(#fffbe0,#ffc060 50%,#ff8a30)", boxShadow: "0 0 120px 50px rgba(255,150,60,.55)" }} />
    </div>
    <Glow x={760} y={620} r={120} o={win * 1.6} col="255,210,120" />
  </Cam>;
}} />;

// m32 · las vacas en el maíz: las plantas de maíz se caen en fila como fichas de dominó, una arrastra a la otra
const HCowsCorn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lc_e29" tt={tt} b={8} br={0.55} />
    <div style={{ position: "absolute", left: 0, top: 940, width: 1920, height: 140, background: "linear-gradient(#5a4a2a,#3a2e1a)" }} />
    {Array.from({ length: 9 }, (_, i) => { const at = 0.6 + i * 0.35 + (i > 4 ? d / 2 - 2.4 : 0), f = phys(tt, at, 6, 0.6); return <div key={i} style={{ ...BOX, transformOrigin: `${200 + i * 190}px 980px`, transform: `rotate(${72 * Math.min(1, f)}deg)` }}><Prop id="corn_stalk" x={200 + i * 190} y={980} w={300} sh={0} /></div>; })}
    {Array.from({ length: 9 }, (_, i) => { const at = 0.6 + i * 0.35 + (i > 4 ? d / 2 - 2.4 : 0); return <Dust key={"d" + i} tt={tt} at={at + 0.5} x={400 + i * 190} y={980} w={260} />; })}
  </Cam>;
}} />;

// m33 · un jamón cada Navidad por 20 años: el jamón cuelga de su piolín y se hamaca; el contador de años llega a 20
const HFenceHam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), drop = phys(tt, 0.3, 6, 0.4), sw = swing(tt, 0.6, 16, 3, 0.4), p = eio(tt, 1, d - 1);
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lc_e24" tt={tt} b={10} br={0.45} />
    <div style={{ ...BOX, transformOrigin: "760px -60px", transform: `translateY(${-500 * (1 - Math.min(1, drop))}px) rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: 757, top: -60, width: 6, height: 440, background: "#d8c8a0" }} />
      <Prop id="ham" x={760} y={860} w={500} sh={0} />
    </div>
    <div style={{ position: "absolute", left: 1220, top: 300, padding: "26px 40px", background: "rgba(20,14,8,.55)", borderRadius: 20 }}>
      <div style={{ position: "relative", width: 300, height: 190 }}><Odo x={150} y={95} v={20 * p} n={2} size={170} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#f3e6c6", textAlign: "center" }}>Christmases</div>
    </div>
  </Cam>;
}} />;

// m34 · el sombrero en las manos: Lou sostiene el sombrero frente a la lápida y la nieve se le va juntando en el ala
const HHatSnow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, 1.2), acc = eio(tt, 1, d - 0.5);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lc_e31" tt={tt} b={10} br={0.5} />
    <Nieve tt={tt} n={110} wind={10} o={0.9} />
    <div style={{ ...BOX, transform: `translateY(${300 * (1 - up)}px)` }}>
      <Prop id="fedora_hat" x={960} y={760} w={620} sh={0} />
      <div style={{ position: "absolute", left: 960 - 150, top: 450 - 26 * acc, width: 300, height: 34 * acc + 4, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(#ffffff,#e4ecf2)", opacity: cl(acc * 3) }} />
      <div style={{ position: "absolute", left: 960 - 300, top: 700 - 10 * acc, width: 140, height: 14 * acc + 2, borderRadius: "50%", background: "#f4f8fb", opacity: cl(acc * 3) }} />
      <div style={{ position: "absolute", left: 960 + 160, top: 700 - 10 * acc, width: 140, height: 14 * acc + 2, borderRadius: "50%", background: "#f4f8fb", opacity: cl(acc * 3) }} />
    </div>
  </Cam>;
}} />;

// m35 · la corona de Gary: la corona baja sobre la lápida nevada, rebota y la cinta roja se hamaca con la nieve que se sacude
const HGraveWreath: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, d / 2 - 1, 700, 8, 0.32), sw = swing(tt, d / 2 - 0.5, 8, 4, 0.7);
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e31" tt={tt} b={6} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 880, width: 1920, height: 200, background: "linear-gradient(#e8eef4,#c8d4de)" }} />
    <Prop id="gravestone" x={960} y={960} w={560} />
    {L.on && <Prop id="wreath" x={960} y={760 + L.dy} w={380} r={sw} sq={L.sq} sh={0} />}
    {L.on && L.k > 0.95 && Array.from({ length: 14 }, (_, k) => { const s = tt - d / 2 + 0.6; return s > 0 && s < 1.2 ? <div key={k} style={{ position: "absolute", left: 800 + 320 * rnd(k) + (rnd(k + 1) - 0.5) * 200 * s, top: 420 - 120 * s + 300 * s * s, width: 12, height: 12, borderRadius: "50%", background: "#fff", opacity: 1 - s / 1.2 }} /> : null; })}
    <Nieve tt={tt} n={40} wind={10} o={0.7} />
  </Cam>;
}} />;

// m36 · la caja de Gary: la tapa de la caja de madera se abre, sale luz y sube el cepillo Stanley; al lado la nota «for Lou, I owe him»
const HBoxPlane: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.4), rise = eio(tt, 1.3, d / 2 + 0.3), note = cl((tt - d / 2) / 0.6);
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="lc_e32" tt={tt} b={10} br={0.4} />
    <Mesa y0={860} tone="#6a4a2c" />
    <div style={{ position: "absolute", left: 560, top: 720, width: 700, height: 290, background: "linear-gradient(#8a5e36,#5e3e20)", boxShadow: "0 30px 40px rgba(0,0,0,.5), inset 0 0 0 10px #6e4a2a" }} />
    <Glow x={910} y={720} r={360} o={op * 1.2} col="255,230,170" />
    <Prop id="hand_plane" x={910} y={900 - 300 * rise} w={540} sh={0} />
    <div style={{ position: "absolute", left: 560, top: 720, width: 700, height: 60, transformOrigin: "50% 0", transform: `perspective(1200px) rotateX(${110 * op}deg) translateY(${-60 * op}px)`, background: "linear-gradient(#a0703e,#6e4a2a)", boxShadow: "0 -10px 20px rgba(0,0,0,.3)" }} />
    <div style={{ position: "absolute", left: 1320, top: 500 + 40 * (1 - note), width: 440, height: 320, background: "linear-gradient(#fdf8ea,#efe4c8)", boxShadow: "10px 18px 24px rgba(0,0,0,.45)", transform: "rotate(4deg)", opacity: note }}>
      <Ink tt={tt} at={d / 2 + 0.4} dur={1.4} x={40} y={60} txt="for Lou," size={84} w={380} col="#2a2a3a" />
      <Ink tt={tt} at={d / 2 + 1.9} dur={1.4} x={40} y={170} txt="I owe him." size={78} w={380} col="#2a2a3a" />
    </div>
  </Cam>;
}} />;

// m37 · primer día de primavera: la escarcha del vidrio se derrite desde el centro y asoman los azafranes violetas en la nieve
const HFrostSpring: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), m = eio(tt, 0.4, d / 2 + 0.6), gr = phys(tt, d / 2, 6, 0.45);
  return <Cam tt={tt} d={d} z={0.05} fy={760}>
    <Fondo id="lc_e33" tt={tt} b={3} br={0.7} />
    <div style={{ position: "absolute", left: 0, top: 920, width: 1920, height: 160, background: "linear-gradient(#f0f4f6,#d4dde4)", opacity: 1 - 0.5 * m }} />
    {[[700, 1], [960, 1.2], [1220, 0.9]].map(([x, s], i) => <Prop key={i} id="crocus" x={x} y={1000} w={260 * s * Math.min(1.05, gr)} sh={0} />)}
    <div style={{ ...BOX, background: "rgba(232,242,250,.7)", backdropFilter: "blur(10px)", WebkitMaskImage: `radial-gradient(circle ${1100 * m}px at 960px 700px, transparent 70%, black 100%)`, maskImage: `radial-gradient(circle ${1100 * m}px at 960px 700px, transparent 70%, black 100%)` }} />
    {Array.from({ length: 10 }, (_, k) => { const q = cl(m * 1.5 - rnd(k) * 0.5); return <div key={k} style={{ position: "absolute", left: 200 + 1500 * rnd(k + 3), top: 80 + 900 * q * rnd(k + 6), width: 8, height: 40 + 80 * q, borderRadius: 4, background: "linear-gradient(rgba(255,255,255,.6),rgba(200,220,240,.2))", opacity: q * (1 - q) * 3 }} />; })}
  </Cam>;
}} />;

// m38 · el repaso: siete bolsas de alimento en un estante; con cada lección una cae al piso con su golpe y su polvo
const HRecapSacks: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.4, ...Array.from({ length: 6 }, (_, i) => bt(h, i, 1.2 + i * 1))];
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lc_e08" tt={tt} b={9} br={0.45} />
    <div style={{ position: "absolute", left: 120, top: 520, width: 1680, height: 30, background: "linear-gradient(#8a6a44,#5a4026)", boxShadow: "0 14px 20px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 0, top: 980, width: 1920, height: 100, background: "linear-gradient(#6a4a2c,#4a3018)" }} />
    {st.map((a, i) => { const x = 230 + i * 245, f = tt > a ? Math.min(1, ((tt - a) / 0.45) ** 2) : 0, b = tt > a + 0.45 ? 30 * Math.abs(Math.sin((tt - a - 0.45) * 9)) * Math.exp(-(tt - a - 0.45) * 5) : 0;
      return <React.Fragment key={i}><Prop id="burlap_sack" x={x} y={520 + 460 * f - b} w={220} r={f * (i % 2 ? 12 : -12)} sh={f > 0.95 ? 0.8 : 0} />
        <Dust tt={tt} at={a + 0.45} x={x} y={980} w={260} /></React.Fragment>; })}
  </Cam>;
}} />;

// m39 · esta noche, si te despertás a las dos: el velador encendido; a la mitad hace clic, se apaga y queda la luz de luna
const HLampOff: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, on = tt < mid ? eio(tt, 0.3, 0.9) : 1 - cl((tt - mid) / 0.15), moon = cl((tt - mid) / 1.5);
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lc_e34" tt={tt} b={8} br={0.2 + 0.35 * on} />
    <Mesa y0={860} tone="#4a3424" />
    <Prop id="bedside_lamp" x={960} y={980} w={480} style={{ filter: `brightness(${0.35 + 0.65 * on})` }} />
    <Glow x={960} y={560} r={520} o={on * 1.3} col="255,210,140" />
    <div style={{ ...BOX, background: "linear-gradient(115deg,rgba(130,160,230,.35),transparent 55%)", opacity: moon, mixBlendMode: "screen" }} />
    {tt > mid && tt < mid + 0.2 && <div style={{ ...BOX, background: "#fff", opacity: 0.15 }} />}
  </Cam>;
}} />;

export const HCC: Record<string, C> = {
  clock2am: HClock2am, graveHat: HGraveHat, planeBench: HPlaneBench, grudgeNumber: HGrudgeNumber, kitchenCabinet: HKitchenCabinet,
  cashEnvelope: HCashEnvelope, sackHook: HSackHook, boatFloat: HBoatFloat, costList: HCostList, addingMachine: HAddingMachine,
  moldGrow: HMoldGrow, receiptOrStory: HReceiptOrStory, toolsLock: HToolsLock, twoColumns: HTwoColumns, kitchenTableIn: HKitchenTableIn,
  punchToast: HPunchToast, pumpFrost: HPumpFrost, tenPercent: HTenPercent, threeSentences: HThreeSentences, sawBlade: HSawBlade,
  punchClock: HPunchClock, obituaryFold: HObituaryFold, thatWinter: HThatWinter, cardPopup: HCardPopup, sackSmall: HSackSmall,
  doorHeights: HDoorHeights, suitcaseWait: HSuitcaseWait, mirrorSack: HMirrorSack, dayTiles: HDayTiles, stoveBurn: HStoveBurn,
  planeShaving: HPlaneShaving, sunsetBed: HSunsetBed, cowsCorn: HCowsCorn, fenceHam: HFenceHam, hatSnow: HHatSnow,
  graveWreath: HGraveWreath, boxPlane: HBoxPlane, frostSpring: HFrostSpring, recapSacks: HRecapSacks, lampOff: HLampOff,
};
