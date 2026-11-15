// seisho01 (Okinawa) — basado en fumiko01 v2; lista de N ítems (5 cosas que dejó) (carrusel, progreso, aperturas, pincelada, encuadres, mapa, álbum, recap, CTA)
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND, JP } = FONTS;
const KANJI = ["", ...Array.from({ length: 40 }, (_, i) => String(i + 1))];
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const PINK = "#E3BC52";
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useIn = (delay = 0, damping = 18) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } }); };
const useOut = (dur: number, len = 10) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [1, 0], CL); };

// grano de película (SVG, sin imágenes)
export const Grain: React.FC<{ op?: number }> = () => null; // sin grano (VARA)

export type HabCard = { title: string; src: string };
export const LIST = { n: 10, head: "lugares", tag: "LUGAR", short: "LUGAR" };

// tarjeta de hábito con foto (carrusel / recap)
const HabitPhotoCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: C.paper, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.45)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
      <div style={{ position: "absolute", left: w * 0.03, top: w * 0.03, width: w * 0.16, height: w * 0.16, borderRadius: 6, border: `${Math.max(2, w * 0.008)}px solid ${C.ver}`, background: "rgba(255,253,248,0.88)",
        color: C.ver, fontFamily: JP, fontWeight: 700, fontSize: w * 0.09, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-5deg)" }}>{KANJI[n]}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.03, marginTop: w * 0.035, height: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.05, color: C.ver, letterSpacing: 2 }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.085, color: C.ink, lineHeight: 1.05, opacity: 1 - dim * 0.5 }}>{title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.22, height: w * 0.22, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(${interpolate(check, [0, 1], [-30, -8])}deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <span style={{ fontFamily: JP, fontWeight: 700, fontSize: w * 0.12, color: C.white, lineHeight: 1 }}>✓</span>
      </div>
    )}
  </div>
);

// fondo: material real desenfocado
const BlurBg: React.FC<{ src: string; dark?: number }> = ({ src, dark = 0.5 }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - dark})`, transform: "scale(1.04)" };
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
  const BIG = cards.length > 16; const R = BIG ? 1150 : cards.length > 8 ? 820 : 640, PR = BIG ? 1500 : cards.length > 8 ? 1300 : 1200; const CW = BIG ? 250 : cards.length > 8 ? 330 : 460, FAN = BIG ? 56 : cards.length > 8 ? 62 : 52;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <BlurBg src={bg} dark={0.45} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(20,12,6,0) 30%, rgba(20,12,6,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 104, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: PINK }}>{cards.length}</span> {LIST.head}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: C.paper, textShadow: shadow, marginTop: 10, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>Donde casi todos la esconden.</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%", transform: `scale(${interpolate(f, [dur * 0.62, dur], [1, 1.09], CL)}) rotate(${interpolate(f, [dur * 0.62, dur], [0, -1.6], CL)}deg)` }}>
        {cards.map((c, i) => {
          const appear = spring({ frame: f - 4 - i * 5, fps: 30, config: { damping: 16, mass: 0.6 } });
          const N = cards.length; const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180;
          const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
          const phi = -FAN / 2 + i * (FAN / Math.max(1, N - 1)), pr = (phi * Math.PI) / 180;
          const fx = PR * Math.sin(pr), fy = PR * (1 - Math.cos(pr));
          const x = lerp(rx, fx, fanT), y = lerp(40, fy, fanT), z = lerp(rz, i * 2, fanT);
          const ry = lerp(th, 0, fanT), rzz = lerp(0, phi, fanT);
          const sc = lerp(1, 0.86, fanT) * appear;
          const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fanT);
          return (
            <div key={i} style={{ position: "absolute", left: 960 - CW / 2, top: 350, zIndex: Math.round(2000 + z), opacity: vis * appear,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rzz}deg) scale(${sc})` }}>
              <HabitPhotoCard n={(c as any).num ?? i + 1} title={c.title} src={c.src} w={CW} />
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
          <div key={i} style={{ width: LIST.n > 30 ? 11 : LIST.n > 12 ? 20 : 44, height: 5, borderRadius: 3, background: i < n ? C.ver : "rgba(255,253,248,0.45)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
        ))}
      </div>
    </div>
  );
};

