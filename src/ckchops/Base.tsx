// ckchops · base del kit (Claude, 11-oct-2026): utilidades de cltoilet/yo1/Min1 adaptadas (2 reels de avatar, clips foto3d, archivo real).
// Todo función pura del frame. Tiempos en SEGUNDOS del video final (= voz recortada).
// Capas por plano: placa (foto/clip con cámara) → grade → anotaciones que viven DENTRO del encuadre → grano.
// Componentes: fondo continuo (un solo plano), materia real adentro, texto entre capas, salida por cámara (match/zoom), nunca pop.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "../claudio/ClTheme";
import AV from "./avwin.json";
export { SERIF, LABEL, HAND };

export const FPS = 30;
export const fr = (s: number) => Math.round(s * FPS);
export const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
export const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const lin = (f: number, a: number, b: number, v0: number, v1: number, e = ez) => v0 + (v1 - v0) * e((f - a) / Math.max(1, b - a));
export const img = (k: string) => staticFile(k.includes("/") ? k : `img/ckchops/${k}.png`);
export const C = { porc: "#FBF8F2", ink: "#2B2620", inkSoft: "#6B6257", sage: "#4E7A50", lilac: "#B4A2C6", lilacDeep: "#6B5786", red: "#C0392B", cream: "#F6EEDC", shadow: "rgba(30,20,10,0.45)" };

// ── avatar: 2 reels pagados (<=235 s c/u): para un segundo del video, qué reel y en qué segundo ──
type Win = { ms: number; me: number; off: number; reel: number; pieces: [number, number][] };
const WINS = (AV as any).win as Win[];
export const avWin = (t: number) => WINS.find((x) => x.pieces.some((p) => t >= p[0] - 0.05 && t <= p[1] + 0.05)) || WINS.reduce((m, x) => (Math.abs(x.ms - t) < Math.abs(m.ms - t) ? x : m), WINS[0]);
export const avAt = (t: number) => { const w = avWin(t); return w.off + (t - w.ms); };
export const avSrc = (t: number) => staticFile(`av/reel${avWin(t).reel}.mp4`);

// ── capas comunes ──
export const Grain: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: `url(${staticFile("img/ckchops/grain.png")})`, backgroundRepeat: "repeat", opacity: 0.06, mixBlendMode: "overlay" }} />
);
export const Grade: React.FC<{ warm?: number; vig?: number }> = ({ warm = 1, vig = 0.32 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background:
    `linear-gradient(180deg, rgba(255,236,200,${0.08 * warm}) 0%, rgba(255,236,200,0) 40%, rgba(24,18,36,0.14) 100%), radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(14,10,22,${vig}) 100%)` }} />
);

// ── un plano: foto o clip con cámara (escala/foco/deriva) + transición de entrada/salida por movimiento ──
export type Tr = "cut" | "whip" | "zoom";
export type Shot = {
  a: number; b: number; k: string; vid?: boolean; ofs?: number; // segundos dentro del clip
  z?: [number, number]; o?: [number, number]; dx?: number; dy?: number; // escala ini/fin, foco % (x,y), deriva px
  tin?: Tr; tout?: Tr; av?: boolean; comp?: React.FC<{ d: number }>; children?: React.ReactNode;
};
export const OV = 6; // cuadros de solape en transiciones con movimiento
export const Plate: React.FC<{ s: Shot; d: number; lead: number }> = ({ s, d, lead }) => {
  const f = useCurrentFrame() - lead; // f=0 en el corte de entrada
  const T = fr(s.b - s.a);
  const [z0, z1] = s.z || [1.04, 1.12];
  const [ox, oy] = s.o || [50, 50];
  const k = f / Math.max(1, T);
  let sc = z0 + (z1 - z0) * k, tx = (s.dx || 0) * (k - 0.5), ty = (s.dy || 0) * (k - 0.5), blur = 0, op = 1;
  // entrada
  if (s.tin === "whip" && f < 0) { const u = (f + OV) / OV; tx += 1920 * (1 - eo(u)); blur = 26 * (1 - u); }
  else if (s.tin === "whip" && f < 3) { blur = 10 * (1 - f / 3); }
  if (s.tin === "zoom" && f < 4) { const u = cl((f + OV) / (OV + 4)); sc *= 1 + 0.55 * (1 - eo(u)); blur = 18 * (1 - u); op = cl((f + OV) / 3); }
  // salida (los cuadros después de T sólo existen si el siguiente entra con movimiento)
  if (f >= T) { const u = (f - T + 1) / OV; if (s.tout === "whip") { tx -= 1920 * ez(u) * 0.9; blur = 26 * u; } if (s.tout === "zoom") { sc *= 1 + 0.9 * ez(u); blur = 16 * u; } }
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", opacity: op }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {s.av ? (
          <OffthreadVideo src={avSrc(s.a)} startFrom={Math.max(0, fr(avAt(s.a)) - lead)} muted style={st} />
        ) : s.vid ? (
          <OffthreadVideo src={staticFile(`clips/${s.k}.mp4`)} startFrom={fr(s.ofs || 0)} muted style={st} />
        ) : (
          <Img src={img(s.k)} style={st} />
        )}
        {s.children}
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};

// ═════════════════════════ COMPONENTES (cada uno = un plano continuo con capas) ═════════════════════════

