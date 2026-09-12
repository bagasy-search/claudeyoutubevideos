// MovTowelman.tsx — MOVIMIENTO 2 del video `mddrain` (945 frames = 31,5 s @30fps).
//
// EL CORAZÓN EMOCIONAL. El único movimiento SIN datos ni diagramas: sólo luz, foco, silencio y
// un papel. Mike cobró tres veces por pasar la máquina y el olor no se fue; ella terminó
// pidiéndole disculpas A ÉL. Un año después, un mantenimiento de 70 años mojó un papel de
// cocina, lo pasó bajo el borde del desagüe y se lo puso en la cara. Y le dijo la frase.
//
// LA MATERIA QUE CRUZA TODO: **EL PAPEL**. Es UN SOLO elemento vivo durante los 31,5 s —
// entra como el RECIBO que Mike lleva a la puerta (f44), se ensucia, se estrella contra el
// lente y TAPA el salto de un año (f378), vuelve convertido en el PAPEL NEGRO, ocupa el tercio
// derecho, y su MANCHA (que adentro tiene el clip real `h09_blacktowel`) se convierte en el
// SUBRAYADO ROJO de la frase (f776-842). Nunca hay dos papeles: hay uno que envejece.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-190    EL DÍA / TRES VECES
//     enter: el clip `h29_doorway` a sangre (esc. 2,15) = el b-roll del duplex que viene antes.
//            CÁM: z −30, pan 0, sin rotación.  LUZ: día cálido y plano (Atmos warm, int 1.05).
//     exit:  el plano héroe se abre y se traga el lente (esc. 4,5).
//            CÁM: z ≈ +42, pan −14.  LUZ: warm, empieza a perder saturación.
//            MATERIA: el RECIBO (papel, limpio, escala 0,33) flotando en el tercio derecho.
// acto 2  f190-378  LA DISCULPA
//     enter: detrás del plano que atravesamos ya está el monitor de la cámara de caños.
//            CÁM: hereda z +42 y sigue; pan hacia la izquierda.  LUZ: warm → neutra.
//     exit:  el papel gira hacia el lente y ocupa la pantalla.
//            CÁM: z ≈ +80, pan −34.  LUZ: neutra, cayendo.
//            MATERIA: el mismo recibo, ya con 22% de mugre, escala 0,46.
// acto 3  f378-560  EL PASILLO (un año después)
//     enter: sale de detrás del papel: el pasillo del edificio, el viejo.
//            CÁM: z ≈ +80 sin reset, rotateY creciendo.  LUZ: FRÍA (light warm→cold completo),
//            la fuente viaja de keyFrom 0.30 a 0.62.
//     exit:  el pasillo se va de foco (blur 0→5) mientras el papel entra en foco (11→5).
//            CÁM: z ≈ +130.  LUZ: fría, intensidad 0.86.
//            MATERIA: el papel, ahora NEGRO, escala 0,806, desenfocado en el campo cercano.
// acto 4  f560-742  EL PAPEL / EL SILENCIO
//     enter: rack focus terminado: el papel en foco, el pasillo en 0,10 de opacidad.
//            CÁM: z ≈ +130 → +160.  LUZ: fría y bajando (0.86 → 0.34).
//     exit:  todo cae a negro menos el papel; la mancha queda encendida.
//            CÁM: z ≈ +160.  LUZ: casi negro.
//            MATERIA: la MANCHA del papel (con el clip `h09_blacktowel` adentro).
// acto 5  f742-945  LA FRASE / LA CUENTA
//     enter: negro, la mancha flotando sola donde estaba el papel.
//     exit:  ⚠️ NEGRO ABSOLUTO CON UNA SOLA MARCA ROJA VIVA — la barra roja centrada
//            (left 650, top 548, 620×10), latiendo. `MovGravity` arranca EXACTAMENTE de ahí.
//            CÁM: z ≈ +170 (final del recorrido, nunca volvió a 0).  LUZ: 0.10 + brasa roja.
//
// ── COSTURAS (una distinta por frontera, ⛔ ningún fade) ────────────────────────────────────
// 1→2 f190  ZOOM-THROUGH  — el plano héroe se escala a 4,5 y nos come; a los 12 frames tapados
//                           el corte ya pasó. Es una zambullida MENTAL: de la calle a lo que
//                           él estaba mirando en el monitor.
// 2→3 f378  OCLUSIÓN      — el papel gira contra el lente + `<Occluder>` color papel: 8 frames
//                           de cobertura total. El año entero pasa ahí adentro, y el papel sale
//                           del otro lado ya NEGRO (la mugre salta de 0,22 a 1 mientras tapa).
// 3→4 f560  RACK FOCUS    — los dos desenfoques SE CRUZAN en ~5 px al f562: el pasillo se va
//                           (0→5) y el papel llega (11→0). El giro de la historia es un cambio
//                           de atención, no de lugar: la costura tenía que ser óptica.
// 4→5 f776  MATCH-SHAPE   — la mancha (570×272, elipse, #16171A) viaja y se aplana hasta ser el
//                           subrayado (620×10, barra, #FF5A4E) bajo "wrong four inches". La
//                           prueba física se convierte en la frase.
//
// ⛔ CONTRATO TÉCNICO: nada de Math.random/Date.now (todo sale de `rnd()`), nada de
// backdrop-filter, nada de blur grande sobre imagen full-screen (los fondos usan el hermano
// `_blur.jpg` horneado), `Easing.quint` no existe. Todo clip va dentro de un `<Sequence>` para
// que su reloj arranque en 0 al montarse, y cumple `startFrom + ceil(seg*24) + 2 ≤ 121`.
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import {
  MD,
  rgba,
  clamp01,
  lerp,
  rnd,
  cam,
  light,
  Atmos,
  Occluder,
  glassStyle,
  Sheen,
  Kicker,
  Title,
  Em,
  TextBed,
  F_SANS,
} from "../mdmold/Stage";

