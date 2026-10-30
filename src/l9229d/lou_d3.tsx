// l9229d «Dreams» · vuelta 2: los 15 que sacaron ≤5 rehechos con props reales (cajón, escalones, mapa, autito, cuna, engranajes de bronce), física y sombra de contacto
import React from "react";
import { cl, eio } from "./hkit";
import { S, D, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, land, swing } from "./pk";
import { Fondo } from "./lk";
import { staticFile, Img } from "remotion";

const PH = (id: string) => staticFile("img/l9229d/" + id + ".jpg");
// sombra de contacto elíptica bajo un objeto apoyado
const Sh: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.05, width: w, height: w * 0.1, borderRadius: "50%", background: `rgba(0,0,0,${o})`, filter: "blur(10px)" }} />;
// foto de papel con borde blanco (folleto / postal), cae y rebota
const Card: React.FC<{ id: string; x: number; y: number; w: number; r?: number; dy?: number; s?: number }> = ({ id, x, y, w, r = 0, dy = 0, s = 1 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.66 + dy, width: w, height: w * 0.66, padding: w * 0.035, background: "#f4efe2", boxShadow: "0 18px 30px rgba(0,0,0,.55)", transform: `rotate(${r}deg) scale(${s})` }}>
  <Img src={PH(id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
</div>;

// «June fell on the back steps»: el bastón apoyado en el escalón se resbala, cae al suelo de punta y rebota; polvo en el golpe
const HCaneSteps: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a0 = 0.9, p = eio(tt, a0, a0 + 0.55), r = -18 + (-70) * p + swing(tt, a0 + 0.55, 8, 9, 2.4), x = 1220 - 300 * p, y = 640 + 330 * p;
  return <Cam tt={tt} d={d} z={0.06} fx={1000} fy={800}>
    <Fondo id="ld_e19" tt={tt} b={9} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 980, width: 1920, height: 100, background: "linear-gradient(#5a4632,#2e2216)" }} />
    <Sh x={1140} y={985} w={1180} o={0.6} />
    <Prop id="porch_steps" x={1140} y={990} w={1180} />
    <Sh x={x} y={y + 6} w={220 + 160 * p} o={0.35 + 0.2 * p} />
    <Prop id="cane" x={x} y={y} w={150} r={r} />
    <Dust tt={tt} at={a0 + 0.55} x={x - 120} y={980} w={260} />
  </Cam>;
}} />;

