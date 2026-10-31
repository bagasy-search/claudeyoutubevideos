// so29c · componentes únicos (uno por minuto, ninguno se repite en la tanda ssl29). Cada uno = lo que Sachiko dice en ese
// segundo, dibujado en código: un objeto que se entiende sin leer, con física (resorte con peso) y la palabra DENTRO de la escena.
// Sin rótulo arriba a la izquierda (29-oct). Figuras = pictogramas de trazo grueso color crema que se mueven entre poses.
import React from "react";
import { Img } from "remotion";
import { AMB, GRN, H, HAND, ICE, RED, Stage, TX, Tag, cl, eio, img, phys } from "./hkit";

const it = (h: H, i: number, d = 99) => h.items?.[i]?.at ?? d;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const CREAM = "#f3e6cf", INK = "#2a2420", TAT = "#c9c08a", WOOD = "#8a5a34";

// ---------------- la figura (pictograma) ----------------
type Pt = [number, number];
type Pose = { h: Pt; n: Pt; p: Pt; k: Pt; f: Pt; k2: Pt; f2: Pt; a: Pt; a2: Pt };
export const PO: Record<string, Pose> = {
  stand: { h: [0, -330], n: [0, -288], p: [0, -170], k: [6, -86], f: [12, 0], k2: [-6, -86], f2: [-12, 0], a: [16, -175], a2: [-14, -178] },
  seiza: { h: [0, -244], n: [-4, -202], p: [-22, -72], k: [62, -16], f: [-46, -6], k2: [58, -14], f2: [-50, -4], a: [52, -96], a2: [46, -100] },
  gentle: { h: [24, -284], n: [12, -242], p: [-10, -122], k: [72, -82], f: [78, 0], k2: [-40, -6], f2: [-122, 0], a: [72, -92], a2: [62, -98] },
  lean: { h: [86, -262], n: [54, -228], p: [-28, -132], k: [62, -78], f: [72, 0], k2: [-30, -10], f2: [-112, 0], a: [96, -150], a2: [86, -160] },
  side: { h: [-168, -42], n: [-122, -38], p: [0, -32], k: [72, -32], f: [142, -20], k2: [70, -22], f2: [140, -10], a: [-80, -10], a2: [-60, -22] },
  four: { h: [104, -142], n: [62, -122], p: [-62, -112], k: [-62, -10], f: [-152, 0], k2: [-52, -10], f2: [-142, 0], a: [62, -4], a2: [72, -4] },
  cross: { h: [0, -246], n: [0, -204], p: [0, -62], k: [82, -40], f: [-30, -10], k2: [-82, -40], f2: [30, -10], a: [62, -72], a2: [-62, -72] },
  squat: { h: [52, -226], n: [22, -190], p: [-42, -82], k: [52, -92], f: [32, 0], k2: [46, -90], f2: [22, 0], a: [92, -20], a2: [86, -30] },
  sideSit: { h: [-10, -236], n: [-8, -194], p: [-20, -58], k: [70, -22], f: [-10, -8], k2: [60, -14], f2: [-20, -4], a: [-90, -10], a2: [50, -60] },
  reach: { h: [0, -330], n: [0, -288], p: [0, -170], k: [6, -86], f: [12, 0], k2: [-6, -86], f2: [-12, 0], a: [40, -420], a2: [-14, -178] },
};
const mixP = (A: Pose, B: Pose, k: number): Pose => { const o = {} as Pose; (Object.keys(A) as (keyof Pose)[]).forEach((j) => { o[j] = [lerp(A[j][0], B[j][0], k), lerp(A[j][1], B[j][1], k)]; }); return o; };
const Fig: React.FC<{ x: number; y: number; po: Pose; s?: number; col?: string; rot?: number; op?: number; flip?: boolean }> = ({ x, y, po, s = 1, col = CREAM, rot = 0, op = 1, flip = false }) => {
  const L = (a: Pt, b: Pt, w: number) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={w} strokeLinecap="round" />;
  return <svg width={800} height={800} viewBox="-400 -600 800 800" style={{ position: "absolute", left: x - 400 * s, top: y - 600 * s, width: 800 * s, height: 800 * s, overflow: "visible", opacity: op, transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: "50% 75%", filter: "drop-shadow(0 18px 24px rgba(0,0,0,.45))" }}>
    {L(po.p, po.k2, 24)}{L(po.k2, po.f2, 22)}{L(po.n, po.a2, 17)}
    {L(po.n, po.p, 30)}{L(po.p, po.k, 26)}{L(po.k, po.f, 24)}{L(po.n, po.a, 18)}
    <circle cx={po.h[0]} cy={po.h[1]} r={30} fill={col} />
    {/* el moño de pelo gris rizado (Sachiko) */}
    <circle cx={po.h[0] - 10} cy={po.h[1] - 24} r={14} fill={col} />
  </svg>;
};
// piso de tatami en perspectiva (bandas) donde apoyan las figuras
const Floor: React.FC<{ y?: number; op?: number }> = ({ y = 820, op = 1 }) => <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 1080 - y, opacity: op, background: `repeating-linear-gradient(90deg, rgba(201,192,138,.16) 0 3px, transparent 3px 9px), linear-gradient(180deg, rgba(201,192,138,.42), rgba(120,110,60,.12))`, borderTop: "4px solid #1f2a40" }} />;
const Check = ({ x, y, s, p, col = GRN }: { x: number; y: number; s: number; p: number; col?: string }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <circle cx={s / 2} cy={s / 2} r={s * 0.44} fill={`${col}22`} stroke={col} strokeWidth={s * 0.07} strokeDasharray={s * 2.8} strokeDashoffset={s * 2.8 * (1 - cl(p * 1.5))} />
  <path d={`M${s * 0.28} ${s * 0.52} L${s * 0.45} ${s * 0.68} L${s * 0.74} ${s * 0.34}`} stroke={col} strokeWidth={s * 0.09} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 1.5 - 0.5))} />
</svg>;
const Cross = ({ x, y, s, p, col = RED }: { x: number; y: number; s: number; p: number; col?: string }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <path d={`M${s * 0.2} ${s * 0.2} L${s * 0.8} ${s * 0.8} M${s * 0.8} ${s * 0.2} L${s * 0.2} ${s * 0.8}`} stroke={col} strokeWidth={s * 0.11} fill="none" strokeLinecap="round" strokeDasharray={s * 1.8} strokeDashoffset={s * 1.8 * (1 - cl(p))} />
</svg>;
const Hand = ({ x, y, s = 1, fingers = 5, op = 1, col = CREAM }: { x: number; y: number; s?: number; fingers?: number; op?: number; col?: string }) => <svg width={220} height={240} viewBox="0 0 220 240" style={{ position: "absolute", left: x - 110 * s, top: y - 120 * s, width: 220 * s, height: 240 * s, opacity: op }}>
  {fingers >= 5 && <ellipse cx={110} cy={160} rx={62} ry={70} fill={col} />}
  {[[40, 70, -24], [78, 40, -8], [116, 34, 4], [152, 48, 16], [186, 120, 52]].map(([cx, cy, r], i) => (fingers >= 5 || (fingers >= 2 && (i === 1 || i === 2) && i < fingers + 1) || (fingers === 1 && i === 2)) &&
    <rect key={i} x={cx - 15} y={cy - 40} width={30} height={92} rx={15} fill={col} transform={`rotate(${r} ${cx} ${cy + 40})`} />)}
</svg>;

// ---- 0:04 · LOS LENTES bajo el sillón: se deslizan al hueco oscuro, la rodilla dice NO, el brazo del sillón queda lejos ----
export const HGlasses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const sl = phys(tt, 0.4, 3.2, 0.75), no = phys(tt, it(h, 0), 7, 0.4), far = cl((tt - Math.min(it(h, 1), 6.2)) / 1.2);
  return <>
    <Floor y={760} />
    {/* el sillón de costado: almohadón, respaldo, brazo y el hueco negro de abajo */}
    <div style={{ position: "absolute", left: 980, top: 420, width: 760, height: 250, borderRadius: 50, background: "linear-gradient(180deg,#8f7a63,#6b5a48)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1500, top: 250, width: 240, height: 430, borderRadius: 60, background: "linear-gradient(180deg,#9a8570,#6b5a48)" }} />
    <div style={{ position: "absolute", left: 980, top: 300, width: 160, height: 380, borderRadius: 60, background: "linear-gradient(180deg,#a38e78,#75634f)", boxShadow: far > 0 ? `0 0 ${50 * far}px ${AMB}` : "none" }} />
    <div style={{ position: "absolute", left: 1000, top: 668, width: 720, height: 92, background: "radial-gradient(ellipse 60% 80% at 50% 0%, #000, #0b0907 80%)" }} />
    {[1010, 1690].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 668, width: 22, height: 92, background: "#3a2a1c" }} />)}
    {/* los lentes: se deslizan desde el centro y se meten en lo oscuro */}
    <svg width={220} height={80} style={{ position: "absolute", left: lerp(560, 1180, sl), top: 712, transform: `rotate(${(1 - sl) * -14}deg)`, filter: `brightness(${1 - 0.55 * cl((sl - 0.7) * 3)})` }}>
      <circle cx={55} cy={40} r={34} fill="rgba(200,230,255,.25)" stroke="#d9b25a" strokeWidth={6} /><circle cx={165} cy={40} r={34} fill="rgba(200,230,255,.25)" stroke="#d9b25a" strokeWidth={6} />
      <path d="M89 36 Q110 22 131 36" stroke="#d9b25a" strokeWidth={6} fill="none" />
    </svg>
    {/* ella, de rodillas en la alfombra, y la rodilla que dice NO */}
    <Fig x={520} y={760} po={PO.four} s={1.15} />
    {no > 0.01 && <div style={{ position: "absolute", left: 420, top: 690, width: 120, height: 120, borderRadius: "50%", border: `8px solid ${RED}`, opacity: cl(no), transform: `scale(${0.6 + 0.4 * no})`, boxShadow: `0 0 40px ${RED}88` }} />}
    <Tag tt={tt} at={it(h, 0) + 0.2} x={480} y={600} txt="NO" col={RED} size={84} />
    {/* la distancia hasta el brazo del sillón */}
    {far > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M640 640 Q820 420 1010 360" stroke={AMB} strokeWidth={7} fill="none" strokeDasharray="18 16" strokeDashoffset={-tt * 40} opacity={far} /></svg>}
    <Tag tt={tt} at={Math.min(it(h, 1), 6.2) + 0.5} x={800} y={390} txt="TOO FAR" col={AMB} size={56} />
  </>; }}</Stage>;

