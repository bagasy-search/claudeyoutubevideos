// ruth29e · 3ª vuelta (29-oct): jabalíes con objetos FOTORREALES recortados (agnes → rembg, public/img/<slug>/cut) animados por código.
// Un héroe grande y entero, acción física desde el primer segundo, cámara curva, sombra de contacto; la palabra grande vive en la escena.
import React from "react";
import { cl, eio, phys } from "./hkit";
import { Odo, Splash, Sello } from "./obj";
import { S, D, rnd, bt, C, Prop, Puff, Drop, Dust, Cam, Mesa, Agua, Rings, Word, Glow, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#e8b070 0%,#f2d8a8 42%,#8a9a6a 52%,#4a5a2a 100%)";
const NIGHT = "radial-gradient(ellipse at 50% 30%,#1a2230,#05070a 75%)";
const FIELD = "linear-gradient(#c8d0c0 0%,#e8e0c8 40%,#8a7a4a 46%,#4a3a1e 100%)";
// suelo de tierra en perspectiva
const Suelo: React.FC<{ y0?: number; c1?: string; c2?: string }> = ({ y0 = 560, c1 = "#7a5a32", c2 = "#3a2812" }) => <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: `radial-gradient(circle at 30% 30%,rgba(0,0,0,.12) 2px,transparent 3px) 0 0/22px 22px, linear-gradient(${c1},${c2})`, transform: "perspective(900px) rotateX(42deg)", transformOrigin: "50% 0" }} />;
const sil = (o: number) => ({ filter: `brightness(${o}) saturate(.6)` });

// m0 · el campo arado de noche: la rotativa cruza, deja la tierra dada vuelta y cada mata se inclina al pasar
const HRootedRows: C = ({ t, h }) => <S t={t} h={h} bg={FIELD} f={(tt) => {
  const d = D(h), rx = -400 + 2600 * eio(tt, 0.3, d - 0.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Suelo y0={520} c1="#8a7a42" c2="#4a3a1a" />
    <div style={{ position: "absolute", left: 0, top: 640, width: Math.max(0, rx - 100), height: 440, background: "repeating-linear-gradient(180deg,#5a3a1a 0 26px,#3a2410 26px 40px)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.5)" }} />
    {[0, 1, 2].map((row) => Array.from({ length: 9 }, (_, k) => { const x = 60 + k * 230 + row * 60, fall = eio(rx - x, 0, 160); return <Prop key={row + "_" + k} id="corn_plant" x={x} y={700 + row * 150} w={150 + row * 40} r={-80 * fall} o={1 - 0.5 * fall} />; }))}
    <Prop id="rotovator" x={rx} y={960} w={760} r={1.5 * Math.sin(tt * 18)} />
    <Dust tt={tt} at={(tt % 0.5 < 0.05) ? tt - 0.01 : -9} x={rx - 300} y={940} w={260} col="rgba(140,110,70,.8)" />
    {[0, 1, 2].map((k) => <Puff key={k} x={rx - 280 - k * 90} y={900 - 40 * k} r={80 + k * 30} col="rgba(150,120,80,.7)" o={0.6 - k * 0.15} />)}
  </Cam>;
}} />;

// m0-1 · las huellas: desde el arroyo, las pezuñas se hunden de a una en el barro; el jabalí aparece detrás de la última
const HHoofTrail: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 8;
  return <Cam tt={tt} d={d} z={0.07} fx={1300}>
    <Suelo y0={420} c1="#6a4a2a" c2="#2a1a0a" />
    <Agua tt={tt} y0={420} o={0.9} />
    <div style={{ position: "absolute", left: 0, top: 420, width: 520, height: 700, background: "linear-gradient(90deg,transparent,rgba(30,20,10,0) 70%,#4a3218)" }} />
    {Array.from({ length: N }, (_, i) => { const at = 0.3 + i * 0.4, L = land(tt, at, 0, 7, 0.5); return L.on && <Prop key={i} id="mud_track" x={360 + i * 170 + (i % 2) * 40} y={1000 - i * 50 + (i % 2) * 40} w={(170 + i * 8) * (0.7 + 0.3 * L.k)} r={-70 + (i % 2) * 14} sh={0} />; })}
    <Prop id="boar_stand" x={1640 + 60 * (1 - eio(tt, 3.4, 4.4))} y={760} w={620 * eio(tt, 3.2, 4.0) + 1} o={eio(tt, 3.2, 3.8)} />
  </Cam>;
}} />;

// m1 · en el trailer de noche: la rampa con luces rojas; los jabalíes bajan a contraluz con ojos que brillan; uno mira a cámara
const HTrailerNight: C = ({ t, h }) => <S t={t} h={h} bg={NIGHT} f={(tt) => {
  const d = D(h), look = eio(tt, d - 1.6, d - 0.8);
  return <Cam tt={tt} d={d} z={0.08} fx={800}>
    <Suelo y0={700} c1="#2a2018" c2="#0a0806" />
    <Prop id="trailer" x={760} y={760} w={1300} style={sil(0.45)} />
    <Glow x={1360} y={520} r={240} o={0.9} col="255,40,30" /><Prop id="red_light" x={1380} y={560} w={90} sh={0} />
    <Prop id="ramp" x={1560} y={880} w={600} style={sil(0.55)} />
    {[0, 1, 2].map((k) => { const p = cl((tt - 0.4 - k * 0.9) / 1.6); return p <= 0 || p >= 1 ? null : <React.Fragment key={k}><Prop id="boar_run" x={1380 + 560 * p} y={740 + 230 * p} w={420} r={18 * (1 - p)} style={sil(0.35)} />
      <div style={{ position: "absolute", left: 1520 + 560 * p, top: 650 + 230 * p, width: 10, height: 10, borderRadius: "50%", background: "#ffe060", boxShadow: "0 0 14px 6px rgba(255,220,80,.7)" }} /></React.Fragment>; })}
    <Prop id="boar_face" x={420} y={1120 - 80 * look} w={620 * look + 1} o={look} style={{ filter: "brightness(.55)" }} />
    <Glow x={420} y={820} r={300} o={look * 0.5} col="255,60,40" />
  </Cam>;
}} />;

