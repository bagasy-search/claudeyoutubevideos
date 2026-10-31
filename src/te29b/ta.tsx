// te29b · HAITÍ · 28 componentes únicos (uno por minuto). Cada uno es el OBJETO de la idea dentro del escenario Stage (foto real del momento atrás).
// Ninguno se repite en la tanda (registro D:/rtmp/te29_COMPONENTES.md). Sin rótulos arriba a la izquierda.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { HC2 } from "./ta2";
import { HC3 } from "./ta3";
import { HC3b } from "./ta3b";
import { HC4 } from "./ta4";

const GOLD = "#e9b949", GOLDD = "#a87a1c", PAPER = "#efe4c8", PAPERD = "#cdbb92", INK = "#2b2218", WOOD = "#6b4a2b", WOODD = "#3f2a17", COFFEE = "#4a2c17";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const soft = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.55)`;
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR");
// número grande que cae con peso
const Num: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 130 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", letterSpacing: -1, textShadow: "0 10px 0 rgba(0,0,0,.25), 0 22px 44px rgba(0,0,0,.7)" }}>{txt}</div>;
};
// sombra de contacto en el piso
const Floor: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.6 }) => <div style={{ ...at(x - w / 2, y - 20), width: w, height: 40, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o}), transparent 70%)`, filter: "blur(6px)" }} />;
// moneda/lingote dorado con volumen
const Coin: React.FC<{ r: number; txt?: string }> = ({ r, txt }) => <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff1b8, ${GOLD} 45%, ${GOLDD})`, boxShadow: `inset 0 0 0 ${r * 0.12}px rgba(120,80,10,.5), 0 ${r * 0.2}px ${r * 0.5}px rgba(0,0,0,.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: r * 0.8, color: "#7a5410" }}>{txt}</div>;
const Bar: React.FC<{ w?: number }> = ({ w = 180 }) => <div style={{ width: w, height: w * 0.36, clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, #fff3c4, ${GOLD} 40%, ${GOLDD})`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />;
// barco de guerra a vela, de perfil (casco oscuro, troneras, tres palos)
const Warship: React.FC<{ w: number; flag?: boolean }> = ({ w, flag = true }) => <svg width={w} height={w * 0.9} viewBox="0 0 200 180">
  {[60, 100, 140].map((x, i) => <g key={i}><line x1={x} y1={20 + i * 6} x2={x} y2={128} stroke="#3a2a1a" strokeWidth={4} /><path d={`M${x - 26} ${40 + i * 6} Q${x} ${32 + i * 6} ${x + 26} ${40 + i * 6} L${x + 22} ${100} Q${x} ${94} ${x - 22} ${100} Z`} fill="#e9e1cc" stroke="#b9ad8e" strokeWidth={2} /></g>)}
  {flag && <g><rect x={100} y={8} width={11} height={14} fill="#1f3f9a" /><rect x={111} y={8} width={11} height={14} fill="#f4f4f4" /><rect x={122} y={8} width={11} height={14} fill="#d42a2a" /></g>}
  <path d="M10 128 L190 128 L172 168 L30 168 Z" fill="#2b2118" />
  <rect x={26} y={136} width={150} height={8} fill="#c9a24f" />
  {Array.from({ length: 9 }, (_, i) => <rect key={i} x={34 + i * 16} y={148} width={8} height={7} fill="#0d0a07" />)}
</svg>;

// ---- 0:14 · LA FLOTA: catorce barcos de guerra entran a la bahía uno por uno y giran los cañones hacia la ciudad; contador 1→14 ----
export const TFleet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(14, Math.floor(eio(tt, 0.3, 3.6) * 14.99));
  return <>
    <div style={{ ...at(300, 600), width: 1500, height: 240, background: "linear-gradient(180deg, rgba(30,70,95,.0), rgba(18,52,74,.85) 40%, rgba(10,30,45,.95))", borderRadius: 30, filter: "blur(2px)" }} />
    {Array.from({ length: 14 }, (_, i) => {
      const s = phys(tt, 0.3 + i * 0.23, 6, 0.6); if (s <= 0.01) return null;
      const row = i % 2, x = 360 + (i >> 1) * 190 + row * 80, y = 470 + row * 120, bob = Math.sin(tt * 1.6 + i) * 4;
      return <div key={i} style={{ ...at(x, y + bob), transform: `translateX(${(1 - s) * 500}px) scale(${0.62 + row * 0.16})`, opacity: cl(s * 2), transformOrigin: "50% 100%" }}><Warship w={190} /></div>;
    })}
    <Num tt={tt} d={0.4} x={1560} y={300} txt={String(Math.max(1, n))} size={210} col={n >= 14 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={3.8} x={1560} y={440} txt="BARCOS DE GUERRA" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 0:38 · EL DECRETO: un pergamino lacrado se desenrolla y la cifra se escribe de a un dígito: 150.000.000 F ----
export const TDecree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const u = eio(tt, 0.2, 1.6), digits = "150.000.000", k = Math.floor(cl((tt - 1.5) / 2.2) * digits.length + 0.001), seal = phys(tt, 3.9, 7, 0.4);
  return <>
    <Floor x={1000} y={900} w={900} />
    <div style={{ ...at(560, 200), width: 880, height: 680 * u, overflow: "hidden", background: `linear-gradient(90deg, ${PAPERD}, ${PAPER} 12%, ${PAPER} 88%, ${PAPERD})`, boxShadow: soft(30), borderRadius: 6 }}>
      <div style={{ ...at(0, 60), width: 880, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 40, color: INK, letterSpacing: 6 }}>ORDONNANCE DU ROI</div>
      {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ ...at(110, 150 + i * 34), width: 660 - (i % 3) * 70, height: 6, borderRadius: 3, background: "rgba(43,34,24,.28)" }} />)}
      <div style={{ ...at(0, 420), width: 880, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 104, color: "#7a1a12", letterSpacing: 2 }}>{digits.slice(0, k)}<span style={{ opacity: k >= digits.length ? 1 : 0 }}> F</span></div>
    </div>
    {[0, 1].map((i) => <div key={i} style={{ ...at(540, i ? 180 + 680 * u : 172), width: 920, height: 38, borderRadius: 19, background: `linear-gradient(180deg, #e7d8b0, ${PAPERD} 60%, #9c8a62)`, boxShadow: "0 8px 18px rgba(0,0,0,.45)" }} />)}
    {seal > 0.01 && <div style={{ ...at(1300, 760), transform: `translate(-50%,-50%) scale(${1.6 - 0.6 * seal}) rotate(${-12 * seal}deg)`, opacity: cl(seal * 2), width: 150, height: 150, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)", boxShadow: "0 10px 26px rgba(0,0,0,.6), inset 0 0 0 10px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 64, color: "rgba(255,210,190,.7)", fontFamily: "Georgia, serif" }}>⚜</div>}
  </>;
}}</Stage>;

