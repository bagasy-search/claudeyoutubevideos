// l9229d «Dreams» · parte 2: las mecedoras, June y el mar, la ruta 66 con Tommy, la mesa de nogal terminada, la rutina del lunes.
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";
import { staticFile, Img } from "remotion";

const PH = (id: string) => staticFile("img/l9229d/" + id + ".jpg");

// «se mecía como un bote»: la primera mecedora torcida cabecea de más, con el horizonte del porche inclinándose detrás
const HCrookedRock: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = 16 * Math.sin(tt * 2.2) + 6 * Math.sin(tt * 3.7), hard = tt > d / 2 ? 1.4 : 1;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ ...BOX, transform: `rotate(${a * 0.15 * hard}deg) scale(1.1)` }}><Fondo id="ld_e18" tt={tt} b={10} br={0.42} /></div>
    <div style={{ position: "absolute", left: 0, top: 900, width: 1920, height: 180, background: "repeating-linear-gradient(90deg,#6a4a2a 0 180px,#4a3018 180px 186px)" }} />
    <Prop id="rocking_chair" x={960} y={940} w={640} r={a * hard} />
    <div style={{ position: "absolute", left: 960 - 260, top: 920, width: 520, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.45)", filter: "blur(10px)", transform: `scaleX(${1 - Math.abs(a) * 0.01})` }} />
  </Cam>;
}} />;

// diez mecedoras en fila: cada una se mece menos que la anterior hasta que la décima queda quieta y firme (brillo)
const HTenChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.05} fx={1400}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.4} />
    <Mesa y0={880} tone="#5a3e26" />
    {Array.from({ length: 10 }, (_, k) => { const at = 0.3 + k * (d * 0.6 / 10), L = land(tt, at, 400, 9, 0.35), amp = 14 * (1 - k / 9); return L.on ? <Prop key={k} id="rocking_chair" x={140 + k * 180} y={960 + L.dy} w={240 + k * 12} r={amp * Math.sin(tt * 2.6 + k)} sq={L.sq} /> : null; })}
    {tt > 0.3 + 9 * d * 0.06 && <Glow x={1760} y={760} r={220} o={0.9} />}
  </Cam>;
}} />;

// June se cae en los escalones: el bastón se resbala, rebota escalón por escalón y queda tirado; polvo en cada golpe
const HCaneSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), steps = [[760, 520], [1000, 680], [1240, 840], [1480, 1000]], seg = 0.55;
  const i = Math.min(3, Math.max(0, Math.floor((tt - 0.8) / seg))), f = cl((tt - 0.8 - i * seg) / seg), a = steps[i], b = steps[Math.min(3, i + 1)];
  const x = tt < 0.8 ? 640 : a[0] + (b[0] - a[0]) * f, y = tt < 0.8 ? 520 : a[1] + (b[1] - a[1]) * f - 120 * Math.sin(f * Math.PI) * (i < 3 ? 1 : 0), r = tt < 0.8 ? -10 * Math.sin(tt * 4) : 70 + 200 * cl((tt - 0.8) / (4 * seg));
  return <Cam tt={tt} d={d} z={0.05} fx={x} fy={y}>
    <Fondo id="ld_e19" tt={tt} b={12} br={0.42} />
    {steps.map(([sx, sy], k) => <div key={k} style={{ position: "absolute", left: sx - 300, top: sy, width: 2000, height: 1080, background: "linear-gradient(#6a5440 0 18px,#4a3a2a 18px)", borderTop: "8px solid #c8b090", boxShadow: "0 -20px 30px rgba(0,0,0,.5)" }} />)}
    <Prop id="cane" x={x} y={y + 20} w={420} r={r} />
    {[0, 1, 2].map((k) => tt > 0.8 + (k + 1) * seg ? <Dust key={k} tt={tt} at={0.8 + (k + 1) * seg} x={steps[k + 1][0]} y={steps[k + 1][1]} w={300} /> : null)}
  </Cam>;
}} />;

// «las pozas tienen estrellas de mar»: sobre el folleto, las estrellas aparecen en el agua de la poza con ondas, una naranja y una violeta
const HStarfishBrochure: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = land(tt, 0.6, 400, 8, 0.3), b = land(tt, d / 2, 400, 8, 0.3);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="ld_e20" tt={tt} b={2} br={0.75} />
    <div style={{ ...BOX, background: "radial-gradient(ellipse at 50% 70%,rgba(80,140,160,.35),transparent 60%)" }} />
    {a.on && <><Prop id="starfish_orange" x={760} y={820 + a.dy * 0.3} w={360} r={-12} sq={a.sq} /><Rings tt={tt} at={0.9} x={760} y={720} /></>}
    {b.on && <><Prop id="starfish_purple" x={1200} y={880 + b.dy * 0.3} w={380} r={20} sq={b.sq} /><Rings tt={tt} at={d / 2 + 0.3} x={1200} y={780} /></>}
    {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 300 + 1300 * rnd(k), top: 500 + 400 * rnd(k + 4), width: 30, height: 4, borderRadius: 2, background: "rgba(255,255,255,.6)", opacity: 0.5 + 0.5 * Math.sin(tt * 3 + k) }} />)}
  </Cam>;
}} />;

