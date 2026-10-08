// Piezas compartidas del kit Claudio: la CAMA (foto o clip real del baño del hotel DEBAJO de cada componente: los gráficos viven
// dentro del mundo, nunca sobre negro), luz de baño que cae sobre el gráfico, sombra de contacto, sello de goma con tinta,
// tarjeta con sombra, cinta, el llavero de hotel y la plaqueta de latón (la identidad del canal).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, rnd, hexA } from "./ClTheme";

export const pop = (f: number, fps: number, at = 0, damping = 14) => spring({ frame: f - at, fps, config: { damping, stiffness: 140, mass: 0.7 } });
export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// salida suave al final de cualquier componente
export const useOut = (n = 8) => { const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); return lin(f, durationInFrames - n, durationInFrames, 1, 0); };

// azulejo crema del hotel en CSS (sólo si no hay cama: nunca debería verse en el render final)
export const tileBg = (w = 160, h = 160): React.CSSProperties => ({
  backgroundColor: CL.tile,
  backgroundImage: `linear-gradient(${CL.grout} 3px, transparent 3px), linear-gradient(90deg, ${CL.grout} 3px, transparent 3px)`,
  backgroundSize: `${w}px ${h}px, ${w}px ${h}px`,
});

// cama: foto (Ken-Burns lento) o clip (mudo). "x.mp4#270" = clip de 270 cuadros → si el componente dura más se ralentiza (nunca bucle).
// dim aclara para que el gráfico lea; warm = luz cálida de techo de hotel que cae desde arriba (el gráfico recibe la misma luz).
export const Bed: React.FC<{ src?: string; seed?: number; dim?: number; warm?: number }> = ({ src, seed = 1, dim = 0.12, warm = 0.5 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const k = interpolate(f, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateRight: "clamp" });
  const inn = rnd(seed) > 0.5, z = inn ? 1.04 + 0.05 * k : 1.09 - 0.05 * k;
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z), transformOrigin: `${30 + 40 * rnd(seed + 3)}% ${30 + 40 * rnd(seed + 5)}%` };
  if (!src) return <AbsoluteFill style={{ ...tileBg() }} />;
  const [file, nf] = src.split("#"); const rate = nf ? Math.max(0.35, Math.min(1, (+nf - 2) / Math.max(1, durationInFrames))) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: CL.white }}>
      {/\.mp4$/.test(file) ? <OffthreadVideo src={staticFile(file)} muted playbackRate={rate} style={st} /> : <Img src={staticFile(file)} style={st} />}
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: hexA(CL.white, dim) }} /> : null}
      {warm > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% -10%, rgba(255,226,170,${0.22 * warm}), rgba(255,226,170,0) 60%), radial-gradient(ellipse at 50% 120%, rgba(19,29,53,${0.18 * warm}), rgba(19,29,53,0) 55%)` }} /> : null}
    </AbsoluteFill>
  );
};

// luz del baño ENCIMA del gráfico (lo integra al plano: arriba más claro, abajo más sombra, leve viñeta)
export const RoomLight: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(180deg, rgba(255,240,210,${0.08 * k}) 0%, rgba(255,240,210,0) 35%, rgba(19,29,53,${0.1 * k}) 100%), radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(19,29,53,${0.22 * k}) 100%)` }} />
);

