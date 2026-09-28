// TfbRecipeFlow — diagrama de TRANSFORMACIÓN: una fila de estados (p. ej. leche → cuajada → cola) donde cada nodo es
// un ícono dibujado con código que se "rellena", unido al siguiente por una flecha que avanza con un punto viajero.
// El nodo activo late; debajo de cada uno, una etiqueta corta. Genérico: los íconos se eligen por nombre.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, CAVEAT, TFB, clamp, easeInOut, outro, pop } from "./theme";

export type FlowIcon = "milk" | "curd" | "jar" | "joint" | "powder" | "drop" | "clamp" | "clock";
export type FlowNode = { icon: FlowIcon; label: string; sub?: string; at: number }; // at = cuadro en que se activa

const Icon: React.FC<{ k: FlowIcon; t: number; s: number }> = ({ k, t, s }) => {
  const cid = "jc" + React.useId().replace(/:/g, "");
  const fillH = 70 * t; // "llenado" 0..1
  const stroke = { stroke: TFB.ink, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (k) {
    case "milk": return (
      <g transform={`scale(${s})`}><path d="M-34,-40 L-20,-62 L20,-62 L34,-40 L34,56 L-34,56 Z" fill="#fff" {...stroke} />
        <path d="M-20,-62 L-8,-78 L20,-78 L20,-62" fill="#e8f1ff" {...stroke} /><rect x={-34} y={56 - fillH * 1.2} width={68} height={fillH * 1.2} fill="#dfe9f7" opacity={0.9} />
        <rect x={-22} y={-10} width={44} height={30} rx={4} fill={TFB.yellow} {...stroke} /></g>);
    case "curd": return (
      <g transform={`scale(${s})`}><path d="M-60,-10 Q0,70 60,-10 Z" fill="#f3efe4" {...stroke} />
        {[[-26, -22], [0, -34], [24, -24], [-10, -14], [14, -12]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y + 30 * (1 - t)} r={15 * Math.min(1, t * 1.6 - i * 0.1 + 0.2)} fill="#fffdf6" {...stroke} strokeWidth={4} />))}</g>);
    case "jar": return (
      <g transform={`scale(${s})`}><rect x={-42} y={-60} width={84} height={16} rx={4} fill="#9a9a9a" {...stroke} />
        <path d="M-40,-44 L40,-44 Q48,-44 48,-30 L48,52 Q48,64 36,64 L-36,64 Q-48,64 -48,52 L-48,-30 Q-48,-44 -40,-44 Z" fill="rgba(220,235,245,0.55)" {...stroke} />
        <clipPath id={cid}><path d="M-46,-40 L46,-40 L46,60 L-46,60 Z" /></clipPath>
        <rect x={-48} y={62 - fillH * 1.3} width={96} height={fillH * 1.3} fill={TFB.glue} clipPath={`url(#${cid})`} />
        <path d={`M-40,${62 - fillH * 1.3} q20,-8 40,0 t40,0`} fill="none" stroke="#fff6d6" strokeWidth={4} opacity={t > 0.05 ? 0.9 : 0} /></g>);
    case "joint": return (
      <g transform={`scale(${s})`}><rect x={-70} y={-34} width={90} height={30} fill={TFB.wood} {...stroke} /><rect x={-20} y={-4} width={90} height={30} fill={TFB.wood} {...stroke} />
        <rect x={-20} y={-7} width={40} height={6} fill={TFB.glue} opacity={t} /><path d="M-60,-24 L10,-24 M-10,6 L60,6 M-10,16 L60,16" stroke={TFB.woodDark} strokeWidth={3} opacity={0.6} /></g>);
    case "powder": return (
      <g transform={`scale(${s})`}><path d="M-44,40 Q0,-40 44,40 Z" fill="#fbfbfb" {...stroke} /><path d="M26,-44 L54,-72" stroke={TFB.ink} strokeWidth={8} strokeLinecap="round" />
        <ellipse cx={20} cy={-40} rx={18} ry={9} fill="#fff" {...stroke} /></g>);
    case "drop": return (<g transform={`scale(${s})`}><path d="M0,-60 Q40,0 30,30 Q20,60 0,60 Q-20,60 -30,30 Q-40,0 0,-60 Z" fill="#9fd4ff" {...stroke} /></g>);
    case "clamp": return (
      <g transform={`scale(${s})`}><rect x={-70} y={-60} width={16} height={120} fill="#555" {...stroke} /><rect x={-70} y={-60} width={120} height={16} fill="#c23b22" {...stroke} />
        <rect x={-70} y={44} width={120} height={16} fill="#c23b22" {...stroke} /><rect x={-40} y={-20 + 20 * (1 - t)} width={70} height={40} fill={TFB.wood} {...stroke} /></g>);
    case "clock": return (
      <g transform={`scale(${s})`}><circle r={58} fill="#fff" {...stroke} />
        <line x1={0} y1={0} x2={0} y2={-40} {...stroke} strokeWidth={7} transform={`rotate(${t * 360})`} /><line x1={0} y1={0} x2={28} y2={0} {...stroke} strokeWidth={7} transform={`rotate(${t * 30})`} /></g>);
  }
};

