// lkit · núcleo del kit PERMANENTE Loretta v2 (12-oct-2026). Consolidado de fhflies + fhgarlic (aprobados por el dueño).
// Reglas del kit:
//  - Cada componente de PLANO recibe `a` (segundo de entrada en el video) y `d` (duración en CUADROS); los inyecta el Player.
//  - TODO prop de tiempo (`t`, `steps[].t`, `words[][1]`…) es un segundo ABSOLUTO del video (= la palabra en words.json) y
//    tiene que caer DENTRO del plano [a, a + d/30]. El linter del plan lo verifica con src/lkit/kit_schema.json.
//  - Las imágenes se nombran por clave (`n_pan`) y se buscan en `KCFG.imgDir`; una clave con "/" es una ruta de public/.
//  - Look: capas (fondo continuo → materia real → texto entre capas), grade cálido, grano, resorte; el texto se AJUSTA solo (fit).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const fFr = loadFraunces("normal", { weights: ["400", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
const fOs = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin", "latin-ext"] });
const fCv = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
export const SERIF = fFr.fontFamily;
export const LABEL = fOs.fontFamily;
export const HAND = fCv.fontFamily;

// ── configuración por video (llamar setKit() en el entry del video, ANTES de registerRoot) ──
export type Win = { ms: number; me: number; off: number; reel: number; pieces: [number, number][] };
export type KitCfg = {
  imgDir: string; // carpeta de public/ con las fotos del video (p. ej. "img/fhkitchen")
  ext: string; // extensión por defecto de las claves sin extensión
  grain: string; // ruta en public/ del grano
  qr: string; // clave/ruta del QR del CTA
  cover: string; // clave/ruta de la tapa del libro
  arcDir: string; // carpeta de public/ con los cortes de archivo (mp4)
  clipDir: string; // carpeta de public/ con los clips de fotos animadas
  avDir: string; // carpeta de public/ con los reels de avatar
  av?: Win[]; // ventanas del avatar (avwin.json → .win); sin esto, los componentes con avatar usan foto
};
export const KCFG: KitCfg = { imgDir: "img/lkit_demo", ext: "png", grain: "img/lkit_demo/grain.png", qr: "qr.jpg", cover: "book_cover.png", arcDir: "arc", clipDir: "clips", avDir: "av" };
export const setKit = (c: Partial<KitCfg>) => { Object.assign(KCFG, c); };

export const FPS = 30;
export const fr = (s: number) => Math.round(s * FPS);
export const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
export const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
export const lin = (f: number, a: number, b: number, v0: number, v1: number, e = ez) => v0 + (v1 - v0) * e((f - a) / Math.max(1, b - a));
export const img = (k: string) => staticFile(k.includes("/") ? k : /\.[a-z0-9]{3,4}$/i.test(k) ? `${KCFG.imgDir}/${k}` : `${KCFG.imgDir}/${k}.${KCFG.ext}`);
export const clip = (k: string) => staticFile(k.includes("/") ? k : `${KCFG.clipDir}/${k}.mp4`);
export const C = { porc: "#FBF8F2", ink: "#2B2620", inkSoft: "#6B6257", sage: "#4E7A50", lilac: "#A9C1DD", lilacDeep: "#2D5B8C", red: "#C0392B", cream: "#F6EEDC", paper: "#FBF5E6", pen: "#22314F", tape: "#F2C230", shadow: "rgba(30,20,10,0.45)" };
export const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";

