// TfbDropTest — por qué nada se pega al polietileno, en una imagen: dos superficies lado a lado, cae una gota en cada
// una; en la de la izquierda (p. ej. madera/vidrio) la gota se DESPARRAMA y moja; en la de la derecha (polietileno)
// queda como BOLITA, con el ángulo de contacto marcado. Etiquetas por props. Sirve para cualquier "¿por qué no pega?".
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export const TfbDropTest: React.FC<{ dur: number; leftLabel: string; rightLabel: string; leftNote?: string; rightNote?: string; title?: string }> = ({ dur, leftLabel, rightLabel, leftNote, rightNote, title }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const out = lin(f, [dur - 8, dur], [1, 0], EIO);
  const Drop: React.FC<{ x: number; spread: boolean; t0: number; surf: string }> = ({ x, spread, t0, surf }) => {
    const fall = lin(f, [t0, t0 + 10], [0, 1], (u) => u * u);
    const land = lin(f, [t0 + 10, t0 + 28], [0, 1], EO);
    const wob = f > t0 + 10 ? Math.sin((f - t0) / 2.2) * Math.exp(-(f - t0 - 10) / 10) * 0.12 : 0;
    const y0 = 540, rx = spread ? 70 + 150 * land : 70 + 8 * land, ry = spread ? 70 - 58 * land : 70 - 8 * land;
    const cy = fall < 1 ? 180 + (y0 - 70 - 180) * fall : y0 - ry;
    const ang = spread ? 18 : 115;
    return (
      <g>
        <rect x={x - 330} y={y0} width={660} height={60} rx={10} fill={surf} />
        <ellipse cx={x} cy={cy} rx={rx * (1 + wob)} ry={ry * (1 - wob)} fill={C.water} opacity={0.85} />
        <ellipse cx={x - rx * 0.35} cy={cy - ry * 0.4} rx={rx * 0.18} ry={ry * 0.18} fill="#fff" opacity={0.7} />
        {land > 0.95 ? (
          <g opacity={lin(f, [t0 + 28, t0 + 36], [0, 1])}>
            <path d={`M ${x + rx} ${y0} l ${Math.cos((ang * Math.PI) / 180) * -110} ${Math.sin((ang * Math.PI) / 180) * -110}`} stroke={C.yellow} strokeWidth={6} />
            <path d={`M ${x + rx - 70} ${y0} A 70 70 0 0 1 ${x + rx + Math.cos(Math.PI - (ang * Math.PI) / 180) * 70} ${y0 - Math.sin((ang * Math.PI) / 180) * 70}`} fill="none" stroke={C.yellow} strokeWidth={5} />
          </g>
        ) : null}
      </g>
    );
  };
  const tag = (x: number, text: string, note: string | undefined, ok: boolean, t0: number) => (
    <div style={{ position: "absolute", left: x - 330, width: 660, top: 700, textAlign: "center", opacity: lin(f, [t0 + 20, t0 + 30], [0, 1], EO) }}>
      <div style={{ fontFamily: F_DISPLAY, fontSize: 64, color: C.white, letterSpacing: 2 }}>{text}</div>
      {note ? <div style={{ display: "inline-block", marginTop: 12, fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: ok ? C.ink : C.white, backgroundColor: ok ? C.yellow : C.red, padding: "6px 18px", borderRadius: 10, textTransform: "uppercase",
        transform: `scale(${Math.max(0, pop(f, fps, t0 + 34, 240, 12))})` }}>{note}</div> : null}
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out, background: "radial-gradient(ellipse at 50% 50%, rgba(16,18,22,0.86), rgba(0,0,0,0.94))" }}>
      {title ? <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: F_DISPLAY, fontSize: 72, color: C.white, letterSpacing: 2 }}>{title}</div> : null}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Drop x={520} spread t0={6} surf="#8a6a45" />
        <Drop x={1400} spread={false} t0={30} surf="#1c1c1f" />
        <line x1={960} y1={220} x2={960} y2={860} stroke="rgba(255,255,255,0.18)" strokeWidth={4} strokeDasharray="14 14" />
      </svg>
      {tag(520, leftLabel, leftNote, true, 6)}
      {tag(1400, rightLabel, rightNote, false, 30)}
    </AbsoluteFill>
  );
};
