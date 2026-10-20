// sealed02 · minuto 1 v2 ("una locura, con profundidad"): mismas costuras BTG del v1 (Min1.tsx) pero
// · las fotos quietas pasan a tomas LTX con cámara real (drone / grúa / macro / recreación) → profundidad de verdad
// · galería, globo, balanza y arrastre = escenas three.js con luz, sombra, niebla y polvo (three3d.tsx)
// · tipografía extruida en perspectiva, tarjetas 3D con canto, reflejo en el piso y profundidad de campo
// Tiempos en SEGUNDOS clavados a las palabras de la voz (caps.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { C, FONT, KeyLine } from "../kits/btg/kit";
import { Diorama3D, Gallery3D, Globe3D, Scale3D } from "./three3d";

loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const P = "sealed02/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sm = (x: number) => x * x * (3 - 2 * x);
const e = (f: number, a: number, b: number) => sm(interpolate(f, [a, b], [0, 1], cl));
export const MIN2_FRAMES = s(64.5);

// desde qué segundo de cada clip LTX arranca su toma (se ajusta mirando los clips)
const FROM: Record<string, number> = {
  hook_andes: 3.6, laser_cut: 1.0, cusco_walls: 0.3, inca_masons: 8.0, joint_macro: 0.4, baalbek_block: 1.0, baalbek_quarry: 1.5,
  baalbek_man: 1.0, giza_fly: 0.5, stonehenge_orbit: 1.0, drag_ancient: 2.0, hatun_alley: 1.0, poly_push: 0.3,
};
const ltx = (id: string) => P + (/^(ag|px|pex)_/.test(id) ? id : "ltx_" + id) + ".mp4";
export const Vid: React.FC<{ id: string; off?: number; style?: React.CSSProperties }> = ({ id, off = 0, style }) => id.startsWith("img_") ? (
  <Img src={staticFile(P + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
) : (
  <OffthreadVideo src={staticFile(ltx(id))} startFrom={s((FROM[id] ?? 0.3) + off)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
);

// ---------- toma LTX a pantalla completa: la cámara ya se mueve; acá sólo blur/viraje/oscurecido animables ----------
type ShotP = { id: string; d: number; off?: number; z?: [number, number]; dark?: number; blurAt?: number; blurTo?: number; coolAt?: number };
export const Shot: React.FC<ShotP> = ({ id, d, off, z = [1.0, 1.04], dark = 0, blurAt, blurTo = 24, coolAt }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, d], [0, 1], cl);
  const b = blurAt !== undefined ? e(f, blurAt, blurAt + 12) : 0;
  const c = coolAt !== undefined ? e(f, coolAt, coolAt + 40) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z[0] + (z[1] - z[0]) * k + b * 0.06})`, filter: `blur(${b * blurTo}px) brightness(${1 - b * 0.55 - c * 0.12}) saturate(${1 - c * 0.65}) hue-rotate(${c * 12}deg)` }}>
        <Vid id={id} off={off} />
      </AbsoluteFill>
      {c > 0 && <AbsoluteFill style={{ background: `rgba(20,40,70,${c * 0.22})`, mixBlendMode: "multiply" }} />}
      {dark > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.4) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{ at: number; warm?: boolean; peak?: number }> = ({ at, warm, peak = 0.85 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at - 2, at, at + 7], [0, peak, 0], cl);
  return o > 0 ? <AbsoluteFill style={{ background: warm ? "#fff2dc" : "#fff", opacity: o, mixBlendMode: "screen" }} /> : null;
};

// extrusión: capas de sombra dura (el canto de la letra) + sombra suave al piso
export const extrude = (n: number, col: string, dx = 0.6, dy = 1) =>
  Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${col}`).join(", ") + `, ${n * dx + 6}px ${n * dy + 16}px 34px rgba(0,0,0,.65)`;

