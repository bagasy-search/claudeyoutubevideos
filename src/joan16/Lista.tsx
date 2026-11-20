// joan16 (Joan Behind the Camera, serie "Over 60? Stop…") — piezas para listas de 9 errores sobre clips Veo.
// Reusa el look camarín de TV de joan01 (src/joan/Piezas*). Nuevo: apertura de capítulo sobre video, recap 9 en grilla, reloj de rutina.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FONTS, hash } from "../joan/Piezas";
import { InkWipe } from "../joan/Piezas2";

const { SERIF, SANS } = FONTS;
const shadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)";
const AMBER = "#F2C08A";
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export type Card = { title: string; src: string };

// fondo de video o foto (desenfocado opcional)
export const Bg: React.FC<{ src: string; blur?: number; dark?: number; z?: number }> = ({ src, blur = 0, dark = 0, z = 1 }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) brightness(${1 - dark})`, transform: `scale(${z * (blur ? 1.12 : 1)})` };
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      {src.endsWith(".mp4") ? <OffthreadVideo src={staticFile(src)} muted playbackRate={0.7} style={st} /> : <Img src={staticFile(src)} style={st} />}
    </AbsoluteFill>
  );
};

// apertura de capítulo: el clip del error corre detrás, número dibujado y el error tachado en rojo
export const ChapterOpen: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const right = n % 2 === 0;
  const o = 1;
  const k = cl(f / dur, 0, 1);
  const z = lerp(1.18, 1.04, Easing.out(Easing.cubic)(k));
  const draw = interpolate(f, [4, 22], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const fill = interpolate(f, [12, 24], [0, 1], CL);
  const strike = interpolate(f, [Math.min(dur - 14, 52), Math.min(dur - 4, 66)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const words = title.split(" ");
  const side: React.CSSProperties = right ? { right: 110, alignItems: "flex-end" } : { left: 110, alignItems: "flex-start" };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: o }}>
        <Bg src={src} z={z} />
        <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(16,11,8,0.86) 0%, rgba(16,11,8,0.45) 48%, rgba(16,11,8,0) 72%)` }} />
        <div style={{ position: "absolute", top: 210, width: 900, display: "flex", flexDirection: "column", ...side }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 10, color: AMBER, opacity: draw }}>MISTAKE · {n} OF {total}</div>
          <svg width="560" height="300" viewBox="0 0 560 300" style={{ overflow: "visible" }}>
            <text x={right ? 560 : 0} y="262" textAnchor={right ? "end" : "start"} fontFamily={SANS} fontWeight={700} fontSize="280" style={{ fontVariantNumeric: "lining-nums tabular-nums", fontFeatureSettings: '"lnum" 1, "tnum" 1' }}
              fill={`rgba(255,253,248,${fill})`} stroke={C.white} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)}>{String(n).padStart(2, "0")}</text>
          </svg>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", columnGap: 22, justifyContent: right ? "flex-end" : "flex-start", marginTop: 10, maxWidth: 900, background: `rgba(16,11,8,${0.9 * fill})`, padding: "18px 30px 22px", borderRadius: 10, boxShadow: `0 18px 40px rgba(0,0,0,${0.45 * fill})` }}>
            {words.map((w, i) => {
              const p = spring({ frame: f - 14 - i, fps: 30, config: { damping: 15, mass: 0.6 } });
              return <span key={i} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 86, lineHeight: 1.08, color: C.white, textShadow: shadow, display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{w}</span>;
            })}
          </div>
          <div style={{ alignSelf: right ? "flex-end" : "flex-start", marginTop: 26, padding: "8px 22px", border: `6px solid ${C.ver}`, borderRadius: 8, color: C.ver, background: "rgba(255,253,248,0.94)", fontFamily: SANS, fontWeight: 700, fontSize: 44, letterSpacing: 6,
              opacity: cl(strike * 3, 0, 1), transform: `rotate(-9deg) scale(${interpolate(strike, [0, 1], [2.4, 1])})`, boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}>AVOID</div>
        </div>
      </AbsoluteFill>
      <InkWipe dir={(n - 1) % 4} len={18} />
    </AbsoluteFill>
  );
};

