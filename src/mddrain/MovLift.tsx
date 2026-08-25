// MovLift.tsx — MOVIMIENTO 5 del video `mddrain` — 1137 frames (37,9 s) @30fps.
//
// LA IDEA: por qué el peróxido y no otra cosa. Tres razones, ninguna es magia.
//   · La lavandina le saca el COLOR a la película en segundos: parece limpio, pero el ANDAMIO
//     —la matriz que sostiene la colonia contra la pared— queda entero, y en nueve días la
//     colonia se repuebla desde adentro.
//   · El peróxido es fino como el agua: se MENTE por las grietas en vez de quedarse arriba.
//   · Al tocar tejido vivo espuma solo, y esa espuma es MECÁNICA: miles de burbujas naciendo
//     DEBAJO de la capa la levantan de la pared. Es lo único que un cepillo no puede hacer.
//     Y cuando termina se vuelve agua y oxígeno: nada en el sifón, nada que mate un pozo séptico.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0–246    BLEACH TAKES THE COLOUR
//     enterFrom · CÁMARA: z=40, casi frontal, heredada del b-roll de la jarra en el piso.
//                 LUZ: fría (#9FB6C8), key arriba-izquierda (0.16). MATERIA: la jarra de lavandina.
//     exitTo    · CÁMARA: z≈100, ry≈1.1°, ya derivando a la izquierda.
//                 LUZ: fría con el primer lavado blanco del blanqueo.
//                 MATERIA: la CARTA DE LA PELÍCULA (foto h39 real) decolorada, con el andamio
//                 dibujado encima intacto → esa carta CRUZA la frontera.
//
// acto 2  f246–450  NINE DAYS AND IT'S BACK
//     enterFrom · la misma carta de película, ya blanqueada, entrando desde el barrido de lavandina.
//     exitTo    · CÁMARA: z≈170, ry≈2°. LUZ: fría-neutra. MATERIA: la boca del desagüe (clip h20)
//                 en la carta derecha, que se apaga en el corte al beat.
//
// acto 3  f450–690  THIN AS WATER
//     enterFrom · corte seco en el beat: la botella marrón ya está en cuadro, flash blanco de 3f.
//     exitTo    · CÁMARA: z≈250, ry≈3.4°. LUZ: virando a blanco limpio (bone 0.45).
//                 MATERIA: la carta de la papa (clip h70) escala hasta llenar el cuadro → la
//                 espuma de esa carta ES el cuadro cuando entra el acto 4 (zoom-through).
//
// acto 4  f690–948  IT LIFTS IT OFF THE WALL
//     enterFrom · salimos DENTRO del macro h48 (el borde de la capa cediendo) a pantalla de marco.
//     exitTo    · CÁMARA: z≈300, ry≈4.4°. LUZ: blanco limpio (bone 0.8).
//                 MATERIA: la LÁMINA (foto h39 usada como lámina real) se despega y sale de
//                 cuadro tapando el corte → oclusión.
//
// acto 5  f948–1137 WATER AND OXYGEN
//     enterFrom · la lámina termina de cruzar; detrás ya corre el macro de la espuma (clip h47).
//     exitTo    · CÁMARA: z=330, pero el remate vive FUERA de la cámara: plano, centrado, quieto.
//                 LUZ: blanco limpio, atmósfera bajando a negro.
//                 MATERIA: dos burbujas se vuelven H₂O y O₂ (match-shape) y se APLANAN en una
//                 página de papel hueso con filete rojo → recibe el overlay de la guía.
//
// ── COSTURAS (una distinta por frontera) ────────────────────────────────────────────────────
// 1→2  f246  WIPE POR MATERIA — la lavandina misma barre el cuadro (frente pálido + hilos).
//            Es la materia del acto la que hace el corte: el blanqueador tapa lo que blanquea.
// 2→3  f450  CORTE EN EL BEAT — corte seco + flash de 3 frames + pop de escala. Cambia el
//            argumento (deja de ser el problema, empieza el remedio): el corte tiene que doler.
// 3→4  f690  ZOOM-THROUGH — la carta de la papa escala ×9 hasta que su espuma es el cuadro, y
//            salimos dentro del macro del borde. Pasamos A TRAVÉS del material, no cortamos.
// 4→5  f948  OCLUSIÓN — la lámina despegada cruza el cuadro y tapa el 100% (Occluder + la
//            lámina real saliendo). El espectador ve pasar un objeto, no un corte.
//
// ── MATERIAL REAL DENTRO DE CADA TARJETA ────────────────────────────────────────────────────
// A1 hero  : CLIP  broll/mddrain_h45_bleachdown.mp4  (apoya la jarra de lavandina)
// A1 capa  : FOTO  img/mddrain_h39_scrapefilm.jpg    (×2: normal + blanqueada, clip-path)
// A2 hero  : CLIP  broll/mddrain_h20_packwad.mp4     (la boca del desagüe: arriba parece limpio)
// A2 capa  : la misma FOTO h39 que cruzó, con la colonia repoblando
// A3 hero  : CLIP  broll/mddrain_h49_bottlehold.mp4  (la botella marrón, etiqueta al frente)
// A3 prueba: CLIP  broll/mddrain_h70_potatotest.mp4  (peróxido sobre la papa, espuma)
// A4 hero  : CLIP  broll/mddrain_h48_liftlayer.mp4   (macro: la espuma levanta el borde)
// A4 corte : FOTO  img/mddrain_h39_scrapefilm.jpg    (la lámina que se despega, material real)
// A5 hero  : CLIP  broll/mddrain_h47_foamdrain.mp4   (la espuma desbordando el desagüe)
// camas    : los `_blur.jpg` hermanos de h45 / h20 / h49 / h48 / h47, uno por acto.
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  interpolate, useCurrentFrame, Easing,
} from "remotion";
import {
  MD, rgba, lerp, clamp01, rnd, cam, Atmos, Occluder, glassStyle, Sheen,
  Kicker, Title, Em, TextBed, F_SANS, F_SERIF,
} from "../mdmold/Stage";
import { Foam, PipeWall, DR } from "./Pipe";

