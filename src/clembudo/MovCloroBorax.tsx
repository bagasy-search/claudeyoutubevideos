// MovCloroBorax.tsx — MOVIMIENTO de `clembudo` (El Constructor Libre)
// 1767 frames @30fps · desde_s 305.5 · luz 0.30 → 0.45
//
// TEMA: el mito más caro del oficio. El cloro no mata el moho de una pared: el hipoclorito se queda
// en la superficie y decolora, pero el AGUA —que es casi todo lo que estás echando— se mete en el
// poro, que es justo donde está la raíz. Le sacaste el color y le diste de beber. El bórax sí
// funciona porque penetra CON el agua y al evaporarse queda cristalizado adentro, de guardia.
//
// ⭐ LA ESTRELLA ES EL CORTE DEL PORO. No hay split A/B mito-vs-verdad: hay UN SOLO PORO que cambia
// de estado. El rig `P` es una pila de 8 planos con profundidad real (proyección s = K/(depth-camZ));
// la cámara ENTRA por la boca en el acto 2, sigue adentro durante la receta (aunque no se vea),
// llega más al fondo en el acto 5 y sale retrocediendo en el 6. `camZ(f)` es UNA sola curva sobre el
// frame GLOBAL del movimiento: ningún acto la reinicia.
//
// ══════════════════ TABLA DE HANDOFF ══════════════════════════════════════════════════════════
// acto 1  MITO — "parece que funcionó"                                   f 0 → 286   (287 f)
//   enterFrom {cam:{camZ:-0.90, z:1.000, ry:+2.6}, luz:0.300, materia:"— (abre el movimiento)"}
//   exitTo    {cam:{camZ: 0.00, z:1.014, ry:+1.8}, luz:0.314, materia:"la pared s303 con la mancha"}
// ── F1 ZOOM-THROUGH ── f 262-290: el plate s303 y la capa `pared` del rig SON LA MISMA FOTO a la
//    misma escala; la cámara, ya entrando, la atraviesa. Nada aparece: la pared se abre.
//
// acto 2  DENTRO DEL PORO — la raíz viva y el agua                       f 287 → 636  (350 f)
//   enterFrom {cam:{camZ: 0.00, z:1.014, ry:+1.8}, luz:0.314, materia:"la pared s303 → plano L1"}
//   exitTo    {cam:{camZ: 4.60, z:1.031, ry:+0.3}, luz:0.349, materia:"la BOCA del poro (óvalo oscuro)"}
// ── F2 MATCH-SHAPE ── f 631-659: el óvalo oscuro de la boca del poro se retira y encaja con el
//    círculo de moho de s322 en la pared del taller. Misma forma, otra escala. (No repite F1.)
//
// acto 3  POR ESO TE LLAMAN — el cliente ya lo intentó   [AVATAR VISIBLE]  f 637 → 836  (200 f)
//   enterFrom {cam:{camZ: 4.60, z:1.031, ry:+0.3}, luz:0.349, materia:"el círculo de moho s322"}
//   exitTo    {cam:{camZ: 4.85, z:1.037, ry:-0.4}, luz:0.361, materia:"el balde blanco del piso"}
// ── F3 OCLUSIÓN ── f 836: el CUERO DEL DELANTAL de Claudio cruza el cuadro (banda de 300% de ancho,
//    color C.gold = la materia real, ⛔ nunca el color del fondo). MEDIDO: 4 frames de cobertura
//    100% del ancho, centrados en el swap (el `Occluder` de Stage, a 150% de ancho, da 0 — por eso
//    va sólo de canto). El balde blanco entra tapado y sale recibiendo el polvo.
//
// acto 4  EL BÓRAX — la receta, el precio, el rinde                      f 837 → 1276 (440 f)
//         (su material sobrevive hasta f 1302, comido por el wipe columna a columna)
//   enterFrom {cam:{camZ: 4.85, z:1.037, ry:-0.4}, luz:0.361, materia:"el balde blanco"}
//   exitTo    {cam:{camZ: 5.10, z:1.049, ry:-1.6}, luz:0.397, materia:"el VAPOR del agua caliente"}
// ── F4 WIPE POR MATERIA ── f 1250-1316: el vapor del agua caliente barre de derecha a izquierda y
//    el acto 4 se retira con un mask que usa EL MISMO `wipeF` que el vapor: el swap ocurre columna
//    por columna detrás de la materia. Detrás ya está el poro, montado desde f 1250, mojado y
//    espumando. El vapor es lo único que existe a los dos lados. (No repite F3.)
//
// acto 5  PENETRA Y CRISTALIZA — el mismo poro, otro estado              f 1277 → 1613 (337 f)
//   enterFrom {cam:{camZ: 5.10, z:1.049, ry:-1.6}, luz:0.397, materia:"el vapor → la espuma del poro"}
//   exitTo    {cam:{camZ: 5.62, z:1.057, ry:-2.4}, luz:0.427, materia:"el CRISTAL de bórax (plano L8)"}
// ── F5 MATCH-MOVE ── f 1606-1676: la cámara ya viene retrocediendo desde el cristal; sigue su
//    vector (camZ 5.62 → 3.30) y el contenido cambia detrás del movimiento. (No repite F4.)
//
// acto 6  DE GUARDIA — y la regla más rara del oficio                    f 1614 → 1766 (153 f)
//   enterFrom {cam:{camZ: 5.62, z:1.057, ry:-2.4}, luz:0.427, materia:"el cristal, alejándose"}
//   exitTo    {cam:{camZ: 3.30, z:1.066, ry:-3.2}, luz:0.450, materia:"la pared seca → al mov. siguiente"}
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// COMPUERTAS CORRIDAS: tsc 0 errores propios · 13 rutas verificadas en disco · barrido de los 1767
// frames (no una muestra): 0 frames con el cuadro descubierto, cobertura mínima 0,941 · ninguna
// Sequence pide más de los 151 frames reales que tiene cada mp4.
//
// CONTRATO: cero Math.random/Date · cero backdrop-filter · cero blur full-screen · Easing.poly(n)
// en vez del inexistente Easing.quint · safe area 60px anclada por bottom/right · rampa ≤15 f ·
// OffthreadVideo SIEMPRE (nunca <Video>) y nunca loopeado: cada clip dura 151 f a rate 1.
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from "remotion";
import { C, FONT, SAFE, W, H, cam, camStyle, luz, rng, Atmos, Glass, Head, Kick, Occluder, rampIn } from "./Stage";

