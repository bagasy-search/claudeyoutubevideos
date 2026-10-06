// MovShoreline.tsx — MOVIMIENTO 3 · "TU ARO ES UNA ORILLA" · 900 frames @30fps (30 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA de 30 s. Una atmósfera montada UNA vez, UNA cámara `gcam()` que es
// función del frame GLOBAL y nunca vuelve a cero, una luz que viaja DÍA EXTERIOR → tarde →
// INTERIOR CÁLIDO, y una MATERIA que cruza las cuatro fronteras: **LA LÍNEA DE AGUA**.
//
// EL TRUCO DEL MOVIMIENTO: la línea de agua NUNCA se mueve de su altura en pantalla (LINE_Y = 52%).
// Todo lo demás morfea alrededor de ella — el pilote de madera del muelle se convierte en la pared
// de porcelana de la taza, y la banda roja se queda clavada en la misma horizontal. Por eso el
// morph no se lee como corte sino como DESCUBRIMIENTO. Al final la cámara rota y esa recta se
// abre en la ELIPSE del aro visto en perspectiva.
//
// ⛔ MATERIAL REAL: cada tarjeta flotante lleva VIDEO o FOTO adentro (`MediaCard`). Los vectores
//    quedan SÓLO para la banda roja, la línea de agua y las etiquetas.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · f0–141 · "¿POR QUÉ UN ARO?"        protagonista: EL ARO sobre agua abierta
//   enterFrom  cam {z −200, ry 0 — venimos del corte del avatar}   luz {DÍA exterior, key 0.70,
//              intensidad 1.42, DayWash 1.0}   materia {la línea de agua ya trazada en LINE_Y}
//   material   plate `broll/mdring_st_dock_a.mp4` · card `broll/mdring_h02_ringcloseup.mp4`
//   exitTo     cam {z ≈ −140}  luz {key 0.66, DayWash 1.0}  materia {la línea se enciende}
//   ── FRONTERA A @136 · OCLUSIÓN (`SeamOcclude`, ángulo −14°): una masa oscura cruza y tapa
//      el cuadro ~7 frames. POR QUÉ: acá cambiamos de LUGAR (baño → muelle, el único exterior del
//      video). Una oclusión borra el cambio de sitio y el muelle aparece como revelación, no como
//      corte; y el objeto que ocluye es el propio pilote que empieza el acto siguiente.
//
// ACTO 2 · f141–368 · "EL PILOTE"             protagonista: EL PILOTE DEL MUELLE
//   enterFrom  cam {z ≈ −140}  luz {DÍA, key 0.66}  materia {la línea, intacta en LINE_Y}
//   material   plate `broll/mdring_st_dock_b.mp4` · hero ⭐`broll/mdring_h33_dockpiling.mp4`
//              (reencuadre en el beat @288) · cards `st_dock_b` (arriba) y `st_dock_a` (abajo)
//   exitTo     cam {z ≈ +60, ry −2}  luz {key 0.56, DayWash 0.97}  materia {la línea más brillante}
//   ── FRONTERA B @356 · WIPE POR MATERIA (`SeamWipeMatter`, tinte frío): una ola cruza el cuadro
//      y detrás ya está el acto siguiente. POR QUÉ: la materia que barre ES el sujeto del acto que
//      empieza (la ola que moja). La costura y el tema son la misma cosa; además tapa el cambio de
//      plate de fondo sin un solo fade.
//
// ACTO 3 · f366–655 · "LA OLA"                protagonista: LA OLA (mojar / secar / mojar)
//   enterFrom  cam {z ≈ +60}  luz {DÍA cayendo, key 0.54}  materia {ciclo de lavado sobre la línea}
//   material   hero `broll/mdring_h33_dockpiling.mp4` MÁS GRANDE (variedad por ESCALA; reencuadres
//              @498 y @600) · plates `st_dock_a` → `st_dock_b` · lámina `img/mdring_lam_shoreline.jpg`
//   beat @498  `SeamFlash` rojo de 8 frames sobre "water and air, over and over"
//   exitTo     cam {z ≈ +265, cz empieza a compensar}  luz {key 0.44, DayWash 0.30 — el día se
//              apaga}  materia {la banda roja ya tiene cuerpo y late}
//   ── FRONTERA C @650–714 · MATCH-SHAPE: la porcelana se abre DESDE la línea hacia afuera, en el
//      MISMO rectángulo y con la MISMA horizontal. POR QUÉ: la forma (columna vertical + línea
//      horizontal) es idéntica de los dos lados, así que no hace falta ni tapar ni barrer: lo único
//      que cambia es la MATERIA. Es literalmente el argumento del guion convertido en costura.
//
// ACTO 4 · f655–811 · "TU ARO ES UNA ORILLA"  protagonista: LA PARED DE PORCELANA
//   enterFrom  cam {z ≈ +265}  luz {INTERIOR, cold→warm 0.35, key 0.40}
//   material   plate `img/mdring_h14_emptybowl_blur.jpg` · hero `broll/mdring_h14_emptybowl.mp4`
//              (reencuadre @760) abriéndose sobre `broll/mdring_h33_dockpiling.mp4`
//   exitTo     cam {z ≈ +297, rotateX arranca @772}  luz {warm 0.62}  materia {banda roja plena}
//   ── FRONTERA D @806–845 · ZOOM-THROUGH: la pared de porcelana crece hasta pasar la cámara
//      (translateZ 0→760) y salimos DENTRO del aro. POR QUÉ: es la única costura que puede
//      convertir una recta en elipse sin cortar — atravesamos el objeto y giramos con él.
//
// ACTO 5 · f841–900 · "UNA SOLA FRANJA"       protagonista: EL ARO EN ELIPSE
//   enterFrom  cam {atravesando la porcelana, rotateX −26°}  luz {CÁLIDA}
//   material   hero `broll/mdring_h02_ringcloseup.mp4` · card `broll/mdring_h14_emptybowl.mp4`
//   exitTo     cam {z +420 total}  luz {CÁLIDA plena}  materia {la línea, ya ELIPSE, en hold vivo}
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  RING, F_SANS, clamp01, lerp, eio, rnd, rgba,
  gcam, light, RingAtmos, Layers, Plane, MediaCard, PhotoPlane,
  SeamOcclude, SeamWipeMatter, SeamFlash, Kick, Head, Em, Bed,
} from "./RingStage";

