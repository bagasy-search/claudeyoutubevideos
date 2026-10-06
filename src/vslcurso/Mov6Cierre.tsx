// Mov6Cierre.tsx — MOVIMIENTO 6 (EL CIERRE EMOCIONAL) del VSL de constructorlibre.com/curso.
// 16,30 s · 489 frames a 30 fps · arranca en el frame GLOBAL 7599 (segundo 253,30).
//
// ⛔⛔ ESTE MOVIMIENTO TAPA AL PRESENTADOR AL 100 % DURANTE LOS 489 FRAMES: el `AbsoluteFill` raíz
// va con `backgroundColor` opaco (bg0) y SIEMPRE hay un plate a sangre debajo. Los plates se
// SOLAPAN en cada frontera (P1 vive hasta 170 aunque el acto 2 arranca en 137; P2a hasta 233 y
// P2b arranca en 228; P2b hasta 388 y P3 arranca en 373), así que no existe ni un cuadro sin
// material debajo.
//
// ── EL GUION, ANCLADO AL MS (frames LOCALES, 0 = segundo 253,30 del video) ─────────────────────
//   0    "(…deja de pensarlo como un gasto)"      → ya estás DENTRO: el curso abierto en la laptop
//   3    "Tienes 15 días de garantía…"            → EL SELLO se estampa, el anillo se dibuja
//   82   "…verlo completo y decidir con el curso   → el sello CONVIVE con el producto (ficha de
//         delante tuyo"                              una clase real flotando sobre la mesa)
//   137  "La humedad ya está en las casas"        → COSTURA F1: la mancha del techo nace DENTRO
//                                                    del anillo y se come el cuadro; en el 166 cae
//                                                    el kicker y en el 168 arranca el MURO 3D de
//                                                    casas reales, que se ACUMULA hasta el 340
//   230  "Los clientes ya están preguntando        → WIPE interno: entran las PERSONAS señalando
//         quién puede resolverla"                    su propia pared; el muro sigue acumulando
//   380  "ALGUIEN VA A COBRAR por esos trabajos"  → COSTURA F2: oclusión de revoque y el remate:
//                                                    el cobro en la puerta + el chip ámbar
//   489  (fin)                                    → cuadro DESPEJADO desde el 477, energía en el
//                                                    pico, para que el corte a la cara del
//                                                    presentador sea el clímax
//
// ══ TABLA DE HANDOFF ══════════════════════════════════════════════════════════════════════════
// (cam = la cámara continua `useCam(desde)` + el punch/truck LOCAL que se le SUMA — ⛔ ningún acto
//  la reinicia; luz = la única capa `<Luz/>`, una sola interpolación sobre los 489 frames;
//  materia = el objeto que CRUZA la frontera y se TRANSFORMA en el acto siguiente)
//
// VECINO DE ENTRADA (frame local < 0) — presentador a PANTALLA COMPLETA, plano medio, taller,
//   luz de día neutra.  exitTo {cam: plano medio frontal, luz: día neutra ~5600 K,
//   materia: "el RECTÁNGULO del encuadre frontal, que acá es la pantalla de la laptop"}
//
// acto 1 · LA GARANTÍA · frames 0–136
//   enterFrom {cam: {z heredada de useCam(7599), panX/ry del seno global, salida de ZOOM-THROUGH:
//              scale 1,46 → 1,00 entre 0 y 18, origen en la pantalla de la laptop},
//              luz: {temp +0,46 ámbar de interior, key x=66 %},
//              materia: "la pantalla de la laptop con el curso abierto (vslg02) a sangre"}
//   exitTo    {cam: {push local 1,00 → 1,055 entre 118 y 137; la global sigue su seno},
//              luz: {temp +0,34, key x=58 %},
//              materia: "EL ANILLO ÁMBAR del sello — círculo de 215 px de radio, centro fijo en
//              (530, 520): es la forma que se convierte en la mancha del techo"}
//
// acto 2 · LA HUMEDAD YA ESTÁ EN LAS CASAS · frames 137–379
//   enterFrom {cam: {hereda el push del acto 1 y lo suelta 137→165; arranca el TRUCK: el muro
//              viaja de x +380 a x −400 con easing NO constante y push 0,88 → 1,06},
//              luz: {temp +0,34 → −0,30 (el frío de las casas), key x=58 % → 44 %},
//              materia: "el anillo, que ES el borde del círculo que revela la mancha circular de
//              humedad del techo (broll 001) y después el revoque de todas las paredes"}
//   exitTo    {cam: {el muro se va al fondo (z −700, scale 0,62) entre 356 y 378 mientras la
//              tarjeta puente se viene a cámara}, luz: {temp −0,12, key x=54 %},
//              materia: "LA TARJETA PUENTE — el hombre entrando a la casa con la carpeta
//              (vslx02): se despega del muro en el 350 y aterriza en el centro-derecha"}
//
// acto 3 · ALGUIEN VA A COBRAR · frames 380–489
//   enterFrom {cam: {la tarjeta puente ya está en su sitio y el plate entra con el vector de
//              acercamiento YA andando: push 1,00 → 1,10 con Easing.in (acelera = la energía
//              SUBE, no se estabiliza)}, luz: {temp −0,12 → +0,40 y sigue subiendo a +1,00},
//              materia: "el MARCO de la tarjeta puente, que sobrevive a la oclusión y cambia su
//              contenido por el balde de billetes (broll 043)"}
//   exitTo    {cam: {push en el pico 1,10, plate a sangre},
//              luz: {temp +1,00 — bloom ámbar máximo, rayos de luz},
//              materia: "el cobro a sangre, SIN tarjetas ni letras desde el frame 477 (12 frames
//              despejados) y con la energía arriba"}
//
// VECINO DE SALIDA (frame local > 489) — presentador a PANTALLA COMPLETA los últimos 8 s, con una
//   tarjeta de CTA flotando en la mitad DERECHA (y=132..762). El acto 3 aterriza exacto: las
//   últimas piezas del cuadro se van por la IZQUIERDA y hacia cámara (nunca hacia la derecha), el
//   cuadro queda limpio 12 frames y la luz queda cálida y alta → el corte a su cara es el clímax.
//   ⛔ El CTA (la tarjeta "¿Vas a ser tú?") lo monta OTRO componente: acá NO se dibuja.
//
// ══ LAS COSTURAS (una DISTINTA por frontera, ⛔ ningún fade) ═══════════════════════════════════
//  F0 @ 0    ZOOM-THROUGH  — venimos del presentador a pantalla completa: la cámara SALE de la
//                            pantalla de la laptop (scale 1,46 → 1,00 en 18 frames, origen
//                            48 %/44 %). El vector de acercamiento no se corta: se frena. Sin
//                            opacidad, sin blur de entrada, sin fade.
//  F1 @ 137  MATCH-SHAPE   — el ANILLO del sello (r=215) es el borde de un círculo que crece
//                            desde DENTRO del sello (r 0 → 215 → 2450, frames 137→167) y trae
//                            adentro la mancha circular de humedad de un techo. Círculo → mancha:
//                            la misma forma, otro material. El anillo cabalga el borde y se
//                            apaga cuando ya sangró.
//  F2 @ 380  OCLUSIÓN      — banda de REVOQUE `#A2968A` (la materia de todas las paredes del acto
//                            2) tapa el 100 % entre 377 y 380, y el acto 3 se REVELA detrás de
//                            su canto de fuga (clip `inset` atado a la banda: nunca hay pop).
//                            ⛔ NO el color del fondo: con el
//                            del fondo no ocluye, hace un fundido a negro y se ve un flash.
//                            Debajo, el marco de la tarjeta puente ya cambió de contenido.
//  (interna @ 230 · WIPE POR MATERIA — vapor/agua fría cruza en 224→240 y detrás ya está el plate
//   de la pared chorreada + las personas señalando. No es frontera de acto, es el sub-beat.)
//  Ninguna frontera repite costura y ninguna usa fade.
//
// ══ CAPAS POR PLANO (6-9, de atrás hacia adelante) ════════════════════════════════════════════
//  L1 plate real a sangre (foto o clip) con su parallax · L2 copia `_blur.jpg` del MISMO plate
//  (⛔ jamás `backdrop-filter`) · L3 velo direccional · L4 LUZ única que evoluciona (key + rim
//  frío + densidad + bloom) · L5 planos de profundidad con translateZ propio (de −460 a +330:
//  siete planos) · L6 objeto protagonista con material real, specular, canto y sombra de CONTACTO
//  que aterriza · L7 tipografía con su propia profundidad · L8 atmósfera (polvo, bokeh, barrido)
//  montada UNA vez · L9 lente (viñeta, grano).
//
// ⛔ CONTRATO: cero `Math.random`/`Date.now`/`new Date` (todo función pura de `useCurrentFrame`,
// aleatoriedad con `rnd()` del Escenario) · cero `backdrop-filter` · cero `filter: blur` grande a
// pantalla completa · cero `<Video>` (sólo `OffthreadVideo`) · `loop` NO es prop de
// `OffthreadVideo`, así que NINGÚN clip se estira más que su duración real:
//    001 → 211 f reales, uso 96 · 046 → 185 f, uso 160 · 002 → 210 f, uso 200 ·
//    045 → 160 f, uso 150 · 037 → 127 f, uso 120 · 043 → 210 f, uso 99.
// ⛔ Y un `clipPath` NO recorta descendientes con `preserve-3d`: ver la nota del muro.
// `Easing.quint` NO EXISTE (va `Easing.poly(5)`) · imports sólo de remotion/react/./Escenario ·
// ⛔ sin precio del curso, sin "$", sin QR y sin URL en pantalla.
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  ACC, Atmos, Contacto, FF, Grade, INK, Kicker, LINE, MUTE, Occluder, PAPER, Plate, SAFE, SOFT,
  SOMBRA_TEXTO, Tarjeta, Titular, VSL, WipeMateria, rnd, useCam,
} from "./Escenario";

