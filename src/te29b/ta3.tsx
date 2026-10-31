// te29b · REEMPLAZOS tras la 3.ª vuelta del evaluador (31-oct): «simple y perfecto le gana a ambicioso». Cada pieza = UN objeto grande con volumen,
// los elementos llegan de a uno con rebote, la acción corre hasta la salida y hay UN solo renglón de texto, lejos de los bordes. (parte 1 de 2)
import React from "react";
import { AMB, GRN, H, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { Coin, Floor, GOLD, INK, K, LIN, Num, PAPER, PAPERD, Sea, Slab, W, at, lerp } from "./tkit";

const pl = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;
// galeón de costado con tres velas hinchadas
const Galleon: React.FC<{ w: number; tt: number; i: number }> = ({ w, tt, i }) => <svg width={w} height={w * 0.95} viewBox="0 0 200 190" style={{ overflow: "visible", transform: `rotate(${2 * Math.sin(tt * 1.5 + i)}deg)` }}>
  <path d="M10 130 L190 130 L170 175 L30 175 Z" fill="#5a3a20" /><path d="M10 130 L190 130" stroke="#c9a35a" strokeWidth={5} /><path d="M24 150 L176 150" stroke="#2a1a0e" strokeWidth={3} />
  {[40, 70, 100, 130, 160].map((x) => <circle key={x} cx={x} cy={150} r={5} fill="#111" />)}
  {[50, 100, 150].map((x, j) => <g key={x}><line x1={x} y1={130} x2={x} y2={j === 1 ? 10 : 30} stroke="#3a2614" strokeWidth={5} />
    <path d={`M${x - 30} ${j === 1 ? 24 : 42} Q${x + 8} ${j === 1 ? 60 : 72} ${x - 30} ${j === 1 ? 110 : 112} L${x + 28} ${j === 1 ? 110 : 112} Q${x + 44} ${j === 1 ? 60 : 72} ${x + 28} ${j === 1 ? 24 : 42} Z`} fill="#f2ecdc" stroke="#b8ad94" strokeWidth={2} /></g>)}
  <path d="M100 10 L126 16 L100 22 Z" fill="#f4f1ea" />
</svg>;

// 0:14 · LA FLOTA: catorce galeones entran de a uno desde la derecha y se ponen en fila frente a la bahía; el contador sube 1 → 14
const XFleet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), step = (w - 0.9) / 14, n = Math.min(14, Math.floor((tt - 0.3) / step) + 1);
  return <>
    <Sea tt={tt} y={640} />
    {Array.from({ length: 14 }, (_, i) => { const back = i % 2 === 1, slot = Math.floor(i / 2), arr = eio(tt, 0.3 + i * step, 0.3 + i * step + 1.1);
      const x = lerp(1950, back ? 230 + slot * 215 : 150 + slot * 230, arr), y = back ? 420 : 520, sw = back ? 180 : 230;
      return arr > 0 ? <div key={i} style={{ ...at(x, y + 6 * Math.sin(tt * 1.4 + i)), zIndex: back ? 1 : 2, filter: back ? "brightness(.75)" : undefined }}><Galleon w={sw} tt={tt} i={i} /></div> : null; })}
    <Sea tt={tt + 2} y={790} front />
    <Num tt={tt} d={0.3} x={960} y={140} txt={pl(Math.max(1, n), "BARCO DE GUERRA", "BARCOS DE GUERRA")} size={96} col={n >= 14 ? RED : TX} />
  </>;
}}</Stage>;

