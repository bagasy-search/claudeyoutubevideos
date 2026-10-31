// te29a · ronda 3 del evaluador (31-oct): los que quedaron en 5-6,5 se rehacen. Objeto grande y centrado, entrada de a uno con peso,
// algo que SIGUE moviéndose hasta el último cuadro, textos grandes y lejos de bordes y de los objetos. Mismas claves que ta.tsx/ta2.tsx.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Floor, Island, Num, Sea, Ship, Slab } from "./ta2";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const PAPER = "#f1ead9", INK = "#2b2620", ROCK = "#b3ae9f", ROCKD = "#7d786c", GUANO = "#f1ece0", PHOS = "#9a7b52";
const shake = (tt: number, t0: number, a = 10) => { const k = tt - t0; return k > 0 && k < 0.5 ? a * Math.exp(-k * 9) * Math.sin(k * 70) : 0; };
const stepsOf = (h: H, t: number, fb: [number, string][]) => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st = said.length >= fb.length ? said : fb;
  return { st, cur: st.reduce((a, s, i) => (t >= s[0] ? i : a), -1) };
};

// ---- 1:00 · EL MORDISCO: la isla-losa grande y centrada; el balde de una excavadora baja, muerde un gajo gris de la meseta, lo levanta y lo tira; dos mordidas ----
export const TBite3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const P = 2.3, cyc = Math.max(0, tt - 0.5), n = Math.floor(cyc / P), f = (cyc % P) / P;
  const down = f < 0.35 ? eio(f, 0, 0.35) : f < 0.5 ? 1 : 1 - eio(f, 0.5, 0.85);
  const swing = f < 0.5 ? 0 : eio(f, 0.5, 0.85), mined = cl((n + (f > 0.45 ? 1 : 0)) * 0.4) * 0.8;
  const bx = lerp(820, 1380, swing), by = lerp(110, 470, down) - 160 * swing, carry = f > 0.42 && f < 0.95;
  return <>
    <Floor x={900} y={900} w={1200} />
    <div style={{ ...at(900 - 560, 330), transform: `perspective(1600px) rotateX(46deg) translateY(${shake(tt, 0.5 + 0.4 * P) + shake(tt, 0.5 + 1.4 * P)}px)`, transformOrigin: "50% 80%" }}><Island w={1120} mined={Math.max(0.05, mined)} depth={90} /></div>
    <svg width={1920} height={1080} style={{ ...at(0, 0), overflow: "visible", filter: "drop-shadow(0 24px 22px rgba(0,0,0,.55))" }}>
      <path d={`M1920 -40 L${bx + 230} ${by - 230}`} stroke="#e0a72b" strokeWidth={58} strokeLinecap="round" />
      <path d={`M1920 -40 L${bx + 230} ${by - 230}`} stroke="#7a5a12" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      <path d={`M${bx + 230} ${by - 230} L${bx + 90} ${by - 40}`} stroke="#d39a22" strokeWidth={46} strokeLinecap="round" />
      <g transform={`translate(${bx} ${by}) rotate(${-18 + 40 * (f > 0.4 && f < 0.6 ? eio(f, 0.4, 0.5) : f >= 0.6 ? 1 - eio(f, 0.85, 0.98) : 0)})`}>
        <path d="M-40 -60 L190 -60 L170 90 Q60 130 -20 100 Z" fill="#c78f1e" stroke="#6b4c10" strokeWidth={6} />
        <path d="M-40 -60 L190 -60" stroke="#f0c454" strokeWidth={8} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-14 + i * 34} 104 l14 30 l14 -30 Z`} fill="#8d8a80" />)}
        {carry && <path d="M-10 -58 Q80 -130 180 -58 Z" fill={ROCK} stroke={ROCKD} strokeWidth={4} />}
        {carry && Array.from({ length: 6 }, (_, i) => <path key={"p" + i} d={`M${10 + i * 28} -62 l8 -26 l8 26 Z`} fill="#ecebe4" />)}
      </g>
    </svg>
    {f > 0.86 && n >= 0 && Array.from({ length: 8 }, (_, i) => { const k = (f - 0.86) / 0.14; return <div key={i} style={{ ...at(1440 + i * 20, 330 + k * 400 + (i % 3) * 20), width: 30, height: 22, borderRadius: 6, background: ROCK, opacity: 1 - k }} />; })}
    <Num tt={tt} d={0.6} x={620} y={150} txt={`${Math.round(80 * eio(tt, 0.6, 5.2))} %`} size={170} col={tt > 5 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={1.4} x={620} y={270} txt="DE LA ISLA, MINADO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 2:37 · EL TOPE DE PUERTA: puerta de oficina de madera, grande; el viento la cierra de golpe y rebota contra LA piedra: el cuadro tiembla ----
export const TDoor3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const hit = 1.1, sw = tt < hit ? -78 * (1 - eio(tt, 0.2, hit)) : -16 * Math.exp(-(tt - hit) * 1.8) * Math.cos((tt - hit) * 6), lit = cl((tt - 2.2) * 1.2), sk = shake(tt, hit, 14);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${sk}px, ${sk * 0.4}px)` }}>
    <div style={{ ...at(300, 880), width: 1320, height: 40, background: "linear-gradient(180deg,#7a5634,#3e2c1b)", borderRadius: 6, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(470, 120), width: 470, height: 760, perspective: 1500 }}>
      <div style={{ position: "absolute", inset: -14, border: "14px solid #3a2616", borderBottom: "none", borderRadius: 6 }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${sw - 28}deg)`, background: "repeating-linear-gradient(92deg,#7a5634 0 30px,#6b4a2b 30px 60px,#83603c 60px 90px)", borderRadius: 6, boxShadow: "0 30px 50px rgba(0,0,0,.6)", border: "10px solid #4a321d" }}>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 60 + i * 350, height: 290, border: "8px solid rgba(0,0,0,.25)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.06)", borderRadius: 4 }} />)}
        <div style={{ position: "absolute", right: 34, top: 380, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#a87a1c)" }} />
      </div>
    </div>
    <svg width={420} height={250} style={{ ...at(1000, 650), filter: `drop-shadow(0 0 ${40 * lit}px rgba(255,200,120,${0.7 * lit})) drop-shadow(0 18px 14px rgba(0,0,0,.6))`, transform: `translateY(${-6 * phys(tt, hit, 8, 0.3) + 6}px)` }}>
      <defs><radialGradient id="dst" cx=".38" cy=".3"><stop offset="0" stopColor="#e6e2d6" /><stop offset=".55" stopColor="#a7a294" /><stop offset="1" stopColor="#5f5b51" /></radialGradient></defs>
      <path d="M20 236 C6 150 70 50 180 40 C300 30 405 110 398 236 Z" fill="url(#dst)" stroke="#4f4b42" strokeWidth={5} />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={60 + (i * 53) % 300} cy={110 + (i * 37) % 110} r={4 + (i % 4) * 2} fill="rgba(60,55,45,.35)" />)}
      <path d="M90 90 Q170 60 250 80" stroke="rgba(255,255,255,.5)" strokeWidth={8} fill="none" strokeLinecap="round" />
    </svg>
    {tt > hit && tt < hit + 0.6 && <div style={{ ...at(1000 - 200 * cl((tt - hit) * 2), 760 - 60 * cl((tt - hit) * 2)), width: 400 * cl((tt - hit) * 2), height: 120 * cl((tt - hit) * 2), borderRadius: "50%", border: `5px solid rgba(255,230,180,${0.9 * (1 - (tt - hit) / 0.6)})` }} />}
    {Array.from({ length: 5 }, (_, i) => { const x = ((tt * 700 + i * 300) % 1700) + 200; return <div key={i} style={{ ...at(x, 260 + i * 110), width: 200, height: 5, borderRadius: 3, background: "rgba(255,255,255,.2)", opacity: tt < hit + 0.4 ? 1 : 0 }} />; })}
    <Tag tt={tt} at={2.0} x={1210} y={500} txt="«UN TOPE DE PUERTA»" size={48} />
    <Tag tt={tt} at={2.5} x={1210} y={590} txt="SYDNEY · 1899" col={AMB} size={40} />
  </div>;
}}</Stage>;

// ---- 3:34 · LA PROBETA: un tubo de vidrio ancho; cada bandada que pasa deja caer una capa blanca de guano que se vuelve fosfato marrón con los años ----
export const TStrata3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.4, 6.4), n = Math.floor(f * 12), part = f * 12 - n, H0 = 700, LH = 56, W = 520;
  return <>
    <Floor x={760} y={960} w={760} />
    <div style={{ ...at(500, 220), width: W, height: H0 + 30 }}>
      <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, height: (n + part) * LH, borderRadius: "0 0 250px 250px / 0 0 60px 60px", overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
        {Array.from({ length: n + 1 }, (_, i) => { const age = cl((n - i) / 5); return <div key={i} style={{ flex: "none", height: i === n ? part * LH : LH, background: `linear-gradient(180deg, ${i === n ? GUANO : `rgb(${Math.round(lerp(241, 154, age))},${Math.round(lerp(236, 123, age))},${Math.round(lerp(224, 82, age))})`}, rgba(0,0,0,.12))`, borderTop: "3px solid rgba(60,40,20,.35)" }} />; })}
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "60px 60px 260px 260px / 26px 26px 64px 64px", border: "7px solid rgba(225,240,255,.8)", background: "linear-gradient(90deg, rgba(255,255,255,.2), rgba(255,255,255,.02) 25%, rgba(255,255,255,0) 70%, rgba(255,255,255,.16))" }} />
      <div style={{ ...at(54, 40), width: 30, height: H0 - 80, borderRadius: 15, background: "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,0))" }} />
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ ...at(W - 10, H0 - i * 100), width: 44, height: 6, background: "rgba(225,240,255,.75)" }} />)}
    </div>
    {Array.from({ length: 5 }, (_, i) => { const k = ((tt * 0.32 + i / 5) % 1), x = lerp(-120, 1900, k), y = 110 + 40 * Math.sin(k * 6 + i) + (i % 3) * 40;
      return <svg key={i} width={200} height={80} style={{ ...at(x, y), filter: "drop-shadow(0 10px 10px rgba(0,0,0,.4))" }}><path d={`M8 46 Q55 ${14 + 26 * Math.sin(tt * 7 + i)} 100 42 Q145 ${14 + 26 * Math.sin(tt * 7 + i)} 192 46`} fill="none" stroke="#f6f2ea" strokeWidth={11} strokeLinecap="round" /><ellipse cx={100} cy={46} rx={16} ry={10} fill="#f6f2ea" /><path d="M114 44 l18 4 l-18 4 Z" fill="#e0a02b" /></svg>; })}
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.9 + i / 10) % 1); return <div key={"d" + i} style={{ ...at(600 + (i * 47) % 320, 160 + k * (H0 - (n + part) * LH + 60)), width: 12, height: 12, borderRadius: "50%", background: GUANO, opacity: 0.85 * (1 - k * 0.4) }} />; })}
    <div style={{ ...at(1140, 400), width: 640, height: 330, borderRadius: 24, background: "rgba(10,9,8,.72)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", opacity: cl(tt * 2) }} />
    <Num tt={tt} d={0.4} x={1460} y={520} txt={`${Math.round(f * 100)}.000`} size={140} />
    <Tag tt={tt} at={0.9} x={1460} y={650} txt="AÑOS DE AVES MARINAS" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 4:22 · TRES PAÍSES: la isla es una torta sobre una tabla; un cuchillo baja y la corta en tres; las porciones se separan despacio y cada una recibe su bandera grande ----
export const TSplit3b: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const knife = eio(tt, 0.6, 1.5), knife2 = eio(tt, 1.4, 2.3), sp = eio(tt, 2.2, 6.5), names: string[] = h.names ?? ["", "", ""], cols = [RED, AMB, ICE];
  const FL = [["#012169", "#c8102e"], ["#00843d", "#ffcd00"], ["#012169", "#ffffff"]];
  return <>
    <div style={{ ...at(360, 470), width: 1200, height: 420, transform: "perspective(1600px) rotateX(55deg)", transformOrigin: "50% 60%", borderRadius: 40, background: "repeating-linear-gradient(90deg,#8a5a34 0 40px,#7a4f2b 40px 80px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    {[0, 1, 2].map((i) => { const ang = (-90 + i * 120 + 60) * Math.PI / 180, dx = Math.cos(ang) * 240 * sp, dy = Math.sin(ang) * 90 * sp;
      return <div key={i} style={{ ...at(960 - 360, 300), transform: `perspective(1600px) rotateX(55deg) translate(${dx}px,${dy * 2}px) rotateZ(${8 * sp * (i - 1)}deg)`, transformOrigin: "50% 50%" }}>
        <Slab w={720} h={480} depth={80} br="50%" side="#6b5a3e" clip={`polygon(50% 50%, ${[0, 1, 2, 3, 4, 5, 6].map((j) => { const a = ((i * 120 + j * 20 - 90) * Math.PI) / 180; return `${50 + Math.cos(a) * 75}% ${50 + Math.sin(a) * 75}%`; }).join(", ")})`}
          top={`radial-gradient(ellipse at 50% 50%, ${ROCK} 55%, #4f8a52 58%, #4f8a52 70%, #e6d6a8 73%)`} />
      </div>; })}
    {[knife * (1 - knife2 * 0), knife2].map((k, j) => k > 0 && k < 1 ? <div key={j} style={{ ...at(940 + (j ? 120 : -120), 120 + 380 * k), transform: `rotate(${j ? 30 : -30}deg)`, width: 40, height: 340, borderRadius: "20px 20px 4px 4px", background: "linear-gradient(90deg,#9aa0a6,#f4f6f8 45%,#8a9096)", boxShadow: "0 12px 18px rgba(0,0,0,.5)" }}><div style={{ ...at(-6, -120), width: 52, height: 130, borderRadius: 10, background: "linear-gradient(90deg,#3a2616,#6b4a2b,#3a2616)" }} /></div> : null)}
    {[0, 1, 2].map((i) => { const ang = (-90 + i * 120 + 60) * Math.PI / 180, x = 960 + Math.cos(ang) * (140 + 300 * sp), y = 560 + Math.sin(ang) * (60 + 110 * sp), s = phys(tt, 2.4 + i * 0.5, 7, 0.45);
      return s > 0.01 ? <div key={i} style={{ ...at(x, y - 260 * s) }}>
        <div style={{ width: 12, height: 260, background: "linear-gradient(90deg,#c9a671,#f0dcb0,#a8875a)", borderRadius: 6 }} />
        <div style={{ ...at(12, 0), width: 230 * s, height: 146, background: `linear-gradient(135deg, ${FL[i][0]} 0 60%, ${FL[i][1]} 60%)`, transform: `skewY(${4 * Math.sin(tt * 2 + i)}deg)`, boxShadow: "0 10px 18px rgba(0,0,0,.45)", borderRadius: 4 }} />
      </div> : null; })}
    {[0, 1, 2].map((i) => { const ang = (-90 + i * 120 + 60) * Math.PI / 180, x = 960 + Math.cos(ang) * (140 + 300 * sp); return <Tag key={i} tt={tt} at={2.7 + i * 0.5} x={Math.max(330, Math.min(1590, x + 60))} y={i === 0 ? 160 : 990} txt={names[i]} col={cols[i]} size={40} />; })}
  </>;
}}</Stage>;

