// Kit.tsx — kit CLARO "papel clínico" del video fapapilomas (canal Federer Archivos).
// Capas de cada componente: CAMA (foto/cuadro real luminoso, parallax) + TARJETA de papel crema con
// entrada 3D + tipografía cinética + acento (teal / ámbar / rojo sólo alerta) + SFX.
// ⛔ Nada de look oscuro sobre las fotos: velo CLARO. ⛔ Sin <Video>. ⛔ Todo tiempo `at` en segundos desde el inicio.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { F_INTER, F_OSWALD } from "../VideoEdit/kit/premium/theme";

export const C = {
  paper: "#FBF7EE", paper2: "#F2EAD8", line: "#E3D8C2", ink: "#1D2A2E", ink2: "#4A5A5E",
  teal: "#12B3AE", tealD: "#0C7F7B", green: "#2F7D5B", amber: "#E39B2D", amberS: "#FCEBC7", danger: "#C8433A", dangerS: "#F8DAD5",
};
const FPS = 30;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
export const inA = (f: number, start: number, len = 10) => interpolate(f, [start, start + len], [0, 1], { ...cl, easing: ease });
const toneC = (t?: string) => (t === "danger" ? C.danger : t === "amber" ? C.amber : t === "green" ? C.green : C.tealD);
const atF = (at: number | undefined, i: number, base = 12, step = 18) => (typeof at === "number" ? Math.max(0, Math.round(at * FPS)) : base + i * step);
const isVid = (s?: string) => !!s && /\.mp4$/i.test(s);

export const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.32 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none"><Audio src={staticFile(`sfx/${src}`)} volume={vol} /></Sequence>
);

/** CAMA luminosa: foto real con parallax lento y velo CLARO (no oscurece). */
export const Bed: React.FC<{ src?: string; blur?: number; veil?: number }> = ({ src, blur = 3, veil = 0.3 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl);
  if (!src || isVid(src)) return <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 30% 20%, #FFFFFF 0%, ${C.paper2} 70%)` }} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.paper }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px)`, transform: `scale(${(1.08 + 0.05 * k).toFixed(4)}) translateX(${(-1 + 2 * k).toFixed(3)}%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(251,247,238,${veil}) 0%, rgba(251,247,238,${veil * 0.6}) 50%, rgba(251,247,238,${veil + 0.1}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Tarjeta de papel con entrada 3D y deriva lenta (nunca quieta). */
export const Card: React.FC<{ w: number; h?: number; x?: number; y?: number; delay?: number; children: React.ReactNode; rot?: number; pad?: number }> = ({ w, h, x = 50, y = 50, delay = 0, children, rot = 0, pad = 48 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = inA(f, delay, 14);
  const drift = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h, perspective: 1600,
      transform: `translate(-50%, -50%) translateY(${((1 - a) * 60).toFixed(1)}px) scale(${(0.985 + 0.02 * drift).toFixed(4)})`, opacity: a }}>
      <div style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: pad, borderRadius: 26, background: `linear-gradient(160deg, #FFFDF8 0%, ${C.paper} 60%, ${C.paper2} 100%)`,
        border: `1.5px solid ${C.line}`, boxShadow: "0 40px 90px rgba(40,34,20,0.28), 0 8px 22px rgba(40,34,20,0.16)",
        transform: `rotateX(${((1 - a) * 14).toFixed(2)}deg) rotateZ(${(rot + (1 - a) * -2).toFixed(2)}deg)` }}>
        {children}
      </div>
    </div>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string; o?: number }> = ({ children, color = C.tealD, o = 1 }) => (
  <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color, opacity: o }}>{children}</div>
);
const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string; o?: number; y?: number }> = ({ children, size = 72, color = C.ink, o = 1, y = 0 }) => (
  <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: size, lineHeight: 1.04, color, opacity: o, transform: `translateY(${y}px)` }}>{children}</div>
);
const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string; o?: number }> = ({ children, size = 36, color = C.ink2, o = 1 }) => (
  <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: size, lineHeight: 1.25, color, opacity: o }}>{children}</div>
);
const Underline: React.FC<{ p: number; color?: string; w?: number }> = ({ p, color = C.teal, w = 260 }) => (
  <div style={{ height: 6, width: w * p, background: color, borderRadius: 3, marginTop: 14 }} />
);
const Wordy: React.FC<{ text: string; start: number; size?: number; color?: string; per?: number; font?: string; weight?: number }> = ({ text, start, size = 72, color = C.ink, per = 3, font = F_OSWALD, weight = 700 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.08, color }}>
      {text.split(" ").map((w, i) => { const a = inA(f, start + i * per, 8); return <span key={i} style={{ display: "inline-block", marginRight: size * 0.24, opacity: a, transform: `translateY(${((1 - a) * size * 0.4).toFixed(1)}px)` }}>{w}</span>; })}
    </div>
  );
};
const Polaroid: React.FC<{ src?: string; w: number; h: number; rot?: number; o?: number; s?: number }> = ({ src, w, h, rot = -3, o = 1, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: w, padding: 16, paddingBottom: 46, background: "#fff", boxShadow: "0 28px 60px rgba(40,34,20,0.3)", transform: `rotate(${rot}deg) scale(${s})`, opacity: o }}>
      <div style={{ width: w - 32, height: h, overflow: "hidden", background: C.paper2 }}>
        {src && !isVid(src) ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.04 + f * 0.0006).toFixed(4)})` }} /> : null}
      </div>
    </div>
  );
};

// ───────────────────────────── OVERLAYS ─────────────────────────────
export const StopStamp: React.FC<{ text?: string; sub?: string; durationInFrames?: number }> = ({ text = "", sub = "" }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 12], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  const s = interpolate(f, [4, 12, 18], [2.2, 0.94, 1], cl);
  return (
    <AbsoluteFill>
      <Sfx at={10} src="stinger_hit.mp3" vol={0.35} />
      <div style={{ position: "absolute", left: "6%", bottom: "11%", transform: `rotate(-6deg) scale(${s})`, transformOrigin: "left bottom", opacity: a }}>
        <div style={{ border: `8px solid ${C.danger}`, borderRadius: 18, padding: "18px 36px", background: "rgba(251,247,238,0.94)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 96, color: C.danger, letterSpacing: 2, lineHeight: 1 }}>{text}</div>
          <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 32, color: C.ink, marginTop: 8, opacity: inA(f, 16, 10) }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const NameTag: React.FC<{ name?: string; role?: string; durationInFrames?: number }> = ({ name = "", role = "" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = inA(f, 3, 12), out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], cl);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Sfx at={3} src="sfx_whoosh_soft.mp3" vol={0.25} />
      <div style={{ position: "absolute", left: 90, bottom: 110, transform: `translateX(${((1 - a) * -80).toFixed(1)}px)`, opacity: a, display: "flex", alignItems: "stretch", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ width: 14, background: C.teal }} />
        <div style={{ background: C.paper, padding: "20px 34px" }}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 60, color: C.ink, lineHeight: 1 }}>{name}</div>
          <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: 28, color: C.tealD, marginTop: 6, opacity: inA(f, 12, 10) }}>{role}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KeyWords: React.FC<{ words?: { t: string; hl?: boolean }[]; durationInFrames?: number }> = ({ words = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sfx at={4} src="sfx_text_thud.mp3" vol={0.3} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 26 }}>
        {words.map((w, i) => { const a = interpolate(f, [4 + i * 6, 12 + i * 6], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.8)) }); return (
          <div key={i} style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 104, padding: "6px 26px", borderRadius: 14, color: w.hl ? "#fff" : C.ink, background: w.hl ? C.danger : "rgba(251,247,238,0.95)", boxShadow: "0 18px 40px rgba(0,0,0,0.25)", opacity: a, transform: `scale(${(0.6 + 0.4 * a).toFixed(3)})` }}>{w.t}</div>); })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────── FULL SCREEN ─────────────────────────────
type P = { bed?: string; durationInFrames?: number };

export const TypeCard: React.FC<P & { n?: string; name?: string; alias?: string; image?: string; tone?: string; traits?: { text: string; at?: number }[]; badge?: string }> = ({ bed, n = "", name = "", alias = "", image, tone, traits = [], badge = "" }) => {
  const f = useCurrentFrame();
  const col = toneC(tone);
  const ring = inA(f, 18, 16);
  const lastAt = traits.length ? atF(traits[traits.length - 1].at, traits.length - 1) : 40;
  const b = interpolate(f, [lastAt + 14, lastAt + 22], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Sfx at={2} src="sfx_whoosh_soft.mp3" />
      <Card w={1600} h={760} delay={0}>
        <div style={{ display: "flex", gap: 60, height: "100%" }}>
          <div style={{ position: "relative", marginTop: 20 }}>
            <Polaroid src={image} w={620} h={560} rot={-3} o={inA(f, 6, 12)} />
            <div style={{ position: "absolute", left: 250, top: 210, width: 190, height: 190, borderRadius: "50%", border: `7px solid ${col}`, opacity: ring, transform: `scale(${(1.4 - 0.4 * ring).toFixed(3)})`, boxShadow: `0 0 0 9999px rgba(0,0,0,${(0.12 * ring).toFixed(3)})` }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: col, color: "#fff", fontFamily: F_OSWALD, fontWeight: 700, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${inA(f, 8, 10)})` }}>{n}</div>
              <Kicker color={col} o={inA(f, 10, 10)}>Tipo {n}</Kicker>
            </div>
            <div style={{ marginTop: 18 }}><Wordy text={name} start={12} size={name.length > 14 ? 74 : 96} /></div>
            <Body o={inA(f, 22, 10)} size={34}>{alias}</Body>
            <Underline p={inA(f, 20, 16)} color={col} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 34 }}>
              {traits.map((t, i) => { const a = inA(f, atF(t.at, i, 34), 9); return (
                <div key={i} style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 36, color: C.ink, background: "#fff", border: `3px solid ${col}`, borderRadius: 40, padding: "12px 28px", opacity: a, transform: `translateY(${((1 - a) * 24).toFixed(1)}px)` }}>{t.text}</div>); })}
            </div>
            <div style={{ marginTop: 36, alignSelf: "flex-start", fontFamily: F_OSWALD, fontWeight: 800, fontSize: 52, color: col, border: `6px solid ${col}`, borderRadius: 12, padding: "4px 26px", transform: `rotate(-5deg) scale(${(1.8 - 0.8 * b).toFixed(3)})`, opacity: b }}>{badge}</div>
          </div>
        </div>
      </Card>
      {traits.map((t, i) => <Sfx key={i} at={atF(t.at, i, 34)} src="sfx_pop.mp3" vol={0.22} />)}
      <Sfx at={lastAt + 14} src="sfx_text_thud.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