// 0:38 · EL DECRETO: un pergamino con rodillos de madera se desenrolla hacia abajo; la cifra se escribe dígito a dígito con tinta; al final cae el lacre
const XDecree: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), open = eio(tt, 0.2, 1.4), num = "150.000.000", nd = Math.floor(LIN(tt, h, 1.4) * num.length * 1.0001), seal = phys(tt, w - 1.1, 8, 0.4), H0 = 560 * open;
  const Roller = ({ y }: { y: number }) => <div style={{ ...at(410, y), width: 1100, height: 50, borderRadius: 25, background: "linear-gradient(180deg,#a8743e,#5a3a20)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}><div style={{ ...at(-30, 5), width: 40, height: 40, borderRadius: "50%", background: "#3a2614" }} /><div style={{ ...at(1090, 5), width: 40, height: 40, borderRadius: "50%", background: "#3a2614" }} /></div>;
  return <>
    <Floor x={960} y={980} w={1200} />
    <div style={{ ...at(460, 220), width: 1000, height: H0, background: `linear-gradient(90deg,${PAPERD},${PAPER} 12%,${PAPER} 88%,${PAPERD})`, overflow: "hidden" }}>
      <div style={{ ...at(0, 70), width: 1000, textAlign: "center", fontWeight: 900, fontSize: 64, color: "#6a4a2a", letterSpacing: 6 }}>ORDONNANCE · 1825</div>
      <div style={{ ...at(0, 210), width: 1000, textAlign: "center", fontWeight: 900, fontSize: 150, color: INK, fontFamily: "Georgia, serif" }}>{num.slice(0, nd)}<span style={{ opacity: 0 }}>{num.slice(nd)}</span></div>
      <div style={{ ...at(0, 400), width: 1000, textAlign: "center", fontWeight: 900, fontSize: 70, color: "#6a4a2a", opacity: cl((nd - 10) * 2) }}>FRANCOS</div>
    </div>
    <Roller y={200} /><Roller y={200 + H0} />
    {seal > 0.01 && <div style={{ ...at(1300, 200 + H0 - 150), transform: `scale(${2 - Math.min(1, seal)})`, opacity: cl(seal * 3), width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e8574a,#8a1a12 70%)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />}
  </>;
}}</Stage>;

// 0:54 · LA CINTA MÉTRICA: carcasa amarilla de cinta métrica a la izquierda; la cinta de acero se estira hasta la salida y los años pasan de 1825 a 1947
const XTape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = K(tt, h, 0.3), L = 1300 * k, yr = Math.round(1825 + 122 * k);
  return <>
    <div style={{ ...at(0, 760), width: 1920, height: 320, background: "linear-gradient(180deg,#6b4a2b,#3f2a17)" }} />
    <Floor x={360} y={770} w={420} o={0.8} />
    <div style={{ ...at(460, 560), width: L, height: 90, background: "linear-gradient(180deg,#f6e27a,#d8b83a 60%,#9a7a1a)", boxShadow: "0 18px 20px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {Array.from({ length: Math.ceil(L / 26) }, (_, i) => <div key={i} style={{ ...at(i * 26, 0), width: 3, height: i % 5 ? 30 : 56, background: "#2a2216" }} />)}</div>
    <div style={{ ...at(440 + L, 540), width: 26, height: 130, background: "linear-gradient(90deg,#8a9096,#e0e4e8)", borderRadius: 4 }} />
    <div style={{ ...at(170, 440) }}><Slab w={330} h={300} depth={34} br="40px" side="#7a5a10" top="radial-gradient(circle at 35% 30%,#ffe07a,#e0a81e 55%,#9a6a10)">
      <div style={{ ...at(95, 80), width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,#2a2a2a,#555 60%,#2a2a2a)" }} /></Slab></div>
    <Num tt={tt} d={0.2} x={960} y={160} txt={`${yr}`} size={170} col={k > 0.98 ? RED : TX} />
    <Num tt={tt} d={0.4} x={960} y={300} txt={pl(Math.round(122 * k), "AÑO", "AÑOS")} size={70} col={AMB} />
  </>;
}}</Stage>;

// 2:30 · LA MITAD DEL CAFÉ: dos sacos vuelcan granos en una taza enorme; el de SAINT-DOMINGUE llena tanto como todo EL RESTO junto
const Sack: React.FC<{ w: number; lab: string; flip?: boolean }> = ({ w, lab, flip }) => <div style={{ width: w, height: w * 0.9, position: "relative", transform: `rotate(${flip ? 28 : -28}deg)` }}>
  <div style={{ position: "absolute", inset: 0, borderRadius: "30% 30% 24% 24% / 20% 20% 30% 30%", background: "linear-gradient(90deg,#8a6a3a,#d8b98a 45%,#7a5a2a)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }} />
  <div style={{ ...at(-60, w * 0.36), width: w + 120, textAlign: "center", fontWeight: 900, fontSize: 40, color: "#3a2614", whiteSpace: "nowrap", transform: `rotate(${flip ? -28 : 28}deg)` }}>{lab}</div></div>;
const XCupHalf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.5), lv = 300 * k;
  return <>
    <Floor x={960} y={960} w={1000} />
    <div style={{ ...at(80, 200) }}><Sack w={380} lab="SAINT-DOMINGUE" /></div>
    <div style={{ ...at(1460, 200) }}><Sack w={380} lab="EL RESTO" flip /></div>
    {Array.from({ length: 40 }, (_, i) => { const p = (tt * 1.1 + i / 40) % 1, L = i % 2 === 0; return tt > 0.5 ? <div key={i} style={{ ...at(L ? lerp(460, 820, p) : lerp(1460, 1100, p), 420 + p * p * (520 - lv - 420 + 120)), width: 22, height: 15, borderRadius: "50%", background: "#3a2414", transform: `rotate(${i * 40}deg)` }} /> : null; })}
    <svg width={1920} height={1080} style={at(0, 0)}><defs><clipPath id="cupc"><path d="M640 520 L1280 520 L1220 920 Q960 980 700 920 Z" /></clipPath></defs>
      <path d="M1270 600 Q1420 600 1400 740 Q1380 860 1240 850" fill="none" stroke="#e8e2d8" strokeWidth={40} />
      <path d="M640 520 L1280 520 L1220 920 Q960 980 700 920 Z" fill="#f2eee6" />
      <g clipPath="url(#cupc)"><rect x={640} y={940 - lv} width={320} height={lv + 60} fill="#3a2414" /><rect x={960} y={940 - lv} width={320} height={lv + 60} fill="#6a4426" />
        {Array.from({ length: Math.floor(k * 40) }, (_, i) => <ellipse key={i} cx={660 + (i * 53) % 600} cy={950 - lv + (i % 4) * 14} rx={14} ry={9} fill={i * 53 % 600 < 300 ? "#5a3820" : "#8a6040"} />)}</g>
      <path d="M640 520 L1280 520 L1220 920 Q960 980 700 920 Z" fill="url(#cupg)" /><defs><linearGradient id="cupg" x1="0" x2="1"><stop offset="0" stopColor="rgba(0,0,0,.25)" /><stop offset=".35" stopColor="rgba(255,255,255,.15)" /><stop offset="1" stopColor="rgba(0,0,0,.3)" /></linearGradient></defs>
      <ellipse cx={960} cy={520} rx={320} ry={40} fill="none" stroke="#fff" strokeWidth={12} /><line x1={960} y1={540} x2={960} y2={940} stroke="#e9b949" strokeWidth={6} strokeDasharray="18 12" /></svg>
  </>;
}}</Stage>;

// 3:00 · MEDIO MILLÓN CONTRA 40.000: dos frascos de vidrio grandes; en el izquierdo caen cuentas oscuras sin parar; en el derecho caen pocas claras
const Jar: React.FC<{ x: number; n: number; col: string; seed: number }> = ({ x, n, col, seed }) => <>
  <div style={{ ...at(x, 340), width: 520, height: 600, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.02) 30%, rgba(255,255,255,.14) 70%, rgba(255,255,255,.04))", border: "8px solid rgba(235,248,255,.7)", overflow: "hidden" }}>
    {Array.from({ length: n }, (_, i) => { const r = Math.floor(i / 14), c = i % 14; return <div key={i} style={{ ...at(10 + c * 35 + (r % 2) * 16, 560 - r * 30 - ((i * seed) % 7)), width: 32, height: 32, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${col} 55%)` }} />; })}</div>
  <div style={{ ...at(x + 40, 300), width: 440, height: 60, borderRadius: 14, background: "linear-gradient(180deg,#c9cdd1,#6a6e72)" }} />
</>;
const XDotsRatio: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = LIN(tt, h, 0.3), nL = Math.floor(k * 250), nR = Math.min(20, Math.floor(k * 20 + 0.5));
  return <>
    <Floor x={560} y={960} w={640} /><Floor x={1360} y={960} w={640} />
    <Jar x={300} n={nL} col="#5a3a26" seed={3} />
    <Jar x={1100} n={nR} col="#efe7da" seed={5} />
    <Num tt={tt} d={0.3} x={560} y={180} txt="500.000" size={110} col={AMB} />
    <Num tt={tt} d={0.8} x={1360} y={180} txt="40.000" size={110} col={TX} />
  </>;
}}</Stage>;

// 3:27 · EL LEVANTAMIENTO: maqueta en relieve de la colonia con sus pueblitos; el fuego salta de pueblo en pueblo del norte al sur hasta la salida
const XSpread: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.3), T: [number, number][] = [[520, 300], [760, 280], [1000, 300], [1240, 330], [620, 470], [880, 450], [1140, 480], [1380, 470], [760, 620], [1020, 610], [1280, 640]];
  return <>
    <Floor x={960} y={960} w={1600} />
    <div style={{ ...at(260, 180), transform: "perspective(1600px) rotateX(35deg)", transformOrigin: "50% 80%" }}>
      <Slab w={1400} h={640} depth={60} br="30% 40% 35% 25% / 40% 35% 40% 45%" side="#5a4a32" top="radial-gradient(ellipse at 45% 45%, #6a9a52, #4a7a3a 50%, #3a5a2a 75%, #e6d6a8 82%)" />
    </div>
    {T.map(([x, y], i) => { const lit = cl((k * 12 - i) * 1.5), f = 0.8 + 0.2 * Math.sin(tt * 9 + i * 2); return <div key={i} style={{ ...at(x, y) }}>
      <svg width={90} height={80} style={at(-45, -40)}><rect x={15} y={35} width={60} height={40} fill={lit > 0.3 ? "#5a3a2a" : "#e8dcc6"} /><path d="M8 38 L45 6 L82 38 Z" fill={lit > 0.3 ? "#3a2418" : "#a8442a"} /></svg>
      {lit > 0 && <div style={{ ...at(-50, -140 * lit * f), width: 100, height: 140 * lit * f, borderRadius: "50% 50% 30% 30% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 80%, #fff3a0, #ffa03a 40%, rgba(220,60,20,.0) 75%)", filter: "blur(2px)" }} />}
    </div>; })}
    <Num tt={tt} d={0.2} x={960} y={110} txt="AGOSTO DE 1791" size={96} col={AMB} />
  </>;
}}</Stage>;

// 3:49 · LE GANA A TODOS: cuatro fichas de dominó gigantes, cada una con su ejército; caen en cadena y la última es NAPOLEÓN
const XDominoes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = W(h), N = ["ESPAÑA", "INGLATERRA", "FRANCIA", "NAPOLEÓN"], C = ["#c2261e", "#2a4a9a", "#3a6ac8", "#1a2a6a"];
  return <>
    <div style={{ ...at(0, 900), width: 1920, height: 180, background: "linear-gradient(180deg,#5a4634,#2a1e14)" }} />
    {N.map((nm, i) => { const f = eio(tt, 0.6 + i * ((w - 1.4) / 4), 0.6 + (i + 1) * ((w - 1.4) / 4)), ang = (i < 3 ? 62 : 84) * f;
      return <div key={i} style={{ ...at(220 + i * 340, 400), width: 200, height: 500, transformOrigin: "100% 100%", transform: `rotate(${ang}deg)`, zIndex: 4 - i }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(90deg,#d8d2c4,#f8f4ea 40%,#c9c2b0)", boxShadow: "16px 16px 0 #8a8272, 0 30px 40px rgba(0,0,0,.5)" }} />
        <div style={{ ...at(30, 40), width: 140, height: 90, background: C[i], borderRadius: 6 }} />
        <div style={{ ...at(0, 160), width: 200, height: 320, display: "flex", alignItems: "center", justifyContent: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 900, fontSize: 64, color: i === 3 ? "#b8261e" : INK }}>{nm}</div>
      </div>; })}
    <Num tt={tt} d={0.2} x={960} y={150} txt="LE GANA A TODOS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 4:24 · EL CARTEL QUE CAMBIA: un cartel de estación con paletas que giran pasa de SAINT-DOMINGUE a HAITÍ, centrado, y al final un destello recorre el cartel
const XSplitFlap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const w = W(h), A = "SAINT-DOMINGUE", B = "    HAITÍ     ", n = A.length, sh = eio(tt, w * 0.7, w - 0.45);
  return <>
    <Floor x={960} y={800} w={1600} />
    <div style={{ ...at(140, 380), width: 1640, height: 300, borderRadius: 24, background: "linear-gradient(180deg,#2a2e33,#141618)", boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 4px 0 rgba(255,255,255,.08)", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => { const st = 0.5 + i * ((w * 0.6 - 0.5) / n), f = cl((tt - st) / 0.35), ch = f >= 1 ? B[i] : f > 0.5 ? "▒" : A[i];
        return <div key={i} style={{ ...at(30 + i * 113, 40), width: 104, height: 220, borderRadius: 8, background: "linear-gradient(180deg,#3a3f46,#22262b 49%,#111 50%,#2a2e33)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 150, color: f >= 1 ? AMB : "#f4f1ea", transform: `scaleY(${f > 0 && f < 1 ? Math.abs(Math.cos(f * Math.PI)) : 1})` }}>{ch === " " ? "" : ch}</div>; })}
      <div style={{ ...at(-400 + 2400 * sh, 0), width: 260, height: 300, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)", transform: "skewX(-20deg)" }} />
    </div>
  </>;
}}</Stage>;

// 5:10 · LO AISLARON: la isla grande y cercana; una cadena de boyas se va cerrando a su alrededor; un mercante llega, toca la cadena y da la vuelta
const XCordon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="#0e2a3a">{(tt) => {
  const w = W(h), k = eio(tt, 0.3, w * 0.55), sh = eio(tt, w * 0.45, w * 0.72), back = eio(tt, w * 0.72, w - 0.45), N = 28;
  const sx = lerp(1940, 1480, sh) + 300 * back, flip = back > 0 ? -1 : 1;
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, background: "radial-gradient(ellipse at 50% 55%, #1f5a72, #0a2230 75%)" }} />
    <div style={{ ...at(960 - 520, 560 - 250), width: 1040, height: 500, borderRadius: "46% 54% 40% 60% / 55% 45% 55% 45%", background: "radial-gradient(ellipse at 45% 40%, #6a9a52, #3a6a32 60%, #e6d6a8 76%, transparent 78%)", boxShadow: "0 30px 0 #4a3a22" }} />
    {Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2 - Math.PI / 2, on = cl(k * N - i); return on > 0 ? <div key={i} style={{ ...at(960 + Math.cos(a) * 760 - 22, 560 + Math.sin(a) * 380 - 22 - (1 - on) * 60), width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a6d,#c2261e 60%,#6a100a)", opacity: on, boxShadow: "0 6px 0 rgba(0,0,0,.4)" }} /> : null; })}
    <svg width={1920} height={1080} style={at(0, 0)}><path d={Array.from({ length: Math.floor(k * N) + 1 }, (_, i) => { const a = (i / N) * Math.PI * 2 - Math.PI / 2; return `${i ? "L" : "M"}${960 + Math.cos(a) * 760} ${560 + Math.sin(a) * 380}`; }).join(" ")} fill="none" stroke="#c9cdd1" strokeWidth={6} strokeDasharray="14 8" /></svg>
    {sh > 0 && <div style={{ ...at(sx, 470 + 6 * Math.sin(tt * 1.5)), transform: `scaleX(${flip})` }}><svg width={380} height={170}><path d="M0 80 L380 80 L340 160 L30 160 Z" fill="#2f343b" /><path d="M0 80 L380 80" stroke="#c9a35a" strokeWidth={6} /><rect x={60} y={30} width={90} height={50} fill="#8a5a34" /><rect x={170} y={30} width={90} height={50} fill="#6a4426" /><rect x={290} y={10} width={60} height={70} fill="#e8e4da" /></svg></div>}
    <Num tt={tt} d={0.2} x={960} y={120} txt="LO AISLARON" size={110} col={RED} />
  </>;
}}</Stage>;

// 6:24 · DIEZ AÑOS DE PRESUPUESTO: diez cofres de tesoro caen de a uno con rebote en dos filas de cinco; el contador de años va arriba, fijo
const Chest: React.FC<{ w: number }> = ({ w }) => <div style={{ position: "relative", width: w, height: w * 0.78 }}>
  <div style={{ ...at(0, 0), width: w, height: w * 0.32, borderRadius: `${w * 0.2}px ${w * 0.2}px 6px 6px`, background: "linear-gradient(180deg,#a8743e,#6a4426)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)" }} />
  <div style={{ ...at(0, w * 0.32), width: w, height: w * 0.46, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: "0 0 8px 8px", boxShadow: "0 14px 20px rgba(0,0,0,.5)" }} />
  {[0.15, 0.85].map((x) => <div key={x} style={{ ...at(w * x - w * 0.04, 0), width: w * 0.08, height: w * 0.78, background: `linear-gradient(90deg,#8a6414,${GOLD},#8a6414)` }} />)}
  <div style={{ ...at(w * 0.42, w * 0.26), width: w * 0.16, height: w * 0.18, borderRadius: 4, background: `linear-gradient(180deg,${GOLD},#8a6414)` }} />
</div>;
const XChests10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), step = (w - 1.0) / 10, n = Math.min(10, Math.max(0, Math.floor((tt - 0.3) / step) + 1));
  return <>
    <div style={{ ...at(0, 920), width: 1920, height: 160, background: "linear-gradient(180deg,#4a3a2a,#1e160e)" }} />
    {Array.from({ length: 10 }, (_, i) => { const d = phys(tt, 0.3 + i * step, 8, 0.45), r = Math.floor(i / 5), c = i % 5; return d > 0.01 ? <div key={i} style={{ ...at(250 + c * 290 + r * 0, (r ? 690 : 450) - (1 - Math.min(1, d)) * 400), opacity: cl(d * 3), zIndex: r }}><Chest w={250} /></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={190} txt={pl(Math.max(1, n), "AÑO DE PRESUPUESTO", "AÑOS DE PRESUPUESTO")} size={92} col={n >= 10 ? AMB : TX} />
  </>;
}}</Stage>;

// 7:06 · PRESTADO EN PARÍS: dos cajas fuertes grandes unidas por un caño de vidrio; las monedas salen de PARÍS, pasan por HAITÍ y vuelven a PARÍS; en el medio se caen las comisiones
const Safe: React.FC<{ lab: string }> = ({ lab }) => <Slab w={420} h={480} depth={40} br="18px" side="#2a2e33" top="linear-gradient(135deg,#6a7280,#3a4048 60%,#2a2e33)">
  <div style={{ ...at(30, 30), width: 360, height: 420, borderRadius: 14, border: "6px solid #8a9096" }} />
  <div style={{ ...at(150, 170), width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#c9cdd1,#5a5e62)", boxShadow: "0 0 0 10px #3a3d41" }} />
  <div style={{ ...at(0, 330), width: 420, textAlign: "center", fontWeight: 900, fontSize: 64, color: "#f4f1ea" }}>{lab}</div>
</Slab>;
const XLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L = LIN(tt, h, 0.4);
  const path = (p: number): [number, number] => p < 0.5 ? [lerp(560, 1360, p * 2), 330 - Math.sin(p * 2 * Math.PI) * 120] : [lerp(1360, 560, (p - 0.5) * 2), 760 + Math.sin((p - 0.5) * 2 * Math.PI) * 60];
  return <>
    <Floor x={960} y={980} w={1700} />
    <svg width={1920} height={1080} style={at(0, 0)}><path d="M560 330 Q960 90 1360 330" fill="none" stroke="rgba(220,240,255,.35)" strokeWidth={70} strokeLinecap="round" /><path d="M1360 760 Q960 880 560 760" fill="none" stroke="rgba(220,240,255,.35)" strokeWidth={70} strokeLinecap="round" />
      <path d="M560 330 Q960 90 1360 330" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={6} /><path d="M1360 760 Q960 880 560 760" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={6} /></svg>
    <div style={{ ...at(150, 320) }}><Safe lab="PARÍS" /></div>
    <div style={{ ...at(1350, 320) }}><Safe lab="HAITÍ" /></div>
    {Array.from({ length: 10 }, (_, i) => { const p = (tt * 0.25 + i / 10) % 1, [x, y] = path(p), drop = i % 3 === 0 && p > 0.62 && p < 0.9, dy = drop ? (p - 0.62) * 900 : 0;
      return tt > 0.4 + i * 0.1 * L ? <div key={i} style={{ ...at(x - 30, y - 30 + dy), opacity: drop ? 1 - cl((p - 0.62) * 4) : 1 }}><Coin r={30} /></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={110} txt="PRESTADO EN PARÍS, PARA PARÍS" size={80} col={AMB} />
  </>;
}}</Stage>;

// 9:51 · DE 150 A 90: una montaña de piedra grande con la cifra tallada; el cincel le baja la cima de 150 a 90; después el musgo verde de los intereses vuelve a subir por la ladera
const XChisel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), cut = eio(tt, 0.5, w * 0.5), moss = eio(tt, w * 0.55, w - 0.45), top = lerp(220, 420, cut), hit = Math.abs(Math.sin(tt * 9)) * (cut < 1 && cut > 0 ? 1 : 0);
  const val = Math.round(lerp(150, 90, cut));
  return <>
    <Floor x={960} y={960} w={1500} />
    <svg width={1920} height={1080} style={at(0, 0)}><defs><linearGradient id="mt3" x1="0" x2="1"><stop offset="0" stopColor="#6a655a" /><stop offset=".45" stopColor="#c9c2b0" /><stop offset="1" stopColor="#5a554a" /></linearGradient></defs>
      <path d={`M260 950 L${780} ${top} L${1140} ${top} L1660 950 Z`} fill="url(#mt3)" />
      {cut < 1 && <path d={`M780 ${top} L960 ${lerp(220, 420, 0) - 0} L1140 ${top} Z`} fill="#9a9384" opacity={1 - cut} />}
      <path d={`M260 950 L${260 + 640 * moss} ${950 - 360 * moss} L${260 + 640 * moss + 60} 950 Z`} fill="#4a8a3a" opacity={0.85} />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={300 + i * 60 * moss} cy={930 - i * 34 * moss} r={18} fill="#5aa04a" opacity={moss > 0.05 ? 0.9 : 0} />)}</svg>
    {cut < 1 && <div style={{ ...at(1120, top - 230 - 20 * hit), transform: "rotate(30deg)" }}><div style={{ width: 40, height: 200, background: "linear-gradient(90deg,#8a9096,#eef1f4,#6a7076)" }} /><div style={{ width: 70, height: 110, marginLeft: -15, background: "linear-gradient(90deg,#5a3a20,#a8743e,#5a3a20)", borderRadius: 10 }} /></div>}
    <div style={{ ...at(960, 700), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 170, color: "#3a362e", textShadow: "0 3px 0 rgba(255,255,255,.35)" }}>{val}</div>
    <Num tt={tt} d={w * 0.6} x={960} y={140} txt="+ INTERESES" size={96} col={GRN} />
  </>;
}}</Stage>;

// 10:22 · EL LIBRO MAYOR: un libro grueso abierto pasa páginas solo; en cada página cae el sello PAGADO con golpe; el total sube arriba
const XLedgerFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const per = 0.55, i = Math.floor(Math.max(0, tt - 0.3) / per), f = ((Math.max(0, tt - 0.3)) % per) / per, k = LIN(tt, h, 0.3);
  return <>
    <Floor x={960} y={960} w={1400} />
    <div style={{ ...at(300, 300), width: 1320, height: 600, perspective: 2000 }}>
      <div style={{ ...at(0, 20), width: 1320, height: 600, borderRadius: 16, background: "#5a2a1a" }} />
      <div style={{ ...at(20, 0), width: 640, height: 580, background: `linear-gradient(90deg,${PAPERD},${PAPER})`, boxShadow: "inset -20px 0 30px rgba(0,0,0,.2)" }}>
        {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ ...at(60, 120 + j * 48), width: 520, height: 3, background: "rgba(80,60,30,.3)" }} />)}
        <div style={{ ...at(0, 30), width: 640, textAlign: "center", fontWeight: 900, fontSize: 70, color: INK }}>{1826 + i * 4}</div>
        <div style={{ ...at(320, 330), transform: `translate(-50%,-50%) rotate(-14deg) scale(${f < 0.3 ? 1.8 - f * 2.6 : 1})`, opacity: f < 0.3 ? f * 3.3 : 1, border: "10px solid #c2261e", borderRadius: 14, padding: "6px 30px", fontWeight: 900, fontSize: 90, color: "#c2261e" }}>PAGADO</div>
      </div>
      <div style={{ ...at(660, 0), width: 640, height: 580, background: `linear-gradient(90deg,${PAPER},${PAPERD})` }}>{Array.from({ length: 9 }, (_, j) => <div key={j} style={{ ...at(60, 120 + j * 48), width: 520, height: 3, background: "rgba(80,60,30,.3)" }} />)}</div>
      <div style={{ ...at(660, 0), width: 640, height: 580, transformOrigin: "0 50%", transform: `rotateY(${-180 * eio(f, 0.55, 1)}deg)`, background: `linear-gradient(90deg,${PAPER},${PAPERD})`, boxShadow: "0 0 30px rgba(0,0,0,.3)" }} />
    </div>
    <Num tt={tt} d={0.2} x={960} y={160} txt={`${Math.round(lerp(10, 112, k))} MILLONES PAGADOS`} size={88} col={AMB} />
  </>;
}}</Stage>;

export const HC3: Record<string, React.FC<{ t: number; h: H }>> = { fleet: XFleet, decree: XDecree, tape: XTape, cuphalf: XCupHalf, dotsratio: XDotsRatio, spread: XSpread, dominoes: XDominoes,
  splitflap: XSplitFlap, cordon: XCordon, chests10: XChests10, loop: XLoop, chisel: XChisel, ledgerflip: XLedgerFlip };