// «you close the drawer a little faster»: un cajón de madera real con la postal de la costa adentro se cierra de golpe (se aleja hacia el mueble); el mueble tiembla
const HDrawerShut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = bt(h, 0, Math.min(1.6, d * 0.35)), p = eio(tt, at, at + 0.32), hit = tt > at + 0.32 ? Math.exp(-6 * (tt - at - 0.32)) * Math.sin(40 * (tt - at - 0.32)) : 0;
  const s = 1.05 - 0.2 * p, y = 1010 - 290 * p;
  return <Cam tt={tt} d={d} z={0.05} fy={600}>
    <Fondo id="ld_e01" tt={tt} b={10} br={0.42} />
    <div style={{ position: "absolute", left: 360, top: 330 + hit * 4, width: 1200, height: 760, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 90px),linear-gradient(#7a5434,#4a2e18)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", borderTop: "14px solid #8c6440" }}>
      <div style={{ position: "absolute", left: 140, top: 90, width: 920, height: 300, background: "#140c06", boxShadow: "inset 0 20px 40px #000" }} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${hit * 4}px)`, opacity: 1 - cl((tt - at - 0.26) / 0.08) }}>
      <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "relative", width: 1000, height: 640 }}>
          <Card id="ld_e05" x={470} y={430} w={380} r={-7} />
          <Prop id="dresser_drawer" x={500} y={640} w={1000} />
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 500, top: 420 + hit * 4, width: 920, height: 300, opacity: cl((tt - at - 0.24) / 0.08), background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 2px,transparent 2px 80px),linear-gradient(#8a6040,#5a3820)", boxShadow: "inset 0 -10px 20px rgba(0,0,0,.4), 0 4px 0 #2a1808" }}>
      <div style={{ position: "absolute", left: 430, top: 120, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#f0d080,#8a6420)", boxShadow: "0 6px 10px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 600, top: -34, width: 150, height: 60, background: "#f4efe2", transform: "rotate(-6deg)", boxShadow: "0 4px 8px rgba(0,0,0,.4)", opacity: cl((tt - at - 0.3) / 0.1) }} />
    </div>
  </Cam>;
}} />;

// «a piece of tape that says Route 66»: el escudo de ruta cae sobre la tabla del taller, rebota, y una cinta de papel lo pega de un golpe
const HTapeRoute: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.4, 700), tp = eio(tt, 1.3, 1.6);
  return <Cam tt={tt} d={d} z={0.07} fy={520}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.45} />
    <Sh x={960} y={940} w={1400} o={0.55} />
    <Prop id="wood_board" x={960} y={940} w={1400} />
    {L.on && <div style={{ position: "absolute", left: 0, top: L.dy, width: 1920, height: 1080 }}>
      <Sh x={980} y={850} w={520} o={0.5 * L.k} />
      <Prop id="highway_shield" x={960} y={860} w={560} r={-4} sq={L.sq} />
      <div style={{ position: "absolute", left: 960, top: 620, transform: "translate(-50%,-50%) rotate(-4deg)", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 210, color: "#1a1a1a", letterSpacing: -6 }}>66</div>
    </div>}
    <div style={{ position: "absolute", left: 740, top: 300, width: 440 * tp, height: 70, background: "rgba(232,214,170,.88)", transform: "rotate(-9deg)", transformOrigin: "0 50%", boxShadow: "0 4px 8px rgba(0,0,0,.3)", borderLeft: "3px dashed rgba(180,160,120,.6)" }} />
    <Dust tt={tt} at={0.55} x={960} y={860} w={420} />
  </Cam>;
}} />;

// «A bookshelf, a cradle for a grandchild»: estante, cuna y casita de pájaros de madera nueva caen de a uno sobre el banco; un brillo de barniz los recorre
const HShinyNew: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = [0.3, bt(h, 0, 1.1), bt(h, 1, 1.9)], gx = -300 + 2600 * cl((tt - (a[2] + 0.7)) / 1.4);
  const it = [{ id: "bookshelf", x: 480, w: 520 }, { id: "wood_cradle", x: 1000, w: 560 }, { id: "birdhouse", x: 1480, w: 340 }];
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.5} />
    <Mesa y0={800} tone="#a77a4a" />
    {it.map((o, k) => { const L = land(tt, a[k], 650); return L.on ? <React.Fragment key={k}><Sh x={o.x} y={960} w={o.w * 0.9} o={0.5 * L.k} /><Prop id={o.id} x={o.x} y={960 + L.dy} w={o.w} sq={L.sq} /></React.Fragment> : null; })}
    <div style={{ position: "absolute", left: gx, top: 300, width: 220, height: 700, background: "linear-gradient(90deg,transparent,rgba(255,240,210,.35),transparent)", transform: "skewX(-18deg)", mixBlendMode: "screen" }} />
  </Cam>;
}} />;

// «in the little drawer at the end of the table»: de la punta de la mesa de nogal sale un cajón, y del cajón salta el folleto de la costa con rebote
const HBrochureDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.5, 1.2), L = land(tt, 1.4, -1, 8, 0.4), up = tt < 1.4 ? 0 : Math.min(1, (tt - 1.4) / 0.5);
  return <Cam tt={tt} d={d} z={0.07} fx={1300} fy={640}>
    <Fondo id="ld_e10" tt={tt} b={12} br={0.45} />
    <Sh x={860} y={1000} w={1300} o={0.55} />
    <Prop id="walnut_table" x={860} y={1010} w={1300} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${260 * op}px,${60 * op}px)` }}>
      <Prop id="dresser_drawer" x={1330} y={800} w={420 + 140 * op} />
    </div>
    {tt > 1.4 && <Card id="ld_e05" x={1420} y={760 - 300 * eio(tt, 1.4, 1.9) + 18 * swing(tt, 1.9, 1, 7, 2)} w={460} r={-10 + 6 * up} />}
  </Cam>;
}} />;

// «a machine shop with my brother Earl»: tres engranajes de bronce reales engranan y giran en sentidos opuestos, el grande arrastra a los chicos
const HGearsMesh: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), sp = 40 * eio(tt, 0.3, 1.3) * (tt - 0.3 > 0 ? 1 : 0), A = sp * Math.max(0, tt - 0.3);
  const g = [{ cx: 720, cy: 560, R: 260, dir: 1 }, { cx: 720 + 260 + 170 - 34, cy: 560, R: 170, dir: -1 }, { cx: 1116 + 105, cy: 560 - 230, R: 120, dir: 1 }];
  return <Cam tt={tt} d={d} z={0.06} fx={880}>
    <Fondo id="ld_e03" tt={tt} b={10} br={0.42} />
    {g.map((o, k) => <React.Fragment key={k}><Prop id="brass_gear" x={o.cx} y={o.cy + o.R * 1.04} w={o.R * 2.08} sh={0} r={o.dir * A * (260 / o.R) + k * 11} style={{ transformOrigin: "50% 50%" }} /></React.Fragment>)}
    <Glow x={720} y={420} r={300} o={0.5} />
  </Cam>;
}} />;

