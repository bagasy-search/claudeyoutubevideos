// l9229c vuelta 2: reescritura de los componentes con nota ≤6 del evaluador v1 (huellas de bota, agua con ondas, rollo que cae por el
// borde, moho en frasco de conserva, foco de lámpara, hoja que se dobla de verdad, copa de cristal, reloj de fichar de hierro, diario,
// marco de puerta, viruta que se enrosca, manos con el sombrero, deshielo con gotas)
import React from "react";
import { staticFile } from "remotion";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

// huella de bota vista desde arriba en perspectiva: suela hundida + taco, borde de nieve levantada con luz y sombra
const Bota: React.FC<{ x: number; y: number; s: number; a: number; rot: number; tint: string }> = ({ x, y, s, a, rot, tint }) => <div style={{ position: "absolute", left: x - 34 * s, top: y - 70 * s, width: 68 * s, height: 140 * s, opacity: a, transform: `rotate(${rot}deg) scaleY(.55)` }}>
  <div style={{ position: "absolute", left: 0, top: 0, width: 68 * s, height: 84 * s, borderRadius: "48% 48% 40% 40%", background: `radial-gradient(ellipse at 50% 40%,${tint},rgba(150,170,200,.55) 70%)`, boxShadow: `0 -${4 * s}px 0 rgba(255,255,255,.95), inset 0 ${8 * s}px ${10 * s}px rgba(40,50,80,.55)` }} />
  <div style={{ position: "absolute", left: 8 * s, top: 92 * s, width: 52 * s, height: 46 * s, borderRadius: "40% 40% 45% 45%", background: `radial-gradient(ellipse at 50% 40%,${tint},rgba(150,170,200,.55) 70%)`, boxShadow: `0 -${4 * s}px 0 rgba(255,255,255,.95), inset 0 ${6 * s}px ${8 * s}px rgba(40,50,80,.55)` }} />
</div>;

const HGraveHat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2;
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lc_e02" tt={tt} b={6} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: "linear-gradient(#dfe7ef,#c4d0dc 60%,#b4c2d0)" }} />
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, backgroundImage: "radial-gradient(rgba(255,255,255,.9) 1px,transparent 1.5px)", backgroundSize: "23px 17px", opacity: 0.5 }} />
    <div style={{ position: "absolute", left: 1120, top: 740, width: 700, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(60,70,100,.5),transparent 70%)", transform: "skewX(-50deg)", filter: "blur(4px)" }} />
    <Prop id="gravestone" x={1120} y={770} w={440} />
    {Array.from({ length: 8 }, (_, i) => { const at = 0.3 + i * 0.42, s = 2.3 - i * 0.17; return <Bota key={i} x={300 + i * 105 + (i % 2 ? 26 : -26) * s} y={1010 - i * 36} s={s} a={cl((tt - at) / 0.2)} rot={-62} tint="rgba(70,85,120,.75)" />; })}
    {Array.from({ length: 6 }, (_, i) => { const at = mid + 0.3 + i * 0.42, s = 2.4 - i * 0.2; return <Bota key={"b" + i} x={1760 - i * 100 + (i % 2 ? 24 : -24) * s} y={1050 - i * 40} s={s} a={cl((tt - at) / 0.2)} rot={60} tint="rgba(95,80,70,.7)" />; })}
    <Nieve tt={tt} n={70} wind={20} o={0.85} />
  </Cam>;
}} />;

