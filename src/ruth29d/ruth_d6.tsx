// ruth29d · 5ª vuelta (29-oct): los que quedaron ≤6 en la ronda 4. Todo entero en cuadro, objetos apoyados con sombra, acción visible desde 0,7 s.
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { Odo, Splash, Sello, Puff } from "./obj";
import { S, D, rnd } from "./ruth_d3";
import { Prop, Drop, Dust, Cam, Mesa, Agua, Rings, Glow, Luz, land, swing, SER } from "./pk";

const bt = (h: H, i: number, d: number) => h.bt?.[i] ?? d;
type C = React.FC<{ t: number; h: H }>;
const WALL = "repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)";
const MUD = "linear-gradient(rgba(120,88,48,.86),rgba(72,52,30,.96))";

// m12 · la cuenta en chapas: aro de alambre grueso del clavo; cada chapa redonda numerada cae, se enhebra y hamaca el aro; la 12 sale hacia la derecha y crece sin tapar el aro
const HTrapCount: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), N = 7, NUM = [3, 5, 6, 8, 9, 11, 12], at = (i: number) => 0.25 + i * (d - 2.4) / N, a = Array.from({ length: N }, (_, i) => swing(tt, at(i) + 0.25, 7, 3.2, 1.1)).reduce((x, y) => x + y, 0), fly = eio(tt, d - 1.8, d - 0.7);
  const Tag: React.FC<{ n: number; s: number }> = ({ n, s }) => <div style={{ position: "absolute", left: -60 * s, top: 0, width: 120 * s, height: 120 * s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f8dc8a,#c8952c 55%,#7a5214)", boxShadow: `0 ${10 * s}px ${14 * s}px rgba(0,0,0,.55), inset 0 -${4 * s}px ${6 * s}px rgba(0,0,0,.35)` }}>
    <div style={{ position: "absolute", left: 48 * s, top: 8 * s, width: 24 * s, height: 24 * s, borderRadius: "50%", background: "#2a1c10", boxShadow: "inset 0 3px 4px #000" }} />
    <div style={{ position: "absolute", left: 0, top: 36 * s, width: 120 * s, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 62 * s, color: "#4a2e08", textShadow: "0 2px 0 rgba(255,235,180,.6)" }}>{n}</div></div>;
  return <Cam tt={tt} d={d} z={0.04} fy={420}>
    <Luz />
    <div style={{ position: "absolute", left: 900, top: 150, width: 120, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 944, top: 140, width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#8a8a8a,#2a2a2a)", boxShadow: "0 6px 8px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960, top: 156, height: 1080, transformOrigin: "0 0", transform: `rotate(${a}deg)` }}>
      <svg width={600} height={600} style={{ position: "absolute", left: -300, top: -10, overflow: "visible" }}>
        <ellipse cx={300} cy={300} rx={250} ry={250} stroke="rgba(0,0,0,.45)" strokeWidth={30} fill="none" transform="translate(10,22)" />
        <ellipse cx={300} cy={300} rx={250} ry={250} stroke="#5a5e62" strokeWidth={24} fill="none" />
        <ellipse cx={300} cy={300} rx={250} ry={250} stroke="rgba(230,235,240,.7)" strokeWidth={5} fill="none" strokeDasharray="200 90" transform="translate(-5,-6)" /></svg>
      {Array.from({ length: N }, (_, i) => { const L = land(tt, at(i), 520), ang = (228 + i * 14) * Math.PI / 180, last = i === N - 1; if (!L.on) return null;
        const x = Math.cos(ang) * 250, y = 290 - Math.sin(ang) * 250 + 4, s = last ? 1.4 + 1.0 * fly : 1.4, sw = swing(tt, at(i) + 0.15, 22, 5, 1.6);
        return <div key={i} style={{ position: "absolute", left: x + (last ? 420 * fly : 0), top: y + L.dy - (last ? 60 * fly : 0), transformOrigin: "0 0", transform: `rotate(${sw - a * (last ? fly : 0)}deg)` }}><Tag n={NUM[i]} s={s} /></div>; })}
    </div>
  </Cam>;
}} />;

// m10 · la cosecha por década: báscula de campo de hierro con plataforma de madera y resorte; fardos atados caen y comprimen el resorte; la aguja sube; con los 70 la pila desborda y dos ruedan; etiqueta de cartón con la década
const HHarvestBars: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), Y = ["1940s", "1950s", "1960s", "1970s"], CNT = [1, 2, 3, 6], step = (d - 1.0) / 4, k = Math.min(3, Math.max(0, Math.floor((tt - 0.2) / step))), k0 = 0.2 + k * step;
  const n = CNT[k], landed = Array.from({ length: n }, (_, i) => tt > k0 + i * 0.28 + 0.3 ? 1 : 0).reduce((x: number, y) => x + y, 0), w8 = Math.min(5, landed) / 5, comp = 70 * w8 + swing(tt, k0 + 0.3 + (landed - 1) * 0.28, 5, 9, 2);
  const pY = 760 + comp, tag = swing(tt, k0, 8, 4, 1.5);
  const POS = [[700, 0], [940, 0], [1180, 0], [820, 1], [1060, 1], [940, 2]];
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={900} tone="#6a4a2c" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M940 ${pY + 60} ${Array.from({ length: 7 }, (_, j) => `L${j % 2 ? 900 : 980} ${pY + 60 + (j + 1) * (940 - pY - 60) / 7}`).join(" ")}`} stroke="#3a3e42" strokeWidth={16} fill="none" strokeLinejoin="round" />
      <path d={`M940 ${pY + 60} ${Array.from({ length: 7 }, (_, j) => `L${j % 2 ? 900 : 980} ${pY + 60 + (j + 1) * (940 - pY - 60) / 7}`).join(" ")}`} stroke="rgba(220,225,230,.5)" strokeWidth={4} fill="none" transform="translate(-3,-3)" /></svg>
    <div style={{ position: "absolute", left: 560, top: 930, width: 760, height: 40, borderRadius: 6, background: "linear-gradient(#5a5e62,#2a2e32)", boxShadow: "0 16px 20px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 540, top: pY, width: 800, height: 60, borderRadius: 6, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 3px,transparent 3px 100px), linear-gradient(#b8844a,#7a5228)", boxShadow: "0 20px 22px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,230,190,.4)" }} />
    {Array.from({ length: n }, (_, i) => { const at = k0 + i * 0.28, L = land(tt, at, 650), [x, row] = POS[i]; if (!L.on) return null; return <div key={k + "_" + i}>
      <Prop id="pelt_bale" x={x} y={pY + 4 - row * 200 + L.dy} w={250} sq={L.sq} />
      {L.k > 0.95 && <Dust tt={tt} at={at + 0.3} x={x} y={pY + 4 - row * 200} w={160} />}</div>; })}
    {k === 3 && [0, 1].map((j) => { const p = cl((tt - (k0 + 1.9 + j * 0.35)) / 1.1); return p > 0 && <Prop key={j} id="pelt_bale" x={j ? 560 - 380 * p : 1320 + 380 * p} y={pY - 200 + (360 - 80 * Math.sin(p * Math.PI)) * Math.min(1, p * 1.4)} w={240} r={(j ? -1 : 1) * 300 * p} />; })}
    <div style={{ position: "absolute", left: 1500, top: 220, width: 30, height: 720, background: "linear-gradient(90deg,#2a2e32,#7a7e82,#2a2e32)" }} />
    <div style={{ position: "absolute", left: 1335, top: 170, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea 60%,#d8ccb0)", border: "18px solid #4a4e52", boxShadow: "0 24px 36px rgba(0,0,0,.55)" }}>
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ position: "absolute", left: 160, top: 14, width: 4, height: 30, background: "#2a2a2a", transformOrigin: "2px 166px", transform: `rotate(${-120 + j * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 156, top: 30, width: 12, height: 150, borderRadius: 6, background: "#c41e1e", transformOrigin: "6px 144px", transform: `rotate(${-120 + 240 * w8 + comp * 0.1 - 7 * w8}deg)` }} />
      <div style={{ position: "absolute", left: 144, top: 144, width: 36, height: 36, borderRadius: "50%", background: "#333" }} /></div>
    <div style={{ position: "absolute", left: 1515, top: 560, height: 400, transformOrigin: "0 0", transform: `rotate(${tag}deg)` }}>
      <svg width={10} height={70} style={{ position: "absolute", left: -2, top: 0 }}><path d="M5 0 L5 70" stroke="#c8b080" strokeWidth={4} /></svg>
      <div style={{ position: "absolute", left: -130, top: 66, width: 260, height: 120, borderRadius: 10, background: "linear-gradient(#d8b880,#a8844a)", boxShadow: "0 12px 16px rgba(0,0,0,.5)", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#3a2410", textAlign: "center", lineHeight: "120px" }}>{Y[k]}</div></div>
  </Cam>;
}} />;

// m22 · más grande que Delaware: la costa en tablero; el agua se come la tierra con borde irregular de papel mojado; Delaware de madera baja colgado de un hilo en péndulo y se apoya en el hueco, más chico
const HDelawareOverlay: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), hole = 0.3 * eio(tt, 0, 1.1) + 0.7 * eio(tt, 1.1, d * 0.5), dn = eio(tt, d * 0.35, d * 0.7), sw = swing(tt, d * 0.35, 9, 3, 0.7), lift = eio(tt, d * 0.7, d * 0.8);
  const P = Array.from({ length: 40 }, (_, j) => { const a = Math.PI * j / 39, r = (0.8 + 0.12 * Math.sin(j * 0.7 + 1) + 0.07 * Math.sin(j * 0.33 + 2) + 0.025 * Math.sin(j * 1.9 + tt)) * hole; return `${960 - Math.cos(a) * 620 * r},${820 - Math.sin(a) * 520 * r}`; }).join(" ");
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Mesa y0={960} />
    <div style={{ position: "absolute", left: 200, top: 160, width: 1520, height: 800, borderRadius: 16, background: "radial-gradient(ellipse at 30% 30%,rgba(255,255,255,.12),transparent 60%), repeating-linear-gradient(20deg,rgba(0,0,0,.05) 0 4px,transparent 4px 18px), linear-gradient(#8a9a5a,#5a6a3a)", boxShadow: "0 24px 0 #4a3418, 0 44px 50px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 200, top: 820, width: 1520, height: 140, borderRadius: "0 0 16px 16px", background: "linear-gradient(#4a7a90,#23404e)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <polygon points={`340,820 ${P} 1580,820`} fill="rgba(60,40,20,.35)" transform="translate(0,6)" />
      <polygon points={`340,820 ${P} 1580,820`} fill="#3e6e84" stroke="#c8b088" strokeWidth={10} strokeLinejoin="round" />
      <polygon points={`340,820 ${P} 1580,820`} fill="none" stroke="rgba(220,240,250,.35)" strokeWidth={4} strokeDasharray="12 18" strokeDashoffset={-tt * 40} /></svg>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M960 0 L${960 + 400 * Math.sin(sw * Math.PI / 180)} ${120 + 520 * dn}`} stroke="#d8c8a0" strokeWidth={4} opacity={1 - lift} /></svg>
    <div style={{ position: "absolute", left: 960 - 140, top: 760, width: 280, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.5),transparent 70%)", opacity: dn, transform: `scale(${0.5 + 0.5 * dn})` }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 0", transform: `rotate(${sw * (1 - lift)}deg)` }}><Prop id="delaware_cut" x={960} y={200 + 560 * dn} w={250} sh={0} /></div>
    {lift > 0 && <Dust tt={tt} at={d * 0.7} x={960} y={770} w={200} col="rgba(220,235,240,.7)" />}
  </Cam>;
}} />;

// m24 · la gran inundación: la casita en la pecera; agua turbia con menisco en los vidrios y ondas sube hasta el alero, baja y deja la raya de barro; el martillo clava la chapa de bronce 1927 sobre la raya
const HFloodRoof: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = (0.4 * eio(tt, 0, 1.1) + 0.6 * eio(tt, 1.1, d * 0.42)) * (1 - eio(tt, d * 0.56, d * 0.68)), mark = cl((tt - d * 0.58) / 0.4), pl = d * 0.7, hits = [pl + 0.5, pl + 1.0, pl + 1.5];
  const top = 930 - 400 * up, ML = 550, pd = land(tt, pl, 300), hk = hits.map((x) => cl((tt - x + 0.35) / 0.35)), ham = hits.findIndex((x) => tt < x + 0.15);
  const hp = ham < 0 ? 1 : Math.sin(hk[ham] * Math.PI);
  return <Cam tt={tt} d={d} z={0.05} fy={560}>
    <Mesa y0={950} />
    <div style={{ position: "absolute", inset: 0, filter: "contrast(1.18) saturate(1.2)" }}><Prop id="house_glass" x={960} y={930} w={640} /></div>
    {mark > 0 && <div style={{ position: "absolute", left: 650, top: ML, width: 620, height: 22, background: "linear-gradient(rgba(80,52,24,.95),rgba(110,80,40,.25))", opacity: mark, filter: "blur(1px)" }} />}
    {up > 0.005 && <>
      <div style={{ position: "absolute", left: 470, top, width: 980, height: 930 - top, background: MUD }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M470 ${top - 16} Q478 ${top} 500 ${top} ${Array.from({ length: 12 }, (_, k) => `Q${528 + k * 77} ${top + 9 * Math.sin(tt * 4 + k)} ${566 + k * 77} ${top}`).join(" ")} Q1440 ${top} 1450 ${top - 16}`} stroke="rgba(245,235,215,.85)" strokeWidth={6} fill="none" />
        {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={520 + ((k * 97 + tt * 30) % 900)} cy={top + 40 + (k * 53) % Math.max(10, 900 - top - 60)} r={3 + k % 3} fill="rgba(220,200,160,.5)" />)}</svg></>}
    <Prop id="aquarium" x={960} y={960} w={1000} sh={0} style={{ opacity: 0.8 }} />
    {pd.on && <div style={{ position: "absolute", left: 960 - 150, top: ML - 120 + pd.dy, width: 300, height: 140, borderRadius: 12, background: "linear-gradient(135deg,#f0c870,#a87a2c 55%,#7a5214)", boxShadow: "0 10px 14px rgba(0,0,0,.55), inset 0 3px 0 rgba(255,240,200,.6)", fontFamily: SER, fontWeight: 900, fontSize: 88, color: "#3a2208", textAlign: "center", lineHeight: "140px", transform: `scaleY(${1 - pd.sq * 0.3})` }}>1927
      {[[16, 16], [268, 16], [16, 108], [268, 108]].map(([x, y], j) => <div key={j} style={{ position: "absolute", left: x, top: y, width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#ddd,#555)", opacity: hk[j % 3] > 0.5 ? 1 : 0.2 }} />)}</div>}
    {tt > pl + 0.1 && tt < hits[2] + 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1400px 620px", transform: `rotate(${-50 + 50 * hp}deg)` }}><Prop id="hammer" x={1240} y={640} w={340} r={-90} sh={0} /></div>}
    {hits.map((x, j) => <Dust key={j} tt={tt} at={x} x={1110} y={ML} w={60} col="rgba(240,220,170,.8)" />)}
  </Cam>;
}} />;

// m25 · el río encerrado: un canal en U profundo de frente con corriente marrón que corre hacia cámara entre dos muros; las bolas de barro salen de a una por la boca en arco y caen a la cuba de chapa con salpicadura y anillos
const HLeveeChute: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8b8c0,#d8d0b8 40%,#6a7a4a 42%,#3a4a28)" f={(tt) => {
  const d = D(h), N = 4, per = (d - 0.6) / N;
  return <Cam tt={tt} d={d} z={0.05} fy={640}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><linearGradient id="lvw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5a32" /><stop offset="1" stopColor="#5a3e1e" /></linearGradient>
        <linearGradient id="lvL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a7a3a" /><stop offset=".7" stopColor="#8a7a52" /><stop offset="1" stopColor="#6a5a3a" /></linearGradient>
        <linearGradient id="lvR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#4a6a2a" /><stop offset=".7" stopColor="#7a6a44" /><stop offset="1" stopColor="#5a4a2e" /></linearGradient></defs>
      <polygon points="880,440 1040,440 1380,1000 540,1000" fill="url(#lvw)" />
      {Array.from({ length: 12 }, (_, k) => { const p = ((tt * 0.5 + k / 12) % 1), y = 440 + 560 * p * p, w = 160 + 840 * p * p, o = (k * 37) % 60 - 30; return <path key={k} d={`M${960 - w * 0.35 + o * p} ${y} Q${960 + o * p} ${y + 6 + 16 * p} ${960 + w * 0.1 + o * p} ${y}`} stroke="rgba(240,225,190,.55)" strokeWidth={2 + 6 * p} fill="none" strokeLinecap="round" />; })}
      <polygon points="700,420 880,440 540,1000 120,1000" fill="url(#lvL)" />
      <polygon points="1220,420 1040,440 1380,1000 1800,1000" fill="url(#lvR)" />
      <polygon points="700,420 880,440 860,452 690,432" fill="#9ab86a" /><polygon points="1220,420 1040,440 1060,452 1230,432" fill="#8aa85a" />
      {Array.from({ length: 30 }, (_, k) => { const p = k / 30, xl = 700 - 580 * p, xr = 1220 + 580 * p, y = 420 + 580 * p; return <g key={k}><path d={`M${xl} ${y} l${-6 - 10 * p} ${-14 - 20 * p}`} stroke="#6a8a3a" strokeWidth={2 + 3 * p} /><path d={`M${xr} ${y} l${6 + 10 * p} ${-14 - 20 * p}`} stroke="#5a7a2a" strokeWidth={2 + 3 * p} /></g>; })}</svg>
    <div style={{ position: "absolute", left: 1330, top: 830, width: 420, height: 170, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%,#0e1a1e,#203038 60%,#3a4a52)", boxShadow: "0 0 0 18px #7a7e82, 0 0 0 24px #3a3e42, 0 34px 44px rgba(0,0,0,.6)", zIndex: 2 }} />
    <div style={{ position: "absolute", left: 1306, top: 915, width: 468, height: 110, borderRadius: "0 0 46% 46%", background: "repeating-linear-gradient(90deg,rgba(0,0,0,.22) 0 4px,transparent 4px 52px), linear-gradient(#9a9ea2,#4a4e52)", zIndex: 1 }} />
    {Array.from({ length: N }, (_, k) => { const a = -0.2 + k * per, p = cl((tt - a) / 1.6); if (p <= 0) return null; const x = 960 + 580 * p, y = 900 - 460 * Math.sin(p * Math.PI * 0.92) + 30 * p, wq = 120 + 70 * p;
      return p < 1 ? <Prop key={k} id="mud_ball" x={x} y={y} w={wq} r={p * 500} sh={0} style={{ zIndex: 3 }} /> : <React.Fragment key={k}><Splash x={1540} y={900} p={(tt - a - 1.6) / 0.6} s={1.4} col="rgba(120,95,60,.9)" /><Rings tt={tt} at={a + 1.6} x={1540} y={915} s={0.9} /></React.Fragment>; })}
  </Cam>;
}} />;

// m30 · reconstruir: corte de acuario de cerca; el caño de acero con bridas y flotador baja la columna espesa de barro con partículas; el lecho sube en capas con textura; brotan matas reales; la cámara va a la boca
const HPipeRebuild: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#5a6a6a,#2a3434)" f={(tt) => {
  const d = D(h), isl = 0.28 * eio(tt, 0, 1.1) + 0.72 * eio(tt, 1.1, d * 0.55), gr = eio(tt, d * 0.5, d - 0.3), L = ["#4a3220", "#6a4a2a", "#8a6a3e", "#a88a5a"];
  const bed = (k: number) => cl(isl * 4 - k), floor = 930 - [0, 1, 2, 3].reduce((s, k) => s + 55 * bed(k), 0);
  return <Cam tt={tt} d={d} z={0.1} fx={820} fy={520}>
    <Mesa y0={980} />
    <div style={{ position: "absolute", left: 300, top: 260, width: 1320, height: 700, background: "linear-gradient(rgba(120,170,170,.35),rgba(60,100,100,.55))", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }} />
    {[0, 1, 2, 3].map((k) => { const g = bed(k); if (g <= 0) return null; const y0 = 930 - [0, 1, 2, 3].slice(0, k + 1).reduce((s, j) => s + 55 * bed(j), 0);
      return <div key={k} style={{ position: "absolute", left: 300, top: y0, width: 1320, height: 55 * g + 2, background: `radial-gradient(circle at 20% 40%,rgba(255,255,255,.08) 2px,transparent 3px) 0 0/23px 17px, radial-gradient(circle at 60% 70%,rgba(0,0,0,.18) 2px,transparent 3px) 0 0/31px 19px, ${L[k]}`, clipPath: `polygon(0 ${30 - 20 * g}%,${50 - 30 * g}% 0,${50 + 30 * g}% 0,100% ${30 - 20 * g}%,100% 100%,0 100%)` }} />; })}
    {Array.from({ length: 9 }, (_, k) => { const g = cl(gr * 9 - k * 0.7); return g > 0 && <Prop key={k} id="marsh_plant" x={420 + k * 140 + (k % 2) * 30} y={floor + 8} w={150 * phys(g, 0, 7, 0.5)} sh={0} />; })}
    <div style={{ position: "absolute", left: 300, top: 260, width: 1320, height: 700, border: "16px solid #2a2e30", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.25), 0 20px 30px rgba(0,0,0,.6)" }} />
    <Prop id="pipe_float" x={560} y={250} w={620} sh={0} />
    <div style={{ position: "absolute", left: 700, top: 230, width: 120, height: 150, background: "linear-gradient(90deg,#3a3e42,#b8bcc0 45%,#4a4e52)", borderRadius: 6, boxShadow: "0 0 0 10px #5a5e62" }} />
    <div style={{ position: "absolute", left: 686, top: 370, width: 148, height: 26, borderRadius: 6, background: "linear-gradient(#9a9ea2,#3a3e42)" }} />
    {tt > 0 && <div style={{ position: "absolute", left: 712, top: 396, width: 96, height: floor - 396, background: `repeating-linear-gradient(180deg,rgba(60,40,20,.0) 0 20px,rgba(60,40,20,.35) 20px 34px) 0 ${(tt * 600) % 34}px, linear-gradient(90deg,rgba(90,64,36,.7),rgba(140,104,62,.95),rgba(90,64,36,.7))` }} />}
    {tt > 0.3 && Array.from({ length: 16 }, (_, k) => { const p = ((tt * 1.4 + k / 16) % 1); return <div key={k} style={{ position: "absolute", left: 700 + (k * 37) % 120, top: 400 + (floor - 400) * p, width: 8 + k % 4 * 3, height: 8 + k % 3 * 3, borderRadius: "50%", background: "#5a3e20" }} />; })}
    {tt > 0.3 && <Splash x={760} y={floor} p={(tt * 1.5) % 1} s={0.9} col="rgba(120,90,50,.85)" />}
  </Cam>;
}} />;

// m5 · los corrales por el país: siluetas de los estados en cartón grueso; en cada una cae una cerca 3D, rebota y un alfiler con banderita la clava
const ST: [string, number, number, number, number[][]][] = [
  ["WA", 300, 150, 260, [[0, 0], [.2, .05], [.25, .3], [.32, 0], [1, 0], [1, 1], [.1, .92], [0, .6]]],
  ["OR", 300, 380, 280, [[0, .1], [.35, 0], [.9, .05], [1, .15], [.9, .4], [.95, 1], [0, 1], [.05, .5]]],
  ["CA", 260, 640, 300, [[.08, 0], [.42, 0], [.42, .35], [.95, .78], [.88, 1], [.6, 1], [.48, .84], [.2, .6], [.04, .3]]],
  ["TX", 900, 560, 420, [[0, 0], [.35, 0], [.35, .3], [.55, .33], [.78, .38], [1, .4], [1, .66], [.8, .8], [.62, 1], [.5, .86], [.36, .62], [.16, .64], [0, .46]]],
  ["LA", 1330, 620, 240, [[0, 0], [.6, 0], [.55, .3], [.75, .5], [1, .55], [.95, 1], [.4, .95], [0, .8]]],
  ["MI", 1450, 160, 300, [[.2, .32], [.4, .1], [.55, .25], [.6, 0], [.8, .15], [.86, .55], [.75, .6], [.8, .9], [.4, 1], [.14, .7]]]];
const HPenMap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b0 = bt(h, 0, 0.9), per = (d - b0 - 0.8) / ST.length;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={60} tone="#8a6a48" />
    {ST.map(([nm, x, y, w, P], i) => { const L = land(tt, 0.05 + i * 0.07, 260), hh = w * 0.85, pts = P.map(([a, b]) => `${a * w},${b * hh}`).join(" "); if (!L.on) return null;
      return <svg key={nm} width={w + 30} height={hh + 40} style={{ position: "absolute", left: x, top: y + L.dy, overflow: "visible", filter: "drop-shadow(0 18px 14px rgba(0,0,0,.5))" }}>
        {[14, 10, 6].map((o) => <polygon key={o} points={pts} fill="#6a4a24" transform={`translate(0,${o})`} />)}
        <polygon points={pts} fill={i % 2 ? "#d8ab72" : "#c89a62"} stroke="#8a6238" strokeWidth={3} />
        <text x={w * 0.42} y={hh * 0.62} fontFamily="Georgia, serif" fontWeight={900} fontSize={w * 0.2} fill="rgba(90,58,28,.55)" textAnchor="middle">{nm}</text></svg>; })}
    {ST.map(([nm, x, y, w], i) => { const at = b0 + i * per, cx = x + w * 0.45, cy = y + w * 0.62, pin = eio(tt, at + 0.45, at + 0.62);
      return <React.Fragment key={nm}>
        <Drop tt={tt} at={at} id="fence" x={cx} y={cy} w={w * 0.55} dust />
        {tt > at + 0.4 && <Prop id="survey_flag" x={cx + w * 0.28} y={cy - 10 - 180 * (1 - pin)} w={64} r={swing(tt, at + 0.62, 8, 6, 2)} sh={0} />}</React.Fragment>; })}
  </Cam>;
}} />;

// m19 · la recompensa: precio fijo $5 en chapa; cada cola gruesa escamosa entra por la ranura y cuelga, la balanza de latón se inclina, y la ranura escupe un billete de $5; el contador cuenta colas
const HTailBounty: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), N = 3, per = (d - 0.5) / N, i = Math.min(N - 1, Math.floor(Math.max(0, tt - 0.2) / per)), u = Math.max(0, tt - 0.2 - i * per);
  const tp = eio(u, 0, 0.8), tilt = 14 * eio(u, 0.7, 1.0) * (1 - eio(u, per - 0.4, per)) + swing(tt, 0.2 + i * per + 1.0, 4, 8, 2), bp = eio(u, 1.1, 1.6), paid = Math.min(N, i + (u > 1.1 ? 1 : 0));
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <div style={{ position: "absolute", left: 380, top: 120, width: 760, height: 620, borderRadius: 18, background: "linear-gradient(#6a4a2c,#3a2614)", boxShadow: "0 26px 36px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,220,170,.25)" }} />
    <div style={{ position: "absolute", left: 560, top: 250, width: 400, height: 44, borderRadius: 10, background: "#0a0604", boxShadow: "inset 0 8px 12px #000, 0 -3px 0 #c8a050" }} />
    {tp > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: u < 1.0 ? "inset(0 0 0 0)" : "inset(272px 0 0 0)" }}><Prop id="tail" x={760} y={300 + 420 * tp} w={260} r={90} sh={0} /></div>}
    <div style={{ position: "absolute", left: 560, top: 600, width: 400, height: 30, borderRadius: 8, background: "#0a0604", boxShadow: "inset 0 6px 10px #000, 0 -3px 0 #c8a050" }} />
    {bp > 0 && <Prop id="bill5" x={760} y={620 + 260 * bp} w={380} r={-3 + 6 * Math.sin(bp * 4)} sh={bp} />}
    <div style={{ position: "absolute", left: 1270, top: 280, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -12, top: 0, width: 24, height: 560, background: "linear-gradient(90deg,#7a5214,#e8c070,#7a5214)" }} />
      <div style={{ position: "absolute", left: -260, top: -10, width: 520, height: 20, borderRadius: 10, background: "linear-gradient(#e8c070,#8a6018)", transform: `rotate(${tilt}deg)`, boxShadow: "0 10px 12px rgba(0,0,0,.5)" }}>
        {[0, 1].map((s) => <div key={s} style={{ position: "absolute", left: s ? 440 : -40, top: 10, width: 120, height: 200 }}>
          <svg width={120} height={200} style={{ position: "absolute" }}><path d="M60 0 L10 150 M60 0 L110 150" stroke="#a8802c" strokeWidth={3} /></svg>
          <div style={{ position: "absolute", left: 0, top: 140, width: 120, height: 34, borderRadius: "0 0 60px 60px", background: "linear-gradient(#e8c070,#8a6018)" }} />
          {s === 0 && paid > 0 && <div style={{ position: "absolute", left: 6, top: 110, width: 108, height: 34, borderRadius: 16, background: "repeating-linear-gradient(90deg,#5a4a3a 0 8px,#3a2a1e 8px 14px)" }} />}</div>)}</div>
      <div style={{ position: "absolute", left: -110, top: 560, width: 220, height: 40, borderRadius: 8, background: "linear-gradient(#e8c070,#8a6018)" }} /></div>
    <div style={{ position: "absolute", left: 1480, top: 140, width: 260, height: 150, borderRadius: 14, background: "linear-gradient(135deg,#f0c870,#a87a2c)", boxShadow: "0 12px 16px rgba(0,0,0,.5)", fontFamily: SER, fontWeight: 900, fontSize: 100, color: "#3a2208", textAlign: "center", lineHeight: "150px", transform: `rotate(${4 + swing(tt, 0.1, 3, 3, 0.5)}deg)` }}>$5</div>
    <div style={{ position: "absolute", left: 600, top: 790, width: 320, height: 130, borderRadius: 16, background: "linear-gradient(#2a2420,#120e0c)", boxShadow: "0 16px 22px rgba(0,0,0,.6)" }} />
    <Odo x={760} y={855} v={paid} n={2} size={90} lead={false} />
  </Cam>;
}} />;

