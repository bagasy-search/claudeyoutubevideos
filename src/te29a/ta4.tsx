// te29a · REEMPLAZOS tras la vuelta 3 del evaluador (31-oct): «simple y perfecto le gana a ambicioso». Cada pieza = UN objeto grande al centro
// (≥ 55 % del alto), UN renglón de texto arriba y lejos de los bordes, y la acción principal estirada a TODA la ventana (k llega a 1 en la salida):
// nunca dos cuadros quietos iguales al final.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { Floor, Island, Num, Sea, Ship, Slab } from "./ta2";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const W = (h: H) => Math.max(3, (h.out - h.at) * (h.sp ?? 1));
const K = (tt: number, h: H, a = 0.3) => eio(tt, a, W(h) - 0.45);
const LIN = (tt: number, h: H, a = 0.3) => cl((tt - a) / (W(h) - 0.45 - a));
const PAPER = "#f1ead9", INK = "#2b2620", ROCK = "#c9c2ae", ROCKD = "#7d786c";
const Coin: React.FC<{ r: number; silver?: boolean }> = ({ r, silver }) => { const [a, b, c] = silver ? ["#ffffff", "#c9d1d8", "#6d7680"] : ["#fff1b8", "#e9b949", "#8a6414"];
  return <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${a}, ${b} 45%, ${c})`, boxShadow: `inset 0 0 0 ${r * 0.13}px rgba(0,0,0,.18), 0 ${r * 0.22}px 0 ${c}, 0 ${r * 0.4}px ${r * 0.6}px rgba(0,0,0,.5)` }} />; };
const Rock: React.FC<{ w: number; rot?: number }> = ({ w, rot = 0 }) => <div style={{ width: w, height: w * 0.78, borderRadius: "46% 54% 42% 58% / 52% 44% 56% 48%", transform: `rotate(${rot}deg)`,
  background: `radial-gradient(circle at 18% 30%, rgba(90,84,70,.55) 0 3%, transparent 4%) 0 0/${w / 7}px ${w / 8}px, radial-gradient(circle at 34% 28%, #f2ecdc, ${ROCK} 45%, ${ROCKD} 80%)`, boxShadow: `inset -${w / 12}px -${w / 14}px ${w / 6}px rgba(0,0,0,.35), 0 ${w / 10}px ${w / 8}px rgba(0,0,0,.55)` }} />;
const Car: React.FC<{ w: number }> = ({ w }) => <div style={{ position: "relative", width: w, height: w * 0.5, borderRadius: w * 0.14, background: "linear-gradient(180deg,#ff7a5d,#b8261e)", boxShadow: `0 ${w * 0.1}px ${w * 0.12}px rgba(0,0,0,.55)` }}>
  <div style={{ ...at(w * 0.24, w * 0.08), width: w * 0.46, height: w * 0.34, borderRadius: w * 0.08, background: "linear-gradient(90deg,#1f2a35,#7d9ab4)" }} /></div>;
const Bill: React.FC<{ w: number }> = ({ w }) => <div style={{ width: w, height: w * 0.45, borderRadius: 6, background: "linear-gradient(135deg,#d6e4c4,#86ad6e)", border: "4px solid #3f6a35", boxShadow: "0 6px 10px rgba(0,0,0,.35)", position: "relative" }}>
  <div style={{ ...at(w * 0.4, w * 0.08), width: w * 0.2, height: w * 0.2, borderRadius: "50%", border: "4px solid #3f6a35" }} /></div>;
const Bird: React.FC<{ w: number; f: number }> = ({ w, f }) => <svg width={w} height={w * 0.5} viewBox="0 0 100 50"><path d={`M0 ${20 + 14 * f} Q25 ${4 + 20 * f} 50 26 Q75 ${4 + 20 * f} 100 ${20 + 14 * f}`} fill="none" stroke="#f4f1ea" strokeWidth={7} strokeLinecap="round" /></svg>;

// 0:37 · TODA LA ISLA EN MEDIA HORA: la isla grande vista de arriba; un auto rojo grande recorre la costa y deja la huella; el reloj del auto avanza 0 → 30 MIN
export const XIslaSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.6), a = -Math.PI / 2 + k * Math.PI * 2, cx = 960, cy = 600, rx = 560, ry = 300;
  return <>
    <Floor x={960} y={930} w={1300} />
    <div style={{ ...at(960 - 620, 600 - 360), transform: "perspective(1800px) rotateX(38deg)", transformOrigin: "50% 60%" }}><Island w={1240} /></div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d={`M${cx} ${cy - ry} ${Array.from({ length: 64 }, (_, i) => { const b = -Math.PI / 2 + (i / 63) * Math.PI * 2 * k; return `L${cx + Math.cos(b) * rx} ${cy + Math.sin(b) * ry}`; }).join(" ")}`} fill="none" stroke="rgba(255,240,200,.85)" strokeWidth={14} strokeLinecap="round" strokeDasharray="26 18" /></svg>
    {tt > 0.6 && <div style={{ ...at(cx + Math.cos(a) * rx - 60, cy + Math.sin(a) * ry - 30), transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }}><Car w={170} /></div>}
    <Num tt={tt} d={0.2} x={960} y={150} txt={`${Math.round(30 * k)} MIN · LA ISLA ENTERA`} size={96} col={k > 0.98 ? AMB : "#fff7ea"} />
  </>;
}}</Stage>;

// 1:00 · EL 80 %: la isla grande en perspectiva; una mancha gris de roca minada nace en el centro y se come el verde hasta el 80 %
export const XBite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.2), p = 80 * k;
  return <>
    <Floor x={960} y={940} w={1300} />
    <div style={{ ...at(960 - 640, 250), transform: "perspective(1800px) rotateX(40deg)", transformOrigin: "50% 60%" }}>
      <Slab w={1280} h={760} depth={60} br="47% 53% 50% 50% / 52% 46% 54% 48%" side="#6b5a3e" top="radial-gradient(ellipse at 50% 50%, #4f8a52 62%, #e6d6a8 66%, #e6d6a8 71%, #2a7f96 73%)">
        <div style={{ ...at(640 - 470, 380 - 280), width: 940, height: 560, borderRadius: "50%", background: `conic-gradient(from ${-30 + 40 * k}deg, #a8a294 0 ${p * 3.6}deg, transparent ${p * 3.6}deg)`, maskImage: "radial-gradient(ellipse, #000 62%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse, #000 62%, transparent 70%)" }} />
        {Array.from({ length: 30 }, (_, i) => { const b = (i / 30) * p * 0.0628, r = 120 + (i * 53) % 300; return <div key={i} style={{ ...at(640 + Math.cos(b - 0.52) * r * 1.4, 380 + Math.sin(b - 0.52) * r * 0.85), width: 26, height: 40, borderRadius: "40% 40% 10% 10%", background: "linear-gradient(180deg,#d8d2c2,#8a8476)" }} />; })}
      </Slab>
    </div>
    <Num tt={tt} d={0.1} x={960} y={150} txt={`${Math.round(p)} % MINADO`} size={110} col={p > 79 ? RED : "#fff7ea"} />
  </>;
}}</Stage>;

