// MovPits.tsx — MOVIMIENTO 2 · "IT LIVES DOWN INSIDE" · 1200 frames @30fps (40 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA de 40 s. Cinco actos que se FUNDEN, no cinco componentes pegados:
//   · UNA sola atmósfera (<RingAtmos/>) montada al principio y NUNCA remontada.
//   · UNA sola cámara: `gcam(f, …)` + un recorrido multi-clave con easing POR SEGMENTO. El acto 3
//     hereda posición, zoom e inercia del acto 2; ningún acto la reinicia en 0.
//   · La LUZ EVOLUCIONA con `light()`: FRÍA rasante (key 0.18) → FRÍA de linterna (0.31) → FRÍA
//     alta cenital (0.44) → un sangrado ROJO cuando se ve lo que vive en los pozos → FRÍA alta
//     final (key 0.34). Nunca salta.
//
// LA MATERIA QUE CRUZA TODAS LAS FRONTERAS (cadena, nada nace de cero):
//   el BRILLO de la placa (A1) → la GOTA ROJA que resbala sobre él (A1→A2) → la gota deja la
//   BANDA de la línea de agua (A2→A3) → la banda revela EL CRÁTER protagonista (A3→A4) → el
//   cráter es un punto más de la banda entera (A4→A5) → y al cortarlo en sección se ve EL ROJO
//   ADENTRO del cráter, que es exactamente lo que se le entrega al movimiento siguiente.
//   ⭐ Y por debajo de todo: LA MISMA PLACA DE ESMALTE (<Section/>) es el objeto de A1 y de A5:
//   en A1 es un espejo perfecto, en A5 es la misma placa comida de pozos. No se redibuja.
//
// ⛔ MATERIAL REAL: cada tarjeta flotante lleva CLIP o FOTO adentro (MediaCard/PhotoPlane/
//   Carousel3D). Los vectores quedan SOLO para lo que ES un gráfico: la sección del esmalte,
//   los cráteres microscópicos y la cerda del cepillo.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF — nada se reinicia entre actos
// ══════════════════════════════════════════════════════════════════════════════════════════════
// (VECINO ANTERIOR → ) enterFrom {cam z −420 MACRO pegado a la porcelana · luz FRÍA rasante
//                       keyFrom 0.18 · materia: la placa de esmalte llenando el cuadro}
//
// ACTO 1 · f0–196 · "THAT LAYER IS GLASS"      ⭐ material: clip h32_storetoilet + foto h31_oldtoilet
//   enterFrom  cam {z −420, rx +7, panY +40 — rasante, casi a ras de la placa}
//              luz {FRÍA, keyFrom 0.18, int 0.95}
//              materia {la placa de esmalte: espejo perfecto, y su brillo especular}
//   exitTo     cam {z −302, rx +5, panX −30}   luz {keyFrom 0.21, int 1.05}
//              materia {la GOTA ROJA ya cayó sobre el brillo y empezó a resbalar}
//   ── FRONTERA A @186 · MATCH-SHAPE ─────────────────────────────────────────────────────────
//      La barra especular del esmalte y el destello del clip del dedo son LA MISMA FORMA, en la
//      misma diagonal y el mismo tamaño: la barra sigue en pantalla f150–232 sin interrumpirse y
//      el material de atrás cambia debajo de ella. No hay corte visible, hay una forma que persiste.
//
// ACTO 2 · f196–366 · "NOTHING CAN GET A GRIP"  ⭐ material: clip h29_fingertip + foto h30_papertowel
//   enterFrom  cam {z −302, rx +5}  luz {FRÍA, keyFrom 0.21}
//              materia {la gota roja, ya resbalando}
//   exitTo     cam {z −140, rx +3, panX −50}  luz {keyFrom 0.26, int 1.22}
//              materia {la gota sale de cuadro y su estela QUEDA como la BANDA de la línea de agua}
//   ── FRONTERA B @364 · CORTE EN EL BEAT (SeamFlash, 6 frames, frío) ────────────────────────
//      El guion clava "And on my 11-day toilet, under that light…" en f366: es el click de la
//      linterna. Un flash frío cortísimo y entramos DENTRO de la taza. Nunca un fade.
//
// ACTO 3 · f366–625 · "LITTLE CRATERS"          ⭐⭐ EL PLANO ESTRELLA: clip h27_headinbowl a sangre
//   enterFrom  cam {z −140, rx +3}  luz {FRÍA de linterna, keyFrom 0.26, int 1.22}
//              materia {la banda de la línea de agua, ahora bajo el haz}
//   exitTo     cam {z +120, rx −2, panX +60}  luz {keyFrom 0.31, int 1.30}
//              materia {EL CRÁTER protagonista, centrado y creciendo}
//   ── FRONTERA C @615 · ZOOM-THROUGH ────────────────────────────────────────────────────────
//      La boca del cráter se come el cuadro (escala ×15 sobre su propio centro), la pared del
//      pozo oscurece el borde y salimos del otro lado ya en el plano cenital de la banda.
//
// ACTO 4 · f625–880 · "ONLY IN THAT ONE BAND"   ⭐ material: Carousel3D de 5 fotos reales + clip h31_oldtoilet
//   enterFrom  cam {z +125, rx −2}  luz {virando a FRÍA ALTA, keyFrom 0.31}
//              materia {el cráter, ahora un punto entre miles, a la altura de la banda}
//   exitTo     cam {z +340, rx −5, panY +30}  luz {keyFrom 0.44 — cenital, int 0.94}
//              materia {la BANDA entera, un anillo a la altura de los ojos}
//   ── FRONTERA D @866 · OCLUSIÓN (SeamOcclude color hueso = la cabeza del cepillo) ──────────
//      La cerda de nylon barre el cuadro y lo tapa al 100% ~5 frames. Detrás ya estamos en la
//      sección del esmalte: el mismo objeto del acto 1, ahora cortado por la mitad.
//
// ACTO 5 · f880–1200 · "YOU ONLY CUT THE TOPS"  ⭐ material: clip h30_papertowel + foto h31_oldtoilet a sangre
//   enterFrom  cam {z +340, rx −5}  luz {FRÍA alta, keyFrom 0.44}
//              materia {la placa de A1, ahora en sección y comida de pozos}
//   exitTo     cam {z +700 — PLANO GENERAL DE LA BANDA} · luz {FRÍA ALTA, keyFrom 0.34}
//              materia {⭐ UN CRÁTER CON ROJO ADENTRO, intacto después del cepillo}
// (→ VECINO SIGUIENTE recibe exactamente eso: z +700, plano general de la banda, luz fría alta,
//    y un cráter con rojo adentro.)
//
// ⛔ Cero Math.random/Date · cero backdrop-filter · cero blur() sobre imágenes a pantalla completa
//    (los fondos usan las variantes `_blur.jpg` ya horneadas) · cero fade entre actos · cero
//    Easing.quint (no existe) · rutas relativas a public/ sin barra inicial.
//
// NOTA TÉCNICA (esto costó un render): los clips son de 5,04 s → 151 frames a 30 fps. Todo clip
// va envuelto en <Shot> (un Sequence layout="none") para que el video arranque en SU frame 0 y
// no en el frame global del movimiento, y ningún <Shot> de video dura más de MAXCLIP frames.
// Dentro de un <Shot>, `sheenAt` y los tiempos internos de MediaCard son RELATIVOS al Shot.
import React from "react";
import {
  AbsoluteFill, Sequence, Easing, interpolate, useCurrentFrame,
} from "remotion";
import {
  RING, F_SANS, gcam, light, RingAtmos, Layers, Plane, MediaCard, Carousel3D, PhotoPlane,
  SeamOcclude, SeamWipeMatter, SeamFlash, Kick, Head, Em, Bed,
  clamp01, lerp, eio, rnd, rgba,
} from "./RingStage";

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ANCLAS · el guion manda la coreografía (frames absolutos)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const K = {
  notPart: 0,      // "not the part that matters."
  glaze: 41,       // "There's a layer of glaze fired onto it, and that layer is glass."
  point: 196,      // "And that's the entire point of a toilet."
  slick: 275,      // "It's slick."
  grip: 317,       // "Nothing can get a grip."
  eleven: 366,     // "And on my 11-day toilet, under that light, at the water line, it"
  moon: 516,       // "looked like the surface of the moon, little craters."
  band: 625,       // "Nothing you'd ever see standing up, and only in that one band."
  stops: 768,      // "And once you see that, the ring stops being a stain."
  onTop: 880,      // "A stain sits on top of something."
  inside: 954,     // "This lives down inside something."
  scrub: 1030,     // "So when you scrub, you take the top off, you get that satisfying clean"
  white: 1162,     // "white bowl, and"
};

