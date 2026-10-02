// HzLotVsPiece — "por lote" contra "por pieza": a la izquierda UNA etiqueta para toda la caja (la oferta del dealer),
// a la derecha las etiquetas pieza por pieza que caen y se suman. Props: bed, lotLabel, lotPrice, pieces[{label, price}],
// total, leftTitle, rightTitle.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE } from "./HzTheme";
import { HzBed, Stamp, Tag, ease, useIn } from "./HzParts";

export const HzLotVsPiece: React.FC<{ bed?: string; lotLabel: string; lotPrice: string; pieces: { label: string; price: string }[]; total: string; leftTitle?: string; rightTitle?: string; seed?: number; every?: number }> = ({ bed, lotLabel, lotPrice, pieces, total, leftTitle = "the dealer's offer", rightTitle = "piece by piece", seed = 61, every = 9 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = useIn(0, 14, 120);
  const totAt = 20 + pieces.length * every + 6;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.38} blur={2} />
      <div style={{ position: "absolute", left: 960, top: 80, bottom: 80, width: 4, background: "rgba(255,253,246,0.6)" }} />
      <div style={{ position: "absolute", left: 120, top: 90, width: 760, textAlign: "center" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 36, letterSpacing: 7, color: HZ.goldSoft, textTransform: "uppercase" }}>{leftTitle}</div>
        <div style={{ display: "inline-block", marginTop: 70, transform: `rotate(-4deg) scale(${inn})` }}>
          <Tag w={560} h={330}><div style={{ textAlign: "center" }}><div style={{ fontFamily: TYPE, fontSize: 38, color: HZ.inkSoft }}>{lotLabel}</div><div style={{ fontFamily: SERIF, fontSize: 150, color: HZ.ink, lineHeight: 1 }}>{lotPrice}</div></div></Tag>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 90, width: 760 }}>
        <div style={{ textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 36, letterSpacing: 7, color: HZ.goldSoft, textTransform: "uppercase" }}>{rightTitle}</div>
        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center" }}>
          {pieces.map((p, i) => {
            const s = spring({ frame: f - (20 + i * every), fps, config: { damping: 12, stiffness: 150 } });
            return (
              <div key={i} style={{ transform: `translateY(${interpolate(s, [0, 1], [-80, 0])}px) rotate(${((i * 53) % 9) - 4}deg)`, opacity: s }}>
                <Tag w={350} h={150}><div><div style={{ fontFamily: TYPE, fontSize: 28, color: HZ.inkSoft, lineHeight: 1.1 }}>{p.label}</div><div style={{ fontFamily: SERIF, fontSize: 60, color: HZ.ink, lineHeight: 1 }}>{p.price}</div></div></Tag>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40, textAlign: "center", opacity: interpolate(f, [totAt, totAt + 6], [0, 1], ease) }}>
          <Stamp text={total} at={totAt} size={92} color={HZ.green} rot={-4} style={{ background: "rgba(255,253,246,0.85)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
