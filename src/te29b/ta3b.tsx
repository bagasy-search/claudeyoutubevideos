// te29b · REEMPLAZOS tras la 3.ª vuelta del evaluador (31-oct) · parte 2 de 2. Mismo criterio: un objeto grande con volumen, de a uno con rebote,
// acción hasta la salida, un solo renglón de texto lejos de los bordes.
import React from "react";
import { AMB, H, ICE, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { Bill, Coin, Floor, GOLD, INK, K, LIN, Num, PAPER, PAPERD, Person, Slab, W, at, lerp } from "./tkit";

const pl = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

// 11:12 · UNA FRACCIÓN: un pan redondo grande; el cuchillo lo corta en rebanadas; manos de saco oscuro se llevan una por una; a HAITÍ le queda la última
const XSlices: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), N = 7, cut = eio(tt, 0.3, 1.6), step = (w - 2.2) / (N - 1);
  return <>
    <Floor x={960} y={900} w={1400} />
    <div style={{ ...at(260, 760), width: 1400, height: 80, borderRadius: 40, background: "linear-gradient(180deg,#a8743e,#5a3a20)" }} />
    {Array.from({ length: N }, (_, i) => { const take = i < N - 1 ? eio(tt, 1.7 + i * step, 1.7 + i * step + 0.9) : 0, x = 380 + i * 170 + cut * i * 14;
      return <div key={i} style={{ ...at(x + take * 900 * (i % 2 ? 1 : -1), 440 - take * 500), opacity: 1 - cl((take - 0.8) * 5), transform: `rotate(${take * 30}deg)` }}>
        <div style={{ width: 150, height: 330, borderRadius: i === 0 ? "160px 20px 20px 160px" : i === N - 1 ? "20px 160px 160px 20px" : 16, background: "radial-gradient(ellipse at 50% 40%, #f6e2b8, #e8c88a 60%, #a8642a 92%)", boxShadow: "inset 0 0 0 10px #8a4a1a, 0 14px 20px rgba(0,0,0,.45)" }} />
        {take > 0 && take < 0.95 && <div style={{ ...at(30, -120), width: 90, height: 160, background: "linear-gradient(180deg,#1e2228,#3a4048)", borderRadius: 20 }}><div style={{ ...at(10, 120), width: 70, height: 50, borderRadius: 18, background: "#e0b48a" }} /></div>}
      </div>; })}
    {cut < 1 && <div style={{ ...at(lerp(300, 1500, cut), 300), transform: "rotate(10deg)" }}><div style={{ width: 40, height: 380, background: "linear-gradient(90deg,#8a9096,#f0f2f4,#6a7076)", borderRadius: "0 0 20px 0" }} /><div style={{ width: 54, height: 120, marginLeft: -7, background: "#2a1a10", borderRadius: 8 }} /></div>}
    <div style={{ ...at(380 + 6 * 170 + 84 + 75, 360), opacity: cl((tt - 1.7 - 5 * step - 0.6) * 3), transform: "translateX(-50%)", padding: "8px 24px", background: "#f1ead9", borderRadius: 10, fontWeight: 900, fontSize: 52, color: "#1a3a8a", whiteSpace: "nowrap" }}>HAITÍ</div>
    <Num tt={tt} d={0.2} x={960} y={150} txt="SE LO LLEVAN LOS BANCOS" size={90} col={AMB} />
  </>;
}}</Stage>;

