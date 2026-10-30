// ruth29b · 4ª vuelta (29-oct): los 11 que seguían <6 en la ronda 3, con el cambio concreto del evaluador.
// Objetos FOTORREALES (public/img/<slug>/cut), todo entero en cuadro, acción a los 0,3 s, sombra de contacto, sin rótulos de esquina.
import React from "react";
import { cl, eio } from "./hkit";
import { Odo } from "./obj";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#b8c4c8 0%,#e8dcc0 44%,#a89a6a 45%,#6a5a32 100%)";
const TIERRA = "radial-gradient(circle at 30% 30%,rgba(0,0,0,.16) 2px,transparent 3px) 0 0/20px 18px, radial-gradient(circle at 70% 60%,rgba(255,230,190,.1) 2px,transparent 3px) 0 0/31px 27px";
const Sombra: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${o}),transparent 70%)` }} />;
const Tablita: React.FC<{ x: number; y: number; txt: string; size?: number; r?: number; o?: number; red?: boolean }> = ({ x, y, txt, size = 56, r = 0, o = 1, red }) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) rotate(${r}deg)`, transformOrigin: "50% 100%", opacity: o, display: "flex", flexDirection: "column", alignItems: "center" }}>
  <div style={{ padding: `${size * 0.14}px ${size * 0.34}px`, borderRadius: 6, background: red ? "linear-gradient(#d84a3a,#8a1a10)" : "linear-gradient(#ead6a8,#b8945a)", boxShadow: "0 10px 14px rgba(0,0,0,.5)", fontFamily: SER, fontWeight: 900, fontSize: size, color: red ? "#fff2e0" : "#3a2410", whiteSpace: "nowrap" }}>{txt}</div>
  <div style={{ width: 10, height: size * 1.4, background: "linear-gradient(90deg,#5a3a1a,#9a6a3a)" }} /></div>;

// m01 · el pud ruso: pesas grandes de hierro en perspectiva con sombra que desbordan hacia el fondo; cae el diario con un golpe y en su titular el contador de latón enorme
const HPoodWeight: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), np = land(tt, d * 0.45, 900), v = Math.floor(10 * eio(tt, d * 0.45 + 0.6, d - 0.6) + 0.001) * 100000000;
  return <Cam tt={tt} d={d} z={0.04} fy={700}>
    <Mesa y0={480} />
    {[3, 2, 1, 0].map((r) => { const n = 4 + 2 * r, s = 1 - r * 0.2; return Array.from({ length: n }, (_, k) => { const x = 960 + (k - (n - 1) / 2) * 260 * s, y = 1060 - r * 150, L = land(tt, 0.1 + (r * 0.3 + k * 0.08), 500); if (!L.on) return null; return <div key={r + "_" + k} style={{ filter: `blur(${r * 1.2}px) brightness(${1 - r * 0.12})` }}><Sombra x={x} y={y + L.dy} w={240 * s} o={0.55} /><Prop id="weights" x={x} y={y + L.dy} w={250 * s} sq={L.sq} sh={0} /></div>; }); })}
    {np.on && <><Sombra x={960} y={760} w={1100} o={0.6} /><div style={{ position: "absolute", left: 960 - 560, top: 120 + np.dy, width: 1120, height: 640, transform: `rotate(${-2}deg) scaleY(${1 - np.sq * 0.3})`, transformOrigin: "50% 100%", background: "repeating-linear-gradient(180deg,transparent 0 30px,rgba(0,0,0,.06) 30px 32px), linear-gradient(#f2ead6,#ddd0b0)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 26, width: 1120, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 92, color: "#1a1a1a", borderBottom: "6px double #333", paddingBottom: 14 }}>RECORD HARVEST</div>
      <div style={{ position: "absolute", left: 0, top: 480, width: 1120, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 80, color: "#1a1a1a" }}>POODS OF GRAIN</div></div>
      <Odo x={960} y={360 + np.dy} v={v} n={10} size={92} /></>}
    {np.on && <Dust tt={tt} at={d * 0.45 + 0.55} x={960} y={760} w={900} />}
  </Cam>;
}} />;