// 2:37 · LA PIEDRA: la piedra de fosfato GRANDE, con poros, gira despacio sobre un pedestal; a la mitad, un borde de puerta de madera entra y se frena contra ella
export const XDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.2), door = phys(tt, 0.4 * W(h), 5, 0.5), bump = door > 0.97 && door < 1.03 ? 0 : 0;
  return <>
    <Floor x={900} y={900} w={900} />
    <div style={{ ...at(560, 850), width: 680, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, #5a4a3a, #2a2018 70%)" }} />
    <div style={{ ...at(600 + bump, 360 + 10 * Math.sin(tt * 1.3)) }}><Rock w={600} rot={-8 + 16 * k} /></div>
    <div style={{ ...at(lerp(1960, 1210, Math.min(1, door)), 140), width: 180, height: 800, background: "repeating-linear-gradient(90deg,#8a5a34 0 22px,#7a4e2c 22px 44px)", boxShadow: "-20px 0 40px rgba(0,0,0,.6), inset 8px 0 0 #a8743e", borderRadius: 6 }}>
      <div style={{ ...at(40, 380), width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#a87a1c)" }} />
    </div>
    <Num tt={tt} d={0.2} x={760} y={150} txt="UN TOPE DE PUERTA" size={96} col={AMB} />
  </>;
}}</Stage>;

// 2:59 · EL MATRAZ: matraz alto; la piedra cae y salpica; el líquido vira de transparente a verde fosfato mientras sube un burbujeo que no para
export const XFlask: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fall = eio(tt, 0.3, 1.1), k = K(tt, h, 1.0), sp = cl((tt - 1.1) * 2.2);
  const liq = `rgba(${Math.round(lerp(170, 120, k))},${Math.round(lerp(210, 230, k))},${Math.round(lerp(230, 120, k))},.85)`;
  return <>
    <Floor x={960} y={950} w={800} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <defs><clipPath id="fk"><path d="M890 220 L1030 220 L1030 470 L1240 900 Q1250 940 1210 940 L710 940 Q670 940 680 900 L890 470 Z" /></clipPath></defs>
      <g clipPath="url(#fk)"><rect x={600} y={lerp(620, 600, k)} width={700} height={400} fill={liq} />
        {Array.from({ length: 16 }, (_, i) => { const p = ((tt * (0.4 + (i % 4) * 0.12) + i / 16) % 1); return tt > 1.2 ? <circle key={i} cx={760 + (i * 61) % 400} cy={930 - p * 320} r={8 + (i % 3) * 5} fill="rgba(255,255,255,.55)" /> : null; })}
        <g transform={`translate(${960} ${lerp(-120, 860, fall)})`}><ellipse rx={70} ry={52} fill={ROCK} stroke={ROCKD} strokeWidth={4} /></g>
      </g>
      <path d="M890 220 L1030 220 L1030 470 L1240 900 Q1250 940 1210 940 L710 940 Q670 940 680 900 L890 470 Z" fill="rgba(220,240,255,.12)" stroke="rgba(235,248,255,.85)" strokeWidth={8} />
      <path d="M915 250 L915 470 L740 880" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={10} strokeLinecap="round" />
      {sp > 0 && sp < 1 && Array.from({ length: 10 }, (_, i) => <circle key={"s" + i} cx={960 + Math.cos(i * 0.7 - 2.6) * 220 * sp} cy={600 - Math.sin(Math.PI * sp) * 160 - (i % 3) * 10} r={12 - 8 * sp} fill={liq} />)}
    </svg>
    <Num tt={tt} d={1.2} x={960} y={140} txt="FOSFATO" size={110} col={GRN} />
  </>;
}}</Stage>;

// 3:08 · DOS MACETAS: dos macetas grandes de barro sobre una mesa; la de la izquierda (sin fósforo) queda rala; la de la derecha crece espiga por espiga y se dora hasta el final
const Pot2: React.FC<{ x: number; g: number; gold: number; lab: string; col: string; tt: number }> = ({ x, g, gold, lab, col, tt }) => <>
  {Array.from({ length: 12 }, (_, i) => { const hh = (180 + (i * 37) % 120) * g, xx = x - 170 + i * 31, sw = 4 * Math.sin(tt * 1.6 + i); return <div key={i} style={{ ...at(xx, 560 - hh), width: 8, height: hh, background: "linear-gradient(180deg,#9ab84a,#5a7a2a)", transform: `rotate(${sw}deg)`, transformOrigin: "50% 100%" }}>
    {g > 0.5 && <div style={{ ...at(-12, -60), width: 32, height: 70, borderRadius: "50% 50% 40% 40%", background: `repeating-linear-gradient(0deg, ${gold > 0.5 ? "#e9b949" : "#b8c86a"} 0 10px, ${gold > 0.5 ? "#c9952a" : "#8aa040"} 10px 14px)`, opacity: cl((g - 0.5) * 3) }} />}</div>; })}
  <svg width={460} height={360} style={at(x - 230, 540)}><path d="M20 20 L440 20 L390 330 L70 330 Z" fill="#b8613a" /><path d="M10 0 L450 0 L450 40 L10 40 Z" fill="#c9714a" /><path d="M40 120 L420 120" stroke="rgba(60,25,10,.3)" strokeWidth={10} /></svg>
  <div style={{ ...at(x - 230, 700), width: 460, textAlign: "center", fontWeight: 900, fontSize: 50, color: col, textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>{lab}</div>
</>;
export const XWheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = K(tt, h, 0.3);
  return <>
    <div style={{ ...at(140, 880), width: 1640, height: 60, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    <Pot2 x={560} g={0.35 * k} gold={0} lab="SIN FÓSFORO" col={RED} tt={tt} />
    <Pot2 x={1360} g={k} gold={k} lab="CON FÓSFORO" col={GRN} tt={tt} />
  </>;
}}</Stage>;

// 3:34 · LA COLUMNA DE AÑOS: una columna de vidrio ancha al centro; cada ave que pasa deja caer una franja blanca y la columna sube hasta arriba
export const XStrata: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.3), N = 14, n = k * N;
  return <>
    <Floor x={960} y={950} w={900} />
    <div style={{ ...at(660, 260), width: 600, height: 680, borderRadius: "30px 30px 16px 16px", background: "rgba(220,240,255,.1)", border: "8px solid rgba(235,248,255,.8)", overflow: "hidden" }}>
      {Array.from({ length: Math.ceil(n) }, (_, i) => <div key={i} style={{ ...at(0, 680 - (i + 1) * 46 * Math.min(1, n - i)), width: 600, height: 46 * Math.min(1, n - i), background: i % 2 ? "linear-gradient(90deg,#d8cfb4,#efe7cf,#c9bf9f)" : "linear-gradient(90deg,#b9ae8f,#d6ccae,#a99e80)" }} />)}
      <div style={{ ...at(0, 300), width: 600, textAlign: "center", fontWeight: 900, fontSize: 64, color: INK, opacity: cl(k * 3 - 1) }}>MILES DE AÑOS</div>
    </div>
    {Array.from({ length: 5 }, (_, i) => { const p = (tt * 0.22 + i / 5) % 1; return <div key={i} style={{ ...at(-200 + p * 2300, 120 + (i % 3) * 50 + 20 * Math.sin(tt + i)) }}><Bird w={140 - (i % 2) * 30} f={0.5 + 0.5 * Math.sin(tt * 7 + i)} /></div>; })}
  </>;
}}</Stage>;

