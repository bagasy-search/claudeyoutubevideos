// TfbZoomCircle — la LUPA de las miniaturas del canal: un círculo con aro AMARILLO que muestra, ampliado, un punto del
// propio footage (video o foto), y una flecha ROJA gruesa que sale del aro y apunta al lugar real en el cuadro.
// El contenido del círculo es el MISMO video, sincronizado (se le pasa `src` + `startFrom` = cuadro del archivo en el que
// arranca la Sequence), así la lupa se mueve con la acción. `track` permite que el punto siga al objeto.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, lin, pop } from "./theme";

type P = { f: number; x: number; y: number };
export type ZoomCircleProps = {
  dur: number;
  src: string;                 // video o imagen (ruta en public/)
  startFrom?: number;          // si es video: cuadro del archivo que corresponde al cuadro 0 de esta pieza
  kind?: "video" | "image";
  track: P[];                  // punto a ampliar, en % del cuadro (0-100); uno solo = fijo
  zoom?: number;               // aumento dentro del círculo (2.2 por defecto)
  cx?: number; cy?: number;    // centro del círculo en % del ancho/alto (default: lado opuesto al punto)
  r?: number;                  // radio en px (default 250)
  arrow?: boolean;             // flecha roja del aro al punto
  ringColor?: string;
};

const at = (tr: P[], f: number, k: "x" | "y") => tr.length === 1 ? tr[0][k] : lin(f, tr.map((p) => p.f), tr.map((p) => p[k]), EIO);

export const TfbZoomCircle: React.FC<ZoomCircleProps> = ({ dur, src, startFrom = 0, kind = "video", track, zoom = 2.2, cx, cy, r = 250, arrow = true, ringColor = C.yellow }) => {
  const f = useCurrentFrame(); const { fps, width: W, height: H } = useVideoConfig();
  const px = at(track, f, "x"), py = at(track, f, "y");
  const CX = ((cx ?? (px > 50 ? 27 : 73)) / 100) * W, CY = ((cy ?? 50) / 100) * H;
  const inn = pop(f, fps, 2, 200, 13), out = lin(f, [dur - 7, dur], [1, 0], EIO);
  const s = Math.max(0, inn) * out;
  // el contenido ampliado: la escena entera escalada por `zoom`, corrida para que el punto quede en el centro del círculo
  const tx = CX - (px / 100) * W * zoom, ty = CY - (py / 100) * H * zoom;
  const media = kind === "video"
    ? <OffthreadVideo src={staticFile(src)} startFrom={startFrom} muted style={{ width: W, height: H }} />
    : <Img src={staticFile(src)} style={{ width: W, height: H, objectFit: "cover" }} />;
  // flecha: del borde del aro hacia el punto, se dibuja con dash
  const TX = (px / 100) * W, TY = (py / 100) * H;
  const ang = Math.atan2(TY - CY, TX - CX), sx = CX + Math.cos(ang) * (r + 14), sy = CY + Math.sin(ang) * (r + 14);
  const L = Math.hypot(TX - sx, TY - sy), ex = TX - Math.cos(ang) * 46, ey = TY - Math.sin(ang) * 46;
  const draw = lin(f, [8, 20], [0, 1], EO) * out;
  const bend = 0.18 * L, mx = (sx + ex) / 2 - Math.sin(ang) * bend, my = (sy + ey) / 2 + Math.cos(ang) * bend;
  const d = `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
  const hx = Math.atan2(ey - my, ex - mx);
  const head = (w: number) => `M ${ex + Math.cos(hx) * 44} ${ey + Math.sin(hx) * 44} L ${ex + Math.cos(hx + 2.45) * w} ${ey + Math.sin(hx + 2.45) * w} L ${ex + Math.cos(hx - 2.45) * w} ${ey + Math.sin(hx - 2.45) * w} Z`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {arrow && L > 60 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} transform="translate(4 6)" />
          <path d={d} fill="none" stroke={C.red} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
          <path d={head(40)} fill={C.red} opacity={lin(draw, [0.85, 1], [0, 1])} stroke={C.redDeep} strokeWidth={3} />
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: CX - r, top: CY - r, width: 2 * r, height: 2 * r, transform: `scale(${s.toFixed(4)})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: -16, borderRadius: "50%", boxShadow: "0 18px 50px rgba(0,0,0,0.55)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", backgroundColor: "#111" }}>
          <div style={{ position: "absolute", left: tx - (CX - r), top: ty - (CY - r), width: W, height: H, transform: `scale(${zoom})`, transformOrigin: "0 0" }}>{media}</div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)" }} />
        </div>
        <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: `16px solid ${ringColor}`, boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.25)" }} />
      </div>
    </AbsoluteFill>
  );
};