const A1 = 0, A2 = K.point, A3 = K.eleven, A4 = K.band, A5 = K.onTop, END = 1200;
const FA = 186, FB = 364, FC = 615, FD = 866;   // las cuatro fronteras
const MAXCLIP = 146;                            // 5,04 s @24fps ≈ 151 frames a 30 fps · margen

/* ── MATERIAL REAL (verificado en public/) ───────────────────────────────────────────────── */
const CLIP = {
  head: "broll/mdring_h27_headinbowl.mp4",     // ⭐ Mike con la cabeza adentro de la taza + linterna
  mag: "broll/mdring_h28_magnifier.mp4",
  finger: "broll/mdring_h29_fingertip.mp4",
  towel: "broll/mdring_h30_papertowel.mp4",
  old: "broll/mdring_h31_oldtoilet.mp4",
  store: "broll/mdring_h32_storetoilet.mp4",
};
const PIC = {
  head: "img/mdring_h27_headinbowl.jpg",
  mag: "img/mdring_h28_magnifier.jpg",
  finger: "img/mdring_h29_fingertip.jpg",
  towel: "img/mdring_h30_papertowel.jpg",
  old: "img/mdring_h31_oldtoilet.jpg",
  store: "img/mdring_h32_storetoilet.jpg",
  lam: "img/mdring_lam_pits.jpg",              // página real de la guía
};
const BG = {                                    // fondos ya desenfocados en disco (⛔ nada de filter:blur)
  store: "img/mdring_h32_storetoilet_blur.jpg",
  finger: "img/mdring_h29_fingertip_blur.jpg",
  old: "img/mdring_h31_oldtoilet_blur.jpg",
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EASING · nunca constante: cada tramo de cámara tiene el suyo
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.62, 0.0, 0.20, 1),
  snap: Easing.bezier(0.14, 0.86, 0.22, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  drop: Easing.bezier(0.74, 0.0, 0.60, 1),
  lin: (t: number) => t,
};
type Ease = (t: number) => number;

/** rampa multi-clave con easing POR SEGMENTO */
const keyed = (f: number, ks: number[], vs: number[], e: Ease | Ease[] = EZ.glide): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef: Ease = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/** un plano de material con su propio reloj: el clip arranca en SU frame 0, no en el global */
const Shot: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">{children}</Sequence>
);

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ⭐ LA PLACA DE ESMALTE EN SECCIÓN — el objeto que abre y cierra el movimiento.
   Es un GRÁFICO legítimo (un corte transversal), no un objeto real disfrazado de vector.
   En A1: `pitted = 0` → espejo perfecto. En A5: `pitted = 1` → la misma placa, comida de pozos.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const SPITS = Array.from({ length: 9 }, (_, i) => ({
  x: 62 + i * 98 + rnd(i * 3.3 + 1) * 30,
  w: 30 + rnd(i * 5.1 + 2) * 26,
  d: 34 + rnd(i * 7.7 + 3) * 46,
}));
const TOP0 = 168;

const glazePath = (pitted: number, shave: number) => {
  const top = TOP0 + shave;
  let d = `M 0 ${top.toFixed(1)}`;
  for (let i = 0; i < SPITS.length; i++) {
    const p = SPITS[i];
    const half = (p.w / 2) * (0.35 + 0.65 * pitted);
    const depth = p.d * pitted;
    if (depth < 1.2) continue;
    d += ` L ${(p.x - half).toFixed(1)} ${top.toFixed(1)}`;
    d += ` C ${(p.x - half * 0.42).toFixed(1)} ${(top + depth).toFixed(1)} ${(p.x + half * 0.42).toFixed(1)} ${(top + depth).toFixed(1)} ${(p.x + half).toFixed(1)} ${top.toFixed(1)}`;
  }
  d += ` L 1000 ${top.toFixed(1)} L 1000 470 L 0 470 Z`;
  return d;
};