// un tazón de agua con sal: el salero se inclina, la sal cae en el agua de la palangana y se disuelve en remolinos; a la mitad, los pies (ondas)
const HSaltBowl: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tilt = eio(tt, 0.3, 0.9) * (1 - eio(tt, d / 2 - 0.5, d / 2));
  return <Cam tt={tt} d={d} z={0.07} fy={700}>
    <Fondo id="ld_e21" tt={tt} b={12} br={0.42} />
    <Mesa y0={840} tone="#6a4a2e" />
    <Prop id="enamel_basin" x={960} y={1000} w={1000} />
    <div style={{ position: "absolute", left: 960 - 400, top: 720, width: 800, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(170,200,210,.85),rgba(120,160,175,.7))", overflow: "hidden" }}>
      {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ position: "absolute", left: 400 - 30 * k + 20 * Math.sin(tt * 2 + k), top: 75 - 10 * k, width: 60 * k + 40, height: 20 * k + 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.5)", transform: `rotate(${tt * 40 * (k % 2 ? 1 : -1)}deg)`, opacity: cl((tt - 1) / 1) * 0.7 }} />)}
    </div>
    {tt > d / 2 && <Rings tt={tt} at={d / 2 + 0.2} x={960} y={790} s={1.4} />}
    <Prop id="salt_shaker" x={960 + 60 * tilt} y={520} w={220} r={160 * tilt} />
    {tilt > 0.6 && Array.from({ length: 30 }, (_, k) => { const q = (tt * 2 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 950 + 30 * (rnd(k + 3) - 0.5), top: 360 + 380 * q, width: 5, height: 5, background: "#fff", opacity: 0.9 }} />; })}
  </Cam>;
}} />;

// escribí cada razón: notas adhesivas amarillas se pegan en la heladera con su excusa, y cada una se despega y cae cuando aparece la siguiente
const HReasonNotes: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), R = ["too old", "money", "my knee", "next year"], seg = d / 4.5;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e13" tt={tt} b={8} br={0.5} />
    {R.map((r, k) => { const at = 0.3 + k * seg, on = phys(tt, at, 9, 0.35), off = k < 3 ? cl((tt - at - seg) / 0.8) : 0; return tt > at ? <div key={k} style={{ position: "absolute", left: 520 + k * 60, top: 280 + 600 * off * off, width: 720, height: 520, background: "linear-gradient(#fff3a0,#f2de6a)", boxShadow: "8px 14px 20px rgba(0,0,0,.35)", transform: `scale(${on}) rotate(${-4 + 3 * k + 60 * off}deg)`, opacity: 1 - off, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 130, color: "#2a2a4a" }}>{r}</div> : null; })}
  </Cam>;
}} />;

// «aunque llueva»: el paraguas se abre de golpe (resorte) y la lluvia rebota en su tela en gotas; a la mitad el paraguas da un paso
const HUmbrellaRain: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = phys(tt, 0.6, 7, 0.4), step = eio(tt, d / 2, d / 2 + 1);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="ld_e22" tt={tt} b={6} br={0.45} />
    {Array.from({ length: 90 }, (_, k) => { const x = (k * 97) % 1920, y = ((tt * 1400 + k * 230) % 1200) - 100; return <div key={k} style={{ position: "absolute", left: x, top: y, width: 2, height: 40, background: "rgba(200,220,240,.55)", transform: "rotate(10deg)" }} />; })}
    <Prop id="umbrella" x={900 + 200 * step} y={980} w={300 + 600 * op} sq={0} r={-6 * Math.sin(step * Math.PI)} />
    {op > 0.8 && Array.from({ length: 16 }, (_, k) => { const q = (tt * 2 + rnd(k)) % 1; return <div key={"s" + k} style={{ position: "absolute", left: 900 + 200 * step + (rnd(k) - 0.5) * 700 + (rnd(k) - 0.5) * 200 * q, top: 420 - 80 * q + 100 * q * q, width: 8, height: 8, borderRadius: "50%", background: "rgba(220,235,250,.8)", opacity: 1 - q }} />; })}
  </Cam>;
}} />;

