// TOMA CONTINUA con clips de video IA: encadena tomas y las funde a través de un color (blanco de nube, luz del
// agua) para que se lea como UNA sola cámara. Cada toma conserva su audio propio (H3 genera el ambiente) y encima
// van los golpes puntuales (whoosh en el puente, un impacto en la revelación). Sin componentes encima: el plano manda.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Audio, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export type Toma = {
  src: string;            // ruta en public/
  desde?: number;         // s a recortar del arranque del clip
  dura: number;           // s que se usan
  puente?: number;        // s de fundido con la toma siguiente
  color?: string;         // color por el que pasa el fundido (si no, fundido directo)
  vol?: number;           // volumen del audio propio
  empuje?: number;        // zoom lento extra (1 = nada), suma "vuelo" sin cortar
};
export type Golpe = { src: string; t: number; vol?: number; dura?: number };

const suave = Easing.bezier(0.42, 0, 0.58, 1);

export const largoTomas = (tomas: Toma[]) => tomas.reduce((a, x, i) => a + x.dura - (i < tomas.length - 1 ? x.puente ?? 0 : 0), 0);

export const TomaClips: React.FC<{ tomas: Toma[]; golpes?: Golpe[] }> = ({ tomas, golpes = [] }) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  let t0 = 0;
  const pos = tomas.map((x, i) => { const a = t0; t0 += x.dura - (i < tomas.length - 1 ? x.puente ?? 0 : 0); return a; });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {tomas.map((x, i) => {
        const ini = Math.round(pos[i] * fps), len = Math.round(x.dura * fps);
        const pIn = i > 0 ? tomas[i - 1].puente ?? 0 : 0, pOut = i < tomas.length - 1 ? x.puente ?? 0 : 0;
        const lf = f - ini, ts = lf / fps;
        // entrada: si el puente es por color, la toma aparece recién en la segunda mitad (detrás del velo)
        const colIn = i > 0 && tomas[i - 1].color;
        const op = pIn > 0 ? interpolate(ts, colIn ? [pIn * 0.45, pIn * 0.55] : [0, pIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const z = 1 + ((x.empuje ?? 1) - 1) * Math.min(1, Math.max(0, ts / x.dura));
        return (
          <Sequence key={i} from={ini} durationInFrames={len}>
            <AbsoluteFill style={{ opacity: op, transform: `scale(${z})` }}>
              <OffthreadVideo src={staticFile(x.src)} startFrom={Math.round((x.desde ?? 0) * fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                volume={(fr) => (x.vol ?? 1) * interpolate(fr / fps, [0, pIn || 0.01, x.dura - (pOut || 0.01), x.dura], [pIn ? 0 : 1, 1, 1, pOut ? 0 : 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            </AbsoluteFill>
            {pOut > 0 && x.color && (
              <AbsoluteFill style={{ background: x.color, pointerEvents: "none",
                opacity: interpolate(ts, [x.dura - pOut, x.dura - pOut * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: suave }) }} />
            )}
          </Sequence>
        );
      })}
      {/* velo de salida del puente por color: se levanta sobre la toma siguiente */}
      {tomas.map((x, i) => {
        if (i === tomas.length - 1 || !x.color || !x.puente) return null;
        const ini = Math.round((pos[i] + x.dura - x.puente * 0.5) * fps), len = Math.round(x.puente * 0.5 * fps);
        return (
          <Sequence key={"v" + i} from={ini} durationInFrames={len}>
            <Levanta color={x.color} len={len} />
          </Sequence>
        );
      })}
      {golpes.map((g, i) => (
        <Sequence key={"g" + i} from={Math.round(g.t * fps)} durationInFrames={Math.round((g.dura ?? 4) * fps)}>
          <Audio src={staticFile(g.src)} volume={g.vol ?? 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Levanta: React.FC<{ color: string; len: number }> = ({ color, len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [0, len], [1, 0], { extrapolateRight: "clamp", easing: suave }) }} />;
};
