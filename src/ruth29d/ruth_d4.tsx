// ruth29d · 4ª vuelta (29-oct): TODO con objetos FOTORREALES recortados (agnes → rembg, public/img/<slug>/cut) animados por código.
// Regla: un objeto héroe grande y entero, acción física desde el primer segundo, cámara curva, sombra de contacto, palabra grande sólo dentro de la escena.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { Odo, Splash, Sello, Puff } from "./obj";
import { S, D, rnd } from "./ruth_d3";
import { Prop, Drop, Dust, Cam, Mesa, Agua, Rings, Word, Glow, Luz, land, swing, SER } from "./pk";

const bt = (h: H, i: number, d: number) => h.bt?.[i] ?? d;
type C = React.FC<{ t: number; h: H }>;
const SKY = "linear-gradient(#e8a060 0%,#f2d2a2 40%,#7a9a7a 52%,#2a4a42 100%)";
const DUSK = "linear-gradient(#3a2a4a 0%,#c87a5a 38%,#e8b080 50%,#3a5a52 52%,#14261f 100%)";
const STORM = "linear-gradient(#1a222a 0%,#3a4652 55%,#2a3a24 58%,#0e160a 100%)";

// m0 · la línea de trampas: la estaca grande al frente, la jaula sube del agua chorreando con la nutria adentro, la piragua cruza atrás sin cortes
const HTrapLine: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), rise = eio(tt, 1.0, 2.6), bx = -700 + 2900 * (tt / d);
  return <Cam tt={tt} d={d} z={0.06}>
    <Glow x={1460} y={300} r={260} o={0.9} />
    <Prop id="pirogue" x={bx} y={600} w={760} sh={0} />
    <Agua tt={tt} y0={560} />
    <Prop id="pirogue" x={bx} y={600} w={760} sh={0} style={{ transform: "scaleY(-1)", transformOrigin: "50% 100%", opacity: 0.18, filter: "blur(3px)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <Prop id="cage_nutria" x={1150} y={930 - 330 * rise} w={720} r={-4 + 3 * Math.sin(tt * 1.6)} sh={0} />
      <div style={{ position: "absolute", left: 700, top: 900, width: 920, height: 200, background: "linear-gradient(rgba(42,74,66,.0),rgba(30,58,52,.92) 30%)" }} />
      {rise > 0.02 && Array.from({ length: 14 }, (_, k) => { const p = ((tt * 1.3 + k / 14) % 1); return <div key={k} style={{ position: "absolute", left: 870 + (k * 41) % 560, top: 900 - 330 * rise + 380 * p * p, width: 7, height: 18, borderRadius: 6, background: "rgba(220,240,245,.8)", opacity: 1 - p }} />; })}
      <Splash x={1150} y={900} p={(tt - 1.0) / 1.2} s={1.6} />
    </div>
    <Prop id="stake" x={330} y={1180} w={300} r={-3} sh={0} />
  </Cam>;
}} />;

// m0-1 · la balanza del acopiador: las pieles caen de a una sobre el plato, el plato baja y el contador ancho rueda a 1.8 millones
const HPeltBoard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 7, sink = Array.from({ length: N }, (_, i) => land(tt, 0.3 + i * 0.6).k).reduce((a, b) => a + b, 0) / N, v = 1800000 * eio(tt, 0.4, d - 1.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={880} />
    <Prop id="scale_platform" x={900} y={1000 + 18 * sink} w={980} sq={0.15 * sink} />
    {Array.from({ length: N }, (_, i) => <Drop key={i} tt={tt} at={0.3 + i * 0.6} id="pelt_flat" x={760 + (i % 2 ? 60 : -40)} y={880 - i * 34 + 18 * sink} w={560} r={i % 2 ? 6 : -5} />)}
    <div style={{ position: "absolute", left: 360, top: 70, width: 1200, height: 230, borderRadius: 24, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 24px 40px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.12)" }} />
    <Odo x={960} y={185} v={v} n={7} size={150} />
    <Word tt={tt} at={d - 1.4} x={1500} y={520} txt="1.8 MILLION" size={120} r={-4} />
  </Cam>;
}} />;

// m1 · la marisma se perfora: el bloque de marisma entero con raíces; los agujeros se abren a agua negra y se juntan; el arco de fútbol se hunde
const HMarshHoles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), Ho = Array.from({ length: 7 }, (_, i) => ({ x: 640 + rnd(i + 3) * 640, y: 470 + rnd(i + 9) * 120, a: 0.6 + i * 0.6, r: 70 + rnd(i) * 70 })), sinkG = eio(tt, d - 2.4, d - 0.6);
  return <Cam tt={tt} d={d} z={0.08} fy={500}>
    <Agua tt={tt} y0={760} o={0.9} />
    <Prop id="marsh_chunk" x={960} y={1000} w={1500} />
    {Ho.map((o, i) => { const g = phys(tt, o.a, 6, 0.6); return g <= 0.01 ? null : <div key={i} style={{ position: "absolute", left: o.x - o.r * 1.6 * g, top: o.y - o.r * 0.55 * g, width: o.r * 3.2 * g, height: o.r * 1.1 * g, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #0c1614 40%, #2a3a2a 70%, #5a4a2a 100%)", boxShadow: "inset 0 10px 18px rgba(0,0,0,.8)" }} />; })}
    <Prop id="soccer_goal" x={1080} y={560 + 120 * sinkG} w={380} r={6 * sinkG} />
    {sinkG > 0 && <div style={{ position: "absolute", left: 860, top: 600, width: 440, height: 120 * sinkG, background: "linear-gradient(rgba(20,34,30,.0),rgba(20,34,30,.9))" }} />}
    <Rings tt={tt} at={d - 2.0} x={1080} y={600} s={1.2} />
  </Cam>;
}} />;

// m1-2 · la recompensa por cola: tres colas cuelgan de broches y se hamacan con peso; el fajo de billetes cae dentro del frasco
const HTailTag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    <div style={{ position: "absolute", left: -20, top: 150, width: 1960, height: 6, background: "#c8b08a", transform: "rotate(1.2deg)", boxShadow: "0 6px 8px rgba(0,0,0,.4)" }} />
    {[0, 1, 2].map((i) => { const L = land(tt, 0.2 + i * 0.5, 500), a = swing(tt, 0.2 + i * 0.5 + 0.3, 16, 3, 0.6); return !L.on ? null : <div key={i} style={{ position: "absolute", left: 300 + i * 340, top: 160 + L.dy, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <Prop id="tail" x={0} y={640} w={560} sh={0} style={{ transform: "rotate(90deg)", transformOrigin: "50% 0" }} /><Prop id="clothespin" x={0} y={120} w={150} r={90} sh={0} /></div>; })}
    {(() => { const L = land(tt, Math.max(1.8, d * 0.45), 800); return L.on && <Prop id="bill_roll" x={1460} y={820 + L.dy} w={300} r={-20} sq={L.sq} sh={0} />; })()}
    <Prop id="jar" x={1460} y={900} w={460} style={{ opacity: 0.62 }} />
    <Puff x={1460} y={560} r={60} o={cl((tt - Math.max(1.8, d * 0.45) - 0.4) * 2) * 0.4} />
  </Cam>;
}} />;

// m2 · el pastel de causas: el pastel entero; la porción se levanta con la pala y viene a cámara; el repasador cae en pliegues
const HPieSlice: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 1.0, 2.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={760} />
    <Drop tt={tt} at={0.0} id="pie" x={900} y={1010} w={1180} h={300} />
    <Prop id="pie_slice" x={980 + 260 * up} y={860 - 300 * up} w={520 + 320 * up} r={-8 * up} sh={1 - up} />
    <Drop tt={tt} at={0.6} id="towel" x={260} y={1070} w={620} r={-12} h={900} />
    {up > 0.3 && Array.from({ length: 4 }, (_, k) => <Puff key={k} x={1180 + k * 50} y={480 - 200 * up - 60 * ((tt * 0.6 + k * 0.25) % 1)} r={60} o={0.35 * (1 - ((tt * 0.6 + k * 0.25) % 1))} />)}
  </Cam>;
}} />;

// m2-3 · el animal: la cara de la nutria enorme, destello en los dientes naranjas; el globo gira y un alfiler cae en Sudamérica
const HIncisors: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = Math.exp(-3 * Math.abs(tt - 1.2)), pin = land(tt, d * 0.55, 500);
  return <Cam tt={tt} d={d} z={0.07} fx={600}>
    <Prop id="nutria_face" x={600} y={1110} w={1000} />
    <Glow x={610} y={760} r={260} o={fl * 1.2} col="255,170,60" />
    <Prop id="globe" x={1440} y={1000} w={720} ry={-10 + 20 * eio(tt, 0, d)} />
    {pin.on && <div style={{ position: "absolute", left: 1400, top: 560 + pin.dy, transform: `scale(${1 + 0.2 * pin.sq},${1 - 0.2 * pin.sq})` }}><div style={{ width: 54, height: 54, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#b3221a 60%,#5a0a06)", boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} /><div style={{ width: 6, height: 70, margin: "0 auto", background: "linear-gradient(90deg,#888,#eee,#777)" }} /></div>}
    <Rings tt={tt} at={d * 0.55 + 0.2} x={1427} y={690} s={0.4} />
  </Cam>;
}} />;

// m3 · las camadas: el nido grande; tres crías asoman de a una; en el poste se tallan tres marcas con viruta
const HLitterTree: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06} fx={800}>
    <Mesa y0={850} />
    <Prop id="stake_tall" x={1560} y={1040} w={260} />
    {[0, 1, 2].map((i) => { const p = phys(tt, 0.5 + i * 0.9, 6, 0.5); return <Prop key={i} id="pup" x={560 + i * 260} y={900 - 420 * p} w={330} r={(i - 1) * 8} sh={0} />; })}
    <Prop id="nest" x={820} y={1050} w={1050} />
    {[0, 1, 2].map((i) => { const at = 0.9 + i * 0.9, c = cl((tt - at) / 0.25); return c <= 0 ? null : <React.Fragment key={"m" + i}>
      <div style={{ position: "absolute", left: 1490, top: 420 + i * 110, width: 150 * c, height: 22, background: "linear-gradient(#fff6e0,#d8c49a)", boxShadow: "inset 0 3px 4px rgba(0,0,0,.35)", transform: "rotate(-6deg)" }} />
      <Dust tt={tt} at={at} x={1620} y={440 + i * 110} w={90} col="rgba(230,200,150,.9)" /></React.Fragment>; })}
  </Cam>;
}} />;