// ── RELOJ DEL MOVIMIENTO ────────────────────────────────────────────────────────────────────
const A1 = 0, A2 = 246, A3 = 450, A4 = 690, A5 = 948;

// ── MATERIAL ────────────────────────────────────────────────────────────────────────────────
const CLIP = {
  bleach: "broll/mddrain_h45_bleachdown.mp4",
  wad: "broll/mddrain_h20_packwad.mp4",
  bottle: "broll/mddrain_h49_bottlehold.mp4",
  potato: "broll/mddrain_h70_potatotest.mp4",
  lift: "broll/mddrain_h48_liftlayer.mp4",
  foam: "broll/mddrain_h47_foamdrain.mp4",
};
const PHOTO = { scrape: "img/mddrain_h39_scrapefilm.jpg" };
const BED = {
  bleach: "img/mddrain_h45_bleachdown_blur.jpg",
  wad: "img/mddrain_h20_packwad_blur.jpg",
  bottle: "img/mddrain_h49_bottlehold_blur.jpg",
  lift: "img/mddrain_h48_liftlayer_blur.jpg",
  foam: "img/mddrain_h47_foamdrain_blur.jpg",
};

const BONE = "#F1EDE3";
const INK = "#14120F";

// ── UTILIDADES PURAS (⛔ nada de Math.random / Date.now) ─────────────────────────────────────
const hx = (h: string): number[] => {
  const x = parseInt(h.replace("#", ""), 16);
  return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
};
const mixc = (c1: string, c2: string, k: number) => {
  const a = hx(c1), b = hx(c2), t = clamp01(k);
  return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
};
// rampa con easing; el inputRange NUNCA puede ser no-creciente (mata el chunk)
const ramp = (f: number, a: number, b: number, curve?: (n: number) => number) =>
  interpolate(f, [a, Math.max(a + 1, b)], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: curve ?? Easing.bezier(0.22, 0.68, 0.16, 1),
  });
// ventana de opacidad con entrada/salida
const win = (f: number, a: number, b: number, i = 14, o = 14) => {
  const p1 = a + i;
  const p2 = Math.max(p1 + 1, b - o);
  const p3 = Math.max(p2 + 1, b);
  return interpolate(f, [a, p1, p2, p3], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
};

// ── PLANO 1: LA CAMA DE FOTO (fuera de la cámara, parallax propio y lentísimo) ───────────────
const Bed: React.FC<{ src: string; f: number; op?: number; drift?: number }> = ({ src, f, op = 1, drift = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", opacity: op }}>
    <Img
      src={staticFile(src)}
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${(1.13 + drift * 0.06).toFixed(4)}) translate3d(${(Math.sin(f / 233) * 16).toFixed(2)}px, ${(Math.cos(f / 301) * 10 - drift * 20).toFixed(2)}px, 0)`,
      }}
    />
    <AbsoluteFill style={{ background: "rgba(6,7,9,0.66)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(78% 66% at 50% 44%, rgba(0,0,0,0) 32%, rgba(0,0,0,0.84) 100%)" }} />
  </AbsoluteFill>
);

// ── GRADE DEL CANAL (va encima de todo material real) ───────────────────────────────────────
const Grade: React.FC<{ darken?: number; vig?: number }> = ({ darken = 0.12, vig = 0.46 }) => (
  <>
    <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: `rgba(0,0,0,${darken})` }} />
    <AbsoluteFill style={{ background: `radial-gradient(92% 80% at 50% 44%, rgba(0,0,0,0) 44%, rgba(0,0,0,${vig}) 100%)` }} />
  </>
);

// ── CLIP REAL DENTRO DE UNA TARJETA ─────────────────────────────────────────────────────────
// El clip dura 121 frames a 24 fps. La Sequence rebasea el tiempo para que el video empiece por
// su principio aunque la tarjeta se monte en el frame 690 del movimiento.
const ClipBody: React.FC<{ src: string; startFrom: number; dur: number; push: number }> = ({ src, startFrom, dur, push }) => {
  const f = useCurrentFrame();
  const s = 1 + push * interpolate(f, [0, Math.max(1, dur)], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  return (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      startFrom={startFrom}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }}
    />
  );
};
const ClipIn: React.FC<{
  from: number; dur: number; src: string; startFrom?: number; push?: number; darken?: number;
}> = ({ from, dur, src, startFrom = 4, push = 0.05, darken = 0.12 }) => (
  <>
    <Sequence from={from} durationInFrames={dur}>
      <ClipBody src={src} startFrom={startFrom} dur={dur} push={push} />
    </Sequence>
    <Grade darken={darken} />
  </>
);

// ── FOTO REAL DENTRO DE UNA TARJETA ─────────────────────────────────────────────────────────
const PhotoIn: React.FC<{ src: string; f: number; k?: number; filter?: string }> = ({ src, f, k = 0, filter }) => (
  <Img
    src={staticFile(src)}
    style={{
      width: "100%", height: "100%", objectFit: "cover", filter,
      transform: `scale(${(1.06 + k * 0.09).toFixed(4)}) translate3d(${(Math.sin(f / 97) * 6).toFixed(2)}px, ${(-k * 14).toFixed(2)}px, 0)`,
    }}
  />
);

// ── LA TARJETA (vidrio + marco + sombra de contacto que aterriza + bisel) ────────────────────
const Plate: React.FC<{
  w: number; h: number; x?: number; y?: number; z?: number;
  rot?: number; ry?: number; rx?: number; s?: number; op?: number;
  radius?: number; lit?: number; drop?: number; children: React.ReactNode;
}> = ({ w, h, x = 0, y = 0, z = 0, rot = 0, ry = 0, rx = 0, s = 1, op = 1, radius = 16, lit = 1, drop = 1, children }) => {
  const g = glassStyle({ radius, lit });
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2,
        transform:
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) ` +
          `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`,
        transformStyle: "preserve-3d",
        opacity: op,
      }}
    >
      {drop > 0.01 && (
        <div
          style={{
            position: "absolute", left: "6%", right: "6%",
            bottom: -Math.round(h * 0.05), height: Math.round(h * 0.15),
            borderRadius: "50%", background: `rgba(0,0,0,${(0.74 * drop).toFixed(2)})`,
            filter: `blur(${Math.round(16 + h * 0.035)}px)`,
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, ...g, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 7, borderRadius: Math.max(2, radius - 6),
            overflow: "hidden", backgroundColor: MD.ink0,
          }}
        >
          {children}
        </div>
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: radius, pointerEvents: "none",
            background: `linear-gradient(148deg, ${rgba(MD.white, 0.17 * lit)} 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 72%, ${rgba(MD.cold, 0.10 * lit)} 100%)`,
          }}
        />
      </div>
    </div>
  );
};

