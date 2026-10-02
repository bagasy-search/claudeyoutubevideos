// HzLotCard — tarjeta de lote de remate que abre cada ítem ("LOT 4 of 8"): la tarjeta manila entra con resorte sobre la
// foto del objeto, el número rojo se estampa y el nombre del ítem se tipea. Props: bed, n, of, title, where (dónde está
// en la casa).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HZ, LABEL, SERIF } from "./HzTheme";
import { HzBed, Stamp, Tag, Typed, useIn } from "./HzParts";

export const HzLotCard: React.FC<{ bed?: string; n: number; of?: number; title: string; where?: string; seed?: number }> = ({ bed, n, of = 8, title, where = "", seed = 71 }) => {
  const f = useCurrentFrame();
  const inn = useIn(2, 12, 120);
  const x = interpolate(inn, [0, 1], [-900, 0]);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.2} />
      <div style={{ position: "absolute", left: 110, top: 300, transform: `translateX(${x}px) rotate(-3deg)` }}>
        <Tag w={1000} h={460}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: HZ.inkSoft, textTransform: "uppercase" }}>lot</div>
              <Stamp text={String(n)} at={14} size={150} rot={-6} />
              <div style={{ fontFamily: LABEL, fontWeight: 500, fontSize: 40, letterSpacing: 6, color: HZ.inkSoft, textTransform: "uppercase" }}>of {of}</div>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 96, color: HZ.ink, lineHeight: 1.02, marginTop: 6, opacity: interpolate(f, [8, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{title}</div>
            {where ? <Typed text={where} at={22} size={40} color={HZ.inkSoft} style={{ marginTop: 10 }} /> : null}
          </div>
        </Tag>
      </div>
    </AbsoluteFill>
  );
};
