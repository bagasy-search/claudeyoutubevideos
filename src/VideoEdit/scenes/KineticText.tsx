import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

// Kinetic typography: the phrase builds word-by-word, each word springing in with overshoot,
// snapped to the Whisper word times (`times` = frame offsets from beat start). The key word
// (wrapped in *asterisks*) slams in with an accent highlight box. Drop-in for the old KeyPhrase.
const ACCENT: Record<string, string> = { amber: "#FFC400", good: "#39d98a", danger: "#ff4d3d", gold: "#FFC400" };

export const KineticText: React.FC<{
  durationInFrames: number; text: string; src?: string; accent?: string;
  times?: number[]; position?: string; blur?: boolean; fontSize?: number;
}> = ({ durationInFrames, text, src, accent = "amber", times, position = "center", blur = true, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const col = ACCENT[accent] || accent || "#FFC400";
  const words = text.split(/\s+/).filter(Boolean);
  // onsets (frames): use provided word times, else spread across the first ~65% of the beat
  const onsets = words.map((_, i) =>
    times && times[i] != null ? Math.max(0, times[i]) : Math.round((durationInFrames * 0.06) + i * (durationInFrames * 0.6 / Math.max(1, words.length))));

  const bgPush = interpolate(frame, [0, durationInFrames], [1.08, 1.16], { extrapolateRight: "clamp" });
  const fs = fontSize ?? (words.join(" ").length > 34 ? 74 : 92);
  const justify = position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center";

  return (
    <AbsoluteFill>
      {src && (
        <AbsoluteFill>
          {/(\.mp4|\.webm|\.mov)$/i.test(src) ? (
            <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover",
              filter: `${blur ? "blur(9px) " : ""}brightness(0.5) saturate(1.05)`, transform: `scale(${bgPush})` }} />
          ) : (
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover",
              filter: `${blur ? "blur(9px) " : ""}brightness(0.5) saturate(1.05)`, transform: `scale(${bgPush})` }} />
          )}
          <AbsoluteFill style={{ background: "radial-gradient(120% 100% at 50% 60%, transparent 30%, rgba(4,6,12,.55) 100%)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 8% 15%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${fs * 0.16}px ${fs * 0.24}px`, justifyContent: justify, width: "100%", alignContent: "flex-end" }}>
          {words.map((raw, i) => {
            const key = /^\*.*\*$/.test(raw);
            const txt = raw.replace(/\*/g, "");
            const local = frame - onsets[i];
            const p = spring({ frame: local, fps, config: { damping: 12, stiffness: 170, mass: 0.7 } });
            const op = interpolate(local, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const y = (1 - p) * 46;
            const s = interpolate(p, [0, 1], [0.86, 1]);
            const boxP = spring({ frame: local - 2, fps, config: { damping: 14, stiffness: 150, mass: 0.6 } });
            return (
              <div key={i} style={{ position: "relative", fontFamily: 'Anton, "Arial Narrow", "Arial Black", sans-serif',
                fontWeight: 400, fontSize: fs, lineHeight: 1.0, letterSpacing: "0.005em",
                color: key ? "#0a0d14" : "#fff", opacity: op,
                transform: `translateY(${y}px) scale(${s})`, textShadow: key ? "none" : "0 6px 26px rgba(0,0,0,.8)", willChange: "transform,opacity" }}>
                {key && (
                  <div style={{ position: "absolute", inset: "-4px -14px", background: col, borderRadius: 8, zIndex: -1,
                    transformOrigin: "left center", transform: `scaleX(${Math.max(0, Math.min(1, boxP))})`,
                    boxShadow: `0 10px 34px ${col}55` }} />
                )}
                {txt}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default KineticText;