export const TfbRecipeFlow: React.FC<{ nodes: FlowNode[]; dur: number; title?: string; y?: number }> = ({ nodes, dur, title, y = 54 }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig();
  const o = outro(f, dur, 10);
  const inn = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: easeInOut });
  const n = nodes.length, gap = Math.min(430, (W - 300) / Math.max(1, n - 1)), x0 = W / 2 - (gap * (n - 1)) / 2, cy = (y / 100) * H;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,${0.15 * inn}) 0%, rgba(0,0,0,${0.62 * inn}) 40%, rgba(0,0,0,${0.62 * inn}) 72%, rgba(0,0,0,${0.15 * inn}) 100%)` }} />
      {title && <div style={{ position: "absolute", top: cy - 250, width: "100%", textAlign: "center", fontFamily: ANTON, fontSize: 72, color: TFB.white, textTransform: "uppercase",
        opacity: inn, transform: `translateY(${(1 - inn) * -20}px)`, textShadow: "0 5px 0 rgba(0,0,0,0.5)" }}>{title}</div>}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(0, -1).map((nd, i) => {
          const a = x0 + gap * i + 95, b = x0 + gap * (i + 1) - 95;
          const t = interpolate(f, [nodes[i + 1].at - 14, nodes[i + 1].at], [0, 1], { ...clamp, easing: easeInOut });
          const xe = a + (b - a) * t;
          return (<g key={i}>
            <line x1={a} y1={cy} x2={b} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
            <line x1={a} y1={cy} x2={xe} y2={cy} stroke={TFB.yellow} strokeWidth={9} strokeLinecap="round" />
            {t > 0 && t < 1 && <circle cx={xe} cy={cy} r={13} fill={TFB.white} />}
            {t >= 1 && <path d={`M${b - 22},${cy - 18} L${b},${cy} L${b - 22},${cy + 18}`} fill="none" stroke={TFB.yellow} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
          </g>);
        })}
        {nodes.map((nd, i) => {
          const p = pop(f, fps, nd.at - 6, 11, 0.7), act = interpolate(f, [nd.at, nd.at + 18], [0, 1], clamp);
          const next = nodes[i + 1]?.at ?? dur + 99, live = f >= nd.at && f < next;
          const pulse = live ? 1 + 0.04 * Math.sin((f - nd.at) / 4) : 1;
          const cx = x0 + gap * i;
          return (<g key={i} transform={`translate(${cx},${cy}) scale(${interpolate(p, [0, 1], [0.3, 1]) * pulse})`} opacity={interpolate(p, [0, 0.3], [0, 1], clamp)}>
            <circle r={96} fill={live ? TFB.yellow : TFB.cream} stroke={TFB.ink} strokeWidth={6} />
            <Icon k={nd.icon} t={act} s={0.95} />
          </g>);
        })}
      </svg>
      {nodes.map((nd, i) => {
        const p = interpolate(f, [nd.at + 2, nd.at + 12], [0, 1], clamp);
        return (<div key={i} style={{ position: "absolute", left: x0 + gap * i, top: cy + 116, transform: `translateX(-50%) translateY(${(1 - p) * 16}px)`, opacity: p, textAlign: "center" }}>
          <div style={{ fontFamily: ANTON, fontSize: 56, color: TFB.white, textTransform: "uppercase", lineHeight: 1, textShadow: "0 4px 0 rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{nd.label}</div>
          {nd.sub && <div style={{ fontFamily: CAVEAT, fontWeight: 700, fontSize: 44, color: TFB.yellow, marginTop: 4, textShadow: "0 3px 0 #000", whiteSpace: "nowrap" }}>{nd.sub}</div>}
        </div>);
      })}
    </AbsoluteFill>
  );
};