export const ZonesMap: React.FC<P & { title?: string; note?: string; zones?: { label: string; x: number; y: number; at?: number }[] }> = ({ bed, title = "", note = "", zones = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1640} h={860}>
        <div style={{ display: "flex", height: "100%", gap: 40 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Kicker o={inA(f, 6)}>Acrocordón</Kicker>
            <Wordy text={title} start={8} size={86} />
            <Underline p={inA(f, 18, 16)} />
            <div style={{ marginTop: 40, fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.green, background: "#E4F2EA", borderRadius: 14, padding: "18px 26px", opacity: inA(f, Math.round(f > 0 ? (zones.length ? atF(zones[zones.length - 1].at, zones.length) + 30 : 90) : 90), 12) }}>✓ {note}</div>
          </div>
          <div style={{ position: "relative", width: 620, height: "100%" }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: inA(f, 4, 14) }}>
              <ellipse cx="50" cy="10" rx="9" ry="8" fill="#E9D3BF" stroke="#C8AE96" strokeWidth="0.5" />
              <rect x="45" y="17" width="10" height="8" rx="3" fill="#E9D3BF" />
              <path d="M24 26 Q50 20 76 26 L72 78 Q50 84 28 78 Z" fill="#EFDDCB" stroke="#C8AE96" strokeWidth="0.5" />
              <path d="M24 27 L14 62 L20 63 L30 36" fill="#E9D3BF" /><path d="M76 27 L86 62 L80 63 L70 36" fill="#E9D3BF" />
              <path d="M30 78 L34 99 L46 99 L50 84 L54 99 L66 99 L70 78" fill="#E3CDB8" />
            </svg>
            {zones.map((z, i) => { const s = atF(z.at, i, 20, 14); const a = inA(f, s, 8); const pulse = 1 + 0.25 * Math.sin((f - s) / 5) * a; return (
              <div key={i} style={{ position: "absolute", left: `${z.x}%`, top: `${z.y}%`, opacity: a }}>
                <div style={{ position: "absolute", width: 34, height: 34, left: -17, top: -17, borderRadius: "50%", background: C.teal, border: "5px solid #fff", transform: `scale(${pulse.toFixed(3)})`, boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }} />
                <div style={{ position: "absolute", left: i % 2 ? 30 : undefined, right: i % 2 ? undefined : 30, top: -26, whiteSpace: "nowrap", fontFamily: F_INTER, fontWeight: 800, fontSize: 34, color: C.ink, background: "#fff", borderRadius: 10, padding: "6px 14px", boxShadow: "0 8px 20px rgba(0,0,0,0.18)" }}>{z.label}</div>
              </div>); })}
          </div>
        </div>
      </Card>
      {zones.map((z, i) => <Sfx key={i} at={atF(z.at, i, 20, 14)} src="node_pop.mp3" vol={0.2} />)}
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ k: string; color?: string; size?: number }> = ({ k, color = C.ink, size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    {k === "scissors" && <><circle cx="28" cy="72" r="12" /><circle cx="72" cy="72" r="12" /><path d="M36 63 L70 18 M64 63 L30 18" /></>}
    {k === "thread" && <><rect x="30" y="20" width="40" height="10" rx="3" /><rect x="30" y="70" width="40" height="10" rx="3" /><path d="M36 30 L36 70 M64 30 L64 70 M36 38 L64 44 M36 48 L64 54 M36 58 L64 64 M64 44 Q86 50 80 86" /></>}
    {k === "fire" && <path d="M50 88 C28 88 20 70 28 54 C34 42 44 40 42 18 C58 28 64 42 60 54 C66 50 70 44 70 38 C82 52 80 88 50 88 Z" />}
    {k === "snow" && <><path d="M50 12 L50 88 M17 31 L83 69 M17 69 L83 31" /><path d="M42 18 L50 26 L58 18 M42 82 L50 74 L58 82" /></>}
    {k === "bolt" && <path d="M56 10 L26 56 L48 56 L42 90 L74 42 L52 42 Z" />}
    {k === "scalpel" && <><path d="M18 82 L58 42" strokeWidth={8} /><path d="M58 42 C70 26 84 16 90 14 C88 26 78 42 64 50 Z" /></>}
    {k === "phone" && <><rect x="28" y="10" width="44" height="80" rx="8" /><circle cx="50" cy="78" r="4" /></>}
  </svg>
);

export const NoHomeRule: React.FC<P & { title?: string; footer?: string; items?: { icon: string; label: string; at?: number }[] }> = ({ bed, title = "", footer = "", items = [] }) => {
  const f = useCurrentFrame();
  const last = items.length ? atF(items[items.length - 1].at, items.length - 1) : 60;
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1640} h={800}>
        <div style={{ textAlign: "center" }}>
          <Kicker color={C.danger} o={inA(f, 4)}>La regla más importante</Kicker>
          <Title o={inA(f, 6)} size={92}>{title}</Title>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 50 }}>
          {items.map((it, i) => { const s = atF(it.at, i, 20, 20); const a = inA(f, s - 6, 8); const slash = inA(f, s + 4, 8); return (
            <div key={i} style={{ width: 380, height: 380, borderRadius: 28, background: "#fff", border: `3px solid ${C.line}`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: a, transform: `scale(${(0.8 + 0.2 * a).toFixed(3)})` }}>
              <Icon k={it.icon} />
              <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 56, color: C.ink, marginTop: 14 }}>{it.label}</div>
              <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 100 100"><line x1="12" y1="88" x2={12 + 76 * slash} y2={88 - 76 * slash} stroke={C.danger} strokeWidth={6} strokeLinecap="round" /></svg>
            </div>); })}
        </div>
        <div style={{ textAlign: "center", marginTop: 44, fontFamily: F_INTER, fontWeight: 700, fontSize: 40, color: C.tealD, opacity: inA(f, last + 20, 12) }}>{footer}</div>
      </Card>
      {items.map((it, i) => <Sfx key={i} at={atF(it.at, i, 20, 20) + 4} src="sfx_text_thud.mp3" vol={0.28} />)}
    </AbsoluteFill>
  );
};