// m4 · todos querían un tapado: el abrigo de piel cae al perchero y se hamaca; el cuello y el sombrero aterrizan de a uno
const HCoatRack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), c = land(tt, 0.3, 700), a = swing(tt, 0.6, 10, 3.4, 0.8);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={900} tone="#7a5636" />
    <Prop id="coat_rack" x={960} y={1060} w={520} r={a * 0.15} />
    {c.on && <div style={{ position: "absolute", left: 960, top: 230 + c.dy, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}><Prop id="fur_coat" x={0} y={760} w={560} sq={c.sq * 0.5} sh={0} /></div>}
    <Drop tt={tt} at={d * 0.45} id="fur_collar" x={1420} y={960} w={420} h={600} />
    <Drop tt={tt} at={d * 0.62} id="fur_hat" x={560} y={960} w={330} h={600} />
  </Cam>;
}} />;

// m5 · los corrales por el país: el mapa de madera en volumen; las cercas grandes se clavan de a una con polvo
const US = "M60 80 L700 90 L900 140 L1060 170 L1180 190 L1330 140 L1400 110 L1380 200 L1300 300 L1260 380 L1200 480 L1140 580 L1160 700 L1120 740 L1080 640 L1000 610 L900 620 L760 600 L700 690 L640 720 L560 620 L450 610 L330 600 L200 560 L120 470 L70 330 L40 200 Z";
const HPenMap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.2), pts = [[180, 420], [200, 240], [560, 380], [860, 560], [1060, 520]];
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", left: 220, top: 210, transform: "perspective(1600px) rotateX(28deg)", transformOrigin: "50% 100%" }}>
      <svg width={1480} height={780} viewBox="0 0 1480 780" style={{ overflow: "visible" }}>
        <defs><linearGradient id="d4us" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8ab72" /><stop offset="1" stopColor="#a87a48" /></linearGradient><pattern id="d4ve" width="120" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 Q30 2 60 7 T120 7" stroke="rgba(90,50,20,.25)" strokeWidth="2" fill="none" /></pattern></defs>
        {[24, 18, 12, 6].map((k) => <path key={k} d={US} transform={`translate(0 ${k})`} fill="#5a3a1c" />)}
        <path d={US} fill="url(#d4us)" /><path d={US} fill="url(#d4ve)" />
        <path d="M1060 610 L1160 700 L1120 740 L1080 640 Z" fill="#c8702a" opacity={eio(tt, d * 0.6, d * 0.7)} />
      </svg></div>
    {pts.map(([x, y], i) => <Drop key={i} tt={tt} at={(i < 2 ? b0 : b0 + 0.4) + i * 0.55} id="fence" x={220 + x} y={300 + y * 0.9} w={400} />)}
  </Cam>;
}} />;

// m6 · el huracán: noche de tormenta, el corral de alambre se sacude, una rama cruza delante; tres nutrias salen corriendo en arco
const HHurricanePen: C = ({ t, h }) => <S t={t} h={h} bg={STORM} f={(tt) => {
  const d = D(h), shake = 8 * Math.sin(tt * 23) * eio(tt, 0, 1), br = (tt - d * 0.3) / 1.2;
  return <Cam tt={tt} d={d} z={0.05}>
    {Array.from({ length: 70 }, (_, k) => { const p = (tt * 1.8 + k / 70) % 1; return <div key={k} style={{ position: "absolute", left: (k * 97) % 2100 - 100 + 300 * p, top: -100 + 1200 * p, width: 3, height: 70, background: "rgba(200,215,230,.35)", transform: "rotate(18deg)" }} />; })}
    <Prop id="wire_pen" x={820 + shake} y={940} w={1000} r={shake * 0.2} />
    {[0, 1, 2].map((i) => { const p = cl((tt - (1.2 + i * 0.7)) / 1.3); return p <= 0 || p >= 1 ? null : <React.Fragment key={i}><Prop id="nutria_run" x={1040 + 900 * p} y={900 - 260 * Math.sin(p * Math.PI) + i * 40} w={360} r={-14 + 28 * p} /><Dust tt={tt} at={1.2 + i * 0.7 + 0.95} x={1800} y={920} w={160} /></React.Fragment>; })}
    {br > 0 && br < 1 && <Prop id="branch" x={-300 + 2600 * br} y={420 + 80 * Math.sin(br * 6)} w={900} r={-30 + 400 * br} sh={0} blur={6} />}
  </Cam>;
}} />;

// m6-7 · el mito: la máquina de escribir tipea una frase grande; se tacha en rojo grueso y el sello cae al costado
const HMythCheck: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), txt = "THE STORM LET THEM OUT", n = Math.floor(cl((tt - 0.4) / 2.2) * txt.length), jig = n < txt.length && tt > 0.4 ? 3 * Math.sin(tt * 60) : 0, b2 = bt(h, 2, d * 0.7), st = cl((tt - b2) / 0.5);
  return <Cam tt={tt} d={d} z={0.05} fy={420}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 360, top: 40, width: 1200, height: 560, background: "linear-gradient(#fbf6ea,#ece2c8)", boxShadow: "0 20px 30px rgba(0,0,0,.4)", transform: `translateY(${-n * 1.5}px)` }}>
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 74, color: "#1a1a1a", whiteSpace: "nowrap" }}>{txt.slice(0, n)}</div>
      <div style={{ position: "absolute", left: 60, top: 96, width: 1080 * st, height: 22, background: "#c41e1e", borderRadius: 10, transform: "rotate(-1.5deg)", opacity: 0.92 }} />
      <div style={{ position: "absolute", left: 70, top: 170, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 74, color: "#1a1a1a", whiteSpace: "nowrap" }}>{"SET LOOSE ON PURPOSE".slice(0, Math.floor(cl((tt - b2 - 0.6) / 1.4) * 20))}</div>
    </div>
    <Prop id="typewriter" x={960 + jig} y={1090} w={1250} />
    <Sello tt={tt} at={b2 + 0.4} x={1580} y={300} txt="MYTH" size={120} />
  </Cam>;
}} />;

