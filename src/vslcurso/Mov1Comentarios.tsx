// Mov1Comentarios.tsx — MOVIMIENTO 1 del VSL de constructorlibre.com/curso.
// 11,50 s · 345 frames a 30 fps · arranca en el frame GLOBAL 180 (segundo 6,00).
//
// ⛔⛔ ESTE MOVIMIENTO TAPA AL PRESENTADOR AL 100 % DURANTE LOS 345 FRAMES.
// En este tramo el audio es una voz clonada (el hook se regrabó sobre comentarios reales) y los
// labios del avatar NO coinciden: si se ve un hueco, se ve la boca desfasada. Por eso:
//   · el `AbsoluteFill` raíz va con `backgroundColor` opaco (bg0), nunca transparente;
//   · SIEMPRE hay al menos un plate a sangre en pantalla, y los plates se SOLAPAN en cada
//     frontera (P1 vive hasta 157 aunque el acto 2 arranca en 132; P2 hasta 192; P3 hasta 279),
//     así que no existe el frame de 1 cuadro sin material debajo;
//   · el panel de revoque del acto 2 crece DESDE el rect de la tarjeta y tapa el cuadro entero
//     recién en el frame 154 — hasta ahí el hueco de las esquinas lo llena P1, que sigue vivo.
//
// ── EL GUION, ANCLADO AL MS (frames LOCALES, 0 = segundo 6,00 del video) ──────────────────────
//   0    "(…resumido en una sola frase)"  → ya estamos DENTRO de la escena: pared con salitre
//   5    "Esta mujer mandó a reparar su pared tres veces" → CORTE EN EL BEAT: entra COMENTARIO 1
//   108  "tres"                           → golpe del acto: marcador ámbar sobre "reparar 3 veces"
//   132  "y el daño volvió"               → la pared vuelve a aparecer dañada, a sangre
//   185  "Este hombre buscó una empresa…" → entra COMENTARIO 2
//   276  "y no encontró a nadie"          → el vacío: habitación vacía, nadie
//   345  (fin)                            → aterriza a sangre, sin tarjetas, para la ráfaga
//
// ══ TABLA DE HANDOFF ══════════════════════════════════════════════════════════════════════════
// (cam = estado de la cámara continua `useCam(desde)` + el punch local; luz = key/temperatura;
//  materia = el objeto que CRUZA la frontera y se transforma en el acto siguiente)
//
// VECINO DE ENTRADA (frame local < 0) — presentador a pantalla completa, plano medio, taller de
//   fondo, luz de día neutra.  exitTo {cam: plano medio frontal, luz: día neutra 5600K,
//   materia: "el encuadre frontal del presentador"}
//
// acto 1 · COMENTARIO 1 · frames 0–131
//   enterFrom {cam: {z 1.000 heredado de useCam(180), panX/ry del seno global, punch 0},
//              luz: {temp ámbar 0.34, dir key x=68 %}, materia: "pared con salitre a sangre (045)
//              — es el MISMO plano medio que dejó el presentador, mismo eje, otro sujeto"}
//   exitTo    {cam: {punch 1.00 → la tarjeta se viene a cámara y su papel llena el cuadro},
//              luz: {temp ámbar 0.40 con pulso en el 108, dir x=60 %},
//              materia: "EL PAPEL BLANCO de la tarjeta del comentario 1"}
//
// acto 2 · EL DAÑO VOLVIÓ · frames 132–184
//   enterFrom {cam: {hereda el punch del acto 1 y lo suelta: 1.00 → 0 entre 132 y 160},
//              luz: {temp ámbar 0.40 → 0.26, dir x=60 % → 48 %},
//              materia: "el papel de la tarjeta, que se CONVIERTE en el marco del panel de
//              revoque y crece hasta sangrar (132→154)"}
//   exitTo    {cam: {panel a sangre, deriva lenta del seno global},
//              luz: {temp 0.26, dir x=48 %}, materia: "EL REVOQUE del panel (#7A7167)"}
//
// acto 3 · COMENTARIO 2 · frames 185–275
//   enterFrom {cam: {entra con la banda de revoque cruzando; escala de encuadre NUEVA (general
//              → tarjeta a la derecha + carrusel a la izquierda), no parecida: claramente otra},
//              luz: {temp 0.26 → 0.14 (se enfría), dir x=48 % → 38 %},
//              materia: "el revoque, que es la pared del plate 046 detrás del carrusel"}
//   exitTo    {cam: {zoom-through: la foto de la tarjeta escala ×7 entre 262 y 278},
//              luz: {temp 0.14, dir x=38 %},
//              materia: "LA FOTO del hombre mirando la pared (vslp02), que el ojo atraviesa"}
//
// acto 4 · NADIE · frames 276–344
//   enterFrom {cam: {sale del zoom: el plate arranca en scale 1.34 y decae a 1.00 en 276→306 —
//              el vector de acercamiento NO se corta, se frena}, luz: {temp 0.14 → 0.08, frío,
//              dir x=38 % → 30 %}, materia: "la habitación vacía que había dentro de esa foto"}
//   exitTo    {cam: {plano general de la habitación a sangre, sin punch},
//              luz: {temp 0.08, dir x=30 %}, materia: "la habitación a sangre, SIN tarjetas desde
//              el frame 330 (15 frames limpios) para que la ráfaga de casas arranque limpia"}
//
// VECINO DE SALIDA (frame local > 345) — ráfaga de 4 fotos de casas reales, 1 s cada una, a
//   pantalla completa y sin componentes.  enterFrom {cam: corte seco a foto a sangre, luz frío
//   0.08, materia: "pared/habitación a sangre"} ← exactamente lo que deja el acto 4.
//
// ══ LAS COSTURAS (una DISTINTA por frontera, ⛔ ningún fade) ═══════════════════════════════════
//  F0 @ 5    CORTE EN EL BEAT   — la tarjeta aparece con opacidad 1 en el frame exacto de "Esta
//                                 mujer", sin rampa, y el plate da un punch de 1,000→1,045. Es la
//                                 única costura posible con el vecino: encuadre y luz ya calzan.
//  F1 @ 132  WIPE POR MATERIA   — polvo de revoque cruza (126→144) y detrás el panel ya creció
//                                 desde el papel de la tarjeta. El swap ocurre en el pico del polvo.
//  F2 @ 185  OCLUSIÓN           — banda de REVOQUE #7A7167 (la materia que cruza, ⛔ NUNCA el
//                                 color del fondo: con el del fondo no ocluye, hace un fundido a
//                                 negro y se ve un flash) tapa el 100 % entre 183 y 191.
//  F3 @ 276  ZOOM-THROUGH       — la cámara entra en la foto de la tarjeta (×7 entre 262 y 278) y
//                                 sale dentro de la habitación vacía, que frena desde scale 1,34.
//  (Ninguna frontera repite costura y ninguna usa fade.)
//
// ══ CAPAS POR PLANO (6-9, de atrás hacia adelante) ════════════════════════════════════════════
//  L1 plate real a sangre (clip) con su parallax · L2 copia `_blur.jpg` del MISMO plate (⛔ jamás
//  `backdrop-filter`) · L3 velo direccional · L4 LUZ que evoluciona (key + rim + temperatura) ·
//  L5 carrusel/tarjetas de fondo con translateZ negativo · L6 tarjeta protagonista con material
//  real adentro, specular, rim y sombra de CONTACTO que aterriza · L7 tipografía con su
//  profundidad · L8 atmósfera (polvo, bokeh, barrido) montada UNA vez · L9 lente (viñeta, grano).
//
// ⛔ CONTRATO: cero `Math.random`/`Date.now` (todo función pura de `useCurrentFrame`, `rnd()` del
// Escenario) · cero `backdrop-filter` · cero `filter: blur` grande a pantalla completa · cero
// `<Video>` (sólo `OffthreadVideo`) · `loop` NO es prop de `OffthreadVideo`, así que NINGÚN clip
// se estira más que su duración real (045 160f → uso 158 · 002 210f → 61 · 046 185f → 95 ·
// 025 129f → 69 · 037 127f → 53) · `Easing.quint` no existe.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  ACC, Atmos, Carrusel, Chip, Contacto, FF, Grade, INK, Kicker, MUTE, PAPER, Plate, SAFE,
  SOMBRA_TEXTO, Tarjeta, Titular, VSL, WipeMateria, Occluder, rnd, useActo, useCam,
} from "./Escenario";