// ---- 0:54 · LA CINTA MÉTRICA: una cinta de metal se estira de 1825 a 1947 y frena en 122 AÑOS ----
export const TTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.6, 4.2), yrs = Math.round(122 * k), W = 1200 * k;
  return <>
    <Floor x={1000} y={720} w={1300} o={0.5} />
    <div style={{ ...at(380, 560), width: 190, height: 190, borderRadius: 34, background: "linear-gradient(145deg, #f2c21b, #c4930b)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.2), 0 20px 40px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(45, 45), width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, #555, #222)", transform: `rotate(${k * 900}deg)`, boxShadow: "inset 0 0 0 10px #333" }}><div style={{ ...at(46, 6), width: 8, height: 30, background: "#999" }} /></div>
    </div>
    <div style={{ ...at(560, 640), width: W, height: 62, background: "linear-gradient(180deg, #fff6c9, #f1d665 60%, #c9a92a)", boxShadow: "0 10px 20px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: 123 }, (_, i) => <div key={i} style={{ ...at(i * (1200 / 122), 0), width: 2, height: i % 10 === 0 ? 40 : 18, background: INK }} />)}
      {Array.from({ length: 13 }, (_, i) => <div key={"n" + i} style={{ ...at(i * (1200 / 12.2) + 6, 30), fontSize: 22, fontWeight: 800, color: INK }}>{1825 + i * 10}</div>)}
    </div>
    <div style={{ ...at(548 + W, 610), width: 22, height: 122, background: "linear-gradient(90deg, #8a8a8a, #ddd, #777)", borderRadius: 4 }} />
    <Num tt={tt} d={0.5} x={1180} y={420} txt={`${yrs} AÑOS`} size={150} col={k > 0.98 ? AMB : "#fff7ea"} />
    <Tag tt={tt} at={1.0} x={560} y={790} txt="1825" size={40} />
    <Tag tt={tt} at={4.1} x={1760} y={790} txt="1947" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 2:30 · LA TAZA DEL MUNDO: una taza gigante se llena de granos; la mitad que cae es de Saint-Domingue ----
export const TCupHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.3, 3.4);
  return <>
    <Floor x={1000} y={900} w={760} o={0.7} />
    <div style={{ ...at(640, 340), width: 720, height: 560, borderRadius: "0 0 260px 260px / 0 0 300px 300px", background: "linear-gradient(90deg, #cfc8bb, #fbf8f2 30%, #ede7dc 70%, #bdb4a6)", boxShadow: "inset 0 -30px 60px rgba(0,0,0,.15), 0 30px 60px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "50%", height: `${100 * k}%`, background: `radial-gradient(circle at 30% 30%, #6b3d1d 0 6px, transparent 7px) 0 0/34px 30px, ${COFFEE}` }} />
      <div style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: `${100 * k}%`, background: "radial-gradient(circle at 30% 30%, #8a6a4c 0 6px, transparent 7px) 0 0/34px 30px, #5e4a38", filter: "saturate(.4)" }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, background: "rgba(255,255,255,.6)", transform: "translateX(-3px)" }} />
    </div>
    <div style={{ ...at(1340, 440), width: 170, height: 230, borderRadius: "0 120px 120px 0", border: "34px solid #e9e2d6", borderLeft: "none", boxShadow: "8px 10px 20px rgba(0,0,0,.4)" }} />
    <div style={{ ...at(600, 330), width: 800, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, #fff, #d8d0c3)", boxShadow: "0 6px 12px rgba(0,0,0,.3)" }} />
    {Array.from({ length: 16 }, (_, i) => { const st = 0.2 + i * 0.18, f = cl((tt - st) / 0.7); if (f <= 0 || f >= 1) return null;
      return <div key={i} style={{ ...at(700 + (i * 53) % 300, 120 + f * 300), width: 26, height: 34, borderRadius: "50%", background: COFFEE, transform: `rotate(${i * 40 + f * 200}deg)`, boxShadow: "inset -4px 0 0 rgba(0,0,0,.3)" }} />; })}
    <Tag tt={tt} at={1.4} x={820} y={960} txt="SAINT-DOMINGUE" col={AMB} size={36} />
    <Tag tt={tt} at={2.0} x={1180} y={960} txt="EL RESTO DEL MUNDO" size={30} />
    <Num tt={tt} d={2.6} x={1000} y={210} txt="LA MITAD" size={110} col={AMB} />
  </>;
}}</Stage>;

// ---- 3:00 · MEDIO MILLÓN CONTRA 40.000: dos bandejas de una balanza de almacén: 500 granos contra 40 (cada uno = 1.000 personas) ----
export const TDotsRatio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = Math.floor(eio(tt, 0.4, 2.8) * 500), b = Math.floor(eio(tt, 2.6, 3.6) * 40);
  return <>
    <div style={{ ...at(420, 240), width: 760, height: 560, borderRadius: 24, background: "linear-gradient(160deg, #3a2a1e, #1d140d)", boxShadow: soft(30) }}>
      <svg width={760} height={560}>{Array.from({ length: a }, (_, i) => <circle key={i} cx={30 + (i % 25) * 29 + ((i / 25) | 0) % 2 * 8} cy={540 - ((i / 25) | 0) * 26} r={10} fill="#d8cdb6" opacity={0.92} />)}</svg>
    </div>
    <div style={{ ...at(1300, 600), width: 300, height: 200, borderRadius: 24, background: "linear-gradient(160deg, #3a2a1e, #1d140d)", boxShadow: soft(30) }}>
      <svg width={300} height={200}>{Array.from({ length: b }, (_, i) => <circle key={i} cx={30 + (i % 10) * 26} cy={180 - ((i / 10) | 0) * 26} r={10} fill="#e86b4f" />)}</svg>
    </div>
    <Num tt={tt} d={0.5} x={800} y={170} txt={fmt(a * 1000)} size={110} />
    <Num tt={tt} d={2.7} x={1450} y={520} txt={fmt(b * 1000)} size={84} col={RED} />
    <Tag tt={tt} at={1.2} x={800} y={860} txt="ESCLAVIZADOS" col={AMB} size={34} />
    <Tag tt={tt} at={3.0} x={1450} y={860} txt="COLONOS" size={34} />
  </>;
}}</Stage>;

// ---- 3:27 · EL FUEGO QUE SE EXTIENDE: un mapa en relieve de la colonia; una antorcha se prende en el norte y el fuego corre de pueblo en pueblo ----
const ISLA = "M120 200 C220 120 380 90 520 120 C600 60 700 80 760 140 C860 120 960 150 1000 220 C920 250 860 300 760 320 C640 380 520 360 420 400 C300 420 200 380 160 330 C110 290 90 240 120 200 Z";
const TOWNS = [[640, 130], [540, 170], [720, 200], [430, 210], [600, 260], [330, 280], [800, 270], [470, 320], [240, 300], [900, 220]];
export const TSpread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fl = (i: number) => cl((tt - 0.8 - i * 0.42) * 2.2);
  return <>
    <div style={{ ...at(420, 300), width: 1100, height: 520, transform: "perspective(1800px) rotateX(36deg)", transformOrigin: "50% 80%" }}>
      <svg width={1100} height={520} style={{ overflow: "visible" }}>
        <path d={ISLA} fill="#24170e" transform="translate(0 18)" />
        <path d={ISLA} fill="#5c7a3e" stroke="#c8b98a" strokeWidth={6} />
        {TOWNS.map(([x, y], i) => { const f = fl(i); return <g key={i}><circle cx={x} cy={y} r={14} fill="#e8dcc0" />{f > 0 && <circle cx={x} cy={y} r={20 + 70 * f} fill={`rgba(255,${140 - 60 * f},40,${0.55 * (1 - f * 0.5)})`} />}{f > 0 && <circle cx={x} cy={y} r={16} fill="#ffb347" />}</g>; })}
        {TOWNS.slice(1).map(([x, y], i) => { const [px, py] = TOWNS[i], f = fl(i + 1); return <line key={i} x1={px} y1={py} x2={lerp(px, x, f)} y2={lerp(py, y, f)} stroke="#ff8a3d" strokeWidth={5} strokeDasharray="10 8" opacity={0.8} />; })}
      </svg>
    </div>
    <Num tt={tt} d={0.3} x={980} y={200} txt="AGOSTO DE 1791" size={92} col={AMB} />
    <Tag tt={tt} at={1.4} x={1100} y={300} txt="EMPIEZA EN EL NORTE" size={32} />
  </>;
}}</Stage>;

