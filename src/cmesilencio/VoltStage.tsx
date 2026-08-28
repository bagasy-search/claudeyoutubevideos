// VoltStage.tsx — ESCENARIO COMPARTIDO del video `cmegenerador`
// (canal Claudio Mendoza Constructor, ES neutro · "Los generadores para toda la casa son carísimos").
//
// Se escribe UNA vez, ANTES de lanzar los subagentes de movimientos, y TODOS lo consumen. Es lo que
// hace que 16 movimientos escritos por agentes distintos se lean como UN video: la misma perspectiva,
// el mismo suelo, la misma atmósfera, el mismo grade y las mismas primitivas de material.
//
// ⛔ LA REGLA QUE MANDA ACÁ: **una tarjeta que es sólo una forma con texto se lee como CÓDIGO EN
// PANTALLA.** Adentro de cada tarjeta va MATERIAL REAL — un clip corriendo (`MediaCard kind="video"`)
// o una foto (`kind="photo"`) — con su marco, su sombra de contacto y su profundidad. Los vectores
// quedan para lo que ES un gráfico (un eje, una curva, una flecha), NUNCA para hacer de objeto real.
//
// ── EL ESCENARIO DE ESTE VIDEO (lo comparten los 16 movimientos) ─────────────────────────────
//   EL PATIO TRASERO DE ERNESTO, al anochecer, visto como un plato oscuro. El suelo es una LOSA DE
//   CONCRETO recién colada, VACÍA — el lugar donde iría el generador de 9.400 dólares y donde al final
//   del video no hay nada. Detrás, la cerca de madera y la silueta baja de la casa con las ventanas
//   apagadas. A la izquierda, el costado del garaje de Claudio con el portón levadizo entreabierto.
//
//   DOS LUCES SE DISPUTAN LA ESCENA Y DEFINEN EL ARCO ENTERO:
//     - la KEY VOLTIO (#C8F000), FRÍA, arriba a la izquierda  = LA MEDICIÓN (la pinza, el dato duro)
//     - el CONTRA ÁMBAR (#FFC83D), CÁLIDO, abajo a la derecha = LA CASA (lo que se protege, el dinero)
//   REGLA DE DIRECCIÓN DE LUZ: todo lo que sea "lo que te venden" / "lo que te cobran" entra desde
//   ARRIBA y en FRÍO. Todo lo que sea "lo que de verdad necesitas" entra desde ABAJO y en CÁLIDO.
//   En la noche del apagón (S4-S5) la única fuente pasa a ser el haz blanco (`torch`) de la linterna.
//   En "las siete que no" (S10) entra por única vez el `danger` naranja. La luz EVOLUCIONA a lo largo
//   del video, no salta entre movimientos.
//
//   ARCO DE LUZ POR SECCIÓN (el spec de vecinos de cada movimiento sale de acá):
//     S1-S3  cielo cubierto frío + el blanco del papel del presupuesto  (keyFrom 0.20, tint volt)
//     S4-S5  NOCHE: sólo `torch` + el verde de la pantalla de la pinza  (keyFrom 0.55, intensity 0.7)
//     S6-S7  LABORATORIO: negro puro, luz volt dura, todo es dato       (keyFrom 0.30, floor 0.7)
//     S8-S9  GARAJE de trabajo: neutro-cálido, luz de producto          (keyFrom 0.45, tint2 amber)
//     S10    PELIGRO: `danger` desde arriba, contraluz duro             (tint danger)
//     S11    AMANECE en el patio: ámbar cálido, la losa sigue vacía     (keyFrom 0.80, tint amber)
//
//   OBJETO PROTAGONISTA: la LOSA DE CONCRETO VACÍA. Aparece o se insinúa en S1, S3 y S11: es el
//   rectángulo del que sale un gráfico, la mesa sobre la que se apoya todo, y el último plano.
//   SEGUNDO OBJETO: el PAPEL DEL PRESUPUESTO de 9.400 dólares — se dobla, se convierte en hoja, en
//   tabla, en recibo, y cruza fronteras entre actos.
//   TERCERO: la PINZA AMPERIMÉTRICA, la firma del canal, con su display verde.
//
//   MATERIAS para las oclusiones (`SeamOcclude` va con el color de la MATERIA que cruza, ⛔ NUNCA con
//   el color del fondo, o hace un fundido a negro): `V.concrete` (la losa), `V.paper` (el presupuesto),
//   `V.steel` (la chapa del generador), `V.ink2` (la goma del cable).
//
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing,
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
  paper: "#EDE7DA",      // el papel del presupuesto de 9.400: MATERIA de oclusión
  steel: "#9AA0A6",      // la chapa gris del generador: MATERIA de oclusión
  copper: "#B87333",     // el cobre del cable grueso
  blade: "#E9E9E4",      // blanco plástico neutro
};
// Duracion EXACTA de todos los clips i2v de este video: 153 cuadros a 30 fps = 5,10 s.
export const CLIP_FRAMES = 153;
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