// m7 · muchas manos: la jaula grande al frente; tres manos distintas suben de a una y levantan el pestillo; la nutria sale disparada
const HManyHands: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hands = ["hand_glove", "hand_flannel", "hand_watch"], step = (d - 1.5) / 3;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    <Prop id="cage_open" x={360} y={830} w={460} blur={5} o={0.8} />
    <Prop id="cage_open" x={1580} y={830} w={460} blur={5} o={0.8} />
    <Prop id="cage_open" x={960} y={1010} w={900} />
    {hands.map((id, i) => { const a = 0.3 + i * step, p = eio(tt, a, a + 0.6) * (1 - eio(tt, a + step - 0.4, a + step)), run = cl((tt - a - 0.7) / 1.1);
      return <React.Fragment key={id}><Prop id={id} x={1300 - 80 * p} y={1400 - 650 * p} w={520} r={-30} sh={0} />
        {run > 0 && run < 1 && <Prop id="nutria_run" x={960 + 1200 * run * (i % 2 ? -1 : 1)} y={960} w={380} flip={i % 2 === 1} />}</React.Fragment>; })}
  </Cam>;
}} />;

// m8 · el jacinto de agua: el canal tapado de flores; la nutria nada con estela en V, muerde y cada flor se hunde con anillos
const HHyacinthDitch: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c0a0,#6a8a6a 40%,#2a4a42)" f={(tt) => {
  const d = D(h), nx = -300 + 2300 * eio(tt, 0.3, d - 0.4), F = Array.from({ length: 9 }, (_, i) => ({ x: 120 + i * 210 + (i % 2) * 40, y: 600 + (i % 3) * 150, w: 300 + (i % 3) * 60 }));
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={380} col="#5a7a5a" />
    {F.map((f, i) => { const sk = eio(nx - f.x, 0, 260); return <React.Fragment key={i}><Prop id="hyacinth" x={f.x} y={f.y + 4 * Math.sin(tt * 2 + i) + 140 * sk} w={f.w} r={20 * sk} o={1 - 0.85 * sk} sh={0} /><Rings tt={tt} at={tt - (nx - f.x) / 900} x={f.x} y={f.y} s={0.7} /></React.Fragment>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${nx - 120} 760 L${nx - 900} 640 M${nx - 120} 790 L${nx - 900} 920`} stroke="rgba(235,245,240,.55)" strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
    <Prop id="nutria_swim" x={nx} y={810} w={520} sh={0} />
  </Cam>;
}} />;

// m9 · enviadas a otros estados: el barco entero en el muelle; la grúa baja la red con tres cajones, aterrizan y el barco se inclina; sello en el cajón
const HCrateShip: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8d4dc,#e8e0d0 45%,#5a7a8a 55%,#2a4050)" f={(tt) => {
  const d = D(h), dn = eio(tt, 0.3, 2.2), a = swing(tt, 0.3, 6, 2.2, 0.5), tilt = 2 * Math.exp(-2 * Math.max(0, tt - 2.2)) * Math.sin(Math.max(0, tt - 2.2) * 6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={600} col="#5a7a8a" deep="#1a2a36" />
    <div style={{ position: "absolute", inset: 0, transformOrigin: "1100px 780px", transform: `rotate(${tilt}deg)` }}><Prop id="cargo_ship" x={1100} y={800} w={1500} sh={0} /></div>
    <div style={{ position: "absolute", left: 1100, top: -40, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: -4, top: 0, width: 8, height: 130 + 260 * dn, background: "linear-gradient(90deg,#333,#999,#333)" }} />
      <Prop id="net_crates" x={0} y={560 + 260 * dn} w={460} sh={0} /></div>
    <Rings tt={tt} at={2.2} x={1100} y={790} s={2} />
    <Drop tt={tt} at={d * 0.55} id="crate" x={420} y={1060} w={520} />
    <Sello tt={tt} at={d * 0.55 + 0.6} x={420} y={880} txt="SHIPPED" size={90} />
  </Cam>;
}} />;

// m10 · la cosecha por década: fardos de pieles que se apilan en columnas; la de los 70 sube más alto que todas
const HHarvestBars: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cols = [["1940s", 1], ["1950s", 2], ["1960s", 3], ["1970s", 5]] as [string, number][];
  let k = 0;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Mesa y0={900} />
    {cols.map(([y, n], c) => <React.Fragment key={y}>
      {Array.from({ length: n }, (_, i) => { const at = 0.3 + (k++) * 0.42; return <Drop key={i} tt={tt} at={at} id="pelt_bale" x={380 + c * 400} y={900 - i * 140} w={300} r={(i % 2 ? 2 : -2)} />; })}
      <Word tt={tt} at={0.4 + c * 0.5} x={380 + c * 400} y={965} txt={y} size={78} r={0} />
    </React.Fragment>)}
  </Cam>;
}} />;

// m11 · el campamento en la marisma: la cabaña sobre pilotes al atardecer; la garza cruza la luna; la piragua llega remando y amarra
const HStiltCamp: C = ({ t, h }) => <S t={t} h={h} bg={DUSK} f={(tt) => {
  const d = D(h), px = -400 + 1000 * eio(tt, 0.2, d * 0.6), hx = 2100 - 2600 * cl((tt - 0.8) / (d - 1));
  return <Cam tt={tt} d={d} z={0.06} fx={1200}>
    <Glow x={600} y={260} r={170} o={1} col="255,240,210" />
    <div style={{ position: "absolute", left: 520, top: 180, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#fff8e8,#e8d8b0)" }} />
    <Prop id="heron" x={hx} y={340} w={420} r={-4} sh={0} />
    <Agua tt={tt} y0={580} col="#3a5a52" deep="#0e1c18" />
    <Prop id="stilt_camp" x={1300} y={760} w={900} sh={0} />
    <Prop id="stilt_camp" x={1300} y={760} w={900} sh={0} style={{ transform: "scaleY(-1)", transformOrigin: "50% 100%", opacity: 0.22, filter: "blur(4px)" }} />
    <Glow x={1250} y={470} r={90} o={0.8 + 0.2 * Math.sin(tt * 7)} col="255,190,90" />
    <Prop id="piling" x={330} y={1000} w={150} sh={0} />
    <Prop id="pirogue" x={px} y={930 + 6 * Math.sin(tt * 2)} w={860} sh={0} />
  </Cam>;
}} />;

// m12 · la línea de trampas cuenta: el clavo de hierro entra en la pared; las chapas se enhebran en el aro y lo hamacan; la última vuela a cámara
const HTrapCount: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#5a3e24 0 6px,#6a4a2c 6px 180px)" f={(tt) => {
  const d = D(h), N = 8, a = swing(tt, 0.5, 4, 3, 0.4) + Array.from({ length: N }, (_, i) => swing(tt, 0.8 + i * 0.45, 6, 3.4, 1.2)).reduce((x, y) => x + y, 0), fly = eio(tt, d - 1.6, d - 0.4), nail = eio(tt, 0, 0.35);
  return <Cam tt={tt} d={d} z={0.05} fy={300}>
    <Luz />
    <Prop id="iron_nail" x={960} y={180} w={110 + 40 * (1 - nail)} r={90} sh={0} />
    <div style={{ position: "absolute", left: 960, top: 190, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: -170, top: 0, width: 340, height: 340, borderRadius: "50%", border: "16px solid #9a9ea4", boxShadow: "0 10px 14px rgba(0,0,0,.5), inset 0 0 6px rgba(0,0,0,.6)" }} />
      {Array.from({ length: N }, (_, i) => { const L = land(tt, 0.8 + i * 0.45, 500), ang = (200 + i * 18) * Math.PI / 180, last = i === N - 1; if (!L.on) return null;
        const x = Math.cos(ang) * 170, y = 170 + Math.sin(ang) * -170 + 120;
        return <Prop key={i} id="brass_tag" x={x + (last ? 300 * fly : 0)} y={y + L.dy + (last ? 300 * fly : 0)} w={150 * (last ? 1 + 4 * fly : 1)} r={(i - 4) * 9} sh={0} blur={last ? 4 * fly * (1 - fly) : 0} />; })}
    </div>
    <Dust tt={tt} at={0.3} x={960} y={190} w={120} col="rgba(200,170,120,.8)" />
  </Cam>;
}} />;

// m13 · el cuereado: tres pieles estiradas en tablas en fila; la cuchilla raspa cada una y levanta pelusa y viruta
const HStretchBoards: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)" f={(tt) => {
  const d = D(h), seg = (d - 0.6) / 3, i = Math.min(2, Math.floor(tt / seg)), u = (tt % seg) / seg, ky = 340 + 520 * (0.5 - 0.5 * Math.cos(u * Math.PI * 4));
  return <Cam tt={tt} d={d} z={0.05}>
    <Luz />
    <div style={{ position: "absolute", left: 160, top: 190, width: 1600, height: 34, background: "linear-gradient(#8a6238,#4a2e16)", boxShadow: "0 12px 18px rgba(0,0,0,.5)" }} />
    {[0, 1, 2].map((k) => <Drop key={k} tt={tt} at={0.1 + k * 0.25} id="stretch_board" x={480 + k * 480} y={1020} w={300} r={swing(tt, 0.3 + k * 0.25, 2, 3, 0.8)} h={500} dust={false} />)}
    <Prop id="fleshing_knife" x={480 + i * 480} y={ky} w={520} r={-6 + 10 * Math.sin(u * 20)} sh={0} />
    {Array.from({ length: 10 }, (_, k) => { const p = ((tt * 2 + k / 10) % 1); return <div key={k} style={{ position: "absolute", left: 480 + i * 480 + (k - 5) * 30 + 140 * p * (k % 2 ? 1 : -1), top: ky + 260 * p * p - 40, width: 10, height: 4, background: k % 3 ? "#8a5a32" : "#e8d8b8", opacity: 1 - p, transform: `rotate(${k * 40 + p * 300}deg)` }} />; })}
  </Cam>;
}} />;

// m14 · el balancín: la tabla con tres ratas almizcleras arriba; la nutria cae del otro lado con peso y las lanza en arco al pasto
const HSeesawMusk: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8d0e0,#e8e4d0 55%,#7a9a4a 57%,#3a5a22)" f={(tt) => {
  const d = D(h), at = 1.0, L = land(tt, at, 800), ang = -12 + 24 * eio(tt, at + 0.05, at + 0.35) + swing(tt, at + 0.35, 3, 6, 2);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 900, top: 760, width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: "190px solid #6a4626", filter: "drop-shadow(0 12px 10px rgba(0,0,0,.5))" }} />
    <div style={{ position: "absolute", left: 970, top: 770, height: 1080, transformOrigin: "0 0", transform: `rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: -700, top: -24, width: 1400, height: 48, borderRadius: 8, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 70px), linear-gradient(#c89a62,#7a5230)", boxShadow: "0 14px 16px rgba(0,0,0,.45)" }} />
      {L.on && <Prop id="nutria_big" x={540} y={-24 + Math.min(0, L.dy)} w={480} sq={L.sq} sh={0} />}
      {[0, 1, 2].map((k) => tt < at + 0.3 && <Prop key={k} id="muskrat" x={-620 + k * 150} y={-24} w={180} sh={0} />)}
    </div>
    {[0, 1, 2].map((k) => { const p = cl((tt - at - 0.3) / 1.3); return p <= 0 ? null : <React.Fragment key={k}><Prop id="muskrat" x={300 - k * 120 - 260 * p} y={680 - (500 + k * 80) * Math.sin(p * Math.PI) + 330 * p} w={180} r={p < 1 ? 360 * p * (k % 2 ? -1 : 1) : 0} />{p >= 1 && <Dust tt={tt} at={at + 1.6} x={40 - k * 120} y={1010} w={120} />}</React.Fragment>; })}
    <Dust tt={tt} at={at + 0.1} x={1500} y={700} w={300} />
  </Cam>;
}} />;

// m15 · deshacer o adaptarse: el cartel colgado de cadenas gira de UNDO a ADAPT empujado por la ráfaga de hojas y oscila hasta quedar
const HAdaptSign: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = d * 0.35, rot = 180 * eio(tt, g, g + 0.9) + swing(tt, g + 0.9, 18, 5, 1.4), sw = swing(tt, 0.1, 5, 2.4, 0.4);
  const face = (txt: string, col: string, back: boolean) => <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 1080, backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined }}>
    <Prop id="sign_chains" x={550} y={700} w={1100} sh={0} />
    <div style={{ position: "absolute", left: 0, top: 360, width: 1100, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 190, color: col, textShadow: "0 3px 0 rgba(0,0,0,.4)", mixBlendMode: "multiply" }}>{txt}</div></div>;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 410, top: 120, width: 1100, height: 1080, transformOrigin: "550px 0", transform: `rotate(${sw}deg) perspective(2200px) rotateY(${rot}deg)`, transformStyle: "preserve-3d" }}>
      {face("UNDO", "#3a2410", false)}{face("ADAPT", "#1e5a2a", true)}</div>
    {Array.from({ length: 9 }, (_, k) => { const p = (tt - g + 0.3 - k * 0.07) / 1.1; return p <= 0 || p >= 1 ? null : <Prop key={k} id="branch" x={-300 + 2500 * p} y={300 + k * 80 + 60 * Math.sin(p * 8 + k)} w={200 + (k % 3) * 80} r={p * 500 + k * 40} sh={0} blur={3} />; })}
  </Cam>;
}} />;