// m2 · el desembarco de 1539: el galeón entero en la bahía; por la plancha bajan los cerdos de a uno y dejan huellas en la arena
const HShipLanding: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c0d0,#e8e0c8 44%,#5a8aa0 50%,#2a4a60)" f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.05} fx={1200}>
    <Agua tt={tt} y0={540} col="#4a7a90" deep="#1a3a50" />
    <Prop id="galleon" x={600} y={720 + 6 * Math.sin(tt * 1.4)} w={1000} sh={0} />
    <div style={{ position: "absolute", left: 960, top: 700, width: 960, height: 400, background: "linear-gradient(#e8d0a0,#c8a870)", clipPath: "polygon(20% 0,100% 0,100% 100%,0 100%)" }} />
    <div style={{ position: "absolute", left: 760, top: 610, width: 520, height: 26, background: "linear-gradient(#a87a48,#5a3a1c)", transform: "rotate(16deg)", transformOrigin: "0 0", boxShadow: "0 10px 10px rgba(0,0,0,.4)" }} />
    {[0, 1, 2, 3].map((k) => { const p = cl((tt - 0.4 - k * 0.8) / 2.2), x = p < 0.45 ? 780 + 460 * (p / 0.45) : 1240 + 500 * ((p - 0.45) / 0.55), y = p < 0.45 ? 620 + 140 * (p / 0.45) : 760 + k * 60 * ((p - 0.45) / 0.55);
      return p <= 0 ? null : <React.Fragment key={k}><Prop id="boar_stand" x={x} y={y + 4 * Math.abs(Math.sin(tt * 8 + k))} w={260} />
        {Array.from({ length: Math.floor(Math.max(0, p - 0.45) * 10) }, (_, j) => <div key={j} style={{ position: "absolute", left: 1260 + j * 50, top: 770 + k * 60 * (j / 5.5), width: 18, height: 12, borderRadius: "50%", background: "rgba(90,60,30,.55)" }} />)}</React.Fragment>; })}
    <Word tt={tt} at={d * 0.5} x={1480} y={300} txt="1539" size={200} col="#fff4d8" />
  </Cam>;
}} />;

// m3 · la marcha por Florida: la piara camina por la arena; el rastro se ensancha y el contador sube con cada año de marcha
const HMarchTrail: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), g = eio(tt, 0.2, d - 0.5), sx = -400 + 2300 * g;
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={560} c1="#e0c898" c2="#a8885a" />
    <div style={{ position: "absolute", left: 0, top: 820 - 60 * g, width: Math.max(0, sx), height: 80 + 220 * g, background: "repeating-linear-gradient(90deg,rgba(120,90,50,.45) 0 14px,transparent 14px 40px)", filter: "blur(1px)" }} />
    {Array.from({ length: 3 + Math.floor(6 * g) }, (_, k) => <Prop key={k} id={k % 3 ? "piglet" : "boar_stand"} x={sx - (k % 4) * 150 - Math.floor(k / 4) * 80} y={860 + (k % 3) * 60 + 4 * Math.abs(Math.sin(tt * 8 + k))} w={k % 3 ? 170 : 300} />)}
    <div style={{ position: "absolute", left: 610, top: 80, width: 700, height: 220, borderRadius: 24, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" }} />
    <Odo x={960} y={190} v={Math.round(13 + 687 * g)} n={3} size={150} />
  </Cam>;
}} />;

// m4 · la muesca en la oreja: la oreja enorme; la pinza cierra en el borde y el triángulo cae con rebote dejando la marca
const HEarNotch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = 1.6, cl1 = eio(tt, 0.4, cut), back = eio(tt, cut + 0.2, cut + 0.9), L = land(tt, cut + 0.1, -260, 8, 0.4);
  return <Cam tt={tt} d={d} z={0.07}>
    <Mesa y0={900} tone="#5a3a22" />
    <Prop id="pig_ear" x={880} y={980} w={900} style={tt > cut ? { clipPath: "polygon(0 0,52% 0,58% 14%,64% 0,100% 0,100% 100%,0 100%)" } : undefined} />
    <Prop id="ear_tag_pliers" x={1500 - 300 * cl1 + 300 * back} y={420 + 60 * cl1 - 60 * back} w={620} r={-130 + 10 * cl1} sh={0} />
    {L.on && <div style={{ position: "absolute", left: 1000 + 160 * L.k, top: 160 + 760 * L.k, width: 0, height: 0, borderLeft: "54px solid transparent", borderRight: "54px solid transparent", borderTop: "120px solid #d89a8a", transform: `rotate(${200 * L.k}deg)`, filter: "drop-shadow(0 8px 6px rgba(0,0,0,.5))" }} />}
  </Cam>;
}} />;

// m5 · al bosque a comer bellotas: robles en tres planos con paralaje; las bellotas caen y rebotan; la piara cruza y se pierde en la niebla
const HAcornForest: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8d4c0,#a8b8a0 50%,#4a5a32 60%,#2a3418)" f={(tt) => {
  const d = D(h), px = -500 + 2600 * eio(tt, 1.2, d - 0.3);
  return <Cam tt={tt} d={d} z={0.05}>
    {[[300, 640, 700, 0.5], [1500, 660, 760, 0.55]].map(([x, y, w, o], k) => <Prop key={k} id="oak_tree" x={x - tt * 10} y={y} w={w} sh={0} style={{ filter: `blur(3px) brightness(${o})` }} />)}
    <Suelo y0={620} c1="#6a5a32" c2="#2a2010" />
    <Prop id="oak_tree" x={1000 - tt * 25} y={900} w={1100} />
    {Array.from({ length: 9 }, (_, k) => <Drop key={k} tt={tt} at={0.2 + k * 0.3} id="acorn" x={300 + k * 170} y={920 + (k % 3) * 40} w={70} h={600} dust={false} />)}
    {Array.from({ length: 5 }, (_, k) => <Prop key={"p" + k} id={k % 2 ? "piglet" : "boar_run"} x={px - k * 180} y={900 + (k % 2) * 50} w={k % 2 ? 180 : 340} o={1 - eio(px - k * 180, 1300, 1900)} />)}
    <div style={{ position: "absolute", left: 1300, top: 500, width: 700, height: 600, background: "linear-gradient(90deg,rgba(220,225,215,0),rgba(220,225,215,.85))", filter: "blur(20px)" }} />
  </Cam>;
}} />;

// m7 · el cerco no aguantó: el panel de alambre al frente; el jabalí embiste, el panel se dobla y cae con polvo
const HBrokenFence: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = 1.5, bx = 1900 - 900 * eio(tt, 0.3, hit), fall = eio(tt, hit, hit + 0.6), push = eio(tt, hit + 0.3, d);
  return <Cam tt={tt} d={d} z={0.06}>
    <Suelo y0={560} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 1000px", transform: `perspective(1400px) rotateX(${-70 * fall}deg)` }}><Prop id="hog_panel" x={760} y={1000} w={1100} /></div>
    <Prop id="boar_run" x={bx - 500 * push} y={940} w={640} flip />
    <Dust tt={tt} at={hit} x={900} y={980} w={600} />
    <Dust tt={tt} at={hit + 0.5} x={700} y={1020} w={700} col="rgba(170,140,100,.85)" />
  </Cam>;
}} />;

// m8 · el híbrido: el chorro rosa y el negro caen al balde y se arremolinan a gris; del balde sube el jabalí de arcilla
const HHybridMix: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), po = eio(tt, 0.2, 0.8), mix = eio(tt, 1.2, 2.6), up = eio(tt, d * 0.55, d * 0.55 + 1.2);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 360, top: 120, height: 1080, transformOrigin: "0 0", transform: `rotate(${-70 * po}deg)` }}><Prop id="paint_bucket_pink" x={-120} y={260} w={360} sh={0} /></div>
    <div style={{ position: "absolute", left: 1560, top: 120, height: 1080, transformOrigin: "0 0", transform: `rotate(${70 * po}deg)` }}><Prop id="paint_bucket_black" x={120} y={260} w={360} sh={0} /></div>
    {po > 0.8 && tt < 2.8 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M560 230 Q820 260 900 640" stroke="#f08aa8" strokeWidth={30} fill="none" strokeLinecap="round" /><path d="M1360 230 Q1100 260 1020 640" stroke="#1a1a1a" strokeWidth={30} fill="none" strokeLinecap="round" /></svg>}
    <div style={{ position: "absolute", left: 960 - 260, top: 620, width: 520, height: 70, borderRadius: "50%", background: `conic-gradient(from ${tt * 200}deg, #f08aa8 ${(1 - mix) * 40}%, #1a1a1a ${50 - mix * 40}%, #808080 50%, #f08aa8 ${90 - mix * 40}%)`, filter: `saturate(${1 - mix})` }} />
    <Prop id="clay_hog" x={960} y={700 - 220 * up} w={520 * up + 1} o={up} sh={0} />
    <Prop id="mixing_bucket" x={960} y={1040} w={640} />
  </Cam>;
}} />;

