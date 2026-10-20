// apex07 · escenas ILUSTRADAS (kit btg: escenario de noche + muñequito de chaleco + siluetas reales de los cazadores).
// Cada escena actúa la frase que se dice y nunca queda quieta. f = cuadro local (0 = arranque del bloque), d = duración en cuadros.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Beast, C, FONT, Person, SunsetStage, ease } from "./kit";

const P = "apex07/cut/";
// recortes rembg (ancho/alto) y hacia dónde mira el animal en la foto original (r = derecha)
export const CUT = {
  lion: { img: P + "lion.png", ar: 607 / 416, r: false }, lioness: { img: P + "lioness.png", ar: 534 / 240, r: false },
  leopard: { img: P + "leopard.svg", ar: 360 / 170, r: true },
  hyena: { img: P + "hyena.svg", ar: 1.6, r: true }, wolf: { img: P + "wolf.svg", ar: 1.5, r: true },
  bat: { img: P + "bat.svg", ar: 2.2, r: true },
};
type K = keyof typeof CUT;
const Cat: React.FC<{ k: K; x: number; y: number; w: number; right?: boolean; eye?: [number, number]; rim?: string; bob?: number; op?: number }> = ({ k, x, y, w, right = true, eye, rim, bob, op = 1 }) => {
  const c = CUT[k];
  return <div style={{ opacity: op }}><Beast img={c.img} ar={c.ar} x={x} y={y} w={w} flip={c.r !== right} eye={eye} rim={rim} bob={bob} /></div>;
};
const F = () => useCurrentFrame();
const lin = (f: number, a: number, b: number, x0: number, x1: number) => x0 + (x1 - x0) * Math.min(1, Math.max(0, (f - a) / (b - a)));
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const SV: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>{children}</svg>;
const CY = "#5ff0ff", HOT = "#ff4a2a";

