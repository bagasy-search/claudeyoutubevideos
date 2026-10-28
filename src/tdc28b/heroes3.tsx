// componentes únicos de tdc28b · 25-39 (minutos 17-32): enfriado, parrilla, controles, distancias, monóxido, el día medido, encendido, leña, serpentín, comentarios
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { DrumSide } from "./heroes1";

// ---- 17:30 · LO MEDÍ: dos curvas de temperatura después de apagar; la lata cae en 2 h, la de ladrillos sigue caliente a las 4 h ----
export const HCooling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const X = (hr: number) => 360 + hr * 210, Y = (v: number) => 880 - v * 38, a = eio(tt, 0.8, 3.0), b = eio(tt, 2.6, 5.4);
  const ca = (hr: number) => 2 + 14 * Math.exp(-hr * 1.6), cb = (hr: number) => 2 + 14 * Math.exp(-hr * 0.28);
  const path = (f: (x: number) => number, p: number) => Array.from({ length: 61 }, (_, i) => i / 10).filter((x) => x <= 6 * p).map((x, i) => `${i ? "L" : "M"}${X(x)} ${Y(f(x))}`).join(" ");
  return <>
    <Head tt={tt} kick="LO MEDÍ CON EL TERMÓMETRO" title="DESPUÉS DE APAGARSE" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={360} y1={880} x2={1640} y2={880} stroke="rgba(255,255,255,.3)" strokeWidth={3} /><line x1={360} y1={880} x2={360} y2={260} stroke="rgba(255,255,255,.3)" strokeWidth={3} />
      <line x1={360} y1={Y(2)} x2={1640} y2={Y(2)} stroke={ICE} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => <text key={k} x={X(k)} y={930} fill={DIM} fontSize={30} fontWeight={800} textAnchor="middle">{k} h</text>)}
      <path d={path(ca, a)} stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d={path(cb, b)} stroke={AMB} strokeWidth={12} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 14px rgba(255,178,87,.6))" }} />
    </svg>
    <div style={{ position: "absolute", left: X(2) + 20, top: Y(ca(2)) - 90, fontWeight: 900, fontSize: 34, color: RED, opacity: cl(a * 3 - 2) }}>SIN LADRILLOS: COMO AFUERA</div>
    <div style={{ position: "absolute", left: X(4) - 60, top: Y(cb(4)) - 80, fontWeight: 900, fontSize: 34, color: AMB, opacity: cl(b * 3 - 2) }}>CON LADRILLOS: +6° A LAS 4 h</div>
    <div style={{ position: "absolute", left: 1660, top: Y(2) - 20, fontWeight: 800, fontSize: 26, color: ICE }}>AFUERA</div>
  </>;
}}</Stage>;

// ---- 18:20 · EL LADRILLO HÚMEDO: dos ladrillos al fuego; el mojado hace vapor adentro y se raja; el seco aguanta ----
export const HSteam: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 60%, #2a1a10, #070504 75%)">{(tt) => {
  const heat = eio(tt, 0.8, 3.2), crack = eio(tt, 3.0, 4.0), jump = phys(tt, 3.6, 7, 0.4);
  const Brick = ({ x, wet }: { x: number; wet: boolean }) => <div style={{ position: "absolute", left: x, top: 470 }}>
    <div style={{ width: 460, height: 220, position: "relative" }}>
      {[0, 1].map((half) => <div key={half} style={{ position: "absolute", left: half ? 230 : 0, top: 0, width: 230, height: 220, overflow: "hidden", transform: wet ? `translate(${(half ? 1 : -1) * 40 * cl(jump)}px, ${-30 * Math.sin(cl(jump) * Math.PI)}px) rotate(${(half ? 1 : -1) * 8 * cl(jump)}deg)` : "none" }}>
        <div style={{ position: "absolute", left: half ? -230 : 0, top: 0, width: 460, height: 220, borderRadius: 8, background: wet ? `linear-gradient(180deg,#8a5a3a,#5a3520)` : "linear-gradient(180deg,#e8c99a,#b98a5a)", boxShadow: `0 0 ${60 * heat}px rgba(255,120,40,${0.5 * heat})` }} />
      </div>)}
      {wet && crack > 0 && <svg width={460} height={220} style={{ position: "absolute", inset: 0 }}><path d="M230 0 L210 60 L250 110 L215 170 L235 220" stroke="#120804" strokeWidth={8} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - crack)} /></svg>}
      {wet && Array.from({ length: 8 }, (_, i) => { const ph = (tt * 0.9 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 60 + (i * 53) % 340, top: -ph * 200, width: 50, height: 50, borderRadius: "50%", background: "rgba(230,230,230,.5)", filter: "blur(10px)", opacity: heat * Math.sin(ph * Math.PI) }} />; })}
      {wet && heat < 0.3 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + i * 70, top: 40 + (i % 2) * 90, width: 18, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: ICE, opacity: 1 - heat * 3 }} />)}
    </div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 44, marginTop: 40, color: wet ? RED : GRN }}>{wet ? "HÚMEDO: REVIENTA" : "SECO ✓"}</div>
  </div>;
  return <>
    <Head tt={tt} kick="LA PRIMERA VEZ" title="LADRILLOS SECOS" />
    <Brick x={300} wet /><Brick x={1160} wet={false} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, height: 280, background: `radial-gradient(ellipse 60% 70% at 50% 100%, rgba(255,110,30,${0.5 * heat}), transparent)` }} />
    <Tag tt={tt} at={4.8} x={960} y={960} txt="FUEGOS CHICOS, 2 O 3 DÍAS" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 18:50 · LA PARRILLA: corte en capas; ladrillos, dos de canto, la parrilla, la leña; la ceniza cae y el aire entra por abajo ----
