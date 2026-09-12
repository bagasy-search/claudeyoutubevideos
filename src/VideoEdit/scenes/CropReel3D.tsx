import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  staticFile,
} from "remotion";
import { COLORS, SERIF } from "../theme";

// resolve relative asset paths (idempotent: leaves URLs / already-resolved paths alone)
export const asset = (s: string) =>
  typeof s === "string" && !/^(https?:|blob:|data:|\/)/.test(s) ? staticFile(s) : s;

/**
 * CropReel3D — hero "signature" scene for the Sept-crops video.
 *
 * A modern, bright, blurred-bokeh stage holding N floating cards arranged on a
 * gently rotating 3D ring (depth-of-field: front card big & sharp, back cards
 * small & blurred). Every card starts LOCKED + frosted so the crop can't be
 * seen. On each `reveal` the ring eases so that card to the front, its padlock
 * pops open, the frost clears and the photo snaps into focus — with a subtle,
 * non-constant camera push for real-camera feel.
 *
 * Intro: card 0 rises from below while the camera follows it in; then cards
 * 1..N-1 float in around it and the ring starts its slow drift.
 *
 * Driven entirely by props so the Main can anchor `reveals` to Whisper ms.
 */

export type CropReel3DProps = {
  durationInFrames: number;
  images: string[]; // staticFile paths, length N (use 5)
  labels: string[]; // crop names, length N
  numbers?: string[]; // optional big index label per card ("1".."5")
  reveals: number[]; // frame (relative to seq start) each card is revealed/focused
  introDur?: number; // frames for the assemble intro (default 46)
  accent?: string;
};

const TAU = Math.PI * 2;
const rad = (deg: number) => (deg * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ── Padlock that pops open on reveal ─────────────────────────────────────────
export const Padlock: React.FC<{ open: number; size: number }> = ({ open, size }) => {
  // open: 0 (closed) → 1 (open). Shackle rotates up & the whole lock fades once open.
  const shackleRot = interpolate(open, [0, 1], [0, -32]);
  const shackleY = interpolate(open, [0, 1], [0, -size * 0.06]);
  const fade = interpolate(open, [0.55, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jitter = open > 0 && open < 0.5 ? Math.sin(open * 40) * 1.4 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity: fade, transform: `translateX(${jitter}px)`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))" }}
    >
      {/* shackle */}
      <g style={{ transform: `translateY(${shackleY}px) rotate(${shackleRot}deg)`, transformOrigin: "34px 44px" }}>
        <path
          d="M32 46 V34 a18 18 0 0 1 36 0 V46"
          fill="none"
          stroke="#f4efe3"
          strokeWidth={9}
          strokeLinecap="round"
        />
      </g>
      {/* body */}
      <rect x={24} y={44} width={52} height={42} rx={9} fill="#e9e2d2" stroke="#b9ad92" strokeWidth={2} />
      <circle cx={50} cy={62} r={6} fill="#6b6350" />
      <rect x={47.5} y={64} width={5} height={13} rx={2.5} fill="#6b6350" />
    </svg>
  );
};

