// TfbCrackStop — por qué se hacen los agujeritos en las puntas: una pared de plástico negro con nervaduras; con cada
// "pulso" de presión (flechas azules desde adentro) la grieta avanza por la punta; al llegar `holesAt` aparecen dos
// agujeros redondos en las puntas (anillo de impacto), los pulsos siguientes chocan contra ellos y la grieta ya no
// avanza (destello rojo en la punta, luego check). Etiquetas por props.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop, rnd } from "./theme";

export const TfbCrackStop: React.FC<{ dur: number; holesAt: number; title?: string; holeLabel?: string; pressureLabel?: string; stopLabel?: string }> = ({ dur, holesAt, title, holeLabel, pressureLabel, stopLabel }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const W = 1500, H = 700, cx = W / 2, cy = H / 2;
  const out = lin(f, [dur - 8, dur], [1, 0], EIO), inn = pop(f, fps, 0, 160, 18);
  // grieta: polilínea vertical dentada; su largo crece por pulsos hasta holesAt, después se congela
  const pulses = [0, 1, 2, 3].map((k) => 12 + k * Math.max(8, (holesAt - 12) / 4));
  const grow = pulses.reduce((a, p) => a + lin(f, [p, p + 7], [0, 1], EO), 0);
  const len0 = 150, len = Math.min(len0 + grow * 55, len0 + 4 * 55);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30; const y = cy - len / 2 + t * len; pts.push([cx + (rnd(i * 3.1) - 0.5) * 26 + Math.sin(t * 9) * 6, y]); }
  const d = "M " + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L ");
  const top = pts[0], bot = pts[pts.length - 1];
  const holeIn = pop(f, fps, holesAt, 240, 12);
  const post = f > holesAt + 10 ? Math.floor((f - holesAt - 10) / 16) : -1;
  const hit = post >= 0 ? lin((f - holesAt - 10) % 16, [0, 3, 12], [0, 1, 0]) : 0;
  const pressP = (f % 16) / 16;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out, alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
      {title ? <div style={{ position: "absolute", top: 70, fontFamily: F_DISPLAY, fontSize: 72, color: C.white, letterSpacing: 2 }}>{title}</div> : null}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ transform: `scale(${0.85 + 0.15 * Math.max(0, inn)})`, overflow: "visible", marginTop: 60 }}>
        <defs>
          <linearGradient id="tfbPl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2a2a2e" /><stop offset="1" stopColor="#141416" /></linearGradient>
          <pattern id="tfbRib" width="10" height="70" patternUnits="userSpaceOnUse"><rect width="10" height="70" fill="url(#tfbPl)" /><rect y="60" width="10" height="6" fill="#333338" /></pattern>
        </defs>
        <rect x={120} y={40} width={W - 240} height={H - 80} rx={26} fill="url(#tfbRib)" stroke="#444" strokeWidth={3} />
        {/* el peso del agua ABRE la grieta: flechas que tiran hacia afuera desde los bordes */}
        {[0.3, 0.5, 0.7].map((k, i) => {
          const o = 60 + pressP * 50, y = 40 + k * (H - 80), a = f < holesAt + 40 ? 0.9 : 0.35;
          return (
            <g key={i} opacity={a}>
              <line x1={cx - o} y1={y} x2={cx - o - 120} y2={y} stroke={C.water} strokeWidth={10} strokeLinecap="round" />
              <path d={`M ${cx - o - 150} ${y} l 30 -18 l 0 36 z`} fill={C.water} />
              <line x1={cx + o} y1={y} x2={cx + o + 120} y2={y} stroke={C.water} strokeWidth={10} strokeLinecap="round" />
              <path d={`M ${cx + o + 150} ${y} l -30 -18 l 0 36 z`} fill={C.water} />
            </g>
          );
        })}
        <path d={d} fill="none" stroke="#050505" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#6b6b70" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" transform="translate(-4 0)" />
        {/* puntas: antes de los agujeros, la punta brilla al avanzar */}
        {f < holesAt ? [top, bot].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={10 + 14 * lin(f % 16, [0, 4, 12], [0, 1, 0])} fill="none" stroke={C.red} strokeWidth={5} />) : null}
        {/* agujeros */}
        {[[top[0], top[1] - 22], [bot[0], bot[1] + 22]].map((p, i) => (
          <g key={"h" + i} opacity={holeIn > 0 ? 1 : 0}>
            <circle cx={p[0]} cy={p[1]} r={26 + (1 - Math.min(1, holeIn)) * 60} fill="none" stroke={C.yellow} strokeWidth={6} opacity={lin(f, [holesAt, holesAt + 14], [1, 0])} />
            <circle cx={p[0]} cy={p[1]} r={22 * Math.max(0, holeIn)} fill="#050505" stroke={C.yellow} strokeWidth={5} />
            <circle cx={p[0]} cy={p[1]} r={46} fill="none" stroke={C.red} strokeWidth={7} opacity={hit} />
          </g>
        ))}
      </svg>
      {pressureLabel ? <div style={{ position: "absolute", left: 120, bottom: 110, fontFamily: F_SANS, fontWeight: 900, fontSize: 34, color: C.water, letterSpacing: 2, textTransform: "uppercase", opacity: lin(f, [10, 18], [0, 1]) * lin(f, [holesAt, holesAt + 10], [1, 0.4]) }}>{pressureLabel}</div> : null}
      {holeLabel ? <div style={{ position: "absolute", right: 150, top: 230, fontFamily: F_DISPLAY, fontSize: 60, color: C.yellow, textShadow: "0 4px 0 #000", opacity: lin(f, [holesAt + 4, holesAt + 12], [0, 1]) }}>{holeLabel}</div> : null}
      {stopLabel && f > holesAt + 26 ? <div style={{ position: "absolute", bottom: 90, backgroundColor: C.green, color: "#fff", fontFamily: F_DISPLAY, fontSize: 64, padding: "4px 28px", borderRadius: 12,
        transform: `scale(${Math.max(0, pop(f, fps, holesAt + 26, 240, 12))})` }}>{stopLabel}</div> : null}
    </AbsoluteFill>
  );
};