// m9 · la caza se pone de moda: el tablón cae y se clava; el jabalí de chapa se cuelga y se hamaca; NO LIMIT pintado
const HHuntPoster: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)" f={(tt) => {
  const d = D(h), L = land(tt, 0.2, 700), a = swing(tt, 1.2, 14, 3, 0.6);
  return <Cam tt={tt} d={d} z={0.05}>
    <Luz />
    {L.on && <Prop id="board_sign" x={960} y={860 + L.dy} w={1300} sq={L.sq * 0.3} sh={0} />}
    <div style={{ position: "absolute", left: 960, top: 260 + Math.min(0, L.dy), transform: "translate(-50%,0)", fontFamily: SER, fontWeight: 900, fontSize: 190, color: "#b3221a", mixBlendMode: "multiply", whiteSpace: "nowrap", clipPath: `inset(0 ${100 - 100 * cl((tt - 0.8) / 1.0)}% 0 0)` }}>NO LIMIT</div>
    <div style={{ position: "absolute", left: 960, top: 500, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: -2, top: 0, width: 4, height: 80, background: "#8a8a8a" }} />
      {tt > 1.0 && <Prop id="tin_hog" x={0} y={80 + 300 + Math.min(0, land(tt, 1.0, 400).dy)} w={460} sh={0} />}</div>
  </Cam>;
}} />;