// 4:22 · TRES DUEÑOS: la isla grande se parte en tres gajos que se separan despacio; en cada gajo, el nombre del país grande
export const XSplit3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = K(tt, h, 0.4), N: string[] = h.names ?? ["GRAN BRETAÑA", "AUSTRALIA", "NUEVA ZELANDA"], C = ["#5f8ad8", "#e9b949", "#6fe39a"];
  return <>
    <Floor x={960} y={930} w={1200} />
    {[0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * (Math.PI * 2 / 3), dx = Math.cos(a + Math.PI / 3) * 170 * k, dy = Math.sin(a + Math.PI / 3) * 110 * k;
      return <div key={i} style={{ ...at(960 - 520 + dx, 580 - 330 + dy), width: 1040, height: 660, clipPath: `polygon(50% 50%, ${50 + 70 * Math.cos(a)}% ${50 + 70 * Math.sin(a)}%, ${50 + 70 * Math.cos(a + 1.05)}% ${50 + 70 * Math.sin(a + 1.05)}%, ${50 + 70 * Math.cos(a + 2.094)}% ${50 + 70 * Math.sin(a + 2.094)}%)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "47% 53% 50% 50% / 52% 46% 54% 48%", background: "radial-gradient(ellipse at 50% 50%, #4f8a52 62%, #e6d6a8 66%, #e6d6a8 71%, transparent 72%)", boxShadow: "inset 0 -20px 0 rgba(0,0,0,.25)" }} />
      </div>; })}
    {[0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * (Math.PI * 2 / 3) + Math.PI / 3, x = 960 + Math.cos(a) * (210 + 170 * k), y = 580 + Math.sin(a) * (130 + 110 * k);
      return <div key={"n" + i} style={{ ...at(x, y), transform: "translate(-50%,-50%)", opacity: cl((k - 0.15 - i * 0.12) * 4), fontWeight: 900, fontSize: 46, color: C[i], whiteSpace: "nowrap", textShadow: "0 4px 16px #000, 0 0 4px #000" }}>{N[i]}</div>; })}
  </>;
}}</Stage>;

// 5:16 · CENTAVOS: balanza de bronce grande; a la izquierda la montaña de fosfato no para de crecer, a la derecha tres monedas grandes; el brazo se va al piso y sigue oscilando
export const XCents: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = K(tt, h, 0.2), tilt = 16 * k + 1.6 * Math.sin(tt * 2.6) * (1 - 0.5 * k);
  const pan = (x: number, y: number, ch: React.ReactNode) => <div style={{ ...at(x - 210, y) }}><svg width={420} height={80} style={{ overflow: "visible" }}><line x1={210} y1={-200} x2={30} y2={30} stroke="#c9a35a" strokeWidth={6} /><line x1={210} y1={-200} x2={390} y2={30} stroke="#c9a35a" strokeWidth={6} /><ellipse cx={210} cy={36} rx={210} ry={40} fill="#b8903e" /></svg><div style={{ ...at(0, -260), width: 420, height: 290, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{ch}</div></div>;
  const r = (tilt * Math.PI) / 180, L = 560, ly = 380 - Math.sin(r) * -L, ry = 380 - Math.sin(r) * L;
  return <>
    <Floor x={960} y={960} w={1000} />
    <div style={{ ...at(930, 380), width: 60, height: 560, background: "linear-gradient(90deg,#8a6a2c,#f3d77a,#8a6a2c)", borderRadius: 10 }} />
    <div style={{ ...at(960 - L - 20, 360), width: 2 * L + 40, height: 36, borderRadius: 18, background: "linear-gradient(180deg,#f3d77a,#8a6a2c)", transform: `rotate(${-tilt}deg)` }} />
    {pan(960 - L * Math.cos(r), ly + 200, <div style={{ width: lerp(200, 400, k), height: lerp(110, 260, k), clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "linear-gradient(160deg,#efe7d2,#b9b09a 60%,#8a8270)" }} />)}
    {pan(960 + L * Math.cos(r), ry + 200, <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>{[0, 1, 2].map((i) => <Coin key={i} r={56} />)}</div>)}
    <Num tt={tt} d={0.2} x={960} y={140} txt="UNOS CENTAVOS POR TONELADA" size={80} col={AMB} />
  </>;
}}</Stage>;

// 5:27 · EL CORTE (pasos): bloque de tierra grande en corte; en cada paso dicho desaparece una capa con una pala que la arrastra; queda el coral en dientes
export const XCutaway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st: [number, string][] = said.length >= 3 ? said : [[h.at + 0.3, "SE TALA"], [h.at + 1.6, "SE SACA LA TIERRA"], [h.at + 2.9, "SE SACA EL FOSFATO"], [h.at + 4.2, "QUEDAN LOS PICOS DE CORAL"]];
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1), gone = (i: number) => (cur > i ? 1 : cur === i ? eio(t, st[i][0], st[i][0] + 1.4) : 0), tt = t - h.at;
  const L = [{ y: 330, hh: 110, bg: "#3f6a2a", lab: "ÁRBOLES" }, { y: 440, hh: 110, bg: "linear-gradient(180deg,#6b4a2b,#4a321c)", lab: "TIERRA" }, { y: 550, hh: 170, bg: "linear-gradient(180deg,#d8cfb4,#b9ae8f)", lab: "FOSFATO" }];
  return <>
    <Floor x={960} y={950} w={1500} />
    <div style={{ ...at(260, 720), width: 1400, height: 210, background: "linear-gradient(180deg,#e8e2d2,#b9b3a5)", clipPath: "polygon(0 100%, 0 30%, 4% 0, 8% 40%, 13% 6%, 18% 44%, 24% 2%, 30% 38%, 36% 8%, 42% 46%, 48% 4%, 54% 40%, 60% 10%, 66% 44%, 72% 2%, 78% 38%, 84% 8%, 90% 44%, 96% 6%, 100% 30%, 100% 100%)" }} />
    {L.map((l, i) => { const g = gone(i === 0 ? 0 : i === 1 ? 1 : 2); return <div key={i} style={{ ...at(260 + 1400 * g, l.y), width: 1400 * (1 - g), height: l.hh + (i === 2 ? 90 : 0), background: l.bg, boxShadow: "inset 0 6px 0 rgba(255,255,255,.12)" }}>
      {i === 0 && Array.from({ length: 14 }, (_, j) => <div key={j} style={{ ...at(30 + j * 98, -120 - (j % 3) * 20), width: 90, height: 140, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(circle at 40% 35%, #6f9a4a, #2f5a22)" }} />)}
    </div>; })}
    {cur >= 0 && cur < 3 && <div style={{ ...at(260 + 1400 * gone(cur) - 120, L[cur].y - 40), width: 140, height: 200, background: "linear-gradient(90deg,#8a9096,#eef1f4,#7a8086)", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)", opacity: gone(cur) < 1 ? 1 : 0 }} />}
    {cur >= 0 && <div key={cur} style={{ ...at(960, 160), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 84, color: cur === 3 ? AMB : TX, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{st[cur][1]}</div>}
    <div style={{ display: "none" }}>{tt}</div>
  </>;
}}</Stage>;

// 5:58 · LA CARGA: barco grande de costado; desde arriba a la izquierda cae un chorro de fosfato que arma una montaña en la bodega; el barco se hunde hasta la línea roja
export const XCantilever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = K(tt, h, 0.3), sink = 70 * k;
  return <>
    <Sea tt={tt} y={700} />
    <div style={{ ...at(0, 160), width: 900, height: 40, background: "linear-gradient(180deg,#6d737a,#3a3d41)", transform: "rotate(8deg)", transformOrigin: "0 50%" }} />
    {Array.from({ length: 30 }, (_, i) => { const p = (tt * 1.4 + i / 30) % 1; return tt > 0.3 ? <div key={i} style={{ ...at(870 + (i % 5) * 10 - 20, 290 + p * (330 + sink)), width: 22, height: 18, borderRadius: "40%", background: "#d8cfb4" }} /> : null; })}
    <div style={{ ...at(420, 520 + sink + 6 * Math.sin(tt * 1.6)) }}>
      <div style={{ ...at(300, 120 - 200 * k), width: 500, height: 200 * k + 10, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "linear-gradient(160deg,#efe7d2,#b9b09a)" }} />
      <svg width={1100} height={260}><path d="M0 120 L1100 120 L1020 250 L70 250 Z" fill="#2f343b" /><path d="M0 120 L1100 120" stroke="#c9a35a" strokeWidth={6} /><rect x={0} y={200 - sink * 0.9} width={1100} height={10} fill="#c2261e" opacity={0.9} /><rect x={900} y={20} width={120} height={100} fill="#e8e4da" /><rect x={940} y={-30} width={36} height={60} fill="#8a2a1e" /></svg>
    </div>
    <Sea tt={tt + 2} y={840} front />
    <Num tt={tt} d={0.2} x={960} y={140} txt="A LOS BARCOS" size={110} col={AMB} />
  </>;
}}</Stage>;

// 7:14 · LA DEPORTACIÓN: un barco grande con doce siluetas en cubierta zarpa a la derecha; al final vuelve por la izquierda con menos siluetas
const People: React.FC<{ n: number }> = ({ n }) => <div style={{ display: "flex", gap: 14 }}>{Array.from({ length: n }, (_, i) => <svg key={i} width={46} height={110} viewBox="0 0 46 110"><circle cx={23} cy={16} r={14} fill="#1d1a16" /><path d="M4 110 Q4 40 23 34 Q42 40 42 110 Z" fill="#1d1a16" /></svg>)}</div>;
export const XDeport: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), arrive = eio(tt, 0.2, 1.6), gone = eio(tt, w * 0.5, w - 0.45), nV = 12 - Math.round(5 * gone), x = lerp(-700, 310, arrive) + 30 * Math.sin(tt * 0.6);
  return <>
    <Sea tt={tt} y={700} />
    <div style={{ ...at(x, 330 + 8 * Math.sin(tt * 1.4)), transform: `rotate(${1.2 * Math.sin(tt * 1.1)}deg)` }}>
      <div style={{ ...at(150, 0), display: "flex", gap: 22 }}>{Array.from({ length: 12 }, (_, i) => { const off = i % 2 === 1 && Math.floor(i / 2) < 5 ? cl((gone * 5 - Math.floor(i / 2)) * 1.2) : 0;
        return <svg key={i} width={66} height={160} viewBox="0 0 46 110" style={{ opacity: 1 - off, transform: `translateY(${off * 40}px)` }}><circle cx={23} cy={16} r={14} fill="#1d1a16" /><path d="M4 110 Q4 40 23 34 Q42 40 42 110 Z" fill="#1d1a16" /></svg>; })}</div>
      <svg width={1300} height={300} style={at(0, 150)}><path d="M0 20 L1300 20 L1200 200 L90 200 Z" fill="#4a3424" /><path d="M0 20 L1300 20" stroke="#c9a35a" strokeWidth={8} /><path d="M40 70 L1250 70 M80 130 L1220 130" stroke="rgba(0,0,0,.25)" strokeWidth={6} /></svg>
    </div>
    <Sea tt={tt + 2} y={840} front />
    <Num tt={tt} d={0.2} x={960} y={140} txt={gone < 0.15 ? "1.200 A CHUUK" : "VOLVIERON MENOS"} size={110} col={gone < 0.15 ? TX : RED} />
  </>;
}}</Stage>;

// 8:02 · EL RELOJ DE ARENA: reloj de arena alto; arriba, la isla verde que se gasta en arena; abajo se apila gris; el año corre 1964 → 1994 hasta la salida
export const XHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.3);
  return <>
    <Floor x={960} y={970} w={700} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <defs><clipPath id="hgT"><path d="M720 200 L1200 200 Q1200 420 990 560 L930 560 Q720 420 720 200 Z" /></clipPath><clipPath id="hgB"><path d="M930 580 L990 580 Q1200 720 1200 940 L720 940 Q720 720 930 580 Z" /></clipPath></defs>
      <g clipPath="url(#hgT)"><rect x={700} y={lerp(260, 560, k)} width={520} height={320} fill="#4f8a52" /><rect x={700} y={lerp(260, 560, k)} width={520} height={18} fill="#e6d6a8" /></g>
      <g clipPath="url(#hgB)"><path d={`M720 940 L720 ${940 - 220 * k} Q960 ${940 - 330 * k} 1200 ${940 - 220 * k} L1200 940 Z`} fill="#a8a294" /></g>
      {k < 0.99 && <rect x={954} y={556} width={12} height={380 - 220 * k} fill="#c9c2ae" />}
      <path d="M720 200 L1200 200 Q1200 420 990 560 L990 580 Q1200 720 1200 940 L720 940 Q720 720 930 580 L930 560 Q720 420 720 200 Z" fill="rgba(220,240,255,.1)" stroke="rgba(235,248,255,.85)" strokeWidth={8} />
      <rect x={680} y={170} width={560} height={34} rx={10} fill="#6b4a2b" /><rect x={680} y={936} width={560} height={34} rx={10} fill="#6b4a2b" />
    </svg>
    <Num tt={tt} d={0.1} x={1520} y={560} txt={`${Math.round(1964 + 30 * k)}`} size={130} col={k > 0.98 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={0.6} x={1520} y={680} txt="INHABITABLE" col={RED} size={44} />
  </>;
}}</Stage>;

// 8:29 · LA MUDANZA: una caja de madera grande con casitas adentro cuelga de un gancho; sube y viaja a la derecha; cae el sello NO y la caja vuelve a su lugar
export const XMoveBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), go = eio(tt, 0.3, w * 0.45), no = phys(tt, w * 0.5, 7, 0.35), back = eio(tt, w * 0.62, w - 0.2), x = lerp(lerp(560, 1240, go), 560, back), y = 420 - 160 * Math.sin(Math.PI * go) * (1 - back);
  return <>
    <Floor x={x + 200} y={950} w={700} />
    <div style={{ ...at(x + 196, 0), width: 8, height: y + 10, background: "#2a2c30" }} />
    <div style={{ ...at(x, y), width: 420, height: 320, transform: `rotate(${3 * Math.sin(tt * 2)}deg)`, transformOrigin: "50% 0" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#b8834a 0 50px,#9a6a3a 50px 56px)", borderRadius: 8, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ ...at(40 + i * 120, 60), width: 100, height: 90, background: "#e8dcc6", boxShadow: "inset 0 26px 0 #a8442a" }} />)}
      <div style={{ ...at(0, 180), width: 420, textAlign: "center", fontWeight: 900, fontSize: 52, color: "#3a2410" }}>NAURU</div>
    </div>
    {no > 0.01 && <div style={{ ...at(1440, 700), transform: `translate(-50%,-50%) scale(${1.8 - 0.8 * no}) rotate(-12deg)`, opacity: cl(no * 2), border: "14px solid #c2261e", color: "#c2261e", padding: "0 40px", fontWeight: 900, fontSize: 150, borderRadius: 16, background: "rgba(20,10,10,.45)" }}>NO</div>}
    <Num tt={tt} d={0.2} x={960} y={150} txt="A CURTIS ISLAND" size={100} col={AMB} />
  </>;
}}</Stage>;

// 9:19 · LA BANDERA: la bandera de Nauru grande sube por el mástil y ondea hasta la salida; detrás, la hoja del almanaque 31 cae
export const XFlag68: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), up = eio(tt, 0.3, w * 0.55), y = lerp(760, 230, up);
  return <>
    <Floor x={960} y={960} w={600} />
    <div style={{ ...at(560, 190), width: 22, height: 780, background: "linear-gradient(90deg,#8a8c90,#f0f0f0,#6d6f73)", borderRadius: 11 }} />
    <svg width={800} height={420} style={at(582, y)} viewBox="0 0 800 420">
      <defs><linearGradient id="fsh" x1="0" x2="1"><stop offset="0" stopColor="rgba(0,0,0,0)" />{Array.from({ length: 6 }, (_, i) => <stop key={i} offset={(i + 0.5) / 6} stopColor={`rgba(0,0,0,${0.18 + 0.12 * Math.sin(tt * 4 - i * 1.4)})`} />)}<stop offset="1" stopColor="rgba(0,0,0,0)" /></linearGradient></defs>
      <path d={`M0 0 ${Array.from({ length: 9 }, (_, i) => `L${(i + 1) * 100} ${18 * Math.sin(tt * 4 - i * 0.9) * (i / 8)}`).join(" ")} L800 ${380 + 18 * Math.sin(tt * 4 - 7.2)} ${Array.from({ length: 9 }, (_, i) => `L${(8 - i) * 100} ${380 + 18 * Math.sin(tt * 4 - (8 - i) * 0.9) * ((8 - i) / 8)}`).join(" ")} Z`} fill="#0b2a7a" />
      <rect x={0} y={170 + 8 * Math.sin(tt * 4 - 3)} width={800} height={34} fill="#f2c21b" />
      <polygon points="200,250 214,282 248,284 222,306 230,340 200,322 170,340 178,306 152,284 186,282" fill="#fff" />
      <rect x={0} y={0} width={800} height={420} fill="url(#fsh)" style={{ mixBlendMode: "multiply" }} />
    </svg>
    <Num tt={tt} d={0.2} x={1160} y={150} txt="31 DE ENERO DE 1968" size={84} col={AMB} />
  </>;
}}</Stage>;

// 9:44 · LA CATARATA DE PLATA: lluvia densa de monedas de plata sobre la isla grande; la montaña de plata sube y no para; el contador de millones sube
export const XCascade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = K(tt, h, 0.3);
  return <>
    <Floor x={960} y={950} w={1300} />
    <div style={{ ...at(960 - 560, 560), transform: "perspective(1800px) rotateX(48deg)", transformOrigin: "50% 60%" }}><Island w={1120} /></div>
    <div style={{ ...at(960 - 360 * k - 60, 820 - 260 * k), width: 720 * k + 120, height: 260 * k + 30, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "radial-gradient(circle at 30% 30%, #ffffff 0 10px, #c9d1d8 11px 20px, #8a939c 21px) 0 0/44px 40px" }} />
    {Array.from({ length: 40 }, (_, i) => { const p = (tt * (0.7 + (i % 5) * 0.1) + i / 40) % 1; return tt > 0.3 ? <div key={i} style={{ ...at(620 + (i * 89) % 700, -60 + p * (840 - 260 * k)), transform: `rotateX(${p * 720 + i * 40}deg)` }}><Coin r={22} silver /></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={150} txt="UNA CATARATA DE PLATA" size={96} col={ICE} />
  </>;
}}</Stage>;

// 10:31 · LAS VUELTAS: cuentakilómetros grande que gira; al costado, un auto rojo da vueltas a la isla sin parar
export const XLaps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.3), km = 19 * 6 * k, a = -Math.PI / 2 + tt * 1.6, cx = 1380, cy = 600;
  const dig = (v: number) => String(Math.floor(v)).padStart(4, "0");
  return <>
    <Floor x={600} y={880} w={800} />
    <div style={{ ...at(260, 380), width: 680, height: 260, borderRadius: 30, background: "linear-gradient(180deg,#2a2c30,#0d0e10)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.12)", display: "flex", gap: 14, padding: 40 }}>
      {[...dig(km)].map((c, i) => { const frac = i === 3 ? km % 1 : 0; return <div key={i} style={{ width: 130, height: 180, borderRadius: 12, overflow: "hidden", background: "linear-gradient(180deg,#e8e4da,#fff 50%,#d8d2c2)", position: "relative" }}><div style={{ ...at(0, -180 * frac), width: 130, textAlign: "center", fontWeight: 900, fontSize: 140, lineHeight: "180px", color: "#111" }}>{c}<br />{(Number(c) + 1) % 10}</div></div>; })}
    </div>
    <div style={{ ...at(260, 660), width: 680, textAlign: "center", fontWeight: 900, fontSize: 56, color: AMB }}>KM</div>
    <div style={{ ...at(cx - 330, cy - 200), transform: "perspective(1400px) rotateX(40deg)" }}><Island w={660} /></div>
    <div style={{ ...at(cx + Math.cos(a) * 300 - 45, cy + Math.sin(a) * 170 - 22), transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }}><Car w={90} /></div>
    <Num tt={tt} d={0.2} x={960} y={150} txt={`VUELTA ${Math.max(1, Math.ceil(6 * k))}`} size={110} />
  </>;
}}</Stage>;

// 12:05 · LA TORRE: la cámara sube con la torre; los pisos se apilan uno por uno con la grúa arriba; el contador del costado llega a 52 en la salida
export const XTower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), n = Math.round(52 * k), FH = 26, top = 980 - n * FH, cam = Math.max(0, 300 - top);
  return <>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${cam}px)` }}>
      <div style={{ ...at(0, 980), width: 1920, height: 400, background: "linear-gradient(180deg,#3a3d41,#1a1b1d)" }} />
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(760, 980 - (i + 1) * FH), width: 400, height: FH - 3, background: "linear-gradient(90deg,#3a4a5a,#6d8aa4 40%,#3a4a5a)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,.3)" }}>{Array.from({ length: 10 }, (_, j) => <div key={j} style={{ ...at(14 + j * 38, 5), width: 26, height: FH - 13, background: (i * 7 + j * 3) % 5 === 0 ? "#f2c96a" : "rgba(20,30,40,.8)" }} />)}</div>)}
      <div style={{ ...at(1140, top - 380), width: 20, height: 420, background: "repeating-linear-gradient(0deg,#f2c21b 0 20px,#2a2410 20px 26px)" }} />
      <div style={{ ...at(700, top - 380), width: 700, height: 20, background: "repeating-linear-gradient(90deg,#f2c21b 0 20px,#2a2410 20px 26px)" }} />
      <div style={{ ...at(800, top - 360), width: 4, height: 300 + 30 * Math.sin(tt * 2), background: "#222" }} />
    </div>
    <Num tt={tt} d={0.2} x={1540} y={480} txt={`${n}`} size={190} col={n >= 52 ? AMB : "#fff7ea"} />
    <Tag tt={tt} at={0.4} x={1540} y={610} txt="PISOS" size={50} />
    <Tag tt={tt} at={0.8} x={400} y={480} txt="CASA NAURU" col={AMB} size={50} />
  </>;
}}</Stage>;

