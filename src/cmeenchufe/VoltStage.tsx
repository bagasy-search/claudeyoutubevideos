// VoltStage.tsx — ESCENARIO COMPARTIDO del video `cmeenchufe`
// (canal Claudio Mendoza Constructor, ES · "Bateria Enchufable / factura -60% SIN paneles").
//
// Se escribe UNA vez, ANTES de lanzar los subagentes de movimientos, y TODOS lo consumen. Es lo que
// hace que 23 movimientos escritos por agentes distintos se lean como UN video: la misma
// perspectiva, el mismo suelo, la misma atmósfera, el mismo grade y las mismas primitivas de material.
//
// ⛔ LA REGLA QUE MANDA ACÁ: **una tarjeta que es sólo una forma con texto se lee como CÓDIGO EN
// PANTALLA.** Adentro de cada tarjeta va MATERIAL REAL — un clip corriendo (`MediaCard kind="video"`)
// o una foto (`kind="photo"`) — con su marco, su sombra de contacto y su profundidad. Los vectores
// quedan para lo que ES un gráfico (un eje, una curva, una flecha), NUNCA para hacer de objeto real.
//
// EL ESCENARIO DE ESTE VIDEO (lo comparten los 23 movimientos):
//   El GARAJE de Claudio, de noche, visto como un plato negro. El suelo es cemento alisado con polvo;
//   el fondo es la pared de bloques y el porton levadizo entreabierto, por donde entra una franja de
//   luz FRIA de la calle que cruza el piso. Colgada arriba, una lampara desnuda.
//   Hay DOS luces que se disputan la escena y definen el arco del video entero:
//     - la KEY VOLTIO (#C8F000), fria, arriba a la izquierda  = LA MEDICION (la pinza, el dato duro)
//     - el CONTRA AMBAR (#FFC83D), calido, abajo a la derecha = LA FACTURA (el dinero, la casa)
//   REGLA DE DIRECCION DE LUZ: todo lo que sea "la compania de luz" / lo que te cobran entra
//   desde ARRIBA y en FRIO. Todo lo que sea "lo que te queda" entra desde ABAJO y en CALIDO.
//   En la noche del apagon la unica fuente pasa a ser el haz blanco (`torch`). La luz EVOLUCIONA
//   a lo largo del video, no salta entre movimientos.
//
//   OBJETO PROTAGONISTA: la CAJA GRIS con rueditas (la bateria enchufable). Aparece o se insinua en
//   todos los movimientos: es la sombra en la pared, el bloque del que sale un grafico, lo que la
//   camara rodea. Segundo objeto recurrente: la PINZA AMPERIMETRICA, la firma del canal.
//
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing,
} from "remotion";
import { F_OSWALD, F_INTER } from "../VideoEdit/kit/premium/theme";

// ── PALETA / TIPOGRAFÍA ─────────────────────────────────────────────────────────────────────
export const V = {
  ink0: "#0A0B08",       // negro oliva del canal (bg0 de THEME_VOLT)
  ink1: "#12140D",
  ink2: "#1C2015",
  volt: "#C8F000",       // verde-voltio — el acento del canal, la MEDICIÓN
  voltSoft: "#8FAD00",
  amber: "#FFC83D",      // ámbar — el dinero, la factura, la casa
  danger: "#FF6A3D",
  white: "#F2F4E9",
  bone: "#E8E8E0",
  torch: "#FFF4D6",      // el haz blanco-cálido de la linterna (noche del apagón)
  sky: "#8FA9BC",        // el gris azulado del cielo cubierto
  concrete: "#7E7D74",   // la losa del patio: la MATERIA para las oclusiones
  blade: "#E9E9E4",      // el plástico blanco de las palas: la otra MATERIA
};
export const F_DISPLAY = F_OSWALD;
export const F_BODY = F_INTER;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eio = (a: number, b: number, t: number) =>
  lerp(a, b, interpolate(clamp01(t), [0, 1], [0, 1], { easing: Easing.bezier(0.22, 0.61, 0.28, 1) }));
