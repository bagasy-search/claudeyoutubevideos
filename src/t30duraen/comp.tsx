// t30duraen — "You'd Last 3 Seconds": el peor trabajo de cada siglo. Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
// Usa el kit btg SÓLO lectura (src/kits/btg/kit.tsx). Build/BigWord/Label/Aside/Scribble/DiagSplit siguen el patrón de src/btgm1/M1.tsx
// (allá no se exportan: acá van copiados, sin tocar btgm1). Todo lo ilustrado es SVG/CSS; lo real = archivo PD/CC + fotos/clips agnes sin cara.
// Pieza ancla: el CRONÓMETRO DE SUPERVIVENCIA (Hud que corre en cada parada + Watch grande que se congela al "renunciar") y el JobRoster.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, Person, SunsetStage, Stamp, ease } from "../kits/btg/kit";

const { fontFamily: F } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
export const INK = "#f0ebe5", RED = "#f14536", ORA = "#edb269", GOLD = "#e9c762", CYAN = "#4fe3ff", GLOW = "#9dff7a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const sf = (p: string) => staticFile(p);
const HAND = "'Segoe Print','Comic Sans MS','Bradley Hand',cursive";

// ───────────────────────── texto (firma del estilo) ─────────────────────────
export const Build: React.FC<{ a?: number; lines: string[]; out?: number; y?: number; size?: number; color?: string }> = ({ a = 6, lines, out, y = 120, size = 96, color = RED }) => {
  const f = useCurrentFrame();
  const o = out ? ease(f, out, out + 9, 1, 0) : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: F, opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
      {lines.map((l, li) => (
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>
          {l.split(" ").map((w, i) => {
            const t = ease(f, a + k * 15, a + k++ * 15 + 6);
            const key = w.startsWith("*");
            return <span key={i} style={{ display: "inline-block", marginRight: size * 0.25, opacity: t, transform: `translateY(${(1 - t) * 10}px)`, color: key ? color : undefined, fontWeight: key ? 900 : 800 }}>{w.replace(/\*/g, "")}</span>;
          })}
        </div>
      ))}
    </div>
  );
};
export const BigWord: React.FC<{ a: number; w: string; color?: string; size?: number; x?: number; y?: number }> = ({ a, w, color = RED, size = 240, x, y = 380 }) => {
  const f = useCurrentFrame();
  const t = ease(f, a, a + 7);
  return <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: x === undefined ? "center" : "left", fontFamily: F, fontWeight: 900, fontSize: size, lineHeight: 1, color, opacity: t, transform: `scale(${1.15 - 0.15 * t})`, textShadow: `0 0 40px ${color}55, 0 8px 30px rgba(0,0,0,.6)` }}>{w}</div>;
};
export const Label: React.FC<{ a?: number; t: string }> = ({ a = 4, t }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 8);
  return (
    <div style={{ position: "absolute", left: 96, top: 76, fontFamily: F, fontWeight: 700, fontSize: 54, color: "rgba(240,235,229,.92)", opacity: o, transform: `translateX(${(1 - o) * -20}px)`, textShadow: "0 2px 10px rgba(0,0,0,.7)" }}>
      {t}<div style={{ height: 3, width: 150 * o, background: "rgba(240,235,229,.8)", marginTop: 6 }} />
    </div>
  );
};
export const Scribble: React.FC<{ a: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }> = ({ a, cx, cy, rx, ry, text, tx, ty }) => {
  const f = useCurrentFrame();
  const p = ease(f, a, a + 14), q = ease(f, a + 10, a + 20), r = ease(f, a + 16, a + 24);
  const circ = `M${cx + rx},${cy} C${cx + rx},${cy - ry * 1.1} ${cx - rx * 1.05},${cy - ry} ${cx - rx},${cy + ry * 0.1} C${cx - rx * 0.95},${cy + ry * 1.1} ${cx + rx * 1.1},${cy + ry} ${cx + rx * 0.92},${cy - ry * 0.25}`;
  const ax = cx + rx * 0.7 * Math.sign(tx - cx || 1), ay = cy - ry * 0.9;
  const arrow = `M${tx + 40},${ty + 30} Q${(tx + ax) / 2 + 60},${ty + 10} ${ax},${ay} M${ax},${ay} l38,-6 M${ax},${ay} l10,34`;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.6))" }}>
        <path d={circ} fill="none" stroke={GOLD} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={arrow} fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />
      </svg>
      <div style={{ position: "absolute", left: tx - 120, top: ty - 40, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: GOLD, opacity: r, transform: `rotate(-6deg) scale(${0.9 + 0.1 * r})`, textShadow: "0 3px 8px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>{text}</div>
    </AbsoluteFill>
  );
};
export const Aside: React.FC<{ a: number; t: string; x: number; y: number }> = ({ a, t, x, y }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "12px 22px", borderRadius: 18, background: "rgba(250,248,244,.96)", color: "#1b1d22", fontFamily: F, fontWeight: 700, fontSize: 44, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: "0 100%", boxShadow: "0 8px 20px rgba(0,0,0,.35)", whiteSpace: "nowrap" }}>
      {t}<div style={{ position: "absolute", left: 26, bottom: -16, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "18px solid rgba(250,248,244,.96)" }} />
    </div>
  );
};
const Credit: React.FC<{ t?: string }> = ({ t }) => t ? <div style={{ position: "absolute", right: 30, bottom: 22, fontFamily: F, fontWeight: 700, fontSize: 20, color: "rgba(240,235,229,.62)", textShadow: "0 1px 4px #000" }}>{t}</div> : null;
const Vig: React.FC<{ k?: number }> = ({ k = 0.62 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,${k}) 100%)` }} />;

// overlays comunes de un plano (texto encima del real o del dibujo)
export type Ov = { build?: { lines: string[]; a?: number; size?: number; color?: string; y?: number; out?: number }; big?: { w: string; a?: number; color?: string; size?: number; x?: number; y?: number };
  label?: string; scrib?: { a?: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }; aside?: { t: string; a?: number; x: number; y: number }; credit?: string };
export const Overlays: React.FC<{ o: Ov }> = ({ o }) => (
  <>
    {o.label && <Label t={o.label} />}
    {o.scrib && <Scribble a={o.scrib.a ?? 10} {...o.scrib} />}
    {o.build && <Build {...o.build} />}
    {o.big && <BigWord a={o.big.a ?? 6} {...o.big} />}
    {o.aside && <Aside a={o.aside.a ?? 14} {...o.aside} />}
    <Credit t={o.credit} />
  </>
);

// ───────────────────────── REAL ─────────────────────────
// foto o clip a pantalla completa, punch-in lento 4-8 % + viñeta, sin filtro (look documental neutro)
export const RealShot: React.FC<{ v: string; d: number; z?: [number, number]; from?: number; pos?: string; o?: Ov; rate?: number }> = ({ v, d, z = [1.03, 1.09], from = 0, pos = "50% 50%", o = {}, rate = 1 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, Math.max(d, 2)], z, clamp);
  const vid = v.endsWith(".mp4");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, filter: "saturate(.82)" }}>
        {vid ? <OffthreadVideo src={sf(v)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
          : <Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />}
      </AbsoluteFill>
      <Vig />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// archivo (grabado, pintura, foto vieja): entero dentro de un borde blanco, sobre la misma imagen borrosa; push lento; año + crédito
export const Arch: React.FC<{ v: string; d: number; ar: number; year?: string; o?: Ov; side?: "c" | "l" | "r" }> = ({ v, d, ar, year, o = {}, side = "c" }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f, fps: 30, config: { damping: 18, mass: 0.8 } });
  const maxW = side === "c" ? 1500 : 1000, maxH = o.build ? 640 : 860;
  let w = maxW, h = w / ar; if (h > maxH) { h = maxH; w = h * ar; }
  const cx = side === "c" ? 960 : side === "l" ? 620 : 1300, cy = o.build ? 640 : 540;
  const s = interpolate(f, [0, Math.max(d, 2)], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.32) saturate(.7)", transform: "scale(1.2)" }}><Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2 + (1 - t) * 50, width: w, height: h, opacity: t, transform: `scale(${s}) rotate(${(1 - t) * -2}deg)`, border: "7px solid rgba(250,248,242,.95)", boxShadow: "0 30px 70px rgba(0,0,0,.7)", background: "#222" }}>
        <Img src={sf(v)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.8)" }} />
      </div>
      {year && <Label t={year} />}
      <Overlays o={{ ...o, label: undefined }} />
    </AbsoluteFill>
  );
};
// 2-3 fotos con borde blanco sobre una borrosa + cifra/palabra naranja al lado
export const Cards: React.FC<{ bg: string; cards: string[]; o?: Ov }> = ({ bg, cards, o = {} }) => {
  const f = useCurrentFrame();
  const W = cards.length > 2 ? 380 : 440, H = W * 1.25, G = 46, X0 = (o.big ? 1100 : 960) - (cards.length * W + (cards.length - 1) * G) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(.36) saturate(.8)", transform: `scale(${1.15 + f * 0.0006})` }}><Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + f * 0.0004})` }}>
      {cards.map((c, i) => {
        const t = spring({ frame: f - 3 - i * 12, fps: 30, config: { damping: 15, mass: 0.8 } });
        const tilt = (rnd(i, 7) - 0.5) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 540 - H / 2 + 40 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg)`, borderRadius: 12, overflow: "hidden", border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
            <Img src={sf(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - f * 0.0005})` }} />
          </div>
        );
      })}
      </AbsoluteFill>
      <Overlays o={{ ...o, big: o.big ? { x: 90, y: 440, size: 170, color: ORA, ...o.big } : undefined }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── CRONÓMETRO DE SUPERVIVENCIA (pieza ancla) ─────────────────────────
const hms = (s: number) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; };
// game-time: corre de 0 a `fin` segundos entre el arranque de la parada y el momento de renunciar (tq, cuadros). fin=null → nunca se congela
export const gameSecs = (f: number, tq: number, fin: number | null) => fin === null ? f * 240 + Math.pow(f / 30, 2) * 900 : fin * Math.pow(Math.min(1, f / Math.max(tq, 1)), 1.6);
export const Hud: React.FC<{ tq: number; fin: number | null; tag: string; n: number; hide?: [number, number] }> = ({ tq, fin, tag, n, hide }) => {
  const f = useCurrentFrame();
  const quit = f >= tq, s = gameSecs(f, tq, fin);
  if (hide && f >= hide[0] && f < hide[1]) return null;
  const inn = ease(f, 0, 10), pulse = quit ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  const col = quit ? RED : INK;
  return (
    <div style={{ position: "absolute", right: 46, top: 40, opacity: inn, transform: `translateY(${(1 - inn) * -20}px)`, display: "flex", alignItems: "center", gap: 14, padding: "10px 18px 10px 14px", borderRadius: 14, background: "rgba(8,10,14,.72)", border: `2px solid ${quit ? RED : "rgba(240,235,229,.25)"}`, boxShadow: quit ? `0 0 ${18 + pulse * 14}px ${RED}88` : "0 6px 18px rgba(0,0,0,.4)", fontFamily: F }}>
      <svg width={46} height={52} viewBox="0 0 46 52"><rect x={18} y={0} width={10} height={6} rx={2} fill={col} /><circle cx={23} cy={30} r={19} fill="none" stroke={col} strokeWidth={4} />
        <line x1={23} y1={30} x2={23 + 13 * Math.sin((s / 60) * Math.PI * 2)} y2={30 - 13 * Math.cos((s / 60) * Math.PI * 2)} stroke={col} strokeWidth={3.5} strokeLinecap="round" /></svg>
      <div>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 3, color: quit ? RED : "rgba(240,235,229,.6)" }}>{quit ? `STOP ${n} · YOU QUIT` : `STOP ${n} · SHIFT`}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: col, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{quit && fin === null ? tag : hms(s)}</div>
      </div>
    </div>
  );
};
// el reloj grande de "When do you quit?": corre, se congela en fz (cuadros) y estampa el tiempo final
export const Watch: React.FC<{ d: number; fz: number; fin: number | null; tag: string; sub?: string; s0?: number }> = ({ d, fz, fin, tag, sub, s0 = 0 }) => {
  const f = useCurrentFrame();
  const fr = Math.min(f, fz);
  const s = fin === null ? s0 + fr * 2400 : s0 + (fin - s0) * Math.min(1, fr / Math.max(fz, 1));
  const frozen = f >= fz, st = ease(f, fz, fz + 8), push = interpolate(f, [0, d], [1, 1.04], clamp);
  const ang = (s / 60) * 360, angM = (s / 3600) * 360;
  const col = frozen ? RED : INK;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 34% 55%, #2a1a12 0%, #0a0807 70%)`, transform: `scale(${push})` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(620,590)">
          <rect x={-40} y={-372} width={80} height={44} rx={8} fill="#c9c2b6" /><rect x={-14} y={-332} width={28} height={30} fill="#c9c2b6" />
          <circle r={300} fill="#f2ede4" stroke={frozen ? RED : "#c9c2b6"} strokeWidth={22} />
          <circle r={300 + st * 40} fill="none" stroke={RED} strokeWidth={6} opacity={(1 - st) * 0.9} />
          {Array.from({ length: 60 }).map((_, i) => { const a = (i / 60) * Math.PI * 2, L = i % 5 ? 16 : 36; return <line key={i} x1={Math.sin(a) * 270} y1={-Math.cos(a) * 270} x2={Math.sin(a) * (270 - L)} y2={-Math.cos(a) * (270 - L)} stroke="#2a2420" strokeWidth={i % 5 ? 3 : 7} />; })}
          {frozen && fin !== null && <path d={`M0,0 L0,-260 A260,260 0 ${((ang % 360) > 180) ? 1 : 0},1 ${Math.sin(ang * Math.PI / 180) * 260},${-Math.cos(ang * Math.PI / 180) * 260} Z`} fill={RED} opacity={0.16 * st} />}
          <line x1={0} y1={0} x2={Math.sin(angM * Math.PI / 180) * 150} y2={-Math.cos(angM * Math.PI / 180) * 150} stroke="#2a2420" strokeWidth={14} strokeLinecap="round" />
          <line x1={0} y1={40} x2={Math.sin(ang * Math.PI / 180) * 240} y2={-Math.cos(ang * Math.PI / 180) * 240} stroke={frozen ? RED : "#2a2420"} strokeWidth={6} strokeLinecap="round" />
          <circle r={16} fill={frozen ? RED : "#2a2420"} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1010, top: 330, fontFamily: F, fontWeight: 900, fontSize: 92, color: col, fontVariantNumeric: "tabular-nums", opacity: 1 - st * 0.65 }}>{hms(s)}</div>
      <div style={{ position: "absolute", left: 1006, top: 450, fontFamily: F, fontWeight: 900, fontSize: tag.length > 7 ? 150 : 200, lineHeight: 1, color: RED, opacity: st, transform: `scale(${1.2 - 0.2 * st})`, transformOrigin: "left center", textShadow: `0 0 40px ${RED}66` }}>{tag}</div>
      {sub && <div style={{ position: "absolute", left: 1012, top: 690, width: 820, fontFamily: F, fontWeight: 700, fontSize: 44, color: INK, opacity: ease(f, fz + 10, fz + 20) }}>{sub}</div>}
      <Build a={4} lines={["When do you *quit?*"]} y={70} size={84} />
    </AbsoluteFill>
  );
};

