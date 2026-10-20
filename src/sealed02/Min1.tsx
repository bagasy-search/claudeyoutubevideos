// sealed02 · minuto 1 ("Ancient Stones Cut So Precisely…") — clon de la edición de BeyondTheGreen + costuras v2
// (D:/claude-brain/estilos/doc-ilustrado-btg/DESGLOSE.md §8): motivo que vuelve, texto sobre plano vivo, flash en la
// palabra-golpe, zoom-through por un círculo, toma que se achica a tarjeta, viraje de color dentro del plano,
// ilustrada larga que se anima por dentro. Tiempos en SEGUNDOS clavados a las palabras de la voz (caps.json).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, FONT, KeyLine, Person, SunsetStage, ease } from "../kits/btg/kit";

loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const P = "sealed02/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
export const MIN1_FRAMES = s(64.5);

// ---------- plano real (foto o video) con punch-in lento, paneo, oscurecido/blur/viraje animables ----------
type PlateP = { src: string; d: number; z?: [number, number]; px?: [number, number]; py?: [number, number]; from?: number; dark?: number;
  blurAt?: number; blurTo?: number; coolAt?: number; origin?: string };
const Plate: React.FC<PlateP> = ({ src, d, z = [1.04, 1.12], px = [0, 0], py = [0, 0], from = 0, dark = 0, blurAt, blurTo = 26, coolAt, origin = "50% 50%" }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, d], [0, 1], cl);
  const sc = z[0] + (z[1] - z[0]) * k, x = px[0] + (px[1] - px[0]) * k, y = py[0] + (py[1] - py[0]) * k;
  const b = blurAt !== undefined ? ease(f, blurAt, blurAt + 12) : 0;
  const c = coolAt !== undefined ? ease(f, coolAt, coolAt + 40) : 0;
  const filter = `blur(${b * blurTo}px) brightness(${1 - b * 0.55 - c * 0.12}) saturate(${1 - c * 0.65}) hue-rotate(${c * 12}deg)`;
  const vid = src.endsWith(".mp4");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) scale(${sc + b * 0.06})`, transformOrigin: origin, filter }}>
        {vid ? <OffthreadVideo src={staticFile(P + src)} startFrom={Math.round(from * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <Img src={staticFile(P + src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </AbsoluteFill>
      {c > 0 && <AbsoluteFill style={{ background: `rgba(20,40,70,${c * 0.22})`, mixBlendMode: "multiply" }} />}
      {dark > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />}
      {/* viñeta natural suave, como el molde */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.38) 100%)" }} />
    </AbsoluteFill>
  );
};

// flash = velo blanco/cálido de ~6 cuadros sobre la sílaba fuerte (tapa el corte y suena a golpe)
const Flash: React.FC<{ at: number; warm?: boolean; peak?: number }> = ({ at, warm, peak = 0.85 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at - 2, at, at + 7], [0, peak, 0], cl);
  return o > 0 ? <AbsoluteFill style={{ background: warm ? "#fff2dc" : "#fff", opacity: o, mixBlendMode: "screen" }} /> : null;
};
// rótulo de lugar chico (arriba a la izquierda)
const PlaceTag: React.FC<{ a: number; text: string; sub?: string }> = ({ a, text, sub }) => {
  const f = useCurrentFrame();
  const t = ease(f, a, a + 10);
  return (
    <div style={{ position: "absolute", left: 110, top: 96, fontFamily: FONT, opacity: t, transform: `translateX(${(1 - t) * -20}px)` }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.orange, display: "inline-block", marginRight: 14, boxShadow: `0 0 12px ${C.orange}` }} />
      <span style={{ fontWeight: 900, fontSize: 38, color: C.ink, letterSpacing: 3, textShadow: "0 2px 12px rgba(0,0,0,.8)" }}>{text}</span>
      {sub && <div style={{ fontWeight: 700, fontSize: 24, color: C.dim, marginLeft: 22, marginTop: 4, letterSpacing: 2 }}>{sub}</div>}
    </div>
  );
};
// palabras apiladas que nacen sobre el plano (cada línea a su tiempo; una en rojo)
const Stack: React.FC<{ lines: { t: string; at: number; hot?: boolean }[]; x?: number; y?: number; size?: number }> = ({ lines, x = 130, y = 330, size = 118 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, color: C.ink, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>
      {lines.map((l, i) => {
        const t = ease(f, l.at, l.at + 6);
        return <div key={i} style={{ opacity: t, transform: `scale(${1.22 - 0.22 * t})`, transformOrigin: "left center", color: l.hot ? C.red : undefined }}>{l.t}</div>;
      })}
    </div>
  );
};

// ---------- 1. EL MOTIVO: galería oscura de 3 focos (piedra → acero → láser), recorrida en UN travelling ----------
// world 2900 px; la cámara se desliza de foco en foco con la frase. Vuelve después "de museo" con la cámara inclinada.
const POOL = [520, 1450, 2380];
const Cone: React.FC<{ x: number; on: number }> = ({ x, on }) => (
  <>
    <div style={{ position: "absolute", left: x - 330, top: -40, width: 660, height: 860, opacity: on * 0.9,
      background: "linear-gradient(180deg, rgba(255,214,150,.30) 0%, rgba(255,190,120,.10) 70%, transparent 100%)", clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", left: x - 360, top: 770, width: 720, height: 90, borderRadius: "50%", opacity: on,
      background: "radial-gradient(ellipse, rgba(255,200,130,.45) 0%, rgba(255,170,90,.12) 55%, transparent 72%)" }} />
  </>
);
const stoneCol = (i: number) => `hsl(${28 + rnd(i, 4) * 10},${18 + rnd(i, 5) * 10}%,${30 + rnd(i, 6) * 12}%)`;
const LumpyWall: React.FC<{ x: number; a: number }> = ({ x, a }) => {
  const f = useCurrentFrame();
  const rocks = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, t = spring({ frame: f - a - i * 1.6, fps: FPS, config: { damping: 11 } });
    const w = 66 + rnd(i, 1) * 30, h = 46 + rnd(i, 2) * 22;
    rocks.push(<div key={i} style={{ position: "absolute", left: x - 150 + c * 76 + (r % 2) * 18 + rnd(i, 3) * 10, top: 770 - (r + 1) * 54 - (1 - t) * 40, width: w, height: h, opacity: t,
      background: stoneCol(i), borderRadius: `${40 + rnd(i, 7) * 30}% ${30 + rnd(i, 8) * 40}% ${45 + rnd(i, 9) * 30}% ${35 + rnd(i, 10) * 30}%`, boxShadow: "inset -6px -8px 0 rgba(0,0,0,.28)" }} />);
  }
  return <>{rocks}</>;
};
const StraightWall: React.FC<{ x: number; a: number }> = ({ x, a }) => {
  const f = useCurrentFrame();
  const b = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, t = spring({ frame: f - a - i * 1.2, fps: FPS, config: { damping: 14 } });
    b.push(<div key={i} style={{ position: "absolute", left: x - 160 + c * 80 + (r % 2 ? 40 : 0) - (r % 2 && c === 3 ? 400 : 0), top: 770 - (r + 1) * 52 - (1 - t) * 30, width: 76, height: 48, opacity: t,
      background: "#8a7a66", border: "2px solid #4a4034", boxShadow: "inset -5px -5px 0 rgba(0,0,0,.2)" }} />);
  }
  return <>{b}</>;
};
const PerfectBlock: React.FC<{ x: number; a: number }> = ({ x, a }) => {
  const f = useCurrentFrame();
  const cut = ease(f, a, a + 22);            // el láser baja y corta
  const beam = f >= a - 4 && f < a + 30;
  return (
    <>
      <div style={{ position: "absolute", left: x - 160, top: 562, width: 320, height: 208, background: "linear-gradient(160deg,#b9b2a6,#7d776d)", boxShadow: "inset -10px -10px 0 rgba(0,0,0,.18), 0 0 0 1px #d9d3c8" }} />
      <div style={{ position: "absolute", left: x - 2, top: 562, width: 4, height: 208 * cut, background: "#ff3b30", boxShadow: "0 0 14px 4px #ff3b30" }} />
      {beam && <div style={{ position: "absolute", left: x - 3, top: 0, width: 6, height: 562 + 208 * cut, background: "linear-gradient(180deg, rgba(255,60,48,.2), #ff3b30)", boxShadow: "0 0 24px 6px rgba(255,59,48,.7)" }} />}
      {beam && Array.from({ length: 10 }).map((_, i) => {
        const k = ((f - a) * 0.12 + rnd(i, 2)) % 1;
        return <div key={i} style={{ position: "absolute", left: x + (rnd(i, 3) - 0.5) * 140 * k, top: 562 + 208 * cut - 60 * k + 120 * k * k, width: 4, height: 4, borderRadius: 2, background: "#ffd27a", opacity: 1 - k }} />;
      })}
    </>
  );
};
const Gallery: React.FC<{ museum?: boolean; d: number }> = ({ museum, d }) => {
  const f = useCurrentFrame();
  // galería: 2.40 → 9.70 (local 0 = 2.40). Museo: 11.00 → 13.25
  const T = (t: number) => s(t - (museum ? 11.0 : 2.4));
  let camX = POOL[0];
  if (!museum) camX = interpolate(f, [T(7.25), T(7.85), T(8.95), T(9.4)], [POOL[0], POOL[1], POOL[1], POOL[2]], { ...cl, easing: (x) => x * x * (3 - 2 * x) });
  const moving = !museum && ((f > T(7.25) && f < T(7.85)) || (f > T(8.95) && f < T(9.4)));
  const zoom = museum ? 0.58 + ease(f, 0, d) * 0.03 : 1 + ease(f, 0, d) * 0.04;
  const tilt = museum ? -4 : 0;
  const tx = museum ? 960 - 1450 * zoom : 960 - camX * zoom;
  const on = (i: number) => (museum ? 1 - ease(f, T(12.95) + i * 4, T(12.95) + i * 4 + 5) : i === 0 ? ease(f, 0, 8) : ease(f, T(i === 1 ? 7.3 : 8.95), T(i === 1 ? 7.6 : 9.2)));
  const personX = museum ? 1450 : camX - 250;
  const labels = ["STONE HAMMER", "STEEL CHISEL", "LASER"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #13202e 0%, #070b11 75%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 2900, height: 1080, transformOrigin: "0 0",
        transform: `translate(${tx}px, ${museum ? 300 : 30}px) scale(${zoom}) rotate(${tilt}deg)` }}>
        {/* piso */}
        <div style={{ position: "absolute", left: -400, top: 770, width: 3700, height: 500, background: "linear-gradient(180deg,#0e141b,#06090d)", borderTop: "2px solid rgba(255,190,120,.10)" }} />
        {POOL.map((x, i) => <Cone key={i} x={x} on={on(i)} />)}
        {POOL.map((x, i) => (
          <div key={"l" + i} style={{ position: "absolute", left: x - 200, width: 400, top: 800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: "rgba(244,239,230,.6)", opacity: on(i) }}>{labels[i]}</div>
        ))}
        <LumpyWall x={POOL[0]} a={museum ? -99 : T(5.3)} />
        <StraightWall x={POOL[1]} a={museum ? -99 : T(7.5)} />
        <div style={{ opacity: on(2) }}><PerfectBlock x={POOL[2]} a={museum ? -99 : T(9.22)} /></div>
        {/* herramientas en cada foco */}
        <div style={{ position: "absolute", left: POOL[0] + 170, top: 700, width: 60, height: 44, borderRadius: "45% 55% 50% 40%", background: "#6d6357", opacity: on(0) }} />
        {museum && POOL.map((x, i) => (
          <div key={"g" + i} style={{ position: "absolute", left: x - 230, top: 470, width: 460, height: 300, border: "3px solid rgba(190,220,255,.35)", background: "linear-gradient(120deg, rgba(190,220,255,.10), transparent 40%, rgba(190,220,255,.06))", opacity: on(i) }} />
        ))}
        {museum && <div style={{ position: "absolute", left: POOL[0], top: 880, width: POOL[2] - POOL[0], height: 6, background: "rgba(244,239,230,.4)", opacity: on(1) }}>
          <div style={{ position: "absolute", right: -18, top: -14, width: 0, height: 0, borderLeft: "30px solid rgba(244,239,230,.4)", borderTop: "17px solid transparent", borderBottom: "17px solid transparent" }} />
          <div style={{ position: "absolute", left: 0, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.dim, letterSpacing: 3 }}>OLDER · ROUGH</div>
          <div style={{ position: "absolute", right: 0, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.dim, letterSpacing: 3 }}>NEWER · PERFECT</div>
        </div>}
        <div style={{ opacity: museum ? 0 : 1 }}><div style={{ filter: "drop-shadow(0 -3px 0 rgba(255,190,120,.55)) brightness(.8)" }}><Person x={personX} y={772} s={1.05} walk={moving} /></div></div>
      </div>
      {museum && <KeyLine a={s(11.6 - 11.0)} text="every museum on Earth *agrees.*" align="center" y={130} size={50} />}
    </AbsoluteFill>
  );
};

// ---------- 2. "except in SEVEN places": 7 luces en la oscuridad → globo de puntos → círculo que se abre a Perú ----------
const SITES = [[-13.5, -72], [-16.5, -68.7], [34, 36.2], [29.9, 31.1], [37.2, 38.9], [37.7, 22.7], [-27.1, -70]]; // lat, lon
const G0 = { lon: -25, lat: 8, r: 330, cx: 960, cy: 560 };
const proj = (lat: number, lon: number) => {
  const p = (lat * Math.PI) / 180, l = ((lon - G0.lon) * Math.PI) / 180, p0 = (G0.lat * Math.PI) / 180;
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  const vis = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return { x: G0.cx + x * G0.r, y: G0.cy - y * G0.r, vis };
};
export const PERU_XY = proj(-13.5, -72);
const Seven: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 12.90
  const T = (t: number) => s(t - 12.9);
  const toGlobe = ease(f, T(13.75), T(14.25));
  const globe = ease(f, T(13.7), T(14.1));
  const grid = [];
  for (let la = -80; la <= 80; la += 10) for (let lo = -180; lo < 180; lo += 10) { const q = proj(la, lo); if (q.vis > 0) grid.push(q); }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#05080d", opacity: ease(f, 2, 11) }} />
      <AbsoluteFill style={{ opacity: globe }}>
        <div style={{ position: "absolute", left: G0.cx - G0.r, top: G0.cy - G0.r, width: G0.r * 2, height: G0.r * 2, borderRadius: "50%", border: "2px solid rgba(120,170,220,.25)", background: "radial-gradient(circle at 40% 35%, rgba(40,70,110,.35), rgba(5,10,20,.2) 70%)" }} />
        {grid.map((q, i) => <div key={i} style={{ position: "absolute", left: q.x - 1.5, top: q.y - 1.5, width: 3, height: 3, borderRadius: 2, background: `rgba(150,190,230,${0.15 + q.vis * 0.35})` }} />)}
      </AbsoluteFill>
      {SITES.map(([la, lo], i) => {
        const q = proj(la, lo);
        const sx = 260 + rnd(i, 21) * 1400, sy = 180 + rnd(i, 22) * 620;
        const x = sx + (q.x - sx) * toGlobe, y = sy + (q.y - sy) * toGlobe;
        const t = ease(f, T(12.98) + i * 1.6, T(12.98) + i * 1.6 + 5);
        const peru = i === 0 ? ease(f, T(14.15), T(14.35)) : 0;
        return <div key={i} style={{ position: "absolute", left: x - 7 - peru * 6, top: y - 7 - peru * 6, width: 14 + peru * 12, height: 14 + peru * 12, borderRadius: "50%", opacity: t,
          background: toGlobe > 0.5 ? C.red : "#ffcf86", boxShadow: `0 0 ${18 + peru * 30}px ${6 + peru * 8}px ${toGlobe > 0.5 ? "rgba(255,59,48,.6)" : "rgba(255,190,110,.55)"}` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.red, letterSpacing: 4,
        opacity: ease(f, T(13.36), T(13.42)) * (1 - ease(f, T(14.0), T(14.2))), transform: `scale(${1.12 - 0.12 * ease(f, T(13.36), T(13.6))})`, textShadow: "0 8px 40px rgba(255,59,48,.35)" }}>SEVEN.</div>
      <Flash at={T(13.38)} peak={0.55} />
    </AbsoluteFill>
  );
};
// la toma de Perú nace DENTRO del punto de Perú (zoom-through)
const CircleIn: React.FC<{ children: React.ReactNode; x: number; y: number; dur: number }> = ({ children, x, y, dur }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, dur], [14, 2300], { ...cl, easing: (k) => k * k * k });
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>;
};

// ---------- 3. la tarjeta que no entra en la junta (dibujo de línea sobre la foto) ----------
const CardJoint: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 22.55
  const T = (t: number) => s(t - 22.55);
  const draw = ease(f, T(22.7), T(23.6));
  const slide = interpolate(f, [T(23.55), T(24.25)], [1, 0], { ...cl, easing: (k) => 1 - (1 - k) * (1 - k) });
  const bump = f > T(24.25) ? Math.sin((f - T(24.25)) * 1.6) * 8 * Math.exp(-(f - T(24.25)) / 6) : 0;
  const JX = 1338;
  const path = "M1338,40 L1330,210 L1342,400 L1336,620 L1346,860 L1340,1080";
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={1200} strokeDashoffset={1200 * (1 - draw)} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,.8))" }} />
      </svg>
      <div style={{ position: "absolute", left: JX + 14 + slide * 700 + bump, top: 470, width: 330, height: 208, borderRadius: 18, transform: "perspective(900px) rotateY(-62deg)", transformOrigin: "0 50%",
        background: "linear-gradient(135deg,#f4f1ea,#c9c4ba)", boxShadow: "0 20px 50px rgba(0,0,0,.55)", opacity: ease(f, T(23.5), T(23.65)) }}>
        <div style={{ position: "absolute", left: 30, top: 60, width: 56, height: 42, borderRadius: 8, background: "linear-gradient(135deg,#e2c46a,#a8862c)" }} />
        <div style={{ position: "absolute", left: 30, top: 140, width: 220, height: 14, borderRadius: 7, background: "rgba(0,0,0,.18)" }} />
      </div>
      <div style={{ position: "absolute", left: JX - 40, top: 330, fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.red, opacity: ease(f, T(24.3), T(24.4)), transform: `scale(${1.3 - 0.3 * ease(f, T(24.3), T(24.45))})`, textShadow: "0 4px 20px rgba(0,0,0,.6)" }}>✕</div>
    </AbsoluteFill>
  );
};

// ---------- 4. balanza: el bloque vs dos jumbos cargados (sobre la foto que se desenfoca) ----------
const Jet: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 300 126">
    <path d="M8,70 Q20,58 60,58 L210,56 Q260,56 290,66 Q296,72 284,76 L60,82 Q20,82 8,70 Z" fill="#dfe6ee" />
    <path d="M120,62 L170,12 L192,12 L160,62 Z M125,78 L175,122 L196,122 L162,78 Z M20,64 L8,34 L26,34 L48,62 Z" fill="#b8c3cf" />
    <path d="M250,60 Q270,60 282,66 L250,66 Z" fill="#7a8a9c" />
  </svg>
);
const Scale: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 27.70
  const T = (t: number) => s(t - 27.7);
  const inn = ease(f, 0, 12);
  const jets = ease(f, T(28.4), T(28.6)), jets2 = ease(f, T(28.5), T(28.7));
  const ang = interpolate(spring({ frame: f - T(29.7), fps: FPS, config: { damping: 8, mass: 1.3 } }), [0, 1], [0, 8]);
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <div style={{ position: "absolute", left: 930, top: 760, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "110px solid #2a1c14" }} />
      <div style={{ position: "absolute", left: 340, top: 750, width: 1300, height: 20, borderRadius: 10, background: "#a5713f", transform: `rotate(${-ang}deg)`, transformOrigin: "650px 10px", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
        <div style={{ position: "absolute", left: 30, bottom: 20, width: 470, height: 170, background: "linear-gradient(170deg,#d9a46a,#9a6a3c)", borderRadius: 6, boxShadow: "inset -14px -14px 0 rgba(0,0,0,.18)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "rgba(40,20,8,.75)" }}>~1,000 TONS</div>
        </div>
        <div style={{ position: "absolute", right: 30, bottom: 22, opacity: jets, transform: `translateY(${(1 - jets) * -60}px)` }}><Jet w={300} /></div>
        <div style={{ position: "absolute", right: 30, bottom: 150, opacity: jets2, transform: `translateY(${(1 - jets2) * -60}px)` }}><Jet w={300} /></div>
      </div>
      <KeyLine a={T(28.3)} text="two fully loaded *jumbo* jets" align="center" y={180} size={52} />
    </AbsoluteFill>
  );
};

// ---------- 5. la toma de Giza se achica a tarjeta; entra Stonehenge ----------
const Card: React.FC<{ img: string; x: number; y: number; w: number; h: number; o?: number; sc?: number; label?: string; hot?: boolean }> = ({ img, x, y, w, h, o = 1, sc = 1, label, hot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${sc})`, borderRadius: 16, overflow: "hidden",
    border: "6px solid rgba(255,255,255,.93)", boxShadow: "0 30px 70px rgba(0,0,0,.65)" }}>
    <Img src={staticFile(P + img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 18px", background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: hot ? C.red : C.ink }}>{label}</div>}
  </div>
);
const Wonders: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 36.55
  const T = (t: number) => s(t - 36.55);
  const k = interpolate(f, [T(39.95), T(40.5)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) }); // full frame → tarjeta
  const W0 = 1920, H0 = 1080, W1 = 560, H1 = 380, X1 = 370, Y1 = 330;
  const w = W0 + (W1 - W0) * k, h = H0 + (H1 - H0) * k, x = X1 * k, y = Y1 * k;
  const st = spring({ frame: f - T(41.0), fps: FPS, config: { damping: 15 } });
  const big = 1 + 0.05 * ease(f, T(43.15), T(43.4)) - 0.05 * ease(f, T(43.7), T(44.0));
  const away = ease(f, T(44.2), T(44.55));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: k, filter: "blur(30px) brightness(.4) saturate(.8)", transform: "scale(1.15)" }}>
        <Img src={staticFile(P + "giza.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: x, top: y + away * 140, width: w, height: h, borderRadius: 16 * k, overflow: "hidden", opacity: 1 - away,
        border: `${6 * k}px solid rgba(255,255,255,.93)`, boxShadow: `0 30px 70px rgba(0,0,0,${0.65 * k})`, transform: `scale(${k > 0.99 ? big : 1})` }}>
        <OffthreadVideo src={staticFile(P + "pex_10719817.mp4")} startFrom={s(60)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.06 * (f / T(41))})` }} />
      </div>
      <Card img="stonehenge.jpg" x={990} y={330 + (1 - st) * 90 + away * 140} w={560} h={380} o={st * (1 - away)} sc={big} />
      <KeyLine a={T(42.5)} text="yes, they're *enormous.*" align="center" y={830} size={52} out={T(44.15)} />
      <KeyLine a={T(44.3)} text="but big is *not* the mystery." align="center" y={510} size={64} />
    </AbsoluteFill>
  );
};

// ---------- 6. la ilustrada larga: la cuadrilla arrastra el bloque... y dos tipos mueven un sillón igual ----------
const Rope: React.FC<{ x1: number; x2: number; y: number }> = ({ x1, x2, y }) => <div style={{ position: "absolute", left: x1, top: y, width: x2 - x1, height: 4, background: "#c9a46a", borderRadius: 2 }} />;
const Tag: React.FC<{ a: number; text: string; x: number; y: number }> = ({ a, text, x, y }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - a, fps: FPS, config: { damping: 12 } });
  return <div style={{ position: "absolute", left: x, top: y - t * 18, opacity: Math.min(1, t * 1.4), transform: `scale(${0.7 + 0.3 * t})`, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.ink,
    background: "rgba(10,14,22,.72)", border: `3px solid ${C.orange}`, borderRadius: 40, padding: "8px 24px", letterSpacing: 2 }}>{text}</div>;
};
const Drag: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 45.90
  const T = (t: number) => s(t - 45.9);
  const go = f * 1.1;                                          // la cuadrilla avanza despacio
  const cam = interpolate(f, [T(51.6), T(52.6)], [0, 1850], { ...cl, easing: (x) => x * x * (3 - 2 * x) }); // travelling al sillón
  const G = 520 + go - cam, Y = 900;
  const heave = Math.abs(Math.sin(f / 9)) * 4;
  return (
    <SunsetStage tree="palm" horizon={560} pan={0.35 + (cam > 0 && cam < 1850 ? 2.5 : 0)} sunX={1500}>
      {/* bloque sobre trineo de troncos */}
      <div style={{ position: "absolute", left: G - 470, top: Y - 330 - heave * 0.3, width: 520, height: 290, background: "linear-gradient(165deg,#c99a62,#8a6038)", borderRadius: 6, boxShadow: "inset -14px -14px 0 rgba(0,0,0,.2)" }} />
      <div style={{ position: "absolute", left: G - 500, top: Y - 40, width: 580, height: 34, borderRadius: 13, background: "#5a3a22" }} />
      <Rope x1={G + 50} x2={G + 1060} y={Y - 205} />
      {Array.from({ length: 7 }).map((_, i) => <Person key={i} x={G + 150 + i * 135} y={Y + 4} s={0.85} walk />)}
      {/* los tags de la receta */}
      <Tag a={T(46.38)} text="+ PEOPLE" x={G + 260} y={420} />
      <Tag a={T(47.34)} text="+ ROPE" x={G + 640} y={330} />
      <Tag a={T(48.3)} text="+ DECADES" x={G + 380} y={230} />
      {/* el chiste: dos tipos con el sillón, mismo método */}
      <div style={{ position: "absolute", left: 1850 + 470 + go * 0.9 - cam - 40, top: Y - 230 - heave * 0.4, transform: "scale(1.5)", transformOrigin: "0 100%" }}>
        <div style={{ position: "absolute", left: 0, top: 30, width: 290, height: 80, borderRadius: 18, background: "#3f6fa8" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 290, height: 50, borderRadius: "18px 18px 6px 6px", background: "#4b80bf" }} />
        <div style={{ position: "absolute", left: -18, top: 10, width: 40, height: 100, borderRadius: 14, background: "#365f92" }} />
        <div style={{ position: "absolute", left: 268, top: 10, width: 40, height: 100, borderRadius: 14, background: "#365f92" }} />
      </div>
      <Person x={1850 + 470 + go * 0.9 - cam - 110} y={Y + 4} s={0.85} walk flip />
      <Person x={1850 + 470 + go * 0.9 - cam + 520} y={Y + 4} s={0.85} walk />
    </SunsetStage>
  );
};

// ---------- 7. cierre: grande vs perfecta ----------
const BigVsPerfect: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 58.95
  const T = (t: number) => s(t - 58.95);
  const a1 = spring({ frame: f - T(59.0), fps: FPS, config: { damping: 15 } }), a2 = spring({ frame: f - T(59.5), fps: FPS, config: { damping: 15 } });
  const big = ease(f, T(61.15), T(61.4)), per = ease(f, T(62.2), T(62.45));
  const thru = interpolate(f, [T(63.0), T(64.4)], [0, 1], { ...cl, easing: (x) => x * x });
  // la tarjeta "perfect" crece hasta llenar el cuadro (zoom-through al muro)
  const W = 620 + (1920 - 620) * thru, H = 420 + (1080 - 420) * thru, X = 1030 + (0 - 1030) * thru, Y = 300 + (0 - 300) * thru;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.35)", transform: "scale(1.15)" }}><Img src={staticFile(P + "c036.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <Card img="c009.jpg" x={270} y={300 + (1 - a1) * 90} w={620} h={420} o={a1 * (1 - per * 0.6) * (1 - thru)} sc={1 + big * 0.05 - per * 0.05} label="BIG" />
      <div style={{ position: "absolute", left: X, top: Y + (1 - a2) * 90, width: W, height: H, opacity: a2, borderRadius: 16 * (1 - thru), overflow: "hidden",
        border: `${6 * (1 - thru)}px solid rgba(255,255,255,.93)`, boxShadow: "0 30px 70px rgba(0,0,0,.65)", transform: `scale(${1 + per * 0.08 * (1 - thru)})` }}>
        <Img src={staticFile(P + "c032.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + thru * 0.08})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 18px", background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: per > 0.5 ? C.red : C.ink, opacity: 1 - thru }}>PERFECT</div>
      </div>
      <Flash at={T(62.26)} warm peak={0.45} />
    </AbsoluteFill>
  );
};

// ---------- línea de tiempo ----------
type Sh = { a: number; b: number; el: React.ReactNode };
const SH: Sh[] = [
  { a: 0, b: 2.5, el: <><Plate src="pex_35802404.mp4" d={s(2.5)} from={4} z={[1.02, 1.08]} /></> },
  { a: 2.4, b: 9.7, el: <Gallery d={s(7.3)} /> },
  { a: 9.62, b: 11.0, el: <><Plate src="pex_30456097.mp4" d={s(1.4)} from={1} z={[1.1, 1.18]} /><Flash at={0} peak={0.7} /></> },
  { a: 11.0, b: 13.3, el: <Gallery museum d={s(2.3)} /> },
  { a: 12.9, b: 14.9, el: <Seven /> },
  { a: 14.35, b: 16.4, el: <CircleIn x={PERU_XY.x} y={PERU_XY.y} dur={s(0.55)}><Plate src="pex_36754598.mp4" d={s(2.05)} from={6} z={[1.12, 1.04]} /><PlaceTag a={s(1.2)} text="PERU" sub="CUSCO · 3,400 M" /></CircleIn> },
  { a: 16.35, b: 19.0, el: <><Plate src="c039.jpg" d={s(2.65)} z={[1.05, 1.13]} origin="60% 50%" /><Stack x={1140} y={70} size={150} lines={[{ t: "500+", at: s(17.42 - 16.35), hot: true }, { t: "YEARS", at: s(17.9 - 16.35) }]} /></> },
  { a: 19.0, b: 22.6, el: <><Plate src="c034.jpg" d={s(3.6)} z={[1.08, 1.12]} px={[40, -60]} dark={0.35} /><Stack lines={[{ t: "NO IRON.", at: s(0.06) }, { t: "NO WHEELS.", at: s(1.0) }, { t: "NO MORTAR.", at: s(1.9), hot: true }]} /></> },
  { a: 22.55, b: 25.8, el: <><Plate src="c037.jpg" d={s(3.25)} z={[1.0, 1.06]} origin="70% 50%" /><CardJoint /></> },
  { a: 25.75, b: 30.6, el: <><Plate src="c009.jpg" d={s(4.85)} z={[1.03, 1.12]} blurAt={s(1.95)} /><PlaceTag a={s(0.15)} text="LEBANON" sub="BAALBEK" /><Sequence from={s(1.95)}><Scale /></Sequence></> },
  { a: 30.55, b: 34.45, el: <><Plate src="c025.jpg" d={s(3.9)} z={[1.04, 1.14]} origin="40% 50%" /><KeyLine a={s(32.9 - 30.55)} text="cut nearly *2,000* years ago." y={880} size={50} /></> },
  { a: 34.4, b: 36.6, el: <><Plate src="c001.jpg" d={s(2.2)} z={[1.1, 1.02]} coolAt={s(0.1)} /><KeyLine a={s(0.15)} text="nobody has *moved* it since." y={880} size={50} /></> },
  { a: 36.55, b: 45.95, el: <Wonders /> },
  { a: 45.9, b: 55.9, el: <Drag /> },
  { a: 55.85, b: 59.0, el: <><Plate src="c033.jpg" d={s(3.15)} z={[1.06, 1.1]} blurAt={0} blurTo={22} /><KeyLine a={s(56.2 - 55.85)} text="not how *heavy*…" align="center" y={470} size={64} out={s(57.88 - 55.85)} /><Sequence from={s(57.88 - 55.85)}><KeyLine a={0} prev="not how *heavy*…" text="it's how *tight.*" align="center" y={560} size={64} /></Sequence></> },
  { a: 58.95, b: 64.5, el: <BigVsPerfect /> },
];

export const Min1: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SH.map((x, i) => (
      <Sequence key={i} from={s(x.a)} durationInFrames={s(x.b) - s(x.a)}>{x.el}</Sequence>
    ))}
    <Audio src={staticFile("sealed02.wav")} />
  </AbsoluteFill>
);