// ---- 0:41 · UN DÍA EN EL PISO: la estera en el centro y lo que su madre hacía sobre ella (comer, té, ropa, levantarse) hasta los 101 ----
export const HFloorDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const mat = phys(tt, 0.1, 5, 0.6);
  const ICO = [{ a: 0.4, x: 560, y: 330, l: "ATE", d: <><div style={{ width: 150, height: 74, borderRadius: "0 0 75px 75px", background: "#f4f0e6" }} /><div style={{ position: "absolute", top: -12, left: 14, width: 122, height: 26, borderRadius: "50%", background: "#fff" }} /></> },
    { a: it(h, 0), x: 1360, y: 330, l: "TEA", d: <><div style={{ width: 110, height: 110, borderRadius: "16px 16px 46px 46px", background: "#6f8a5a" }} /><div style={{ position: "absolute", top: -50, left: 40, width: 10, height: 40, borderRadius: 5, background: "rgba(255,255,255,.4)" }} /></> },
    { a: it(h, 1), x: 560, y: 760, l: "LAUNDRY", d: <>{[0, 1, 2].map((i) => <div key={i} style={{ width: 170 - i * 12, height: 30, marginTop: 4, marginLeft: i * 6, borderRadius: 8, background: ["#e8e2d4", "#b8cde0", "#e8d4c4"][i] }} />)}</> },
    { a: it(h, 2), x: 1360, y: 760, l: "GOT UP", d: <svg width={120} height={140}><path d="M60 130 L60 20 M20 60 L60 18 L100 60" stroke={GRN} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> }];
  return <>
    <div style={{ position: "absolute", left: 960, top: 545, width: 560, height: 300, transform: `translate(-50%,-50%) perspective(900px) rotateX(48deg) scale(${0.6 + 0.4 * mat})`, opacity: cl(mat * 2), borderRadius: 6,
      background: `repeating-linear-gradient(0deg, #d6cd96 0 4px, #c4ba80 4px 8px)`, border: "12px solid #1f2a40", boxShadow: "0 60px 90px rgba(0,0,0,.6)" }} />
    {ICO.map((c, i) => { const s = phys(tt, c.a, 7, 0.45); if (s <= 0.01) return null;
      return <React.Fragment key={i}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={960} y1={545} x2={c.x} y2={c.y} stroke={AMB} strokeWidth={4} strokeDasharray={600} strokeDashoffset={600 * (1 - cl(s))} opacity={0.6} /></svg>
        <div style={{ position: "absolute", left: c.x, top: c.y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -60}px) scale(${0.7 + 0.3 * s})`, opacity: cl(s * 2) }}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}><div style={{ position: "relative" }}>{c.d}</div>
            <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: 4, color: i === 3 ? GRN : TX }}>{c.l}</div></div>
        </div>
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 960, top: 545, transform: "translate(-50%,-50%)", textAlign: "center", opacity: cl(phys(tt, 1.0, 6, 0.6)) }}>
      <div style={{ fontWeight: 900, fontSize: 130, color: AMB, lineHeight: 1, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>101</div>
      <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 8, color: TX }}>YEARS ON THE FLOOR</div>
    </div>
  </>; }}</Stage>;

// ---- 1:01 · EL HÁBITO: un timer de cocina gira 10 minutos y adentro la figura baja y sube, baja y sube ----
export const HTenMin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const run = eio(tt, it(h, 0) - 0.3, it(h, 0) + 2.6), bob = tt > it(h, 1) ? (Math.sin((tt - it(h, 1)) * 2.4) + 1) / 2 : 0;
  const R = 300, ang = run * 2 * Math.PI * (10 / 60);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <circle cx={960} cy={520} r={R + 26} fill="#efe8d8" stroke="#cfc4ac" strokeWidth={10} />
      <path d={`M960 520 L960 ${520 - R} A${R} ${R} 0 0 1 ${960 + R * Math.sin(ang)} ${520 - R * Math.cos(ang)} Z`} fill={`${RED}55`} />
      {Array.from({ length: 60 }, (_, i) => { const a = i / 60 * Math.PI * 2, r0 = i % 5 ? R - 18 : R - 36; return <line key={i} x1={960 + Math.sin(a) * r0} y1={520 - Math.cos(a) * r0} x2={960 + Math.sin(a) * R} y2={520 - Math.cos(a) * R} stroke="#333" strokeWidth={i % 5 ? 3 : 6} />; })}
      {[0, 10, 20, 30, 40, 50].map((m) => { const a = m / 60 * Math.PI * 2; return <text key={m} x={960 + Math.sin(a) * (R - 80)} y={520 - Math.cos(a) * (R - 80) + 14} fontSize={40} fontWeight={800} fill="#333" textAnchor="middle" fontFamily="sans-serif">{m}</text>; })}
      <polygon points={`960,${520 - R - 40} 945,${520 - R - 8} 975,${520 - R - 8}`} fill={RED} />
    </svg>
    <Fig x={960} y={690} po={mixP(PO.stand, PO.seiza, bob)} s={0.82} col="#3a2f28" />
    <Tag tt={tt} at={it(h, 0)} x={960} y={930} txt="10 MINUTES A DAY" col={AMB} size={60} />
  </>; }}</Stage>;

// ---- 1:13 · NUEVE COSAS: nueve esteras de tatami en escalera; la novena se ilumina celeste (sin manos) ----
export const HNineSteps: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const nine = phys(tt, it(h, 0), 5, 0.5);
  return <>
    {Array.from({ length: 9 }, (_, i) => { const s = phys(tt, 0.3 + i * 0.28, 7, 0.45); if (s <= 0.01) return null; const x = 230 + i * 175, y = 820 - i * 62, last = i === 8;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 160, height: 90, transform: `translateY(${(1 - s) * -200}px) perspective(600px) rotateX(55deg)`, opacity: cl(s * 2), borderRadius: 4,
        background: `repeating-linear-gradient(0deg, #d6cd96 0 4px, #c4ba80 4px 8px)`, border: `6px solid ${last && nine > 0.1 ? ICE : "#1f2a40"}`, boxShadow: last ? `0 0 ${70 * nine}px ${ICE}` : "0 20px 30px rgba(0,0,0,.5)" }}>
      </div>; })}
    {Array.from({ length: 9 }, (_, i) => { const s = phys(tt, 0.3 + i * 0.28, 7, 0.45); if (s <= 0.01) return null; const last = i === 8;
      return <div key={"n" + i} style={{ position: "absolute", left: 230 + i * 175, width: 160, top: 820 - i * 62 - 100 + (1 - s) * -200, textAlign: "center", fontWeight: 900, fontSize: 70, opacity: cl(s * 2), color: last && nine > 0.1 ? ICE : TX, textShadow: "0 8px 20px rgba(0,0,0,.7)" }}>{i + 1}</div>; })}
    <Fig x={1680} y={330} po={PO.stand} s={0.5} op={cl(nine)} />
    <Tag tt={tt} at={it(h, 0) + 0.4} x={1500} y={170} txt="NO HANDS" col={ICE} size={64} />
  </>; }}</Stage>;