// ── MATERIAL (rutas EXACTAS; están hardcodeadas → el build tiene que sumarlas al tarball) ──────
const F_LAPTOP = "img/vslg02.png";          // laptop con un video del curso, taza y cuaderno
const F_MEDIDOR = "img/vsls01.png";         // Tomás midiendo la pared con el medidor de humedad
const F_TECHO = "img/vslw01.png";           // techo de habitación con mancha de humedad
const F_GRIS = "img/vslw02.png";            // pared de living con mancha gris
const F_BANO_INOD = "img/vslw03.png";       // baño con moho alrededor del inodoro
const F_BANO_PARED = "img/vslp03.png";      // baño con moho en la pared
const F_PLACARD = "img/vslp04.png";         // mujer abriendo un placard con humedad
const F_SENOR = "img/vslp01.png";           // señor mayor señalando la mancha del techo
const F_HOMBRE = "img/vslp02.png";          // hombre mirando la pared con moho de su living
const F_MUJER = "img/vslm03.png";           // mujer señalando la pared manchada de su living
const F_VISITA = "img/vslx02.png";          // hombre entrando a una casa con una carpeta
const F_COBRO = "img/vsls04.png";           // un señor entregando billetes en la puerta (EL COBRO)

const CLIP_TECHO = "broll/vslcurso_001.mp4";    // 7,03 s · mancha CIRCULAR de humedad en un techo
const CLIP_CHORREO = "broll/vslcurso_046.mp4";  // 6,2 s · pared exterior con chorreaduras
const CLIP_MOHO = "broll/vslcurso_002.mp4";     // 7,0 s · esquina con moho negro, cerrado
const CLIP_SALITRE = "broll/vslcurso_045.mp4";  // 5,3 s · pared con humedad y salitre
const CLIP_RINCON = "broll/vslcurso_037.mp4";   // 4,2 s · esquina de habitación con moho negro
const CLIP_BILLETES = "broll/vslcurso_043.mp4"; // 7,0 s · balde con billetes y monedas

