// cer28 · componentes únicos genéricos 2 (línea de la noche, carrusel, celular, pizarrón, plano de la casa, control del auto,
// casitas que cuentan, balanza, mirilla, alcance del brazo, foco cálido, péndulo de llaves, vaso en la perilla, cuña, cinta testigo,
// reloj de arena, temporizador de ruedita, la calle de noche).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Reflected, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";
import type { HP } from "./heroes_g1";

const it = (h: H) => (h.items ?? []) as { t: string; img?: string; at: number; ok?: boolean | string; n?: string; s?: string }[];
const House: React.FC<{ x: number; y: number; w: number; lit: number; c?: string }> = ({ x, y, w, lit, c = "#1b2030" }) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{ position: "absolute", left: x - w / 2, top: y - w }}>
    <path d="M 8 48 L 50 12 L 92 48 L 92 100 L 8 100 Z" fill={c} /><rect x={22} y={56} width={20} height={20} fill={`rgba(255,196,110,${0.06 + 0.94 * lit})`} />
    <rect x={58} y={56} width={20} height={20} fill={`rgba(255,196,110,${0.06 + 0.94 * lit})`} /><rect x={44} y={80} width={12} height={20} fill="#0c0e15" />
  </svg>);

// ---------- 19 · LA NOCHE EN UNA LÍNEA: el punto avanza por la hora y en cada parada sube la foto de lo que se hace ----------
export const HRoutine: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const I = it(h), n = I.length, X = (i: number) => 260 + i * (1400 / Math.max(1, n - 1)), last = I[n - 1]?.at ?? 4, k = eio(tt, I[0]?.at ?? 0.5, last + 0.6);
  return <>
    <div style={{ position: "absolute", left: 260, top: 800, width: 1400, height: 8, borderRadius: 4, background: "rgba(255,255,255,.14)" }} />
    <div style={{ position: "absolute", left: 260, top: 800, width: 1400 * k, height: 8, borderRadius: 4, background: AMB, boxShadow: "0 0 20px rgba(255,178,87,.7)" }} />
    <div style={{ position: "absolute", left: 260 + 1400 * k - 18, top: 786, width: 36, height: 36, borderRadius: "50%", background: "#fff", boxShadow: "0 0 30px #fff" }} />
    {I.map((c, i) => { const s = phys(tt, c.at, 5, 0.5), act = tt >= c.at && (i === n - 1 || tt < I[i + 1].at);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: X(i), top: 860, transform: "translateX(-50%)", fontWeight: 900, fontSize: 46, color: act ? AMB : DIM, opacity: cl(s * 2) }}>{c.n}</div>
        <div style={{ position: "absolute", left: X(i), top: 480, transform: `translate(-50%,-50%) translateY(${(1 - s) * 260}px) scale(${act ? 1.06 : 0.9})`, opacity: cl(s * 2) * (act ? 1 : 0.55) }}>
          <Photo id={c.img} w={330} h={420} r={18} dim={act ? 0 : 0.3} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontWeight: 900, fontSize: 34, whiteSpace: "nowrap" }}>{c.t}</div>
        </div></React.Fragment>; })}
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 20 · CARRUSEL 3D: tarjetas 9:16 con foto que pasan; el título sólo en la activa, contador n/N ----------
export const HDeck: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" cam={0.5}>{(tt) => {
  const I = it(h), n = I.length; let a = 0; I.forEach((c, i) => { if (tt >= c.at) a = i; });
  const fa = a + cl(phys(tt, I[a]?.at ?? 0, 6, 0.7)) - 1, pos = Math.max(0, fa);
  return <>
    {I.map((c, i) => { const d = i - pos, ad = Math.abs(d), s = cl(phys(tt, Math.min(c.at, 0.3 + i * 0.12), 5, 0.6));
      if (ad > 3.2) return null;
      return <div key={i} style={{ position: "absolute", left: 960 + d * 330 + Math.sign(d) * 170 * Math.min(1, ad), top: 500, zIndex: 100 - Math.round(ad * 10), transform: `translate(-50%,-50%) translateZ(${-ad * 260}px) rotateY(${-Math.sign(d) * Math.min(1, ad) * 52}deg)`, opacity: s * (1 - ad * 0.22) }}>
        <Reflected id={c.img} w={380} h={620} r={22} dim={Math.min(0.6, ad * 0.35)} />
      </div>; })}
    {I[a] && <div style={{ position: "absolute", left: 960, top: 860, transform: "translateX(-50%)", fontWeight: 900, fontSize: 52, whiteSpace: "nowrap", textShadow: "0 8px 30px rgba(0,0,0,.7)", opacity: cl((tt - I[a].at) * 3) }}>{I[a].t}</div>}
    <div style={{ position: "absolute", right: 120, top: 100, fontWeight: 900, fontSize: 50, color: AMB }}>{a + 1}<span style={{ color: DIM, fontSize: 34 }}> / {n}</span></div>
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 21 · EL CELULAR: llega girando y los comentarios suben de a uno ----------
export const HPhone: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const I = it(h), s = phys(tt, 0.1, 4, 0.55);
  return <>
    <Shadow x={960} y={1010} w={560} k={cl(s)} />
    <div style={{ position: "absolute", left: 960, top: 540, width: 520, height: 960, marginLeft: -260, marginTop: -480, borderRadius: 64, background: "#0e0f12", boxShadow: "0 0 0 10px #2a2b30, 0 60px 120px rgba(0,0,0,.7)", transform: `translateY(${(1 - s) * 500}px) rotateY(${(1 - s) * -40 + 8 * Math.sin(tt * 0.3)}deg) rotateX(6deg)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 200, top: 18, width: 120, height: 30, borderRadius: 15, background: "#000" }} />
      <div style={{ position: "absolute", left: 36, top: 90, fontWeight: 900, fontSize: 34, color: DIM }}>COMENTARIOS</div>
      {I.map((c, i) => { const k = phys(tt, c.at, 6, 0.55); return <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 150 + i * 250, transform: `translateY(${(1 - k) * 180}px)`, opacity: cl(k * 2), background: "#1c1d22", borderRadius: 26, padding: "22px 24px", boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 54, height: 54, borderRadius: "50%", background: ["#e8a87c", "#85c1e9", "#a3d9a5", "#f5b7b1"][i % 4] }} /><div style={{ fontWeight: 800, fontSize: 28, color: DIM }}>{c.n ?? "Una persona"}</div></div>
        <div style={{ fontWeight: 700, fontSize: 34, lineHeight: 1.18, marginTop: 12, color: TX }}>{c.t}</div>
      </div>; })}
      <Sheen p={(tt * 0.18) % 1} r={64} o={0.12} />
    </div>
  </>;
}}</Stage>;

// ---------- 22 · EL PIZARRÓN: el repaso escrito con tiza, renglón por renglón ----------
export const HChalk: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 80% 70% at 50% 45%, #2c2620, #0b0a08 80%)">{(tt) => {
  const I = it(h), two = I.length > 6, half = Math.ceil(I.length / 2);
  return <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 840, borderRadius: 16, background: "radial-gradient(ellipse at 40% 30%, #2f4a3c, #1c2e25 80%)", boxShadow: "0 0 0 26px #6b4a2a, 0 0 0 32px #3d2914, 0 60px 120px rgba(0,0,0,.7)", fontFamily: HAND, color: "rgba(245,245,235,.94)" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.2, background: "repeating-linear-gradient(17deg, rgba(255,255,255,.07) 0 3px, transparent 3px 14px)" }} />
    {h.title && <div style={{ position: "absolute", left: 60, top: 26, fontSize: 70, fontWeight: 700, color: AMB }}>{h.title}</div>}
    {I.map((c, i) => { const k = eio(tt, c.at, c.at + 0.9), col = two && i >= half ? 1 : 0, row = col ? i - half : i;
      return <div key={i} style={{ position: "absolute", left: 70 + col * 780, top: 130 + row * (two ? 116 : 112), fontSize: two ? 54 : 62, fontWeight: 700, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`, textShadow: "0 0 2px rgba(255,255,255,.5)" }}>
        <span style={{ color: AMB }}>{i + 1}.</span> {c.t}</div>; })}
    <div style={{ position: "absolute", left: 1300, top: 790, width: 130, height: 26, borderRadius: 8, background: "#f4f0e6", boxShadow: "0 6px 10px rgba(0,0,0,.4)", transform: "rotate(-8deg)" }} />
  </div>;
}}</Stage>;