// ───────────────────────── ROSTER de oficios (abre cada parada; al final = tablero con la suma) ─────────────────────────
export const JOBS = [
  { y: "1st c.", job: "FULLER", res: "90 MIN" }, { y: "1348", job: "BODY CARRIER", res: "1 KNOCK" }, { y: "1500s", job: "GONG FARMER", res: "20 MIN" },
  { y: "1600s", job: "GALLEY ROWER", res: "CHAINED" }, { y: "1700s", job: "POWDER MONKEY", res: "1 TRIP" }, { y: "1812", job: "CLIMBING BOY", res: "4 HRS" },
  { y: "1888", job: "MATCH GIRL", res: "1 FINE" }, { y: "1917", job: "RADIUM GIRL", res: "YEARS" }, { y: "1800s", job: "LEECH COLLECTOR", res: "6 LEECHES" },
];
export const Icon: React.FC<{ i: number; c: string }> = ({ i, c }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const g = [
    <g key={0}><path d="M14,46 L86,46 L78,86 L22,86 Z" {...st} /><path d="M26,62 q8,-6 16,0 t16,0 t16,0" {...st} /><path d="M50,10 q-10,14 0,22 q10,-8 0,-22" {...st} /></g>,
    <g key={1}><rect x={14} y={38} width={60} height={30} rx={3} {...st} /><circle cx={30} cy={78} r={10} {...st} /><circle cx={60} cy={78} r={10} {...st} /><path d="M74,46 L94,30" {...st} /></g>,
    <g key={2}><path d="M24,40 L76,40 L68,88 L32,88 Z" {...st} /><path d="M24,40 Q50,6 76,40" {...st} /><path d="M50,14 L50,4" {...st} /></g>,
    <g key={3}><path d="M12,88 L80,20" {...st} /><path d="M80,20 l10,-12 l6,6 l-12,10 z" {...st} /><circle cx={24} cy={56} r={7} {...st} /><circle cx={36} cy={66} r={7} {...st} /><circle cx={48} cy={76} r={7} {...st} /></g>,
    <g key={4}><rect x={28} y={34} width={44} height={54} rx={8} {...st} /><path d="M28,48 L72,48 M28,74 L72,74" {...st} /><path d="M58,24 q8,-14 18,-12 M76,10 l4,-6 M82,16 l7,-2" {...st} /></g>,
    <g key={5}><path d="M50,92 L50,40" {...st} /><path d="M50,36 m-22,0 l44,0 M50,36 m-18,-14 l36,28 M50,36 m18,-14 l-36,28 M50,14 L50,58" {...st} /></g>,
    <g key={6}><path d="M40,92 L60,28" {...st} /><path d="M62,22 q14,-10 4,-20 q-2,12 -12,10 q-4,8 8,10" {...st} /></g>,
    <g key={7}><circle cx={50} cy={52} r={34} {...st} /><path d="M50,52 L50,30 M50,52 L66,60" {...st} />{[0, 1, 2, 3].map((k) => <circle key={k} cx={50 + Math.sin(k * Math.PI / 2) * 26} cy={52 - Math.cos(k * Math.PI / 2) * 26} r={3} fill={c} />)}</g>,
    <g key={8}><path d="M28,26 L72,26 L72,86 Q50,96 28,86 Z" {...st} /><path d="M38,62 q6,-10 12,0 t12,0" {...st} /><path d="M24,26 L76,26" {...st} /></g>,
  ];
  return <svg width={100} height={100} viewBox="0 0 100 100" style={{ overflow: "visible" }}>{g[i]}</svg>;
};
export const JobRoster: React.FC<{ active?: number; final?: number[]; caption?: string }> = ({ active = -1, final, caption }) => {
  const f = useCurrentFrame();
  const W = 192, H = 320, G = 18, X0 = (1920 - (9 * W + 8 * G)) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 58%, #4a2d18 0%, #140c07 78%)` }}>
      <AbsoluteFill style={{ transform: `scale(${1 + Math.min(f, 900) * 0.00011})`, transformOrigin: "50% 48%" }}>
      {JOBS.map((j, i) => {
        const t = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const done = final ? f >= final[i] : i < active;
        const on = i === active, lit = on ? ease(f, 16, 28) : final && done ? ease(f, final[i], final[i] + 8) * 0.6 : 0;
        const dim = !on && !done ? 0.68 : done && !final ? 0.7 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 380 + (1 - t) * 60, width: W, height: H, opacity: t * dim, borderRadius: 12,
            background: "linear-gradient(180deg, #24180f 0%, #4a3020 100%)", border: `3px solid rgba(255,170,90,${0.4 + lit * 0.6})`,
            boxShadow: `inset 0 -40px 60px rgba(255,140,50,${0.15 + lit * 0.4}), 0 0 ${lit * 50}px rgba(255,150,60,${lit * 0.6})`, transform: `scale(${1 + (on ? lit * 0.1 : 0)})`, fontFamily: F, textAlign: "center" }}>
            <div style={{ marginTop: 24, fontSize: 34, fontWeight: 900, color: on ? ORA : INK }}>{i === 8 ? "BONUS" : `#${i + 1}`}</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}><Icon i={i} c={on || (final && done) ? ORA : "rgba(255,190,130,.75)"} /></div>
            <div style={{ marginTop: 18, fontSize: 28, fontWeight: 800, color: INK }}>{j.y}</div>
            <div style={{ marginTop: 6, fontSize: 19, fontWeight: 800, color: "rgba(240,235,229,.7)", letterSpacing: 1, padding: "0 8px" }}>{on || done || final ? j.job : "?"}</div>
            {done && <div style={{ position: "absolute", left: -6, right: -6, top: 112, transform: `rotate(-9deg) scale(${final ? 1.3 - 0.3 * ease(f, final[i], final[i] + 6) : 1})`, opacity: final ? ease(f, final[i], final[i] + 6) : 1,
              border: `4px solid ${RED}`, color: RED, background: "rgba(10,6,4,.78)", fontSize: j.res.length > 7 ? 26 : 34, fontWeight: 900, padding: "6px 0", borderRadius: 6 }}>{j.res}</div>}
          </div>
        );
      })}
      </AbsoluteFill>
      {caption && <Build a={22} lines={[caption]} y={150} size={86} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── MAPA con pin, ruta desde la parada anterior y sello (año / lugar / oficio) ─────────────────────────
const MAP = { L: -82, R: 42, T: 62, B: 24, W: 1920, H: 803 };
const geo = (lon: number, lat: number): [number, number] => [(lon - MAP.L) / (MAP.R - MAP.L) * MAP.W, (MAP.T - lat) / (MAP.T - MAP.B) * MAP.H + (1080 - MAP.H) / 2];
export const PinMap: React.FC<{ d: number; at: [number, number]; prev?: [number, number]; lines: string[]; hot?: number; name: string }> = ({ d, at, prev, lines, hot = 2, name }) => {
  const f = useCurrentFrame();
  const [px, py] = geo(...at); const pp = prev ? geo(...prev) : null;
  const z = 1 + ease(f, 0, d) * 0.5, route = ease(f, 4, 30);
  const left = px > 900;
  const mx = pp ? (pp[0] + px) / 2 : 0, my = pp ? Math.min(pp[1], py) - 160 : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #13304a 0%, #06111c 78%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${px}px ${py}px` }}>
        <Img src={sf("img/t30duraen/map_ocre.png")} style={{ position: "absolute", left: 0, top: (1080 - MAP.H) / 2, width: MAP.W, height: MAP.H, opacity: 0.92 }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {pp && <path d={`M${pp[0]},${pp[1]} Q${mx},${my} ${px},${py}`} fill="none" stroke={INK} strokeWidth={4 / z} strokeDasharray={`${10 / z} ${10 / z}`} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - route } as any} opacity={0.85} />}
          {[0, 1].map((k) => { const ph = ((f + k * 22) % 44) / 44; return <circle key={k} cx={px} cy={py} r={(8 + ph * 46) / z} fill="none" stroke={RED} strokeWidth={4 / z} opacity={1 - ph} />; })}
          <circle cx={px} cy={py} r={9 / z} fill={RED} stroke="#fff" strokeWidth={3 / z} opacity={ease(f, 20, 26)} />
          <text x={px + 18 / z} y={py - 16 / z} fontFamily={F} fontWeight={900} fontSize={30 / z} fill="#fff" opacity={ease(f, 24, 32)} style={{ textTransform: "uppercase" }}>{name}</text>
        </svg>
      </AbsoluteFill>
      <Stamp a={10} lines={lines} hot={hot} x={left ? 110 : 1060} y={330} size={lines.some((l) => l.length > 9) ? 96 : 116} />
    </AbsoluteFill>
  );
};