export const PlaceTag: React.FC<{ a: number; text: string; sub?: string }> = ({ a, text, sub }) => {
  const f = useCurrentFrame();
  const t = e(f, a, a + 12);
  return (
    <div style={{ position: "absolute", left: 110, top: 96, fontFamily: FONT, opacity: t, perspective: 900 }}>
      <div style={{ transform: `rotateY(${(1 - t) * 40 + 12}deg) translateZ(${(1 - t) * -120}px)`, transformOrigin: "0 50%" }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: C.orange, display: "inline-block", marginRight: 16, boxShadow: `0 0 14px ${C.orange}` }} />
        <span style={{ fontWeight: 900, fontSize: 46, color: C.ink, letterSpacing: 4, textShadow: extrude(5, "#3a3026") }}>{text}</span>
        {sub && <div style={{ fontWeight: 800, fontSize: 26, color: C.dim, marginLeft: 26, marginTop: 6, letterSpacing: 3, textShadow: "0 2px 10px #000" }}>{sub}</div>}
      </div>
    </div>
  );
};
// palabras extruidas en perspectiva: cada una nace desde el fondo (translateZ) y el bloque gira lento (paralaje)
export const Stack3D: React.FC<{ lines: { t: string; at: number; hot?: boolean }[]; x?: number; y?: number; size?: number; ry?: number; drift?: number }> = ({ lines, x = 130, y = 330, size = 124, ry = 16, drift = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 1100, perspectiveOrigin: "0% 50%" }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateY(${ry - f * 0.12 * drift}deg) rotateX(${4 + f * 0.03}deg)`, transformOrigin: "0 50%", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02 }}>
        {lines.map((l, i) => {
          const t = spring({ frame: f - l.at, fps: FPS, config: { damping: 14, mass: 0.8 } });
          return <div key={i} style={{ opacity: Math.min(1, t * 1.5), transform: `translateZ(${(1 - t) * 520}px)`, color: l.hot ? C.red : C.ink, textShadow: extrude(12, l.hot ? "#7a1410" : "#4a4238") }}>{l.t}</div>;
        })}
      </div>
    </div>
  );
};

// ---------- tarjeta 3D: video adentro, canto con espesor, reflejo en el piso y sombra de contacto ----------
type C3 = { id?: string; off?: number; x: number; y: number; w: number; h: number; ry?: number; rx?: number; z?: number; o?: number; label?: string; hot?: boolean; blur?: number; gray?: number; radius?: number; frame?: number };
export const Card3D: React.FC<C3> = ({ id, off, x, y, w, h, ry = 0, rx = 0, z = 0, o = 1, label, hot, blur = 0, gray = 0, radius = 16, frame = 1 }) => {
  const T = 16; // espesor del canto
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1700, opacity: o, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {/* canto (lado derecho e inferior) */}
        <div style={{ position: "absolute", right: -T / 2, top: radius * frame, width: T, height: h - 2 * radius * frame, background: "linear-gradient(90deg,#d8d4cc,#8c877e)", transform: `rotateY(90deg)`, transformOrigin: "50% 50%" }} />
        <div style={{ position: "absolute", left: -T / 2, top: radius * frame, width: T, height: h - 2 * radius * frame, background: "linear-gradient(90deg,#8c877e,#d8d4cc)", transform: `rotateY(-90deg)`, transformOrigin: "50% 50%" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: radius * frame, overflow: "hidden", transform: `translateZ(${T / 2}px)`,
          border: `${6 * frame}px solid rgba(255,255,255,.94)`, boxShadow: `0 40px 90px rgba(0,0,0,${0.7 * frame})`, background: "#111",
          WebkitBoxReflect: frame > 0.5 ? "below 26px linear-gradient(transparent 62%, rgba(255,255,255,.22))" : undefined } as React.CSSProperties}>
          {id && <div style={{ width: "100%", height: "100%", filter: gray ? `grayscale(${gray}) brightness(${1 - gray * 0.35})` : undefined }}><Vid id={id} off={off} /></div>}
          {/* brillo especular que barre con el giro */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${105 + ry * 2}deg, transparent 35%, rgba(255,255,255,${0.1 * frame}) 50%, transparent 65%)` }} />
          {label && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 20px", background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: 4, color: hot ? C.red : C.ink, opacity: frame }}>{label}</div>}
        </div>
      </div>
    </div>
  );
};
// fondo "estudio" con piso que refleja (para las escenas de tarjetas)
export const Studio: React.FC<{ id: string; off?: number }> = ({ id, off }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ filter: "blur(34px) brightness(.32) saturate(.8)", transform: "scale(1.2)" }}><Vid id={id} off={off} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,.55) 74%, rgba(0,0,0,.85) 100%)" }} />
    <div style={{ position: "absolute", left: -200, right: -200, top: 760, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,220,180,.18), transparent)" }} />
  </AbsoluteFill>
);