// ---- 1:32 · NO SOY MÉDICO: el estetoscopio se tacha; el delantal a cuadros de la abuela se ilumina ----
export const HApron: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const a = phys(tt, 0.2, 5, 0.55), x1 = cl((tt - 0.9) / 0.6), b = phys(tt, it(h, 0), 5, 0.55);
  return <>
    <div style={{ position: "absolute", left: 560, top: 520, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * a})`, opacity: cl(a * 2) * (1 - 0.5 * x1) }}>
      <svg width={360} height={420}><path d="M100 40 L100 180 Q100 280 190 280 Q280 280 280 180 L280 40" stroke="#c9ccd2" strokeWidth={22} fill="none" strokeLinecap="round" /><path d="M190 280 L190 330" stroke="#c9ccd2" strokeWidth={18} /><circle cx={190} cy={366} r={44} fill="#9aa0a8" stroke="#dfe3e8" strokeWidth={10} /></svg>
    </div>
    <Cross x={560} y={520} s={420} p={x1} />
    <div style={{ position: "absolute", left: 1360, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - b) * 120}px) rotate(${(1 - b) * 8}deg)`, opacity: cl(b * 2) }}>
      <div style={{ width: 300, height: 380, borderRadius: "40px 40px 30px 30px", background: "repeating-linear-gradient(0deg, rgba(200,40,40,.85) 0 22px, transparent 22px 44px), repeating-linear-gradient(90deg, rgba(200,40,40,.85) 0 22px, #fff 22px 44px)", boxShadow: `0 40px 80px rgba(0,0,0,.6), 0 0 ${60 * b}px ${AMB}55` }} />
      <div style={{ position: "absolute", left: 40, top: -70, width: 220, height: 80, borderRadius: "60px 60px 0 0", border: "14px solid rgba(200,40,40,.9)", borderBottom: "none" }} />
    </div>
    <Tag tt={tt} at={0.9} x={560} y={880} txt="NOT A DOCTOR" col={RED} size={52} />
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1360} y={880} txt="A GRANDMOTHER" col={AMB} size={52} />
  </>; }}</Stage>;

// ---- 2:24 · LA SILLA EN EL RINCÓN: plano desde arriba; la familia alrededor del chabudai y la tía Fumi sola en la silla ----
export const HCornerChair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const room = phys(tt, 0.1, 4, 0.7), ch = phys(tt, it(h, 0) - 0.2, 6, 0.5), fam = it(h, 1);
  return <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${38 - 6 * eio(tt, 0, 8)}deg) rotateZ(${-6 + 4 * eio(tt, 0, 8)}deg) scale(${0.85 + 0.15 * room})`, width: 1200, height: 760 }}>
    {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % 3) * 400, top: Math.floor(i / 3) * 380, width: 400, height: 380, background: "repeating-linear-gradient(90deg, #d6cd96 0 4px, #c4ba80 4px 8px)", border: "8px solid #1f2a40", boxSizing: "border-box" }} />)}
    {/* el chabudai y los almohadones de la familia */}
    <div style={{ position: "absolute", left: 470, top: 250, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #a06a3c, #6a4222)", boxShadow: "0 20px 30px rgba(0,0,0,.45)" }} />
    {[[600, 175], [600, 585], [395, 380], [805, 380]].map(([x, y], i) => { const s = phys(tt, fam + i * 0.18, 7, 0.45); return <div key={i} style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 18, background: "#3b4f7a", opacity: cl(s * 2), transform: `scale(${s})`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 30, top: 30, width: 60, height: 60, borderRadius: "50%", background: CREAM }} /></div>; })}
    {/* la silla en el rincón, con la distancia punteada hasta la mesa */}
    <div style={{ position: "absolute", left: 1040, top: 590, width: 120, height: 120, borderRadius: 10, background: WOOD, border: "10px solid #5a3820", transform: `scale(${ch})`, boxShadow: `0 0 ${50 * cl(ch)}px ${AMB}` }} />
    <svg width={1200} height={760} style={{ position: "absolute", inset: 0 }}><line x1={1040} y1={640} x2={740} y2={460} stroke={AMB} strokeWidth={6} strokeDasharray="16 14" opacity={cl(ch)} /></svg>
    <div style={{ position: "absolute", left: 1100, top: 540, fontFamily: HAND, fontWeight: 700, fontSize: 110, color: AMB, opacity: cl(ch * 2), whiteSpace: "nowrap", textShadow: "0 6px 20px rgba(0,0,0,.8)", transform: "translate(-50%,-100%) rotateX(-38deg)" }}>Aunt Fumi</div>
  </div>; }}</Stage>;

// ---- 2:53 · 15 CENTÍMETROS: el zabuton se dobla, otro encima, y la regla crece hasta 15 cm; abajo, el piso tachado ----
export const HCushHeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const fold = eio(tt, 0.2, 1.0), top = phys(tt, 1.1, 6, 0.5), rule = eio(tt, 1.6, 2.6), dn = it(h, 0), no = cl((tt - it(h, 1)) / 0.6);
  const bob = tt > dn ? (Math.sin((tt - dn) * 2.2 - 1.5) + 1) / 2 : 0;
  return <>
    <Floor y={800} />
    <div style={{ position: "absolute", left: 760, top: 800 - 70, width: 420, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#4a5f8a,#2f3f62)", transform: `scaleX(${1 - 0.0 * fold})`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 760, top: 800 - 70, width: 420, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#5b72a0,#3b4f7a)", transformOrigin: "100% 100%", transform: `rotate(${-180 * (1 - fold)}deg) translateY(${-70 * fold}px)` }} />
    {top > 0.01 && <div style={{ position: "absolute", left: 760, top: 800 - 210 - (1 - top) * 200, width: 420, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#ffd9c8,#e8b8a0)", opacity: cl(top * 2), boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />}
    {/* la regla amarilla */}
    <div style={{ position: "absolute", left: 1230, top: 800 - 300 * rule, width: 60, height: 300 * rule, background: "#f2c94c", borderRadius: 6, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, bottom: i * 20, width: i % 5 ? 18 : 34, height: 3, background: "#222" }} />)}
    </div>
    <Tag tt={tt} at={2.4} x={1420} y={520} txt="15 CM" col={AMB} size={84} />
    <Fig x={560} y={800} po={mixP(PO.stand, PO.seiza, bob)} s={0.85} op={cl((tt - dn + 0.4) * 2)} />
    {no > 0 && <><div style={{ position: "absolute", left: 120, right: 120, top: 830, height: 8, background: RED, opacity: no * 0.8, transform: `scaleX(${no})` }} /></>}
    <Tag tt={tt} at={it(h, 1) + 0.3} x={960} y={930} txt="NOT FROM THE FLOOR" col={RED} size={50} />
  </>; }}</Stage>;

// ---- 3:30 · EL CALENDARIO DE FUMI: hojas que caen (mes 1: dos almohadones · mes 2: uno · primavera: el tatami y pétalos) ----
export const HSpringCal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 40%, #3a2a30, #0b0809 78%)">{(tt) => {
  const P = [{ a: 0.2, l: "MONTH 1", n: 2 }, { a: it(h, 0), l: "MONTH 2", n: 1 }, { a: it(h, 1), l: "SPRING", n: 0 }];
  const cur = P.filter((p) => tt > p.a).length - 1;
  return <>
    {P.map((p, i) => { const s = phys(tt, p.a, 5, 0.6), off = i < cur ? phys(tt, P[i + 1].a, 4, 0.7) : 0; if (s <= 0.01 || off > 0.98) return null;
      return <div key={i} style={{ position: "absolute", left: 960, top: 520, width: 620, height: 640, transform: `translate(-50%,-50%) perspective(1600px) rotateX(${(1 - s) * -60 + off * 100}deg) translateY(${off * 300}px)`, transformOrigin: "50% 0%", opacity: 1 - off,
        background: "#fbf7ee", borderRadius: 16, boxShadow: "0 50px 90px rgba(0,0,0,.6)", overflow: "hidden", zIndex: i }}>
        <div style={{ height: 120, background: i === 2 ? "#e98aa0" : "#c0392b", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.l}</div>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 70, height: 160, background: "repeating-linear-gradient(90deg, #d6cd96 0 4px, #c4ba80 4px 8px)", border: "8px solid #1f2a40", borderRadius: 6 }} />
        {Array.from({ length: p.n }, (_, k) => <div key={k} style={{ position: "absolute", left: 190, width: 240, bottom: 230 + k * 62, height: 62, borderRadius: 26, background: k ? "#ffd9c8" : "#3b4f7a", boxShadow: "0 10px 20px rgba(0,0,0,.25)" }} />)}
        {p.n === 0 && <div style={{ position: "absolute", left: 160, width: 300, bottom: 230, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: "#c0392b" }}>on the floor!</div>}
      </div>; })}
    {/* pétalos de sakura en la primavera */}
    {tt > it(h, 1) && Array.from({ length: 22 }, (_, i) => { const k = (tt - it(h, 1)) * (0.25 + (i % 5) * 0.04) + i * 0.13; const y = -40 + (k % 1.2) * 1000, x = 200 + (i * 173) % 1520 + 60 * Math.sin(k * 6 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 16, borderRadius: "60% 0", background: "#f6b6c8", transform: `rotate(${k * 300 + i * 40}deg)`, opacity: 0.9 }} />; })}
  </>; }}</Stage>;

// ---- 4:00 · SEIZA de perfil: sentada sobre los talones, el empeine plano; resaltado el pliegue del tobillo; la ceremonia del té ----
export const HSeizaLeg: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.3, 2.0), ank = cl((tt - 2.4) / 0.8), cer = phys(tt, it(h, 0), 6, 0.5);
  return <>
    <Floor y={760} />
    <Fig x={820} y={760} po={mixP(PO.stand, PO.seiza, k)} s={1.5} />
    {ank > 0 && <div style={{ position: "absolute", left: 690 - 70, top: 740 - 60, width: 140, height: 120, borderRadius: "50%", border: `8px solid ${AMB}`, opacity: ank, transform: `scale(${0.6 + 0.4 * ank})`, boxShadow: `0 0 40px ${AMB}` }} />}
    <Tag tt={tt} at={2.7} x={640} y={880} txt="FEET FLAT, TOPS DOWN" col={AMB} size={42} />
    {/* el cuenco de té (ceremonia) que entra al costado */}
    <div style={{ position: "absolute", left: 1400, top: 640, transform: `translateY(${(1 - cer) * 200}px)`, opacity: cl(cer * 2) }}>
      <div style={{ width: 220, height: 110, borderRadius: "0 0 110px 110px", background: "linear-gradient(180deg,#3a2a22,#1a120e)", boxShadow: `inset 0 14px 0 #7fae5a, 0 30px 60px rgba(0,0,0,.6)` }} />
      <svg width={200} height={60} style={{ position: "absolute", left: 10, top: 120 }}><path d="M20 40 L180 40" stroke={WOOD} strokeWidth={10} strokeLinecap="round" /></svg>
    </div>
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1510} y={540} txt="TEA CEREMONY" col={TX} size={40} />
  </>; }}</Stage>;

