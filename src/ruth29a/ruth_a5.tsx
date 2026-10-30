// ruth29a · 4ª vuelta (29-oct): los 15 más bajos de la ronda 3 rehechos con el cambio concreto del evaluador.
// Objetos FOTORREALES (public/img/<slug>/cut), todo entero en cuadro, acción a los 0,3 s, sombra de contacto, nada de rótulos de esquina.
import React from "react";
import { cl, eio } from "./hkit";
import { Odo, Sello } from "./obj";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#a8c0d0 0%,#e8e4d0 42%,#8a9a5a 43%,#3a5022 100%)";
const CORK = "radial-gradient(circle at 30% 30%,rgba(0,0,0,.12) 1px,transparent 2px) 0 0/9px 9px, radial-gradient(circle at 70% 60%,rgba(255,230,180,.12) 2px,transparent 3px) 0 0/15px 13px, linear-gradient(#b48c5a,#8a6a40)";
const PAPEL = "radial-gradient(circle at 20% 30%,rgba(120,90,40,.08) 2px,transparent 3px) 0 0/30px 26px, linear-gradient(135deg,#efe2c0,#d8c498)";
const Sombra: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.5 }) => <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: "50%", background: `radial-gradient(ellipse,rgba(0,0,0,${o}),transparent 70%)` }} />;
const Ant: React.FC<{ tt: number; x: number; y: number; w: number; id?: string; r?: number; o?: number; flip?: boolean; style?: React.CSSProperties }> = ({ tt, x, y, w, id = "fire_ant", r = 0, o = 1, flip, style }) => <Prop id={id} x={x} y={y - Math.abs(Math.sin(tt * 14 + x)) * w * 0.02} w={w} r={r + 2 * Math.sin(tt * 14 + x)} o={o} flip={flip} sh={0.6} style={style} />;

// silueta del Sureste (lon/lat aproximados → px); cada estado una pieza
const ST: [string, number[][]][] = [
  ["TX", [[-106.6, 32], [-103, 32], [-103, 36.5], [-100, 36.5], [-100, 34.6], [-94.5, 33.6], [-94, 29.7], [-97.2, 26], [-99.5, 27.5], [-104.5, 29.6]]],
  ["LA", [[-94, 33], [-91.2, 33], [-91.6, 31], [-89.6, 31], [-89.6, 29.2], [-93.8, 29.7]]],
  ["AR", [[-94.5, 36.5], [-90.2, 36.5], [-91.2, 33], [-94, 33]]],
  ["MS", [[-91.2, 35], [-88.2, 35], [-88.4, 30.3], [-89.6, 30.2], [-89.6, 31], [-91.6, 31]]],
  ["AL", [[-88.2, 35], [-85.6, 35], [-85, 32], [-85, 31], [-87.6, 31], [-87.9, 30.3], [-88.4, 30.3]]],
  ["TN", [[-90.2, 35], [-90.2, 36.5], [-81.7, 36.6], [-84.3, 35]]],
  ["GA", [[-85.6, 35], [-83.1, 35], [-81, 32], [-81.4, 30.7], [-85, 30.7], [-85, 32]]],
  ["FL", [[-87.6, 31], [-85, 31], [-85, 30.7], [-81.4, 30.7], [-80, 26.9], [-80.4, 25.2], [-81.8, 26], [-82.7, 28], [-83.6, 29.9], [-85.3, 29.7], [-87.4, 30.4]]],
  ["SC", [[-83.1, 35], [-81, 35.2], [-78.6, 33.9], [-80.9, 32.1]]],
];
const pt = (ox: number, oy: number, s: number) => ([lo, la]: number[]) => [ox + (lo + 107) * 36 * s, oy + (37.5 - la) * 48 * s];
const Mapa: React.FC<{ ox: number; oy: number; s: number; fill: (k: number) => number; base?: string; red?: string; lift?: (k: number) => number }> = ({ ox, oy, s, fill, base = "#e8d8b0", red = "#b8261e", lift = () => 0 }) =>
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <defs>{ST.map(([n, P]) => <clipPath key={n} id={"st" + n}><polygon points={P.map(pt(ox, oy, s)).map((p) => p.join(",")).join(" ")} /></clipPath>)}</defs>
    {ST.map(([n, P], k) => { const Q = P.map(pt(ox, oy, s)), xs = Q.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs), f = fill(k), L = lift(k); return <g key={n} transform={`translate(0,${-L})`}>
      <polygon points={Q.map((p) => `${p[0] + 6},${p[1] + 10 + L}`).join(" ")} fill="rgba(0,0,0,.28)" />
      <polygon points={Q.map((p) => p.join(",")).join(" ")} fill={base} stroke="#6a5030" strokeWidth={3} />
      {f > 0 && <rect clipPath={`url(#st${n})`} x={x0 - 20} y={0} width={(x1 - x0 + 40) * f} height={1080} fill={red} opacity={0.88} />}
      {f > 0 && f < 1 && <rect x={x0 - 20 + (x1 - x0 + 40) * f - 14} y={Math.min(...Q.map((p) => p[1])) - 30} width={28} height={70} rx={8} fill="#5a3418" />}</g>; })}
  </svg>;