// el bote: cruza despacio todo el plano, ondas concéntricas que salen del casco, reflejo deformado y destellos que viajan
const HBoatFloat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), bx = 1500 - 900 * eio(tt, 0.2, d - 0.3), bob = Math.sin(tt * 2.2) * 12, rk = Math.sin(tt * 1.7) * 4;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="lc_e09" tt={tt} b={6} br={0.6} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "linear-gradient(#6a8a9a,#3a5666 50%,#22384a)" }} />
    {Array.from({ length: 18 }, (_, i) => { const y = 712 + (i % 6) * 60 + (i % 3) * 8, len = 80 + 140 * rnd(i), sp = 30 + 30 * rnd(i + 3); return <div key={i} style={{ position: "absolute", left: -200 + ((rnd(i + 9) * 2100 + tt * sp) % 2300), top: y, width: len, height: 4 + (y - 700) / 80, borderRadius: 4, background: "rgba(225,240,250,.32)" }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 4 }, (_, k) => { const q = (tt * 0.45 + k / 4) % 1; return <ellipse key={k} cx={bx} cy={810} rx={260 + 520 * q} ry={30 + 70 * q} fill="none" stroke="rgba(235,245,252,.6)" strokeWidth={5 - 3 * q} opacity={1 - q} />; })}
      <path d={`M${bx - 380},${808} q60,${-10 + 6 * Math.sin(tt * 5)} 120,0 t120,0`} stroke="rgba(255,255,255,.8)" strokeWidth={6} fill="none" />
    </svg>
    <div style={{ position: "absolute", left: bx - 450, top: 800, width: 900, height: 240, overflow: "hidden", opacity: 0.38, transform: `scaleY(-1) skewX(${4 * Math.sin(tt * 3)}deg)`, filter: "blur(3px)", WebkitMaskImage: "linear-gradient(black,transparent)" }}><Prop id="small_boat" x={450} y={1080 + bob} w={900} sh={0} /></div>
    <Prop id="small_boat" x={bx} y={810 + bob} w={900} r={rk} sh={0} />
    {Array.from({ length: 8 }, (_, k) => { const q = (tt * 0.5 + k / 8) % 1; return <div key={"g" + k} style={{ position: "absolute", left: 200 + 1500 * rnd(k) + 300 * q, top: 730 + 300 * rnd(k + 3), width: 60, height: 14, borderRadius: "50%", background: "radial-gradient(#fff,transparent 70%)", opacity: Math.sin(q * Math.PI) }} />; })}
  </Cam>;
}} />;

// la lista: el rollo rueda sobre la mesa dejando la cinta; a la mitad llega al borde, cae y la cinta queda colgando hasta el piso
const HCostList: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), fall = tt > mid ? cl((tt - mid) / 1.2) : 0, rx = 360 + 1140 * p;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="lc_e10" tt={tt} b={9} br={0.45} />
    <Mesa y0={620} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 360, top: 560, width: rx - 360, height: 220, background: "linear-gradient(90deg,#efe8d4,#fbf6e8 40%,#e8e0c8)", transform: "perspective(900px) rotateX(55deg)", transformOrigin: "50% 100%", boxShadow: "0 10px 20px rgba(0,0,0,.25)", overflow: "hidden" }}>
      <Ink tt={tt} at={0.9} dur={0.6} x={60} y={40} txt="the parties" size={110} w={560} />
      <Ink tt={tt} at={2.2} dur={0.6} x={700} y={40} txt="the sleep" size={110} w={520} />
    </div>
    {fall > 0 && <div style={{ position: "absolute", left: 1430, top: 760, width: 150, height: 40 + 520 * fall, background: "linear-gradient(90deg,#e0d8c0,#fbf6e8 45%,#d8cfb6)", boxShadow: "14px 10px 24px rgba(0,0,0,.45)", borderRadius: "0 0 6px 6px" }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 150, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1, color: "#b3322a", opacity: cl(fall * 3 - 1) }}>37<br />years</div></div>}
    <Prop id="paper_roll" x={rx + 30 * fall} y={720 + 520 * fall * fall} w={300} r={(rx - 360) * 0.4 + 200 * fall} sh={0.6 * (1 - fall)} />
  </Cam>;
}} />;

