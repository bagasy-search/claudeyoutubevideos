// te29a · VUELTA 2 de los reemplazos (31-oct): lo que pidió el evaluador en cada pieza — objetos al doble, volumen (cara + canto + sombra de contacto),
// los elementos llegan de a uno con rebote y la acción corre hasta la salida. Un solo renglón arriba.
import React from "react";
import { AMB, GRN, H, ICE, RED, Stage, TX, cl, eio, phys } from "./hkit";
import { Island } from "./ta2";
import { Bill, Coin, Floor, K, LIN, Num, Person, Sea, Slab, W, at, lerp } from "./tkit";

// piedra de fosfato con poros y cráteres de verdad (no un huevo)
const Porous: React.FC<{ w: number; rot?: number; glow?: number }> = ({ w, rot = 0, glow = 0 }) => <svg width={w} height={w * 0.8} viewBox="0 0 200 160" style={{ transform: `rotate(${rot}deg)`, overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(140,255,170,${0.7 * glow}))` : undefined }}>
  <defs><radialGradient id={"pr" + w} cx="35%" cy="30%"><stop offset="0" stopColor="#f4eedd" /><stop offset=".5" stopColor="#c9c0a6" /><stop offset="1" stopColor="#6f6858" /></radialGradient></defs>
  <path d="M30 40 L62 14 L108 8 L150 20 L184 52 L192 96 L170 136 L120 154 L64 150 L22 122 L8 80 Z" fill={`url(#pr${w})`} />
  {Array.from({ length: 34 }, (_, i) => { const x = 30 + ((i * 47) % 150), y = 26 + ((i * 31) % 116), r = 2.5 + (i % 4) * 2; return <g key={i}><circle cx={x} cy={y} r={r} fill="rgba(60,52,40,.65)" /><circle cx={x + r * 0.35} cy={y + r * 0.35} r={r * 0.55} fill="rgba(255,250,235,.35)" /></g>; })}
  <path d="M30 40 L62 14 L108 8 L150 20 L184 52 L192 96 L170 136 L120 154 L64 150 L22 122 L8 80 Z" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={3} />
  <path d="M120 154 L170 136 L192 96 L184 52" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth={14} strokeLinejoin="round" />
</svg>;
// bandera con paño (la del Reino Unido en el cantón para AUS y NZ)
const Jack: React.FC<{ w: number }> = ({ w }) => <svg width={w} height={w / 2} viewBox="0 0 60 30"><rect width={60} height={30} fill="#012169" /><path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth={6} /><path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth={2} /><path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth={10} /><path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth={6} /></svg>;
const Flag: React.FC<{ w: number; kind: number }> = ({ w, kind }) => <div style={{ position: "relative", width: w, height: w / 2, boxShadow: "0 14px 30px rgba(0,0,0,.6)", borderRadius: 4, overflow: "hidden", background: "#012169" }}>
  {kind === 0 ? <Jack w={w} /> : <><div style={at(0, 0)}><Jack w={w / 2} /></div>
    {(kind === 1 ? [[0.75, 0.22], [0.62, 0.5], [0.85, 0.45], [0.75, 0.8], [0.25, 0.75]] : [[0.75, 0.22], [0.64, 0.5], [0.86, 0.45], [0.75, 0.8]]).map(([x, y], i) => <div key={i} style={{ ...at(x * w - w * 0.04, y * w * 0.5 - w * 0.04), width: w * 0.08, height: w * 0.08, background: kind === 1 ? "#fff" : "#C8102E", clipPath: "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }} />)}</>}
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(255,255,255,.18), transparent 30%, rgba(0,0,0,.2) 60%, rgba(255,255,255,.12) 80%, transparent)" }} />
</div>;

// 0:37 · TODA LA ISLA EN MEDIA HORA: isla enorme en perspectiva; un auto grande deja una huella roja continua; el tiempo corre arriba
const Car3: React.FC<{ w: number }> = ({ w }) => <div style={{ position: "relative", width: w, height: w * 0.52 }}>
  <div style={{ ...at(w * 0.06, w * 0.38), width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: "#151515", boxShadow: "inset 0 0 0 6px #555" }} />
  <div style={{ ...at(w * 0.7, w * 0.38), width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: "#151515", boxShadow: "inset 0 0 0 6px #555" }} />
  <div style={{ ...at(0, w * 0.16), width: w, height: w * 0.28, borderRadius: w * 0.08, background: "linear-gradient(180deg,#ff8a6d,#c4281e 60%,#7a1410)", boxShadow: `0 ${w * 0.08}px ${w * 0.1}px rgba(0,0,0,.55)` }} />
  <div style={{ ...at(w * 0.22, 0), width: w * 0.5, height: w * 0.2, borderRadius: `${w * 0.1}px ${w * 0.1}px 0 0`, background: "linear-gradient(180deg,#cfe3f3,#5d7c96)", border: `${w * 0.025}px solid #b8261e` }} />
</div>;
const XIslaSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.5), cx = 960, cy = 610, rx = 700, ry = 250, a = -Math.PI / 2 + k * Math.PI * 2;
  return <>
    <Floor x={960} y={960} w={1700} />
    <div style={{ ...at(960 - 820, 610 - 500), transform: "perspective(1600px) rotateX(55deg)", transformOrigin: "50% 50%" }}><Island w={1640} depth={70} /></div>
    <svg width={1920} height={1080} style={at(0, 0)}><path d={`M${cx} ${cy - ry} ${Array.from({ length: 90 }, (_, i) => { const b = -Math.PI / 2 + (i / 89) * Math.PI * 2 * k; return `L${cx + Math.cos(b) * rx} ${cy + Math.sin(b) * ry}`; }).join(" ")}`} fill="none" stroke="#e8402e" strokeWidth={18} strokeLinecap="round" opacity={0.9} /></svg>
    {tt > 0.5 && <div style={{ ...at(cx + Math.cos(a) * rx - 130, cy + Math.sin(a) * ry - 90), transform: `scaleX(${Math.sin(a) > 0 ? -1 : 1})` }}><Car3 w={260} /></div>}
    <Num tt={tt} d={0.2} x={960} y={140} txt={`${Math.round(30 * k)} MINUTOS`} size={110} col={k > 0.98 ? AMB : "#fff7ea"} />
  </>;
}}</Stage>;

// 1:00 · EL 80 %: isla enorme; la mina gris con borde de dientes se come el verde y dos volquetes amarillos dan vueltas por el borde
const Truck: React.FC<{ w: number }> = ({ w }) => <div style={{ position: "relative", width: w, height: w * 0.6 }}>
  <div style={{ ...at(0, w * 0.06), width: w * 0.62, height: w * 0.3, background: "linear-gradient(180deg,#ffd34a,#c9921a)", clipPath: "polygon(0 0,100% 0,92% 100%,6% 100%)" }} />
  <div style={{ ...at(w * 0.64, w * 0.1), width: w * 0.34, height: w * 0.26, borderRadius: 6, background: "linear-gradient(180deg,#ffe07a,#d29a1e)" }} />
  {[0.12, 0.45, 0.8].map((x, i) => <div key={i} style={{ ...at(w * x - w * 0.08, w * 0.34), width: w * 0.17, height: w * 0.17, borderRadius: "50%", background: "#1a1a1a" }} />)}
</div>;
const XBite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.2), p = 80 * k, R = 80 + 560 * Math.sqrt(k * 0.8);
  const blob = Array.from({ length: 48 }, (_, i) => { const b = (i / 48) * Math.PI * 2, r = R * (1 + 0.08 * Math.sin(i * 2.7) + 0.05 * Math.sin(i * 5.3)); return `${i ? "L" : "M"}${780 + Math.cos(b) * r} ${480 + Math.sin(b) * r * 0.62}`; }).join(" ") + "Z";
  return <>
    <Floor x={960} y={960} w={1700} />
    <div style={{ ...at(960 - 800, 140), transform: "perspective(1700px) rotateX(42deg)", transformOrigin: "50% 60%" }}>
      <Slab w={1600} h={960} depth={70} br="47% 53% 50% 50% / 52% 46% 54% 48%" side="#6b5a3e" top="radial-gradient(ellipse at 50% 50%, #4f8a52 62%, #e6d6a8 66%, #e6d6a8 71%, #2a7f96 73%)">
        <svg width={1600} height={960} style={at(0, 0)}><defs><pattern id="bt" width={40} height={40} patternUnits="userSpaceOnUse"><rect width={40} height={40} fill="#a8a294" /><path d="M0 40 L20 6 L40 40" fill="#c9c3b3" /><path d="M20 6 L40 40 L30 40 Z" fill="#7f7a6c" /></pattern></defs>
          <path d={blob} fill="url(#bt)" stroke="#6a6458" strokeWidth={10} /></svg>
        {[0, 1].map((i) => { const b = tt * 0.7 + i * Math.PI; return <div key={i} style={{ ...at(780 + Math.cos(b) * (R + 40) - 50, 480 + Math.sin(b) * (R + 40) * 0.62 - 30) }}><Truck w={100} /></div>; })}
      </Slab>
    </div>
    <Num tt={tt} d={0.1} x={960} y={140} txt={`${Math.round(p)} % MINADO`} size={110} col={p > 79 ? RED : "#fff7ea"} />
  </>;
}}</Stage>;