export const CropReel3D: React.FC<CropReel3DProps> = ({
  durationInFrames,
  images,
  labels,
  numbers,
  reveals,
  introDur = 46,
  accent = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const N = images.length;
  const cx = width / 2;
  const cy = height / 2;

  // ── Ring rotation: idle wobble until first reveal, then eases card→front ────
  const EASE_F = 26; // frames to settle onto a revealed card
  const slotAngle = TAU / N;
  const idleWobble = Math.sin((frame - introDur) * 0.02) * rad(7) + (frame - introDur) * rad(0.05);

  let theta: number;
  if (frame < reveals[0]) {
    theta = idleWobble;
  } else {
    let ai = 0;
    while (ai + 1 < reveals.length && frame >= reveals[ai + 1]) ai++;
    const targetNow = -ai * slotAngle;
    const prevTarget = ai === 0 ? idleWobble : -(ai - 1) * slotAngle;
    const t = easeInOut(Math.min(1, (frame - reveals[ai]) / EASE_F));
    theta = lerp(prevTarget, targetNow, t);
  }

  // ── Camera: intro push that follows the rising card + non-constant drift ────
  const introT = interpolate(frame, [0, introDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const introZoom = interpolate(easeInOut(introT), [0, 1], [1.18, 1.0]);
  const introFollowY = interpolate(easeInOut(introT), [0, 1], [height * 0.16, 0]);

  // subtle continuous handheld-ish drift (never constant)
  const driftX = Math.sin(frame * 0.021) * 10 + Math.sin(frame * 0.047) * 4;
  const driftY = Math.cos(frame * 0.017) * 8;
  const breathe = 1 + Math.sin(frame * 0.03) * 0.008;

  // gentle zoom bump on each reveal (gradual, relaxes back)
  let revealZoom = 1;
  for (const rf of reveals) {
    const dt = frame - rf;
    if (dt >= 0) {
      const b = interpolate(dt, [0, 10, 34], [0, 0.055, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.ease),
      });
      revealZoom += b;
    }
  }
  const camScale = introZoom * breathe * revealZoom;

  // ── Card geometry on the ring ───────────────────────────────────────────────
  const R = Math.min(width, height) * 0.335; // horizontal spread
  const baseW = Math.min(width, height) * 0.375;
  const baseH = baseW * 1.32;

  const cards = images.map((src, i) => {
    const ang = theta + i * slotAngle;
    const depth = Math.cos(ang); // 1 = front, -1 = back
    const x = Math.sin(ang) * R;
    const y = -depth * height * 0.02; // slight arc: front sits a touch lower
    const dn = (depth + 1) / 2; // 0..1
    const scale = lerp(0.58, 1.0, dn);
    const depthBlur = interpolate(depth, [-1, 1], [9, 0]);
    const dim = interpolate(depth, [-1, 1], [0.5, 1]);
    const zIndex = Math.round((depth + 1) * 100);

    // entrance: card 0 rises first; the rest float in staggered after
    let enter = 1;
    let enterY = 0;
    let enterScale = 1;
    if (i === 0) {
      const e = spring({ frame, fps, config: { damping: 200, mass: 0.9 } });
      enter = e;
      enterY = interpolate(e, [0, 1], [height * 0.62, 0]);
      enterScale = interpolate(e, [0, 1], [0.86, 1]);
    } else {
      const start = introDur * 0.42 + (i - 1) * 6;
      const e = spring({ frame: frame - start, fps, config: { damping: 180, mass: 0.8 } });
      enter = e;
      enterY = interpolate(e, [0, 1], [height * 0.22, 0]);
      enterScale = interpolate(e, [0, 1], [0.7, 1]);
    }

    // lock / reveal state for this card
    const rf = reveals[i] ?? Infinity;
    const rev = interpolate(frame - rf, [0, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    const lockBlur = interpolate(rev, [0, 1], [15, 0]);
    const frost = interpolate(rev, [0, 0.8], [1, 0], { extrapolateRight: "clamp" });

    return { i, src, x, y, scale, depthBlur, dim, zIndex, enter, enterY, enterScale, rev, lockBlur, frost, depth };
  });

  return (
    <AbsoluteFill style={{ background: "#f3efe6", overflow: "hidden" }}>
      {/* bright blurred bokeh background */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: -80,
            background:
              "radial-gradient(120% 90% at 50% 30%, #fdfbf6 0%, #f1ece0 55%, #e6dcc7 100%)",
          }}
        />
        {[
          { x: 0.16, y: 0.24, r: 240, c: "rgba(124,138,90,0.28)" },
          { x: 0.82, y: 0.30, r: 300, c: "rgba(169,121,74,0.22)" },
          { x: 0.30, y: 0.82, r: 260, c: "rgba(110,139,71,0.24)" },
          { x: 0.72, y: 0.78, r: 220, c: "rgba(255,255,255,0.55)" },
          { x: 0.50, y: 0.50, r: 340, c: "rgba(255,255,255,0.35)" },
        ].map((b, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: b.x * width,
              top: b.y * height,
              width: b.r,
              height: b.r,
              marginLeft: -b.r / 2,
              marginTop: -b.r / 2,
              borderRadius: "50%",
              background: b.c,
              filter: "blur(60px)",
              transform: `translate(${Math.sin(frame * 0.01 + k) * 18}px, ${Math.cos(frame * 0.013 + k) * 14}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* camera rig */}
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, ${driftY + introFollowY}px) scale(${camScale})`,
          transformOrigin: "50% 46%",
        }}
      >
        <AbsoluteFill style={{ perspective: 1400 }}>
          {cards
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((c) => {
              const w = baseW * c.scale * c.enterScale;
              const h = baseH * c.scale * c.enterScale;
              const totalBlur = Math.max(c.depthBlur, c.lockBlur);
              return (
                <div
                  key={c.i}
                  style={{
                    position: "absolute",
                    left: cx + c.x - w / 2,
                    top: cy + c.y + c.enterY - h / 2,
                    width: w,
                    height: h,
                    zIndex: c.zIndex,
                    opacity: c.enter * c.dim,
                    borderRadius: 22,
                    overflow: "hidden",
                    boxShadow: `0 ${26 * c.scale}px ${60 * c.scale}px rgba(42,38,32,${0.28 * c.scale})`,
                    border: "6px solid #fbf8f1",
                    background: "#e8e2d4",
                  }}
                >
                  <Img
                    src={asset(c.src)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: `blur(${totalBlur}px) saturate(${lerp(0.9, 1.05, c.rev)})`,
                      transform: `scale(${1.06 + (1 - c.rev) * 0.04})`,
                    }}
                  />
                  {/* frosted lock veil */}
                  {c.frost > 0.01 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(247,243,235,0.55)",
                        backdropFilter: "blur(2px)",
                        opacity: c.frost,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Padlock open={c.rev} size={Math.min(w, h) * 0.34} />
                    </div>
                  )}
                  {/* number chip + label once revealed */}
                  {c.rev > 0.4 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "34px 16px 14px",
                        background: "linear-gradient(to top, rgba(28,24,18,0.82), rgba(28,24,18,0))",
                        opacity: interpolate(c.rev, [0.4, 0.85], [0, 1], { extrapolateRight: "clamp" }),
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {numbers?.[c.i] && (
                        <div
                          style={{
                            fontFamily: SERIF,
                            fontSize: h * 0.13,
                            fontWeight: 700,
                            lineHeight: 1,
                            color: accent,
                            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                          }}
                        >
                          {numbers[c.i]}
                        </div>
                      )}
                      <div
                        style={{
                          fontFamily: SERIF,
                          fontSize: h * 0.082,
                          color: "#faf6ec",
                          letterSpacing: 0.3,
                          textShadow: "0 2px 8px rgba(0,0,0,0.55)",
                        }}
                      >
                        {labels[c.i]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default CropReel3D;
