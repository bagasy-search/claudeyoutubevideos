import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { COLORS, SERIF } from "../theme";
import { Padlock, asset } from "./CropReel3D";

/**
 * CropShowcase — the flagship continuous hero for a crop, no cuts:
 *  A. ASSEMBLE  — the 5 cards rise from below, camera zooms in & follows,
 *                 they arrange on a 3D ring and start rotating (all locked).
 *  B. REVEAL    — the ring turns the focus card to front, its padlock pops open.
 *  C. CHAPTER   — the focus card detaches & slides LEFT (others dissolve),
 *                 the name types in top-right, a curved pull-back brings the
 *                 description, the camera pans to a BEAUTIFUL sowing calendar,
 *                 then a pinned pastel "truco" card (red push-pin + thumb) with
 *                 an arrow while the camera drifts onward.
 */

export type CropShowcaseProps = {
  durationInFrames: number;
  images: string[]; // 5 staticFile paths (the whole set — the ring)
  focus: number; // which crop this chapter is about (0..4)
  number: string; // "1".."5"
  name: string;
  description: string;
  months: number[]; // best sowing months 1..12
  tip: string;
  accent?: string;
  pastel?: string;
  assemble?: boolean; // false = skip the 5-card rise (shorter intro for crops 2..5)
};

const TAU = Math.PI * 2;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function ramp(t: number, stops: Array<[number, number]>, ease = Easing.bezier(0.5, 0, 0.2, 1)) {
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, v0] = stops[i], [t1, v1] = stops[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * ease(clamp01((t - t0) / (t1 - t0)));
  }
  return stops[stops.length - 1][1];
}

// timeline marks
const ASSEMBLE = 0.16, REVEAL = 0.24, SLIDE0 = 0.28, SLIDE1 = 0.42, DESC = 0.5, CAL0 = 0.56, TIP0 = 0.78;

