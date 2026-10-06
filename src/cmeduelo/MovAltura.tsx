// MovAltura.tsx — MOVIMIENTO 3 de `cmeduelo` · "LA ALTURA" (s123-s136)
// Canal Claudio Mendoza Constructor · ES. UN PLANO SECUENCIA de ~45 s (D ≈ 1350 f @ 30 fps) que
// tolera el re-anclaje al Whisper: TODOS los tiempos son FRACCIONES de `durationInFrames`, así que
// si el audio real da 60-65 s (lo que avisa el brief) el movimiento se estira sin romperse.
//
// LA IDEA: Claudio podría dejar la turbina abajo, mostrar 3 vatios y gritar "fraude" — que es lo que
// hace el resto de internet cuando quiere que odies algo. Hace lo contrario: le da a la turbina LA
// MEJOR OPORTUNIDAD QUE PUEDE SIN GASTAR UN DÓLAR. Caño prestado, tres tensores, de 2 m a 6 m.
// El viento se multiplica por menos de DOS; la energía, por CUATRO Y MEDIO. Y aun así, 41 Wh siguen
// siendo la SEXTA PARTE de los 270 que el panel hizo ese mismo día, quieto, apoyado como un cuadro.
//
// ══ LA COLUMNA VERTEBRAL: EL EJE VERTICAL ═══════════════════════════════════════════════════════
// Todo vive en un MUNDO con una escala de metros real: `MY(m) = GROUND - m * MPX` (1 m = 250 px de
// mundo). La cámara SUBE por ese eje y NUNCA vuelve a bajar: `focusM` es monótono creciente
// (2.0 → 5.6 m). Cuando el guion tiene que volver a hablar del suelo (el pozo de aire quieto, el
// panel apoyado en la pared) la cámara **no desciende: se ABRE** (`net` baja de 1.10 a 0.44), y el
// suelo vuelve a entrar por abajo del cuadro. Es la regla dura del tramo y la respeta del frame 0 al D.
// Las cuatro lecturas quedan CLAVADAS a su altura en ese eje, no flotando:
//     · 2 m (el poste viejo) → 1,9 m/s · 9 Wh   · 6 m (el caño prestado) → 3,4 m/s · 41 Wh
// y en el remate entra un quinto valor, 270 Wh, ANCLADO AL SUELO, que no subió nunca porque no lo
// necesitó. El eje se lee de un vistazo: lo que costó cuatro metros contra lo que no costó nada.
//
// EL VIENTO ES CONTENIDO, no decorado: hay DOS bandas de `WindField` dentro del mundo, recortadas por
// altura. Abajo (0-2,6 m, pegado a la casa) speed ~.08: casi no hay estrías = el POZO DE AIRE QUIETO.
// Arriba (>3,2 m) speed .30 → .85. El espectador VE el pozo antes de que nadie se lo nombre.
//
// ══ TABLA DE HANDOFF ════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA DE MovTabla: cam {z0 40, panY −120 heredado, mirando hacia ARRIBA} · luz {VOLT puro sobre
//    papel} · viento {.20} · materia {EL CAÑO VERTICAL que asomaba en el casillero "altura de montaje"}
//
// ACTO 1 · f 0.000D → 0.165D · "EL MONTAJE"           protagonista: EL CAÑO + LOS TENSORES (clip real)
//   enterFrom cam {z 40 · focusM 2.0 · net 1.10} luz {volt, key .22} viento {.20} materia {el caño}
//   material  {CLIP `cmed_h_709_caminaConAlambre` + foto `cmed_o_711_tensoresListos` · fondo a sangre
//              `cmed_o_703_circulaFila` = LA HOJA con la que MovTabla entrega (el papel sigue ahí)}
//   el caño CRECE de 2 m a 6,35 m en cámara; los tres tensores se dibujan hacia las esquinas del patio
//   exitTo    cam {z ≈ 62 · focusM 2.4 · net .95} luz {volt, key .28} viento {.24} materia {el caño parado}
//   ── FRONTERA 1 @ 0.159D ····· OCLUSIÓN (`PipeOcclude`) ·······································
//      El caño galvanizado pasa PEGADO A LA LENTE y tapa el 100% ~6 frames. ⛔ el color es EL ACERO
//      (#383C37→#B4B9B4→#383C37), la materia que cruza — jamás el negro del fondo. Cae en "Nada más."
//
// ACTO 2 · f 0.165D → 0.304D · "LA SUBIDA"            protagonista: LA TARJETA ALTA (clip del patio)
//   enterFrom cam {z ≈ 62 · focusM 2.4 · net .95} luz {volt, key .30} viento {.26} materia {el caño parado}
//   material  {FOTO `cmed_h_721_caminaAlPatio` = la tarjeta de 6 M (su mp4 lo rechazó el auditor) ·
//              foto `cmed_o_705_turbinaBaja` = la tarjeta de 2 M}
//   el marcador del eje trepa de 2 m a 6 m con la cámara; nace la banda de CIELO arriba de 5 m
//   exitTo    cam {z ≈ 108 · focusM 4.2 · net .66} luz {volt→ámbar 18%} viento {.34} materia {las 2 tarjetas}
//   ── FRONTERA 2 @ 0.304D ····· MATCH-MOVE ····················································
//      Es la costura NATURAL del movimiento vertical: la cámara ya viene trepando y el anemómetro
//      entra ARRASTRADO por ese vector mientras las dos tarjetas quedan clavadas a su altura. Cero
//      overlay, cero fade: cambia el contenido detrás de un paneo que nunca frenó.
//
// ACTO 3 · f 0.304D → 0.456D · "LAS DOS LECTURAS"     protagonista: EL ANEMÓMETRO (foto real)
//   enterFrom cam {z ≈ 108 · focusM 4.2 · net .66} luz {volt→ámbar 18%} viento {.34} materia {2 tarjetas}
//   material  {foto `cmed_o_713_tablaYAnemometro` (hero) · foto `cmed_o_718_dedoEnPagina` en el beat del
//              1,9 de ABAJO · foto `cmed_h_712_frenaSegundo` en el respiro · ícono `cmed_ic_anemometro`}
//   0.318D → salta 3,4 m/s ARRIBA · 0.360D → salta 1,9 m/s ABAJO · 0.408D → el "× menos de 2", de paso
//   0.444D "¿Y la energía?" → foto `cmed_h_712_frenaSegundo`: el respiro antes del golpe
//   exitTo    cam {z ≈ 150 · focusM 4.2 · net .63} luz {ámbar 30%} viento {.40} materia {las 2 cifras de viento}
//   ── FRONTERA 3 @ 0.456D ····· CORTE EN EL BEAT (`SeamFlash` volt, 7 f) ·······················
//      Corte seco EXACTO en "La energía del día pasó de…". Encuadre y escala calzan (misma cámara,
//      mismo eje): sólo cambia lo que hay clavado en él. Es el único corte duro del movimiento.
//
// ACTO 4 · f 0.456D → 0.581D · "EL SALTO ×4,5"        protagonista: EL CUADERNO DE ALTURAS (foto real)
//   enterFrom cam {z ≈ 150 · focusM 4.2 · net .63} luz {ámbar 30%} viento {.40} materia {cifras de viento}
//   material  {foto `cmed_h_701_cuadernoAltura` · CLIP `cmed_h_715_cajaWorkbench` en "sin comprar nada"}
//   0.462D → 41 Wh ARRIBA · 0.486D → 9 Wh ABAJO (el eje queda con sus CUATRO números)
//   0.519D → el ×4,5 grande: el número que Claudio SÍ quiere que se quede grabado
//   exitTo    cam {z ≈ 178 · focusM 4.4 · net .46} luz {ámbar 52%} viento {.46} materia {el eje completo}
//   ── FRONTERA 4 @ 0.567D ····· WIPE POR MATERIA (`SeamWipeMatter`, tinte `V.concrete`) ·········
//      El polvo del patio cruza el cuadro y detrás ya está la pared de la casa a pantalla completa.
//      Materia de verdad (hormigón/tierra del patio), no una transición.
//
// ACTO 5 · f 0.581D → 0.740D · "EL POZO DE AIRE QUIETO" protagonista: LA PARED DE LA CASA (plano real)
//   enterFrom cam {z ≈ 178 · focusM 4.4 · net .46} luz {ámbar 52%} viento {.46} materia {el eje completo}
//   material  {PhotoPlane `cmed_h_716_hablaCasa` a sangre · FOTO `cmed_h_704_sonrieAnticipa` = Ernesto,
//              montado UNA sola vez: es la misma tarjeta que la frontera 5 atraviesa}
//   la cámara NO baja: se ABRE, y el suelo vuelve a entrar por abajo. Se enciende la ZONA MUERTA
//   pegada a la casa (0-2 m) donde las estrías de viento se apagan: el pozo se VE, no se rotula.
//   0.679D → Ernesto contento mirando arriba (cree que ganó la apuesta): el respiro humano
//   exitTo    cam {z ≈ 206 · focusM 4.6 · net .44} luz {ámbar 74%} viento {.50} materia {la cara de Ernesto}
//   ── FRONTERA 5 @ 0.722D ····· ZOOM-THROUGH (`zoomThrough`) ···································
//      La cámara ATRAVIESA la tarjeta de Ernesto (crece a 7,5× y se va del otro lado) y sale en el
//      plano general del garaje. Es el gesto físico de "y yo tuve que decirle la verdad".
//
// ACTO 6 · f 0.740D → 1.000D · "LA PARTE FEA"          protagonista: EL PANEL APOYADO (foto real, QUIETO)
//   enterFrom cam {z ≈ 206 · focusM 4.6 · net .44} luz {ámbar 74%} viento {.50} materia {el garaje}
//   material  {foto `cmed_o_720_equipoCompleto` colgada COMO UN CUADRO en espacio de pantalla (no se
//              mueve con el mundo: es lo único quieto del movimiento) · foto `cmed_h_708_gestoDesaprueba`
//              · foto `cmed_o_714_guiaDosPaginas` en el beat de la llave del 1/6. El fondo NO corta en la
//              frontera 5: sigue siendo `cmed_h_716_hablaCasa` — es la pared contra la que el panel se apoya}
//   0.762D → el gauge de energía: 9 · 41 · y el 270 ÁMBAR que sube desde el suelo y los aplasta
//   0.840D → la llave del 1/6. El 270 nunca subió un centímetro porque no lo necesitó.
//   0.880D → la cámara EMPUJA (net .44 → .62, focusM 4.6 → 5.6) y aterriza en LA TURBINA ARRIBA,
//            EN SILUETA CONTRA EL CIELO (`cmed_ic_turbina` a brightness 0 sobre la banda de cielo).
//   exitTo ⟶ cam {z1 240 · panY −260 · ry +8 · focusM 5.6 · net .62} · luz {VOLT→ÁMBAR pleno, cae la
//            tarde} · viento {.55} · materia {LA SILUETA DE LA TURBINA CONTRA EL CIELO}
// ⟶ ENTREGA A MovNoche: arranca EN ESA MISMA SILUETA, ya de noche.
//
// ⛔ cero Math.random/Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade en
//    las fronteras · Easing.quint NO EXISTE (acá se usa Easing.poly(5)).
// ⛔ RUTAS: sólo nombres de `_v3/material_MovAltura.txt` + los íconos `cmed_ic_*` del HANDOFF, todas
//    LITERALES (ver la nota de abajo). ⛔ NINGÚN plano se usa más de una vez en pantalla.
// ⛔ QC DE MOVIMIENTO — POR QUÉ SOLO DOS DE LOS CUATRO MP4 SE USAN (no lo "arregles"):
//    El auditor de movimiento pasó DOS veces sobre los clips de este tramo (deriva de fondo /
//    identidad). Resultado firme:
//      ✓ CLIP  `cmed_h_709_caminaConAlambre`  nunca fue marcado — y es el protagonista del acto 1,
//                                              justo el único beat del tramo que pide acción física.
//      ✓ CLIP  `cmed_h_715_cajaWorkbench`     pasó la reparación limpio.
//      ✗ FOTO  `cmed_h_704_sonrieAnticipa`    sev 10: la escena CORTA del garaje al exterior.
//      ✗ FOTO  `cmed_h_721_caminaAlPatio`     sev  9: se reinventa la estructura del garaje.
//    Los dos rechazados SIGUEN EN DISCO (no hay riesgo de 404), pero un fondo que se reinventa
//    adentro de una tarjeta flotante se ve muchísimo, y la deriva está desde el primer segundo:
//    no se arregla recortando. Van con su FOTO, que es EL PRIMER FRAME del clip — mismo encuadre,
//    misma luz, misma posición en el eje de metros; sólo se pierde el micro-gesto.
//    REPARTO FINAL: 2 clips que corren (709, 715) + 15 planos fijos. Los 17, distintos.
import React from "react";
import {
  AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame,
} from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Em, Num, Bed,
} from "./VoltStage";