// ---- 5:27 · CÓMO SE MINA UNA ISLA: un bloque de tierra en corte, grande; cada paso le saca una capa con acción (árboles que caen de a uno, la tierra se levanta, aparece el fosfato entre dientes de coral) ----
export const TCutaway3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const { st, cur } = stepsOf(h, t, [[h.at + 0.2, "SE TALA"], [h.at + 1.3, "SE SACA LA TIERRA"], [h.at + 2.4, "APARECE EL FOSFATO"], [h.at + 3.4, "SE CAVA ENTRE LAS COLUMNAS"]]);
  const span = Math.max(0.6, Math.min(2.0, (st[1]?.[0] ?? h.at + 1) - st[0][0]));
  const d = (i: number) => (st[i] && t >= st[i][0] ? eio(t, st[i][0], st[i][0] + span * 0.85) : 0);
  const teeth = Array.from({ length: 9 }, (_, i) => `M${40 + i * 150} 520 L${80 + i * 150} ${250 + (i * 53) % 90} L${130 + i * 150} 520 Z`).join(" ");
  return <>
    <Floor x={960} y={960} w={1500} />
    <div style={{ ...at(260, 300), width: 1400, height: 640, transform: "perspective(1800px) rotateX(10deg) rotateY(-8deg)" }}>
      <div style={{ ...at(1400, 30), width: 80, height: 580, background: "linear-gradient(180deg,#5a4a33,#2e261a)", transform: "skewY(-30deg)", transformOrigin: "0 0" }} />
      <div style={{ ...at(0, 80), width: 1400, height: 560, background: "#3a352c", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
        <svg width={1400} height={560} style={at(0, 0)}>
          <rect x={0} y={520} width={1400} height={40} fill="#5c574d" />
          <path d={teeth} fill="#e1ded4" stroke="#9a978e" strokeWidth={4} />
          <rect x={0} y={240 + 280 * d(3)} width={1400} height={280 - 280 * d(3)} fill={PHOS} opacity={d(2) > 0 ? 1 : 0.0} />
          <rect x={0} y={240} width={1400} height={280} fill="#8f8b80" opacity={1 - d(2)} />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={200 + i * 200 + 30 * Math.sin(t * 2 + i)} cy={520 - 280 * d(3) * (0.4 + (i % 3) * 0.2)} r={18} fill="#c9b080" opacity={d(3) > 0 && d(3) < 1 ? 1 : 0} />)}
        </svg>
        <div style={{ ...at(0, 120 - 260 * d(1)), width: 1400, height: 120, background: "linear-gradient(180deg,#6b4a2b,#4a3018)", opacity: 1 - d(1) * 0.9, transform: `rotate(${-4 * d(1)}deg)` }} />
      </div>
      {Array.from({ length: 9 }, (_, i) => { const k = cl(d(0) * 1.8 - i * 0.09); return <div key={i} style={{ ...at(70 + i * 150, -60), width: 120, height: 200, transformOrigin: "50% 100%", transform: `rotate(${(i % 2 ? 1 : -1) * 90 * eio(k, 0, 1)}deg)`, opacity: k > 0.98 ? 0 : 1 }}>
        <div style={{ ...at(52, 90), width: 16, height: 110, background: "#5e4025" }} /><div style={{ ...at(10, 0), width: 100, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #6aa857, #2f6a2a)" }} />
      </div>; })}
    </div>
    {cur >= 0 && <div key={cur} style={{ ...at(960, 150), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 84, color: AMB, textShadow: "0 8px 28px #000", whiteSpace: "nowrap", opacity: cl((t - st[cur][0]) * 3) }}>{cur + 1} · {st[cur][1]}</div>}
  </>;
}}</Stage>;

