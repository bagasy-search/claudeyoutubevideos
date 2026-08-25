// ══════════════════════════════════════════════════════════════════════════════════════════════
// MovRoots.tsx — UN MOVIMIENTO CONTINUO. 1254 frames @ 30fps (41,8 s). Canal Mike Dalton (EN).
//
// LA IDEA: lo negro de la junta no es mugre, es un SER VIVO con raíces adentro del material
// poroso. La lejía es 94% agua: el cloro se queda arriba y le saca el pigmento a la CARA,
// y el agua baja hasta las raíces y les da de beber.
//
// ⛔ NO son 5 componentes pegados. Es UN SOLO OBJETO —una columna de junta en corte— filmado
// por UNA cámara que nunca vuelve a cero. Los "actos" son ENCUADRE + ESTADO DEL MATERIAL.
// Todo vive en un sistema de coordenadas LOCAL (unidades de mundo) con la línea de la junta
// en y = 0. La cámara proyecta:  pantalla = centro + S·m·(local − cam).
//
// ── TABLA DE HANDOFF ──────────────────────────────────────────────────────────────────────────
//
// ACTO 1 · f0–186 · "la línea negra" (macro de la junta)
//   enterFrom { cam: S 0.86, camY −110, rx 0°, ry −7° (arranca YA en movimiento, sin rampa)
//               luz: MD.cold pura, key 0.22 (ventanita arriba-izq)
//               materia: pared de azulejos + canal de junta + COSTRA NEGRA en y=0 }
//   exitTo    { cam: S 1.16, camY +6, rx 2°  — la costra queda CENTRADA y clavada
//               luz: cold (tRed = 0)
//               materia: la COSTRA NEGRA, inmóvil en y=0 → es el eje de la costura }
//   ── COSTURA @186: MATCH-SHAPE. La costra no se mueve ni un píxel; la tapa frontal
//      (la cara del azulejo/bañera) se ABRE con bisagra en su borde superior, que es
//      exactamente el borde inferior de la costra. Nada aparece: se destapa. + Sheen @184.
//
// ACTO 2 · f186–300 · "hifas" (el corte transversal, hilos que BAJAN)
//   enterFrom { cam: S 1.16, camY 6   (heredado, sin salto)
//               luz: cold, key 0.24
//               materia: la costra + la tapa abriéndose }
//   exitTo    { cam: S 1.28, camY 170, rx 9°, ry +5° — bajando dentro del corte
//               luz: cold, tRed empieza a asomar recién en 440
//               materia: 20 HIFAS ya dibujadas de y=8 hacia abajo, en 2 capas de profundidad }
//   ── COSTURA @300: WIPE POR MATERIA (<VaporWipe/>). Vapor de baño cruza; detrás, el cemento
//      liso ya resolvió en GRANO + ARENA + POROS. El corte y las hifas siguen ahí, idénticos.
//
// ACTO 3 · f300–500 · "no es piedra, es esponja"
//   enterFrom { cam: S 1.28, camY 170 (heredado)
//               luz: cold, pared de azulejos aún al 100%
//               materia: corte + hifas + poros recién nacidos }
//   exitTo    { cam: S 3.28, camY 215 — ZOOM-THROUGH interno (f352→418) hacia un poro:
//               los MISMOS poros pasan de ~45 px a ~340 px. Nada se reemplaza, se agranda.
//               En f418 la costra ya salió por arriba del cuadro: atravesamos la superficie.
//               luz: tRed 0.25, la pared cae a 0.22 (quedó fuera del plano focal)
//               materia: campo de POROS a escala macro + BOCAS que perforan la costra }
//   ── COSTURA @500: OCLUSIÓN (<Occluder color=bone/>). Una lámina pálida y pesada —la lejía—
//      cruza el lente y tapa el 100%; cuando sale, el líquido ya está encima de la costra.
//
// ACTO 4 · f500–878 · "94% agua" (la lejía se queda ARRIBA)
//   enterFrom { cam: S 3.20, camY 150 (heredado; la cámara sube a buscar la cara, no salta)
//               luz: tRed 0.25 → 1 (el ROJO de alerta entra con la lejía)
//               materia: costra + bocas + poros, ya a escala macro }
//   exitTo    { cam: S 2.80, camY 24, rx 15° — retrocede lo justo para que quepa el AIRE
//               sobre la cara (ahí vive la lejía); la costra queda como banda central
//               luz: red plena, key 0.56
//               materia: 5 moléculas de CLORO encajadas en las bocas (no entran) + la cara de
//               la costra BLANQUEADA (bone) mientras el interior sigue negro }
//   ── COSTURA @878: MATCH-MOVE. Sin corte, sin overlay: las gotas de agua que estaban sobre
//      la cara empiezan a bajar por las bocas y la CÁMARA LAS SIGUE. El movimiento ES la costura.
//
// ACTO 5 · f878–1254 · "y después la regaste"
//   enterFrom { cam: S 2.80, camY 24 (heredado, se pone en marcha hacia abajo)
//               luz: red plena
//               materia: gotas entrando por las bocas de la costra bleacheada }
//   exitTo    { cam: S 3.60, camY 1168 — 1144 unidades más abajo, en la zona de raíces
//               luz: red + rim verde-moho (el ser vivo responde)
//               materia: las MISMAS hifas del acto 2, ahora tallo grueso: beben, se hinchan,
//               vuelven a verde y brotan puntas nuevas }
//
// ⛔ Dos fronteras seguidas nunca repiten costura: MATCH-SHAPE → WIPE → OCLUSIÓN → MATCH-MOVE.
// ⛔ <Atmos/> se monta UNA vez, fuera de los actos, y jamás se remonta.
// ⛔ Sin Math.random / Date / backdrop-filter / blur grande a pantalla completa / staticFile.
// ══════════════════════════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Atmos,
  Em,
  F_SANS,
  Kicker,
  MD,
  Occluder,
  Sheen,
  TextBed,
  Title,
  VaporWipe,
  cam,
  clamp01,
  glassStyle,
  light,
  rgba,
  rnd,
} from "./Stage";

const DREF = 1254;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EZ = Easing.bezier(0.36, 0, 0.2, 1);
const kf = (f: number, xs: number[], ys: number[], e?: (n: number) => number) =>
  interpolate(f, xs, ys, { ...CL, easing: e ?? EZ });
const wrap = (v: number, n: number) => ((v % n) + n) % n;

// ── LA CÁMARA (una sola, función del frame GLOBAL) ────────────────────────────────────────────
// S = magnificación, camX/camY = punto de mundo sobre el eje óptico. Monótona: nunca reinicia.
const camS = (f: number) =>
  kf(f, [0, 100, 186, 300, 340, 352, 386, 418, 500, 560, 700, 792, 878, 1000, 1120, 1254],
       [0.86, 1.02, 1.16, 1.28, 1.36, 1.42, 2.20, 3.28, 3.20, 2.72, 2.66, 2.72, 2.80, 3.10, 3.40, 3.60]);
const camXAt = (f: number) =>
  kf(f, [0, 186, 300, 352, 418, 500, 700, 878, 1000, 1254],
       [180, 40, 10, -20, -110, -120, -80, -60, -40, -10]);