// ---- 4:18 · ENROLLADA COMO SUSHI: la toalla se enrolla (espiral) y se mete bajo el tobillo ----
export const HSushiRoll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #2c3a33, #070909 76%)">{(tt) => {
  const r = eio(tt, 0.5, 3.0), mv = eio(tt, it(h, 0) - 0.4, it(h, 0) + 1.2);
  const W0 = 900, w = W0 * (1 - r), rad = 30 + 70 * Math.sqrt(r);
  return <>
    <Floor y={780} />
    {/* la toalla plana que se va enrollando de izquierda a derecha */}
    <div style={{ position: "absolute", left: 510 + W0 - w, top: 760, width: w, height: 22, borderRadius: 6, background: "repeating-linear-gradient(90deg, #f6f3ec 0 10px, #e6e0d2 10px 14px)", opacity: 1 - mv, boxShadow: "0 8px 16px rgba(0,0,0,.35)" }} />
    <svg width={260} height={260} style={{ position: "absolute", left: lerp(510 + W0 - w - rad, 1220, mv) - 130 + rad, top: 782 - rad - 130 + 0 * mv, overflow: "visible" }}>
      <g transform={`translate(130 130) rotate(${r * 720})`}>
        <circle r={rad} fill="#f6f3ec" stroke="#d9d2c0" strokeWidth={4} />
        <path d={Array.from({ length: 40 }, (_, i) => { const a = i * 0.45, rr = rad * (i / 40); return `${i ? "L" : "M"}${Math.cos(a) * rr} ${Math.sin(a) * rr}`; }).join(" ")} stroke="#c9c0aa" strokeWidth={4} fill="none" />
      </g>
    </svg>
    {/* la pierna en seiza que se apoya: el tobillo sobre el rollo */}
    <div style={{ opacity: cl(mv * 2) }}><Fig x={1240} y={780 - 40 * mv} po={PO.seiza} s={1.25} /></div>
    <Tag tt={tt} at={1.2} x={960} y={300} txt="LIKE A SUSHI ROLL" col={AMB} size={58} />
    <Tag tt={tt} at={it(h, 0) + 0.8} x={1240} y={940} txt="UNDER THE ANKLES" col={GRN} size={46} />
  </>; }}</Stage>;

// ---- 4:49 · 60 SEGUNDOS, NO 5 NI 10 MINUTOS: tres barras de tiempo; la de 60 s se llena verde, las otras se tachan ----
export const HTimer60: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const R = [{ l: "60 SECONDS", f: 1 / 10, a: 0.2, ok: true }, { l: "5 MINUTES", f: 5 / 10, a: 1.2, ok: false }, { l: "10 MINUTES", f: 1, a: it(h, 0), ok: false }];
  return <>
    {R.map((r, i) => { const s = phys(tt, r.a, 6, 0.6), fill = eio(tt, r.a + 0.2, r.a + 1.4), y = 300 + i * 190;
      return <div key={i} style={{ position: "absolute", left: 300, top: y, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -80}px)` }}>
        <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 3, color: r.ok ? GRN : TX, marginBottom: 12 }}>{r.l}</div>
        <div style={{ width: 1320, height: 64, borderRadius: 32, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><div style={{ width: `${r.f * 100 * fill}%`, height: "100%", borderRadius: 32, background: r.ok ? `linear-gradient(90deg, ${GRN}, #3fbf7a)` : "linear-gradient(90deg,#ff7a6a,#c62a1e)" }} /></div>
        {!r.ok && <div style={{ position: "absolute", left: 1320 * r.f + 40, top: 30 }}><Cross x={0} y={40} s={110} p={cl((tt - r.a - 1.4) / 0.4)} /></div>}
        {r.ok && <div style={{ position: "absolute", left: 1320 * r.f + 30, top: 30 }}><Check x={60} y={40} s={110} p={cl((tt - r.a - 1.2) / 0.5)} /></div>}
      </div>; })}
    <Tag tt={tt} at={it(h, 1)} x={960} y={920} txt="ONE MINUTE · THEN UP" col={AMB} size={58} />
  </>; }}</Stage>;

// ---- 5:51 · LA DANZA LENTA: las piernas dobladas van de un lado al otro como un péndulo, sobre una ola de agua ----
export const HPendulum: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 50%, #1e2e3a, #06090c 78%)">{(tt) => {
  const sw = Math.sin(tt * 1.15) * eio(tt, 0, 1.2), wave = cl((tt - it(h, 1)) / 1.0);
  return <>
    {/* ola de agua que corre abajo */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.35 + 0.5 * wave }}>
      {[0, 1, 2].map((k) => <path key={k} d={Array.from({ length: 49 }, (_, i) => `${i ? "L" : "M"}${i * 40} ${880 + k * 34 + 18 * Math.sin(i * 0.5 - tt * 2 + k)}`).join(" ")} stroke={ICE} strokeWidth={5 - k} fill="none" opacity={1 - k * 0.3} />)}
    </svg>
    {/* plano cenital: la cadera fija y las piernas que se van a un lado y al otro */}
    <div style={{ position: "absolute", left: 960, top: 420, transform: `rotate(${sw * 55}deg)`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", left: -60, top: 0, width: 120, height: 330, borderRadius: 60, background: CREAM, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      <div style={{ position: "absolute", left: -55, top: 270, width: 110, height: 150, borderRadius: 50, background: "#d8ccb4", transform: "rotate(160deg)", transformOrigin: "50% 0%" }} />
    </div>
    <div style={{ position: "absolute", left: 880, top: 330, width: 160, height: 160, borderRadius: "50%", background: "#c75b5b", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 600, top: 520, fontWeight: 900, fontSize: 90, color: sw < -0.3 ? AMB : "rgba(255,255,255,.25)" }}>L</div>
    <div style={{ position: "absolute", left: 1270, top: 520, fontWeight: 900, fontSize: 90, color: sw > 0.3 ? AMB : "rgba(255,255,255,.25)" }}>R</div>
    <Tag tt={tt} at={it(h, 0)} x={960} y={220} txt="A SLOW LITTLE DANCE" col={TX} size={52} />
  </>; }}</Stage>;

