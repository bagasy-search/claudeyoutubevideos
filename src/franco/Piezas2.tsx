// franco01 (Florencia, sastre) — basado en seisho01/fumiko01 v2; 7 reglas baratas (carrusel, progreso con cinta métrica, aperturas con paño, encuadres, mapa, álbum, recap, CTA, etiqueta de precio, cinta métrica)
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND, JP } = FONTS;
const KANJI = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const PINK = "#E4C65A"; // amarillo cinta métrica
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], CL); };

// grano de película (SVG, sin imágenes)
export const Grain: React.FC<{ op?: number }> = ({ op = 0.18 }) => {
  const f = useCurrentFrame(); const id = "gr" + (f % 4);
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: op, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 4} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

export type HabCard = { title: string; src: string };
export const LIST = { n: 7, head: "cheap things", tag: "RULE", short: "RULE" };

// tarjeta de hábito con foto (carrusel / recap)
const HabitPhotoCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: C.paper, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.45)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
      <div style={{ position: "absolute", left: w * 0.03, top: w * 0.03, width: w * 0.16, height: w * 0.16, borderRadius: "50%", border: `${Math.max(2, w * 0.008)}px solid ${C.white}`, background: `radial-gradient(circle at 40% 35%, #A8434A, ${C.ver} 70%)`,
        color: C.white, fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.065, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }}>{KANJI[n]}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.03, marginTop: w * 0.035, height: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.05, color: C.ver, letterSpacing: 2 }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.085, color: C.ink, lineHeight: 1.05, opacity: 1 - dim * 0.5 }}>{title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.22, height: w * 0.22, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(${interpolate(check, [0, 1], [-30, -8])}deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <svg width={w * 0.13} height={w * 0.13} viewBox="0 0 40 40"><path d="M8 21 L17 30 L33 10" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    )}
  </div>
);

// fondo: material real desenfocado
const BlurBg: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.5 }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `blur(22px) brightness(${1 - dark})`, transform: "scale(1.15)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      {src.endsWith(".mp4") ? <OffthreadVideo src={staticFile(src)} muted playbackRate={0.5} style={st} /> : <Img src={staticFile(src)} style={st} />}
    </AbsoluteFill>
  );
};

