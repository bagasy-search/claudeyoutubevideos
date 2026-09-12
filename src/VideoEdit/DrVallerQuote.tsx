import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DR_VALLER_QUOTE_FRAMES = 240;

export type DrVallerQuoteProps = {
  portrait?: string;
  quote?: string;
  name?: string;
  credential?: string;
  label?: string;
  accent?: string;
  backgroundMedia?: string;
  backgroundType?: "image" | "video";
  backgroundStartFrom?: number;
};

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Background: React.FC<{
  media?: string;
  type: "image" | "video";
  startFrom: number;
  accent: string;
}> = ({media, type, startFrom, accent}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, DR_VALLER_QUOTE_FRAMES - 1], [0, 1], clamp);
  const mediaStyle: React.CSSProperties = {
    position: "absolute",
    inset: -35,
    width: "calc(100% + 70px)",
    height: "calc(100% + 70px)",
    objectFit: "cover",
    transform: `translate3d(${-18 + progress * 36}px, ${-9 + progress * 18}px, 0) scale(${1.08 + progress * 0.035})`,
    filter: "saturate(.72) contrast(1.08) brightness(.62)",
  };

  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#081016"}}>
      {media ? (
        type === "video" ? (
          <OffthreadVideo src={media} muted startFrom={startFrom} style={mediaStyle} />
        ) : (
          <Img src={media} style={mediaStyle} />
        )
      ) : (
        <AbsoluteFill
          style={{
            transform: `scale(${1.03 + progress * 0.035}) rotate(${Math.sin(frame / 72) * 0.25}deg)`,
            background: [
              `radial-gradient(circle at ${25 + progress * 18}% 28%, ${accent}54 0%, transparent 28%)`,
              "radial-gradient(circle at 78% 72%, #39556f 0%, transparent 34%)",
              "linear-gradient(125deg, #12242d 0%, #17212b 43%, #090f16 100%)",
            ].join(","),
          }}
        />
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,12,.28), rgba(3,8,12,.58)), radial-gradient(circle at 50% 48%, transparent 15%, rgba(1,5,9,.46) 82%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: interpolate(frame % 180, [0, 179], [-28, 118]),
          top: -280,
          width: 240,
          height: 1500,
          transform: "rotate(18deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent)",
          filter: "blur(28px)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: 0.1,
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,.045) 4px)",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

const SmallPortrait: React.FC<{portrait: string; accent: string}> = ({portrait, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - 2,
    fps,
    config: {damping: 16, stiffness: 110, mass: 0.9},
    durationInFrames: 34,
  });
  const float = Math.sin(frame / 28) * 2.5;
  const y = interpolate(enter, [0, 1], [92, 0]);
  const imageStyle: React.CSSProperties = {
    position: "absolute",
    width: 330,
    height: 440,
    left: "50%",
    bottom: -35,
    marginLeft: -165,
    objectFit: "contain",
    objectPosition: "center bottom",
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 68,
        width: 420,
        height: 415,
        marginLeft: -210,
        opacity: enter,
        transform: `translate3d(0, ${y + float}px, 0)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 52,
          width: 264,
          height: 264,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}65, ${accent}20 46%, transparent 72%)`,
          filter: "blur(20px)",
          transform: `scale(${0.98 + Math.sin(frame / 34) * 0.025})`,
        }}
      />
      <Img
        src={portrait}
        style={{
          ...imageStyle,
          transform: "translate(15px, 20px)",
          filter: "brightness(0) blur(13px)",
          opacity: 0.5,
        }}
      />
      <Img
        src={portrait}
        style={{
          ...imageStyle,
          filter:
            "drop-shadow(0 18px 22px rgba(0,0,0,.55)) drop-shadow(0 0 1px rgba(255,255,255,.75))",
        }}
      />
    </div>
  );
};