// m15-16 · la canilla: el barril de nutrias; entran por arriba, el nivel sube; la canilla abierta las deja salir en tropel; la mano la cierra y el nivel pasa la raya
const HCheckValve: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = d * 0.62, lvl = cl(0.35 + 0.12 * Math.sin(tt * 0.8) * (tt < cut ? 1 : 0) + 0.5 * eio(tt, cut, cut + 1.6)), hand = eio(tt, cut - 0.6, cut) * (1 - eio(tt, cut + 0.6, cut + 1.1));
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="barrel" x={800} y={1010} w={760} />
    <div style={{ position: "absolute", left: 1240, top: 300, width: 70, height: 620, borderRadius: 35, background: "linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.08) 40%,rgba(255,255,255,.3))", border: "4px solid rgba(220,220,220,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: 620 * lvl, background: "linear-gradient(90deg,#6a4a2a,#a07040,#6a4a2a)" }} /></div>
    <div style={{ position: "absolute", left: 1210, top: 300 + 620 * 0.35, width: 130, height: 10, background: "#d42a1e", boxShadow: "0 0 12px rgba(255,60,40,.6)" }} />
    {Array.from({ length: 6 }, (_, k) => { const p = (tt * 0.9 + k / 6) % 1; return <Prop key={k} id="nutria_run" x={520 + 300 * p} y={60 + 400 * p * p} w={200} r={60 * p} sh={0} />; })}
    {tt < cut && Array.from({ length: 4 }, (_, k) => { const p = (tt * 0.7 + k / 4) % 1; return <Prop key={"o" + k} id="nutria_run" x={980 + 900 * p} y={1000} w={230} sh={0.6} />; })}
    <Prop id="hand_glove" x={1000} y={1350 - 420 * hand} w={420} r={-40 + 60 * eio(tt, cut - 0.2, cut + 0.3)} sh={0} />
    <Glow x={1275} y={300 + 620 * (1 - lvl)} r={120} o={tt > cut + 1 ? 0.8 : 0} col="255,70,50" />
  </Cam>;
}} />;

export const HCD4a: Record<string, C> = {
  trapLine: HTrapLine, peltBoard: HPeltBoard, marshHoles: HMarshHoles, tailTag: HTailTag, pieSlice: HPieSlice, incisors: HIncisors, litterTree: HLitterTree,
  coatRack: HCoatRack, penMap: HPenMap, hurricanePen: HHurricanePen, mythCheck: HMythCheck, manyHands: HManyHands, hyacinthDitch: HHyacinthDitch,
  crateShip: HCrateShip, harvestBars: HHarvestBars, stiltCamp: HStiltCamp, trapCount: HTrapCount, stretchBoards: HStretchBoards, seesawMusk: HSeesawMusk,
  adaptSign: HAdaptSign, checkValve: HCheckValve,
};
export { Puff, Word };

// m16 · el precio se derrumba: la piel colgada del clavo se achica en tres pasos; en el pizarrón la tiza escribe el precio y el trapo lo borra
const HPriceTag: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)" f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.0), b1 = bt(h, 1, d * 0.6), st = tt < b0 ? 0 : tt < b1 ? 1 : 2, P = ["$8", "$3", "50¢"], sc = [1, 0.72, 0.42][st], w = phys(tt, [0, b0, b1][st], 7, 0.5);
  const wipe = (a: number) => cl((tt - a + 0.5) / 0.5) * (1 - cl((tt - a) / 0.2)), wx = Math.max(wipe(b0), wipe(b1));
  return <Cam tt={tt} d={d} z={0.05}>
    <Luz />
    <Prop id="iron_nail" x={600} y={160} w={90} r={90} sh={0} />
    <div style={{ position: "absolute", left: 600, top: 150, height: 1080, transformOrigin: "0 0", transform: `rotate(${swing(tt, [0, b0, b1][st], 6, 3, 0.8)}deg)` }}>
      <Prop id="pelt_flat" x={0} y={160 + 700 * (0.7 + 0.3 * sc)} w={520 * (0.6 + 0.4 * sc) * (0.9 + 0.1 * w)} r={90} sh={0} style={{ transform: "rotate(90deg)", transformOrigin: "50% 0" }} /></div>
    <Prop id="chalkboard" x={1340} y={900} w={760} />
    <div style={{ position: "absolute", left: 1340, top: 520, transform: "translate(-50%,-50%)", fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontSize: 200, color: "rgba(245,245,240,.92)", clipPath: `inset(0 ${100 - 100 * cl((tt - [0, b0, b1][st] - 0.3) / 0.8)}% 0 0)` }}>{P[st]}</div>
    {wx > 0 && <Prop id="towel" x={1120 + 440 * wx} y={640} w={280} r={-20 + 40 * wx} sh={0} />}
  </Cam>;
}} />;

