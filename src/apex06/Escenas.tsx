// apex06 · escenas ILUSTRADAS del kit btg (escenario al atardecer + muñequito de chaleco + silueta del felino real).
// Cada escena actúa la frase que se dice y nunca queda quieta. f = cuadro local (0 = arranque del bloque), d = duración en cuadros.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Beast, C, Person, SunsetStage, ease } from "./kit";

const P = "apex06/cut/";
// recortes rembg (ancho/alto) y hacia dónde mira el animal en la foto original
export const CUT = {
  tiger: { img: P + "tiger.png", ar: 619 / 721, r: true }, tigercrouch: { img: P + "tigercrouch.png", ar: 1264 / 474, r: true },
  lioness: { img: P + "lioness.png", ar: 534 / 240, r: false }, lion: { img: P + "lion.png", ar: 607 / 416, r: false },
  cheetah: { img: P + "cheetah.png", ar: 1290 / 669, r: true }, snowleo: { img: P + "snowleo.png", ar: 1119 / 668, r: true },
  lynx: { img: P + "lynx.png", ar: 731 / 718, r: false }, cougar: { img: P + "cougar.png", ar: 517 / 580, r: true },
  leopard: { img: P + "leopard.png", ar: 1237 / 761, r: false }, jaguar: { img: P + "jaguar.png", ar: 689 / 340, r: true },
};
type K = keyof typeof CUT;
// el felino mirando a la derecha (right) o a la izquierda
const Cat: React.FC<{ k: K; x: number; y: number; w: number; right?: boolean; eye?: [number, number]; rim?: string; bob?: number; op?: number }> = ({ k, x, y, w, right = true, eye, rim, bob, op = 1 }) => {
  const c = CUT[k], h = w / c.ar, f = useCurrentFrame();
  // el leopardo de las nieves se reconoce por la cola larga y gruesa (el recorte la perdió): se dibuja atrás, en la grupa
  const tail = k === "snowleo" ? (() => {
    const sx = right ? x + 0.05 * w : x + 0.95 * w, sy = y - 0.6 * h, dir = right ? -1 : 1, L = 0.7 * w, sw = Math.sin(f / 14) * 0.06 * h;
    return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", filter: `drop-shadow(0 -3px 0 ${rim ?? C.glow}) drop-shadow(0 0 14px ${rim ?? C.glow}66)` }}>
      <path d={`M${sx},${sy} C${sx + dir * L * 0.35},${sy + 0.15 * h} ${sx + dir * L * 0.7},${sy + 0.55 * h + sw} ${sx + dir * L},${sy + 0.25 * h + sw}`} stroke="#000" strokeWidth={0.13 * h} strokeLinecap="round" fill="none" />
    </svg>;
  })() : null;
  return <div style={{ opacity: op }}>{tail}<Beast img={c.img} ar={c.ar} x={x} y={y} w={w} flip={c.r !== right} eye={eye ? [right === c.r ? eye[0] : eye[0], eye[1]] : undefined} rim={rim} bob={bob} /></div>;
};
const F = () => useCurrentFrame();
const lin = (f: number, a: number, b: number, x0: number, x1: number) => x0 + (x1 - x0) * Math.min(1, Math.max(0, (f - a) / (b - a)));

