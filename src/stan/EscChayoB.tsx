// Escenas sobre fotos ch14b (ideas en D:/rtmp/ch14b/ideas.md). Código nuevo, sin SVG ni componentes hechos.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const io = Easing.bezier(0.45, 0, 0.2, 1);
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const poly = (p: number[][]) => "polygon(" + p.map(([x, y]) => `${x}px ${y}px`).join(", ") + ")";

// Escena 1: el hielo real salta del vaso de agua y se hunde en el café
const HIELO = [[1030, 260], [1090, 222], [1150, 218], [1195, 250], [1200, 330], [1110, 345], [1040, 320]];
export const HieloCafe: React.FC<{ a: string; dur: number; tSalto?: number }> = ({ a, dur, tSalto = 48 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [tSalto, tSalto + 26], [0, 1], cl);
  const x = interpolate(t, [0, 1], [0, 757 - 1115]);
  const y = interpolate(t, [0, 1], [0, 505 - 282]) - Math.sin(t * Math.PI) * 190; // arco con peso
  const hunde = interpolate(f, [tSalto + 26, tSalto + 44], [0, 70], { ...cl, easing: Easing.out(Easing.quad) });
  const giro = t * 160;
  const cam = interpolate(f, [0, dur], [1.0, 1.07], { ...cl, easing: io });
  const golpe = f > tSalto + 26 ? Math.exp(-(f - tSalto - 26) / 6) * Math.sin((f - tSalto - 26) * 0.9) * 0.012 : 0; // la crema se mece al recibirlo
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "820px 470px" }}>
        <Img src={staticFile(a)} style={FULL} />
        <AbsoluteFill style={{ transform: `scaleY(${1 + golpe})`, transformOrigin: "757px 520px", clipPath: poly([[520, 470], [1000, 470], [1000, 760], [520, 760]]) }}>
          <Img src={staticFile(a)} style={FULL} />
        </AbsoluteFill>
        {/* lo que queda bajo la crema del café no se ve */}
        <AbsoluteFill style={{ clipPath: poly([[0, 0], [1920, 0], [1920, 1080], [1000, 1080], [1000, 518], [515, 518], [515, 1080], [0, 1080]]) }}>
          {f >= tSalto ? (
            <AbsoluteFill style={{ transform: `translate(${x}px, ${y + hunde}px) rotate(${giro}deg)`, transformOrigin: "1115px 282px", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.4))" }}>
              <Img src={staticFile(a)} style={{ ...FULL, clipPath: poly(HIELO) }} />
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Escena 2: el queso se calienta del borde hacia el centro de cada cubo real
const CUBOS = [[390, 345, 668, 570], [765, 267, 1065, 450], [735, 412, 1043, 600], [1035, 383, 1320, 593]];
export const QuesoTibio: React.FC<{ a: string; dur: number; tCae?: number; tFrente?: number; tSuave?: number }> = ({ a, dur, tCae = 25, tFrente = 129, tSuave = 211 }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, dur], [1.0, 1.1], { ...cl, easing: io });
  const tibio = interpolate(f, [tCae, tCae + 40], [0, 1], cl); // el caldo trae calor: luz cálida baja sobre la cuchara
  const frente = interpolate(f, [tFrente, tFrente + 62], [100, 0], { ...cl, easing: io }); // % de radio todavía frío
  const suave = interpolate(f, [tSuave, tSuave + 30], [0, 1], { ...cl, easing: io });
  return (
    <AbsoluteFill style={{ background: "#ddd9e6", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "855px 470px" }}>
        <Img src={staticFile(a)} style={FULL} />
        <AbsoluteFill style={{ opacity: 0.35 * tibio, background: "radial-gradient(ellipse 700px 380px at 855px 520px, rgba(255,170,90,0.55), rgba(255,170,90,0) 70%)", mixBlendMode: "soft-light" }} />
        {f >= tFrente ? CUBOS.map(([x0, y0, x1, y1], i) => {
          const r = Math.max(0, frente - i * 6);
          const m = `radial-gradient(closest-side, transparent ${r}%, black ${Math.min(100, r + 22)}%)`;
          return (
            <AbsoluteFill key={i} style={{ clipPath: poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), transform: `scale(${1 + 0.015 * suave}, ${1 - 0.03 * suave})`, transformOrigin: `${(x0 + x1) / 2}px ${y1}px` }}>
              <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, overflow: "hidden", WebkitMaskImage: m, maskImage: m }}>
                <Img src={staticFile(a)} style={{ ...FULL, left: -x0, top: -y0, filter: "sepia(0.45) saturate(1.7) brightness(1.06) hue-rotate(-8deg)" }} />
              </div>
            </AbsoluteFill>
          );
        }) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Escena 3: el vapor real crece desde el plato hasta llenar el cuarto (el olor que se mete)
const VAPOR = [[560, 420], [700, 370], [860, 360], [1000, 380], [1150, 370], [1290, 420], [1310, 560], [1250, 700], [1200, 745], [700, 745], [640, 690], [600, 560]];
export const VaporLlena: React.FC<{ a: string; dur: number; tOlor?: number; tAlma?: number }> = ({ a, dur, tOlor = 110, tAlma = 190 }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [tOlor, tAlma + 20], [0, 1], { ...cl, easing: io });
  const cam = interpolate(f, [0, dur], [1.0, 1.06], cl);
  const s = 1 + g * 2.1, op = interpolate(g, [0, 0.15, 1], [0, 0.7, 0.45]);
  const sube = Math.sin(f / 18) * 6;
  return (
    <AbsoluteFill style={{ background: "#0b0807", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "960px 700px" }}>
        <Img src={staticFile(a)} style={FULL} />
        <AbsoluteFill style={{ transform: `translateY(${-g * 120 + sube}px) scale(${s})`, transformOrigin: "955px 745px", opacity: op, mixBlendMode: "screen", filter: `blur(${2 + g * 6}px)` }}>
          <Img src={staticFile(a)} style={{ ...FULL, clipPath: poly(VAPOR) }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: 0.4 * g, background: "radial-gradient(ellipse 1100px 700px at 960px 600px, rgba(255,190,110,0.5), rgba(255,190,110,0) 75%)", mixBlendMode: "screen" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