// m03 · el arado de vertedera, de costado: la reja entra en el corte de tierra con pasto; el terrón grande con raíces sube por la curva, gira 180° y cae raíces arriba junto al surco
const HMoldboard: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), N = 3, per = (d - 0.6) / N, cx = 960;
  return <Cam tt={tt} d={d} z={0.05} fy={640}>
    <div style={{ position: "absolute", left: -200, top: 560, width: 2320, height: 600, background: `${TIERRA}, linear-gradient(#5a3e1e,#2a1a0a)` }} />
    <div style={{ position: "absolute", left: -200, top: 540, width: 2320, height: 40, background: "repeating-linear-gradient(90deg,#6a8a3a 0 6px,#4a6a22 6px 12px)" }} />
    <div style={{ position: "absolute", left: -200, top: 560, width: cx + 180, height: 90, background: "linear-gradient(#2a1a0a,#3a2410)" }} />
    {Array.from({ length: N }, (_, k) => { const a = 0.1 + k * per, p = cl((tt - a) / per), ang = 180 * eio(p, 0.15, 0.85), x = cx + 40 - 280 * p, y = 600 - 260 * Math.sin(p * Math.PI) + 0 * p, lay = k < Math.floor((tt - 0.1) / per); return <div key={k}>
      {(p > 0 || lay) && <div style={{ position: "absolute", left: (lay ? cx - 240 - k * 240 : x) - 120, top: (lay ? 470 : y - 80), width: 240, height: 120, transform: `rotate(${lay ? 180 : ang}deg)`, borderRadius: "30px 30px 50px 50px", background: `${TIERRA}, linear-gradient(#3a7a2a 0 22%,#6a4a22 24%,#3a2410)`, boxShadow: "0 14px 16px rgba(0,0,0,.45)" }}>
        <svg width={240} height={120} style={{ position: "absolute", inset: 0 }}>{[30, 80, 130, 180, 210].map((rx, j) => <path key={j} d={`M${rx} 120 q${(j % 2 ? 1 : -1) * 10} 18 ${(j % 2 ? -1 : 1) * 6} 34`} stroke="#e8d8b0" strokeWidth={4} fill="none" />)}</svg></div>}</div>; })}
    <Sombra x={cx + 260} y={600} w={600} o={0.35} />
    <Prop id="moldboard" x={cx + 220} y={700} w={620} sh={0} r={2 * Math.sin(tt * 10)} />
    {[0, 1, 2].map((k) => <Dust key={k} tt={tt} at={0.5 + k * per} x={cx} y={560} w={200} />)}
  </Cam>;
}} />;

// m05 · barbecho negro: la púa de acero del cultivador pasa arrollando el pasto y deja el surco negro liso; detrás sube un velo de polvo fino semitransparente con luz rasante
const HBareFallow: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), bx = 200 + 1500 * eio(tt, 0, d * 0.85);
  return <Cam tt={tt} d={d} z={0.04} fy={760}>
    <div style={{ position: "absolute", left: -200, top: 560, width: 2320, height: 600, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 3px,transparent 3px 14px), linear-gradient(#8a9a4a,#4a5a22)" }} />
    <div style={{ position: "absolute", left: -200, top: 560, width: bx + 160, height: 600, background: `${TIERRA}, linear-gradient(90deg,#1a120a,#2a1a0e)`, boxShadow: "inset -20px 0 30px rgba(0,0,0,.4)" }} />
    {Array.from({ length: 16 }, (_, k) => { const x = 60 + k * 120, f = cl((bx - x + 40) / 120); return <Prop key={k} id="wheat_dry" x={x} y={980 + (k % 2) * 20} w={120} r={-80 * f} o={1 - f} sh={0} />; })}
    <div style={{ position: "absolute", left: -200, top: 300, width: Math.max(0, bx + 200), height: 520, background: "linear-gradient(90deg,rgba(200,170,120,0),rgba(200,170,120,.35) 60%,rgba(220,190,140,.55))", filter: "blur(20px)", maskImage: "linear-gradient(transparent,#000 40%,#000 80%,transparent)" }} />
    {Array.from({ length: 60 }, (_, k) => { const age = (k % 20) * 0.12, x = bx - 80 - age * 260 + (k * 37) % 60, y = 940 - age * 180 - (k * 53) % 120; return x > -50 && <div key={k} style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: "50%", background: "rgba(240,215,170,.8)", opacity: 1 - age / 2.4 }} />; })}
    <Sombra x={bx} y={1010} w={420} o={0.5} />
    <Prop id="blade" x={bx} y={1030} w={420} r={-6 + 2 * Math.sin(tt * 14)} sh={0} />
  </Cam>;
}} />;

