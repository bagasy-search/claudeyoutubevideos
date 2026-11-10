// chiyo01 — mejoras 1-10 con el look del mostrador de Ginza (parten de src/fumiko/Piezas2.tsx)
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FONTS, CL, shadow, hash, useKB, useIn, useOut, Card, KANJI } from "./Piezas";
import { Mecanismo } from "./escenas";

const { SERIF, SANS, HAND, JP } = FONTS;
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => Easing.inOut(Easing.cubic)(cl(t, 0, 1));

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

export type StepCardT = { title: string; src: string };

// tarjeta de paso con foto: tarjeta de mostrador, filete dorado, sello rojo con el número
const StepCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: `linear-gradient(170deg, ${C.white}, ${C.paper})`, padding: w * 0.04, paddingBottom: w * 0.035, boxShadow: `0 24px 54px rgba(0,0,0,0.5), inset 0 0 0 ${Math.max(1, w * 0.004)}px ${C.gold}`, borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.66, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
    </div>
    <div style={{ position: "absolute", left: w * 0.5 - w * 0.085, top: w * 0.04 + w * 0.66 - w * 0.085, width: w * 0.17, height: w * 0.17, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #D2414C, ${C.ver} 55%, #8E1722)`,
      color: C.white, fontFamily: JP, fontWeight: 700, fontSize: w * 0.09, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 10px rgba(0,0,0,0.35), inset 0 0 0 ${Math.max(1, w * 0.006)}px rgba(255,253,251,0.6)` }}>{KANJI[n]}</div>
    <div style={{ textAlign: "center", marginTop: w * 0.11, height: w * 0.26 }}>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: w * 0.042, color: C.ver, letterSpacing: w * 0.014 }}>STEP {n}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.092, color: C.ink, lineHeight: 1.08, marginTop: w * 0.012, opacity: 1 - dim * 0.5 }}>{title}</div>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(${interpolate(check, [0, 1], [-30, -8])}deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <svg width={w * 0.12} height={w * 0.12} viewBox="0 0 54 54"><path d="M10 28 L22 40 L44 14" fill="none" stroke={C.white} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

// (1) carrusel 3D de los 4 pasos sobre material real desenfocado → termina en abanico
export const Carousel: React.FC<{ cards: StepCardT[]; bg: string; marks: number[]; subAt: number; dur: number }> = ({ cards, bg, marks, subAt, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 12); const pIn = useIn(0, 22);
  const N = cards.length;
  const fanAt = dur * 0.74;
  const fanT = ease((f - fanAt) / 30);
  // el carrusel gira para traer al frente la tarjeta del paso que se nombra
  let rot = interpolate(f, [0, marks[0]], [70, 0], CL);
  for (let i = 1; i < N; i++) rot -= (360 / N) * ease((f - marks[i] + 8) / 18);
  const R = 560, PR = 1500;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <BlurBg src={bg} dark={0.45} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(30,12,20,0) 30%, rgba(30,12,20,0.6) 100%)" }} />
      <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center", opacity: pIn, transform: `translateY(${(1 - pIn) * -40}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 100, color: C.white, textShadow: shadow, lineHeight: 1 }}><span style={{ color: C.blush }}>4</span> steps <span style={{ fontStyle: "italic", fontWeight: 400 }}>·</span> <span style={{ color: C.blush }}>7</span> minutes</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 50, color: C.paper, textShadow: shadow, marginTop: 12, opacity: interpolate(f, [subAt, subAt + 10], [0, 1], CL) }}>Nothing expensive.</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 42%" }}>
        {cards.map((c, i) => {
          const appear = spring({ frame: f - 4 - i * 5, fps: 30, config: { damping: 16, mass: 0.6 } });
          const th = ((((i * (360 / N) + rot) % 360) + 540) % 360) - 180;
          const rad = (th * Math.PI) / 180;
          const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
          const phi = -21 + i * (42 / (N - 1)), pr = (phi * Math.PI) / 180;
          const fx = PR * Math.sin(pr), fy = PR * (1 - Math.cos(pr));
          const x = lerp(rx, fx, fanT), y = lerp(30, fy + 10, fanT), z = lerp(rz, i * 2, fanT);
          const ry = lerp(th * 0.9, 0, fanT), rzz = lerp(0, phi, fanT);
          const sc = lerp(1, 0.9, fanT) * appear;
          const vis = lerp(cl(0.3 + 0.7 * Math.cos(rad), 0.14, 1), 1, fanT);
          return (
            <div key={i} style={{ position: "absolute", left: 960 - 210, top: 300, zIndex: Math.round(2000 + z), opacity: vis * appear,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rzz}deg) scale(${sc})` }}>
              <StepCard n={i + 1} title={c.title} src={c.src} w={420} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// (2) progreso del listado en la esquina: "2 / 4" con 4 puntos
export const Progress: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", right: 56, top: 46, opacity: o, display: "flex", alignItems: "center", gap: 16, background: "rgba(42,32,37,0.5)", borderRadius: 40, padding: "9px 22px 9px 18px", boxShadow: `inset 0 0 0 1.5px rgba(183,154,91,0.75)` }}>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: i < n ? C.blush : "rgba(255,253,251,0.28)", boxShadow: i === n - 1 ? `0 0 0 3px rgba(241,189,184,0.35)` : undefined }} />
        ))}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 21, letterSpacing: 4, color: C.white }}>
        <span style={{ color: C.blush }}>{n}</span> / 4 · {title.toUpperCase()}
      </div>
    </div>
  );
};

// (5) transición de capítulo: una toalla de algodón blanca barre la pantalla (dir 0 →, 1 ←, 2 ↓, 3 ↘)
export const ClothWipe: React.FC<{ dir: number; len?: number }> = ({ dir, len = 22 }) => {
  const f = useCurrentFrame();
  const t = f / len; if (t < 0 || t > 1) return null;
  const pos = lerp(-1.25, 1.25, Easing.inOut(Easing.quad)(t));
  const sign = dir === 1 ? -1 : 1;
  const tela: React.CSSProperties = {
    position: "absolute", background: "repeating-linear-gradient(0deg, rgba(210,198,184,0.5) 0 2px, transparent 2px 7px), repeating-linear-gradient(90deg, rgba(210,198,184,0.4) 0 2px, transparent 2px 7px), linear-gradient(135deg, #FFFDFB, #F1E9DF)",
    boxShadow: "0 0 90px 30px rgba(0,0,0,0.38), inset 0 0 0 14px rgba(255,255,255,0.6), inset 0 0 0 17px rgba(180,35,47,0.55), inset 0 0 0 22px rgba(255,255,255,0.6)", borderRadius: 36,
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${dir === 3 ? 18 : dir === 2 ? 0 : -4}deg)` }}>
        {dir === 2
          ? <div style={{ ...tela, left: -320, top: 540 + pos * 1080 - 860, width: 2560, height: 1720 }} />
          : <div style={{ ...tela, left: 960 + sign * pos * 1920 - 1320, top: -520, width: 2640, height: 2120 }} />}
      </div>
    </AbsoluteFill>
  );
};

