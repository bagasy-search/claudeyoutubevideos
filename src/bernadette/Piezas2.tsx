// bernadette01 (Okinawa) — basado en fumiko01 v2; lista de N ítems (5 cosas que dejó) (carrusel, progreso, aperturas, pincelada, encuadres, mapa, álbum, recap, CTA)
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND, JP } = FONTS;
const KANJI = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const PINK = "#E7B9A0";
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
export const LIST = { n: 5, head: "steps for a softer neck", tag: "STEP", short: "STEP" };

// tarjeta de hábito con foto (carrusel / recap)
const HabitPhotoCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: C.paper, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.45)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
      <div style={{ position: "absolute", left: w * 0.03, top: w * 0.03, width: w * 0.16, height: w * 0.16, borderRadius: 6, border: `${Math.max(2, w * 0.008)}px solid ${C.ver}`, background: "rgba(255,253,248,0.88)",
        color: C.ver, fontFamily: JP, fontWeight: 500, fontSize: w * 0.09, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-5deg)" }}>{KANJI[n]}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.03, marginTop: w * 0.035, height: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.05, color: C.ver, letterSpacing: 2 }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.085, color: C.ink, lineHeight: 1.05, opacity: 1 - dim * 0.5 }}>{title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.22, height: w * 0.22, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(${interpolate(check, [0, 1], [-30, -8])}deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <span style={{ fontFamily: JP, fontWeight: 500, fontSize: w * 0.12, color: C.white, lineHeight: 1 }}>✓</span>
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
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 104, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: PINK }}>{cards.length}</span> {LIST.head}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 52, color: C.paper, textShadow: shadow, marginTop: 10, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>Three dollars. Two minutes.</div>
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
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: LIST.n }, (_, i) => (
          <div key={i} style={{ width: 44, height: 5, borderRadius: 3, background: i < n ? C.ver : "rgba(255,253,248,0.45)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
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
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={dir === 2 ? "0.06 0.012" : "0.012 0.06"} numOctaves={3} seed={dir + 3} /><feDisplacementMap in="SourceGraphic" scale={140} /></filter>
        </defs>
        <g transform={`rotate(${dir === 3 ? 20 : 0} 960 540)`} filter={`url(#${id})`}>
          {dir === 2
            ? <rect x={-300} y={540 + pos * 1080 - 800} width={2520} height={1600} fill="#F3EEE6" />
            : <rect x={960 + sign * pos * 1920 - 1250} y={-500} width={2500} height={2080} fill="#F3EEE6" />}
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
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 10, color: PINK, opacity: draw }}>{LIST.short} · {KANJI[n]}</div>
            <svg width="560" height="300" viewBox="0 0 560 300" style={{ overflow: "visible" }}>
              <text x={right ? 560 : 0} y="262" textAnchor={right ? "end" : "start"} fontFamily={SERIF} fontWeight={500} fontSize="300"
                fill={`rgba(255,253,248,${fill})`} stroke={C.white} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)}>{String(n).padStart(2, "0")}</text>
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 6 }}>
              {words.map((w, i) => {
                const p = spring({ frame: f - 30 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
              })}
            </div>
            <div style={{ height: 4, background: C.ver, marginTop: 18, width: 260 * interpolate(f, [44, 60], [0, 1], CL) }} />
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
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: C.indigo }}>{caption}</div>
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