// m09 · el viento peina: dos bandejas iguales cerca de cámara; en la de pasto las hojas se inclinan en olas; en la de tierra desnuda la capa de arriba se despega en partículas que vuelan
const HWindComb: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8b4b8,#d8ccb0)" f={(tt) => {
  const d = D(h), w = 0.4 + 0.6 * eio(tt, 0, 0.8), gone = eio(tt, 0.5, d * 0.9);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={700} />
    {[480, 1440].map((x) => <Sombra key={x} x={x} y={900} w={760} o={0.55} />)}
    <div style={{ position: "absolute", left: 120, top: 760, width: 720, height: 140, borderRadius: 14, background: "linear-gradient(#5a5e62,#2a2e32)", boxShadow: "inset 0 10px 16px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 34 }, (_, k) => { const x = 150 + k * 20, a = 20 * w + 18 * Math.sin(tt * 4 - k * 0.35) * w; return <div key={k} style={{ position: "absolute", left: x, top: 590 + (k % 3) * 8, width: 8, height: 190, borderRadius: 4, transformOrigin: "50% 100%", transform: `rotate(${a}deg)`, background: "linear-gradient(#a8c85a,#3a6a22)" }} />; })}
    <div style={{ position: "absolute", left: 1080, top: 760, width: 720, height: 140, borderRadius: 14, background: "linear-gradient(#5a5e62,#2a2e32)", boxShadow: "inset 0 10px 16px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1100, top: 720 + 40 * gone, width: 680, height: 80 - 40 * gone, borderRadius: "40% 40% 10% 10%", background: `${TIERRA}, linear-gradient(#9a7a4a,#6a4a22)` }} />
    {Array.from({ length: 70 }, (_, k) => { const ph = ((tt * 0.6 + k / 70) % 1), x = 1120 + (k * 97) % 640 + 700 * ph, y = 730 - 260 * ph + 40 * Math.sin(k + tt * 3); return x < 1910 && <div key={k} style={{ position: "absolute", left: x, top: y, width: 6 + (k % 3) * 3, height: 6 + (k % 3) * 3, borderRadius: "50%", background: "rgba(160,120,70,.85)", opacity: (1 - ph) * cl(gone * 3) }} />; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2].map((k) => <path key={k} d={`M${60 + 600 * ((tt * 0.4 + k / 3) % 1)} ${300 + k * 90} q60 -30 120 0 t120 0`} stroke="rgba(255,255,255,.5)" strokeWidth={5} fill="none" strokeLinecap="round" />)}</svg>
  </Cam>;
}} />;

// m11 · franjas: tres hileras de rastrojo grande en perspectiva con tallos gruesos; cae la nieve y forma cuña con volumen detrás de cada hilera; al lado el parche desnudo levanta polvo
const HStripPlots: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9aa8b4 0%,#d8dce0 42%,#8a7a52 43%,#4a3a1e 100%)" f={(tt) => {
  const d = D(h), b2 = Math.max(1.5, bt(h, 2, d * 0.55)), sn = eio(tt, b2, d * 0.95), rows = [0, 1, 2];
  return <Cam tt={tt} d={d} z={0.04} fy={700}>
    {rows.map((r) => { const y = 600 + r * 150, s = 0.6 + r * 0.2; return <div key={r}>
      <div style={{ position: "absolute", left: 120 - r * 40, top: y - 30 * s - 50 * sn * s, width: 1000 + r * 60, height: 40 * s + 50 * sn * s, borderRadius: "50% 50% 0 0 / 100% 100% 0 0", background: "linear-gradient(#ffffff,#d8e0e8)", opacity: sn, boxShadow: "0 -4px 8px rgba(255,255,255,.4)" }} />
      {Array.from({ length: 22 }, (_, k) => <div key={k} style={{ position: "absolute", left: 140 - r * 40 + k * 46 * (1 + r * 0.05), top: y - 110 * s, width: 10 * s, height: 120 * s, transform: `rotate(${(k % 3 - 1) * 6}deg)`, background: "linear-gradient(#e8c870,#9a7a32)", borderRadius: 3 }} />)}</div>; })}
    <div style={{ position: "absolute", left: 1260, top: 560, width: 760, height: 520, background: `${TIERRA}, linear-gradient(#8a6a3a,#5a3a1a)` }} />
    {[0, 1, 2, 3, 4].map((k) => <Dust key={k} tt={tt} at={k * 0.7} x={1500 + (k % 3) * 120} y={800 + (k % 2) * 120} w={260} col="rgba(190,160,110,.7)" />)}
    {Array.from({ length: 80 }, (_, k) => { const ph = ((tt * 0.35 + (k * 0.618) % 1) % 1), x = (k * 83) % 1200 + 40 + 30 * Math.sin(tt + k); return <div key={k} style={{ position: "absolute", left: x, top: -20 + 1000 * ph, width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: cl((tt - b2 + 0.6) * 2) * 0.9 }} />; })}
  </Cam>;
}} />;

// m12 · la cuchilla plana, en corte: bloque de tierra con raíces gruesas claras y rastrojo dorado parado arriba; la cuchilla plana de acero entra de costado y cada raíz se parte con un chasquido; el rastrojo sigue parado
const HFlatCutter: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), bx = -200 + 1700 * eio(tt, 0, d * 0.8), R = [380, 560, 740, 920, 1100, 1280, 1460];
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <Mesa y0={900} />
    <Sombra x={960} y={980} w={1600} o={0.6} />
    <div style={{ position: "absolute", left: 220, top: 440, width: 1480, height: 540, borderRadius: 12, background: `${TIERRA}, linear-gradient(#5a3e1e 0 30%,#7a5a32 30% 70%,#5a4022)`, boxShadow: "inset 0 -20px 30px rgba(0,0,0,.4), 0 20px 30px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: 240 + k * 36, top: 300, width: 10, height: 150, transform: `rotate(${(k % 3 - 1) * 5}deg)`, background: "linear-gradient(#f0d080,#b8902a)", borderRadius: 3, boxShadow: "2px 0 0 rgba(0,0,0,.15)" }} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{R.map((x, k) => { const cut = bx > x; return <g key={k}>
      <path d={`M${x} 450 C${x - 20} 560 ${x + 30} 620 ${x} ${cut ? 650 : 900}`} stroke="#efe0c0" strokeWidth={14} fill="none" strokeLinecap="round" />
      {cut && <path d={`M${x + 4} ${690 + 40 * cl((bx - x) / 200)} C${x - 10} 760 ${x + 20} 840 ${x} 900`} stroke="#d8c8a0" strokeWidth={12} fill="none" strokeLinecap="round" />}
      {bx > x && bx < x + 90 && <circle cx={x} cy={670} r={40} fill="rgba(255,250,220,.8)" />}</g>; })}</svg>
    <div style={{ position: "absolute", left: bx - 700, top: 652, width: 700, height: 26, background: "linear-gradient(#f0f4f8,#8a8e92 50%,#c8ccd0)", clipPath: "polygon(0 0,92% 0,100% 50%,92% 100%,0 100%)", boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: bx - 760, top: 300, width: 40, height: 380, background: "linear-gradient(90deg,#3a3e42,#9a9ea2,#3a3e42)" }} />
  </Cam>;
}} />;

