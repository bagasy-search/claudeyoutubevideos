// OpChecklist — "lo que reviso, del más barato al más caro": lista a lápiz en la libreta sobre la foto, con la ficha
// de costo de cada ítem (FREE en verde, $ en rojo). `active` resalta el que toca ahora; `done` tacha los ya revisados.
// Props: bed, title, items [{t, cost}], active, done (n primeros tachados), every.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL } from "./OpTheme";
import { NotePage, OpBed, Written, ease, useIn } from "./OpParts";

export const OpChecklist: React.FC<{ bed?: string; title?: string; items: { t: string; cost: string }[]; active?: number; done?: number; every?: number; seed?: number }> = ({ bed, title = "What I check, cheapest first", items, active = -1, done = 0, every = 6, seed = 4 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 13, 110);
  const rowH = Math.min(100, 760 / items.length);
  const H = 170 + items.length * rowH;
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.22} />
      <div style={{ position: "absolute", left: 360, top: (1080 - H) / 2, transform: `translateX(${(1 - k) * -900}px) rotate(${(1 - k) * -6}deg)` }}>
        <NotePage w={1200} h={H} rot={1}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 7, color: OP.red, textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
          {items.map((it, i) => {
            const at = 10 + i * every;
            const isA = i === active, isD = i < done;
            const free = /free/i.test(it.cost);
            const strike = interpolate(f, [at + 10, at + 18], [0, 1], ease);
            return (
              <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", height: rowH, opacity: interpolate(f, [at, at + 4], [0, isA || active < 0 ? 1 : 0.55], ease), transform: `scale(${isA ? 1.06 : 1})`, transformOrigin: "left center" }}>
                <Written text={`${i + 1}.`} at={at} size={rowH * 0.62} color={isA ? OP.red : OP.pencil} style={{ width: 80 }} />
                <Written text={it.t} at={at + 2} size={rowH * 0.62} color={isA ? OP.red : OP.pencil} style={{ flex: 1 }} />
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: rowH * 0.36, letterSpacing: 3, padding: "4px 16px", color: OP.white, background: free ? OP.green : OP.red, borderRadius: 6, opacity: interpolate(f, [at + 6, at + 10], [0, 1], ease), textTransform: "uppercase" }}>{it.cost}</div>
                {isD ? <div style={{ position: "absolute", left: 70, top: rowH / 2, height: 6, width: 680 * strike, background: OP.pencil, borderRadius: 3, transform: "rotate(-1deg)" }} /> : null}
              </div>
            );
          })}
        </NotePage>
      </div>
    </AbsoluteFill>
  );
};