// m10 · el salto de estados: un tablero de focos de marquesina; 17 prenden de golpe y en el salto se encienden los lejanos; el contador llega a 35
const HStateJump: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 45%,#2a2018,#060504 75%)" f={(tt) => {
  const d = D(h), j = d * 0.5, n = tt < 0.6 ? 0 : tt < j ? 17 : 17 + Math.floor(18 * eio(tt, j, j + 1.0));
  return <Cam tt={tt} d={d} z={0.05}>
    {Array.from({ length: 35 }, (_, k) => { const on = k < n, x = 260 + (k % 7) * 230, y = 140 + Math.floor(k / 7) * 160 + (k % 2) * 30; return <React.Fragment key={k}>
      <Glow x={x} y={y + 40} r={110} o={on ? 0.9 : 0} col="255,200,110" /><Prop id="marquee_bulb" x={x} y={y + 110} w={110} sh={0} style={{ filter: on ? "brightness(1.25)" : "brightness(.35) saturate(.4)" }} /></React.Fragment>; })}
    <div style={{ position: "absolute", left: 1640, top: 380, width: 240, height: 200, borderRadius: 20, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />
    <Odo x={1760} y={480} v={n} n={2} size={130} />
    {tt > j && tt < j + 0.4 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,240,200,${0.4 * (1 - (tt - j) / 0.4)})` }} />}
  </Cam>;
}} />;

// m11 · los cerdos no caminan: el jabalí frena al borde de la ruta con el viento en las cerdas; pasa el remolque y aparece del otro lado
const HInterstate: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), tx = 2400 - 3400 * eio(tt, 1.0, d - 0.8), other = tt > 1.0 + (d - 1.8) * 0.55;
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={560} c1="#8a8a5a" c2="#4a4a2a" />
    <div style={{ position: "absolute", left: -200, top: 700, width: 2320, height: 200, background: "linear-gradient(#4a4a4a,#2a2a2a)", transform: "perspective(900px) rotateX(30deg)" }}><div style={{ position: "absolute", left: 0, top: 90, width: 2320, height: 10, background: "repeating-linear-gradient(90deg,#f0d060 0 120px,transparent 120px 220px)" }} /></div>
    {!other && <Prop id="boar_stand" x={500} y={980} w={460} r={-1 + Math.sin(tt * 9)} />}
    {other && <Prop id="boar_stand" x={1500} y={700} w={260} flip />}
    <Prop id="trailer" x={tx} y={900} w={1300} blur={2} />
    <Prop id="pickup" x={tx - 900} y={900} w={800} blur={2} />
  </Cam>;
}} />;

// m12 · el calendario de la cerda: la cerda grande; cada camada cae como bloque de crías; luego las hijas también paren
const HSowCalendar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 0.8), b1 = bt(h, 1, d * 0.35), b2 = bt(h, 2, d * 0.65);
  const pig = (k: number, at: number, x: number, y: number, w = 150) => <Drop key={"p" + at + "_" + k} tt={tt} at={at + k * 0.08} id="piglet" x={x} y={y} w={w} h={500} dust={k === 0} />;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={860} />
    <Prop id="sow" x={460} y={980} w={640} />
    {Array.from({ length: 6 }, (_, k) => pig(k, b0, 900 + (k % 3) * 150, 980 - Math.floor(k / 3) * 70))}
    {Array.from({ length: 6 }, (_, k) => pig(k, b1, 1400 + (k % 3) * 150, 980 - Math.floor(k / 3) * 70))}
    {tt > b2 && [0, 1].map((m) => <React.Fragment key={m}><Drop tt={tt} at={b2 + m * 0.3} id="sow" x={1050 + m * 520} y={700} w={320} />{Array.from({ length: 4 }, (_, k) => pig(k, b2 + 0.8 + m * 0.3, 950 + m * 520 + k * 70, 760, 90))}</React.Fragment>)}
    <Odo x={960} y={200} v={tt < b0 ? 1 : tt < b1 ? 7 : tt < b2 ? 13 : 23} n={2} size={140} />
  </Cam>;
}} />;

// m14 · los dos tercios: nueve jabalíes en fila; seis se van en polvo, la fila vuelve a llenarse sola; 2/3 grande
const HTwoThirds: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), go = d * 0.3, back = d * 0.65;
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={600} />
    {Array.from({ length: 9 }, (_, k) => { const gone = k % 3 !== 0, out = gone ? eio(tt, go + k * 0.08, go + k * 0.08 + 0.4) * (1 - eio(tt, back + k * 0.1, back + k * 0.1 + 0.6)) : 0;
      return <React.Fragment key={k}><Prop id={k % 2 ? "boar_stand" : "piglet"} x={170 + k * 200} y={900 + (k % 2) * 30} w={k % 2 ? 260 : 190} o={1 - out} sh={1 - out} style={{ transform: `scale(${1 - 0.6 * out})`, transformOrigin: "50% 100%" }} />{gone && <Dust tt={tt} at={go + k * 0.08} x={170 + k * 200} y={900} w={140} />}</React.Fragment>; })}
    <Word tt={tt} at={go + 0.4} x={960} y={330} txt="2/3 EVERY YEAR" size={140} />
  </Cam>;
}} />;

// m15 · el trono vacío: el lobo y el puma tallados resbalan y caen; el jabalí sube al trono y la luz cálida baja
const HEmptyThrone: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 30%,#3a2a20,#0a0806 75%)" f={(tt) => {
  const d = D(h), w1 = eio(tt, 0.5, 1.3), p1 = eio(tt, 1.2, 2.0), up = eio(tt, 2.3, 3.0);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={900} tone="#5a3a22" />
    <div style={{ position: "absolute", left: 760, top: 0, width: 400, height: 1000, background: "linear-gradient(rgba(255,230,180,.35),rgba(255,230,180,0))", clipPath: "polygon(35% 0,65% 0,100% 100%,0 100%)", opacity: up }} />
    <Prop id="throne" x={960} y={1000} w={620} />
    <Prop id="wolf_carving" x={420 - 300 * w1} y={1000 + 60 * w1} w={360} r={-80 * w1} />
    <Prop id="puma_carving" x={1500 + 300 * p1} y={1000 + 60 * p1} w={420} r={80 * p1} />
    <Dust tt={tt} at={1.3} x={150} y={1040} w={200} /><Dust tt={tt} at={2.0} x={1800} y={1040} w={200} />
    {tt > 2.0 && <Prop id="boar_stand" x={960} y={800 - 200 * Math.sin(up * Math.PI) * (1 - up) } w={440 * (0.6 + 0.4 * up)} />}
  </Cam>;
}} />;

// m16 · el hocico que cava: la sección de tierra con capas; el hocico se hunde, arrastra las capas y saltan bellota, maní y maíz
const HSnoutDig: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dig = eio(tt, 0.5, 2.0), pops = [["acorn", 80], ["peanuts", 160], ["corn_pile", 180]] as [string, number][];
  return <Cam tt={tt} d={d} z={0.07} fx={800}>
    <Prop id="dirt_block" x={960} y={1050} w={1500} />
    <div style={{ position: "absolute", left: 620, top: 420, width: 520 * dig, height: 120 + 80 * dig, borderRadius: "40% 60% 50% 50%", background: "radial-gradient(ellipse at 50% 30%,#2a1a0a,#4a3018 70%,rgba(74,48,24,0))" }} />
    <Prop id="boar_root" x={420 + 360 * dig} y={620 + 40 * dig} w={760} />
    {pops.map(([id, w], k) => { const p = cl((tt - 1.2 - k * 0.5) / 1.1); return p <= 0 ? null : <Prop key={id} id={id} x={1000 + 260 * p + k * 120} y={500 - 380 * Math.sin(p * Math.PI) + 380 * p} w={w} r={360 * p} />; })}
    {[0, 1, 2].map((k) => <Puff key={k} x={900 + k * 80} y={460 - 40 * k} r={90} col="rgba(110,80,50,.7)" o={dig * (1 - dig) * 2} />)}
  </Cam>;
}} />;

// m17 · el plato de cultivos: maní, arroz, sorgo y sandía en la mesa; el hocico enorme baja y los barre hacia cámara
const HCropPlate: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), items = ["peanuts", "rice_heap", "sorghum", "watermelon"], step = (d - 1.2) / 4;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={800} />
    {items.map((id, k) => { const at = 0.6 + k * step, gone = eio(tt, at + 0.3, at + 0.8); return <React.Fragment key={id}><Prop id={id} x={330 + k * 420} y={940 + 200 * gone} w={360} o={1 - gone} sq={-0.4 * gone} />{gone > 0 && gone < 1 && Array.from({ length: 6 }, (_, j) => <div key={j} style={{ position: "absolute", left: 330 + k * 420 + (j - 3) * 30, top: 960 + 60 * gone + j * 6, width: 12, height: 9, borderRadius: 4, background: "#a8804a", opacity: 1 - gone }} />)}</React.Fragment>; })}
    {(() => { const k = Math.min(3, Math.floor((tt - 0.6) / step)), at = 0.6 + Math.max(0, k) * step, p = eio(tt, at, at + 0.4) * (1 - eio(tt, at + 0.7, at + step)); return <Prop id="boar_face" x={330 + Math.max(0, k) * 420} y={1500 - 560 * p} w={760} sh={0} />; })()}
  </Cam>;
}} />;

// m18 · el medidor del billón: tambores enormes que ruedan hasta 2,500,000,000 con luz roja al frenar
const HBillionMeter: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), v = 2500000000 * eio(tt, 0.3, d - 1.4), st = tt > d - 1.4;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    <div style={{ position: "absolute", left: 140, top: 300, width: 1640, height: 340, borderRadius: 30, background: "linear-gradient(#3a302a,#141010)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.12)", transform: "perspective(1600px) rotateX(10deg)" }} />
    <Odo x={960} y={470} v={v} n={10} size={150} />
    <Glow x={960} y={470} r={700} o={st ? 0.4 + 0.3 * Math.sin(tt * 10) : 0} col="255,60,40" />
    <Prop id="corn_bag" x={1600} y={1040} w={420} /><Prop id="watermelon" x={300} y={1020} w={380} />
    <Word tt={tt} at={d - 1.2} x={960} y={790} txt="EVERY YEAR" size={110} />
  </Cam>;
}} />;

// m19 · los gérmenes: el tubo en su gradilla; un hilo rojo sale y se enrolla al cerdo, a la bolsa de espinaca y a la figura humana
const HGermTag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), T = [[1460, 760], [1000, 900], [560, 820]], step = (d - 1.5) / 3;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={860} />
    <Prop id="test_tube" x={260} y={1000} w={240} />
    <Prop id="pink_pig" x={1460} y={980} w={460} /><Prop id="spinach_bag" x={1000} y={1000} w={360} /><Prop id="wood_figure" x={600} y={1000} w={200} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{T.map(([x, y], k) => { const p = eio(tt, 0.5 + k * step, 0.5 + k * step + 1.0), L = 1600; return <path key={k} d={`M260 640 Q${(260 + x) / 2} ${300 - k * 60} ${x} ${y - 160}`} stroke="#c81e1e" strokeWidth={9} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - p)} strokeLinecap="round" />; })}</svg>
    {T.map(([x, y], k) => <Glow key={k} x={x} y={y - 160} r={140} o={tt > 1.5 + k * step ? 0.5 : 0} col="255,60,60" />)}
  </Cam>;
}} />;

// m20 · la espinaca embolsada: la bolsa grande; baja el sello, la aplasta y deja RECALL en rojo
const HSpinachBag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = d * 0.4, sq = Math.max(0, Math.exp(-4 * (tt - hit)) * (tt > hit ? 1 : 0));
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    <Drop tt={tt} at={0.1} id="spinach_bag" x={960} y={1020} w={820} h={500} />
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.06 * sq},${1 - 0.06 * sq})`, transformOrigin: "960px 1020px" }} />
    <Sello tt={tt} at={hit} x={960} y={600} txt="RECALL" size={170} r={-8} />
  </Cam>;
}} />;