// (3) apertura de cada paso: toalla que barre → foto con su mecanismo propio, número trazado, título palabra por palabra
export const StepScene: React.FC<{ n: number; title: string; src: string; dur: number }> = ({ n, title, src, dur }) => {
  const f = useCurrentFrame();
  const v = n - 1, right = v % 2 === 0;
  const o = useOut(dur, 10);
  const draw = interpolate(f, [22, 50], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const fill = interpolate(f, [46, 58], [0, 1], CL);
  const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 110, alignItems: "flex-end" } : { left: 110, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      {f >= 11 && (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill><Mecanismo n={n} src={src} dur={dur} /></AbsoluteFill>
          <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(30,12,20,0.84) 0%, rgba(30,12,20,0.4) 42%, rgba(30,12,20,0) 66%)`, opacity: interpolate(f, [18, 34], [0, 1], CL) }} />
          <div style={{ position: "absolute", top: 210, width: 900, display: "flex", flexDirection: "column", ...side }}>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 12, color: C.blush, opacity: draw }}>STEP · {KANJI[n]}</div>
            <svg width="420" height="310" viewBox="0 0 420 310" style={{ overflow: "visible" }}>
              <text x={right ? 420 : 0} y="270" textAnchor={right ? "end" : "start"} fontFamily={SERIF} fontWeight={400} fontSize="320"
                fill={`rgba(255,253,251,${fill})`} stroke={C.white} strokeWidth={2.5} strokeDasharray={1500} strokeDashoffset={1500 * (1 - draw)}>{n}</text>
            </svg>
            <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 4 }}>
              {words.map((w, i) => {
                const p = spring({ frame: f - 40 - i * 5, fps: 30, config: { damping: 15, mass: 0.6 } });
                return <span key={i} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 96, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
              })}
            </div>
            <div style={{ height: 3, background: C.ver, marginTop: 20, width: 260 * interpolate(f, [54, 70], [0, 1], CL) }} />
          </div>
        </AbsoluteFill>
      )}
      <ClothWipe dir={v % 4} len={22} />
    </AbsoluteFill>
  );
};

// (4) 50/50: la foto ocupa la mitad derecha (el avatar se corre solo, ver AvatarFramed)
export const SplitPhoto: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12, dur - 10, dur], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const kb = useKB(seed, dur);
  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 960, overflow: "hidden", transform: `translateX(${(1 - p) * 102}%)`, borderLeft: `5px solid ${C.paper}`, boxShadow: `-12px 0 40px rgba(0,0,0,0.4), inset 3px 0 0 ${C.gold}` }}>
      {src.endsWith(".mp4")
        ? <OffthreadVideo src={staticFile(src)} muted playbackRate={0.6} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />
        : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...kb }} />}
    </div>
  );
};

// (4) foto que cae al lado del avatar cuando recuerda algo: copia en papel con borde crema y esquinas de cinta
export const Polaroid: React.FC<{ src: string; caption: string; dur: number; seed?: number; left?: boolean }> = ({ src, caption, dur, seed = 1, left }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  const p = spring({ frame: f, fps: 30, config: { damping: 11, mass: 0.8 } });
  const r = (hash(seed) % 2 ? 1 : -1) * (4 + (hash(seed + 3) % 5));
  return (
    <div style={{ position: "absolute", ...(left ? { left: 120 } : { right: 120 }), top: 150, width: 540, opacity: o, transform: `translateY(${(1 - p) * -1000}px) rotate(${r + (1 - p) * 25}deg)` }}>
      <div style={{ background: "#FBF7F0", padding: "22px 22px 92px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative" }}>
        <div style={{ width: 496, height: 400, overflow: "hidden", position: "relative" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.3) contrast(0.96)" }} />
          <Grain op={0.25} />
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: C.plum }}>{caption}</div>
        <div style={{ position: "absolute", top: -16, left: 200, width: 140, height: 38, background: "rgba(241,189,184,0.8)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
};

// (8) foto de época como objeto físico: sale de un sobre de papel de la tienda, con esquinas de cinta y grano
export const Album: React.FC<{ src: string; seed: number; dur: number; under?: string }> = ({ src, seed, dur, under }) => {
  const f = useCurrentFrame();
  const t = f / Math.max(1, dur);
  const r = (hash(seed) % 2 ? 1 : -1) * (1.5 + (hash(seed + 1) % 3));
  const sale = spring({ frame: f - 2, fps: 30, config: { damping: 20, mass: 1 } }); // la foto sale del sobre
  const tape = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 150, height: 42, background: "rgba(241,189,184,0.78)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", ...s }} />;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #5B2B3D 0%, #33161F 65%, #1F0C13 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.25, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,230,220,0.05) 0 2px, transparent 2px 14px)" }} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * t}) translateY(${-10 * t}px) rotate(${-0.6 * t}deg)` }}>
        {/* sobre de la tienda, debajo */}
        <div style={{ position: "absolute", left: 1010, top: 520, width: 860, height: 600, background: `linear-gradient(160deg, ${C.paper}, ${C.paper2})`, transform: `rotate(${-r * 2.2}deg)`, boxShadow: `0 20px 46px rgba(0,0,0,0.5), inset 0 0 0 2px ${C.gold}, inset 0 0 0 10px ${C.paper}, inset 0 0 0 11px rgba(183,154,91,0.5)` }}>
          <div style={{ position: "absolute", right: 60, bottom: 70, fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.plum, opacity: 0.75 }}>Ginza</div>
          <div style={{ position: "absolute", right: 60, bottom: 40, fontFamily: JP, fontWeight: 700, fontSize: 26, color: C.ver, opacity: 0.8, letterSpacing: 6 }}>銀座</div>
        </div>
        {under && (
          <div style={{ position: "absolute", left: 1250, top: 80, width: 540, padding: 16, background: "#F3EADB", transform: `rotate(${-r * 2.5}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", opacity: 0.85 }}>
            <Img src={staticFile(under)} style={{ width: "100%", height: 360, objectFit: "cover", filter: "sepia(0.55) brightness(0.8)" }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 300, top: 100, width: 1260, padding: "30px 30px 36px", background: "#F4ECDD", transform: `translate(${(1 - sale) * 520}px, ${(1 - sale) * 420}px) rotate(${r + (1 - sale) * -9}deg)`, boxShadow: "0 36px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 1200, height: 770, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.22) contrast(1.02)" }} />
            <Grain op={0.3} />
            <AbsoluteFill style={{ boxShadow: "inset 0 0 120px rgba(40,20,20,0.45)" }} />
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

// (7) mapa con ruta (coordenadas en % de mapjp, que llena el cuadro)
export const MapJP: React.FC<{ a: [number, number]; b: [number, number]; la: string; ja?: string; lb: string; jb?: string; dur: number }> = ({ a, b, la, ja, lb, jb, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], CL);
  const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
  const span = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]) * 1.78);
  const zEnd = cl(52 / Math.max(span, 6), 1.0, 2.6);
  const k = ease((f - 4) / 30);
  const z = lerp(Math.max(zEnd, 3.2), zEnd, k), ox = lerp(a[0], cx, k), oy = lerp(a[1], cy, k);
  const line = interpolate(f, [18, 50], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const ax = a[0] * 19.2, ay = a[1] * 10.8, bx = b[0] * 19.2, by = b[1] * 10.8;
  const mx = (ax + bx) / 2 - (by - ay) * 0.22, my = (ay + by) / 2 - Math.abs(bx - ax) * 0.22;
  const pulse = 1 + 0.3 * Math.sin(f / 5);
  const pb = spring({ frame: f - 48, fps: 30, config: { damping: 12 } });
  const tx = (50 - ox) * 19.2, ty = (50 - oy) * 10.8;
  const lab = (x: number, y: number, t: string, jp?: string, op = 1, below = false) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${1 / z}) translate(26px, ${below ? "20%" : "-112%"})`, transformOrigin: "0 0", whiteSpace: "nowrap", background: "rgba(255,253,251,0.92)", padding: "4px 18px 6px", borderRadius: 3, boxShadow: `inset 0 0 0 1.5px ${C.gold}, 0 6px 16px rgba(0,0,0,0.18)` }}>
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 56, color: C.ink }}>{t}</span>
      {jp && <span style={{ fontFamily: JP, fontWeight: 700, fontSize: 38, color: C.ver, marginLeft: 14 }}>{jp}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile("chiyo01/g/mapjp.png")} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} fill="none" stroke={C.plum} strokeWidth={5 / z} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - line)} />
          <circle cx={ax} cy={ay} r={(11 / z) * pulse} fill={C.plum} />
          <circle cx={ax} cy={ay} r={(28 / z) * pulse} fill="none" stroke={C.plum} strokeWidth={3 / z} opacity={0.5} />
          <circle cx={bx} cy={by} r={(15 / z) * pb} fill={C.ver} />
          <circle cx={bx} cy={by} r={(30 / z) * pb} fill="none" stroke={C.ver} strokeWidth={3 / z} opacity={0.55} />
        </svg>
        {lab(ax, ay, la, ja, 1, by < ay)}
        {lab(bx, by, lb, jb, pb, by >= ay)}
      </AbsoluteFill>
      <Grain op={0.1} />
    </AbsoluteFill>
  );
};