// ---- 3:49 · LE GANAN A TODOS: cuatro estandartes enemigos caen como fichas de dominó, el último es el de Napoleón ----
const FOES: [string, string][] = [["PLANTADORES", "#6d6d6d"], ["ESPAÑA", "#c6262e"], ["INGLATERRA", "#20356e"], ["NAPOLEÓN", "#1f3f9a"]];
export const TDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Floor x={1000} y={860} w={1300} />
  {FOES.map(([n, c], i) => {
    const f = eio(tt, 1.2 + i * 1.1, 1.9 + i * 1.1), x = 470 + i * 300;
    return <div key={i} style={{ ...at(x, 280), width: 200, height: 560, transformOrigin: "100% 100%", transform: `rotate(${f * 78}deg)` }}>
      <div style={{ ...at(92, 0), width: 16, height: 560, background: "linear-gradient(90deg, #6b5233, #b08a55, #5a4229)", borderRadius: 4 }} />
      <div style={{ ...at(0, 40), width: 200, height: 260, background: `linear-gradient(160deg, ${c}, rgba(0,0,0,.45))`, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.2)" }} />
      <div style={{ ...at(100, 330), transform: "translateX(-50%)", whiteSpace: "nowrap", fontWeight: 900, fontSize: 30, color: TX, textShadow: "0 4px 14px #000", opacity: 1 - f }}>{n}</div>
    </div>;
  })}
  <Num tt={tt} d={5.6} x={1000} y={180} txt="13 AÑOS DE GUERRA" size={90} col={AMB} />
</>}</Stage>;

// ---- 4:24 · EL CARTEL QUE CAMBIA: un cartel de estación con letras que giran (split-flap) pasa de SAINT-DOMINGUE a HAITÍ ----
export const TSplitFlap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const A = "SAINT-DOMINGUE", B = "    HAITÍ     ", AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-";
  return <>
    <Floor x={1000} y={760} w={1200} />
    <div style={{ ...at(330, 380), width: 1340, height: 250, borderRadius: 20, background: "linear-gradient(180deg, #2a2a2e, #141416)", boxShadow: soft(30), padding: 30, display: "flex", gap: 10 }}>
      {[...A].map((c, i) => {
        const st = 0.8 + i * 0.09, k = cl((tt - st) / 1.2), fl = Math.floor(k * 8), ch = k >= 1 ? B[i] : fl === 0 ? c : AB[(i * 7 + fl * 3) % AB.length];
        const flip = k > 0 && k < 1 ? Math.sin(tt * 40 + i) * 0.5 + 0.5 : 0;
        return <div key={i} style={{ width: 82, height: 190, borderRadius: 8, background: "linear-gradient(180deg, #3a3a3f 49%, #111 50%, #2e2e33 51%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 120, color: k >= 1 && B[i] !== " " ? AMB : "#f1ece2", transform: `rotateX(${flip * 40}deg)`, boxShadow: "inset 0 0 0 2px rgba(0,0,0,.6)" }}>{ch}</div>;
      })}
    </div>
    <Tag tt={tt} at={2.6} x={1000} y={240} txt="1 DE ENERO DE 1804" col={AMB} size={64} />
  </>;
}}</Stage>;

// ---- 5:10 · LO AISLARON: la isla en el mar y un anillo de boyas que se cierra; los barcos mercantes llegan y dan la vuelta ----
export const TCordon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ring = eio(tt, 0.3, 2.4);
  return <>
    <div style={{ ...at(360, 220), width: 1280, height: 700, transform: "perspective(1800px) rotateX(42deg)", transformOrigin: "50% 70%", borderRadius: "50%", background: "radial-gradient(ellipse, #1d5a74, #0b2a3a 70%)", boxShadow: soft(40) }}>
      <svg width={1280} height={700} style={{ overflow: "visible" }}>
        <path d={ISLA} transform="translate(360 210) scale(.6)" fill="#5c7a3e" stroke="#c8b98a" strokeWidth={8} />
        {Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, show = i / 24 < ring; return show ? <g key={i}><circle cx={640 + Math.cos(a) * 470} cy={350 + Math.sin(a) * 260} r={13} fill={RED} /><line x1={640 + Math.cos(a) * 470} y1={350 + Math.sin(a) * 260} x2={640 + Math.cos(a + 0.26) * 470} y2={350 + Math.sin(a + 0.26) * 260} stroke={RED} strokeWidth={4} strokeDasharray="8 8" opacity={(i + 1) / 24 < ring ? 1 : 0} /></g> : null; })}
        {[0, 1, 2].map((i) => { const k = cl((tt - 1.8 - i * 0.9) / 1.8), a = -0.6 + i * 1.6, r = k < 0.5 ? lerp(640, 500, k * 2) : lerp(500, 660, (k - 0.5) * 2), ang = a + (k > 0.5 ? (k - 0.5) * 0.6 : 0);
          return k > 0 && k < 1 ? <g key={i} transform={`translate(${640 + Math.cos(ang) * r} ${350 + Math.sin(ang) * r * 0.55}) rotate(${(k > 0.5 ? 180 : 0) + ang * 57})`}><path d="M-34 -12 L30 -12 L44 0 L30 12 L-34 12 Z" fill="#e2d6b8" /></g> : null; })}
      </svg>
    </div>
    <Tag tt={tt} at={2.6} x={1000} y={960} txt="20 AÑOS SIN QUE NADIE LO RECONOZCA" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 6:24 · DIEZ AÑOS DE PRESUPUESTO: diez cofres de tesorería se alinean; cada uno = un año entero del Estado ----
export const TChests10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <Floor x={1000} y={830} w={1500} />
  {Array.from({ length: 10 }, (_, i) => {
    const s = phys(tt, 0.3 + i * 0.28, 7, 0.45); if (s <= 0.01) return null;
    const x = 330 + (i % 5) * 270, y = i < 5 ? 330 : 590;
    return <div key={i} style={{ ...at(x, y - (1 - s) * 260), opacity: cl(s * 2), width: 230, height: 170 }}>
      <div style={{ ...at(0, 50), width: 230, height: 120, borderRadius: 10, background: `linear-gradient(180deg, ${WOOD}, ${WOODD})`, boxShadow: "0 16px 30px rgba(0,0,0,.6), inset 0 0 0 6px rgba(0,0,0,.25)" }} />
      <div style={{ ...at(0, 0), width: 230, height: 60, borderRadius: "40px 40px 6px 6px", background: `linear-gradient(180deg, #8a6440, ${WOOD})`, boxShadow: "inset 0 0 0 6px rgba(0,0,0,.2)" }} />
      {[30, 190].map((bx) => <div key={bx} style={{ ...at(bx, 0), width: 14, height: 170, background: "linear-gradient(90deg, #8a7a52, #d6c48a, #7a6a42)" }} />)}
      <div style={{ ...at(95, 52), width: 40, height: 46, borderRadius: 6, background: GOLD, boxShadow: "0 4px 8px rgba(0,0,0,.5)", fontSize: 22, fontWeight: 900, color: "#6b4a10", textAlign: "center", lineHeight: "46px" }}>{i + 1}</div>
    </div>;
  })}
  <Num tt={tt} d={3.4} x={1000} y={180} txt="10 AÑOS DE TODO EL ESTADO" size={78} col={AMB} />