// ── texto que se AJUSTA: tamaño de letra para que `txt` entre en `maxW` px en `lines` renglones (estimación conservadora por fuente) ──
export type FontK = "serif" | "label" | "hand";
const CW: Record<FontK, [number, number]> = { serif: [0.56, 0.74], label: [0.47, 0.56], hand: [0.43, 0.55] }; // ancho medio por em [minúsc, MAYÚSC]
export const fit = (txt: string, maxW: number, maxSize: number, font: FontK = "serif", lines = 1, ls = 0, minSize = 18) => {
  const s = String(txt);
  const up = s.replace(/[^A-Za-z]/g, "").length ? s.replace(/[^A-Z]/g, "").length / s.replace(/[^A-Za-z]/g, "").length : 0;
  const w = CW[font][0] + (CW[font][1] - CW[font][0]) * up;
  const longest = s.split(/\s+/).reduce((m, x) => Math.max(m, x.length), 1);
  const perLine = lines <= 1 ? s.length : Math.max(longest, (s.length / lines) * 1.18);
  const size = (maxW - perLine * ls) / Math.max(1, perLine * w);
  return Math.max(minSize, Math.min(maxSize, Math.floor(size)));
};
export const fontOf = (k: FontK) => (k === "serif" ? SERIF : k === "label" ? LABEL : HAND);

// ── avatar (opcional): para un segundo del video, qué reel y en qué segundo ──
const wins = () => KCFG.av || [];
export const hasAv = () => wins().length > 0;
export const avWin = (t: number) => { const W = wins(); return W.find((x) => x.pieces.some((p) => t >= p[0] - 0.05 && t <= p[1] + 0.05)) || W.reduce((m, x) => (Math.abs(x.ms - t) < Math.abs(m.ms - t) ? x : m), W[0]); };
export const avAt = (t: number) => { const w = avWin(t); return w.off + (t - w.ms); };
export const avSrc = (t: number) => staticFile(`${KCFG.avDir}/reel${avWin(t).reel}.mp4`);

// ── capas comunes ──
// helen1: SIN filtros (regla del creador 13-oct): ni grano ni viñeta ni tinte.
export const Grain: React.FC = () => null;
export const Grade: React.FC<{ warm?: number; vig?: number }> = () => null;
export const sp = (f: number, at: number, damping = 13, stiffness = 140) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.8 } });
// reloj del componente: f = cuadros desde el corte; at(t) = cuadro (relativo) de un segundo absoluto
export const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
export type P<T> = React.FC<T & { a: number; d: number }>;

// marcador rojo dibujado (círculo / tachado / subrayado) — trazo animado
export const Mark: React.FC<{ kind: "circle" | "strike" | "under"; x: number; y: number; w: number; h: number; f: number; at: number; dur?: number; color?: string; sw?: number; op?: number }> =
  ({ kind, x, y, w, h, f, at, dur = 9, color = C.red, sw = 9, op = 1 }) => {
    const u = eo((f - at) / dur);
    if (u <= 0) return null;
    const d = kind === "circle"
      ? `M ${w * 0.62} ${h * 0.04} C ${w * 1.02} ${h * 0.08}, ${w * 1.04} ${h * 0.9}, ${w * 0.5} ${h * 0.97} C ${w * 0.02} ${h * 1.0}, ${-w * 0.04} ${h * 0.18}, ${w * 0.42} ${h * 0.02} C ${w * 0.56} ${-h * 0.02}, ${w * 0.7} ${h * 0.03}, ${w * 0.78} ${h * 0.1}`
      : kind === "strike" ? `M ${w * 0.0} ${h * 0.58} C ${w * 0.3} ${h * 0.46}, ${w * 0.7} ${h * 0.5}, ${w} ${h * 0.4}`
      : `M 0 ${h * 0.5} C ${w * 0.35} ${h * 0.62}, ${w * 0.7} ${h * 0.38}, ${w} ${h * 0.5}`;
    return (
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: op, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }} width={w} height={h}>
        <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
      </svg>
    );
  };
