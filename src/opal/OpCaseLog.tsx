// OpCaseLog — la libreta de huevos de Opal clavada sobre la foto (puerta del gallinero): cada día se escribe a lápiz
// y aparecen los huevos dibujados uno por uno. Props: bed, title, rows [{day, n, note?}], every (cuadros por fila),
// max (huevos de referencia), drop (índice de la fila que se marca en rojo).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OP, LABEL } from "./OpTheme";
import { NotePage, OpBed, Written, ease, useIn, PencilCircle } from "./OpParts";

const Egg: React.FC<{ at: number; empty?: boolean }> = ({ at, empty }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ width: 40, height: 52, marginRight: 8, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", transform: `scale(${s})`,
      background: empty ? "transparent" : "radial-gradient(circle at 35% 30%, #fff8ec, #ead6b3 60%, #c9ab7d)", border: empty ? `3px dashed ${OP.pencilSoft}` : "2px solid rgba(120,90,50,0.5)", boxSizing: "border-box" }} />
  );
};

export const OpCaseLog: React.FC<{ bed?: string; title?: string; rows: { day: string; n: number; note?: string }[]; every?: number; max?: number; drop?: number; seed?: number }> = ({ bed, title = "Egg log", rows, every = 14, max = 9, drop = -1, seed = 5 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 13, 110);
  const y = interpolate(k, [0, 1], [900, 0]);
  const H = 190 + rows.length * 96;
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.2} />
      <div style={{ position: "absolute", left: 260, top: Math.max(30, (1080 - H) / 2), transform: `translateY(${y}px)` }}>
        <NotePage w={1400} h={H} rot={-1.2}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: OP.red, textTransform: "uppercase", marginBottom: 14 }}>{title}</div>
          {rows.map((r, i) => {
            const at = 14 + i * every;
            const op = interpolate(f, [at, at + 4], [0, 1], ease);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 96, opacity: op }}>
                <Written text={r.day} at={at} size={62} style={{ width: 260 }} color={i === drop ? OP.red : OP.pencil} />
                <div style={{ display: "flex", width: 48 * max + 20 }}>
                  {Array.from({ length: Math.max(r.n, 0) }).map((_, j) => <Egg key={j} at={at + 4 + j * 2} />)}
                  {r.n === 0 ? <Egg at={at + 4} empty /> : null}
                </div>
                <Written text={String(r.n)} at={at + 6 + r.n * 2} size={78} color={i === drop ? OP.red : OP.pencil} style={{ width: 90, textAlign: "right" }} />
                {r.note ? <Written text={r.note} at={at + 10 + r.n * 2} size={48} color={OP.pencilSoft} style={{ marginLeft: 30 }} /> : null}
              </div>
            );
          })}
        </NotePage>
      </div>
      {drop >= 0 ? <PencilCircle cx={260 + 150 + 130 + 30} cy={Math.max(30, (1080 - H) / 2) + 70 + 70 + drop * 96 + 48} rx={210} ry={62} at={14 + drop * every + 20} seed={seed} /> : null}
    </AbsoluteFill>
  );
};