</>}</Stage>;

// ---- 7:06 · PRESTADO EN PARÍS PARA PAGARLE A PARÍS: dos cajas fuertes; las monedas salen de PARÍS, pasan por HAITÍ y vuelven, y en el camino se caen las comisiones ----
export const TLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const Box: React.FC<{ x: number; y: number; n: string; c: string }> = ({ x, y, n, c }) => <div style={{ ...at(x, y), width: 300, height: 300 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: `linear-gradient(145deg, #5a5d63, #2a2c30)`, boxShadow: "0 30px 50px rgba(0,0,0,.6), inset 0 0 0 10px rgba(255,255,255,.06)" }} />
    <div style={{ ...at(90, 90), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, #9aa0a8, #44474d)", boxShadow: "inset 0 0 0 10px #2a2c30" }} />
    <div style={{ ...at(150, 330), transform: "translateX(-50%)", fontWeight: 900, fontSize: 44, color: c, whiteSpace: "nowrap", textShadow: "0 4px 16px #000" }}>{n}</div>
  </div>;
  return <>
    <Box x={420} y={340} n="PARÍS" c={ICE} />
    <Box x={1260} y={340} n="HAITÍ" c={AMB} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M570 330 C700 120 1270 120 1410 330" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={5} strokeDasharray="12 10" /><path d="M1410 660 C1270 880 700 880 570 660" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={5} strokeDasharray="12 10" /></svg>
    {Array.from({ length: 8 }, (_, i) => {
      const k = (tt * 0.32 + i / 8) % 1, top = k < 0.5, u = top ? k * 2 : (k - 0.5) * 2;
      const x = top ? lerp(570, 1410, u) : lerp(1410, 570, u), y = top ? 330 - Math.sin(Math.PI * u) * 160 : 660 + Math.sin(Math.PI * u) * 160;
      const drop = i % 3 === 0 && top && u > 0.45 ? (u - 0.45) * 900 : 0;
      return tt > 0.6 ? <div key={i} style={{ ...at(x - 28, y - 28 + drop), opacity: drop > 300 ? 0 : 1 }}><Coin r={28} /></div> : null;
    })}
    <Tag tt={tt} at={2.4} x={990} y={190} txt="PRÉSTAMO" col={ICE} size={34} />
    <Tag tt={tt} at={3.4} x={990} y={880} txt="CUOTA + INTERESES" col={AMB} size={34} />
    <Tag tt={tt} at={4.6} x={990} y={540} txt="LAS COMISIONES SE QUEDAN EN EL CAMINO" col={RED} size={28} />
  </>;
}}</Stage>;

// ---- 9:51 · DE 150 A 90: una montaña de francos tallada en piedra; el cincel le baja la cima… pero el musgo de los intereses vuelve a crecer ----
export const TChisel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cut = eio(tt, 0.8, 2.6), moss = eio(tt, 3.2, 5.6), top = lerp(220, 420, cut), val = Math.round(lerp(150, 90, cut));
  return <>
    <Floor x={1000} y={860} w={1100} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d={`M440 860 L${740} ${top + 40} L${960} ${top} L${1180} ${top + 50} L1520 860 Z`} fill="url(#rk)" />
      <defs><linearGradient id="rk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b9b1a2" /><stop offset="1" stopColor="#5f594f" /></linearGradient></defs>
      {cut > 0 && cut < 1 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={900 + i * 18} cy={top - 20 - ((tt * 400 + i * 50) % 160)} r={6} fill="#d8d2c4" />)}
      <path d={`M${560} 860 L${740} ${top + 40} L${960} ${top} L${1180} ${top + 50} L${1400} 860`} fill="none" stroke="#4f8a3a" strokeWidth={30 * moss} strokeLinejoin="round" opacity={0.9} />
    </svg>
    <div style={{ ...at(1000, top - 60), transform: `translate(-20%,-100%) rotate(${-30 + 12 * Math.sin(tt * 18) * (cut > 0 && cut < 1 ? 1 : 0)}deg)`, width: 34, height: 220, background: "linear-gradient(90deg, #888, #e0e0e0, #777)", borderRadius: 6, opacity: 1 - eio(tt, 2.8, 3.2) }} />
    <Num tt={tt} d={0.3} x={960} y={160} txt={`${val} MILLONES`} size={96} col={cut > 0.98 ? GRN : "#fff7ea"} />
    <Tag tt={tt} at={3.4} x={1460} y={420} txt="+ INTERESES" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 10:22 · EL LIBRO MAYOR: un libro de contabilidad pasa páginas solo; cada página un año y un sello PAGADO; el total sube a 112 M ----
export const TLedgerFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 5.2), pg = Math.floor(k * 64), fl = (k * 64) % 1;
  return <>
    <Floor x={1000} y={880} w={1200} />
    <div style={{ ...at(380, 260), width: 1240, height: 600, perspective: 2200 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#4a2a17", transform: "translateY(18px)" }} />
      {[0, 1].map((p) => <div key={p} style={{ ...at(p * 620, 0), width: 620, height: 600, background: `linear-gradient(${p ? 90 : 270}deg, ${PAPER}, #e2d4b1)`, boxShadow: "inset 0 0 40px rgba(0,0,0,.12)" }}>
        {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...at(50, 70 + i * 38), width: 520, height: 2, background: "rgba(60,90,140,.25)" }} />)}
        <div style={{ ...at(60, 30), fontFamily: "Georgia, serif", fontSize: 34, color: INK }}>{1825 + pg * (p ? 1 : 1) + (p ? 1 : 0)}</div>
        {p === 1 && <div style={{ ...at(240, 300), transform: "rotate(-14deg)", border: "8px solid #a3271b", color: "#a3271b", fontWeight: 900, fontSize: 64, padding: "4px 20px", borderRadius: 10, opacity: 0.85 }}>PAGADO</div>}
      </div>)}
      <div style={{ ...at(620, 0), width: 620, height: 600, transformOrigin: "0 50%", transform: `rotateY(${-180 * fl}deg)`, background: `linear-gradient(90deg, #e8dcbd, ${PAPER})`, boxShadow: "0 0 30px rgba(0,0,0,.25)", backfaceVisibility: "hidden" }} />
    </div>
    <Num tt={tt} d={0.5} x={1000} y={170} txt={`${Math.round(112 * k)} MILLONES DE FRANCOS`} size={72} col={AMB} />
    <Tag tt={tt} at={1.0} x={1000} y={940} txt={`AÑO ${pg + 1} DE 64`} size={34} />
  </>;
}}</Stage>;