// el avión amarillo: cruza bajo de izquierda a derecha con su sombra en el pasto; la nube de polvo con volumen envuelve cada vaca de a una y la vuelve gris
const HPlaneDust: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), px = -300 + 2500 * eio(tt, 0, d * 0.8), CW = [[420, 880, 300], [820, 930, 340], [1240, 870, 290], [1620, 920, 320]];
  return <Cam tt={tt} d={d} z={0.04} fy={640}>
    {CW.map(([x, y, w], k) => { const g = cl((px - x - 200) / 500); return <div key={k}><Sombra x={x} y={y} w={w * 0.9} o={0.4} /><Prop id="cow" x={x} y={y} w={w} flip={k % 2 === 1} sh={0} style={{ filter: `grayscale(${g}) brightness(${1 - 0.25 * g})` }} /></div>; })}
    {Array.from({ length: 22 }, (_, k) => { const age = k * 0.18, x = px - 200 - k * 110, o = cl(1 - age / 4) * cl((px - 200 - x) / 100); if (x < -300 || o <= 0) return null; const s = 1 + age * 0.35; return <div key={k} style={{ position: "absolute", left: x - 160 * s, top: 520 + 80 * age - 140 * s, width: 320 * s, height: 300 * s, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,rgba(236,232,220,.85),rgba(210,205,190,.5) 45%,rgba(200,195,180,0) 70%)", opacity: o, filter: "blur(4px)" }} />; })}
    <Sombra x={px - 60} y={780} w={700} o={0.35} />
    <Prop id="crop_duster" x={px} y={470 + 10 * Math.sin(tt * 2.4)} w={900} r={-2} sh={0} />
  </Cam>;
}} />;

// del tamaño de un grano de arroz: sobre la regla de madera, hormiga y grano chicos y desenfocados; la lupa entra con resorte y DENTRO se ven a x6, nítidos
const HRiceScale: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), k = eio(tt, 0, 1.0), sp = swing(tt, 1.0, 1, 6, 2.5), lx = 1500 - 560 * k + 20 * sp, ly = 600, R = 300, ax = 900, ay = 760;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={640} tone="#c8a878" />
    <div style={{ position: "absolute", left: 360, top: 760, width: 1200, height: 110, background: "repeating-linear-gradient(90deg,#3a2410 0 3px,transparent 3px 40px), linear-gradient(#e8c890,#b8905a)", boxShadow: "0 16px 18px rgba(0,0,0,.45)", borderRadius: 6 }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: i * 120 + 4, top: 52, fontFamily: SER, fontWeight: 900, fontSize: 34, color: "#3a2410" }}>{i}</div>)}</div>
    <div style={{ filter: "blur(2px)" }}><Ant tt={tt} x={ax - 30} y={ay} w={70} /><Prop id="rice_grain" x={ax + 60} y={ay} w={44} sh={0.4} /></div>
    <Sombra x={lx + 60} y={900} w={560} o={0.35} />
    <div style={{ position: "absolute", left: lx + R * 0.62, top: ly + R * 0.62, width: 90, height: 420, borderRadius: 30, transformOrigin: "45px 0", transform: "rotate(-40deg)", background: "linear-gradient(90deg,#3a1e0e,#8a5a32,#3a1e0e)", boxShadow: "0 20px 20px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: lx - R, top: ly - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 26px #b8903a, 0 0 0 32px #6a4a1a, 0 30px 40px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,#3a2410 0 6px,transparent 6px 240px) 0 62%/100% 40% no-repeat, linear-gradient(#e0c090,#b8905a) 0 100%/100% 45% no-repeat, linear-gradient(#c8a878,#a88458)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: k, transform: `scale(${0.4 + 0.6 * k})`, transformOrigin: "50% 60%" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 2 * R, height: 2 * R }}><Ant tt={tt} x={R - 60} y={R + 170 + 1080 - 2 * R} w={420} /><Prop id="rice_grain" x={R + 190} y={R + 160 + 1080 - 2 * R} w={210} sh={0.5} /></div></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 30%)" }} /></div>
  </Cam>;
}} />;

