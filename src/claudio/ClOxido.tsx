// Kit del video clc28a (ÓXIDO DEL INODORO). Componentes ÚNICOS, ninguno repetido de otro video. Prefijo Ox.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Contact, RoomLight, lin, pop, useOut } from "./ClParts";
import { manoCam } from "../kits/camara/CamaraMano";

const RUST = "#D9722B", RUSTD = "#6E3512", PORC = "#FBF9F4", PORCD = "#D8D2C6", WATER = "#A9D0E8", WATERD = "#6FA6C9", OK = "#2F8F48", STONE = "#B7B1A4", VIN = "#EDE6C4", METAL = "#8F949B", PAPER = "#F6F2E8", WALL = "#EFE9DF";

const useK = () => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  return { f, fps, T, k: (a: number, b: number) => lin(f, a * T, b * T), p: (a: number, d = 13) => pop(f, fps, a * T, d) };
};
const Scene: React.FC<{ seed: number; bed?: string; dim?: number; children: React.ReactNode }> = ({ seed, bed, dim = 0.5, children }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const m = manoCam(f / fps, 1, seed);
  const z = interpolate(f, [0, Math.max(2, T)], [1, 1.04], { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#CFC6B6" }}>
    <Bed src={bed} seed={seed} dim={dim} />
    <AbsoluteFill style={{ transform: `translate(${m.x}px, ${m.y}px) rotate(${m.roll * 0.6}deg) scale(${z})` }}>{children}</AbsoluteFill>
    <RoomLight />
  </AbsoluteFill>;
};
const Card: React.FC<{ x: number; y: number; w: number; h: number; k?: number; bg?: string; children?: React.ReactNode }> = ({ x, y, w, h, k = 1, bg = WALL, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 20, background: bg, overflow: "hidden", boxShadow: `0 28px 56px ${CL.shadow}`, opacity: clamp01(k * 3), scale: String(0.9 + 0.1 * clamp01(k)) }}>{children}</div>
);
const Tag: React.FC<{ x: number; y: number; t: string; k: number; c?: string; size?: number; ink?: string }> = ({ x, y, t, k, c = CL.navy, size = 44, ink = "#fff" }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: clamp01(k), scale: String(0.85 + 0.15 * clamp01(k)), background: c, color: ink, fontFamily: LABEL, fontWeight: 800, fontSize: size, letterSpacing: 1, padding: "12px 26px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: `0 10px 22px ${CL.shadow}` }}>{t}</div>
);
const Note: React.FC<{ x: number; y: number; t: string; k: number; size?: number; c?: string; w?: number }> = ({ x, y, t, k, size = 66, c = CL.navy, w = 1200 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: c, opacity: clamp01(k), translate: `0 ${(1 - clamp01(k)) * 18}px` }}>{t}</div>
);
const Svg: React.FC<{ w?: number; h?: number; children: React.ReactNode }> = ({ w = 1920, h = 1080, children }) => <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>;
const X: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => <g opacity={clamp01(k * 3)}><path d={`M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}`} stroke={CL.red} strokeWidth={r / 4.5} strokeLinecap="round" strokeDasharray={r * 6} strokeDashoffset={r * 6 * (1 - clamp01(k))} /></g>;
const Check: React.FC<{ x: number; y: number; s: number; k: number }> = ({ x, y, s, k }) => <path d={`M ${x - s} ${y} L ${x - s * 0.25} ${y + s * 0.75} L ${x + s} ${y - s * 0.85}`} fill="none" stroke={OK} strokeWidth={s / 3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s * 5} strokeDashoffset={s * 5 * (1 - clamp01(k))} />;
const T: React.FC<{ x: number; y: number; t: string; s?: number; c?: string; a?: "middle" | "start" | "end"; o?: number }> = ({ x, y, t, s = 40, c = CL.ink, a = "middle", o = 1 }) => <text x={x} y={y} textAnchor={a} fontFamily={LABEL} fontWeight={800} fontSize={s} fill={c} opacity={o}>{t}</text>;
// la taza vista de arriba: borde, chorretes bajo el borde, agua y la línea roja
const Bowl: React.FC<{ x: number; y: number; s?: number; col?: string; stain?: number; level?: number; line?: number; children?: React.ReactNode }> = ({ x, y, s = 1, col = RUST, stain = 1, level = 1, line = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={430} ry={345} fill={PORCD} />
    <ellipse cx={0} cy={0} rx={425} ry={340} fill={PORC} stroke="#C9C2B4" strokeWidth={6} />
    <ellipse cx={0} cy={18} rx={340} ry={262} fill="#E9E5DB" />
    {Array.from({ length: 13 }).map((_, i) => { const a = -2.5 + (i / 12) * 1.86 - 0.02; const x0 = Math.cos(a) * 330, y0 = 18 + Math.sin(a) * 252; const h = 90 + rnd(i + 41) * 90; const yEnd = y0 + h * stain; return <path key={i} d={`M ${x0} ${y0} Q ${x0 * 0.97} ${(y0 + yEnd) / 2} ${x0 * 0.9} ${yEnd}`} stroke={col} strokeWidth={16 + rnd(i + 7) * 22} strokeLinecap="round" fill="none" opacity={0.78 * clamp01(stain * 2)} />; })}
    <ellipse cx={0} cy={120} rx={70 + 150 * level} ry={38 + 72 * level} fill={WATER} />
    <ellipse cx={0} cy={120} rx={70 + 150 * level} ry={38 + 72 * level} fill="none" stroke={col} strokeWidth={13} opacity={0.85 * line} />
    <path d="M -340 18 A 340 262 0 0 1 340 18" fill="none" stroke="#fff" strokeWidth={30} opacity={0.65} />
    {Array.from({ length: 11 }).map((_, i) => { const a = -2.75 + (i / 10) * 2.36; return <circle key={i} cx={Math.cos(a) * 340} cy={18 + Math.sin(a) * 262} r={8} fill="#6d675c" />; })}
    {children}
  </g>
);
// el reloj que barre
const Clock: React.FC<{ x: number; y: number; r: number; a: number; label?: string }> = ({ x, y, r, a, label }) => {
  const p = (d: number) => [x + Math.cos(d - Math.PI / 2) * r * 0.9, y + Math.sin(d - Math.PI / 2) * r * 0.9];
  const e = Math.min(0.9999, clamp01(a)) * Math.PI * 2; const [ex, ey] = p(e);
  return <g><circle cx={x} cy={y} r={r + 12} fill={CL.navy} /><circle cx={x} cy={y} r={r} fill={PORC} />
    <path d={`M ${x} ${y} L ${x} ${y - r * 0.9} A ${r * 0.9} ${r * 0.9} 0 ${e > Math.PI ? 1 : 0} 1 ${ex} ${ey} Z`} fill={CL.yellow} opacity={0.75} />
    {Array.from({ length: 12 }).map((_, i) => { const d = (i / 12) * Math.PI * 2; return <line key={i} x1={x + Math.sin(d) * r * 0.86} y1={y - Math.cos(d) * r * 0.86} x2={x + Math.sin(d) * r * 0.97} y2={y - Math.cos(d) * r * 0.97} stroke={CL.ink} strokeWidth={6} />; })}
    <line x1={x} y1={y} x2={ex} y2={ey} stroke={CL.red} strokeWidth={10} strokeLinecap="round" /><circle cx={x} cy={y} r={14} fill={CL.ink} />
    {label ? <T x={x} y={y + r + 66} t={label} s={46} /> : null}</g>;
};
const Spoon: React.FC<{ x: number; y: number; rot?: number; fill?: string; s?: number }> = ({ x, y, rot = 0, fill = "#fff", s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x={60} y={-11} width={340} height={22} rx={11} fill={METAL} /><ellipse cx={0} cy={0} rx={82} ry={56} fill="#B6BBC2" stroke={METAL} strokeWidth={6} /><ellipse cx={0} cy={-4} rx={60} ry={36} fill={fill} /></g>
);
const Jug: React.FC<{ x: number; y: number; s?: number; col?: string; label?: string; rot?: number }> = ({ x, y, s = 1, col = "#F4F1E4", label = "", rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x={-100} y={-180} width={200} height={340} rx={38} fill={col} stroke="#BDB6A6" strokeWidth={6} /><rect x={-42} y={-250} width={84} height={82} rx={12} fill={CL.navy} /><path d="M 100 -120 C 170 -110 170 40 100 40" fill="none" stroke="#BDB6A6" strokeWidth={28} /><rect x={-82} y={-70} width={164} height={124} rx={10} fill="#fff" />{label ? <T x={0} y={8} t={label} s={label.length > 8 ? 25 : 32} /> : null}</g>
);

// ═════ 1 · la mancha bajo el borde y la línea del fondo
export const OxRimStain: React.FC<{ bed?: string }> = ({ bed }) => { const { k } = useK(); return <Scene seed={301} bed={bed}><Contact x={960} y={950} w={980} /><Svg><Bowl x={960} y={520} s={1.05} stain={k(0.02, 0.45)} line={k(0.55, 0.72)} /></Svg><Tag x={960} y={102} t="DEBAJO DEL BORDE" k={k(0.3, 0.42)} c={RUST} /><Tag x={960} y={1000} t="Y LA LÍNEA ROJA EN EL FONDO" k={k(0.66, 0.78)} c={CL.red} /></Scene>; };

// ═════ 2 · lavandina, la noche, y a la mañana más oscura
export const OxBleachNight: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const c = interpolateColors(f, [0.42 * D, 0.72 * D], [RUST, RUSTD]); const pour = k(0.06, 0.2) * (1 - k(0.3, 0.38)); const moon = k(0.34, 0.74); return <Scene seed={302} bed={bed}><Card x={120} y={110} w={1680} h={830}><Svg w={1680} h={830}>
  <Bowl x={760} y={430} s={0.95} col={c} />
  <g opacity={clamp01(pour * 3)}><Jug x={1260} y={190} s={0.62} rot={-58} label="LAVANDINA" /><path d="M 1100 240 Q 1010 300 900 380" stroke="#F4EFC8" strokeWidth={22} fill="none" strokeLinecap="round" /></g>
  <rect x={1330} y={40} width={310} height={210} rx={14} fill={interpolateColors(f, [0.34 * D, 0.5 * D, 0.72 * D], ["#9fc4dd", "#141d33", "#ffe1a8"])} /><circle cx={1400 + moon * 170} cy={150 - Math.sin(moon * Math.PI) * 60} r={30} fill={moon < 0.8 ? "#EFE9CF" : "#FFB63D"} />
</Svg></Card><Tag x={1490} y={740} t="MÁS OSCURA" k={k(0.72, 0.8)} c={RUSTD} /><Tag x={1490} y={826} t="MÁS PEGADA" k={k(0.8, 0.88)} c={CL.red} /></Scene>; };

// ═════ 3 · diez agujeritos del borde; el 9 se enciende
export const OxTenHoles: React.FC<{ hi?: number; bed?: string }> = ({ hi = 9, bed }) => { const { fps, f, T: D, k } = useK(); return <Scene seed={303} bed={bed}><Svg><path d="M 180 760 A 800 600 0 0 1 1740 760" fill="none" stroke={PORC} strokeWidth={150} strokeLinecap="round" /><path d="M 180 760 A 800 600 0 0 1 1740 760" fill="none" stroke={PORCD} strokeWidth={8} transform="translate(0 74)" />
  {Array.from({ length: 10 }).map((_, i) => { const a = Math.PI + 0.09 + (i / 9) * (Math.PI - 0.18); const cx = 960 + Math.cos(a) * 780, cy = 760 + Math.sin(a) * 585; const on = i + 1 === hi; const kk = pop(f, fps, (0.05 + i * 0.05) * D, 14); const glow = on ? k(0.62, 0.74) : 0; return <g key={i} transform={`translate(${cx} ${cy}) scale(${kk})`}>{on ? <circle r={92} fill={CL.yellow} opacity={0.55 * glow} /> : null}<circle r={60} fill={on && glow > 0.5 ? CL.yellow : CL.navy} /><text y={21} textAnchor="middle" fontFamily={LABEL} fontWeight={900} fontSize={58} fill={on && glow > 0.5 ? CL.ink : "#fff"}>{i + 1}</text></g>; })}
</Svg><Tag x={960} y={700} t="EL 9: LA PIEDRA" k={k(0.72, 0.82)} c={CL.yellow} ink={CL.ink} size={64} /><Note x={960} y={800} t="cuando nada más funcionaba" k={k(0.8, 0.9)} c="#fff" /></Scene>; };

// ═════ 4 · CTA 1: página real sobre la tapa del tanque y QR
export const OxBookTank: React.FC<{ page: string; cover: string; qr: string; pageNo: number; bed?: string }> = ({ page, cover, qr, pageNo, bed }) => { const { k, p } = useK(); const up = p(0, 15), sl = p(0.14), q = p(0.5); return <Scene seed={304} bed={bed} dim={0.42}>
  <Contact x={960} y={985} w={1260} /><div style={{ position: "absolute", left: 340, top: 880, width: 1240, height: 120, background: PORC, borderRadius: 24, boxShadow: `0 20px 40px ${CL.shadow}` }} />
  <div style={{ position: "absolute", left: 160, top: 170 + (1 - sl) * 900, width: 480, height: 690, rotate: "-5deg", boxShadow: `0 24px 46px ${CL.shadow}` }}><Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
  <div style={{ position: "absolute", left: 690, top: 56 + (1 - up) * 1000, width: 590, height: 830, background: "#fff", rotate: "1.5deg", overflow: "hidden", boxShadow: `0 28px 56px ${CL.shadow}` }}><Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} /></div>
  <div style={{ position: "absolute", left: 1340, top: 250, width: 430, opacity: q, scale: String(0.85 + 0.15 * q), background: "#fff", borderRadius: 18, padding: 22, boxShadow: `0 16px 34px ${CL.shadow}`, textAlign: "center" }}><Img src={staticFile(qr)} style={{ width: 386, height: 386, display: "block" }} /><div style={{ fontFamily: LABEL, fontWeight: 800, fontSize: 30, color: CL.navy, marginTop: 12 }}>ESCANEE CON LA CÁMARA</div></div>
  <Tag x={1555} y={170} t={`PÁGINA ${pageNo}`} k={k(0.3, 0.4)} c={CL.yellow} ink={CL.ink} size={54} />
</Scene>; };

// ═════ 5 · el hierro viaja disuelto y se pega a la porcelana
export const OxIronPipe: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const air = k(0.5, 0.74); const col = interpolateColors(f, [0.5 * D, 0.74 * D], ["#8EA3B3", RUST]); return <Scene seed={305} bed={bed}><Card x={110} y={130} w={1700} h={780}><Svg w={1700} h={780}>
  <rect x={0} y={150} width={1010} height={170} fill={METAL} /><rect x={0} y={170} width={1010} height={130} fill={WATER} />
  <path d="M 1010 150 H 1180 V 430 H 1010 V 320" fill="none" /><rect x={1010} y={150} width={170} height={300} fill={METAL} /><rect x={1030} y={170} width={130} height={280} fill={WATER} />
  {Array.from({ length: 30 }).map((_, i) => { const x = ((i * 77 + f * 8) % 1000); return <circle key={i} cx={x} cy={186 + rnd(i + 3) * 100} r={7} fill="#7E8C97" opacity={0.75} />; })}
  <path d="M 700 780 V 560 Q 700 470 800 470 H 1400 Q 1500 470 1500 560 V 780 Z" fill={PORC} stroke={PORCD} strokeWidth={8} /><rect x={712} y={590} width={776} height={190} fill={WATER} />
  <line x1={712} y1={590} x2={1488} y2={590} stroke={col} strokeWidth={18} opacity={0.3 + air * 0.7} />
  {Array.from({ length: 24 }).map((_, i) => { const x = 730 + i * 32; const o = clamp01(air * 2 - rnd(i) * 0.8); return <circle key={i} cx={x} cy={578 - rnd(i + 8) * 22 * air} r={8 + rnd(i + 2) * 7} fill={col} opacity={o} />; })}
</Svg></Card><Tag x={520} y={120} t="HIERRO DISUELTO: NO SE VE" k={k(0.08, 0.2)} /><Tag x={1420} y={530} t="+ AIRE = ÓXIDO" k={k(0.58, 0.7)} c={RUST} /><Note x={1250} y={930} t="gota a gota, día tras día" k={k(0.76, 0.86)} c="#fff" /></Scene>; };

