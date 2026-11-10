// Escenas sobre fotos de miok01 (skill edicion-sobre-fotos): escritas de cero, sin piezas hechas, sin dibujos.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["600"], subsets: ["latin"] });
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// 1 · "Only a wooden comb, a plastic basin, and one spoon of rice vinegar."
// La foto cenital está cortada en tres franjas verticales; cada franja cae a su lugar como una persiana sobre su palabra.
export const EscTres: React.FC<{ src: string; marks: number[]; dur: number }> = ({ src, marks, dur }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.1, 1.0], { ...CL, easing: Easing.out(Easing.quad) });
  const FR = [{ a: 0, b: 440, lx: 228, ly: 925, t: "a wooden comb" }, { a: 440, b: 1250, lx: 842, ly: 985, t: "a plastic basin" }, { a: 1250, b: 1920, lx: 1578, ly: 925, t: "one spoon of rice vinegar" }];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0D2226" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "960px 560px" }}>
        <Img src={staticFile(src)} style={{ ...FULL, filter: "blur(38px) brightness(0.5) saturate(0.6)", transform: "scale(1.08)" }} />
        {FR.map((r, i) => {
          const m = marks[i] - 5; if (f < m) return null;
          const p = spring({ frame: f - m, fps: 30, config: { damping: 13, mass: 0.8 } });
          const y = interpolate(p, [0, 1], [i === 1 ? 1100 : -1100, 0]);
          const lab = interpolate(f, [m + 12, m + 22], [0, 1], CL);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", clipPath: `inset(0px ${1920 - r.b}px 0px ${r.a}px)`, transform: `translateY(${y}px)`, filter: "drop-shadow(0 0 26px rgba(0,0,0,0.55))" }}>
              <Img src={staticFile(src)} style={FULL} />
              <div style={{ position: "absolute", left: r.lx - 300, width: 600, top: r.ly, textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: "#1D2B2E", opacity: lab, transform: `translateY(${(1 - lab) * 14}px)` }}>{r.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · "So I know exactly which stool loses hair, and which stool does not."
// Los espejos reales de la pared, encima de cada banquito, reflejan otra foto: en uno el peine con pelos, en el otro el rodete grueso.
export const EscEspejos: React.FC<{ src: string; a: string; b: string; marks: number[]; dur: number }> = ({ src, a, b, marks, dur }) => {
  const f = useCurrentFrame();
  const k = Easing.inOut(Easing.cubic)(interpolate(f, [0, 46], [0, 1], CL));
  const cam = 1 + 0.86 * k + 0.1 * interpolate(f, [46, dur], [0, 1], CL);
  const M = [
    { src: a, x: 222, y: 228, w: 212, h: 262, poly: "0% 0%, 100% 9.5%, 100% 99%, 0% 98%", at: marks[0] },
    { src: b, x: 618, y: 283, w: 139, h: 211, poly: "0% 0%, 100% 7%, 100% 99%, 0% 98%", at: marks[1] },
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0D2226" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "492px 372px" }}>
        <Img src={staticFile(src)} style={FULL} />
        {M.map((m, i) => {
          if (f < m.at - 4) return null;
          const p = interpolate(f, [m.at - 4, m.at + 10], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const z = 1.25 - 0.2 * interpolate(f, [m.at - 4, dur], [0, 1], CL);
          return (
            <div key={i} style={{ position: "absolute", left: m.x, top: m.y, width: m.w, height: m.h, overflow: "hidden", clipPath: `polygon(${m.poly})`, opacity: p }}>
              <Img src={staticFile(m.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.96) contrast(0.96)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(200,230,225,0.22) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 14px rgba(20,40,40,0.55)" }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3 · "A little, the size of a coin."
// La moneda real de la palma se voltea como una tapa con bisagra sobre el champú y lo cubre justo: mismo tamaño.
export const EscMoneda: React.FC<{ src: string; mark: number; dur: number }> = ({ src, mark, dur }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.04, 1.16], CL);
  const t = interpolate(f, [mark, mark + 17], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const land = interpolate(f, [mark + 17, mark + 30], [1, 0.62], CL);
  const lift = Math.sin(t * Math.PI);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0D2226" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "985px 540px" }}>
        <Img src={staticFile(src)} style={FULL} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 2600, perspectiveOrigin: "985px 535px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "985px 535px", transform: `rotateY(${-180 * t}deg)`, clipPath: "circle(192px at 1175px 535px)", opacity: t > 0.5 ? land : 1,
            filter: `drop-shadow(0 ${10 + 30 * lift}px ${14 + 30 * lift}px rgba(0,0,0,0.5))` }}>
            <Img src={staticFile(src)} style={FULL} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
