import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {CountUp} from "../components/CountUp";
import {Media} from "../components/Media";
import {drift, kenBurns} from "../lib/anim";

type ContourRunoffComparisonProps = {
  durationInFrames: number;
  image: string;
};

const ContourLines: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [12, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const flowOpacity = interpolate(frame, [0, 18, 56, 72], [0, 0.42, 0.42, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
      >
        <defs>
          <linearGradient id="contour-ink" x1="0" x2="1">
            <stop offset="0" stopColor="#e7ca82" stopOpacity="0.08" />
            <stop offset="0.2" stopColor="#f2d590" stopOpacity="0.84" />
            <stop offset="0.76" stopColor="#e8c77e" stopOpacity="0.72" />
            <stop offset="1" stopColor="#e7ca82" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="runoff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe3e5" stopOpacity="0.06" />
            <stop offset="0.5" stopColor="#c6e8e9" stopOpacity="0.55" />
            <stop offset="1" stopColor="#d9f2ef" stopOpacity="0.04" />
          </linearGradient>
          <filter id="contour-glow" x="-20%" y="-30%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="flow-tip"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#c6e8e9" fillOpacity="0.62" />
          </marker>
        </defs>

        {[
          "M1080 30 C1040 220 1135 385 1090 565 C1050 720 1150 870 1100 1050",
          "M1305 10 C1250 190 1360 350 1300 540 C1255 710 1370 875 1320 1060",
          "M1535 30 C1485 220 1580 375 1530 555 C1485 730 1600 880 1540 1050",
          "M1760 20 C1710 205 1810 380 1755 560 C1700 740 1815 900 1760 1055",
        ].map((path, index) => (
          <path
            key={path}
            d={path}
            fill="none"
            stroke="url(#runoff)"
            strokeWidth={index % 2 === 0 ? 5 : 4}
            strokeDasharray="15 18"
            strokeDashoffset={-frame * (1.6 + index * 0.12)}
            markerEnd="url(#flow-tip)"
            opacity={flowOpacity}
          />
        ))}

        {[
          "M700 235 C890 145 1125 170 1320 245 C1515 320 1695 285 1910 190",
          "M650 350 C875 255 1095 280 1290 350 C1495 425 1695 390 1925 285",
          "M640 480 C835 385 1080 400 1280 480 C1485 560 1690 520 1925 410",
          "M670 615 C875 515 1080 535 1295 615 C1505 690 1705 650 1930 545",
          "M720 755 C920 650 1120 675 1325 750 C1515 820 1715 800 1930 690",
          "M790 900 C980 805 1190 820 1380 885 C1570 950 1750 930 1930 835",
        ].map((path, index) => {
          const length = 2100;
          return (
            <g key={path}>
              <path
                d={path}
                fill="none"
                stroke="rgba(13,20,14,0.72)"
                strokeWidth={13}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - reveal)}
              />
              <path
                d={path}
                fill="none"
                stroke="url(#contour-ink)"
                strokeWidth={index === 2 ? 7 : 5}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - reveal)}
                filter="url(#contour-glow)"
              />
            </g>
          );
        })}

        {[
          [1115, 270],
          [1310, 365],
          [1510, 530],
          [1740, 665],
          [1215, 835],
        ].map(([x, y], index) => {
          const scale = interpolate(frame, [30 + index * 4, 42 + index * 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <g
              key={`${x}-${y}`}
              transform={`translate(${x} ${y}) rotate(-17) scale(${scale})`}
            >
              <rect
                x="-35"
                y="-5"
                width="70"
                height="10"
                rx="5"
                fill="#f1d28a"
                fillOpacity="0.9"
              />
              <circle cx="-43" cy="0" r="4" fill="#fff2c3" />
              <circle cx="43" cy="0" r="4" fill="#fff2c3" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const DataCard: React.FC<{
  index: number;
  value: number;
  prefix: string;
  suffix: string;
  qualifier?: string;
}> = ({index, value, prefix, suffix, qualifier}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delay = 18 + index * 12;
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {damping: 19, stiffness: 112, mass: 0.88},
  });
  const cardDrift = drift(frame, 17 + index * 5, 0.24, 3.4);
  const glintX = interpolate(frame, [delay + 27, delay + 49], [-240, 730], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const glintOpacity =
    index === 1
      ? interpolate(
          frame,
          [delay + 26, delay + 31, delay + 43, delay + 50],
          [0, 0.3, 0.16, 0],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        )
      : 0;

  return (
    <div
      style={{
        position: "relative",
        width: 620,
        height: 214,
        borderRadius: 34,
        overflow: "hidden",
        padding: "28px 34px",
        boxSizing: "border-box",
        opacity: entrance,
        transform: `translate(${(1 - entrance) * -44 + cardDrift.x}px, ${
          (1 - entrance) * 22 + cardDrift.y
        }px) scale(${0.94 + entrance * 0.06}) rotate(${cardDrift.r * 0.12}deg)`,
        background:
          "linear-gradient(135deg, rgba(251,248,233,0.96), rgba(225,217,190,0.91))",
        border: "1px solid rgba(255,246,214,0.82)",
        boxShadow:
          "0 28px 76px rgba(5,12,8,0.5), 0 1px 0 rgba(255,255,255,0.82) inset, 0 -18px 50px rgba(93,72,36,0.09) inset",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.17,
          backgroundImage:
            "repeating-linear-gradient(8deg, rgba(69,52,28,0.2) 0, rgba(69,52,28,0.2) 1px, transparent 1px, transparent 7px)",
          maskImage: "linear-gradient(90deg, transparent, black 40%, transparent)",
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 20,
          color: "#243227",
          fontFamily: '"Avenir Next", "Segoe UI", Arial, sans-serif',
          whiteSpace: "nowrap",
        }}
      >
        {prefix && (
          <div
            style={{
              alignSelf: "flex-start",
              marginTop: 24,
              padding: "9px 13px 8px",
              borderRadius: 999,
              background: "#344b36",
              color: "#f4e6bd",
              fontSize: 18,
              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: 2.6,
              boxShadow: "0 7px 18px rgba(28,47,31,0.2)",
            }}
          >
            {prefix}
          </div>
        )}
        {qualifier && (
          <div
            style={{
              alignSelf: "flex-start",
              marginTop: 24,
              marginRight: -9,
              padding: "9px 13px 8px",
              borderRadius: 999,
              background: "#9e6c31",
              color: "#fff4d2",
              fontSize: 18,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: 2.6,
              boxShadow: "0 7px 18px rgba(83,49,17,0.25)",
            }}
          >
            {qualifier}
          </div>
        )}
        <div
          style={{
            fontSize: 108,
            lineHeight: 0.86,
            fontWeight: 860,
            letterSpacing: -6,
            fontVariantNumeric: "tabular-nums",
            color: "#263d2a",
            textShadow: "0 2px 0 rgba(255,255,255,0.72)",
          }}
        >
          <CountUp from={0} to={value} duration={34} delay={delay + 5} suffix="%" />
        </div>
        <div
          style={{
            maxWidth: 220,
            color: "#4b5547",
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 29,
            lineHeight: 1.08,
            fontWeight: 700,
            whiteSpace: "normal",
          }}
        >
          {suffix}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -70,
          bottom: -70,
          left: glintX,
          width: 58,
          transform: "rotate(16deg)",
          opacity: glintOpacity,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export const ContourRunoffComparison_v0tohhe3cvs6: React.FC<
  ContourRunoffComparisonProps
> = ({durationInFrames, image}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const imageScale = kenBurns(frame, Math.max(1, durationInFrames), 1.035, 1.095);
  const imageDrift = drift(frame, 9, 0.18, 8);
  const titleIn = spring({
    frame: frame - 3,
    fps,
    config: {damping: 20, stiffness: 92, mass: 0.95},
  });
  const footerIn = interpolate(frame, [46, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        backgroundColor: "#162119",
        opacity: endFade,
      }}
    >
      <Media
        src={image}
        style={{
          position: "absolute",
          inset: -20,
          width: "calc(100% + 40px)",
          height: "calc(100% + 40px)",
          objectFit: "cover",
          transform: `translate(${imageDrift.x}px, ${imageDrift.y}px) scale(${imageScale})`,
          filter: "saturate(0.88) contrast(1.08) brightness(0.75)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(10,18,12,0.87) 0%, rgba(10,18,12,0.59) 35%, rgba(10,18,12,0.05) 68%), radial-gradient(circle at 73% 48%, transparent 25%, rgba(7,13,9,0.34) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -105,
          top: -80,
          width: 940,
          height: 1240,
          background: "rgba(19,31,21,0.28)",
          filter: "blur(42px)",
          transform: "rotate(-4deg)",
        }}
      />

      <ContourLines />

      <div
        style={{
          position: "absolute",
          inset: "62px 86px 58px 94px",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Avenir Next", "Segoe UI", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * -22}px)`,
          }}
        >
          <div
            style={{
              width: 70,
              height: 3,
              borderRadius: 99,
              background: "#e6c980",
              boxShadow: "0 0 18px rgba(230,201,128,0.45)",
            }}
          />
          <div
            style={{
              color: "#fff8e6",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 49,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: -0.7,
              textShadow: "0 5px 24px rgba(0,0,0,0.52)",
            }}
          >
            CONTOUR + STRIP CROPPING
          </div>
        </div>

        <div
          style={{
            marginTop: 92,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <DataCard
            index={0}
            value={50}
            prefix="ABOUT"
            suffix="LESS EROSION"
          />
          <DataCard
            index={1}
            value={75}
            prefix=""
            qualifier="UP TO"
            suffix="IN ONE ARRANGEMENT"
          />
        </div>

        <div
          style={{
            marginTop: "auto",
            alignSelf: "flex-start",
            padding: "13px 21px 12px",
            borderRadius: 999,
            color: "rgba(255,248,226,0.91)",
            background: "rgba(20,31,22,0.72)",
            border: "1px solid rgba(231,202,130,0.3)",
            boxShadow: "0 14px 35px rgba(0,0,0,0.28)",
            fontSize: 17,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 3.2,
            opacity: footerIn,
            transform: `translateY(${(1 - footerIn) * 14}px)`,
          }}
        >
          SLOPE • SOIL • RAIN • WIDTH MATTER
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ContourRunoffComparison: React.FC<
  ContourRunoffComparisonProps
> = ContourRunoffComparison_v0tohhe3cvs6;
