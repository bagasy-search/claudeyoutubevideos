// MovDilution.tsx — MOVIMIENTO 4 · "IT WAS NEVER THE PRODUCT" · 1080 frames @30fps (36 s)
// Canal Mike Dalton (EN) · video `mdring`. Escenario compartido: ./RingStage.
//
// UN SOLO PLANO SECUENCIA. Una atmósfera (<RingAtmos/>) montada UNA vez para los 1080 frames.
// UNA cámara función del frame GLOBAL que nunca vuelve a 0 y cuyo z es MONÓTONO: −260 → +640.
// La LUZ evoluciona FRÍO → FRÍO LAVADO (la dilución también lava la luz) → FRÍO ALTO → ROJO PLENO.
//
// LA MATERIA QUE CRUZA LAS CUATRO FRONTERAS es EL LÍQUIDO ROJO:
//   acto 1 · cae del vaso a la taza LLENA       → acto 2 · se abre en volutas y DESAPARECE
//   acto 3 · ya no está (por eso hay discusión) → acto 4 · cae sobre porcelana SECA y SE QUEDA ENTERO
//   acto 5 · se cierra en BANDA ROJA SÓLIDA ← esto hereda MovCurve (arranca pegado a un punto rojo).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// (VECINO ANTERIOR · MovShoreline sale en z +420, la línea de agua ya convertida en ELIPSE y la luz
//  virando a cálida. Entramos a pico sobre esa misma elipse: ahora ES la boca de la taza llena.)
//
// ACTO 1 · f0–200 · "A CUP INTO A FULL BOWL"    protagonista: el vaso volcándose sobre la taza LLENA
//   material   clip `broll/mdring_h50_cupoverfullbowl.mp4` — tarjeta HÉROE (f0–144)
//              foto `img/mdring_h50_cupoverfullbowl.jpg` — cama de foto z −620
//              foto `img/mdring_h51_pointfullbowl.jpg` — tarjeta chica "A FULL BOWL" z −250
//   enterFrom  cam {z −260, rx −20, ry +5 — A PICO sobre la boca de la taza}  luz {FRÍO, key 0.22}
//   exitTo     cam {z −90, rx −14}                                            luz {FRÍO, key 0.44}
//   materia    {el chorro rojo entra al agua y empieza a abrirse}
//   texto      f119 · "NOT APPLYING A CLEANER"
//   ── FRONTERA A @186-212 ····· ZOOM-THROUGH ·················································
//      la elipse de agua escala ×8,6 y ATRAVESAMOS la superficie. Costura de PENETRACIÓN: la
//      cámara se mete DENTRO del mismo objeto que veníamos mirando. Nada aparece ni desaparece;
//      lo único que cambia es de qué lado de la superficie estamos. (Un fade acá sería mentira:
//      el acto 2 es literalmente el interior del acto 1.)
//
// ACTO 2 · f200–470 · "A GALLON AND A HALF"     protagonista: la dilución (el agua se lo come)
//   material   lámina real `img/mdring_lam_dilution.jpg` — página de la guía, tarjeta grande z −120
//              clip `broll/mdring_h34_bleachpour.mp4` — "LABEL STRENGTH" (f236–378) z +60
//              foto `img/mdring_h34_bleachpour.jpg` — cama de foto z −560
//   enterFrom  cam {z −90, rx −14 — ya DEBAJO de la superficie}  luz {FRÍO, key 0.44}
//   exitTo     cam {z +90, rx −4}                                luz {FRÍO LAVADO 72%, key 0.62}
//   materia    {volutas rojas que pierden el cuerpo hasta ser nada · la barra de 25 celdas}
//   texto      f296 · "A 25TH OF THE STRENGTH"
//   ── FRONTERA B @416-596 ····· MATCH-SHAPE ··················································
//      el aro pálido de la última voluta (círculo r 360 centrado en el agua) SE CONVIERTE, sin
//      cortar, en el MARCO de la tarjeta "9 DAYS" del acto 3: mismo elemento <MatchRing/>, vive
//      FUERA de los dos grupos de acto, y morfea posición + tamaño + border-radius 50%→16.
//      La forma no se sustituye: se MUEVE. Por eso no hace falta ningún fundido.
//
// ACTO 3 · f470–752 · "BOTH TELLING THE TRUTH"  protagonista: el CONTRASTE 9 vs 19
//   material   clip `broll/mdring_h49_bleachpoultice.mp4` — "9 DAYS", plano CERCANO z +40 (f472–614)
//              clip `broll/mdring_h15_pouronring.mp4`     — "19 DAYS", plano LEJANO  z −190 (f508–650)
//              a f616 / f652 los dos clips SE CONGELAN en sus fotos `img/…jpg`: la discusión de
//              internet son capturas, no video. El número CRECE DESDE EL BORDE de cada tarjeta.
//              foto `img/mdring_h51_pointfullbowl.jpg` — cama de foto z −600
//   enterFrom  cam {z +90, rx −4}   luz {FRÍO ALTO, key 0.62}
//   exitTo     cam {z +300, rx +2}  luz {8% de rojo}
//   materia    {la línea de agua sigue ahí, a media altura: es la variable escondida}
//   texto      f645 · "BOTH ARE TELLING THE TRUTH"
//   ── FRONTERA C @730-782 ····· WIPE POR MATERIA (el agua bajando) ····························
//      una CORTINA DE AGUA con menisco propio baja y tapa el 100% entre f748 y f756; el cambio de
//      acto cae en f752, DENTRO de la materia. Es literalmente "one of them shut the water off":
//      la costura y la frase son el mismo gesto.
//
// ACTO 4 · f752–928 · "IT WAS THE DILUTION"     protagonista: el rojo que YA no se diluye
//   material   clip `broll/mdring_h16_paperlay.mp4` — apoya el papel sobre lo SECO (f762–902) z +40
//              foto `img/mdring_h16_paperlay.jpg` — cola de la tarjeta (f902–944)
//              foto `img/mdring_h15_pouronring.jpg` — cama de foto z −620
//   enterFrom  cam {z +300, rx +2 — bajando}   luz {ROJO 22%, key 0.38}
//   exitTo     cam {z +470, rx +6}             luz {ROJO PLENO, key 0.70}
//   materia    {el mismo líquido cae sobre porcelana SECA y por primera vez SE QUEDA ENTERO ·
//               cruza además el contador "19" del acto 3, acoplado abajo a la izquierda}
//   texto      f846 "IT WAS NEVER THE PRODUCT" (kicker) → f896 "IT WAS THE DILUTION" (head)
//   ── FRONTERA D @926 ····· CORTE EN EL BEAT (SeamFlash, 6 frames) ····························
//      el charco rojo SNAPEA a banda en 3 frames DENTRO del destello y aterriza exactamente en
//      (960, 648), que es donde el acto 5 dibuja su banda: el golpe tapa el cambio y la materia
//      queda registrada al pixel. No hay disolvencia — hay un impacto.
//
// ACTO 5 · f928–1080 · "ALL THREE GET BETTER"   protagonista: la BANDA ROJA SÓLIDA
//   material   clip `broll/mdring_h51_pointfullbowl.mp4` — señala el agua (f938–1078) z +60
//              foto `img/mdring_h50_cupoverfullbowl.jpg` — tarjeta callback "THE SAME CUP" z −120
//              foto `img/mdring_h51_pointfullbowl.jpg` — cama de foto z −520
//   enterFrom  cam {z +470, rx +6}   luz {ROJO}
//   exitTo     cam {z +640, rx +8 — RASANTE contra la porcelana}  luz {ROJO PLENO, key 0.82}
//   materia    {la BANDA ROJA SÓLIDA queda en pantalla, VIVA, para que MovCurve arranque encima}
//   texto      f933 · "ALL THREE GET BETTER"
//
// ⛔ cero Math.random/Date.now · cero backdrop-filter · cero blur grande a pantalla completa
// ⛔ cero fade entre actos · Easing.poly(5) (Easing.quint NO existe)
// ⛔ safe area: la capa de texto va FUERA de la cámara, por eso ningún titular puede salirse
// ⛔ ningún hold quieto más de 1,5 s: deriva de gcam + micro-vida propia en cada componente
// ⛔ ningún clip de 5,04 s expuesto más de 145 frames (después se congela en su foto, a propósito)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import {
  RING, F_SANS, F_SERIF, rgba, lerp, clamp01, rnd,
  gcam, light, RingAtmos, Layers, Plane, MediaCard, PhotoPlane,
  SeamWipeMatter, SeamFlash, Kick, Head, Bed,
} from "./RingStage";