export const MOVSHORELINE_FRAMES = 900;

const A1 = 0, A2 = 141, A3 = 366, A4 = 655, A5 = 841, END = MOVSHORELINE_FRAMES;
const LINE_Y = 52;                 // la horizontal SAGRADA (% de pantalla)
const LY = (LINE_Y / 100) * 1080;  // 561.6 px — no se mueve NUNCA

// ══ LA LÍNEA DE AGUA ═══════════════════════════════════════════════════════════════════════
// El único vector protagonista del movimiento. `ell` 0 = recta que sale de cuadro · 1 = elipse
// (el aro visto en perspectiva). La banda roja vive pegada a ella y se curva con ella.
const WaterLine: React.FC<{ f: number; ell: number; band: number; hot: number; lit: number }> = ({
  f, ell, band, hot, lit,
}) => {
  const rx = lerp(1180, 468, ell);
  const ry = Math.max(0.7, ell * 106);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="msBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(RING.red, 0.04)} />
          <stop offset="24%" stopColor={rgba(RING.red, 0.72)} />
          <stop offset="66%" stopColor={rgba(RING.redHot, 0.9)} />
          <stop offset="100%" stopColor={rgba(RING.red, 0.04)} />
        </linearGradient>
        <linearGradient id="msGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rgba(RING.white, 0)} />
          <stop offset="30%" stopColor={rgba(RING.white, 0.55)} />
          <stop offset="70%" stopColor={rgba(RING.white, 0.55)} />
          <stop offset="100%" stopColor={rgba(RING.white, 0)} />
        </linearGradient>
      </defs>

      {/* la banda que se pudre: pegada a la línea, late */}
      {band > 0.6 && (
        <ellipse cx={960} cy={LY} rx={rx} ry={ry} fill="none" stroke="url(#msBand)"
          strokeWidth={band} opacity={0.34 + hot * 0.52} />
      )}

      {/* rizos: el agua nunca está quieta (hold VIVO) */}
      {Array.from({ length: 8 }, (_, i) => {
        const s = rnd(i * 5.3);
        const k = (f / (52 + s * 74) + s) % 1;
        const off = lerp(-52, 52, s) + Math.sin(f / (21 + i * 5) + i) * 7;
        return (
          <ellipse key={i}
            cx={960 + Math.sin(f / (59 + i * 9)) * 20}
            cy={LY + off * (0.3 + ell * 0.85)}
            rx={rx * (0.58 + s * 0.44)}
            ry={Math.max(0.5, ry * (0.46 + s * 0.72))}
            fill="none"
            stroke={rgba(RING.cold, (0.08 + 0.18 * Math.sin(k * Math.PI)) * lit)}
            strokeWidth={1.6} />
        );
      })}

      {/* el halo y el filo: la línea propiamente dicha */}
      <ellipse cx={960} cy={LY} rx={rx} ry={ry} fill="none" stroke="url(#msGlow)"
        strokeWidth={14} opacity={0.30 * lit} />
      <ellipse cx={960} cy={LY} rx={rx} ry={ry} fill="none"
        stroke={rgba(RING.white, 0.92 * lit)} strokeWidth={2.4} />
    </svg>
  );
};

