// Kit visual del canal "La Psicóloga Amparo" (sesión amparo-a, 1-nov-2026). Lo reusan todos los pa0X: ver D:/rtmp/amparo/MUNDO.md.
// Hoja blanca #FAFAF7, pictogramas negros tipo cartel, titular negro con resaltado amarillo #FFD600, rojo SÓLO para el dato que duele.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadTit } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadTxt } from "@remotion/google-fonts/Archivo";

export const TIT = loadTit("normal", { subsets: ["latin", "latin-ext"] }).fontFamily;
export const TXT = loadTxt("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const C = { hoja: "#FAFAF7", tinta: "#151515", amarillo: "#FFD600", rojo: "#E0261B", gris: "#B9B8B1", grisClaro: "#E6E5DF", sombra: "rgba(20,18,10,0.22)" };
export const FPS = 30;

// ── matemática de movimiento (todo con resorte o curva; nunca lineal) ──
export const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const eo = (u: number) => 1 - Math.pow(1 - cl(u), 3);
export const eio = (u: number) => { const x = cl(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// resorte con peso (sobrepasa un poco y se asienta): u en [0,1+]
export const sp = (u: number, k = 1) => { const x = Math.max(0, u); if (x >= 1.6) return 1; return 1 - Math.exp(-6.2 * x) * Math.cos(9.5 * x * k); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// hash entero (mulberry) para sortear sin correlación
export const rnd = (seed: number) => { let t = (seed + 0x6d2b79f5) | 0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ── HOJA: el fondo de todo el canal ──
export const Hoja: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.hoja }}>
    {/* fibra del papel: dos degradés muy suaves, sin grano ni viñeta */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.7), rgba(255,255,255,0) 60%), radial-gradient(ellipse at 80% 90%, rgba(232,228,214,0.35), rgba(232,228,214,0) 55%)" }} />
    {children}
  </AbsoluteFill>
);

// ── PICTOGRAMA articulado (vista de cartel). Ángulos en grados: 0 = hacia abajo, +90 = hacia la derecha, 180 = arriba ──
export type Pose = { aL: number; eL: number; aR: number; eR: number; lL: number; kL: number; lR: number; kR: number; hip: number; lean: number; hx: number; hy: number; bob: number };
export const P0: Pose = { aL: -9, eL: 0, aR: 9, eR: 0, lL: -5, kL: 0, lR: 5, kR: 0, hip: 120, lean: 0, hx: 0, hy: 0, bob: 0 };
const dir = (deg: number) => { const r = (deg * Math.PI) / 180; return [Math.sin(r), Math.cos(r)]; };
export const mixPose = (a: Pose, b: Pose, k: number): Pose => { const o: any = {}; for (const key of Object.keys(a)) o[key] = lerp((a as any)[key], (b as any)[key], k); return o; };

// poses: algunas dependen del cuadro (respiran o caminan)
export const POSES: Record<string, (f: number) => Pose> = {
  parado: (f) => ({ ...P0, bob: Math.sin(f / 22) * 1.5 }),
  camina: (f) => { const s = Math.sin(f / 4.4); return { ...P0, aL: -24 * s, aR: -24 * s * -1, eL: -8, eR: 8, lL: 26 * s, lR: -26 * s, kL: s < 0 ? 18 * s : 0, kR: s > 0 ? -18 * s : 0, bob: Math.abs(Math.cos(f / 4.4)) * -5 }; },
  cabizbajo: (f) => ({ ...P0, aL: -4, aR: 4, hx: 6, hy: 16, lean: 5, bob: Math.sin(f / 26) * 1.2 }),
  encogido: (f) => ({ ...P0, aL: 12, eL: 70, aR: -12, eR: -70, hy: 12, hip: 112, lL: -3, lR: 3, bob: Math.sin(f / 20) * 1 }),
  manos_cara: (f) => ({ ...P0, aL: -168, eL: 132, aR: 168, eR: -132, hy: 14, hx: 0, lean: 3, bob: Math.sin(f / 9) * 1.6 }),
  saluda: (f) => ({ ...P0, aR: 150 + Math.sin(f / 3.4) * 14, eR: -22, aL: -8 }),
  senala: (f) => ({ ...P0, aR: 92 + Math.sin(f / 18) * 2, eR: 0, hx: 4 }),
  senala_izq: (f) => ({ ...P0, aL: -92 + Math.sin(f / 18) * 2, eL: 0, hx: -4 }),
  brazos_arriba: (f) => ({ ...P0, aL: -150 + Math.sin(f / 5) * 6, aR: 150 - Math.sin(f / 5) * 6, eL: -14, eR: 14, bob: Math.sin(f / 5) * -3 }),
  hombros: (f) => ({ ...P0, aL: -48, eL: -82, aR: 48, eR: 82, hy: -3 + Math.sin(f / 14) * 1.5 }),
  cruzado: (f) => ({ ...P0, aL: 22, eL: 108, aR: -22, eR: -108, bob: Math.sin(f / 24) * 1 }),
  celular: (f) => ({ ...P0, aR: 30, eR: 128, aL: -6, hx: 7, hy: 14, lean: 3, bob: Math.sin(f / 30) * 0.8 }),
  escribe: (f) => ({ ...P0, aR: 34, eR: 62 + Math.sin(f / 2.6) * 6, aL: -20, eL: 40, hx: 8, hy: 14, lean: 7 }),
  sentado: (f) => ({ ...P0, lL: 90, kL: -90, lR: 86, kR: -86, hip: 64, aL: 10, eL: 30, aR: 18, eR: 36, bob: Math.sin(f / 24) * 1 }),
  sentado_triste: (f) => ({ ...P0, lL: 90, kL: -90, lR: 86, kR: -86, hip: 64, aL: 24, eL: 60, aR: 30, eR: 64, hx: 9, hy: 18, lean: 12, bob: Math.sin(f / 30) * 0.8 }),
  sentado_cel: (f) => ({ ...P0, lL: 90, kL: -90, lR: 86, kR: -86, hip: 64, aR: 32, eR: 120, aL: 14, eL: 40, hx: 8, hy: 15, lean: 8 }),
  da_algo: (f) => ({ ...P0, aR: 72, eR: -6, hx: 3 }),
  abraza: (f) => ({ ...P0, aL: 70, eL: 40, aR: 64, eR: 44, lean: 6 }),
  corre: (f) => { const s = Math.sin(f / 3); return { ...P0, aL: -40 * s, aR: 40 * s, eL: 60, eR: -60, lL: 40 * s, lR: -40 * s, kL: -30, kR: -30, lean: 12, bob: Math.abs(Math.cos(f / 3)) * -9 }; },
  acostado: () => ({ ...P0 }),
};

export type PictoProps = { x: number; y: number; s?: number; pose?: string; pose2?: string; k2?: number; f: number; color?: string; flip?: boolean; op?: number; rot?: number; headColor?: string; vest?: boolean };
// x,y = punto entre los pies (o la cadera si está sentado); s = escala (1 ≈ 300 px de alto)
export const Picto: React.FC<PictoProps> = ({ x, y, s = 1, pose = "parado", pose2, k2 = 0, f, color = C.tinta, flip, op = 1, rot = 0, headColor, vest }) => {
  let P = (POSES[pose] || POSES.parado)(f);
  if (pose2 && k2 > 0) P = mixPose(P, (POSES[pose2] || POSES.parado)(f), cl(k2));
  const hipY = -P.hip + P.bob;
  const leg = (sx: number, a: number, k: number) => {
    const h = [sx * 15, hipY];
    const [d1x, d1y] = dir(a), [d2x, d2y] = dir(a + k);
    const kn = [h[0] + d1x * 62, h[1] + d1y * 62];
    const ft = [kn[0] + d2x * 60, kn[1] + d2y * 60];
    return `M${h[0]},${h[1]} L${kn[0]},${kn[1]} L${ft[0]},${ft[1]}`;
  };
  const sh = hipY - 98;
  const arm = (sx: number, a: number, e: number) => {
    const o = [sx * 33, sh + 10];
    const [d1x, d1y] = dir(a), [d2x, d2y] = dir(a + e);
    const el = [o[0] + d1x * 56, o[1] + d1y * 56];
    const hd = [el[0] + d2x * 52, el[1] + d2y * 52];
    return `M${o[0]},${o[1]} L${el[0]},${el[1]} L${hd[0]},${hd[1]}`;
  };
  const torso = `M${-38},${sh + 4} Q${-40},${sh - 6} ${-28},${sh - 7} L${28},${sh - 7} Q${40},${sh - 6} ${38},${sh + 4} L${27},${hipY - 2} Q${26},${hipY + 6} ${18},${hipY + 6} L${-18},${hipY + 6} Q${-26},${hipY + 6} ${-27},${hipY - 2} Z`;
  return (
    <g transform={`translate(${x},${y - (pose === "acostado" ? 16 * s : 0)}) scale(${(flip ? -1 : 1) * s},${s}) rotate(${rot + (pose === "acostado" ? -90 : 0)})`} opacity={op}>
      {P.hip > 100 ? <ellipse cx={0} cy={6} rx={58} ry={9} fill="rgba(20,18,10,0.10)" /> : null}
      <g transform={`rotate(${P.lean} 0 ${hipY})`}>
        <path d={leg(-1, P.lL, P.kL)} stroke={color} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={leg(1, P.lR, P.kR)} stroke={color} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={torso} fill={color} />
        {vest ? <path d={`M${-30},${sh - 4} L${30},${sh - 4} L${P.hip > 100 ? 58 : 46},${hipY + (P.hip > 100 ? 34 : 10)} L${P.hip > 100 ? -58 : -46},${hipY + (P.hip > 100 ? 34 : 10)} Z`} fill={color} stroke={color} strokeWidth={8} strokeLinejoin="round" /> : null}
        <path d={arm(-1, P.aL, P.eL)} stroke={color} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={arm(1, P.aR, P.eR)} stroke={color} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={P.hx} cy={sh - 40 + P.hy} r={28} fill={headColor || color} />
      </g>
    </g>
  );
};

// ── OBJETOS (mismo trazo grueso del cartel). Todos centrados en (0,0) con ~200 px de lado a escala 1 ──
const S = { stroke: C.tinta, strokeWidth: 14, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
export const PROPS: Record<string, (f: number, c: string, v: number) => React.ReactNode> = {
  silla: (f, c) => <g><path d="M-55,-150 L-55,90 M-55,0 L60,0 L60,90 M-55,0 L-55,-150" {...S} stroke={c} strokeWidth={16} /><rect x={-62} y={-6} width={130} height={18} rx={6} fill={c} /></g>,
  silla_vacia: (f, c) => <g><path d="M-55,-150 L-55,90 M60,10 L60,90" {...S} stroke={c} strokeWidth={16} /><rect x={-62} y={-6} width={130} height={18} rx={6} fill={c} /><path d="M-55,-150 L-55,-6" {...S} stroke={c} strokeWidth={16} /></g>,
  mesa: (f, c) => <g><rect x={-140} y={-12} width={280} height={20} rx={8} fill={c} /><path d="M-110,8 L-110,110 M110,8 L110,110" {...S} stroke={c} strokeWidth={16} /></g>,
  taza: (f, c) => <g><path d="M-38,-30 L-32,40 Q-30,52 -18,52 L18,52 Q30,52 32,40 L38,-30 Z" fill={c} /><path d="M38,-14 Q66,-12 62,12 Q58,32 34,28" {...S} stroke={c} strokeWidth={11} />{[0, 1, 2].map((i) => <path key={i} d={`M${-16 + i * 16},${-48} q8,-14 0,-28 q-8,-14 0,-28`} {...S} stroke={c} strokeWidth={6} opacity={0.35 + 0.3 * Math.sin(f / 7 + i)} transform={`translate(0,${-((f / 2 + i * 9) % 16)})`} />)}</g>,
  celular: (f, c, v) => <g><rect x={-62} y={-118} width={124} height={236} rx={20} fill={c} /><rect x={-50} y={-98} width={100} height={188} rx={8} fill={C.hoja} />{v > 0 ? Array.from({ length: Math.round(v) }).map((_, i) => <rect key={i} x={-40} y={-84 + i * 34} width={80 - (i % 2) * 20} height={24} rx={10} fill={C.amarillo} />) : <g><text x={0} y={-6} textAnchor="middle" fontFamily={TIT} fontSize={64} fill={C.tinta}>0</text><text x={0} y={34} textAnchor="middle" fontFamily={TXT} fontWeight={800} fontSize={22} fill={C.tinta}>mensajes</text></g>}<rect x={-18} y={100} width={36} height={6} rx={3} fill={C.hoja} /></g>,
  puerta: (f, c, v) => { const k = cl(v); return <g><rect x={-90} y={-200} width={180} height={300} rx={6} fill="none" stroke={c} strokeWidth={14} /><g transform={`translate(-90,0) scale(${1 - 0.75 * k},1) translate(90,0)`}><rect x={-90} y={-200} width={180} height={300} rx={6} fill={c} /><circle cx={58} cy={-40} r={10} fill={C.hoja} /></g></g>; },
  candado: (f, c) => <g><path d="M-40,-20 L-40,-60 Q-40,-100 0,-100 Q40,-100 40,-60 L40,-20" {...S} stroke={c} strokeWidth={18} /><rect x={-62} y={-24} width={124} height={100} rx={14} fill={c} /><circle cx={0} cy={18} r={11} fill={C.hoja} /></g>,
  llave: (f, c) => <g><circle cx={-60} cy={0} r={34} fill="none" stroke={c} strokeWidth={16} /><path d="M-26,0 L80,0 M50,0 L50,26 M72,0 L72,20" {...S} stroke={c} strokeWidth={16} /></g>,
  carta: (f, c) => <g><rect x={-110} y={-70} width={220} height={140} rx={10} fill={C.hoja} stroke={c} strokeWidth={12} /><path d="M-104,-62 L0,14 L104,-62" {...S} stroke={c} strokeWidth={12} /><path d="M-14,30 q14,-22 28,0 q-14,18 -14,30 q0,-12 -14,-30" fill={C.rojo} /></g>,
  hoja_papel: (f, c) => <g><path d="M-80,-110 L50,-110 L80,-80 L80,110 L-80,110 Z" fill="#fff" stroke={c} strokeWidth={10} />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-54,${-60 + i * 34} L${40 - (i % 3) * 18},${-60 + i * 34}`} {...S} stroke={c} strokeWidth={8} />)}</g>,
  lapiz: (f, c) => <g transform="rotate(35)"><rect x={-16} y={-120} width={32} height={180} rx={4} fill={c} /><path d="M-16,60 L0,100 L16,60 Z" fill={c} /><rect x={-16} y={-120} width={32} height={22} fill={C.rojo} /></g>,
  corazon: (f, c) => <path d="M0,70 C-90,10 -100,-60 -50,-78 C-20,-88 -4,-66 0,-52 C4,-66 20,-88 50,-78 C100,-60 90,10 0,70 Z" fill={c} />,
  corazon_roto: (f, c) => <g><path d="M-4,70 C-90,10 -100,-60 -50,-78 C-20,-88 -6,-66 -4,-52 L-18,-14 L6,10 L-12,44 Z" fill={c} transform="translate(-8,4) rotate(-6)" /><path d="M4,70 C90,10 100,-60 50,-78 C20,-88 6,-66 4,-52 L-10,-14 L14,10 L-4,44 Z" fill={c} transform="translate(10,6) rotate(7)" /></g>,
  reloj: (f, c) => <g><circle r={92} fill={C.hoja} stroke={c} strokeWidth={14} />{Array.from({ length: 12 }).map((_, i) => { const [x, y] = dir(i * 30); return <circle key={i} cx={x * 72} cy={-y * 72} r={i % 3 ? 4 : 7} fill={c} />; })}<path d={`M0,0 L${dir(f * 0.6)[0] * 62},${-dir(f * 0.6)[1] * 62}`} {...S} stroke={c} strokeWidth={9} /><path d={`M0,0 L${dir(f * 0.05)[0] * 42},${-dir(f * 0.05)[1] * 42}`} {...S} stroke={c} strokeWidth={13} /><circle r={10} fill={c} /></g>,
  casa: (f, c, v) => <g><path d="M-120,-10 L0,-120 L120,-10" {...S} stroke={c} strokeWidth={18} /><rect x={-92} y={-20} width={184} height={130} fill={c} /><rect x={-24} y={40} width={48} height={70} fill={C.hoja} /><rect x={-70} y={10} width={34} height={34} fill={v > 0 ? C.amarillo : C.hoja} /><rect x={36} y={10} width={34} height={34} fill={v > 0 ? C.amarillo : C.hoja} /></g>,
  cama: (f, c) => <g><path d="M-170,-60 L-170,70 M170,10 L170,70" {...S} stroke={c} strokeWidth={16} /><rect x={-170} y={0} width={340} height={34} rx={8} fill={c} /><rect x={-150} y={-30} width={70} height={30} rx={12} fill={c} /></g>,
  sofa: (f, c) => <g><rect x={-170} y={-70} width={340} height={70} rx={22} fill={c} /><rect x={-190} y={-10} width={380} height={60} rx={22} fill={c} /><path d="M-160,50 L-160,80 M160,50 L160,80" {...S} stroke={c} strokeWidth={14} /></g>,
  tele: (f, c) => <g><rect x={-130} y={-90} width={260} height={160} rx={12} fill={c} /><rect x={-114} y={-76} width={228} height={132} rx={6} fill="#cfd7dc" opacity={0.6 + 0.25 * Math.sin(f / 3)} /><path d="M-40,110 L40,110 M0,72 L0,108" {...S} stroke={c} strokeWidth={12} /></g>,
  balanza: (f, c, v) => { const t = v * 14 + Math.sin(f / 16) * 2; const [dx, dy] = [Math.cos((t * Math.PI) / 180) * 130, Math.sin((t * Math.PI) / 180) * 130]; return <g><path d="M0,-130 L0,110 M-60,110 L60,110" {...S} stroke={c} strokeWidth={14} /><path d={`M${-dx},${-130 - dy} L${dx},${-130 + dy}`} {...S} stroke={c} strokeWidth={12} /><path d={`M${-dx - 50},${-60 - dy} L${-dx + 50},${-60 - dy} M${-dx},${-130 - dy} L${-dx - 44},${-60 - dy} M${-dx},${-130 - dy} L${-dx + 44},${-60 - dy}`} {...S} stroke={c} strokeWidth={8} /><path d={`M${dx - 50},${-60 + dy} L${dx + 50},${-60 + dy} M${dx},${-130 + dy} L${dx - 44},${-60 + dy} M${dx},${-130 + dy} L${dx + 44},${-60 + dy}`} {...S} stroke={c} strokeWidth={8} /></g>; },
  escalera: (f, c, v) => <g>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-200 + i * 80} y={80 - i * 50} width={80} height={14 + i * 50} fill={i < v ? C.amarillo : c} stroke={c} strokeWidth={6} />)}</g>,
  reflector: (f, c, v) => <g><path d="M-30,-260 L30,-260 L200,110 L-200,110 Z" fill={C.amarillo} opacity={0.32 + 0.05 * Math.sin(f / 5)} /><rect x={-40} y={-290} width={80} height={44} rx={10} fill={c} /></g>,
  tienda: (f, c) => <g><rect x={-160} y={-60} width={320} height={170} fill="none" stroke={c} strokeWidth={14} />{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${-170 + i * 42.5},-60 L${-170 + i * 42.5 + 42.5},-60 L${-170 + i * 42.5 + 42.5},-20 Q${-170 + i * 42.5 + 21},0 ${-170 + i * 42.5},-20 Z`} fill={i % 2 ? C.hoja : c} stroke={c} strokeWidth={6} />)}<rect x={-120} y={20} width={110} height={90} fill="none" stroke={c} strokeWidth={10} /><text x={60} y={-80} textAnchor="middle" fontFamily={TIT} fontSize={30} fill={c}>TIENDITA</text></g>,
  tamal: (f, c) => <g><path d="M-80,-10 Q0,-70 80,-10 Q90,30 0,50 Q-90,30 -80,-10 Z" fill={c} /><path d="M-70,-6 Q0,-50 70,-6" {...S} stroke={C.hoja} strokeWidth={5} /><path d="M80,-10 L120,-30 M-80,-10 L-120,-30" {...S} stroke={c} strokeWidth={10} /></g>,
  hospital: (f, c) => <g><rect x={-140} y={-140} width={280} height={250} fill={c} /><rect x={-34} y={-110} width={68} height={68} fill={C.hoja} /><rect x={-22} y={-100} width={44} height={48} fill={C.rojo} /><rect x={-10} y={-104} width={20} height={56} fill={C.hoja} opacity={0} />{[0, 1, 2].map((i) => <rect key={i} x={-110 + i * 80} y={-20} width={50} height={40} fill={C.hoja} />)}<rect x={-30} y={50} width={60} height={60} fill={C.hoja} /></g>,
  coche: (f, c) => <g><path d="M-170,30 L-170,-10 Q-160,-30 -120,-34 L-80,-80 Q-70,-90 -50,-90 L60,-90 Q80,-90 92,-76 L130,-34 Q170,-30 172,-6 L172,30 Z" fill={c} /><rect x={-60} y={-76} width={56} height={40} rx={6} fill={C.hoja} /><rect x={8} y={-76} width={62} height={40} rx={6} fill={C.hoja} /><circle cx={-100} cy={34} r={30} fill={c} stroke={C.hoja} strokeWidth={8} /><circle cx={104} cy={34} r={30} fill={c} stroke={C.hoja} strokeWidth={8} /></g>,
  moto: (f, c) => <g><circle cx={-90} cy={30} r={42} fill="none" stroke={c} strokeWidth={14} /><circle cx={90} cy={30} r={42} fill="none" stroke={c} strokeWidth={14} /><path d="M-90,30 L-30,-30 L50,-30 L90,30 M50,-30 L70,-70 L100,-70" {...S} stroke={c} strokeWidth={14} /><rect x={-60} y={-90} width={80} height={56} rx={6} fill={c} /></g>,
  cuaderno: (f, c) => <g><rect x={-100} y={-130} width={200} height={260} rx={10} fill={c} /><rect x={-80} y={-110} width={170} height={220} rx={4} fill={C.hoja} />{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M-62,${-80 + i * 32} Q${-20},${-90 + i * 32} ${10 + (i % 3) * 20},${-80 + i * 32}`} {...S} stroke={c} strokeWidth={6} />)}{[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={-100} cy={-110 + i * 36} r={8} fill={C.hoja} stroke={c} strokeWidth={5} />)}</g>,
  libro: (f, c) => <g><path d="M0,-90 Q-60,-120 -150,-100 L-150,90 Q-60,70 0,100 Q60,70 150,90 L150,-100 Q60,-120 0,-90 Z" fill={c} /><path d="M0,-90 L0,100" {...S} stroke={C.hoja} strokeWidth={8} /></g>,
  pared: (f, c, v) => { const filas = Math.max(0, Math.round(v)); return <g>{Array.from({ length: filas }).map((_, r) => Array.from({ length: 6 }).map((_, i) => <rect key={`${r}-${i}`} x={-210 + i * 70 + (r % 2) * 35} y={100 - r * 40} width={64} height={34} rx={3} fill={c} />))}</g>; },
  pregunta: (f, c) => <text x={0} y={60} textAnchor="middle" fontFamily={TIT} fontSize={190} fill={c}>?</text>,
  exclama: (f, c) => <text x={0} y={60} textAnchor="middle" fontFamily={TIT} fontSize={190} fill={c}>!</text>,
  ojo: (f, c) => { const b = Math.abs(Math.sin(f / 40)) > 0.97 ? 0.1 : 1; return <g transform={`scale(1,${b})`}><path d="M-120,0 Q0,-90 120,0 Q0,90 -120,0 Z" fill={C.hoja} stroke={c} strokeWidth={14} /><circle r={36} fill={c} /><circle cx={10} cy={-10} r={10} fill={C.hoja} /></g>; },
  nube: (f, c) => <g><path d="M-120,40 Q-170,40 -160,0 Q-170,-50 -110,-50 Q-100,-100 -30,-90 Q20,-130 70,-80 Q140,-90 140,-30 Q180,0 140,40 Z" fill={C.hoja} stroke={c} strokeWidth={12} /><circle cx={-130} cy={80} r={14} fill={c} /><circle cx={-160} cy={115} r={8} fill={c} /></g>,
  globo: (f, c) => <g><path d="M-150,-70 Q-150,-110 -110,-110 L110,-110 Q150,-110 150,-70 L150,30 Q150,70 110,70 L-40,70 L-90,120 L-80,70 L-110,70 Q-150,70 -150,30 Z" fill={C.hoja} stroke={c} strokeWidth={12} /></g>,
  calendario: (f, c, v) => <g><rect x={-120} y={-110} width={240} height={220} rx={14} fill={C.hoja} stroke={c} strokeWidth={12} /><rect x={-120} y={-110} width={240} height={56} rx={14} fill={c} />{Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-96 + (i % 5) * 40} y={-36 + Math.floor(i / 5) * 36} width={28} height={24} rx={4} fill={i < v ? C.rojo : C.grisClaro} />)}</g>,
  tabachin: (f, c) => <g><path d="M0,140 L0,0 M0,40 L-50,-10 M0,20 L60,-20" {...S} stroke={c} strokeWidth={18} />{Array.from({ length: 14 }).map((_, i) => { const a = i * 0.9; return <circle key={i} cx={Math.cos(a) * (60 + (i % 3) * 24)} cy={-60 + Math.sin(a) * 50} r={30 + (i % 4) * 6} fill={i % 3 === 0 ? C.rojo : c} opacity={i % 3 === 0 ? 0.9 : 1} />; })}</g>,
  telefono_fijo: (f, c) => <g><rect x={-90} y={-30} width={180} height={90} rx={20} fill={c} /><path d="M-110,-40 Q-110,-90 -60,-90 L60,-90 Q110,-90 110,-40 L80,-40 L70,-62 L-70,-62 L-80,-40 Z" fill={c} /></g>,
  maleta: (f, c) => <g><rect x={-100} y={-60} width={200} height={140} rx={16} fill={c} /><path d="M-36,-60 L-36,-90 L36,-90 L36,-60" {...S} stroke={c} strokeWidth={12} /></g>,
  lupa: (f, c) => <g><circle cx={-20} cy={-20} r={70} fill="none" stroke={c} strokeWidth={18} /><path d="M30,30 L110,110" {...S} stroke={c} strokeWidth={26} /></g>,
  flecha: (f, c) => <path d="M-120,0 L90,0 M50,-44 L100,0 L50,44" {...S} stroke={c} strokeWidth={20} />,
  check: (f, c) => <path d="M-60,0 L-16,44 L70,-60" {...S} stroke={c} strokeWidth={24} />,
  cruz: (f, c) => <path d="M-56,-56 L56,56 M56,-56 L-56,56" {...S} stroke={c} strokeWidth={24} />,
  punto: (f, c) => <circle r={100} fill={c} />,
  estufa: (f, c) => <g><rect x={-130} y={-40} width={260} height={150} rx={10} fill={c} /><rect x={-150} y={-60} width={300} height={26} rx={8} fill={c} />{[-70, 70].map((x, i) => <g key={i}><path d={`M${x - 34},-68 q8,-30 18,-6 q6,-40 18,-4 q10,-34 16,4 q6,-20 16,6`} fill={C.rojo} transform={`translate(0,${Math.sin(f / 2.3 + i) * 2}) scale(1,${0.9 + 0.12 * Math.sin(f / 1.7 + i)})`} /></g>)}<rect x={-100} y={0} width={200} height={80} rx={6} fill={C.hoja} /></g>,
  laptop: (f, c) => <g><path d="M-100,-80 L100,-80 L100,40 L-100,40 Z" fill={c} /><rect x={-86} y={-68} width={172} height={96} rx={4} fill="#cfd7dc" /><path d="M-130,40 L130,40 L150,62 L-150,62 Z" fill={c} /></g>,
  perro: (f, c) => <g><rect x={-110} y={-40} width={200} height={70} rx={30} fill={c} /><circle cx={110} cy={-60} r={42} fill={c} /><path d={`M128,-96 L150,-130 L156,-82 Z`} fill={c} /><rect x={130} y={-62} width={56} height={30} rx={14} fill={c} /><path d="M-90,20 L-96,96 M-50,20 L-44,96 M40,20 L34,96 M74,20 L80,96" {...S} stroke={c} strokeWidth={20} /><path d={`M-110,-24 Q-160,${-60 + Math.sin(f / 3) * 22} -170,${-90 + Math.sin(f / 3) * 30}`} {...S} stroke={c} strokeWidth={14} /></g>,
  balon: (f, c) => <g transform={`rotate(${f * 3})`}><circle r={70} fill={C.hoja} stroke={c} strokeWidth={10} /><path d="M0,-28 L27,-9 L17,23 L-17,23 L-27,-9 Z" fill={c} /><path d="M0,-28 L0,-68 M27,-9 L64,-22 M17,23 L40,56 M-17,23 L-40,56 M-27,-9 L-64,-22" {...S} stroke={c} strokeWidth={8} /></g>,
  regalo: (f, c) => <g><rect x={-90} y={-50} width={180} height={140} rx={8} fill={c} /><rect x={-104} y={-80} width={208} height={40} rx={8} fill={c} /><rect x={-12} y={-80} width={24} height={170} fill={C.amarillo} /><path d="M0,-80 Q-50,-140 -60,-90 Q-40,-80 0,-80 Q40,-80 60,-90 Q50,-140 0,-80" fill={C.amarillo} /></g>,
  qr: (f, c) => <g><rect x={-120} y={-120} width={240} height={240} rx={10} fill="#fff" stroke={c} strokeWidth={8} />{Array.from({ length: 49 }).map((_, i) => rnd(i * 7 + 3) > 0.5 ? <rect key={i} x={-98 + (i % 7) * 28} y={-98 + Math.floor(i / 7) * 28} width={26} height={26} fill={c} /> : null)}</g>,
};

export const Prop: React.FC<{ n: string; x: number; y: number; s?: number; f: number; color?: string; v?: number; rot?: number; op?: number; flip?: boolean }> = ({ n, x, y, s = 1, f, color = C.tinta, v = 0, rot = 0, op = 1, flip }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${(flip ? -1 : 1) * s},${s})`} opacity={op}>{(PROPS[n] || PROPS.pregunta)(f, color, v)}</g>
);