// m14 · no hay desfiles: cámara baja de costado sobre la tribuna con sillas y sombra; las sillas se vacían de a una; el banderín se desprende, baja ondulando y aterriza entero en el escalón
const HEmptyStand: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8ccd0,#a8acb0 55%,#6a6e72)" f={(tt) => {
  const d = D(h), N = 7, pf = cl((tt - d * 0.35) / (d * 0.5)), pxx = 1500 - 500 * pf, pyy = 160 + 700 * pf;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 160 + r * 60, top: 560 + r * 150, width: 1600 - r * 120, height: 150, background: "linear-gradient(#a89a82,#7a6e5a)", boxShadow: "0 18px 20px rgba(0,0,0,.45)" }} />)}
    {[0, 1, 2].map((r) => Array.from({ length: N }, (_, k) => { const idx = r * N + k, gone = eio(tt, 0.2 + idx * 0.08, 0.5 + idx * 0.08), x = 300 + r * 60 + k * 200, y = 560 + r * 150; return <div key={idx} style={{ position: "absolute", left: x, top: y - 120, width: 120, height: 130, opacity: 1 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 70, borderRadius: 8, background: "linear-gradient(#5a6a7a,#2a3a4a)" }} />
      <div style={{ position: "absolute", left: 0, top: 70, width: 120, height: 20, borderRadius: 6, background: "#3a4a5a" }} />
      <div style={{ position: "absolute", left: 30, top: -60 - 200 * gone, width: 60, height: 120, borderRadius: "30px 30px 10px 10px", background: "radial-gradient(circle at 50% 20%,#c8a070 0 18%,#3a3a3a 20%)", opacity: 1 - gone }} /></div>; }))}
    <div style={{ position: "absolute", left: 1500, top: 60, width: 14, height: 400, background: "linear-gradient(90deg,#6a6e72,#d8dce0,#6a6e72)" }} />
    <Prop id="pennant" x={pxx + 40 * Math.sin(tt * 3) * pf * (1 - pf)} y={pyy + 200} w={280} r={pf * 70 + 20 * Math.sin(tt * 4) * (1 - pf)} sh={pf >= 1 ? 0.6 : 0} />
  </Cam>;
}} />;

