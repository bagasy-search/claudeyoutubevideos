// MovMarcador.tsx — MOVIMIENTO 5 de `cmeduelo` · "EL MARCADOR DE LOS 18 DÍAS" · ~1260 frames (42 s)
// Canal Claudio Mendoza Constructor (ES) · s169-s178. ⛔ NO es un gráfico pegado sobre el video:
// es UN PLANO SECUENCIA de 42 s dentro del cuaderno de Claudio.
//
// LA IDEA DE PUESTA EN ESCENA: **la página del cuaderno SE CONVIERTE en el gráfico.** No hay corte a
// una lámina genérica. El suelo del gráfico ES la foto real del cuaderno (`cmed_h_906_cuadernoPeligros`),
// agrandada hasta llenar el cuadro; encima corren los renglones, el margen rojo y la espiral. Las dos
// columnas de números escritos a mano —la del panel y la de la turbina— están en la MISMA x donde
// después crecen las dos barras: cada renglón COMPRIME su altura de 40 px (el renglón del cuaderno) a
// su altura real en vatios hora, y la tinta se vuelve materia. Los 18 días siguen ahí, uno por
// segmento, con su hairline: se ve "día por día", que es literalmente lo que dice el guion.
// Por eso la columna de la turbina se derrumba sola: sus 18 renglones colapsan en 68 px.
//
// LA MATERIA QUE CRUZA LAS 5 FRONTERAS: **EL PAPEL**. Acto 1 es la hoja iluminada por la linterna
// (hereda la pantallita encendida de MovNoche), acto 2-3 es la superficie sobre la que crecen las
// barras y la serie diaria, la frontera C es una hoja que pasa y tapa el cuadro, acto 5 es el papel
// bajo la lupa, y al final el papel se va con un wipe de materia y **deja las dos columnas de pie**
// sobre la losa del patio — que es lo que MovVeredicto convierte en el panel y la turbina enfrentados.
//
// UNA cámara: `gcam(clk(f), {z0:60 → z1:200, ry:-10})`. El reloj `clk` está deformado por acto pero es
// MONÓTONO: z sale de 60 (donde lo dejó MovNoche) y llega a 200, y no vuelve nunca. El encuadre real
// lo hacen `net` (aumento) y el foco (qué punto del mundo va al centro): el recorrido es MACRO sobre la
// letra a mano → paneo a la derecha por la serie diaria → macro en la columna ámbar → GENERAL con las
// dos columnas de pie. UNA atmósfera `<VoltAtmos/>` montada una sola vez para los 1260 frames.
// LA LUZ: TORCH (resto de linterna de la noche) → ÁMBAR PLENO (acá se habla de plata, y el ámbar es
// el color del dinero en este video). EL VIENTO: .30 → .12 (estamos adentro, en la mesa) con UNA
// ráfaga de memoria a .34 en la noche del temporal, y aterriza en .10.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DE MovNoche: cam {z0:60, panX:+90, plano cerrado en el suelo} · luz {torch → ámbar} ·
//    viento {.30} · materia {la pantallita encendida de la estación de energía sobre el suelo mojado}
//
// ACTO 1 · 0 → .141·D · "LA LETRA FEA DE SIEMPRE"     (protagonista: EL CUADERNO — foto real)
//   enterFrom cam {z 60, net 1.90, foco (520,560) macro} luz {TORCH, key .22, int .82} viento {.30}
//             materia {un rectángulo encendido en la oscuridad: la pantallita, que resulta ser la HOJA}
//   material  {la página real `cmed_h_906_cuadernoPeligros` + clip `cmed_h_907_gestoAdvertencia` (Claudio)}
//   exitTo    cam {net 2.35, foco (520,640)} luz {torch+8% ámbar} viento {.24} materia {la hoja llena el cuadro}
//   ── FRONTERA A @ .106→.152 ····· MATCH-SHAPE ★ ·····························································
//      La tarjeta del cuaderno se DESPLIEGA hasta ser la página entera (mismos cuatro vértices
//      interpolados, misma foto adentro) y la columna de números escritos a mano se vuelve el EJE:
//      nace la vertical en x=425 y el renglón de y=830 se engrosa hasta ser la base del gráfico.
//
// ACTO 2 · .141 → .333·D · "EL PANEL: 4.100 Wh"       (protagonista: LA COLUMNA VOLTIO)
//   enterFrom cam {net 1.62, foco (560,600)} luz {torch→ámbar 45%} viento {.14} materia {la hoja a sangre}
//   .152 los 18 renglones COMPRIMEN su pitch (40 px → su altura real) y la tinta se vuelve barra → 4.100 Wh
//   .262 el 4.100 se PLIEGA en 4,1 kWh (misma cifra, otra unidad, sin perder la columna)
//   exitTo    cam {net 1.44 → 1.20, YA paneando a la derecha} luz {ámbar 60%} viento {.12}
//   ── FRONTERA B @ .318→.345 ····· MATCH-MOVE ·······························································
//      La cámara ya viene paneando a la derecha desde .262; la serie diaria entra ARRASTRADA por ese
//      mismo vector (se revela de izquierda a derecha a la velocidad del paneo). No hay corte.
//
// ACTO 3 · .333 → .476·D · "290 · 85 · 228 POR DÍA"   (protagonista: LA SERIE DIARIA)
//   enterFrom cam {net 1.20, foco (1000,560)} luz {ámbar 78%} viento {.12} materia {los renglones}
//   material  {DÍA BUENO = clip `cmed_h_918_atornillaPared` + ícono sol · DÍA NUBLADO = foto
//              `cmed_o_920_posteTensores` + ícono nube — cada uno en su tarjeta con línea de guía a su tick}
//   exitTo    cam {net 1.20, foco (1020,660)} luz {ÁMBAR pleno} viento {.12} materia {la hoja}
//   ── FRONTERA C @ .466→.487 ····· OCLUSIÓN (SeamOcclude color PAPEL, no el fondo) ··················
//      Claudio pasa la hoja: una banda de PAPEL cruza y tapa el 100% ~6 frames. El corte de acto cae
//      adentro. ⛔ el color es el del papel `#B6A984`, nunca el del fondo.
//
// ACTO 4 · .476 → .627·D · "LA TURBINA: 496 Wh"       (protagonista: LA COLUMNA ÁMBAR)
//   enterFrom cam {net 1.20, foco (1020,660) — LAS DOS COLUMNAS EN EL MISMO CUADRO, mismo eje, misma escala}
//             luz {ÁMBAR pleno} viento {.12} materia {la segunda columna escrita a mano, todavía tinta}
//   material  {clip `cmed_o_910_palasEmbaladas` — el mismo patio, los mismos 18 días}
//   .482 sus 18 renglones colapsan en 68 px: la desproporción se ve a ojo, sin que nadie la explique
//   exitTo    cam {net 1.72 empujando} luz {ámbar} viento {.12 → .34 (vuelve el temporal)}
//   ── FRONTERA D @ .612→.650 ····· ZOOM-THROUGH ·····························································
//      La cámara ATRAVIESA la tarjeta de la noche del temporal (`cmed_h_913_nocheLinterna` corriendo):
//      la tarjeta crece hasta cubrir el cuadro y salimos del otro lado ADENTRO de la columna ámbar,
//      pegados al segmento de los 187. Las tarjetas del acto 4 se van con `zoomThrough`.
//
// ACTO 5 · .627 → .817·D · "187 DE UNA SOLA NOCHE"    (protagonista: EL SEGMENTO DENTRO DE LA COLUMNA)
//   enterFrom cam {net 2.20, foco (1520,790) macro en la barra} luz {ámbar + relámpago} viento {.34}
//   .667 el segmento del día 14 se enciende con textura de tormenta DENTRO de la barra: 187 Wh
//   .730 el segmento se DESPRENDE y se va: la resta en vivo 496 − 187, y la columna se recompacta a 309
//   exitTo    cam {net 2.20} luz {ÁMBAR pleno} viento {.30 bajando} materia {la columna ámbar de 309}
//   ── FRONTERA E @ .817 ····· CORTE EN EL BEAT ······························································
//      Golpe seco de 6 frames (`SeamFlash` ámbar) exactamente en "diecisiete días": el encuadre salta
//      de macro (net 2.20) a general (net 0.92) en 3 frames. Debajo del flash cambia también la cama
//      de fondo: entra `cmed_h_902_ernestoPaga10` — el dinero, que es hacia donde va el guion.
//
// ACTO 6 · .817 → 1.0·D · "×8 … ×13"                  (protagonista: LAS DOS COLUMNAS DE PIE)
//   enterFrom cam {net 0.92, foco (980,660) — la página entera a la vista, con su espiral} luz {ÁMBAR}
//   .845 las dos barras de TIEMPO debajo del renglón base: 1,4 días de sol contra 17 días de viento,
//        y el conector punteado que muestra que 309 Wh es EXACTAMENTE la misma altura en las dos columnas
//   .889 → .930 el multiplicador se CORRIGE delante del espectador: ×8 rueda y se vuelve ×13
//   .960 el papel se va con un WIPE POR MATERIA y deja las dos columnas de pie sobre la losa
//   exitTo ⟶ cam {z1:200, ry:-10, net 0.80} · luz {ÁMBAR PLENO} · viento {.10} ·
//            materia {LAS DOS COLUMNAS (voltio y ámbar) DE PIE} → MovVeredicto las enfrenta.
//
// ⛔ cero Math.random/Date.now · cero backdrop-filter · cero blur grande a pantalla completa · cero fade.
// ⛔ Easing.quint no existe → Easing.poly(5). Imports SÓLO de remotion, react y ./VoltStage.
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
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

