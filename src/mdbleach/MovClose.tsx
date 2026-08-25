// ════════════════════════════════════════════════════════════════════════════════════════════
//  MovClose.tsx — MOVIMIENTO 6 (CIERRE + CTA) del video `mdbleach` — canal Mike Dalton (EN).
//  ~1350 frames @ 30fps = 45 s. UN SOLO MOVIMIENTO CONTINUO en 6 actos que se FUNDEN.
//  ⛔ No es una sucesión de componentes: es UNA escena de 45 segundos.
//
//  LA IDEA: es el único movimiento del video que SALE HACIA ATRÁS. Veníamos metidos adentro del
//  tanque (MovRefill nos deja cerca y abajo, luz fría). Acá una página rompe la superficie del
//  agua, se abre en abanico y el cuadro se ABRE: mesa, puerta del mueble, teléfono, el código y
//  por fin la llave de paso. El video vuelve al centro y respira.
//
//  HILO CONDUCTOR (la materia que cruza TODAS las fronteras): LA PÁGINA.
//    página sumergida → carta delantera del mazo → abanico de 8 → la página que abrió Marlene →
//    la foto que ella mandó → la hoja pegada dentro de la puerta → el filete rojo del encabezado →
//    el aro rojo del código → y la mano que vuelve a la llave.
//
//  EL EMBUDO: ⛔ SIN precio y ⛔ SIN URL en pantalla. El link vive en la descripción. En pantalla
//  van las PÁGINAS con su tag de esquina (PAGE 03 · THE COMPLETE METHOD) y el QR. El deseo nace
//  del valor que el espectador YA está viendo.
//
// ════════════════════════════════════════════════════════════════════════════════════════════
//  TABLA DE HANDOFF   (cámara, luz y atmósfera son funciones del frame GLOBAL: nada se reinicia)
//  Fracciones de `durationInFrames` → con D=1350: A2=192 · A3=429 · A4=778 · A5=977 ·
//  QCUT=1073 · A6=1164.
// ════════════════════════════════════════════════════════════════════════════════════════════
//
//  ACTO 1 · LA PÁGINA SALE DEL AGUA · 0 → 0.142·D
//    enterFrom  cam { CAM_ARC[6].from = z .78, panX 12, panY 54, ry 2, rz .2 — metidos adentro
//                     del tanque, cerca y abajo, exactamente donde nos dejó MovRefill }
//               luz { 'cold' · key 0.18 (arriba-izquierda, la bombita) · intensity 1.16 }
//               materia { el agua negra del tanque (viene del movimiento anterior) }
//               encuadre { la página vive CORRIDA +212 px a la derecha para dejarle el tercio
//                          izquierdo al texto; vuelve al centro con la misma curva del abanico,
//                          así que en la FRONTERA 2 el desplazamiento ya es 0 }
//    exitTo     cam { la cámara ya empezó a retroceder: z .78→.73 }
//               luz { 'cold' todavía, key 0.18→0.26 }
//               materia { LA PÁGINA (lam_dilution) sostenida en el aire, a tamaño héroe }
//    ── FRONTERA 1 @ 0.142·D · MATCH-SHAPE ───────────────────────────────────────────────────
//       El MISMO nodo: la página héroe ES la carta delantera del mazo. Su caja se achica de
//       504×756 a 246×370 mientras SIETE cartas más salen de detrás de ella. Se elige
//       match-shape porque el concepto es literal — "eso que estabas mirando es una PÁGINA, y
//       hay siete más": el objeto no se reemplaza, se multiplica.
//
//  ACTO 2 · EL ABANICO DE 8 PÁGINAS · 0.142 → 0.318·D
//    enterFrom  cam { z ≈ .73, retrocediendo }
//               luz { fría, key 0.26 · intensity 1.06 }
//               materia { el mazo, con la página de dilución al frente }
//    exitTo     cam { z ≈ .63 }
//               luz { primer viraje tibio (t≈0.30), key 0.34 }
//               materia { el abanico se CIERRA de vuelta en la mano y la página de dilución se
//                         abalanza sobre la cámara }
//    ── FRONTERA 2 @ 0.318·D · OCLUSIÓN ──────────────────────────────────────────────────────
//       La página de dilución crece hasta ×9.4 y TAPA el 100% del cuadro con material real
//       (papel, no una banda de color); debajo va el <Occluder/> del Stage por si el papel deja
//       un borde. Detrás ya está la mesa de Marlene. Se elige oclusión porque es el único salto
//       de LUGAR duro del movimiento (el baño → la cocina de otra persona): hay que tapar.
//
//  ACTO 3 · MARLENE · 0.318 → 0.576·D   (sub-beats: la foto del antes @+150, la del después @+206)
//    enterFrom  cam { z ≈ .63 · la página llega a pantalla completa y se DESPLOMA sobre la mesa }
//               luz { tibia baja (t 0.30→0.62), key 0.40 · intensity 0.98 }
//               materia { la página de dilución, ahora abierta sobre la mesa }
//    exitTo     cam { z ≈ .50 · el eje ya viaja hacia la foto }
//               luz { tibia, key 0.52 · intensity 0.94 }
//               materia { LA FOTO de la taza limpia (h76) que ella mandó }
//    ── FRONTERA 3 @ 0.576·D · ZOOM-THROUGH ──────────────────────────────────────────────────
//       La cámara ENTRA en la foto de la taza limpia (into 70.5% / 42.5%) y sale del otro lado
//       en la puerta del mueble: la PORCELANA BLANCA se convierte en el PAPEL BLANCO de la hoja
//       pegada. Se elige zoom-through porque es de plano-producto a macro-de-papel y el blanco
//       de las dos superficies es el mismo: atravesamos, no cortamos.
//
//  ACTO 4 · IMPRIMILA Y PEGALA ADENTRO · 0.576 → 0.724·D
//    enterFrom  cam { llegamos desde el fondo (translateZ -900 → 0), sin frenar de golpe }
//               luz { tibia, key 0.52 · intensity 0.94 }
//               materia { el blanco de la porcelana = el papel de la hoja (lam_nevermix) }
//    exitTo     cam { la cámara ya PANEA hacia la derecha }
//               luz { key 0.62 · intensity 0.98 }
//               materia { EL FILETE ROJO del encabezado, que se despega de la hoja }
//    ── FRONTERA 4 @ 0.724·D · MATCH-MOVE ────────────────────────────────────────────────────
//       Nadie frena: la puerta del mueble sale por la izquierda y el teléfono entra por la
//       derecha con EL MISMO vector y el mismo easing, mientras el filete rojo viaja entre los
//       dos. El contenido cambia DETRÁS de un movimiento que ya estaba andando. Se elige
//       match-move porque la cámara ya venía paneando: frenar para cortar delataría el montaje.
//
//  ACTO 5 · EL CÓDIGO · 0.724 → 0.862·D
//    ── SUB-FRONTERA @ 0.795·D · CORTE EN EL BEAT ("point your phone camera at the code") ─────
//       1 frame, seco: la placa del teléfono desaparece y EN SU MISMO RECTÁNGULO de pantalla
//       (mismo centro, misma altura) aparece la tarjeta blanca del QR. 18 frames de asentado y
//       después ⛔ QUIETO HASTA EL FINAL. Se elige corte en el beat porque encuadre, escala y luz
//       calzan: el teléfono no "se transforma", ES el código.
//    enterFrom  cam { z ≈ .43 }   luz { key 0.62 → 0.68 · intensity 0.98 }
//    exitTo     cam { z ≈ .41 }   materia { EL QR, que ya no se mueve más }
//    ⚠️ El QR vive FUERA del mundo 3D, en una capa de pantalla con zIndex 60: cero perspectiva,
//       cero deriva, cero partículas encima. Un QR con parallax no se escanea.
//    ── FRONTERA 5 @ 0.862·D · WIPE POR MATERIA (localizado) ──────────────────────────────────
//       El vapor del baño cruza SÓLO el tercio izquierdo (clip-path al 42% del cuadro) y detrás
//       ya está la mano con el frasco. Se elige wipe por materia porque es la única costura que
//       no toca al QR: el código queda intacto, quieto y escaneable mientras el cuadro cambia.
//
//  ACTO 6 · EL FRASCO Y LA LLAVE · 0.862 → 1.0·D
//    ── SUB-BEAT interno · MATCH-SHAPE ("it wins because it is still there") ──────────────────
//       La MISMA placa cambia de material: el frasco marrón girando en su palma (clip) pasa a
//       ser su mano de vuelta en la llave de paso. Es la misma mano: el objeto no se reemplaza.
//    enterFrom  cam { z ≈ .41, aterrizando }   luz { cálida, key 0.68 · intensity 1.04 }
//    exitTo     CAM_ARC[6].to = { z .40, panX 0, panY 0, ry 0, rz 0 } · luz 'warm' · último frame
//               ENCENDIDO: el QR quieto a la derecha, la llave cerrándose a la izquierda.
//               ⛔ `stageCam` NO se pisa al final: aterriza sola.
//
//  QR QUIETO: de QCUT+18 (frame 1091 con D=1350) hasta el último frame = 259 frames = 8,6 s
//  sin una sola transformación encima. Muy por encima del piso de 4 s.
//
//  EL AVATAR: este movimiento lo TAPA ENTERO los 45 s (fondo opaco). Motivo: el QR tiene que ser
//  grande, quieto y con blanco puro alrededor para que una cámara de teléfono lo lea; devolver
//  el avatar debajo del CTA lo ensuciaría. ⛔ No hay ninguna ventana de avatar acá.
//
//  ⛔ Sin Math.random / Date.now / new Date (todo sale de `rnd(i)`) · sin backdrop-filter · sin
//  ⛔ blur grande a pantalla completa · sin fades de cuadro entero en las fronteras · sin precio
//  ⛔ ni URL en pantalla · sin Easing.quint (no existe) · imports SÓLO de remotion/react/./Stage.
// ════════════════════════════════════════════════════════════════════════════════════════════

