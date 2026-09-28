// SashPinCutaway.tsx — CORTE lateral del encuentro de una ventana GUILLOTINA (double hung):
// el pin de acero que une las dos hojas (canal Ray Kessler · rkwindow).
//
// Tiempos relativos a la duración:
//   0-25 %  las dos hojas se dibujan en corte (la interior abajo/adelante, la exterior arriba/atrás).
//   25-45 % el agujero se TRAZA en ángulo hacia abajo, atraviesa la hoja interior y se DETIENE antes
//           de la cara exterior (la línea roja punteada marca "stop short").
//   45-60 % el pin baja por el agujero y asienta.
//   62-90 % la hoja interior intenta subir (flecha), tiembla, y no se mueve: las dos son una pieza.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Kick, Head, Keyring } from "./RayStage";

const ease = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const SashPinCutaway: React.FC<{
  title?: string;
  caption?: string;
  labels?: { text: string }[];
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Pin the two sashes together",
  caption = "Two sashes, one piece",
  labels = [{ text: "Inside sash" }, { text: "Outside sash" }, { text: "Stop short" }],
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? cfg.durationInFrames);
  const W = 1920, H = 1080;
  const draw = ease(frame, 0, D * 0.25, Easing.out(Easing.quad));
  const drill = ease(frame, D * 0.25, D * 0.45);
  const pin = ease(frame, D * 0.45, D * 0.6, Easing.out(Easing.back(1.4)));
  const lift = ease(frame, D * 0.62, D * 0.7, Easing.in(Easing.quad));
  const tremble = frame > D * 0.66 && frame < D * 0.86 ? Math.sin(frame * 2.7) * 3.5 : 0;
  const capA = enter(frame - D * 0.7, 12);
  const titleA = enter(frame, 10);

  // corte: vemos el perfil. La hoja interior (abajo) sube por delante; la exterior (arriba) por detrás.
  const cx = 1000;
  const inner = { x: cx - 40, y: 500, w: 110, h: 420 };   // riel superior de la hoja interior
  const outer = { x: cx + 70, y: 160, w: 110, h: 480 };   // riel inferior de la hoja exterior
  // el agujero: entra por la cara interior de la hoja interior y baja en ángulo
  const h0 = { x: inner.x - 10, y: 540 };
  const h1 = { x: outer.x + outer.w - 30, y: 580 };        // se detiene ANTES de la cara exterior (x = outer.x + outer.w)
  const hx = interpolate(drill, [0, 1], [h0.x, h1.x]);
  const hy = interpolate(drill, [0, 1], [h0.y, h1.y]);
  const pinLen = h1.x - h0.x - 10;
  const pinOut = 220 * (1 - pin);
  const ang = Math.atan2(h1.y - h0.y, h1.x - h0.x);
  const pinDx = Math.cos(ang), pinDy = Math.sin(ang);
  const dash = 2400;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.72} />
      <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 52% 55%, ${rgba(V.ink0, 0.2)} 0%, ${rgba(V.ink0, 0.82)} 100%)` }} />

      <div style={{ position: "absolute", left: "5.5%", top: "7%", opacity: titleA, transform: `translateY(${((1 - titleA) * 16).toFixed(1)}px)`, maxWidth: "42%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>CUTAWAY · DOUBLE HUNG</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.6), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={62}>{title}</Head>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="sp_wood" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={rgba(V.brass, 0.22)} strokeWidth="2" />
          </pattern>
          <linearGradient id="sp_steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6E6EA" />
            <stop offset="100%" stopColor="#7C7C86" />
          </linearGradient>
        </defs>
        {/* adentro / afuera */}
        <g opacity={draw}>
          <text x={560} y={1010} fontFamily={F_DISPLAY} fontWeight={700} fontSize={30} fill={rgba(V.bone, 0.7)} letterSpacing={3}>INSIDE</text>
          <text x={1400} y={1010} fontFamily={F_DISPLAY} fontWeight={700} fontSize={30} fill={rgba(V.bone, 0.7)} letterSpacing={3}>OUTSIDE</text>
          <line x1={cx + 250} y1={140} x2={cx + 250} y2={990} stroke={rgba(V.bone, 0.18)} strokeWidth={2} strokeDasharray="10 12" />
        </g>
        {/* hoja exterior (arriba) */}
        <g transform={`translate(0,0)`}>
          <rect x={outer.x} y={outer.y} width={outer.w} height={outer.h} fill="url(#sp_wood)" stroke={V.brass} strokeWidth={5}
            strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
          <rect x={outer.x + outer.w / 2 - 6} y={outer.y - 60} width={12} height={62} fill={rgba("#9FD3E6", 0.3)} opacity={draw} />
        </g>
        {/* hoja interior (abajo): intenta subir */}
        <g transform={`translate(0,${(-(lift * 4) + tremble).toFixed(2)})`}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill="url(#sp_wood)" stroke={V.brassSoft} strokeWidth={5}
            strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
          <rect x={inner.x + inner.w / 2 - 6} y={inner.y + inner.h - 2} width={12} height={60} fill={rgba("#9FD3E6", 0.3)} opacity={draw} />
          {/* agujero trazado */}
          <line x1={h0.x} y1={h0.y} x2={hx} y2={hy} stroke={rgba(V.ink0, 0.95)} strokeWidth={22} strokeLinecap="round" />
          <line x1={h0.x} y1={h0.y} x2={hx} y2={hy} stroke={rgba(V.brassSoft, 0.9)} strokeWidth={3} strokeDasharray="8 8" />
          {/* pin de acero */}
          <g opacity={pin > 0.01 ? 1 : 0} transform={`translate(${(-pinDx * pinOut).toFixed(2)},${(-pinDy * pinOut).toFixed(2)})`}>
            <line x1={h0.x - 18 * pinDx} y1={h0.y - 18 * pinDy} x2={h0.x + pinLen * pinDx} y2={h0.y + pinLen * pinDy} stroke="url(#sp_steel)" strokeWidth={15} strokeLinecap="round" />
            <circle cx={h0.x - 22 * pinDx} cy={h0.y - 22 * pinDy} r={14} fill="#C9C9CF" stroke="#6D6D76" strokeWidth={2} />
          </g>
        </g>
        {/* marca "stop short": la cara exterior NO se perfora */}
        <g opacity={enter(frame - D * 0.4, 10)}>
          <line x1={outer.x + outer.w} y1={h1.y - 70} x2={outer.x + outer.w} y2={h1.y + 70} stroke={V.danger} strokeWidth={5} strokeDasharray="12 8" />
        </g>
        {/* flecha de intento de subir + candado de "no" */}
        <g opacity={lift * (1 - ease(frame, D * 0.86, D * 0.95))}>
          <line x1={inner.x - 110} y1={inner.y + 300} x2={inner.x - 110} y2={inner.y + 140} stroke={V.danger} strokeWidth={9} strokeLinecap="round" />
          <polygon points={`${inner.x - 110},${inner.y + 110} ${inner.x - 132},${inner.y + 146} ${inner.x - 88},${inner.y + 146}`} fill={V.danger} />
          <line x1={inner.x - 150} y1={inner.y + 180} x2={inner.x - 70} y2={inner.y + 260} stroke={V.white} strokeWidth={7} strokeLinecap="round" />
          <line x1={inner.x - 70} y1={inner.y + 180} x2={inner.x - 150} y2={inner.y + 260} stroke={V.white} strokeWidth={7} strokeLinecap="round" />
        </g>
        {/* rótulos */}
        {[
          { x: inner.x, y: inner.y + 250, tx: 560, ty: 780, end: true },
          { x: outer.x + outer.w, y: outer.y + 120, tx: 1360, ty: 300, end: false },
          { x: outer.x + outer.w, y: h1.y + 40, tx: 1360, ty: 720, end: false },
        ].map((c, i) => {
          const a = enter(frame - D * (0.18 + i * 0.13), 10);
          if (!labels[i]) return null;
          return (
            <g key={i} opacity={a}>
              <line x1={c.x} y1={c.y} x2={c.tx} y2={c.ty} stroke={i === 2 ? V.dangerSoft : V.brassSoft} strokeWidth={2.5} />
              <circle cx={c.x} cy={c.y} r={7} fill={i === 2 ? V.dangerSoft : V.brassSoft} />
              <text x={c.end ? c.tx - 12 : c.tx + 12} y={c.ty + 12} textAnchor={c.end ? "end" : "start"} fontFamily={F_DISPLAY} fontWeight={700} fontSize={40}
                fill={V.white} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>{labels[i].text}</text>
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: "6%", display: "flex", justifyContent: "center", opacity: capA, transform: `translateY(${((1 - capA) * 18).toFixed(1)}px)` }}>
        <div style={{ padding: "14px 34px", background: rgba(V.ink0, 0.78), border: `2px solid ${V.brass}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 42, color: V.brassSoft }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
