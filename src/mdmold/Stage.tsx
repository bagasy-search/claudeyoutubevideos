// Stage.tsx — EL ESCENARIO COMPARTIDO del video `mdmold` (canal Mike Dalton, EN).
//
// Se escribe UNA vez, antes de lanzar los subagentes de movimientos, y TODOS lo consumen.
// Objetivo: que seis movimientos escritos por seis manos distintas se lean como el mismo video —
// misma atmósfera, misma cámara, misma luz, mismo vidrio.
//
// ⛔ NADIE edita este archivo. Si un movimiento necesita algo más, lo define en SU propio archivo.
//
// ── EL MUNDO ────────────────────────────────────────────────────────────────────────────────
// Estamos dentro de un baño viejo, de noche, con la luz apagada salvo una fuente fría que entra
// de arriba a la izquierda (la ventanita del baño) y un rebote cálido bajo, de la lámpara del
// pasillo. Todo lo que se muestra —la junta, el sellador, el tanque, la botella— vive en ESE
// espacio. El negro no es un fondo: es el cuarto sin luz.
//
// ── LA PALETA (marca del canal) ─────────────────────────────────────────────────────────────
// NEGRO cinematográfico · acento ROJO (alerta, lo sucio, lo que está vivo) · BLANCO (vidrio,
// estela, lo limpio) · y un VERDE-MOHO desaturado que es el enemigo del video.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

export const MD = {
  ink0: "#0A0A0C",
  ink1: "#141518",
  ink2: "#1E2024",
  red: "#E4322A",
  redHot: "#FF5A4E",
  white: "#FFFFFF",
  bone: "#EDE9E2",
  mold: "#4A5442",     // el verde-negro del moho, desaturado
  moldLit: "#6E7A5E",
  cold: "#9FB6C8",     // la luz fría de la ventanita
  warm: "#C89B6A",     // el rebote cálido del pasillo
  glass: "rgba(255,255,255,0.06)",
  glassEdge: "rgba(255,255,255,0.22)",
};

export const F_SANS = "Inter, system-ui, sans-serif";
export const F_SERIF = "'Playfair Display', Georgia, serif";

// ⚠️ Acepta HEX *y* `rgb(r,g,b)`. Antes sólo parseaba HEX, así que `rgba(light(t,...), .3)` —que
// es lo natural de escribir, porque `light()` devuelve `rgb(...)`— daba `rgba(NaN,NaN,NaN,.3)` y el
// color desaparecía sin error. Lo cazó el movimiento de Chernóbil (25-ago-2026).
export const rgba = (color: string, a: number) => {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (m) return `rgba(${Math.round(+m[1])},${Math.round(+m[2])},${Math.round(+m[3])},${a})`;
  const h = color.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  if (Number.isNaN(n)) return `rgba(255,255,255,${a})`; // nunca devolver NaN: se ve como "no pasa nada"
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const eio = (a: number, b: number, t: number) =>
  lerp(a, b, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
// hash determinístico — ⛔ NADA de Math.random(): el farm rinde en chunks paralelos
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── LA CÁMARA ───────────────────────────────────────────────────────────────────────────────
// Una sola cámara para todo el video. Deriva SIEMPRE del frame GLOBAL del movimiento: nunca
// vuelve a cero entre actos. Devuelve un transform listo para el contenedor de escena.
//
//   const c = cam(frame, { z0: 0, z1: 140, panX: -60, ry: 5 });
//   <div style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
//
// `drift` es la respiración: nunca queda nada perfectamente quieto (regla del canal).
export const cam = (
  frame: number,
  o: { z0?: number; z1?: number; panX?: number; panY?: number; ry?: number; rx?: number; dur?: number } = {},
) => {
  const { z0 = 0, z1 = 120, panX = 0, panY = 0, ry = 0, rx = 0, dur = 900 } = o;
  const t = clamp01(frame / dur);
  const e = interpolate(t, [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) });
  const bx = Math.sin(frame / 47) * 2.2 + Math.sin(frame / 111) * 1.4; // deriva viva
  const by = Math.cos(frame / 61) * 1.8;
  const z = lerp(z0, z1, e);
  return {
    z,
    e,
    transform:
      `perspective(1400px) translateZ(${z.toFixed(2)}px) ` +
      `translate3d(${(panX * e + bx).toFixed(2)}px, ${(panY * e + by).toFixed(2)}px, 0) ` +
      `rotateY(${(ry * e).toFixed(3)}deg) rotateX(${(rx * e).toFixed(3)}deg)`,
  };
};

// ── LA LUZ ──────────────────────────────────────────────────────────────────────────────────
// `t` 0→1 recorre el movimiento. La temperatura EVOLUCIONA, no salta: arranca fría (ventanita)
// y puede virar a roja (alerta) o a cálida (resuelto). Cada movimiento declara su viaje.
export const light = (t: number, from: "cold" | "warm" | "red" = "cold", to: "cold" | "warm" | "red" = "cold") => {
  const C = { cold: MD.cold, warm: MD.warm, red: MD.red } as const;
  const mix = (a: string, b: string, k: number) => {
    const p = (h: string) => {
      const x = parseInt(h.replace("#", ""), 16);
      return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
    };
    const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b);
    return `rgb(${Math.round(lerp(r1, r2, k))},${Math.round(lerp(g1, g2, k))},${Math.round(lerp(b1, b2, k))})`;
  };
  return mix(C[from], C[to], clamp01(t));
};