// ═════ 6 · la prueba del vaso
export const OxGlassWindow: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const d = k(0.1, 0.72); const wa = interpolateColors(f, [0.3 * D, 0.72 * D], ["#D8ECF7", "#EBC25B"]); return <Scene seed={306} bed={bed}><Card x={190} y={90} w={1540} h={880}><Svg w={1540} h={880}>
  <rect x={0} y={700} width={1540} height={180} fill="#C9B79D" /><rect x={120} y={60} width={760} height={560} rx={12} fill="#9FC4DD" stroke="#fff" strokeWidth={26} /><line x1={500} y1={60} x2={500} y2={620} stroke="#fff" strokeWidth={18} />
  <path d={`M 180 560 Q 500 ${60 - 40} 820 560`} fill="none" stroke="rgba(255,255,255,.65)" strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" />
  <circle cx={180 + d * 640} cy={560 - Math.sin(d * Math.PI) * 430} r={46} fill="#FFC83F" />
  <path d="M 1000 300 L 1030 720 H 1230 L 1260 300 Z" fill="rgba(255,255,255,.55)" stroke="#AEBBC4" strokeWidth={8} /><path d="M 1008 380 L 1031 712 H 1229 L 1252 380 Z" fill={wa} opacity={0.82} />
  <ellipse cx={1130} cy={700} rx={92} ry={12 + k(0.6, 0.8) * 6} fill={RUST} opacity={k(0.56, 0.78)} />