// al puerto: mapa de papel del Golfo; el carguero grande con la bodega llena de tierra navega hasta Mobile; la chincheta cae; el barco se escora, cae el montículo y salen hormigas grandes de a una
const HPortRoute: C = ({ t, h }) => <S t={t} h={h} bg={PAPEL} f={(tt) => {
  const d = D(h), arr = d * 0.45, sx = 1480 - 540 * eio(tt, 0, arr), tilt = eio(tt, arr, arr + 0.5) * (1 - eio(tt, arr + 1.2, arr + 1.8)), pile = land(tt, arr + 0.5, 200), MX = 940, MY = 520;
  return <Cam tt={tt} d={d} z={0.05} fx={MX} fy={MY + 120}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M-50 520 C200 560 420 540 600 560 C760 580 860 520 940 520 C1040 520 1100 600 1240 600 C1360 600 1420 700 1500 820 C1560 900 1640 980 1700 1100 L-50 1100 Z" fill="#a8c8d8" opacity={0.0} />
      <path d="M-50 -10 L-50 520 C200 560 420 540 600 560 C760 580 860 520 940 520 C1040 520 1100 600 1240 600 C1360 600 1420 700 1500 820 C1560 900 1640 980 1700 1100 L1980 1100 L1980 -10 Z" fill="#e2cfa0" stroke="#7a5a30" strokeWidth={4} />
      <path d="M-50 1100 L-50 520 C200 560 420 540 600 560 C760 580 860 520 940 520 C1040 520 1100 600 1240 600 C1360 600 1420 700 1500 820 C1560 900 1640 980 1700 1100 Z" fill="#9cbccc" />
      {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${100 + k * 230} ${720 + (k % 2) * 90} q30 -12 60 0 t60 0`} stroke="rgba(40,70,90,.35)" strokeWidth={3} fill="none" />)}
      <path d={`M1780 900 Q1300 760 ${MX + 60} ${MY + 90}`} stroke="#7a3a2a" strokeWidth={5} strokeDasharray="16 12" fill="none" opacity={0.7} /></svg>
    <Sello tt={tt} at={0.3} x={MX - 30} y={MY - 80} txt="MOBILE" size={50} r={-6} />
    {pile.on && <><Sombra x={MX - 40} y={MY + 30} w={320} /><Prop id="ant_mound" x={MX - 40} y={MY + 30 + pile.dy} w={300} sq={pile.sq} sh={0} /></>}
    {[0, 1, 2, 3, 4].map((k) => { const a = arr + 1.2 + k * 0.45, p = eio(tt, a, a + 1.6); if (tt < a) return null; const ang = -2.6 + k * 0.6; return <Ant key={k} tt={tt} x={MX - 40 + Math.cos(ang) * 340 * p} y={MY + 10 - (90 + 70 * (k % 3)) * p} w={120} r={ang * 30} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${sx}px ${MY + 120}px`, transform: `rotate(${-10 * tilt + 1.5 * Math.sin(tt * 2)}deg)` }}>
      <Prop id="cargo_ship" x={sx + 200} y={MY + 140} w={640} sh={0} />
      {!pile.on && <div style={{ position: "absolute", left: sx + 80, top: MY + 40, width: 220, height: 70, borderRadius: "50% 50% 10% 10%", background: "radial-gradient(circle at 40% 30%,#9a6a3a,#5a3a1a)" }} />}</div>
  </Cam>;
}} />;

