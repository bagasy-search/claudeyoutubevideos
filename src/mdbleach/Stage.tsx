// ════════════════════════════════════════════════════════════════════════════════════════════
//  Stage.tsx — ESCENARIO COMPARTIDO del video `mdbleach` (canal Mike Dalton)
//  "Don't Use Bleach in Your Toilet. Best Way to Kill Toilet Mold"
//
//  Se escribe UNA vez, ANTES de lanzar los subagentes de movimientos. Todos los `Mov*.tsx`
//  consumen ESTE archivo: una sola cámara, una sola atmósfera, una sola luz. Así la continuidad
//  entre movimientos está garantizada por construcción y no por suerte.
//
//  Hereda del Stage del canal (`src/mdtank/Stage.tsx`), que ya trae los dos bugs corregidos:
//    · `rgba()` parsea HEX **y** `rgb()` y nunca devuelve NaN (antes el color desaparecía sin error)
//    · `Occluder` es una banda de 300% de PANTALLA con bordes plumeados al 4% → tapa de verdad
//  ⛔ NO re-implementes esos dos: importalos.
//
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  LA ATMÓSFERA DEL VIDEO (una sola, para los 6 movimientos)
//  ════════════════════════════════════════════════════════════════════════════════════════════
//  Un cuarto de servicio de noche: negro cinematográfico, una sola fuente dura arriba a la
//  izquierda (la bombita del baño), aire con polvo fino y vapor bajo. Todo lo que brilla es
//  porcelana mojada o vidrio. El acento ROJO es el cloro; el BLANCO frío es el peróxido.
//
//  EL ARCO DE LUZ DEL VIDEO — la temperatura viaja UNA sola vez, de punta a punta:
//     Mov1 MovMatch  → 'warm'  (la cerilla: es el único fuego del video)
//     Mov2 MovLoop   → 'red'   (el cloro comiéndose la goma)
//     Mov3 MovLetter → 'warm'  (la lámpara de la cocina, más baja y más íntima)
//     Mov4 MovTruck  → 'cold'  (la explicación: aire limpio, blanco)
//     Mov5 MovRefill → 'cold'  (dentro del tanque: agua, sin fuego)
//     Mov6 MovClose  → 'warm'  (vuelve el cuarto, la resolución)
//
//  EL ARCO DE CÁMARA — `stageCam(frameLocal, mov)` NUNCA vuelve a 0 entre movimientos: cada uno
//  arranca exactamente donde terminó el anterior (ver CAM_ARC abajo). El acto 3 de un movimiento
//  hereda la inercia del acto 2 porque la cámara es función del frame GLOBAL del movimiento.
// ════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing,
} from "remotion";

export {
  MD, F_SANS, F_SERIF, rgba, lerp, clamp01, eio, rnd, cam, light, Atmos, glassStyle,
  Sheen, Kicker, Title, Em, TextBed, Occluder, VaporWipe,
} from "../mdtank/Stage";
import { MD, rgba, clamp01, eio, rnd, light } from "../mdtank/Stage";

// ── EL ARCO DE CÁMARA DEL VIDEO ────────────────────────────────────────────────────────────
// Cada movimiento declara de dónde entra y hacia dónde sale. El subagente NO elige estos
// números: los recibe. Su acto 1 arranca en `from` y su último acto aterriza en `to`.
export type CamState = { z: number; panX: number; panY: number; ry: number; rz: number };