const DUR = 1767;

// ── fronteras de acto (frame exacto) ───────────────────────────────────────────────────────────
const A2 = 287, A3 = 637, A4 = 837, A5 = 1277, A6 = 1614;

const img = (n: string) => staticFile(`img/clembudo/${n}.png`);
const vid = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);

// ── CLIP — OffthreadVideo con su propio reloj. La Sequence es SÓLO para resetear el tiempo del
// video; nada de adentro lee useCurrentFrame, así que la cámara global no se entera.
// ⛔ `loop` no es prop de OffthreadVideo: cada aparición dura como mucho 151/rate frames.
const Clip: React.FC<{ src: string; from: number; dur: number; rate?: number; pos?: string }> =
  ({ src, from, dur, rate = 1, pos = "center" }) => (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <OffthreadVideo
        src={vid(src)}
        muted
        playbackRate={rate}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }}
      />
    </Sequence>
  );

// ══════════════════════════════════════════════════════════════════════════════════════════════
// EL RIG DEL PORO — 8 planos con profundidad REAL. Proyección de cámara: cuanto más chico es
// (depth - camZ), más grande y más cerca está el plano; cuando se vuelve negativo el plano quedó
// DETRÁS de la cámara y se apaga. Eso es lo que hace que el zoom-through se sienta como entrar en
// la pared, y no como un scale sobre una foto.
// ══════════════════════════════════════════════════════════════════════════════════════════════
const K = 2.2;

const camZ = (f: number) =>
  interpolate(
    f,
    [0, A2, A3 - 1, A4 - 1, 1276, 1420, 1613, DUR],
    [-0.9, 0.0, 4.6, 4.85, 5.1, 5.45, 5.62, 3.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0.02, 0.22, 1) },
  );

type Plano = { depth: number; base: number; seed: number };

const P: Record<string, Plano> = {
  pared:   { depth: 0.8,  base: 0.42, seed: 3 },
  halo:    { depth: 1.45, base: 0.62, seed: 11 },
  labio:   { depth: 2.2,  base: 0.8,  seed: 19 },
  boca:    { depth: 3.05, base: 0.86, seed: 27 },
  gargant: { depth: 3.95, base: 0.86, seed: 35 },
  hilos:   { depth: 4.85, base: 0.88, seed: 43 },
  raiz:    { depth: 6.6,  base: 0.79, seed: 51 },
  cristal: { depth: 7.2,  base: 0.72, seed: 59 },
};

const depthClamp = (d: number) => (d < 0.1 ? 0.1 : d);