// ── LA ATMÓSFERA ────────────────────────────────────────────────────────────────────────────
// Se monta UNA vez por movimiento, al fondo, y NUNCA se remonta entre actos. Es lo que hace que
// cinco actos se lean como un solo espacio: el mismo aire, el mismo piso, el mismo grano.
//
// `keyFrom` mueve la fuente de luz principal (0 = arriba izquierda, 1 = arriba derecha) para que
// la luz pueda VIAJAR a lo largo del movimiento sin que el fondo se corte.
export const Atmos: React.FC<{
  tint?: string;
  keyFrom?: number;
  intensity?: number;
  floor?: boolean;
}> = ({ tint = MD.cold, keyFrom = 0.22, intensity = 1, floor = true }) => {
  const frame = useCurrentFrame();
  const kx = (18 + keyFrom * 64).toFixed(1);
  const breathe = 0.92 + Math.sin(frame / 84) * 0.06;
  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* haz frío de la ventanita — la fuente principal */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at ${kx}% -10%, ${rgba(tint, 0.20 * intensity * breathe)} 0%, ${rgba(tint, 0.06 * intensity)} 34%, rgba(0,0,0,0) 66%)`,
        }}
      />
      {/* rebote cálido bajo, del pasillo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 60% at 88% 112%, ${rgba(MD.warm, 0.13 * intensity)} 0%, rgba(0,0,0,0) 60%)`,
        }}
      />
      {/* piso: la sombra de contacto que aterriza los objetos */}
      {floor && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 16%, rgba(0,0,0,0) 34%)",
          }}
        />
      )}
      {/* viñeta */}
      <AbsoluteFill
        style={{ background: "radial-gradient(85% 70% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.62) 100%)" }}
      />
      {/* grano fino determinístico */}
      <AbsoluteFill style={{ opacity: 0.055, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="mdgrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={7} />
          </filter>
          <rect width="100%" height="100%" filter="url(#mdgrain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VIDRIO ──────────────────────────────────────────────────────────────────────────────────
// ⛔ Sin `backdrop-filter` (×5 el tiempo de render en el farm). El vidrio se arma con gradientes,
// borde, bisel interno y sombra de contacto. Todos los movimientos usan ESTE vidrio.
export const glassStyle = (o: { radius?: number; lit?: number } = {}): React.CSSProperties => {
  const { radius = 18, lit = 1 } = o;
  return {
    borderRadius: radius,
    background: `linear-gradient(148deg, rgba(255,255,255,${0.10 * lit}) 0%, rgba(255,255,255,${0.03 * lit}) 38%, rgba(255,255,255,${0.06 * lit}) 100%)`,
    border: `1px solid ${rgba(MD.white, 0.20 * lit)}`,
    boxShadow: [
      `inset 0 1px 0 ${rgba(MD.white, 0.30 * lit)}`,
      `inset 0 -1px 0 ${rgba(MD.white, 0.06 * lit)}`,
      `0 26px 60px rgba(0,0,0,0.62)`,
      `0 2px 0 rgba(0,0,0,0.5)`,
    ].join(", "),
  };
};

// Barrido especular que cruza una superficie de vidrio (para el hold vivo).
export const Sheen: React.FC<{ at: number; dur?: number; angle?: number }> = ({ at, dur = 26, angle = 18 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 58%)`,
        transform: `translateX(${interpolate(p, [0, 1], [-120, 120])}%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ── TIPOGRAFÍA DEL VIDEO ────────────────────────────────────────────────────────────────────
// Una idea de texto por acto. Titular ≤7 palabras. La palabra emocional va en serif itálica.
// Legibilidad: titular ≥48px, detalle ≥30px, SIEMPRE con cama oscura debajo.
export const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = MD.red }) => (
  <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3.4, textTransform: "uppercase", color }}>
    {children}
  </div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children, size = 74, color = MD.white,
}) => (
  <div
    style={{
      fontFamily: F_SANS, fontWeight: 800, fontSize: size, lineHeight: 1.04, color,
      textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)",
    }}
  >
    {children}
  </div>
);