// ── MATERIAL (rutas exactas; el build tiene que sumarlas al tarball: están hardcodeadas) ───────
const CLIP_SALITRE = "broll/vslcurso_045.mp4";   // 5,3 s · pared interior con humedad y salitre
const CLIP_MOHO = "broll/vslcurso_002.mp4";      // 7,0 s · esquina con moho negro, más cerrado
const CLIP_MOHO_RINCON = "broll/vslcurso_037.mp4"; // 4,2 s · moho negro subiendo por el rincón
const CLIP_CHORREO = "broll/vslcurso_046.mp4";   // 6,2 s · pared exterior con chorreaduras
const CLIP_VACIA = "broll/vslcurso_025.mp4";     // 4,3 s · habitación vacía, luz de ventana, nadie

const F_MUJER = "img/vslm03.png";                // mujer señalando la pared manchada de su living
const F_MUJER_BLUR = "img/vslm03_blur.jpg";
const F_HOMBRE = "img/vslp02.png";               // hombre en su living mirando la pared con moho
const F_HOMBRE_BLUR = "img/vslp02_blur.jpg";
const F_TECHO = "img/vslw01.png";                // techo de habitación con mancha
const F_GRIS = "img/vslw02.png";                 // pared de living con mancha gris
const F_BANO = "img/vslp03.png";                 // baño con moho en la pared
const F_SENOR = "img/vslp01.png";                // señor mayor señalando el techo de su cocina