// 2:37 · LA PIEDRA: la piedra porosa grande sobre el piso; la puerta de madera se cierra con el viento y rebota contra ella; la piedra se ilumina
const XDoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), sw = phys(tt, 0.5, 4.2, 0.35), ang = lerp(-75, -12, Math.min(1.08, sw)), glow = eio(tt, 0.5 + 0.9, w - 0.45);
  return <>
    <div style={{ ...at(0, 860), width: 1920, height: 220, background: "linear-gradient(180deg,#5a4634,#2a1e14)" }} />
    <Floor x={760} y={880} w={760} o={0.8} />
    <div style={{ ...at(420, 330) }}><Porous w={680} rot={-4 + 6 * LIN(tt, h)} glow={glow} /></div>
    <div style={{ ...at(1120, 210), width: 560, height: 670, perspective: 1400 }}>
      <div style={{ width: 560, height: 670, transformOrigin: "100% 50%", transform: `rotateY(${ang}deg)`, background: "repeating-linear-gradient(90deg,#8a5a34 0 34px,#74482a 34px 70px)", boxShadow: "inset 10px 0 0 #a8743e, inset -10px 0 0 #5a3a20, -20px 20px 50px rgba(0,0,0,.6)", borderRadius: 6 }}>
        <div style={{ ...at(40, 320), width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#a87a1c)" }} />
      </div>
    </div>
    <Num tt={tt} d={0.2} x={760} y={150} txt="UN TOPE DE PUERTA" size={92} col={AMB} />
  </>;
}}</Stage>;

// 2:59 · EL MATRAZ: matraz ancho; la piedra porosa cae y salpica; de ella nacen burbujas y el líquido vira a verde y sube
const XFlask: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fall = eio(tt, 0.3, 1.0), k = K(tt, h, 0.9), sp = cl((tt - 1.0) * 2.2), lv = lerp(700, 470, LIN(tt, h, 1.0));
  const liq = `rgba(${Math.round(lerp(170, 90, k))},${Math.round(lerp(210, 225, k))},${Math.round(lerp(230, 110, k))},.82)`;
  const P = "M860 160 L1060 160 L1060 400 L1400 880 Q1420 950 1350 950 L570 950 Q500 950 520 880 L860 400 Z";
  return <>
    <Floor x={960} y={960} w={1100} />
    <svg width={1920} height={1080} style={at(0, 0)}>
      <defs><clipPath id="fk5"><path d={P} /></clipPath></defs>
      <g clipPath="url(#fk5)"><rect x={400} y={lv} width={1100} height={600} fill={liq} /><rect x={400} y={lv} width={1100} height={10} fill="rgba(255,255,255,.4)" />
        {Array.from({ length: 26 }, (_, i) => { const p = ((tt * (0.35 + (i % 5) * 0.1) + i / 26) % 1), y = 860 - p * (860 - lv); return tt > 1.0 ? <circle key={i} cx={960 + Math.sin(i * 1.7 + p * 4) * (40 + p * 260)} cy={y} r={7 + (i % 4) * 5} fill="rgba(255,255,255,.6)" /> : null; })}
      </g>
      <path d={P} fill="rgba(220,240,255,.1)" stroke="rgba(235,248,255,.9)" strokeWidth={10} />
      <path d="M890 190 L890 410 L580 860" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={14} strokeLinecap="round" />
      {sp > 0 && sp < 1 && Array.from({ length: 12 }, (_, i) => <circle key={"s" + i} cx={960 + Math.cos(i * 0.55 - 3) * 300 * sp} cy={lv - Math.sin(Math.PI * sp) * 200 - (i % 3) * 14} r={14 - 9 * sp} fill={liq} />)}
    </svg>
    <div style={{ ...at(960 - 120, lerp(-260, 760, fall)) }}><Porous w={240} rot={20 * tt} /></div>
    <Num tt={tt} d={1.1} x={960} y={110} txt="FOSFATO" size={100} col={GRN} />
  </>;
}}</Stage>;

// 3:08 · DOS MACETAS: macetas enormes; la de la izquierda se marchita de a poco; la de la derecha echa espigas doradas una por una; etiquetas colgando
const Pot5: React.FC<{ x: number; n: number; droop: number; gold: number; tt: number }> = ({ x, n, droop, gold, tt }) => <>
  {Array.from({ length: 14 }, (_, i) => { const g = cl(n - i), hh = (300 + (i * 37) % 140) * g, xx = x - 220 + i * 33, sw = 3 * Math.sin(tt * 1.5 + i) + droop * (i < 7 ? -40 : 40);
    return g > 0 ? <div key={i} style={{ ...at(xx, 560 - hh), width: 11, height: hh, background: droop > 0 ? "linear-gradient(180deg,#b9a35a,#7a6a2a)" : "linear-gradient(180deg,#9ab84a,#5a7a2a)", transform: `rotate(${sw}deg)`, transformOrigin: "50% 100%" }}>
      {gold > 0 && <div style={{ ...at(-16, -84), width: 42, height: 96, borderRadius: "50% 50% 40% 40%", background: `repeating-linear-gradient(0deg, #e9b949 0 12px, #c9952a 12px 17px)`, transform: `scale(${phys(tt, 0.3 + i * 0.25, 7, 0.45)})`, transformOrigin: "50% 100%" }} />}</div> : null; })}
  <svg width={620} height={420} style={at(x - 310, 540)}><defs><linearGradient id={"pt" + x} x1="0" x2="1"><stop offset="0" stopColor="#8a4424" /><stop offset=".4" stopColor="#d07a4e" /><stop offset="1" stopColor="#7a3a1e" /></linearGradient></defs>
    <path d="M30 40 L590 40 L520 400 L100 400 Z" fill={`url(#pt${x})`} /><path d="M10 0 L610 0 L610 56 L10 56 Z" fill="#c9714a" /><ellipse cx={310} cy={10} rx={300} ry={18} fill="#4a2d16" /></svg>