const camYAt = (f: number) =>
  kf(f, [0, 100, 186, 300, 352, 418, 496, 508, 530, 560, 611, 700, 792, 878, 930, 1000, 1060, 1110, 1180, 1254],
       [-110, -46, 6, 170, 240, 215, 150, 96, 44, 30, 24, 22, 18, 24, 130, 540, 880, 1060, 1130, 1168]);
const camRX = (f: number) => kf(f, [0, 186, 300, 500, 792, 1000, 1254], [0, 2, 9, 12, 15, 11, 8]);
const camRY = (f: number) => kf(f, [0, 186, 300, 500, 792, 1000, 1254], [-7, -1, 5, 1, -4, -1, 2]);

// Caja recortada al encuadre: evita rasterizar planos de 17.000 px cuando S está alto.
const clip = (
  sc: number, cx: number, cy: number, W: number, H: number, y0: number, y1: number,
) => {
  const vw = W / sc;
  const vh = H / sc;
  const left = cx - vw * 0.9;
  const top = Math.max(y0, cy - vh * 0.9);
  const bot = Math.min(y1, cy + vh * 0.9);
  return { left, top, width: vw * 1.8, height: Math.max(0, bot - top) };
};

// ── DATOS DETERMINÍSTICOS (rnd = hash de Stage; ⛔ nada de Math.random) ────────────────────────
const TILES = Array.from({ length: 15 }, (_, i) => {
  const k = rnd(i * 3.3 + 211);
  return { x: -2000 + (i % 5) * 810, y: -1620 + Math.floor(i / 5) * 540, k };
});

const BLOBS = Array.from({ length: 34 }, (_, i) => {
  const a = rnd(i * 2.1 + 101);
  const b = rnd(i * 4.9 + 107);
  const c = rnd(i * 6.3 + 113);
  return {
    x: -2000 + i * 118 + (a - 0.5) * 82,
    y: -9 + (b - 0.5) * 44,
    w: 44 + c * 118,
    h: 15 + a * 38,
    ph: b * 6.283,
    g: c,
  };
});

const PORES = Array.from({ length: 88 }, (_, i) => {
  const a = rnd(i * 1.7 + 3);
  const b = rnd(i * 2.9 + 11);
  const c = rnd(i * 4.3 + 29);
  return {
    x: -900 + (i % 11) * 150 + (a - 0.5) * 108,
    y: 70 + Math.floor(i / 11) * 112 + (b - 0.5) * 76,
    r: 16 + c * 36,
    dep: i % 3,
    ph: a * 6.283,
    st: b * 26,
  };
});

const MOUTHS = Array.from({ length: 9 }, (_, i) => {
  const a = rnd(i * 5.1 + 7);
  return { x: -680 + i * 170 + (a - 0.5) * 38, w: 92 + a * 34, ph: a * 6.283 };
});

// Hifas: hilos que bajan por dentro del material. `deep` = las que llegan a la zona de raíces.
const HYPHA = Array.from({ length: 20 }, (_, i) => {
  const a = rnd(i * 3.1 + 1);
  const b = rnd(i * 5.7 + 4);
  const c = rnd(i * 8.3 + 9);
  const d = rnd(i * 11.9 + 13);
  const deep = i % 3 === 0;
  const yE = deep ? 1520 : 640 + c * 380;
  const x0 = -1000 + i * 106 + (a - 0.5) * 66;
  const xM = x0 + (c - 0.5) * 230;
  const xE = x0 + (b - 0.5) * 300;
  return {
    d:
      `M ${x0.toFixed(1)} 10 C ${(x0 + (a - 0.5) * 88).toFixed(1)} ${(yE * 0.24).toFixed(1)}, ` +
      `${xM.toFixed(1)} ${(yE * 0.46).toFixed(1)}, ${(x0 + (d - 0.5) * 190).toFixed(1)} ${(yE * 0.64).toFixed(1)} ` +
      `S ${(xE + (c - 0.5) * 130).toFixed(1)} ${(yE * 0.87).toFixed(1)}, ${xE.toFixed(1)} ${yE.toFixed(1)}`,
    br:
      `M ${xM.toFixed(1)} ${(yE * 0.46).toFixed(1)} C ${(xM + (b - 0.5) * 130).toFixed(1)} ${(yE * 0.56).toFixed(1)}, ` +
      `${(xM + (d - 0.5) * 200).toFixed(1)} ${(yE * 0.6).toFixed(1)}, ${(xM + (d - 0.5) * 260).toFixed(1)} ${(yE * 0.72).toFixed(1)}`,
    w: 3.4 + a * 4.2,
    lay: i % 2,
    st: 190 + i * 3.4,
    ph: a * 6.283,
  };
});

// La mata de raíces del fondo (mismas hifas, ya tallo grueso) — encuadre del acto 5.
const ROOTS = Array.from({ length: 22 }, (_, i) => {
  const a = rnd(i * 2.3 + 17);
  const b = rnd(i * 6.1 + 23);
  const c = rnd(i * 9.7 + 31);
  const xT = -330 + i * 30 + (c - 0.5) * 190;
  const yT = 1150 + (b - 0.5) * 200;
  return {
    d:
      `M ${(-330 + i * 28 + (a - 0.5) * 40).toFixed(1)} 880 ` +
      `C ${(-330 + i * 28 + (a - 0.5) * 120).toFixed(1)} 1000, ` +
      `${(xT + (b - 0.5) * 96).toFixed(1)} 1074, ${xT.toFixed(1)} ${yT.toFixed(1)}`,
    tx: xT,
    ty: yT,
    w: 3 + c * 6,
    ph: a * 6.283,
    st: b * 60,
  };
});

// Gotas de agua que BAJAN por las bocas (acto 5).
const DROPS = Array.from({ length: 44 }, (_, i) => {
  const a = rnd(i * 1.3 + 41);
  const b = rnd(i * 3.7 + 53);
  const c = rnd(i * 7.1 + 59);
  const mi = i % 9;
  return {
    x: MOUTHS[mi].x + (a - 0.5) * 64,
    at: 880 + b * 130 + mi * 5,
    dur: 150 + c * 110,
    r: 6 + c * 9,
    ph: a * 6.283,
  };
});

// El 94/6 dentro de la lejía: muchísima agua chiquita, poquísimo cloro enorme.
const WDOTS = Array.from({ length: 56 }, (_, i) => {
  const a = rnd(i * 2.7 + 71);
  const b = rnd(i * 4.1 + 79);
  const c = rnd(i * 6.7 + 83);
  return { x: -900 + i * 33 + (a - 0.5) * 60, y: -196 + b * 172, r: 4 + c * 5, ph: a * 6.283, sp: 0.6 + c };
});

const CHLO = [0, 2, 4, 6, 8].map((m, i) => {
  const a = rnd(i * 13.3 + 97);
  return { m, x0: MOUTHS[m].x + (a - 0.5) * 120, y0: -142 - a * 34, r: 40 + a * 14, ph: a * 6.283 };
});

