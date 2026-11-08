// heroes.tsx · kit AlbDren (sesD, alb5na «el dren francés de un albañil, pieza por pieza»): componentes PROPIOS, uno por idea, dibujados
// como el OBJETO de la obra (muro de ladrillo con salitre, corte de terreno con cimiento y zanja, manta geotextil, grava, caño ranurado,
// registro, nivel e hilo, balde, lata de asfáltico…). Escenario = Stage de ckit. Física con resorte (phys). Datos = los del guion.
import React from "react";
import { AbsoluteFill } from "remotion";
import { cl, eio, FONT, H, HAND, phys, Stage } from "./ckit";

type C = React.FC<{ t: number; h: H }>;
const BRICK = "#b5532f", BRICKD = "#7c3418", MORTAR = "#d9c7a8", SOIL = "#6a4428", SOILD = "#3e2614", CONC = "#9a9a94", CONCD = "#6c6c66",
  INK = "#fbf6ea", NAVY = "#1d1a16", RED = "#e2452f", GRN = "#6cc46a", SKY = "#7cc4e8", AMB = "#ffc23a", GEO = "#cfd2d6", SALT = "#f4f1ea", PIPE = "#2b2b2b";
const P = (tt: number, a: number, w = 7, z = 0.5) => phys(tt, a, w, z);
const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const W = (tt: number, a: number, b: number) => eio(tt, a, b);