// ---------- 23 · EL PLANO DE LA CASA: visto desde arriba; el objeto viaja de un cuarto a la mesita ----------
export const HFloorplan: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" cam={0.6}>{(tt) => {
  const mv = eio(tt, h.moveAt ?? 2.8, (h.moveAt ?? 2.8) + 1.4), noise = cl(tt - 1.2) * (1 - mv);
  const rooms = [{ x: 0, y: 0, w: 560, h: 520, n: "DORMITORIO" }, { x: 560, y: 0, w: 220, h: 820, n: "PASILLO" }, { x: 780, y: 0, w: 620, h: 420, n: h.room ?? "COCINA" }, { x: 0, y: 520, w: 560, h: 300, n: "BAÑO" }, { x: 780, y: 420, w: 620, h: 400, n: "LIVING" }];
  const A = { x: 1100, y: 210 }, B = { x: 380, y: 200 }, P = { x: A.x + (B.x - A.x) * mv, y: A.y + (B.y - A.y) * mv - Math.sin(mv * Math.PI) * 120 };
  return <div style={{ position: "absolute", left: 260, top: 160, width: 1400, height: 820, transform: "rotateX(38deg)", transformStyle: "preserve-3d", boxShadow: "0 60px 120px rgba(0,0,0,.6)" }}>
    {rooms.map((r, i) => <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: i === 0 ? "#3b3428" : "#2a2620", border: "10px solid #d8cfbf", boxSizing: "border-box", opacity: cl(phys(tt, 0.2 + i * 0.12, 6, 0.6)) }}>
      <div style={{ position: "absolute", left: 20, bottom: 14, fontWeight: 900, fontSize: 30, color: DIM, letterSpacing: 3 }}>{r.n}</div></div>)}
    <div style={{ position: "absolute", left: 90, top: 110, width: 300, height: 220, borderRadius: 14, background: "#6f6152", boxShadow: "inset 0 0 0 6px #85766a" }} />
    <div style={{ position: "absolute", left: 400, top: 150, width: 90, height: 90, borderRadius: 10, background: "#8a6a48" }} />
    {[0, 1, 2].map((i) => { const q = ((tt * 0.7 + i * 0.33) % 1); return <div key={i} style={{ position: "absolute", left: 1100 - q * 200, top: 210 - q * 200, width: q * 400, height: q * 400, borderRadius: "50%", border: `5px solid rgba(255,90,74,${(1 - q) * 0.8 * noise})` }} />; })}
    <svg width={1400} height={820} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M ${A.x} ${A.y} Q ${(A.x + B.x) / 2} ${A.y - 160} ${B.x} ${B.y}`} stroke={AMB} strokeWidth={6} strokeDasharray="14 14" fill="none" opacity={cl(tt - 2.2) * 0.8} /></svg>
    <div style={{ position: "absolute", left: P.x - 70, top: P.y - 70, width: 140, height: 140, borderRadius: 26, overflow: "hidden", boxShadow: `0 0 0 6px ${mv > 0.98 ? GRN : AMB}, 0 20px 40px rgba(0,0,0,.6)`, transform: "rotateX(-38deg)" }}><Photo id={h.img} w={140} h={140} r={0} /></div>
    <Tag tt={tt} at={(h.moveAt ?? 2.8) + 1.4} x={280} y={300} txt={h.lab ?? "AL LADO DE LA CAMA"} col={GRN} size={40} />
  </div>;
}}</Stage>;

// ---------- 24 · EL CONTROL DEL AUTO: el pulgar aprieta el botón rojo y el auto prende luces y bocina en la cuadra ----------
export const HFob: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 80% 70% at 50% 60%, #141a26, #04050a 78%)">{(tt) => {
  const pr = h.press ?? 1.6, push = cl(phys(tt, pr, 12, 0.5)) * (1 - cl((tt - pr - 0.6) * 3)), on = tt > pr + 0.1, bl = on ? (Math.sin((tt - pr) * 11) > 0 ? 1 : 0.15) : 0, s = phys(tt, 0.2, 4.5, 0.55);
  return <>
    <svg width={900} height={340} viewBox="0 0 900 340" style={{ position: "absolute", left: 1000, top: 520 }}>
      <path d="M 60 250 L 120 150 Q 160 100 260 92 L 560 92 Q 660 96 720 160 L 820 200 Q 860 214 860 250 L 860 270 L 40 270 Z" fill="#1e232e" />
      <path d="M 210 150 L 270 108 L 450 108 L 450 150 Z M 470 108 L 600 108 L 670 150 L 470 150 Z" fill="#2f3a4c" />
      <circle cx={200} cy={275} r={52} fill="#0c0e13" /><circle cx={700} cy={275} r={52} fill="#0c0e13" />
      <ellipse cx={842} cy={222} rx={22} ry={14} fill={`rgba(255,220,140,${0.15 + 0.85 * bl})`} /><ellipse cx={58} cy={232} rx={18} ry={12} fill={`rgba(255,80,60,${0.15 + 0.85 * bl})`} />
    </svg>
    <div style={{ position: "absolute", left: 1840, top: 700, width: 700, height: 400, marginLeft: -350, marginTop: -200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,210,140,.35), transparent 70%)", opacity: bl }} />
    {on && [0, 1, 2].map((i) => { const q = ((tt - pr) * 0.8 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: 1450 - q * 500, top: 620 - q * 500, width: q * 1000, height: q * 1000, borderRadius: "50%", border: `6px solid rgba(255,190,110,${(1 - q) * 0.6})` }} />; })}
    {Array.from({ length: 5 }, (_, i) => <House key={i} x={1060 + i * 190} y={500} w={150} lit={on ? cl((tt - pr - 0.8 - i * 0.35) * 2) : 0} />)}
    <div style={{ position: "absolute", left: 300, top: 220, width: 300, height: 520, borderRadius: 120, background: "linear-gradient(160deg,#2b2b30,#0d0d10)", boxShadow: "0 50px 100px rgba(0,0,0,.75), inset 0 3px 0 rgba(255,255,255,.12)", transform: `translateY(${(1 - s) * 500}px) rotate(${-12 + (1 - s) * 30}deg)` }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 90, top: 70 + i * 120, width: 120, height: 90, borderRadius: 30, background: "linear-gradient(180deg,#4a4a52,#2a2a30)", boxShadow: "inset 0 -4px 0 rgba(0,0,0,.4)" }} />)}
      <div style={{ position: "absolute", left: 80, top: 330, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #ff8a7a, #c4231a 70%)`, boxShadow: `0 ${10 - 8 * push}px 0 #6d120c, 0 0 ${on ? 50 * bl : 0}px rgba(255,60,40,.9)`, transform: `translateY(${8 * push}px)` }}>
        {h.dot && <div style={{ position: "absolute", left: 56, top: 56, width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #ff5a4a)", boxShadow: "0 3px 6px rgba(0,0,0,.5)" }} />}
      </div>
      <Sheen p={(tt * 0.22) % 1} r={120} o={0.18} />
    </div>
    <svg width={260} height={300} viewBox="0 0 260 300" style={{ position: "absolute", left: 360, top: 440 + (1 - cl(phys(tt, pr - 0.8, 5, 0.6))) * 400 + 14 * push }}>
      <path d="M 40 300 C 30 200 40 120 90 60 Q 120 24 150 50 Q 170 70 160 120 L 150 210 Q 200 230 220 300 Z" fill="#d9a77f" stroke="#a87650" strokeWidth={6} />
    </svg>
    <Tag tt={tt} at={pr + 0.9} x={1450} y={200} txt={h.lab ?? "EL AUTO GRITA POR TI"} col={AMB} size={54} />
  </>;
}}</Stage>;

// ---------- 25 · CASITAS QUE CUENTAN: N casas, las que cuentan se encienden de a una ----------
export const HFraction: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter" bg="radial-gradient(ellipse 80% 70% at 50% 55%, #161b28, #05060a 78%)">{(tt) => {
  const N = +h.d, M = +h.n, cols = N > 5 ? 5 : N, rows = Math.ceil(N / cols), w = N > 5 ? 230 : 320;
  return <>{Array.from({ length: N }, (_, i) => { const x = 960 + ((i % cols) - (cols - 1) / 2) * (w + 40), y = 560 + (Math.floor(i / cols) - (rows - 1) / 2) * (w + 40) + w / 2, s = phys(tt, 0.3 + i * 0.12, 6, 0.5), hit = i < M ? cl((tt - 1.6 - i * 0.25) * 3) : 0;
    return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - s) * -300}px)`, opacity: cl(s * 2) }}>
      <House x={x} y={y} w={w} lit={hit} c={hit ? (h.bad ? "#4a1e1a" : "#1e3a2a") : "#1b2030"} />
      {hit > 0 && <div style={{ position: "absolute", left: x - w / 2 - 12, top: y - w - 12, width: w + 24, height: w + 24, borderRadius: 24, boxShadow: `0 0 0 5px ${h.bad ? RED : GRN}`, opacity: hit }} />}
    </div>; })}
    <Tag tt={tt} at={1.8 + M * 0.25} x={960} y={160} txt={`${M} DE CADA ${N}`} col={h.bad ? RED : GRN} size={74} />
    {h.lab && <Tag tt={tt} at={2.3 + M * 0.25} x={960} y={950} txt={h.lab} col={DIM} size={40} />}
  </>;
}}</Stage>;

// ---------- 26 · LA BALANZA: dos platos con foto; el que pesa más baja con resorte ----------
export const HBalance: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const [A, B] = it(h), w = (h.best === 0 ? -1 : 1) * 14 * phys(tt, h.win ?? 2.8, 3, 0.35), q = (w * Math.PI) / 180, L = 520;
  const pan = (c: typeof A, sx: number) => { const x = 960 + sx * L * Math.cos(q), y = 330 + sx * L * Math.sin(q), s = phys(tt, c.at, 6, 0.45);
    return <><div style={{ position: "absolute", left: x - 2, top: y, width: 4, height: 160, background: "#b8a47a" }} />
      <div style={{ position: "absolute", left: x - 200, top: y + 150, width: 400, height: 40, borderRadius: "0 0 200px 200px", background: "linear-gradient(180deg,#e8d29b,#9c7f43)", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}><Sheen p={0.4} r={20} o={0.3} /></div>
      <div style={{ position: "absolute", left: x - 150, top: y - 90 + (1 - s) * -400, opacity: cl(s * 2) }}><Photo id={c.img} w={300} h={240} r={14} /></div>
      <Tag tt={tt} at={c.at + 0.4} x={x} y={y + 240} txt={c.t} col={TX} size={40} /></>; };
  return <>
    <div style={{ position: "absolute", left: 950, top: 330, width: 20, height: 560, background: "linear-gradient(90deg,#8a7446,#e8d29b,#8a7446)" }} />
    <div style={{ position: "absolute", left: 820, top: 880, width: 280, height: 40, borderRadius: 12, background: "linear-gradient(180deg,#e8d29b,#7d6434)" }} />
    <div style={{ position: "absolute", left: 960 - L, top: 322, width: 2 * L, height: 16, borderRadius: 8, background: "linear-gradient(180deg,#f2dfa8,#8a7446)", transform: `rotate(${w}deg)` }} />
    {pan(A, -1)}{pan(B, 1)}
    <div style={{ position: "absolute", left: 940, top: 300, width: 40, height: 40, borderRadius: "50%", background: "#f2dfa8" }} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;

// ---------- 27 · LA MIRILLA: el ojo de pez muestra a alguien deformado del otro lado; la cadena no basta ----------
export const HPeephole: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(90deg,#5a3d22,#3b2714)">{(tt) => {
  const o = phys(tt, 0.6, 3, 0.7), R = 300 * cl(o), st = phys(tt, h.stampAt ?? 3.4, 7, 0.38);
  return <>
    <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 2px, transparent 2px 26px)" }} />
    <div style={{ position: "absolute", left: 960 - R - 40, top: 500 - R - 40, width: 2 * R + 80, height: 2 * R + 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f2e2b0, #8c6e30 60%, #4a3612)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 960 - R, top: 500 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", boxShadow: "inset 0 0 80px 30px rgba(0,0,0,.85)" }}>
      {h.img && <Photo id={h.img} w={2 * R} h={2 * R} r={0} z={1.5} style={{ filter: "blur(.5px) brightness(.8)" }} />}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,.6))" }} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={1450 + i * 36} cy={700 + Math.sin(i * 0.9) * 24} rx={22} ry={14} fill="none" stroke="#c9c9c9" strokeWidth={8} opacity={cl(tt - 1.6)} />)}</svg>
    <div style={{ position: "absolute", left: 960, top: 900, transform: `translate(-50%,-50%) rotate(-6deg) scale(${Math.max(0, 2.4 - 1.4 * st)})`, opacity: cl(st * 3), fontFamily: MARK, fontSize: 70, color: RED, border: `7px solid ${RED}`, borderRadius: 16, padding: "4px 30px", background: "rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{h.stamp ?? "NO SE ABRE"}</div>
  </>;
}}</Stage>;

// ---------- 28 · EL ALCANCE DEL BRAZO: desde el vidrio se dibuja el radio; la llave adentro está perdida, en el gancho no ----------
export const HReach: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const r = eio(tt, 0.8, 2.0) * 430, mv = eio(tt, h.moveAt ?? 3.4, (h.moveAt ?? 3.4) + 1.2), G = { x: 520, y: 540 }, K = { x: 760 + mv * 700, y: 560 - mv * 220 };
  const inside = Math.hypot(K.x - G.x, K.y - G.y) < r;
  return <>
    <div style={{ position: "absolute", left: 340, top: 200, width: 360, height: 680, background: "linear-gradient(90deg,#6b4a2a,#8a6038)", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 70, top: 90, width: 220, height: 280, background: "linear-gradient(135deg, rgba(180,220,255,.55), rgba(120,160,200,.25))", border: "8px solid #4a3218" }}><Sheen p={(tt * 0.3) % 1} o={0.4} /></div>
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={G.x} cy={G.y - 160} r={r} fill={`rgba(255,90,74,${inside ? 0.12 : 0.06})`} stroke={RED} strokeWidth={6} strokeDasharray="16 12" />
      <line x1={G.x} y1={G.y - 160} x2={G.x + r * 0.92} y2={G.y - 160 + r * 0.38} stroke={RED} strokeWidth={5} opacity={cl(tt - 1.6)} />
    </svg>
    <Tag tt={tt} at={2.0} x={G.x + 300} y={G.y - 330} txt={h.lab ?? "UN BRAZO"} col={RED} size={56} />
    <svg width={150} height={70} viewBox="0 0 150 70" style={{ position: "absolute", left: K.x - 75, top: K.y - 35 - 160, transform: `rotate(${-20 + mv * 110}deg)`, filter: `drop-shadow(0 0 ${inside ? 16 : 0}px rgba(255,90,74,.9))` }}>
      <circle cx={30} cy={35} r={26} fill="none" stroke="#e8cf7a" strokeWidth={12} /><path d="M 56 30 L 140 30 L 140 40 L 130 40 L 130 52 L 118 52 L 118 40 L 106 40 L 106 50 L 96 50 L 96 40 L 56 40 Z" fill="#e8cf7a" />
    </svg>
    <div style={{ position: "absolute", left: 1460 - 18, top: 340 - 160 - 60, width: 36, height: 60, borderRadius: "0 0 18px 18px", borderBottom: "10px solid #bbb", borderLeft: "10px solid #bbb", borderRight: "10px solid #bbb", opacity: cl(tt - 2.6) }} />
    <Tag tt={tt} at={(h.moveAt ?? 3.4) + 1.2} x={1460} y={470} txt={h.lab2 ?? "EN EL GANCHO"} col={GRN} size={56} />
  </>;
}}</Stage>;

// ---------- 29 · EL FOCO: de luz blanca que encandila a luz cálida que alumbra el piso ----------
export const HKelvin: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 40%, #121318, #040405 78%)">{(tt) => {
  const k = eio(tt, h.warmAt ?? 2.4, (h.warmAt ?? 2.4) + 1.4), on = cl(phys(tt, 0.7, 5, 0.6)), col = (a: number) => `rgba(${255},${Math.round(255 - 60 * k)},${Math.round(255 - 150 * k)},${a})`;
  return <>
    <div style={{ position: "absolute", left: 960 - 620, top: 640, width: 1240, height: 360, borderRadius: "50%", background: `radial-gradient(ellipse, ${col(0.5 * on)}, transparent 70%)` }} />
    <div style={{ position: "absolute", left: 960, top: 0, width: 4, height: 300, background: "#333" }} />
    <div style={{ position: "absolute", left: 960 - 130, top: 290, width: 260, height: 300, borderRadius: "50% 50% 45% 45%", background: `radial-gradient(circle at 45% 40%, #fff, ${col(1)} 45%, ${col(0.5)})`, boxShadow: `0 0 ${160 * on}px ${50 * on}px ${col(0.55)}`, opacity: 0.3 + 0.7 * on }} />
    <div style={{ position: "absolute", left: 960 - 70, top: 250, width: 140, height: 70, borderRadius: 10, background: "linear-gradient(90deg,#666,#ccc,#666)" }} />
    <div style={{ position: "absolute", left: 560, top: 900, width: 800, height: 20, borderRadius: 10, background: "linear-gradient(90deg,#eaf4ff,#ffd27a)" }} />
    <div style={{ position: "absolute", left: 560 + 800 * k - 26, top: 884, width: 52, height: 52, borderRadius: "50%", background: "#fff", boxShadow: "0 8px 16px rgba(0,0,0,.5)" }} />
    <Tag tt={tt} at={0.9} x={560} y={960} txt="BLANCA" col={DIM} size={34} /><Tag tt={tt} at={(h.warmAt ?? 2.4) + 1.2} x={1360} y={960} txt={h.lab ?? "CÁLIDA"} col={AMB} size={40} />
  </>;
}}</Stage>;

// ---------- 30 · EL PÉNDULO DE LLAVES: el manojo cuelga libre de la manija, se mueve y suena ----------
export const HPendulum: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(90deg,#4b3420,#2a1c10)">{(tt) => {
  const kick = h.kickAt ?? 1.8, sw = tt > kick ? 24 * Math.sin((tt - kick) * 5.2) * Math.exp(-(tt - kick) * 0.6) : 4 * Math.sin(tt * 1.3), hd = tt > kick ? -14 * Math.exp(-(tt - kick) * 3) : 0, L = 330;
  return <>
    <div style={{ position: "absolute", left: 700, top: 300, width: 520, height: 70, borderRadius: 35, background: "linear-gradient(180deg,#f1e3b5,#a98c48 60%,#6d5426)", boxShadow: "0 24px 40px rgba(0,0,0,.6)", transform: `rotate(${hd}deg)`, transformOrigin: "100% 50%" }}><Sheen p={(tt * 0.3) % 1} r={35} o={0.4} /></div>
    <div style={{ position: "absolute", left: 1120, top: 300, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f1e3b5, #8a6e30)" }} />
    <div style={{ position: "absolute", left: 790, top: 360, width: 6, height: L, background: "#c9b58a", transformOrigin: "3px 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: -90, top: L - 10, transform: "scale(1.8)", transformOrigin: "90px 0" }}>{Array.from({ length: 6 }, (_, i) => <svg key={i} width={70} height={190} viewBox="0 0 70 190" style={{ position: "absolute", left: i * 26, top: (i % 2) * 18, transform: `rotate(${(i - 2.5) * 12 + sw * 0.4 * ((i % 3) - 1)}deg)`, transformOrigin: "35px 10px" }}>
        <circle cx={35} cy={22} r={16} fill="none" stroke={["#d8c06a", "#c0c0c0", "#b8865a"][i % 3]} strokeWidth={7} /><path d="M 30 38 L 40 38 L 40 180 L 30 180 Z M 40 140 L 56 140 L 56 150 L 40 150 Z M 40 162 L 52 162 L 52 172 L 40 172 Z" fill={["#d8c06a", "#c0c0c0", "#b8865a"][i % 3]} /></svg>)}</div>
    </div>
    {tt > kick && [0, 1].map((i) => { const q = ((tt - kick) * 0.9 + i * 0.5) % 1; return <svg key={i} width={600} height={600} style={{ position: "absolute", left: 500 + 0, top: 460 }}><path d={`M ${300 - 120 - q * 160} ${300 - 120 - q * 160} A ${170 + q * 220} ${170 + q * 220} 0 0 0 ${300 - 120 - q * 160} ${300 + 120 + q * 160}`} stroke={`rgba(255,200,120,${(1 - q) * 0.7})`} strokeWidth={8} fill="none" /></svg>; })}
    <div style={{ position: "absolute", left: 1180, top: 380, borderLeft: `4px solid ${AMB}`, height: L, paddingLeft: 26, display: "flex", alignItems: "center", opacity: cl(tt - 1) }}><div style={{ fontWeight: 900, fontSize: 64, color: AMB, whiteSpace: "nowrap" }}>{h.lab ?? "10 A 15 CM LIBRES"}</div></div>
  </>;
}}</Stage>;

// ---------- 31 · EL VASO EN LA PERILLA: la perilla gira apenas, el vaso pierde el equilibrio y cae en la bandeja ----------
export const HTip: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(90deg,#5d4026,#3a2714)">{(tt) => {
  const tw = h.turnAt ?? 1.8, turn = eio(tt, tw, tw + 0.5) * 16, fall = eIn(tt, tw + 0.4, tw + 1.25), hit = tt > tw + 1.25, X = 860, Y = 470;
  const gy = Y - 170 + fall * 520, gr = fall * 96, gx = X + fall * 60;
  return <>
    <div style={{ position: "absolute", left: X - 150, top: Y - 70, width: 300, height: 140, borderRadius: 70, background: "radial-gradient(circle at 40% 30%, #f6e7b8, #b89548 55%, #6d5426)", boxShadow: "0 30px 50px rgba(0,0,0,.55)", transform: `rotate(${turn}deg)` }}><Sheen p={(tt * 0.3) % 1} r={70} o={0.4} /></div>
    <div style={{ position: "absolute", left: X - 50, top: Y - 40, width: 100, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #d9bf7d, #8a6e30)" }} />
    <div style={{ position: "absolute", left: gx - 70, top: gy - 120, width: 140, height: 240, transform: `rotate(${gr}deg)`, transformOrigin: "50% 100%", opacity: hit ? 0 : 1 }}>
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(4% 0, 96% 0, 86% 100%, 14% 100%)", background: "linear-gradient(90deg, rgba(220,240,255,.35), rgba(255,255,255,.75) 30%, rgba(200,225,245,.25) 60%, rgba(255,255,255,.55))", boxShadow: "inset 0 0 20px rgba(255,255,255,.6)" }} />
      <div style={{ position: "absolute", left: 14, right: 14, top: 0, height: 12, borderRadius: "50%", border: "3px solid rgba(255,255,255,.7)" }} />
    </div>
    <div style={{ position: "absolute", left: X - 260, top: Y + 400, width: 520, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 30%, #e3e7ea, #8b9297 60%, #4d5357)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }}><Sheen p={0.5} r={260} o={0.5} /></div>
    {hit && [0, 1, 2].map((i) => { const q = ((tt - tw - 1.25) * 1.1 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: X - q * 600, top: Y + 430 - q * 600, width: q * 1200, height: q * 1200, borderRadius: "50%", border: `7px solid rgba(255,220,160,${(1 - q) * 0.7})` }} />; })}
    {hit && Array.from({ length: 9 }, (_, i) => { const q = cl((tt - tw - 1.25) * 2), a = -Math.PI * (0.1 + 0.8 * (i / 8)); return <div key={"g" + i} style={{ position: "absolute", left: X + Math.cos(a) * 200 * q, top: Y + 420 + Math.sin(a) * 140 * q + q * q * 60, width: 26, height: 14, background: "rgba(220,240,255,.8)", transform: `rotate(${i * 40}deg)`, opacity: 1 - q * 0.5 }} />; })}
    <div style={{ position: "absolute", left: 1420, top: 420, transform: `translate(-50%,-50%) scale(${hit ? cl(phys(tt, tw + 1.25, 7, 0.35)) : 0}) rotate(-8deg)`, fontFamily: MARK, fontSize: 140, color: AMB }}>{h.txt ?? "¡CLINC!"}</div>
    <Tag tt={tt} at={0.8} x={1420} y={700} txt={h.lab ?? "EL GATILLO Y LA CAMPANA"} col={DIM} size={40} />
  </>;
}}</Stage>;

// ---------- 32 · LA CUÑA: las flechas del empujón crecen y la cuña se clava más contra el piso ----------
export const HWedge: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const push = (n: number) => eio(tt, 1.2 + n * 0.9, 1.8 + n * 0.9), P = push(0) + push(1) + push(2), dig = P / 3;
  return <>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1920, height: 260, background: "linear-gradient(180deg,#6d5a45,#2e241a)" }} />
    <div style={{ position: "absolute", left: 1010 - 30 * dig, top: 100, width: 90, height: 720, background: "linear-gradient(90deg,#8a6038,#b17e4c,#7a522c)", boxShadow: "-20px 0 40px rgba(0,0,0,.5)", transform: `rotate(${-1.5 * dig}deg)`, transformOrigin: "50% 100%" }} />
    <svg width={400} height={180} viewBox="0 0 400 180" style={{ position: "absolute", left: 1100 - 30 * dig - 60 * dig, top: 820 - 170 + 10 * dig }}>
      <path d="M 0 170 L 380 170 L 0 20 Z" fill="#2a2a2c" /><path d="M 0 170 L 380 170 L 0 20 Z" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={4} />
    </svg>
    {[0, 1, 2].map((n) => { const k = push(n); return k > 0 ? <div key={n} style={{ position: "absolute", left: 640 - 260 * k, top: 380 + n * 120, height: 34, width: 260 * k + 120, background: `linear-gradient(90deg, transparent, ${RED})`, clipPath: "polygon(0 30%, 85% 30%, 85% 0, 100% 50%, 85% 100%, 85% 70%, 0 70%)", opacity: 0.9 }} /> : null; })}
    <div style={{ position: "absolute", left: 1330, top: 260, transform: `translate(-50%,-50%) rotate(${-4}deg)`, whiteSpace: "nowrap", fontWeight: 900, fontSize: 72, color: GRN, opacity: cl((tt - 2.4) * 2) }}>{h.lab ?? "MÁS EMPUJA, MÁS TRABA"}</div>
    <Tag tt={tt} at={0.6} x={420} y={430} txt={h.lab2 ?? "AFUERA"} col={DIM} size={40} />
  </>;
}}</Stage>;