// ───────────────────────── escenarios ilustrados (siempre algo se mueve) ─────────────────────────
const Push: React.FC<{ d: number; k?: number; ox?: string; children: React.ReactNode }> = ({ d, k = 0.05, ox = "50% 50%", children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1 + k], clamp)})`, transformOrigin: ox, overflow: "hidden" }}>{children}</AbsoluteFill>;
};
const Sky: React.FC<{ night?: number; h?: number }> = ({ night = 0, h = 620 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 38%, ${C.dusk} 62%, ${C.ember} 86%, ${C.glow} 100%)`, height: h + 20, opacity: 1 - night * 0.75 }} />
      {night > 0 && Array.from({ length: 60 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: rnd(i, 4) * h * 0.7, width: 2, height: 2, borderRadius: 1, background: "#fff", opacity: night * (0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))) }} />)}
    </>
  );
};
// tejados de Londres (stacks + humo) con parallax
const Roofs: React.FC<{ base: number; seed?: number; color?: string; drift?: number; smoke?: boolean; lit?: number }> = ({ base, seed = 1, color = "#121b22", drift = 0, smoke = true, lit = 0 }) => {
  const f = useCurrentFrame();
  const els: React.ReactNode[] = [];
  for (let i = 0, x = -150; x < 2200; i++) {
    const w = 140 + rnd(i, seed) * 160, h = 90 + rnd(i, seed + 2) * 140;
    els.push(<path key={"r" + i} d={`M${x},${base} L${x},${base - h} L${x + w * 0.5},${base - h - 50} L${x + w},${base - h} L${x + w},${base} Z`} fill={color} />);
    const cx = x + w * (0.2 + rnd(i, seed + 4) * 0.5);
    els.push(<rect key={"c" + i} x={cx} y={base - h - 70} width={22} height={60} fill={color} />);
    if (smoke) for (let k = 0; k < 4; k++) { const ph = ((f / 50 + k / 4 + rnd(i, 9)) % 1); els.push(<circle key={`s${i}_${k}`} cx={cx + 11 + ph * 60 + Math.sin(ph * 6 + i) * 8} cy={base - h - 80 - ph * 160} r={8 + ph * 22} fill="rgba(160,150,150,.18)" opacity={1 - ph} />); }
    if (lit) for (let k = 0; k < 3; k++) if (rnd(i * 3 + k, seed + 7) < lit) els.push(<rect key={`w${i}_${k}`} x={x + 20 + k * (w - 40) / 3} y={base - h * 0.6} width={18} height={26} fill="#ffc46b" opacity={0.85} />);
    x += w + 6;
  }
  return <svg width={2400} height={1080} style={{ position: "absolute", left: -200 + drift, top: 0 }}>{els}</svg>;
};
const Bricks: React.FC<{ x: number; y: number; w: number; h: number; c1?: string; c2?: string }> = ({ x, y, w, h, c1 = "#5a2f22", c2 = "#3f2018" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: `repeating-linear-gradient(0deg, ${c2} 0 3px, transparent 3px 26px), repeating-linear-gradient(90deg, ${c2} 0 3px, transparent 3px 52px), ${c1}` }} />
);

// 1. chimenea en corte: el chico (vos) sube por el tiro, cae hollín; mode stuck = se queda trabado y el ladrillo se cierra
export const ChimneyScene: React.FC<{ d: number; mode?: "hook" | "climb" | "stuck" | "brush"; o?: Ov }> = ({ d, mode = "climb", o = {} }) => {
  const f = useCurrentFrame();
  const top = 200, bot = 930, fx = 960;
  const prog = mode === "stuck" ? Math.min(ease(f, 0, d * 0.5), 0.55) : ease(f, 0, d * 1.1) * (mode === "hook" ? 0.45 : 0.85);
  const ky = bot - 40 - prog * (bot - top - 120);
  const squeeze = mode === "stuck" ? ease(f, d * 0.45, d * 0.7) : 0;
  const wob = Math.sin(f / 3) * (mode === "stuck" ? 4 * (1 - squeeze) : 2);
  return (
    <Push d={d} k={0.06} ox={`50% ${(ky / 1080) * 100}%`}>
      <Sky night={0.55} h={560} />
      <Roofs base={560} seed={3} color="#16222a" drift={-f * 0.2} />
      <AbsoluteFill style={{ top: 560, background: "#1a1310" }} />
      <Bricks x={fx - 360} y={top} w={720} h={bot - top + 150} />
      {/* el tiro (negro) */}
      <div style={{ position: "absolute", left: fx - 70 + squeeze * 22, top: top - 60, width: 140 - squeeze * 44, height: bot - top + 60, background: "linear-gradient(90deg,#050505,#120c0a 50%,#050505)" }} />
      <div style={{ position: "absolute", left: fx - 110, top: top - 110, width: 220, height: 60, background: "#3f2018" }} />
      {/* hogar */}
      <div style={{ position: "absolute", left: fx - 160, top: bot - 70, width: 320, height: 220, background: "#060404", borderRadius: "140px 140px 0 0", border: "16px solid #2a1712" }} />
      {/* hollín que cae */}
      {Array.from({ length: 40 }).map((_, i) => { const ph = (f / 40 + rnd(i, 5)) % 1; return <div key={i} style={{ position: "absolute", left: fx - 55 + rnd(i, 6) * 110, top: top + ph * (bot - top), width: 5 + rnd(i, 8) * 6, height: 5 + rnd(i, 8) * 6, borderRadius: 4, background: "#3a3a3a", opacity: 0.8 }} />; })}
      {/* el chico: codos y rodillas contra el ladrillo */}
      <div style={{ position: "absolute", left: fx + wob, top: ky, transform: "translate(-50%,-100%)" }}>
        <svg width={120} height={220} viewBox="0 0 120 220" style={{ overflow: "visible" }}>
          <rect x={44} y={70} width={32} height={70} rx={12} fill={C.vest} />
          <rect x={20} y={40} width={10} height={60} rx={5} fill="#d9aa82" transform={`rotate(${-30 + Math.sin(f / 5) * 10} 40 80)`} />
          <rect x={90} y={40} width={10} height={60} rx={5} fill="#d9aa82" transform={`rotate(${30 - Math.sin(f / 5) * 10} 80 80)`} />
          <rect x={30} y={135} width={12} height={70} rx={6} fill="#2d3a5a" transform={`rotate(${30 + Math.sin(f / 5 + 1) * 8} 50 140)`} />
          <rect x={78} y={135} width={12} height={70} rx={6} fill="#2d3a5a" transform={`rotate(${-30 - Math.sin(f / 5 + 1) * 8} 70 140)`} />
          <circle cx={60} cy={50} r={20} fill="#d9aa82" /><path d="M42,46 Q60,22 78,46 L78,40 Q60,16 42,40 Z" fill="#3a2a1a" />
          {mode === "brush" && <><rect x={56} y={-60} width={6} height={80} fill="#6b4a2a" /><circle cx={59} cy={-66} r={22} fill="#1a1a1a" /></>}
        </svg>
      </div>
      {mode === "stuck" && <div style={{ position: "absolute", left: fx - 140, top: ky - 190, width: 280, height: 280, borderRadius: "50%", border: `6px solid ${RED}`, opacity: ease(f, d * 0.6, d * 0.7) * (0.6 + 0.4 * Math.sin(f / 4)) }} />}
      <Overlays o={o} />
    </Push>
  );
};

