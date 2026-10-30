// l9229c vuelta 3 (final): hoja que se dobla vista desde arriba con la mano, marco de puerta con la mano de Lou, rollo grande que cae,
// hierro de marcar de verdad, copa de cristal con pie, viruta que se dibuja y se apoya, papel que arde DENTRO de la estufa
import React from "react";
import { HAND, cl, eio, phys } from "./hkit";
import { Odo, Puff } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Dust, Cam, Mesa, Glow, Rings, land, swing } from "./pk";
import { BOX, Fondo, Formica, Ink, Nieve } from "./lk";

const PAPEL = "repeating-linear-gradient(#fdfaf0 0 44px,#c8d8e8 44px 46px)";

// la hoja vista desde arriba: la mitad de arriba se dobla sobre la de abajo, después la derecha sobre la izquierda; la mano la empuja bajo la azucarera
const HKitchenTableIn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), f1 = eio(tt, 0.9, 1.9), f2 = eio(tt, d / 2 - 0.6, d / 2 + 0.3), go = eio(tt, d / 2 + 0.6, d - 0.8), W = 820, H = 560;
  const x0 = 300 + 900 * go, y0 = 300 + 380 * go, sc = 1 - 0.55 * go;
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="lc_e19" tt={tt} b={14} br={0.4} />
    <div style={{ position: "absolute", left: 0, top: 220, width: 1920, height: 860, background: "linear-gradient(#e8c048,#d4a830)", boxShadow: "inset 0 30px 40px rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", left: x0, top: y0, width: W * sc, height: H * sc }}>
      <div style={{ position: "absolute", left: 0, top: (H / 2) * sc, width: (f2 > 0.5 ? W / 2 : W) * sc, height: (H / 2) * sc, background: PAPEL, backgroundSize: `100% ${46 * sc}px`, boxShadow: "14px 22px 24px rgba(0,0,0,.35)" }}>
        {f1 < 0.5 && <div style={{ position: "absolute", left: 40 * sc, top: 30 * sc, fontFamily: HAND, fontWeight: 700, fontSize: 64 * sc, color: "#22314f" }}>— Lou</div>}
      </div>
      <div style={{ position: "absolute", left: 0, top: (H / 2) * sc * (1 - Math.min(1, f1)) + (H / 2) * sc * Math.max(0, f1 - 0.5) * 2 * 0, width: (f2 > 0.5 ? W / 2 : W) * sc, height: (H / 2) * sc * Math.abs(1 - 2 * f1), transform: f1 < 0.5 ? "none" : "none", background: f1 < 0.5 ? PAPEL : "linear-gradient(#ebe3cc,#d8cfb4)", backgroundSize: `100% ${46 * sc}px`, boxShadow: `0 ${30 * Math.sin(f1 * Math.PI)}px 30px rgba(0,0,0,${0.35 * Math.sin(f1 * Math.PI)})`, ...(f1 >= 0.5 ? { top: (H / 2) * sc, height: (H / 2) * sc * (2 * f1 - 1) } : {}) }}>
        {f1 < 0.4 && <div style={{ position: "absolute", left: 40 * sc, top: 60 * sc, fontFamily: HAND, fontWeight: 700, fontSize: 88 * sc, color: "#22314f", transform: `scaleY(${Math.max(0.05, 1 - 2 * f1)})`, transformOrigin: "0 0" }}>I forgive you, Ray.</div>}
      </div>
      {f2 > 0 && f2 < 1 && <div style={{ position: "absolute", left: (W / 2) * sc + (W / 2) * sc * (f2 < 0.5 ? 0 : 0), top: (H / 2) * sc, width: (W / 2) * sc * Math.abs(1 - 2 * f2), height: (H / 2) * sc, ...(f2 >= 0.5 ? { left: (W / 2) * sc * (2 - 2 * f2) } : {}), background: "linear-gradient(90deg,#d8cfb4,#efe8d4)", boxShadow: `0 0 30px rgba(0,0,0,${0.4 * Math.sin(f2 * Math.PI)})` }} />}
      <div style={{ position: "absolute", left: 0, top: (H / 2) * sc - 2, width: (f2 > 0.5 ? W / 2 : W) * sc, height: 4, background: "rgba(0,0,0,.18)", opacity: f1 > 0.95 ? 1 : 0 }} />
    </div>
    {tt > d / 2 + 0.3 && tt < d - 0.4 && <Prop id="hand_flat" x={x0 - 60 + 120 * (1 - go)} y={y0 + (H / 2) * sc + 330} w={460} r={-80} sh={0} />}
    <Prop id="sugar_bowl" x={1500} y={900} w={460} />
  </Cam>;
}} />;