// ---- 5:58 · EL BRAZO DE CARGA: una cinta inclinada grande escupe fosfato a la bodega de un carguero; el barco se hunde centímetro a centímetro (marcas de calado) ----
export const TCantilever3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const on = eio(tt, 0.3, 1.2), load = eio(tt, 1.0, 8.0), sink = 70 * load;
  return <>
    <Sea tt={tt} y={640} />
    <div style={{ ...at(780, 470 + sink + 6 * Math.sin(tt * 1.3)) }}>
      <div style={{ position: "relative" }}>
        <Ship w={1000} hull="#3a3f46" smoke={0.6} tt={tt} />
        <div style={{ ...at(80, 260), width: 340, height: 44 * load + 6, borderRadius: "50% 50% 0 0", background: `radial-gradient(ellipse at 50% 100%, #d8d2c0, ${ROCK} 60%, ${ROCKD})`, transform: "translateY(-100%)" }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...at(960, 290 + i * 24), width: 30, height: 4, background: "#fff" }} />)}
      </div>
    </div>
    <Sea tt={tt + 2} y={790} front />
    <svg width={1920} height={1080} style={{ ...at(0, 0), overflow: "visible", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.5))" }}>
      <path d="M-40 980 L120 760 L180 760 L60 980 Z" fill="#6e4a2a" />
      <g transform="rotate(-14 120 760)">
        <rect x={60} y={720} width={900} height={60} rx={10} fill="#7b4b2a" stroke="#3a2416" strokeWidth={6} />
        <rect x={70} y={712} width={880} height={14} fill="#2a2a2a" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${70 + ((tt * 220 + i * 66) % 880)} 712 q14 -26 30 0 Z`} fill={ROCK} opacity={on} />)}
        {Array.from({ length: 10 }, (_, i) => <line key={"r" + i} x1={90 + i * 90} y1={780} x2={130 + i * 90} y2={860} stroke="#4a2b14" strokeWidth={10} />)}
      </g>
    </svg>
    {Array.from({ length: 16 }, (_, i) => { const k = ((tt * 1.4 + i / 16) % 1); return on > 0.5 ? <div key={i} style={{ ...at(1010 + (i * 13) % 50 + k * 30, 500 + k * (260 + sink)), width: 18 + (i % 3) * 6, height: 16, borderRadius: 6, background: i % 2 ? "#d8d2c0" : ROCK, opacity: 1 - k * 0.3 }} /> : null; })}
    <Num tt={tt} d={0.4} x={1300} y={170} txt="DE LA ISLA AL BARCO" size={84} col={AMB} />
    <Tag tt={tt} at={2.0} x={1300} y={290} txt={`CALADO +${Math.round(load * 9)} M`} col={ICE} size={36} />
  </>;
}}</Stage>;

// ---- 7:14 · LA DEPORTACIÓN: un barco grande cargado de gente en cubierta se aleja; vuelve con la cubierta medio vacía: las figuras se apagan de a una ----
export const TDeport3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 0.4, 3.0), back = eio(tt, 3.6, 6.4), x = back > 0 ? lerp(1300, 760, back) : lerp(760, 1300, go), sc = back > 0 ? lerp(0.72, 1.0, back) : lerp(1.0, 0.72, go);
  const N = 36, gone = Math.floor(N * (1 - 737 / 1200) * eio(tt, 4.4, 7.2));
  return <>
    <Sea tt={tt} y={640} />
    <div style={{ ...at(x - 560 * sc, 660 - 470 * sc), transform: `scale(${sc}) scaleX(${back > 0 ? -1 : 1}) rotate(${1.2 * Math.sin(tt * 1.3)}deg)`, transformOrigin: "0 0" }}>
      <div style={{ position: "relative" }}>
        <Ship w={1120} hull="#3a3f46" smoke={1} tt={tt} />
        {Array.from({ length: N }, (_, i) => { const off = i < gone; return <div key={i} style={{ ...at(110 + (i % 18) * 50, 230 - Math.floor(i / 18) * 34), width: 26, height: 52, opacity: off ? 0.08 : 1 }}>
          <div style={{ ...at(5, 0), width: 16, height: 16, borderRadius: "50%", background: i % 3 ? "#c9a27a" : "#8a5a3a" }} />
          <div style={{ ...at(0, 16), width: 26, height: 36, borderRadius: "10px 10px 3px 3px", background: ["#e8dcc6", "#c9b89a", "#9a7b5a", "#efe7d6"][i % 4], boxShadow: "0 3px 0 rgba(0,0,0,.3)" }} />
        </div>; })}
      </div>
    </div>
    <Sea tt={tt + 3} y={780} front />
    <Num tt={tt} d={0.5} x={960} y={160} txt={back > 0 ? `VOLVIERON ${Math.round(lerp(1200, 737, eio(tt, 4.4, 7.2))).toLocaleString("es-AR")}` : `${(1200).toLocaleString("es-AR")} PERSONAS`} size={100} col={back > 0.5 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={1.2} x={960} y={285} txt={back > 0 ? "1946 · DE CHUUK A CASA" : "1943 · DEPORTADOS A CHUUK"} col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 8:29 · LA MUDANZA: la caja de cartón; las casitas caen adentro de a una con rebote; la tapa se cierra, la cinta pasa y el sello NO cae con golpe ----
export const TMoveBox3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const lid = eio(tt, 3.3, 4.0), tape = eio(tt, 4.0, 4.5), stT = 5.0, stamp = phys(tt, stT, 7, 0.32), sk = shake(tt, stT + 0.15, 12);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${sk}px,${sk * 0.5}px)` }}>
    <Floor x={960} y={920} w={1100} />
    <div style={{ ...at(520, 400), width: 880, height: 500 }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#c99a5e,#a87a43)", borderRadius: 6, boxShadow: "inset 0 0 0 4px rgba(90,60,25,.4), 0 30px 50px rgba(0,0,0,.6)" }}>
        <div style={{ ...at(40, 300), fontWeight: 900, fontSize: 56, color: "rgba(60,35,10,.75)", letterSpacing: 3 }}>CURTIS ISLAND · QLD</div>
        <div style={{ ...at(40, 380), fontFamily: "Courier New, monospace", fontSize: 32, color: "rgba(60,35,10,.7)" }}>FRÁGIL · ESTE LADO ARRIBA ↑</div>
      </div>
      {Array.from({ length: 5 }, (_, i) => { const s = phys(tt, 0.4 + i * 0.55, 7, 0.4); const y = lerp(-520, 20, s);
        return s > 0.01 ? <svg key={i} width={150} height={150} style={{ ...at(40 + i * 165, y), opacity: lid > 0.5 ? 0 : 1, filter: "drop-shadow(0 10px 10px rgba(0,0,0,.45))" }}><path d="M12 76 L75 18 L138 76 V142 H12 Z" fill="#f1ead9" stroke="#9a8f78" strokeWidth={5} /><rect x={60} y={94} width={30} height={48} fill="#8a5a33" /><rect x={28} y={88} width={24} height={22} fill="#7fb0d8" /><path d="M2 80 L75 10 L148 80" stroke="#b5452e" strokeWidth={14} fill="none" /></svg> : null; })}
      {[0, 1].map((s) => <div key={s} style={{ ...at(s ? 440 : 0, -4), width: 440, height: 240, background: "linear-gradient(180deg,#d6a86c,#b5864c)", transformOrigin: s ? "100% 0" : "0 0", transform: `rotateX(${lerp(-150, 0, lid)}deg)`, borderRadius: 4, boxShadow: "inset 0 0 0 3px rgba(90,60,25,.35)", opacity: lid > 0.05 ? 1 : 0 }} />)}
      <div style={{ ...at(405, -4), width: 70, height: 240 * tape, background: "rgba(225,210,160,.9)" }} />
    </div>
    {stamp > 0.01 && <div style={{ ...at(960, 560), transform: `translate(-50%,-50%) translateY(${(1 - stamp) * -380}px) scale(${1.6 - 0.6 * stamp}) rotate(-10deg)`, opacity: cl(stamp * 2), border: "16px solid #d42a22", color: "#d42a22", padding: "0 60px", fontWeight: 900, fontSize: 230, lineHeight: 1.05, borderRadius: 20, mixBlendMode: "screen" }}>NO</div>}
    <Num tt={tt} d={0.3} x={960} y={1000} txt="1964 · LES OFRECEN MUDARSE" size={70} col={AMB} />
  </div>;
}}</Stage>;

