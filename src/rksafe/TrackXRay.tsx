// TrackXRay.tsx — RAYOS X del riel de una ventana CORREDIZA (canal Ray Kessler · rkwindow).
//
// Qué cuenta, en 3 tiempos relativos a la duración (nunca cuadros fijos):
//   1) 0-30 %  el marco y el riel se DIBUJAN trazo a trazo (stroke-dashoffset) con un barrido de escáner.
//   2) 30-52 % la varilla CAE en el riel, entre el borde de la hoja móvil y la jamba, y asienta con rebote.
//   3) 58-88 % la hoja intenta deslizarse, CHOCA contra la varilla (golpe rojo, sacudida) y vuelve.
// Encuadre DEFENSIVO: muestra por qué la varilla frena el deslizamiento, no cómo abrir nada.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, clamp01, PhotoBed, Kick, Head, Keyring } from "./RayStage";

const ease = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const TrackXRay: React.FC<{
  title?: string;
  caption?: string;
  labels?: { text: string }[];
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "The stick in the track",
  caption = "Latch or no latch, it cannot slide",
  labels = [{ text: "Moving pane" }, { text: "Wood dowel" }, { text: "Bottom track" }],
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? cfg.durationInFrames);
  const W = 1920, H = 1080;

  // geometría del marco (vista desde adentro de la casa)
  const fr = { x: 470, y: 250, w: 1000, h: 560 };
  const trackY = fr.y + fr.h - 24;
  const paneW = fr.w / 2 + 16;
  const draw = ease(frame, 0, D * 0.3, Easing.out(Easing.quad));
  const drop = ease(frame, D * 0.3, D * 0.46, Easing.in(Easing.quad));
  const settle = frame > D * 0.46 ? Math.sin((frame - D * 0.46) / 2.2) * Math.exp(-(frame - D * 0.46) / 6) * 10 : 0;
  // intento de deslizar: 0 → toca la varilla (hueco de 10 px) → rebota
  const tryT = ease(frame, D * 0.58, D * 0.66, Easing.in(Easing.cubic));
  const back = ease(frame, D * 0.7, D * 0.84);
  const push = 10 * tryT * (1 - back);
  const hit = frame > D * 0.66 && frame < D * 0.66 + 10;
  const shake = hit ? Math.sin(frame * 3.1) * 6 * (1 - (frame - D * 0.66) / 10) : 0;
  const scanX = interpolate(frame % Math.max(40, Math.round(D * 0.35)), [0, Math.max(40, Math.round(D * 0.35))], [fr.x - 80, fr.x + fr.w + 80]);
  const titleA = enter(frame, 10);
  const capA = enter(frame - D * 0.68, 12);
  const dash = 3200;

  // la hoja móvil está a la IZQUIERDA; la varilla ocupa el riel desde su borde hasta la jamba derecha
  const paneX = fr.x + 12 + push + shake;
  const dowelX0 = fr.x + 12 + paneW + 10;
  const dowelX1 = fr.x + fr.w - 12;
  const dowelY = interpolate(drop, [0, 1], [fr.y - 160, trackY - 16]) + settle;

  const callouts = [
    { x: paneX + paneW * 0.4, y: fr.y + 120, tx: fr.x - 90, ty: fr.y + 90, left: true },
    { x: (dowelX0 + dowelX1) / 2, y: trackY - 12, tx: fr.x + fr.w + 90, ty: trackY - 150, left: false },
    { x: fr.x + 200, y: trackY + 10, tx: fr.x - 90, ty: trackY + 90, left: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.72} />
      <AbsoluteFill style={{ background: `radial-gradient(90% 80% at 50% 55%, ${rgba("#0B1A22", 0.55)} 0%, ${rgba(V.ink0, 0.82)} 100%)` }} />
      {/* retícula de placa radiográfica */}
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: `linear-gradient(${rgba(V.brass, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(V.brass, 0.5)} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div style={{ position: "absolute", left: "5.5%", top: "7%", opacity: titleA, transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>X-RAY · SLIDING WINDOW</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={64}>{title}</Head>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="tx_glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rgba("#9FD3E6", 0.16)} />
            <stop offset="100%" stopColor={rgba("#9FD3E6", 0.04)} />
          </linearGradient>
          <linearGradient id="tx_wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9D3A6" />
            <stop offset="100%" stopColor="#B48A4E" />
          </linearGradient>
        </defs>
        {/* marco dibujado trazo a trazo */}
        <rect x={fr.x} y={fr.y} width={fr.w} height={fr.h} fill="none" stroke={V.brass} strokeWidth={6} rx={6}
          strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
        {/* riel inferior en corte */}
        <g opacity={clamp01(draw * 1.4 - 0.2)}>
          <rect x={fr.x + 8} y={trackY - 4} width={fr.w - 16} height={22} fill={rgba(V.brass, 0.14)} stroke={rgba(V.brass, 0.8)} strokeWidth={2} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <line key={k} x1={fr.x + 30 + k * 125} y1={trackY + 18} x2={fr.x + 50 + k * 125} y2={trackY - 2} stroke={rgba(V.brass, 0.35)} strokeWidth={1.5} />
          ))}
        </g>
        {/* hoja fija (derecha, atrás) */}
        <rect x={fr.x + fr.w / 2 - 4} y={fr.y + 14} width={fr.w / 2 - 10} height={fr.h - 42} fill="url(#tx_glass)" stroke={rgba(V.bone, 0.45)} strokeWidth={2}
          strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
        {/* hoja móvil (izquierda, adelante) */}
        <g transform={`translate(${(paneX - (fr.x + 12)).toFixed(2)},0)`} opacity={clamp01(draw * 1.3)}>
          <rect x={fr.x + 12} y={fr.y + 12} width={paneW} height={fr.h - 38} fill="url(#tx_glass)" stroke={V.bone} strokeWidth={4} rx={3} />
          <line x1={fr.x + 60} y1={fr.y + 60} x2={fr.x + 180} y2={fr.y + 200} stroke={rgba(V.white, 0.25)} strokeWidth={3} />
          {/* pestillo cansado en el encuentro */}
          <rect x={fr.x + 12 + paneW - 26} y={fr.y + fr.h / 2 - 30} width={16} height={60} rx={4} fill={rgba(V.steel, 0.8)} />
        </g>
        {/* varilla que cae */}
        <g opacity={drop > 0 ? 1 : 0}>
          <rect x={dowelX0} y={dowelY - 14} width={dowelX1 - dowelX0} height={28} rx={14} fill="url(#tx_wood)" stroke="#7A5A2E" strokeWidth={2} />
          <line x1={dowelX0 + 20} y1={dowelY - 4} x2={dowelX1 - 30} y2={dowelY - 6} stroke={rgba("#7A5A2E", 0.5)} strokeWidth={2} />
        </g>
        {/* golpe */}
        {frame > D * 0.66 && frame < D * 0.66 + 16 ? (
          <g opacity={1 - (frame - D * 0.66) / 16}>
            <circle cx={dowelX0} cy={trackY - 16} r={20 + (frame - D * 0.66) * 5} fill="none" stroke={V.danger} strokeWidth={6} />
            <circle cx={dowelX0} cy={trackY - 16} r={10 + (frame - D * 0.66) * 3} fill={rgba(V.danger, 0.35)} />
          </g>
        ) : null}
        {/* flecha del intento de deslizar */}
        <g opacity={tryT * (1 - back)}>
          <line x1={fr.x + 180} y1={fr.y + fr.h / 2} x2={fr.x + 380} y2={fr.y + fr.h / 2} stroke={V.danger} strokeWidth={8} strokeLinecap="round" />
          <polygon points={`${fr.x + 400},${fr.y + fr.h / 2} ${fr.x + 370},${fr.y + fr.h / 2 - 20} ${fr.x + 370},${fr.y + fr.h / 2 + 20}`} fill={V.danger} />
        </g>
        {/* barrido del escáner */}
        <rect x={scanX} y={fr.y - 30} width={6} height={fr.h + 60} fill={rgba("#9FD3E6", 0.35)} />
        <rect x={scanX - 40} y={fr.y - 30} width={40} height={fr.h + 60} fill={rgba("#9FD3E6", 0.06)} />
        {/* rótulos con línea guía */}
        {callouts.map((c, i) => {
          const a = enter(frame - D * (0.22 + i * 0.12), 10);
          if (!labels[i]) return null;
          return (
            <g key={i} opacity={a}>
              <line x1={c.x} y1={c.y} x2={c.tx} y2={c.ty} stroke={V.brassSoft} strokeWidth={2.5} strokeDasharray={600} strokeDashoffset={600 * (1 - a)} />
              <circle cx={c.x} cy={c.y} r={7} fill={V.brassSoft} />
              <text x={c.left ? c.tx - 12 : c.tx + 12} y={c.ty + 10} textAnchor={c.left ? "end" : "start"} fontFamily={F_DISPLAY} fontWeight={700} fontSize={38} fill={V.white}
                style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>{labels[i].text}</text>
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: "7%", display: "flex", justifyContent: "center", opacity: capA, transform: `translateY(${((1 - capA) * 18).toFixed(1)}px)` }}>
        <div style={{ padding: "14px 34px", background: rgba(V.ink0, 0.78), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: V.brassSoft }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
