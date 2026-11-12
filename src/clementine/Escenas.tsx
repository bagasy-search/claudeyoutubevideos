// Escenas sobre fotos · clementine01 — escritas de cero mirando las fotos (ver D:/rtmp/clementine01/ideas.md).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const poly = (pts: number[][]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
const Foto: React.FC<{ src: string; clip?: string; style?: React.CSSProperties }> = ({ src, clip, style }) => (
  <Img src={staticFile(src)} style={{ ...FULL, clipPath: clip, ...style }} />
);
const salida = (f: number, dur: number) => interpolate(f, [dur - 8, dur], [1, 0], CL);
const camara = (f: number, dur: number, a = 1.0, b = 1.05) => interpolate(f, [0, dur], [a, b], { ...CL, easing: Easing.inOut(Easing.sin) });

// ---------- Escena 1 · los frascos de Lorraine dan un paso al frente, de a uno, como soldaditos
const FRASCOS: { pts: number[][]; base: [number, number] }[] = [
  { pts: [[488, 205], [528, 205], [532, 290], [568, 300], [572, 370], [590, 400], [596, 640], [580, 665], [465, 665], [450, 640], [450, 400], [470, 370], [472, 300], [484, 290]], base: [522, 666] },
  { pts: [[708, 210], [845, 210], [848, 300], [846, 655], [830, 668], [722, 668], [706, 655], [705, 300]], base: [776, 668] },
  { pts: [[975, 455], [1160, 455], [1172, 480], [1172, 640], [1150, 666], [985, 666], [963, 640], [963, 480]], base: [1067, 667] },
  { pts: [[1290, 432], [1580, 432], [1598, 470], [1595, 640], [1570, 676], [1300, 680], [1272, 640], [1272, 470]], base: [1435, 680] },
];
export const EscSoldados: React.FC<{ src: string; m: number[]; dur: number }> = ({ src, m, dur }) => {
  const f = useCurrentFrame();
  const juntos = m[3] + 26; // taconazo de toda la formación
  const tac = (t: number) => (f >= t && f < t + 9 ? Math.sin(((f - t) / 9) * Math.PI) * 0.018 : 0);
  return (
    <AbsoluteFill style={{ background: "#1A120E", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${camara(f, dur)})`, transformOrigin: "1000px 560px" }}>
        <Foto src={src} />
        {FRASCOS.map((p, i) => {
          const t = m[i];
          if (f < t - 2) return null;
          const k = spring({ frame: f - t, fps: 30, config: { damping: 9, stiffness: 160, mass: 0.7 } });
          const s = 1 + 0.075 * k + tac(t + 7) + tac(juntos);
          const sombra = Math.min(1, k);
          return (
            <AbsoluteFill key={i} style={{ transform: `scale(${s})`, transformOrigin: `${p.base[0]}px ${p.base[1]}px`, filter: `drop-shadow(0 ${14 * sombra}px ${18 * sombra}px rgba(0,0,0,${0.5 * sombra}))` }}>
              <Foto src={src} clip={poly(p.pts)} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 2 · el estante se despliega sobre su propia tabla; la aceitera se asienta al nombrarla
const BISAGRA = 494; // borde inferior real de la tabla del estante
const ACEITERA = [[993, 118], [1003, 118], [1008, 295], [1030, 300], [1050, 330], [1075, 345], [1077, 390], [1062, 395], [1062, 430], [958, 432], [955, 345], [975, 305], [990, 295]];
export const EscEstante: React.FC<{ src: string; fShelf: number; fOil: number; dur: number }> = ({ src, fShelf, fOil, dur }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - (fShelf - 10), fps: 30, config: { damping: 12, stiffness: 90, mass: 1 } });
  const giro = (1 - k) * -96; // de plegado hacia atrás a vertical
  const golpe = f >= fOil && f < fOil + 10 ? Math.sin(((f - fOil) / 10) * Math.PI) * 0.06 : 0;
  return (
    <AbsoluteFill style={{ background: "#1A120E", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${camara(f, dur, 1.02, 1.07)})`, transformOrigin: "980px 520px" }}>
        <Foto src={src} clip={poly([[0, BISAGRA], [1920, BISAGRA], [1920, 1080], [0, 1080]])} />
        <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: `960px ${BISAGRA}px` }}>
          <AbsoluteFill style={{ transform: `rotateX(${giro}deg)`, transformOrigin: `960px ${BISAGRA}px`, backfaceVisibility: "hidden" }}>
            <Foto src={src} clip={poly([[0, 0], [1920, 0], [1920, BISAGRA + 1], [0, BISAGRA + 1]])} style={{ filter: `brightness(${0.75 + 0.25 * k})` }} />
          </AbsoluteFill>
        </AbsoluteFill>
        {f >= fOil && (
          <AbsoluteFill style={{ transform: `scale(${1 + golpe})`, transformOrigin: "1012px 432px", filter: `drop-shadow(0 6px 8px rgba(0,0,0,${golpe * 6}))` }}>
            <Foto src={src} clip={poly(ACEITERA)} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Escena 3 · el vidrio del frasco vacío devuelve, curvada, la cara del retrato de al lado
const VIDRIO = [[760, 330], [1150, 330], [1170, 380], [1182, 460], [1182, 900], [1165, 945], [1120, 958], [790, 958], [745, 945], [728, 900], [728, 460], [740, 380]];
export const EscFrasco: React.FC<{ src: string; fEmpty: number; dur: number }> = ({ src, fEmpty, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [fEmpty, fEmpty + 30], [0, 0.42], { ...CL, easing: Easing.inOut(Easing.sin) });
  const s = 1.32 + 0.03 * Math.sin(f / 23);
  const tx = 952 + 450 * s + 6 * Math.sin(f / 17), ty = 625 - 375 * s + 4 * Math.sin(f / 29); // cara (450,375) → centro del vidrio, espejada
  return (
    <AbsoluteFill style={{ background: "#1A120E", overflow: "hidden", opacity: salida(f, dur) }}>
      <AbsoluteFill style={{ transform: `scale(${camara(f, dur, 1.0, 1.08)})`, transformOrigin: "955px 600px" }}>
        <Foto src={src} />
        {a > 0 && (
          <AbsoluteFill style={{ clipPath: poly(VIDRIO), opacity: a, mixBlendMode: "screen" }}>
            <Foto src={src} style={{ transformOrigin: "0px 0px", transform: `translate(${tx}px, ${ty}px) scale(${-s}, ${s})`, filter: "grayscale(1) contrast(1.15) blur(0.6px)" }} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
