// te29a · ronda 2 del evaluador (31-oct): los 16 componentes que no llegaban a 6 se rehacen como OBJETOS con volumen y material
// (losa extruida, vidrio, cartón, madera, chapa), grandes y al centro; cada mapa pasó a ser un objeto distinto. Mismas claves que ta.tsx.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, Tag, cl, eio, phys } from "./hkit";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const PAPER = "#f1ead9", INK = "#2b2620", ROCK = "#b3ae9f", ROCKD = "#7d786c";
// sombra de contacto: el objeto APOYA en algo
const Floor: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.65 }) => <div style={{ ...at(x - w / 2, y - 26), width: w, height: 52, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o}), transparent 70%)`, filter: "blur(7px)" }} />;
// número que cae con peso
const Num: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 130 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(0,0,0,.25), 0 20px 44px rgba(0,0,0,.75)" }}>{txt}</div>;
};
// LOSA EXTRUIDA: una forma (border-radius o clip-path) repetida hacia abajo en tono más oscuro = espesor real de tierra/roca
const Slab: React.FC<{ w: number; h: number; depth: number; top: string; side: string; br?: string; clip?: string; children?: React.ReactNode }> = ({ w, h, depth, top, side, br, clip, children }) => <div style={{ position: "relative", width: w, height: h + depth }}>
  {Array.from({ length: Math.ceil(depth / 3) }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: depth - i * 3, width: w, height: h, borderRadius: br, clipPath: clip, background: side, filter: `brightness(${0.55 + 0.35 * (i / (depth / 3))})` }} />)}
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: br, clipPath: clip, background: top, overflow: "hidden" }}>{children}<div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.22), transparent 45%, rgba(0,0,0,.25))" }} /></div>
</div>;
const ISL_BR = "47% 53% 50% 50% / 52% 46% 54% 48%";
// isla de Nauru en losa: anillo verde de costa, meseta gris de pináculos adentro
const Island: React.FC<{ w: number; mined?: number; depth?: number }> = ({ w, mined = 1, depth = 46 }) => <Slab w={w} h={w * 0.62} depth={depth} br={ISL_BR} side="#6b5a3e" top={`radial-gradient(ellipse at 50% 50%, #4f8a52 64%, #e6d6a8 67%, #e6d6a8 72%, #2a7f96 74%)`}>
  <div style={{ position: "absolute", inset: "16% 18%", borderRadius: "50% 46% 52% 48%", background: `conic-gradient(from -90deg, ${ROCK} 0deg, ${ROCK} ${mined * 360}deg, #3f6d3e ${mined * 360 + 0.5}deg)`, boxShadow: "inset 0 6px 18px rgba(0,0,0,.45)" }}>
    {Array.from({ length: 26 }, (_, i) => { const a = (i * 137.5 * Math.PI) / 180, r = 0.42 * Math.sqrt((i + 1) / 26), on = ((Math.atan2(Math.sin(a), Math.cos(a)) + Math.PI * 2.5) % (Math.PI * 2)) / (Math.PI * 2) < mined;
      return on ? <div key={i} style={{ position: "absolute", left: `${50 + Math.cos(a) * r * 100}%`, top: `${50 + Math.sin(a) * r * 100}%`, width: 10, height: 10, borderRadius: "50% 50% 20% 20%", background: "#ecebe4", boxShadow: "0 3px 0 #8d897d" }} /> : null; })}
  </div>
</Slab>;
// barco de carga / vapor de perfil, con volumen (casco con brillo y sombra), escala por ancho
const Ship: React.FC<{ w: number; hull?: string; name?: string; smoke?: number; tt?: number }> = ({ w, hull = "#2f343b", name, smoke = 0, tt = 0 }) => <div style={{ position: "relative", width: w, height: w * 0.42 }}>
  {smoke > 0 && Array.from({ length: 5 }, (_, i) => { const k = (tt * 0.4 + i / 5) % 1; return <div key={i} style={{ ...at(w * 0.56 - k * w * 0.4, w * 0.02 - k * w * 0.14), width: w * (0.08 + 0.1 * k), height: w * (0.08 + 0.1 * k), borderRadius: "50%", background: "rgba(200,200,200,.35)", filter: "blur(6px)", opacity: smoke * (1 - k) }} />; })}
  <div style={{ ...at(w * 0.5, w * 0.08), width: w * 0.08, height: w * 0.14, background: "linear-gradient(90deg,#4a1d17,#a3392b 50%,#4a1d17)", borderRadius: "4px 4px 0 0" }} />
  <div style={{ ...at(w * 0.34, w * 0.18), width: w * 0.34, height: w * 0.1, background: "linear-gradient(180deg,#f2efe6,#c9c4b6)", borderRadius: 4, boxShadow: "inset 0 -4px 0 rgba(0,0,0,.15)" }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...at(w * (0.02 + i * 0.053), w * 0.03), width: w * 0.03, height: w * 0.03, borderRadius: 3, background: "#26323d" }} />)}</div>
  <div style={{ ...at(0, w * 0.27), width: w, height: w * 0.13, clipPath: "polygon(0 0, 100% 0, 93% 100%, 5% 100%)", background: `linear-gradient(180deg, ${hull}, #0f1216)`, boxShadow: "inset 0 6px 0 rgba(255,255,255,.12)" }}>
    <div style={{ ...at(0, w * 0.075), width: w, height: w * 0.02, background: "#8a1f1a" }} />
    {name && <div style={{ ...at(w * 0.08, w * 0.012), fontWeight: 900, fontSize: w * 0.05, color: "#f2efe6", letterSpacing: 4 }}>{name}</div>}
  </div>
</div>;
// mar en capas (frente al objeto) con espuma: el barco se hunde en el agua, no flota encima
const Sea: React.FC<{ tt: number; y: number; front?: boolean }> = ({ tt, y, front }) => <svg width={1920} height={1080 - y} style={{ ...at(0, y), overflow: "visible" }}>
  {[0, 1, 2].map((i) => { const yy = i * 26 + (front ? 30 : 0), o = (tt * (30 + i * 14)) % 240;
    return <path key={i} d={`M${-240 + o} ${yy} ${Array.from({ length: 10 }, (_, j) => `q60 ${-14 + i * 2} 120 0 t120 0`).join(" ")} V${1080} H-240 Z`} fill={front ? `rgba(16,50,70,${0.75 + i * 0.08})` : `rgba(28,78,104,${0.6 + i * 0.1})`} stroke="rgba(230,245,255,.35)" strokeWidth={3} />; })}
</svg>;

