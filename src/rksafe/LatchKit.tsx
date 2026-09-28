// LatchKit.tsx — primitivas compartidas de los componentes de CERRADURA del canal Ray Kessler
// (LatchCutaway, GapScanTest, DoorEdgeCount, BoltMorph, HingeScrewPull, LatchGuardInstall, FixLadder).
//
// ⛔ TODO TIEMPO ES UNA FRACCIÓN DE LA DURACIÓN DEL PLANO (`ph(a, b)`), nunca un cuadro fijo: el mismo
//    componente dura 4 s en un lugar y 9 s en otro, y un escalonado fijo deja la mitad del plano
//    quieta o corta la animación a la mitad (reference_componentes_escalonado_vs_hueco).
// ⛔ La cama de foto va ATENUADA (dim 0,58) y el diagrama vive en un PANEL propio: nada de velo
//    que tape el b-roll entero (reference_velo_componente_tapa_el_broll).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, clamp01, PhotoBed } from "./RayStage";

export const useT = (durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const dur = Math.max(30, durationInFrames ?? cfg.durationInFrames);
  /** progreso 0..1 entre dos FRACCIONES de la duración, con easing */
  const ph = (a: number, b: number, ease: (t: number) => number = Easing.inOut(Easing.cubic)) =>
    clamp01(interpolate(frame, [a * dur, Math.max(a * dur + 1, b * dur)], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
    }));
  const t = frame / dur;
  // salida común: los últimos ~8 % se desvanece el panel (sin cortar en seco contra el plano siguiente)
  const salida = 1 - ph(0.93, 1, Easing.in(Easing.quad));
  return { frame, dur, fps: cfg.fps, ph, t, salida };
};

/** Escenario: cama de foto atenuada + panel del diagrama + titular arriba a la izquierda. */
export const DiagramStage: React.FC<{
  bed?: string;
  kicker?: string;
  title?: string;
  caption?: string;
  captionTone?: "brass" | "danger" | "ok";
  aTitle: number;
  aCaption: number;
  salida: number;
  children: React.ReactNode;
}> = ({ bed, kicker, title, caption, captionTone = "brass", aTitle, aCaption, salida, children }) => {
  const capColor = captionTone === "danger" ? V.danger : captionTone === "ok" ? V.ok : V.brass;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.58} />
      <AbsoluteFill style={{ opacity: salida }}>
        {/* panel del diagrama: tarjeta oscura con borde latón, NO un velo de pantalla completa */}
        <div style={{
          position: "absolute", left: 90, right: 90, top: 210, bottom: 150, borderRadius: 18,
          background: `linear-gradient(180deg, ${rgba(V.ink1, 0.9)} 0%, ${rgba(V.ink0, 0.86)} 100%)`,
          border: `1.5px solid ${rgba(V.brass, 0.45)}`, boxShadow: `0 30px 80px ${rgba("#000000", 0.55)}`,
        }} />
        <div style={{ position: "absolute", left: 110, top: 70, opacity: aTitle, transform: `translateY(${((1 - aTitle) * 18).toFixed(1)}px)` }}>
          {kicker ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: V.brass, textTransform: "uppercase" }}>{kicker}</div> : null}
          {title ? <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 70, lineHeight: 1.02, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div> : null}
        </div>
        <AbsoluteFill>{children}</AbsoluteFill>
        {caption ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 58, display: "flex", justifyContent: "center", opacity: aCaption, transform: `translateY(${((1 - aCaption) * 16).toFixed(1)}px)` }}>
            <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 38, color: V.white, padding: "10px 26px", borderLeft: `6px solid ${capColor}`, background: rgba(V.ink0, 0.78), borderRadius: 4 }}>{caption}</div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Gradientes metálicos / madera, una sola vez por SVG (ids con prefijo para no chocar). */
export const MetalDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}_brass`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2CD7A" />
      <stop offset="0.45" stopColor="#C8912F" />
      <stop offset="1" stopColor="#7A5415" />
    </linearGradient>
    <linearGradient id={`${id}_steel`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E9EAEE" />
      <stop offset="0.5" stopColor="#A6A9B2" />
      <stop offset="1" stopColor="#5B5E66" />
    </linearGradient>
    <linearGradient id={`${id}_wood`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#6B4A2E" />
      <stop offset="1" stopColor="#3E2A19" />
    </linearGradient>
    <pattern id={`${id}_grain`} width="36" height="12" patternUnits="userSpaceOnUse">
      <path d="M0 6 Q9 2 18 6 T36 6" stroke="rgba(0,0,0,0.22)" strokeWidth="1.4" fill="none" />
    </pattern>
    <linearGradient id={`${id}_door`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E8E3D6" />
      <stop offset="1" stopColor="#CFC8B6" />
    </linearGradient>
  </defs>
);

/** Rótulo con línea guía que se DIBUJA (stroke-dashoffset) y texto que entra después. */
export const Callout: React.FC<{
  x: number; y: number; tx: number; ty: number; text: string; a: number; color?: string; align?: "start" | "end";
}> = ({ x, y, tx, ty, text, a, color = V.brassSoft, align = "start" }) => {
  const len = Math.hypot(tx - x, ty - y);
  const draw = clamp01(a * 1.6);
  const txt = clamp01(a * 1.6 - 0.6);
  return (
    <g>
      <circle cx={x} cy={y} r={7 * draw} fill={color} />
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={color} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
      <text x={tx + (align === "start" ? 12 : -12)} y={ty + 11} textAnchor={align} fill={V.white} opacity={txt}
        style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 32 }}>{text}</text>
    </g>
  );
};