import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  MD,
  F_SANS,
  F_SERIF,
  rgba,
  lerp,
  clamp01,
  rnd,
  Atmos,
  Kicker,
  TextBed,
  Occluder,
  VaporWipe,
  stageCam,
  movLight,
  Space3D,
  GlassPlate,
  Fan3D,
  ZoomThrough,
  Motes,
} from "./Stage";

/* ── utilidades locales ─────────────────────────────────────────────────────────────────── */
const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ID = (x: number) => x;
const ip = (f: number, inR: number[], outR: number[], e: (x: number) => number = ID) =>
  interpolate(f, inR, outR, { ...CL, easing: e });

const E_SOFT = Easing.bezier(0.22, 0.61, 0.28, 1);
const E_SNAP = Easing.bezier(0.62, 0.02, 0.12, 1);
const E_OVER = Easing.bezier(0.2, 1.42, 0.32, 1); // overshoot sin Easing.back
const E_OUT = Easing.out(Easing.cubic);
const E_IN = Easing.in(Easing.cubic);
const E_LONG = Easing.bezier(0.16, 0.84, 0.24, 1); // sale rápido, se asienta lento

/* ── MATERIAL REAL (rutas hardcodeadas: el build las tiene que sumar al tarball) ──────────── */
const LAM = {
  routine: "img/mdbleach_lam_routine.jpg",
  whybleach: "img/mdbleach_lam_whybleach.jpg",
  nevermix: "img/mdbleach_lam_nevermix.jpg",
  smeartest: "img/mdbleach_lam_smeartest.jpg",
  poultice: "img/mdbleach_lam_poultice.jpg",
  tankmap: "img/mdbleach_lam_tankmap.jpg",
  storage: "img/mdbleach_lam_storage.jpg",
  dilution: "img/mdbleach_lam_dilution.jpg",
};
const REAL = {
  tape: "img/mdbleach_h73_tapechart.jpg",
  phone: "img/mdbleach_h74_phonecode.jpg",
  valve: "img/mdbleach_h75_valveclose_final.jpg",
  bowl: "img/mdbleach_h76_cleanbowl.jpg",
  mold: "img/mdbleach_h46_patchymold.jpg",
  bottle: "broll/mdbleach_h05_bottlepalm.mp4",
  qr: "img/mdbleach_qrcard.jpg",
};

/* Geometría del mazo. La carta 7 (dilución) es la DELANTERA: en `Fan3D` el último item queda
   al frente y con `lag` 1.0 → se mueve MÁS que las traseras (el desfase que da grosor). */
const CARD_W = 246;
const CARD_H = 370; // 2:3, como las láminas (1024×1536)
const FAN_SPREAD = 166;
const FAN_ARC = 7;
const HERO_SCALE = 1.86; // ACTO 1: 246×370 × 1.86 = 458×688 → página héroe, entera en cuadro
const DECK_SCALE = 0.92; // ACTO 2: el abanico abierto entra cómodo en la safe area
const LUNGE_SCALE = 1.5; // en la frontera 2 el mazo vuelve a tamaño medio antes del embate

const PAGES: { src: string; n: string; t: string }[] = [
  { src: LAM.routine, n: "01", t: "The weekly routine" },
  { src: LAM.whybleach, n: "02", t: "Why bleach fails" },
  { src: LAM.nevermix, n: "04", t: "Never-mix chart" },
  { src: LAM.smeartest, n: "05", t: "The smear test" },
  { src: LAM.poultice, n: "06", t: "The poultice" },
  { src: LAM.tankmap, n: "07", t: "Inside the tank" },
  { src: LAM.storage, n: "08", t: "How to store it" },
  { src: LAM.dilution, n: "03", t: "Dilution + tank" }, // ← la delantera: la que abrió Marlene
];