export const CropShowcase: React.FC<CropShowcaseProps> = ({
  durationInFrames, images, focus, number, name, description, months, tip,
  accent = COLORS.accent, pastel = "#EAF0DB", assemble = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / durationInFrames;
  const N = images.length;
  const cx = width / 2, cy = height / 2;

  // ── ring rotation: settle focus to front by REVEAL, hold after ──────────────
  const slot = TAU / N;
  const spin = ramp(t, [[0, -slot * 0.4], [ASSEMBLE, -slot * 0.15], [REVEAL, -focus * slot], [1, -focus * slot]], Easing.inOut(Easing.cubic));

  // ── camera ──────────────────────────────────────────────────────────────────
  const camScale = ramp(t, [[0, assemble ? 1.22 : 1.06], [ASSEMBLE, 1.0], [REVEAL, 1.06], [SLIDE1, 1.0], [DESC, 0.96], [CAL0, 0.99], [TIP0, 1.0], [1, 1.02]]);
  const camX = ramp(t, [[0, 0], [SLIDE1, width * 0.03], [CAL0, -width * 0.33], [TIP0, -width * 0.6], [1, -width * 0.64]]);
  const followY = assemble ? interpolate(t, [0, ASSEMBLE], [height * 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const driftX = Math.sin(frame * 0.02) * 7 + Math.sin(frame * 0.043) * 3;
  const driftY = Math.cos(frame * 0.016) * 6;

  // hero (focus) card blends ring-front → left hero slot during SLIDE
  const slideK = interpolate(t, [SLIDE0, SLIDE1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const unlock = interpolate(t, [REVEAL - 0.04, REVEAL + 0.06], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const baseW = Math.min(width, height) * 0.30;
  const baseH = baseW * 1.32;
  const R = Math.min(width, height) * 0.335;

  // typewriter
  const nameProg = clamp01((t - SLIDE0 - 0.06) / (SLIDE1 - SLIDE0));
  const shownName = name.slice(0, Math.round(nameProg * name.length));
  const cursorOn = t > SLIDE0 && t < DESC + 0.06 && Math.floor(frame / 8) % 2 === 0;
  const descOp = interpolate(t, [DESC, DESC + 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const calOp = interpolate(t, [CAL0, CAL0 + 0.07], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tipOp = interpolate(t, [TIP0, TIP0 + 0.07], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tipY = interpolate(t, [TIP0, TIP0 + 0.1], [30, 0], { extrapolateRight: "clamp" });
  const arrowDraw = interpolate(t, [TIP0 + 0.03, TIP0 + 0.14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });

  // ── build the ring cards ────────────────────────────────────────────────────
  const cards = images.map((src, i) => {
    const ang = spin + i * slot;
    const depth = Math.cos(ang);
    const dn = (depth + 1) / 2;
    const ringX = cx + Math.sin(ang) * R;
    const ringY = cy - depth * height * 0.02;
    const ringScale = lerp(0.56, 1.0, dn);
    const depthBlur = interpolate(depth, [-1, 1], [9, 0]);
    const dim = interpolate(depth, [-1, 1], [0.5, 1]);

    // entrance from below (skipped when assemble=false → cards already in place)
    const start = i === focus ? 0 : ASSEMBLE * 0.3 + i * 5;
    const e = assemble ? spring({ frame: frame - start, fps, config: { damping: 200, mass: 0.9 } }) : 1;
    const enterY = assemble ? interpolate(e, [0, 1], [height * 0.6, 0]) : 0;

    let x = ringX, y = ringY + enterY, scale = ringScale, blur = Math.max(depthBlur, (1 - unlock) * 15 * (i === focus ? 1 : 0)), op = e * dim, tilt = 0, z = Math.round((depth + 1) * 100);

    if (i === focus) {
      // blend to hero-left
      const heroX = width * 0.26, heroScale = (baseW * 1.02) / baseW; // ~1.02 rel
      x = lerp(ringX, heroX, slideK);
      y = lerp(ringY + enterY, cy, slideK);
      scale = lerp(ringScale, heroScale, slideK);
      tilt = slideK * 7;
      blur = (1 - unlock) * 15;
      op = 1; z = 999;
    } else {
      // non-focus dissolve during slide
      op = op * (1 - slideK);
      scale = ringScale * (1 - slideK * 0.15);
    }
    return { i, src, x, y, scale, blur, op, tilt, z };
  });

  return (
    <AbsoluteFill style={{ background: "#f3efe6", overflow: "hidden" }}>
      {/* bright bokeh bg */}
      <AbsoluteFill>
        <div style={{ position: "absolute", inset: -80, background: "radial-gradient(120% 90% at 44% 34%, #fdfbf6 0%, #f1ece0 55%, #e6dcc7 100%)" }} />
        {[{ x: 0.12, y: 0.2, r: 300, c: "rgba(124,138,90,0.22)" }, { x: 0.9, y: 0.32, r: 320, c: "rgba(169,121,74,0.18)" }, { x: 0.34, y: 0.86, r: 250, c: "rgba(110,139,71,0.2)" }, { x: 0.72, y: 0.74, r: 220, c: "rgba(255,255,255,0.5)" }].map((b, k) => (
          <div key={k} style={{ position: "absolute", left: b.x * width, top: b.y * height, width: b.r, height: b.r, marginLeft: -b.r / 2, marginTop: -b.r / 2, borderRadius: "50%", background: b.c, filter: "blur(62px)", transform: `translate(${Math.sin(frame * 0.01 + k) * 16}px, ${Math.cos(frame * 0.013 + k) * 12}px)` }} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `translate(${camX + driftX}px, ${followY + driftY}px) scale(${camScale})`, transformOrigin: "44% 50%" }}>
        <AbsoluteFill style={{ perspective: 1500 }}>
          {/* ring / hero cards */}
          {cards.slice().sort((a, b) => a.z - b.z).map((c) => {
            const w = baseW * c.scale, h = baseH * c.scale;
            return (
              <div key={c.i} style={{ position: "absolute", left: c.x - w / 2, top: c.y - h / 2, width: w, height: h, zIndex: c.z, opacity: c.op, borderRadius: 22, overflow: "hidden", border: "7px solid #fbf8f1", boxShadow: `0 ${30 * c.scale}px ${70 * c.scale}px rgba(42,38,32,${0.28 * c.scale})`, background: "#e8e2d4", transform: `rotateY(${-c.tilt}deg)`, transformStyle: "preserve-3d" }}>
                <Img src={asset(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${c.blur}px)`, transform: `scale(${1.05 + (c.blur > 0 ? 0.04 : 0)})` }} />
                {c.i === focus && unlock < 0.99 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(247,243,235,0.55)", opacity: 1 - clamp01((unlock - 0.5) / 0.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Padlock open={unlock} size={w * 0.3} />
                  </div>
                )}
                {c.i === focus && slideK > 0.4 && (
                  <div style={{ position: "absolute", left: 14, bottom: 12, fontFamily: SERIF, fontSize: h * 0.16, fontWeight: 700, color: "#faf6ec", textShadow: "0 3px 10px rgba(0,0,0,0.6)", opacity: slideK, lineHeight: 1 }}>{number}</div>
                )}
              </div>
            );
          })}

          {/* name (typewriter) + description */}
          <div style={{ position: "absolute", left: width * 0.5, top: height * 0.28, width: width * 0.36, opacity: interpolate(t, [SLIDE0, SLIDE0 + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontFamily: SERIF, fontSize: height * 0.11, fontWeight: 700, color: COLORS.text, lineHeight: 1.02 }}>
              {shownName}<span style={{ opacity: cursorOn ? 1 : 0, color: accent }}>|</span>
            </div>
            <div style={{ marginTop: 12, height: 4, width: interpolate(t, [SLIDE1, DESC + 0.06], [0, width * 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), background: accent, borderRadius: 2 }} />
            <div style={{ marginTop: 18, opacity: descOp, fontFamily: SERIF, fontSize: height * 0.036, color: COLORS.textSoft, lineHeight: 1.35, maxWidth: width * 0.32 }}>{description}</div>
          </div>

          {/* ── BEAUTIFUL SOWING CALENDAR ── */}
          <div style={{ position: "absolute", left: width * 0.86, top: height * 0.2, width: width * 0.4, opacity: calOp, transform: `translateY(${interpolate(calOp, [0, 1], [24, 0])}px)` }}>
            <div style={{ background: "linear-gradient(180deg,#fbf6ea,#f3ead4)", borderRadius: 18, border: "1px solid rgba(42,38,32,0.14)", boxShadow: "0 26px 60px rgba(42,38,32,0.2)", overflow: "hidden" }}>
              <div style={{ background: accent, color: "#faf6ec", fontFamily: SERIF, fontSize: height * 0.036, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Calendario de siembra</span>
                <span style={{ fontSize: height * 0.028, opacity: 0.85 }}>{name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, padding: 22 }}>
                {MONTHS.map((m, i) => {
                  const on = months.includes(i + 1);
                  const pop = interpolate(t, [CAL0 + 0.04 + i * 0.008, CAL0 + 0.1 + i * 0.008], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={i} style={{ position: "relative", height: height * 0.1, borderRadius: 12, background: on ? accent : "#efe7d3", border: `2px solid ${on ? accent : "rgba(42,38,32,0.12)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${on ? pop : 0.95})`, boxShadow: on ? "0 10px 22px rgba(124,138,90,0.35)" : "none" }}>
                      <div style={{ fontFamily: SERIF, fontSize: height * 0.03, fontWeight: on ? 700 : 400, color: on ? "#faf6ec" : COLORS.textSoft }}>{m}</div>
                      {on && <div style={{ fontSize: height * 0.03, marginTop: 2 }}>🌱</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── PINNED "EL TRUCO" CARD (push-pin + thumb + arrow) ── */}
          <div style={{ position: "absolute", left: width * 1.14, top: height * 0.36, width: width * 0.32, opacity: tipOp, transform: `translateY(${tipY}px) rotate(-2deg)` }}>
            {/* arrow from left */}
            <svg width={170} height={90} viewBox="0 0 170 90" style={{ position: "absolute", left: -158, top: 40 }}>
              <path d="M4 45 C 55 45, 95 22, 150 38" fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round" strokeDasharray={280} strokeDashoffset={280 * (1 - arrowDraw)} />
              {arrowDraw > 0.8 && <path d="M136 26 L154 38 L134 50" fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            <div style={{ position: "relative", background: pastel, border: `2px solid ${accent}`, borderRadius: 20, padding: "30px 26px 26px", boxShadow: "0 24px 54px rgba(42,38,32,0.2)", display: "flex", gap: 18, alignItems: "center" }}>
              {/* red push-pin holding the card */}
              <svg width={54} height={54} viewBox="0 0 54 54" style={{ position: "absolute", top: -24, left: "50%", marginLeft: -27, filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.35))" }}>
                <line x1={27} y1={26} x2={27} y2={50} stroke="#8a8a8a" strokeWidth={3} />
                <circle cx={27} cy={20} r={16} fill="#C0392B" />
                <circle cx={22} cy={15} r={5} fill="rgba(255,255,255,0.55)" />
              </svg>
              {/* crop thumbnail */}
              <div style={{ width: height * 0.12, height: height * 0.12, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: "3px solid #fff", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" }}>
                <Img src={asset(images[focus])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: height * 0.028, letterSpacing: 2, textTransform: "uppercase", color: accent, fontWeight: 700, marginBottom: 6 }}>El truco</div>
                <div style={{ fontFamily: SERIF, fontSize: height * 0.038, color: COLORS.text, lineHeight: 1.3 }}>{tip}</div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default CropShowcase;