export const CAM_ARC: Record<number, { from: CamState; to: CamState; luz: "cold" | "warm" | "red" }> = {
  1: { from: { z: 0.00, panX: 0, panY: 0, ry: 0, rz: 0 }, to: { z: 0.30, panX: -70, panY: 18, ry: -7, rz: 0.6 }, luz: "warm" },
  2: { from: { z: 0.30, panX: -70, panY: 18, ry: -7, rz: 0.6 }, to: { z: 0.62, panX: 40, panY: -24, ry: 9, rz: -0.8 }, luz: "red" },
  3: { from: { z: 0.62, panX: 40, panY: -24, ry: 9, rz: -0.8 }, to: { z: 0.34, panX: 96, panY: 30, ry: 4, rz: 0.4 }, luz: "warm" },
  4: { from: { z: 0.34, panX: 96, panY: 30, ry: 4, rz: 0.4 }, to: { z: 0.18, panX: -34, panY: -12, ry: -5, rz: -0.3 }, luz: "cold" },
  5: { from: { z: 0.18, panX: -34, panY: -12, ry: -5, rz: -0.3 }, to: { z: 0.78, panX: 12, panY: 54, ry: 2, rz: 0.2 }, luz: "cold" },
  6: { from: { z: 0.78, panX: 12, panY: 54, ry: 2, rz: 0.2 }, to: { z: 0.40, panX: 0, panY: 0, ry: 0, rz: 0 }, luz: "warm" },
};

/**
 * La cámara del video. `p` = progreso 0..1 DENTRO del movimiento (frame local / duración).
 * Interpola del `from` al `to` del arco con un easing que NO es constante (respira).
 * Los movimientos la usan para su transform raíz; los actos aplican sus propios offsets ENCIMA,
 * nunca en lugar de ella.
 */