// (10) repaso: las 4 tarjetas del carrusel ya ordenadas en fila; se tildan una a una y debajo queda lo que hay que hacer
export const RecapGrid: React.FC<{ items: { txt: string; f: number }[]; cards: StepCardT[]; bg: string; endAt: number; dur: number }> = ({ items, cards, bg, endAt }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20);
  const fin = spring({ frame: f - endAt, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <BlurBg src={bg} dark={0.5} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(30,12,20,0) 30%, rgba(30,12,20,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 78, color: C.white, textShadow: shadow, opacity: p }}>
        The Japanese night <span style={{ color: C.blush, fontStyle: "italic", fontWeight: 400 }}>· one more time</span>
      </div>
      {cards.map((c, i) => {
        const it = items[i];
        const e = spring({ frame: f - i * 4, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.07 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        const tx = spring({ frame: f - it.f - 4, fps: 30, config: { damping: 16 } });
        return (
          <div key={i} style={{ position: "absolute", left: 96 + i * 444, top: 200, width: 400, opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>
            <div style={{ transform: `rotate(${((hash(i + 40) % 5) - 2) * 0.7}deg) scale(${(lit ? 1 : 0.95) * pop})` }}>
              <StepCard n={i + 1} title={c.title} src={c.src} w={400} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
            </div>
            <div style={{ marginTop: 26, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 40, lineHeight: 1.15, color: C.white, textShadow: shadow, opacity: tx, transform: `translateY(${(1 - tx) * 16}px)` }}>{it.txt}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 54, width: "100%", textAlign: "center", opacity: fin, transform: `translateY(${(1 - fin) * 20}px)` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 70, color: C.white, textShadow: shadow }}><span style={{ color: C.blush }}>7</span> minutes. <span style={{ fontStyle: "italic", fontWeight: 400 }}>And then, sleep.</span></span>
      </div>
    </AbsoluteFill>
  );
};

// (10) CTA suave junto al avatar, con la fila de los 4 pasos
export const CTA: React.FC<{ text: string; cards: StepCardT[]; dur: number }> = ({ text, cards, dur }) => {
  const f = useCurrentFrame(); const p = useIn(0, 20), o = useOut(dur, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(30,12,20,0.74) 0%, rgba(30,12,20,0) 42%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 232, textAlign: "center", opacity: p }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 60, color: C.white, textShadow: shadow, borderBottom: `3px solid ${C.ver}`, paddingBottom: 8 }}>{text}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center", gap: 22 }}>
        {cards.map((c, i) => {
          const e = spring({ frame: f - 8 - i * 4, fps: 30, config: { damping: 14 } });
          return (
            <div key={i} style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", boxShadow: `0 8px 18px rgba(0,0,0,0.45), 0 0 0 3px ${C.paper}, 0 0 0 5px ${C.gold}`, position: "relative", opacity: e, transform: `translateY(${(1 - e) * 80}px)` }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(30,12,20,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: C.white, textShadow: shadow }}>{i + 1}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// (4) avatar con encuadres: punch-in 112 % en golpes y corrimiento a la izquierda para el 50/50 o la foto que cae
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
      <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${tx}%) scale(${z})`, transformOrigin: "54% 36%" }} />
    </AbsoluteFill>
  );
};
