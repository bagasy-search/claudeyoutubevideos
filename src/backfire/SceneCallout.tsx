// SceneCallout.tsx — UNA FOTO real a pantalla completa, la cámara empuja hacia el detalle, un CÍRCULO
// ROJO a mano lo marca y una NOTA de Walt (3-5 palabras, a mano en papel) dice lo que hay que ver.
//
// ⛔ `x,y` del detalle en PÍXELES del 1920x1080 de la foto (medido en un still, no 50/50 por defecto).
// ⛔ Nota CORTA (3-5 palabras). Nada de párrafos sobre la foto.
// ⛔ Beats en palabras: `circleAt` = cuando Walt nombra el detalle; `noteAt` = la frase que lo explica.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, useAbs, prog, camAt, camStyle, Grade, RedCircle, Note, KindChip, Credit, useOut } from "./Stage";

export const SceneCallout: React.FC<{
  photo: string;
  x: number;
  y: number;
  r?: number;               // radio del círculo en px de la foto (def 120)
  note: string;
  noteX?: number;           // posición de la nota en pantalla (px); por defecto, del lado con aire
  noteY?: number;
  zoom?: number;            // escala final del empuje (def 1.35)
  chip?: string;            // opcional: "LOOK CLOSER"
  circleAt?: number;
  noteAt?: number;
  credit?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ photo, x, y, r = 120, note, noteX, noteY, zoom = 1.35, chip, circleAt, noteAt, credit, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const cAt = circleAt ?? start + 0.8;
  const c = camAt(now, [
    { t: start, x: 960, y: 540, s: 1.02 },
    { t: cAt + 0.9, x, y, s: zoom },
    { t: cAt + 8, x, y, s: zoom * 1.06 },
  ]);
  const cp = prog(now, cAt, 0.7);
  const na = prog(now, noteAt ?? cAt + 0.9, 0.35);
  // dónde cae el detalle EN PANTALLA después de la cámara (para pegar la nota al lado con aire)
  const s = Math.max(1, c.s);
  const sx = Math.min(1920 - 300, Math.max(300, 960 + (x - c.x) * s));
  const sy = Math.min(1080 - 160, Math.max(160, 540 + (y - c.y) * s));
  const nx = noteX ?? (sx > 960 ? sx - r * s - 330 : sx + r * s + 330);
  const ny = noteY ?? Math.min(930, sy + r * s * 0.9);
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <div style={camStyle(c)}>
        <Img src={staticFile(photo)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: out }}>
          <RedCircle x={x} y={y} r={r} p={cp} />
        </div>
      </div>
      <Grade vignette={0.45} />
      <Note text={note} x={Math.max(260, Math.min(1660, nx))} y={ny} a={na * out} rot={-3} />
      {chip ? <KindChip text={chip} a={prog(now, start, 0.4) * out} /> : null}
      <Credit text={credit} a={prog(now, start, 0.4)} />
    </AbsoluteFill>
  );
};