/* ══ MATERIAL REAL (⛔ SÓLO nombres de _v3/material_MovMarcador.txt) ═══════════════════════════ */
const IMG = (n: string) => `img/cmeduelo/${n}.jpg`;
const VID = (n: string) => `broll/cmeduelo/${n}.mp4`;
const IC = (n: string) => `img/cmeduelo/cmed_ic_${n}.png`;
const M = {
  cuaderno: "cmed_h_906_cuadernoPeligros",   // LA PÁGINA: el suelo del gráfico entero
  claudio: "cmed_h_907_gestoAdvertencia",    // el gancho de entrada (clip)
  diaBueno: "cmed_h_918_atornillaPared",     // día de sol pleno: 290 Wh (clip)
  diaNublado: "cmed_o_920_posteTensores",    // cielo cubierto: 85 Wh (foto)
  patio: "cmed_o_910_palasEmbaladas",        // el mismo patio, los mismos 18 días (clip)
  noche: "cmed_h_913_nocheLinterna",         // la noche del temporal (clip) — el zoom-through
  temporal: "cmed_o_909_turbinaSinFreno",    // la turbina embalada esa noche (foto)
  cierre: "cmed_h_925_veredictoFinal",       // Claudio cierra el cuaderno (clip)
  plata: "cmed_h_902_ernestoPaga10",         // la cama de fondo del remate: el dinero
};

/* ══ PAPEL / TINTA ════════════════════════════════════════════════════════════════════════════ */
const PAPER = "#D9CEB0";
const PAPER_D = "#B6A984";
const INK = "#2A2C20";
const INK_SOFT = "#4B4C3C";
const RULE_C = "rgba(64,84,110,0.30)";

/* ══ GEOMETRÍA DEL MUNDO (1920×1080) ══════════════════════════════════════════════════════════
   El gráfico vive en las mismas coordenadas que la página: el renglón y=830 ES la base del
   gráfico, y las dos columnas están en la x exacta donde están escritos los números. ══════════ */
const PAGE = { x0: 80, y0: 40, x1: 1840, y1: 1040 };
const CARDR = { x0: 430, y0: 268, x1: 1210, y1: 760 };   // la hoja como tarjeta en el haz de la linterna
const RULE = 40;                                          // el pitch del renglón del cuaderno
const Y0 = 830;                                           // el renglón que hace de base
const KWH = 560 / 4100;                                   // px por vatio-hora (columnas de 18 días)
const PANEL_X = 520, TURB_X = 1520, BAR_W = 190;
const SER_X0 = 780, SER_X1 = 1300, SER_K = 300 / 290, TICK_W = 16;
const T_X0 = 380, T_X1 = 1700, T_Y1 = 902, T_Y2 = 968, T_H = 34;
const DAYW = (T_X1 - T_X0) / 17;

/* Los 18 días, tal como están anotados en el cuaderno. Panel: suma 4.100, promedio 228, pico 290,
   dos nublados de 85. Turbina: suma 496, con 187 de una sola noche (el día 14) → 309 en 17 días. */
const PANEL_D = [240, 262, 244, 290, 85, 246, 255, 236, 248, 290, 229, 85, 252, 244, 238, 246, 225, 185];
const TURB_D = [12, 9, 22, 31, 6, 14, 19, 8, 26, 17, 11, 4, 29, 187, 23, 16, 21, 41];
const STORM_I = 13;            // la noche del temporal
const PEAK_I = 3;              // el día de 290
const LOW_I = 4;               // el primer nublado de 85
const LOW2_I = 11;             // el segundo nublado de 85

const mil = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const wx = (x: number) => (x / 1920) * 100;   // world → % (MediaCard/IconPng/Readout usan %)
const wy = (y: number) => (y / 1080) * 100;

