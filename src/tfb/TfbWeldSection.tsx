// TfbWeldSection — corte "rayos X" de la pared del tanque que se arma por etapas, en cuadros relativos:
//   grieta de lado a lado → canaleta en V por fuera → relleno derretido (naranja que se enfría a negro, mezclándose con
//   los bordes) → malla metálica hundiéndose a MEDIA altura en una capa nueva → capa de cierre con bordes en rampa →
//   capa de adentro (limpia, sin malla) del lado del agua. Cada etapa tiene su etiqueta (props) y se ilumina al llegar.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export type WeldStages = { v?: number; fill?: number; mesh?: number; cover?: number; inside?: number };
export type WeldLabels = { v?: string; fill?: string; mesh?: string; cover?: string; inside?: string; outside?: string; water?: string; title?: string };

export const TfbWeldSection: React.FC<{ dur: number; at: WeldStages; labels: WeldLabels }> = ({ dur, at, labels }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO), inn = pop(f, fps, 0, 150, 18);
  const W = 1600, H = 620, x0 = 100, x1 = W - 100, cx = W / 2;
  const wt = 150, yTop = 300, yBot = yTop + wt;          // pared: de yTop (afuera) a yBot (adentro)
  const P = (k?: number, len = 14) => (k == null ? 0 : lin(f, [k, k + len], [0, 1], EO));
  const pv = P(at.v), pf = P(at.fill, 26), pm = P(at.mesh, 22), pc = P(at.cover, 18), pi = P(at.inside, 18);
  const vw = 70 * pv;                                    // semiancho de la V en la cara externa
  const vDepth = wt * 0.55 * pv;
  const heat = Math.max(lin(f, [at.fill ?? 1e9, (at.fill ?? 1e9) + 10], [0, 1]) * lin(f, [(at.fill ?? 1e9) + 26, (at.fill ?? 1e9) + 60], [1, 0]),
    lin(f, [at.cover ?? 1e9, (at.cover ?? 1e9) + 6], [0, 1]) * lin(f, [(at.cover ?? 1e9) + 18, (at.cover ?? 1e9) + 44], [1, 0]));
  const hot = (k: number) => `rgb(${Math.round(27 + (255 - 27) * k)}, ${Math.round(27 + (122 - 27) * k)}, ${Math.round(29 + (26 - 29) * k)})`;
  const meshY = yTop - 18 + 18 * pm;                     // se hunde hasta media altura de la capa nueva
  const cur = [at.v, at.fill, at.mesh, at.cover, at.inside].map((k) => (k != null && f >= k ? 1 : 0)).lastIndexOf(1);
  const Lab: React.FC<{ i: number; x: number; y: number; text?: string; anchor?: "l" | "r" }> = ({ i, x, y, text, anchor = "l" }) => !text ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "r" ? "-100%" : "0"}, -50%)`, fontFamily: F_SANS, fontWeight: 900, fontSize: 34,
      color: cur === i ? C.ink : C.white, backgroundColor: cur === i ? C.yellow : "rgba(0,0,0,0.55)", padding: "6px 16px", borderRadius: 10, whiteSpace: "nowrap",
      opacity: cur >= i ? 1 : 0, transition: "none", textTransform: "uppercase", letterSpacing: 1 }}>{text}</div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out, background: "radial-gradient(ellipse at 50% 55%, rgba(12,14,18,0.82), rgba(0,0,0,0.92))" }}>
      {labels.title ? <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: F_DISPLAY, fontSize: 70, color: C.white, letterSpacing: 2 }}>{labels.title}</div> : null}
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: 170, width: W, height: H, transform: `scale(${0.9 + 0.1 * Math.max(0, inn)})` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="tfbWall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2b2b30" /><stop offset="0.62" stopColor="#1b1b1e" /><stop offset="0.63" stopColor="#6d6d72" /><stop offset="0.7" stopColor="#e9e9e4" /><stop offset="1" stopColor="#f4f4ef" /></linearGradient>
            <pattern id="tfbMesh" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0 13 H26 M13 0 V26" stroke="#c9ccd2" strokeWidth="4" /></pattern>
          </defs>
          {/* aire afuera / agua adentro */}
          <rect x={x0} y={yBot} width={x1 - x0} height={H - yBot} fill={C.water} opacity={0.18} />
          {/* pared en dos mitades separadas por la grieta, con la V recortada */}
          <path d={`M ${x0} ${yTop} L ${cx - 3 - vw} ${yTop} L ${cx - 3} ${yTop + vDepth} L ${cx - 3} ${yBot} L ${x0} ${yBot} Z`} fill="url(#tfbWall)" />
          <path d={`M ${x1} ${yTop} L ${cx + 3 + vw} ${yTop} L ${cx + 3} ${yTop + vDepth} L ${cx + 3} ${yBot} L ${x1} ${yBot} Z`} fill="url(#tfbWall)" />
          {/* relleno fundido en la V y en la grieta (se mezcla con los bordes: halo naranja sobre la pared) */}
          {pf > 0 ? <path d={`M ${cx - vw - 8} ${yTop} L ${cx - 6} ${yTop + vDepth} L ${cx - 6} ${yTop + vDepth + (yBot - yTop - vDepth) * pf} L ${cx + 6} ${yTop + vDepth + (yBot - yTop - vDepth) * pf} L ${cx + 6} ${yTop + vDepth} L ${cx + vw + 8} ${yTop} L ${cx + vw + 20} ${yTop - 22 * pf} Q ${cx} ${yTop - 36 * pf} ${cx - vw - 20} ${yTop - 22 * pf} Z`}
            fill={hot(heat)} /> : null}
          {pf > 0 ? <ellipse cx={cx} cy={yTop + vDepth * 0.5} rx={(vw + 40) * pf} ry={vDepth * 0.9} fill={C.melt} opacity={0.35 * heat} /> : null}
          {/* capa nueva con la malla */}
          {pm > 0 ? <path d={`M ${cx - 330} ${yTop} Q ${cx - 300} ${yTop - 34 * pm} ${cx - 240} ${yTop - 36 * pm} L ${cx + 240} ${yTop - 36 * pm} Q ${cx + 300} ${yTop - 34 * pm} ${cx + 330} ${yTop} Z`} fill={hot(heat * 0.8)} /> : null}
          {pm > 0 ? <rect x={cx - 250} y={meshY - 7} width={500} height={14} fill="url(#tfbMesh)" opacity={0.95} /> : null}
          {/* capa de cierre: tapa la malla, bordes en rampa */}
          {pc > 0 ? <path d={`M ${cx - 380} ${yTop} Q ${cx - 330} ${yTop - 58 * pc} ${cx - 250} ${yTop - 60 * pc} L ${cx + 250} ${yTop - 60 * pc} Q ${cx + 330} ${yTop - 58 * pc} ${cx + 380} ${yTop} Z`} fill={hot(heat)} opacity={0.97} /> : null}
          {/* capa de adentro, del lado del agua, sin malla */}
          {pi > 0 ? <path d={`M ${cx - 200} ${yBot} Q ${cx - 150} ${yBot + 30 * pi} ${cx - 100} ${yBot + 32 * pi} L ${cx + 100} ${yBot + 32 * pi} Q ${cx + 150} ${yBot + 30 * pi} ${cx + 200} ${yBot} Z`} fill="#f2f2ec" stroke="#cfcfc8" strokeWidth={2} /> : null}
          {/* punta del cautín durante el relleno y el cierre */}
          {heat > 0.05 ? <g transform={`translate(${cx + Math.sin(f / 3) * (pc > 0 ? 200 : 40)} ${yTop - 70 - (pc > 0 ? 40 : 0)}) rotate(-35)`} opacity={heat}>
            <rect x={-10} y={-160} width={20} height={130} rx={6} fill="#9aa0a8" /><path d="M -14 -30 L 14 -30 L 6 0 L -6 0 Z" fill={C.melt} /></g> : null}
        </svg>
        <Lab i={0} x={cx + vw + 70} y={yTop + 40} text={labels.v} />
        <Lab i={1} x={cx - 360} y={yTop + 90} text={labels.fill} anchor="r" />
        <Lab i={2} x={cx + 280} y={yTop - 90} text={labels.mesh} />
        <Lab i={3} x={cx - 300} y={yTop - 120} text={labels.cover} anchor="r" />
        <Lab i={4} x={cx + 230} y={yBot + 60} text={labels.inside} />
        {labels.outside ? <div style={{ position: "absolute", left: x0 + 10, top: yTop - 70, fontFamily: F_SANS, fontWeight: 700, fontSize: 28, color: "rgba(255,255,255,0.75)", letterSpacing: 3 }}>{labels.outside}</div> : null}
        {labels.water ? <div style={{ position: "absolute", left: x0 + 10, top: yBot + 60, fontFamily: F_SANS, fontWeight: 700, fontSize: 28, color: C.water, letterSpacing: 3 }}>{labels.water}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