const Section: React.FC<{
  f: number;
  pitted: number;    // 0 espejo · 1 luna
  onTop: number;     // 0..1 · la mancha que se apoya ARRIBA
  inside: number;    // 0..1 · el rojo que vive ADENTRO de los pozos
  bristleX: number;  // −200..1200 · la cerda que corta las puntas (fuera de rango = no hay cepillo)
  tint: string;
  gleam: number;     // 0..1 · el brillo especular (el que prueba que es vidrio)
}> = ({ f, pitted, onTop, inside, bristleX, tint, gleam }) => {
  const bx = Math.max(0, Math.min(1000, bristleX));
  const shave = 15;                      // lo que el cepillo se lleva: la PUNTA, nada más
  const breathe = 1 + Math.sin(f / 44) * 0.008;
  return (
    <svg viewBox="0 0 1000 470" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: `scaleY(${breathe.toFixed(4)})` }}>
      <defs>
        <linearGradient id="mpGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(RING.porcelain, 0.96)} />
          <stop offset="42%" stopColor={rgba(tint, 0.62)} />
          <stop offset="100%" stopColor={rgba(RING.ink2, 0.94)} />
        </linearGradient>
        <linearGradient id="mpBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(RING.ink2, 1)} />
          <stop offset="100%" stopColor={rgba(RING.ink0, 1)} />
        </linearGradient>
        <clipPath id="mpSwept"><rect x="0" y="0" width={bx.toFixed(1)} height="470" /></clipPath>
        <clipPath id="mpVirgin"><rect x={bx.toFixed(1)} y="0" width={(1000 - bx).toFixed(1)} height="470" /></clipPath>
      </defs>

      {/* el cuerpo de arcilla: mate, sin brillo — el contraste que hace leer al esmalte como VIDRIO */}
      <rect x="0" y="300" width="1000" height="170" fill="url(#mpBody)" />

      {/* ── LA ZONA YA BARRIDA POR LA CERDA: la punta cortada, el rojo intacto abajo ── */}
      <g clipPath="url(#mpSwept)">
        <path d={glazePath(pitted, shave)} fill="url(#mpGlass)" />
        <rect x="0" y={TOP0 + shave - 3} width="1000" height="3.4" fill={rgba(RING.white, 0.85)} />
        {SPITS.map((p, i) => {
          const depth = p.d * pitted;
          if (depth < 14) return null;
          return (
            <ellipse key={i} cx={p.x} cy={TOP0 + shave + depth - 7}
              rx={p.w * 0.30} ry={5.4 + depth * 0.05}
              fill={rgba(RING.red, 0.34 + 0.56 * inside)} />
          );
        })}
      </g>

      {/* ── LA ZONA INTACTA: la mancha todavía apoyada ARRIBA ── */}
      <g clipPath="url(#mpVirgin)">
        <path d={glazePath(pitted, 0)} fill="url(#mpGlass)" />
        <rect x="0" y={TOP0 - 3} width="1000" height="3.4" fill={rgba(RING.white, 0.75 + 0.2 * gleam)} />
        {onTop > 0.01 && (
          <rect x="0" y={TOP0 - 9} width="1000" height={9 + 5 * onTop} fill={rgba(RING.red, 0.62 * onTop)} />
        )}
        {SPITS.map((p, i) => {
          const depth = p.d * pitted;
          if (depth < 14) return null;
          return (
            <ellipse key={i} cx={p.x} cy={TOP0 + depth - 7}
              rx={p.w * 0.30} ry={5.4 + depth * 0.05}
              fill={rgba(RING.red, 0.34 + 0.56 * inside)} />
          );
        })}
      </g>

      {/* el especular que PRUEBA que la capa de arriba es vidrio (viaja con el frame: hold vivo) */}
      {gleam > 0.01 && (
        <rect
          x={(((f * 1.6) % 1400) - 300).toFixed(1)} y={TOP0 - 26} width="150" height="30"
          fill={rgba(RING.white, 0.30 * gleam)} transform="skewX(-24)"
        />
      )}

      {/* LA CERDA: entra por arriba, se arquea y toca SOLO las crestas */}
      {bristleX > -120 && bristleX < 1120 && (
        <g>
          <path
            d={`M ${bristleX.toFixed(1)} 18 C ${(bristleX + 16).toFixed(1)} 90 ${(bristleX - 12).toFixed(1)} 128 ${(bristleX + 4).toFixed(1)} ${(TOP0 + 4).toFixed(1)}`}
            stroke={rgba(RING.bone, 0.94)} strokeWidth="11" strokeLinecap="round" fill="none"
          />
          <ellipse cx={bristleX + 4} cy={TOP0 + 2} rx="26" ry="7" fill={rgba(RING.white, 0.34)} />
          {Array.from({ length: 7 }, (_, i) => {
            const o = rnd(i * 4.4 + 9);
            const k = ((f / 9 + o * 4) % 1);
            return (
              <circle key={i} cx={bristleX + 18 + o * 46} cy={TOP0 - 12 - k * 58}
                r={2 + o * 3} fill={rgba(RING.bone, 0.42 * (1 - k))} />
            );
          })}
        </g>
      )}

      {/* rótulo del gráfico (es un diagrama: puede llevar su etiqueta) */}
      <text x="24" y={TOP0 - 34} fill={rgba(RING.cold, 0.72)}
        style={{ fontFamily: F_SANS, fontSize: 21, fontWeight: 800, letterSpacing: 3 }}>
        GLAZE · FIRED GLASS
      </text>
      <text x="24" y="352" fill={rgba(RING.bone, 0.42)}
        style={{ fontFamily: F_SANS, fontSize: 19, fontWeight: 700, letterSpacing: 3 }}>
        CLAY BODY
      </text>
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL CAMPO DE CRÁTERES — vista cenital de la MISMA placa (gráfico microscópico)
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const HERO = { x: 51, y: 50 };
const PITS = Array.from({ length: 58 }, (_, i) => ({
  x: 2 + rnd(i * 3.1) * 96,
  y: 30 + rnd(i * 7.7 + 2) * 40,
  r: 0.8 + rnd(i * 2.3 + 5) * 2.4,
  d: 0.3 + rnd(i * 5.9 + 1) * 0.7,
  born: Math.floor(rnd(i * 11.3 + 4) * 62),
}));