// m21 · el hueco del cerco: el alambrado grande al frente con el boquete doblado; las huellas salen; del otro lado aparece el hocico
const HFenceGap: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), face = eio(tt, d * 0.5, d * 0.5 + 1.2);
  return <Cam tt={tt} d={d} z={0.12} fx={960} fy={700}>
    <Suelo y0={600} />
    <Prop id="boar_face" x={980} y={1060 - 120 * face} w={520 * face + 1} o={face} />
    <Prop id="hog_panel" x={960} y={1060} w={1600} style={{ clipPath: "polygon(0 0,100% 0,100% 100%,62% 100%,60% 62%,50% 52%,40% 64%,38% 100%,0 100%)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2, 3].map((k) => <path key={k} d={`M${780 + k * 60} ${720 + k * 20} q${-30 + k * 20} -60 ${-60 + k * 40} -40`} stroke="#b8bcc0" strokeWidth={6} fill="none" />)}</svg>
    {Array.from({ length: 6 }, (_, k) => tt > 0.4 + k * 0.3 && <Prop key={k} id="mud_track" x={960 + (k % 2 ? 50 : -50)} y={900 + k * 30} w={120 + k * 14} r={-90} sh={0} />)}
  </Cam>;
}} />;

// m22 · el nido saqueado: el nido con huevos moteados; el hocico baja y aplasta uno por uno con cáscara y yema
const HNestRaid: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.2) / 3;
  return <Cam tt={tt} d={d} z={0.07}>
    <Suelo y0={600} c1="#6a5a32" c2="#2a2010" />
    <Prop id="eggs_nest" x={960} y={980} w={1000} />
    {[0, 1, 2].map((k) => { const at = 0.6 + k * step, p = eio(tt, at, at + 0.35) * (1 - eio(tt, at + 0.6, at + step)), hit = tt > at + 0.35; return <React.Fragment key={k}>
      {hit && <div style={{ position: "absolute", left: 760 + k * 170, top: 780, width: 120, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%,#f0b020 30%,#f8f0d0 34%,rgba(248,240,208,0) 70%)" }} />}
      {hit && <Dust tt={tt} at={at + 0.35} x={820 + k * 170} y={800} w={90} col="rgba(250,245,230,.9)" />}
      {p > 0.01 && <Prop id="boar_face" x={820 + k * 170} y={300 + 520 * p} w={560} sh={0} style={{ transform: "rotate(180deg)" }} />}</React.Fragment>; })}
  </Cam>;
}} />;

// m23 · el roble que no llega: la bellota abre y brota en cámara rápida; el hocico baja y la arranca
const HOakStop: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 0.2, d * 0.55), pull = eio(tt, d * 0.6, d * 0.6 + 0.6);
  return <Cam tt={tt} d={d} z={0.08} fy={700}>
    <Suelo y0={700} c1="#5a4228" c2="#2a1a0a" />
    <Prop id="acorn_sprout" x={960 + 140 * pull} y={900 - 300 * pull} w={(260 + 380 * g) * (1 - 0.3 * pull)} r={50 * pull} />
    <Prop id="boar_root" x={1400 - 300 * eio(tt, d * 0.45, d * 0.6) + 200 * pull} y={900} w={760} flip />
    <Dust tt={tt} at={d * 0.6} x={960} y={900} w={300} col="rgba(110,80,50,.85)" />
  </Cam>;
}} />;

// m24 · la recompensa: las siluetas de chapa caen de a una con chispa; los fáciles caen, los listos asoman detrás del fardo; el número sube
const HBountyBoard: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.0), b1 = bt(h, 1, d * 0.6), more = eio(tt, b1, b1 + 1.5);
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={700} />
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 22, background: "linear-gradient(#8a8a8a,#4a4a4a)" }} />
    {[0, 1, 2, 3, 4].map((k) => { const at = b0 + k * 0.4, f = eio(tt, at, at + 0.3); return <React.Fragment key={k}><div style={{ position: "absolute", left: 320 + k * 320, top: 322, height: 1080, transformOrigin: "0 0", transform: `rotate(${swing(tt, 0, 4, 2, 0.2)}deg) perspective(900px) rotateX(${-90 * f}deg)` }}><Prop id="tin_hog" x={0} y={320} w={260} sh={0} /></div>
      {tt > at && tt < at + 0.25 && <Glow x={320 + k * 320} y={430} r={80} col="255,230,140" />}</React.Fragment>; })}
    <Prop id="hay_bale" x={1500} y={1020} w={600} />
    {[0, 1].map((k) => <Prop key={k} id="piglet" x={1340 + k * 300} y={830 - 80 * eio(tt, b0 + 2 + k * 0.4, b0 + 2.6 + k * 0.4)} w={200} />)}
    {more > 0 && Array.from({ length: 6 }, (_, k) => <Prop key={"m" + k} id="piglet" x={200 + k * 170} y={980 + (k % 2) * 30} w={170 * more + 1} o={more} />)}
  </Cam>;
}} />;

// m25 · desde el helicóptero: el helicóptero cruza con su sombra sobre el campo; la piara corre en estampida al monte
const HHeliView: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8c8d8,#e0e4e0 40%,#8a9a5a 46%,#4a5a2a)" f={(tt) => {
  const d = D(h), hx = -500 + 2800 * eio(tt, 0, d), run = eio(tt, 0.8, d);
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={500} c1="#8a9a52" c2="#4a5a2a" />
    {[0, 1, 2, 3].map((k) => <Prop key={k} id="oak_tree" x={1400 + k * 180} y={620 + k * 10} w={360} style={{ filter: "brightness(.8)" }} />)}
    <div style={{ position: "absolute", left: hx - 200, top: 900, width: 400, height: 60, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(10px)" }} />
    {Array.from({ length: 7 }, (_, k) => <Prop key={k} id={k % 3 ? "piglet" : "boar_run"} x={400 + k * 110 + 900 * run + (k % 2) * 40} y={880 - (k % 3) * 40 - 120 * run} w={(k % 3 ? 160 : 300) * (1 - 0.4 * run)} o={1 - eio(run, 0.85, 1)} />)}
    <Prop id="helicopter" x={hx} y={360 + 20 * Math.sin(tt * 2)} w={620} sh={0} />
  </Cam>;
}} />;