// 2. portal del tiempo: anillo que gira, el año cambia y vos caminás hacia adentro
export const PortalScene: React.FC<{ d: number; years?: string[]; o?: Ov }> = ({ d, years = ["79", "1348", "1550", "1650", "1750", "1812", "1888", "1917"], o = {} }) => {
  const f = useCurrentFrame();
  const yi = Math.min(years.length - 1, Math.floor(f / Math.max(d / years.length, 1)));
  const px = interpolate(f, [0, d], [520, 860], clamp), ps = interpolate(f, [0, d], [1.0, 0.55], clamp);
  return (
    <Push d={d} k={0.08}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, #1d2b44 0%, #070b14 75%)" }} />
      {Array.from({ length: 90 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 3) * 1920, top: rnd(i, 4) * 1080, width: 2, height: 2, background: "#fff", opacity: 0.3 + 0.7 * Math.abs(Math.sin(f / 15 + i)) }} />)}
      <div style={{ position: "absolute", left: 1060 - 330, top: 480 - 330, width: 660, height: 660, borderRadius: "50%", background: `conic-gradient(from ${f * 4}deg, ${C.glow}, #ff3b30, #2a3550, ${C.glow}, #ffd48a, #2a3550, ${C.glow})`, filter: "blur(2px)", boxShadow: `0 0 120px ${C.glow}88` }} />
      <div style={{ position: "absolute", left: 1060 - 280, top: 480 - 280, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, #0a0f1a 0%, #141c2e 70%, #1d2b44 100%)" }} />
      {Array.from({ length: 3 }).map((_, k) => { const ph = ((f / 30 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: 1060 - 280 * ph, top: 480 - 280 * ph, width: 560 * ph, height: 560 * ph, borderRadius: "50%", border: `3px solid rgba(255,200,140,${(1 - ph) * 0.6})` }} />; })}
      <div style={{ position: "absolute", left: 1060 - 300, top: 400, width: 600, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 150, color: ORA, textShadow: `0 0 30px ${C.glow}` }}>{years[yi]}</div>
      <AbsoluteFill style={{ top: 860, background: "linear-gradient(180deg,#1a1410,#0c0907)" }} />
      <Person x={px} y={866} s={ps} walk />
      <Overlays o={o} />
    </Push>
  );
};

// 3. Roma: taller del fullo (tinas de piedra, vapor, vos pisando la ropa) · mode pots = llegan las vasijas · tax = moneda
export const RomeScene: React.FC<{ d: number; mode?: "stomp" | "pots" | "tubs"; o?: Ov }> = ({ d, mode = "stomp", o = {} }) => {
  const f = useCurrentFrame();
  const bob = Math.abs(Math.sin(f / 5)) * 22;
  const potX = mode === "pots" ? interpolate(f, [0, d * 0.7], [-200, 640], clamp) : -400;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3a2216 0%,#6a3a22 55%,#2a160e 100%)" }} />
      {/* luz cenital */}
      <div style={{ position: "absolute", left: 760, top: -40, width: 420, height: 900, background: "linear-gradient(180deg, rgba(255,210,140,.45), transparent)", clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)", opacity: 0.6 + 0.1 * Math.sin(f / 30) }} />
      {[180, 560, 1360, 1740].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 45, top: 120, width: 90, height: 620, background: "linear-gradient(90deg,#8a6a4a,#c9a57a 50%,#8a6a4a)", borderRadius: 6 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 40, background: "#a88660" }} />
      <AbsoluteFill style={{ top: 740, background: "linear-gradient(180deg,#5a4532,#3a2c20)" }} />
      {/* tinas en corte: el líquido amarillo se ve */}
      {[420, 960, 1500].map((x, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x - 230, top: 700, width: 460, height: 230, background: "#8c8478", borderRadius: "0 0 30px 30px", border: "10px solid #6d665c" }} />
          <div style={{ position: "absolute", left: x - 220, top: 740 + Math.sin(f / 9 + i) * 4, width: 440, height: 180, background: "linear-gradient(180deg,#d8c25a,#a8902e)", borderRadius: "0 0 22px 22px", opacity: 0.92 }} />
          {Array.from({ length: 5 }).map((_, k) => { const ph = ((f / 45 + k / 5 + i * 0.3) % 1); return <div key={k} style={{ position: "absolute", left: x - 140 + k * 60 + Math.sin(ph * 5 + k) * 20, top: 680 - ph * 360, width: 70 + ph * 80, height: 70 + ph * 80, borderRadius: "50%", background: "rgba(255,245,230,.16)", filter: "blur(8px)", opacity: 1 - ph }} />; })}
        </React.Fragment>
      ))}
      {mode !== "tubs" && <div style={{ position: "absolute", left: 0, top: 0 }}><Person x={960} y={830 - bob} s={0.95} arms="down" /></div>}
      {mode !== "tubs" && <div style={{ position: "absolute", left: 960 - 230, top: 790, width: 460, height: 140, background: "linear-gradient(180deg,rgba(216,194,90,.9),#a8902e)", borderRadius: "0 0 22px 22px" }} />}
      {/* olor: ondas verdes sobre la cabeza */}
      {mode === "stomp" && [0, 1, 2].map((k) => { const ph = ((f / 40 + k / 3) % 1); return <svg key={k} width={160} height={80} style={{ position: "absolute", left: 880 + (k - 1) * 70, top: 470 - ph * 140, opacity: 1 - ph }}><path d="M10,60 q20,-30 40,0 t40,0 t40,0" fill="none" stroke="#a9d36b" strokeWidth={7} strokeLinecap="round" /></svg>; })}
      {mode === "pots" && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: potX + k * 110, top: 610, width: 90, height: 120, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(90deg,#8a4a24,#c06a34 50%,#8a4a24)" }} />)}
      {mode === "pots" && <Person x={potX + 360} y={760} s={0.8} walk flip />}
      <Overlays o={o} />
    </Push>
  );
};

// 4. aldea de 1348: chozas con luz; mode sick = se apagan y aparecen cruces · cart = vos con el carro, puerta por puerta · grey = versión apagada
export const VillageScene: React.FC<{ d: number; mode?: "sick" | "cart" | "grey"; o?: Ov }> = ({ d, mode = "cart", o = {} }) => {
  const f = useCurrentFrame();
  const huts = [180, 520, 860, 1200, 1540, 1860];
  const cx = mode === "cart" ? interpolate(f, [0, d], [100, 1500], clamp) : 300;
  const body = (
    <SunsetStage tree="pine" horizon={640} night={0.45} pan={0.25}>
      {huts.map((x, i) => {
        const off = mode === "sick" ? f > (i + 1) * (d / 8) : mode === "grey";
        const cross = mode === "sick" ? ease(f, (i + 1) * (d / 8) + 6, (i + 1) * (d / 8) + 14) : mode === "grey" ? 1 : 0;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 130, top: 520, width: 260, height: 160, background: "#2a1d14" }} />
            <div style={{ position: "absolute", left: x - 170, top: 410, width: 0, height: 0, borderLeft: "170px solid transparent", borderRight: "170px solid transparent", borderBottom: "120px solid #5b4426" }} />
            <div style={{ position: "absolute", left: x - 90, top: 570, width: 46, height: 46, background: off ? "#120c08" : "#ffc46b", boxShadow: off ? "none" : "0 0 30px #ffb04a", opacity: off ? 1 : 0.85 + 0.15 * Math.sin(f / 7 + i) }} />
            <div style={{ position: "absolute", left: x + 20, top: 580, width: 64, height: 100, background: "#3c2a1c", border: "4px solid #1a120c" }} />
            <svg width={80} height={100} style={{ position: "absolute", left: x + 12, top: 576, opacity: cross }}><path d="M40,14 L40,86 M14,44 L66,44" stroke="#c0281e" strokeWidth={10} strokeLinecap="round" /></svg>
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{ top: 680, background: "linear-gradient(180deg,#3a2a1f,#24180f)" }} />
      {mode === "cart" && <>
        <svg width={260} height={160} style={{ position: "absolute", left: cx - 300, top: 700 }}><rect x={10} y={30} width={200} height={70} fill="#5b3d22" /><line x1={210} y1={60} x2={258} y2={40} stroke="#5b3d22" strokeWidth={8} />
          {[50, 170].map((wx) => <g key={wx} transform={`rotate(${f * 6} ${wx} 110)`}><circle cx={wx} cy={110} r={38} fill="none" stroke="#2a1a10" strokeWidth={8} /><line x1={wx - 38} y1={110} x2={wx + 38} y2={110} stroke="#2a1a10" strokeWidth={5} /><line x1={wx} y1={72} x2={wx} y2={148} stroke="#2a1a10" strokeWidth={5} /></g>)}</svg>
        <Person x={cx} y={860} s={0.8} walk flip />
      </>}
    </SunsetStage>
  );
  return <Push d={d} k={0.04}><AbsoluteFill style={{ filter: mode === "grey" ? "grayscale(1) brightness(.75)" : undefined }}>{body}</AbsoluteFill><Overlays o={o} /></Push>;
};