// 11:51 · LA LLAVE: una puerta de bóveda redonda enorme con PARÍS grabado; una llave de hierro entra, gira media vuelta y la puerta se abre
const XSafeKey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), ins = eio(tt, 0.3, w * 0.35), rot = eio(tt, w * 0.35, w * 0.6), open = eio(tt, w * 0.62, w - 0.45);
  return <>
    <Floor x={960} y={980} w={1300} />
    <div style={{ ...at(560, 200), width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,#1a1a1a 60%,#3a3d41)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(560, 200), width: 800, height: 800, perspective: 1600 }}>
      <div style={{ width: 800, height: 800, borderRadius: "50%", transformOrigin: "100% 50%", transform: `rotateY(${-75 * open}deg)`, background: "radial-gradient(circle at 40% 35%, #9aa3ad, #5a6270 55%, #2a2e33)", boxShadow: "inset 0 0 0 30px #4a5058, inset 0 0 0 40px #8a9096" }}>
        {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...at(400 + Math.cos(i * 0.785) * 300 - 22, 400 + Math.sin(i * 0.785) * 300 - 22), width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#eee,#666)" }} />)}
        <div style={{ ...at(0, 180), width: 800, textAlign: "center", fontWeight: 900, fontSize: 110, color: "#e8e4da", textShadow: "0 4px 0 #2a2e33" }}>PARÍS</div>
        <div style={{ ...at(370, 470), width: 60, height: 110, borderRadius: "30px 30px 6px 6px", background: "#111" }} />
      </div>
    </div>
    {open < 0.3 && <div style={{ ...at(lerp(1700, 880, ins), 470 + 50), transformOrigin: "0 50%", transform: `rotate(${90 * rot}deg) scale(1.3)`, opacity: 1 - open * 3 }}>
      <svg width={520} height={120} style={{ overflow: "visible" }}><rect x={0} y={44} width={360} height={30} fill="#5a5048" /><rect x={20} y={74} width={30} height={40} fill="#5a5048" /><rect x={70} y={74} width={24} height={28} fill="#5a5048" />
        <circle cx={430} cy={58} r={80} fill="none" stroke="#5a5048" strokeWidth={34} /><circle cx={430} cy={58} r={80} fill="none" stroke="#8a8078" strokeWidth={8} /></svg></div>}
    <Num tt={tt} d={0.2} x={960} y={110} txt="LA LLAVE, EN PARÍS" size={90} col={AMB} />
  </>;
}}</Stage>;

// 12:24 · EL ORO: los lingotes salen de a uno del banco de HAITÍ, vuelan en arco con estela y entran en la bóveda de NUEVA YORK, que se abre; el contador sube
const Ingot: React.FC<{ w: number }> = ({ w }) => <div style={{ width: w, height: w * 0.42, background: `linear-gradient(180deg,#fff1b8,${GOLD} 40%,#8a6414)`, clipPath: "polygon(12% 0,88% 0,100% 100%,0 100%)", boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} />;
const XGoldBars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = W(h), N = 8, step = (w - 1.6) / N, door = eio(tt, 0.2, 0.9), k = LIN(tt, h, 0.4);
  const Bld = ({ x, lab, open }: { x: number; lab: string; open: number }) => <div style={{ ...at(x, 420) }}>
    <svg width={460} height={520}><path d="M0 100 L230 0 L460 100 Z" fill="#d6cfbd" />{[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 110} y={110} width={50} height={330} fill="#e8e2d2" />)}<rect x={0} y={440} width={460} height={80} fill="#b9b3a5" />
      <rect x={160} y={260} width={140} height={180} fill="#1a1a1a" /><rect x={160} y={260} width={140 * (1 - open)} height={180} fill="#6a7280" /></svg>
    <div style={{ ...at(0, 540), width: 460, textAlign: "center", fontWeight: 900, fontSize: 54, color: TX, textShadow: "0 4px 14px #000" }}>{lab}</div></div>;
  return <>
    <Floor x={960} y={960} w={1700} />
    <Bld x={80} lab="HAITÍ" open={1} /><Bld x={1380} lab="NUEVA YORK" open={door} />
    {Array.from({ length: N }, (_, i) => { const f = eio(tt, 0.6 + i * step, 0.6 + i * step + 1.0); if (f <= 0 || f >= 1) return null;
      const x = lerp(260, 1560, f), y = 720 - Math.sin(Math.PI * f) * 460;
      return <div key={i}><div style={{ ...at(x - 160, y + 10), width: 160, height: 14, borderRadius: 7, background: "linear-gradient(90deg,transparent,rgba(255,220,120,.6))" }} /><div style={{ ...at(x, y), transform: `rotate(${lerp(-20, 20, f)}deg)` }}><Ingot w={130} /></div></div>; })}
    <Num tt={tt} d={0.2} x={960} y={150} txt={`US$ ${Math.round(500 * k)}.000`.replace("US$ 0.000", "US$ 0")} size={110} col={AMB} />
  </>;
}}</Stage>;

// 12:54 · DIECINUEVE AÑOS: pared de piedra de un calabozo; un trozo de carbón raspa palitos de a uno, en grupos de cinco, hasta 19
const XTallyMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = LIN(tt, h, 0.3), n = k * 19, cur = Math.min(18, Math.floor(n)), f = n - cur;
  const pos = (i: number) => { const g = Math.floor(i / 5), j = i % 5; return { x: 380 + g * 300 + (j < 4 ? j * 50 : 0), y: 420, diag: j === 4, gx: 380 + g * 300 }; };
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, background: "repeating-linear-gradient(0deg, transparent 0 118px, rgba(0,0,0,.35) 118px 124px), repeating-linear-gradient(90deg, transparent 0 236px, rgba(0,0,0,.3) 236px 242px), radial-gradient(ellipse at 50% 45%, #8a8070, #4a4238 80%)" }} />
    {Array.from({ length: cur + 1 }, (_, i) => { const p = pos(i), g = i === cur ? cl(f * 1.2) : 1; return p.diag
      ? <div key={i} style={{ ...at(p.gx - 20, p.y + 120), width: 240 * g, height: 18, background: "#1a1814", transform: "rotate(-34deg)", transformOrigin: "0 50%", borderRadius: 9 }} />
      : <div key={i} style={{ ...at(p.x, p.y), width: 18, height: 280 * g, background: "#1a1814", borderRadius: 9, transform: `rotate(${(i * 7) % 5 - 2}deg)` }} />; })}
    {(() => { const p = pos(cur), g = cl(f * 1.2); return <div style={{ ...at(p.diag ? p.gx - 20 + 200 * g : p.x - 10, p.diag ? p.y + 120 - 140 * g : p.y + 280 * g - 40), width: 50, height: 70, borderRadius: 14, background: "linear-gradient(135deg,#3a3630,#0e0c0a)", transform: "rotate(25deg)", boxShadow: "0 8px 14px rgba(0,0,0,.6)" }} />; })()}
    <Num tt={tt} d={0.2} x={960} y={180} txt={pl(Math.max(1, Math.round(n)), "AÑO", "AÑOS")} size={120} col={n > 18.5 ? AMB : TX} />
  </>;
}}</Stage>;