const Lbl: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; bg?: string; size?: number; hand?: boolean }> = ({ tt, at, x, y, tx, col = NAVY, bg = INK, size = 44, hand }) => {
  const s = P(tt, at, 8, 0.5); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -50}px) rotate(${(1 - s) * -4}deg)`, opacity: cl(s * 2.2),
    padding: hand ? "4px 18px" : "10px 26px", borderRadius: 14, background: bg, color: col, fontFamily: hand ? HAND : FONT, fontWeight: 900, fontSize: hand ? size * 1.3 : size,
    letterSpacing: hand ? 0 : 1.5, whiteSpace: "nowrap", boxShadow: hand ? "none" : "0 14px 34px rgba(0,0,0,.45)", textShadow: hand ? "0 6px 18px rgba(0,0,0,.7)" : "none" }}>{tx}</div>;
};
const Big: React.FC<{ tt: number; at: number; x: number; y: number; tx: string; col?: string; size?: number }> = ({ tt, at, x, y, tx, col = AMB, size = 170 }) => {
  const s = P(tt, at, 7, 0.42); if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, WebkitTextStroke: "6px #1b1206", textShadow: "0 18px 40px rgba(0,0,0,.6)", lineHeight: 1, whiteSpace: "nowrap" } as React.CSSProperties}>{tx}</div>;
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>{children}</svg>;
const Defs = () => <defs>
  <pattern id="brick" width="120" height="60" patternUnits="userSpaceOnUse"><rect width="120" height="60" fill={MORTAR} /><rect x="3" y="3" width="114" height="24" rx="3" fill={BRICK} /><rect x="-57" y="33" width="114" height="24" rx="3" fill={BRICK} /><rect x="63" y="33" width="114" height="24" rx="3" fill={BRICK} /></pattern>
  <pattern id="gravel" width="44" height="40" patternUnits="userSpaceOnUse"><rect width="44" height="40" fill="#8d8a84" /><ellipse cx="11" cy="10" rx="10" ry="8" fill="#b9b5ad" /><ellipse cx="32" cy="14" rx="9" ry="7" fill="#a29e96" /><ellipse cx="20" cy="30" rx="11" ry="8" fill="#c8c4bc" /><ellipse cx="40" cy="34" rx="6" ry="5" fill="#9b978f" /></pattern>
  <pattern id="dirty" width="44" height="40" patternUnits="userSpaceOnUse"><rect width="44" height="40" fill="#7a5a3a" /><ellipse cx="11" cy="10" rx="10" ry="8" fill="#8f7357" /><ellipse cx="32" cy="16" rx="8" ry="7" fill="#9a7a5a" /><ellipse cx="22" cy="30" rx="10" ry="7" fill="#866648" /></pattern>
  <pattern id="grit" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="3" fill="rgba(0,0,0,.25)" /><circle cx="28" cy="26" r="2" fill="rgba(255,220,180,.18)" /><circle cx="18" cy="34" r="2.5" fill="rgba(0,0,0,.2)" /></pattern>
  <pattern id="felt" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill={GEO} /><path d="M 0 4 l 16 3 M 0 12 l 16 -4" stroke="#b7bbc0" strokeWidth="1.5" /></pattern>
  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#80583a" /><stop offset=".3" stopColor={SOIL} /><stop offset="1" stopColor={SOILD} /></linearGradient>
  <linearGradient id="conc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b4b4ae" /><stop offset="1" stopColor={CONCD} /></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(124,196,232,.85)" /><stop offset="1" stopColor="rgba(40,110,160,.85)" /></linearGradient>
</defs>;
const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; children?: React.ReactNode; bg?: string; rot?: number }> = ({ x, y, w, h, s, children, bg = INK, rot = 0 }) => s <= 0.01 ? null :
  <g transform={`translate(${x},${y}) rotate(${rot * (1 - s)}) scale(${0.7 + 0.3 * s})`} opacity={cl(s * 2)}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={bg} stroke="rgba(0,0,0,.25)" strokeWidth={4} />{children}</g>;
const T: React.FC<{ x: number; y: number; tx: string; size?: number; col?: string; anchor?: "start" | "middle" | "end"; hand?: boolean; op?: number }> = ({ x, y, tx, size = 42, col = NAVY, anchor = "middle", hand, op = 1 }) =>
  <text x={x} y={y} textAnchor={anchor} fontFamily={hand ? HAND : FONT} fontWeight={900} fontSize={size} fill={col} opacity={op}>{tx}</text>;
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; col?: string; w?: number }> = ({ x1, y1, x2, y2, k, col = AMB, w = 10 }) => {
  if (k <= 0.01) return null; const x = lp(x1, x2, k), y = lp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={col} strokeWidth={w} strokeLinecap="round" />
    <path d={`M ${x} ${y} l ${-34 * Math.cos(a - 0.45)} ${-34 * Math.sin(a - 0.45)} M ${x} ${y} l ${-34 * Math.cos(a + 0.45)} ${-34 * Math.sin(a + 0.45)}`} stroke={col} strokeWidth={w} strokeLinecap="round" /></g>;
};
const Check: React.FC<{ x: number; y: number; ok: boolean; s: number }> = ({ x, y, ok, s }) => s <= 0.01 ? null : <g transform={`translate(${x},${y}) scale(${s})`}>
  <circle r={40} fill={ok ? GRN : RED} />{ok ? <path d="M -18 0 l 12 14 l 24 -28" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" /> : <path d="M -16 -16 l 32 32 M 16 -16 l -32 32" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
</g>;
// muro de ladrillo con mancha y salitre (stain 0-1 = altura de la mancha)
const Wall: React.FC<{ x: number; y: number; w: number; h: number; stain?: number; salt?: number; paint?: string; peel?: number }> = ({ x, y, w, h, stain = 0, salt = 0, paint, peel = 0 }) => <g>
  <rect x={x} y={y} width={w} height={h} fill={paint ?? "url(#brick)"} stroke="#3a2a1a" strokeWidth={6} />
  {stain > 0 && <path d={`M ${x} ${y + h} L ${x} ${y + h - h * 0.55 * stain} ${Array.from({ length: 9 }, (_, i) => `Q ${x + w * (i + 0.5) / 9} ${y + h - h * 0.55 * stain - 30 * Math.sin(i * 1.7)} ${x + w * (i + 1) / 9} ${y + h - h * 0.55 * stain + 14 * Math.cos(i)}`).join(" ")} L ${x + w} ${y + h} Z`} fill="rgba(60,50,30,.42)" />}
  {salt > 0 && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={x + 20 + ((i * 97) % (w - 40))} cy={y + h - 20 - ((i * 53) % (h * 0.35))} r={4 + (i % 4) * 2} fill={SALT} opacity={salt * 0.9} />)}
  {peel > 0 && [0.2, 0.5, 0.78].map((k, i) => <ellipse key={i} cx={x + w * k} cy={y + h * (0.62 + 0.08 * i)} rx={44 * peel} ry={30 * peel} fill={paint ?? INK} stroke="rgba(0,0,0,.25)" strokeWidth={4} />)}
</g>;
// corte transversal de obra: muro + cimiento + terreno de afuera (con zanja opcional)
const Section: React.FC<{ g: number; trench?: number; foot?: number; outsideHigh?: number; children?: React.ReactNode }> = ({ g, trench = 0, foot = 820, outsideHigh = 0, children }) => <g>
  <rect x={180} y={g} width={1560} height={1080 - g} fill="url(#soil)" /><rect x={180} y={g} width={1560} height={1080 - g} fill="url(#grit)" />
  <rect x={180} y={g - outsideHigh} width={1560 - 1060} height={outsideHigh} fill="url(#soil)" />
  <rect x={700} y={g - 360} width={130} height={360 + (foot - g)} fill="url(#brick)" stroke="#3a2a1a" strokeWidth={6} />
  <rect x={660} y={foot} width={210} height={70} fill="url(#conc)" stroke="#4a4a44" strokeWidth={5} />
  <rect x={830} y={g - 18} width={910} height={18} fill="url(#conc)" />
  {trench > 0 && <rect x={lp(430, 470, 0)} y={g - outsideHigh} width={210} height={(foot - 20 - g + outsideHigh) * trench} fill="#2a1a0e" />}
  {children}
</g>;
const Pipe: React.FC<{ x: number; y: number; r?: number; holes?: "down" | "up"; k?: number }> = ({ x, y, r = 56, holes = "down", k = 1 }) => <g transform={`translate(${x},${y}) scale(${k})`}>
  <circle r={r} fill={PIPE} stroke="#111" strokeWidth={6} /><circle r={r - 14} fill="#5a5a5a" />
  {[-40, 0, 40].map((a, i) => { const ang = ((holes === "down" ? 90 : -90) + a) * Math.PI / 180; return <circle key={i} cx={Math.cos(ang) * (r - 6)} cy={Math.sin(ang) * (r - 6)} r={8} fill={AMB} />; })}
</g>;
const Level: React.FC<{ x: number; y: number; w?: number; rot?: number; bub?: number }> = ({ x, y, w = 520, rot = 0, bub = 0 }) => <g transform={`translate(${x},${y}) rotate(${rot})`}>
  <rect x={-w / 2} y={-34} width={w} height={68} rx={10} fill="#e9c22b" stroke="#6a5410" strokeWidth={6} />
  <rect x={-70} y={-20} width={140} height={40} rx={20} fill="#c8f0a0" stroke="#3a5a20" strokeWidth={4} />
  <ellipse cx={bub * 50} cy={0} rx={22} ry={13} fill="#f7fff0" /><line x1={-26} y1={-20} x2={-26} y2={20} stroke="#222" strokeWidth={3} /><line x1={26} y1={-20} x2={26} y2={20} stroke="#222" strokeWidth={3} />
</g>;
const Bucket: React.FC<{ x: number; y: number; s?: number; fill?: string; label?: string }> = ({ x, y, s = 1, fill = "#e0e0e0", label }) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M -110 -120 L 110 -120 L 90 120 L -90 120 Z" fill={fill} stroke="#333" strokeWidth={6} /><ellipse cx={0} cy={-120} rx={110} ry={22} fill="#bbb" stroke="#333" strokeWidth={6} />
  <path d="M -110 -120 Q 0 -260 110 -120" stroke="#333" strokeWidth={6} fill="none" />{label && <T x={0} y={30} tx={label} size={34} />}
</g>;
const Stake: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 220 }) => <g><rect x={x - 14} y={y - h} width={28} height={h} fill="#c49058" stroke="#6a4420" strokeWidth={4} /><path d={`M ${x - 14} ${y} L ${x} ${y + 40} L ${x + 14} ${y} Z`} fill="#c49058" stroke="#6a4420" strokeWidth={4} /></g>;
const Drop: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = SKY }) => <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -40 C 20 -10, 30 6, 30 18 A 30 30 0 1 1 -30 18 C -30 6, -20 -10, 0 -40 Z" fill={col} stroke="#2e6d8c" strokeWidth={4} />;

// 1 · tres manos de pintura: la misma pared pintada tres veces, cada mano se infla
const TresManos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  {["#f2e3c6", "#d8e8f0", "#f0d6d6"].map((c, i) => { const s = P(tt, 0.3 + i * 1.6, 7); const pf = W(tt, 1.2 + i * 1.6, 2.2 + i * 1.6); return s > 0.01 && <g key={i} opacity={cl(s * 2)} transform={`translate(${300 + i * 460},${0}) scale(${0.8 + 0.2 * s})`}>
    <Wall x={0} y={260} w={400} h={520} paint={c} stain={0.7} peel={pf} /><T x={200} y={850} tx={["COMÚN", "ANTIHUMEDAD", "EL PINTOR"][i]} size={40} col={INK} /><T x={200} y={230} tx={String(i + 1)} size={80} col={AMB} /></g>; })}
</Svg><Lbl tt={tt} at={5.4} x={960} y={140} tx="3 VECES EN 2 AÑOS" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 2 · salitre: los dedos rozan el zócalo y queda el polvo blanco
const Salitre: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const sw = W(tt, 1, 3.2); return <AbsoluteFill><Svg><Defs />
  <Wall x={300} y={160} w={1320} h={660} paint="#efe6d4" stain={0.9} salt={1} />
  <rect x={300} y={760} width={1320} height={60} fill="#cbb89a" />
  <g transform={`translate(${lp(420, 1340, sw)},${700})`}><ellipse rx={120} ry={50} fill="#c58e64" /><ellipse cx={-80} cy={-30} rx={50} ry={26} fill="#c58e64" />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-60 + i * 12} cy={-40 + (i % 3) * 8} r={5} fill={SALT} opacity={sw} />)}</g>
</Svg><Lbl tt={tt} at={3.4} x={960} y={140} tx="ESO ES SALITRE" bg={INK} /><Lbl tt={tt} at={4.6} x={960} y={930} tx="LA PARED TE ESTÁ AVISANDO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 3 · el corte: de un lado la pared con mancha, del otro la zanja con piedra y caño
const Corte: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const k = W(tt, 0.6, 3.6); return <AbsoluteFill><Svg><Defs />
  <Section g={560} foot={860}>
    <rect x={430} y={560} width={210} height={300 * k} fill="url(#gravel)" opacity={cl(k * 2)} />
    {k > 0.6 && <Pipe x={535} y={800} r={46} k={P(tt, 2.6)} />}
    <rect x={830} y={200} width={500} height={360} fill="#efe6d4" /><path d="M 830 560 L 830 420 Q 980 380 1100 430 T 1330 420 L 1330 560 Z" fill="rgba(60,50,30,.4)" />
  </Section>
</Svg><Lbl tt={tt} at={1.2} x={1080} y={140} tx="ADENTRO: LA MANCHA" bg={INK} /><Lbl tt={tt} at={3.2} x={540} y={140} tx="AFUERA: EL DREN" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 4 · dos años: el caño se va llenando de barro año a año
const DosAnos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const k = W(tt, 1, 5.5); return <AbsoluteFill><Svg><Defs />
  <circle cx={960} cy={540} r={260} fill={PIPE} stroke="#111" strokeWidth={10} /><circle cx={960} cy={540} r={230} fill="#4a4a4a" />
  <clipPath id="pc"><circle cx={960} cy={540} r={230} /></clipPath>
  <rect x={700} y={770 - 460 * k * 0.85} width={520} height={460} fill="#6a4a2a" clipPath="url(#pc)" />
  {[0, 1, 2].map((i) => <Card key={i} x={460 + i * 500} y={880} w={300} h={100} s={P(tt, 0.6 + i * 1.8)} bg={i === 2 ? RED : INK}><T x={0} y={14} tx={["AÑO 0", "AÑO 1", "AÑO 2"][i]} size={40} col={i === 2 ? INK : NAVY} /></Card>)}
</Svg><Lbl tt={tt} at={5} x={960} y={140} tx="Y NO TE DAS CUENTA: ESTÁ ENTERRADO" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 5 · diez piezas apiladas de abajo para arriba como capas
const DiezPiezas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const N = ["DIAGNÓSTICO", "TRAZADO", "ZANJA", "PENDIENTE", "MANTA", "GRAVA", "CAÑO", "REGISTRO", "MURO", "CIERRE"]; return <AbsoluteFill><Svg><Defs />
  {N.map((n, i) => { const s = P(tt, 0.3 + i * 0.42, 9); const y = 900 - i * 70; return s > 0.01 && <g key={n} transform={`translate(${960},${lp(y - 200, y, s)})`} opacity={cl(s * 2)}>
    <rect x={-330} y={-30} width={660} height={60} rx={12} fill={i === 4 ? AMB : ["#7a5a3a", "#8d8a84", INK, "#c49058", GEO][i % 5]} stroke="#222" strokeWidth={4} />
    <T x={-300} y={14} tx={String(i + 1)} size={34} anchor="start" /><T x={0} y={14} tx={n} size={34} /></g>; })}
</Svg><Lbl tt={tt} at={5.2} x={1500} y={560} tx="LA 5 SE OLVIDA" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
// 6 · treinta y cinco años: cinta de ladrillos que se apilan con los años
const TreintaYCinco: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 35 }, (_, i) => { const s = P(tt, 0.2 + i * 0.1, 10); const c = i % 7, r = Math.floor(i / 7); return s > 0.01 && <rect key={i} x={430 + c * 150 + (r % 2) * 75} y={lp(200, 760 - r * 70, s)} width={140} height={62} rx={6} fill={BRICK} stroke={BRICKD} strokeWidth={4} opacity={cl(s * 2)} />; })}
</Svg><Big tt={tt} at={4} x={960} y={220} tx="35 AÑOS" /><Lbl tt={tt} at={4.8} x={960} y={920} tx="DESDE LOS 17, CARGANDO LADRILLOS" bg={INK} /></AbsoluteFill>}</Stage>;
// 7 · la mancha es el aviso: un cartel de alarma sobre la mancha, la flecha va a la causa abajo
const Aviso: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  <Wall x={460} y={180} w={1000} h={640} paint="#efe6d4" stain={0.8} />
  <g transform={`translate(960,420) scale(${P(tt, 0.8)})`}><path d="M 0 -110 L 120 90 L -120 90 Z" fill={AMB} stroke="#222" strokeWidth={8} /><T x={0} y={60} tx="!" size={130} /></g>
  <Arrow x1={960} y1={600} x2={960} y2={960} k={W(tt, 2.4, 3.6)} col={RED} w={14} />
</Svg><Lbl tt={tt} at={1.6} x={960} y={140} tx="LA MANCHA ES EL AVISO" bg={INK} /><Lbl tt={tt} at={3.8} x={1400} y={920} tx="EL PROBLEMA: DE DÓNDE VIENE EL AGUA" bg={RED} col={INK} size={36} /></AbsoluteFill>}</Stage>;
// 8 · desnivel: el patio 20 cm más alto que el piso del living, el agua corre hacia la pared
const Desnivel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const r = W(tt, 2, 5); return <AbsoluteFill><Svg><Defs />
  <Section g={640} outsideHigh={110 * P(tt, 0.6)} foot={900} />
  {[0, 1, 2, 3].map((i) => <Drop key={i} x={lp(260 + i * 90, 650, r)} y={lp(500, 520, r)} s={0.7} />)}
  <line x1={560} y1={530} x2={560} y2={640} stroke={AMB} strokeWidth={6} strokeDasharray="10 8" /><T x={480} y={600} tx="20 cm" size={40} col={AMB} anchor="end" />
</Svg><Lbl tt={tt} at={1.4} x={420} y={260} tx="PATIO" bg={INK} /><Lbl tt={tt} at={1.8} x={1300} y={440} tx="LIVING" bg={INK} /><Lbl tt={tt} at={5} x={960} y={140} tx="EL AGUA CORRE A LA PARED" bg={SKY} /></AbsoluteFill>; }}</Stage>;
// 9 · el ladrillo es una esponja: el agua sube por los poros del ladrillo
const Esponja: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.8, 5); return <AbsoluteFill><Svg><Defs />
  <rect x={560} y={300} width={800} height={380} rx={14} fill={BRICK} stroke={BRICKD} strokeWidth={8} />
  {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={600 + (i * 83) % 760} cy={330 + (i * 47) % 330} r={8} fill={BRICKD} />)}
  <clipPath id="bk"><rect x={560} y={300} width={800} height={380} rx={14} /></clipPath>
  <rect x={560} y={680 - 380 * k} width={800} height={380} fill="rgba(40,110,160,.45)" clipPath="url(#bk)" />
  <rect x={460} y={680} width={1000} height={90} fill="url(#water)" />
</Svg><Lbl tt={tt} at={1} x={960} y={200} tx="EL LADRILLO CHUPA COMO UNA ESPONJA" bg={INK} /><Lbl tt={tt} at={4} x={960} y={880} tx="SUBE HASTA 1 METRO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 10 · tres lugares: casa en corte con tres flechas (arriba, aire, abajo-afuera)
const TresLugares: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <path d="M 560 420 L 960 200 L 1360 420 Z" fill="#7a3a28" stroke="#222" strokeWidth={6} /><rect x={600} y={420} width={720} height={420} fill="#efe6d4" stroke="#222" strokeWidth={6} />
  <rect x={180} y={840} width={1560} height={140} fill="url(#soil)" />
  <Arrow x1={1100} y1={150} x2={1100} y2={400} k={W(tt, 0.8, 1.6)} col={SKY} w={14} />
  {[0, 1, 2].map((i) => <path key={i} d={`M ${820 + i * 40} ${700 - ((tt * 50 + i * 40) % 160)} q 15 -20 0 -40`} stroke="#fff" strokeWidth={6} fill="none" opacity={cl(tt - 2.6) * 0.8} />)}
  <Arrow x1={380} y1={900} x2={600} y2={760} k={W(tt, 4.2, 5.2)} col={RED} w={16} />
</Svg><Lbl tt={tt} at={1.4} x={1380} y={180} tx="1 · DE ARRIBA" bg={SKY} /><Lbl tt={tt} at={2.8} x={1500} y={600} tx="2 · DEL AIRE" bg={INK} /><Lbl tt={tt} at={4.6} x={420} y={680} tx="3 · DEL TERRENO" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 11 · la prueba del nailon: un cuadrado de 30×30 pegado con cinta por los 4 lados
const Nailon: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const s = P(tt, 0.6); return <AbsoluteFill><Svg><Defs />
  <Wall x={360} y={140} w={1200} h={760} paint="#efe6d4" stain={0.7} />
  <g transform={`translate(960,560) scale(${s})`} opacity={cl(s * 2)}><rect x={-220} y={-220} width={440} height={440} fill="rgba(220,240,255,.35)" stroke="rgba(255,255,255,.9)" strokeWidth={4} />
    {[[-220, -240, 440, 40], [-220, 200, 440, 40], [-240, -220, 40, 440], [200, -220, 40, 440]].map(([x, y, w, hh], i) => <rect key={i} x={x} y={y} width={w} height={hh} fill="#c9a86a" opacity={W(tt, 1.4 + i * 0.4, 1.8 + i * 0.4)} />)}</g>
</Svg><Lbl tt={tt} at={1.2} x={960} y={110} tx="NAILON 30 × 30" bg={INK} /><Lbl tt={tt} at={3.4} x={960} y={970} tx="SELLADO · 48 HORAS" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 12 · gotitas: de qué lado aparecen las gotas dice de dónde viene el agua (corte del nailon)
const Gotitas: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 560 + i * 800; return <g key={i} opacity={cl(P(tt, 0.4 + i * 1.8) * 2)}>
    <rect x={x - 200} y={260} width={120} height={500} fill="url(#brick)" /><line x1={x - 60} y1={260} x2={x - 60} y2={760} stroke="rgba(220,240,255,.9)" strokeWidth={8} />
    {Array.from({ length: 6 }, (_, j) => <Drop key={j} x={x - 60 + (i === 0 ? -16 : 16)} y={320 + j * 80} s={0.32} />)}
    <T x={x + 40} y={860} tx={i === 0 ? "DEL LADO DE LA PARED" : "DEL LADO DEL LIVING"} size={36} col={INK} />
    <T x={x + 40} y={920} tx={i === 0 ? "VIENE DEL LADRILLO" : "CONDENSACIÓN"} size={40} col={i === 0 ? RED : SKY} /></g>; })}
</Svg><Lbl tt={tt} at={1} x={960} y={140} tx="¿DE QUÉ LADO ESTÁN LAS GOTAS?" bg={INK} /></AbsoluteFill>}</Stage>;
// 13 · dos preguntas afuera: terreno más alto + se junta agua → sí es para ti
const DosPreguntas: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {["¿EL TERRENO ESTÁ MÁS ALTO QUE EL PISO?", "¿SE JUNTA AGUA AL PIE AL LLOVER?"].map((q, i) => <Card key={i} x={960} y={330 + i * 220} w={1180} h={160} s={P(tt, 0.5 + i * 1.6)}><T x={-540} y={14} tx={q} size={44} anchor="start" /><Check x={500} y={0} ok s={P(tt, 1.6 + i * 1.6)} /></Card>)}
</Svg><Lbl tt={tt} at={4.8} x={960} y={860} tx="DOS SÍ = DREN FRANCÉS" bg={AMB} size={56} /></AbsoluteFill>}</Stage>;
// 14 · el largo: mancha de 4 m, dren de 5-6 m, un metro de más de cada lado
const Largo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const k = W(tt, 1.6, 3.6); return <AbsoluteFill><Svg><Defs />
  <rect x={260} y={300} width={1400} height={300} fill="url(#brick)" stroke="#222" strokeWidth={6} />
  <rect x={560} y={420} width={800} height={180} fill="rgba(60,50,30,.45)" />
  <Arrow x1={560} y1={380} x2={1360} y2={380} k={W(tt, 0.6, 1.4)} col={INK} w={6} /><T x={960} y={360} tx="MANCHA 4 m" size={40} col={INK} />
  <rect x={lp(560, 360, k)} y={680} width={lp(800, 1200, k)} height={70} rx={10} fill="url(#gravel)" stroke="#222" strokeWidth={4} />
  <T x={960} y={830} tx={k > 0.9 ? "DREN 6 m" : ""} size={54} col={AMB} />
</Svg><Lbl tt={tt} at={3.8} x={300} y={920} tx="+1 m" bg={AMB} /><Lbl tt={tt} at={3.8} x={1620} y={920} tx="+1 m" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 15 · la salida: el agua tiene que ir a un punto más bajo — vereda, cuneta, pozo; nunca la cloaca
const Salida: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => { const f = (tt * 0.5) % 1; return <AbsoluteFill><Svg><Defs />
  <path d="M 180 560 L 1740 760 L 1740 1080 L 180 1080 Z" fill="url(#soil)" />
  <line x1={300} y1={640} x2={1500} y2={790} stroke={PIPE} strokeWidth={40} strokeLinecap="round" />
  {[0, 1, 2].map((i) => <Drop key={i} x={lp(300, 1500, (f + i / 3) % 1)} y={lp(640, 790, (f + i / 3) % 1) - 4} s={0.35} />)}
  {["VEREDA", "CUNETA", "POZO A 3 m"].map((n, i) => <Card key={n} x={540 + i * 420} y={330} w={340} h={100} s={P(tt, 1 + i * 0.9)} bg={GRN}><T x={0} y={14} tx={n} size={38} col={NAVY} /></Card>)}
  <Card x={1500} y={500} w={360} h={100} s={P(tt, 4.2)} bg={RED}><T x={0} y={14} tx="CLOACA: NUNCA" size={38} col={INK} /></Card>
</Svg><Lbl tt={tt} at={0.6} x={960} y={140} tx="SE DECIDE PRIMERO: ¿A DÓNDE VA EL AGUA?" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 16 · los caños: antes de cavar, el mapa de lo que pasa al pie de la pared
const Canos: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <rect x={180} y={420} width={1560} height={560} fill="url(#soil)" /><rect x={180} y={300} width={1560} height={120} fill="url(#brick)" />
  {[["GAS", "#f2c230", 560], ["AGUA", SKY, 700], ["CABLES", RED, 830]].map(([n, c, y], i) => { const k = W(tt, 0.6 + i * 1, 1.6 + i * 1); return <g key={i}><line x1={180} y1={y as number} x2={lp(180, 1740, k)} y2={y as number} stroke={c as string} strokeWidth={26} strokeLinecap="round" /><T x={220} y={(y as number) - 24} tx={n as string} size={36} col={INK} anchor="start" op={k} /></g>; })}
  <g transform={`translate(${1260},${lp(150, 470, W(tt, 3.6, 4.4))}) rotate(20)`}><rect x={-14} y={-260} width={28} height={260} fill="#8a6038" /><path d="M -70 0 L 70 0 L 50 110 L -50 110 Z" fill="#9a9a9a" stroke="#333" strokeWidth={5} /></g>
</Svg><Lbl tt={tt} at={4.6} x={1260} y={160} tx="AVERIGUA ANTES DE CAVAR" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 17 · medidas de la zanja: 30-40 de ancho, 50-60 de hondo, cotas que se dibujan
const Medidas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <path d="M 180 360 L 760 360 L 760 860 L 1160 860 L 1160 360 L 1740 360 L 1740 1080 L 180 1080 Z" fill="url(#soil)" />
  <Arrow x1={760} y1={300} x2={1160} y2={300} k={W(tt, 0.8, 1.8)} col={AMB} w={8} /><Arrow x1={1160} y1={300} x2={760} y2={300} k={W(tt, 0.8, 1.8)} col={AMB} w={8} />
  <Arrow x1={1250} y1={360} x2={1250} y2={860} k={W(tt, 2.6, 3.6)} col={AMB} w={8} /><Arrow x1={1250} y1={860} x2={1250} y2={360} k={W(tt, 2.6, 3.6)} col={AMB} w={8} />
</Svg><Big tt={tt} at={1.6} x={960} y={220} tx="30–40 cm" size={110} /><Big tt={tt} at={3.4} x={1480} y={620} tx="50–60" size={110} /><Lbl tt={tt} at={4.6} x={960} y={960} tx="EL FONDO, POR DEBAJO DEL PISO DE ADENTRO" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
// 18 · descalzar: zanja pegada y más honda que el cimiento → la pared se inclina y se raja
const Descalzar: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => { const k = W(tt, 2.4, 5); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={520} width={1560} height={560} fill="url(#soil)" />
  <rect x={460} y={520} width={200} height={460 * W(tt, 0.6, 2)} fill="#24160b" />
  <g transform={`rotate(${-4 * k} 760 900)`}><rect x={700} y={140} width={130} height={720} fill="url(#brick)" stroke="#222" strokeWidth={6} /><rect x={660} y={860} width={210} height={70} fill="url(#conc)" />
    <path d={`M 760 300 l 20 60 l -24 50 l 26 70 l -20 60`} stroke="#111" strokeWidth={6} fill="none" opacity={k} /></g>
</Svg><Lbl tt={tt} at={1} x={1300} y={300} tx="NUNCA MÁS HONDO QUE EL CIMIENTO" bg={RED} col={INK} size={38} /><Lbl tt={tt} at={3.4} x={1300} y={420} tx="ESO SE LLAMA DESCALZAR" bg={INK} /><Lbl tt={tt} at={4.6} x={1300} y={540} tx="GRIETA = INGENIERO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 19 · la regla del ángulo: tanto como bajas de más, tanto te alejas
const Angulo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const k = W(tt, 1, 3.4); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={420} width={1560} height={660} fill="url(#soil)" />
  <rect x={1100} y={100} width={130} height={620} fill="url(#brick)" stroke="#222" strokeWidth={6} /><rect x={1060} y={720} width={210} height={70} fill="url(#conc)" />
  <line x1={1060} y1={790} x2={lp(1060, 760, k)} y2={lp(790, 1000, k) - (lp(790, 1000, k) - 790) * 0} stroke={AMB} strokeWidth={8} strokeDasharray="16 10" />
  <rect x={lp(840, 600, k)} y={420} width={170} height={lp(300, 560, k)} fill="#24160b" />
  <T x={940} y={1000} tx={`${Math.round(lp(0, 20, k))} cm ↓ = ${Math.round(lp(0, 20, k))} cm ←`} size={48} col={AMB} />
</Svg><Lbl tt={tt} at={0.6} x={700} y={200} tx="LA REGLA DEL ÁNGULO" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 20 · el pozo de prueba: 50×50 en una punta, aparece el cimiento
const PozoPrueba: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => { const k = W(tt, 0.8, 3); return <AbsoluteFill><Svg><Defs />
  <ellipse cx={960} cy={560} rx={460} ry={330} fill="url(#soil)" />
  <clipPath id="pz"><rect x={760} y={360} width={400} height={400} rx={18} /></clipPath>
  <rect x={760} y={360} width={400} height={400} rx={18} fill="#24160b" opacity={k} />
  <g clipPath="url(#pz)" opacity={W(tt, 2.4, 3.4)}><rect x={760} y={360} width={130} height={400} fill="url(#brick)" /><rect x={760} y={620} width={230} height={140} fill="url(#conc)" /></g>
</Svg><Lbl tt={tt} at={1} x={960} y={140} tx="POZO DE PRUEBA 50 × 50" bg={INK} /><Lbl tt={tt} at={3.6} x={1400} y={760} tx="AHÍ ESTÁ EL CIMIENTO" bg={AMB} /><Lbl tt={tt} at={5} x={960} y={970} tx="¿FLOJO? PARAS Y LLAMAS A UN PROFESIONAL" bg={RED} col={INK} size={36} /></AbsoluteFill>; }}</Stage>;
// 21 · un centímetro por metro: el fondo baja escalón a escalón hacia la salida
const UnCm: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  <line x1={300} y1={340} x2={1620} y2={340} stroke={INK} strokeWidth={4} />
  {Array.from({ length: 7 }, (_, i) => { const s = P(tt, 0.4 + i * 0.5); const y = 520 + i * 26; return <g key={i} opacity={cl(s * 2)}><line x1={300 + i * 220} y1={340} x2={300 + i * 220} y2={y} stroke={AMB} strokeWidth={4} strokeDasharray="8 6" /><T x={300 + i * 220} y={y + 60} tx={`${50 + i}`} size={38} col={AMB} /></g>; })}
  <path d={`M 300 520 L ${lp(300, 1620, W(tt, 0.4, 3.6))} ${lp(520, 676, W(tt, 0.4, 3.6))}`} stroke={SOIL} strokeWidth={30} strokeLinecap="round" />
</Svg><Big tt={tt} at={3.8} x={960} y={200} tx="1 cm POR METRO" size={110} /><Lbl tt={tt} at={4.6} x={960} y={930} tx="MEJOR 2 · NUNCA MENOS DE 1" bg={INK} /></AbsoluteFill>}</Stage>;
// 22 · el pisón: golpes que aplanan el fondo, la tierra floja se hunde
const Pison: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => { const hit = Math.abs(Math.sin(tt * 3)); const k = W(tt, 0.4, 5); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={660} width={1560} height={420} fill="url(#soil)" />
  <path d={`M 180 660 ${Array.from({ length: 12 }, (_, i) => `L ${180 + i * 142} ${660 + (1 - k) * 30 * Math.sin(i * 2.3)}`).join(" ")} L 1740 660`} stroke="#80583a" strokeWidth={14} fill="none" />
  <g transform={`translate(${lp(500, 1400, k)},${520 - hit * 120})`}><rect x={-14} y={-360} width={28} height={300} fill="#8a6038" /><rect x={-90} y={-70} width={180} height={130} rx={10} fill="#5a5a5a" stroke="#222" strokeWidth={5} /></g>
</Svg><Lbl tt={tt} at={1} x={960} y={140} tx="EL FONDO, FIRME" bg={INK} /><Lbl tt={tt} at={3.6} x={960} y={960} tx="FLOJO = AGUA QUIETA = BARRO" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
// 23 · al revés: la pendiente de Don Ernesto subía 3 cm hacia la salida, el agua se queda
const AlReves: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const k = W(tt, 1, 3); return <AbsoluteFill><Svg><Defs />
  <g transform={`rotate(${lp(0, -4, k)} 960 600)`}><rect x={360} y={560} width={1200} height={80} rx={40} fill={PIPE} /><rect x={380} y={590} width={lp(300, 700, W(tt, 2.4, 5))} height={44} rx={20} fill="#6a4a2a" /></g>
  <T x={1560} y={500} tx="SALIDA" size={40} col={INK} />
</Svg><Lbl tt={tt} at={0.6} x={960} y={150} tx="EL DREN DE DON ERNESTO · MORÓN" bg={INK} /><Lbl tt={tt} at={3} x={1500} y={400} tx="+3 cm AL REVÉS" bg={RED} col={INK} /><Lbl tt={tt} at={5} x={960} y={900} tx="EL AGUA SE QUEDA Y HACE BARRO" bg={AMB} /></AbsoluteFill>; }}</Stage>;
// 24 · el geotextil: el rollo se desenrolla y muestra la textura de fieltro (no tejido)
const Geotextil: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => { const k = W(tt, 0.6, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={360} y={420} width={1200 * k} height={300} fill="url(#felt)" stroke="#9aa0a6" strokeWidth={4} />
  <g transform={`translate(${360 + 1200 * k},570)`}><circle r={150 - 60 * k} fill="url(#felt)" stroke="#9aa0a6" strokeWidth={6} /><circle r={30} fill="#7a7a7a" /></g>
</Svg><Lbl tt={tt} at={1.4} x={960} y={200} tx="MANTA GEOTEXTIL" bg={AMB} size={56} /><Lbl tt={tt} at={3.2} x={700} y={860} tx="NO TEJIDA · COMO FIELTRO ✓" bg={GRN} /><Lbl tt={tt} at={4.4} x={1300} y={960} tx="TEJIDA · BOLSA DE CEBOLLA ✗" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
// 25 · el limo: sin manta las partículas finas se meten entre la piedra
const Limo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 560 + i * 800; const f = (tt * 0.3) % 1; return <g key={i}>
    <rect x={x - 300} y={300} width={600} height={560} fill="url(#soil)" /><rect x={x - 170} y={380} width={340} height={420} fill={i === 0 ? "url(#dirty)" : "url(#gravel)"} />
    {i === 1 && <rect x={x - 180} y={370} width={360} height={440} fill="none" stroke={GEO} strokeWidth={14} />}
    {Array.from({ length: 14 }, (_, j) => <circle key={j} cx={x - 280 + ((j * 37) % 100)} cy={340 + ((j * 71 + f * 300) % 480)} r={6} fill="#c9a07a" opacity={i === 0 || ((j * 37) % 100) < 100 ? 0.9 : 0} transform={i === 0 ? `translate(${lp(0, 160, (f + j / 14) % 1)},0)` : ""} />)}
    <T x={x} y={930} tx={i === 0 ? "SIN MANTA: SE TAPA" : "CON MANTA: LIMPIA"} size={44} col={i === 0 ? RED : GRN} /></g>; })}
</Svg><Lbl tt={tt} at={0.8} x={960} y={160} tx="LIMO Y ARCILLA: FINÍSIMOS" bg={INK} /></AbsoluteFill>}</Stage>;
// 26 · el filtro del café: pasa el agua, se queda la tierra (la borra)
const Cafe: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const f = (tt * 0.8) % 1; return <AbsoluteFill><Svg><Defs />
  <path d="M 700 260 L 1220 260 L 1020 620 L 900 620 Z" fill="url(#felt)" stroke="#9aa0a6" strokeWidth={6} />
  <path d="M 760 300 L 1160 300 L 1100 400 L 820 400 Z" fill="#6a4428" />
  {[0, 1, 2].map((i) => <Drop key={i} x={960} y={660 + ((f + i / 3) % 1) * 160} s={0.5} />)}
  <path d="M 800 820 L 1120 820 L 1090 960 L 830 960 Z" fill="rgba(124,196,232,.6)" stroke="#fff" strokeWidth={5} />
</Svg><Lbl tt={tt} at={1} x={1450} y={340} tx="LA TIERRA SE QUEDA" bg={INK} /><Lbl tt={tt} at={2.4} x={1450} y={880} tx="EL AGUA PASA" bg={SKY} /><Lbl tt={tt} at={4.2} x={460} y={560} tx="COMO EL FILTRO DEL CAFÉ" hand bg="transparent" col={AMB} size={40} /></AbsoluteFill>; }}</Stage>;
// 27 · el solape: la manta como cama y cerrada como sobre, uniones 30 cm como tejas
const Solape: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const k = W(tt, 0.6, 2.6); return <AbsoluteFill><Svg><Defs />
  <rect x={300} y={420} width={700} height={360} fill="url(#felt)" stroke="#888" strokeWidth={5} transform={`rotate(-4 650 600)`} />
  <rect x={lp(1300, 860, k)} y={440} width={700} height={360} fill="url(#felt)" stroke="#666" strokeWidth={5} opacity={0.95} transform={`rotate(-4 1200 600)`} />
  {k > 0.95 && <><line x1={860} y1={380} x2={1000} y2={380} stroke={AMB} strokeWidth={8} /><T x={930} y={350} tx="30 cm" size={44} col={AMB} /></>}
</Svg><Lbl tt={tt} at={2.8} x={960} y={160} tx="SE SOLAPA · COMO LAS TEJAS" bg={INK} /><Lbl tt={tt} at={4.2} x={960} y={940} tx="NUNCA A TOPE" bg={RED} col={INK} /></AbsoluteFill>; }}</Stage>;
// 28 · las manos limpias: la prueba del puñado (lavada vs con polvo)
const Manos: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 560 + i * 800, s = P(tt, 0.5 + i * 1.6); return <g key={i} transform={`translate(${x},540) scale(${s})`} opacity={cl(s * 2)}>
    <ellipse cx={0} cy={60} rx={220} ry={140} fill="#c58e64" /><ellipse cx={0} cy={20} rx={170} ry={90} fill={i === 0 ? "url(#gravel)" : "url(#dirty)"} />
    {i === 1 && Array.from({ length: 12 }, (_, j) => <circle key={j} cx={-180 + j * 32} cy={150 + (j % 3) * 10} r={10} fill="#8a6a4a" opacity={0.8} />)}
    <T x={0} y={290} tx={i === 0 ? "MANOS LIMPIAS: SIRVE" : "MANOS MARRONES: NO"} size={42} col={i === 0 ? GRN : RED} /></g>; })}
</Svg><Lbl tt={tt} at={0.4} x={960} y={140} tx="GRAVA LAVADA · 2 cm" bg={INK} /></AbsoluteFill>}</Stage>;
// 29 · el escombro: cascotes con polvo que se vuelven pasta con el agua
const Escombro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag">{(tt) => { const k = W(tt, 2.2, 4.6); return <AbsoluteFill><Svg><Defs />
  {Array.from({ length: 14 }, (_, i) => { const s = P(tt, 0.2 + i * 0.08); return <path key={i} transform={`translate(${560 + (i % 7) * 130},${500 + Math.floor(i / 7) * 130}) rotate(${i * 37}) scale(${s})`} d="M -50 -30 L 40 -40 L 60 20 L -20 50 L -60 10 Z" fill={i % 3 === 0 ? BRICK : CONC} stroke="#333" strokeWidth={4} />; })}
  <rect x={460} y={780} width={1000} height={120} rx={20} fill="#9a8a70" opacity={k} />
</Svg><Lbl tt={tt} at={0.6} x={960} y={200} tx="ESCOMBRO: NO" bg={RED} col={INK} size={56} /><Lbl tt={tt} at={3.6} x={960} y={960} tx="POLVO DE CAL Y CEMENTO = PASTA QUE TAPA" bg={INK} size={36} /></AbsoluteFill>; }}</Stage>;
// 30 · los agujeros para abajo: el nivel del agua sube como en una pileta y entra por abajo
const Agujeros: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => { const k = W(tt, 1.6, 4.4); return <AbsoluteFill><Svg><Defs />
  {[0, 1].map((i) => { const x = 600 + i * 720; return <g key={i}>
    <rect x={x - 260} y={300} width={520} height={560} fill="url(#gravel)" stroke="#222" strokeWidth={5} />
    <rect x={x - 260} y={860 - 560 * k * 0.6} width={520} height={560 * k * 0.6} fill="rgba(40,110,160,.5)" />
    <Pipe x={x} y={620} r={80} holes={i === 0 ? "down" : "up"} />
    <T x={x} y={940} tx={i === 0 ? "ABAJO: ENTRA YA" : "ARRIBA: ESPERA A LLENARSE"} size={38} col={i === 0 ? GRN : RED} /></g>; })}
</Svg><Lbl tt={tt} at={0.6} x={960} y={180} tx="EL AGUA SUBE DESDE EL FONDO" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 31 · el registro: un caño vertical con tapa, la linterna mira adentro
const Registro: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => { const lid = W(tt, 2.2, 3.2); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={500} width={1560} height={580} fill="url(#soil)" /><rect x={300} y={820} width={1300} height={120} fill="url(#gravel)" />
  <rect x={300} y={850} width={1300} height={60} rx={30} fill={PIPE} />
  <rect x={420} y={lp(900, 470, W(tt, 0.4, 1.8))} width={110} height={440} fill="#e8e8e8" stroke="#555" strokeWidth={5} />
  <rect x={400} y={440 - 60 * lid} width={150} height={34} rx={8} fill="#666" transform={`rotate(${-30 * lid} 400 460)`} />
  <path d={`M 700 300 L 520 470 L 580 500 Z`} fill="rgba(255,240,160,.5)" opacity={W(tt, 3.4, 4)} />
</Svg><Lbl tt={tt} at={1.4} x={1100} y={300} tx="LA PUERTA DE TU DREN" bg={AMB} /><Lbl tt={tt} at={4.4} x={1100} y={420} tx="1 VEZ AL AÑO · MANGUERA · 10 MIN" bg={INK} size={36} /></AbsoluteFill>; }}</Stage>;
// 32 · la lámina de nódulos: el plástico de burbujas deja aire y el agua baja al dren
const Nodulos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => { const f = (tt * 0.5) % 1; return <AbsoluteFill><Svg><Defs />
  <rect x={760} y={160} width={160} height={800} fill="url(#brick)" /><rect x={920} y={160} width={22} height={800} fill="#111" />
  {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={958} cy={190 + i * 48} rx={16} ry={20} fill="#2a2a2a" stroke="#555" strokeWidth={3} opacity={P(tt, 0.4 + i * 0.08)} />)}
  <rect x={976} y={160} width={500} height={800} fill="url(#soil)" />
  {[0, 1, 2].map((i) => <Drop key={i} x={948} y={180 + ((f + i / 3) % 1) * 760} s={0.32} />)}
</Svg><Lbl tt={tt} at={0.8} x={480} y={300} tx="ASFÁLTICO · 2 MANOS" bg={INK} /><Lbl tt={tt} at={2.4} x={1500} y={260} tx="LÁMINA DE NÓDULOS" bg={AMB} /><Lbl tt={tt} at={4} x={480} y={760} tx="EL AGUA BAJA AL DREN" bg={SKY} /></AbsoluteFill>; }}</Stage>;
// 33 · la pancita: tierra más alta pegada a la pared, la lluvia escurre hacia afuera
const Panza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => { const r = W(tt, 2, 4.6); return <AbsoluteFill><Svg><Defs />
  <rect x={1400} y={140} width={140} height={720} fill="url(#brick)" stroke="#222" strokeWidth={6} />
  <path d={`M 180 ${lp(760, 800, P(tt, 0.6))} Q 900 ${lp(760, 720, P(tt, 0.6))} 1400 ${lp(760, 640, P(tt, 0.6))} L 1400 1080 L 180 1080 Z`} fill="url(#soil)" />
  {[0, 1, 2].map((i) => <Drop key={i} x={lp(1300 - i * 60, 300, r)} y={lp(630, 780, r) - 30} s={0.55} />)}
</Svg><Lbl tt={tt} at={1.2} x={1000} y={300} tx="UNA PANCITA" hand bg="transparent" col={AMB} size={52} /><Lbl tt={tt} at={3.4} x={600} y={960} tx="LA LLUVIA SE VA LEJOS DE LA PARED" bg={INK} size={38} /></AbsoluteFill>; }}</Stage>;
// 34 · la prueba del balde: el agua entra por el registro y sale limpia en menos de un minuto
const Balde: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const f = W(tt, 1.6, 5.2); const sec = Math.round(lp(0, 45, f)); return <AbsoluteFill><Svg><Defs />
  <line x1={360} y1={700} x2={1500} y2={800} stroke={PIPE} strokeWidth={50} strokeLinecap="round" />
  <rect x={340} y={380} width={90} height={330} fill="#e8e8e8" stroke="#555" strokeWidth={5} />
  <g transform={`translate(390,${300}) rotate(${lp(0, 110, W(tt, 0.4, 1.6))})`}><Bucket x={0} y={-60} s={0.6} /></g>
  <path d={`M 1500 800 q 60 20 70 ${120 * f}`} stroke={SKY} strokeWidth={22} fill="none" strokeLinecap="round" opacity={f > 0.6 ? 1 : 0} />
  <circle cx={1300} cy={420} r={110} fill={INK} stroke="#222" strokeWidth={6} /><line x1={1300} y1={420} x2={1300 + 80 * Math.sin(f * 4.7)} y2={420 - 80 * Math.cos(f * 4.7)} stroke={RED} strokeWidth={8} strokeLinecap="round" /><T x={1300} y={590} tx={`${sec} s`} size={48} col={INK} />
</Svg><Lbl tt={tt} at={5.4} x={960} y={160} tx="SALE LIMPIA EN MENOS DE 1 MINUTO ✓" bg={GRN} /></AbsoluteFill>; }}</Stage>;
// 35 · secar: un calendario de 4 semanas, la mancha baja semana a semana
const Secar: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1, 2, 3].map((i) => { const s = P(tt, 0.4 + i * 1); return <Card key={i} x={420 + i * 360} y={540} w={300} h={420} s={s}><rect x={-150} y={-210} width={300} height={70} rx={22} fill={i === 3 ? GRN : NAVY} /><T x={0} y={-160} tx={`SEMANA ${i + 1}`} size={34} col={INK} />
    <rect x={-110} y={-100} width={220} height={260} fill="#efe6d4" /><rect x={-110} y={160 - 200 * (1 - i / 4)} width={220} height={200 * (1 - i / 4)} fill="rgba(60,50,30,.45)" /></Card>; })}
</Svg><Lbl tt={tt} at={4.6} x={960} y={140} tx="SI REVOCAS MOJADO, SE INFLA" bg={RED} col={INK} /></AbsoluteFill>}</Stage>;
// 36 · la mezcla: 1 balde de cemento, 3 de arena, el hidrófugo en el agua
const Mezcla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`scale(${P(tt, 0.3)})`} style={{ transformOrigin: "460px 600px" }}><Bucket x={460} y={600} s={0.9} fill="#bdbdb6" label="CEMENTO" /></g>
  {[0, 1, 2].map((i) => <g key={i} transform={`translate(0,0)`} opacity={cl(P(tt, 1 + i * 0.6) * 2)}><Bucket x={860 + i * 250} y={600} s={0.8} fill="#e6cf9a" label="ARENA" /></g>)}
  <g opacity={cl(P(tt, 3.2) * 2)}><rect x={1560} y={460} width={120} height={240} rx={18} fill={SKY} stroke="#2e6d8c" strokeWidth={6} /><T x={1620} y={760} tx="HIDRÓFUGO" size={30} col={INK} /></g>
</Svg><Big tt={tt} at={2.8} x={960} y={240} tx="1 : 3" size={150} /><Lbl tt={tt} at={4.2} x={960} y={920} tx="2 CAPAS · 1,5 A 2 cm · PINTURA A LAS 4 SEMANAS" bg={INK} size={34} /></AbsoluteFill>}</Stage>;
// 37 · la cuenta: tres pintadas = tres drenes pagados; el dren una sola vez
const Cuenta: C = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => <AbsoluteFill><Svg><Defs />
  {[0, 1, 2].map((i) => <Card key={i} x={380 + i * 260} y={500} w={220} h={300} s={P(tt, 0.4 + i * 0.6)} rot={-8} bg="#f2e3c6"><T x={0} y={-60} tx="PINTURA" size={30} /><T x={0} y={20} tx={`#${i + 1}`} size={64} col={RED} /><T x={0} y={100} tx="$$$" size={40} /></Card>)}
  <Card x={1440} y={500} w={420} h={300} s={P(tt, 2.8)} bg={GRN}><T x={0} y={-50} tx="DREN" size={56} /><T x={0} y={30} tx="1 SOLA VEZ" size={44} /><T x={0} y={100} tx="20 AÑOS" size={40} /></Card>
  <T x={1080} y={520} tx="=" size={140} col={INK} op={W(tt, 2.2, 2.6)} />
