// dur29c — "Durarías 3 Segundos": el peor trabajo de cada CIUDAD (motor clonado de t30duraes). Estilo doc-ilustrado-btg (D:/claude-brain/estilos/doc-ilustrado-btg).
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
        <div key={li} style={{ fontSize: li && l.startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 0 8px rgba(0,0,0,.85), 0 4px 18px rgba(0,0,0,.7)" }}>
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
    <div style={{ position: "absolute", left: 96, bottom: 70, fontFamily: F, fontWeight: 700, fontSize: 50, color: "rgba(240,235,229,.92)", opacity: o, transform: `translateX(${(1 - o) * -20}px)`, textShadow: "0 2px 10px rgba(0,0,0,.7)" }}>
      <div style={{ height: 3, width: 150 * o, background: "rgba(240,235,229,.8)", marginBottom: 8 }} />{t}
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

// brasas que suben lentas: que ninguna tarjeta quede quieta (el QC del farm marca congelado)
export const Embers: React.FC<{ n?: number; c?: string }> = ({ n = 34, c = "255,170,90" }) => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: n }).map((_, i) => { const ph = (f / (240 + rnd(i, 11) * 200) + rnd(i, 12)) % 1; const x = rnd(i, 13) * 1920 + Math.sin(f / 40 + i) * 30; const r = 3 + rnd(i, 14) * 5;
    return <div key={i} style={{ position: "absolute", left: x, top: 1100 - ph * 1200, width: r, height: r, borderRadius: r, background: `rgba(${c},${0.55 * Math.sin(ph * Math.PI)})`, boxShadow: `0 0 ${r * 3}px rgba(${c},.5)` }} />; })}</>;
};
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
      <AbsoluteFill style={{ filter: "blur(28px) brightness(.36) saturate(.8)", transform: "scale(1.15)" }}><Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      {cards.map((c, i) => {
        const t = spring({ frame: f - 3 - i * 12, fps: 30, config: { damping: 15, mass: 0.8 } });
        const tilt = (rnd(i, 7) - 0.5) * 5;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 540 - H / 2 + 40 + (1 - t) * 90, width: W, height: H, opacity: t, transform: `rotate(${tilt * (1 - t * 0.6)}deg)`, borderRadius: 12, overflow: "hidden", border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
            <Img src={sf(c)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - 0.08 * ease(f, i * 12, i * 12 + 90)})` }} />
          </div>
        );
      })}
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
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 3, color: quit ? RED : "rgba(240,235,229,.6)" }}>{quit ? `PARADA ${n} · RENUNCIAS` : `PARADA ${n} · TURNO`}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: col, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{quit && fin === null ? tag : s >= 86400 ? `${Math.floor(s / 86400)} DÍAS` : hms(s)}</div>
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
      <div style={{ position: "absolute", left: 1006, top: 450, fontFamily: F, fontWeight: 900, fontSize: Math.min(200, Math.round(860 / (Math.max(tag.length, 1) * 0.78))), lineHeight: 1, color: RED, opacity: st, transform: `scale(${1.2 - 0.2 * st})`, transformOrigin: "left center", textShadow: `0 0 40px ${RED}66` }}>{tag}</div>
      {sub && <div style={{ position: "absolute", left: 1012, top: 690, width: 820, fontFamily: F, fontWeight: 700, fontSize: 44, color: INK, opacity: ease(f, fz + 10, fz + 20) }}>{sub}</div>}
      <Build a={4} lines={["¿Cuándo *renuncias?*"]} y={70} size={84} />
    </AbsoluteFill>
  );
};

// ───────────────────────── ROSTER de oficios (abre cada parada; al final = tablero con la suma) ─────────────────────────
export const JOBS = [
  { y: "Europa", job: "EL PENITENTE", res: "20 SEG" }, { y: "África", job: "MINERO DE KIMBERLEY", res: "3 MIN" }, { y: "Asia", job: "BUZO DE PERLAS", res: "45 SEG" },
  { y: "América del Norte", job: "OBRERO DEL TREN", res: "10 MIN" }, { y: "América del Sur", job: "SIRINGUERO", res: "1 MES" }, { y: "Oceanía", job: "GOMA KAURI", res: "30 MIN" },
  { y: "Antártida", job: "BALLENERO", res: "1 MIN" },
];
export const Icon: React.FC<{ i: number; c: string }> = ({ i, c }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const g = [
    <g key={0}><path d="M12,92 L74,22" {...st} /><path d="M74,22 Q66,8 78,2 Q90,12 80,24 Z" {...st} /><path d="M8,70 Q30,64 52,74" {...st} /></g>,
    <g key={1}><path d="M4,8 L96,40" {...st} /><path d="M50,24 L50,46" {...st} /><path d="M34,46 L66,46 L60,80 L40,80 Z" {...st} /></g>,
    <g key={2}><path d="M14,58 Q50,20 86,58 Q50,90 14,58 Z" {...st} /><circle cx={50} cy={56} r={10} {...st} /></g>,
    <g key={3}><path d="M6,80 L94,80 M6,92 L94,92" {...st} /><path d="M20,80 L20,92 M42,80 L42,92 M64,80 L64,92 M86,80 L86,92" {...st} /><path d="M30,60 L70,20 M60,12 L78,30" {...st} /></g>,
    <g key={4}><path d="M40,96 L40,8 M60,96 L60,8" {...st} /><path d="M40,40 L60,52 M40,52 L60,64" {...st} /><path d="M66,70 L82,70 L80,90 L68,90 Z" {...st} /></g>,
    <g key={5}><path d="M30,6 L58,86" {...st} /><path d="M6,70 Q50,60 94,72" {...st} /><path d="M58,86 Q70,84 74,94 Q60,100 52,94 Z" {...st} /></g>,
    <g key={6}><path d="M8,60 Q30,30 70,44 Q86,40 94,28 Q92,48 80,54 Q60,76 20,70 Z" {...st} /><path d="M30,94 L70,74" {...st} /></g>,
  ];
  return <svg width={100} height={100} viewBox="0 0 100 100" style={{ overflow: "visible" }}>{g[i]}</svg>;
};
export const JobRoster: React.FC<{ active?: number; final?: number[]; caption?: string }> = ({ active = -1, final, caption }) => {
  const f = useCurrentFrame();
  const N = JOBS.length, W = 190, H = 330, G = 14, X0 = (1920 - (N * W + (N - 1) * G)) / 2;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 58%, #4a2d18 0%, #140c07 78%)`, transform: `scale(${1 + Math.min(f, 900) * 0.00008}) translateX(${Math.sin(f / 70) * 6}px)` }}>
      <Embers />
      {JOBS.map((j, i) => {
        const t = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const done = final ? f >= final[i] : i < active;
        const on = i === active, lit = on ? ease(f, 16, 28) : final && done ? ease(f, final[i], final[i] + 8) * 0.6 : 0;
        const dim = !on && !done ? 0.68 : done && !final ? 0.7 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: X0 + i * (W + G), top: 380 + (1 - t) * 60, width: W, height: H, opacity: t * dim, borderRadius: 12,
            background: "linear-gradient(180deg, #24180f 0%, #4a3020 100%)", border: `3px solid rgba(255,170,90,${0.4 + lit * 0.6})`,
            boxShadow: `inset 0 -40px 60px rgba(255,140,50,${0.15 + lit * 0.4}), 0 0 ${lit * 50}px rgba(255,150,60,${lit * 0.6})`, transform: `scale(${1 + (on ? lit * 0.1 : 0)})`, fontFamily: F, textAlign: "center" }}>
            <div style={{ marginTop: 24, fontSize: 34, fontWeight: 900, color: on ? ORA : INK }}>{`#${i + 1}`}</div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}><Icon i={i} c={on || (final && done) ? ORA : "rgba(255,190,130,.75)"} /></div>
            <div style={{ marginTop: 18, fontSize: j.y.length > 6 ? 24 : 32, fontWeight: 800, color: INK }}>{j.y}</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800, color: "rgba(240,235,229,.7)", letterSpacing: 0.5, padding: "0 8px", lineHeight: 1.15 }}>{on || done || final ? j.job : "?"}</div>
            {done && <div style={{ position: "absolute", left: -6, right: -6, top: 112, transform: `rotate(-9deg) scale(${final ? 1.3 - 0.3 * ease(f, final[i], final[i] + 6) : 1})`, opacity: final ? ease(f, final[i], final[i] + 6) : 1,
              border: `4px solid ${RED}`, color: RED, background: "rgba(10,6,4,.78)", fontSize: j.res.length > 7 ? 26 : 34, fontWeight: 900, padding: "6px 0", borderRadius: 6 }}>{j.res}</div>}
          </div>
        );
      })}
      {caption && <Build a={22} lines={[caption]} y={150} size={86} />}
    </AbsoluteFill>
  );
};