// 13:27 · SEIS GENERACIONES: seis marcos ovalados en la pared con siluetas de épocas distintas (sombrero de tres picos, galera, bombín, sombrero de ala, gorra, cabeza descubierta); una moneda pasa de marco en marco
const Hat: React.FC<{ i: number }> = ({ i }) => <svg width={180} height={120} viewBox="0 0 180 120">{[
  <path key={0} d="M20 90 L90 30 L160 90 Q90 70 20 90 Z" fill="#1a1612" />, <g key={1}><rect x={55} y={10} width={70} height={80} fill="#1a1612" /><rect x={30} y={84} width={120} height={14} fill="#1a1612" /></g>,
  <g key={2}><path d="M50 90 Q50 30 90 30 Q130 30 130 90 Z" fill="#1a1612" /><rect x={36} y={86} width={108} height={12} fill="#1a1612" /></g>, <g key={3}><path d="M55 90 L65 40 Q90 30 115 40 L125 90 Z" fill="#1a1612" /><ellipse cx={90} cy={92} rx={78} ry={12} fill="#1a1612" /></g>,
  <g key={4}><path d="M50 92 Q50 50 90 50 Q130 50 130 92 Z" fill="#1a1612" /><path d="M120 86 L170 96 L120 98 Z" fill="#1a1612" /></g>, <g key={5} />][i]}</svg>;
const XGenerations: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.5), cp = k * 5, ci = Math.floor(cp), cf = cp - ci, X = (i: number) => 230 + i * 292;
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, background: "repeating-linear-gradient(90deg,#5a4a3a 0 60px,#523f30 60px 120px)" }} />
    {Array.from({ length: 6 }, (_, i) => { const d = phys(tt, 0.2 + i * 0.25, 7, 0.45); return d > 0.01 ? <div key={i} style={{ ...at(X(i) - 120, 380 - (1 - Math.min(1, d)) * 120), opacity: cl(d * 3) }}>
      <div style={{ width: 240, height: 320, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, ${["#e8d8b8", "#e0d0b0", "#d8c8a8", "#d0c0a0", "#c8b898", "#c0b090"][i]}, #8a7a5a)`, boxShadow: `inset 0 0 0 16px ${GOLD}, inset 0 0 0 22px #8a6414, 0 20px 30px rgba(0,0,0,.6)`, overflow: "hidden", position: "relative" }}>
        <div style={{ ...at(65, 130) }}><Person w={110} col="#2a2218" /></div><div style={{ ...at(30, 70) }}><Hat i={i} /></div></div>
      <div style={{ ...at(0, 330), width: 240, textAlign: "center", fontWeight: 900, fontSize: 44, color: TX, textShadow: "0 4px 12px #000" }}>{[1830, 1860, 1890, 1920, 1950, 1980][i]}</div></div> : null; })}
    {tt > 0.5 && <div style={{ ...at(lerp(X(ci), X(Math.min(5, ci + 1)), eio(cf, 0, 1)) - 40, 780 - Math.sin(Math.PI * cf) * 120) }}><Coin r={40} /></div>}
    <Num tt={tt} d={0.2} x={960} y={170} txt="6 GENERACIONES" size={110} col={AMB} />
  </>;
}}</Stage>;

