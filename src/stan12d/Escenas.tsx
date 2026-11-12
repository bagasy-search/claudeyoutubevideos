// Escenas sobre fotos de stan12d (ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
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
  const k = interpolate(f, [fIn - 6, fCenter], [1, 0], { ...CL, easing: Easing.inOut(Easing.quad) }); // radio del frío
  const cold = interpolate(f, [0, 20], [0, 1], CL);
  const warm = interpolate(f, [fButter - 4, fButter + 26], [0, 1], { ...CL, easing: io });
  const tx = 960 - cx * z, ty = 540 - cy * z;
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${Math.min(0, Math.max(1920 - 1920 * z, tx))}px, ${Math.min(0, Math.max(1080 - 1080 * z, ty))}px) scale(${z})` };
  return (
    <AbsoluteFill style={{ background: "#0d0a08", overflow: "hidden" }}>
      <div style={st}>
        <Img src={staticFile(src)} style={{ ...FULL, filter: `saturate(${1 + 0.18 * warm}) brightness(${1 + 0.05 * warm})` }} />
        {faces.map(([x, y, r], i) => (k > 0.01 ? (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: `circle(${r * k}px at ${x}px ${y}px)`, opacity: cold }}>
            <Img src={staticFile(src)} style={{ ...FULL, filter: "saturate(0.15) brightness(0.7) contrast(1.08)" }} />
          </div>
        ) : null))}
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 2 · la foto cenital gira sobre el centro real de la sartén, como una perilla: cada pancho llega arriba en su palabra
export const EscPerilla: React.FC<{ src: string; fRed: number; fMah: number; fGills: number; dur: number }> = ({ src, fRed, fMah, fGills, dur }) => {
  const f = useCurrentFrame();
  const PX = 955, PY = 510; // centro de la sartén
  const a1 = interpolate(f, [fRed - 16, fRed + 2], [0, -90], { ...CL, easing: io });
  const a2 = interpolate(f, [fMah - 26, fMah + 2], [0, -180], { ...CL, easing: io });
  const ang = a1 + a2;
  // encuadre fijo sobre el rayo de arriba; al final entra a los cortes abiertos
  const g = interpolate(f, [fGills - 6, fGills + 30], [0, 1], { ...CL, easing: io });
  const z = lerp(interpolate(f, [0, dur], [1.82, 1.9]), 2.7, g);
  const fx = PX, fy = lerp(255, 250, g); // punto de la foto (antes de girar) que va al centro del cuadro: el rayo de arriba
  return (
    <AbsoluteFill style={{ background: "#141312", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - fx * z}px, ${540 - fy * z}px) scale(${z})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${PX}px ${PY}px`, transform: `rotate(${ang}deg)` }}>
          <Img src={staticFile(src)} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 3 · la foto se pliega como el papel que muestra: izquierda, derecha y solapas; debajo queda la tabla real
export const EscPliego: React.FC<{ src: string; under: string; fL: number; fR: number; fT: number; dur: number }> = ({ src, under, fL, fR, fT, dur }) => {
  const f = useCurrentFrame();
  const XL = 760, XR = 1150, YT = 270, YB = 835;
  const L = interpolate(f, [fL, fL + 22], [0, 180], { ...CL, easing: io });
  const R = interpolate(f, [fR, fR + 22], [0, 180], { ...CL, easing: io });
  const T = interpolate(f, [fT, fT + 18], [0, 180], { ...CL, easing: io });
  const B = interpolate(f, [fT + 8, fT + 26], [0, 180], { ...CL, easing: io });
  const z = interpolate(f, [0, fL, fT + 30, dur], [1.0, 1.05, 1.5, 1.62], { ...CL, easing: io });
  const squeeze = interpolate(f, [fT + 26, fT + 40], [1, 0.965], { ...CL, easing: io });
  const piece = (x0: number, y0: number, w: number, h: number, dark: number): React.CSSProperties => ({ position: "absolute", left: x0, top: y0, width: w, height: h, backgroundImage: `url(${staticFile(src)})`, backgroundSize: "1920px 1080px", backgroundPosition: `${-x0}px ${-y0}px`, filter: `brightness(${1 - dark})` });
  const sh = (a: number) => 0.1 * Math.sin((a * Math.PI) / 180) + (a > 90 ? 0.07 : 0);
  return (
    <AbsoluteFill style={{ background: "#2a1c10", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "955px 552px", transform: `scale(${z})` }}>
        <Img src={staticFile(under)} style={{ ...FULL, filter: "brightness(0.82)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2600, perspectiveOrigin: "955px 552px", transformOrigin: "955px 552px", transform: `scale(${squeeze})` }}>
          {/* columna central: queda abajo de todo, con los panchos */}
          <div style={{ ...piece(XL, YT, XR - XL, YB - YT, 0), boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }} />
          {/* tercio izquierdo y derecho, a toda la altura: giran sobre las líneas 760 y 1150 y caen sobre los panchos */}
          <div style={{ ...piece(0, 0, XL, 1080, sh(L)), transformOrigin: "100% 50%", transform: `translateZ(${L > 2 ? 2 : 0}px) rotateY(${L}deg)`, boxShadow: L > 90 ? "14px 0 26px rgba(0,0,0,0.3)" : undefined }} />
          <div style={{ ...piece(XR, 0, 1920 - XR, 1080, sh(R)), transformOrigin: "0% 50%", transform: `translateZ(${R > 2 ? 4 : 0}px) rotateY(${-R}deg)`, boxShadow: R > 90 ? "-14px 0 26px rgba(0,0,0,0.3)" : undefined }} />
          {/* solapas de arriba y de abajo de la columna central (se doblan al final, por encima de todo) */}
          <div style={{ ...piece(XL, 0, XR - XL, YT, sh(T)), transformOrigin: `50% 100%`, transform: `translateZ(${T > 2 ? 8 : 0}px) rotateX(${-T}deg)`, boxShadow: T > 90 ? "0 10px 24px rgba(0,0,0,0.35)" : undefined }} />
          <div style={{ ...piece(XL, YB, XR - XL, 1080 - YB, sh(B)), transformOrigin: `50% 0%`, transform: `translateZ(${B > 2 ? 9 : 0}px) rotateX(${B}deg)`, boxShadow: B > 90 ? "0 -10px 24px rgba(0,0,0,0.35)" : undefined }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