// ── LOS 3 ACTOS (frames LOCALES) ──────────────────────────────────────────────────────────────
const A1 = 0;
const A2 = 137;
const A3 = 380;
const FIN = 489;

/** color de la MATERIA que cruza F2: el revoque de las paredes del acto 2.
 *  ⛔ NUNCA el color del fondo (`bg0`): con el del fondo el Occluder no ocluye, hace un fundido a
 *  negro y se ve un flash (medido en `mdbleach`). */
const REVOQUE = "#A2968A";

/** centro del SELLO en coordenadas de pantalla (1920×1080). Es TAMBIÉN el centro del círculo de
 *  la costura F1: el match-shape sólo funciona si los dos son el mismo punto. */
const SELLO_X = 530;
const SELLO_Y = 520;
const SELLO_R = 215;
/** radio del trazo ámbar dentro del sello: es el que hereda el anillo de la costura F1 */
const ANILLO_R = SELLO_R - 16;

const ramp = (f: number, a: number, b: number, e?: (n: number) => number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// ══ L4 · LA LUZ QUE EVOLUCIONA — UNA sola capa para los 489 frames ════════════════════════════
/** El arco del cierre: interior CÁLIDO y tranquilo de la garantía → FRÍO de las casas con
 *  humedad → CÁLIDO DECIDIDO del cobro, y en el remate sigue subiendo hasta el corte.
 *  ⛔ No salta en ninguna frontera: es una sola interpolación continua sobre el frame local. */
const Luz: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [A1, 100, A2, 250, 340, A3, 440, FIN], [66, 62, 58, 44, 50, 62, 70, 74], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const temp = interpolate(f, [A1, 100, A2, 210, 280, 360, 396, 440, FIN],
    [0.46, 0.42, 0.34, -0.10, -0.30, -0.12, 0.40, 0.70, 1.00],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  // pulsos: el estampado del sello (3) y el golpe de "ALGUIEN VA A COBRAR" (388)
  const pulso = Math.max(0, 1 - Math.abs(f - 8) / 14) * 0.22 + Math.max(0, 1 - Math.abs(f - 390) / 18) * 0.30;
  const resp = 1 + 0.05 * Math.sin(f / 26) + 0.03 * Math.sin(f / 41 + 1.3);
  const calido = Math.max(0, temp);
  const frio = Math.max(0, 0.34 - temp * 0.36);
  const bloom = ramp(f, 396, FIN, Easing.in(Easing.quad));
  return (
    <>
      {/* key cálida: la lámpara del interior, después el sol de la puerta de calle */}
      <AbsoluteFill style={{
        background: `radial-gradient(64% 80% at ${x.toFixed(1)}% ${(26 + 6 * Math.sin(f / 70)).toFixed(1)}%, rgba(224,146,44,${((calido + pulso) * 0.54 * resp).toFixed(3)}) 0%, rgba(224,146,44,0) 70%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* rim frío del lado opuesto: es lo que enfría el cuadro cuando entran las casas */}
      <AbsoluteFill style={{
        background: `radial-gradient(58% 72% at ${(100 - x).toFixed(1)}% 76%, rgba(138,170,200,${frio.toFixed(3)}) 0%, rgba(138,170,200,0) 66%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />
      {/* densidad del ambiente: baja el piso de negros sin matar el material real */}
      <AbsoluteFill style={{
        background: `linear-gradient(${(102 - x * 0.5).toFixed(1)}deg, rgba(12,11,9,${(0.28 + calido * 0.10).toFixed(3)}) 0%, rgba(12,11,9,0.04) 48%, rgba(12,11,9,${(0.44 - calido * 0.14).toFixed(3)}) 100%)`,
        pointerEvents: "none",
      }} />
      {/* BLOOM del remate: la energía que sube hasta el último cuadro (rayos + halo ámbar) */}
      {bloom > 0.001 && (
        <>
          <AbsoluteFill style={{
            background: `radial-gradient(44% 58% at ${(x + 6).toFixed(1)}% 34%, rgba(255,206,138,${(0.30 * bloom).toFixed(3)}) 0%, rgba(255,206,138,0) 62%)`,
            mixBlendMode: "screen", pointerEvents: "none",
          }} />
          {Array.from({ length: 5 }, (_, i) => {
            const r = rnd(i * 9.7 + 311);
            return (
              <div key={i} style={{
                position: "absolute", left: `${(x - 6 + i * 7).toFixed(1)}%`, top: "-30%",
                width: 120 + r * 180, height: "170%",
                transform: `rotate(${(9 + r * 13).toFixed(1)}deg)`,
                background: `linear-gradient(90deg, rgba(255,214,156,0) 0%, rgba(255,214,156,${(0.10 * bloom * (0.5 + r)).toFixed(3)}) 50%, rgba(255,214,156,0) 100%)`,
                mixBlendMode: "screen", pointerEvents: "none",
                filter: "blur(6px)",
              }} />
            );
          })}
        </>
      )}
    </>
  );
};

// ══ L5 · PLANO DE PROFUNDIDAD ═════════════════════════════════════════════════════════════════
/** Envuelve una pieza en un plano con `translateZ` propio y su PROPIO parallax: el plano de
 *  adelante se mueve MÁS que el de atrás. Es lo que hace que las tarjetas no sean stickers. */
const Plano: React.FC<{
  z: number; x: number; y: number; desde: number; rot?: number; children: React.ReactNode;
}> = ({ z, x, y, desde, rot = 0, children }) => {
  const cam = useCam(desde);
  const k = 0.26 + (z + 500) / 1100;                    // cuánto parallax le toca a este plano
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%", transformStyle: "preserve-3d",
      transform: `translate(-50%,-50%) translate3d(${(x + cam.panX * k * 12).toFixed(2)}px, ${(y + cam.panY * k * 10).toFixed(2)}px, ${z}px) rotateY(${(cam.ry * (0.35 + k) + rot).toFixed(3)}deg) rotateX(${(cam.rx * 0.55).toFixed(3)}deg)`,
    }}>
      {children}
    </div>
  );
};

// ══ L6 · EL SELLO DE LOS 15 DÍAS — un OBJETO SÓLIDO, no un círculo plano ══════════════════════
/** 9 capas: sombra de contacto · canto/espesor del disco desplazado por la luz · cara del disco
 *  con degradado de papel prensado · muescas de medalla alrededor · anillo ámbar que se DIBUJA
 *  (stroke-dasharray) · anillo interior fino de tinta · la cifra con odómetro · la palabra DÍAS ·
 *  specular que barre y rim superior. Entra ESTAMPADO (scale 1,26 → 1,00), no con un fade. */
const Sello: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = SELLO_R * 2;
  const estampa = ramp(f, at, at + 11, Easing.out(Easing.cubic));
  const golpe = Math.max(0, 1 - Math.abs(f - (at + 11)) / 9);
  const dibuja = ramp(f, at + 4, at + 40, Easing.inOut(Easing.cubic));
  const cuenta = Math.round(15 * ramp(f, at + 6, at + 24, Easing.out(Easing.cubic)));
  const C = 2 * Math.PI * (SELLO_R - 16);
  const sheen = ((f * 1.7) % 360);
  const resp = 1 + 0.006 * Math.sin(f / 31);
  return (
    <div style={{
      position: "relative", width: d, height: d,
      transform: `scale(${((1.26 - 0.26 * estampa) * resp + golpe * 0.014).toFixed(4)}) rotate(${((1 - estampa) * -4).toFixed(2)}deg)`,
      opacity: f >= at ? 1 : 0,
    }}>
      {/* canto / espesor: el disco de atrás, desplazado del lado contrario a la luz */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        transform: "translate(9px, 13px)",
        background: "linear-gradient(160deg, #9A8F7F 0%, #6E6459 58%, #4C463D 100%)",
        boxShadow: "0 26px 60px rgba(0,0,0,0.52), 0 70px 140px rgba(0,0,0,0.5)",
      }} />
      {/* cara del disco: papel prensado */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        background: `radial-gradient(72% 62% at 38% 24%, ${PAPER} 0%, ${SOFT} 58%, #E7E1D6 100%)`,
        boxShadow: `inset 0 3px 0 rgba(255,255,255,0.95), inset 0 -5px 14px rgba(20,18,15,0.16), inset 0 0 0 1px ${LINE}`,
      }}>
        {/* specular que BARRE la cara siguiendo a la key */}
        <div style={{
          position: "absolute", inset: -40, mixBlendMode: "screen", opacity: 0.55,
          background: `linear-gradient(${sheen.toFixed(1)}deg, rgba(255,255,255,0) 36%, rgba(255,246,228,0.55) 50%, rgba(255,255,255,0) 64%)`,
        }} />
      </div>
      {/* muescas de medalla: 40 marcas radiales, se encienden con el dibujo del anillo */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%", width: 2, height: d - 34,
          marginLeft: -1, marginTop: -(d - 34) / 2,
          transform: `rotate(${(i * 9).toFixed(1)}deg)`,
          background: `linear-gradient(180deg, rgba(20,18,15,${(0.16 * Math.min(1, dibuja * 40 / (i + 1))).toFixed(3)}) 0px, rgba(20,18,15,0) 13px, rgba(20,18,15,0) calc(100% - 13px), rgba(20,18,15,${(0.16 * Math.min(1, dibuja * 40 / (i + 1))).toFixed(3)}) 100%)`,
        }} />
      ))}
      {/* EL ANILLO que se dibuja (stroke-dasharray) + anillo interior fino de tinta */}
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={SELLO_R} cy={SELLO_R} r={SELLO_R - 42} fill="none" stroke="rgba(20,18,15,0.14)" strokeWidth={2} />
        <circle
          cx={SELLO_R} cy={SELLO_R} r={SELLO_R - 16} fill="none" stroke={ACC} strokeWidth={13}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - dibuja)}
          transform={`rotate(-90 ${SELLO_R} ${SELLO_R})`}
          style={{ filter: `drop-shadow(0 5px 14px rgba(224,146,44,${(0.5 * dibuja).toFixed(2)}))` }}
        />
      </svg>
      {/* la CIFRA (≥140 px) con odómetro + la palabra DÍAS dentro del anillo */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: FF, fontSize: 184, fontWeight: 800, color: INK, lineHeight: 0.9,
          letterSpacing: "-0.06em", fontVariantNumeric: "tabular-nums",
          textShadow: "0 2px 0 rgba(255,255,255,0.8), 0 10px 26px rgba(20,18,15,0.22)",
          marginTop: -14,
        }}>{cuenta}</div>
        <div style={{
          fontFamily: FF, fontSize: 42, fontWeight: 800, color: MUTE, letterSpacing: "0.30em",
          marginTop: 2, marginRight: "-0.30em", opacity: ramp(f, at + 14, at + 26),
        }}>DÍAS</div>
      </div>
      {/* onda del estampado: se abre una vez y se apaga (nada de anillos eternos) */}
      {f >= at + 6 && f <= at + 34 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: d * (1 + ramp(f, at + 6, at + 34) * 0.42),
          height: d * (1 + ramp(f, at + 6, at + 34) * 0.42),
          transform: "translate(-50%,-50%)", borderRadius: "50%",
          border: `3px solid rgba(224,146,44,${((1 - ramp(f, at + 6, at + 34)) * 0.5).toFixed(3)})`,
        }} />
      )}
    </div>
  );
};