// ── fronteras de acto ───────────────────────────────────────────────────────────────────────
const A1 = 0, A2 = 190, A3 = 378, A4 = 560, A5 = 742;

// ── easings del movimiento ──────────────────────────────────────────────────────────────────
const E_SET = Easing.bezier(0.24, 0.72, 0.2, 1);    // asentar (entradas)
const E_DIVE = Easing.bezier(0.5, 0, 0.86, 0.34);   // acelerar (la zambullida)
const E_SOFT = Easing.bezier(0.4, 0, 0.2, 1);       // respirar
const E_SNAP = Easing.bezier(0.62, 0, 0.1, 1);      // el latigazo del match-shape

const rp = (f: number, a: number, b: number, e: (t: number) => number = Easing.linear) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const win = (f: number, a: number, b: number, c: number, d: number) =>
  interpolate(f, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const kf = (f: number, xs: number[], ys: number[], e: (t: number) => number = Easing.linear) =>
  interpolate(f, xs, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// el hermano borroso ya horneado (⛔ nunca blur grande sobre una imagen a pantalla completa)
const blurOf = (p: string) => p.replace(/\.(jpg|jpeg|png)$/i, "_blur.jpg");

// ── PLACA DE FONDO ──────────────────────────────────────────────────────────────────────────
// Foto `_blur.jpg` a sangre, con deriva propia. Es el plano MÁS LEJANO (fuera del 3D, para que
// la rotación de la cámara no le descubra los bordes).
const Plate: React.FC<{
  img: string; op: number; k: number; bright: number; sat: number; f: number;
}> = ({ img, op, k, bright, sat, f }) => {
  if (op <= 0.004) return null;
  const dx = Math.sin(f / 148 + k) * 13;
  const dy = Math.cos(f / 196 + k) * 8;
  const s = 1.15 + Math.sin(f / 232 + k) * 0.022;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: op }}>
      <Img
        src={staticFile(img)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${s.toFixed(4)}) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`,
          filter: `brightness(${bright.toFixed(2)}) saturate(${sat.toFixed(2)})`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(88% 78% at 46% 44%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.78) 100%)" }}
      />
    </AbsoluteFill>
  );
};

// ── MATERIAL REAL DENTRO DEL VIDRIO ─────────────────────────────────────────────────────────
// Grade del canal: negro levantado + viraje rojo muy leve + viñeta propia del plano.
const ClipFill: React.FC<{ src: string; startFrom: number; sc?: number; bright?: number }> = ({
  src, startFrom, sc = 1.05, bright = 0.94,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#07080A", overflow: "hidden" }}>
    <OffthreadVideo
      src={staticFile(src)}
      muted
      startFrom={startFrom}
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${sc.toFixed(3)})`,
        filter: `brightness(${bright.toFixed(2)}) saturate(0.88) contrast(1.07)`,
      }}
    />
    <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
    <AbsoluteFill
      style={{ background: "radial-gradient(86% 78% at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.54) 100%)" }}
    />
  </AbsoluteFill>
);

// El clip SIEMPRE dentro de un <Sequence>: así su reloj arranca en 0 al montarse y `startFrom`
// significa lo que dice. Sin esto, un clip que entra en el frame 312 pediría el segundo 10 de un
// archivo de 5 s y se vería congelado.
const ClipShot: React.FC<{
  from: number; dur: number; src: string; startFrom: number; sc?: number; bright?: number;
}> = ({ from, dur, src, startFrom, sc, bright }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <ClipFill src={src} startFrom={startFrom} sc={sc} bright={bright} />
  </Sequence>
);