// 5. corte lateral del cementerio: la zanja larga se llena de formas pálidas en fila (abstractas, con respeto)
export const TrenchScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [10, d * 0.85], [0, 9], clamp));
  return (
    <Push d={d} k={0.05}>
      <Sky night={0.5} h={430} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M1380,430 L1380,250 L1420,190 L1460,250 L1460,430 Z M1460,430 L1460,320 L1700,320 L1700,430 Z" fill="#0f1518" />
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${200 + i * 170},430 l0,-50 q20,-30 40,0 l0,50 z`} fill="#141b1e" />)}
        <rect x={0} y={430} width={1920} height={650} fill="#3a2a1f" />
        <rect x={0} y={560} width={1920} height={8} fill="#2e2118" /><rect x={0} y={760} width={1920} height={8} fill="#2e2118" />
        <rect x={180} y={440} width={1560} height={300} fill="#1c130d" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={210 + i * 168} y={640 + (i < n ? 0 : 30)} width={140} height={70} rx={34} fill="#d9d2c2" opacity={i < n ? 0.85 : 0} />)}
        <path d={`M${1760},${430} l40,-140 M1790,300 l20,0`} stroke="#8a7a62" strokeWidth={8} />
      </svg>
      <Person x={interpolate(f, [0, d], [120, 260], clamp)} y={432} s={0.55} walk={f < d * 0.6} />
      <Overlays o={o} />
    </Push>
  );
};

// 6. rayos X cian: la rata y la pulga bajo la lupa ("nadie sabía")
export const FleaScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const lx = interpolate(f, [0, d], [1180, 1080], clamp), hop = Math.abs(Math.sin(f / 6)) * 30;
  const scan = (f * 6) % 1080;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #062236 0%, #020a12 80%)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(79,227,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.08) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 10px ${CYAN})` }}>
        <g fill="none" stroke={CYAN} strokeWidth={5} strokeLinecap="round" opacity={0.9}>
          <path d="M420,640 Q480,470 700,470 Q900,470 980,560 Q1040,600 1080,610 Q1050,650 980,660 Q880,720 700,720 Q520,720 420,640 Z" />
          <path d="M1060,605 l40,-20 M1060,615 l44,4" /><circle cx={1010} cy={585} r={8} />
          <path d="M1000,560 q10,-50 40,-60" /><path d="M420,640 Q300,640 220,720 Q160,780 120,760" />
          <path d="M560,712 l-20,60 M640,716 l-6,64 M860,712 l10,62 M930,700 l30,56" />
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${500 + i * 38},${520 + Math.abs(i - 6) * 6} q8,90 0,180`} opacity={0.35} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: lx - 190, top: 300 - 190, width: 380, height: 380, borderRadius: "50%", border: `8px solid ${CYAN}`, background: "rgba(2,20,30,.85)", boxShadow: `0 0 40px ${CYAN}66` }}>
        <svg width={380} height={380} style={{ position: "absolute", inset: 0 }}><g transform={`translate(190,${210 - hop})`} fill="none" stroke={CYAN} strokeWidth={5}>
          <ellipse rx={70} ry={48} /><path d="M-60,-10 q-30,-10 -40,-30 M60,20 l40,60 l30,-10 M30,40 l20,60 M-20,44 l-10,56 M-50,30 l-40,40" /><circle cx={-62} cy={-6} r={5} /></g></svg>
      </div>
      <svg width={600} height={300} style={{ position: "absolute", left: lx - 520, top: 360 }}><path d="M370,120 L160,240" stroke={CYAN} strokeWidth={4} strokeDasharray="10 10" /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: scan, height: 3, background: `linear-gradient(90deg,transparent,${CYAN},transparent)`, opacity: 0.4 }} />
      <Overlays o={o} />
    </Push>
  );
};

// 7. pozo negro en corte (gong farmer): de noche; vos adentro hasta la cintura, el compañero sube los baldes · fumes = los gases
export const GongPit: React.FC<{ d: number; mode?: "lower" | "bucket" | "fumes"; o?: Ov }> = ({ d, mode = "bucket", o = {} }) => {
  const f = useCurrentFrame();
  const pitL = 720, pitR = 1200, pitT = 600, sludge = 800;
  const youY = mode === "lower" ? interpolate(f, [0, d * 0.7], [600, 880], clamp) : 880;
  const cyc = (f % 70) / 70, bY = mode === "lower" ? 640 : cyc < 0.5 ? interpolate(cyc, [0, 0.5], [820, 420]) : interpolate(cyc, [0.5, 1], [420, 820]);
  const fume = mode === "fumes" ? 1 : 0.4;
  return (
    <Push d={d} k={0.05} ox="50% 70%">
      <Sky night={0.9} h={600} />
      <div style={{ position: "absolute", left: 1560, top: 110, width: 90, height: 90, borderRadius: "50%", background: "#e9e4d0", boxShadow: "0 0 60px #e9e4d088" }} />
      <Roofs base={600} seed={8} color="#0d1418" smoke={false} lit={0.3} />
      <AbsoluteFill style={{ top: 600, background: "linear-gradient(180deg,#3a2a1f,#1c130c)" }} />
      <div style={{ position: "absolute", left: pitL, top: pitT, width: pitR - pitL, height: 420, background: "#140d08", border: "14px solid #4a3a2c", borderTop: "none" }} />
      <div style={{ position: "absolute", left: pitL + 14, top: sludge + Math.sin(f / 12) * 4, width: pitR - pitL - 28, height: 1020 - sludge, background: "linear-gradient(180deg,#4a3a12,#2a200a)" }} />
      {/* vos */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${1080 - sludge - 8}px 0)` }}><Person x={880} y={youY} s={0.85} arms={mode === "bucket" ? "up" : "down"} /></div>
      {/* soga + balde */}
      <div style={{ position: "absolute", left: 1058, top: 360, width: 4, height: bY - 360, background: "#b8a27a" }} />
      <svg width={80} height={80} style={{ position: "absolute", left: 1020, top: bY - 4 }}><path d="M10,10 L70,10 L62,70 L18,70 Z" fill="#6b4a2a" /><path d="M10,10 Q40,-20 70,10" stroke="#b8a27a" strokeWidth={4} fill="none" /></svg>
      <Person x={1300} y={604} s={0.75} arms="up" flip />
      <svg width={120} height={60} style={{ position: "absolute", left: 1000, top: 330 }}><rect x={10} y={20} width={100} height={12} fill="#5b3d22" /><circle cx={60} cy={26} r={14} fill="#3a2a1a" /></svg>
      {/* gases */}
      {Array.from({ length: 7 }).map((_, k) => { const ph = ((f / 50 + k / 7) % 1); return <svg key={k} width={200} height={90} style={{ position: "absolute", left: pitL + 40 + k * 60, top: sludge - 40 - ph * 380, opacity: (1 - ph) * fume }}><path d="M10,60 q25,-36 50,0 t50,0 t50,0" fill="none" stroke="#9cc25a" strokeWidth={8} strokeLinecap="round" /></svg>; })}
      <Overlays o={o} />
    </Push>
  );
};

// 8. calle Tudor de noche: el carro con faroles rueda hacia las afueras (parallax)
export const NightCart: React.FC<{ d: number; o?: Ov; gate?: boolean }> = ({ d, o = {}, gate }) => {
  const f = useCurrentFrame();
  const houses = (base: number, seed: number, drift: number, col: string) => {
    const els: React.ReactNode[] = [];
    for (let i = 0, x = -300; x < 2600; i++) { const w = 180 + rnd(i, seed) * 120, h = 260 + rnd(i, seed + 1) * 180;
      els.push(<div key={i} style={{ position: "absolute", left: x + drift, top: base - h, width: w, height: h, background: col, borderTop: "40px solid " + col }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.35) 0 8px, transparent 8px 60px)" }} />
        {rnd(i, seed + 3) < 0.55 && <div style={{ position: "absolute", left: w * 0.3, top: h * 0.3, width: 34, height: 44, background: "#ffc46b", boxShadow: "0 0 26px #ffb04a", opacity: 0.85 }} />}</div>);
      x += w + 10; }
    return els;
  };
  const cx = interpolate(f, [0, d], [500, 1300], clamp);
  return (
    <Push d={d} k={0.04}>
      <Sky night={0.95} h={700} />
      {houses(760, 2, -f * 0.6, "#151a22")}
      {houses(820, 5, -f * 1.4, "#0c1016")}
      <AbsoluteFill style={{ top: 820, background: "repeating-linear-gradient(90deg,#1b1714 0 60px,#221d19 60px 64px)" }} />
      {gate && <div style={{ position: "absolute", left: 1500 - f * 0.4, top: 360, width: 360, height: 460, background: "#20262c" }}><div style={{ position: "absolute", left: 90, top: 160, width: 180, height: 300, borderRadius: "90px 90px 0 0", background: "#06080a" }} /></div>}
      <svg width={420} height={220} style={{ position: "absolute", left: cx - 380, top: 690 }}>
        {[60, 160, 260].map((bx) => <rect key={bx} x={bx - 40} y={20} width={84} height={100} rx={14} fill="#4a321c" stroke="#2a1a0e" strokeWidth={6} />)}
        <rect x={10} y={110} width={320} height={22} fill="#3a2614" />
        {[70, 270].map((wx) => <g key={wx} transform={`rotate(${f * 5} ${wx} 165)`}><circle cx={wx} cy={165} r={44} fill="none" stroke="#1a110a" strokeWidth={9} /><line x1={wx - 44} y1={165} x2={wx + 44} y2={165} stroke="#1a110a" strokeWidth={5} /><line x1={wx} y1={121} x2={wx} y2={209} stroke="#1a110a" strokeWidth={5} /></g>)}
        <line x1={330} y1={110} x2={400} y2={80} stroke="#3a2614" strokeWidth={9} />
      </svg>
      <div style={{ position: "absolute", left: cx - 50, top: 620 + Math.sin(f / 6) * 6, width: 28, height: 40, background: "#ffd07a", borderRadius: 6, boxShadow: "0 0 50px 20px rgba(255,190,90,.45)" }} />
      <Person x={cx + 60} y={880} s={0.85} walk flip />
      <Overlays o={o} />
    </Push>
  );
};

