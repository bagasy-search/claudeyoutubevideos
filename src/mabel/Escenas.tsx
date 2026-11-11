// Escenas sobre fotos de mabel01 (skill edicion-sobre-fotos): cada una con un mecanismo propio, escritas de cero.
// Las fotos van a 1920x1080 con objectFit "fill" para que las coordenadas medidas con la rejilla sean exactas.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BG = "#120C07";

// ───────── 1 · "Forty cents, for seven people." (g050: mesa desde arriba, 4 monedas en 877-1056,532 y 7 platos alrededor)
// La foto se corta en siete porciones desde las monedas, como una torta: cada porción se lleva un plato.
const DC: [number, number] = [966, 532]; // centro de la fila de monedas
const CORTES = [11.3, 57, 120, 183, 242, 298, 341.5]; // ángulos (°, sentido horario desde +x) que pasan ENTRE los platos
const rayo = (deg: number, r: number): [number, number] => [DC[0] + r * Math.cos((deg * Math.PI) / 180), DC[1] + r * Math.sin((deg * Math.PI) / 180)];
const Dimes: React.FC<{ src: string; dur: number; m?: number[] }> = ({ src, dur, m }) => {
  const f = useCurrentFrame();
  // cámara: arranca cerrada sobre las monedas y se abre hasta ver la mesa entera (nunca deja bordes: escala >= 1)
  const t0 = Math.max(14, Math.min(m?.[0] ?? 30, dur - 40));  // los cortes salen sobre "for seven people"
  const k = interpolate(f, [0, t0 + 4], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const z = 2.9 - 1.86 * k;                       // 2.9 → 1.04
  const drift = interpolate(f, [0, dur], [0, 1], CL);
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${DC[0]}px ${DC[1]}px`, transform: `scale(${z + 0.02 * drift})` }}>
        {CORTES.map((a, i) => {
          const b = CORTES[(i + 1) % CORTES.length] + (i === CORTES.length - 1 ? 360 : 0);
          // porción i: del corte a al corte b; se separa hacia afuera sobre su bisectriz cuando le toca
          const steps = Math.max(2, Math.ceil((b - a) / 20));
          const pts = [DC, ...Array.from({ length: steps + 1 }, (_, j) => rayo(a + ((b - a) * j) / steps, 2400))];
          const cut = interpolate(f, [t0 + i * 3, t0 + i * 3 + 9], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
          const mid = ((a + b) / 2) * (Math.PI / 180);
          const d = 13 * cut;
          return (
            <Img key={i} src={staticFile(src)} style={{ ...FULL, clipPath: `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`, transform: `translate(${(Math.cos(mid) * d).toFixed(2)}px, ${(Math.sin(mid) * d).toFixed(2)}px)` }} />
          );
        })}
      </div>
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 49%, rgba(0,0,0,0) 58%, rgba(10,6,3,0.42) 100%)" }} />
    </AbsoluteFill>
  );
};

// ───────── 2 · "One cup of dry rice turned into three cups in the pot" (g1200: taza 215-685, olla 895-1820, de costado)
// Una costura vertical parte la foto en taza | olla; sobre "three cups" la costura se corre: la taza queda en 1/4 y la olla toma 3/4.
const Cups: React.FC<{ src: string; dur: number; m: number[] }> = ({ src, dur, m }) => {
  const f = useCurrentFrame();
  const t3 = m?.[1] ?? Math.round(dur * 0.4);
  const k = interpolate(f, [t3 - 4, t3 + 22], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const seamIn = interpolate(f, [4, 16], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const X = 960 - 480 * k;                               // costura: 960 → 480
  const G = 7 * seamIn;                                  // media rendija
  const breathe = interpolate(f, [0, dur], [0, 1], CL);
  // panel taza: muestra la foto desde x0L (0 → 215), escala 1
  const x0L = 215 * k;
  // panel olla: muestra desde x0R (880 → 800) con escala 1 → 1.286 (anclada en la base de la olla, y=915)
  const sR = 1 + 0.286 * k + 0.02 * breathe, x0R = 880 - 80 * k;
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: X - G, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ ...FULL, transform: `translateX(${-x0L}px) scale(${1 + 0.015 * breathe})`, transformOrigin: "450px 905px" }} />
      </div>
      <div style={{ position: "absolute", left: X + G, top: 0, width: 1920 - X - G, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "0px 915px", transform: `scale(${sR}) translateX(${-x0R}px)` }} />
      </div>
    </AbsoluteFill>
  );
};

// ───────── 3 · "sixty jars on the cellar shelf, gold and red, like a church window" (g1470: pared de frascos de frente)
// La foto se vuelve vidrio: multiplicada sobre un sol que sube por detrás; postes y tablas quedan como el emplomado.
const Jars: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], CL);
  const e = Easing.inOut(Easing.sin)(t);
  const sx = 620 + 700 * e, sy = 1250 - 900 * e;        // el sol sube en diagonal por detrás de la pared
  const amb = 0.2 + 0.25 * e;                            // la penumbra del sótano se levanta de a poco
  const a = Math.round(amb * 255);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, #FFFFFF 0px, #FFF3D6 260px, rgb(${a + 70},${a + 52},${a + 30}) 760px, rgb(${a},${Math.round(a * 0.86)},${Math.round(a * 0.7)}) 1500px)` }} />
      <Img src={staticFile(src)} style={{ ...FULL, mixBlendMode: "multiply", filter: "brightness(1.55) saturate(1.3) contrast(1.05)", transform: `scale(${(1.1 - 0.07 * e).toFixed(4)})`, transformOrigin: "50% 46%" }} />
    </AbsoluteFill>
  );
};

