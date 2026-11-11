// mireille01 (Lyon) — basado en meihua01; lista de 8 cosas que dejó de hacerse en la cara (carrusel, progreso, aperturas, pincelada, encuadres, mapa, álbum, recap, CTA)
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONTS, hash, useKB } from "./Piezas";

const { SERIF, SANS, HAND, JP } = FONTS;
const KANJI = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const PINK = "#E9B9AE";
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
export const LIST = { n: 8, head: "things I stopped doing to my face", tag: "THING", short: "N°" };

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
        <svg width={w * 0.13} height={w * 0.13} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke={C.white} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
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
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 86, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: PINK }}>{cards.length}</span> {LIST.head}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, color: C.paper, textShadow: shadow, marginTop: 10, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>after 38 years in a beauty institute</div>
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

// (5) cinta de seda de Lyon (rosa con canto dorado) que barre la pantalla (dir 0 →, 1 ←, 2 ↓, 3 ↘ en diagonal)
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
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency={dir === 2 ? "0.004 0.0015" : "0.0015 0.004"} numOctaves={2} seed={dir + 3} /><feDisplacementMap in="SourceGraphic" scale={220} /></filter>
        </defs>
        <g transform={`rotate(${dir === 3 ? 20 : 0} 960 540)`} filter={`url(#${id})`}>
          {dir === 2
            ? <><rect x={-300} y={540 + pos * 1080 - 830} width={2520} height={1660} fill="#B8925A" /><rect x={-300} y={540 + pos * 1080 - 800} width={2520} height={1600} fill="#C9918C" /></>
            : <><rect x={960 + sign * pos * 1920 - 1280} y={-500} width={2560} height={2080} fill="#B8925A" /><rect x={960 + sign * pos * 1920 - 1250} y={-500} width={2500} height={2080} fill="#C9918C" /></>}
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
              <text x={right ? 560 : 0} y="262" textAnchor={right ? "end" : "start"} fontFamily={SERIF} fontWeight={700} fontSize="300"
                fill={`rgba(255,253,248,${fill})`} stroke={C.white} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)}>{String(n).padStart(2, "0")}</text>
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 6 }}>
              {words.map((w, i) => {
                const p = spring({ frame: f - 30 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
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

// (7) mapa de Lyon dibujado (sin imágenes ni texto generado): Saône, Rhône, Presqu'île, colinas; ruta animada
export const MapLyon: React.FC<{ dur: number; lb?: string; b?: [number, number] }> = ({ dur, lb = "Rue Mercière", b = [905, 640] }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], CL);
  const z = lerp(1.35, 1.05, ease(f / Math.max(30, dur * 0.7)));
  const line = interpolate(f, [16, 62], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const pulse = 1 + 0.3 * Math.sin(f / 5);
  const pb = spring({ frame: f - 60, fps: 30, config: { damping: 12 } });
  const lab = (x: number, y: number, t: string, sz: number, col: string, op = 1, it = false) => (
    <text x={x} y={y} textAnchor="middle" fontFamily={it ? SERIF : SANS} fontStyle={it ? "italic" : "normal"} fontWeight={it ? 500 : 500} fontSize={sz} letterSpacing={it ? 1 : 6} fill={col} opacity={op}>{t}</text>
  );
  const A = [1010, 300], B = b;
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            <radialGradient id="hill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#D9C9AE" /><stop offset="100%" stopColor="#D9C9AE" stopOpacity="0" /></radialGradient>
            <pattern id="paperl" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0" stroke="#E2D5C0" strokeWidth="1" /></pattern>
          </defs>
          <rect width="1920" height="1080" fill="url(#paperl)" opacity="0.5" />
          <ellipse cx="1010" cy="250" rx="300" ry="170" fill="url(#hill)" />
          <ellipse cx="560" cy="560" rx="260" ry="230" fill="url(#hill)" />
          {/* Saône (oeste) y Rhône (este) se juntan al sur en la Confluence */}
          <path d="M640 -20 C700 140 800 220 790 360 C780 480 700 520 760 660 C810 780 860 880 930 1100" fill="none" stroke="#9FB4C4" strokeWidth="46" strokeLinecap="round" />
          <path d="M1560 -20 C1470 160 1300 260 1240 420 C1190 560 1150 720 1060 860 C1000 960 960 1020 940 1100" fill="none" stroke="#9FB4C4" strokeWidth="70" strokeLinecap="round" />
          {/* calles de la Presqu'île */}
          {[420, 500, 580, 660, 740].map((y) => <path key={y} d={`M${820 + (y - 420) * 0.05} ${y} L${1180 - (y - 420) * 0.12} ${y + 10}`} stroke="#CDBBA0" strokeWidth="3" />)}
          <path d="M980 360 L930 820" stroke="#CDBBA0" strokeWidth="4" />
          <path d="M1060 370 L1010 820" stroke="#CDBBA0" strokeWidth="3" />
          {lab(1010, 205, "CROIX-ROUSSE", 30, C.ink, 0.85)}
          {lab(520, 520, "FOURVIÈRE", 26, C.ink, 0.6)}
          {lab(690, 860, "Saône", 34, "#5E7A90", 0.9, true)}
          {lab(1330, 600, "Rhône", 40, "#5E7A90", 0.9, true)}
          {lab(1010, 520, "PRESQU'ÎLE", 22, C.ink, 0.45)}
          <path d={`M${A[0]} ${A[1]} C 1060 420 940 470 ${B[0]} ${B[1]}`} fill="none" stroke={C.ver} strokeWidth="7" strokeLinecap="round" strokeDasharray="1000" pathLength={1000} strokeDashoffset={1000 * (1 - line)} />
          <circle cx={A[0]} cy={A[1]} r={13 * pulse} fill={C.indigo} />
          <circle cx={A[0]} cy={A[1]} r={30 * pulse} fill="none" stroke={C.indigo} strokeWidth="3" opacity="0.4" />
          <circle cx={B[0]} cy={B[1]} r={15 * pb} fill={C.ver} />
          <g opacity={pb} transform={`translate(${B[0] - 40} ${B[1] + 20})`}>
            <rect x={-20 - lb.length * 19} y={0} width={40 + lb.length * 19} height={60} rx={6} fill="rgba(255,253,248,0.92)" />
            <text x={-lb.length * 9.5} y={42} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={34} fill={C.ink}>{lb}</text>
          </g>
        </svg>
      </AbsoluteFill>
      <Grain op={0.08} />
    </AbsoluteFill>
  );
};

// (10) recap: las 10 tarjetas del carrusel ordenadas en grilla, se tildan una a una
export const RecapGrid: React.FC<{ items: { txt: string; f: number; f2?: number; alt?: string }[]; cards: HabCard[]; bg: string; dur: number }> = ({ items, cards, bg }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  return (
    <AbsoluteFill>
      <BlurBg src={bg} dark={0.5} />
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 74, color: C.white, textShadow: shadow, opacity: p }}>
        <span style={{ color: PINK }}>{cards.length}</span> things I stopped · and what I do instead
      </div>
      {cards.map((c, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const it = items[i];
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 175 + col * 400, top: 215 + row * 410, opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <HabitPhotoCard n={i + 1} title={c.title} src={c.src} w={370} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
            {it.f2 !== undefined && f >= it.f2 && (() => { const q2 = spring({ frame: f - it.f2!, fps: 30, config: { damping: 14 } }); return (
              <div style={{ position: "absolute", left: -10, right: -10, bottom: 18, background: C.indigo, color: C.white, fontFamily: SANS, fontWeight: 500, fontSize: 25, letterSpacing: 0.5, padding: "10px 14px", textAlign: "center",
                boxShadow: "0 10px 24px rgba(0,0,0,0.4)", borderTop: `3px solid ${PINK}`, opacity: q2, transform: `translateY(${(1 - q2) * 30}px) rotate(-1deg)` }}>{it.alt}</div>); })()}
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
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "56% 30%" }} />
    </AbsoluteFill>
  );
};
