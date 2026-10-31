// te29b · ronda 2 del evaluador (31-oct): Haití rehecho como OBJETOS con volumen y material (madera, bronce, piedra, vidrio, papel),
// grandes y al centro, entrada de a uno con peso y algo que se sigue moviendo hasta el último cuadro. Textos grandes, lejos de bordes y objetos.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const at = (x: number, y: number): React.CSSProperties => ({ position: "absolute", left: x, top: y });
const GOLD = "#e9b949", GOLDD = "#a87a1c", PAPER = "#efe4c8", PAPERD = "#cdbb92", INK = "#2b2218", BRASS = "#c9a35a";
const fmt = (n: number) => Math.round(n).toLocaleString("es-AR");
const shake = (tt: number, t0: number, a = 10) => { const k = tt - t0; return k > 0 && k < 0.5 ? a * Math.exp(-k * 9) * Math.sin(k * 70) : 0; };
const Floor: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.65 }) => <div style={{ ...at(x - w / 2, y - 26), width: w, height: 52, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(0,0,0,${o}), transparent 70%)`, filter: "blur(7px)" }} />;
const Num: React.FC<{ tt: number; d: number; x: number; y: number; txt: string; col?: string; size?: number }> = ({ tt, d, x, y, txt, col = "#fff7ea", size = 120 }) => {
  const s = phys(tt, d, 6.5, 0.5);
  if (s <= 0.01) return null;
  return <div style={{ ...at(x, y), transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) scale(${0.86 + 0.14 * s})`, opacity: cl(s * 2.2), fontWeight: 900, fontSize: size, color: col, whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(0,0,0,.25), 0 20px 44px rgba(0,0,0,.75)" }}>{txt}</div>;
};
const Slab: React.FC<{ w: number; h: number; depth: number; top: string; side: string; br?: string; clip?: string; children?: React.ReactNode }> = ({ w, h, depth, top, side, br, clip, children }) => <div style={{ position: "relative", width: w, height: h + depth }}>
  {Array.from({ length: Math.ceil(depth / 3) }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: depth - i * 3, width: w, height: h, borderRadius: br, clipPath: clip, background: side, filter: `brightness(${0.55 + 0.35 * (i / (depth / 3))})` }} />)}
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: br, clipPath: clip, background: top, overflow: "hidden" }}>{children}<div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.2), transparent 45%, rgba(0,0,0,.25))" }} /></div>
</div>;
const Sea: React.FC<{ tt: number; y: number; front?: boolean }> = ({ tt, y, front }) => <svg width={1920} height={1080 - y} style={{ ...at(0, y), overflow: "visible" }}>
  {[0, 1, 2].map((i) => { const yy = i * 26 + (front ? 30 : 0), o = (tt * (30 + i * 14)) % 240;
    return <path key={i} d={`M${-240 + o} ${yy} ${Array.from({ length: 10 }, () => `q60 ${-14 + i * 2} 120 0 t120 0`).join(" ")} V${1080} H-240 Z`} fill={front ? `rgba(16,50,70,${0.75 + i * 0.08})` : `rgba(28,78,104,${0.6 + i * 0.1})`} stroke="rgba(230,245,255,.35)" strokeWidth={3} />; })}
</svg>;
const Coin: React.FC<{ r: number; txt?: string }> = ({ r, txt }) => <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff1b8, ${GOLD} 45%, ${GOLDD})`, boxShadow: `inset 0 0 0 ${r * 0.12}px rgba(120,80,10,.5), 0 ${r * 0.25}px 0 #7a5410, 0 ${r * 0.4}px ${r * 0.6}px rgba(0,0,0,.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: r * 0.8, color: "#7a5410" }}>{txt}</div>;
const Bar: React.FC<{ w?: number }> = ({ w = 180 }) => <div style={{ width: w, height: w * 0.4, clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, #fff3c4, ${GOLD} 40%, ${GOLDD})` }} />;
// fragata de vela de perfil, con volumen: casco con tracas, troneras, tres palos con velas
const Frigate: React.FC<{ w: number; fire?: number }> = ({ w, fire = 0 }) => <svg width={w} height={w * 0.8} viewBox="0 0 300 240" style={{ overflow: "visible" }}>
  <defs><linearGradient id="fhull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3a1e" /><stop offset=".5" stopColor="#3a2412" /><stop offset="1" stopColor="#1a0f06" /></linearGradient></defs>
  {[70, 150, 230].map((x, i) => <g key={i}><rect x={x - 3} y={20 + i * 4} width={6} height={150} fill="#3a2614" />{[0, 1, 2].map((j) => <path key={j} d={`M${x - 34 + j * 3} ${34 + i * 4 + j * 44} Q${x} ${26 + i * 4 + j * 44} ${x + 34 - j * 3} ${34 + i * 4 + j * 44} L${x + 30 - j * 3} ${70 + i * 4 + j * 44} Q${x} ${78 + i * 4 + j * 44} ${x - 30 + j * 3} ${70 + i * 4 + j * 44} Z`} fill="#efe6cf" stroke="#b9ab88" strokeWidth={2} />)}</g>)}
  <path d="M8 168 L292 168 L268 224 L34 224 Z" fill="url(#fhull)" />
  <path d="M8 168 L292 168" stroke="#c9a35a" strokeWidth={4} />
  {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={40 + i * 26} y={184} width={14} height={11} fill="#120a04" stroke="#c9a35a" strokeWidth={1.5} />{fire > 0 && <circle cx={47 + i * 26} cy={198} r={10 + 10 * fire} fill={`rgba(255,${180 + (i % 3) * 20},90,${0.8 * fire})`} />}</g>)}
  <rect x={234} y={6} width={30} height={20} fill="#1f3f9a" /><rect x={244} y={6} width={10} height={20} fill="#fff" /><rect x={254} y={6} width={10} height={20} fill="#c6262e" />
</svg>;

// ---- 0:14 · LA FLOTA: maqueta de la bahía en perspectiva; catorce fragatas entran de a una y se alinean frente al puerto; al final disparan una salva ----
export const TFleet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.min(14, Math.floor(cl((tt - 0.3) / 5.2) * 14.99)), salvo = tt > 5.8 ? 0.5 + 0.5 * Math.sin((tt - 5.8) * Math.PI * 3.6) : 0;
  return <>
    <div style={{ ...at(160, 300), width: 1600, height: 260, background: "linear-gradient(180deg,#5d7a4a,#3f5a30)", clipPath: "polygon(0 60%, 12% 30%, 30% 40%, 48% 10%, 64% 34%, 80% 18%, 100% 50%, 100% 100%, 0 100%)" }} />
    {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ ...at(420 + i * 66, 470 - (i % 3) * 14), width: 48, height: 40 + (i % 3) * 10, background: i % 2 ? "#e8dcc6" : "#d4c3a2", boxShadow: "inset 0 10px 0 #a8442a" }} />)}
    <Sea tt={tt} y={540} />
    {Array.from({ length: 14 }, (_, i) => { const s = phys(tt, 0.3 + (i / 14) * 5.2, 5.5, 0.6); if (s <= 0.01) return null; const row = i % 2, x = lerp(-420, 120 + Math.floor(i / 2) * 240 + row * 120, s), sc = row ? 0.95 : 1.2;
      return <div key={i} style={{ ...at(x, 520 + row * 110 - 220 * sc), transform: `rotate(${1.5 * Math.sin(tt * 1.4 + i)}deg)`, filter: "drop-shadow(0 16px 14px rgba(0,0,0,.5))" }}><Frigate w={300 * sc} fire={salvo} /></div>; })}
    <Sea tt={tt + 2} y={820} front />
    <Num tt={tt} d={0.2} x={960} y={150} txt={`${Math.max(1, n)} ${Math.max(1, n) === 1 ? "BARCO" : "BARCOS"} DE GUERRA`} size={110} col={n >= 14 ? RED : "#fff7ea"} />
    <Tag tt={tt} at={1.0} x={960} y={265} txt="PUERTO PRÍNCIPE · JULIO DE 1825" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 0:38 · EL DECRETO: un rollo de pergamino con varillas de madera se desenrolla; la pluma escribe la cifra dígito a dígito; el lacre cae DEBAJO de la cifra ----