// ══ EL MURO 3D DE CASAS REALES — se ACUMULA, la cámara lo recorre ═════════════════════════════
type Carta = { src: string; x: number; y: number; z: number; w: number; h: number; rot: number; at: number; seq?: number; dur?: number };

/** El argumento del acto 2 no es "mirá esta casa": es "esto está en TODAS las casas". Por eso
 *  NINGUNA foto va sola a pantalla completa: las 12 tarjetas se ACUMULAN en un solo muro en
 *  arco 3D (siete planos de profundidad, de z −460 a +330) que la cámara recorre con un truck de
 *  x +520 a x −560. Las de clip van en su propio `<Sequence>` para que el video arranque en su
 *  frame 0 (si no, `OffthreadVideo` busca en `f/30` y CONGELA el último cuadro). */
const CARTAS: Carta[] = [
  // grupo A · las CASAS (137→230)
  { src: F_TECHO, x: -448, y: -167, z: -120, w: 430, h: 290, rot: 6, at: 170 },
  { src: F_GRIS, x: -28, y: 136, z: 60, w: 520, h: 345, rot: -4, at: 182 },
  { src: F_BANO_INOD, x: 420, y: -207, z: -60, w: 450, h: 300, rot: -7, at: 194 },
  { src: F_BANO_PARED, x: 830, y: 167, z: -260, w: 400, h: 270, rot: 5, at: 206 },
  { src: F_PLACARD, x: -830, y: 189, z: -300, w: 390, h: 260, rot: 8, at: 218 },
  { src: CLIP_MOHO, x: -1064, y: -207, z: -460, w: 380, h: 250, rot: 10, at: 0, seq: 174, dur: 200 },
  { src: CLIP_SALITRE, x: 1099, y: -220, z: -380, w: 370, h: 245, rot: -9, at: 0, seq: 200, dur: 150 },
  // grupo B · las PERSONAS señalando su propia pared (230→380)
  { src: F_SENOR, x: 210, y: -233, z: 190, w: 470, h: 315, rot: -3, at: 238 },
  { src: F_MUJER, x: 634, y: 207, z: 120, w: 460, h: 310, rot: 6, at: 256 },
  { src: CLIP_RINCON, x: -630, y: -268, z: -180, w: 400, h: 265, rot: 7, at: 0, seq: 246, dur: 120 },
  { src: F_HOMBRE, x: -396, y: 220, z: 225, w: 440, h: 300, rot: -6, at: 276 },
  { src: F_PLACARD, x: 1064, y: -53, z: 330, w: 300, h: 205, rot: -11, at: 316 },
];

