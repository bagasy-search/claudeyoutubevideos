// Mov2Numeros.tsx — MOVIMIENTO 2 del VSL de constructorlibre.com/curso.
// 440 frames (14,65 s) a 30 fps. Arranca en el frame ABSOLUTO 872 (= seg. 29,05).
//
// ⛔ ES EL CORAZÓN DEL VSL: los TRES PRECIOS que hacen toda la oferta ($80 / $150 / $300).
// Son lo que se COBRA POR EL SERVICIO. ⛔⛔ Acá NO aparece nunca el precio del CURSO.
//
// ── LA IDEA DE DIRECCIÓN ──────────────────────────────────────────────────────────────────────
// UNA sola escena continua: un ABANICO 3D de tres fichas de trabajo (foto REAL adentro de cada
// una) por el que la cámara viaja mientras la voz nombra cada precio; cuando los tres precios
// están dichos, el abanico NO se corta: se APLANA y se convierte en una ESCALERA de tres
// escalones que se puede leer de un golpe (ése es el pago). Las MISMAS tres tarjetas viven de
// principio a fin — son la materia que cruza todas las fronteras.
//
// ── TABLA DE HANDOFF (suites_premium.md §4) ───────────────────────────────────────────────────
// VECINO ANTERIOR (local < 0): img/vsls04.png a sangre (le pagan billetes en la puerta),
//   deriva lenta, luz de día.
//   exitTo {cam: deriva global, luz: día neutra (temp 0.10), materia: los BILLETES}
//
// ACTO 1 · f0–104 · "un trabajo pequeño… alrededor de 80 dólares"   [$80 en f68]
//   enterFrom {cam: deriva global heredada + push del zoom-through (scale 1.085→1.00 en 26f),
//              luz: día neutra temp 0.10 / key 62%, materia: los BILLETES de vsls04}
//   exitTo    {cam: push que sigue andando, fan en x=660 z=0,
//              luz: temp 0.22 (empieza a entibiar), materia: la FICHA $80 (img/vslk01.png) ya en el abanico}
//
// ACTO 2 · f105–195 · "uno mediano alrededor de… 150, y"            [$150 en f148]
//   enterFrom {cam: whip-pan de 38 px YA andando + abanico rotando (foco 0→1), luz: temp 0.22,
//              materia: las TRES fichas del abanico (la $80 se va al fondo, entra la $150)}
//   exitTo    {cam: fan en x=620 con push +60 z, luz: temp 0.42,
//              materia: el SELLADO NEGRO del plate 013}
//
// ACTO 3 · f196–331 · "trabajos más grandes… pueden llegar a 200, 250 o 300"  [$300 en f275]
//   enterFrom {cam: la oclusión de sellado entrega el cuadro ya en x=620, luz: temp 0.42 → ámbar,
//              materia: la banda de SELLADO NEGRO que cruzó = el mismo sellado del plate 048}
//   exitTo    {cam: fan en x=580 con push +130 (la $300 es la que viene MÁS adelante),
//              luz: temp 0.78 (ámbar pleno), materia: las TRES fichas, que empiezan a aplanarse}
//
// ACTO 4 · f332–378 · (pausa) la ESCALERA completa: los tres precios conviven
//   enterFrom {cam: el abanico se aplana al centro (x→960) con la cámara siguiendo, luz: temp 0.78,
//              materia: las MISMAS tres tarjetas, ahora escalones; el muro de ladrillo del plate}
//   exitTo    {cam: centrada, cuadro ya despejándose, luz: temp 0.42 (vuelve a día),
//              materia: el POLVO DE PINTURA BLANCA que barre las fichas}
//
// ACTO 5 · f379–440 · "de la zona y de la dificultad"
//   enterFrom {cam: deriva global sola (ningún reset), luz: temp 0.42 bajando a día,
//              materia: img/vslm02.png — Tomás tocando una pared REAL}
//   exitTo    {cam: deriva global limpia, luz: día neutra temp 0.12 y grade 0.22,
//              materia: NADA encima del cuadro desde f427 → corte limpio a su cara}
//
// VECINO POSTERIOR (local > 440): presentador a PANTALLA COMPLETA, plano medio, taller, día neutro.
//
// ── LAS COSTURAS (una DISTINTA por frontera, ⛔ ningún fade de cuadro entero) ──────────────────
// F0  entrada f0–20  ZOOM-THROUGH  · la cámara entra en los billetes de vsls04 (escala ×3,4) y el
//                                    iris se consume de afuera hacia adentro: NO es opacidad, es
//                                    geometría — salimos del otro lado ya en la pared descascarada.
// F1  f105           MATCH-MOVE    · el whip-pan ya está andando y el abanico rota; el plate cambia
//                                    DETRÁS del movimiento (016 → 013, dos paredes a la misma escala).
// F2  f196           OCLUSIÓN      · una banda de SELLADO NEGRO con brillo mojado cruza y tapa el
//                                    100 % durante 5 frames (193→198). ⛔ el color es el de la
//                                    MATERIA (#1A1714, el sellado del clip 048), NUNCA el del fondo
//                                    (#0C0B09 no ocluye: hace un fundido a negro y se ve un flash).
//                                    Y HOLDEA: un barrido lineal cubre el 100 % apenas ~1 frame.
// F3  f332           MATCH-SHAPE   · el abanico 3D se APLANA: las mismas tres tarjetas pasan de ring
//                                    a ESCALERA con un solo interpolate de geometría (cero corte), y
//                                    el plate salta 048 → 020 tapado por el barrido especular f328–344.
// F4  f379           CORTE EN EL BEAT · cuadro ya despejado, escala claramente otra (cerrado de muro →
//                                    plano de Tomás), luma igualada (grade ≈0,55 a los dos lados):
//                                    corte seco EXACTO en "de la zona". El WIPE POR MATERIA (polvo de
//                                    pintura blanca, f368) es el que se lleva las fichas 11 frames antes.
//
// ── CONTRATO TÉCNICO ──────────────────────────────────────────────────────────────────────────
// · CERO Math.random/Date.now/new Date: todo es función pura de useCurrentFrame() (rnd() del Escenario).
// · CERO backdrop-filter y CERO blur grande a pantalla completa: la profundidad sale de los
//   hermanos `_blur.jpg` que ya están en disco.
// · Ningún clip se pasa de su duración real (016 7,0s→3,50s · 013 7,0s→3,03s · 048 4,6s→4,53s ·
//   020 7,0s→1,57s). Sólo OffthreadVideo (vía <Plate>), nunca <Video>, nunca `loop`.
// · Easing.quint NO existe. Acá sólo cubic / in / out / inOut.
import React from "react";
import {
  AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import {
  useCam, useActo, useEntra, Plate, Grade, Atmos, Tarjeta, WipeMateria, Titular, Kicker,
  VSL, FF, PAPER, ACC, LINE, SAFE, rnd, SOMBRA_TEXTO,
} from "./Escenario";

const CL = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** los actos, en frames LOCALES. La CÁMARA sigue siendo global (useCam(desde)): ningún acto la
 *  reinicia, y la atmósfera se monta UNA sola vez al final del árbol. */
const CORTES = [0, 105, 196, 332, 379];

// ── LAS TRES FICHAS ───────────────────────────────────────────────────────────────────────────
/** ⛔⛔ Regla dura: toda tarjeta flotante lleva MATERIAL REAL adentro. Cada cifra está sobre la
 *  FOTO del trabajo que la justifica: raspar una pared chica / aplicar producto con brocha / el
 *  trabajo terminado a rodillo. */
const CARTAS = [
  { src: "img/vslk01.png", at: 8, precio: 80, base: 0, sub: "uno pequeño", color: PAPER },
  { src: "img/vsls02.png", at: 100, precio: 150, base: 0, sub: "uno mediano", color: PAPER },
  { src: "img/vslk02.png", at: 222, precio: 300, base: 200, sub: "los más grandes", color: ACC },
];

const CW = 430, CH = 540, PASO = 23, RADIO = 520;
/** el layout de ESCALERA al que el abanico se APLANA (frontera 3, match-shape). */
const ESC = [
  { x: -480, y: 86, s: 0.62, px: 112, sombra: 47 },
  { x: 0, y: 40, s: 0.70, px: 126, sombra: 71 },
  { x: 480, y: -10, s: 0.80, px: 148, sombra: 94 },
];

// ══ L5 · EL ABANICO 3D QUE SE VUELVE ESCALERA ═════════════════════════════════════════════════
/** UNA sola geometría interpolada: `plano` 0 = abanico en un ring 3D (la delantera se mueve MÁS que
 *  la trasera = parallax), `plano` 1 = escalera aplanada. No hay corte entre los dos estados, que es
 *  exactamente lo que hace la costura MATCH-SHAPE de la frontera 3. */
const Abanico: React.FC<{ foco: number; plano: number; fanX: number; push: number; op: number }> = ({
  foco, plano, fanX, push, op,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2000, perspectiveOrigin: "50% 46%", opacity: op }}>
      <div style={{ position: "absolute", left: mix(fanX, 960, plano), top: 540, transformStyle: "preserve-3d" }}>
        {CARTAS.map((c, i) => {
          const rel = i - foco;
          const ang = rel * PASO;
          const rad = (ang * Math.PI) / 180;
          const ad = Math.max(0, 1 - Math.abs(rel));               // 1 = es la ficha en foco
          // ── estado A: el ring 3D
          const rx = Math.sin(rad) * RADIO;
          const rz = Math.cos(rad) * RADIO - RADIO + push * ad;
          const rs = 0.82 + 0.18 * ad;
          const rry = -ang * 0.55;
          const flota = Math.sin(frame / (56 + i * 11) + i * 1.9) * (4 + 6 * ad);
          // ── estado B: la escalera
          const e = ESC[i];
          const X = mix(rx, e.x, plano);
          const Y = mix(flota, e.y + flota * 0.3, plano);
          const Z = mix(rz, 0, plano);
          const S = mix(rs, e.s, plano);
          const RY = mix(rry, -4 + i * 4, plano);
          const bl = (1 - ad) * 3.2 * (1 - plano);
          const gap = mix(34, e.sombra, plano);
          return (
            <div
              key={c.src}
              style={{
                position: "absolute", left: -CW / 2, top: -CH / 2, width: CW, height: CH,
                transformStyle: "preserve-3d",
                transform: `translate3d(${X.toFixed(2)}px, ${Y.toFixed(2)}px, ${Z.toFixed(2)}px) rotateY(${RY.toFixed(3)}deg) scale(${S.toFixed(4)})`,
                opacity: mix(0.44 + 0.56 * ad, 1, plano),
                filter: bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : undefined,
              }}
            >
              <Tarjeta src={c.src} w={CW} h={CH} seed={i * 7 + 3} z={Math.round(40 * ad)} at={c.at} />
              {/* L6 · sombra de CONTACTO que ATERRIZA: en la escalera se despega del objeto y cae
                  al piso (cuanto más alto el escalón, más lejos y más difusa). */}
              <div
                style={{
                  position: "absolute", left: CW * 0.05, width: CW * 0.9, height: 26, top: CH + gap,
                  background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${mix(0.12 + 0.48 * ad, 0.5 - i * 0.1, plano).toFixed(3)}) 0%, rgba(0,0,0,0) 72%)`,
                  filter: `blur(${mix(9, 12 + i * 6, plano).toFixed(1)}px)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ══ L7 · LA CIFRA ═════════════════════════════════════════════════════════════════════════════
/** ≥110 px, tabular-nums, odómetro. La $300 arranca en 200 para que el número PASE por 250 mientras
 *  la voz dice "200, 250 o 300" y aterrice en 300 sobre la palabra. */
const Precio: React.FC<{
  hasta: number; base?: number; at: number; size: number; color: string; vis: number; seed?: number;
}> = ({ hasta, base = 0, at, size, color, vis, seed = 0 }) => {
  const frame = useCurrentFrame();
  const e = useEntra(at, { rise: 26, salida: false });
  const k = interpolate(frame, [at + 3, at + 26], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const v = Math.round(base + (hasta - base) * k);
  const fl = Math.sin(frame / 49 + seed) * 3;
  const wob = Math.cos(frame / 190 + seed * 2.3) * 1.4;
  return (
    <div
      style={{
        fontFamily: FF, fontSize: size, fontWeight: 800, lineHeight: 0.9,
        letterSpacing: "-0.048em", color, fontVariantNumeric: "tabular-nums",
        textShadow: "0 4px 14px rgba(0,0,0,.66), 0 12px 54px rgba(0,0,0,.82)",
        opacity: e.a * vis, filter: e.blur,
        transform: `perspective(1500px) translateZ(70px) rotateY(${wob.toFixed(3)}deg) translateY(${(e.y + fl).toFixed(1)}px)`,
      }}
    >
      {"$"}{v}
    </div>
  );
};

const Sub: React.FC<{ children: React.ReactNode; at: number; vis: number; size?: number }> = ({
  children, at, vis, size = 28,
}) => {
  const e = useEntra(at, { rise: 14, salida: false });
  return (
    <div
      style={{
        fontFamily: FF, fontSize: size, fontWeight: 600, letterSpacing: "0.01em",
        color: "rgba(255,255,255,0.84)", textShadow: SOMBRA_TEXTO,
        opacity: e.a * vis, transform: `translateY(${e.y.toFixed(1)}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ══ COSTURA F0 · ZOOM-THROUGH ═════════════════════════════════════════════════════════════════
/** La materia que cruza desde el movimiento anterior son los BILLETES de vsls04: la cámara entra
 *  en ellos (escala ×3,4) y el iris se consume de afuera hacia adentro, así que NO es un fade de
 *  opacidad sino una geometría: salimos del otro lado, ya en la pared descascarada. */
const ZoomThrough: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 21) return null;
  const p = interpolate(f, [0, 20], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  const s = 1.06 + p * 2.34;
  const r = (1 - p) * 132;
  const mask = `radial-gradient(circle at 50% 56%, #000 ${r.toFixed(1)}%, rgba(0,0,0,0) ${(r + 15).toFixed(1)}%)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile("img/vsls04.png")}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${s.toFixed(4)}) translate(${(p * 1.8).toFixed(2)}%, ${(p * 2.6).toFixed(2)}%)`,
          WebkitMaskImage: mask, maskImage: mask,
        }}
      />
    </AbsoluteFill>
  );
};

// ══ COSTURA F2 · OCLUSIÓN DE SELLADO ══════════════════════════════════════════════════════════
/** ⛔⛔ El color es el de la MATERIA que cruza — el sellado negro del clip 048, con su brillo
 *  mojado corriendo por encima — NUNCA el del fondo. Y la banda HOLDEA 5 frames en cobertura
 *  total (193→198): con un barrido lineal el 100 % dura ~1 frame y el swap de plate se ve. */
const Sellado: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at - 12 || f > at + 15) return null;
  const x = interpolate(f, [at - 11, at - 3, at + 2, at + 14], [-310, -80, -80, 175], {
    ...CL, easing: Easing.inOut(Easing.cubic),
  });
  const sh = interpolate(f, [at - 8, at + 4], [18, 88], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", top: "-62%", left: `${x.toFixed(2)}%`, width: "260%", height: "224%",
          transform: "rotate(-9deg)",
          background: [
            `linear-gradient(96deg, rgba(255,255,255,0) ${(sh - 16).toFixed(1)}%, rgba(255,255,255,0.15) ${sh.toFixed(1)}%, rgba(255,255,255,0) ${(sh + 14).toFixed(1)}%)`,
            "linear-gradient(93deg, rgba(0,0,0,0) 0%, #1A1714 9%, #241F18 42%, #15120F 66%, #201B15 86%, rgba(0,0,0,0) 100%)",
          ].join(", "),
          boxShadow: "0 0 140px rgba(0,0,0,0.58)",
        }}
      />
    </AbsoluteFill>
  );
};

// ══ L4 · POLVO DE OBRA CON PARALLAX PROPIO ════════════════════════════════════════════════════
/** Plano de profundidad extra (discos desenfocados de revoque) que se mueve a OTRO ritmo que el
 *  plate y que las fichas: es lo que hace que el cuadro tenga aire y no capas pegadas. */
const PolvoObra: React.FC<{ panX: number; panY: number }> = ({ panX, panY }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = rnd(i * 5.1 + 3), b = rnd(i * 9.7 + 11), c = rnd(i * 13.3 + 29);
        const s = 48 + a * 150;
        const k = 0.5 + c * 1.9;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(6 + b * 88).toFixed(2)}%`,
              top: `${(8 + a * 80).toFixed(2)}%`,
              width: s, height: s, borderRadius: "50%",
              background: `radial-gradient(circle at 38% 34%, rgba(255,246,228,${(0.1 + c * 0.1).toFixed(3)}) 0%, rgba(255,246,228,0) 70%)`,
              transform: `translate(${(panX * k * 9 + Math.sin(f / (120 + i * 23) + i) * 9).toFixed(2)}px, ${(panY * k * 9 + Math.cos(f / (150 + i * 17) + i) * 7).toFixed(2)}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ══ L3 · EL MURO DESENFOCADO (hermanos _blur.jpg, ⛔ NUNCA backdrop-filter) ════════════════════
/** La copia YA desenfocada en disco del mismo material que está en juego, como pared de fondo
 *  detrás de las piezas, con máscara suave y su propio parallax. Coste de render: 0. */
const MURO = [
  { src: "img/vslk01_blur.jpg", r: [-1, 0, 96, 132] },   // ⛔ arrancaba en [0,0,…] y interpolate exige inputRange ESTRICTAMENTE creciente: mato 3 chunks
  { src: "img/vsls02_blur.jpg", r: [96, 132, 190, 226] },
  { src: "img/vslk02_blur.jpg", r: [190, 226, 320, 352] },
  { src: "img/vslc03_blur.jpg", r: [320, 352, 366, 382] },
];
const Muro: React.FC<{ panX: number }> = ({ panX }) => {
  const f = useCurrentFrame();
  const mask = "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 26%, #000 56%, #000 100%)";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {MURO.map((m) => {
        const w = interpolate(f, m.r, [0, 1, 1, 0], CL);
        if (w <= 0.003) return null;
        return (
          <Img
            key={m.src}
            src={staticFile(m.src)}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: 0.58 * w,
              transform: `scale(1.16) translate(${(panX * 1.5).toFixed(3)}%, 0)`,
              WebkitMaskImage: mask, maskImage: mask,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
export const Mov2Numeros: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);                 // ⛔ la cámara es función del frame GLOBAL: hereda la
  const { p: pActo } = useActo(CORTES);      //    inercia de lo que venía y NUNCA arranca en 0.

  // ── la LUZ evoluciona (no salta): día neutro → ámbar de obra en el $300 → vuelve a día para
  //    aterrizar en el plano del presentador.
  const temp = interpolate(f, [0, 105, 196, 275, 332, 379, 428], [0.10, 0.22, 0.42, 0.74, 0.78, 0.42, 0.12], CL);
  const keyX = 62 + 15 * Math.sin(cam.f / 520);
  const gradeF = interpolate(f, [0, 22, 68, 300, 344, 372, 392, 428], [0.55, 0.80, 1.0, 1.0, 0.92, 0.72, 0.55, 0.22], CL);

  // ── coreografía del abanico, anclada al ms del guion
  const foco = interpolate(f, [0, 96, 140, 212, 262, 332], [0, 0, 1, 1, 2, 2], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const plano = interpolate(f, [328, 352], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });   // F3 match-shape
  const fanX = interpolate(f, [0, 105, 196, 300], [660, 660, 620, 580], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const push = interpolate(f, [0, 105, 196, 300], [0, 0, 60, 130], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const opCartas = interpolate(f, [366, 378], [1, 0], CL);

  // ── entrada: el push del zoom-through que sigue andando (el acto 1 NO arranca quieto)
  const entraS = interpolate(f, [0, 26], [1.085, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  // ── F1 MATCH-MOVE: el whip-pan ya está en marcha cuando el plate cambia detrás
  const whip = interpolate(f, [99, 105, 113], [0, -38, 0], { ...CL, easing: Easing.inOut(Easing.cubic) });

  // ── ventanas de texto: UNA idea por acto
  const visKicker = interpolate(f, [14, 26, 330, 344], [0, 1, 1, 0], CL);
  const visP1 = interpolate(f, [68, 76, 104, 118], [0, 1, 1, 0], CL);
  const visP2 = interpolate(f, [148, 156, 198, 212], [0, 1, 1, 0], CL);
  const visP3 = interpolate(f, [275, 283, 324, 338], [0, 1, 1, 0], CL);
  const visEsc = interpolate(f, [340, 350, 366, 377], [0, 1, 1, 0], CL);
  const visTit = interpolate(f, [386, 396, 416, 427], [0, 1, 1, 0], CL);
  const camaDer = interpolate(f, [40, 62, 320, 344], [0, 1, 1, 0], CL);
  const camaAbajo = interpolate(f, [332, 350, 364, 376], [0, 1, 1, 0], CL);

  // ── barrido especular: uno por acto (hold VIVO) + el refuerzo de la frontera 3, que es el que
  //    tapa el salto de plate 048 → 020.
  const sheen = 0.085 * Math.sin(Math.PI * Math.min(1, pActo * 1.2))
    + interpolate(f, [328, 334, 344], [0, 0.2, 0], CL);
  const sheenX = -28 + (pActo * 0.75 + 0.25) * 150;

  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {/* ══ L1 · PLATES — el material REAL a sangre. Ningún clip pasa su duración real. ══ */}
      <Sequence from={0} durationInFrames={105} layout="none">
        {/* 7,0 s disponibles, se usan 3,50 s — revoque ampollado = un trabajo CHICO */}
        <Plate src="broll/vslcurso_016.mp4" desde={desde} profundidad={0.2} />
      </Sequence>
      <Sequence from={105} durationInFrames={91} layout="none">
        {/* 7,0 s disponibles, se usan 3,03 s — impermeabilizante negro = trabajo MEDIANO */}
        <Plate src="broll/vslcurso_013.mp4" desde={desde + 105} profundidad={0.2} />
      </Sequence>
      <Sequence from={196} durationInFrames={136} layout="none">
        {/* 4,6 s disponibles, se usan 4,53 s — sellado en serpentina = trabajo GRANDE */}
        <Plate src="broll/vslcurso_048.mp4" desde={desde + 196} profundidad={0.2} />
      </Sequence>
      <Sequence from={332} durationInFrames={47} layout="none">
        {/* 7,0 s disponibles, se usan 1,57 s — el MISMO muro de ladrillo: tapa el salto */}
        <Plate src="broll/vslcurso_020.mp4" desde={desde + 332} profundidad={0.2} />
      </Sequence>
      <Sequence from={379} durationInFrames={61} layout="none">
        {/* foto: Tomás tocando una pared real — el aterrizaje */}
        <Plate src="img/vslm02.png" desde={desde + 379} profundidad={0.2} />
      </Sequence>

      {/* ══ COSTURA F0 · ZOOM-THROUGH desde los billetes del movimiento anterior ══ */}
      <ZoomThrough />

      {/* ══ L2 · GRADE — hunde el plate para que la cifra blanca se lea (⛔ el alfa se anima, no
             el opacity del div; calibrado ≤0,56: a 0,80 el b-roll DESAPARECE) ══ */}
      <Grade p={1} fuerza={gradeF} />

      {/* ══ L3 · el muro desenfocado (hermanos _blur.jpg) detrás de las piezas ══ */}
      <Muro panX={cam.panX} />

      {/* camas hundidas: la columna derecha de la cifra, y el piso de la escalera ══ */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(270deg, rgba(12,11,9,0.76) 0%, rgba(12,11,9,0.52) 32%, rgba(12,11,9,0) 60%)",
          opacity: camaDer,
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(0deg, rgba(12,11,9,0.66) 0%, rgba(12,11,9,0.22) 30%, rgba(12,11,9,0) 52%)",
          opacity: camaAbajo,
        }}
      />

      {/* ══ L4 · polvo de obra, con parallax propio ══ */}
      <PolvoObra panX={cam.panX} panY={cam.panY} />

      {/* ══ L5+L7 · TODO lo que vive en el espacio 3D comparte UNA cámara ══ */}
      <AbsoluteFill
        style={{
          transform: `${cam.css} translateX(${whip.toFixed(2)}px) scale(${entraS.toFixed(4)})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* el abanico 3D → escalera. Las MISMAS tres fichas de principio a fin. */}
        <Abanico foco={foco} plano={plano} fanX={fanX} push={push} op={opCartas} />

        {/* piso de la escalera: la línea donde aterrizan las sombras */}
        <div
          style={{
            position: "absolute", left: 300, width: 1320, top: 840, height: 1,
            background: `linear-gradient(90deg, rgba(228,223,213,0) 0%, ${LINE} 18%, ${LINE} 82%, rgba(228,223,213,0) 100%)`,
            opacity: 0.2 * plano * opCartas,
          }}
        />

        {/* ── kicker del movimiento (una sola etiqueta, no cambia de acto a acto) */}
        <div style={{ position: "absolute", left: SAFE, top: SAFE, opacity: visKicker }}>
          <Kicker at={14}>LO QUE SE COBRA UN TRABAJO</Kicker>
          <div
            style={{
              width: 164, height: 3, marginTop: 16, borderRadius: 2,
              background: `linear-gradient(90deg, ${ACC} 0%, rgba(224,146,44,0) 100%)`,
            }}
          />
        </div>

        {/* ── ACTOS 1-3 · la cifra en la columna derecha, una por acto (≥110 px) */}
        <div style={{ position: "absolute", left: 1146, right: SAFE, top: 372 }}>
          {visP1 > 0.004 && (
            <div style={{ position: "absolute", left: 0, top: 0 }}>
              <Precio hasta={80} at={68} size={118} color={PAPER} vis={visP1} seed={1} />
              <div style={{ marginTop: 18 }}><Sub at={74} vis={visP1}>uno pequeño</Sub></div>
            </div>
          )}
          {visP2 > 0.004 && (
            <div style={{ position: "absolute", left: 0, top: -16 }}>
              <Precio hasta={150} at={148} size={132} color={PAPER} vis={visP2} seed={2} />
              <div style={{ marginTop: 20 }}><Sub at={154} vis={visP2}>uno mediano</Sub></div>
            </div>
          )}
          {visP3 > 0.004 && (
            <div style={{ position: "absolute", left: 0, top: -34 }}>
              <Precio hasta={300} base={200} at={275} size={154} color={ACC} vis={visP3} seed={3} />
              <div style={{ marginTop: 22 }}><Sub at={283} vis={visP3}>los más grandes</Sub></div>
            </div>
          )}
        </div>

        {/* ── ACTO 4 · la ESCALERA: los tres precios conviven y se pueden LEER de un golpe */}
        {visEsc > 0.004 && CARTAS.map((c, i) => {
          const e = ESC[i];
          const cardTop = 540 + e.y - (CH * e.s) / 2;
          const cardBot = 540 + e.y + (CH * e.s) / 2;
          return (
            <div key={c.src}>
              <div
                style={{
                  position: "absolute", left: 960 + e.x - 300, width: 600, top: cardTop - 16 - e.px * 1.04,
                  display: "flex", justifyContent: "center",
                }}
              >
                <Precio hasta={c.precio} base={c.base} at={342 + i * 4} size={e.px} color={c.color} vis={visEsc} seed={i + 5} />
              </div>
              <div
                style={{
                  position: "absolute", left: 960 + e.x - 300, width: 600, top: cardBot + 14,
                  display: "flex", justifyContent: "center",
                }}
              >
                <Sub at={348 + i * 4} vis={visEsc}>{c.sub}</Sub>
              </div>
            </div>
          );
        })}

        {/* ── ACTO 5 · el aterrizaje. Todo se va antes del frame 427 para que el corte a la cara
               del presentador sea limpio. */}
        {visTit > 0.004 && (
          <div style={{ position: "absolute", left: SAFE, bottom: 152, opacity: visTit, maxWidth: 1060 }}>
            <div
              style={{
                width: 120, height: 4, marginBottom: 24, borderRadius: 2,
                background: `linear-gradient(90deg, ${ACC} 0%, rgba(224,146,44,0) 100%)`,
              }}
            />
            <Titular at={386} size={58} z={50}>Según la zona y la dificultad</Titular>
          </div>
        )}
      </AbsoluteFill>

      {/* ══ COSTURA F2 · OCLUSIÓN (banda de sellado negro, cobertura total 193→198) ══ */}
      <Sellado at={196} />

      {/* ══ WIPE POR MATERIA · el polvo de pintura BLANCA se lleva las fichas 11 frames antes del
             corte en el beat, así el cuadro llega despejado a la frontera 4 ══ */}
      <WipeMateria at={368} dur={16} color="rgba(246,243,236,0.9)" />

      {/* ══ L6 · LUZ: la key evoluciona de día neutro a ámbar de obra, y vuelve ══ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(92% 74% at ${keyX.toFixed(1)}% 14%, rgba(224,146,44,${(0.3 * temp).toFixed(3)}) 0%, rgba(224,146,44,0) 62%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(200deg, rgba(152,186,214,${(0.075 * (1 - temp)).toFixed(3)}) 0%, rgba(152,186,214,0) 58%)`,
        }}
      />
      {/* barrido especular: uno por acto, más el refuerzo de la frontera 3 */}
      <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: "-30%", left: `${sheenX.toFixed(2)}%`, width: "34%", height: "170%",
            transform: "rotate(13deg)",
            background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${sheen.toFixed(3)}) 48%, rgba(255,255,255,0) 100%)`,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>

      {/* ══ L8+L9 · ATMÓSFERA Y LENTE — UNA sola vez para los cinco actos (⛔ si cada acto monta su
             propia atmósfera, en la frontera hay un reset de fondo y se lee "empezó algo") ══ */}
      <Atmos desde={desde} polvo={1} bokeh={0.9} />
    </AbsoluteFill>
  );
};