export const HGrate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [0.4, 1.0, 1.7, 2.6].map((a) => cl(phys(tt, a, 6.5, 0.5))), air = cl(tt - 3.6);
  return <>
    <Head tt={tt} kick="EL FUEGO RESPIRA POR ABAJO" title="LA PARRILLA" />
    <div style={{ position: "absolute", left: 360, top: 860, width: 1100, height: 70, display: "flex", gap: 6, opacity: L[0] }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ flex: 1, background: "linear-gradient(180deg,#e8c99a,#b98a5a)", borderRadius: 4 }} />)}</div>
    {[480, 1300].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 760 - (1 - L[1]) * 200, width: 60, height: 100, background: "linear-gradient(90deg,#e8c99a,#b98a5a)", borderRadius: 4, opacity: L[1] }} />)}
    <div style={{ position: "absolute", left: 420, top: 740 - (1 - L[2]) * 200, width: 1000, height: 22, opacity: L[2], display: "flex", justifyContent: "space-between" }}>{Array.from({ length: 14 }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#aaa,#333)" }} />)}</div>
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 520 + i * 260, top: 650 - (1 - L[3]) * 260 - (i === 1 ? 70 : 0), width: 300, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#8a5a34,#4a2a12)", opacity: L[3], transform: `rotate(${i === 1 ? 4 : -3}deg)`, boxShadow: `0 0 ${50 * air}px rgba(255,120,40,${0.6 * air})` }} />)}
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.6 + i / 10) % 1; return <div key={i} style={{ position: "absolute", left: 470 + (i * 97) % 900, top: 760 + ph * 100, width: 10, height: 10, borderRadius: 5, background: "#9a9a9a", opacity: air * (1 - ph) }} />; })}
    {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.8 + i / 5) % 1; return <svg key={i} width={80} height={120} style={{ position: "absolute", left: 520 + i * 200, top: 840 - ph * 140, opacity: air * Math.sin(ph * Math.PI) }}><path d="M40 110 L40 20 M20 40 L40 10 L60 40" stroke={ICE} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>; })}
    <div style={{ position: "absolute", left: 380, top: 742, width: 6, height: 118, background: AMB, opacity: cl(tt - 2.2) }} />
    <div style={{ position: "absolute", left: 230, top: 770, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: AMB, opacity: cl(tt - 2.4) }}>10 cm</div>
    {[["LEÑA", 610, 2.6], ["PARRILLA", 750, 1.7], ["LADRILLOS DE CANTO", 820, 1.0]].map(([l, y, a], i) => <Tag key={i} tt={tt} at={a as number} x={1480} y={y as number} txt={l as string} anchor="l" size={26} col={DIM} />)}
  </>;
}}</Stage>;