// m16-17 · no vale la nafta: el motor fuera de borda tose humo; el bidón se inclina y vuelca un chorro brillante; el sello lo cierra
const HGasCan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tilt = eio(tt, 0.6, 1.4), pour = tt > 1.3 && tt < d - 1.2, cough = Math.max(0, Math.sin(tt * 5)) ** 6;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 230, top: 520, width: 520, height: 200, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 60px), linear-gradient(#a8784a,#5a3a1c)", boxShadow: "0 18px 24px rgba(0,0,0,.5)" }} />
    <Prop id="outboard" x={520 + 6 * cough} y={1060} w={760} r={-2 * cough} />
    {[0, 1, 2].map((k) => <Puff key={k} x={320 - 40 * k - 60 * ((tt * 0.8 + k / 3) % 1)} y={700 - 140 * ((tt * 0.8 + k / 3) % 1)} r={50 + 50 * ((tt * 0.8 + k / 3) % 1)} col="rgba(120,120,120,.7)" o={0.7 * (1 - ((tt * 0.8 + k / 3) % 1))} />)}
    <div style={{ position: "absolute", left: 1380, top: 1000, height: 1080, transformOrigin: "0 0", transform: `rotate(${-55 * tilt}deg)` }}><Prop id="gas_can" x={-60} y={-60} w={460} sh={0} /></div>
    {pour && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1060 ${560} Q900 ${560} 760 ${700}`} stroke="url(#d4gas)" strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="40 16" strokeDashoffset={-tt * 300} /><defs><linearGradient id="d4gas"><stop offset="0" stopColor="#f8e8a0" /><stop offset="1" stopColor="#c8a040" /></linearGradient></defs></svg>}
    <Sello tt={tt} at={d - 1.0} x={1300} y={300} txt="NOT WORTH IT" size={100} />
  </Cam>;
}} />;

// m17 · el «eat-out»: el bloque de marisma con tres nutrias comiendo; el pasto se vuelve barro bajo ellas y la marea lo lava
const HEatOut: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.3), b1 = bt(h, 1, d * 0.65), mud = eio(tt, b0 - 0.6, b1), wash = eio(tt, b1, d - 0.3);
  return <Cam tt={tt} d={d} z={0.07}>
    <Agua tt={tt} y0={760} />
    <div style={{ clipPath: `inset(0 0 0 ${100 * wash * 0.55}%)`, position: "absolute", inset: 0 }}>
      <Prop id="marsh_chunk" x={960} y={1010} w={1500} />
      <div style={{ position: "absolute", left: 960 - 520 * mud, top: 520 - 70 * mud, width: 1040 * mud, height: 150 * mud, borderRadius: "50%", background: "radial-gradient(ellipse,#3a2a18,#5a4024 70%,rgba(90,64,36,0))" }} />
      {[0, 1, 2].map((k) => <Prop key={k} id="nutria_eat" x={720 + k * 260} y={600 + (k % 2) * 30 + 4 * Math.sin(tt * 8 + k)} w={340} flip={k === 1} />)}
    </div>
    <div style={{ position: "absolute", left: 1920 - 1920 * wash, top: 480, width: 1920, height: 700, background: "linear-gradient(90deg,rgba(220,235,235,.85),rgba(70,110,100,.85) 6%,rgba(40,70,64,.9))", borderRadius: "40px 0 0 0" }} />
  </Cam>;
}} />;

// m18 · la vista aérea: la ventanilla del avión; abajo la marisma con parches de barro que aparecen uno por uno
const HAerialGrid: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#cfd8de,#9aa8b0)" f={(tt) => {
  const d = D(h), sx = -tt * 40;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 460, top: 90, width: 1000, height: 900, borderRadius: "46%", overflow: "hidden", background: "#4a6a32" }}>
      <div style={{ position: "absolute", left: sx - 200, top: -100, width: 1600, height: 1200, background: "radial-gradient(circle at 30% 40%,#7a9a4a,transparent 40%), radial-gradient(circle at 70% 70%,#5a7a3a,transparent 40%), repeating-linear-gradient(120deg,#5a7a3a 0 30px,#6a8a42 30px 70px)" }}>
        {Array.from({ length: 10 }, (_, k) => { const g = phys(tt, 0.5 + k * 0.4, 6, 0.6); return <div key={k} style={{ position: "absolute", left: 200 + rnd(k) * 1100, top: 150 + rnd(k + 5) * 800, width: (90 + rnd(k + 2) * 120) * g, height: (60 + rnd(k + 7) * 80) * g, borderRadius: "48% 52% 40% 60%", background: "radial-gradient(#3a2a18,#6a4a2a 70%)", transform: `rotate(${k * 37}deg)` }} />; })}
        {Array.from({ length: 4 }, (_, k) => <div key={"w" + k} style={{ position: "absolute", left: 100 + k * 380, top: 300 + (k % 2) * 400, width: 300, height: 30, borderRadius: 20, background: "#3a5a6a", transform: `rotate(${20 + k * 30}deg)` }} />)}
      </div></div>
    <Prop id="plane_window" x={960} y={1060} w={1180} sh={0} style={{ mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", left: 600, top: 160, width: 260, height: 600, borderRadius: "50%", background: "linear-gradient(120deg,rgba(255,255,255,.22),transparent 60%)", transform: "rotate(18deg)" }} />
  </Cam>;
}} />;

// m19 · la recompensa: la cola gruesa resbala por la ranura del mostrador; por la bandeja sale un billete de cinco; el contador suma
const HTailBounty: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 3, per = (d - 1) / N;
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 60, background: "linear-gradient(#e8c070,#a8802c)", boxShadow: "0 6px 0 #6a4a1a" }} />
    <div style={{ position: "absolute", left: 0, top: 700, width: 1920, height: 400, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 160px), linear-gradient(#8a5a32,#3a2210)" }} />
    <div style={{ position: "absolute", left: 760, top: 650, width: 400, height: 34, borderRadius: 8, background: "#0e0a06", boxShadow: "inset 0 6px 10px #000" }} />
    {Array.from({ length: N }, (_, i) => { const a = 0.3 + i * per, p = eio(tt, a, a + 0.9), out = eio(tt, a + 1.0, a + 1.5), gone = tt > a + 3.5;
      return <React.Fragment key={i}>
        {p < 1 && <div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 412px 0)" }}><Prop id="tail" x={960} y={660 + 300 * p} w={190} r={90} sh={0} style={{ transform: "rotate(-80deg)", transformOrigin: "50% 100%" }} /></div>}
        {!gone && out > 0 && <Prop id="bill5" x={960 + (i - 1) * 60} y={900 + 120 * out} w={560 * (0.6 + 0.4 * out)} r={(i - 1) * 6} sh={0} />}
      </React.Fragment>; })}
    <Odo x={960} y={230} v={5 * Math.min(N, Math.floor(Math.max(0, tt - 1.3) / per) + (tt > 1.3 ? 1 : 0))} n={2} size={170} />
    <div style={{ position: "absolute", left: 740, top: 140, fontFamily: SER, fontWeight: 900, fontSize: 150, color: "#f3e6c6", textShadow: "0 10px 20px #000" }}>$</div>
  </Cam>;
}} />;

// m20 · los acres dañados bajan: el contador sobre la placa de bronce rueda hacia abajo y frena en 6,000; la garza aterriza
const HAcresFall: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), v = 100000 - 94000 * eio(tt, 0.3, d - 1.8), big = 1 + 0.12 * (phys(tt, d - 1.8, 7, 0.35) - (tt > d - 1.8 ? 1 : 0)), hp = eio(tt, d - 2.2, d - 0.4);
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={640} col="#6a8a5a" deep="#2a4a32" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 380px", transform: `scale(${big})` }}>
      <Prop id="plaque" x={960} y={620} w={1100} sh={0.6} />
      <Odo x={960} y={360} v={v} n={6} size={150} />
    </div>
    {tt > d - 1.8 && <Dust tt={tt} at={d - 1.8} x={960} y={640} w={500} col="rgba(170,200,110,.8)" />}
    <Prop id="heron" x={2000 - 700 * hp} y={260 + 560 * hp} w={460} r={-10 + 10 * hp} sh={hp} />
  </Cam>;
}} />;

// m21 · a comerla: la lata de recetas abierta sobre el mantel; la ficha sale volando grande con NUTRIA; la olla humea y la cuchara revuelve
const HRecipeCard: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.8, 2.0), sp = Math.sin(tt * 2.4);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: -200, top: 760, width: 2320, height: 600, background: "repeating-linear-gradient(90deg,rgba(200,40,40,.55) 0 60px,transparent 60px 120px), repeating-linear-gradient(0deg,rgba(200,40,40,.55) 0 60px,#f4ece0 60px 120px)", transform: "perspective(900px) rotateX(40deg)", transformOrigin: "50% 0" }} />
    <Prop id="recipe_tin" x={560} y={1000} w={600} />
    <Prop id="pot" x={1420} y={1010} w={640} />
    <div style={{ position: "absolute", left: 1420, top: 700, height: 1080, transformOrigin: "0 0", transform: `rotate(${-12 + 14 * sp}deg)` }}><Prop id="spoon" x={0} y={-100} w={420} r={70} sh={0} /></div>
    {Array.from({ length: 5 }, (_, k) => { const p = (tt * 0.5 + k / 5) % 1; return <Puff key={k} x={1380 + 60 * Math.sin(p * 6 + k)} y={680 - 380 * p} r={50 + 70 * p} o={0.5 * (1 - p)} />; })}
    {up > 0 && <div style={{ position: "absolute", left: 560 + 200 * up, top: 640 - 360 * up, width: 820, height: 500, transform: `translate(-50%,-50%) rotate(${-12 + 9 * up}deg) scale(${0.3 + 0.7 * up})`, background: "repeating-linear-gradient(180deg,transparent 0 58px,rgba(80,120,200,.35) 58px 60px), linear-gradient(#fbf6ea,#eee2c4)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", borderTop: "8px solid #c84a3a" }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 820, textAlign: "center", fontFamily: "'Segoe Print', 'Comic Sans MS', cursive", fontSize: 150, color: "#2a2018" }}>Nutria</div></div>}
  </Cam>;
}} />;

// m22 · más grande que Delaware: la costa de madera con el hueco de tierra perdida; Delaware tallado cae dentro y sobra lugar
const DEL = "M60 0 L120 10 L150 120 L210 260 L230 380 L180 400 L40 390 L20 240 L40 120 Z";
const HDelawareOverlay: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, d * 0.45, 700), hole = eio(tt, 0.2, d * 0.4);
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", left: 160, top: 160, width: 1600, height: 800, transform: "perspective(1600px) rotateX(30deg)", transformOrigin: "50% 100%", borderRadius: 30, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 3px,transparent 3px 120px), linear-gradient(#d8ab72,#a87a48)", boxShadow: "0 30px 0 #5a3a1c, 0 50px 50px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, top: 560, width: 1600, height: 240, background: "linear-gradient(#4a7a8a,#2a4a5a)" }} />
      {Array.from({ length: 12 }, (_, k) => { const g = cl(hole * 12 - k); return <div key={k} style={{ position: "absolute", left: 300 + (k % 6) * 150 + (k > 5 ? 60 : 0), top: 330 + Math.floor(k / 6) * 120, width: 150 * g, height: 120 * g, background: "#3a6a7a", boxShadow: "inset 0 6px 10px rgba(0,0,0,.5)", borderRadius: 14 }} />; })}
    </div>
    {L.on && <svg width={260} height={420} viewBox="0 0 260 420" style={{ position: "absolute", left: 700, top: 330 + L.dy, overflow: "visible", transform: `scale(${1 + 0.1 * L.sq},${1 - 0.1 * L.sq})`, filter: "drop-shadow(10px 20px 14px rgba(0,0,0,.55))" }}>
      {[14, 10, 6].map((k) => <path key={k} d={DEL} transform={`translate(0 ${k})`} fill="#5a3a1c" />)}<path d={DEL} fill="#c89a62" /><path d={DEL} fill="none" stroke="#8a6238" strokeWidth={3} /></svg>}
    <Dust tt={tt} at={d * 0.45 + 0.12} x={820} y={720} w={260} />
    <Word tt={tt} at={d * 0.45 + 0.6} x={1360} y={420} txt="DELAWARE" size={110} r={-3} />
  </Cam>;
}} />;

// m23 · el río construyó la tierra: la bandeja de arena; la jarra vierte agua con barro y el abanico de lóbulos crece en surcos
const HRiverFan: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 0.6, d - 0.5);
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Mesa y0={760} />
    <div style={{ position: "absolute", left: 260, top: 420, width: 1400, height: 560, transform: "perspective(1400px) rotateX(48deg)", transformOrigin: "50% 100%", borderRadius: 20, background: "radial-gradient(circle at 30% 40%,rgba(0,0,0,.06) 1px,transparent 2px) 0 0/14px 14px, linear-gradient(#5a8aa0,#2a4a5a)", boxShadow: "0 26px 0 #6a4a2a, 0 40px 40px rgba(0,0,0,.5)", overflow: "hidden" }}>
      {Array.from({ length: 7 }, (_, k) => { const s = cl(g * 7 - k * 0.8); return <div key={k} style={{ position: "absolute", left: 700 - 60 + (k - 3) * 110 * s - 130 * s, top: -40, width: 260 * s + 40, height: 420 * s, borderRadius: "0 0 50% 50%", background: "radial-gradient(ellipse at 50% 20%,#c8a870,#9a7a48 70%)", boxShadow: "inset 0 -8px 12px rgba(0,0,0,.25)", transform: `rotate(${(k - 3) * 14}deg)`, transformOrigin: "50% 0" }} />; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 200, height: 1080, transformOrigin: "0 0", transform: `rotate(${-50 * eio(tt, 0, 0.6)}deg)` }}><Prop id="jug" x={-40} y={60} w={340} sh={0} /></div>
    {tt > 0.5 && <div style={{ position: "absolute", left: 930, top: 300, width: 34, height: 220, borderRadius: 17, background: "linear-gradient(90deg,#7a6040,#c8a070,#7a6040)", opacity: 0.9 }} />}
  </Cam>;
}} />;

// m24 · la gran inundación: la casa de maqueta; el agua sube hasta el techo y baja dejando la raya de barro; la placa 1927 se clava en la raya
const HFloodRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, d * 0.45) * (1 - eio(tt, d * 0.55, d * 0.75)), mark = cl((tt - d * 0.55) / 0.3), L = land(tt, d * 0.78, 600);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="house_model" x={960} y={1000} w={1000} />
    {mark > 0 && <div style={{ position: "absolute", left: 560, top: 560, width: 800, height: 16, background: "linear-gradient(rgba(90,60,30,.85),rgba(90,60,30,.2))", opacity: mark, filter: "blur(1px)" }} />}
    <div style={{ position: "absolute", left: 0, top: 1000 - 460 * up, width: 1920, height: 600, background: "linear-gradient(rgba(120,100,70,.75),rgba(60,50,40,.92))", borderTop: "4px solid rgba(230,220,200,.6)" }} />
    {L.on && <Prop id="plaque" x={960} y={620 + L.dy} w={340} sq={L.sq} sh={0} />}
    {L.on && <div style={{ position: "absolute", left: 960, top: 560 + L.dy, transform: "translate(-50%,-50%)", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#4a3010", textShadow: "0 1px 0 rgba(255,230,180,.6)" }}>1927</div>}
    <Dust tt={tt} at={d * 0.78 + 0.1} x={960} y={620} w={160} />
  </Cam>;
}} />;

// m25 · el río encerrado: el tobogán de tablas con la corriente marrón; las bolas de barro salen de la punta en arco y caen al agua profunda
const HLeveeChute: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={720} col="#3a5a6a" deep="#0e1a22" />
    <div style={{ position: "absolute", left: -100, top: 300, width: 1300, height: 300, transform: "skewY(14deg)", transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 1300, height: 90, background: `repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 40px,transparent 40px 90px) ${(tt * 400) % 90}px 0, linear-gradient(#8a6a3a,#5a3e1e)` }} />
      {[0, 220].map((y) => <div key={y} style={{ position: "absolute", left: 0, top: y === 0 ? 40 : 200, width: 1300, height: 80, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 3px,transparent 3px 130px), linear-gradient(#c89a62,#7a5230)", boxShadow: "0 12px 14px rgba(0,0,0,.45)" }} />)}
    </div>
    {Array.from({ length: 5 }, (_, k) => { const p = ((tt * 0.55 + k / 5) % 1), x = 1200 + 600 * p, y = 640 - 200 * Math.sin(p * Math.PI * 0.8) + 360 * p * p; return p > 0.92 ? <Splash key={k} x={1780} y={760} p={(p - 0.92) / 0.08} s={1.2} /> : <Prop key={k} id="mud_ball" x={x} y={y} w={120} r={p * 400} sh={0} />; })}
  </Cam>;
}} />;

// m26 · el petróleo y los canales: la torre cae en la marisma; la draga cava un canal recto, la tierra se apila a los lados y el agua entra
const HRigCanal: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dig = eio(tt, 1.0, d - 0.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", left: -100, top: 520, width: 2120, height: 700, background: "repeating-linear-gradient(100deg,#6a8a3a 0 20px,#5a7a32 20px 50px)", transform: "perspective(1000px) rotateX(40deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 300, top: 700, width: 1500 * dig, height: 90, background: "linear-gradient(#5a4a30,#3a3020)", boxShadow: "inset 0 10px 14px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", inset: "14px 0 0 0", background: "linear-gradient(90deg,#4a6a72,#6a5a3a)", opacity: cl(dig * 1.4 - 0.2) }} /></div>
    {Array.from({ length: Math.floor(14 * dig) }, (_, k) => [0, 1].map((s) => <div key={k + "_" + s} style={{ position: "absolute", left: 300 + k * 107, top: s ? 790 : 650, width: 120, height: 56, borderRadius: "50% 50% 20% 20%", background: "radial-gradient(ellipse at 40% 30%,#8a6a42,#4a3418)", boxShadow: "0 10px 10px rgba(0,0,0,.4)" }} />))}
    <Prop id="dragline" x={300 + 1500 * dig + 120} y={700} w={460} />
    <Drop tt={tt} at={0.2} id="derrick" x={420} y={680} w={260} />
  </Cam>;
}} />;

// m27 · la cuña de sal: la compuerta de hierro sube con peso; el agua salada entra por debajo con remolinos y blanquea el pasto
const HSaltWedge: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.8, 2.4), flow = cl((tt - 1.4) / (d - 2));
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 400, background: "linear-gradient(#6a8a42,#3a5a22)" }} />
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920 * flow, height: 400, background: `linear-gradient(90deg,rgba(180,220,230,.9),rgba(120,170,180,.6) 70%,rgba(120,170,180,0)) , #7a9a8a`, opacity: 0.85 }} />
    {Array.from({ length: 8 }, (_, k) => { const p = (tt * 0.6 + k / 8) % 1; return flow > 0.05 && <div key={k} style={{ position: "absolute", left: 960 + (1920 * flow - 900) * p, top: 820 + (k % 4) * 60, width: 70, height: 70, borderRadius: "50%", border: "5px solid rgba(240,250,250,.55)", borderRightColor: "transparent", transform: `rotate(${tt * 300 + k * 50}deg)` }} />; })}
    <Prop id="gate" x={960} y={900 - 340 * up} w={720} sh={0} />
    <div style={{ position: "absolute", left: 560, top: 860, width: 800, height: 260, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.2) 0 3px,transparent 3px 80px), linear-gradient(#8a8a86,#5a5a56)", boxShadow: "0 -6px 12px rgba(0,0,0,.4)" }} />
    <Prop id="salt_bucket" x={1640} y={1060} w={420} />
  </Cam>;
}} />;