// ══ EL LAVADO — el ciclo mojar/secar del acto 3, siempre corriendo ═════════════════════════
const Wash: React.FC<{ f: number; on: number }> = ({ f, on }) => {
  if (on <= 0.01) return null;
  const c = ((f - A3) / 43) % 1;
  const h = 30 + Math.sin(c * Math.PI) * 122;
  const a = (0.12 + Math.sin(c * Math.PI) * 0.32) * on;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: LY - h * 0.6, height: h,
        background: `linear-gradient(180deg, ${rgba(RING.cold, a * 0.85)} 0%, ${rgba(RING.white, a * 0.55)} 40%, ${rgba(RING.cold, 0)} 100%)`,
        mixBlendMode: "screen",
      }} />
    </AbsoluteFill>
  );
};

// ══ ESPUMA / SALPICADURA — partículas deterministas pegadas a la línea ══════════════════════
const Foam: React.FC<{ f: number; on: number; spread: number }> = ({ f, on, spread }) => {
  if (on <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 30 }, (_, i) => {
        const s = rnd(i * 3.7);
        const s2 = rnd(i * 9.1 + 4);
        const k = (f / (46 + s * 78) + s2) % 1;
        const rise = Math.sin(k * Math.PI);
        const size = 3 + s2 * 9;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${(6 + s * 88).toFixed(2)}%`,
            top: LY - rise * (18 + s2 * spread) - size / 2,
            width: size, height: size, borderRadius: "50%",
            background: rgba(RING.white, 0.06 + rise * 0.3 * on),
            boxShadow: `0 0 ${(6 + s2 * 12).toFixed(0)}px ${rgba(RING.cold, rise * 0.24 * on)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ══ LA LUZ DE DÍA — la única vez del video que estamos afuera ═══════════════════════════════
const DayWash: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  if (k <= 0.01) return null;
  const shimmer = 0.9 + Math.sin(f / 71) * 0.1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{
        background: `linear-gradient(177deg, rgba(206,228,244,${(0.30 * k).toFixed(3)}) 0%, rgba(172,200,220,${(0.15 * k).toFixed(3)}) 36%, rgba(0,0,0,0) 74%)`,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(64% 44% at 20% 2%, rgba(255,248,232,${(0.30 * k * shimmer).toFixed(3)}) 0%, rgba(0,0,0,0) 62%)`,
        mixBlendMode: "screen",
      }} />
    </AbsoluteFill>
  );
};

// ══ ETIQUETA VECTORIAL con guía hasta la línea (permitido: es un rótulo, no un objeto) ══════
const Tag: React.FC<{
  f: number; at: number; x: number; y: number; text: string; sub?: string;
  color?: string; side?: "up" | "down";
}> = ({ f, at, x, y, text, sub, color = RING.white, side = "up" }) => {
  const p = clamp01((f - at) / 18);
  if (p <= 0) return null;
  const leadH = Math.abs(LY - y) * p;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p }}>
      <div style={{
        position: "absolute", left: 8, top: side === "up" ? 0 : -leadH,
        width: 2, height: leadH,
        background: `linear-gradient(${side === "up" ? 180 : 0}deg, ${rgba(color, 0.85)}, ${rgba(color, 0.05)})`,
      }} />
      <div style={{
        transform: `translateY(${lerp(side === "up" ? -14 : 14, 0, eio(0, 1, p)).toFixed(1)}px)`,
        marginTop: side === "up" ? -36 : 0, paddingLeft: 22,
      }}>
        <div style={{
          fontFamily: F_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 2.4,
          color, textTransform: "uppercase", textShadow: "0 3px 16px rgba(0,0,0,0.95)",
        }}>{text}</div>
        {sub ? (
          <div style={{
            fontFamily: F_SANS, fontWeight: 700, fontSize: 19, letterSpacing: 1.1,
            color: rgba(RING.bone, 0.72), marginTop: 3, textShadow: "0 3px 14px rgba(0,0,0,0.95)",
          }}>{sub}</div>
        ) : null}
      </div>
    </div>
  );
};

// ══ LA IDEA DE TEXTO DEL ACTO (una sola, ≤7 palabras, siempre sobre cama) ═══════════════════
const Idea: React.FC<{
  f: number; at: number; x: number; y: number; w: number;
  kick: string; head: React.ReactNode; size?: number; align?: "left" | "center";
}> = ({ f, at, x, y, w, kick, head, size = 54, align = "left" }) => {
  const p = clamp01((f - at) / 20);
  if (p <= 0) return null;
  const p2 = clamp01((f - at - 11) / 24);
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, textAlign: align,
      opacity: p, transform: `translateY(${lerp(26, 0, eio(0, 1, p)).toFixed(1)}px)`,
    }}>
      <Bed w="100%" pad={24}>
        <Kick>{kick}</Kick>
        <div style={{ height: 10 }} />
        <div style={{ opacity: p2, transform: `translateY(${lerp(14, 0, eio(0, 1, p2)).toFixed(1)}px)` }}>
          <Head size={size}>{head}</Head>
        </div>
      </Bed>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════
export const MovShoreline: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END - 1);

  // ── LA CÁMARA: una sola llamada, monótona, nunca vuelve a 0 ──────────────────────────────
  const C = gcam(f, { z0: -200, z1: 300, panY: -10, ry: -5, dur: END });
  // el giro que convierte la recta en elipse + el zoom-through final: SÓLO crecen
  const turn = eio(0, -26, clamp01((f - 772) / 128));
  const dive = eio(0, 120, Math.pow(clamp01((f - 780) / 120), 1.6));
  const CAM = `${C.transform} translateZ(${dive.toFixed(2)}px) rotateX(${turn.toFixed(3)}deg)`;
  // contra-z del contenido: compensa la magnificación de perspectiva del tramo final (safe area 60)
  const cz = -eio(0, 180, clamp01((f - 600) / 300));

  // ── LA LUZ: DÍA exterior → interior cálido ───────────────────────────────────────────────
  const warmK = clamp01((f - A4 + 60) / 260);
  const tint = light(warmK * 0.85, "cold", "warm");
  const keyPos = interpolate(f, [A1, A2, A3, A4, END], [0.70, 0.66, 0.54, 0.40, 0.30], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  const inten = interpolate(f, [A1, A3, A4, END], [1.42, 1.18, 0.98, 0.88], { extrapolateRight: "clamp" });
  const dayK = interpolate(f, [A1, 470, 620, 740], [1, 0.96, 0.34, 0], { extrapolateRight: "clamp" });

  // ── LA MATERIA: la línea de agua y su banda roja ─────────────────────────────────────────
  const lineLit = interpolate(f, [8, 40, A2, A3, A4, END], [0, 0.55, 0.78, 0.95, 1, 1], { extrapolateRight: "clamp" });
  const bandBase = interpolate(f, [A3 + 10, A3 + 90, 498, A4, 760, END], [0, 26, 44, 52, 66, 74], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const band = bandBase > 0 ? bandBase + Math.sin(f / 17) * 3.5 : 0;   // late: nunca queda quieta
  const hot = clamp01((f - A3 - 40) / 260);
  const ell = eio(0, 1, clamp01((f - 790) / 86));   // la recta se abre en ELIPSE

  // ── EL MORPH madera → porcelana: se abre DESDE la línea, hacia arriba y hacia abajo ──────
  const morph = eio(0, 1, clamp01((f - 650) / 64));
  const half = morph * 64;
  const porcelainClip = morph >= 0.999
    ? "none"
    : `inset(${Math.max(0, LINE_Y - half).toFixed(2)}% 0% ${Math.max(0, 100 - LINE_Y - half).toFixed(2)}% 0%)`;

  // ── EL ZOOM-THROUGH: la pared de porcelana pasa la cámara ────────────────────────────────
  const punch = clamp01((f - 806) / 38);
  const punchZ = Math.pow(punch, 2.6) * 760;
  const punchDone = f >= 845;

  // rampa de entrada (≤15 frames) y salida hacia el vecino
  const inRamp = clamp01(frame / 12);
  const out = clamp01((frame - (durationInFrames - 14)) / 14);

  const washOn = interpolate(f, [A3 - 10, A3 + 40, A4 + 40, A4 + 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const foamOn = interpolate(f, [A2, A2 + 60, A4, A4 + 90], [0.25, 1, 0.9, 0.15], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const foamSpread = interpolate(f, [A2, A3 + 60], [26, 96], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* LA ATMÓSFERA — se monta UNA vez y no se remonta entre actos */}
      <RingAtmos tint={tint} keyFrom={keyPos} intensity={inten} />

      <AbsoluteFill style={{ opacity: inRamp }}>
        <Layers cam={CAM}>

          {/* ── PLANO 1 (z −460): el agua abierta, siempre en movimiento ─────────────────── */}
          {f < A2 && (
            <PhotoPlane src="broll/mdring_st_dock_a.mp4" kind="video" z={-460} scale={1.64} dim={0.30} />
          )}
          {f >= A2 - 2 && f < A3 && (
            <PhotoPlane src="broll/mdring_st_dock_b.mp4" kind="video" z={-460} scale={1.62} dim={0.34} />
          )}
          {f >= A3 && f < 600 && (
            <PhotoPlane src="broll/mdring_st_dock_a.mp4" kind="video" z={-460} scale={1.60} dim={0.38} />
          )}
          {f >= 600 && f < 716 && (
            <PhotoPlane src="broll/mdring_st_dock_b.mp4" kind="video" z={-460} scale={1.58} dim={0.44} />
          )}

          {/* ── PLANO 2 (z −250): bruma del horizonte, parallax propio ───────────────────── */}
          <Plane z={-250}>
            <div style={{
              position: "absolute", left: "-14%", right: "-14%",
              top: LY - 240 + Math.sin(f / 97) * 9, height: 320,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(RING.cold, 0.13 * dayK + 0.05)} 62%, rgba(0,0,0,0) 100%)`,
            }} />
          </Plane>

          {/* ════════ ACTO 1 · f0–141 · ¿POR QUÉ UN ARO? ═══════════════════════════════ */}
          {f < A2 && (
            <>
              <Plane z={-120}>
                <MediaCard key="a1-ring" src="broll/mdring_h02_ringcloseup.mp4" kind="video"
                  w={620} h={360} x={68} y={30} z={0} ry={-9} rx={2}
                  lit={0.95} sheenAt={26} label="YOUR BOWL · THE RING" />
              </Plane>
              <Plane z={cz}>
                <Idea f={f} at={14} x={120} y={648} w={720}
                  kick="WHY A RING?"
                  head={<>Not the whole <Em>bowl</Em>.</>} size={62} />
              </Plane>
              <Plane z={40}>
                <Tag f={f} at={62} x={196} y={LY + 96} side="down"
                  text="always the same height" color={rgba(RING.bone, 0.92)} />
              </Plane>
            </>
          )}

          {/* ════════ ACTO 2 · f141–368 · EL PILOTE ════════════════════════════════════ */}
          {f >= A2 - 2 && f < A3 + 2 && (
            <>
              <Plane z={cz}>
                {f < 288 ? (
                  <MediaCard key="a2-hero-a" src="broll/mdring_h33_dockpiling.mp4" kind="video"
                    w={700} h={620} x={33} y={LINE_Y} z={0} ry={4} rx={1}
                    lit={1} sheenAt={A2 + 18} label="A DOCK PILING" />
                ) : (
                  <MediaCard key="a2-hero-b" src="broll/mdring_h33_dockpiling.mp4" kind="video"
                    w={760} h={660} x={32} y={LINE_Y} z={30} ry={2} rx={0}
                    startFrom={60} lit={1} sheenAt={294} label="RIGHT AT THE SURFACE" />
                )}
              </Plane>

              <Plane z={cz - 130}>
                <MediaCard key="a2-air" src="broll/mdring_st_dock_b.mp4" kind="video"
                  w={470} h={264} x={73} y={23} z={0} ry={-11} rx={3}
                  startFrom={20} lit={0.86} label="UP IN THE AIR · FINE" />
                <MediaCard key="a2-under" src="broll/mdring_st_dock_a.mp4" kind="video"
                  w={470} h={264} x={73} y={79} z={0} ry={-11} rx={-3}
                  startFrom={40} lit={0.68} label="UNDERWATER · 50 YEARS" />
              </Plane>

              <Plane z={cz}>
                <Idea f={f} at={A2 + 40} x={1167} y={434} w={470}
                  kick="THE WOOD"
                  head={<>Underwater fine. In the air <Em>fine</Em>.</>} size={44} />
              </Plane>

              <Plane z={60}>
                <Tag f={f} at={A2 + 58} x={288} y={LY - 122} side="up" text="dry side" sub="never rots" />
                <Tag f={f} at={A2 + 104} x={288} y={LY + 100} side="down" text="wet side" sub="no air, no rot" />
              </Plane>
            </>
          )}

          {/* ════════ ACTO 3 · f366–655 · LA OLA ═══════════════════════════════════════ */}
          {f >= A3 && f < 726 && (
            <>
              <Plane z={cz}>
                {f < 498 ? (
                  <MediaCard key="a3-hero-a" src="broll/mdring_h33_dockpiling.mp4" kind="video"
                    w={860} h={700} x={33} y={LINE_Y} z={0} ry={1} rx={0}
                    startFrom={8} lit={1} sheenAt={A3 + 22} label="THE PART THE WAVES WASH" />
                ) : f < 600 ? (
                  <MediaCard key="a3-hero-b" src="broll/mdring_h33_dockpiling.mp4" kind="video"
                    w={780} h={660} x={33} y={LINE_Y} z={10} ry={-3} rx={1}
                    startFrom={34} lit={1} sheenAt={506} label="WATER · AND AIR" />
                ) : (
                  <MediaCard key="a3-hero-c" src="broll/mdring_h33_dockpiling.mp4" kind="video"
                    w={800} h={680} x={35} y={LINE_Y} z={20} ry={2} rx={-1}
                    startFrom={10} lit={1} sheenAt={608} label="OVER AND OVER · ALL DAY" />
                )}
              </Plane>

              {/* la lámina REAL de la guía, adentro de una tarjeta */}
              {f >= 494 && f < 690 && (
                <Plane z={cz - 90}>
                  <MediaCard key="a3-lam" src="img/mdring_lam_shoreline.jpg" kind="photo"
                    w={380} h={420} x={79} y={33} z={0} ry={-13} rx={2} rot={-1.2}
                    lit={0.92} sheenAt={510} label="THE SHORELINE RULE" />
                </Plane>
              )}

              {f < 664 && (
              <>
              <Plane z={cz}>
                <Idea f={f} at={A3 + 28} x={1230} y={622} w={480}
                  kick="THE WAVES"
                  head={<>It rots where the waves <Em>wash</Em>.</>} size={44} />
              </Plane>

              {/* el contador del ciclo: mojar / secar / mojar — nunca queda quieto */}
              <Plane z={90}>
                <div style={{
                  position: "absolute", left: 1230, top: 826, display: "flex", gap: 10,
                  opacity: clamp01((f - A3 - 72) / 20),
                }}>
                  {Array.from({ length: 6 }, (_, i) => {
                    const wet = ((f - A3) / 43 + i * 0.5) % 1 < 0.5;
                    return (
                      <div key={i} style={{
                        width: 66, height: 8, borderRadius: 4,
                        background: wet ? rgba(RING.cold, 0.85) : rgba(RING.redHot, 0.75),
                        boxShadow: `0 0 14px ${wet ? rgba(RING.cold, 0.5) : rgba(RING.redHot, 0.5)}`,
                      }} />
                    );
                  })}
                </div>
                <div style={{
                  position: "absolute", left: 1230, top: 852,
                  fontFamily: F_SANS, fontWeight: 800, fontSize: 21, letterSpacing: 3.2,
                  color: rgba(RING.bone, 0.8), textTransform: "uppercase",
                  textShadow: "0 3px 14px rgba(0,0,0,0.95)",
                  opacity: clamp01((f - A3 - 88) / 20),
                }}>wet · dry · wet · dry</div>
              </Plane>
              </>
              )}
            </>
          )}

          {/* ════════ ACTO 4 · f655–811 · LA PORCELANA (MATCH-SHAPE) ═══════════════════ */}
          {/* La porcelana se abre DESDE la línea: mismo rectángulo, misma horizontal, otra materia. */}
          {f >= 646 && !punchDone && (
            <AbsoluteFill style={{ clipPath: porcelainClip }}>
              <PhotoPlane src="img/mdring_h14_emptybowl_blur.jpg" kind="photo" z={0} scale={1.26} dim={0.52} />
              {f < 760 ? (
                <MediaCard key="a4-porc-a" src="broll/mdring_h14_emptybowl.mp4" kind="video"
                  w={760} h={680} x={33} y={LINE_Y} z={punchZ} ry={2} rx={0}
                  lit={1} sheenAt={678} label="THE SAME LAW · IN PORCELAIN" />
              ) : (
                <MediaCard key="a4-porc-b" src="broll/mdring_h14_emptybowl.mp4" kind="video"
                  w={760} h={680} x={33} y={LINE_Y} z={punchZ} ry={1} rx={0}
                  startFrom={40} lit={1} sheenAt={774} label="ONE BAND · ALL THE DAMAGE" />
              )}
            </AbsoluteFill>
          )}

          {f >= A4 - 8 && f < A5 + 4 && (
            <>
              <Plane z={cz}>
                <Idea f={f} at={A4 + 14} x={1120} y={560} w={560}
                  kick="SAME LAW · NEW MATERIAL"
                  head={<>Your ring is a <Em>shoreline</Em>.</>} size={50} />
              </Plane>
              <Plane z={70}>
                <Tag f={f} at={718} x={332} y={LY - 136} side="up" text="above it, it dries out" />
                <Tag f={f} at={766} x={332} y={LY + 112} side="down" text="below it, not enough air" />
              </Plane>
            </>
          )}

          {/* ════════ ACTO 5 · f841–900 · EL ARO EN ELIPSE ═════════════════════════════ */}
          {f >= A5 && (
            <>
              <PhotoPlane src="img/mdring_h14_emptybowl_blur.jpg" kind="photo" z={-380} scale={1.5} dim={0.56} />
              <Plane z={cz}>
                <MediaCard key="a5-ring" src="broll/mdring_h02_ringcloseup.mp4" kind="video"
                  w={900} h={500} x={50} y={38} z={0} ry={0} rx={-4}
                  startFrom={26} lit={1} sheenAt={856} label="THE ONLY PLACE THAT GETS BOTH" />
                <MediaCard key="a5-bowl" src="broll/mdring_h14_emptybowl.mp4" kind="video"
                  w={300} h={196} x={20} y={72} z={-140} ry={16} rx={4}
                  startFrom={70} lit={0.68} />
                <Idea f={f} at={850} x={520} y={624} w={880} align="center"
                  kick="ONE BAND"
                  head={<>One band gets <Em>everything</Em>.</>} size={58} />
              </Plane>
            </>
          )}

          {/* ── PLANO SAGRADO (z = cz): LA LÍNEA DE AGUA. Cruza los cinco actos sin moverse ─ */}
          <Plane z={cz}>
            <WaterLine f={f} ell={ell} band={band} hot={hot} lit={lineLit} />
          </Plane>

          {/* ── PLANO 6 (z +170): la ola y la espuma, delante de todo ────────────────────── */}
          <Plane z={170}>
            <Wash f={f} on={washOn} />
            <Foam f={f} on={foamOn} spread={foamSpread} />
          </Plane>
        </Layers>
      </AbsoluteFill>

      {/* LA LUZ DE DÍA: la única vez del video que estamos afuera. Se apaga hacia el interior. */}
      <DayWash f={f} k={dayK * inRamp} />

      {/* ══ COSTURAS — una distinta por frontera, ⛔ nunca un fade ═══════════════════════ */}
      {/* FRONTERA A · OCLUSIÓN: el pilote entra vertical y tapa el cuadro (baño → muelle) */}
      <SeamOcclude at={136} dur={18} color={RING.ink1} angle={-14} />
      {/* FRONTERA B · WIPE POR MATERIA: la ola barre y detrás ya está el acto de la ola */}
      <SeamWipeMatter at={355} dur={24} tint={RING.cold} />
      {/* BEAT @498 · "water and air, over and over": corte en el beat, 8 frames */}
      <SeamFlash at={498} color={RING.redHot} dur={8} />
      {/* FRONTERA C (MATCH-SHAPE) y D (ZOOM-THROUGH) no llevan capa: las hacen la materia y la cámara. */}

      {/* salida hacia el vecino: la luz ya viró a CÁLIDA y la línea ya es ELIPSE */}
      {out > 0 && (
        <>
          <AbsoluteFill style={{ background: rgba(RING.warm, out * 0.20), mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ boxShadow: `inset 0 0 ${(out * 200).toFixed(0)}px ${(out * 80).toFixed(0)}px rgba(0,0,0,0.7)` }} />
        </>
      )}
    </AbsoluteFill>
  );
};