// (1) carrusel 3D de los N ítems sobre video real desenfocado → termina en abanico
export const Carousel: React.FC<{ cards: HabCard[]; bg: string; subAt: number; dur: number }> = ({ cards, bg, subAt, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 12); const pIn = useIn(0, 22);
  const fanT = ease((f - dur * 0.62) / 34);
  const rot = -f * 0.55;
  const R = 640, PR = 1500;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <BlurBg src={bg} dark={0.45} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(20,12,6,0) 30%, rgba(20,12,6,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 104, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: PINK }}>{cards.length}</span> {LIST.head}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: C.paper, textShadow: shadow, marginTop: 10, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>Almost free.</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        {cards.map((c, i) => {
          const appear = spring({ frame: f - 4 - i * 5, fps: 30, config: { damping: 16, mass: 0.6 } });
          const N = cards.length; const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180;
          const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
          const phi = -26 + i * (52 / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const fx = PR * Math.sin(pr), fy = PR * (1 - Math.cos(pr));
          const x = lerp(rx, fx, fanT), y = lerp(40, fy, fanT), z = lerp(rz, i * 2, fanT);
          const ry = lerp(th, 0, fanT), rzz = lerp(0, phi, fanT);
          const sc = lerp(1, 0.86, fanT) * appear;
          const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fanT);
          return (
            <div key={i} style={{ position: "absolute", left: 960 - 230, top: 350, zIndex: Math.round(2000 + z), opacity: vis * appear,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rzz}deg) scale(${sc})` }}>
              <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={460} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (2) barra de progreso n / 10 en la esquina
export const Progress: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", right: 56, top: 48, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: C.white, textShadow: shadow }}>
        <span style={{ color: PINK }}>{String(n).padStart(2, "0")}</span> / {String(LIST.n).padStart(2, "0")} · {title.toUpperCase()}
      </div>
      <div style={{ position: "relative", width: 7 * 52, height: 26, background: "rgba(228,198,90,0.35)", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: interpolate(f, [0, 16], [(n - 1) * 52, n * 52], { ...CL, easing: Easing.out(Easing.cubic) }), background: C.gold }} />
        {Array.from({ length: LIST.n * 4 + 1 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: i * 13, top: 0, width: 2, height: i % 4 === 0 ? 14 : 7, background: C.ink, opacity: 0.75 }} />
        ))}
        {Array.from({ length: LIST.n }, (_, i) => (
          <div key={"n" + i} style={{ position: "absolute", left: i * 52 + 26, bottom: 1, fontFamily: SANS, fontWeight: 600, fontSize: 11, color: C.ink, transform: "translateX(-50%)" }}>{i + 1}</div>
        ))}
      </div>
    </div>
  );
};

// (5) pincelada sumi que barre la pantalla (dir 0 →, 1 ←, 2 ↓, 3 ↘ en diagonal)
export const InkWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame();
  const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-1.3, 1.3, Easing.inOut(Easing.quad)(t));
  const sign = dir === 1 ? -1 : 1;
  const id = "iw" + dir;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={dir === 2 ? "0.02 0.004" : "0.004 0.02"} numOctaves={2} seed={dir + 3} /><feDisplacementMap in="SourceGraphic" scale={36} /></filter>
          <pattern id={id + "t"} width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="28" height="28" fill="#3B3E44" /><rect width="14" height="28" fill="#33363B" /><line x1="0" y1="0" x2="0" y2="28" stroke="#4A4D53" strokeWidth="2" />
          </pattern>
        </defs>
        <g transform={`rotate(${dir === 3 ? 20 : 0} 960 540)`} filter={`url(#${id})`}>
          {dir === 2
            ? <><rect x={-300} y={540 + pos * 1080 - 800} width={2520} height={1600} fill={`url(#${id}t)`} /><line x1={-300} x2={2220} y1={540 + pos * 1080 + 770} y2={540 + pos * 1080 + 770} stroke={C.chalk} strokeWidth={6} strokeDasharray="26 16" /></>
            : <><rect x={960 + sign * pos * 1920 - 1250} y={-500} width={2500} height={2080} fill={`url(#${id}t)`} /><line y1={-500} y2={1580} x1={960 + sign * pos * 1920 + sign * 1220} x2={960 + sign * pos * 1920 + sign * 1220} stroke={C.chalk} strokeWidth={6} strokeDasharray="26 16" /></>}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// (3) apertura de cada hábito: pincelada → foto a pantalla completa, número trazado, título palabra por palabra
export const HabitScene: React.FC<{ n: number; title: string; src: string; dur: number }> = ({ n, title, src, dur }) => {
  const f = useCurrentFrame();
  const v = n - 1, dir = v % 4, right = v % 2 === 1, mode = Math.floor(v / 2) % 3;
  const o = useOut(dur, 10);
  const k = cl((f - 10) / (dur - 10), 0, 1);
  const z = mode === 0 ? lerp(1.28, 1.08, Easing.out(Easing.cubic)(k)) : mode === 1 ? lerp(1.05, 1.2, k) : 1.14;
  const px = mode === 2 ? lerp(right ? 4 : -4, right ? -4 : 4, k) : 0;
  const draw = interpolate(f, [14, 40], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const fill = interpolate(f, [36, 48], [0, 1], CL);
  const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 120, alignItems: "flex-end" } : { left: 120, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      {f >= 10 && (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}%) scale(${z})` }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(16,11,8,0.85) 0%, rgba(16,11,8,0.4) 45%, rgba(16,11,8,0) 70%)` }} />
          <div style={{ position: "absolute", top: 230, width: 860, display: "flex", flexDirection: "column", ...side }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 10, color: PINK, opacity: draw }}>{LIST.short} {KANJI[n]} · OF VII</div>
            <svg width="560" height="300" viewBox="0 0 560 300" style={{ overflow: "visible" }}>
              <text x={right ? 560 : 0} y="262" textAnchor={right ? "end" : "start"} fontFamily={SERIF} fontWeight={700} fontSize="300"
                fill={`rgba(255,253,248,${fill})`} stroke={C.white} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)}>{String(n).padStart(2, "0")}</text>
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 6 }}>
              {words.map((w, i) => {
                const p = spring({ frame: f - 30 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
              })}
            </div>
            <div style={{ height: 0, borderTop: `5px dashed ${C.chalk}`, marginTop: 18, width: 300 * interpolate(f, [44, 60], [0, 1], CL), opacity: 0.9 }} />
          </div>
        </AbsoluteFill>
      )}
      <InkWipe dir={dir} len={20} />
    </AbsoluteFill>
  );
};

