// TfbLayerCut — corte transversal animado ("rayos X" del piso): las capas se apilan de abajo arriba con su cota,
// y en `washAt` una lluvia fina baja la pasta de arriba y destapa las piedras (hasta ~1/3). Genérico: capas, cotas y
// etiquetas por props (sirve para contrapiso, cantero, muro…). Panel oscuro translúcido sobre el footage desenfocado.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, noise, pop, textShadow } from "./theme";

export type Layer = { label: string; dim?: string; kind: "soil" | "gravel" | "concrete"; h: number };
export type TfbLayerCutProps = { dur: number; layers: Layer[]; washAt?: number; washLabel?: string; slopeLabel?: string; title?: string; x?: number; y?: number; w?: number; stagger?: number };
const PEB = ["#9aa0a6", "#e9e4da", "#a4553a", "#3c3a38", "#c9b89a", "#7d8a8f", "#b9784f"];
export const TfbLayerCut: React.FC<TfbLayerCutProps> = ({ dur, layers, washAt, washLabel, slopeLabel, title, x = 960, y = 560, w = 1180, stagger = 14 }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const inP = pop(f, fps, 0, 15), out = interpolate(f, [dur - 9, dur], [1, 0], { ...clamp, easing: easeIn });
  const W = w, H = 560, gx = 80, gw = W - 460, base = H - 60;
  let acc = 0;
  const L = layers.map((l, i) => { const g = interpolate(f, [8 + i * stagger, 8 + i * stagger + 12], [0, 1], { ...clamp, easing: ease }); const y1 = base - acc - l.h * g; const r = { ...l, y0: base - acc, y1, g, i }; acc += l.h * g; return r; });
  const wash = washAt != null ? interpolate(f, [washAt, washAt + 36], [0, 1], { ...clamp, easing: ease }) : 0;
  const top = L[L.length - 1];
  // piedras repartidas en TODA la capa de concreto (filas con jitter) + la fila de arriba que se destapa
  const stones: { cx: number; cy: number; r: number; c: string }[] = [];
  let topRow = 0;
  if (top && top.kind === "concrete") {
    const rowsN = Math.max(2, Math.floor(top.h / 30)), colsN = Math.floor(gw / 34);
    for (let r = 0; r < rowsN; r++) for (let c = 0; c < colsN; c++) {
      const k = r * colsN + c; stones.push({ cx: gx + 17 + c * 34 + (r % 2) * 14 + noise(5, k) * 5, cy: top.y0 - 16 - r * 30 + noise(8, k) * 4, r: 12 + (noise(3, k) + 1) * 2.5, c: PEB[(k * 5 + r) % PEB.length] });
    }
    topRow = top.y0 - 16 - (rowsN - 1) * 30;
  }
  const pasteTop = top ? top.y1 + wash * 12 : 0; // la pasta baja ~1/3 de la piedra de arriba
  const rows = stones;
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, opacity: out * Math.min(1, inP * 1.4), transform: `translateY(${(1 - inP) * 40}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "rgba(12,12,12,0.78)", boxShadow: "0 20px 60px rgba(0,0,0,0.55)", border: "2px solid rgba(255,255,255,0.12)" }} />
      {title ? <div style={{ position: "absolute", left: gx, top: 22, fontFamily: F.ui, fontWeight: 900, letterSpacing: 5, fontSize: 30, color: C.yellow }}>{title}</div> : null}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tlc_soil" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#5b4332" /><circle cx="4" cy="5" r="1.6" fill="#7a5b44" /><circle cx="13" cy="12" r="1.2" fill="#3f2e22" /></pattern>
          <pattern id="tlc_grav" width="26" height="22" patternUnits="userSpaceOnUse"><rect width="26" height="22" fill="#6d6d6a" /><ellipse cx="7" cy="6" rx="6" ry="4.5" fill="#8d8c87" /><ellipse cx="19" cy="15" rx="6.5" ry="5" fill="#9b9a94" /><ellipse cx="20" cy="4" rx="3" ry="2.4" fill="#57574f" /></pattern>
          <clipPath id="tlc_clip"><rect x={gx} y={0} width={gw} height={base} /></clipPath>
        </defs>
        <g clipPath="url(#tlc_clip)">
          {L.map(l => l.kind === "concrete"
            ? <rect key={l.i} x={gx} y={l.y1} width={gw} height={l.y0 - l.y1} fill="#8f8f8b" />
            : <rect key={l.i} x={gx} y={l.y1} width={gw} height={l.y0 - l.y1} fill={`url(#${l.kind === "soil" ? "tlc_soil" : "tlc_grav"})`} />)}
          {top && top.kind === "concrete" && top.g > 0.98 ? rows.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} />) : null}
          {top && top.kind === "concrete" && top.g > 0.98 ? <rect x={gx} y={pasteTop} width={gw} height={Math.max(0, topRow + 14 - pasteTop)} fill="#9a9a95" opacity={0.97} /> : null}
        </g>
        {/* lluvia del lavado */}
        {wash > 0 && wash < 1 ? Array.from({ length: 34 }, (_, i) => { const t = ((f - (washAt || 0)) * 9 + i * 37) % 120; return <line key={i} x1={gx + 20 + (i * 53) % (gw - 40)} y1={top.y1 - 120 + t} x2={gx + 16 + (i * 53) % (gw - 40)} y2={top.y1 - 104 + t} stroke="#bfe3ff" strokeWidth={3} opacity={0.8} />; }) : null}
        {/* cotas */}
        {L.map(l => l.g > 0.6 ? (
          <g key={"d" + l.i} opacity={interpolate(l.g, [0.6, 1], [0, 1])}>
            <line x1={gx + gw + 26} y1={l.y1 + 3} x2={gx + gw + 26} y2={l.y0 - 3} stroke={C.yellow} strokeWidth={3} />
            <line x1={gx + gw + 16} y1={l.y1 + 3} x2={gx + gw + 36} y2={l.y1 + 3} stroke={C.yellow} strokeWidth={3} />
            <line x1={gx + gw + 16} y1={l.y0 - 3} x2={gx + gw + 36} y2={l.y0 - 3} stroke={C.yellow} strokeWidth={3} />
          </g>) : null)}
        {slopeLabel && top && top.g > 0.98 ? <g opacity={interpolate(f, [8 + layers.length * stagger + 10, 8 + layers.length * stagger + 20], [0, 1], clamp)}><line x1={gx + 20} y1={top.y1 - 40} x2={gx + gw - 30} y2={top.y1 - 22} stroke={C.white} strokeWidth={4} strokeDasharray="14 10" /><path d={`M${gx + gw - 52},${top.y1 - 34} L${gx + gw - 26},${top.y1 - 22} L${gx + gw - 50},${top.y1 - 8}`} stroke={C.white} strokeWidth={4} fill="none" /></g> : null}
      </svg>
      {L.map(l => l.g > 0.6 ? (
        <div key={"t" + l.i} style={{ position: "absolute", left: gx + gw + 52, top: (l.y0 + l.y1) / 2 - 30, opacity: interpolate(l.g, [0.6, 1], [0, 1]), width: 330 }}>
          <div style={{ fontFamily: F.impact, fontSize: 38, color: C.white, lineHeight: 1, textTransform: "uppercase", textShadow }}>{l.label}</div>
          {l.dim ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: C.yellow, marginTop: 4 }}>{l.dim}</div> : null}
        </div>) : null)}
      {slopeLabel && top && top.g > 0.98 ? <div style={{ position: "absolute", left: gx + 30, top: top.y1 - 96, fontFamily: F.hand, fontSize: 36, color: C.white, textShadow, opacity: interpolate(f, [8 + layers.length * stagger + 14, 8 + layers.length * stagger + 24], [0, 1], clamp) }}>{slopeLabel}</div> : null}
      {washLabel && wash > 0.4 ? <div style={{ position: "absolute", left: gx + gw / 2, top: H - 52, transform: "translateX(-50%)", fontFamily: F.impact, fontSize: 40, color: C.yellow, textShadow, opacity: interpolate(wash, [0.4, 0.8], [0, 1], clamp) }}>{washLabel}</div> : null}
    </div>
  );
};
