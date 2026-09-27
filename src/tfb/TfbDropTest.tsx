// TfbDropTest — la PRUEBA DE LA GOTA en macro, dibujada: dos superficies lado a lado; en cada una cae una gota
// (con estela y salpicadura). Izquierda: se ABSORBE (mancha oscura que se expande) → rótulo A. Derecha: queda
// REDONDA como en vidrio, con brillo → rótulo B. Física por código (caída con aceleración, rebote leve).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, CAVEAT, TFB, clamp, easeOut, outro, pop } from "./theme";

export const TfbDropTest: React.FC<{ dur: number; leftLabel: string; rightLabel: string; leftNote?: string; rightNote?: string; title?: string }> = ({ dur, leftLabel, rightLabel, leftNote, rightNote, title }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 8) * interpolate(f, [0, 8], [0, 1], clamp);
  const rnd = (i: number, s: number) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); };
  const panel = (cx: number, absorbs: boolean, delay: number, label: string, note?: string) => {
    const T = 16, t = f - delay, fall = Math.min(1, Math.max(0, t / T)), y = 250 + 380 * fall * fall; // aceleración
    const hit = t >= T, k = Math.max(0, t - T);
    const spread = absorbs ? interpolate(k, [0, 30], [0, 1], { ...clamp, easing: easeOut }) : 0;
    const bead = !absorbs && hit ? 1 + Math.sin(k / 3) * 0.08 * Math.exp(-k / 12) : 1;
    const dropVis = !hit || !absorbs ? 1 : interpolate(k, [0, 14], [1, 0], clamp);
    const lp = pop(f, fps, delay + T + 16, 11, 0.6);
    return (
      <g>
        <rect x={cx - 380} y={640} width={760} height={260} rx={20} fill={absorbs ? "#a9a397" : "#b8b3a8"} />
        {Array.from({ length: 160 }).map((_, q) => <circle key={q} cx={cx - 370 + rnd(q, cx) * 740} cy={650 + rnd(q, cx + 3) * 240} r={1 + rnd(q, 7) * 2} fill={rnd(q, 5) > 0.5 ? "#8c8578" : "#cfc9bd"} />)}
        {!absorbs && <rect x={cx - 380} y={640} width={760} height={260} rx={20} fill="url(#dt-gloss)" />}
        {absorbs && <ellipse cx={cx} cy={640 + 26} rx={40 + 170 * spread} ry={12 + 40 * spread} fill="#5d574d" opacity={0.75 * spread} />}
        {/* gota */}
        {dropVis > 0 && (!hit ? (
          <g><path d={`M${cx},${y - 60} C${cx + 26},${y - 20} ${cx + 30},${y + 10} ${cx},${y + 22} C${cx - 30},${y + 10} ${cx - 26},${y - 20} ${cx},${y - 60} Z`} fill="#7cc2ff" opacity={0.95} />
            <ellipse cx={cx - 9} cy={y - 6} rx={6} ry={10} fill="#fff" opacity={0.8} /></g>
        ) : (
          <g opacity={dropVis}><ellipse cx={cx} cy={640 + 4 - 22 * bead} rx={absorbs ? 60 : 46 / bead} ry={absorbs ? 10 : 30 * bead} fill="#7cc2ff" opacity={0.92} />
            {!absorbs && <ellipse cx={cx - 14} cy={640 - 30} rx={10} ry={7} fill="#fff" opacity={0.85} />}</g>
        ))}
        {hit && k < 12 && Array.from({ length: 8 }).map((_, q) => { const a = (q / 8) * Math.PI, d = k * 6; return <circle key={q} cx={cx + Math.cos(a) * d * 1.6 * (q % 2 ? 1 : -1)} cy={640 - Math.sin(a) * d + k * k * 0.4} r={4} fill="#9fd3ff" opacity={1 - k / 12} />; })}
        <foreignObject x={cx - 380} y={920} width={760} height={140}>
          <div style={{ textAlign: "center", opacity: lp, transform: `translateY(${(1 - lp) * 20}px)` }}>
            <span style={{ fontFamily: ANTON, fontSize: 56, color: absorbs ? TFB.ink : TFB.white, background: absorbs ? TFB.yellow : TFB.red, padding: "2px 20px 6px", borderRadius: 10 }}>{label}</span>
          </div>
        </foreignObject>
        {note && <foreignObject x={cx - 380} y={520} width={760} height={120}><div style={{ textAlign: "center", fontFamily: CAVEAT, fontWeight: 700, fontSize: 54, color: TFB.white, opacity: lp, textShadow: "0 3px 0 rgba(0,0,0,0.7)" }}>{note}</div></foreignObject>}
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(6,6,6,0.82)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="dt-gloss" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.45" /><stop offset="0.45" stopColor="#fff" stopOpacity="0.05" /><stop offset="1" stopColor="#fff" stopOpacity="0.25" /></linearGradient></defs>
        {panel(520, true, 10, leftLabel, leftNote)}
        {panel(1400, false, 40, rightLabel, rightNote)}
      </svg>
      {title && <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 84, color: TFB.white, textTransform: "uppercase", textShadow: "0 6px 0 rgba(0,0,0,0.45)" }}>{title}</div>}
    </AbsoluteFill>
  );
};