// la segadora: a ras del pasto, la segadora grande corta en tiras; se traba en el montículo con un sacudón, saltan terrones y el enjambre trepa la barra
const HMoundMower: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), hit = bt(h, 0, d * 0.42), mx = 160 + (980 - 160) * eio(tt, 0, hit) * 1, jolt = tt > hit ? Math.exp(-(tt - hit) * 3) * Math.sin((tt - hit) * 40) : 0, MXm = 1360;
  return <Cam tt={tt} d={d} z={0.05} fy={760}>
    <div style={{ position: "absolute", left: -200, top: 600, width: 2320, height: 600, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 3px,transparent 3px 14px), linear-gradient(#7a9a4a,#3a5a22)" }} />
    {Array.from({ length: 16 }, (_, k) => { const x = 40 + k * 120, cut = x < mx - 120; return <Prop key={k} id="grass_tuft" x={x} y={980 + (k % 2) * 20} w={150} sh={0} style={{ transform: `scaleY(${cut ? 0.35 : 1})`, transformOrigin: "50% 100%" }} />; })}
    <Sombra x={MXm} y={960} w={760} />
    <Prop id="ant_mound" x={MXm} y={970} w={720} sh={0} />
    {tt > hit && Array.from({ length: 7 }, (_, k) => { const p = cl((tt - hit) / 1.1); if (p >= 1) return null; return <div key={k} style={{ position: "absolute", left: mx + 200 + (k - 3) * 60 * p * 3, top: 800 - 380 * p + 520 * p * p, width: 46, height: 38, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%,#9a6a3a,#4a2a10)", transform: `rotate(${p * 400 * (k % 2 ? 1 : -1)}deg)` }} />; })}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${-14 * jolt}px,${-10 * Math.abs(jolt)}px) rotate(${2 * jolt}deg)` }}>
      <Sombra x={mx} y={1000} w={600} o={0.45} />
      <Prop id="reel_mower" x={mx} y={1010} w={640} sh={0} /></div>
    {Array.from({ length: 9 }, (_, k) => { const a = hit + 0.5 + k * (d - hit - 1.5) / 9, p = eio(tt, a, a + 1.4); if (tt < a) return null; return <Ant key={k} tt={tt} x={MXm - 200 - (MXm - 200 - (mx + 40 + (k % 3) * 60)) * p} y={900 - 260 * p + (k % 3) * 30} w={110} r={-30 * p - 10} flip />; })}
  </Cam>;
}} />;

// el diario la llamaba amenaza: titular de una línea arriba; abajo la silueta del Sureste recortada en cartón y un pincel tiñe de rojo los nueve estados de a uno
const HNewsMenace: C = ({ t, h }) => <S t={t} h={h} bg={PAPEL} f={(tt) => {
  const d = D(h), step = (d - 1.2) / 9, f = (k: number) => eio(tt, 0.2 + k * step, 0.2 + k * step + step * 0.9);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 0, top: 70, width: 1920, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 80, color: "#1a1a1a", letterSpacing: 2 }}>FIRE ANT MENACE SPREADS</div>
    <div style={{ position: "absolute", left: 300, top: 180, width: 1320, height: 6, background: "#1a1a1a" }} />
    <Mapa ox={450} oy={240} s={1.0} fill={f} lift={(k) => 10 * swing(tt, 0.2 + k * step + step * 0.9, 1, 7, 3)} />
  </Cam>;
}} />;

// por acre: surcos arados en perspectiva; la avioneta con sombra suelta gránulos que caen y rebotan; a la derecha la balanza de muelle con la bolsa marca 2 lb
const HAcreSquare: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ab8d0 0%,#e8e4d0 40%,#7a5a32 41%,#4a3418 100%)" f={(tt) => {
  const d = D(h), px = -200 + 1700 * eio(tt, 0, d * 0.7), VX = 760, VY = 440, sc = eio(tt, 0.3, 1.4), nd = 0.55 * sc + 0.05 * swing(tt, 1.4, 1, 7, 2.5);
  return <Cam tt={tt} d={d} z={0.04}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 23 }, (_, k) => { const bx = VX + (k - 11) * 200; return <polygon key={k} points={`${VX + (k - 11) * 5},${VY} ${VX + (k - 11) * 5 + 3},${VY} ${bx + 60},1080 ${bx - 60},1080`} fill={k % 2 ? "#3a2410" : "#8a6238"} opacity={0.7} />; })}</svg>
    <Sombra x={px + 60} y={820} w={420} o={0.35} />
    {Array.from({ length: 40 }, (_, k) => { const t0 = k * 0.12, x0 = -200 + 1700 * eio(t0, 0, d * 0.7), p = cl((tt - t0) / 1.0); if (tt < t0 || x0 > 1400) return null; const y = 420 + 480 * Math.min(1, p * p) - (p > 1 ? 0 : 0) - (p >= 1 ? 0 : 0), b = p >= 1 ? 0 : 0; return <div key={k} style={{ position: "absolute", left: x0 + (k % 5) * 14 - 30, top: y - (p >= 0.95 ? 20 * Math.abs(Math.sin((tt - t0 - 1) * 9)) * Math.exp(-(tt - t0 - 1) * 4) : 0) + b + (k % 3) * 18, width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#c8c4b8)", boxShadow: "0 3px 3px rgba(0,0,0,.4)" }} />; })}
    <Prop id="crop_duster" x={px} y={420 + 10 * Math.sin(tt * 2.4)} w={640} r={-2} sh={0} />
    <div style={{ position: "absolute", left: 1640 - 3, top: 120, width: 6, height: 140, background: "#4a4a4a" }} />
    <Prop id="spring_scale" x={1640} y={560} w={200} sh={0} />
    <div style={{ position: "absolute", left: 1640 - 3, top: 560 - 392 * 0.58 - 3, width: 6, height: 6, transformOrigin: "3px 3px", transform: `rotate(${360 * nd}deg)` }}><div style={{ position: "absolute", left: 0, top: -60, width: 6, height: 66, background: "#c41e1e", borderRadius: 3 }} /></div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M1640 560 L1640 ${600 + 40 * sc}`} stroke="#5a5a5a" strokeWidth={5} /></svg>
    <Prop id="bait_bag" x={1640} y={860 + 40 * sc} w={300} r={swing(tt, 1.4, 4, 5, 2)} sh={0} />
    <div style={{ position: "absolute", left: 1560, top: 730 + 40 * sc, width: 160, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 54, color: "#3a2410", transform: "rotate(-3deg)" }}>2 lb</div>
  </Cam>;
}} />;

// dos partes del mismo gobierno: soga recta y tensa entre dos sellos de goma gigantes; un balde de lata colgado del nudo del medio; cada tirón lo bambolea
const HTugOfWar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), pulls = [0.3, d * 0.35, d * 0.6, d * 0.8], sh = pulls.reduce((s, a, k) => s + (k % 2 ? -1 : 1) * 60 * eio(tt, a, a + 0.3) * (1 - eio(tt, a + 0.6, a + 1.2)), 0), sw = pulls.reduce((s, a) => s + swing(tt, a + 0.3, 1, 6, 2), 0), ry = 470;
  const Stamp = ({ x, txt, side }: { x: number; txt: string; side: number }) => <div style={{ position: "absolute", left: x - 170, top: 250, width: 340, height: 560, transform: `rotate(${side * (6 + 4 * Math.sign(sh) * side)}deg)`, transformOrigin: "50% 100%" }}>
    <div style={{ width: 170, height: 210, margin: "0 auto", borderRadius: "85px 85px 26px 26px", background: "radial-gradient(circle at 35% 30%,#b07a42,#5a3418 70%)", boxShadow: "0 20px 26px rgba(0,0,0,.5)" }} />
    <div style={{ width: 90, height: 110, margin: "0 auto", background: "linear-gradient(90deg,#3a3e42,#b8bcc0,#3a3e42)" }} />
    <div style={{ width: 340, height: 150, borderRadius: 14, background: "linear-gradient(#8a5a2e,#3a2410)", boxShadow: "0 22px 26px rgba(0,0,0,.5)" }} />
    <div style={{ width: 340, height: 64, borderRadius: "0 0 12px 12px", background: "#a8261e", fontFamily: SER, fontWeight: 900, fontSize: 52, color: "#f4e0d0", textAlign: "center", lineHeight: "64px" }}>{txt}</div></div>;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={800} />
    <Sombra x={330} y={830} w={420} /><Sombra x={1590} y={830} w={420} />
    <Stamp x={330} txt="USDA" side={-1} />
    <Stamp x={1590} txt="FDA" side={1} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${sh}px)` }}>
      <Prop id="hemp_rope" x={960} y={ry + 64} w={1300} sh={0} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M960 ${ry + 20} L${960 + 30 * sw} ${ry + 150}`} stroke="#6a4a22" strokeWidth={8} /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `960px ${ry + 20}px`, transform: `rotate(${-14 * sw}deg)` }}><Prop id="tin_bucket" x={960} y={ry + 400} w={220} sh={0} /></div></div>
  </Cam>;
}} />;

// el veneno no distinguía: hormigas negras grandes caminan sobre el montículo; la nube verde con volumen cruza y cada una se apaga y queda panza arriba; después entran tres coloradas por un surco
const HAntArena: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), fx = -500 + 2900 * eio(tt, 0.2, d * 0.5), back = Math.max(d * 0.55, bt(h, 0, d * 0.6)), AN = [[420, 830], [700, 900], [960, 820], [1220, 910], [1480, 840], [1700, 900]];
  return <Cam tt={tt} d={d} z={0.05} fy={780}>
    <div style={{ position: "absolute", left: -200, top: 640, width: 2320, height: 560, background: "radial-gradient(circle at 30% 30%,rgba(0,0,0,.14) 2px,transparent 3px) 0 0/20px 18px, linear-gradient(#a07a4a,#5a3a1a)" }} />
    {AN.map(([x, y], k) => { const hit = cl((fx - x) / 300), dead = hit >= 1, wx = x + (dead ? 0 : 30 * Math.sin(tt * 1.5 + k)); return <div key={k}><Sombra x={wx} y={y} w={200} o={0.35} /><Prop id="black_ant" x={wx} y={dead ? y - 30 : y} w={210} r={dead ? 180 : 3 * Math.sin(tt * 12 + k)} flip={k % 2 === 1} sh={0} style={{ filter: `grayscale(${hit}) brightness(${1 - 0.3 * hit})` }} /></div>; })}
    {Array.from({ length: 14 }, (_, k) => { const x = fx - k * 140, o = cl(1 - k / 14) * cl((x + 300) / 300); if (o <= 0) return null; const s = 1 + k * 0.08; return <div key={k} style={{ position: "absolute", left: x - 220 * s, top: 560 - 60 * Math.sin(k), width: 440 * s, height: 420 * s, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%,rgba(170,200,90,.8),rgba(140,170,70,.45) 45%,transparent 70%)", opacity: o * (1 - eio(tt, d * 0.5, d * 0.6)), filter: "blur(5px)" }} />; })}
    {[0, 1, 2].map((k) => { const a = back + k * 0.6, p = eio(tt, a, a + 2.2); if (tt < a) return null; return <Ant key={k} tt={tt} x={-120 + (600 + k * 380) * p} y={1000 - k * 20} w={170} />; })}
  </Cam>;
}} />;

// Silent Spring: el libro abierto; la hoja se da vuelta con curvatura y sombra; en la derecha «A Mass Experiment» grande y el resaltador barre; en la izquierda el grabado de hormigas
const HBookChapter: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), turn = eio(tt, 0, 1.0), hl = eio(tt, 1.3, 2.6), W = 1500, bx = 960, by = 900, Hh = W * 528 / 1000;
  return <Cam tt={tt} d={d} z={0.04} fy={600}>
    <Mesa y0={760} />
    <Sombra x={bx} y={by} w={1500} o={0.5} />
    <Prop id="open_book" x={bx} y={by} w={W} sh={0} />
    <div style={{ position: "absolute", left: bx - 640, top: by - Hh + 110, width: 560, height: 520, display: "flex", flexDirection: "column", alignItems: "center", opacity: eio(tt, 0.5, 1.0) }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 40, color: "#3a2a1a", marginTop: 10 }}>SILENT SPRING · 1962</div>
      <div style={{ filter: "sepia(1) contrast(1.3) grayscale(.4)", marginTop: 10, position: "relative", width: 520, height: 320 }}><Prop id="fire_ant" x={260} y={300} w={460} sh={0} /></div></div>
    <div style={{ position: "absolute", left: bx + 70, top: by - Hh + 150, width: 580, opacity: eio(tt, 0.6, 1.0) }}>
      <div style={{ position: "relative", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 76, lineHeight: 1.05, color: "#1a1208" }}>
        <div style={{ position: "absolute", left: -10, top: 6, width: 590 * hl, height: 170, background: "rgba(250,230,60,.7)", mixBlendMode: "multiply", borderRadius: 6 }} />A Mass Experiment</div>
      {Array.from({ length: 6 }, (_, k) => <div key={k} style={{ marginTop: 18, height: 10, width: 540 - (k % 3) * 60, background: "rgba(40,30,20,.25)", borderRadius: 5 }} />)}</div>
    {turn < 1 && <div style={{ position: "absolute", left: bx, top: by - Hh + 40, width: 690, height: Hh - 80, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-180 * turn}deg)`, background: `linear-gradient(90deg,rgba(0,0,0,${0.25 * Math.sin(turn * Math.PI)}),transparent 40%), linear-gradient(#f4ead0,#e0d0a8)`, borderRadius: "0 30px 30px 0", boxShadow: "0 10px 30px rgba(0,0,0,.35)", backfaceVisibility: "hidden" }} />}
    {turn > 0.5 && turn < 1 && <div style={{ position: "absolute", left: bx - 690, top: by - Hh + 40, width: 690, height: Hh - 80, transformOrigin: "100% 50%", transform: `perspective(1600px) rotateY(${180 - 180 * turn}deg)`, background: "linear-gradient(270deg,rgba(0,0,0,.2),transparent 40%), linear-gradient(#efe4c8,#dccca4)", borderRadius: "30px 0 0 30px" }} />}
    <Prop id="highlighter" x={bx + 70 + 590 * hl + 120} y={by - Hh + 300} w={300} r={-25} o={hl > 0 && hl < 1 ? 1 : 0} sh={0} />
  </Cam>;
}} />;