// (5) "hoja de puerta": panel verde del taller con canto de latón que barre la pantalla como una puerta que se cierra y se abre (CSS, sin filtros)
export const InkWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 20 }) => {
  const f = useCurrentFrame();
  const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-1.05, 1.05, Easing.inOut(Easing.cubic)(t));
  const vert = dir === 2, sign = dir === 1 ? -1 : 1;
  const tr = vert ? `translateY(${pos * 100}%)` : `translateX(${sign * pos * 100}%)`;
  const edge: React.CSSProperties = vert ? { left: 0, right: 0, height: 18, top: pos < 0 ? "auto" : 0, bottom: pos < 0 ? 0 : "auto" } : { top: 0, bottom: 0, width: 18, left: (sign * pos) < 0 ? "auto" : 0, right: (sign * pos) < 0 ? 0 : "auto" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: C.indigo, transform: tr }}>
        <div style={{ position: "absolute", background: `linear-gradient(${vert ? 180 : 90}deg, #8A6A1C, ${C.gold}, #8A6A1C)`, ...edge }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (3) apertura de cada hábito: pincelada → foto a pantalla completa, número trazado, título palabra por palabra
export const HabitScene: React.FC<{ n: number; title: string; src: string; dur: number }> = ({ n, title, src, dur }) => {
  const f = useCurrentFrame();
  const v = n - 1, dir = v % 4, right = v % 2 === 1, mode = Math.floor(v / 2) % 3;
  const o = useOut(dur, 10);
  const k = cl((f - 10) / (dur - 10), 0, 1);
  const z = lerp(1.02, 1.16, k);
  const roll = spring({ frame: f - 24, fps: 30, config: { damping: 14, mass: 0.8 } });
  const px = mode === 2 ? lerp(right ? 3 : -3, right ? -3 : 3, k) : 0;
  const tin = spring({ frame: f - 14, fps: 30, config: { damping: 16, mass: 0.7 } });
  const tout = interpolate(f, [dur - 26, dur - 14], [1, 0], CL);
  const t = Math.min(tin, tout);
  const line = interpolate(f, [26, 42], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const side: React.CSSProperties = right ? { right: 110, alignItems: "flex-end", textAlign: "right" } : { left: 110, alignItems: "flex-start", textAlign: "left" };
  return (
    <AbsoluteFill>
      {(
        <AbsoluteFill style={{ opacity: Math.min(o, interpolate(f, [0, 10], [0, 1], CL)) }}>
          <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}%) scale(${z})` }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: t, background: `linear-gradient(${right ? 270 : 90}deg, rgba(12,9,7,0.95) 0%, rgba(12,9,7,0.9) 50%, rgba(12,9,7,0.5) 66%, rgba(12,9,7,0) 82%)` }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", opacity: t, transform: `translateY(${(1 - tin) * 30}px)`, ...side }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, letterSpacing: 5, color: PINK, textShadow: shadow }}>{LIST.short} {n} DE {LIST.n}</div>
            <div style={{ height: 230, overflow: "hidden" }}><div style={{ transform: `translateY(${-230 * roll}px)` }}>{[n - 1, n].map((x) => (<div key={x} style={{ height: 230, fontFamily: SANS, fontWeight: 900, fontSize: 230, lineHeight: 1, fontVariantNumeric: "lining-nums tabular-nums", fontFeatureSettings: '"lnum" 1, "tnum" 1', color: C.white, textShadow: shadow }}>{String(x).padStart(2, "0")}</div>))}</div></div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 22 ? 100 : 120, lineHeight: 1.05, color: C.white, textShadow: shadow, maxWidth: 880, textWrap: "balance" as any }}>{title}</div>
            <div style={{ height: 8, borderRadius: 4, background: C.ver, marginTop: 22, width: 300 * line }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

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
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: C.ink }}>{t}</span>
      {jp && <span style={{ fontFamily: JP, fontWeight: 700, fontSize: 40, color: C.ver, marginLeft: 14 }}>{jp}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile("seisho01/g/mapjp.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
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
        <span style={{ color: PINK }}>{cards.length}</span> escondites · repaso
      </div>
      {cards.map((c, i) => {
        const per = cards.length > 6 ? 6 : cards.length; const col = i % per, row = Math.floor(i / per); const GW = cards.length > 6 ? 270 : 340, GX = cards.length > 6 ? 296 : 362;
        const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 78 + col * GX, top: (cards.length > 6 ? 190 : 300) + row * (cards.length > 6 ? 410 : 420), opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <HabitPhotoCard n={(c as any).num ?? i + 1} title={c.title} src={c.src} w={GW} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// (10) CTA suave junto al avatar, con la fila de los 10 hábitos
export const CTA: React.FC<{ text: string; cards: HabCard[]; dur: number; com?: boolean }> = ({ text, dur, com }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 14);
  const btn = spring({ frame: f - 2, fps: 30, config: { damping: 13, mass: 0.7 } });
  const txt = spring({ frame: f - 14, fps: 30, config: { damping: 16, mass: 0.7 } });
  const band = (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: txt, transform: `translateY(${(1 - txt) * 24}px)` }}>
      <div style={{ background: "rgba(12,9,7,0.88)", borderRadius: 18, padding: "18px 40px", maxWidth: 1600, fontFamily: SANS, fontWeight: 800, fontSize: text.length > 48 ? 66 : 78, lineHeight: 1.12, color: C.white, textAlign: "center", textWrap: "balance" as any }}>{text}</div>
    </div>
  );
  if (com) {
    const T0 = 50, T1 = T0 + Math.round(text.length * 1.75);
    const shown = Math.floor(interpolate(f, [T0, T1], [0, text.length], CL));
    const typing = f < T1 + 8;
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(12,9,7,0.7) 0%, rgba(12,9,7,0) 50%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 120}px)` }}>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", background: "#FFFFFF", borderRadius: 26, padding: "30px 40px", width: 1400, boxShadow: "0 20px 50px rgba(0,0,0,0.55)" }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: C.indigo, color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>C</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: "#555" }}>Claudio el Cerrajero · 📌 fijado</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, lineHeight: 1.18, color: "#111", minHeight: 200 }}>{text.slice(0, shown)}{typing && <span style={{ opacity: f % 30 < 15 ? 1 : 0, color: "#D42A20" }}>|</span>}</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const press = interpolate(f, [70, 75, 82], [1, 0.88, 1], CL);
  const on = f >= 75;
  const bell = on ? Math.sin((f - 75) / 2.4) * 24 * Math.max(0, 1 - (f - 75) / 80) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(12,9,7,0.75) 0%, rgba(12,9,7,0) 55%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 330, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, transform: `translateY(${(1 - btn) * 160}px) scale(${press})`, opacity: btn }}>
        <div style={{ background: on ? "#262626" : "#D42A20", color: C.white, border: on ? "4px solid #FFFFFF" : "4px solid transparent", fontFamily: SANS, fontWeight: 900, fontSize: 96, letterSpacing: 4, padding: "26px 72px", borderRadius: 22, boxShadow: "0 22px 50px rgba(0,0,0,0.6)" }}>{on ? "SUSCRITO ✓" : "SUSCRÍBETE"}</div>
        <svg width="150" height="150" viewBox="0 0 24 24" style={{ transform: `rotate(${bell}deg)`, transformOrigin: "50% 8%", filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.6))" }}>
          <path fill={on ? "#FFD34D" : C.white} d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3a1.5 1.5 0 0 0-3 0v1.16A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" />
        </svg>
      </div>
      {band}
    </AbsoluteFill>
  );
};

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