const ListCard: React.FC<P & { kicker?: string; title?: string; footer?: string; items: { text: string; at?: number }[]; mode: "flag" | "cross" | "check" }> = ({ bed, kicker = "", title = "", footer = "", items, mode }) => {
  const f = useCurrentFrame();
  const col = mode === "check" ? C.tealD : C.danger;
  const last = items.length ? atF(items[items.length - 1].at, items.length - 1) : 60;
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1320} h={Math.min(960, 330 + items.length * 118 + (footer ? 70 : 0))} x={50} y={50}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {mode === "flag" && <svg width="62" height="62" viewBox="0 0 100 100" style={{ opacity: inA(f, 4) }}><path d="M50 8 L94 88 L6 88 Z" fill={C.danger} /><rect x="46" y="36" width="8" height="28" fill="#fff" /><rect x="46" y="70" width="8" height="8" fill="#fff" /></svg>}
          <Kicker color={col} o={inA(f, 4)}>{kicker || (mode === "cross" ? "No" : "")}</Kicker>
        </div>
        <Wordy text={title} start={6} size={78} />
        <Underline p={inA(f, 14, 14)} color={col} w={340} />
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((it, i) => { const s = atF(it.at, i, 22, 16); const a = inA(f, s, 8); const st = inA(f, s + 6, 10); const pulse = mode === "flag" ? 1 + 0.18 * Math.max(0, Math.sin((f - s) / 4)) * a : 1; return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: a, transform: `translateX(${((1 - a) * 60).toFixed(1)}px)`, background: mode === "flag" ? C.dangerS : "#fff", borderRadius: 16, padding: "16px 26px" }}>
              <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: "50%", background: col, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_OSWALD, fontSize: 36, fontWeight: 700, transform: `scale(${pulse.toFixed(3)})` }}>{mode === "flag" ? "!" : mode === "cross" ? "✕" : i + 1}</div>
              <div style={{ position: "relative", fontFamily: F_INTER, fontWeight: 700, fontSize: 46, color: C.ink }}>
                {it.text}
                {mode === "cross" && <div style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${(st * 100).toFixed(1)}%`, background: C.danger, borderRadius: 3 }} />}
              </div>
            </div>); })}
        </div>
        {footer ? <div style={{ marginTop: 26, fontFamily: F_INTER, fontWeight: 700, fontSize: 38, color: C.tealD, opacity: inA(f, last + 18, 12) }}>{footer}</div> : null}
      </Card>
      {items.map((it, i) => <Sfx key={i} at={atF(it.at, i, 22, 16)} src={mode === "flag" ? "node_pop.mp3" : "sfx_paper_tick.mp3"} vol={0.25} />)}
    </AbsoluteFill>
  );
};
export const RedFlags: React.FC<P & { kicker?: string; title?: string; items?: { text: string; at?: number }[] }> = (p) => <ListCard {...p} items={p.items || []} mode="flag" />;
export const CrossList: React.FC<P & { title?: string; footer?: string; items?: { text: string; at?: number }[] }> = (p) => <ListCard {...p} items={p.items || []} mode="cross" />;

export const LoopCards: React.FC<P & { title?: string; cards?: { n: string; label: string; at?: number }[] }> = ({ bed, title = "", cards = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: inA(f, 2, 10) }}>
        <span style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 84, color: C.ink, background: "rgba(251,247,238,0.92)", padding: "8px 36px", borderRadius: 16 }}>{title}</span>
      </div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60, perspective: 1800 }}>
        {cards.map((c, i) => { const s = atF(c.at, i, 20, 30); const a = inA(f, 6 + i * 5, 12); const flip = interpolate(f, [s, s + 14], [180, 0], { ...cl, easing: ease }); return (
          <div key={i} style={{ width: 480, height: 560, position: "relative", opacity: a, transform: `translateY(${((1 - a) * 80 + Math.sin((f + i * 20) / 30) * 6).toFixed(1)}px) rotateY(${flip.toFixed(1)}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 28, background: C.paper, border: `2px solid ${C.line}`, boxShadow: "0 40px 80px rgba(0,0,0,0.25)", padding: 44, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 160, color: C.teal, lineHeight: 1 }}>{c.n}</div>
              <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 62, color: C.ink, lineHeight: 1.05 }}>{c.label}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 28, background: `linear-gradient(150deg, ${C.teal}, ${C.tealD})`, boxShadow: "0 40px 80px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_OSWALD, fontWeight: 800, fontSize: 220, color: "rgba(255,255,255,0.9)" }}>?</div>
          </div>); })}
      </div>
      {cards.map((c, i) => <Sfx key={i} at={atF(c.at, i, 20, 30)} src="layer_drop.mp3" vol={0.3} />)}
    </AbsoluteFill>
  );
};