// 12:22 · EL TELÓN: telón rojo de teatro con pliegues; se abre, la marquesina con lamparitas dice LEONARDO; el telón se cierra de golpe y cae un boleto
export const XCurtain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), op = eio(tt, 0.3, w * 0.35), cl2 = eio(tt, w * 0.62, w * 0.72), o = op * (1 - cl2), tk = eio(tt, w * 0.74, w - 0.1);
  return <>
    <div style={{ ...at(260, 160), width: 1400, height: 760, background: "radial-gradient(ellipse at 50% 40%, #3a2a1a, #0d0806 70%)", boxShadow: "inset 0 0 120px #000" }}>
      <div style={{ ...at(300, 240), width: 800, height: 200, borderRadius: 18, background: "#1a1208", boxShadow: "0 0 0 10px #c9a35a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 110, color: "#ffe9b0", textShadow: "0 0 30px rgba(255,200,100,.8)" }}>LEONARDO</div>
      {Array.from({ length: 26 }, (_, i) => <div key={i} style={{ ...at(300 + (i % 13) * 62, i < 13 ? 220 : 450), width: 16, height: 16, borderRadius: "50%", background: (i + Math.floor(tt * 6)) % 3 ? "#ffe9b0" : "#6a5a3a", boxShadow: "0 0 12px #ffd27a" }} />)}
    </div>
    {[0, 1].map((s) => <div key={s} style={{ ...at(s ? 960 + 700 * o : 260, 160), width: 700 * (1 - o) + 4, height: 760, background: "repeating-linear-gradient(90deg,#8e1a12 0 34px,#c2261e 34px 60px,#7a140e 60px 80px)", boxShadow: `${s ? -1 : 1}0px 0 40px rgba(0,0,0,.6)` }} />)}
    <div style={{ ...at(220, 130), width: 1480, height: 80, background: "repeating-linear-gradient(90deg,#7a140e 0 40px,#a8201a 40px 80px)", borderRadius: "0 0 40px 40px" }} />
    {tk > 0 && <div style={{ ...at(960, lerp(-100, 820, tk)), transform: `translate(-50%,-50%) rotate(${lerp(-40, -8, tk)}deg)`, width: 420, height: 170, background: PAPER, borderRadius: 10, boxShadow: "0 20px 30px rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 46, color: "#c2261e" }}>BAJÓ DE CARTEL</div>}
    <Num tt={tt} d={0.2} x={960} y={80} txt="1993" size={80} col={AMB} />
  </>;
}}</Stage>;

// 13:49 · LA DEMANDA: un sobre lacrado grande sale de la isla (izquierda), cruza en arco y entra por la puerta de un edificio de columnas (La Haya); cae el mazo
export const XEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), k = eio(tt, 0.4, w * 0.7), g = phys(tt, w * 0.78, 7, 0.4), x = lerp(420, 1400, k), y = lerp(640, 560, k) - Math.sin(Math.PI * k) * 320;
  return <>
    <Floor x={960} y={950} w={1600} />
    <div style={{ ...at(140, 680), transform: "perspective(1400px) rotateX(45deg)" }}><Island w={520} /></div>
    <div style={{ ...at(1240, 360), width: 520, height: 520, background: "linear-gradient(180deg,#e8e0cc,#b9b09a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(-20, -70), width: 560, height: 90, background: "linear-gradient(180deg,#f2ecdc,#c9c0a8)", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ ...at(30 + i * 100, 50), width: 50, height: 380, background: "linear-gradient(90deg,#c9c0a8,#fff,#b9b09a)" }} />)}
    </div>
    <div style={{ ...at(x - 160, y - 100), transform: `rotate(${lerp(-14, 6, k)}deg) scale(${lerp(1, 0.7, k)})`, width: 320, height: 200, background: PAPER, boxShadow: "0 20px 30px rgba(0,0,0,.55)", opacity: k > 0.97 ? 0 : 1 }}>
      <svg width={320} height={200} style={at(0, 0)}><path d="M0 0 L160 110 L320 0" fill="none" stroke="#cdbb92" strokeWidth={5} /></svg>
      <div style={{ ...at(124, 76), width: 72, height: 72, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)" }} />
    </div>
    {g > 0.01 && <div style={{ ...at(1500, 240), transform: `rotate(${lerp(-60, 0, Math.min(1, g))}deg)`, transformOrigin: "100% 100%" }}><div style={{ width: 240, height: 70, borderRadius: 16, background: "linear-gradient(180deg,#8a5a34,#4a2d16)" }} /><div style={{ ...at(150, 70), width: 26, height: 200, background: "#6b4a2b" }} /></div>}
    <Num tt={tt} d={0.2} x={960} y={140} txt="DEMANDA A AUSTRALIA" size={96} col={AMB} />
  </>;
}}</Stage>;

// 14:20 · EN CUOTAS: un frasco de vidrio grande; cae una moneda por año, sin parar; el frasco se llena y el total A$ sube adentro
export const XInstallments: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.3), n = Math.floor(k * 20);
  return <>
    <Floor x={960} y={960} w={800} />
    <div style={{ ...at(660, 300), width: 600, height: 640, borderRadius: "40px 40px 60px 60px", background: "rgba(220,240,255,.1)", border: "8px solid rgba(235,248,255,.85)", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(40 + ((i * 97) % 420), 560 - Math.floor(i / 4) * 40 - (i % 2) * 10) }}><Coin r={46} /></div>)}
      <div style={{ ...at(0, 240), width: 600, textAlign: "center", fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 6px 20px #000" }}>A$ {Math.round(107 * k)} M</div>
    </div>
    <div style={{ ...at(640, 270), width: 640, height: 50, borderRadius: 12, background: "linear-gradient(180deg,#9aa0a6,#4a4f55)" }} />
    {k < 1 && <div style={{ ...at(914, 60 + ((tt * 3) % 1) * 280), transform: `rotateX(${tt * 600}deg)` }}><Coin r={46} /></div>}
    <Num tt={tt} d={0.2} x={960} y={140} txt="EN CUOTAS, AÑO A AÑO" size={90} col={AMB} />
  </>;
}}</Stage>;

// 15:07 · SIN LUZ: un medidor de tanque grande; la aguja baja de LLENO a VACÍO hasta la salida; arriba la lamparita parpadea y se apaga
export const XGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.3), ang = lerp(-60, 60, k) * -1 + 0, flick = k > 0.6 ? ((Math.floor(tt * 9) % 3) ? 0.15 : 1) * (1 - k) : 1;
  return <>
    <Floor x={960} y={960} w={900} />
    <div style={{ ...at(560, 340), width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #3a3d41, #111 70%)", boxShadow: "0 0 0 24px #8a9096, 0 40px 60px rgba(0,0,0,.6)", clipPath: "inset(0 0 45% 0)" }}>
      <svg width={800} height={800} style={at(0, 0)}>
        {Array.from({ length: 9 }, (_, i) => { const a = ((-150 + i * 15) * Math.PI) / 180; return <line key={i} x1={400 + Math.cos(a) * 330} y1={400 + Math.sin(a) * 330} x2={400 + Math.cos(a) * 380} y2={400 + Math.sin(a) * 380} stroke={i < 2 ? "#ff5a4a" : "#f4f1ea"} strokeWidth={12} />; })}
        <text x={120} y={300} fill="#ff5a4a" fontSize={80} fontWeight={900}>E</text><text x={630} y={300} fill="#f4f1ea" fontSize={80} fontWeight={900}>F</text>
        <g transform={`rotate(${lerp(-30, -150, k) + 1.5 * Math.sin(tt * 9) * (1 - k)} 400 400)`}><path d="M400 388 L760 400 L400 412 Z" fill="#ff7a3a" /></g>
        <circle cx={400} cy={400} r={46} fill="#8a9096" />
      </svg>
    </div>
    <div style={{ ...at(1440, 200), width: 140, height: 180, borderRadius: "50% 50% 40% 40%", background: `radial-gradient(circle at 50% 40%, rgba(255,240,180,${0.95 * flick}), rgba(255,200,100,${0.5 * flick}) 50%, rgba(80,70,50,.7))`, boxShadow: `0 0 ${120 * flick}px rgba(255,220,140,${flick})` }} />
    <div style={{ ...at(1470, 380), width: 80, height: 60, background: "linear-gradient(90deg,#8a9096,#d0d4d8,#6d737a)" }} />
    <Num tt={tt} d={0.2} x={960} y={140} txt="SIN COMBUSTIBLE, SIN LUZ" size={84} col={RED} />
  </>;
}}</Stage>;