// ---- 6:24 · EL LADO DURO: dos relojes de arena; el izquierdo dura más (el lado duro necesita práctica) ----
export const HStiffSide: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const G2 = (x: number, dur: number, hot: number, l: string) => { const k = cl(tt / dur);
    return <div style={{ position: "absolute", left: x, top: 230, width: 300, height: 560 }}>
      <svg width={300} height={560}>
        <path d="M40 20 L260 20 L160 270 L260 520 L40 520 L140 270 Z" fill="rgba(255,255,255,.07)" stroke={hot > 0 ? AMB : "#bbb"} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M${60 + 80 * k} ${30 + 220 * k} L${240 - 80 * k} ${30 + 220 * k} L150 262 Z`} fill="#e8c27a" />
        <path d={`M150 ${510 - 230 * k} L${250} 510 L50 510 Z`} fill="#e8c27a" />
        <line x1={150} y1={270} x2={150} y2={510} stroke="#e8c27a" strokeWidth={4} opacity={k < 1 ? 1 : 0} />
      </svg>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 60, color: hot > 0 ? AMB : TX, marginTop: 10 }}>{l}</div>
    </div>; };
  return <>
    {G2(540, 9, cl((tt - it(h, 0)) * 3), "LEFT")}
    {G2(1080, 5, 0, "RIGHT")}
    <Tag tt={tt} at={it(h, 0) + 0.3} x={690} y={160} txt="LONGER" col={AMB} size={50} />
    <Tag tt={tt} at={it(h, 1) + 0.4} x={960} y={960} txt="THE STIFF SIDE NEEDS THE PRACTICE" col={TX} size={44} />
  </>; }}</Stage>;

// ---- 7:14 · LA ESPALDA CONTRA LA PARED: la columna se endereza contra el muro, hombros que abren, caderas que aflojan ----
export const HSpine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st = eio(tt, 0.2, 1.4), sh = phys(tt, it(h, 0), 5, 0.5), hip = cl((tt - it(h, 1)) / 1.5);
  return <>
    <Floor y={800} />
    <div style={{ position: "absolute", left: 640, top: 160, width: 70, height: 660, background: "linear-gradient(90deg,#e9dfcc,#cfc2a8)", boxShadow: "20px 0 50px rgba(0,0,0,.4)" }} />
    <Fig x={830} y={800} po={PO.cross} s={1.6} />
    {/* la línea de la columna: verde cuando queda derecha contra la pared */}
    <div style={{ position: "absolute", left: 822, top: 470, width: 16, height: 230, borderRadius: 8, background: GRN, opacity: st, boxShadow: `0 0 30px ${GRN}` }} />
    {sh > 0.01 && [-1, 1].map((d) => <svg key={d} width={200} height={80} style={{ position: "absolute", left: 830 - 100 + d * (110 + 40 * sh), top: 450, opacity: cl(sh) }}><path d={d > 0 ? "M20 40 L170 40 M130 10 L170 40 L130 70" : "M180 40 L30 40 M70 10 L30 40 L70 70"} stroke={AMB} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
    {hip > 0 && <div style={{ position: "absolute", left: 830 - 120, top: 700, width: 240, height: 120, borderRadius: "50%", border: `6px solid ${ICE}`, opacity: 1 - hip * 0.5, transform: `scale(${0.8 + 0.5 * hip})` }} />}
    <Tag tt={tt} at={1.0} x={1360} y={420} txt="BACK STRAIGHT" col={GRN} size={52} />
    <Tag tt={tt} at={it(h, 0) + 0.3} x={1360} y={530} txt="SHOULDERS OPEN" col={AMB} size={52} />
    <Tag tt={tt} at={it(h, 1) + 0.3} x={1360} y={640} txt="HIPS RELAX" col={ICE} size={52} />
  </>; }}</Stage>;

// ---- 7:48 · EL HONGO TRISTE: la espalda encorvada con sombrero de hongo; aparece la pared y la columna se endereza ----
export const HMushroom: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #2a2a20, #080806 78%)">{(tt) => {
  const cap = phys(tt, 0.4, 6, 0.45), wall = phys(tt, Math.min(it(h, 0), 6.0), 5, 0.6), fix = eio(tt, Math.min(it(h, 0), 6.0) + 0.3, Math.min(it(h, 0), 6.0) + 1.5);
  const bend = 1 - fix, hx = 960 + 150 * bend, hy = 330 + 110 * bend;
  return <>
    <Floor y={800} />
    {wall > 0.01 && <div style={{ position: "absolute", left: 760, top: 160 - (1 - wall) * 700, width: 70, height: 660, background: "linear-gradient(90deg,#e9dfcc,#cfc2a8)", boxShadow: "20px 0 50px rgba(0,0,0,.4)" }} />}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M920 760 Q${900 + 260 * bend} ${560 - 40 * bend} ${hx} ${hy + 60}`} stroke={bend > 0.5 ? "#d9a06a" : GRN} strokeWidth={46} fill="none" strokeLinecap="round" />
      <path d="M920 760 L1120 740 L1000 790" stroke={CREAM} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={44} fill={CREAM} />
      {/* el sombrero de hongo (se va cuando la espalda se endereza) */}
      <g opacity={cl(cap) * (1 - fix)} transform={`translate(${hx} ${hy - 30}) rotate(${20 * bend})`}>
        <path d="M-130 10 Q0 -150 130 10 Z" fill="#b5523b" /><circle cx={-50} cy={-30} r={14} fill="#f6e6cc" /><circle cx={30} cy={-55} r={18} fill="#f6e6cc" /><circle cx={70} cy={-10} r={10} fill="#f6e6cc" />
      </g>
    </svg>
    <Tag tt={tt} at={0.8} x={1500} y={200} txt="A SAD OLD MUSHROOM" col="#e0866a" size={50} />
    <Tag tt={tt} at={Math.min(it(h, 0), 6.0) + 0.6} x={1500} y={300} txt="JUST A WALL" col={GRN} size={56} />
  </>; }}</Stage>;

// ---- 8:22 · EMPUJAR, NO TIRAR: a la izquierda la mano tira y la mesa se corre; a la derecha la palma empuja y el cuerpo sube ----
export const HPushPull: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const a = it(h, 0), pull = cl((tt - a) / 1.2), slide = phys(tt, a + 0.6, 5, 0.5), push = cl((tt - a - 1.6) / 1.2), up = phys(tt, a + 2.4, 4, 0.6);
  return <>
    <div style={{ position: "absolute", left: 958, top: 120, width: 4, height: 840, background: "rgba(255,255,255,.15)" }} />
    <Floor y={800} />
    {/* tirar: la mesa se corre hacia ella */}
    <div style={{ position: "absolute", left: 300 + 120 * slide, top: 630, width: 300, height: 26, borderRadius: 13, background: WOOD, transform: `rotate(${-6 * slide}deg)` }} />
    {[340, 540].map((x) => <div key={x} style={{ position: "absolute", left: x + 120 * slide, top: 650, width: 18, height: 150, background: "#5a3820", transform: `rotate(${-6 * slide}deg)` }} />)}
    <Hand x={330 + 120 * slide} y={600} s={0.6} />
    <svg width={400} height={100} style={{ position: "absolute", left: 120, top: 520, opacity: cl(pull * 2) }}><path d="M360 50 L40 50 M90 15 L40 50 L90 85" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <Cross x={480} y={420} s={150} p={cl((tt - a - 1.2) / 0.5)} />
    <Tag tt={tt} at={a} x={480} y={250} txt="PULL" col={RED} size={80} />
    {/* empujar: la palma plana hacia abajo y la figura que sube */}
    <div style={{ position: "absolute", left: 1220, top: 630, width: 320, height: 26, borderRadius: 13, background: WOOD }} />
    {[1250, 1500].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 650, width: 18, height: 150, background: "#5a3820" }} />)}
    <Hand x={1300} y={600} s={0.6} col={push > 0 ? "#ffe2a8" : CREAM} />
    <svg width={100} height={220} style={{ position: "absolute", left: 1250, top: 360, opacity: cl(push * 2) }}><path d="M50 20 L50 190 M15 150 L50 190 L85 150" stroke={GRN} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    <Fig x={1620} y={800} po={mixP(PO.gentle, PO.stand, cl(up))} s={0.9} />
    <Tag tt={tt} at={a + 1.6} x={1420} y={250} txt="PUSH" col={GRN} size={80} />
  </>; }}</Stage>;

// ---- 9:09 · LO QUE SE CAE: la mesa plegable se dobla, la lámpara de pie se viene abajo; la mesa pesada ni se mueve ----
export const HLamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const fold = phys(tt, 0.8, 4, 0.5), fall = phys(tt, it(h, 0), 2.6, 0.55), ok = cl((tt - 3.0) / 0.6);
  return <>
    <Floor y={800} />
    {/* mesa plegable */}
    <div style={{ position: "absolute", left: 230, top: 600, width: 300, height: 20, borderRadius: 6, background: "#c8ccd0", transformOrigin: "0% 50%", transform: `rotate(${30 * fold}deg)` }} />
    {[250, 500].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: 615, width: 10, height: 185, background: "#8a8f96", transformOrigin: "50% 0%", transform: `rotate(${(i ? 35 : -25) * fold}deg)` }} />)}
    <Cross x={380} y={420} s={150} p={cl((tt - 1.6) / 0.5)} />
    {/* lámpara de pie que cae */}
    <div style={{ position: "absolute", left: 960, top: 800, transformOrigin: "0 0", transform: `rotate(${82 * cl(fall)}deg)` }}>
      <div style={{ position: "absolute", left: -6, top: -520, width: 12, height: 520, background: "#3a3a3a" }} />
      <div style={{ position: "absolute", left: -90, top: -640, width: 180, height: 130, background: "linear-gradient(180deg,#f4ead4,#d8c8a4)", clipPath: "polygon(25% 0, 75% 0, 100% 100%, 0 100%)", boxShadow: "0 0 60px rgba(255,220,150,.5)" }} />
      <div style={{ position: "absolute", left: -60, top: -10, width: 120, height: 14, borderRadius: 7, background: "#3a3a3a" }} />
    </div>
    <Cross x={960} y={300} s={150} p={cl((tt - it(h, 0) - 0.8) / 0.5)} />
    {/* mesa pesada: firme */}
    <div style={{ position: "absolute", left: 1330, top: 640, width: 380, height: 50, borderRadius: 10, background: "linear-gradient(180deg,#8a5a34,#5a3820)", boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    {[1350, 1660].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 690, width: 34, height: 110, background: "#4a2e1a" }} />)}
    <Check x={1520} y={470} s={150} p={ok} />
    <Tag tt={tt} at={3.2} x={1520} y={930} txt="HEAVY · DOES NOT MOVE" col={GRN} size={42} />
  </>; }}</Stage>;