// la revista en la peluquería: el poste giratorio (rayas que suben por CSS) y la página de la revista que se da vuelta y muestra la ruta
const HBarberPole: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), pg = eio(tt, d / 2 - 0.4, d / 2 + 0.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e23" tt={tt} b={12} br={0.42} />
    <div style={{ position: "absolute", left: 340, top: 140, width: 200, height: 800, borderRadius: 100, overflow: "hidden", boxShadow: "inset -30px 0 40px rgba(0,0,0,.4), inset 30px 0 30px rgba(255,255,255,.4), 0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: -200, top: -600 + ((tt * 160) % 240), width: 600, height: 2400, background: "repeating-linear-gradient(45deg,#c8202a 0 60px,#fafafa 60px 120px,#1a3a8a 120px 180px,#fafafa 180px 240px)" }} /></div>
    <div style={{ position: "absolute", left: 340, top: 100, width: 200, height: 60, borderRadius: 30, background: "radial-gradient(circle at 40% 30%,#f2f2f6,#8a8a98)" }} />
    <div style={{ position: "absolute", left: 780, top: 220, width: 900, height: 640, background: "#f4efe2", boxShadow: "14px 20px 30px rgba(0,0,0,.45)" }}>
      <Img src={PH("ld_e24")} style={{ position: "absolute", left: 40, top: 40, width: 820, height: 420, objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 40, top: 480, fontFamily: SER, fontWeight: 900, fontSize: 90, color: "#1a1a1a" }}>Route 66</div>
    </div>
    <div style={{ position: "absolute", left: 1230, top: 220, width: 450, height: 640, background: "linear-gradient(90deg,#e8e0cc,#f8f4e8)", transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-180 * pg}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.3)", opacity: pg < 1 ? 1 : 0, backfaceVisibility: "hidden" }} />
  </Cam>;
}} />;

// «te llevo»: sobre el mapa de papel la línea roja de la ruta se dibuja de Chicago al oeste; a la mitad pasa junto al Gran Cañón y se enciende un punto
const HRouteLine: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2), gc = eio(tt, d / 2, d / 2 + 0.5);
  const path = "M1620,360 C1500,420 1380,420 1260,480 S1060,560 940,560 S700,600 600,640 S420,700 300,720";
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e10" tt={tt} b={14} br={0.4} />
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 760, boxShadow: "14px 20px 30px rgba(0,0,0,.45)", backgroundImage: "repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 400px),repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 2px,transparent 2px 380px),linear-gradient(135deg,#efe6c8,#e2d6b0)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M200,500 Q600,400 900,460 T1700,420" stroke="rgba(90,130,170,.4)" strokeWidth={8} fill="none" />
      <path d={path} stroke="#b3322a" strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={`${1600 * p} 4000`} />
      <circle cx={1620} cy={360} r={18} fill="#b3322a" />
      {gc > 0 && <><circle cx={760} cy={560} r={28 * gc} fill="#e8a020" /><circle cx={760} cy={560} r={70 * gc} fill="none" stroke="#e8a020" strokeWidth={4} opacity={1 - gc * 0.6} /></>}
    </svg>
    {gc > 0 && <div style={{ position: "absolute", left: 640, top: 600, width: 240, height: 160, borderRadius: 8, overflow: "hidden", boxShadow: "6px 10px 16px rgba(0,0,0,.4)", transform: `scale(${gc}) rotate(-4deg)` }}><Img src={PH("ld_e34")} style={{ width: 240, height: 160, objectFit: "cover" }} /></div>}
  </Cam>;
}} />;

// elegí UNA persona: el teléfono de disco suena, el tubo se levanta (resorte) y el cable se estira; ondas de voz salen del auricular
const HTellOne: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ring = tt < 1.2 ? Math.sin(tt * 70) * 5 : 0, up = phys(tt, 1.3, 6, 0.4);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="ld_e32" tt={tt} b={12} br={0.42} />
    <Formica y0={800} />
    <Prop id="rotary_phone" x={960 + ring} y={960 - 20 * Math.abs(ring) * 0.2} w={760} r={ring * 0.5} />
    {[0, 1, 2, 3, 4].map((k) => <Rings key={k} tt={tt} at={0.2 + k * 0.5} x={960} y={600} s={1.1} />)}
    <Glow x={960} y={640} r={420} o={tt > d / 2 ? 0.8 : 0.3} />
    {tt > d / 2 && <div style={{ position: "absolute", left: 1300, top: 260, width: 440, height: 300, borderRadius: 40, background: "#fbf8ee", boxShadow: "10px 16px 24px rgba(0,0,0,.4)", transform: `scale(${phys(tt, d / 2, 8, 0.4)})`, transformOrigin: "0 100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 90, color: "#22314f" }}>Tommy</div>}
  </Cam>;
}} />;

// dos sueños en un auto: una valija cae al baúl del Buick, rebota; a la mitad cae la segunda, la de Tommy, y el auto se hunde
const HTwoSuitcases: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = land(tt, 0.4, 700, 8, 0.4), b = land(tt, d / 2, 700, 8, 0.4), sink = 10 * (cl((tt - 0.9) / 0.3) + cl((tt - d / 2 - 0.5) / 0.3));
  return <Cam tt={tt} d={d} z={0.06} fy={640}>
    <Fondo id="ld_e21" tt={tt} b={10} br={0.45} />
    <Prop id="buick_rear" x={960} y={1060 + sink} w={1400} />
    {a.on && <Prop id="suitcase2" x={780} y={600 + a.dy + sink} w={420} sq={a.sq} r={-6} />}
    {b.on && <Prop id="suitcase2" x={1160} y={600 + b.dy + sink} w={380} sq={b.sq} r={8} flip />}
    {tt > d / 2 + 0.45 && <Dust tt={tt} at={d / 2 + 0.45} x={1160} y={600} w={400} />}
  </Cam>;
}} />;