// ── TITULAR negro con RESALTADO amarillo que se pasa como marcador (rojo = el dato que duele) ──
// txt: "La tercera es la que *más duele*" → lo de entre asteriscos va resaltado; ~~x~~ = resaltado rojo (letra blanca)
export const Titular: React.FC<{ txt: string; f: number; size?: number; w?: number; align?: "left" | "center"; delay?: number }> = ({ txt, f, size = 112, w = 1500, align = "center", delay = 0 }) => {
  const parts: { t: string; hl: 0 | 1 | 2 }[] = [];
  const re = /(\*[^*]+\*|~~[^~]+~~)/g; let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(txt))) { if (m.index > last) parts.push({ t: txt.slice(last, m.index), hl: 0 }); parts.push(m[0].startsWith("~~") ? { t: m[0].slice(2, -2), hl: 2 } : { t: m[0].slice(1, -1), hl: 1 }); last = m.index + m[0].length; }
  if (last < txt.length) parts.push({ t: txt.slice(last), hl: 0 });
  // resaltado largo → en trozos de ≤16 letras, así el titular puede cortar línea sin que el marcador se salga del cuadro
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; if (!p.hl || p.t.length <= 18) continue;
    const ch: string[] = []; let cur = "";
    for (const wd of p.t.trim().split(/\s+/)) { if (cur && (cur + " " + wd).length > 16) { ch.push(cur); cur = wd; } else cur = cur ? cur + " " + wd : wd; }
    if (cur) ch.push(cur);
    const lead = /^\s/.test(p.t) ? " " : "", tail = /\s$/.test(p.t) ? " " : "";
    parts.splice(i, 1, ...ch.flatMap((c, k) => [...(k ? [{ t: " ", hl: 0 as const }] : lead ? [{ t: lead, hl: 0 as const }] : []), { t: c, hl: p.hl }]), ...(tail ? [{ t: tail, hl: 0 as const }] : []));
  }
  const g = f - delay;
  let wi = 0;
  return (
    <div style={{ width: w, fontFamily: TIT, fontSize: size, lineHeight: 1.12, color: C.tinta, textAlign: align, letterSpacing: -1 }}>
      {parts.map((p, i) => {
        const words = p.t.split(/(\s+)/).filter((x) => x.length);
        const base = wi; wi += words.filter((x) => x.trim()).length;
        const hk = eo((g - 6 - base * 2.2) / 9);
        const inner = words.map((wd, j) => {
          if (!wd.trim()) return wd;
          const idx = base + words.slice(0, j).filter((x) => x.trim()).length;
          const u = sp((g - idx * 2.2) / 14);
          return <span key={j} style={{ display: "inline-block", transform: `translateY(${(1 - u) * 40}px)`, opacity: cl((g - idx * 2.2) / 4) }}>{wd}</span>;
        });
        if (!p.hl) return <span key={i}>{inner}</span>;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
            <span style={{ position: "absolute", left: -10, right: -10, top: "8%", bottom: "4%", background: p.hl === 2 ? C.rojo : C.amarillo, transformOrigin: "left center", transform: `scaleX(${hk}) skewX(-4deg)`, borderRadius: 6, zIndex: 0 }} />
            <span style={{ position: "relative", zIndex: 1, color: p.hl === 2 && hk > 0.5 ? "#fff" : C.tinta }}>{inner}</span>
          </span>
        );
      })}
    </div>
  );
};

