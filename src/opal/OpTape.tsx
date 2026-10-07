// OpTape — la tira de papel de una sumadora vieja apoyada sobre la mesa de la cocina (foto/clip de cama con Ken-Burns):
// el cabezal oscuro de la máquina arriba, la tira sale hacia el espectador en perspectiva leve y va IMPRIMIENDO renglón
// por renglón (item + monto, tinta azul con leve corrimiento), sube a medida que crece; al final la raya, el TOTAL en
// rojo y, si hay `divide`, la cuenta "÷ 201 dozen = $4.37" con un círculo de lápiz. Props por props (nada quemado).
// Props: rows [{item, amt}], total, totalLabel, divide {by, result}, every (cuadros entre renglones), bed, title.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/CourierPrime";
import { OP, HAND, LABEL } from "./OpTheme";
import { OpBed, ease } from "./OpParts";

const { fontFamily: MONO } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });
const INK = "#24346b";
const LINE = 74;

export const OpTape: React.FC<{ rows: { item: string; amt: string }[]; total?: string; totalLabel?: string; divide?: { by: string; result: string }; every?: number; bed?: string; title?: string; seed?: number }> = ({ rows, total, totalLabel = "TOTAL", divide, every = 18, bed, title, seed = 21 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const at = (i: number) => 14 + i * every;
  const nLines = rows.length + (total ? 2 : 0) + (divide ? 2 : 0);
  const printed = Math.min(nLines, Math.max(0, Math.floor((f - 14) / every) + 1));
  // la tira sube suave a medida que imprime (cada renglón empuja la tira un LINE)
  const k = interpolate(f, [14, 14 + nLines * every], [0, nLines], ease);
  const lift = Math.max(0, k - 5.2) * LINE;
  const totalAt = at(rows.length) + every, divAt = totalAt + every * 1.4;
  const line = (i: number, node: React.ReactNode, key: string) => {
    const a = interpolate(f, [at(i), at(i) + 4], [0, 1], ease);
    return <div key={key} style={{ height: LINE, display: "flex", alignItems: "center", opacity: a, transform: `translateY(${(1 - a) * -10}px)` }}>{node}</div>;
  };
  const rowsN = rows.map((r, i) => line(i, (<><div style={{ flex: 1, fontFamily: MONO, fontSize: 40, color: INK, whiteSpace: "nowrap", overflow: "hidden" }}>{r.item}</div><div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: INK }}>{r.amt}</div></>), "r" + i));
  return (
    <AbsoluteFill>
      <OpBed src={bed} seed={seed} dim={0.3} />
      {title ? <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 9, color: OP.white, textTransform: "uppercase", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{title}</div> : null}
      <AbsoluteFill style={{ perspective: 1600, alignItems: "center" }}>
        <div style={{ position: "absolute", top: 200, width: 860, transform: "rotateX(14deg) rotateZ(-2deg)", transformOrigin: "50% 0%" }}>
          {/* cabezal de la sumadora */}
          <div style={{ position: "absolute", top: -40, left: -50, right: -50, height: 96, borderRadius: 18, background: "linear-gradient(#5a5852,#2f2e2a)", boxShadow: "0 18px 30px rgba(0,0,0,0.55)", zIndex: 2 }}>
            <div style={{ position: "absolute", left: 40, right: 40, top: 58, height: 14, borderRadius: 7, background: "#151412" }} />
            <div style={{ position: "absolute", right: 46, top: 16, width: 26, height: 26, borderRadius: 13, background: printed < nLines ? "#d94a3a" : "#5c8f3d", boxShadow: "0 0 10px rgba(255,120,90,0.6)" }} />
          </div>
          {/* tira de papel */}
          <div style={{ position: "relative", top: 50, height: 700, overflow: "hidden", zIndex: 1 }}>
            <div style={{ transform: `translateY(${-lift}px)`, padding: "28px 56px 120px", background: "#fbf8ef", minHeight: 2400,
              backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.0) 0 73px, rgba(80,70,50,0.07) 73px 74px), linear-gradient(90deg, rgba(0,0,0,0.06), transparent 8%, transparent 92%, rgba(0,0,0,0.06))",
              boxShadow: "0 30px 50px rgba(0,0,0,0.45)" }}>
              {rowsN}
              {total ? line(rows.length, <div style={{ flex: 1, borderTop: `4px dashed ${INK}`, opacity: 0.7 }} />, "rule") : null}
              {total ? (
                <div style={{ height: LINE * 1.3, display: "flex", alignItems: "center", opacity: interpolate(f, [totalAt, totalAt + 4], [0, 1], ease) }}>
                  <div style={{ flex: 1, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: OP.red }}>{totalLabel}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: OP.red }}>{total}</div>
                </div>
              ) : null}
              {divide ? (
                <div style={{ position: "relative", height: LINE * 1.6, display: "flex", alignItems: "center", gap: 24, opacity: interpolate(f, [divAt, divAt + 5], [0, 1], ease) }}>
                  <div style={{ fontFamily: MONO, fontSize: 42, color: INK }}>÷ {divide.by} =</div>
                  <div style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: OP.red, lineHeight: 1 }}>
                    {divide.result}
                    <svg width={330} height={150} style={{ position: "absolute", left: -18, top: -26, overflow: "visible" }}>
                      <ellipse cx={150} cy={66} rx={155} ry={62} fill="none" stroke={OP.red} strokeWidth={6} strokeDasharray={760} strokeDashoffset={760 * (1 - interpolate(f, [divAt + 8, divAt + 22], [0, 1], ease))} transform="rotate(-4 150 66)" />
                    </svg>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${interpolate(f, [durationInFrames - 6, durationInFrames], [0, 0.0], ease)})` }} />
    </AbsoluteFill>
  );
};