</Svg></Card><Tag x={700} y={760} t="UN DÍA ENTERO, QUIETO" k={k(0.12, 0.24)} /><Tag x={1320} y={880} t="AMARILLA + POLVITO = HIERRO" k={k(0.76, 0.86)} c={RUST} size={40} /></Scene>; };

// ═════ 7 · si el vaso queda limpio: tanque o tornillo
export const OxWhereElse: React.FC<{ bed?: string }> = ({ bed }) => { const { k, p } = useK(); const a = p(0.16), b = p(0.46); return <Scene seed={307} bed={bed}><Card x={170} y={190} w={700} h={660} k={a} bg={PORC}><Svg w={700} h={660}><rect x={120} y={120} width={460} height={420} rx={20} fill="#F0ECE2" stroke={PORCD} strokeWidth={8} /><rect x={140} y={250} width={420} height={270} fill={WATER} /><line x1={350} y1={160} x2={350} y2={380} stroke={RUST} strokeWidth={13} strokeDasharray="6 12" /><circle cx={350} cy={410} r={46} fill={RUST} /></Svg><div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 48, color: CL.navy }}>EL TANQUE</div></Card>
  <Card x={1050} y={190} w={700} h={660} k={b} bg={PORC}><Svg w={700} h={660}><circle cx={350} cy={210} r={100} fill={RUST} stroke={RUSTD} strokeWidth={10} /><rect x={282} y={198} width={136} height={24} fill={RUSTD} /><path d="M 350 320 Q 340 430 356 540" stroke={RUST} strokeWidth={24} strokeLinecap="round" fill="none" /></Svg><div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 48, color: CL.navy }}>EL TORNILLO</div></Card>
  <Tag x={960} y={100} t="VASO LIMPIO: BUSQUE EN OTRO LADO" k={k(0.04, 0.14)} c={OK} /></Scene>; };

// ═════ 8 · la lavandina fija el óxido
export const OxFixedStain: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k, p } = useK(); const c = interpolateColors(f, [0.3 * D, 0.6 * D], [RUST, RUSTD]); const lock = p(0.62); return <Scene seed={308} bed={bed}><Card x={130} y={130} w={1660} h={760}><Svg w={1660} h={760}>
  <rect x={0} y={560} width={1660} height={200} fill={PORC} /><rect x={0} y={556} width={1660} height={10} fill={PORCD} />
  {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={430 + i * 54} cy={530 - rnd(i + 2) * 60} r={26 + rnd(i) * 22} fill={c} />)}
  <Jug x={190} y={290} s={0.8} label="LAVANDINA" />
  <g transform={`translate(1340 ${360}) scale(${lock})`}><rect x={-100} y={-40} width={200} height={170} rx={20} fill={CL.yellow} stroke="#7a5d10" strokeWidth={8} /><path d="M -60 -40 V -96 A 60 60 0 0 1 60 -96 V -40" fill="none" stroke={METAL} strokeWidth={26} /><circle cy={32} r={22} fill={CL.ink} /></g>
</Svg></Card><Tag x={960} y={100} t="OXIDA MÁS AL HIERRO" k={k(0.1, 0.22)} c={CL.red} /><Note x={960} y={905} t="no la limpió: la pintó" k={k(0.74, 0.86)} c="#fff" size={80} /></Scene>; };

// ═════ 9 · nunca con la lavandina
export const OxNeverMix: React.FC<{ bed?: string }> = ({ bed }) => { const { f, fps, T: D, k } = useK(); const it = ["VINAGRE", "ÁCIDO", "AMONÍACO", "AGUA OXIGENADA"]; const gas = k(0.72, 0.9); return <Scene seed={309} bed={bed} dim={0.6}><Svg><Jug x={960} y={480} s={1.15} label="LAVANDINA" />
  {it.map((t, i) => { const px = [330, 1590, 330, 1590][i], py = [290, 290, 690, 690][i]; const kk = pop(f, fps, (0.08 + i * 0.14) * D, 14); const xk = k(0.15 + i * 0.14, 0.26 + i * 0.14); return <g key={i} transform={`translate(${px} ${py}) scale(${kk})`}><rect x={-260} y={-82} width={520} height={164} rx={22} fill={PORC} /><T x={0} y={16} t={t} s={t.length > 8 ? 44 : 56} /><X x={i % 2 ? -290 : 290} y={0} r={62} k={xk} /></g>; })}
  {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={760 + i * 50} cy={190 - gas * (70 + rnd(i) * 80)} r={40 + rnd(i + 2) * 34} fill="#C7CF7C" opacity={0.55 * gas} />)}
</Svg><Tag x={960} y={982} t="LARGA UN GAS QUE LASTIMA LOS PULMONES" k={k(0.76, 0.86)} c={CL.red} size={48} /></Scene>; };