// ---- 0:37 · DEL TAMAÑO DE UN BARRIO: la isla-losa apoya sobre el plano de una ciudad de manzanas reales; un auto da la vuelta y el reloj llega a 30 min ----
export const TIslaSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const d = phys(tt, 0.4, 5, 0.5), lap = eio(tt, 2.2, 5.8), a = lap * Math.PI * 2 - Math.PI / 2;
  return <>
    <div style={{ ...at(260, 330), width: 1400, height: 640, transform: "perspective(1700px) rotateX(52deg)", transformOrigin: "50% 70%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#d9d2c0", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
      <svg width={1400} height={640} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 14 * 6 }, (_, i) => <rect key={i} x={(i % 14) * 100 + 10} y={Math.floor(i / 14) * 106 + 10} width={80} height={86} rx={6} fill={i % 7 === 3 ? "#9dbb8c" : "#efe9da"} stroke="#b9b09a" strokeWidth={2} />)}</svg>
      <div style={{ ...at(700 - 330, 320 - 205), transform: `translateY(${(1 - d) * -700}px)`, opacity: cl(d * 3) }}>
        <Island w={660} />
        <svg width={660} height={460} style={{ position: "absolute", inset: 0 }}><ellipse cx={330} cy={205} rx={300} ry={186} fill="none" stroke={AMB} strokeWidth={8} strokeDasharray={`${1500 * lap} 2000`} transform="rotate(-90 330 205)" strokeLinecap="round" opacity={0.9} /></svg>
        {lap > 0 && <div style={{ ...at(330 + Math.cos(a) * 300 - 50, 205 + Math.sin(a) * 186 - 26), width: 100, height: 52, borderRadius: 14, background: "linear-gradient(180deg,#ff7a5d,#a8261e)", transform: `rotate(${(a * 180) / Math.PI + 90}deg)`, boxShadow: "0 10px 12px rgba(0,0,0,.55)" }}><div style={{ position: "absolute", left: 24, top: 8, width: 46, height: 36, borderRadius: 8, background: "linear-gradient(90deg,#26323d,#7d9ab4)" }} /></div>}
      </div>
    </div>
    <Num tt={tt} d={0.9} x={960} y={180} txt={h.kw ?? "21 km²"} size={150} />
    <div style={{ ...at(960, 1000), transform: "translate(-50%,-50%)", opacity: cl((tt - 2.2) * 2), fontWeight: 900, fontSize: 70, color: AMB, textShadow: "0 8px 30px #000", whiteSpace: "nowrap" }}>{Math.round(30 * lap)} MIN · LA VUELTA ENTERA</div>
  </>;
}}</Stage>;

