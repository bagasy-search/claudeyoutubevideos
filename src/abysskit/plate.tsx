// abysskit/plate.tsx — fondos de metraje REAL dentro de las escenas ilustradas (mar de verdad, agua honda de verdad).
// Cada video pasa su pool (src/<slug>/plates.ts) y el índice de la escena; la escena i usa el clip i del pool,
// y en la vuelta siguiente del pool arranca más adelante en el clip (nunca el mismo tramo dos veces).
import React from "react";
import { OffthreadVideo, staticFile } from "remotion";
import { FPS } from "./lib";

type Pool = Record<string, [string, number, number][]>;
export const PlateCtx = React.createContext<{ pool: Pool; i: number; slug: string }>({ pool: {}, i: 0, slug: "" });

export const usePlate = (kind: string, k = 0) => {
  const { pool, i, slug } = React.useContext(PlateCtx), L = pool[kind];
  if (!L || !L.length) return null;
  const [n, dur, hz] = L[(i + k) % L.length], lap = Math.floor((i + k) / L.length);
  return { src: staticFile(`${slug}/real/${n}.mp4`), from: Math.min(Math.max(0, dur - 3), 0.5 + lap * 4), hz };
};

// el clip llena el cuadro; con y = alinea su horizonte a esa fila (para que el mar real coincida con la línea de agua)
export const Plate: React.FC<{ kind: string; k?: number; y?: number; rate?: number; style?: React.CSSProperties; vstyle?: React.CSSProperties }> = ({ kind, k = 0, y, rate = 0.5, style, vstyle }) => {
  const p = usePlate(kind, k);
  if (!p) return null;
  let H = 1080, top = 0;
  if (y !== undefined) { H = Math.max(1080, y / p.hz, (1080 - y) / (1 - p.hz)); top = y - p.hz * H; }
  const W = (H * 16) / 9;
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
    <OffthreadVideo src={p.src} muted playbackRate={rate} startFrom={Math.round(p.from * FPS)} style={{ position: "absolute", left: (1920 - W) / 2, top, width: W, height: H, objectFit: "cover", ...vstyle }} />
  </div>;
};
