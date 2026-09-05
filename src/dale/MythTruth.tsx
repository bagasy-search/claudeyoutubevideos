// MythTruth.tsx — MYTH (✗ rojo, tachado) vs TRUTH (✓ brass). El truth entra después.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Keyring } from "./RayStage";

const CrossX: React.FC<{ frame: number; size?: number }> = ({ frame, size = 62 }) => {
  const p = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const L = 100; // longitud de trazo del path
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
      <circle cx="20" cy="20" r="18" fill={rgba(V.danger, 0.14)} stroke={rgba(V.danger, 0.55)} strokeWidth="2" />
      <path d="M12 12 L28 28" fill="none" stroke={V.danger} strokeWidth="4.5" strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - Math.min(1, p * 2))} />
      <path d="M28 12 L12 28" fill="none" stroke={V.danger} strokeWidth="4.5" strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - Math.max(0, p * 2 - 1))} />
    </svg>
  );
};

const CheckMark: React.FC<{ frame: number; size?: number }> = ({ frame, size = 62 }) => {
  const p = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const L = 90;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
      <circle cx="20" cy="20" r="18" fill={rgba(V.brass, 0.14)} stroke={rgba(V.brass, 0.6)} strokeWidth="2" />
      <path d="M11 21 L18 28 L30 13" fill="none" stroke={V.brass} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
    </svg>
  );
};

export const MythTruth: React.FC<{
  myth?: string;
  truth?: string;
  kicker?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  kicker = "THE GAP",
  myth = "Hidden = safe",
  truth = "Where everyone looks = found first",
  bed,
}) => {
  const frame = useCurrentFrame();
  const aK = enter(frame, 8);
  const aMyth = enter(frame - 6, 9);
  const aTruth = enter(frame - 32, 10);
  // barrido del tachado sobre el myth
  const strike = interpolate(frame - 20, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const Row: React.FC<{
    a: number; icon: React.ReactNode; tag: string; tagColor: string;
    text: string; struck?: boolean; edge: string;
  }> = ({ a, icon, tag, tagColor, text, struck, edge }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        width: "100%",
        opacity: a,
        transform: `translateX(${((1 - a) * -40).toFixed(1)}px)`,
        padding: "26px 34px",
        background: rgba(V.ink0, 0.74),
        borderRadius: 10,
        borderLeft: `6px solid ${edge}`,
        boxShadow: "0 10px 34px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ flexShrink: 0, width: 108 }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2.6,
            color: tagColor,
            padding: "4px 12px",
            border: `1.5px solid ${rgba(tagColor, 0.55)}`,
            borderRadius: 4,
          }}
        >
          {tag}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <div
          style={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.04,
            color: struck ? V.bone : V.white,
            textShadow: "0 4px 22px rgba(0,0,0,0.9)",
          }}
        >
          {text}
        </div>
        {struck ? (
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: 0,
              height: 4,
              width: `${(strike * 100).toFixed(1)}%`,
              background: V.danger,
              borderRadius: 2,
              boxShadow: `0 0 14px ${rgba(V.danger, 0.6)}`,
            }}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.66} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8%",
          gap: 30,
        }}
      >
        {kicker ? (
          <div
            style={{
              alignSelf: "flex-start",
              opacity: aK,
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: V.brass,
              textShadow: "0 3px 14px rgba(0,0,0,0.8)",
            }}
          >
            {kicker}
          </div>
        ) : null}

        <Row
          a={aMyth}
          icon={<CrossX frame={frame - 6} />}
          tag="MYTH"
          tagColor={V.danger}
          text={myth}
          struck
          edge={V.danger}
        />
        <Row
          a={aTruth}
          icon={<CheckMark frame={frame - 32} />}
          tag="TRUTH"
          tagColor={V.brass}
          text={truth}
          edge={V.brass}
        />
      </AbsoluteFill>

      <div style={{ position: "absolute", right: "5%", bottom: "7%", opacity: aTruth * 0.9 }}>
        <Keyring size={30} />
      </div>
    </AbsoluteFill>
  );
};