// sombra de contacto (elipse difusa) para apoyar objetos sobre la mesada/piso de la cama
export const Contact: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.32 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.07, width: w, height: w * 0.14, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(10,14,25,${o}) 0%, rgba(10,14,25,0) 70%)` }} />
);

export const Tape: React.FC<{ x: number; y: number; rot?: number; w?: number }> = ({ x, y, rot = -6, w = 130 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, background: hexA(CL.yellowSoft, 0.85), rotate: `${rot}deg`, boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }} />
);

// sello de goma con tinta irregular (entra con golpe + temblor de cámara opcional en el padre): rojo SÓLO si es alerta
export const Stamp: React.FC<{ text: string; at?: number; color?: string; x?: number | string; y?: number | string; rot?: number; size?: number }> = ({ text, at = 10, color = CL.navy, x = "50%", y = "50%", rot = -9, size = 56 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  const p = pop(f, fps, at, 9); const s = interpolate(p, [0, 1], [2.4, 1]);
  const id = `ink${Math.round(size)}${text.length}`;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(s), opacity: Math.min(1, p * 1.6) }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.9 1.75" /><feComposite in="SourceGraphic" operator="in" /></filter></svg>
      <div style={{ filter: `url(#${id})`, border: `${Math.round(size / 7)}px solid ${color}`, borderRadius: 14, padding: `${size * 0.12}px ${size * 0.45}px`, color, background: "rgba(255,255,255,0.55)", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: size * 0.07, textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1.05 }}>{text}</div>
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: CL.white, borderRadius: 18, boxShadow: `0 26px 56px ${CL.shadow}, 0 4px 10px rgba(0,0,0,0.12), 0 2px 0 rgba(255,255,255,0.8) inset`, ...style }}>{children}</div>
);

// parche bordado de la camisa del fumigador (marca del canal Fumigador): escudo verde con borde caqui, el número de capítulo y una cucaracha tachada
export const KeyTag: React.FC<{ num: string | number; label?: string; w?: number; color?: string }> = ({ num, label = "CAPÍTULO", w = 260, color = CL.navy }) => {
  const h = w * 1.18;
  const shield = (k: number) => `M ${w * (0.5)} ${w * 0.04 + k} L ${w * 0.96 - k} ${w * 0.16 + k} L ${w * 0.92 - k} ${h * 0.62} Q ${w * 0.84} ${h * 0.9} ${w / 2} ${h - k} Q ${w * 0.16} ${h * 0.9} ${w * 0.08 + k} ${h * 0.62} L ${w * 0.04 + k} ${w * 0.16 + k} Z`;
  return (
    <svg width={w} height={h + 10} viewBox={`0 0 ${w} ${h + 10}`} style={{ overflow: "visible" }}>
      <path d={shield(0)} fill={CL.brassLight} stroke="#7C6A40" strokeWidth={3} />
      <path d={shield(w * 0.05)} fill={color} />
      <path d={shield(w * 0.075)} fill="none" stroke={CL.brassLight} strokeWidth={2.5} strokeDasharray="7 6" />
      <text x={w / 2} y={w * 0.36} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={w * 0.075} letterSpacing={w * 0.012} fill={CL.brassLight}>{label}</text>
      <text x={w / 2} y={w * 0.36 + h * 0.4} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={w * 0.38} fill={CL.white}>{num}</text>
      <g transform={`translate(${w / 2} ${h * 0.86}) scale(${w / 520})`} opacity={0.95}>
        <ellipse cx={0} cy={0} rx={34} ry={18} fill="#6B3A1E" /><circle cx={-36} cy={0} r={9} fill="#6B3A1E" />
        {[-14, 2, 18].map((x) => (<g key={x}><line x1={x} y1={-14} x2={x - 8} y2={-30} stroke="#6B3A1E" strokeWidth={4} /><line x1={x} y1={14} x2={x - 8} y2={30} stroke="#6B3A1E" strokeWidth={4} /></g>))}
        <line x1={-56} y1={-34} x2={56} y2={34} stroke={CL.red} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// plaqueta de latón atornillada (como la de la puerta de la habitación)
export const Plaque: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "relative", background: `linear-gradient(160deg, ${CL.brassLight} 0%, ${CL.brass} 45%, #8C6831 100%)`, borderRadius: 12, padding: "18px 44px", boxShadow: `0 18px 36px ${CL.shadow}, inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -3px 0 rgba(0,0,0,0.2)`, ...style }}>
    {[[10, 10], [10, -1], [-1, 10], [-1, -1]].map(([l, t], i) => (
      <div key={i} style={{ position: "absolute", left: l >= 0 ? 12 : undefined, right: l < 0 ? 12 : undefined, top: t >= 0 ? 12 : undefined, bottom: t < 0 ? 12 : undefined, width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F4E2B8, #7A5A28)" }} />
    ))}
    {children}
  </div>
);