// ---- 11:12 · UNA FRACCIÓN: un pan de 36 millones se corta en rebanadas; manos de saco se llevan casi todas; a Haití le queda una ----
export const TSlices: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Floor x={1000} y={800} w={1300} />
  <div style={{ ...at(360, 690), width: 1280, height: 60, borderRadius: 30, background: `linear-gradient(180deg, #8a6440, ${WOODD})`, boxShadow: soft(20) }} />
  {Array.from({ length: 10 }, (_, i) => {
    const k = eio(tt, 1.2 + i * 0.32, 2.0 + i * 0.32), stays = i === 9;
    return <div key={i} style={{ ...at(420 + i * 118, 430 - (stays ? 0 : k * 700)), opacity: stays ? 1 : 1 - k * 0.8, width: 110, height: 260, borderRadius: "50px 50px 8px 8px", background: "radial-gradient(ellipse at 50% 30%, #f2dcae, #d9b678 70%)", boxShadow: "inset 0 0 0 10px #a36b2b, 0 10px 20px rgba(0,0,0,.4)", transform: `rotate(${stays ? 0 : -8 * k}deg)` }} />;
  })}
  <Num tt={tt} d={0.3} x={1000} y={200} txt="36 MILLONES" size={110} />
  <Tag tt={tt} at={4.6} x={1480} y={560} txt="A HAITÍ" col={AMB} size={40} />
  <Tag tt={tt} at={2.2} x={760} y={300} txt="COMISIONES · INTERESES · BANQUEROS" col={RED} size={28} />
</>}</Stage>;

// ---- 11:51 · LA LLAVE DE LA CAJA: una llave de hierro gigante cruza de la mano de HAITÍ a la cerradura de un tablero que dice PARÍS ----
export const TSafeKey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.6, 2.8), turn = eio(tt, 3.0, 3.8), door = eio(tt, 3.9, 5.0);
  return <>
    <Floor x={1300} y={900} w={700} />
    <div style={{ ...at(1060, 220), width: 520, height: 640, borderRadius: 26, background: "linear-gradient(145deg, #6b6e74, #2f3135)", boxShadow: soft(40) }}>
      <div style={{ position: "absolute", inset: 30, borderRadius: 18, background: "linear-gradient(145deg, #55585e, #26282c)", transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-70 * door}deg)`, boxShadow: "inset 0 0 0 6px rgba(255,255,255,.06)" }}>
        <div style={{ ...at(180, 230), width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, #cfd3d8, #7a7e84)", boxShadow: "inset 0 0 0 10px #44474c" }} />
        <div style={{ ...at(230, 40), transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: ICE, letterSpacing: 4 }}>PARÍS</div>
      </div>
      {door > 0.2 && Array.from({ length: 6 }, (_, i) => <div key={i} style={{ ...at(60 + (i % 3) * 120, 300 + ((i / 3) | 0) * 90), opacity: door }}><Bar w={110} /></div>)}
    </div>
    <svg width={520} height={140} style={{ ...at(lerp(280, 820, k), lerp(600, 480, k)), transform: `rotate(${90 * turn}deg)`, transformOrigin: "100% 50%", filter: "drop-shadow(0 14px 18px rgba(0,0,0,.6))" }}>
      <circle cx={70} cy={70} r={62} fill="none" stroke="#c9a24f" strokeWidth={20} /><rect x={120} y={58} width={360} height={24} rx={8} fill="#c9a24f" /><rect x={420} y={82} width={26} height={40} fill="#c9a24f" /><rect x={460} y={82} width={20} height={30} fill="#c9a24f" />
    </svg>
    <Tag tt={tt} at={0.8} x={420} y={760} txt="HAITÍ" col={AMB} size={40} />
    <Tag tt={tt} at={4.2} x={1320} y={950} txt="EL BANCO NACIONAL, MANEJADO DESDE AFUERA" col={RED} size={28} />
  </>;
}}</Stage>;

// ---- 12:24 · EL ORO: lingotes que salen del banco nacional, suben a un cajón y viajan en arco hasta una bóveda de NUEVA YORK; contador US$ 500.000 ----
export const TGoldBars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.floor(eio(tt, 0.3, 2.4) * 9), fly = eio(tt, 2.6, 4.8), x = lerp(520, 1420, fly), y = 560 - Math.sin(Math.PI * fly) * 300;
  return <>
    <Floor x={1000} y={860} w={1400} />
    <div style={{ ...at(1300, 380), width: 300, height: 420, borderRadius: "150px 150px 12px 12px", background: "linear-gradient(145deg, #3d4a5a, #1a222c)", boxShadow: soft(30), border: "8px solid #6c7a8a" }}>
      <div style={{ ...at(150, 60), transform: "translateX(-50%)", fontWeight: 900, fontSize: 34, color: ICE, whiteSpace: "nowrap" }}>NUEVA YORK</div>
    </div>
    <div style={{ ...at(x - 160, y), width: 320, height: 150, opacity: fly > 0.97 ? 0 : 1 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: `linear-gradient(180deg, #8a6440, ${WOODD})`, boxShadow: soft(20) }} />
      {Array.from({ length: n }, (_, i) => <div key={i} style={{ ...at(20 + (i % 3) * 96, -36 - ((i / 3) | 0) * 34) }}><Bar w={90} /></div>)}
    </div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M520 640 Q970 220 1420 560" fill="none" stroke="rgba(233,185,73,.4)" strokeWidth={5} strokeDasharray="14 12" /></svg>
    <Num tt={tt} d={0.4} x={940} y={170} txt={`US$ ${fmt(500000 * Math.min(1, n / 9))}`} size={104} col={GOLD} />
    <Tag tt={tt} at={1.0} x={520} y={900} txt="BANCO NACIONAL · PUERTO PRÍNCIPE" size={28} />
    <Tag tt={tt} at={4.8} x={1450} y={900} txt="DICIEMBRE DE 1914" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 12:54 · DIECINUEVE AÑOS: una pared de calabozo donde se tachan palitos de a cinco hasta 19 ----
export const TTallyMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.floor(eio(tt, 0.4, 4.2) * 19.99);
  return <>
    <div style={{ ...at(400, 240), width: 1200, height: 600, borderRadius: 12, background: "repeating-linear-gradient(0deg, #8d8577 0 70px, #6f685c 70px 74px), #8d8577", boxShadow: soft(30) }}>
      <svg width={1200} height={600}>{Array.from({ length: n }, (_, i) => { const g = (i / 5) | 0, j = i % 5, x0 = 90 + g * 270;
        return j < 4 ? <line key={i} x1={x0 + j * 44} y1={170} x2={x0 + j * 44 + 6} y2={430} stroke="#f2ede3" strokeWidth={14} strokeLinecap="round" /> : <line key={i} x1={x0 - 30} y1={380} x2={x0 + 170} y2={210} stroke="#f2ede3" strokeWidth={14} strokeLinecap="round" />; })}</svg>
    </div>
    <Num tt={tt} d={0.3} x={1000} y={160} txt={`${Math.max(1, n)} AÑOS`} size={130} col={n >= 19 ? AMB : "#fff7ea"} />
    <Tag tt={tt} at={1.0} x={1000} y={920} txt="OCUPACIÓN DE ESTADOS UNIDOS · 1915-1934" size={32} />
  </>;
}}</Stage>;