</Svg><Lbl tt={tt} at={4} x={960} y={900} tx="PAGÓ TRES DRENES Y NO TIENE NINGUNO" bg={AMB} /></AbsoluteFill>}</Stage>;
// 38 · cinco errores: cinco tarjetas tachadas que caen en fila
const CincoErr: C = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => { const N = ["SIN MANTA", "PENDIENTE AL REVÉS", "ESCOMBRO", "AGUJEROS ARRIBA", "PEGADO AL CIMIENTO"]; return <AbsoluteFill><Svg><Defs />
  {N.map((n, i) => { const s = P(tt, 0.4 + i * 1.6); const x = i < 3 ? 480 + i * 480 : 720 + (i - 3) * 480, y = i < 3 ? 400 : 700; return <Card key={n} x={x} y={y} w={420} h={200} s={s} rot={-8} bg={i === 4 ? "#ffd9cf" : INK}>
    <circle cx={-160} cy={-60} r={34} fill={RED} /><T x={-160} y={-46} tx={String(i + 1)} size={40} col={INK} /><T x={20} y={20} tx={n} size={n.length > 14 ? 30 : 36} />
    <line x1={-180} y1={60} x2={180} y2={60} stroke={RED} strokeWidth={8} opacity={W(tt, 1 + i * 1.6, 1.4 + i * 1.6)} /></Card>; })}
</Svg></AbsoluteFill>; }}</Stage>;
// 39 · el fin de semana: línea de tiempo sábado/domingo con las tareas
const Finde: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => { const S = [["SÁB 8:00", "TRAZAR · POZO DE PRUEBA"], ["SÁB 10:00", "CAVAR 6 m"], ["SÁB 17:00", "PENDIENTE · PISÓN"], ["DOM 8:00", "MURO · ASFÁLTICO"], ["DOM 12:00", "MANTA · NÓDULOS"], ["DOM 16:00", "CAÑO · BALDE · CERRAR"]]; return <AbsoluteFill><Svg><Defs />
  <line x1={260} y1={540} x2={lp(260, 1660, W(tt, 0.3, 6))} y2={540} stroke={AMB} strokeWidth={10} strokeLinecap="round" />
  {S.map(([a, b], i) => { const s = P(tt, 0.6 + i * 0.9); const x = 300 + i * 270, up = i % 2 === 0; return s > 0.01 && <g key={i} opacity={cl(s * 2)}><circle cx={x} cy={540} r={20 * s} fill={i < 3 ? SKY : GRN} />
    <T x={x} y={up ? 440 : 660} tx={a} size={32} col={AMB} /><T x={x} y={up ? 390 : 710} tx={b} size={24} col={INK} /></g>; })}
</Svg><Lbl tt={tt} at={0.4} x={960} y={160} tx="LA OBRA EN UN FIN DE SEMANA" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 40 · Don Lalo: libreta con su regla escrita a mano
const Lalo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => <AbsoluteFill><Svg><Defs />
  <g transform={`rotate(-3 960 540) scale(${P(tt, 0.3)})`} style={{ transformOrigin: "960px 540px" }}><rect x={480} y={240} width={960} height={600} rx={14} fill="#fbf3dc" stroke="#c9b88a" strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={520} y1={330 + i * 56} x2={1400} y2={330 + i * 56} stroke="#cfdcf0" strokeWidth={3} />)}<line x1={580} y1={250} x2={580} y2={830} stroke="#e88" strokeWidth={4} />
    <T x={620} y={320} tx="Don Lalo · 1998" size={44} hand anchor="start" col="#7a3a28" />
    <T x={620} y={480} tx="Lo que se tapa sin probar," size={54} hand anchor="start" col={NAVY} op={W(tt, 1, 2)} /><T x={620} y={570} tx="se destapa con plata." size={54} hand anchor="start" col={RED} op={W(tt, 2.6, 3.6)} /></g>