// (4) 50/50: la foto ocupa la mitad derecha (el avatar se corre solo, ver AvatarFramed)
export const SplitPhoto: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12, dur - 10, dur], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const kb = useKB(seed, dur);
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 960, overflow: "hidden", transform: `translateX(${(1 - p) * 102}%)`, borderLeft: `6px solid ${C.paper}`, boxShadow: "-12px 0 40px rgba(0,0,0,0.4)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
    </div>
  );
};

// (4) polaroid que cae al lado del avatar (recuerdos)
export const Polaroid: React.FC<{ src: string; caption: string; dur: number; seed?: number; left?: boolean }> = ({ src, caption, dur, seed = 1, left }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 11, mass: 0.8 } });
  const r = (hash(seed) % 2 ? 1 : -1) * (4 + (hash(seed + 3) % 5));
  return (
    <div style={{ position: "absolute", ...(left ? { left: 130 } : { right: 130 }), top: 160, width: 520, opacity: o, transform: `translateY(${(1 - p) * -1000}px) rotate(${r + (1 - p) * 25}deg)` }}>
      <div style={{ background: "#FBF8F1", padding: "24px 24px 96px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative" }}>
        <div style={{ width: 472, height: 400, overflow: "hidden", position: "relative" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.35) contrast(0.95)" }} />
          <Grain op={0.25} />
        </div>
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.indigo }}>{caption}</div>
        <div style={{ position: "absolute", top: -18, left: 190, width: 140, height: 40, background: "rgba(234,223,203,0.85)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
};

// (8) foto antigua como objeto físico: página de álbum, cinta en las esquinas, grano
export const Album: React.FC<{ src: string; seed: number; dur: number; under?: string }> = ({ src, seed, dur, under }) => {
  const f = useCurrentFrame();
  const t = f / Math.max(1, dur);
  const r = (hash(seed) % 2 ? 1 : -1) * (1.5 + (hash(seed + 1) % 3));
  const tape = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 150, height: 44, background: "rgba(236,226,204,0.82)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", ...s }} />;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #4A3A2C 0%, #2A2019 70%, #1C1510 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.3, backgroundImage: "repeating-linear-gradient(97deg, rgba(255,230,190,0.05) 0 1px, transparent 1px 9px)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * t}) translateY(${-10 * t}px) rotate(${-0.6 * t}deg)` }}>
        {under && (
          <div style={{ position: "absolute", left: 1240, top: 90, width: 560, padding: 18, background: "#EFE6D2", transform: `rotate(${-r * 2.5}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", opacity: 0.8 }}>
            <Img src={staticFile(under)} style={{ width: "100%", height: 380, objectFit: "cover", filter: "sepia(0.6) brightness(0.75)" }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 330, top: 110, width: 1260, padding: "30px 30px 36px", background: "#F1E9D6", transform: `rotate(${r}deg)`, boxShadow: "0 36px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 1200, height: 770, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.25) contrast(1.02)" }} />
            <Grain op={0.3} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 120px rgba(40,25,10,0.45)" }} />
          </div>
          {tape({ left: -48, top: -12, transform: "rotate(-38deg)" })}
          {tape({ right: -48, top: -12, transform: "rotate(38deg)" })}
          {tape({ left: -48, bottom: -12, transform: "rotate(38deg)" })}
          {tape({ right: -48, bottom: -12, transform: "rotate(-38deg)" })}
        </div>
      </AbsoluteFill>
      <Grain op={0.12} />
    </AbsoluteFill>
  );
};

// (7) mapa de Florencia a lápiz con ruta (coordenadas en % de la imagen mapjp, que llena el cuadro)
export const MapJP: React.FC<{ a: [number, number]; b: [number, number]; la: string; ja?: string; lb: string; jb?: string; dur: number }> = ({ a, b, la, ja, lb, jb, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], CL);
  const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
  const span = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]) * 1.78);
  const zEnd = cl(60 / Math.max(span, 6), 1.0, 4);
  const k = ease((f - 4) / 30);
  const z = lerp(Math.max(zEnd, 4.2), zEnd, k), ox = lerp(a[0], cx, k), oy = lerp(a[1], cy, k);
  const line = interpolate(f, [18, 50], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const ax = a[0] * 19.2, ay = a[1] * 10.8, bx = b[0] * 19.2, by = b[1] * 10.8;
  const mx = (ax + bx) / 2 - (by - ay) * 0.25, my = (ay + by) / 2 - Math.abs(bx - ax) * 0.25;
  const pulse = 1 + 0.3 * Math.sin(f / 5);
  const pb = spring({ frame: f - 48, fps: 30, config: { damping: 12 } });
  // traslado para que el punto (ox,oy)% quede en el centro de la pantalla a escala z
  const tx = (50 - ox) * 19.2, ty = (50 - oy) * 10.8;
  const lab = (x: number, y: number, t: string, jp?: string, op = 1) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${1 / z}) translate(24px, -110%)`, transformOrigin: "0 0", whiteSpace: "nowrap", background: "rgba(244,237,225,0.85)", padding: "2px 14px", borderRadius: 4 }}>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: C.ink }}>{t}</span>
      {jp && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 40, color: C.ver, marginLeft: 14 }}>{jp}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile("franco01/g/mapfi.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} fill="none" stroke={C.ver} strokeWidth={6 / z} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - line)} />
          <circle cx={ax} cy={ay} r={(12 / z) * pulse} fill={C.ver} />
          <circle cx={ax} cy={ay} r={(30 / z) * pulse} fill="none" stroke={C.ver} strokeWidth={3 / z} opacity={0.5} />
          <circle cx={bx} cy={by} r={(14 / z) * pb} fill={C.indigo} />
        </svg>
        {lab(ax, ay, la, ja)}
        {lab(bx, by, lb, jb, pb)}
      </AbsoluteFill>
      <Grain op={0.1} />
    </AbsoluteFill>
  );
};