// seis tablas de nogal negro: caen una sobre otra formando la pila, con la veta como humo; polvo y rebote en cada una
const HWalnutStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), seg = (d - 1.5) / 6;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="ld_e25" tt={tt} b={10} br={0.45} />
    <Mesa y0={900} tone="#5a3e26" />
    {Array.from({ length: 6 }, (_, k) => { const at = 0.3 + k * seg, L = land(tt, at, 500, 10, 0.35); return L.on ? <Prop key={k} id="walnut_board" x={960 + (rnd(k) - 0.5) * 60} y={980 - k * 62 + L.dy} w={1300} r={(rnd(k + 2) - 0.5) * 3} sq={L.sq} /> : null; })}
  </Cam>;
}} />;

// sueños nuevos y brillantes: una casita de pájaros, una cuna y un estante entran relucientes (destello) mientras la sábana gris queda atrás
const HShinyNew: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), it = [0.4, d * 0.33, d * 0.6];
  const Bird = ({ s }: { s: number }) => <div style={{ position: "relative", width: 300, height: 380, transform: `scale(${s})` }}><div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 140, background: "#b3322a", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} /><div style={{ position: "absolute", left: 30, top: 130, width: 240, height: 240, background: "linear-gradient(#e8c890,#c8a060)" }}><div style={{ margin: "70px auto", width: 80, height: 80, borderRadius: "50%", background: "#2a1a0a" }} /></div></div>;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.4} />
    <div style={{ position: "absolute", left: 1400, top: 560, width: 520, height: 400, background: "linear-gradient(170deg,#c8c4b8,#8a8680)", borderRadius: "40% 40% 0 0", filter: "blur(2px)", opacity: 0.8 }} />
    <Mesa y0={880} tone="#6a4a2e" />
    {it.map((at, k) => { const p = phys(tt, at, 8, 0.4), sh = Math.sin(cl((tt - at - 0.3) / 0.5) * Math.PI); return tt > at ? <div key={k} style={{ position: "absolute", left: 220 + k * 380, top: 500, transform: `translateY(${(1 - p) * -400}px)` }}>
      {k === 0 ? <Bird s={1} /> : k === 1 ? <div style={{ width: 340, height: 300, marginTop: 80, borderRadius: "0 0 170px 170px", background: "linear-gradient(#f0d8a8,#c8a060)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} /> : <div style={{ width: 300, height: 380, background: "repeating-linear-gradient(#c8a060 0 20px,#3a2414 20px 120px)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />}
      <div style={{ position: "absolute", left: 120, top: 40, width: 60, height: 60, background: "radial-gradient(circle,#fff,transparent 60%)", transform: `scale(${3 * sh}) rotate(45deg)`, opacity: sh }} />
    </div> : null; })}
  </Cam>;
}} />;

// lo que quedó a medias: un suéter a medio tejer con las agujas, una carta a medio escribir y una mesa a medio armar, cada uno se ilumina cuando se nombra
const HHalfThings: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), on = [0.4, 1.4, 2.4].map((a) => eio(tt, a, a + 0.5)), pick = eio(tt, d / 2 + 0.5, d / 2 + 1.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e27" tt={tt} b={12} br={0.38} />
    <Mesa y0={820} tone="#5a3e26" />
    <div style={{ position: "absolute", left: 220, top: 420, width: 440, height: 400, opacity: 0.3 + 0.7 * on[0], filter: `saturate(${on[0]})` }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 440, height: 280, background: "repeating-linear-gradient(90deg,#8a2a2a 0 14px,#a83838 14px 28px)", borderRadius: 30, clipPath: "polygon(0 30%,100% 30%,100% 100%,0 100%)" }} />
      <div style={{ position: "absolute", left: 40, top: 40, width: 8, height: 300, background: "#d8d8e0", transform: "rotate(30deg)" }} /><div style={{ position: "absolute", left: 380, top: 40, width: 8, height: 300, background: "#d8d8e0", transform: "rotate(-30deg)" }} /></div>
    <div style={{ position: "absolute", left: 760, top: 380, width: 420, height: 520, background: "#fbf6e8", boxShadow: "8px 12px 18px rgba(0,0,0,.35)", opacity: 0.3 + 0.7 * on[1] }}><div style={{ padding: 30, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#22314f", lineHeight: 1.4 }}>Dear Earl,<br />I've been meaning<br />to tell you —</div></div>
    <Prop id="walnut_table" x={1520} y={900} w={560} o={0.3 + 0.7 * on[2]} />
    <Glow x={[440, 970, 1520][Math.round(pick * 2)]} y={600} r={300} o={pick > 0 ? 0.8 : 0} />
  </Cam>;
}} />;

// sacar la sábana: la sábana sale volando en una tormenta de polvo dorado y deja ver la mesa de nogal
const HSheetPull: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), pull = eio(tt, 0.6, 1.8), dust = cl((tt - 0.8) / 3);
  return <Cam tt={tt} d={d} z={0.08}>
    <Fondo id="ld_e26" tt={tt} b={10} br={0.42} />
    <Prop id="walnut_table" x={960} y={1000} w={1200} style={{ filter: `brightness(${0.6 + 0.4 * pull})` }} />
    <Prop id="drape_cloth" x={960 + 1400 * pull} y={1000 - 500 * pull} w={1300} r={50 * pull} o={1 - pull * 0.5} />
    <Glow x={960} y={500} r={600} o={pull * 0.6} />
    {pull > 0 && Array.from({ length: 70 }, (_, k) => { const q = rnd(k), x = 400 + 1200 * q + 400 * dust * (rnd(k + 2) - 0.3), y = 900 - 600 * dust * rnd(k + 5) + 60 * Math.sin(tt + k); return <div key={k} style={{ position: "absolute", left: x, top: y, width: 6, height: 6, borderRadius: "50%", background: "#ffe6b0", opacity: 0.8 * (1 - dust * 0.6) }} />; })}
  </Cam>;
}} />;

