import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, SERIF, SANS, ramp, lerp, ease } from "./theme";
import plan from "./plan.json";
import { FlatMap, GondwanaGlobe, DeepTimeline, ZirconChart, UPbClock, CrustSection, LengthCompare, Unconformity, Strontium, Chain } from "./gfx";

type Shot = { f0: number; f1: number; t: string; src?: string; kb?: string; fade?: number; c?: string; p?: any; rate?: number };
type Ov = { f0: number; f1: number; t: string; p: any };
export const TOTAL: number = (plan as any).total;

// Ken Burns: cada foto se mueve SIEMPRE (nunca quieta), con dirección variada
const KB: Record<string, [number, number, number, number, number, number]> = {
  // s0, s1, x0, x1, y0, y1 (en % de desplazamiento)
  in: [1.04, 1.16, 0, 0, 0, 0], out: [1.18, 1.05, 0, 0, 0, 0],
  l: [1.14, 1.16, 3.5, -3.5, 0, 0], r: [1.14, 1.16, -3.5, 3.5, 0, 0],
  u: [1.14, 1.16, 0, 0, 3, -3], d: [1.14, 1.16, 0, 0, -3, 3],
  inl: [1.05, 1.2, 2, -2, 0, -1], inr: [1.05, 1.2, -2, 2, 0, 1],
};
const Photo: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const d = s.f1 - s.f0;
  const k = KB[s.kb || "in"] || KB.in;
  const t = interpolate(f, [0, d], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const sc = lerp(k[0], k[1], t), x = lerp(k[2], k[3], t), y = lerp(k[4], k[5], t);
  return <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
    <Img src={staticFile(s.src!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translate(${x}%, ${y}%)` }} />
  </AbsoluteFill>;
};
const Clip: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const d = s.f1 - s.f0;
  const sc = lerp(1.02, 1.08, f / Math.max(1, d));
  return <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(s.src!)} muted playbackRate={s.rate || 1} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc})` }} />
  </AbsoluteFill>;
};
const Gfx: React.FC<{ s: Shot }> = ({ s }) => {
  const d = s.f1 - s.f0, p = s.p || {};
  switch (s.c) {
    case "map": return <FlatMap mode={p.mode} dur={d} />;
    case "globe": return <GondwanaGlobe mode={p.mode} dur={d} />;
    case "timeline": return <DeepTimeline mode={p.mode} dur={d} />;
    case "zircon": return <ZirconChart mode={p.mode} dur={d} />;
    case "upb": return <UPbClock dur={d} />;
    case "crust": return <CrustSection mode={p.mode} dur={d} />;
    case "length": return <LengthCompare dur={d} />;
    case "unconf": return <Unconformity dur={d} bg={p.bg} />;
    case "sr": return <Strontium dur={d} bg={p.bg} />;
    case "chain": return <Chain dur={d} bg={p.bg} steps={p.steps} at={p.at} />;
  }
  return null;
};
const ShotView: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const fade = s.fade || 0;
  const o = fade ? interpolate(f, [0, fade], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>
    {s.t === "clip" ? <Clip s={s} /> : s.t === "gfx" ? <Gfx s={s} /> : <Photo s={s} />}
  </AbsoluteFill>;
};