/* ── anclas del guion (frames absolutos: el audio manda) ─────────────────────────────────── */
const K = {
  pour: 0, notCleaner: 119, ingredient: 180, twentyfifth: 296, label: 423,
  argument: 484, truth: 645, shutOff: 759, neverProduct: 846, dilution: 896, allThree: 933,
};
const A2 = 200, A3 = 470, A4 = 752, A5 = 928, END = 1080;

const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.14, 0.86, 0.22, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  drop: Easing.bezier(0.72, 0.0, 0.62, 1),
  quint: Easing.poly(5), // ⛔ Easing.quint NO EXISTE — es Easing.poly(5)
  lin: (t: number) => t,
};
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** rampa multi-key con easing POR SEGMENTO — el easing nunca es constante en toda la pieza */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

const hx = (h: string) => {
  const x = parseInt(h.replace("#", ""), 16);
  return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
};
/** mezcla de dos hex: un MATERIAL se convierte en otro sin recurrir a un fundido */
const mix = (a: string, b: string, k: number) => {
  const p = hx(a), q = hx(b), t = clamp01(k);
  return `rgb(${Math.round(lerp(p[0], q[0], t))},${Math.round(lerp(p[1], q[1], t))},${Math.round(lerp(p[2], q[2], t))})`;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   LA CÁMARA — UNA sola. `gcam()` sobre el frame GLOBAL (nunca reiniciado) aporta la
   perspectiva, la respiración y la deriva viva que comparten los siete movimientos; encima le
   sumo el recorrido dramático con `keyed`, MONÓTONO en z (−260 → +640: no retrocede nunca) y
   con easing distinto por tramo. Mismo patrón que el piso de calidad (mdtank/MovTank).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CAM_K = [0, 119, 200, 296, 423, 470, 560, 645, 752, 846, 896, 928, 1010, 1080];
const CAM_Z = [-260, -196, -90, -34, 36, 90, 146, 208, 300, 382, 428, 470, 562, 640];
const CAM_RX = [-20, -18, -14, -11, -8, -4, -2, 0, 2, 4, 5, 6, 7, 8];
const CAM_RY = [5, 3, -4, -6, -2, 5, 3, -3, -4, -1, 1, 2, 1, 0];
const CAM_PX = [26, -8, -34, 8, 26, -46, 30, 8, -16, 2, -8, 0, -10, -16];
const CAM_PY = [-36, -12, 16, 2, -16, 8, -6, 18, 22, 8, -4, 2, 6, 10];
const CAM_E: ((t: number) => number)[] = [
  EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.soft, EZ.push, EZ.drop,
  EZ.soft, EZ.snap, EZ.push, EZ.glide, EZ.soft,
];

const CAMERA = (f: number) => {
  const base = gcam(f, { z0: 0, z1: 0, dur: END }); // sólo por la deriva/respiración compartida
  const z = keyed(f, CAM_K, CAM_Z, CAM_E);
  const px = keyed(f, CAM_K, CAM_PX, CAM_E);
  const py = keyed(f, CAM_K, CAM_PY, CAM_E);
  const rx = keyed(f, CAM_K, CAM_RX, CAM_E);
  const ry = keyed(f, CAM_K, CAM_RY, CAM_E);
  return {
    z, px, py,
    transform:
      `${base.transform} translateZ(${z.toFixed(2)}px) ` +
      `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) ` +
      `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`,
  };
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   MATERIA COMPARTIDA
   ══════════════════════════════════════════════════════════════════════════════════════════ */

/** cáusticas — actos 1, 2 y 3 comparten la MISMA piel óptica porque es la MISMA agua */
const Caustics: React.FC<{ f: number; tint: string; op: number; sc?: number }> = ({ f, tint, op, sc = 1 }) => {
  const wob = 1 + Math.sin(f / 43) * 0.07;
  const band = (deg: number, sh: number, o: number, w: number): React.CSSProperties => ({
    position: "absolute", inset: "-40%",
    transform: `translate3d(${sh.toFixed(1)}px, ${(sh * 0.4).toFixed(1)}px, 0) scale(${(wob * sc).toFixed(3)})`,
    background:
      `repeating-linear-gradient(${deg}deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${w}px, ` +
      `${rgba(tint, o * 0.5)} ${w + 8}px, ${rgba(tint, o)} ${w + 15}px, ${rgba(tint, o * 0.4)} ${w + 23}px, ` +
      `rgba(0,0,0,0) ${w + 34}px, rgba(0,0,0,0) ${w + 74}px)`,
    mixBlendMode: "screen",
  });
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <div style={band(101, (f / 2.7) % 260, 0.085, 30)} />
      <div style={band(67, (-f / 3.8) % 260, 0.07, 44)} />
      <div style={band(93, (f / 6.3) % 260, 0.05, 62)} />
    </AbsoluteFill>
  );
};

/** motas en suspensión — sostienen el hold VIVO en cualquier acto */
const Motes: React.FC<{ f: number; n?: number; seed?: number; tint?: string; op?: number; rise?: number }> =
  ({ f, n = 30, seed = 11, tint = RING.cold, op = 0.5, rise = 0.3 }) => (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
        const x = a * 100 + Math.sin(f / (72 + b * 58) + i) * 2.6;
        const y = ((b * 1300 - f * (0.12 + a * rise)) % 1300 + 1300) % 1300;
        const d = 1.7 + b * 3.6;
        return <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: 1220 - y, width: d, height: d,
          borderRadius: "50%", background: rgba(tint, 0.9), opacity: (0.14 + a * 0.5) * op,
        }} />;
      })}
    </div>
  );

/** EL CHORRO ROJO — el MISMO objeto en el acto 1 (cae al agua) y en el acto 4 (cae sobre seco) */
const RedStream: React.FC<{
  f: number; at: number; x: number; yTop: number; yEnd: number; w: number; span?: number; hot?: number;
}> = ({ f, at, x, yTop, yEnd, w, span = 42, hot = 0 }) => {
  const p = clamp01((f - at) / span);
  if (p <= 0) return null;
  const e = EZ.drop(p);
  const h = (yEnd - yTop) * e;
  const col = mix(RING.red, RING.redHot, 0.3 + hot * 0.7);
  const wob = Math.sin(f / 9) * 2.4 + Math.sin(f / 17) * 1.6;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: x - w / 2, top: yTop, width: w, height: Math.max(0, h),
        transform: `translateX(${(wob * 0.35).toFixed(2)}px) skewX(${(wob * 0.5).toFixed(2)}deg)`,
        background: `linear-gradient(180deg, ${rgba(col, 0.96)} 0%, ${rgba(col, 0.88)} 38%, ${rgba(col, 0.74)} 100%)`,
        borderRadius: `${w / 2}px ${w / 2}px 40% 40%`,
        boxShadow: `0 0 26px ${rgba(RING.red, 0.5)}, inset -3px 0 0 ${rgba(RING.redHot, 0.55)}, inset 3px 0 0 ${rgba("#7E1610", 0.7)}`,
      }} />
      <div style={{
        position: "absolute", left: x - w * 0.72, top: yTop + h - w * 0.5, width: w * 1.44, height: w * 1.15,
        borderRadius: "50%", transform: `translateX(${(wob * 0.5).toFixed(2)}px)`,
        background: `radial-gradient(circle at 38% 30%, ${rgba(RING.redHot, 0.95)} 0%, ${rgba(col, 0.92)} 52%, ${rgba("#8C1912", 0.9)} 100%)`,
        boxShadow: `0 0 30px ${rgba(RING.red, 0.55)}`,
        opacity: p < 1 ? 1 : 0.86 + Math.sin(f / 7) * 0.14,
      }} />
      {Array.from({ length: 5 }, (_, i) => {
        const o = rnd(i * 4.3 + at);
        const dp = clamp01((f - at - 4 - i * 3) / (span * (0.7 + o * 0.4)));
        if (dp <= 0 || dp >= 1) return null;
        const d = w * (0.2 + o * 0.24);
        return <div key={i} style={{
          position: "absolute", left: x - d / 2 + (o - 0.5) * w * 2.1, top: yTop + (yEnd - yTop) * EZ.drop(dp) - d,
          width: d, height: d * 1.3, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
          background: rgba(col, 0.9), boxShadow: `0 0 12px ${rgba(RING.red, 0.5)}`,
        }} />;
      })}
    </div>
  );
};