// proyección + parallax propio por plano (cada capa deriva distinto: eso es el parallax)
const proj = (p: Plano, cz: number, f: number) => {
  const d = depthClamp(p.depth - cz);
  const s = (K / d) * p.base;
  const o =
    interpolate(d, [0.1, 0.34, 0.8], [0, 0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(d, [3.4, 8.2], [1, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const amp = 26 / d;
  const dx = Math.sin((f + p.seed * 37) / (88 + p.seed)) * amp;
  const dy = Math.cos((f + p.seed * 23) / (111 + p.seed)) * amp * 0.62;
  return { s, o, dx, dy, d };
};

const Plate3D: React.FC<{
  p: Plano; cz: number; f: number; on: number; mask?: string;
  blend?: React.CSSProperties["mixBlendMode"]; children: React.ReactNode;
}> = ({ p, cz, f, on, mask, blend, children }) => {
  const { s, o, dx, dy } = proj(p, cz, f);
  if (o * on <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%",
        width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2,
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${s})`,
        transformOrigin: "50% 50%",
        opacity: o * on,
        mixBlendMode: blend,
        ...(mask ? { WebkitMaskImage: mask, maskImage: mask } : {}),
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};

// el labio y la boca del poro son ANILLOS, no discos: así se ve el HUECO, no una foto pegada
const ANILLO_LABIO = "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 21%, rgba(0,0,0,1) 32%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 96%)";
const ANILLO_BOCA = "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 15%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 84%)";
const DISCO_FONDO = "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0) 90%)";

// ── HILOS de agua / espuma bajando por la garganta (el agua que le da de beber a la raíz) ───────
const Hilos: React.FC<{ f: number; n: number; tono: string; vel: number }> = ({ f, n, tono, vel }) => (
  <>
    {new Array(n).fill(0).map((_, i) => {
      const x = 8 + rng(71, i) * 84;
      const len = 90 + rng(83, i) * 260;
      const y = ((rng(97, i) * 1400 + f * vel * (0.6 + rng(101, i))) % 1500) - 200;
      const w = 2 + rng(107, i) * 5;
      const o = 0.16 + rng(113, i) * 0.4;
      return (
        <div
          key={i}
          style={{
            position: "absolute", left: `${x}%`, top: y, width: w, height: len,
            borderRadius: w, opacity: o,
            background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${tono} 34%, ${tono} 72%, rgba(255,255,255,0) 100%)`,
          }}
        />
      );
    })}
  </>
);

// ── CRISTALES de bórax: no se dibujan de la nada, CRECEN cuando el agua se evapora ──────────────
const Cristales: React.FC<{ f: number; k: number }> = ({ f, k }) => (
  <>
    {new Array(34).fill(0).map((_, i) => {
      const t0 = rng(131, i) * 0.55;
      const t = interpolate(k, [t0, t0 + 0.38], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(3)),
      });
      if (t <= 0.002) return null;
      const a = rng(137, i) * Math.PI * 2;
      const r = 14 + rng(139, i) * 30;
      const sz = (16 + rng(149, i) * 46) * t;
      const rot = rng(151, i) * 360 + Math.sin((f + i * 17) / 140) * 4;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r * 0.82}%`,
            width: sz, height: sz * (0.7 + rng(157, i) * 0.6),
            marginLeft: -sz / 2, marginTop: -sz / 2,
            transform: `rotate(${rot}deg)`,
            borderRadius: "38% 62% 55% 45% / 48% 42% 58% 52%",
            background: "linear-gradient(142deg, rgba(255,253,246,0.96) 0%, rgba(232,226,208,0.78) 44%, rgba(255,255,255,0.92) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -2px 4px rgba(42,38,32,0.22), 0 2px 8px rgba(42,38,32,0.3)",
            opacity: 0.5 + t * 0.5,
          }}
        />
      );
    })}
  </>
);

// ── F3 · EL CUERO DEL DELANTAL — la materia que ocluye ──────────────────────────────────────────
// ⛔⛔ El color NO es el del fondo (eso no ocluye: hace un fundido a negro y se ve un flash). Es
// C.gold, el cuero del delantal de Claudio. Ancho 300% para que la cobertura 100% dure ~7 frames
// centrada en el swap; el `Occluder` de Stage, a 150%, cubre el cuadro entero menos de 1 frame, así
// que va DETRÁS como el canto brillante que entra primero, no como el cuerpo de la banda.
const Cuero: React.FC<{ at: number; len?: number }> = ({ at, len = 15 }) => {
  const f = useCurrentFrame();
  if (f < at - len || f > at + len) return null;
  const L = interpolate(f, [at - len, at + len], [-330, 170], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute", left: `${L}%`, top: "-24%", width: "300%", height: "148%",
        transform: "rotate(-7deg)",
        background: `linear-gradient(96deg, rgba(0,0,0,0) 0%, #6E4B2C 5%, ${C.gold} 16%, #B98A58 38%, ${C.gold} 62%, #7A5432 92%, rgba(0,0,0,0) 100%)`,
        boxShadow: "inset 0 22px 46px rgba(42,26,12,0.45), inset 0 -26px 50px rgba(42,26,12,0.5)",
      }}
    >
      {/* costura del delantal: la banda es un objeto de la escena, no una cortina */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "27%", height: 3, background: "repeating-linear-gradient(90deg, rgba(58,38,20,0.75) 0 16px, rgba(0,0,0,0) 16px 30px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "24%", height: 3, background: "repeating-linear-gradient(90deg, rgba(58,38,20,0.7) 0 16px, rgba(0,0,0,0) 16px 30px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(72deg, rgba(255,228,190,0.05) 0 3px, rgba(60,38,18,0.06) 3px 7px)" }} />
    </div>
  );
};

