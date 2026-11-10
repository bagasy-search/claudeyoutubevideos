// Escenas sobre fotos · dee01 — escritas de cero (ver D:/rtmp/dee01/ideas.md). Fotos 1920x1080 con objectFit fill.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
const Foto: React.FC<{ src: string; clip?: string; style?: React.CSSProperties }> = ({ src, clip, style }) => (
  <Img src={staticFile(src)} style={{ ...FULL, clipPath: clip, ...style }} />
);
const salida = (f: number, dur: number) => interpolate(f, [dur - 8, dur], [1, 0], CL);

// ---------- Escena 1 · el salón se arma como rompecabezas: cada pieza cae y encaja en su palabra
const PIEZAS: { pts: number[][]; cx: number; cy: number; rot: number }[] = [
  { pts: [[615, 560], [700, 553], [822, 565], [828, 700], [805, 800], [760, 860], [795, 960], [785, 1080], [450, 1080], [440, 965], [560, 880], [400, 862], [372, 800], [370, 700], [405, 680], [600, 690]], cx: 600, cy: 820, rot: -6 },
  { pts: [[890, 478], [1010, 472], [1138, 488], [1135, 600], [1120, 690], [1000, 720], [985, 740], [1090, 790], [1090, 828], [870, 828], [870, 790], [960, 740], [950, 715], [860, 690], [838, 560], [880, 540]], cx: 990, cy: 650, rot: 5 },
  { pts: [[1545, 480], [1620, 470], [1700, 468], [1800, 474], [1905, 495], [1905, 620], [1860, 700], [1800, 705], [1800, 1080], [1700, 1080], [1700, 705], [1600, 690], [1555, 600], [1548, 540]], cx: 1720, cy: 700, rot: -4 },
  { pts: [[1688, 262], [1740, 250], [1735, 30], [1770, 12], [1800, 10], [1840, 22], [1870, 40], [1860, 200], [1838, 262], [1842, 350], [1840, 435], [1688, 435], [1680, 350]], cx: 1765, cy: 300, rot: 7 },
];
export const EscSalon: React.FC<{ src: string; m: number[]; dur: number }> = ({ src, m, dur }) => {
  const f = useCurrentFrame();
  const llegada = [m[0], m[0] + 6, m[1], m[2]]; // dos sillones (escalonados), pileta, cafetera
  const todo = llegada[3] + 10;
  const luz = interpolate(f, [todo, todo + 22], [0, 1], CL);
  const cam = interpolate(f, [0, dur], [1.0, 1.05], CL);
  return (
    <AbsoluteFill style={{ background: "#120D0F", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "1080px 560px" }}>
        <Foto src={src} style={{ filter: `brightness(${0.32 + 0.68 * luz}) saturate(${0.35 + 0.65 * luz}) blur(${5 * (1 - luz)}px)` }} />
        {PIEZAS.map((p, i) => {
          const t = llegada[i];
          if (f < t - 14) return null;
          const k = spring({ frame: f - (t - 12), fps: 30, config: { damping: 13, stiffness: 120, mass: 0.9 } });
          const dy = (1 - k) * -1150, r = (1 - k) * p.rot;
          const sombra = interpolate(f, [t - 2, t + 8], [1, 0], CL);
          return (
            <AbsoluteFill key={i} style={{ transform: `translateY(${dy}px) rotate(${r}deg)`, transformOrigin: `${p.cx}px ${p.cy}px`, filter: sombra > 0 ? `drop-shadow(0 ${24 * sombra}px ${30 * sombra}px rgba(0,0,0,${0.6 * sombra}))` : undefined }}>
              <Foto src={src} clip={poly(p.pts)} />
            </AbsoluteFill>
          );
        })}
        {/* el vapor real sigue subiendo: "never turns off" */}
        {f > llegada[3] + 4 && (
          <Foto src={src} clip={poly([[1730, 0], [1880, 0], [1880, 250], [1730, 250]])}
            style={{ transform: `translateY(${-((f - llegada[3]) % 36) * 0.9}px)`, opacity: 0.45 + 0.25 * Math.sin((f - llegada[3]) / 6), mixBlendMode: "screen" }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 2 · capas que caen en pedazos vs. un telón que cae entero
const PEND = 0.6; // los mechones bajan de 1000,0 hacia 0,600: líneas y = c - 0.6x
const N = 9, CMAX = 1080 + PEND * 1920;
const franja = (k: number, gap = 0) => {
  const c1 = (k * CMAX) / N + gap, c2 = ((k + 1) * CMAX) / N - gap;
  return poly([[-120, c1 + PEND * 120], [2040, c1 - PEND * 2040], [2040, c2 - PEND * 2040], [-120, c2 + PEND * 120]]);
};
export const EscPedazos: React.FC<{ a: string; b: string; fB: number; fAsk: number; dur: number }> = ({ a, b, fB, fAsk, dur }) => {
  const f = useCurrentFrame();
  // telón: cae con gravedad y golpea
  const caida = interpolate(f, [fB, fB + 11], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
  const golpe = f >= fB + 11 && f < fB + 20 ? Math.sin((f - fB - 11) * 2.4) * 9 * (1 - (f - fB - 11) / 9) : 0;
  const parte = interpolate(f, [fAsk, fAsk + 14], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#120D0F", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `translateY(${golpe}px) scale(1.03)` }}>
        {f < fB + 12 && Array.from({ length: N }, (_, k) => {
          const q = spring({ frame: f - k * 3, fps: 30, config: { damping: 11, stiffness: 110 } });
          return (
            <AbsoluteFill key={k} style={{ transform: `translate(${(1 - q) * 70}px, ${(1 - q) * -300}px) rotate(${(1 - q) * (k % 2 ? 4 : -3)}deg)`, opacity: Math.min(1, q * 2.5) }}>
              <Foto src={a} clip={franja(k)} />
            </AbsoluteFill>
          );
        })}
        {f >= fB && parte === 0 && <Foto src={b} style={{ transform: `translateY(${(1 - caida) * -1080}px)` }} />}
        {parte > 0 && Array.from({ length: N }, (_, k) => {
          const d = (k - (N - 1) / 2) * 7 * parte;
          return <Foto key={k} src={b} clip={franja(k, 5 * parte)} style={{ transform: `translate(${d * PEND}px, ${d}px)` }} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 3 · la foto se abre por la línea que marcan los dedos bajo la mandíbula
const LY0 = 805, LY1 = 775, DEDOS = 1000; // línea de 0,805 a 1920,775; yemas en x≈1000
const yLinea = (x: number) => LY0 + ((LY1 - LY0) * x) / 1920;
export const EscLinea: React.FC<{ src: string; fLine: number; dur: number }> = ({ src, fLine, dur }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.0, 1.1], { ...CL, easing: Easing.inOut(Easing.sin) });
  const abre = interpolate(f, [fLine, fLine + 16], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) }); // la ranura corre desde los dedos
  const sep = interpolate(f, [fLine + 14, fLine + 26], [0, 1], { ...CL, easing: Easing.out(Easing.back(1.6)) }) * 12;
  const xa = DEDOS - abre * 1100, xb = DEDOS + abre * 1100, g = 2.5 + sep;
  const arriba = poly([[0, 0], [1920, 0], [1920, LY1], [0, LY0]]);
  const abajo = poly([[0, LY0], [1920, LY1], [1920, 1080], [0, 1080]]);
  const ranura = poly([[xa, yLinea(xa) - g], [xb, yLinea(xb) - g], [xb, yLinea(xb) + g], [xa, yLinea(xa) + g]]);
  return (
    <AbsoluteFill style={{ background: "#F8F2EA", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: `${DEDOS}px 790px` }}>
        <Foto src={src} clip={arriba} style={{ transform: `translateY(${-sep}px)` }} />
        <Foto src={src} clip={abajo} style={{ transform: `translateY(${sep}px)` }} />
        {abre > 0 && <AbsoluteFill style={{ clipPath: ranura, background: "#FFF8EE", boxShadow: "0 0 18px rgba(255,248,238,0.9)" }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 4 · taco de almanaque: cada "No more" arranca la hoja de arriba
const dentado = (seed: number) => {
  const pts: number[][] = [];
  for (let x = 0, i = 0; x <= 1920; x += 64, i++) pts.push([x, 52 + (((seed * 37 + i * 53) % 23) - 11)]);
  return pts;
};
export const EscAlmanaque: React.FC<{ srcs: string[]; tears: number[]; dur: number }> = ({ srcs, tears, dur }) => {
  const f = useCurrentFrame();
  const temblor = tears.reduce((s, t) => s + (f >= t && f < t + 5 ? Math.sin((f - t) * 3) * 4 * (1 - (f - t) / 5) : 0), 0);
  return (
    <AbsoluteFill style={{ background: "#120D0F", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `translateY(${temblor}px) scale(1.02)` }}>
        {srcs.map((_, i) => srcs.length - 1 - i).map((i) => {
          const src = srcs[i], t = tears[i];
          const j = dentado(i + 1);
          const resto = poly([[0, 0], [1920, 0], ...[...j].reverse()]);
          const hoja = poly([...j, [1920, 1080], [0, 1080]]);
          if (t === undefined || f < t) return <Foto key={i} src={src} />; // todavía entera
          const p = interpolate(f, [t, t + 16], [0, 1], { ...CL, easing: Easing.in(Easing.quad) });
          const tiron = interpolate(f, [t, t + 4], [0, 1], CL);
          return (
            <React.Fragment key={i}>
              {p < 1 && (
                <AbsoluteFill style={{ transform: `translateY(${p * 1300 - tiron * 18 * (1 - p)}px) rotate(${p * 9}deg)`, transformOrigin: "0px 60px", filter: `drop-shadow(0 30px 40px rgba(0,0,0,${0.55 * (1 - p)}))` }}>
                  <Foto src={src} clip={hoja} />
                </AbsoluteFill>
              )}
              <Foto src={src} clip={resto} style={{ filter: "brightness(0.85)", transform: `translateY(${-i * 3}px)` }} />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