/* ════════════════════════════════════════════════════════════════════════════════════════════
   TIPOGRAFÍA — palabra por palabra, nunca un opacity global sobre el bloque.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const Words: React.FC<{
  f: number;
  at: number;
  text: string;
  size: number;
  color?: string;
  step?: number;
  weight?: number;
  serifOn?: string[];
  accent?: string;
}> = ({ f, at, text, size, color = MD.white, step = 3.4, weight = 800, serifOn = [], accent = MD.redHot }) => (
  <div style={{ fontFamily: F_SANS, fontWeight: weight, fontSize: size, lineHeight: 1.05, color }}>
    {text.split(" ").map((w, i) => {
      const a = at + i * step;
      const o = ip(f, [a, a + 8], [0, 1], E_OUT);
      const dy = ip(f, [a, a + 12], [size * 0.26, 0], E_OUT);
      const isSerif = serifOn.indexOf(w.replace(/[.,]/g, "")) >= 0;
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: size * 0.24,
            opacity: o,
            transform: `translateY(${dy.toFixed(2)}px)`,
            fontFamily: isSerif ? F_SERIF : F_SANS,
            fontStyle: isSerif ? "italic" : "normal",
            fontWeight: isSerif ? 500 : weight,
            color: isSerif ? accent : color,
            textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.85)",
          }}
        >
          {w}
        </span>
      );
    })}
  </div>
);

/* Sombra de contacto que ATERRIZA (elipse por gradiente — ⛔ nada de filter:blur). */
const Contact: React.FC<{ w: number; h: number; x?: number; y: number; o: number }> = ({ w, h, x = 0, y, o }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: w,
      height: h,
      transform: `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0px)`,
      background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${o}) 0%, rgba(0,0,0,0) 72%)`,
      pointerEvents: "none",
    }}
  />
);

/* El TAG de pertenencia de una página. Es HTML de verdad (tipografía real, cero riesgo de
   errata del generador de imágenes) y dice lo que la página ES: parte de la guía. */
const PageTag: React.FC<{ n: string; t: string; o: number; big?: boolean }> = ({ n, t, o, big = false }) => (
  <div style={{ opacity: o, transform: `translateY(${((1 - o) * 12).toFixed(1)}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: big ? 12 : 8 }}>
      <div style={{ width: big ? 34 : 20, height: 3, background: MD.red, borderRadius: 2 }} />
      <div
        style={{
          fontFamily: F_SANS,
          fontWeight: 800,
          fontSize: big ? 21 : 16,
          letterSpacing: big ? 2.6 : 1.8,
          color: MD.white,
          textTransform: "uppercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
        }}
      >
        {`page ${n}`}
      </div>
    </div>
    <div
      style={{
        marginTop: big ? 8 : 5,
        marginLeft: big ? 46 : 28,
        fontFamily: F_SERIF,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: big ? 26 : 17,
        color: rgba(MD.bone, 0.84),
        textShadow: "0 2px 12px rgba(0,0,0,0.9)",
      }}
    >
      {big ? "The Complete Method" : t}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 1 — EL AGUA DEL TANQUE. Es lo que había antes: no se monta un fondo nuevo, se DEJA IR.
   La superficie baja y sale por abajo del cuadro; nunca se apaga con un fade.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const TankWater: React.FC<{ f: number; A2: number; shift: number }> = ({ f, A2, shift }) => {
  const sink = ip(f, [A2 - 70, A2 + 12], [0, 1], E_IN);
  const y = sink * 780;
  const wob = Math.sin(f / 26) * 3.2 + Math.sin(f / 41) * 1.8;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform: `translate3d(${shift.toFixed(1)}px, ${(y + wob).toFixed(2)}px, 40px)`,
        pointerEvents: "none",
      }}
    >
      {/* el cuerpo de agua: negro que se traga la mitad baja del cuadro */}
      <div
        style={{
          position: "absolute",
          left: "-24%",
          right: "-24%",
          top: "63%",
          height: "78%",
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(MD.ink0, 0.9)} 9%, ${MD.ink0} 40%)`,
        }}
      />
      {/* el menisco: la línea especular fría donde la página rompe la superficie */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: "63%",
          height: 3,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(MD.cold, 0.5)} 26%, ${rgba(
            MD.white,
            0.72,
          )} 50%, ${rgba(MD.cold, 0.5)} 74%, rgba(255,255,255,0) 100%)`,
          boxShadow: `0 0 26px ${rgba(MD.cold, 0.4)}`,
        }}
      />
      {/* ondas concéntricas: la página acaba de atravesar el agua */}
      {Array.from({ length: 4 }, (_, i) => {
        const born = 6 + i * 17;
        const q = ip(f, [born, born + 96], [0, 1], E_OUT);
        if (q <= 0 || q >= 1) return null;
        const w = 210 + q * 980;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "63%",
              width: w,
              height: w * 0.16,
              marginLeft: -w / 2,
              marginTop: -w * 0.08,
              borderRadius: "50%",
              border: `2px solid ${rgba(MD.cold, (1 - q) * 0.3)}`,
              borderTopColor: rgba(MD.white, (1 - q) * 0.16),
            }}
          />
        );
      })}
      {/* gotas que bajan por el borde de la página recién salida */}
      {Array.from({ length: 7 }, (_, i) => {
        const s = rnd(i * 5.3);
        const born = 14 + s * 60;
        const q = ip(f, [born, born + 70 + s * 40], [0, 1], E_IN);
        if (q <= 0 || q >= 1) return null;
        return (
          <div
            key={`d${i}`}
            style={{
              position: "absolute",
              left: `${43 + s * 14}%`,
              top: `${30 + q * 34}%`,
              width: 2,
              height: 12 + s * 16,
              borderRadius: 2,
              background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(MD.white, 0.4 * (1 - q))} 60%, ${rgba(
                MD.cold,
                0.5 * (1 - q),
              )} 100%)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTOS 1+2 — EL MAZO. UN SOLO NODO que atraviesa la FRONTERA 1: en el acto 1 está cerrado y
   escalado a tamaño héroe (es "la página"), en el acto 2 se abre en abanico de 8.
   ⛔ Por eso la costura no se puede ver: no hay dos objetos, hay uno.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const PageDeck: React.FC<{ f: number; A2: number; A3: number; shift: number }> = ({ f, A2, A3, shift }) => {
  // apertura: el abanico se abre… y en la frontera 2 se CIERRA de vuelta en la mano
  const openA = ip(f, [A2 - 24, A2 + 106], [0.07, 1], E_LONG);
  const closeA = ip(f, [A3 - 78, A3 - 34], [0, 1], E_SNAP);
  const open = openA * (1 - closeA);
  // ⚠️ En los 36 frames previos a la FRONTERA 2 el mazo DEJA de respirar: la página del acto 3
  // arranca exactamente sobre la carta delantera y un bob de 5 px delataría el doble borde.
  const settle = 1 - ip(f, [A3 - 72, A3 - 36], [0, 1], E_SOFT);

  // escala del contenedor: héroe → abanico → tamaño medio justo antes del embate
  const scale = ip(
    f,
    [0, A2 - 26, A2 + 110, A3 - 78, A3 - 34],
    [HERO_SCALE, HERO_SCALE * 0.99, DECK_SCALE, DECK_SCALE * 1.06, LUNGE_SCALE],
    E_SOFT,
  );

  // la salida del agua (acto 1) + respiración propia del objeto. En el frame 0 la página ya
  // está rompiendo la superficie: ⛔ nada de dos segundos subiendo desde negro.
  const rise = ip(f, [0, 84], [300, 0], E_OUT);
  const bob = (Math.sin(f / 38) * 3.4 + Math.sin(f / 77) * 2.1) * settle;
  const tilt = (ip(f, [0, 92], [-5.4, 0], E_OUT) + Math.sin(f / 64) * 0.42) * settle;

  // los rótulos de cada carta sólo existen cuando el abanico está abierto
  const labO = clamp01(ip(f, [A2 + 26, A2 + 78], [0, 1], E_OUT) * (1 - closeA));
  // el tag héroe del acto 1 se DESPEGA hacia arriba (geometría, no fade de cuadro)
  const heroO = ip(f, [26, 44, A2 - 16, A2 - 2], [0, 1, 1, 0], E_SOFT);
  const heroY = ip(f, [A2 - 16, A2 + 6], [0, -78], E_IN);

  // la carta delantera (i = 7) según la fórmula exacta de `Fan3D`, para colgarle el tag héroe
  const c = 3.5;
  const fx = c * FAN_SPREAD * open;
  const fy = c * 12 * open;
  const fz = open * 40 * (1 - c / PAGES.length);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform: `translate3d(${shift.toFixed(1)}px, ${(rise + bob).toFixed(2)}px, 0px) rotateZ(${tilt.toFixed(
          3,
        )}deg) scale(${scale.toFixed(4)})`,
      }}
    >
      {/* sombra de contacto del mazo: crece y se aclara a medida que se abre */}
      <Contact w={CARD_W * (1.4 + open * 5.6)} h={92 + open * 26} y={CARD_H * 0.62} o={0.5 - open * 0.22} />

      <Fan3D
        items={PAGES.map((pg) => ({
          src: pg.src,
          label: <PageTag n={pg.n} t={pg.t} o={labO} />,
        }))}
        open={open}
        w={CARD_W}
        h={CARD_H}
        spread={FAN_SPREAD}
        arc={FAN_ARC}
        sheenAt={A2 + 34}
      />

      {/* ACTO 1 · el tag héroe, ANCLADO al ángulo superior izquierdo de la página y siguiéndola.
          Contra-escalado 1/HERO_SCALE para que la tipografía salga al tamaño de diseño, y con
          cama oscura propia: la lámina es papel claro y el blanco sobre blanco no se lee. */}
      {heroO > 0.002 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 400,
            transformOrigin: "0% 0%",
            transform:
              `translate3d(${(fx - CARD_W / 2 + 18).toFixed(1)}px, ` +
              `${(fy - CARD_H / 2 + 18 + heroY).toFixed(1)}px, ${(fz + 8).toFixed(1)}px) ` +
              `scale(${(1 / HERO_SCALE).toFixed(4)})`,
            pointerEvents: "none",
            clipPath: `inset(0 0 ${ip(f, [A2 - 14, A2 + 2], [0, 100], E_IN).toFixed(1)}% 0)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "14px 20px 16px 18px",
              borderRadius: 10,
              background: "linear-gradient(180deg, rgba(6,6,8,0.88) 0%, rgba(6,6,8,0.62) 100%)",
              boxShadow: "0 16px 44px rgba(0,0,0,0.6)",
            }}
          >
            <PageTag n="03" t="" o={heroO} big />
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 — MARLENE. La página que se abalanzó sobre la cámara se DESPLOMA sobre una mesa de
   cocina y ahí se arma la historia: el antes (macro de la mancha) y el después (la foto que
   ella mandó). Aire: 11,6 s. Es el corazón del CTA y no se atropella.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const Act3Marlene: React.FC<{ f: number; A3: number; A4: number; warm: string }> = ({ f, A3, A4, warm }) => {
  // ── el embate (frontera 2) y el aterrizaje: MISMO objeto, una sola curva de escala
  // ⚠️ La caja de arranque (369×555) es EXACTAMENTE la carta delantera del mazo a LUNGE_SCALE
  // (246×370 × 1.5). Por eso en el frame A3-34 los dos objetos son el mismo píxel.
  const lunge = ip(f, [A3 - 34, A3 - 5], [1, 9.4], E_IN);
  const land = ip(f, [A3 + 3, A3 + 78], [0, 1], E_LONG);
  const pScale = lerp(lunge, 0.79, land); // 380×572 × 0.79 = 300×452
  const pX = ip(f, [A3 + 6, A3 + 84], [0, -430], E_LONG);
  const pY = ip(f, [A3 + 6, A3 + 84], [0, -140], E_LONG);
  const pRx = ip(f, [A3 + 3, A3 + 44, A3 + 96], [0, 54, 15], E_LONG);
  // la respiración de la página arranca en 0 y sólo despierta DESPUÉS de aterrizar en la mesa
  const alive = ip(f, [A3 + 10, A3 + 80], [0, 1], E_SOFT);
  const pRz = ip(f, [A3 + 6, A3 + 96], [0, -2.6], E_LONG) + Math.sin(f / 71) * 0.34 * alive;
  const pDrift = Math.sin((f - A3) / 44) * 2.6 * alive;

  // ── la mesa: llega desde abajo mientras la página cae (estructura, no protagonista)
  const tab = ip(f, [A3 + 26, A3 + 96], [0, 1], E_OUT);

  // ── EL ANTES: el macro de la mancha, la foto vieja del problema
  const B0 = A3 + 150;
  const bIn = ip(f, [B0, B0 + 26], [0, 1], E_OVER);
  // ── EL DESPUÉS: la foto que ella mandó. Cae ENCIMA del antes: el gesto entero de la historia.
  const A0 = A3 + 206;
  const aIn = ip(f, [A0, A0 + 30], [0, 1], E_OVER);

  // la mesa y todo el acto se van hacia atrás cuando la cámara se mete en la foto
  const goo = ip(f, [A4 - 34, A4 - 12], [0, 1], E_SOFT);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform: `translateZ(${(goo * 90).toFixed(1)}px)`,
      }}
    >
      {/* la mesa de la cocina: un plano tumbado con un lustre cálido. ESTRUCTURA. */}
      {tab > 0.002 && (
        <div
          style={{
            position: "absolute",
            left: "-30%",
            right: "-30%",
            top: "52%",
            height: "86%",
            transformStyle: "preserve-3d",
            transform: `translateY(${((1 - tab) * 420).toFixed(1)}px) rotateX(74deg)`,
            transformOrigin: "50% 0%",
            background:
              `linear-gradient(180deg, ${rgba("#241C14", 0.96)} 0%, ${rgba("#140F0A", 0.98)} 46%, ${MD.ink0} 100%)`,
            boxShadow: `inset 0 2px 0 ${rgba(warm, 0.22)}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(46% 40% at 34% 6%, ${rgba(warm, 0.2)} 0%, rgba(0,0,0,0) 70%)`,
            }}
          />
        </div>
      )}

      {/* LA PÁGINA — el mismo papel que venía volando */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform:
            `translate3d(${(pX + pDrift).toFixed(1)}px, ${pY.toFixed(1)}px, 0px) ` +
            `rotateX(${pRx.toFixed(2)}deg) rotateZ(${pRz.toFixed(2)}deg) scale(${pScale.toFixed(4)})`,
        }}
      >
        {/* 380×572 = la carta delantera (369×555) + 3%: cubre de sobra el borde de la carta que
            queda debajo durante los ~14 frames en que los dos objetos coexisten. */}
        <GlassPlate
          src={LAM.dilution}
          w={380}
          h={572}
          radius={6}
          lit={0.72}
          sheenAt={A3 + 118}
          z={30}
        />
      </div>

      {/* rótulo de pertenencia de la página abierta — ARRIBA de la página: abajo vive el texto */}
      {land > 0.9 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%,-50%) translate3d(${(-430 + pDrift).toFixed(1)}px, -386px, 40px)`,
            pointerEvents: "none",
          }}
        >
          <PageTag n="03" t="Dilution + tank · same page" o={ip(f, [A3 + 92, A3 + 118], [0, 1], E_OUT)} />
        </div>
      )}

      {/* EL ANTES — macro de la mancha negra, apoyado más atrás */}
      {bIn > 0.002 && (
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          <Contact w={330} h={70} x={150} y={122} o={0.5 * bIn} />
          <GlassPlate
            src={REAL.mold}
            w={300}
            h={200}
            x={150}
            y={ip(bIn, [0, 1], [82, 10], ID)}
            z={-40}
            ry={7}
            rz={-3.4 + Math.sin(f / 83) * 0.4}
            radius={5}
            lit={0.42}
            opacity={clamp01(bIn * 1.6)}
            focusX={52}
            focusY={50}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%,-50%) translate3d(190px, 136px, -38px)`,
              opacity: ip(f, [B0 + 22, B0 + 40], [0, 1], E_OUT),
              fontFamily: F_SANS,
              fontWeight: 800,
              fontSize: 19,
              letterSpacing: 2.4,
              color: rgba(MD.redHot, 0.92),
              textTransform: "uppercase",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            two years · told to replace it
          </div>
        </div>
      )}

      {/* EL DESPUÉS — la foto que ella mandó. Aterriza sobre el antes. */}
      {aIn > 0.002 && (
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          <Contact w={620} h={92} x={340} y={148} o={0.56 * aIn} />
          <GlassPlate
            src={REAL.bowl}
            w={560}
            h={374}
            x={340}
            y={ip(aIn, [0, 1], [-260, -70], ID)}
            z={120}
            ry={-9}
            rx={ip(aIn, [0, 1], [16, 4], ID)}
            rz={2.2 + Math.sin(f / 67) * 0.5}
            radius={7}
            lit={0.78}
            sheenAt={A0 + 34}
            opacity={clamp01(aIn * 1.8)}
            focusX={50}
            focusY={54}
          >
            {/* el brillo de la porcelana limpia: es lo que la cámara va a atravesar */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(42% 46% at 52% 44%, ${rgba(MD.white, 0.16 * aIn)} 0%, rgba(0,0,0,0) 68%)`,
              }}
            />
          </GlassPlate>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 4 — LA HOJA PEGADA DENTRO DE LA PUERTA. Llegamos ATRAVESANDO la porcelana blanca de la
   foto: el blanco de la taza es el blanco del papel. Protagonista: la hoja imprimible.
   ⛔ Sin precio, sin link: sólo la hoja y lo que trae adentro.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const ROUTINE_ROWS = [
  { k: "01", a: "Turn the water off", b: "the little valve, behind the bowl" },
  { k: "02", a: "Empty the bowl", b: "flush and hold the handle down" },
  { k: "03", a: "Treat what you can touch", b: "under the rim, then the tank" },
  { k: "04", a: "Give it a week", b: "brush it, come back, check" },
];