// ---------- piezas ----------
const Grass: React.FC<{ y: number; n?: number; h?: number; color?: string; seed?: number }> = ({ y, n = 90, h = 120, color = "#0a1310", seed = 1 }) => {
  const f = F();
  const d = Array.from({ length: n }).map((_, i) => {
    const x = (i / n) * 2000 - 40 + Math.sin(i * 7.3 + seed) * 12, hh = h * (0.55 + 0.45 * Math.abs(Math.sin(i * 3.1 + seed))), s = Math.sin(f / 18 + i) * 6;
    return `M${x - 7},${y} Q${x + s * 0.5},${y - hh * 0.5} ${x + s},${y - hh} Q${x + 3},${y - hh * 0.5} ${x + 7},${y} Z`;
  }).join(" ");
  return <SV><path d={d} fill={color} /><rect x={0} y={y - 1} width={1920} height={1080 - y} fill={color} /></SV>;
};
// caña de azúcar: tallos altos con hojas que se mecen
const Cane: React.FC<{ y: number; h?: number; n?: number; color?: string; seed?: number; x0?: number; x1?: number }> = ({ y, h = 520, n = 60, color = "#0b1a10", seed = 1, x0 = -40, x1 = 1960 }) => {
  const f = F();
  return <SV>{Array.from({ length: n }).map((_, i) => {
    const x = x0 + (i / n) * (x1 - x0) + rnd(i, seed) * 20, hh = h * (0.75 + 0.25 * rnd(i, seed + 1)), s = Math.sin(f / 22 + i) * 8;
    return <g key={i}><path d={`M${x},${y} L${x + s},${y - hh}`} stroke={color} strokeWidth={9} />
      {[0.35, 0.55, 0.75, 0.95].map((q, j) => <path key={j} d={`M${x + s * q},${y - hh * q} q${(j % 2 ? 1 : -1) * 70},${-30 + s} ${(j % 2 ? 1 : -1) * 120},${30}`} stroke={color} strokeWidth={6} fill="none" />)}</g>;
  })}</SV>;
};
const Hut: React.FC<{ x: number; y: number; s?: number; lit?: number; door?: number; grey?: boolean }> = ({ x, y, s = 1, lit = 0, door = 0 }) => (
  <svg width={360 * s} height={300 * s} viewBox="0 0 360 300" style={{ position: "absolute", left: x - 180 * s, top: y - 300 * s, overflow: "visible" }}>
    <path d="M10,135 L180,15 L350,135 Z" fill="#3b2a14" /><path d="M10,135 L180,15 L180,135 Z" fill="#4a3519" />
    <rect x={50} y={130} width={260} height={170} fill="#5a3d24" />
    <rect x={150} y={190} width={64} height={110} fill={`rgba(255,${170 + 40 * lit},90,${0.12 + 0.88 * lit})`} />
    <rect x={150} y={190} width={64} height={110} fill="#22160e" style={{ transformOrigin: "150px 245px", transform: `perspective(400px) rotateY(${-door * 75}deg)` }} />
    <rect x={244} y={160} width={40} height={32} fill={`rgba(255,190,100,${0.15 + 0.8 * lit})`} />
    {lit > 0.2 && <ellipse cx={182} cy={302} rx={230} ry={26} fill={`rgba(255,170,80,${0.16 * lit})`} />}
  </svg>
);
const Moon: React.FC<{ x: number; y: number; r?: number; phase?: number }> = ({ x, y, r = 60, phase = 0 }) => (
  <><div style={{ position: "absolute", left: x - r * 3, top: y - r * 3, width: r * 6, height: r * 6, borderRadius: "50%", background: `radial-gradient(circle, rgba(220,230,255,${0.25 * (1 - phase)}) 0%, transparent 60%)` }} />
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "#e9ecf2", boxShadow: "inset -12px -8px 0 rgba(160,170,190,.35)", overflow: "hidden" }}>
      {phase > 0 && <div style={{ position: "absolute", top: -2, bottom: -2, left: `${100 - phase * 200}%`, width: "200%", borderRadius: "50%", background: "#0b1622" }} />}
    </div></>
);
const Pig: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const b = Math.sin(F() / 5) * 3;
  return <svg width={160 * s} height={90 * s} viewBox="0 0 160 90" style={{ position: "absolute", left: x - 80 * s, top: y - 90 * s + b, transform: flip ? "scaleX(-1)" : undefined }}>
    <ellipse cx={75} cy={45} rx={62} ry={30} fill="#070707" /><path d="M128,40 L158,52 L130,62 Z" fill="#070707" />
    <rect x={30} y={60} width={10} height={30} fill="#070707" /><rect x={100} y={60} width={10} height={30} fill="#070707" /><path d="M120,30 L126,10 L134,34 Z" fill="#070707" />
  </svg>;
};
const Dog: React.FC<{ x: number; y: number; s?: number; run?: boolean; sleep?: boolean; flip?: boolean; color?: string }> = ({ x, y, s = 1, run, sleep, flip, color = "#070707" }) => {
  const l = run ? Math.sin(F() / 2) * 22 : 0;
  if (sleep) return <svg width={150 * s} height={60 * s} viewBox="0 0 150 60" style={{ position: "absolute", left: x - 75 * s, top: y - 60 * s, transform: flip ? "scaleX(-1)" : undefined }}>
    <ellipse cx={70} cy={40} rx={55} ry={20} fill={color} /><circle cx={118} cy={42} r={15} fill={color} /><path d="M112,30 L118,18 L124,32 Z" fill={color} /></svg>;
  return <svg width={150 * s} height={100 * s} viewBox="0 0 150 100" style={{ position: "absolute", left: x - 75 * s, top: y - 100 * s, transform: flip ? "scaleX(-1)" : undefined }}>
    <rect x={30} y={40} width={80} height={26} rx={12} fill={color} /><circle cx={118} cy={36} r={16} fill={color} /><path d="M110,24 L116,8 L124,24 Z" fill={color} />
    <path d="M30,46 L6,30" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <rect x={40} y={60} width={8} height={36} fill={color} transform={`rotate(${l} 44 60)`} /><rect x={96} y={60} width={8} height={36} fill={color} transform={`rotate(${-l} 100 60)`} />
  </svg>;
};
const City: React.FC<{ y: number; drift?: number; lit?: number }> = ({ y, drift = 0, lit = 0.75 }) => {
  const bs = Array.from({ length: 26 }).map((_, i) => ({ x: i * 82 - 60 + drift, w: 64 + ((i * 37) % 40), h: 180 + ((i * 97) % 360) }));
  return <SV>{bs.map((b, i) => <g key={i}><rect x={b.x} y={y - b.h} width={b.w} height={b.h} fill="#0c1220" />
    {Array.from({ length: Math.floor(b.h / 34) * 3 }).map((_, j) => ((i * 13 + j * 7) % 5 < 2) ? <rect key={j} x={b.x + 10 + (j % 3) * (b.w / 3.2)} y={y - b.h + 14 + Math.floor(j / 3) * 34} width={10} height={14} fill="#ffcf7a" opacity={lit} /> : null)}</g>)}</SV>;
};
const Eyes: React.FC<{ x: number; y: number; s?: number; op?: number; color?: string }> = ({ x, y, s = 1, op = 1, color = "#ffc040" }) => {
  const f = F(), blink = ((f + Math.round(x)) % 75) > 70 ? 0.15 : 1;
  return <>{[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: x + i * 34 * s - 7 * s, top: y - 5 * s, width: 16 * s, height: 10 * s * blink, borderRadius: 8 * s, background: color, boxShadow: `0 0 ${20 * s}px ${6 * s}px ${color}aa`, opacity: op }} />)}</>;
};
// persona acostada (duerme en el suelo): el muñequito girado
const Sleeper: React.FC<{ x: number; y: number; s?: number; mat?: boolean; flip?: boolean }> = ({ x, y, s = 0.5, mat = true, flip }) => (
  <>{mat && <div style={{ position: "absolute", left: x - 150 * s * 1.1, top: y - 14 * s, width: 300 * s * 1.1, height: 28 * s, borderRadius: 6, background: "#8a6a3a" }} />}
    <div style={{ position: "absolute", left: x, top: y - 30 * s, transform: `rotate(${flip ? 90 : -90}deg)`, transformOrigin: "0 0" }}>
      <Person x={0} y={0} s={s} /></div>
    <div style={{ position: "absolute", left: x - 130 * s, top: y - 50 * s, width: 230 * s, height: 44 * s, borderRadius: 14 * s, background: "#c9c2b0", opacity: 0.92 }} /></>
);
const Cap: React.FC<{ y?: number; size?: number; color?: string; children: React.ReactNode }> = ({ y = 120, size = 64, color = C.orange, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, color, textShadow: "0 4px 18px rgba(0,0,0,.6)", letterSpacing: 1 }}>{children}</div>
);
const Tag: React.FC<{ x: number; y: number; op?: number; color?: string; size?: number; children: React.ReactNode }> = ({ x, y, op = 1, color = C.ink, size = 40, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color, opacity: op, transform: `scale(${0.85 + 0.15 * op})`, transformOrigin: "left center", textShadow: "0 3px 12px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{children}</div>
);
// mira roja que se cierra sobre un punto
const Reticle: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 70 }) => {
  const rr = r * (2.4 - 1.4 * k), f = F();
  return <SV><g opacity={k > 0 ? 1 : 0} transform={`rotate(${(1 - k) * 90} ${x} ${y})`}>
    <circle cx={x} cy={y} r={rr} stroke={C.red} strokeWidth={6} fill="none" opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 6))} />
    {[0, 90, 180, 270].map((a) => <path key={a} d={`M${x},${y - rr - 24} L${x},${y - rr + 18}`} stroke={C.red} strokeWidth={6} transform={`rotate(${a} ${x} ${y})`} />)}
  </g></SV>;
};
// murciélago vampiro dibujado: alas plegadas, camina sobre muñecas y patas (gait = 0..1 ciclo)
const Bat: React.FC<{ x: number; y: number; s?: number; walk?: boolean; fly?: boolean; flip?: boolean; fat?: number; color?: string; stroke?: string }> = ({ x, y, s = 1, walk, fly, flip, fat = 0, color = "#060606", stroke }) => {
  const f = F(), ph = Math.sin(f / 3), hop = walk ? Math.abs(Math.sin(f / 6)) * 10 : 0, wing = fly ? Math.sin(f / 2) * 50 : 0;
  const st = stroke ? { stroke, strokeWidth: 3, fill: "none" } : { fill: color };
  return <svg width={260 * s} height={160 * s} viewBox="-130 -110 260 160" style={{ position: "absolute", left: x - 130 * s, top: y - 110 * s - hop * s, transform: flip ? "scaleX(-1)" : undefined, overflow: "visible", filter: stroke ? undefined : `drop-shadow(0 -2px 0 ${C.glow}) drop-shadow(0 0 10px ${C.glow}55)` }}>
    {fly ? <path d={`M-10,-40 Q-70,${-90 - wing} -125,${-30 - wing} Q-90,${-35 - wing * 0.5} -70,-10 Q-45,-30 -10,-20 Z M10,-40 Q70,${-90 - wing} 125,${-30 - wing} Q90,${-35 - wing * 0.5} 70,-10 Q45,-30 10,-20 Z`} {...st} /> : null}
    <ellipse cx={0} cy={-38} rx={34 + fat * 18} ry={22 + fat * 16} {...st} />
    <circle cx={34} cy={-50} r={16} {...st} /><path d="M38,-64 L42,-82 L48,-62 Z M26,-62 L28,-80 L36,-62 Z" {...st} />
    <path d="M46,-48 q8,2 6,8" stroke={stroke ?? color} strokeWidth={5} fill="none" />
    {!fly && <><path d={`M10,-30 L${30 + ph * 10},0 L${40 + ph * 10},0`} stroke={stroke ?? color} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d={`M-14,-30 L${-6 - ph * 10},0 L${4 - ph * 10},0`} stroke={stroke ?? color} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d={`M-28,-30 L${-40 + ph * 8},0`} stroke={stroke ?? color} strokeWidth={6} strokeLinecap="round" />
      <path d="M-30,-50 Q-60,-70 -54,-30 Q-40,-36 -30,-30 Z M30,-56 Q8,-80 0,-50 Z" {...st} /></>}
  </svg>;
};
// hamaca colgada entre dos postes, con un pie que asoma
const Hammock: React.FC<{ x: number; y: number; w?: number; footOut?: boolean; sway?: number }> = ({ x, y, w = 900, footOut = true, sway = 0 }) => {
  const s = Math.sin(F() / 30) * 6 * sway;
  return <SV>
    <rect x={x - w / 2 - 20} y={y - 360} width={24} height={680} fill="#1d130b" /><rect x={x + w / 2 - 4} y={y - 360} width={24} height={680} fill="#1d130b" />
    <path d={`M${x - w / 2},${y - 300} Q${x},${y + 90 + s} ${x + w / 2},${y - 300}`} stroke="#c9a46a" strokeWidth={6} fill="none" />
    <path d={`M${x - w / 2 + 60},${y - 230} Q${x},${y + 60 + s} ${x + w / 2 - 60},${y - 230} Q${x},${y - 30 + s} ${x - w / 2 + 60},${y - 230} Z`} fill="#7d5b3a" />
    <path d={`M${x - w / 2 + 120},${y - 200} Q${x},${y - 40 + s} ${x + w / 2 - 140},${y - 205}`} stroke="#5a3f27" strokeWidth={10} fill="none" />
    {footOut && <g transform={`translate(${x + w / 2 - 230},${y - 120 + s})`}>
      <path d="M0,0 L40,150 Q44,180 80,186 L120,190 Q140,186 128,170 L70,150 L50,0 Z" fill="#c99872" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={96 + i * 7} cy={186 - i * 3} r={7 - i * 0.6} fill="#c99872" />)}
    </g>}
  </SV>;
};
const Car: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#1a1d24" }) => (
  <svg width={460 * s} height={170 * s} viewBox="0 0 460 170" style={{ position: "absolute", left: x - 230 * s, top: y - 170 * s }}>
    <path d="M20,120 L20,80 Q30,60 80,58 L140,10 L320,10 L380,58 Q440,62 446,90 L446,120 Z" fill={color} />
    <path d="M155,22 L305,22 L350,58 L120,58 Z" fill="#2c3a4a" opacity={0.8} />
    <circle cx={100} cy={130} r={36} fill="#08090b" /><circle cx={360} cy={130} r={36} fill="#08090b" />
  </svg>
);
const Lamp: React.FC<{ x: number; y: number; on: number; h?: number }> = ({ x, y, on, h = 420 }) => (
  <><div style={{ position: "absolute", left: x - 5, top: y - h, width: 10, height: h, background: "#202226" }} />
    <div style={{ position: "absolute", left: x - 30, top: y - h - 8, width: 60, height: 16, borderRadius: 8, background: on > 0.5 ? "#ffe2a0" : "#33363c", boxShadow: on > 0.5 ? "0 0 40px 10px #ffcf7a" : undefined }} />
    <div style={{ position: "absolute", left: x - 260, top: y - h, width: 520, height: h + 40, opacity: on, background: "radial-gradient(ellipse at 50% 0%, rgba(255,210,130,.35), transparent 70%)", clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)" }} /></>
);
// catre indio (charpoy) visto de costado
const Charpoy: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={300 * s} height={90 * s} viewBox="0 0 300 90" style={{ position: "absolute", left: x - 150 * s, top: y - 90 * s }}>
    <rect x={0} y={20} width={300} height={16} fill="#6b4a2a" /><path d="M10,24 L290,24" stroke="#c9a46a" strokeWidth={4} strokeDasharray="6 6" />
    <rect x={10} y={30} width={12} height={60} fill="#4a321c" /><rect x={278} y={30} width={12} height={60} fill="#4a321c" />
  </svg>
);
// cielo nocturno liso con luna (escenas que no son del kit de atardecer)
const Night: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = "#0b1622" }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, #05080f 0%, ${tone} 60%, #101820 100%)` }}>{children}</AbsoluteFill>
);
// pantalla de rayos X cian (cuadrícula + escaneo)
const XRay: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = F();
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #062a36 0%, #020a10 80%)" }}>
    <SV>{Array.from({ length: 33 }).map((_, i) => <path key={"v" + i} d={`M${i * 60},0 L${i * 60},1080`} stroke={CY} strokeOpacity={0.07} />)}
      {Array.from({ length: 19 }).map((_, i) => <path key={"h" + i} d={`M0,${i * 60} L1920,${i * 60}`} stroke={CY} strokeOpacity={0.07} />)}
      <rect x={0} y={(f * 9) % 1200 - 60} width={1920} height={60} fill={CY} opacity={0.06} /></SV>
    {children}
  </AbsoluteFill>;
};
// mapa cenital: aldea de chozas redondas, caminos y vegetación
const TopHut: React.FC<{ x: number; y: number; r?: number; hot?: number }> = ({ x, y, r = 60, hot = 0 }) => (
  <SV><circle cx={x} cy={y} r={r} fill="#6a4a26" /><circle cx={x} cy={y} r={r * 0.62} fill="#7d5a2e" /><circle cx={x} cy={y} r={r * 0.18} fill="#4a3219" />
    {hot > 0 && <circle cx={x} cy={y} r={r * 1.3} fill="none" stroke={C.red} strokeWidth={4} opacity={hot} strokeDasharray="10 8" />}</SV>
);
// huellas que avanzan por una polilínea (k = 0..1 cuánto se ve)
const Tracks: React.FC<{ pts: number[][]; k: number; color?: string; size?: number }> = ({ pts, k, color = "#f0ebe5", size = 9 }) => {
  const seg: number[] = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  const n = Math.floor(L / 34), out: React.ReactNode[] = [];
  for (let j = 0; j < n * k; j++) {
    let t = (j / n) * L, i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; }
    const a = pts[i], b = pts[i + 1], q = t / seg[i], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), side = j % 2 ? 1 : -1;
    const x = a[0] + (b[0] - a[0]) * q - Math.sin(ang) * 9 * side, y = a[1] + (b[1] - a[1]) * q + Math.cos(ang) * 9 * side;
    out.push(<g key={j} transform={`translate(${x},${y}) rotate(${(ang * 180) / Math.PI + 90})`}><ellipse cx={0} cy={0} rx={size * 0.7} ry={size} fill={color} />
      {[-1, 0, 1].map((u) => <circle key={u} cx={u * size * 0.7} cy={-size * 1.4} r={size * 0.32} fill={color} />)}</g>);
  }
  return <SV>{out}</SV>;
};
// tarjeta con ícono (trio / checklist)
const Card: React.FC<{ x: number; y: number; k: number; title: string; off?: number; children: React.ReactNode }> = ({ x, y, k, title, off = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y + (1 - k) * 60, width: 420, height: 470, opacity: k, borderRadius: 18, background: "linear-gradient(180deg,#1b140e,#2b1d12)", border: "2px solid rgba(255,170,90,.45)", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
    <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.65 * off }}>{children}</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 42, color: C.ink, textTransform: "uppercase" }}>{title}</div>
    {off > 0 && <svg style={{ position: "absolute", inset: 0 }} width={420} height={470}><path d={`M40,40 L${40 + 340 * off},${40 + 390 * off}`} stroke={C.red} strokeWidth={16} strokeLinecap="round" /><path d={`M380,40 L${380 - 340 * Math.max(0, off * 2 - 1)},${40 + 390 * Math.max(0, off * 2 - 1)}`} stroke={C.red} strokeWidth={16} strokeLinecap="round" /></svg>}
  </div>
);
const Check: React.FC<{ x: number; y: number; k: number; text: string }> = ({ x, y, k, text }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: k > 0 ? 1 : 0.25, display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.ink, whiteSpace: "nowrap" }}>
    <svg width={64} height={64}><rect x={3} y={3} width={58} height={58} rx={10} fill="none" stroke={C.ink} strokeWidth={4} /><path d="M14,34 L28,48 L52,16" stroke={C.red} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - k)} /></svg>
    {text}
  </div>
);

