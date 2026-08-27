// MovCosto.tsx — MOVIMIENTO 6 de `cmebateria` · "EL COSTO QUE NO ESTÁ EN LA GÓNDOLA" · ~1260 fr (42 s)
// Canal Claudio Mendoza Constructor (ES) · P68–P71. ⛔ NO es un gráfico de barras pegado sobre el
// video: es UN PLANO SECUENCIA de 42 s en el que el costo del generador se convierte en MATERIA que
// se apila sobre la losa del patio, y al lado un bloque macizo de $150 que sube una vez y se queda.
//
// LA IDEA DE PUESTA EN ESCENA: **las dos columnas no son rectángulos, son cosas.**
//   · la ÁMBAR es un RECIPIENTE de chapa que se LLENA DE COMBUSTIBLE — tiene menisco que ondula,
//     burbujas que suben, espesor (cara lateral + tapa en perspectiva) y, HUNDIDOS ADENTRO, el bidón,
//     el aceite y el carburador que cayeron en el acto 1: el costo no es una cifra, es una pila de cosas.
//   · la VOLTIO es un BLOQUE MACIZO mecanizado. Sube 78 px en dos segundos y no se mueve NUNCA MÁS.
//   · la diferencia se cuenta con TIEMPO, no con altura: la ámbar sigue apilando meses en silencio
//     durante todo el acto 4 y todo el acto 5, mientras la voltio está quieta. Ese silencio es el plano.
//   · las doce marcas del calendario del acto 2 NO desaparecen: **cada celda ES un mes de $22** y vuela
//     a su ranura de la columna. La materia cruza la frontera; no hay corte a "otro gráfico".
//
// UNA cámara: `gcam(clk(f), {z0:180 → z1:260, panX:-30, ry:-6})` + un `rotateY(7deg)` fijo, para
// ENTRAR exactamente en el `ry:+7` que deja MovNoche y salir casi frontal. El encuadre real lo hacen
// `net` (aumento) y el foco; y en los actos 3-4 el foco RIDE EL NIVEL: la cámara sube con el líquido.
// UNA atmósfera `<VoltAtmos/>` montada una sola vez para los 1260 frames.
// LA LUZ: SKY (el amanecer frío que deja MovNoche) → ÁMBAR PLENO (acá se habla de plata).
// EL VIENTO: .30 → .12 (el cuaderno de los costos) → .44 (la lluvia del patio) → .10 al entregar.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DE MovNoche: cam {z0:180, ry:+7} · luz {sky → ámbar naciente} · viento {.30} ·
//    materia {LA LLAVE colgando del contacto del auto}
//   ── FRONTERA 0 @ 0 → .045 ····· MATCH-SHAPE ★ (con el movimiento anterior) ·······················
//      La llave sigue girando y su paleta SE RETRAE dentro del disco: el disco se vuelve la TAPA A
//      ROSCA del bidón de nafta, se desenrosca 374° y se levanta. Dos metales redondos que giran.
//
// ACTO 1 · 0 → .235·D · "LO QUE NO ESTÁ EN EL PRECIO"   (protagonista: LOS TRES OBJETOS QUE CAEN)
//   enterFrom cam {z 180, net 1.42, foco (1090,540)} luz {SKY, key .30, int .84} viento {.30}
//             materia {la llave/tapa girando sobre la boca del bidón}
//   material  {`bidonNafta` clip · `aceiteMotor` clip · `carburador` foto — CAEN con peso y rebote}
//   .045 cae el bidón · .105 cae el aceite encima · .165 cae el carburador: la pila queda de 3 cuerpos
//   exitTo    cam {net 1.30, foco (1090,470)} luz {sky+22% ámbar} viento {.22} materia {la pila}
//   ── FRONTERA A @ .219 → .249 ····· OCLUSIÓN (SeamOcclude color CHAPA #A2472E, no el fondo) ·······
//      La chapa pintada del bidón cruza el cuadro y lo tapa 100% ~6 frames. El corte cae adentro.
//
// ACTO 2 · .235 → .425·D · "ARRANCARLO UNA VEZ POR MES" (protagonista: EL CALENDARIO)
//   enterFrom cam {net 1.05, foco (1000,430)} luz {sky→ámbar 40%} viento {.20} materia {papel del mes}
//   material  {`generadorParado` clip: seis meses parado, el día del apagón no arranca}
//   .265 → .375 se estampan las DOCE cruces, una por mes, con su golpe
//   exitTo    cam {net 1.00, YA subiendo el foco} luz {ámbar 62%} viento {.14}
//   ── FRONTERA B @ .395 → .455 ····· MATCH-MOVE ····················································
//      Las 12 celdas ya vienen bajando-comprimiéndose; ese MISMO vector las deja apiladas en la
//      ranura de la columna: cada celda de papel ES un mes de $22. No hay corte: hay aterrizaje.
//
// ACTO 3 · .425 → .620·D · "$900. Y SIGUE SUBIENDO"     (protagonista: LA COLUMNA ÁMBAR)
//   enterFrom cam {net 1.00, foco RIDE EL NIVEL} luz {ámbar 78%} viento {.12} materia {los 12 meses}
//   .470 el año de combustible INUNDA desde abajo y LEVANTA los doce meses a su lugar real → $900
//   .560 `+$22 CADA MES`; los objetos del acto 1 quedan HUNDIDOS y se ven a través del líquido
//   material  {`claudioCuaderno` clip: "yo lo sumé todo" — sobrevive al corte y entra al acto 4}
//   exitTo    cam {net 1.00 → salto} luz {ÁMBAR pleno} viento {.12} materia {la columna llena}
//   ── FRONTERA C @ .620 ····· CORTE EN EL BEAT ······················································
//      Golpe seco de 6 frames (`SeamFlash` VOLTIO) en "ciento cincuenta": el encuadre salta de 1.00 a
//      0.86 en 3 frames y entra la segunda columna. La tarjeta del cuaderno ATRAVIESA el corte.
//
// ACTO 4 · .620 → .800·D · "$150. UNA SOLA VEZ."        (protagonista: LA COLUMNA VOLTIO)
//   enterFrom cam {net .86, foco (1300,ride)} luz {ÁMBAR pleno} viento {.12} materia {las dos columnas}
//   .645 → .700 el bloque macizo sube 78 px y SE CONGELA. Su cifra no vuelve a cambiar en el video.
//   .735 EL PLANO DEL MOVIMIENTO: la voltio quieta mientras la ámbar sigue apilando mes tras mes
//   exitTo    cam {net .86} luz {ámbar} viento {.12 → .44} materia {las dos columnas, una trepando}
//   ── FRONTERA D @ .784 → .824 ····· ZOOM-THROUGH ···················································
//      La cámara ATRAVIESA la tarjeta de `lluviaPatio`: crece hasta cubrir el cuadro y salimos del
//      otro lado en el mismo patio, ahora mojado, con las dos columnas todavía de pie sobre la losa.
//
// ACTO 5 · .800 → 1.0·D · "LA QUE ESTÁ MÁS CERCA"       (protagonista: LOS CABLES BAJO LA PUERTA)
//   enterFrom cam {net .86, foco (1300,660)} luz {ÁMBAR} viento {.44, lluvia} materia {la losa mojada}
//   material  {`lluviaPatio` clip · `cablesPuerta` clip — el recorrido en la oscuridad}
//   .855 los dos caminos sobre la losa: AFUERA, BAJO LA LLUVIA · 10 METROS, DE TU COCINA
//   .940 WIPE POR MATERIA (la lluvia) y quedan LAS DOS COLUMNAS DE PIE, sin una sola cifra encima
//   exitTo ⟶ cam {z1:260, panX:-30, net .82} · luz {ÁMBAR PLENO} · viento {.10} ·
//            materia {LAS DOS COLUMNAS (ámbar y voltio) DE PIE} → MovVeredicto las enfrenta.
//
// ⚠️ los precios son de referencia y en dólares, tal como los dice el guion: $900 · $22/mes · $150.
// ⛔ cero Math.random/Date.now · cero backdrop-filter · cero blur grande a pantalla completa · cero fade.
// ⛔ Easing.quint no existe → Easing.poly(5). Imports SÓLO de remotion, react y ./VoltStage.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Em, Num, Bed,
} from "./VoltStage";