/** LAS VOLUTAS — el rojo abriéndose en el agua y PERDIENDO el cuerpo hasta desaparecer.
 *  No es un fade: cada voluta cambia de MATERIAL (rojo → porcelana) mientras se expande. */
const RedSwirls: React.FC<{ f: number; at: number; cx: number; cy: number; n?: number; life?: number; spread?: number }> =
  ({ f, at, cx, cy, n = 26, life = 210, spread = 640 }) => (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a0 = rnd(i * 3.7) * Math.PI * 2;
        const sp = 0.42 + rnd(i * 5.1 + 2) * 0.9;
        const born = at + Math.floor(rnd(i * 2.1 + 6) * 54);
        const t = clamp01((f - born) / (life * (0.7 + rnd(i * 9.4) * 0.6)));
        if (t <= 0) return null;
        const e = EZ.glide(t);
        const curl = a0 + e * (1.5 + rnd(i * 11.2) * 2.6) * (i % 2 ? 1 : -1);
        const r = e * spread * (0.35 + rnd(i * 6.6) * 0.9);
        const d = 44 + rnd(i * 8.8) * 150 + e * 210;
        const col = mix(RING.redHot, RING.porcelain, clamp01(e * 1.35));
        const alpha = (1 - e) * (1 - e) * 0.62;
        if (alpha < 0.005) return null;
        return <div key={i} style={{
          position: "absolute", left: cx + Math.cos(curl) * r - d / 2, top: cy + Math.sin(curl) * r * 0.6 - d / 2,
          width: d, height: d * (0.62 + rnd(i * 13.1) * 0.5), borderRadius: "50%",
          transform: `rotate(${(curl * 34 + f * sp * 0.5).toFixed(2)}deg)`,
          background: `radial-gradient(closest-side, ${rgba(col, alpha)} 0%, ${rgba(col, alpha * 0.42)} 46%, rgba(0,0,0,0) 76%)`,
          filter: `blur(${(5 + e * 12).toFixed(1)}px)`,
        }} />;
      })}
    </div>
  );

/** LA BOCA DE LA TAZA LLENA vista a pico — vector, porque ES un nivel de agua (permitido). */
const BowlTop: React.FC<{ f: number; tint: string; scale: number; red: number; ripple: number }> =
  ({ f, tint, scale, red, ripple }) => {
    const W = 1010, H = 660;
    const breathe = 1 + Math.sin(f / 71) * 0.006;
    const rr = 0.1 + red * 1.5;
    return (
      <div style={{
        position: "absolute", left: "50%", top: "62%", width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2,
        transform: `scale(${(scale * breathe).toFixed(4)})`, transformOrigin: "50% 46%",
      }}>
        {/* el labio de porcelana */}
        <div style={{
          position: "absolute", inset: -46, borderRadius: "50%",
          background: `linear-gradient(168deg, ${rgba(RING.porcelain, 0.92)} 0%, #B9B6AE 34%, #6A6862 66%, #2B2C30 100%)`,
          boxShadow: `0 42px 90px ${rgba(RING.ink0, 0.85)}, inset 0 -6px 18px ${rgba(RING.ink0, 0.55)}, inset 0 6px 12px ${rgba(RING.white, 0.28)}`,
        }} />
        {/* el agua */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
          background:
            `radial-gradient(72% 74% at 34% 22%, ${rgba(tint, 0.34)} 0%, rgba(0,0,0,0) 62%),` +
            `radial-gradient(120% 120% at 50% 50%, #16242E 0%, #0A1218 58%, #05080B 100%)`,
          boxShadow: `inset 0 10px 40px ${rgba(RING.ink0, 0.8)}, inset 0 0 0 3px ${rgba(RING.white, 0.16)}`,
        }}>
          <Caustics f={f} tint={tint} op={0.6} sc={0.55} />
          {/* ondas concéntricas del impacto */}
          {Array.from({ length: 4 }, (_, i) => {
            const t = clamp01((ripple - i * 0.13) * 1.35);
            if (t <= 0 || t >= 1) return null;
            const s = 0.06 + t * 1.05;
            return <div key={i} style={{
              position: "absolute", left: "50%", top: "48%", width: W * s, height: H * s,
              marginLeft: -W * s / 2, marginTop: -H * s / 2, borderRadius: "50%",
              border: `${(3 + (1 - t) * 4).toFixed(1)}px solid ${rgba(RING.white, 0.22 * (1 - t))}`,
            }} />;
          })}
          {/* EL ROJO adentro: entra concentrado y se abre hasta no ser nada */}
          {red > 0 && (
            <div style={{
              position: "absolute", left: "50%", top: "48%", width: W * rr, height: H * rr,
              marginLeft: -W * rr / 2, marginTop: -H * rr / 2, borderRadius: "50%",
              background: `radial-gradient(closest-side, ${rgba(mix(RING.redHot, RING.porcelain, red * 0.9), 0.72 * (1 - red * 0.92))} 0%, rgba(0,0,0,0) 74%)`,
              filter: "blur(16px)",
            }} />
          )}
          {/* menisco: el reflejo de la ventanita fría, siempre en movimiento */}
          <div style={{
            position: "absolute", left: "12%", top: "10%", width: "44%", height: "22%", borderRadius: "50%",
            background: `radial-gradient(closest-side, ${rgba(RING.white, 0.2)} 0%, rgba(0,0,0,0) 72%)`,
            transform: `translate(${(Math.sin(f / 57) * 8).toFixed(1)}px, ${(Math.cos(f / 49) * 5).toFixed(1)}px)`,
          }} />
        </div>
      </div>
    );
  };

/** revelado PALABRA POR PALABRA — no hay un opacity global sobre el bloque de texto */
const Words: React.FC<{
  text: string; f: number; at: number; step?: number; size: number; color?: string; emFrom?: number;
}> = ({ text, f, at, step = 5, size, color = RING.white, emFrom = -1 }) => (
  <>
    {text.split(" ").map((w, i) => {
      const p = clamp01((f - (at + i * step)) / 12);
      const e = EZ.snap(p);
      const isEm = emFrom >= 0 && i >= emFrom;
      return (
        <span key={i} style={{
          display: "inline-block", marginRight: size * 0.24,
          transform: `translateY(${((1 - e) * size * 0.4).toFixed(2)}px) scale(${(0.93 + e * 0.07).toFixed(3)})`,
          opacity: p,
          filter: p < 1 ? `blur(${((1 - p) * 4).toFixed(2)}px)` : undefined,
          fontFamily: isEm ? F_SERIF : F_SANS,
          fontStyle: isEm ? "italic" : "normal",
          fontWeight: isEm ? 500 : 800,
          color: isEm ? RING.redHot : color,
        }}>{w}</span>
      );
    })}
  </>
);