// el marco de la puerta de la cocina: madera pintada y gastada con rayas viejas; la mano de Lou sube con el lápiz y marca cada año hasta 34
const HDoorHeights: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ages = [9, 12, 15, 18, 22, 27, 34], seg = (d - 1.6) / ages.length, cur = Math.min(ages.length - 1, Math.max(0, Math.floor((tt - 0.4) / seg)));
  const Y = (i: number) => 900 - i * 112, fx = 560;
  return <Cam tt={tt} d={d} z={0.06} fy={540}>
    <Fondo id="lc_e24" tt={tt} b={14} br={0.4} />
    <div style={{ position: "absolute", left: fx + 300, top: -40, width: 760, height: 1160, background: "linear-gradient(90deg,#efe6cf,#f8f1df 40%,#e8dec4)", boxShadow: "inset 30px 0 40px rgba(0,0,0,.25)" }}>
      {[[60, 60, 300, 420], [400, 60, 300, 420], [60, 560, 300, 520], [400, 560, 300, 520]].map(([l, tp, w, hh], k) => <div key={k} style={{ position: "absolute", left: l, top: tp, width: w, height: hh, boxShadow: "inset 6px 6px 10px rgba(0,0,0,.18), inset -6px -6px 10px rgba(255,255,255,.6)" }} />)}
      <div style={{ position: "absolute", left: 680, top: 600, width: 46, height: 46, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f2d27a,#9a7428)" }} />
    </div>
    <div style={{ position: "absolute", left: fx, top: -40, width: 300, height: 1160, background: "repeating-linear-gradient(90deg,#ece4cf 0 3px,#f6f0de 3px 40px,#e6dcc4 40px 44px,#f3ecd8 44px 90px)", boxShadow: "inset -14px 0 20px rgba(0,0,0,.22), 20px 0 30px rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 24, height: 1160, background: "linear-gradient(90deg,#cfc2a6,#efe6d0)" }} />
      {[[0.15, 40, 30, 14], [0.48, 180, 22, 10], [0.7, 90, 40, 16], [0.86, 210, 26, 12]].map(([y, x, w, hh], k) => <div key={k} style={{ position: "absolute", left: x, top: 1160 * y, width: w, height: hh, borderRadius: 4, background: "#b8a682", boxShadow: "inset 1px 1px 2px rgba(0,0,0,.3)" }} />)}
      {[860, 720, 600, 470].map((y, k) => <div key={"o" + k} style={{ position: "absolute", left: 50, top: y + 40, width: 130, height: 5, background: "rgba(90,90,100,.28)" }} />)}
    </div>
    {ages.map((a, i) => { const at = 0.4 + i * seg, p = cl((tt - at) / 0.4); return p > 0 ? <React.Fragment key={i}>
      <div style={{ position: "absolute", left: fx + 40, top: Y(i), width: 200 * p, height: 8, background: "#34343c", borderRadius: 3, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: fx + 60, top: Y(i) - 66, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#34343c", opacity: p * 0.85 }}>{a}</div>
    </React.Fragment> : null; })}
    <Prop id="hand_pen" x={fx + 380} y={Y(cur) + 300} w={520} r={-10} sh={0.3} />
  </Cam>;
}} />;

// la lista: un rollo grande rueda por la mesa dejando la cinta ancha; a la mitad cae por el borde y la cinta queda colgando, con «37 years»
const HCostList: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), mid = d / 2, p = eio(tt, 0.3, mid), fall = tt > mid ? cl((tt - mid) / 1.4) : 0, rx = 700 + 580 * p, EDGE = 1280;
  return <Cam tt={tt} d={d} z={0.05} fy={640}>
    <Fondo id="lc_e10" tt={tt} b={10} br={0.45} />
    <Mesa y0={560} tone="#7a5a3a" />
    <div style={{ position: "absolute", left: 200, top: 520, width: Math.max(0, Math.min(rx, EDGE) - 200), height: 260, background: "linear-gradient(90deg,#efe8d4,#fbf6e8 40%,#e8e0c8)", boxShadow: "0 16px 24px rgba(0,0,0,.3)", overflow: "hidden" }}>
      <Ink tt={tt} at={1.0} dur={0.6} x={60} y={60} txt="the parties" size={120} w={600} />
      <Ink tt={tt} at={2.4} dur={0.6} x={650} y={60} txt="the sleep" size={120} w={520} />
    </div>
    {fall > 0 && <div style={{ position: "absolute", left: EDGE - 260, top: 780, width: 260, height: 300 * fall, background: "linear-gradient(90deg,#e0d8c0,#fbf6e8 45%,#d8cfb6)", boxShadow: "16px 14px 26px rgba(0,0,0,.45)" }}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 260, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 82, lineHeight: 1, color: "#b3322a", opacity: cl(fall * 3 - 1) }}>37 years</div></div>}
    <Prop id="paper_roll" x={Math.min(rx, EDGE) - 20 + 260 * fall} y={600 + 700 * fall * fall} w={460} r={-6 + 4 * Math.sin(p * 20)} sh={0.6 * (1 - fall)} />
  </Cam>;
}} />;

