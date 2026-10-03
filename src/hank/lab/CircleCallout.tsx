// CircleCallout — anotación ENCIMA de un plano que corre: círculo de marcador dibujado a mano (loop imperfecto,
// ~0,4 s, animado "a 12 fps" con temblor escalonado), flecha + rótulo manuscrito (HAND), y todo lo que queda
// fuera del círculo se oscurece (máscara radial) para llevar el ojo. Fondo transparente.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HAND, HK, clamp, ease, rnd } from "../theme";

export type CircleCalloutProps = {
  x: number; y: number; r: number; label: string; side?: "left" | "right"; color?: string;
  /** sólo para probar en el lab: foto debajo */ _testBg?: string;
};

const W = 1920, H = 1080;
const STEP = 2.5; // 30 fps → 12 fps

// trazo de marcador: devuelve el "d" de una polilínea suave
const toPath = (pts: [number, number][]) => {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    d += ` Q${x1.toFixed(1)},${y1.toFixed(1)} ${((x1 + x2) / 2).toFixed(1)},${((y1 + y2) / 2).toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0].toFixed(1)},${l[1].toFixed(1)}`;
};

export const CircleCallout: React.FC<CircleCalloutProps> = ({ x, y, r, label, side = "right", color = HK.orange, _testBg }) => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const fs = Math.floor(f / STEP) * STEP; // tiempo escalonado a 12 fps
  const step = Math.floor(f / STEP);
  const boil = (k: number) => (rnd(step * 7.13 + k * 1.91) - 0.5) * 2; // -1..1, cambia 12 veces por segundo
  const out = clamp((f - (D - 10)) / 10);

  const cx = x * W, cy = y * H;

  // --- círculo: loop imperfecto que se pasa ~35° y termina un poco afuera (espiral)
  const a0 = (-128 * Math.PI) / 180;
  const sweep = Math.PI * 2 + (35 * Math.PI) / 180;
  const N = 72;
  const tilt = -0.12;
  const circle: [number, number][] = Array.from({ length: N + 1 }).map((_, i) => {
    const u = i / N;
    const th = a0 + u * sweep;
    const wob = 1 + 0.045 * Math.sin(2 * th + 1.3) + 0.025 * Math.sin(3 * th + 0.4) + 0.1 * u * u;
    const rx = r * 1.1 * wob, ry = r * 0.93 * wob;
    const px = Math.cos(th) * rx, py = Math.sin(th) * ry;
    const jx = boil(i * 0.37) * 1.4, jy = boil(i * 0.53 + 9) * 1.4;
    return [cx + px * Math.cos(tilt) - py * Math.sin(tilt) + jx, cy + px * Math.sin(tilt) + py * Math.cos(tilt) + jy];
  });
  const pCircle = clamp(fs / 12); // ~0,4 s
  const drawC = 1 - Math.pow(1 - pCircle, 1.6);

  // --- rótulo + flecha (del lado pedido; si no entra, se da vuelta)
  let dir = side === "left" ? -1 : 1;
  const labelW = Math.max(160, label.length * 30);
  if (dir === 1 && cx + r * 1.1 + 120 + labelW > W - 70) dir = -1;
  else if (dir === -1 && cx - r * 1.1 - 120 - labelW < 70) dir = 1;
  const up = cy - r - 150 > 60; // rótulo arriba si hay lugar
  const vy = up ? -1 : 1;
  const edgeTh = Math.atan2(vy * 0.75, dir * 0.66);
  const ex = cx + Math.cos(edgeTh) * (r * 1.1 + 18), ey = cy + Math.sin(edgeTh) * (r * 0.95 + 18);
  const lx = ex + dir * 130, ly = ey + vy * 95; // punta de salida de la flecha (junto al rótulo)
  const ctrl: [number, number] = [lx + dir * -10 + boil(3) * 2, ey + vy * 10 + boil(4) * 2];
  const pArrow = clamp((fs - 11) / 7);
  const arrowD = `M${lx.toFixed(1)},${ly.toFixed(1)} Q${ctrl[0].toFixed(1)},${ctrl[1].toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  const ang = Math.atan2(ey - ctrl[1], ex - ctrl[0]);
  const head = (da: number) => `M${ex.toFixed(1)},${ey.toFixed(1)} L${(ex - Math.cos(ang + da) * 26).toFixed(1)},${(ey - Math.sin(ang + da) * 26).toFixed(1)}`;
  const pHead = clamp((fs - 17) / 3);
  const pLabel = clamp((fs - 15) / 10);

  // --- foco: oscurece afuera del círculo
  const dim = ease(f / 12) * (1 - out);
  const R0 = r * 1.2, R1 = r * 1.2 + 260;

  const stroke = { fill: "none", stroke: color, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {_testBg ? (
        <AbsoluteFill>
          <Img src={staticFile(_testBg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{ opacity: dim, background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(8,10,8,0) ${R0}px, rgba(8,10,8,0.35) ${R0 + 60}px, rgba(8,10,8,0.62) ${R1}px, rgba(8,10,8,0.72) 100%)` }} />
      {/* un poco de luz dentro del círculo: el ojo va ahí */}
      <AbsoluteFill style={{ opacity: dim * 0.6, mixBlendMode: "soft-light", background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,230,190,0.55) 0px, rgba(255,230,190,0) ${R0}px)` }} />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.55))" }}>
        {/* sangrado del marcador */}
        <path d={toPath(circle)} {...stroke} strokeWidth={15} opacity={0.2} pathLength={1} strokeDasharray={`${drawC} 2`} />
        <path d={toPath(circle)} {...stroke} strokeWidth={8} pathLength={1} strokeDasharray={`${drawC} 2`} />
        {/* brillo del marcador (tinta húmeda) */}
        <path d={toPath(circle)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={`${drawC * 0.98} 2`} transform="translate(-1.5,-2)" />
        {pArrow > 0 && (
          <>
            <path d={arrowD} {...stroke} strokeWidth={6} pathLength={1} strokeDasharray={`${pArrow} 2`} />
            {pHead > 0 && <path d={`${head(0.55)} ${head(-0.55)}`} {...stroke} strokeWidth={6} pathLength={1} strokeDasharray={`${pHead} 2`} />}
          </>
        )}
      </svg>

      {/* rótulo manuscrito */}
      <div style={{
        position: "absolute", top: ly + (up ? -84 : 4) + boil(7) * 1.2,
        left: dir === 1 ? lx + 10 : undefined, right: dir === -1 ? W - lx + 10 : undefined,
        fontFamily: HAND, fontSize: 76, fontWeight: 700, color, lineHeight: 1, whiteSpace: "nowrap",
        transform: `rotate(${-3 + boil(8) * 0.4}deg)`, transformOrigin: dir === 1 ? "left center" : "right center",
        clipPath: dir === 1 ? `inset(-20% ${100 - pLabel * 100}% -20% -5%)` : `inset(-20% -5% -20% ${100 - pLabel * 100}%)`,
        textShadow: "0 3px 10px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.6)", opacity: 1 - out,
      }}>
        {label}
      </div>
    </AbsoluteFill>
  );
};