// ═════ 10 · el producto en dos litros de agua contra la taza bajada
export const OxDiluted: React.FC<{ bed?: string }> = ({ bed }) => { const { f, k } = useK(); const box = (x: number, lvl: number, on: boolean, s: string, cc: string) => <g transform={`translate(${x} 170)`}><path d="M 0 0 C 0 380 120 560 330 560 C 540 560 660 380 660 0" fill={PORC} stroke={PORCD} strokeWidth={10} /><clipPath id={`oxd${x}`}><path d="M 8 0 C 8 372 124 552 330 552 C 536 552 652 372 652 0 Z" /></clipPath><g clipPath={`url(#oxd${x})`}><rect x={0} y={lvl} width={660} height={600} fill={WATER} /><rect x={0} y={150} width={660} height={50} fill={RUST} opacity={0.85} />{on ? <rect x={0} y={150} width={660} height={50} fill="#F2C230" opacity={0.55 * clamp01(k(0.56, 0.76))} /> : Array.from({ length: 34 }).map((_, i) => <circle key={i} cx={40 + rnd(i) * 580} cy={200 + rnd(i + 3) * 340 + Math.sin(f / 12 + i) * 8} r={5} fill="#F2C230" opacity={0.65} />)}</g><T x={330} y={640} t={s} s={46} c={cc} /></g>; return <Scene seed={310} bed={bed} dim={0.62}><Svg>{box(180, 130, false, "TAZA LLENA", CL.red)}{box(1080, 400, true, "TAZA BAJADA", OK)}<X x={510} y={480} r={0} k={0} /></Svg><Tag x={510} y={100} t="2 LITROS: NO HACE NADA" k={k(0.14, 0.26)} c={CL.red} /><Tag x={1410} y={100} t="EL PRODUCTO SOBRE LA MANCHA" k={k(0.5, 0.62)} c={OK} size={40} /></Scene>; };

// ═════ 11 · cerrar, descargar y el tanque que no se llena
export const OxShutOff: React.FC<{ bed?: string }> = ({ bed }) => { const { k } = useK(); const turn = k(0.08, 0.3); const fall = k(0.36, 0.74); return <Scene seed={311} bed={bed}><Card x={190} y={100} w={1540} h={860}><Svg w={1540} h={860}><rect x={0} y={760} width={1540} height={100} fill="#C7B89F" />
  <rect x={560} y={70} width={520} height={350} rx={24} fill={PORC} stroke={PORCD} strokeWidth={8} /><rect x={584} y={140 + fall * 250} width={472} height={258 - fall * 250} fill={WATER} />
  <path d="M 500 470 H 1120 C 1120 650 950 720 820 720 C 690 720 500 650 500 470 Z" fill={PORC} stroke={PORCD} strokeWidth={8} /><rect x={740} y={720} width={160} height={50} fill={PORC} stroke={PORCD} strokeWidth={8} />
  <path d={`M 590 ${540 + fall * 90} H 1030 C 1000 ${640 + fall * 30} 900 690 820 690 C 730 690 630 ${640 + fall * 30} 590 ${540 + fall * 90} Z`} fill={WATER} />
  <path d="M 1500 700 H 1240 V 500 H 1080" stroke={METAL} strokeWidth={34} fill="none" /><g transform={`translate(1370 700) rotate(${turn * 180})`}><rect x={-22} y={-82} width={44} height={164} rx={18} fill={CL.red} /><circle r={36} fill={CL.navy} /></g>
</Svg></Card><Tag x={1500} y={700} t="1 · CIERRE LA LLAVE" k={k(0.08, 0.18)} c={CL.red} size={40} /><Tag x={500} y={340} t="2 · DESCARGUE" k={k(0.34, 0.44)} size={40} /><Tag x={500} y={720} t="3 · EL TANQUE NO SE LLENA" k={k(0.66, 0.76)} c={OK} size={40} /></Scene>; };

// ═════ 12 · las tiras de papel con vinagre
export const OxPaperStrips: React.FC<{ bed?: string }> = ({ bed }) => { const { f, fps, T: D, k } = useK(); return <Scene seed={312} bed={bed}><Contact x={960} y={960} w={980} /><Svg><Bowl x={960} y={530} s={1.05} level={0.35} line={0.8}>
  {Array.from({ length: 9 }).map((_, i) => { const a = -2.42 + (i / 8) * 1.7; const x0 = Math.cos(a) * 330, y0 = 18 + Math.sin(a) * 250; const kk = pop(f, fps, (0.08 + i * 0.07) * D, 15); return <g key={i} transform={`translate(${x0} ${y0}) rotate(${(a + Math.PI / 2) * 42})`} opacity={clamp01(kk)}><rect x={-40} y={0} width={80} height={170 * kk} rx={4} fill={PAPER} stroke="#D9CFAE" strokeWidth={3} /><rect x={-40} y={0} width={80} height={170 * kk} rx={4} fill={VIN} opacity={0.55} /></g>; })}
</Bowl></Svg><Tag x={960} y={98} t="UNA AL LADO DE LA OTRA" k={k(0.5, 0.62)} /><Tag x={960} y={1000} t="EL PAPEL MANTIENE EL VINAGRE APOYADO" k={k(0.74, 0.86)} c={CL.yellow} ink={CL.ink} size={44} /></Scene>; };

// ═════ 13 · una hora y la mancha ablandada
export const OxSoftenClock: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const c = interpolateColors(f, [0.4 * D, 0.8 * D], [RUST, "#EBC49A"]); return <Scene seed={313} bed={bed}><Contact x={700} y={950} w={840} /><Svg><Bowl x={700} y={530} s={0.92} col={c} stain={1 - k(0.5, 0.8) * 0.2} level={0.38} /><Clock x={1520} y={420} r={230} a={k(0.05, 0.62)} /></Svg><Tag x={1520} y={760} t="UNA HORA" k={k(0.12, 0.24)} c={CL.yellow} ink={CL.ink} size={58} /><Tag x={1520} y={860} t="SI ES VIEJA, DOS" k={k(0.42, 0.54)} c={CL.navy} size={44} /><Note x={700} y={955} t="se ablandó" k={k(0.76, 0.88)} c="#fff" size={78} /></Scene>; };

// ═════ 14 · dos cucharadas de cítrico
export const OxCitricSpoons: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const s1 = k(0.08, 0.26), s2 = k(0.34, 0.52), r = (a: number) => Math.sin(clamp01(a) * Math.PI); return <Scene seed={314} bed={bed}><Contact x={860} y={960} w={980} /><Svg><Bowl x={860} y={530} s={1.02} level={0.32} />
  <g opacity={clamp01(s1 * 8) * (1 - k(0.3, 0.34))}><Spoon x={840} y={250 + r(s1) * 40} rot={-14 - s1 * 22} /></g><g opacity={clamp01(s2 * 8) * (1 - k(0.56, 0.6))}><Spoon x={1040} y={260 + r(s2) * 40} rot={-14 - s2 * 22} /></g>
  {Array.from({ length: 60 }).map((_, i) => { const on = i < 30 ? s1 : s2; const fx = 590 + rnd(i) * 540, fy = 250 + rnd(i + 8) * 130; return <circle key={i} cx={fx} cy={fy} r={7 + rnd(i + 2) * 7} fill="#fff" opacity={clamp01(on * 1.6 - 0.5)} />; })}
  <Clock x={1600} y={420} r={170} a={k(0.56, 0.86) * 0.5} /></Svg><Tag x={1600} y={690} t="MEDIA HORA" k={k(0.56, 0.68)} c={CL.yellow} ink={CL.ink} size={50} /><Tag x={860} y={92} t="2 CUCHARADAS SOPERAS" k={k(0.12, 0.24)} size={48} /></Scene>; };

