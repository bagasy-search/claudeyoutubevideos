// Cámara orgánica para escenas 2D en código: lo que hace que el movimiento no se sienta "agregado en edición".
// - Keyframes con resorte (inercia + overshoot leve), nunca lineales.
// - Temblor de mano = suma de senos de frecuencias que no se repiten (0,23-1,7 Hz), amplitud en px reales.
// - Paralaje: cada capa se mueve según su profundidad (z=0 fondo lejano, z=1 plano de foco, z>1 primer término).
// - Foco: cada capa se desenfoca según su distancia al plano de foco (rack focus animable).
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Pose = { x: number; y: number; zoom: number; rot?: number; foco?: number };
// curva: en vez de resorte, tramo con easing y zoom LOGARÍTMICO (empujes enormes que aceleran o frenan parejo)
export type Clave = Pose & { f: number; resorte?: { damping?: number; stiffness?: number; mass?: number }; curva?: "in" | "out" | "inout" };

// Desfase de cuadro: un plano puede arrancar ANTES de su corte (entrada encimada) y seguir DESPUÉS (salida).
// useF() = cuadro local respecto del corte nominal (negativo durante la entrada).
export const OffsetCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(OffsetCtx);
const curvas = { in: Easing.in(Easing.cubic), out: Easing.out(Easing.cubic), inout: Easing.inOut(Easing.cubic) };

type Estado = { x: number; y: number; zoom: number; rot: number; foco: number; fondo?: string };
const Ctx = createContext<Estado>({ x: 0, y: 0, zoom: 1, rot: 0, foco: 1 });

// posición de cámara en el cuadro f: cada tramo entre claves avanza con un resorte (llega con inercia, rebota apenas)
export const poseEn = (claves: Clave[], f: number, fps: number): Estado => {
  let p: Estado = { x: claves[0].x, y: claves[0].y, zoom: claves[0].zoom, rot: claves[0].rot ?? 0, foco: claves[0].foco ?? 1 };
  for (let i = 1; i < claves.length; i++) {
    const k = claves[i];
    if (f < k.f) {
      // el tramo arranca en la clave anterior
      const a = claves[i - 1];
      if (k.curva) {
        const u = interpolate(f, [a.f, k.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curvas[k.curva] });
        const z = Math.exp(interpolate(u, [0, 1], [Math.log(p.zoom), Math.log(k.zoom)]));
        // x,y siguen al zoom: así el punto apuntado queda clavado mientras el zoom crece geométricamente
        const w = (z - p.zoom) / (k.zoom - p.zoom || 1);
        const r = Math.abs(k.zoom - p.zoom) > 0.01 ? w : u;
        return {
          x: p.x + (k.x - p.x) * r, y: p.y + (k.y - p.y) * r, zoom: z,
          rot: p.rot + ((k.rot ?? p.rot) - p.rot) * u, foco: p.foco + ((k.foco ?? p.foco) - p.foco) * u,
        };
      }
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
  const f = useF();
  const { fps } = useVideoConfig();
  const p = poseEn(claves, f, fps);
  const s = temblor(f, fps, mano, seed);
  // motion blur de obturador: la velocidad de cámara de este cuadro (px/cuadro en el plano de foco) se vuelve desenfoque
  // direccional. Medio obturador (180°) = la mitad del recorrido del cuadro. Sólo se activa en movimientos rápidos.
  // en el primer cuadro (antes de la 1ª clave no hay pasado) se mide hacia adelante: el plano entra YA en movimiento
  const q = f - 1 < claves[0].f ? poseEn(claves, f + 1, fps) : poseEn(claves, f - 1, fps);
  const vx = Math.abs(p.x - q.x), vy = Math.abs(p.y - q.y);
  const sx = Math.min(60, vx * 0.5), sy = Math.min(60, vy * 0.5);
  const mb = sx > 1.5 || sy > 1.5;
  const id = `mb${seed}`;
  return (
    <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
      {mb && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${sx.toFixed(1)} ${sy.toFixed(1)}`} edgeMode="duplicate" /></filter>
        </svg>
      )}
      <AbsoluteFill style={{ filter: mb ? `url(#${id})` : undefined }}>
        <Ctx.Provider value={{ x: p.x + s.x + (extra.x ?? 0), y: p.y + s.y + (extra.y ?? 0), zoom: p.zoom * (extra.zoom ?? 1), rot: p.rot + s.rot, foco: p.foco, fondo }}>{children}</Ctx.Provider>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Capa: z = profundidad (0 lejos … 1 foco … 1,6 primer término). desenfoqueMax = cuánta profundidad atmosférica a distancia 1.
// SIN filter: blur. En el farm (swangle) cualquier blur CSS en capas grandes corrompe las teselas del compositor
// (franjas con pedazos de otra parte del cuadro) aunque vaya en un nodo hijo. La profundidad se da con BRUMA:
// las capas detrás del foco se funden hacia el color de fondo del plano (como las referencias: fondo apagado, personajes nítidos).
export const Capa: React.FC<{ z: number; children: React.ReactNode; desenfoqueMax?: number; style?: React.CSSProperties }> = ({ z, children, desenfoqueMax = 18, style }) => {
  const c = useContext(Ctx);
  const par = Math.max(0.05, z); // cuánto le afecta el movimiento de cámara (cielo ~5 %, primer término >100 %)
  const zoom = 1 + (c.zoom - 1) * par;
  // la transform del style se COMPONE con la de cámara (antes la pisaba: la capa perdía el paralaje)
  const { transform: tExtra, ...resto } = style ?? {};
  // bruma sólo detrás del foco (la capa de bruma tapa lo que hay debajo = sólo capas aún más lejanas)
  const bruma = z < c.foco ? Math.min(0.45, (c.foco - z) * desenfoqueMax * 0.03) : 0;
  return (
    <>
      <AbsoluteFill
        style={{
          transform: `translate(${-c.x * par}px, ${-c.y * par}px) rotate(${c.rot * par}deg) scale(${zoom})${tExtra ? " " + tExtra : ""}`,
          transformOrigin: "50% 50%",
          ...resto,
        }}
      >
        {children}
      </AbsoluteFill>
      {bruma > 0.02 && <AbsoluteFill style={{ background: c.fondo ?? "#000", opacity: bruma, pointerEvents: "none" }} />}
    </>
  );
};