// foto real enmarcada (canto, paspartú, brillo que barre)
export const Print: React.FC<{ k: string; w: number; h: number; f: number; mat?: number; filter?: string; children?: React.ReactNode }> = ({ k, w, h, f, mat = 16, filter, children }) => (
  <div style={{ background: "#FFFDF8", padding: `${mat}px ${mat}px ${mat * 1.25}px`, borderRadius: 3,
    boxShadow: `0 40px 80px ${C.shadow}, 0 6px 14px rgba(0,0,0,0.25), inset 0 1px 0 #fff` }}>
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#ccc" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter, transform: `scale(${1.04 + 0.04 * Math.sin(f / 50)})` }} />
      <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "28%", left: `${-40 + ((f * 1.3) % 220)}%`, transform: "rotate(14deg)",
        background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))" }} />
      {children}
    </div>
  </div>
);
// rótulo de papel; con `maxW` el tamaño se ajusta solo para no cortar
export const Chip: React.FC<{ txt: string; size?: number; bg?: string; color?: string; rot?: number; font?: string; ls?: number; maxW?: number }> =
  ({ txt, size = 44, bg = "#FFFDF4", color = C.ink, rot = -2, font = LABEL, ls = 3, maxW }) => {
    const fk: FontK = font === LABEL ? "label" : font === HAND ? "hand" : "serif";
    const s = maxW ? Math.min(size, fit(font === LABEL ? txt.toUpperCase() : txt, maxW - size * 0.84, size, fk, 1, ls)) : size;
    return (
      <div style={{ display: "inline-block", background: bg, color, fontFamily: font, fontWeight: 700, fontSize: s, letterSpacing: ls, textTransform: font === LABEL ? "uppercase" : undefined,
        padding: `${s * 0.16}px ${s * 0.42}px`, borderRadius: 4, transform: `rotate(${rot}deg)`, boxShadow: "0 14px 30px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>{txt}</div>
    );
  };
// fondo continuo: la foto desenfocada con deriva y polvo en la luz (componentes NUNCA sobre fondo vacío)
export const Bed: React.FC<{ k: string; f: number; T: number; dim?: number; z?: [number, number]; blur?: number }> = ({ k, f, T, dim = 0.45, z = [1.12, 1.22], blur = 14 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
    <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, T)})`, filter: `blur(${blur}px) brightness(${1 - dim * 0.65}) saturate(1.05)` }}>
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
// foto (o clip) a pantalla completa con empuje lento
export const FullPhoto: React.FC<{ k: string; vid?: boolean; f: number; d: number; o?: string; dim?: number; z?: [number, number]; filter?: string }> = ({ k, vid, f, d, o = "50% 50%", dim = 0, z = [1.04, 1.12], filter }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
    <AbsoluteFill style={{ transform: vid ? undefined : `scale(${z[0] + (z[1] - z[0]) * f / Math.max(1, d)})`, transformOrigin: o, filter: [dim ? `brightness(${1 - dim})` : "", filter || ""].join(" ").trim() || undefined }}>
      {vid ? <OffthreadVideo src={clip(k)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </AbsoluteFill>
  </AbsoluteFill>
);
// cámara del componente: deriva lenta y, opcional, empuje hacia un punto en la salida (match/zoom al plano siguiente)
export const Stage: React.FC<{ f: number; T: number; push?: [number, number, number]; drift?: number; children: React.ReactNode }> = ({ f, T, push, drift = 1, children }) => {
  const PF = 9; let sc = 1 + 0.03 * drift * f / Math.max(1, T), ox = 50, oy = 50;
  if (push && f > T - PF) { const u = ez((f - (T - PF)) / PF); sc *= 1 + (push[2] - 1) * u; ox = push[0]; oy = push[1]; }
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${ox}% ${oy}%` }}>{children}</AbsoluteFill>;
};
// tilde dibujado (verde o rojo), animado desde el cuadro `at`
export const Tick: React.FC<{ f: number; at: number; size?: number; color?: string; no?: boolean; box?: boolean }> = ({ f, at, size = 52, color, no, box = true }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ flex: "none" }}>
    {box ? <rect x={3} y={3} width={46} height={46} rx={8} fill="none" stroke={C.inkSoft} strokeWidth={3} /> : null}
    {no ? <path d="M 12 12 L 40 40 M 40 12 L 12 40" stroke={color || C.red} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at) / 7)} fill="none" />
      : <path d="M 11 27 L 21 37 L 41 13" stroke={color || C.sage} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at) / 7)} fill="none" />}
  </svg>
);