// ── TIPOGRAFÍA del movimiento: UN solo bloque por acto, anclado por bottom, con cama oscura ──────
const Bloque: React.FC<{ f: number; at: number; kick: string; head: string; side?: "left" | "right"; w?: number }> =
  ({ f, at, kick, head, side = "left", w = 760 }) => {
    const k = rampIn(f - at, 13);
    if (k <= 0.004) return null;
    return (
      <div
        style={{
          position: "absolute", bottom: SAFE + 34,
          ...(side === "left" ? { left: SAFE + 18 } : { right: SAFE + 18 }),
          width: w, opacity: k, transform: `translateY(${(1 - k) * 34}px)`,
          textAlign: side === "left" ? "left" : "right",
        }}
      >
        <div
          style={{
            display: "inline-block", padding: "22px 30px 26px", textAlign: "left",
            background: "linear-gradient(180deg, rgba(24,20,15,0.06) 0%, rgba(24,20,15,0.62) 42%, rgba(24,20,15,0.74) 100%)",
            borderLeft: side === "left" ? `4px solid ${C.gold}` : undefined,
            borderRight: side === "right" ? `4px solid ${C.gold}` : undefined,
            borderRadius: 4,
          }}
        >
          <Kick size={30}>{kick}</Kick>
          <div style={{ height: 12 }} />
          <div style={{ whiteSpace: "pre-line" }}>
            <Head size={62}>{head}</Head>
          </div>
        </div>
      </div>
    );
  };

// ── FICHA DE CIFRA del acto 4: UNA sola tarjeta que cambia de valor (no cuatro tarjetas) ────────
const CIFRAS: { at: number; big: string; small: string }[] = [
  { at: 916, big: "250 g", small: "una taza bien llena" },
  { at: 1030, big: "4 litros", small: "de agua lo más caliente que puedas" },
  { at: 1115, big: "US$ 2 a 5", small: "el kilo" },
  { at: 1208, big: "16 litros", small: "lo que rinde ese kilo" },
];

const Ficha: React.FC<{ f: number }> = ({ f }) => {
  if (f < CIFRAS[0].at - 10 || f > 1268) return null;
  let idx = 0;
  for (let i = 0; i < CIFRAS.length; i++) if (f >= CIFRAS[i].at) idx = i;
  const cur = CIFRAS[idx];
  const local = f - cur.at;
  const k = rampIn(local + 8, 12) * interpolate(f, [1252, 1268], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el cambio de valor NO remonta la ficha: la vuelve a apoyar
  const pop = interpolate(local, [0, 7, 18], [0.955, 1.022, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(3)),
  });
  const respira = 1 + Math.sin(f / 46) * 0.006;
  return (
    <div
      style={{
        position: "absolute", right: SAFE + 22, bottom: SAFE + 40,
        transform: `scale(${pop * respira})`, transformOrigin: "100% 100%", opacity: k,
      }}
    >
      <div
        style={{
          padding: "26px 40px 30px", minWidth: 430, maxWidth: 520, textAlign: "right",
          background: "linear-gradient(178deg, rgba(247,241,223,0.96) 0%, rgba(226,216,191,0.94) 100%)",
          borderRadius: 8,
          boxShadow: "0 26px 60px rgba(42,38,32,0.42), 0 4px 10px rgba(42,38,32,0.3), inset 0 1px 0 rgba(255,252,242,0.9)",
          borderTop: `5px solid ${C.accent}`,
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 96, fontWeight: 800, color: C.ink, lineHeight: 0.96, letterSpacing: -2 }}>{cur.big}</div>
        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.inkSoft, marginTop: 10, lineHeight: 1.16 }}>{cur.small}</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