// (10) recap: las 10 tarjetas del carrusel ordenadas en grilla, se tildan una a una
export const RecapGrid: React.FC<{ items: { txt: string; f: number }[]; cards: HabCard[]; bg: string; dur: number }> = ({ items, cards, bg }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  return (
    <AbsoluteFill>
      <BlurBg src={bg} dark={0.5} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 74, color: C.white, textShadow: shadow, opacity: p }}>
        <span style={{ color: PINK }}>{cards.length}</span> cheap things · the Italian way
      </div>
      {cards.map((c, i) => {
        const row = i < 4 ? 0 : 1, col = i < 4 ? i : i - 4, x0 = row === 0 ? 150 : 150 + 205;
        const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + col * 410, top: 190 + row * 420, opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={370} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (10) CTA suave junto al avatar, con la fila de los 10 hábitos
export const CTA: React.FC<{ text: string; cards: HabCard[]; dur: number }> = ({ text, cards, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20), o = useOut(dur, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(16,11,8,0.72) 0%, rgba(16,11,8,0) 40%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 215, textAlign: "center", opacity: p }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 62, color: C.white, textShadow: shadow, borderBottom: `4px solid ${C.ver}`, paddingBottom: 6 }}>{text}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", gap: 14 }}>
        {cards.map((c, i) => {
          const e = spring({ frame: f - 8 - i * 3, fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ width: 170, height: 150, borderRadius: 8, overflow: "hidden", border: `3px solid ${C.paper}`, position: "relative", opacity: e, transform: `translateY(${(1 - e) * 80}px)`, boxShadow: "0 8px 18px rgba(0,0,0,0.45)" }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 6, top: 4, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.white, textShadow: shadow }}>{String(i + 1).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// (4) avatar con encuadres: punch-in 112 % en golpes y corrimiento a la izquierda para el 50/50
export const AvatarFramed: React.FC<{ src: string; seed: number; dur: number; mods?: { a: number; b: number; k: string }[] }> = ({ src, seed, dur, mods = [] }) => {
  const f = useCurrentFrame();
  const inn = hash(seed + 99) % 3 !== 0;
  const t = f / Math.max(1, dur);
  let z = inn ? 1.03 + 0.05 * t : 1.08 - 0.05 * t;
  let tx = 0;
  for (const m of mods) {
    const ra = m.k === "punch" ? 4 : 12, rb = m.k === "punch" ? 6 : 10;
    const w = interpolate(f, [m.a, m.a + ra, Math.max(m.a + ra + 1, m.b - rb), Math.max(m.a + ra + 2, m.b)], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
    if (m.k === "punch") z *= 1 + 0.12 * w;
    if (m.k === "split") tx += -24 * w;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "52% 33%" }} />
    </AbsoluteFill>
  );
};

// etiqueta de precio de sastre colgando de un hilo (prueba de "barato")
const Kraft: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: `linear-gradient(170deg, ${C.paper} 0%, ${C.paper2} 100%)`, position: "relative", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", ...style }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "radial-gradient(rgba(90,64,30,0.25) 1.2px, transparent 1.4px)", backgroundSize: "22px 22px" }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);
export const PriceTag: React.FC<{ price: string; label: string; dur: number; left?: boolean }> = ({ price, label, dur, left }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 7, mass: 0.9 } });
  const sw = Math.sin(f / 9) * 4 * Math.exp(-f / 60) + (1 - p) * 30;
  return (
    <div style={{ position: "absolute", ...(left ? { left: 170 } : { right: 170 }), top: 0, opacity: o, transformOrigin: "50% 0", transform: `rotate(${sw}deg)` }}>
      <div style={{ width: 3, height: 130 + 120 * p, background: "#EFE8DA", margin: "0 auto", boxShadow: "0 0 4px rgba(0,0,0,0.4)" }} />
      <Kraft style={{ width: 320, padding: "34px 26px 28px", clipPath: "polygon(50% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", textAlign: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.28)", margin: "0 auto 14px", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: C.ver, lineHeight: 1 }}>{price}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.ink, marginTop: 10, lineHeight: 1.05 }}>{label}</div>
      </Kraft>
    </div>
  );
};

// cinta métrica amarilla que se desenrolla y marca una medida (cm)
export const Tape: React.FC<{ from: number; to: number; unit: string; label: string; dur: number }> = ({ from, to, unit, label, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const un = interpolate(f, [0, 22], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const mk = spring({ frame: f - 20, fps: 30, config: { damping: 12 } });
  const PX = 34, cms = 49, W = cms * PX;
  const a = from * PX, b = to * PX;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 110, height: 260, opacity: o }}>
      <div style={{ position: "absolute", left: 0, bottom: 40, height: 74, width: W * un, overflow: "hidden", background: C.gold, boxShadow: "0 10px 28px rgba(0,0,0,0.5)", borderRadius: 3 }}>
        {Array.from({ length: cms * 2 + 1 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: i * PX / 2, top: 0, width: 2, height: i % 2 === 0 ? 26 : 14, background: C.ink }} />
        ))}
        {Array.from({ length: cms }, (_, i) => (
          <div key={"t" + i} style={{ position: "absolute", left: i * PX, top: 30, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: C.ink, transform: "translateX(-50%)" }}>{i}</div>
        ))}
        <div style={{ position: "absolute", left: a, width: Math.max(8, b - a), top: 0, bottom: 0, background: "rgba(142,43,51,0.45)", opacity: mk }} />
      </div>
      <div style={{ position: "absolute", left: (a + b) / 2 - 300, width: 600, bottom: 124, textAlign: "center", opacity: mk, transform: `translateY(${(1 - mk) * 20}px)` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 88, color: C.white, textShadow: shadow }}>{unit}</span>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: C.chalk, textShadow: shadow, marginTop: -8, whiteSpace: "nowrap" }}>{label}</div>
      </div>
    </div>
  );
};

