import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type WaterMode =
  | "roof"
  | "cistern"
  | "spring"
  | "gravity"
  | "springhouse"
  | "well"
  | "handpump"
  | "windmill"
  | "rampump"
  | "pond"
  | "treatment"
  | "backflow"
  | "property"
  | "safety";

type WaterSceneProps = {
  durationInFrames: number;
  title: string;
  metric?: string;
  src?: string;
  eyebrow?: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const palette = {
  ink: "#101b18",
  cream: "#fff7e5",
  water: "#7dd7d1",
  water2: "#3b9dad",
  amber: "#e1bd76",
  green: "#a7c98a",
  danger: "#dc876e",
};

const FlowArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
  danger?: boolean;
}> = ({x1, y1, x2, y2, delay = 0, danger = false}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [delay, delay + 28], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const length = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g opacity={reveal}>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * reveal}
        y2={y1 + (y2 - y1) * reveal}
        stroke={danger ? palette.danger : palette.water}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray="15 12"
        strokeDashoffset={-frame * 1.7}
      />
      <circle
        cx={x1 + (x2 - x1) * reveal}
        cy={y1 + (y2 - y1) * reveal}
        r={Math.min(10, length / 18)}
        fill={danger ? palette.danger : palette.cream}
      />
    </g>
  );
};

