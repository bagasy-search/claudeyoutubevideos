import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FLOATING_ADVICE_3D_FRAMES = 540;

type AdviceItem = {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  image: string;
  accent: string;
};

export type FloatingAdvice3DProps = {
  items?: AdviceItem[];
};

const DEFAULT_ITEMS: AdviceItem[] = [
  {
    number: "01",
    eyebrow: "HIDRATACIÓN",
    title: "UN VASO\nA TIEMPO",
    body: "Tomalo una hora antes de acostarte.",
    note: "OBSERVE CÓMO DESPIERTA",
    image: "img/fed886_bedside_water_v2.png",
    accent: "#8FD0C8",
  },
  {
    number: "02",
    eyebrow: "RESPIRACIÓN",
    title: "ESCUCHE\nLA NOCHE",
    body: "Ronquidos, boca seca o dolor de cabeza son señales.",
    note: "EL DESCANSO PUEDE INTERRUMPIRSE",
    image: "img/fed886_dry_mouth_v2.png",
    accent: "#9EBBFF",
  },
  {
    number: "03",
    eyebrow: "CENA",
    title: "MENOS PESO,\nMÁS DESCANSO",
    body: "Elija una cena liviana y deje pasar dos horas.",
    note: "RECUPERARSE EN LUGAR DE DIGERIR",
    image: "img/fed886_light_dinner.png",
    accent: "#E9B44C",
  },
];

const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E";

const progress = (frame: number, from: number, to: number, easing = EASE_OUT) =>
  interpolate(frame, [from, to], [0, 1], {...CLAMP, easing});

const transitionPulse = (frame: number, center: number, radius = 18) =>
  interpolate(
    Math.abs(frame - center),
    [0, radius],
    [1, 0],
    CLAMP,
  );

const focusPositionAt = (frame: number) => {
  const firstMove = progress(frame, 174, 208, EASE_IN_OUT);
  const secondMove = progress(frame, 314, 348, EASE_IN_OUT);
  return firstMove + secondMove;
};