// tarjeta con foto (fotograma del clip) para carrusel / recap / CTA
export const PhotoCard: React.FC<{ n: number; title: string; src: string; w: number; dim?: number; check?: number }> = ({ n, title, src, w, dim = 0, check = 0 }) => (
  <div style={{ width: w, background: C.paper, padding: w * 0.035, paddingBottom: w * 0.03, boxShadow: "0 22px 50px rgba(0,0,0,0.45)", borderRadius: 4, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.56, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.03, marginTop: w * 0.03, minHeight: w * 0.22 }}>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.06, color: C.ver, letterSpacing: 2 }}>{String(n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: w * 0.08, color: C.ink, lineHeight: 1.05, opacity: 1 - dim * 0.5 }}>{title}</span>
    </div>
    {check > 0 && (
      <div style={{ position: "absolute", right: -w * 0.05, top: -w * 0.05, width: w * 0.2, height: w * 0.2, borderRadius: "50%", background: C.ver, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${interpolate(check, [0, 1], [2.2, 1])}) rotate(-8deg)`, opacity: cl(check * 2, 0, 1), boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: w * 0.12, color: C.white, lineHeight: 1 }}>✓</span>
      </div>
    )}
  </div>
);

// recap de 9 en grilla 5 + 4: cada tarjeta se enciende y se tilda cuando Joan la nombra
export const Recap9: React.FC<{ items: { f: number }[]; cards: Card[]; bg: string; head: string; dur: number }> = ({ items, cards, bg, head, dur }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f, fps: 30, config: { damping: 20 } });
  const W = 330;
  const ctr = (i: number) => { const row = i < 5 ? 0 : 1, col = row ? i - 5 : i, n = row ? 4 : 5; const x0 = (1920 - (n * W + (n - 1) * 40)) / 2; return [x0 + col * (W + 40) + W / 2, 170 + row * 430 + W * 0.45]; };
  const lastF = Math.max(...items.map((x) => x.f).filter((x) => x < dur), 0);
  let cur = -1; items.forEach((it, i) => { if (f >= it.f) cur = i; });
  const ease = { fps: 30, config: { damping: 26, mass: 1.4 } };
  let cx = 960, cy = 540, sc = 1;
  if (cur >= 0) {
    const t = spring({ frame: f - items[cur].f, ...ease });
    const [px, py] = cur > 0 ? ctr(cur - 1) : [960, 540]; const [qx, qy] = ctr(cur);
    cx = lerp(px, qx, t); cy = lerp(py, qy, t); sc = cur > 0 ? 1.32 : lerp(1, 1.32, t);
    const back = spring({ frame: f - (lastF + 75), ...ease });
    if (f > lastF + 75) { cx = lerp(cx, 960, back); cy = lerp(cy, 540, back); sc = lerp(sc, 1.04, back); }
  }
  cx += Math.sin(f / 70) * 10; cy += Math.cos(f / 85) * 7;
  const tx = 960 - cx * sc, ty = 540 - cy * sc;
  return (
    <AbsoluteFill>
      <Bg src={bg} blur={22} dark={0.5} z={1 + 0.06 * Math.sin(f / 120)} />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "0 0" }}>
      {cards.map((c, i) => {
        const row = i < 5 ? 0 : 1, col = row ? i - 5 : i, n = row ? 4 : 5;
        const x0 = (1920 - (n * W + (n - 1) * 40)) / 2;
        const it = items[i] || { f: 99999 };
        const e = spring({ frame: f - i * 3, fps: 30, config: { damping: 16 } });
        const ck = spring({ frame: f - it.f, fps: 30, config: { damping: 11, mass: 0.6 } });
        const lit = f >= it.f;
        const pop = lit ? 1 + 0.08 * Math.max(0, 1 - (f - it.f) / 10) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + col * (W + 40), top: 170 + row * 430, opacity: e, transform: `translateY(${(1 - e) * 60}px) rotate(${((hash(i + 40) % 7) - 3) * 0.8}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
            <PhotoCard n={i + 1} title={c.title} src={c.src} w={W} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
          </div>
        );
      })}
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 0, paddingTop: 34, paddingBottom: 40, background: "linear-gradient(180deg, rgba(16,11,8,0.85), rgba(16,11,8,0))", width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: C.white, textShadow: shadow, opacity: p }}>
        <span style={{ color: AMBER }}>{cards.length}</span> {head}
      </div>
    </AbsoluteFill>
  );
};