// 14:00 · EL RANGO: una regla de vidrio grande de 0 a 120 mil millones; una pinza de bronce se abre con inercia de 21 a 115 y el tramo se llena de rojo
const XRangeBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.6), o = phys(tt, 0.6, 3.2, 0.55) * k / Math.max(0.001, k), hi = lerp(21, 115, Math.min(1.04, o * k)), X = (v: number) => 220 + (v / 120) * 1480;
  return <>
    <Floor x={960} y={760} w={1600} />
    <div style={{ ...at(200, 480), width: 1520, height: 150, borderRadius: 20, background: "linear-gradient(180deg, rgba(220,240,255,.35), rgba(220,240,255,.08))", border: "6px solid rgba(235,248,255,.8)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(X(21), 500), width: X(hi) - X(21), height: 110, borderRadius: 10, background: "linear-gradient(180deg,#ff6a5a,#b8261e)" }} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...at(X(i * 10) - 2, 630), width: 4, height: i % 2 ? 26 : 44, background: "#e8e4da" }} />)}
    {[0, 40, 80, 120].map((v) => <div key={v} style={{ ...at(X(v), 700), transform: "translateX(-50%)", fontWeight: 900, fontSize: 52, color: "#e8e4da" }}>{v}</div>)}
    {[21, hi].map((v, i) => <div key={i} style={{ ...at(X(v) - 30, 400) }}><div style={{ width: 60, height: 300, borderRadius: 14, background: `linear-gradient(90deg,#8a6414,${GOLD},#8a6414)`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
      <div style={{ ...at(30, -80), transform: "translateX(-50%)", fontWeight: 900, fontSize: 64, color: i ? RED : TX, whiteSpace: "nowrap" }}>{Math.round(v)}</div></div>)}
    <Num tt={tt} d={0.2} x={960} y={150} txt="MIL MILLONES DE DÓLARES" size={84} col={AMB} />
  </>;
}}</Stage>;

// 14:37 · LA MOCHILA DE PIEDRAS: corredor de arcilla en la largada con una mochila; caen piedras adentro de a una y se encorva; al lado, un corredor liviano se va
const Runner: React.FC<{ bend: number; col: string; pack?: number; tt: number }> = ({ bend, col, pack, tt }) => <div style={{ position: "relative", width: 260, height: 460 }}>
  <div style={{ ...at(80, 140), width: 100, height: 200, borderRadius: 50, background: `radial-gradient(circle at 35% 30%, #fff, ${col})`, transformOrigin: "50% 100%", transform: `rotate(${bend * 40}deg)` }}>
    <div style={{ ...at(10, -90), width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${col})` }} />
    {pack !== undefined && <div style={{ ...at(-70, 10), width: 110, height: 130 + pack * 50, borderRadius: 24, background: "linear-gradient(90deg,#5a3a20,#8a5a34)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}>{Array.from({ length: Math.floor(pack * 6) }, (_, i) => <div key={i} style={{ ...at(10 + (i % 2) * 44, 10 + Math.floor(i / 2) * 40), width: 46, height: 36, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%,#c9c2b0,#6a655a)" }} />)}</div>}</div>
  {[0, 1].map((j) => <div key={j} style={{ ...at(100 + j * 30, 330), width: 34, height: 130, borderRadius: 17, background: `radial-gradient(circle at 35% 30%, #fff, ${col})`, transformOrigin: "50% 0", transform: `rotate(${Math.sin(tt * (pack !== undefined ? 3 : 10) + j * 3) * (pack !== undefined ? 8 : 30)}deg)` }} />)}
</div>;
const XBackpack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.4), run = eio(tt, 0.6, W(h) - 0.45);
  return <>
    <div style={{ ...at(0, 900), width: 1920, height: 180, background: "linear-gradient(180deg,#b8442a,#7a2a18)" }} />
    <div style={{ ...at(400, 880), width: 20, height: 200, background: "#f4f1ea", transform: "skewX(-20deg)" }} />
    <div style={{ ...at(lerp(560, 1560, run), 460) }}><Runner bend={0.15} col="#c9d4e0" tt={tt} /></div>
    <div style={{ ...at(320 + 60 * k, 460 + 20 * k) }}><Runner bend={0.1 + 0.5 * k} col="#e8dcc6" pack={k} tt={tt} /></div>
    {k < 0.98 && <div style={{ ...at(320 + 60 * k - 10, 200 + ((tt * 1.6) % 1) * 300), width: 50, height: 40, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%,#c9c2b0,#6a655a)" }} />}
    <div style={{ ...at(420, 340), fontWeight: 900, fontSize: 54, color: "#1a3a8a", padding: "6px 20px", background: "#f1ead9", borderRadius: 10, opacity: cl(tt * 2) }}>HAITÍ</div>
    <Num tt={tt} d={0.2} x={960} y={150} txt="UNA MOCHILA DE PIEDRAS" size={96} col={AMB} />
  </>;
}}</Stage>;

// 14:50 · EL CAMINO DEL GRANO (pasos): un grano de café enorme al centro con su etiqueta de precio colgando; en cada paso dicho la etiqueta se achica
const XBeanPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st: [number, string][] = said.length >= 3 ? said : [[h.at + 0.3, "LA COSECHA, A MANO"], [h.at + 2.0, "A LOMO DE BURRO"], [h.at + 3.7, "LE PAGAN POCO"]];
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1), sc = 1 - 0.27 * (cur + (cur >= 0 ? eio(t, st[Math.max(0, cur)][0], st[Math.max(0, cur)][0] + 0.8) : 0)) - 0.0, tt = t - h.at;
  return <>
    <Floor x={860} y={960} w={900} />
    <div style={{ ...at(560, 380 + 10 * Math.sin(tt * 1.4)), width: 560, height: 560, borderRadius: "50%", transform: "scaleX(.78) rotate(-20deg)", background: "radial-gradient(circle at 35% 30%, #a8643a, #6a3a1a 55%, #3a1e0e)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(270, 40), width: 24, height: 480, borderRadius: 12, background: "#2a140a", transform: "rotate(8deg)" }} /></div>
    <svg width={400} height={400} style={at(1100, 360)}><path d="M0 120 Q100 40 200 80" stroke="#d8d2c2" strokeWidth={5} fill="none" /></svg>
    <div style={{ ...at(1300, 440), transform: `scale(${Math.max(0.2, sc)}) rotate(${6 * Math.sin(tt * 1.8)}deg)`, transformOrigin: "0 0" }}>
      <div style={{ width: 300, height: 180, borderRadius: "16px 60px 60px 16px", background: "linear-gradient(135deg,#f6f0e0,#d8ccb0)", boxShadow: "0 14px 24px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120, color: "#2f7a3a" }}>$</div></div>
    {cur >= 0 && <div key={cur} style={{ ...at(960, 150), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 84, color: cur === st.length - 1 ? RED : TX, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{st[cur][1]}</div>}
  </>;
}}</Stage>;

// 16:26 · EL MAR DOS VECES: globo terráqueo grande que gira; un velero cruza en arco hacia Europa con el saco de café y otro vuelve con la bolsa de monedas
const XOcean2x: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), a = eio(tt, 0.3, w * 0.5), b = eio(tt, w * 0.5, w - 0.45), R = 380, cx = 960, cy = 600;
  const arc = (f: number, up: boolean): [number, number] => [lerp(cx - 260, cx + 220, up ? f : 1 - f), cy - (up ? 120 : -60) - Math.sin(Math.PI * f) * 160];
  const Boat = ({ f, up, load }: { f: number; up: boolean; load: React.ReactNode }) => { const [x, y] = arc(f, up); return f > 0 && f < 1 ? <div style={{ ...at(x - 70, y - 90), transform: `scaleX(${up ? 1 : -1})` }}><svg width={140} height={110}><path d="M10 70 L130 70 L112 100 L26 100 Z" fill="#5a3a20" /><line x1={70} y1={70} x2={70} y2={6} stroke="#3a2614" strokeWidth={4} /><path d="M72 10 Q110 40 72 66 Z" fill="#f2ecdc" /></svg><div style={{ ...at(20, 30) }}>{load}</div></div> : null; };
  return <>
    <Floor x={960} y={1000} w={800} />
    <div style={{ ...at(cx - R, cy - R), width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #4a9ac8, #1a5a8a 60%, #0a2a4a)", boxShadow: "inset -40px -30px 80px rgba(0,0,0,.6), 0 30px 60px rgba(0,0,0,.5)" }}>
      {[[0, 120, 260, 300], [380, 80, 300, 220], [600, 380, 240, 260], [-200, 420, 260, 240]].map(([x, y, ww, hh], i) => <div key={i} style={{ ...at(((x + tt * 40) % 1000) - 100, y), width: ww, height: hh, borderRadius: "40% 60% 50% 50%", background: "radial-gradient(circle at 40% 35%, #8ab86a, #4a7a3a)" }} />)}</div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d={Array.from({ length: 30 }, (_, i) => { const [x, y] = arc(i / 29, true); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ")} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={6} strokeDasharray="16 12" />
      <path d={Array.from({ length: 30 }, (_, i) => { const [x, y] = arc(i / 29, false); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ")} fill="none" stroke="rgba(233,185,73,.8)" strokeWidth={6} strokeDasharray="16 12" opacity={b > 0 ? 1 : 0} /></svg>
    <Boat f={a} up load={<div style={{ width: 50, height: 40, borderRadius: 10, background: "#c9a670" }} />} />
    <Boat f={b} up={false} load={<Coin r={22} />} />
    <Num tt={tt} d={0.2} x={960} y={110} txt="CRUZÓ EL MAR DOS VECES" size={90} col={ICE} />
  </>;
}}</Stage>;

// 16:45 · MÁS DE LA MITAD: un sobre de sueldo grande abierto con un fajo; una pinza baja, saca más de la mitad y se lo lleva; el sobre queda flaco
const XPayslip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), grab = eio(tt, 0.4, w * 0.45), pull = eio(tt, w * 0.45, w - 0.45), N = 14, taken = 8;
  return <>
    <Floor x={960} y={960} w={1100} />
    <div style={{ ...at(560, 520), width: 800, height: 420, background: "linear-gradient(160deg,#e8d8b0,#c9b48a)", borderRadius: 14, boxShadow: "0 30px 50px rgba(0,0,0,.55)" }} />
    {Array.from({ length: N }, (_, i) => { const up = i >= N - taken ? pull : 0; return <div key={i} style={{ ...at(640, 470 - i * 14 - up * 400 + (i >= N - taken ? 0 : 0)), opacity: 1 - cl((up - 0.85) * 6) }}><Bill w={640} /></div>; })}
    <div style={{ ...at(560, 600), width: 800, height: 340, background: "linear-gradient(160deg,#f0e2bc,#d6c296)", borderRadius: "0 0 14px 14px", clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)", boxShadow: "inset 0 10px 0 rgba(255,255,255,.2)" }} />
    <div style={{ ...at(940, lerp(-200, 470 - (N - taken) * 14 - 240, grab) - pull * 400) }}>
      <div style={{ width: 40, height: 400, background: "linear-gradient(90deg,#6a7076,#d0d4d8,#5a5e62)" }} />
      <div style={{ ...at(-60, 380), width: 160, height: 40, background: "#5a5e62", borderRadius: 10 }} />
      <div style={{ ...at(-60, 400), width: 20, height: 80, background: "#5a5e62", transform: `rotate(${20 - 20 * grab}deg)` }} /><div style={{ ...at(80, 400), width: 20, height: 80, background: "#5a5e62", transform: `rotate(${-20 + 20 * grab}deg)` }} /></div>
    <Num tt={tt} d={0.2} x={480} y={240} txt="A LAS DEUDAS" size={80} col={RED} />
  </>;
}}</Stage>;

// 17:49 · LA SOPA JOUMOU: olla de hierro grande con un zapallo naranja adentro y vapor que no para; al costado se arranca la hoja del almanaque y aparece 1 DE ENERO
const XSoup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tear = eio(tt, 0.5, 1.6), k = LIN(tt, h, 0.3);
  return <>
    <div style={{ ...at(0, 880), width: 1920, height: 200, background: "linear-gradient(180deg,#5a4634,#2a1e14)" }} />
    <Floor x={1120} y={900} w={900} o={0.8} />
    {Array.from({ length: 8 }, (_, i) => { const p = (tt * 0.35 + i / 8) % 1; return <div key={i} style={{ ...at(900 + (i % 4) * 110 + Math.sin(p * 6 + i) * 40, 420 - p * 360), width: 120 + p * 80, height: 120 + p * 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.35), transparent 70%)", opacity: Math.sin(Math.PI * p) }} />; })}
    <div style={{ ...at(780, 430), width: 680, height: 440, borderRadius: "40px 40px 220px 220px", background: "radial-gradient(ellipse at 35% 30%, #5a5e62, #2a2c2e 60%, #111)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(780, 400), width: 680, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, #e8902a 50%, #a8541a 80%, #2a2c2e 82%)" }} />
    <div style={{ ...at(1000, 330 + 6 * Math.sin(tt * 1.5)), width: 240, height: 170, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffb05a, #e8701a 55%, #a8440a)", boxShadow: "inset 0 0 0 4px rgba(120,50,0,.4)" }}><div style={{ ...at(108, -30), width: 24, height: 44, background: "#4a6a2a", borderRadius: 8 }} /></div>
    {[-1, 1].map((s) => <div key={s} style={{ ...at(s < 0 ? 730 : 1410, 470), width: 100, height: 40, borderRadius: 20, border: "12px solid #2a2c2e" }} />)}
    <div style={{ ...at(220, 360), width: 400, height: 460, borderRadius: 14, background: "#f4efe4", boxShadow: "0 20px 40px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ height: 100, background: "#1a3a8a", color: "#fff", fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "100px" }}>ENERO</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 250, color: INK, lineHeight: "330px" }}>1</div>
      <div style={{ ...at(0, 100), width: 400, height: 360, background: "#f4efe4", transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${-110 * tear}deg)`, opacity: 1 - cl((tear - 0.8) * 5), textAlign: "center", fontWeight: 900, fontSize: 250, color: INK, lineHeight: "330px" }}>31</div>
    </div>
    <div style={{ display: "none" }}>{k}</div>
    <Num tt={tt} d={0.2} x={960} y={150} txt="SOPA DE LA LIBERTAD" size={96} col={AMB} />
  </>;
}}</Stage>;

// 18:29 · LA CIUDADELA: sobre la cima de la montaña sube una fortaleza de piedra con forma de proa; asoman los cañones de a uno; lo que llega por el aire es una carta lacrada
const XFortress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), rise = eio(tt, 0.3, w * 0.4), letter = eio(tt, w * 0.6, w - 0.45);
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M0 1080 L0 900 Q500 700 800 640 L1120 640 Q1420 700 1920 900 L1920 1080 Z" fill="#3a6a32" /><path d="M0 1080 L0 960 Q600 820 960 800 Q1320 820 1920 960 L1920 1080 Z" fill="#2a5a26" /></svg>
    <div style={{ ...at(460, 640 - 400 * rise), width: 1000, height: 400 * rise, overflow: "hidden" }}>
      <svg width={1000} height={400} style={at(0, 0)}><defs><linearGradient id="fw3" x1="0" x2="1"><stop offset="0" stopColor="#6a5a48" /><stop offset=".5" stopColor="#b8a68a" /><stop offset="1" stopColor="#5a4a38" /></linearGradient></defs>
        <path d="M0 400 L0 120 L700 60 L1000 200 L1000 400 Z" fill="url(#fw3)" />{Array.from({ length: 11 }, (_, i) => <rect key={i} x={i * 66} y={100 - i * 5.4 - 30} width={40} height={40} fill="#8a7a62" />)}
        {Array.from({ length: 6 }, (_, j) => <g key={j}>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 34 + (j % 2) * 17} y={160 + j * 40} width={32} height={38} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={2} />)}</g>)}</svg>
      {Array.from({ length: 5 }, (_, i) => { const c = eio(tt, w * 0.3 + i * 0.25, w * 0.3 + i * 0.25 + 0.4); return <div key={i} style={{ ...at(150 + i * 150, 200), width: 40 + 50 * c, height: 30, borderRadius: "0 15px 15px 0", background: "linear-gradient(180deg,#5a5e62,#1a1c1e)" }} />; })}
    </div>
    {letter > 0 && <div style={{ ...at(lerp(1700, 900, letter), lerp(160, 540, letter)), transform: `rotate(${lerp(30, -8, letter) + 6 * Math.sin(tt * 4) * (1 - letter)}deg)` }}>
      <div style={{ width: 280, height: 190, background: `linear-gradient(160deg,${PAPER},${PAPERD})`, borderRadius: 6, boxShadow: "0 16px 30px rgba(0,0,0,.6)", position: "relative" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ ...at(30, 40 + i * 34), width: 160, height: 6, background: "rgba(80,60,30,.4)" }} />)}
        <div style={{ ...at(200, 110), width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e8574a,#8a1a12)" }} /></div></div>}
    <Num tt={tt} d={0.2} x={960} y={150} txt={letter > 0.3 ? "Y LLEGÓ UN PAPEL" : "LA CIUDADELA"} size={100} col={letter > 0.3 ? RED : AMB} />
  </>;
}}</Stage>;

// 19:14 · LA CIFRA CON CENTAVOS: una hoja grande sale del carro de la máquina; la cifra completa se tipea de a un carácter; el sello cae abajo, sin tapar nada
const XTypewriter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), txt = "US$ 21.685.135.571,48", n = Math.floor(LIN(tt, h, 0.4) * txt.length * 1.0001), stamp = phys(tt, w - 1.2, 8, 0.4);
  return <>
    <Floor x={960} y={980} w={1500} />
    <div style={{ ...at(260, 200), width: 1400, height: 520, background: `linear-gradient(180deg,${PAPER},${PAPERD})`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      <div style={{ ...at(0, 140), width: 1400, textAlign: "center", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 104, color: INK, whiteSpace: "nowrap" }}>{txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></div>
      {stamp > 0.01 && <div style={{ ...at(700, 380), transform: `translate(-50%,-50%) rotate(-6deg) scale(${2 - Math.min(1, stamp)})`, opacity: cl(stamp * 3), border: "10px solid #c2261e", borderRadius: 14, padding: "4px 30px", fontWeight: 900, fontSize: 64, color: "#c2261e", whiteSpace: "nowrap" }}>FRANCIA DIJO QUE NO</div>}
    </div>
    <div style={{ ...at(200, 700), width: 1520, height: 280, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(180deg,#3a3d41,#1a1c1e)", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(-40, 10), width: 1600, height: 60, borderRadius: 30, background: "linear-gradient(180deg,#2a2c2e,#555,#1a1c1e)" }} />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 12 }, (_, c) => <div key={r + "_" + c} style={{ ...at(150 + c * 105 + r * 30, 110 + r * 52), width: 70, height: 42, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#eee,#999)", transform: `translateY(${(n + r * 5 + c) % 11 === 0 ? 6 : 0}px)` }} />))}
    </div>
  </>;
}}</Stage>;

// 20:12 · LOS PAPELES DISPERSOS: tres archivadores grandes (FRANCIA · EE. UU. · HAITÍ) abren su cajón con luz rasante; las hojas vuelan en arco a una sola pila al centro
const XDrawers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const N = ["FRANCIA", "EE. UU.", "HAITÍ"], X = [160, 760, 1360], k = LIN(tt, h, 0.8), pile = Math.floor(k * 24);
  return <>
    <div style={{ ...at(0, 900), width: 1920, height: 180, background: "linear-gradient(180deg,#3a3430,#1a1614)" }} />
    {X.map((x, i) => { const o = eio(tt, 0.2 + i * 0.25, 0.8 + i * 0.25); return <div key={i} style={{ ...at(x, 360) }}>
      <div style={{ ...at(100, -70), width: 200, textAlign: "center", fontWeight: 900, fontSize: 50, color: TX, textShadow: "0 4px 12px #000", whiteSpace: "nowrap" }}>{N[i]}</div>
      <Slab w={400} h={540} depth={30} side="#3a3d41" top="linear-gradient(135deg,#8a9096,#5a6068)">{[0, 1, 2].map((j) => <div key={j} style={{ ...at(30, 30 + j * 170), width: 340, height: 150, borderRadius: 8, background: "linear-gradient(180deg,#9aa0a6,#6a7076)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)" }}><div style={{ ...at(130, 60), width: 80, height: 22, borderRadius: 6, background: "#2a2c2e" }} /></div>)}</Slab>
      <div style={{ ...at(20, 30 + 40 * o), width: 360, height: 150, borderRadius: 8, background: "linear-gradient(180deg,#b9bfc6,#7a8086)", boxShadow: "0 20px 30px rgba(0,0,0,.6)" }}><div style={{ ...at(140, 60), width: 80, height: 22, borderRadius: 6, background: "#2a2c2e" }} /></div>
    </div>; })}
    {Array.from({ length: 12 }, (_, i) => { const src = i % 3, p = ((tt - 0.8) * 0.9 + i / 12) % 1; if (tt < 0.8) return null; const sx = X[src] + 200, x = lerp(sx, 960, p), y = 400 - Math.sin(Math.PI * p) * 260 + p * 380;
      return <div key={i} style={{ ...at(x - 80, y), width: 160, height: 110, background: PAPER, boxShadow: "0 8px 14px rgba(0,0,0,.4)", transform: `rotate(${(1 - p) * 40 * (src - 1)}deg)` }} />; })}
    {Array.from({ length: pile }, (_, i) => <div key={"p" + i} style={{ ...at(880 + ((i * 7) % 10) - 5, 860 - i * 9), width: 160, height: 30, background: i % 2 ? PAPER : PAPERD, boxShadow: "0 3px 4px rgba(0,0,0,.4)" }} />)}
  </>;
}}</Stage>;

// 21:09 · EL ÁRBOL DE NOMBRES: un tronco grueso de madera con su raíz; las ramas se funden de a pares mientras sube; arriba, la copa dice CITIGROUP
const XMergeTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = K(tt, h, 0.3), top = lerp(900, 330, k);
  return <>
    <Floor x={960} y={960} w={1200} />
    <svg width={1920} height={1080} style={at(0, 0)}><defs><linearGradient id="tr3" x1="0" x2="1"><stop offset="0" stopColor="#3a2614" /><stop offset=".45" stopColor="#8a5a34" /><stop offset="1" stopColor="#2a1a0e" /></linearGradient></defs>
      {[[-1, 0.15], [1, 0.3], [-1, 0.5], [1, 0.65]].map(([s, at0], i) => { const g = cl((k - at0) * 4), y0 = lerp(900, 330, at0 + 0.1); return <path key={i} d={`M960 ${y0} Q${960 + s * 260} ${y0 - 40} ${960 + s * 420} ${y0 + 140}`} fill="none" stroke="url(#tr3)" strokeWidth={60 * g + 1} strokeLinecap="round" opacity={g} />; })}
      <path d={`M880 960 Q900 ${top + 200} 930 ${top} L990 ${top} Q1020 ${top + 200} 1040 960 Z`} fill="url(#tr3)" />
      <path d="M880 960 Q760 980 700 1020 M1040 960 Q1160 980 1220 1020" stroke="#3a2614" strokeWidth={30} fill="none" strokeLinecap="round" /></svg>
    <div style={{ ...at(960 - 380, top - 230), width: 760, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse at 40% 35%, #6aa04a, #2f5a22 70%)", transform: `scale(${eio(k, 0.7, 1)})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 96, color: "#fff7ea", textShadow: "0 6px 16px #000" }}>CITIGROUP</div>
    <div style={{ ...at(960, 1000), transform: "translate(-50%,-50%)", padding: "8px 24px", background: "#f1ead9", borderRadius: 10, fontWeight: 900, fontSize: 40, color: INK, whiteSpace: "nowrap", opacity: cl(tt * 2) }}>NATIONAL CITY BANK</div>
  </>;
}}</Stage>;

export const HC3b: Record<string, React.FC<{ t: number; h: H }>> = { slices: XSlices, safekey: XSafeKey, goldbars: XGoldBars, tallymarks: XTallyMarks, generations: XGenerations,
  rangebar: XRangeBar, backpack: XBackpack, beanpath: XBeanPath, ocean2x: XOcean2x, payslip: XPayslip, soup: XSoup, fortress: XFortress, typewriter: XTypewriter, drawers: XDrawers, mergetree: XMergeTree };
