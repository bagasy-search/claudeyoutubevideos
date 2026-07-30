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

type NoduleProofMacroProps = {
  durationInFrames: number;
  image: string;
  focusX?: number;
  focusY?: number;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const NoduleProofMacro_v0tohhe3cvs6: React.FC<
  NoduleProofMacroProps
> = ({durationInFrames, image, focusX = 39, focusY = 52}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({
    frame: frame - 4,
    fps,
    config: {damping: 18, stiffness: 88, mass: 0.9},
  });
  const noteIn = spring({
    frame: frame - 28,
    fps,
    config: {damping: 17, stiffness: 112, mass: 0.8},
  });
  const photoScale = interpolate(
    frame,
    [0, Math.max(durationInFrames - 1, 1)],
    [1.045, 1.12],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );
  const draw = interpolate(frame, [18, 45], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const glow = interpolate(frame, [32, 48, 67], [0, 1, 0.62], clamp);
  const endFade = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(1, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  const glintX = interpolate(frame, [50, 72], [-140, 720], clamp);
  const glintOpacity = interpolate(
    frame,
    [48, 53, 67, 73],
    [0, 0.42, 0.34, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#171b13",
        color: "#fff8e8",
        opacity: endFade,
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
          objectPosition: "34% 50%",
          transform: `scale(${photoScale})`,
          filter: "saturate(.86) contrast(1.05) brightness(.78)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(12,15,10,.05) 0%, rgba(11,14,9,.15) 47%, rgba(12,14,10,.9) 69%, rgba(9,10,8,.97) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 70,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 20}px)`,
        }}
      >
        <div
          style={{
            color: "#dcc28b",
            font: "700 20px/1 Inter, Arial, sans-serif",
            letterSpacing: 5,
          }}
        >
          THE PHYSICAL EVIDENCE
        </div>
        <div
          style={{
            marginTop: 12,
            font: "700 64px/.98 Georgia, serif",
            letterSpacing: -2,
            textShadow: "0 6px 28px rgba(0,0,0,.35)",
          }}
        >
          ROOT NODULE PROOF
        </div>
      </div>

      <svg
        viewBox="0 0 1920 1080"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
      >
        <circle
          cx={(focusX / 100) * 1920}
          cy={(focusY / 100) * 1080}
          r="56"
          fill={`rgba(216,130,130,${0.1 * glow})`}
          stroke={`rgba(248,202,170,${0.9 * draw})`}
          strokeWidth="4"
          strokeDasharray="352"
          strokeDashoffset={352 * (1 - draw)}
          style={{filter: `drop-shadow(0 0 ${22 * glow}px rgba(222,129,120,.8))`}}
        />
        <path
          d={`M ${(focusX / 100) * 1920 + 58} ${(focusY / 100) * 1080 - 8} C 1040 460, 1110 392, 1222 392`}
          fill="none"
          stroke="rgba(236,211,161,.92)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 1195,
          top: 300,
          width: 575,
          padding: "34px 38px 38px",
          borderRadius: 34,
          overflow: "hidden",
          opacity: noteIn,
          transform: `translateX(${(1 - noteIn) * 38}px) scale(${0.97 + noteIn * 0.03})`,
          border: "1px solid rgba(239,211,164,.35)",
          background:
            "linear-gradient(145deg, rgba(255,250,235,.94), rgba(229,220,193,.88))",
          boxShadow:
            "0 34px 90px rgba(0,0,0,.48), inset 0 1px rgba(255,255,255,.9)",
          color: "#24271d",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: glintX,
            width: 90,
            height: 620,
            opacity: glintOpacity,
            transform: "rotate(18deg)",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)",
          }}
        />
        <div
          style={{
            color: "#8f4e4c",
            font: "800 25px/1 Inter, Arial, sans-serif",
            letterSpacing: 2.2,
          }}
        >
          PINK INSIDE
        </div>
        <div
          style={{
            marginTop: 10,
            font: "700 49px/1.02 Georgia, serif",
            letterSpacing: -1.2,
          }}
        >
          ACTIVE FIXATION
        </div>
        <div
          style={{
            marginTop: 26,
            width: 76,
            height: 4,
            borderRadius: 999,
            background: "linear-gradient(90deg, #a9645e, #d1a66a)",
          }}
        />
        <div
          style={{
            marginTop: 24,
            font: "600 27px/1.35 Inter, Arial, sans-serif",
            color: "#4c5140",
          }}
        >
          RHIZOBIA TURN NITROGEN GAS
          <br />
          INTO PLANT TISSUE
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 82,
          color: "#d8cba9",
          font: "500 20px/1.25 Inter, Arial, sans-serif",
          letterSpacing: 1.1,
          opacity: interpolate(frame, [56, 69], [0, 0.9], clamp),
        }}
      >
        COLOR IS A FIELD CLUE — NOT A LAB ASSAY
      </div>
    </AbsoluteFill>
  );
};

export const NoduleProofMacro: React.FC<NoduleProofMacroProps> =
  NoduleProofMacro_v0tohhe3cvs6;