const TypewrittenQuote: React.FC<{
  quote: string;
  accent: string;
}> = ({quote, accent}) => {
  const frame = useCurrentFrame();
  const typeStart = 42;
  const typeEnd = 148;
  const typedCharacters = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, quote.length], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    }),
  );
  const typed = quote.slice(0, typedCharacters);
  const cursorActive = typedCharacters < quote.length || frame < typeEnd + 22;
  const cursorVisible = cursorActive && Math.floor(Math.max(0, frame - typeStart) / 7) % 2 === 0;
  const settle = interpolate(frame, [typeEnd - 8, typeEnd + 18], [0, 1], clamp);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 180,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 48,
        fontWeight: 650,
        lineHeight: 1.18,
        letterSpacing: -1.6,
        color: "#111316",
      }}
    >
      <span>{typed}</span>
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: 48,
          marginLeft: 6,
          verticalAlign: -7,
          borderRadius: 2,
          background: accent,
          opacity: cursorVisible ? 1 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: -25,
          width: 120 * settle,
          height: 5,
          borderRadius: 999,
          background: accent,
        }}
      />
    </div>
  );
};

const WhiteQuoteCard: React.FC<{
  quote: string;
  name: string;
  credential: string;
  label: string;
  accent: string;
}> = ({quote, name, credential, label, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - 10,
    fps,
    config: {damping: 19, stiffness: 105, mass: 0.95},
    durationInFrames: 36,
  });
  const meta = interpolate(frame, [23, 39], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(enter, [0, 1], [105, 0]);
  const slightTilt = interpolate(enter, [0, 0.72, 1], [-2.2, 0.35, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 388,
        width: 1080,
        height: 430,
        marginLeft: -540,
        opacity: enter,
        transform: `translate3d(0, ${y}px, 0) rotate(${slightTilt}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          transform: "translate(22px, 28px)",
          borderRadius: 12,
          background: "rgba(0,0,0,.28)",
          filter: "blur(24px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          overflow: "hidden",
          background: "#f7f5ef",
          boxShadow:
            "0 32px 90px rgba(0,0,0,.44), 0 3px 0 rgba(255,255,255,.45) inset, 0 0 0 1px rgba(15,18,20,.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: accent,
            transformOrigin: "left center",
            transform: `scaleX(${enter})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 24,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 116,
            lineHeight: 1,
            color: "rgba(15,17,19,.08)",
          }}
        >
          “
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 48,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: meta,
          transform: `translateY(${(1 - meta) * 10}px)`,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2.8,
            color: "#17191c",
            textTransform: "uppercase",
          }}
        >
          {name}
        </span>
        <span style={{width: 1, height: 18, background: "rgba(17,19,22,.2)"}} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.8,
            color: "rgba(17,19,22,.52)",
            textTransform: "uppercase",
          }}
        >
          {credential}
        </span>
        <span
          style={{
            marginLeft: "auto",
            padding: "8px 13px",
            border: "1px solid rgba(17,19,22,.13)",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.8,
            color: "rgba(17,19,22,.58)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      <div style={{position: "absolute", left: 64, right: 64, top: 118}}>
        <TypewrittenQuote quote={quote} accent={accent} />
      </div>
    </div>
  );
};

export const DrVallerQuote: React.FC<DrVallerQuoteProps> = ({
  portrait = staticFile("img/dr-valler.png"),
  quote = "El cuerpo rara vez grita de golpe. Primero susurra.",
  name = "Dr. Valler",
  credential = "Médico · bienestar adulto",
  label = "Consejo",
  accent = "#5bb7ad",
  backgroundMedia,
  backgroundType = "video",
  backgroundStartFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [DR_VALLER_QUOTE_FRAMES - 18, DR_VALLER_QUOTE_FRAMES - 1], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const sceneFloat = Math.sin(frame / 48) * 2;

  return (
    <AbsoluteFill style={{background: "#081016", overflow: "hidden", opacity: exit}}>
      <Background
        media={backgroundMedia}
        type={backgroundType}
        startFrom={backgroundStartFrom}
        accent={accent}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(0, ${sceneFloat}px, 0)`,
        }}
      >
        <SmallPortrait portrait={portrait} accent={accent} />
        <WhiteQuoteCard
          quote={quote}
          name={name}
          credential={credential}
          label={label}
          accent={accent}
        />
      </div>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 150px rgba(0,0,0,.48), inset 0 -70px 100px rgba(0,0,0,.25)",
        }}
      />
    </AbsoluteFill>
  );
};