// ---------- 33 · LA CINTA TESTIGO: pegada en la rendija; al volver, cortada ----------
export const HTape: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(90deg,#3a2a1a,#5c4026 49%,#1a1209 49.6%,#6b4a2a 50%,#4a321b)">{(tt) => {
  const put = eio(tt, 0.6, 1.3), cut = eio(tt, h.cutAt ?? 3.0, (h.cutAt ?? 3.0) + 0.5), gap = 20 * cut;
  return <>
    <div style={{ position: "absolute", left: 952 - gap, top: 0, width: 16 + 2 * gap, height: 1080, background: "#050403" }} />
    {[0, 1].map((side) => <div key={side} style={{ position: "absolute", left: side ? 960 + gap : 960 - 200 * put - gap, top: 640 + (side ? 6 * cut : -6 * cut), width: 200 * put, height: 70, background: "linear-gradient(180deg,#f0e6c8,#d9cba4)", boxShadow: "0 6px 10px rgba(0,0,0,.35)", transform: `rotate(${side ? 4 * cut : -4 * cut}deg)`, clipPath: cut > 0 ? (side ? "polygon(6% 0,100% 0,100% 100%,0 100%,8% 70%,2% 45%,9% 22%)" : "polygon(0 0,94% 0,100% 25%,93% 50%,99% 75%,92% 100%,0 100%)") : undefined }} />)}
    <Tag tt={tt} at={1.4} x={960} y={540} txt={h.a ?? "ENTERA = NADIE"} col={GRN} size={44} />
    <div style={{ position: "absolute", left: 960, top: 830, transform: `translate(-50%,-50%) scale(${cl(phys(tt, (h.cutAt ?? 3.0) + 0.5, 7, 0.38))}) rotate(-5deg)`, fontFamily: MARK, fontSize: 74, color: RED, whiteSpace: "nowrap" }}>{h.b ?? "CORTADA = ALGUIEN ABRIÓ"}</div>
  </>;
}}</Stage>;