// ---- 13:27 · SEIS GENERACIONES: seis retratos ovalados en la pared; una moneda pasa de mano en mano, de retrato en retrato ----
export const TGenerations: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = cl((tt - 1.0) / 4.4) * 5;
  return <>
    {Array.from({ length: 6 }, (_, i) => { const s = phys(tt, 0.2 + i * 0.16, 7, 0.5); const x = 300 + i * 240, y = 360 + (i % 2) * 70;
      return <div key={i} style={{ ...at(x, y), width: 200, height: 260, transform: `scale(${s})`, opacity: cl(s * 2), borderRadius: "50%", background: "linear-gradient(145deg, #d6b25a, #8a6420)", padding: 14, boxShadow: soft(20) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(ellipse at 50% 34%, #3a2a20 0 22%, transparent 23%), radial-gradient(ellipse at 50% 92%, #3a2a20 0 46%, transparent 47%), linear-gradient(180deg, #c9b48c, #8f7a55)`, filter: `sepia(${0.7 - i * 0.1})` }} />
        <div style={{ ...at(100, 290), transform: "translateX(-50%)", fontWeight: 900, fontSize: 28, color: TX, whiteSpace: "nowrap", textShadow: "0 4px 12px #000" }}>{["1825", "1850", "1875", "1900", "1925", "1947"][i]}</div>
      </div>; })}
    {tt > 1 && <div style={{ ...at(lerp(330, 1530, k / 5) + 40, 330 - Math.abs(Math.sin(k * Math.PI)) * 90) }}><Coin r={34} txt="F" /></div>}
    <Num tt={tt} d={0.3} x={1000} y={200} txt="6 GENERACIONES PAGANDO" size={84} col={AMB} />
  </>;
}}</Stage>;

// ---- 14:00 · EL RANGO: una regla de vidrio de 0 a 120 mil millones; una pinza se abre de 21 a 115 y el tramo se llena de rojo ----
export const TRangeBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = eio(tt, 0.5, 1.6), b = eio(tt, 1.8, 3.6), L = 360, W = 1240, x1 = L + W * (21 / 120), x2 = L + W * (lerp(21, 115, b) / 120);
  return <>
    <Floor x={1000} y={700} w={1400} />
    <div style={{ ...at(L, 520), width: W, height: 110, borderRadius: 55, background: "linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,.08))", border: "3px solid rgba(255,255,255,.35)", boxShadow: "0 20px 40px rgba(0,0,0,.5), inset 0 8px 20px rgba(255,255,255,.15)" }} />
    <div style={{ ...at(x1, 530), width: Math.max(0, x2 - x1) * a, height: 90, borderRadius: 45, background: `linear-gradient(180deg, #ff8a70, ${RED})`, boxShadow: `0 0 40px rgba(255,74,61,.5)` }} />
    {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...at(L + (W / 12) * i - 20, 650), width: 40, textAlign: "center", fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,.65)" }}>{i * 10}</div>)}
    {[x1, x2].map((x, i) => <div key={i} style={{ ...at(x - 8, 470), width: 16, height: 210, borderRadius: 8, background: "linear-gradient(90deg, #ddd, #fff, #aaa)", opacity: a, boxShadow: "0 6px 12px rgba(0,0,0,.5)" }} />)}
    <Num tt={tt} d={0.6} x={x1} y={380} txt="21" size={110} />
    <Num tt={tt} d={3.2} x={x2} y={380} txt="115" size={110} col={RED} />
    <Tag tt={tt} at={1.2} x={1000} y={790} txt="MIL MILLONES DE DÓLARES DE HOY · ESTIMACIÓN" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 14:37 · LA MOCHILA DE PIEDRAS: línea de largada; un corredor con una mochila que se llena de piedras se hunde un poco; los demás livianos ----
export const TBackpack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.floor(eio(tt, 0.6, 3.2) * 9), sink = n * 4;
  const Runner: React.FC<{ x: number; heavy?: boolean }> = ({ x, heavy }) => <svg width={220} height={420} style={at(x, 380 + (heavy ? sink : 0))}>
    <circle cx={110} cy={60} r={40} fill={heavy ? "#e8dcc6" : "#a59d8e"} />
    <path d="M110 100 L110 260 M110 140 L60 210 M110 140 L160 200 M110 260 L70 380 M110 260 L150 380" stroke={heavy ? "#e8dcc6" : "#a59d8e"} strokeWidth={22} strokeLinecap="round" fill="none" />
    {heavy && <g><rect x={20} y={110} width={90} height={130} rx={24} fill="#5a4630" stroke="#2d2318" strokeWidth={5} />{Array.from({ length: n }, (_, i) => <circle key={i} cx={40 + (i % 3) * 25} cy={225 - ((i / 3) | 0) * 32} r={14} fill="#8a857a" stroke="#555" strokeWidth={3} />)}</g>}
  </svg>;
  return <>
    <div style={{ ...at(300, 800), width: 1400, height: 14, background: "repeating-linear-gradient(90deg, #f2f2f2 0 40px, #222 40px 80px)" }} />
    <Floor x={1000} y={812} w={1400} o={0.4} />
    <Runner x={420} /><Runner x={720} /><Runner x={1020} heavy /><Runner x={1320} />
    <Tag tt={tt} at={1.4} x={1130} y={340} txt="HAITÍ" col={AMB} size={40} />
    <Num tt={tt} d={3.0} x={1000} y={200} txt="ARRANCA CON PIEDRAS" size={86} />
  </>;
}}</Stage>;