// la bisnieta le pasa las prensas: la prensa de barra se ajusta (la manija gira) y la junta de las tablas se cierra con una gota de cola
const HClampSqueeze: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sq = eio(tt, 0.6, d / 2), gap = 50 * (1 - sq), glue = cl((tt - d / 2) / 0.8);
  return <Cam tt={tt} d={d} z={0.07} fy={620}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.42} />
    <div style={{ position: "absolute", left: 300, top: 520, width: 640 - gap / 2, height: 180, background: "repeating-linear-gradient(90deg,#3a2010 0 6px,#5a3018 6px 40px)", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 960 + gap / 2, top: 520, width: 640, height: 180, background: "repeating-linear-gradient(90deg,#4a2814 0 8px,#5a3018 8px 50px)", boxShadow: "0 16px 24px rgba(0,0,0,.5)" }} />
    {glue > 0 && <div style={{ position: "absolute", left: 950, top: 520 - 30 * glue, width: 22, height: 30 * glue + 10, borderRadius: "50% 50% 40% 40%", background: "rgba(250,240,200,.95)", boxShadow: "0 0 4px rgba(0,0,0,.3)" }} />}
    <Prop id="bar_clamp" x={960} y={820} w={1500 - 50 * sq} r={0} />
    <div style={{ position: "absolute", left: 1640, top: 590, width: 120, height: 40, borderRadius: 20, background: "linear-gradient(#c82a2a,#7a1010)", transform: `rotate(${sq * 720}deg)` }} />
  </Cam>;
}} />;