// ---- 19:35 · LOS DOS CONTROLES: el aire de la tapa y la mariposa; las agujas van a 1/4 y 1/2 y el tronco dura hora y media ----
export const HControls: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const set = eio(tt, 2.0, 3.4), a1 = 1 - 0.75 * set, a2 = 1 - 0.5 * set, clock = eio(tt, 3.8, 6.0);
  const Dial = ({ x, v, l, f }: { x: number; v: number; l: string; f: string }) => <div style={{ position: "absolute", left: x, top: 330, width: 420, textAlign: "center" }}>
    <div style={{ width: 380, height: 380, margin: "0 auto", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#3a3a40,#121214)", boxShadow: "0 0 0 14px #2a2a2e, 0 40px 90px rgba(0,0,0,.7)", position: "relative" }}>
      <svg width={380} height={380} style={{ position: "absolute", inset: 0 }}><path d="M70 300 A150 150 0 1 1 310 300" stroke="rgba(255,255,255,.12)" strokeWidth={22} fill="none" /><path d="M70 300 A150 150 0 1 1 310 300" stroke={AMB} strokeWidth={22} fill="none" strokeDasharray={706} strokeDashoffset={706 * (1 - v)} /></svg>
      <div style={{ position: "absolute", left: 182, top: 60, width: 16, height: 140, background: TX, borderRadius: 8, transformOrigin: "50% 130px", transform: `rotate(${-135 + 270 * v}deg)` }} />
      <div style={{ position: "absolute", left: 160, top: 160, width: 60, height: 60, borderRadius: 30, background: "#555" }} />
    </div>
    <div style={{ fontWeight: 900, fontSize: 44, marginTop: 26 }}>{l}</div><div style={{ fontWeight: 900, fontSize: 60, color: AMB, opacity: set }}>{f}</div>
  </div>;
  return <>
    <Head tt={tt} kick="CON LOS DOS HACÉS LO QUE QUERÉS" title="LOS DOS CONTROLES" />
    <Dial x={300} v={a1} l="AIRE DE LA TAPA" f="1/4" /><Dial x={800} v={a2} l="MARIPOSA" f="1/2" />
    <div style={{ position: "absolute", left: 1340, top: 380, width: 360, height: 120, borderRadius: 60, background: "linear-gradient(180deg,#8a5a34,#4a2a12)", boxShadow: `0 0 ${60 * (1 - clock)}px rgba(255,120,40,.6)`, overflow: "hidden" }}><div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${clock * 100}%`, background: "linear-gradient(90deg,#2a1a10,#0e0806)" }} /></div>
    <div style={{ position: "absolute", left: 1340, top: 540, width: 360, textAlign: "center", fontWeight: 900, fontSize: 72, color: TX, opacity: cl(tt - 3.8) }}>{Math.floor(clock * 90 / 60)} h {String(Math.round(clock * 90) % 60).padStart(2, "0")}′</div>
    <Tag tt={tt} at={4.4} x={1520} y={700} txt="UN TRONCO GRUESO" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 20:25 · 90 cm: vista de arriba; todo lo que se prende sale empujado fuera del círculo; con chapa y tacos se acerca a 45 ----
export const HClearance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ring = eio(tt, 0.6, 1.6), push = eio(tt, 1.6, 3.0), shield = h.shieldAt !== undefined ? eio(t, h.shieldAt as number, (h.shieldAt as number) + 1) : eio(tt, 4.6, 5.6), cx = 860, cy = 600, R = 330;
  const O = [{ l: "ESTANTE", a: -2.5, d0: 200 }, { l: "CORTINA", a: -0.6, d0: 180 }, { l: "BIDÓN", a: 0.8, d0: 210 }, { l: "ROPA", a: 2.3, d0: 190 }];
  return <>
    <Head tt={tt} kick="TODO LO QUE SE PUEDA PRENDER" title="90 cm COMO MÍNIMO" />
    <div style={{ position: "absolute", left: cx - R * ring, top: cy - R * ring, width: 2 * R * ring, height: 2 * R * ring, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,120,40,.25), rgba(255,120,40,.05) 70%)", border: `6px dashed ${RED}` }} />
    <div style={{ position: "absolute", left: cx - 90, top: cy - 160, width: 180, height: 320, borderRadius: 30, background: "linear-gradient(90deg,#1a120e,#5a4136,#1a120e)", boxShadow: "0 0 80px rgba(255,120,40,.6)" }} />
    {O.map((o, i) => { const d = o.d0 + (R + 90 - o.d0) * push; return <div key={i} style={{ position: "absolute", left: cx + Math.cos(o.a) * d, top: cy + Math.sin(o.a) * d, transform: "translate(-50%,-50%)", padding: "14px 22px", borderRadius: 14, background: "#2a2622", border: `3px solid ${push > 0.9 ? GRN : RED}`, fontWeight: 900, fontSize: 30 }}>{o.l}</div>; })}
    <Tag tt={tt} at={1.0} x={cx} y={cy + R + 60} txt="90 cm" col={RED} size={56} />
    <div style={{ position: "absolute", left: 1400, top: 330, width: 380, opacity: shield, transform: `translateX(${(1 - shield) * 60}px)` }}>
      <div style={{ position: "relative", height: 300 }}>
        <div style={{ position: "absolute", left: 220, top: 0, width: 60, height: 300, background: "repeating-linear-gradient(180deg,#8a5a34 0 40px,#6b4426 40px 44px)" }} />
        <div style={{ position: "absolute", left: 120, top: 0, width: 18, height: 300, background: "linear-gradient(90deg,#888,#ddd,#888)" }} />
        {[40, 140, 240].map((y) => <div key={y} style={{ position: "absolute", left: 138, top: y, width: 82, height: 24, background: "#c09060", borderRadius: 4 }} />)}
        {Array.from({ length: 4 }, (_, i) => { const ph = (tt * 0.8 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 168, top: 300 - ph * 300, width: 14, height: 30, borderRadius: 7, background: ICE, opacity: Math.sin(ph * Math.PI) }} />; })}
      </div>
      <div style={{ fontWeight: 900, fontSize: 36, color: GRN, marginTop: 20 }}>CHAPA + TACOS: 45 cm</div>
    </div>
  </>;
}}</Stage>;

// ---- 21:10 · EL MONÓXIDO: el cuarto parece vacío; el detector barre y revela el gas que no tiene olor ni color ----
export const HCO: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #181a22, #050608 75%)">{(tt) => {
  const sx = 400 + 1100 * eio(tt, 1.4, 5.0), alarm = cl((tt - 5.0) * 2);
  return <>
    <Head tt={tt} kick="SIN OLOR · SIN COLOR" title="EL MONÓXIDO NO SE VE" col={RED} />
    {Array.from({ length: 70 }, (_, i) => { const x = 300 + (i * 173) % 1300, y = 330 + (i * 97) % 600 + 20 * Math.sin(tt * 0.6 + i), vis = cl(1 - Math.abs(x - sx) / 200) + alarm * 0.6;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 44, height: 22, opacity: vis }}><div style={{ position: "absolute", left: 0, top: 0, width: 22, height: 22, borderRadius: 11, background: "#5a5a62" }} /><div style={{ position: "absolute", left: 18, top: 0, width: 22, height: 22, borderRadius: 11, background: RED }} /></div>; })}
    <div style={{ position: "absolute", left: sx - 200, top: 300, width: 400, height: 680, background: "linear-gradient(90deg, transparent, rgba(255,90,74,.12), transparent)", opacity: alarm > 0 ? 0 : 1 }} />
    <div style={{ position: "absolute", left: sx - 80, top: 230, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#fff,#d8d4cc)", boxShadow: `0 0 0 6px #aaa, 0 0 ${80 * alarm}px ${RED}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: alarm > 0 && Math.sin(tt * 10) > 0 ? RED : "#7a2a22" }} />
    </div>
    <Tag tt={tt} at={5.2} x={960} y={1010} txt="SI HAY MONÓXIDO, CHILLA" col={RED} size={44} />
  </>;
}}</Stage>;