type Row = { top: number; base: number; h: number; v: number };
/** LA TRANSFORMACIÓN: cada renglón pasa de 40 px (el cuaderno) a su altura real en Wh (el gráfico). */
const colGeom = (days: number[], morph: number, cut = 0, cutIdx = -1): Row[] => {
  const rows: Row[] = [];
  let y = Y0;
  for (let i = 0; i < days.length; i++) {
    const target = days[i] * KWH * (i === cutIdx ? 1 - cut : 1);
    const h = lerp(RULE, target, morph);
    rows.push({ top: y - h, base: y, h, v: days[i] });
    y -= h;
  }
  return rows;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA PÁGINA — foto REAL del cuaderno + papel + renglones + espiral. Se despliega de tarjeta a
   página entera con los cuatro vértices interpolados: es la MISMA hoja, no otra lámina.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const PaperPage: React.FC<{
  f: number; grow: number; lum: string; pool: number; out: number;
}> = ({ f, grow, lum, pool, out }) => {
  const x0 = lerp(CARDR.x0, PAGE.x0, grow), x1 = lerp(CARDR.x1, PAGE.x1, grow);
  const y0 = lerp(CARDR.y0, PAGE.y0, grow), y1 = lerp(CARDR.y1, PAGE.y1, grow);
  const w = x1 - x0, h = y1 - y0;
  const rot = lerp(-3.4, 0, grow) + Math.sin(f / 137) * 0.16;   // hold VIVO: la hoja nunca está muerta
  const wash = lerp(0.16, 0.74, grow);
  const rules = clamp01(grow * 1.9 - 0.85);
  const slide = out * 210;
  if (out >= 1) return null;
  return (
    <div style={{
      position: "absolute", left: x0, top: y0, width: w, height: h,
      transform: `rotate(${(rot - out * 5).toFixed(2)}deg) translate(${(-slide).toFixed(1)}px, ${(slide * 0.62).toFixed(1)}px)`,
      opacity: 1 - out,
      borderRadius: lerp(16, 5, grow), overflow: "hidden",
      boxShadow: `0 ${Math.round(h * 0.1)}px ${Math.round(h * 0.16)}px ${rgba(V.ink0, 0.8)}, 0 4px 18px ${rgba(V.ink0, 0.7)}`,
      border: `1px solid ${rgba(lum, 0.22)}`,
    }}>
      {/* MATERIAL REAL: la hoja escrita de Claudio */}
      <Img src={staticFile(IMG(M.cuaderno))} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${lerp(1.02, 1.1, grow).toFixed(3)})`,
      }} />
      {/* el papel gana la superficie sin tapar la textura de la foto */}
      <AbsoluteFill style={{
        background: `linear-gradient(166deg, ${rgba(PAPER, wash)} 0%, ${rgba(PAPER_D, wash * 0.94)} 62%, ${rgba("#9C9070", wash)} 100%)`,
      }} />
      {/* renglones + margen + espiral, en coordenadas de la página (escalan con ella) */}
      <svg viewBox={`0 0 ${PAGE.x1 - PAGE.x0} ${PAGE.y1 - PAGE.y0}`} preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: rules }}>
        {Array.from({ length: 24 }, (_, i) => {
          const yy = 110 + i * RULE - PAGE.y0;
          return <line key={i} x1={130} y1={yy} x2={PAGE.x1 - PAGE.x0 - 40} y2={yy} stroke={RULE_C} strokeWidth={1.6} />;
        })}
        <line x1={210 - PAGE.x0} y1={20} x2={210 - PAGE.x0} y2={PAGE.y1 - PAGE.y0 - 20}
          stroke="rgba(150,58,48,0.42)" strokeWidth={2.4} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(120 / (PAGE.x1 - PAGE.x0)) * 100}%`, opacity: rules }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: "34%", top: `${5 + i * 8.1}%`,
            width: `${lerp(26, 40, grow)}%`, height: `${lerp(1.6, 2.2, grow)}%`,
            borderRadius: 99,
            background: `linear-gradient(180deg, ${rgba("#C9C7BE", 0.9)} 0%, ${rgba("#6B6A62", 0.9)} 100%)`,
            boxShadow: `0 2px 6px ${rgba(V.ink0, 0.6)}`,
          }} />
        ))}
      </div>
      {/* el charco de luz: la linterna que se abre y se vuelve la lámpara de la mesa */}
      <AbsoluteFill style={{
        background: `radial-gradient(${lerp(46, 108, pool).toFixed(0)}% ${lerp(40, 92, pool).toFixed(0)}% at ${lerp(46, 54, pool).toFixed(0)}% ${lerp(52, 40, pool).toFixed(0)}%, ${rgba(lum, lerp(0.3, 0.15, pool))} 0%, rgba(0,0,0,0) 64%)`,
        mixBlendMode: "soft-light",
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(${lerp(44, 96, pool).toFixed(0)}% ${lerp(38, 86, pool).toFixed(0)}% at ${lerp(46, 54, pool).toFixed(0)}% ${lerp(52, 42, pool).toFixed(0)}%, rgba(0,0,0,0) ${lerp(24, 46, pool).toFixed(0)}%, rgba(6,7,4,${lerp(0.9, 0.58, pool).toFixed(2)}) 100%)`,
      }} />
      <AbsoluteFill style={{
        opacity: 0.07, mixBlendMode: "multiply",
        backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px",
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA TINTA — los números escritos a mano, uno por renglón. Cuando el renglón se comprime por
   debajo de lo legible, el número se apaga solo: la letra se convirtió en barra. El 187 sobrevive.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const InkNumbers: React.FC<{
  x: number; rows: Row[]; morph: number; alpha: number; keepIdx?: number; color?: string;
}> = ({ x, rows, morph, alpha, keepIdx = -1, color = INK }) => {
  if (alpha <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {rows.map((r, i) => {
        const keep = i === keepIdx;
        const a = keep ? 1 : clamp01((r.h - 13) / 12);
        if (a <= 0.02) return null;
        const px = lerp(x - 34, x + BAR_W / 2 + 26, morph) + (rnd(i * 4.7) - 0.5) * 9;
        const size = lerp(30, 25, morph) * (keep ? 1.24 : 1);
        return (
          <div key={i} style={{
            position: "absolute", left: px, top: r.base - r.h / 2,
            transform: `translateY(-50%) rotate(${((rnd(i * 2.3) - 0.5) * 4.6).toFixed(2)}deg)`,
            fontFamily: F_BODY, fontStyle: "italic", fontWeight: 700, fontSize: size,
            color: keep ? V.white : color, opacity: a,
            letterSpacing: 0.4, whiteSpace: "nowrap",
            textShadow: keep ? `0 0 22px ${rgba(V.amber, 0.9)}, 0 3px 10px rgba(0,0,0,0.9)` : `0 1px 0 ${rgba(PAPER, 0.5)}`,
          }}>{r.v}</div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   LA COLUMNA — 18 segmentos (uno por día, con su hairline: "día por día" se VE).
   El segmento i arranca justo cuando el i-1 llegó a su altura: la pila nunca se despega.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const Column: React.FC<{
  f: number; x: number; rows: Row[]; fill: number; color: string; alpha: number;
  stormIdx?: number; stormHot?: number; floor?: number; bandTo?: number; bandOn?: number;
}> = ({ f, x, rows, fill, color, alpha, stormIdx = -1, stormHot = 0, floor = 0, bandTo = 0, bandOn = 0 }) => {
  if (alpha <= 0.01) return null;
  const n = rows.length;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {/* sombra de contacto: en el papel primero, en la losa del patio al final */}
      <div style={{
        position: "absolute", left: x - BAR_W * 0.86, top: Y0 - 10, width: BAR_W * 1.72, height: 52,
        background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${(0.4 + 0.26 * floor).toFixed(2)}) 0%, rgba(0,0,0,0) 72%)`,
      }} />
      {rows.map((r, i) => {
        const on = clamp01(fill * (n + 1) - i);
        if (on <= 0.002) return null;
        const h = r.h * on;
        if (h < 0.35) return null;
        const st = i === stormIdx ? stormHot : 0;
        const born = clamp01((fill * (n + 1) - i) * 2.4);
        return (
          <div key={i} style={{
            position: "absolute", left: x - BAR_W / 2, top: r.base - h, width: BAR_W, height: h,
            background: st > 0.02
              ? `repeating-linear-gradient(58deg, ${rgba(V.torch, 0.42 * st)} 0px, ${rgba(V.torch, 0.42 * st)} 4px, ${rgba(color, 0.98)} 4px, ${rgba(color, 0.98)} 13px)`
              : `linear-gradient(96deg, ${rgba(color, 0.7)} 0%, ${rgba(color, 0.98)} 34%, ${rgba(color, 0.8)} 78%, ${rgba(color, 0.58)} 100%)`,
            borderTop: `1.5px solid ${rgba(V.ink0, i === n - 1 ? 0 : 0.34)}`,
            boxShadow: st > 0.02
              ? `0 0 ${(34 * st).toFixed(0)}px ${rgba(V.torch, 0.6 * st)}, inset 0 0 0 2px ${rgba(V.white, 0.5 * st)}`
              : `inset -8px 0 14px ${rgba(V.ink0, 0.26)}, inset 8px 0 12px ${rgba(V.white, 0.1)}`,
            transform: `scaleY(${lerp(0.94, 1, born).toFixed(3)})`, transformOrigin: "50% 100%",
          }} />
        );
      })}
      {/* la banda de los 309 Wh sobre la columna del panel: "poco más de un día de sol" */}
      {bandOn > 0.01 && (
        <div style={{
          position: "absolute", left: x - BAR_W / 2 - 5, top: Y0 - bandTo * bandOn, width: BAR_W + 10, height: bandTo * bandOn,
          border: `2.5px solid ${rgba(V.white, 0.86 * bandOn)}`,
          background: `linear-gradient(180deg, ${rgba(V.white, 0.24 * bandOn)}, rgba(255,255,255,0))`,
          boxShadow: `0 0 ${(26 * bandOn).toFixed(0)}px ${rgba(V.white, 0.4 * bandOn)}`,
        }} />
      )}
      {/* brillo de coronación: viaja con el frente de crecimiento (nada quieto más de 1,5 s) */}
      {fill > 0.02 && (() => {
        const kIdx = Math.min(n - 1, Math.max(0, Math.floor(fill * (n + 1))));
        const crownY = rows[kIdx].base - rows[kIdx].h * clamp01(fill * (n + 1) - kIdx);
        return (
          <div style={{
            position: "absolute", left: x - BAR_W / 2, top: crownY - 3,
            width: BAR_W, height: 6, borderRadius: 3,
            background: rgba(V.white, 0.34 + 0.2 * Math.sin(f / 13)),
          }} />
        );
      })()}
    </div>
  );
};

