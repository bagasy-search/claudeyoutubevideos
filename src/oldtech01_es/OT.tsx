// oldtech01 · "The Roman Heating System That Kept Houses at 22°C Through Alpine Winters" — Old Tech Lab.
// Motor documental fotorrealista (el del c23 v2 aprobado): cada plano = foto/clip con su propia cámara, transiciones que
// pasan A TRAVÉS de la imagen (zoom / barrido / salida hacia atrás / corte). Gráficos puntuales de tinta blanca fina,
// un acento cálido (brasa). Sin subtítulos corridos, sin SFX: la voz manda.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { SHOTS, OVL, Shot, Ovl } from "./otdata";

const { fontFamily: SANS } = loadFont("normal", { weights: ["500", "700", "800"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["500", "700"] });
const FPS = 30, W = 1920, H = 1080;
const EMBER = "#F0A04B";
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const pop = (f: number, t0: number, d = 14) => spring({ frame: f - t0 * FPS, fps: FPS, config: { damping: d, stiffness: 160, mass: 0.7 } });
const shadow = "0 2px 14px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.8)";

type X = { z: number; fx: number; fy: number; dx: number; dy: number; op: number; bx: number; by: number };
const dOf = (s?: Shot) => (s && s.out.type !== "cut" ? s.out.d : 0);
function xform(s: Shot, i: number, t: number): X | null {
  const prev = SHOTS[i - 1], next = SHOTS[i + 1];
  const dIn = dOf(prev), dOut = next ? dOf(s) : 0;
  if (t < s.t0 - dIn / 2 - 0.02 || t >= s.t1 + dOut / 2 + (dOut ? 0.02 : 0)) return null;
  const k = ease(k01(t, s.t0, s.t1));
  let z = Math.exp(lerp(Math.log(s.kb[0]), Math.log(s.kb[3]), k));
  let fx = lerp(s.kb[1], s.kb[4], k), fy = lerp(s.kb[2], s.kb[5], k);
  let dx = 0, dy = 0, op = 1, bx = 0, by = 0;
  if (next && dOut && t > s.t1 - dOut / 2) {
    const e = k01(t, s.t1 - dOut / 2, s.t1 + dOut / 2), o = s.out;
    if (o.type === "zoom") {
      z *= 1 + 3.2 * Math.pow(e, 2.4);
      fx = lerp(fx, o.fx ?? fx, ease(Math.min(1, e * 1.6))); fy = lerp(fy, o.fy ?? fy, ease(Math.min(1, e * 1.6)));
      const b = 22 * Math.pow(e, 1.5); bx = b; by = b; op = 1 - k01(e, 0.45, 0.85);
    } else if (o.type === "pull") {
      z *= 1 - 0.18 * Math.pow(e, 2); const b = 14 * e * e; bx = b; by = b; op = 1 - k01(e, 0.4, 0.8);
    } else if (o.type === "whip") {
      const p = Math.pow(e, 2.2); dx = -(o.vx ?? 0) * W * 1.1 * p; dy = -(o.vy ?? 0) * H * 1.1 * p;
      bx = Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e); by = Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e);
    } else if (o.type === "fade") { op = 1; }
  }
  if (prev && dIn && t < s.t0 + dIn / 2) {
    const e = k01(t, s.t0 - dIn / 2, s.t0 + dIn / 2), o = prev.out;
    if (o.type === "zoom") { z *= 1 + 0.5 * Math.pow(1 - e, 2); const b = 18 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.35, 0.75); }
    else if (o.type === "fade") { op = ease(k01(e, 0, 1)); }
    else if (o.type === "pull") { z *= 1 + 0.9 * Math.pow(1 - e, 2.2); const b = 16 * Math.pow(1 - e, 2); bx = Math.max(bx, b); by = Math.max(by, b); op = k01(e, 0.05, 0.5); }
    else if (o.type === "whip") { const p = Math.pow(1 - e, 2.2); dx += (o.vx ?? 0) * W * 1.1 * p; dy += (o.vy ?? 0) * H * 1.1 * p; bx = Math.max(bx, Math.abs(o.vx ?? 0) * 60 * Math.sin(Math.PI * e)); by = Math.max(by, Math.abs(o.vy ?? 0) * 60 * Math.sin(Math.PI * e)); }
    // fade: la entrante queda debajo, opaca
  }
  z = Math.max(1, z);
  const hx = 0.5 / z, hy = 0.5 / z;
  fx = Math.min(1 - hx, Math.max(hx, fx)); fy = Math.min(1 - hy, Math.max(hy, fy));
  return { z, fx, fy, dx, dy, op, bx, by };
}