const MOTES = Array.from({ length: 24 }, (_, i) => {
  const a = rnd(i * 3.9 + 131);
  const b = rnd(i * 5.3 + 137);
  return { x: a * 2100 - 90, y: b * 1180, r: 3 + b * 9, sp: 0.35 + a * 0.9, ph: a * 6.283 };
});

// ── PLANO ─────────────────────────────────────────────────────────────────────────────────────
// Cada estrato es un plano a su propio translateZ dentro de la cámara (parallax real por
// perspectiva) y adentro proyecta el mundo con su propio factor `m` (los planos cercanos se
// mueven más). El interior es `flat`: así las coordenadas gigantes nunca cruzan el plano de fuga.
const Plane: React.FC<{
  dz: number;
  sc: number;
  cx: number;
  cy: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({ dz, sc, cx, cy, opacity = 1, children }) => (
  <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${dz}px)`, opacity }}>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transformOrigin: "0 0",
        transform: `translate(${(-sc * cx).toFixed(2)}px, ${(-sc * cy).toFixed(2)}px) scale(${sc.toFixed(4)})`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// ── BLOQUE DE TEXTO (una idea por acto, siempre sobre cama oscura) ────────────────────────────
const Block: React.FC<{
  at: number;
  out: number;
  anchor: "bl" | "tl" | "tr";
  w?: number;
  children: React.ReactNode;
}> = ({ at, out, anchor, w = 880, children }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out + 15) return null;
  const inP = clamp01((frame - at) / 13);
  const outP = clamp01((frame - out) / 14);
  const sgn = anchor === "tr" ? 1 : -1;
  const dx = (1 - inP) * 30 * sgn - outP * 20 * sgn;
  const dy = (1 - inP) * 16 + outP * 10;
  const pos: React.CSSProperties =
    anchor === "bl" ? { left: 96, bottom: 108 } : anchor === "tl" ? { left: 96, top: 92 } : { right: 96, top: 92 };
  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        width: w,
        opacity: inP * (1 - outP),
        transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`,
        textAlign: anchor === "tr" ? "right" : "left",
      }}
    >
      <TextBed>{children}</TextBed>
    </div>
  );
};