</Svg></AbsoluteFill>}</Stage>;
// 41 · la canaleta: la bajada tira el agua al pie del muro; arreglada la lleva lejos
const Canaleta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => { const fix = W(tt, 3, 4.4); const f = (tt * 0.8) % 1; return <AbsoluteFill><Svg><Defs />
  <path d="M 500 360 L 960 160 L 1420 360 Z" fill="#7a3a28" /><rect x={560} y={360} width={800} height={500} fill="#efe6d4" stroke="#222" strokeWidth={6} />
  <rect x={1360} y={340} width={60} height={30} fill="#888" /><rect x={1390} y={360} width={30} height={lp(400, 480, fix)} fill="#888" />
  <rect x={1390} y={840} width={lp(30, 260, fix)} height={30} fill="#888" />
  {[0, 1, 2].map((i) => <Drop key={i} x={lp(1405, 1640, fix)} y={lp(780, 860, fix) + ((f + i / 3) % 1) * 90} s={0.4} />)}
  <rect x={180} y={880} width={1560} height={200} fill="url(#soil)" />
</Svg><Lbl tt={tt} at={1} x={960} y={110} tx="PRIMERO LAS CANALETAS" bg={AMB} /><Lbl tt={tt} at={4.6} x={1500} y={960} tx="LEJOS DEL MURO ✓" bg={GRN} /></AbsoluteFill>; }}</Stage>;
// 42 · cuánto dura: dos barras — bien hecho 20-30 años, mal hecho 2
const Duracion: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => <AbsoluteFill><Svg><Defs />
  {[["BIEN HECHO", 30, GRN], ["MAL HECHO", 2, RED]].map(([n, v, c], i) => { const k = W(tt, 0.8 + i * 1.6, 2.6 + i * 1.6); return <g key={i}><T x={300} y={420 + i * 260} tx={n as string} size={44} col={INK} anchor="start" />
    <rect x={300} y={450 + i * 260} width={1300} height={70} rx={35} fill="rgba(255,255,255,.12)" /><rect x={300} y={450 + i * 260} width={1300 * (v as number) / 30 * k} height={70} rx={35} fill={c as string} />
    <T x={320 + 1300 * (v as number) / 30 * k} y={500 + i * 260} tx={`${Math.round((v as number) * k)} AÑOS`} size={40} col={INK} anchor="start" /></g>; })}