const ShotLayer: React.FC<{ s: Shot; i: number; t: number }> = ({ s, i, t }) => {
  const x = xform(s, i, t);
  if (!x) return null;
  const id = `b${i}`;
  return (
    <AbsoluteFill style={{ opacity: x.op, zIndex: i }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${x.bx.toFixed(2)} ${x.by.toFixed(2)}`} /></filter></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", filter: x.bx + x.by > 0.4 ? `url(#${id})` : undefined,
        transform: `translate(${W / 2 + x.dx}px,${H / 2 + x.dy}px) scale(${x.z}) translate(${-x.fx * W}px,${-x.fy * H}px)` }}>
        {s.vid ? (
          <Sequence from={Math.round((s.t0 - dOf(SHOTS[i - 1]) / 2 - 0.05) * FPS)} layout="none">
            <OffthreadVideo src={staticFile(`oldtech01_es/${s.vid}.mp4`)} playbackRate={s.rate ?? 1} muted style={{ width: W, height: H, objectFit: "cover" }} />
          </Sequence>
        ) : (
          <Img src={staticFile(`oldtech01_es/${s.img}.jpg`)} style={{ width: W, height: H, objectFit: "cover" }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

// crédito de las fotos reales (Commons), chiquito abajo a la derecha
const Credit: React.FC<{ t: number }> = ({ t }) => {
  const s = SHOTS.find((q) => q.credit && t >= q.t0 && t < q.t1);
  if (!s) return null;
  const a = interpolate(t, [s.t0, s.t0 + 0.3, s.t1 - 0.3, s.t1], [0, 0.85, 0.85, 0], clamp);
  return <div style={{ position: "absolute", right: 40, bottom: 30, opacity: a, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: "#fff", textShadow: shadow }}>{s.credit}</div>;
};

const Chapter: React.FC<{ o: Ovl; t: number; f: number }> = ({ o, t, f }) => {
  const a = interpolate(t, [o.t0, o.t0 + 0.35, o.t1 - 0.4, o.t1], [0, 1, 1, 0], clamp);
  const line = ease(k01(t, o.t0 + 0.15, o.t0 + 0.9));
  return (
    <div style={{ position: "absolute", left: 120, top: 400, opacity: a, color: "#fff", textShadow: shadow }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: EMBER }}>{o.kicker}</div>
      <div style={{ width: 520 * line, height: 2, background: "#fff", margin: "14px 0 18px", boxShadow: shadow }} />
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 78, lineHeight: 1.05, maxWidth: 1100, transform: `translateY(${(1 - pop(f, o.t0 + 0.1)) * 18}px)` }}>{o.big}</div>
    </div>
  );
};
const Num: React.FC<{ o: Ovl; t: number; f: number }> = ({ o, t, f }) => {
  const a = interpolate(t, [o.t0, o.t0 + 0.2, o.t1 - 0.25, o.t1], [0, 1, 1, 0], clamp);
  const right = o.pos === "r";
  return (
    <div style={{ position: "absolute", [right ? "right" : "left"]: 120, bottom: 150, textAlign: right ? "right" : "left", opacity: a, color: "#fff", textShadow: shadow, transform: `scale(${0.9 + 0.1 * pop(f, o.t0)})`, transformOrigin: right ? "right bottom" : "left bottom" }}>
      {o.kicker && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, opacity: 0.95 }}>{o.kicker}</div>}
      {o.big && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: -2, color: o.hot ? EMBER : "#fff", margin: "4px 0" }}>{o.big}</div>}
      {o.sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 40 }}>{o.sub}</div>}
    </div>
  );
};
const Place: React.FC<{ o: Ovl; t: number }> = ({ o, t }) => {
  const a = interpolate(t, [o.t0, o.t0 + 0.3, o.t1 - 0.3, o.t1], [0, 1, 1, 0], clamp);
  const w = ease(k01(t, o.t0, o.t0 + 0.5));
  return (
    <div style={{ position: "absolute", left: 120, top: 110, opacity: a, color: "#fff", textShadow: shadow, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, border: "2.5px solid #fff", boxShadow: shadow }} />
      <div style={{ width: 70 * w, height: 2, background: "#fff" }} />
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6 }}>{o.big}</div>
        {o.sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 28, opacity: 0.95 }}>{o.sub}</div>}
      </div>
    </div>
  );
};
const Quote: React.FC<{ o: Ovl; t: number }> = ({ o, t }) => {
  const a = interpolate(t, [o.t0, o.t0 + 0.4, o.t1 - 0.4, o.t1], [0, 1, 1, 0], clamp);
  const words = (o.big ?? "").split(" ");
  const shown = Math.ceil(words.length * k01(t, o.t0 + 0.2, Math.min(o.t1 - 0.6, o.t0 + 0.2 + words.length * 0.11)));
  return (
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 150, opacity: a, color: "#fff", textShadow: shadow }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 54, lineHeight: 1.2, maxWidth: 1300 }}>
        <span style={{ color: EMBER }}>“</span>{words.map((w, n) => <span key={n} style={{ opacity: n < shown ? 1 : 0 }}>{w} </span>)}<span style={{ color: EMBER, opacity: shown >= words.length ? 1 : 0 }}>”</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 6, marginTop: 16 }}>— {o.kicker}</div>
    </div>
  );
};
const Word: React.FC<{ o: Ovl; t: number }> = ({ o, t }) => {
  const a = interpolate(t, [o.t0, o.t0 + 0.12, o.t1 - 0.12, o.t1], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: 120, top: 860, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 68, letterSpacing: 1, color: "#fff", textShadow: shadow }}>{o.big}<span style={{ color: EMBER }}>.</span></div>;
};

export const OT: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#0b0a09", overflow: "hidden" }}>
      {!farm && <Audio src={staticFile("oldtech01_es.wav")} />}
      {SHOTS.map((s, i) => <ShotLayer key={s.id + i} s={s} i={i} t={t} />)}
      <AbsoluteFill style={{ zIndex: 999, background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,.30) 100%)" }} />
      <AbsoluteFill style={{ zIndex: 1000 }}>
        {OVL.filter((o) => t >= o.t0 - 0.02 && t <= o.t1 + 0.02).map((o, n) =>
          o.k === "ch" ? <Chapter key={n} o={o} t={t} f={f} /> :
          o.k === "num" ? <Num key={n} o={o} t={t} f={f} /> :
          o.k === "place" ? <Place key={n} o={o} t={t} /> :
          o.k === "q" ? <Quote key={n} o={o} t={t} /> : <Word key={n} o={o} t={t} />)}
        <Credit t={t} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