// ───────────────────────── MAPA con pin, ruta desde la parada anterior y sello (año / lugar / oficio) ─────────────────────────
const MAP = { L: -130, R: 180, T: 72, B: -58, W: 1920, H: 805 };
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
        <Img src={sf("img/dur29e/map_mundo.png")} style={{ position: "absolute", left: 0, top: (1080 - MAP.H) / 2, width: MAP.W, height: MAP.H, opacity: 0.92 }} />
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

// fondo oscuro + texto (BigWord / Build) para las frases que pegan
const PhotoBed: React.FC<{ bg?: string; d: number }> = ({ bg, d }) => { const f = useCurrentFrame(); return bg ? <AbsoluteFill style={{ opacity: 0.55, filter: `blur(${10 + ease(f, 0, 20) * 8}px) brightness(.62) saturate(.9)`, transform: `scale(${1.12 + 0.05 * ease(f, 0, Math.max(d, 2))}) translateX(${-f * 0.15}px)` }}><Img src={sf(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : null; };
export const WordCard: React.FC<{ d: number; o?: Ov; tone?: "dark" | "warm" | "red"; bg?: string }> = ({ d, o = {}, tone = "dark", bg }) => {
  const f = useCurrentFrame();
  const grad = tone === "red" ? "radial-gradient(ellipse at 50% 50%, #6a1a10 0%, #1c0606 80%)" : tone === "warm" ? "radial-gradient(ellipse at 50% 60%, #4a2d18 0%, #140c07 78%)" : "radial-gradient(ellipse at 50% 50%, #14263a 0%, #05090f 75%)";
  return <AbsoluteFill style={{ background: grad, transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.06], clamp)})` }}><PhotoBed bg={bg} d={d} /><Embers c={tone === "dark" ? "140,190,255" : "255,150,90"} /><Overlays o={o} /></AbsoluteFill>;
};
// pantalla partida en diagonal: BUENA NOTICIA. / MALA NOTICIA.
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
export const AskCard: React.FC<{ d: number; q: string; bell?: boolean; o?: Ov; bg?: string }> = ({ d, q, bell = true, o = {}, bg }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 14 * (1 - ease(f, 20, 50));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #4a2d18 0%, #140c07 78%)", transform: `scale(${interpolate(f, [0, Math.max(d, 2)], [1, 1.06], clamp)})` }}>
      <PhotoBed bg={bg} d={d} />
      <Embers />
      {bell && <svg width={220} height={240} viewBox="0 0 100 110" style={{ position: "absolute", left: 850, top: 160, transform: `rotate(${sw}deg)`, transformOrigin: "50% 8%" }}>
        <path d="M50,8 C28,8 22,30 22,50 L22,70 L12,84 L88,84 L78,70 L78,50 C78,30 72,8 50,8 Z" fill={ORA} /><circle cx={50} cy={94} r={9} fill={ORA} /><rect x={46} y={0} width={8} height={10} rx={3} fill={ORA} /></svg>}
      <div style={{ position: "absolute", left: 200, right: 200, top: 480, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 72, color: INK, lineHeight: 1.15, opacity: ease(f, 10, 20), transform: `translateY(${(1 - ease(f, 10, 20)) * 20}px)` }}>{q}</div>
      <Overlays o={o} />
    </AbsoluteFill>
  );
};