// ---- 14:50 · EL CAMINO DEL GRANO (pasos 1-3): un grano de café baja de la montaña al pueblo; en cada paso pierde valor (su precio se achica) ----
export const TBeanPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  // el tramo del café queda entre dos ventanas de avatar (~5 s): si los pasos dichos caen afuera, se cuentan los tres seguidos
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st: [number, string][] = said.length >= 3 ? said : [[h.at + 0.3, "LA COSECHA, A MANO"], [h.at + 1.9, "A LOMO DE BURRO"], [h.at + 3.4, "LE PAGAN POCO"]];
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1);
  const prog = cur < 0 ? 0 : (cur + cl((t - st[cur][0]) / 1.5)) / 3;
  const PTS = [[460, 300], [700, 470], [980, 560], [1300, 640], [1560, 700]];
  const seg = prog * (PTS.length - 1), i0 = Math.min(PTS.length - 2, Math.floor(seg)), f = seg - i0;
  const bx = lerp(PTS[i0][0], PTS[i0 + 1][0], f), by = lerp(PTS[i0][1], PTS[i0 + 1][1], f);
  const price = [100, 100, 60, 35][Math.max(0, cur + 1)] ?? 35;
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M260 860 L520 220 L640 360 L760 260 L980 860 Z" fill="#3d5a2c" /><path d="M520 220 L560 300 L600 260 L640 360 L560 340 Z" fill="#6c8a4a" />
      <path d="M940 860 L1100 640 L1260 860 Z" fill="#54442f" /><rect x={1360} y={600} width={260} height={180} fill="#6d5a40" /><path d="M1340 610 L1490 520 L1640 610 Z" fill="#8a3a2a" />
      <path d={`M${PTS.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke="rgba(255,240,210,.5)" strokeWidth={6} strokeDasharray="14 12" />
    </svg>
    <div style={{ ...at(bx - 36, by - 46), width: 72, height: 92, borderRadius: "50%", background: `radial-gradient(ellipse at 35% 30%, #8a5530, ${COFFEE})`, boxShadow: "inset -8px 0 0 rgba(0,0,0,.3), 0 12px 20px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(34, 10), width: 6, height: 72, borderRadius: 3, background: "#2a160a" }} />
    </div>
    <div style={{ ...at(bx + 50, by - 90), fontWeight: 900, fontSize: 54, color: price < 100 ? RED : GRN, textShadow: "0 6px 20px #000" }}>{price}%</div>
    {cur >= 0 && <div key={cur} style={{ ...at(1000, 960), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 58, color: AMB, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{cur + 1} · {st[cur][1]}</div>}
  </>;
}}</Stage>;

// ---- 16:26 · EL MAR DOS VECES: un globo terráqueo gira; un saco de café cruza el Atlántico hacia Europa y vuelve a cruzar convertido en moneda ----
export const TOcean2x: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = eio(tt, 0.5, 2.6), b = eio(tt, 3.0, 5.2);
  const pt = (k: number) => [lerp(620, 1380, k), 520 - Math.sin(Math.PI * k) * 220];
  const [ax, ay] = pt(a), [cx, cy] = pt(b);
  return <>
    <div style={{ ...at(560, 160), width: 880, height: 880, borderRadius: "50%", background: "radial-gradient(circle at 36% 32%, #2f7aa0, #10364d 62%, #061823)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset -40px -30px 80px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ ...at(80 - (tt * 18) % 60, 330), width: 240, height: 300, borderRadius: "40% 60% 50% 50%", background: "#5d7a45", opacity: 0.85 }} />
      <div style={{ ...at(640 - (tt * 18) % 60, 160), width: 220, height: 260, borderRadius: "50% 40% 60% 50%", background: "#7a8a55", opacity: 0.85 }} />
    </div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M620 520 Q1000 80 1380 520" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={5} strokeDasharray="12 10" /></svg>
    {a > 0 && a < 1 && <div style={{ ...at(ax - 50, ay - 60), width: 100, height: 120, borderRadius: "22px 22px 30px 30px", background: "linear-gradient(160deg, #c8a878, #8a6a40)", boxShadow: "0 12px 20px rgba(0,0,0,.5)", fontWeight: 900, fontSize: 22, color: INK, textAlign: "center", paddingTop: 44 }}>CAFÉ</div>}
    {b > 0 && b < 1 && <div style={{ ...at(cx - 40, cy - 40) }}><Coin r={40} txt="F" /></div>}
    <Tag tt={tt} at={0.7} x={620} y={620} txt="HAITÍ" col={AMB} size={36} />
    <Tag tt={tt} at={1.4} x={1380} y={620} txt="FRANCIA" col={ICE} size={36} />
    <Num tt={tt} d={3.4} x={1000} y={900} txt="DOS VECES" size={96} col={AMB} />
  </>;
}}</Stage>;

// ---- 16:45 · MÁS DE LA MITAD: un sobre de sueldo con billetes; una pinza saca más de la mitad y deja el sobre flaco ----
export const TPayslip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const out = eio(tt, 1.2, 3.4);
  return <>
    <Floor x={1000} y={880} w={1000} />
    {Array.from({ length: 10 }, (_, i) => { const gone = i >= 4, k = gone ? cl(out * 1.6 - (i - 4) * 0.1) : 0;
      return <div key={i} style={{ ...at(620 + i * 6, 360 - i * 12 - k * 520), width: 560, height: 260, borderRadius: 10, background: "linear-gradient(135deg, #cfe0c2, #8fb38a)", border: "6px solid #4f7a4a", transform: `rotate(${(i % 3 - 1) * 2 + k * 18}deg)`, opacity: 1 - k * 0.9, boxShadow: "0 8px 14px rgba(0,0,0,.35)" }}>
        <div style={{ ...at(220, 60), width: 120, height: 120, borderRadius: "50%", border: "6px solid #4f7a4a" }} /></div>; })}
    <div style={{ ...at(560, 480), width: 720, height: 380, borderRadius: 14, background: "linear-gradient(180deg, #d9c49a, #b89c68)", boxShadow: soft(30), clipPath: "polygon(0 0, 50% 30%, 100% 0, 100% 100%, 0 100%)" }} />
    <div style={{ ...at(560, 480), width: 720, height: 380, borderRadius: 14, background: "linear-gradient(180deg, #e8d6ac, #c9ad78)", clipPath: "polygon(0 100%, 50% 55%, 100% 100%)" }} />
    <Num tt={tt} d={2.4} x={1460} y={360} txt="+50 %" size={140} col={RED} />
    <Tag tt={tt} at={3.0} x={1460} y={480} txt="A LA DEUDA" col={RED} size={34} />
    <Tag tt={tt} at={0.6} x={920} y={940} txt="TODO LO QUE RECAUDABA EL ESTADO" size={30} />
  </>;
}}</Stage>;

// ---- 17:49 · LA SOPA JOUMOU: una olla de hierro humeante, el zapallo naranja adentro; el almanaque marca 1 DE ENERO ----
export const TSoup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = phys(tt, 0.3, 6, 0.6), cal = phys(tt, 2.4, 7, 0.4);
  return <>
    <Floor x={960} y={900} w={900} o={0.7} />
    <div style={{ ...at(560, 470), width: 800, height: 420, transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 300px 300px / 40px 40px 260px 260px", background: "linear-gradient(90deg, #1a1a1a, #4a4a4a 30%, #2a2a2a 70%, #111)", boxShadow: soft(30) }} />
      <div style={{ ...at(20, -30), width: 760, height: 90, borderRadius: "50%", background: "radial-gradient(ellipse, #f08a1c, #c55a0a 70%, #3a3a3a 72%)" }} />
      {[[-60, 60], [780, 60]].map(([x, y], i) => <div key={i} style={{ ...at(x, y), width: 80, height: 50, borderRadius: 25, border: "14px solid #333" }} />)}
    </div>
    {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 0.35 + i / 6) % 1); return <div key={i} style={{ ...at(700 + i * 90 + Math.sin(tt + i) * 20, 420 - k * 300), width: 110, height: 110, borderRadius: "50%", background: "rgba(255,245,230,.22)", filter: "blur(18px)", opacity: Math.sin(Math.PI * k) }} />; })}
    {cal > 0.01 && <div style={{ ...at(1440, 260), transform: `rotate(${-6 + 6 * cal}deg) scale(${cal})`, width: 240, height: 280, borderRadius: 16, background: "#fbf8f1", boxShadow: soft(20), overflow: "hidden", textAlign: "center" }}>
      <div style={{ height: 70, background: "#1f3f9a", color: "#fff", fontWeight: 900, fontSize: 34, lineHeight: "70px" }}>ENERO</div>
      <div style={{ fontWeight: 900, fontSize: 140, color: "#c21f2b", lineHeight: "170px" }}>1</div>
    </div>}
    <Tag tt={tt} at={1.4} x={960} y={960} txt="SOUP JOUMOU · LA SOPA DE LA LIBERTAD" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 18:29 · LA CIUDADELA: una fortaleza de piedra sube desde la cima de la montaña; aparecen los cañones… y lo que llega es un papel ----
export const TFortress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const up = eio(tt, 0.2, 2.2), can = Math.floor(eio(tt, 2.2, 3.6) * 8), pap = eio(tt, 4.0, 5.8);
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M260 900 L760 420 L1000 360 L1260 420 L1720 900 Z" fill="#3e4a2e" />
      <g transform={`translate(0 ${(1 - up) * 300})`} opacity={up}>
        <path d="M720 430 L780 250 L1220 250 L1290 430 Z" fill="#9b8f7c" stroke="#5f574a" strokeWidth={5} />
        <path d="M780 250 L860 180 L1140 180 L1220 250 Z" fill="#b3a68f" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={800 + i * 70} y={300} width={30} height={40} fill="#3a342c" />)}
        {Array.from({ length: can }, (_, i) => <rect key={"c" + i} x={790 + i * 54} y={360} width={40} height={14} rx={4} fill="#222" transform={`rotate(-8 ${790 + i * 54} 360)`} />)}
      </g>
    </svg>
    {pap > 0 && <div style={{ ...at(lerp(1700, 1080, pap), lerp(120, 280, pap)), transform: `rotate(${lerp(40, -8, pap)}deg)`, width: 180, height: 120, background: PAPER, boxShadow: "0 12px 20px rgba(0,0,0,.5)", borderRadius: 4 }}>{Array.from({ length: 4 }, (_, i) => <div key={i} style={{ ...at(20, 22 + i * 22), width: 140, height: 5, background: "rgba(43,34,24,.35)" }} />)}</div>}
    <Tag tt={tt} at={1.2} x={1000} y={960} txt="LA CIUDADELA · POR SI FRANCIA VOLVÍA" col={AMB} size={34} />
    <Tag tt={tt} at={4.6} x={1500} y={480} txt="VOLVIÓ CON UN PAPEL" col={RED} size={34} />
  </>;
}}</Stage>;

