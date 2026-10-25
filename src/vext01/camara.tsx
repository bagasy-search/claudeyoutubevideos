// Cámara orgánica para escenas 2D en código: lo que hace que el movimiento no se sienta "agregado en edición".
// - Keyframes con resorte (inercia + overshoot leve), nunca lineales.
// - Temblor de mano = suma de senos de frecuencias que no se repiten (0,23-1,7 Hz), amplitud en px reales.
// - Paralaje: cada capa se mueve según su profundidad (z=0 fondo lejano, z=1 plano de foco, z>1 primer término).
// - Foco: cada capa se desenfoca según su distancia al plano de foco (rack focus animable).
import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Pose = { x: number; y: number; zoom: number; rot?: number; foco?: number };
export type Clave = Pose & { f: number; resorte?: { damping?: number; stiffness?: number; mass?: number } };

type Estado = { x: number; y: number; zoom: number; rot: number; foco: number };
const Ctx = createContext<Estado>({ x: 0, y: 0, zoom: 1, rot: 0, foco: 1 });

// posición de cámara en el cuadro f: cada tramo entre claves avanza con un resorte (llega con inercia, rebota apenas)
export const poseEn = (claves: Clave[], f: number, fps: number): Estado => {
  let p: Estado = { x: claves[0].x, y: claves[0].y, zoom: claves[0].zoom, rot: claves[0].rot ?? 0, foco: claves[0].foco ?? 1 };
  for (let i = 1; i < claves.length; i++) {
    const k = claves[i];
    if (f < k.f) {
      // el tramo arranca en la clave anterior
      const a = claves[i - 1];
      const t = spring({ frame: f - a.f, fps, config: { damping: 18, stiffness: 60, mass: 1.1, ...k.resorte }, durationInFrames: Math.max(2, k.f - a.f) });
      return {
        x: interpolate(t, [0, 1], [p.x, k.x]),
        y: interpolate(t, [0, 1], [p.y, k.y]),
        zoom: interpolate(t, [0, 1], [p.zoom, k.zoom]),
        rot: interpolate(t, [0, 1], [p.rot, k.rot ?? p.rot]),
        foco: interpolate(t, [0, 1], [p.foco, k.foco ?? p.foco]),
      };
    }
    p = { x: k.x, y: k.y, zoom: k.zoom, rot: k.rot ?? p.rot, foco: k.foco ?? p.foco };
  }
  return p;
};

// temblor de cámara en mano: amp en px (3-6 = steadicam, 8-14 = en mano nerviosa), seed para que cada plano sea distinto
export const temblor = (f: number, fps: number, amp: number, seed = 0) => {
  const t = f / fps + seed * 17.3;
  const n = (a: number, b: number, c: number) => Math.sin(t * a * 2 * Math.PI + b) * c;
  // 3 octavas lentas (operador) + vibración fina de 4-6 Hz (pulso), sin períodos comunes
  return {
    x: amp * (n(0.31, 1.1, 0.55) + n(0.87, 2.3, 0.3) + n(1.73, 0.4, 0.15) + n(4.7, 0.3, 0.05) + n(5.9, 1.7, 0.03)),
    y: amp * (n(0.23, 0.7, 0.5) + n(0.69, 3.1, 0.32) + n(1.41, 1.9, 0.18) + n(4.3, 2.6, 0.05) + n(6.1, 0.8, 0.03)),
    rot: (amp / 6) * (n(0.19, 2.2, 0.12) + n(0.53, 0.9, 0.06)),
  };
};

// la cámara "siente" un golpe visible: sacudida de amp px que se apaga en ~6 cuadros
export const golpe = (f: number, f0: number, amp = 3) => (f < f0 ? 0 : amp * Math.exp(-(f - f0) / 2.2) * Math.sin((f - f0) * 2.4));
// respiración de lente en primeros planos: escala ±0,3 % a 0,25 Hz
export const respira = (f: number, fps: number) => 1 + 0.003 * Math.sin((f / fps) * 0.25 * 2 * Math.PI);

// Plano: aplica la cámara a sus capas. claves en coordenadas del mundo (px de 1920x1080 alrededor del centro)
export const Plano: React.FC<{ claves: Clave[]; mano?: number; seed?: number; children: React.ReactNode; fondo?: string; extra?: { x?: number; y?: number; zoom?: number } }> = ({ claves, mano = 4, seed = 0, children, fondo = "#000", extra = {} }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = poseEn(claves, f, fps);
  const s = temblor(f, fps, mano, seed);
  return (
    <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
      <Ctx.Provider value={{ x: p.x + s.x + (extra.x ?? 0), y: p.y + s.y + (extra.y ?? 0), zoom: p.zoom * (extra.zoom ?? 1), rot: p.rot + s.rot, foco: p.foco }}>{children}</Ctx.Provider>
    </AbsoluteFill>
  );
};

// Capa: z = profundidad (0 lejos … 1 foco … 1,6 primer término). desenfoqueMax en px a distancia 1 del foco.
export const Capa: React.FC<{ z: number; children: React.ReactNode; desenfoqueMax?: number; style?: React.CSSProperties }> = ({ z, children, desenfoqueMax = 18, style }) => {
  const c = useContext(Ctx);
  const par = 0.35 + 0.65 * z; // cuánto le afecta el movimiento de cámara
  const zoom = 1 + (c.zoom - 1) * par;
  const blur = Math.min(40, Math.abs(z - c.foco) * desenfoqueMax);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${-c.x * par}px, ${-c.y * par}px) rotate(${c.rot * par}deg) scale(${zoom})`,
        transformOrigin: "50% 50%",
        filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