const Muro: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  // TRUCK: la cámara recorre el muro. Easing NO constante (inOut cubic) y push que acelera.
  const truck = interpolate(ramp(f, 168, 356, Easing.inOut(Easing.cubic)), [0, 1], [380, -400]);
  const push = interpolate(ramp(f, 168, 340, Easing.out(Easing.quad)), [0, 1], [0.88, 1.06]);
  // salida: el muro se va al FONDO (no se desvanece: retrocede), y encima cae la oclusión
  const fuga = ramp(f, 356, 378, Easing.in(Easing.cubic));
  return (
    <div style={{
      position: "absolute", inset: 0, perspective: 2300, perspectiveOrigin: "50% 46%",
      transformStyle: "preserve-3d",
      transform: `translateX(${truck.toFixed(1)}px) scale(${(push * (1 - fuga * 0.42)).toFixed(4)}) translateZ(${(-700 * fuga).toFixed(0)}px)`,
      opacity: 1 - fuga * 0.9,
    }}>
      {CARTAS.map((c, i) => {
        if (c.seq !== undefined) {
          return (
            <Sequence key={i} from={c.seq} durationInFrames={c.dur} layout="none">
              <Plano z={c.z} x={c.x} y={c.y} desde={desde + c.seq} rot={c.rot}>
                <Tarjeta src={c.src} w={c.w} h={c.h} texto={false} seed={i * 7 + 2} z={c.z} at={0} />
                <Contacto w={c.w} y={c.h + 16} op={0.30 + (c.z + 500) / 2600} />
              </Plano>
            </Sequence>
          );
        }
        if (f < c.at - 1) return null;
        return (
          <Plano key={i} z={c.z} x={c.x} y={c.y} desde={desde} rot={c.rot}>
            <Tarjeta src={c.src} w={c.w} h={c.h} texto={false} seed={i * 7 + 2} z={c.z} at={c.at} />
            <Contacto w={c.w} y={c.h + 16} op={0.30 + (c.z + 500) / 2600} />
          </Plano>
        );
      })}
    </div>
  );
};

