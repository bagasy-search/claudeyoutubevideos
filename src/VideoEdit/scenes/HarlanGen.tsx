// HarlanGen.tsx — KIT DEL GENERADOR (canal Harlan the Lineman, video del monóxido). Hecho a mano en
// código, con CAPAS de profundidad: cielo y árboles lejos, la casa en corte en el medio, nieve cerca y
// desenfocada adelante, cámara que empuja. Todo determinista (hash entero), subpíxel por CSS/SVG.
//
//  · COHouseCutaway  casa en corte: el generador en el garaje con la puerta a medio abrir, el gas sube,
//                    rueda por el techo, pasa por debajo de la puerta a la cocina y sube a los cuartos.
//  · StackEffect     la casa "respira hacia adentro" por abajo: aire tibio sale arriba, entra por abajo.
//  · BloodGrab       macro de glóbulos rojos: el CO desplaza al oxígeno y se queda agarrado.
//  · GenVsCars       un generador = cientos de autos (grilla de autos que se llena en ola).
//  · YardPlan        plano de patio en perspectiva: cinta métrica a 20 ft, estaca, viento, escape lejos.
//  · HiddenKillers   4 tarjetas en profundidad (parrilla, horno, auto, ventilación); una pasa al frente.
//  · AlarmMap        corte de la casa: alarmas que caen en cada piso y afuera de cada cuarto, con pulso.
//  · SameHeadache    la familia en fila: el mismo dolor de cabeza late a la vez en todos.
//  · TwoAMDecision   pantalla partida: 2 AM en la nieve contra una tarde de sol con la estaca.
//
// Reglas de oficio: nada de <Video>; fundido de entrada/salida; el sonido va por style.fx.compSfx.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadStencil } from "@remotion/google-fonts/BlackOpsOne";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/ShareTechMono";