// (7) mapa de Japón en tinta con ruta (coordenadas en % de la imagen mapjp, que llena el cuadro)
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
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: C.ink }}>{t}</span>
      {jp && <span style={{ fontFamily: JP, fontWeight: 500, fontSize: 40, color: C.ver, marginLeft: 14 }}>{jp}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile("bernadette01/g/mapjp.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
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
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 74, color: C.white, textShadow: shadow, opacity: p }}>
        <span style={{ color: PINK }}>{cards.length}</span> steps · every night
      </div>
      {cards.map((c, i) => {
        const col = i, row = 0;
        const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 70 + col * 362, top: 300 + row * 420, opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={340} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
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
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 62, color: C.white, textShadow: shadow, borderBottom: `4px solid ${C.ver}`, paddingBottom: 6 }}>{text}</span>
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

// (7) mapa de Chicago dibujado (lino + grilla de calles + lago en salvia): ruta de su vida en 3 paradas con etiqueta de lugar
// coordenadas en px de un lienzo 1920x1080 (norte arriba; el lago a la derecha)
const CHI_PTS = { yards: [880, 860], state: [1290, 560], jackowo: [905, 335] } as const;
export const MapCHI: React.FC<{ stops: { k: keyof typeof CHI_PTS; label: string; sub: string; at: number }[]; dur: number }> = ({ stops, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], CL);
  const z = interpolate(f, [0, dur], [1.12, 1.0], { ...CL, easing: Easing.out(Easing.quad) });
  const shore = "M1390 0 C1400 140 1372 260 1388 380 C1402 470 1370 520 1352 600 C1340 690 1420 780 1470 880 C1500 950 1530 1010 1560 1080 L1920 1080 L1920 0 Z";
  const grid: React.ReactNode[] = [];
  for (let x = 120; x < 1500; x += 70) grid.push(<line key={"v" + x} x1={x} y1={0} x2={x} y2={1080} stroke="rgba(43,35,32,0.08)" strokeWidth={x % 280 === 120 ? 3 : 1.4} />);
  for (let y = 40; y < 1080; y += 70) grid.push(<line key={"h" + y} x1={0} y1={y} x2={1500} y2={y} stroke="rgba(43,35,32,0.08)" strokeWidth={y % 280 === 40 ? 3 : 1.4} />);
  const pts = stops.map((s) => CHI_PTS[s.k]);
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "55% 50%" }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {grid}
          {/* Milwaukee Ave: la diagonal noroeste desde el centro */}
          <path d="M1250 520 L520 0" stroke="rgba(180,98,58,0.35)" strokeWidth={7} />
          <path d={shore} fill="#C9D3C6" />
          <path d={shore} fill="none" stroke="#7E9180" strokeWidth={3} />
          {/* río Chicago */}
          <path d="M1370 520 L1180 520 L1120 470 L1080 300 M1180 520 L1150 640 L1080 760" fill="none" stroke="#A9B9A6" strokeWidth={9} strokeLinecap="round" />
          {pts.slice(1).map((b, i) => {
            const a = pts[i]; const t0 = stops[i + 1].at - 26;
            const line = interpolate(f, [t0, t0 + 26], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
            const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
            return <path key={i} d={`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`} fill="none" stroke={C.ver} strokeWidth={6} strokeLinecap="round" strokeDasharray="1 14" pathLength={1000}
              style={{ strokeDasharray: `${1000 * line} 1000` }} />;
          })}
          {pts.map((p, i) => {
            const s = spring({ frame: f - stops[i].at, fps: 30, config: { damping: 12 } });
            const pulse = 1 + 0.25 * Math.sin((f - stops[i].at) / 5);
            return <g key={i} opacity={s}><circle cx={p[0]} cy={p[1]} r={34 * pulse * s} fill="none" stroke={C.ver} strokeWidth={3} opacity={0.45} /><circle cx={p[0]} cy={p[1]} r={14 * s} fill={C.ver} /></g>;
          })}
        </svg>
        {stops.map((s, i) => {
          const p = pts[i]; const e = spring({ frame: f - s.at - 4, fps: 30, config: { damping: 15 } });
          const left = p[0] > 1100;
          return (
            <div key={i} style={{ position: "absolute", left: left ? undefined : p[0] + 40, right: left ? 1920 - p[0] + 40 : undefined, top: p[1] - 62, opacity: e, transform: `translateY(${(1 - e) * 20}px)`,
              background: "rgba(255,253,251,0.92)", padding: "10px 22px", borderLeft: `5px solid ${C.ver}`, boxShadow: "0 8px 22px rgba(43,35,32,0.18)", textAlign: left ? "right" : "left" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 48, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{s.label}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: C.indigo, marginTop: 4, whiteSpace: "nowrap" }}>{s.sub.toUpperCase()}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 120, top: 120, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 64, color: "#5E7563" }}>Lake Michigan</div>
        <div style={{ position: "absolute", left: 90, top: 70, fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 10, color: "rgba(43,35,32,0.55)" }}>CHICAGO</div>
      </AbsoluteFill>
      <Grain op={0.08} />
    </AbsoluteFill>
  );
};

// tarjeta de dato con fuente real (estilo ficha de tratamiento)
export const SourceCard: React.FC<{ big: string; line: string; src: string; dur: number }> = ({ big, line, src, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 18); const o = useOut(dur, 10);
  const bar = interpolate(f, [8, 30], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 110, bottom: 120, width: 760, opacity: o * p, transform: `translateX(${(1 - p) * -60}px)`, background: "rgba(255,253,251,0.95)", padding: "34px 40px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", borderTop: `8px solid ${C.ver}` }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 6, color: C.indigo }}>WHAT THE RESEARCH SAYS</div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: C.ver, lineHeight: 1.05, marginTop: 6 }}>{big}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 40, color: C.ink, lineHeight: 1.2, marginTop: 6 }}>{line}</div>
      <div style={{ height: 2, background: C.paper2, margin: "20px 0 12px", width: `${bar * 100}%` }} />
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 20, color: "rgba(43,35,32,0.7)", fontStyle: "italic" }}>{src}</div>
    </div>
  );
};
