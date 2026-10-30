// l92 (Lou at 92) · piezas compartidas: el avatar (corte seco, imagen pura entera), el MUNDO de Lou (cocina, porche, taller, granja, salón, cementerio,
// con UNA cámara que viaja en curva de un encuadre con nombre al siguiente y nunca se queda quieta) y la foto con zoom lento.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import AVW from "./avwin.json";
import REELJ from "./reel.json";
import LTXOK from "./ltx_ok.json";
import PLAN from "./plan.json";
import { P, e, s } from "./lib";

const REEL = (REELJ as { reel: boolean }).reel;
export const OK = new Set(LTXOK as string[]);
type W = { ms: number; me: number; off: number };
export const WIN: W[] = (AVW as unknown as { win: W[] }).win;

export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  // +14 cuadros: la Sequence sigue viva durante el corte (si no, cuadros NEGROS)
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.32 && t < w.me + 0.8);
  const face = REEL ? <><Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />{WIN.map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 12 + 14} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  // imagen pura entera: sin zoom, sin recorte, sin halo ni desenfoque
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{face}</AbsoluteFill>;
};

// ===== el MUNDO: tres lugares reales de Ruth y una cámara que viaja entre encuadres con nombre =====
// encuadre = foto + centro (0..1) + zoom; la cámara llega en curva (bezier) y sigue empujando despacio, nunca quieta
type Fr = { im: string; x: number; y: number; z: number };
export const FR: Record<string, Fr> = {
  kitchen: { im: "L_cocina", x: 0.5, y: 0.5, z: 1.08 }, table: { im: "L_cocina", x: 0.55, y: 0.72, z: 1.6 }, stove: { im: "L_cocina", x: 0.28, y: 0.55, z: 1.8 },
  calendar: { im: "L_cocina", x: 0.25, y: 0.25, z: 2.0 }, window: { im: "L_cocina", x: 0.62, y: 0.28, z: 1.6 }, hutch: { im: "L_cocina", x: 0.46, y: 0.4, z: 1.9 },
  porch: { im: "L_porche", x: 0.32, y: 0.6, z: 1.35 }, street: { im: "L_porche", x: 0.75, y: 0.55, z: 1.5 }, maple: { im: "L_porche", x: 0.55, y: 0.3, z: 1.4 },
  shop: { im: "L_taller", x: 0.5, y: 0.5, z: 1.08 }, bench: { im: "L_taller", x: 0.38, y: 0.65, z: 1.6 }, tools: { im: "L_taller", x: 0.42, y: 0.22, z: 1.8 },
  sheet: { im: "L_taller", x: 0.84, y: 0.45, z: 1.8 }, boards: { im: "L_taller", x: 0.74, y: 0.3, z: 1.7 },
  farm: { im: "L_granja", x: 0.5, y: 0.5, z: 1.08 }, barn: { im: "L_granja", x: 0.64, y: 0.45, z: 1.6 }, windmill: { im: "L_granja", x: 0.47, y: 0.38, z: 1.8 }, fence: { im: "L_granja", x: 0.16, y: 0.66, z: 1.6 },
  hall: { im: "L_salon", x: 0.5, y: 0.5, z: 1.1 }, floor: { im: "L_salon", x: 0.5, y: 0.78, z: 1.5 }, punch: { im: "L_salon", x: 0.6, y: 0.75, z: 1.9 },
  stones: { im: "L_cementerio", x: 0.4, y: 0.72, z: 1.5 }, oak: { im: "L_cementerio", x: 0.72, y: 0.35, z: 1.6 },
};
const CAM = ((PLAN as unknown as { cam?: [number, number, string][] }).cam ?? []);
const bz = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const View: React.FC<{ f: Fr; t: number; k: number; dx: number; dy: number }> = ({ f, t, k, dx, dy }) => {
  // 30-oct: el farm marcó congelados (zoom de 3,5 % y deriva recortada en el borde): margen mínimo 6 % + zoom 7 % + respiración lenta, nunca quieto
  const z = Math.max(1.06, f.z) * (1 + 0.07 * k + 0.018 * Math.sin(t * 0.55)), W = 1920 * z, H = 1080 * z;
  const left = Math.min(0, Math.max(1920 - W, 960 - f.x * W + dx)), top = Math.min(0, Math.max(1080 - H, 540 - f.y * H + dy));
  return <Img src={staticFile("img/" + P + f.im + ".jpg")} style={{ position: "absolute", left, top, width: W, height: H, objectFit: "cover" }} />;
};
export const World: React.FC<{ t: number }> = ({ t }) => {
  const i = CAM.findIndex(([a, b]) => t >= a && t < b);
  // 30-oct: fuera de un tramo de cámara (respaldo de un Veo que no llegó) se queda en el último encuadre; antes tomaba el siguiente con k<0 y el mundo salía chiquito en la esquina
  const cur = i >= 0 ? CAM[i] : [...CAM].reverse().find(([a]) => a <= t) ?? CAM.find(([a]) => a > t) ?? [0, 1e9, "kitchen"];
  const prev = i > 0 ? CAM[i - 1] : undefined;
  const f1 = FR[cur[2]] ?? FR.kitchen, a = cur[0], k = Math.min(1, Math.max(0, (t - a) / Math.max(4, cur[1] - a)));
  const dx = 16 * Math.sin(t * 0.21), dy = 9 * Math.sin(t * 0.17 + 1);
  // viaje en curva desde el encuadre anterior (si es la misma foto); si cambia de lugar, fundido corto
  if (prev && prev[1] > a - 0.05) {
    const f0 = FR[prev[2]] ?? FR.kitchen, p = bz((t - a) / 1.6);
    if (p < 1 && f0.im === f1.im) {
      const arc = Math.sin(p * Math.PI) * 0.06;
      const f = { im: f1.im, x: f0.x + (f1.x - f0.x) * p, y: f0.y + (f1.y - f0.y) * p - arc, z: f0.z + (f1.z - f0.z) * p - arc * 2 };
      return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><View f={f} t={t} k={0} dx={dx} dy={dy} /></AbsoluteFill>;
    }
    if (p < 1) return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><View f={f0} t={t} k={1} dx={dx} dy={dy} /><AbsoluteFill style={{ opacity: bz((t - a) / 0.7) }}><View f={f1} t={t} k={k} dx={dx} dy={dy} /></AbsoluteFill></AbsoluteFill>;
  }
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><View f={f1} t={t} k={k} dx={dx} dy={dy} /></AbsoluteFill>;
};

// foto con zoom lento y deriva (nunca quieta)
export const Shot: React.FC<{ k: string; t: number; a: number; i?: number }> = ({ k, t, a, i = 0 }) => {
  const sc = 1.04 + 0.1 * e(t, a, a + 6.5), ox = (i % 2 ? 1 : -1) * 22 * e(t, a, a + 6.5);
  return <AbsoluteFill style={{ overflow: "hidden" }}><Img src={staticFile("img/" + P + k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sc}) translateX(${ox}px)` }} /></AbsoluteFill>;
};