export const QuoteCard: React.FC<P & { quote?: string; attrib?: string; image?: string }> = ({ bed, quote = "", attrib = "", image }) => {
  const f = useCurrentFrame();
  const chars = Math.floor(interpolate(f, [10, 10 + quote.length * 1.1], [0, quote.length], cl));
  return (
    <AbsoluteFill>
      <Bed src={bed || image} />
      <Sfx at={8} src="keyboard_type.mp3" vol={0.18} />
      <div style={{ position: "absolute", left: 150, top: 230, opacity: inA(f, 2, 12) }}><Polaroid src={image} w={560} h={440} rot={-5} s={0.96 + 0.04 * inA(f, 2, 20)} /></div>
      <Card w={1020} h={560} x={63} y={52} delay={4} rot={1.5}>
        <div style={{ fontFamily: F_OSWALD, fontSize: 200, color: C.teal, lineHeight: 0.6, height: 90 }}>“</div>
        <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 60, lineHeight: 1.18, color: C.ink }}>{quote.slice(0, chars)}<span style={{ opacity: chars < quote.length ? 1 : 0 }}>|</span></div>
        <div style={{ marginTop: 30, fontFamily: F_INTER, fontWeight: 600, fontSize: 34, color: C.tealD, opacity: inA(f, 12 + quote.length, 12) }}>— {attrib}</div>
      </Card>
    </AbsoluteFill>
  );
};

export const StoryCard: React.FC<P & { name?: string; age?: string; detail?: string; image?: string }> = ({ bed, name = "", age = "", detail = "", image }) => {
  const f = useCurrentFrame();
  const p = inA(f, 4, 18);
  return (
    <AbsoluteFill>
      <Bed src={bed || image} blur={6} />
      <Sfx at={4} src="universfield-camera-shutter-199580.mp3" vol={0.3} />
      <div style={{ position: "absolute", left: 180, top: 140, transform: `rotate(${(-8 + 4 * p).toFixed(2)}deg) translateY(${((1 - p) * -200).toFixed(1)}px)`, opacity: p }}>
        <Polaroid src={image} w={820} h={640} rot={0} />
        <div style={{ position: "absolute", top: -26, left: 320, width: 180, height: 56, background: "rgba(240,226,180,0.85)", transform: "rotate(-4deg)" }} />
      </div>
      <Card w={720} h={520} x={73} y={55} delay={14} rot={2}>
        <Kicker o={inA(f, 18)}>Una historia</Kicker>
        <Wordy text={name} start={20} size={88} />
        <Underline p={inA(f, 28, 14)} color={C.amber} w={300} />
        <div style={{ display: "flex", gap: 16, marginTop: 30, flexWrap: "wrap" }}>
          {[age, detail].map((t, i) => { const a = inA(f, 34 + i * 10, 9); return <div key={i} style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 40, background: i ? "#fff" : C.amberS, border: `3px solid ${C.amber}`, borderRadius: 40, padding: "10px 26px", color: C.ink, opacity: a, transform: `scale(${(0.8 + 0.2 * a).toFixed(3)})` }}>{t}</div>; })}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

