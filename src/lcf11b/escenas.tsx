// lcf11b · escenas sobre fotos (ideas en D:/rtmp/lcf11b/ideas.md). Coordenadas en 1920x1080; T = segundo absoluto del video.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { cl, eOut, eIO, lerp, sf } from "./look";

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// 1 · díptico: la foto doblada en x=980 (hueco real entre los tazones); cada hoja queda de frente en su palabra
const Diptico: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const H = 980;
  const aL = 38 * (1 - eIO(T, 262.68, 263.6));
  const aR = 38 * (1 - eIO(T, 266.06, 267.0));
  const z = lerp(1.0, 1.05, eOut(T, 260.4, 269.0));
  return (
    <AbsoluteFill style={{ background: "#2a1d12", overflow: "hidden" }}>
      <Img src={sf(s.src)} style={{ ...FULL, filter: "blur(30px) brightness(.55)", transform: "scale(1.2)" }} />
      <AbsoluteFill style={{ perspective: 2100, perspectiveOrigin: `${H}px 540px`, transform: `scale(${z})`, transformOrigin: `${H}px 520px` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: H, height: 1080, overflow: "hidden", transformOrigin: "100% 50%", transform: `rotateY(${-aL}deg)` }}>
          <Img src={sf(s.src)} style={FULL} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.012 * aL}), transparent 70%)` }} />
        </div>
        <div style={{ position: "absolute", left: H, top: 0, width: 1920 - H, height: 1080, overflow: "hidden", transformOrigin: "0% 50%", transform: `rotateY(${aR}deg)` }}>
          <Img src={sf(s.src)} style={{ ...FULL, left: -H }} />
          <AbsoluteFill style={{ background: `linear-gradient(270deg, rgba(0,0,0,${0.012 * aR}), transparent 70%)` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · niveles: la fuente grande se llena, se corta en cuatro, tres porciones bajan y la oval chica se llena
const TEX = "lcf11b/g/g3840.png"; // superficie gratinada (región 300,380–1250,680 de esa foto), girada 90°
const Fill: React.FC<{ x0: number; y0: number; x1: number; y1: number; lvl: number; r: number; ax: number; ay: number; ell?: boolean }> = ({ x0, y0, x1, y1, lvl, r, ax, ay, ell }) => {
  const w = x1 - x0, h = y1 - y0, top = h * (1 - cl(lvl));
  if (lvl <= 0.001) return null;
  const S = 2.0;
  return (
    <div style={{ position: "absolute", left: x0, top: y0, width: w, height: h, overflow: "hidden",
      clipPath: ell ? `ellipse(${w / 2}px ${h / 2}px at 50% 50%)` : `inset(0 round ${r}px)` }}>
      <div style={{ position: "absolute", left: 0, top, width: w, height: h - top, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: ax - x0, top: ay - y0 - top, width: 0, height: 0 }}>
          <Img src={sf(TEX)} style={{ position: "absolute", width: 1920 * S, height: 1080 * S, left: -775 * S, top: -530 * S, transformOrigin: `${775 * S}px ${530 * S}px`, transform: "rotate(90deg)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: "linear-gradient(180deg, rgba(60,30,8,.45), transparent)" }} />
      </div>
    </div>
  );
};
const Nivel: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const up = eIO(T, 661.85, 663.4);
  const g = 9 * eOut(T, 666.53, 667.2);
  const down = eIO(T, 668.35, 669.3);
  const small = eIO(T, 668.6, 669.8);
  const X0 = 135, Y0 = 100, X1 = 690, Y1 = 980, XM = 412, YM = 540;
  const q = [
    { x0: X0, y0: Y0, x1: XM - g, y1: YM - g, keep: false },
    { x0: XM + g, y0: Y0, x1: X1, y1: YM - g, keep: false },
    { x0: X0, y0: YM + g, x1: XM - g, y1: Y1, keep: true },
    { x0: XM + g, y0: YM + g, x1: X1, y1: Y1, keep: false },
  ];
  const z = lerp(1.0, 1.06, eOut(T, 659.6, 669.9));
  const cx = lerp(560, 900, eIO(T, 666.0, 669.5));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#3a2a1c" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${cx}px 540px` }}>
        <Img src={sf(s.src)} style={FULL} />
        {q.map((p, i) => <Fill key={i} {...p} ax={XM} ay={YM} r={g > 1 ? 14 : 50} lvl={up * (p.keep ? 1 : 1 - down)} />)}
        <Fill x0={1300} y0={330} x1={1540} y1={740} ax={1420} ay={535} r={0} ell lvl={small} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3 · vela: penumbra azul con la mecha apagada; en "light" la tibieza sale de la llama real y cubre la mesa
const Vela: React.FC<{ s: any; T: number }> = ({ s, T }) => {
  const FX = 1187, FY = 395;
  const k = eOut(T, 2201.5, 2203.4);
  const R = k * 2100 * (1 + 0.025 * Math.sin(T * 23) * k);
  const lit = cl((T - 2201.5) / 0.25);
  const z = lerp(1.0, 1.06, eIO(T, 2195.5, 2203.7));
  const m = `radial-gradient(circle at ${FX}px ${FY}px, #000 ${Math.max(0, R - 380)}px, transparent ${R}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0c1222" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "900px 600px" }}>
        <Img src={sf(s.src)} style={{ ...FULL, filter: "brightness(.5) saturate(.55)" }} />
        <AbsoluteFill style={{ background: "rgba(22,42,92,.38)", mixBlendMode: "multiply" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${FX}px ${FY - 3}px, rgba(38,30,24,${0.92 * (1 - lit)}) 0 20px, transparent 44px)` }} />
        {R > 1 && (
          <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}>
            <Img src={sf(s.src)} style={{ ...FULL, filter: "saturate(1.08) brightness(1.04)" }} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Escena: React.FC<{ name: string; s: any }> = ({ name, s }) => {
  const f = useCurrentFrame();
  const T = (s.from + f) / 30;
  if (name === "diptico") return <Diptico s={s} T={T} />;
  if (name === "nivel") return <Nivel s={s} T={T} />;
  if (name === "vela") return <Vela s={s} T={T} />;
  return <AbsoluteFill style={{ background: "#000" }} />;
};