const PhotoFill: React.FC<{ src: string; sc: number; bright?: number; sat?: number }> = ({
  src, sc, bright = 0.88, sat = 0.84,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#07080A", overflow: "hidden" }}>
    <Img
      src={staticFile(src)}
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${sc.toFixed(4)})`,
        filter: `brightness(${bright.toFixed(2)}) saturate(${sat.toFixed(2)}) contrast(1.05)`,
      }}
    />
    <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
    <AbsoluteFill
      style={{ background: "radial-gradient(86% 78% at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.54) 100%)" }}
    />
  </AbsoluteFill>
);

// ── PLANO FLOTANTE ──────────────────────────────────────────────────────────────────────────
// Marco de vidrio + sombra de CONTACTO que aterriza + bisel + rim light. Adentro SIEMPRE va
// material real (clip o foto): una tarjeta que es forma + texto se lee como código en pantalla.
const Pane: React.FC<{
  cx: number; cy: number; w: number; h: number; op: number;
  z?: number; rot?: number; sc?: number; radius?: number; lit?: number;
  frameOp?: number; blur?: number; sheenAt?: number; children?: React.ReactNode;
}> = ({
  cx, cy, w, h, op, z = 0, rot = 0, sc = 1, radius = 18, lit = 1, frameOp = 1,
  blur = 0, sheenAt, children,
}) => {
  if (op <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(cx - w / 2),
        top: Math.round(cy - h / 2),
        width: w,
        height: h,
        opacity: op,
        transform: `translateZ(${z}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* sombra de contacto: el plano APOYA, no flota en el vacío */}
      <div
        style={{
          position: "absolute", left: "6%", right: "6%", bottom: -34, height: 52,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.36) 44%, rgba(0,0,0,0) 76%)",
          filter: "blur(9px)",
        }}
      />
      {/* el material real, recortado por el marco */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
          borderRadius: radius, overflow: "hidden",
          boxShadow: "0 36px 84px rgba(0,0,0,0.74), 0 3px 0 rgba(0,0,0,0.55)",
          filter: blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : undefined,
        }}
      >
        {children}
        {/* rim light del lado de la fuente */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(206deg, ${rgba(MD.white, 0.16 * lit)} 0%, rgba(255,255,255,0) 34%)`,
            pointerEvents: "none",
          }}
        />
        {sheenAt !== undefined && <Sheen at={sheenAt} dur={30} angle={16} />}
      </div>
      {/* vidrio: borde + bisel + gradiente (⛔ sin backdrop-filter) */}
      {frameOp > 0.01 && (
        <div
          style={{
            position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
            pointerEvents: "none", opacity: frameOp,
            ...glassStyle({ radius, lit }),
          }}
        />
      )}
    </div>
  );
};

// ── POLVO EN EL HAZ ─────────────────────────────────────────────────────────────────────────
// El hold vivo: nada queda quieto más de 1,5 s. Determinístico (⛔ Math.random).
const Dust: React.FC<{ f: number; op: number; beamX: number; tint: string; n?: number }> = ({
  f, op, beamX, tint, n = 46,
}) => {
  if (op <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(i * 3.3);
        const b = rnd(i * 8.9);
        const g = rnd(i * 15.1);
        const t = ((f / (420 + a * 420) + b) % 1 + 1) % 1;
        const x = beamX + (a - 0.5) * 52 + Math.sin(f / (72 + g * 66) + i) * 1.9;
        const y = 2 + t * 94;
        const sz = 1.3 + b * 3.6;
        const fl = 0.3 + 0.7 * Math.abs(Math.sin(f / (38 + a * 46) + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
              width: sz, height: sz, borderRadius: "50%",
              background: rgba(tint, 0.55 * fl),
              boxShadow: `0 0 ${(4 + b * 9).toFixed(0)}px ${rgba(tint, 0.3 * fl)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── EL PAPEL ────────────────────────────────────────────────────────────────────────────────
// UN solo elemento en los 31,5 s. `grime` 0 = recibo limpio, 1 = el papel negro del viejo.
// La MANCHA lleva material real adentro (`children`) — es la tarjeta más importante del video.
const Paper: React.FC<{
  f: number; left: number; top: number; w: number; h: number;
  rot: number; op: number; blur: number; grime: number; dip: number;
  stainOn: boolean; children?: React.ReactNode;
}> = ({ f, left, top, w, h, rot, op, blur, grime, dip, stainOn, children }) => {
  if (op <= 0.004) return null;
  const g = clamp01(grime);
  const bright = 1 - 0.42 * dip;
  const curl = 0.5 + Math.sin(f / 96) * 0.5;
  return (
    <div
      style={{
        position: "absolute", left, top, width: w, height: h,
        opacity: op,
        transform: `rotate(${rot.toFixed(2)}deg)`,
        transformOrigin: "50% 50%",
        filter: `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`,
      }}
    >
      {/* sombra de contacto del papel */}
      <div
        style={{
          position: "absolute", left: "8%", right: "8%", bottom: -0.035 * h, height: 0.075 * h,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 46%, rgba(0,0,0,0) 76%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
          borderRadius: Math.max(3, w * 0.008),
          overflow: "hidden",
          background: `linear-gradient(154deg, #F6F3EC 0%, #E4E0D5 46%, #C6C1B4 100%)`,
          boxShadow: "0 44px 96px rgba(0,0,0,0.8), 0 3px 8px rgba(0,0,0,0.6)",
        }}
      >
        {/* pliegue central: el papel fue doblado en un bolsillo */}
        <div
          style={{
            position: "absolute", left: "46%", top: 0, bottom: 0, width: "8%",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 48%, rgba(255,255,255,0.4) 54%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* la luz de la fuente pegando de arriba-izquierda + el curl del borde inferior */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(200deg, rgba(255,255,255,${(0.34 + curl * 0.1).toFixed(3)}) 0%, rgba(255,255,255,0) 38%), linear-gradient(0deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 22%)`,
          }}
        />

        {/* ── LA MANCHA: la tarjeta que lleva el clip real del papel negro ── */}
        {stainOn && g > 0.02 && (
          <div
            style={{
              position: "absolute",
              left: `${lerp(22, 4, g).toFixed(2)}%`,
              top: `${lerp(40, 30, g).toFixed(2)}%`,
              width: `${lerp(46, 92, g).toFixed(2)}%`,
              height: `${lerp(17, 34, g).toFixed(2)}%`,
              borderRadius: "48% / 46%",
              overflow: "hidden",
              opacity: 0.34 + g * 0.66,
              boxShadow: `0 0 ${(w * 0.05).toFixed(0)}px ${(w * 0.02).toFixed(0)}px rgba(24,25,28,${(0.4 * g).toFixed(2)})`,
            }}
          >
            {children}
            {/* borde difuso: la mancha SANGRA en la fibra, no tiene contorno de vector */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(220,214,200,0.55) 78%, rgba(230,225,212,0.95) 100%)",
              }}
            />
          </div>
        )}

        {/* salpicaduras: la mugre se corre hacia los bordes */}
        {g > 0.02 &&
          Array.from({ length: 14 }, (_, i) => {
            const s = rnd(i * 5.1);
            const s2 = rnd(i * 12.7);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${6 + s * 82}%`,
                  top: `${24 + s2 * 48}%`,
                  width: `${(1.4 + s2 * 6) * (0.4 + g)}%`,
                  height: `${(1 + s * 4) * (0.4 + g)}%`,
                  borderRadius: "50%",
                  background: rgba("#191A1D", (0.32 + s * 0.44) * g),
                  filter: "blur(2px)",
                }}
              />
            );
          })}

        {/* fibra del papel */}
        <AbsoluteFill style={{ opacity: 0.17, mixBlendMode: "multiply" }}>
          <svg width="100%" height="100%">
            <filter id="mdtwlfib">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed={11} />
            </filter>
            <rect width="100%" height="100%" filter="url(#mdtwlfib)" />
          </svg>
        </AbsoluteFill>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────────────────