// ---------- capas de texto ----------
const inOut = (f: number, d: number, a = 10, b = 10) => Math.min(ramp(f, 0, a), 1 - ramp(f, d - b, d));
const Tag: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 12, 10);
  return <div style={{ position: "absolute", left: 110, bottom: 120, opacity: o, transform: `translateX(${(1 - o) * -30}px)` }}>
    <div style={{ width: lerp(0, 90, ramp(f, 0, 14)), height: 4, background: C.amber, marginBottom: 18 }} />
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: p.size || 104, color: C.text, lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.85)" }}>{p.a}</div>
    {p.b && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: C.text, letterSpacing: 6, marginTop: 14, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>{p.b}</div>}
  </div>;
};
const Year: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 10, 10);
  return <div style={{ position: "absolute", right: 100, top: 90, opacity: o, textAlign: "right" }}>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.text, letterSpacing: 8, textShadow: "0 2px 16px rgba(0,0,0,0.95)" }}>{p.a}</div>
    {p.b && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.amber, letterSpacing: 6, marginTop: 8, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>{p.b}</div>}
    <div style={{ marginLeft: "auto", width: lerp(0, 260, ramp(f, 0, 16)), height: 3, background: C.amber, marginTop: 14 }} />
  </div>;
};
const Title: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 14, 12);
  const sp = lerp(30, 12, ramp(f, 0, d));
  return <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(0,0,0,${0.35 * o})` }}>
    <div style={{ opacity: o, textAlign: "center" }}>
      {p.k && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 10, color: C.amber, marginBottom: 18 }}>{p.k}</div>}
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: p.size || 130, color: C.text, letterSpacing: sp, textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>{p.a}</div>
      {p.b && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.text, marginTop: 16, opacity: 0.85 }}>{p.b}</div>}
    </div>
  </AbsoluteFill>;
};
const Chapter: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 12, 12);
  return <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(4,7,10,${0.55 * o})` }}>
    <div style={{ opacity: o, textAlign: "center", transform: `scale(${lerp(1.04, 1, ramp(f, 0, d))})` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: C.amber, letterSpacing: 6 }}>{p.n}</div>
      <div style={{ width: lerp(0, 420, ramp(f, 4, 24)), height: 2, background: C.amber, margin: "18px auto 26px" }} />
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 112, color: C.text, letterSpacing: 8, textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>{p.a}</div>
    </div>
  </AbsoluteFill>;
};
const Element: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 12, 10);
  return <div style={{ position: "absolute", right: 140, top: 200, opacity: o, transform: `scale(${lerp(0.9, 1, ramp(f, 0, 14))})`, width: 300, height: 340, background: "rgba(7,11,16,0.85)", border: `3px solid ${C.amber}`, borderRadius: 12, color: C.text, fontFamily: SANS, padding: 26, boxSizing: "border-box" }}>
    <div style={{ fontSize: 34, fontWeight: 600 }}>{p.z}</div>
    <div style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 700, lineHeight: 1, color: C.amber }}>{p.sym}</div>
    <div style={{ fontSize: 34, fontWeight: 600, marginTop: 10 }}>{p.name}</div>
    <div style={{ fontSize: 20, color: C.dim, marginTop: 6, letterSpacing: 2 }}>{p.note}</div>
  </div>;
};
const Chips: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 10, 10);
  return <div style={{ position: "absolute", left: 110, bottom: 130, display: "flex", gap: 22, opacity: o }}>
    {(p.items as string[]).map((s, i) => { const oi = ramp(f, i * 8, i * 8 + 10); return <div key={i} style={{ opacity: oi, transform: `translateY(${(1 - oi) * 20}px)`, padding: "16px 28px", background: "rgba(7,11,16,0.8)", border: `2px solid ${C.amber}`, borderRadius: 8, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.text }}>{s}</div>; })}
  </div>;
};
const Credit: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 8, 8);
  return <div style={{ position: "absolute", right: 30, bottom: 22, opacity: 0.75 * o, fontFamily: SANS, fontSize: 17, color: C.text, letterSpacing: 1, textShadow: "0 1px 6px rgba(0,0,0,1)" }}>{p.a}</div>;
};
const Sub: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = inOut(f, d, 10, 12);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: o }}>
    <span style={{ display: "inline-block", padding: "14px 34px", background: C.red, borderRadius: 6, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: "#fff", transform: `scale(${lerp(0.85, 1, ramp(f, 0, 10))})` }}>{p.a}</span>
  </div>;
};
const End: React.FC<{ p: any; d: number }> = ({ p, d }) => {
  const f = useCurrentFrame(); const o = ramp(f, 0, 18);
  return <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150, background: `linear-gradient(0deg, rgba(0,0,0,${0.75 * o}), rgba(0,0,0,0) 60%)` }}>
    <div style={{ opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: C.amber }}>PRÓXIMAMENTE EN TIERRA PROFUNDA</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 92, color: C.text, marginTop: 12 }}>{p.a}</div>
    </div>
  </AbsoluteFill>;
};
const OVS: Record<string, React.FC<{ p: any; d: number }>> = { tag: Tag, year: Year, title: Title, chapter: Chapter, element: Element, chips: Chips, credit: Credit, sub: Sub, end: End };

export const Main: React.FC = () => {
  const shots = (plan as any).shots as Shot[];
  const ovs = (plan as any).ovs as Ov[];
  return <AbsoluteFill style={{ background: C.ink }}>
    {shots.map((s, i) => <Sequence key={"s" + i} from={s.f0} durationInFrames={s.f1 - s.f0} premountFor={45}><ShotView s={s} /></Sequence>)}
    {ovs.map((o, i) => { const Cmp = OVS[o.t]; return Cmp ? <Sequence key={"o" + i} from={o.f0} durationInFrames={o.f1 - o.f0}><Cmp p={o.p} d={o.f1 - o.f0} /></Sequence> : null; })}
  </AbsoluteFill>;
};