// m26 · la piara se dispersa: el taco golpea la blanca, el triángulo de bolas-jabalí estalla y ruedan a las troneras
const HScatterBurst: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hit = 1.0, cb = eio(tt, 0.3, hit), sc = cl((tt - hit) / 1.6);
  const balls = Array.from({ length: 10 }, (_, k) => { const row = k < 1 ? 0 : k < 3 ? 1 : k < 6 ? 2 : 3, col = k - [0, 1, 3, 6][row]; return { x: 1180 + row * 70, y: 540 + (col - row / 2) * 80, a: (k * 47 + 20) * Math.PI / 180 }; });
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 60, top: 160, width: 1800, height: 820, borderRadius: 40, background: "radial-gradient(ellipse,#2a7a3a,#145024)", boxShadow: "inset 0 0 0 40px #5a3218, inset 0 0 0 46px #2a1408, 0 30px 40px rgba(0,0,0,.6)" }} />
    {[[110, 210], [960, 190], [1810, 210], [110, 930], [960, 950], [1810, 930]].map(([x, y], k) => <div key={k} style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: "50%", background: "#050505" }} />)}
    {balls.map((b, k) => { const r = 700 * (1 - Math.exp(-2.4 * sc)); return <div key={k} style={{ position: "absolute", left: b.x + Math.cos(b.a) * r - 40, top: b.y + Math.sin(b.a) * r * 0.6 - 40, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#8a6a4a,#3a2414 70%)", boxShadow: "0 8px 10px rgba(0,0,0,.5)", opacity: 1 - eio(sc, 0.8, 1) * (k % 3 ? 1 : 0) }}><Prop id="piglet" x={40} y={66} w={56} sh={0} /></div>; })}
    <Prop id="cue_ball" x={400 + 700 * cb - 200 * eio(tt, hit, hit + 0.6)} y={600} w={80} sh={0} />
    <Prop id="pool_cue" x={-200 + 700 * cb} y={620} w={900} sh={0} r={-3} />
  </Cam>;
}} />;

// m27 · el comedero con veneno: el comedero de chapa; el jabalí levanta la tapa pesada con el hocico; el mapache no puede y cae; el mazo golpea
const HBaitFeeder: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.0), b1 = bt(h, 1, d * 0.62), lid = eio(tt, b0, b0 + 0.8) * (1 - eio(tt, b0 + 2.0, b0 + 2.3)), rc = cl((tt - b0 - 2.3) / 1.0);
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={640} />
    <Prop id="feeder" x={800} y={1000} w={760} />
    <div style={{ position: "absolute", left: 470, top: 470, width: 660, height: 40, background: "linear-gradient(#c8ccd0,#7a8086)", transformOrigin: "0 100%", transform: `rotate(${-38 * lid}deg)`, boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} />
    <Prop id="boar_stand" x={1300} y={1000 - 30 * lid} w={600} flip r={-6 * lid} />
    {rc > 0 && <Prop id="raccoon" x={520} y={880 - 120 * Math.sin(Math.min(1, rc * 2) * Math.PI / 2) + 260 * eio(rc, 0.5, 1)} w={260} r={-40 * eio(rc, 0.5, 1)} />}
    {tt > b1 && <Drop tt={tt} at={b1} id="gavel" x={1500} y={760} w={520} h={600} />}
  </Cam>;
}} />;

// m29 · la foto de la familia: la cámara de fuelle; destello de magnesio con humo; la foto sepia de la piara entera cae sobre la mesa
const HSounderFamily: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fl = 1.0, f = Math.exp(-6 * Math.max(0, tt - fl)) * (tt > fl ? 1 : 0), L = land(tt, fl + 1.0, 500);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={860} />
    <Prop id="camera_bellows" x={460} y={980} w={560} />
    <Prop id="flash_pan" x={640} y={420} w={300} r={-10} sh={0} />
    {[0, 1, 2].map((k) => <Puff key={k} x={640 + k * 60} y={340 - 140 * cl(tt - fl) - k * 40} r={90 + 80 * cl(tt - fl)} col="rgba(230,230,225,.8)" o={tt > fl ? 0.7 * (1 - cl((tt - fl) / 3)) : 0} />)}
    {L.on && <div style={{ position: "absolute", left: 1250, top: 600 + L.dy, width: 800, height: 520, transform: `translate(-50%,-50%) rotate(${4 - 2 * L.k}deg)`, background: "#f4ecd8", padding: 24, boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "relative", width: 752, height: 472, background: "linear-gradient(#cfc0a0,#9a8a6a)", overflow: "hidden", filter: "sepia(1) contrast(1.1)" }}><Prop id="sounder" x={376} y={430} w={680} sh={0} /></div></div>}
    {f > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,250,${0.9 * f})` }} />}
  </Cam>;
}} />;

// m30 · desconfiado: el hocico en primer plano con la sombra de los barrotes; retrocede con las orejas atrás
const HTrapShy: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), back = eio(tt, d * 0.45, d * 0.45 + 1.0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Suelo y0={640} c1="#5a4a2a" c2="#1a1408" />
    <Prop id="boar_face" x={960 + 80 * back} y={1180 - 260 * back} w={1100 * (1 - 0.45 * back)} />
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 120px,rgba(0,0,0,.55) 120px 160px)", mixBlendMode: "multiply", transform: `translateX(${-30 * back}px)` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 60, background: "linear-gradient(#5a5e62,#2a2e32)", opacity: 1 - back }} />
  </Cam>;
}} />;

// m31 · la trampa corral: el corral redondo; el maíz adentro, la cámara se enciende, entran de a uno y cae la guillotina
const HCorralGate: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 0.6), b1 = bt(h, 1, d * 0.35), b2 = bt(h, 2, d * 0.75), g = land(tt, b2, 520, 10, 0.3);
  return <Cam tt={tt} d={d} z={0.06}>
    <Suelo y0={560} />
    <Prop id="cast_net" x={960} y={920} w={1300} />
    {tt > b0 && <Drop tt={tt} at={b0} id="corn_pile" x={960} y={860} w={360} h={400} />}
    <Prop id="fence_post" x={1700} y={1000} w={120} />
    {tt > b1 && <><Prop id="trail_cam" x={1700} y={640} w={150} sh={0} /><Glow x={1700} y={600} r={50} o={0.6 + 0.4 * Math.sin(tt * 8)} col="255,40,30" /></>}
    {[0, 1, 2, 3].map((k) => { const p = eio(tt, b1 + 0.4 + k * 0.5, b1 + 1.6 + k * 0.5); return p > 0 && <Prop key={k} id={k % 2 ? "piglet" : "boar_stand"} x={300 + 520 * p + k * 60} y={900 - 20 * k} w={k % 2 ? 180 : 320} />; })}
    {g.on && <Prop id="guillotine_gate" x={340} y={940 + g.dy} w={380} sq={g.sq * 0.3} />}
    <Dust tt={tt} at={b2 + 0.1} x={340} y={940} w={260} />
  </Cam>;
}} />;

// m32 · la cámara de trampa: el teléfono inclinado con la foto infrarroja; cada jabalí se marca con una chapita; la última dice ALL IN
const HTrailCam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), z = eio(tt, 0.2, 1.0), xs = [-220, -80, 60, 200];
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 960, top: 520, width: 1100, height: 640, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${14 - 10 * z}deg) rotate(${-4 + 3 * z}deg) scale(${0.8 + 0.2 * z})`, borderRadius: 50, background: "#0c0c0c", boxShadow: "0 40px 50px rgba(0,0,0,.6), inset 0 0 0 4px #3a3a3a", padding: 30 }}>
      <div style={{ position: "relative", width: 1040, height: 580, borderRadius: 24, overflow: "hidden", background: "radial-gradient(ellipse,#5a5a5a,#1a1a1a)", filter: "grayscale(1) contrast(1.2) brightness(1.1)" }}>
        <Prop id="sounder" x={520} y={520} w={900} sh={0} />
        {xs.map((x, k) => { const L = land(tt, 1.2 + k * 0.5, 200); return L.on && <div key={k} style={{ position: "absolute", left: 520 + x * 1.6 - 34, top: 230 + L.dy, width: 68, height: 68, borderRadius: "50%", background: "#e8c040", border: "4px solid #8a6a1a", fontFamily: SER, fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "60px", color: "#3a2a0a" }}>{k + 1}</div>; })}
      </div></div>
    <Word tt={tt} at={d - 1.2} x={960} y={520} txt="ALL IN" size={220} col="#7aff7a" />
  </Cam>;
}} />;

