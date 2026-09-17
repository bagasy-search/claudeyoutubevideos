// Kit.tsx — componentes del video `famarioneta` (Federer Archivos · boca caída y líneas de marioneta).
// LOOK: tarjetas CLARAS de papel clínico (crema, tinta oscura, teal/verde + ámbar; rojo SÓLO alarma/error)
// sobre footage luminoso. Varias capas: cama (foto con Ken-Burns) + velo crema suave + tarjeta que flota +
// tipografía cinética + acento + SFX. Todo determinista (frame-based). ⛔ Nada de <Video>.
// Todos aceptan `ov` (overlay: sin cama ni velo, tarjeta en un costado) y `hits` (s relativos al inicio,
// calculados por el plan contra el mapa de palabras; la compuerta falla si caen fuera del componente).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { F_INTER, F_PLAYFAIR } from "../_fed6/VideoEdit/kit/premium/theme";

export const C = {
  paper: "#FBF7EE", cream: "#F4EEDD", ink: "#15302B", inkSoft: "#4B5E58", teal: "#12B3AE", green: "#1F4D3F",
  amber: "#E0A526", amberSoft: "#FBEBC4", red: "#D0453A", redSoft: "#F8DAD5", line: "#E3DAC6", okSoft: "#D6F1EE",
};
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Base = { durationInFrames: number; bed?: string; ov?: boolean; hits?: number[]; sfx?: boolean };

const hitF = (hits: number[] | undefined, i: number, n: number, dur: number, lead = 0.12) => {
  if (hits && hits[i] !== undefined) return Math.max(0, Math.round(hits[i] * FPS));
  return Math.round(lead * dur + ((dur * (0.8 - lead)) / Math.max(1, n)) * i);
};
const useSpr = (from: number, cfg = { damping: 16, stiffness: 120, mass: 0.8 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: cfg });
};

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.32 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${src}`)} volume={vol} />
  </Sequence>
);
const S_POP = "sfx_pop.mp3", S_WHOOSH = "sfx_whoosh_soft.mp3", S_TICK = "sfx_paper_tick.mp3", S_THUD = "sfx_text_thud.mp3", S_CHIME = "sfx_chime.mp3", S_STING = "stinger_hit.mp3";

// ── CAMA: foto con Ken-Burns lento + velo crema (profundidad sin oscurecer)
const Bed: React.FC<{ src?: string; veil?: number; seed?: number }> = ({ src, veil = 0.55, seed = 1 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], clamp);
  const dir = seed % 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, overflow: "hidden" }}>
      {src ? <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.06 * k}) translateX(${dir * 1.2 * k}%)` }} /> : null}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(251,247,238,${veil}) 0%, rgba(244,238,221,${Math.min(0.92, veil + 0.18)}) 100%)` }} />
    </AbsoluteFill>
  );
};

// tarjeta de papel que flota (nunca quieta)
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; enter?: number; tilt?: number }> = ({ children, style, enter = 0, tilt = 0 }) => {
  const f = useCurrentFrame();
  const s = useSpr(enter);
  const fy = Math.sin((f + enter) / 38) * 5;
  const rot = tilt + Math.sin((f + enter) / 55) * 0.35;
  return (
    <div style={{
      background: C.paper, borderRadius: 30, boxShadow: "0 30px 70px rgba(21,48,43,0.22), 0 4px 12px rgba(21,48,43,0.10)",
      border: `2px solid ${C.line}`, opacity: s, transform: `translateY(${(1 - s) * 60 + fy}px) rotate(${rot}deg) scale(${0.94 + 0.06 * s})`,
      fontFamily: F_INTER, color: C.ink, ...style,
    }}>{children}</div>
  );
};
const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.teal }) => (
  <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color }}>{children}</div>
);
const Rule: React.FC<{ at?: number; color?: string; w?: number }> = ({ at = 6, color = C.amber, w = 220 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ height: 8, width: w * k, background: color, borderRadius: 4, margin: "14px 0 18px" }} />;
};
const Full: React.FC<{ bed?: string; ov?: boolean; children: React.ReactNode; veil?: number; seed?: number }> = ({ bed, ov, children, veil, seed }) =>
  ov ? <AbsoluteFill>{children}</AbsoluteFill> : (
    <AbsoluteFill>
      <Bed src={bed} veil={veil} seed={seed} />
      {children}
    </AbsoluteFill>
  );
const CheckIcon: React.FC<{ k: number; ok?: boolean; size?: number }> = ({ k, ok = true, size = 58 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ flex: "none" }}>
    <circle cx="30" cy="30" r="27" fill={ok ? C.teal : C.red} opacity={0.15 + 0.85 * k} />
    {ok ? <path d="M17 31 L26 40 L44 21" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - k)} />
      : <g stroke="#fff" strokeWidth="6" strokeLinecap="round"><line x1="20" y1="20" x2={20 + 20 * k} y2={20 + 20 * k} /><line x1="40" y1="20" x2={40 - 20 * k} y2={20 + 20 * k} /></g>}
  </svg>
);

// ═════════════════════════════ 1. ANTES / DESPUÉS (ilustración)
export const FmBeforeAfter: React.FC<Base & { left: string; right: string; labelL: string; labelR: string; chip: string; big?: boolean }> = ({ durationInFrames: d, left, right, labelL, labelR, chip, big }) => {
  const f = useCurrentFrame();
  const wipe = interpolate(f, [6, 26], [0, 50], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const kb = 1.04 + 0.05 * (f / Math.max(1, d));
  const chipS = useSpr(big ? 4 : 16);
  const pulse = big ? 1 + 0.04 * Math.sin(f / 5) : 1;
  const Side: React.FC<{ src: string; label: string; right?: boolean }> = ({ src, label, right: r }) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: r ? "50%" : 0, width: "50%", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})`, transformOrigin: r ? "40% 45%" : "60% 45%" }} />
      <div style={{ position: "absolute", bottom: 60, left: r ? undefined : 60, right: r ? 60 : undefined, background: r ? C.teal : C.paper, color: r ? "#fff" : C.ink, fontFamily: F_INTER, fontWeight: 800, fontSize: 52, padding: "14px 34px", borderRadius: 18, boxShadow: "0 12px 30px rgba(0,0,0,.18)" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <Side src={left} label={labelL} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${100 - wipe}%)` }}><Side src={right} label={labelR} right /></div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${100 - wipe}%`, width: 10, marginLeft: -5, background: C.paper, boxShadow: "0 0 24px rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", top: 56, left: "50%", transform: `translateX(-50%) scale(${(0.8 + 0.2 * chipS) * pulse})`, opacity: chipS, background: C.amber, color: C.ink, fontFamily: F_INTER, fontWeight: 900, fontSize: big ? 58 : 40, letterSpacing: 3, textTransform: "uppercase", padding: big ? "18px 44px" : "12px 32px", borderRadius: 999, boxShadow: "0 14px 34px rgba(0,0,0,.2)", whiteSpace: "nowrap" }}>{chip}</div>
      <Sfx at={6} src={S_WHOOSH} />
      {big ? <Sfx at={4} src={S_THUD} /> : null}
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2. RUTINA con reloj compartido
export const FmRoutine: React.FC<Base & { title: string; steps: { t: string; d: string }[]; active: number }> = ({ durationInFrames: d, bed, hits, title, steps, active }) => {
  const f = useCurrentFrame();
  const intro = active === 0;
  const onAt = (i: number) => (intro ? Math.round(((hits && hits[1] !== undefined ? hits[1] : 1.5) + 0.2 + i * 0.45) * FPS) : 8 + i * 5);
  const curMin = intro ? interpolate(f, [onAt(0), d - 6], [0, 5], clamp) : interpolate(f, [0, d], [active - 1, Math.min(5, active)], clamp);
  const ring = (curMin / 5) * 2 * Math.PI * 150;
  const mm = Math.floor(curMin), ss = Math.floor((curMin - mm) * 60);
  return (
    <Full bed={bed} veil={0.72} seed={active + 3}>
      <AbsoluteFill style={{ padding: "90px 110px", flexDirection: "row", alignItems: "center", gap: 90 }}>
        <Card style={{ width: 560, height: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} enter={0} tilt={-1.2}>
          <Kicker>{title}</Kicker>
          <svg width="380" height="380" viewBox="0 0 380 380" style={{ marginTop: 26 }}>
            <circle cx="190" cy="190" r="150" stroke={C.line} strokeWidth="26" fill="none" />
            <circle cx="190" cy="190" r="150" stroke={C.teal} strokeWidth="26" fill="none" strokeLinecap="round" strokeDasharray={`${ring} 2000`} transform="rotate(-90 190 190)" />
            <rect x="170" y="8" width="40" height="22" rx="6" fill={C.green} />
            <text x="190" y="215" textAnchor="middle" fontFamily={F_INTER} fontWeight={900} fontSize="96" fill={C.ink}>{`${mm}:${String(ss).padStart(2, "0")}`}</text>
          </svg>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.inkSoft, marginTop: 16 }}>1 minuto por ejercicio</div>
        </Card>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
          {steps.map((s, i) => {
            const on = intro ? onAt(i) : 4 + i * 3;
            const k = spring({ frame: f - on, fps: FPS, config: { damping: 15, stiffness: 130 } });
            const isAct = !intro ? i === active - 1 : curMin >= i && curMin < i + 1;
            const done = !intro && i < active - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, background: isAct ? C.teal : C.paper, color: isAct ? "#fff" : C.ink, borderRadius: 24, padding: "20px 30px", border: `2px solid ${isAct ? C.teal : C.line}`, boxShadow: isAct ? "0 20px 40px rgba(18,179,174,.35)" : "0 10px 24px rgba(21,48,43,.10)", opacity: k, transform: `translateX(${(1 - k) * 80}px) scale(${isAct ? 1.04 : 1})`, fontFamily: F_INTER }}>
                <div style={{ width: 76, height: 76, borderRadius: 38, background: isAct ? "#fff" : done ? C.teal : C.green, color: isAct ? C.teal : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900, flex: "none" }}>{done ? "✓" : i + 1}</div>
                <div style={{ fontSize: 50, fontWeight: 800, flex: 1 }}>{s.t}</div>
                <div style={{ fontSize: 36, fontWeight: 700, background: isAct ? "rgba(255,255,255,.2)" : C.amberSoft, color: isAct ? "#fff" : C.ink, padding: "8px 18px", borderRadius: 14, whiteSpace: "nowrap" }}>{s.d}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {steps.map((_, i) => <Sfx key={i} at={intro ? onAt(i) : 4 + i * 3} src={S_TICK} vol={0.25} />)}
    </Full>
  );
};