// muestras de cuero: zapato + cinturón, igual = tilde, distinto = cruz
export const Match: React.FC<{ pairs: { a: string; b: string; ok: boolean; t: number }[]; dur: number }> = ({ pairs, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", right: 110, top: 150, display: "flex", flexDirection: "column", gap: 26, opacity: o }}>
      {pairs.map((p, i) => {
        const e = spring({ frame: f - p.t, fps: 30, config: { damping: 14 } });
        const m = spring({ frame: f - p.t - 10, fps: 30, config: { damping: 10 } });
        const sw = (c: string, lbl: string) => (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 170, height: 118, borderRadius: 10, background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0) 45%), ${c}`, boxShadow: "inset 0 -6px 14px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.45)", border: "3px dashed rgba(255,255,255,0.35)" }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: C.white, textShadow: shadow }}>{lbl}</div>
          </div>
        );
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: e, transform: `translateX(${(1 - e) * 200}px)` }}>
            {sw(p.a, "SHOES")}{sw(p.b, "BELT")}
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: p.ok ? "#3E6B45" : C.ver, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${m})`, boxShadow: "0 6px 14px rgba(0,0,0,0.45)" }}>
              <svg width="44" height="44" viewBox="0 0 40 40">{p.ok
                ? <path d="M8 21 L17 30 L33 10" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M10 10 L30 30 M30 10 L10 30" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" />}</svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// cronómetro de tiza para "ten seconds / five minutes / thirty seconds"
export const Stopwatch: React.FC<{ secs: number; label: string; dur: number }> = ({ secs, label, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const p = spring({ frame: f, fps: 30, config: { damping: 14 } });
  const t = interpolate(f, [6, Math.min(dur - 8, 50)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const R = 100, L = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", right: 150, top: 140, opacity: o * p, transform: `scale(${0.7 + 0.3 * p})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="280" height="300" viewBox="-140 -160 280 300" style={{ filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.5))" }}>
        <rect x="-16" y="-152" width="32" height="26" rx="5" fill={C.chalk} />
        <circle r="122" fill={C.ink} stroke={C.chalk} strokeWidth="6" />
        {Array.from({ length: 60 }, (_, i) => <line key={i} x1="0" y1="-112" x2="0" y2={i % 5 === 0 ? -96 : -104} stroke={C.chalk} strokeWidth={i % 5 === 0 ? 4 : 2} transform={`rotate(${i * 6})`} opacity={0.85} />)}
        <circle r={R - 30} fill="none" stroke={C.gold} strokeWidth="16" strokeDasharray={`${(L * (R - 30) / R) * t} ${L}`} transform="rotate(-90)" />
        <line x1="0" y1="14" x2="0" y2="-100" stroke={C.ver} strokeWidth="6" strokeLinecap="round" transform={`rotate(${t * 360})`} />
        <circle r="10" fill={C.ver} />
      </svg>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: C.white, textShadow: shadow, marginTop: -6 }}>{label}</div>
    </div>
  );
};