/* ══ LA SERIE DIARIA — 18 ticks sobre el renglón: el día de 290, los nublados de 85, el promedio ══ */
const Series: React.FC<{ f: number; rev: number; alpha: number; markP: number }> = ({ f, rev, alpha, markP }) => {
  if (alpha <= 0.01) return null;
  const pitch = (SER_X1 - SER_X0) / (PANEL_D.length - 1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: alpha }}>
      {PANEL_D.map((v, i) => {
        const on = clamp01(rev * (PANEL_D.length + 2) - i);
        if (on <= 0.002) return null;
        const h = v * SER_K * on;
        const isPeak = i === PEAK_I, isLow = i === LOW_I || i === LOW2_I;
        const hot = (isPeak || isLow) ? markP : 0;
        const c = isLow ? V.sky : V.volt;
        return (
          <div key={i} style={{
            position: "absolute", left: SER_X0 + i * pitch - TICK_W / 2, top: Y0 - h, width: TICK_W, height: h,
            background: `linear-gradient(180deg, ${rgba(c, 0.95)} 0%, ${rgba(c, 0.5)} 100%)`,
            boxShadow: hot > 0.02
              ? `0 0 ${(20 * hot).toFixed(0)}px ${rgba(c, 0.8 * hot)}, inset 0 0 0 1.5px ${rgba(V.white, 0.7 * hot)}`
              : `inset -3px 0 6px ${rgba(V.ink0, 0.3)}`,
            transform: `scaleY(${(1 + hot * 0.02 * Math.sin(f / 9)).toFixed(4)})`, transformOrigin: "50% 100%",
          }} />
        );
      })}
    </div>
  );
};