</>;
const Tag5: React.FC<{ x: number; txt: string; col: string; sw: number }> = ({ x, txt, col, sw }) => <div style={{ ...at(x, 640), transform: `rotate(${sw}deg)`, transformOrigin: "50% -60px" }}>
  <div style={{ ...at(-2, -60), width: 4, height: 60, background: "#ddd" }} />
  <div style={{ transform: "translateX(-50%)", padding: "14px 30px", background: "#f1ead9", borderRadius: 10, fontWeight: 900, fontSize: 58, color: col, whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>{txt}</div></div>;
const XWheat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = K(tt, h, 0.3);
  return <>
    <div style={{ ...at(60, 940), width: 1800, height: 70, background: "linear-gradient(180deg,#8a5a34,#4a2d16)", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    <Pot5 x={500} n={6} droop={k} gold={0} tt={tt} />
    <Pot5 x={1420} n={14 * k + 2} droop={0} gold={1} tt={tt} />
    <Tag5 x={500} txt="SIN FÓSFORO" col="#b8261e" sw={3 * Math.sin(tt * 1.3)} />
    <Tag5 x={1420} txt="CON FÓSFORO" col="#2f7a3a" sw={3 * Math.sin(tt * 1.3 + 1)} />
  </>;
}}</Stage>;

// 3:34 · LA COLUMNA DE AÑOS: un tubo de vidrio ancho en perspectiva; una gaviota grande cruza y deja caer una capa con grosor; la columna sube hasta arriba
const Gull: React.FC<{ w: number; f: number }> = ({ w, f }) => <svg width={w} height={w * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible" }}>
  <path d={`M100 60 Q60 ${30 - 40 * f} 0 ${50 - 50 * f} Q50 ${60 - 10 * f} 90 70 Z`} fill="#eef0f2" stroke="#9aa3ad" strokeWidth={3} />
  <path d={`M100 60 Q140 ${30 - 40 * f} 200 ${50 - 50 * f} Q150 ${60 - 10 * f} 110 70 Z`} fill="#dfe3e8" stroke="#9aa3ad" strokeWidth={3} />
  <ellipse cx={100} cy={68} rx={30} ry={14} fill="#f6f7f8" /><circle cx={128} cy={62} r={10} fill="#f6f7f8" /><path d="M136 62 L152 66 L136 68 Z" fill="#e8a33a" /></svg>;
const XStrata: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 12, n = LIN(tt, h, 0.3) * N, w = 640, x0 = 640, base = 920, LH = 50;
  const gp = (tt * 0.45) % 1;
  return <>
    <Floor x={960} y={950} w={1000} />
    {Array.from({ length: Math.ceil(n) }, (_, i) => { const f = Math.min(1, n - i), y = base - (i + 1) * LH; return <div key={i} style={{ ...at(x0, y + LH * (1 - f) - 30 * (1 - f)), width: w, height: LH, opacity: f }}>
      <div style={{ position: "absolute", inset: 0, background: i % 2 ? "linear-gradient(90deg,#9a8e70,#efe7cf 40%,#b9ae8f)" : "linear-gradient(90deg,#8a7e60,#d6ccae 40%,#a99e80)" }} />
      <div style={{ ...at(0, -22), width: w, height: 44, borderRadius: "50%", background: i % 2 ? "#f4ecd4" : "#e0d6b8" }} /></div>; })}
    <div style={{ ...at(x0 - 10, 220), width: w + 20, height: base - 220 + 30, borderRadius: "0 0 50% 50% / 0 0 40px 40px", border: "8px solid rgba(235,248,255,.75)", borderTop: "none", background: "linear-gradient(90deg, rgba(255,255,255,.12), transparent 30%, transparent 70%, rgba(255,255,255,.18))" }} />
    <div style={{ ...at(x0 - 10, 196), width: w + 20, height: 56, borderRadius: "50%", border: "8px solid rgba(235,248,255,.85)" }} />
    <div style={{ ...at(-300 + gp * 2500, 300 + 30 * Math.sin(tt * 2)) }}><Gull w={280} f={0.5 + 0.5 * Math.sin(tt * 8)} /></div>
    {gp > 0.36 && gp < 0.56 && <div style={{ ...at(-300 + 0.42 * 2500 + 140, 380 + (gp - 0.36) * 2000), width: 26, height: 30, borderRadius: "50%", background: "#f4f1ea" }} />}
    <Num tt={tt} d={0.2} x={960} y={130} txt="MILES DE AÑOS" size={100} col={AMB} />
  </>;
}}</Stage>;

// 4:22 · TRES DUEÑOS: la isla gruesa se parte en tres gajos que se separan; sobre cada gajo se clava la bandera de su dueño
const XSplit3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = K(tt, h, 0.4), N: string[] = h.names ?? ["GRAN BRETAÑA", "AUSTRALIA", "NUEVA ZELANDA"];
  return <>
    <Floor x={960} y={900} w={1300} />
    {[0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * (Math.PI * 2 / 3), dx = Math.cos(a + Math.PI / 3) * 150 * k, dy = Math.sin(a + Math.PI / 3) * 90 * k;
      return <div key={i} style={{ ...at(960 - 550 + dx, 540 - 290 + dy), width: 1100, height: 600, clipPath: `polygon(50% 50%, ${50 + 72 * Math.cos(a)}% ${50 + 72 * Math.sin(a)}%, ${50 + 72 * Math.cos(a + 1.05)}% ${50 + 72 * Math.sin(a + 1.05)}%, ${50 + 72 * Math.cos(a + 2.094)}% ${50 + 72 * Math.sin(a + 2.094)}%)` }}>
        <div style={{ ...at(0, 36), width: 1100, height: 560, borderRadius: "47% 53% 50% 50% / 52% 46% 54% 48%", background: "#5a4a32" }} />
        <div style={{ ...at(0, 0), width: 1100, height: 560, borderRadius: "47% 53% 50% 50% / 52% 46% 54% 48%", background: "radial-gradient(ellipse at 50% 50%, #5a9a5c 60%, #e6d6a8 66%, #e6d6a8 71%, transparent 72%)" }} />
      </div>; })}
    {[0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * (Math.PI * 2 / 3) + Math.PI / 3, x = 960 + Math.cos(a) * (220 + 150 * k), y = 540 + Math.sin(a) * (130 + 90 * k), s = phys(tt, 0.9 + i * 0.5, 6.5, 0.45);
      return s > 0.01 ? <div key={"f" + i} style={{ ...at(x, y - 300), transform: `translateY(${(1 - s) * -200}px)`, opacity: cl(s * 2) }}>
        <div style={{ ...at(0, 0), width: 8, height: 230, background: "#ddd" }} />
        <div style={{ ...at(8, 0) }}><Flag w={230} kind={i} /></div>
        <div style={{ ...at(-120, 240), width: 480, textAlign: "center", fontWeight: 900, fontSize: 50, color: TX, textShadow: "0 4px 16px #000, 0 0 6px #000", whiteSpace: "nowrap" }}>{N[i]}</div>
      </div> : null; })}
  </>;
}}</Stage>;