// ═════ 15 · el hotel: pisos con agua de pozo, una noche por mes
export const OxFloorsMonth: React.FC<{ bed?: string }> = ({ bed }) => { const { f, fps, T: D, k } = useK(); return <Scene seed={315} bed={bed} dim={0.6}><Svg><rect x={240} y={140} width={620} height={820} rx={10} fill={CL.navy} />
  {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => { const on = r >= 2; const kk = pop(f, fps, (0.08 + (r + c) * 0.04) * D, 16); return <rect key={`${r}${c}`} x={282 + c * 140} y={186 + r * 150} width={110} height={110} rx={8} fill={on ? CL.yellow : "#51608a"} transform-origin="0 0" opacity={clamp01(kk)} />; }))}
  <rect x={1040} y={180} width={660} height={640} rx={18} fill={PORC} /><rect x={1040} y={180} width={660} height={110} rx={18} fill={CL.red} />
  {Array.from({ length: 28 }).map((_, i) => { const x = 1090 + (i % 7) * 82, y = 330 + Math.floor(i / 7) * 112; const hit = i === 17; return <g key={i}><rect x={x} y={y} width={70} height={92} rx={8} fill={hit ? CL.navy : "#EDE7DA"} opacity={hit ? k(0.42, 0.56) : 1} />{hit ? <path d={`M ${x + 46} ${y + 26} a 22 22 0 1 0 0 40 a 17 17 0 1 1 0 -40`} fill={CL.yellow} opacity={k(0.46, 0.6)} /> : null}</g>; })}
  <T x={1370} y={254} t="UNA VEZ POR MES" s={54} c="#fff" /></Svg><Tag x={550} y={980} t="PISOS CON AGUA DE POZO" k={k(0.2, 0.32)} c={CL.yellow} ink={CL.ink} size={44} /><Tag x={1370} y={910} t="1 CUCHARADA, DE NOCHE" k={k(0.58, 0.7)} size={44} /></Scene>; };

// ═════ 16 · pasta de bórax
export const OxBoraxPaste: React.FC<{ bed?: string }> = ({ bed }) => { const { f, k } = useK(); const lem = k(0.1, 0.46); const mix = k(0.46, 0.78); const col = interpolateColors(mix, [0, 1], ["#FFFFFF", "#F4EFD0"]); return <Scene seed={316} bed={bed}><Contact x={960} y={900} w={760} /><Svg><path d="M 560 480 H 1360 C 1360 780 1180 880 960 880 C 740 880 560 780 560 480 Z" fill="#C8D6DF" stroke="#8DA0AC" strokeWidth={10} /><ellipse cx={960} cy={480} rx={400} ry={78} fill="#E7EEF3" /><ellipse cx={960} cy={500} rx={340} ry={58} fill={col} />
  {mix > 0 ? <path d={`M 700 500 Q ${830 + Math.sin(f / 5) * 70} ${460} 960 500 T 1220 500`} fill="none" stroke="#DCD3A6" strokeWidth={14} strokeLinecap="round" /> : null}
  <g opacity={1 - mix}><g transform={`translate(1280 ${180}) rotate(25)`}><ellipse rx={130} ry={94} fill="#F4D23C" stroke="#BE9A18" strokeWidth={8} /><ellipse cx={-122} rx={22} ry={16} fill="#D3B122" /></g>{Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={1150 - i * 2} cy={270 + ((f * 7 + i * 34) % 190) * lem} r={10} fill="#F4D23C" opacity={0.9 * clamp01(lem * 4)} />)}</g>
</Svg><Tag x={560} y={280} t="½ TAZA DE BÓRAX" k={k(0.06, 0.18)} size={50} /><Tag x={1400} y={420} t="JUGO DE LIMÓN" k={k(0.18, 0.3)} c={CL.yellow} ink={CL.ink} size={46} /><Note x={960} y={920} t="como un dentífrico" k={k(0.72, 0.84)} c="#fff" size={78} /></Scene>; };

// ═════ 17 · el bórax, arriba
export const OxHighShelf: React.FC<{ bed?: string }> = ({ bed }) => { const { k } = useK(); const up = k(0.1, 0.4); return <Scene seed={317} bed={bed} dim={0.55}><Card x={190} y={80} w={1540} h={900}><Svg w={1540} h={900}><rect x={0} y={800} width={1540} height={100} fill="#C7B89F" /><rect x={860} y={230} width={560} height={26} fill={CL.brown} />
  <g transform={`translate(1140 ${760 - up * 620})`}><rect x={-96} y={-92} width={192} height={200} fill="#2F6FB7" /><rect x={-96} y={-92} width={192} height={36} fill="#E8EEF5" /><T x={0} y={40} t="BÓRAX" s={42} c="#fff" /></g>
  <line x1={60} y1={395} x2={820} y2={395} stroke={CL.red} strokeWidth={6} strokeDasharray="22 16" opacity={k(0.42, 0.56)} />
  <g transform="translate(330 800)"><circle cy={-340} r={68} fill="#E3B48E" /><rect x={-72} y={-268} width={144} height={190} rx={40} fill={CL.yellow} /><rect x={-58} y={-82} width={46} height={82} fill={CL.navy} /><rect x={12} y={-82} width={46} height={82} fill={CL.navy} /></g>
  <g transform="translate(620 800)"><ellipse cy={-92} rx={120} ry={62} fill="#A5764B" /><circle cx={118} cy={-140} r={56} fill="#A5764B" /><path d="M 90 -186 L 100 -226 L 124 -190 M 140 -190 L 170 -218 L 168 -176" fill="#7F5833" /><rect x={-92} y={-60} width={30} height={60} fill="#A5764B" /><rect x={60} y={-60} width={30} height={60} fill="#A5764B" /></g>
</Svg></Card><Tag x={1330} y={700} t="ARRIBA, CON LA TAPA CERRADA" k={k(0.56, 0.68)} c={CL.navy} size={40} /><Tag x={640} y={200} t="LEJOS DE CHICOS Y MASCOTAS" k={k(0.4, 0.52)} c={CL.red} size={44} /></Scene>; };

// ═════ 18 · cremor + agua oxigenada
export const OxCremorPaste: React.FC<{ bed?: string }> = ({ bed }) => { const { k } = useK(); return <Scene seed={318} bed={bed}><Contact x={700} y={920} w={760} /><Svg><path d="M 360 500 H 1040 C 1040 780 880 860 700 860 C 520 860 360 780 360 500 Z" fill="#E3E9EE" stroke="#A9B6BF" strokeWidth={10} /><ellipse cx={700} cy={500} rx={340} ry={66} fill="#F8F6EE" /><Spoon x={560} y={330 + k(0.08, 0.2) * 70} rot={-30} /><g transform={`translate(1000 ${260 + k(0.34, 0.48) * 40}) rotate(${-46 * k(0.34, 0.48)})`}><Jug x={0} y={0} s={0.7} col={CL.brown} label="10 VOL" /></g><Clock x={1560} y={420} r={190} a={k(0.56, 0.86) * 0.5} /></Svg><Tag x={480} y={200} t="2 CUCHARADAS DE CREMOR" k={k(0.1, 0.22)} size={44} /><Tag x={1560} y={720} t="MEDIA HORA" k={k(0.58, 0.7)} c={CL.yellow} ink={CL.ink} size={54} /><Note x={700} y={920} t="sobre la mancha, y frote" k={k(0.74, 0.86)} c="#fff" /></Scene>; };