// ═════════ reproductor de planos (lo usa Player.tsx) ═════════
export type Tr = "cut" | "whip" | "zoom";
export type Shot = {
  a: number; b: number; k: string; vid?: boolean; ofs?: number; rate?: number;
  z?: [number, number]; o?: [number, number]; dx?: number; dy?: number;
  tin?: Tr; tout?: Tr; av?: boolean; children?: React.ReactNode;
};
export const OV = 6; // cuadros de solape en transiciones con movimiento
export const Plate: React.FC<{ s: Shot; d: number; lead: number }> = ({ s, d, lead }) => {
  const f = useCurrentFrame() - lead;
  const T = fr(s.b - s.a);
  const [z0, z1] = s.z || [1.04, 1.12];
  const [ox, oy] = s.o || [50, 50];
  const k = f / Math.max(1, T);
  let sc = z0 + (z1 - z0) * k, tx = (s.dx || 0) * (k - 0.5), blur = 0, op = 1;
  const ty = (s.dy || 0) * (k - 0.5);
  if (s.tin === "whip" && f < 0) { const u = (f + OV) / OV; tx += 1920 * (1 - eo(u)); blur = 26 * (1 - u); }
  else if (s.tin === "whip" && f < 3) { blur = 10 * (1 - f / 3); }
  if (s.tin === "zoom" && f < 4) { const u = cl((f + OV) / (OV + 4)); sc *= 1 + 0.55 * (1 - eo(u)); blur = 18 * (1 - u); op = cl((f + OV) / 3); }
  if (f >= T) { const u = (f - T + 1) / OV; if (s.tout === "whip") { tx -= 1920 * ez(u) * 0.9; blur = 26 * u; } if (s.tout === "zoom") { sc *= 1 + 0.9 * ez(u); blur = 16 * u; } }
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", opacity: op }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: `${ox}% ${oy}%`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        {s.av && hasAv() ? (
          <OffthreadVideo src={avSrc(s.a)} startFrom={Math.max(0, fr(avAt(s.a)) - lead)} muted style={st} />
        ) : s.vid ? (
          <OffthreadVideo src={clip(s.k)} startFrom={fr(s.ofs || 0)} playbackRate={s.rate || 1} muted style={st} />
        ) : (
          <Img src={img(s.k)} style={st} />
        )}
        {s.children}
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};
export const CompWrap: React.FC<{ lead: number; d: number; tout?: Tr; children: React.ReactNode }> = ({ lead, d, tout, children }) => {
  const f = useCurrentFrame() - lead;
  let tx = 0, sc = 1, bl = 0;
  if (f >= d && tout === "whip") { const u = (f - d + 1) / OV; tx = -1920 * ez(u) * 0.9; bl = 26 * u; }
  if (f >= d && tout === "zoom") { const u = (f - d + 1) / OV; sc = 1 + 0.9 * ez(u); bl = 16 * u; }
  return <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${sc})`, filter: bl ? `blur(${bl}px)` : undefined }}><Sequence from={lead} layout="none">{children}</Sequence></AbsoluteFill>;
};

// ── cámara por claves (de los héroes de ckeggs): lleva el punto (x,y) del lienzo 1920x1080 al centro con escala s; cada clave arranca en SU palabra (t) ──
export type Cam = { t: number; s: number; x: number; y: number };
export const camAt = (f: number, at: (t: number) => number, K: Cam[], dur = 1.1): Cam => {
  let c = K[0];
  for (let i = 1; i < K.length; i++) {
    const p = c, q = K[i], u = ez((f - at(q.t)) / (dur * FPS));
    if (f >= at(q.t)) c = { t: q.t, s: p.s + (q.s - p.s) * u, x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u };
  }
  return c;
};
export const camStyle = (c: Cam): React.CSSProperties => ({ transformOrigin: "0 0", transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})` });
