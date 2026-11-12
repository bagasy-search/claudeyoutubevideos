// Escenas sobre fotos de ck11f (ideas en D:/rtmp/ck11f/esc/ideas.md). Fotos a 1920x1080 con fill: coordenadas exactas.
import React from "react";
import { AbsoluteFill, Img, interpolate, Easing, staticFile, useCurrentFrame } from "remotion";

const W = 1920, H = 1080;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ez = Easing.bezier(0.42, 0, 0.22, 1);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "fill" };
// cámara: escala s ≥ 1 alrededor del punto (cx, cy) de la foto, recortada para que nunca asome un borde
const camara = (cx: number, cy: number, s: number): React.CSSProperties => {
  const tx = Math.min(0, Math.max(W - W * s, W / 2 - cx * s));
  const ty = Math.min(0, Math.max(H - H * s, H / 2 - cy * s));
  return { position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` };
};

// ───────── Escena 1 · la veta rosa sale de la tajada gris como una cinta ─────────
// s0010: tajada izquierda gris 510-930 × 105-1035; veta rosa vertical de y 205 a 935, x ≈ 822-880.
// LÍNEA DE TIEMPO: 0 → fLift-10 la cámara se acerca en curva a la tajada izquierda ("This one on the left is gray… from the edge");
// fLift-8 → fLift+26 la veta se levanta 64 px y empieza a ondular ("like a ribbon"); su lugar queda tapado con la carne gris vecina;
// hasta el final la cinta flota y ondula suave sobre la tajada.
const VETA_IZQ: [number, number][] = [[832, 205], [826, 245], [831, 300], [840, 360], [843, 420], [844, 480], [845, 540], [845, 600], [842, 660], [840, 720], [840, 780], [836, 840], [827, 900], [835, 935]];
const VETA_DER: [number, number][] = [[875, 935], [877, 900], [872, 840], [866, 780], [866, 720], [868, 660], [864, 600], [866, 540], [866, 480], [867, 420], [868, 360], [868, 300], [872, 245], [866, 205]];
const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${x}px ${y}px`).join(", ");
const VETA = poly([...VETA_IZQ, ...VETA_DER]);
const HUECO = poly([...VETA_IZQ.map(([x, y]) => [x - 7, y] as [number, number]), ...VETA_DER.map(([x, y]) => [x + 7, y] as [number, number])]);
const BANDAS = 14, Y0 = 200, Y1 = 940;

export const EscCinta: React.FC<{ dur: number; src?: string; fLift?: number }> = ({ dur, src = "ck11f/g/s0010.png", fLift = 200 }) => {
  const f = useCurrentFrame();
  const k = ez(interpolate(f, [0, Math.max(30, Math.min(150, fLift - 10))], [0, 1], cl));
  // la cámara entra en curva: primero baja, después se recuesta hacia la veta
  const cx = interpolate(k, [0, 0.5, 1], [960, 820, 760]);
  const cy = interpolate(k, [0, 0.5, 1], [540, 600, 560]);
  const s = interpolate(k, [0, 1], [1.0, 1.24]) + interpolate(f, [fLift, Math.max(fLift + 1, dur)], [0, 0.04], cl);
  const lift = interpolate(f, [fLift - 8, fLift + 26], [0, 64], { ...cl, easing: Easing.out(Easing.back(1.4)) });
  const amp = interpolate(f, [fLift - 4, fLift + 30], [0, 13], cl);
  const tapa = interpolate(f, [fLift - 8, fLift - 2], [0, 1], cl);
  const banda = (Y1 - Y0) / BANDAS;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={camara(cx, cy, s)}>
        <Img src={staticFile(src)} style={full} />
        {/* el hueco de la veta: la misma carne gris corrida 52 px desde la izquierda */}
        {tapa > 0 && (
          <div style={{ ...full, opacity: tapa, clipPath: `polygon(${HUECO})` }}>
            <Img src={staticFile(src)} style={{ ...full, transform: "translateX(52px)" }} />
          </div>
        )}
        {/* la cinta: la veta recortada en 14 bandas que ondulan a lo largo */}
        {lift > 0.5 && Array.from({ length: BANDAS }, (_, i) => {
          const y0 = Y0 + i * banda;
          const dx = Math.sin(f / 7 + i * 0.75) * amp;
          const tilt = Math.cos(f / 7 + i * 0.75) * amp * 0.03;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y0, width: W, height: banda + 1, overflow: "hidden",
              transform: `translate(${dx}px, ${-lift}px) rotate(${tilt}deg)`, filter: `drop-shadow(0 ${lift * 0.32}px ${6 + lift * 0.2}px rgba(0,0,0,${0.55 * Math.min(1, lift / 40)}))` }}>
              <div style={{ ...full, top: -y0, clipPath: `polygon(${VETA})` }}>
                <Img src={staticFile(src)} style={full} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────── Escena 2 · la foto del salón es una tarjeta de Navidad doblada por su rincón real ─────────
// g5080: rincón de las dos paredes en x ≈ 1000 (y 120-480), árbol justo ahí (760-1030 × 100-490); flores en las mesas.
// LÍNEA DE TIEMPO: 0-16 tarjeta cerrada (mitad izquierda; la derecha doblada encima, de espaldas, no se ve);
// 16-84 la mitad derecha gira sobre la bisagra del rincón y abre la tarjeta ("Here's a picture… at Christmas");
// fFlores → la cámara recorre en curva la mesa del frente ("the poinsettias on every table");
// fArbol → la cámara se acerca al rincón, al árbol que quedó en el pliegue ("the tree in the corner").
const BISAGRA = 1000;
export const EscTarjeta: React.FC<{ dur: number; src?: string; fFlores?: number; fArbol?: number }> = ({ dur, src = "ck11f/g/g5080.png", fFlores = 130, fArbol = 200 }) => {
  const f = useCurrentFrame();
  const ang = interpolate(f, [16, 84], [-172, 0], { ...cl, easing: Easing.bezier(0.3, 0, 0.15, 1) });
  const sombra = Math.min(1, Math.abs(ang) / 120);
  // cámara: de cerca a la tarjeta cerrada → plano completo → mesa del frente → rincón del árbol
  const a = ez(interpolate(f, [0, 84], [0, 1], cl));
  const b = ez(interpolate(f, [fFlores, fFlores + 60], [0, 1], cl));
  const c = ez(interpolate(f, [fArbol - 6, Math.max(fArbol, dur)], [0, 1], cl));
  const cx = interpolate(a, [0, 1], [520, 960]) + interpolate(b, [0, 1], [0, -60]) + interpolate(c, [0, 1], [0, -40]);
  const cy = 540 + interpolate(b, [0, 1], [0, 90]) + interpolate(c, [0, 1], [0, -330]);
  const s = interpolate(a, [0, 1], [1.12, 1.0]) + interpolate(b, [0, 1], [0, 0.06]) + interpolate(c, [0, 1], [0, 0.16]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120c08" }}>
      {/* detrás, la misma foto muy oscura y desenfocada: el salón en penumbra mientras la tarjeta está cerrada */}
      <Img src={staticFile(src)} style={{ ...full, filter: "blur(26px) brightness(0.28)", transform: "scale(1.08)" }} />
      <div style={{ ...camara(cx, cy, s), perspective: 2600, perspectiveOrigin: `${BISAGRA}px 540px` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: BISAGRA, height: H, overflow: "hidden", boxShadow: `${18 * sombra}px 0 40px rgba(0,0,0,${0.5 * sombra})` }}>
          <Img src={staticFile(src)} style={full} />
        </div>
        <div style={{ position: "absolute", left: BISAGRA, top: 0, width: W - BISAGRA, height: H, overflow: "hidden",
          transformOrigin: "0 50%", transform: `rotateY(${ang}deg)`, backfaceVisibility: "hidden" }}>
          <Img src={staticFile(src)} style={{ ...full, left: -BISAGRA }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,${0.55 * sombra}), rgba(0,0,0,${0.15 * sombra}))` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