// m33 · el programa nacional: la soga en catenaria con faroles; se apagan de a uno con voluta de humo; al final cae la chapa
const HProgramMap: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#1a1e2a,#05060a 75%)" f={(tt) => {
  const d = D(h), N = 6, step = (d - 1.5) / N;
  return <Cam tt={tt} d={d} z={0.05}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M-20 200 Q960 520 1940 200" stroke="#8a7a5a" strokeWidth={8} fill="none" /></svg>
    {Array.from({ length: N }, (_, k) => { const x = 220 + k * 296, y = 200 + 320 * (1 - Math.pow((x - 960) / 980, 2)) * 0.96, off = tt > 1 + k * step, a = swing(tt, 0, 5, 1.6 + k * 0.1, 0.05);
      return <div key={k} style={{ position: "absolute", left: x, top: y, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
        <Glow x={0} y={160} r={160} o={off ? 0 : 0.9} col="255,190,90" />
        <Prop id="lantern" x={0} y={260} w={150} sh={0} style={{ filter: off ? "brightness(.4)" : "brightness(1.1)" }} />
        {off && <Puff x={10} y={120 - 120 * cl((tt - 1 - k * step) / 1.5)} r={40 + 40 * cl((tt - 1 - k * step) / 1.5)} col="rgba(200,200,200,.6)" o={1 - cl((tt - 1 - k * step) / 1.5)} />}</div>; })}
    <Drop tt={tt} at={d - 0.9} id="board_sign" x={960} y={1000} w={420} />
  </Cam>;
}} />;

// m34 · los cercos no los paran: la maqueta de parcelas vista desde arriba; la piara cruza los cercos; la trampa cae sobre una parcela y sólo esa se vacía
const HPropertyLines: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), px = -300 + 2400 * eio(tt, 0.2, d * 0.6), cage = land(tt, d * 0.62, 600);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 80, top: 200, width: 1760, height: 820, transform: "perspective(1400px) rotateX(46deg)", transformOrigin: "50% 100%", background: "#7a8a42" }}>
      {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: k * 440, top: 0, width: 440, height: 820, background: k % 2 ? "#8a9a4a" : "#6a7a3a", boxShadow: "inset -10px 0 0 #a8865a" }} />)}
    </div>
    {Array.from({ length: 6 }, (_, k) => { const x = px - (k % 3) * 160, inCage = cage.on && x > 940 && x < 1360; return (!inCage || tt < d * 0.62) && <Prop key={k} id="clay_hog" x={x} y={760 + Math.floor(k / 3) * 140} w={220} />; })}
    {cage.on && <Prop id="cast_net" x={1150} y={940 + cage.dy} w={560} sq={cage.sq * 0.3} />}
  </Cam>;
}} />;

// m35 · los vecinos del arroyo: las casitas a lo largo del arroyo; el agua llena el cauce y cada casa prende el farol del porche al tocarla
const HCreekNeighbors: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), fill = eio(tt, 0.3, d - 0.8), H5 = [[260, 700], [640, 780], [1020, 700], [1400, 790], [1760, 710]];
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={560} c1="#7a8a4a" c2="#3a4a22" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M-20 900 C300 820 500 980 900 900 S1500 820 1940 920" stroke="#2a4a5a" strokeWidth={70} fill="none" opacity={0.5} /><path d="M-20 900 C300 820 500 980 900 900 S1500 820 1940 920" stroke="#5a9ab0" strokeWidth={56} fill="none" strokeDasharray={2400} strokeDashoffset={2400 * (1 - fill)} /></svg>
    {H5.map(([x, y], k) => { const on = fill * 1960 > x; return <React.Fragment key={k}><Prop id="farmhouse" x={x} y={y} w={300} /><Glow x={x + 60} y={y - 80} r={80} o={on ? 0.9 : 0} col="255,210,120" /></React.Fragment>; })}
  </Cam>;
}} />;

// m36 · el alambre eléctrico: el poste con el aislador; el jabalí toca el alambre con el hocico, chispa azul y salta atrás
const HHotWire: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), z = 1.6, app = eio(tt, 0.2, z), jump = eio(tt, z, z + 0.5), sp = tt > z && tt < z + 0.3;
  return <Cam tt={tt} d={d} z={0.06}>
    <Suelo y0={600} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M0 620 L1920 ${600 + (sp ? 8 * Math.sin(tt * 90) : 0)}`} stroke="#c8ccd0" strokeWidth={5} /></svg>
    <Prop id="spark_insulator" x={420} y={1000} w={360} />
    <Prop id="boar_face" x={1180 + 300 * jump} y={1140 - 140 * app + 120 * jump} w={760 * (1 - 0.3 * jump)} r={10 * jump} />
    {sp && <><Glow x={1180} y={620} r={220} col="120,180,255" /><svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M1180 620 l${(rnd(k + tt) - 0.5) * 160} ${(rnd(k + 3 + tt) - 0.5) * 160} l${(rnd(k + 7) - 0.5) * 120} ${(rnd(k + 9) - 0.5) * 120}`} stroke="#e0f0ff" strokeWidth={4} fill="none" />)}</svg></>}
  </Cam>;
}} />;

// m37 · cambio de héroe: la caja de herramientas; el helicóptero de juguete sale volando; entran la cámara, la bolsa de maíz y el apretón de manos
const HHeroSwap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), out = cl((tt - 0.5) / 1.0);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={860} />
    <Prop id="toolbox" x={960} y={1030} w={820} />
    {out > 0 && out < 1 && <Prop id="toy_heli" x={960 + 900 * out} y={700 - 600 * Math.sin(out * Math.PI / 2)} w={360} r={-30 * out} sh={0} />}
    <Drop tt={tt} at={1.6} id="trail_cam" x={700} y={800} w={180} h={600} />
    <Drop tt={tt} at={2.1} id="corn_bag" x={1000} y={820} w={300} h={600} />
    <Drop tt={tt} at={2.6} id="handshake" x={1300} y={800} w={420} h={600} />
  </Cam>;
}} />;

// m38 · prohibido trasladar: tres tuercas de cromo; la llave baja y gira cada una; el sello FINE cae con rebote
const HNoTransport: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), step = (d - 1.6) / 3, k = Math.min(2, Math.max(0, Math.floor((tt - 0.4) / step))), u = cl((tt - 0.4 - k * step) / step);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={820} />
    <Prop id="trailer" x={960} y={760} w={1300} o={0.55} style={{ filter: "blur(3px) brightness(.6)" }} />
    {[0, 1, 2].map((j) => <Prop key={j} id="chrome_nut" x={500 + j * 460} y={1000} w={260} r={j < k || (j === k && u > 0.3) ? 60 * (j === k ? eio(u, 0.3, 0.8) : 1) : 0} />)}
    <Prop id="wrench" x={500 + k * 460 + 120} y={880 - 60 * Math.sin(u * Math.PI)} w={640} r={-20 + 60 * eio(u, 0.3, 0.8)} sh={0} />
    <Sello tt={tt} at={d - 1.0} x={960} y={400} txt="FINE" size={200} />
  </Cam>;
}} />;

