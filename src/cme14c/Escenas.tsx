// Escenas sobre las fotos reales de cme14c (método edicion-sobre-fotos; ideas en D:/rtmp/cme14c/ideas.md).
// Capas de la misma foto en 1920x1080 (objectFit fill): sin dibujos encima, sin tarjetas.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const fade = (f: number, dur: number) => interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL);

// 1 · LUPA: un círculo con la misma foto agrandada 2,4× viaja por tres lugares reales del refri y al final crece hasta llenar el cuadro
export const EscLupa: React.FC<{ dur: number; img: string; fCost: number; fPuerta: number; fAbajo: number; fModelo: number }> = ({ dur, img, fCost, fPuerta, fAbajo, fModelo }) => {
  const f = useCurrentFrame();
  const K = 2.4;
  // paradas en coordenadas de la foto: entrada desde la alacena, canto derecho, papelitos de la puerta, zócalo
  const P = [[300, 760], [708, 420], [580, 275], [615, 925]];
  const T = [Math.max(0, fCost - 24), fCost, fPuerta, fAbajo];
  const tx = interpolate(f, T, P.map((p) => p[0]), { ...CL, easing: io });
  const ty = interpolate(f, T, P.map((p) => p[1]), { ...CL, easing: io });
  // radio: aparece, viaja, y en "Ahí viene el modelo" crece hasta tapar el cuadro
  const r = interpolate(f, [T[0], T[0] + 14, fModelo, fModelo + 30], [0, 170, 170, 1500], { ...CL, easing: io });
  const dim = interpolate(f, [T[0], T[0] + 14], [1, 0.62], CL);
  // cámara: se arrima despacio al refri
  const camZ = interpolate(f, [0, dur], [1.0, 1.07], CL);
  const sx = (x: number) => 960 + (x - 615) * camZ, sy = (y: number) => 540 + (y - 560) * camZ;
  const cx = sx(tx), cy = sy(ty);
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - 615 * camZ}px, ${540 - 560 * camZ}px) scale(${camZ})` }}>
        <Img src={staticFile(img)} style={{ ...FULL, filter: `brightness(${dim})` }} />
      </AbsoluteFill>
      {r > 1 ? (
        <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }}>
          <div style={{ position: "absolute", left: r - tx * K * camZ, top: r - ty * K * camZ, width: 1920 * K * camZ, height: 1080 * K * camZ }}>
            <Img src={staticFile(img)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "fill" }} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 2 · VAHO: la foto arranca empañada por el frío; se limpia la franja de la repisa de en medio y después la de arriba
export const EscVaho: React.FC<{ dur: number; img: string; fMedio: number; fCong: number }> = ({ dur, img, fMedio, fCong }) => {
  const f = useCurrentFrame();
  const vaho = interpolate(f, [0, 30], [0.25, 1], CL);
  // franja de en medio: de izquierda a derecha, 180→1830, y 380–700
  const m = interpolate(f, [fMedio, fMedio + 26], [180, 1830], { ...CL, easing: io });
  // franja de arriba: de derecha a izquierda, 1830→190, y 0–150
  const a = interpolate(f, [fCong, fCong + 22], [1830, 190], { ...CL, easing: io });
  const camZ = interpolate(f, [0, fMedio + 26, dur], [1.12, 1.05, 1.02], { ...CL, easing: io });
  const camY = interpolate(f, [0, fMedio + 26, fCong, fCong + 22], [-40, 10, 10, 40], { ...CL, easing: io });
  const borde = (x0: number, x1: number, y0: number, y1: number) => `polygon(${x0}px ${y0 + 10}px, ${x0 + 14}px ${y0}px, ${x1 - 14}px ${y0}px, ${x1}px ${y0 + 10}px, ${x1}px ${y1 - 10}px, ${x1 - 14}px ${y1}px, ${x0 + 14}px ${y1}px, ${x0}px ${y1 - 10}px)`;
  return (
    <AbsoluteFill style={{ background: "#dfe6ea", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `translateY(${camY}px) scale(${camZ})` }}>
        <Img src={staticFile(img)} style={FULL} />
        <Img src={staticFile(img)} style={{ ...FULL, opacity: vaho, filter: "blur(16px) brightness(1.28) saturate(0.45)" }} />
        <AbsoluteFill style={{ background: "rgba(236,242,246,0.38)", opacity: vaho }} />
        {f >= fMedio ? <Img src={staticFile(img)} style={{ ...FULL, clipPath: borde(180, m, 380, 700) }} /> : null}
        {f >= fCong ? <Img src={staticFile(img)} style={{ ...FULL, clipPath: borde(a, 1830, 0, 150) }} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