// moho: frasco de conserva en el sótano, linterna; el moho peludo crece por dentro, el vidrio suda y la etiqueta se hincha de 1.150 a 4.000
const HMoldGrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 0.4, d - 0.6), big = tt > d / 2, sc = 1 + 0.5 * eio(tt, d / 2, d / 2 + 1.2);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lc_e13" tt={tt} b={9} br={0.25} />
    <div style={{ ...BOX, background: "radial-gradient(ellipse 30% 45% at 50% 60%,rgba(255,230,170,.35),transparent 70%)" }} />
    <Prop id="canning_jar" x={960} y={1010} w={460} />
    <div style={{ position: "absolute", left: 960 - 190, top: 520, width: 380, height: 450, overflow: "hidden", borderRadius: 30 }}>
      {Array.from({ length: 26 }, (_, k) => { const a = cl(g * 1.5 - rnd(k) * 0.6), r = (24 + 60 * rnd(k + 2)) * a; return r > 1 ? <div key={k} style={{ position: "absolute", left: 380 * rnd(k + 5) - r, top: 450 * rnd(k + 8) - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle,rgba(230,235,215,.9) 0 18%,rgba(120,140,80,.85) 30%,rgba(70,90,45,.7) 55%,transparent 70%)", filter: "blur(1.5px)", boxShadow: `0 0 ${6 * a}px ${3 * a}px rgba(220,230,200,.35)` }} /> : null; })}
      {Array.from({ length: 30 }, (_, k) => <div key={"c" + k} style={{ position: "absolute", left: 380 * rnd(k + 40), top: 450 * rnd(k + 70), width: 6 + 6 * rnd(k), height: 8 + 8 * rnd(k), borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(255,255,255,.15) 60%)", opacity: cl(g * 2 - rnd(k + 11)) }} />)}
    </div>
    <div style={{ position: "absolute", left: 960 - 150 * sc, top: 690 - 60 * (sc - 1), width: 300 * sc, height: 150 * sc, background: "linear-gradient(#f4ecd4,#e0d4b0)", boxShadow: "0 6px 14px rgba(0,0,0,.4)", borderRadius: 6, transform: "rotate(-3deg)" }}>
      <div style={{ position: "absolute", left: 0, width: "100%", top: 18 * sc, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 92 * sc, lineHeight: 1, color: big ? "#9a1e18" : "#2a2a3a" }}>{big ? "$4,000" : "$1,150"}</div>
    </div>
  </Cam>;
}} />;

// ¿el recibo o la historia?: libro gordo que se abre solo, y un foco de lámpara que a la mitad viaja al único recibo del pinche
const HReceiptOrStory: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, sw = eio(tt, mid - 0.2, mid + 0.9), lx = 600 + 760 * sw, grow = 1 + 0.2 * eio(tt, 0.4, mid);
  return <Cam tt={tt} d={d} z={0.07} fx={lx} fy={760}>
    <Fondo id="lc_e12" tt={tt} b={8 + 8 * sw} br={0.45} />
    <Mesa y0={820} tone="#6a4a2c" />
    <Prop id="story_book" x={600} y={1010} w={820 * grow} />
    <Prop id="receipt_spike" x={1360} y={1010} w={400} />
    <div style={{ ...BOX, background: `radial-gradient(circle 430px at ${lx}px 820px, transparent 35%, rgba(0,0,0,.72) 100%)` }} />
    <Glow x={lx} y={760} r={360} o={0.5} col="255,236,190" />
  </Cam>;
}} />;

// dos columnas: el lápiz traza la raya del medio con grafito y escribe sólo «forgive» y «trust»
const HTwoColumns: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ln = eio(tt, 0.4, 1.6), w1 = cl((tt - 2) / 1.4), w2 = cl((tt - 4) / 1.2);
  const pen = tt < 1.8 ? [700, 260 + 560 * ln] : tt < 3.6 ? [420 + 440 * w1, 470] : [1060 + 380 * w2, 470];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lc_e14" tt={tt} b={10} br={0.4} />
    <div style={{ position: "absolute", left: 300, top: 180, width: 1320, height: 800, background: "repeating-linear-gradient(#fdfbf2 0 56px,#c9dbe9 56px 58px)", boxShadow: "0 30px 50px rgba(0,0,0,.5)", transform: "perspective(1600px) rotateX(18deg)" }}>
      <div style={{ position: "absolute", left: 400, top: 60, width: 9, height: 690 * ln, background: "linear-gradient(90deg,#55555c,#2a2a30,#55555c)", borderRadius: 5, opacity: 0.85 }} />
    </div>
    <Ink tt={tt} at={2} dur={1.4} x={420} y={400} txt="forgive" size={150} w={560} col="#22314f" />
    <Ink tt={tt} at={4} dur={1.2} x={1060} y={400} txt="trust" size={150} w={460} col="#b3322a" />
    <Prop id="pencil" x={pen[0] + 140} y={pen[1] + 60} w={420} r={-50} sh={0.6} />
  </Cam>;
}} />;

// la hoja se dobla de verdad: la mitad de arriba cae sobre la de abajo, después en cuatro, y una mano la mete bajo la azucarera
const HKitchenTableIn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), f1 = eio(tt, 1.0, 1.9), f2 = eio(tt, d / 2 - 0.4, d / 2 + 0.4), go = eio(tt, d / 2 + 0.9, d / 2 + 2.2), W = 760, H = 520;
  const x = 380 + 820 * go, y = 420 + 240 * go, sc = 1 - 0.45 * go;
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lc_e19" tt={tt} b={10} br={0.45} />
    <Formica y0={760} />
    <div style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: `perspective(1400px) rotateX(48deg) scale(${sc})`, transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: H / 2, width: f2 > 0.5 ? W / 2 : W, height: H / 2, background: "repeating-linear-gradient(#fdfaf0 0 44px,#c8d8e8 44px 46px)", boxShadow: "0 30px 30px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H / 2, transformOrigin: "50% 100%", transform: `rotateX(${-178 * f1}deg)`, background: f1 > 0.5 ? "linear-gradient(#e4ddc8,#d0c8b0)" : "repeating-linear-gradient(#fdfaf0 0 44px,#c8d8e8 44px 46px)", boxShadow: f1 > 0.05 && f1 < 0.95 ? "0 0 40px rgba(0,0,0,.35)" : "none" }}>
        {f1 < 0.5 && <div style={{ position: "absolute", left: 40, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 92, color: "#22314f" }}>I forgive you, Ray.</div>}
      </div>
      {f2 > 0 && <div style={{ position: "absolute", left: W / 2, top: H / 2, width: W / 2, height: H / 2, transformOrigin: "0 50%", transform: `rotateY(${-178 * f2}deg)`, background: "linear-gradient(90deg,#d8d0b8,#efe8d4)", boxShadow: "0 0 30px rgba(0,0,0,.3)" }} />}
    </div>
    {go > 0 && go < 1 && <Prop id="hand_flat" x={x + 260} y={y + 560} w={380} r={-70} sh={0} />}
    <Prop id="sugar_bowl" x={1460} y={1000} w={400} />
  </Cam>;
}} />;