/** rótulo de dato pegado al borde de una tarjeta (vector: es un gráfico, no un objeto real) */
const EdgeTag: React.FC<{ f: number; at: number; x: number; y: number; text: string; accent?: boolean }> =
  ({ f, at, x, y, text, accent = false }) => {
    const p = clamp01((f - at) / 18);
    const e = EZ.snap(p);
    if (p <= 0) return null;
    return (
      <div style={{
        position: "absolute", left: x, top: y,
        transform: `translateX(${((1 - e) * -26).toFixed(1)}px)`, opacity: p,
        padding: "9px 18px", borderRadius: 4,
        background: accent ? RING.red : "linear-gradient(180deg, rgba(8,8,10,0.9), rgba(8,8,10,0.72))",
        boxShadow: accent ? `0 10px 26px ${rgba(RING.red, 0.42)}` : `0 10px 24px ${rgba(RING.ink0, 0.7)}`,
        borderLeft: accent ? "none" : `3px solid ${RING.cold}`,
        fontFamily: F_SANS, fontWeight: 800, fontSize: 27, letterSpacing: 2.6,
        color: accent ? RING.white : RING.bone, whiteSpace: "nowrap",
        clipPath: `inset(0 ${((1 - e) * 100).toFixed(1)}% 0 0)`,
      }}>{text}</div>
    );
  };

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 1 — A PICO SOBRE LA TAZA LLENA
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const Act1: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const dive = clamp01((f - 186) / 26);                 // FRONTERA A · ZOOM-THROUGH
  const bowlScale = lerp(1, 8.6, EZ.push(dive));
  const red = clamp01((f - 150) / 118);                 // el rojo dentro del agua, abriéndose
  const ripple = clamp01((f - 150) / 64);
  const heroLive = f < 144;
  const heroW = keyed(f, [0, 42, 144, 200], [760, 840, 830, 690], [EZ.soft, EZ.lin, EZ.push]);
  const heroY = keyed(f, [0, 60, 200], [23, 27, 18], EZ.soft);
  const heroRy = keyed(f, [0, 120, 200], [8, -3, -12], EZ.soft);
  return (
    <>
      {/* cama de foto: la habitación real, bajo TODO componente */}
      <PhotoPlane src="img/mdring_h50_cupoverfullbowl.jpg" z={-620} scale={2.1} dim={0.66} />
      {/* pared de porcelana + columna de luz fría de la ventanita alta */}
      <Plane z={-430} style={{ inset: "-45%" }}>
        <div style={{
          position: "absolute", inset: 0,
          background:
            `linear-gradient(176deg, ${rgba(tint, 0.16)} 0%, #141A20 30%, #0A0E13 68%, #06080A 100%),` +
            `radial-gradient(46% 30% at 20% 8%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)`,
        }} />
        <Caustics f={f} tint={tint} op={0.34} sc={1.6} />
      </Plane>
      {/* la tarjeta chica: el plano de contexto (él señalando la taza llena) */}
      <Plane z={-250}>
        <MediaCard src="img/mdring_h51_pointfullbowl.jpg" kind="photo" w={310} h={190}
          x={78} y={19} ry={-16} rx={4} label="A FULL BOWL" lit={0.7} sheenAt={54} />
      </Plane>
      {/* LA BOCA DE LA TAZA — el objeto que vamos a atravesar */}
      <Plane z={-180}>
        <BowlTop f={f} tint={tint} scale={bowlScale} red={red} ripple={ripple} />
      </Plane>
      {/* LA TARJETA HÉROE: el clip real del vaso medidor sobre la taza llena.
          A f144 el clip se agota (5,04 s) y CONGELA en su foto, con el barrido especular
          encima para que el ojo esté en el brillo y no en el cambio de material. */}
      <Plane z={40}>
        <MediaCard
          src={heroLive ? "broll/mdring_h50_cupoverfullbowl.mp4" : "img/mdring_h50_cupoverfullbowl.jpg"}
          kind={heroLive ? "video" : "photo"}
          w={heroW} h={heroW * 0.562} x={44} y={heroY} ry={heroRy} rx={5}
          label="ONE CUP" sheenAt={140} lit={1} />
        <EdgeTag f={f} at={46} x={280} y={140} text="1 CUP" accent />
        <EdgeTag f={f} at={K.ingredient} x={1040} y={880} text="1½ GALLONS OF WATER" />
      </Plane>
      {/* EL CHORRO ROJO cae del vaso al agua: la materia que va a cruzar todo el movimiento */}
      <Plane z={150}>
        <RedStream f={f} at={96} x={806} yTop={470} yEnd={706} w={26} span={52} />
      </Plane>
      <Plane z={300}>
        <Motes f={f} n={26} seed={7} tint={tint} op={0.6} rise={0.42} />
      </Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 2 — DEBAJO DE LA SUPERFICIE. LA DILUCIÓN.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/** la barra de 25 celdas: 1 sola es el producto. Vector porque ES un gráfico. */
const DilutionBar: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const CW = 36, GAP = 8, N = 25;
  const total = N * CW + (N - 1) * GAP;
  const pulse = 0.72 + Math.sin(f / 11) * 0.28;
  return (
    <div style={{ position: "absolute", left: 960 - total / 2, top: 918, width: total }}>
      <div style={{
        position: "absolute", left: 0, top: -46, fontFamily: F_SANS, fontWeight: 800, fontSize: 26,
        letterSpacing: 4.2, color: RING.bone, opacity: clamp01((f - at) / 20),
      }}>ONE PART IN TWENTY-FIVE</div>
      {Array.from({ length: N }, (_, i) => {
        const p = clamp01((f - at - i * 3.2) / 16);
        const e = EZ.snap(p);
        const first = i === 0;
        return (
          <div key={i} style={{
            position: "absolute", left: i * (CW + GAP), top: 0, width: CW, height: 46, borderRadius: 3,
            transform: `scaleY(${(0.16 + e * 0.84).toFixed(3)})`, transformOrigin: "50% 100%",
            background: first
              ? `linear-gradient(180deg, ${RING.redHot} 0%, ${RING.red} 100%)`
              : `linear-gradient(180deg, ${rgba(RING.bone, 0.24)} 0%, ${rgba(RING.bone, 0.09)} 100%)`,
            boxShadow: first ? `0 0 ${(16 * pulse).toFixed(0)}px ${rgba(RING.red, 0.72 * pulse)}` : "none",
            border: `1px solid ${rgba(RING.white, first ? 0.4 : 0.12)}`,
            opacity: p,
          }} />
        );
      })}
    </div>
  );
};