export const DayTimeline: React.FC<P & { title?: string; days?: { day: string; text: string; at?: number }[] }> = ({ bed, title = "", days = [] }) => {
  const f = useCurrentFrame();
  const n = days.length;
  const lastS = n ? atF(days[n - 1].at, n - 1, 20, 40) : 60;
  const prog = interpolate(f, [n ? atF(days[0].at, 0, 20, 40) : 0, lastS + 8], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1700} h={640}>
        <Kicker color={C.danger} o={inA(f, 4)}>Lo que hizo el hilo</Kicker>
        <Wordy text={title} start={6} size={80} />
        <div style={{ position: "relative", marginTop: 110, height: 260 }}>
          <div style={{ position: "absolute", left: 90, right: 90, top: 40, height: 10, background: C.line, borderRadius: 5 }} />
          <div style={{ position: "absolute", left: 90, top: 40, height: 10, width: `calc(${(prog * 100).toFixed(1)}% - ${(prog * 180).toFixed(1)}px)`, background: `linear-gradient(90deg, ${C.amber}, ${C.danger})`, borderRadius: 5 }} />
          {days.map((d, i) => { const s = atF(d.at, i, 20, 40); const a = inA(f, s, 9); const col = i === 0 ? C.amber : i < n - 1 ? "#D9713A" : C.danger; return (
            <div key={i} style={{ position: "absolute", left: `${(90 + (i * (1700 - 96 - 180)) / Math.max(1, n - 1)).toFixed(0)}px`, top: 0, width: 0 }}>
              <div style={{ position: "absolute", left: -45, top: 0, width: 90, height: 90, borderRadius: "50%", background: col, border: "6px solid #fff", boxShadow: "0 10px 24px rgba(0,0,0,0.2)", transform: `scale(${(0.3 + 0.7 * a).toFixed(3)})`, opacity: a }} />
              <div style={{ position: "absolute", left: -170, width: 340, top: 120, textAlign: "center", opacity: a }}>
                <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 40, color: col }}>{d.day}</div>
                <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 44, color: C.ink }}>{d.text}</div>
              </div>
            </div>); })}
        </div>
      </Card>
      {days.map((d, i) => <Sfx key={i} at={atF(d.at, i, 20, 40)} src="node_land.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

export const SkinSection: React.FC<P & { variant?: "tag" | "sk"; title?: string; labels?: { text: string; at?: number }[] }> = ({ bed, variant = "tag", title = "", labels = [] }) => {
  const f = useCurrentFrame();
  const L = labels.map((l, i) => atF(l.at, i, 24, 40));
  const tie = variant === "tag" && L.length > 2 ? inA(f, L[2], 24) : 0;
  const vessel = variant === "tag" && L.length > 1 ? inA(f, L[1], 30) : 0;
  const bob = Math.sin(f / 18) * 1.2;
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1700} h={860}>
        <div style={{ display: "flex", height: "100%", gap: 30 }}>
          <div style={{ width: 520, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Kicker o={inA(f, 4)}>{variant === "tag" ? "Acrocordón por dentro" : "Queratosis por dentro"}</Kicker>
            <Wordy text={title} start={6} size={78} />
            <Underline p={inA(f, 16, 14)} />
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 16 }}>
              {labels.map((l, i) => { const a = inA(f, L[i], 9); const col = i === 2 ? C.danger : i === 1 ? C.danger : C.tealD; return <div key={i} style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 42, color: C.ink, borderLeft: `10px solid ${col}`, paddingLeft: 18, opacity: a, transform: `translateX(${((1 - a) * 40).toFixed(1)}px)` }}>{l.text}</div>; })}
            </div>
          </div>
          <svg viewBox="0 0 100 70" style={{ flex: 1, opacity: inA(f, 2, 14) }}>
            <rect x="0" y="40" width="100" height="30" fill="#F2C6B6" />
            <rect x="0" y="34" width="100" height="7" fill="#EAC7A8" />
            <path d="M0 34 Q25 32 50 34 T100 34" stroke="#C99B7B" strokeWidth="0.6" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={4 + i * 8.5} cy={52 + (i % 3) * 5} r="1.1" fill="#E3A99A" />)}
            {variant === "tag" ? (
              <g transform={`translate(0 ${bob.toFixed(2)})`}>
                <path d="M47 34 C47 28 44 26 42 20 C38 10 62 10 58 20 C56 26 53 28 53 34 Z" fill="#E9BFA5" stroke="#C99B7B" strokeWidth="0.5" />
                <path d={`M50 62 C49 52 51 44 50 34 C50 28 50 24 50 16`} stroke={vessel > 0 ? (tie > 0.6 ? "#9A9A9A" : "#C8433A") : "none"} strokeWidth="1.1" fill="none" strokeDasharray="60" strokeDashoffset={(60 * (1 - vessel)).toFixed(2)} />
                {tie > 0 && <path d={`M${44 + 2 * tie} 29 L${56 - 2 * tie} 29`} stroke="#1D2A2E" strokeWidth={1.4} strokeLinecap="round" />}
                {tie > 0 && <path d="M56 29 Q62 34 64 42" stroke="#1D2A2E" strokeWidth="0.8" fill="none" opacity={tie} />}
              </g>
            ) : (
              <g>
                <path d="M34 34 C35 27 65 27 66 34 Z" fill="#8A5A3A" stroke="#5E3C26" strokeWidth="0.5" transform={`translate(0 ${(-(1 - inA(f, 10, 20)) * 8).toFixed(2)})`} />
                {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={38 + i * 3.4} cy={31 + (i % 2)} r="0.7" fill="#6B4630" />)}
                <path d="M72 22 L62 30" stroke={C.tealD} strokeWidth="0.8" markerEnd="" opacity={L.length ? inA(f, L[0], 10) : 1} />
              </g>
            )}
            <text x="3" y="68" fontSize="3" fill="#9E6F5E" fontFamily="Arial">dermis</text>
            <text x="3" y="39" fontSize="3" fill="#9E6F5E" fontFamily="Arial">epidermis</text>
          </svg>
        </div>
      </Card>
      {L.map((s, i) => <Sfx key={i} at={s} src="line_draw.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

type Side = { label: string; text: string; tone?: string };
export const SplitCompare: React.FC<P & { title?: string; left?: Side; right?: Side; verdict?: string }> = ({ bed, title = "", left = { label: "", text: "" }, right = { label: "", text: "" }, verdict = "" }) => {
  const f = useCurrentFrame();
  const a = inA(f, 8, 14), b = inA(f, 26, 14), v = inA(f, 48, 12);
  const Panel: React.FC<{ s: Side; p: number; dir: number }> = ({ s, p, dir }) => (
    <div style={{ width: 720, height: 460, borderRadius: 28, background: "#fff", borderTop: `16px solid ${toneC(s.tone)}`, boxShadow: "0 30px 70px rgba(0,0,0,0.22)", padding: 44, boxSizing: "border-box", opacity: p, transform: `translateX(${((1 - p) * 140 * dir).toFixed(1)}px) rotate(${(dir * (1 - p) * 4).toFixed(2)}deg)` }}>
      <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 46, color: toneC(s.tone), textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
      <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 84, color: C.ink, lineHeight: 1.05, marginTop: 30 }}>{s.text}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", opacity: inA(f, 2, 10) }}>
        <span style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 80, color: C.ink, background: "rgba(251,247,238,0.94)", padding: "6px 34px", borderRadius: 16 }}>{title}</span>
      </div>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        <Panel s={left} p={a} dir={-1} />
        <div style={{ alignSelf: "center", fontFamily: F_OSWALD, fontWeight: 800, fontSize: 70, color: C.ink2, opacity: b }}>VS</div>
        <Panel s={right} p={b} dir={1} />
      </div>
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: v, transform: `translateY(${((1 - v) * 30).toFixed(1)}px)` }}>
        <span style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 50, color: "#fff", background: C.tealD, padding: "16px 40px", borderRadius: 18, boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}>{verdict}</span>
      </div>
      <Sfx at={8} src="sfx_whoosh_soft.mp3" /><Sfx at={26} src="sfx_whoosh_soft.mp3" /><Sfx at={48} src="sfx_chime.mp3" vol={0.2} />
    </AbsoluteFill>
  );
};

