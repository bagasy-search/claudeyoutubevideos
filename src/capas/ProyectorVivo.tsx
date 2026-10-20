// ProyectorVivo (20-oct-2026) — prueba de "pintura viva" por CAPAS con código, sin regenerar el dibujo:
// fondo + chico recortados de UNA imagen agnes (D:/rtmp/capas_proyector), la sombra del chico hecha con su
// silueta (cuerpo y brazo aparte) que cobra vida: se da vuelta, le tiende la mano y suelta mariposas de luz.
// Cámara con parallax por capa, polvo en el haz, haz que titila, foco que parpadea. Todo en px de la imagen (1312x736).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const TOTAL_FRAMES_PROYECTOR = 300;
const IW = 1312, IH = 736;
const A = (f: string) => staticFile(`capas_proyector/${f}`);
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// geometría (px de la imagen)
const PROJ = { x: 300, y: 360 };                  // lente del proyector
const WALL = { x0: 990, x1: 1228, y0: 58, y1: 522 }; // rectángulo iluminado
const PIES = { x: 690, y: 666 };                   // pies del chico (ancla de la silueta)
const SOMBRA = { x: 1115, y: 498, s: 0.95 };       // dónde caen los pies de la sombra en la pared
const HOMBRO = { x: 712, y: 445 };                 // pivote del brazo
const MANO_CHICO = { x: 776, y: 378 };

// cámara: acercamiento lento hacia el punto entre el chico y la pared, cada capa con su profundidad
const capa = (t: number, prof: number): React.CSSProperties => {
  const z = lerp(1.0, 1.1, ease(t)) * (1 + prof * 0.03 * ease(t));
  const cx = lerp(760, 860, ease(t)), cy = lerp(380, 350, ease(t));
  return { position: "absolute", inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${z}) translate(${-prof * 6 * ease(t)}px, 0px)` };
};

const Silueta: React.FC<{ f: string }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: "#4a2410", WebkitMaskImage: `url(${A(f)})`, maskImage: `url(${A(f)})`,
    WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties}>
    <Img src={A(f)} style={{ width: 1, height: 1, opacity: 0 }} />
  </div>
);

const Polvo: React.FC<{ f: number }> = ({ f }) => (
  <>{Array.from({ length: 110 }, (_, i) => {
    const u = 0.08 + rnd(i) * 0.92, v = rnd(i + 500) * 2 - 1;
    const wy0 = lerp(WALL.y0, WALL.y1, 0.5 + v * 0.5);
    let x = lerp(PROJ.x, lerp(WALL.x0, WALL.x1, rnd(i + 900) * 0.2), u);
    let y = lerp(PROJ.y, wy0, u);
    x += Math.sin(f / (40 + rnd(i + 3) * 50) + i) * 8 + f * (rnd(i + 7) - 0.4) * 0.12;
    y += Math.cos(f / (55 + rnd(i + 4) * 40) + i * 2) * 6 - f * rnd(i + 8) * 0.06;
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (12 + rnd(i + 9) * 20) + i));
    const s = 1.2 + rnd(i + 11) * 2.6;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%",
      background: "#ffe9b0", boxShadow: `0 0 ${s * 3}px #ffcf70`, opacity: tw * (0.4 + u * 0.6), mixBlendMode: "screen" }} />;
  })}</>
);