// ---------- piezas ----------
const Grass: React.FC<{ y: number; n?: number; h?: number; color?: string; seed?: number; sway?: number }> = ({ y, n = 90, h = 120, color = "#0a1310", seed = 1, sway = 1 }) => {
  const f = F();
  const d = Array.from({ length: n }).map((_, i) => {
    const x = (i / n) * 2000 - 40 + Math.sin(i * 7.3 + seed) * 12, hh = h * (0.55 + 0.45 * Math.abs(Math.sin(i * 3.1 + seed)));
    const s = Math.sin(f / 18 + i) * 6 * sway;
    return `M${x - 7},${y} Q${x + s * 0.5},${y - hh * 0.5} ${x + s},${y - hh} Q${x + 3},${y - hh * 0.5} ${x + 7},${y} Z`;
  }).join(" ");
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={d} fill={color} /><rect x={0} y={y - 1} width={1920} height={1080 - y} fill={color} /></svg>;
};
const Mountains: React.FC<{ y: number; color?: string; snow?: boolean; drift?: number }> = ({ y, color = "#1a2433", snow = true, drift = 0 }) => {
  const pk = [[-100, 0], [180, 330], [420, 120], [700, 420], [980, 160], [1240, 380], [1520, 140], [1800, 300], [2100, 0]];
  const d = "M" + pk.map(([x, h]) => `${x + drift},${y - h}`).join(" L") + ` L${2100 + drift},${y + 400} L${-100 + drift},${y + 400} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={d} fill={color} />
      {snow && pk.slice(1, -1).map(([x, h], i) => h > 250 ? <path key={i} d={`M${x + drift - 60},${y - h + 70} L${x + drift},${y - h} L${x + drift + 60},${y - h + 70} L${x + drift + 22},${y - h + 52} L${x + drift},${y - h + 74} L${x + drift - 24},${y - h + 50} Z`} fill="#cfd8e3" opacity={0.85} /> : null)}
    </svg>
  );
};
const Hut: React.FC<{ x: number; y: number; s?: number; lit?: number; door?: number }> = ({ x, y, s = 1, lit = 0, door = 0 }) => (
  <svg width={360 * s} height={300 * s} viewBox="0 0 360 300" style={{ position: "absolute", left: x - 180 * s, top: y - 300 * s, overflow: "visible" }}>
    <path d="M20,130 L180,20 L340,130 Z" fill="#2a1c12" />
    <rect x={50} y={128} width={260} height={172} fill="#3a2a1d" />
    <rect x={150} y={190} width={64} height={110} fill={`rgba(255,${170 + 40 * lit},90,${0.15 + 0.85 * lit})`} />
    <rect x={150} y={190} width={64} height={110} fill="#22160e" style={{ transformOrigin: "150px 245px", transform: `perspective(400px) rotateY(${-door * 75}deg)` }} />
    <rect x={250} y={160} width={36} height={30} fill={`rgba(255,190,100,${0.2 + 0.7 * lit})`} />
  </svg>
);
const Fire: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = F(), k = 1 + 0.12 * Math.sin(f / 2.3) + 0.08 * Math.sin(f / 1.3);
  return <>
    <div style={{ position: "absolute", left: x - 260 * s, top: y - 260 * s, width: 520 * s, height: 520 * s, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,150,60,${0.35 * k}) 0%, transparent 65%)` }} />
    <svg width={80 * s} height={110 * s} viewBox="0 0 80 110" style={{ position: "absolute", left: x - 40 * s, top: y - 100 * s }}>
      <path d={`M40,${110 - 100 * k} Q70,70 60,100 L20,100 Q10,70 40,${110 - 100 * k} Z`} fill="#ff8a2a" />
      <path d={`M40,${110 - 60 * k} Q55,85 50,100 L30,100 Q25,85 40,${110 - 60 * k} Z`} fill="#ffd48a" />
      <rect x={10} y={98} width={60} height={10} rx={4} fill="#2a1a10" />
    </svg>
  </>;
};
const Tent: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0.3 }) => (
  <svg width={260 * s} height={170 * s} viewBox="0 0 260 170" style={{ position: "absolute", left: x - 130 * s, top: y - 170 * s }}>
    <path d="M0,170 L130,0 L260,170 Z" fill="#c9b48a" opacity={0.92} />
    <path d="M0,170 L130,0 L130,170 Z" fill="#a8946c" />
    <path d="M105,170 L130,95 L155,170 Z" fill={`rgba(255,170,80,${glow})`} />
  </svg>
);
const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 60 }) => (
  <><div style={{ position: "absolute", left: x - r * 3, top: y - r * 3, width: r * 6, height: r * 6, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,255,.25) 0%, transparent 60%)" }} />
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "#e9ecf2", boxShadow: "inset -12px -8px 0 rgba(160,170,190,.35)" }} /></>
);
const Bird: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = F(), w = Math.sin(f / 3) * 22;
  return <svg width={240 * s} height={120 * s} viewBox="0 0 240 120" style={{ position: "absolute", left: x - 120 * s, top: y - 60 * s, overflow: "visible" }}>
    <path d={`M0,${50 - w} Q60,${40 - w} 110,62 Q120,50 130,62 Q180,${40 - w} 240,${50 - w} Q180,${66 - w * 0.5} 130,78 L120,96 L110,78 Q60,${66 - w * 0.5} 0,${50 - w} Z`} fill="#050505" />
  </svg>;
};
const Boat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={420 * s} height={90 * s} viewBox="0 0 420 90" style={{ position: "absolute", left: x - 210 * s, top: y - 90 * s }}>
    <path d="M0,30 L420,30 L380,90 L40,90 Z" fill="#1a120c" /><rect x={0} y={24} width={420} height={8} fill="#5a3a22" />
  </svg>
);
const Pig: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const f = F(), b = Math.sin(f / 5) * 3;
  return <svg width={160 * s} height={90 * s} viewBox="0 0 160 90" style={{ position: "absolute", left: x - 80 * s, top: y - 90 * s + b, transform: flip ? "scaleX(-1)" : undefined }}>
    <ellipse cx={75} cy={45} rx={62} ry={30} fill="#070707" /><path d="M128,40 L158,52 L130,62 Z" fill="#070707" />
    <rect x={30} y={60} width={10} height={30} fill="#070707" /><rect x={100} y={60} width={10} height={30} fill="#070707" /><path d="M120,30 L128,18 L132,34 Z" fill="#070707" />
  </svg>;
};
const Dog: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = F(), l = Math.sin(f / 2) * 14;
  return <svg width={150 * s} height={100 * s} viewBox="0 0 150 100" style={{ position: "absolute", left: x - 75 * s, top: y - 100 * s }}>
    <rect x={30} y={40} width={80} height={26} rx={12} fill="#070707" /><circle cx={118} cy={36} r={16} fill="#070707" /><path d="M110,24 L116,8 L124,24 Z" fill="#070707" />
    <path d="M30,46 L6,30" stroke="#070707" strokeWidth={6} strokeLinecap="round" />
    <rect x={40} y={60} width={8} height={36} fill="#070707" transform={`rotate(${l} 44 60)`} /><rect x={96} y={60} width={8} height={36} fill="#070707" transform={`rotate(${-l} 100 60)`} />
  </svg>;
};
const City: React.FC<{ y: number; drift?: number }> = ({ y, drift = 0 }) => {
  const bs = Array.from({ length: 26 }).map((_, i) => ({ x: i * 82 - 60 + drift, w: 64 + ((i * 37) % 40), h: 180 + ((i * 97) % 360) }));
  return <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {bs.map((b, i) => <g key={i}><rect x={b.x} y={y - b.h} width={b.w} height={b.h} fill="#0c1220" />
      {Array.from({ length: Math.floor(b.h / 34) * 3 }).map((_, j) => ((i * 13 + j * 7) % 5 < 2) ? <rect key={j} x={b.x + 10 + (j % 3) * (b.w / 3.2)} y={y - b.h + 14 + Math.floor(j / 3) * 34} width={10} height={14} fill="#ffcf7a" opacity={0.75} /> : null)}</g>)}
  </svg>;
};
const Domes: React.FC<{ y: number }> = ({ y }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <path d={`M200,${y} L200,${y - 200} Q330,${y - 380} 460,${y - 200} L460,${y} Z M520,${y} L520,${y - 150} L560,${y - 150} L560,${y} Z M600,${y} L600,${y - 120} Q680,${y - 240} 760,${y - 120} L760,${y} Z`} fill="#141b26" />
    <rect x={180} y={y - 20} width={620} height={20} fill="#141b26" />
  </svg>
);
// ojos que brillan en la oscuridad
const Eyes: React.FC<{ x: number; y: number; s?: number; op?: number }> = ({ x, y, s = 1, op = 1 }) => {
  const f = F(), blink = (f % 75) > 70 ? 0.15 : 1;
  return <>{[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: x + i * 34 * s - 7 * s, top: y - 5 * s, width: 16 * s, height: 10 * s * blink, borderRadius: 8 * s, background: "#ffc040", boxShadow: `0 0 ${20 * s}px ${6 * s}px #ff9a1a`, opacity: op }} />)}</>;
};
// persona con máscara en la nuca (Sundarbans)
const MaskHead: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={70 * s} height={80 * s} viewBox="0 0 70 80" style={{ position: "absolute", left: x - 35 * s, top: y - 40 * s }}>
    <ellipse cx={35} cy={40} rx={26} ry={32} fill="#e9dcc4" /><ellipse cx={24} cy={34} rx={6} ry={4} fill="#111" /><ellipse cx={46} cy={34} rx={6} ry={4} fill="#111" />
    <path d="M24,56 Q35,62 46,56" stroke="#111" strokeWidth={4} fill="none" />
  </svg>
);
const Cap: React.FC<{ y?: number; children: React.ReactNode }> = ({ y = 120, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "'Montserrat','Poppins',sans-serif", fontWeight: 900, fontSize: 64, color: C.orange, textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>{children}</div>
);

// ---------- escenas ----------
type SP = { d: number };
const S: Record<string, React.FC<SP>> = {
  // "It watches you. It learns where you walk…" — el hombre camina al río; el tigre agazapado en el pasto, adelante
  stalk: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={600} pan={0.35}>
    <Person x={lin(f, 0, d, 760, 1350)} y={640} s={0.5} walk />
    <Cat k="tigercrouch" x={lin(f, 0, d, -180, 120)} y={1010} w={980} right eye={[0.95, 0.32]} />
    <Grass y={1080} h={160} seed={2} />
  </SunsetStage>; },
  // pastor corre al leopardo de las nieves de la oveja muerta; el gato se aleja sin pelear
  herder: ({ d }) => { const f = F(); return <SunsetStage tree="pine" horizon={680} pan={0.2} sunX={1500}>
    <Mountains y={700} drift={-f * 0.15} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0,820 Q600,760 1100,800 T1920,780 L1920,1080 L0,1080 Z" fill="#2b2a2e" /></svg>
    <div style={{ position: "absolute", left: 860, top: 770, width: 120, height: 46, borderRadius: 24, background: "#d9d4c8" }} />
    <Person x={lin(f, 0, d, 380, 720)} y={830} s={0.6} walk arms="up" />
    <Cat k="snowleo" x={lin(f, 0, d, 1040, 1560)} y={810} w={420} right rim="#9fc2ff" />
  </SunsetStage>; },
  // "the ghost of the mountains" — de noche, nieve que cae, sólo los ojos
  ghost: ({ d }) => { const f = F(); return <SunsetStage tree="pine" horizon={700} night={1} pan={0.1}>
    <Mountains y={720} color="#121a26" />
    <Cat k="snowleo" x={1050} y={860} w={520} right={false} rim="#7f9cc8" op={lin(f, 0, d * 0.6, 0.15, 0.55)} />
    <Eyes x={1080} y={705} s={1.1} op={lin(f, 10, 30, 0, 1)} />
    {Array.from({ length: 80 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 197) % 1920) + Math.sin(f / 20 + i) * 20, top: ((i * 89 + f * (2 + (i % 3))) % 1080), width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.7 }} />)}
  </SunsetStage>; },
  // el guepardo pierde la presa… contra un pájaro
  vulture: ({ d }) => { const f = F(), back = ease(f, d * 0.55, d * 0.8); return <SunsetStage tree="acacia" horizon={640} pan={0.3}>
    <div style={{ position: "absolute", left: 1180, top: 790, width: 230, height: 54, borderRadius: "40% 60% 30% 30%", background: "#120a06" }} />
    <Cat k="cheetah" x={720 - back * 260} y={830} w={520} right eye={[0.93, 0.18]} />
    <Bird x={lin(f, 0, d * 0.55, 1700, 1120)} y={lin(f, 0, d * 0.55, 120, 730)} s={1.1} />
    {back > 0.1 && <Cap y={200}>?!</Cap>}
  </SunsetStage>; },
  // guepardos con correa en la corte real
  leash: ({ d }) => { const f = F(), x = lin(f, 0, d, 520, 1180); return <SunsetStage tree="palm" horizon={700} pan={0.25}>
    <Domes y={712} />
    <Person x={x} y={860} s={0.62} walk />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${x - 30},${770} Q${x - 90},${800} ${x - 150},${745}`} stroke="#d8b26a" strokeWidth={4} fill="none" /></svg>
    <Cat k="cheetah" x={x - 470} y={865} w={330} right />
  </SunsetStage>; },
  // excursionista pasa al lado del lince sin verlo
  hikerlynx: ({ d }) => { const f = F(); return <SunsetStage tree="pine" horizon={620} pan={0.4}>
    <Person x={lin(f, 0, d, 300, 1500)} y={760} s={0.55} walk />
    <div style={{ position: "absolute", left: 1180, top: 300, width: 70, height: 700, background: "#0b1512" }} />
    <Cat k="lynx" x={1240} y={900} w={250} right={false} eye={[0.14, 0.2]} />
    <Grass y={1080} h={110} seed={5} color="#0b1512" />
  </SunsetStage>; },
  // Pantanal: la lancha mira; el jaguar bosteza en la orilla
  boat: ({ d }) => { const f = F(); return <SunsetStage tree="palm" water horizon={560} pan={0.3}>
    <Boat x={lin(f, 0, d, 1200, 1050)} y={760 + Math.sin(f / 12) * 4} s={1.1} />
    <Person x={lin(f, 0, d, 1130, 980)} y={712} s={0.4} /><Person x={lin(f, 0, d, 1260, 1110)} y={712} s={0.4} flip />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0,900 Q400,840 760,920 L760,1080 L0,1080 Z" fill="#3a2a1f" /></svg>
    <Cat k="jaguar" x={200} y={960} w={600} right eye={[0.6, 0.45]} bob={1.5} />
  </SunsetStage>; },
  // el puma sigue al corredor por detrás y salta al final
  cougarfollow: ({ d }) => { const f = F(), j = ease(f, d - 50, d - 20); return <SunsetStage tree="pine" horizon={600} pan={0.6}>
    <Person x={1250 + Math.sin(f / 30) * 20} y={800} s={0.62} walk />
    <Cat k="cougar" x={lin(f, 0, d - 50, 120, 700) + j * 350} y={830 - j * 220} w={lin(f, 0, d, 160, 230)} right={false} rim={C.glow} />
    <Grass y={1080} h={90} seed={9} />
  </SunsetStage>; },
  // "stand tall, wave your arms"
  standtall: ({ d }) => { const f = F(), up = ease(f, 10, 30); return <SunsetStage tree="pine" horizon={620} pan={0.2}>
    <Person x={720} y={860} s={0.7 + 0.18 * up} arms={up > 0.5 ? "up" : "down"} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M1150,860 L1350,700 L1700,740 L1820,860 Z" fill="#1d1a18" /></svg>
    <Cat k="cougar" x={1300 + ease(f, d * 0.5, d) * 120} y={740} w={260} right={false} eye={[0.3, 0.3]} />
    {up > 0.5 && <Cap y={170}>BIG · LOUD · UGLY</Cap>}
  </SunsetStage>; },
  // "fight back" — con un palo
  standtall2: ({ d }) => { const f = F(); return <SunsetStage tree="pine" horizon={640} pan={0.25}>
    <Person x={760} y={880} s={0.8} arms="spear" />
    <Cat k="cougar" x={1180 + ease(f, d * 0.4, d) * 260} y={880} w={300} right={false} eye={[0.3, 0.3]} />
    <Grass y={1080} h={90} seed={11} />
  </SunsetStage>; },
  // Mumbai: el leopardo baja a la calle; el perro sale corriendo
  mumbai: ({ d }) => { const f = F(); return <SunsetStage tree="palm" horizon={720} night={1} pan={0.15}>
    <City y={740} drift={-f * 0.2} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 740, height: 340, background: "#15161a" }} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: (i * 520 - f * 2) % 2100, top: 900, width: 160, height: 10, background: "#3a3a3a" }} />)}
    <div style={{ position: "absolute", left: 1500, top: 520, width: 10, height: 380, background: "#222" }} /><div style={{ position: "absolute", left: 1360, top: 560, width: 400, height: 520, background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,120,.22), transparent 70%)" }} />
    <Dog x={lin(f, d * 0.35, d, 1300, 2100)} y={890} s={0.8} />
    <Cat k="leopard" x={lin(f, 0, d, 160, 900)} y={900} w={460} right eye={[0.08, 0.2]} />
  </SunsetStage>; },
  // de noche, el leopardo empuja la puerta de la casa
  door: ({ d }) => { const f = F(), dr = ease(f, d * 0.5, d * 0.75); return <SunsetStage tree="acacia" horizon={640} night={0.9} pan={0.15}>
    <Hut x={700} y={860} s={1.3} lit={0.7} door={dr} />
    <Cat k="leopard" x={lin(f, 0, d * 0.55, 1500, 950)} y={865} w={420} right={false} eye={[0.08, 0.2]} />
  </SunsetStage>; },
  // camino de peregrinos: todos adentro antes de que se ponga el sol
  pilgrim: ({ d }) => { const f = F(), n = ease(f, 0, d); return <SunsetStage tree="pine" horizon={640} night={n} pan={0.2}>
    <Mountains y={660} drift={0} />
    <Hut x={1200} y={860} s={1.1} lit={0.4 + 0.5 * n} door={0} />
    {[0, 1, 2].map((i) => <Person key={i} x={lin(f, 0, d * 0.8, 260 + i * 120, 1230)} y={860} s={0.5} walk />)}
  </SunsetStage>; },
  // Corbett en el árbol, de noche, esperando
  machan: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={760} night={1} pan={0.08}>
    <Moon x={1600} y={200} r={50} />
    <div style={{ position: "absolute", left: 560, top: 180, width: 70, height: 900, background: "#050807" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M595,300 Q400,200 250,240 M595,260 Q800,160 980,220" stroke="#050807" strokeWidth={34} fill="none" /><rect x={470} y={420} width={260} height={16} fill="#2a1a10" /></svg>
    <Person x={600} y={422} s={0.55} arms="spear" dark />
    <Eyes x={lin(f, 0, d, 1400, 1100)} y={950} s={1} op={lin(f, 15, 40, 0, 1)} />
    <Grass y={1080} h={140} seed={3} color="#05090a" />
  </SunsetStage>; },
  // Tsavo 1898: carpas, fogata, cerco de espinas… y los leones igual
  tsavo: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={620} night={1} pan={0.12}>
    <Tent x={520} y={820} s={1.1} glow={0.5} /><Tent x={820} y={790} s={0.9} glow={0.35} /><Tent x={1080} y={830} s={1.15} glow={0.45} />
    <Fire x={700} y={880} s={1} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={"M0,900 " + Array.from({ length: 40 }).map((_, i) => `L${i * 50 + 25},${880 - (i % 2) * 34}`).join(" ")} stroke="#1a120c" strokeWidth={10} fill="none" /></svg>
    <Cat k="lioness" x={lin(f, 0, d, 1700, 1240)} y={930} w={420} right={false} eye={[0.06, 0.3]} />
    <Cat k="lion" x={lin(f, d * 0.3, d, 1950, 1560)} y={950} w={380} right={false} eye={[0.12, 0.33]} />
  </SunsetStage>; },
  // la choza en el campo, los chanchos de monte en el maíz, el león detrás de los chanchos
  field: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={600} night={0.85} pan={0.15}>
    <Moon x={300} y={180} r={42} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 70 }).map((_, i) => <path key={i} d={`M${i * 28},960 L${i * 28 + Math.sin(f / 15 + i) * 4},${780 + (i % 5) * 10}`} stroke="#1c2a14" strokeWidth={6} />)}
      <g transform="translate(-320,0)"><rect x={1340} y={660} width={14} height={180} fill="#2a1a10" /><rect x={1560} y={660} width={14} height={180} fill="#2a1a10" />
      <path d="M1300,560 L1460,470 L1620,560 Z" fill="#2a1c12" /><rect x={1320} y={560} width={280} height={110} fill="#3a2a1d" /></g>
    </svg>
    <div style={{ position: "absolute", left: 1080, top: 615, width: 120, height: 34, borderRadius: 16, background: C.vest }} /><div style={{ position: "absolute", left: 1060, top: 612, width: 36, height: 36, borderRadius: 18, background: "#f2c49b" }} />
    <Pig x={lin(f, 0, d, 900, 1060)} y={980} s={0.9} /><Pig x={lin(f, 0, d, 660, 820)} y={1000} s={0.8} />
    <Cat k="lioness" x={lin(f, d * 0.35, d, -400, 160)} y={1010} w={520} right eye={[0.94, 0.3]} />
  </SunsetStage>; },
  // la luna sale tarde: las primeras horas son negras y la gente vuelve a casa
  moon: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={640} night={1} pan={0.15}>
    <Moon x={1550} y={lin(f, 0, d, 600, 300)} r={56} />
    {[0, 1].map((i) => <Person key={i} x={lin(f, 0, d, 420 + i * 110, 900 + i * 110)} y={820} s={0.5} walk />)}
    <Eyes x={1180} y={900} s={0.9} op={lin(f, 20, 45, 0, 1)} />
    <Grass y={1080} h={150} seed={7} color="#060a08" />
  </SunsetStage>; },
  // Sundarbans: el mielero camina con el humo, cabeza baja; el tigre detrás
  honey: ({ d }) => { const f = F(), x = lin(f, 0, d, 900, 1300); return <SunsetStage tree="mangrove" water horizon={600} pan={0.3}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0,860 Q700,800 1920,850 L1920,1080 L0,1080 Z" fill="#3a2a1f" />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${i * 66 + 10},${880 + (i % 3) * 30} l6,-34 l6,34 Z`} fill="#20160f" />)}</svg>
    {Array.from({ length: 6 }).map((_, i) => { const k = ((f + i * 12) % 72) / 72; return <div key={i} style={{ position: "absolute", left: x + 40 + k * 40, top: 680 - k * 260, width: 40 + k * 70, height: 40 + k * 70, borderRadius: "50%", background: `rgba(220,220,220,${0.35 * (1 - k)})` }} />; })}
    <Person x={x} y={880} s={0.62} walk />
    <Cat k="tigercrouch" x={lin(f, 0, d, 40, 300)} y={930} w={620} right eye={[0.95, 0.32]} />
  </SunsetStage>; },
  // la máscara en la nuca: el tigre ve una cara y no ataca
  mask: ({ d }) => { const f = F(), stop = ease(f, d * 0.4, d * 0.55), turn = ease(f, d * 0.7, d); return <SunsetStage tree="mangrove" water horizon={600} pan={0.25}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0,860 Q700,800 1920,850 L1920,1080 L0,1080 Z" fill="#3a2a1f" /></svg>
    <Person x={lin(f, 0, d, 1050, 1400)} y={880} s={0.7} walk flip />
    <MaskHead x={lin(f, 0, d, 1050, 1400) - 4} y={880 - 260 * 0.7 + 58 * 0.7} s={0.95} />
    <Cat k="tigercrouch" x={lin(f, 0, d * 0.4, 0, 340) - turn * 300} y={940} w={600} right eye={[0.95, 0.32]} />
    {stop > 0.5 && <Cap y={190}>?</Cap>}
  </SunsetStage>; },
  // frente al león: quieto, de cara, retrocediendo despacio
  lionface: ({ d }) => { const f = F(); return <SunsetStage tree="acacia" horizon={640} pan={0.2}>
    <Person x={lin(f, 0, d, 760, 560)} y={880} s={0.72} />
    <Cat k="lion" x={1120} y={900} w={520} right={false} eye={[0.12, 0.33]} />
    <Grass y={1080} h={100} seed={4} color="#2a1d12" />
  </SunsetStage>; },
  // en grupo: el tigre ve que lo vieron y se va
  group: ({ d }) => { const f = F(), seen = ease(f, d * 0.4, d * 0.55); return <SunsetStage tree="mangrove" horizon={620} pan={0.3}>
    {[0, 1, 2].map((i) => <Person key={i} x={lin(f, 0, d, 900 + i * 120, 1150 + i * 120)} y={860} s={0.58} walk={i !== 0 || seen < 0.5} arms={i === 0 && seen > 0.5 ? "up" : "down"} flip={i === 0 && seen > 0.5} />)}
    <Cat k="tigercrouch" x={lin(f, 0, d * 0.45, 100, 300) - ease(f, d * 0.6, d) * 520} y={980} w={620} right eye={[0.95, 0.32]} />
    <Grass y={1080} h={170} seed={8} />
    {seen > 0.5 && <Cap y={200}>SEEN.</Cap>}
  </SunsetStage>; },
  // la fila de cazadores que crece; las siluetas de los gatos se apagan
  hunters: ({ d }) => { const f = F(), n = Math.min(14, 1 + Math.floor(lin(f, 0, d * 0.7, 1, 14))); return <SunsetStage tree="acacia" horizon={700} pan={0.1}>
    {Array.from({ length: n }).map((_, i) => <Person key={i} x={140 + i * 125} y={760} s={0.55} arms="spear" dark />)}
    {(["tiger", "lion", "leopard"] as K[]).map((k, i) => <Cat key={k} k={k} x={300 + i * 520} y={1040} w={k === "tiger" ? 200 : 360} right op={lin(f, d * 0.2, d, 1, 0.12)} rim={C.ember} />)}
  </SunsetStage>; },
};
export const Scene: React.FC<{ name: string; d: number }> = ({ name, d }) => {
  const Sc = S[name];
  return Sc ? <Sc d={d} /> : <AbsoluteFill style={{ background: "#300" }} />;
};
