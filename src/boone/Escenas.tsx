// Escenas sobre fotos de boone01 (skill edicion-sobre-fotos · ideas en D:/rtmp/boone01/ideas.md). Sin componentes hechos ni dibujos: sólo las fotos.
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
const salida = (f: number, dur: number) => interpolate(f, [dur - 8, dur], [1, 0], CL);

// 1 · subibaja: la foto de los tres caniches se balancea apoyada bajo el del medio (790,800)
export const EscSubibaja: React.FC<{ src: string; fA: number; fB: number; fC: number; dur: number }> = ({ src, fA, fB, fC, dur }) => {
  const f = useCurrentFrame();
  const sp = (t0: number) => spring({ frame: f - t0, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 90 } });
  const ang = -3.5 * sp(fA) + 7 * sp(fB) - 3.5 * sp(fC); // baja el lado del chico → baja el del grande → nivel
  const k = ease(f, fC + 2, fC + 44);
  const drift = interpolate(f, [0, dur], [0, 0.03], CL);
  return (
    <AbsoluteFill style={{ background: "#14100c", overflow: "hidden", opacity: salida(f, dur) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "790px 610px", transform: `translateX(${170 * k}px) scale(${1 + drift + 0.3 * k})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "790px 800px", transform: `rotate(${ang.toFixed(3)}deg) scale(1.35)` }}>
          <Img src={staticFile(src)} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · fuelle: el piso vacío entre la rodilla (880,650) y el perro (1260-1470) se pliega; al reabrirse, adentro está la otra foto
const X0 = 950, ANCHO = 300, N = 6, TW = ANCHO / N;
const Parte: React.FC<{ src: string; sx: number; w: number; x: number; sc?: number; luz?: number }> = ({ src, sx, w, x, sc = 1, luz = 1 }) => (
  <div style={{ position: "absolute", left: x, top: 0, width: w, height: 1080, overflow: "hidden", transformOrigin: "0 0", transform: `scaleX(${sc})`, filter: `brightness(${luz})` }}>
    <Img src={staticFile(src)} style={{ ...FULL, left: -sx }} />
  </div>
);
export const EscFuelle: React.FC<{ a: string; b: string; fWalk: number; fLean: number; dur: number }> = ({ a, b, fWalk, fLean, dur }) => {
  const f = useCurrentFrame();
  const c = ease(f, fWalk, fWalk + 40);
  const pre = interpolate(f, [0, fWalk], [1, 1.045], CL);
  const s = pre + 0.42 * c;
  const o = ease(f, fLean - 4, fLean + 16);
  const seam = (X0 - 900) * s + 900; // dónde cae la costura en pantalla
  const zb = interpolate(f, [fLean - 4, dur], [1.14, 1.06], CL);
  return (
    <AbsoluteFill style={{ background: "#14100c", overflow: "hidden", opacity: salida(f, dur) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "900px 480px", transform: `scale(${s})` }}>
        <Parte src={a} sx={0} w={X0 + 1} x={0} />
        {Array.from({ length: N }, (_, i) => (
          <Parte key={i} src={a} sx={X0 + i * TW} w={TW + 1} x={X0 + i * TW * (1 - c)} sc={Math.max(0.001, 1 - c)} luz={i % 2 ? 1 - 0.38 * Math.sin(Math.PI * c) : 1 + 0.12 * Math.sin(Math.PI * c)} />
        ))}
        <Parte src={a} sx={X0 + ANCHO} w={1920 - X0 - ANCHO} x={X0 + ANCHO * (1 - c)} />
      </div>
      {o > 0 && (
        <AbsoluteFill style={{ overflow: "hidden", clipPath: `polygon(${seam * (1 - o)}px 0, ${seam + (1920 - seam) * o}px 0, ${seam + (1920 - seam) * o}px 1080px, ${seam * (1 - o)}px 1080px)` }}>
          <Img src={staticFile(b)} style={{ ...FULL, transformOrigin: "900px 560px", transform: `scale(${zb})` }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// 3 · patas arriba: la segunda foto entra cabeza abajo (el galgo parece parado) y el cuadro gira hasta quedar derecho
export const EscPatas: React.FC<{ a: string; b: string; fCouch: number; fUp: number; dur: number }> = ({ a, b, fCouch, fUp, dur }) => {
  const f = useCurrentFrame();
  const za = interpolate(f, [0, fCouch], [1.04, 1.12], CL);
  const k = ease(f, fUp - 2, fUp + 28);
  const th = 180 * (1 - k), r = (th * Math.PI) / 180;
  const cubre = (Math.abs(Math.cos(r)) + (16 / 9) * Math.abs(Math.sin(r))) * 1.03; // escala mínima para que el cuadro girado no deje bordes
  const zb = cubre * interpolate(f, [fCouch, dur], [1.1, 1.03], CL);
  return (
    <AbsoluteFill style={{ background: "#14100c", overflow: "hidden", opacity: salida(f, dur) }}>
      {f < fCouch
        ? <Img src={staticFile(a)} style={{ ...FULL, transformOrigin: "700px 430px", transform: `scale(${za})` }} />
        : <Img src={staticFile(b)} style={{ ...FULL, transformOrigin: "960px 540px", transform: `rotate(${th.toFixed(3)}deg) scale(${zb.toFixed(4)})` }} />}
    </AbsoluteFill>
  );
};