// ═════════════════════════════ 3. TARJETA DE PASO (overlay)
export const FmStepCard: React.FC<Base & { n: number; title: string; dose: string }> = ({ n, title, dose }) => {
  const f = useCurrentFrame();
  const s = useSpr(2);
  const pulse = 1 + 0.03 * Math.sin(f / 8);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 80px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, background: C.paper, borderRadius: 28, padding: "24px 40px 24px 24px", boxShadow: "0 24px 60px rgba(0,0,0,.25)", opacity: s, transform: `translateX(${(1 - s) * -120}px)`, fontFamily: F_INTER, maxWidth: 1100 }}>
        <div style={{ width: 128, height: 128, borderRadius: 64, background: C.teal, color: "#fff", fontSize: 80, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pulse})`, flex: "none" }}>{n}</div>
        <div>
          <div style={{ fontSize: 58, fontWeight: 900, color: C.ink, lineHeight: 1.05 }}>{title}</div>
          <div style={{ marginTop: 10, display: "inline-block", fontSize: 36, fontWeight: 700, color: C.ink, background: C.amberSoft, padding: "6px 18px", borderRadius: 12 }}>{dose}</div>
        </div>
      </div>
      <Sfx at={2} src={S_POP} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 4. LOS 3 LOOPS (candados)
export const FmLoops: React.FC<Base & { title: string; items: string[] }> = ({ durationInFrames: d, bed, hits, title, items }) => {
  const f = useCurrentFrame();
  return (
    <Full bed={bed} veil={0.7} seed={4}>
      <AbsoluteFill style={{ padding: "110px 120px", alignItems: "center" }}>
        <div style={{ fontFamily: F_INTER, fontSize: 70, fontWeight: 900, color: C.ink, opacity: useSpr(0) }}>{title}</div>
        <Rule at={6} />
        <div style={{ display: "flex", gap: 44, marginTop: 40 }}>
          {items.map((t, i) => {
            const on = 10 + i * 12;
            const open = hits ? Math.round((hits[i] ?? 99) * FPS) : 9999;
            const u = interpolate(f, [open, open + 10], [0, 1], clamp);
            return (
              <Card key={i} enter={on} tilt={[-1.5, 0.8, 1.6][i]} style={{ width: 500, height: 480, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: u > 0.5 ? C.paper : C.paper, border: `3px solid ${u > 0.5 ? C.teal : C.line}` }}>
                <svg width="120" height="140" viewBox="0 0 120 140">
                  <path d={`M30 60 V40 a30 30 0 0 1 60 0 ${u > 0.5 ? "V20" : "V60"}`} transform={u > 0.5 ? `translate(0 ${-14 * u})` : undefined} stroke={u > 0.5 ? C.teal : C.green} strokeWidth="12" fill="none" />
                  <rect x="14" y="60" width="92" height="72" rx="14" fill={u > 0.5 ? C.teal : C.green} />
                  <circle cx="60" cy="96" r="10" fill="#fff" />
                </svg>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.amber, marginTop: 20, letterSpacing: 3 }}>{`NÚMERO ${i + 1}`}</div>
                <div style={{ fontSize: 48, fontWeight: 800, textAlign: "center", marginTop: 12, lineHeight: 1.1 }}>{t}</div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
      {items.map((_, i) => <Sfx key={i} at={10 + i * 12} src={S_TICK} vol={0.22} />)}
    </Full>
  );
};

// ═════════════════════════════ 5. NÚMERO GRANDE (full u overlay)
export const FmBigNumber: React.FC<Base & { value: string; unit: string; caption: string; tone?: string }> = ({ bed, ov, value, unit, caption, tone }) => {
  const f = useCurrentFrame();
  const s = useSpr(3, { damping: 11, stiffness: 150, mass: 0.7 });
  const col = tone === "amber" ? C.amber : tone === "red" ? C.red : C.teal;
  const body = (
    <Card enter={0} style={{ padding: ov ? "40px 60px" : "60px 90px", textAlign: "center", minWidth: ov ? 620 : 900 }} tilt={-0.8}>
      <div style={{ fontSize: ov ? 170 : 240, fontWeight: 900, color: col, lineHeight: 1, transform: `scale(${0.6 + 0.4 * s})` }}>{value}</div>
      <div style={{ fontSize: ov ? 56 : 70, fontWeight: 800, color: C.ink, marginTop: 6 }}>{unit}</div>
      <div style={{ height: 6, width: 160 * interpolate(f, [10, 24], [0, 1], clamp), background: C.amber, margin: "18px auto", borderRadius: 3 }} />
      <div style={{ fontSize: ov ? 40 : 50, fontWeight: 600, color: C.inkSoft }}>{caption}</div>
    </Card>
  );
  return (
    <Full bed={bed} ov={ov} veil={0.66} seed={5}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: "center", padding: ov ? "0 90px" : 0 }}>{body}</AbsoluteFill>
      <Sfx at={3} src={S_THUD} />
    </Full>
  );
};

// ═════════════════════════════ 6. NAME TAG (overlay)
export const FmNameTag: React.FC<Base & { name: string; role: string }> = ({ durationInFrames: d, name, role }) => {
  const f = useCurrentFrame();
  const s = useSpr(4);
  const out = interpolate(f, [d - 10, d], [1, 0], clamp);
  const bar = interpolate(f, [4, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 0 90px 90px", opacity: out }}>
      <div style={{ display: "flex", alignItems: "stretch", fontFamily: F_INTER, transform: `translateX(${(1 - s) * -80}px)`, opacity: s }}>
        <div style={{ width: 14, background: C.teal, borderRadius: 7, transform: `scaleY(${bar})` }} />
        <div style={{ background: "rgba(251,247,238,0.96)", padding: "20px 40px", borderRadius: "0 22px 22px 0", boxShadow: "0 18px 40px rgba(0,0,0,.22)" }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: C.ink }}>{name}</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: C.teal, marginTop: 4 }}>{role}</div>
        </div>
      </div>
      <Sfx at={4} src={S_WHOOSH} vol={0.25} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 7. SÍ HACE / NO HACE
export const FmDoesDoesnt: React.FC<Base & { yes: string[]; no: string[] }> = ({ durationInFrames: d, bed, hits, yes, no }) => {
  const f = useCurrentFrame();
  const n = yes.length + no.length;
  const Col: React.FC<{ title: string; list: string[]; ok: boolean; off: number; tilt: number }> = ({ title, list, ok, off, tilt }) => (
    <Card enter={ok ? 0 : Math.max(0, hitF(hits, off, n, d) - 12)} tilt={tilt} style={{ flex: 1, padding: "44px 50px", borderTop: `14px solid ${ok ? C.teal : C.red}` }}>
      <div style={{ fontSize: 60, fontWeight: 900, color: ok ? C.teal : C.red }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 30 }}>
        {list.map((t, i) => {
          const at = hitF(hits, off + i, n, d);
          const k = interpolate(f, [at, at + 12], [0, 1], clamp);
          return (
            <div key={i} style={{ display: "flex", gap: 22, alignItems: "center", opacity: 0.15 + 0.85 * k, transform: `translateX(${(1 - k) * 30}px)` }}>
              <CheckIcon k={k} ok={ok} />
              <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.15 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
  return (
    <Full bed={bed} veil={0.7} seed={7}>
      <AbsoluteFill style={{ flexDirection: "row", gap: 60, padding: "110px 110px", alignItems: "center" }}>
        <Col title="Lo que SÍ hace" list={yes} ok off={0} tilt={-1} />
        <Col title="Lo que NO hace" list={no} ok={false} off={yes.length} tilt={1} />
      </AbsoluteFill>
      {Array.from({ length: n }).map((_, i) => <Sfx key={i} at={hitF(hits, i, n, d)} src={S_TICK} vol={0.22} />)}
    </Full>
  );
};

// ═════════════════════════════ 8. CITA (full) y CITA MINI (overlay)
export const FmQuote: React.FC<Base & { quote: string; who: string }> = ({ bed, quote, who }) => {
  const f = useCurrentFrame();
  const words = quote.split(" ");
  return (
    <Full bed={bed} veil={0.62} seed={8}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Card enter={0} tilt={-0.6} style={{ padding: "70px 100px", maxWidth: 1500, position: "relative" }}>
          <div style={{ position: "absolute", top: -70, left: 50, fontFamily: F_PLAYFAIR, fontSize: 280, color: C.amber, lineHeight: 1 }}>“</div>
          <div style={{ fontFamily: F_PLAYFAIR, fontSize: 92, fontWeight: 700, lineHeight: 1.15, color: C.ink }}>
            {words.map((w, i) => { const k = interpolate(f, [6 + i * 3, 14 + i * 3], [0, 1], clamp); return <span key={i} style={{ opacity: k, display: "inline-block", transform: `translateY(${(1 - k) * 18}px)`, marginRight: 22 }}>{w}</span>; })}
          </div>
          <div style={{ marginTop: 34, fontSize: 42, fontWeight: 700, color: C.teal, opacity: interpolate(f, [20 + words.length * 3, 32 + words.length * 3], [0, 1], clamp) }}>— {who}</div>
        </Card>
      </AbsoluteFill>
      <Sfx at={4} src={S_WHOOSH} vol={0.22} />
    </Full>
  );
};
export const FmQuoteMini: React.FC<Base & { quote: string }> = ({ durationInFrames: d, quote }) => {
  const f = useCurrentFrame();
  const s = useSpr(4);
  const out = interpolate(f, [d - 8, d], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90, opacity: out }}>
      <div style={{ background: C.paper, borderRadius: 26, padding: "28px 56px", boxShadow: "0 22px 50px rgba(0,0,0,.25)", borderLeft: `14px solid ${C.amber}`, fontFamily: F_PLAYFAIR, fontSize: 66, fontWeight: 700, color: C.ink, opacity: s, transform: `translateY(${(1 - s) * 50 + Math.sin(f / 30) * 3}px)`, maxWidth: 1500 }}>«{quote}»</div>
      <Sfx at={4} src={S_POP} vol={0.25} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 9. LAS 3 CAUSAS
export const FmCauses: React.FC<Base & { title: string; items: { t: string; s: string }[]; state: number }> = ({ durationInFrames: d, bed, hits, title, items, state }) => {
  const f = useCurrentFrame();
  const icons = ["M20 70 Q60 20 100 70 Q60 110 20 70 Z", "M30 30 L90 30 L60 95 Z", "M25 60 h70 M25 45 h70 M25 75 h70"];
  return (
    <Full bed={bed} veil={0.7} seed={9}>
      <AbsoluteFill style={{ padding: "100px 110px", alignItems: "center" }}>
        <div style={{ fontFamily: F_INTER, fontSize: 70, fontWeight: 900, color: C.ink, opacity: useSpr(0) }}>{title}</div>
        <Rule at={6} />
        <div style={{ display: "flex", gap: 44, marginTop: 30 }}>
          {items.map((it, i) => {
            const on = state === 0 ? 8 + i * 10 : 0;
            const stamp = state === 1 ? hitF(hits, i === 0 ? 0 : 1, 2, d) + (i === 2 ? 8 : 0) : 99999;
            const sk = spring({ frame: f - stamp, fps: FPS, config: { damping: 10, stiffness: 180 } });
            const dead = state === 1 && i === 0;
            return (
              <Card key={i} enter={on} tilt={[-1.4, 0.6, 1.4][i]} style={{ width: 500, height: 520, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", filter: dead && sk > 0.5 ? "grayscale(0.7)" : undefined }}>
                <div style={{ width: 150, height: 150, borderRadius: 75, background: i === 0 ? C.amberSoft : C.okSoft, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120"><path d={icons[i]} stroke={i === 0 ? C.amber : C.teal} strokeWidth="10" fill="none" strokeLinecap="round" /></svg>
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.amber, marginTop: 26, letterSpacing: 3 }}>{`${i + 1}`}</div>
                <div style={{ fontSize: 60, fontWeight: 900, marginTop: 6 }}>{it.t}</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: C.inkSoft, textAlign: "center", marginTop: 12 }}>{it.s}</div>
                {state === 1 ? (
                  <div style={{ position: "absolute", top: 22, right: 18, transform: `rotate(8deg) scale(${1.6 - 0.6 * sk})`, opacity: sk, border: `6px solid ${dead ? C.red : C.teal}`, color: dead ? C.red : C.teal, fontSize: 40, fontWeight: 900, padding: "8px 22px", borderRadius: 12, letterSpacing: 2 }}>{dead ? "NO SE TOCA" : "SE TRABAJA"}</div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
      {state === 0 ? items.map((_, i) => <Sfx key={i} at={8 + i * 10} src={S_TICK} vol={0.22} />) : [0, 1, 2].map((i) => <Sfx key={i} at={hitF(hits, i === 0 ? 0 : 1, 2, d) + (i === 2 ? 8 : 0)} src={S_THUD} vol={0.25} />)}
    </Full>
  );
};

// ═════════════════════════════ 10. CARA (diagrama SVG del mecanismo)
export const FmFace: React.FC<Base & { mode: string; title: string; label: string }> = ({ durationInFrames: d, bed, hits, mode, title, label }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [0, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const h0 = hitF(hits, 0, 2, d, 0.2), h1 = hitF(hits, 1, 2, d, 0.2);
  const k0 = interpolate(f, [h0, h0 + 14], [0, 1], clamp), k1 = interpolate(f, [h1, h1 + 14], [0, 1], clamp);
  const pulse = 0.75 + 0.25 * Math.sin(f / 6);
  const perfil = mode === "lengua";
  const face = perfil ? (
    <g stroke={C.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - draw)}>
      <path d="M300 90 C420 80 470 180 460 260 L500 320 L462 336 C470 360 468 380 452 392 C470 410 462 440 440 450 C446 500 420 540 360 540 L330 620" />
      <path d="M300 90 C200 100 170 220 190 330 C200 400 240 470 330 520" />
    </g>
  ) : (
    <g stroke={C.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="2400" strokeDashoffset={2400 * (1 - draw)}>
      <path d="M300 70 C170 70 120 190 130 320 C140 450 210 560 300 580 C390 560 460 450 470 320 C480 190 430 70 300 70 Z" />
      <path d="M220 250 q30 -18 60 0 M320 250 q30 -18 60 0" />
      <path d="M300 270 L285 370 Q300 382 318 372" />
      <path d={`M245 440 Q300 ${mode === "sonrisa" ? 470 - 30 * k0 : 452} 355 440`} />
      <path d={`M245 440 Q300 ${mode === "sonrisa" ? 448 : 430} 355 440`} />
      <path d="M220 470 Q228 520 250 548 M380 470 Q372 520 350 548" stroke={C.inkSoft} strokeWidth="4" />
    </g>
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number, col: string, k: number, key: string) => (
    <g key={key} opacity={k}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={col} strokeWidth="12" strokeLinecap="round" />
      <circle cx={x1 + (x2 - x1) * k} cy={y1 + (y2 - y1) * k} r="14" fill={col} />
    </g>
  );
  let extra: React.ReactNode = null;
  if (mode === "grasa") extra = <g>{[[190, 330], [410, 330]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y + 60 * k0} rx="62" ry="44" fill={C.amber} opacity="0.45" /><line x1={x} y1={y - 40} x2={x} y2={y + 110 * k0} stroke={C.amber} strokeWidth="10" strokeDasharray="14 12" /></g>)}</g>;
  if (mode === "dao") extra = <g>{[[248, 470, 220, 540], [352, 470, 380, 540]].map(([x, y, x2, y2], i) => <g key={i}><path d={`M${x} ${y} L${x2 - 30} ${y2} L${x2 + 30} ${y2} Z`} fill={C.red} opacity={(0.35 + 0.5 * k0) * pulse} />{arrow(x, y - 10, x, y + 70, C.red, k1, "a" + i)}</g>)}</g>;
  if (mode === "punto") extra = <g>{[[240, 500], [360, 500]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={26 + 18 * pulse * k0} fill="none" stroke={C.teal} strokeWidth="6" /><circle cx={x} cy={y} r="14" fill={C.teal} opacity={k0} /></g>)}{arrow(420, 540, 520, 600, C.amber, k1, "b")}</g>;
  if (mode === "atm") extra = <g><circle cx="140" cy="330" r={30 + 20 * pulse} fill={C.red} opacity={0.45 * k0} /><circle cx="460" cy="330" r={30 + 20 * pulse} fill={C.red} opacity={0.45 * k0} /></g>;
  if (mode === "sonrisa") extra = <g>{arrow(250, 440, 190, 330, C.teal, k0, "s1")}{arrow(350, 440, 410, 330, C.teal, k0, "s2")}<g opacity={k1}><line x1="350" y1="445" x2="520" y2="445" stroke={C.red} strokeWidth="10" /><line x1="470" y1="415" x2="530" y2="475" stroke={C.red} strokeWidth="10" /><line x1="530" y1="415" x2="470" y2="475" stroke={C.red} strokeWidth="10" /></g></g>;
  if (mode === "flechas") extra = <g>{arrow(250, 455, 150, 300, C.teal, k0, "f1")}{arrow(350, 455, 450, 300, C.teal, k0, "f2")}{[[248, 470, 220, 540], [352, 470, 380, 540]].map(([x, y, x2, y2], i) => <path key={i} d={`M${x} ${y} L${x2 - 30} ${y2} L${x2 + 30} ${y2} Z`} fill={C.red} opacity={(0.25 + 0.65 * k1) * pulse} />)}</g>;
  if (mode === "orbicular") extra = <ellipse cx="300" cy="440" rx={70 + 12 * pulse * k0} ry={36 + 8 * pulse * k0} fill="none" stroke={C.teal} strokeWidth="12" opacity={k0} />;
  if (mode === "masetero") extra = <g><path d="M150 360 Q170 470 230 520" stroke={C.red} strokeWidth={26 * k0 * pulse} fill="none" opacity="0.6" /><path d="M450 360 Q430 470 370 520" stroke={C.red} strokeWidth={26 * k0 * pulse} fill="none" opacity="0.6" /><ellipse cx="300" cy="440" rx="70" ry="30" fill="none" stroke={C.teal} strokeWidth="8" strokeDasharray="12 10" opacity={k1} /></g>;
  if (mode === "lengua") extra = <g><path d={`M330 ${410 - 40 * k0} Q390 ${330 - 40 * k0} 440 ${372 - 10 * k0}`} stroke={C.red} strokeWidth="30" fill="none" strokeLinecap="round" opacity="0.7" /><line x1="452" y1="392" x2="462" y2={392 + 10 * k1} stroke={C.teal} strokeWidth="6" />{arrow(300, 60, 300, -10, C.teal, k1, "l")}</g>;
  return (
    <Full bed={bed} veil={0.82} seed={10}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 120px", gap: 80 }}>
        <Card enter={0} tilt={-1} style={{ width: 760, height: 860, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="600" height="700" viewBox="0 -20 600 680">{face}{extra}</svg>
        </Card>
        <div style={{ flex: 1, fontFamily: F_INTER }}>
          <Kicker>{perfil ? "De perfil" : "Así funciona"}</Kicker>
          <div style={{ fontSize: 84, fontWeight: 900, color: C.ink, lineHeight: 1.05, marginTop: 14, opacity: useSpr(6), transform: `translateY(${(1 - useSpr(6)) * 30}px)` }}>{title}</div>
          <Rule at={14} />
          <div style={{ fontSize: 54, fontWeight: 700, color: mode === "dao" || mode === "atm" || mode === "masetero" ? C.red : C.teal, opacity: Math.max(k0, interpolate(f, [22, 34], [0, 1], clamp)) }}>{label}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={2} src="line_draw.mp3" vol={0.25} />
      <Sfx at={h0} src={S_POP} vol={0.25} />
    </Full>
  );
};

// ═════════════════════════════ 11. ORDEN (chips encadenados)
export const FmOrder: React.FC<Base & { title: string; steps: string[] }> = ({ durationInFrames: d, bed, hits, title, steps }) => {
  const f = useCurrentFrame();
  return (
    <Full bed={bed} veil={0.72} seed={11}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: F_INTER }}>
        <div style={{ fontSize: 66, fontWeight: 900, color: C.ink, opacity: useSpr(0) }}>{title}</div>
        <Rule at={6} />
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 50 }}>
          {steps.map((s, i) => {
            const at = hitF(hits, i, steps.length, d);
            const k = spring({ frame: f - at, fps: FPS, config: { damping: 13, stiffness: 140 } });
            const line = interpolate(f, [at - 8, at], [0, 1], clamp);
            return (
              <React.Fragment key={i}>
                {i > 0 ? <div style={{ width: 90, height: 10, background: C.amber, transformOrigin: "left", transform: `scaleX(${line})`, borderRadius: 5 }} /> : null}
                <div style={{ background: i === steps.length - 1 ? C.teal : C.paper, color: i === steps.length - 1 ? "#fff" : C.ink, border: `3px solid ${C.teal}`, borderRadius: 28, padding: "34px 40px", fontSize: 54, fontWeight: 900, opacity: k, transform: `scale(${0.7 + 0.3 * k}) translateY(${Math.sin((f + i * 20) / 30) * 4}px)`, boxShadow: "0 18px 40px rgba(21,48,43,.16)" }}>
                  <div style={{ fontSize: 30, color: i === steps.length - 1 ? "#fff" : C.amber, fontWeight: 800 }}>{i + 1}</div>{s}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      {steps.map((_, i) => <Sfx key={i} at={hitF(hits, i, steps.length, d)} src="node_pop.mp3" vol={0.25} />)}
    </Full>
  );
};

// ═════════════════════════════ 12. COMENTARIO
export const FmComment: React.FC<Base & { text: string; likes: string; ask?: boolean }> = ({ durationInFrames: d, bed, hits, text, likes, ask }) => {
  const f = useCurrentFrame();
  const h = hitF(hits, 0, 1, d, 0.3);
  const heart = spring({ frame: f - h, fps: FPS, config: { damping: 8, stiffness: 180 } });
  const typed = Math.floor(interpolate(f, [8, 8 + text.length * 1.2], [0, text.length], clamp));
  return (
    <Full bed={bed} veil={0.7} seed={12}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Card enter={0} tilt={-0.8} style={{ width: 1360, padding: "50px 60px", display: "flex", gap: 36 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: ask ? C.teal : C.amberSoft, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 900, color: ask ? "#fff" : C.amber }}>{ask ? "✍" : "?"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.inkSoft }}>{ask ? "Escríbeme en los comentarios" : "Comentario en un video de este tema"}</div>
            <div style={{ fontSize: ask ? 110 : 68, fontWeight: 900, lineHeight: 1.12, marginTop: 12, color: C.ink }}>{ask ? `«${text.slice(0, typed)}»` : text.slice(0, typed)}<span style={{ opacity: f % 20 < 10 ? 1 : 0, color: C.teal }}>|</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26, fontSize: 44, fontWeight: 800, color: C.red }}>
              <span style={{ display: "inline-block", transform: `scale(${0.4 + 0.6 * heart})`, opacity: heart }}>{ask ? "" : "♥"}</span>
              <span style={{ opacity: heart, color: ask ? C.teal : C.red }}>{likes}{ask ? "" : " me gusta"}</span>
            </div>
          </div>
        </Card>
      </AbsoluteFill>
      <Sfx at={8} src="keyboard_type.mp3" vol={0.18} />
      <Sfx at={h} src={S_POP} vol={0.28} />
    </Full>
  );
};

// ═════════════════════════════ 13. MITO / VERDAD
export const FmMyth: React.FC<Base & { myth: string; truth: string }> = ({ durationInFrames: d, bed, hits, myth, truth }) => {
  const f = useCurrentFrame();
  const flip = hits && hits[0] !== undefined ? Math.round(hits[0] * FPS) : Math.round(d * 0.45);
  const strike = interpolate(f, [flip - 26, flip - 12], [0, 1], clamp);
  const t = spring({ frame: f - flip, fps: FPS, config: { damping: 14, stiffness: 120 } });
  return (
    <Full bed={bed} veil={0.72} seed={13}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40, fontFamily: F_INTER }}>
        <Card enter={0} tilt={-1.4} style={{ width: 1300, padding: "40px 60px", background: C.redSoft, border: `3px solid ${C.red}`, transform: undefined }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.red, letterSpacing: 4 }}>MITO</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: C.ink, position: "relative", display: "inline-block" }}>{myth}
            <div style={{ position: "absolute", left: 0, top: "52%", height: 10, width: `${strike * 100}%`, background: C.red, borderRadius: 5 }} />
          </div>
        </Card>
        <div style={{ opacity: t, transform: `translateY(${(1 - t) * 60}px)` }}>
          <Card enter={flip} tilt={1} style={{ width: 1300, padding: "40px 60px", borderLeft: `18px solid ${C.teal}` }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: C.teal, letterSpacing: 4 }}>LA VERDAD</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: C.ink }}>{truth}</div>
          </Card>
        </div>
      </AbsoluteFill>
      <Sfx at={flip - 26} src="marker_drive.mp3" vol={0.25} />
      <Sfx at={flip} src={S_CHIME} vol={0.25} />
    </Full>
  );
};

// ═════════════════════════════ 14. FLECHA (dirección)
export const FmArrow: React.FC<Base & { ok: boolean; title: string; sub: string }> = ({ bed, ok, title, sub }) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [4, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bob = Math.sin(f / 10) * 10;
  const col = ok ? C.teal : C.red;
  return (
    <Full bed={bed} veil={0.72} seed={14}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 90, fontFamily: F_INTER }}>
        <Card enter={0} tilt={-1} style={{ width: 520, height: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="360" height="560" viewBox="0 0 360 560" style={{ transform: `translateY(${ok ? -bob : bob}px)` }}>
            {ok ? (
              <g><line x1="180" y1="520" x2="180" y2={520 - 440 * draw} stroke={col} strokeWidth="46" strokeLinecap="round" /><path d={`M60 ${200 - 120 * draw + 120} L180 ${80} L300 ${200 - 120 * draw + 120}`} opacity={draw} stroke={col} strokeWidth="46" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
            ) : (
              <g><line x1="180" y1="40" x2="180" y2={40 + 440 * draw} stroke={col} strokeWidth="46" strokeLinecap="round" /><path d="M60 360 L180 480 L300 360" opacity={draw} stroke={col} strokeWidth="46" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <g opacity={interpolate(f, [26, 34], [0, 1], clamp)} stroke={C.ink} strokeWidth="26" strokeLinecap="round"><line x1="40" y1="140" x2="320" y2="420" /><line x1="320" y1="140" x2="40" y2="420" /></g></g>
            )}
          </svg>
        </Card>
        <div style={{ maxWidth: 900 }}>
          <div style={{ fontSize: 96, fontWeight: 900, color: col, lineHeight: 1.05, opacity: useSpr(8) }}>{title}</div>
          <Rule at={16} color={C.amber} />
          <div style={{ fontSize: 56, fontWeight: 700, color: C.ink, opacity: useSpr(18) }}>{sub}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={4} src={ok ? "line_arrive.mp3" : S_STING} vol={0.28} />
    </Full>
  );
};

// ═════════════════════════════ 15. GUÍA + QR (CTA)
export const FmGuide: React.FC<Base & { kicker: string; title: string; sub: string; cover: string; qr: string; domain: string; scanTitle: string; scanSub: string }> = ({ bed, kicker, title, sub, cover, qr, domain, scanTitle, scanSub }) => {
  const f = useCurrentFrame();
  const c = useSpr(0);
  const q = useSpr(10);
  const rotY = -18 + Math.sin(f / 50) * 4;
  return (
    <Full bed={bed} veil={0.8} seed={15}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 100px", gap: 70, fontFamily: F_INTER }}>
        <div style={{ perspective: 1600, flex: "none" }}>
          <div style={{ width: 520, height: 700, transform: `rotateY(${rotY}deg) translateY(${(1 - c) * 80}px)`, opacity: c, boxShadow: "30px 40px 70px rgba(0,0,0,.30)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
            <Img src={staticFile(cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Kicker color={C.amber}>{kicker}</Kicker>
          <div style={{ fontSize: 76, fontWeight: 900, color: C.ink, lineHeight: 1.05, marginTop: 12, opacity: useSpr(4) }}>{title}</div>
          <Rule at={10} color={C.teal} />
          <div style={{ fontSize: 46, fontWeight: 700, color: C.inkSoft }}>{sub}</div>
          <div style={{ fontSize: 58, fontWeight: 900, color: C.green, marginTop: 30 }}>{domain}</div>
        </div>
        <div style={{ flex: "none", background: "#fff", borderRadius: 28, padding: 30, boxShadow: "0 26px 60px rgba(0,0,0,.25)", opacity: q, transform: `scale(${0.85 + 0.15 * q})`, textAlign: "center" }}>
          <Img src={staticFile(qr)} style={{ width: 420, height: 420, display: "block", imageRendering: "pixelated" }} />
          <div style={{ fontSize: 36, fontWeight: 900, color: C.ink, marginTop: 16 }}>{scanTitle}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.inkSoft, marginTop: 6 }}>{scanSub}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={0} src={S_WHOOSH} vol={0.25} />
      <Sfx at={10} src={S_CHIME} vol={0.22} />
    </Full>
  );
};

// ═════════════════════════════ 16. CHECKLIST (full u overlay)
export const FmChecklist: React.FC<Base & { title: string; items: string[]; tone?: string }> = ({ durationInFrames: d, bed, ov, hits, title, items, tone }) => {
  const f = useCurrentFrame();
  const col = tone === "amber" ? C.amber : C.teal;
  const card = (
    <Card enter={0} tilt={ov ? 0.8 : -0.8} style={{ width: ov ? 820 : 1200, padding: ov ? "36px 44px" : "56px 70px", borderTop: `14px solid ${col}` }}>
      <div style={{ fontSize: ov ? 50 : 70, fontWeight: 900 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: ov ? 18 : 28, marginTop: ov ? 22 : 34 }}>
        {items.map((t, i) => {
          const at = hitF(hits, i, items.length, d);
          const k = interpolate(f, [at, at + 12], [0, 1], clamp);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.2 + 0.8 * k }}>
              <svg width={ov ? 50 : 64} height={ov ? 50 : 64} viewBox="0 0 64 64" style={{ flex: "none" }}><rect x="4" y="4" width="56" height="56" rx="12" fill="none" stroke={col} strokeWidth="6" /><path d="M16 33 L28 45 L50 20" stroke={col} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="56" strokeDashoffset={56 * (1 - k)} /></svg>
              <div style={{ fontSize: ov ? 38 : 52, fontWeight: 700, lineHeight: 1.12 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
  return (
    <Full bed={bed} ov={ov} veil={0.7} seed={16}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: "center", padding: ov ? "0 80px" : 0 }}>{card}</AbsoluteFill>
      {items.map((_, i) => <Sfx key={i} at={hitF(hits, i, items.length, d)} src={S_TICK} vol={0.22} />)}
    </Full>
  );
};

// ═════════════════════════════ 17. REPETICIONES (alterna A/B con anillo)
export const FmReps: React.FC<Base & { a: string; b: string; reps: string }> = ({ durationInFrames: d, bed, ov, hits, a, b, reps }) => {
  const f = useCurrentFrame();
  const cyc = 50;
  const phase = (f % cyc) / cyc;
  const onA = Math.floor(f / cyc) % 2 === 0;
  const hr = hitF(hits, (hits?.length ?? 1) - 1, 1, d, 0.5);
  const kr = spring({ frame: f - hr, fps: FPS, config: { damping: 10, stiffness: 160 } });
  const pill = (t: string, on: boolean, col: string) => (
    <div style={{ padding: "22px 38px", borderRadius: 999, fontSize: ov ? 46 : 60, fontWeight: 900, background: on ? col : C.paper, color: on ? "#fff" : C.inkSoft, border: `3px solid ${col}`, transform: `scale(${on ? 1.06 : 0.96})`, transition: "none" }}>{t}</div>
  );
  const card = (
    <Card enter={0} tilt={-0.6} style={{ padding: ov ? "34px 44px" : "60px 80px", display: "flex", alignItems: "center", gap: 34 }}>
      <svg width={ov ? 150 : 220} height={ov ? 150 : 220} viewBox="0 0 220 220"><circle cx="110" cy="110" r="90" stroke={C.line} strokeWidth="18" fill="none" /><circle cx="110" cy="110" r="90" stroke={onA ? C.teal : C.amber} strokeWidth="18" fill="none" strokeLinecap="round" strokeDasharray={`${phase * 565} 600`} transform="rotate(-90 110 110)" /></svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", gap: 18 }}>{pill(a, onA, C.teal)}{pill(b, !onA, C.amber)}</div>
        <div style={{ fontSize: ov ? 56 : 80, fontWeight: 900, color: C.ink, opacity: kr, transform: `scale(${0.7 + 0.3 * kr})`, transformOrigin: "left" }}>{reps}</div>
      </div>
    </Card>
  );
  return (
    <Full bed={bed} ov={ov} veil={0.7} seed={17}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: ov ? "flex-end" : "center", padding: ov ? "0 80px 90px 0" : 0 }}>{card}</AbsoluteFill>
      <Sfx at={hr} src={S_POP} vol={0.25} />
    </Full>
  );
};

// ═════════════════════════════ 18. BARRAS comparadas
export const FmBars: React.FC<Base & { title: string; bars: { label: string; value: number; max: number; tone: string; note: string }[] }> = ({ durationInFrames: d, bed, hits, title, bars }) => {
  const f = useCurrentFrame();
  return (
    <Full bed={bed} veil={0.74} seed={18}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: F_INTER }}>
        <Card enter={0} tilt={-0.6} style={{ width: 1500, padding: "60px 80px" }}>
          <div style={{ fontSize: 72, fontWeight: 900 }}>{title}</div>
          <Rule at={6} />
          {bars.map((b, i) => {
            const at = hitF(hits, i, bars.length, d);
            const k = interpolate(f, [at, at + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            const col = b.tone === "bad" ? C.red : C.teal;
            return (
              <div key={i} style={{ marginTop: 34 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, fontWeight: 800 }}><span>{b.label}</span><span style={{ color: col, opacity: k }}>{b.note}</span></div>
                <div style={{ height: 70, background: C.cream, borderRadius: 35, marginTop: 12, overflow: "hidden", border: `2px solid ${C.line}` }}>
                  <div style={{ height: "100%", width: `${Math.max(3, (100 * b.value) / b.max) * k}%`, background: col, borderRadius: 35 }} />
                </div>
              </div>
            );
          })}
        </Card>
      </AbsoluteFill>
      {bars.map((_, i) => <Sfx key={i} at={hitF(hits, i, bars.length, d)} src="bar_grow.mp3" vol={0.25} />)}
    </Full>
  );
};

// ═════════════════════════════ 19. VARIANTES (overlay/full)
export const FmVariant: React.FC<Base & { title: string; items: { t: string; s: string }[] }> = ({ durationInFrames: d, bed, ov, hits, title, items }) => {
  return (
    <Full bed={bed} ov={ov} veil={0.7} seed={19}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: "center", padding: ov ? "0 80px" : 0, fontFamily: F_INTER }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: ov ? 820 : 1200 }}>
          <div style={{ alignSelf: "flex-start", background: C.green, color: "#fff", fontSize: 40, fontWeight: 900, padding: "10px 26px", borderRadius: 14, opacity: useSpr(0), letterSpacing: 2 }}>{title.toUpperCase()}</div>
          {items.map((it, i) => {
            const at = hitF(hits, i, items.length, d, 0.05);
            return (
              <Card key={i} enter={at} tilt={i ? 0.8 : -0.8} style={{ padding: "30px 40px", borderLeft: `14px solid ${i ? C.amber : C.teal}` }}>
                <div style={{ fontSize: 50, fontWeight: 900 }}>{it.t}</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: C.inkSoft, marginTop: 6 }}>{it.s}</div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
      {items.map((_, i) => <Sfx key={i} at={hitF(hits, i, items.length, d, 0.05)} src={S_POP} vol={0.22} />)}
    </Full>
  );
};

// ═════════════════════════════ 20. POST-IT
export const FmSticky: React.FC<Base & { text: string; sub: string }> = ({ bed, text, sub }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - 4, fps: FPS, config: { damping: 9, stiffness: 140 } });
  const sway = Math.sin(f / 18) * 1.4;
  return (
    <Full bed={bed} veil={0.35} seed={20}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 760, height: 700, background: "linear-gradient(180deg,#FFE36E,#F9D74A)", boxShadow: "0 40px 80px rgba(0,0,0,.30)", transform: `rotate(${-4 + sway}deg) scale(${0.6 + 0.4 * s})`, opacity: s, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: F_INTER, position: "relative" }}>
          <div style={{ position: "absolute", top: -28, width: 220, height: 60, background: "rgba(255,255,255,.55)", transform: "rotate(3deg)" }} />
          <div style={{ fontSize: 132, fontWeight: 900, color: C.ink, textAlign: "center", lineHeight: 1, fontStyle: "italic" }}>{text}</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: C.inkSoft, marginTop: 34, textAlign: "center", padding: "0 40px" }}>{sub}</div>
        </div>
      </AbsoluteFill>
      <Sfx at={4} src="layer_drop.mp3" vol={0.28} />
    </Full>
  );
};

// ═════════════════════════════ 21. ERROR Nº (full u overlay)
export const FmError: React.FC<Base & { n: number; title: string; fix: string }> = ({ bed, ov, n, title, fix }) => {
  const f = useCurrentFrame();
  const x = spring({ frame: f - 8, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const fixK = interpolate(f, [22, 34], [0, 1], clamp);
  const card = (
    <Card enter={0} tilt={-1} style={{ width: ov ? 860 : 1300, padding: ov ? "36px 48px" : "60px 80px", display: "flex", gap: 40, alignItems: "center", borderTop: `16px solid ${C.red}` }}>
      <div style={{ position: "relative", width: ov ? 170 : 240, height: ov ? 170 : 240, flex: "none" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ov ? 110 : 150, fontWeight: 900, color: C.red }}>{n}</div>
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: -10, opacity: x, transform: `scale(${1.8 - 0.8 * x})` }}><g stroke={C.red} strokeWidth="9" strokeLinecap="round"><line x1="20" y1="20" x2="80" y2="80" /><line x1="80" y1="20" x2="20" y2="80" /></g></svg>
      </div>
      <div>
        <div style={{ fontSize: ov ? 30 : 40, fontWeight: 900, color: C.red, letterSpacing: 4 }}>{`ERROR NÚMERO ${n}`}</div>
        <div style={{ fontSize: ov ? 58 : 84, fontWeight: 900, lineHeight: 1.05, marginTop: 8 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20, opacity: fixK, fontSize: ov ? 38 : 50, fontWeight: 700, color: C.teal }}><CheckIcon k={fixK} size={ov ? 44 : 56} />{fix}</div>
      </div>
    </Card>
  );
  return (
    <Full bed={bed} ov={ov} veil={0.7} seed={21}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: ov ? "flex-end" : "center", padding: ov ? "0 70px 80px 0" : 0 }}>{card}</AbsoluteFill>
      <Sfx at={8} src={S_STING} vol={0.28} />
    </Full>
  );
};

// ═════════════════════════════ 22. SPLIT (dos lados)
export const FmSplit: React.FC<Base & { left: { t: string; s: string }; right: { t: string; s: string; danger?: boolean } }> = ({ durationInFrames: d, bed, hits, left, right }) => {
  const r = hitF(hits, 1, 2, d, 0.3);
  const Side: React.FC<{ it: { t: string; s: string; danger?: boolean }; enter: number; good: boolean; tilt: number }> = ({ it, enter, good, tilt }) => {
    const col = it.danger ? C.red : good ? C.teal : C.amber;
    return (
      <Card enter={enter} tilt={tilt} style={{ flex: 1, height: 560, padding: "56px 60px", borderTop: `16px solid ${col}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <CheckIcon k={1} ok={good && !it.danger} size={90} />
        <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.05, marginTop: 24, color: it.danger ? C.red : C.ink }}>{it.t}</div>
        <div style={{ fontSize: 50, fontWeight: 700, color: C.inkSoft, marginTop: 18 }}>{it.s}</div>
      </Card>
    );
  };
  const rightGood = !right.danger;
  return (
    <Full bed={bed} veil={0.72} seed={22}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", gap: 60, padding: "0 110px", fontFamily: F_INTER }}>
        <Side it={left} enter={0} good={!rightGood} tilt={-1.2} />
        <div style={{ fontSize: 60, fontWeight: 900, color: C.amber }}>VS</div>
        <Side it={right} enter={r} good={rightGood} tilt={1.2} />
      </AbsoluteFill>
      <Sfx at={0} src={S_POP} vol={0.22} />
      <Sfx at={r} src={right.danger ? S_STING : S_POP} vol={0.28} />
    </Full>
  );
};