// ---------- 34 · RELOJ DE ARENA: se da vuelta y la arena corre; el tiempo que el ladrón no tiene ----------
export const HHourglass: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const flip = eio(tt, 0.4, 1.2), run = eio(tt, 1.2, 1.2 + (h.dur ?? 4)), W = 300, Hh = 520;
  return <>
    <Shadow x={960} y={880} w={420} />
    <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - Hh / 2, width: W, height: Hh, transform: `rotate(${180 - 180 * flip}deg)` }}>
      <div style={{ position: "absolute", left: -30, top: -30, width: W + 60, height: 40, borderRadius: 10, background: "linear-gradient(180deg,#a77a48,#5c3d1e)" }} />
      <div style={{ position: "absolute", left: -30, top: Hh - 10, width: W + 60, height: 40, borderRadius: 10, background: "linear-gradient(180deg,#a77a48,#5c3d1e)" }} />
      <svg width={W} height={Hh} style={{ position: "absolute" }}>
        <defs><clipPath id="hgT"><path d={`M 10 10 L ${W - 10} 10 Q ${W - 10} ${Hh * 0.38} ${W / 2 + 12} ${Hh / 2} L ${W / 2 - 12} ${Hh / 2} Q 10 ${Hh * 0.38} 10 10 Z`} /></clipPath>
          <clipPath id="hgB"><path d={`M ${W / 2 - 12} ${Hh / 2} L ${W / 2 + 12} ${Hh / 2} Q ${W - 10} ${Hh * 0.62} ${W - 10} ${Hh - 10} L 10 ${Hh - 10} Q 10 ${Hh * 0.62} ${W / 2 - 12} ${Hh / 2} Z`} /></clipPath></defs>
        <rect x={0} y={20 + (Hh / 2 - 30) * run} width={W} height={Hh / 2} fill="#e9b864" clipPath="url(#hgT)" />
        <path d={`M 0 ${Hh} L ${W} ${Hh} L ${W} ${Hh - 10 - (Hh / 2 - 40) * run} L ${W / 2} ${Hh - 30 - (Hh / 2 - 20) * run} L 0 ${Hh - 10 - (Hh / 2 - 40) * run} Z`} fill="#e9b864" clipPath="url(#hgB)" />
        {run > 0 && run < 1 && <line x1={W / 2} y1={Hh / 2} x2={W / 2} y2={Hh - 40 - (Hh / 2 - 40) * run} stroke="#e9b864" strokeWidth={5} />}
        <path d={`M 10 10 L ${W - 10} 10 Q ${W - 10} ${Hh * 0.38} ${W / 2 + 12} ${Hh / 2} Q ${W - 10} ${Hh * 0.62} ${W - 10} ${Hh - 10} L 10 ${Hh - 10} Q 10 ${Hh * 0.62} ${W / 2 - 12} ${Hh / 2} Q 10 ${Hh * 0.38} 10 10 Z`} fill="rgba(200,230,255,.12)" stroke="rgba(255,255,255,.6)" strokeWidth={5} />
      </svg>
      <Sheen p={(tt * 0.25) % 1} o={0.25} />
    </div>
    <Tag tt={tt} at={1.6} x={960} y={130} txt={h.lab ?? "EL TIEMPO QUE ODIA"} col={AMB} size={54} />
  </>;
}}</Stage>;