export const TDecree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const op = eio(tt, 0.3, 1.5), TXTD = "150.000.000 F", nch = Math.floor(cl((tt - 1.6) / 2.6) * TXTD.length), seal = phys(tt, 4.6, 7, 0.35), H0 = 560 * op;
  return <>
    <Floor x={960} y={900} w={1300} />
    <div style={{ ...at(360, 230), width: 1200, height: H0, background: `linear-gradient(90deg, ${PAPERD}, ${PAPER} 8%, ${PAPER} 92%, ${PAPERD})`, boxShadow: "0 30px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ ...at(0, 40), width: 1200, textAlign: "center", fontFamily: "Georgia, serif", fontSize: 44, color: INK, letterSpacing: 8 }}>ORDENANZA REAL · 1825</div>
      {Array.from({ length: 3 }, (_, i) => <div key={i} style={{ ...at(140, 120 + i * 30), width: 920 - i * 120, height: 5, background: "rgba(43,34,24,.25)" }} />)}
      <div style={{ ...at(0, 230), width: 1200, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 118, color: "#2a1a0c" }}>{TXTD.slice(0, nch)}</div>
    </div>
    {[0, 1].map((e) => <div key={e} style={{ ...at(330, e ? 220 + H0 : 200), width: 1260, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#a87645,#5a391c 60%,#3a2412)", boxShadow: "0 12px 18px rgba(0,0,0,.5)" }} />)}
    {nch > 0 && nch < TXTD.length && <div style={{ ...at(960 + (nch - TXTD.length / 2) * 52, 470 - 20 * Math.abs(Math.sin(tt * 9))), width: 14, height: 200, background: "linear-gradient(90deg,#eee,#bbb)", transform: "rotate(28deg)", transformOrigin: "50% 100%", borderRadius: "50% 50% 2px 2px" }} />}
    {seal > 0.01 && <div style={{ ...at(960, 690), transform: `translate(-50%,-50%) scale(${1.7 - 0.7 * seal})`, width: 150, height: 150, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)", boxShadow: "0 10px 20px rgba(0,0,0,.55), inset 0 0 0 10px rgba(0,0,0,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 60, color: "rgba(255,210,190,.6)" }}>✠</div>}
    <Tag tt={tt} at={2.0} x={960} y={140} txt="LO QUE HAITÍ DEBÍA PAGAR POR SER LIBRE" col={AMB} size={34} />
  </>;
}}</Stage>;

// ---- 0:54 · LA CINTA MÉTRICA: una cinta de metal amarilla sale de su caja y se estira de 1825 a 1947; las décadas pasan grandes; frena en 122 AÑOS ----
export const TTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.5, 5.0), L = 1300 * k, yrs = Math.round(122 * k);
  return <>
    <Floor x={960} y={720} w={1600} />
    <div style={{ ...at(370, 520), width: Math.min(L, 1250), height: 110, background: "linear-gradient(180deg,#fff2a8,#f2c21b 40%,#b8900c)", boxShadow: "0 16px 20px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ ...at(20, 30), fontWeight: 900, fontSize: 62, color: "#2a2410" }}>1825</div>{k > 0.97 && <div style={{ ...at(1250 - 200, 30), fontWeight: 900, fontSize: 62, color: "#7a1a10" }}>1947</div>}
      {Array.from({ length: 122 }, (_, i) => <div key={"m" + i} style={{ ...at(i * 1300 / 122, 0), width: 2, height: 22, background: "#2a2410" }} />)}
    </div>
    <div style={{ ...at(1540 * 0 + 300 + L - 20, 500), width: 40, height: 150, borderRadius: 6, background: "linear-gradient(90deg,#8a8c90,#e4e4e4,#6d6f73)" }} />
    <div style={{ ...at(80, 430), width: 280, height: 280, borderRadius: 40, background: "radial-gradient(circle at 40% 35%, #f05a4a, #a8261e 70%)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 8px 0 rgba(255,255,255,.2)" }}>
      <div style={{ ...at(70, 70), width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,#ddd,#888)", transform: `rotate(${tt * 300 * (k < 1 ? 1 : 0)}deg)` }}><div style={{ ...at(64, 6), width: 12, height: 128, background: "#555" }} /></div>
    </div>
    <Num tt={tt} d={0.4} x={960} y={250} txt={`${yrs} AÑOS`} size={170} col={k > 0.98 ? RED : "#fff7ea"} />
    
  </>;
}}</Stage>;

// ---- 2:30 · LA TAZA DEL MUNDO: una taza de loza grande; de una bolsa de yute caen granos oscuros (Saint-Domingue) hasta la mitad; de otra, granos claros (el resto) ----
export const TCupHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const a = eio(tt, 0.6, 3.0), b = eio(tt, 3.0, 5.4), fill = 0.5 * a + 0.5 * b;
  const pour = (x: number, on: boolean, col: string) => on ? Array.from({ length: 14 }, (_, i) => { const k = (tt * 1.6 + i / 14) % 1; return <div key={x + "" + i} style={{ ...at(x + 60 * k + (i % 3) * 8, 280 + k * (560 - 380 * fill)), width: 26, height: 18, borderRadius: "50%", background: col, boxShadow: "inset 0 -3px 0 rgba(0,0,0,.35)" }} />; }) : null;
  return <>
    <Floor x={960} y={930} w={900} />
    <div style={{ ...at(560, 860), width: 800, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, #f4f1ea 50%, #c9c4b6)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(640, 440), width: 640, height: 440, borderRadius: "10px 10px 300px 300px / 10px 10px 240px 240px", background: "linear-gradient(90deg,#bdb8ac,#fbfaf6 35%,#e8e4da 70%,#a9a497)", boxShadow: "0 20px 30px rgba(0,0,0,.45)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440 * fill, display: "flex", flexDirection: "column-reverse" }}>
        <div style={{ height: `${(0.5 * a / Math.max(0.01, fill)) * 100}%`, background: "radial-gradient(circle at 30% 40%, #5a3416 0 9px, #3a200c 10px) 0 0/26px 20px" }} />
        <div style={{ flex: 1, background: "radial-gradient(circle at 30% 40%, #a8743e 0 9px, #7a522a 10px) 0 0/26px 20px", borderTop: "4px dashed rgba(255,240,200,.7)" }} />
      </div>
    </div>
    <div style={{ ...at(1250, 520), width: 140, height: 200, borderRadius: "0 100px 100px 0", border: "34px solid #e8e4da", borderLeft: "none" }} />
    <div style={{ ...at(200, 380), width: 260, height: 220, borderRadius: "40% 40% 30% 30%", background: "repeating-linear-gradient(45deg,#b89a62 0 8px,#9a7e4a 8px 16px)", transform: `rotate(${30 * a * (1 - b)}deg)`, boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(1460, 380), width: 260, height: 220, borderRadius: "40% 40% 30% 30%", background: "repeating-linear-gradient(45deg,#c9b07a 0 8px,#a8905a 8px 16px)", transform: `rotate(${-30 * b}deg)`, boxShadow: "0 16px 20px rgba(0,0,0,.5)" }} />
    {pour(560, a > 0 && a < 1, "#4a2a10")}{pour(1260, b > 0 && b < 1, "#9a6a36")}
    <Tag tt={tt} at={0.5} x={330} y={700} txt="SAINT-DOMINGUE" col={AMB} size={36} />
    <Tag tt={tt} at={3.0} x={1590} y={700} txt="EL RESTO" col={ICE} size={36} />
    <Num tt={tt} d={2.8} x={960} y={130} txt="LA MITAD" size={110} col={AMB} />
  </>;
}}</Stage>;

// ---- 3:00 · LA BALANZA: una balanza de bronce grande; en un plato caen 50 granos (cada uno = 10.000 personas), en el otro 4; el brazo se va al piso del lado pesado ----
export const TDotsRatio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const nl = Math.floor(eio(tt, 0.4, 3.6) * 50), nr = Math.floor(eio(tt, 0.6, 1.6) * 4), tilt = 18 * eio(tt, 1.0, 4.2) + 1.2 * Math.sin(tt * 2.4) * cl(tt - 4.2);
  const pan = (side: number, n: number) => <div style={{ position: "absolute", left: side ? 980 : -100, top: 20, width: 340, transform: `rotate(${-tilt * (side ? -1 : 1) * 0 + tilt}deg)`, transformOrigin: "50% 0" }}>
    <svg width={340} height={360} style={{ overflow: "visible" }}><line x1={170} y1={0} x2={30} y2={260} stroke={BRASS} strokeWidth={5} /><line x1={170} y1={0} x2={310} y2={260} stroke={BRASS} strokeWidth={5} /><ellipse cx={170} cy={270} rx={170} ry={36} fill="url(#pan)" /><defs><radialGradient id="pan" cx=".4" cy=".3"><stop offset="0" stopColor="#f3d77a" /><stop offset="1" stopColor="#8a6a2c" /></radialGradient></defs>
      {Array.from({ length: n }, (_, i) => { const r = Math.floor(i / 9), c = i % 9; return <ellipse key={i} cx={58 + c * 28 + (r % 2) * 14} cy={256 - r * 16} rx={15} ry={10} fill="#5a3416" stroke="#2a1606" strokeWidth={2} />; })}
    </svg></div>;
  return <>
    <Floor x={960} y={950} w={900} />
    <div style={{ ...at(930, 330), width: 60, height: 600, background: "linear-gradient(90deg,#8a6a2c,#f3d77a,#8a6a2c)", borderRadius: 10 }} />
    <div style={{ ...at(760, 900), width: 400, height: 50, borderRadius: 12, background: "linear-gradient(180deg,#c9a35a,#6b4c10)" }} />
    <div style={{ ...at(960 - 620, 420), width: 1240, height: 34, background: "linear-gradient(180deg,#f3d77a,#8a6a2c)", borderRadius: 17, transform: `rotate(${-tilt}deg)`, transformOrigin: "50% 50%" }}>
      {pan(0, nl)}{pan(1, nr)}
    </div>
    <Num tt={tt} d={0.4} x={420} y={130} txt="500.000" size={110} col={RED} />
    <Tag tt={tt} at={0.8} x={420} y={235} txt="ESCLAVIZADOS" size={40} />
    <Num tt={tt} d={0.9} x={1500} y={130} txt="40.000" size={110} col={ICE} />
    <Tag tt={tt} at={1.2} x={1500} y={235} txt="COLONOS" size={40} />
    
  </>;
}}</Stage>;

// ---- 3:27 · EL FUEGO QUE SE EXTIENDE: maqueta en relieve de la colonia; las plantaciones del norte se prenden de a una (llamas lentas) y el fuego baja hacia el sur ----
const TOWNS = [[700, 120], [560, 150], [840, 160], [460, 210], [640, 230], [800, 260], [360, 280], [540, 310], [720, 330], [900, 320], [430, 380], [620, 400]];
export const TSpread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <>
  <Floor x={960} y={920} w={1400} />
  <div style={{ ...at(360, 360), transform: "perspective(1600px) rotateX(50deg)", transformOrigin: "50% 80%" }}>
    <Slab w={1200} h={520} depth={70} side="#5a4a30" clip="polygon(4% 40%, 20% 18%, 40% 10%, 60% 6%, 78% 14%, 96% 24%, 94% 48%, 80% 62%, 86% 80%, 70% 94%, 50% 88%, 30% 92%, 14% 78%, 2% 60%)" top="radial-gradient(ellipse at 50% 40%, #6f9a4a, #3f6a2a 70%)">
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ ...at((i * 197) % 1150, (i * 113) % 480), width: 50, height: 30, borderRadius: "50%", background: "rgba(40,80,30,.6)" }} />)}
    </Slab>
  </div>
  {TOWNS.map(([x, y], i) => { const on = phys(tt, 0.6 + i * 0.42, 6, 0.6), fl = 0.85 + 0.15 * Math.sin(tt * 2 * Math.PI * 1.4 + i);
    return <div key={i} style={{ ...at(360 + x * 1.1, 360 + y * 1.1) }}>
      <div style={{ width: 46, height: 36, background: "#e8dcc6", boxShadow: "inset 0 12px 0 #a8442a, 0 6px 8px rgba(0,0,0,.5)", filter: on > 0.3 ? "brightness(.55)" : undefined }} />
      {on > 0.01 && <div style={{ ...at(-42, -150 * on * fl), width: 130, height: 160 * on * fl, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 90%, #fff3c4, #ffb347 35%, #e2531e 65%, transparent 75%)", mixBlendMode: "screen", filter: "blur(2px)" }} />}
    </div>; })}
  <Num tt={tt} d={0.4} x={960} y={160} txt="AGOSTO DE 1791" size={110} col={AMB} />
  <Tag tt={tt} at={1.0} x={960} y={270} txt="DEL NORTE AL SUR" col={RED} size={46} />
</>}</Stage>;

// ---- 3:49 · LE GANAN A TODOS: cuatro estandartes de tela con asta caen como fichas de dominó; el último, el más grande, es el de Napoleón ----
const FOES: [string, string, string][] = [["PLANTADORES", "#6d6d6d", "#3a3a3a"], ["ESPAÑA", "#c6262e", "#f2c21b"], ["INGLATERRA", "#c8102e", "#ffffff"], ["NAPOLEÓN", "#1f3f9a", GOLD]];
export const TDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => <>
  <Floor x={960} y={900} w={1500} />
  <div style={{ ...at(200, 800), width: 1520, height: 30, background: "linear-gradient(180deg,#6b4a2b,#3a2616)", borderRadius: 6 }} />
  {FOES.map(([n, c1, c2], i) => { const s = phys(tt, 0.2 + i * 0.3, 7, 0.45), fall = eio(tt, 2.0 + i * 0.7, 2.6 + i * 0.7), sc = i === 3 ? 1.12 : 0.9, x = 250 + i * 330;
    return s > 0.01 ? <div key={i} style={{ ...at(x, 800 - 560 * sc), width: 280 * sc, height: 560 * sc, opacity: cl(s * 2), transformOrigin: "10% 100%", transform: `rotate(${(i === 3 ? 84 : 62) * fall}deg) translateY(${(1 - s) * -200}px)` }}>
      <div style={{ ...at(0, 0), width: 14, height: 560 * sc, background: "linear-gradient(90deg,#5a3d22,#a87645,#5a3d22)", borderRadius: 7 }} />
      <div style={{ ...at(-6, -20), width: 26, height: 26, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,#fff1b8,${GOLDD})` }} />
      <div style={{ ...at(14, 20), width: 250 * sc, height: 300 * sc, background: `linear-gradient(135deg, ${c1}, ${c1} 70%, rgba(0,0,0,.35))`, clipPath: "polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%)", transform: `skewY(${3 * Math.sin(tt * 2 + i)}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 90 * sc, height: 90 * sc, borderRadius: "50%", border: `8px solid ${c2}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 60 * sc, color: c2 }}>{i === 3 ? "N" : ""}</div>
      </div>
      <div style={{ ...at(14 + 125 * sc, 340 * sc + 10), transform: "translateX(-50%)", fontWeight: 900, fontSize: 30 * sc, color: TX, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>{n}</div>
    </div> : null; })}
  <Num tt={tt} d={0.3} x={960} y={150} txt="13 AÑOS DE GUERRA" size={110} col={AMB} />
</>}</Stage>;

// ---- 5:10 · LO AISLARON: la isla en relieve en el mar; un anillo de boyas rojas se cierra de a una; los barcos mercantes llegan, chocan con el anillo y dan la vuelta ----
export const TCordon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const nb = Math.floor(eio(tt, 0.3, 3.0) * 18);
  return <><div style={{ position: "absolute", inset: 0, transform: "scale(.84)", transformOrigin: "50% 55%" }}>
    <div style={{ ...at(160, 340), width: 1600, height: 640, transform: "perspective(1600px) rotateX(55deg)", transformOrigin: "50% 60%", borderRadius: 30, background: "radial-gradient(ellipse at 50% 50%, #2a7f96, #134a62 70%)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(520, 180), transform: "translateZ(0)" }}><Slab w={560} h={280} depth={40} br="46% 54% 50% 50% / 52% 46% 54% 48%" side="#4a3a20" top="radial-gradient(ellipse at 50% 45%, #6f9a4a 60%, #e6d6a8 66%, #e6d6a8 70%, transparent 72%)" /></div>
      {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2, x = 800 + Math.cos(a) * 520, y = 320 + Math.sin(a) * 250; return i < nb ? <div key={i} style={{ ...at(x - 18, y - 18), width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #c21f2b 60%, #6a0c12)", boxShadow: "0 0 0 6px rgba(255,255,255,.7), 0 10px 10px rgba(0,0,0,.5)", transform: `translateY(${3 * Math.sin(tt * 2 + i)}px)` }} /> : null; })}
    </div>
    {[0, 1, 2].map((i) => { const st = 2.2 + i * 1.3, k = cl((tt - st) / 2.2), ang = [-0.3, 3.4, 1.6][i], r = 900 - 360 * Math.sin(Math.PI * k), x = 960 + Math.cos(ang) * r, y = 640 + Math.sin(ang) * r * 0.42;
      return k > 0 && k < 1 ? <div key={i} style={{ ...at(x - 100, y - 120), transform: `scaleX(${Math.cos(ang) > 0 ? (k < 0.5 ? -1 : 1) : (k < 0.5 ? 1 : -1)})`, filter: "drop-shadow(0 12px 12px rgba(0,0,0,.5))" }}><Frigate w={200} /></div> : null; })}
    </div><Num tt={tt} d={0.4} x={960} y={130} txt="NADIE LOS RECONOCE" size={100} col={AMB} />
    <Tag tt={tt} at={1.0} x={960} y={240} txt="20 AÑOS AISLADOS" col={RED} size={50} />
  </>;
}}</Stage>;

// ---- 6:24 · DIEZ AÑOS DE PRESUPUESTO: sobre una mesa larga caen diez cofres de tesoro, de a uno, con rebote; cada uno es un año entero del Estado ----
const Chest: React.FC<{ w: number; n: number }> = ({ w, n }) => <div style={{ position: "relative", width: w, height: w * 0.8 }}>
  <div style={{ ...at(0, w * 0.28), width: w, height: w * 0.52, background: "repeating-linear-gradient(90deg,#7a5634 0 18px,#6b4a2b 18px 36px)", borderRadius: 6, boxShadow: "inset 0 0 0 5px rgba(0,0,0,.25)" }} />
  <div style={{ ...at(0, 0), width: w, height: w * 0.32, background: "repeating-linear-gradient(90deg,#83603c 0 18px,#7a5634 18px 36px)", borderRadius: `${w / 2}px ${w / 2}px 4px 4px / ${w * 0.3}px ${w * 0.3}px 4px 4px` }} />
  {[0.18, 0.78].map((p, i) => <div key={i} style={{ ...at(w * p - 6, 0), width: 12, height: w * 0.8, background: "linear-gradient(90deg,#9aa0a6,#4a4f55)" }} />)}
  <div style={{ ...at(w / 2 - 14, w * 0.3), width: 28, height: 34, borderRadius: 6, background: `linear-gradient(180deg,#f3d77a,${GOLDD})`, display: "flex", alignItems: "flex-end", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#3a2410" }}>{n}</div>
</div>;
export const TChests10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => <>
  <div style={{ ...at(140, 760), width: 1640, height: 60, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
  {Array.from({ length: 10 }, (_, i) => { const s = phys(tt, 0.4 + i * 0.42, 7, 0.38), r = Math.floor(i / 5), c = i % 5; return s > 0.01 ? <div key={i} style={{ ...at(330 + c * 260 + r * 40, 760 - 208 - r * 200 - (1 - s) * 500), opacity: cl(s * 3), filter: "drop-shadow(0 14px 12px rgba(0,0,0,.55))", zIndex: 2 - r }}><Chest w={250} n={i + 1} /></div> : null; })}
  <Num tt={tt} d={0.3} x={960} y={140} txt={`${Math.max(1, Math.min(10, Math.floor(cl((tt - 0.4) / 4.2) * 10) + 1))} ${Math.floor(cl((tt - 0.4) / 4.2) * 10) + 1 > 1 ? "AÑOS" : "AÑO"}`} size={120} col={AMB} />
  <Tag tt={tt} at={1.0} x={960} y={250} txt="DE TODO LO QUE RECAUDABA EL ESTADO" size={36} />
</>}</Stage>;

// ---- 7:06 · PRESTADO EN PARÍS PARA PAGARLE A PARÍS: dos cajas fuertes de hierro; las monedas van de PARÍS a HAITÍ y vuelven más; en cada vuelta unas caen al piso: las comisiones ----
const Safe: React.FC<{ lab: string; col: string }> = ({ lab, col }) => <div style={{ position: "relative", width: 320, height: 360, borderRadius: 18, background: "linear-gradient(135deg,#6d737a,#3a3d41 60%,#24262a)", boxShadow: "0 30px 40px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,255,255,.2)" }}>
  <div style={{ ...at(30, 30), width: 260, height: 300, borderRadius: 12, boxShadow: "inset 0 0 0 6px rgba(0,0,0,.3)" }} />
  <div style={{ ...at(110, 130), width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#d9d9d9,#555)", boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} />
  <div style={{ ...at(0, 380), width: 320, textAlign: "center", fontWeight: 900, fontSize: 52, color: col, textShadow: "0 4px 16px #000" }}>{lab}</div>
</div>;
export const TLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pile = Math.floor(cl((tt - 1.2) / 6) * 14);
  return <>
    <Floor x={960} y={900} w={1500} />
    <div style={{ ...at(220, 330) }}><Safe lab="PARÍS" col={ICE} /></div>
    <div style={{ ...at(1380, 330) }}><Safe lab="HAITÍ" col={GRN} /></div>
    {Array.from({ length: 10 }, (_, i) => { const P = 2.0, ph = (tt * 0.9 + i / 10) % 1, go = Math.floor((tt * 0.9 + i / 10)) % 2 === 0, x = go ? lerp(400, 1540, ph) : lerp(1540, 400, ph), y = 560 - Math.sin(Math.PI * ph) * (go ? 160 : 220), drop = i % 4 === 0 && ph > 0.45;
      void P; return tt > 0.5 ? <div key={i} style={{ ...at(x - 26, drop ? y + (ph - 0.45) * 900 : y), opacity: drop && ph > 0.8 ? 0 : 1 }}><Coin r={26} /></div> : null; })}
    {Array.from({ length: pile }, (_, i) => <div key={"p" + i} style={{ ...at(900 + (i % 5) * 26 - 50, 840 - Math.floor(i / 5) * 14) }}><Coin r={22} /></div>)}
    <Tag tt={tt} at={0.8} x={960} y={120} txt="PRÉSTAMO → ← CUOTA + INTERESES" col={AMB} size={36} />
    <Tag tt={tt} at={2.2} x={960} y={205} txt="LAS COMISIONES SE PIERDEN" col={RED} size={36} />
  </>;
}}</Stage>;

// ---- 9:51 · DE 150 A 90: un bloque de piedra tallado con la cifra; el cincel le baja la cima a golpes (saltan lascas)… y el musgo de los intereses vuelve a crecer ----
export const TChisel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cut = eio(tt, 0.6, 3.2), moss = eio(tt, 3.6, 6.4), val = Math.round(lerp(150, 90, cut)), hh = lerp(560, 340, cut), hits = Array.from({ length: 5 }, (_, i) => 0.7 + i * 0.5);
  const hitNow = hits.find((x) => tt > x && tt < x + 0.25);
  return <>
    <Floor x={960} y={930} w={1000} />
    <div style={{ ...at(560, 920 - hh), width: 800, height: hh, background: "radial-gradient(circle at 30% 20%, #b9b3a5, #7d786c 70%)", clipPath: "polygon(8% 100%, 0 20%, 20% 4%, 50% 0, 80% 6%, 100% 22%, 92% 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,.4)" }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ ...at((i * 97) % 760, (i * 61) % Math.max(60, hh - 30)), width: 30 + (i % 4) * 10, height: 6, borderRadius: 3, background: "rgba(60,55,45,.3)", transform: `rotate(${(i * 37) % 60 - 30}deg)` }} />)}
      <div style={{ ...at(0, hh / 2 - 90), width: 800, textAlign: "center", fontWeight: 900, fontSize: 170, color: "rgba(40,36,30,.75)", textShadow: "0 2px 0 rgba(255,255,255,.25)" }}>{val}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${moss * 22}%`, background: "radial-gradient(circle at 20% 30%, #5f8a3a 0 18px, transparent 19px) 0 0/60px 50px, radial-gradient(circle at 70% 60%, #4a7a2a 0 22px, transparent 23px) 0 0/70px 60px", opacity: 0.9 }} />
    </div>
    <div style={{ ...at(960, 920 - hh - 140 + (hitNow ? 30 : 0)), width: 30, height: 200, transform: "rotate(18deg)", background: "linear-gradient(90deg,#8a9096,#eef1f4,#7a8086)", borderRadius: "4px 4px 2px 2px", opacity: cut < 1 ? 1 : 0 }} />
    {hits.map((h0, i) => { const k = cl((tt - h0) * 2.4); return k > 0 && k < 1 ? Array.from({ length: 5 }, (_, j) => <div key={i + "-" + j} style={{ ...at(960 + (j - 2) * 70 * k, 920 - lerp(560, 340, eio(h0, 0.6, 3.2)) - 40 * Math.sin(Math.PI * k) * (1 + j % 2) + 200 * k * k), width: 26, height: 18, background: "#9a958a", transform: `rotate(${j * 60 + k * 300}deg)`, opacity: 1 - k }} />) : null; })}
    <Num tt={tt} d={0.3} x={960} y={150} txt={`${val} MILLONES`} size={110} col={cut > 0.98 ? AMB : "#fff7ea"} />
    <Tag tt={tt} at={3.8} x={1560} y={600} txt="+ INTERESES" col={GRN} size={60} />
  </>;
}}</Stage>;

// ---- 10:22 · EL LIBRO MAYOR: un libro de contabilidad abierto pasa páginas; cada una un año con su renglón; el sello PAGADO cae en el centro de la página; el total sube a 112 ----
export const TLedgerFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.4, 6.4), pg = Math.min(63, Math.floor(k * 64)), fl = (k * 64) % 1, tot = Math.round(112 * k);
  return <>
    <Floor x={960} y={920} w={1400} />
    <div style={{ ...at(360, 360), width: 1200, height: 540, transform: "perspective(1800px) rotateX(30deg)", transformOrigin: "50% 100%" }}>
      <div style={{ ...at(-20, 20), width: 1240, height: 540, borderRadius: 14, background: "linear-gradient(180deg,#5a1a12,#2e0c08)" }} />
      {[0, 1].map((s) => <div key={s} style={{ ...at(s * 600, 0), width: 600, height: 520, background: `linear-gradient(${s ? 90 : 270}deg, ${PAPER}, ${PAPER} 85%, ${PAPERD})`, boxShadow: "inset 0 0 0 2px rgba(0,0,0,.08)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ ...at(40, 60 + i * 36), width: 520, height: 2, background: "rgba(80,110,160,.35)" }} />)}
        <div style={{ ...at(40, 20), fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 34, color: INK }}>{s ? `AÑO ${1825 + pg + 1}` : `AÑO ${1825 + pg}`}</div>
        {Array.from({ length: 4 }, (_, i) => <div key={"r" + i} style={{ ...at(40, 100 + i * 72), fontFamily: "Courier New, monospace", fontSize: 28, color: "#3a3226" }}>{["CUOTA", "INTERESES", "COMISIÓN", "TOTAL"][i]} ............ F</div>)}
        {s === 1 && <div key={pg} style={{ ...at(300, 300), transform: `translate(-50%,-50%) rotate(-12deg) scale(${1.4 - 0.4 * cl(fl * 3)})`, opacity: cl(fl * 3), border: "8px solid #b0261e", color: "#b0261e", padding: "4px 26px", fontWeight: 900, fontSize: 64, borderRadius: 10 }}>PAGADO</div>}
      </div>)}
      {fl < 0.5 && <div style={{ ...at(600, 0), width: 600, height: 520, background: PAPER, transformOrigin: "0 50%", transform: `rotateY(${-180 * fl * 2}deg)`, boxShadow: "0 0 30px rgba(0,0,0,.3)" }} />}
    </div>
    <Num tt={tt} d={0.3} x={960} y={160} txt={`${tot} ${tot === 1 ? "MILLÓN" : "MILLONES"} DE FRANCOS`} size={84} />
    <Tag tt={tt} at={0.8} x={960} y={275} txt={`AÑO ${pg + 1} DE 64`} col={AMB} size={40} />
  </>;
}}</Stage>;

// ---- 11:12 · UNA FRACCIÓN: un pan de 36 millones sobre la tabla; el cuchillo lo rebana y manos de saco se llevan las rebanadas de a una; a Haití le queda la punta ----
export const TSlices: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 9, gone = (i: number) => eio(tt, 1.0 + i * 0.5, 1.6 + i * 0.5);
  return <>
    <div style={{ ...at(240, 640), width: 1440, height: 260, transform: "perspective(1400px) rotateX(55deg)", borderRadius: 30, background: "repeating-linear-gradient(90deg,#9a6a3c 0 50px,#8a5a34 50px 100px)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    {Array.from({ length: N + 1 }, (_, i) => { const g = i < N ? gone(i) : 0, x = 360 + i * 100, isEnd = i === N;
      return <div key={i} style={{ ...at(lerp(x, 1800, g), lerp(440, 300, g) - Math.sin(Math.PI * g) * 120), width: isEnd ? 150 : 96, height: 260, transform: `rotate(${18 * g}deg)`, opacity: g > 0.95 ? 0 : 1 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: isEnd ? "40px 120px 30px 20px" : "50px 50px 18px 18px", background: "radial-gradient(ellipse at 50% 40%, #f6e2b4, #e2c48a 60%)", boxShadow: "inset -8px 0 0 #b97a3a, inset 0 10px 0 #a8642a, 4px 0 0 rgba(0,0,0,.2)" }} />
        {g > 0.05 && <div style={{ ...at(10, -60), width: 90, height: 80, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(180deg,#1d1f24,#2e3138)", boxShadow: "0 0 0 6px #e8e0c8 inset" }} />}
      </div>; })}
    <div style={{ ...at(360 + Math.min(N - 1, Math.floor(cl((tt - 0.6) / 4.6) * N)) * 100 + 90, 260 + 30 * Math.abs(Math.sin(tt * 6))), width: 26, height: 340, background: "linear-gradient(90deg,#9aa0a6,#f4f6f8 45%,#8a9096)", borderRadius: "4px 4px 13px 13px", boxShadow: "0 10px 14px rgba(0,0,0,.5)", opacity: tt < 5.6 ? 1 : 0 }} />
    <Num tt={tt} d={0.3} x={960} y={150} txt="36 MILLONES" size={120} col={AMB} />
    <Tag tt={tt} at={1.4} x={960} y={265} txt="SE LO LLEVAN LOS BANCOS" col={RED} size={40} />
    <Tag tt={tt} at={5.0} x={1360} y={780} txt="← A HAITÍ" col={GRN} size={56} />
  </>;
}}</Stage>;

// ---- 11:51 · LA LLAVE DE LA CAJA: una mano sostiene una llave de hierro grande; la llave viaja y entra en la cerradura de una puerta de bóveda que dice PARÍS; gira y la bóveda se cierra ----
export const TSafeKey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const mv = eio(tt, 1.0, 3.0), turn = eio(tt, 3.2, 4.0), x = lerp(360, 1150, mv), y = lerp(640, 520, mv);
  return <>
    <Floor x={1400} y={940} w={800} />
    <div style={{ ...at(1100, 220), width: 620, height: 700, borderRadius: 24, background: "linear-gradient(135deg,#7a8086,#3a3d41 60%,#24262a)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 8px 0 rgba(255,255,255,.18)" }}>
      <div style={{ ...at(110, 150), width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #a9afb5, #4a4f55 70%)", transform: `rotate(${90 * turn}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ ...at(190, 10), width: 20, height: 380, background: "#2a2c30", transform: `rotate(${i * 45}deg)` }} />)}<div style={{ ...at(150, 150), width: 100, height: 100, borderRadius: "50%", background: "#1a1a1a" }} /></div>
      <div style={{ ...at(0, -110), width: 620, textAlign: "center", fontWeight: 900, fontSize: 72, color: ICE, textShadow: "0 4px 16px #000" }}>PARÍS</div>
    </div>
    <div style={{ ...at(x - 120, y - 40), transform: `rotate(${90 * turn}deg) scale(1.3)`, transformOrigin: "100% 50%", filter: "drop-shadow(0 16px 14px rgba(0,0,0,.6))" }}>
      <svg width={360} height={100}><circle cx={60} cy={50} r={46} fill="none" stroke="#5a5f66" strokeWidth={18} /><rect x={100} y={40} width={230} height={20} fill="#5a5f66" /><rect x={290} y={60} width={16} height={34} fill="#5a5f66" /><rect x={320} y={60} width={16} height={24} fill="#5a5f66" /></svg>
    </div>
    <div style={{ ...at(lerp(180, 900, mv) - 60, lerp(600, 520, mv)), width: 170, height: 120, borderRadius: "60px 40px 40px 60px", background: "linear-gradient(180deg,#8a5a3a,#5a3a22)", opacity: 1 - eio(tt, 2.8, 3.4) }} />
    <Tag tt={tt} at={0.4} x={420} y={840} txt="HAITÍ" col={GRN} size={50} />
    <Num tt={tt} d={3.6} x={600} y={200} txt="EL BANCO NACIONAL" size={80} col={AMB} />
    <Tag tt={tt} at={4.0} x={600} y={310} txt="MANEJADO DESDE PARÍS" col={RED} size={40} />
  </>;
}}</Stage>;

// ---- 12:24 · EL ORO: lingotes salen de la fachada del Banco Nacional, uno por uno, viajan en arco y entran en la bóveda de NUEVA YORK; el contador sube ----
export const TGoldBars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const n = Math.floor(cl((tt - 0.6) / 5.6) * 10);
  return <>
    <Floor x={960} y={930} w={1600} />
    <div style={{ ...at(140, 360), width: 460, height: 560, background: "linear-gradient(180deg,#e8e0cc,#b9b09a)", boxShadow: "0 30px 50px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(-20, -60), width: 500, height: 80, background: "linear-gradient(180deg,#f2ecdc,#c9c0a8)", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...at(40 + i * 110, 60), width: 50, height: 420, background: "linear-gradient(90deg,#c9c0a8,#fff,#b9b09a)" }} />)}
      <div style={{ ...at(170, 360), width: 120, height: 200, background: "#2a2218" }} />
    </div>
    <Tag tt={tt} at={0.4} x={370} y={290} txt="HAITÍ" col={GRN} size={50} />
    <div style={{ ...at(1320, 380), width: 460, height: 540, borderRadius: 20, background: "linear-gradient(135deg,#7a8086,#3a3d41 60%,#24262a)", boxShadow: "0 40px 60px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(60, 100), width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #a9afb5, #4a4f55 70%)" }} />
      <div style={{ ...at(0, -80), width: 460, textAlign: "center", fontWeight: 900, fontSize: 56, color: ICE, textShadow: "0 4px 16px #000" }}>NUEVA YORK</div>
    </div>
    {Array.from({ length: 10 }, (_, i) => { const k = cl((tt - 0.6 - i * 0.56) / 1.2); return k > 0 && k < 1 ? <div key={i} style={{ ...at(lerp(420, 1500, k) - 90, lerp(760, 600, k) - Math.sin(Math.PI * k) * 380), transform: `rotate(${lerp(-10, 10, k)}deg)`, filter: "drop-shadow(0 14px 12px rgba(0,0,0,.5))" }}><Bar w={180} /></div> : null; })}
    {Array.from({ length: n }, (_, i) => <div key={"s" + i} style={{ ...at(1440 + (i % 2) * 40, 880 - Math.floor(i / 2) * 30) }}><Bar w={150} /></div>)}
    <Num tt={tt} d={0.3} x={960} y={150} txt={`US$ ${fmt(500000 * n / 10)}`} size={110} col={AMB} />
    <Tag tt={tt} at={0.8} x={960} y={265} txt="DICIEMBRE DE 1914" size={38} />
  </>;
}}</Stage>;

// ---- 12:54 · DIECINUEVE AÑOS: una pared de piedra de calabozo con luz rasante; se graban palitos de a cinco, uno por año, hasta 19 ----
export const TTallyMarks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const n = Math.max(1, Math.floor(eio(tt, 0.3, 5.6) * 19));
  return <>
    <div style={{ ...at(260, 320), width: 1400, height: 580, borderRadius: 10, background: "radial-gradient(ellipse at 20% 10%, rgba(255,220,170,.35), transparent 55%), repeating-linear-gradient(0deg, #6e675a 0 80px, #5a5448 80px 84px), #6e675a", boxShadow: "inset 0 0 120px rgba(0,0,0,.6), 0 40px 60px rgba(0,0,0,.6)" }}>
      {Array.from({ length: 8 }, (_, r) => Array.from({ length: 5 }, (_, c) => <div key={r + "-" + c} style={{ ...at(c * 290 + (r % 2) * 145 - 40, r * 84), width: 4, height: 80, background: "rgba(40,36,30,.5)" }} />))}
      {Array.from({ length: n }, (_, i) => { const g = Math.floor(i / 5), j = i % 5, x = 140 + (g % 2) * 600 + j * 70, y = 120 + Math.floor(g / 2) * 260, cross = j === 4, s = i === n - 1 ? cl((tt - 0.3 - (i / 19) * 5.3) * 4 + 0.2) : 1;
        return cross ? <div key={i} style={{ ...at(x - 300, y + 90), width: 340 * s, height: 16, background: "#2a2620", boxShadow: "0 2px 0 rgba(255,240,210,.35)", transform: "rotate(-24deg)", transformOrigin: "0 50%" }} />
          : <div key={i} style={{ ...at(x, y), width: 16, height: 200 * s, background: "#2a2620", boxShadow: "2px 0 0 rgba(255,240,210,.35)", borderRadius: 4, transform: `rotate(${(i * 7) % 6 - 3}deg)` }} />; })}
    </div>
    <Num tt={tt} d={0.3} x={960} y={140} txt={`${n} ${n === 1 ? "AÑO" : "AÑOS"}`} size={120} />
    <Tag tt={tt} at={0.9} x={960} y={255} txt="OCUPACIÓN DE EE. UU. · 1915-1934" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 13:27 · SEIS GENERACIONES: seis marcos dorados ovalados en la pared, cada uno una silueta de su época; una moneda grande salta de retrato en retrato ----
const HATS = ["M70 60 L130 60 L120 30 L80 30 Z", "M50 62 L150 62 L130 50 L110 20 L90 20 L70 50 Z", "M60 60 L140 60 L135 40 L65 40 Z", "M56 64 Q100 20 144 64 Z", "M64 62 Q100 36 136 62 Z", ""];
export const TGenerations: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = cl((tt - 0.8) / 5.4) * 5, i0 = Math.min(4, Math.floor(k)), f = k - i0, X = (i: number) => 260 + i * 280;
  return <>
    <div style={{ ...at(140, 280), width: 1640, height: 560, background: "repeating-linear-gradient(90deg,#4a3a2a 0 60px,#42331f 60px 120px)", borderRadius: 10, boxShadow: "inset 0 0 80px rgba(0,0,0,.6)" }} />
    {Array.from({ length: 6 }, (_, i) => { const s = phys(tt, 0.2 + i * 0.2, 7, 0.45); return s > 0.01 ? <div key={i} style={{ ...at(X(i) - 110, 380 - (1 - s) * 200), width: 220, height: 290, opacity: cl(s * 2), borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, ${["#d8c7a4", "#cdbb92", "#c9b48a", "#bfa77a", "#b39a6c", "#a88e60"][i]}, #6b5a3a)`, boxShadow: `0 0 0 16px ${GOLD}, 0 0 0 22px ${GOLDD}, 0 24px 30px rgba(0,0,0,.6)` }}>
      <svg width={220} height={290} viewBox="0 0 200 260" style={at(0, 0)}><circle cx={100} cy={95} r={36} fill="#3a2a1a" /><path d="M40 250 Q40 150 100 140 Q160 150 160 250 Z" fill="#3a2a1a" />{HATS[i] && <path d={HATS[i]} transform="translate(0 0)" fill="#1e140a" />}</svg>
      <div style={{ ...at(0, 300), width: 220, textAlign: "center", fontWeight: 900, fontSize: 44, color: TX }}>{1825 + i * 22}</div>
    </div> : null; })}
    {tt > 0.8 && <div style={{ ...at(lerp(X(i0), X(i0 + 1), f) - 50, 470 - Math.sin(Math.PI * f) * 150), transform: `rotateY(${f * 360}deg)`, filter: "drop-shadow(0 14px 12px rgba(0,0,0,.6))" }}><Coin r={50} txt="F" /></div>}
    <Num tt={tt} d={0.3} x={960} y={160} txt="6 GENERACIONES PAGANDO" size={96} col={AMB} />
  </>;
}}</Stage>;

// ---- 14:00 · EL RANGO: una regla de vidrio grande en perspectiva, de 0 a 120; un calibre de bronce abre sus mordazas de 21 a 115 y el tramo se llena de rojo ----
export const TRangeBar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = 1400, X0 = 260, px = (v: number) => X0 + (v / 120) * L, a = eio(tt, 0.6, 1.6), b = eio(tt, 1.6, 4.2), lo = 21, hi = lerp(21, 115, b);
  return <>
    <Floor x={960} y={820} w={1600} />
    <div style={{ ...at(X0, 560), width: L, height: 150, transform: "perspective(1600px) rotateX(35deg)", background: "linear-gradient(180deg, rgba(220,240,255,.35), rgba(220,240,255,.12))", border: "4px solid rgba(230,245,255,.8)", borderRadius: 12, boxShadow: "0 30px 40px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ ...at((i / 12) * L - 2, 0) }}><div style={{ width: 4, height: 50, background: "#fff" }} /><div style={{ ...at(-20, 54), fontWeight: 900, fontSize: 30, color: "#fff" }}>{i * 10}</div></div>)}
      <div style={{ ...at(((lo / 120) * L), 0), width: ((hi - lo) / 120) * L * a, height: 146, background: "linear-gradient(180deg, rgba(220,40,30,.75), rgba(150,20,14,.75))" }} />
    </div>
    {[lo, hi].map((v, i) => <div key={i} style={{ ...at(px(v) - 22, 330 - (1 - a) * 300), width: 44, height: 300, background: `linear-gradient(90deg,#8a6a2c,#f3d77a,#8a6a2c)`, clipPath: i ? "polygon(0 0, 100% 0, 100% 80%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 80%)", filter: "drop-shadow(0 10px 10px rgba(0,0,0,.5))" }} />)}
    <div style={{ ...at(px(lo) - 22, 320 - (1 - a) * 300), width: px(hi) - px(lo) + 44, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#f3d77a,#8a6a2c)" }} />
    <Num tt={tt} d={0.8} x={px(lo)} y={240} txt="21" size={90} col={AMB} />
    <Num tt={tt} d={4.0} x={Math.min(1560, px(hi))} y={240} txt="115" size={90} col={RED} />
    <Tag tt={tt} at={1.0} x={960} y={860} txt="MIL MILLONES DE DÓLARES DE HOY" size={40} />
    <Tag tt={tt} at={1.4} x={960} y={110} txt="ESTIMACIÓN" col={AMB} size={36} />
  </>;
}}</Stage>;

// ---- 14:37 · LA MOCHILA DE PIEDRAS: línea de largada en una pista de arena; cuatro corredores de arcilla; al de HAITÍ le cargan piedras en la mochila de a una y se hunde ----
const Runner: React.FC<{ col: string; sink: number; pack: number; tt: number; i: number }> = ({ col, sink, pack, tt, i }) => <div style={{ position: "relative", width: 160, height: 360, transform: `translateY(${sink * 60}px) rotate(${pack * 6}deg)` }}>
  <div style={{ ...at(50, 0), width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${col})` }} />
  <div style={{ ...at(36, 70), width: 98, height: 160, borderRadius: 40, background: `radial-gradient(circle at 35% 25%, #fff, ${col} 70%)` }} />
  <div style={{ ...at(44, 220), width: 34, height: 140, borderRadius: 17, background: col, transform: `rotate(${8 * Math.sin(tt * 3 + i)}deg)`, transformOrigin: "50% 0" }} />
  <div style={{ ...at(92, 220), width: 34, height: 140, borderRadius: 17, background: col, transform: `rotate(${-8 * Math.sin(tt * 3 + i)}deg)`, transformOrigin: "50% 0" }} />
  {pack > 0 && <div style={{ ...at(-20, 80), width: 90, height: 150 * (0.6 + 0.4 * pack), borderRadius: 20, background: "linear-gradient(180deg,#6b4a2b,#3a2616)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}>{Array.from({ length: Math.floor(pack * 6) }, (_, j) => <div key={j} style={{ ...at(10 + (j % 2) * 34, -20 - Math.floor(j / 2) * 22), width: 40, height: 30, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%, #c9c4b6, #6d675c)" }} />)}</div>}
</div>;
export const TBackpack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const pack = eio(tt, 0.8, 4.4);
  return <>
    <div style={{ ...at(100, 760), width: 1720, height: 260, transform: "perspective(1400px) rotateX(55deg)", background: "radial-gradient(ellipse at 50% 30%, #d9c08a, #a88a52)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(140, 820), width: 1640, height: 14, background: "#f4f1ea" }} />
    {[0, 1, 2, 3].map((i) => { const s = phys(tt, 0.2 + i * 0.25, 7, 0.45); return s > 0.01 ? <div key={i} style={{ ...at(320 + i * 360, 470 - (1 - s) * 300), opacity: cl(s * 2) }}><Runner col={i === 1 ? "#e0b48a" : "#e8e4da"} sink={i === 1 ? pack : 0} pack={i === 1 ? pack : 0} tt={tt} i={i} /></div> : null; })}
    {Array.from({ length: 6 }, (_, j) => { const k = cl((tt - 0.8 - j * 0.6) * 2); return k > 0 && k < 1 ? <div key={j} style={{ ...at(700 - 20, 200 + 300 * k), width: 50, height: 38, borderRadius: "40%", background: "radial-gradient(circle at 35% 30%, #c9c4b6, #6d675c)" }} /> : null; })}
    <Tag tt={tt} at={0.6} x={760} y={330} txt="HAITÍ" col={AMB} size={56} />
    <Num tt={tt} d={1.2} x={960} y={160} txt="ARRANCA CON PIEDRAS" size={100} col={RED} />
  </>;
}}</Stage>;

// ---- 14:50 · EL CAMINO DEL GRANO (pasos): un grano de café grande baja por un sendero de montaña; en cada paso se achica y la pila de monedas que lleva colgada pierde monedas ----
export const TBeanPath: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st: [number, string][] = said.length >= 3 ? said : [[h.at + 0.3, "LA COSECHA, A MANO"], [h.at + 1.8, "A LOMO DE BURRO"], [h.at + 3.3, "LE PAGAN POCO"]];
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1), prog = cur < 0 ? 0 : cur + cl((t - st[cur][0]) / 1.2);
  const PTS = [[420, 360], [960, 560], [1480, 780]], seg = Math.min(1.999, prog * 0.999), i0 = Math.min(1, Math.floor(seg)), f = seg - i0;
  const bx = lerp(PTS[i0][0], PTS[i0 + 1][0], f), by = lerp(PTS[i0][1], PTS[i0 + 1][1], f), sc = lerp(1.35, 1.0, prog / 2), coins = Math.max(1, 8 - Math.round(prog * 3.5));
  return <>
    <div style={{ ...at(0, 300), width: 1920, height: 780, background: "linear-gradient(160deg, #4f7a3a 0 30%, #6f8a4a 50%, #8a7a52 80%)", clipPath: "polygon(0 0, 30% 10%, 60% 40%, 100% 60%, 100% 100%, 0 100%)", boxShadow: "inset 0 20px 60px rgba(0,0,0,.4)" }} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M420 380 Q700 420 960 580 T1480 800" fill="none" stroke="#c9a77a" strokeWidth={40} strokeLinecap="round" /><path d="M420 380 Q700 420 960 580 T1480 800" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={6} strokeDasharray="16 16" /></svg>
    {PTS.map(([x, y], i) => <div key={i} style={{ ...at(x - 70, y - 200), width: 140, height: 110, background: i <= cur ? "linear-gradient(180deg,#f2ecdc,#c9c0a8)" : "linear-gradient(180deg,#8a857a,#5a564d)", clipPath: "polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)", filter: "drop-shadow(0 10px 10px rgba(0,0,0,.5))" }} />)}
    <div style={{ ...at(bx - 80 * sc, by - 170 * sc), transform: `scale(${sc}) rotate(${10 * Math.sin(t * 3)}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ width: 160, height: 210, borderRadius: "50%", background: "radial-gradient(ellipse at 35% 30%, #9a6a3a, #5a3416 60%, #2a1606)", boxShadow: "0 20px 26px rgba(0,0,0,.6)" }}><div style={{ ...at(74, 20), width: 12, height: 170, borderRadius: 6, background: "#1e0f04", transform: "rotate(8deg)" }} /></div>
      <div style={{ ...at(170, 20), width: 4, height: 70, background: "#d9c79c" }} />
      {Array.from({ length: coins }, (_, j) => <div key={j} style={{ ...at(140, 90 - j * 14) }}><Coin r={22} /></div>)}
    </div>
    {cur >= 0 && <div key={cur} style={{ ...at(960, 160), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 76, color: AMB, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{cur + 1} · {st[cur][1]}</div>}
  </>;
}}</Stage>;

// ---- 16:26 · EL MAR DOS VECES: un globo terráqueo con relieve gira; un saco de café cruza el Atlántico a Francia y vuelve cruzando como moneda ----
export const TOcean2x: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const go = eio(tt, 0.8, 3.0), back = eio(tt, 3.4, 5.6), A = [720, 600], B = [1180, 440];
  const k = back > 0 ? back : go, x = back > 0 ? lerp(B[0], A[0], k) : lerp(A[0], B[0], k), y = (back > 0 ? lerp(B[1], A[1], k) : lerp(A[1], B[1], k)) - Math.sin(Math.PI * k) * 180;
  return <>
    <Floor x={960} y={960} w={800} />
    <div style={{ ...at(560, 200), width: 800, height: 800, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #4aa0c8, #1d5a7a 60%, #0c2a3a)", boxShadow: "inset -60px -40px 120px rgba(0,0,0,.6), 0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-((tt * 20) % 200)}px)` }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ ...at((i * 230) % 1000 - 100, 120 + (i * 137) % 520), width: 160 + (i % 3) * 60, height: 120 + (i % 2) * 80, borderRadius: "40% 60% 50% 45%", background: "radial-gradient(circle at 40% 40%, #8aa85a, #5a7a3a)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,.2)" }} />)}</div>
    </div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d={`M${A[0]} ${A[1]} Q${(A[0] + B[0]) / 2} ${A[1] - 360} ${B[0]} ${B[1]}`} fill="none" stroke="rgba(255,240,210,.6)" strokeWidth={6} strokeDasharray="18 14" /></svg>
    {[A, B].map(([px, py], i) => <div key={i} style={{ ...at(px - 14, py - 14), width: 28, height: 28, borderRadius: "50%", background: i ? ICE : GRN, boxShadow: "0 0 0 6px rgba(255,255,255,.6)" }} />)}
    {tt > 0.8 && (back > 0 ? <div style={{ ...at(x - 46, y - 46) }}><Coin r={46} txt="F" /></div> : <div style={{ ...at(x - 60, y - 70), width: 180, height: 210, borderRadius: "40% 40% 30% 30%", background: "repeating-linear-gradient(45deg,#c9b07a 0 8px,#a8905a 8px 16px)", boxShadow: "0 14px 16px rgba(0,0,0,.5)" }} />)}
    <Tag tt={tt} at={0.4} x={380} y={640} txt="HAITÍ" col={GRN} size={46} />
    <Tag tt={tt} at={0.6} x={1560} y={440} txt="FRANCIA" col={ICE} size={46} />
    <Num tt={tt} d={0.6} x={960} y={130} txt="DOS VECES" size={100} col={AMB} />
  </>;
}}</Stage>;