// ══ EL MOVIMIENTO ═════════════════════════════════════════════════════════════════════════════
export const Mov6Cierre: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);                     // ⛔ UNA sola cámara, función del frame GLOBAL

  // F0 · ZOOM-THROUGH de entrada: salimos de la pantalla de la laptop. No hay fade ni blur.
  const salidaZoom = 1 + (1 - ramp(f, A1, 18, Easing.out(Easing.poly(4)))) * 0.46;
  // push local del acto 1 que el acto 2 HEREDA y suelta (la cámara global nunca se reinicia)
  const pushA1 = ramp(f, 118, A2, Easing.in(Easing.cubic)) * 0.055;
  const suelta = 1 - ramp(f, A2, 165, Easing.out(Easing.cubic));
  // y mientras el círculo de F1 crece, el acto 1 es EMPUJADO hacia cámara: el mundo viejo se sale
  // de cuadro en vez de quedarse quieto esperando que lo tapen.
  const zA1 = salidaZoom * (1 + pushA1) * (1 + ramp(f, A2, 167, Easing.in(Easing.cubic)) * 0.14);

  // F1 · MATCH-SHAPE: el círculo nace DENTRO del anillo del sello y se come el cuadro
  const R = interpolate(f, [A2, 149, 167], [0, ANILLO_R, 2450], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const cx = SELLO_X + cam.panX * 6;
  const cy = SELLO_Y + cam.panY * 5;
  const anilloR = Math.max(ANILLO_R, R);
  const anilloW = interpolate(anilloR, [ANILLO_R, 900, 2450], [13, 6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anilloOp = 1 - ramp(anilloR, 1500, 2400);

  // acto 3 · el push que ACELERA (la energía sube y NO se estabiliza antes del corte)
  const pushA3 = 1 + ramp(f, A3, FIN, Easing.in(Easing.quad)) * 0.10;

  // F2 · OCLUSIÓN — el acto 3 no "aparece": se revela DETRÁS de la banda de revoque, siguiendo su
  // canto de fuga. La banda del `Occluder` (at 373, dur 14) es opaca entre el 14 % y el 86 % de su
  // ancho del 180 %, así que su borde izquierdo opaco va en `x + 25,2 %`; el revelado va 3 % por
  // DETRÁS de ese borde (`x + 22`) para que la línea del clip quede siempre tapada, incluso con la
  // banda inclinada 4°. ⛔ Sin esto el plate del cobro se vería "popear" antes de la cobertura.
  const bandaX = interpolate(f, [373, 387], [-160, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const revela = Math.max(0, Math.min(100, bandaX + 22));

  // LA MATERIA QUE CRUZA F2: la tarjeta puente. Se despega del muro en el 350, aterriza en el
  // centro-derecha, y bajo la oclusión su MARCO cambia de contenido (visita → billetes).
  const puente = ramp(f, 350, 378, Easing.inOut(Easing.cubic));
  const pw = interpolate(puente, [0, 1], [300, 620]);
  const ph = interpolate(puente, [0, 1], [205, 420]);
  const px = interpolate(puente, [0, 1], [1520 + 520, 430]);
  const py = interpolate(puente, [0, 1], [-60, 34]);
  const pz = interpolate(puente, [0, 1], [330, 150]);

  // DESPEJE: el cuadro queda LIMPIO desde el 477 (12 frames) y con la luz en el pico. Las piezas
  // se van por la IZQUIERDA y hacia cámara — nunca hacia la derecha, que es donde el vecino
  // siguiente pone su tarjeta de CTA.
  const despeje = ramp(f, 465, 477, Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {/* ════ ACTO 1 · frames 0–136 · LA GARANTÍA ════ */}
      {f < 170 && (
        <AbsoluteFill style={{ transform: `scale(${zA1.toFixed(4)})`, transformOrigin: "48% 44%" }}>
          {/* L1+L2+L3 · el curso abierto en la laptop, a sangre */}
          <Plate src={F_LAPTOP} desde={desde} profundidad={0.18} />
          <Grade p={1} fuerza={0.80} lado="izquierda" />

          <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "48% 46%", transform: cam.css }}>
            {/* L5 · la ficha de una clase real, flotando sobre la mesa (aparece en el 82:
                "verlo completo y decidir CON EL CURSO DELANTE TUYO") */}
            {f >= 80 && (
              <Plano z={-170} x={560} y={302} desde={desde} rot={-8}>
                <Tarjeta src={F_MEDIDOR} w={344} h={232} texto={false} seed={19} z={-170} at={82} />
                <Contacto w={344} y={248} op={0.42} />
              </Plano>
            )}

            {/* L7 · la ÚNICA idea de texto del acto, a la derecha sobre el lado ya hundido */}
            {/* cama de sombra del bloque de texto: sin ella el apoyo se pierde sobre el mantel */}
            <AbsoluteFill style={{
              background: "radial-gradient(44% 34% at 72% 48%, rgba(12,11,9,0.60) 0%, rgba(12,11,9,0) 74%)",
              pointerEvents: "none",
            }} />
            <Plano z={50} x={420} y={-18} desde={desde}>
              <div style={{ width: 820 }}>
                <Titular at={14} size={58} z={50}>Días de garantía</Titular>
                <div style={{
                  marginTop: 20, fontFamily: FF, fontSize: 33, fontWeight: 600, color: PAPER,
                  lineHeight: 1.36, textShadow: SOMBRA_TEXTO, maxWidth: 780,
                  opacity: ramp(f, 26, 40),
                  transform: `translateY(${((1 - ramp(f, 26, 40, Easing.out(Easing.cubic))) * 16).toFixed(1)}px)`,
                }}>
                  Entras, lo ves completo y decides con el curso delante tuyo.
                </div>
                <div style={{
                  marginTop: 24, height: 6, borderRadius: 3, background: ACC,
                  width: `${(ramp(f, 30, 58, Easing.out(Easing.cubic)) * 46).toFixed(1)}%`,
                  boxShadow: "0 6px 22px rgba(224,146,44,0.45)",
                }} />
              </div>
            </Plano>
          </AbsoluteFill>

          {/* L6 · EL SELLO: objeto sólido, centro FIJO (es el ancla del match-shape de F1) */}
          <div style={{
            position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)",
            filter: `drop-shadow(${(cam.panX * 2).toFixed(1)}px 26px 46px rgba(0,0,0,0.5))`,
          }}>
            <Sello at={3} />
          </div>
          <div style={{ position: "absolute", left: cx, top: cy + SELLO_R + 6, width: 1 }}>
            <Contacto w={SELLO_R * 2} y={0} op={0.5} />
          </div>
        </AbsoluteFill>
      )}

      {/* ════ ACTO 2 · frames 137–379 · LA HUMEDAD YA ESTÁ EN LAS CASAS ════
           Todo el acto vive DENTRO del círculo que nació en el anillo del sello (costura F1). */}
      {f >= A2 && f < 388 && (
        <AbsoluteFill style={{
          clipPath: f < 168 ? `circle(${R.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)` : undefined,
          transform: `scale(${(1 + pushA1 * suelta).toFixed(4)})`, transformOrigin: "48% 46%",
          overflow: "hidden",
        }}>
          {/* L1 · P2a — la mancha CIRCULAR de humedad del techo: la forma que calza con el anillo
              (clip 001: 210 frames reales, uso 96) */}
          <Sequence from={A2} durationInFrames={96} layout="none">
            <AbsoluteFill>
              <Plate src={CLIP_TECHO} desde={desde + A2} profundidad={0.22} />
              <Grade p={1} fuerza={0.86} />
            </AbsoluteFill>
          </Sequence>

          {/* L1 · P2b — la pared chorreada: entra en el 228 detrás del WIPE del sub-beat 230
              (clip 046: 186 frames reales, uso 156) */}
          <Sequence from={228} durationInFrames={160} layout="none">
            <AbsoluteFill>
              <Plate src={CLIP_CHORREO} desde={desde + 228} profundidad={0.3} />
              <Grade p={1} fuerza={0.94} lado="derecha" />
            </AbsoluteFill>
          </Sequence>

          {/* L5+L6 · EL MURO 3D que se ACUMULA (12 tarjetas, 7 planos de profundidad).
              ⛔ Arranca en el 168, cuando el círculo de F1 ya sangró: un `clipPath` NO recorta
              descendientes con `preserve-3d` (medido en render — las tarjetas se veían FUERA del
              círculo, como slabs pegados en las esquinas). Dentro del círculo sólo va el plate. */}
          {f >= 168 && <Muro desde={desde} />}

        </AbsoluteFill>
      )}

      {/* ════ L7 · la ÚNICA idea de texto del acto 2 ════
           ⛔ Va FUERA del `clipPath` del acto: adentro, el círculo de la costura F1 la cortaba por
           la mitad y se leía como un bug. Entra en el 166, cuando el círculo ya sangró. */}
      {f >= 164 && f < 376 && (
        <>
          {/* cama de sombra: el ámbar sobre revoque claro no se lee sin ella */}
          <AbsoluteFill style={{
            background: "radial-gradient(38% 26% at 22% 86%, rgba(12,11,9,0.66) 0%, rgba(12,11,9,0) 72%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", left: SAFE, bottom: 132,
            transform: `scale(1.4) translate(${(cam.panX * 3).toFixed(1)}px, ${(cam.panY * 2).toFixed(1)}px)`,
            transformOrigin: "0% 100%",
          }}>
            <Kicker at={166}>LA HUMEDAD YA ESTÁ EN LAS CASAS</Kicker>
            <div style={{
              marginTop: 12, height: 4, borderRadius: 2, background: ACC,
              width: `${(ramp(f, 172, 220, Easing.out(Easing.cubic)) * 430).toFixed(0)}px`,
              boxShadow: "0 4px 18px rgba(224,146,44,0.5)",
            }} />
          </div>
        </>
      )}

      {/* ════ EL ANILLO que cabalga el borde del círculo: la MATERIA de la costura F1 ════ */}
      {f >= A2 && f < 168 && anilloOp > 0.001 && (
        <div style={{
          position: "absolute", left: cx, top: cy, width: anilloR * 2, height: anilloR * 2,
          marginLeft: -anilloR, marginTop: -anilloR, borderRadius: "50%",
          border: `${anilloW.toFixed(2)}px solid rgba(224,146,44,${anilloOp.toFixed(3)})`,
          boxShadow: `0 0 ${(40 * anilloOp).toFixed(0)}px rgba(224,146,44,${(0.5 * anilloOp).toFixed(3)})`,
          pointerEvents: "none",
        }} />
      )}

      {/* ════ ACTO 3 · frames 380–489 · ALGUIEN VA A COBRAR ════ */}
      {f >= 373 && (
        <AbsoluteFill style={{
          transform: `scale(${pushA3.toFixed(4)})`, transformOrigin: "56% 48%",
          clipPath: revela < 100 ? `inset(0 ${(100 - revela).toFixed(2)}% 0 0)` : undefined,
        }}>
          {/* L1+L2+L3 · EL COBRO: los billetes cambiando de mano en la puerta de la casa */}
          <Plate src={F_COBRO} desde={desde + 373} profundidad={0.12} />
          <Grade p={1} fuerza={0.70} lado="izquierda" />

          <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "56% 46%", transform: cam.css }}>
            {/* L5 · dos ecos del muro MUY al fondo: los clientes que quedaron preguntando */}
            {[{ s: F_SENOR, x: -780, y: -372, z: -440, at: 386, rot: 9 },
              { s: F_MUJER, x: -860, y: 356, z: -420, at: 400, rot: 11 }].map((e, i) => (
              <Plano key={i} z={e.z} x={e.x} y={e.y} desde={desde} rot={e.rot}>
                <div style={{ opacity: (1 - despeje) * 0.5 }}>
                  <Tarjeta src={e.s} w={330} h={220} texto={false} seed={i * 5 + 41} z={e.z} at={e.at} />
                </div>
              </Plano>
            ))}

            {/* L7 · EL REMATE: frase cinética de dos líneas. Línea 1 palabra por palabra, y el
                chip ámbar como golpe final. Se va por la IZQUIERDA en el despeje. */}
            <Plano z={80} x={-330} y={20} desde={desde}>
              <div style={{
                width: 880,
                transform: `translateX(${(-despeje * 900).toFixed(0)}px)`,
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0 22px" }}>
                  {["Alguien", "va", "a", "cobrar"].map((w, i) => {
                    const at = 388 + i * 6;
                    const p = ramp(f, at, at + 9, Easing.out(Easing.cubic));
                    return (
                      <span key={i} style={{
                        fontFamily: FF, fontSize: 84, fontWeight: 700, color: PAPER,
                        letterSpacing: "-0.03em", lineHeight: 1.06, textShadow: SOMBRA_TEXTO,
                        opacity: p,
                        display: "inline-block",
                        transform: `translateY(${((1 - p) * 34).toFixed(1)}px) scale(${(0.94 + 0.06 * p).toFixed(3)})`,
                      }}>{w}</span>
                    );
                  })}
                </div>
                <div style={{ marginTop: 22 }}>
                  <ChipRemate at={414} />
                </div>
              </div>
            </Plano>

            {/* L6 · LA TARJETA PUENTE ya con su contenido nuevo: el balde de billetes.
                Mismo marco, misma posición, mismo tamaño que traía del acto 2.
                (clip 043: 210 frames reales, uso 99) */}
            <Sequence from={384} durationInFrames={99} layout="none">
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: `translate(-50%,-50%) translate3d(${(px + cam.panX * 9 + despeje * 260).toFixed(1)}px, ${(py + cam.panY * 7 - despeje * 90).toFixed(1)}px, ${(pz + despeje * 900).toFixed(0)}px) rotateY(${(cam.ry * 0.8 - 4).toFixed(2)}deg)`,
                transformStyle: "preserve-3d", opacity: 1 - ramp(f, 470, 477),
              }}>
                <Tarjeta src={CLIP_BILLETES} w={pw} h={ph} texto={false} seed={77} z={pz} at={0} />
                <Contacto w={pw} y={ph + 18} op={0.52} />
              </div>
            </Sequence>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ════ LA TARJETA PUENTE en el acto 2 (la materia que CRUZA F2) ════
           Se despega del muro en el 350 y viaja a su sitio; bajo la oclusión cambia de contenido. */}
      {f >= 314 && f < 384 && (
        <AbsoluteFill style={{ perspective: 2300, perspectiveOrigin: "50% 46%", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(-50%,-50%) translate3d(${(px + cam.panX * 9).toFixed(1)}px, ${(py + cam.panY * 7).toFixed(1)}px, ${pz.toFixed(0)}px) rotateY(${(cam.ry * 0.8 - 4 - (1 - puente) * 7).toFixed(2)}deg)`,
            transformStyle: "preserve-3d",
          }}>
            <Tarjeta src={F_VISITA} w={pw} h={ph} texto={false} seed={77} z={pz} at={316} />
            <Contacto w={pw} y={ph + 18} op={0.3 + 0.22 * puente} />
          </div>
        </AbsoluteFill>
      )}

      {/* ════ L4 · LA LUZ, UNA SOLA, QUE EVOLUCIONA EN LOS 489 FRAMES ════ */}
      <Luz />

      {/* ════ L8+L9 · ATMÓSFERA Y LENTE — montadas UNA vez, NUNCA se remontan entre actos ════ */}
      <Atmos desde={desde} polvo={1} bokeh={0.7} />

      {/* ════ LAS COSTURAS ════ */}
      {/* sub-beat @ 230 · WIPE POR MATERIA — vapor/agua fría cruza y detrás ya está la pared
          chorreada con las personas señalando (no es frontera de acto: es el giro del argumento) */}
      <WipeMateria at={224} dur={16} color="rgba(198,208,218,0.85)" />
      {/* F2 @ 380 · OCLUSIÓN — banda de REVOQUE (la materia de las paredes del acto 2).
          ⛔ NUNCA el color del fondo: con el del fondo no ocluye, hace un fundido a negro. */}
      <Occluder at={373} dur={14} material={REVOQUE} angulo={4} />
      {/* nota: F0 @ 0 es ZOOM-THROUGH y F1 @ 137 es MATCH-SHAPE: no llevan capa de transición,
          están implementadas en el movimiento mismo (`salidaZoom` / `R` + el anillo). */}

      {/* safe area: ninguna tipografía de este movimiento pisa los 96 px de borde */}
      <AbsoluteFill style={{ pointerEvents: "none", padding: SAFE }} />
    </AbsoluteFill>
  );
};

/** el chip ámbar del remate (≥88 px), con canto y sombra de objeto sólido. Entra con un golpe
 *  seco (scale desde 1,14) y no con un fade: es la última palabra del VSL antes de la pregunta. */
const ChipRemate: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 10, Easing.out(Easing.cubic));
  const golpe = Math.max(0, 1 - Math.abs(f - (at + 10)) / 10);
  return (
    <span style={{
      display: "inline-block", fontFamily: FF, fontSize: 96, fontWeight: 800,
      letterSpacing: "-0.028em", color: INK, background: ACC,
      padding: "10px 32px 18px", borderRadius: 16,
      opacity: f >= at ? 1 : 0,
      transform: `translateY(${((1 - p) * 26).toFixed(1)}px) scale(${(1.14 - 0.14 * p + golpe * 0.016).toFixed(4)}) rotate(${((1 - p) * -1.6).toFixed(2)}deg)`,
      boxShadow: [
        "inset 0 3px 0 rgba(255,255,255,0.5)",
        "0 4px 0 rgba(120,74,18,0.65)",
        "0 22px 48px rgba(0,0,0,0.5)",
        `0 0 ${(70 * golpe + 24).toFixed(0)}px rgba(224,146,44,${(0.30 + 0.3 * golpe).toFixed(2)})`,
      ].join(", "),
    }}>ESOS TRABAJOS.</span>
  );
};