// ---- 11:07 · EL ÁRBOL QUE CAE vs LOS 4 TIEMPOS: el tronco se desploma de un golpe; al lado, cuatro escalones suaves ----
export const HTimber: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 40% 40%, #22301e, #070907 78%)">{(tt) => {
  const fall = eio(tt, it(h, 0) - 0.2, it(h, 0) + 0.7), thud = tt > it(h, 0) + 0.7 ? Math.exp(-(tt - it(h, 0) - 0.7) * 6) : 0, st = it(h, 1);
  return <>
    <Floor y={820} />
    <div style={{ position: "absolute", left: 560, top: 820, transformOrigin: "0 0", transform: `rotate(${88 * fall}deg) translateY(${-thud * 10}px)` }}>
      <div style={{ position: "absolute", left: -28, top: -520, width: 56, height: 520, borderRadius: 12, background: "linear-gradient(90deg,#5a3e28,#7a5638,#4a2e1a)" }} />
      <div style={{ position: "absolute", left: -150, top: -720, width: 300, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #4f7a3a, #2a4a20)" }} />
    </div>
    {thud > 0.05 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 900 + i * 40, top: 790 - thud * 60 * (i % 3 + 1), width: 18, height: 18, borderRadius: "50%", background: "rgba(200,180,140,.6)", opacity: thud }} />)}
    <Tag tt={tt} at={it(h, 0)} x={760} y={300} txt="A FALLING TREE" col={RED} size={60} />
    {/* los 4 tiempos */}
    {[0, 1, 2, 3].map((i) => { const s = phys(tt, st + i * 0.45, 6, 0.5); return <div key={i} style={{ position: "absolute", left: 1220 + i * 130, top: 480 + i * 85, width: 130, height: 340 - i * 85, background: `rgba(111,227,154,${0.15 + 0.12 * i})`, borderTop: `6px solid ${GRN}`, opacity: cl(s * 2), transform: `scaleY(${cl(s)})`, transformOrigin: "50% 100%" }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 64, color: GRN, marginTop: -84 }}>{i + 1}</div></div>; })}
  </>; }}</Stage>;

// ---- 12:09 · EL ATERRIZAJE SUAVE: gráfico de golpe en las rodillas; de pie a las dos rodillas = pico rojo; con un paso = olas verdes ----
export const HSoftLand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const r = eio(tt, 0.6, 2.4), g = eio(tt, it(h, 0) - 0.2, it(h, 0) + 2.0);
  const red = "M200 760 L600 760 L700 760 L740 220 L790 760 L1720 760", grn = "M200 760 L600 760 Q680 640 760 700 Q840 600 920 680 Q1000 620 1080 700 Q1160 650 1240 740 L1720 740";
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={200} y1={780} x2={1720} y2={780} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      <line x1={200} y1={180} x2={200} y2={780} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
      <path d={red} stroke={RED} strokeWidth={10} fill="none" strokeLinejoin="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - r)} style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
      <path d={grn} stroke={GRN} strokeWidth={10} fill="none" strokeLinejoin="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - g)} style={{ filter: `drop-shadow(0 0 12px ${GRN})` }} />
    </svg>
    <div style={{ position: "absolute", left: 250, top: 200, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "rgba(255,255,255,.55)" }}>FORCE ON THE KNEES</div>
    <Tag tt={tt} at={1.8} x={1180} y={170} txt="STRAIGHT DOWN: BANG" col={RED} size={46} />
    <Tag tt={tt} at={it(h, 0) + 1.4} x={1300} y={580} txt="ONE KNEE STEP: SOFT" col={GRN} size={46} />
  </>; }}</Stage>;

// ---- 12:58 · LA PLOMADA: de la nariz cuelga una plomada que se balancea y se asienta sobre la punta del pie ----
export const HPlumb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const lean = eio(tt, 1.0, 3.0), po = mixP(PO.gentle, PO.lean, lean), sc = 1.5, X = 820, Y = 820;
  const nx = X + po.h[0] * sc + 30, ny = Y + po.h[1] * sc, sw = Math.sin(tt * 3) * 26 * Math.exp(-tt * 0.5) * (1 - lean * 0.6);
  const bx = nx + sw, by = Y - 30, toe = X + po.f[0] * sc + 26, hit = Math.abs(bx - toe) < 30 && lean > 0.95;
  const w = cl((tt - it(h, 0)) / 0.8);
  return <>
    <Floor y={Y} />
    <Fig x={X} y={Y} po={po} s={sc} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={nx} y1={ny} x2={bx} y2={by - 30} stroke={AMB} strokeWidth={3} />
      <path d={`M${bx - 16} ${by - 34} L${bx + 16} ${by - 34} L${bx} ${by} Z`} fill={AMB} />
    </svg>
    {hit && <div style={{ position: "absolute", left: toe - 60, top: Y - 40, width: 120, height: 60, borderRadius: "50%", background: `radial-gradient(${GRN}88, transparent 70%)` }} />}
    {w > 0 && <svg width={140} height={240} style={{ position: "absolute", left: toe - 70, top: Y - 420, opacity: w }}><path d="M70 10 L70 200 M30 160 L70 205 L110 160" stroke={GRN} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    <Tag tt={tt} at={1.4} x={1460} y={360} txt="NOSE" col={AMB} size={70} />
    <Tag tt={tt} at={2.2} x={1460} y={470} txt="OVER" col={TX} size={50} />
    <Tag tt={tt} at={3.0} x={1460} y={580} txt="TOES" col={GRN} size={70} />
  </>; }}</Stage>;

// ---- 13:18 · EL SOLDADO: derecho como un soldado se va para atrás; inclinado hacia adelante, sube ----
export const HSoldier: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const tryUp = eio(tt, 0.6, 1.6), back = phys(tt, 1.8, 4, 0.5), good = eio(tt, 3.6, 5.6);
  return <>
    <Floor y={820} />
    <div style={{ position: "absolute", left: 958, top: 140, width: 4, height: 680, background: "rgba(255,255,255,.15)" }} />
    <Fig x={480} y={820} po={mixP(PO.gentle, { ...PO.gentle, h: [-20, -300], n: [-10, -258] }, tryUp)} s={1.2} rot={-14 * cl(back)} col="#d6c6a8" />
    {/* el gorro de soldado */}
    <Cross x={480} y={260} s={140} p={cl((tt - 2.4) / 0.5)} />
    <Fig x={1440} y={820} po={good < 0.5 ? mixP(PO.gentle, PO.lean, good * 2) : mixP(PO.lean, PO.stand, (good - 0.5) * 2)} s={1.2} />
    <Check x={1440} y={260} s={140} p={cl((tt - 5.6) / 0.6)} />
    <Tag tt={tt} at={Math.min(it(h, 0), 1.0)} x={480} y={940} txt="LIKE A SOLDIER" col={RED} size={46} />
    <Tag tt={tt} at={3.8} x={1440} y={940} txt="LEAN FORWARD" col={GRN} size={46} />
  </>; }}</Stage>;

// ---- 14:07 · DIEZ VECES POR DÍA: el arco del sol al moon; diez marcas caen sobre el arco (sentarse y levantarse) ----
export const HTenTimes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 70%, #2e2a1e, #07070a 78%)">{(tt) => {
  const sun = eio(tt, 0.2, 7.5), n = Math.min(10, Math.floor(cl((tt - 0.6) / 6.0) * 10.99));
  const P = (k: number) => [960 - 680 * Math.cos(Math.PI * k), 820 - 520 * Math.sin(Math.PI * k)];
  const [sx, sy] = P(sun);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M280 820 A680 520 0 0 1 1640 820" stroke="rgba(255,255,255,.18)" strokeWidth={6} fill="none" strokeDasharray="10 14" />
      <line x1={200} y1={820} x2={1720} y2={820} stroke="#1f2a40" strokeWidth={6} />
    </svg>
    <div style={{ position: "absolute", left: sx - 50, top: sy - 50, width: 100, height: 100, borderRadius: "50%", background: sun < 0.8 ? "radial-gradient(#ffe39a, #f2a33a)" : "radial-gradient(#fff, #c9d6ff)", boxShadow: `0 0 80px ${sun < 0.8 ? "#ffcf6a" : "#9fb6ff"}` }} />
    {Array.from({ length: 10 }, (_, i) => { const k = 0.06 + i * 0.098, [x, y] = P(k), s = phys(tt, 0.6 + i * 0.6, 7, 0.45); if (s <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: x, top: y + 70, transform: `translate(-50%,-50%) translateY(${(1 - s) * -60}px)`, opacity: cl(s * 2), width: 56, height: 56, borderRadius: "50%", background: "#1f2a40", border: `4px solid ${AMB}`, textAlign: "center", lineHeight: "50px", fontWeight: 900, fontSize: 30, color: AMB }}>↕</div>; })}
    <div style={{ position: "absolute", left: 960, top: 640, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 170, color: TX, lineHeight: 1 }}>{n}</div>
      <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 6, color: AMB }}>TIMES A DAY · NOT EXERCISE</div>
    </div>
  </>; }}</Stage>;