// ═════ 19 · cada producto, su día
export const OxFlushBetween: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k, p } = useK(); const fl = k(0.34, 0.56); return <Scene seed={319} bed={bed} dim={0.6}><Svg><line x1={260} y1={560} x2={1660} y2={560} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
  <g transform={`translate(390 400) scale(${p(0.06)})`}><Jug x={0} y={0} s={0.82} col={VIN} label="VINAGRE" /></g><g transform={`translate(1530 400) scale(${p(0.62)})`}><Jug x={0} y={0} s={0.82} col={CL.brown} label="CREMOR" /></g>
  <g transform="translate(960 560)"><circle r={118} fill={WATER} stroke="#fff" strokeWidth={10} /><path d={`M 0 0 m -74 0 a 74 74 0 1 1 148 0 a 74 74 0 1 1 -148 0`} fill="none" stroke={WATERD} strokeWidth={20} strokeDasharray="110 60" transform={`rotate(${fl * 900})`} /></g>
</Svg><Tag x={390} y={700} t="HOY" k={k(0.1, 0.2)} size={58} /><Tag x={960} y={740} t="DESCARGUE BIEN" k={k(0.36, 0.48)} c={WATERD} size={50} /><Tag x={1530} y={700} t="OTRO DÍA" k={k(0.64, 0.74)} c={OK} size={58} /><Note x={960} y={880} t="cada producto, su día" k={k(0.78, 0.9)} c="#fff" size={84} /></Scene>; };

// ═════ 20 · el tornillo que gotea
export const OxScrewDrip: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const dr = k(0.12, 0.56); const sw = k(0.68, 0.84); const col = interpolateColors(sw, [0, 1], [RUST, "#EDEAE1"]); return <Scene seed={320} bed={bed} dim={0.42}><Svg><rect x={380} y={100} width={1160} height={880} rx={40} fill={PORC} stroke={PORCD} strokeWidth={8} />
  <circle cx={960} cy={270} r={120} fill={col} stroke={sw > 0.5 ? "#BDB7A9" : RUSTD} strokeWidth={12} /><rect x={884} y={258} width={152} height={24} fill={sw > 0.5 ? "#8A8578" : RUSTD} />
  <path d={`M 960 390 Q 950 ${500} 970 ${390 + dr * 520}`} stroke={RUST} strokeWidth={34} strokeLinecap="round" fill="none" opacity={0.8} />
  <ellipse cx={968} cy={400 + ((f * 7) % 520) * (1 - sw)} rx={18} ry={26} fill={CL.red} opacity={0.95 * clamp01(dr * 6) * (1 - sw)} /></Svg><Tag x={560} y={270} t="DE HIERRO" k={k(0.06, 0.16)} c={RUSTD} size={46} /><Tag x={1320} y={700} t="DEJA LA LÍNEA" k={k(0.42, 0.54)} c={CL.red} size={46} /><Tag x={1300} y={270} t="PLÁSTICO O INOXIDABLE" k={k(0.74, 0.86)} c={OK} size={40} /></Scene>; };

// ═════ 21 · el tanque por dentro
export const OxTankCut: React.FC<{ bed?: string }> = ({ bed }) => { const { f, k } = useK(); const fl = k(0.2, 0.8); return <Scene seed={321} bed={bed}><Card x={230} y={70} w={1460} h={920}><Svg w={1460} h={920}>
  <rect x={230} y={60} width={1000} height={520} rx={26} fill={PORC} stroke={PORCD} strokeWidth={10} /><rect x={254} y={190} width={952} height={366} fill={WATER} opacity={0.8} />
  <path d="M 760 60 V 420" stroke={RUST} strokeWidth={13} strokeDasharray="8 15" /><circle cx={480} cy={240} r={36} fill={RUST} stroke={RUSTD} strokeWidth={8} /><rect x={960} y={330} width={110} height={120} rx={10} fill={RUST} stroke={RUSTD} strokeWidth={8} />
  <path d="M 660 580 H 860 V 680 H 1240 V 760 H 660 Z" fill={PORC} stroke={PORCD} strokeWidth={8} />
  {Array.from({ length: 16 }).map((_, i) => { const u = ((f * 1.4 + i * 12) % 100) / 100; const X0 = u < 0.5 ? 760 : 760 + (u - 0.5) * 2 * 450; const Y0 = u < 0.5 ? 430 + u * 2 * 280 : 716; return <circle key={i} cx={X0} cy={Y0} r={9} fill={RUST} opacity={clamp01(fl * 2)} />; })}
  <path d="M 1190 716 V 880" stroke={RUST} strokeWidth={22} strokeLinecap="round" opacity={fl} />
</Svg></Card><Tag x={610} y={360} t="TORNILLO" k={k(0.06, 0.16)} c={RUSTD} size={36} /><Tag x={1100} y={120} t="CADENITA" k={k(0.14, 0.24)} c={RUSTD} size={36} /><Tag x={1350} y={510} t="CONTRAPESO" k={k(0.22, 0.32)} c={RUSTD} size={36} /><Tag x={960} y={905} t="CADA DESCARGA LLEVA UN POCO DE ÓXIDO" k={k(0.56, 0.68)} c={RUST} size={40} /></Scene>; };

// ═════ 22 · «Primero cerrá la canilla, después secá el piso»
export const OxTapFloor: React.FC<{ bed?: string }> = ({ bed }) => { const { f, k } = useK(); const off = k(0.42, 0.58); const dry = k(0.62, 0.86); return <Scene seed={322} bed={bed} dim={0.55}><Svg><rect x={420} y={180} width={520} height={70} rx={20} fill={METAL} /><rect x={850} y={180} width={90} height={190} rx={18} fill={METAL} /><rect x={640} y={120} width={70} height={60} fill={METAL} /><rect x={560} y={96} width={230} height={32} rx={14} fill={off > 0.5 ? CL.red : "#6f7680"} transform={`rotate(${off * 80} 675 112)`} />
  {Array.from({ length: 4 }).map((_, i) => <ellipse key={i} cx={895} cy={380 + ((f * 13 + i * 130) % 480)} rx={15} ry={22} fill={WATERD} opacity={1 - off} />)}
  <ellipse cx={895} cy={850} rx={500 * (1 - dry) + 20} ry={82 * (1 - dry) + 8} fill={WATER} /></Svg><Tag x={1420} y={330} t="1 · CERRÁ LA CANILLA" k={k(0.1, 0.22)} c={CL.red} size={52} /><Tag x={1420} y={460} t="2 · SECÁ EL PISO" k={k(0.5, 0.62)} c={OK} size={52} /><Note x={1420} y={590} t="— Don Elías" k={k(0.74, 0.86)} c={CL.ink} size={72} w={760} /></Scene>; };