// ═════════════════════════════ 23. ALARMA (ACV)
export const FmAlarm: React.FC<Base & { title: string; items: string[]; cta: string }> = ({ durationInFrames: d, bed, hits, title, items, cta }) => {
  const f = useCurrentFrame();
  const n = items.length;
  const ctaAt = hits && hits[n] !== undefined ? Math.round(hits[n] * FPS) : Math.round(d * 0.78);
  const ck = spring({ frame: f - ctaAt, fps: FPS, config: { damping: 11, stiffness: 150 } });
  const blink = 0.7 + 0.3 * Math.sin(f / 4);
  return (
    <Full bed={bed} veil={0.76} seed={23}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: F_INTER }}>
        <Card enter={0} tilt={-0.5} style={{ width: 1500, padding: "50px 70px", borderTop: `18px solid ${C.red}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: C.red, opacity: blink, color: "#fff", fontSize: 50, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: C.red }}>{title}</div>
          </div>
          <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
            {items.map((t, i) => {
              const at = hitF(hits, i, n + 1, d);
              const k = spring({ frame: f - at, fps: FPS, config: { damping: 13, stiffness: 140 } });
              return (
                <div key={i} style={{ flex: 1, background: C.redSoft, borderRadius: 22, padding: "30px 30px", opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
                  <div style={{ fontSize: 70, fontWeight: 900, color: C.red }}>{i + 1}</div>
                  <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.12 }}>{t}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 36, background: C.red, color: "#fff", borderRadius: 18, padding: "22px 30px", fontSize: 60, fontWeight: 900, textAlign: "center", opacity: ck, transform: `scale(${0.8 + 0.2 * ck})` }}>{cta}</div>
        </Card>
      </AbsoluteFill>
      {items.map((_, i) => <Sfx key={i} at={hitF(hits, i, n + 1, d)} src={S_THUD} vol={0.24} />)}
      <Sfx at={ctaAt} src={S_STING} vol={0.3} />
    </Full>
  );
};

// ═════════════════════════════ 24. LÍNEA DE TIEMPO (semanas)
export const FmTimeline: React.FC<Base & { title: string; marks: { at: string; t: string }[] }> = ({ durationInFrames: d, bed, hits, title, marks }) => {
  const f = useCurrentFrame();
  const n = marks.length;
  const last = hitF(hits, n - 1, n, d);
  const line = interpolate(f, [hitF(hits, 0, n, d) - 6, last + 10], [0, 1], clamp);
  return (
    <Full bed={bed} veil={0.74} seed={24}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: F_INTER }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: C.ink, opacity: useSpr(0) }}>{title}</div>
        <Rule at={6} />
        <div style={{ position: "relative", width: 1600, height: 460, marginTop: 30 }}>
          <div style={{ position: "absolute", top: 90, left: 60, right: 60, height: 12, background: C.line, borderRadius: 6 }} />
          <div style={{ position: "absolute", top: 90, left: 60, width: `${(1600 - 120) * line}px`, height: 12, background: C.teal, borderRadius: 6 }} />
          {marks.map((m, i) => {
            const at = hitF(hits, i, n, d);
            const k = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 150 } });
            const x = 60 + ((1600 - 120) * i) / Math.max(1, n - 1);
            return (
              <div key={i} style={{ position: "absolute", left: x - 230, top: 50, width: 460, display: "flex", flexDirection: "column", alignItems: "center", opacity: k }}>
                <div style={{ width: 90, height: 90, borderRadius: 45, background: i === n - 1 ? C.amber : C.teal, border: "8px solid #fff", boxShadow: "0 10px 24px rgba(0,0,0,.2)", transform: `scale(${0.6 + 0.4 * k})` }} />
                <Card enter={at} tilt={[-1, 0.6, 1][i % 3]} style={{ marginTop: 30, padding: "24px 30px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, fontWeight: 900, color: i === n - 1 ? C.amber : C.teal }}>{m.at}</div>
                  <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, marginTop: 8 }}>{m.t}</div>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {marks.map((_, i) => <Sfx key={i} at={hitF(hits, i, n, d)} src="pin_plop.mp3" vol={0.25} />)}
    </Full>
  );
};

// ═════════════════════════════ 25. LOS TRES NUNCA
export const FmNever: React.FC<Base & { items: string[] }> = ({ durationInFrames: d, bed, hits, items }) => {
  const f = useCurrentFrame();
  return (
    <Full bed={bed} veil={0.72} seed={25}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, fontFamily: F_INTER }}>
        {items.map((t, i) => {
          const at = hitF(hits, i, items.length, d);
          const k = spring({ frame: f - at, fps: FPS, config: { damping: 11, stiffness: 160 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, background: C.paper, borderRadius: 30, padding: "26px 60px", boxShadow: "0 22px 50px rgba(21,48,43,.18)", opacity: k, transform: `translateX(${(1 - k) * (i % 2 ? 140 : -140)}px) rotate(${[-1, 0.8, -0.6][i % 3]}deg)`, width: 1200 }}>
              <CheckIcon k={k} ok={false} size={90} />
              <div style={{ fontSize: 96, fontWeight: 900, color: C.ink }}>{t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {items.map((_, i) => <Sfx key={i} at={hitF(hits, i, items.length, d)} src={S_THUD} vol={0.26} />)}
    </Full>
  );
};

// ═════════════════════════════ 26. FRASE CINÉTICA (overlay)
export const FmPhrase: React.FC<Base & { words: string[]; tone?: string }> = ({ durationInFrames: d, hits, words, tone }) => {
  const f = useCurrentFrame();
  const col = tone === "red" ? C.red : tone === "warn" ? C.amber : tone === "teal" ? C.teal : C.ink;
  const out = interpolate(f, [d - 8, d], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110, opacity: out }}>
      <div style={{ display: "flex", gap: 26, flexWrap: "wrap", justifyContent: "center", maxWidth: 1700 }}>
        {words.map((w, i) => {
          const at = hitF(hits, i, words.length, d, 0.05);
          const k = spring({ frame: f - at, fps: FPS, config: { damping: 10, stiffness: 170 } });
          const hl = i === words.length - 1;
          return <div key={i} style={{ fontFamily: F_INTER, fontSize: 104, fontWeight: 900, background: hl ? col : C.paper, color: hl ? (tone === "ink" ? "#fff" : C.ink) : C.ink, padding: "10px 34px", borderRadius: 22, boxShadow: "0 18px 40px rgba(0,0,0,.28)", opacity: k, transform: `translateY(${(1 - k) * 50}px) scale(${0.8 + 0.2 * k}) rotate(${[-1.5, 1, -0.5][i % 3]}deg)` }}>{w}</div>;
        })}
      </div>
      {words.map((_, i) => <Sfx key={i} at={hitF(hits, i, words.length, d, 0.05)} src={S_POP} vol={0.2} />)}
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 27. PREGUNTA / RESPUESTA (overlay/full)
export const FmQA: React.FC<Base & { q: string; a: string }> = ({ durationInFrames: d, bed, ov, hits, q, a }) => {
  const f = useCurrentFrame();
  const at = hitF(hits, 0, 1, d, 0.4);
  const k = spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 150 } });
  const card = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: ov ? 860 : 1300, fontFamily: F_INTER }}>
      <Card enter={0} tilt={-0.8} style={{ padding: ov ? "30px 40px" : "50px 60px", background: C.amberSoft, border: `3px solid ${C.amber}` }}>
        <div style={{ fontSize: ov ? 30 : 40, fontWeight: 900, color: C.amber, letterSpacing: 3 }}>PREGUNTA</div>
        <div style={{ fontSize: ov ? 54 : 76, fontWeight: 900, lineHeight: 1.08 }}>{q}</div>
      </Card>
      <div style={{ opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>
        <Card enter={at} tilt={0.8} style={{ padding: ov ? "26px 40px" : "44px 60px", borderLeft: `16px solid ${C.teal}` }}>
          <div style={{ fontSize: ov ? 54 : 76, fontWeight: 900, color: C.teal }}>{a}</div>
        </Card>
      </div>
    </div>
  );
  return (
    <Full bed={bed} ov={ov} veil={0.7} seed={27}>
      <AbsoluteFill style={{ alignItems: ov ? "flex-end" : "center", justifyContent: "center", padding: ov ? "0 80px" : 0 }}>{card}</AbsoluteFill>
      <Sfx at={0} src={S_POP} vol={0.22} />
      <Sfx at={at} src={S_CHIME} vol={0.22} />
    </Full>
  );
};