// ---- 15:42 · LA TANDA DE PUBLICIDAD: el reloj marca 30 minutos, la tele muestra el drama y en la tanda ella se para ----
export const HCommercial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const ring = eio(tt, 0.3, 3.0), tv = phys(tt, it(h, 0) - 0.3, 5, 0.6), cm = cl((tt - it(h, 1)) / 0.3), up = eio(tt, it(h, 1) + 0.2, it(h, 1) + 1.3);
  return <>
    <svg width={300} height={300} style={{ position: "absolute", left: 220, top: 200 }}>
      <circle cx={150} cy={150} r={120} fill="#fffaf0" stroke="#7a4e2c" strokeWidth={14} />
      <path d={`M150 150 L150 30 A120 120 0 ${ring > 0.5 ? 1 : 0} 1 ${150 + 120 * Math.sin(ring * Math.PI)} ${150 - 120 * Math.cos(ring * Math.PI)} Z`} fill={`${AMB}88`} />
      <line x1={150} y1={150} x2={150 + 90 * Math.sin(ring * Math.PI)} y2={150 - 90 * Math.cos(ring * Math.PI)} stroke="#222" strokeWidth={8} strokeLinecap="round" />
    </svg>
    <Tag tt={tt} at={1.0} x={370} y={560} txt="30 MIN MAX" col={AMB} size={48} />
    {/* la tele vieja */}
    <div style={{ position: "absolute", left: 760, top: 240, width: 760, height: 560, borderRadius: 40, background: "linear-gradient(180deg,#6a4a30,#3a2a1c)", transform: `scale(${0.7 + 0.3 * tv})`, opacity: cl(tv * 2), boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 50, top: 50, width: 520, height: 400, borderRadius: 30, overflow: "hidden", background: "#111" }}>
        <Img src={img("n_tele_vieja")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 - cm, filter: "saturate(.7)" }} />
        {cm > 0 && <div style={{ position: "absolute", inset: 0, opacity: cm, background: "linear-gradient(90deg,#fff 0 14%,#ff0 14% 28%,#0ff 28% 42%,#0f0 42% 57%,#f0f 57% 71%,#f00 71% 85%,#00f 85%)" }}><div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 64, color: "#111" }}>CM</div></div>}
      </div>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 620, top: 90 + i * 130, width: 80, height: 80, borderRadius: "50%", background: "#c8b89a" }} />)}
    </div>
    <Fig x={1680} y={860} po={mixP(PO.seiza, PO.stand, up)} s={0.8} />
    <Tag tt={tt} at={it(h, 1) + 0.6} x={1140} y={900} txt="AT THE COMMERCIAL: UP" col={GRN} size={50} />
  </>; }}</Stage>;

// ---- 15:59 · SIN BANQUITO: el banquito se tacha; para lo de abajo dobla las rodillas; para lo de arriba, pide ayuda ----
export const HStool: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const sq = eio(tt, it(h, 0) - 0.2, it(h, 0) + 1.0), help = phys(tt, Math.min(it(h, 1), 6.4) - 0.2, 5, 0.6);
  return <>
    <Floor y={820} />
    <div style={{ position: "absolute", left: 300, top: 640, width: 220, height: 40, borderRadius: 8, background: "#f0f0ee" }} />
    {[315, 480].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 670, width: 26, height: 150, background: "#e0e0dc", transform: `rotate(${x < 400 ? 8 : -8}deg)` }} />)}
    <Cross x={410} y={560} s={260} p={cl((tt - 0.6) / 0.5)} />
    <Fig x={960} y={820} po={mixP(PO.stand, PO.squat, sq)} s={1.15} />
    <Tag tt={tt} at={it(h, 0) + 0.5} x={960} y={950} txt="BEND THE KNEES" col={GRN} size={46} />
    {help > 0.01 && <div style={{ opacity: cl(help * 2) }}>
      <div style={{ position: "absolute", left: 1400, top: 260, width: 360, height: 26, background: WOOD }} />
      <div style={{ position: "absolute", left: 1560, top: 196, width: 70, height: 64, borderRadius: 8, background: "#d9b25a" }} />
      <Fig x={1600} y={820} po={PO.reach} s={1.15} col="#bcd3e8" />
    </div>}
    <Tag tt={tt} at={Math.min(it(h, 1), 6.4) + 0.4} x={1580} y={950} txt="ASK FOR HELP" col={ICE} size={46} />
  </>; }}</Stage>;

// ---- 16:16 · EL SELLO: «a tu edad, sentate en una silla» se tacha; su respuesta se escribe a mano y el hanko rojo la sella ----
export const HHanko: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="radial-gradient(ellipse at 50% 45%, #3a3226, #0b0907 78%)">{(tt) => {
  const card = phys(tt, 0.1, 4, 0.7), x1 = cl((tt - 1.0) / 0.5), q = cl((tt - 1.8) / 2.6), st = phys(tt, Math.min(it(h, 1), 5.6), 9, 0.35);
  const Q = "At my age, I should sit wherever I like.";
  return <div style={{ position: "absolute", left: 960, top: 540, width: 1240, height: 680, transform: `translate(-50%,-50%) rotate(${-1.5 + 1.5 * card}deg) scale(${0.8 + 0.2 * card})`, opacity: cl(card * 2), background: "linear-gradient(135deg,#f6efdf,#e9dfc6)", borderRadius: 8, boxShadow: "0 60px 120px rgba(0,0,0,.65)" }}>
    <div style={{ position: "absolute", left: 80, top: 70, fontFamily: HAND, fontWeight: 600, fontSize: 58, color: "#6a6058" }}>"At your age, you should sit in a chair."
      <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 6, background: RED, transform: `scaleX(${x1})`, transformOrigin: "0 50%" }} /></div>
    <div style={{ position: "absolute", left: 80, top: 220, width: 900, fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: 1.1, color: INK }}>{Q.slice(0, Math.round(Q.length * q))}</div>
    <div style={{ position: "absolute", left: 80, bottom: 70, fontFamily: HAND, fontWeight: 700, fontSize: 48, color: "#6a6058", opacity: q }}>— Okada-san, my mother</div>
    {st > 0.01 && <div style={{ position: "absolute", right: 90, bottom: 80, width: 170, height: 170, borderRadius: 20, border: "10px solid #c0392b", color: "#c0392b", fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${2.2 - 1.2 * cl(st)}) rotate(-8deg)`, opacity: cl(st * 2) * 0.9 }}>OK</div>}
  </div>; }}</Stage>;

// ---- 17:50 · LOS PISOS: cuatro muestras caen (alfombra, madera, manta doblada, colchoneta) y cada una se tilda ----
export const HFloors: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const S = [{ l: "CARPET", a: 0.3, bg: "repeating-radial-gradient(circle at 30% 30%, #b8a58a 0 3px, #a8957a 3px 6px)" }, { l: "HARDWOOD", a: it(h, 0), bg: "repeating-linear-gradient(90deg, #a06a3c 0 60px, #8a5a34 60px 64px)" },
    { l: "FOLDED BLANKET", a: it(h, 1), bg: "repeating-linear-gradient(0deg, #8a9ab0 0 20px, #7a8aa0 20px 24px)" }, { l: "YOGA MAT", a: it(h, 2), bg: "linear-gradient(180deg,#8a6ac8,#6a4aa8)" }];
  return <>{S.map((s, i) => { const k = phys(tt, s.a, 6, 0.5); if (k <= 0.01) return null; const x = 270 + i * 360;
    return <div key={i} style={{ position: "absolute", left: x, top: 330, width: 300, opacity: cl(k * 2), transform: `translateY(${(1 - k) * -260}px) rotate(${(1 - k) * 12}deg)` }}>
      <div style={{ width: 300, height: 360, borderRadius: 18, background: s.bg, boxShadow: "0 40px 80px rgba(0,0,0,.55)", transform: "perspective(800px) rotateX(20deg)" }} />
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 32, letterSpacing: 2, marginTop: 26 }}>{s.l}</div>
      <Check x={150} y={-30} s={110} p={cl((tt - s.a - 0.5) / 0.6)} />
    </div>; })}
    <Tag tt={tt} at={(it(h, 2) ?? 4) + 1.0} x={960} y={190} txt="NOTHING JAPANESE NEEDED" col={AMB} size={48} />
  </>; }}</Stage>;

// ---- 18:21 · SI QUEDÁS EN EL PISO: la tira de 4 viñetas (de costado → en cuatro patas → una rodilla → arriba) ----
export const HStuck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const P = [{ po: PO.side, l: "ROLL", a: 0.2 }, { po: PO.four, l: "HANDS & KNEES", a: 0.9 }, { po: PO.gentle, l: "ONE KNEE", a: 1.8 }, { po: PO.stand, l: "UP", a: it(h, 1) }];
  return <>{P.map((p, i) => { const k = phys(tt, p.a, 6, 0.55); if (k <= 0.01) return null; const x = 200 + i * 400;
    return <div key={i} style={{ position: "absolute", left: x, top: 230, width: 360, height: 560, borderRadius: 26, background: i === 3 ? "rgba(111,227,154,.12)" : "rgba(255,255,255,.06)", border: `3px solid ${i === 3 ? GRN : "rgba(255,255,255,.18)"}`, overflow: "hidden", opacity: cl(k * 2), transform: `translateY(${(1 - k) * 80}px) scale(${0.85 + 0.15 * k})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, height: 6, background: "#1f2a40" }} />
      <Fig x={180} y={460} po={p.po} s={0.95} />
      <div style={{ position: "absolute", left: 22, top: 18, width: 58, height: 58, borderRadius: "50%", background: i === 3 ? GRN : AMB, color: "#111", fontWeight: 900, fontSize: 34, textAlign: "center", lineHeight: "58px" }}>{i + 1}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontWeight: 900, fontSize: 30, letterSpacing: 2, color: i === 3 ? GRN : TX }}>{p.l}</div>
    </div>; })}
    <Tag tt={tt} at={it(h, 0)} x={1000} y={880} txt="NOSE OVER TOES" col={AMB} size={50} />
  </>; }}</Stage>;