// 9. galera en corte: fila de remeros en silueta, vos (chaleco) encadenado; el tambor marca el ritmo (speed)
export const GalleyScene: React.FC<{ d: number; speed?: number; ramp?: boolean; o?: Ov; zoomChain?: boolean }> = ({ d, speed = 1, ramp, o = {}, zoomChain }) => {
  const f = useCurrentFrame();
  const sp = ramp ? interpolate(f, [0, d], [1, 2.6], clamp) : speed;
  const ph = ramp ? (f / 30) * (1 + (f / Math.max(d, 1)) * 0.8) * 2 : (f / 30) * sp * 2;
  const oar = Math.sin(ph * Math.PI) * 18;
  const rows = [380, 560, 740, 920, 1100, 1280, 1460];
  return (
    <Push d={d} k={zoomChain ? 0.25 : 0.05} ox={zoomChain ? "38% 72%" : "50% 50%"}>
      <SunsetStage tree="palm" water horizon={560} pan={0.4}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M120,600 L1800,600 Q1760,860 1500,880 L420,880 Q200,860 120,600 Z" fill="#3a2414" />
          <path d="M150,640 L1770,640 L1730,830 L210,830 Z" fill="#22150c" />
          <rect x={150} y={600} width={1650} height={14} fill="#5b3d22" />
        </svg>
        {rows.map((x, i) => {
          const you = i === 2;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 60, top: 760, width: 120, height: 18, background: "#5b3d22" }} />
              <div style={{ position: "absolute", left: x, top: 700, width: 8, height: 360, background: "#7a5530", transformOrigin: "4px 0", transform: `rotate(${24 + oar}deg)` }} />
              <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${-oar * 1.6}px)` }}><Person x={x + 30} y={780} s={0.62} dark={!you} arms="spear" /></div>
              {you && <svg width={120} height={60} style={{ position: "absolute", left: x - 30, top: 760 }}><path d="M70,8 q-20,20 -44,30 q-10,4 -16,14" fill="none" stroke="#9a9a9a" strokeWidth={6} strokeDasharray="10 5" /></svg>}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 1600, top: 690, width: 110, height: 80, borderRadius: 14, background: "#8a5a32", border: "6px solid #3a2414" }} />
        <div style={{ position: "absolute", left: 1640, top: 600 - Math.abs(Math.sin(ph * Math.PI)) * 30, width: 8, height: 90, background: "#2a1a10", transform: "rotate(-20deg)" }} />
        <Person x={1720} y={690} s={0.7} dark arms="up" />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// 10. barco de 3 cubiertas en corte: la santabárbara abajo, vos corrés escaleras arriba con la pólvora; los cañones retroceden
export const ShipDecks: React.FC<{ d: number; mode?: "magazine" | "run" | "fire"; o?: Ov }> = ({ d, mode = "run", o = {} }) => {
  const f = useCurrentFrame();
  const decks = [520, 660, 800];
  const path = [[560, 930], [760, 930], [820, 800], [1040, 800], [1100, 660], [1320, 660], [1380, 520], [1500, 520]];
  const tt = mode === "run" ? ease(f, 0, d * 0.95) * (path.length - 1) : mode === "fire" ? path.length - 1.5 : 0.2;
  const k = Math.min(path.length - 2, Math.floor(tt)), r = tt - k;
  const [x, y] = [path[k][0] + (path[k + 1][0] - path[k][0]) * r, path[k][1] + (path[k + 1][1] - path[k][1]) * r];
  const shots = mode === "magazine" ? [] : [0, 1, 2, 3, 4, 5];
  const zoom = mode === "magazine" ? "32% 86%" : "55% 60%";
  return (
    <Push d={d} k={mode === "magazine" ? 0.12 : 0.05} ox={zoom}>
      <SunsetStage tree="palm" water horizon={420} night={0.35} pan={0.15}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M140,420 L1780,420 Q1760,860 1500,1000 L420,1000 Q180,880 140,420 Z" fill="#2e1d10" />
          {decks.map((y0) => <rect key={y0} x={170} y={y0} width={1590} height={10} fill="#6b4a2a" />)}
          <rect x={170} y={940} width={1590} height={10} fill="#6b4a2a" />
          {/* escaleras */}
          {[[790, 800, 930], [1070, 660, 800], [1350, 520, 660]].map(([lx, y1, y2], i) => <g key={i} stroke="#9a7448" strokeWidth={6}><line x1={lx} y1={y1} x2={lx + 40} y2={y2} /><line x1={lx + 30} y1={y1} x2={lx + 70} y2={y2} />{[0.25, 0.5, 0.75].map((q) => <line key={q} x1={lx + q * 40} y1={y1 + q * (y2 - y1)} x2={lx + 30 + q * 40} y2={y1 + q * (y2 - y1)} />)}</g>)}
          {/* santabárbara */}
          <rect x={380} y={850} width={330} height={90} fill="#5a3a1c" stroke="#b87333" strokeWidth={6} />
          {[420, 490, 560, 630].map((bx) => <rect key={bx} x={bx} y={872} width={50} height={60} rx={10} fill="#3a2614" />)}
        </svg>
        <div style={{ position: "absolute", left: 660, top: 860, width: 30, height: 40, background: "#ffd07a", boxShadow: "0 0 40px 14px rgba(255,190,90,.5)", opacity: 0.85 + 0.15 * Math.sin(f / 5) }} />
        {/* cañones con retroceso */}
        {decks.map((y0, di) => [1520, 1640].map((cx0, ci) => {
          const id = di * 2 + ci, per = 54 + id * 7, ph = ((f + id * 13) % per) / per, rec = shots.includes(id) && ph < 0.15 ? (1 - ph / 0.15) * 30 : 0;
          return <React.Fragment key={id}><div style={{ position: "absolute", left: cx0 - rec, top: y0 - 50, width: 150, height: 28, borderRadius: 10, background: "#111" }} />
            {shots.includes(id) && <div style={{ position: "absolute", left: 1790 + ph * 80, top: y0 - 80 - ph * 40, width: 90 + ph * 160, height: 90 + ph * 160, borderRadius: "50%", background: "rgba(230,225,215,.45)", filter: "blur(10px)", opacity: 1 - ph }} />}</React.Fragment>;
        }))}
        {mode !== "magazine" && Array.from({ length: 6 }).map((_, i) => { const ph = ((f / 60 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 900 + i * 120, top: 420 + ph * 400, width: 160, height: 120, borderRadius: "50%", background: "rgba(200,200,200,.12)", filter: "blur(14px)" }} />; })}
        <Person x={x} y={y} s={0.42} walk={mode === "run"} arms="up" />
        <div style={{ position: "absolute", left: x - 16, top: y - 118, width: 32, height: 30, borderRadius: 6, background: "#2a1a0e", border: "3px solid #ffb04a" }} />
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// 11. fábrica de fósforos 1888: mesas largas, vos mojando los palitos; fines = las multas caen y el sueldo se achica
export const MatchScene: React.FC<{ d: number; mode?: "dip" | "fines"; fines?: { t: string; at: number }[]; o?: Ov }> = ({ d, mode = "dip", fines = [], o = {} }) => {
  const f = useCurrentFrame();
  const dip = Math.abs(Math.sin(f / 6));
  const paid = fines.filter((x) => f >= x.at).length;
  const wage = 1 - paid * 0.18;
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#2a2622 0%,#3a332b 60%,#1c1814 100%)" }} />
      {[260, 760, 1260, 1760].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 110, top: 80, width: 220, height: 380, background: "linear-gradient(180deg,#8a9aa0,#5a6a70)", border: "12px solid #1c1814", opacity: 0.8 }} />)}
      {[260, 760, 1260, 1760].map((x, i) => <div key={"b" + i} style={{ position: "absolute", left: x - 140, top: 460, width: 360, height: 520, background: "linear-gradient(180deg,rgba(200,220,220,.18),transparent)", clipPath: "polygon(20% 0,80% 0,100% 100%,0 100%)" }} />)}
      {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (rnd(i, 4) * 1920 + f * 0.4) % 1920, top: 200 + rnd(i, 5) * 600, width: 3, height: 3, background: "#d9d2c2", opacity: 0.3 }} />)}
      <Person x={820} y={860} s={0.9} arms="down" />
      <div style={{ position: "absolute", left: 560, top: 720 - dip * 30, width: 160, height: 60, background: "#c9a26a", border: "4px solid #6b4a2a", backgroundImage: "repeating-linear-gradient(90deg,#c9a26a 0 6px,#3a2a1a 6px 8px)" }} />
      <div style={{ position: "absolute", left: 300, top: 780, width: 1300, height: 30, background: "#5b3d22" }} />
      <div style={{ position: "absolute", left: 330, top: 810, width: 20, height: 200, background: "#3a2614" }} /><div style={{ position: "absolute", left: 1550, top: 810, width: 20, height: 200, background: "#3a2614" }} />
      <div style={{ position: "absolute", left: 980, top: 740, width: 300, height: 40, background: "#2a2a22", borderRadius: 6 }} />
      {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 34, top: 700 - (i % 2) * 6, width: 26, height: 40, background: "#d8c49a", border: "2px solid #6b4a2a" }} />)}
      {mode === "fines" && <>
        <div style={{ position: "absolute", left: 1380, top: 260, width: 380, fontFamily: F, fontWeight: 800, fontSize: 30, color: INK }}>WAGE
          <div style={{ marginTop: 10, width: 380, height: 40, background: "rgba(255,255,255,.12)", borderRadius: 8 }}><div style={{ width: 380 * Math.max(0.1, wage), height: 40, background: ORA, borderRadius: 8, transition: "none" }} /></div></div>
        {fines.map((x, i) => { const t = ease(f, x.at, x.at + 6); return <div key={i} style={{ position: "absolute", left: 1150 + (i % 2) * 240, top: 380 + i * 92, opacity: t, transform: `rotate(${-8 + i * 3}deg) scale(${1.4 - 0.4 * t})`, border: `5px solid ${RED}`, color: RED, padding: "4px 16px", fontFamily: F, fontWeight: 900, fontSize: 40, background: "rgba(20,10,8,.8)", borderRadius: 6, whiteSpace: "nowrap" }}>FINED: {x.t}</div>; })}
      </>}
      <Overlays o={o} />
    </Push>
  );
};

// 12. rayos X cian: el cráneo de perfil y la mandíbula que brilla apenas (phossy jaw, esquemático y con respeto)
export const JawXray: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const g = ease(f, d * 0.35, d * 0.7) * (0.6 + 0.4 * Math.sin(f / 8));
  return (
    <Push d={d} k={0.06} ox="45% 60%">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 50%, #062236 0%, #020a12 80%)" }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(79,227,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,227,255,.07) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g fill="none" stroke={CYAN} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }}>
          <path d="M640,560 Q600,300 860,250 Q1120,220 1180,420 Q1200,500 1160,560 L1140,640 Q1130,700 1080,700 L1010,700" />
          <ellipse cx={990} cy={450} rx={70} ry={56} /><path d="M1150,520 l40,40 l-30,20" />
          <path d="M700,600 Q760,700 880,720" />
        </g>
        <path d="M880,720 Q900,820 1010,830 Q1090,830 1110,760 L1100,700 L1010,700 Q960,700 930,740 Z" fill={`rgba(157,255,122,${g * 0.35})`} stroke={g > 0.05 ? GLOW : CYAN} strokeWidth={6} style={{ filter: `drop-shadow(0 0 ${8 + g * 30}px ${g > 0.05 ? GLOW : CYAN})` }} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1020 + i * 18} y={702} width={12} height={22} rx={4} fill="none" stroke={CYAN} strokeWidth={3} />)}
      </svg>
      <Overlays o={o} />
    </Push>
  );
};

// 13. huelga: la fila de chicas en silueta sale de la fábrica, todas juntas
export const StrikeScene: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  return (
    <Push d={d} k={0.04}>
      <Sky night={0.25} h={600} />
      <Roofs base={600} seed={11} color="#1a2026" drift={-f * 0.3} />
      <div style={{ position: "absolute", left: 80, top: 300, width: 520, height: 520, background: "#2a2420" }}>
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <div key={r + "" + c} style={{ position: "absolute", left: 40 + c * 120, top: 40 + r * 110, width: 70, height: 70, background: "#ffc46b", opacity: 0.6 }} />))}
        <div style={{ position: "absolute", left: 360, top: 360, width: 130, height: 160, background: "#ffe2a8" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 200, width: 40, height: 140, background: "#2a2420" }} />
      <AbsoluteFill style={{ top: 820, background: "#1e1915" }} />
      {Array.from({ length: 16 }).map((_, i) => { const x = 470 + ((f * 3.2 + i * 95) % 1500), s = 0.5 + rnd(i, 2) * 0.12; return <Person key={i} x={x} y={826 + (i % 3) * 14} s={s} walk dark={i !== 5} arms={i % 4 === 0 ? "up" : "down"} />; })}
      <Overlays o={o} />
    </Push>
  );
};

// 14. taller del radio 1917: luminoso y alegre; lipdip = labio, pincel, dial (3 íconos que se iluminan en orden) · grey = años después, apagado
export const RadiumScene: React.FC<{ d: number; mode?: "bright" | "lipdip" | "grey"; o?: Ov }> = ({ d, mode = "bright", o = {} }) => {
  const f = useCurrentFrame();
  const step = Math.floor((f / 20) % 3);
  const arm = Math.sin(f / 7);
  const body = (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#e6d8bc 0%,#d4c2a0 60%,#8a7a5e 100%)" }} />
      {[280, 760, 1240, 1720].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 140, top: 70, width: 280, height: 400, background: "linear-gradient(180deg,#fff8e0,#f2e2b8)", border: "12px solid #8a7a5e", boxShadow: "0 0 80px rgba(255,240,200,.8)" }} />)}
      {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 120 + r * 220, top: 700 + r * 120, width: 1700, height: 26, background: "#8a5a32" }} />)}
      {Array.from({ length: 4 }).map((_, i) => <Person key={i} x={360 + i * 380} y={712} s={0.7} dark={false} arms="down" />)}
      {Array.from({ length: 24 }).map((_, i) => <div key={"d" + i} style={{ position: "absolute", left: 160 + i * 70, top: 688 + (i % 2) * 120 + (i > 11 ? 0 : 0), width: 28, height: 28, borderRadius: 14, background: "#f4f0dc", border: `3px solid ${GLOW}`, boxShadow: `0 0 ${10 + 6 * Math.sin(f / 9 + i)}px ${GLOW}` }} />)}
    </>
  );
  return (
    <Push d={d} k={0.05}>
      <AbsoluteFill style={{ filter: mode === "grey" ? "grayscale(1) brightness(.55) contrast(1.1)" : undefined }}>{body}</AbsoluteFill>
      {mode === "lipdip" && <div style={{ position: "absolute", left: 560, top: 250, display: "flex", gap: 60 }}>
        {["LIP", "DIP", "PAINT"].map((w, i) => <div key={w} style={{ width: 230, height: 230, borderRadius: "50%", background: i === step ? "#1a1410" : "rgba(26,20,16,.55)", border: `6px solid ${i === step ? GLOW : "rgba(240,235,229,.3)"}`, boxShadow: i === step ? `0 0 40px ${GLOW}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 56, color: i === step ? GLOW : INK, transform: `scale(${i === step ? 1.08 : 0.95})` }}>{w}</div>)}
      </div>}
      {mode === "bright" && <div style={{ position: "absolute", left: 1124, top: 600 - arm * 10, width: 6, height: 60, background: "#3a2614", transform: "rotate(30deg)" }} />}
      <Overlays o={o} />
    </Push>
  );
};

