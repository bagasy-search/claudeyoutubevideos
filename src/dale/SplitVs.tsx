// SplitVs.tsx — split cinematográfico 50/50: izq caro-pero-tonto (rojo), der barato-pero-listo (brass).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, staticFile } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Keyring } from "./RayStage";

export const SplitVs: React.FC<{
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
  leftImage?: string;
  rightImage?: string;
  verdict?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  leftLabel = "On a shelf",
  leftValue = "$2,000",
  rightLabel = "Bolted down",
  rightValue = "$300",
  leftImage,
  rightImage,
  verdict = "Where beats what you paid.",
  bed,
}) => {
  const frame = useCurrentFrame();
  const aL = enter(frame, 9);
  const aR = enter(frame - 8, 9);
  const aVs = interpolate(frame - 18, [0, 10, 18], [0.4, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const aVerdict = enter(frame - 30, 10);

  const Half: React.FC<{
    a: number; side: "left" | "right"; label: string; value: string;
    img?: string; edge: string; valueColor: string; seed: number;
  }> = ({ a, side, label, value, img, edge, valueColor, seed }) => {
    const z = interpolate(frame, [0, 260], [1.03, 1.09], {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
      easing: Easing.linear,
    });
    const dx = side === "left" ? -1 : 1;
    return (
      <div
        style={{
          position: "relative",
          flex: 1,
          height: "100%",
          overflow: "hidden",
          opacity: a,
          transform: `translateX(${((1 - a) * dx * 46).toFixed(1)}px)`,
        }}
      >
        {img ? (
          <Img
            src={staticFile(img)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.66) saturate(0.85)",
              transform: `scale(${z.toFixed(4)})`,
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              background: `radial-gradient(120% 100% at ${side === "left" ? "30%" : "70%"} 30%, ${V.ink2} 0%, ${V.ink0} 72%)`,
            }}
          />
        )}
        {/* tinte de borde por lado */}
        <AbsoluteFill
          style={{
            background:
              side === "left"
                ? `linear-gradient(90deg, ${rgba(edge, 0.28)} 0%, ${rgba(V.ink0, 0.1)} 55%, ${rgba(V.ink0, 0.55)} 100%)`
                : `linear-gradient(270deg, ${rgba(edge, 0.28)} 0%, ${rgba(V.ink0, 0.1)} 55%, ${rgba(V.ink0, 0.55)} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            [side]: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: edge,
            boxShadow: `0 0 26px ${rgba(edge, 0.6)}`,
          }}
        />
        {/* contenido */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: side === "left" ? "flex-start" : "flex-end",
            justifyContent: "center",
            padding: side === "left" ? "0 12% 0 8%" : "0 8% 0 12%",
            textAlign: side === "left" ? "left" : "right",
          }}
        >
          <div
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: rgba(edge, 0.95),
              textShadow: "0 3px 14px rgba(0,0,0,0.85)",
              marginBottom: 8,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 800,
              fontSize: 132,
              lineHeight: 0.9,
              color: valueColor,
              textShadow: `0 0 48px ${rgba(valueColor, 0.32)}, 0 8px 30px rgba(0,0,0,0.92)`,
            }}
          >
            {value}
          </div>
        </AbsoluteFill>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.68} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
        <Half a={aL} side="left" label={leftLabel} value={leftValue} img={leftImage} edge={V.danger} valueColor={V.dangerSoft} seed={1} />
        <Half a={aR} side="right" label={rightLabel} value={rightValue} img={rightImage} edge={V.brass} valueColor={V.brassSoft} seed={2} />
      </AbsoluteFill>

      {/* token VS al centro */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div
          style={{
            transform: `scale(${aVs.toFixed(3)})`,
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: rgba(V.ink0, 0.9),
            border: `3px solid ${V.brass}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px ${rgba(V.brass, 0.45)}, 0 10px 40px rgba(0,0,0,0.7)`,
          }}
        >
          <div
            style={{
              fontFamily: F_DISPLAY,
              fontWeight: 800,
              fontSize: 56,
              color: V.brass,
              letterSpacing: 1,
              textShadow: `0 0 20px ${rgba(V.brass, 0.5)}`,
            }}
          >
            VS
          </div>
        </div>
      </AbsoluteFill>

      {/* strip de veredicto */}
      {verdict ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            opacity: aVerdict,
            transform: `translateY(${((1 - aVerdict) * 26).toFixed(1)}px)`,
            background: `linear-gradient(180deg, ${rgba(V.ink0, 0)} 0%, ${rgba(V.ink0, 0.88)} 42%)`,
            padding: "44px 0 40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 3, background: V.brass, borderRadius: 2 }} />
            <div
              style={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: 52,
                color: V.white,
                letterSpacing: "0.01em",
                textShadow: "0 4px 22px rgba(0,0,0,0.9)",
              }}
            >
              {verdict}
            </div>
            <div style={{ width: 40, height: 3, background: V.brass, borderRadius: 2 }} />
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", right: "3%", top: "6%", opacity: aVs * 0.85 }}>
        <Keyring size={28} />
      </div>
    </AbsoluteFill>
  );
};