const Act4Sheet: React.FC<{ f: number; A4: number; A5: number; warm: string }> = ({ f, A4, A5, warm }) => {
  // llegamos desde el fondo del zoom-through, sin frenar de golpe
  const arrive = ip(f, [A4 - 22, A4 + 54], [0, 1], Easing.bezier(0.12, 0.72, 0.2, 1));
  // MATCH-MOVE de salida: todo el acto se va por la izquierda con el vector de la cámara
  const leave = ip(f, [A5 - 30, A5 + 18], [0, 1], E_LONG);
  const lx = -leave * 1180;
  const drift = Math.sin(f / 59) * 3.1;

  const sheetIn = ip(f, [A4 + 10, A4 + 46], [0, 1], E_OUT);
  const tape = ip(f, [A4 + 42, A4 + 70], [0, 1], E_OVER);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        transform:
          `translate3d(${(lx + drift).toFixed(1)}px, 0px, ${lerp(-900, 0, arrive).toFixed(1)}px) ` +
          `rotateY(${((1 - arrive) * 5.2 - leave * 6).toFixed(2)}deg)`,
      }}
    >
      {/* LA PUERTA DEL MUEBLE: la foto real de sus manos pegando la hoja, al fondo */}
      <GlassPlate
        src={REAL.tape}
        w={1500}
        h={1000}
        z={-320}
        ry={3}
        radius={4}
        lit={0.34}
        focusX={50}
        focusY={46}
        opacity={0.88}
      />
      {/* madera del interior de la puerta: sombra que hunde el fondo y aterriza la hoja */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "translateZ(-300px)",
          background: `radial-gradient(66% 60% at 40% 44%, rgba(0,0,0,0) 0%, ${rgba(MD.ink0, 0.82)} 82%)`,
        }}
      />

      {/* LA HOJA — el protagonista del acto */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        <Contact w={430} h={80} x={-360} y={210} o={0.56 * sheetIn} />
        <GlassPlate
          src={LAM.nevermix}
          w={330}
          h={495}
          x={-360}
          y={ip(sheetIn, [0, 1], [-94, -70], E_OUT)}
          z={140}
          rz={-2.2 + Math.sin(f / 74) * 0.36}
          ry={ip(sheetIn, [0, 1], [7, 2.4], ID)}
          radius={5}
          lit={0.86}
          sheenAt={A4 + 62}
          opacity={clamp01(sheetIn * 2)}
        />
        {/* EL FILETE ROJO del encabezado — la materia que va a cruzar la frontera 4 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: ip(f, [A4 + 16, A4 + 44], [0, 300], E_OUT),
            height: 5,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${MD.red}, ${rgba(MD.red, 0.25)})`,
            boxShadow: `0 0 18px ${rgba(MD.red, 0.62)}`,
            transform: `translate(-50%,-50%) translate3d(-360px, -322px, 148px)`,
          }}
        />
        {/* las dos cintas: brillo real de cinta, no un rectángulo plano */}
        {[-1, 1].map((s) => (
          <div
            key={s}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 96,
              height: 30,
              transform:
                `translate(-50%,-50%) translate3d(${(-360 + s * 128).toFixed(0)}px, -308px, 158px) ` +
                `rotateZ(${(s * 9 - 2).toFixed(1)}deg) scaleX(${tape.toFixed(3)})`,
              background: `linear-gradient(180deg, ${rgba(MD.bone, 0.34)} 0%, ${rgba(MD.white, 0.18)} 42%, ${rgba(
                MD.bone,
                0.28,
              )} 100%)`,
              boxShadow: `0 4px 12px rgba(0,0,0,.5), inset 0 1px 0 ${rgba(MD.white, 0.4)}`,
              opacity: 0.9 * tape,
            }}
          />
        ))}
      </div>

      {/* EL RIEL de la rutina: lo que la hoja trae adentro. ESTRUCTURA colgada de una línea. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 560,
          transform: `translate(-50%,-50%) translate3d(330px, -18px, 90px)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -26,
            top: 0,
            width: 4,
            height: `${ip(f, [A4 + 34, A4 + 92], [0, 100], E_OUT).toFixed(1)}%`,
            background: `linear-gradient(180deg, ${MD.red}, ${rgba(warm, 0.5)})`,
            borderRadius: 3,
            boxShadow: `0 0 22px ${rgba(MD.red, 0.5)}`,
          }}
        />
        {ROUTINE_ROWS.map((r, i) => {
          const a = A4 + 46 + i * 16;
          const o = ip(f, [a, a + 16], [0, 1], E_OUT);
          const dx = ip(f, [a, a + 20], [-34, 0], E_OUT);
          return (
            <div
              key={r.k}
              style={{
                marginBottom: 22,
                opacity: o,
                transform: `translateX(${dx.toFixed(1)}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: F_SANS,
                  fontWeight: 800,
                  fontSize: 22,
                  color: rgba(MD.red, 0.95),
                  letterSpacing: 1,
                  minWidth: 34,
                }}
              >
                {r.k}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F_SANS,
                    fontWeight: 800,
                    fontSize: 34,
                    color: MD.white,
                    textShadow: "0 4px 20px rgba(0,0,0,.9)",
                  }}
                >
                  {r.a}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontFamily: F_SERIF,
                    fontStyle: "italic",
                    fontSize: 22,
                    color: rgba(MD.bone, 0.62),
                    textShadow: "0 2px 12px rgba(0,0,0,.9)",
                  }}
                >
                  {r.b}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 5 — EL TELÉFONO. Entra por la derecha con el MISMO vector con el que la puerta sale por
   la izquierda (match-move), trayendo el filete rojo. En el beat, corte seco: su rectángulo se
   vuelve el código. El QR NO vive acá: vive en la capa de pantalla (ver `QrStill`).
   ════════════════════════════════════════════════════════════════════════════════════════ */
const Act5Phone: React.FC<{ f: number; A5: number; QCUT: number }> = ({ f, A5, QCUT }) => {
  const enter = ip(f, [A5 - 30, A5 + 18], [0, 1], E_LONG);
  const x = lerp(1180, 310, enter);
  const drift = Math.sin(f / 57) * 3.1;
  const lift = Math.sin((f - A5) / 34) * 4;
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <Contact w={600} h={92} x={x + drift} y={188} o={0.5 * enter} />
      <GlassPlate
        src={REAL.phone}
        w={500}
        h={334}
        x={x + drift}
        y={-24 + lift}
        z={60}
        ry={lerp(-16, -6, enter)}
        rz={lerp(-3.4, 1.4, enter)}
        radius={10}
        lit={0.82}
        sheenAt={A5 + 22}
        focusX={50}
        focusY={44}
      />
      {/* el filete rojo llega desde la hoja del acto 4 y se acuesta bajo la placa:
          en el corte, ese mismo rojo pasa a ser el aro de la tarjeta del código */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: ip(f, [A5 - 26, A5 + 22], [300, 452], E_LONG),
          height: 5,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${rgba(MD.red, 0.2)}, ${MD.red} 40%, ${rgba(MD.red, 0.2)})`,
          boxShadow: `0 0 20px ${rgba(MD.red, 0.6)}`,
          opacity: f >= QCUT ? 0 : 1,
          transform: `translate(-50%,-50%) translate3d(${(x + drift).toFixed(1)}px, ${(184 + lift).toFixed(
            1,
          )}px, 62px) rotateZ(1.4deg)`,
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 6 — LA MANO. Un solo objeto con DOS materiales: el frasco marrón girando en su palma
   (clip real) y, en el beat, su mano de vuelta en la llave de paso. Es la misma mano: el gesto
   con el que arrancó el método es el gesto con el que termina el video.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const Act6Hand: React.FC<{ f: number; A6: number; SWAP: number; warm: string }> = ({ f, A6, SWAP, warm }) => {
  const enter = ip(f, [A6 - 8, A6 + 30], [0, 1], E_OUT);
  const swapped = f >= SWAP;
  const morph = ip(f, [SWAP, SWAP + 20], [0, 1], E_LONG);
  const w = swapped ? lerp(560, 604, morph) : 560;
  const h = swapped ? lerp(340, 402, morph) : 340;
  const drift = Math.sin(f / 63) * 3.4;
  const lift = Math.cos(f / 49) * 3.6;
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <Contact w={660} h={96} x={-430 + drift} y={124} o={0.52 * enter} />
      <GlassPlate
        key={swapped ? "valve" : "bottle"}
        src={swapped ? REAL.valve : REAL.bottle}
        w={w}
        h={h}
        x={lerp(-560, -430, enter) + drift}
        y={-110 + lift}
        z={lerp(-140, 90, enter)}
        ry={lerp(11, 7, enter) - morph * 3}
        rz={lerp(-2.6, 1.2, enter)}
        radius={9}
        lit={0.8}
        sheenAt={swapped ? SWAP + 6 : A6 + 24}
        focusX={50}
        focusY={48}
      />
      {/* golpe especular de 3 frames en el cambio de material: el corte se lee como un destello */}
      {f >= SWAP && f < SWAP + 4 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 700,
            height: 480,
            transform: `translate(-50%,-50%) translate3d(${(-430 + drift).toFixed(1)}px, -110px, 96px)`,
            background: `radial-gradient(50% 50% at 50% 46%, ${rgba(warm, ip(f, [SWAP, SWAP + 4], [0.34, 0], ID))} 0%, rgba(0,0,0,0) 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL CÓDIGO — capa de PANTALLA, fuera del mundo 3D. ⛔ Sin perspectiva, sin deriva, sin
   partículas encima, sin rotación. 18 frames de asentado desde el rectángulo que dejó el
   teléfono y después QUIETO hasta el último frame (8,6 s con D=1350).
   ⛔ Sin precio y sin URL: el link vive en la descripción.
   ════════════════════════════════════════════════════════════════════════════════════════ */
const QrStill: React.FC<{ f: number; QCUT: number }> = ({ f, QCUT }) => {
  const s = ip(f, [QCUT, QCUT + 18], [396, 468], E_OUT);
  const cx = ip(f, [QCUT, QCUT + 18], [1326, 1300], E_OUT);
  const cy = ip(f, [QCUT, QCUT + 18], [516, 510], E_OUT);
  const pad = 22;
  return (
    <div
      style={{
        position: "absolute",
        left: Math.round(cx - s / 2),
        top: Math.round(cy - s / 2),
        width: Math.round(s),
        height: Math.round(s),
        boxSizing: "border-box",
        padding: pad,
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: `0 34px 74px rgba(0,0,0,0.66), 0 0 0 3px ${MD.red}, 0 0 60px ${rgba(MD.red, 0.22)}`,
      }}
    >
      {/* material REAL: la tarjeta del código, 1080×1080, ya verificada (decodifica a la landing).
          Se dibuja a ~424 px de lado → módulos gordos y contraste puro: se escanea de una. */}
      <Img
        src={staticFile(REAL.qr)}
        style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
      />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ════════════════════════════════════════════════════════════════════════════════════════ */
export const MovClose: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  // Piso defensivo: los rangos de luz/cámara usan D como último keyframe y tienen que quedar
  // ESTRICTAMENTE crecientes aunque el farm entregue una duración corta (un `interpolate` con
  // el rango desordenado no avisa: revienta el chunk). Con D < 1068 el par
  // [A2+110 · A3-78] de la escala del mazo se cruza → piso en 1200.
  const D = Math.max(1200, durationInFrames);
  const f = frame;
  const p = clamp01(f / D);

  /* ── FRONTERAS como FRACCIONES de la duración (nada hardcodeado a 1350) ─────────────────── */
  const A2 = Math.round(D * 0.142); // 192
  const A3 = Math.round(D * 0.318); // 429
  const A4 = Math.round(D * 0.576); // 778
  const A5 = Math.round(D * 0.724); // 977
  const QCUT = Math.round(D * 0.795); // 1073 — el corte en el beat
  const A6 = Math.round(D * 0.862); // 1164
  const SWAP = Math.round(D * 0.932); // 1258 — frasco → llave

  /* ── LA CÁMARA: UNA sola, `stageCam(p, 6)`. ⛔ ningún acto la reinicia y ⛔ no se pisa al
     final: aterriza sola en CAM_ARC[6].to. Los actos aplican offsets ENCIMA, nunca en lugar. */
  const C = stageCam(p, 6);
  // respiración: `stageCam` es una interpolación pura, así que el aire lo pone el movimiento
  const bx = Math.sin(f / 47) * 2.6 + Math.sin(f / 113) * 1.6;
  const by = Math.cos(f / 61) * 2.0;
  // dolly propio del movimiento, SUMADO al arco (perspectiva propia: `transform: perspective()`
  // sólo sirve para el translateZ del PROPIO nodo — los hijos usan `Space3D`)
  const camZ = ip(f, [0, A2, A3 - 18, A3 + 34, A4, A5, QCUT, A6, D], [40, 10, -46, 34, 12, 26, 18, 8, -22], E_SOFT);
  const camRot = ip(f, [0, A3, A4, A5, A6, D], [1.1, -0.8, 0.7, -0.4, 0.3, 0], E_SOFT);

  /* ── LA LUZ: un solo viaje 'cold' → 'warm'. No salta: `movLight(6, p)` la interpola. ─────── */
  const air = movLight(6, p);
  const warm = movLight(6, clamp01(p * 0.6 + 0.4));
  const keyF = ip(f, [0, A2, A3, A4, A5, A6, D], [0.18, 0.26, 0.4, 0.52, 0.62, 0.68, 0.74], E_SOFT);
  const atmI = ip(f, [0, A2, A3, A4, A5, A6, D], [1.16, 1.06, 0.98, 0.94, 0.98, 1.04, 1.1], E_SOFT);

  /* ── grupos de acto ─────────────────────────────────────────────────────────────────────── */
  const gWater = f < A2 + 26;
  const gDeck = f < A3 + 6;
  const gMarlene = f > A3 - 40 && f < A4 + 6;
  const gSheet = f > A4 - 26 && f < A5 + 24;
  const gPhone = f > A5 - 34 && f < QCUT;
  const gHand = f > A6 - 12;

  /* ACTO 1: la página héroe vive CORRIDA A LA DERECHA para dejarle el tercio izquierdo al texto.
     Vuelve al centro con la misma curva con la que se abre el abanico → en la FRONTERA 2 el
     desplazamiento ya es 0 y la alineación del embate es exacta. */
  const shift = ip(f, [A2 - 24, A2 + 70], [212, 0], E_LONG);

  /* deriva propia de la capa de textos (parallax, SIN entrar al mundo 3D → safe area intacta) */
  const tx = Math.sin(f / 53) * 4.6 + Math.sin(f / 127) * 2.6;
  const ty = Math.cos(f / 69) * 3.6;

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      {/* UNA sola atmósfera, montada UNA vez, para los 45 segundos. Nunca se remonta. */}
      <Atmos tint={air} keyFrom={keyF} intensity={atmI} />

      {/* ── EL MUNDO ────────────────────────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0px) ${C.transform}`,
        }}
      >
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `perspective(1500px) translateZ(${camZ.toFixed(2)}px) rotateZ(${camRot.toFixed(3)}deg)`,
          }}
        >
          {/* plano profundo de bruma: parallax propio, el aire tiene fondo */}
          <div
            style={{
              position: "absolute",
              inset: "-16%",
              transform: `translateX(${(Math.sin(f / 148) * 28).toFixed(1)}px)`,
              background: `radial-gradient(58% 44% at ${(34 + keyF * 26).toFixed(0)}% 22%, ${rgba(
                air,
                0.11,
              )} 0%, rgba(0,0,0,0) 70%)`,
            }}
          />

          {/* zIndex 10 — el agua del tanque (lo que había antes; se deja ir por geometría) */}
          {gWater && (
            <Space3D depth={1700} style={{ zIndex: 10 }}>
              <TankWater f={f} A2={A2} shift={shift} />
            </Space3D>
          )}

          {/* zIndex 20 — ACTOS 1+2 · EL MAZO (un solo nodo cruza la FRONTERA 1) */}
          {gDeck && (
            <Space3D depth={1500} style={{ zIndex: 20 }}>
              <PageDeck f={f} A2={A2} A3={A3} shift={shift} />
            </Space3D>
          )}

          {/* zIndex 30 — ACTO 3 · MARLENE. Envuelto en el ZOOM-THROUGH de la FRONTERA 3:
              la cámara entra en la foto de la taza (70.5% / 42.5%) y sale en la puerta. */}
          {gMarlene && (
            <AbsoluteFill style={{ zIndex: 30 }}>
              {/* into = el centro EN PANTALLA de la foto de la taza limpia, calculado con la
                  cadena real de escalas (z de la placa · perspectiva de cámara · stageCam) */}
              <ZoomThrough at={A4 - 20} dur={22} into={[72.8, 43.4]} scale={8.2}>
                <Space3D depth={1500}>
                  <Act3Marlene f={f} A3={A3} A4={A4} warm={warm} />
                </Space3D>
              </ZoomThrough>
            </AbsoluteFill>
          )}

          {/* zIndex 25 — ACTO 4 · LA HOJA. Ya está montada DETRÁS mientras la atravesamos. */}
          {gSheet && (
            <Space3D depth={1500} style={{ zIndex: 25 }}>
              <Act4Sheet f={f} A4={A4} A5={A5} warm={warm} />
            </Space3D>
          )}

          {/* zIndex 32 — ACTO 5 · EL TELÉFONO (entra por delante en el match-move) */}
          {gPhone && (
            <Space3D depth={1500} style={{ zIndex: 32 }}>
              <Act5Phone f={f} A5={A5} QCUT={QCUT} />
            </Space3D>
          )}

          {/* zIndex 34 — ACTO 6 · LA MANO */}
          {gHand && (
            <Space3D depth={1500} style={{ zIndex: 34 }}>
              <Act6Hand f={f} A6={A6} SWAP={SWAP} warm={warm} />
            </Space3D>
          )}

          {/* polvo del cuarto: vive en los 45 s y se entibia con la luz */}
          <AbsoluteFill style={{ zIndex: 36 }}>
            <Motes n={38} tint={air} speed={0.85} />
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── COSTURAS ───────────────────────────────────────────────────────────────────────
          F2 @A3 OCLUSIÓN: el papel ya tapa el 100%; estas dos bandas cubren cualquier borde. */}
      <AbsoluteFill style={{ zIndex: 40 }}>
        <Occluder at={A3 - 9} dur={17} color={MD.ink1} angle={-6} />
        <Occluder at={A3 - 4} dur={14} color={MD.ink0} angle={-6} />
      </AbsoluteFill>

      {/* F5 @A6 WIPE POR MATERIA — recortado al 42% izquierdo del cuadro: el vapor NO toca el QR */}
      <div style={{ position: "absolute", inset: 0, zIndex: 44, clipPath: "inset(0 58% 0 0)", pointerEvents: "none" }}>
        <VaporWipe at={A6 - 14} dur={32} />
        <VaporWipe at={A6 - 3} dur={26} />
      </div>

      {/* golpe seco de 3 frames en el CORTE EN EL BEAT (el teléfono se vuelve el código) */}
      {f >= QCUT && f < QCUT + 3 && (
        <AbsoluteFill
          style={{
            zIndex: 46,
            background: rgba(MD.white, ip(f, [QCUT, QCUT + 3], [0.11, 0], ID)),
            pointerEvents: "none",
          }}
        />
      )}

      {/* rebote cálido final: el cuarto queda habitado, ⛔ nunca se va a negro */}
      <AbsoluteFill
        style={{
          zIndex: 12,
          pointerEvents: "none",
          background: `radial-gradient(72% 56% at 76% 106%, ${rgba(
            warm,
            0.08 + ip(f, [A5, D], [0, 0.14], E_SOFT),
          )} 0%, rgba(0,0,0,0) 62%)`,
        }}
      />

      {/* ── TEXTO (fuera del mundo 3D: legible y dentro de la safe area de 60 px) ─────────── */}
      <AbsoluteFill
        style={{ zIndex: 50, pointerEvents: "none", transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)` }}
      >
        {/* ACTO 1 — "esos diagramas no son gráficos que hice para el video" */}
        {f < A2 + 34 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 108,
              width: 940,
              transform: `translateY(${ip(f, [A2 - 6, A2 + 30], [0, 210], E_IN).toFixed(1)}px)`,
              clipPath: `inset(0 0 ${ip(f, [A2, A2 + 30], [0, 100], E_IN).toFixed(1)}% 0)`,
            }}
          >
            <TextBed pad={30}>
              <div style={{ opacity: ip(f, [8, 22], [0, 1], E_OUT), transform: `translateX(${ip(f, [8, 24], [-18, 0], E_OUT).toFixed(1)}px)` }}>
                <Kicker>Those diagrams on screen</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words f={f} at={44} text="NOT GRAPHICS. PAGES." size={68} serifOn={["PAGES."]} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: F_SANS,
                  fontWeight: 600,
                  fontSize: 32,
                  color: rgba(MD.bone, 0.74),
                  opacity: ip(f, [104, 126], [0, 1], E_OUT),
                }}
              >
                out of the guide, exactly as they are printed
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 2 — el abanico. El texto se corre ARRIBA: las 8 páginas ocupan el centro. */}
        {f > A2 + 30 && f < A3 - 24 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 92,
              width: 1080,
              transform: `translateY(${ip(f, [A3 - 60, A3 - 26], [0, -190], E_IN).toFixed(1)}px)`,
              clipPath: `inset(${ip(f, [A3 - 58, A3 - 26], [0, 100], E_IN).toFixed(1)}% 0 0 0)`,
            }}
          >
            <TextBed pad={28}>
              <div style={{ opacity: ip(f, [A2 + 34, A2 + 50], [0, 1], E_OUT) }}>
                <Kicker>The whole thing is in there</Kicker>
              </div>
              <div style={{ marginTop: 12 }}>
                <Words f={f} at={A2 + 56} text="EIGHT PAGES. ONE METHOD." size={72} serifOn={["METHOD."]} />
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 3 — MARLENE. Le damos AIRE: el bloque respira y se construye por frases. */}
        {f > A3 + 40 && f < A4 - 8 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 96,
              width: 880,
              transform: `translateY(${ip(f, [A4 - 46, A4 - 10], [0, 240], E_IN).toFixed(1)}px)`,
              clipPath: `inset(0 0 ${ip(f, [A4 - 44, A4 - 10], [0, 100], E_IN).toFixed(1)}% 0)`,
            }}
          >
            <TextBed pad={30}>
              <div style={{ opacity: ip(f, [A3 + 46, A3 + 64], [0, 1], E_OUT) }}>
                <Kicker>Marlene · Ohio · a rental unit</Kicker>
              </div>
              <div style={{ marginTop: 14 }}>
                <Words f={f} at={A3 + 78} text="SHE SENT ME A PHOTO." size={74} step={4.2} serifOn={["PHOTO."]} />
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: F_SANS,
                  fontWeight: 600,
                  fontSize: 33,
                  lineHeight: 1.34,
                  color: rgba(MD.bone, 0.78),
                  opacity: ip(f, [A3 + 214, A3 + 240], [0, 1], E_OUT),
                  transform: `translateX(${ip(f, [A3 + 214, A3 + 246], [-16, 0], E_OUT).toFixed(1)}px)`,
                }}
              >
                Two weeks and a second pass. The toilet that was
                <br />
                getting replaced is <span style={{ fontFamily: F_SERIF, fontStyle: "italic", color: MD.white }}>still sitting in that apartment.</span>
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 4 — imprimila y pegala adentro */}
        {f > A4 + 12 && f < A5 + 10 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 100,
              width: 1080,
              transform: `translateY(${ip(f, [A5 - 26, A5 + 8], [0, 230], E_IN).toFixed(1)}px)`,
              clipPath: `inset(0 0 ${ip(f, [A5 - 24, A5 + 8], [0, 100], E_IN).toFixed(1)}% 0)`,
            }}
          >
            <TextBed pad={28}>
              <div style={{ opacity: ip(f, [A4 + 16, A4 + 34], [0, 1], E_OUT) }}>
                <Kicker>Amounts · timings · what never mixes</Kicker>
              </div>
              <div style={{ marginTop: 12 }}>
                <Words f={f} at={A4 + 40} text="PRINT IT. TAPE IT INSIDE." size={70} serifOn={["INSIDE."]} />
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 5 — el código. Texto SÓLO en el tercio izquierdo: el QR vive a la derecha. */}
        {f > A5 + 14 && f < A6 + 6 && (
          <div
            style={{
              position: "absolute",
              left: 96,
              bottom: 148,
              width: 840,
              transform: `translateY(${ip(f, [A6 - 24, A6 + 4], [0, 260], E_IN).toFixed(1)}px)`,
              clipPath: `inset(0 0 ${ip(f, [A6 - 22, A6 + 4], [0, 100], E_IN).toFixed(1)}% 0)`,
            }}
          >
            <TextBed pad={30}>
              <div style={{ opacity: ip(f, [A5 + 18, A5 + 36], [0, 1], E_OUT) }}>
                <Kicker>The fastest way in</Kicker>
              </div>
              <div style={{ marginTop: 12 }}>
                <Words f={f} at={QCUT + 4} text="POINT YOUR CAMERA." size={72} serifOn={["CAMERA."]} />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: F_SANS,
                  fontWeight: 600,
                  fontSize: 31,
                  color: rgba(MD.bone, 0.74),
                  opacity: ip(f, [QCUT + 34, QCUT + 54], [0, 1], E_OUT),
                }}
              >
                it takes you straight to the pages
              </div>
            </TextBed>
          </div>
        )}

        {/* ACTO 6 — el frasco de un dólar y, al final, la llave. El último frame queda ENCENDIDO. */}
        {f > A6 + 8 && (
          <div style={{ position: "absolute", left: 96, bottom: 112, width: 900 }}>
            <TextBed pad={30}>
              <div
                style={{
                  opacity: ip(f, [A6 + 12, A6 + 30], [0, 1], E_OUT),
                  transform: `translateX(${ip(f, [A6 + 12, A6 + 34], [-16, 0], E_OUT).toFixed(1)}px)`,
                }}
              >
                <Kicker color={f >= SWAP ? MD.warm : MD.red}>
                  {f >= SWAP ? "If this was useful, subscribe" : "Not stronger. Never was."}
                </Kicker>
              </div>
              {f < SWAP && (
                <div style={{ marginTop: 14 }}>
                  <Words f={f} at={A6 + 36} text="IT IS STILL THERE." size={72} serifOn={["THERE."]} />
                </div>
              )}
              {f >= SWAP && (
                <>
                  <div style={{ marginTop: 14 }}>
                    <Words
                      f={f}
                      at={SWAP + 6}
                      text="NOW GO TURN THAT VALVE."
                      size={68}
                      step={2.6}
                      serifOn={["VALVE."]}
                      accent={MD.warm}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      height: 5,
                      width: `${ip(f, [SWAP + 20, SWAP + 54], [0, 94], E_OUT).toFixed(1)}%`,
                      background: `linear-gradient(90deg, ${MD.warm}, ${rgba(MD.warm, 0)})`,
                      boxShadow: `0 0 18px ${rgba(MD.warm, 0.7)}`,
                      borderRadius: 3,
                    }}
                  />
                </>
              )}
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      {/* ── EL CÓDIGO: zIndex 60, por ENCIMA de todo. Nada le pasa por delante nunca más. ─── */}
      {f >= QCUT && (
        <AbsoluteFill style={{ zIndex: 60, pointerEvents: "none" }}>
          <QrStill f={f} QCUT={QCUT} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