// 15. electrocardiograma que se corta (con respeto: sólo la línea)
export const EcgScene: React.FC<{ d: number; cut?: number; o?: Ov; dim?: boolean }> = ({ d, cut = 0.6, o = {}, dim }) => {
  const f = useCurrentFrame();
  const W = 1920, prog = interpolate(f, [0, d], [0.22, 1], clamp), head = prog * W * 1.15;
  const pts: string[] = [];
  for (let x = 0; x <= Math.min(head, W); x += 6) {
    const flat = x > W * cut;
    const ph = (x % 300) / 300;
    const y = flat ? 0 : ph > 0.4 && ph < 0.44 ? -170 : ph > 0.44 && ph < 0.48 ? 110 : ph > 0.6 && ph < 0.7 ? -30 * Math.sin((ph - 0.6) * 31) : 0;
    pts.push(`${x},${560 + y}`);
  }
  const col = dim ? "#8aa" : "#5dff8a";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #17402c 0%, #07160e 80%)" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(93,255,138,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(93,255,138,.14) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${col})` }} /></svg>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};

// 16. el estanque en corte: vos parada en el agua, las sanguijuelas llegan y se prenden; el contador sube
export const PondScene: React.FC<{ d: number; mode?: "wait" | "bite" | "pull"; n0?: number; o?: Ov }> = ({ d, mode = "wait", n0 = 0, o = {} }) => {
  const f = useCurrentFrame();
  const stuck = mode === "bite" ? Math.min(6, n0 + Math.floor(interpolate(f, [d * 0.15, d * 0.9], [0, 6 - n0 + 0.99], clamp))) : mode === "pull" ? Math.max(0, 6 - Math.floor(f / 18)) : n0;
  const wl = 620;
  const spots = [[925, 760], [990, 790], [935, 850], [985, 880], [930, 930], [992, 950]];
  return (
    <Push d={d} k={0.05} ox="50% 70%">
      <SunsetStage tree="pine" horizon={wl} night={0.1} sunX={1500} pan={0.15}>
        <AbsoluteFill style={{ top: wl, background: "linear-gradient(180deg,#2c4a44 0%,#1a2e2a 60%,#3a2a1a 100%)", opacity: 0.95 }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M0,600 L380,600 Q470,640 520,1080 L0,1080 Z" fill="#4a3426" />
          {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${40 + i * 26},600 q${6 + Math.sin(f / 20 + i) * 6},-80 ${4},-${120 + (i % 3) * 30}`} stroke="#2a3a22" strokeWidth={6} fill="none" />)}
          {mode === "pull" && <g transform="translate(250,560)"><rect x={0} y={0} width={70} height={90} rx={10} fill="rgba(200,230,230,.35)" stroke="#d9e8e8" strokeWidth={4} />{Array.from({ length: 6 - stuck }).map((_, i) => <path key={i} d={`M${12 + (i % 3) * 18},${40 + Math.floor(i / 3) * 24} q6,-8 12,0`} stroke="#111" strokeWidth={6} fill="none" />)}</g>}
        </svg>
        <Person x={960} y={980} s={1.25} arms="down" />
        {/* falda arremangada */}
        <div style={{ position: "absolute", left: 960 - 70, top: 980 - 260 * 1.25 + 190, width: 140, height: 90, background: "#6b4a2a", borderRadius: "10px 10px 30px 30px" }} />
        {/* agua por delante: deja ver las piernas */}
        <AbsoluteFill style={{ top: wl + 60, background: "linear-gradient(180deg,rgba(40,80,72,.25),rgba(20,46,42,.55))" }} />
        {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 330 + f * 1.2) % 2100) - 100, top: wl + 70 + i * 34, width: 140, height: 3, background: "rgba(255,220,170,.18)" }} />)}
        {mode !== "pull" && Array.from({ length: 8 }).map((_, i) => { const t = (f / 90 + rnd(i, 3)) % 1, sx = i % 2 ? 1500 : 420; const x = sx + (960 - sx) * t * 0.8, y = 760 + rnd(i, 4) * 260 + Math.sin(f / 5 + i) * 8;
          return i < 8 - stuck ? <svg key={i} width={60} height={30} style={{ position: "absolute", left: x, top: y }}><path d="M4,15 q14,-12 26,0 t26,0" stroke="#0c0c0c" strokeWidth={8} strokeLinecap="round" fill="none" /></svg> : null; })}
        {spots.slice(0, stuck).map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 12, top: y - 8, width: 24, height: 16 + Math.sin(f / 4 + i) * 2, borderRadius: 8, background: "#0c0c0c" }} />)}
        {mode !== "wait" && <div style={{ position: "absolute", right: 120, top: 260, fontFamily: F, fontWeight: 900, fontSize: 150, color: RED, textShadow: "0 6px 20px rgba(0,0,0,.6)" }}>{stuck}</div>}
      </SunsetStage>
      <Overlays o={o} />
    </Push>
  );
};

// ───────────────────────── gráficos de una idea ─────────────────────────
// a third or more: grilla de figuritas, un tercio se apaga en rojo
export const ThirdGrid: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const N = 60, gone = Math.floor(interpolate(f, [20, d * 0.7], [0, 21], clamp));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1a1210 0%, #070505 75%)" }}>
      {Array.from({ length: N }).map((_, i) => { const r = Math.floor(i / 15), c = i % 15, off = rnd(i, 21) < 0.36 && i % 3 === r % 3 ? 1 : 0; const dead = (i % 3 === 1) && Math.floor(i / 3) < gone;
        return <svg key={i} width={70} height={110} viewBox="0 0 70 110" style={{ position: "absolute", left: 420 + c * 72, top: 420 + r * 120, opacity: dead ? 0.85 : 1 }}><circle cx={35} cy={22} r={16} fill={dead ? RED : "#d9cfc0"} /><rect x={17} y={42} width={36} height={60} rx={14} fill={dead ? RED : "#d9cfc0"} opacity={off ? 1 : 1} /></svg>; })}
      <BigWord a={30} w="1 in 3" color={RED} size={150} y={200} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// línea de tiempo 1775 → 1875: la marca viaja y cuenta los años
export const Timeline100: React.FC<{ d: number; o?: Ov }> = ({ d, o = {} }) => {
  const f = useCurrentFrame();
  const p = ease(f, 15, d * 0.8), yr = Math.round(1775 + p * 100);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#140c08,#090605)" }}>
      <div style={{ position: "absolute", left: 260, top: 620, width: 1400, height: 10, background: "rgba(240,235,229,.25)", borderRadius: 5 }} />
      <div style={{ position: "absolute", left: 260, top: 620, width: 1400 * p, height: 10, background: RED, borderRadius: 5, boxShadow: `0 0 20px ${RED}` }} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 260 + k * 1400 - 14, top: 611, width: 28, height: 28, borderRadius: 14, background: k ? (p > 0.99 ? RED : "#555") : ORA }} />)}
      <div style={{ position: "absolute", left: 180, top: 670, fontFamily: F, fontWeight: 900, fontSize: 64, color: ORA }}>1775</div>
      <div style={{ position: "absolute", left: 180, top: 750, fontFamily: F, fontWeight: 700, fontSize: 32, color: INK, width: 400 }}>Pott links soot to cancer</div>
      <div style={{ position: "absolute", left: 1560, top: 670, fontFamily: F, fontWeight: 900, fontSize: 64, color: p > 0.99 ? RED : "#666" }}>1875</div>
      <div style={{ position: "absolute", left: 1480, top: 750, fontFamily: F, fontWeight: 700, fontSize: 32, color: INK, width: 400, opacity: ease(f, d * 0.8, d * 0.85) }}>Chimney Sweepers Act</div>
      <div style={{ position: "absolute", left: 260 + 1400 * p - 140, top: 470, width: 280, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 90, color: INK, fontVariantNumeric: "tabular-nums" }}>{yr}</div>
      <BigWord a={Math.round(d * 0.82)} w="100 YEARS." color={RED} size={170} y={170} />
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// la moneda que "no huele": moneda que gira sobre fondo oscuro (para el chiste de Vespasiano)
export const CoinFlip: React.FC<{ d: number; img: string; o?: Ov }> = ({ d, img, o = {} }) => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, 40], [720, 0], clamp), up = Math.sin(Math.min(1, f / 40) * Math.PI) * 120;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #2a1c10 0%, #080604 75%)" }}>
      <div style={{ position: "absolute", left: 960 - 260, top: 560 - 260 - up, width: 520, height: 520, borderRadius: "50%", overflow: "hidden", border: "10px solid #b9a77a", transform: `rotateY(${rot}deg) scale(${1 + ease(f, 40, d) * 0.05})`, boxShadow: "0 30px 80px rgba(0,0,0,.7), 0 0 60px rgba(233,199,98,.25)" }}>
        <Img src={sf(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
// la balanza de la paga: plata vs lo que cuesta
export const PayScale: React.FC<{ d: number; o?: Ov; l?: string; r?: string }> = ({ d, o = {}, l = "PAY", r = "RISK" }) => {
  const f = useCurrentFrame();
  const tip = interpolate(spring({ frame: f - 25, fps: 30, config: { damping: 8, mass: 1.3 } }), [0, 1], [-10, 14]);
  const box = (t: string, c: string) => <div style={{ width: 230, height: 150, borderRadius: 16, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 52, color: "#1b1410", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>{t}</div>;
  return (
    <SunsetStage night={0.7} pan={0.2} tree="pine">
      <div style={{ position: "absolute", left: 910, top: 760, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "100px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 360, top: 750, width: 1200, height: 18, borderRadius: 9, background: "#8a5a32", transform: `rotate(${tip}deg)`, transformOrigin: "600px 9px" }}>
        <div style={{ position: "absolute", left: 30, bottom: 18 }}>{box(l, GOLD)}</div>
        <div style={{ position: "absolute", right: 30, bottom: 18 }}>{box(r, RED)}</div>
      </div>
      <Overlays o={o} />
    </SunsetStage>
  );
};
// fondo oscuro + texto (BigWord / Build) para las frases que pegan
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red" }> = ({ d, o = {}, tone = "dark" }) => {
  const f = useCurrentFrame();
  const bg = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6e1a10 0%, #2a0806 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #1f3a58 0%, #0b1622 80%)";
  return <AbsoluteFill style={{ background: bg, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.04], clamp)})` }}><Overlays o={o} /></AbsoluteFill>;
};
// pantalla partida en diagonal: GOOD NEWS. / BAD NEWS.
export const DiagSplit: React.FC<{ d: number; l: string; r: string; wl: string; wr: string; a?: number }> = ({ d, l, r, wl, wr, a = 40 }) => {
  const f = useCurrentFrame();
  const w = ease(f, a, a + 12) * 100, ph = ease(f, 0, d);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "saturate(.75) brightness(.8)" }}><Img src={sf(l)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + ph * 0.04})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${108 - w * 0.56}% 0, 100% 0, 100% 100%, ${92 - w * 0.56}% 100%)` }}>
        <Img src={sf(r)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.75) brightness(.8)", transform: `scale(${1.08 - ph * 0.04})` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={1920 * (1.08 - w * 0.0056)} y1={0} x2={1920 * (0.92 - w * 0.0056)} y2={1080} stroke={INK} strokeWidth={6} opacity={w > 2 ? 1 : 0} /></svg>
      <BigWord a={4} w={wl} color={INK} size={120} x={100} y={150} />
      <BigWord a={a + 10} w={wr} color={RED} size={120} x={1180} y={150} />
    </AbsoluteFill>
  );
};
// campana + pregunta para los comentarios (CTA sin link, sin URL)
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov }> = ({ d, q, bell = true, o = {} }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)" }}>
      <div style={{ position: "absolute", top: 730, left: 0, display: "flex", gap: 22, opacity: 0.5, transform: `translateX(${-((f * 2.2) % (9 * 222))}px)` }}>
        {[...JOBS, ...JOBS, ...JOBS].map((j, i) => (
          <div key={i} style={{ width: 200, height: 250, flex: "none", borderRadius: 12, background: "linear-gradient(180deg, #24180f 0%, #4a3020 100%)", border: "3px solid rgba(255,170,90,.45)", fontFamily: F, textAlign: "center", color: INK }}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}><Icon i={i % 9} c={ORA} /></div>
            <div style={{ marginTop: 16, fontSize: 28, fontWeight: 800 }}>{j.y}</div>
            <div style={{ marginTop: 4, fontSize: 18, fontWeight: 800, color: "rgba(240,235,229,.75)", padding: "0 8px" }}>{j.job}</div>
          </div>
        ))}
      </div>
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 160, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 200, right: 200, top: 480, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 72, color: INK, lineHeight: 1.15, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