// hash determinístico: reemplaza a Math.random() (obligatorio, el farm rinde en paralelo)
export const rnd = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const rgba = (hex: string, a: number) => {
  if (!hex) return `rgba(0,0,0,${a})`;
  // un color que YA es rgba(...) no matchea /rgb\(/ y caia al parseInt -> NaN -> color roto.
  const m = hex.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/i);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${a})`;
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const x = parseInt(h, 16);
  if (!Number.isFinite(x)) return `rgba(0,0,0,${a})`;
  return `rgba(${(x >> 16) & 255},${(x >> 8) & 255},${x & 255},${a})`;
};

// ── LA CÁMARA ───────────────────────────────────────────────────────────────────────────────
// Función del frame GLOBAL del movimiento. El acto 3 hereda la posición y la inercia del acto 2
// porque LA MISMA llamada sigue avanzando: ningún acto la reinicia.
// `dur` es el tramo sobre el que viaja; después de `dur` queda en su destino (con deriva viva).
export const gcam = (
  frame: number,
  o: { z0?: number; z1?: number; panX?: number; panY?: number; ry?: number; rx?: number; dur?: number } = {},
) => {
  const { z0 = 0, z1 = 160, panX = 0, panY = 0, ry = 0, rx = 0, dur = 900 } = o;
  const t = clamp01(frame / dur);
  const e = interpolate(t, [0, 1], [0, 1], { easing: Easing.bezier(0.19, 0.63, 0.26, 1) });
  // deriva viva: nunca hay un frame perfectamente quieto (regla del hold VIVO)
  const bx = Math.sin(frame / 49) * 2.1 + Math.sin(frame / 113) * 1.3;
  const by = Math.cos(frame / 63) * 1.7;
  const z = lerp(z0, z1, e);
  return {
    z, e,
    transform:
      `perspective(1500px) translateZ(${z.toFixed(2)}px) ` +
      `translate3d(${(panX * e + bx).toFixed(2)}px, ${(panY * e + by).toFixed(2)}px, 0) ` +
      `rotateY(${(ry * e).toFixed(3)}deg) rotateX(${(rx * e).toFixed(3)}deg)`,
  };
};

// ── LA LUZ ──────────────────────────────────────────────────────────────────────────────────
// Las cuatro temperaturas del video. `light(t, from, to)` interpola: la luz EVOLUCIONA, no salta.
// ⛔ `light()` conocia SOLO 4 colores y `C[from]` devolvia undefined para cualquier otro nombre de la
// paleta -> `undefined.replace()` -> el chunk MUERE. Paso: `light(cold, "bone", "sky")` en MovS2A tiro
// el chunk 10 de 60, y `tsc` NO lo ve. Ahora conoce TODA la paleta y ante un nombre desconocido cae al
// blanco en vez de reventar.
export type Lum = keyof typeof V;
export const light = (t: number, from: Lum = "volt", to: Lum = "volt") => {
  const p = (h: string) => {
    const hex = typeof h === "string" && h.startsWith("#") ? h : V.white;
    const x = parseInt(hex.replace("#", ""), 16);
    return Number.isFinite(x) ? [(x >> 16) & 255, (x >> 8) & 255, x & 255] : [242, 244, 233];
  };
  const [r1, g1, b1] = p(V[from]), [r2, g2, b2] = p(V[to]);
  const k = clamp01(t);
  return `rgb(${Math.round(lerp(r1, r2, k))},${Math.round(lerp(g1, g2, k))},${Math.round(lerp(b1, b2, k))})`;
};

// ── LA ATMÓSFERA ────────────────────────────────────────────────────────────────────────────
// Se monta UNA vez por movimiento, al fondo, y NUNCA se remonta entre actos.
// `keyFrom` corre la key de izquierda (0) a derecha (1); `tint`/`tint2` son las dos luces.
export const VoltAtmos: React.FC<{
  tint?: string; tint2?: string; keyFrom?: number; intensity?: number; floor?: number;
}> = ({ tint = V.volt, tint2 = V.amber, keyFrom = 0.22, intensity = 1, floor = 0.55 }) => {
  const frame = useCurrentFrame();
  const kx = (14 + keyFrom * 70).toFixed(1);
  const breathe = 0.93 + Math.sin(frame / 87) * 0.055;
  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* KEY VOLTIO: la medición */}
      <AbsoluteFill style={{ background: `radial-gradient(122% 94% at ${kx}% -10%, ${rgba(tint, 0.19 * intensity * breathe)} 0%, ${rgba(tint, 0.055 * intensity)} 33%, rgba(0,0,0,0) 66%)` }} />
      {/* CONTRA ÁMBAR: la factura, la casa */}
      <AbsoluteFill style={{ background: `radial-gradient(92% 72% at 90% 110%, ${rgba(tint2, 0.11 * intensity)} 0%, rgba(0,0,0,0) 62%)` }} />
      {/* el suelo del patio: la sombra de contacto de todo lo que flota aterriza acá */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,${floor}) 100%)` }} />
      {/* polvo fino suspendido: el aire del patio nunca está limpio */}
      <AbsoluteFill style={{ opacity: 0.5 * intensity }}>
        {Array.from({ length: 26 }, (_, i) => {
          const sp = 0.25 + rnd(i * 5.3) * 0.9;
          const yy = (rnd(i * 2.7) * 118 - (frame * sp) / 18) % 118;
          return (
            <div key={i} style={{
              position: "absolute", left: `${(rnd(i * 9.1) * 100).toFixed(2)}%`, top: `${(yy + 118) % 118 - 9}%`,
              width: 2 + rnd(i * 3.3) * 2.4, height: 2 + rnd(i * 3.3) * 2.4, borderRadius: "50%",
              background: rgba(V.white, 0.1 + rnd(i * 6.6) * 0.16),
            }} />
          );
        })}
      </AbsoluteFill>
      {/* grano constante: la misma piel de imagen en todos los actos */}
      <AbsoluteFill style={{ opacity: 0.045, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

// ── EL VIENTO — la firma visual de ESTE video ───────────────────────────────────────────────
// Estrías finas que cruzan el aire. `speed` es literal: 0 = patio quieto (1,9 m/s), 1 = temporal.
// Se usa para que el espectador VEA la diferencia entre "hay brisa" y "hay viento de verdad".
export const WindField: React.FC<{ speed: number; tint?: string; count?: number; opacity?: number }> = ({
  speed, tint = V.white, count = 22, opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const s = clamp01(speed);
  if (s <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: opacity * (0.25 + 0.75 * s) }}>
      {Array.from({ length: count }, (_, i) => {
        const yy = rnd(i * 4.1) * 104 - 2;
        const len = 90 + rnd(i * 8.2) * 320 * (0.4 + s);
        const sp = (1.6 + rnd(i * 2.2) * 2.4) * (0.5 + s * 3.2);
        const xx = ((rnd(i * 6.4) * 150 + frame * sp) % 190) - 45;
        const a = (0.08 + rnd(i * 7.7) * 0.2) * (0.35 + s);
        return (
          <div key={i} style={{
            position: "absolute", top: `${yy}%`, left: `${xx.toFixed(2)}%`,
            width: len, height: 1.5,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(tint, a)} 40%, rgba(0,0,0,0))`,
            transform: `rotate(${(-3 - rnd(i * 3.9) * 5).toFixed(2)}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── PROFUNDIDAD REAL: planos con parallax propio ────────────────────────────────────────────
export const Layers: React.FC<{ children: React.ReactNode; cam: string }> = ({ children, cam }) => (
  <AbsoluteFill style={{ transform: cam, transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}>
    {children}
  </AbsoluteFill>
);
export const Plane: React.FC<{ z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ z, children, style }) => (
  <AbsoluteFill style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d", ...style }}>{children}</AbsoluteFill>
);

// ── ⭐ MEDIA CARD — LA TARJETA FLOTANTE CON MATERIAL REAL ADENTRO ────────────────────────────
// Ésta es la primitiva que separa "premium" de "código en pantalla". Adentro va un CLIP o una FOTO.
// Trae: marco de vidrio, bisel, reflejo superior, barrido especular, sombra de contacto que aterriza
// en el suelo de la atmósfera, y micro-deriva (hold vivo).
export const MediaCard: React.FC<{
  src: string;                      // ej: broll/cmeenchufe/<nombre>.mp4  |  img/cmeenchufe/<nombre>.png
  kind?: "video" | "photo";
  w?: number; h?: number;
  x?: number; y?: number;           // % de pantalla (centro de la tarjeta)
  z?: number;                       // profundidad en el espacio 3D
  ry?: number; rx?: number; rot?: number;
  radius?: number;
  startFrom?: number;               // frame de entrada dentro del clip
  lit?: number;                     // 0..1 cuánto la ilumina la key
  litColor?: string;                // con qué luz (volt / amber / torch)
  label?: string;                   // rótulo bajo la tarjeta (opcional)
  sheenAt?: number;                 // frame del barrido especular
  grade?: boolean;                  // grade del canal encima del material
  opacity?: number;
}> = ({
  src, kind = "video", w = 520, h = 300, x = 50, y = 50, z = 0,
  ry = 0, rx = 0, rot = 0, radius = 14, startFrom = 0, lit = 1, litColor = V.volt, label,
  sheenAt = -999, grade = true, opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 41 + x) * 2.4;         // hold VIVO: nunca perfectamente quieta
  const driftR = Math.sin(frame / 67 + y) * 0.5;
  const sheen = sheenAt > -900 ? clamp01((frame - sheenAt) / 26) : -1;
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
        transform: `translateZ(${z}px) rotateY(${(ry + driftR).toFixed(2)}deg) rotateX(${rx}deg) rotate(${rot}deg) translateY(${drift.toFixed(2)}px)`,
        transformStyle: "preserve-3d",
        borderRadius: radius,
        opacity,
        // sombra de contacto que ATERRIZA (iluminación de producto) + sombra ambiental
        boxShadow: `0 ${Math.round(h * 0.16)}px ${Math.round(h * 0.22)}px ${rgba(V.ink0, 0.74)}, 0 4px 16px ${rgba(V.ink0, 0.6)}`,
        overflow: "hidden",
        // el marco de vidrio: bisel por inset, NUNCA backdrop-filter
        border: `1px solid ${rgba(litColor, 0.26 * lit)}`,
      }}
    >
      {kind === "video" ? (
        <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {grade && <AbsoluteFill style={{ background: rgba(litColor, 0.055), mixBlendMode: "soft-light" }} />}
      {/* bisel + reflejo superior del vidrio */}
      <AbsoluteFill style={{ boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.3 * lit)}, inset 0 0 ${Math.round(h * 0.2)}px ${rgba(V.ink0, 0.5)}` }} />
      <AbsoluteFill style={{ background: `linear-gradient(178deg, ${rgba(V.white, 0.13 * lit)} 0%, rgba(255,255,255,0) 26%)` }} />
      {/* barrido especular: la tarjeta se lee como VIDRIO, no como recorte */}
      {sheen >= 0 && sheen <= 1 && (
        <AbsoluteFill style={{
          background: `linear-gradient(104deg, rgba(255,255,255,0) 38%, ${rgba(V.white, 0.24)} 50%, rgba(255,255,255,0) 62%)`,
          transform: `translateX(${lerp(-130, 130, sheen).toFixed(1)}%)`, mixBlendMode: "screen",
        }} />
      )}
      {label && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 16px 10px",
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.88) 62%)",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 23, letterSpacing: 1.8,
          color: V.white, textTransform: "uppercase",
        }}>{label}</div>
      )}
    </div>
  );
};

// ── CARRUSEL 3D REAL de MediaCards ──────────────────────────────────────────────────────────
// Las tarjetas orbitan en un cilindro real (rotateY + translateZ), no un abanico 2D.
export const Carousel3D: React.FC<{
  items: { src: string; kind?: "video" | "photo"; label?: string }[];
  spin: number;        // 0..1 → vuelta completa
  radius?: number;
  cardW?: number; cardH?: number;
  y?: number;
  focus?: number;      // índice que recibe la key
  litColor?: string;
}> = ({ items, spin, radius = 620, cardW = 420, cardH = 250, y = 50, focus = 0, litColor = V.volt }) => {
  const n = Math.max(1, items.length);
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      {items.map((it, i) => {
        const a = (i / n) * 360 + spin * 360;
        const rad = (a * Math.PI) / 180;
        const zz = Math.cos(rad) * radius;
        const xx = Math.sin(rad) * radius;
        const depth = (zz + radius) / (2 * radius);       // 0 atrás · 1 adelante
        return (
          <MediaCard
            key={i}
            src={it.src} kind={it.kind} label={it.label}
            w={cardW} h={cardH}
            x={50 + (xx / 1920) * 100} y={y}
            z={zz}
            ry={-a}
            lit={0.35 + 0.65 * depth}
            litColor={litColor}
            opacity={0.28 + 0.72 * depth}
            sheenAt={i === focus ? 0 : -999}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── FOTO/CLIP A SANGRE como plano de fondo (con parallax y grade del canal) ─────────────────
export const PhotoPlane: React.FC<{
  src: string; z?: number; scale?: number; dim?: number; kind?: "video" | "photo"; startFrom?: number; tint?: string;
}> = ({ src, z = -400, scale = 1.18, dim = 0.44, kind = "photo", startFrom = 0, tint = V.volt }) => {
  const frame = useCurrentFrame();
  const px = Math.sin(frame / 121) * 8;
  return (
    <AbsoluteFill style={{ transform: `translateZ(${z}px) translateX(${px.toFixed(1)}px) scale(${scale})`, overflow: "hidden" }}>
      {kind === "video"
        ? <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      <AbsoluteFill style={{ background: `rgba(10,11,8,${dim})` }} />
      <AbsoluteFill style={{ background: rgba(tint, 0.05), mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};

// ── ÍCONO/LOGO PNG SIN FONDO como objeto de la escena ───────────────────────────────────────
export const IconPng: React.FC<{
  src: string; x: number; y: number; size?: number; z?: number; opacity?: number; rot?: number; glow?: string;
}> = ({ src, x, y, size = 120, z = 0, opacity = 1, rot = 0, glow = V.ink0 }) => {
  const frame = useCurrentFrame();
  return (
    <Img src={staticFile(src)} style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: "auto",
      marginLeft: -size / 2, opacity,
      transform: `translateZ(${z}px) rotate(${rot}deg) translateY(${(Math.sin(frame / 53 + x) * 3).toFixed(2)}px)`,
      filter: `drop-shadow(0 12px 26px ${rgba(glow, 0.8)})`,
    }} />
  );
};

// ── LA LECTURA DE LA PINZA — la cifra que SALTA a su valor ──────────────────────────────────
// El instrumento se ve en el material real; el NÚMERO lo escribe el kit con tipografía de verdad
// (ningún motor de imagen escribe cifras legibles). `at` es el frame exacto del salto.
export const Readout: React.FC<{
  value: string; unit?: string; label?: string; at?: number;
  x?: number; y?: number; size?: number; color?: string; align?: "left" | "center" | "right";
}> = ({ value, unit, label, at = 0, x = 50, y = 50, size = 128, color = V.volt, align = "center" }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / 9);
  if (frame < at - 1) return null;
  const pop = 1 + (1 - p) * 0.16;
  const jitter = p < 1 ? (rnd(frame * 1.7) - 0.5) * 3 * (1 - p) : 0;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) scale(${pop.toFixed(3)})`,
      textAlign: align, whiteSpace: "nowrap",
    }}>
      {label && (
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(size * 0.2), letterSpacing: 3.6,
          color: rgba(V.white, 0.66), textTransform: "uppercase", marginBottom: 6,
          textShadow: "0 4px 18px rgba(0,0,0,0.9)",
        }}>{label}</div>
      )}
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.92, color,
        textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.42 * p)}, 0 6px 26px rgba(0,0,0,0.92)`,
        transform: `translateX(${jitter.toFixed(2)}px)`,
      }}>
        {value}
        {unit && <span style={{ fontSize: Math.round(size * 0.34), marginLeft: 10, color: rgba(color, 0.82) }}>{unit}</span>}
      </div>
    </div>
  );
};

// ── LA ESCENA CASI BLANCA (pedido literal del creador) ──────────────────────────────────────
// "una escena limpia, casi blanca, sencilla pero hermosa". Papel cálido, sombra suavísima, un solo
// objeto y una sola cifra. Se usa para precios, envíos y comparaciones de dinero.
export const WhiteRoom: React.FC<{ children: React.ReactNode; at?: number; dur?: number; tint?: string }> = ({
  children, at = 0, dur = 12, tint = V.amber,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  return (
    <AbsoluteFill style={{ opacity: p, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(168deg, #FBFAF5 0%, #F1EFE6 58%, #E4E1D5 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(80% 62% at 22% 6%, ${rgba(tint, 0.16)} 0%, rgba(0,0,0,0) 60%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 118%, rgba(120,116,100,0.20) 0%, rgba(0,0,0,0) 58%)" }} />
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px", mixBlendMode: "multiply" }} />
      {children}
    </AbsoluteFill>
  );
};

// ── COSTURAS (⛔ NUNCA un fade) ──────────────────────────────────────────────────────────────
// OCLUSIÓN: algo grande cruza y tapa el 100% durante 3-6 frames. Ahí se cambia de acto.
// ⛔ el `color` es el de LA MATERIA que cruza (hormigón, chapa, pala blanca), NUNCA el del fondo:
//    con el color del fondo esto hace un fundido a negro que SE VE.
export const SeamOcclude: React.FC<{ at: number; dur?: number; color?: string; angle?: number }> = ({
  at, dur = 14, color = V.concrete, angle = 8,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-60%", left: `${lerp(-170, 170, p).toFixed(1)}%`,
        width: "320%", height: "220%",
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${color} 10%, ${color} 90%, rgba(0,0,0,0) 100%)`,
        transform: `rotate(${angle}deg)`,
      }} />
    </AbsoluteFill>
  );
};
// WIPE POR MATERIA: polvo / lluvia / hojas cruzan y detrás ya está lo nuevo.
export const SeamWipeMatter: React.FC<{ at: number; dur?: number; tint?: string }> = ({ at, dur = 20, tint = V.concrete }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const puffs = 14;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: puffs }, (_, i) => {
        const o = rnd(i * 3.1);
        const yy = 12 + rnd(i * 7.7) * 76;
        return (
          <div key={i} style={{
            position: "absolute", top: `${yy}%`, left: `${lerp(-30, 130, clamp01(p * 1.5 - o * 0.4)).toFixed(1)}%`,
            width: 240 + o * 260, height: 240 + o * 260, borderRadius: "50%",
            background: `radial-gradient(circle, ${rgba(tint, 0.22 * Math.sin(p * Math.PI))}, rgba(0,0,0,0) 68%)`,
            filter: "blur(14px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
// ZOOM-THROUGH: la cámara entra en un detalle y sale en la escena siguiente.
// Devuelve el `transform` que hay que aplicarle al acto que SALE (escala hacia el punto).
export const zoomThrough = (frame: number, at: number, dur = 18, fx = 50, fy = 50) => {
  const p = clamp01((frame - at) / dur);
  if (p <= 0) return { out: "none", opacity: 1, done: false };
  const s = lerp(1, 7.5, interpolate(p, [0, 1], [0, 1], { easing: Easing.bezier(0.6, 0, 0.9, 0.4) }));
  return {
    out: `translate(${((50 - fx) * (s - 1)).toFixed(2)}%, ${((50 - fy) * (s - 1)).toFixed(2)}%) scale(${s.toFixed(3)})`,
    opacity: clamp01(1 - (p - 0.62) / 0.32),
    done: p >= 1,
  };
};
// FLASH ÓPTICO corto (corte por beat). No es un fade: dura 3-6 frames.
export const SeamFlash: React.FC<{ at: number; color?: string; dur?: number }> = ({ at, color = V.volt, dur = 8 }) => {
  const frame = useCurrentFrame();
  const p = clamp01(1 - Math.abs(frame - at) / dur);
  if (p <= 0) return null;
  return <AbsoluteFill style={{ background: rgba(color, 0.26 * p), mixBlendMode: "screen", pointerEvents: "none" }} />;
};

// ── TIPOGRAFÍA (legibilidad: titular ≥48px, cama oscura obligatoria) ─────────────────────────
export const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = V.volt }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6, textTransform: "uppercase", color }}>{children}</div>
);
export const Head: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 74, color = V.white }) => (
  <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.04, color, textShadow: "0 6px 30px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.85)" }}>{children}</div>
);
export const Body: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 32, color = V.bone }) => (
  <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: size, lineHeight: 1.32, color, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>{children}</div>
);
export const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = V.volt }) => (
  <span style={{ color, fontWeight: 800 }}>{children}</span>
);
export const Num: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 150, color = V.volt }) => (
  <div style={{
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.88, color,
    textShadow: `0 0 ${Math.round(size * 0.4)}px ${rgba(color, 0.34)}, 0 6px 26px rgba(0,0,0,0.92)`,
  }}>{children}</div>
);
export const Bed: React.FC<{ children: React.ReactNode; pad?: number; w?: number | string }> = ({ children, pad = 26, w = "auto" }) => (
  <div style={{
    width: w, padding: pad, borderRadius: 14,
    background: "linear-gradient(180deg, rgba(8,9,6,0.9) 0%, rgba(8,9,6,0.7) 100%)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.64)",
  }}>{children}</div>
);