// 15:39 · LA GÓNDOLA: un estante grande se llena de latas y bolsas con su palabra en grande (HARINA · AZÚCAR · GASEOSA) de a una, hasta la salida
export const XShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), N = 12, n = k * N, L = [["HARINA", "#e8e0cc", "#3a2a1a"], ["AZÚCAR", "#5f8ad8", "#fff"], ["GASEOSA", "#c2261e", "#fff"]];
  return <>
    {[0, 1].map((r) => <div key={r} style={{ ...at(260, 540 + r * 330), width: 1400, height: 30, background: "linear-gradient(180deg,#d0d4d8,#7a8086)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }} />)}
    {Array.from({ length: N }, (_, i) => { const s = cl(n - i), r = Math.floor(i / 6), c = i % 6, l = L[i % 3]; return s > 0 ? <div key={i} style={{ ...at(290 + c * 228, 540 + r * 330 - 270 + (1 - eio(s, 0, 1)) * -300), width: 200, height: 270, opacity: cl(s * 3), borderRadius: i % 3 === 0 ? 20 : "16px 16px 8px 8px", background: `linear-gradient(90deg, rgba(0,0,0,.25), ${l[1]} 30%, ${l[1]} 70%, rgba(0,0,0,.3))`, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ transform: "rotate(-90deg)", fontWeight: 900, fontSize: 44, color: l[2], whiteSpace: "nowrap" }}>{l[0]}</div></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={140} txt="TODO EN LATA Y EN BOLSA" size={90} col={AMB} />
  </>;
}}</Stage>;

// 16:48 · EL DESVÍO: el carguero grande navega a la derecha hacia una boya que dice AUSTRALIA; sube una barrera roja; el barco da la vuelta y se va a la izquierda
export const XReroute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), go = eio(tt, 0.3, w * 0.4), bar = eio(tt, w * 0.35, w * 0.5), back = eio(tt, w * 0.55, w - 0.2), x = back > 0 ? lerp(1000, -900, back) : lerp(-300, 1000, go);
  return <>
    <Sea tt={tt} y={700} />
    <div style={{ ...at(1500, 300), width: 300, textAlign: "center", fontWeight: 900, fontSize: 52, color: TX, textShadow: "0 4px 14px #000" }}>AUSTRALIA</div>
    <div style={{ ...at(1520, 380), width: 260, height: 330, background: "linear-gradient(180deg,#d8c08a,#8a7a52)", clipPath: "polygon(0 100%, 20% 30%, 60% 0, 100% 40%, 100% 100%)" }} />
    <div style={{ ...at(1380, 720 - 420 * bar), width: 40, height: 420 * bar, background: "repeating-linear-gradient(0deg,#c2261e 0 40px,#fff 40px 80px)", boxShadow: "0 0 30px rgba(255,80,60,.5)" }} />
    <div style={{ ...at(x, 470 + 6 * Math.sin(tt * 1.4)), transform: back > 0 ? "scaleX(-1)" : undefined }}><Ship w={760} name="TAMPA" tt={tt} smoke={1} /></div>
    <Sea tt={tt + 2} y={840} front />
    <Num tt={tt} d={0.2} x={760} y={140} txt={back > 0 ? "← A NAURU" : "TAMPA · 2001"} size={110} col={back > 0 ? RED : AMB} />
  </>;
}}</Stage>;

// 19:30 · LA PILA: al lado de una puerta y de una persona en silueta, los billetes caen de a uno y la pila sube hasta pasar el marco de la puerta
export const XBillStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.3), n = Math.floor(k * 60), top = 930 - n * 11;
  return <>
    <Floor x={960} y={950} w={1300} />
    <div style={{ ...at(420, 330), width: 300, height: 600, border: "26px solid #6b4a2b", borderBottom: "none", background: "linear-gradient(180deg,#1a1410,#2a2018)" }} />
    <svg width={200} height={520} viewBox="0 0 46 110" style={at(1400, 410)}><circle cx={23} cy={16} r={14} fill="#0d0b09" /><path d="M4 110 Q4 40 23 34 Q42 40 42 110 Z" fill="#0d0b09" /></svg>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(860 + ((i * 13) % 9) - 4, 930 - (i + 1) * 11), transform: `rotate(${(i * 7) % 5 - 2}deg)` }}><Bill w={300} /></div>)}
    {k < 1 && <div style={{ ...at(860, lerp(-150, top - 140, (tt * 2.5) % 1)), transform: `rotate(${(tt * 300) % 30 - 15}deg)` }}><Bill w={300} /></div>}
    <Num tt={tt} d={0.2} x={960} y={140} txt={`A$ ${(3 * k).toFixed(1).replace(".", ",")} M POR PERSONA`} size={84} col={AMB} />
  </>;
}}</Stage>;