// 37: el hierro de marcar (vara de acero, cabeza al rojo con el número) baja, la madera se chamusca desde el borde del número y sube humo en hilos
const HGrudgeNumber: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), down = eio(tt, 0.3, 1.0), press = tt > 1.0 && tt < d / 2 + 0.4, lift = eio(tt, d / 2 + 0.4, d / 2 + 1.2), burn = cl((tt - 1.0) / 1.6), hy = 560 - 360 * (1 - down) - 420 * lift, heat = 1 - 0.6 * lift;
  return <Cam tt={tt} d={d} z={0.08} fy={720}>
    <Fondo id="lc_e03" tt={tt} b={12} br={0.4} />
    <Prop id="wood_board" x={960} y={1010} w={1500} />
    <div style={{ position: "absolute", left: 960 - 330, top: 640, width: 660, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(40,18,4,.75),rgba(80,40,12,.4) 55%,transparent 72%)", opacity: burn, transform: "perspective(900px) rotateX(55deg)" }} />
    <div style={{ position: "absolute", left: 560, top: 600, width: 800, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 320, color: "#1e0c02", opacity: burn, transform: "perspective(900px) rotateX(55deg)", textShadow: `0 0 ${24 * (1 - lift)}px rgba(255,110,20,${0.9 * (1 - lift)})` }}>37</div>
    <div style={{ position: "absolute", left: 960 + 120, top: hy - 640, width: 26, height: 700, background: "linear-gradient(90deg,#3a3a3e,#8a8a90,#2a2a2e)", transform: "rotate(14deg)", transformOrigin: "50% 100%", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 960 + 280, top: hy - 760, width: 90, height: 90, borderRadius: "50%", border: "18px solid #4a4a50", transform: "rotate(14deg)" }} />
    <div style={{ position: "absolute", left: 960 - 260, top: hy, width: 520, height: 70, borderRadius: 12, background: `linear-gradient(#3a2a22,rgba(255,${90 + 60 * heat},20,${heat}) 70%)`, boxShadow: `0 0 ${50 * heat}px ${10 * heat}px rgba(255,110,20,${0.7 * heat})` }} />
    {burn > 0 && Array.from({ length: 7 }, (_, k) => { const q = (tt * 0.5 + k / 7) % 1; return <div key={k} style={{ position: "absolute", left: 700 + 80 * k + 40 * Math.sin(q * 7 + k), top: 640 - 460 * q, width: 8, height: 120 + 80 * q, borderRadius: 6, background: "linear-gradient(rgba(220,220,225,0),rgba(220,220,225,.6),rgba(220,220,225,0))", filter: "blur(4px)", opacity: (1 - q) * burn, transform: `rotate(${20 * Math.sin(q * 5 + k)}deg)` }} />; })}
    {press && Array.from({ length: 10 }, (_, k) => { const q = (tt * 1.3 + rnd(k)) % 1; return <div key={"e" + k} style={{ position: "absolute", left: 720 + 480 * rnd(k + 2), top: 660 - 240 * q, width: 8, height: 8, borderRadius: "50%", background: "#ffb040", boxShadow: "0 0 10px #ff7a20", opacity: 1 - q }} />; })}
  </Cam>;
}} />;

