import { Fragment } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONT_STACK, SPRING_SOFT, SPRING_SNAPPY, sec } from "../theme";
import { F_INTER } from "../kit/premium/theme";
import { SceneFrame } from "../components/SceneFrame";
import { SfxCue, SFX } from "../components/Sfx";
import { followCam } from "../lib/followcam";

// GENERIC, data-driven comparison bar chart. Topic-agnostic — pass the bars per
// video (A/C "3" vs Earth-Tube "29"; compost C:N ratios; cost per country...).
// Works VERTICAL (columns) or HORIZONTAL (rows). Palette-aware via `accent`.
//
// Rule 14 — every object is ALIVE: bars grow ONE BY ONE (staggered), each value
// COUNTS UP, the winner pulses, labels fade in — and EACH of those animations
// carries its own SFX (whoosh on title, a pop/tick as each bar starts growing,
// a ding when the winning bar lands).
export type Bar = {
  label: string;
  value: number; // numeric for the bar height + count-up
  display?: string; // optional formatted value text (e.g. "29×", "$1.2k")
  sub?: string;
  tone?: keyof typeof TONES; // override color per bar
  winner?: boolean; // highlight (full accent + pulse + ding)
};

const TONES = {
  accent: COLORS.accent,
  amber: COLORS.amber,
  good: COLORS.good,
  cold: COLORS.cold,
  danger: COLORS.danger,
} as const;

// Paleta clínica teal (Dr. Federer médico). Se activa con `medico`; por defecto la
// terrosa de COLORS queda intacta para los canales earthy que usan BarCompare directo.
const MED = {
  text: "#14232B",
  textSoft: "rgba(20,35,43,0.66)",
  textDim: "rgba(20,35,43,0.40)",
  track: "rgba(20,35,43,0.06)",
  tones: { accent: "#12B3AE", amber: "#E6A23C", good: "#2FA36B", cold: "#2E7DB0", danger: "#E4141B" },
} as const;
const EARTH = {
  text: COLORS.text,
  textSoft: COLORS.textSoft,
  textDim: COLORS.textDim,
  track: "rgba(42,38,32,0.05)",
  tones: TONES,
} as const;

const BOX_W = 1560;
const BOX_H = 820;