// ---------- escenas ----------
type SP = { d: number };
const S: Record<string, React.FC<SP>> = {
  // "During the day you are the most dangerous animal… you have tools, cars, a phone" — el día se vuelve noche mientras camina
  dusk: ({ d }) => { const f = F(), n = ease(f, d * 0.35, d); return <SunsetStage tree="acacia" horizon={640} night={n} pan={0.3} sunX={lin(f, 0, d, 1350, 1500)}>
    <Person x={lin(f, 0, d, 520, 1080)} y={880} s={0.85} walk />
    <div style={{ position: "absolute", left: lin(f, 0, d, 520, 1080) + 22, top: 720, width: 22, height: 36, borderRadius: 4, background: "#20242c", border: "3px solid #9fb4c8", opacity: 1 - n }} />
    <Eyes x={1500} y={900} s={0.9} op={ease(f, d * 0.7, d * 0.85)} /><Eyes x={260} y={930} s={0.7} op={ease(f, d * 0.8, d * 0.95)} />
    <Grass y={1080} h={110} seed={3} />
  </SunsetStage>; },
  // "the moment you fall asleep… the easiest large animal… you drop down the food chain"
  sleepeyes: ({ d }) => { const f = F(), down = ease(f, d * 0.62, d * 0.92);
    const EY = [[300, 760], [1500, 700], [1700, 860], [120, 900], [1120, 690], [760, 640]];
    return <SunsetStage tree="acacia" horizon={640} night={1} pan={0.08}>
      <Moon x={260} y={170} r={40} />
      <Hut x={1040} y={860} s={1} lit={0.55} />
      <Sleeper x={560} y={900} s={0.5} />
      {EY.map(([x, y], i) => <Eyes key={i} x={x} y={y} s={0.75} op={ease(f, 12 + i * 12, 24 + i * 12)} />)}
      {/* escalera de la cadena alimenticia: el humano baja */}
      <div style={{ position: "absolute", right: 70, top: 140, width: 150, height: 760, borderRadius: 16, background: "rgba(10,14,20,.7)", border: "2px solid rgba(244,239,230,.25)" }} />
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", right: 90, top: 160 + i * 124, width: 110, height: 100, borderRadius: 10, background: "rgba(244,239,230,.07)" }} />)}
      <div style={{ position: "absolute", right: 70 + 75 - 45, top: 165 + lin(down, 0, 1, 0, 3) * 124, width: 90, height: 90, transform: `rotate(${down * 6}deg)` }}><Person x={45} y={92} s={0.34} /></div>
      <div style={{ position: "absolute", right: 236, top: 186 + lin(down, 0, 1, 0, 3) * 124, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.red, opacity: down }}>▼ YOU</div>
    </SunsetStage>; },
  // "a night hunter uses the dark… knows where you sleep… three tests" — mapa cenital, huellas a la choza, lista que se tilda
  trackmap: ({ d }) => { const f = F(), tk = ease(f, 0, d * 0.55), lock = ease(f, d * 0.5, d * 0.62), panel = ease(f, d * 0.62, d * 0.7);
    return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #1d2a18 0%, #0a1008 80%)" }}>
      <SV><path d="M0,560 Q400,520 700,600 T1300,560" stroke="#3a2e1c" strokeWidth={46} fill="none" />
        {Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={rnd(i, 2) * 1300} cy={rnd(i, 3) * 1080} r={20 + rnd(i, 4) * 40} fill="#14210f" opacity={0.9} />)}</SV>
      {[[460, 380], [700, 300], [880, 470], [560, 760], [900, 760]].map(([x, y], i) => <TopHut key={i} x={x} y={y} r={58} hot={i === 4 ? lock : 0} />)}
      <Tracks pts={[[-40, 1000], [260, 960], [520, 980], [760, 900], [870, 800]]} k={tk} />
      <Reticle x={900} y={760} k={lock} r={70} />
      <div style={{ position: "absolute", left: 1250, top: 0, bottom: 0, right: 0, background: "rgba(8,10,8,.82)", opacity: panel }} />
      <Tag x={1310} y={250} op={panel} color={C.orange} size={46}>THE 3 TESTS</Tag>
      <Check x={1310} y={360} k={ease(f, d * 0.72, d * 0.76)} text="comes to you" />
      <Check x={1310} y={470} k={ease(f, d * 0.79, d * 0.83)} text="picks the night" />
      <Check x={1310} y={580} k={ease(f, d * 0.88, d * 0.92)} text="comes back" />
    </AbsoluteFill>; },
  // "It lands nearby, and then it walks… on its wrists… hop, sprint… in total silence"
  batwalk: ({ d }) => { const f = F(), land = ease(f, 0, d * 0.18), x = f < d * 0.18 ? lin(f, 0, d * 0.18, 1900, 1560) : lin(f, d * 0.18, d * 0.85, 1560, 1150), climb = ease(f, d * 0.85, d);
    return <Night tone="#0d1a24">
      <Moon x={1650} y={150} r={46} />
      <Hammock x={760} y={560} w={900} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "linear-gradient(180deg,#2a1e14,#140d08)" }} />
      <Bat x={x} y={f < d * 0.18 ? lin(land, 0, 1, 200, 880) : 880 - climb * 90} s={2.2} walk={f >= d * 0.18 && climb < 1} fly={f < d * 0.18} flip />
      <Tag x={1180} y={180} op={ease(f, d * 0.55, d * 0.62)} color={C.ink} size={44}>wrists + back legs</Tag>
      <Cap y={940} size={44} color="rgba(244,239,230,.75)">{f > d * 0.75 ? "· no sound ·" : ""}</Cap>
    </Night>; },
  // "pits around its nose sense heat… where your blood runs closest… a tiny scoop of skin, the size of a pencil eraser"
  thermal: ({ d }) => { const f = F(), scan = ease(f, d * 0.12, d * 0.4), cut = ease(f, d * 0.62, d * 0.75), eraser = ease(f, d * 0.82, d * 0.9);
    return <XRay>
      <div style={{ position: "absolute", left: 120, top: 260, transform: "scale(2.6)", transformOrigin: "0 0" }}><Bat x={130} y={110} s={1} stroke={CY} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 520 + i * 18, top: 360 + i * 4, width: 16, height: 16, borderRadius: 8, background: HOT, boxShadow: `0 0 24px 8px ${HOT}`, opacity: 0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i)) }} />)}
      <SV>{Array.from({ length: 5 }).map((_, i) => { const k = ((f / 40 + i / 5) % 1); return <path key={i} d={`M${1300 - k * 700},${560 - 120 * Math.sin(k * 3)} q30,-40 60,0`} stroke={HOT} strokeWidth={6} fill="none" opacity={scan * (1 - k)} />; })}</SV>
      {/* pie en cámara térmica */}
      <svg width={520} height={520} viewBox="0 0 260 260" style={{ position: "absolute", left: 1260, top: 300 }}>
        <defs><radialGradient id="ft" cx="70%" cy="80%"><stop offset="0%" stopColor="#ffffff" /><stop offset="25%" stopColor="#ffd23a" /><stop offset="55%" stopColor="#ff4a2a" /><stop offset="100%" stopColor="#5a1aa0" /></radialGradient></defs>
        <path d="M40,0 L70,160 Q78,210 140,220 L220,226 Q250,222 238,196 L140,170 L110,0 Z" fill="url(#ft)" opacity={0.3 + 0.7 * scan} />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={198 + i * 13} cy={222 - i * 6} r={13 - i} fill="#fff6c0" opacity={scan} />)}
        <circle cx={92} cy={196} r={20} fill="none" stroke={C.red} strokeWidth={5} opacity={cut} />
      </svg>
      <Tag x={180} y={160} op={ease(f, 6, 18)} color={CY} size={46}>HEAT-SENSING PITS</Tag>
      <Tag x={1290} y={860} op={scan} color={HOT} size={40}>toes · heel · nose</Tag>
      <div style={{ position: "absolute", left: 1290, top: 930, display: "flex", alignItems: "center", gap: 18, opacity: eraser, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: "#e88aa0" }} />= the cut</div>
    </XRay>; },
  // "it laps for twenty minutes… half its own body weight… so heavy it can barely fly… starts peeing"
  gauge: ({ d }) => { const f = F(), fill = ease(f, 0, d * 0.45), pee = f > d * 0.6, min = Math.round(lin(f, 0, d * 0.45, 0, 20));
    return <Night tone="#14101c">
      <Bat x={720} y={720} s={2.4 + fill * 0.3} fat={fill} />
      {pee && Array.from({ length: 8 }).map((_, i) => { const k = ((f - d * 0.6) / 18 + i / 8) % 1; return <div key={i} style={{ position: "absolute", left: 640 - k * 30, top: 740 + k * 300, width: 12, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#e8d36a", opacity: 1 - k }} />; })}
      <div style={{ position: "absolute", left: 1260, top: 230, width: 110, height: 600, borderRadius: 55, border: "5px solid #f0ebe5", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 50}%`, background: "linear-gradient(180deg,#ff4a3a,#a3121a)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 4, background: "#f0ebe5" }} />
      </div>
      <Tag x={1400} y={500} op={1} color={C.ink} size={44}>½ body weight</Tag>
      <Tag x={1400} y={230} op={1} color={C.orange} size={72}>{min} min</Tag>
      <Tag x={420} y={940} op={pee ? 1 : 0} color="#e8d36a" size={42}>dumping water for the flight home</Tag>
    </Night>; },
  // "Twenty-one of them died of RABIES… the youngest was two years old" — el electro que se apaga
  ecg: ({ d }) => { const f = F(), flat = d * 0.32, k = ease(f, flat, flat + 10);
    const pts = Array.from({ length: 200 }).map((_, i) => { const x = i * 10, t = x / 10 + f * 3, fl = x / 1920 > 1 - (f - flat) / 30;
      const beat = (t % 60) > 52 ? -Math.sin(((t % 60) - 52) / 8 * Math.PI) * 220 : (t % 60) > 48 ? 30 : 0;
      return `${x},${560 + (f > flat && fl ? 0 : beat)}`; }).join(" ");
    return <AbsoluteFill style={{ background: "#020806" }}>
      <SV><polyline points={pts} stroke="#3dff8a" strokeWidth={5} fill="none" style={{ filter: "drop-shadow(0 0 8px #3dff8a)" }} /></SV>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 230, color: C.red, opacity: k, transform: `scale(${1.3 - 0.3 * k})` }}>RABIES</div>
      <Tag x={760} y={780} op={ease(f, d * 0.62, d * 0.72)} size={46}>youngest: 2 years old</Tag>
    </AbsoluteFill>; },
  // "its jaws can crack the leg bone… stomach acid digests the bone… a third of its body weight"
  hyskull: ({ d }) => { const f = F(), bite = Math.max(0, Math.sin(f / 14)), crack = ease(f, d * 0.3, d * 0.36), acid = ease(f, d * 0.55, d * 0.7);
    const jaw = 14 * (1 - bite);
    return <XRay>
      <svg width={1200} height={700} viewBox="0 0 600 350" style={{ position: "absolute", left: 120, top: 200 }}>
        <g stroke={CY} strokeWidth={3} fill="rgba(95,240,255,.08)">
          <path d="M50,170 Q40,90 120,40 Q200,0 300,22 Q360,34 400,70 Q430,92 470,104 Q500,112 506,140 L500,172 Q460,178 420,176 L300,182 Q180,196 90,196 Q55,192 50,170 Z" />
          <path d="M110,46 Q190,-6 300,24" strokeWidth={5} /><circle cx={330} cy={98} r={26} /><path d="M200,140 Q260,110 330,140" />
          <g transform={`rotate(${jaw} 120 190)`}><path d="M100,196 Q200,232 400,212 L492,196 L486,220 Q400,250 220,244 Q130,238 100,196 Z" />
            <path d="M470,206 l6,-30 l10,30" />{[0, 1, 2].map((i) => <path key={i} d={`M${330 + i * 40},212 l14,-22 l14,22`} />)}</g>
          <path d="M466,176 l8,36 l10,-36" />{[0, 1, 2].map((i) => <path key={i} d={`M${320 + i * 42},180 l15,26 l15,-26`} />)}
        </g>
        <g transform={`translate(330,190) rotate(-6)`}><rect x={-120} y={-12} width={240} height={24} rx={12} fill="#f0ebe5" opacity={0.9} />
          {crack > 0 && <path d={`M-10,-12 L4,0 L-6,6 L8,12`} stroke={C.red} strokeWidth={4} fill="none" opacity={crack} />}</g>
      </svg>
      <Tag x={180} y={140} op={ease(f, 4, 16)} color={CY} size={44}>bone-crushing molars</Tag>
      {/* estómago: el hueso se disuelve */}
      <div style={{ position: "absolute", left: 1420, top: 600, width: 300, height: 220, borderRadius: "50% 45% 55% 50%", border: `4px solid ${CY}`, opacity: acid, background: `rgba(160,255,90,${0.18 * acid})` }}>
        <div style={{ position: "absolute", left: 70, top: 90, width: 160 * (1 - acid * 0.85), height: 22, borderRadius: 11, background: "#f0ebe5" }} />
      </div>
      <Tag x={1430} y={850} op={acid} color="#b7ff6a" size={40}>bone, hooves, teeth</Tag>
    </XRay>; },
  // Mulanje: noche de calor, todos duermen afuera; la hiena entra a la aldea
  mats: ({ d }) => { const f = F(), heat = ease(f, 0, d * 0.3);
    return <SunsetStage tree="acacia" horizon={660} night={1} pan={0.06}>
      <SV><path d="M300,668 L620,300 L760,380 L920,240 L1240,668 Z" fill="#101a24" /></SV>
      <Hut x={420} y={860} s={0.9} lit={0.7} /><Hut x={1520} y={850} s={0.85} lit={0.5} />
      <Sleeper x={660} y={930} s={0.42} /><Sleeper x={900} y={980} s={0.42} flip /><Sleeper x={1120} y={940} s={0.42} />
      <Cat k="hyena" x={lin(f, d * 0.35, d, 1950, 1350)} y={1000} w={420} right={false} eye={[0.1, 0.25]} />
      <div style={{ position: "absolute", left: 120, top: 120, width: 44, height: 300, borderRadius: 22, border: "4px solid #f0ebe5" }}>
        <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: `${heat * 92}%`, borderRadius: 16, background: "#ff5a2a" }} /></div>
      <Tag x={190} y={150} op={heat} color={C.orange} size={44}>HOT SEASON</Tag>
    </SunsetStage>; },
  // "It needs three things. Darkness, an easy target, and the memory… take away any one"
  trio: ({ d }) => { const f = F(), off = ease(f, d * 0.78, d * 0.9);
    return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1a10 0%, #0a0806 72%)" }}>
      <Card x={180} y={250} k={ease(f, d * 0.08, d * 0.16)} title="darkness"><Moon x={210} y={190} r={70} phase={0.7} /></Card>
      <Card x={750} y={250} k={ease(f, d * 0.28, d * 0.36)} title="easy target" off={off}><Sleeper x={240} y={250} s={0.4} /></Card>
      <Card x={1320} y={250} k={ease(f, d * 0.5, d * 0.58)} title="memory">
        <svg width={420} height={330} viewBox="0 0 420 330"><path d="M140,90 Q140,40 200,46 Q250,30 280,70 Q330,80 320,140 Q340,190 290,210 Q270,250 220,236 Q170,256 140,220 Q90,210 100,160 Q80,110 140,90 Z" fill="none" stroke={C.orange} strokeWidth={8} />
          <path d="M210,50 Q190,140 220,236 M140,140 Q190,130 210,150 M240,120 Q290,120 310,150" stroke={C.orange} strokeWidth={5} fill="none" /></svg></Card>
      <Tag x={720} y={800} op={off} color={C.red} size={60}>= attacks stop</Tag>
    </AbsoluteFill>; },
  // "smaller than the wolves you know… sandy, the size of a medium dog… sugarcane, riverbanks, edges of villages"
  wolfcane: ({ d }) => { const f = F();
    return <SunsetStage tree="palm" horizon={600} night={1} pan={0.1}>
      <Moon x={1500} y={170} r={52} />
      {[0, 1, 2].map((i) => <Cat key={i} k="wolf" x={lin(f, 0, d * 0.6, -500 - i * 430, 1000 - i * 430)} y={1000 - (i % 2) * 30} w={300} right bob={1.5} rim="#9fc2ff" />)}
      <Cane y={1080} h={460} n={44} seed={2} />
      <Dog x={1520} y={1040} s={1.8} color="#000" flip />
      <Tag x={1300} y={770} op={ease(f, d * 0.35, d * 0.45)} color={C.ink} size={38}>~ a medium dog</Tag>
      <Tag x={140} y={140} op={ease(f, d * 0.25, d * 0.35)} color={C.orange} size={56}>20-25 kg</Tag>
    </SunsetStage>; },
  // Bahraich: el lobo entra a la aldea, toma al chico del catre y vuelve a la caña
  wolfmap: ({ d }) => { const f = F(), go = ease(f, 0, d * 0.5), lock = ease(f, d * 0.45, d * 0.55), back = ease(f, d * 0.6, d * 0.95);
    return <AbsoluteFill style={{ background: "#1b2414" }}>
      <SV><path d="M0,0 L260,0 Q300,540 220,1080 L0,1080 Z" fill="#163848" />
        {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M${330 + i * 26},0 L${330 + i * 26},1080`} stroke="#2c4a1c" strokeWidth={14} />)}
        <rect x={1060} y={0} width={860} height={1080} fill="#3a2e1c" /></SV>
      {[[1300, 260], [1600, 420], [1380, 640], [1700, 820]].map(([x, y], i) => <TopHut key={i} x={x} y={y} r={70} />)}
      {[[1180, 520], [1500, 600], [1560, 250]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 50, top: y - 26, width: 100, height: 52, borderRadius: 6, background: "#8a6a3a", border: "3px solid #4a321c" }} />)}
      <Tracks pts={[[200, 900], [500, 760], [900, 620], [1180, 530]]} k={go} />
      <Tracks pts={[[1180, 530], [880, 400], [520, 300], [300, 120]]} k={back} color={C.red} />
      <Reticle x={1180} y={520} k={lock} r={60} />
      <Tag x={60} y={980} op={1} color="#9fd8ff" size={36}>river</Tag><Tag x={560} y={980} op={1} color="#a7d18a" size={36}>sugarcane</Tag><Tag x={1420} y={980} op={1} color={C.ink} size={36}>village</Tag>
    </AbsoluteFill>; },
  // Operation Bhediya: drones térmicos, jaulas… y muñecos en el campo
  bhediya: ({ d }) => { const f = F(), caught = Math.min(4, Math.floor(lin(f, d * 0.3, d * 0.55, 0, 4.99))), dolls = ease(f, d * 0.6, d * 0.75);
    const dx = lin(f, 0, d, 300, 1500);
    return <SunsetStage tree="palm" horizon={560} night={1} pan={0.1}>
      <Cane y={700} h={160} n={70} seed={4} color="#0d1d10" />
      <svg width={220} height={80} viewBox="0 0 220 80" style={{ position: "absolute", left: dx - 110, top: 140 + Math.sin(f / 9) * 8 }}>
        <rect x={70} y={30} width={80} height={24} rx={8} fill="#1d2228" /><path d="M20,30 L200,30" stroke="#1d2228" strokeWidth={6} />
        <ellipse cx={20} cy={26} rx={20 * Math.abs(Math.sin(f)) + 4} ry={3} fill="#9aa" /><ellipse cx={200} cy={26} rx={20 * Math.abs(Math.cos(f)) + 4} ry={3} fill="#9aa" /><circle cx={110} cy={60} r={8} fill="#ff3b30" /></svg>
      <div style={{ position: "absolute", left: dx - 260, top: 210, width: 520, height: 520, background: "linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.02))", clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)" }} />
      {[0, 1, 2, 3].map((i) => <svg key={i} width={170} height={120} viewBox="0 0 170 120" style={{ position: "absolute", left: 260 + i * 380, top: 820 }}>
        <rect x={4} y={4} width={162} height={112} fill="none" stroke="#aab4be" strokeWidth={5} />{Array.from({ length: 8 }).map((_, j) => <path key={j} d={`M${20 * j + 4},4 L${20 * j + 4},116`} stroke="#aab4be" strokeWidth={3} />)}
        {i < caught && <ellipse cx={85} cy={84} rx={50} ry={24} fill="#000" />}</svg>)}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 520, top: 690 + (1 - dolls) * 40, opacity: dolls, width: 44, height: 70, borderRadius: "22px 22px 10px 10px", background: ["#ff4fa0", "#ffd23a", "#3ad1ff"][i] }} />)}
      <Tag x={120} y={110} op={1} color={C.orange} size={52}>{`WOLVES CAUGHT: ${caught}`}</Tag>
      <Tag x={120} y={180} op={ease(f, d * 0.45, d * 0.55)} color={C.red} size={40}>attacks continue</Tag>
    </SunsetStage>; },
  // "it never attacked during the day… never went for the men with sticks… the darkest hour, the smallest person"
  wolfmath: ({ d }) => { const f = F(), a1 = ease(f, d * 0.12, d * 0.2), a2 = ease(f, d * 0.3, d * 0.38), a3 = ease(f, d * 0.55, d * 0.65);
    return <SunsetStage tree="palm" horizon={600} night={0.9} pan={0.15}>
      {[0, 1, 2].map((i) => <Person key={i} x={lin(f, 0, d, 260 + i * 140, 560 + i * 140)} y={870} s={0.62} walk arms="spear" />)}
      <Cat k="wolf" x={1150} y={900} w={300} right={false} eye={[0.12, 0.25]} rim="#9fc2ff" />
      <Charpoy x={1650} y={950} s={0.8} /><Sleeper x={1650} y={880} s={0.26} mat={false} />
      <Reticle x={1650} y={860} k={a3} r={60} />
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: FONT, fontWeight: 900, fontSize: 54, lineHeight: 1.35, color: C.ink }}>
        <div style={{ opacity: a1 }}>DAYTIME <span style={{ color: C.red }}>✗</span></div>
        <div style={{ opacity: a2 }}>MEN WITH STICKS <span style={{ color: C.red }}>✗</span></div>
        <div style={{ opacity: a3, color: C.orange }}>DARKEST HOUR + SMALLEST ✓</div>
      </div>
    </SunsetStage>; },
  // Mumbai: un bosque en el medio de la ciudad; >50 leopardos; uno camina por los techos
  skyline: ({ d }) => { const f = F(), n = Math.round(lin(f, d * 0.55, d * 0.9, 0, 50));
    return <Night tone="#101a2c">
      <City y={760} drift={-f * 0.15} />
      <SV><path d="M560,760 Q700,520 960,500 Q1220,520 1360,760 Z" fill="#071209" /></SV>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: 640 + rnd(i, 7) * 640 - 4, top: 600 + rnd(i, 8) * 150, width: 8, height: 4, borderRadius: 2, background: "#ffc040", boxShadow: "0 0 8px 2px #ff9a1a" }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "#0a0c10" }} />
      {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 160 + f * 9) % 2200) - 140, top: 850 + (i % 2) * 40, width: 36, height: 8, borderRadius: 4, background: i % 2 ? "#ff3b30" : "#ffe2a0" }} />)}
      <Cat k="leopard" x={lin(f, 0, d * 0.6, 1400, 1700)} y={lin(f, 0, d, 430, 430)} w={240} right eye={[0.86, 0.26]} />
      <Tag x={760} y={420} op={ease(f, d * 0.55, d * 0.62)} color={C.orange} size={80}>{`${n}+`}</Tag>
      <Tag x={120} y={120} op={ease(f, 0, 20)} color={C.ink} size={44}>Sanjay Gandhi National Park</Tag>
    </Night>; },
  // "A leopard does not chase. It stalks… freezes for minutes… slides forward… attacks from behind"
  street: ({ d }) => { const f = F(), q = f / d;
    const steps = [0, 0.18, 0.22, 0.45, 0.5, 0.72, 0.76];
    let x = 120; for (let i = 0; i < steps.length - 1; i += 2) x += 140 * ease(f, steps[i + 1] * d, steps[i + 2] * d); // avanza a saltitos, se congela entre medio
    const pounce = ease(f, d * 0.86, d * 0.95), frozen = q > 0.22 && q < 0.45 || q > 0.5 && q < 0.72;
    return <Night tone="#16131c">
      <City y={600} lit={0.4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 480, background: "#1a1a1e" }} />
      <div style={{ position: "absolute", left: 0, width: 560, top: 470, height: 290, background: "#26221e", borderTop: "8px solid #3a332b" }} />
      <Lamp x={1500} y={760} on={1} />
      <Car x={1240} y={930} s={1.1} />
      <Dog x={1200} y={930} s={0.8} sleep /><Dog x={1440} y={925} s={0.7} sleep flip />
      <Cat k="leopard" x={x + pounce * 600} y={940 - pounce * 120} w={430} right eye={[0.86, 0.26]} />
      <Tag x={120} y={140} op={frozen ? 1 : 0} color={C.ink} size={58}>FREEZE.</Tag>
    </Night>; },
  // "a leopard hunts by size, not by species… a small child squatting is the same size as a dog"
  sizes: ({ d }) => { const f = F(), k = ease(f, d * 0.4, d * 0.6);
    return <Night tone="#121820">
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 260, background: "#141210" }} />
      <div style={{ filter: `drop-shadow(0 -3px 0 ${C.glow}) drop-shadow(0 0 14px ${C.glow}88)` }}><Dog x={640} y={830} s={2.2} color="#05060a" /></div>
      <svg width={260} height={300} viewBox="0 0 130 150" style={{ position: "absolute", left: 1150, top: 540, filter: `drop-shadow(0 -3px 0 ${C.glow}) drop-shadow(0 0 14px ${C.glow}88)` }}>
        <circle cx={68} cy={34} r={26} fill="#05060a" /><path d="M40,64 Q70,54 96,70 L104,120 L118,148 L28,148 L44,118 Z" fill="#05060a" /></svg>
      <SV><path d={`M380,${612} L1500,${612}`} stroke={C.red} strokeWidth={5} strokeDasharray="18 14" opacity={k} />
        <path d="M380,830 L1500,830" stroke="#f0ebe5" strokeWidth={3} opacity={0.4} /></SV>
      <Reticle x={640} y={720} k={k} r={110} /><Reticle x={1280} y={720} k={k} r={110} />
      <Cap y={150} size={72} color={C.ink}>{k > 0.5 ? "SAME SIZE" : ""}</Cap>
    </Night>; },
  // Mumbai cambió: luces, sin basura, chicos adentro… los leopardos se quedan, los ataques bajan
  cityfix: ({ d }) => { const f = F(), L = [0.1, 0.2, 0.3].map((t) => ease(f, d * t, d * t + 8)), clean = ease(f, d * 0.4, d * 0.55), kids = ease(f, d * 0.6, d * 0.7);
    return <Night tone="#121a28">
      <SV><path d="M0,620 Q300,460 700,600 L700,1080 L0,1080 Z" fill="#071209" /></SV>
      <Eyes x={300} y={600} s={0.8} />
      <div style={{ position: "absolute", left: 700, right: 0, top: 640, bottom: 0, background: "#1a1a1e" }} />
      {[900, 1300, 1700].map((x, i) => <Lamp key={i} x={x} y={900} on={L[i]} h={360} />)}
      <div style={{ position: "absolute", left: 1000, top: 820 + clean * 120, width: 220, height: 90, borderRadius: "40% 40% 10% 10%", background: "#3a3020", opacity: 1 - clean }} />
      <Dog x={lin(clean, 0, 1, 1120, 2200)} y={900} s={0.7} run={clean > 0 && clean < 1} />
      <Hut x={1550} y={1000} s={0.8} lit={kids} door={0} />
      <div style={{ position: "absolute", left: 1140, top: 90, width: 660, height: 380, borderRadius: 18, background: "rgba(8,10,14,.78)", border: "2px solid rgba(244,239,230,.18)", opacity: ease(f, d * 0.72, d * 0.8) }}>
        <svg width={660} height={380} style={{ position: "absolute", inset: 0 }}>
          <path d="M60,40 L60,320 L620,320" stroke="rgba(244,239,230,.45)" strokeWidth={3} fill="none" />
          <path d={`M70,80 L240,110 L420,230 L600,290`} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={640} strokeDashoffset={640 * (1 - ease(f, d * 0.76, d * 0.97))} /></svg>
        <div style={{ position: "absolute", left: 80, top: 330, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "rgba(244,239,230,.6)" }}>leopards stay · attacks</div>
      </div>
      <Tag x={1520} y={170} op={ease(f, d * 0.85, d * 0.92)} color={C.red} size={60}>attacks ↓</Tag>
    </Night>; },
  // la choza de paja en el maizal: chanchos de monte, el león detrás; la puerta es una sábana
  fieldhut: ({ d }) => { const f = F(), paw = ease(f, d * 0.8, d * 0.92);
    return <SunsetStage tree="acacia" horizon={600} night={0.9} pan={0.12}>
      <Moon x={300} y={180} r={40} phase={0.6} />
      <SV>{Array.from({ length: 70 }).map((_, i) => <path key={i} d={`M${i * 28},980 L${i * 28 + Math.sin(f / 15 + i) * 5},${760 + (i % 5) * 12}`} stroke="#1c2a14" strokeWidth={6} />)}
        <rect x={1000} y={660} width={14} height={200} fill="#2a1a10" /><rect x={1300} y={660} width={14} height={200} fill="#2a1a10" />
        <path d="M940,560 L1160,430 L1380,560 Z" fill="#7a5a2a" /><rect x={980} y={560} width={360} height={110} fill="#8a6a34" />
        {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${985 + i * 20},560 L${985 + i * 20},670`} stroke="#6a4a22" strokeWidth={3} />)}</SV>
      <div style={{ position: "absolute", left: 1120, top: 572, width: 90, height: 96, background: "#d8d2c4", transformOrigin: "top center", transform: `skewX(${Math.sin(f / 12) * 4 + paw * 20}deg) scaleY(${1 - paw * 0.3})` }} />
      <Pig x={lin(f, 0, d, 420, 600)} y={990} s={0.9} /><Pig x={lin(f, 0, d, 200, 360)} y={1010} s={0.8} />
      <Cat k="lioness" x={lin(f, d * 0.25, d * 0.85, -560, 640)} y={1030} w={560} right eye={[0.94, 0.3]} />
      <Tag x={1180} y={300} op={ease(f, d * 0.2, d * 0.3)} color={C.ink} size={40}>1 km from the village</Tag>
      <Tag x={1180} y={360} op={ease(f, d * 0.6, d * 0.7)} color={C.orange} size={40}>walls: grass · door: a sheet</Tag>
    </SunsetStage>; },
  // Packer: los 10 días después de la luna llena, 2 a 4 veces más ataques; la luna sale tarde y deja un hueco negro
  mooncycle: ({ d }) => { const f = F(), p2 = ease(f, d * 0.45, d * 0.55), bars = ease(f, d * 0.12, d * 0.35);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg,#05080f,#0e1726)" }}>
      <div style={{ opacity: 1 - p2 }}>
        {Array.from({ length: 15 }).map((_, i) => <Moon key={i} x={150 + i * 115} y={230} r={38} phase={Math.abs(i - 4) / 10.5} />)}
        <div style={{ position: "absolute", left: 590, top: 300, width: 1170, height: 14, background: C.red, opacity: ease(f, 6, 18) }} />
        <Tag x={860} y={320} op={ease(f, 6, 18)} color={C.red} size={40}>10 days after the full moon</Tag>
        <div style={{ position: "absolute", left: 600, bottom: 160, width: 200, height: 120 * bars, background: "#5a6a80" }} />
        <div style={{ position: "absolute", left: 1100, bottom: 160, width: 200, height: 400 * bars, background: C.red }} />
        <Tag x={560} y={940} op={bars} size={38}>before</Tag><Tag x={1110} y={940} op={bars} size={38}>after</Tag>
        <Tag x={1340} y={520} op={ease(f, d * 0.3, d * 0.38)} color={C.orange} size={96}>2-4x</Tag>
      </div>
      <div style={{ opacity: p2 }}>
        <SV><rect x={0} y={760} width={1920} height={320} fill="#0a0d08" /></SV>
        <div style={{ position: "absolute", left: 200, top: 620, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle,#ffd48a,#e8833a)`, transform: `translateY(${lin(f, d * 0.5, d * 0.65, 0, 160)}px)` }} />
        <SV><rect x={0} y={0} width={1920} height={760} fill="#000" opacity={0} /></SV>
        <Moon x={1650} y={lin(f, d * 0.75, d, 820, 560)} r={60} phase={0.3} />
        <div style={{ position: "absolute", left: 420, top: 360, width: 1080, height: 400, background: "rgba(0,0,0,.55)", border: `3px dashed ${C.red}`, opacity: ease(f, d * 0.6, d * 0.7) }} />
        <Tag x={640} y={300} op={ease(f, d * 0.6, d * 0.7)} color={C.red} size={52}>PURE DARKNESS</Tag>
        {[0, 1].map((i) => <Person key={i} x={lin(f, d * 0.55, d, 700 + i * 120, 1150 + i * 120)} y={860} s={0.5} walk />)}
        <Tag x={160} y={880} op={p2} size={36}>dusk</Tag><Tag x={1560} y={880} op={p2} size={36}>moonrise</Tag>
      </div>
    </AbsoluteFill>; },
  // "Sturdier huts. Toilets inside the home. Fewer bushpigs in the crops." — y los ataques bajan
  fixes: ({ d }) => { const f = F(), a = [0.05, 0.25, 0.45].map((t) => ease(f, d * t, d * t + 10));
    return <SunsetStage tree="acacia" horizon={640} night={0.7} pan={0.1}>
      <SV><rect x={300} y={600} width={420} height={260} fill="#7a4a2a" opacity={a[0]} />{a[0] > 0 && Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M300,${600 + i * 32} L720,${600 + i * 32}`} stroke="#5a3418" strokeWidth={3} opacity={a[0]} />)}
        <path d="M270,600 L510,470 L750,600 Z" fill="#5a5f66" opacity={a[0]} /></SV>
      <Hut x={1200} y={880} s={0.8} lit={0.8} />
      <div style={{ position: "absolute", left: 1150, top: 640, width: 100, height: 100, borderRadius: 50, background: "#f0ebe5", opacity: a[1], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🚽</div>
      <Pig x={1600} y={990} s={0.8} /><div style={{ opacity: 1 - a[2] }}><Pig x={1750} y={1010} s={0.8} /><Pig x={1450} y={1020} s={0.7} /></div>
      <div style={{ position: "absolute", left: 120, top: 120 }}>
        <Check x={0} y={0} k={a[0]} text="sturdier huts" /><Check x={0} y={100} k={a[1]} text="toilet inside" /><Check x={0} y={200} k={a[2]} text="fewer bushpigs" />
      </div>
    </SunsetStage>; },
  // cierre: la aldea gris; aparecen puerta, pared, luz, baño, mosquitero… y la lamparita se enciende
  lampoff: ({ d }) => { const f = F(), on = ease(f, d * 0.78, d * 0.84), items = ["door", "wall", "light", "toilet", "net"];
    return <AbsoluteFill style={{ filter: `grayscale(${1 - on}) brightness(${0.7 + 0.3 * on})` }}>
      <SunsetStage tree="acacia" horizon={640} night={1} pan={0.05}>
        <Hut x={960} y={900} s={1.4} lit={on} door={0} />
        <Lamp x={1300} y={900} on={on} h={330} />
        <Eyes x={lin(f, d * 0.8, d, 1600, 2100)} y={880} s={0.8} op={1 - on * 0.6} />
        <div style={{ position: "absolute", left: 120, top: 120, display: "flex", gap: 26 }}>
          {items.map((t, i) => { const k = ease(f, d * (0.18 + i * 0.1), d * (0.18 + i * 0.1) + 8); return <div key={t} style={{ padding: "10px 24px", borderRadius: 12, background: "rgba(244,239,230,.12)", border: "2px solid rgba(244,239,230,.5)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>{t.toUpperCase()}</div>; })}
        </div>
      </SunsetStage>
    </AbsoluteFill>; },
};
export const Scene: React.FC<{ name: string; d: number }> = ({ name, d }) => {
  const Sc = S[name];
  return Sc ? <Sc d={d} /> : <AbsoluteFill style={{ background: "#300" }} />;
};
export const SCENES = Object.keys(S);
export { Bat, Img, staticFile };