// el brindis: la copa de cristal sube, se inclina en la risa, la gota cae con corona de salpicadura y la mancha se chupa la tela del mantel
const HPunchToast: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, 1.0), tilt = 26 * eio(tt, 1.2, 2.2) + (tt > 2.2 ? swing(tt, 2.2, 5, 5, 0.9) : 0), drop = 2.0, dy = cl((tt - drop) / 0.45), st = eio(tt, drop + 0.45, d - 0.8);
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lc_e16" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 840, width: 1920, height: 240, background: "repeating-linear-gradient(90deg,#f7f5ee 0 90px,#e6e2d6 90px 120px,#f7f5ee 120px 200px)", boxShadow: "inset 0 20px 30px rgba(0,0,0,.15)" }} />
    <Prop id="crystal_punch_cup" x={880} y={940 - 340 * up} w={340} r={tilt} sh={0.3 * (1 - up)} />
    {tt > drop && dy < 1 && <div style={{ position: "absolute", left: 1020, top: 560 + 380 * dy * dy, width: 30, height: 40, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#ff8a8a,#b00818 60%)" }} />}
    {tt > drop + 0.45 && tt < drop + 1.1 && Array.from({ length: 10 }, (_, k) => { const s = (tt - drop - 0.45) / 0.65, a = Math.PI * (0.1 + 0.8 * k / 9); return <div key={k} style={{ position: "absolute", left: 1030 - Math.cos(a) * 140 * s, top: 950 - Math.sin(a) * 110 * s + 160 * s * s, width: 12, height: 12, borderRadius: "50%", background: "#b00818", opacity: 1 - s }} />; })}
    {st > 0 && Array.from({ length: 7 }, (_, k) => { const r = (60 + 90 * rnd(k)) * st; return <div key={"s" + k} style={{ position: "absolute", left: 1030 + (rnd(k + 4) - 0.5) * 220 * st - r, top: 960 + (rnd(k + 6) - 0.5) * 50 * st - r * 0.3, width: r * 2, height: r * 0.6, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(170,10,30,.8),rgba(200,40,60,.45) 55%,transparent 72%)", filter: "blur(2px)" }} />; })}
  </Cam>;
}} />;

// tres oraciones cortas en tres tarjetas grandes, de a una, cada broche la muerde y la hace hamacar
const HThreeSentences: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.4, 0.4 + (d - 1.4) / 3, 0.4 + 2 * (d - 1.4) / 3], tx = ["what happened", "my part", "I'm sorry"], CW = 540, CH = 400;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="lc_e18" tt={tt} b={8} br={0.5} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d="M-20,280 Q960,380 1940,280" stroke="#d8cfb8" strokeWidth={7} fill="none" /></svg>
    {tx.map((s_, i) => { const L = land(tt, at[i], 500, 9, 0.35), sw = swing(tt, at[i] + 0.4, 8, 4, 0.8), x = 380 + i * 580, y = 320 + (i === 1 ? 26 : 0);
      return L.on ? <div key={i} style={{ ...BOX, transformOrigin: `${x}px ${y}px`, transform: `translateY(${L.dy}px) rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: x - CW / 2, top: y + 20, width: CW, height: CH, background: "linear-gradient(#fdfaf0,#efe6cc)", boxShadow: "12px 22px 28px rgba(0,0,0,.45)" }}>
          <div style={{ position: "absolute", left: 0, width: CW, top: 110, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: i === 0 ? 84 : 104, lineHeight: 1.05, color: i === 2 ? "#b3322a" : "#22314f" }}>{s_}</div></div>
        <Prop id="clothespin" x={x} y={y + 110} w={80} r={90} sh={0} />
      </div> : null; })}
  </Cam>;
}} />;

// el reloj de fichar de hierro: la tarjeta baja a la ranura, la palanca golpea ¡chac! y sube estampada en rojo; entra nieve por la puerta
const HPunchClock: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, inn = eio(tt, 0.4, mid - 0.3), lever = tt > mid - 0.3 && tt < mid + 0.3 ? Math.sin(cl((tt - mid + 0.3) / 0.6) * Math.PI) : 0, out = eio(tt, mid + 0.4, mid + 1.6);
  const cy = 120 + 330 * inn - 330 * out, cx = 960 + 520 * out, sc = 1 + 0.4 * out, bump = tt > mid && tt < mid + 0.25 ? 10 * Math.sin((tt - mid) * 70) : 0, ang = tt * 6;
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lc_e21" tt={tt} b={9} br={0.4} />
    <Nieve tt={tt} n={60} wind={90} o={0.55} />
    <div style={{ position: "absolute", left: cx - 120, top: cy, width: 240, height: 380, background: "linear-gradient(#f2ead2,#e0d4b2)", boxShadow: "10px 16px 24px rgba(0,0,0,.45)", transform: `scale(${sc}) rotate(${-5 * out}deg)`, zIndex: out > 0.02 ? 2 : 0 }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: 16, top: 70 + i * 36, width: 208, height: 2, background: "#b8a888" }} />)}
      <div style={{ position: "absolute", left: 18, top: 10, fontFamily: SER, fontWeight: 900, fontSize: 30, color: "#5a4a3a" }}>NO. 114</div>
      <div style={{ position: "absolute", left: 14, top: 200, fontFamily: "monospace", fontWeight: 700, fontSize: 84, color: "#c0181c", opacity: tt > mid + 0.1 ? 1 : 0, transform: "rotate(-6deg)", textShadow: "0 0 3px rgba(192,24,28,.6)" }}>7:02</div>
    </div>
    <div style={{ position: "absolute", left: 960 - 270, top: 300 + bump, width: 540, height: 760, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(90deg,#3a4440,#56625c 40%,#2e3632)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 10px #2a302c", zIndex: 1 }}>
      <div style={{ position: "absolute", left: 90, top: 40, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(#fbf8ee,#e4dcc6)", boxShadow: "inset 0 0 0 14px #c8b88a, inset 0 0 30px rgba(0,0,0,.3)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 177, top: 22, width: 6, height: 26, background: "#222", transformOrigin: "3px 158px", transform: `rotate(${i * 30}deg)` }} />)}
        <div style={{ position: "absolute", left: 175, top: 70, width: 10, height: 112, background: "#222", transformOrigin: "5px 110px", transform: `rotate(${12 + ang * 0.1}deg)` }} />
        <div style={{ position: "absolute", left: 177, top: 100, width: 7, height: 82, background: "#222", transformOrigin: "3px 80px", transform: `rotate(${210 + ang * 0.01}deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 450, width: 300, height: 26, background: "#111", borderRadius: 6, boxShadow: "inset 0 6px 8px #000" }} />
      <div style={{ position: "absolute", left: 500, top: 470, width: 220, height: 30, borderRadius: 15, background: "linear-gradient(#b0b4b0,#6a706c)", transformOrigin: "10px 15px", transform: `rotate(${-30 + 50 * lever}deg)` }}><div style={{ position: "absolute", right: -10, top: -14, width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#222,#000)" }} /></div>
    </div>
    {tt > mid && tt < mid + 0.5 && <Rings tt={tt} at={mid} x={960} y={760} s={0.6} />}
  </Cam>;
}} />;

// el obituario: el diario grande se despliega sobre la mesa con su foto sepia; la chapa cae AL COSTADO, rebota y la cadena queda enroscada
const HObituaryFold: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.4, 1.5), L = land(tt, d / 2, 520, 10, 0.32);
  const line = (k: number, w: number) => <div key={k} style={{ height: 9, width: w, background: "rgba(60,55,50,.55)", margin: "0 0 9px 0", borderRadius: 2 }} />;
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="lc_e22" tt={tt} b={12} br={0.35} />
    <Mesa y0={700} tone="#5e4028" />
    <div style={{ position: "absolute", left: 250, top: 260, width: 1100, height: 720, transform: "perspective(1600px) rotateX(38deg)", transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 550, top: 0, width: 550, height: 720, background: "linear-gradient(#f1ecdc,#ddd5bf)", padding: 40, boxSizing: "border-box", boxShadow: "0 20px 30px rgba(0,0,0,.35)" }}>
        <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#1d1a16", lineHeight: 1 }}>NOVAK</div>
        <div style={{ display: "flex", gap: 18, marginTop: 18 }}>
          <img src={staticFile("img/l9229c/lc_e20.jpg")} style={{ width: 200, height: 250, objectFit: "cover", filter: "sepia(1) contrast(1.1) brightness(.85)" }} />
          <div>{[220, 240, 200, 230, 180, 236, 210, 190, 228].map((w, k) => line(k, w))}</div>
        </div>
        <div style={{ marginTop: 20 }}>{[460, 440, 470, 400, 450, 430, 300].map((w, k) => line(k + 20, w))}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 550, height: 720, transformOrigin: "100% 50%", transform: `rotateY(${180 - 180 * op}deg)`, background: "linear-gradient(#ece6d6,#d4ccb8)", padding: 40, boxSizing: "border-box", backfaceVisibility: "hidden" }}>
        {[460, 450, 470, 430, 460, 440, 470, 400, 450, 430, 460, 300].map((w, k) => line(k + 40, w))}
      </div>
    </div>
    {L.on && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: L.dy }}><path d={`M1560,900 c-60,-40 -40,-110 30,-90 c70,20 40,90 -20,70 c-50,-16 -30,-70 20,-60`} fill="none" stroke="#a8aca8" strokeWidth={6} strokeDasharray="4 6" /></svg>}
    {L.on && <Prop id="dog_tag" x={1580} y={960 + L.dy} w={280} r={-25} sq={L.sq} sh={0.8} />}
  </Cam>;
}} />;

// Tommy tiene 34: el marco de madera pintada de la puerta de la cocina, con rayas viejas gastadas; el lápiz sube y marca cada año
const HDoorHeights: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ages = [9, 12, 15, 18, 22, 27, 34], seg = (d - 1.6) / ages.length, cur = Math.min(ages.length - 1, Math.max(0, Math.floor((tt - 0.4) / seg)));
  const Y = (i: number) => 930 - i * 118, slide = eio(tt, 0, 0.7);
  return <Cam tt={tt} d={d} z={0.06} fy={520}>
    <Fondo id="lc_e24" tt={tt} b={12} br={0.4} />
    <div style={{ position: "absolute", left: 980, top: -40, width: 700, height: 1160, background: "linear-gradient(90deg,rgba(0,0,0,.6),rgba(20,14,8,.85))" }} />
    <div style={{ position: "absolute", left: 640 - 300 * (1 - slide), top: -40, width: 340, height: 1160, background: "repeating-linear-gradient(90deg,#ece4cf 0 3px,#f6f0de 3px 40px,#e6dcc4 40px 44px,#f3ecd8 44px 90px)", boxShadow: "inset -18px 0 24px rgba(0,0,0,.25), 24px 0 40px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 300, top: 0, width: 40, height: 1160, background: "linear-gradient(90deg,#d8ccb2,#bfb194)" }} />
      {[0.23, 0.41, 0.66, 0.8].map((y, k) => <div key={k} style={{ position: "absolute", left: 60 + 150 * rnd(k), top: 1160 * y, width: 14, height: 6, borderRadius: 3, background: "rgba(120,100,70,.4)" }} />)}
      {[1000, 880, 760].map((y, k) => <div key={"o" + k} style={{ position: "absolute", left: 80, top: y + 40, width: 120, height: 5, background: "rgba(90,90,100,.25)" }} />)}
    </div>
    {ages.map((a, i) => { const at = 0.4 + i * seg, p = cl((tt - at) / 0.4); return p > 0 ? <React.Fragment key={i}>
      <div style={{ position: "absolute", left: 700, top: Y(i), width: 210 * p, height: 8, background: "#34343c", borderRadius: 3, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 720, top: Y(i) - 70, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#34343c", opacity: p * 0.85 }}>{a}</div>
    </React.Fragment> : null; })}
    <Prop id="pencil" x={940 + 120} y={Y(cur) + 70} w={440} r={-55} sh={0.4} />
  </Cam>;
}} />;

// la viruta: el cepillo corre la tabla entera y la cinta de madera sale de la boca, se enrosca en rizos desparejos y cae con sombra
const HPlaneShaving: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.6), x = 560 + 860 * p;
  const N = Math.floor(90 * p) + 2, pts: string[] = [];
  for (let i = 0; i < N; i++) { const u = i / 90, bx = x - 120 - 820 * u, a = u * Math.PI * 9, r = 46 + 26 * Math.sin(u * 13) + 14 * rnd(Math.floor(u * 9)); pts.push(`${bx + Math.cos(a) * r * 0.8},${770 - 60 - Math.sin(a) * r}`); }
  return <Cam tt={tt} d={d} z={0.06} fx={x} fy={760}>
    <Fondo id="lc_e27" tt={tt} b={10} br={0.45} />
    <Prop id="wood_board" x={960} y={1000} w={1760} />
    <div style={{ position: "absolute", left: 300, top: 790, width: Math.max(0, x - 300), height: 46, background: "repeating-linear-gradient(90deg,#f6e2b6 0 30px,#ecd29c 30px 34px)", opacity: 0.85, filter: "blur(.5px)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polyline points={`${x - 70},800 ${pts.join(" ")}`} fill="none" stroke="rgba(60,40,20,.35)" strokeWidth={30} strokeLinejoin="round" transform="translate(10,16)" style={{ filter: "blur(6px)" }} />
      <polyline points={`${x - 70},800 ${pts.join(" ")}`} fill="none" stroke="#c9975a" strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={`${x - 70},800 ${pts.join(" ")}`} fill="none" stroke="#f4d9a2" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    <Prop id="old_plane2" x={x} y={880} w={540} r={Math.sin(tt * 18) * 0.8} sh={0.8} />
  </Cam>;
}} />;

// el sombrero en las manos de Lou frente a la lápida: la cabeza se inclina y la nieve se junta en un montículo desparejo sobre la copa
const HHatSnow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.2, 1.1), acc = eio(tt, 0.9, d - 0.3), bow = eio(tt, 0.5, d) * 50;
  const cap = Array.from({ length: 17 }, (_, i) => { const u = i / 16, x = 810 + 300 * u, y = 550 - (8 + 34 * acc) * Math.sin(u * Math.PI) - 6 * acc * Math.sin(u * 23 + 1.7); return `${x},${y}`; }).join(" ");
  return <Cam tt={tt} d={d} z={0.08} fy={640}>
    <Fondo id="lc_e31" tt={tt} b={12} br={0.45} />
    <Nieve tt={tt} n={120} wind={10} o={0.9} />
    <div style={{ ...BOX, transform: `translateY(${300 * (1 - up) + bow}px)` }}>
      <Prop id="old_hands_hold" x={960} y={1330} w={820} sh={0} />
      <Prop id="fedora_hat" x={960} y={840} w={640} sh={0.5} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon points={`${cap} 1110,566 810,566`} fill="url(#nv)" style={{ filter: "drop-shadow(0 4px 4px rgba(60,70,90,.35))" }} opacity={cl(acc * 4)} />
        <defs><linearGradient id="nv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#dde6ee" /></linearGradient></defs>
        <path d={`M640,${792 - 6 * acc} q170,${-12 - 10 * acc} 330,0`} stroke="#f6f9fb" strokeWidth={4 + 12 * acc} strokeLinecap="round" fill="none" opacity={cl(acc * 3)} />
      </svg>
    </div>
  </Cam>;
}} />;

// primer día de primavera: una mancha tibia se abre en el centro del vidrio, el borde de hielo retrocede y corren gotas
const HFrostSpring: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), m = eio(tt, 0.4, d - 0.6), R = 120 + 1000 * m;
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="lc_e33" tt={tt} b={0} br={0.75} />
    <div style={{ ...BOX, background: "rgba(230,240,248,.6)", backdropFilter: "blur(16px)", WebkitMaskImage: `radial-gradient(circle ${R}px at 960px 640px, transparent 75%, black 100%)`, maskImage: `radial-gradient(circle ${R}px at 960px 640px, transparent 75%, black 100%)` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, WebkitMaskImage: `radial-gradient(circle ${R}px at 960px 640px, transparent 80%, black 100%)`, maskImage: `radial-gradient(circle ${R}px at 960px 640px, transparent 80%, black 100%)` }}>
      {Array.from({ length: 40 }, (_, k) => { const a = rnd(k) * Math.PI * 2, r0 = 200 + 900 * rnd(k + 1), x = 960 + Math.cos(a) * r0, y = 640 + Math.sin(a) * r0; return <path key={k} d={`M${x},${y} l${30 * Math.cos(a + 0.5)},${30 * Math.sin(a + 0.5)} m-15,-15 l${-30 * Math.cos(a - 0.5)},${-30 * Math.sin(a - 0.5)}`} stroke="rgba(255,255,255,.7)" strokeWidth={2} />; })}
    </svg>
    {Array.from({ length: 14 }, (_, k) => { const a = rnd(k + 3) * Math.PI * 2, x = 960 + Math.cos(a) * R * 0.78, y0 = 640 + Math.sin(a) * R * 0.78, q = cl((tt - 1 - rnd(k) * (d - 2)) / 1.4); return q > 0 && q < 1 ? <div key={k} style={{ position: "absolute", left: x, top: y0 + 200 * q, width: 10, height: 20 + 60 * q, borderRadius: 6, background: "linear-gradient(rgba(255,255,255,.1),rgba(255,255,255,.75))", boxShadow: "0 0 4px rgba(255,255,255,.5)" }} /> : null; })}
    <Glow x={960} y={640} r={R * 0.6} o={0.25 * m} col="255,240,200" />
  </Cam>;
}} />;

export const HCC2: Record<string, C> = {
  graveHat: HGraveHat, boatFloat: HBoatFloat, costList: HCostList, moldGrow: HMoldGrow, receiptOrStory: HReceiptOrStory,
  twoColumns: HTwoColumns, kitchenTableIn: HKitchenTableIn, punchToast: HPunchToast, threeSentences: HThreeSentences,
  punchClock: HPunchClock, obituaryFold: HObituaryFold, doorHeights: HDoorHeights, planeShaving: HPlaneShaving,
  hatSnow: HHatSnow, frostSpring: HFrostSpring,
};