export const BigNumber: React.FC<P & { value?: string; unit?: string; caption?: string; tone?: string }> = ({ bed, value = "", unit = "", caption = "", tone }) => {
  const f = useCurrentFrame();
  const col = toneC(tone);
  const wipe = inA(f, 4, 16);
  const pop = interpolate(f, [4, 14, 22], [0.7, 1.05, 1], cl);
  return (
    <AbsoluteFill>
      <Bed src={bed} veil={0.42} />
      <Sfx at={5} src="number_slam.mp3" vol={0.3} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "rgba(251,247,238,0.9)", borderRadius: 34, padding: "30px 70px", boxShadow: "0 40px 90px rgba(0,0,0,0.25)", transform: `scale(${pop.toFixed(3)})`, textAlign: "center" }}>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: value.length > 9 ? 170 : 230, color: col, lineHeight: 1, clipPath: `inset(0 ${((1 - wipe) * 100).toFixed(1)}% 0 0)` }}>{value}</div>
          {unit ? <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 70, color: C.ink, opacity: inA(f, 14, 10) }}>{unit}</div> : null}
          <div style={{ height: 8, background: col, width: `${(inA(f, 16, 14) * 100).toFixed(0)}%`, margin: "18px auto 0", borderRadius: 4 }} />
        </div>
        <div style={{ marginTop: 40, fontFamily: F_INTER, fontWeight: 700, fontSize: 48, color: C.ink, background: "#fff", borderRadius: 16, padding: "16px 36px", boxShadow: "0 16px 40px rgba(0,0,0,0.18)", opacity: inA(f, 22, 12), transform: `translateY(${((1 - inA(f, 22, 12)) * 30).toFixed(1)}px)` }}>{caption}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PatitoFeo: React.FC<P & { title?: string; caption?: string }> = ({ bed, title = "", caption = "" }) => {
  const f = useCurrentFrame();
  const spots = [[18, 30], [34, 22], [52, 34], [70, 24], [84, 38], [24, 58], [42, 66], [62, 56], [78, 70], [30, 82], [56, 84], [88, 60]];
  const odd = 7;
  const ring = inA(f, 60, 16);
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1700} h={860}>
        <div style={{ display: "flex", height: "100%", gap: 40 }}>
          <div style={{ position: "relative", flex: 1, borderRadius: 24, background: "linear-gradient(160deg,#EFD2BC,#E6C2A8)", overflow: "hidden" }}>
            {spots.map(([x, y], i) => { const a = inA(f, 6 + i * 3, 8); const isOdd = i === odd; const dim = isOdd ? 1 : 1 - 0.45 * ring; return (
              <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: isOdd ? 58 : 50 + (i % 3) * 8, height: isOdd ? 52 : 40 + (i % 2) * 8, marginLeft: -25, marginTop: -20, borderRadius: "48% 52% 45% 55%",
                background: isOdd ? "radial-gradient(circle at 35% 35%, #FFF3F0 0%, #F2A8A0 45%, #D98B82 100%)" : "radial-gradient(circle at 40% 35%, #9C6B48 0%, #6E452C 80%)", boxShadow: isOdd ? "0 0 12px rgba(255,255,255,0.8)" : "none", opacity: a * dim, transform: `scale(${a})` }} />); })}
            <div style={{ position: "absolute", left: `${spots[odd][0]}%`, top: `${spots[odd][1]}%`, width: 170, height: 170, marginLeft: -85, marginTop: -85, borderRadius: "50%", border: `8px solid ${C.danger}`, opacity: ring, transform: `scale(${(1.8 - 0.8 * ring + 0.05 * Math.sin(f / 5)).toFixed(3)})` }} />
          </div>
          <div style={{ width: 560, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Kicker color={C.danger} o={inA(f, 4)}>La regla de los dermatólogos</Kicker>
            <Wordy text={title} start={8} size={90} />
            <Underline p={inA(f, 18, 14)} color={C.danger} />
            <div style={{ marginTop: 40, fontFamily: F_INTER, fontWeight: 800, fontSize: 48, color: C.ink, opacity: inA(f, 70, 12) }}>{caption}</div>
          </div>
        </div>
      </Card>
      <Sfx at={60} src="stinger_hit.mp3" vol={0.25} />
    </AbsoluteFill>
  );
};