/* ══ EASINGS — nunca uno solo para todo ═══════════════════════════════════════════════════════ */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  grav: Easing.bezier(0.62, 0.0, 0.86, 0.34),   // caída con gravedad
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO (la cámara nunca tiene un easing constante) */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / Math.max(1, ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/* ══ MATERIAL REAL (⛔ SÓLO los nombres del material de MovCosto) ══════════════════════════════ */
const IMG = (n: string) => `img/cmebateria/${n}.jpg`;
const VID = (n: string) => `broll/cmebateria/${n}.mp4`;
const IC = (n: string) => `img/cmebateria/cmeb_ic_${n}.png`;
const M = {
  bidon: "cmeb_mv_costo_bidonNafta",         // el bidón guardado en casa (cae primero)
  aceite: "cmeb_mv_costo_aceiteMotor",       // el aceite cada tantas horas (cae segundo)
  carbu: "cmeb_mv_costo_carburador",         // el carburador que se tapa (cae tercero)
  parado: "cmeb_mv_costo_generadorParado",   // seis meses parado: el día del apagón no arranca
  lluvia: "cmeb_mv_costo_lluviaPatio",       // el costo que no se mide: afuera, bajo la lluvia
  cables: "cmeb_mv_costo_cablesPuerta",      // tirar cables desde el patio hasta adentro
  cuaderno: "cmeb_mv_costo_claudioCuaderno", // "yo lo sumé todo"
};

/* ══ MATERIAS (⛔ el color de una costura es el de la materia, NUNCA el del fondo) ═════════════ */
const CHAPA = "#A2472E";      // la chapa pintada del bidón — la oclusión de la frontera A
const PAPEL = "#D6CBAE";      // el papel del calendario
const PAPEL_D = "#B4A783";
const TINTA = "#2A2C20";
const FUEL = "#E8A62C";       // el combustible adentro del recipiente (ámbar más sucio que V.amber)

/* ══ GEOMETRÍA DEL MUNDO (1920×1080) ══════════════════════════════════════════════════════════
   La losa del patio está en y=FLOOR. Las dos columnas se paran ahí, con espesor real. ═════════ */
const FLOOR = 880;
const AMB_X = 1090, VOLT_X = 1620;
const COL_W = 210, COL_D = 44;              // cara frontal y espesor (cara lateral en perspectiva)
const PXD = 0.522;                          // píxeles por dólar (el bloque de $150 = 78 px)
const BASE_USD = 900, MONTH_USD = 22, VOLT_USD = 150;
const SEG_H = MONTH_USD * PXD;              // ~11,5 px: cada mes es chico; el año de nafta es enorme
const OBJ_H = 112;                          // alto de cada objeto de la pila del acto 1

/* la grilla del calendario del acto 2 */
const G_X0 = 560, G_Y0 = 248, G_W = 200, G_H = 108, G_GX = 28, G_GY = 24;
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const gridRect = (i: number) => ({
  x: G_X0 + (i % 4) * (G_W + G_GX),
  y: G_Y0 + Math.floor(i / 4) * (G_H + G_GY),
});

const mil = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const wx = (x: number) => (x / 1920) * 100;   // world → % (MediaCard/IconPng/Readout usan %)
const wy = (y: number) => (y / 1080) * 100;

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA LOSA DEL PATIO — el suelo donde se paran las dos columnas. En el acto 5 se moja y devuelve
   el reflejo estirado de las dos columnas: la materia del piso también cuenta la historia.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const Slab: React.FC<{ f: number; wet: number; ambH: number; voltH: number }> = ({ f, wet, ambH, voltH }) => (
  <div style={{ position: "absolute", left: -420, top: FLOOR - 6, width: 2760, height: 620 }}>
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(180deg, ${rgba(V.concrete, 0.5)} 0%, ${rgba("#3A3A33", 0.86)} 24%, ${rgba(V.ink1, 0.99)} 78%)`,
    }} />
    {/* las juntas de la losa: la perspectiva del piso, no una línea decorativa */}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        position: "absolute", left: 0, right: 0, top: 54 + i * i * 96 + i * 74, height: 2,
        background: rgba(V.ink0, 0.5 + i * 0.12),
      }} />
    ))}
    {/* charcos: sólo en el acto 5, con el reflejo estirado de las dos columnas */}
    {wet > 0.01 && (
      <div style={{ position: "absolute", inset: 0, opacity: wet }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(180deg, ${rgba(V.sky, 0.16)} 0%, rgba(0,0,0,0) 46%)`,
        }} />
        <div style={{
          position: "absolute", left: AMB_X + 420 - COL_W / 2, top: 6, width: COL_W,
          height: Math.min(300, ambH * 0.42),
          background: `linear-gradient(180deg, ${rgba(FUEL, 0.34)} 0%, rgba(0,0,0,0) 100%)`,
        }} />
        <div style={{
          position: "absolute", left: VOLT_X + 420 - COL_W / 2, top: 6, width: COL_W,
          height: Math.min(300, voltH * 0.9),
          background: `linear-gradient(180deg, ${rgba(V.volt, 0.3)} 0%, rgba(0,0,0,0) 100%)`,
        }} />
        {/* la lluvia golpeando la losa: anillos que nacen y se abren */}
        {Array.from({ length: 16 }, (_, i) => {
          const per = 42 + rnd(i * 3.7) * 34;
          const p = ((f + rnd(i * 8.1) * per) % per) / per;
          const r = 8 + p * 46;
          return (
            <div key={i} style={{
              position: "absolute", left: 220 + rnd(i * 5.3) * 2320 - r, top: 24 + rnd(i * 2.9) * 300 - r * 0.3,
              width: r * 2, height: r * 0.62, borderRadius: "50%",
              border: `1.5px solid ${rgba(V.sky, 0.34 * (1 - p))}`,
            }} />
          );
        })}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA LLAVE QUE SE VUELVE TAPA A ROSCA — la costura con MovNoche (MATCH-SHAPE).
   Mismo disco metálico, misma rotación: la paleta de la llave se RETRAE y quedan las roscas.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const CapKey: React.FC<{ f: number; p: number; x: number; y: number; alpha: number }> = ({ f, p, x, y, alpha }) => {
  if (alpha <= 0.01) return null;
  const r = lerp(44, 58, EZ.soft(p));
  const blade = lerp(84, 0, clamp01(p * 1.5));
  const spin = lerp(0, 374, EZ.glide(p)) + Math.sin(f / 37) * 1.4;
  const lift = -86 * clamp01(p * 2.2 - 1.2);
  return (
    <div style={{
      position: "absolute", left: x - r, top: y - r + lift, width: r * 2, height: r * 2,
      transform: `rotate(${spin.toFixed(2)}deg)`, opacity: alpha,
    }}>
      {/* la paleta de la llave, que se retrae hasta desaparecer dentro del disco */}
      <div style={{
        position: "absolute", left: r - 13, top: r * 1.5, width: 26, height: blade,
        background: `linear-gradient(90deg, ${rgba("#8E8F86", 1)} 0%, ${rgba("#D7D8CE", 1)} 40%, ${rgba("#6A6B62", 1)} 100%)`,
        boxShadow: `0 8px 20px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* el disco: cabeza de llave ⇄ tapa a rosca */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(58% 58% at 36% 28%, ${rgba("#E6E7DC", 0.98)} 0%, ${rgba("#9C9D92", 1)} 46%, ${rgba("#5C5D54", 1)} 100%)`,
        boxShadow: `0 ${Math.round(r * 0.3)}px ${Math.round(r * 0.5)}px ${rgba(V.ink0, 0.85)}, inset 0 2px 0 ${rgba(V.white, 0.4)}`,
      }} />
      {/* el moleteado de la tapa: 22 muescas que aparecen a medida que deja de ser llave */}
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: r - 2, top: 2, width: 4, height: r * 0.3,
          background: rgba(V.ink0, 0.42 * p),
          transformOrigin: `50% ${r - 2}px`, transform: `rotate(${i * (360 / 22)}deg)`,
        }} />
      ))}
      {/* el agujero del llavero, que se cierra cuando ya es tapa */}
      <div style={{
        position: "absolute", left: r - 9, top: r * 0.34, width: 18 * (1 - p), height: 18 * (1 - p),
        borderRadius: "50%", background: rgba(V.ink0, 0.9), opacity: 1 - p,
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA COLUMNA ÁMBAR — un RECIPIENTE DE CHAPA que se llena de combustible. Espesor real (cara
   lateral + tapa en perspectiva), menisco que ondula, burbujas que suben, y los tres objetos del
   acto 1 HUNDIDOS adentro: el costo no es un número, es una pila de cosas.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const FuelColumn: React.FC<{
  f: number; baseH: number; totalH: number; alpha: number; lit: number;
}> = ({ f, baseH, totalH, alpha, lit }) => {
  if (alpha <= 0.01 || totalH < 1) return null;
  const left = AMB_X - COL_W / 2;
  const wob = Math.sin(f / 19) * 2.2 + Math.sin(f / 7.3) * 0.8;   // el chapoteo del líquido
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {/* sombra de contacto: la columna PESA sobre la losa */}
      <div style={{
        position: "absolute", left: left - COL_W * 0.7, top: FLOOR - 16, width: COL_W * 2.4, height: 62,
        background: `radial-gradient(50% 50% at 44% 50%, rgba(0,0,0,${(0.5 + 0.2 * clamp01(totalH / 700)).toFixed(2)}) 0%, rgba(0,0,0,0) 72%)`,
      }} />
      {/* CARA LATERAL — el espesor. Sin esto es un rectángulo; con esto es un cuerpo. */}
      <div style={{
        position: "absolute", left: left + COL_W, top: FLOOR - totalH + COL_D * 0.5,
        width: COL_D, height: totalH,
        background: `linear-gradient(90deg, ${rgba("#8A5A12", 0.96)} 0%, ${rgba("#4E340C", 0.98)} 100%)`,
        transform: "skewY(-13deg)", transformOrigin: "0% 100%",
        boxShadow: `inset 2px 0 8px ${rgba(V.ink0, 0.6)}`,
      }} />
      {/* CUERPO DEL RECIPIENTE (chapa) — se ve por encima del líquido antes de llenarse */}
      <div style={{
        position: "absolute", left, top: FLOOR - totalH, width: COL_W, height: totalH,
        background: `linear-gradient(94deg, ${rgba("#6E5A32", 0.42)} 0%, ${rgba("#4A3D22", 0.3)} 100%)`,
        boxShadow: `inset 0 0 0 2px ${rgba(FUEL, 0.3 * lit)}`,
      }} />
      {/* EL LÍQUIDO del año de combustible ($900). Translúcido: los objetos hundidos se ven. */}
      {baseH > 1 && (
        <div style={{
          position: "absolute", left, top: FLOOR - baseH, width: COL_W, height: baseH, overflow: "hidden",
          background: `linear-gradient(96deg, ${rgba(FUEL, 0.62)} 0%, ${rgba(FUEL, 0.88)} 32%, ${rgba("#B87516", 0.82)} 78%, ${rgba("#8A5410", 0.72)} 100%)`,
          boxShadow: `inset -10px 0 18px ${rgba(V.ink0, 0.34)}, inset 10px 0 14px ${rgba(V.white, 0.1)}`,
        }}>
          {/* burbujas: el líquido está VIVO, no es un relleno de color */}
          {Array.from({ length: 11 }, (_, i) => {
            const sp = 26 + rnd(i * 4.4) * 44;
            const pr = ((f + rnd(i * 9.2) * sp) % sp) / sp;
            const d = 4 + rnd(i * 2.6) * 9;
            return (
              <div key={i} style={{
                position: "absolute", left: 14 + rnd(i * 6.1) * (COL_W - 34) + Math.sin(f / 21 + i) * 4,
                top: baseH - pr * baseH, width: d, height: d, borderRadius: "50%",
                background: rgba(V.torch, 0.2 + 0.24 * (1 - pr)),
              }} />
            );
          })}
          {/* el sedimento del fondo: nafta vieja, la que te tapa el carburador */}
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: Math.min(64, baseH * 0.2),
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba("#5A3608", 0.7)} 100%)`,
          }} />
        </div>
      )}
      {/* EL MENISCO: la superficie del combustible, que ondula. Es el borde vivo de la materia. */}
      {baseH > 2 && (
        <div style={{
          position: "absolute", left: left - 3, top: FLOOR - baseH - 7 + wob * 0.5, width: COL_W + 6, height: 14,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${rgba(V.torch, 0.66)} 0%, ${rgba(FUEL, 0.9)} 60%, ${rgba("#9E650F", 0.7)} 100%)`,
          boxShadow: `0 0 22px ${rgba(FUEL, 0.5 * lit)}`,
          transform: `rotate(${(wob * 0.14).toFixed(2)}deg)`,
        }} />
      )}
      {/* TAPA superior en perspectiva: cierra el cuerpo por encima de todo lo apilado */}
      <div style={{
        position: "absolute", left: left + 4, top: FLOOR - totalH - 9, width: COL_W + COL_D * 0.5, height: 18,
        background: `linear-gradient(180deg, ${rgba(V.torch, 0.5)} 0%, ${rgba(FUEL, 0.88)} 100%)`,
        transform: "skewX(-40deg)", transformOrigin: "0% 100%", borderRadius: 3,
        boxShadow: `0 -2px 16px ${rgba(FUEL, 0.44 * lit)}`,
      }} />
      {/* barrido especular sobre la chapa: se lee como METAL, no como relleno de color */}
      <div style={{
        position: "absolute", left: left + COL_W * 0.16, top: FLOOR - totalH, width: COL_W * 0.16, height: totalH,
        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${rgba(V.white, 0.16 * lit)} 50%, rgba(255,255,255,0) 100%)`,
      }} />
    </div>
  );
};

/* ══ LOS MESES EXTRA (13, 14, 15…) — la columna SIGUE subiendo cuando ya nadie la mira ════════ */
const ExtraMonths: React.FC<{ f: number; y0: number; n: number; alpha: number }> = ({ f, y0, n, alpha }) => {
  if (alpha <= 0.01 || n <= 0.01) return null;
  const left = AMB_X - COL_W / 2;
  const full = Math.floor(n);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {Array.from({ length: full + 1 }, (_, j) => {
        const p = j < full ? 1 : n - full;
        if (p <= 0.01) return null;
        const h = SEG_H * p;
        const top = y0 - j * SEG_H - h;
        return (
          <div key={j}>
            <div style={{
              position: "absolute", left, top, width: COL_W, height: h,
              background: `linear-gradient(96deg, ${rgba(FUEL, 0.72)} 0%, ${rgba("#C2801A", 0.94)} 60%, ${rgba("#7E4E0E", 0.8)} 100%)`,
              borderTop: `1.5px solid ${rgba(V.ink0, 0.42)}`,
            }} />
            <div style={{
              position: "absolute", left: left + COL_W, top: top + COL_D * 0.5, width: COL_D, height: h,
              background: rgba("#4E340C", 0.95), transform: "skewY(-13deg)", transformOrigin: "0% 100%",
            }} />
            {/* el mes que acaba de entrar destella y se apaga: el reloj no para */}
            {j === full && (
              <div style={{
                position: "absolute", left: left - 4, top: top - 2, width: COL_W + 8, height: h + 4,
                boxShadow: `0 0 ${(18 * (1 - p)).toFixed(0)}px ${rgba(V.torch, 0.7 * (1 - p))}`,
              }} />
            )}
          </div>
        );
      })}
      {/* la punta que trepa: un pelo de luz que nunca se queda quieto */}
      <div style={{
        position: "absolute", left: left - 2, top: y0 - n * SEG_H - 3, width: COL_W + 4, height: 3,
        background: rgba(V.torch, 0.4 + 0.24 * Math.sin(f / 11)),
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA COLUMNA VOLTIO — un BLOQUE MACIZO mecanizado. Sube 78 px y NO SE MUEVE NUNCA MÁS.
   La quietud es el punto: al lado de una columna que trepa sola, quieto significa algo.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const SolidColumn: React.FC<{ f: number; h: number; alpha: number; frozen: number }> = ({ f, h, alpha, frozen }) => {
  if (alpha <= 0.01 || h < 1) return null;
  const left = VOLT_X - COL_W / 2;
  const breath = Math.sin(f / 97) * 0.3;   // 0,3 px: vive, pero no se mueve
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      <div style={{
        position: "absolute", left: left - COL_W * 0.62, top: FLOOR - 14, width: COL_W * 2.24, height: 54,
        background: "radial-gradient(50% 50% at 46% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 72%)",
      }} />
      {/* cara lateral: el espesor del bloque */}
      <div style={{
        position: "absolute", left: left + COL_W, top: FLOOR - h + COL_D * 0.5 + breath, width: COL_D, height: h,
        background: `linear-gradient(90deg, ${rgba("#7A9200", 0.96)} 0%, ${rgba("#38430A", 0.98)} 100%)`,
        transform: "skewY(-13deg)", transformOrigin: "0% 100%",
      }} />
      {/* cara frontal mecanizada */}
      <div style={{
        position: "absolute", left, top: FLOOR - h + breath, width: COL_W, height: h,
        background: `linear-gradient(96deg, ${rgba(V.volt, 0.72)} 0%, ${rgba(V.volt, 0.98)} 34%, ${rgba(V.voltSoft, 0.9)} 100%)`,
        boxShadow: `inset -8px 0 14px ${rgba(V.ink0, 0.3)}, inset 8px 0 12px ${rgba(V.white, 0.14)}`,
      }} />
      {/* tapa superior en perspectiva + bisel: es un objeto sólido, no una barra */}
      <div style={{
        position: "absolute", left: left + 4, top: FLOOR - h - 8 + breath, width: COL_W + COL_D * 0.5, height: 16,
        background: `linear-gradient(180deg, ${rgba(V.white, 0.62)} 0%, ${rgba(V.volt, 0.94)} 100%)`,
        transform: "skewX(-40deg)", transformOrigin: "0% 100%", borderRadius: 2,
      }} />
      {/* el sello de QUIETA: un anillo fino que se cierra una vez y se queda */}
      {frozen > 0.01 && (
        <div style={{
          position: "absolute", left: left - 7, top: FLOOR - h - 13 + breath, width: COL_W + 14, height: h + 20,
          border: `2px solid ${rgba(V.white, 0.5 * frozen)}`, borderRadius: 5,
        }} />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LAS DOCE CELDAS DEL CALENDARIO — papel con su cruz estampada que, sin corte, VUELA a la ranura
   de la columna y se vuelve un mes de $22. La misma materia cruza la frontera B (MATCH-MOVE).
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const cellSlide = (placed: number, i: number) => EZ.snap(clamp01(placed * 17 - i));
const monthsHeight = (placed: number) => {
  let s = 0;
  for (let i = 0; i < 12; i++) s += SEG_H * cellSlide(placed, i);
  return s;
};

const MonthCells: React.FC<{
  f: number; stamp: number; placed: number; baseH: number; alpha: number;
}> = ({ f, stamp, placed, baseH, alpha }) => {
  if (alpha <= 0.01) return null;
  const left = AMB_X - COL_W / 2;
  let acc = 0;
  const slots: number[] = [];
  for (let i = 0; i < 12; i++) {
    const c = SEG_H * cellSlide(placed, i);
    slots.push(FLOOR - baseH - acc - c);
    acc += c;
  }
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {MESES.map((mes, i) => {
        const s = cellSlide(placed, i);
        const g = gridRect(i);
        const x = lerp(g.x, left, s);
        const y = lerp(g.y, slots[i], s);
        const w = lerp(G_W, COL_W, s);
        const h = lerp(G_H, SEG_H, s);
        const rot = lerp((rnd(i * 3.3) - 0.5) * 3.4, 0, s);
        const st = EZ.snap(clamp01((f - (stamp + i * 8)) / 9));
        const paper = 1 - clamp01(s * 1.9 - 0.35);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: w, height: h,
            transform: `rotate(${rot.toFixed(2)}deg)`,
            background: paper > 0.02
              ? `linear-gradient(166deg, ${rgba(PAPEL, 0.96 * paper)} 0%, ${rgba(PAPEL_D, 0.94 * paper)} 100%)`
              : `linear-gradient(96deg, ${rgba(FUEL, 0.72)} 0%, ${rgba("#C2801A", 0.94)} 60%, ${rgba("#7E4E0E", 0.8)} 100%)`,
            borderTop: s > 0.7 ? `1.5px solid ${rgba(V.ink0, 0.42)}` : "none",
            boxShadow: paper > 0.05
              ? `0 ${Math.round(12 * paper)}px ${Math.round(22 * paper)}px ${rgba(V.ink0, 0.7 * paper)}`
              : "none",
            overflow: "hidden",
          }}>
            {/* el combustible gana la celda cuando ya es un mes de la columna */}
            {paper <= 0.6 && (
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(96deg, ${rgba(FUEL, 0.7 * (1 - paper))} 0%, ${rgba("#7E4E0E", 0.8 * (1 - paper))} 100%)`,
              }} />
            )}
            {paper > 0.04 && (
              <>
                <div style={{
                  position: "absolute", left: 14, top: 10, fontFamily: F_DISPLAY, fontWeight: 700,
                  fontSize: 26 * paper + 1, letterSpacing: 3, color: rgba(TINTA, 0.86 * paper),
                }}>{mes}</div>
                {/* la CRUZ estampada: dos trazos que se DIBUJAN, no dos líneas que aparecen */}
                <div style={{
                  position: "absolute", left: w * 0.5 - 46 * paper, top: h * 0.62 - 3,
                  width: 92 * paper * st, height: 7, borderRadius: 3, background: rgba("#96382C", 0.9 * paper),
                  transform: "rotate(-24deg)", transformOrigin: "0% 50%",
                }} />
                <div style={{
                  position: "absolute", left: w * 0.5 + 46 * paper, top: h * 0.62 - 3,
                  width: 92 * paper * clamp01(st * 1.6 - 0.6), height: 7, borderRadius: 3,
                  background: rgba("#96382C", 0.9 * paper),
                  transform: "rotate(24deg)", transformOrigin: "100% 50%",
                }} />
                <div style={{
                  position: "absolute", right: 12, top: 12, fontFamily: F_BODY, fontWeight: 800,
                  fontSize: 22 * paper + 1, color: rgba("#96382C", 0.8 * paper * st),
                }}>$22</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ══ LA LLUVIA del acto 5 — materia en el aire, función pura del frame ════════════════════════ */
const Rain: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: p }}>
      {Array.from({ length: 46 }, (_, i) => {
        const sp = 22 + rnd(i * 3.1) * 26;
        const len = 44 + rnd(i * 7.4) * 96;
        const yy = ((rnd(i * 5.9) * 1400 + f * sp) % 1400) - 200;
        return (
          <div key={i} style={{
            position: "absolute", left: `${(rnd(i * 2.2) * 106 - 3).toFixed(2)}%`, top: yy,
            width: 1.6, height: len,
            background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.sky, 0.16 + rnd(i * 8.8) * 0.24)} 60%, rgba(0,0,0,0))`,
            transform: "rotate(9deg)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

/* ══ PLACA DE CIFRA — la cama oscura que garantiza legibilidad sobre el material ═══════════════ */
const Plate: React.FC<{ x: number; y: number; w: number; h: number; a: number; c: string }> = ({ x, y, w, h, a, c }) => {
  if (a <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 14, opacity: a,
      background: "linear-gradient(180deg, rgba(8,9,6,0.92) 0%, rgba(8,9,6,0.74) 100%)",
      boxShadow: `0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(c, 0.26)}`,
    }} />
  );
};

/* ══ EL PAR DE CONTADORES — la ámbar tickea sola; la voltio está congelada al lado. El remate. ═ */
const Ticker: React.FC<{
  x: number; y: number; usd: number; color: string; cap: string; a: number; live: boolean;
}> = ({ x, y, usd, color, cap, a, live }) => {
  if (a <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: a,
      textAlign: "center", whiteSpace: "nowrap",
    }}>
      <div style={{
        padding: "10px 20px 12px", borderRadius: 12,
        background: "linear-gradient(180deg, rgba(8,9,6,0.9) 0%, rgba(8,9,6,0.72) 100%)",
        boxShadow: `0 14px 40px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(color, live ? 0.4 : 0.24)}`,
      }}>
        <Num size={62} color={color}>{"$" + mil(usd)}</Num>
        <div style={{ height: 6 }} />
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 2.8,
          color: rgba(live ? V.torch : V.white, 0.8), textTransform: "uppercase",
        }}>{cap}</div>
      </div>
    </div>
  );
};

/* ══ TARJETA CON MATERIAL REAL: clip mientras dura, después la misma foto (nunca se congela) ═══ */
const RealCard: React.FC<{
  f: number; slug: string; label: string; mount: number; vidLen: number; out: number;
  x: number; y: number; w: number; h: number; ry: number; rot?: number; z?: number;
  lit: number; litColor: string; op: number; photoOnly?: boolean;
}> = ({ f, slug, label, mount, vidLen, out, x, y, w, h, ry, rot = 0, z = 0, lit, litColor, op, photoOnly = false }) => {
  if (f < mount || f >= out || op <= 0.01) return null;
  const common = { w, h, x: wx(x), y: wy(y), z, ry, rot, label, lit, litColor, opacity: op, radius: 12 };
  const swap = mount + vidLen;
  if (photoOnly || f >= swap) {
    return <MediaCard src={IMG(slug)} kind="photo" {...common} sheenAt={photoOnly ? mount + 8 : swap + 2} />;
  }
  return (
    <Sequence from={mount} durationInFrames={vidLen} layout="none">
      <MediaCard src={VID(slug)} kind="video" {...common} sheenAt={14} />
    </Sequence>
  );
};

/* ══ EL OBJETO QUE CAE — peso, gravedad, rebote amortiguado y aplastado al aterrizar ══════════ */
const dropY = (f: number, at: number, dur: number, y0: number, y1: number) => {
  const p = clamp01((f - at) / dur);
  const k = f - (at + dur);
  const bounce = k >= 0 ? Math.exp(-k / 9) * Math.abs(Math.sin(k / 4.6)) * 19 : 0;
  return lerp(y0, y1, EZ.grav(p)) - bounce;
};
const dropSquash = (f: number, at: number, dur: number) => {
  const k = f - (at + dur);
  if (k < 0) return 1 + clamp01((f - at) / dur) * 0.06;     // se estira al caer
  return 1 - Math.exp(-k / 7) * 0.15 * Math.cos(k / 3.6);   // y se aplasta al tocar
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovCosto: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const D = durationInFrames;
  const f = useCurrentFrame();
  /* los actos son FRACCIONES de la duración: sobreviven al re-anclaje al Whisper (±20%) */
  const A = (fr: number) => Math.round(D * fr);

  /* ── anclas del guion (P68–P71) ─────────────────────────────────────────────────────────── */
  const tCap = A(0.045);                                    // la llave ya es tapa: cae el bidón
  const tAceite = A(0.105), tCarbu = A(0.165);
  const a2 = A(0.235), tCal = A(0.265);
  const a3 = A(0.425), t900 = A(0.485), t22 = A(0.56);
  const a4 = A(0.62), t150 = A(0.665), tQuieta = A(0.735);
  const a5 = A(0.8), tCables = A(0.855), tCerca = A(0.905);
  const tWipe = A(0.94);

  /* ── UNA cámara. `clk` deforma el tiempo por acto pero es MONÓTONO: z 180 → 260, nunca vuelve. ── */
  const clk = keyed(f, [0, a2, a3, a4, a5, D], [0, A(0.2), A(0.4), A(0.58), A(0.8), D],
    [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.soft]);
  const g = gcam(clk, { z0: 180, z1: 260, panX: -30, dur: D, ry: -6, rx: 1.6 });
  const mag = 1500 / (1500 - g.z);

  /* ── LA LUZ: sky (el amanecer frío de MovNoche) → ÁMBAR PLENO (la plata) ─────────────────── */
  const stage = keyed(f, [0, a2, A(0.32), a3, A(0.52), D], [0, 0.22, 0.4, 0.62, 1, 1],
    [EZ.lin, EZ.push, EZ.glide, EZ.soft, EZ.lin]);
  const lum = light(stage, "sky", "amber");
  const keyFrom = keyed(f, [0, a3, a5, D], [0.3, 0.52, 0.68, 0.76], EZ.soft);
  const inten = keyed(f, [0, a3, a4, tQuieta, D], [0.84, 1.0, 1.12, 1.04, 1.1], EZ.soft);

  /* ── EL VIENTO: patio quieto → el cuaderno de los costos (.12) → la lluvia (.44) → .10 ────── */
  const wind = keyed(f, [0, A(0.14), A(0.3), a4, a5 - A(0.03), A(0.88), tWipe, D],
    [0.3, 0.22, 0.12, 0.12, 0.44, 0.44, 0.2, 0.1],
    [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.lin, EZ.push, EZ.soft]);
  const rainP = keyed(f, [a5 - A(0.03), a5 + A(0.02), tWipe, D], [0, 1, 1, 0.34], [EZ.push, EZ.lin, EZ.soft]);
  const wet = keyed(f, [a5 - A(0.02), a5 + A(0.04)], [0, 1], EZ.glide);

  /* ── LA MATERIA: la tapa, la pila, el líquido, los meses, el bloque ──────────────────────── */
  const capP = keyed(f, [A(0.006), A(0.042)], [0, 1], EZ.glide);
  const capA = keyed(f, [0, A(0.03), A(0.05), A(0.068)], [1, 1, 1, 0], [EZ.lin, EZ.lin, EZ.soft]);
  const placed = keyed(f, [A(0.395), A(0.455)], [0, 1], EZ.glide);
  const baseP = keyed(f, [A(0.47), A(0.56)], [0, 1], EZ.push);
  const baseH = BASE_USD * PXD * baseP;
  const monthsH = monthsHeight(placed);
  const extraN = keyed(f, [A(0.7), D - 2], [0, 8.4], EZ.lin);
  const extraH = extraN * SEG_H;
  const totalH = baseH + monthsH + extraH;
  const ambTop = FLOOR - totalH;
  const ambUSD = BASE_USD * baseP + MONTH_USD * (monthsH / SEG_H + extraN);

  const voltP = keyed(f, [A(0.645), A(0.7)], [0, 1], EZ.push);
  const voltH = VOLT_USD * PXD * voltP;
  const frozen = keyed(f, [A(0.702), A(0.742)], [0, 1], EZ.snap);
  const colsA = keyed(f, [A(0.372), A(0.402)], [0, 1], EZ.push);

  /* la pila del acto 1: se hunde bajo el líquido pero NUNCA desaparece (el costo son cosas) */
  const pileA = keyed(f, [A(0.03), A(0.05), A(0.52), A(0.6)], [0, 1, 1, 0.24], [EZ.push, EZ.lin, EZ.soft]);

  /* ── EL ENCUADRE: aumento neto + el punto del mundo que va al centro. En los actos 3-4 el foco
        RIDE EL NIVEL: la cámara sube con el combustible, no mira una barra desde afuera. ────── */
  const NK = [0, A(0.16), a2, A(0.34), a3, a4 - 3, a4, tQuieta, a5, tCerca, D];
  const net = keyed(f, NK, [1.42, 1.3, 1.05, 1.02, 1.0, 0.99, 0.86, 0.86, 0.86, 0.84, 0.82],
    [EZ.soft, EZ.push, EZ.lin, EZ.glide, EZ.lin, EZ.push, EZ.lin, EZ.lin, EZ.glide, EZ.soft]);
  const fxS = keyed(f, NK, [1090, 1090, 1000, 1010, 1090, 1140, 1300, 1310, 1300, 1290, 1290],
    [EZ.soft, EZ.push, EZ.lin, EZ.glide, EZ.lin, EZ.push, EZ.lin, EZ.lin, EZ.glide, EZ.soft]);
  const fyS = keyed(f, NK, [540, 470, 430, 430, 620, 620, 660, 660, 660, 650, 646],
    [EZ.soft, EZ.push, EZ.lin, EZ.glide, EZ.lin, EZ.push, EZ.lin, EZ.lin, EZ.glide, EZ.soft]);
  const follow = keyed(f, [a3 - A(0.02), a3 + A(0.04), a5 - A(0.05), a5], [0, 1, 1, 0],
    [EZ.push, EZ.lin, EZ.soft]);
  const colMid = FLOOR - totalH * 0.5;
  const fy = lerp(fyS, colMid, follow * 0.86);
  const ws = net / mag;
  /* el golpe de cada objeto que aterriza sacude la cámara (no es un shake decorativo: es el peso) */
  const hit = (at: number) => {
    const k = f - at;
    return k >= 0 && k < 26 ? Math.exp(-k / 6) * Math.sin(k / 2.1) * 9 : 0;
  };
  const shake = hit(tCap + 22) + hit(tAceite + 22) + hit(tCarbu + 22);
  const panX = 960 - fxS;
  const panY = 540 - fy + shake;

  /* ── FRONTERA D · ZOOM-THROUGH: atravesamos la lluvia del patio ─────────────────────────── */
  const ztAt = a5 - A(0.016);
  const zt = zoomThrough(f, ztAt, A(0.04), 66, 32);
  const zin = clamp01((f - (a5 - A(0.022))) / A(0.032));
  const zout = clamp01((f - (a5 + A(0.012))) / A(0.016));
  const zActive = f >= a5 - A(0.024) && f < a5 + A(0.03);

  /* ── ventanas de texto: UNA idea por acto, ≤7 palabras, cama oscura obligatoria ──────────── */
  const tw = (i0: number, i1: number) => {
    const inP = clamp01((f - i0) / 13);
    const outP = clamp01((f - (i1 - 15)) / 15);
    return { on: f > i0 && f < i1, op: inP * (1 - outP), dy: lerp(30, 0, EZ.snap(inP)) };
  };
  const T1 = tw(A(0.02), A(0.212));
  const T2 = tw(A(0.256), A(0.392));
  const T3 = tw(A(0.446), A(0.606));
  const T4 = tw(A(0.646), A(0.782));
  const T5 = tw(A(0.826), D - 4);
  const paraX = -panX * 0.012, paraY = -(540 - fy) * 0.009;

  /* la pila del acto 1 (mundo): tres cuerpos apilados en la huella de la columna ámbar */
  const pile = [
    { slug: M.bidon, label: "NAFTA FRESCA", at: tCap, base: FLOOR, vid: true },
    { slug: M.aceite, label: "ACEITE", at: tAceite, base: FLOOR - OBJ_H - 3, vid: true },
    { slug: M.carbu, label: "CARBURADOR", at: tCarbu, base: FLOOR - (OBJ_H + 3) * 2, vid: false },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los 1260 frames. No se remonta entre actos. ══ */}
      <VoltAtmos tint={lum} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={0.6} />

      {/* ══ EL MUNDO, bajo UNA sola cámara (+7° heredados de MovNoche) ═══════════════════════ */}
      <Layers cam={`${g.transform} rotateY(7deg)`}>
        {/* CAMA DE FOTO debajo de TODO: nunca el fondo plano en los márgenes */}
        {f < a2 - 2 ? (
          <PhotoPlane src={IMG(M.bidon)} z={-540} scale={keyed(f, [0, a2], [1.42, 1.24], EZ.soft)} dim={0.74} tint={lum} />
        ) : f < a5 - A(0.02) ? (
          <PhotoPlane src={IMG(M.parado)} z={-540} scale={keyed(f, [a2, a5], [1.34, 1.16], EZ.soft)} dim={0.72} tint={V.amber} />
        ) : (
          <PhotoPlane src={IMG(M.lluvia)} z={-540} scale={keyed(f, [a5, D], [1.3, 1.14], EZ.soft)} dim={0.66} tint={V.amber} />
        )}

        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── PLANO −140 · LA LOSA DEL PATIO: el suelo real de las dos columnas ── */}
          <Plane z={-140}>
            <Slab f={f} wet={wet} ambH={totalH} voltH={voltH} />
          </Plane>

          {/* ── PLANO −30 · LA PILA DEL ACTO 1: los tres objetos que caen y quedan hundidos ── */}
          <Plane z={-30}>
            {pile.map((o, i) => {
              if (f < o.at - 2 || pileA <= 0.01) return null;
              const y = dropY(f, o.at, 22, -420, o.base - OBJ_H / 2);
              const sq = dropSquash(f, o.at, 22);
              return (
                <div key={i} style={{
                  position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                  transform: `scaleY(${sq.toFixed(3)})`, transformOrigin: `50% ${FLOOR}px`,
                }}>
                  <RealCard
                    f={f} slug={o.slug} label={o.label} mount={o.at - 1} vidLen={o.vid ? 96 : 0}
                    out={D} photoOnly={!o.vid}
                    x={AMB_X} y={y} w={COL_W - 4} h={OBJ_H} ry={0} rot={0} z={0}
                    lit={0.9} litColor={V.amber} op={pileA}
                  />
                </div>
              );
            })}
          </Plane>

          {/* ── PLANO 0 · LAS DOS COLUMNAS: materia con espesor, sombra y vida propia ── */}
          <Plane z={0}>
            <FuelColumn f={f} baseH={baseH} totalH={totalH} alpha={colsA} lit={1} />
            <ExtraMonths f={f} y0={FLOOR - baseH - monthsH} n={extraN} alpha={colsA} />
            <MonthCells f={f} stamp={tCal} placed={placed} baseH={baseH}
              alpha={keyed(f, [tCal - 6, tCal + 10, D], [0, 1, 1], [EZ.push, EZ.lin])} />
            <SolidColumn f={f} h={voltH} alpha={keyed(f, [a4 - 4, a4 + 8], [0, 1], EZ.push)} frozen={frozen} />

            {/* los rótulos de pie de columna: quién es quién, sobre el suelo, no flotando */}
            {colsA > 0.2 && (
              <div style={{
                position: "absolute", left: AMB_X - COL_W, top: FLOOR + 26, width: COL_W * 2, textAlign: "center",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.2,
                color: rgba(V.amber, 0.9 * colsA), textShadow: "0 4px 18px rgba(0,0,0,0.95)",
              }}>GENERADOR</div>
            )}
            {voltP > 0.2 && (
              <div style={{
                position: "absolute", left: VOLT_X - COL_W, top: FLOOR + 26, width: COL_W * 2, textAlign: "center",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.2,
                color: rgba(V.volt, 0.92 * voltP), textShadow: "0 4px 18px rgba(0,0,0,0.95)",
              }}>BATERÍA + INVERSOR</div>
            )}

            {/* ACTO 5 · los dos recorridos sobre la losa: el que hay que hacer en la oscuridad y
                el que no hay que hacer. Un eje es un eje: acá el vector SÍ es legítimo. */}
            {f > tCables - A(0.02) && f < tWipe && (
              <svg viewBox="0 0 1920 1080"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <path
                  d={`M 210 ${FLOOR + 118} C 470 ${FLOOR + 150}, 700 ${FLOOR + 70}, ${AMB_X - 40} ${FLOOR + 34}`}
                  fill="none" stroke={rgba(V.amber, 0.72 * clamp01((f - tCables) / 22))}
                  strokeWidth={5} strokeDasharray="18 13" strokeLinecap="round"
                />
                <path
                  d={`M ${VOLT_X + 250} ${FLOOR + 92} C ${VOLT_X + 200} ${FLOOR + 84}, ${VOLT_X + 150} ${FLOOR + 60}, ${VOLT_X + 108} ${FLOOR + 34}`}
                  fill="none" stroke={rgba(V.volt, 0.86 * clamp01((f - tCerca) / 18))}
                  strokeWidth={5} strokeLinecap="round"
                />
              </svg>
            )}
          </Plane>

          {/* ── PLANO 70 · LA LLAVE QUE SE VUELVE TAPA (la costura con MovNoche) ── */}
          <Plane z={70}>
            <CapKey f={f} p={capP} x={AMB_X} y={318} alpha={capA} />
          </Plane>

          {/* ── PLANO 40 · LAS CIFRAS. Ninguna la dibuja un motor de imagen: las escribe el kit. ── */}
          <Plane z={40}>
            {/* $900 · el año entero de combustible */}
            <Plate x={620} y={410} w={520} h={210} c={V.amber}
              a={keyed(f, [t900 - A(0.012), t900 + A(0.012), a4 - A(0.02), a4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            {f >= t900 - A(0.01) && f < a4 && (
              <Readout value="$900" label="UN AÑO DE COMBUSTIBLE" at={t900}
                x={wx(620)} y={wy(410)} size={104} color={V.amber} />
            )}
            {/* +$22 cada mes · el goteo que no para */}
            <Plate x={620} y={594} w={440} h={150} c={V.amber}
              a={keyed(f, [t22 - A(0.01), t22 + A(0.014), a4 - A(0.02), a4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            {f >= t22 - A(0.008) && f < a4 && (
              <Readout value="+$22" unit="/mes" label="TODOS LOS MESES" at={t22}
                x={wx(620)} y={wy(594)} size={74} color={V.amber} />
            )}
            {/* $150 · una sola vez */}
            <Plate x={VOLT_X} y={FLOOR - 300} w={520} h={214} c={V.volt}
              a={keyed(f, [t150 - A(0.012), t150 + A(0.012), a5 - A(0.03), a5 - A(0.01)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            {f >= t150 - A(0.01) && f < a5 - A(0.01) && (
              <Readout value="$150" label="UNA SOLA VEZ" at={t150}
                x={wx(VOLT_X)} y={wy(FLOOR - 300)} size={104} color={V.volt} />
            )}
            {/* ★ EL PAR: la ámbar tickea sola sobre su propia punta; la voltio está congelada. */}
            <Ticker x={AMB_X} y={ambTop - 74} usd={ambUSD} color={V.amber} cap="Y SIGUE" live
              a={keyed(f, [tQuieta - A(0.012), tQuieta + A(0.016), tWipe - A(0.01), tWipe + A(0.01)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            <Ticker x={VOLT_X} y={FLOOR - voltH - 74} usd={VOLT_USD} color={V.volt} cap="NO CAMBIA" live={false}
              a={keyed(f, [tQuieta - A(0.008), tQuieta + A(0.02), tWipe - A(0.01), tWipe + A(0.01)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* los dos recorridos: la única cifra del acto 5 es la que dice el guion (10 metros) */}
            {f > tCables && f < tWipe && (
              <div style={{
                position: "absolute", left: 150, top: FLOOR + 150,
                opacity: keyed(f, [tCables, tCables + 16, tWipe - 18, tWipe], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]),
              }}>
                <Kick color={V.amber}>AFUERA · BAJO LA LLUVIA</Kick>
              </div>
            )}
            {f > tCerca && f < tWipe && (
              <div style={{
                position: "absolute", left: VOLT_X + 168, top: FLOOR + 112,
                opacity: keyed(f, [tCerca, tCerca + 16, tWipe - 18, tWipe], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]),
              }}>
                <Num size={66} color={V.volt}>10 m</Num>
                <div style={{ height: 4 }} />
                <Kick color={rgba(V.white, 0.78)}>DE TU COCINA</Kick>
              </div>
            )}
          </Plane>

          {/* ── PLANO 150 · MATERIAL REAL FLOTANDO (clip o foto adentro, nunca forma + texto) ── */}
          <Plane z={150}>
            {/* ACTO 2 · el generador que lleva seis meses parado */}
            <RealCard f={f} slug={M.parado} label="SEIS MESES PARADO" mount={a2 - A(0.006)} vidLen={128} out={A(0.404)}
              x={1560} y={430} w={470} h={288} ry={-13} rot={2} z={40} lit={0.96} litColor={V.amber}
              op={keyed(f, [a2 - A(0.006), a2 + A(0.02), A(0.378), A(0.404)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ACTO 3-4 · "yo lo sumé todo": la tarjeta ATRAVIESA el corte en el beat */}
            <RealCard f={f} slug={M.cuaderno} label="LO SUMÉ TODO" mount={A(0.508)} vidLen={130} out={A(0.772)}
              x={330} y={758} w={396} h={244} ry={12} rot={-2} z={30} lit={0.94} litColor={V.amber}
              op={keyed(f, [A(0.508), A(0.532), A(0.744), A(0.772)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ACTO 5 · la lluvia (se va POR EL ZOOM-THROUGH) y los cables bajo la puerta */}
            <div style={{
              position: "absolute", inset: 0,
              transform: f >= ztAt ? zt.out : "none",
              opacity: f >= ztAt ? zt.opacity : 1,
            }}>
              {/* ⛔ sale por zt.opacity, no por su propia ventana: si se apagara antes de que la
                  tarjeta cubra el cuadro se vería el pop. */}
              <RealCard f={f} slug={M.lluvia} label="Y A VECES, LLOVIENDO" mount={A(0.756)} vidLen={120} out={a5 + A(0.03)}
                x={1290} y={330} w={440} h={272} ry={10} z={20} lit={1} litColor={V.sky}
                op={keyed(f, [A(0.756), A(0.776), a5 + A(0.02), a5 + A(0.03)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            </div>
            <RealCard f={f} slug={M.cables} label="CABLES DESDE EL PATIO" mount={tCables - A(0.03)} vidLen={126} out={tWipe}
              x={660} y={300} w={470} h={290} ry={11} rot={-1} z={60} lit={1} litColor={V.amber}
              op={keyed(f, [tCables - A(0.03), tCables - A(0.008), tWipe - A(0.024), tWipe], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* íconos del kit como objetos chicos de la escena (nunca reemplazan al objeto real) */}
            {f > A(0.03) && f < a2 && (
              <IconPng src={IC("bidon")} x={wx(1470)} y={wy(298)} size={92} z={30} rot={-5}
                opacity={keyed(f, [A(0.03), A(0.06), a2 - A(0.02), a2], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > A(0.09) && f < a2 && (
              <IconPng src={IC("nafta")} x={wx(700)} y={wy(276)} size={84} z={50} rot={4}
                opacity={keyed(f, [A(0.09), A(0.12), a2 - A(0.02), a2], [0, 0.88, 0.88, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > tCal - A(0.01) && f < A(0.4) && (
              <IconPng src={IC("calendario")} x={wx(430)} y={wy(300)} size={100} z={30} rot={-4}
                opacity={keyed(f, [tCal - A(0.01), tCal + A(0.02), A(0.374), A(0.4)], [0, 0.94, 0.94, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > A(0.29) && f < A(0.4) && (
              <IconPng src={IC("generador")} x={wx(1490)} y={wy(226)} size={92} z={60} rot={5}
                opacity={keyed(f, [A(0.29), A(0.32), A(0.374), A(0.4)], [0, 0.9, 0.9, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > t900 - A(0.006) && f < a4 && (
              <IconPng src={IC("billete")} x={wx(340)} y={wy(300)} size={96} z={40} rot={-6}
                opacity={keyed(f, [t900 - A(0.006), t900 + A(0.024), a4 - A(0.02), a4], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > t150 - A(0.008) && f < a5 && (
              <IconPng src={IC("bateria")} x={wx(VOLT_X - 152)} y={wy(FLOOR - 462)} size={90} z={40} rot={-4}
                opacity={keyed(f, [t150 - A(0.008), t150 + A(0.022), a5 - A(0.03), a5], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.volt} />
            )}
            {f > t150 + A(0.01) && f < a5 && (
              <IconPng src={IC("inversor")} x={wx(VOLT_X + 152)} y={wy(FLOOR - 462)} size={90} z={40} rot={5}
                opacity={keyed(f, [t150 + A(0.01), t150 + A(0.036), a5 - A(0.03), a5], [0, 0.9, 0.9, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.volt} />
            )}
            {f > a5 && f < tWipe && (
              <IconPng src={IC("nube")} x={wx(320)} y={wy(228)} size={96} z={70} rot={-3}
                opacity={keyed(f, [a5, a5 + A(0.028), tWipe - A(0.02), tWipe], [0, 0.88, 0.88, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.sky} />
            )}
          </Plane>

          {/* ── PLANO 320 · primer plano: el polvo del patio, siempre vivo ── */}
          <Plane z={320}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {Array.from({ length: 14 }, (_, i) => {
                const a = rnd(i * 2.19), b = rnd(i * 5.07);
                const px = a * 108 - 4 + Math.sin(f / (58 + b * 74) + i) * 2.4;
                const py = ((b * 1300 - f * (0.18 + a * 0.42)) % 1300 + 1300) % 1300;
                const dm = 2 + b * 5;
                return <div key={i} style={{
                  position: "absolute", left: `${px.toFixed(2)}%`, top: 1250 - py, width: dm, height: dm,
                  borderRadius: "50%", background: rgba(lum, 0.5), opacity: 0.16 + a * 0.4,
                }} />;
              })}
            </div>
          </Plane>
        </AbsoluteFill>
      </Layers>

      {/* ══ EL AIRE — el viento del video y, en el acto 5, la lluvia de verdad ═══════════════ */}
      <WindField speed={wind} tint={rainP > 0.4 ? V.sky : lum} count={18} opacity={0.7} />
      <Rain f={f} p={rainP} />

      {/* ══ FRONTERA D · ZOOM-THROUGH: atravesamos la lluvia del patio ══════════════════════ */}
      {zActive && (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", perspective: "1500px", transformStyle: "preserve-3d" }}>
          <AbsoluteFill style={{
            transform: `scale(${lerp(1, 9.6, EZ.expo(zin)).toFixed(3)})`,
            transformOrigin: "66% 32%", transformStyle: "preserve-3d",
            opacity: 1 - zout,
          }}>
            <Sequence from={a5 - A(0.024)} durationInFrames={Math.max(2, A(0.055))} layout="none">
              <MediaCard src={VID(M.lluvia)} kind="video" w={452} h={280} x={66} y={32} z={0}
                radius={12} lit={1} litColor={V.sky} label="Y A VECES, LLOVIENDO" sheenAt={10} />
            </Sequence>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ══ FRONTERA A · OCLUSIÓN: la chapa pintada del bidón cruza. ⛔ color de LA MATERIA. ═ */}
      <SeamOcclude at={a2 - A(0.016)} dur={A(0.03)} color={CHAPA} angle={9} />

      {/* ══ FRONTERA C · CORTE EN EL BEAT: "ciento cincuenta" ═══════════════════════════════ */}
      <SeamFlash at={a4} color={V.volt} dur={6} />

      {/* ══ SALIDA · WIPE POR MATERIA: la lluvia se lleva todo y deja las DOS COLUMNAS DE PIE ═ */}
      <SeamWipeMatter at={tWipe} dur={A(0.05)} tint={V.sky} />

      {/* ══ TIPOGRAFÍA — 1 idea por acto, titular ≤7 palabras, cama oscura obligatoria ═══════ */}
      {T1.on && (
        <div style={{ position: "absolute", left: 92, bottom: 92, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T1.dy).toFixed(1)}px)`, opacity: T1.op }}>
          <Bed pad={26} w={620}>
            <Kick color={V.sky}>EL PRECIO DE GÓNDOLA</Kick>
            <div style={{ height: 12 }} />
            <Head size={62}>LO QUE <Em color={V.amber}>NO ESTÁ</Em> EN EL PRECIO</Head>
          </Bed>
        </div>
      )}
      {T2.on && (
        <div style={{ position: "absolute", left: 92, bottom: 92, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T2.dy).toFixed(1)}px)`, opacity: T2.op }}>
          <Bed pad={26} w={640}>
            <Kick color={V.amber}>PARADO SEIS MESES, NO ARRANCA</Kick>
            <div style={{ height: 12 }} />
            <Head size={62}>ARRANCARLO <Em color={V.amber}>UNA VEZ POR MES</Em></Head>
          </Bed>
        </div>
      )}
      {T3.on && (
        <div style={{ position: "absolute", left: 92, bottom: 92, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T3.dy).toFixed(1)}px)`, opacity: T3.op }}>
          <Bed pad={26} w={620}>
            <Kick color={V.amber}>NAFTA · ACEITE · CARBURADOR</Kick>
            <div style={{ height: 12 }} />
            <Head size={62}>$900. Y <Em color={V.amber}>SIGUE SUBIENDO</Em></Head>
          </Bed>
        </div>
      )}
      {T4.on && (
        <div style={{ position: "absolute", left: 92, bottom: 92, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T4.dy).toFixed(1)}px)`, opacity: T4.op }}>
          <Bed pad={26} w={640}>
            <Kick>BATERÍA + INVERSOR</Kick>
            <div style={{ height: 12 }} />
            <Head size={62}>
              {f < tQuieta ? <>$150. <Em>UNA SOLA VEZ</Em></> : <>UNA <Em>NO SE MUEVE</Em> MÁS</>}
            </Head>
          </Bed>
        </div>
      )}
      {T5.on && (
        <div style={{ position: "absolute", left: 92, bottom: 92, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T5.dy).toFixed(1)}px)`, opacity: T5.op }}>
          <Bed pad={26} w={640}>
            <Kick color={V.sky}>Y UN COSTO QUE NO SE MIDE</Kick>
            <div style={{ height: 12 }} />
            <Head size={62}>LA QUE ESTÁ <Em>MÁS CERCA</Em></Head>
          </Bed>
        </div>
      )}

      {/* ══ viñeta viva: el plano no se cierra, sigue respirando hasta el corte ═════════════ */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.22 + 0.05 * Math.sin(f / 91)).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática sutil en los dos picos (nunca un blur a pantalla completa) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [a4 - 8, a4 + 16, tQuieta, a5 - 6, a5 + 26], [0, 0.13, 0.09, 0.13, 0], [EZ.push, EZ.lin, EZ.lin, EZ.soft]),
        background: `linear-gradient(94deg, ${rgba(V.amber, 0.2)} 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, ${rgba(V.volt, 0.15)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