// m28 · el podio de las causas: caen el bloque del dique, la draga del canal y el balde de sal; la nutria mira desde abajo
const HStudyRank: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), s = (d - 1.5) / 3;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="podium" x={960} y={1040} w={1300} />
    <Drop tt={tt} at={0.4} id="concrete_block" x={960} y={560} w={360} />
    <Drop tt={tt} at={0.4 + s} id="canal_piece" x={560} y={690} w={360} />
    <Drop tt={tt} at={0.4 + 2 * s} id="salt_bucket" x={1370} y={770} w={300} />
    <Prop id="nutria_big" x={1650 - 200 * eio(tt, d - 1.5, d - 0.4)} y={1060} w={460} flip />
  </Cam>;
}} />;

// m29 · el villano visible: la nutria gira sobre el plato giratorio bajo un foco; el cartel WANTED se balancea; el dique y el canal se apagan atrás
const HVillainSpot: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#2a2420,#060606 70%)" f={(tt) => {
  const d = D(h), sp = Math.cos(tt * 1.6), dim = 1 - eio(tt, d * 0.5, d * 0.8);
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ opacity: 0.25 + 0.6 * dim, filter: `brightness(${0.4 + 0.6 * dim})` }}><Prop id="concrete_block" x={320} y={760} w={380} /><Prop id="canal_piece" x={1600} y={760} w={420} /></div>
    <div style={{ position: "absolute", left: 760, top: 0, width: 400, height: 1000, background: "linear-gradient(rgba(255,240,200,.32),rgba(255,240,200,.05))", clipPath: "polygon(40% 0,60% 0,100% 100%,0 100%)" }} />
    <Prop id="turntable" x={960} y={1030} w={760} />
    <Prop id="nutria_big" x={960} y={900} w={620} style={{ transform: `scaleX(${sp})` }} />
    <div style={{ position: "absolute", left: 1440, top: 0, height: 1080, transformOrigin: "0 0", transform: `rotate(${swing(tt, 0.2, 8, 2.4, 0.3)}deg)` }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 150, background: "#a88a5a" }} />
      <Prop id="wanted_poster" x={0} y={560} w={380} sh={0} />
      <div style={{ position: "absolute", left: -190, top: 200, width: 380, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 72, color: "#3a2410" }}>WANTED</div></div>
  </Cam>;
}} />;