const CraterField: React.FC<{
  f: number; born0: number; rake: number; red: number; heroR: number;
}> = ({ f, born0, rake, red, heroR }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <defs>
      <radialGradient id="mpWall" cx="38%" cy="28%">
        <stop offset="0%" stopColor={rgba(RING.ink0, 0)} />
        <stop offset="56%" stopColor={rgba(RING.ink0, 0.58)} />
        <stop offset="100%" stopColor={rgba(RING.ink0, 0.95)} />
      </radialGradient>
    </defs>
    {PITS.map((p, i) => {
      const grow = clamp01((f - born0 - p.born) / 40);
      if (grow <= 0.01) return null;
      const rr = p.r * grow;
      const off = rr * 0.5 * rake;                       // la sombra se alarga con la luz rasante
      return (
        <g key={i} opacity={grow}>
          <ellipse cx={p.x + off} cy={p.y + off * 0.55} rx={rr * 1.08} ry={rr * 0.72}
            fill={rgba(RING.ink0, 0.38 * rake)} />
          <ellipse cx={p.x} cy={p.y} rx={rr} ry={rr * 0.68} fill="url(#mpWall)" />
          {red > 0.01 && (
            <ellipse cx={p.x} cy={p.y + rr * 0.14} rx={rr * 0.6 * p.d} ry={rr * 0.4 * p.d}
              fill={rgba(RING.red, 0.26 + 0.54 * red * p.d)} />
          )}
          {/* el labio iluminado: sin esto parecen manchas, no huecos */}
          <ellipse cx={p.x - off * 0.5} cy={p.y - rr * 0.33} rx={rr * 0.92} ry={rr * 0.24}
            fill="none" stroke={rgba(RING.white, 0.26 * rake)} strokeWidth={0.2} />
        </g>
      );
    })}
    {/* EL CRÁTER PROTAGONISTA: el que la cámara atraviesa en la frontera C */}
    {heroR > 0.01 && (
      <g>
        <ellipse cx={HERO.x + heroR * 0.5} cy={HERO.y + heroR * 0.3} rx={heroR * 1.14} ry={heroR * 0.78}
          fill={rgba(RING.ink0, 0.5)} />
        <ellipse cx={HERO.x} cy={HERO.y} rx={heroR} ry={heroR * 0.7} fill="url(#mpWall)" />
        <ellipse cx={HERO.x} cy={HERO.y + heroR * 0.16} rx={heroR * 0.56} ry={heroR * 0.36}
          fill={rgba(RING.red, 0.24 + 0.5 * red)} />
        <ellipse cx={HERO.x} cy={HERO.y - heroR * 0.32} rx={heroR * 0.96} ry={heroR * 0.24}
          fill="none" stroke={rgba(RING.white, 0.34)} strokeWidth={0.22} />
      </g>
    )}
  </svg>
);

/* ── partículas: el hold NUNCA está quieto ─────────────────────────────────────────────── */
const Motes: React.FC<{ f: number; n: number; seed: number; tint: string; amp?: number }> = ({
  f, n, seed, tint, amp = 1,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const o = rnd(i * 2.7 + seed);
      const o2 = rnd(i * 6.1 + seed + 3);
      const x = (o * 106 - 3 + Math.sin(f / (70 + o2 * 60)) * 3.2 * amp);
      const y = ((o2 * 118 + f * (0.035 + o * 0.05)) % 118) - 9;
      const s = 1.4 + o2 * 3.6;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: s, height: s, borderRadius: "50%",
          background: rgba(tint, 0.12 + o * 0.3),
          boxShadow: `0 0 ${(s * 3).toFixed(1)}px ${rgba(tint, 0.3)}`,
        }} />
      );
    })}
  </AbsoluteFill>
);