export const stageCam = (p: number, mov: number, extra?: Partial<CamState>) => {
  const arc = CAM_ARC[mov] ?? CAM_ARC[1];
  const t = eio(0, 1, clamp01(p));
  const v: CamState = {
    z: arc.from.z + (arc.to.z - arc.from.z) * t,
    panX: arc.from.panX + (arc.to.panX - arc.from.panX) * t,
    panY: arc.from.panY + (arc.to.panY - arc.from.panY) * t,
    ry: arc.from.ry + (arc.to.ry - arc.from.ry) * t,
    rz: arc.from.rz + (arc.to.rz - arc.from.rz) * t,
  };
  if (extra) Object.assign(v, { ...v, ...extra });
  const scale = 1 + v.z * 0.26;
  return {
    state: v,
    // ⚠️ `transform: perspective()` NO crea contexto 3D para los hijos. Cada acto necesita SU
    // contenedor con la PROPIEDAD CSS `perspective` + `preserve-3d` o los translateZ se aplanan.
    transform:
      `translate3d(${v.panX.toFixed(2)}px, ${v.panY.toFixed(2)}px, 0) ` +
      `rotateY(${v.ry.toFixed(2)}deg) rotateZ(${v.rz.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
  };
};

/** Contenedor 3D real. Envolvé cada acto con esto o los `translateZ` de sus capas se aplanan. */
export const Space3D: React.FC<{ children: React.ReactNode; depth?: number; style?: React.CSSProperties }> = ({
  children, depth = 1500, style,
}) => (
  <AbsoluteFill style={{ perspective: depth, transformStyle: "preserve-3d", ...style }}>{children}</AbsoluteFill>
);

// ════════════════════════════════════════════════════════════════════════════════════════════
//  MATERIA REAL — ⛔⛔ REGLA DURA DEL CREADOR
//  Una tarjeta que es SÓLO una forma con texto es código en pantalla y se nota. Adentro va
//  material REAL: un clip corriendo o una foto. `GlassPlate` exige `src` en el tipo justamente
//  para que no se pueda entregar una tarjeta vacía por descuido.
//  ⛔ Nada de SVG vectorial haciendo de objeto real (un dibujo de botella NO reemplaza la foto).
//  Los helpers dibujados sirven de ESTRUCTURA (cortes, esquemas), nunca de protagonista.
// ════════════════════════════════════════════════════════════════════════════════════════════

/** Material real que llena su caja. `.mp4` → clip corriendo; cualquier otra cosa → foto. */
export const Material: React.FC<{
  src: string;            // "broll/mdbleach_h11_pourbowl.mp4" | "img/mdbleach_h11_pourbowl.jpg"
  startFrom?: number;     // frame de entrada DENTRO del clip (para reusar el mismo asset)
  drift?: number;         // deriva lentísima para las FOTOS (los clips ya se mueven solos)
  focusX?: number;        // 0..100, encuadre al sujeto (nunca centro ciego)
  focusY?: number;
}> = ({ src, startFrom = 0, drift = 0.05, focusX = 50, focusY = 46 }) => {
  const frame = useCurrentFrame();
  const isVid = /\.mp4$/i.test(src);
  const s = isVid ? 1.02 : 1 + drift * clamp01(frame / 240);
  const common: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    objectPosition: `${focusX}% ${focusY}%`,
    transform: `scale(${s.toFixed(4)})`,
  };
  return isVid ? (
    <OffthreadVideo src={staticFile(src)} muted startFrom={startFrom} style={common} />
  ) : (
    <Img src={staticFile(src)} style={common} />
  );
};

/**
 * TARJETA FLOTANTE con material real adentro. Marco, bisel, sombra de contacto que ATERRIZA,
 * reflejo superior y barrido especular. Vive a una profundidad `z` dentro de un `Space3D`.
 * ⛔ `src` es OBLIGATORIO: no existe la tarjeta vacía.
 */
export const GlassPlate: React.FC<{
  src: string;
  w: number; h: number;
  x?: number; y?: number; z?: number;        // posición en el espacio (px, px, px de translateZ)
  ry?: number; rx?: number; rz?: number;
  radius?: number;
  lit?: number;                              // 0..1 cuánto la toca la key
  sheenAt?: number;                          // frame local del barrido especular
  startFrom?: number;
  focusX?: number; focusY?: number;
  label?: React.ReactNode;                   // rótulo bajo la tarjeta (opcional)
  opacity?: number;
  children?: React.ReactNode;                // capas ENCIMA del material (rótulos anclados, etc.)
}> = ({
  src, w, h, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, radius = 18, lit = 0.6,
  sheenAt, startFrom = 0, focusX, focusY, label, opacity = 1, children,
}) => {
  const frame = useCurrentFrame();
  // sombra de contacto: cuanto más lejos del suelo, más grande y más difusa (y más clara)
  const lift = 1 + Math.max(0, z) / 900;
  const sheen = sheenAt == null ? -1 : clamp01((frame - sheenAt) / 26);
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: w, height: h, opacity,
        transform:
          `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
          `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* sombra ambiental que ATERRIZA (no un box-shadow flotando) */}
      <div
        style={{
          position: "absolute", left: "6%", right: "6%", bottom: -18 * lift, height: 26 * lift,
          background: `radial-gradient(60% 100% at 50% 0%, rgba(0,0,0,${0.5 / lift}) 0%, rgba(0,0,0,0) 72%)`,
          filter: "none",
        }}
      />
      {/* cuerpo: marco + bisel + material real */}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden",
          background: MD.ink1,
          boxShadow:
            `0 ${18 * lift}px ${46 * lift}px rgba(0,0,0,.62), ` +
            `inset 0 1px 0 ${rgba("#FFFFFF", 0.16 + lit * 0.2)}, ` +
            `inset 0 -1px 0 rgba(0,0,0,.5), 0 0 0 1px ${rgba("#FFFFFF", 0.09)}`,
        }}
      >
        <Material src={src} startFrom={startFrom} focusX={focusX} focusY={focusY} />
        {/* reflejo superior del vidrio (gradiente, ⛔ nunca backdrop-filter: ×5 el render) */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background:
              `linear-gradient(160deg, ${rgba("#FFFFFF", 0.16 * lit)} 0%, rgba(255,255,255,0) 34%), ` +
              `radial-gradient(120% 80% at 12% 0%, ${rgba("#FFFFFF", 0.1 * lit)} 0%, rgba(0,0,0,0) 60%)`,
          }}
        />
        {/* barrido especular diagonal */}
        {sheen > 0 && sheen < 1 && (
          <div
            style={{
              position: "absolute", top: "-40%", bottom: "-40%", width: "34%",
              left: `${interpolate(sheen, [0, 1], [-40, 130])}%`,
              transform: "rotate(16deg)",
              background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba("#FFFFFF", 0.3)} 50%, rgba(255,255,255,0) 100%)`,
            }}
          />
        )}
        {children}
      </div>
      {label != null && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: h + 14, textAlign: "center",
            transform: "translateZ(1px)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

/**
 * CARRUSEL / ABANICO 3D de material real. Cada carta lleva su clip o su foto.
 * DESFASE POR CARTA: la delantera se mueve MÁS que la trasera (si todas se mueven igual, se lee
 * como UNA imagen y no como un objeto con grosor).
 */
export const Fan3D: React.FC<{
  items: { src: string; startFrom?: number; label?: React.ReactNode }[];
  open: number;            // 0 = mazo cerrado · 1 = abanico abierto
  w?: number; h?: number;
  spread?: number;         // px entre cartas cuando está abierto
  arc?: number;            // grados de giro entre cartas
  z?: number;
  sheenAt?: number;
}> = ({ items, open, w = 380, h = 240, spread = 300, arc = 9, z = 0, sheenAt }) => {
  const n = items.length;
  const o = clamp01(open);
  return (
    <>
      {items.map((it, i) => {
        const c = i - (n - 1) / 2;                 // centrado
        const depth = (n - 1 - i) * 46;            // las de atrás, más lejos
        // ⚠️ el desfase: las delanteras responden MÁS al "open" que las traseras
        const lag = 0.55 + 0.45 * (i / Math.max(1, n - 1));
        const oo = clamp01(o * lag);
        return (
          <GlassPlate
            key={i}
            src={it.src}
            startFrom={it.startFrom}
            label={it.label}
            w={w} h={h}
            x={c * spread * oo}
            y={Math.abs(c) * 12 * oo - depth * 0.06}
            z={z - depth + oo * 40 * (1 - Math.abs(c) / Math.max(1, n))}
            ry={-c * arc * oo}
            rz={c * 1.4 * oo}
            lit={0.35 + 0.5 * (i / Math.max(1, n - 1))}
            sheenAt={sheenAt == null ? undefined : sheenAt + i * 4}
          />
        );
      })}
    </>
  );
};

/**
 * DECAL — logo/ícono/vector en PNG SIN FONDO puesto como OBJETO de la escena (a su profundidad,
 * con su sombra). Opcional, pero suma una capa que el código puro no da.
 */
export const Decal: React.FC<{
  src: string; w: number;
  x?: number; y?: number; z?: number; ry?: number; rz?: number; opacity?: number;
}> = ({ src, w, x = 0, y = 0, z = 0, ry = 0, rz = 0, opacity = 0.92 }) => (
  <div
    style={{
      position: "absolute", left: "50%", top: "50%", width: w, opacity,
      transform: `translate(-50%,-50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      transformStyle: "preserve-3d",
      filter: `drop-shadow(0 ${10 + z / 90}px ${18 + z / 50}px rgba(0,0,0,.6))`,
    }}
  >
    <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════════════════════
//  COSTURAS — una distinta por frontera. ⛔ NUNCA un fade.
//  `Occluder` (oclusión) y `VaporWipe` (wipe por materia) vienen del Stage del canal.
//  Acá van las dos que faltaban.
//
//  ⛔⛔ MINA MEDIDA EN EL RENDER (mdbleach, ago 2026) — `Occluder` CON EL COLOR DEL FONDO
//  NO ES UNA OCLUSIÓN: ES UN FUNDIDO A NEGRO.
//  El default del componente en `../mdtank/Stage` es `MD.ink1` (#141518), o sea el fondo. Pasarle
//  eso (o `MD.ink0`) hace que la banda de 300% de pantalla tape el cuadro con NEGRO: el acto
//  siguiente puede estar perfectamente montado debajo y aun así se ve un flash negro.
//  Medido frame a frame sobre el mp4 del farm, en la frontera 2 de MovClose:
//      luma 229 (la página tapando) → 47 → 21 → 13 → **10** → 65 → 235   = 7 frames de negro
//  y en la frontera 1 de MovTruck: 53 → **21 → 22** → 53 = 6 frames de parpadeo.
//  ✅ REGLA: el color del `Occluder` es SIEMPRE el de la MATERIA que cruza la frontera —
//     el papel (`MD.bone`), la porcelana, la goma, la jarra. Nunca el color del fondo.
//     Y verificalo midiendo, no mirando: `signalstats` YAVG alrededor de la frontera.
// ════════════════════════════════════════════════════════════════════════════════════════════

/**
 * ZOOM-THROUGH: la cámara ENTRA en un detalle y sale en la escena siguiente. Envolvé el acto que
 * SALE; cuando `p` pasa 1 el hijo ya está fuera de cuadro y detrás está el acto nuevo.
 */
export const ZoomThrough: React.FC<{
  at: number; dur?: number; into?: [number, number]; scale?: number; children: React.ReactNode;
}> = ({ at, dur = 18, into = [50, 50], scale = 7.5, children }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  if (p >= 1) return null;
  const s = 1 + (scale - 1) * Math.pow(p, 2.1);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${into[0]}% ${into[1]}%`,
        transform: `scale(${s.toFixed(4)})`,
        opacity: p > 0.86 ? interpolate(p, [0.86, 1], [1, 0]) : 1, // sólo el último 14%, ya invisible
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * MATCH-SHAPE: la forma A se convierte en la B (tarjeta → panel → hoja → mesa). Interpola caja,
 * radio y rotación; el material de adentro se mantiene, que es lo que hace que se lea como
 * TRANSFORMACIÓN y no como reemplazo.
 */
export const MatchShape: React.FC<{
  at: number; dur?: number;
  from: { w: number; h: number; r: number; rz?: number };
  to: { w: number; h: number; r: number; rz?: number };
  src: string; startFrom?: number; z?: number; children?: React.ReactNode;
}> = ({ at, dur = 22, from, to, src, startFrom, z = 0, children }) => {
  const frame = useCurrentFrame();
  const p = eio(0, 1, clamp01((frame - at) / dur));
  return (
    <GlassPlate
      src={src}
      startFrom={startFrom}
      w={from.w + (to.w - from.w) * p}
      h={from.h + (to.h - from.h) * p}
      radius={from.r + (to.r - from.r) * p}
      rz={(from.rz ?? 0) + ((to.rz ?? 0) - (from.rz ?? 0)) * p}
      z={z}
    >
      {children}
    </GlassPlate>
  );
};

// ── Polvo/vapor de la atmósfera, determinístico (⛔ nunca Math.random: el farm rinde en paralelo)
export const Motes: React.FC<{ n?: number; tint?: string; speed?: number }> = ({
  n = 34, tint = "#FFFFFF", speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 3.1), b = rnd(i * 7.7), c = rnd(i * 11.3);
        const x = (a * 118 - 9 + Math.sin((frame * 0.004 + i) * speed) * 3) % 118;
        const y = (b * 118 - 9 + frame * 0.017 * (0.4 + c) * speed) % 118;
        const s = 1 + c * 2.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s,
              borderRadius: "50%", background: rgba(tint, 0.1 + c * 0.2),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** La luz del movimiento `mov` en su progreso `p` — para que ningún acto invente su propia paleta. */
export const movLight = (mov: number, p: number) => {
  const arc = CAM_ARC[mov] ?? CAM_ARC[1];
  const prev = CAM_ARC[mov - 1]?.luz ?? arc.luz;
  return light(clamp01(p), prev, arc.luz);
};
