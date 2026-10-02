// OpSignCard — diagnóstico por señal: sobre la foto CLARA de la señal (plumas en el piso, cañones, cresta pálida,
// huellas…) se dibuja un círculo rojo de lápiz donde está, y entra la tarjeta "IF YOU SEE → IT'S". `ok` = señal
// tranquila (verde) o de alarma (rojo). Props: bed, see, means, circle {x,y,rx,ry} (px sobre 1920x1080), ok, side.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { OP, LABEL } from "./OpTheme";
import { FeedTag, OpBed, PencilCircle, Written, ease, useIn } from "./OpParts";

export const OpSignCard: React.FC<{ bed?: string; see: string; means: string; circle?: { x: number; y: number; rx: number; ry: number }; ok?: boolean; side?: "left" | "right"; seed?: number }> = ({ bed, see, means, circle, ok = true, side = "right", seed = 8 }) => {
  const f = useCurrentFrame();
  const k = useIn(18, 13, 120);
  const col = ok ? OP.green : OP.red;
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.05} />
      {circle ? <PencilCircle cx={circle.x} cy={circle.y} rx={circle.rx} ry={circle.ry} at={6} seed={seed} color={OP.yolk} width={11} /> : null}
      <div style={{ position: "absolute", [side]: 90, bottom: 90, transform: `translateY(${(1 - k) * 400}px) rotate(${side === "right" ? 1.5 : -1.5}deg)` } as React.CSSProperties}>
        <FeedTag w={720} h={260}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: OP.pencilSoft, textTransform: "uppercase" }}>if you see</div>
          <Written text={see} at={22} size={58} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, opacity: interpolate(f, [34, 40], [0, 1], ease) }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: col, textTransform: "uppercase" }}>it's</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: OP.white, background: col, padding: "2px 18px", borderRadius: 6, textTransform: "uppercase" }}>{means}</div>
          </div>
        </FeedTag>
      </div>
    </AbsoluteFill>
  );
};
