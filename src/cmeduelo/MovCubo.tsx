// MovCubo.tsx — MOVIMIENTO 1 de `cmeduelo` · "LA LEY DEL CUBO" · ~1350 frames @ 30 fps (45 s)
// Canal Claudio Mendoza Constructor (ES). Escenario compartido: `./VoltStage`.
//
// LA IDEA QUE TIENE QUE QUEDAR GRABADA: **la cifra de la caja es verdad en un mundo que no es tu
// patio.** La potencia del viento es cruel dos veces — el ÁREA DE BARRIDO va al CUADRADO (doble
// pala = ×4) y la VELOCIDAD va al CUBO (doble viento = ×8; medio viento = 1/8). Por eso los 400 W
// de la etiqueta son ciertos… a 12 m/s = 43 km/h sostenidos, que es un TEMPORAL. Y un temporal no
// dura una hora, no pasa todos los días, y no pasa a dos metros de altura entre la casa, la
// medianera del vecino y el limonero.
//
// ⛔ NO son seis componentes pegados: es UN PLANO SECUENCIA de 45 s.
//   · UNA sola atmósfera `<VoltAtmos/>`, montada una vez, que NUNCA se remonta.
//   · UNA sola cámara `gcam(camClock(f), {z0:0 → z1:180, panX:-70, ry:-6, dur:END})`. El reloj está
//     DEFORMADO por acto (el easing nunca es constante) pero es MONÓTONO: z no vuelve nunca.
//   · LA LUZ evoluciona en un solo viaje: VOLTIO frío (la medición) → SKY (el gris del temporal).
//   · EL VIENTO ES LA COLUMNA VERTEBRAL y es LITERAL: .15 patio quieto → .40 → .80 (doble) →
//     .34 (mitad) → .88 (la caja) → .95 (el temporal) → .85 (salida). El espectador lo VE.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF   (fracciones de `durationInFrames`; entre paréntesis, frames a D=1350)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA (del plano suelto anterior, s082): la PALA MEDIDA con la cinta.
//    cam {z 0, plano general del patio, net .86} · luz {VOLT, keyFrom .18, int .92} · viento {.15}
//    materia {la turbina chica apoyada en la losa + la foto `cmed_h_508_midePala`}
//
// ACTO 1 · .000–.200 (0–270) · "DOBLE PALA = CUATRO VECES"   ▸ protagonista: EL ÁREA DE BARRIDO
//   enterFrom cam {z 0, net .86, foco (960,540)} luz {VOLT key .18} viento {.15}
//             materia {foto `cmed_h_508_midePala` — la pala que Claudio acaba de medir}
//   material  {FOTO `cmed_h_508_midePala` → FOTO `cmed_h_501_reglaGaraje` en EL MISMO VIDRIO ·
//              FOTO `cmed_o_506_circuloPalas` = LA TUYA, QUIETA · FOTO `cmed_o_507_dosPalasTamano`
//              = EL DOBLE · fondo `cmed_o_505_turbinaYPanel`}
//   El disco chico se mete en el CUADRANTE 1 del disco grande (un cuarto del disco grande tiene
//   EXACTAMENTE el área del chico: π(2r)²/4 = πr²). Se encienden los 4 cuadrantes → ×1 → ×4.
//   exitTo    cam {z ≈ 30, net 1.00} luz {VOLT key .21} viento {.20} materia {EL ARO de 300 px}
//   ── FRONTERA A @ .195 ····· MATCH-SHAPE ················································
//      El ARO del área de barrido NO se va: mismo centro, mismo radio, misma pantalla. Se le
//      apagan los cuadrantes y se le encienden las marcas y la aguja: el disco ES el DIAL del
//      viento. Cero fade, cero corte: la misma circunferencia cambia de oficio.
//
// ACTO 2 · .200–.415 (270–560) · "LA ENERGÍA CRECE AL CUBO"  ▸ protagonista: LA VELOCIDAD
//   enterFrom cam {z ≈ 30, net 1.00} luz {VOLT} viento {.20} materia {EL ARO = el dial}
//   material  {CLIP `cmed_o_513_ramaDespeina.mp4` — la rama del limonero despeinándose cada vez
//              más fuerte · `IconPng cmed_ic_anemometro.png` clavado en el centro del dial ·
//              en el respiro, FOTO `cmed_h_503_cuadernoNumeros` = "léelo despacio" literal}
//   .325 "Al cubo." → el exponente ³ gigante (tipografía del kit) sobre el dial.
//   .355–.415 el ÚNICO respiro del movimiento: cámara casi quieta, push lentísimo, sin corte.
//   exitTo    cam {z ≈ 62, net 1.24} luz {VOLT key .26} viento {.42} materia {LA AGUJA barriendo}
//   ── FRONTERA B @ .415 ····· MATCH-MOVE ··················································
//      La aguja del dial sigue barriendo hacia la derecha y la cámara truckea sobre SU MISMO
//      VECTOR y a su misma velocidad; la tarjeta de la turbina entra ARRASTRADA por la punta de
//      la aguja, que al llegar se convierte en el ARCO DE PUNTA DE PALA del clip. No hay corte.
//
// ACTO 3 · .415–.573 (560–774) · "LA ENERGÍA POR OCHO"       ▸ protagonista: LA TURBINA acelerando
//   enterFrom cam {z ≈ 62, net 1.24 → 1.00} luz {VOLT key .28} viento {.42}
//   material  {CLIP `cmed_o_506_circuloPalas.mp4` a escala de HÉROE y luz VOLTIO — en el acto 1 el
//              MISMO objeto era una FOTO chica y lateral con luz ámbar: el par deliberado, y el
//              material cuenta solo el arco del viento · en el beat del ×8 entra FOTO
//              `cmed_h_515_pinzaVientoFuerte` (la medición en el viento de verdad)}
//   La COLUMNA DE 8 BLOQUES nace del suelo y se enciende de 1 a 8 en el beat de "por ocho".
//   Readout 3,6 W → 28,8 W.
//   exitTo    cam {z ≈ 96, net .94} luz {VOLT→SKY 18%} viento {.80} materia {LOS 8 BLOQUES}
//   ── FRONTERA C @ .573 ····· CORTE EN EL BEAT (`SeamFlash` volt, 5 frames) ················
//      Corte seco EXACTO en "si el viento se reduce a la mitad". Los 8 bloques SOBREVIVEN al
//      corte (mismo sitio, mismo tamaño): lo único que cambia es que empiezan a apagarse.
//
// ACTO 4 · .573–.715 (774–965) · "MITAD DE VIENTO, UN OCTAVO" ▸ protagonista: LA TURBINA frenando
//   enterFrom cam {z ≈ 96, net .94} luz {VOLT→SKY 18%} viento {.80 → .34}
//   material  {FOTO `cmed_h_511_juntoTurbinaBrisa.jpg` — Claudio al lado de la turbina en la brisa
//              real del patio: la foto quieta ES el contenido del acto que se frena · en "una
//              octava parte", macro FOTO `cmed_o_510_cuadernoCerca` = la cuenta que castiga}
//   El viento cae a la mitad y 7 de los 8 bloques se apagan. Readout 3,6 → 0,45 W · "1/8".
//   exitTo    cam {z ≈ 122, net 1.30} luz {SKY 34%} viento {.34} materia {EL ÚLTIMO BLOQUE encendido}
//   ── FRONTERA D @ .712 ····· OCLUSIÓN (color CARTÓN `#9C7A4E`, la materia de la caja) ······
//      La CAJA de la turbina cruza el cuadro y lo tapa al 100% durante 5 frames. El swap de acto
//      cae adentro. ⛔ el color es el del cartón, NO el del fondo.
//      Debajo de la oclusión, el último bloque encendido (mismo recuadro, mismo sitio) sale
//      convertido en la CHAPA DE ESPECIFICACIONES de la caja: 400 W.
//
// ACTO 5 · .715–.865 (965–1168) · "DICE LA VERDAD A 12 M/S"  ▸ protagonista: LA CAJA / LA ETIQUETA
//   enterFrom cam {z ≈ 122, net 1.30 → 1.02} luz {SKY 40%} viento {.34 → .88}
//   material  {CLIP `cmed_h_504_senalaTurbina.mp4` — Claudio señalando la turbina · FOTO
//              `cmed_h_519_panelTranquilo` = el aplomo de "no miente: omite" · `IconPng
//              cmed_ic_caja.png` como objeto de la escena · FOTO `cmed_o_516_patioVientoFuerte.jpg`
//              como cama del chip TEMPORAL}
//   .800 Readout "12 m/s" · .822 "= 43 km/h" · .845 chip TEMPORAL sobre el patio doblado.
//   exitTo    cam {z ≈ 150, net .90} luz {SKY 72%} viento {.88} materia {la FOTO del patio doblado}
//   ── FRONTERA E @ .858 ····· WIPE POR MATERIA (`SeamWipeMatter`, polvo del patio `V.concrete`) ··
//      El polvo que levanta el temporal barre el cuadro y detrás la MISMA foto del patio doblado
//      ya está a sangre, a otra escala. La materia cruza siendo la misma imagen.
//
// ACTO 6 · .865–1.000 (1168–1350) · "TU PATIO NO ES ESE MUNDO" ▸ protagonista: EL TEMPORAL
//   enterFrom cam {z ≈ 150, net .90} luz {SKY 72%} viento {.88 → .95}
//   material  {PhotoPlane `cmed_o_516_patioVientoFuerte.jpg` a sangre · CLIP
//              `cmed_h_515_pinzaVientoFuerte.mp4` (la ropa/la camisa volando; en el acto 3 el mismo
//              plano era una FOTO de producto con luz voltio) · ISLA CALMA: FOTO
//              `cmed_h_509_agachadoPinza.jpg` · los dos vecinos de la frase, cada uno con SU
//              material: FOTO `cmed_o_520_panelSombraMediodia` = LA MEDIANERA (el hormigón está
//              literal en el cuadro) · FOTO `cmed_h_521_cierraCuaderno` = NO PASA TODOS LOS DÍAS}
//   La tesis en imagen: el TEMPORAL ocupa el mundo entero y TU PATIO es una isla quieta en el
//   centro. Alrededor el viento a .95; adentro de la tarjeta, quietud. Sobre el final la tarjeta
//   se ACUESTA (rx) y se le enciende el canto de PAPEL: ya es la hoja que levanta MovTabla.
//   exitTo ⟶ cam {z 180, panX −70, ry −6} · luz {VOLT→SKY pleno} · viento {.85}
//            materia {la tela/tarjeta que se aquieta y se vuelve PAPEL}   ⇒ entra MovTabla
//
// MATERIAL: 16 assets distintos = LOS 16 de `_v3/material_MovCubo.txt` (+4 íconos PNG). Ningún
// asset se usa más de 2 veces, y cada repetición es un PAR DELIBERADO con otra escala Y otra luz:
//   · `cmed_o_506_circuloPalas`     foto chica/ámbar (acto 1, quieta) ↔ clip héroe/voltio (acto 3)
//   · `cmed_h_515_pinzaVientoFuerte` foto de producto/voltio (acto 3) ↔ clip a sangre/sky (acto 6)
//   · `cmed_o_516_patioVientoFuerte` tarjeta del chip TEMPORAL (acto 5) ↔ plano de fondo (acto 6):
//      es la MATERIA de la frontera E, cruza el wipe siendo la misma imagen a otra escala.
//   · `cmed_o_513_ramaDespeina` y `cmed_h_504_senalaTurbina`: clip + su foto de relevo (el mp4 se
//      acaba antes que la ventana de la tarjeta; ver el techo VID_SHORT/VID_LONG más abajo).
//
// ⛔ cero Math.random / Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade.
// ⛔ Easing.quint NO EXISTE → Easing.poly(5).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVCUBO_FRAMES = 1350;

