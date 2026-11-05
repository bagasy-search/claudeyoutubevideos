// MONTAJE de toma continua MIXTA: clips de video IA encadenados + material REAL de archivo (fotos y película),
// todo en una sola línea de tiempo. Las tomas IA encadenadas van a tope (cruce 0); al entrar o salir de un archivo
// se funden con un cruce corto y la toma IA pasa por blanco y negro (bn: "entra" = arranca en b/n y se colorea,
// "sale" = se destiñe al final), así el ojo lee archivo → recuerdo → escena sin corte. Las fotos llevan Ken Burns
// subpíxel con foco propio. <Recorte> pone encima la misma toma recortada con alfa (gente adelante del texto).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile, interpolate, useCurrentFrame, Easing } from "remotion";

export type Pieza = {
  id: string;
  src: string;            // ruta en public/
  tipo?: "video" | "foto";
  desde?: number;         // cuadros a saltear del arranque del clip
  dura: number;           // cuadros que se ven
  cruce?: number;         // cuadros de fundido con la pieza anterior (se solapan)
  bn?: "entra" | "sale" | "ambos" | "todo";
  kb?: [number, number];  // zoom de la foto de punta a punta
  foco?: string;          // transform-origin de la foto ("40% 35%")
  pos?: string;           // object-position del video
};

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const suave = Easing.bezier(0.42, 0, 0.58, 1);

export const inicios = (ps: Pieza[]) => {
  const r: Record<string, number> = {}; let t = 0;
  ps.forEach((p, i) => { if (i) t -= p.cruce ?? 0; r[p.id] = t; t += p.dura; });
  return { en: r, largo: t };
};

const Una: React.FC<{ p: Pieza; sig?: Pieza }> = ({ p, sig }) => {
  const f = useCurrentFrame();
  const cIn = p.cruce ?? 0, cOut = sig?.cruce ?? 0;
  const op = cIn ? interpolate(f, [0, cIn], [0, 1], { ...cl, easing: suave }) : 1;
  const BN = 18; // cuadros que tarda en colorearse / desteñirse
  const gIn = p.bn === "entra" || p.bn === "ambos" ? interpolate(f, [cIn * 0.5, cIn + BN], [1, 0], cl) : 0;
  const gOut = p.bn === "sale" || p.bn === "ambos" ? interpolate(f, [p.dura - cOut - BN, p.dura - cOut * 0.5], [0, 1], cl) : 0;
  const gris = p.bn === "todo" ? 1 : Math.max(gIn, gOut);
  const filtro = gris > 0.001 ? `grayscale(${gris}) contrast(${1 + gris * 0.12})` : undefined;
  if (p.tipo === "foto") {
    const [z0, z1] = p.kb ?? [1.02, 1.12];
    const z = interpolate(f, [0, p.dura], [z0, z1], { ...cl, easing: Easing.bezier(0.3, 0, 0.7, 1) });
    return (
      <AbsoluteFill style={{ opacity: op, overflow: "hidden", background: "#000" }}>
        <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, transform: `scale(${z})`,
          transformOrigin: p.foco ?? "50% 45%", filter: "grayscale(1) contrast(1.06)" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo src={staticFile(p.src)} startFrom={p.desde ?? 0} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, filter: filtro }} />
    </AbsoluteFill>
  );
};

export const Montaje: React.FC<{ piezas: Pieza[] }> = ({ piezas }) => {
  const { en } = inicios(piezas);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {piezas.map((p, i) => (
        <Sequence key={p.id} from={en[p.id]} durationInFrames={p.dura}>
          <Una p={p} sig={piezas[i + 1]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// la misma toma recortada (webm con alfa, mismo arranque) encima del texto: la gente queda ADELANTE de las letras
export const Recorte: React.FC<{ src: string; desde?: number; dura: number; t0: number; fundido?: number }> =
  ({ src, desde = 0, dura, t0, fundido = 0 }) => (
  <Sequence from={t0} durationInFrames={dura}>
    <RecorteIn src={src} desde={desde} dura={dura} fundido={fundido} />
  </Sequence>
);
const RecorteIn: React.FC<{ src: string; desde: number; dura: number; fundido: number }> = ({ src, desde, dura, fundido }) => {
  const f = useCurrentFrame();
  const op = fundido ? interpolate(f, [0, fundido, dura - fundido, dura], [0, 1, 1, 0], cl) : 1;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo src={staticFile(src)} startFrom={desde} transparent muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// niebla que la cámara atraviesa (tapa un tramo feo del clip o funde dos mundos): manchas de nube a pantalla llena
export const Niebla: React.FC<{ desde: number; hasta: number; src: string; color?: string; pico?: number }> =
  ({ desde, hasta, src, color = "#9fb0c4", pico = 0.95 }) => {
  const f = useCurrentFrame();
  if (f < desde || f > hasta) return null;
  const u = (f - desde) / (hasta - desde);
  const op = interpolate(u, [0, 0.25, 0.75, 1], [0, pico, pico, 0], { ...cl, easing: suave });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${color} 0%, ${color}ee 55%, ${color}cc 100%)` }} />
      {[0, 1, 2, 3, 4].map((i) => {
        const z = 1.6 + i * 0.5 + u * (1.5 + i * 0.4);
        return <Img key={i} src={staticFile(src)} style={{ position: "absolute", left: "50%", top: "50%", width: 1400,
          transform: `translate(-50%,-50%) translate(${(i - 2) * 160 * (1 + u)}px, ${(i % 2 ? -1 : 1) * 90 * u}px) scale(${z}) rotate(${i * 40}deg)`,
          opacity: 0.55, filter: "brightness(0.85) blur(4px)" }} />;
      })}
    </AbsoluteFill>
  );
};

// pie de foto de archivo (fuente real), abajo al centro, chico
export const PieArchivo: React.FC<{ desde: number; hasta: number; texto: string }> = ({ desde, hasta, texto }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [desde, desde + 12, hasta - 12, hasta], [0, 0.85, 0.85, 0], cl);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", bottom: "15.5%", width: "100%", textAlign: "center", opacity: op, color: "#e9e4d8",
        fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 26, letterSpacing: 2, textShadow: "0 2px 12px rgba(0,0,0,.9)" }}>{texto}</div>
    </AbsoluteFill>
  );
};