// ---- 16:45 · MÁS DE LA MITAD: un sobre de sueldo de papel madera con diez billetes; una pinza saca seis, de a uno, a una pila que dice DEUDAS; el sobre queda flaco ----
export const TPayslip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const out = (i: number) => eio(tt, 1.0 + i * 0.7, 1.6 + i * 0.7);
  return <>
    <Floor x={960} y={930} w={1400} />
    <div style={{ ...at(300, 460), width: 560, height: 400, background: "linear-gradient(180deg,#d9b884,#b8935a)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }}>
      <div style={{ ...at(30, 250), fontWeight: 900, fontSize: 40, color: "rgba(60,35,10,.75)" }}>LO QUE RECAUDA EL ESTADO</div>
    </div>
    {Array.from({ length: 10 }, (_, i) => { const o = i < 6 ? out(i) : 0, x = lerp(340 + i * 16, 1180 + (i % 2) * 30, o), y = lerp(330 + i * 6, 760 - i * 22, o) - Math.sin(Math.PI * o) * 200;
      return <div key={i} style={{ ...at(x, y), width: 420, height: 170, transform: `rotate(${lerp(-6 + i, (i % 2) * 6 - 3, o)}deg)`, background: "linear-gradient(135deg,#c9dcb8,#7fa86a)", border: "4px solid #3f6a35", borderRadius: 6, boxShadow: "0 8px 12px rgba(0,0,0,.4)", zIndex: o > 0 ? 2 : 0 }}><div style={{ ...at(170, 40), width: 80, height: 80, borderRadius: "50%", border: "5px solid #3f6a35" }} /></div>; })}
    {Array.from({ length: 6 }, (_, i) => { const k = cl((tt - 1.0 - i * 0.7) / 0.6); return k > 0 && k < 1 ? <div key={"p" + i} style={{ ...at(lerp(560, 1360, k), 260 - Math.sin(Math.PI * k) * 80), width: 30, height: 200, background: "linear-gradient(90deg,#8a9096,#eef1f4,#7a8086)", transform: "rotate(16deg)", borderRadius: 6 }} /> : null; })}
    <div style={{ ...at(300, 300), width: 560, height: 180, background: "linear-gradient(180deg,#e3c597,#c9a46c)", clipPath: "polygon(0 100%, 50% 30%, 100% 100%)" }} />
    <Tag tt={tt} at={1.4} x={1380} y={265} txt="A LAS DEUDAS" col={RED} size={50} />
    <Num tt={tt} d={0.3} x={960} y={150} txt="MÁS DE LA MITAD" size={110} col={AMB} />
  </>;
}}</Stage>;