/* ⛔ TODAS LAS RUTAS DE ESTE ARCHIVO SON STRINGS LITERALES, A PROPÓSITO: el escáner de "material
   hardcodeado" del build NO VE los template literals, y un MP4 que no entra al tarball es un 404 que
   mata el chunk entero del farm (la mina que costó los 60 chunks de `mdring`). Por eso `LiveCard`
   recibe `video` y `photo` completos en vez de armarlos con un slug. Cada asset aparece a lo sumo
   DOS veces y, cuando aparece dos, es el par obligatorio mp4 + su foto gemela del mismo plano
   (el swap anti-congelado), nunca el mismo plano repetido en pantalla. */

/* ── EASINGS (nunca uno solo para todo) ──────────────────────────────────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO (las keys son frames absolutos ya escalados por D) */
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

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   EL MUNDO — la escala de metros. Acá los vectores SÍ son legítimos: una regla ES una regla,
   un tensor ES una línea, una barra de vatios-hora ES un gráfico. El material real va SIEMPRE
   adentro de vidrio (`MediaCard`), nunca dibujado.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const GROUND = 1180;                                   // world Y del suelo del patio (0 m)
const MPX = 250;                                       // px de mundo por metro
const MY = (m: number) => GROUND - m * MPX;            // metros → world Y
const AX = 300;                                        // world X del eje / del caño
const CARD_X = 1080;                                   // world X de las tarjetas de material
const READ_X = 1600;                                   // world X de las lecturas ancladas
const yp = (wy: number) => (wy / 1080) * 100;          // world Y → % del box de 1080
const xp = (wx: number) => (wx / 1920) * 100;          // world X → % del box de 1920