// «just one word: boat, Paris, piano»: de un cajón de madera saltan el velero, la torre y el piano, y aterrizan sobre la mesa con rebote
const HWordsDrawer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = [bt(h, 0, 0.6), bt(h, 1, 1.3), bt(h, 2, 2.0)];
  const it = [{ id: "toy_sailboat", x: 480, w: 330 }, { id: "paris_tower", x: 1440, w: 230 }, { id: "toy_piano", x: 1640, w: 330 }];
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e04" tt={tt} b={12} br={0.45} />
    <Mesa y0={760} tone="#9a6c3e" />
    <Sh x={960} y={1000} w={760} o={0.55} />
    <Prop id="dresser_drawer" x={960} y={1010} w={760} />
    {it.map((o, k) => { if (tt < a[k]) return null; const q = cl((tt - a[k]) / 0.6), x = 960 + (o.x - 960) * q, y = 860 + (900 - 860) * q - 420 * Math.sin(q * Math.PI), L = land(tt, a[k] + 0.6, 0); return <React.Fragment key={k}>
      {q >= 1 && <Sh x={o.x} y={905} w={o.w * 0.8} o={0.5} />}
      <Prop id={o.id} x={x} y={y + (q >= 1 ? L.dy : 0)} w={o.w} r={(1 - q) * 30 * (k % 2 ? -1 : 1)} sq={q >= 1 ? L.sq : 0} />
      
    </React.Fragment>; })}
  </Cam>;
}} />;

// «10 minutes a day»: el reloj de cocina grande se da cuerda de un giro y tiembla sobre la mesa al sonar; «10» enorme detrás
const HEggTimer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), w = eio(tt, 0.5, 1.0), back = cl((tt - 1.0) / (d - 1.6)), r = -160 * w + 150 * back, ring = tt > d - 0.9 ? 3 * Math.sin(tt * 60) : 0;
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="ld_e10" tt={tt} b={12} br={0.5} />
    <Mesa y0={760} tone="#c8a050" />
    <div style={{ position: "absolute", left: 1380, top: 420, transform: "translate(-50%,-50%)", fontFamily: SER, fontWeight: 900, fontSize: 380, color: "rgba(255,240,210,.9)", textShadow: "0 18px 40px rgba(0,0,0,.6)", opacity: cl((tt - 0.3) / 0.5) }}>10</div>
    <Sh x={760} y={960} w={560} o={0.55} />
    <Prop id="kitchen_timer" x={760 + ring} y={970} w={600} r={r * 0.15 + ring} />
    {tt > d - 0.9 && <Glow x={760} y={700} r={320} o={0.6} />}
  </Cam>;
}} />;

// «by the tenth one, it sat flat»: diez mecedoras en perspectiva, de la lejana torcida que cabecea a la cercana que queda firme e iluminada
const HTenChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d * 0.55) / 10;
  return <Cam tt={tt} d={d} z={0.06} fx={1480} fy={820}>
    <Fondo id="ld_e14" tt={tt} b={12} br={0.42} />
    <Mesa y0={560} tone="#7a5636" />
    {Array.from({ length: 10 }, (_, k) => { const q = k / 9, x = 260 + 1300 * Math.pow(q, 1.1), y = 640 + 400 * q * q, w = 200 + 420 * q * q, at = 0.3 + k * step, L = land(tt, at, 300, 10, 0.4), amp = 16 * (1 - q); return L.on ? <React.Fragment key={k}>
      <Sh x={x} y={y + 4} w={w * 0.85} o={0.45} />
      <Prop id="rocking_chair" x={x} y={y + L.dy} w={w} r={amp * Math.sin(tt * 2.8 + k)} sq={L.sq} />
    </React.Fragment> : null; })}
    {tt > 0.3 + 9 * step && <Glow x={1560} y={760} r={320} o={0.85 * cl((tt - 0.3 - 9 * step) / 0.5)} />}
  </Cam>;
}} />;