const Act2: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const clipLive = f >= 236 && f < 378;
  const clipOn = f >= 236;
  // en la FRONTERA B las tarjetas se van HACIA EL FONDO: la perspectiva las come. No es un fade.
  const away = keyed(f, [446, 490], [0, 1], EZ.push);
  const lamZ = lerp(-120, -1180, away);
  const clipZ = lerp(60, -1080, away);
  return (
    <>
      <PhotoPlane src="img/mdring_h34_bleachpour.jpg" z={-560} scale={2.0} dim={0.7} />
      <Plane z={-380} style={{ inset: "-40%" }}>
        <div style={{
          position: "absolute", inset: 0,
          background:
            `radial-gradient(80% 60% at 30% 6%, ${rgba(tint, 0.24)} 0%, rgba(0,0,0,0) 62%),` +
            `linear-gradient(180deg, #0F1A22 0%, #0A1017 46%, #05070A 100%)`,
        }} />
        <Caustics f={f} tint={tint} op={0.7} sc={1.3} />
        <Motes f={f} n={34} seed={23} tint={tint} op={0.7} rise={0.5} />
      </Plane>
      {/* LA LÁMINA REAL DE LA GUÍA — página, no fondo plano */}
      <Plane z={lamZ}>
        <MediaCard src="img/mdring_lam_dilution.jpg" kind="photo" w={520} h={620}
          x={26} y={46} ry={13} rx={-2} label="THE DILUTION PAGE" sheenAt={212} lit={0.94} />
      </Plane>
      {/* EL CLIP: la fuerza que dice la etiqueta (el bidón entero) */}
      {clipOn && (
        <Plane z={clipZ}>
          <MediaCard
            src={clipLive ? "broll/mdring_h34_bleachpour.mp4" : "img/mdring_h34_bleachpour.jpg"}
            kind={clipLive ? "video" : "photo"}
            w={600} h={338} x={70} y={62} ry={-13} rx={3}
            label="LABEL STRENGTH" sheenAt={374} lit={0.9} />
        </Plane>
      )}
      {/* LAS VOLUTAS — la materia roja perdiendo el cuerpo */}
      <Plane z={-40}>
        <RedSwirls f={f} at={A2 - 8} cx={960} cy={520} n={28} life={224} spread={680} />
      </Plane>
      <Plane z={40}>
        <DilutionBar f={f} at={K.twentyfifth} />
      </Plane>
      <Plane z={230}>
        <Motes f={f} n={16} seed={57} tint={RING.porcelain} op={0.4} rise={0.9} />
      </Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA B · MATCH-SHAPE — el MISMO aro. Vive FUERA de los grupos de acto, por eso no hay
   sustitución posible: el círculo del agua se convierte en el marco de la tarjeta "9 DAYS".
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const MatchRing: React.FC<{ f: number }> = ({ f }) => {
  if (f < 416 || f > 600) return null;
  const KS = [416, 452, 486, 560, 600];
  const w = keyed(f, KS, [720, 700, 640, 640, 640], [EZ.lin, EZ.push, EZ.lin, EZ.lin]);
  const h = keyed(f, KS, [720, 690, 366, 366, 366], [EZ.lin, EZ.push, EZ.lin, EZ.lin]);
  const cx = keyed(f, KS, [960, 940, 634, 634, 634], [EZ.lin, EZ.soft, EZ.lin, EZ.lin]);
  const cy = keyed(f, KS, [520, 516, 497, 497, 497], [EZ.lin, EZ.soft, EZ.lin, EZ.lin]);
  const rad = keyed(f, KS, [50, 44, 16, 16, 16], [EZ.lin, EZ.push, EZ.lin, EZ.lin]);
  const bw = keyed(f, KS, [7, 7, 5, 5, 0], [EZ.lin, EZ.soft, EZ.lin, EZ.push]);
  const col = mix(RING.porcelain, RING.red, keyed(f, KS, [0, 0.2, 1, 1, 1], EZ.soft));
  const breathe = Math.sin(f / 29) * 1.2;
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
      borderRadius: `${rad}%`, border: `${bw.toFixed(2)}px solid ${rgba(col, 0.86)}`,
      boxShadow: `0 0 ${(24 + breathe * 6).toFixed(1)}px ${rgba(col, 0.3)}`,
      pointerEvents: "none",
    }} />
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 — 9 vs 19. DOS TARJETAS CON SU CLIP CORRIENDO, EN PROFUNDIDAD DISTINTA.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/** el número CRECE DESDE EL BORDE de su tarjeta, por un riel que se dibuja primero */
const EdgeNumber: React.FC<{
  f: number; at: number; value: string; x: number; y: number; size: number;
  align?: "left" | "right"; railFrom: number; hot?: boolean;
}> = ({ f, at, value, x, y, size, align = "left", railFrom, hot = false }) => {
  const railP = clamp01((f - at) / 13);
  const p = clamp01((f - at - 9) / 26);
  const e = EZ.snap(p);
  if (railP <= 0) return null;
  const col = hot ? RING.redHot : RING.white;
  const wobble = Math.sin(f / 37) * 1.4;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {/* el riel rojo que sale del borde de la tarjeta */}
      <div style={{
        position: "absolute", left: x, top: railFrom, width: 4, height: (y - railFrom),
        transform: `scaleY(${railP.toFixed(3)})`, transformOrigin: "50% 0%",
        background: `linear-gradient(180deg, ${rgba(RING.red, 0.2)} 0%, ${RING.red} 100%)`,
        boxShadow: `0 0 14px ${rgba(RING.red, 0.6)}`,
      }} />
      <div style={{
        position: "absolute", left: align === "left" ? x + 18 : undefined,
        right: align === "right" ? 1920 - x + 18 : undefined, top: y - size * 0.2,
        clipPath: `inset(${((1 - e) * 100).toFixed(1)}% 0 0 0)`,
        transform: `translateY(${((1 - e) * size * 0.24 + wobble).toFixed(2)}px)`,
        display: "flex", alignItems: "flex-end", gap: 14,
      }}>
        <div style={{
          fontFamily: F_SANS, fontWeight: 900, fontSize: size, lineHeight: 0.86, color: col,
          letterSpacing: -4,
          textShadow: `0 10px 40px rgba(0,0,0,0.94), 0 0 ${hot ? 44 : 0}px ${rgba(RING.red, hot ? 0.5 : 0)}`,
        }}>{value}</div>
        <div style={{
          fontFamily: F_SANS, fontWeight: 800, fontSize: size * 0.19, letterSpacing: 4,
          color: RING.bone, paddingBottom: size * 0.12, opacity: clamp01((f - at - 22) / 16),
        }}>DAYS</div>
      </div>
    </div>
  );
};