// ═════ 23 · más blanda: y todo mojado
export const OxSoftStone: React.FC<{ bed?: string }> = ({ bed }) => { const { k, f, fps, T: D } = useK(); const a = k(0.06, 0.3), b = k(0.2, 0.46); return <Scene seed={323} bed={bed}><Card x={190} y={130} w={1540} h={740}><Svg w={1540} h={740}><T x={130} y={90} t="DUREZA" s={38} c={CL.inkSoft} a="start" /><rect x={130} y={190} width={1280} height={100} rx={20} fill="#E4DED2" /><rect x={130} y={190} width={760 * a} height={100} rx={20} fill={STONE} /><T x={160} y={258} t="PIEDRA PÓMEZ" s={44} o={clamp01(a * 2)} a="start" />
  <rect x={130} y={340} width={1280} height={100} rx={20} fill="#E4DED2" /><rect x={130} y={340} width={1190 * b} height={100} rx={20} fill={CL.navy} /><T x={160} y={408} t="PORCELANA ESMALTADA" s={44} c="#fff" o={clamp01(b * 2)} a="start" />
  {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${120 + i * 100} ${520 + (f * 6 + i * 44) % 120} q 16 30 0 48 q -16 -18 0 -48`} fill={WATERD} opacity={k(0.56, 0.7) * 0.85} />)}
</Svg></Card><Note x={960} y={900} t="pero siempre, siempre mojado" k={k(0.56, 0.7)} c="#fff" size={88} /></Scene>; };

// ═════ 24 · en una sola dirección: la mancha se queda en la piedra
export const OxOneWay: React.FC<{ bed?: string }> = ({ bed }) => { const { f, T: D, k } = useK(); const pass = (f / Math.max(1, D)) * 3.4; const u = pass % 1; const cl = clamp01(pass / 3.2); return <Scene seed={324} bed={bed} dim={0.5}><Svg><rect x={200} y={230} width={1520} height={560} rx={28} fill={PORC} stroke={PORCD} strokeWidth={8} /><rect x={320} y={400} width={1280} height={200} fill={RUST} opacity={0.82 * (1 - cl)} /><path d="M 340 690 H 1520 l -40 -34 m 40 34 l -40 34" fill="none" stroke={CL.navy} strokeWidth={14} strokeLinecap="round" opacity={k(0.08, 0.18)} />
  <g transform={`translate(${320 + u * 1110} ${500})`}><rect x={-100} y={-92} width={210} height={184} rx={28} fill={interpolateColors(cl, [0, 1], [STONE, "#9A5F36"])} />{Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={-82 + rnd(i) * 174} cy={-74 + rnd(i + 3) * 148} r={6} fill="#837C6E" />)}</g></Svg><Tag x={960} y={146} t="SUAVE · UNA SOLA DIRECCIÓN" k={k(0.04, 0.14)} size={52} /><Note x={960} y={846} t="como borrando con una goma" k={k(0.3, 0.42)} c="#fff" size={80} /></Scene>; };

// ═════ 25 · seca raya, mojada no; dónde nunca
export const OxWetOrDry: React.FC<{ bed?: string }> = ({ bed }) => { const { f, fps, T: D, k } = useK(); return <Scene seed={325} bed={bed} dim={0.58}><Card x={150} y={120} w={780} h={520}><Svg w={780} h={520}><rect width={780} height={520} fill={PORC} />{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={80 + rnd(i) * 460} y1={100 + i * 26} x2={260 + rnd(i + 4) * 440} y2={90 + i * 28} stroke="#8D877A" strokeWidth={4} opacity={k(0.08, 0.3)} />)}<T x={390} y={490} t="EN SECO: RAYA" s={56} c={CL.red} /></Svg></Card><Card x={990} y={120} w={780} h={520}><Svg w={780} h={520}><rect width={780} height={520} fill={PORC} />{Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={70 + rnd(i) * 640} cy={70 + rnd(i + 4) * 320} r={12 + rnd(i + 9) * 14} fill={WATER} opacity={k(0.16, 0.34)} />)}<Check x={390} y={240} s={100} k={k(0.3, 0.46)} /><T x={390} y={490} t="MOJADA: BIEN" s={56} c={OK} /></Svg></Card>
  {["PLÁSTICO", "ESMALTE FINO DE COLOR", "LA PARTE DE AFUERA"].map((t, i) => <div key={i} style={{ position: "absolute", left: 160 + [0, 410, 1040][i], top: 740, opacity: k(0.5 + i * 0.1, 0.6 + i * 0.1), background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 800, fontSize: 40, padding: "16px 26px", borderRadius: 12 }}>NUNCA · {t}</div>)}
</Scene>; };

// ═════ 26 · CTA 2: qué trae la página y código grande
export const OxBookCode: React.FC<{ page: string; cover: string; qr: string; pageNo: number; bed?: string }> = ({ page, cover, qr, pageNo, bed }) => { const { k, p } = useK(); const it = ["EL VINAGRE", "LA PASTA", "LA PIEDRA", "CUÁNTO TIEMPO", "QUÉ NO MEZCLAR"]; const up = p(0, 15), q = p(0.42); return <Scene seed={326} bed={bed} dim={0.48}>
  <div style={{ position: "absolute", left: 90, top: 80, width: 640, height: 900, background: "#fff", rotate: "-2deg", overflow: "hidden", translate: `${(1 - up) * -900}px 0`, boxShadow: `0 28px 56px ${CL.shadow}` }}><Img src={staticFile(page)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} /></div>
  {it.map((t, i) => <div key={i} style={{ position: "absolute", left: 800, top: 130 + i * 112, opacity: k(0.08 + i * 0.09, 0.18 + i * 0.09), translate: `${(1 - k(0.08 + i * 0.09, 0.18 + i * 0.09)) * 30}px 0`, background: i === 4 ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 800, fontSize: 40, padding: "13px 24px", borderRadius: 12, whiteSpace: "nowrap" }}>{t}</div>)}
  <div style={{ position: "absolute", left: 1320, top: 180, width: 500, opacity: q, scale: String(0.85 + 0.15 * q), background: "#fff", borderRadius: 18, padding: 24, textAlign: "center", boxShadow: `0 16px 34px ${CL.shadow}` }}><Img src={staticFile(qr)} style={{ width: 452, height: 452, display: "block" }} /><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 36, color: CL.brown, marginTop: 10 }}>El Frasco Marrón</div><div style={{ fontFamily: LABEL, fontWeight: 800, fontSize: 30, color: CL.navy }}>PÁGINA {pageNo}</div></div>
  <div style={{ position: "absolute", left: 800, top: 830, width: 980, opacity: k(0.6, 0.72), fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#fff" }}>el link, en la primera línea de la descripción</div>
</Scene>; };

// ═════ 27 · la rueda de la semana
export const OxWeekWheel: React.FC<{ bed?: string }> = ({ bed }) => { const { f, fps, T: D, k } = useK(); const a = k(0.12, 0.74); const days = ["L", "M", "M", "J", "V", "S", "D"]; return <Scene seed={327} bed={bed} dim={0.58}><Svg><g transform="translate(620 540)"><circle r={385} fill={PORC} /><circle r={150} fill={CL.navy} />{days.map((d, i) => { const an = (i / 7) * Math.PI * 2 - Math.PI / 2; const x = Math.cos(an) * 280, y = Math.sin(an) * 280; const on = i === 0; return <g key={i} transform={`translate(${x} ${y})`}><circle r={72} fill={on ? CL.yellow : "#EDE7DA"} /><text y={24} textAnchor="middle" fontFamily={LABEL} fontWeight={900} fontSize={68} fill={CL.ink}>{d}</text></g>; })}<line x1={0} y1={0} x2={Math.cos(a * Math.PI * 2 - Math.PI / 2) * 190} y2={Math.sin(a * Math.PI * 2 - Math.PI / 2) * 190} stroke={CL.red} strokeWidth={18} strokeLinecap="round" /><circle r={24} fill={CL.yellow} /></g><Spoon x={1270} y={350} rot={8} s={0.9} /></Svg><Tag x={1420} y={530} t="1 POR SEMANA, DE NOCHE" k={k(0.14, 0.26)} size={48} /><Tag x={1420} y={650} t="A LA MAÑANA, CEPILLO" k={k(0.42, 0.54)} c={OK} size={48} /><Note x={1420} y={770} t="no le dé tiempo" k={k(0.66, 0.78)} c="#fff" size={82} w={800} /></Scene>; };

// ═════ 28 · la rutina del hotel, 5 pasos en 5 minutos
export const OxRoutine: React.FC<{ from?: number; to?: number; bed?: string }> = ({ from = 0, to = 5, bed }) => { const { k } = useK(); const it = ["Guantes y ventana abierta", "Cerrar y bajar la taza", "1 cucharada de cítrico", "Mirar tornillos y tanque", "A los 20 min: cepillo y descarga"]; return <Scene seed={328} bed={bed} dim={0.56}><Card x={210} y={80} w={1100} h={920} bg={PAPER}><div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.navy }}>La rutina del hotel</div>{it.map((t, i) => { const n = i < from ? 1 : i >= to ? 0 : k(0.06 + ((i - from) / Math.max(1, to - from)) * 0.7, 0.16 + ((i - from) / Math.max(1, to - from)) * 0.7); return <div key={i} style={{ position: "absolute", left: 66, top: 180 + i * 142, display: "flex", alignItems: "center", gap: 26, opacity: 0.22 + 0.78 * n }}><div style={{ width: 92, height: 92, borderRadius: 46, background: n > 0.5 ? CL.yellow : "#DDD5C5", color: CL.ink, fontFamily: LABEL, fontWeight: 900, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.ink, whiteSpace: "nowrap" }}>{t}</div></div>; })}</Card><Svg><Clock x={1570} y={430} r={180} a={from ? 1 : k(0.05, 0.9) * 0.6} label="" /></Svg><Tag x={1570} y={720} t="5 MINUTOS POR BAÑO" k={k(0.06, 0.18)} c={CL.yellow} ink={CL.ink} size={38} /></Scene>; };

// ═════ 29 · los cinco errores: se tachan en dos pasadas
export const OxErrors: React.FC<{ from?: number; to?: number; bed?: string }> = ({ from = 0, to = 5, bed }) => { const { k } = useK(); const it = ["Lavandina sobre el óxido", "Producto con la taza llena", "Virulana o cepillo de alambre", "Piedra pómez seca", "Mezclar productos"]; return <Scene seed={329} bed={bed} dim={0.6}>{it.map((t, i) => { const n = i < from ? 1 : i >= to ? 0 : k(0.08 + ((i - from) / Math.max(1, to - from)) * 0.66, 0.2 + ((i - from) / Math.max(1, to - from)) * 0.66); return <div key={i} style={{ position: "absolute", left: 300, top: 104 + i * 176, width: 1320, height: 150, borderRadius: 18, background: n > 0.05 ? PORC : "rgba(251,249,244,.45)", display: "flex", alignItems: "center", boxShadow: `0 16px 32px ${CL.shadow}`, overflow: "hidden" }}><div style={{ width: 150, height: 150, background: n > 0.05 ? CL.red : "#9A9385", color: "#fff", fontFamily: LABEL, fontWeight: 900, fontSize: 86, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div><div style={{ marginLeft: 36, fontFamily: LABEL, fontWeight: 800, fontSize: 56, color: CL.ink, opacity: 0.3 + 0.7 * n, position: "relative" }}>{t}<div style={{ position: "absolute", left: -8, right: -8, top: "54%", height: 8, background: CL.red, transformOrigin: "0 50%", transform: `scaleX(${n})` }} /></div></div>; })}</Scene>; };

// ═════ 30 · cola contra cítrico
export const OxColaBar: React.FC<{ bed?: string }> = ({ bed }) => { const { k } = useK(); const r = (x: number, y: number, w: number, c: string, t: string, a: number) => <g><rect x={x} y={y} width={1320} height={120} rx={22} fill="#E4DED2" /><rect x={x} y={y} width={w * a} height={120} rx={22} fill={c} /><T x={x + (w * a < 330 ? w * a + 26 : 34)} y={y + 80} t={t} s={50} c={w * a < 330 ? CL.ink : "#fff"} a="start" o={clamp01(a * 3)} /></g>; return <Scene seed={330} bed={bed} dim={0.5}><Card x={180} y={150} w={1560} h={700}><Svg w={1560} h={700}><T x={120} y={100} t="FUERZA CONTRA EL ÓXIDO" s={46} c={CL.inkSoft} a="start" />{r(120, 150, 300, "#4A2316", "COLA", k(0.08, 0.3))}{r(120, 310, 1180, OK, "ÁCIDO CÍTRICO", k(0.3, 0.54))}{r(120, 470, 930, "#A98F2E", "VINAGRE", k(0.46, 0.68))}</Svg></Card><Tag x={960} y={928} t="Y LA COLA DEJA AZÚCAR PEGADA" k={k(0.72, 0.84)} c={CL.red} size={48} /></Scene>; };

// ═════ 31 · rosada y babosa, o dura y anaranjada
export const OxRustOrSlime: React.FC<{ bed?: string }> = ({ bed }) => { const { f, k } = useK(); const blob = (seed: number, c: string, wob: number) => Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={390 + Math.cos(i * 0.7 + seed) * 200 + Math.sin(f / 12 + i) * wob} cy={250 + Math.sin(i * 1.1) * 110 + Math.cos(f / 13 + i) * wob} r={70 + rnd(i + seed) * 40} fill={c} opacity={0.82} />); return <Scene seed={331} bed={bed} dim={0.58}><Card x={150} y={120} w={780} h={700} k={k(0.04, 0.18)} bg={PORC}><Svg w={780} h={700}>{blob(2, "#EE93A8", 10)}<T x={390} y={560} t="ROSADA Y BABOSA" s={52} c="#B84868" /><T x={390} y={640} t="BACTERIA: CEPILLO" s={46} /></Svg></Card><Card x={990} y={120} w={780} h={700} k={k(0.4, 0.54)} bg={PORC}><Svg w={780} h={700}>{blob(7, RUST, 0)}<T x={390} y={560} t="DURA Y ANARANJADA" s={52} c={RUSTD} /><T x={390} y={640} t="ÓXIDO" s={46} /></Svg></Card><Note x={960} y={860} t="la diferencia está en el dedo" k={k(0.7, 0.82)} c="#fff" size={76} /></Scene>; };

// ═════ 32 · el repaso: diez renglones en tres pasadas
export const OxRecap: React.FC<{ from?: number; to?: number; bed?: string }> = ({ from = 0, to = 10, bed }) => { const { k } = useK(); const it = ["Hierro: prueba del vaso", "Nunca lavandina", "Bajar el agua", "Vinagre caliente, 1 hora", "Ácido cítrico, ½ hora", "Bórax con limón, 2 horas", "Cremor, otro día", "Tornillos y tanque", "Piedra siempre mojada", "1 cucharada por semana"]; return <Scene seed={332} bed={bed} dim={0.62}>{it.map((t, i) => { const n = i < from ? 1 : i >= to ? 0 : k(0.06 + ((i - from) / Math.max(1, to - from)) * 0.72, 0.16 + ((i - from) / Math.max(1, to - from)) * 0.72); const col = i > 4 ? 1 : 0, row = i % 5; return <div key={i} style={{ position: "absolute", left: 80 + col * 900, top: 140 + row * 164, width: 860, height: 136, borderRadius: 16, background: n > 0.05 ? PORC : "rgba(251,249,244,.4)", display: "flex", alignItems: "center", boxShadow: `0 12px 24px ${CL.shadow}`, overflow: "hidden", opacity: 0.45 + 0.55 * n }}><div style={{ width: 136, height: 136, flexShrink: 0, background: n > 0.05 ? (i === 8 ? CL.yellow : CL.navy) : "#9A9385", color: i === 8 && n > 0.05 ? CL.ink : "#fff", fontFamily: LABEL, fontWeight: 900, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div><div style={{ marginLeft: 26, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.ink, whiteSpace: "nowrap" }}>{t}</div></div>; })}</Scene>; };
