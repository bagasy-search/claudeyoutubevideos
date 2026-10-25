// hdc30 · EL VIDEO ENTERO (+30 min) data-driven: body.json (mkbody.py) trae las tomas (foto/clip de agnes o el mundo 3D con su pose
// y su estado) y las piezas, cada una clavada a la frase de su toma. El avatar entra y sale por un portal en sus ventanas (las pagó
// el /run: no se mueven). Mismo archivo para tomate / rosal / perros (mode.ts dice qué planta muestra el mundo).
// Audio fuera de Remotion (voz + sonido real de los clips en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import BODY from "./body.json";
import AVAIL from "./avail.json";
import { World as WorldRaw, PT, BASE, makeCam, type Key, type WorldState } from "./huerto3d";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { BigNum, COL, FONT, LowerThird, P, Portal, e, ei, extrude, s, spr } from "./lib";
import { CheckList, Mistake, NextCard, StepTitle } from "./comps2";
import { MODE } from "./mode";

type Row = { a: number; b: number; base: "img" | "w"; k?: string; pose?: string; st?: string[] };
type Ov = { k: string; at: number; out: number; [x: string]: any };
const B = BODY as unknown as { end: number; win: { ms: number; me: number; off: number }[]; rows: Row[]; ov: Ov[]; libro: number };
const AV = AVAIL as unknown as { reel: boolean; reelLen: number; clips: Record<string, number>; imgs: string[] };
const IMGS = new Set(AV.imgs);
export const END = B.end;
const WIN = B.win;

// ---------------- avatar (reel0 = las ventanas una detrás de otra; off = dónde empieza cada una en el reel) ----------------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me + 0.5);
  if (!AV.reel) return <AbsoluteFill style={{ background: "#1b2418" }}><Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>;
  if (cur < 0) return null;
  const w = WIN[cur], st = Math.max(0, s(w.off) - 12), lastF = s(AV.reelLen) - 2;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano seed={1}>
    <Sequence from={Math.max(0, s(w.ms) - 12)} layout="none">
      <Freeze frame={lastF - st} active={(f) => f > lastF - st}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={st} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Freeze>
    </Sequence>
  </CamaraMano></AbsoluteFill>;
};

// ---------------- la cámara del mundo: una pose por toma, llega volando en 0,45 s y deriva lento ----------------
type Pose = Omit<Key, "t">;
const POSE: Record<string, Pose> = {
  wide: { p: [0.0, 1.9, 4.6], l: [0.3, 1.2, -0.6], fov: 45 },
  plant: { p: [0.25, 1.65, 2.5], l: [0.0, 1.55, 0.0], fov: 42 },
  flowers: { p: [0.5, 2.05, 1.05], l: [0.05, 1.9, 0.05], fov: 36 },
  soilTop: { p: [0.55, 1.45, 1.05], l: [0.0, 0.72, -0.05], fov: 38 },
  topTruss: { p: [-0.25, 2.5, 0.95], l: [-0.05, 2.3, 0.1], fov: 34 },
  rot: { p: [-0.2, 2.32, 0.55], l: [-0.06, 2.24, 0.12], fov: 30 },
  botTruss: { p: [0.95, 1.25, 1.75], l: [0.08, 1.0, 0.08], fov: 32 },
  bench: { p: [1.6, 1.35, 0.6], l: [1.8, 0.85, -1.3], fov: 36 },
  molca: { p: [2.05, 1.25, -0.7], l: [2.15, 0.88, -1.35], fov: 30 },
  section: { p: [0.0, 0.55, 1.45], l: [0.0, 0.42, 0.0], fov: 36 },
  thermo: { p: [-0.6, 1.85, -1.3], l: [-0.95, 1.9, -2.5], fov: 34 },
  cane: { p: [0.45, 1.7, 0.9], l: [0.09, 1.6, -0.06], fov: 34 },
  sucker: { p: [0.35, 1.5, 0.5], l: [0.07, 1.47, 0.05], fov: 28 },
};
const drift = (q: Pose, i: number): Pose => {
  const d = 0.08 + 0.05 * (i % 3), sg = i % 2 ? 1 : -1;
  return { ...q, p: [q.p[0] + sg * d, q.p[1] + 0.03 * sg, q.p[2] - d * 0.8], fov: (q.fov ?? 38) - 2 };
};
const WROWS = B.rows.map((r, i) => ({ r, i })).filter((x) => x.r.base === "w");
const KEYS: Key[] = [{ t: 0, ...POSE.wide }];
WROWS.forEach(({ r, i }) => {
  const q = POSE[r.pose!] ?? POSE.wide;
  KEYS.push({ t: r.a + 0.45, ...q, arc: 0.03 }, { t: r.b, ...drift(q, i) });
});
const CAM = makeCam(KEYS);