// ---- 21:30 · TRES REGLAS QUE NO SE NEGOCIAN: tres escudos que se trancan uno por uno ----
export const HRules: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const T = (h.steps as number[] | undefined) ?? [h.at + 0.6, h.at + 2.6, h.at + 4.6];
  const IC = [
    <svg key="a" width={160} height={160} viewBox="0 0 160 160"><rect x={60} y={10} width={40} height={110} fill="#9a9aa2" /><rect x={20} y={110} width={120} height={40} rx={10} fill="#4a342a" /><path d="M80 0 q-20 -10 -10 -30" stroke="#ccc" strokeWidth={6} fill="none" /></svg>,
    <svg key="b" width={160} height={160} viewBox="0 0 160 160"><rect x={20} y={20} width={120} height={120} fill="none" stroke="#9a9aa2" strokeWidth={10} /><rect x={30} y={30} width={60} height={100} fill="rgba(143,214,255,.35)" transform="skewY(-10)" />{[0, 1, 2].map((k) => <path key={k} d={`M100 ${50 + k * 30} l40 0`} stroke={ICE} strokeWidth={6} />)}</svg>,
    <svg key="c" width={160} height={160} viewBox="0 0 160 160"><circle cx={80} cy={80} r={60} fill="#f2efe8" /><circle cx={80} cy={80} r={14} fill={RED} />{[0, 1, 2].map((k) => <circle key={k} cx={80} cy={80} r={70 + k * 12} fill="none" stroke={RED} strokeWidth={4} opacity={0.6 - k * 0.2} />)}</svg>,
  ];
  const L = ["CHIMENEA AFUERA", "ENTRADA DE AIRE", "DETECTOR"];
  return <>
    <Head tt={tt} kick="NO SE NEGOCIAN" title="TRES REGLAS" col={RED} />
    {L.map((l, i) => { const s = cl(phys(tt, T[i] - h.at, 6, 0.45)), lock = cl(phys(tt, T[i] - h.at + 0.8, 9, 0.4)); return <div key={i} style={{ position: "absolute", left: 290 + i * 470, top: 320, width: 400, height: 560, transform: `translateY(${(1 - s) * 260}px) scale(${0.85 + 0.15 * s})`, opacity: cl(s * 2) }}>
      <svg width={400} height={560} style={{ position: "absolute", inset: 0 }}><path d="M200 20 L370 80 L370 280 Q370 460 200 540 Q30 460 30 280 L30 80 Z" fill="#1e1b18" stroke={lock > 0.5 ? GRN : "rgba(255,255,255,.2)"} strokeWidth={8} /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontWeight: 900, fontSize: 80, color: AMB }}>{i + 1}</div>
      <div style={{ position: "absolute", left: 120, top: 180 }}>{IC[i]}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontWeight: 900, fontSize: 32 }}>{l}</div>
      <div style={{ position: "absolute", left: 170, top: 440, width: 60, height: 50, borderRadius: 8, background: GRN, transform: `scale(${lock})`, color: "#111", fontWeight: 900, fontSize: 34, textAlign: "center", lineHeight: "50px" }}>✓</div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 22:35 · UN DÍA ENTERO MEDIDO: el reloj avanza de las 7 a las 7 del otro día; adentro sube a 18 y a la mañana queda en 7 ----