// ---- 9:44 · LA CATARATA DE PLATA: una tolva de chapa larga suelta fosfato que al caer se vuelve un chorro grueso de monedas; un cofre de madera con herrajes se llena y desborda ----
export const TCascade3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 6.0), lid = eio(tt, 0.2, 1.0);
  return <>
    <Floor x={1000} y={930} w={1200} />
    <svg width={560} height={420} style={{ ...at(180, 80), filter: "drop-shadow(0 20px 20px rgba(0,0,0,.5))" }}><path d="M20 20 L540 20 L360 300 L200 300 Z" fill="url(#hop3)" stroke="#4d5359" strokeWidth={6} /><rect x={230} y={300} width={100} height={60} fill="#5a6168" /><defs><linearGradient id="hop3" x1="0" x2="1"><stop offset="0" stopColor="#59616a" /><stop offset=".45" stopColor="#d7dce2" /><stop offset="1" stopColor="#4a5158" /></linearGradient></defs>{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={80 + (i * 41) % 400} cy={40 + (i % 3) * 12} r={14} fill={ROCK} />)}</svg>
    {Array.from({ length: 40 }, (_, i) => { const kk = ((tt * 1.1 + i / 40) % 1), x = lerp(460, 900 + (i % 5) * 40, kk), y = 440 + kk * kk * 200 - Math.sin(Math.PI * kk) * 120;
      return tt > 0.4 ? <div key={i} style={{ ...at(x, y), width: 46, height: 46, borderRadius: "50%", transform: `rotateX(${(i * 40 + tt * 400) % 360}deg)`, background: kk < 0.25 ? ROCK : "radial-gradient(circle at 35% 30%, #fff1b8, #e9b949 45%, #a87a1c)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} /> : null; })}
    <div style={{ ...at(820, 560), width: 760, height: 330 }}>
      <div style={{ ...at(0, 0), width: 760, height: 330, borderRadius: "14px 14px 30px 30px", background: "repeating-linear-gradient(90deg,#6b4a2b 0 60px,#5a3d22 60px 120px)", boxShadow: "inset 0 0 0 10px rgba(0,0,0,.25), 0 30px 50px rgba(0,0,0,.6)" }}>
        {[0, 1].map((r) => <div key={r} style={{ ...at(0, 60 + r * 170), width: 760, height: 26, background: "linear-gradient(180deg,#9aa0a6,#4a4f55)" }} />)}
        <div style={{ ...at(350, 120), width: 60, height: 80, borderRadius: 10, background: "linear-gradient(180deg,#f3d77a,#a87a1c)" }} />
      </div>
      <svg width={760} height={300} style={{ position: "absolute", left: 0, top: -280 * k, overflow: "visible" }}>{Array.from({ length: 50 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10; return <ellipse key={i} cx={50 + c * 70 + (r % 2) * 35} cy={300 - r * 26} rx={38} ry={14} fill="url(#gc3)" stroke="#8a6a1c" strokeWidth={2} />; })}<defs><radialGradient id="gc3" cx=".35" cy=".3"><stop offset="0" stopColor="#fff1b8" /><stop offset=".5" stopColor="#e9b949" /><stop offset="1" stopColor="#a87a1c" /></radialGradient></defs></svg>
      <div style={{ ...at(0, -250), width: 760, height: 250, background: "repeating-linear-gradient(90deg,#7a5634 0 60px,#6b4a2b 60px 120px)", borderRadius: "300px 300px 10px 10px / 120px 120px 10px 10px", transformOrigin: "50% 100%", transform: `perspective(1400px) rotateX(${-110 * lid}deg)`, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.2)" }} />
    </div>
    <Num tt={tt} d={0.5} x={1200} y={170} txt={`US$ ${Math.round(k * 100)} M AL AÑO`} col={AMB} size={96} />
    <Tag tt={tt} at={1.4} x={1200} y={290} txt="AÑOS 70 · EL FOSFATO SE VUELVE ORO" size={32} />
  </>;
}}</Stage>;

// ---- 12:05 · LA CASA NAURU: una grúa torre sube los pisos de vidrio uno por uno; cada piso llega colgado del cable y encastra; el contador llega a 52 ----
export const TTower3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const f = eio(tt, 0.3, 6.8), N = 13, n = Math.floor(f * N), part = f * N - n, FH = 50, base = 940, W = 460, X = 460;
  const hy = lerp(240, base - (n + 1) * FH, eio(part, 0, 1)), sway = 14 * Math.sin(tt * 2.4) * (1 - part);
  return <>
    <Floor x={X + W / 2} y={base + 10} w={760} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(X, base - (i + 1) * FH), width: W, height: FH - 4, background: "linear-gradient(90deg,#22303c,#6d8aa4 40%,#9fb7cc 55%,#22303c)", boxShadow: "inset 0 -4px 0 rgba(0,0,0,.45)" }}>
      {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ ...at(14 + j * 49, 9), width: 36, height: FH - 22, background: (i * 7 + j * 3 + Math.floor(tt * 2)) % 6 < 2 ? "#ffd58a" : "rgba(170,210,235,.4)" }} />)}</div>)}
    {n < N && <div style={{ ...at(X + sway, hy), width: W, height: FH - 4, background: "linear-gradient(90deg,#2b3a48,#8daac4 45%,#22303c)", boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />}
    {[X + 40, X + W - 40].map((xx, i) => <div key={i} style={{ ...at(xx + sway / 2, 222), width: 3, height: Math.max(0, hy - 222), background: "#bbb", transform: `rotate(${i ? -8 : 8}deg)`, transformOrigin: "50% 0" }} />)}
    <div style={{ ...at(X + W / 2 - 3, 200), width: 6, height: 24, background: "#ccc" }} />
    <div style={{ ...at(1060, 150), width: 46, height: base - 150, background: "repeating-linear-gradient(45deg,#e0a72b 0 16px,#7a5a12 16px 21px)", boxShadow: "0 0 0 4px rgba(0,0,0,.25)" }} />
    <div style={{ ...at(380, 170), width: 900, height: 34, background: "repeating-linear-gradient(45deg,#e0a72b 0 16px,#7a5a12 16px 21px)" }} />
    <div style={{ ...at(1060, 120), width: 140, height: 80, background: "#c9c4b6", borderRadius: 6 }} />
    <Num tt={tt} d={0.4} x={1520} y={470} txt={`${Math.round(52 * f)} PISOS`} size={110} />
    <Tag tt={tt} at={1.2} x={1520} y={600} txt="CASA NAURU" col={AMB} size={40} />
    <Tag tt={tt} at={1.5} x={1520} y={680} txt="MELBOURNE" size={32} />
  </>;
}}</Stage>;