export const FactorChips: React.FC<P & { title?: string; chips?: { text: string; at?: number }[] }> = ({ bed, title = "", chips = [] }) => {
  const f = useCurrentFrame();
  const pos = [[26, 44], [60, 36], [80, 58], [38, 70], [66, 80], [18, 82]];
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", opacity: inA(f, 2, 10) }}>
        <span style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 96, color: C.ink, background: "rgba(251,247,238,0.94)", padding: "6px 40px", borderRadius: 18 }}>{title}</span>
      </div>
      {chips.map((c, i) => { const s = atF(c.at, i, 16, 22); const a = interpolate(f, [s, s + 10], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) }); const [x, y] = pos[i % pos.length]; return (
        <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) scale(${a.toFixed(3)}) translateY(${(Math.sin((f + i * 17) / 22) * 8).toFixed(1)}px)`, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 74, color: i === 3 ? "#fff" : C.ink, background: i === 3 ? C.amber : C.paper, border: `4px solid ${i === 3 ? C.amber : C.teal}`, borderRadius: 60, padding: "16px 50px", boxShadow: "0 24px 50px rgba(0,0,0,0.22)" }}>{c.text}</div>); })}
      {chips.map((c, i) => <Sfx key={i} at={atF(c.at, i, 16, 22)} src="chip_pop3d.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

export const MythFlip: React.FC<P & { myth?: string; truth?: string; flipAt?: number }> = ({ bed, myth = "", truth = "", flipAt }) => {
  const f = useCurrentFrame();
  const s = typeof flipAt === "number" ? Math.round(flipAt * 30) : 45;
  const rot = interpolate(f, [s, s + 16], [0, 180], { ...cl, easing: ease });
  const strike = inA(f, s - 14, 10);
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", left: "50%", top: "52%", width: 1300, height: 640, marginLeft: -650, marginTop: -320, perspective: 2200, opacity: inA(f, 0, 10) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${rot.toFixed(1)}deg) translateY(${(Math.sin(f / 25) * 5).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 34, background: C.paper, border: `3px solid ${C.line}`, boxShadow: "0 40px 90px rgba(0,0,0,0.25)", padding: 70, boxSizing: "border-box" }}>
            <div style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 56, color: C.danger, letterSpacing: 6 }}>MITO</div>
            <div style={{ position: "relative", fontFamily: F_OSWALD, fontWeight: 700, fontSize: 96, color: C.ink, lineHeight: 1.05, marginTop: 40 }}>
              «{myth}»
            </div>
            <div style={{ position: "absolute", right: 70, bottom: 60, fontFamily: F_OSWALD, fontWeight: 800, fontSize: 90, color: C.danger, border: `8px solid ${C.danger}`, borderRadius: 14, padding: "0 28px", transform: `rotate(-10deg) scale(${(2 - strike).toFixed(3)})`, opacity: strike }}>FALSO</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 34, background: "#fff", borderLeft: `26px solid ${C.teal}`, boxShadow: "0 40px 90px rgba(0,0,0,0.25)", padding: 70, boxSizing: "border-box" }}>
            <div style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 56, color: C.tealD, letterSpacing: 6 }}>LA VERDAD</div>
            <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 92, color: C.ink, lineHeight: 1.06, marginTop: 40 }}>{truth}</div>
          </div>
        </div>
      </div>
      <Sfx at={s - 14} src="sfx_text_thud.mp3" vol={0.3} /><Sfx at={s} src="sfx_trans2.mp3" vol={0.3} />
    </AbsoluteFill>
  );
};

export const RemedyBoard: React.FC<P & { title?: string; cards?: { name: string; verdict: string; image?: string; at?: number }[] }> = ({ bed, title = "", cards = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", opacity: inA(f, 2, 10) }}>
        <span style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 84, color: C.ink, background: "rgba(251,247,238,0.94)", padding: "6px 36px", borderRadius: 16 }}>{title}</span>
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
        {cards.map((c, i) => { const a = inA(f, 4 + i * 6, 12); const st = atF(c.at, i, 30, 30); const b = interpolate(f, [st, st + 8], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) }); const bad = !/prueba/i.test(c.verdict); return (
          <div key={i} style={{ width: 400, background: "#fff", borderRadius: 24, padding: 18, boxShadow: "0 30px 70px rgba(0,0,0,0.22)", opacity: a, transform: `translateY(${((1 - a) * 90 + Math.sin((f + i * 15) / 24) * 6).toFixed(1)}px) rotate(${[-2, 1.5, -1, 2][i % 4]}deg)` }}>
            <div style={{ height: 380, borderRadius: 16, overflow: "hidden", background: C.paper2, position: "relative" }}>
              {c.image && !isVid(c.image) ? <Img src={staticFile(c.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) rotate(-12deg) scale(${(2.2 - 1.2 * b).toFixed(3)})`, opacity: b, fontFamily: F_OSWALD, fontWeight: 800, fontSize: c.verdict.length > 12 ? 40 : 64, color: bad ? C.danger : C.amber, border: `7px solid ${bad ? C.danger : C.amber}`, background: "rgba(255,255,255,0.9)", borderRadius: 12, padding: "4px 18px", whiteSpace: "nowrap" }}>{c.verdict.toUpperCase()}</div>
            </div>
            <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 52, color: C.ink, textAlign: "center", marginTop: 14 }}>{c.name}</div>
          </div>); })}
      </div>
      {cards.map((c, i) => <Sfx key={i} at={atF(c.at, i, 30, 30)} src="sfx_text_thud.mp3" vol={0.28} />)}
    </AbsoluteFill>
  );
};

export const MethodsTrio: React.FC<P & { title?: string; methods?: { name: string; desc: string; icon: string; at?: number }[] }> = ({ bed, title = "", methods = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1720} h={780}>
        <div style={{ textAlign: "center" }}><Kicker o={inA(f, 4)}>Con el médico</Kicker><Wordy text={title} start={6} size={84} /></div>
        <div style={{ display: "flex", justifyContent: "center", gap: 44, marginTop: 50 }}>
          {methods.map((m, i) => { const s = atF(m.at, i, 18, 26); const a = inA(f, s, 10); return (
            <div key={i} style={{ width: 470, height: 440, background: "#fff", borderRadius: 26, border: `3px solid ${a > 0.5 ? C.teal : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.25 + 0.75 * a, transform: `translateY(${((1 - a) * 40).toFixed(1)}px) scale(${(0.94 + 0.06 * a).toFixed(3)})` }}>
              <div style={{ width: 190, height: 190, borderRadius: "50%", background: "#E2F4F3", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${((1 - a) * -40).toFixed(1)}deg)` }}><Icon k={m.icon} color={C.tealD} size={130} /></div>
              <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: m.name.length > 14 ? 50 : 60, color: C.ink, marginTop: 24 }}>{m.name}</div>
              <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: 36, color: C.ink2, marginTop: 6 }}>{m.desc}</div>
            </div>); })}
        </div>
      </Card>
      {methods.map((m, i) => <Sfx key={i} at={atF(m.at, i, 18, 26)} src="node_pop.mp3" vol={0.25} />)}
    </AbsoluteFill>
  );
};

export const QuestionCards: React.FC<P & { title?: string; questions?: { text: string; at?: number }[] }> = ({ bed, title = "", questions = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <div style={{ position: "absolute", left: 140, top: 130, opacity: inA(f, 2, 10) }}>
        <Kicker color={C.tealD}>Para tu consulta</Kicker>
        <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 90, color: C.ink, background: "rgba(251,247,238,0.92)", padding: "4px 24px", borderRadius: 14, marginTop: 8 }}>{title}</div>
      </div>
      {questions.map((q, i) => { const s = atF(q.at, i, 16, 40); const a = interpolate(f, [s, s + 12], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) }); return (
        <div key={i} style={{ position: "absolute", left: 200 + i * 170, top: 420 + i * 190, opacity: Math.min(1, a), transform: `scale(${(0.7 + 0.3 * a).toFixed(3)}) translateY(${(Math.sin((f + i * 20) / 26) * 5).toFixed(1)}px)`, transformOrigin: "left center" }}>
          <div style={{ position: "relative", background: "#fff", borderRadius: 30, padding: "30px 46px", boxShadow: "0 30px 60px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.teal, color: "#fff", fontFamily: F_OSWALD, fontWeight: 700, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 56, color: C.ink }}>{q.text}</div>
            <div style={{ position: "absolute", left: 40, bottom: -26, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "30px solid #fff" }} />
          </div>
        </div>); })}
      {questions.map((q, i) => <Sfx key={i} at={atF(q.at, i, 16, 40)} src="px_bubble.mp3" vol={0.28} />)}
    </AbsoluteFill>
  );
};