export const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = MD.redHot }) => (
  <span style={{ fontFamily: F_SERIF, fontStyle: "italic", fontWeight: 500, color }}>{children}</span>
);

// Cama oscura obligatoria bajo cualquier texto que caiga sobre imagen/video.
export const TextBed: React.FC<{ children: React.ReactNode; pad?: number; w?: number | string }> = ({
  children, pad = 26, w = "auto",
}) => (
  <div
    style={{
      width: w, padding: pad, borderRadius: 14,
      background: "linear-gradient(180deg, rgba(6,6,8,0.86) 0%, rgba(6,6,8,0.66) 100%)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    }}
  >
    {children}
  </div>
);

// ── COSTURAS ────────────────────────────────────────────────────────────────────────────────
// Helpers para las fronteras entre actos. ⛔ NUNCA un fade a negro.
//
// OCLUSIÓN: algo grande cruza y **tapa el 100% durante 3-6 frames**. Esos frames tapados son el
// lugar donde se cambia de acto: el espectador no ve el cambio, ve pasar un objeto.
//
// ⛔ BUG CORREGIDO (lo encontró el movimiento del tanque, 25-ago-2026): la primera versión medía
// 180% de ancho y barría de −140% a +140% *sobre su propio ancho*, así que la cobertura total
// duraba ~1 frame de 22 — y los CINCO movimientos que la usaban para tapar un corte estaban
// mostrando el salto. Ahora la banda mide 300% de la PANTALLA y se mueve en coordenadas de
// pantalla: tapa entera mientras su borde izquierdo está fuera por izquierda y el derecho por
// derecha, que con estos números son ~40% del barrido.
export const Occluder: React.FC<{ at: number; dur?: number; color?: string; angle?: number }> = ({
  at, dur = 14, color = MD.ink1, angle = 8,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const W = 300; // ancho de la banda, en % de la pantalla
  // recorre de "toda afuera por la derecha" a "toda afuera por la izquierda" pasando por el
  // tramo en que cubre de punta a punta (left ≤ 0 y left+W ≥ 100)
  const left = interpolate(p, [0, 1], [110, -(W + 10)], { easing: Easing.bezier(0.36, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-30%", height: "160%",
          left: `${left}%`, width: `${W}%`,
          transform: `rotate(${angle}deg)`,
          // bordes apenas plumeados: si los degradados son anchos, nunca hay cobertura real
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color} 4%, ${color} 96%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 120px 40px ${rgba(color, 0.5)}`,
        }}
      />
    </AbsoluteFill>
  );
};

// WIPE POR MATERIA: vapor/agua cruza y detrás ya está lo nuevo.
export const VaporWipe: React.FC<{ at: number; dur?: number }> = ({ at, dur = 20 }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-60, 60]);
  const o = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o }}>
      {Array.from({ length: 7 }, (_, i) => {
        const s = rnd(i * 3.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + i * 16 - 20}%`,
              top: `${8 + s * 70}%`,
              width: `${28 + s * 34}%`,
              height: `${22 + s * 30}%`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(MD.white, 0.10)} 0%, rgba(255,255,255,0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
