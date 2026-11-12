// Escenas sobre fotos de joan01 (ideas.md): vapor de la cafetera, arruga que se vuelve junta del piso, Ruth por partes.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// ---------- Escena 1: el vapor real de la cafetera (1520,470) sube, se ensancha y cubre el cuadro
export const EscVapor: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const k = f / Math.max(1, dur);
  // cámara: de las bombillas de arriba (centro 800,330) hacia la cafetera (1500,520), curva suave
  const t = ez(Math.min(1, k * 1.15));
  const cx = interpolate(t, [0, 1], [820, 1460]), cy = interpolate(t, [0, 1], [360, 500]) - Math.sin(t * Math.PI) * 30;
  const z = interpolate(t, [0, 1], [1.12, 1.42]);
  const tx = 960 - cx * z, ty = 540 - cy * z;
  const fog = interpolate(f, [dur - 34, dur - 4], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
  const puffs = Array.from({ length: 9 }, (_, i) => {
    const life = 70, ph = ((f + i * (life / 9)) % life) / life; // cada bocanada sube y se abre
    const x = 1520 + Math.sin((f + i * 23) / 17) * 18 * ph - 20 * ph;
    const y = 468 - ph * 240;
    const r = 26 + ph * 110 + fog * 900;
    const o = Math.sin(ph * Math.PI) * 0.34 + fog * 0.5;
    return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,250,242,0.95) 0%, rgba(255,248,238,0.5) 40%, rgba(255,248,238,0) 70%)", opacity: o, filter: "blur(10px)" }} />;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#17151A" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(src)} style={FULL} />
        {puffs}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 62% 40%, rgba(255,249,240,1) 0%, rgba(250,244,234,0.96) 55%, rgba(240,232,220,0.9) 100%)", opacity: fog }} />
    </AbsoluteFill>
  );
};

// ---------- Escena 2: el surco de la cara (520,500→470,640) gira hasta el ángulo de la junta del piso (450,0→940,1080) y la junta toma su lugar
export const EscGrieta: React.FC<{ a: string; b: string; fM: number; dur: number }> = ({ a, b, fM, dur }) => {
  const f = useCurrentFrame();
  const ANG_A = (Math.atan2(140, -50) * 180) / Math.PI; // ≈109.7°
  const ANG_B = (Math.atan2(1080, 490) * 180) / Math.PI; // ≈65.6°
  const MA = [495, 570], MB = [695, 540];
  const p = ez(Math.min(1, f / Math.max(1, fM)));
  const rA = (ANG_B - ANG_A) * p, sA = 1.05 + 1.65 * p;
  const band = interpolate(f, [fM - 4, fM + 8], [0, 1], CL);
  const open = interpolate(f, [fM + 8, fM + 24], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const q = Math.max(0, f - fM) / Math.max(1, dur - fM);
  const sB = 1.32 + 0.1 * q; // la junta sigue acercándose despacio
  const dx = Math.cos((ANG_B * Math.PI) / 180), dy = Math.sin((ANG_B * Math.PI) / 180);
  const nx = -dy, ny = dx, L = 1400;
  const w = 6 + band * 70 + open * 1400;
  const poly = [[960 - dx * L + nx * w, 540 - dy * L + ny * w], [960 + dx * L + nx * w, 540 + dy * L + ny * w], [960 + dx * L - nx * w, 540 + dy * L - ny * w], [960 - dx * L - nx * w, 540 - dy * L - ny * w]]
    .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ");
  const lay = (src: string, m: number[], r: number, s: number, filter?: string) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", filter,
      transform: `translate(960px, 540px) rotate(${r}deg) scale(${s}) translate(${-m[0]}px, ${-m[1]}px)` }}>
      <Img src={staticFile(src)} style={FULL} />
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#17151A" }}>
      {/* fondo: la misma foto más grande y desenfocada, para que el giro no deje esquinas vacías */}
      {f < fM + 26 && lay(a, MA, rA, sA * 2.3, "blur(26px) brightness(0.85)")}
      {f < fM + 26 && lay(a, MA, rA, sA)}
      {band > 0 && <AbsoluteFill style={{ clipPath: `polygon(${poly})` }}>{lay(b, MB, 0, sB)}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- Escena 3: Ruth antes (g051) → después (g052) alineadas por los ojos; el después aparece por lo que ella nombra
export const EscRuth: React.FC<{ a: string; b: string; fEyes: number; fCheeks: number; fAll: number; dur: number }> = ({ a, b, fEyes, fCheeks, fAll, dur }) => {
  const f = useCurrentFrame();
  const k = f / Math.max(1, dur);
  const z = 1.3 + 0.16 * k, cx = 1035, cy = 400 - 20 * k; // lineal: con ease el arranque quedaba quieto 2,7 s (freezedetect)
  const tx = 960 - cx * z, ty = 540 - cy * z;
  const e = interpolate(f, [fEyes, fEyes + 16], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const c = interpolate(f, [fCheeks, fCheeks + 18], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const all = interpolate(f, [fAll, fAll + 26], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const g = (x: number, y: number, r: number) => `radial-gradient(circle at ${x}px ${y}px, #000 ${Math.max(0, r - 70)}px, transparent ${r}px)`;
  const mask = [g(920, 280, 130 * e), g(1150, 280, 130 * e), g(895, 430, 175 * c), g(1180, 430, 175 * c), g(1035, 420, 1500 * all)].join(", ");
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#17151A" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(a)} style={FULL} />
        {f >= fEyes && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: mask, maskImage: mask }}>
            <Img src={staticFile(b)} style={{ ...FULL, transformOrigin: "0 0", transform: "translate(239px, -134px) scale(0.92)" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