// 5:27 · EL CORTE (pasos): bloque grande en corte; los árboles caen uno a uno, después una pala de excavadora con dientes arrastra cada capa; quedan los picos de coral
const Bucket: React.FC<{ w: number }> = ({ w }) => <svg width={w} height={w} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
  <path d="M60 -400 L60 10" stroke="#e0a81e" strokeWidth={14} /><path d="M60 -400 L60 10" stroke="#8a6410" strokeWidth={4} />
  <path d="M10 10 L90 10 L90 60 Q60 95 10 80 Z" fill="#f0b82a" stroke="#7a5a10" strokeWidth={4} />
  {[14, 30, 46, 62, 78].map((x) => <path key={x} d={`M${x} 82 L${x + 6} 98 L${x + 12} 84`} fill="#9aa0a6" stroke="#4a4e52" strokeWidth={2} />)}</svg>;
const XCutaway: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{() => {
  const said: [number, string][] = (h.steps ?? []).filter((s: [number, string]) => s[0] < h.out - 0.5);
  const st: [number, string][] = said.length >= 3 ? said : [[h.at + 0.3, "SE TALA"], [h.at + 1.6, "SE SACA LA TIERRA"], [h.at + 2.9, "SE SACA EL FOSFATO"], [h.at + 4.2, "QUEDAN LOS PICOS DE CORAL"]];
  const cur = st.reduce((a, s, i) => (t >= s[0] ? i : a), -1), dur = (i: number) => Math.min(2.4, ((st[i + 1]?.[0] ?? h.out) - st[i][0]) * 0.8);
  const gone = (i: number) => (cur > i ? 1 : cur === i ? eio(t, st[i][0] + 0.2, st[i][0] + dur(i)) : 0);
  const X0 = 260, WW = 1400, L = [{ y: 430, hh: 120, bg: "linear-gradient(180deg,#7a5a3a,#5a3f24)" }, { y: 550, hh: 190, bg: "linear-gradient(180deg,#e2d8bc,#b9ae8f)" }];
  const fell = gone(0);
  return <>
    <Floor x={960} y={960} w={1600} />
    <div style={{ ...at(X0, 740), width: WW, height: 210, background: "linear-gradient(180deg,#f0eadc,#b9b3a5)", clipPath: "polygon(0 100%, 0 30%, 4% 0, 8% 40%, 13% 6%, 18% 44%, 24% 2%, 30% 38%, 36% 8%, 42% 46%, 48% 4%, 54% 40%, 60% 10%, 66% 44%, 72% 2%, 78% 38%, 84% 8%, 90% 44%, 96% 6%, 100% 30%, 100% 100%)" }} />
    {L.map((l, i) => { const g = gone(i + 1); return <div key={i} style={{ ...at(X0, l.y), width: WW * (1 - g), height: l.hh + (i === 1 ? 50 : 0), background: l.bg, boxShadow: "inset 0 8px 0 rgba(255,255,255,.14), inset 0 -10px 0 rgba(0,0,0,.2)" }} />; })}
    {gone(1) < 1 && Array.from({ length: 9 }, (_, j) => { const f = cl(fell * 9 - j); return <div key={j} style={{ ...at(X0 + 60 + j * 150, 430 - 230), width: 120, height: 230, transformOrigin: "50% 100%", transform: `rotate(${f * 88}deg)`, opacity: 1 - cl((f - 0.85) * 6) }}>
      <div style={{ ...at(52, 120), width: 16, height: 110, background: "#5a3a20" }} /><div style={{ ...at(0, 0), width: 120, height: 150, borderRadius: "50% 50% 44% 44%", background: "radial-gradient(circle at 40% 35%, #7faa5a, #2f5a22)" }} /></div>; })}
    {cur >= 1 && cur <= 2 && gone(cur) < 1 && <div style={{ ...at(X0 + WW * (1 - gone(cur)) - 10, L[cur - 1].y - 40) }}><Bucket w={200} /></div>}
    {cur >= 0 && <div key={cur} style={{ ...at(960, 140), transform: "translate(-50%,-50%)", fontWeight: 900, fontSize: 84, color: cur === st.length - 1 ? AMB : TX, textShadow: "0 6px 24px #000", opacity: cl((t - st[cur][0]) * 3), whiteSpace: "nowrap" }}>{st[cur][1]}</div>}
  </>;
}}</Stage>;

// 5:58 · LA CARGA: barco enorme de costado; desde el brazo de carga cae un chorro de granos que llena la bodega; el barco se hunde hasta la línea roja
const XCantilever: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = K(tt, h, 0.3), sink = 80 * k, bx = 280, by = 500 + sink + 6 * Math.sin(tt * 1.6);
  return <>
    <Sea tt={tt} y={720} />
    <div style={{ ...at(1400, 60), width: 70, height: 700, background: "linear-gradient(90deg,#4a4e54,#8a9096,#3a3d41)" }} />
    <div style={{ ...at(700, 120), width: 800, height: 46, background: "linear-gradient(180deg,#8a9096,#3a3d41)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(780, 166), width: 120, height: 60, background: "#3a3d41", clipPath: "polygon(0 0,100% 0,70% 100%,30% 100%)" }} />
    {Array.from({ length: 80 }, (_, i) => { const p = (tt * 1.2 + i / 80) % 1, yy = 226 + p * (by - 140 - 226 + 40); return tt > 0.4 ? <div key={i} style={{ ...at(836 + ((i * 13) % 28) - 14 + p * ((i % 5) - 2) * 10, yy), width: 12 + (i % 3) * 4, height: 10 + (i % 3) * 3, borderRadius: "40%", background: i % 4 ? "#e2d8bc" : "#b9ae8f" }} /> : null; })}
    <div style={{ ...at(bx, by) }}>
      <div style={{ ...at(260, 100 - 220 * k), width: 600, height: 220 * k + 20, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "linear-gradient(160deg,#f2ead6,#b9b09a)" }} />
      <svg width={1360} height={300}><path d="M0 120 L1360 120 L1260 280 L90 280 Z" fill="#2f343b" /><path d="M0 120 L1360 120" stroke="#c9a35a" strokeWidth={8} /><rect x={0} y={230 - sink * 0.9} width={1360} height={12} fill="#c2261e" /><rect x={1110} y={10} width={150} height={110} fill="#e8e4da" /><rect x={1160} y={-50} width={44} height={70} fill="#8a2a1e" /></svg>
    </div>
    <Sea tt={tt + 2} y={860} front />
    <Num tt={tt} d={0.2} x={400} y={130} txt="A LOS BARCOS" size={96} col={AMB} />
  </>;
}}</Stage>;

// 7:14 · LA DEPORTACIÓN: barco grande con doce personas bien separadas zarpa con estela; en el viaje se apagan cinco; vuelve con siete
const XDeport: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), go = eio(tt, 0.3, w * 0.45), lost = eio(tt, w * 0.3, w * 0.7), turn = eio(tt, w * 0.62, w * 0.82), back = eio(tt, w * 0.78, w - 0.45);
  const x = 140 + 360 * go - 260 * back, flip = 1 - 2 * turn;
  const gone = [1, 3, 6, 8, 10];
  return <>
    <Sea tt={tt} y={720} />
    <div style={{ ...at(x, 330 + 8 * Math.sin(tt * 1.4)), width: 1400, transform: `scaleX(${flip})`, transformOrigin: "700px 50%" }}>
      <div style={{ ...at(80, -40), display: "flex", gap: 24 }}>{Array.from({ length: 12 }, (_, i) => { const gi = gone.indexOf(i), off = gi >= 0 ? cl(lost * 5 - gi) : 0;
        return <div key={i} style={{ width: 80, height: 192, position: "relative" }}><div style={{ opacity: 1 - off, transform: `translateY(${off * 50}px)` }}><Person w={80} col="#f0e6d2" /></div>
          {off > 0 && <div style={{ ...at(0, 0), opacity: off * 0.5 }}><Person w={80} col="rgba(240,240,240,.15)" /></div>}</div>; })}</div>
      <svg width={1400} height={300} style={at(0, 160)}><path d="M0 20 L1400 20 L1290 210 L100 210 Z" fill="#4a3424" /><path d="M0 20 L1400 20" stroke="#c9a35a" strokeWidth={8} /><path d="M50 80 L1350 80 M90 140 L1320 140" stroke="rgba(0,0,0,.25)" strokeWidth={6} /></svg>
      {go > 0.02 && go < 0.98 && <svg width={500} height={60} style={at(-480, 330)}>{[0, 1, 2].map((j) => <path key={j} d={`M500 ${20 + j * 14} Q250 ${10 + j * 20 + 6 * Math.sin(tt * 3 + j)} 0 ${30 + j * 10}`} stroke="rgba(255,255,255,.55)" strokeWidth={6 - j * 1.5} fill="none" />)}</svg>}
    </div>
    <Sea tt={tt + 2} y={860} front />
    <Num tt={tt} d={0.2} x={960} y={140} txt={lost < 0.2 ? "1.200 A CHUUK" : "VOLVIERON MENOS"} size={110} col={lost < 0.2 ? TX : RED} />
  </>;
}}</Stage>;