export const MovTowelman: React.FC<{
  durationInFrames: number;
  hallway?: string;   // "img/mddrain_h32_oldmanhall.jpg"
  face?: string;      // "img/mddrain_h33_facefalls.jpg"
  truck?: string;     // "img/mddrain_h31_truckseat.jpg"
}> = ({ durationInFrames, hallway, face, truck }) => {
  const frame = useCurrentFrame();
  const D = Math.max(A5 + 120, durationInFrames);

  const P_HALL = hallway || "img/mddrain_h32_oldmanhall.jpg";
  const P_FACE = face || "img/mddrain_h33_facefalls.jpg";
  const P_TRUCK = truck || "img/mddrain_h31_truckseat.jpg";
  const P_DOOR = "img/mddrain_h29_doorway.jpg";
  const P_MON = "img/mddrain_h30_cameramonitor.jpg";
  const P_MACH = "img/mddrain_h04_machinefloor.jpg";
  const P_TOWEL = "img/mddrain_h09_blacktowel.jpg";
  const P_HOLD = "img/mddrain_h11_holdtowelup.jpg";

  // ── UNA cámara para los 31,5 s. Nunca vuelve a 0: el acto 5 hereda del 1. ──────────────────
  const c = cam(frame, { z0: -30, z1: 170, panX: -70, panY: -26, ry: 4.5, rx: -1.6, dur: D });
  // la misma deriva que usa `cam` internamente, para que el plano de overlay respire EN SINCRO
  const bx = Math.sin(frame / 47) * 2.2 + Math.sin(frame / 111) * 1.4;
  const by = Math.cos(frame / 61) * 1.8;

  // ── LA LUZ VIAJA: día cálido y plano → pasillo frío → negro con brasa roja ────────────────
  const tCold = rp(frame, 230, 448, E_SOFT);
  const tint = light(tCold, "warm", "cold");
  const amb = kf(frame, [0, 12, 200, A4, 760, 900, 940], [0, 1.05, 1.0, 0.86, 0.34, 0.12, 0.08]);
  const keyFrom = kf(frame, [0, A3, Math.max(A3 + 1, D)], [0.3, 0.62, 0.86]);
  const beamX = 18 + keyFrom * 64;
  const dustOp = kf(frame, [0, 40, 200, 420, 700, 860, 930], [0, 0.3, 0.4, 0.95, 0.8, 0.3, 0]);

  // ══ ACTO 1 · EL DÍA ═══════════════════════════════════════════════════════════════════════
  // Entra a sangre (es literalmente el b-roll de la puerta) y se REPLIEGA hasta ser una tarjeta.
  const a1Set = rp(frame, A1, A1 + 72, E_SET);
  const a1Dive = rp(frame, 168, A2 + 10, E_DIVE);
  const heroSc1 = lerp(2.15, 1, a1Set) * lerp(1, 4.5, a1Dive);
  const heroDx1 = lerp(330, 0, a1Set) + lerp(0, 402, a1Dive);
  const heroDy1 = lerp(34, 0, a1Set) + lerp(0, 44, a1Dive);
  const a1HeroOp = win(frame, -1, 1, A2 + 4, A2 + 12);
  const a1SideOp = win(frame, 34, 60, 166, A2 - 4);
  const a1TxtOp = win(frame, 52, 72, 164, A2 - 8);

  // ══ ACTO 2 · LA DISCULPA ══════════════════════════════════════════════════════════════════
  const a2In = rp(frame, A2 - 4, A2 + 44, E_SET);
  const a2HeroOp = win(frame, A2 - 4, A2 + 8, A3 - 12, A3 + 6);   // 186 < 198 < 366 < 384
  const a2SideOp = win(frame, A2 + 26, A2 + 58, A3 - 30, A3 - 2);
  const a2TxtOp = win(frame, A2 + 42, A2 + 62, A3 - 32, A3 - 12);

  // ══ ACTO 3 · EL PASILLO ═══════════════════════════════════════════════════════════════════
  const a3In = rp(frame, A3 - 8, A3 + 46, E_SET);
  const a3PlateOp = win(frame, A3 - 8, A3 + 14, 640, 756);
  // RACK FOCUS: el pasillo SE VA de foco mientras el papel LLEGA. Se cruzan en ~5 px.
  const hallBlur = rp(frame, 544, 590, E_SOFT) * 5.2;
  const a3HeroOp = kf(frame, [A3 - 10, A3 + 8, 544, 596, 700], [0, 1, 1, 0.16, 0]);
  const a3SideOp = win(frame, A3 + 40, A3 + 74, 548, 578);
  const a3TxtOp = win(frame, A3 + 20, A3 + 44, 520, 548);

  // ══ EL PAPEL — la materia que cruza TODAS las fronteras ═══════════════════════════════════
  const pKx = [0, 44, 86, 186, 198, 206, 230, 360, A3, 398, 540, 600, A5, D];
  const pCx = kf(frame, pKx, [1660, 1660, 1620, 1596, 2120, 2160, 1530, 1500, 960, 1580, 1580, 1450, 1450, 1450], E_SOFT);
  const pCy = kf(frame, pKx, [720, 720, 700, 672, 820, 760, 520, 470, 540, 530, 530, 550, 550, 550], E_SOFT);
  const pSc = kf(frame, pKx, [0.26, 0.26, 0.3, 0.33, 0.62, 0.6, 0.42, 0.46, 3.6, 0.806, 0.806, 1, 1, 1], E_SOFT);
  const pRot = kf(frame, pKx, [9, 9, 6, 5, -2, -6, 4, 6, -14, -3, -3, 0.9, 0, 0], E_SOFT);
  const pBlur = kf(frame, pKx, [4, 4, 3.2, 3, 13, 10, 5.5, 5, 1.2, 11, 11, 0, 0, 0], E_SOFT);
  const pOp = kf(frame, [0, 44, 86, 186, 196, 206, 230, 776, 818], [0, 0, 0.92, 0.94, 0, 0, 1, 1, 0]);
  // la mugre SALTA de 0,22 a 1 mientras el papel tapa la pantalla: el año pasa ahí adentro
  const pGrime = kf(frame, [0, 340, 372, 379, D], [0, 0, 0.22, 1, 1]);
  // parpadeo de la luz del pasillo que tapa el re-encuadre del clip de la mancha (f702)
  const pDip = win(frame, 698, 702, 704, 712);

  // parallax propio del plano cercano (mismo latido que la cámara 3D, amplificado)
  const pxOff = bx * 2.4 - 70 * c.e * 0.42;
  const pyOff = by * 2.0 - 26 * c.e * 0.42;
  const pW = 620 * pSc;
  const pH = 800 * pSc;
  const pLeft = pCx + pxOff - pW / 2;
  const pTop = pCy + pyOff - pH / 2;

  // rect EN PANTALLA de la mancha (de acá nace el subrayado rojo — MATCH-SHAPE)
  const stainL = pLeft + 0.04 * pW;
  const stainT = pTop + 0.3 * pH;
  const stainW = 0.92 * pW;
  const stainH = 0.34 * pH;
  const stainOn = frame < 776;

  // ══ ACTO 4 · EL SILENCIO ══════════════════════════════════════════════════════════════════
  const a4FaceOp = win(frame, 560, 592, 692, 722);
  const a4FaceSc = kf(frame, [560, 742], [0.94, 1.02], E_SOFT);

  // ══ ACTO 5 · LA FRASE ═════════════════════════════════════════════════════════════════════
  const truckOp = kf(frame, [742, 786, 852, 900], [0, 0.32, 0.3, 0]);
  const sweep = kf(frame, [760, 866], [-30, 132], E_SOFT);
  const emberOp = kf(frame, [800, 872, 902, 934], [0, 0.18, 0.15, 0.015]);
  const crush = rp(frame, 894, 940, E_SOFT) * 0.62;

  const BLK: { t: string; at: number; out: number; em: boolean }[] = [
    { t: "Son,", at: 766, out: 884, em: false },
    { t: "you cleaned the", at: 792, out: 896, em: false },
    { t: "wrong four inches.", at: 818, out: 912, em: true },
  ];
  const bedOp = win(frame, 762, 782, 900, 930);

  // MATCH-SHAPE: la mancha se aplana hasta ser el subrayado, y después se centra para el handoff
  const m = rp(frame, 776, 842, E_SNAP);
  const m2 = rp(frame, 810, 856, E_SOFT);              // el color vira a rojo sobre el final
  const home = rp(frame, 892, 938, E_SET);             // se centra: (650,548,620,10)
  const pulse = 0.86 + 0.14 * Math.sin(frame / 13);
  const barL = lerp(lerp(stainL, 140, m), 650, home);
  const barT = lerp(lerp(stainT, 664, m), 548, home);
  const barW = lerp(lerp(stainW, 620, m), 620, home);
  const barH = lerp(lerp(stainH, 10, m), 10, home) * (1 + 0.1 * m2 * Math.sin(frame / 13));
  const barRx = lerp(48, 0.8, m);
  const barRy = lerp(46, 50, m);
  const barOn = frame >= 776;   // el frame exacto en que la mancha del papel se apaga

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <Atmos tint={tint} keyFrom={keyFrom} intensity={amb} floor />

      {/* ── PLANO 0 · las placas de fondo (fuera del 3D) ── */}
      <Plate img={blurOf(P_DOOR)} op={win(frame, -1, 8, 176, 200)} k={0.4} bright={0.62} sat={0.9} f={frame} />
      <Plate img={blurOf(P_MON)} op={win(frame, 184, 208, 356, 384)} k={1.7} bright={0.44} sat={0.78} f={frame} />
      <Plate img={blurOf(P_HALL)} op={a3PlateOp} k={2.9} bright={0.3} sat={0.66} f={frame} />

      {/* el día: un lavado cálido y PLANO que muere cuando empieza el frío */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(178deg, ${rgba(MD.warm, 0.16)} 0%, ${rgba(MD.warm, 0.05)} 60%, rgba(0,0,0,0) 100%)`,
          opacity: win(frame, -1, 12, 210, 330),
        }}
      />

      {/* ── PLANOS 1-4 · la escena 3D. UNA sola cámara para todo. ── */}
      <AbsoluteFill style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
        {/* ACTO 1 — plano secundario: el monitor de la cámara de caños (FOTO real) */}
        {frame < A2 + 10 && (
          <Pane
            cx={1495} cy={580} w={430} h={560} z={-130} rot={-2.4}
            op={a1SideOp} lit={0.9} radius={16} sheenAt={96}
            sc={lerp(0.96, 1.02, rp(frame, 30, 190, E_SOFT))}
          >
            <PhotoFill src={P_MON} sc={1.06 + 0.05 * rp(frame, 30, 190)} bright={0.8} sat={0.8} />
          </Pane>
        )}

        {/* ACTO 1 — plano HÉROE: entra a sangre (b-roll del duplex) y se repliega en tarjeta */}
        {frame < A2 + 14 && (
          <Pane
            cx={650 + heroDx1} cy={510 + heroDy1} w={1040} h={600}
            op={a1HeroOp}
            sc={heroSc1}
            rot={lerp(-1.4, 0, a1Set)}
            radius={lerp(0, 18, a1Set)}
            frameOp={a1Set}
            sheenAt={78}
          >
            <ClipShot from={0} dur={110} src="broll/mddrain_h29_doorway.mp4" startFrom={6} sc={1.06} bright={1.02} />
            <ClipShot from={110} dur={92} src="broll/mddrain_h04_machinefloor.mp4" startFrom={8} sc={1.08} bright={0.94} />
            {/* la zambullida oscurece: atravesamos el plano, no lo fundimos */}
            <AbsoluteFill style={{ background: `rgba(4,4,6,${(a1Dive * 0.72).toFixed(3)})` }} />
          </Pane>
        )}
        {/* ACTO 2 — plano secundario: la máquina en el piso (FOTO real) */}
        {frame >= A2 && frame < A3 + 8 && (
          <Pane
            cx={330} cy={520} w={340} h={440} z={-150} rot={3.2}
            op={a2SideOp} lit={0.82} radius={14}
            sc={lerp(0.94, 1.03, rp(frame, A2, A3, E_SOFT))}
          >
            <PhotoFill src={P_MACH} sc={1.07 + 0.05 * rp(frame, A2, A3)} bright={0.72} sat={0.72} />
          </Pane>
        )}

        {/* ACTO 2 — plano HÉROE: el monitor, y después la puerta otra vez (ella pidiendo perdón) */}
        {frame >= A2 - 4 && frame < A3 + 10 && (
          <Pane
            cx={880} cy={550} w={1000} h={600}
            op={a2HeroOp}
            sc={lerp(1.22, 1, a2In)}
            rot={lerp(2.2, -0.6, a2In)}
            frameOp={a2In}
            sheenAt={A2 + 46}
          >
            <ClipShot from={186} dur={126} src="broll/mddrain_h30_cameramonitor.mp4" startFrom={4} sc={1.05} bright={0.9} />
            <ClipShot from={312} dur={72} src="broll/mddrain_h29_doorway.mp4" startFrom={56} sc={1.1} bright={0.86} />
          </Pane>
        )}

        {/* ACTO 3/4 — plano secundario: la cara de Mike. FOTO en el acto 3, CLIP en el acto 4:
            la foto se despierta justo cuando el papel entra en foco. */}
        {frame >= A3 + 30 && frame < 580 && (
          <Pane
            cx={275} cy={830} w={290} h={360} z={-80} rot={-3.6}
            op={a3SideOp} lit={0.7} radius={14}
            sc={lerp(0.92, 1, rp(frame, A3 + 30, 540, E_SOFT))}
            blur={rp(frame, 520, 568) * 2.6}
          >
            <PhotoFill src={P_FACE} sc={1.08} bright={0.58} sat={0.6} />
          </Pane>
        )}
        {frame >= 560 && frame < 726 && (
          <Pane
            cx={500} cy={520} w={700} h={440} z={-70} rot={-1.6}
            op={a4FaceOp} lit={0.62} radius={16} sheenAt={604}
            sc={a4FaceSc}
          >
            <ClipShot from={562} dur={130} src="broll/mddrain_h33_facefalls.mp4" startFrom={4} sc={1.06} bright={0.66} />
            <AbsoluteFill style={{ background: `rgba(3,4,6,${(rp(frame, 664, 722) * 0.9).toFixed(3)})` }} />
          </Pane>
        )}

        {/* ACTO 3 — plano HÉROE: el pasillo y el viejo; después el papel en alto.
            Al hacer el rack se cambia a la foto `_blur.jpg` HORNEADA (⛔ no se blurea video). */}
        {frame >= A3 - 10 && frame < 704 && (
          <Pane
            cx={800} cy={480} w={1000} h={620}
            op={a3HeroOp}
            sc={lerp(1.16, 1, a3In) * lerp(1, 0.93, rp(frame, 540, 620, E_SOFT))}
            rot={lerp(-2.6, 0.8, a3In)}
            frameOp={a3In * (1 - rp(frame, 556, 616))}
            blur={hallBlur}
            sheenAt={A3 + 34}
          >
            <ClipShot from={368} dur={124} src="broll/mddrain_h32_oldmanhall.mp4" startFrom={2} sc={1.05} bright={0.82} />
            <ClipShot from={492} dur={66} src="broll/mddrain_h11_holdtowelup.mp4" startFrom={34} sc={1.08} bright={0.78} />
            {frame >= 538 && (
              <AbsoluteFill style={{ opacity: rp(frame, 540, 558) }}>
                <PhotoFill src={blurOf(P_HOLD)} sc={1.12} bright={0.6} sat={0.5} />
              </AbsoluteFill>
            )}
          </Pane>
        )}

        {/* PLANO 4 · campo cercano: el canto de la puerta / la pared del pasillo. Parallax fuerte. */}
        <div
          style={{
            position: "absolute", left: 100, top: -140, width: 300, height: 1360,
            transform: "translateZ(120px)",
            background:
              "linear-gradient(90deg, rgba(3,3,5,0.96) 0%, rgba(3,3,5,0.7) 46%, rgba(3,3,5,0) 100%)",
            filter: "blur(7px)",
            opacity: kf(frame, [0, 30, 400, 700, 860], [0, 0.7, 0.9, 0.5, 0]),
          }}
        />
      </AbsoluteFill>

      {/* ── PLANO 5 · EL PAPEL (overlay, parallax propio, geometría calculable) ── */}
      <Paper
        f={frame}
        left={pLeft} top={pTop} w={pW} h={pH}
        rot={pRot} op={pOp} blur={pBlur} grime={pGrime} dip={pDip}
        stainOn={stainOn}
      >
        {/* MATERIAL REAL DENTRO DE LA MANCHA: el clip del papel saliendo negro del desagüe */}
        {frame >= 578 && (
          <>
            <ClipShot from={578} dur={124} src="broll/mddrain_h09_blacktowel.mp4" startFrom={8} sc={1.16} bright={0.52} />
            <ClipShot from={702} dur={74} src="broll/mddrain_h09_blacktowel.mp4" startFrom={40} sc={1.24} bright={0.5} />
          </>
        )}
        {frame < 592 && (
          <AbsoluteFill style={{ opacity: 1 - rp(frame, 576, 592) }}>
            <PhotoFill src={P_TOWEL} sc={1.18} bright={0.5} sat={0.5} />
          </AbsoluteFill>
        )}
      </Paper>

      {/* ── PLANO 6 · el polvo del haz (hold vivo) ── */}
      <Dust f={frame} op={dustOp} beamX={beamX} tint={tCold > 0.5 ? MD.cold : MD.warm} />

      {/* ══ COSTURA 2→3 · OCLUSIÓN: el papel tapa el salto de un año ══ */}
      <Occluder at={366} dur={18} color="#D9D4C8" angle={-7} />

      {/* ══ ACTO 5 · LA CAMIONETA (placa profunda: él haciendo cuentas) ══ */}
      {frame >= 742 && frame < 904 && (
        <AbsoluteFill style={{ opacity: truckOp, overflow: "hidden" }}>
          {frame < 866 ? (
            <ClipShot from={742} dur={124} src="broll/mddrain_h31_truckseat.mp4" startFrom={6} sc={1.1} bright={0.6} />
          ) : (
            <PhotoFill src={blurOf(P_TRUCK)} sc={1.2} bright={0.5} sat={0.5} />
          )}
          {/* barrido de luz de parabrisas */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(104deg, rgba(255,255,255,0) ${(sweep - 20).toFixed(1)}%, ${rgba(MD.warm, 0.26)} ${sweep.toFixed(1)}%, rgba(255,255,255,0) ${(sweep + 20).toFixed(1)}%)`,
            }}
          />
          <AbsoluteFill
            style={{ background: "radial-gradient(66% 60% at 48% 46%, rgba(0,0,0,0) 22%, rgba(0,0,0,0.88) 100%)" }}
          />
        </AbsoluteFill>
      )}

      {/* la brasa roja del final */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(56% 44% at 36% 62%, ${rgba(MD.red, 0.5)} 0%, rgba(0,0,0,0) 68%)`,
          opacity: emberOp * (0.8 + 0.2 * Math.sin(frame / 21)),
          mixBlendMode: "screen",
        }}
      />

      {/* ══ TEXTO — una idea por acto ══ */}
      {frame < A2 && (
        <div style={{ position: "absolute", left: 120, bottom: 96, maxWidth: 1040, opacity: a1TxtOp }}>
          <div style={{ transform: `translateY(${lerp(18, 0, rp(frame, 52, 78, E_SET)).toFixed(1)}px)` }}>
            <TextBed pad={26}>
              <Kicker>The third visit</Kicker>
              <div style={{ height: 12 }} />
              <Title size={60}>I ran that machine three times.</Title>
            </TextBed>
          </div>
        </div>
      )}

      {frame >= A2 + 30 && frame < A3 && (
        <div style={{ position: "absolute", left: 120, bottom: 112, maxWidth: 1040, opacity: a2TxtOp }}>
          <div style={{ transform: `translateY(${lerp(18, 0, rp(frame, A2 + 42, A2 + 70, E_SET)).toFixed(1)}px)` }}>
            <TextBed pad={26}>
              <Title size={60}>
                And she apologized <Em>to me</Em>.
              </Title>
            </TextBed>
          </div>
        </div>
      )}

      {frame >= A3 + 10 && frame < A4 && (
        <div style={{ position: "absolute", left: 110, top: 116, maxWidth: 1000, opacity: a3TxtOp }}>
          <div style={{ transform: `translateY(${lerp(-16, 0, rp(frame, A3 + 20, A3 + 50, E_SET)).toFixed(1)}px)` }}>
            <TextBed pad={26}>
              <Kicker color={MD.cold}>A year later</Kicker>
              <div style={{ height: 12 }} />
              <Title size={60}>He never said a word.</Title>
            </TextBed>
          </div>
        </div>
      )}

      {/* ══ LA FRASE — bloques semánticos, no letra por letra, no todo junto ══ */}
      {frame >= 760 && frame < 936 && (
        <div style={{ position: "absolute", left: 110, top: 336, width: 1000, opacity: bedOp }}>
          <TextBed pad={30} w={1000}>
            {BLK.map((b, i) => {
              const o = win(frame, b.at, b.at + 16, b.out, b.out + 18);
              const e = rp(frame, b.at, b.at + 20, E_SET);
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: F_SANS,
                    fontWeight: 800,
                    fontSize: 84,
                    lineHeight: 1.1,
                    color: MD.white,
                    opacity: o,
                    transform: `translateY(${lerp(22, 0, e).toFixed(1)}px)`,
                    filter: `blur(${lerp(7, 0, e).toFixed(2)}px)`,
                    textShadow: "0 8px 40px rgba(0,0,0,0.95)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.em ? <Em>{b.t}</Em> : b.t}
                </div>
              );
            })}
          </TextBed>
        </div>
      )}

      {/* aplastar todo lo que quede: al frame 945 sólo puede vivir la marca roja */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${crush.toFixed(3)})`, pointerEvents: "none" }} />

      {/* ══ COSTURA 4→5 · MATCH-SHAPE: la mancha ES el subrayado. Y es lo ÚLTIMO que queda. ══ */}
      {barOn && (
        <div
          style={{
            position: "absolute",
            left: barL,
            top: barT,
            width: Math.max(6, barW),
            height: Math.max(4, barH),
            borderRadius: `${barRx.toFixed(1)}% / ${barRy.toFixed(1)}%`,
            filter: `blur(${lerp(2.2, 0, m).toFixed(2)}px)`,
          }}
        >
          {/* la mancha */}
          <AbsoluteFill
            style={{
              opacity: 1 - m2,
              borderRadius: `${barRx.toFixed(1)}% / ${barRy.toFixed(1)}%`,
              background:
                "radial-gradient(ellipse at 42% 40%, #16171A 0%, #24262A 46%, rgba(36,38,42,0.5) 100%)",
            }}
          />
          {/* el subrayado rojo encendido */}
          <AbsoluteFill
            style={{
              opacity: m2,
              borderRadius: `${barRx.toFixed(1)}% / ${barRy.toFixed(1)}%`,
              background: `linear-gradient(90deg, ${MD.redHot} 0%, ${MD.red} 58%, ${rgba(MD.red, 0.32)} 100%)`,
              boxShadow: `0 0 ${(30 * pulse).toFixed(0)}px ${rgba(MD.redHot, 0.78 * pulse)}, 0 0 ${(90 * pulse).toFixed(0)}px ${rgba(MD.red, 0.4 * pulse)}`,
            }}
          />
          {/* núcleo caliente: la ignición del frame 842 */}
          <AbsoluteFill
            style={{
              opacity: m2 * win(frame, 838, 846, 856, 880) * 0.9,
              borderRadius: `${barRx.toFixed(1)}% / ${barRy.toFixed(1)}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,150,140,0.3) 60%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