// los cordones de la bolsa: la mano de la granjera baja y tira del cordón; la boca se frunce en pliegues; la etiqueta de cartón APPROPRIATIONS cuelga del hilo
const HPurse: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dn = eio(tt, 0, 0.8), pull = eio(tt, 0.9, 1.8), bx = 960, by = 920;
  return <Cam tt={tt} d={d} z={0.05}>
    <Luz />
    <Mesa y0={780} />
    <Sombra x={bx} y={by} w={560} o={0.55} />
    <Prop id="leather_purse" x={bx} y={by} w={560} sh={0} style={{ transform: `scaleX(${1 - 0.06 * pull})` }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[-90, -30, 30, 90].map((o, k) => <path key={k} d={`M${bx + o * (1 - 0.4 * pull)} ${by - 520} q${8 * (k - 1.5)} 40 0 ${70 * pull}`} stroke="rgba(40,20,8,.55)" strokeWidth={6} fill="none" opacity={pull} />)}
      <path d={`M${bx - 40} ${by - 540} C${bx - 100} ${by - 640 - 120 * pull} ${bx + 220} ${by - 620 - 200 * pull} ${bx + 260 + 60 * pull} ${by - 700 - 160 * pull}`} stroke="#8a5a2a" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={`M${bx + 120} ${by - 520} L${bx + 210 + 20 * swing(tt, 1.8, 1, 5, 2)} ${by - 430}`} stroke="#c8b080" strokeWidth={4} /></svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${bx + 210}px ${by - 430}px`, transform: `rotate(${-12 + 14 * swing(tt, 1.8, 1, 5, 2)}deg)` }}>
      <Prop id="cardboard_tag" x={bx + 260} y={by - 430 + 300} w={220} sh={0} />
      <div style={{ position: "absolute", left: bx + 160, top: by - 300, width: 200, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 25, color: "#3a2410", transform: "rotate(90deg)" }}>APPROPRIATIONS</div></div>
    <Prop id="hand_glove" x={bx + 300 + 60 * pull} y={by - 640 - 160 * pull - 600 * (1 - dn)} w={480} r={-20} sh={0} />
  </Cam>;
}} />;

// el cebo por dentro: la bolita cortada al medio; las mitades se separan girando hacia cámara y muestran el anillo de aceite brillante y el núcleo rojo; el cuchillo queda apoyado al lado
const HBaitGrain: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = eio(tt, 0.2, 1.4), W = 520, cx = 960, cy = 860, R = W * 0.42;
  const Half = ({ s }: { s: number }) => <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${cy - R}px`, transform: `translateX(${s * 190 * op}px) perspective(1200px) rotateY(${s * 15 * op}deg) rotate(${s * 6 * op}deg)` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: s < 0 ? `inset(0 ${1920 - cx}px 0 0)` : `inset(0 0 0 ${cx}px)` }}><Prop id="bait_ball" x={cx} y={cy} w={W} sh={0} /></div>
    <div style={{ position: "absolute", left: cx - 70 * op, top: cy - W * 0.985 * 0.98, width: 140 * op, height: W * 0.95, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%,#c41e1e 0 16%,#e8b850 19% 34%,#fff2b0 38%,#d8aa50 44%,#b88a3a 70%,#9a7030 100%)", opacity: op > 0.05 ? 1 : 0, boxShadow: "inset 0 0 12px rgba(255,250,200,.7)" }}><div style={{ position: "absolute", left: "20%", top: "18%", width: "30%", height: "14%", borderRadius: "50%", background: "rgba(255,255,255,.6)", filter: "blur(3px)" }} /></div></div>;
  return <Cam tt={tt} d={d} z={0.05} fy={660}>
    <Luz />
    <Mesa y0={720} />
    <Sombra x={cx} y={cy} w={W + 380 * op} o={0.5} />
    <Half s={-1} /><Half s={1} />
    <Sombra x={cx + 40} y={1010} w={760} o={0.35} />
    <Prop id="kitchen_knife" x={cx + 40} y={1010} w={760} r={-3} sh={0} />
  </Cam>;
}} />;