// 20:59 · LA PESCA DE NOCHE: canoa grande con un farol que ilumina el mar; peces voladores plateados saltan en arco por la luz y el pescador los agarra con la red
const FlyFish: React.FC<{ w: number }> = ({ w }) => <svg width={w} height={w * 0.5} viewBox="0 0 120 60"><path d="M10 30 Q50 12 100 28 L118 18 L112 30 L118 42 L100 32 Q50 48 10 30 Z" fill="url(#ffs)" /><path d="M40 28 L70 2 L78 26 Z M40 32 L70 58 L78 34 Z" fill="rgba(200,225,245,.75)" /><circle cx={22} cy={28} r={3} fill="#111" /><defs><linearGradient id="ffs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a5a7a" /><stop offset=".5" stopColor="#e8f2fa" /><stop offset="1" stopColor="#9ab0c4" /></linearGradient></defs></svg>;
export const XLantern: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #10202e, #02060a 75%)">{(tt) => <>
  <div style={{ ...at(560, 300), width: 800, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,214,140,.35), transparent 65%)" }} />
  <Sea tt={tt} y={720} />
  {Array.from({ length: 5 }, (_, i) => { const p = ((tt * 0.45 + i / 5) % 1); return <div key={i} style={{ ...at(lerp(1700, 300, p) - 90, 760 - Math.sin(Math.PI * p) * 360), transform: `scaleX(-1) rotate(${lerp(-25, 25, p)}deg)`, filter: "drop-shadow(0 0 14px rgba(255,220,150,.6))" }}><FlyFish w={190} /></div>; })}
  <div style={{ ...at(560, 680 + 8 * Math.sin(tt * 1.2)) }}>
    <svg width={800} height={160}><path d="M0 40 Q400 160 800 40 L760 90 Q400 170 40 90 Z" fill="#4a2d16" /><path d="M0 40 Q400 160 800 40" stroke="#8a5a34" strokeWidth={8} fill="none" /></svg>
    <div style={{ ...at(560, -180), width: 10, height: 200, background: "#3a2614" }} />
    <div style={{ ...at(535, -240), width: 60, height: 80, borderRadius: 14, background: "radial-gradient(circle, #fff3c4, #ffb347 60%, #8a5a20)", boxShadow: `0 0 ${80 + 20 * Math.sin(tt * 5)}px rgba(255,200,110,.9)` }} />
    <svg width={260} height={300} style={at(140, -280)}><circle cx={130} cy={110} r={100} fill="rgba(230,230,210,.12)" stroke="rgba(230,230,210,.7)" strokeWidth={4} strokeDasharray="8 8" transform={`rotate(${tt * 30} 130 110)`} /><line x1={130} y1={210} x2={130} y2={300} stroke="#6b4a2b" strokeWidth={10} /></svg>
  </div>
  <Sea tt={tt + 2} y={860} front />
  <Num tt={tt} d={0.2} x={960} y={140} txt="CON REDES DE MANO" size={96} col={AMB} />