const Diagram: React.FC<{mode: WaterMode}> = ({mode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: {damping: 18, stiffness: 102, mass: 0.82},
    });
  const rotor = frame * 1.15;
  const wave = Math.sin(frame / 8) * 5;

  if (mode === "roof") {
    return (
      <>
        <polygon
          points="160,290 430,115 700,290"
          fill="rgba(225,189,118,.2)"
          stroke={palette.amber}
          strokeWidth="8"
        />
        <rect
          x="220"
          y="290"
          width="420"
          height="250"
          rx="18"
          fill="rgba(16,27,24,.62)"
          stroke="rgba(255,247,229,.45)"
          strokeWidth="5"
        />
        {Array.from({length: 9}).map((_, index) => (
          <line
            key={index}
            x1={215 + index * 58}
            y1={55 + ((frame * 4 + index * 37) % 180)}
            x2={205 + index * 58}
            y2={85 + ((frame * 4 + index * 37) % 180)}
            stroke={palette.water}
            strokeWidth="6"
            strokeLinecap="round"
            opacity=".72"
          />
        ))}
        <path
          d="M700 290 L760 290 L760 505"
          fill="none"
          stroke={palette.water}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <rect
          x="690"
          y="500"
          width="140"
          height="170"
          rx="28"
          fill="rgba(59,157,173,.35)"
          stroke={palette.water}
          strokeWidth="6"
        />
        <FlowArrow x1={760} y1={330} x2={760} y2={480} delay={8} />
      </>
    );
  }

  if (mode === "cistern") {
    return (
      <>
        <path
          d="M90 255 C300 220 600 250 870 215 L870 680 L90 680 Z"
          fill="rgba(92,70,48,.34)"
        />
        <line
          x1="90"
          y1="255"
          x2="870"
          y2="215"
          stroke={palette.green}
          strokeWidth="7"
        />
        <rect
          x="265"
          y="350"
          width="420"
          height="235"
          rx="72"
          fill="rgba(38,75,78,.78)"
          stroke={palette.water}
          strokeWidth="7"
        />
        <rect
          x="285"
          y={550 - Math.min(155, frame * 2.2)}
          width="380"
          height={35 + Math.min(155, frame * 2.2)}
          rx="52"
          fill="rgba(74,180,190,.48)"
        />
        <path
          d="M160 160 L160 380 L265 380"
          fill="none"
          stroke={palette.water}
          strokeWidth="10"
        />
        <FlowArrow x1={165} y1={205} x2={165} y2={355} delay={4} />
        <circle
          cx="685"
          cy="335"
          r="24"
          fill={palette.danger}
          opacity={0.42 + Math.sin(frame / 9) * 0.2}
        />
      </>
    );
  }

  if (mode === "spring") {
    return (
      <>
        <path
          d="M70 210 C290 125 520 155 880 310 L880 690 L70 690 Z"
          fill="rgba(91,76,49,.42)"
          stroke="rgba(167,201,138,.55)"
          strokeWidth="5"
        />
        <path
          d={`M80 475 C270 ${440 + wave} 400 ${510 - wave} 575 462`}
          fill="none"
          stroke={palette.water}
          strokeWidth="18"
          opacity=".72"
        />
        <rect
          x="545"
          y="345"
          width="230"
          height="215"
          rx="24"
          fill="rgba(20,40,37,.78)"
          stroke={palette.cream}
          strokeWidth="6"
        />
        <rect
          x="580"
          y="390"
          width="160"
          height="125"
          rx="18"
          fill="rgba(59,157,173,.42)"
        />
        <FlowArrow x1={365} y1={475} x2={545} y2={465} delay={10} />
        <FlowArrow x1={775} y1={465} x2={885} y2={465} delay={22} />
      </>
    );
  }

  if (mode === "gravity") {
    const pressure = Math.min(1, frame / 55);
    return (
      <>
        <path
          d="M70 180 C260 130 390 260 530 350 C660 430 760 475 900 540"
          fill="none"
          stroke={palette.green}
          strokeWidth="18"
        />
        <path
          d="M110 210 C295 180 410 302 540 382 C675 465 780 500 900 570"
          fill="none"
          stroke={palette.water}
          strokeWidth="12"
          strokeDasharray="20 12"
          strokeDashoffset={-frame * 2}
        />
        <line
          x1="155"
          y1="205"
          x2="155"
          y2="555"
          stroke={palette.amber}
          strokeWidth="5"
        />
        <path
          d="M135 230 L155 195 L175 230 M135 530 L155 565 L175 530"
          fill="none"
          stroke={palette.amber}
          strokeWidth="6"
        />
        <circle
          cx="745"
          cy="430"
          r="92"
          fill="rgba(16,27,24,.8)"
          stroke={palette.cream}
          strokeWidth="7"
        />
        <line
          x1="745"
          y1="430"
          x2={745 + Math.cos(Math.PI * (1.05 + pressure * 0.9)) * 62}
          y2={430 + Math.sin(Math.PI * (1.05 + pressure * 0.9)) * 62}
          stroke={palette.danger}
          strokeWidth="9"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (mode === "springhouse") {
    return (
      <>
        <rect
          x="190"
          y="225"
          width="560"
          height="390"
          rx="28"
          fill="rgba(27,39,33,.76)"
          stroke={palette.amber}
          strokeWidth="7"
        />
        <polygon
          points="145,240 470,70 795,240"
          fill="rgba(91,65,40,.62)"
          stroke={palette.cream}
          strokeWidth="7"
        />
        <path
          d="M90 525 C260 485 345 560 470 525 C610 485 720 555 880 510"
          fill="none"
          stroke={palette.water}
          strokeWidth="26"
        />
        {[320, 470, 620].map((x, index) => (
          <rect
            key={x}
            x={x}
            y={390 - pop(index * 8) * 16}
            width="74"
            height="112"
            rx="16"
            fill="rgba(255,247,229,.24)"
            stroke={palette.cream}
            strokeWidth="5"
          />
        ))}
        <circle
          cx="700"
          cy="320"
          r="58"
          fill="rgba(16,27,24,.84)"
          stroke={palette.water}
          strokeWidth="6"
        />
        <line
          x1="700"
          y1="320"
          x2="680"
          y2="280"
          stroke={palette.water}
          strokeWidth="7"
        />
      </>
    );
  }

  if (mode === "well") {
    return (
      <>
        <path
          d="M70 230 L890 230 L890 690 L70 690 Z"
          fill="rgba(88,65,45,.44)"
        />
        <ellipse
          cx="470"
          cy="275"
          rx="150"
          ry="55"
          fill="rgba(18,30,27,.9)"
          stroke={palette.cream}
          strokeWidth="7"
        />
        <path
          d="M320 275 L350 650 L590 650 L620 275"
          fill="rgba(15,27,25,.72)"
          stroke={palette.cream}
          strokeWidth="7"
        />
        <rect
          x="350"
          y="505"
          width="240"
          height="145"
          fill="rgba(59,157,173,.52)"
        />
        <line
          x1="470"
          y1="75"
          x2="470"
          y2="520"
          stroke={palette.amber}
          strokeWidth="6"
        />
        <rect
          x="420"
          y={470 + Math.sin(frame / 10) * 12}
          width="100"
          height="74"
          rx="15"
          fill="rgba(225,189,118,.42)"
          stroke={palette.amber}
          strokeWidth="5"
        />
        {[170, 770].map((x) => (
          <circle
            key={x}
            cx={x}
            cy="305"
            r="32"
            fill={palette.danger}
            opacity={0.3 + Math.sin(frame / 8) * 0.18}
          />
        ))}
      </>
    );
  }

  if (mode === "handpump") {
    const arm = Math.sin(frame / 9) * 22;
    return (
      <>
        <rect
          x="375"
          y="160"
          width="180"
          height="390"
          rx="70"
          fill="rgba(30,65,59,.76)"
          stroke={palette.cream}
          strokeWidth="8"
        />
        <path
          d={`M460 205 L690 ${145 + arm}`}
          stroke={palette.amber}
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M510 300 L690 300 L690 385"
          fill="none"
          stroke={palette.cream}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M460 550 L460 690"
          stroke={palette.water}
          strokeWidth="22"
        />
        <FlowArrow x1={460} y1={660} x2={460} y2={390} delay={4} />
        <FlowArrow x1={535} y1={300} x2={675} y2={300} delay={18} />
        <line
          x1="160"
          y1="555"
          x2="820"
          y2="555"
          stroke={palette.danger}
          strokeWidth="5"
          strokeDasharray="14 12"
        />
      </>
    );
  }

  if (mode === "windmill") {
    return (
      <>
        <g transform={`translate(310 245) rotate(${rotor})`}>
          {Array.from({length: 12}).map((_, index) => (
            <path
              key={index}
              d="M0 0 L35 -18 L190 -6 L72 26 Z"
              transform={`rotate(${index * 30})`}
              fill={index % 2 ? "rgba(255,247,229,.36)" : "rgba(125,215,209,.35)"}
              stroke={palette.cream}
              strokeWidth="3"
            />
          ))}
          <circle r="28" fill={palette.amber} />
        </g>
        <path
          d="M310 275 L195 665 M310 275 L425 665 M225 550 L395 550"
          fill="none"
          stroke={palette.cream}
          strokeWidth="9"
        />
        <rect
          x="610"
          y="365"
          width="230"
          height="260"
          rx="45"
          fill="rgba(35,88,91,.68)"
          stroke={palette.water}
          strokeWidth="7"
        />
        <rect
          x="630"
          y={565 - Math.min(150, frame * 1.7)}
          width="190"
          height={40 + Math.min(150, frame * 1.7)}
          rx="35"
          fill="rgba(125,215,209,.35)"
        />
        <FlowArrow x1={390} y1={590} x2={605} y2={500} delay={14} />
      </>
    );
  }

  if (mode === "rampump") {
    return (
      <>
        <path
          d="M80 510 L320 510 L390 430 L555 430"
          fill="none"
          stroke={palette.water}
          strokeWidth="22"
        />
        <rect
          x="420"
          y="330"
          width="165"
          height="215"
          rx="76"
          fill="rgba(34,70,66,.82)"
          stroke={palette.cream}
          strokeWidth="7"
        />
        <circle
          cx="350"
          cy="510"
          r={30 + Math.sin(frame / 7) * 5}
          fill={palette.amber}
          stroke={palette.cream}
          strokeWidth="5"
        />
        <path
          d="M555 430 L710 300 L885 175"
          fill="none"
          stroke={palette.water}
          strokeWidth="17"
        />
        <FlowArrow x1={120} y1={510} x2={315} y2={510} delay={3} />
        <FlowArrow x1={575} y1={410} x2={820} y2={220} delay={20} />
        <path
          d="M350 530 L350 650"
          stroke={palette.water2}
          strokeWidth="14"
          strokeDasharray="12 9"
        />
      </>
    );
  }

  if (mode === "pond") {
    return (
      <>
        <path
          d="M70 220 C300 150 590 235 890 170 L890 690 L70 690 Z"
          fill="rgba(92,68,45,.38)"
        />
        <path
          d="M85 390 C260 350 420 455 590 405 C710 370 805 390 885 360 L885 650 L85 650 Z"
          fill="rgba(59,157,173,.46)"
        />
        <path
          d="M600 185 L690 590 L790 185"
          fill="rgba(85,67,45,.82)"
          stroke={palette.amber}
          strokeWidth="7"
        />
        <path
          d="M715 315 C755 355 780 390 855 410"
          fill="none"
          stroke={palette.water}
          strokeWidth="18"
          strokeDasharray="18 11"
          strokeDashoffset={-frame * 2}
        />
        <circle
          cx="725"
          cy="290"
          r="26"
          fill={palette.danger}
          opacity={0.35 + Math.sin(frame / 8) * 0.22}
        />
      </>
    );
  }

  if (mode === "treatment") {
    const stages = [
      ["SOURCE", palette.water2],
      ["SETTLE", palette.amber],
      ["FILTER", palette.green],
      ["DISINFECT", palette.cream],
    ] as const;
    return (
      <>
        {stages.map(([label, color], index) => {
          const p = pop(index * 8);
          const x = 75 + index * 215;
          return (
            <g
              key={label}
              opacity={p}
              transform={`translate(${x} ${265 + (1 - p) * 35})`}
            >
              <rect
                width="165"
                height="250"
                rx="34"
                fill="rgba(14,30,27,.8)"
                stroke={color}
                strokeWidth="7"
              />
              <rect
                x="18"
                y={185 - index * 28}
                width="129"
                height={48 + index * 28}
                rx="20"
                fill={color}
                opacity=".28"
              />
              <text
                x="82"
                y="296"
                textAnchor="middle"
                fill={palette.cream}
                fontSize="22"
                fontFamily="Arial"
                fontWeight="800"
              >
                {label}
              </text>
            </g>
          );
        })}
        <FlowArrow x1={240} y1={390} x2={285} y2={390} delay={14} />
        <FlowArrow x1={455} y1={390} x2={500} y2={390} delay={24} />
        <FlowArrow x1={670} y1={390} x2={715} y2={390} delay={34} />
      </>
    );
  }

  if (mode === "backflow") {
    return (
      <>
        <path
          d="M90 250 L470 250 L470 520 L860 520"
          fill="none"
          stroke={palette.water}
          strokeWidth="26"
        />
        <path
          d="M90 590 L470 590 L470 520"
          fill="none"
          stroke={palette.danger}
          strokeWidth="26"
        />
        <circle
          cx="470"
          cy="520"
          r={55 + Math.sin(frame / 8) * 7}
          fill="rgba(220,135,110,.22)"
          stroke={palette.danger}
          strokeWidth="8"
        />
        <FlowArrow x1={125} y1={590} x2={420} y2={590} delay={4} danger />
        <FlowArrow x1={470} y1={575} x2={470} y2={330} delay={18} danger />
        <path
          d="M675 470 L730 520 L675 570"
          fill="none"
          stroke={palette.cream}
          strokeWidth="11"
        />
      </>
    );
  }

  if (mode === "property") {
    const nodes = [
      [175, 190],
      [430, 155],
      [735, 230],
      [245, 475],
      [560, 455],
      [810, 570],
    ];
    return (
      <>
        <path
          d="M65 120 C300 50 665 115 900 70 L900 690 L65 690 Z"
          fill="rgba(52,78,49,.34)"
          stroke="rgba(167,201,138,.4)"
          strokeWidth="5"
        />
        {nodes.slice(0, -1).map(([x, y], index) => (
          <FlowArrow
            key={index}
            x1={x}
            y1={y}
            x2={nodes[index + 1][0]}
            y2={nodes[index + 1][1]}
            delay={index * 7}
          />
        ))}
        {nodes.map(([x, y], index) => {
          const p = pop(index * 6);
          return (
            <g key={index} transform={`translate(${x} ${y}) scale(${p})`}>
              <circle r="42" fill="rgba(16,27,24,.86)" stroke={palette.amber} strokeWidth="6" />
              <text
                textAnchor="middle"
                y="11"
                fill={palette.cream}
                fontFamily="Arial"
                fontSize="30"
                fontWeight="900"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </>
    );
  }

  return (
    <>
      <circle
        cx="480"
        cy="360"
        r="230"
        fill="rgba(220,135,110,.13)"
        stroke={palette.danger}
        strokeWidth="10"
        strokeDasharray="24 16"
        strokeDashoffset={-frame * 2}
      />
      <path
        d="M480 195 L625 505 L335 505 Z"
        fill="rgba(220,135,110,.22)"
        stroke={palette.danger}
        strokeWidth="9"
      />
      <line x1="480" y1="285" x2="480" y2="410" stroke={palette.cream} strokeWidth="22" />
      <circle cx="480" cy="460" r="13" fill={palette.cream} />
    </>
  );
};

const WaterSceneCore: React.FC<
  WaterSceneProps & {mode: WaterMode; accent?: string}
> = ({
  durationInFrames,
  title,
  metric,
  src,
  eyebrow = "FIELD SYSTEM",
  mode,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 88, mass: 0.92},
  });
  const end = interpolate(
    frame,
    [Math.max(1, durationInFrames - 12), Math.max(2, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  const camera = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [1.025, 1.075],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 72% 42%,#27564f,#101b18 56%,#09110f)",
        color: palette.cream,
        opacity: end,
      }}
    >
      {src ? (
        <OffthreadVideo
          src={staticFile(src)}
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${camera})`,
            filter: "saturate(.66) contrast(1.08) brightness(.46)",
            opacity: 0.72,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg,rgba(9,17,15,.96),rgba(10,20,18,.74) 44%,rgba(7,14,13,.38)),radial-gradient(circle at 75% 52%,rgba(79,177,170,.17),transparent 36%)",
          backdropFilter: "blur(3px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "70px 82px 66px",
          display: "grid",
          gridTemplateColumns: "0.74fr 1.26fr",
          gap: 44,
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: intro,
            transform: `translateY(${(1 - intro) * 28}px)`,
          }}
        >
          <div
            style={{
              color: palette.water,
              fontFamily: "Arial, sans-serif",
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 5,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
          {metric ? (
            <div
              style={{
                color: palette.amber,
                fontFamily: "Arial, sans-serif",
                fontSize: metric.length > 8 ? 72 : 110,
                lineHeight: 0.88,
                fontWeight: 900,
                letterSpacing: -5,
                marginBottom: 24,
              }}
            >
              {metric}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: title.length > 34 ? 54 : 66,
              lineHeight: 1.01,
              fontWeight: 700,
              letterSpacing: -2,
              textShadow: "0 9px 32px rgba(0,0,0,.48)",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            height: 720,
            borderRadius: 42,
            overflow: "hidden",
            background:
              "linear-gradient(145deg,rgba(22,50,45,.84),rgba(8,19,17,.72))",
            border: "1px solid rgba(125,215,209,.32)",
            boxShadow:
              "0 32px 100px rgba(2,8,6,.44),inset 0 1px rgba(255,255,255,.12)",
            backdropFilter: "blur(15px)",
            opacity: intro,
            transform: `scale(${0.95 + intro * 0.05})`,
          }}
        >
          <svg
            viewBox="0 0 960 720"
            style={{width: "100%", height: "100%"}}
          >
            <Diagram mode={mode} />
          </svg>
        </div>
      </div>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 150px rgba(3,8,6,.48)",
          opacity: 0.35,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.1) .6px,transparent .6px)",
          backgroundSize: "5px 5px",
        }}
      />
    </AbsoluteFill>
  );
};

export const RoofYieldScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="roof" eyebrow="ROOF CATCHMENT" />;
export const CisternCutawayScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="cistern" eyebrow="BURIED STORAGE" />;
export const SpringBoxScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="spring" eyebrow="PROTECTED SOURCE" />;
export const GravityLineScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="gravity" eyebrow="HEIGHT → PRESSURE" />;
export const SpringhouseCoolingScene_v48vr0jexdrms: React.FC<
  WaterSceneProps
> = (props) => <WaterSceneCore {...props} mode="springhouse" eyebrow="PASSIVE COOLING" />;
export const DugWellScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="well" eyebrow="WELL PROTECTION" />;
export const HandPumpScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="handpump" eyebrow="MANUAL LIFT" />;
export const WindmillStorageScene_v48vr0jexdrms: React.FC<
  WaterSceneProps
> = (props) => <WaterSceneCore {...props} mode="windmill" eyebrow="STORE THE WIND" />;
export const RamPumpCycleScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="rampump" eyebrow="WATER HAMMER" />;
export const PondSpillwayScene_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="pond" eyebrow="CONTROLLED OVERFLOW" />;
export const TreatmentTrainScene_v48vr0jexdrms: React.FC<
  WaterSceneProps
> = (props) => <WaterSceneCore {...props} mode="treatment" eyebrow="MULTIPLE BARRIERS" />;
export const BackflowBoundaryScene_v48vr0jexdrms: React.FC<
  WaterSceneProps
> = (props) => <WaterSceneCore {...props} mode="backflow" eyebrow="HIDDEN CONNECTION" />;
export const PropertyWaterMap_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="property" eyebrow="WHOLE PROPERTY" />;
export const WaterSafetyBoundary_v48vr0jexdrms: React.FC<WaterSceneProps> = (
  props,
) => <WaterSceneCore {...props} mode="safety" eyebrow="SAFETY LIMIT" />;

export const EvidencePulse_v48vr0jexdrms: React.FC<{
  durationInFrames: number;
}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 115, mass: 0.72},
  });
  const breathe = 1 + Math.sin(frame / 13) * 0.045;
  const exit = interpolate(
    frame,
    [Math.max(1, durationInFrames - 10), Math.max(2, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        bottom: 70,
        width: 72,
        height: 72,
        borderRadius: 999,
        display: "grid",
        placeItems: "center",
        opacity: entrance * exit,
        transform: `scale(${entrance * breathe})`,
        background:
          "radial-gradient(circle at 35% 28%,rgba(153,233,226,.95),rgba(42,133,142,.9) 58%,rgba(14,50,51,.96))",
        border: "1px solid rgba(224,255,250,.58)",
        boxShadow:
          "0 12px 34px rgba(2,18,20,.38),0 0 0 7px rgba(125,215,209,.10)",
      }}
    >
      <svg width="36" height="43" viewBox="0 0 36 43" aria-hidden="true">
        <path
          d="M18 2C14 10 5 18 5 27c0 8 5.8 14 13 14s13-6 13-14C31 18 22 10 18 2Z"
          fill="rgba(255,255,255,.92)"
        />
        <path
          d="M12 29c1.4 3.4 3.7 5.1 7.1 5.1"
          fill="none"
          stroke="rgba(46,132,142,.82)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const AvatarFieldNote_v48vr0jexdrms: React.FC<
  Omit<WaterSceneProps, "src">
> = ({durationInFrames, title, metric, eyebrow = "FIELD NOTE"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 19, stiffness: 96, mass: 0.82},
  });
  const exit = interpolate(
    frame,
    [Math.max(1, durationInFrames - 10), Math.max(2, durationInFrames - 1)],
    [1, 0],
    clamp,
  );
  return (
    <AbsoluteFill style={{opacity: exit, pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 96,
          width: 650,
          padding: "34px 40px 38px",
          borderRadius: 34,
          opacity: intro,
          transform: `translateX(${(1 - intro) * 48}px)`,
          background:
            "linear-gradient(145deg,rgba(24,42,37,.88),rgba(10,20,17,.74))",
          border: "1px solid rgba(125,215,209,.42)",
          boxShadow:
            "0 28px 84px rgba(3,8,6,.38),inset 0 1px rgba(255,255,255,.15)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            color: palette.water,
            fontFamily: "Arial, sans-serif",
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 4.6,
            marginBottom: 15,
          }}
        >
          {eyebrow}
        </div>
        {metric ? (
          <div
            style={{
              color: palette.amber,
              fontFamily: "Arial, sans-serif",
              fontSize: 70,
              lineHeight: 0.92,
              fontWeight: 900,
              marginBottom: 16,
            }}
          >
            {metric}
          </div>
        ) : null}
        <div
          style={{
            color: palette.cream,
            fontFamily: "Georgia, serif",
            fontSize: 48,
            lineHeight: 1.03,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