export const StepsPaper: React.FC<P & { kicker?: string; title?: string; steps?: { title: string; sub?: string; at?: number }[] }> = ({ bed, kicker = "", title = "", steps = [] }) => {
  const f = useCurrentFrame();
  const cols = steps.length > 2 ? 2 : steps.length;
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1640} h={steps.length > 2 ? 860 : 640}>
        <Kicker color={C.green} o={inA(f, 4)}>{kicker}</Kicker>
        <Wordy text={title} start={6} size={82} />
        <Underline p={inA(f, 14, 14)} color={C.green} w={320} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 28, marginTop: 40 }}>
          {steps.map((s, i) => { const st = atF(s.at, i, 20, 22); const a = inA(f, st, 10); const chk = inA(f, st + 8, 8); return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, background: "#fff", borderRadius: 20, padding: "22px 28px", border: `3px solid ${C.line}`, opacity: a, transform: `translateY(${((1 - a) * 40).toFixed(1)}px)` }}>
              <div style={{ width: 80, height: 80, flex: "0 0 80px", borderRadius: 18, background: C.green, color: "#fff", fontFamily: F_OSWALD, fontWeight: 700, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>{chk > 0.5 ? "✓" : i + 1}</div>
              <div><div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 58, color: C.ink, lineHeight: 1 }}>{s.title}</div>{s.sub ? <div style={{ fontFamily: F_INTER, fontWeight: 600, fontSize: 32, color: C.ink2, marginTop: 6 }}>{s.sub}</div> : null}</div>
            </div>); })}
        </div>
      </Card>
      {steps.map((s, i) => <Sfx key={i} at={atF(s.at, i, 20, 22)} src="sfx_paper_tick.mp3" vol={0.3} />)}
    </AbsoluteFill>
  );
};

export const PhotoMonth: React.FC<P & { title?: string; steps?: { text: string; at?: number }[] }> = ({ bed, title = "", steps = [] }) => {
  const f = useCurrentFrame();
  const S = steps.map((s, i) => atF(s.at, i, 20, 40));
  const flash = S.length > 3 ? interpolate(f, [S[3] + 6, S[3] + 8, S[3] + 16], [0, 0.9, 0], cl) : 0;
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"];
  return (
    <AbsoluteFill>
      <Bed src={bed} />
      <Card w={1740} h={900}>
        <div style={{ display: "flex", gap: 60, height: "100%" }}>
          <div style={{ position: "relative", width: 440, height: 780, borderRadius: 60, background: "#1D2A2E", padding: 22, boxSizing: "border-box", transform: `rotate(${(-3 + Math.sin(f / 40)).toFixed(2)}deg)`, opacity: inA(f, 4, 12) }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", position: "relative", background: C.paper2 }}>
              {bed && !isVid(bed) ? <Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.3 + 0.1 * inA(f, S[3] ?? 60, 20)).toFixed(3)})` }} /> : null}
              <div style={{ position: "absolute", left: "50%", top: "46%", width: 110, height: 110, marginLeft: -55, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #F4F4F4, #B9B9B9 70%, #8C8C8C)", border: "4px solid #9A9A9A", opacity: S.length > 2 ? inA(f, S[2], 10) : 0 }} />
              <div style={{ position: "absolute", inset: 0, border: "3px dashed rgba(255,255,255,0.8)", margin: 40, borderRadius: 20 }} />
              <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Kicker o={inA(f, 6)}>Cinco minutos al mes</Kicker>
            <Wordy text={title} start={8} size={96} />
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
              {steps.map((s, i) => { const a = inA(f, S[i], 10); return <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", opacity: a, transform: `translateX(${((1 - a) * 40).toFixed(1)}px)` }}><div style={{ width: 20, height: 20, borderRadius: "50%", background: C.teal }} /><div style={{ fontFamily: F_INTER, fontWeight: 800, fontSize: 46, color: C.ink }}>{s.text}</div></div>; })}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
              {months.map((m, i) => { const a = inA(f, 30 + i * 8, 8); return <div key={i} style={{ width: 150, opacity: a, transform: `translateY(${((1 - a) * 20).toFixed(1)}px)` }}><div style={{ height: 110, borderRadius: 12, overflow: "hidden", background: C.paper2, border: "3px solid #fff", boxShadow: "0 8px 18px rgba(0,0,0,0.15)" }}>{bed && !isVid(bed) ? <Img src={staticFile(bed)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.4)" }} /> : null}</div><div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 28, color: C.tealD, textAlign: "center", marginTop: 4 }}>{m}</div></div>; })}
            </div>
          </div>
        </div>
      </Card>
      {S.length > 3 ? <Sfx at={S[3] + 6} src="universfield-camera-shutter-199580.mp3" vol={0.35} /> : null}
      {S.map((s, i) => <Sfx key={i} at={s} src="sfx_paper_tick.mp3" vol={0.2} />)}
    </AbsoluteFill>
  );
};

export const GuideCTA: React.FC<P & { kicker?: string; title?: string; sub?: string; cover?: string; qr?: string; domain?: string }> = ({ bed, kicker = "", title = "", sub = "", cover, qr, domain = "" }) => {
  const f = useCurrentFrame();
  const c = inA(f, 2, 16), q = inA(f, 12, 14);
  return (
    <AbsoluteFill>
      <Bed src={bed} veil={0.45} />
      <Sfx at={2} src="sfx_whoosh_soft.mp3" /><Sfx at={12} src="layer_drop.mp3" vol={0.3} />
      <div style={{ position: "absolute", left: 130, top: 150, width: 560, transform: `perspective(1600px) rotateY(${(18 - 8 * c + Math.sin(f / 40) * 2).toFixed(2)}deg) translateY(${((1 - c) * 80).toFixed(1)}px)`, opacity: c, boxShadow: "30px 40px 80px rgba(0,0,0,0.35)" }}>
        {cover ? <Img src={staticFile(cover)} style={{ width: "100%", display: "block", borderRadius: 8 }} /> : null}
      </div>
      <Card w={1060} h={780} x={66} y={50} delay={6}>
        <Kicker color={C.amber} o={inA(f, 10)}>{kicker}</Kicker>
        <Title size={70} o={inA(f, 12)}>{title}</Title>
        <div style={{ display: "flex", gap: 40, marginTop: 34, alignItems: "center" }}>
          <div style={{ width: 400, height: 400, background: "#fff", borderRadius: 18, padding: 18, boxSizing: "border-box", boxShadow: "0 12px 30px rgba(0,0,0,0.18)", transform: `scale(${(0.85 + 0.15 * q).toFixed(3)})`, opacity: q }}>
            {qr ? <Img src={staticFile(qr)} style={{ width: "100%", height: "100%", imageRendering: "pixelated" }} /> : null}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 38, lineHeight: 1.25, color: C.ink, opacity: inA(f, 20, 12) }}>{sub}</div>
            <div style={{ marginTop: 28, fontFamily: F_OSWALD, fontWeight: 700, fontSize: 64, color: "#fff", background: C.tealD, borderRadius: 14, padding: "8px 24px", display: "inline-block", opacity: inA(f, 26, 12) }}>{domain}</div>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