// ── EL PULSO — la firma visual de ESTE video (el CICLO DE TRABAJO) ──────────────────────────
// La espina del guion: el compresor NO anda todo el tiempo, anda 8 minutos de cada 30. `DutyField`
// dibuja esa verdad como una tira de celdas que se encienden 8 de cada 30. `duty` es literal
// (0.27 = ocho de treinta) y `on` enciende la tira. Se usa en varios movimientos con distinta escala:
// es lo que hace que el espectador VEA por qué el promedio es diez veces más chico que el pico.
export const DutyField: React.FC<{
  duty?: number; cells?: number; on?: number; tint?: string; y?: number; w?: number; h?: number; cycle?: number;
}> = ({ duty = 8 / 30, cells = 30, on = 1, tint = V.volt, y = 50, w = 1240, h = 46, cycle = 150 }) => {
  const frame = useCurrentFrame();
  const head = ((frame / cycle) * cells) % cells;
  const enc = Math.round(cells * clamp01(duty));
  return (
    <div style={{
      position: "absolute", left: "50%", top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, display: "flex", gap: Math.max(2, Math.round(w / cells / 7)),
      opacity: clamp01(on),
    }}>
      {Array.from({ length: cells }, (_, i) => {
        const activa = i < enc;
        const paso = clamp01(1 - Math.abs(((head - i + cells) % cells)) / 2.2);
        const a = activa ? 0.55 + 0.45 * paso : 0.10 + 0.06 * paso;
        return (
          <div key={i} style={{
            flex: 1, borderRadius: 3,
            background: activa ? rgba(tint, a) : rgba(V.white, a),
            boxShadow: activa ? `0 0 ${Math.round(10 + 18 * paso)}px ${rgba(tint, 0.42 * a)}` : "none",
          }} />
        );
      })}
    </div>
  );
};