// al norte, la fábrica: el contorno real del lago Ontario; desde la chimenea en la orilla baja un río de tinta roja que se abre como gota en el lago; el pescado de papel cae al centro; sello cruz roja
const HLakeMap: C = ({ t, h }) => <S t={t} h={h} bg={PAPEL} f={(tt) => {
  const d = D(h), riv = eio(tt, 0.2, 2.2), drop = eio(tt, 2.0, d * 0.6), fish = land(tt, d * 0.62, 520), L = "M300 520 C360 430 520 380 700 400 C860 410 1000 360 1180 350 C1360 340 1520 330 1640 380 C1720 420 1700 500 1600 540 C1460 590 1300 600 1120 640 C940 680 760 700 560 690 C400 680 260 620 300 520 Z";
  return <Cam tt={tt} d={d} z={0.04}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><clipPath id="lago"><path d={L} /></clipPath></defs>
      <path d={L} fill="rgba(0,0,0,.25)" transform="translate(8,14)" />
      <path d={L} fill="#9cc0d4" stroke="#4a6a80" strokeWidth={5} />
      {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M${500 + k * 220} ${500 + (k % 2) * 60} q30 -12 60 0 t60 0`} stroke="rgba(40,70,90,.4)" strokeWidth={3} fill="none" />)}
      <path d={`M560 1000 C600 900 640 820 620 ${1000 - 330 * riv}`} stroke="#b8261e" strokeWidth={22} strokeLinecap="round" fill="none" strokeDasharray={`${400 * riv} 999`} />
      <g clipPath="url(#lago)"><circle cx={620} cy={680} r={20 + 900 * drop} fill="#b8261e" opacity={0.55} /></g></svg>
    <div style={{ position: "absolute", left: 470, top: 860, width: 90, height: 190, background: "linear-gradient(90deg,#5a3a2a,#9a6a4a,#4a2a1a)", boxShadow: "0 16px 18px rgba(0,0,0,.45)" }} />
    <div style={{ position: "absolute", left: 380, top: 960, width: 280, height: 110, background: "linear-gradient(#8a6a5a,#5a3a2a)", boxShadow: "0 16px 18px rgba(0,0,0,.45)" }} />
    {Array.from({ length: 6 }, (_, k) => { const p = ((tt * 0.5 + k / 6) % 1); return <div key={k} style={{ position: "absolute", left: 480 + 60 * p, top: 840 - 320 * p, width: 80 + 120 * p, height: 80 + 120 * p, borderRadius: "50%", background: "radial-gradient(circle,rgba(90,90,90,.6),transparent 70%)", opacity: 1 - p }} />; })}
    {fish.on && <><Sombra x={1100} y={560} w={300 * Math.min(1, 1 + fish.dy / 520)} o={0.4} /><Prop id="fish" x={1100} y={560 + fish.dy} w={320} sq={fish.sq} r={-8} sh={0} /></>}
    <Sello tt={tt} at={d * 0.78} x={1100} y={460} txt="✕" size={110} r={-8} />
  </Cam>;
}} />;

// en una frase: vista desde arriba del potrero; la figura de Ruth con su sombra larga; la sombra del biplano cruza con parallax y oscurece todo a su paso
const HUnderneath: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(circle at 30% 40%,rgba(0,0,0,.08) 3px,transparent 4px) 0 0/40px 36px, repeating-linear-gradient(80deg,rgba(255,255,255,.04) 0 6px,transparent 6px 30px), linear-gradient(135deg,#7a9a4a,#4a6a2a)" f={(tt) => {
  const d = D(h), sx = -600 + 3100 * eio(tt, 0, d), dark = Math.max(0, 1 - Math.abs(sx - 960) / 500);
  return <Cam tt={tt} d={d} z={0.08}>
    {Array.from({ length: 24 }, (_, k) => <Prop key={k} id="grass_tuft" x={(k * 337) % 1900 + 20} y={(k * 211) % 1000 + 60} w={90} sh={0} o={0.85} />)}
    <div style={{ position: "absolute", left: 960 - 14, top: 540 - 14, width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#c8a070,#6a4020)" }} />
    <div style={{ position: "absolute", left: 960, top: 534, width: 360, height: 16, borderRadius: 8, background: "linear-gradient(90deg,rgba(0,0,0,.55),transparent)", transform: "rotate(18deg)", transformOrigin: "0 50%" }} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,20,10,.35)", opacity: dark }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "brightness(0) blur(6px)", opacity: 0.55 }}><Prop id="crop_duster" x={sx} y={700} w={1300} r={-90} sh={0} /></div>
  </Cam>;
}} />;

// el mapa de cuarentena: cuentakilómetros de bronce grande en primer plano que frena en 370 con rebote; detrás la silueta del Sur sobre corcho, la chincheta cae en Alabama y el rojo se expande estado por estado
const HOdometer: C = ({ t, h }) => <S t={t} h={h} bg={CORK} f={(tt) => {
  const d = D(h), v = 370 * eio(tt, 0, d * 0.55) + 4 * swing(tt, d * 0.55, 1, 8, 3), pin = eio(tt, 0.2, 0.6), ord = [4, 3, 6, 7, 1, 5, 8, 2, 0], f = (k: number) => { const i = ord.indexOf(k); return eio(tt, 0.7 + i * 0.5, 1.3 + i * 0.5); };
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ filter: "blur(1.5px)" }}><Mapa ox={360} oy={120} s={1.15} fill={f} /></div>
    <Prop id="push_pin" x={360 + (-86.8 + 107) * 36 * 1.15 + 10} y={120 + (37.5 - 32.6) * 48 * 1.15 - 500 * (1 - pin)} w={70} sh={pin} />
    <Sombra x={960} y={1000} w={900} o={0.6} />
    <Odo x={960} y={880} v={Math.max(0, v)} n={3} size={180} />
  </Cam>;
}} />;

// año por año: tablero de corcho con el taco de almanaque; en cada beat se arranca una hoja, vuela en arco y se clava con chincheta y rebote (1930s, 1957, 1962, 1978 en rojo)
const HTimelineRail: C = ({ t, h }) => <S t={t} h={h} bg={CORK} f={(tt) => {
  const d = D(h), Y = [["1930s", bt(h, 0, 0.3)], ["1957", bt(h, 2, d * 0.3)], ["1962", bt(h, 5, d * 0.65)], ["1978", bt(h, 6, d * 0.85)]] as [string, number][], PX = [620, 980, 1340, 1700];
  return <Cam tt={tt} d={d} z={0.04}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M520 640 L1800 640" stroke="#7a2a1a" strokeWidth={6} strokeDasharray="4 10" /></svg>
    <Sombra x={260} y={900} w={360} o={0.5} />
    <Prop id="calendar_pad" x={260} y={900} w={340} sh={0} />
    {Y.map(([y, a], k) => { const at = Math.max(0.2, a), p = eio(tt, at, at + 0.9); if (tt < at - 0.05) return null; const x = 260 + (PX[k] - 260) * p, yy = 640 - 340 * Math.sin(p * Math.PI) + (1 - p) * 120, sw = swing(tt, at + 0.9, 8, 6, 2); return <div key={k}>
      <div style={{ position: "absolute", left: x - 140, top: yy - 120, width: 280, height: 260, transformOrigin: "50% 0", transform: `rotate(${(1 - p) * -40 + sw}deg) perspective(800px) rotateX(${(1 - p) * 40}deg)`, background: "linear-gradient(#fbf6ea,#e8dcc0)", borderTop: `34px solid ${k === 3 ? "#c41e1e" : "#3a3a3a"}`, borderRadius: "4px 4px 10px 22px", boxShadow: "0 16px 18px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 82, color: k === 3 ? "#c41e1e" : "#2a2a2a", textAlign: "center", lineHeight: "200px" }}>{y}</div>
      {p >= 1 && <Prop id="push_pin" x={x} y={yy - 100 + 40 * (1 - eio(tt, at + 0.9, at + 1.1))} w={56} sh={0} style={{ filter: k === 3 ? "hue-rotate(0deg) saturate(2)" : "none" }} />}</div>; })}
  </Cam>;
}} />;

export const HCA5_RESERVA = { underneath: HUnderneath };
export const HCA5: Record<string, C> = {
  planeDust: HPlaneDust, riceScale: HRiceScale, portRoute: HPortRoute, moundMower: HMoundMower, newsMenace: HNewsMenace, acreSquare: HAcreSquare, tugOfWar: HTugOfWar,
  antArena: HAntArena, bookChapter: HBookChapter, purse: HPurse, baitGrain: HBaitGrain, lakeMap: HLakeMap, odometer: HOdometer, timelineRail: HTimelineRail,
};