/** la línea de agua que SIGUE ahí en el acto 3: la variable escondida de toda la discusión */
const WaterLine: React.FC<{ f: number; y: number; tint: string; op?: number }> = ({ f, y, tint, op = 1 }) => (
  <div style={{ position: "absolute", left: "-20%", right: "-20%", top: y, height: 420, opacity: op, pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, height: 3,
      background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(RING.white, 0.42)} 22%, ${rgba(RING.white, 0.6)} 50%, ${rgba(RING.white, 0.36)} 78%, rgba(0,0,0,0) 100%)`,
      transform: `translateY(${(Math.sin(f / 33) * 2.4).toFixed(2)}px)`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, top: 3, bottom: 0,
      background: `linear-gradient(180deg, ${rgba(tint, 0.2)} 0%, ${rgba(tint, 0.06)} 44%, rgba(0,0,0,0) 100%)`,
      transform: `translateY(${(Math.sin(f / 33) * 2.4).toFixed(2)}px)`,
    }} />
  </div>
);

const Act3: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const aLive = f >= 472 && f < 616;   // 144 frames de clip · después CONGELA en su foto
  const bLive = f >= 508 && f < 652;
  const bOn = f >= 500;
  const grow = keyed(f, [462, 500], [0.24, 1], EZ.push);   // sale del aro del MATCH-SHAPE
  return (
    <>
      <PhotoPlane src="img/mdring_h51_pointfullbowl.jpg" z={-600} scale={2.0} dim={0.72} />
      <Plane z={-460} style={{ inset: "-38%" }}>
        <div style={{
          position: "absolute", inset: 0,
          background:
            `radial-gradient(60% 44% at 18% 4%, ${rgba(tint, 0.2)} 0%, rgba(0,0,0,0) 66%),` +
            `linear-gradient(180deg, #131A20 0%, #0A0F14 54%, #05070A 100%)`,
        }} />
        <Motes f={f} n={26} seed={71} tint={tint} op={0.5} rise={0.24} />
      </Plane>
      {/* TARJETA LEJANA · 19 DÍAS */}
      {bOn && (
        <Plane z={-190}>
          <MediaCard
            src={bLive ? "broll/mdring_h15_pouronring.mp4" : "img/mdring_h15_pouronring.jpg"}
            kind={bLive ? "video" : "photo"}
            w={600} h={340} x={70} y={52} ry={-14} rx={3}
            label="SAME BLEACH · WATER OFF" sheenAt={648} lit={0.74} />
        </Plane>
      )}
      {/* la línea de agua sigue viva entre las dos tarjetas */}
      <Plane z={-60}>
        <WaterLine f={f} y={742} tint={tint} op={keyed(f, [470, 520, 726], [0, 0.9, 1], EZ.soft)} />
      </Plane>
      {/* TARJETA CERCANA · 9 DÍAS — nace del aro del MATCH-SHAPE, por eso arranca chica */}
      <Plane z={40}>
        <MediaCard
          src={aLive ? "broll/mdring_h49_bleachpoultice.mp4" : "img/mdring_h49_bleachpoultice.jpg"}
          kind={aLive ? "video" : "photo"}
          w={640 * grow} h={366 * grow} x={33} y={46} ry={11} rx={-3}
          label="SAME BLEACH · WATER ON" sheenAt={612} lit={1} />
      </Plane>
      <Plane z={110}>
        <EdgeNumber f={f} at={K.argument + 30} value="9" x={330} y={720} size={168} railFrom={684} hot />
        <EdgeNumber f={f} at={K.argument + 84} value="19" x={1620} y={772} size={150} align="right" railFrom={736} />
      </Plane>
      <Plane z={240}>
        <Motes f={f} n={14} seed={91} tint={RING.bone} op={0.3} rise={0.7} />
      </Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA C · WIPE POR MATERIA — la cortina de agua baja y tapa el 100% en f748–756.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const WaterCurtain: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  if (f < 728 || f > 786) return null;
  const y = keyed(f, [728, 745, 752, 768, 786], [-176, -58, -28, 58, 138], [EZ.push, EZ.soft, EZ.drop, EZ.push]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: "-10%", right: "-10%", top: `${y.toFixed(2)}%`, height: "150%" }}>
        {/* el menisco: el canto brillante del agua que se va */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: 7,
          background: `linear-gradient(90deg, ${rgba(RING.white, 0.3)} 0%, ${rgba(RING.white, 0.78)} 34%, ${rgba(RING.white, 0.5)} 66%, ${rgba(RING.white, 0.72)} 100%)`,
          boxShadow: `0 0 30px ${rgba(tint, 0.7)}`,
          transform: `translateY(${(Math.sin(f / 6) * 3).toFixed(2)}px)`,
        }} />
        {/* el cuerpo del agua */}
        <div style={{
          position: "absolute", inset: "7px 0 0 0",
          background:
            `linear-gradient(180deg, ${rgba(tint, 0.62)} 0%, ${rgba("#0B1620", 0.9)} 26%, ${rgba("#060B10", 0.96)} 70%, ${rgba("#04070A", 0.99)} 100%)`,
        }}>
          <Caustics f={f} tint={tint} op={0.9} sc={0.7} />
          {/* chorretes verticales: el agua corre por la porcelana mientras baja */}
          {Array.from({ length: 16 }, (_, i) => {
            const o = rnd(i * 6.1);
            return <div key={i} style={{
              position: "absolute", left: `${(o * 100).toFixed(2)}%`, top: 0, width: 2 + o * 5, height: `${(24 + o * 62).toFixed(0)}%`,
              background: `linear-gradient(180deg, ${rgba(RING.white, 0.32)} 0%, rgba(0,0,0,0) 100%)`,
              opacity: 0.3 + o * 0.5,
            }} />;
          })}
        </div>
        {/* gotas que quedan rezagadas por encima del menisco */}
        {Array.from({ length: 12 }, (_, i) => {
          const o = rnd(i * 3.9 + 2);
          const d = 5 + o * 12;
          return <div key={i} style={{
            position: "absolute", left: `${(o * 100).toFixed(2)}%`, top: -(20 + o * 130) - ((f - 728) * (1.4 + o)) % 60,
            width: d, height: d * 1.4, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
            background: rgba(tint, 0.5 + o * 0.3),
          }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 4 — PORCELANA SECA. EL ROJO SE QUEDA ENTERO.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const DryPorcelain: React.FC<{ f: number; dry: number; tint: string }> = ({ f, dry, tint }) => (
  <div style={{ position: "absolute", inset: "-38%" }}>
    <div style={{
      position: "absolute", inset: 0,
      background:
        `linear-gradient(180deg, #0A0D11 0%, #16191E 22%, ${mix("#2A2E34", "#8C8880", dry)} 42%, ` +
        `${mix("#1A1E23", "#B8B4AB", dry)} 62%, ${mix("#0D1014", "#6B6862", dry)} 88%, #06080B 100%)`,
    }} />
    {/* la marca del nivel de agua que se fue: el aro empieza acá */}
    <div style={{
      position: "absolute", left: 0, right: 0, top: "52%", height: 26, opacity: dry * 0.9,
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba("#5A4A3E", 0.7)} 40%, ${rgba("#3A2E26", 0.5)} 70%, rgba(0,0,0,0) 100%)`,
      filter: "blur(2px)",
    }} />
    {/* especular seco (mate, angosto) — reemplaza al brillo húmedo */}
    <div style={{
      position: "absolute", left: "8%", top: "44%", width: "52%", height: "16%", borderRadius: "50%",
      background: `radial-gradient(closest-side, ${rgba(RING.white, 0.14 * dry)} 0%, rgba(0,0,0,0) 74%)`,
      transform: `translateX(${(Math.sin(f / 79) * 12).toFixed(1)}px)`,
    }} />
    {/* la piel de la porcelana */}
    <div style={{
      position: "absolute", inset: 0, opacity: 0.07 * dry, mixBlendMode: "overlay",
      backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
      backgroundSize: "4px 4px",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(70% 50% at 16% 6%, ${rgba(tint, 0.14)} 0%, rgba(0,0,0,0) 64%)`,
    }} />
  </div>
);

/** EL CHARCO ROJO que NO se diluye — y que en la frontera D snapea a BANDA */
const RedPool: React.FC<{ f: number; at: number; cx: number; cy: number; size: number; snap: number; hot: number }> =
  ({ f, at, cx, cy, size, snap, hot }) => {
    const born = EZ.snap(clamp01((f - at) / 28));
    if (born <= 0) return null;
    const w = lerp(size * (0.3 + 0.7 * born), 998, snap);
    const h = lerp(size * 0.42 * (0.3 + 0.7 * born), 46, snap);
    const wob = (a: number, b: number) => (a + Math.sin(f / b) * 3).toFixed(1);
    const rad = snap > 0.02
      ? `${lerp(48, 23, snap).toFixed(1)}px`
      : `${wob(48, 37)}% ${wob(52, 41)}% ${wob(46, 33)}% ${wob(54, 47)}% / ${wob(58, 39)}% ${wob(44, 51)}% ${wob(56, 43)}% ${wob(42, 35)}%`;
    const col = mix(RING.red, RING.redHot, 0.24 + hot * 0.62);
    return (
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, pointerEvents: "none" }}>
        {/* sombra de contacto: está APOYADO sobre la porcelana, no flotando */}
        <div style={{
          position: "absolute", left: "3%", right: "3%", top: "34%", bottom: -h * 0.28, borderRadius: rad,
          background: rgba(RING.ink0, 0.6), filter: "blur(12px)",
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: rad,
          background: `radial-gradient(72% 120% at 34% 22%, ${rgba(RING.redHot, 0.98)} 0%, ${rgba(col, 0.97)} 46%, ${rgba("#7A140F", 0.96)} 100%)`,
          boxShadow: `0 0 ${(34 + hot * 46).toFixed(0)}px ${rgba(RING.red, 0.44 + hot * 0.34)}, inset 0 -4px 12px ${rgba("#5C0F0B", 0.8)}, inset 0 3px 6px ${rgba(RING.redHot, 0.7)}`,
        }} />
        {/* menisco: el borde levantado del líquido sobre seco (por eso NO se corre) */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: rad,
          boxShadow: `inset 0 0 0 2px ${rgba(RING.redHot, 0.55)}`,
        }} />
        {/* especular */}
        <div style={{
          position: "absolute", left: "16%", top: "14%", width: "34%", height: "30%", borderRadius: "50%",
          background: `radial-gradient(closest-side, ${rgba(RING.white, 0.5)} 0%, rgba(255,255,255,0) 76%)`,
          transform: `translateX(${(Math.sin(f / 43) * 5).toFixed(1)}px)`,
        }} />
      </div>
    );
  };