// ───────── 4 · "a layer of salt, a layer of pork, and another layer of salt" (g1540: caja de frente con tres capas)
// Cada capa real se corre de costado como un cajón cuando se la nombra y vuelve: sal de abajo, tocino, sal de arriba.
const CAPAS: [number, number][] = [[640, 792], [452, 644], [236, 470]]; // bandas (y0, y1) en el orden en que se nombran
const Layers: React.FC<{ src: string; dur: number; m: number[] }> = ({ src, dur, m }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.1, 1.03], { ...CL, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: "50% 48%" }}>
        <Img src={staticFile(src)} style={FULL} />
        {CAPAS.map(([y0, y1], i) => {
          const t0 = m?.[i] ?? Math.round(dur * (0.3 + 0.2 * i));
          const out = interpolate(f, [t0 - 3, t0 + 9, t0 + 26, t0 + 40], [0, 1, 1, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });
          if (out <= 0.001) return null;
          const dx = 150 * out * (i % 2 ? -1 : 1);
          return (
            <React.Fragment key={i}>
              {/* hueco que deja el cajón al salir */}
              <div style={{ position: "absolute", left: 118, top: y0, width: 1694, height: y1 - y0, background: `rgba(14,9,5,${0.82 * out})` }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${dx.toFixed(1)}px, ${(-10 * out).toFixed(1)}px)`, filter: `drop-shadow(0 ${18 * out}px ${26 * out}px rgba(0,0,0,0.55))` }}>
                <Img src={staticFile(src)} style={{ ...FULL, clipPath: `polygon(118px ${y0}px, 1812px ${y0}px, 1812px ${y1}px, 118px ${y1}px)` }} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Escena: React.FC<{ id: string; p: any; dur: number }> = ({ id, p, dur }) => {
  if (id === "dimes") return <Dimes src={p.src} dur={dur} m={p.m} />;
  if (id === "cups") return <Cups src={p.src} dur={dur} m={p.m} />;
  if (id === "jars") return <Jars src={p.src} dur={dur} />;
  if (id === "layers") return <Layers src={p.src} dur={dur} m={p.m} />;
  return null;
};