// los chicos derraman leche: el vaso se vuelca sobre la mesa de nogal y la leche se expande en un charco brillante con gotas
const HMilkSpill: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tip = eio(tt, 0.5, 1.1), pool = eio(tt, 1.0, d / 2 + 1);
  return <Cam tt={tt} d={d} z={0.07} fy={720}>
    <Fondo id="ld_e27" tt={tt} b={10} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 380, background: "repeating-linear-gradient(90deg,#3a2010 0 7px,#5a3018 7px 60px,#2a160a 60px 66px,#4a2814 66px 120px)", boxShadow: "inset 0 30px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 1000 - 80, top: 820 - 40, width: 160 + 900 * pool, height: 80 + 160 * pool, borderRadius: "50% 40% 60% 45%", background: "radial-gradient(ellipse at 30% 30%,#ffffff,#f2f0ea 60%,#d8d4cc)", boxShadow: "inset 0 -6px 10px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.2)", opacity: cl(pool * 4) }} />
    <Prop id="milk_glass" x={900 + 80 * tip} y={860} w={280} r={95 * tip} />
    {tip > 0.8 && tt < 1.8 && Array.from({ length: 10 }, (_, k) => { const q = (tt - 1.0) / 0.8; return <div key={k} style={{ position: "absolute", left: 1040 + 200 * q * rnd(k), top: 800 - 100 * Math.sin(q * Math.PI) * rnd(k + 2), width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />; })}
  </Cam>;
}} />;

// en el cajoncito de la mesa: el cajón se abre, el folleto de Cannon Beach entra planeando y el cajón se cierra suave
const HBrochureDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.3, 1.0) * (1 - eio(tt, d / 2 + 0.8, d / 2 + 1.6)), fl = eio(tt, 1.0, d / 2 + 0.6);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="ld_e27" tt={tt} b={12} br={0.42} />
    <div style={{ position: "absolute", left: 200, top: 360, width: 1520, height: 300, background: "repeating-linear-gradient(90deg,#3a2010 0 7px,#5a3018 7px 60px)", boxShadow: "0 30px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 660, top: 660, width: 600, height: 120 + 220 * op, background: "linear-gradient(#2a160a,#4a2814)", boxShadow: "inset 0 30px 30px rgba(0,0,0,.6)" }} />
    {fl < 1 || op > 0.2 ? <div style={{ position: "absolute", left: 700 + 100 * fl, top: 120 + 600 * fl, width: 360 - 80 * fl, height: 240 - 60 * fl, transform: `rotate(${-30 + 30 * fl + 10 * Math.sin(fl * 8)}deg)`, background: "linear-gradient(135deg,#7fb6d8,#e8d8a8)", boxShadow: "6px 10px 14px rgba(0,0,0,.4)", opacity: op > 0.1 ? 1 : 0, zIndex: 2 }}><div style={{ position: "absolute", left: 20, bottom: 20, fontFamily: SER, fontWeight: 700, fontSize: 36 - 6 * fl, color: "#fff", textShadow: "0 2px 4px #0007" }}>Cannon Beach</div></div> : null}
    <div style={{ position: "absolute", left: 640, top: 660 + 220 * op, width: 640, height: 140, background: "repeating-linear-gradient(90deg,#4a2814 0 7px,#6a3a1c 7px 60px)", boxShadow: "0 16px 20px rgba(0,0,0,.5)", zIndex: 3 }}><div style={{ margin: "50px auto", width: 100, height: 30, borderRadius: 15, background: "radial-gradient(circle at 40% 30%,#f2d27a,#8a6420)" }} /></div>
  </Cam>;
}} />;

// la rutina del lunes: seis escalones de madera se arman de a uno con cada «Step», y una lucecita sube por ellos
const HMondayStairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.3, bt(h, 0, 1.6), bt(h, 1, 2.9), bt(h, 2, 4.2), bt(h, 3, 5.5), bt(h, 4, 6.8)].map((x) => x - 0 * h.at), top = at.filter((a) => tt > a).length;
  return <Cam tt={tt} d={d} z={0.05} fx={600 + top * 140} fy={800 - top * 90}>
    <Fondo id="ld_e10" tt={tt} b={14} br={0.4} />
    {at.map((a, k) => { const p = phys(tt, a, 8, 0.4); return tt > a ? <div key={k} style={{ position: "absolute", left: 320 + k * 220, top: 900 - (k + 1) * 110 - 300 * (1 - p), width: 260, height: (k + 1) * 110, background: "linear-gradient(#c8955a,#8a5e30)", boxShadow: "inset 0 10px 0 #e0b078, 10px 16px 24px rgba(0,0,0,.4)", display: "flex", justifyContent: "center", paddingTop: 10, boxSizing: "border-box", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#3a2410" }}>{k + 1}</div> : null; })}
    {top > 0 && <Glow x={450 + (top - 1) * 220} y={900 - top * 110 - 40} r={160} o={1} />}
  </Cam>;
}} />;

// la abuela Moses empezó a pintar a los 78: un pincel recorre el lienzo en el caballete y la granja aparece bajo cada pasada
const HGrandmaMoses: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d / 2 + 0.8), bx = 560 + 800 * ((p * 4) % 1), by = 300 + 440 * p;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e18" tt={tt} b={14} br={0.38} />
    <div style={{ position: "absolute", left: 940, top: 900, width: 40, height: 200, background: "#6a4a2a" }} />
    <div style={{ position: "absolute", left: 520, top: 240, width: 880, height: 600, background: "#f4efe2", border: "18px solid #8a6a3a", boxShadow: "14px 20px 30px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <Img src={PH("ld_e28")} style={{ width: 880, height: 600, objectFit: "cover", filter: "saturate(1.4) contrast(1.1)", clipPath: `inset(0 0 ${100 - 100 * p}% 0)` }} />
    </div>
    <div style={{ position: "absolute", left: 1460, top: 700, fontFamily: SER, fontWeight: 900, fontSize: 200, color: "#f3e6c6", textShadow: "0 8px 20px rgba(0,0,0,.6)", opacity: eio(tt, d / 2, d / 2 + 0.6), transform: `scale(${phys(tt, d / 2, 7, 0.4)})` }}>78</div>
    <div style={{ position: "absolute", left: bx, top: by - 260, width: 18, height: 300, background: "linear-gradient(#c8a060,#6a4a2a)", transform: "rotate(30deg)", borderRadius: 8 }}><div style={{ position: "absolute", bottom: -40, left: -6, width: 30, height: 50, borderRadius: "40% 40% 50% 50%", background: "#3a6a3a" }} /></div>
  </Cam>;
}} />;

// Olaf aprendió a leer a los 60: el quinqué se enciende y las páginas del libro escolar pasan solas en su luz
const HLampReading: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lit = eio(tt, 0.3, 1.0), fl = 0.9 + 0.1 * Math.sin(tt * 13);
  return <Cam tt={tt} d={d} z={0.07} fy={640}>
    <Fondo id="ld_e32" tt={tt} b={12} br={0.15 + 0.25 * lit} />
    <Glow x={620} y={500} r={700} o={lit * fl} />
    <Mesa y0={820} tone="#5a3e26" />
    <Prop id="oil_lamp" x={560} y={900} w={360} style={{ filter: `brightness(${0.6 + 0.6 * lit}) drop-shadow(0 0 ${30 * lit}px rgba(255,200,120,.8))` }} />
    <Prop id="school_book" x={1180} y={940} w={760} />
    {Array.from({ length: 5 }, (_, k) => { const at = 1.4 + k * (d - 2.4) / 5, f = cl((tt - at) / 0.8); return f > 0 && f < 1 ? <div key={k} style={{ position: "absolute", left: 1180, top: 700, width: 340, height: 220, background: "linear-gradient(90deg,#f4ecd8,#e4d8bc)", transformOrigin: "0 100%", transform: `perspective(1200px) rotateY(${-180 * f}deg) skewY(${-6 * Math.sin(f * Math.PI)}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.25)" }} /> : null; })}
  </Cam>;
}} />;

// el bote que hacía agua: el velerito flota en el lago, tres chorritos le entran por el casco y se hunde un poco; a la mitad la risa (se mece)
const HLeakyBoat: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sink = 60 * eio(tt, 0.8, d - 1), rk = 4 * Math.sin(tt * 1.6) + (tt > d / 2 ? swing(tt, d / 2, 8, 4, 0.6) : 0);
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="ld_e29" tt={tt} b={4} br={0.6} />
    {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 200 + tt * 40) % 2100 - 100, top: 800 + k * 26, width: 160, height: 4, borderRadius: 2, background: "rgba(255,255,255,.25)" }} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 790 + sink * 0.4, overflow: "hidden" }}><Prop id="small_sailboat" x={960} y={840 + sink} w={760} r={rk} /></div>
    {[0, 1, 2].map((k) => { const ph = (tt * 3 + k * 0.3) % 1; return tt > 0.8 + k * 0.6 ? <div key={k} style={{ position: "absolute", left: 800 + k * 150, top: 760 - 60 * Math.sin(ph * Math.PI), width: 10, height: 10, borderRadius: "50%", background: "rgba(220,240,250,.9)" }} /> : null; })}
  </Cam>;
}} />;

// tres cosas chicas: una tabla, un folleto, un teléfono caen de a una en fila sobre la mesa con cada palabra
const HThreeSmall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.3, bt(h, 0, 2.2), bt(h, 1, 4.0)];
  return <Cam tt={tt} d={d} z={0.05} fy={700}>
    <Fondo id="ld_e10" tt={tt} b={12} br={0.45} />
    <Formica y0={800} />
    {at.map((a, k) => { const L = land(tt, a, 600, 9, 0.35); return L.on ? <React.Fragment key={k}>
      {k === 0 && <Prop id="walnut_board" x={460} y={920 + L.dy} w={520} sq={L.sq} r={-6} />}
      {k === 1 && <div style={{ position: "absolute", left: 830, top: 620 + L.dy, width: 280, height: 360, background: "linear-gradient(135deg,#7fb6d8,#e8d8a8)", boxShadow: "8px 12px 18px rgba(0,0,0,.4)", transform: `rotate(4deg) scaleY(${1 - L.sq})` }} />}
      {k === 2 && <Prop id="rotary_phone" x={1480} y={940 + L.dy} w={460} sq={L.sq} />}
      <Dust tt={tt} at={a + 0.45} x={[460, 970, 1480][k]} y={920} w={300} />
    </React.Fragment> : null; })}
  </Cam>;
}} />;

// el Buick se habría roto en Nebraska: capot abierto, vapor saliendo del radiador bajo la lluvia
const HBuickSteam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = eio(tt, 0.5, 1.5), big = tt > d / 2 ? 1.6 : 1;
  return <Cam tt={tt} d={d} z={0.05} fy={600}>
    <Fondo id="ld_e30" tt={tt} b={4} br={0.45} />
    {Array.from({ length: 80 }, (_, k) => { const x = (k * 97) % 1920, y = ((tt * 1300 + k * 230) % 1200) - 100; return <div key={k} style={{ position: "absolute", left: x, top: y, width: 2, height: 38, background: "rgba(200,215,230,.5)", transform: "rotate(8deg)" }} />; })}
    <Prop id="buick_front" x={960} y={1040} w={1300} />
    {Array.from({ length: 16 }, (_, k) => { const q = (tt * 0.5 * big + k / 16) % 1; return <div key={"v" + k} style={{ position: "absolute", left: 960 - 100 + 200 * rnd(k) + 150 * q * Math.sin(k), top: 560 - 500 * q, width: 120 + 260 * q, height: 120 + 260 * q, borderRadius: "50%", background: "radial-gradient(circle,rgba(235,235,240,.55),transparent 65%)", opacity: st * (1 - q), filter: "blur(6px)" }} />; })}
  </Cam>;
}} />;

// los zapatos en la mano de June: cuelgan de dos dedos y se balancean; a la mitad una ola barre la arena y les moja las puntas
const HShoesWave: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sw = 10 * Math.sin(tt * 2.2), wave = Math.sin(cl((tt - d / 2) / 2.2) * Math.PI);
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="ld_e31" tt={tt} b={3} br={0.65} />
    <svg width={1920} height={400} style={{ position: "absolute", left: 0, top: 1080 - 320 * wave - 40 }}><path d={`M0,40 ${Array.from({ length: 20 }, (_, i) => `Q${i * 100 + 50},${10 + 20 * Math.sin(i + tt * 3)} ${i * 100 + 100},40`).join(" ")} L1920,400 L0,400 Z`} fill="rgba(235,245,248,.85)" /></svg>
    <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: 300, background: "transparent" }} />
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${sw}deg)`, transformOrigin: "960px 120px" }}>
      <div style={{ position: "absolute", left: 900, top: 0, width: 4, height: 420, background: "#3a2a1a", transform: "rotate(-4deg)" }} /><div style={{ position: "absolute", left: 1020, top: 0, width: 4, height: 420, background: "#3a2a1a", transform: "rotate(4deg)" }} />
      <Prop id="flat_shoes" x={960} y={720} w={460} r={-sw * 0.6} />
    </div>
  </Cam>;
}} />;

// las seis lecciones: el tablero de corcho recibe una tarjeta por lección, clavada con chinche (rebote y sombra)
const HCorkPins: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = ["date it", "do it badly", "no right time", "tell one", "finish old", "Mondays"], at = [0.3, ...[0, 1, 2, 3, 4].map((i) => bt(h, i, 1.6 + i * 1.6))];
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="ld_e33" tt={tt} b={2} br={0.6} />
    {L.map((l, k) => { const p = phys(tt, at[k], 9, 0.35), x = 280 + (k % 3) * 480, y = 200 + Math.floor(k / 3) * 380; return tt > at[k] ? <React.Fragment key={k}>
      <div style={{ position: "absolute", left: x, top: y, width: 420, height: 300, background: "#fbf8ee", boxShadow: `${10 * p}px ${16 * p}px 20px rgba(0,0,0,.4)`, transform: `scale(${1.6 - 0.6 * p}) rotate(${(rnd(k) - 0.5) * 8}deg)`, opacity: cl(p * 2), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: "#22314f", textAlign: "center" }}>{l}</div>
      <Prop id="push_pin" x={x + 210} y={y + 70} w={90} o={cl((tt - at[k] - 0.3) / 0.2)} />
    </React.Fragment> : null; })}
  </Cam>;
}} />;

export const HCD2: Record<string, C> = {
  crookedRock: HCrookedRock, tenChairs: HTenChairs, caneSteps: HCaneSteps, starfishBrochure: HStarfishBrochure, saltBowl: HSaltBowl, reasonNotes: HReasonNotes,
  umbrellaRain: HUmbrellaRain, barberPole: HBarberPole, routeLine: HRouteLine, tellOne: HTellOne, twoSuitcases: HTwoSuitcases, walnutStack: HWalnutStack,
  shinyNew: HShinyNew, halfThings: HHalfThings, sheetPull: HSheetPull, clampSqueeze: HClampSqueeze, milkSpill: HMilkSpill, brochureDrawer: HBrochureDrawer,
  mondayStairs: HMondayStairs, grandmaMoses: HGrandmaMoses, lampReading: HLampReading, leakyBoat: HLeakyBoat, threeSmall: HThreeSmall, buickSteam: HBuickSteam,
  shoesWave: HShoesWave, corkPins: HCorkPins,
};