const Act4: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const dry = keyed(f, [A4, 790, 846], [0, 0.7, 1], [EZ.push, EZ.soft]);
  const clipLive = f >= 762 && f < 902;
  return (
    <>
      <PhotoPlane src="img/mdring_h15_pouronring.jpg" z={-620} scale={1.75} dim={0.74} />
      <Plane z={-220}>
        <DryPorcelain f={f} dry={dry} tint={tint} />
      </Plane>
      {/* el clip real: apoya el papel sobre lo SECO */}
      <Plane z={40}>
        <MediaCard
          src={clipLive ? "broll/mdring_h16_paperlay.mp4" : "img/mdring_h16_paperlay.jpg"}
          kind={clipLive ? "video" : "photo"}
          w={700} h={394} x={36} y={46} ry={9} rx={-4}
          label="DRY PORCELAIN" sheenAt={898} lit={0.96} />
      </Plane>
      {/* EL CONTADOR "19" CRUZA LA FRONTERA C: viene del acto 3, ahora sabemos por qué */}
      <Plane z={90}>
        <div style={{
          position: "absolute", left: 340, top: 720, opacity: clamp01((f - K.shutOff) / 20),
          transform: `translateY(${((1 - EZ.snap(clamp01((f - K.shutOff) / 26))) * 24).toFixed(1)}px)`,
        }}>
          <div style={{
            padding: "14px 24px", borderRadius: 6, background: "rgba(6,6,8,0.86)",
            borderLeft: `5px solid ${RING.red}`, boxShadow: `0 18px 44px ${rgba(RING.ink0, 0.8)}`,
            display: "flex", alignItems: "baseline", gap: 12,
          }}>
            <span style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 76, lineHeight: 0.9, color: RING.white }}>19</span>
            <span style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3.4, color: RING.bone }}>DAYS · WATER OFF</span>
          </div>
        </div>
      </Plane>
      {/* LA MATERIA: el mismo chorro, ahora sobre seco */}
      <Plane z={-40}>
        <RedStream f={f} at={K.shutOff + 8} x={1150} yTop={244} yEnd={716} w={30} span={44} hot={dry} />
      </Plane>
      <Plane z={200}>
        <Motes f={f} n={18} seed={131} tint={RING.warm} op={0.42} rise={0.2} />
      </Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 5 — LA BANDA ROJA SÓLIDA (lo que hereda MovCurve)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BandMarks: React.FC<{ f: number }> = ({ f }) => {
  const MARKS = [
    { x: 0.2, at: 952, t: "RING" },
    { x: 0.5, at: 978, t: "SMELL" },
    { x: 0.8, at: 1004, t: "STAIN" },
  ];
  return (
    <>
      {MARKS.map((m, i) => {
        const p = clamp01((f - m.at) / 20);
        const e = EZ.snap(p);
        if (p <= 0) return null;
        const x = 461 + m.x * 998;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 0, pointerEvents: "none" }}>
            <div style={{
              position: "absolute", left: -2, top: 606, width: 4, height: 42,
              transform: `scaleY(${e.toFixed(3)})`, transformOrigin: "50% 100%",
              background: rgba(RING.white, 0.66),
            }} />
            <div style={{
              position: "absolute", left: -70, top: 560, width: 140, textAlign: "center",
              fontFamily: F_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3.2, color: RING.white,
              opacity: p, transform: `translateY(${((1 - e) * 12).toFixed(1)}px)`,
              textShadow: "0 6px 22px rgba(0,0,0,0.9)",
            }}>{m.t}</div>
            <div style={{
              position: "absolute", left: -13, top: 636, width: 26, height: 26, borderRadius: "50%",
              background: RING.white, transform: `scale(${(e * (0.9 + Math.sin(f / 13 + i) * 0.1)).toFixed(3)})`,
              boxShadow: `0 0 22px ${rgba(RING.white, 0.7)}`,
            }} />
          </div>
        );
      })}
    </>
  );
};