// copa de cristal tallado con pie (SVG): sube, se inclina en la risa, la gota cae con corona y la mancha se chupa la tela del mantel con pliegues
const Copa: React.FC<{ x: number; y: number; r: number; lvl: number }> = ({ x, y, r, lvl }) => <svg width={420} height={520} style={{ position: "absolute", left: x - 210, top: y - 520, transform: `rotate(${r}deg)`, transformOrigin: "50% 100%", overflow: "visible", filter: "drop-shadow(10px 18px 14px rgba(0,0,0,.35))" }}>
  <defs><linearGradient id="cr" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.75)" /><stop offset=".3" stopColor="rgba(220,230,240,.25)" /><stop offset=".7" stopColor="rgba(255,255,255,.55)" /><stop offset="1" stopColor="rgba(200,210,225,.3)" /></linearGradient></defs>
  <path d={`M70,${60 + 140 * (1 - lvl)} L350,${60 + 140 * (1 - lvl)} Q330,280 210,300 Q90,280 70,${60 + 140 * (1 - lvl)} Z`} fill="#b3101e" opacity={0.9} />
  <path d="M60,40 L360,40 Q340,290 210,312 Q80,290 60,40 Z" fill="url(#cr)" stroke="rgba(255,255,255,.85)" strokeWidth={4} />
  {[100, 160, 220, 280, 330].map((xx, k) => <path key={k} d={`M${xx},60 L${210 + (xx - 210) * 0.4},290`} stroke="rgba(255,255,255,.5)" strokeWidth={3} />)}
  <rect x={198} y={310} width={24} height={150} fill="url(#cr)" stroke="rgba(255,255,255,.7)" strokeWidth={2} />
  <ellipse cx={210} cy={480} rx={110} ry={26} fill="url(#cr)" stroke="rgba(255,255,255,.8)" strokeWidth={3} />
