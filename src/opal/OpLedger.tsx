// OpLedger — la cuenta real de la semana: recibo de la feed store / renglones de libreta con precio a lápiz, cada
// renglón entra cuando Opal lo nombra, y abajo el TOTAL subrayado dos veces. Props: bed, title, rows [{item, price,
// note?}], total, totalLabel, every, stamp (opcional).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL, SLAB } from "./OpTheme";
import { OpBed, Stamp, Written, ease, useIn } from "./OpParts";

export const OpLedger: React.FC<{ bed?: string; title?: string; rows: { item: string; price: string; note?: string }[]; total: string; totalLabel?: string; every?: number; stamp?: string; seed?: number }> = ({ bed, title = "What it cost me", rows, total, totalLabel = "Total", every = 16, stamp, seed = 6 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 12, 100);
  const tAt = 12 + rows.length * every;
  const u = interpolate(f, [tAt + 10, tAt + 22], [0, 1], ease);
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.25} />
      <div style={{ position: "absolute", right: 200, top: 70, width: 860, transform: `translateY(${(1 - k) * 1000}px) rotate(2deg)`, background: "#FFFEF9", boxShadow: `0 26px 50px ${OP.shadow}`, padding: "50px 56px 70px",
        clipPath: "polygon(0 0,100% 0,100% 97%,96% 100%,92% 97%,88% 100%,84% 97%,80% 100%,76% 97%,72% 100%,68% 97%,64% 100%,60% 97%,56% 100%,52% 97%,48% 100%,44% 97%,40% 100%,36% 97%,32% 100%,28% 97%,24% 100%,20% 97%,16% 100%,12% 97%,8% 100%,4% 97%,0 100%)" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: OP.red, textTransform: "uppercase", textAlign: "center" }}>{title}</div>
        <div style={{ borderTop: `3px dashed ${OP.pencilSoft}`, margin: "20px 0 10px" }} />
        {rows.map((r, i) => {
          const at = 12 + i * every;
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", minHeight: 92, opacity: interpolate(f, [at, at + 4], [0, 1], ease) }}>
              <div style={{ flex: 1 }}>
                <Written text={r.item} at={at} size={58} />
                {r.note ? <Written text={r.note} at={at + 8} size={40} color={OP.pencilSoft} /> : null}
              </div>
              <Written text={r.price} at={at + 6} size={66} color={/^\$?0|already|free/i.test(r.price) ? OP.green : OP.pencil} style={{ textAlign: "right", minWidth: 200 }} />
            </div>
          );
        })}
        <div style={{ borderTop: `3px dashed ${OP.pencilSoft}`, margin: "14px 0 10px", opacity: interpolate(f, [tAt, tAt + 4], [0, 1], ease) }} />
        <div style={{ display: "flex", alignItems: "baseline", opacity: interpolate(f, [tAt, tAt + 5], [0, 1], ease) }}>
          <div style={{ flex: 1, fontFamily: SLAB, fontWeight: 700, fontSize: 60, color: OP.pencil }}>{totalLabel}</div>
          <div style={{ position: "relative", fontFamily: SLAB, fontWeight: 700, fontSize: 96, color: OP.red }}>
            {total}
            <div style={{ position: "absolute", left: 0, bottom: -8, height: 5, width: `${100 * u}%`, background: OP.red }} />
            <div style={{ position: "absolute", left: 0, bottom: -20, height: 5, width: `${100 * u}%`, background: OP.red }} />
          </div>
        </div>
      </div>
      {stamp ? <div style={{ position: "absolute", left: 260, bottom: 150 }}><Stamp text={stamp} at={tAt + 20} size={80} rot={-9} color={OP.green} style={{ background: "rgba(255,253,247,0.85)" }} /></div> : null}
    </AbsoluteFill>
  );
};