// m30 · reconstruir: la draga bombea un arco de barro; la isla sube por capas y brota el pasto; el dique se abre y entra el río
const HPipeRebuild: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.4), b1 = bt(h, 1, d * 0.7), isl = eio(tt, 0.6, b0), op = eio(tt, b1, b1 + 1.2);
  return <Cam tt={tt} d={d} z={0.05}>
    <Agua tt={tt} y0={600} />
    <Prop id="dredge" x={440} y={760} w={760} sh={0} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M700 560 Q1000 260 1320 640" stroke="#7a5a32" strokeWidth={30} fill="none" strokeDasharray="60 18" strokeDashoffset={-tt * 260} strokeLinecap="round" opacity={tt > 0.3 ? 0.95 : 0} /></svg>
    {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 1320 - (260 - k * 50) * isl, top: 660 - (60 + k * 40) * isl, width: (520 - k * 100) * isl, height: (120 + k * 30) * isl, borderRadius: "50% 50% 10% 10%", background: ["#8a6a42", "#b8946a", "#d8c098"][k] }} />)}
    {Array.from({ length: 16 }, (_, k) => { const g = cl((tt - b0 + 0.6 - k * 0.06) / 0.5); return g > 0 && <div key={k} style={{ position: "absolute", left: 1140 + k * 24, top: 560 - 60 * g + Math.abs(k - 8) * 6, width: 6, height: 70 * g, background: "#6a9a3a", transform: `rotate(${(k - 8) * 4}deg)`, transformOrigin: "50% 100%" }} />; })}
    {tt > b1 - 0.4 && <><Prop id="concrete_block" x={1560 - 120 * op} y={1040} w={300} /><Prop id="concrete_block" x={1760 + 120 * op} y={1040} w={300} /><div style={{ position: "absolute", left: 1660 - 110 * op, top: 900, width: 220 * op, height: 200, background: "linear-gradient(#7a6a4a,#4a3a2a)" }} /><Splash x={1660} y={940} p={(tt - b1) / 1.2} s={1.4} /></>}
  </Cam>;
}} />;