// 8:29 · LA MUDANZA: un cajón de madera enorme con casitas adentro cuelga de la grúa; viaja a la derecha; cae el sello NO y el cajón vuelve
const XMoveBox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w = W(h), up = eio(tt, 0.3, w * 0.35), stamp = phys(tt, w * 0.45, 7, 0.4), back = eio(tt, w * 0.6, w - 0.45);
  const x = 260 + 520 * up - 520 * back, y = 420 - 120 * up + 120 * back, sw = 3 * Math.sin(tt * 1.8);
  return <>
    <Floor x={x + 380} y={950} w={800} o={0.5} />
    <div style={{ ...at(0, 70), width: 1920, height: 40, background: "repeating-linear-gradient(90deg,#e0a81e 0 60px,#3a3a3a 60px 120px)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(x + 330, 110), width: 120, height: 50, background: "#3a3d41" }} />
    <div style={{ ...at(x + 380, 160), width: 12, height: y - 160 + 10, background: "#2a2a2a" }} />
    <div style={{ ...at(x, y), transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" }}>
      <Slab w={760} h={420} depth={40} side="#5a3a20" top="repeating-linear-gradient(90deg,#b07a46 0 90px,#8a5a34 90px 100px)">
        <div style={{ ...at(30, 60), width: 700, height: 300, background: "rgba(0,0,0,.35)" }} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...at(60 + i * 170, 170 - (i % 2) * 30) }}><svg width={140} height={170}><rect x={10} y={60} width={120} height={110} fill={["#e8dcc6", "#d6e4ec", "#f0d6c0", "#e4e8c8"][i]} /><path d="M0 64 L70 0 L140 64 Z" fill="#a8442a" /><rect x={55} y={110} width={30} height={60} fill="#5a3a20" /></svg></div>)}
        <div style={{ ...at(0, 120), width: 760, height: 26, background: "#7a4e2c" }} /><div style={{ ...at(0, 280), width: 760, height: 26, background: "#7a4e2c" }} />
      </Slab>
    </div>
    {stamp > 0.01 && <div style={{ ...at(x + 380, y + 210), transform: `translate(-50%,-50%) rotate(-12deg) scale(${2.4 - 1.4 * Math.min(1, stamp)})`, opacity: cl(stamp * 3) * (1 - back * 0.6), padding: "10px 60px", border: "14px solid #d8231a", borderRadius: 18, fontWeight: 900, fontSize: 180, color: "#d8231a", background: "rgba(255,240,230,.85)" }}>NO</div>}
    <Num tt={tt} d={0.2} x={960} y={190} txt="A CURTIS ISLAND" size={92} col={AMB} />
  </>;
}}</Stage>;