const Mariposa: React.FC<{ f: number; i: number; desde: { x: number; y: number }; hasta: { x: number; y: number }; t0: number }> = ({ f, i, desde, hasta, t0 }) => {
  const k = interpolate(f, [t0, t0 + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  if (f < t0) return null;
  const c = { x: lerp(desde.x, hasta.x, 0.5) + (i - 1) * 40, y: Math.min(desde.y, hasta.y) - 70 - i * 25 };   // curva por arriba
  const x = (1 - k) ** 2 * desde.x + 2 * (1 - k) * k * c.x + k * k * hasta.x + Math.sin(f / 6 + i) * 6 * (1 - k);
  const y = (1 - k) ** 2 * desde.y + 2 * (1 - k) * k * c.y + k * k * hasta.y + Math.cos(f / 5 + i * 2) * 5;
  const al = 0.25 + 0.75 * Math.abs(Math.sin(f / 2.2 + i));          // aleteo
  const op = interpolate(f, [t0, t0 + 10], [0, 1], { extrapolateRight: "clamp" });
  const ala = (lado: number) => <div style={{ position: "absolute", width: 20, height: 26, left: lado < 0 ? -20 : 0, top: -13,
    borderRadius: lado < 0 ? "80% 20% 60% 40%" : "20% 80% 40% 60%", background: "radial-gradient(circle, #fffbe8 0%, #ffd77a 60%, rgba(255,190,80,0) 100%)",
    transform: `scaleX(${al})`, transformOrigin: lado < 0 ? "100% 50%" : "0% 50%" }} />;
  return <div style={{ position: "absolute", left: x, top: y, opacity: op, filter: "drop-shadow(0 0 6px #ffd27a) drop-shadow(0 0 14px #ffb84a)", mixBlendMode: "screen" }}>
    {ala(-1)}{ala(1)}</div>;
};

export const ProyectorVivo: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const t = f / TOTAL_FRAMES_PROYECTOR;
  const S = Math.max(width / IW, height / IH);

  // sombra: 0-2 s copia al chico · 2-4.5 s baja el brazo y saluda sola · 4.8-5.6 s se da vuelta · 5.6+ le tiende la mano
  const brazo = f < 60 ? 0
    : f < 135 ? interpolate(f, [60, 80, 95, 110, 125, 135], [0, 50, 25, 55, 30, 40], { easing: ease })
    : f < 168 ? interpolate(f, [135, 168], [40, 15], { easing: ease })
    : interpolate(f, [168, 200, 300], [15, -8, -12], { easing: ease, extrapolateRight: "clamp" });
  const giro = interpolate(f, [144, 168], [1, -1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const inclina = interpolate(f, [168, 210], [0, -4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  // mano de la sombra ya girada (para que las mariposas salgan de ahí)
  const manoS = { x: SOMBRA.x - (780 - PIES.x) * SOMBRA.s, y: SOMBRA.y + (375 - PIES.y) * SOMBRA.s };

  const respira = 1 + 0.004 * Math.sin((f / 30) * Math.PI * 2 / 3.4);
  const haz = 0.1 + 0.03 * Math.sin(f / 7) + 0.02 * Math.sin(f / 2.3 + 1);
  const foco = 0.55 + 0.12 * Math.sin(f / 3.1) * Math.sin(f / 11);
  const brillo = interpolate(f, [170, 260], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sombraGrupo: React.CSSProperties = {
    position: "absolute", inset: 0, transformOrigin: `${PIES.x}px ${PIES.y}px`,
    transform: `translate(${SOMBRA.x - PIES.x}px, ${SOMBRA.y - PIES.y}px) scale(${SOMBRA.s * giro}, ${SOMBRA.s}) skewX(${inclina}deg)`,
    filter: "blur(1.8px)", opacity: 0.78, mixBlendMode: "multiply",
  };

  return (
    <AbsoluteFill style={{ background: "#120a04", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: IW, height: IH, left: (width - IW * S) / 2, top: (height - IH * S) / 2, transform: `scale(${S})`, transformOrigin: "0 0" }}>
        {/* fondo */}
        <div style={capa(t, 0)}>
          <Img src={A("capa_fondo.png")} style={{ position: "absolute", inset: 0, width: IW, height: IH }} />
          {/* pared que se enciende de a poco cuando la sombra le tiende la mano */}
          <div style={{ position: "absolute", left: WALL.x0 - 40, top: WALL.y0 - 40, width: WALL.x1 - WALL.x0 + 80, height: WALL.y1 - WALL.y0 + 80,
            background: "radial-gradient(ellipse at 45% 45%, rgba(255,236,170,0.9), rgba(255,200,90,0) 70%)", opacity: 0.12 + brillo, mixBlendMode: "screen" }} />
          {/* sombra viva */}
          <div style={sombraGrupo}>
            <Silueta f="sombra_cuerpo.png" />
            <div style={{ position: "absolute", inset: 0, transformOrigin: `${HOMBRO.x}px ${HOMBRO.y}px`, transform: `rotate(${brazo}deg)` }}>
              <Silueta f="sombra_brazo.png" />
            </div>
          </div>
          {/* foco */}
          <div style={{ position: "absolute", left: 655 - 90, top: 88 - 90, width: 180, height: 180, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,226,150,0.85), rgba(255,180,80,0) 65%)", opacity: foco, mixBlendMode: "screen" }} />
          {/* haz que titila */}
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: haz,
            clipPath: `polygon(${PROJ.x}px ${PROJ.y - 8}px, ${WALL.x0}px ${WALL.y0}px, ${WALL.x0}px ${WALL.y1}px, ${PROJ.x}px ${PROJ.y + 8}px)`,
            background: "linear-gradient(100deg, #fff3cc 0%, #ffcf73 45%, rgba(255,190,90,0.2) 100%)" }} />
        </div>
        {/* chico */}
        <div style={capa(t, 1)}>
          <Img src={A("capa_chico.png")} style={{ position: "absolute", inset: 0, width: IW, height: IH, transformOrigin: `${PIES.x}px ${PIES.y}px`, transform: `scaleY(${respira})` }} />
        </div>
        {/* polvo y mariposas (más cerca de cámara) */}
        <div style={capa(t, 1.6)}>
          <Polvo f={f} />
          {[0, 1, 2].map(i => <Mariposa key={i} f={f} i={i} desde={manoS} hasta={{ x: MANO_CHICO.x + (i - 1) * 14, y: MANO_CHICO.y - 10 - i * 8 }} t0={185 + i * 14} />)}
        </div>
      </div>
      {/* viñeta suave del propio cuadro (luz de habitación oscura) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0) 55%, rgba(10,5,0,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};