// ---- 17:49 · EL 1 DE ENERO: un almanaque de taco grande arranca la hoja 31 DIC 1803 y aparece 1 ENE 1804; detrás sube el vapor de la sopa ----
export const TSoup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tear = eio(tt, 1.2, 2.4);
  return <>
    {Array.from({ length: 6 }, (_, i) => { const k = (tt * 0.25 + i / 6) % 1; return <div key={i} style={{ ...at(700 + (i * 97) % 520 + 40 * Math.sin(tt + i), 900 - k * 760), width: 120 + 120 * k, height: 120 + 120 * k, borderRadius: "50%", background: "rgba(255,250,240,.16)", filter: "blur(18px)", opacity: 1 - k }} />; })}
    <Floor x={960} y={940} w={700} />
    <div style={{ ...at(700, 220), width: 520, height: 680, borderRadius: 14, background: PAPER, boxShadow: "0 40px 60px rgba(0,0,0,.6)", overflow: "hidden", textAlign: "center" }}>
      <div style={{ height: 140, background: "#1f3f9a", color: "#fff", fontWeight: 900, fontSize: 64, lineHeight: "140px" }}>ENERO · 1804</div>
      <div style={{ fontWeight: 900, fontSize: 340, color: "#c21f2b", lineHeight: "420px" }}>1</div>
      <div style={{ fontWeight: 900, fontSize: 44, color: INK }}>LIBRES</div>
    </div>
    {tear < 1 && <div style={{ ...at(700, 220), width: 520, height: 680, borderRadius: 14, background: PAPER, transformOrigin: "50% 0", transform: `perspective(1400px) rotateX(${-100 * tear}deg) translateY(${300 * tear * tear}px) rotate(${-14 * tear}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.4)", overflow: "hidden", textAlign: "center", opacity: 1 - tear * 0.4 }}>
      <div style={{ height: 140, background: "#5a5a5a", color: "#fff", fontWeight: 900, fontSize: 64, lineHeight: "140px" }}>DIC · 1803</div>
      <div style={{ fontWeight: 900, fontSize: 340, color: "#222", lineHeight: "420px" }}>31</div>
    </div>}
    <div style={{ ...at(690, 200), width: 540, height: 36, borderRadius: 10, background: "linear-gradient(180deg,#9aa0a6,#4a4f55)" }} />
    <Tag tt={tt} at={2.6} x={960} y={130} txt="SOUP JOUMOU · LA SOPA DE LA LIBERTAD" col={AMB} size={38} />
  </>;
}}</Stage>;

// ---- 18:29 · LA CIUDADELA: una montaña en relieve; en la cima sube la fortaleza de piedra en forma de proa; los cañones asoman de a uno… y lo que llega es una carta lacrada ----
export const TFortress: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const rise = eio(tt, 0.4, 2.2), letter = phys(tt, 4.4, 6, 0.45);
  return <>
    <div style={{ ...at(260, 420), width: 1400, height: 560, background: "radial-gradient(ellipse at 50% 20%, #6f9a4a, #3f6a2a 60%, #2a4a1a)", clipPath: "polygon(0 100%, 20% 50%, 40% 22%, 50% 12%, 60% 22%, 80% 50%, 100% 100%)", boxShadow: "inset 0 30px 60px rgba(0,0,0,.4)" }} />
    <div style={{ ...at(510, 600 - 420 * rise), width: 900, height: 420 * rise, overflow: "hidden", filter: "drop-shadow(0 20px 20px rgba(0,0,0,.6))" }}>
      <div style={{ ...at(0, 0), width: 900, height: 420, background: "linear-gradient(90deg, rgba(0,0,0,.35), transparent 30%, transparent 70%, rgba(0,0,0,.4)), repeating-linear-gradient(0deg,#b8a988 0 46px,#8a7e66 46px 51px), #a89a80", clipPath: "polygon(0 30%, 80% 30%, 100% 60%, 80% 100%, 0 100%)", boxShadow: "inset 0 0 40px rgba(0,0,0,.4)" }}>
        {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ ...at(40 + i * 72, 96), width: 44, height: 40, background: "#c9b998", boxShadow: "inset 0 -8px 0 rgba(0,0,0,.25)" }} />)}
      </div>
      {Array.from({ length: 5 }, (_, i) => { const s = eio(tt, 2.2 + i * 0.35, 2.6 + i * 0.35); return <div key={"c" + i} style={{ ...at(70 + i * 130, 230), width: 50 + 70 * s, height: 34, borderRadius: 11, background: "linear-gradient(180deg,#555,#111)", transform: "translateX(-30px)" }} />; })}
    </div>
    {letter > 0.01 && <div style={{ ...at(960, 640), transform: `translate(-50%,-50%) translateY(${(1 - letter) * -500}px) rotate(${lerp(-30, -6, letter)}deg) scale(${0.6 + 0.4 * letter})`, width: 560, height: 360, background: PAPER, boxShadow: "0 30px 40px rgba(0,0,0,.6)", borderRadius: 6 }}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ ...at(50, 60 + i * 40), width: 440 - (i % 2) * 80, height: 6, background: "rgba(43,34,24,.3)" }} />)}
      <div style={{ ...at(420, 240), width: 100, height: 100, borderRadius: "48% 52% 46% 54%", background: "radial-gradient(circle at 38% 34%, #e04a3a, #8e1a12 70%)" }} />
    </div>}
    <Num tt={tt} d={0.4} x={960} y={150} txt="LA CIUDADELA" size={110} col={AMB} />
    {tt < 4.4 && <Tag tt={tt} at={1.0} x={960} y={260} txt="POR SI FRANCIA VOLVÍA" size={42} />}
    <Tag tt={tt} at={4.6} x={960} y={260} txt="VOLVIÓ CON UN PAPEL" col={RED} size={48} />
  </>;
}}</Stage>;

// ---- 19:14 · LA CIFRA CON CENTAVOS: una máquina de escribir de hierro; cada tecla baja y el tipo golpea; la hoja sube con US$ 21.685.135.571,48 y los centavos se encienden ----
export const TTypewriter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const S = "US$ 21.685.135.571,48", n = Math.floor(cl((tt - 0.6) / 4.6) * S.length), strike = (tt * 4.6) % 1 < 0.4 && n < S.length, hi = eio(tt, 5.4, 6.0);
  return <>
    <Floor x={960} y={950} w={1300} />
    <div style={{ ...at(510, 140 - n * 2), width: 900, height: 400, background: PAPER, boxShadow: "0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ ...at(0, 160), width: 900, textAlign: "center", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 70, color: INK, whiteSpace: "nowrap" }}>
        {S.slice(0, Math.min(n, S.length - 2))}<span style={{ color: hi > 0 ? "#c21f2b" : INK, background: `rgba(255,214,0,${0.6 * hi})`, borderRadius: 6 }}>{n > S.length - 2 ? S.slice(S.length - 2, n) : ""}</span>
      </div>
    </div>
    <div style={{ ...at(420, 520), width: 1080, height: 90, borderRadius: 45, background: "linear-gradient(180deg,#2a2c30,#0d0e10)", boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
    <div style={{ ...at(460, 580), width: 1000, height: 340, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(180deg,#3a3d41,#1a1b1d)", boxShadow: "0 40px 60px rgba(0,0,0,.7), inset 0 6px 0 rgba(255,255,255,.12)" }}>
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 11 - r }, (_, c) => { const idx = r * 11 + c, down = strike && idx === (n * 7) % 40;
        return <div key={r + "-" + c} style={{ ...at(70 + c * 80 + r * 40, 60 + r * 66 + (down ? 10 : 0)), width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f4f1ea, #b9b3a5)", boxShadow: down ? "0 2px 0 #333" : "0 10px 0 #333, 0 12px 12px rgba(0,0,0,.5)" }} />; }))}
    </div>
    {strike && <div style={{ ...at(940, 420), width: 40, height: 120, background: "linear-gradient(90deg,#666,#ddd,#666)", transform: "rotate(-10deg)", transformOrigin: "50% 100%" }} />}
    {tt > 5.6 && <div style={{ ...at(960, 400), transform: `translate(-50%,-50%) rotate(-8deg) scale(${1.6 - 0.6 * eio(tt, 5.6, 6.0)})`, opacity: eio(tt, 5.6, 5.9), border: "12px solid #c2261e", color: "#c2261e", padding: "0 34px", fontWeight: 900, fontSize: 84, borderRadius: 14, background: "rgba(255,240,230,.6)", whiteSpace: "nowrap" }}>FRANCIA DIJO QUE NO</div>}
  </>;
}}</Stage>;

// ---- 20:12 · LOS PAPELES DISPERSOS: tres archivadores metálicos (FRANCIA · EE. UU. · HAITÍ); los cajones se abren de a uno y las hojas vuelan en arco a una sola pila en la mesa del centro ----
export const TDrawers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const CAB: [number, string, string][] = [[240, "FRANCIA", ICE], [1460, "EE. UU.", RED], [850, "HAITÍ", GRN]], pile = Math.floor(cl((tt - 1.4) / 5) * 24);
  return <>
    <Floor x={960} y={940} w={1600} />
    {CAB.map(([x, lab, col], i) => { const op = eio(tt, 0.4 + i * 0.5, 1.0 + i * 0.5), xx = i === 2 ? x : x; return <div key={i} style={{ ...at(xx, 330), width: 220, height: 420 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "linear-gradient(90deg,#6d737a,#b9c2cb 40%,#5a6168)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
      {Array.from({ length: 3 }, (_, d) => <div key={d} style={{ ...at(14 + (d === 0 ? 40 * op : 0), 14 + d * 130), width: 192, height: 116, borderRadius: 6, background: "linear-gradient(180deg,#9aa4ad,#6a747e)", boxShadow: d === 0 ? `${40 * op}px 10px 20px rgba(0,0,0,.4)` : "inset 0 0 0 3px rgba(0,0,0,.2)" }}><div style={{ ...at(66, 50), width: 60, height: 14, borderRadius: 7, background: "#ddd" }} /></div>)}
      <div style={{ ...at(110, -70), transform: "translateX(-50%)", fontWeight: 900, fontSize: 42, color: col, whiteSpace: "nowrap", textShadow: "0 4px 14px #000" }}>{lab}</div>
    </div>; })}
    {Array.from({ length: 9 }, (_, i) => { const src = CAB[i % 3], k = ((tt * 0.9 + i / 9) % 1), sx = src[0] + 110, sy = 400; return tt > 1.2 ? <div key={i} style={{ ...at(lerp(sx, 960, k) - 70, lerp(sy, 760, k) - Math.sin(Math.PI * k) * 220), width: 140, height: 100, background: PAPER, transform: `rotate(${i * 30 + k * 200}deg)`, boxShadow: "0 6px 10px rgba(0,0,0,.4)", opacity: k > 0.95 ? 0 : 1 }} /> : null; })}
    <div style={{ ...at(760, 820), width: 400, height: 40, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: 6 }} />
    {Array.from({ length: pile }, (_, i) => <div key={"s" + i} style={{ ...at(860 + ((i * 7) % 9) - 4, 812 - i * 8), width: 200, height: 10, background: i % 2 ? PAPER : PAPERD, transform: `rotate(${(i * 13) % 6 - 3}deg)` }} />)}
    <Num tt={tt} d={3.6} x={960} y={130} txt="RECIÉN EN 2022, JUNTOS" size={76} col={AMB} />
  </>;
}}</Stage>;

// ---- 21:09 · EL ÁRBOL DE NOMBRES: un tronco con corteza; la raíz es el National City Bank; las ramas se juntan dos veces hasta la copa: CITIGROUP (cartel genérico, sin marca) ----
export const TMergeTree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const g = eio(tt, 0.4, 4.4), stamp = phys(tt, 5.0, 7, 0.35);
  const BR = ["M960 880 C960 760 960 700 960 640", "M960 640 C900 560 760 520 700 440", "M960 640 C1020 560 1160 520 1220 440", "M700 440 C760 360 880 330 960 300", "M1220 440 C1160 360 1040 330 960 300"];
  return <>
    <Floor x={960} y={930} w={1000} />
    <svg width={1920} height={1080} style={{ ...at(0, 0), filter: "drop-shadow(0 18px 16px rgba(0,0,0,.55))" }}>
      {BR.map((d, i) => { const k = cl(g * 5 - i * 0.8); return <path key={i} d={d} fill="none" stroke="#9a6a3c" strokeWidth={i === 0 ? 90 : 46} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - k)} />; })}
      {BR.map((d, i) => { const k = cl(g * 5 - i * 0.8); return <path key={"b" + i} d={d} fill="none" stroke="#7a5630" strokeWidth={i === 0 ? 20 : 10} strokeLinecap="round" strokeDasharray="20 30" strokeDashoffset={600 * (1 - k)} opacity={0.8} />; })}
      <path d="M960 880 C900 920 820 940 760 960 M960 880 C1020 920 1100 940 1160 960" stroke="#4a3018" strokeWidth={26} fill="none" opacity={g > 0 ? 1 : 0} />
      <ellipse cx={960} cy={260} rx={300 * eio(tt, 3.6, 4.6)} ry={150 * eio(tt, 3.6, 4.6)} fill="url(#crown)" />
      <defs><radialGradient id="crown" cx=".4" cy=".35"><stop offset="0" stopColor="#7ab05a" /><stop offset="1" stopColor="#2f5a22" /></radialGradient></defs>
    </svg>
    <Tag tt={tt} at={0.5} x={1360} y={860} txt="NATIONAL CITY BANK · 1914" col={AMB} size={38} />
    <Tag tt={tt} at={1.6} x={560} y={430} txt="FUSIÓN" size={32} />
    <Tag tt={tt} at={2.4} x={1360} y={430} txt="FUSIÓN" size={32} />
    {eio(tt, 3.8, 4.6) > 0 && <div style={{ ...at(960, 260), transform: `translate(-50%,-50%) scale(${eio(tt, 3.8, 4.6)})`, background: "#f4f1ea", color: "#1f3f9a", padding: "12px 40px", borderRadius: 10, fontWeight: 900, fontSize: 64, boxShadow: "0 16px 24px rgba(0,0,0,.5)" }}>CITIGROUP</div>}
    {stamp > 0.01 && <div style={{ ...at(1500, 700), transform: `translate(-50%,-50%) scale(${1.5 - 0.5 * stamp}) rotate(-10deg)`, opacity: cl(stamp * 2), border: "10px solid #3a8a4a", color: "#3a8a4a", padding: "4px 30px", fontWeight: 900, fontSize: 64, borderRadius: 12, background: "rgba(10,20,10,.4)" }}>SIGUE ABIERTO</div>}
  </>;
}}</Stage>;

export const HC2: Record<string, React.FC<{ t: number; h: H }>> = { fleet: TFleet, decree: TDecree, tape: TTape, cuphalf: TCupHalf, dotsratio: TDotsRatio, spread: TSpread,
  dominoes: TDominoes, cordon: TCordon, chests10: TChests10, loop: TLoop, chisel: TChisel, ledgerflip: TLedgerFlip, slices: TSlices, safekey: TSafeKey,
  goldbars: TGoldBars, tallymarks: TTallyMarks, generations: TGenerations, rangebar: TRangeBar, backpack: TBackpack, beanpath: TBeanPath, ocean2x: TOcean2x, payslip: TPayslip,
  soup: TSoup, fortress: TFortress, typewriter: TTypewriter, drawers: TDrawers, mergetree: TMergeTree };