// «I'll take you»: mapa de carreteras de papel sobre la mesa; la ruta se pinta en rojo y un autito de lata la recorre hasta el desierto
const HRouteLine: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.6, d - 0.8);
  const P = (u: number) => ({ x: 1480 - 1000 * u, y: 560 + 70 * Math.sin(u * Math.PI * 1.6) + 60 * u });
  const pts = Array.from({ length: 41 }, (_, i) => P(i / 40)), path = pts.map((q, i) => `${i ? "L" : "M"}${q.x},${q.y}`).join(" "), c = P(p), c2 = P(Math.min(1, p + 0.02));
  return <Cam tt={tt} d={d} z={0.08} fx={c.x} fy={c.y}>
    <Fondo id="ld_e10" tt={tt} b={14} br={0.4} />
    <Mesa y0={300} tone="#8a5e34" />
    <Sh x={960} y={960} w={1600} o={0.5} />
    <Prop id="road_map" x={960} y={960} w={1600} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={path} fill="none" stroke="#c0221a" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.9} />
      <circle cx={P(0).x} cy={P(0).y} r={18} fill="#c0221a" />
    </svg>
    <Prop id="toy_car" x={c.x} y={c.y + 60} w={270} r={Math.atan2(c2.y - c.y, c2.x - c.x) * 57 + 180} flip />
    {p > 0.97 && <Card id="ld_e24" x={860} y={420} w={320} r={6} s={eio(tt, d - 0.8, d - 0.4)} />}
  </Cam>;
}} />;

// «six boards of black walnut»: seis tablas de nogal con veta caen una sobre otra con rebote y polvo; luz rasante que muestra la veta
const HWalnutStack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = Math.min(0.42, (d - 1.2) / 6);
  return <Cam tt={tt} d={d} z={0.07} fy={820}>
    <Fondo id="ld_e25" tt={tt} b={10} br={0.6} />
    <Mesa y0={760} tone="#b28654" />
    <Sh x={960} y={980} w={1300} o={0.55} />
    {Array.from({ length: 6 }, (_, k) => { const at = 0.3 + k * step, L = land(tt, at, 600, 10, 0.38); return L.on ? <React.Fragment key={k}>
      <Prop id="wood_board" x={960 + (k % 2 ? 18 : -14)} y={985 - k * 44 + L.dy} w={1150} r={(k % 3 - 1) * 0.8} sq={L.sq} sh={k ? 0 : 1} style={{ filter: "sepia(1) saturate(1.25) brightness(.5) contrast(1.3) drop-shadow(0 8px 6px rgba(0,0,0,.5))" }} />
    </React.Fragment> : null; })}
    <Glow x={420} y={760} r={420} o={0.55} />
  </Cam>;
}} />;

// «the half-knit sweater, the half-written letter»: el suéter a medio tejer cae con sus agujas y el ovillo rueda; al lado aterriza la carta sin cerrar
const HHalfThings: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.25, 620), a2 = bt(h, 0, 1.4), L2 = land(tt, a2, 620);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e21" tt={tt} b={12} br={0.55} />
    <Mesa y0={760} tone="#a07446" />
    {L.on && <><Sh x={760} y={960} w={720} o={0.5 * L.k} /><Prop id="knitting_half" x={760} y={965 + L.dy} w={760} sq={L.sq} /></>}
    {L2.on && <><Sh x={1430} y={950} w={460} o={0.5 * L2.k} /><Prop id="letter_envelope" x={1430} y={955 + L2.dy} w={480} r={8} sq={L2.sq} /></>}
  </Cam>;
}} />;

// «Six steps. Step one…»: una escalera de madera 3D de seis peldaños; en cada paso la lámpara de kerosén salta un peldaño y lo enciende
const HMondayStairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.4, bt(h, 0, 3), bt(h, 1, 6), bt(h, 2, 9), bt(h, 3, 12), bt(h, 4, 15)];
  const sx = (i: number) => 420 + i * 200, sy = (i: number) => 1000 - i * 86;
  let k = 0; for (let i = 0; i < 6; i++) if (tt >= at[i]) k = i;
  const q = cl((tt - at[k]) / 0.45), from = k === 0 ? { x: 220, y: 1000 } : { x: sx(k - 1) + 105, y: sy(k - 1) }, to = { x: sx(k) + 105, y: sy(k) };
  const lx = from.x + (to.x - from.x) * q, ly = from.y + (to.y - from.y) * q - 120 * Math.sin(q * Math.PI);
  return <Cam tt={tt} d={d} z={0.08} fx={lx} fy={ly}>
    <Fondo id="ld_e21" tt={tt} b={12} br={0.55} />
    {Array.from({ length: 6 }, (_, i) => { const lit = tt >= at[i] + 0.45 ? 1 : 0; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: sx(i), top: sy(i), width: 1920 - sx(i), height: 1080 - sy(i), background: `repeating-linear-gradient(90deg,rgba(0,0,0,.10) 0 2px,transparent 2px 70px),linear-gradient(${lit ? "#a8784a" : "#6e4e30"},#3a2414)`, boxShadow: "-14px 0 24px rgba(0,0,0,.45)", borderTop: `10px solid ${lit ? "#f0c890" : "#a88058"}` }} />
      <div style={{ position: "absolute", left: sx(i) - 10, top: sy(i) - 26, width: 1940 - sx(i), height: 30, background: lit ? "linear-gradient(#e2b47a,#a8784a)" : "linear-gradient(#94704a,#6e4e30)", transform: "perspective(600px) rotateX(55deg)", transformOrigin: "50% 100%" }} />
    </React.Fragment>; })}
    <Sh x={lx} y={ly + 2} w={140} o={0.5} />
    <Prop id="oil_lamp" x={lx} y={ly} w={140} sq={q >= 1 ? land(tt, at[k] + 0.45, 0).sq : 0} />
    <Glow x={lx} y={ly - 150} r={260} o={0.9} />
    <Dust tt={tt} at={at[k] + 0.45} x={to.x} y={to.y} w={160} />
  </Cam>;
}} />;