export const HDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const P: [number, number, number][] = [[7, 4, 2], [7.5, 9, 2], [8, 12, 2], [9, 16, 3], [12, 18, 6], [18, 18, 4], [22, 12, 0], [31, 7, -1]];
  const span = Math.max(4, h.out - h.at - 1.2), now = 7 + 24 * eio(tt, 0.6, span);
  const X = (hr: number) => 300 + (hr - 7) * 52, Y = (v: number) => 880 - v * 26;
  const val = (k: 1 | 2, hr: number) => { for (let i = 1; i < P.length; i++) if (hr <= P[i][0]) { const a = P[i - 1], b = P[i], f = (hr - a[0]) / (b[0] - a[0]); return a[k] + (b[k] - a[k]) * f; } return P[P.length - 1][k]; };
  const pts = (k: 1 | 2) => Array.from({ length: 97 }, (_, i) => 7 + i * 0.25).filter((x) => x <= now).map((x, i) => `${i ? "L" : "M"}${X(x)} ${Y(val(k, x))}`).join(" ");
  const hh = Math.floor(now) % 24, mm = Math.floor((now % 1) * 60);
  return <>
    <Head tt={tt} kick="NO CREO NADA SIN MEDIRLO" title="UN DÍA ENTERO" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={300} y1={Y(0)} x2={1560} y2={Y(0)} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      {[7, 12, 18, 24, 31].map((k) => <text key={k} x={X(k)} y={Y(0) + 50} fill={DIM} fontSize={26} fontWeight={800} textAnchor="middle">{k % 24}:00</text>)}
      <path d={pts(2)} stroke={ICE} strokeWidth={6} fill="none" strokeDasharray="12 8" />
      <path d={pts(1)} stroke={AMB} strokeWidth={11} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px rgba(255,178,87,.6))" }} />
      <circle cx={X(now)} cy={Y(val(1, now))} r={14} fill={AMB} />
    </svg>
    <div style={{ position: "absolute", left: 1600, top: 320, textAlign: "right", width: 260 }}>
      <div style={{ fontWeight: 900, fontSize: 70, fontVariantNumeric: "tabular-nums" }}>{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}</div>
      <div style={{ fontWeight: 900, fontSize: 96, color: AMB, fontVariantNumeric: "tabular-nums" }}>{Math.round(val(1, now))}°</div>
      <div style={{ fontWeight: 800, fontSize: 30, color: DIM }}>ADENTRO</div>
      <div style={{ fontWeight: 900, fontSize: 56, color: ICE, marginTop: 20, fontVariantNumeric: "tabular-nums" }}>{Math.round(val(2, now))}°</div>
      <div style={{ fontWeight: 800, fontSize: 30, color: DIM }}>AFUERA</div>
    </div>
  </>;
}}</Stage>;

