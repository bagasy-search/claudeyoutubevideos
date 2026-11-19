// Escenas ck15b · 60-year Church Christmas Morning — escenas hechas con las fotos reales (ver D:/rtmp/ck15b/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ck15b/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
// cámara: escala + punto mirado (x,y) que queda al centro del cuadro
const cam = (s: number, x: number, y: number): React.CSSProperties => ({ ...BOX, overflow: "visible", transformOrigin: "0px 0px", transform: `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})` });
const lerp = (f: number, ks: number[], vs: number[]) => interpolate(f, ks, vs, { ...CL, easing: EASE });


// 1 · La fuente: con «raw» la fuente se enfría (sin color, cruda), con «oven» vuelve el dorado y con «puffed» la fuente se infla; la cámara termina en el corte
export const Split: React.FC<{ dur: number; fRaw: number; fOven: number; fPuff: number; fCut: number }> = ({ dur, fRaw, fOven, fPuff, fCut }) => {
  const f = useCurrentFrame();
  const raw = lerp(f, [fRaw - 4, fRaw + 14, fOven - 2, fOven + 16], [0, 1, 1, 0]);
  const puff = interpolate(f, [fPuff - 2, fPuff + 10, fPuff + 30], [0, 1, 0.6], { ...CL, easing: Easing.out(Easing.back(1.6)) });
  const s = lerp(f, [0, fRaw, fPuff, fCut, dur], [1.0, 1.3, 1.35, 1.9, 2.0]);
  const x = lerp(f, [0, fRaw, fCut], [880, 820, 1070]);
  const y = lerp(f, [0, fRaw, fCut], [560, 700, 720]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_split")} style={FULL} />
        <div style={{ ...BOX, overflow: "visible", clipPath: "polygon(470px 520px, 1210px 480px, 1215px 1040px, 420px 1060px)", transformOrigin: "820px 780px", transform: `scale(${1 + 0.035 * puff})` }}>
          <Img src={S("e_split")} style={{ ...FULL, filter: `saturate(${1 - 0.75 * raw}) brightness(${1 + 0.12 * raw}) hue-rotate(${-12 * raw}deg)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · Apretar: cada «press» la fuente cede bajo la espátula; con «dry» la cámara viaja a la esquina y con «crouton» esa esquina se tuesta
export const Press: React.FC<{ dur: number; fPress1: number; fPress2: number; fDry: number; fCrouton: number }> = ({ dur, fPress1, fPress2, fDry, fCrouton }) => {
  const f = useCurrentFrame();
  const push = (t: number) => interpolate(f, [t - 2, t + 6, t + 20], [0, 1, 0.25], { ...CL, easing: EASE });
  const p = Math.max(push(fPress1), push(fPress2));
  const s = lerp(f, [0, fPress1, fDry - 6, fDry + 24, dur], [1.05, 1.45, 1.5, 2.4, 2.5]);
  const x = lerp(f, [0, fPress1, fDry - 6, fDry + 24], [980, 1000, 1000, 640]);
  const y = lerp(f, [0, fPress1, fDry - 6, fDry + 24], [600, 760, 760, 700]);
  const toast = lerp(f, [fCrouton - 4, fCrouton + 18], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_press")} style={FULL} />
        <div style={{ ...BOX, clipPath: "inset(615px 495px 90px 540px)", transformOrigin: "980px 990px", transform: `scaleY(${1 - 0.03 * p})` }}>
          <Img src={S("e_press")} style={FULL} />
        </div>
        <div style={{ ...BOX, WebkitMaskImage: "radial-gradient(ellipse 170px 120px at 640px 700px, black 40%, transparent 100%)", maskImage: "radial-gradient(ellipse 170px 120px at 640px 700px, black 40%, transparent 100%)", opacity: toast }}>
          <Img src={S("e_press")} style={{ ...FULL, filter: "sepia(0.7) saturate(1.6) brightness(0.72) contrast(1.15)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK15B = { split: Split, press: Press } as Record<string, React.FC<any>>;