const activeIndexAt = (frame: number) => {
  if (frame < 191) return 0;
  if (frame < 331) return 1;
  return 2;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const offsetX = (frame * 17) % 160;
  const offsetY = (frame * 11) % 160;

  return (
    <AbsoluteFill
      style={{
        opacity: 0.075,
        mixBlendMode: "soft-light",
        pointerEvents: "none",
      }}
    >
      <Img
        src={GRAIN_DATA_URI}
        style={{
          position: "absolute",
          left: -160 + offsetX,
          top: -160 + offsetY,
          width: 2240,
          height: 1400,
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};

const AmbientImageLayers: React.FC<{
  items: AdviceItem[];
  focusPosition: number;
}> = ({items, focusPosition}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#050A12"}}>
      {items.map((item, index) => {
        const proximity = Math.max(0, 1 - Math.abs(index - focusPosition));
        const parallaxX = (index - focusPosition) * 120 + Math.sin((frame + index * 31) / 55) * 18;
        const parallaxY = Math.cos((frame + index * 19) / 63) * 12;

        return (
          <Img
            key={item.number}
            src={staticFile(item.image)}
            style={{
              position: "absolute",
              inset: -100,
              width: 2120,
              height: 1280,
              objectFit: "cover",
              opacity: 0.04 + proximity * 0.3,
              filter: "blur(28px)",
              transform: `translate3d(${parallaxX * 1.25}px, ${parallaxY * 1.2}px, 0) scale(${1.1 + proximity * 0.06})`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(48,84,126,0.36), transparent 46%), linear-gradient(180deg, rgba(4,8,15,0.22), rgba(3,7,13,0.82))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `perspective(900px) rotateX(66deg) translateY(${270 + (frame % 96)}px) scale(1.7)`,
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black, transparent 70%)",
          opacity: 0.58,
        }}
      >
        {Array.from({length: 22}).map((_, index) => (
          <div
            key={`grid-v-${index}`}
            style={{
              position: "absolute",
              left: index * 96,
              top: 0,
              bottom: 0,
              width: 1,
              background: "rgba(143,208,200,0.08)",
            }}
          />
        ))}
        {Array.from({length: 14}).map((_, index) => (
          <div
            key={`grid-h-${index}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: index * 96,
              height: 1,
              background: "rgba(143,208,200,0.08)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CinematicLightField: React.FC<{
  accent: string;
  cutPulse: number;
}> = ({accent, cutPulse}) => {
  const frame = useCurrentFrame();
  const breath = 0.82 + Math.sin(frame / 27) * 0.12;
  const orbit = Math.sin(frame / 46) * 120;
  const beamX = ((frame * 2.4) % 2400) - 420;

  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: 430 + orbit,
          top: 120 + Math.cos(frame / 51) * 42,
          width: 1060,
          height: 760,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${accent}38 0%, ${accent}18 38%, transparent 72%)`,
          filter: "blur(42px)",
          opacity: breath + cutPulse * 0.18,
          transform: `scale(${1 + Math.sin(frame / 63) * 0.08})`,
          mixBlendMode: "screen",
        }}
      />

      {[0, 1, 2].map((index) => (
        <div
          key={`beam-${index}`}
          style={{
            position: "absolute",
            left: -240 + index * 720 + Math.sin((frame + index * 35) / 58) * 80,
            top: -450,
            width: 280 + index * 70,
            height: 1900,
            background: `linear-gradient(90deg, transparent, ${index === 1 ? accent : "rgba(156,192,255,0.2)"}, transparent)`,
            filter: "blur(48px)",
            opacity: 0.08 + index * 0.025,
            transform: `rotate(${18 + index * 13}deg) translateY(${Math.sin((frame + index * 22) / 72) * 60}px)`,
            mixBlendMode: "screen",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: beamX,
          top: -100,
          width: 220,
          height: 1400,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          filter: "blur(18px)",
          opacity: 0.34,
          transform: "rotate(17deg)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

const ForegroundPrisms: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
      {[-1, 1].map((side, index) => {
        const x = side < 0 ? -170 : 1770;
        const drift = Math.sin((frame + index * 44) / 48) * 46;
        return (
          <div
            key={side}
            style={{
              position: "absolute",
              left: x + drift,
              top: 60 + index * 170,
              width: 320,
              height: 880,
              borderRadius: 80,
              border: `1px solid ${accent}22`,
              background: `linear-gradient(${side < 0 ? 110 : 250}deg, transparent, ${accent}14, rgba(255,255,255,0.035), transparent)`,
              filter: "blur(11px)",
              opacity: 0.58,
              transform: `rotate(${side * 9}deg) perspective(700px) rotateY(${side * 32}deg)`,
              boxShadow: `0 0 90px ${accent}16`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
      {Array.from({length: 34}).map((_, index) => {
        const left = random(`dust-x-${index}`) * 100;
        const top = random(`dust-y-${index}`) * 100;
        const size = 1 + random(`dust-s-${index}`) * 4;
        const speed = 0.08 + random(`dust-v-${index}`) * 0.2;
        const travel = ((frame * speed + index * 19) % 150) - 25;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              borderRadius: 999,
              background: index % 3 === 0 ? "#8FD0C8" : "#FFFFFF",
              boxShadow: "0 0 14px currentColor",
              opacity: 0.08 + random(`dust-o-${index}`) * 0.3,
              transform: `translate3d(${travel * 0.35}px, ${-travel}px, 0)`,
            }}
          />
        );
      })}

      {Array.from({length: 5}).map((_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const x = side < 0 ? -130 + index * 18 : 1660 + index * 22;
        const y = 120 + index * 178 + Math.sin((frame + index * 33) / 45) * 22;
        const size = 180 + index * 54;

        return (
          <div
            key={`bokeh-${index}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: 999,
              background: index % 2 ? "rgba(233,180,76,0.12)" : "rgba(143,208,200,0.11)",
              filter: "blur(38px)",
              transform: `translate3d(${Math.sin((frame + index * 20) / 70) * 34}px, 0, 0) scale(${1 + Math.sin((frame + index * 12) / 60) * 0.06})`,
              opacity: 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const FocusCorners: React.FC<{accent: string; strength: number}> = ({accent, strength}) => {
  const frame = useCurrentFrame();
  const aperture = 8 + Math.sin(frame / 19) * 5;
  const corners: React.CSSProperties[] = [
    {left: -18 - aperture, top: -18 - aperture, borderLeft: `2px solid ${accent}`, borderTop: `2px solid ${accent}`},
    {right: -18 - aperture, top: -18 - aperture, borderRight: `2px solid ${accent}`, borderTop: `2px solid ${accent}`},
    {left: -18 - aperture, bottom: -18 - aperture, borderLeft: `2px solid ${accent}`, borderBottom: `2px solid ${accent}`},
    {right: -18 - aperture, bottom: -18 - aperture, borderRight: `2px solid ${accent}`, borderBottom: `2px solid ${accent}`},
  ];

  return (
    <>
      {corners.map((style, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            opacity: strength * (0.78 + Math.sin(frame / 14) * 0.16),
            filter: `drop-shadow(0 0 10px ${accent})`,
            ...style,
          }}
        />
      ))}
    </>
  );
};

const AdviceCard: React.FC<{
  item: AdviceItem;
  index: number;
  focusPosition: number;
  transitionBlur: number;
}> = ({item, index, focusPosition, transitionBlur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const relative = index - focusPosition;
  const distance = Math.abs(relative);
  const focusStrength = Math.max(0, 1 - distance);
  const entrance = spring({
    frame: frame - index * 7,
    fps,
    config: {damping: 16, stiffness: 125, mass: 0.9},
  });
  const cardFloat = Math.sin((frame + index * 29) / 26) * (9 + distance * 12);
  const orbitX = Math.sin((frame + index * 41) / 43) * (18 + distance * 22);
  const orbitY = Math.cos((frame + index * 23) / 51) * (9 + distance * 13);
  const x = relative * 620 + orbitX;
  const y = distance * 54 + cardFloat + orbitY + (1 - entrance) * 160;
  const z = -distance * 350 + Math.sin((frame + index * 17) / 39) * 22 - (1 - entrance) * 720;
  const rotateY = relative * -20 + Math.sin((frame + index * 31) / 61) * (1.4 + distance * 1.8);
  const rotateX = relative * 2.8 + Math.sin((frame + index * 17) / 47) * 1.8;
  const rotateZ = Math.sin((frame + index * 37) / 73) * (0.35 + distance * 0.5);
  const activeBreath = 1 + Math.sin((frame + index * 14) / 22) * 0.008 * focusStrength;
  const scale = entrance * (0.94 + focusStrength * 0.09) * activeBreath;
  const blur = (1 - focusStrength) * 7 + transitionBlur * (0.3 + focusStrength * 0.7);
  const opacity = entrance * (0.42 + focusStrength * 0.58);
  const imagePush = 1.055 + focusStrength * 0.035 + Math.sin((frame + index * 12) / 55) * 0.012;
  const imageDriftX = Math.sin((frame + index * 20) / 48) * (8 + focusStrength * 8);
  const imageDriftY = Math.cos((frame + index * 27) / 57) * 7;
  const sheen = ((frame - index * 18) % 108) / 108;
  const scanY = ((frame * 1.8 + index * 110) % 760) - 80;
  const detailIn = progress(focusStrength, 0.45, 0.92);
  const titlePulse = 1 + Math.sin((frame + index * 17) / 18) * 0.009 * focusStrength;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 820,
        height: 600,
        marginLeft: -410,
        marginTop: -300,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        zIndex: Math.round(focusStrength * 100 + index),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -100,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${item.accent}48, ${item.accent}12 42%, transparent 72%)`,
          filter: "blur(32px)",
          opacity: focusStrength * (0.72 + Math.sin(frame / 24) * 0.14),
          transform: `translate3d(${Math.sin(frame / 34) * 22}px, ${Math.cos(frame / 41) * 16}px, -90px)`,
          mixBlendMode: "screen",
        }}
      />

      {[3, 2, 1].map((layer) => (
        <div
          key={`depth-${layer}`}
          style={{
            position: "absolute",
            inset: layer * 5,
            borderRadius: 34,
            border: `1px solid ${item.accent}${layer === 1 ? "42" : "1F"}`,
            background: "rgba(8,16,27,0.44)",
            transform: `translate3d(${layer * -9}px, ${layer * 12}px, ${layer * -28}px)`,
            boxShadow: `0 18px ${28 + layer * 12}px rgba(0,0,0,0.45)`,
            opacity: 0.42 + focusStrength * 0.22,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 18,
          borderRadius: 42,
          background: "rgba(0,0,0,0.7)",
          filter: "blur(40px)",
          transform: "translate3d(0, 52px, -90px) scale(0.98)",
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 34,
          overflow: "hidden",
          background: "#0A111B",
          border: `1px solid rgba(255,255,255,${0.2 + focusStrength * 0.28})`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 ${item.accent}66, 0 0 ${120 * focusStrength}px ${item.accent}3A, 0 28px 90px rgba(0,0,0,0.58)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Img
          src={staticFile(item.image)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `translate3d(${relative * -12 + imageDriftX}px, ${cardFloat * -0.28 + imageDriftY}px, -12px) scale(${imagePush})`,
          }}
        />

        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(5,10,18,0.94) 0%, rgba(5,10,18,0.83) 38%, rgba(5,10,18,0.18) 73%, rgba(5,10,18,0.03) 100%), linear-gradient(0deg, rgba(2,5,10,0.7), transparent 58%)",
          }}
        />

        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${72 + Math.sin(frame / 45) * 8}% ${30 + Math.cos(frame / 52) * 8}%, rgba(255,255,255,0.22), ${item.accent}18 28%, transparent 58%)`,
            opacity: 0.55 + focusStrength * 0.45,
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${-30 + sheen * 115}%`,
            width: "20%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transform: "skewX(-18deg)",
            opacity: focusStrength,
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${item.accent}99, rgba(255,255,255,0.82), ${item.accent}99, transparent)`,
            boxShadow: `0 0 18px ${item.accent}`,
            opacity: focusStrength * 0.52,
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 54,
            top: 50,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 5,
            color: item.accent,
          }}
        >
          <span style={{width: 42, height: 2, background: item.accent, boxShadow: `0 0 22px ${item.accent}`}} />
          {item.eyebrow}
        </div>

        <div
          style={{
            position: "absolute",
            left: 50,
            top: 104,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 134,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: -9,
            color: `${item.accent}40`,
            textShadow: `0 0 42px ${item.accent}35`,
            transform: `translateX(${Math.sin((frame + index * 9) / 31) * 5}px)`,
          }}
        >
          {item.number}
        </div>

        <div
          style={{
            position: "absolute",
            left: 54,
            top: 248,
            whiteSpace: "pre-line",
            maxWidth: 510,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 51,
            lineHeight: 0.98,
            fontWeight: 850,
            letterSpacing: -2.2,
            color: "#F7FAFF",
            textShadow: `0 5px 26px rgba(0,0,0,0.65), 0 0 34px ${item.accent}22`,
            transform: `translate3d(${Math.sin(frame / 36) * 3}px, ${Math.cos(frame / 42) * 2}px, 24px) scale(${titlePulse})`,
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            position: "absolute",
            left: 54,
            top: 362,
            width: 112 + Math.sin(frame / 20) * 18,
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${item.accent}, transparent)`,
            boxShadow: `0 0 20px ${item.accent}`,
            opacity: focusStrength,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 54,
            bottom: 78,
            width: 500,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 23,
            lineHeight: 1.35,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.9)",
            opacity: detailIn,
            transform: `translateY(${(1 - detailIn) * 18}px)`,
          }}
        >
          {item.body}
        </div>

        <div
          style={{
            position: "absolute",
            left: 54,
            bottom: 32,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3.2,
            color: "rgba(255,255,255,0.64)",
          }}
        >
          {item.note}
        </div>

        <div
          style={{
            position: "absolute",
            right: 30,
            top: 30,
            padding: "11px 17px",
            borderRadius: 999,
            border: `1px solid ${item.accent}88`,
            background: `linear-gradient(135deg, rgba(5,10,18,0.76), ${item.accent}18)`,
            color: item.accent,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2.5,
            opacity: detailIn,
            boxShadow: `0 0 28px ${item.accent}24, inset 0 0 14px ${item.accent}12`,
          }}
        >
          EN FOCO
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 5,
            background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
            opacity: 0.45 + focusStrength * 0.55,
            boxShadow: `0 0 34px ${item.accent}`,
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 18,
            top: 168,
            display: "flex",
            flexDirection: "column",
            gap: 13,
            opacity: focusStrength * 0.72,
          }}
        >
          {[0, 1, 2, 3, 4].map((tick) => (
            <div
              key={tick}
              style={{
                width: tick === Math.floor((frame / 10) % 5) ? 26 : 12,
                height: 2,
                background: tick === Math.floor((frame / 10) % 5) ? item.accent : "rgba(255,255,255,0.28)",
                boxShadow: tick === Math.floor((frame / 10) % 5) ? `0 0 14px ${item.accent}` : "none",
              }}
            />
          ))}
        </div>
      </div>

      <FocusCorners accent={item.accent} strength={focusStrength * entrance} />
    </div>
  );
};

const EditorialHud: React.FC<{
  items: AdviceItem[];
  activeIndex: number;
}> = ({items, activeIndex}) => {
  const frame = useCurrentFrame();
  const intro = progress(frame, 0, 24);
  const outro = progress(frame, 472, 520, EASE_IN_OUT);
  const item = items[activeIndex];
  const pulse = 0.78 + Math.sin(frame / 12) * 0.18;
  const energyX = ((frame * 5.2) % 420) - 60;

  return (
    <AbsoluteFill style={{pointerEvents: "none", fontFamily: "Arial, Helvetica, sans-serif"}}>
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 42,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 18px 14px 20px",
          borderRadius: 999,
          border: `1px solid ${item.accent}42`,
          background: "rgba(7,13,22,0.52)",
          boxShadow: `0 0 34px ${item.accent}16, inset 0 1px 0 rgba(255,255,255,0.12)`,
          color: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px)",
          opacity: intro * (1 - outro),
          transform: `translateX(${(1 - intro) * 26}px)`,
        }}
      >
        <div>
          <div style={{fontSize: 9, letterSpacing: 3.5, fontWeight: 800, color: item.accent}}>SECUENCIA ACTIVA</div>
          <div style={{marginTop: 4, fontSize: 12, letterSpacing: 2.2, fontWeight: 700}}>{item.eyebrow}</div>
        </div>
        <span style={{width: 1, height: 30, background: "rgba(255,255,255,0.18)"}} />
        <span style={{fontSize: 42, lineHeight: 0.8, fontWeight: 300, color: item.accent, textShadow: `0 0 22px ${item.accent}`}}>
          0{activeIndex + 1}
        </span>
        <span style={{fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.48)"}}>/ 0{items.length}</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 36,
          width: 1080,
          marginLeft: -540,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12,
          opacity: intro * (1 - outro),
        }}
      >
        {items.map((entry, index) => {
          const reached = index <= activeIndex;
          const active = index === activeIndex;
          return (
            <div
              key={entry.number}
              style={{
                position: "relative",
                width: active ? 420 : 300,
                height: active ? 66 : 48,
                padding: "0 16px",
                opacity: active ? 1 : 0.48,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  color: active ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                }}
              >
                <span style={{fontSize: active ? 13 : 10, letterSpacing: 2.8, fontWeight: 800}}>{entry.eyebrow}</span>
                <span style={{fontSize: active ? 20 : 13, fontWeight: 300, color: reached ? entry.accent : "rgba(255,255,255,0.32)"}}>
                  {entry.number}
                </span>
              </div>

              <div
                style={{
                  position: "relative",
                  height: active ? 4 : 2,
                  overflow: "hidden",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.11)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: reached ? "100%" : "0%",
                    background: `linear-gradient(90deg, ${entry.accent}55, ${entry.accent}, ${entry.accent}55)`,
                    boxShadow: active ? `0 0 18px ${entry.accent}` : "none",
                    opacity: active ? pulse : 0.5,
                  }}
                />
                {active ? (
                  <div
                    style={{
                      position: "absolute",
                      left: energyX,
                      top: -4,
                      width: 86,
                      height: 12,
                      background: `radial-gradient(ellipse, #FFFFFF, ${entry.accent} 24%, transparent 70%)`,
                      filter: "blur(2px)",
                      mixBlendMode: "screen",
                    }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const FloatingAdvice3D: React.FC<FloatingAdvice3DProps> = ({items = DEFAULT_ITEMS}) => {
  const frame = useCurrentFrame();
  const focusPosition = focusPositionAt(frame);
  const activeIndex = activeIndexAt(frame);
  const activeItem = items[activeIndex];
  const cutPulse = Math.max(
    transitionPulse(frame, 191),
    transitionPulse(frame, 331),
  );
  const rackBlur = Math.sin(cutPulse * Math.PI) * 7;
  const intro = progress(frame, 0, 34);
  const pullOut = progress(frame, 470, 530, EASE_IN_OUT);
  const cameraX = Math.sin(frame / 44) * 18 + Math.sin(frame / 17) * 4;
  const cameraY = Math.cos(frame / 53) * 11 + Math.sin(frame / 29) * 4;
  const cameraRoll = Math.sin(frame / 78) * 0.36;
  const cameraBreath = Math.sin(frame / 31) * 0.012;
  const stageScale = 0.91 + intro * 0.11 + cameraBreath + cutPulse * 0.025 - pullOut * 0.2;
  const stageY = (1 - intro) * 110 - pullOut * 28;
  const sweepProgress =
    frame >= 165 && frame <= 217
      ? progress(frame, 165, 217, EASE_IN_OUT)
      : frame >= 305 && frame <= 357
        ? progress(frame, 305, 357, EASE_IN_OUT)
        : 0;
  const lightSweepX = interpolate(sweepProgress, [0, 1], [-35, 135], CLAMP);

  return (
    <AbsoluteFill style={{backgroundColor: "#050A12", overflow: "hidden"}}>
      <AmbientImageLayers items={items} focusPosition={focusPosition} />
      <CinematicLightField accent={activeItem.accent} cutPulse={cutPulse} />
      <Atmosphere />

      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1480 + Math.sin(frame / 57) * 90,
          perspectiveOrigin: `${50 + Math.sin(frame / 68) * 1.3}% ${48 + Math.cos(frame / 74) * 1.2}%`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `translate3d(${cameraX}px, ${stageY + cameraY}px, 0) rotateZ(${cameraRoll}deg) scale(${stageScale})`,
          }}
        >
          {items.map((item, index) => (
            <AdviceCard
              key={item.number}
              item={item}
              index={index}
              focusPosition={focusPosition}
              transitionBlur={rackBlur}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${lightSweepX}%`,
          width: "16%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)",
          transform: "skewX(-16deg)",
          opacity: cutPulse * 0.9,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {[-1, 0, 1].map((strip) => (
        <div
          key={`transition-strip-${strip}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 420 + strip * 92,
            height: 54,
            background: `linear-gradient(90deg, transparent, ${activeItem.accent}2F, rgba(255,255,255,0.16), ${activeItem.accent}2F, transparent)`,
            filter: "blur(8px)",
            opacity: cutPulse * (0.32 - Math.abs(strip) * 0.07),
            transform: `translateX(${strip * 80 + (1 - cutPulse) * (strip === 0 ? -420 : 420)}px) skewX(-18deg)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ))}

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.66)",
          pointerEvents: "none",
        }}
      />
      <EditorialHud items={items} activeIndex={activeIndex} />
      <ForegroundPrisms accent={activeItem.accent} />

      <AbsoluteFill
        style={{
          backgroundColor: "rgba(3,7,13,0.72)",
          opacity: pullOut,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          opacity: pullOut,
          transform: `translateY(${(1 - pullOut) * 34}px)`,
          pointerEvents: "none",
        }}
      >
        <div>
          <div style={{fontSize: 12, letterSpacing: 7, color: "#8FD0C8", fontWeight: 800}}>SISTEMA DE TRES PASOS</div>
          <div style={{marginTop: 20, fontSize: 54, letterSpacing: -2.4, color: "#FFFFFF", fontWeight: 800}}>
            UNA LISTA. TRES PLANOS DE DECISIÓN.
          </div>
        </div>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