export const MovCloroBorax: React.FC = () => {
  const f = useCurrentFrame();
  const cz = camZ(f);
  const t = luz(f, DUR, 0.3, 0.45);
  const c = cam(f, DUR, { z: 1.0, ry: 2.6, panX: -16 }, { z: 1.066, ry: -3.2, panX: 14 });
  const boot = rampIn(f, 14);

  // F4 · frente del wipe de vapor, en % de ancho. El mask del acto 4 y el vapor comparten este
  // número: por eso el swap ocurre columna por columna DETRÁS de la materia, sin un frame al aire.
  const wipeF = interpolate(f, [1256, 1302], [108, -8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.poly(3)),
  });

  // ventanas de material. Cortes DUROS en las fronteras: la costura las tapa.
  const enA1 = f < A2 + 3;
  const poroOn = f < 262 ? 0 : f < A3 ? 1 : f < 1250 ? 0 : f < A6 + 92 ? 1 : 0;
  const enA3 = f >= A3 - 6 && f < A4;
  const enA4 = f >= A4 - 6 && f < 1306;
  const enA6 = f >= A6 - 8;

  // estado del poro: 0 = seco, la raíz viva bebiendo (acto 2) · 1 = mojado con bórax (acto 5)
  const estado = interpolate(f, [1256, 1300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kCristal = interpolate(f, [1392, 1560], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.poly(3)),
  });

  return (
    <AbsoluteFill style={{ opacity: boot }}>
      {/* ═══ ESCENARIO ÚNICO: una sola cámara, un solo espacio 3D. NUNCA se remonta. ═══ */}
      <AbsoluteFill style={{ ...camStyle(c), overflow: "hidden" }}>

        {/* ─────────── ACTO 1 · MITO — el cloro que sólo decolora ─────────── */}
        {enA1 ? (
          <AbsoluteFill
            style={{ opacity: interpolate(f, [A2 - 2, A2 + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
          >
            {/* el cloro entrando al balde */}
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1.05 + f * 0.00022})` }}>
              <Clip src="clembudo_s302" from={0} dur={150} rate={1} />
            </div>

            {/* la pared que se decolora — a partir de f 118. Esta MISMA foto es la capa `pared`
                del rig del poro: por eso la frontera F1 no se ve. */}
            <div
              style={{
                position: "absolute", inset: 0,
                opacity: interpolate(f, [116, 132], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${1.02 + (f - 118) * 0.00028})`,
              }}
            >
              <Clip src="clembudo_s303" from={118} dur={150} rate={1} />
              {/* el hipoclorito ACLARA la superficie: el velo sube justo donde pasa el trapo */}
              <div
                style={{
                  position: "absolute", inset: 0, mixBlendMode: "screen",
                  background: "radial-gradient(58% 46% at 47% 41%, rgba(255,252,244,0.86) 0%, rgba(255,252,244,0.34) 52%, rgba(255,252,244,0) 82%)",
                  opacity: interpolate(f, [150, 232], [0, 0.92], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin),
                  }),
                }}
              />
            </div>

            {/* tarjeta flotante con MATERIAL REAL adentro: la mancha ya "limpia" */}
            <div style={{ position: "absolute", inset: 0, perspective: 1500, transformStyle: "preserve-3d" }}>
              {(() => {
                const k = rampIn(f - 74, 14);
                const out = interpolate(f, [238, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (k <= 0.004 || out <= 0.004) return null;
                const fl = Math.sin((f - 74) / 62) * 6;
                return (
                  <div
                    style={{
                      position: "absolute", inset: 0, opacity: k * out,
                      transformStyle: "preserve-3d", transform: `translateY(${(1 - k) * 40}px)`,
                    }}
                  >
                    <Glass x={1050} y={168} w={700} h={438} z={120} ry={-11 + fl * 0.4} rx={3} radius={10} lift={1.25}>
                      <Img src={img("clembudo_s305")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(184deg, rgba(0,0,0,0) 52%, rgba(20,16,11,0.72) 100%)" }} />
                      <div
                        style={{
                          position: "absolute", left: 26, bottom: 22,
                          fontFamily: FONT, fontSize: 34, fontWeight: 700, color: "#F7F1DF",
                          textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                        }}
                      >
                        parece que funcionó
                      </div>
                    </Glass>
                  </div>
                );
              })()}
            </div>

            <Bloque f={f} at={16} kick="EL MITO MÁS CARO" head={"El cloro sólo decolora\nla superficie"} w={800} />
          </AbsoluteFill>
        ) : null}

        {/* ─────────── RIG DEL PORO · actos 2 y 5 (el MISMO poro, dos estados) ─────────── */}
        {poroOn > 0 ? (
          <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
            {/* L1 · la pared de lejos — la misma foto del acto 1: por eso F1 no se ve */}
            <Plate3D p={P.pared} cz={cz} f={f} on={poroOn}>
              <Img src={img("clembudo_s303")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Plate3D>

            {/* L2 · el halo decolorado alrededor de la mancha */}
            <Plate3D p={P.halo} cz={cz} f={f} on={poroOn}>
              <Img src={img("clembudo_s305")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(46% 40% at 50% 50%, rgba(20,16,11,0.55) 0%, rgba(20,16,11,0) 74%)" }} />
            </Plate3D>

            {/* L3 · el labio exterior del poro (anillo) */}
            <Plate3D p={P.labio} cz={cz} f={f} on={poroOn} mask={ANILLO_LABIO}>
              <Img src={img("clembudo_s304")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.16)" }} />
            </Plate3D>

            {/* L4 · la boca (anillo interior) — el óvalo oscuro que en F2 se vuelve el círculo de s322 */}
            <Plate3D p={P.boca} cz={cz} f={f} on={poroOn} mask={ANILLO_BOCA}>
              <Img src={img("clembudo_s304")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.62) rotate(6deg)" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(38% 34% at 50% 50%, rgba(14,11,7,0.86) 0%, rgba(14,11,7,0) 72%)" }} />
            </Plate3D>

            {/* L5 · la garganta: el pozo. Acá no hay foto que alcance — es aire oscuro y pared curva */}
            <Plate3D p={P.gargant} cz={cz} f={f} on={poroOn}>
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(52% 46% at 50% 47%, rgba(9,7,5,0.96) 0%, rgba(26,20,14,0.88) 44%, rgba(58,46,33,0.5) 72%, rgba(0,0,0,0) 92%)",
                }}
              />
              <div
                style={{
                  position: "absolute", inset: 0, mixBlendMode: "screen",
                  background: `radial-gradient(60% 52% at 34% 26%, rgba(255,240,206,${0.1 + t * 0.14}) 0%, rgba(255,240,206,0) 58%)`,
                }}
              />
            </Plate3D>

            {/* L6 · el agua bajando por la garganta — turbia en el acto 2, ESPUMA de bórax en el 5 */}
            <Plate3D p={P.hilos} cz={cz} f={f} on={poroOn} mask={DISCO_FONDO}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - estado }}>
                <Hilos f={f} n={16} tono="rgba(196,214,226,0.82)" vel={5.2} />
              </div>
              {estado > 0.01 ? (
                <div style={{ position: "absolute", inset: 0, opacity: estado }}>
                  <Clip src="clembudo_s311" from={1256} dur={151} rate={1} />
                  <div style={{ position: "absolute", inset: 0 }}>
                    <Hilos f={f} n={22} tono="rgba(255,255,255,0.9)" vel={6.6} />
                  </div>
                </div>
              ) : null}
            </Plate3D>

            {/* L7 · LA RAÍZ al fondo del poro. Viva y latiendo en el acto 2; sepultada en el 5 */}
            <Plate3D p={P.raiz} cz={cz} f={f} on={poroOn} mask={DISCO_FONDO}>
              <div style={{ position: "absolute", inset: 0, transform: `scale(${1.06 + Math.sin(f / 54) * 0.018})` }}>
                <Img src={img("clembudo_s312")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} />
              </div>
              <div
                style={{
                  position: "absolute", inset: 0, mixBlendMode: "multiply",
                  background: `radial-gradient(30% 26% at 50% 52%, rgba(72,44,20,${0.55 + Math.sin(f / 38) * 0.13}) 0%, rgba(72,44,20,0) 70%)`,
                  opacity: 1 - estado * 0.55,
                }}
              />
              <div
                style={{
                  position: "absolute", inset: 0, mixBlendMode: "screen",
                  background: `radial-gradient(34% 30% at 50% 50%, rgba(176,80,60,${(0.16 + Math.sin(f / 31) * 0.07) * (1 - estado)}) 0%, rgba(176,80,60,0) 66%)`,
                }}
              />
            </Plate3D>

            {/* L8 · EL CRISTAL DE GUARDIA — crece cuando el agua se evapora (actos 5 y 6) */}
            {kCristal > 0.002 ? (
              <Plate3D p={P.cristal} cz={cz} f={f} on={poroOn} mask={DISCO_FONDO}>
                <Img src={img("clembudo_s312")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                <div style={{ position: "absolute", inset: 0 }}>
                  <Cristales f={f} k={kCristal} />
                </div>
                <div
                  style={{
                    position: "absolute", inset: 0, mixBlendMode: "screen",
                    background: `radial-gradient(40% 36% at 44% 40%, rgba(255,252,240,${0.12 + kCristal * 0.2 + Math.sin(f / 44) * 0.04}) 0%, rgba(255,252,240,0) 70%)`,
                  }}
                />
              </Plate3D>
            ) : null}

            {/* L9 · motas suspendidas DELANTE de todo: el plano más cercano, parallax manual */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {new Array(22).fill(0).map((_, i) => {
                const a = rng(163, i) * Math.PI * 2;
                const r = 6 + rng(167, i) * 62;
                const push = 1 + cz * 0.42;
                const x = 50 + Math.cos(a) * r * push;
                const y = 50 + Math.sin(a) * r * push * 0.78 + Math.sin((f + i * 29) / 74) * 1.6;
                if (x < -12 || x > 112 || y < -12 || y > 112) return null;
                const sz = (2 + rng(173, i) * 5) * push;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute", left: `${x}%`, top: `${y}%`, width: sz, height: sz,
                      borderRadius: "50%", background: "#FFF4DC",
                      opacity: (0.1 + rng(179, i) * 0.2) * poroOn,
                    }}
                  />
                );
              })}
            </div>

            {f >= A2 && f < A3 ? (
              <Bloque f={f} at={A2 + 118} kick="ADENTRO DEL PORO" head={"Le sacaste el color\ny le diste de beber"} w={820} />
            ) : null}
            {f >= A5 && f < A6 ? (
              <Bloque f={f} at={1396} kick="Y AL EVAPORARSE" head={"Queda cristalizado\ndentro del poro"} side="right" w={760} />
            ) : null}
          </AbsoluteFill>
        ) : null}

        {/* ─────────── ACTO 3 · EL CLIENTE — avatar VISIBLE, elementos a los lados ─────────── */}
        {enA3 ? (
          <AbsoluteFill>
            {/* la boca del poro aterriza como el CÍRCULO de moho de s322 (F2 MATCH-SHAPE) y se
                retira al tercio izquierdo, dejando el derecho libre para el avatar */}
            {(() => {
              const k = interpolate(f, [A3 - 6, A3 + 22], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(4)),
              });
              // ⛔ nada de fade de salida: el acto 3 corta DURO en 837, debajo del cuero.
              // (Medido: un fade de 22 frames acá dejaba la cobertura en 0,50 antes de la oclusión.)
              const s = interpolate(k, [0, 1], [2.3, 1], { extrapolateRight: "clamp" });
              const ox = interpolate(k, [0, 1], [0, -318], { extrapolateRight: "clamp" });
              return (
                <div
                  style={{
                    position: "absolute", left: 0, top: 0, width: W, height: H,
                    transform: `translateX(${ox}px) scale(${s})`, transformOrigin: "50% 50%",
                  }}
                >
                  <Clip src="clembudo_s322" from={A3 - 6} dur={200} rate={0.75} />
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(96deg, rgba(20,16,11,0) 0%, rgba(20,16,11,0) 44%, rgba(20,16,11,${0.55 * k}) 72%, rgba(20,16,11,${0.9 * k}) 100%)`,
                    }}
                  />
                </div>
              );
            })()}

            {/* el avatar respira por el tercio derecho. ⛔ nada le tapa boca ni mentón */}
            <div
              style={{
                position: "absolute", right: SAFE, top: SAFE + 46, width: 540,
                opacity: rampIn(f - (A3 + 58), 14), textAlign: "right",
              }}
            >
              <Kick size={30}>POR ESO TE LLAMAN</Kick>
              <div style={{ height: 14 }} />
              <div style={{ whiteSpace: "pre-line" }}>
                <Head size={58} align="left">{"Ya lo intentó.\nLe falló."}</Head>
              </div>
            </div>

            {/* el balde blanco del piso: la materia que cruza hacia el acto 4, ya en su sitio */}
            <div
              style={{
                position: "absolute", left: SAFE + 26, bottom: SAFE + 6, width: 300, height: 300,
                opacity: rampIn(f - (A3 + 96), 12), transformStyle: "preserve-3d",
              }}
            >
              <Glass x={0} y={0} w={300} h={300} z={70} ry={9} rx={-2} radius={8} lift={1.1}>
                <Img src={img("clembudo_s315")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 72%" }} />
              </Glass>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* ─────────── ACTO 4 · EL BÓRAX — la receta, el precio, el rinde ─────────── */}
        {enA4 ? (
          <AbsoluteFill
            style={
              f >= 1256
                ? {
                    WebkitMaskImage: `linear-gradient(90deg, #000 0%, #000 ${wipeF}%, rgba(0,0,0,0) ${wipeF + 7}%)`,
                    maskImage: `linear-gradient(90deg, #000 0%, #000 ${wipeF}%, rgba(0,0,0,0) ${wipeF + 7}%)`,
                  }
                : undefined
            }
          >
            {/* ⚠️ cada clip dura 151 frames REALES a rate 1 y NO se loopea: las cuatro ventanas se
                solapan y CADA CAPA SÓLO ENTRA, nunca se va — la de arriba tapa a la de abajo, que se
                apaga sola cuando termina su Sequence. (Con crossfade cruzado la cobertura caía a
                0,50 en el medio de cada cambio: medido frame a frame.)
                s307 831-982 · s308 905-1056 · s309 1040-1191 · s310 1140-1288 */}

            {/* "lo que sí funciona es el bórax": el polvo cayendo al balde */}
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1.04 + (f - A4) * 0.00016})` }}>
              <Clip src="clembudo_s307" from={A4 - 6} dur={151} rate={1} />
            </div>

            {/* "250 gramos, una taza bien llena, en 4 litros": la taza medida sobre la olla */}
            <div
              style={{
                position: "absolute", inset: 0,
                opacity: interpolate(f, [905, 922], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${1.03 + (f - 905) * 0.00018})`,
              }}
            >
              <Clip src="clembudo_s308" from={905} dur={151} rate={1} />
            </div>

            {/* "lo más caliente que puedas": revolviendo, con el vapor subiendo */}
            <div
              style={{
                position: "absolute", inset: 0,
                opacity: interpolate(f, [1040, 1057], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${1.03 + (f - 1040) * 0.0002})`,
              }}
            >
              <Clip src="clembudo_s309" from={1040} dur={151} rate={1} />
            </div>

            {/* "2 a 5 dólares el kilo / rinde 16 litros": la bolsa y los baldes llenos */}
            <div
              style={{
                position: "absolute", inset: 0,
                opacity: interpolate(f, [1140, 1158], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `scale(${1.02 + (f - 1140) * 0.00022})`,
              }}
            >
              <Clip src="clembudo_s310" from={1140} dur={151} rate={1} />
            </div>

            {/* cama: la tipografía no pelea con el taller */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(276deg, rgba(20,16,11,0.7) 0%, rgba(20,16,11,0.22) 40%, rgba(20,16,11,0) 66%)" }} />

            <Bloque f={f} at={A4 + 10} kick="LO QUE SÍ FUNCIONA" head={"El bórax penetra\ncon el agua"} w={700} />
            <Ficha f={f} />
          </AbsoluteFill>
        ) : null}

        {/* ═══ F4 · WIPE POR MATERIA: el vapor del agua caliente barre de derecha a izquierda y el
             acto 4 se retira EXACTAMENTE detrás de su frente (el mask de arriba usa el mismo
             `wipeF`). Detrás ya está el poro montado desde f 1250: no hay ni un frame descubierto,
             y el vapor es la única materia que existe a los dos lados de la frontera. ═══ */}
        {f >= 1250 && f <= 1316 ? (
          <div
            style={{
              position: "absolute", left: `${wipeF - 27}%`, top: "-16%", width: "58%", height: "132%",
              transform: "rotate(3deg)",
              opacity: interpolate(f, [1250, 1262, 1298, 1316], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              background: "radial-gradient(52% 58% at 50% 50%, rgba(252,250,246,0.97) 0%, rgba(246,242,232,0.78) 44%, rgba(240,236,226,0) 80%)",
            }}
          >
            {/* el vapor no es una cortina lisa: tiene volutas que suben */}
            {new Array(14).fill(0).map((_, i) => {
              const x = rng(191, i) * 100;
              const y = ((rng(193, i) * 140 - f * (1.1 + rng(197, i) * 1.4)) % 150 + 150) % 150;
              const sz = 90 + rng(199, i) * 220;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute", left: `${x}%`, top: `${y}%`, width: sz, height: sz,
                    marginLeft: -sz / 2, marginTop: -sz / 2, borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(255,255,255,${0.1 + rng(211, i) * 0.16}) 0%, rgba(255,255,255,0) 68%)`,
                  }}
                />
              );
            })}
          </div>
        ) : null}

        {/* ─────────── ACTO 6 · DE GUARDIA + la regla más rara del oficio ─────────── */}
        {enA6 ? (
          <AbsoluteFill>
            {/* la cámara ya viene retrocediendo (camZ 5.62 → 3.30) y la pared seca aparece detrás */}
            <div
              style={{
                position: "absolute", inset: 0,
                opacity: interpolate(f, [A6 + 40, A6 + 76], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin),
                }),
                transform: `scale(${1.1 - (f - A6) * 0.0004})`,
              }}
            >
              <Clip src="clembudo_s323" from={A6 + 40} dur={113} rate={1} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(268deg, rgba(20,16,11,0.62) 0%, rgba(20,16,11,0.1) 46%, rgba(20,16,11,0) 72%)" }} />
            </div>

            {/* el contraste final: el cloro no deja nada, el bórax se queda */}
            {(() => {
              const k = rampIn(f - (A6 + 8), 13);
              if (k <= 0.004) return null;
              return (
                <div style={{ position: "absolute", left: SAFE + 20, bottom: SAFE + 216, width: 900, opacity: k, transform: `translateY(${(1 - k) * 28}px)` }}>
                  <div style={{ display: "flex", alignItems: "stretch", gap: 18 }}>
                    <div style={{ flex: 1, padding: "18px 22px", background: "rgba(24,20,15,0.68)", borderLeft: `4px solid ${C.danger}`, borderRadius: 4 }}>
                      <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.danger, letterSpacing: 3 }}>CLORO</div>
                      <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: "#F2EAD6", marginTop: 6, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>se evapora entero</div>
                    </div>
                    <div style={{ flex: 1, padding: "18px 22px", background: "rgba(24,20,15,0.68)", borderLeft: `4px solid ${C.good}`, borderRadius: 4 }}>
                      <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.accentSoft, letterSpacing: 3 }}>BÓRAX</div>
                      <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: "#F2EAD6", marginTop: 6, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>se queda de guardia</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <Bloque f={f} at={A6 + 98} kick="LA REGLA MÁS RARA DEL OFICIO" head={"Esta solución\nno se enjuaga nunca"} w={880} />
          </AbsoluteFill>
        ) : null}

        {/* ═══ F3 · LA OCLUSIÓN: el cuero del delantal cruza justo en el swap del acto 3 al 4 ═══ */}
        <Occluder at={A4 - 1} len={9} color={C.gold} angle={-7} />
        <Cuero at={A4 - 1} len={15} />
      </AbsoluteFill>

      {/* ═══ ATMÓSFERA ÚNICA — montada UNA vez, nunca se remonta entre actos. En el acto 3 baja de
           intensidad para que el avatar respire, pero es la MISMA capa. ═══ */}
      <AbsoluteFill style={{ opacity: (enA3 && f > A3 + 10 ? 0.5 : 1) * boot, pointerEvents: "none" }}>
        <Atmos t={t} dust={30} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