</svg>;
const HPunchToast: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.3, 1.0), tilt = 26 * eio(tt, 1.2, 2.0) + (tt > 2.0 ? swing(tt, 2.0, 5, 5, 0.9) : 0), drop = 1.9, dy = cl((tt - drop) / 0.5), st = eio(tt, drop + 0.5, d - 1);
  return <Cam tt={tt} d={d} z={0.07} fy={760}>
    <Fondo id="lc_e16" tt={tt} b={10} br={0.5} />
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(90deg,#efede4,#fbfaf4 8%,#e4e0d4 14%,#fbfaf4 22%,#f1eee6 34%,#fbfaf4 46%,#e6e2d6 52%,#fbfaf4 62%,#efece4 76%,#fbfaf4 88%,#e8e4d8)", boxShadow: "inset 0 24px 30px rgba(0,0,0,.18)" }} />
    <Copa x={880} y={960 - 360 * up} r={tilt} lvl={0.85 - 0.1 * eio(tt, drop, drop + 0.3)} />
    {tt > drop && dy < 1 && <div style={{ position: "absolute", left: 1040, top: 520 + 420 * dy * dy, width: 34, height: 46, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#ff9a9a,#b00818 60%)" }} />}
    {tt > drop + 0.5 && tt < drop + 1.2 && Array.from({ length: 12 }, (_, k) => { const s = (tt - drop - 0.5) / 0.7, a = Math.PI * (0.08 + 0.84 * k / 11); return <div key={k} style={{ position: "absolute", left: 1056 - Math.cos(a) * 170 * s, top: 950 - Math.sin(a) * 130 * s + 180 * s * s, width: 14, height: 14, borderRadius: "50%", background: "#b00818", opacity: 1 - s }} />; })}
    {st > 0 && Array.from({ length: 8 }, (_, k) => { const r = (70 + 100 * rnd(k)) * st; return <div key={"s" + k} style={{ position: "absolute", left: 1056 + (rnd(k + 4) - 0.5) * 260 * st - r, top: 975 + (rnd(k + 6) - 0.5) * 60 * st - r * 0.3, width: r * 2, height: r * 0.6, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(170,10,30,.85),rgba(200,40,60,.45) 55%,transparent 72%)", filter: "blur(2px)" }} />; })}
  </Cam>;
}} />;

// la viruta: el cepillo avanza y de su boca sale una cinta translúcida que se levanta, hace UN rizo flojo y se apoya larga sobre la tabla
const HPlaneShaving: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.6), x = 520 + 900 * p, L = 1400 * p;
  const path = `M${x - 80},800 C${x - 140},640 ${x - 300},600 ${x - 340},700 S${x - 260},820 ${x - 380},800 S${x - 600},760 ${x - 760},800 S${x - 1000},830 ${x - 1200},805`;
  return <Cam tt={tt} d={d} z={0.06} fx={x} fy={760}>
    <Fondo id="lc_e27" tt={tt} b={10} br={0.45} />
    <Prop id="wood_board" x={960} y={1000} w={1760} />
    <div style={{ position: "absolute", left: 200, top: 800, width: Math.max(0, x - 200), height: 50, background: "linear-gradient(#f8e8c4,#eed6a2)", opacity: 0.8, boxShadow: "inset 0 2px 3px rgba(255,255,255,.6)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={path} fill="none" stroke="rgba(60,40,20,.35)" strokeWidth={34} strokeDasharray={`${L} 4000`} transform="translate(12,18)" style={{ filter: "blur(7px)" }} />
      <path d={path} fill="none" stroke="#d8a868" strokeWidth={30} strokeLinecap="round" strokeDasharray={`${L} 4000`} opacity={0.92} />
      <path d={path} fill="none" stroke="#fae4b4" strokeWidth={12} strokeLinecap="round" strokeDasharray={`${L} 4000`} opacity={0.8} />
    </svg>
    <Prop id="old_plane2" x={x} y={880} w={540} r={Math.sin(tt * 18) * 0.8} sh={0.8} />
  </Cam>;
}} />;

// quemar el papel: la hoja vuela a la puerta abierta, se achica al entrar y arde ADENTRO, ennegreciéndose desde el borde; brasas que suben por el caño
const HStoveBurn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fly = eio(tt, 0.4, 1.8), burn = cl((tt - 1.8) / (d - 3)), sx = 420 + 630 * fly, sy = 300 + 210 * fly - 220 * Math.sin(fly * Math.PI), w = 240 - 110 * fly - 90 * burn;
  return <Cam tt={tt} d={d} z={0.08} fx={980} fy={760}>
    <Fondo id="lc_e26" tt={tt} b={10} br={0.4} />
    <Prop id="wood_stove" x={1000} y={1060} w={820} />
    <Glow x={1050} y={510} r={300} o={0.7 + 0.6 * burn + 0.2 * Math.sin(tt * 9)} col="255,140,40" />
    {w > 8 && <div style={{ position: "absolute", left: sx - w / 2, top: sy - w * 0.65, width: w, height: w * 1.3, background: `linear-gradient(${30 + 200 * burn}deg,#1a0d06 ${burn * 70}%,#ff8a20 ${burn * 70 + 6}%,#f4efe2 ${burn * 70 + 14}%)`, boxShadow: `0 0 ${20 * burn}px rgba(255,120,20,${burn})`, transform: `rotate(${fly * 200 + burn * 60}deg) skewX(${20 * burn}deg)`, borderRadius: `${30 * burn}%` }} />}
    {burn > 0 && Array.from({ length: 24 }, (_, k) => { const q = (tt * 0.9 + rnd(k)) % 1; return <div key={k} style={{ position: "absolute", left: 1050 + 140 * (rnd(k + 2) - 0.5) + 60 * Math.sin(q * 8 + k), top: 510 - 500 * q, width: 12, height: 12, borderRadius: "50%", background: "#ffc050", boxShadow: "0 0 16px 4px #ff7a20", opacity: (1 - q) * cl(burn * 3) }} />; })}
  </Cam>;
}} />;

export const HCC3: Record<string, C> = {
  kitchenTableIn: HKitchenTableIn, doorHeights: HDoorHeights, costList: HCostList, grudgeNumber: HGrudgeNumber,
  punchToast: HPunchToast, planeShaving: HPlaneShaving, stoveBurn: HStoveBurn,
};