// ---------- 35 · TEMPORIZADOR DE RUEDITA: la rueda gira, las patitas del tramo bajan y la lámpara se prende ----------
export const HTimer: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = h.a ?? 20, b = h.b ?? 24.5, R = 300, hour = (eio(tt, 1.6, 4.6) * (b - a + 1.75) + (a - 2)) % 24, lit = (hour >= a && hour < b) || (b > 24 && hour < b - 24) ? 1 : 0;
  return <>
    <div style={{ position: "absolute", left: 560 - R - 40, top: 540 - R - 40, width: 2 * R + 80, height: 2 * R + 80, borderRadius: 60, background: "linear-gradient(160deg,#f1f1ee,#c9c8c2)", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 560 - R, top: 540 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle,#fafaf7,#dcdbd5)", transform: `rotate(${-hour * 15}deg)` }}>
      {Array.from({ length: 48 }, (_, i) => { const hh = i / 2, on = (hh >= a && hh < b) || (b > 24 && hh < b - 24), d = on ? cl(phys(tt, 0.6 + (i % 12) * 0.06, 8, 0.5)) : 0;
        return <div key={i} style={{ position: "absolute", left: R - 9, top: 4 + 22 * d, width: 18, height: 44, borderRadius: 4, background: on ? "#2b6fd6" : "#d8d6cf", boxShadow: "0 3px 4px rgba(0,0,0,.3)", transformOrigin: `9px ${R - 4 - 22 * d}px`, transform: `rotate(${i * 7.5}deg)` }} />; })}
      {[0, 3, 6, 9, 12, 15, 18, 21].map((hh) => <div key={hh} style={{ position: "absolute", left: R - 30, top: 70, width: 60, textAlign: "center", fontWeight: 900, fontSize: 34, color: "#333", transformOrigin: `30px ${R - 70}px`, transform: `rotate(${hh * 15}deg)` }}>{hh}</div>)}
    </div>
    <div style={{ position: "absolute", left: 560 - 14, top: 540 - R - 60, width: 28, height: 70, background: RED, clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
    <div style={{ position: "absolute", left: 1350, top: 360, width: 300, height: 220, borderRadius: "50% 50% 8px 8px", background: lit ? "radial-gradient(circle at 50% 80%, #fff1c9, #f0b75a)" : "linear-gradient(180deg,#5b5248,#3a342d)", boxShadow: lit ? "0 0 140px 40px rgba(255,200,110,.55)" : "0 20px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1490, top: 580, width: 20, height: 240, background: "#3a342d" }} /><div style={{ position: "absolute", left: 1400, top: 810, width: 200, height: 30, borderRadius: 10, background: "#3a342d" }} />
    <Tag tt={tt} at={1.4} x={1500} y={900} txt={h.lab ?? "20:00 → 0:30"} col={AMB} size={50} />
    <div style={{ position: "absolute", left: 560, top: 540, transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 64, color: "#222" }}>{String(Math.floor(hour)).padStart(2, "0")}:{String(Math.floor((hour % 1) * 60)).padStart(2, "0")}</div>
  </>;
}}</Stage>;

// ---------- 36 · LA CALLE DE NOCHE: el que mira desde la vereda barre las casas; la apagada queda marcada ----------
export const HStreet: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#0a0f1e,#141a2c 60%,#0a0b10)">{(tt) => {
  const L = (h.lit ?? [1, 0, 1, 1, 0.5]) as number[], tgt = h.target ?? 1, scan = eio(tt, 1.0, 3.2), X = (i: number) => 330 + i * 315, sx = X(0) + (X(L.length - 1) - X(0)) * scan;
  const lock = cl((tt - 3.3) * 2), cx = lock > 0 ? X(tgt) : sx;
  return <>
    <div style={{ position: "absolute", left: 1600, top: 110, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 38% 36%, #fffbe9, #d8cba1)", boxShadow: "0 0 80px 20px rgba(255,240,200,.18)" }} />
    {L.map((l, i) => <House key={i} x={X(i)} y={860} w={280} lit={l * (i === tgt && h.flipAt && tt > h.flipAt ? 1 : 1) + (i === tgt && h.flipAt ? cl((tt - h.flipAt) * 2) * (1 - l) : 0)} />)}
    <div style={{ position: "absolute", left: 0, top: 860, width: 1920, height: 220, background: "#07080c" }} />
    <div style={{ position: "absolute", left: cx - 180, top: 520, width: 360, height: 360, borderRadius: 30, border: `6px solid ${lock > 0 ? RED : "rgba(255,255,255,.45)"}`, boxShadow: lock > 0 ? "0 0 40px rgba(255,90,74,.6)" : undefined, transform: `scale(${1 + 0.15 * (1 - lock) * Math.sin(tt * 6)})` }} />
    <Tag tt={tt} at={3.4} x={X(tgt)} y={470} txt={h.lab ?? "PARECE VACÍA"} col={RED} size={44} />
    {h.title && <Head tt={tt} kick={h.kick ?? ""} title={h.title} />}
  </>;
}}</Stage>;