// Rótulo de esquina de una tarjeta (vive dentro del marco, sobre cama oscura).
const PlateTag: React.FC<{ children: React.ReactNode; color?: string; op?: number }> = ({ children, color = MD.white, op = 1 }) => (
  <div style={{ position: "absolute", left: 16, bottom: 14, opacity: op, display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 26, height: 3, borderRadius: 2, background: MD.red }} />
    <div
      style={{
        font: `700 19px/1 ${F_SANS}`, letterSpacing: 2.2, textTransform: "uppercase", color,
        textShadow: "0 2px 12px rgba(0,0,0,0.95)",
      }}
    >
      {children}
    </div>
  </div>
);

// ── EL ANDAMIO: la matriz que la lavandina NO toca ──────────────────────────────────────────
const Scaffold: React.FC<{ op: number; n?: number; glow?: number }> = ({ op, n = 30, glow = 0 }) => {
  const f = useCurrentFrame();
  if (op <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 3.1), b = rnd(i * 8.3), cc = rnd(i * 5.7);
        const br = 0.94 + Math.sin(f / (63 + cc * 40) + i) * 0.06;
        return (
          <div
            key={`l${i}`}
            style={{
              position: "absolute", left: `${(a * 94).toFixed(1)}%`, top: `${(b * 90).toFixed(1)}%`,
              width: 54 + cc * 210, height: 2.6, borderRadius: 3,
              background: `linear-gradient(90deg, ${rgba(INK, 0)} 0%, ${rgba(INK, 0.92 * br)} 16%, ${rgba(INK, 0.92 * br)} 84%, ${rgba(INK, 0)} 100%)`,
              transform: `rotate(${(a * 180).toFixed(1)}deg)`,
              boxShadow: glow > 0.02 ? `0 0 10px ${rgba(MD.red, 0.45 * glow)}` : undefined,
            }}
          />
        );
      })}
      {Array.from({ length: Math.round(n * 0.6) }, (_, i) => {
        const a = rnd(i * 11.3), b = rnd(i * 2.7);
        const r = 5 + rnd(i * 6.1) * 8;
        return (
          <div
            key={`n${i}`}
            style={{
              position: "absolute", left: `${(a * 94).toFixed(1)}%`, top: `${(b * 90).toFixed(1)}%`,
              width: r, height: r, borderRadius: "50%",
              background: `radial-gradient(circle at 38% 32%, ${rgba(INK, 0.95)} 0%, ${rgba(INK, 0.55)} 100%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LA COLONIA VOLVIENDO (acto 2) ───────────────────────────────────────────────────────────
const Recolonise: React.FC<{ p: number; n?: number }> = ({ p, n = 36 }) => {
  const f = useCurrentFrame();
  const t = clamp01(p);
  if (t <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 4.7), b = rnd(i * 9.1), cc = rnd(i * 1.9);
        const born = a * 0.55;
        const g = clamp01((t - born) / 0.45);
        if (g <= 0) return null;
        const r = (10 + cc * 62) * g;
        const br = 0.92 + Math.sin(f / (51 + cc * 34) + i) * 0.08;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${(a * 92).toFixed(1)}%`, top: `${(b * 88).toFixed(1)}%`,
              width: r, height: r * (0.62 + b * 0.7), borderRadius: "44%",
              background: `radial-gradient(circle at 38% 32%, ${DR.filmLit} 0%, ${DR.film} 62%, ${rgba(DR.film, 0.2)} 100%)`,
              opacity: (0.42 + cc * 0.5) * g * br,
              filter: "blur(1.4px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── HILOS DE PERÓXIDO METIÉNDOSE POR LAS GRIETAS (acto 3) ───────────────────────────────────
const Wick: React.FC<{ p: number; n?: number }> = ({ p, n = 16 }) => {
  const f = useCurrentFrame();
  const t = clamp01(p);
  if (t <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 6.7), b = rnd(i * 3.3);
        const delay = a * 0.35;
        const g = clamp01((t - delay) / 0.6);
        if (g <= 0) return null;
        const wob = Math.sin(f / (17 + b * 11) + i) * 1.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${(3 + a * 92).toFixed(1)}%`, top: 0,
              width: 2.4 + b * 2.4, height: `${(g * (46 + b * 52)).toFixed(1)}%`,
              transform: `translateX(${wob.toFixed(2)}px) rotate(${((a - 0.5) * 5).toFixed(2)}deg)`,
              transformOrigin: "50% 0%",
              background: `linear-gradient(180deg, ${rgba(MD.white, 0.86)} 0%, ${rgba(MD.cold, 0.5)} 55%, rgba(255,255,255,0) 100%)`,
              boxShadow: `0 0 12px ${rgba(MD.white, 0.5)}`,
              borderRadius: 3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── COSTURA 1→2 · WIPE POR MATERIA: la lavandina barre el cuadro ────────────────────────────
const BleachFront: React.FC<{ at: number; dur?: number }> = ({ at, dur = 30 }) => {
  const f = useCurrentFrame();
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const W = 240; // % de pantalla: garantiza cobertura total en el medio del barrido
  const left = interpolate(p, [0, 1], [104, -(W + 6)], { easing: Easing.bezier(0.38, 0, 0.18, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-24%", height: "148%",
          left: `${left.toFixed(2)}%`, width: `${W}%`, transform: "rotate(6deg)",
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(BONE, 0.5)} 3%, ${BONE} 9%, #FFFFFF 50%, ${BONE} 91%, ${rgba(BONE, 0.5)} 97%, rgba(255,255,255,0) 100%)`,
          boxShadow: `0 0 160px 60px ${rgba(BONE, 0.55)}`,
        }}
      />
      {/* hilos del borde de ataque: el líquido tiene textura, no es una cortina */}
      {Array.from({ length: 13 }, (_, i) => {
        const a = rnd(i * 7.9), b = rnd(i * 2.3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(left + 3 + a * 8).toFixed(2)}%`, top: `${(b * 88).toFixed(1)}%`,
              width: 5 + a * 12, height: 40 + b * 150, borderRadius: 12,
              background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(BONE, 0.8)} 40%, rgba(255,255,255,0) 100%)`,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── COSTURA INTERNA DEL ACTO 4: barrido de espuma dentro del marco ──────────────────────────
const FoamSweep: React.FC<{ at: number; dur?: number }> = ({ at, dur = 26 }) => {
  const f = useCurrentFrame();
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const left = interpolate(p, [0, 1], [-130, 120], { easing: Easing.bezier(0.34, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-20%", height: "140%", left: `${left.toFixed(2)}%`, width: "130%",
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(DR.foam, 0.72)} 22%, #FFFFFF 52%, ${rgba(DR.foam, 0.72)} 78%, rgba(255,255,255,0) 100%)`,
          transform: "rotate(-4deg)",
        }}
      />
      {Array.from({ length: 26 }, (_, i) => {
        const a = rnd(i * 5.3), b = rnd(i * 8.9);
        const r = 8 + a * 44;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${(left + 12 + a * 100).toFixed(2)}%`, top: `${(b * 92).toFixed(1)}%`,
              width: r, height: r, borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.98) 0%, ${rgba(DR.foam, 0.8)} 46%, rgba(255,255,255,0.12) 100%)`,
              opacity: 0.85,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── PLANO DE PRIMER TÉRMINO: micro-burbujas fuera de foco ───────────────────────────────────
const Motes: React.FC<{ f: number; n?: number; op?: number }> = ({ f, n = 18, op = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(i * 1.7), b = rnd(i * 4.3), cc = rnd(i * 9.5);
      const y = (f / (300 + a * 280) + b) % 1;
      const r = 4 + cc * 13;
      return (
        <div
          key={i}
          style={{
            position: "absolute", left: `${(a * 100).toFixed(1)}%`, top: `${((1 - y) * 112 - 6).toFixed(1)}%`,
            width: r, height: r, borderRadius: "50%",
            background: "radial-gradient(circle at 36% 32%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.16) 66%, rgba(255,255,255,0) 100%)",
            filter: "blur(1.8px)",
            opacity: 0.2 + cc * 0.55,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── EL CONTADOR DE DÍAS (acto 2) ────────────────────────────────────────────────────────────
const DayCount: React.FC<{ p: number }> = ({ p }) => {
  const t = clamp01(p);
  const d = Math.max(1, Math.round(1 + t * 8));
  return (
    <div style={{ textAlign: "left" }}>
      <div
        style={{
          font: `800 138px/0.9 ${F_SANS}`, letterSpacing: -6, color: MD.white,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 8px 40px rgba(0,0,0,0.95), 0 0 60px ${rgba(MD.cold, 0.28)}`,
        }}
      >
        {String(d).padStart(2, "0")}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
        <div style={{ width: Math.round(40 + t * 150), height: 4, borderRadius: 2, background: MD.red, boxShadow: `0 0 18px ${rgba(MD.red, 0.6)}` }} />
        <div style={{ font: `700 24px/1 ${F_SANS}`, letterSpacing: 3.4, textTransform: "uppercase", color: rgba(MD.white, 0.82) }}>
          days later
        </div>
      </div>
    </div>
  );
};

// ── EL REMATE: la página de papel hueso que recibe el overlay de la guía ────────────────────
const PaperOut: React.FC<{ f: number }> = ({ f }) => {
  const open = ramp(f, 1064, 1102, Easing.bezier(0.18, 0.9, 0.22, 1));
  const type = ramp(f, 1086, 1112);
  const push = 1 + 0.028 * ramp(f, 1064, 1137, Easing.bezier(0.3, 0, 0.25, 1));
  const sweep = interpolate(f, [1076, 1124], [-40, 142], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (open <= 0.001) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "relative", width: 1160, height: 560, borderRadius: 3,
          background: `linear-gradient(168deg, #FBF8F1 0%, ${BONE} 46%, #E4DFD2 100%)`,
          boxShadow: "0 44px 110px rgba(0,0,0,0.72), 0 4px 12px rgba(0,0,0,0.5)",
          transform: `scaleY(${(0.03 + open * 0.97).toFixed(4)}) scale(${push.toFixed(4)})`,
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ opacity: type, textAlign: "center", padding: "0 70px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 26 }}>
            <div style={{ width: 64, height: 4, background: MD.red, borderRadius: 2 }} />
            <div style={{ font: `700 22px/1 ${F_SANS}`, letterSpacing: 4.6, textTransform: "uppercase", color: "#8A2018" }}>
              when it is done
            </div>
            <div style={{ width: 64, height: 4, background: MD.red, borderRadius: 2 }} />
          </div>
          <div style={{ font: `800 84px/1.02 ${F_SANS}`, letterSpacing: -2, color: INK }}>
            Water and{" "}
            <span style={{ fontFamily: F_SERIF, fontStyle: "italic", fontWeight: 500, color: "#B3271F" }}>oxygen</span>.
          </div>
          <div style={{ marginTop: 24, font: `500 32px/1.3 ${F_SANS}`, letterSpacing: 0.4, color: "rgba(20,18,15,0.66)" }}>
            Nothing left in the trap. Nothing that kills a septic tank.
          </div>
        </div>
        {/* el papel tiene brillo: nunca es un PNG pegado */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(102deg, rgba(255,255,255,0) ${(sweep - 24).toFixed(1)}%, rgba(255,255,255,0.55) ${sweep.toFixed(1)}%, rgba(255,255,255,0) ${(sweep + 24).toFixed(1)}%)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 90px rgba(120,105,80,0.22)", pointerEvents: "none" }} />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovLift: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;

  // ── UNA sola cámara, función del frame GLOBAL: nunca vuelve a cero ────────────────────────
  const c = cam(frame, { z0: 40, z1: 330, panX: -84, panY: -44, ry: 4.6, rx: -1.5, dur: D });

  // ── LA LUZ EVOLUCIONA: fría de la ventanita → blanco limpio ───────────────────────────────
  const lightT = interpolate(frame, [0, A3, A4, D], [0, 0.34, 0.72, 1], { extrapolateRight: "clamp" });
  const tint = mixc(MD.cold, "#F4F1EA", lightT);
  const atmoOut = interpolate(frame, [1052, 1116], [1, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── ACTO 1 ────────────────────────────────────────────────────────────────────────────────
  const a1 = frame >= A1 && frame < A2;
  const bleach = ramp(frame, 96, 214, Easing.bezier(0.34, 0.02, 0.2, 1));   // el color se va
  const scaffoldOn = ramp(frame, 128, 226);

  // ── ACTO 2 ────────────────────────────────────────────────────────────────────────────────
  const a2 = frame >= A2 && frame < A3;
  const days = ramp(frame, A2 + 30, A2 + 176, Easing.bezier(0.4, 0, 0.2, 1));

  // ── ACTO 3 ────────────────────────────────────────────────────────────────────────────────
  const a3 = frame >= A3 && frame < A4 + 6;
  const wick = ramp(frame, A3 + 92, A3 + 206, Easing.bezier(0.3, 0.7, 0.2, 1));
  const zoomThru = ramp(frame, 664, 694, Easing.bezier(0.5, 0, 0.86, 0.4)); // costura 3→4
  const potatoS = 1 + zoomThru * 8.4;

  // ── ACTO 4 ────────────────────────────────────────────────────────────────────────────────
  const a4 = frame >= A4 - 2 && frame < A5 + 4;
  const cutaway = frame >= 828;                        // barrido de espuma interno en f816-842
  const peel = ramp(frame, 852, 944, Easing.bezier(0.32, 0, 0.14, 1));
  const underFoam = ramp(frame, 836, 926);

  // ── ACTO 5 ────────────────────────────────────────────────────────────────────────────────
  const a5 = frame >= A5 - 2;
  const rise = ramp(frame, 986, 1052);                 // burbujas subiendo
  const flat = ramp(frame, 1052, 1092, Easing.bezier(0.4, 0, 0.2, 1));     // se aplanan al papel
  const glyphOn = frame >= 1002 && frame < 1100;

  // ── LA CAMA: una foto real por acto, cambia SIEMPRE tapada por la costura ─────────────────
  const bedSrc = frame < A2 ? BED.bleach : frame < A3 ? BED.wad : frame < A4 ? BED.bottle : frame < A5 ? BED.lift : BED.foam;
  const bedOp = interpolate(frame, [0, 12, 1046, 1104], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // flash del corte en el beat (2→3)
  const beatFlash = interpolate(frame, [A3, A3 + 2, A3 + 7], [0.34, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* PLANO 1 — cama de foto real, parallax lentísimo propio */}
      <Bed src={bedSrc} f={frame} op={bedOp} drift={c.e} />

      {/* PLANO 2 — la atmósfera del cuarto: se monta UNA vez y nunca se remonta */}
      <Atmos tint={tint} keyFrom={interpolate(frame, [0, D], [0.16, 0.78])} intensity={(0.8 + lightT * 0.42) * atmoOut} />

      {/* ═══ EL MUNDO 3D: una sola cámara para los cinco actos ═══ */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1920, height: 1080, transform: c.transform, transformStyle: "preserve-3d" }}>

          {/* PLANO 3 — estructura: los rieles del caño en corte, muy atrás */}
          <div
            style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate3d(-1040px,-540px,-300px)",
              opacity: 0.4 * (1 - flat * 0.9), transformStyle: "preserve-3d",
            }}
          >
            <PipeWall w={280} h={1080} filmT={clamp01(1 - peel * 0.95)} lit={0.5 + lightT * 0.5} />
          </div>
          <div
            style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate3d(760px,-540px,-300px)",
              opacity: 0.34 * (1 - flat * 0.9), transformStyle: "preserve-3d",
            }}
          >
            <PipeWall w={280} h={1080} filmT={clamp01(1 - peel * 0.95)} lit={0.4 + lightT * 0.5} />
          </div>

          {/* ─────────────── ACTO 1 · BLEACH TAKES THE COLOUR ─────────────── */}
          {a1 && (
            <>
              {/* PLANO 5 — HERO: el clip real de la jarra de lavandina apoyándose en el piso */}
              <Plate
                w={790} h={470} x={-334} y={-96} z={26}
                ry={lerp(9, 2.4, ramp(frame, 0, 200))}
                rx={-1.6}
                s={lerp(0.94, 1.02, ramp(frame, 0, 140, Easing.bezier(0.16, 0.86, 0.2, 1)))}
                op={win(frame, 0, 140, 10, 26)}
                radius={18}
              >
                <ClipIn from={0} dur={140} src={CLIP.bleach} startFrom={4} push={0.055} darken={0.14} />
                <Sheen at={22} dur={34} />
                <PlateTag op={ramp(frame, 16, 34)}>bleach · 30 seconds</PlateTag>
              </Plate>

              {/* PLANO 4 — LA CAPA: foto real ×2 (normal + blanqueada) con el ANDAMIO encima.
                  Es la carta que CRUZA la frontera hacia el acto 2. */}
              <Plate
                w={648} h={430}
                x={lerp(384, 300, ramp(frame, 120, 246))}
                y={lerp(70, 12, ramp(frame, 120, 246))}
                z={lerp(-92, -30, ramp(frame, 120, 246))}
                ry={lerp(-15, -8, ramp(frame, 110, 246))}
                rx={2}
                s={lerp(0.9, 1, ramp(frame, 104, 168, Easing.bezier(0.16, 0.86, 0.2, 1)))}
                op={win(frame, 104, A2, 18, 0)}
                radius={14}
              >
                <PhotoIn src={PHOTO.scrape} f={frame} k={ramp(frame, 104, 246)} filter="saturate(1.06) contrast(1.06)" />
                {/* el frente de lavandina baja y le saca el color — clip-path, no fade */}
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(100 - bleach * 100).toFixed(2)}% 0)` }}>
                  <PhotoIn src={PHOTO.scrape} f={frame} k={ramp(frame, 104, 246)} filter="saturate(0.07) brightness(2.15) contrast(0.84)" />
                  <Scaffold op={scaffoldOn} n={30} glow={ramp(frame, 176, 234)} />
                </div>
                {/* el borde mojado del frente */}
                {bleach > 0.02 && bleach < 0.995 && (
                  <div
                    style={{
                      position: "absolute", left: 0, right: 0, top: `${(bleach * 100).toFixed(2)}%`, height: 5,
                      background: `linear-gradient(180deg, ${rgba(MD.white, 0.95)} 0%, ${rgba(BONE, 0.2)} 100%)`,
                      boxShadow: `0 0 22px ${rgba(MD.white, 0.75)}`,
                    }}
                  />
                )}
                <Grade darken={0.06} vig={0.4} />
                <PlateTag op={ramp(frame, 182, 208)}>matrix · untouched</PlateTag>
              </Plate>
            </>
          )}

          {/* ─────────────── ACTO 2 · NINE DAYS AND IT'S BACK ─────────────── */}
          {a2 && (
            <>
              {/* la MISMA carta de película que venía del acto 1: sigue viva, ahora repoblándose */}
              <Plate
                w={700} h={452}
                x={lerp(300, -352, ramp(frame, A2, A2 + 46, Easing.bezier(0.2, 0.85, 0.24, 1)))}
                y={lerp(12, -74, ramp(frame, A2, A2 + 46))}
                z={lerp(-30, 34, ramp(frame, A2, A2 + 60))}
                ry={lerp(-8, 7, ramp(frame, A2, A2 + 60))}
                rx={1.2}
                s={lerp(0.98, 1.06, ramp(frame, A2, A2 + 120))}
                op={win(frame, A2, A3, 2, 22)}
                radius={16}
              >
                <PhotoIn src={PHOTO.scrape} f={frame} k={ramp(frame, A2, A3)} filter="saturate(0.07) brightness(2.15) contrast(0.84)" />
                <Scaffold op={0.94} n={30} glow={0.22} />
                <Recolonise p={days} n={36} />
                <Grade darken={0.05} vig={0.42} />
                <Sheen at={A2 + 54} dur={30} />
                <PlateTag op={ramp(frame, A2 + 16, A2 + 34)}>the same wall · day 9</PlateTag>
              </Plate>

              {/* la boca del desagüe: arriba todo parece limpio — clip real */}
              <Plate
                w={608} h={398}
                x={lerp(452, 372, ramp(frame, A2 + 6, A2 + 150))}
                y={lerp(150, 108, ramp(frame, A2 + 6, A2 + 150))}
                z={-86}
                ry={-16} rx={3}
                s={lerp(0.88, 0.99, ramp(frame, A2 + 6, A2 + 74, Easing.bezier(0.16, 0.86, 0.2, 1)))}
                op={win(frame, A2 + 6, A2 + 142, 16, 22)}
                radius={14}
              >
                <ClipIn from={A2 + 6} dur={136} src={CLIP.wad} startFrom={6} push={0.04} darken={0.16} />
                <PlateTag op={ramp(frame, A2 + 22, A2 + 40)}>looks clean from the top</PlateTag>
              </Plate>

              {/* PLANO 6 — el contador, adelante de todo, con cama oscura */}
              <div
                style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: `translate3d(${lerp(150, 96, ramp(frame, A2 + 30, A2 + 190)).toFixed(1)}px, -300px, 128px)`,
                  opacity: win(frame, A2 + 26, A3, 16, 18),
                }}
              >
                <TextBed pad={22}>
                  <DayCount p={days} />
                </TextBed>
              </div>
            </>
          )}

          {/* ─────────────── ACTO 3 · THIN AS WATER ─────────────── */}
          {a3 && (
            <>
              {/* HERO: la botella marrón, clip real, etiqueta al frente */}
              <Plate
                w={772} h={478}
                x={lerp(-250, -300, ramp(frame, A3, A3 + 210))}
                y={-104}
                z={lerp(10, 48, ramp(frame, A3, A3 + 210))}
                ry={lerp(11, 3, ramp(frame, A3, A3 + 180))}
                rx={-1.4}
                s={lerp(1.06, 1, ramp(frame, A3, A3 + 30, Easing.bezier(0.1, 0.94, 0.2, 1)))}
                op={win(frame, A3, A3 + 142, 6, 26)}
                radius={18}
              >
                <ClipIn from={A3 + 6} dur={136} src={CLIP.bottle} startFrom={6} push={0.05} darken={0.12} />
                <Sheen at={A3 + 30} dur={32} />
                <PlateTag op={ramp(frame, A3 + 18, A3 + 36)}>3% · thinner than water</PlateTag>
              </Plate>

              {/* la pared en corte, entre las dos cartas: por acá se mete el líquido */}
              <div
                style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: "translate3d(-1140px, 206px, -220px)",
                  width: 2280, height: 178, opacity: win(frame, A3 + 74, A3 + 226, 20, 22),
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    position: "absolute", inset: 0, borderRadius: 6, overflow: "hidden",
                    background: `linear-gradient(180deg, ${DR.film} 0%, ${DR.filmWet} 44%, ${DR.pvcDark} 78%, ${DR.pvc} 100%)`,
                    boxShadow: "0 26px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Wick p={wick} n={16} />
                  <div
                    style={{
                      position: "absolute", left: 16, top: 12,
                      font: `700 18px/1 ${F_SANS}`, letterSpacing: 2.4, textTransform: "uppercase",
                      color: rgba(MD.white, 0.72), textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                    }}
                  >
                    cross-section · the cracks bleach never reaches
                  </div>
                </div>
              </div>

              {/* PRUEBA: la papa. Clip real. Y ES la carta que hace el ZOOM-THROUGH al acto 4. */}
              <Plate
                w={588} h={372}
                x={lerp(408, 300, zoomThru)}
                y={lerp(-24, 0, zoomThru)}
                z={lerp(-64, 300, zoomThru)}
                ry={lerp(-14, 0, zoomThru)}
                rx={lerp(3, 0, zoomThru)}
                s={lerp(0.9, 1, ramp(frame, A3 + 122, A3 + 186, Easing.bezier(0.16, 0.86, 0.2, 1))) * potatoS}
                op={win(frame, A3 + 122, A4 + 6, 14, 0)}
                radius={lerp(14, 0, zoomThru)}
                lit={1 - zoomThru}
                drop={1 - zoomThru}
              >
                <ClipIn from={A3 + 122} dur={124} src={CLIP.potato} startFrom={8} push={0.05} darken={0.1} />
                {zoomThru < 0.2 && <PlateTag op={ramp(frame, A3 + 138, A3 + 156)}>live tissue · it foams by itself</PlateTag>}
              </Plate>
            </>
          )}

          {/* ─────────────── ACTO 4 · IT LIFTS IT OFF THE WALL ─────────────── */}
          {a4 && frame < 950 && (
            <Plate
              w={1000} h={560}
              x={lerp(0, -40, ramp(frame, A4, 848))}
              y={-52}
              z={lerp(70, 40, ramp(frame, A4, 848))}
              ry={lerp(-2.6, 2.2, ramp(frame, A4, 848))}
              rx={-1}
              s={lerp(1.1, 1, ramp(frame, A4, A4 + 34, Easing.bezier(0.1, 0.94, 0.22, 1)))}
              op={win(frame, A4 - 4, 950, 6, 4)}
              radius={18}
            >
              {!cutaway && (
                <>
                  <ClipIn from={A4 - 2} dur={140} src={CLIP.lift} startFrom={2} push={0.06} darken={0.1} />
                  <Foam p={ramp(frame, A4 + 40, 824)} count={40} x={50} spread={96} />
                  <PlateTag op={ramp(frame, A4 + 20, A4 + 40)}>macro · the edge letting go</PlateTag>
                </>
              )}
              {/* CORTE del caño: la LÁMINA es la foto real de la película raspada */}
              {cutaway && (
                <>
                  <AbsoluteFill
                    style={{ background: `linear-gradient(176deg, #F0EDE6 0%, ${DR.pvc} 40%, ${DR.pvcDark} 100%)` }}
                  />
                  <AbsoluteFill
                    style={{ background: `radial-gradient(70% 40% at 30% 6%, ${rgba(MD.white, 0.5)} 0%, rgba(255,255,255,0) 70%)` }}
                  />
                  {/* las burbujas NACEN debajo */}
                  <Foam p={underFoam} count={78} x={48} spread={104} />
                  {/* la lámina real, despegándose por el borde de abajo-izquierda */}
                  <div
                    style={{
                      position: "absolute", inset: 0, transformOrigin: "0% 100%",
                      transform: `translate3d(${(peel * 26).toFixed(2)}%, ${(-peel * 132).toFixed(2)}%, 0) rotate(${(-peel * 8).toFixed(2)}deg) scale(${(1 + peel * 0.24).toFixed(4)})`,
                      boxShadow: peel > 0.02 ? "0 34px 70px rgba(0,0,0,0.72)" : undefined,
                    }}
                  >
                    <Img
                      src={staticFile(PHOTO.scrape)}
                      style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.1) brightness(0.92)" }}
                    />
                    {/* el rulo del borde que se levanta */}
                    <div
                      style={{
                        position: "absolute", left: 0, right: 0, bottom: 0, height: 26 + peel * 30,
                        background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(DR.filmLit, 0.9)} 60%, ${rgba(MD.white, 0.5)} 100%)`,
                      }}
                    />
                  </div>
                  {/* la costura de luz donde la espuma entra bajo la lámina */}
                  {peel > 0.01 && peel < 0.98 && (
                    <div
                      style={{
                        position: "absolute", left: "-6%", right: "-6%",
                        bottom: `${(peel * 118 - 4).toFixed(2)}%`, height: 7,
                        transform: `rotate(${(-peel * 8).toFixed(2)}deg)`,
                        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.95)} 22%, ${rgba(DR.foam, 0.95)} 70%, rgba(255,255,255,0) 100%)`,
                        boxShadow: `0 0 34px ${rgba(MD.white, 0.8)}`,
                      }}
                    />
                  )}
                  <Grade darken={0.04} vig={0.36} />
                  <PlateTag op={ramp(frame, 846, 866)}>bubbles born underneath</PlateTag>
                </>
              )}
              {/* barrido de espuma: costura INTERNA del acto (macro → corte) */}
              <FoamSweep at={816} dur={26} />
            </Plate>
          )}

          {/* ─────────────── ACTO 5 · WATER AND OXYGEN ─────────────── */}
          {a5 && (
            <Plate
              w={880} h={496}
              x={0}
              y={lerp(-30, -10, flat)}
              z={lerp(56, -140, flat)}
              ry={lerp(3.4, 0, flat)}
              rx={lerp(-1.4, 0, flat)}
              s={lerp(1, 0.84, flat) * lerp(1, 1.03, ramp(frame, A5, 1050))}
              op={win(frame, A5 - 2, 1084, 8, 30)}
              radius={lerp(18, 4, flat)}
              lit={1 - flat * 0.8}
              drop={1 - flat}
            >
              <ClipIn from={A5 - 2} dur={138} src={CLIP.foam} startFrom={4} push={0.05} darken={0.1} />
              <Sheen at={A5 + 26} dur={30} />
              <PlateTag op={win(frame, A5 + 18, 1040, 16, 16)}>it turns into nothing</PlateTag>
            </Plate>
          )}
        </div>
      </AbsoluteFill>

      {/* PLANO 7 — primer término: micro-burbujas fuera de foco, fuera de la cámara */}
      <Motes f={frame} n={18} op={0.28 + lightT * 0.34} />

      {/* ═══ MATCH-SHAPE: dos burbujas se vuelven H₂O y O₂ ═══ */}
      {glyphOn && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {/* las burbujas que suben del cuadro y paren las letras */}
          <Foam p={rise} count={46} x={50} spread={82} />
          {["H₂O", "O₂"].map((w, i) => {
            const born = 1006 + i * 14;
            const g = ramp(frame, born, born + 46, Easing.bezier(0.16, 0.92, 0.2, 1));
            const dx = lerp(i === 0 ? -280 : 300, i === 0 ? -230 : 236, flat);
            const dy = lerp(64 - i * 18, -6, flat);
            const disc = 1 - g;                       // 1 = todavía burbuja, 0 = ya es letra
            const size = lerp(150, 300, g);
            return (
              <div
                key={w}
                style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: `translate3d(${(dx - size / 2).toFixed(1)}px, ${(dy - size / 2 - disc * 120).toFixed(1)}px, 0)`,
                  width: size, height: size,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: `${(disc * 50).toFixed(1)}%`,
                  background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,${(0.95 * disc).toFixed(2)}) 0%, ${rgba(DR.foam, 0.7 * disc)} 46%, rgba(255,255,255,0) 100%)`,
                  boxShadow: disc > 0.06 ? `inset 0 0 26px ${rgba(MD.white, 0.7 * disc)}` : undefined,
                  opacity: (0.2 + g * 0.8) * (1 - ramp(frame, 1074, 1098)),
                }}
              >
                <div
                  style={{
                    font: `800 ${Math.round(lerp(40, 138, g))}px/1 ${F_SANS}`,
                    letterSpacing: -3,
                    color: mixc("#FFFFFF", INK, flat * 0.85),
                    opacity: g,
                    textShadow: `0 10px 46px rgba(0,0,0,${(0.9 * (1 - flat)).toFixed(2)}), 0 0 70px ${rgba(MD.cold, 0.32 * (1 - flat))}`,
                  }}
                >
                  {w}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* ═══ EL REMATE PLANO: la página de papel que recibe el overlay de la guía ═══ */}
      <PaperOut f={frame} />

      {/* ═══ UNA IDEA DE TEXTO POR ACTO (bloque abajo-izquierda, safe area 110/104) ═══ */}
      <div style={{ position: "absolute", left: 110, bottom: 104, width: 940, height: 250 }}>
        {win(frame, 34, 232) > 0.01 && (
          <div style={{ position: "absolute", left: 0, bottom: 0, opacity: win(frame, 34, 232) }}>
            <TextBed>
              <Kicker>bleach · thirty seconds</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                It only takes the <Em>colour</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {win(frame, A2 + 44, A3 - 12) > 0.01 && (
          <div style={{ position: "absolute", left: 0, bottom: 0, opacity: win(frame, A2 + 44, A3 - 12) }}>
            <TextBed>
              <Kicker>the scaffolding stayed bolted on</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                Nine days and it's <Em>back</Em>
              </Title>
            </TextBed>
          </div>
        )}
        {win(frame, A3 + 40, A3 + 214) > 0.01 && (
          <div style={{ position: "absolute", left: 0, bottom: 0, opacity: win(frame, A3 + 40, A3 + 214) }}>
            <TextBed>
              <Kicker>thin as water</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                It <Em>wicks</Em> into the cracks
              </Title>
            </TextBed>
          </div>
        )}
        {win(frame, A4 + 34, 930) > 0.01 && (
          <div style={{ position: "absolute", left: 0, bottom: 0, opacity: win(frame, A4 + 34, 930) }}>
            <TextBed>
              <Kicker>the one thing a brush can't do</Kicker>
              <div style={{ height: 12 }} />
              <Title size={66}>
                It lifts it <Em>off the wall</Em>
              </Title>
            </TextBed>
          </div>
        )}
      </div>

      {/* ═══ COSTURAS ═══ */}
      {/* 1→2 · WIPE POR MATERIA: la lavandina misma barre el cuadro */}
      <BleachFront at={A2 - 14} dur={30} />
      {/* 2→3 · CORTE EN EL BEAT: flash corto, sin fade */}
      {beatFlash > 0.005 && <AbsoluteFill style={{ background: `rgba(255,255,255,${beatFlash.toFixed(3)})`, pointerEvents: "none" }} />}
      {/* 4→5 · OCLUSIÓN: la lámina despegada cruza y tapa */}
      <Occluder at={936} dur={16} color={DR.film} angle={-7} />

      {/* lavado de luz limpia sobre el final: la escena termina en blanco, no en frío */}
      {lightT > 0.6 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(76% 62% at 50% 44%, ${rgba(BONE, 0.1 * (lightT - 0.6) * 2.5)} 0%, rgba(0,0,0,0) 72%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
