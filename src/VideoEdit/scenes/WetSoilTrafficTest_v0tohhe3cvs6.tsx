import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Media} from "../components/Media";

type WetSoilTrafficTestProps = {
  durationInFrames: number;
  crumbImage: string;
  ribbonImage: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SoilPores: React.FC<{compressed: boolean; reveal: number}> = ({
  compressed,
  reveal,
}) => {
  const frame = useCurrentFrame();
  const compression = compressed
    ? interpolate(frame, [48, 68], [1, 0.34], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      })
    : 1;

  return (
    <div
      style={{
        position: "relative",
        height: 80,
        width: 250,
        opacity: reveal,
        transform: `scaleY(${compression})`,
        transformOrigin: "50% 100%",
      }}
    >
      {Array.from({length: 18}).map((_, index) => {
        const col = index % 6;
        const row = Math.floor(index / 6);
        const size = 22 + ((index * 13) % 18);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: col * 42 + ((row * 17 + index * 7) % 10),
              top: row * 24 + ((index * 9) % 8),
              width: size,
              height: size * 0.72,
              borderRadius: "44% 56% 48% 52%",
              background: index % 3 === 0 ? "#8e6845" : "#b08a61",
              boxShadow: "inset 0 1px 3px rgba(255,255,255,.16)",
            }}
          />
        );
      })}
      {!compressed &&
        Array.from({length: 6}).map((_, index) => (
          <div
            key={`pore-${index}`}
            style={{
              position: "absolute",
              left: 25 + index * 39,
              top: 13 + (index % 2) * 28,
              width: 13,
              height: 18,
              borderRadius: "50%",
              background: "rgba(195,220,210,.68)",
              boxShadow: "0 0 14px rgba(182,213,199,.28)",
            }}
          />
        ))}
    </div>
  );
};

const PhotoPanel: React.FC<{
  image: string;
  title: string;
  subtitle: string;
  accent: string;
  delay: number;
  compressed: boolean;
}> = ({image, title, subtitle, accent, delay, compressed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 90, mass: 0.85},
  });
  const copyOpacity = interpolate(frame, [delay + 14, delay + 24], [0, 1], clamp);
  const photoScale = interpolate(frame, [0, 180], [1.025, 1.075], clamp);
  const poreReveal = interpolate(frame, [delay + 27, delay + 40], [0, 1], clamp);

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        height: 760,
        borderRadius: 36,
        overflow: "hidden",
        border: `1px solid ${accent}88`,
        boxShadow:
          "0 32px 80px rgba(12,10,7,.34), inset 0 1px rgba(255,255,255,.24)",
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 44}px) scale(${0.965 + entrance * 0.035})`,
        background: "#1b2118",
      }}
    >
      <Media
        src={image}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${photoScale})`,
          filter: "saturate(.82) contrast(1.03)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,17,12,.02) 25%, rgba(12,13,10,.86) 73%, rgba(10,10,8,.96))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          bottom: 28,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
          opacity: copyOpacity,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "10px 16px",
              borderRadius: 999,
              color: "#171812",
              background: accent,
              font: "700 22px/1.1 Inter, Arial, sans-serif",
              letterSpacing: 1.3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 14,
              color: "#fff9e9",
              font: "600 31px/1.18 Georgia, serif",
              maxWidth: 410,
              textShadow: "0 2px 14px rgba(0,0,0,.4)",
            }}
          >
            {subtitle}
          </div>
        </div>
        <SoilPores compressed={compressed} reveal={poreReveal} />
      </div>
    </div>
  );
};

export const WetSoilTrafficTest_v0tohhe3cvs6: React.FC<
  WetSoilTrafficTestProps
> = ({durationInFrames, crumbImage, ribbonImage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 84, mass: 0.9},
  });
  const warningIn = spring({
    frame: frame - 56,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.75},
  });
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        opacity: endFade,
        background:
          "radial-gradient(circle at 48% 12%, #5c674f 0%, #283124 38%, #11160f 100%)",
        color: "#fff8e8",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 108,
          right: 108,
          top: 54,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
        }}
      >
        <div>
          <div
            style={{
              color: "#d9c89f",
              font: "700 20px/1 Inter, Arial, sans-serif",
              letterSpacing: 4.4,
            }}
          >
            BEFORE THE FIRST PASS
          </div>
          <div
            style={{
              marginTop: 10,
              font: "700 58px/.98 Georgia, serif",
              letterSpacing: -1.8,
            }}
          >
            WET-SOIL TRAFFIC TEST
          </div>
        </div>
        <div
          style={{
            width: 290,
            color: "#e9dec3",
            font: "500 21px/1.35 Inter, Arial, sans-serif",
            textAlign: "right",
          }}
        >
          The calendar can say go.
          <br />
          The ground gets the last word.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 108,
          right: 108,
          top: 214,
          display: "flex",
          gap: 30,
        }}
      >
        <PhotoPanel
          image={crumbImage}
          title="CRUMBLES"
          subtitle="FIELD MAY BE READY"
          accent="#9eb77a"
          delay={8}
          compressed={false}
        />
        <PhotoPanel
          image={ribbonImage}
          title="SMEARS OR RIBBONS"
          subtitle="WAIT"
          accent="#d18b6a"
          delay={14}
          compressed
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 43,
          padding: "15px 28px",
          borderRadius: 999,
          color: "#fff6e1",
          background:
            "linear-gradient(120deg, rgba(111,68,47,.94), rgba(68,42,31,.96))",
          border: "1px solid rgba(236,177,134,.48)",
          boxShadow: "0 18px 48px rgba(0,0,0,.38)",
          font: "700 22px/1 Inter, Arial, sans-serif",
          letterSpacing: 1.4,
          opacity: warningIn,
          transform: `translateX(-50%) translateY(${(1 - warningIn) * 22}px)`,
        }}
      >
        ONE PASS CAN CRUSH PORES
      </div>
    </AbsoluteFill>
  );
};

export const WetSoilTrafficTest: React.FC<WetSoilTrafficTestProps> =
  WetSoilTrafficTest_v0tohhe3cvs6;
