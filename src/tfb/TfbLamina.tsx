// TfbLamina — la ficha/lámina a pantalla completa, "de papel": entra con una sombra de hoja y recorre sus puntos con
// zoom (x/y/z por cuadro, easing suave) mientras un marco amarillo redondeado acompaña la zona que se está explicando.
// ⛔ Sin QR adentro: el CTA va aparte (TfbCta), fijo y sin Ken-Burns.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, EIO, lin } from "./theme";

export type LamPoint = { f: number; x: number; y: number; z: number; box?: [number, number, number, number] }; // box en % de la hoja: x,y,w,h

export const TfbLamina: React.FC<{ dur: number; src: string; points: LamPoint[]; paper?: string }> = ({ dur, src, points, paper = "#E9DABB" }) => {
  const f = useCurrentFrame();
  const ks = points.map((p) => p.f);
  const at = (k: "x" | "y" | "z") => (points.length > 1 ? lin(f, ks, points.map((p) => p[k]), EIO) : points[0][k]);
  const z = at("z"), x = at("x"), y = at("y");
  const op = lin(f, [0, 8], [0, 1]) * lin(f, [dur - 8, dur], [1, 0]);
  const curI = Math.max(0, points.filter((p) => p.f <= f).length - 1), cur = points[curI];
  const boxOp = cur?.box ? lin(f - cur.f, [6, 14], [0, 1]) * (points[curI + 1] ? lin(f, [points[curI + 1].f - 8, points[curI + 1].f], [1, 0]) : 1) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: paper, opacity: op, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${x.toFixed(2)}% ${y.toFixed(2)}%` }}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", height: "100%", aspectRatio: "16 / 9" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain", boxShadow: "0 30px 80px rgba(40,25,10,0.35)" }} />
            {cur?.box ? <div style={{ position: "absolute", left: `${cur.box[0]}%`, top: `${cur.box[1]}%`, width: `${cur.box[2]}%`, height: `${cur.box[3]}%`, border: `6px solid ${C.yellow}`, borderRadius: 18,
              boxShadow: "0 0 0 4000px rgba(40,25,10,0.18)", opacity: boxOp }} /> : null}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