// m39 · año por año: la bandeja de barro; una pezuña se hunde por año y se ilumina con el año grande
const YRS = ["1700s", "1912", "1980s", "2006", "2011", "2014", "2017", "TODAY"];
const HHogTrack: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), B = YRS.map((_, i) => bt(h, i, 0.5 + i * 2.4)), cur = B.filter((b) => tt >= b).length - 1;
  return <Cam tt={tt} d={d} z={0.05}>
    <Suelo y0={380} c1="#6a4a2a" c2="#2a1a0a" />
    {YRS.map((y, i) => i > cur ? null : <React.Fragment key={y}>
      <Prop id="mud_track" x={240 + i * 210} y={960 - (i % 2) * 120} w={170 * (0.7 + 0.3 * land(tt, B[i], 0, 7, 0.5).k)} r={-60} sh={0} style={{ filter: i === cur ? "brightness(1.4)" : "brightness(.8)" }} />
      {i === cur && <Glow x={240 + i * 210} y={900 - (i % 2) * 120} r={160} o={0.7} />}</React.Fragment>)}
    {cur >= 0 && <Word key={cur} tt={tt} at={B[cur]} x={960} y={300} txt={YRS[cur]} size={210} />}
    <Prop id="boar_stand" x={240 + Math.max(0, cur) * 210 + 220} y={860} w={360} />
  </Cam>;
}} />;

// m40 · preguntas: el fichero de tarjetas; la ficha cae al frente y se escribe la respuesta; el colmillo cae encima
const HTuskCards: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 1.0), fl = eio(tt, b0, b0 + 0.6), ans = "Yes. Give them room.", n = Math.floor(cl((tt - b0 - 0.8) / 2.4) * ans.length);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={880} />
    <Prop id="rolodex" x={560} y={1000} w={700} />
    {fl > 0 && <div style={{ position: "absolute", left: 1220, top: 520, width: 860, height: 520, transform: `translate(-50%,-50%) perspective(1500px) rotateX(${70 * (1 - fl)}deg) rotate(${-3 * fl}deg)`, transformOrigin: "50% 100%", background: "repeating-linear-gradient(180deg,transparent 0 60px,rgba(80,120,200,.3) 60px 62px), linear-gradient(#fbf6ea,#eee2c4)", boxShadow: "0 30px 40px rgba(0,0,0,.5)", borderTop: "8px solid #c84a3a" }}>
      <div style={{ position: "absolute", left: 50, top: 130, width: 760, fontFamily: "'Segoe Print', 'Comic Sans MS', cursive", fontSize: 92, lineHeight: 1.3, color: "#1a2a6a" }}>{ans.slice(0, n)}</div></div>}
    <Drop tt={tt} at={d - 1.4} id="tusk" x={1500} y={790} w={360} r={-20} h={500} />
  </Cam>;
}} />;

// m41 · todo en un minuto: la rampa inclinada; bajan deslizando el cerdo, el galeón, el corral y la cámara; la puerta del remolque se cierra
const HTrailerRecap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), its = ["pink_pig", "galleon", "cast_net", "trail_cam", "boar_stand"], step = (d - 2) / its.length, door = eio(tt, d - 1.4, d - 0.9);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 200, top: 300, width: 1300, height: 40, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.15) 0 4px,transparent 4px 90px), linear-gradient(#c89a62,#7a5230)", transform: "rotate(18deg)", transformOrigin: "0 0", boxShadow: "0 16px 20px rgba(0,0,0,.45)" }} />
    {its.map((id, k) => { const p = eio(tt, 0.3 + k * step, 0.3 + k * step + 1.0); return p > 0 && <Prop key={id} id={id} x={240 + 1100 * p - 0} y={290 + 360 * p + (p >= 1 ? 0 : 0)} w={260} r={18 * (1 - p)} style={{ transform: `translateX(${p >= 1 ? 120 + k * 40 : 0}px)` }} />; })}
    <div style={{ position: "absolute", left: 1500, top: 300, width: 380, height: 620, background: "linear-gradient(90deg,#9aa0a6,#d8dce0,#8a9096)", transformOrigin: "100% 50%", transform: `perspective(1400px) rotateY(${-80 * (1 - door)}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    <Dust tt={tt} at={d - 0.9} x={1690} y={920} w={300} />
  </Cam>;
}} />;

// m42 · el volante: el espejo convexo con la piara acercándose; el volante gira con peso
const HSteeringWheel: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8b0b8,#5a6068)" f={(tt) => {
  const d = D(h), b0 = bt(h, 0, d * 0.6), near = eio(tt, 0.2, b0), rot = 40 * eio(tt, b0, b0 + 0.8) + swing(tt, b0 + 0.8, 8, 4, 1.5);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 0, top: 640, width: 1920, height: 440, background: "linear-gradient(#2a2a2a,#0a0a0a)" }} />
    <div style={{ position: "absolute", left: 1180, top: 120, width: 560, height: 560, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(#c8d0d8,#8a7a4a 55%,#5a4a2a)", boxShadow: "0 0 0 18px #c8ccd0, 0 0 0 26px #6a6e72, 0 30px 40px rgba(0,0,0,.5)" }}>
      <Prop id="sounder" x={280} y={420 + 60 * near} w={200 + 420 * near} sh={0} /></div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 860px", transform: `rotate(${rot}deg)` }}><Prop id="steering_wheel" x={760} y={1240} w={900} sh={0} /></div>
  </Cam>;
}} />;

export const HCE4: Record<string, C> = {
  rootedRows: HRootedRows, hoofTrail: HHoofTrail, trailerNight: HTrailerNight, shipLanding: HShipLanding, marchTrail: HMarchTrail, earNotch: HEarNotch,
  acornForest: HAcornForest, brokenFence: HBrokenFence, hybridMix: HHybridMix, huntPoster: HHuntPoster, stateJump: HStateJump, interstate: HInterstate,
  sowCalendar: HSowCalendar, twoThirdsGauge: HTwoThirds, emptyThrone: HEmptyThrone, snoutDig: HSnoutDig, cropPlate: HCropPlate, billionMeter: HBillionMeter,
  germTag: HGermTag, spinachBag: HSpinachBag, fenceGap: HFenceGap, nestRaid: HNestRaid, oakStop: HOakStop, bountyBoard: HBountyBoard, heliView: HHeliView,
  scatterBurst: HScatterBurst, baitFeeder: HBaitFeeder, sounderFamily: HSounderFamily, trapShy: HTrapShy, corralGate: HCorralGate, trailCam: HTrailCam,
  programMap: HProgramMap, propertyLines: HPropertyLines, creekNeighbors: HCreekNeighbors, hotWire: HHotWire, heroSwap: HHeroSwap, noTransport: HNoTransport,
  hogTrack: HHogTrack, tuskCards: HTuskCards, trailerRecap: HTrailerRecap, steeringWheel: HSteeringWheel,
};