// 9:19 · LA BANDERA: el paño azul de Nauru con su franja y la estrella de 12 puntas sube ondeando por el mástil; al costado se arranca la hoja del almanaque y aparece el 31
const Star12: React.FC<{ r: number }> = ({ r }) => <svg width={r * 2} height={r * 2} viewBox="-50 -50 100 100"><path d={Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? 22 : 48; return `${i ? "L" : "M"}${Math.cos(a) * rr} ${Math.sin(a) * rr}`; }).join(" ") + "Z"} fill="#fff" /></svg>;
const XFlag68: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = K(tt, h, 0.3), y = lerp(600, 270, k), tear = eio(tt, 0.6, 1.6), FW = 660, FH = 330;
  const cols = 24, sl = FW / cols;
  return <>
    <Floor x={1010} y={960} w={500} />
    <div style={{ ...at(1000, 250), width: 22, height: 710, background: "linear-gradient(90deg,#8a9096,#f0f2f4,#6a7076)", borderRadius: 11 }} />
    <div style={{ ...at(992, 230), width: 38, height: 38, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#fff1b8,#a87a1c)" }} />
    <div style={{ ...at(1022, y) }}>{Array.from({ length: cols }, (_, i) => { const wv = Math.sin(tt * 4 - i * 0.45) * (6 + i * 0.9), sh = 0.8 + 0.25 * Math.cos(tt * 4 - i * 0.45);
      return <div key={i} style={{ ...at(i * sl, wv), width: sl + 1, height: FH, overflow: "hidden", filter: `brightness(${sh})` }}>
        <div style={{ ...at(-i * sl, 0), width: FW, height: FH, background: "#002b7f" }}><div style={{ ...at(0, FH * 0.46), width: FW, height: FH * 0.08, background: "#ffc61e" }} /><div style={{ ...at(FW * 0.13, FH * 0.56) }}><Star12 r={56} /></div></div>
      </div>; })}</div>
    <div style={{ ...at(260, 380), width: 420, height: 460, borderRadius: 14, background: "#f4efe4", boxShadow: "0 20px 40px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ height: 100, background: "#c2261e", color: "#fff", fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "100px" }}>ENERO</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 250, color: INK5, lineHeight: "330px" }}>31</div>
      <div style={{ ...at(0, 100), width: 420, height: 360, background: "#f4efe4", transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${-110 * tear}deg)`, opacity: 1 - cl((tear - 0.8) * 5), textAlign: "center", fontWeight: 900, fontSize: 250, color: INK5, lineHeight: "330px" }}>30</div>
    </div>
    <Num tt={tt} d={0.2} x={960} y={130} txt="31 DE ENERO DE 1968" size={84} col={AMB} />
  </>;
}}</Stage>;
const INK5 = "#2b2620";

// 9:44 · LA CATARATA DE PLATA: monedas de plata grandes caen girando sobre la isla y arman una montaña de monedas apiladas que no para de crecer
const XCascade: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.3), M = 3 + Math.floor(k * 9);
  return <>
    <Floor x={960} y={960} w={1500} />
    <div style={{ ...at(960 - 640, 700), transform: "perspective(1600px) rotateX(58deg)", transformOrigin: "50% 50%" }}><Island w={1280} depth={60} /></div>
    {Array.from({ length: M }, (_, r) => { const n = M - r; return <div key={r} style={{ ...at(960 - n * 46, 800 - r * 30), display: "flex", gap: 2 }}>{Array.from({ length: n }, (_, j) => <div key={j} style={{ width: 90, height: 34, borderRadius: "50%", background: "linear-gradient(180deg,#ffffff,#b9c2ca 50%,#6d7680)", boxShadow: "0 6px 0 #5d666f" }} />)}</div>; })}
    {Array.from({ length: 22 }, (_, i) => { const p = (tt * 0.8 + i / 22) % 1, x = 960 + ((i * 173) % 900) - 450; return tt > 0.3 ? <div key={i} style={{ ...at(x, -100 + p * (800 - M * 30)), transform: `rotateY(${(tt * 300 + i * 40) % 360}deg) rotate(${i * 20}deg)` }}><Coin r={42} silver /></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={130} txt="UNA CATARATA DE PLATA" size={96} col={ICE} />
  </>;
}}</Stage>;

// 12:05 · LA TORRE: la torre crece piso por piso con rebote y la cámara sube con ella; cada piso prende sus ventanas; la grúa arriba
const XTower: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const N = 52, k = LIN(tt, h, 0.3), nf = k * N, FH = 26, cam = Math.max(0, nf * FH - 520), top = 980 - nf * FH + cam;
  return <>
    <div style={{ ...at(0, 0), width: 1920, height: 1080, transform: `translateY(${cam}px)` }}>
      <div style={{ ...at(0, 980), width: 1920, height: 300, background: "linear-gradient(180deg,#2a2e33,#141618)" }} />
      {Array.from({ length: Math.ceil(nf) }, (_, i) => { const f = Math.min(1, nf - i), d = phys(f, 0, 6, 0.5); return <div key={i} style={{ ...at(700, 980 - (i + 1) * FH - (1 - d) * 60), width: 520, height: FH - 2, opacity: cl(f * 3), display: "flex" }}>
        <div style={{ width: 400, height: FH - 2, background: "linear-gradient(90deg,#3a4250,#5a6676)", display: "flex", gap: 6, padding: "4px 10px" }}>{Array.from({ length: 10 }, (_, j) => <div key={j} style={{ flex: 1, background: (i * 7 + j * 3) % 5 ? "#ffd98a" : "#2a3038", opacity: f > 0.6 ? 1 : 0.3 }} />)}</div>
        <div style={{ width: 120, height: FH - 2, background: "linear-gradient(90deg,#2a2f38,#1a1e24)", transform: "skewY(-20deg)", transformOrigin: "0 0" }} /></div>; })}
      <div style={{ ...at(780, 980 - nf * FH - 260) }}><svg width={700} height={260}><rect x={40} y={0} width={18} height={260} fill="#e0a81e" /><rect x={-200} y={0} width={760} height={16} fill="#e0a81e" /><path d="M-180 16 L560 16" stroke="#8a6410" strokeWidth={3} strokeDasharray="12 10" /><line x1={420} y1={16} x2={420} y2={150 + 20 * Math.sin(tt * 2)} stroke="#222" strokeWidth={4} /><rect x={380} y={150 + 20 * Math.sin(tt * 2)} width={80} height={30} fill="#5a6676" /></svg></div>
    </div>
    <div style={{ display: "none" }}>{top}</div>
    <Num tt={tt} d={0.2} x={400} y={180} txt={`${Math.max(1, Math.round(nf))}`} size={190} col={nf >= 51.5 ? AMB : "#fff7ea"} />
    <Num tt={tt} d={0.3} x={400} y={310} txt="PISOS" size={60} />
  </>;
}}</Stage>;

// 13:49 · LA DEMANDA: un sobre lacrado enorme sale de la isla, cruza el cielo en arco largo y entra en el edificio de columnas; el mazo golpea dos veces
const XEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = W(h), fly = eio(tt, 0.3, w * 0.6), g = (n: number) => phys(tt, w * 0.62 + n * 0.5, 9, 0.3);
  const x = lerp(260, 1340, fly), y = 640 - Math.sin(Math.PI * fly) * 420, s = lerp(1, 0.55, fly), hit = Math.max(Math.abs(1 - g(0)) < 0.15 ? 1 : 0, 0);
  return <>
    <Floor x={1380} y={950} w={900} />
    <div style={{ ...at(60, 760), transform: "perspective(1400px) rotateX(55deg)" }}><Island w={600} depth={40} /></div>
    <div style={{ ...at(1060, 320) }}><svg width={640} height={630}><path d="M0 120 L320 0 L640 120 Z" fill="#e8e2d2" stroke="#a89e86" strokeWidth={6} /><rect x={20} y={120} width={600} height={40} fill="#d6cfbd" />
      {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={50 + i * 100} y={160} width={50} height={400} fill="url(#col5)" /></g>)}
      <defs><linearGradient id="col5" x1="0" x2="1"><stop offset="0" stopColor="#9a9282" /><stop offset=".45" stopColor="#f4efe4" /><stop offset="1" stopColor="#8a8272" /></linearGradient></defs>
      <rect x={0} y={560} width={640} height={70} fill="#c9c2b0" /><rect x={260} y={380} width={120} height={180} fill="#2a2420" /></svg></div>
    {fly < 0.99 && <div style={{ ...at(x - 200 * s, y - 130 * s), transform: `rotate(${lerp(-12, 10, fly)}deg) scale(${s})`, transformOrigin: "0 0" }}>
      <div style={{ width: 400, height: 260, background: "linear-gradient(160deg,#f6f0e0,#d8ccb0)", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.6)", position: "relative", overflow: "hidden" }}>
        <svg width={400} height={260} style={at(0, 0)}><path d="M0 0 L200 140 L400 0" fill="none" stroke="#a89e86" strokeWidth={5} /></svg>
        <div style={{ ...at(165, 105), width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#e8574a,#8a1a12)" }} /></div></div>}
    {fly > 0.95 && <div style={{ ...at(1260, 660), transformOrigin: "100% 100%", transform: `rotate(${-50 + 50 * Math.min(1, Math.max(g(0), g(1) * 0.98))}deg)` }}>
      <div style={{ ...at(0, 0), width: 220, height: 90, borderRadius: 18, background: "linear-gradient(180deg,#a8743e,#5a3a20)" }} /><div style={{ ...at(180, 70), width: 26, height: 200, background: "#7a4e2c" }} /></div>}
    <div style={{ display: "none" }}>{hit}</div>
    <Num tt={tt} d={0.2} x={760} y={140} txt="DEMANDA A AUSTRALIA" size={92} col={AMB} />
  </>;
}}</Stage>;

// 15:07 · SIN LUZ: lamparita enorme colgando del cable parpadea y se apaga mientras la aguja del tanque cae a VACÍO
const XGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = K(tt, h, 0.3), ang = lerp(-60, 60, k), fl = k < 0.55 ? 1 : k < 0.9 ? (Math.sin(tt * 37) > 0.1 ? 0.95 : 0.15) : 0.05 + 0.1 * (1 - k);
  return <>
    <div style={{ ...at(1340, 0), width: 6, height: 250, background: "#222" }} />
    <div style={{ ...at(1343 - 300, 300 - 300), width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,214,120,${0.45 * fl}), transparent 65%)` }} />
    <div style={{ ...at(1300, 240), width: 86, height: 70, background: "linear-gradient(90deg,#6a6e72,#c9cdd1,#5a5e62)", borderRadius: 8 }} />
    <div style={{ ...at(1243, 300), width: 200, height: 230, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: fl > 0.5 ? "radial-gradient(circle at 45% 60%, #fffbe8, #ffd76a 50%, rgba(255,200,90,.7))" : "radial-gradient(circle at 40% 35%, rgba(255,255,255,.35), rgba(140,150,160,.25) 60%)", border: "4px solid rgba(255,255,255,.5)" }}>
      <svg width={200} height={230} style={at(0, 0)}><path d="M80 10 L80 120 Q100 80 120 120 L120 10" fill="none" stroke={fl > 0.5 ? "#fff" : "#555"} strokeWidth={5} /></svg></div>
    <div style={{ ...at(220, 330), width: 760, height: 620 }}>
      <svg width={760} height={620}><path d="M60 520 A320 320 0 0 1 700 520" fill="none" stroke="#1d2024" strokeWidth={100} /><path d="M60 520 A320 320 0 0 1 700 520" fill="none" stroke="url(#gg5)" strokeWidth={80} />
        <defs><linearGradient id="gg5" x1="0" x2="1"><stop offset="0" stopColor="#c2261e" /><stop offset=".35" stopColor="#e9b949" /><stop offset="1" stopColor="#3fae5a" /></linearGradient></defs>
        <text x={40} y={600} fontSize={64} fontWeight={900} fill="#ff5a4a">E</text><text x={680} y={600} fontSize={64} fontWeight={900} fill="#6fe39a">F</text></svg>
      <div style={{ ...at(380 - 10, 520 - 300), width: 20, height: 300, background: "linear-gradient(90deg,#8a1a12,#ff5a4a)", borderRadius: 10, transformOrigin: "50% 100%", transform: `rotate(${-ang}deg)` }} />
      <div style={{ ...at(380 - 40, 520 - 40), width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#eee,#555)" }} />
    </div>
    <Num tt={tt} d={0.2} x={600} y={160} txt="SIN COMBUSTIBLE, SIN LUZ" size={80} col={RED} />
  </>;
}}</Stage>;

// 15:39 · LA GÓNDOLA: caen al estante, de a uno y con rebote, una bolsa de HARINA, un paquete de AZÚCAR y una botella de GASEOSA gigantes; detrás se siguen apilando latas
const Prod: React.FC<{ kind: number }> = ({ kind }) => kind === 0 ? <div style={{ width: 300, height: 380, borderRadius: "40px 40px 20px 20px", background: "linear-gradient(90deg,#d8ccb0,#f6f0e0 45%,#c9bea0)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 60, color: "#2a4a8a", clipPath: "polygon(4% 6%,20% 0,40% 5%,60% 0,80% 5%,96% 0,100% 100%,0 100%)" }}>HARINA</div>
  : kind === 1 ? <div style={{ width: 280, height: 330, borderRadius: 10, background: "linear-gradient(90deg,#c0d0e8,#ffffff 45%,#a8b8d0)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 56, color: "#c2261e" }}>AZÚCAR</div>
  : <div style={{ position: "relative", width: 170, height: 440 }}><div style={{ ...at(60, 0), width: 50, height: 90, background: "linear-gradient(90deg,#5a1a12,#c2261e,#5a1a12)", borderRadius: "10px 10px 0 0" }} />
    <div style={{ ...at(0, 80), width: 170, height: 360, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(90deg,#3a0e0a,#8a2018 40%,#3a0e0a)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(-50, 210), width: 270, height: 90, background: "#e8402e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 46, color: "#fff", borderRadius: 6 }}>GASEOSA</div></div>;
const XShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const w = W(h), nc = Math.floor(LIN(tt, h, 1.6) * 14);
  return <>
    <div style={{ ...at(120, 380), width: 1680, height: 30, background: "linear-gradient(180deg,#c9cdd1,#6a6e72)" }} />
    {Array.from({ length: nc }, (_, i) => { const d = phys(tt, 1.6 + i * ((w - 2.1) / 14), 8, 0.45); return <div key={i} style={{ ...at(170 + i * 115, 230 - (1 - Math.min(1, d)) * 200), width: 100, height: 150, borderRadius: 10, background: `linear-gradient(90deg,#8a9096,${["#d8231a", "#2a6ac8", "#e9b949"][i % 3]} 30%,#f0f2f4 50%,#8a9096)`, boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} />; })}
    <div style={{ ...at(120, 900), width: 1680, height: 40, background: "linear-gradient(180deg,#c9cdd1,#6a6e72)", boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    {[0, 1, 2].map((i) => { const d = phys(tt, 0.2 + i * 0.45, 7, 0.4); return d > 0.01 ? <div key={i} style={{ ...at([360, 830, 1300][i], [520, 570, 460][i] - (1 - Math.min(1, d)) * 400), opacity: cl(d * 3) }}><Prod kind={i} /></div> : null; })}
    <Num tt={tt} d={0.2} x={960} y={110} txt="TODO EN LATA Y EN BOLSA" size={84} col={AMB} />
  </>;
}}</Stage>;

// 16:48 · EL DESVÍO: carguero grande con estela hacia la boya de AUSTRALIA; baja una barrera de peaje roja y blanca; el barco gira 180° y se va hacia NAURU
const XReroute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const w = W(h), go = eio(tt, 0.2, w * 0.4), bar = phys(tt, w * 0.35, 6, 0.45), turn = eio(tt, w * 0.5, w * 0.72), back = eio(tt, w * 0.7, w - 0.45);
  const x = lerp(120, 560, go) - 380 * back, flip = 1 - 2 * turn;
  return <>
    <Sea tt={tt} y={700} />
    <div style={{ ...at(1500, 360), width: 50, height: 420, background: "linear-gradient(90deg,#8a9096,#f0f2f4,#6a7076)" }} />
    <div style={{ ...at(1525 - 700, 380), width: 700, height: 44, transformOrigin: "100% 50%", transform: `rotate(${80 * (1 - Math.min(1.05, bar))}deg)`, background: "repeating-linear-gradient(90deg,#d8231a 0 70px,#f4f1ea 70px 140px)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <div style={{ ...at(1330, 250), padding: "10px 26px", background: "#f1ead9", borderRadius: 10, fontWeight: 900, fontSize: 56, color: INK5, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>AUSTRALIA</div>
    <div style={{ ...at(x, 440 + 8 * Math.sin(tt * 1.4)), width: 900, transform: `scaleX(${flip})`, transformOrigin: "450px 50%" }}>
      <svg width={900} height={300}><path d="M0 150 L900 150 L820 290 L60 290 Z" fill="#2f343b" /><path d="M0 150 L900 150" stroke="#c9a35a" strokeWidth={8} />
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={120 + i * 120} y={90} width={110} height={60} fill={["#c2261e", "#2a6ac8", "#e9b949", "#3fae5a", "#c2261e"][i]} stroke="#1a1a1a" strokeWidth={3} />)}
        <rect x={720} y={30} width={110} height={120} fill="#e8e4da" /><rect x={760} y={-10} width={40} height={50} fill="#8a2a1e" /></svg>
      {Array.from({ length: 3 }, (_, j) => <div key={j} style={{ ...at(-260 - j * 40, 270 + j * 10), width: 300, height: 8, borderRadius: 4, background: "rgba(255,255,255,.5)", opacity: go > 0.02 ? 1 : 0 }} />)}
    </div>
    <Sea tt={tt + 2} y={840} front />
    <Num tt={tt} d={0.2} x={760} y={140} txt={turn > 0.5 ? "← A NAURU" : "TAMPA · 2001"} size={110} col={turn > 0.5 ? RED : AMB} />
  </>;
}}</Stage>;

// 19:30 · LA PILA: billetes gruesos caen de a uno y la pila sube junto a una persona con su regla de altura; pasa el marco de la puerta
const XBillStack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = LIN(tt, h, 0.3), n = Math.floor(k * 34), d = phys(tt, 0.3 + (n * (W(h) - 0.75)) / 34, 9, 0.5);
  return <>
    <Floor x={960} y={960} w={1500} />
    <div style={{ ...at(300, 140), width: 30, height: 810, background: "linear-gradient(90deg,#c9cdd1,#6a6e72)" }} />
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ ...at(330, 940 - i * 100), width: i % 2 ? 30 : 50, height: 5, background: "#c9cdd1" }} />)}
    <div style={{ ...at(1240, 230), width: 330, height: 720, border: "26px solid #6a4426", borderBottom: "none", boxShadow: "inset 0 0 0 6px #4a2d16, 0 20px 40px rgba(0,0,0,.5)", background: "linear-gradient(180deg,#2a2018,#1a1410)" }} />
    <div style={{ ...at(480, 470) }}><Person w={200} col="#2a2622" /></div>
    {Array.from({ length: n + 1 }, (_, i) => { const yy = 920 - i * 22 - (i === n ? (1 - Math.min(1, d)) * 260 : 0); return <div key={i} style={{ ...at(780 + ((i * 17) % 14) - 7, yy), width: 380, height: 26, borderRadius: 4, background: "linear-gradient(180deg,#d6e4c4,#86ad6e 70%,#4a6a3c)", border: "3px solid #3f6a35", boxShadow: "0 4px 6px rgba(0,0,0,.4)", opacity: i === n ? cl(d * 3) : 1 }} />; })}
    <div style={{ display: "none" }}><Bill w={10} /></div>
    <Num tt={tt} d={0.2} x={960} y={110} txt={`A$ ${(3 * k).toFixed(1).replace(".", ",")} M POR PERSONA`} size={80} col={AMB} />
  </>;
}}</Stage>;

// 20:59 · LA PESCA DE NOCHE: canoa grande con un pescador de pie; el farol abre un cono de luz; los peces voladores saltan con estela y caen en la red que se cierra
const XLantern: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="#05101a">{(tt) => {
  const k = LIN(tt, h, 0.3), caught = Math.floor(k * 6), net = 0.5 + 0.5 * Math.sin(tt * 1.6);
  return <>
    <div style={{ ...at(560, 300), width: 1100, height: 700, background: "radial-gradient(ellipse at 30% 30%, rgba(255,214,120,.35), transparent 60%)" }} />
    <Sea tt={tt} y={700} />
    <div style={{ ...at(300, 560 + 8 * Math.sin(tt * 1.3)) }}>
      <svg width={1000} height={260}><path d="M0 120 Q500 200 1000 120 L930 220 Q500 270 70 220 Z" fill="#6a4426" /><path d="M0 120 Q500 200 1000 120" stroke="#a8743e" strokeWidth={10} fill="none" /></svg>
      <div style={{ ...at(560, -210) }}><Person w={140} col="#0e0c0a" /></div>
      <div style={{ ...at(300, -60), width: 12, height: 200, background: "#3a2a1a" }} />
      <div style={{ ...at(284, -110), width: 44, height: 60, borderRadius: 10, background: "radial-gradient(circle,#fff6d0,#ffb84a 60%,#a8641a)", boxShadow: "0 0 80px 30px rgba(255,190,90,.5)" }} />
      <svg width={600} height={500} style={{ ...at(620, -260), overflow: "visible" }}><path d="M30 60 L380 -40" stroke="#3a2a1a" strokeWidth={10} />
        <path d={`M380 -40 Q${450 - 40 * net} 60 ${420 + 30 * net} 160 Q${360 - 20 * net} 110 380 -40`} fill="rgba(220,220,200,.25)" stroke="#d8d2c2" strokeWidth={4} strokeDasharray="10 8" />
        {Array.from({ length: caught }, (_, i) => <ellipse key={i} cx={400 + (i % 3) * 10} cy={60 + i * 14} rx={22} ry={8} fill="#cfd8e0" />)}</svg>
    </div>
    {Array.from({ length: 5 }, (_, i) => { const p = (tt * 0.6 + i / 5) % 1, x = lerp(1700, 1080, p) - i * 30, y = 700 - Math.sin(Math.PI * p) * (280 + i * 30);
      return <div key={i} style={{ ...at(x, y), transform: `rotate(${lerp(-30, 30, p)}deg)` }}><svg width={200} height={60}><path d="M30 30 L0 30" stroke="rgba(255,255,255,.4)" strokeWidth={4} /><path d="M40 30 Q100 6 160 30 Q100 54 40 30 Z" fill="#dfe8ee" /><path d="M90 26 L60 0 L130 22 Z" fill="rgba(220,235,245,.8)" /><path d="M160 30 L190 14 L190 46 Z" fill="#b8c8d4" /></svg></div>; })}
    <Sea tt={tt + 2} y={860} front />
    <Num tt={tt} d={0.2} x={960} y={130} txt="CON REDES DE MANO" size={96} col={AMB} />
  </>;
}}</Stage>;

// 23:01 · EL AGUA SUBE: corte de la isla con casas grandes en la costa; el mar sube con espuma y las tapa de a una; la meseta minada, con sus picos grises, queda seca arriba
const XSeaLevel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = LIN(tt, h, 0.3), lv = lerp(930, 700, k);
  const houses: [number, number][] = [[260, 880], [480, 820], [1440, 820], [1660, 880]];
  return <>
    <svg width={1920} height={1080} style={at(0, 0)}>
      <path d="M0 960 L200 940 Q420 800 620 760 L740 700 Q800 440 960 400 Q1120 440 1180 700 L1300 760 Q1500 800 1720 940 L1920 960 L1920 1080 L0 1080 Z" fill="#8a7a52" />
      <path d="M740 700 Q800 440 960 400 Q1120 440 1180 700 Z" fill="#9a958a" />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${775 + i * 34} ${560 + (i % 2) * 40 + Math.abs(i - 5) * 18} l17 -90 l17 90 Z`} fill={i % 2 ? "#d8d2c2" : "#bdb6a6"} stroke="#6a6458" strokeWidth={2} />)}
      {houses.map(([x, y], i) => { const wet = cl((y - lv) / 120); return <g key={i} opacity={1 - wet * 0.75}><rect x={x - 80} y={y - 110} width={160} height={110} fill="#e8dcc6" /><path d={`M${x - 96} ${y - 110} L${x} ${y - 180} L${x + 96} ${y - 110} Z`} fill="#a8442a" /><rect x={x - 20} y={y - 60} width={40} height={60} fill="#5a3a20" /></g>; })}
      <path d={`M0 ${lv} ${Array.from({ length: 17 }, (_, i) => `Q${i * 120 + 60} ${lv - 18 * Math.sin(tt * 2 + i)} ${(i + 1) * 120} ${lv}`).join(" ")} L1920 1080 L0 1080 Z`} fill="rgba(30,110,150,.85)" />
      <path d={`M0 ${lv} ${Array.from({ length: 17 }, (_, i) => `Q${i * 120 + 60} ${lv - 18 * Math.sin(tt * 2 + i)} ${(i + 1) * 120} ${lv}`).join(" ")}`} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={9} strokeDasharray="30 14" />
    </svg>
    <Num tt={tt} d={0.2} x={960} y={140} txt="EL MAR SUBE" size={110} col={ICE} />
  </>;
}}</Stage>;

export const HC5: Record<string, React.FC<{ t: number; h: H }>> = { islasize: XIslaSize, bite: XBite, door: XDoor, flask: XFlask, wheat: XWheat, strata: XStrata, split3: XSplit3, cutaway: XCutaway,
  cantilever: XCantilever, deport: XDeport, movebox: XMoveBox, flag68: XFlag68, cascade: XCascade, tower: XTower, envelope: XEnvelope, gauge: XGauge, shelf: XShelf, reroute: XReroute,
  billstack: XBillStack, lantern: XLantern, sealevel: XSeaLevel };