// marcador rojo dibujado (círculo / tachado / subrayado) — stroke animado
export const Mark: React.FC<{ kind: "circle" | "strike" | "under"; x: number; y: number; w: number; h: number; f: number; at: number; dur?: number; color?: string; sw?: number }> =
  ({ kind, x, y, w, h, f, at, dur = 9, color = C.red, sw = 9 }) => {
    const u = eo((f - at) / dur);
    if (u <= 0) return null;
    const d = kind === "circle"
      ? `M ${w * 0.62} ${h * 0.04} C ${w * 1.02} ${h * 0.08}, ${w * 1.04} ${h * 0.9}, ${w * 0.5} ${h * 0.97} C ${w * 0.02} ${h * 1.0}, ${-w * 0.04} ${h * 0.18}, ${w * 0.42} ${h * 0.02} C ${w * 0.56} ${-h * 0.02}, ${w * 0.7} ${h * 0.03}, ${w * 0.78} ${h * 0.1}`
      : kind === "strike" ? `M ${w * 0.0} ${h * 0.58} C ${w * 0.3} ${h * 0.46}, ${w * 0.7} ${h * 0.5}, ${w} ${h * 0.4}`
      : `M 0 ${h * 0.5} C ${w * 0.35} ${h * 0.62}, ${w * 0.7} ${h * 0.38}, ${w} ${h * 0.5}`;
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }} width={w} height={h}>
        <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
      </svg>
    );
  };
// marco de foto real con canto, paspartú, brillo que barre
export const Print: React.FC<{ k: string; w: number; h: number; f: number; mat?: number; children?: React.ReactNode }> = ({ k, w, h, f, mat = 16, children }) => (
  <div style={{ background: "#FFFDF8", padding: `${mat}px ${mat}px ${mat * 1.25}px`, borderRadius: 3,
    boxShadow: `0 40px 80px ${C.shadow}, 0 6px 14px rgba(0,0,0,0.25), inset 0 1px 0 #fff` }}>
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#ccc" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * Math.sin(f / 50)})` }} />
      <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "28%", left: `${-40 + ((f * 1.3) % 220)}%`, transform: "rotate(14deg)",
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))" }} />
      {children}
    </div>
  </div>
);
export const Chip: React.FC<{ txt: string; size?: number; bg?: string; color?: string; rot?: number; font?: string; ls?: number }> =
  ({ txt, size = 44, bg = "#FFFDF4", color = C.ink, rot = -2, font = LABEL, ls = 3 }) => (
    <div style={{ display: "inline-block", background: bg, color, fontFamily: font, fontWeight: 700, fontSize: size, letterSpacing: ls, textTransform: font === LABEL ? "uppercase" : undefined,
      padding: `${size * 0.16}px ${size * 0.42}px`, borderRadius: 4, transform: `rotate(${rot}deg)`, boxShadow: "0 14px 30px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>{txt}</div>
  );
// fondo continuo: la foto desenfocada en disco (blur barato: escala chica + filtro) con deriva
export const Bed: React.FC<{ k: string; f: number; T: number; dim?: number; z?: [number, number] }> = ({ k, f, T, dim = 0.45, z = [1.12, 1.22] }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, T)})`, filter: `blur(14px) brightness(${1 - dim * 0.65}) saturate(1.05)` }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at 30% 10%, rgba(255,232,190,0.22), rgba(255,232,190,0) 60%)` }} />
    {Array.from({ length: 22 }, (_, i) => {
      const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 13.3) * 43758.5; return x - Math.floor(x); };
      const x = r(1) * 1920 + Math.sin(f / (60 + 40 * r(2)) + r(3) * 6) * 24, y = 1080 - ((f * (0.5 + r(4)) * 1.4 + r(5) * 1080) % 1120);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + 4 * r(6), height: 3 + 4 * r(6), borderRadius: 9, background: "rgba(255,244,222,0.6)", opacity: 0.1 + 0.18 * r(7) }} />;
    })}
  </AbsoluteFill>
);
// cámara del componente: empuja hacia un punto en la salida (match/zoom-through al plano siguiente)
export const Stage: React.FC<{ f: number; T: number; push?: [number, number, number]; drift?: number; children: React.ReactNode }> = ({ f, T, push, drift = 1, children }) => {
  const P = 9; let sc = 1 + 0.03 * drift * f / Math.max(1, T), ox = 50, oy = 50, bl = 0;
  if (push && f > T - P) { const u = ez((f - (T - P)) / P); sc *= 1 + (push[2] - 1) * u; ox = push[0]; oy = push[1]; bl = 0; }
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: bl ? `blur(${bl}px)` : undefined }}>{children}</AbsoluteFill>;
};
export const sp = (f: number, at: number, damping = 13, stiffness = 140) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

// componente: corre en su propio tiempo (f=0 en el corte); la salida con movimiento la hace su Stage
export const CompWrap: React.FC<{ lead: number; d: number; tout?: Tr; children: React.ReactNode }> = ({ lead, d, tout, children }) => {
  const f = useCurrentFrame() - lead;
  let tx = 0, sc = 1, bl = 0;
  if (f >= d && tout === "whip") { const u = (f - d + 1) / OV; tx = -1920 * ez(u) * 0.9; bl = 26 * u; }
  if (f >= d && tout === "zoom") { const u = (f - d + 1) / OV; sc = 1 + 0.9 * ez(u); bl = 16 * u; }
  return <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${sc})`, filter: bl ? `blur(${bl}px)` : undefined }}><Sequence from={lead} layout="none">{children}</Sequence></AbsoluteFill>;
};