// ── CORTES DE LOS 4 ACTOS (frames LOCALES) ─────────────────────────────────────────────────────
const A1 = 0;
const A2 = 132;
const A3 = 185;
const A4 = 276;
const FIN = 345;

const REVOQUE = "#7A7167";  // el color de la MATERIA que cruza en F2 (⛔ no el del fondo)

const ramp = (f: number, a: number, b: number, e?: (n: number) => number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// ══ L4 · LA LUZ QUE EVOLUCIONA ════════════════════════════════════════════════════════════════
/** Una sola capa para los 345 frames: la key barre de x=68 % a x=30 % y la temperatura cae del
 *  ámbar de obra al frío de la habitación vacía. ⛔ No salta en las fronteras: es una sola
 *  interpolación sobre el frame local, con un PULSO ámbar en el golpe del acto 1 (frame 108). */
const Luz: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [A1, A2, A3, A4, FIN], [68, 60, 48, 38, 30], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const temp = interpolate(f, [A1, 108, A2, A3, A4, FIN], [0.34, 0.44, 0.40, 0.26, 0.14, 0.08], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const pulso = Math.max(0, 1 - Math.abs(f - 108) / 16) * 0.26;
  const resp = 1 + 0.05 * Math.sin(f / 23) + 0.03 * Math.sin(f / 37 + 1.2);
  return (
    <>
      {/* key cálida que sigue a la lámpara */}
      <AbsoluteFill style={{
        background: `radial-gradient(62% 78% at ${x.toFixed(1)}% 26%, rgba(224,146,44,${((temp + pulso) * 0.58 * resp).toFixed(3)}) 0%, rgba(224,146,44,0) 68%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* rim frío del lado opuesto: lo que enfría el cuadro hacia el acto 4 */}
      <AbsoluteFill style={{
        background: `radial-gradient(54% 70% at ${(100 - x).toFixed(1)}% 78%, rgba(138,168,198,${(0.30 - temp * 0.34).toFixed(3)}) 0%, rgba(138,168,198,0) 64%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* densidad del ambiente: baja el piso de negros sin matar el b-roll */}
      <AbsoluteFill style={{
        background: `linear-gradient(${(104 - x * 0.5).toFixed(1)}deg, rgba(12,11,9,${(0.30 + temp * 0.10).toFixed(3)}) 0%, rgba(12,11,9,0.04) 46%, rgba(12,11,9,${(0.42 - temp * 0.12).toFixed(3)}) 100%)`,
        pointerEvents: "none",
      }} />
    </>
  );
};

// ══ L5 · PLANO DE PROFUNDIDAD ═════════════════════════════════════════════════════════════════
/** Envuelve una pieza en un plano con `translateZ` propio y parallax propio (el plano de adelante
 *  se mueve MÁS que el de atrás). Es lo que hace que las tarjetas no parezcan stickers. */
const Plano: React.FC<{
  z: number; x: number; y: number; desde: number; children: React.ReactNode; rot?: number;
}> = ({ z, x, y, desde, children, rot = 0 }) => {
  const cam = useCam(desde);
  const k = 0.26 + z / 560;                         // cuánto parallax le toca a este plano
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%",
      transformStyle: "preserve-3d",
      transform: `translate(-50%,-50%) translate3d(${(x + cam.panX * k * 11).toFixed(2)}px, ${(y + cam.panY * k * 9).toFixed(2)}px, ${z}px) rotateY(${(cam.ry * (0.4 + k) + rot).toFixed(3)}deg) rotateX(${(cam.rx * 0.5).toFixed(3)}deg)`,
    }}>
      {children}
    </div>
  );
};