/* ── EASINGS — nunca uno solo para todo ────────────────────────────────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO (la cámara nunca tiene velocidad constante) */
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

/* ══════════════════════════════════════════════════════════════════════════════════════════
   GEOMETRÍA DEL MUNDO (1920×1080). La cámara se encarga del encuadre.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CIR_X = 742, CIR_Y = 508;      // centro del ARO: disco de barrido (acto 1) = dial (acto 2)
const R_BIG = 296;                   // radio del disco grande / del dial  ← LA MATERIA QUE CRUZA A
const R_SML = 148;                   // radio del disco chico (la turbina real)

const COL_X = 1432, COL_Y0 = 902;    // columna de 8 bloques (actos 3-4) → chapa 400 W (acto 5)
const BLK_W = 178, BLK_H = 62, BLK_G = 9;
const blkY = (i: number) => COL_Y0 - (i + 1) * BLK_H - i * BLK_G;

/* ── EL ARO — la circunferencia que sobrevive a la frontera A ──────────────────────────────── */
const SharedRing: React.FC<{ f: number; op: number; tint: string; hot: number }> = ({ f, op, tint, hot }) => {
  if (op <= 0.01) return null;
  const br = 1 + Math.sin(f / 63) * 0.006;                 // hold VIVO: el aro respira
  return (
    <g opacity={op} transform={`translate(${CIR_X} ${CIR_Y}) scale(${br.toFixed(4)}) translate(${-CIR_X} ${-CIR_Y})`}>
      <circle cx={CIR_X} cy={CIR_Y} r={R_BIG + 13} fill="none" stroke={rgba(tint, 0.1 + 0.16 * hot)} strokeWidth={26} />
      <circle cx={CIR_X} cy={CIR_Y} r={R_BIG} fill="none" stroke={rgba(tint, 0.9)} strokeWidth={5} />
      <circle cx={CIR_X} cy={CIR_Y} r={R_BIG} fill="none" stroke={rgba(V.white, 0.35)} strokeWidth={1.5} />
    </g>
  );
};

/* ── ACTO 1 · EL ÁREA DE BARRIDO — 1 cuadrante del disco grande = TODO el disco chico ───────── */
const SweepArea: React.FC<{ f: number; grow: number; quads: number; small: number; op: number; tint: string }> = ({
  f, grow, quads, small, op, tint,
}) => {
  if (op <= 0.01) return null;
  const r = R_SML + (R_BIG - R_SML) * clamp01(grow);
  // los 4 cuadrantes del disco grande: cada uno tiene EXACTAMENTE el área del disco chico
  const quad = (i: number) => {
    const a0 = (-90 + i * 90) * (Math.PI / 180);
    const a1 = (-90 + (i + 1) * 90) * (Math.PI / 180);
    return `M ${CIR_X},${CIR_Y} L ${(CIR_X + R_BIG * Math.cos(a0)).toFixed(1)},${(CIR_Y + R_BIG * Math.sin(a0)).toFixed(1)} ` +
      `A ${R_BIG},${R_BIG} 0 0 1 ${(CIR_X + R_BIG * Math.cos(a1)).toFixed(1)},${(CIR_Y + R_BIG * Math.sin(a1)).toFixed(1)} Z`;
  };
  return (
    <g opacity={op}>
      {/* rastro del disco chico creciendo: EL BARRIDO */}
      <circle cx={CIR_X} cy={CIR_Y} r={r} fill={rgba(tint, 0.07)} stroke={rgba(tint, 0.3)} strokeWidth={2} strokeDasharray="14 11" />
      {[0, 1, 2, 3].map((i) => {
        const on = clamp01(quads - i);
        if (on <= 0.01) return null;
        return (
          <g key={i} opacity={on}>
            <path d={quad(i)} fill={rgba(tint, 0.13 + 0.07 * Math.sin(f / 37 + i))} stroke={rgba(tint, 0.5)} strokeWidth={2} />
          </g>
        );
      })}
      {/* el disco chico — LA TUYA */}
      {small > 0.01 && (
        <g opacity={small}>
          <circle cx={CIR_X + R_SML * 0.72} cy={CIR_Y - R_SML * 0.72} r={R_SML}
            fill={rgba(V.amber, 0.14)} stroke={rgba(V.amber, 0.86)} strokeWidth={4} />
        </g>
      )}
      {/* el radio que se duplica: la regla del cuadrado */}
      <line x1={CIR_X} y1={CIR_Y} x2={CIR_X + R_BIG} y2={CIR_Y}
        stroke={rgba(V.white, 0.5)} strokeWidth={2.5} strokeDasharray="9 8" />
    </g>
  );
};