export const BarCompare: React.FC<{
  durationInFrames: number;
  eyebrow?: string;
  title?: string;
  bars: Bar[];
  orientation?: "vertical" | "horizontal";
  unit?: string; // appended to the counted value when no `display`
  accent?: keyof typeof TONES;
  hue?: "blue" | "cold" | "amber" | "red";
  startAt?: number; // frame the staggered reveal begins (default sec(0.4))
  stagger?: number; // frames between each bar (default sec(0.7))
  medico?: boolean; // paleta clínica teal (canal Dr. Federer); def earthy
}> = ({
  durationInFrames,
  eyebrow,
  title,
  bars,
  orientation = "vertical",
  unit = "",
  accent = "accent",
  hue = "cold",
  startAt = sec(0.6),
  stagger = sec(1.5),
  medico = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: SPRING_SOFT });
  const P = medico ? MED : EARTH;
  const FONT = medico ? F_INTER : FONT_STACK;
  const C = P.tones[accent];

  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const horizontal = orientation === "horizontal";

  // plot area
  const plotTop = title || eyebrow ? 190 : 90;
  const plotBottom = BOX_H - 70;
  const plotH = plotBottom - plotTop;
  const plotLeft = horizontal ? 360 : 120;
  const plotRight = BOX_W - 120;
  const plotW = plotRight - plotLeft;

  // follow-cam: enfoca cada barra al crecer y al final se aleja para ver todas
  const slotC = horizontal ? plotH / bars.length : plotW / bars.length;
  const camTargets = bars.map((_, i) => horizontal
    ? { at: startAt + i * stagger, x: plotLeft + plotW * 0.42, y: plotTop + slotC * (i + 0.5) }
    : { at: startAt + i * stagger, x: plotLeft + slotC * (i + 0.5), y: plotTop + plotH * 0.55 });
  const cam = followCam({ frame, fps, targets: camTargets, cx: BOX_W / 2, cy: BOX_H / 2, hold: 1.0, zPunch: 1.26, zHold: 1.14, zTravel: 1.03, endHold: 1.2 });

  return (
    <SceneFrame durationInFrames={durationInFrames} hue={hue} bg={medico ? "white" : "grid"} glowY={42} drift={0.5}>
      <div style={{ width: BOX_W, height: BOX_H, position: "relative", fontFamily: FONT }}>
        {/* SFX: soft whoosh as the chart title/frame enters */}
        <SfxCue at={Math.max(0, startAt - sec(0.3))} src={SFX.transition} volume={0.4} />

        {(eyebrow || title) && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 5, opacity: head, transform: `translateY(${(1 - head) * -14}px)` }}>
            {eyebrow && (
              <div style={{ letterSpacing: 6, fontSize: 19, fontWeight: 700, textTransform: "uppercase", color: P.textDim }}>
                {eyebrow}
              </div>
            )}
            {title && (
              <div style={{ fontSize: 52, fontWeight: 800, color: P.text, marginTop: 8 }}>{title}</div>
            )}
          </div>
        )}

        <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} width={BOX_W} height={BOX_H} style={{ position: "absolute", inset: 0, transformOrigin: "center center", transform: cam.transform, filter: cam.blur > 0.2 ? `blur(${cam.blur}px)` : undefined }}>
          {/* baseline / axis, draws in with the head spring */}
          <line
            x1={plotLeft}
            y1={horizontal ? plotTop : plotBottom}
            x2={horizontal ? plotLeft : plotRight}
            y2={plotBottom}
            stroke={P.textDim}
            strokeWidth={2}
            opacity={head * 0.6}
          />

          {bars.map((b, i) => {
            const t0 = startAt + i * stagger;
            const grow = spring({ frame: frame - t0, fps, config: SPRING_SNAPPY });
            const appear = interpolate(grow, [0, 0.001], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // continuous shimmer once grown
            const shimmer = 0.5 + 0.5 * Math.sin((frame - t0) / 16 + i);
            const barColor = b.tone ? P.tones[b.tone] : b.winner ? C : P.textSoft;
            const lit = b.winner ? 1 : 0.82 + 0.18 * shimmer;
            const ratio = b.value / maxVal;
            const counted = Math.round(b.value * grow);
            const valText = b.display ?? `${counted}${unit}`;

            const slot = horizontal ? plotH / bars.length : plotW / bars.length;
            const thick = Math.min(horizontal ? 96 : 150, slot * 0.56);

            if (horizontal) {
              const cy = plotTop + slot * (i + 0.5);
              const len = plotW * ratio * grow;
              return (
                <g key={i} opacity={appear}>
                  {/* track */}
                  <rect x={plotLeft} y={cy - thick / 2} width={plotW} height={thick} rx={thick / 2} fill={P.track} />
                  {/* bar */}
                  <rect x={plotLeft} y={cy - thick / 2} width={len} height={thick} rx={thick / 2} fill={barColor} opacity={lit} style={{ filter: `drop-shadow(0 6px 18px ${barColor}55)` }} />
                  {/* LÍQUIDO: gloss superior + barrido specular + menisco en el borde */}
                  {len > thick * 0.4 && (
                    <>
                      <rect x={plotLeft} y={cy - thick / 2 + 3} width={len} height={thick * 0.34} rx={thick / 2} fill="rgba(255,255,255,0.16)" />
                      <ellipse cx={plotLeft + len - thick * 0.18} cy={cy} rx={thick * 0.16} ry={thick * 0.46} fill="rgba(255,255,255,0.22)" />
                      {(() => {
                        const sh = interpolate(frame, [t0 + sec(0.5), t0 + sec(1.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                        if (sh <= 0 || sh >= 1) return null;
                        const sx = plotLeft + len * sh;
                        return <rect x={sx - 13} y={cy - thick / 2} width={26} height={thick} fill="rgba(255,255,255,0.20)" transform={`skewX(-18)`} style={{ transformOrigin: `${sx}px ${cy}px`, mixBlendMode: "screen" }} />;
                      })()}
                    </>
                  )}
                  {/* row label (left) */}
                  <text x={plotLeft - 28} y={cy + 8} textAnchor="end" fontSize={30} fontWeight={800} fill={P.text} fontFamily={FONT}>{b.label}</text>
                  {b.sub && (
                    <text x={plotLeft - 28} y={cy + 36} textAnchor="end" fontSize={19} fontWeight={600} fill={P.textDim} fontFamily={FONT}>{b.sub}</text>
                  )}
                  {/* value (end of bar) */}
                  <text x={plotLeft + len + 18} y={cy + 12} textAnchor="start" fontSize={36} fontWeight={900} fill={barColor} fontFamily={FONT} opacity={grow}>{valText}</text>
                </g>
              );
            }

            const cx = plotLeft + slot * (i + 0.5);
            const h = plotH * ratio * grow;
            return (
              <g key={i} opacity={appear}>
                {/* track */}
                <rect x={cx - thick / 2} y={plotTop} width={thick} height={plotH} rx={thick / 4} fill={P.track} />
                {/* bar (grows up from baseline) */}
                <rect x={cx - thick / 2} y={plotBottom - h} width={thick} height={h} rx={thick / 4} fill={barColor} opacity={lit} style={{ filter: `drop-shadow(0 8px 22px ${barColor}55)` }} />
                {/* value on top */}
                <text x={cx} y={plotBottom - h - 22} textAnchor="middle" fontSize={44} fontWeight={900} fill={barColor} fontFamily={FONT} opacity={grow}>{valText}</text>
                {/* column label below baseline */}
                <text x={cx} y={plotBottom + 42} textAnchor="middle" fontSize={28} fontWeight={800} fill={P.text} fontFamily={FONT}>{b.label}</text>
                {b.sub && (
                  <text x={cx} y={plotBottom + 70} textAnchor="middle" fontSize={19} fontWeight={600} fill={P.textDim} fontFamily={FONT}>{b.sub}</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* SFX per bar: a pop/tick the moment each bar STARTS growing; a brighter
            ui ding when a winner bar lands. POPS rotate so they don't sound identical. */}
        {bars.map((b, i) => {
          const t0 = startAt + i * stagger;
          return (
            <Fragment key={"sfx" + i}>
              <SfxCue at={t0 - sec(0.25)} src={SFX.camTravel} volume={0.3} durationInFrames={sec(0.5)} />
              <SfxCue at={t0} src={SFX.barGrow} volume={0.45} durationInFrames={sec(0.9)} />
              <SfxCue at={t0 + sec(0.55)} src={SFX.barLand} volume={0.4} />
              {b.winner && <SfxCue at={t0 + sec(0.7)} src={SFX.winnerChime} volume={0.5} />}
            </Fragment>
          );
        })}
      </div>
    </SceneFrame>
  );
};