</>}</Stage>;

// 23:01 · EL AGUA SUBE: corte de la isla grande; el mar sube con olas hasta la salida y tapa las casas de la costa una por una; la meseta minada queda seca arriba
export const XSeaLevel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), lv = lerp(820, 640, k);
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M0 900 L240 900 Q400 760 560 720 L700 700 Q760 520 960 470 Q1160 520 1220 700 L1360 720 Q1520 760 1680 900 L1920 900 L1920 1080 L0 1080 Z" fill="#8a7a52" />
      <path d="M700 700 Q760 520 960 470 Q1160 520 1220 700 Z" fill="#a8a294" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${800 + i * 40} ${520 + (i % 2) * 30} l20 -60 l20 60 Z`} fill="#d8d2c2" />)}
      {[[430, 760], [560, 700], [1300, 700], [1440, 760]].map(([x, y], i) => <g key={i}><rect x={x - 50} y={y - 70} width={100} height={70} fill="#e8dcc6" /><path d={`M${x - 60} ${y - 70} L${x} ${y - 120} L${x + 60} ${y - 70} Z`} fill="#a8442a" /></g>)}
      <path d={`M0 ${lv} ${Array.from({ length: 17 }, (_, i) => `Q${i * 120 + 60} ${lv - 16 * Math.sin(tt * 2 + i)} ${(i + 1) * 120} ${lv}`).join(" ")} L1920 1080 L0 1080 Z`} fill="rgba(30,110,150,.82)" />
    </svg>
    <Num tt={tt} d={0.2} x={960} y={150} txt="EL MAR SUBE" size={110} col={ICE} />
  </>;
}}</Stage>;

export const HC4: Record<string, React.FC<{ t: number; h: H }>> = { islasize: XIslaSize, bite: XBite, door: XDoor, flask: XFlask, wheat: XWheat, strata: XStrata, split3: XSplit3,
  cents: XCents, cutaway: XCutaway, cantilever: XCantilever, deport: XDeport, hourglass: XHourglass, movebox: XMoveBox, flag68: XFlag68, cascade: XCascade, laps: XLaps, tower: XTower,
  curtain: XCurtain, envelope: XEnvelope, installments: XInstallments, gauge: XGauge, shelf: XShelf, reroute: XReroute, billstack: XBillStack, lantern: XLantern, sealevel: XSeaLevel };