// ---- 19:14 · LA CIFRA CON CENTAVOS: una máquina de escribir tipea US$ 21.685.135.571,48 en una hoja que sale del carro ----
export const TTypewriter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = "US$ 21.685.135.571,48", k = Math.floor(cl((tt - 0.8) / 4.0) * S.length + 0.001), car = k / S.length;
  return <>
    <Floor x={1000} y={900} w={1100} o={0.7} />
    <div style={{ ...at(560 - car * 200, 170), width: 820, height: 330, background: PAPER, boxShadow: "0 10px 20px rgba(0,0,0,.35)", borderRadius: 4 }}>
      <div style={{ ...at(60, 60), fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 30, color: INK }}>RESTITUCIÓN · 2003</div>
      <div style={{ ...at(60, 160), fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 56, color: "#1d1a16", whiteSpace: "nowrap" }}>{S.slice(0, k)}<span style={{ opacity: Math.sin(tt * 12) > 0 ? 1 : 0 }}>▌</span></div>
    </div>
    <div style={{ ...at(460, 470), width: 1080, height: 380, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg, #2d2f33, #121315)", boxShadow: soft(40) }}>
      <div style={{ ...at(-40, -10), width: 1160, height: 60, borderRadius: 30, background: "linear-gradient(180deg, #5a5d63, #2a2c30)" }} />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 11 - r }, (_, c) => { const hit = (k + c + r) % 7 === 0 && k < S.length;
        return <div key={r + "_" + c} style={{ ...at(110 + r * 40 + c * 84, 120 + r * 76 + (hit ? 6 : 0)), width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f3efe6, #bdb6a8)", boxShadow: hit ? "0 2px 2px rgba(0,0,0,.6)" : "0 8px 10px rgba(0,0,0,.6)" }} />; }))}
    </div>
    <Tag tt={tt} at={5.2} x={1000} y={960} txt="CON CENTAVOS Y TODO · FRANCIA DIJO QUE NO" col={AMB} size={32} />
  </>;
}}</Stage>;

// ---- 20:12 · LOS PAPELES DISPERSOS: tres cajones de archivo (FRANCIA · EE. UU. · HAITÍ) se abren y sus hojas vuelan a una sola pila ----
export const TDrawers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <>
  <Floor x={1000} y={900} w={1400} />
  {["FRANCIA", "EE. UU.", "HAITÍ"].map((n, i) => { const o = eio(tt, 0.4 + i * 0.4, 1.3 + i * 0.4), x = 380 + i * 320;
    return <div key={i} style={{ ...at(x, 380), width: 280, height: 500 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "linear-gradient(145deg, #7a7d82, #3d3f43)", boxShadow: soft(20) }} />
      {[0, 1, 2].map((d) => <div key={d} style={{ ...at(20, 30 + d * 155), width: 240, height: 135, borderRadius: 6, background: "linear-gradient(180deg, #8f9296, #5a5d61)", transform: `translateY(${d === 1 ? o * 60 : 0}px) scale(${d === 1 ? 1 + o * 0.06 : 1})`, boxShadow: "inset 0 0 0 3px rgba(0,0,0,.2)" }}><div style={{ ...at(90, 56), width: 60, height: 16, borderRadius: 8, background: "#d5d7da" }} /></div>)}
      <div style={{ ...at(140, 520), transform: "translateX(-50%)", fontWeight: 900, fontSize: 32, color: TX, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>{n}</div>
    </div>; })}
  {Array.from({ length: 18 }, (_, i) => { const src = i % 3, k = eio(tt, 1.8 + i * 0.12, 3.0 + i * 0.12), x0 = 520 + src * 320, y0 = 560, x1 = 1480, y1 = 640 - Math.min(i, 17) * 9;
    return k > 0 ? <div key={i} style={{ ...at(lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(Math.PI * k) * 260), width: 200, height: 130, background: PAPER, transform: `rotate(${(1 - k) * (i * 47 % 90 - 45)}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.35)", borderRadius: 3 }} /> : null; })}
  <Tag tt={tt} at={3.8} x={1580} y={480} txt="RECIÉN EN 2022, JUNTOS" col={AMB} size={30} />
</>}</Stage>;

// ---- 21:09 · EL ÁRBOL DE NOMBRES: el NATIONAL CITY BANK es una raíz; las ramas se fusionan una y otra vez hasta la copa: CITIGROUP ----
export const TMergeTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.4, 3.6);
  const NODES: [number, number, string, number][] = [[1000, 860, "NATIONAL CITY BANK · 1914", 0], [720, 640, "FUSIÓN", 0.3], [1280, 640, "FUSIÓN", 0.4], [1000, 460, "CITIBANK", 0.6], [1000, 250, "CITIGROUP", 0.85]];
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      {[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].map(([a, b], i) => { const [x1, y1, , d] = NODES[b], [x0, y0] = NODES[a], k = cl((g - d + 0.2) / 0.25);
        return <path key={i} d={`M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + 40} ${lerp(x0, x1, k)} ${lerp(y0, y1, k)}`} fill="none" stroke="#9b7a4a" strokeWidth={22} strokeLinecap="round" />; })}
    </svg>
    {NODES.map(([x, y, n, d], i) => { const s = phys(tt, 0.4 + d * 3.2, 7, 0.5); if (s <= 0.01) return null; const last = i === 4;
      return <div key={i} style={{ ...at(x, y), transform: `translate(-50%,-50%) scale(${s})`, padding: last ? "22px 46px" : "12px 28px", borderRadius: 16, background: last ? `linear-gradient(180deg, #2b6fd6, #123e88)` : "linear-gradient(180deg, #e9dfc8, #c9b68e)", color: last ? "#fff" : INK, fontWeight: 900, fontSize: last ? 70 : 32, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,.55)" }}>{n}</div>; })}
    <Tag tt={tt} at={4.2} x={1460} y={250} txt="SIGUE ABIERTO" col={AMB} size={34} />
  </>;
}}</Stage>;

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { fleet: TFleet, decree: TDecree, tape: TTape, cuphalf: TCupHalf, dotsratio: TDotsRatio, spread: TSpread,
  dominoes: TDominoes, splitflap: TSplitFlap, cordon: TCordon, chests10: TChests10, loop: TLoop, chisel: TChisel, ledgerflip: TLedgerFlip, slices: TSlices, safekey: TSafeKey,
  goldbars: TGoldBars, tallymarks: TTallyMarks, generations: TGenerations, rangebar: TRangeBar, backpack: TBackpack, beanpath: TBeanPath, ocean2x: TOcean2x, payslip: TPayslip,
  soup: TSoup, fortress: TFortress, typewriter: TTypewriter, drawers: TDrawers, mergetree: TMergeTree, ...HC2, ...HC3, ...HC3b, ...HC4 };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
