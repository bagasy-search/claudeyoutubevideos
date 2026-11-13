// Escenas sobre fotos de stan12p (ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// ── Escena 1 · el frío se achica hacia el centro de cada cara de corte: el calor entra de afuera hacia adentro
export const EscCalor: React.FC<{ src: string; faces: [number, number, number][]; fIn: number; fCenter: number; fButter: number; dur: number }> = ({ src, faces, fIn, fCenter, fButter, dur }) => {
  const f = useCurrentFrame();
  const cx = faces.reduce((a, c) => a + c[0], 0) / faces.length, cy = faces.reduce((a, c) => a + c[1], 0) / faces.length;
  // cámara continua: de plano general a las dos caras de corte
  const z = interpolate(f, [0, fIn, fCenter, dur], [1.0, 1.12, 1.42, 1.5], { ...CL, easing: io });
  const k = interpolate(f, [fIn - 6, fCenter + 10], [1, 0.14], { ...CL, easing: Easing.inOut(Easing.quad) }); // radio del frío (no llega a punto: se disuelve)
  const cold = interpolate(f, [0, 20, fCenter + 2, fCenter + 16], [0, 1, 1, 0], CL);
  const warm = interpolate(f, [fButter - 4, fButter + 26], [0, 1], { ...CL, easing: io });
  const tx = 960 - cx * z, ty = 540 - cy * z;
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${Math.min(0, Math.max(1920 - 1920 * z, tx))}px, ${Math.min(0, Math.max(1080 - 1080 * z, ty))}px) scale(${z})` };
  return (
    <AbsoluteFill style={{ background: "#0d0a08", overflow: "hidden" }}>
      <div style={st}>
        <Img src={staticFile(src)} style={{ ...FULL, filter: `saturate(${1 + 0.18 * warm}) brightness(${1 + 0.05 * warm})` }} />
        {faces.map(([x, y, r], i) => (k > 0.01 ? (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: cold, WebkitMaskImage: `radial-gradient(circle ${r * k}px at ${x}px ${y}px, #000 78%, transparent 100%)`, maskImage: `radial-gradient(circle ${r * k}px at ${x}px ${y}px, #000 78%, transparent 100%)` }}>
            <Img src={staticFile(src)} style={{ ...FULL, filter: "saturate(0.3) brightness(0.8) hue-rotate(-24deg) contrast(1.06)" }} />
          </div>
        ) : null))}
        {faces.map(([x, y, r], i) => (k > 0.03 && k < 0.99 ? (
          <div key={"h" + i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, mixBlendMode: "screen", opacity: cold, background: `radial-gradient(circle at ${x}px ${y}px, transparent ${Math.max(0, r * k - 34)}px, rgba(255,140,40,0.85) ${r * k}px, rgba(255,90,20,0.32) ${r * k + 30}px, transparent ${r * k + 60}px)` }} />
        ) : null))}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 2 · la sartén (recorte circular por su borde real) gira dentro de la foto quieta, como una perilla: cada pancho llega arriba en su palabra; al final la cámara entra a los cortes
export const EscPerilla: React.FC<{ src: string; fRed: number; fMah: number; fGills: number; dur: number }> = ({ src, fRed, fMah, fGills, dur }) => {
  const f = useCurrentFrame();
  const PX = 955, PY = 510, PR = 585; // centro y radio del borde interior de la sartén
  const step = (at: number, len: number, deg: number) => { const t = interpolate(f, [at - len, at], [0, 1], CL); return deg * Easing.out(Easing.back(1.6))(t); }; // frena con un rebote, como un clic
  const ang = step(fRed, 18, -90) + step(fMah, 28, -180);
  const g = interpolate(f, [fGills - 4, dur - 6], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const k = lerp(interpolate(f, [0, fGills], [1.0, 1.08], CL), 1.6, g);
  const fx = lerp(960, PX, g), fy = lerp(540, 380, g);
  const tx = Math.min(0, Math.max(1920 - 1920 * k, 960 - fx * k)), ty = Math.min(0, Math.max(1080 - 1080 * k, 540 - fy * k));
  return (
    <AbsoluteFill style={{ background: "#171615", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `circle(${PR}px at ${PX}px ${PY}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${PX}px ${PY}px`, transform: `rotate(${ang}deg)` }}>
            <Img src={staticFile(src)} style={FULL} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
