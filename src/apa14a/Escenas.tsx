// Escenas apa14a · The Homemade Bait Station — cuatro escenas hechas con las fotos reales (ver D:/rtmp/apa14a/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`apa14a/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const poly = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
// cámara que pone (cx,cy) en el centro sin dejar bordes vacíos
const cam = (s: number, cx: number, cy: number) => {
  const tx = Math.min(0, Math.max(1920 - 1920 * s, 960 - cx * s)), ty = Math.min(0, Math.max(1080 - 1080 * s, 540 - cy * s));
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};

// Las fotos fuente son 1088x608: la cámara no pasa de ~1.8x para que el detalle siga nítido.
const glide = (f: number, ks: number[], vs: number[][]) => [0, 1, 2].map((k) => interpolate(f, ks, vs.map((v) => v[k]), { ...CL, easing: EASE }));

// 1 · Rastreo a ras del piso: la cámara se agacha sobre la huella de adelante (se cuentan los dedos), en "five" salta a la de atrás y en "tail" sigue la raya de la cola hacia la pared.
export const Tracks: React.FC<{ dur: number; fFive: number; fTail: number }> = ({ dur, fFive, fTail }) => {
  const f = useCurrentFrame();
  const [z, x, y] = glide(f, [0, 34, fFive, fFive + 22, fTail, Math.min(dur, fTail + 40)], [[1.05, 1100, 760], [1.8, 1220, 790], [1.8, 1240, 795], [1.8, 1480, 865], [1.8, 1470, 860], [1.3, 900, 690]]);
  const k = (z - 1.05) / 0.75;
  return (
    <AbsoluteFill style={{ backgroundColor: "#22262a", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: cam(z, x, y), transformOrigin: "0 0" }}>
        <Img src={S("e_tracks")} style={{ ...FULL, filter: `contrast(${1 + 0.35 * k}) brightness(${1 - 0.08 * k})` }} />
      </div>
    </AbsoluteFill>
  );
};

// 2 · La foto entera se da vuelta como una tarjeta sobre su eje horizontal en "Not up": por un instante las bocas quedan para arriba (así NO) y vuelve.
export const Station: React.FC<{ dur: number; fDown: number; fNot: number }> = ({ dur, fDown, fNot }) => {
  const f = useCurrentFrame();
  const a = Math.min(fNot, dur - 30);
  const flip = interpolate(f, [a, a + 9, a + 19, a + 28], [0, 180, 180, 360], { ...CL, easing: EASE });
  const [z, x, y] = glide(f, [0, fDown, fDown + 40, dur], [[1.0, 960, 540], [1.0, 960, 540], [1.45, 640, 420], [1.55, 620, 420]]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#15120e", overflow: "hidden", perspective: 2200 }}>
      <div style={{ ...BOX, transform: `rotateX(${flip}deg)`, transformOrigin: "960px 540px" }}>
        <div style={{ ...BOX, transform: cam(z, x, y), transformOrigin: "0 0" }}>
          <Img src={S("e_station")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Lectura de la tabla renglón por renglón: la cámara se pega a las filas llenas en "row", baja a la fila rala en "two" y se queda en las filas vacías en "nothing".
export const Board: React.FC<{ dur: number; fRow: number; fTwo: number; fNothing: number }> = ({ dur, fRow, fTwo, fNothing }) => {
  const f = useCurrentFrame();
  const [z, x, y] = glide(f, [0, fRow - 8, fRow + 18, fTwo - 6, fTwo + 22, fNothing - 4, fNothing + 26, dur], [[1.1, 860, 450], [1.15, 860, 430], [1.75, 760, 190], [1.75, 860, 230], [1.75, 560, 520], [1.7, 600, 530], [1.6, 860, 730], [1.65, 860, 740]]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1f1a15", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: cam(z, x, y), transformOrigin: "0 0" }}>
        <Img src={S("e_board")} style={{ ...FULL, filter: "contrast(1.18)" }} />
      </div>
    </AbsoluteFill>
  );
};

// 4 · Grúa desde adentro del pasto alto: arranca entre los tallos y sube hasta que aparece la franja corta delante de la casa y el granero en "turn"; el pasto de adelante baja más rápido (paralaje).
const GRASS = poly([[0, 585], [500, 600], [960, 635], [1400, 670], [1920, 715], [1920, 1080], [0, 1080]]);
export const Strip: React.FC<{ dur: number; fTurn: number }> = ({ dur, fTurn }) => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, Math.max(30, fTurn)], [0, 1], { ...CL, easing: EASE });
  const z = 1.75 - 0.65 * u + 0.04 * interpolate(f, [fTurn, dur], [0, 1], CL);
  const y = 900 - 360 * u;
  const drop = 90 * u;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a3a36", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: cam(z, 960, y), transformOrigin: "0 0" }}>
        <Img src={S("e_strip")} style={FULL} />
        <div style={{ ...BOX, clipPath: GRASS, transform: `translateY(${drop}px) scale(1.06)`, transformOrigin: "960px 1080px" }}>
          <Img src={S("e_strip")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ESC_APA14A = { tracks: Tracks, station: Station, board: Board, strip: Strip } as Record<string, React.FC<any>>;