// ---------- la tarjeta de crédito 3D que no entra en la junta ----------
export const CardJoint3D: React.FC<{ jx?: number; jy?: number }> = ({ jx = 960, jy = 540 }) => {
  const f = useCurrentFrame(); // local 0 = 22.55
  const T = (t: number) => s(t - 22.55);
  const inn = e(f, T(23.45), T(23.65));
  const slide = interpolate(f, [T(23.5), T(24.25)], [1, 0], { ...cl, easing: (k) => 1 - (1 - k) * (1 - k) });
  const bump = f > T(24.25) ? Math.sin((f - T(24.25)) * 1.6) * 10 * Math.exp(-(f - T(24.25)) / 6) : 0;
  const glow = e(f, T(22.7), T(23.3)) * (1 - e(f, T(24.6), T(25.4)));
  return (
    <AbsoluteFill>
      {/* la junta se enciende como un hilo de luz */}
      <div style={{ position: "absolute", left: jx - 3, top: 0, width: 6, height: 1080, background: "linear-gradient(180deg, transparent, rgba(255,255,255,.9) 30%, rgba(255,255,255,.9) 70%, transparent)", opacity: glow * 0.7, filter: "blur(2px)", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1200, perspectiveOrigin: `${jx}px ${jy}px` }}>
        <div style={{ position: "absolute", left: jx + 4, top: jy - 180, width: 560, height: 354, transformStyle: "preserve-3d", opacity: inn,
          transform: `translateX(${slide * 620 + bump}px) translateZ(${slide * 380 + 40}px) rotateY(${-74 + slide * 30}deg) rotateZ(${slide * -8}deg)`, transformOrigin: "0 50%" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(135deg,#1d2a44,#34507e 55%,#1a2438)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.25)" }}>
            <div style={{ position: "absolute", left: 50, top: 110, width: 90, height: 68, borderRadius: 9, background: "linear-gradient(135deg,#f1d27c,#a8862c)" }} />
            <div style={{ position: "absolute", left: 50, top: 230, fontFamily: "monospace", fontSize: 36, color: "rgba(255,255,255,.75)", letterSpacing: 3 }}>•••• •••• •••• 4021</div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,.25) 48%, transparent 60%)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, width: 5, height: 354, background: "#0e1626", transform: "rotateY(90deg)", transformOrigin: "0 50%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: jx - 46, top: jy - 220, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.red, opacity: e(f, T(24.3), T(24.4)),
        transform: `perspective(700px) translateZ(${(1 - e(f, T(24.3), T(24.5))) * 260}px)`, textShadow: extrude(8, "#6a1210") }}>✕</div>
      <KeyLine a={T(23.65)} text="not even a *credit card.*" align="center" y={900} size={52} />
    </AbsoluteFill>
  );
};

