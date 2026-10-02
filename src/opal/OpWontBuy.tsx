// OpWontBuy — lo que Opal NO compra: la foto del producto, su precio de góndola tachado a lápiz y el sello rojo
// "WON'T BUY", con la razón en una línea manuscrita. Props: bed (foto del producto), item, price, why, stamp.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL, SLAB } from "./OpTheme";
import { OpBed, Stamp, Written, ease, useIn } from "./OpParts";

export const OpWontBuy: React.FC<{ bed?: string; item: string; price?: string; why: string; stamp?: string; n?: string; seed?: number }> = ({ bed, item, price, why, stamp = "won't buy", n, seed = 2 }) => {
  const f = useCurrentFrame();
  const k = useIn(4, 13, 110);
  const strike = interpolate(f, [26, 34], [0, 1], ease);
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.12} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(transparent, rgba(44,42,40,0.78))" }} />
      {n ? <div style={{ position: "absolute", left: 90, top: 70, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: OP.white, background: OP.red, padding: "6px 22px", opacity: k }}>{n}</div> : null}
      <div style={{ position: "absolute", left: 90, bottom: 80, transform: `translateY(${(1 - k) * 200}px)`, opacity: k }}>
        <div style={{ fontFamily: SLAB, fontWeight: 700, fontSize: 86, color: OP.white, lineHeight: 1 }}>{item}</div>
        {price ? (
          <div style={{ position: "relative", display: "inline-block", fontFamily: SLAB, fontWeight: 700, fontSize: 72, color: OP.yolk, marginTop: 8 }}>
            {price}
            <div style={{ position: "absolute", left: -10, top: "52%", height: 9, width: `${(100 + 12) * strike}%`, background: OP.red, transform: "rotate(-4deg)", borderRadius: 4 }} />
          </div>
        ) : null}
        <Written text={why} at={30} size={56} color={OP.white} style={{ marginTop: 6, maxWidth: 1250 }} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 120 }}><Stamp text={stamp} at={16} size={110} rot={-10} style={{ background: "rgba(255,253,247,0.88)" }} /></div>
    </AbsoluteFill>
  );
};