/* ══ LAS BARRAS DE TIEMPO — 1,4 días de sol contra 17 días de viento ═══════════════════════════ */
const TimeBars: React.FC<{ f: number; p: number }> = ({ f, p }) => {
  if (p <= 0.01) return null;
  const rows = [
    { y: T_Y1, days: 1.4, c: V.volt, t: "1,4 DÍAS DE SOL" },
    { y: T_Y2, days: 17, c: V.amber, t: "17 DÍAS DE VIENTO" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {rows.map((r, i) => {
        const on = clamp01(p * 2.1 - i * 0.55);
        if (on <= 0.01) return null;
        const w = r.days * DAYW * on;
        return (
          <div key={i}>
            <div style={{
              position: "absolute", left: T_X0, top: r.y, width: w, height: T_H, borderRadius: 4,
              background: `linear-gradient(90deg, ${rgba(r.c, 0.95)} 0%, ${rgba(r.c, 0.66)} 100%)`,
              boxShadow: `0 6px 18px ${rgba(V.ink0, 0.7)}, inset 0 -6px 10px ${rgba(V.ink0, 0.22)}`,
            }} />
            <div style={{
              position: "absolute", left: T_X0 + w + 18, top: r.y + T_H / 2, transform: "translateY(-50%)",
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2.4, whiteSpace: "nowrap",
              color: r.c, opacity: clamp01(on * 1.6 - 0.6),
              textShadow: "0 3px 14px rgba(0,0,0,0.95)",
            }}>{r.t}</div>
            {/* las muescas de los días: se cuentan a ojo */}
            {Array.from({ length: Math.floor(r.days) }, (_, d) => (
              <div key={d} style={{
                position: "absolute", left: T_X0 + (d + 1) * DAYW - 1, top: r.y + 4, width: 2, height: T_H - 8,
                background: rgba(V.ink0, 0.3), opacity: on,
              }} />
            ))}
            <div style={{
              position: "absolute", left: T_X0 - 16, top: r.y + T_H / 2, transform: "translate(-100%,-50%)",
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3, color: rgba(V.white, 0.8),
              opacity: on, textShadow: "0 3px 14px rgba(0,0,0,0.95)",
            }}>{i === 0 ? "PANEL" : "TURBINA"}</div>
          </div>
        );
      })}
      <div style={{
        position: "absolute", left: T_X0, top: T_Y1 - 16, width: (T_X1 - T_X0) * clamp01(p * 1.4), height: 1.5,
        background: rgba(V.white, 0.16 + 0.06 * Math.sin(f / 41)),
      }} />
    </div>
  );
};

/* ══ EL MULTIPLICADOR QUE SE CORRIGE: ×8 rueda y se vuelve ×13 ═════════════════════════════════ */
const Multiplier: React.FC<{ p8: number; p13: number }> = ({ p8, p13 }) => {
  if (p8 <= 0.01) return null;
  const slot = 172;
  const roll = EZ.snap(clamp01(p13));
  return (
    <div style={{
      position: "absolute", left: wx(960) + "%", top: wy(292) + "%",
      transform: `translate(-50%,-50%) scale(${lerp(0.82, 1, EZ.snap(clamp01(p8))).toFixed(3)})`,
      opacity: clamp01(p8 * 1.6),
    }}>
      <Bed pad={30}>
        <div style={{ textAlign: "center" }}>
          <Kick color={p13 > 0.5 ? V.amber : V.volt}>
            {p13 > 0.5 ? "SI TE OLVIDÁS DE LA TORMENTA" : "EL PANEL ENTREGÓ"}
          </Kick>
          <div style={{ height: 10 }} />
          <div style={{ height: slot, overflow: "hidden", position: "relative", width: 420 }}>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${(-roll * slot).toFixed(1)}px)` }}>
              <div style={{ height: slot, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Num size={150} color={V.volt}>×8</Num>
              </div>
              <div style={{ height: slot, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Num size={150} color={V.amber}>×13</Num>
              </div>
            </div>
          </div>
          <div style={{ height: 4 }} />
          <Kick color={rgba(V.white, 0.72)}>MÁS ENERGÍA QUE LA TURBINA</Kick>
        </div>
      </Bed>
    </div>
  );
};

/* ══ PLACA DE CIFRA — la cama oscura que garantiza legibilidad sobre el papel ══════════════════ */
const Plate: React.FC<{ x: number; y: number; w: number; h: number; a: number; c: string }> = ({ x, y, w, h, a, c }) => {
  if (a <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 14, opacity: a,
      background: "linear-gradient(180deg, rgba(8,9,6,0.92) 0%, rgba(8,9,6,0.76) 100%)",
      boxShadow: `0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px ${rgba(c, 0.26)}`,
    }} />
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

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovMarcador: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const f = useCurrentFrame();
  /* los actos son FRACCIONES de la duración: sobreviven al re-anclaje al Whisper (±20%) */
  const A = (fr: number) => Math.round(D * fr);

  /* ── anclas del guion (s169-s178) ───────────────────────────────────────────────────────── */
  const a2 = A(0.141), s170 = A(0.152), kwh = A(0.262);
  const a3 = A(0.333), peak = A(0.365), valley = A(0.405), avg = A(0.44);
  const a4 = A(0.476), t496 = A(0.56);
  const a5 = A(0.627), n187 = A(0.667), cutAt = A(0.73), t309 = A(0.786);
  const a6 = A(0.817), times = A(0.845), x8 = A(0.889), x13 = A(0.93), close = A(0.96);

  /* ── UNA cámara. `clk` deforma el tiempo por acto pero es MONÓTONO: z 60 → 200 y no vuelve. ── */
  const clk = keyed(f, [0, a2, a3, a4, a5, a6, D], [0, A(0.1), A(0.3), A(0.5), A(0.66), A(0.86), D],
    [EZ.soft, EZ.glide, EZ.lin, EZ.glide, EZ.push, EZ.soft]);
  const g = gcam(clk, { z0: 60, z1: 200, panX: 90, dur: D, ry: -10, rx: 2.2 });
  const mag = 1500 / (1500 - g.z);

  /* el encuadre real: aumento neto + qué punto del mundo va al centro de pantalla */
  const NK = [0, a2, s170, kwh, a3, a4, a5, n187, cutAt, a6 - 3, a6, times, x13, D];
  const net = keyed(f, NK, [1.9, 2.35, 1.62, 1.44, 1.2, 1.2, 1.72, 2.2, 2.2, 2.14, 0.92, 0.86, 0.8, 0.78],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.lin, EZ.lin, EZ.lin, EZ.push, EZ.glide, EZ.soft]);
  const fx = keyed(f, NK, [520, 520, 560, 610, 1000, 1020, 1470, 1520, 1520, 1520, 980, 960, 960, 950],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.lin, EZ.lin, EZ.lin, EZ.push, EZ.glide, EZ.soft]);
  const fy = keyed(f, NK, [560, 640, 600, 566, 560, 660, 730, 790, 788, 788, 660, 646, 626, 620],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.lin, EZ.lin, EZ.lin, EZ.push, EZ.glide, EZ.soft]);
  const ws = net / mag;
  const panX = 960 - fx, panY = 540 - fy;

  /* ── LA LUZ: torch (lo que queda de la linterna) → ÁMBAR PLENO (la plata) ─────────────────── */
  const stage = keyed(f, [0, a2, s170, a3, a4, D], [0, 0.08, 0.45, 0.78, 1, 1], [EZ.lin, EZ.push, EZ.glide, EZ.soft, EZ.lin]);
  const lum = light(stage, "torch", "amber");
  const keyFrom = keyed(f, [0, a3, a5, D], [0.22, 0.46, 0.64, 0.72], EZ.soft);
  const inten = keyed(f, [0, a3, n187, a6, D], [0.82, 0.98, 1.14, 1.06, 1.12], EZ.soft);

  /* ── EL VIENTO: adentro, en la mesa (.30 → .12), una ráfaga de memoria del temporal, y .10 ── */
  const wind = keyed(f, [0, A(0.1), A(0.22), a5, n187, A(0.75), A(0.82), D],
    [0.3, 0.22, 0.12, 0.13, 0.34, 0.28, 0.1, 0.1], [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.soft, EZ.glide, EZ.lin]);

  /* ── LA TRANSFORMACIÓN cuaderno → gráfico ─────────────────────────────────────────────────── */
  const grow = keyed(f, [A(0.106), s170], [0, 1], EZ.push);
  const pool = keyed(f, [A(0.12), a3], [0, 1], EZ.glide);
  const axisP = keyed(f, [A(0.132), A(0.208)], [0, 1], EZ.push);
  const panelMorph = keyed(f, [A(0.148), A(0.252)], [0, 1], EZ.glide);
  const panelFill = keyed(f, [A(0.158), A(0.258)], [0, 1], EZ.push);
  const turbMorph = keyed(f, [A(0.482), A(0.556)], [0, 1], EZ.glide);
  const turbFill = keyed(f, [A(0.492), a5 - 6], [0, 1], EZ.push);
  const cutP = keyed(f, [cutAt, cutAt + A(0.046)], [0, 1], EZ.push);
  const stormHot = keyed(f, [n187 - A(0.012), n187 + A(0.022), cutAt, cutAt + A(0.02)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const serRev = keyed(f, [a3 - A(0.014), a3 + A(0.072)], [0, 1], EZ.glide);
  const markP = keyed(f, [peak - 6, peak + 14, a4 - A(0.01), a4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const avgP = keyed(f, [avg - 4, avg + A(0.026)], [0, 1], EZ.push);
  const sameP = keyed(f, [times - A(0.012), times + A(0.03)], [0, 1], EZ.push);
  const timeP = keyed(f, [times + A(0.008), times + A(0.078)], [0, 1], EZ.glide);
  const p8 = keyed(f, [x8 - 4, x8 + A(0.022)], [0, 1], EZ.push);
  const p13 = keyed(f, [x13, x13 + A(0.026)], [0, 1], EZ.snap);

  /* ── el cierre: el papel se va y deja las dos columnas DE PIE sobre la losa ──────────────── */
  const paperOut = keyed(f, [close, D - A(0.018)], [0, 1], EZ.push);
  const chartOut = 1 - keyed(f, [close - A(0.006), close + A(0.024)], [0, 1], EZ.push);

  /* ── geometría de las dos columnas (una sola vez por frame) ──────────────────────────────── */
  const pRows = colGeom(PANEL_D, panelMorph);
  const tRows0 = colGeom(TURB_D, turbMorph);
  const tRows = colGeom(TURB_D, turbMorph, cutP, STORM_I);
  const ghost = tRows0[STORM_I];
  const band309 = 309 * KWH;

  /* ── FRONTERA D · ZOOM-THROUGH: la tarjeta de la noche crece hasta que la atravesamos ────── */
  const ztAt = a5 - A(0.015);
  const zt = zoomThrough(f, ztAt, A(0.038), 72, 34);
  const zin = clamp01((f - (a5 - A(0.02))) / A(0.03));
  const zout = clamp01((f - (a5 + A(0.012))) / A(0.014));
  const zActive = f >= a5 - A(0.021) && f < a5 + A(0.028);

  /* ── ventanas de texto: UNA idea por acto, ≤7 palabras, cama oscura obligatoria ──────────── */
  const tw = (i0: number, i1: number) => {
    const inP = clamp01((f - i0) / 13);
    const outP = clamp01((f - (i1 - 15)) / 15);
    return { on: f > i0 && f < i1, op: inP * (1 - outP), dy: lerp(30, 0, EZ.snap(inP)) };
  };
  const T1 = tw(A(0.014), A(0.132));
  const T2 = tw(A(0.168), A(0.3));
  const T3 = tw(A(0.348), A(0.462));
  const T4 = tw(A(0.494), A(0.608));
  const T5 = tw(A(0.648), A(0.806));
  const T6 = tw(A(0.828), D - 4);
  const paraX = -panX * 0.014, paraY = -panY * 0.01;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los 1260 frames. No se remonta entre actos. ══ */}
      <VoltAtmos tint={lum} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={0.6} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ═══════════════════════════════════════════════════ */}
      <Layers cam={g.transform}>
        {/* cama de fondo REAL: la noche de la que venimos → el dinero hacia el que vamos */}
        {f < a6 ? (
          <PhotoPlane src={IMG(M.noche)} z={-520} scale={keyed(f, [0, a6], [1.5, 1.24], EZ.soft)} dim={0.72} tint={lum} />
        ) : (
          <PhotoPlane src={IMG(M.plata)} z={-520} scale={keyed(f, [a6, D], [1.3, 1.18], EZ.soft)} dim={0.68} tint={V.amber} />
        )}

        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── PLANO −120 · LA MESA: la madera bajo el cuaderno ── */}
          <Plane z={-120}>
            <div style={{
              position: "absolute", left: -300, top: PAGE.y1 - 120, width: 2600, height: 700,
              background: `linear-gradient(180deg, ${rgba("#3A2E1E", 0.9)} 0%, ${rgba(V.ink0, 0.98)} 78%)`,
              opacity: clamp01(grow * 0.8 + paperOut * 0.5),
            }} />
          </Plane>

          {/* ── PLANO −20 · LA PÁGINA: el suelo del gráfico ── */}
          <Plane z={-20}>
            <PaperPage f={f} grow={grow} lum={lum} pool={pool} out={paperOut} />
          </Plane>

          {/* ── PLANO 0 · EL GRÁFICO (acá los vectores SÍ son legítimos: un eje es un eje) ── */}
          <Plane z={0}>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              {/* el renglón de y=830 se engrosa hasta ser la base del gráfico (MATCH-SHAPE) */}
              <line x1={PANEL_X - BAR_W} y1={Y0} x2={lerp(PANEL_X, 1760, clamp01(axisP))} y2={Y0}
                stroke={rgba(V.white, 0.42 * axisP * chartOut)} strokeWidth={lerp(2, 5, axisP)} />
              {/* el eje vertical NACE de la columna de números */}
              <line x1={PANEL_X - BAR_W / 2 - 26} y1={Y0} x2={PANEL_X - BAR_W / 2 - 26} y2={lerp(Y0, 230, clamp01(axisP * 1.25))}
                stroke={rgba(V.white, 0.24 * axisP * chartOut)} strokeWidth={3} />
              {/* la línea del promedio 228/día sobre la serie */}
              {avgP > 0.01 && (
                <>
                  <line x1={SER_X0 - 40} y1={Y0 - 228 * SER_K} x2={lerp(SER_X0, SER_X1 + 60, clamp01(avgP * 1.2))} y2={Y0 - 228 * SER_K}
                    stroke={rgba(V.volt, 0.9 * avgP * chartOut)} strokeWidth={3.5} strokeDasharray="16 11" />
                  <text x={SER_X0 - 46} y={Y0 - 228 * SER_K - 16} textAnchor="start"
                    fontFamily={F_DISPLAY} fontSize={27} fontWeight={700} letterSpacing={3}
                    fill={rgba(V.volt, 0.95 * clamp01(avgP * 1.5 - 0.4) * chartOut)}>PROMEDIO 228 / DÍA</text>
                </>
              )}
              {/* líneas de guía de las tarjetas a su tick */}
              {markP > 0.02 && (
                <>
                  <line x1={900} y1={418} x2={SER_X0 + PEAK_I * ((SER_X1 - SER_X0) / 17)} y2={Y0 - 290 * SER_K - 8}
                    stroke={rgba(V.volt, 0.7 * markP)} strokeWidth={2.4} strokeDasharray="8 7" />
                  <line x1={1224} y1={534} x2={SER_X0 + LOW_I * ((SER_X1 - SER_X0) / 17)} y2={Y0 - 85 * SER_K - 8}
                    stroke={rgba(V.sky, 0.7 * markP)} strokeWidth={2.4} strokeDasharray="8 7" />
                </>
              )}
              {/* el conector: 309 Wh es EXACTAMENTE la misma altura en las dos columnas */}
              {sameP > 0.01 && (
                <>
                  <line x1={PANEL_X - BAR_W / 2 - 10} y1={Y0 - band309} x2={lerp(PANEL_X, TURB_X + BAR_W / 2 + 10, clamp01(sameP))} y2={Y0 - band309}
                    stroke={rgba(V.white, 0.8 * sameP * chartOut)} strokeWidth={3} strokeDasharray="14 10" />
                  <text x={(PANEL_X + TURB_X) / 2} y={Y0 - band309 - 20} textAnchor="middle"
                    fontFamily={F_DISPLAY} fontSize={31} fontWeight={700} letterSpacing={3}
                    fill={rgba(V.white, 0.94 * clamp01(sameP * 1.5 - 0.4) * chartOut)}>LA MISMA ALTURA: 309 Wh</text>
                </>
              )}
              {/* la resta en vivo: 496 − 187 */}
              {cutP > 0.02 && cutP < 0.99 && (
                <line x1={TURB_X + BAR_W / 2 + 14} y1={ghost.base} x2={TURB_X + BAR_W / 2 + 14 + 220 * cutP} y2={ghost.top - 60 * cutP}
                  stroke={rgba(V.torch, 0.5 * (1 - cutP))} strokeWidth={2.4} strokeDasharray="7 8" />
              )}
            </svg>

            {/* LAS DOS COLUMNAS — mismo eje, misma escala: la desproporción se ve a ojo */}
            <Column f={f} x={PANEL_X} rows={pRows} fill={panelFill} color={V.volt} alpha={1}
              floor={paperOut} bandTo={band309} bandOn={sameP} />
            <Column f={f} x={TURB_X} rows={tRows} fill={turbFill} color={V.amber} alpha={1}
              stormIdx={STORM_I} stormHot={stormHot} floor={paperOut} />

            {/* el segmento de los 187 SE DESPRENDE y se va: la resta se VE, no se cuenta */}
            {cutP > 0.02 && cutP < 0.995 && (
              <div style={{
                position: "absolute", left: TURB_X - BAR_W / 2 + 250 * EZ.push(cutP), top: ghost.top - 74 * EZ.push(cutP),
                width: BAR_W, height: ghost.h, opacity: 1 - cutP,
                transform: `rotate(${(cutP * 13).toFixed(1)}deg)`,
                background: `repeating-linear-gradient(58deg, ${rgba(V.torch, 0.42)} 0px, ${rgba(V.torch, 0.42)} 4px, ${rgba(V.amber, 0.96)} 4px, ${rgba(V.amber, 0.96)} 13px)`,
                boxShadow: `0 0 30px ${rgba(V.torch, 0.5)}`,
              }} />
            )}

            {/* LA TINTA de las dos columnas: los números escritos a mano de Claudio */}
            <InkNumbers x={PANEL_X} rows={pRows} morph={panelMorph} alpha={chartOut * clamp01(grow * 2 - 0.5)} color={INK} />
            <InkNumbers x={TURB_X} rows={tRows} morph={turbMorph} keepIdx={stormHot > 0.15 ? STORM_I : -1}
              alpha={chartOut * clamp01(grow * 2 - 0.5)} color={INK_SOFT} />

            {/* LA SERIE DIARIA */}
            <Series f={f} rev={serRev} alpha={chartOut * clamp01(serRev * 4)} markP={markP} />

            {/* LAS BARRAS DE TIEMPO */}
            <TimeBars f={f} p={timeP * chartOut} />
          </Plane>

          {/* ── PLANO 60 · LAS CIFRAS. Ninguna la dibuja un motor de imagen: las escribe el kit. ── */}
          <Plane z={60}>
            {/* 4.100 Wh — la columna del panel */}
            <Plate x={PANEL_X} y={196} w={470} h={200} c={V.volt}
              a={keyed(f, [s170 + A(0.06), s170 + A(0.08), a4 - A(0.006), a4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]) * chartOut} />
            {f >= s170 + A(0.062) && f < a4 && (
              <Readout value={mil(4100)} unit="Wh" label="PANEL · $52 · 18 DÍAS" at={s170 + A(0.068)}
                x={wx(PANEL_X)} y={wy(196)} size={104} color={V.volt} />
            )}
            {/* 4,1 kWh — el mismo dato plegado en otra unidad */}
            <Plate x={PANEL_X} y={352} w={330} h={124} c={V.volt}
              a={keyed(f, [kwh, kwh + A(0.02), a4 - A(0.006), a4], [0, 1, 1, 0], [EZ.snap, EZ.lin, EZ.soft]) * chartOut} />
            {f >= kwh && f < a4 && (
              <Readout value="4,1" unit="kWh" label="ES DECIR" at={kwh + A(0.008)}
                x={wx(PANEL_X)} y={wy(352)} size={78} color={V.volt} />
            )}
            {/* 496 Wh — la columna de la turbina */}
            <Plate x={TURB_X} y={keyed(f, [t496, a5], [560, 470], EZ.soft)} w={470} h={196} c={V.amber}
              a={keyed(f, [t496 - A(0.008), t496 + A(0.014), cutAt, cutAt + A(0.02)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]) * chartOut} />
            {f >= t496 - A(0.006) && f < cutAt + A(0.02) && (
              <Readout value="496" unit="Wh" label="TURBINA · $54 · 18 DÍAS" at={t496}
                x={wx(TURB_X)} y={wy(keyed(f, [t496, a5], [560, 470], EZ.soft))} size={100} color={V.amber} />
            )}
            {/* 187 Wh — DENTRO de la barra, en el segmento que se ilumina */}
            <Plate x={TURB_X + 372} y={ghost.top - 4} w={392} h={168} c={V.torch}
              a={keyed(f, [n187 - A(0.006), n187 + A(0.016), cutAt + A(0.03), cutAt + A(0.05)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]) * chartOut} />
            {f >= n187 - A(0.004) && f < cutAt + A(0.05) && (
              <Readout value="187" unit="Wh" label="UNA SOLA NOCHE" at={n187 + A(0.004)}
                x={wx(TURB_X + 372)} y={wy(ghost.top - 4)} size={88} color={V.torch} />
            )}
            {/* 309 Wh en 17 días — el resultado de la resta */}
            <Plate x={TURB_X} y={470} w={520} h={198} c={V.amber}
              a={keyed(f, [t309 - A(0.01), t309 + A(0.016), close, close + A(0.016)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]) * chartOut} />
            {f >= t309 - A(0.008) && f < close + A(0.016) && (
              <Readout value="309" unit="Wh" label="SIN ESA NOCHE · 17 DÍAS" at={t309 + A(0.004)}
                x={wx(TURB_X)} y={wy(470)} size={100} color={V.amber} />
            )}
            {/* EL REMATE: ×8 que se corrige a ×13 */}
            <Multiplier p8={p8 * chartOut} p13={p13} />
          </Plane>

          {/* ── PLANO 150 · MATERIAL REAL FLOTANDO (clip o foto adentro, nunca forma + texto) ── */}
          <Plane z={150}>
            {/* ACTO 1 · el gancho: Claudio con el cuaderno */}
            <RealCard f={f} slug={M.claudio} label="EL CUADERNO" mount={A(0.012)} vidLen={130} out={A(0.124)}
              x={252} y={402} w={300} h={188} ry={13} rot={-2} z={40} lit={0.9} litColor={V.torch}
              op={keyed(f, [A(0.012), A(0.03), A(0.1), A(0.124)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ACTO 3 · el día bueno (290) y el día nublado (85), cada uno con su material real */}
            <RealCard f={f} slug={M.diaBueno} label="DÍA DE SOL · 290 Wh" mount={peak - A(0.014)} vidLen={120} out={a4 - A(0.004)}
              x={900} y={300} w={420} h={258} ry={9} z={30} lit={1} litColor={V.volt}
              op={keyed(f, [peak - A(0.014), peak + A(0.006), a4 - A(0.024), a4 - A(0.004)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            <RealCard f={f} slug={M.diaNublado} label="NUBLADO · 85 Wh" mount={valley - A(0.012)} vidLen={0} out={a4 - A(0.004)} photoOnly
              x={1224} y={416} w={380} h={234} ry={-11} rot={2} z={70} lit={0.78} litColor={V.sky}
              op={keyed(f, [valley - A(0.012), valley + A(0.008), a4 - A(0.024), a4 - A(0.004)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ACTO 4 · el mismo patio, los mismos 18 días — se van con el ZOOM-THROUGH */}
            <div style={{
              position: "absolute", inset: 0,
              transform: f >= ztAt ? zt.out : "none",
              opacity: f >= ztAt ? zt.opacity : 1,
            }}>
              {/* ⛔ sale POR EL ZOOM-THROUGH (zt.opacity), no por su propia ventana: si se apagara
                  antes de que la tarjeta de la noche cubra el cuadro, se vería el pop. */}
              <RealCard f={f} slug={M.patio} label="MISMO PATIO · 18 DÍAS" mount={a4 + A(0.008)} vidLen={140} out={a5 + A(0.026)}
                x={640} y={318} w={430} h={262} ry={12} z={20} lit={0.94} litColor={V.amber}
                op={keyed(f, [a4 + A(0.008), a4 + A(0.028), a5 + A(0.02), a5 + A(0.026)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            </div>

            {/* ACTO 5 · la turbina embalada esa noche, clavada al segmento de los 187 */}
            <RealCard f={f} slug={M.temporal} label="LA NOCHE DEL TEMPORAL" mount={n187 + A(0.008)} vidLen={0} out={cutAt + A(0.05)} photoOnly
              x={TURB_X + 372} y={ghost.top + 214} w={288} h={176} ry={-9} z={90} lit={1} litColor={V.torch}
              op={keyed(f, [n187 + A(0.008), n187 + A(0.026), cutAt + A(0.03), cutAt + A(0.05)], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ACTO 6 · Claudio cierra el cuaderno */}
            <RealCard f={f} slug={M.cierre} label="LO ANOTÉ TODO" mount={close - A(0.052)} vidLen={120} out={D}
              x={1560} y={266} w={520} h={318} ry={-13} z={60} lit={1} litColor={V.amber}
              op={keyed(f, [close - A(0.052), close - A(0.03), D - A(0.03), D - A(0.006)], [0, 1, 1, 0.34], [EZ.push, EZ.lin, EZ.soft])} />

            {/* íconos del kit como objetos chicos de la escena (nunca reemplazan al objeto real) */}
            {f > s170 + A(0.03) && f < a4 && (
              <IconPng src={IC("panel")} x={wx(PANEL_X)} y={wy(64)} size={96} z={20}
                opacity={keyed(f, [s170 + A(0.03), s170 + A(0.06), a4 - A(0.02), a4], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.volt} />
            )}
            {f > peak - A(0.006) && f < a4 && (
              <IconPng src={IC("sol")} x={wx(1108)} y={wy(212)} size={82} z={40} rot={-6}
                opacity={markP * 0.95} glow={V.volt} />
            )}
            {f > valley - A(0.004) && f < a4 && (
              <IconPng src={IC("nube")} x={wx(1400)} y={wy(342)} size={84} z={60} rot={5}
                opacity={markP * 0.9} glow={V.sky} />
            )}
            {f > a4 + A(0.004) && f < a5 && (
              <IconPng src={IC("turbina")} x={wx(TURB_X)} y={wy(628)} size={92} z={20}
                opacity={keyed(f, [a4 + A(0.004), a4 + A(0.03), a5 - A(0.02), a5], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])} glow={V.amber} />
            )}
            {f > n187 - A(0.006) && f < cutAt + A(0.04) && (
              <IconPng src={IC("tormenta")} x={wx(TURB_X + 372)} y={wy(ghost.top - 178)} size={88} z={80}
                opacity={stormHot * 0.98} glow={V.torch} />
            )}
            {f > times && f < D && (
              <IconPng src={IC("calendario")} x={wx(268)} y={wy(T_Y1 - 26)} size={86} z={30}
                opacity={timeP * 0.9 * chartOut} glow={V.amber} />
            )}
          </Plane>

          {/* ── PLANO 320 · primer plano: polvo del taller, siempre vivo ── */}
          <Plane z={320}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {Array.from({ length: 14 }, (_, i) => {
                const a = rnd(i * 2.19), b = rnd(i * 5.07);
                const px = a * 108 - 4 + Math.sin(f / (58 + b * 74) + i) * 2.4;
                const py = ((b * 1300 - f * (0.18 + a * 0.42)) % 1300 + 1300) % 1300;
                const dm = 2 + b * 5;
                return <div key={i} style={{
                  position: "absolute", left: `${px.toFixed(2)}%`, top: 1250 - py, width: dm, height: dm, borderRadius: "50%",
                  background: rgba(lum, 0.5), opacity: 0.16 + a * 0.4,
                }} />;
              })}
            </div>
          </Plane>
        </AbsoluteFill>
      </Layers>

      {/* ══ EL VIENTO — la firma del video. Acá se calma: estamos adentro, en la mesa. ══════ */}
      <WindField speed={wind} tint={lum} count={18} opacity={0.72} />

      {/* ══ FRONTERA D · ZOOM-THROUGH: atravesamos la noche del temporal ═══════════════════ */}
      {zActive && (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", perspective: "1500px", transformStyle: "preserve-3d" }}>
          <AbsoluteFill style={{
            transform: `scale(${lerp(1, 9.4, EZ.expo(zin)).toFixed(3)})`,
            transformOrigin: "70% 36%", transformStyle: "preserve-3d",
            opacity: 1 - zout,
          }}>
            <Sequence from={a5 - A(0.021)} durationInFrames={Math.max(2, A(0.05))} layout="none">
              <MediaCard src={VID(M.noche)} kind="video" w={470} h={292} x={70} y={36} z={0}
                radius={12} lit={1} litColor={V.torch} label="LA NOCHE DEL TEMPORAL" sheenAt={10} />
            </Sequence>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ══ FRONTERA C · OCLUSIÓN: Claudio pasa la hoja. ⛔ el color es el del PAPEL. ═══════ */}
      <SeamOcclude at={a4 - A(0.01)} dur={A(0.021)} color={PAPER_D} angle={7} />

      {/* ══ FRONTERA E · CORTE EN EL BEAT: "diecisiete días" ══════════════════════════════ */}
      <SeamFlash at={a6} color={V.amber} dur={6} />
      {/* relámpago diegético de la noche del temporal (no es una costura: es la tormenta) */}
      <SeamFlash at={n187 + A(0.004)} color={V.torch} dur={5} />

      {/* ══ FRONTERA F · WIPE POR MATERIA: el papel se va y deja las columnas de pie ═══════ */}
      <SeamWipeMatter at={close + A(0.004)} dur={A(0.03)} tint={PAPER} />

      {/* ══ TIPOGRAFÍA — 1 idea por acto, titular ≤7 palabras, cama oscura obligatoria ═════ */}
      {T1.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T1.dy).toFixed(1)}px)`, opacity: T1.op }}>
          <Bed pad={28} w={880}>
            <Kick color={V.torch}>18 DÍAS · DÍA POR DÍA</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>CON LA <Em color={V.torch}>LETRA FEA</Em> DE SIEMPRE</Head>
          </Bed>
        </div>
      )}
      {T2.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T2.dy).toFixed(1)}px)`, opacity: T2.op }}>
          <Bed pad={28} w={840}>
            <Kick>PANEL SOLAR · $52</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>NO FALLÓ <Em>UN SOLO DÍA</Em></Head>
          </Bed>
        </div>
      )}
      {T3.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T3.dy).toFixed(1)}px)`, opacity: T3.op }}>
          <Bed pad={28} w={860}>
            <Kick>PICO 290 · NUBLADO 85</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>EL PROMEDIO: <Em>228 POR DÍA</Em></Head>
          </Bed>
        </div>
      )}
      {T4.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T4.dy).toFixed(1)}px)`, opacity: T4.op }}>
          <Bed pad={28} w={900}>
            <Kick color={V.amber}>TURBINA · $54 · MISMO PATIO</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>LOS MISMOS 18 DÍAS: <Em color={V.amber}>496</Em></Head>
          </Bed>
        </div>
      )}
      {T5.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T5.dy).toFixed(1)}px)`, opacity: T5.op }}>
          <Bed pad={28} w={940}>
            <Kick color={V.torch}>Y DE ESOS 496…</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>
              {f < cutAt ? <> <Em color={V.torch}>187</Em> SON DE UNA NOCHE</> : <>SIN ESA NOCHE: <Em color={V.amber}>309</Em></>}
            </Head>
          </Bed>
        </div>
      )}
      {T6.on && (
        <div style={{ position: "absolute", left: 92, bottom: 104, transform: `translate(${paraX.toFixed(1)}px, ${(paraY + T6.dy).toFixed(1)}px)`, opacity: T6.op }}>
          <Bed pad={28} w={980}>
            <Kick color={V.amber}>17 DÍAS CONTRA UN DÍA DE SOL</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>
              {f < x13 ? <>LO QUE EL PANEL HACE <Em>EN UNO</Em></> : <>Y ESO ES LO QUE <Em color={V.amber}>SE PAGA</Em></>}
            </Head>
          </Bed>
        </div>
      )}

      {/* ══ viñeta viva: el plano no se cierra, sigue respirando hasta el corte ═══════════ */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.22 + 0.05 * Math.sin(f / 91)).toFixed(3)}) 100%)`,
      }} />
      {/* aberración cromática sutil en los dos picos de energía (nunca un blur full-screen) */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [n187 - 8, n187 + 18, cutAt, a6 - 6, a6 + 24], [0, 0.12, 0.1, 0.14, 0], [EZ.push, EZ.lin, EZ.lin, EZ.soft]),
        background: `linear-gradient(94deg, ${rgba(V.amber, 0.2)} 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, ${rgba(V.volt, 0.14)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
