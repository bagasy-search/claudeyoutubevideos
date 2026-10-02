// HzPriceTag — la etiqueta de feria ("$2") cuelga sobre la foto del OBJETO, se balancea y se da vuelta:
// al dorso, el rango VENDIDO real. Props: bed (foto del objeto), front ("$2"), frontNote, sold ("$150 – $300"),
// soldLabel, item. Reusable para cada revelación de precio del canal.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE } from "./HzTheme";
import { HzBed, Stamp, Tag, ease, useIn } from "./HzParts";

export const HzPriceTag: React.FC<{ bed?: string; front?: string; frontNote?: string; sold: string; soldLabel?: string; item?: string; flipAt?: number; seed?: number; stamp?: string }> = ({ bed, front = "$2", frontNote = "priced to go", sold, soldLabel = "sold listings", item = "", flipAt = 34, seed = 3, stamp = "sold" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const drop = useIn(0, 11, 90);
  const swing = Math.sin((f / fps) * 3.1) * 7 * Math.exp(-f / 45);
  const flip = interpolate(f, [flipAt, flipAt + 14], [0, 180], ease);
  const showBack = flip > 90;
  const y = interpolate(drop, [0, 1], [-700, 0]);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.12} />
      <div style={{ position: "absolute", left: "58%", top: 0, width: 4, height: 250 + y, background: "#8C6A3C", transformOrigin: "top" }} />
      <div style={{ position: "absolute", left: "58%", top: 230, transform: `translate(-50%, ${y}px) rotate(${swing}deg)`, transformOrigin: "50% -60px", perspective: 1600 }}>
        <div style={{ transform: `rotateY(${flip}deg)`, transformStyle: "preserve-3d", position: "relative", width: 620, height: 400 }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <Tag w={620} h={400} hole="top">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: TYPE, fontSize: 36, color: HZ.inkSoft }}>{item}</div>
                <div style={{ fontFamily: SERIF, fontSize: 180, color: HZ.ink, lineHeight: 1 }}>{front}</div>
                <div style={{ fontFamily: TYPE, fontSize: 32, color: HZ.inkSoft }}>{frontNote}</div>
              </div>
            </Tag>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <Tag w={620} h={400} hole="top" color={HZ.paper}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: HZ.red, textTransform: "uppercase" }}>{soldLabel}</div>
                <div style={{ fontFamily: SERIF, fontSize: sold.length > 11 ? 84 : sold.length > 8 ? 100 : 128, color: HZ.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{sold}</div>
                <div style={{ fontFamily: TYPE, fontSize: 30, color: HZ.inkSoft }}>{item}</div>
              </div>
            </Tag>
          </div>
        </div>
        {showBack ? <div style={{ position: "absolute", left: 400, top: 380 }}><Stamp text={stamp} at={flipAt + 16} size={64} rot={-12} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};