/* ── ACTO 2 · EL DIAL DEL VIENTO — el MISMO aro, con marcas y aguja ─────────────────────────── */
const V_MAX = 14;                                        // m/s de fondo de escala
const dialAng = (v: number) => (150 + (clamp01(v / V_MAX)) * 240) * (Math.PI / 180);
const Gauge: React.FC<{ f: number; on: number; value: number; tint: string }> = ({ f, on, value, tint }) => {
  if (on <= 0.01) return null;
  const a = dialAng(value);
  const tipX = CIR_X + (R_BIG - 26) * Math.cos(a);
  const tipY = CIR_Y + (R_BIG - 26) * Math.sin(a);
  const jit = Math.sin(f / 7) * 0.9 + Math.sin(f / 3.1) * 0.4;   // la aguja de un instrumento nunca está quieta
  return (
    <g opacity={on}>
      {/* marcas cada 1 m/s, las de 2 en 2 más largas */}
      {Array.from({ length: V_MAX + 1 }, (_, i) => {
        const aa = dialAng(i);
        const big = i % 2 === 0;
        const r0 = R_BIG - (big ? 40 : 24), r1 = R_BIG - 6;
        return (
          <line key={i}
            x1={CIR_X + r0 * Math.cos(aa)} y1={CIR_Y + r0 * Math.sin(aa)}
            x2={CIR_X + r1 * Math.cos(aa)} y2={CIR_Y + r1 * Math.sin(aa)}
            stroke={rgba(i >= 12 ? V.danger : V.white, big ? 0.72 : 0.3)} strokeWidth={big ? 4 : 2} />
        );
      })}
      {/* la zona del temporal: de 12 m/s para arriba */}
      <path
        d={`M ${CIR_X + (R_BIG - 6) * Math.cos(dialAng(12))},${CIR_Y + (R_BIG - 6) * Math.sin(dialAng(12))} ` +
          `A ${R_BIG - 6},${R_BIG - 6} 0 0 1 ${CIR_X + (R_BIG - 6) * Math.cos(dialAng(V_MAX))},${CIR_Y + (R_BIG - 6) * Math.sin(dialAng(V_MAX))}`}
        fill="none" stroke={rgba(V.danger, 0.8)} strokeWidth={9} strokeLinecap="round" />
      {/* arco recorrido */}
      <path
        d={`M ${CIR_X + (R_BIG - 46) * Math.cos(dialAng(0))},${CIR_Y + (R_BIG - 46) * Math.sin(dialAng(0))} ` +
          `A ${R_BIG - 46},${R_BIG - 46} 0 ${value / V_MAX > 0.5 ? 1 : 0} 1 ` +
          `${CIR_X + (R_BIG - 46) * Math.cos(a)},${CIR_Y + (R_BIG - 46) * Math.sin(a)}`}
        fill="none" stroke={rgba(tint, 0.66)} strokeWidth={7} strokeLinecap="round" />
      {/* LA AGUJA — el vector que arrastra la frontera B */}
      <g transform={`rotate(${jit.toFixed(2)} ${CIR_X} ${CIR_Y})`}>
        <line x1={CIR_X} y1={CIR_Y} x2={tipX} y2={tipY} stroke={rgba(V.ink0, 0.8)} strokeWidth={11} strokeLinecap="round" />
        <line x1={CIR_X} y1={CIR_Y} x2={tipX} y2={tipY} stroke={tint} strokeWidth={5} strokeLinecap="round" />
        <circle cx={tipX} cy={tipY} r={11 + Math.sin(f / 9) * 1.6} fill={tint} stroke={rgba(V.ink0, 0.85)} strokeWidth={3} />
      </g>
    </g>
  );
};

/* ── ACTOS 3-4 · LA COLUMNA DE 8 BLOQUES (los octavos) → ACTO 5 · LA CHAPA 400 W ────────────── */
const EnergyBlocks: React.FC<{ f: number; lit: number; op: number; tint: string; born: number }> = ({
  f, lit, op, tint, born,
}) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      {Array.from({ length: 8 }, (_, i) => {
        const alive = clamp01(born * 8.8 - i);
        if (alive <= 0.01) return null;
        const on = clamp01(lit - i);
        const h = BLK_H * alive;
        const y = blkY(i) + (BLK_H - h);
        const pulse = 0.5 + 0.5 * Math.sin(f / 21 + i * 0.7);
        return (
          <g key={i}>
            <rect x={COL_X - BLK_W / 2} y={y} width={BLK_W} height={h} rx={7}
              fill={rgba(V.ink0, 0.72)} stroke={rgba(V.white, 0.14)} strokeWidth={2} />
            {on > 0.01 && (
              <rect x={COL_X - BLK_W / 2} y={y} width={BLK_W} height={h} rx={7}
                fill={rgba(tint, 0.34 + 0.26 * on * pulse)} stroke={rgba(tint, 0.95 * on)} strokeWidth={3} />
            )}
          </g>
        );
      })}
      {/* la losa donde se apoya la columna: sombra de contacto */}
      <ellipse cx={COL_X} cy={COL_Y0 + 8} rx={BLK_W * 0.72} ry={13} fill={rgba(V.ink0, 0.72)} />
    </g>
  );
};

/* la chapa de especificaciones sale del MISMO recuadro del último bloque (bajo la oclusión) */
const SpecPlate: React.FC<{ f: number; grow: number; op: number }> = ({ f, grow, op }) => {
  if (op <= 0.01) return null;
  const w = lerp(BLK_W, 430, clamp01(grow));
  const h = lerp(BLK_H, 224, clamp01(grow));
  const y = lerp(blkY(0), blkY(0) + BLK_H - 224, clamp01(grow));
  const sh = Math.sin(f / 47) * 2;
  return (
    <g opacity={op} transform={`translate(0 ${sh.toFixed(2)})`}>
      <rect x={COL_X - w / 2} y={y} width={w} height={h} rx={9}
        fill={rgba(V.bone, 0.94)} stroke={rgba(V.ink0, 0.6)} strokeWidth={3} />
      <rect x={COL_X - w / 2 + 9} y={y + 9} width={w - 18} height={h - 18} rx={5}
        fill="none" stroke={rgba(V.ink0, 0.35)} strokeWidth={2} />
      {/* remaches: es una chapa, no un rectángulo */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx2, sy2], i) => (
        <circle key={i} cx={COL_X + sx2 * (w / 2 - 20)} cy={y + (sy2 < 0 ? 20 : h - 20)} r={5}
          fill={rgba(V.ink0, 0.5)} />
      ))}
    </g>
  );
};

/* ── el arco de punta de pala (acto 3): la aguja de la frontera B se vuelve esto ────────────── */
const BladeArc: React.FC<{ f: number; cx: number; cy: number; r: number; speed: number; op: number; tint: string }> = ({
  f, cx, cy, r, speed, op, tint,
}) => {
  if (op <= 0.01) return null;
  const rot = f * (1.1 + speed * 13);
  return (
    <g opacity={op}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={rgba(tint, 0.16 + 0.2 * speed)} strokeWidth={3} strokeDasharray="4 26" />
      <g transform={`rotate(${(rot % 360).toFixed(2)} ${cx} ${cy})`}>
        {[0, 120, 240].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <path key={a}
              d={`M ${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)} ` +
                `A ${r},${r} 0 0 1 ${cx + r * Math.cos(rad + 0.62 + speed * 0.9)},${cy + r * Math.sin(rad + 0.62 + speed * 0.9)}`}
              fill="none" stroke={rgba(V.blade, 0.24 + 0.5 * speed)} strokeWidth={7 + speed * 5} strokeLinecap="round" />
          );
        })}
      </g>
    </g>
  );
};