</Svg><Lbl tt={tt} at={4.6} x={960} y={200} tx="MANTA · GRAVA · PENDIENTE · REGISTRO" bg={INK} size={36} /></AbsoluteFill>}</Stage>;
// 43 · en ele: el dren dobla en la esquina con un registro justo en el codo
const Ele: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => { const k = W(tt, 0.6, 3); return <AbsoluteFill><Svg><Defs />
  <rect x={700} y={300} width={700} height={460} fill="#7a3a28" stroke="#222" strokeWidth={6} /><T x={1050} y={545} tx="CASA" size={50} col={INK} />
  <path d={`M 640 ${lp(240, 820, Math.min(1, k * 2))} ${k > 0.5 ? `L ${lp(640, 1460, (k - 0.5) * 2)} 820` : ""}`} stroke={PIPE} strokeWidth={40} fill="none" strokeLinecap="round" />
  {k > 0.9 && <><circle cx={640} cy={820} r={40 * P(tt, 3)} fill="#e8e8e8" stroke="#555" strokeWidth={6} /><circle cx={640} cy={240} r={36} fill="#e8e8e8" stroke="#555" strokeWidth={6} /></>}
</Svg><Lbl tt={tt} at={3.2} x={460} y={940} tx="REGISTRO EN LA ESQUINA" bg={AMB} /><Lbl tt={tt} at={1.4} x={1300} y={180} tx="UN SOLO DREN EN ELE" bg={INK} /></AbsoluteFill>; }}</Stage>;
// 44 · las raíces: encima del dren pasto y flores chicas sí, árbol no (la raíz busca el caño)
const Raices: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => { const k = W(tt, 2, 4.6); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={420} width={1560} height={660} fill="url(#soil)" /><rect x={300} y={780} width={1300} height={60} rx={30} fill={PIPE} />
  {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M ${320 + i * 30} 420 l -6 -30`} stroke="#6fae45" strokeWidth={6} />)}
  <rect x={1290} y={160} width={40} height={260} fill="#6a4420" /><circle cx={1310} cy={170} r={140} fill="#4f9a3c" />
  {[-1, 0, 1].map((d) => <path key={d} d={`M 1310 420 C ${1310 + d * 60} 560, ${1310 + d * 120} 680, ${lp(1310 + d * 160, 1200 + d * 90, k)} ${lp(700, 800, k)}`} stroke="#d8c3a0" strokeWidth={10} fill="none" />)}
</Svg><Lbl tt={tt} at={0.8} x={600} y={300} tx="PASTO Y FLORES: SÍ ✓" bg={GRN} /><Lbl tt={tt} at={3.6} x={1300} y={960} tx="ÁRBOL: LA RAÍZ ENTRA AL CAÑO ✗" bg={RED} col={INK} size={36} /></AbsoluteFill>; }}</Stage>;
// 45 · repaso: el corte completo del dren se arma capa por capa con sus 10 números
const Repaso: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => { const st = (i: number) => P(tt, 0.6 + i * 2.1, 8); return <AbsoluteFill><Svg><Defs />
  <rect x={180} y={360} width={1560} height={720} fill="url(#soil)" />
  <rect x={1100} y={60} width={130} height={760} fill="url(#brick)" stroke="#222" strokeWidth={6} /><rect x={1060} y={820} width={210} height={70} fill="url(#conc)" />
  <rect x={1230} y={360} width={22} height={460} fill="#111" opacity={st(8)} />
  <path d={`M 780 360 L 780 ${lp(360, 760, st(2))} L 1060 ${lp(360, 780, st(3))} L 1060 360`} fill="#24160b" />
  <path d="M 790 370 L 790 770 L 1050 790 L 1050 370" stroke={GEO} strokeWidth={16} fill="none" opacity={st(4)} />
  <rect x={800} y={lp(780, 420, st(5))} width={240} height={lp(0, 360, st(5))} fill="url(#gravel)" />
  <g opacity={st(6)}><Pipe x={920} y={710} r={50} /></g>
  <rect x={1290} y={260} width={70} height={560} fill="#e8e8e8" stroke="#555" strokeWidth={5} opacity={st(7)} />
  <path d="M 780 370 Q 920 330 1060 370" stroke={GEO} strokeWidth={16} fill="none" opacity={st(9)} />
  {Array.from({ length: 10 }, (_, i) => { const s = st(i); const [x, y] = [[440, 200], [440, 300], [700, 560], [920, 840], [740, 420], [920, 500], [920, 640], [1480, 300], [1500, 560], [920, 290]][i]; return s > 0.01 && <g key={i} transform={`translate(${x},${y}) scale(${s})`}><circle r={34} fill={AMB} stroke="#222" strokeWidth={4} /><T x={0} y={14} tx={String(i + 1)} size={38} /></g>; })}
</Svg><Lbl tt={tt} at={0.6} x={520} y={110} tx="LAS 10 PIEZAS" bg={INK} /></AbsoluteFill>; }}</Stage>;

export const MAP: Record<string, C> = {
  tresmanos: TresManos, salitre: Salitre, corte: Corte, dosanos: DosAnos, diezpiezas: DiezPiezas, treintaycinco: TreintaYCinco, aviso: Aviso,
  desnivel: Desnivel, esponja: Esponja, treslugares: TresLugares, nailon: Nailon, gotitas: Gotitas, dospreguntas: DosPreguntas, largo: Largo,
  salida: Salida, canos: Canos, medidas: Medidas, descalzar: Descalzar, angulo: Angulo, pozoprueba: PozoPrueba, uncm: UnCm, pison: Pison,
  alreves: AlReves, geotextil: Geotextil, limo: Limo, cafe: Cafe, solape: Solape, manos: Manos, escombro: Escombro, agujeros: Agujeros,
  registro: Registro, nodulos: Nodulos, panza: Panza, balde: Balde, secar: Secar, mezcla: Mezcla, cuenta: Cuenta, cincoerr: CincoErr,
  finde: Finde, lalo: Lalo, canaleta: Canaleta, duracion: Duracion, ele: Ele, raices: Raices, repaso: Repaso,
};