// ---------------- el estado del mundo: base del modo + lo que pide la toma (entra en 1,2 s) ----------------
const MODEBASE: Partial<WorldState> = MODE === "perros" ? { mulch: 1 } : MODE === "rosal" ? { mulch: 0.5 } : {};
const stAt = (t: number): WorldState => {
  const row = B.rows.find((r) => r.base === "w" && t >= r.a - 0.5 && t < r.b + 0.5);
  const st: WorldState = { ...BASE, jarFill: 0.85, peels: 1, ferment: 0.75, cloth: 1, bucket: 0.75, powder: 1, shells: 0.6, ...MODEBASE } as WorldState;
  if (!row) return st;
  const k = e(t, row.a, row.a + 1.2), g = e(t, row.a + 0.3, row.b), has = (x: string) => row.st!.includes(x);
  const four = (v: number) => [0, 1, 2, 3].map((i) => Math.max(0, Math.min(1, v * 1.4 - i * 0.12)));
  if (has("fruit") && MODE === "tomate") { st.fruit = four(g); st.flw = st.fruit.map((f) => (f > 0.15 ? 0 : 1)); }
  if (has("ripe") && MODE === "tomate") st.ripe = four(e(t, row.a + 0.8, row.b)).map((x) => 0.85 * x);
  if (has("rot")) { if (MODE === "tomate") { st.fruit = [0, 0, 0, 0.85]; st.ripe = [0, 0, 0, 0.7]; st.flw = [1, 1, 1, 0]; } st.rot = k; }
  if (has("fallen")) { st.fallen = k; st.flw = [0.35, 0.35, 0.35, 0.35]; }
  if (has("bushy")) st.bushy = k;
  if (has("wet")) st.wet = 0.2 + 0.7 * k;
  if (has("heat")) { st.heat = k; st.sun = -0.4 + 0.8 * k; st.temp = 26 + 12 * k; }
  if (has("shade")) st.shade = k;
  if (has("rain")) st.rain = k;
  if (has("roots")) st.roots = 0.15 + 0.85 * g;
  if (has("mulch")) st.mulch = Math.max(st.mulch, k);
  if (has("shell")) st.shell = k;
  if (has("glow") || has("feed")) { st.feed = k * (1 - e(t, row.b - 0.6, row.b)); st.glow = k; }
  if (has("pollen")) { st.pollen = k; st.shake = 0.4 * k; }
  if (has("shake")) st.shake = k;
  if (has("ties")) st.ties = g;
  if (has("sucker")) { st.sucker = 1; st.suckerHi = k; }
  if (has("bucket")) st.bucketGlow = k;
  if (MODE !== "tomate") { st.fruit = [0, 0, 0, 0]; st.ripe = [0, 0, 0, 0]; }
  return st;
};
const World: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => {
  const v0 = CAM.camSpeed(t), bx = Math.min(6, v0.bx * 0.5), by = Math.min(4, v0.by * 0.5), id = "mb" + Math.round(t * 30);
  const filt = [bx + by > 0.6 ? `url(#${id})` : "", dim > 0 ? `brightness(${1 - dim})` : ""].join(" ").trim();
  return <AbsoluteFill>
    <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
    <AbsoluteFill style={{ filter: filt || undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>
  </AbsoluteFill>;
};

// ---------------- la toma real: el clip de agnes desde su 1er cuadro y, si la toma dura más, funde a su foto (mismo encuadre) ----------------
const Shot: React.FC<{ r: Row; t: number; i: number }> = ({ r, t, i }) => {
  const k = r.k!, q = e(t, r.a, r.b + 0.5), zin = i % 3 !== 2, sc = zin ? 1.03 + 0.09 * q : 1.12 - 0.08 * q, ox = (i % 2 ? 1 : -1) * 24 * q;
  const cl = AV.clips[k];
  const img = IMGS.has(k) ? <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <AbsoluteFill style={{ background: "#2a2a22" }} />;
  return <CamaraMano seed={2}><AbsoluteFill style={{ transform: `scale(${sc}) translateX(${ox}px)` }}>
    {img}
    {cl && t < r.a + cl && <AbsoluteFill style={{ opacity: 1 - e(t, r.a + cl - 0.45, r.a + cl - 0.05) }}>
      <Sequence from={s(r.a)} layout="none"><OffthreadVideo src={staticFile(P + "c_" + k + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
    </AbsoluteFill>}
  </AbsoluteFill></CamaraMano>;
};
const base = (t: number): React.ReactNode => {
  const i = B.rows.findIndex((r) => t >= r.a && t < r.b);
  const j = i >= 0 ? i : B.rows.findIndex((r) => t < r.b) >= 0 ? Math.max(0, B.rows.findIndex((r) => t < r.b) - (t < B.rows[0].a ? 0 : 1)) : B.rows.length - 1;
  const one = (n: number) => { const r = B.rows[n]; return r.base === "w" ? <World t={t} /> : <Shot r={r} t={t} i={n} />; };
  if (i > 0 && Math.abs(B.rows[i - 1].b - B.rows[i].a) < 0.05 && t < B.rows[i].a + 0.32) {
    // corte entre tomas pegadas = barrido corto (con desenfoque) desde la anterior
    const k = ei(t, B.rows[i].a, B.rows[i].a + 0.32), dir = i % 2 ? 1 : -1, mb = Math.sin(k * Math.PI) * 30;
    if (B.rows[i - 1].base === "w" && B.rows[i].base === "w") return one(i); // mundo → mundo: la cámara vuela, sin barrido
    return <>
      <AbsoluteFill style={{ transform: `translateX(${-dir * k * 1920}px)`, filter: `blur(${mb}px)` }}>{one(i - 1)}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dir * (1 - k) * 1920}px)`, filter: `blur(${mb}px)` }}>{one(i)}</AbsoluteFill>
    </>;
  }
  return one(j);
};
// el avatar entra por un portal desde el centro y sale por el mismo lugar (cero cortes secos)
const Stage: React.FC<{ t: number }> = ({ t }) => {
  const w = WIN.find((x) => t >= x.ms - 0.32 && t < x.me + 0.42);
  if (!w) return <>{base(t)}</>;
  if (t < w.ms) return <>{base(t)}<Portal x={960} y={520} r={ei(t, w.ms - 0.32, w.ms)}><Avatar t={t} /></Portal></>;
  if (t < w.me) return <Avatar t={t} />;
  return <><Avatar t={t} /><Portal x={960} y={520} r={ei(t, w.me, w.me + 0.42)}>{base(t)}</Portal></>;
};

// ---------------- piezas ----------------
const op = (t: number, at: number, out: number) => e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
const Chip: React.FC<{ t: number; at: number; out: number; text: string; col?: string; x?: number; y?: number }> = ({ t, at, out, text, col = "#b9f08a", x = 90, y = 90 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${Math.min(1.08, spr(t, at))})`, transformOrigin: "0 0", padding: "14px 30px", borderRadius: 40, background: "rgba(12,20,10,.9)", border: `3px solid ${col}`, fontFamily: FONT, fontWeight: 900, fontSize: text.length > 34 ? 36 : 44, color: col, boxShadow: "0 20px 40px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>;
};
const Stamp: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at, out, text }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25)); if (o <= 0.01) return null;
  const size = text.length > 26 ? 60 : text.length > 16 ? 76 : 96;
  return <div style={{ position: "absolute", left: 960, top: 230, opacity: o, transform: `translate(-50%,-50%) rotate(-6deg) scale(${2.2 - 1.2 * Math.min(1, k)})` }}>
    <div style={{ border: `9px solid ${COL.red}`, borderRadius: 14, padding: "6px 28px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: COL.red, letterSpacing: 3, background: "rgba(20,0,0,.3)", boxShadow: `0 0 30px ${COL.red}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
  </div>;
};
const QR: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9));
  return <div style={{ position: "absolute", left: 1530, top: 560, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateY(${(1 - k) * -50 - 8}deg) scale(${0.8 + 0.2 * k})`, background: "#fff", borderRadius: 24, padding: 22, width: 400, textAlign: "center", fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
    <Img src={staticFile(P + "qr.png")} style={{ width: 356, height: 356, imageRendering: "pixelated", display: "block" }} />
    <div style={{ fontWeight: 900, fontSize: 30, color: "#1a1006", marginTop: 10 }}>📷 ESCANEA CON LA CÁMARA</div>
    <div style={{ fontWeight: 800, fontSize: 22, color: "#5a4a36", marginTop: 6, lineHeight: 1.25 }}>El link está en la primera línea de la descripción</div>
  </div>;
};
// la página REAL del libro: entra girando, se acerca al título y lo subraya; al lado el QR
const Page: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  const v = op(t, o.at, o.out); if (v <= 0.01) return null;
  const k = Math.min(1.08, spr(t, o.at, 0.7)), zoom = ei(t, o.at + 0.8, o.at + 3.5), mark = e(t, o.at + 1.4, o.at + 2.2);
  return <AbsoluteFill style={{ opacity: v, perspective: 1800 }}>
    <AbsoluteFill style={{ background: "rgba(6,8,4,.55)" }} />
    <div style={{ position: "absolute", left: 640 - 330, top: 70, width: 660, transformOrigin: "50% 10%", transform: `rotateY(${(1 - Math.min(1, k)) * -80 + 6}deg) rotateX(${6 - 6 * zoom}deg) scale(${1 + 0.3 * zoom}) translateY(${90 * zoom}px)` }}>
      <Img src={staticFile(P + o.img + ".png")} style={{ width: 660, borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.7)" }} />
      <div style={{ position: "absolute", left: 100, top: 72, height: 66, width: 500 * mark, background: "rgba(255,214,10,.38)", mixBlendMode: "multiply", borderRadius: 6 }} />
    </div>
    <div style={{ position: "absolute", right: 70, top: 80, width: 680, textAlign: "right", fontFamily: FONT, opacity: e(t, o.at + 0.5, o.at + 0.8) }}>
      <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 4, textShadow: "0 3px 10px #000" }}>LIBRO {o.libro} · PÁGINA {o.n}</div>
      <div style={{ fontWeight: 900, fontSize: 50, color: "#fff", letterSpacing: 2, lineHeight: 1.1, textShadow: extrude(5, "rgba(0,0,0,.7)") }}>{o.hl}</div>
    </div>
    <QR t={t} at={o.at + 1.2} out={o.out} />
  </AbsoluteFill>;
};
// la descripción del video: el renglón 1 se ilumina (en pantalla NUNCA la URL) + el QR
const Desc: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = spr(t, at, 0.8), o = op(t, at, out); if (o <= 0.01) return null;
  const hl = e(t, at + 0.4, at + 0.9), sweep = e(t, at + 0.4, at + 1.4);
  const L = (w: number, a = 0.25) => <div style={{ height: 16, width: w, borderRadius: 8, background: `rgba(255,255,255,${a})`, margin: "18px 0 0" }} />;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "rgba(6,8,4,.45)" }} />
    <div style={{ position: "absolute", left: 640, top: 560, perspective: 1500 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -500}px) rotateX(${12 - 7 * Math.min(1, k)}deg) rotateY(${8 + 3 * Math.sin(t * 0.8)}deg)`, width: 1000, padding: "34px 44px 40px", borderRadius: 26, background: "linear-gradient(180deg, rgba(28,30,34,.96), rgba(16,17,20,.96))", boxShadow: "0 70px 120px rgba(0,0,0,.7)", fontFamily: FONT }}>
        <div style={{ color: "rgba(255,255,255,.55)", fontWeight: 800, fontSize: 24, letterSpacing: 4 }}>DESCRIPCIÓN</div>
        <div style={{ position: "relative", marginTop: 16, padding: "16px 20px", borderRadius: 14, background: `rgba(255,214,10,${0.18 * hl})`, boxShadow: hl > 0.05 ? `0 0 0 3px rgba(255,214,10,${0.9 * hl})` : undefined, overflow: "hidden" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 32, lineHeight: 1.3, whiteSpace: "nowrap" }}>🌱 La Colección del Huerto de Claudio · 5 libros</div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${-30 + 130 * sweep}%`, width: "25%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", opacity: sweep < 1 ? 1 : 0 }} />
        </div>
        {L(820)}{L(620)}{L(760, 0.15)}
      </div>
      <div style={{ position: "absolute", left: -480, top: -290, opacity: hl, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#ffd60a", textShadow: extrude(6, "#5a4500"), whiteSpace: "nowrap" }}>1ª LÍNEA DE LA DESCRIPCIÓN ⬇</div>
    </div>
    <QR t={t} at={at + 0.8} out={out} />
  </AbsoluteFill>;
};
// las 5 tapas en abanico; la del libro del video se adelanta
const Fan: React.FC<{ t: number; at: number; out: number; lift: number }> = ({ t, at, out, lift }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const up = ei(t, lift, lift + 0.7);
  return <AbsoluteFill style={{ opacity: o, perspective: 1600 }}>
    <AbsoluteFill style={{ background: "rgba(6,8,4,.5)" }} />
    {[1, 2, 3, 4, 5].map((n, i) => {
      const k = Math.min(1.1, spr(t, at + i * 0.12, 0.8)), ang = (i - 2) * 13 * Math.min(1, k), me = n === B.libro;
      const dy = me ? -70 * up : 40 * up, sc = me ? 1 + 0.18 * up : 1 - 0.08 * up;
      return <Img key={n} src={staticFile(P + `portada_l${n}.png`)} style={{ position: "absolute", left: 960 - 190, top: 390, width: 380, borderRadius: 10, transformOrigin: "50% 160%", transform: `rotate(${ang}deg) translateY(${(1 - Math.min(1, k)) * 400 + dy}px) scale(${sc})`, zIndex: me ? 10 : i, boxShadow: "0 40px 80px rgba(0,0,0,.6)", filter: me || up < 0.05 ? undefined : `brightness(${1 - 0.35 * up})` }} />;
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", letterSpacing: 4, textShadow: extrude(6, "rgba(0,0,0,.7)"), opacity: e(t, at + 0.4, at + 0.7) }}>LA COLECCIÓN DEL HUERTO DE CLAUDIO</div>
  </AbsoluteFill>;
};
// lo de la tienda tachado contra lo que cuesta en casa
const Save: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  const v = op(t, o.at, o.out); if (v <= 0.01) return null;
  const k1 = Math.min(1, spr(t, o.at, 0.9)), x = e(t, o.at + 0.9, o.at + 1.3), k2 = Math.min(1, spr(t, o.at + 1.5, 0.9));
  return <AbsoluteFill style={{ opacity: v, fontFamily: FONT }}>
    <AbsoluteFill style={{ background: "rgba(6,8,4,.5)" }} />
    <div style={{ position: "absolute", left: 960, top: 360, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k1})`, textAlign: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: COL.dim, letterSpacing: 4 }}>EN LA TIENDA</div>
      <div style={{ position: "relative", fontSize: o.txt.length > 12 ? 92 : 120, whiteSpace: "nowrap", fontWeight: 900, color: COL.red, textShadow: extrude(10, "#4a0a00") }}>{o.txt}
        <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 14, background: "#fff", transformOrigin: "0 50%", transform: `rotate(-4deg) scaleX(${x})`, boxShadow: "0 4px 10px rgba(0,0,0,.6)" }} /></div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 700, opacity: k2, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k2})`, textAlign: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: COL.dim, letterSpacing: 4 }}>EN TU CASA</div>
      <div style={{ fontSize: (o.sub || "").length > 10 ? 112 : 150, whiteSpace: "nowrap", fontWeight: 900, color: "#7dffb4", textShadow: extrude(12, "#0a3a1a") }}>{o.sub}</div>
    </div>
  </AbsoluteFill>;
};
const Subscribe: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.1, spr(t, at, 0.9)), click = e(t, at + 0.85, at + 1.0), done = t > at + 1.0;
  const cx = 1180 - 200 * e(t, at + 0.3, at + 0.85), cy = 700 - 120 * e(t, at + 0.3, at + 0.85);
  return <AbsoluteFill>
    <div style={{ position: "absolute", left: 960, top: 560, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * Math.min(1, k)})`, display: "flex", gap: 26, alignItems: "center", fontFamily: FONT }}>
      <div style={{ padding: "26px 60px", borderRadius: 60, background: done ? "#3a3a3a" : "#e62117", color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: 3, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(250,248,242,.96)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>🔔</div>
    </div>
    <div style={{ position: "absolute", left: cx, top: cy, opacity: o, fontSize: 80, transform: `scale(${1 - 0.15 * click})` }}>👆</div>
  </AbsoluteFill>;
};
const Ask: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  const v = op(t, o.at, o.out); if (v <= 0.01) return null;
  const k = Math.min(1, spr(t, o.at, 0.9));
  return <div style={{ position: "absolute", left: 960, top: 300, opacity: v, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, background: "rgba(18,20,24,.95)", borderRadius: 26, padding: "26px 40px", width: 1180, fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
    <div style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 28, letterSpacing: 3 }}>💬 CUÉNTAME EN LOS COMENTARIOS</div>
    <div style={{ color: "#fff", fontWeight: 900, fontSize: 52, marginTop: 10, lineHeight: 1.15 }}>{o.txt}</div>
    {o.sub && <div style={{ color: "#b9f08a", fontWeight: 800, fontSize: 38, marginTop: 8 }}>{o.sub}</div>}
  </div>;
};
const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 0.8) return null;
  switch (o.k) {
    case "chip": return <Chip t={t} at={o.at} out={o.out} text={o.txt} />;
    case "tag": return <Chip t={t} at={o.at} out={o.out} text={o.txt} col="#ffd84a" x={90} y={900} />;
    case "lt": return <LowerThird t={t} at={o.at} out={o.out} name="CLAUDIO" l2={o.txt} l2at={o.at + 0.8} />;
    case "big": return <BigNum t={t} at={o.at} out={o.out} text={o.txt} sub={o.sub || undefined} x={1350} y={470} size={o.txt.length > 12 ? 110 : o.txt.length > 7 ? 150 : 210} col="#ffd84a" edge="#5a4500" />;
    case "stamp": return <Stamp t={t} at={o.at} out={o.out} text={o.txt} />;
    case "step": return <StepTitle t={t} at={o.at} out={o.out} n={o.n} name={o.txt} col="#b9f08a" />;
    case "mistake": return <Mistake t={t} at={o.at} out={o.out} n={o.n} txt={o.txt} />;
    case "check": return <CheckList t={t} title={o.title} rows={o.rows} out={o.out} />;
    case "save": return <Save t={t} o={o} />;
    case "fan": return <Fan t={t} at={o.at} out={o.out} lift={o.lift} />;
    case "page": return <Page t={t} o={o} />;
    case "desc": return <Desc t={t} at={o.at} out={o.out} />;
    case "ask": return <Ask t={t} o={o} />;
    case "sub": return <Subscribe t={t} at={o.at} out={o.out} />;
    case "next": return <NextCard t={t} at={o.at} subAt={o.at + 1.6} out={o.out}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#b9f08a", textShadow: extrude(6, "#14350f") }}>{o.txt}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.ink }}>{o.sub}</div></NextCard>;
  }
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#0b0d08" }}>
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    {B.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
export { PT };