// ---- 24:10 · DE ARRIBA PARA ABAJO: se arma la pila (troncos, palos, ramas, papel); se prende arriba y el fuego baja capa por capa ----
export const HTopDown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const L = [0.4, 1.0, 1.6, 2.2].map((a) => cl(phys(tt, a, 6.5, 0.5))), burn = (k: number) => eio(tt, 3.0 + (3 - k) * 0.8, 3.8 + (3 - k) * 0.8);
  const Log = ({ x, y, w, hh, k, rot = 0 }: { x: number; y: number; w: number; hh: number; k: number; rot?: number }) => <div style={{ position: "absolute", left: x, top: y - (1 - L[k]) * 300, width: w, height: hh, borderRadius: hh / 2, opacity: L[k], transform: `rotate(${rot}deg)`, background: `linear-gradient(180deg, ${burn(k) > 0.3 ? "#ff9a3a" : "#8a5a34"}, ${burn(k) > 0.3 ? "#7a2a10" : "#4a2a12"})`, boxShadow: `0 0 ${50 * burn(k)}px rgba(255,120,40,${0.7 * burn(k)})` }} />;
  const fy = 380 + 400 * eio(tt, 3.0, 6.2);
  return <>
    <Head tt={tt} kick="CASI TODOS LO HACEN AL REVÉS" title="SE PRENDE DE ARRIBA" />
    <Log x={560} y={780} w={700} hh={110} k={0} /><Log x={560} y={680} w={700} hh={90} k={0} />
    {[0, 1, 2, 3].map((i) => <Log key={i} x={600 + i * 150} y={600} w={90} hh={60} k={1} rot={70} />)}
    {Array.from({ length: 8 }, (_, i) => <Log key={i} x={600 + i * 75} y={540} w={260} hh={20} k={2} rot={i % 2 ? 12 : -12} />)}
    <div style={{ position: "absolute", left: 820, top: 440 - (1 - L[3]) * 300, width: 180, height: 110, borderRadius: "40% 50% 45% 55%", background: "#efe8d8", opacity: L[3] * (1 - burn(3)), boxShadow: "inset -10px -10px 20px rgba(0,0,0,.15)" }} />
    {tt > 2.8 && <div style={{ position: "absolute", left: 910 - 120, top: fy - 220, width: 240, height: 260, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 85%,#fff3b8,#ff9a2a 45%,rgba(255,80,20,0) 72%)", opacity: cl(tt - 2.8) * (0.9 + 0.1 * Math.sin(tt * 9)) }} />}
    {[["PAPEL", 470, 2.2], ["RAMAS FINAS", 540, 1.6], ["PALOS (UNA MUÑECA)", 610, 1.0], ["2 TRONCOS GRUESOS", 740, 0.4]].map(([l, y, a], i) => <Tag key={i} tt={tt} at={a as number} x={1340} y={y as number} txt={l as string} anchor="l" size={32} col={i === 0 ? AMB : TX} />)}
    <svg width={120} height={420} style={{ position: "absolute", left: 1180, top: 380, opacity: cl(tt - 3.2) }}><path d="M60 20 L60 380" stroke={AMB} strokeWidth={8} /><path d="M30 350 L60 390 L90 350" stroke={AMB} strokeWidth={8} fill="none" /></svg>
  </>;
}}</Stage>;

// ---- 24:55 · LA MITAD ES AGUA: un tronco recién cortado en la balanza contra uno seco; el agua se ve adentro ----
export const HWetLog: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const fill = eio(tt, 0.8, 2.4), tilt = 12 * cl(phys(tt, 2.6, 5, 0.4)), steam = cl(tt - 3.6);
  const Round = ({ wet }: { wet: boolean }) => <div style={{ width: 300, height: 300, borderRadius: "50%", position: "relative", overflow: "hidden", background: "radial-gradient(circle,#e3b07a,#b07a44 40%,#7a4c22 70%,#5a3518)", boxShadow: "0 0 0 14px #4a2a12" }}>
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", inset: 20 + i * 22, borderRadius: "50%", border: "3px solid rgba(90,50,20,.5)" }} />)}
    {wet && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${50 * fill}%`, background: "linear-gradient(180deg,rgba(143,214,255,.75),rgba(40,100,160,.8))", borderTop: "4px solid rgba(255,255,255,.6)" }} />}
  </div>;
  return <>
    <Head tt={tt} kick="LEÑA CORTADA ESTE AÑO" title="LA MITAD ES AGUA" col={ICE} />
    <div style={{ position: "absolute", left: 960, top: 690, width: 1100, height: 14, marginLeft: -550, background: "linear-gradient(180deg,#ccc,#777)", borderRadius: 7, transform: `rotate(${tilt}deg)` }}>
      <div style={{ position: "absolute", left: 40, top: -330 }}><Round wet /></div>
      <div style={{ position: "absolute", right: 40, top: -330 }}><Round wet={false} /></div>
    </div>
    <div style={{ position: "absolute", left: 930, top: 700, width: 60, height: 300, background: "linear-gradient(90deg,#777,#ddd,#777)" }} />
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.6 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 520 + (i * 41) % 160, top: 350 + 60 - ph * 220 + tilt * 6, width: 70, height: 70, borderRadius: "50%", background: "rgba(230,230,230,.4)", filter: "blur(12px)", opacity: steam * Math.sin(ph * Math.PI) }} />; })}
    <Tag tt={tt} at={1.4} x={560} y={980} txt="FRESCA" col={ICE} size={40} />
    <Tag tt={tt} at={1.6} x={1360} y={980} txt="SECA: 1 INVIERNO" col={GRN} size={40} />
    <Tag tt={tt} at={3.8} x={1500} y={250} txt="EL FUEGO SE GASTA EN HERVIR AGUA" col={DIM} size={30} />
  </>;
}}</Stage>;

// ---- 26:30 · EL TERMOSIFÓN: el agua fría baja del tanque, entra al serpentín, se calienta y sube sola; sin bomba ----
export const HThermo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = cl(phys(tt, 0.3, 6, 0.6)), flow = cl(tt - 1.4), vent = cl(phys(tt, 4.4, 7, 0.45));
  const path = (u: number): [number, number, number] => { // recorrido del agua: tanque abajo → serpentín → tanque arriba
    if (u < 0.25) { const k = u / 0.25; return [1360 - 300 * k, 760, 0]; }
    if (u < 0.7) { const k = (u - 0.25) / 0.45; return [1060 - 120 * Math.cos(k * 18), 760 - 380 * k, k]; }
    const k = (u - 0.7) / 0.3; return [1060 + 300 * k, 380, 1]; };
  return <>
    <Head tt={tt} kick="LA SEGUNDA VIDA DEL TAMBOR" title="AGUA CALIENTE GRATIS" />
    <div style={{ opacity: s }}>
      <div style={{ position: "absolute", left: 920, top: 220, width: 80, height: 700, background: "linear-gradient(90deg,#3a3a3e,#9a9aa2,#4a4a50)" }} />
      <svg width={400} height={460} style={{ position: "absolute", left: 760, top: 340 }}>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={200} cy={20 + i * 48} rx={90} ry={18} fill="none" stroke="#c87a3a" strokeWidth={14} />)}</svg>
      <div style={{ position: "absolute", left: 1360, top: 340, width: 320, height: 460, borderRadius: 30, background: "linear-gradient(180deg,#d05030 0%,#a0503a 40%,#2e5f96 75%,#1c3d66)", boxShadow: "0 0 0 10px #555, 0 40px 90px rgba(0,0,0,.6)" }} />
      <DrumSide x={760} y={940} w={520} h={190} tone="burnt" />
    </div>
    {Array.from({ length: 22 }, (_, i) => { const u = (tt * 0.18 + i / 22) % 1, [x, y, hot] = path(u); return <div key={i} style={{ position: "absolute", left: x - 11, top: y - 11, width: 22, height: 22, borderRadius: 11, background: `rgb(${80 + 175 * hot},${170 - 90 * hot},${255 - 200 * hot})`, opacity: flow, boxShadow: `0 0 12px rgb(${80 + 175 * hot},${170 - 90 * hot},${255 - 200 * hot})` }} />; })}
    <div style={{ position: "absolute", left: 1500, top: 260 - (1 - vent) * 60, width: 40, height: 90, background: "#888", opacity: vent }} />
    <Tag tt={tt} at={4.6} x={1520} y={220} txt="SIEMPRE ABIERTO ARRIBA" col={GRN} size={32} />
    <Tag tt={tt} at={2.2} x={1520} y={870} txt="SIN BOMBA" col={AMB} size={40} />
    <div style={{ position: "absolute", left: 1520, top: 560, transform: "translateX(-50%)", fontWeight: 900, fontSize: 70, color: "#fff", opacity: cl(tt - 3), textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>60 L</div>
  </>;
}}</Stage>;

// ---- 27:35 · LO QUE NUNCA: seis cosas que caen y se tachan con un sello rojo ----
export const HNever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 45%, #2a1414, #080606 80%)">{(tt) => {
  const L = ["NAFTA", "ALCOHOL", "PLÁSTICO", "GOMA", "MADERA PINTADA", "AGLOMERADO"];
  return <>
    <Head tt={tt} kick="LO QUE YO NUNCA HAGO" title="NUNCA EN LA ESTUFA" col={RED} />
    {L.map((l, i) => { const a = 0.5 + i * 0.7, s = cl(phys(tt, a, 6.5, 0.5)), x = cl(phys(tt, a + 0.35, 9, 0.35)); const col = i % 3, row = Math.floor(i / 3);
      return <div key={i} style={{ position: "absolute", left: 300 + col * 460, top: 320 + row * 320 - (1 - s) * 200, width: 400, height: 260, borderRadius: 26, background: "linear-gradient(160deg,#2a2622,#141210)", boxShadow: "0 30px 70px rgba(0,0,0,.6)", opacity: cl(s * 2), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 44, textAlign: "center" }}>{l}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 122, height: 16, borderRadius: 8, background: RED, transform: `rotate(-12deg) scaleX(${cl(x)})`, transformOrigin: "left", boxShadow: "0 0 20px rgba(255,90,74,.6)" }} />
      </div>; })}
  </>;
}}</Stage>;

// ---- 29:20 · LOS COMENTARIOS: un celular con el muro; cada aparición suma una tarjeta que empuja a las anteriores ----
export const HComments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode={(["iris", "wipe", "split", "drop"] as const)[(h.idx as number) % 4]}>{(tt) => {
  const all = (h.stack as { n: string; from: string; txt: string }[] | undefined) ?? [], idx = (h.idx as number) ?? 0, s = phys(tt, 0.6, 5.5, 0.5), heart = phys(tt, 2.4, 7, 0.32);
  const vis = all.slice(0, idx + 1).reverse();
  return <>
    <Head tt={tt} kick="USTEDES ME ESCRIBEN" title="LEO TODO" />
    <div style={{ position: "absolute", left: 960, top: 560, width: 660, height: 980, marginLeft: -330, marginTop: -480, borderRadius: 60, background: "#0b0b0d", boxShadow: "0 0 0 10px #222226, 0 60px 140px rgba(0,0,0,.8)", overflow: "hidden", transform: `rotateY(${-8 + 4 * Math.sin(tt * 0.4)}deg)` }}>
      <div style={{ position: "absolute", left: 260, top: 18, width: 140, height: 34, borderRadius: 17, background: "#000" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 80, fontWeight: 900, fontSize: 30, color: DIM }}>{18 + idx * 29} comentarios</div>
      {vis.map((c, j) => { const isNew = j === 0;
        return <div key={c.n} style={{ position: "absolute", left: 24, right: 24, top: isNew ? 140 + (1 - s) * -260 : 140 + 270 * j * cl(s) + 270 * (j - 1) * (1 - cl(s)), opacity: isNew ? cl(s * 3) : 1 - j * 0.22, borderRadius: 26, background: isNew ? "#1d1d22" : "#141418", padding: "22px 24px", boxShadow: isNew ? `0 0 0 2px ${AMB}88` : undefined }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: ["#e57a44", "#5aa0e6", "#8fcf6a", "#c77ad8", "#e6c25a"][all.indexOf(c) % 5], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26 }}>{c.n[0]}</div>
            <div><div style={{ fontWeight: 900, fontSize: 32 }}>{c.n}</div><div style={{ fontSize: 22, color: DIM }}>{c.from}</div></div>
          </div>
          <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1.25, color: TX }}>{c.txt}</div>
          {isNew && <div style={{ position: "absolute", right: 24, bottom: 16, fontSize: 40, transform: `scale(${cl(heart) + (heart > 1 ? (heart - 1) * 0.6 : 0)})`, color: RED }}>❤</div>}
        </div>; })}
    </div>
  </>;
}}</Stage>;

// ---- 30:00 · EL COLOR DEL HUMO: dos puntas de caño; humo casi transparente (bien) contra negro y espeso (leña húmeda, plástico, poco aire) ----
export const HSmokeColor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 30%, #3a4a5e, #0e131a 80%)">{(tt) => {
  const a = cl(tt - 0.6), b = cl(tt - 2.4);
  const Tip = ({ x, black, on }: { x: number; black: boolean; on: number }) => <>
    <div style={{ position: "absolute", left: x - 40, top: 620, width: 80, height: 460, background: "linear-gradient(90deg,#3a3a3e,#9a9aa2,#4a4a50)", opacity: on }} />
    {Array.from({ length: 18 }, (_, i) => { const ph = (tt * (black ? 0.35 : 0.6) + i / 18) % 1, s = (black ? 120 : 70) * (0.4 + ph); return <div key={i} style={{ position: "absolute", left: x - s / 2 + Math.sin(ph * 5 + i) * 50 * ph, top: 600 - ph * 420 - s / 2, width: s, height: s, borderRadius: "50%", background: black ? "rgba(20,18,16,.85)" : "rgba(245,245,245,.28)", filter: `blur(${black ? 8 : 14}px)`, opacity: on * Math.sin(ph * Math.PI) }} />; })}
  </>;
  return <>
    <Head tt={tt} kick="EL HUMO TE AVISA" title="¿BLANCO O NEGRO?" />
    <Tip x={620} black={false} on={a} /><Tip x={1300} black on={b} />
    <div style={{ position: "absolute", left: 620, top: 1000, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: GRN, opacity: a }}>CASI TRANSPARENTE ✓</div>
    <div style={{ position: "absolute", left: 1520, top: 380, opacity: b, display: "flex", flexDirection: "column", gap: 16 }}>{["LEÑA HÚMEDA", "PLÁSTICO", "POCO AIRE"].map((l, i) => <div key={i} style={{ fontWeight: 900, fontSize: 34, color: RED, opacity: cl((tt - 3.0 - i * 0.5) * 3) }}>✗ {l}</div>)}</div>
  </>;
}}</Stage>;

// ---- 31:05 · NADA SE TIRA: la rueda leña → fuego → ceniza diluida → huerta → leña, girando ----
export const HAsh: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #22301c, #070a06 80%)">{(tt) => {
  const N = ["LEÑA", "FUEGO", "CENIZA", "DILUIDA EN AGUA", "LA HUERTA"], C = ["#b07a44", "#ff9a2a", "#a8a8a8", ICE, GRN], R = 300, rot = eio(tt, 0.4, 6.4) * 72;
  return <>
    <Head tt={tt} kick="LA CENIZA ES ABONO" title="NADA SE TIRA" col={GRN} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><circle cx={960} cy={600} r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={8} strokeDasharray="2 22" strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 960, top: 600, transform: `rotate(${rot}deg)` }}>
      {N.map((n, i) => { const a = (i / 5) * 2 * Math.PI - Math.PI / 2, s = cl(phys(tt, 0.4 + i * 0.5, 6, 0.5)); return <div key={i} style={{ position: "absolute", left: Math.cos(a) * R, top: Math.sin(a) * R, transform: `translate(-50%,-50%) rotate(${-rot}deg) scale(${s})` }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${C[i]}, ${C[i]}55 70%)`, boxShadow: `0 0 50px ${C[i]}66`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: 900, fontSize: 28, color: "#111", padding: 18, lineHeight: 1.1 }}>{n}</div>
      </div>; })}
    </div>
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 40, color: DIM, textAlign: "center", opacity: cl(tt - 3) }}>NUNCA PURA<br />EN LAS PLANTAS</div>
  </>;
}}</Stage>;