/* ── LA GOTA ROJA: la materia que cruza de A1 a A2 y deja la banda ─────────────────────── */
const Drop: React.FC<{ x: number; y: number; s: number; op: number }> = ({ x, y, s, op }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`,
    width: 52 * s, height: 34 * s, marginLeft: -26 * s, marginTop: -17 * s,
    borderRadius: "50%", opacity: op,
    background: `radial-gradient(62% 62% at 34% 28%, ${rgba(RING.redHot, 0.96)}, ${rgba(RING.red, 0.74)} 62%, ${rgba(RING.red, 0.28)} 100%)`,
    boxShadow: `0 ${8 * s}px ${26 * s}px ${rgba(RING.red, 0.48)}, inset 0 -2px 6px ${rgba(RING.ink0, 0.4)}`,
  }} />
);

/* ── LA BARRA ESPECULAR: la forma que persiste a través de la FRONTERA A (match-shape) ──── */
const GleamBar: React.FC<{ f: number; op: number }> = ({ f, op }) => (
  <div style={{
    position: "absolute", left: `${(30 + Math.sin(f / 58) * 1.6).toFixed(2)}%`, top: "8%",
    width: 210, height: "84%", marginLeft: -105, opacity: op,
    background: `linear-gradient(96deg, rgba(255,255,255,0) 0%, ${rgba(RING.white, 0.34)} 44%, ${rgba(RING.white, 0.5)} 52%, rgba(255,255,255,0) 100%)`,
    transform: "skewX(-19deg)", mixBlendMode: "screen", filter: "blur(2px)",
  }} />
);

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovPits: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const total = Math.max(60, Math.min(END, Math.round(durationInFrames) || END));
  const f = Math.min(frame, END);

  /* ── LA CÁMARA · una sola, función del frame GLOBAL. Ningún acto la reinicia. ───────────
     `gcam` aporta la perspectiva y la deriva viva (nunca hay un frame perfectamente quieto);
     encima va MI recorrido multi-clave, con un easing distinto por tramo.                */
  const CK = [A1, 120, A2, K.slick, A3, 470, K.moon, 560, FC, A4, 760, A5, K.scrub, END];
  const zE = keyed(f, CK, [0, 62, 118, 150, 280, 340, 380, 430, 520, 545, 690, 760, 960, 1120],
    [EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.lin, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.push, EZ.glide]);
  const rxK = keyed(f, CK, [7, 6.2, 5, 4, 3, 1.6, 0.6, -0.6, -2, -2.2, -3.6, -5, -6.2, -7],
    [EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.glide, EZ.soft]);
  const ryK = keyed(f, CK, [0, -1.2, -2.4, -3, 2, 3.4, 4.2, 3, 1, 0.4, -1.2, -2, -1.4, -0.8], EZ.soft);
  const pXK = keyed(f, CK, [0, -14, -30, -44, 20, 44, 60, 40, 12, 4, -14, -30, -34, -26], EZ.glide);
  const pYK = keyed(f, CK, [40, 30, 20, 8, -10, -16, -20, -12, 4, 10, 24, 30, 20, 10], EZ.soft);

  const zRig = -420 + zE;                         // −420 (macro) → +700 (plano general): monótona
  const inv = (1500 - zRig) / 1500;               // compensa la magnificación de la plataforma
  const fit = (v: number) => Math.round(v * inv); // tamaño APARENTE constante aunque el rig empuje
  const fx = (x: number) => 50 + (x - 50) * inv;  // idem para la posición en %
  const fy = (y: number) => 50 + (y - 50) * inv;

  const C = gcam(f, { z0: -420, z1: -420, dur: END });
  const camT =
    `${C.transform} translate3d(${(pXK * inv).toFixed(2)}px, ${(pYK * inv).toFixed(2)}px, 0) ` +
    `translateZ(${zE.toFixed(2)}px) rotateX(${rxK.toFixed(3)}deg) rotateY(${ryK.toFixed(3)}deg)`;

  /* ── LA LUZ · evoluciona, no salta ───────────────────────────────────────────────────── */
  const LK = [A1, A2, A3, K.moon, A4, A5, K.scrub, END];
  const keyPos = keyed(f, LK, [0.18, 0.21, 0.26, 0.31, 0.44, 0.42, 0.37, 0.34], EZ.soft);
  const intens = keyed(f, LK, [0.95, 1.05, 1.22, 1.30, 1.02, 0.94, 1.08, 1.0], EZ.glide);
  // el rojo de los pozos SANGRA en el aire justo cuando se ve lo que vive adentro, y cede al final
  const redAir = clamp01((f - K.inside + 30) / 110) * (1 - clamp01((f - K.white + 20) / 70));
  const tint = light(redAir * 0.44, "cold", "red");
  const wake = clamp01(f / 12);                   // rampa de entrada: 12 frames, nada de 2 s

  /* ── LA MATERIA ──────────────────────────────────────────────────────────────────────── */
  // A1/A2 · la gota: cae sobre el espejo, no encuentra dónde agarrarse y se va acelerando
  const dropIn = clamp01((f - 118) / 26);
  const dropRun = clamp01((f - 150) / 200);
  const dropX = lerp(34, 124, eio(0, 1, dropRun) * 0.42 + Math.pow(dropRun, 2.6) * 0.58);
  const dropY = lerp(46, 62, dropRun) + Math.sin(dropRun * 3.1) * 3;
  const dropOp = dropIn * clamp01((350 - f) / 26);

  // la ESTELA de la gota queda como la BANDA de la línea de agua (cruza a A3)
  const bandOn = clamp01((f - 300) / 60);

  // A3 · los cráteres nacen del haz rasante en el beat de "moon"
  const rake = keyed(f, [A3, K.moon, K.moon + 90, A5, END], [0.25, 0.95, 1, 0.86, 0.7], EZ.soft);
  const redPits = clamp01((f - K.stops) / 110);
  const heroR = keyed(f, [K.moon + 20, 560, FC], [0, 3.2, 5.4], EZ.push);

  // FRONTERA C · zoom-through: la boca del cráter se come el cuadro
  const zt = clamp01((f - 552) / (FC + 8 - 552));
  const ztScale = 1 + Math.pow(zt, 2.1) * 15;
  const ztWall = clamp01((f - 588) / 30) * (1 - clamp01((f - FC - 4) / 22));

  // A4 · el carrusel decelera hasta dejar la foto del inodoro viejo al frente
  const spin = eio(0.06, 0.78, clamp01((f - A4) / 200));

  // A5 · la mancha ARRIBA se hunde ADENTRO, y después llega la cerda
  const stainOnTop = clamp01((f - A5 - 14) / 46) * (1 - clamp01((f - K.inside) / 70));
  const stainInside = clamp01((f - K.inside + 10) / 90);
  const brushP = clamp01((f - K.scrub - 12) / 150);
  const bristleX = f > K.scrub ? lerp(-180, 1180, eio(0, 1, brushP)) : -900;

  // SALIDA · aberración cromática que prepara el corte (respeta `durationInFrames` real)
  const ab = clamp01((frame - (total - 30)) / 30);

  /* ── texto: ventanas cortas, una idea por acto ───────────────────────────────────────── */
  const tw = (a: number, b: number) => clamp01((f - a) / 20) * clamp01((b - f) / 18);

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* ⭐ UNA sola atmósfera para los cinco actos. No se remonta jamás. */}
      <RingAtmos tint={tint} keyFrom={keyPos} intensity={intens * (0.86 + 0.14 * wake)} />

      <Layers cam={camT}>
        {/* ══════════════ ACTO 1 · f0–186 · "THAT LAYER IS GLASS" ══════════════ */}
        {f < FA && (
          <>
            {/* P1 · el fondo: la góndola de inodoros nuevos, ya desenfocada en disco */}
            <Plane z={-240}><PhotoPlane src={BG.store} z={0} scale={1.85} dim={0.6} /></Plane>
            {/* P2 · polvo frío en el haz */}
            <Plane z={-150}><Motes f={f} n={26} seed={1} tint={RING.cold} /></Plane>
            {/* P3 · EL OBJETO: la placa de esmalte en sección, espejo perfecto */}
            <Plane z={-40}>
              <div style={{
                position: "absolute", left: `${fx(46)}%`, top: `${fy(52)}%`,
                width: fit(1180), height: fit(556), marginLeft: -fit(590), marginTop: -fit(278),
                filter: `drop-shadow(0 ${fit(26)}px ${fit(44)}px ${rgba(RING.ink0, 0.8)})`,
              }}>
                <Section f={f} pitted={0} onTop={0} inside={0} bristleX={-900} tint={tint} gleam={1} />
              </div>
            </Plane>
            {/* P4 · MATERIAL REAL: el inodoro nuevo de exhibición = el vidrio recién horneado */}
            <Shot from={8} dur={MAXCLIP}>
              <Plane z={70}>
                <MediaCard src={CLIP.store} kind="video" w={fit(720)} h={fit(412)}
                  x={fx(70)} y={fy(38)} z={0} ry={-12} rx={2} radius={fit(16)}
                  lit={0.95} label="FIRED GLASS" sheenAt={34} />
              </Plane>
            </Shot>
            {f >= 8 + MAXCLIP && (
              <Plane z={70}>
                <MediaCard src={PIC.store} kind="photo" w={fit(720)} h={fit(412)}
                  x={fx(70)} y={fy(38)} z={0} ry={-12} rx={2} radius={fit(16)}
                  lit={0.95} label="FIRED GLASS" />
              </Plane>
            )}
            {/* P5 · MATERIAL REAL: el inodoro de 11 días, chiquito, esperando su turno */}
            {f > 46 && (
              <Plane z={180}>
                <MediaCard src={PIC.old} kind="photo" w={fit(318)} h={fit(206)}
                  x={fx(19)} y={fy(76)} z={0} rot={-4} ry={9} radius={fit(12)}
                  lit={0.5} label="11 DAYS" opacity={clamp01((f - 46) / 26)} />
              </Plane>
            )}
            {/* P6 · la gota roja que aterriza sobre el espejo (materia que cruza a A2) */}
            <Plane z={250}>
              {dropOp > 0.01 && <Drop x={fx(dropX)} y={fy(dropY)} s={inv} op={dropOp} />}
            </Plane>
          </>
        )}

        {/* ══════════════ ACTO 2 · f186–364 · "NOTHING CAN GET A GRIP" ══════════════ */}
        {f >= FA && f < A3 && (
          <>
            <Plane z={-240}><PhotoPlane src={BG.finger} z={0} scale={1.85} dim={0.58} /></Plane>
            <Plane z={-140}><Motes f={f} n={30} seed={7} tint={RING.cold} /></Plane>
            {/* haz rasante: la luz que hace resbalar todo (gráfico de luz, no objeto) */}
            <Plane z={-20}>
              <AbsoluteFill style={{
                background: `linear-gradient(102deg, rgba(0,0,0,0) 26%, ${rgba(RING.cold, 0.13)} 46%, rgba(0,0,0,0) 68%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>
            {/* ⭐ MATERIAL REAL: el dedo sobre la superficie — no agarra */}
            <Shot from={FA + 4} dur={MAXCLIP}>
              <Plane z={40}>
                <MediaCard src={CLIP.finger} kind="video" w={fit(880)} h={fit(500)}
                  x={fx(43)} y={fy(45)} z={0} ry={9} rx={-2} radius={fit(16)}
                  lit={1} label="IT'S SLICK" sheenAt={26} />
              </Plane>
            </Shot>
            {f >= FA + 4 + MAXCLIP && (
              <Plane z={40}>
                <MediaCard src={PIC.finger} kind="photo" w={fit(880)} h={fit(500)}
                  x={fx(43)} y={fy(45)} z={0} ry={9} rx={-2} radius={fit(16)}
                  lit={1} label="IT'S SLICK" />
              </Plane>
            )}
            {/* MATERIAL REAL de apoyo: el papel que pasa y no se lleva nada */}
            <Plane z={190}>
              <MediaCard src={PIC.towel} kind="photo" w={fit(352)} h={fit(228)}
                x={fx(81)} y={fy(72)} z={0} rot={5} ry={-11} radius={fit(12)}
                lit={0.62} label="NOTHING STICKS" opacity={clamp01((f - FA - 30) / 26)} />
            </Plane>
            {/* la gota sigue viva: acelera y se va — y su estela QUEDA como la banda */}
            <Plane z={260}>
              {dropOp > 0.01 && <Drop x={fx(dropX)} y={fy(dropY)} s={inv} op={dropOp} />}
              {bandOn > 0.01 && (
                <div style={{
                  position: "absolute", left: 0, right: 0, top: `${fy(63)}%`,
                  height: fit(46), marginTop: -fit(23), opacity: bandOn,
                  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(RING.red, 0.34)} 40%, ${rgba(RING.red, 0.2)} 70%, rgba(0,0,0,0) 100%)`,
                  mixBlendMode: "screen",
                }} />
              )}
            </Plane>
          </>
        )}

        {/* ══════════════ ACTO 3 · f366–615 · ⭐ "LITTLE CRATERS" ══════════════ */}
        {f >= A3 && f < A4 && (
          <>
            {/* ⭐⭐ EL PLANO ESTRELLA a sangre: Mike con la cabeza adentro de la taza, con linterna */}
            <Shot from={A3} dur={MAXCLIP}>
              <Plane z={-240}>
                <PhotoPlane src={CLIP.head} kind="video" z={0} scale={1.55} dim={0.26} />
              </Plane>
            </Shot>
            {f >= A3 + MAXCLIP && (
              <Plane z={-240}>
                <PhotoPlane src={PIC.head} z={0} scale={1.55}
                  dim={interpolate(f, [A3 + MAXCLIP, K.moon + 40], [0.3, 0.58], { extrapolateRight: "clamp" })} />
              </Plane>
            )}
            {/* el haz de la linterna barre y motiva el nacimiento de los cráteres */}
            <Plane z={-120}>
              <AbsoluteFill style={{
                background: `radial-gradient(46% 34% at ${(30 + Math.sin(f / 52) * 12 + clamp01((f - 470) / 120) * 24).toFixed(1)}% ${(56 + Math.cos(f / 71) * 5).toFixed(1)}%, ${rgba(RING.cold, 0.3 * rake)} 0%, rgba(0,0,0,0) 72%)`,
                mixBlendMode: "screen",
              }} />
            </Plane>
            {/* EL GRÁFICO: la banda de la línea de agua, comida de cráteres · zoom-through al final */}
            <Plane z={0}>
              <div style={{
                position: "absolute", left: "50%", top: `${fy(54)}%`,
                width: fit(1560), height: fit(430), marginLeft: -fit(780), marginTop: -fit(215),
                transform: `scale(${ztScale.toFixed(3)})`,
                transformOrigin: `${HERO.x}% ${HERO.y}%`,
                opacity: clamp01((f - K.moon + 40) / 34),
              }}>
                {/* la banda: la estela de la gota del acto 2, ahora es la línea de agua */}
                <AbsoluteFill style={{
                  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(RING.porcelain, 0.1)} 22%, ${rgba(RING.porcelain, 0.16)} 50%, ${rgba(RING.porcelain, 0.08)} 74%, rgba(0,0,0,0) 100%)`,
                }} />
                <CraterField f={f} born0={K.moon} rake={rake} red={redPits} heroR={heroR} />
              </div>
            </Plane>
            {/* la pared del pozo cerrando el cuadro: estamos ENTRANDO por la boca del cráter.
                Va FUERA del grupo escalado — si viviera adentro, el escalado ×16 la sacaría de cuadro. */}
            {ztWall > 0.01 && (
              <Plane z={60}>
                <AbsoluteFill style={{
                  background: `radial-gradient(42% 42% at 50% 50%, rgba(0,0,0,0) 8%, ${rgba(RING.ink0, 0.97 * ztWall)} 62%)`,
                }} />
              </Plane>
            )}
            {/* MATERIAL REAL: la lupa sobre la línea de agua */}
            <Shot from={430} dur={MAXCLIP}>
              <Plane z={120}>
                <MediaCard src={CLIP.mag} kind="video" w={fit(556)} h={fit(340)}
                  x={fx(26)} y={fy(70)} z={0} ry={13} rx={-3} radius={fit(14)}
                  lit={0.9} label="AT THE WATER LINE" sheenAt={30}
                  opacity={clamp01((f - 430) / 22) * clamp01((572 - f) / 26)} />
              </Plane>
            </Shot>
            {/* MATERIAL REAL: la página de la guía (lámina), dentro de una tarjeta */}
            {f > 545 && (
              <Plane z={210}>
                <MediaCard src={PIC.lam} kind="photo" w={fit(316)} h={fit(424)}
                  x={fx(79)} y={fy(44)} z={0} rot={3} ry={-14} radius={fit(10)}
                  lit={0.78} label="FROM THE GUIDE"
                  opacity={clamp01((f - 545) / 22) * clamp01((FC - f) / 20)} />
              </Plane>
            )}
            <Plane z={300}><Motes f={f} n={22} seed={13} tint={RING.cold} amp={1.6} /></Plane>
          </>
        )}

        {/* ══════════════ ACTO 4 · f625–866 · "ONLY IN THAT ONE BAND" ══════════════ */}
        {f >= A4 && f < FD && (
          <>
            <Plane z={-240}><PhotoPlane src={BG.old} z={0} scale={1.85} dim={0.66} /></Plane>
            {/* ⭐ CARRUSEL 3D REAL: cinco fotos reales orbitando a la ALTURA DE LA BANDA.
                No es un abanico: las tarjetas viajan en un cilindro de verdad. */}
            <Plane z={-60}>
              <Carousel3D
                items={[
                  { src: PIC.old, kind: "photo", label: "11 DAYS" },
                  { src: PIC.head, kind: "photo", label: "UNDER THE RIM" },
                  { src: PIC.mag, kind: "photo", label: "MAGNIFIED" },
                  { src: PIC.store, kind: "photo", label: "BRAND NEW" },
                  { src: PIC.towel, kind: "photo", label: "WIPED CLEAN" },
                ]}
                spin={spin}
                radius={fit(470)}
                cardW={fit(330)} cardH={fit(200)}
                y={50} focus={0}
              />
            </Plane>
            {/* EL GRÁFICO: el anillo de la banda, a la altura de los ojos, atravesando el carrusel */}
            <Plane z={10}>
              <div style={{
                position: "absolute", left: "50%", top: `${fy(50)}%`,
                width: fit(1720), height: fit(300), marginLeft: -fit(860), marginTop: -fit(150),
                borderRadius: "50%",
                border: `${Math.max(2, fit(4))}px solid ${rgba(RING.red, 0.5 + 0.2 * Math.sin(f / 26))}`,
                boxShadow: `0 0 ${fit(70)}px ${rgba(RING.red, 0.26)}, inset 0 0 ${fit(60)}px ${rgba(RING.red, 0.14)}`,
                opacity: clamp01((f - A4 - 20) / 34),
              }} />
              <div style={{
                position: "absolute", left: 0, right: 0, top: `${fy(50)}%`,
                height: fit(3), background: rgba(RING.red, 0.34 * clamp01((f - A4 - 30) / 30)),
              }} />
            </Plane>
            {/* MATERIAL REAL en vivo: el inodoro de 11 días, la banda marcada sobre él */}
            <Shot from={A4 + 30} dur={MAXCLIP}>
              <Plane z={150}>
                <MediaCard src={CLIP.old} kind="video" w={fit(400)} h={fit(244)}
                  x={fx(76)} y={fy(76)} z={0} ry={-15} rx={4} rot={2} radius={fit(12)}
                  lit={0.88} label="ONE BAND ONLY" sheenAt={28} />
              </Plane>
            </Shot>
            {f >= A4 + 30 + MAXCLIP && (
              <Plane z={150}>
                <MediaCard src={PIC.old} kind="photo" w={fit(400)} h={fit(244)}
                  x={fx(76)} y={fy(76)} z={0} ry={-15} rx={4} rot={2} radius={fit(12)}
                  lit={0.88} label="ONE BAND ONLY" />
              </Plane>
            )}
            {/* la cota del gráfico: dónde empieza y dónde termina la banda */}
            <Plane z={120}>
              <div style={{
                position: "absolute", left: `${fx(16)}%`, top: `${fy(50)}%`,
                marginTop: -fit(64), opacity: clamp01((f - A4 - 60) / 30),
                fontFamily: F_SANS, fontWeight: 800, fontSize: Math.max(15, fit(21)),
                letterSpacing: 3, color: rgba(RING.cold, 0.86), textShadow: "0 3px 14px rgba(0,0,0,.9)",
              }}>
                WATER LINE
              </div>
            </Plane>
            <Plane z={300}><Motes f={f} n={20} seed={21} tint={RING.cold} amp={1.3} /></Plane>
          </>
        )}

        {/* ══════════════ ACTO 5 · f866–1200 · "YOU ONLY CUT THE TOPS" ══════════════ */}
        {f >= FD && (
          <>
            {/* el fondo: la taza real. La luz del baño SUBE (dim que cede), no es un fundido. */}
            <Plane z={-240}>
              <PhotoPlane src={PIC.old} z={0} scale={1.85}
                dim={interpolate(f, [FD, K.scrub, K.white], [0.88, 0.7, 0.44], { extrapolateRight: "clamp" })} />
            </Plane>
            <Plane z={-120}><Motes f={f} n={24} seed={31} tint={redAir > 0.2 ? RING.redHot : RING.cold} /></Plane>
            {/* ⭐ EL MISMO OBJETO DEL ACTO 1: la placa de esmalte, ahora en sección y comida */}
            <Plane z={-20}>
              <div style={{
                position: "absolute", left: "50%", top: `${fy(50)}%`,
                width: fit(1300), height: fit(600), marginLeft: -fit(650), marginTop: -fit(300),
                filter: `drop-shadow(0 ${fit(30)}px ${fit(52)}px ${rgba(RING.ink0, 0.85)})`,
              }}>
                <Section
                  f={f} pitted={clamp01((f - FD) / 26)}
                  onTop={stainOnTop} inside={stainInside}
                  bristleX={bristleX} tint={tint} gleam={0.45}
                />
              </div>
            </Plane>
            {/* MATERIAL REAL: el papel que se lleva LA PUNTA y sale limpio */}
            <Shot from={K.scrub - 40} dur={MAXCLIP}>
              <Plane z={100}>
                <MediaCard src={CLIP.towel} kind="video" w={fit(392)} h={fit(240)}
                  x={fx(80)} y={fy(24)} z={0} ry={-14} rx={4} radius={fit(12)}
                  lit={0.86} label="THE TOP COMES OFF" sheenAt={24}
                  opacity={clamp01((f - K.scrub + 34) / 24)} />
              </Plane>
            </Shot>
            {f >= K.scrub - 40 + MAXCLIP && (
              <Plane z={100}>
                <MediaCard src={PIC.towel} kind="photo" w={fit(392)} h={fit(240)}
                  x={fx(80)} y={fy(24)} z={0} ry={-14} rx={4} radius={fit(12)}
                  lit={0.86} label="THE TOP COMES OFF" />
              </Plane>
            )}
            {/* MATERIAL REAL: la lupa, chica, como testigo de la profundidad */}
            {f > A5 + 30 && (
              <Plane z={60}>
                <MediaCard src={PIC.mag} kind="photo" w={fit(300)} h={fit(190)}
                  x={fx(24)} y={fy(25)} z={0} ry={13} rot={-3} radius={fit(10)}
                  lit={0.56} label="DEPTH, NOT SURFACE"
                  opacity={clamp01((f - A5 - 30) / 26) * clamp01((END - 30 - f) / 40)} />
              </Plane>
            )}
            {/* ⭐ EL HANDOFF: el cráter que se le entrega al movimiento siguiente, con ROJO adentro */}
            {f > K.white - 60 && (
              <Plane z={240}>
                <div style={{
                  position: "absolute", left: `${fx(50)}%`, top: `${fy(58)}%`,
                  width: fit(150), height: fit(150), marginLeft: -fit(75), marginTop: -fit(75),
                  borderRadius: "50%",
                  border: `${Math.max(2, fit(3))}px solid ${rgba(RING.redHot, 0.6 + 0.24 * Math.sin(f / 17))}`,
                  boxShadow: `0 0 ${fit(60)}px ${rgba(RING.red, 0.42)}`,
                  opacity: clamp01((f - K.white + 60) / 34),
                }} />
              </Plane>
            )}
          </>
        )}
      </Layers>

      {/* ══════════════════════════ LAS COSTURAS ══════════════════════════
          FRONTERA A @186 · MATCH-SHAPE  → la barra especular persiste f150–232 (abajo)
          FRONTERA B @364 · CORTE EN EL BEAT (SeamFlash frío, 6 frames)
          FRONTERA C @615 · ZOOM-THROUGH (la boca del cráter, arriba en el acto 3)
          FRONTERA D @866 · OCLUSIÓN (SeamOcclude hueso = la cabeza del cepillo)
          ⛔ ningún fade, y dos fronteras seguidas nunca comparten costura. */}

      {/* la MISMA forma a los dos lados de la frontera A: no hay corte, hay una forma que sigue */}
      {f > 150 && f < 232 && (
        <GleamBar f={f} op={clamp01((f - 150) / 18) * clamp01((232 - f) / 22)} />
      )}
      <SeamFlash at={FB} dur={6} color={RING.cold} />
      <SeamOcclude at={FD - 8} dur={16} color={RING.bone} angle={-6} />
      {/* ENTRADA del movimiento: el vapor frío del baño cruza en 16 frames. Nada de subir de negro. */}
      <SeamWipeMatter at={0} dur={16} tint={RING.cold} />

      {/* ══════════════════════════ EL TEXTO · una idea por acto ══════════════════════════ */}
      <AbsoluteFill style={{
        padding: 76, display: "flex", flexDirection: "column", justifyContent: "flex-end",
        pointerEvents: "none",
      }}>
        {tw(28, FA) > 0.01 && (
          <div style={{ opacity: tw(28, FA), maxWidth: 1180 }}>
            <Bed>
              <Kick>The clay is not the point</Kick>
              <Head size={76}>That layer is <Em>glass</Em>.</Head>
            </Bed>
          </div>
        )}
        {tw(FA + 26, FB) > 0.01 && (
          <div style={{ opacity: tw(FA + 26, FB), maxWidth: 1220 }}>
            <Bed>
              <Kick>And that is the entire point</Kick>
              <Head size={74}>Nothing can get a <Em>grip</Em>.</Head>
            </Bed>
          </div>
        )}
        {tw(A3 + 26, 500) > 0.01 && (
          <div style={{ opacity: tw(A3 + 26, 500), maxWidth: 1060 }}>
            <Bed>
              <Kick>Eleven days · under that light · at the water line</Kick>
            </Bed>
          </div>
        )}
        {tw(K.moon + 14, FC) > 0.01 && (
          <div style={{ opacity: tw(K.moon + 14, FC), maxWidth: 1180 }}>
            <Bed>
              <Kick>Like the surface of the moon</Kick>
              <Head size={78}>Little <Em>craters</Em>.</Head>
            </Bed>
          </div>
        )}
        {tw(A4 + 30, FD) > 0.01 && (
          <div style={{ opacity: tw(A4 + 30, FD), maxWidth: 1200 }}>
            <Bed>
              <Kick>You would never see it standing up</Kick>
              <Head size={74}>Only in that one <Em>band</Em>.</Head>
            </Bed>
          </div>
        )}
        {tw(A5 + 24, K.scrub - 12) > 0.01 && (
          <div style={{ opacity: tw(A5 + 24, K.scrub - 12), maxWidth: 1200 }}>
            <Bed>
              <Kick>A stain sits on top of something</Kick>
              <Head size={76}>This lives <Em>down inside</Em>.</Head>
            </Bed>
          </div>
        )}
        {tw(K.scrub + 22, END + 40) > 0.01 && (
          <div style={{ opacity: tw(K.scrub + 22, END + 40), maxWidth: 1240 }}>
            <Bed>
              <Kick>So you scrub, and the bowl looks clean</Kick>
              <Head size={76}>You only cut the <Em>tops</Em>.</Head>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* SALIDA: la aberración empieza ANTES del corte (⛔ nada de backdrop-filter) */}
      {ab > 0.01 && (
        <>
          <AbsoluteFill style={{ background: rgba(RING.cold, 0.1 * ab), mixBlendMode: "screen" }} />
          <AbsoluteFill style={{
            background: `radial-gradient(78% 62% at 50% 52%, rgba(0,0,0,0) 40%, ${rgba(RING.ink0, 0.5 * ab)} 100%)`,
          }} />
        </>
      )}

      {/* grano constante: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill style={{
        opacity: 0.055,
        backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
        backgroundSize: "3px 3px", mixBlendMode: "overlay", pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MOVPITS_FRAMES = END;
