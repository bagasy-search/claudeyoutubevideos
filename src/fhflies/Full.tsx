// fhflies · el video entero editado por Claude (11-oct-2026). Público mayor: tomas de 6-10 s, más Loretta a cámara,
// material REAL de archivo (películas de dominio público + fotos con licencia libre). Sin audio acá: la mezcla va aparte (numpy).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Plate, CompWrap, Grain, OV, fr, type Shot } from "./Base";
import { KIT } from "./Kit";
import { NEW } from "./New";
import EDL from "./edl.json";

export const TOTAL_S = (EDL as any).end as number;
type S2 = Shot & { c?: string; props?: any };
const SH = (EDL as any).shots as S2[];
const ALL: Record<string, React.FC<any>> = { ...KIT, ...NEW };

// contador "THING N OF 12" arriba a la derecha: entra con resorte al empezar cada cosa, sale al empezar la siguiente
const Count: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = spring({ frame: f, fps, config: { damping: 14, stiffness: 160 } });
  const o = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", right: 70, top: 56, opacity: o, transform: `translateY(${(1 - k) * -24}px)`, background: "rgba(14,10,22,0.78)", border: "2px solid #e0b25a", borderRadius: 14, padding: "10px 22px", fontFamily: "Georgia, serif", fontSize: 40, color: "#f6ecd6", letterSpacing: 2, boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}>
      THING {n} OF 12
    </div>
  );
};
const COUNTS = ((EDL as any).counts || []) as { a: number; b: number; n: number }[];

export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SH.map((s, i) => {
      const lead = s.tin && s.tin !== "cut" ? OV : 0;
      const tail = s.tout && s.tout !== "cut" ? OV : 0;
      const from = fr(s.a) - lead, d = fr(s.b) - fr(s.a);
      const K = s.c ? ALL[s.c] : null;
      return (
        <Sequence key={i} from={from} durationInFrames={d + lead + tail}>
          {K ? <CompWrap lead={lead} d={d} tout={s.tout}><K {...s.props} a={s.a} d={d} /></CompWrap> : <Plate s={s} d={d} lead={lead} />}
        </Sequence>
      );
    })}
    {COUNTS.map((c) => (
      <Sequence key={"c" + c.n} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
        <Count n={c.n} />
      </Sequence>
    ))}
    <Grain />
  </AbsoluteFill>
);