// m15 · fue sacado del poder: el almanaque de escritorio; se arranca la hoja de septiembre y queda OCTOBER 1964 grande; la placa de bronce desliza por el escritorio y frena justo en el filo
const HDeskPlate: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), rip = eio(tt, 0.2, 1.0), sl = eio(tt, 1.2, d * 0.7), px = 500 + 780 * sl - 30 * swing(tt, d * 0.7, 1, 6, 2) * (sl >= 1 ? 1 : 0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <Mesa y0={720} />
    <Sombra x={560} y={760} w={520} o={0.55} />
    <div style={{ position: "absolute", left: 330, top: 200, width: 460, height: 560, borderRadius: 10, background: "linear-gradient(#f4ecd8,#ddd0b0)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", borderTop: "60px solid #3a3a3a" }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 460, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 72, color: "#b8261e" }}>OCTOBER</div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 460, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 170, color: "#2a2a2a" }}>1964</div></div>
    {rip < 1 && <div style={{ position: "absolute", left: 330, top: 260, width: 460, height: 500, transformOrigin: "0 0", transform: `translate(${300 * rip}px,${-200 * rip + 500 * rip * rip}px) rotate(${50 * rip}deg) perspective(900px) rotateX(${30 * rip}deg)`, background: "linear-gradient(#f8f2e2,#e4d8bc)", boxShadow: "0 12px 20px rgba(0,0,0,.4)", opacity: 1 - eio(rip, 0.8, 1) }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 460, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 64, color: "#3a3a3a" }}>SEPTEMBER</div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 460, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 200, color: "#4a4a4a" }}>1964</div></div>}
    <div style={{ position: "absolute", left: 1720, top: 700, width: 220, height: 400, background: "linear-gradient(90deg,rgba(0,0,0,.35),transparent)" }} />
    <Sombra x={px} y={870} w={560} o={0.55} />
    <div style={{ position: "absolute", left: px - 280, top: 760, width: 560, height: 110, transform: "perspective(800px) rotateX(18deg)", borderRadius: 8, background: "linear-gradient(135deg,#f0d080,#a87a2a 50%,#e8c060)", boxShadow: "0 12px 16px rgba(0,0,0,.5), inset 0 3px 0 rgba(255,250,220,.6)", textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 48, color: "#3a2208", lineHeight: "110px" }}>N. S. KHRUSHCHEV</div>
  </Cam>;
}} />;