// la toma de Perú nace DENTRO del pilar de Perú (zoom-through; el globo termina con Perú al centro)
export const CircleIn: React.FC<{ children: React.ReactNode; dur: number }> = ({ children, dur }) => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, dur], [16, 2300], { ...cl, easing: (k) => k * k * k });
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at 960px 540px)` }}>{children}</AbsoluteFill>;
};

// ---------- Giza → tarjeta 3D; entra Stonehenge desde el fondo; las dos se van a la profundidad ----------
const Wonders3D: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 36.55
  const T = (t: number) => s(t - 36.55);
  const k = interpolate(f, [T(39.95), T(40.55)], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const W1 = 640, H1 = 400, X1 = 300, Y1 = 300;
  const w = 1920 + (W1 - 1920) * k, h = 1080 + (H1 - 1080) * k, x = X1 * k, y = Y1 * k;
  const st = spring({ frame: f - T(41.0), fps: FPS, config: { damping: 15 } });
  const big = e(f, T(43.15), T(43.4)) - e(f, T(43.7), T(44.0));
  const away = e(f, T(44.15), T(44.7));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: k }}><Studio id="giza_fly" off={3} /></AbsoluteFill>
      <Card3D id="stonehenge_orbit" x={980} y={300} w={W1} h={H1} ry={-20 + st * 2 - f * 0.04} z={-1400 * (1 - st) + big * 90 - away * 1800} o={st * (1 - away)} blur={away * 6} />
      <Card3D id="giza_fly" x={x} y={y} w={w} h={h} ry={k * (20 - f * 0.03 + 0)} rx={k * 2} z={big * 90 - away * 1800} o={1 - away} frame={k} radius={16} blur={away * 6} />
      <KeyLine a={T(42.5)} text="yes, they're *enormous.*" align="center" y={850} size={54} out={T(44.15)} />
      <Sequence from={T(44.3)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", perspective: 1000 }}>
          {(() => { const lf = f - T(44.3), t = spring({ frame: lf, fps: FPS, config: { damping: 14 } });
            return <div style={{ display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.ink, opacity: Math.min(1, t * 1.4), transform: `translateZ(${(1 - t) * 600}px) rotateX(${(1 - t) * 20}deg)`, textShadow: extrude(10, "#3c352c") }}>
              but big is <span style={{ color: C.red, textShadow: extrude(10, "#6a1210") }}>NOT</span> the mystery.</div>; })()}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- el arrastre real (LTX) con las etiquetas de la receta flotando en profundidad ----------
export const Pill: React.FC<{ a: number; text: string; x: number; y: number; z: number }> = ({ a, text, x, y, z }) => {
  const f = useCurrentFrame();
  const t = spring({ frame: f - a, fps: FPS, config: { damping: 12 } });
  const par = (f - a) * (0.6 + z / 400); // paralaje: las más cercanas se deslizan más
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1200 }}>
      <div style={{ position: "absolute", left: x - par, top: y, opacity: Math.min(1, t * 1.4), transform: `translateZ(${z + (1 - t) * 500}px) rotateY(-14deg)`, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink,
        background: "rgba(10,14,22,.72)", border: `3px solid ${C.orange}`, borderRadius: 50, padding: "10px 30px", letterSpacing: 3, boxShadow: "0 24px 50px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08) inset", backdropFilter: "blur(6px)" }}>{text}</div>
    </div>
  );
};

// ---------- cierre: grande vs perfecta (tarjetas 3D) → PERFECT llena el cuadro ----------
const BigVsPerfect3D: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 58.95
  const T = (t: number) => s(t - 58.95);
  const a1 = spring({ frame: f - T(59.0), fps: FPS, config: { damping: 15 } }), a2 = spring({ frame: f - T(59.5), fps: FPS, config: { damping: 15 } });
  const big = e(f, T(61.15), T(61.4)) * (1 - e(f, T(62.2), T(62.4)));
  const per = e(f, T(62.2), T(62.45));
  const thru = interpolate(f, [T(63.0), T(64.4)], [0, 1], { ...cl, easing: (x) => x * x });
  const W0 = 640, H0 = 420;
  const w = W0 + (1920 - W0) * thru, h = H0 + (1080 - H0) * thru, x = 1000 * (1 - thru), y = 300 * (1 - thru);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Studio id="hatun_alley" off={4} />
      <Card3D id="baalbek_block" off={6} x={280} y={300} w={W0} h={H0} ry={18 - f * 0.05} z={-1200 * (1 - a1) + big * 140 - per * 260} o={a1 * (1 - thru)} label="BIG" gray={per * 0.8} blur={per * 3} />
      <Card3D id="poly_push" x={x} y={y + (1 - a2) * 60} w={w} h={h} ry={(-18 + f * 0.05) * (1 - thru) * (1 - per * 0.5)} z={(-1200 * (1 - a2) + per * 160) * (1 - thru)} o={a2} label="PERFECT" hot={per > 0.5} frame={1 - thru} />
      <Flash at={T(62.26)} warm peak={0.45} />
    </AbsoluteFill>
  );
};

// ---------- línea de tiempo ----------
type Sh = { a: number; b: number; el: React.ReactNode };
const SH: Sh[] = [
  { a: 0, b: 2.5, el: <Shot id="hook_andes" d={s(2.5)} /> },
  { a: 2.4, b: 9.7, el: <Gallery3D d={s(7.3)} /> },
  { a: 9.62, b: 11.0, el: <><Shot id="laser_cut" d={s(1.4)} z={[1.06, 1.12]} /><Flash at={0} peak={0.7} /></> },
  { a: 11.0, b: 13.3, el: <Gallery3D museum d={s(2.3)} /> },
  { a: 12.9, b: 14.9, el: <Globe3D /> },
  // Perú: UNA sola toma de drone de 4,6 s (sin corte) — nace dentro del pilar y sigue con el 500+
  { a: 14.35, b: 19.0, el: <CircleIn dur={s(0.55)}><Shot id="cusco_walls" d={s(4.65)} z={[1.08, 1.0]} /><PlaceTag a={s(0.9)} text="PERU" sub="CUSCO · 3,400 M" />
      <Stack3D x={1120} y={120} size={160} ry={-18} drift={-1} lines={[{ t: "500+", at: s(17.42 - 14.35), hot: true }, { t: "YEARS", at: s(17.9 - 14.35) }]} /></CircleIn> },
  { a: 19.0, b: 22.6, el: <><Shot id="inca_masons" d={s(3.6)} dark={0.3} /><Stack3D lines={[{ t: "NO IRON.", at: s(0.06) }, { t: "NO WHEELS.", at: s(1.0) }, { t: "NO MORTAR.", at: s(1.9), hot: true }]} /></> },
  { a: 22.55, b: 25.8, el: <><Shot id="joint_macro" d={s(3.25)} z={[1.0, 1.05]} /><CardJoint3D jx={1340} jy={540} /></> },
  { a: 25.75, b: 30.6, el: <><Shot id="baalbek_block" d={s(4.85)} blurAt={s(1.95)} /><Sequence durationInFrames={s(2.0)}><PlaceTag a={s(0.15)} text="LEBANON" sub="BAALBEK" /></Sequence><Sequence from={s(1.95)}><Scale3D /></Sequence></> },
  { a: 30.55, b: 34.45, el: <><Shot id="baalbek_quarry" d={s(3.9)} /><KeyLine a={s(32.9 - 30.55)} text="cut nearly *2,000* years ago." y={880} size={52} /></> },
  { a: 34.4, b: 36.6, el: <><Shot id="baalbek_man" d={s(2.2)} coolAt={s(0.1)} /><KeyLine a={s(0.15)} text="nobody has *moved* it since." y={880} size={52} /></> },
  { a: 36.55, b: 45.95, el: <Wonders3D /> },
  { a: 45.9, b: 51.95, el: <><Shot id="drag_ancient" d={s(6.05)} z={[1.0, 1.06]} />
      <Pill a={s(46.38 - 45.9)} text="+ PEOPLE" x={360} y={300} z={120} /><Pill a={s(47.34 - 45.9)} text="+ ROPE" x={820} y={210} z={40} /><Pill a={s(48.3 - 45.9)} text="+ DECADES" x={1200} y={330} z={200} />
      <KeyLine a={s(49.7 - 45.9)} text="drag a *giant rock* almost anywhere." align="center" y={900} size={52} /></> },
  { a: 51.9, b: 55.9, el: <Diorama3D /> },
  { a: 55.85, b: 59.0, el: <><Shot id="hatun_alley" d={s(3.15)} blurAt={s(0.1)} blurTo={14} />
      <Sequence from={s(56.2 - 55.85)} durationInFrames={s(57.95 - 56.2)}><Stack3D x={150} y={380} size={110} ry={0} drift={0.6} lines={[{ t: "not how", at: 0 }, { t: "HEAVY…", at: s(57.2 - 56.2) }]} /></Sequence>
      <Sequence from={s(57.88 - 55.85)}><Stack3D x={980} y={380} size={110} ry={-14} drift={-0.6} lines={[{ t: "it's how", at: 0 }, { t: "TIGHT.", at: s(58.16 - 57.88), hot: true }]} /></Sequence></> },
  { a: 58.95, b: 64.5, el: <BigVsPerfect3D /> },
];

export const Min2: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SH.map((x, i) => (
      <Sequence key={i} from={s(x.a)} durationInFrames={s(x.b) - s(x.a)}>{x.el}</Sequence>
    ))}
    {!noAudio && <Audio src={staticFile("sealed02.wav")} />}
  </AbsoluteFill>
);