// reloj de rutina: la aguja corre las horas que dura (12 h del labial, 4 min de Vivian) sobre el clip de fondo
export const Reloj: React.FC<{ label: string; sub: string; unit: "h" | "min"; amount: number; bg: string; dur: number }> = ({ label, sub, unit, amount, bg, dur }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const o = 1;
  const run = interpolate(f, [12, dur - 16], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const ang = Math.min(359.4, run * 360 * (unit === "h" ? 1 : amount / 60));
  const shown = Math.round(run * amount);
  const R = 290;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg src={bg} blur={14} dark={0.45} />
      <div style={{ position: "absolute", left: 150, top: 540 - R - 30, width: R * 2 + 60, height: R * 2 + 60, transform: `scale(${0.8 + 0.2 * p})`, opacity: p }}>
        <svg width={R * 2 + 60} height={R * 2 + 60} viewBox={`${-R - 30} ${-R - 30} ${R * 2 + 60} ${R * 2 + 60}`}>
          <circle r={R + 18} fill={C.paper} stroke="#3a2f28" strokeWidth={10} />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.sin(a) * (R - 10)} y1={-Math.cos(a) * (R - 10)} x2={Math.sin(a) * (R - 40)} y2={-Math.cos(a) * (R - 40)} stroke={C.ink} strokeWidth={i % 3 ? 4 : 9} strokeLinecap="round" />; })}
          <path d={`M0 0 L0 ${-R + 4} A ${R - 4} ${R - 4} 0 ${ang > 180 ? 1 : 0} 1 ${Math.sin((ang * Math.PI) / 180) * (R - 4)} ${-Math.cos((ang * Math.PI) / 180) * (R - 4)} Z`} fill={C.ver} opacity={0.28} />
          <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * (R - 50)} y2={-Math.cos((ang * Math.PI) / 180) * (R - 50)} stroke={C.ver} strokeWidth={10} strokeLinecap="round" />
          <circle r={14} fill={C.ink} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 860, top: 250, width: 1000 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 6, color: AMBER, textShadow: shadow, opacity: p }}>{sub}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 128, color: C.white, textShadow: shadow, lineHeight: 1.02, opacity: p }}>{label}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 200, color: AMBER, textShadow: shadow, marginTop: 10 }}>{shown}<span style={{ fontSize: 90 }}> {unit === "h" ? "hours" : "minutes"}</span></div>
      </div>
    </AbsoluteFill>
  );
};

// foto Nano Banana: Ken Burns + scale(1.11) anclado a la izquierda (tapa la estrellita de marca de agua abajo a la derecha)
export const NBPhoto: React.FC<{ src: string; seed: number; dur: number }> = ({ src, seed, dur }) => {
  const f = useCurrentFrame();
  const t = Easing.inOut(Easing.sin)(cl(f / Math.max(1, dur), 0, 1));
  const out = hash(seed) % 2 === 1;
  const z = 1.11 * (1 + 0.06 * (out ? 1 - t : t));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateY(${(t - 0.5) * -1.2}%)`, transformOrigin: "0% 45%" }} />
    </AbsoluteFill>
  );
};