// m17 · ¿quién pagó?: la registradora en el mostrador; el ticket sale enrollándose del rodillo y se curva; el cajón se abre despacio hasta el tope y queda vacío con una moneda que gira
const HBillEnvelopes: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tk = eio(tt, 0, d * 0.45), dr = eio(tt, d * 0.45, d * 0.7) + 0.03 * swing(tt, d * 0.7, 1, 6, 2), spin = tt > d * 0.7 ? (tt - d * 0.7) : 0;
  return <Cam tt={tt} d={d} z={0.04}>
    <Luz />
    <Mesa y0={760} />
    <Sombra x={960} y={880} w={900} o={0.55} />
    <div style={{ position: "absolute", left: 960 - 320, top: 240, width: 640, height: 400, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(#5a5e62,#2a2e32)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 4px 0 rgba(255,255,255,.2)" }}>
      <div style={{ position: "absolute", left: 120, top: 40, width: 400, height: 90, borderRadius: 8, background: "#1a2a1a", fontFamily: "monospace", fontSize: 64, color: "#7aff7a", textAlign: "center", lineHeight: "90px" }}>0.00</div>
      <div style={{ position: "absolute", left: 470, top: 0, width: 80, height: 30, borderRadius: 15, background: "linear-gradient(#e8ecf0,#6a6e72)" }} /></div>
    <div style={{ position: "absolute", left: 1170, top: 240 - 340 * tk, width: 150, height: 340 * tk + 10, background: "repeating-linear-gradient(180deg,#f8f4e8 0 26px,#ece4d0 26px 28px)", borderRadius: "0 0 40% 0 / 0 0 20% 0", transform: `rotate(${8 * tk}deg)`, transformOrigin: "50% 100%", boxShadow: "6px 6px 10px rgba(0,0,0,.3)" }} />
    <div style={{ position: "absolute", left: 960 - 330, top: 640 + 140 * dr, width: 660, height: 150 + 0 * dr, borderRadius: 8, background: "linear-gradient(#4a4e52,#1a1e22)", boxShadow: "0 18px 24px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 600, height: 100, borderRadius: 6, background: "repeating-linear-gradient(90deg,#2a2e32 0 4px,#3a3e42 4px 120px)", boxShadow: "inset 0 10px 16px rgba(0,0,0,.6)" }} /></div>
    {dr > 0.6 && <div style={{ position: "absolute", left: 960 - 50, top: 660 + 140 * dr, width: 100, height: 100, borderRadius: "50%", transform: `scaleX(${Math.cos(spin * 12) * Math.exp(-spin * 0.6) || 0.05})`, background: "radial-gradient(circle at 35% 30%,#f8e090,#b8902a 60%,#7a5a1a)", boxShadow: "0 6px 8px rgba(0,0,0,.5)" }} />}
  </Cam>;
}} />;

// m19 · año por año: la reja con vertedera voltea una franja de tierra oscura; de cada terrón sube una tablita con el año en su palito, con rebote, y la anterior se hunde
const FY: [string, number][] = [["1954", 0], ["1955", 1], ["1956", 2], ["late 50s", 3], ["1962–63", 4], ["1963", 5], ["1964", 6], ["late 60s", 7]];
const HFurrowYears: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), B = FY.map(([, i]) => Math.max(0.2 + i * 0.1, bt(h, i, 0.4 + i * 2.6))), cur = B.filter((b) => tt >= b).length - 1, px = 160 + 1600 * eio(tt, 0, d * 0.95);
  return <Cam tt={tt} d={d} z={0.04} fx={px} fy={640}>
    <div style={{ position: "absolute", left: -400, top: 560, width: 2720, height: 600, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 3px,transparent 3px 14px), linear-gradient(#9a9a52,#5a5a2a)" }} />
    <div style={{ position: "absolute", left: -400, top: 640, width: px + 400 - 60, height: 120, background: `${TIERRA}, linear-gradient(#2a1a0a,#4a3018)`, borderRadius: "0 60px 60px 0" }} />
    {FY.map(([y], i) => { const x = 160 + 1600 * (B[i] / (d * 0.95)) - 40, up = i <= cur ? 1 - Math.exp(-(tt - B[i]) * 5) * Math.cos((tt - B[i]) * 12) : 0, sink = i < cur ? eio(tt, B[i + 1], B[i + 1] + 0.5) : 0; if (i > cur) return null; return <div key={y}>
      <div style={{ position: "absolute", left: x - 60, top: 640, width: 120, height: 60, borderRadius: "50% 50% 30% 30%", background: `${TIERRA}, linear-gradient(#5a3e1e,#2a1a0a)`, boxShadow: "0 10px 12px rgba(0,0,0,.4)" }} />
      <Tablita x={x} y={660 - 60 * up + 120 * sink} txt={y} size={i === cur ? 70 : 44} o={1 - 0.5 * sink} red={i === 4} /></div>; })}
    <Sombra x={px} y={720} w={500} o={0.4} />
    <Prop id="moldboard" x={px} y={760} w={520} sh={0} r={2 * Math.sin(tt * 10)} />
    <Dust tt={tt} at={tt - 0.3} x={px - 160} y={660} w={220} />
  </Cam>;
}} />;

// m21 · todo en un minuto: el frasco de vidrio; cae una cucharada en caída libre con partículas y se asienta en tres capas (pasto oscuro, subsuelo pardo, polvo claro) con su etiqueta
const HSoilJar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = [["#2a1a0a", "SOD"], ["#7a5a32", "SUBSOIL"], ["#d8c49a", "DUST"]] as [string, string][], at = (k: number) => 0.2 + k * (d - 1.6) / 3, jx = 960, jb = 960, JH = 600, JW = 380;
  const lv = (k: number) => eio(tt, at(k) + 0.5, at(k) + 1.1), cur = L.findIndex((_, k) => tt < at(k) + 0.6), lab = cur < 0 ? 2 : Math.max(0, cur - 1);
  let base = jb - 40;
  return <Cam tt={tt} d={d} z={0.05}>
    <Luz />
    <Mesa y0={760} />
    <Sombra x={jx} y={jb} w={520} o={0.55} />
    {L.map(([c], k) => { const hh = 140 * lv(k); const y = base - hh; base = y; return <div key={k} style={{ position: "absolute", left: jx - JW / 2 + 16, top: y, width: JW - 32, height: hh, background: `${TIERRA}, ${c}`, borderRadius: "0 0 16px 16px" }} />; })}
    {L.map(([c], k) => { const p = cl((tt - at(k)) / 0.6); if (p <= 0 || p >= 1) return null; return Array.from({ length: 14 }, (_, j) => <div key={k + "_" + j} style={{ position: "absolute", left: jx - 40 + (j % 5) * 20 + 30 * Math.sin(j), top: 200 + 560 * p * p + (j % 3) * 18, width: 16, height: 14, borderRadius: "40%", background: c }} />); })}
    <div style={{ position: "absolute", left: jx - JW / 2, top: jb - JH, width: JW, height: JH, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(90deg,rgba(255,255,255,.28),rgba(255,255,255,.05) 30%,rgba(255,255,255,.05) 70%,rgba(255,255,255,.3))", boxShadow: "inset 0 0 0 6px rgba(220,235,240,.6)" }} />
    <div style={{ position: "absolute", left: jx - JW / 2 - 10, top: jb - JH - 50, width: JW + 20, height: 60, borderRadius: 10, background: "linear-gradient(#e8ecf0,#8a8e92)" }} />
    <div style={{ position: "absolute", left: jx + JW / 2 + 40, top: 600, padding: "16px 34px", borderRadius: 8, background: "linear-gradient(#f4ecd8,#ddd0b0)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#3a2410", transform: `rotate(${-4 + swing(tt, at(lab) + 0.6, 6, 6, 2)}deg)` }}>{L[lab][1]}</div>
  </Cam>;
}} />;

export const HCB5: Record<string, C> = {
  flatCutter: HFlatCutter, emptyStand: HEmptyStand, deskPlate: HDeskPlate, billEnvelopes: HBillEnvelopes, soilJar: HSoilJar,
};
// ronda b4: estas bajaron frente a su versión anterior (ruth_b4) → quedan de reserva
export const HCB5_RESERVA: Record<string, C> = { poodWeight: HPoodWeight, moldboard: HMoldboard, bareFallow: HBareFallow, windComb: HWindComb, stripPlots: HStripPlots, furrowYears: HFurrowYears };