// m13 · el cuereado: UNA horma grande al frente con la piel; la mano del chico con la cuchilla de dos mangos raspa de arriba abajo; virutas y pelos caen con sombra; las otras hormas detrás desenfocadas
const HStretchBoards: C = ({ t, h }) => <S t={t} h={h} bg={WALL} f={(tt) => {
  const d = D(h), u = Math.max(0, tt - 0.2), pass = 1.6, ph = (u % pass) / pass, k = Math.floor(u / pass), ky = 300 + 520 * eio(ph, 0.05, 0.8), back = ph > 0.8, hin = eio(tt, 0, 0.4), clean = cl(u / (d - 0.6));
  return <Cam tt={tt} d={d} z={0.05} fy={520}>
    <Luz />
    {[360, 1560].map((x, j) => <Prop key={j} id="stretch_board" x={x} y={900} w={230} sh={0} blur={8} o={0.7} />)}
    <div style={{ position: "absolute", left: 0, top: 920, width: 1920, height: 160, background: "linear-gradient(#5a3e24,#2a1c10)" }} />
    <div style={{ position: "absolute", left: 960 - 220, top: 940, width: 440, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.6),transparent 70%)" }} />
    <Prop id="stretch_board" x={960} y={970} w={440} sh={0} />
    <div style={{ position: "absolute", left: 870, top: 300, width: 180, height: 600, borderRadius: "40% 40% 10% 10%", background: `linear-gradient(180deg,rgba(232,206,170,.0) 0,rgba(232,206,170,.0) ${100 * clean}%,rgba(90,60,36,.0) ${100 * clean}%)` }} />
    {Array.from({ length: 18 }, (_, j) => { const p = ((tt * 1.3 + j / 18) % 1); return <div key={j} style={{ position: "absolute", left: 960 + (j - 9) * 14 + 140 * p * (j % 2 ? 1 : -1), top: ky + 30 + 520 * p * p, width: j % 3 ? 18 : 26, height: 6, borderRadius: 3, background: j % 3 ? "#6a4228" : "#e8d8b8", boxShadow: "0 6px 4px rgba(0,0,0,.35)", opacity: back ? 0 : hin * (1 - p), transform: `rotate(${j * 40 + p * 300}deg)` }} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - hin) * 600 + (back ? -40 : 0)}px)` }}>
      <Prop id="fleshing_knife" x={960} y={ky + 30} w={560} sh={0} />
      <Prop id="child_hand" x={700} y={ky + 330} w={360} r={-20} sh={0} />
      <Prop id="child_hand" x={1220} y={ky + 330} w={360} r={20} flip sh={0} /></div>
  </Cam>;
}} />;

export const HCD6: Record<string, C> = {
  // 29-oct: sólo quedan las que no bajaron frente a d5 (el resto vuelve a la versión de d5, que puntuó más)
  trapCount: HTrapCount, floodRoof: HFloodRoof,
};
// en reserva (puntuaron menos que d5 en la ronda 6): harvestBars, delawareOverlay, leveeChute, pipeRebuild, penMap, tailBounty, stretchBoards
export const HCD6_RESERVA: Record<string, C> = { harvestBars: HHarvestBars, delawareOverlay: HDelawareOverlay, leveeChute: HLeveeChute, pipeRebuild: HPipeRebuild, penMap: HPenMap, tailBounty: HTailBounty, stretchBoards: HStretchBoards };