// ══ L6 · LA TARJETA DEL COMENTARIO — material real arriba, texto grande abajo ══════════════════
/** ⛔ REGLA DURA: toda tarjeta flotante lleva MATERIAL REAL adentro. Acá el material es la foto
 *  de la persona frente a su pared, a sangre en la banda superior, con su specular y su rim; el
 *  comentario va a 54 px de tinta oscura sobre papel blanco (protagonista, se lee en celular).
 *  La entrada NO es un fade: en `at` pasa a opacidad 1 de un frame al otro y se asienta con un
 *  micro-scale de 3 frames (CORTE EN EL BEAT). */
const TarjetaComentario: React.FC<{
  foto: string; w: number; bandaH: number;
  pre: string; hi: string; post: string; fuente: string;
  at: number; atHi: number; seed: number; tam?: number;
}> = ({ foto, w, bandaH, pre, hi, post, fuente, at, atHi, seed, tam = 54 }) => {
  const f = useCurrentFrame();
  const vivo = f >= at;
  const pop = ramp(f, at, at + 4, Easing.out(Easing.cubic));
  const flota = Math.sin((f - at) / 41 + seed) * 5 + Math.cos((f - at) / 67 + seed * 2) * 3;
  const tilt = 0.9 * Math.sin((f - at) / 88 + seed * 1.3);
  const hiP = ramp(f, atHi, atHi + 13, Easing.inOut(Easing.cubic));
  // el golpe: la tarjeta se clava 2 frames cuando se enciende el fragmento
  const golpe = Math.max(0, 1 - Math.abs(f - atHi) / 9);
  return (
    <div style={{
      position: "relative", width: w, borderRadius: 24, background: PAPER,
      opacity: vivo ? 1 : 0,
      transform: `translateY(${(flota - (1 - pop) * 16).toFixed(2)}px) rotateY(${tilt.toFixed(3)}deg) scale(${(1.05 - 0.05 * pop + golpe * 0.012).toFixed(4)})`,
      boxShadow: [
        "inset 0 2px 0 rgba(255,255,255,0.85)",
        "inset 0 -1px 0 rgba(20,18,15,0.10)",
        "0 3px 0 rgba(20,18,15,0.28)",
        "0 22px 46px rgba(0,0,0,0.46)",
        "0 70px 150px rgba(0,0,0,0.58)",
      ].join(", "),
      overflow: "hidden",
    }}>
      {/* ── el MATERIAL REAL ── */}
      <div style={{ position: "relative", width: "100%", height: bandaH, overflow: "hidden", background: INK }}>
        <Img src={staticFile(foto)} style={{
          width: "100%", height: "100%", objectFit: "cover",
          objectPosition: "50% 42%",
          transform: `scale(${(1.08 + 0.05 * ramp(f, at, at + 150)).toFixed(4)})`,
        }} />
        {/* specular que sigue a la key */}
        <div style={{
          position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.5,
          background: `linear-gradient(${(112 + 7 * Math.sin(f / 54)).toFixed(1)}deg, rgba(255,255,255,0) 38%, rgba(255,236,206,0.34) 56%, rgba(255,255,255,0) 72%)`,
        }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "rgba(20,18,15,0.30)" }} />
      </div>
      {/* ── el COMENTARIO ── */}
      <div style={{ padding: "34px 48px 30px", position: "relative" }}>
        <div style={{
          position: "absolute", left: 18, top: 6, fontFamily: FF, fontSize: 118, fontWeight: 800,
          color: "rgba(20,18,15,0.07)", lineHeight: 1,
        }}>“</div>
        <div style={{
          position: "relative", fontFamily: FF, fontSize: tam, fontWeight: 500, color: INK,
          lineHeight: 1.34, letterSpacing: "-0.015em",
        }}>
          {pre}
          <span style={{
            display: "inline-block", fontWeight: 700,
            padding: "2px 8px", margin: "0 -4px", borderRadius: 6,
            background: `linear-gradient(90deg, ${ACC} 0%, ${ACC} ${(hiP * 100).toFixed(1)}%, rgba(224,146,44,0) ${(hiP * 100).toFixed(1)}%, rgba(224,146,44,0) 100%)`,
            boxShadow: hiP > 0.04 ? `0 6px 22px rgba(224,146,44,${(0.40 * hiP).toFixed(2)})` : undefined,
          }}>{hi}</span>
          {post}
        </div>
        <div style={{
          marginTop: 20, display: "flex", alignItems: "center", gap: 14,
          fontFamily: FF, fontSize: 27, fontWeight: 600, color: MUTE, letterSpacing: "0.01em",
        }}>
          <span style={{ width: 34, height: 3, background: ACC, display: "inline-block" }} />
          {fuente}
        </div>
      </div>
    </div>
  );
};