// ---- 18:56 · TRES SEGUNDOS A LOS 98: el cronómetro corre 0,0 → 3,0 mientras la figura se para sin manos ----
export const HStopwatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 45%, #1c2836, #05070a 78%)">{(tt) => {
  const a = it(h, 0) - 2.6, sec = cl((tt - a) / 3.0) * 3, up = eio(tt, a, a + 3.0);
  return <>
    <svg width={520} height={600} style={{ position: "absolute", left: 300, top: 220 }}>
      <rect x={235} y={10} width={50} height={50} rx={10} fill="#bbb" />
      <circle cx={260} cy={320} r={230} fill="#f4f1ea" stroke="#9aa0a8" strokeWidth={20} />
      <path d={`M260 320 L260 110 A210 210 0 ${sec > 1.5 ? 1 : 0} 1 ${260 + 210 * Math.sin(sec / 3 * Math.PI * 2 * 0.999)} ${320 - 210 * Math.cos(sec / 3 * Math.PI * 2 * 0.999)} Z`} fill={`${ICE}66`} />
      <line x1={260} y1={320} x2={260 + 190 * Math.sin(sec / 3 * Math.PI * 2)} y2={320 - 190 * Math.cos(sec / 3 * Math.PI * 2)} stroke={RED} strokeWidth={8} strokeLinecap="round" />
      <text x={260} y={430} fontSize={84} fontWeight={900} textAnchor="middle" fill="#222" fontFamily="sans-serif">{sec.toFixed(1)}s</text>
    </svg>
    <Floor y={820} />
    <Fig x={1320} y={820} po={mixP(PO.cross, PO.stand, up)} s={1.2} col="#bcd3e8" />
    <Tag tt={tt} at={a + 3.1} x={1320} y={200} txt="AGE 98 · NO HANDS" col={ICE} size={54} />
  </>; }}</Stage>;

// ---- 19:46 · LA HUELLA EN LA MESA: la mano entera, después dos dedos, después uno (la huella se achica sobre la madera) ----
export const HFingerprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const st = tt < it(h, 0) ? 5 : tt < it(h, 1) ? 2 : 1, k = phys(tt, st === 5 ? 0.4 : st === 2 ? it(h, 0) : it(h, 1), 6, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, width: 1400, height: 640, transform: "translate(-50%,-50%) perspective(1400px) rotateX(48deg)", borderRadius: 20, background: "repeating-linear-gradient(90deg, #8a5a34 0 140px, #7a4e2c 140px 144px)", boxShadow: "0 80px 120px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 600, top: 140, transform: `scale(${0.9 + 0.1 * k})`, opacity: cl(k * 2) }}><Hand x={100} y={120} s={1.6} fingers={st} col="#ffe2a8" /></div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 230, transform: "translateX(-50%)", display: "flex", gap: 60 }}>
      {[["ONE HAND", 5], ["TWO FINGERS", 2], ["ONE FINGER", 1]].map(([l, n], i) => <div key={i} style={{ fontWeight: 900, fontSize: 40, letterSpacing: 2, color: st === n ? AMB : "rgba(255,255,255,.3)", transform: `scale(${st === n ? 1.12 : 1})` }}>{l}</div>)}
    </div>
    <Tag tt={tt} at={it(h, 1) + 0.8} x={960} y={960} txt="THEN... NO HANDS" col={ICE} size={50} />
  </>; }}</Stage>;

// ---- 20:20 · SUS 10 MINUTOS: una tira de diez bloques que se llena de a uno, cada uno con su postura ----
export const HTenPlan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const B = [["DOWN", PO.seiza], ["SEIZA", PO.seiza], ["RIGHT", PO.sideSit], ["LEFT", PO.sideSit], ["WALL", PO.cross], ["WALL", PO.cross], ["UP", PO.stand], ["DOWN·UP", PO.gentle], ["×3", PO.lean], ["NO HANDS", PO.stand]] as [string, Pose][];
  return <>{B.map(([l, po], i) => { const k = phys(tt, 0.3 + i * 0.5, 7, 0.5); if (k <= 0.01) return null; const x = 130 + i * 168;
    return <div key={i} style={{ position: "absolute", left: x, top: 300, width: 156, height: 470, borderRadius: 18, background: i === 9 ? "rgba(127,209,255,.16)" : "rgba(255,255,255,.07)", border: `3px solid ${i === 9 ? ICE : "rgba(255,255,255,.18)"}`, overflow: "hidden", opacity: cl(k * 2), transform: `translateY(${(1 - k) * 120}px)` }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 52, color: i === 9 ? ICE : AMB, marginTop: 14 }}>{i + 1}</div>
      <Fig x={78} y={360} po={po} s={0.42} flip={i === 3} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>{l}</div>
    </div>; })}
    <Tag tt={tt} at={5.4} x={960} y={880} txt="MY 10 MINUTES" col={AMB} size={60} />
  </>; }}</Stage>;

// ---- 21:42 · LOS DOS DÍAS BUENOS: dos hojas de calendario (sin manos · dos dedos) y las dos reciben el círculo verde ----
export const HGoodDays: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 45%, #22302a, #060807 78%)">{(tt) => {
  const D = [{ l: "NO HANDS", a: 0.2, c: <Fig x={160} y={300} po={PO.stand} s={0.55} col="#3a2f28" /> }, { l: "TWO FINGERS", a: it(h, 0), c: <Hand x={160} y={210} s={0.8} fingers={2} col="#c9a878" /> }];
  const both = cl((tt - it(h, 1)) / 0.7);
  return <>{D.map((d, i) => { const k = phys(tt, d.a, 5, 0.55); if (k <= 0.01) return null;
    return <div key={i} style={{ position: "absolute", left: 520 + i * 560, top: 210, width: 320, height: 470, borderRadius: 16, background: "#fbf7ee", overflow: "hidden", opacity: cl(k * 2), transform: `rotate(${(i ? 4 : -4) * k}deg) translateY(${(1 - k) * -200}px)`, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }}>
      <div style={{ height: 80, background: "#c0392b" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: 470 }}>{d.c}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontWeight: 900, fontSize: 30, color: INK }}>{d.l}</div>
      {both > 0 && <svg width={320} height={470} style={{ position: "absolute", inset: 0 }}><ellipse cx={160} cy={250} rx={140} ry={170} stroke={GRN} strokeWidth={12} fill="none" strokeDasharray={1000} strokeDashoffset={1000 * (1 - both)} transform="rotate(-8 160 250)" /></svg>}
    </div>; })}
    <Tag tt={tt} at={it(h, 1) + 0.5} x={960} y={850} txt="BOTH ARE GOOD DAYS" col={GRN} size={62} />
  </>; }}</Stage>;

// ---- 23:06 · EL PRIMER AMIGO: el bebé que gatea a la izquierda, la abuela sentada a la derecha y el mismo piso que los une ----
export const HFirstFriend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 60%, #3a2c1e, #090705 78%)">{(tt) => {
  const fl = eio(tt, 0.2, 2.2), b = phys(tt, 0.6, 5, 0.6), g = phys(tt, it(h, 0) - 0.3, 5, 0.6);
  return <>
    <div style={{ position: "absolute", left: 160, top: 760, width: 1600 * fl, height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${AMB}, #ffd9a0)`, boxShadow: `0 0 50px ${AMB}88` }} />
    <div style={{ opacity: cl(b * 2) }}><Fig x={460 + 40 * Math.sin(tt * 1.4)} y={760} po={PO.four} s={0.6} col="#ffe8d0" /></div>
    <div style={{ opacity: cl(g * 2) }}><Fig x={1460} y={760} po={PO.seiza} s={1.05} /></div>
    <Tag tt={tt} at={0.9} x={460} y={900} txt="FIRST FRIEND" col={AMB} size={48} />
    <Tag tt={tt} at={it(h, 0) + 0.2} x={1460} y={900} txt="LAST FRIEND" col={AMB} size={48} />
    <Tag tt={tt} at={2.4} x={960} y={300} txt="THE FLOOR" col={TX} size={90} />
  </>; }}</Stage>;