const BEBAS = loadBebas("normal", { subsets: ["latin"] }).fontFamily;
const STENCIL = loadStencil().fontFamily;
const OSW = loadOswald("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
const MONO = loadMono().fontFamily;

const C = {
  ink: "#0A0C0E", night: "#0B1320", steel: "#8E989F", paper: "#F3EEE2", hivis: "#F5C400",
  orange: "#FF6A13", red: "#E0301E", redDeep: "#8C160C", ice: "#BFE3FF", cold: "#6FB2E8",
  warm: "#FFB347", window: "#FFD27A", green: "#58F08A", white: "#F4F6F7", co: "#B8A89A",
};
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
const fadeIO = (f: number, D: number, i = 8, o = 10) => Math.min(interpolate(f, [0, i], [0, 1], CL), interpolate(f, [D - o, D], [1, 0], CL));

/** Textura de grano (capa de adelante). */
const Grano: React.FC<{ o?: number }> = ({ o = 0.07 }) => {
  const f = useCurrentFrame();
  const s = Math.floor(f / 2) % 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%"><filter id={`gg${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /></filter><rect width="100%" height="100%" filter={`url(#gg${s})`} /></svg>
    </AbsoluteFill>
  );
};
/** Nieve en dos capas: lejos (chica, nítida) y cerca (grande, desenfocada, más rápida). */
const Nieve: React.FC<{ near?: boolean; n?: number; o?: number; seed?: number }> = ({ near = false, n = 60, o = 0.8, seed = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const k = i + seed * 1000;
        const sp = near ? 5 + rnd(k, 2) * 4 : 1.2 + rnd(k, 2) * 2;
        const x = rnd(k, 1) * 1980 - 30 + Math.sin((f + i * 17) / (near ? 14 : 24)) * (near ? 30 : 14);
        const y = ((rnd(k, 3) * 1200 + f * sp) % 1200) - 60;
        const r = near ? 9 + rnd(k, 4) * 14 : 1.5 + rnd(k, 4) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#fff", opacity: near ? 0.35 : 0.4 + rnd(k, 5) * 0.5, filter: near ? `blur(${4 + rnd(k, 6) * 5}px)` : undefined }} />;
      })}
    </AbsoluteFill>
  );
};
const Vineta: React.FC<{ o?: number }> = ({ o = 0.75 }) => <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${o}) 100%)` }} />;
const Titulo: React.FC<{ text?: string; eyebrow?: string; f: number; at?: number; color?: string; top?: number; left?: number; size?: number; align?: "left" | "center" }> =
  ({ text, eyebrow, f, at = 6, color = C.white, top = 70, left = 90, size = 92, align = "left" }) => {
  if (!text && !eyebrow) return null;
  const a = interpolate(f, [at, at + 14], [0, 1], { ...CL, easing: easeOut });
  return (
    <div style={{ position: "absolute", top, left: align === "center" ? 0 : left, right: align === "center" ? 0 : undefined, textAlign: align, opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>
      {eyebrow ? <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.hivis, textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}>{eyebrow}</div> : null}
      {text ? <div style={{ fontFamily: BEBAS, fontSize: size, lineHeight: 0.95, color, letterSpacing: 1, textShadow: "0 6px 28px rgba(0,0,0,0.85)", maxWidth: align === "center" ? undefined : 1250 }}>{text}</div> : null}
    </div>
  );
};

// ─── la CASA EN CORTE (compartida por COHouseCutaway, StackEffect y AlarmMap) ─────────────────────
// Coordenadas: suelo y=860 · garaje x 250-700 (techo 560) · casa x 700-1520: PB 560-860, PA 300-560,
// techo a dos aguas hasta 150 · sótano 860-1010.
const G = { gx0: 250, gx1: 700, hx1: 1520, y0: 860, yPB: 560, yPA: 300, peak: 150, yS: 1010 };
const Casa: React.FC<{ door?: number; lights?: number; sleepers?: boolean; noGarage?: boolean }> = ({ door = 0.5, lights = 1, sleepers = true, noGarage = false }) => {
  const f = useCurrentFrame();
  const wall = "#1B2733", line = "#3E5366", room = "#131C27";
  const warm = `rgba(255,190,110,${0.16 * lights})`;
  const dh = (G.y0 - 620) * (1 - door);            // cuánto baja la puerta del garaje
  return (
    <g>
      {/* sótano */}
      <rect x={700} y={G.y0} width={G.hx1 - 700} height={G.yS - G.y0} fill="#0E141B" stroke={line} strokeWidth={4} />
      <rect x={1180} y={G.y0 + 40} width={70} height={95} rx={6} fill="#26323E" stroke={line} strokeWidth={3} />
      <text x={760} y={G.y0 + 115} fontFamily={OSW} fontWeight={600} fontSize={22} fill="#5F7487" letterSpacing={4}>BASEMENT</text>
      {/* planta baja + planta alta */}
      <rect x={700} y={G.yPB} width={G.hx1 - 700} height={G.y0 - G.yPB} fill={room} stroke={wall} strokeWidth={10} />
      <rect x={700} y={G.yPA} width={G.hx1 - 700} height={G.yPB - G.yPA} fill={room} stroke={wall} strokeWidth={10} />
      <rect x={700} y={G.yPB} width={G.hx1 - 700} height={G.y0 - G.yPB} fill={warm} />
      <rect x={700} y={G.yPA} width={G.hx1 - 700} height={G.yPB - G.yPA} fill={warm} />
      <path d={`M 680 ${G.yPA} L 1110 ${G.peak} L 1540 ${G.yPA} Z`} fill="#18222D" stroke={wall} strokeWidth={10} strokeLinejoin="round" />
      {/* tabiques, escalera */}
      <line x1={1110} y1={G.yPA} x2={1110} y2={G.yPB} stroke={wall} strokeWidth={8} />
      <path d={`M 960 ${G.y0} L 1100 ${G.yPB + 8}`} stroke="#4A5E70" strokeWidth={10} />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={960 + i * 20} y1={G.y0 - i * 42.6} x2={985 + i * 20} y2={G.y0 - i * 42.6} stroke="#4A5E70" strokeWidth={5} />)}
      {/* cocina: mesada y heladera */}
      <rect x={1300} y={G.y0 - 120} width={200} height={120} fill="#243140" stroke={line} strokeWidth={3} />
      <rect x={1240} y={G.y0 - 210} width={55} height={210} fill="#2C3A48" stroke={line} strokeWidth={3} />
      <text x={1320} y={G.yPB + 50} fontFamily={OSW} fontWeight={600} fontSize={22} fill="#6D8398" letterSpacing={4}>KITCHEN</text>
      <text x={760} y={G.yPA + 50} fontFamily={OSW} fontWeight={600} fontSize={22} fill="#6D8398" letterSpacing={4}>BEDROOM</text>
      <text x={1160} y={G.yPA + 50} fontFamily={OSW} fontWeight={600} fontSize={22} fill="#6D8398" letterSpacing={4}>BEDROOM</text>
      {/* camas con gente durmiendo */}
      {sleepers ? [[760, G.yPB - 70], [1170, G.yPB - 70], [1330, G.yPB - 70]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={i === 2 ? 130 : 200} height={34} rx={8} fill="#3B4B5B" />
          <ellipse cx={x + 28} cy={y - 8} rx={22} ry={16} fill="#C9B8A6" />
          <path d={`M ${x + 50} ${y - 4} q ${i === 2 ? 40 : 70} -26 ${i === 2 ? 75 : 140} 0`} fill="#6F87A3" />
          <text x={x + 40} y={y - 40 - ((f / 2 + i * 9) % 30)} fontFamily={OSW} fontSize={26} fill="#8FA6BD" opacity={0.6 - ((f / 2 + i * 9) % 30) / 50}>z</text>
        </g>
      )) : null}
      {/* ventanas */}
      {[[1420, G.yPA + 80], [860, G.yPB + 70]].map(([x, y], i) => <rect key={i} x={x} y={y} width={70} height={90} fill={`rgba(255,210,122,${0.35 * lights})`} stroke={line} strokeWidth={4} />)}
      {/* puerta garaje→cocina con luz por debajo */}
      <rect x={694} y={G.y0 - 150} width={12} height={140} fill="#5A4636" />
      {!noGarage ? (
        <g>
          <rect x={G.gx0} y={G.yPB} width={G.gx1 - G.gx0} height={G.y0 - G.yPB} fill="#10161D" stroke={wall} strokeWidth={10} />
          <path d={`M ${G.gx0 - 20} ${G.yPB} L ${(G.gx0 + G.gx1) / 2} ${G.yPB - 90} L ${G.gx1 + 10} ${G.yPB} Z`} fill="#18222D" stroke={wall} strokeWidth={10} strokeLinejoin="round" />
          <text x={G.gx0 + 40} y={G.yPB + 50} fontFamily={OSW} fontWeight={600} fontSize={22} fill="#6D8398" letterSpacing={4}>GARAGE</text>
          {/* estantes y bidón */}
          <rect x={G.gx1 - 150} y={G.yPB + 90} width={120} height={8} fill="#3A4652" />
          <rect x={G.gx1 - 140} y={G.yPB + 60} width={30} height={30} fill="#7A2A20" />
          {/* puerta del garaje: abertura en la pared izquierda, persiana bajada hasta la mitad */}
          <rect x={G.gx0 - 6} y={620} width={14} height={G.y0 - 620} fill="#05080B" />
          <rect x={G.gx0 - 14} y={620} width={28} height={dh} fill="#6B7884" stroke="#9AA6B0" strokeWidth={2} />
          {Array.from({ length: Math.floor(dh / 26) }, (_, i) => <line key={i} x1={G.gx0 - 14} x2={G.gx0 + 14} y1={620 + 26 * (i + 1)} y2={620 + 26 * (i + 1)} stroke="#46525D" strokeWidth={2} />)}
          {/* generador */}
          <g transform={`translate(400, ${G.y0 - 92})`}>
            <rect x={0} y={0} width={150} height={88} rx={8} fill={C.hivis} stroke="#6A5500" strokeWidth={4} />
            <rect x={14} y={14} width={78} height={40} rx={4} fill="#2A2A2A" />
            <rect x={100} y={16} width={36} height={20} fill="#555" />
            <rect x={150} y={48} width={20} height={12} fill="#777" />
            <g transform={`translate(${Math.sin(f * 2.1) * 1.2}, ${Math.cos(f * 2.7) * 1.2})`}><circle cx={52} cy={34} r={10} fill="#444" /></g>
          </g>
        </g>
      ) : null}
      {/* suelo */}
      <rect x={0} y={G.y0} width={700} height={20} fill="#DDE6EE" />
      <rect x={G.hx1} y={G.y0} width={1920 - G.hx1} height={20} fill="#DDE6EE" />
    </g>
  );
};
/** Fondo nocturno con profundidad: cielo, luna, línea de árboles lejos, postes. */
const NocheLejos: React.FC<{ push?: number }> = ({ push = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #06101C 0%, #0F2135 60%, #1B2C3E 100%)" }} />
    <div style={{ position: "absolute", left: 1640 - push * 20, top: 90, width: 90, height: 90, borderRadius: 90, background: "#E9EEF2", boxShadow: "0 0 80px 30px rgba(200,220,240,0.25)", filter: "blur(1px)" }} />
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, transform: `translateX(${-push * 30}px)`, filter: "blur(2.5px)" }}>
      <path d={`M -40 820 ${Array.from({ length: 26 }, (_, i) => `L ${i * 80} ${760 - rnd(i, 7) * 90} L ${i * 80 + 40} ${805}`).join(" ")} L 2000 820 L 2000 1080 L -40 1080 Z`} fill="#0A1622" />
      {[1620, 1830].map((x, i) => <g key={i}><rect x={x} y={560} width={9} height={260} fill="#0D1A26" /><rect x={x - 40} y={580} width={90} height={7} fill="#0D1A26" /></g>)}
      <path d="M 1620 585 Q 1725 625 1830 585" stroke="#0D1A26" strokeWidth={3} fill="none" />
    </svg>
  </AbsoluteFill>
);

// ═══ 1) CO HOUSE CUTAWAY ══════════════════════════════════════════════════════════════════════
export const COHouseCutaway: React.FC<{ durationInFrames: number; title?: string; eyebrow?: string; door?: number }> =
  ({ durationInFrames, title = "THE OPEN DOOR DOESN'T SAVE YOU", eyebrow, door = 0.5 }) => {
  const f = useCurrentFrame();
  const D = Math.max(120, durationInFrames);
  const op = fadeIO(f, D);
  const T = (a: number, b: number) => interpolate(f, [D * a, D * b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const garage = T(0.05, 0.4), kitchen = T(0.32, 0.65), bed = T(0.55, 0.88);
  const z = interpolate(f, [0, D], [1.0, 1.09], CL);
  const push = interpolate(f, [0, D], [0, 1], CL);
  const ex = 570, ey = G.y0 - 40;     // escape del generador
  // partículas: nacen en el escape, suben al techo del garaje, ruedan, pasan por la puerta y suben la escalera
  const P = 70;
  const parts = Array.from({ length: P }, (_, i) => {
    const born = i * 2.2;
    const a = f - born;
    if (a < 0) return null;
    const life = 150;
    const p = (a % life) / life;
    const sx = rnd(i, 1), sy = rnd(i, 2);
    let x: number, y: number;
    if (p < 0.22) { const q = p / 0.22; x = ex + (sx - 0.3) * 60 * q; y = ey - (ey - (G.yPB + 30)) * Math.sqrt(q); }
    else if (p < 0.5) { const q = (p - 0.22) / 0.28; x = ex + (sx - 0.5) * 380 * q; y = G.yPB + 30 + sy * 90 * q + garage * 120 * q; }
    else if (p < 0.72) { const q = (p - 0.5) / 0.22; x = interpolate(q, [0, 1], [640, 1000]); y = interpolate(q, [0, 1], [G.y0 - 30 - sy * 40, G.y0 - 40 - sy * 120]); if (kitchen < 0.05) return null; }
    else { const q = (p - 0.72) / 0.28; x = interpolate(q, [0, 1], [1000, 820 + sx * 560]); y = interpolate(q, [0, 1], [G.yPB + 60, G.yPA + 90 + sy * 150]); if (bed < 0.05) return null; }
    const r = 14 + p * 40 + sx * 16;
    return <circle key={i} cx={x + Math.sin((f + i * 11) / 9) * 8} cy={y} r={r} fill="url(#coPuff)" opacity={0.55 * (1 - Math.abs(p - 0.5) * 0.6)} />;
  });
  const fog = (lvl: number, x: number, y: number, w: number, h: number, key: string) => (
    <rect key={key} x={x} y={y} width={w} height={h * lvl} fill="url(#coFill)" opacity={0.85 * lvl} />
  );
  // viento que entra por la abertura
  const wind = Array.from({ length: 5 }, (_, i) => {
    const p = ((f + i * 12) % 60) / 60;
    return <path key={i} d={`M ${60 + p * 170} ${700 + i * 32} q 40 -10 80 0`} stroke={C.ice} strokeWidth={4} fill="none" opacity={0.6 * Math.sin(p * Math.PI)} strokeLinecap="round" />;
  });
  const alerta = bed > 0.6 ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  return (
    <AbsoluteFill style={{ opacity: op, background: C.night, overflow: "hidden" }}>
      <NocheLejos push={push} />
      <Nieve n={70} o={0.55} seed={1} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "62% 48%" }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="coPuff"><stop offset="0" stopColor="#C9B7A6" stopOpacity="0.55" /><stop offset="1" stopColor="#C9B7A6" stopOpacity="0" /></radialGradient>
            <linearGradient id="coFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9C3A2A" stopOpacity="0.7" /><stop offset="1" stopColor="#9C3A2A" stopOpacity="0.15" /></linearGradient>
          </defs>
          <Casa door={door} lights={1 - bed * 0.4} />
          {fog(garage, G.gx0, G.yPB, G.gx1 - G.gx0, G.y0 - G.yPB, "g")}
          {fog(kitchen, 700, G.yPB, G.hx1 - 700, G.y0 - G.yPB, "k")}
          {fog(bed, 700, G.yPA, G.hx1 - 700, G.yPB - G.yPA, "b")}
          {parts}
          {wind}
          {/* recorrido del gas: línea punteada que avanza */}
          <path d={`M ${ex} ${ey} L ${ex} ${G.yPB + 30} L 660 ${G.yPB + 40} L 660 ${G.y0 - 20} L 960 ${G.y0 - 20} L 1100 ${G.yPB + 10} L 1100 ${G.yPA + 120}`} fill="none" stroke={C.red} strokeWidth={6} opacity={0.9} pathLength={1000}
            style={{ strokeDasharray: `${interpolate(f, [D * 0.08, D * 0.85], [0, 1000], CL)} 2000` }} />
          {/* etiquetas */}
          <g opacity={interpolate(f, [D * 0.12, D * 0.2], [0, 1], CL)}>
            <rect x={170} y={612} width={160} height={40} rx={6} fill="rgba(0,0,0,0.6)" />
            <text x={250} y={641} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={24} fill={C.ice} letterSpacing={2}>WIND PUSHES IN</text>
          </g>
          <g opacity={interpolate(f, [D * 0.35, D * 0.42], [0, 1], CL)}>
            <text x={610} y={G.y0 + 55} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={24} fill={C.warm} letterSpacing={2}>UNDER THE DOOR</text>
          </g>
          <g opacity={bed}>
            <rect x={940} y={G.yPA + 150} width={330} height={62} rx={8} fill={`rgba(140,22,12,${0.55 + alerta * 0.35})`} stroke={C.red} strokeWidth={3} />
            <text x={1105} y={G.yPA + 193} textAnchor="middle" fontFamily={STENCIL} fontSize={34} fill={C.white}>WHERE THEY SLEEP</text>
          </g>
        </svg>
      </AbsoluteFill>
      <Nieve near n={14} o={0.9} seed={2} />
      <Vineta o={0.6} />
      <Titulo f={f} text={title} eyebrow={eyebrow} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 2) STACK EFFECT ══════════════════════════════════════════════════════════════════════════
export const StackEffect: React.FC<{ durationInFrames: number; title?: string; eyebrow?: string; sub?: string }> =
  ({ durationInFrames, title = "A WARM HOUSE BREATHES IN FROM THE BOTTOM", eyebrow = "THE STACK EFFECT", sub = "and the garage sits right at the bottom" }) => {
  const f = useCurrentFrame();
  const D = Math.max(90, durationInFrames);
  const op = fadeIO(f, D);
  const z = interpolate(f, [0, D], [1.03, 1.1], CL);
  const flecha = (x: number, y: number, dx: number, dy: number, color: string, k: number, t0: number) => {
    const a = interpolate(f, [t0, t0 + 12], [0, 1], CL);
    const p = ((f + k * 13) % 45) / 45;
    const ox = dx * p * 0.5, oy = dy * p * 0.5;
    return (
      <g key={`${x}-${y}-${k}`} opacity={a * (0.35 + 0.65 * Math.sin(p * Math.PI))}>
        <line x1={x + ox} y1={y + oy} x2={x + dx + ox} y2={y + dy + oy} stroke={color} strokeWidth={12} strokeLinecap="round" />
        <circle cx={x + dx + ox} cy={y + dy + oy} r={14} fill={color} />
      </g>
    );
  };
  const tIn = D * 0.3;
  return (
    <AbsoluteFill style={{ opacity: op, background: C.night, overflow: "hidden" }}>
      <NocheLejos push={interpolate(f, [0, D], [0, 1], CL)} />
      <Nieve n={60} o={0.5} seed={3} />
      <AbsoluteFill style={{ transform: `scale(${z * 0.86}) translate(-260px, 120px)`, transformOrigin: "55% 60%" }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <Casa door={0.5} sleepers={false} />
          {/* calor que sube adentro */}
          {Array.from({ length: 4 }, (_, k) => flecha(820 + k * 190, 780, 0, -380, "rgba(255,160,70,0.85)", k, 8))}
          {/* sale arriba por el techo/ático */}
          {[[930, 250, -70, -90], [1290, 250, 70, -90]].map(([x, y, dx, dy], k) => flecha(x, y, dx, dy, C.orange, k + 7, 20))}
          {/* entra abajo: frío por las rendijas y el gas del garaje por la puerta */}
          {[[1640, 840, -120, 0], [1600, 960, -100, -30]].map(([x, y, dx, dy], k) => flecha(x, y, dx, dy, C.cold, k + 3, tIn))}
          {Array.from({ length: 3 }, (_, k) => flecha(560, 780 + k * 26, 130, 0, "#B06A55", k + 11, tIn + 10))}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 60, top: 360, width: 520, fontFamily: OSW, fontWeight: 700, fontSize: 34, lineHeight: 1.35, color: C.white }}>
        <div style={{ color: C.warm, opacity: interpolate(f, [14, 24], [0, 1], CL) }}>▲ WARM AIR LEAKS OUT UP HIGH</div>
        <div style={{ color: C.cold, marginTop: 22, opacity: interpolate(f, [tIn, tIn + 10], [0, 1], CL) }}>▼ AIR GETS PULLED IN DOWN LOW</div>
        <div style={{ color: "#E08C73", marginTop: 22, opacity: interpolate(f, [tIn + 14, tIn + 24], [0, 1], CL) }}>◀ STRAIGHT FROM THE GARAGE</div>
      </div>
      <Nieve near n={12} o={0.85} seed={4} />
      <Vineta o={0.6} />
      <Titulo f={f} text={title} eyebrow={eyebrow} size={84} />
      {sub ? <div style={{ position: "absolute", left: 90, bottom: 60, fontFamily: OSW, fontWeight: 600, fontSize: 38, color: C.hivis, opacity: interpolate(f, [D * 0.55, D * 0.62], [0, 1], CL), textShadow: "0 3px 14px #000" }}>{sub}</div> : null}
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 3) BLOOD GRAB ════════════════════════════════════════════════════════════════════════════
const Globulo: React.FC<{ x: number; y: number; r: number; rot: number; blur?: number; o?: number }> = ({ x, y, r, rot, blur = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o} style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.82} fill="url(#rbc)" />
    <ellipse cx={r * 0.05} cy={r * 0.04} rx={r * 0.52} ry={r * 0.4} fill="rgba(90,0,8,0.55)" />
    <ellipse cx={-r * 0.35} cy={-r * 0.38} rx={r * 0.3} ry={r * 0.12} fill="rgba(255,170,170,0.25)" />
  </g>
);
export const BloodGrab: React.FC<{ durationInFrames: number; factor?: number; title?: string; eyebrow?: string }> =
  ({ durationInFrames, factor = 200, title = "IT GRABS YOUR BLOOD AND DOESN'T LET GO", eyebrow = "CARBON MONOXIDE vs OXYGEN" }) => {
  const f = useCurrentFrame();
  const D = Math.max(100, durationInFrames);
  const op = fadeIO(f, D);
  const cam = interpolate(f, [0, D], [0, 1], CL);
  // tres glóbulos principales, cada uno con 3 lugares de O2
  const main = [{ x: 560, y: 560, r: 170 }, { x: 1060, y: 470, r: 150 }, { x: 1480, y: 640, r: 160 }];
  const slots = main.flatMap((g, gi) => [0, 1, 2].map((s) => {
    const ang = (-100 + s * 100 + gi * 25) * Math.PI / 180;
    return { gi, x: g.x + Math.cos(ang) * g.r * 0.95, y: g.y + Math.sin(ang) * g.r * 0.8, k: gi * 3 + s };
  }));
  const tArr = (k: number) => D * 0.22 + k * Math.max(4, D * 0.045);
  const drift = (gi: number) => ({ dx: Math.sin((f + gi * 40) / 38) * 12 - cam * 40, dy: Math.cos((f + gi * 30) / 44) * 9 });
  const locked = slots.filter((s) => f > tArr(s.k) + 10).length;
  return (
    <AbsoluteFill style={{ opacity: op, background: "#2A0306", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, #6E0A12 0%, #2A0306 70%, #120102 100%)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="rbc" cx="40%" cy="35%"><stop offset="0" stopColor="#F2474F" /><stop offset="0.6" stopColor="#B3121D" /><stop offset="1" stopColor="#6B040C" /></radialGradient>
          <radialGradient id="o2" cx="35%" cy="35%"><stop offset="0" stopColor="#D8F0FF" /><stop offset="1" stopColor="#3B8FD6" /></radialGradient>
          <radialGradient id="cc" cx="35%" cy="35%"><stop offset="0" stopColor="#8A8F96" /><stop offset="1" stopColor="#23262A" /></radialGradient>
          <radialGradient id="oo" cx="35%" cy="35%"><stop offset="0" stopColor="#FF9A8A" /><stop offset="1" stopColor="#C0281B" /></radialGradient>
        </defs>
        {/* capa lejana: glóbulos chicos y borrosos */}
        {Array.from({ length: 14 }, (_, i) => <Globulo key={`b${i}`} x={((rnd(i, 1) * 2200 - f * (0.6 + rnd(i, 3))) % 2200 + 2200) % 2200 - 140} y={rnd(i, 2) * 1080} r={40 + rnd(i, 4) * 40} rot={rnd(i, 5) * 180 + f * 0.2} blur={5} o={0.45} />)}
        {/* capa media: los tres protagonistas */}
        {main.map((g, gi) => { const d = drift(gi); return <Globulo key={`m${gi}`} x={g.x + d.dx} y={g.y + d.dy} r={g.r} rot={gi * 25 + Math.sin(f / 50) * 4} />; })}
        {slots.map((s) => {
          const d = drift(s.gi);
          const t = tArr(s.k);
          const x = s.x + d.dx, y = s.y + d.dy;
          // O2: pegado hasta que llega el CO; después se suelta y se va flotando
          const leave = interpolate(f, [t + 6, t + 40], [0, 1], CL);
          const o2x = x + leave * (60 + rnd(s.k, 1) * 160), o2y = y - leave * (120 + rnd(s.k, 2) * 140);
          // CO: viene desde la izquierda en curva
          const come = interpolate(f, [t - 26, t + 6], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const cx = interpolate(come, [0, 1], [-120, x]), cy = interpolate(come, [0, 1], [y + 300 * (rnd(s.k, 3) - 0.5), y]);
          const lock = f > t + 8;
          const pulse = lock ? 1 + 0.12 * Math.sin((f - t) / 3) : 1;
          return (
            <g key={`s${s.k}`}>
              <g opacity={1 - leave * 0.9}>
                <circle cx={o2x - 11} cy={o2y} r={14} fill="url(#o2)" /><circle cx={o2x + 11} cy={o2y} r={14} fill="url(#o2)" />
              </g>
              {come > 0 ? (
                <g transform={`translate(${cx},${cy}) rotate(${(1 - come) * 140})`}>
                  {lock ? <circle cx={0} cy={0} r={34 * pulse} fill="none" stroke={C.hivis} strokeWidth={4} opacity={0.8} /> : null}
                  <circle cx={-12} cy={0} r={16} fill="url(#cc)" /><circle cx={12} cy={0} r={15} fill="url(#oo)" />
                </g>
              ) : null}
            </g>
          );
        })}
        {/* capa cercana: glóbulo enorme y desenfocado que cruza */}
        <Globulo x={interpolate(f, [0, D], [2200, -400])} y={880} r={330} rot={30} blur={16} o={0.8} />
      </svg>
      <div style={{ position: "absolute", right: 90, top: 80, textAlign: "right", fontFamily: MONO, fontSize: 30, color: C.white, lineHeight: 1.6, opacity: interpolate(f, [D * 0.2, D * 0.26], [0, 1], CL), textShadow: "0 2px 10px #000" }}>
        <div><span style={{ color: "#8EC9FF" }}>● ●</span> OXYGEN</div>
        <div><span style={{ color: "#9AA0A6" }}>●</span><span style={{ color: "#FF7A66" }}>●</span> CARBON MONOXIDE</div>
        <div style={{ color: C.hivis }}>LOCKED ON: {locked}/{slots.length}</div>
      </div>
      <div style={{ position: "absolute", left: 90, bottom: 70, opacity: interpolate(f, [D * 0.6, D * 0.68], [0, 1], CL), transform: `scale(${interpolate(f, [D * 0.6, D * 0.68], [0.8, 1], { ...CL, easing: easeOut })})`, transformOrigin: "left bottom" }}>
        <span style={{ fontFamily: BEBAS, fontSize: 150, color: C.hivis, textShadow: "0 8px 30px #000" }}>~{factor}×</span>
        <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 40, color: C.white, marginLeft: 24 }}>TIGHTER GRIP THAN OXYGEN</span>
      </div>
      <Vineta o={0.7} />
      <Titulo f={f} text={title} eyebrow={eyebrow} size={80} />
      <Grano o={0.06} />
    </AbsoluteFill>
  );
};

// ═══ 4) GEN vs CARS ═══════════════════════════════════════════════════════════════════════════
const Auto: React.FC<{ x: number; y: number; s: number; o: number; c: string }> = ({ x, y, s, o, c }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <path d="M 0 18 L 6 8 Q 10 2 18 2 L 34 2 Q 40 2 44 8 L 50 12 Q 56 13 56 18 L 56 24 L 0 24 Z" fill={c} />
    <rect x={14} y={6} width={10} height={6} fill="#0B1320" /><rect x={27} y={6} width={11} height={6} fill="#0B1320" />
    <circle cx={13} cy={24} r={5} fill="#111" /><circle cx={44} cy={24} r={5} fill="#111" />
  </g>
);
export const GenVsCars: React.FC<{ durationInFrames: number; label?: string; eyebrow?: string; cars?: number }> =
  ({ durationInFrames, label = "AS MUCH CARBON MONOXIDE AS HUNDREDS OF CARS", eyebrow = "ONE PORTABLE GENERATOR", cars = 240 }) => {
  const f = useCurrentFrame();
  const D = Math.max(90, durationInFrames);
  const op = fadeIO(f, D);
  const cols = 20, n = Math.min(400, Math.max(40, cars));
  const rows = Math.ceil(n / cols);
  const gx = 90, gy = 360;
  const t0 = D * 0.18, wave = D * 0.45;
  const shownCars = Array.from({ length: n }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const d = (c + r * 0.6) / (cols + rows * 0.6);
    const a = interpolate(f, [t0 + d * wave, t0 + d * wave + 6], [0, 1], { ...CL, easing: easeOut });
    return { i, x: 720 + c * 58, y: 300 + r * (560 / rows), a };
  });
  const cnt = shownCars.filter((c) => c.a > 0.5).length;
  const puff = (k: number) => { const p = ((f + k * 7) % 36) / 36; return { x: gx + 390 + p * 120, y: gy + 170 - p * 150 + Math.sin(k + p * 5) * 14, r: 16 + p * 70, o: (1 - p) * 0.5 }; };
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0C1118", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 60%, #1E2C3B 0%, #0C1118 70%)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="gp"><stop offset="0" stopColor="#8E8579" stopOpacity="0.6" /><stop offset="1" stopColor="#8E8579" stopOpacity="0" /></radialGradient></defs>
        {Array.from({ length: 8 }, (_, k) => { const p = puff(k); return <circle key={k} cx={p.x} cy={p.y} r={p.r} fill="url(#gp)" opacity={p.o * 1.6} />; })}
        <g transform={`translate(${gx}, ${gy + Math.sin(f * 2.3) * 1.5}) scale(2.3)`}>
          <rect x={0} y={20} width={160} height={100} rx={10} fill={C.hivis} stroke="#6A5500" strokeWidth={3} />
          <rect x={14} y={34} width={84} height={46} rx={5} fill="#262626" />
          <rect x={106} y={36} width={40} height={24} fill="#4F4F4F" />
          <rect x={160} y={70} width={22} height={13} fill="#777" />
          <path d="M 10 20 L 10 6 L 150 6 L 150 20" stroke="#2A2A2A" strokeWidth={6} fill="none" />
          <circle cx={30} cy={124} r={10} fill="#111" /><circle cx={130} cy={124} r={10} fill="#111" />
        </g>
        <text x={620} y={600} textAnchor="middle" fontFamily={BEBAS} fontSize={170} fill={C.white} opacity={interpolate(f, [t0 - 10, t0], [0, 1], CL)}>=</text>
        {shownCars.map((c) => <Auto key={c.i} x={c.x} y={c.y} s={0.9} o={c.a} c={rnd(c.i, 9) > 0.5 ? "#7C8A97" : "#5B6874"} />)}
      </svg>
      <div style={{ position: "absolute", right: 90, top: 190, fontFamily: MONO, fontSize: 34, color: C.hivis, opacity: interpolate(f, [t0, t0 + 8], [0, 1], CL) }}>{cnt} RUNNING ENGINES</div>
      <Titulo f={f} eyebrow={eyebrow} text={undefined} />
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 70, fontFamily: BEBAS, fontSize: 86, color: C.white, lineHeight: 0.95, opacity: interpolate(f, [D * 0.62, D * 0.7], [0, 1], CL), textShadow: "0 6px 26px #000" }}>{label}</div>
      <Vineta o={0.55} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 5) YARD PLAN ═════════════════════════════════════════════════════════════════════════════
export const YardPlan: React.FC<{ durationInFrames: number; feet?: number; title?: string; windFrom?: "left" | "right" | "top" }> =
  ({ durationInFrames, feet = 20, title = "WALK IT OFF ON A SUNNY DAY", windFrom = "left" }) => {
  const f = useCurrentFrame();
  const D = Math.max(110, durationInFrames);
  const op = fadeIO(f, D);
  const hx = 260, hy = 250, hw = 520, hh = 520;      // casa (vista de arriba)
  const dx0 = hx + hw, dy0 = hy + 360;               // puerta de atrás
  const L = 760;                                      // largo en px de los 20 ft
  const tape = interpolate(f, [D * 0.1, D * 0.45], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const stake = interpolate(f, [D * 0.47, D * 0.53], [0, 1], { ...CL, easing: Easing.out(Easing.back(2)) });
  const gen = interpolate(f, [D * 0.55, D * 0.66], [0, 1], { ...CL, easing: easeOut });
  const smoke = interpolate(f, [D * 0.62, D * 0.7], [0, 1], CL);
  const sx = dx0 + L * tape;
  const W = windFrom === "right" ? -1 : 1;
  const tilt = interpolate(f, [0, D], [24, 16], CL);
  const pen = "#E8F1FA";
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0B1622", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1A2E44 0%, #081019 80%)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `rotateX(${tilt}deg) scale(${interpolate(f, [0, D], [0.92, 1.0], CL)}) translateY(30px)`, transformOrigin: "50% 60%" }}>
          <div style={{ position: "absolute", left: 80, top: 90, width: 1760, height: 900, background: "#123A63", boxShadow: "0 60px 90px rgba(0,0,0,0.7)", borderRadius: 6 }} />
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
            <defs><pattern id="bp" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(200,225,255,0.12)" strokeWidth="1" /></pattern>
              <radialGradient id="ys"><stop offset="0" stopColor="#C9D3DC" stopOpacity="0.55" /><stop offset="1" stopColor="#C9D3DC" stopOpacity="0" /></radialGradient></defs>
            <rect x={80} y={90} width={1760} height={900} fill="url(#bp)" />
            {/* casa */}
            <rect x={hx} y={hy} width={hw} height={hh} fill="rgba(232,241,250,0.07)" stroke={pen} strokeWidth={5} />
            <line x1={hx + 300} y1={hy} x2={hx + 300} y2={hy + hh} stroke={pen} strokeWidth={2} strokeDasharray="8 8" />
            <text x={hx + 150} y={hy + 60} textAnchor="middle" fontFamily={OSW} fontWeight={600} fontSize={26} fill={pen} letterSpacing={4}>HOUSE</text>
            {/* ventanas y ventilaciones */}
            {[[hx + 120, hy], [hx + 380, hy], [hx + 200, hy + hh]].map(([x, y], i) => <rect key={i} x={x - 35} y={y - 6} width={70} height={12} fill={C.cold} />)}
            <rect x={hx + hw - 6} y={hy + 120} width={12} height={60} fill={C.cold} />
            <circle cx={hx + hw} cy={hy + 250} r={10} fill={C.orange} /><text x={hx + hw + 20} y={hy + 257} fontFamily={MONO} fontSize={22} fill={C.orange}>VENT</text>
            {/* puerta de atrás */}
            <path d={`M ${dx0} ${dy0 - 40} A 40 40 0 0 1 ${dx0 + 40} ${dy0}`} stroke={pen} strokeWidth={3} fill="none" />
            <text x={dx0 - 16} y={dy0 + 34} textAnchor="end" fontFamily={MONO} fontSize={22} fill={pen}>BACK DOOR</text>
            {/* cinta métrica */}
            <rect x={dx0} y={dy0 - 12} width={L * tape} height={24} fill={C.hivis} stroke="#8A6D00" strokeWidth={2} />
            {Array.from({ length: feet + 1 }, (_, i) => {
              const x = dx0 + (L * i) / feet;
              if (x > sx) return null;
              return <g key={i}><line x1={x} y1={dy0 - 12} x2={x} y2={dy0 + (i % 5 === 0 ? 10 : 0)} stroke="#1B1B1B" strokeWidth={2} />{i % 5 === 0 && i > 0 ? <text x={x} y={dy0 - 22} textAnchor="middle" fontFamily={BEBAS} fontSize={34} fill={C.hivis}>{i} FT</text> : null}</g>;
            })}
            <rect x={sx - 34} y={dy0 - 30} width={52} height={60} rx={10} fill="#D8D8D8" stroke="#333" strokeWidth={3} opacity={tape < 1 ? 1 : 0} />
            {/* estaca */}
            <g transform={`translate(${dx0 + L}, ${dy0}) scale(${stake})`}>
              <circle cx={0} cy={0} r={46} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="10 8" />
              <circle cx={0} cy={0} r={12} fill={C.orange} stroke="#fff" strokeWidth={3} />
              <text x={0} y={-60} textAnchor="middle" fontFamily={STENCIL} fontSize={34} fill={C.green}>STAKE</text>
            </g>
            {/* generador en la estaca + cable a la casa */}
            <g opacity={gen}>
              <path d={`M ${dx0 + L - 40} ${dy0 + 60} C ${dx0 + L * 0.6} ${dy0 + 170}, ${dx0 + 200} ${dy0 + 150}, ${dx0 + 6} ${dy0 + 80}`} stroke={C.orange} strokeWidth={6} fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - gen)} />
              <rect x={dx0 + L - 60} y={dy0 + 40} width={110} height={70} rx={8} fill={C.hivis} stroke="#6A5500" strokeWidth={4} />
              <text x={dx0 + L - 5} y={dy0 + 140} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={pen}>HEAVY CORD</text>
            </g>
            {/* viento + escape que se va lejos de la casa */}
            {Array.from({ length: 6 }, (_, i) => { const p = ((f + i * 10) % 60) / 60; const x0 = W > 0 ? 120 : 1800; return <path key={i} d={`M ${x0 + W * p * 1500} ${150 + i * 130} l ${W * 90} 0`} stroke={C.ice} strokeWidth={4} opacity={0.45 * Math.sin(p * Math.PI)} strokeLinecap="round" />; })}
            {Array.from({ length: 7 }, (_, k) => { const p = ((f + k * 8) % 50) / 50; return <circle key={k} cx={dx0 + L + 60 + W * p * 420} cy={dy0 + 70 - p * 90} r={20 + p * 80} fill="url(#ys)" opacity={smoke * (1 - p)} />; })}
            <g opacity={smoke}><text x={dx0 + L - 330} y={dy0 - 150} fontFamily={OSW} fontWeight={700} fontSize={28} fill={C.ice} letterSpacing={3}>EXHAUST AWAY FROM THE HOUSE</text></g>
            {/* rosa de los vientos */}
            <g transform="translate(1720, 190)"><circle r={50} fill="none" stroke={pen} strokeWidth={2} /><path d="M 0 -58 L 10 0 L 0 58 L -10 0 Z" fill={pen} /><text y={-66} textAnchor="middle" fontFamily={OSW} fontSize={24} fill={pen}>N</text></g>
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 90, bottom: 60, fontFamily: BEBAS, fontSize: 160, color: stake > 0.5 ? C.green : C.hivis, opacity: interpolate(f, [D * 0.4, D * 0.48], [0, 1], CL), textShadow: "0 8px 30px #000" }}>{Math.round(feet * tape)} FT</div>
      <Vineta o={0.55} />
      <Titulo f={f} text={title} size={86} />
      <Grano o={0.05} />
    </AbsoluteFill>
  );
};

// ═══ 6) HIDDEN KILLERS ════════════════════════════════════════════════════════════════════════
const Icono: React.FC<{ icon: string; s: string }> = ({ icon, s }) => {
  const st = { stroke: s, strokeWidth: 7, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "grill") return <g {...st}><path d="M 40 60 Q 100 150 160 60 Z" /><path d="M 40 60 Q 100 0 160 60" /><line x1="70" y1="110" x2="50" y2="150" /><line x1="130" y1="110" x2="150" y2="150" /><line x1="100" y1="118" x2="100" y2="150" /><line x1="100" y1="22" x2="100" y2="10" /></g>;
  if (icon === "oven") return <g {...st}><rect x="35" y="20" width="130" height="125" rx="8" /><rect x="55" y="62" width="90" height="60" rx="4" /><line x1="60" y1="45" x2="140" y2="45" />{[60, 85, 110, 135].map((x) => <circle key={x} cx={x} cy="33" r="5" />)}</g>;
  if (icon === "car") return <g {...st}><path d="M 20 110 L 35 75 Q 45 58 65 58 L 130 58 Q 148 58 158 75 L 175 92 Q 185 96 185 110 L 185 122 L 20 122 Z" /><circle cx="60" cy="124" r="15" /><circle cx="150" cy="124" r="15" /><path d="M 5 118 q -10 -10 0 -20" /></g>;
  if (icon === "vent") return <g {...st}><line x1="40" y1="20" x2="40" y2="150" /><path d="M 40 80 L 120 80 L 120 100 L 40 100" /><path d="M 70 150 Q 110 90 170 150 Z" /><path d="M 130 90 q 20 -10 40 0" /></g>;
  return <g {...st}><rect x="30" y="50" width="140" height="80" rx="8" /><rect x="45" y="65" width="70" height="35" rx="3" /><path d="M 40 50 L 40 35 L 160 35 L 160 50" /><circle cx="55" cy="140" r="10" /><circle cx="145" cy="140" r="10" /></g>;
};
export const HiddenKillers: React.FC<{ durationInFrames: number; items?: { label: string; icon?: string }[]; active?: number; title?: string; eyebrow?: string }> =
  ({ durationInFrames, items, active = -1, title = "SAME KILLER, DIFFERENT COAT", eyebrow = "WHERE CARBON MONOXIDE HIDES" }) => {
  const f = useCurrentFrame();
  const D = Math.max(80, durationInFrames);
  const op = fadeIO(f, D);
  const list = (items && items.length ? items : [{ label: "Charcoal grill inside", icon: "grill" }, { label: "Gas oven for heat", icon: "oven" }, { label: "Car in the garage", icon: "car" }, { label: "Snow-blocked vent", icon: "vent" }]).slice(0, 4);
  const n = list.length;
  const act = active >= 0 && active < n ? active : Math.min(n - 1, Math.floor(interpolate(f, [D * 0.3, D * 0.95], [0, n], CL)));
  const showAct = active >= 0 || f > D * 0.3;
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0A0F15", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1C2733 0%, #070A0E 75%)" }} />
      {/* humo al fondo */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, filter: "blur(20px)", opacity: 0.5 }}>
        {Array.from({ length: 9 }, (_, i) => { const p = ((f * 0.6 + i * 40) % 300) / 300; return <circle key={i} cx={200 + i * 190 + Math.sin(f / 40 + i) * 40} cy={1100 - p * 900} r={90 + p * 140} fill="#5B4C44" opacity={Math.sin(p * Math.PI) * 0.6} />; })}
      </svg>
      <AbsoluteFill style={{ perspective: 1400 }}>
        {list.map((it, i) => {
          const tin = 6 + i * 6;
          const a = interpolate(f, [tin, tin + 16], [0, 1], { ...CL, easing: easeOut });
          const isA = showAct && i === act;
          const w = 330, gap = 46, x0 = (1920 - (n * w + (n - 1) * gap)) / 2 + i * (w + gap);
          const zz = isA ? 120 : showAct ? -160 : 0;
          const ry = (i - (n - 1) / 2) * -9;
          return (
            <div key={i} style={{ position: "absolute", left: x0, top: 330, width: w, height: 470, borderRadius: 18, background: isA ? "linear-gradient(180deg, #3A1712 0%, #150907 100%)" : "linear-gradient(180deg, #25303B 0%, #121920 100%)", border: `3px solid ${isA ? C.red : "#3A4855"}`, boxShadow: isA ? `0 0 60px rgba(224,48,30,0.55), 0 40px 60px rgba(0,0,0,0.7)` : "0 30px 50px rgba(0,0,0,0.6)", opacity: a * (showAct && !isA ? 0.55 : 1), filter: showAct && !isA ? "blur(2px)" : undefined, transform: `translateY(${(1 - a) * 140}px) translateZ(${zz}px) rotateY(${ry}deg)`, transition: "none" }}>
              <div style={{ position: "absolute", top: 18, left: 22, fontFamily: BEBAS, fontSize: 60, color: isA ? C.red : "#5F7282" }}>{i + 1}</div>
              <svg width={w} height={260} viewBox="0 0 200 160" style={{ position: "absolute", top: 70 }}><Icono icon={it.icon || "gen"} s={isA ? C.hivis : "#C9D3DC"} /></svg>
              <div style={{ position: "absolute", left: 20, right: 20, bottom: 30, fontFamily: OSW, fontWeight: 700, fontSize: 36, lineHeight: 1.1, color: C.white, textAlign: "center", textTransform: "uppercase" }}>{it.label}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Vineta o={0.6} />
      <Titulo f={f} text={title} eyebrow={eyebrow} size={84} align="center" top={70} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 7) ALARM MAP ═════════════════════════════════════════════════════════════════════════════
export const AlarmMap: React.FC<{ durationInFrames: number; title?: string; eyebrow?: string; items?: { text: string }[] }> =
  ({ durationInFrames, title = "EVERY LEVEL. OUTSIDE EVERY BEDROOM.", eyebrow = "CO ALARMS WITH A BATTERY", items }) => {
  const f = useCurrentFrame();
  const D = Math.max(100, durationInFrames);
  const op = fadeIO(f, D);
  const pts = [
    { x: 1000, y: G.yPA + 70, lab: "HALLWAY" }, { x: 840, y: G.yPA + 70, lab: "" }, { x: 1300, y: G.yPA + 70, lab: "" },
    { x: 1050, y: G.yPB + 70, lab: "MAIN FLOOR" }, { x: 900, y: G.y0 + 40, lab: "BASEMENT" },
  ];
  const lst = (items && items.length ? items : [{ text: "Every level" }, { text: "Outside every bedroom" }, { text: "Battery backup" }, { text: "Test it before the storm" }]).slice(0, 5);
  const z = interpolate(f, [0, D], [1.02, 1.08], CL);
  return (
    <AbsoluteFill style={{ opacity: op, background: C.night, overflow: "hidden" }}>
      <NocheLejos push={interpolate(f, [0, D], [0, 1], CL)} />
      <Nieve n={50} o={0.45} seed={6} />
      <AbsoluteFill style={{ transform: `scale(${z * 0.86}) translate(-430px, 60px)`, transformOrigin: "50% 55%" }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <Casa door={0} noGarage lights={0.8} />
          {pts.map((p, i) => {
            const t = D * 0.12 + i * Math.max(6, D * 0.08);
            const drop = interpolate(f, [t, t + 10], [0, 1], { ...CL, easing: Easing.out(Easing.back(2)) });
            if (drop <= 0) return null;
            const ring = ((f - t) % 30) / 30;
            return (
              <g key={i} transform={`translate(${p.x}, ${p.y - (1 - drop) * 160})`} opacity={drop}>
                <circle r={26 + ring * 70} fill="none" stroke={C.red} strokeWidth={4} opacity={(1 - ring) * 0.8} />
                <circle r={26} fill="#F1F3F4" stroke="#9AA4AD" strokeWidth={3} />
                <circle cx={9} cy={-8} r={5} fill={(f - t) % 20 < 10 ? C.red : "#5A1A14"} />
                {p.lab ? <text y={62} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={22} fill={C.hivis} letterSpacing={2}>{p.lab}</text> : null}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 60, top: 300, width: 600 }}>
        {lst.map((it, i) => {
          const t = D * 0.3 + i * Math.max(6, D * 0.1);
          const a = interpolate(f, [t, t + 10], [0, 1], { ...CL, easing: easeOut });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26, opacity: a, transform: `translateX(${(1 - a) * 60}px)` }}>
              <div style={{ width: 46, height: 46, borderRadius: 8, background: C.green, color: "#08210F", fontFamily: OSW, fontWeight: 700, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
              <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 40, color: C.white, textTransform: "uppercase", textShadow: "0 2px 12px #000" }}>{it.text}</div>
            </div>
          );
        })}
      </div>
      <Vineta o={0.55} />
      <Titulo f={f} text={title} eyebrow={eyebrow} size={84} />
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 8) SAME HEADACHE ═════════════════════════════════════════════════════════════════════════
const Silueta: React.FC<{ x: number; h: number; kind: string }> = ({ x, h, kind }) => {
  const y = 900;
  if (kind === "dog") return <g fill="#1A232C" stroke="#7A5A3E" strokeWidth={4}><ellipse cx={x} cy={y - 55} rx={85} ry={42} /><circle cx={x + 80} cy={y - 95} r={34} /><rect x={x - 70} y={y - 30} width={16} height={30} /><rect x={x + 50} y={y - 30} width={16} height={30} /><path d={`M ${x - 85} ${y - 70} q -40 -20 -30 -60`} stroke="#1A232C" strokeWidth={12} fill="none" /></g>;
  const s = h / 520;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`} fill="#1A232C" stroke="#7A5A3E" strokeWidth={6}>
      <circle cx={0} cy={-450} r={62} />
      <path d="M -95 -370 Q 0 -400 95 -370 L 120 -120 L 70 -120 L 60 0 L -60 0 L -70 -120 L -120 -120 Z" />
    </g>
  );
};
export const SameHeadache: React.FC<{ durationInFrames: number; title?: string; sub?: string; eyebrow?: string }> =
  ({ durationInFrames, title = "SAME HEADACHE. SAME TIME.", sub = "That's not the flu. That's the air.", eyebrow }) => {
  const f = useCurrentFrame();
  const D = Math.max(80, durationInFrames);
  const op = fadeIO(f, D);
  const fam = [{ x: 470, h: 520, k: "man" }, { x: 760, h: 480, k: "woman" }, { x: 1020, h: 340, k: "kid" }, { x: 1250, h: 300, k: "kid" }, { x: 1520, h: 0, k: "dog" }];
  const throb = 0.5 + 0.5 * Math.sin(f / 4.2);
  const link = interpolate(f, [D * 0.3, D * 0.5], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const heads = fam.map((p) => ({ x: p.k === "dog" ? p.x + 80 : p.x, y: p.k === "dog" ? 805 : 900 - (p.h / 520) * 450 }));
  const z = interpolate(f, [0, D], [1.0, 1.06], CL);
  return (
    <AbsoluteFill style={{ opacity: op, background: "#0B0F14", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #3A2A1E 0%, #0B0F14 70%)" }} />
      {/* lámpara de fondo desenfocada */}
      <div style={{ position: "absolute", left: 1650, top: 260, width: 160, height: 160, borderRadius: 160, background: "#FFB860", filter: "blur(40px)", opacity: 0.5 }} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 70%" }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="ache"><stop offset="0" stopColor="#FF3B2A" stopOpacity="0.95" /><stop offset="1" stopColor="#FF3B2A" stopOpacity="0" /></radialGradient></defs>
          <rect x={0} y={900} width={1920} height={180} fill="#0E1318" />
          {fam.map((p, i) => <Silueta key={i} x={p.x} h={p.h} kind={p.k} />)}
          {heads.map((h, i) => {
            const a = interpolate(f, [D * 0.08 + i * 3, D * 0.14 + i * 3], [0, 1], CL);
            return <circle key={i} cx={h.x} cy={h.y} r={60 + throb * 40} fill="url(#ache)" opacity={a * (0.55 + throb * 0.45)} />;
          })}
          <path d={`M ${heads.map((h) => `${h.x} ${h.y}`).join(" L ")}`} fill="none" stroke={C.hivis} strokeWidth={5} strokeDasharray="1000" strokeDashoffset={1000 * (1 - link)} pathLength={1000} />
        </svg>
      </AbsoluteFill>
      {/* sofá desenfocado adelante */}
      <div style={{ position: "absolute", left: -120, bottom: -140, width: 760, height: 300, borderRadius: 60, background: "#2B221C", filter: "blur(18px)", opacity: 0.9 }} />
      <Vineta o={0.7} />
      <Titulo f={f} text={title} eyebrow={eyebrow} size={120} align="center" top={80} at={D * 0.35} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: OSW, fontWeight: 600, fontSize: 44, color: C.hivis, opacity: interpolate(f, [D * 0.55, D * 0.62], [0, 1], CL), textShadow: "0 3px 14px #000" }}>{sub}</div>
      <Grano />
    </AbsoluteFill>
  );
};

// ═══ 9) TWO AM DECISION ═══════════════════════════════════════════════════════════════════════
export const TwoAMDecision: React.FC<{ durationInFrames: number; leftLabel?: string; rightLabel?: string; title?: string }> =
  ({ durationInFrames, leftLabel = "2 AM DECISION", rightLabel = "SUNNY AFTERNOON DECISION", title }) => {
  const f = useCurrentFrame();
  const D = Math.max(90, durationInFrames);
  const op = fadeIO(f, D);
  const split = interpolate(f, [4, 22], [0, 1], { ...CL, easing: easeOut });
  const right = interpolate(f, [D * 0.4, D * 0.5], [0, 1], { ...CL, easing: easeOut });
  const beam = Math.sin(f / 11) * 25;
  const half = 960 * split;
  return (
    <AbsoluteFill style={{ opacity: op, background: "#000", overflow: "hidden" }}>
      {/* izquierda: noche */}
      <div style={{ position: "absolute", left: 0, top: 0, width: half, height: 1080, overflow: "hidden" }}>
        <AbsoluteFill style={{ width: 960, background: "linear-gradient(180deg, #05080E 0%, #0F1A28 100%)" }} />
        <svg width="960" height="1080" style={{ position: "absolute", inset: 0 }}>
          <path d={`M 480 1080 L ${380 + beam * 6} 520 L ${620 + beam * 6} 520 Z`} fill="rgba(255,236,170,0.16)" />
          <rect x={250} y={610} width={460} height={320} fill="#131B24" stroke="#26313C" strokeWidth={6} />
          <rect x={250} y={610} width={460} height={160} fill="#3A444E" />
          <g transform="translate(410, 830)"><rect width={130} height={80} rx={8} fill={C.hivis} /><rect x={12} y={12} width={70} height={34} fill="#2A2A2A" /></g>
          <line x1={380} y1={800} x2={580} y2={940} stroke={C.red} strokeWidth={18} strokeLinecap="round" opacity={interpolate(f, [D * 0.25, D * 0.3], [0, 1], CL)} />
          <line x1={580} y1={800} x2={380} y2={940} stroke={C.red} strokeWidth={18} strokeLinecap="round" opacity={interpolate(f, [D * 0.25, D * 0.3], [0, 1], CL)} />
        </svg>
        <div style={{ position: "absolute", left: 0, width: 960, top: 190, textAlign: "center", fontFamily: MONO, fontSize: 130, color: "#FF4A3A", textShadow: "0 0 30px rgba(255,60,40,0.7)" }}>2:00<span style={{ fontSize: 60 }}>AM</span></div>
        <div style={{ position: "absolute", left: 0, width: 960, top: 380, textAlign: "center", fontFamily: BEBAS, fontSize: 76, color: C.white }}>{leftLabel}</div>
        <Nieve n={40} o={0.7} seed={8} />
      </div>
      {/* derecha: tarde de sol */}
      <div style={{ position: "absolute", left: 1920 - half, top: 0, width: half, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, #8CC6F2 0%, #D8EEFB 60%, #9CC27A 60.5%, #6E9A4E 100%)" }} />
        <div style={{ position: "absolute", right: 120, top: 90, width: 170, height: 170, borderRadius: 170, background: "#FFE17A", boxShadow: "0 0 120px 50px rgba(255,220,120,0.6)", transform: `rotate(${f}deg)` }} />
        <svg width="960" height="1080" style={{ position: "absolute", right: 0, top: 0 }}>
          <rect x={120} y={700} width={560 * right} height={22} fill={C.hivis} stroke="#8A6D00" strokeWidth={2} />
          <g transform={`translate(${120 + 560}, 690) scale(${right})`}><rect x={-7} y={-80} width={14} height={110} fill="#8A5A2B" /><rect x={-7} y={-80} width={14} height={20} fill={C.orange} /></g>
          <text x={400} y={680} textAnchor="middle" fontFamily={BEBAS} fontSize={60} fill="#1D3A12" opacity={right}>20 FT</text>
          <path d="M 640 860 l 40 40 l 90 -110" stroke="#1E7A34" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(f, [D * 0.55, D * 0.6], [0, 1], CL)} />
        </svg>
        <div style={{ position: "absolute", right: 0, width: 960, top: 380, textAlign: "center", fontFamily: BEBAS, fontSize: 76, color: "#11283A" }}>{rightLabel}</div>
      </div>
      <div style={{ position: "absolute", left: 956, top: 0, width: 8, height: 1080 * split, background: C.hivis, boxShadow: "0 0 24px rgba(245,196,0,0.8)" }} />
      {title ? <Titulo f={f} text={title} align="center" top={40} size={70} /> : null}
      <Grano o={0.05} />
    </AbsoluteFill>
  );
};

export const SFX_AT_GEN = {
  COHouseCutaway: { hum: 0.0 }, StackEffect: { wind: 0.0 }, BloodGrab: { pop: "arrivals" }, GenVsCars: { hum: 0.0 },
  YardPlan: { paper: 0.2, stamp: "stake" }, HiddenKillers: { whoosh: 0.2 }, AlarmMap: { beep: "drops" }, SameHeadache: { boom: "title" }, TwoAMDecision: { whoosh: 0.1 },
} as const;
