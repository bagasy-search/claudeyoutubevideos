// Escenas ck15c · Navy Beans and Ham Bone — escenas hechas con las fotos reales (ver D:/rtmp/ck15c/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`ck15c/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
// cámara: escala + punto mirado (x,y) que queda al centro del cuadro
const cam = (s: number, x: number, y: number): React.CSSProperties => ({ ...BOX, overflow: "visible", transformOrigin: "0px 0px", transform: `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})` });
const lerp = (f: number, ks: number[], vs: number[]) => interpolate(f, ks, vs, { ...CL, easing: EASE });


// 1 · Dos tazones: plano abierto en los «same»; «this one» lleva la cámara al tazón malo, que se apaga a gris; «this one, honey» cruza al bueno, que se entibia, y termina en el hueso
export const Twobeans: React.FC<{ dur: number; fThis1: number; fGray: number; fThis2: number; fCreamy: number; fBone: number }> = ({ dur, fThis1, fGray, fThis2, fCreamy, fBone }) => {
  const f = useCurrentFrame();
  const k = [0, fThis1 - 4, fThis1 + 26, fThis2 - 4, fThis2 + 26, fBone, dur];
  const s = lerp(f, k, [1.05, 1.15, 2.1, 2.1, 2.1, 2.5, 2.55]) * (1 + 0.05 * f / dur);
  const x = lerp(f, k, [900, 900, 755, 755, 1180, 1180, 1180]) + 30 * Math.sin(f / 70);
  const y = lerp(f, k, [600, 600, 615, 615, 630, 640, 640]);
  const gray = lerp(f, [fGray - 6, fGray + 14], [0, 1]);
  const warm = lerp(f, [fCreamy - 4, fCreamy + 18], [0, 1]);
  const dimL = lerp(f, [fThis2 - 4, fThis2 + 20], [0, 1]);
  const dimR = lerp(f, [fThis1 - 4, fThis1 + 20, fThis2 - 4, fThis2 + 20], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_twobeans")} style={FULL} />
        <div style={{ ...BOX, clipPath: "ellipse(200px 165px at 757px 615px)" }}>
          <Img src={S("e_twobeans")} style={{ ...FULL, filter: `saturate(${1 - 0.8 * gray}) brightness(${1 - 0.1 * gray - 0.35 * dimL})` }} />
        </div>
        <div style={{ ...BOX, clipPath: "ellipse(212px 175px at 1178px 628px)" }}>
          <Img src={S("e_twobeans")} style={{ ...FULL, filter: `saturate(${1 + 0.35 * warm}) sepia(${0.18 * warm}) brightness(${1 + 0.08 * warm - 0.35 * dimR})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · Once huesos: la cámara baja desde el salón a la palangana; con «eleven» la palangana se levanta del mostrador y con «dishpan» la cámara la abre entera
export const Dishpan: React.FC<{ dur: number; fEleven: number; fDish: number }> = ({ dur, fEleven, fDish }) => {
  const f = useCurrentFrame();
  const up = lerp(f, [fEleven - 2, fEleven + 16], [0, 1]);
  const s = lerp(f, [0, fEleven, fDish, dur], [1.9, 1.75, 1.25, 1.2]);
  const x = lerp(f, [0, fEleven, fDish], [700, 820, 900]);
  const y = lerp(f, [0, fEleven, fDish], [330, 640, 640]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#121110", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_dishpan")} style={{ ...FULL, filter: `brightness(${1 - 0.2 * up})` }} />
        <div style={{ ...BOX, overflow: "visible", clipPath: "ellipse(420px 330px at 830px 735px)", transformOrigin: "830px 735px", transform: `translateY(${-14 * up}px) scale(${1 + 0.03 * up})`, filter: `drop-shadow(0px ${20 * up}px ${24 * up}px rgba(0,0,0,0.55))` }}>
          <Img src={S("e_dishpan")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Escoger: la bandeja entera con «pour», la cámara baja a la mano con «handful» y con «stones» todo se va de foco menos la mano que escoge
export const Sort: React.FC<{ dur: number; fPour: number; fHand: number; fStones: number }> = ({ dur, fPour, fHand, fStones }) => {
  const f = useCurrentFrame();
  const s = lerp(f, [0, fPour, fHand, fStones, dur], [1.0, 1.15, 1.6, 2.3, 2.4]);
  const x = lerp(f, [0, fPour, fHand, fStones], [960, 960, 1150, 1130]);
  const y = lerp(f, [0, fPour, fHand, fStones], [560, 620, 640, 620]);
  const foc = lerp(f, [fStones - 4, fStones + 20], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <div style={cam(s, x, y)}>
        <Img src={S("e_sort")} style={{ ...FULL, filter: `blur(${5 * foc}px) brightness(${1 - 0.15 * foc})` }} />
        <div style={{ ...BOX, WebkitMaskImage: `radial-gradient(circle ${260 - 110 * foc}px at 1130px 620px, black 50%, transparent 100%)`, maskImage: `radial-gradient(circle ${260 - 110 * foc}px at 1130px 620px, black 50%, transparent 100%)` }}>
          <Img src={S("e_sort")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_CK15C = { twobeans: Twobeans, dishpan: Dishpan, sort: Sort } as Record<string, React.FC<any>>;