/* ── polvo de primer plano (profundidad real, nunca quieto) ─────────────────────────────────── */
const Grit: React.FC<{ f: number; n: number; seed: number; tint: string; op: number; drive: number }> = ({
  f, n, seed, tint, op, drive,
}) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
      const x = ((a * 128 - 14 + f * (0.06 + drive * 0.9) * (0.4 + b)) % 128 + 128) % 128 - 14;
      const y = a * 106 - 3 + Math.sin(f / (52 + b * 60) + i) * (1.4 + drive * 5);
      const d = 2 + b * 5.2;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: d * (1 + drive * 2.2), height: d, borderRadius: "50%",
          background: rgba(tint, 0.5), opacity: (0.16 + a * 0.55) * op,
        }} />
      );
    })}
  </div>
);

/* ── tarjeta de MATERIAL REAL: el clip corre `vid` frames y después pasa a la foto del mismo
      plano (así NUNCA se congela ni se pasa de largo del mp4) ──────────────────────────────── */
type CardGeo = {
  w: number; h: number; x: number; y: number; z: number; ry?: number; rx?: number; rot?: number;
  radius?: number; label?: string; lit: number; litColor?: string; opacity: number;
};
// ⚠️ `clip`/`still` van como STRINGS LITERALES en cada uso (nunca por template literal): el
// escáner de assets del build lee los .tsx en crudo y un `${}` le queda invisible → 404 en el farm.
// ⚠️⚠️ TECHO REAL DE LOS MP4 (medido con ffprobe, no supuesto): los clips de `cmeduelo` están a
// 24 fps → `cmed_o_506_circuloPalas` y `cmed_o_513_ramaDespeina` duran 4,04 s = **121 frames de
// comp a 30 fps**; `cmed_h_504_senalaTurbina` y `cmed_h_515_pinzaVientoFuerte`, 5,04 s = **151**.
// Pasarse de ahí congela el último frame (muerte del hold vivo). Por eso `vid` ≤ 118 / ≤ 148.
// `still` es OPCIONAL: sin él la tarjeta es de CLIP PURO y su ventana no puede exceder `vid`.
const VID_SHORT = 118;   // techo seguro para los mp4 de 4,04 s
const VID_LONG = 148;    // techo seguro para los mp4 de 5,04 s
const RealCard: React.FC<{ f: number; clip: string; still?: string; mount: number; out: number; vid?: number } & CardGeo> = ({
  f, clip, still, mount, out, vid = VID_SHORT, ...geo
}) => {
  if (f < mount || f >= out) return null;
  const swap = mount + vid;
  if (f < swap) {
    return (
      <Sequence from={mount} durationInFrames={vid} layout="none">
        <MediaCard src={clip} kind="video" sheenAt={14} {...geo} />
      </Sequence>
    );
  }
  if (!still) return null;
  return (
    <Sequence from={swap} durationInFrames={Math.max(2, out - swap)} layout="none">
      <MediaCard src={still} kind="photo" sheenAt={0} {...geo} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovCubo: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const f = useCurrentFrame();
  /** todos los anclajes son FRACCIONES de la duración: el movimiento sobrevive al re-anclaje */
  const A = (x: number) => Math.round(D * x);

  /* ── anclas del guion (s083 → s094) ──────────────────────────────────────────────────────── */
  const K = {
    a1: 0,               // s083 "si duplicas el tamaño…"
    x4: A(0.142),        //      "…tienes cuatro veces"
    a2: A(0.2),          // s084 "la segunda es la velocidad del viento…"
    cubo: A(0.322),      // s085 "Al cubo."
    lee: A(0.358),       // s086 "léelo despacio…"  (el único respiro)
    a3: A(0.415),        // s087 "si el viento se duplica…"
    x8: A(0.532),        //      "…se multiplica por ocho"
    a4: A(0.573),        // s088 "y al revés… si el viento se reduce a la mitad"
    oct: A(0.662),       // s089 "te queda una octava parte"
    a5: A(0.715),        // s090/s091 la caja de 400 W
    ms12: A(0.8),        //      "a doce metros por segundo"
    kmh: A(0.822),       //      "que son cuarenta y tres kilómetros por hora"
    temp: A(0.845),      // s092 "eso es un temporal"
    a6: A(0.865),        // s093 "el viento que te vuela la ropa del tender"
    patio: A(0.905),     // s094 "…no pasa a dos metros de altura…"
    end: D,
  };

  /* ══ LA CÁMARA — UNA sola. El reloj se deforma por acto (easing nunca constante) pero es
        MONÓTONO: z va de 0 a 180 y no retrocede ni un frame. ═══════════════════════════════ */
  const clk = keyed(f,
    [0, K.x4, K.a2, K.cubo, K.lee, K.a3, K.x8, K.a4, K.oct, K.a5, K.ms12, K.a6, K.patio, D],
    [0, A(0.11), A(0.205), A(0.318), A(0.352), A(0.43), A(0.55), A(0.585), A(0.668), A(0.73), A(0.805), A(0.872), A(0.918), D],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.lin, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.soft, EZ.glide]);
  const g = gcam(clk, { z0: 0, z1: 180, panX: -70, ry: -6, rx: 2.2, dur: D });
  const mag = 1500 / (1500 - g.z);

  /* encuadre: qué punto del MUNDO va al centro, y a qué aumento neto (macro → producto → general) */
  const net = keyed(f,
    [0, A(0.05), K.x4, K.a2, K.cubo, K.lee, K.a3, A(0.46), K.x8, K.a4, K.oct, A(0.706), K.a5, K.ms12, K.temp, K.a6, K.patio, D],
    [0.86, 1.14, 1.02, 1.0, 1.16, 1.2, 1.24, 1.0, 0.94, 0.94, 1.06, 1.3, 1.02, 1.12, 0.94, 0.9, 0.84, 0.9],
    [EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.glide]);
  const fx = keyed(f,
    [0, A(0.05), K.a2, K.cubo, K.a3, A(0.47), K.x8, K.a4, K.oct, A(0.706), K.a5, K.ms12, K.a6, K.patio, D],
    [960, 800, CIR_X, CIR_X, CIR_X + 120, 900, 1120, 1120, COL_X - 40, COL_X, COL_X - 90, COL_X - 40, 1010, 960, 960],
    [EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.glide, EZ.push, EZ.lin, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.glide, EZ.soft]);
  const fy = keyed(f,
    [0, A(0.05), K.a2, K.a3, A(0.47), K.x8, K.a4, K.oct, A(0.706), K.a5, K.ms12, K.a6, K.patio, D],
    [540, 470, CIR_Y, CIR_Y - 20, 540, 620, 620, 680, blkY(0) + 24, 640, 620, 560, 540, 540],
    [EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.lin, EZ.soft, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);
  const ws = net / mag;                                   // escala del mundo para dar el encuadre pedido
  const panX = 960 - fx, panY = 540 - fy;
  /** mundo → pantalla (para clavar las cifras del kit al lado de su gráfico, en espacio de PANTALLA) */
  const sx = (X: number) => ((960 + net * (X - fx)) / 1920) * 100;
  const sy = (Y: number) => ((540 + net * (Y - fy)) / 1080) * 100;

  /* ══ LA LUZ — un solo viaje: VOLTIO frío (la medición) → SKY (el gris del temporal) ═══════ */
  const stage = keyed(f, [0, K.a3, K.a4, A(0.7), K.a5, K.temp, K.a6, D], [0, 0, 0.18, 0.34, 0.4, 0.72, 0.82, 1],
    [EZ.lin, EZ.push, EZ.soft, EZ.lin, EZ.push, EZ.soft, EZ.glide]);
  const tint = light(stage, "volt", "sky");
  const keyLift = keyed(f, [0, K.a2, K.a3, K.a4, K.a5, K.a6, D], [0.18, 0.21, 0.28, 0.36, 0.48, 0.64, 0.78], EZ.soft);
  const inten = keyed(f, [0, K.a2, K.x8, K.a4, K.oct, K.a5, K.temp, K.a6, D],
    [0.92, 1.0, 1.16, 1.04, 0.86, 1.0, 1.14, 1.06, 0.94], EZ.soft);

  /* ══ EL VIENTO — la columna vertebral. Es LITERAL: se VE la diferencia. ═══════════════════ */
  const wind = keyed(f,
    [0, K.a2, K.cubo, K.lee, K.a3, A(0.5), K.x8, K.a4, A(0.6), K.oct, A(0.706), K.a5, K.ms12, K.temp, K.a6, K.patio, D],
    [0.15, 0.2, 0.3, 0.36, 0.42, 0.6, 0.8, 0.8, 0.42, 0.34, 0.34, 0.4, 0.66, 0.88, 0.95, 0.9, 0.85],
    [EZ.soft, EZ.push, EZ.lin, EZ.glide, EZ.push, EZ.expo, EZ.lin, EZ.snap, EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.push, EZ.soft, EZ.lin, EZ.soft]);
  const windTint = stage < 0.5 ? V.white : V.sky;

  /* ══ EL ARO (materia de la frontera A) y sus dos oficios ═════════════════════════════════ */
  const ringOp = keyed(f, [A(0.03), A(0.06), K.a3 - 26, K.a3 + 6], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const ringHot = keyed(f, [0, K.x4, K.a2, K.cubo, K.a3], [0.2, 1, 0.5, 0.9, 0.4], EZ.soft);
  // acto 1
  const grow = keyed(f, [A(0.055), A(0.1), K.x4 - 10], [0, 0.55, 1], [EZ.push, EZ.snap]);
  const quads = keyed(f, [K.x4 - 14, K.x4, K.x4 + 8, K.x4 + 16, K.x4 + 24, K.a2 - 20, K.a2 - 2],
    [0, 1, 2, 3, 4, 4, 0], [EZ.push, EZ.snap, EZ.snap, EZ.snap, EZ.lin, EZ.push]);
  const smallOp = keyed(f, [A(0.03), A(0.06), K.x4 - 6, K.x4 + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const areaOp = keyed(f, [A(0.03), A(0.06), K.a2 - 14, K.a2 + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  // acto 2 — el mismo aro, ahora dial
  const dialOn = keyed(f, [K.a2 - 8, K.a2 + 18, K.a3 - 18, K.a3 + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const dialV = keyed(f, [K.a2, K.a2 + 40, K.cubo - 12, K.cubo + 10, K.lee, K.a3 + 14],
    [1.9, 2.4, 5.4, 8.2, 9.1, 12.4], [EZ.soft, EZ.push, EZ.snap, EZ.lin, EZ.push]);

  /* ══ LA COLUMNA DE 8 BLOQUES (materia de la frontera C) → LA CHAPA 400 W ═════════════════ */
  const blkBorn = keyed(f, [K.a3 + 26, K.a3 + 76], [0, 1], EZ.push);
  const blkLit = keyed(f, [K.a3 + 40, K.x8 - 12, K.x8, K.x8 + 12, K.a4, K.a4 + 46, K.oct - 8],
    [1, 1, 3.4, 8, 8, 2.1, 1], [EZ.lin, EZ.push, EZ.snap, EZ.lin, EZ.push, EZ.soft]);
  const blkOp = keyed(f, [K.a3 + 20, K.a3 + 40, A(0.708), A(0.716)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin]);
  const plateGrow = keyed(f, [A(0.716), A(0.752)], [0, 1], EZ.snap);
  const plateOp = keyed(f, [A(0.714), A(0.722), K.temp - 10, K.temp + 8], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);

  /* ══ ACTO 3/4 — la turbina que acelera y frena ═══════════════════════════════════════════ */
  const spin = keyed(f, [K.a3, A(0.5), K.x8, K.a4, K.a4 + 40, K.oct], [0.12, 0.5, 1, 1, 0.16, 0.04],
    [EZ.push, EZ.expo, EZ.lin, EZ.snap, EZ.soft]);
  const arcOp = keyed(f, [K.a3 + 8, K.a3 + 30, K.oct + 20, K.oct + 44], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);

  /* ══ ACTO 6 — la isla quieta adentro del temporal, que se acuesta y se vuelve PAPEL ══════ */
  const islandIn = keyed(f, [K.patio - 12, K.patio + 22], [0, 1], EZ.snap);
  const paper = keyed(f, [D - 82, D - 6], [0, 1], EZ.soft);

  /* ── parallax del texto (vive en espacio de pantalla, pero acompaña a la cámara) ─────────── */
  const paraX = -panX * 0.014, paraY = -panY * 0.011;
  const txt = (from: number, to: number, rise = 30) => {
    const inn = clamp01((f - from) / 14), out = clamp01((f - (to - 18)) / 18);
    return {
      on: f > from && f < to,
      style: {
        position: "absolute" as const, left: 96, bottom: 108,
        transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(rise, 0, EZ.snap(inn)).toFixed(1)}px)`,
        opacity: inn * (1 - out),
      },
    };
  };
  const t1 = txt(A(0.022), K.a2 - 8);
  const t2 = txt(K.a2 + 16, K.a3 - 10);
  const t3 = txt(K.a3 + 18, K.a4 - 8);
  const t4 = txt(K.a4 + 12, A(0.702));
  const t5 = txt(K.a5 + 16, K.a6 - 8);
  const t6 = txt(K.a6 + 14, D - 4);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los ~1350 frames. NUNCA se remonta. ═══════ */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={keyLift} intensity={inten} floor={lerp(0.55, 0.42, stage)} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══════════════════════════════════════════════ */}
      <Layers cam={g.transform}>
        {/* ── PLANO 1 (z −560): la placa de material real a sangre ── */}
        {f < K.a6 - 4 ? (
          <PhotoPlane src="img/cmeduelo/cmed_o_505_turbinaYPanel.jpg" z={-560}
            scale={keyed(f, [0, K.a3, K.a5, K.a6], [1.5, 1.34, 1.24, 1.18], EZ.soft)}
            dim={keyed(f, [0, K.a2, K.a5, K.a6], [0.52, 0.6, 0.56, 0.5], EZ.soft)} tint={tint} />
        ) : (
          <PhotoPlane src="img/cmeduelo/cmed_o_516_patioVientoFuerte.jpg" z={-560}
            scale={keyed(f, [K.a6, K.patio, D], [1.42, 1.26, 1.18], EZ.soft)}
            dim={keyed(f, [K.a6, K.patio, D], [0.4, 0.5, 0.56], EZ.soft)} tint={V.sky} />
        )}

        {/* ── PLANO 2 (z −360): el viento LEJANO (parallax propio, va más lento) ── */}
        <Plane z={-360}>
          <WindField speed={wind * 0.72} tint={windTint} count={18} opacity={0.6} />
          <div style={{
            position: "absolute", left: "4%", top: "-2%", width: "62%", height: "58%",
            background: `radial-gradient(58% 58% at 32% 22%, ${rgba(tint, 0.1)} 0%, rgba(0,0,0,0) 72%)`,
          }} />
        </Plane>

        {/* ── EL MUNDO ESCALADO (todo lo que la cámara encuadra) ── */}
        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── PLANO 3 (z −60): EL ESQUELETO GRÁFICO. Acá los vectores SÍ son legítimos:
                 un área de barrido es un círculo, un dial es un dial, una barra es una barra. ── */}
          <Plane z={-60}>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <SweepArea f={f} grow={grow} quads={quads} small={smallOp} op={areaOp} tint={V.volt} />
              <Gauge f={f} on={dialOn} value={dialV} tint={tint} />
              <SharedRing f={f} op={ringOp} tint={tint} hot={ringHot} />
              <EnergyBlocks f={f} lit={blkLit} op={blkOp} tint={stage < 0.3 ? V.volt : V.amber} born={blkBorn} />
              <SpecPlate f={f} grow={plateGrow} op={plateOp} />
              {arcOp > 0.01 && (
                <BladeArc f={f} cx={905} cy={470} r={268} speed={spin} op={arcOp} tint={tint} />
              )}
            </svg>
          </Plane>

          {/* ── PLANO 4 (z +40): íconos PNG sin fondo como OBJETOS de la escena ── */}
          <Plane z={40}>
            {f > K.a2 - 10 && f < K.a3 && (
              <IconPng src="img/cmeduelo/cmed_ic_anemometro.png"
                x={(CIR_X / 1920) * 100} y={((CIR_Y - 34) / 1080) * 100}
                size={lerp(118, 146, clamp01((f - K.a2) / 90))} z={30}
                opacity={keyed(f, [K.a2 - 10, K.a2 + 14, K.a3 - 20, K.a3], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])}
                glow={V.ink0} />
            )}
            {f > K.a2 + 30 && f < K.a3 - 10 && (
              <IconPng src="img/cmeduelo/cmed_ic_viento.png" x={19} y={22} size={104} z={70}
                rot={-8}
                opacity={keyed(f, [K.a2 + 30, K.a2 + 54, K.a3 - 30, K.a3 - 10], [0, 0.9, 0.9, 0], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.a5 - 4 && f < K.temp && (
              <IconPng src="img/cmeduelo/cmed_ic_caja.png"
                x={(( COL_X - 330) / 1920) * 100} y={((blkY(0) - 66) / 1080) * 100}
                size={lerp(150, 186, clamp01((f - K.a5) / 120))} z={90} rot={-4}
                opacity={keyed(f, [K.a5 - 4, K.a5 + 22, K.temp - 22, K.temp], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.temp - 6 && (
              <IconPng src="img/cmeduelo/cmed_ic_tormenta.png" x={80} y={16} size={132} z={110} rot={6}
                opacity={keyed(f, [K.temp - 6, K.temp + 20, K.patio + 20, K.patio + 60], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])}
                glow={V.ink0} />
            )}
          </Plane>

          {/* ── PLANO 5 (z +120): LAS TARJETAS DE MATERIAL REAL — el caballo de batalla ── */}
          <Plane z={120}>
            {/* ▸ MATERIA QUE ENTRA del plano anterior: la pala que Claudio acaba de medir.
                   EL MISMO VIDRIO (mismo x/y/z/tamaño) pasa después al banco del garaje: no es
                   otra tarjeta, es la misma cristalera contando el segundo beat del banco. */}
            <MediaCard src="img/cmeduelo/cmed_h_508_midePala.jpg" kind="photo"
              w={430} h={266} x={20.5} y={24} z={-60} ry={13} radius={12} label="LA PALA MEDIDA"
              lit={0.86} litColor={V.volt} sheenAt={6}
              opacity={keyed(f, [0, 8, A(0.1), A(0.132)], [0.35, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            <MediaCard src="img/cmeduelo/cmed_h_501_reglaGaraje.jpg" kind="photo"
              w={430} h={266} x={20.5} y={24} z={-60} ry={13} radius={12} label="EL BANCO DEL GARAJE"
              lit={0.9} litColor={V.volt} sheenAt={A(0.15)}
              opacity={keyed(f, [A(0.118), A(0.15), K.a2 - 22, K.a2 - 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 1 · LA TUYA — mitad 1 del PAR DELIBERADO. Acá la turbina está QUIETA
                   (patio a viento .15): va la FOTO, chica y lateral, con luz ÁMBAR. En el acto 3
                   vuelve el MISMO objeto pero en CLIP, a escala de héroe y con luz VOLTIO: el
                   propio material cuenta el arco del viento. Un solo uso de la foto acá. */}
            <MediaCard src="img/cmeduelo/cmed_o_506_circuloPalas.jpg" kind="photo"
              w={392} h={240} x={24.5} y={68} z={60} ry={11} radius={12} label="LA TUYA · QUIETA"
              lit={0.9} litColor={V.amber} sheenAt={A(0.062)}
              opacity={keyed(f, [A(0.028), A(0.05), K.a2 - 14, K.a2 + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 1 · EL DOBLE (foto real de las dos palas de distinto tamaño) */}
            <MediaCard src="img/cmeduelo/cmed_o_507_dosPalasTamano.jpg" kind="photo"
              w={512} h={316} x={77} y={64} z={170} ry={-13} radius={12} label="EL DOBLE DE PALA"
              lit={1} litColor={V.volt} sheenAt={A(0.1)}
              opacity={keyed(f, [A(0.055), A(0.085), K.a2 - 14, K.a2 + 6], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 2 · la rama del limonero despeinándose: el anemómetro del mundo real */}
            <RealCard f={f} clip="broll/cmeduelo/cmed_o_513_ramaDespeina.mp4" still="img/cmeduelo/cmed_o_513_ramaDespeina.jpg" mount={K.a2 + 12} out={K.a3 + 10} vid={VID_SHORT}
              w={470} h={290} x={78} y={70} z={200} ry={-14} radius={12} label="EL VIENTO DE VERDAD"
              lit={0.96} litColor={V.volt}
              opacity={keyed(f, [K.a2 + 12, K.a2 + 34, K.a3 - 16, K.a3 + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 2 · el respiro "léelo despacio": Claudio señalando EL CUADERNO DE NÚMEROS.
                   Es la frase literal del guion — lo único que hay que entender está escrito ahí. */}
            <MediaCard src="img/cmeduelo/cmed_h_503_cuadernoNumeros.jpg" kind="photo"
              w={376} h={232} x={33} y={31} z={40} ry={14} radius={12} label="LÉELO DESPACIO"
              lit={0.88} litColor={V.volt} sheenAt={K.lee + 8}
              opacity={keyed(f, [K.lee - 16, K.lee + 10, K.a3 - 26, K.a3 - 6], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 3 · LA TURBINA A ESCALA DE HÉROE (mismo clip que el acto 1, otra escala y otra luz)
                   — entra ARRASTRADA por la punta de la aguja (frontera B, MATCH-MOVE) */}
            <RealCard f={f} clip="broll/cmeduelo/cmed_o_506_circuloPalas.mp4"
              mount={K.a3 - 12} out={K.a3 - 12 + VID_SHORT} vid={VID_SHORT}
              w={lerp(560, 690, clamp01((f - K.a3) / 120))} h={lerp(340, 418, clamp01((f - K.a3) / 120))}
              x={lerp(63, 47, clamp01((f - (K.a3 - 12)) / 34))} y={44} z={90} ry={7} radius={13}
              label="LA MISMA TURBINA, MÁS VIENTO" lit={1} litColor={V.volt}
              opacity={keyed(f, [K.a3 - 12, K.a3 + 12, K.a3 + VID_SHORT - 40, K.a3 - 12 + VID_SHORT], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 3 · el beat del ×8 lo toma LA PINZA CON VIENTO FUERTE: la medición en el
                   viento de verdad es exactamente lo que dice la frase. Tarjeta de producto con
                   luz VOLTIO; en el acto 6 vuelve el MISMO plano pero en CLIP, a sangre y con luz
                   SKY dentro del temporal (otra escala Y otra luz). */}
            <MediaCard src="img/cmeduelo/cmed_h_515_pinzaVientoFuerte.jpg" kind="photo"
              w={470} h={290} x={74} y={40} z={170} ry={-12} radius={13}
              label="LA PINZA, CON VIENTO DE VERDAD" lit={0.96} litColor={V.volt} sheenAt={K.x8 - 20}
              opacity={keyed(f, [K.x8 - 66, K.x8 - 36, K.a4 - 10, K.a4 + 8], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 4 · la foto QUIETA: Claudio al lado de la turbina en la brisa real del patio */}
            <MediaCard src="img/cmeduelo/cmed_h_511_juntoTurbinaBrisa.jpg" kind="photo"
              w={604} h={372} x={40} y={42} z={70} ry={9} radius={13} label="TU PATIO, TU BRISA"
              lit={0.9} litColor={V.sky} sheenAt={K.oct - 20}
              opacity={keyed(f, [K.a4 - 2, K.a4 + 18, A(0.7), A(0.71)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 4 · la cuenta que castiga, en macro: las columnas del cuaderno. */}
            <MediaCard src="img/cmeduelo/cmed_o_510_cuadernoCerca.jpg" kind="photo"
              w={330} h={330} x={76} y={64} z={90} ry={-15} radius={12} label="LA CUENTA"
              lit={0.84} litColor={V.amber} sheenAt={K.oct + 6}
              opacity={keyed(f, [K.oct - 22, K.oct + 4, A(0.69), A(0.702)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 5 · Claudio señalando la turbina: "esa turbina que dice cuatrocientos vatios" */}
            <RealCard f={f} clip="broll/cmeduelo/cmed_h_504_senalaTurbina.mp4" still="img/cmeduelo/cmed_h_504_senalaTurbina.jpg" mount={K.a5 + 8} out={K.temp + 6} vid={VID_LONG}
              w={520} h={320} x={25} y={44} z={150} ry={13} radius={13} label="ESA QUE DICE 400 W"
              lit={0.94} litColor={V.sky}
              opacity={keyed(f, [K.a5 + 8, K.a5 + 30, K.temp - 14, K.temp + 6], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 5 · el aplomo de "la caja no miente": Claudio de brazos cruzados. */}
            <MediaCard src="img/cmeduelo/cmed_h_519_panelTranquilo.jpg" kind="photo"
              w={400} h={246} x={74} y={25} z={60} ry={-11} radius={12} label="NO MIENTE: OMITE"
              lit={0.88} litColor={V.sky} sheenAt={K.ms12 + 10}
              opacity={keyed(f, [K.ms12 - 14, K.ms12 + 12, K.temp - 26, K.temp - 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 5 → 6 · LA MATERIA DE LA FRONTERA E: el patio doblado por el viento.
                   Acá es la cama del chip TEMPORAL; después del wipe es el fondo a sangre. */}
            <MediaCard src="img/cmeduelo/cmed_o_516_patioVientoFuerte.jpg" kind="photo"
              w={lerp(470, 760, clamp01((f - K.temp) / 46))} h={lerp(290, 470, clamp01((f - K.temp) / 46))}
              x={lerp(74, 60, clamp01((f - K.temp) / 46))} y={lerp(58, 50, clamp01((f - K.temp) / 46))}
              z={210} ry={-9} radius={13} lit={1} litColor={V.sky} sheenAt={K.temp + 4}
              opacity={keyed(f, [K.temp - 16, K.temp + 4, K.a6 - 2, K.a6 + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 6 · "el viento que te vuela la ropa del tender" — la camisa de Claudio volando */}
            <RealCard f={f} clip="broll/cmeduelo/cmed_h_515_pinzaVientoFuerte.mp4"
              mount={K.a6 + 2} out={K.patio + 46} vid={VID_LONG}
              w={720} h={430} x={53} y={48} z={130} ry={-6} radius={13} label="ESO ES UN TEMPORAL"
              lit={1} litColor={V.sky}
              opacity={keyed(f, [K.a6 + 2, K.a6 + 20, K.patio + 16, K.patio + 46], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 6 · LA ISLA QUIETA: tu patio, a dos metros de altura, adentro de la tormenta.
                   Sobre el final se ACUESTA y se le enciende el canto de PAPEL: ya es la hoja
                   que levanta MovTabla. (⇒ materia del handoff) */}
            {f > K.patio - 14 && (
              <>
                <MediaCard src="img/cmeduelo/cmed_h_509_agachadoPinza.jpg" kind="photo"
                  w={lerp(560, 690, islandIn) * lerp(1, 1.08, paper)}
                  h={lerp(344, 424, islandIn) * lerp(1, 0.9, paper)}
                  x={lerp(52, 50, islandIn)} y={lerp(50, 49, islandIn)}
                  z={lerp(240, 300, islandIn)} ry={lerp(-7, -3, islandIn)} rx={lerp(0, 27, paper)}
                  radius={13} label="TU PATIO · 2 METROS DE ALTURA"
                  lit={1} litColor={V.volt} sheenAt={K.patio + 10}
                  opacity={islandIn} />
                {/* el canto de PAPEL que se enciende debajo de la tarjeta acostada */}
                {paper > 0.01 && (
                  <div style={{
                    position: "absolute", left: "50%", top: `${lerp(49, 62, paper).toFixed(2)}%`,
                    width: lerp(560, 760, paper), height: lerp(6, 26, paper),
                    marginLeft: -lerp(560, 760, paper) / 2, borderRadius: 4,
                    transform: `translateZ(${lerp(240, 306, islandIn).toFixed(0)}px)`,
                    background: `linear-gradient(180deg, ${rgba(V.bone, 0.96)} 0%, ${rgba(V.concrete, 0.72)} 100%)`,
                    boxShadow: `0 18px 44px ${rgba(V.ink0, 0.8)}`,
                    opacity: paper,
                  }} />
                )}
              </>
            )}

            {/* ▸ ACTO 6 · "entre la casa, la medianera del vecino y el limonero": los dos
                   vecinos del patio, cada uno con SU material, flanqueando la isla quieta.
                   ⚠️ z bajo (120): con z 330 la perspectiva los sacaba de la safe area. */}
            {f > K.patio + 4 && (
              <MediaCard src="img/cmeduelo/cmed_o_520_panelSombraMediodia.jpg" kind="photo"
                w={252} h={252} x={22} y={70} z={120} ry={17} radius={10} label="LA MEDIANERA"
                lit={0.82} litColor={V.sky} sheenAt={K.patio + 24}
                opacity={keyed(f, [K.patio + 4, K.patio + 26, D - 26, D - 4], [0, 0.96, 0.96, 0.5], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.patio + 18 && (
              <MediaCard src="img/cmeduelo/cmed_h_521_cierraCuaderno.jpg" kind="photo"
                w={264} h={164} x={78} y={72} z={120} ry={-17} radius={10} label="NO PASA TODOS LOS DÍAS"
                lit={0.82} litColor={V.volt} sheenAt={K.patio + 38}
                opacity={keyed(f, [K.patio + 18, K.patio + 40, D - 26, D - 4], [0, 0.96, 0.96, 0.5], [EZ.push, EZ.lin, EZ.soft])} />
            )}
          </Plane>

          {/* ── PLANO 6 (z +300): el viento CERCANO (parallax propio, va más rápido) ── */}
          <Plane z={300}>
            <WindField speed={wind} tint={windTint} count={14} opacity={0.95} />
          </Plane>
        </AbsoluteFill>

        {/* ── PLANO 7 (z +430): tierra y polvo del patio en primerísimo plano ── */}
        <Plane z={430}>
          <Grit f={f} n={18} seed={11} tint={stage < 0.4 ? V.white : V.concrete} op={0.55 + wind * 0.4} drive={wind} />
        </Plane>
      </Layers>

      {/* ══════════════ LAS CIFRAS — las escribe SIEMPRE el kit, nunca el motor de imagen ══════ */}
      {/* ACTO 1 · ×1 → ×4 (el contador del área de barrido) */}
      {f > A(0.06) && f < K.a2 - 6 && (
        <Readout value={f < K.x4 ? "×1" : "×4"} label="ENERGÍA DEL BARRIDO"
          at={f < K.x4 ? A(0.06) : K.x4} x={sx(CIR_X)} y={sy(CIR_Y + R_BIG + 118)}
          size={f < K.x4 ? 104 : 152} color={f < K.x4 ? V.white : V.volt} />
      )}
      {/* ACTO 2 · la lectura del dial + el exponente ³ */}
      {f > K.a2 + 20 && f < K.a3 - 6 && (
        <Readout value={dialV.toFixed(1).replace(".", ",")} unit="m/s" label="VELOCIDAD DEL VIENTO"
          at={K.a2 + 20} x={sx(CIR_X)} y={sy(CIR_Y + R_BIG + 122)} size={98} color={tint} />
      )}
      {f > K.cubo - 2 && f < K.a3 - 10 && (
        <div style={{
          position: "absolute", left: `${sx(CIR_X + 300).toFixed(2)}%`, top: `${sy(CIR_Y - 250).toFixed(2)}%`,
          transform: `translate(-50%,-50%) scale(${lerp(0.62, 1, EZ.snap(clamp01((f - K.cubo) / 12))).toFixed(3)})`,
          opacity: clamp01((f - K.cubo + 2) / 10) * (1 - clamp01((f - (K.a3 - 34)) / 24)),
          display: "flex", alignItems: "flex-start",
        }}>
          <Num size={214} color={V.volt}>v</Num>
          <div style={{ marginTop: -28 }}><Num size={136} color={V.amber}>3</Num></div>
        </div>
      )}
      {/* ACTO 3 · los vatios saltan ×8 */}
      {f > K.a3 + 46 && f < K.a4 + 4 && (
        <Readout value={f < K.x8 ? "3,6" : "28,8"} unit="W" label={f < K.x8 ? "AHORA" : "×8 · EL VIENTO SE DUPLICÓ"}
          at={f < K.x8 ? K.a3 + 46 : K.x8} x={sx(COL_X)} y={sy(blkY(7) - 132)}
          size={f < K.x8 ? 104 : 142} color={f < K.x8 ? V.white : V.volt} />
      )}
      {/* ACTO 4 · se desploma a 1/8 */}
      {f > K.a4 + 30 && f < A(0.708) && (
        <Readout value={f < K.oct ? "0,45" : "1/8"} unit={f < K.oct ? "W" : undefined}
          label={f < K.oct ? "MITAD DE VIENTO" : "TE QUEDA UNA OCTAVA PARTE"}
          at={f < K.oct ? K.a4 + 30 : K.oct} x={sx(COL_X)} y={sy(blkY(7) - 132)}
          size={f < K.oct ? 110 : 168} color={f < K.oct ? V.danger : V.amber} />
      )}
      {/* ACTO 5 · la chapa: 400 W · 12 m/s · 43 km/h */}
      {f > A(0.726) && f < K.temp - 2 && (
        <div style={{
          position: "absolute", left: `${sx(COL_X).toFixed(2)}%`, top: `${sy(blkY(0) - 92).toFixed(2)}%`,
          transform: "translate(-50%,-50%)", textAlign: "center",
          opacity: clamp01((f - A(0.726)) / 12) * (1 - clamp01((f - (K.temp - 20)) / 18)),
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9, color: V.ink0,
            letterSpacing: 2,
          }}>400 W</div>
          <div style={{
            fontFamily: F_BODY, fontWeight: 700, fontSize: 27, letterSpacing: 3.4, marginTop: 4,
            color: rgba(V.ink0, 0.66), textTransform: "uppercase",
          }}>ETIQUETA DE FÁBRICA</div>
        </div>
      )}
      {f > K.ms12 - 2 && f < K.a6 - 6 && (
        <Readout value="12" unit="m/s" label="LA LETRA CHICA" at={K.ms12}
          x={26} y={20} size={126} color={V.volt} />
      )}
      {f > K.kmh - 2 && f < K.a6 - 6 && (
        <Readout value="43" unit="km/h" label="SOSTENIDOS" at={K.kmh}
          x={26} y={32.5} size={126} color={V.danger} />
      )}
      {/* ACTO 5 · el chip TEMPORAL */}
      {f > K.temp - 2 && f < K.patio + 30 && (
        <div style={{
          position: "absolute", left: "50%", top: "14%",
          transform: `translate(-50%,-50%) scale(${lerp(0.8, 1, EZ.snap(clamp01((f - K.temp) / 10))).toFixed(3)}) rotate(${(Math.sin(f / 29) * 0.9).toFixed(2)}deg)`,
          opacity: clamp01((f - K.temp + 2) / 10) * (1 - clamp01((f - (K.patio + 12)) / 18)),
          padding: "14px 34px", borderRadius: 10,
          background: `linear-gradient(180deg, ${rgba(V.danger, 0.95)} 0%, ${rgba(V.danger, 0.78)} 100%)`,
          boxShadow: `0 18px 52px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.4)}`,
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: 6,
          color: V.ink0, textTransform: "uppercase", whiteSpace: "nowrap",
        }}>ESO ES UN TEMPORAL</div>
      )}

      {/* ══════════════ LAS COSTURAS (una distinta por frontera · ⛔ NUNCA un fade) ══════════ */}
      {/* FRONTERA C @ .573 · CORTE EN EL BEAT — los 8 bloques sobreviven al corte */}
      <SeamFlash at={K.a4} color={V.volt} dur={5} />
      {/* FRONTERA D @ .712 · OCLUSIÓN — la CAJA cruza. Color = CARTÓN (la materia), no el fondo. */}
      <SeamOcclude at={A(0.715) - 3} dur={14} color="#9C7A4E" angle={-7} />
      {/* FRONTERA E @ .858 · WIPE POR MATERIA — el polvo que levanta el temporal */}
      <SeamWipeMatter at={A(0.858)} dur={22} tint={V.concrete} />
      {/* golpe seco en "por ocho" y en "una octava parte" (beats de cifra, no fronteras) */}
      <SeamFlash at={K.x8} color={V.volt} dur={6} />
      <SeamFlash at={K.oct} color={V.amber} dur={5} />

      {/* ══════════════ TIPOGRAFÍA — UNA idea por acto, ≤7 palabras, cama oscura ═════════════ */}
      {t1.on && (
        <div style={t1.style}>
          <Bed pad={28} w={880}>
            <Kick>ÁREA DE BARRIDO</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>DOBLE PALA = <Em>CUATRO VECES</Em></Head>
          </Bed>
        </div>
      )}
      {t2.on && (
        <div style={t2.style}>
          <Bed pad={28} w={900}>
            <Kick>Y LA SEGUNDA ES PEOR</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>LA ENERGÍA CRECE <Em>AL CUBO</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={31}>Léelo despacio: es lo único que hay que entender.</Body>
          </Bed>
        </div>
      )}
      {t3.on && (
        <div style={t3.style}>
          <Bed pad={28} w={820}>
            <Kick>EL VIENTO SE DUPLICA</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>LA ENERGÍA <Em>POR OCHO</Em></Head>
          </Bed>
        </div>
      )}
      {t4.on && (
        <div style={t4.style}>
          <Bed pad={28} w={900}>
            <Kick>Y AL REVÉS — TU LADO</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>MITAD DE VIENTO, <Em color={V.amber}>UN OCTAVO</Em></Head>
          </Bed>
        </div>
      )}
      {t5.on && (
        <div style={t5.style}>
          <Bed pad={28} w={940}>
            <Kick color={V.amber}>LA CAJA NO MIENTE</Kick>
            <div style={{ height: 12 }} />
            <Head size={74}>DICE LA VERDAD A <Em>12 M/S</Em></Head>
          </Bed>
        </div>
      )}
      {t6.on && (
        <div style={t6.style}>
          <Bed pad={30} w={980}>
            <Kick color={V.sky}>NO DURA UNA HORA. NO PASA TODOS LOS DÍAS.</Kick>
            <div style={{ height: 12 }} />
            <Head size={82}>TU PATIO NO ES <Em color={V.amber}>ESE MUNDO</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── viñeta VIVA: el plano nunca se cierra, sigue respirando hasta el corte ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.2 + 0.05 * Math.sin(f / 91) + wind * 0.08).toFixed(3)}) 100%)`,
      }} />
      {/* ── aberración cromática sutil en los picos de energía (nunca un blur full-screen) ── */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [K.x8 - 12, K.x8 + 16, K.a4, K.a4 + 30, K.temp - 8, K.temp + 26, K.patio],
          [0, 0.13, 0.13, 0, 0, 0.12, 0.05], [EZ.push, EZ.lin, EZ.soft, EZ.lin, EZ.push, EZ.soft]),
        background: `linear-gradient(94deg, ${rgba(V.volt, 0.2)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(V.danger, 0.17)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