// ---- 1:00 · EL MORDISCO: la isla-losa en primer plano y una pala gigante le arranca la meseta; el hueco queda gris y el % se graba en la roca ----
export const TBite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.6, 3.6), bucket = Math.sin(Math.PI * cl((tt - 0.4) / 1.0)) * (tt < 3.8 ? 1 : 0);
  return <>
    <Floor x={960} y={860} w={1300} />
    <div style={{ ...at(960 - 620, 300), transform: "perspective(1600px) rotateX(48deg)", transformOrigin: "50% 80%" }}><Island w={1240} mined={0.8 * k} depth={90} /></div>
    <svg width={520} height={420} style={{ ...at(1240, 60 + 140 * bucket), transform: `rotate(${-20 + 30 * bucket}deg)`, transformOrigin: "100% 0", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.6))" }}>
      <rect x={380} y={0} width={44} height={260} rx={10} fill="#e0a72b" stroke="#7a5a12" strokeWidth={4} />
      <path d="M200 240 L430 240 L410 380 L230 400 Z" fill="#c78f1e" stroke="#6b4c10" strokeWidth={5} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${232 + i * 38} 398 l12 22 l12 -24 Z`} fill="#8d8a80" />)}
    </svg>
    <Num tt={tt} d={0.6} x={960} y={150} txt={`${Math.round(80 * k)} %`} size={170} col={k > 0.98 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={3.2} x={960} y={960} txt="DE LA ISLA, MINADO" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 3:08 · DOS MACETAS: dos macetas de barro con el mismo trigo; sin fósforo queda raquítico, con fósforo trepa y se dora ----
const Pot: React.FC<{ x: number; grow: number; gold: number; lab: string; col: string; tt: number; d: number }> = ({ x, grow, gold, lab, col, tt, d }) => <><div style={{ position: "absolute", inset: 0, transform: "scale(1.28)", transformOrigin: `${x}px 880px` }}>
  <Floor x={x} y={900} w={460} />
  <svg width={440} height={720} style={{ ...at(x - 220, 180), overflow: "visible" }}>
    {Array.from({ length: 11 }, (_, i) => { const hgt = (90 + (i % 3) * 22) + 360 * grow * (0.8 + (i % 4) * 0.07), xx = 90 + i * 26, sway = 6 * Math.sin(tt * 1.4 + i);
      const ear = `rgb(${Math.round(lerp(120, 230, gold))},${Math.round(lerp(150, 182, gold))},${Math.round(lerp(70, 64, gold))})`;
      return <g key={i}><path d={`M${xx} 480 Q${xx + sway} ${480 - hgt / 2} ${xx + sway * 2} ${480 - hgt}`} stroke={grow > 0.5 ? "#9a9a3a" : "#7a8a3a"} strokeWidth={6} fill="none" />
        {Array.from({ length: grow > 0.3 ? 7 : 2 }, (_, j) => <ellipse key={j} cx={xx + sway * 2 + (j % 2 ? 9 : -9)} cy={480 - hgt + 14 + j * 15} rx={8 + 3 * grow} ry={15 + 4 * grow} fill={ear} stroke="rgba(0,0,0,.2)" />)}</g>; })}
    <path d="M40 470 L400 470 L360 700 L80 700 Z" fill="url(#pot)" /><path d="M58 540 L382 540 M70 610 L370 610" stroke="rgba(70,30,10,.35)" strokeWidth={8} /><path d="M120 500 Q140 600 120 690" stroke="rgba(255,220,190,.25)" strokeWidth={14} fill="none" />
    <rect x={24} y={450} width={392} height={44} rx={10} fill="#c0643a" />
    <ellipse cx={220} cy={470} rx={176} ry={18} fill="#3a2614" />
    <defs><linearGradient id="pot" x1="0" x2="1"><stop offset="0" stopColor="#7a3a1e" /><stop offset=".4" stopColor="#d27a4a" /><stop offset="1" stopColor="#6e3219" /></linearGradient></defs>
  </svg>
  </div>
  <Tag tt={tt} at={d} x={x} y={1000} txt={lab} col={col} size={46} />
</>;
export const TWheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <>
  <Pot x={560} grow={0.12 * eio(tt, 0.4, 2.0)} gold={0.1} lab="SIN FÓSFORO" col={RED} tt={tt} d={0.6} />
  <Pot x={1360} grow={eio(tt, 1.8, 4.6)} gold={eio(tt, 3.0, 5.0)} lab="CON FÓSFORO" col={GRN} tt={tt} d={2.0} />
</>}</Stage>;

// ---- 3:34 · LA ISLA HECHA DE ABONO: una probeta de vidrio enorme; las aves pasan y cada pasada deja una capa; el contador de años rueda dentro ----
export const TStrata: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.4, 6.0), n = Math.floor(f * 16), part = f * 16 - n, H0 = 720, LH = 42;
  return <>
    <Floor x={960} y={950} w={600} />
    <div style={{ ...at(800, 200), width: 320, height: H0 + 30 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (n + part) * LH, borderRadius: "0 0 150px 150px / 0 0 34px 34px", overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
        {Array.from({ length: n + 1 }, (_, i) => <div key={i} style={{ flex: "none", height: i === n ? part * LH : LH, background: ["#d8cfb5", "#c3b68f", "#e6dec6", "#b4a682"][i % 4], borderTop: "2px solid rgba(80,60,30,.25)" }} />)}
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 150px 150px / 20px 20px 34px 34px", border: "5px solid rgba(225,240,255,.75)", background: "linear-gradient(90deg, rgba(255,255,255,.18), rgba(255,255,255,.02) 30%, rgba(255,255,255,.0) 70%, rgba(255,255,255,.14))", boxShadow: "inset 18px 0 30px rgba(255,255,255,.1)" }} />
      <div style={{ ...at(40, 30), width: 22, height: H0 - 60, borderRadius: 11, background: "linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0))" }} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...at(320, H0 - i * 120), width: 30, height: 4, background: "rgba(225,240,255,.7)" }} />)}
    </div>
    {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.45 + i / 6) % 1), x = lerp(300, 1640, k), y = 150 + 40 * Math.sin(k * Math.PI * 2 + i) + (i % 3) * 30;
      return <svg key={i} width={110} height={50} style={{ ...at(x, y), filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }}><path d={`M5 30 Q30 ${10 + 14 * Math.sin(tt * 7 + i)} 55 28 Q80 ${10 + 14 * Math.sin(tt * 7 + i)} 105 30`} fill="none" stroke="#f6f2ea" strokeWidth={7} strokeLinecap="round" /><ellipse cx={55} cy={30} rx={9} ry={6} fill="#f6f2ea" /></svg>; })}
    <Num tt={tt} d={0.4} x={1420} y={540} txt={`${Math.round(f * 100)}.000`} size={120} />
    <Tag tt={tt} at={0.9} x={1420} y={660} txt="AÑOS DE AVES MARINAS" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 4:22 · TRES PAÍSES: la isla es una torta-losa sobre la mesa; dos cortes la parten en tres porciones y cada una se va con su banderita de palillo ----
export const TSplit3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cut = eio(tt, 0.8, 1.8), sp = eio(tt, 1.8, 3.4), names: string[] = h.names ?? ["", "", ""], cols = [RED, AMB, ICE];
  const FL = [["#012169", "#c8102e"], ["#00843d", "#ffcd00"], ["#012169", "#ffffff"]];
  return <>
    <Floor x={960} y={860} w={1200} />
    {[0, 1, 2].map((i) => { const ang = (-90 + i * 120 + 60) * Math.PI / 180, dx = Math.cos(ang) * 230 * sp, dy = Math.sin(ang) * 110 * sp;
      return <div key={i} style={{ ...at(960 - 420, 380), transform: `perspective(1600px) rotateX(55deg) translate(${dx}px,${dy * 2}px)`, transformOrigin: "50% 50%" }}>
        <Slab w={840} h={560} depth={70} br="50%" side="#6b5a3e" clip={`polygon(50% 50%, ${[0, 1, 2, 3, 4, 5, 6].map((j) => { const a = ((i * 120 + j * 20 - 90) * Math.PI) / 180; return `${50 + Math.cos(a) * 75}% ${50 + Math.sin(a) * 75}%`; }).join(", ")})`}
          top={`radial-gradient(ellipse at 50% 50%, ${ROCK} 55%, #4f8a52 58%, #4f8a52 70%, #e6d6a8 73%)`} />
      </div>; })}
    {[0, 1, 2].map((i) => { const ang = (-90 + i * 120 + 60) * Math.PI / 180, x = 960 + Math.cos(ang) * (150 + 260 * sp), y = 560 + Math.sin(ang) * (70 + 120 * sp), s = phys(tt, 2.0 + i * 0.35, 7, 0.45);
      return s > 0.01 ? <div key={i} style={{ ...at(x, y - 190 * s), transform: "translateX(-4px)" }}>
        <div style={{ width: 8, height: 190, background: "linear-gradient(90deg,#c9a671,#f0dcb0,#a8875a)", borderRadius: 4 }} />
        <div style={{ ...at(8, 0), width: 150 * s, height: 96, background: `linear-gradient(135deg, ${FL[i][0]} 0 60%, ${FL[i][1]} 60%)`, boxShadow: "0 8px 14px rgba(0,0,0,.45)", borderRadius: 3 }} />
        <div style={{ ...at(4, 210), transform: "translateX(-50%)", whiteSpace: "nowrap", fontWeight: 900, fontSize: 38, color: cols[i], textShadow: "0 4px 16px #000" }}>{names[i]}</div>
      </div> : null; })}
    {cut > 0 && cut < 1 && <div style={{ ...at(960 - 8, 200 + 400 * cut), width: 16, height: 220, background: "linear-gradient(90deg,#999,#fff,#888)", borderRadius: 8, boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} />}
  </>;
}}</Stage>;

