// HouseRiskMap.tsx — PLANTA de una casa: las ventanas se ENCIENDEN por riesgo (canal Ray Kessler · rkwindow).
//
// La planta se dibuja trazo a trazo; la puerta del frente queda "vista" (calle, vecinos, cámara) y
// las tres ventanas privadas se encienden en orden (atrás, sótano, baño) con un anillo que late.
// La cámara virtual hace un empuje hacia cada ventana cuando se enciende.
// Tiempos relativos a la duración; `spots` define cuántas se encienden (máx. 3).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, enter, PhotoBed, Kick, Head, Keyring } from "./RayStage";

const ease = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const HouseRiskMap: React.FC<{
  title?: string;
  spots?: { label: string }[];
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({
  title = "Where he looks first",
  spots = [{ label: "Back window" }, { label: "Basement" }, { label: "Bathroom" }],
  caption = "Private. Hidden. Forgotten.",
  bed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const D = Math.max(60, durationInFrames ?? cfg.durationInFrames);
  const W = 1920, H = 1080;
  const draw = ease(frame, 0, D * 0.22, Easing.out(Easing.quad));
  const dash = 5200;
  // casa en planta
  const hx = 560, hy = 215, hw = 820, hh = 560;
  // posiciones de las ventanas de riesgo (atrás = arriba en la planta, sótano = abajo-izq, baño = der)
  const WIN = [
    { x: hx + 520, y: hy, w: 150, h: 16, lx: hx + 595, ly: hy - 44, anchor: "middle" as const },
    { x: hx - 8, y: hy + 400, w: 16, h: 110, lx: hx - 40, ly: hy + 470, anchor: "end" as const },
    { x: hx + hw - 8, y: hy + 120, w: 16, h: 90, lx: hx + hw + 40, ly: hy + 175, anchor: "start" as const },
  ];
  const n = Math.min(3, spots.length);
  const t0 = (i: number) => D * (0.3 + i * 0.17);
  // cámara virtual: empuje suave hacia la última ventana encendida
  let focusX = W / 2, focusY = H / 2, z = 1;
  for (let i = 0; i < n; i++) {
    const k = ease(frame, t0(i), t0(i) + D * 0.08);
    focusX = interpolate(k, [0, 1], [focusX, WIN[i].x + WIN[i].w / 2]);
    focusY = interpolate(k, [0, 1], [focusY, WIN[i].y + WIN[i].h / 2]);
    z = interpolate(k, [0, 1], [z, 1.12]);
  }
  const out = ease(frame, D * 0.84, D * 0.95);
  z = interpolate(out, [0, 1], [z, 1]);
  focusX = interpolate(out, [0, 1], [focusX, W / 2]);
  focusY = interpolate(out, [0, 1], [focusY, H / 2]);
  const titleA = enter(frame, 10);
  const capA = enter(frame - D * 0.84, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <PhotoBed src={bed} dim={0.76} />
      <AbsoluteFill style={{ background: `radial-gradient(100% 90% at 50% 50%, ${rgba("#0D0F14", 0.4)} 0%, ${rgba(V.ink0, 0.86)} 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.1, backgroundImage: `linear-gradient(${rgba(V.bone, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(V.bone, 0.5)} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${focusX.toFixed(1)}px ${focusY.toFixed(1)}px` }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {/* muros exteriores */}
          <rect x={hx} y={hy} width={hw} height={hh} fill={rgba(V.ink1, 0.6)} stroke={V.bone} strokeWidth={10}
            strokeDasharray={dash} strokeDashoffset={dash * (1 - draw)} />
          {/* tabiques */}
          <g stroke={rgba(V.bone, 0.6)} strokeWidth={5} opacity={draw}>
            <line x1={hx + 420} y1={hy} x2={hx + 420} y2={hy + 300} />
            <line x1={hx} y1={hy + 300} x2={hx + 560} y2={hy + 300} />
            <line x1={hx + 640} y1={hy + 300} x2={hx + hw} y2={hy + 300} />
            <line x1={hx + 640} y1={hy} x2={hx + 640} y2={hy + 300} />
            <line x1={hx + 300} y1={hy + 380} x2={hx + 300} y2={hy + hh} />
          </g>
          <g fontFamily={F_BODY} fontWeight={600} fontSize={24} fill={rgba(V.bone, 0.55)} opacity={draw} letterSpacing={2}>
            <text x={hx + 60} y={hy + 60}>KITCHEN</text>
            <text x={hx + 460} y={hy + 60}>BACK ROOM</text>
            <text x={hx + 670} y={hy + 60}>BATH</text>
            <text x={hx + 40} y={hy + 350}>STAIRS · BASEMENT</text>
            <text x={hx + 420} y={hy + 430}>LIVING ROOM</text>
          </g>
          {/* ventanas neutras */}
          <g fill={rgba("#9FD3E6", 0.5)} opacity={draw}>
            <rect x={hx + 120} y={hy - 8} width={140} height={16} />
            <rect x={hx + 380} y={hy + hh - 8} width={160} height={16} />
            <rect x={hx + 620} y={hy + hh - 8} width={120} height={16} />
          </g>
          {/* puerta del frente: a la vista */}
          <g opacity={enter(frame - D * 0.2, 10)}>
            <rect x={hx + 170} y={hy + hh - 10} width={90} height={20} fill={V.ok} />
            <text x={hx + 215} y={hy + hh + 60} textAnchor="middle" fontFamily={F_DISPLAY} fontWeight={700} fontSize={30} fill={V.ok} letterSpacing={2}>FRONT DOOR · SEEN</text>
            <line x1={hx - 120} y1={hy + hh + 120} x2={hx + hw + 120} y2={hy + hh + 120} stroke={rgba(V.bone, 0.35)} strokeWidth={4} strokeDasharray="30 20" />
            <text x={hx + hw + 110} y={hy + hh + 108} textAnchor="end" fontFamily={F_BODY} fontSize={22} fill={rgba(V.bone, 0.6)} letterSpacing={3}>STREET</text>
          </g>
          {/* ventanas de riesgo */}
          {WIN.slice(0, n).map((w, i) => {
            const a = enter(frame - t0(i), 8);
            const pulse = (frame - t0(i)) > 0 ? ((frame - t0(i)) % 36) / 36 : 0;
            return (
              <g key={i} opacity={a}>
                <circle cx={w.x + w.w / 2} cy={w.y + w.h / 2} r={30 + pulse * 70} fill="none" stroke={rgba(V.danger, 0.7 * (1 - pulse))} strokeWidth={5} />
                <rect x={w.x - 4} y={w.y - 4} width={w.w + 8} height={w.h + 8} fill={V.danger} />
                <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={V.dangerSoft} />
                <text x={w.lx} y={w.ly} textAnchor={w.anchor} fontFamily={F_DISPLAY} fontWeight={700} fontSize={44} fill={V.white}
                  style={{ textTransform: "uppercase", letterSpacing: 2 }}>{`${i + 1} · ${spots[i].label}`}</text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: "5.5%", top: "6%", opacity: titleA }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Keyring size={32} /><Kick>FLOOR PLAN · RISK</Kick>
        </div>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", background: rgba(V.ink0, 0.62), borderLeft: `6px solid ${V.brass}`, borderRadius: 4 }}>
          <Head size={60}>{title}</Head>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "3%", display: "flex", justifyContent: "center", opacity: capA }}>
        <div style={{ padding: "12px 32px", background: rgba(V.ink0, 0.8), border: `2px solid ${V.danger}`, borderRadius: 6, fontFamily: F_BODY, fontWeight: 700, fontSize: 40, color: V.white }}>
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