// ── TARJETA de Amparo: rectángulo redondeado con sombra (NUNCA recortada: el pelo rizado deja restos) ──
// src = reel del avatar (OffthreadVideo) o, si todavía no llegó, la foto de referencia quieta.
export const Tarjeta: React.FC<{ x: number; y: number; w: number; h: number; r?: number; src?: string; still: string; startFrom?: number; objPos?: string; shadow?: boolean; scale?: number }> = ({ x, y, w, h, r = 36, src, still, startFrom = 0, objPos = "48% 30%", shadow = true, scale = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", boxShadow: shadow ? `0 26px 60px ${C.sombra}, 0 4px 14px rgba(0,0,0,0.12)` : undefined, backgroundColor: "#ddd", transform: `scale(${scale})` }}>
    {src ? <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos }} />
      : <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos }} />}
  </div>
);

// ── CHIP con el nombre (abajo de la tarjeta) ──
export const Chip: React.FC<{ txt: string; f: number; x: number; y: number }> = ({ txt, f, x, y }) => {
  const u = sp(f / 16);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - u) * 30}px)`, opacity: cl(f / 5), fontFamily: TIT, fontSize: 30, background: C.amarillo, color: C.tinta, padding: "8px 18px", borderRadius: 10 }}>{txt}</div>;
};

export const useF = () => useCurrentFrame();