// m31 · Chesapeake: el perro enorme olfatea con la nariz al suelo; deja huellas de barro; cada banderita que pasa se enciende verde
const HDogSearch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dx = 1500 - 1100 * eio(tt, 0, d), fl = [1500, 1200, 900, 600, 350];
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: -100, top: 560, width: 2120, height: 700, background: "repeating-linear-gradient(95deg,#7a8a4a 0 18px,#6a7a3a 18px 44px)", transform: "perspective(1000px) rotateX(36deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 1500, top: 330, width: 380, height: 110, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.1) 0 2px,transparent 2px 60px), linear-gradient(#c89a62,#8a6238)", boxShadow: "0 12px 14px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 52, color: "#2a1a0c", textAlign: "center", lineHeight: "110px" }}>CHESAPEAKE</div>
    <div style={{ position: "absolute", left: 1680, top: 440, width: 24, height: 320, background: "linear-gradient(90deg,#4a3420,#8a6a42,#4a3420)" }} />
    {fl.map((x, k) => { const on = dx < x + 100; return <React.Fragment key={k}><Prop id="survey_flag" x={x} y={700} w={110} sh={0} style={{ filter: on ? "hue-rotate(110deg) saturate(1.6) brightness(1.1)" : undefined }} /><Glow x={x} y={640} r={90} o={on ? 0.8 : 0} col="140,255,140" /></React.Fragment>; })}
    {Array.from({ length: 10 }, (_, k) => { const x = 1600 - k * 130; return dx < x - 300 && <div key={"p" + k} style={{ position: "absolute", left: x, top: 960 + (k % 2) * 40, width: 46, height: 34, borderRadius: "50%", background: "#3a2a18", opacity: 0.7 }} />; })}
    <Prop id="dog" x={dx + 400} y={1100} w={1150} r={1.5 * Math.sin(tt * 4)} />
  </Cam>;
}} />;

// m32 · las marcas de la marea, año por año: el pilote enorme en el agua; el pincel traza cada raya blanca con su año; el agua sube
const YRS = ["1930s", "1938", "1940s", "1962", "1980s", "1990s", "2002", "2005", "2007"];
const HTideMarks: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), B = YRS.map((_, i) => bt(h, i, 0.5 + i * 2.2)), cur = B.filter((b) => tt >= b).length - 1, wl = 0.15 + 0.4 * eio(tt, 0, d);
  const yOf = (i: number) => 900 - i * 82;
  const ci = Math.max(0, cur), bp = cl((tt - B[ci]) / 0.6);
  return <Cam tt={tt} d={d} z={0.04} fy={500}>
    <Prop id="stake_tall" x={960} y={1120} w={420} sh={0} />
    {YRS.map((y, i) => i > cur ? null : <React.Fragment key={y}>
      <div style={{ position: "absolute", left: 790, top: yOf(i), width: 340 * (i === cur ? bp : 1), height: 16, borderRadius: 8, background: "linear-gradient(#ffffff,#d8d8d0)", boxShadow: "0 3px 4px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: i % 2 ? 1200 : 440, top: yOf(i) - 40, fontFamily: SER, fontWeight: 900, fontSize: i === cur ? 92 : 56, color: i === cur ? "#fff4d8" : "rgba(243,230,198,.6)", textShadow: "0 8px 16px #000", width: 280, textAlign: i % 2 ? "left" : "right" }}>{y}</div></React.Fragment>)}
    {cur >= 0 && bp < 1 && <Prop id="paintbrush" x={800 + 340 * bp} y={yOf(ci) + 40} w={300} r={-30} sh={0} />}
    <div style={{ position: "absolute", left: 0, top: 1080 - 1080 * wl * 0.5, width: 1920, height: 600, background: "linear-gradient(rgba(70,110,110,.75),rgba(20,40,40,.95))", borderTop: "3px solid rgba(230,240,240,.5)" }} />
  </Cam>;
}} />;

// m33 · ¿es una rata?: el árbol de familia; el cuis y el puercoespín aparecen en las ramas; la rata queda sola lejos y la soga se corta
const HFamilyTree: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = d * 0.62, rp = eio(tt, cut, cut + 0.8);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={920} />
    <Prop id="tree" x={760} y={1060} w={900} />
    <Drop tt={tt} at={0.6} id="guinea_pig" x={470} y={470} w={220} h={500} dust={false} />
    <Drop tt={tt} at={1.2} id="porcupine" x={1060} y={430} w={300} h={500} dust={false} />
    <Prop id="nutria_big" x={760} y={1050} w={420} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1140 760 Q1350 ${800 + 120 * rp} ${1460 - 60 * rp} ${860 + 160 * rp}`} stroke="#c8a870" strokeWidth={8} fill="none" opacity={tt < cut ? 1 : 1 - rp * 0.3} /><path d={`M1600 760 Q1560 ${840 + 140 * rp} ${1520 + 40 * rp} ${880 + 180 * rp}`} stroke="#c8a870" strokeWidth={8} fill="none" opacity={tt > cut ? 1 : 0} /></svg>
    <Drop tt={tt} at={1.8} id="rat" x={1700} y={940 + 40 * rp} w={260} h={500} />
  </Cam>;
}} />;

// m34 · el mensaje en la botella: la botella entra rodando y frena; el corcho salta en arco; el rollo sale y se despliega con el dibujo del dique, el canal y la nutria
const HBottleMessage: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), roll = eio(tt, 0, 1.3), bx = -300 + 1100 * roll, ck = cl((tt - 1.5) / 0.9), un = eio(tt, 2.4, 3.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={820} />
    <Prop id="bottle" x={bx} y={980} w={620} r={-360 * (1 - roll) * 1.4} />
    {ck > 0 && <Prop id="cork" x={bx + 300 + 300 * ck} y={880 - 360 * Math.sin(ck * Math.PI) + 100 * ck} w={90} r={ck * 720} sh={ck >= 1 ? 1 : 0} />}
    {un > 0 && <div style={{ position: "absolute", left: 1180, top: 440, width: 1100 * un, height: 560, transform: `translate(-50%,-50%) rotate(${-4 + 4 * un}deg)`, background: "linear-gradient(90deg,#d8c8a0,#f4ead0 6%,#f4ead0 94%,#d8c8a0)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", overflow: "hidden", borderRadius: 12 }}>
      <div style={{ position: "absolute", inset: 0, opacity: cl(un * 2 - 1) }}><Prop id="concrete_block" x={250} y={420} w={260} sh={0} /><Prop id="canal_piece" x={560} y={430} w={300} sh={0} /><Prop id="nutria_big" x={860} y={430} w={280} sh={0} /></div></div>}
  </Cam>;
}} />;

// m35 · la decisión: la nutria grande cruza arrastrando por la cola el cartel de recompensa atado con soga; detrás la maqueta de dique y canal
const HBountyDecision: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), nx = 2200 - 1700 * eio(tt, 0, d - 0.6), bob = 6 * Math.abs(Math.sin(tt * 6));
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={800} />
    <Prop id="concrete_block" x={420} y={760} w={420} o={0.9} />
    <Prop id="canal_piece" x={1500} y={760} w={480} o={0.9} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${nx + 230} 990 Q${nx + 320} 1030 ${nx + 420} 990`} stroke="#c8a870" strokeWidth={8} fill="none" /></svg>
    <Prop id="wanted_poster" x={nx + 560} y={1040} w={300} r={-80 + 6 * Math.sin(tt * 5)} />
    <div style={{ position: "absolute", left: nx + 420, top: 830, fontFamily: SER, fontWeight: 900, fontSize: 52, color: "#3a2410", transform: "rotate(-80deg)", transformOrigin: "0 0" }}>BOUNTY</div>
    <Prop id="nutria_big" x={nx} y={1000 - bob} w={560} />
  </Cam>;
}} />;

export const HCD4b: Record<string, C> = {
  priceTag: HPriceTag, gasCan: HGasCan, eatOut: HEatOut, aerialGrid: HAerialGrid, tailBounty: HTailBounty, acresFall: HAcresFall, recipeCard: HRecipeCard,
  delawareOverlay: HDelawareOverlay, riverFan: HRiverFan, floodRoof: HFloodRoof, leveeChute: HLeveeChute, rigCanal: HRigCanal, saltWedge: HSaltWedge,
  studyRank: HStudyRank, villainSpot: HVillainSpot, pipeRebuild: HPipeRebuild, dogSearch: HDogSearch, tideMarks: HTideMarks, familyTree: HFamilyTree,
  bottleMessage: HBottleMessage, bountyDecision: HBountyDecision,
};
export const HCD4: Record<string, C> = { ...HCD4a, ...HCD4b };
