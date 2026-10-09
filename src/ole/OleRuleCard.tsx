// OleRuleCard — rótulo de REGLA numerada estilo página del libro ("RULE 4" grande en naranja Fraunces + título + 1 línea).
//   Overlay transparente: placement "corner" (arriba-izq), "lower" (franja baja) o "center".
// OleRecapCard — la "tarjeta de receta" del resumen final: 7-8 pasos que se tildan a lápiz uno por uno (beats en s).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, SERIF, LABEL, HAND, woodBg, hexA, rnd } from "./OleTheme";

const Bed: React.FC<{ src?: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!src) return <AbsoluteFill style={woodBg()} />;
  const s = 1.04 + 0.05 * (f / Math.max(1, durationInFrames));
  const url = /^(https?:|\/|data:)/.test(src) ? src : staticFile(src);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: "blur(5px) saturate(0.92)" };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {/\.(mp4|webm|mov)$/i.test(src) ? <OffthreadVideo src={url} muted style={st} /> : <Img src={url} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(OLE.cream, 0.18) }} />
    </AbsoluteFill>
  );
};

// papel de página del libro (crema, borde apenas tostado)
const pageStyle = (): React.CSSProperties => ({
  background: `radial-gradient(ellipse at 30% 20%, #FFFBF1, ${OLE.paper} 60%, #EFE4CB)`,
  boxShadow: `0 22px 44px ${OLE.shadow}, 0 3px 8px rgba(0,0,0,0.2), inset 0 0 40px rgba(170,120,60,0.16)`,
  borderRadius: 6,
});