// ---- 13:49 · LA DEMANDA: el estrado en perspectiva; el expediente lacrado cae sobre el pupitre y un martillo grande golpea dos veces: el cuadro tiembla y el expediente queda sellado ----
export const TEnvelope3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = phys(tt, 0.4, 6, 0.45), hits = [2.4, 4.4], g = (h0: number) => (tt < h0 - 0.7 ? 0 : tt < h0 ? -50 * eio(tt, h0 - 0.7, h0 - 0.15) + 50 * eio(tt, h0 - 0.15, h0) : 0);
  const gav = tt < 3.4 ? g(hits[0]) : g(hits[1]), sk = shake(tt, hits[0], 12) + shake(tt, hits[1], 14), sealed = phys(tt, hits[1], 8, 0.35);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${sk}px,${sk * 0.5}px)` }}>
    <Floor x={960} y={950} w={1500} />
    <div style={{ ...at(260, 470), width: 1400, height: 470, transform: "perspective(1600px) rotateX(16deg)", transformOrigin: "50% 0", background: "linear-gradient(180deg,#7a4f2b,#4a2d16)", borderRadius: "18px 18px 0 0", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ ...at(40 + i * 270, 90), width: 240, height: 340, border: "8px solid rgba(0,0,0,.25)", borderRadius: 8 }} />)}
    </div>
    <div style={{ ...at(220, 420), width: 1480, height: 70, transform: "perspective(1600px) rotateX(55deg)", background: "linear-gradient(180deg,#a87645,#5a391c)", borderRadius: 8 }} />
    <div style={{ ...at(600, lerp(-300, 330, f)), width: 620, height: 200, transform: `rotate(${lerp(-25, -3, f)}deg)`, background: PAPER, boxShadow: "0 24px 30px rgba(0,0,0,.5)", borderRadius: 6 }}>
      <div style={{ ...at(30, 30), fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 38, color: INK }}>NAURU c. AUSTRALIA</div>
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={{ ...at(30, 92 + i * 26), width: 380 - i * 60, height: 6, background: "rgba(43,34,24,.25)" }} />)}
      {sealed > 0.01 && <div style={{ ...at(470, 50), transform: `scale(${1.6 - 0.6 * sealed})`, width: 110, height: 110, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)", boxShadow: "0 8px 16px rgba(0,0,0,.4)" }} />}
    </div>
    <div style={{ ...at(1380, 120), transformOrigin: "100% 100%", transform: `rotate(${gav}deg)` }}>
      <div style={{ ...at(-330, 150), width: 360, height: 40, background: "linear-gradient(180deg,#a87645,#5a391c)", borderRadius: 20, transform: "rotate(-28deg)", transformOrigin: "100% 50%" }} />
      <div style={{ ...at(-420, 40), width: 240, height: 140, borderRadius: 26, background: "linear-gradient(180deg,#c48a50,#5a391c)", boxShadow: "0 14px 24px rgba(0,0,0,.5)" }}><div style={{ ...at(0, 50), width: 240, height: 16, background: "#d4a637" }} /></div>
    </div>
    {hits.map((h0, i) => { const k = cl((tt - h0) * 2.5); return k > 0 && k < 1 ? <div key={i} style={{ ...at(1000 - 240 * k, 420 - 60 * k), width: 480 * k, height: 120 * k, borderRadius: "50%", border: `6px solid rgba(255,230,180,${0.9 * (1 - k)})` }} /> : null; })}
    <Num tt={tt} d={0.3} x={960} y={150} txt="CORTE INTERNACIONAL · 1989" size={76} col={AMB} />
  </div>;
}}</Stage>;

// ---- 19:30 · LA PILA: al lado de una puerta con una persona a escala, una pila de billetes crece fajo por fajo hasta pasar el marco ----
export const TBillStack3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 0.3, 6.2), n = Math.floor(k * 46);
  return <>
    <Floor x={960} y={930} w={1200} />
    <div style={{ ...at(420, 330), width: 280, height: 600, border: "16px solid #6d4a2b", borderBottom: "none", borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.15))" }} />
    <svg width={150} height={460} style={at(485, 470)}><circle cx={75} cy={56} r={46} fill="#cfc6b4" /><path d="M14 460 L24 140 Q75 110 126 140 L136 460 Z" fill="#cfc6b4" /></svg>
    {Array.from({ length: n }, (_, i) => { const s = i === n - 1 ? phys(tt, 0.3 + (i / 46) * 5.9, 8, 0.4) : 1; return <div key={i} style={{ ...at(900 + ((i * 7) % 11) - 5, 900 - (i + 1) * 13 - (1 - s) * 120), width: 420, height: 14, transform: "perspective(900px) rotateX(40deg)", background: i % 2 ? "linear-gradient(180deg,#8cc28c,#5b935b)" : "linear-gradient(180deg,#7ab47a,#4f874f)", border: "2px solid #2f5a2f", borderRadius: 3, boxShadow: "0 3px 0 rgba(0,0,0,.25)" }}><div style={{ ...at(190, 0), width: 40, height: 10, background: "#e8e0c8" }} /></div>; })}
    <div style={{ ...at(860, 330), width: 520, height: 4, borderTop: "4px dashed rgba(255,255,255,.5)" }} />
    <Num tt={tt} d={0.3} x={960} y={150} txt={`A$ ${(3 * k).toFixed(1).replace(".", ",")} M`} size={130} />
    <Tag tt={tt} at={1.4} x={960} y={275} txt="POR PERSONA · POR AÑO" col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 23:01 · EL MAR SUBE: corte grande de la isla; el agua sube con olas y las casas de la costa quedan bajo el agua de a una; la meseta minada queda seca arriba ----
export const TSeaLevel3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = eio(tt, 0.3, 7.6), lvl = lerp(800, 640, w);
  const HOUSES = [[300, 760], [400, 740], [500, 720], [1340, 720], [1440, 740], [1540, 760], [620, 700], [1220, 700]];
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M140 840 L340 790 L620 720 L700 520 L800 470 L1120 470 L1220 520 L1300 720 L1580 790 L1780 840 Z" fill="#8f8b80" stroke="#5f5b51" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${790 + i * 28} 470 l14 -54 l14 54 Z`} fill="#e1ded4" />)}
      <path d="M260 812 L620 724 L690 560 M1230 560 L1300 724 L1660 812" fill="none" stroke="#4f8a52" strokeWidth={34} strokeLinecap="round" />
      {HOUSES.map(([x, y], i) => { const under = lvl < y - 10; return <g key={i} opacity={under ? 0.35 : 1}><path d={`M${x - 34} ${y} l34 -40 l34 40 v38 h-68 Z`} fill="#f1ead9" stroke="#9a8f78" strokeWidth={3} /><path d={`M${x - 40} ${y + 2} l40 -46 l40 46`} stroke="#b5452e" strokeWidth={8} fill="none" /></g>; })}
      <rect x={0} y={lvl} width={1920} height={1080 - lvl} fill="rgba(36,104,144,.78)" />
      {[0, 1].map((j) => <path key={j} d={`M${-400 + ((tt * (60 + j * 30)) % 400)} ${lvl + j * 14} ${Array.from({ length: 7 }, () => "q100 -18 200 0 t200 0").join(" ")}`} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth={5} />)}
    </svg>
    <Tag tt={tt} at={0.8} x={960} y={360} txt="LA MESETA MINADA: SECA, PERO NADIE PUEDE VIVIR" size={30} />
    <Num tt={tt} d={2.0} x={960} y={170} txt="LA COSTA, BAJO EL AGUA" size={90} col={RED} />
  </>;
}}</Stage>;

export const HC3: Record<string, React.FC<{ t: number; h: H }>> = { bite: TBite3, door: TDoor3, strata: TStrata3, split3: TSplit3b, cutaway: TCutaway3, cantilever: TCantilever3,
  deport: TDeport3, movebox: TMoveBox3, cascade: TCascade3, tower: TTower3, envelope: TEnvelope3, billstack: TBillStack3, sealevel: TSeaLevel3 };
const _u = [GRN, TX];
void _u;