// ══ EL MOVIMIENTO ═════════════════════════════════════════════════════════════════════════════
export const Mov1Comentarios: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);                         // ⛔ UNA sola cámara, función del frame GLOBAL
  const acto = useActo([A1, A2, A3, A4]);            // qué acto corre y su progreso

  // punch local que se SUMA a la cámara global: el beat del 5, el "se viene a cámara" del 124 y
  // la frenada del zoom-through del 276. La cámara global nunca se reinicia.
  const punchBeat = ramp(f, 5, 16, Easing.out(Easing.cubic)) * 0.045;
  const punchCard = ramp(f, 118, 132, Easing.in(Easing.cubic)) * 0.10;
  const suelta = 1 - ramp(f, A2, 160, Easing.out(Easing.cubic));
  const zPunch = 1 + punchBeat + punchCard * suelta;

  // el papel de la tarjeta del comentario 1 → marco del panel de revoque del acto 2 (MATCH-SHAPE
  // de la materia; la costura que lo esconde es el WIPE de polvo)
  const crece = ramp(f, A2, A2 + 22, Easing.inOut(Easing.cubic));
  const panelW = interpolate(crece, [0, 1], [1260, 2180]);
  const panelH = interpolate(crece, [0, 1], [610, 1240]);
  const panelR = interpolate(crece, [0, 1], [24, 0]);
  const panelB = interpolate(crece, [0, 1], [14, 0]);

  // ZOOM-THROUGH: la foto de la tarjeta 2 se come el cuadro entre 262 y 278
  const through = ramp(f, 262, 278, Easing.in(Easing.cubic));
  const throughZ = 1 + through * 6.2;
  const salida = 1 + (1 - ramp(f, A4, 306, Easing.out(Easing.poly(4)))) * 0.34;

  // el último tramo limpio: desde 330 NO queda ni una tarjeta ni una letra en pantalla
  const limpio = 1 - ramp(f, 322, 330);

  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {/* ════ L1+L2+L3 · LOS PLATES, SIEMPRE SOLAPADOS (ni un frame sin material debajo) ════ */}
      <AbsoluteFill style={{ transform: `scale(${zPunch.toFixed(4)})`, transformOrigin: "52% 46%" }}>
        {/* P1 · acto 1 — pared con salitre (clip 045: 159 frames reales, uso 158) */}
        <Sequence from={0} durationInFrames={158} layout="none">
          <AbsoluteFill>
            <Plate src={CLIP_SALITRE} desde={desde} profundidad={0.2} />
            <Grade p={1} blurSrc={F_MUJER_BLUR} fuerza={0.92} lado="derecha" />
          </AbsoluteFill>
        </Sequence>

        {/* P2 · acto 2 — el PAPEL de la tarjeta que se vuelve panel de revoque y sangra
            (clip 002: 210 frames reales, uso 61) */}
        <Sequence from={A2} durationInFrames={61} layout="none">
          <AbsoluteFill style={{ perspective: 2200 }}>
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              width: panelW, height: panelH,
              marginLeft: -panelW / 2 - 70 * (1 - crece), marginTop: -panelH / 2,
              borderRadius: panelR, background: PAPER, padding: panelB, overflow: "hidden",
              boxShadow: `0 ${(26 * (1 - crece)).toFixed(0)}px ${(70 * (1 - crece)).toFixed(0)}px rgba(0,0,0,${(0.55 * (1 - crece)).toFixed(2)})`,
            }}>
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: panelR * 0.7, overflow: "hidden", background: INK }}>
                <OffthreadVideo src={staticFile(CLIP_MOHO)} muted style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: `scale(${(1.14 * cam.z).toFixed(4)}) translate(${(cam.panX * 0.3).toFixed(2)}%, ${(cam.panY * 0.3).toFixed(2)}%)`,
                }} />
                <Grade p={1} fuerza={0.72} />
              </div>
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* P3 · acto 3 — pared exterior con chorreaduras (clip 046: 186 frames reales, uso 95) */}
        <Sequence from={A3} durationInFrames={95} layout="none">
          <AbsoluteFill>
            <Plate src={CLIP_CHORREO} desde={desde + A3} profundidad={0.34} />
            <Grade p={1} blurSrc={F_HOMBRE_BLUR} fuerza={0.98} lado="izquierda" />
          </AbsoluteFill>
        </Sequence>

        {/* P4 · acto 4 — habitación vacía, nadie. SALE del zoom-through: entra en 1,34 y frena.
            (clip 025: 129 frames reales, uso 69) */}
        <Sequence from={A4} durationInFrames={FIN - A4} layout="none">
          <AbsoluteFill style={{ transform: `scale(${salida.toFixed(4)})`, transformOrigin: "50% 44%" }}>
            <Plate src={CLIP_VACIA} desde={desde + A4} profundidad={0.1} />
            <Grade p={1} fuerza={0.70} />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>

      {/* ════ L4 · LA LUZ, UNA SOLA, QUE EVOLUCIONA EN LOS 345 FRAMES ════ */}
      <Luz />

      {/* ════ ACTO 1 · frames 0–131 · COMENTARIO 1 ════ */}
      {f < A2 && (
        <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "52% 46%", transform: cam.css }}>
          {/* L5 · tarjetas de apoyo, detrás y con parallax propio */}
          <Plano z={-210} x={620} y={-252} desde={desde} rot={-5}>
            <Tarjeta src={F_TECHO} w={420} h={272} texto={false} seed={3} z={-210} at={14} />
            <Contacto w={420} y={286} op={0.42} />
          </Plano>
          <Plano z={-120} x={702} y={222} desde={desde} rot={-7}>
            <Tarjeta src={F_BANO} w={360} h={250} texto={false} seed={9} z={-120} at={22} />
            <Contacto w={360} y={264} op={0.36} />
          </Plano>

          {/* L6 · la PROTAGONISTA: el comentario real, con la foto de la mujer adentro */}
          <Plano z={70} x={-70} y={-6} desde={desde}>
            <TarjetaComentario
              foto={F_MUJER} w={1260} bandaH={262}
              pre="Tengo una pared con humedad, ya la he mandado a "
              hi="reparar 3 veces"
              post=" y nuevamente aparece el daño. Estoy desesperada."
              fuente="Video de humedad · 3,8 M de vistas"
              at={5} atHi={108} seed={1}
            />
            <Contacto w={1260} y={638} op={0.56} />
          </Plano>

          {/* L7 · el chip del golpe: se enciende con la palabra "tres" */}
          {f >= 110 && (
            <Plano z={190} x={470} y={-330} desde={desde}>
              <Chip at={110} size={62}>×3</Chip>
            </Plano>
          )}
        </AbsoluteFill>
      )}

      {/* ════ ACTO 2 · frames 132–184 · "y el daño volvió" ════ */}
      {f >= A2 && f < A3 && (
        <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "48% 46%", transform: cam.css }}>
          {/* la ventana de material real que queda del papel: moho en el rincón
              (clip 037: 126 frames reales, uso 53) */}
          <Sequence from={A2} durationInFrames={53} layout="none">
            <Plano z={220} x={600} y={250} desde={desde + A2} rot={-6}>
              <Tarjeta src={CLIP_MOHO_RINCON} w={430} h={286} texto={false} seed={5} z={220} at={10} />
              <Contacto w={430} y={300} op={0.5} />
            </Plano>
          </Sequence>

          <Plano z={60} x={-300} y={96} desde={desde}>
            <div style={{ width: 880 }}>
              <Kicker at={A2 + 6}>TERCERA REPARACIÓN</Kicker>
              <div style={{ height: 14 }} />
              <Titular at={A2 + 9} size={104} z={60}>Y el daño volvió</Titular>
              {/* el marcador ámbar del acto 1 sobrevive: ahora es la regla bajo el titular */}
              <div style={{
                marginTop: 26, height: 7, background: ACC, borderRadius: 4,
                width: `${(ramp(f, A2 + 12, A2 + 34, Easing.out(Easing.cubic)) * 62).toFixed(1)}%`,
                boxShadow: "0 6px 22px rgba(224,146,44,0.45)",
              }} />
            </div>
          </Plano>
        </AbsoluteFill>
      )}

      {/* ════ ACTO 3 · frames 185–275 · COMENTARIO 2 ════ */}
      {f >= A3 - 2 && f < A4 + 4 && (
        <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "46% 46%", transform: cam.css }}>
          {/* L5 · CARRUSEL 3D de casas reales, a la izquierda y al fondo: las empresas que hay */}
          <div style={{
            position: "absolute", inset: 0,
            transform: `translateX(-30%) translateY(2%) scale(${(0.56 * (1 + through * 0.5)).toFixed(3)})`,
            opacity: (1 - through) * 0.95,
          }}>
            <Carrusel
              cartas={[{ src: F_GRIS }, { src: F_SENOR }, { src: F_TECHO }, { src: F_BANO }]}
              foco={interpolate(f, [A3, 250], [0.1, 2.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })}
              w={430} h={520} radio={560}
            />
          </div>

          {/* L6 · la PROTAGONISTA del acto 3, a la DERECHA (encuadre claramente OTRO, no parecido).
              Es la foto que la cámara ATRAVIESA en la frontera F3. */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(-50%,-50%) translate3d(${(250 + cam.panX * 7).toFixed(1)}px, ${(cam.panY * 6).toFixed(1)}px, ${(90 + through * 40).toFixed(0)}px) scale(${throughZ.toFixed(3)}) rotateY(${((1 - through) * cam.ry * 0.7).toFixed(3)}deg)`,
            transformOrigin: "50% 24%",
          }}>
            <TarjetaComentario
              foto={F_HOMBRE} w={1120} bandaH={286}
              pre="Buscando empresas que ofrecen ese servicio en mi país "
              hi="sólo encontré una"
              post="."
              fuente="Video de humedad · 2,9 M de vistas"
              at={A3} atHi={248} seed={4} tam={56}
            />
            {through < 0.02 && <Contacto w={1120} y={640} op={0.54} />}
          </div>

          {/* L2 · la copia desenfocada del hombre, MUY al fondo, para que la profundidad lea */}
          <AbsoluteFill style={{ opacity: 0.18 * (1 - through), mixBlendMode: "screen", pointerEvents: "none" }}>
            <Img src={staticFile(F_HOMBRE_BLUR)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ════ ACTO 4 · frames 276–344 · "y no encontró a nadie" ════ */}
      {f >= A4 - 2 && (
        <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "44% 46%", transform: cam.css, opacity: limpio }}>
          {/* la luz de la ventana que entra en la habitación vacía: la única materia del acto */}
          <AbsoluteFill style={{
            background: `linear-gradient(${(96 - 6 * Math.sin(f / 40)).toFixed(1)}deg, rgba(226,236,246,0) 34%, rgba(226,236,246,${(0.13 * ramp(f, A4, A4 + 26)).toFixed(3)}) 52%, rgba(226,236,246,0) 66%)`,
            mixBlendMode: "screen", pointerEvents: "none",
          }} />
          <Plano z={50} x={-170} y={40} desde={desde}>
            <div style={{ width: 1040 }}>
              <Kicker at={A4 + 4}>BUSCÓ UNA EMPRESA QUE LO HICIERA</Kicker>
              <div style={{ height: 18 }} />
              <Titular at={A4 + 8} size={168} z={50}>Nadie.</Titular>
              <div style={{
                marginTop: 22, fontFamily: FF, fontSize: 38, fontWeight: 600, color: PAPER,
                textShadow: SOMBRA_TEXTO,
                opacity: ramp(f, A4 + 20, A4 + 34),
                transform: `translateY(${((1 - ramp(f, A4 + 20, A4 + 34, Easing.out(Easing.cubic))) * 16).toFixed(1)}px)`,
              }}>
                Nadie que supiera arreglarlo.
              </div>
            </div>
          </Plano>
          {/* polvo suspendido en la habitación vacía: el hold nunca queda quieto */}
          {Array.from({ length: 14 }, (_, i) => {
            const r = rnd(i * 5.3 + 91);
            const r2 = rnd(i * 11.7 + 13);
            const s = 3 + r * 7;
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${(8 + r * 84).toFixed(1)}%`,
                top: `${(((r2 * 100) + (f - A4) * (0.05 + r * 0.09)) % 100).toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: "rgba(236,240,246,0.5)",
                filter: `blur(${(1 + r2 * 2).toFixed(1)}px)`,
                opacity: 0.18 + r2 * 0.3,
              }} />
            );
          })}
        </AbsoluteFill>
      )}

      {/* ════ L8+L9 · ATMÓSFERA Y LENTE — montadas UNA vez, NUNCA se remontan entre actos ════ */}
      <Atmos desde={desde} polvo={1} bokeh={1} />

      {/* ════ LAS COSTURAS ════ */}
      {/* F1 @ 132 · WIPE POR MATERIA — polvo de revoque cruza y detrás el panel ya creció */}
      <WipeMateria at={126} dur={18} color="rgba(214,204,188,0.9)" />
      {/* F2 @ 185 · OCLUSIÓN — banda de REVOQUE (la materia que cruza), ⛔ no el color del fondo */}
      <Occluder at={179} dur={13} material={REVOQUE} angulo={-9} />
      {/* nota: F0 @ 5 es CORTE EN EL BEAT y F3 @ 276 es ZOOM-THROUGH: no llevan capa, están
          implementadas en el movimiento mismo (`punchBeat` / `throughZ` + `salida`). */}

      {/* aro de foco del golpe del acto 1 (frame 108): refuerza el beat sin tapar el comentario */}
      {acto.i === 0 && f >= 106 && f <= 126 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            width: 1260 * (1 + ramp(f, 106, 126) * 0.22),
            height: 610 * (1 + ramp(f, 106, 126) * 0.22),
            transform: "translate(-50%,-50%) translateX(-70px)",
            border: `3px solid rgba(224,146,44,${((1 - ramp(f, 106, 126)) * 0.55).toFixed(3)})`,
            borderRadius: 30,
          }} />
        </AbsoluteFill>
      )}

      {/* safe area: ninguna pieza de este movimiento pisa los 96 px de borde */}
      <AbsoluteFill style={{ pointerEvents: "none", padding: SAFE }} />
    </AbsoluteFill>
  );
};