// «Ten minutes. One board. One brochure. One phone call.»: los tres objetos chicos caen de a uno sobre la mesa, cada uno con su peso y su sombra
const HThreeSmall: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), a = [0.3, bt(h, 0, 1.2), bt(h, 1, 2.4)];
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="ld_e10" tt={tt} b={12} br={0.6} />
    <Mesa y0={740} tone="#b08250" />
    {(() => { const L = land(tt, a[0], 650); return L.on && <><Prop id="kitchen_timer" x={500} y={960 + L.dy} w={300} sq={L.sq} /></>; })()}
    {(() => { const L = land(tt, a[1], 650); return L.on && <><Sh x={1000} y={940} w={420} o={0.45} /><Card id="ld_e05" x={1000} y={940 + L.dy} w={420} r={-6} /></>; })()}
    {(() => { const L = land(tt, a[2], 650); return L.on && <><Sh x={1490} y={955} w={460} o={0.55} /><Prop id="rotary_phone" x={1490} y={960 + L.dy} w={460} sq={L.sq} r={swing(tt, a[2] + 0.4, 3, 18, 3)} /></>; })()}
  </Cam>;
}} />;

// «Give it a date… start on a Monday»: el corcho de la cocina; en cada paso una tarjeta se clava con chinche con UNA palabra grande; la última, MONDAY, se ilumina
const HCorkPins: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.4, bt(h, 0, 3), bt(h, 1, 6), bt(h, 2, 9), bt(h, 3, 12), bt(h, 4, 15)], W = ["DATE", "BADLY", "NOW", "TELL", "FINISH", "MONDAY"];
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="ld_e33" tt={tt} b={12} br={0.4} />
    <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,.08),transparent 60%),repeating-radial-gradient(circle at 20% 40%,#b98a5a 0 2px,#a8784a 2px 5px)", border: "28px solid #6a4426", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    {W.map((w, i) => { if (tt < at[i]) return null; const s = Math.min(1.25, 1.6 - 0.6 * eio(tt, at[i], at[i] + 0.28)), x = 520 + (i % 3) * 440, y = 330 + Math.floor(i / 3) * 360, r = ((i * 7) % 9) - 4, last = i === 5;
      return <div key={i} style={{ position: "absolute", left: x - 180, top: y - 120, width: 360, height: 240, background: last ? "#fff2c4" : "#f6efdc", transform: `rotate(${r}deg) scale(${s})`, boxShadow: `0 ${20 * s}px ${30 * s}px rgba(0,0,0,.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe Print','Bradley Hand',cursive", fontWeight: 700, fontSize: 70, color: last ? "#b0281c" : "#22314f" }}>
        {w}
        <div style={{ position: "absolute", left: 160, top: -18, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ff7a6a,#b01c10)", boxShadow: "0 6px 8px rgba(0,0,0,.5)" }} />
      </div>; })}
    {tt > at[5] + 0.3 && <Glow x={1400} y={690} r={300} o={0.7} />}
  </Cam>;
}} />;

export const HCD3: Record<string, C> = {
  caneSteps: HCaneSteps, drawerShut: HDrawerShut, tapeRoute: HTapeRoute, shinyNew: HShinyNew, brochureDrawer: HBrochureDrawer, gearsMesh: HGearsMesh,
  wordsDrawer: HWordsDrawer, eggTimer: HEggTimer, tenChairs: HTenChairs, routeLine: HRouteLine, walnutStack: HWalnutStack, halfThings: HHalfThings,
  mondayStairs: HMondayStairs, threeSmall: HThreeSmall, corkPins: HCorkPins,
};