// ── ESTRATO 2 · LA PARED DE AZULEJOS (el cuarto: nunca desaparece, sólo se va del foco) ───────
const TileWall: React.FC<{ sc: number; cx: number; cy: number; W: number; H: number; f: number }> = ({
  sc, cx, cy, W, H, f,
}) => {
  const b = clip(sc, cx, cy, W, H, -2600, -26);
  if (b.height <= 0) return null;
  const spec = 0.5 + 0.5 * Math.sin(f / 96);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: b.top,
          width: b.width,
          height: b.height,
          background: `linear-gradient(184deg, ${rgba(MD.cold, 0.09)} 0%, rgba(12,14,17,0.9) 46%, #0A0C0F 100%)`,
          backgroundColor: "#0B0D10",
        }}
      />
      {TILES.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: 780,
            height: 510,
            borderRadius: 7,
            background:
              `linear-gradient(152deg, ${rgba(MD.cold, 0.1 + t.k * 0.06 * spec)} 0%, rgba(255,255,255,0.028) 26%, ` +
              `rgba(0,0,0,0.24) 62%, rgba(0,0,0,0.42) 100%)`,
            boxShadow:
              `inset 0 3px 0 ${rgba(MD.cold, 0.2 + t.k * 0.08)}, inset 0 -5px 14px rgba(0,0,0,0.66), ` +
              `0 6px 18px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 780,
              height: 510,
              borderRadius: 7,
              background: `linear-gradient(118deg, rgba(255,255,255,0) 40%, rgba(255,255,255,${(0.05 + t.k * 0.04).toFixed(3)}) 50%, rgba(255,255,255,0) 60%)`,
            }}
          />
        </div>
      ))}
    </>
  );
};

// ── EL CORTE: cemento + arena + poros (la MISMA materia en dos escalas) ───────────────────────
const SectionBody: React.FC<{ sc: number; cx: number; cy: number; W: number; H: number; mat: number }> = ({
  sc, cx, cy, W, H, mat,
}) => {
  const b = clip(sc, cx, cy, W, H, 26, 2400);
  if (b.height <= 0) return null;
  const bp = `${(-b.left).toFixed(1)}px ${(-b.top).toFixed(1)}px`;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: b.top,
          width: b.width,
          height: b.height,
          backgroundColor: "#0F1215",
          boxShadow: `inset 0 22px 46px rgba(0,0,0,0.85)`,
        }}
      />
      {/* arena/cemento fino — siempre presente (es el mismo material desde el acto 1) */}
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: b.top,
          width: b.width,
          height: b.height,
          opacity: 0.55,
          backgroundPosition: bp,
          backgroundSize: "23px 23px, 37px 37px, 31px 31px",
          backgroundImage:
            `radial-gradient(circle at 30% 28%, ${rgba(MD.cold, 0.09)} 0 1.6px, rgba(0,0,0,0) 2.4px),` +
            `radial-gradient(circle at 72% 62%, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0) 3px),` +
            `radial-gradient(circle at 46% 82%, rgba(0,0,0,0.5) 0 1.8px, rgba(0,0,0,0) 2.6px)`,
        }}
      />
      {/* GRANO GRUESO: aparece con `mat` — "no es piedra, es cemento con arena adentro" */}
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: b.top,
          width: b.width,
          height: b.height,
          opacity: mat * 0.9,
          backgroundPosition: bp,
          backgroundSize: "74px 74px, 113px 113px, 91px 91px, 149px 149px",
          backgroundImage:
            `radial-gradient(circle at 26% 24%, ${rgba(MD.cold, 0.16)} 0 5px, rgba(0,0,0,0) 7px),` +
            `radial-gradient(circle at 68% 58%, rgba(255,255,255,0.1) 0 7px, rgba(0,0,0,0) 10px),` +
            `radial-gradient(circle at 44% 84%, rgba(0,0,0,0.72) 0 6px, rgba(0,0,0,0) 9px),` +
            `radial-gradient(circle at 84% 18%, ${rgba(MD.warm, 0.1)} 0 4px, rgba(0,0,0,0) 7px)`,
        }}
      />
      {/* luz de la ventanita cayendo dentro del corte */}
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: 26,
          width: b.width,
          height: 460,
          background: `linear-gradient(180deg, ${rgba(MD.cold, 0.17)} 0%, ${rgba(MD.cold, 0.05)} 42%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {/* la zona profunda: húmeda, sin luz — ahí viven las raíces */}
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: 760,
          width: b.width,
          height: 1200,
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 44%, rgba(0,0,0,0.86) 100%)`,
        }}
      />
    </>
  );
};

// ── POROS: 3 sub-planos que se escalan alrededor del punto de cámara = parallax interno ───────
const PoreField: React.FC<{ f: number; cx: number; cy: number; reveal: number; wet: number }> = ({
  f, cx, cy, reveal, wet,
}) => (
  <>
    {[0, 1, 2].map((g) => (
      <div
        key={g}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transformOrigin: `${cx.toFixed(1)}px ${cy.toFixed(1)}px`,
          transform: `scale(${(0.93 + g * 0.07).toFixed(3)})`,
        }}
      >
        {PORES.filter((p) => p.dep === g).map((p, i) => {
          const on = clamp01((f - (296 + p.st)) / 22) * reveal;
          if (on <= 0.01) return null;
          const breath = 1 + Math.sin(f / 34 + p.ph) * 0.014;
          const r = p.r * on * breath;
          const dim = 0.55 + g * 0.24;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x - r,
                top: p.y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                opacity: Math.min(1, dim + 0.3),
                background: `radial-gradient(circle at 40% 30%, #0A0D11 0%, #04050A 52%, #090C10 100%)`,
                boxShadow:
                  `inset 0 ${(r * 0.34).toFixed(1)}px ${(r * 0.62).toFixed(1)}px rgba(0,0,0,0.96), ` +
                  `inset 0 -${(r * 0.16).toFixed(1)}px ${(r * 0.34).toFixed(1)}px ${rgba(MD.cold, 0.13 * dim)}, ` +
                  `0 -${(r * 0.05).toFixed(1)}px 0 ${rgba(MD.cold, 0.24 * dim)}, ` +
                  `0 ${(r * 0.09).toFixed(1)}px ${(r * 0.2).toFixed(1)}px rgba(0,0,0,0.72)`,
              }}
            >
              {/* labio iluminado por la key fría (arriba-izq) + brillo húmedo del acto 5 */}
              <div
                style={{
                  position: "absolute",
                  left: r * 0.16,
                  top: r * 0.1,
                  width: r * 1.1,
                  height: r * 0.62,
                  borderRadius: "50%",
                  background: `linear-gradient(160deg, ${rgba(MD.cold, 0.16 * dim + wet * 0.16)} 0%, rgba(0,0,0,0) 62%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    ))}
  </>
);

// ── HIFAS · el SVG usa una viewBox que ES la cámara: coste de rasterizado constante ───────────
// Se dibujan de arriba hacia abajo (strokeDashoffset) entre f190 y f300 y NO se van más:
// son las mismas que en el acto 5 aparecen abajo, ya como raíz gruesa.
const Hyphae: React.FC<{
  f: number; sc: number; cx: number; cy: number; W: number; H: number; layer: 0 | 1; alive: number;
}> = ({ f, sc, cx, cy, W, H, layer, alive }) => {
  const par = layer === 0 ? 0.96 : 1.05; // parallax de profundidad entre las dos capas
  const vw = W / (sc * par);
  const vh = H / (sc * par);
  const col = interpolateColors(alive, [0, 1], ["#080A09", MD.moldLit]);
  const glow = interpolateColors(alive, [0, 1], ["#0C0F0C", MD.mold]);
  return (
    <svg
      style={{ position: "absolute", left: -W / 2 + cx, top: -H / 2 + cy, overflow: "visible" }}
      width={W}
      height={H}
      viewBox={`${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
    >
      {HYPHA.filter((h) => h.lay === layer).map((h, i) => {
        const p = clamp01((f - h.st) / 74);
        if (p <= 0.001) return null;
        const sway = Math.sin(f / 26 + h.ph) * (layer === 0 ? 3.2 : 5.4);
        const w = h.w * (layer === 0 ? 0.78 : 1.12) * (1 + alive * 0.5);
        return (
          <g key={i} transform={`translate(${sway.toFixed(2)},0)`}>
            {/* sombra propia del hilo: cae hacia abajo-derecha (key fría arriba-izq) */}
            <path
              d={h.d}
              fill="none"
              stroke="#000000"
              strokeWidth={w * 1.7}
              strokeLinecap="round"
              opacity={0.62}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              transform="translate(5,7)"
            />
            <path
              d={h.d}
              fill="none"
              stroke={glow}
              strokeWidth={w * 2.3}
              strokeLinecap="round"
              opacity={0.22 + alive * 0.3}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
            />
            <path
              d={h.d}
              fill="none"
              stroke={col}
              strokeWidth={w}
              strokeLinecap="round"
              opacity={0.9}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
            />
            {/* rim: la hifa es un tubo, no una línea */}
            <path
              d={h.d}
              fill="none"
              stroke={rgba(MD.cold, 0.3 + alive * 0.25)}
              strokeWidth={w * 0.3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              transform="translate(-1.6,-2.2)"
            />
            {p > 0.45 && (
              <path
                d={h.br}
                fill="none"
                stroke={col}
                strokeWidth={w * 0.62}
                strokeLinecap="round"
                opacity={0.82}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - clamp01((p - 0.45) / 0.4)}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── LA MATA DE RAÍCES (zona profunda) — beben y REVIVEN ───────────────────────────────────────
const RootMat: React.FC<{ f: number; sc: number; cx: number; cy: number; W: number; H: number; alive: number }> = ({
  f, sc, cx, cy, W, H, alive,
}) => {
  const vw = W / sc;
  const vh = H / sc;
  const col = interpolateColors(alive, [0, 1], ["#0A0B0A", MD.moldLit]);
  return (
    <svg
      style={{ position: "absolute", left: -W / 2 + cx, top: -H / 2 + cy, overflow: "visible" }}
      width={W}
      height={H}
      viewBox={`${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
    >
      {ROOTS.map((r, i) => {
        const drink = clamp01((f - (1062 + r.st)) / 90) * alive;
        const sway = Math.sin(f / 21 + r.ph) * 4.6;
        const w = r.w * (1 + drink * 0.85);
        return (
          <g key={i} transform={`translate(${sway.toFixed(2)},0)`}>
            <path d={r.d} fill="none" stroke="#000" strokeWidth={w * 1.9} strokeLinecap="round" opacity={0.6} transform="translate(5,8)" />
            <path d={r.d} fill="none" stroke={MD.mold} strokeWidth={w * 2.6} strokeLinecap="round" opacity={0.1 + drink * 0.34} />
            <path d={r.d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" />
            <path d={r.d} fill="none" stroke={rgba(MD.cold, 0.22 + drink * 0.3)} strokeWidth={w * 0.28} strokeLinecap="round" transform="translate(-1.8,-2.4)" />
            {/* punta que se hincha y BROTA cuando le llega el agua */}
            <circle cx={r.tx} cy={r.ty} r={3 + drink * 15} fill={col} opacity={0.95} />
            <circle cx={r.tx} cy={r.ty} r={(3 + drink * 15) * 2.4} fill={MD.moldLit} opacity={drink * 0.16} />
            {drink > 0.35 && (
              <path
                d={`M ${r.tx.toFixed(1)} ${r.ty.toFixed(1)} q ${((i % 2 ? 1 : -1) * 46).toFixed(1)} 34, ${((i % 2 ? 1 : -1) * 74).toFixed(1)} ${(96 * drink).toFixed(1)}`}
                fill="none"
                stroke={col}
                strokeWidth={w * 0.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - clamp01((drink - 0.35) / 0.5)}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── LA COSTRA (la materia que cruza los 5 actos) + las MANCHAS + el blanqueo de la CARA ───────
const Crust: React.FC<{
  sc: number; cx: number; cy: number; W: number; H: number; f: number; bleach: number;
}> = ({ sc, cx, cy, W, H, f, bleach }) => {
  const vw = W / sc;
  const left = cx - vw * 0.75;
  const width = vw * 1.5;
  const sweep = width * bleach;
  return (
    <>
      {/* el canal de la junta: hundido respecto del azulejo */}
      <div
        style={{
          position: "absolute",
          left,
          top: -34,
          width,
          height: 68,
          background: `linear-gradient(180deg, #101318 0%, #0A0C10 34%, #0D1015 100%)`,
          boxShadow: `inset 0 6px 14px rgba(0,0,0,0.9), inset 0 -6px 12px rgba(0,0,0,0.8), 0 -2px 0 ${rgba(MD.cold, 0.3)}`,
        }}
      />
      {/* LA LÍNEA NEGRA: lo que se ve. Es la copa del ser vivo. */}
      <div
        style={{
          position: "absolute",
          left,
          top: -26,
          width,
          height: 52,
          background: `linear-gradient(180deg, #0B0D0C 0%, #030404 46%, #080A09 100%)`,
        }}
      />
      {BLOBS.map((b, i) => {
        const pulse = 1 + Math.sin(f / 41 + b.ph) * 0.035;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - (b.w * pulse) / 2,
              top: b.y - (b.h * pulse) / 2,
              width: b.w * pulse,
              height: b.h * pulse,
              borderRadius: "50%",
              background: `radial-gradient(circle at 42% 36%, #000000 0%, #05070600 74%)`,
              boxShadow: `0 0 ${(b.h * 0.7).toFixed(1)}px ${rgba(MD.mold, 0.22 + b.g * 0.2)}`,
            }}
          />
        );
      })}
      {/* BLANQUEO: sólo la CARA (mitad de arriba). Debajo sigue negro — ése es el punto. */}
      {bleach > 0.002 && (
        <div
          style={{
            position: "absolute",
            left,
            top: -30,
            width: sweep,
            height: 30,
            background: `linear-gradient(90deg, ${rgba(MD.bone, 0.94)} 0%, ${rgba(MD.bone, 0.9)} 76%, ${rgba(MD.bone, 0)} 100%)`,
            boxShadow: `inset 0 -6px 12px rgba(0,0,0,0.5), 0 0 ${(26 * bleach).toFixed(1)}px ${rgba(MD.white, 0.35)}`,
          }}
        />
      )}
      {/* filo superior: el azulejo agarrando la key fría — el ancla óptica de todo el movimiento */}
      <div
        style={{
          position: "absolute",
          left,
          top: -36,
          width,
          height: 5,
          background: rgba(MD.cold, 0.42),
        }}
      />
    </>
  );
};

// ── LAS BOCAS: los poros que PERFORAN la costra. Por acá no entra el cloro y sí el agua. ──────
const Mouths: React.FC<{ f: number; open: number; bleach: number }> = ({ f, open, bleach }) => (
  <>
    {MOUTHS.map((m, i) => {
      const w = m.w * (0.42 + open * 0.58);
      const h = 60 + open * 150;
      const jig = Math.sin(f / 37 + m.ph) * 1.6;
      return (
        <div key={i} style={{ position: "absolute", left: m.x - w / 2 + jig, top: -32 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: w,
              height: h,
              borderRadius: `${w * 0.5}px ${w * 0.5}px ${w * 0.3}px ${w * 0.3}px / 26px 26px ${h * 0.5}px ${h * 0.5}px`,
              background: `radial-gradient(120% 84% at 50% 4%, #000000 0%, rgba(3,4,6,0.9) 46%, rgba(6,8,11,0) 100%)`,
              boxShadow: `inset 0 8px 18px rgba(0,0,0,1)`,
            }}
          />
          {/* labio: la cara blanqueada también se ve en el borde de la boca */}
          <div
            style={{
              position: "absolute",
              left: -5,
              top: -7,
              width: w + 10,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(180deg, ${rgba(MD.cold, 0.26 + bleach * 0.3)} 0%, rgba(0,0,0,0.92) 58%)`,
              boxShadow: `0 -1px 0 ${rgba(MD.white, 0.16 + bleach * 0.4)}, 0 5px 12px rgba(0,0,0,0.9)`,
            }}
          />
        </div>
      );
    })}
  </>
);

// ── LA TAPA · la cara frontal que esconde el corte. Bisagra en el borde de la costra. ─────────
const CoverFlap: React.FC<{ sc: number; cx: number; cy: number; W: number; H: number; deg: number }> = ({
  sc, cx, cy, W, H, deg,
}) => {
  const b = clip(sc, cx, cy, W, H, 26, 1700);
  if (b.height <= 0) return null;
  return (
    <div style={{ position: "absolute", left: b.left, top: 26, width: b.width, height: 0, perspective: 2600 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: b.width,
          height: 1500,
          transformOrigin: "50% 0%",
          transform: `rotateX(${deg.toFixed(2)}deg)`,
          backfaceVisibility: "hidden",
          background: `linear-gradient(180deg, #151920 0%, #10141A 26%, #0C0F14 68%, #080A0D 100%)`,
          boxShadow: `inset 0 4px 0 ${rgba(MD.cold, 0.26)}, inset 0 -40px 90px rgba(0,0,0,0.8)`,
        }}
      >
        {/* espesor del material: no es papel, es una losa */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: b.width,
            height: 22,
            background: `linear-gradient(180deg, ${rgba(MD.cold, 0.24)} 0%, rgba(0,0,0,0.85) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 22,
            width: b.width,
            height: 700,
            background: `linear-gradient(178deg, ${rgba(MD.cold, 0.08)} 0%, rgba(255,255,255,0.02) 30%, rgba(0,0,0,0) 100%)`,
          }}
        />
      </div>
    </div>
  );
};

// ── LA LEJÍA · 94% agua. La masa se queda ARRIBA, sobre la cara de la junta. ──────────────────
const Bleach: React.FC<{
  f: number; sc: number; cx: number; cy: number; W: number; H: number; burn: number;
}> = ({ f, sc, cx, cy, W, H, burn }) => {
  const pour = clamp01((f - 494) / 40);
  if (pour <= 0 || f > 986) return null;
  const b = clip(sc, cx, cy, W, H, -1800, -24);
  const drop = -(1 - pour) * 300;
  const wob = Math.sin(f / 17) * 4 + Math.sin(f / 29) * 2.6;
  // el cloro: pesado, lento, y se FRENA en la boca del poro
  const sink = clamp01((f - 606) / 46);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `translateY(${drop.toFixed(1)}px)` }}>
      {/* cuerpo del líquido */}
      {b.height > 0 && (
        <div
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: b.width,
            height: b.height,
            background:
              `linear-gradient(180deg, rgba(214,228,236,0.13) 0%, rgba(196,214,226,0.2) 46%, rgba(226,238,244,0.3) 100%)`,
            boxShadow: `inset 0 -26px 46px rgba(255,255,255,0.14)`,
          }}
        />
      )}
      {/* menisco: donde el líquido TOCA la cara y no pasa de ahí */}
      <div
        style={{
          position: "absolute",
          left: b.left,
          top: -34 + wob * 0.5,
          width: b.width,
          height: 26,
          borderRadius: "50% 50% 12px 12px / 100% 100% 8px 8px",
          background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(214,232,240,0.2) 62%, rgba(255,255,255,0) 100%)`,
          boxShadow: `0 4px 16px rgba(255,255,255,0.25), 0 -3px 0 rgba(255,255,255,0.32)`,
        }}
      />
      {/* 94%: agua, chiquita y rapidísima */}
      {WDOTS.map((d, i) => {
        const y = d.y + Math.sin(f / (13 / d.sp) + d.ph) * 26 - clamp01((f - 870) / 60) * (d.y + 30);
        const x = d.x + Math.sin(f / (21 / d.sp) + d.ph * 2) * 34;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - d.r,
              top: y - d.r,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.95) 0%, rgba(196,220,232,0.45) 60%, rgba(255,255,255,0) 100%)`,
            }}
          />
        );
      })}
      {/* 6%: cloro. Grande, pesado, y NO entra. */}
      {CHLO.map((c, i) => {
        const tx = MOUTHS[c.m].x;
        const ty = -30 - c.r * 0.86;
        const x = c.x0 + (tx - c.x0) * sink + Math.sin(f / 33 + c.ph) * (1 - sink) * 24;
        const y = c.y0 + (ty - c.y0) * sink + (sink > 0.98 ? Math.sin(f / 9 + c.ph) * 3.4 : 0);
        const sq = sink > 0.9 ? 1 + Math.sin(f / 9 + c.ph) * 0.035 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y }}>
            {/* la reacción: le arranca el pigmento a lo que toca */}
            {burn > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: -c.r * 2.2,
                  top: c.r * 0.3,
                  width: c.r * 4.4,
                  height: c.r * 1.5,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(MD.bone, 0.6 * burn)} 0%, rgba(237,233,226,0) 70%)`,
                }}
              />
            )}
            {[[-0.72, 0.36, 0.44], [0.74, 0.3, 0.4], [0.06, -0.7, 0.38]].map((s, k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: c.r * s[0] - c.r * s[2],
                  top: c.r * s[1] - c.r * s[2],
                  width: c.r * s[2] * 2,
                  height: c.r * s[2] * 2,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 34% 28%, ${rgba(MD.redHot, 0.9)} 0%, ${rgba(MD.red, 0.65)} 58%, rgba(70,10,8,0.7) 100%)`,
                  boxShadow: `inset 0 -3px 8px rgba(0,0,0,0.5), 0 0 ${(c.r * 0.5).toFixed(0)}px ${rgba(MD.red, 0.4)}`,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: -c.r,
                top: -c.r,
                width: c.r * 2 * sq,
                height: c.r * 2 * sq,
                borderRadius: "50%",
                background: `radial-gradient(circle at 34% 26%, rgba(255,255,255,0.92) 0%, rgba(226,238,244,0.5) 40%, rgba(120,146,162,0.42) 100%)`,
                boxShadow:
                  `inset 0 -${(c.r * 0.28).toFixed(0)}px ${(c.r * 0.5).toFixed(0)}px rgba(20,30,40,0.55), ` +
                  `inset 0 ${(c.r * 0.16).toFixed(0)}px ${(c.r * 0.3).toFixed(0)}px rgba(255,255,255,0.8), ` +
                  `0 ${(c.r * 0.2).toFixed(0)}px ${(c.r * 0.5).toFixed(0)}px rgba(0,0,0,0.7)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ── EL AGUA SÍ ENTRA · gotas que bajan por las bocas hasta las raíces ─────────────────────────
const WaterFall: React.FC<{ f: number }> = ({ f }) => (
  <>
    {DROPS.map((d, i) => {
      const p = (f - d.at) / d.dur;
      if (p <= 0 || p >= 1.02) return null;
      const ey = interpolate(clamp01(p), [0, 1], [-8, 1240], { ...CL, easing: Easing.bezier(0.42, 0, 0.62, 1) });
      const x = d.x + Math.sin(f / 15 + d.ph) * 11 * clamp01(p * 3);
      const st = 1 + clamp01(p * 2.4) * 1.6; // se estira al acelerar
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - d.r,
            top: ey - d.r,
            width: d.r * 2,
            height: d.r * 2 * st,
            borderRadius: "50%",
            background: `radial-gradient(circle at 38% 26%, rgba(255,255,255,0.98) 0%, rgba(208,228,238,0.55) 52%, rgba(255,255,255,0.08) 100%)`,
            boxShadow: `0 0 ${(d.r * 1.6).toFixed(1)}px rgba(255,255,255,0.4)`,
          }}
        />
      );
    })}
  </>
);

// ══════════════════════════════════════════════════════════════════════════════════════════════
// EL MOVIMIENTO
// ══════════════════════════════════════════════════════════════════════════════════════════════
export const MovRoots: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const D = Math.max(420, durationInFrames);

  // ── LA CÁMARA (una sola, frame global, monótona: ningún acto la reinicia) ──
  const S = camS(frame);
  const CX = camXAt(frame);
  const CY = camYAt(frame);
  const c = cam(frame, { z0: -140, z1: 280, dur: DREF });
  const rig = `rotateX(${camRX(frame).toFixed(2)}deg) rotateY(${camRY(frame).toFixed(2)}deg)`;

  // ── LA LUZ: arranca FRÍA (la ventanita) y vira a ROJO cuando entra la lejía ──
  const tRed = clamp01((frame - 440) / 250);
  const tint = light(tRed * 0.92, "cold", "red");
  const keyTravel = kf(frame, [0, 500, 900, DREF], [0.22, 0.4, 0.54, 0.62]);
  const atmoInt = kf(frame, [0, 300, 430, 900, DREF], [1, 0.98, 0.82, 0.92, 1.06]);

  // ── ESTADOS DE MATERIA (lo que hace que un acto se vuelva el siguiente) ──
  const mat = clamp01((frame - 298) / 42);
  const openDeg = kf(frame, [180, 258, 296], [0, 84, 89], Easing.bezier(0.55, 0, 0.18, 1));
  const bleach = kf(frame, [792, 802, 874], [0, 0.07, 1]);
  const burn = kf(frame, [790, 834], [0, 1]);
  const mouthOpen = kf(frame, [286, 338], [0.18, 1]);
  const wet = kf(frame, [876, 992], [0, 1]);
  const alive = kf(frame, [1058, 1152, 1218], [0, 0.5, 1]);
  const wallDim = kf(frame, [300, 366, 436], [1, 0.88, 0.2]);

  // ── HOLD VIVO: la velocidad del descenso del acto 5 dibuja estelas ──
  const spd = Math.abs(camYAt(frame) - camYAt(frame - 1)) * S;
  const streak = clamp01((spd - 4) / 26);

  // escalas por estrato (m): los planos cercanos se mueven más
  const sBody = S;
  const sWall = S * 0.74;
  const sBleach = S * 1.06;

  // ancla del rótulo del cloro (sigue a la molécula encajada en la boca central)
  const chX = Math.min(W - 640, Math.max(96, W / 2 + sBleach * (MOUTHS[4].x - CX) + 130));
  const chY = Math.min(H - 260, Math.max(120, H / 2 + sBleach * (-92 - CY) - 40));

  const boot = kf(frame, [0, 11], [1, 0], Easing.out(Easing.cubic));
  const outP = clamp01((frame - (D - 16)) / 16);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* ⛔ UNA SOLA atmósfera, montada una vez, fuera de los actos. Nunca se remonta. */}
      <Atmos tint={tint} keyFrom={keyTravel} intensity={atmoInt} />

      {/* ── LA CÁMARA COMPARTIDA (Stage.cam): perspectiva + dolly + deriva viva ── */}
      <AbsoluteFill style={{ transform: c.transform, transformStyle: "preserve-3d" }}>
        <AbsoluteFill style={{ transform: rig, transformStyle: "preserve-3d" }}>

          {/* ══ PLANO −320 · el cuarto detrás de todo (nunca desaparece) ══ */}
          <AbsoluteFill style={{ transform: "translateZ(-320px)", transformStyle: "preserve-3d" }}>
            <div
              style={{
                position: "absolute",
                left: -420,
                top: -260,
                width: 900,
                height: 1900,
                transform: `rotate(15deg) translate(${(-CX * 0.06).toFixed(1)}px, ${(-CY * 0.05).toFixed(1)}px)`,
                background: `linear-gradient(180deg, ${rgba(MD.cold, 0.12 * atmoInt)} 0%, ${rgba(MD.cold, 0.03)} 44%, rgba(0,0,0,0) 78%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -180,
                bottom: -220,
                width: 1000,
                height: 900,
                borderRadius: "50%",
                transform: `translate(${(-CX * 0.05).toFixed(1)}px, ${(-CY * 0.04).toFixed(1)}px)`,
                background: `radial-gradient(circle, ${rgba(MD.warm, 0.1)} 0%, rgba(0,0,0,0) 68%)`,
              }}
            />
          </AbsoluteFill>

          {/* ══ PLANO −170 · LA PARED DE AZULEJOS ══ */}
          <Plane dz={-170} sc={sWall} cx={CX} cy={CY} opacity={wallDim}>
            <TileWall sc={sWall} cx={CX} cy={CY} W={W} H={H} f={frame} />
          </Plane>

          {/* ══ PLANO −40 · EL CUERPO: costra + corte + poros + hifas + raíces ══
              Es UN SOLO objeto de punta a punta: la línea negra del acto 1 es la misma
              costra que en el acto 4 se blanquea, y las hifas del acto 2 son las raíces
              que beben en el acto 5. Nada se reemplaza: todo se transforma. */}
          <Plane dz={-40} sc={sBody} cx={CX} cy={CY}>
            <SectionBody sc={sBody} cx={CX} cy={CY} W={W} H={H} mat={mat} />
            {frame > 186 && (
              <Hyphae f={frame} sc={sBody} cx={CX} cy={CY} W={W} H={H} layer={0} alive={alive * 0.7} />
            )}
            {frame > 296 && (
              <PoreField f={frame} cx={CX} cy={CY} reveal={1} wet={wet} />
            )}
            {frame > 186 && (
              <Hyphae f={frame} sc={sBody} cx={CX} cy={CY} W={W} H={H} layer={1} alive={alive} />
            )}
            {frame > 856 && <RootMat f={frame} sc={sBody} cx={CX} cy={CY} W={W} H={H} alive={alive} />}
            {frame > 862 && <WaterFall f={frame} />}
            <Crust sc={sBody} cx={CX} cy={CY} W={W} H={H} f={frame} bleach={bleach} />
            <Mouths f={frame} open={mouthOpen} bleach={bleach} />
            {/* COSTURA @186 · MATCH-SHAPE: la tapa gira sobre el borde de la costra.
                La costra no se mueve un píxel — es el eje. Nada aparece de la nada. */}
            {frame < 300 && <CoverFlap sc={sBody} cx={CX} cy={CY} W={W} H={H} deg={openDeg} />}
          </Plane>

          {/* ══ PLANO +40 · LA LEJÍA (delante de la cara de la junta) ══ */}
          <Plane dz={40} sc={sBleach} cx={CX} cy={CY}>
            <Bleach f={frame} sc={sBleach} cx={CX} cy={CY} W={W} H={H} burn={burn} />
          </Plane>

          {/* ══ PLANO +150 · aire del baño: vapor y polvo (hold vivo permanente) ══ */}
          <AbsoluteFill style={{ transform: "translateZ(150px)", transformStyle: "preserve-3d" }}>
            {MOTES.map((m, i) => {
              const y = wrap(m.y - CY * 0.42 * m.sp - frame * 0.24 * m.sp, H + 260) - 130;
              const x = wrap(m.x - CX * 0.5 * m.sp + Math.sin(frame / 63 + m.ph) * 24, W + 240) - 120;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: m.r * 2,
                    height: m.r * 2,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${rgba(MD.white, 0.2 + m.sp * 0.1)} 0%, rgba(255,255,255,0) 70%)`,
                    opacity: 0.5 + Math.sin(frame / 24 + m.ph) * 0.3,
                  }}
                />
              );
            })}
            {/* estelas del descenso: sólo existen mientras la cámara REALMENTE baja */}
            {streak > 0.01 &&
              Array.from({ length: 16 }, (_, i) => {
                const r1 = rnd(i * 4.7 + 151);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: r1 * (W + 200) - 100,
                      top: wrap(r1 * 1400 - frame * (16 + r1 * 26), H + 700) - 350,
                      width: 2 + r1 * 3,
                      height: 190 + r1 * 320,
                      borderRadius: 4,
                      background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.24)} 50%, rgba(255,255,255,0) 100%)`,
                      opacity: streak * (0.3 + r1 * 0.5),
                    }}
                  />
                );
              })}
          </AbsoluteFill>

          {/* ══ PLANO +260 · primer plano fuera de foco (parallax fuerte, aterriza la escala) ══ */}
          <AbsoluteFill style={{ transform: "translateZ(260px)", transformStyle: "preserve-3d" }}>
            <div
              style={{
                position: "absolute",
                left: -360,
                bottom: -300,
                width: 1120,
                height: 1080,
                borderRadius: "44% 56% 50% 50%",
                transform: `translate(${((CX + 60) * 0.55).toFixed(1)}px, ${(-(CY - 400) * 0.22).toFixed(1)}px)`,
                background: `radial-gradient(circle at 62% 34%, rgba(2,3,4,0.94) 0%, rgba(3,4,6,0.72) 52%, rgba(0,0,0,0) 76%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -420,
                top: -280,
                width: 980,
                height: 900,
                borderRadius: "52% 48% 46% 54%",
                transform: `translate(${(-(CX + 60) * 0.42).toFixed(1)}px, ${(-(CY - 400) * 0.16).toFixed(1)}px)`,
                background: `radial-gradient(circle at 38% 66%, rgba(2,3,4,0.86) 0%, rgba(3,4,6,0.6) 50%, rgba(0,0,0,0) 74%)`,
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── GRADE: el rojo de alerta entra con la lejía y se queda ── */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          mixBlendMode: "screen",
          background: `radial-gradient(90% 70% at 84% 8%, ${rgba(MD.red, 0.17 * tRed)} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.5) 100%)`,
        }}
      />

      {/* ══ TIPOGRAFÍA · UNA idea por acto, titular ≤7 palabras, siempre con cama oscura ══ */}

      {/* ACTO 1 — "the mold you can see is the top of a living thing" (f8) / "it has roots" (f99) */}
      <Block at={14} out={172} anchor="bl">
        <Kicker>THE PART YOU CAN SEE</Kicker>
        <div style={{ marginTop: 12, clipPath: `inset(0 ${((1 - clamp01((frame - 92) / 16)) * 100).toFixed(1)}% 0 0)` }}>
          <Title size={92}>
            IT HAS <Em>ROOTS</Em>
          </Title>
        </div>
      </Block>

      {/* ACTO 2 — "little threads, they run down inside the grout and the caulk" (f187) */}
      <Block at={196} out={288} anchor="tl">
        <Kicker>HYPHAE</Kicker>
        <div style={{ marginTop: 12 }}>
          <Title size={72}>
            THREADS RUNNING <Em>DOWN</Em>
          </Title>
        </div>
      </Block>

      {/* ACTO 3 — "grout is not stone, it's cement with sand" (f305) / "a sponge" (f416) */}
      <Block at={312} out={488} anchor="bl">
        <Kicker>NOT STONE — CEMENT AND SAND</Kicker>
        <div style={{ marginTop: 12, clipPath: `inset(0 ${((1 - clamp01((frame - 418) / 15)) * 100).toFixed(1)}% 0 0)` }}>
          <Title size={92}>
            IT&apos;S A <Em>SPONGE</Em>
          </Title>
        </div>
      </Block>

      {/* ACTO 4a — "household bleach is about 94% water" (f508) */}
      <Block at={514} out={686} anchor="tr" w={640}>
        <Kicker>HOUSEHOLD BLEACH IS</Kicker>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 16, marginTop: 6 }}>
          <div
            style={{
              fontFamily: F_SANS,
              fontWeight: 900,
              fontSize: 152,
              lineHeight: 1,
              letterSpacing: -5,
              color: MD.white,
              textShadow: `0 8px 34px rgba(0,0,0,0.9), 0 0 40px ${rgba(MD.cold, 0.35)}`,
            }}
          >
            {Math.round(kf(frame, [518, 548], [0, 94]))}%
          </div>
          <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 54, letterSpacing: 3, color: MD.bone }}>
            WATER
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            opacity: clamp01((frame - 552) / 16),
          }}
        >
          <div style={{ ...glassStyle({ radius: 8 }), padding: "10px 16px", fontFamily: F_SANS, fontWeight: 800, fontSize: 32, color: MD.redHot, letterSpacing: 2 }}>
            6% CHLORINE
          </div>
        </div>
      </Block>

      {/* ACTO 4b — rótulo anclado a la molécula: "it does not travel into a porous surface" (f611) */}
      {frame > 626 && frame < 800 && (
        <div
          style={{
            position: "absolute",
            left: chX,
            top: chY,
            opacity: clamp01((frame - 626) / 14) * (1 - clamp01((frame - 784) / 16)),
            transform: `translateY(${((1 - clamp01((frame - 626) / 14)) * 14).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              ...glassStyle({ radius: 10 }),
              padding: "14px 20px",
              borderLeft: `4px solid ${MD.red}`,
              background: "linear-gradient(180deg, rgba(8,8,10,0.9), rgba(8,8,10,0.7))",
            }}
          >
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 34, color: MD.white, letterSpacing: 1.4, whiteSpace: "nowrap" }}>
              TOO BIG TO GO IN
            </div>
          </div>
        </div>
      )}

      {/* ACTO 4c — "it sits on the face of the grout and destroys pigment" (f792) */}
      <Block at={800} out={866} anchor="bl">
        <Kicker>ON THE FACE ONLY</Kicker>
        <div style={{ marginTop: 12 }}>
          <Title size={80}>
            IT KILLS THE <Em>PIGMENT</Em>
          </Title>
        </div>
      </Block>

      {/* ACTO 5a — "the water part goes in, all the way in, down to the roots" (f878) */}
      <Block at={892} out={1060} anchor="tl">
        <Kicker>THE WATER PART</Kicker>
        <div style={{ marginTop: 12 }}>
          <Title size={72}>
            GOES ALL THE WAY <Em>DOWN</Em>
          </Title>
        </div>
      </Block>

      {/* ACTO 5b — el remate: f1117 "so you didn't kill it" / f1157 "you watered it" */}
      <Block at={1117} out={D - 14} anchor="bl" w={980}>
        <Kicker>SO YOU DIDN&apos;T KILL IT</Kicker>
        <div style={{ marginTop: 12, clipPath: `inset(0 ${((1 - clamp01((frame - 1157) / 15)) * 100).toFixed(1)}% 0 0)` }}>
          <Title size={78}>
            YOU BLEACHED ITS <Em>HAIR</Em>
          </Title>
        </div>
        <div style={{ marginTop: 6, clipPath: `inset(0 ${((1 - clamp01((frame - 1186) / 15)) * 100).toFixed(1)}% 0 0)` }}>
          <Title size={78}>
            THEN YOU <Em>WATERED</Em> IT
          </Title>
        </div>
      </Block>

      {/* ══ COSTURAS — una distinta por frontera, ⛔ ningún fundido ══ */}
      {/* @186 MATCH-SHAPE (la tapa gira sobre la costra) + la luz agarrando el filo */}
      <Sheen at={180} dur={28} angle={14} />
      {/* @300 WIPE POR MATERIA: vapor de baño; detrás el cemento ya es grano, arena y poros */}
      <VaporWipe at={296} dur={26} />
      {/* la lejía entrando: brillo especular antes del corte */}
      <Sheen at={470} dur={24} angle={-10} />
      {/* @500 OCLUSIÓN: una lámina pálida y pesada cruza el lente y tapa el 100% */}
      <Occluder at={496} dur={15} color={MD.bone} angle={-9} />
      {/* @878 MATCH-MOVE: sin overlay. El descenso ES la costura (ver `streak`). */}
      <Sheen at={1204} dur={30} angle={12} />

      {/* rampa de entrada ≤15f: no es un fundido desde negro, es un destello que se apaga */}
      {boot > 0.002 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            mixBlendMode: "screen",
            background: `radial-gradient(70% 60% at 30% 24%, ${rgba(MD.cold, 0.34 * boot)} 0%, rgba(0,0,0,0) 70%)`,
          }}
        />
      )}
      {/* salida óptica antes del corte (⛔ nunca a negro) */}
      {outP > 0.002 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            mixBlendMode: "screen",
            background: `radial-gradient(80% 66% at 46% 62%, ${rgba(MD.bone, 0.26 * Math.sin(outP * Math.PI))} 0%, rgba(0,0,0,0) 72%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
