// Escenas sobre las fotos reales de cme14d (método edicion-sobre-fotos; ideas en D:/rtmp/cme14d/ideas.md).
// Fotos a 1920x1080 (objectFit fill), coordenadas exactas de la foto; sin dibujos encima, sin tarjetas.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const fade = (f: number, dur: number) => interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL);

// 1 · APAGÓN DEL EDIFICIO: la fachada se apaga; en cada aparato nombrado el vano real de una ventana muestra ese aparato con luz tibia
// vanos reales de e_fachada (x0, y0, x1, y1) y hacia dónde mira la foto del aparato dentro del vano (objectPosition)
const VANOS: [number, number, number, number][] = [
  [808, 332, 866, 470], // refri
  [949, 330, 1007, 448], // módem
  [1469, 318, 1532, 426], // lámpara
  [1478, 609, 1542, 721], // ventilador
  [809, 618, 863, 722], // tele
  [572, 639, 641, 748], // celulares
];
const FOCO = ["47% 55%", "40% 50%", "84% 40%", "55% 30%", "50% 45%", "50% 50%"];
export const EscFachada: React.FC<{ dur: number; img: string; devs: string[]; fr: number[] }> = ({ dur, img, devs, fr }) => {
  const f = useCurrentFrame();
  const apagon = interpolate(f, [0, 22], [1, 0.3], { ...CL, easing: io });
  // cámara: de lejos a la primera ventana, de ventana en ventana sobre cada palabra, y al final se aleja al edificio entero
  const cen = VANOS.map((v) => [(v[0] + v[2]) / 2, (v[1] + v[3]) / 2]);
  const fin = Math.min(dur - 40, fr[5] + 45);
  const T = [0, ...fr.map((x) => Math.max(1, x - 6)), fin, dur];
  const Z = [1.15, 2.6, 2.6, 2.6, 2.6, 2.6, 2.6, 1.22, 1.18];
  const X = [960, ...cen.map((c) => c[0]), 1060, 1060];
  const Y = [540, ...cen.map((c) => c[1]), 560, 560];
  const z = interpolate(f, T, Z, { ...CL, easing: io });
  let cx = interpolate(f, T, X, { ...CL, easing: io });
  let cy = interpolate(f, T, Y, { ...CL, easing: io });
  // sin bordes vacíos: el centro de cámara no se acerca al borde más de media pantalla
  cx = Math.min(1920 - 960 / z, Math.max(960 / z, cx));
  cy = Math.min(1080 - 540 / z, Math.max(540 / z, cy));
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden", opacity: fade(f, dur) }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})` }}>
        <Img src={staticFile(img)} style={{ ...FULL, filter: `brightness(${apagon}) saturate(${0.4 + 0.6 * apagon})` }} />
        {VANOS.map((v, i) => {
          if (f < fr[i] - 3) return null;
          const k = f - (fr[i] - 3);
          const luz = interpolate(k, [0, 4, 7, 14], [0, 0.75, 0.55, 1], CL);
          const asienta = interpolate(k, [0, 16], [1.12, 1], { ...CL, easing: io });
          return (
            <div key={i} style={{ position: "absolute", left: v[0], top: v[1], width: v[2] - v[0], height: v[3] - v[1], overflow: "hidden", boxShadow: `0 0 ${18 * luz}px ${4 * luz}px rgba(255,186,110,${0.35 * luz})` }}>
              <Img src={staticFile(devs[i])} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: FOCO[i], transform: `scale(${asienta})`, filter: `brightness(${0.25 + 0.85 * luz}) sepia(0.12)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2 · PRENSA: en "se aplasta" la foto de la puerta se aplasta contra el piso como algo blando; detrás, la ventana en penumbra recibe el sol en "una ventana"
export const EscPrensa: React.FC<{ dur: number; puerta: string; ventana: string; fAplasta: number; fVentana: number; fToalla: number }> = ({ dur, puerta, ventana, fAplasta, fVentana, fToalla }) => {
  const f = useCurrentFrame();
  // la puerta: la cámara se arrima a la ranura (705,540) y en "se aplasta" la imagen cae a una tira de 5 % con un rebote corto
  const camP = interpolate(f, [0, fAplasta], [1.0, 1.08], CL);
  const sy = interpolate(f, [fAplasta, fAplasta + 6, fAplasta + 10, fAplasta + 14], [1, 0.04, 0.075, 0.05], { ...CL, easing: Easing.in(Easing.quad) });
  const sx = interpolate(f, [fAplasta, fAplasta + 6, fAplasta + 14], [1, 1.07, 1.05], CL);
  const cae = interpolate(f, [fVentana, fVentana + 14], [0, 90], { ...CL, easing: Easing.in(Easing.cubic) });
  // la ventana: en penumbra mientras la puerta cae; en "una ventana" sube la luz; en "toalla" la cámara va al hueco (1117,615)
  const sol = interpolate(f, [fVentana, fVentana + 14], [0.22, 1], { ...CL, easing: io });
  const zV = interpolate(f, [fToalla - 6, dur], [1.04, 1.3], { ...CL, easing: io });
  const tx = interpolate(f, [fToalla - 6, dur], [0, (960 - 1117) * 0.3], { ...CL, easing: io });
  const ty = interpolate(f, [fToalla - 6, dur], [0, (540 - 640) * 0.3], { ...CL, easing: io });
  return (
    <AbsoluteFill style={{ background: "#0b0907", overflow: "hidden", opacity: fade(f, dur) }}>
      {f >= fAplasta ? (
        <AbsoluteFill style={{ transformOrigin: "960px 540px", transform: `translate(${tx}px, ${ty}px) scale(${zV})` }}>
          <Img src={staticFile(ventana)} style={{ ...FULL, filter: `brightness(${sol})` }} />
        </AbsoluteFill>
      ) : null}
      {cae < 89 ? (
        <AbsoluteFill style={{ transformOrigin: "705px 1080px", transform: `translateY(${cae}px) scale(${sx * camP}, ${sy * camP})`, boxShadow: f > fAplasta ? "0 -6px 24px rgba(0,0,0,0.6)" : undefined }}>
          <Img src={staticFile(puerta)} style={FULL} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