// trazo a lápiz que se dibuja (subrayado ondulado)
const Scribble: React.FC<{ w: number; p: number; color: string; seed: number; sw?: number }> = ({ w, p, color, seed, sw = 5 }) => {
  const n = 24;
  const d = Array.from({ length: n + 1 }).map((_, i) => `${i ? "L" : "M"}${((i / n) * w).toFixed(1)},${(8 + Math.sin(i * 0.9 + seed) * 2.2 + (rnd(seed + i) - 0.5) * 2).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={18} style={{ display: "block", overflow: "visible" }}>
      <path d={d} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.85} />
    </svg>
  );
};

const Tape: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 170, height: 46, background: "rgba(233,217,184,0.78)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)", clipPath: "polygon(3% 8%, 97% 0, 100% 90%, 1% 100%)", ...style }} />
);

export const OleRuleCard: React.FC<{
  n: number | string;
  title: string;
  line?: string;
  ruleWord?: string;
  placement?: "corner" | "lower" | "center";
  /** s en que entra (default 0.1) */
  inAt?: number;
  /** s en que empieza a salir (default: final − 0.45) */
  outAt?: number;
  seed?: number;
}> = ({ n, title, line, ruleWord = "RULE", placement = "corner", inAt = 0.1, outAt, seed = 5 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const oA = outAt ?? dur - 0.45;
  const inS = spring({ frame: f - inAt * fps, fps, config: { damping: 15, mass: 0.8 } });
  const outS = interpolate(f, [oA * fps, oA * fps + 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const ul = interpolate(f, [(inAt + 0.45) * fps, (inAt + 1.1) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const lineP = interpolate(f, [(inAt + 0.7) * fps, (inAt + 1.1) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = (rnd(seed) - 0.5) * 3;

  if (placement === "lower") {
    const x = (1 - inS) * -140 + outS * -120;
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 130, bottom: 70, width: 1560, height: 210, ...pageStyle(), display: "flex", alignItems: "center", padding: "0 56px", translate: `${x}px 0`, rotate: `${rot * 0.4}deg`, opacity: inS * (1 - outS) }}>
          <Tape style={{ left: -40, top: 18, rotate: "-28deg" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, paddingRight: 44, borderRight: `3px solid ${hexA(OLE.fire, 0.45)}`, height: 140, alignSelf: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: OLE.fire, letterSpacing: 1, lineHeight: "140px" }}>{ruleWord}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: OLE.fire, lineHeight: "140px", fontVariantNumeric: "lining-nums" }}>{n}</div>
          </div>
          <div style={{ paddingLeft: 44, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: OLE.forest, lineHeight: 1.02, whiteSpace: "nowrap" }}>{title}</div>
            <Scribble w={560} p={ul} color={OLE.fire} seed={seed} />
            {line ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil, marginTop: 6, opacity: lineP, whiteSpace: "nowrap" }}>{line}</div> : null}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const center = placement === "center";
  const W = center ? 1120 : 700;
  const box: React.CSSProperties = center
    ? { left: (1920 - W) / 2, top: 230, translate: `0 ${(1 - inS) * 160 + outS * 60}px`, scale: String(0.9 + 0.1 * inS) }
    : { left: 70, top: 64, translate: `${(1 - inS) * -120 + outS * -100}px ${(1 - inS) * -40}px` };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", width: W, padding: center ? "56px 80px 60px" : "34px 46px 38px", ...pageStyle(), rotate: `${rot + (1 - inS) * -6}deg`, opacity: inS * (1 - outS), ...box }}>
        <Tape style={{ left: W / 2 - 85, top: -22, rotate: `${rot * 2}deg` }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: center ? 22 : 14 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: center ? 96 : 62, color: OLE.fire, letterSpacing: 1 }}>{ruleWord}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: center ? 170 : 108, color: OLE.fire, lineHeight: 0.9, fontVariantNumeric: "lining-nums" }}>{n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: center ? 84 : 56, color: OLE.forest, lineHeight: 1.05, marginTop: center ? 10 : 4 }}>{title}</div>
        <Scribble w={center ? 700 : 440} p={ul} color={OLE.fire} seed={seed} />
        {line ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: center ? 54 : 44, color: OLE.pencil, marginTop: 8, lineHeight: 1.15, opacity: lineP }}>{line}</div> : null}
        {center ? <div style={{ position: "absolute", right: 44, bottom: 30, fontFamily: LABEL, fontWeight: 600, fontSize: 24, letterSpacing: 4, color: hexA(OLE.mute, 0.8) }}>{`· ${n} ·`}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────── tarjeta de receta (resumen final) ───────────────────────────
const DEFAULT_STEPS = [
  "Skip the overnight soak",
  "Salt goes in at the start",
  "Hard boil, just 10 minutes",
  "Then a whisper, lid cocked",
  "Salt pork & onion early",
  "Acid & sweet at the end",
  "Old beans? Pinch of soda",
  "Save the pot liquor",
];

// tilde a lápiz dibujada
const Check: React.FC<{ p: number; seed: number }> = ({ p, seed }) => {
  const j = (k: number) => (rnd(seed + k) - 0.5) * 4;
  const d = `M${6 + j(1)},${30 + j(2)} C${14},${36} ${20},${44} ${24 + j(3)},${52 + j(4)} C${34},${32} ${48},${12} ${66 + j(5)},${-4 + j(6)}`;
  return (
    <svg width={70} height={60} style={{ position: "absolute", left: 4, top: -8, overflow: "visible" }}>
      <path d={d} stroke={OLE.plaid} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};

export const OleRecapCard: React.FC<{
  title?: string;
  kicker?: string;
  steps?: string[];
  /** s en que se tilda cada paso (default: repartidos entre 15 % y 88 % de la duración) */
  beats?: number[];
  bed?: string;
  seed?: number;
}> = ({ title = "Ole's Camp Bean Method", kicker = "THE WHOLE METHOD", steps = DEFAULT_STEPS, beats, bed, seed = 9 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames / fps;
  const t = f / fps;
  const nS = steps.length;
  const bs = steps.map((_, i) => beats?.[i] ?? dur * (0.15 + (0.73 * i) / Math.max(1, nS - 1)));
  const inP = interpolate(f, [0, 0.7 * fps], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outP = interpolate(f, [durationInFrames - 0.4 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rowH = nS > 7 ? 74 : 84;
  const fs = nS > 7 ? 48 : 52;
  // paso activo: el último tildado (lo resalta un toque)
  let active = -1; bs.forEach((b, i) => { if (t >= b) active = i; });
  const cardH = 220 + nS * rowH + 50;
  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <Bed src={bed} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1300, height: cardH, background: "linear-gradient(180deg, #FFFDF6, #F6EEDB)", borderRadius: 10, boxShadow: `0 30px 60px ${OLE.shadow}, 0 4px 10px rgba(0,0,0,0.2)`, rotate: `${-1.2 + (1 - inP) * 3}deg`, translate: `0 ${(1 - inP) * 120}px`, scale: String(0.95 + 0.05 * inP), opacity: inP, overflow: "hidden" }}>
          {/* ficha de receta: línea roja arriba, renglones azules */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 176, height: 3, background: hexA(OLE.plaid, 0.55) }} />
          {Array.from({ length: nS }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 200 + (i + 1) * rowH - 6, height: 2, background: "rgba(90,130,190,0.26)" }} />)}
          {/* manchas de uso */}
          {Array.from({ length: 2 }).map((_, i) => {
            const r = 120 + rnd(seed + i) * 60;
            return <div key={i} style={{ position: "absolute", left: `${74 + rnd(seed + i + 3) * 14}%`, top: `${30 + i * 36 + rnd(seed + i + 6) * 10}%`, width: r, height: r * 0.9, borderRadius: "50%", border: `5px solid rgba(160,110,50,${0.08 + rnd(seed + i + 9) * 0.06})`, filter: "blur(1px)" }} />;
          })}
          <Tape style={{ left: -34, top: 22, rotate: "-30deg" }} />
          <Tape style={{ right: -34, top: 22, rotate: "30deg" }} />
          <div style={{ position: "absolute", left: 90, top: 42, fontFamily: LABEL, fontWeight: 600, fontSize: 32, letterSpacing: 8, color: OLE.fire }}>{kicker}</div>
          <div style={{ position: "absolute", left: 88, top: 80, fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: OLE.forest, letterSpacing: -1 }}>{title}</div>
          {steps.map((s, i) => {
            const p = interpolate(t, [bs[i], bs[i] + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
            const done = p > 0;
            const hl = i === active ? interpolate(t, [bs[i], bs[i] + 0.25, bs[i] + 1.4, bs[i] + 2.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: 90, right: 70, top: 200 + i * rowH, height: rowH, display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: 110, right: 0, top: 8, bottom: 8, background: hexA(OLE.ember, 0.28 * hl), borderRadius: 8 }} />
                <div style={{ position: "relative", width: 52, height: 52, border: `4px solid ${OLE.pencil}`, borderRadius: 6, marginRight: 30, marginLeft: 8, rotate: `${(rnd(seed + i) - 0.5) * 6}deg`, flex: "none" }}>
                  <Check p={p} seed={seed * 7 + i * 13} />
                </div>
                <div style={{ position: "relative", fontFamily: LABEL, fontWeight: 600, fontSize: 30, color: OLE.fire, width: 44, flex: "none" }}>{i + 1}</div>
                <div style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: fs, color: done ? "#243766" : hexA("#243766", 0.62), lineHeight: 1 }}>{s}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