// ── LA LOSA — el objeto protagonista, disponible para todos los movimientos ─────────────────
// Un rectángulo de concreto en perspectiva, con su borde biselado y su sombra de contacto. Sirve de
// SUELO sobre el que aterrizan las tarjetas y de MATERIA para las costuras por oclusión.
export const PadPlane: React.FC<{ y?: number; w?: number; h?: number; rx?: number; lit?: number; z?: number }> = ({
  y = 74, w = 1360, h = 300, rx = 62, lit = 1, z = -120,
}) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 97) * 0.004;
  return (
    <div style={{
      position: "absolute", left: "50%", top: `${y}%`, width: w, height: h, marginLeft: -w / 2,
      transform: `translateZ(${z}px) rotateX(${rx}deg) scale(${breathe.toFixed(4)})`,
      transformStyle: "preserve-3d", transformOrigin: "50% 0%",
      background: `linear-gradient(178deg, ${rgba(V.concrete, 0.30 * lit)} 0%, ${rgba(V.concrete, 0.12 * lit)} 46%, ${rgba(V.ink0, 0.9)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.16 * lit)}, 0 -18px 60px ${rgba(V.ink0, 0.8)}`,
      borderRadius: 2,
    }}>
      <AbsoluteFill style={{
        opacity: 0.16 * lit, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(102deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 7px)",
      }} />
    </div>
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
  src: string;                      // ej: broll/cmegenerador/<nombre>.mp4  |  img/cmegenerador/<nombre>.png
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
        // ⛔ TODOS los clips de este video duran EXACTAMENTE 153 frames (5,1 s a 30 fps), y casi
        // ninguna tarjeta vive menos que eso: sin loopear, `OffthreadVideo` se queda CONGELADO en su
        // ultimo cuadro, y un clip clavado se ve peor que su foto (a la foto el kit si le da
        // Ken-Burns). Se resuelve montando una <Sequence> por vuelta: adentro el reloj arranca de
        // cero otra vez. Si el movimiento ya trae su propio loop, `frame` nunca llega a 153 y esto
        // queda en un no-op (`from={0}`).
        <Sequence from={Math.floor(frame / CLIP_FRAMES) * CLIP_FRAMES} durationInFrames={CLIP_FRAMES} layout="none">
          <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
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
// ⛔⛔ EL COLOR DEL OCCLUDER ES EL DE LA MATERIA QUE CRUZA, NUNCA EL DEL FONDO — pero eso solo no
// alcanza. Medido en el reel de costuras de este video: un `V.paper` (luma 231) o un `V.steel` (155)
// cruzando una escena de laboratorio a luma 26 tapaba el cuadro con un rectangulo CLARO Y PLANO, y
// eso se lee como un FLASH BLANCO de 6 cuadros — el mismo defecto que el fundido a negro, del otro
// lado. (Lo cazo el reel: MovCiclo F3 saltaba 181 -> 26, MovDiezAnos F4 155 -> 19.)
// La fisica lo resuelve sola: un objeto pegado al lente TAPA la luz, asi que llega a camara en
// SOMBRA, no iluminado. Aca el material se oscurece a medida que cubre (`sombra`), y ademas lleva
// el degrade de un objeto real (canto iluminado, cuerpo oscuro) en vez de un relleno plano. Sigue
// tapando el 100%, sigue siendo la materia, y deja de parpadear.
export const SeamOcclude: React.FC<{ at: number; dur?: number; color?: string; angle?: number; lit?: number }> = ({
  at, dur = 14, color = V.concrete, angle = 8, lit = 0.30,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p <= 0 || p >= 1) return null;
  // 0 en los bordes, 1 en el instante de cobertura total.
  const cubre = 1 - Math.abs(p - 0.5) * 2;
  const q = cubre * cubre;
  // La correccion es SIMETRICA: en el instante de cobertura total la materia se lleva a una
  // luminancia media (~76/255). Un papel (231) o una chapa (155) dejan de dar un FLASH BLANCO, y
  // una goma negra (30) deja de dar un FUNDIDO A NEGRO — que es el mismo defecto del otro lado.
  // Fisicamente es lo que pasa: el objeto pegado al lente tapa la key y queda en luz de rebote.
  const rgbDe = (c: string): [number, number, number] => {
    const m = c.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/i);
    if (m) return [+m[1], +m[2], +m[3]];
    let h = String(c).replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const v = parseInt(h, 16);
    return Number.isFinite(v) ? [(v >> 16) & 255, (v >> 8) & 255, v & 255] : [126, 125, 116];
  };
  const [r0, g0, b0] = rgbDe(color);
  const luma = Math.max(8, 0.299 * r0 + 0.587 * g0 + 0.114 * b0);
  // ⛔ sin clamp a 1: para una materia OSCURA (la goma, luma 30) el factor tiene que poder SUBIR,
  // o el occluder sigue dando un fundido a negro. Rango sano [0.15, 3.2].
  const objetivo = Math.max(0.15, Math.min(3.2, (lit * 255) / luma));
  const k = lerp(1, objetivo, q);
  const dim = (a: number) =>
    `rgb(${Math.min(255, Math.round(r0 * k * a))},${Math.min(255, Math.round(g0 * k * a))},${Math.min(255, Math.round(b0 * k * a))})`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-60%", left: `${lerp(-170, 170, p).toFixed(1)}%`,
        width: "320%", height: "220%",
        // canto iluminado + cuerpo en sombra: se lee como un objeto pasando, no como un cartel
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${dim(1.35)} 7%, ${dim(0.82)} 22%, ${dim(0.62)} 55%, ${dim(0.9)} 92%, rgba(0,0,0,0) 100%)`,
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

// ── EL CAMPO DE SONIDO — la firma visual de ESTE video ──────────────────────────────────────
// La espina del guion: el ruido se MIDE, y bajarlo se VE. `SoundField` dibuja anillos concéntricos
// que salen del generador; su DENSIDAD es el número de decibeles. A 78 saturan el cuadro, a 66 se
// ralean, a 60 quedan tres anillos lejanos. Si se le pasa `wall`, los anillos que cruzan esa
// vertical se DOBLAN y pierden amplitud: es la línea de vista rota por el muro bajo del patio.
// `db` es literal (el número que dice la narración) para que el visual y la voz no se separen nunca.
export const SoundField: React.FC<{
  db?: number; x?: number; y?: number; wall?: number | null; on?: number;
  tint?: string; speed?: number; spread?: number;
}> = ({ db = 78, x = 30, y = 62, wall = null, on = 1, tint = V.volt, speed = 1, spread = 78 }) => {
  const frame = useCurrentFrame();
  // 60 dB -> 3 anillos · 78 dB -> 11 anillos. El oído no cuenta lineal y el cuadro tampoco.
  const rings = Math.max(2, Math.round(interpolate(db, [58, 78], [3, 11], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  })));
  const amp = interpolate(db, [58, 78], [0.32, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const period = 96 / speed;
  return (
    <AbsoluteFill style={{ opacity: clamp01(on), pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sf_fade" x1="0" x2="1">
            <stop offset="0%" stopColor={rgba(tint, 0)} />
            <stop offset="45%" stopColor={rgba(tint, 0.9)} />
            <stop offset="100%" stopColor={rgba(tint, 0)} />
          </linearGradient>
        </defs>
        {Array.from({ length: rings }, (_, i) => {
          const t = (((frame / period) + i / rings) % 1);
          const r = 40 + t * spread * 14;
          const fade = (1 - t) * amp;
          if (fade <= 0.015) return null;
          const cx = (x / 100) * 1920, cy = (y / 100) * 1080;
          // el anillo se aplasta contra el suelo: el patio es un plano, no el vacío
          const ry = r * 0.42;
          const cruza = wall != null && cx + r > (wall / 100) * 1920;
          return (
            <g key={i}>
              <ellipse
                cx={cx} cy={cy} rx={r} ry={ry}
                fill="none"
                stroke={rgba(tint, fade * 0.5)}
                strokeWidth={1.1 + fade * 2.4}
              />
              {/* del lado del vecino, si hay muro, el anillo llega DOBLADO y sin cuerpo */}
              {cruza && (
                <ellipse
                  cx={cx + r * 0.16} cy={cy + ry * 0.1} rx={r * 0.98} ry={ry * 0.72}
                  fill="none"
                  stroke={rgba(tint, fade * 0.14)}
                  strokeWidth={0.9 + fade * 0.9}
                  strokeDasharray="9 13"
                />
              )}
            </g>
          );
        })}
        {wall != null && (
          <rect
            x={(wall / 100) * 1920} y={0} width={1920 - (wall / 100) * 1920} height={1080}
            fill={rgba(V.ink0, 0.34)}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