const Act5: React.FC<{ f: number; tint: string }> = ({ f, tint }) => {
  const clipLive = f >= 938 && f < 1078;
  const glow = 0.7 + Math.sin(f / 17) * 0.3;
  const bandGrow = EZ.snap(clamp01((f - A5) / 18));
  return (
    <>
      <PhotoPlane src="img/mdring_h51_pointfullbowl.jpg" z={-520} scale={1.5} dim={0.66} />
      <Plane z={-140} style={{ inset: "-30%" }}>
        <div style={{
          position: "absolute", inset: 0,
          background:
            `linear-gradient(180deg, #08090C 0%, #191C21 26%, #7E7A72 52%, #45423D 76%, #0A0C0F 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(64% 40% at 22% 10%, ${rgba(tint, 0.2)} 0%, rgba(0,0,0,0) 62%)`,
        }} />
      </Plane>
      {/* el clip real: él señalando el agua — la acción que arregla las tres cosas */}
      {f >= 936 && (
        <Plane z={60}>
          <MediaCard
            src={clipLive ? "broll/mdring_h51_pointfullbowl.mp4" : "img/mdring_h51_pointfullbowl.jpg"}
            kind={clipLive ? "video" : "photo"}
            w={400} h={226} x={36} y={30} ry={12} rx={-3}
            label="SHUT THE WATER OFF" sheenAt={962} lit={0.95} />
        </Plane>
      )}
      {/* callback: la misma taza del acto 1, ahora vacía de discusión */}
      <Plane z={-120}>
        <MediaCard src="img/mdring_h50_cupoverfullbowl.jpg" kind="photo" w={300} h={170}
          x={66} y={33} ry={-14} rx={4} label="THE SAME CUP" lit={0.7} sheenAt={996} />
      </Plane>
      {/* ⭐ LA BANDA ROJA SÓLIDA — la materia que queda para MovCurve */}
      <Plane z={0}>
        <div style={{
          position: "absolute", left: 461, top: 625, width: 998, height: 46, borderRadius: 23,
          transform: `scaleX(${(0.72 + bandGrow * 0.28).toFixed(3)})`, transformOrigin: "50% 50%",
          background: `linear-gradient(180deg, ${RING.redHot} 0%, ${RING.red} 44%, #8E1811 100%)`,
          boxShadow: `0 0 ${(38 * glow).toFixed(0)}px ${rgba(RING.red, 0.62 * glow)}, 0 22px 48px ${rgba(RING.ink0, 0.85)}, inset 0 3px 5px ${rgba(RING.redHot, 0.8)}, inset 0 -4px 10px ${rgba("#5C0F0B", 0.8)}`,
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, top: 6, height: 9, borderRadius: 6,
            background: `linear-gradient(90deg, rgba(255,255,255,0) 4%, ${rgba(RING.white, 0.34)} 26%, rgba(255,255,255,0) 52%, ${rgba(RING.white, 0.2)} 74%, rgba(255,255,255,0) 96%)`,
            transform: `translateX(${(Math.sin(f / 61) * 22).toFixed(1)}px)`,
          }} />
        </div>
        <BandMarks f={f} />
      </Plane>
      <Plane z={180}>
        <Motes f={f} n={14} seed={177} tint={RING.redHot} op={0.34} rise={0.16} />
      </Plane>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovDilution: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const D = durationInFrames;
  // reloj DRAMÁTICO acotado a 1080 (si el cue dura más, el movimiento aguanta en su destino);
  // los términos VIVOS usan el frame crudo, así ni un solo frame queda perfectamente quieto.
  const f = Math.min(frame, END);
  const c = CAMERA(f);

  // ── LA LUZ EVOLUCIONA: FRÍO → FRÍO LAVADO (la dilución también lava la luz) → ROJO PLENO ──
  const redMix = keyed(f, [0, A3, 700, A4, K.neverProduct, K.dilution, END],
    [0, 0, 0.08, 0.22, 0.62, 1, 1], [EZ.lin, EZ.soft, EZ.push, EZ.soft, EZ.push, EZ.lin]);
  const tint = light(redMix, "cold", "red");
  const wash = keyed(f, [190, 300, 386, A3, 545], [0, 0.5, 0.74, 0.3, 0], [EZ.soft, EZ.lin, EZ.push, EZ.soft]);
  const keyPos = keyed(f, [0, A2, A3, A4, A5, END], [0.22, 0.44, 0.62, 0.38, 0.7, 0.82], EZ.soft);
  const intensity = keyed(f, [0, A2, 360, A3, A4, A5, END], [1.0, 0.9, 0.62, 1.05, 0.92, 1.12, 1.0], EZ.soft);

  // ── ventanas de montaje: un acto se apaga sólo DESPUÉS de que su costura ya lo tapó ──
  const showA1 = f < 216;
  const showA2 = f > 192 && f < 494;
  const showA3 = f > 458 && f < 774;
  const showA4 = f > 744 && f < 948;
  const showA5 = f > 918;

  // ── EL CHARCO ROJO vive por encima de los actos 4 y 5: es el MISMO objeto en los dos.
  //    Viaja de (1150,760) a (960,648) y SNAPEA a banda dentro del destello de la frontera D.
  const poolX = keyed(f, [K.dilution - 40, K.dilution, 918, 926], [1150, 1132, 1020, 960], [EZ.soft, EZ.push, EZ.snap]);
  const poolY = keyed(f, [K.dilution - 40, K.dilution, 918, 926], [760, 752, 700, 648], [EZ.soft, EZ.push, EZ.snap]);
  const poolSnap = keyed(f, [918, 926], [0, 1], EZ.quint);
  const poolHot = keyed(f, [K.neverProduct, K.dilution, 926], [0, 0.7, 1], EZ.push);
  const showPool = f > K.shutOff + 40 && f < A5 + 4;

  // ── texto: UNA idea por acto, siempre <Head> dentro de <Bed>, y FUERA de la cámara (safe area)
  const paraX = -c.px * 0.04, paraY = -c.py * 0.035;
  const t1 = f > K.notCleaner - 12 && f < 198;
  const t2 = f > K.twentyfifth - 12 && f < 462;
  const t3 = f > K.truth - 26 && f < 736;
  const t4 = f > K.neverProduct - 12 && f < 924;
  const t5 = f > K.allThree - 14;

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* ATMÓSFERA — montada UNA vez para los 1080 frames. Nunca se remonta entre actos. */}
      <RingAtmos tint={tint} keyFrom={keyPos} intensity={intensity} />

      {/* EL MUNDO, bajo UNA sola cámara */}
      <Layers cam={c.transform}>
        {showA1 && <Plane z={0}><Act1 f={f} tint={tint} /></Plane>}
        {showA2 && <Plane z={0}><Act2 f={f} tint={tint} /></Plane>}
        {showA3 && <Plane z={0}><Act3 f={f} tint={tint} /></Plane>}
        {showA4 && <Plane z={0}><Act4 f={f} tint={tint} /></Plane>}
        {showA5 && <Plane z={0}><Act5 f={f} tint={tint} /></Plane>}

        {/* FRONTERA B · el aro que atraviesa el corte (vive fuera de los grupos de acto) */}
        <Plane z={70}><MatchRing f={f} /></Plane>

        {/* FRONTERA D · el charco que se convierte en la banda del acto 5, al pixel.
            z=0 EXACTO: al snapear queda en (461,625,998×46), el mismo rect que la banda del
            acto 5 — con otro z la perspectiva las desalinearía justo en el corte. */}
        {showPool && (
          <Plane z={0}>
            <RedPool f={f} at={K.shutOff + 44} cx={poolX} cy={poolY} size={230} snap={poolSnap} hot={poolHot} />
          </Plane>
        )}
      </Layers>

      {/* LA LUZ LAVADA — la dilución no sólo lava el producto: lava la imagen */}
      {wash > 0.004 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(96% 80% at 46% 34%, ${rgba(RING.porcelain, 0.17 * wash)} 0%, ${rgba(RING.cold, 0.07 * wash)} 58%, rgba(0,0,0,0) 100%)`,
        }} />
      )}

      {/* ══ CAPA DE TEXTO — una idea por acto, ≤7 palabras, fuera de la cámara ══════════════ */}
      {t1 && (
        <div style={{
          position: "absolute", left: 110, bottom: 126,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={980}>
            <Kick>YOU POUR A CUP</Kick>
            <div style={{ height: 14 }} />
            <Head size={80}><Words text="NOT APPLYING A CLEANER" f={f} at={K.notCleaner} step={6} size={80} emFrom={3} /></Head>
          </Bed>
        </div>
      )}
      {t2 && (
        <div style={{
          position: "absolute", right: 110, top: 96, textAlign: "right",
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={820}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Kick>A GALLON AND A HALF</Kick>
            </div>
            <div style={{ height: 14 }} />
            <Head size={76}><Words text="A 25TH OF THE STRENGTH" f={f} at={K.twentyfifth} step={6} size={76} emFrom={1} /></Head>
          </Bed>
        </div>
      )}
      {t3 && (
        <div style={{
          position: "absolute", left: 110, top: 96,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={900}>
            <Kick>SAME BLEACH · TWO VERDICTS</Kick>
            <div style={{ height: 14 }} />
            <Head size={74}><Words text="BOTH ARE TELLING THE TRUTH" f={f} at={K.truth - 18} step={6} size={74} emFrom={4} /></Head>
          </Bed>
        </div>
      )}
      {t4 && (
        <div style={{
          position: "absolute", right: 110, top: 96, textAlign: "right",
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={800}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Kick>IT WAS NEVER THE PRODUCT</Kick>
            </div>
            <div style={{ height: 14 }} />
            <Head size={86}><Words text="IT WAS THE DILUTION" f={f} at={K.dilution} step={6} size={86} emFrom={3} /></Head>
          </Bed>
        </div>
      )}
      {t5 && (
        <div style={{
          position: "absolute", left: 110, bottom: 120,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px)`,
        }}>
          <Bed pad={30} w={900}>
            <Kick>SHUT THE WATER OFF</Kick>
            <div style={{ height: 14 }} />
            <Head size={82}><Words text="ALL THREE GET BETTER" f={f} at={K.allThree} step={6} size={82} emFrom={1} /></Head>
          </Bed>
        </div>
      )}

      {/* ══ LAS COSTURAS ══ una distinta por frontera · ninguna es un fundido ═══════════════ */}
      {/* A @186-212 · ZOOM-THROUGH: lo resuelve la escala ×8,6 de la elipse de agua.
          Le sumo el destello de refracción del instante en que se atraviesa la superficie. */}
      {f > 190 && f < 216 && (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `radial-gradient(64% 54% at 50% 52%, ${rgba(RING.porcelain, 0.36 * Math.sin(clamp01((f - 190) / 26) * Math.PI))} 0%, rgba(0,0,0,0) 74%)`,
        }} />
      )}
      {/* B @416-596 · MATCH-SHAPE: lo resuelve <MatchRing/>. Sin ninguna ayuda óptica: si la
          forma es la misma, el corte no existe. */}
      {/* C @728-786 · WIPE POR MATERIA: la cortina de agua bajando + el vapor que la acompaña */}
      <WaterCurtain f={f} tint={tint} />
      <SeamWipeMatter at={736} dur={40} tint={RING.cold} />
      {/* D @926 · CORTE EN EL BEAT: 6 frames de destello y el charco ya es banda */}
      <SeamFlash at={926} dur={6} color={RING.redHot} />

      {/* aberración cromática en los picos de energía (no es un blur global) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: interpolate(f, [K.dilution, K.dilution + 30, 962, 1000], [0, 0.11, 0.09, 0], CL),
        background: `linear-gradient(90deg, ${rgba(RING.red, 0.22)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(RING.cold, 0.16)} 100%)`,
      }} />
      {/* el plano no cierra: sigue avanzando hacia MovCurve */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(90% 74% at 50% 52%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.2 + clamp01((frame - (D - 70)) / 70) * 0.1).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};

export const MOVDILUTION_FRAMES = 1080;