/* ── LA REGLA DE METROS + EL MARCADOR QUE TREPA ──────────────────────────────────────────────── */
const AxisRuler: React.FC<{
  f: number; grow: number; marker: number; markOn: number; tint: string;
}> = ({ f, grow, marker, markOn, tint }) => {
  const topM = 7;
  const drawn = lerp(GROUND, MY(topM), clamp01(grow));
  const breathe = 1 + Math.sin(f / 83) * 0.003;        // hold VIVO: el eje nunca queda congelado
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(960 540) scale(${breathe.toFixed(4)}) translate(-960 -540)`}>
        {/* la losa del patio: la línea de suelo de la que nace todo */}
        <line x1={-620} y1={GROUND} x2={2540} y2={GROUND} stroke={rgba(V.concrete, 0.5)} strokeWidth={5} />
        <line x1={-620} y1={GROUND + 13} x2={2540} y2={GROUND + 13} stroke={rgba(V.ink0, 0.75)} strokeWidth={22} />
        {/* el eje vertical */}
        <line x1={AX - 178} y1={GROUND} x2={AX - 178} y2={drawn} stroke={rgba(V.white, 0.3)} strokeWidth={3} />
        {/* ticks de metro: 2 M y 6 M son las dos alturas del experimento */}
        {Array.from({ length: topM + 1 }, (_, m) => {
          const on = clamp01((GROUND - drawn) / MPX - m + 0.35);
          if (on <= 0) return null;
          const key2 = m === 2 || m === 6;
          const len = key2 ? 116 : 52;
          return (
            <g key={m} opacity={on}>
              <line x1={AX - 178} y1={MY(m)} x2={AX - 178 + len} y2={MY(m)}
                stroke={key2 ? rgba(tint, 0.85) : rgba(V.white, 0.22)} strokeWidth={key2 ? 5 : 2.5} />
              <text x={AX - 196} y={MY(m) + 13} textAnchor="end"
                fontFamily={F_DISPLAY} fontWeight={key2 ? 800 : 700}
                fontSize={key2 ? 46 : 28} letterSpacing={1.6}
                fill={key2 ? tint : rgba(V.white, 0.38)}>
                {`${m} M`}
              </text>
            </g>
          );
        })}
        {/* EL MARCADOR: trepa de 2 m a 6 m. Es la punta de flecha del movimiento entero. */}
        {markOn > 0.01 && (
          <g opacity={clamp01(markOn)}>
            <line x1={AX - 214} y1={MY(marker)} x2={CARD_X + 250} y2={MY(marker)}
              stroke={rgba(tint, 0.3)} strokeWidth={2.5} strokeDasharray="16 14" />
            <polygon
              points={`${AX - 214},${MY(marker)} ${AX - 262},${MY(marker) - 21} ${AX - 262},${MY(marker) + 21}`}
              fill={tint} opacity={0.95} />
          </g>
        )}
      </g>
    </svg>
  );
};

/* ── EL CAÑO PRESTADO + LOS TRES TENSORES + EL POSTE VIEJO DE 2 M ────────────────────────────── */
const PipeRig: React.FC<{ f: number; topM: number; tension: number; tint: string }> = ({ f, topM, tension, tint }) => {
  const top = MY(topM);
  const sway = Math.sin(f / 57) * (2.4 + topM * 0.9);   // el caño largo VIBRA: cuanto más alto, más
  const anchors: [number, number][] = [[AX - 720, GROUND + 8], [AX + 880, GROUND + 22], [AX + 300, GROUND - 6]];
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="mvalt_steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#33372F" />
          <stop offset="22%" stopColor="#797E74" />
          <stop offset="46%" stopColor="#B7BBB0" />
          <stop offset="68%" stopColor="#767B71" />
          <stop offset="100%" stopColor="#2C302A" />
        </linearGradient>
        <linearGradient id="mvalt_old" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22251F" />
          <stop offset="50%" stopColor="#5A5E54" />
          <stop offset="100%" stopColor="#1D201B" />
        </linearGradient>
      </defs>
      {/* el poste viejo de 2 m: sigue ahí, apagado, para que el ojo tenga con qué comparar */}
      <rect x={AX + 236} y={MY(2)} width={17} height={GROUND - MY(2)} fill="url(#mvalt_old)" opacity={0.85} />
      {/* los tres tensores de alambre a las esquinas del patio */}
      {anchors.map(([axx, ayy], i) => {
        const on = clamp01(tension * 3.2 - i * 0.85);
        if (on <= 0) return null;
        const hx = AX + 14 + sway;
        const hy = top + 78;
        return (
          <g key={i} opacity={on}>
            <line x1={hx} y1={hy} x2={lerp(hx, axx, on)} y2={lerp(hy, ayy, on)}
              stroke={rgba(V.bone, 0.34)} strokeWidth={3} />
            <line x1={hx} y1={hy} x2={lerp(hx, axx, on)} y2={lerp(hy, ayy, on)}
              stroke={rgba(V.white, 0.16)} strokeWidth={1} />
            {on > 0.94 && <circle cx={axx} cy={ayy} r={10} fill={rgba(tint, 0.7)} />}
          </g>
        );
      })}
      {/* EL CAÑO DE RIEGO: la materia que cruza TODO el movimiento */}
      <g transform={`translate(${sway.toFixed(2)} 0)`}>
        <rect x={AX} y={top} width={30} height={GROUND - top} fill="url(#mvalt_steel)" />
        <rect x={AX + 4} y={top} width={5} height={GROUND - top} fill={rgba(V.white, 0.2)} />
        {/* las abrazaderas: detalle de producto, no adorno */}
        {[0.24, 0.52, 0.79].map((k, i) => (
          <rect key={i} x={AX - 7} y={lerp(GROUND, top, k)} width={44} height={15}
            fill={rgba(V.concrete, 0.9)} rx={3} />
        ))}
        {/* la base atornillada a la losa */}
        <rect x={AX - 30} y={GROUND - 20} width={90} height={22} fill={rgba(V.concrete, 0.72)} rx={4} />
      </g>
    </svg>
  );
};

/* ── LA BANDA DE CIELO: por encima de los 5 m el fondo se abre y la turbina queda EN SILUETA ──── */
const SkyBand: React.FC<{ on: number; warm: number }> = ({ on, warm }) => (
  <div style={{
    position: "absolute", left: "-40%", width: "180%",
    top: `${yp(MY(9.2))}%`, height: `${((MY(3.4) - MY(9.2)) / 1080) * 100}%`,
    opacity: clamp01(on), pointerEvents: "none",
    background:
      `linear-gradient(180deg, ${rgba(V.amber, 0.05 + warm * 0.13)} 0%, ` +
      `${rgba(V.sky, 0.17 - warm * 0.04)} 30%, ${rgba(V.sky, 0.09)} 64%, rgba(0,0,0,0) 100%)`,
  }} />
);

/* ── EL POZO DE AIRE QUIETO: la zona muerta pegada a la casa, de 0 a 2,35 m ──────────────────── */
const DeadZone: React.FC<{ f: number; on: number }> = ({ f, on }) => {
  if (on <= 0.01) return null;
  const pulse = 0.9 + Math.sin(f / 61) * 0.09;
  return (
    <div style={{
      position: "absolute",
      left: `${xp(1010)}%`, width: `${xp(1180)}%`,
      top: `${yp(MY(2.35))}%`, height: `${((GROUND + 60 - MY(2.35)) / 1080) * 100}%`,
      opacity: clamp01(on) * pulse, pointerEvents: "none",
      background:
        `radial-gradient(88% 96% at 74% 86%, ${rgba("#5C6A70", 0.4)} 0%, ${rgba("#3E4A50", 0.24)} 46%, rgba(0,0,0,0) 78%)`,
      borderTop: `2px dashed ${rgba(V.sky, 0.42)}`,
    }} />
  );
};

/* ── BANDA DE VIENTO RECORTADA POR ALTURA: el pozo se VE, no se rotula ──────────────────────── */
const WindBand: React.FC<{
  mTop: number; mBot: number; speed: number; count: number; opacity: number; tint: string;
}> = ({ mTop, mBot, speed, count, opacity, tint }) => (
  <div style={{
    position: "absolute", left: "-45%", width: "190%",
    top: `${yp(MY(mTop))}%`, height: `${((MY(mBot) - MY(mTop)) / 1080) * 100}%`,
    overflow: "hidden", pointerEvents: "none",
  }}>
    <WindField speed={speed} count={count} opacity={opacity} tint={tint} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA 1 · OCLUSIÓN — EL CAÑO GALVANIZADO PASA PEGADO A LA LENTE.
   ⛔ el color es EL ACERO (la materia que cruza), NUNCA el negro del fondo: con el color del fondo
   esto sería un fundido a negro de 6 frames que se ve como un pozo.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const PipeOcclude: React.FC<{ f: number; at: number; dur: number }> = ({ f, at, dur }) => {
  const p = clamp01((f - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-192, 192, p);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-32%", height: "164%",
        left: `${x.toFixed(2)}%`, width: "232%",
        transform: `rotate(${lerp(-5.2, -2.4, p).toFixed(2)}deg)`,
        background:
          "linear-gradient(90deg, rgba(0,0,0,0) 0%, #383C37 5%, #6E736E 15%, #B4B9B4 31%, " +
          "#8C918C 48%, #61665F 66%, #383C37 90%, rgba(0,0,0,0) 100%)",
        boxShadow: "0 0 110px rgba(0,0,0,0.55)",
      }}>
        {/* las abrazaderas pasando: la oclusión es UN OBJETO, no una banda de color */}
        {[24, 52, 78].map((k) => (
          <div key={k} style={{
            position: "absolute", left: 0, right: 0, top: `${k}%`, height: 26,
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(20,22,20,0.6) 30%, rgba(200,205,200,0.28) 50%, rgba(20,22,20,0.6) 70%, rgba(0,0,0,0) 100%)",
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   ACTO 6 · EL GAUGE DE ENERGÍA — 9 · 41 · 270 Wh. El 270 sube DESDE EL SUELO y los aplasta a los
   dos: nunca necesitó un centímetro de altura. La llave del "1/6" es el remate del movimiento.
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
const GX = 470, GW = 74, GGAP = 96;
const WH_PX = 3.55;                                     // px de mundo por vatio-hora
const EnergyGauge: React.FC<{ f: number; g9: number; g41: number; g270: number; sixth: number }> = ({
  f, g9, g41, g270, sixth,
}) => {
  const bars: { v: number; on: number; c: string; lab: string; big: boolean }[] = [
    { v: 9, on: g9, c: rgba(V.voltSoft, 0.9), lab: "9", big: false },
    { v: 41, on: g41, c: V.volt, lab: "41", big: false },
    { v: 270, on: g270, c: V.amber, lab: "270", big: true },
  ];
  const tip270 = GROUND - 270 * WH_PX * clamp01(g270);
  const tip41 = GROUND - 41 * WH_PX * clamp01(g41);
  const bx = GX + 2 * GGAP + GW;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      {bars.map((b, i) => {
        if (b.on <= 0.01) return null;
        const wob = 1 + Math.sin(f / 47 + i * 2.1) * 0.004;
        const h = b.v * WH_PX * clamp01(b.on) * wob;
        const x = GX + i * GGAP;
        return (
          <g key={i}>
            <rect x={x} y={GROUND - h} width={GW} height={h} fill={rgba(b.c, 0.22)} />
            <rect x={x} y={GROUND - h} width={GW} height={Math.min(h, 9)} fill={b.c} />
            <rect x={x} y={GROUND - h} width={4} height={h} fill={rgba(b.c, 0.75)} />
            <text x={x + GW / 2} y={GROUND - h - 26} textAnchor="middle"
              fontFamily={F_DISPLAY} fontWeight={800} fontSize={b.big ? 62 : 44}
              fill={b.c} opacity={clamp01(b.on * 2 - 1)}>{b.lab}</text>
          </g>
        );
      })}
      <text x={GX - 26} y={GROUND + 52} textAnchor="start"
        fontFamily={F_DISPLAY} fontWeight={700} fontSize={28} letterSpacing={3}
        fill={rgba(V.white, 0.5)} opacity={clamp01(g9 * 2)}>WH POR DÍA</text>
      {/* LA LLAVE DEL 1/6 — 41 no llega ni a la sexta parte de 270 */}
      {sixth > 0.01 && (
        <g opacity={clamp01(sixth)}>
          <line x1={GX + GGAP + GW + 16} y1={tip41} x2={bx + 92} y2={tip41}
            stroke={rgba(V.danger, 0.7)} strokeWidth={3} strokeDasharray="12 10" />
          <line x1={bx + 92} y1={tip270} x2={bx + 40} y2={tip270}
            stroke={rgba(V.danger, 0.7)} strokeWidth={3} strokeDasharray="12 10" />
          <line x1={bx + 92} y1={tip270} x2={bx + 92} y2={tip41}
            stroke={rgba(V.danger, 0.8)} strokeWidth={4} />
          <text x={bx + 118} y={(tip270 + tip41) / 2 + 20}
            fontFamily={F_DISPLAY} fontWeight={800} fontSize={72} fill={V.danger}>1/6</text>
        </g>
      )}
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   TARJETA CON MATERIAL REAL QUE NO SE CONGELA: corre el CLIP y después pasa a la MISMA FOTO bajo
   un barrido especular. (Los 4 clips del tramo tienen su foto gemela en el material.)
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
/* ⛔ TECHO DE CLIP (medido con ffprobe sobre los 4 mp4 del tramo): 24 fps x 121 frames = 5,0417 s.
   A los 30 fps de la comp eso son 151 frames; pasado ese punto OffthreadVideo CONGELA el ultimo
   frame sin tirar error. VID = 145 deja 6 frames de margen y usa casi todo el clip.
   Es una constante FIJA a proposito, NO una fraccion de D: si el anclaje al Whisper estira el
   movimiento, el clip corre igual sus 145 frames y despues la tarjeta pasa a su foto gemela, asi
   que el techo se respeta para cualquier duracion. */
const VID = 145;
const LiveCard: React.FC<{
  f: number; video: string; photo: string; label?: string; mount: number; out: number;
  x: number; y: number; z?: number; w: number; h: number; ry?: number; rot?: number;
  lit?: number; litColor?: string; op: number; radius?: number;
}> = ({ f, video, photo, label, mount, out, x, y, z = 0, w, h, ry = 0, rot = 0, lit = 1, litColor = V.volt, op, radius = 12 }) => {
  if (f < mount || f >= out || op <= 0.004) return null;
  const swap = mount + VID;
  const common = { w, h, x, y, z, ry, rot, label, lit, litColor, opacity: op, radius };
  return f < swap ? (
    <Sequence from={mount} durationInFrames={VID} layout="none">
      <MediaCard src={video} kind="video" {...common} sheenAt={14} />
    </Sequence>
  ) : (
    <Sequence from={swap} durationInFrames={Math.max(2, out - swap)} layout="none">
      <MediaCard src={photo} kind="photo" {...common} sheenAt={0} />
    </Sequence>
  );
};

/* ── LA SILUETA DE LA TURBINA CONTRA EL CIELO — lo que se le entrega a MovNoche ──────────────── */
const TurbineSil: React.FC<{ f: number; on: number; x: number; y: number; size: number; rim: string }> = ({
  f, on, x, y, size, rim,
}) => {
  if (on <= 0.01) return null;
  const sway = Math.sin(f / 71) * 1.5 + Math.sin(f / 29) * 0.5;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, marginLeft: -size / 2,
      opacity: clamp01(on), transform: `rotate(${sway.toFixed(2)}deg)`, transformOrigin: "50% 84%",
      pointerEvents: "none",
    }}>
      <Img src={staticFile("img/cmeduelo/cmed_ic_turbina.png")} style={{
        width: "100%", height: "auto", display: "block",
        filter: `brightness(0.045) contrast(2.4) drop-shadow(0 0 24px ${rgba(rim, 0.5)})`,
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════════ */
export const MovAltura: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const f = useCurrentFrame();
  const A = (fr: number) => Math.round(D * fr);

  /* ── ANCLAS DEL GUION (fracciones de D · pesadas por caracteres del tramo s123-s136) ───────── */
  const K = {
    nadaMas: A(0.156),   // s124 "Nada más."
    mismo: A(0.165),     // s125 "El mismo aparato, el mismo patio, el mismo viento del mismo día."
    cuatroM: A(0.220),   // s126 "Solo cuatro metros más arriba…"
    anemo: A(0.304),     // s127 "El anemómetro, arriba, marcó tres coma cuatro…"
    abajo19: A(0.352),   // …"contra el uno coma nueve que marcaba abajo."
    porDos: A(0.408),    // s128 "El viento se multiplicó por menos de dos."
    pregunta: A(0.444),  // s129 "¿Y la energía?"
    energia: A(0.456),   // s130 "…pasó de nueve vatios hora a cuarenta y un vatios hora."
    nueve: A(0.486),
    x45: A(0.519),       // s131 "Se multiplicó por cuatro y medio."
    mismoAp: A(0.548),   // s132 "Con el mismo aparato."  + s133 "Sin comprar nada."
    pozo: A(0.581),      // s134 "Solo sacándolo del pozo de aire quieto…"
    ernesto: A(0.679),   // s135 "Ahí Ernesto se puso contento…"
    fea: A(0.740),       // s136 "…que es la parte fea de esto…"
    doscientos: A(0.762),
    sexta: A(0.840),
    cuadro: A(0.880),    // "…apoyado contra la pared del garaje como un cuadro."
  };
  const ACT2 = K.mismo, ACT3 = K.anemo, ACT4 = K.energia, ACT5 = K.pozo, ACT6 = K.fea, END = D;

  /* ── FRONTERAS (una costura distinta por frontera · ⛔ nunca dos seguidas iguales) ──────────── */
  const F1_AT = ACT2 - A(0.0075), F1_DUR = Math.max(14, A(0.017));   // OCLUSIÓN (el caño de acero)
  const F3_AT = ACT4;                                                // CORTE EN EL BEAT
  const F4_AT = ACT5 - A(0.014), F4_DUR = Math.max(18, A(0.030));    // WIPE POR MATERIA (polvo)
  const F5_AT = ACT6 - A(0.018), F5_DUR = Math.max(20, A(0.034));    // ZOOM-THROUGH (Ernesto)
  // FRONTERA 2 (@ACT3) es MATCH-MOVE: no lleva overlay — la resuelve la cámara, que no frena.

  /* ══ LA CÁMARA — UNA sola, función del frame GLOBAL. El reloj está DEFORMADO por acto (el
     easing nunca es constante) pero es MONÓTONO: z va de 40 a 240 y NO retrocede ni un frame. ══ */
  const clk = keyed(f,
    [0, ACT2, ACT3, ACT4, ACT5, ACT6, K.cuadro, END],
    [0, A(0.115), A(0.330), A(0.505), A(0.640), A(0.790), A(0.905), END],
    [EZ.soft, EZ.push, EZ.glide, EZ.soft, EZ.glide, EZ.push, EZ.soft]);
  // panY −140 sobre los −120 que HEREDA de MovTabla = los −260 del contrato. ry +8, rx −3 (mira arriba).
  const g = gcam(clk, { z0: 40, z1: 240, panY: -140, ry: 8, rx: -3, dur: END });
  const mag = 1500 / (1500 - g.z);

  /* ── EL EJE VERTICAL: `focusM` es MONÓTONO CRECIENTE. La cámara sube y no vuelve a bajar.
        Cuando hay que volver a hablar del suelo (actos 5 y 6) la cámara NO desciende: se ABRE. ── */
  const focusM = keyed(f,
    [0, K.nadaMas, ACT2, K.cuatroM, ACT3, ACT4, ACT5, K.ernesto, ACT6, K.cuadro, END],
    [2.00, 2.34, 2.42, 3.05, 4.20, 4.20, 4.36, 4.52, 4.60, 4.62, 5.60],
    [EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.lin, EZ.push]);
  const net = keyed(f,
    [0, K.nadaMas, ACT2, K.cuatroM, ACT3, K.porDos, ACT4, K.x45, ACT5, ACT6, K.sexta, K.cuadro, END],
    [1.10, 1.02, 0.95, 0.84, 0.66, 0.645, 0.63, 0.60, 0.46, 0.44, 0.435, 0.45, 0.62],
    [EZ.soft, EZ.lin, EZ.push, EZ.glide, EZ.lin, EZ.lin, EZ.soft, EZ.push, EZ.glide, EZ.lin, EZ.soft, EZ.push]);
  const focusX = keyed(f, [0, ACT3, ACT5, END], [860, 980, 940, 900], [EZ.soft, EZ.glide, EZ.soft]);
  const ws = net / mag;
  const panX = 960 - focusX;
  const panY = 540 - MY(focusM);

  /* ══ LA LUZ — VOLTIO → ÁMBAR. Cae la tarde mientras él trabaja. Evoluciona, no salta. ══ */
  const warm = keyed(f,
    [0, ACT2, ACT3, ACT4, ACT5, K.ernesto, ACT6, K.sexta, END],
    [0, 0.06, 0.18, 0.30, 0.52, 0.66, 0.74, 0.88, 1.0],
    [EZ.lin, EZ.soft, EZ.lin, EZ.glide, EZ.lin, EZ.soft, EZ.lin, EZ.soft]);
  const tint = light(warm, "volt", "amber");
  const keyFrom = keyed(f, [0, ACT3, ACT5, END], [0.22, 0.40, 0.60, 0.74], EZ.soft);
  const inten = keyed(f, [0, ACT3, K.x45, ACT5, ACT6, K.sexta, END],
    [0.92, 1.0, 1.14, 1.0, 0.9, 0.82, 0.92], EZ.soft);

  /* ══ EL VIENTO — crece con la altura Y con el tramo (.20 → .55, el contrato del handoff) ══ */
  const windGlobal = keyed(f, [0, ACT2, ACT3, ACT4, ACT5, ACT6, END],
    [0.20, 0.26, 0.34, 0.40, 0.46, 0.50, 0.55], EZ.soft);
  const windHigh = keyed(f, [0, K.cuatroM, ACT3, ACT4, ACT5, END],
    [0.30, 0.44, 0.62, 0.70, 0.78, 0.85], EZ.glide);
  const windLow = keyed(f, [0, ACT3, ACT5, K.ernesto, END],
    [0.13, 0.10, 0.07, 0.055, 0.05], EZ.soft);

  /* ══ EL RIG — el caño crece de 2 m a 6,35 m EN CÁMARA durante el acto 1 ══ */
  const pipeM = keyed(f, [A(0.018), A(0.055), A(0.100), A(0.142)], [2.0, 3.1, 5.2, 6.35],
    [EZ.push, EZ.glide, EZ.soft]);
  const tension = keyed(f, [A(0.062), A(0.150)], [0, 1], EZ.glide);
  const axisGrow = keyed(f, [A(0.010), A(0.048), A(0.130)], [0.16, 0.42, 1], [EZ.push, EZ.glide]);
  const markerM = keyed(f, [ACT2, K.cuatroM, ACT3 - A(0.010)], [2.0, 2.9, 6.0], [EZ.push, EZ.glide]);
  const markOn = keyed(f, [ACT2 - A(0.008), ACT2 + A(0.012), ACT3 + A(0.030), ACT3 + A(0.060)],
    [0, 1, 1, 0.22], [EZ.push, EZ.lin, EZ.soft]);
  const skyOn = keyed(f, [K.cuatroM, ACT3, END], [0, 0.8, 1], [EZ.glide, EZ.soft]);
  const deadOn = keyed(f, [ACT5 - A(0.004), ACT5 + A(0.030), K.fea, END], [0, 1, 1, 0.55],
    [EZ.push, EZ.lin, EZ.soft]);

  /* ══ EL GAUGE DE ENERGÍA (acto 6) ══ */
  const g9 = keyed(f, [K.fea + A(0.006), K.fea + A(0.030)], [0, 1], EZ.push);
  const g41 = keyed(f, [K.fea + A(0.016), K.fea + A(0.042)], [0, 1], EZ.push);
  const g270 = keyed(f, [K.doscientos, K.doscientos + A(0.052)], [0, 1], EZ.expo);
  const sixth = keyed(f, [K.sexta, K.sexta + A(0.024)], [0, 1], EZ.snap);

  /* ══ VENTANAS DE MONTAJE — cada acto se apaga sólo cuando su costura YA lo tapó ══ */
  const showLow = f >= ACT2 + A(0.008);
  const showHigh = f >= K.cuatroM - A(0.014);
  const showGauge = f >= K.fea + A(0.004);

  /* ── opacidades de tarjeta: rampas cortas, NUNCA un fade en la frontera ── */
  const opOf = (mount: number, out: number, ramp = A(0.010)) =>
    keyed(f, [mount, mount + Math.max(4, ramp), out - Math.max(4, ramp), out], [0, 1, 1, 0],
      [EZ.push, EZ.lin, EZ.soft]);

  /* ── ZOOM-THROUGH de la frontera 5: la cámara ATRAVIESA la tarjeta de Ernesto ── */
  const zt = zoomThrough(f, F5_AT, F5_DUR, 74, 41);
  const ztOn = f >= F5_AT && !zt.done;

  /* ── parallax del texto: el bloque respira con la cámara, no está pegado al cuadro ── */
  const paraX = -panX * 0.012, paraY = -panY * 0.010;
  const tIn = (at: number, d = A(0.011)) => clamp01((f - at) / Math.max(6, d));
  const tOut = (at: number, d = A(0.011)) => 1 - clamp01((f - at) / Math.max(6, d));

  const t1 = f > A(0.012) && f < K.nadaMas + A(0.006);
  const t2 = f > K.cuatroM - A(0.020) && f < ACT3 - A(0.006);
  const t3 = f > ACT3 + A(0.016) && f < K.pregunta + A(0.004);
  const t4 = f > K.x45 - A(0.020) && f < ACT5 - A(0.006);
  const t5 = f > ACT5 + A(0.024) && f < K.ernesto + A(0.008);
  const t6 = f > K.fea + A(0.012);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los D frames. No se remonta entre actos. ══ */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={0.5} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══ */}
      <Layers cam={g.transform}>
        {/* Fondo de MATERIAL REAL a sangre (fuera de la escala del mundo: siempre cubre el cuadro).
            Sólo DOS fondos en todo el movimiento, y ninguno repite un plano que ya está en una tarjeta:
              · Actos 1-4 → la HOJA (`circulaFila`): engancha con el papel con el que MovTabla entrega
                y se lee como textura de medición detrás del eje de metros.
              · Actos 5-6 → LA PARED DE LA CASA (`hablaCasa`): es el pozo de aire quieto en el acto 5
                y, sin cortar, la pared contra la que el panel está apoyado "como un cuadro" en el 6.
                No cambia de plano en la frontera 5: cambia de ESCALA y de densidad (la cámara se abre). */}
        {f < ACT5 - A(0.006) ? (
          <PhotoPlane src="img/cmeduelo/cmed_o_703_circulaFila.jpg" z={-520}
            scale={keyed(f, [0, ACT3, ACT5], [1.36, 1.26, 1.18], EZ.soft)} dim={0.72} tint={tint} />
        ) : (
          <PhotoPlane src="img/cmeduelo/cmed_h_716_hablaCasa.jpg" z={-520}
            scale={keyed(f, [ACT5, ACT6, END], [1.32, 1.2, 1.1], EZ.soft)}
            dim={keyed(f, [ACT5, ACT6, END], [0.64, 0.7, 0.76], EZ.soft)} tint={tint} />
        )}

        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── PLANO LEJANO: el cielo que se abre arriba de los 5 m + la copa oscura del limonero ── */}
          <Plane z={-300}>
            <SkyBand on={skyOn} warm={warm} />
            <div style={{
              position: "absolute", left: `${xp(1180)}%`, width: `${xp(1080)}%`,
              top: `${yp(MY(3.9))}%`, height: `${((MY(0.2) - MY(3.9)) / 1080) * 100}%`,
              pointerEvents: "none", opacity: 0.85,
              background: `radial-gradient(58% 62% at 46% 74%, ${rgba("#10160E", 0.92)} 0%, ${rgba("#0C110B", 0.6)} 52%, rgba(0,0,0,0) 76%)`,
            }} />
          </Plane>

          {/* ── PLANO DEL AIRE: las dos bandas de viento recortadas POR ALTURA ── */}
          <Plane z={-140}>
            <WindBand mTop={9.4} mBot={3.2} speed={windHigh} count={24} opacity={0.95} tint={V.white} />
            <WindBand mTop={2.6} mBot={-0.4} speed={windLow} count={9} opacity={0.5} tint={V.sky} />
            <DeadZone f={f} on={deadOn} />
          </Plane>

          {/* ── PLANO DEL EJE: la regla de metros y el marcador que trepa ── */}
          <Plane z={-40}>
            <AxisRuler f={f} grow={axisGrow} marker={markerM} markOn={markOn} tint={tint} />
          </Plane>

          {/* ── PLANO DE LA MATERIA: EL CAÑO. Cruza el movimiento entero. ── */}
          <Plane z={30}>
            <PipeRig f={f} topM={pipeM} tension={tension} tint={tint} />
            {/* la turbina arriba, en SILUETA contra el cielo: lo que se le entrega a MovNoche */}
            <TurbineSil f={f}
              on={keyed(f, [K.cuatroM, ACT3, K.cuadro, END], [0, 0.72, 0.94, 1], EZ.soft)}
              x={xp(AX + 15)} y={yp(MY(6.35) - 96)} size={268} rim={tint} />
          </Plane>

          {/* ── PLANO DEL GAUGE (acto 6): 9 · 41 · 270 ── */}
          {showGauge && (
            <Plane z={70}>
              <EnergyGauge f={f} g9={g9} g41={g41} g270={g270} sixth={sixth} />
            </Plane>
          )}

          {/* ══ LAS DOS TARJETAS CLAVADAS A SU ALTURA — MATERIAL REAL, una abajo y una arriba,
                en el MISMO eje. Éste es el corazón del movimiento: no se comparan dos gráficos,
                se comparan dos alturas con dos pedazos de patio adentro de vidrio. ══ */}
          <Plane z={120}>
            {/* ARRIBA · 6 M · el caño prestado.
                ⛔ FOTO A PROPÓSITO, NO ES UN DESCUIDO: el mp4 de este plano existe en disco pero el
                auditor de movimiento lo rechazó en DOS pasadas (sev 9) — le DERIVA EL FONDO: la
                estructura del garaje se reinventa, el changuito rojo se vuelve un mueble gris y
                aparece una bicicleta. Un fondo que se reinventa dentro de una tarjeta flotante se ve
                muchísimo. La foto ES el primer frame del clip, así que el encuadre, la luz y la
                posición en el eje de metros no cambian: sólo se pierde el micro-gesto.
                ⛔ NO volver a `LiveCard` sin que el auditor lo apruebe. */}
            {showHigh && (
              <MediaCard src="img/cmeduelo/cmed_h_721_caminaAlPatio.jpg" kind="photo"
                label="6 M · EL CAÑO PRESTADO"
                x={xp(CARD_X)} y={yp(MY(6))} z={40} w={452} h={266} ry={-7} radius={12}
                sheenAt={K.cuatroM + A(0.006)}
                lit={keyed(f, [ACT3, ACT4, END], [1, 0.94, 0.72], EZ.soft)} litColor={V.volt}
                opacity={opOf(K.cuatroM - A(0.014), END + A(0.02))} />
            )}
            {/* ABAJO · 2 M · el poste viejo. Es LA MISMA turbina: por eso vuelve la foto ya vista. */}
            {showLow && (
              <MediaCard src="img/cmeduelo/cmed_o_705_turbinaBaja.jpg" kind="photo"
                label="2 M · EL POSTE VIEJO"
                w={432} h={254} x={xp(CARD_X)} y={yp(MY(2))} z={20} ry={8} radius={12}
                sheenAt={ACT2 + A(0.010)}
                lit={keyed(f, [ACT2, ACT3, ACT5, END], [1, 0.86, 0.6, 0.46], EZ.soft)}
                litColor={V.sky}
                opacity={opOf(ACT2 + A(0.008), END + A(0.02))} />
            )}
          </Plane>

          {/* ══ LAS CUATRO LECTURAS — ancladas a su altura, jamás flotando. Las escribe el KIT. ══ */}
          <Plane z={160}>
            {/* viento arriba: 3,4 m/s */}
            <Readout value="3,4" unit="m/s" label="ARRIBA · 6 M" at={ACT3 + A(0.014)}
              x={xp(READ_X)} y={yp(MY(6) - 74)} size={104} color={V.volt} />
            {/* viento abajo: 1,9 m/s */}
            <Readout value="1,9" unit="m/s" label="ABAJO · 2 M" at={K.abajo19 + A(0.008)}
              x={xp(READ_X)} y={yp(MY(2) - 74)} size={92} color={V.sky} />
            {/* energía arriba: 41 Wh */}
            <Readout value="41" unit="Wh" at={ACT4 + A(0.006)}
              x={xp(READ_X)} y={yp(MY(6) + 78)} size={116} color={V.volt} />
            {/* energía abajo: 9 Wh */}
            <Readout value="9" unit="Wh" at={K.nueve}
              x={xp(READ_X)} y={yp(MY(2) + 78)} size={96} color={V.sky} />
            {/* el "× menos de 2" del viento: el dato que MENOS importa. Chico, casi de paso. */}
            {f > K.porDos && (
              <div style={{
                position: "absolute", left: `${xp(READ_X + 40)}%`, top: `${yp(MY(4))}%`,
                transform: "translate(-50%,-50%)",
                opacity: tIn(K.porDos) * (0.5 + 0.14 * Math.sin(f / 37)),
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: 1.5,
                color: rgba(V.white, 0.62), textShadow: "0 4px 18px rgba(0,0,0,0.9)",
                whiteSpace: "nowrap",
              }}>× MENOS DE 2</div>
            )}
            {/* el 270 del panel: ANCLADO AL SUELO, al pie de su propia barra. No subió nunca porque no
                lo necesitó. (Va A LA DERECHA de la barra y POR ENCIMA de la línea de suelo: colgado
                bajo el suelo se salía del cuadro en el plano abierto del acto 6 — safe area 60 px.) */}
            <Readout value="270" unit="Wh" label="EL PANEL · SIN MOVERSE" at={K.doscientos + A(0.020)}
              x={xp(1010)} y={yp(GROUND - 190)} size={104} color={V.amber} />
          </Plane>

          {/* ══ EL MATERIAL DE CADA ACTO — 1 objeto protagonista, siempre dentro de vidrio ══ */}
          {/* ACTO 1 · el montaje: Claudio con el alambre + los tensores listos */}
          {f < ACT2 + A(0.006) && (
            <Plane z={230}>
              <LiveCard f={f}
                video="broll/cmeduelo/cmed_h_709_caminaConAlambre.mp4"
                photo="img/cmeduelo/cmed_h_709_caminaConAlambre.jpg"
                label="EL CAÑO DE ERNESTO"
                mount={A(0.012)} out={ACT2 + A(0.006)}
                x={xp(760)} y={yp(MY(1.15))} z={30} w={528} h={318} ry={11} rot={-1.2}
                lit={1} litColor={V.volt} op={opOf(A(0.012), ACT2 + A(0.006), A(0.014))} />
              <MediaCard src="img/cmeduelo/cmed_o_711_tensoresListos.jpg" kind="photo"
                label="TRES TENSORES"
                w={318} h={196} x={xp(1560)} y={yp(MY(0.55))} z={-60} ry={-13} radius={10}
                sheenAt={A(0.070)} lit={0.8} litColor={V.volt}
                opacity={opOf(A(0.058), ACT2 + A(0.004), A(0.012))} />
            </Plane>
          )}

          {/* ACTO 3 · el anemómetro en alto */}
          {f >= ACT3 - A(0.016) && f < ACT4 + A(0.008) && (
            <Plane z={250}>
              <MediaCard src="img/cmeduelo/cmed_o_713_tablaYAnemometro.jpg" kind="photo"
                label="EL ANEMÓMETRO, ARRIBA"
                w={430} h={268} x={xp(300)} y={yp(MY(4.9))} z={80} ry={13} radius={12}
                sheenAt={ACT3 + A(0.010)} lit={1} litColor={V.volt}
                opacity={opOf(ACT3 - A(0.016), ACT4 + A(0.008), A(0.013))} />
              <IconPng src="img/cmeduelo/cmed_ic_anemometro.png"
                x={xp(1560)} y={yp(MY(6.9))} size={104} z={40}
                opacity={0.9 * tIn(ACT3 + A(0.004))} glow={V.ink0} />
              {/* "…contra el uno coma nueve que marcaba ABAJO": el dedo sobre la lectura de abajo.
                  Entra en el beat del 1,9, a la altura del poste viejo — no flota. */}
              {f >= K.abajo19 - A(0.010) && (
                <MediaCard src="img/cmeduelo/cmed_o_718_dedoEnPagina.jpg" kind="photo"
                  label="LA LECTURA DE ABAJO"
                  w={344} h={212} x={xp(330)} y={yp(MY(1.5))} z={110} ry={9} radius={12}
                  sheenAt={K.abajo19 + A(0.006)} lit={0.9} litColor={V.sky}
                  opacity={opOf(K.abajo19 - A(0.010), K.pregunta - A(0.004), A(0.011))} />
              )}
              {/* el respiro de "¿Y la energía?" */}
              {f >= K.pregunta - A(0.014) && (
                <MediaCard src="img/cmeduelo/cmed_h_712_frenaSegundo.jpg" kind="photo"
                  w={368} h={222} x={xp(660)} y={yp(MY(1.4))} z={120} ry={-10} radius={12}
                  sheenAt={K.pregunta} lit={0.95} litColor={V.amber}
                  opacity={opOf(K.pregunta - A(0.014), ACT4 + A(0.008), A(0.010))} />
              )}
            </Plane>
          )}

          {/* ACTO 4 · el cuaderno de alturas + "sin comprar nada" */}
          {f >= ACT4 - A(0.004) && f < ACT5 + A(0.006) && (
            <Plane z={250}>
              <MediaCard src="img/cmeduelo/cmed_h_701_cuadernoAltura.jpg" kind="photo"
                label="EL MISMO APARATO"
                w={446} h={276} x={xp(290)} y={yp(MY(4.85))} z={90} ry={12} radius={12}
                sheenAt={ACT4 + A(0.012)} lit={1} litColor={V.volt}
                opacity={opOf(ACT4 - A(0.004), ACT5 + A(0.006), A(0.013))} />
              {/* "Con el mismo aparato. Sin comprar nada." El clip reparado — las manos apoyadas en
                  la caja y LA CAJA NO SE MUEVE — dice la frase mejor que cualquier gesto grande. */}
              <LiveCard f={f}
                video="broll/cmeduelo/cmed_h_715_cajaWorkbench.mp4"
                photo="img/cmeduelo/cmed_h_715_cajaWorkbench.jpg"
                label="SIN COMPRAR NADA"
                mount={K.mismoAp - A(0.010)} out={ACT5 + A(0.006)}
                x={xp(600)} y={yp(MY(1.2))} z={130} w={396} h={238} ry={-11}
                lit={0.96} litColor={V.amber}
                op={opOf(K.mismoAp - A(0.010), ACT5 + A(0.006), A(0.011))} />
            </Plane>
          )}

          {/* ACTO 6 · "la parte fea": el gesto de Claudio, chico, mientras el 270 lo aplasta */}
          {f >= K.fea + A(0.010) && (
            <Plane z={240}>
              <MediaCard src="img/cmeduelo/cmed_h_708_gestoDesaprueba.jpg" kind="photo"
                w={352} h={214} x={xp(180)} y={yp(MY(1.1))} z={70} ry={12} radius={12}
                sheenAt={K.fea + A(0.026)} lit={0.82} litColor={V.amber}
                opacity={opOf(K.fea + A(0.010), K.cuadro + A(0.030), A(0.012))} />
              {/* "…la sexta parte de los doscientos setenta": las dos columnas enfrentadas en papel,
                  entrando en el beat exacto de la llave del 1/6. */}
              {f >= K.sexta - A(0.012) && (
                <MediaCard src="img/cmeduelo/cmed_o_714_guiaDosPaginas.jpg" kind="photo"
                  label="TURBINA CONTRA PANEL"
                  w={380} h={232} x={xp(1560)} y={yp(GROUND - 200)} z={60} ry={-9} radius={12}
                  sheenAt={K.sexta + A(0.008)} lit={0.9} litColor={V.amber}
                  opacity={opOf(K.sexta - A(0.012), END + A(0.02), A(0.014))} />
              )}
            </Plane>
          )}

          {/* primer plano: polvo del patio en el aire — profundidad real, nunca quieto */}
          <Plane z={330}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {Array.from({ length: 15 }, (_, i) => {
                const a = rnd(i * 2.17 + 3), b = rnd(i * 5.03 + 9);
                const x = a * 112 - 6 + Math.sin(f / (58 + b * 66) + i) * 2.4;
                const y = ((b * 1360 - f * (0.24 + a * 0.6)) % 1360 + 1360) % 1360;
                const d = 2.4 + b * 5;
                return <div key={i} style={{
                  position: "absolute", left: `${x.toFixed(2)}%`, top: 1300 - y,
                  width: d, height: d, borderRadius: "50%",
                  background: rgba(warm > 0.55 ? V.amber : V.white, 0.5),
                  opacity: 0.16 + a * 0.5,
                }} />;
              })}
            </div>
          </Plane>
        </AbsoluteFill>
      </Layers>

      {/* ══ ACTO 6 · EL PANEL "COMO UN CUADRO" — vive en ESPACIO DE PANTALLA, fuera del mundo:
            es lo ÚNICO que no sube, no se escala y no viaja. Colgado, quieto, contra la pared. ══ */}
      {f >= K.fea + A(0.020) && (
        <AbsoluteFill style={{ perspective: "1500px", transformStyle: "preserve-3d", pointerEvents: "none" }}>
          <MediaCard src="img/cmeduelo/cmed_o_720_equipoCompleto.jpg" kind="photo"
            label="APOYADO CONTRA LA PARED"
            w={452} h={300} x={77} y={62} z={0} ry={-4} radius={8}
            sheenAt={K.doscientos + A(0.014)} lit={0.95} litColor={V.amber}
            opacity={opOf(K.fea + A(0.020), END + A(0.02), A(0.016))} />
        </AbsoluteFill>
      )}

      {/* ══ ACTO 5 · ERNESTO + FRONTERA 5 · ZOOM-THROUGH ═══════════════════════════════════════
            UNA sola tarjeta montada UNA vez: entra en el acto 5, y cuando llega la frontera la MISMA
            tarjeta es la que la cámara ATRAVIESA (`zt.out` vale "none" y `zt.opacity` vale 1 mientras
            p<=0, así que el zoom se monta encima sin remontar nada). No son dos apariciones del plano:
            es un plano continuo que cruza la costura. ══ */}
      {f >= K.ernesto - A(0.012) && !zt.done && (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", perspective: "1500px", transformStyle: "preserve-3d" }}>
          <AbsoluteFill style={{
            transform: zt.out, transformOrigin: "74% 41%", opacity: zt.opacity, transformStyle: "preserve-3d",
          }}>
            {/* ⛔ FOTO A PROPÓSITO, NO ES UN DESCUIDO: el mp4 existe en disco pero el auditor de
                movimiento lo rechazó en DOS pasadas (sev 10) — la escena CORTA de adentro del garaje
                al exterior de la casa. La deriva está desde el primer segundo, no se arregla
                recortando. La foto ES el primer frame del clip: mismo encuadre, misma luz, misma
                posición — sólo se pierde el cabeceo.
                ⛔ NO volver a `LiveCard` sin que el auditor lo apruebe. */}
            <MediaCard src="img/cmeduelo/cmed_h_704_sonrieAnticipa.jpg" kind="photo"
              label="ERNESTO CREE QUE GANÓ"
              x={74} y={41} z={0} w={470} h={288} ry={-6} radius={12}
              sheenAt={K.ernesto + A(0.006)}
              lit={1} litColor={V.amber} opacity={tIn(K.ernesto - A(0.012), A(0.012))} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ══ FRONTERA 1 · OCLUSIÓN — el caño de acero pasa pegado a la lente en "Nada más." ══ */}
      <PipeOcclude f={f} at={F1_AT} dur={F1_DUR} />

      {/* ══ FRONTERA 4 · WIPE POR MATERIA — el polvo del patio cruza y detrás ya está la pared ══ */}
      <SeamWipeMatter at={F4_AT} dur={F4_DUR} tint={V.concrete} />

      {/* ══ FRONTERA 3 · CORTE EN EL BEAT — exacto en "La energía del día pasó de…" ══ */}
      <SeamFlash at={F3_AT} color={V.volt} dur={7} />

      {/* ══ EL VIENTO GLOBAL — .20 abajo → .55 arriba. El arco del handoff, en primer plano. ══ */}
      <WindField speed={windGlobal} count={14} opacity={0.5} tint={warm > 0.6 ? V.amber : V.white} />

      {/* ══ TIPOGRAFÍA — UNA idea por acto, titular ≤7 palabras, cama oscura, safe area 60 px ══ */}
      {t1 && (
        <div style={{
          position: "absolute", left: 96, top: 96,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(-30, 0, EZ.snap(tIn(A(0.012)))).toFixed(1)}px)`,
          opacity: tIn(A(0.012)) * tOut(K.nadaMas - A(0.006)),
        }}>
          <Bed pad={28} w={780}>
            <Kick>SIN GASTAR UN DÓLAR MÁS</Kick>
            <div style={{ height: 12 }} />
            <Head size={70}>DE DOS METROS <Em>A SEIS</Em></Head>
          </Bed>
        </div>
      )}
      {t2 && (
        <div style={{
          position: "absolute", left: 96, bottom: 104,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(tIn(K.cuatroM - A(0.020)))).toFixed(1)}px)`,
          opacity: tIn(K.cuatroM - A(0.020)) * tOut(ACT3 - A(0.020)),
        }}>
          <Bed pad={28} w={760}>
            <Kick>MISMO APARATO · MISMO PATIO · MISMO DÍA</Kick>
            <div style={{ height: 12 }} />
            <Head size={70}>CUATRO METROS <Em>MÁS ARRIBA</Em></Head>
          </Bed>
        </div>
      )}
      {t3 && (
        <div style={{
          position: "absolute", left: 96, bottom: 104,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(28, 0, EZ.snap(tIn(ACT3 + A(0.016)))).toFixed(1)}px)`,
          opacity: tIn(ACT3 + A(0.016)) * tOut(K.pregunta - A(0.012)),
        }}>
          <Bed pad={28} w={760}>
            <Kick>EL ANEMÓMETRO, ARRIBA</Kick>
            <div style={{ height: 12 }} />
            <Head size={66}>EL VIENTO: POR <Em>MENOS DE DOS</Em></Head>
          </Bed>
        </div>
      )}
      {t4 && (
        <div style={{
          position: "absolute", left: 96, bottom: 104,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(tIn(K.x45 - A(0.020)))).toFixed(1)}px)`,
          opacity: tIn(K.x45 - A(0.020)) * tOut(ACT5 - A(0.020)),
        }}>
          <Bed pad={30} w={700}>
            <Kick>LA ENERGÍA DEL DÍA</Kick>
            <div style={{ height: 10 }} />
            <Num size={172}>×4,5</Num>
            <div style={{ height: 12 }} />
            <Kick color={V.amber}>MISMO APARATO · SIN COMPRAR NADA</Kick>
          </Bed>
        </div>
      )}
      {t5 && (
        <div style={{
          position: "absolute", left: 96, bottom: 104,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(28, 0, EZ.snap(tIn(ACT5 + A(0.024)))).toFixed(1)}px)`,
          opacity: tIn(ACT5 + A(0.024)) * tOut(K.ernesto - A(0.006)),
        }}>
          <Bed pad={28} w={780}>
            <Kick color={V.sky}>A DOS METROS Y PEGADO A LA CASA</Kick>
            <div style={{ height: 12 }} />
            <Head size={70}>EL POZO DE <Em color={V.sky}>AIRE QUIETO</Em></Head>
          </Bed>
        </div>
      )}
      {t6 && (
        <div style={{
          position: "absolute", left: 96, top: 96,
          transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(-28, 0, EZ.snap(tIn(K.fea + A(0.012)))).toFixed(1)}px)`,
          opacity: tIn(K.fea + A(0.012)),
        }}>
          <Bed pad={28} w={860}>
            <Kick color={V.danger}>Y ACÁ VIENE LA PARTE FEA</Kick>
            <div style={{ height: 12 }} />
            <Head size={66}>41 SIGUE SIENDO <Em color={V.danger}>LA SEXTA PARTE</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── viñeta viva: el plano nunca se cierra, sigue respirando hasta el corte ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.2 + 0.055 * Math.sin(f / 101) + clamp01((f - (END - A(0.03))) / Math.max(6, A(0.03))) * 0.08).toFixed(3)}) 100%)`,
      }} />
      {/* ── el aire de la tarde: una lámina ámbar que entra sobre el final (la luz que se va) ── */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [ACT5, ACT6, K.cuadro, END], [0, 0.06, 0.11, 0.14], EZ.soft),
        background: `linear-gradient(196deg, ${rgba(V.amber, 0.34)} 0%, rgba(0,0,0,0) 46%, rgba(0,0,0,0) 74%, ${rgba(V.sky, 0.2)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