// ---- 7:14 · LA DEPORTACIÓN: un barco de guerra japonés se aleja cargado de gente (figuras en cubierta); el contador baja de 1.200 y vuelven menos ----
export const TDeport: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 0.4, 3.4), back = eio(tt, 3.8, 5.6), x = back > 0 ? lerp(1500, 520, back) : lerp(440, 1500, go), sc = back > 0 ? lerp(0.62, 0.9, back) : lerp(1.0, 0.62, go);
  const people = back > 0 ? 26 : 40;
  return <>
    <Sea tt={tt} y={640} />
    <div style={{ ...at(x - 420 * sc, 640 - 300 * sc), transform: `scale(${sc}) scaleX(${back > 0 ? -1 : 1}) rotate(${1.2 * Math.sin(tt * 1.3)}deg)`, transformOrigin: "0 0" }}>
      <div style={{ position: "relative" }}>
        <Ship w={840} hull="#3a3f46" smoke={1} tt={tt} />
        {Array.from({ length: people }, (_, i) => <div key={i} style={{ ...at(80 + (i % 20) * 34, 96 + Math.floor(i / 20) * 16), width: 14, height: 30, borderRadius: "7px 7px 2px 2px", background: i % 3 ? "#e8dcc6" : "#c9b89a", boxShadow: "0 3px 0 rgba(0,0,0,.35)" }} />)}
      </div>
    </div>
    <Sea tt={tt + 3} y={760} front />
    <Num tt={tt} d={0.5} x={960} y={170} txt={back > 0 ? `VOLVIERON ${Math.round(lerp(1200, 737, back)).toLocaleString("es-AR")}` : `${(1200).toLocaleString("es-AR")} PERSONAS`} size={92} col={back > 0.5 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={1.2} x={960} y={290} txt={back > 0 ? "1946 · DE CHUUK A CASA" : "1943 · DEPORTADOS A CHUUK"} col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 8:29 · LA MUDANZA: una caja de cartón grande; las casitas del pueblo entran, se cierra la tapa con cinta… y baja el sello NO ----
export const TMoveBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ins = eio(tt, 0.4, 2.6), lid = eio(tt, 2.6, 3.4), tape = eio(tt, 3.3, 3.9), stamp = phys(tt, 4.4, 7, 0.32);
  return <>
    <Floor x={960} y={900} w={1000} />
    <div style={{ ...at(560, 420), width: 800, height: 480, perspective: 1600 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#c99a5e,#a87a43)", borderRadius: 6, boxShadow: "inset 0 0 0 4px rgba(90,60,25,.4), 0 30px 50px rgba(0,0,0,.6)" }}>
        <div style={{ ...at(40, 60), fontWeight: 900, fontSize: 52, color: "rgba(60,35,10,.75)", letterSpacing: 3 }}>CURTIS ISLAND · QLD</div>
        <div style={{ ...at(40, 130), fontFamily: "Courier New, monospace", fontSize: 30, color: "rgba(60,35,10,.7)" }}>FRÁGIL · ESTE LADO ARRIBA ↑</div>
      </div>
      {Array.from({ length: 5 }, (_, i) => { const k = cl(ins * 1.8 - i * 0.18);
        return <svg key={i} width={120} height={120} style={{ ...at(90 + i * 130, lerp(-360, 40, k)), opacity: k > 0.98 && lid > 0.4 ? 0 : 1 }}><path d="M10 60 L60 14 L110 60 V112 H10 Z" fill="#f1ead9" stroke="#9a8f78" strokeWidth={4} /><rect x={48} y={74} width={24} height={38} fill="#8a5a33" /><path d="M2 64 L60 8 L118 64" stroke="#b5452e" strokeWidth={12} fill="none" /></svg>; })}
      {[0, 1].map((s) => <div key={s} style={{ ...at(s ? 400 : 0, -4), width: 400, height: 220, background: "linear-gradient(180deg,#d6a86c,#b5864c)", transformOrigin: s ? "100% 0" : "0 0", transform: `rotateX(${lerp(-150, 0, lid)}deg) rotateY(${s ? -1 : 1}deg)`, borderRadius: 4, boxShadow: "inset 0 0 0 3px rgba(90,60,25,.35)" }} />)}
      <div style={{ ...at(370, -4), width: 60, height: 220 * tape, background: "rgba(225,210,160,.85)" }} />
    </div>
    {stamp > 0.01 && <div style={{ ...at(960, 600), transform: `translate(-50%,-50%) translateY(${(1 - stamp) * -380}px) scale(${1.6 - 0.6 * stamp}) rotate(-10deg)`, opacity: cl(stamp * 2), border: "16px solid #d42a22", color: "#d42a22", padding: "0 60px", fontWeight: 900, fontSize: 220, lineHeight: 1.05, borderRadius: 20, background: "rgba(255,240,230,.08)", mixBlendMode: "screen" }}>NO</div>}
    <Num tt={tt} d={0.3} x={960} y={190} txt="1964 · LES OFRECEN MUDARSE" size={72} col={AMB} />
  </>;
}}</Stage>;

// ---- 9:19 · LA BANDERA SUBE: mástil de metal con roldana; la bandera de Nauru (franja fina amarilla, estrella de 12 puntas) trepa con viento; el almanaque arranca su hoja ----
const Star12: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => <polygon points={Array.from({ length: 24 }, (_, i) => { const a = (i * Math.PI) / 12 - Math.PI / 2, rr = i % 2 ? r * 0.5 : r; return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`; }).join(" ")} fill="#fff" />;
export const TFlag68: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const up = eio(tt, 0.4, 3.4), cal = phys(tt, 2.8, 6, 0.4), w = (i: number) => 14 * Math.sin(tt * 2.6 - i * 0.9) * (0.4 + 0.6 * i / 4);
  const top = lerp(700, 150, up);
  return <>
    <Floor x={640} y={960} w={360} />
    <div style={{ ...at(620, 110), width: 26, height: 850, background: "linear-gradient(90deg,#6d6f73,#f4f4f4 45%,#8a8c90)", borderRadius: 13 }} />
    <div style={{ ...at(612, 92), width: 42, height: 42, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff,#9a9a9a)" }} />
    <svg width={700} height={420} style={{ ...at(646, top), overflow: "visible", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id="fsh" x1="0" x2="1">{[0, 1, 2, 3, 4].map((i) => <stop key={i} offset={i / 4} stopColor={`rgba(0,0,0,${0.05 + 0.18 * (0.5 + 0.5 * Math.sin(tt * 2.6 - i * 0.9))})`} />)}</linearGradient></defs>
      <path d={`M0 0 C175 ${w(1)} 350 ${w(2)} 525 ${w(3)} L700 ${w(4)} L700 ${400 + w(4)} C525 ${400 + w(3)} 350 ${400 + w(2)} 175 ${400 + w(1)} L0 400 Z`} fill="#002b7f" />
      <path d={`M0 186 C175 ${186 + w(1)} 350 ${186 + w(2)} 525 ${186 + w(3)} L700 ${186 + w(4)} L700 ${214 + w(4)} C525 ${214 + w(3)} 350 ${214 + w(2)} 175 ${214 + w(1)} L0 214 Z`} fill="#ffc61e" />
      <Star12 x={150} y={300 + w(1) * 0.6} r={58} />
      <path d={`M0 0 C175 ${w(1)} 350 ${w(2)} 525 ${w(3)} L700 ${w(4)} L700 ${400 + w(4)} C525 ${400 + w(3)} 350 ${400 + w(2)} 175 ${400 + w(1)} L0 400 Z`} fill="url(#fsh)" />
    </svg>
    <div style={{ ...at(1440, 560), width: 340, transform: `perspective(900px) rotateX(${(1 - cal) * 85}deg)`, transformOrigin: "50% 0", background: PAPER, borderRadius: 10, boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden", opacity: cl(cal * 3) }}>
      <div style={{ background: "#c7342a", color: "#fff", fontWeight: 900, fontSize: 40, textAlign: "center", padding: 10 }}>ENERO · 1968</div>
      <div style={{ fontWeight: 900, fontSize: 200, color: INK, textAlign: "center", lineHeight: 1.1 }}>31</div>
    </div>
  </>;
}}</Stage>;

// ---- 9:44 · LA TOLVA: una tolva de chapa larga escupe fosfato a un vagón; lo que cae al vagón sale convertido en monedas que llenan un cofre; el contador vuela ----
export const TCascade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 4.4);
  return <>
    <Floor x={1100} y={900} w={1100} />
    <svg width={520} height={520} style={at(300, 140)}><path d="M20 20 L500 20 L330 320 L190 320 Z" fill="url(#hop)" stroke="#4d5359" strokeWidth={6} /><rect x={210} y={320} width={100} height={70} fill="#5a6168" /><defs><linearGradient id="hop" x1="0" x2="1"><stop offset="0" stopColor="#59616a" /><stop offset=".45" stopColor="#c7ccd2" /><stop offset="1" stopColor="#4a5158" /></linearGradient></defs></svg>
    {Array.from({ length: 34 }, (_, i) => { const y = ((tt * 600 + i * 37) % 360); return tt > 0.3 ? <div key={i} style={{ ...at(540 + (i * 13) % 60, 530 + y), width: 14, height: 14, borderRadius: "40%", background: i % 2 ? "#d8cfa6" : "#bfb38a", opacity: y > 330 ? 0 : 1 }} /> : null; })}
    <div style={{ ...at(860, 640), width: 640, height: 240, perspective: 1200 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 40px 40px", background: "linear-gradient(180deg,#6b4a2b,#3a2817)", boxShadow: "inset 0 0 0 8px rgba(0,0,0,.25), 0 26px 40px rgba(0,0,0,.6)" }} />
      {[0, 1, 2].map((r) => <div key={r} style={{ ...at(0, 30 + r * 70), width: 640, height: 12, background: "linear-gradient(180deg,#d6b46a,#8a6a2c)" }} />)}
      <svg width={640} height={240} style={{ position: "absolute", left: 0, top: -170, overflow: "visible" }}>{Array.from({ length: Math.floor(k * 46) }, (_, i) => { const r = Math.floor(i / 9), c = i % 9; return <ellipse key={i} cx={80 + c * 60 + (r % 2) * 30} cy={170 - r * 22} rx={34} ry={12} fill="url(#gc)" stroke="#8a6a1c" strokeWidth={2} />; })}
        <defs><radialGradient id="gc" cx=".35" cy=".3"><stop offset="0" stopColor="#fff1b8" /><stop offset=".5" stopColor="#e9b949" /><stop offset="1" stopColor="#a87a1c" /></radialGradient></defs></svg>
    </div>
    <Num tt={tt} d={0.5} x={1180} y={240} txt={`US$ ${Math.round(k * 100)} M AL AÑO`} col={AMB} size={96} />
    <Tag tt={tt} at={1.4} x={1180} y={360} txt="AÑOS 70 · EL FOSFATO SE VUELVE ORO" size={32} />
  </>;
}}</Stage>;

// ---- 10:31 · EL CUENTAKILÓMETROS: el tablero de un auto; los rodillos del odómetro giran vuelta tras vuelta a la misma ruta de 19 km ----
export const TLaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const km = 19 * eio(tt, 0.4, 6.4) * 7, laps = Math.max(1, Math.ceil(km / 19 - 0.001)), digits = String(Math.floor(km * 10)).padStart(5, "0");
  const frac = (km * 10) % 1;
  return <>
    <div style={{ ...at(360, 240), width: 1200, height: 600, borderRadius: "600px 600px 60px 60px", background: "radial-gradient(ellipse at 50% 70%, #2a2c30, #0d0e10 70%)", border: "18px solid #3a3c40", boxShadow: "0 40px 70px rgba(0,0,0,.7), inset 0 10px 30px rgba(255,255,255,.06)" }}>
      <svg width={1164} height={564} style={at(0, 0)}>{Array.from({ length: 13 }, (_, i) => { const a = Math.PI + (i / 12) * Math.PI; return <line key={i} x1={582 + Math.cos(a) * 480} y1={560 + Math.sin(a) * 480} x2={582 + Math.cos(a) * 430} y2={560 + Math.sin(a) * 430} stroke="#ddd" strokeWidth={8} />; })}
        <g transform={`rotate(${-80 + 60 * Math.sin(tt * 2)} 582 560)`}><rect x={576} y={150} width={12} height={410} rx={6} fill="#ff6a3d" /></g><circle cx={582} cy={560} r={40} fill="#555" /></svg>
      <div style={{ ...at(332, 300), display: "flex", gap: 8, padding: 14, background: "#050505", borderRadius: 12, boxShadow: "inset 0 6px 14px rgba(0,0,0,.9)" }}>
        {[...digits].map((d, i) => { const last = i === digits.length - 1, off = last ? frac * 110 : 0;
          return <div key={i} style={{ width: 84, height: 110, overflow: "hidden", borderRadius: 8, background: last ? "linear-gradient(180deg,#bbb,#fff 50%,#bbb)" : "linear-gradient(180deg,#888,#f2f2f2 50%,#888)", position: "relative" }}>
            <div style={{ position: "absolute", top: -off, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 92, lineHeight: "110px", color: last ? "#a8261e" : "#111" }}>{d}<br />{(+d + 1) % 10}</div></div>; })}
      </div>
    </div>
    <Num tt={tt} d={0.3} x={960} y={150} txt={`VUELTA ${laps}`} size={110} col={AMB} />
    <Tag tt={tt} at={0.8} x={960} y={930} txt="19 KM DE RUTA · SIEMPRE LA MISMA" size={36} />
  </>;
}}</Stage>;

// ---- 12:05 · EL EDIFICIO: una grúa torre sube los pisos de vidrio de la Casa Nauru; cada piso llega colgado y se encastra; las ventanas se prenden ----
export const TTower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.3, 5.0), n = Math.floor(f * 16), part = f * 16 - n, FH = 38, base = 900, W = 380;
  return <>
    <Floor x={900} y={base + 10} w={700} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(710, base - (i + 1) * FH), width: W, height: FH - 3, background: "linear-gradient(90deg,#2b3a48,#6d8aa4 40%,#22303c)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,.4)" }}>
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ ...at(12 + j * 41, 7), width: 30, height: FH - 18, background: (i * 7 + j * 3) % 5 < 2 ? "#ffd58a" : "rgba(160,200,230,.35)" }} />)}</div>)}
    <div style={{ ...at(710, lerp(160, base - (n + 1) * FH, part)), width: W, height: FH - 3, background: "linear-gradient(90deg,#2b3a48,#7d9ab4 40%,#22303c)", opacity: n < 16 ? 1 : 0 }} />
    <div style={{ ...at(1180, 120), width: 34, height: base - 120, background: "repeating-linear-gradient(45deg,#e0a72b 0 14px,#7a5a12 14px 18px)" }} />
    <div style={{ ...at(640, 110), width: 760, height: 28, background: "repeating-linear-gradient(45deg,#e0a72b 0 14px,#7a5a12 14px 18px)" }} />
    <div style={{ ...at(898, 138), width: 4, height: Math.max(0, lerp(160, base - (n + 1) * FH, part) - 138), background: "#ccc" }} />
    <Num tt={tt} d={0.4} x={1480} y={420} txt={`${n} PISOS`} size={100} />
    <Tag tt={tt} at={1.2} x={1480} y={540} txt="CASA NAURU · MELBOURNE" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 12:22 · EL TELÓN: telón de terciopelo a pantalla casi completa, con luz de candilejas; se abre sobre el cartel del musical… y cae de golpe ----
export const TCurtain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const op = eio(tt, 0.4, 2.2), drop = eio(tt, 4.4, 4.9), tk = phys(tt, 5.0, 7, 0.4), o = op * (1 - drop);
  return <>
    <div style={{ ...at(160, 90), width: 1600, height: 880, background: "radial-gradient(ellipse at 50% 85%, rgba(255,220,150,.5), #1a0f08 65%)", borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ ...at(560, 300), width: 480, height: 300, transform: `scale(${0.9 + 0.1 * o})`, background: "linear-gradient(180deg,#1a1a2e,#3a1a3a)", border: "10px solid #d4a637", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(255,210,120,.4)" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#f3e3b5", letterSpacing: 6 }}>WEST END · 1993</div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center", lineHeight: 1.05 }}>EL MUSICAL<br />DE NAURU</div>
      </div>
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", top: 0, [s ? "right" : "left"]: 0, width: 800 * (1 - 0.8 * o), height: 880, background: "repeating-linear-gradient(90deg,#5e070c 0 30px,#b3121c 30px 70px,#7a0a10 70px 110px)", boxShadow: "inset 0 0 80px rgba(0,0,0,.6)", borderRadius: s ? "0 0 0 60px" : "0 0 60px 0" } as React.CSSProperties} />)}
      <div style={{ ...at(0, 0), width: 1600, height: 110, background: "repeating-linear-gradient(90deg,#8c0d14 0 60px,#c1202a 60px 100px)", borderBottom: "14px solid #d4a637", boxShadow: "0 14px 30px rgba(0,0,0,.6)" }} />
      <div style={{ ...at(0, 820), width: 1600, height: 60, background: "linear-gradient(180deg,#6b4a2b,#2e1d0f)" }} />
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ ...at(140 + i * 220, 800), width: 50, height: 22, borderRadius: "50% 50% 0 0", background: "#ffe3a0", boxShadow: "0 -20px 50px rgba(255,220,150,.8)" }} />)}
    </div>
    {tk > 0.01 && <div style={{ ...at(960, 540), transform: `translate(-50%,-50%) rotate(${-8 * tk}deg) scale(${1.4 - 0.4 * tk})`, opacity: cl(tk * 3), background: "#fff", border: "10px solid #c7342a", color: "#c7342a", padding: "10px 46px", fontWeight: 900, fontSize: 90, whiteSpace: "nowrap", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>BAJÓ DE CARTEL</div>}
  </>;
}}</Stage>;

// ---- 13:49 · LA DEMANDA: un estrado de madera con el escudo de la Corte; el expediente lacrado de Nauru cae sobre el pupitre y el martillo golpea ----
export const TEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = phys(tt, 0.6, 6, 0.45), gav = tt < 3.0 ? -40 * eio(tt, 1.8, 2.6) : -40 + 40 * eio(tt, 3.0, 3.18), hit = cl((tt - 3.18) * 3) * (1 - cl((tt - 3.6) * 2));
  return <>
    <Floor x={960} y={930} w={1400} />
    <div style={{ ...at(360, 420), width: 1200, height: 500, background: "linear-gradient(180deg,#7a4f2b,#4a2d16)", borderRadius: "16px 16px 0 0", boxShadow: "inset 0 12px 0 rgba(255,255,255,.08), 0 30px 60px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...at(60 + i * 280, 110), width: 240, height: 340, border: "6px solid rgba(0,0,0,.25)", borderRadius: 8 }} />)}
      <div style={{ ...at(520, 140), width: 160, height: 190, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 40% 30%,#f3d77a,#a87a1c)", boxShadow: "0 8px 16px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ ...at(320, 400), width: 1280, height: 40, background: "linear-gradient(180deg,#9a6a3c,#5a391c)", borderRadius: 6 }} />
    <div style={{ ...at(700, lerp(-300, 250, f)), width: 520, height: 160, transform: `rotate(${lerp(-25, -4, f)}deg) perspective(800px) rotateX(${lerp(40, 60, f)}deg)`, background: PAPER, boxShadow: "0 20px 30px rgba(0,0,0,.5)", borderRadius: 6 }}>
      <div style={{ ...at(24, 20), fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30, color: INK }}>NAURU c. AUSTRALIA</div>
      <div style={{ ...at(420, 60), width: 76, height: 76, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)" }} />
    </div>
    <div style={{ ...at(1300, 180), transformOrigin: "100% 100%", transform: `rotate(${gav}deg)` }}>
      <div style={{ width: 260, height: 26, background: "linear-gradient(180deg,#a87645,#5a391c)", borderRadius: 13, transform: "translate(-200px,120px) rotate(-30deg)" }} />
      <div style={{ ...at(-260, 40), width: 160, height: 90, borderRadius: 18, background: "linear-gradient(180deg,#b07a46,#5a391c)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    </div>
    {hit > 0 && <div style={{ ...at(1060 - 160 * hit, 330 - 40 * hit), width: 320 * hit, height: 80 * hit, borderRadius: "50%", border: `4px solid rgba(255,230,180,${0.8 * (1 - hit)})` }} />}
    <Num tt={tt} d={0.3} x={960} y={150} txt="CORTE INTERNACIONAL · 1989" size={70} col={AMB} />
  </>;
}}</Stage>;

// ---- 14:20 · EN CUOTAS: un frasco de vidrio sobre la mesa; el calendario arranca un año por vez y por cada hoja cae un puñado de monedas hasta llenar A$ 107 M ----
export const TInstall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.6, 6.0), yr = 1993 + Math.floor(k * 20), fill = k;
  return <>
    <Floor x={960} y={930} w={1200} />
    <div style={{ ...at(560, 290), width: 400, height: 620 }}>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, height: 560 * fill, borderRadius: "0 0 60px 60px", background: "radial-gradient(circle at 30% 30%, #fff1b8 0 7px, transparent 8px) 0 0/38px 26px, radial-gradient(circle at 30% 30%, #f3d77a 0 14px, #a87a1c 15px, transparent 16px) 19px 13px/38px 26px, #c9952d" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 70px 70px", border: "6px solid rgba(225,240,255,.75)", background: "linear-gradient(90deg, rgba(255,255,255,.2), rgba(255,255,255,0) 35%, rgba(255,255,255,.12))" }} />
      <div style={{ ...at(30, -30), width: 340, height: 50, borderRadius: 12, background: "linear-gradient(180deg,#d9d9d9,#7a7a7a)" }} />
      <div style={{ ...at(60, 40), width: 26, height: 500, borderRadius: 13, background: "linear-gradient(180deg, rgba(255,255,255,.5), transparent)" }} />
    </div>
    {Array.from({ length: 6 }, (_, i) => { const kk = ((tt * 1.6 + i / 6) % 1); return k < 1 && tt > 0.6 ? <div key={i} style={{ ...at(720 + (i * 37) % 80, 120 + kk * (720 - 560 * fill)), width: 54, height: 18, borderRadius: "50%", background: "linear-gradient(180deg,#fff1b8,#c9952d)", transform: `rotate(${i * 50 + tt * 300}deg)`, opacity: kk > 0.95 ? 0 : 1 }} /> : null; })}
    <div style={{ ...at(1140, 380), width: 380, height: 420, background: PAPER, borderRadius: 10, boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden", textAlign: "center" }}>
      <div style={{ height: 80, background: "#2d5a27", color: "#fff", fontWeight: 900, fontSize: 40, lineHeight: "80px" }}>CUOTA ANUAL</div>
      <div style={{ fontWeight: 900, fontSize: 160, color: "#111", lineHeight: "300px" }}>{yr}</div>
      {(() => { const ph = (k * 20) % 1; return ph < 0.3 && k < 1 ? <div key={yr} style={{ ...at(0, 80), width: 380, height: 340, background: PAPER, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${(ph / 0.3) * 100}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.3)", textAlign: "center", fontWeight: 900, fontSize: 150, color: INK, lineHeight: "300px" }}>{yr - 1}</div> : null; })()}
    </div>
    <Num tt={tt} d={0.4} x={960} y={160} txt={`A$ ${Math.round(107 * k)} M`} size={120} col={GRN} />
  </>;
}}</Stage>;

// ---- 15:07 · SIN COMBUSTIBLE: un tanque de agua de chapa con visor de vidrio; el nivel baja, el bidón de gasoil al lado queda vacío y la canilla larga su última gota ----
export const TGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.4, 6.4), lvl = 1 - 0.94 * k, per = lerp(0.6, 1.6, k), drip = (tt % per) / per;
  return <><div style={{ position: "absolute", inset: 0, transform: "scale(1.14)", transformOrigin: "50% 60%" }}>
    <Floor x={960} y={930} w={1300} />
    <div style={{ ...at(520, 220), width: 560, height: 700, borderRadius: "40px 40px 20px 20px", background: "repeating-linear-gradient(90deg,#7a8590 0 26px,#b9c2cb 26px 44px,#6a747e 44px 60px)", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 10px rgba(0,0,0,.2)" }}>
      <div style={{ ...at(220, 80), width: 120, height: 540, borderRadius: 60, background: "rgba(20,30,40,.75)", boxShadow: "inset 0 0 0 6px #ddd", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: "linear-gradient(180deg,#7fd4ff,#1f6f9a)" }} />
        <div style={{ ...at(18, 20), width: 18, height: 500, borderRadius: 9, background: "linear-gradient(180deg,rgba(255,255,255,.5),transparent)" }} />
      </div>
      <div style={{ ...at(560, 560), width: 160, height: 34, background: "linear-gradient(180deg,#ccc,#777)", borderRadius: 8 }} />
    </div>
    {tt > 0.6 && <div style={{ ...at(700, 600 + 260 * drip * drip), width: 34, height: 48, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#d8f3ff,#4aa8d8)", opacity: 1 - drip * 0.3 }} />}
    <div style={{ ...at(1200, 520), width: 260, height: 380, borderRadius: 18, background: "linear-gradient(90deg,#8e1c14,#d7392b 45%,#7a160f)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `rotate(${6 * k}deg)` }}>
      <div style={{ ...at(170, -40), width: 60, height: 60, borderRadius: 10, background: "#555" }} />
      <div style={{ ...at(30, 150), width: 200, textAlign: "center", fontWeight: 900, fontSize: 44, color: "#fff2e8" }}>GASOIL</div>
      <div style={{ ...at(30, 230), width: 200, height: 26, borderRadius: 13, background: "rgba(0,0,0,.4)" }}><div style={{ width: `${(1 - k) * 100}%`, height: "100%", borderRadius: 13, background: AMB }} /></div>
    </div>
    </div>
    <Num tt={tt} d={3.6} x={960} y={130} txt="SIN COMBUSTIBLE, SIN AGUA" size={84} col={RED} />
  </>;
}}</Stage>;

// ---- 16:48 · EL DESVÍO: el carguero TAMPA, de frente y grande, avanza hacia la costa; una barrera rayada baja delante de su proa y el barco gira hacia el Pacífico ----
export const TReroute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const go = eio(tt, 0.2, 2.0), bar = eio(tt, 1.8, 2.6), turn = eio(tt, 2.8, 5.0);
  const sc = lerp(0.95, 1.4, go) - 0.7 * turn, x = 960 - 520 * Math.sin(turn * Math.PI / 2);
  return <>
    <Sea tt={tt} y={620} />
    <div style={{ ...at(x, 640), transform: `translate(-50%,-100%) translateY(${-180 * turn}px) scale(${sc}) rotateY(${60 * turn}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={560} height={420}>
        <path d="M100 160 L460 160 L420 400 L140 400 Z" fill="url(#bow)" />
        <path d="M280 120 L470 160 L280 400 L90 160 Z" fill="#a8261e" opacity={0.95} />
        <path d="M280 120 L280 400" stroke="rgba(0,0,0,.35)" strokeWidth={6} />
        <rect x={150} y={20} width={260} height={110} rx={8} fill="#eae6dc" />{Array.from({ length: 5 }, (_, i) => <rect key={i} x={170 + i * 48} y={50} width={30} height={30} rx={4} fill="#26323d" />)}
        <text x={280} y={300} textAnchor="middle" fontWeight={900} fontSize={44} fill="#f2efe6">TAMPA</text>
        <defs><linearGradient id="bow" x1="0" x2="1"><stop offset="0" stopColor="#4a1410" /><stop offset=".5" stopColor="#c43a2c" /><stop offset="1" stopColor="#4a1410" /></linearGradient></defs>
      </svg>
    </div>
    <Sea tt={tt + 2} y={720} front />
    <div style={{ ...at(260, 700), width: 60, height: 260, background: "linear-gradient(90deg,#666,#ddd,#666)", borderRadius: 8 }} />
    <div style={{ ...at(290, 700), width: 1360, height: 60, transformOrigin: "0 50%", transform: `rotate(${lerp(-80, 0, bar)}deg)`, background: "repeating-linear-gradient(90deg,#e8e8e8 0 90px,#d42a22 90px 180px)", borderRadius: 30, boxShadow: "0 16px 24px rgba(0,0,0,.55)" }} />
    <Num tt={tt} d={0.3} x={960} y={170} txt="AGOSTO 2001 · NO ENTRAN" size={84} col={AMB} />
    <Tag tt={tt} at={3.4} x={960} y={290} txt="← A NAURU" col={RED} size={50} />
    {turn > 0 && <svg width={1920} height={1080} style={at(0, 0)}><path d={`M960 700 Q${960 - 260 * turn} ${700 - 40 * turn} ${960 - 520 * Math.sin(turn * Math.PI / 2)} ${700 - 180 * turn}`} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18" /></svg>}
  </>;
}}</Stage>;

// ---- 20:59 · LA PESCA DE NOCHE: un bote de madera grande en el centro, el farol de mano encendido con su haz; los peces voladores saltan hacia la luz y caen en el copo de la red ----
export const TLantern: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const glow = eio(tt, 0.2, 1.4), net = eio(tt, 1.0, 2.0), caught = Math.min(6, Math.floor(cl((tt - 1.4) / 4) * 7));
  return <>
    <div style={{ ...at(260, 140), width: 1400, height: 900, background: `radial-gradient(ellipse 40% 38% at 50% 40%, rgba(255,196,110,${0.55 * glow}), transparent 70%)` }} />
    <Sea tt={tt} y={650} />
    <svg width={1920} height={1080} style={{ ...at(0, 0), overflow: "visible", transform: "scale(1.3)", transformOrigin: "960px 720px" }}>
      <path d="M560 640 Q960 720 1360 640 L1300 760 Q960 810 620 760 Z" fill="url(#hul)" stroke="#2a1a0c" strokeWidth={6} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 10} ${670 + i * 28} Q960 ${745 + i * 22} ${1320 - i * 10} ${670 + i * 28}`} stroke="rgba(0,0,0,.3)" strokeWidth={4} fill="none" />)}
      <line x1={760} y1={650} x2={700} y2={330} stroke="#5a3d22" strokeWidth={14} strokeLinecap="round" />
      <path d="M700 330 l-30 0 l10 -40 l40 0 l10 40 Z" fill="#333" /><rect x={670} y={330} width={60} height={70} rx={10} fill={`rgba(255,${200 + 40 * glow},140,${0.7 + 0.3 * glow})`} stroke="#333" strokeWidth={5} />
      <path d="M700 370 L520 640 L880 640 Z" fill={`rgba(255,214,140,${0.16 * glow})`} />
      <path d={`M1180 650 Q1240 ${650 - 220 * net} 1400 ${600 - 120 * net} L1440 ${700 - 60 * net} Q1300 ${740} 1180 650 Z`} fill="rgba(220,200,150,.18)" stroke="#d9c79c" strokeWidth={4} strokeDasharray="10 8" opacity={net} />
      {Array.from({ length: 6 }, (_, i) => { const st = 1.2 + i * 0.7, k = cl((tt - st) / 1.0); if (k <= 0 || k >= 1) return null; const x = lerp(520 + i * 30, 1340, k), y = 660 - Math.sin(Math.PI * k) * 340;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${lerp(-40, 40, k)}) scale(2.8)`}><ellipse rx={30} ry={9} fill="#d9e4ec" /><path d="M-6 -4 L22 -36 L26 -2 Z M-6 4 L22 36 L26 2 Z" fill="#b6c9d8" opacity={0.85} /><path d="M28 0 l14 -10 l0 20 Z" fill="#b6c9d8" /></g>; })}
      {Array.from({ length: caught }, (_, i) => <ellipse key={"c" + i} cx={1270 + (i % 3) * 50} cy={650 - Math.floor(i / 3) * 26} rx={40} ry={13} fill="#c9d6e0" stroke="#7a8a96" strokeWidth={2} />)}
      {Array.from({ length: 6 }, (_, i) => { const st = 2.2 + i * 0.7, k = cl((tt - st) * 2.5); return k > 0 && k < 1 ? <circle key={"w" + i} cx={1340} cy={650} r={20 + 70 * k} fill="none" stroke={`rgba(230,245,255,${0.7 * (1 - k)})`} strokeWidth={5} /> : null; })}
      <defs><linearGradient id="hul" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6a3c" /><stop offset="1" stopColor="#3f2714" /></linearGradient></defs>
    </svg>
    <Sea tt={tt + 1.5} y={770} front />
    <Num tt={tt} d={0.6} x={960} y={150} txt={`PECES VOLADORES · ${caught}`} size={80} col={AMB} />
  </>;
}}</Stage>;

export const HC2: Record<string, React.FC<{ t: number; h: H }>> = { islasize: TIslaSize, bite: TBite, wheat: TWheat, strata: TStrata, split3: TSplit3, deport: TDeport, movebox: TMoveBox,
  flag68: TFlag68, cascade: TCascade, laps: TLaps, tower: TTower, curtain: TCurtain, envelope: TEnvelope, installments: TInstall, gauge: TGauge, reroute: TReroute, lantern: TLantern };

export { Floor, Num, Slab, Island, Ship, Sea };
