// MovPico.tsx — MOVIMIENTO 1 de `cmebateria` · "EL PICO DE ARRANQUE" · ~1200 frames @ 30 fps (40 s)
// Canal Claudio Mendoza Constructor (ES). Escenario compartido: `./VoltStage`.
//
// LA IDEA QUE TIENE QUE QUEDAR GRABADA: **una heladera consume 46 vatios… hasta que arranca.**
// En la fracción de segundo en que el compresor se pone en marcha pega picos de 600 a 900 vatios —
// seis, siete, ocho veces lo que gasta andando. Ese pico es el ASESINO SILENCIOSO de los inversores
// baratos: ves "1000 W" en la caja y crees que estás sobrado, pero si el inversor no tiene aire de
// sobra se corta, se pone en protección, hace bip y se apaga. Y no compraste algo defectuoso:
// compraste algo JUSTO. La regla que salva: **el inversor tiene que ser por lo menos el TRIPLE de
// la potencia continua de lo que le enchufas con motor.**
//
// ⛔ NO son cinco componentes pegados: es UN PLANO SECUENCIA de 40 s.
//   · UNA sola atmósfera `<VoltAtmos/>`, montada una vez, que NUNCA se remonta.
//   · UNA sola cámara `gcam(clk(f), {z0:0 → z1:140, panX:-60, ry:-5, dur:D})`. El reloj está
//     DEFORMADO por acto (el easing nunca es constante) pero es MONÓTONO: z no vuelve nunca.
//   · LA LUZ no cambia de color: SE AFILA. Sigue siendo VOLTIO, pero la key sube de .18 a .34, la
//     intensidad de .92 a 1.12 (con un pico de 1.34 en el arranque) y el suelo se cierra de .55 a
//     .64: el mismo garaje, con más contraste. En el instante del pico el CONTRA vira de ámbar a
//     `danger`: el único calor de todo el movimiento.
//   · LAS PARTÍCULAS son literales: .25 el garaje → .18 la medición en calma → **.72 el golpe del
//     compresor** (el aire se sacude) → .24 el banco de trabajo → .20 la salida.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF   (fracciones de `durationInFrames`; entre paréntesis, frames a D=1200)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA (del plano suelto anterior, s083): LA HELADERA BLANCA.
//    cam {z 0, plano general del garaje, net .88} · luz {VOLT, keyFrom .18, int .92} · aire {.25}
//    materia {la heladera blanca — `cmeb_mv_pico_heladeraCerrada` a sangre}
//
// ACTO 1 · .000–.162 (0–194) · "QUIETA. DOMÉSTICA. INOCENTE."  ▸ protagonista: EL BURLETE
//   enterFrom cam {z 0, net .88, foco (960,540)} luz {VOLT key .18} aire {.25}
//             materia {LA HELADERA BLANCA a sangre, que viene del plano anterior}
//   material  {PhotoPlane `cmeb_mv_pico_heladeraCerrada.jpg` a sangre · CLIP
//              `cmeb_mv_pico_burleteMacro.mp4` en macro de héroe · `IconPng cmeb_ic_heladera.png`}
//   El macro del burlete de goma: un ANILLO. Encima, dibujado en su sitio exacto, el aro del sello
//   con sus 34 costillas de goma. Nada se mueve más que la respiración del aro: es el plano más
//   quieto del movimiento, y está puesto ahí para que el golpe del acto 3 duela.
//   exitTo    cam {z ≈ 50, net 1.34 (macro)} luz {key .19} aire {.20} materia {EL ARO r=250}
//   ── FRONTERA A @ .162 ····· MATCH-SHAPE ··················································
//      El ARO del burlete NO se va: mismo centro (690,470), mismo radio (250), misma pantalla.
//      Se le abren 46° de boca, el trazo engorda de 15 a 31 px, se le apagan las costillas de goma,
//      se le enciende el eje del gozne y aparece el cable atravesándolo: **el sello de goma ES la
//      mordaza de la pinza.** El macro del burlete no se funde: lo EMPUJA el aro al crecer y sale
//      de cuadro por delante (escala + z), destapando la pinza que YA ESTABA montada detrás.
//
// ACTO 2 · .162–.352 (194–422) · "CUARENTA Y SEIS VATIOS"      ▸ protagonista: LA PINZA
//   enterFrom cam {z ≈ 50, net 1.34 → 1.12} luz {key .19} aire {.20}
//             materia {EL ARO, ya convertido en la mordaza abierta}
//   material  {CLIP `cmeb_mv_pico_pinzaCable.mp4` de héroe a la derecha · FOTO
//              `cmeb_mv_pico_pantallaPinza.jpg` chica y por detrás = LA PANTALLITA (el blanco del
//              zoom) · `IconPng cmeb_ic_pinza.png` · sigue la cama de la heladera}
//   La mordaza vive a la izquierda; el material real, a la derecha. Readout **46 W** arriba.
//   "Menos de lo que gastaba una lámpara vieja de filamento." Un solo número, chiquito y tranquilo.
//   exitTo    cam {z ≈ 78, net 1.30 (entrando a la pantallita)} luz {key .22} aire {.20}
//             materia {LOS DÍGITOS «46» de la pantallita de la pinza}
//   ── FRONTERA B @ .352 ····· ZOOM-THROUGH (`zoomThrough`, foco = la pantallita) ············
//      La cámara ENTRA en la pantalla de la pinza (el aro y las dos tarjetas de los actos 1-2
//      viajan con el zoom y se van por delante del objetivo). Del otro lado sale el contador
//      gigante del acto 3, que arranca justo en 46 y trepa; y el material también cruza: la FOTO
//      chica de la pantallita sale convertida en CLIP de héroe. Misma materia, otra escala.
//
// ACTO 3 · .352–.552 (422–662) · "PICOS DE NOVECIENTOS VATIOS"  ▸ protagonista: EL PICO
//   enterFrom cam {z ≈ 84, net .96} luz {key .24, int 1.0 → 1.34} aire {.30 → .72}
//             materia {el contador «46» que sale del zoom y empieza a trepar}
//   material  {PhotoPlane `cmeb_mv_pico_compresorAtras.jpg` a sangre (la trasera de la heladera) ·
//              CLIP `cmeb_mv_pico_pantallaPinza.mp4` a escala de HÉROE — en el acto 2 el MISMO
//              plano era una foto chica y de perfil · FOTO `cmeb_mv_pico_claudioMira.jpg` (la cara,
//              chica y con luz voltio) · `IconPng cmeb_ic_rayo.png` reventando sobre la vertical}
//   EL TRAZO DEL OSCILOSCOPIO: la línea plana de 46 vatios y, en el beat exacto, la VERTICAL a
//   900 con su cola de rebote. El cuadro entero se SACUDE (shake amortiguado, función pura de f).
//   Readout 46 → 900 · «×8 · LO QUE GASTA ANDANDO» · la cara de "lo medí tres veces".
//   exitTo    cam {z ≈ 108, net .92} luz {key .27} aire {.30}
//             materia {LA LÍNEA DE 900 — la horizontal roja que quedó marcada en el instrumento}
//   ── FRONTERA C @ .552 ····· WIPE POR MATERIA (`SeamWipeMatter` + la estela de la aguja) ·····
//      El propio salto de la aguja sale disparado y BARRE el cuadro de izquierda a derecha
//      levantando el polvo de la losa (`V.concrete`). Detrás ya están los tres inversores. La
//      LÍNEA DE 900 **sobrevive al barrido**: es el mismo objeto (`Line900`), no se apaga nunca —
//      sólo baja a su nueva altura mientras el eje del acto 4 se acomoda debajo de ella.
//
// ACTO 4 · .552–.788 (662–946) · "NO ES DEFECTUOSO: ES JUSTO"   ▸ protagonista: LOS TRES INVERSORES
//   enterFrom cam {z ≈ 112, net .86 (general)} luz {key .27} aire {.24}
//             materia {LA LÍNEA DE 900, que ahora es el TECHO que los tres tienen que superar}
//   material  {PhotoPlane `cmeb_mv_pico_tresInversores.jpg` a sangre y en penumbra · FOTO
//              `cmeb_mv_pico_inversorChicoApagado.jpg` = EL DE 300 · CLIP
//              `cmeb_mv_pico_pinzaCable.mp4` chico = EL DE 1000 (2ª vuelta del mismo plano, otra
//              escala y otra luz) · CLIP `cmeb_mv_pico_heladeraCerrada.mp4` chico = EL DE 2000
//              (la heladera andando sin enterarse) · `IconPng cmeb_ic_inversor.png`}
//   Tres medidores de AIRE DE SOBRA bajo sus tres tarjetas. El de 300 se queda corto: su led se
//   pone rojo, hace BIP tres veces y se apaga; la tarjeta se le va a gris. Los otros dos pasan.
//   exitTo    cam {z ≈ 130, net 1.08} luz {key .31} aire {.22}
//             materia {EL CUERPO DE ALUMINIO del inversor, que se viene encima de la cámara}
//   ── FRONTERA D @ .788 ····· OCLUSIÓN (`SeamOcclude`, color `V.blade` = el aluminio) ·········
//      El cuerpo de aluminio del inversor cruza el cuadro y lo tapa al 100% durante 5 frames. El
//      swap de acto cae adentro: debajo, los tres medidores ya se fueron y del inversor sale EL
//      CABLE ROJO GRUESO. ⛔ el color es el del ALUMINIO, NO el del fondo (con el del fondo esto
//      es un fundido a negro que se ve como un pozo; ya costó un render en `mdbleach`).
//
// ACTO 5 · .788–1.000 (946–1200) · "EL TRIPLE DE LA POTENCIA"   ▸ protagonista: LA REGLA
//   enterFrom cam {z ≈ 132, net .98} luz {key .32, int 1.16} aire {.22}
//             materia {el aluminio, y el nacimiento del cable rojo en el borne}
//   material  {PhotoPlane `cmeb_mv_pico_claudioMira.jpg` a sangre y en penumbra — en el acto 3 la
//              MISMA cara era una tarjeta chica con luz voltio · FOTO `cmeb_mv_pico_tresInversores`
//              chica y ENCENDIDA (2ª vuelta: en el acto 4 era la cama en penumbra) · FOTO
//              `cmeb_mv_pico_inversorChicoApagado` en el veredicto "300 · NO" · `cmeb_ic_enchufe`}
//   El **×3** grande y el veredicto de dos tarjetas: 1000 SÍ · 300 NO. Nada de aritmética en
//   pantalla (46×3 no es la cuenta: la cuenta es el PICO). Una sola idea, grande.
//   exitTo ⟶ cam {z 140, panX −60, ry −5} · luz {VOLT FILOSO, key .34, int 1.12, floor .64}
//            aire {.20} · materia {EL CABLE ROJO GRUESO que sale del borne del inversor, se TENSA
//            en los últimos 40 frames (la panza sube de y 902 a y 636) y se estira fuera de cuadro
//            por la derecha, casi horizontal, con dirección e inercia. Va en su propio plano
//            (z +260), por delante de todo: es lo último que queda en cuadro.}
//            ⇒ lo agarra MovCuenta para enderezarlo y volverlo el trazo de un número
//
// MATERIAL: los 8 assets del movimiento (+5 íconos PNG). Ninguno se usa más de 2 veces, y cada
// repetición es un PAR DELIBERADO con otra escala Y otra luz:
//   · `heladeraCerrada`    cama a sangre/suave (actos 1-2) ↔ clip chico/voltio filoso "2000 W" (acto 4)
//   · `pinzaCable`         clip de héroe (acto 2)          ↔ clip chico "1000 W" (acto 4)
//   · `pantallaPinza`      foto chica de perfil (acto 2)   ↔ clip de héroe (acto 3) = MATERIA DE B
//   · `tresInversores`     cama a sangre en penumbra (4)   ↔ tarjeta chica encendida (acto 5)
//   · `claudioMira`        tarjeta chica/voltio (acto 3)   ↔ cama a sangre en penumbra (acto 5)
//   · `burleteMacro` (1)   `compresorAtras` (1)   `inversorChicoApagado` (2: tarjeta 300 · veredicto)
//
// ⛔ cero Math.random / Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade.
// ⛔ Easing.quint NO EXISTE → Easing.poly(5).  ⛔ rgba() por el helper del Stage, nunca a mano.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVPICO_FRAMES = 1200;

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

/** mezcla de dos hex (para el CONTRA que vira ámbar→danger en el pico; `light()` no tiene danger) */
const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => { const x = parseInt(h.replace("#", ""), 16); return [(x >> 16) & 255, (x >> 8) & 255, x & 255]; };
  const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b);
  const k = clamp01(t);
  return `rgb(${Math.round(lerp(r1, r2, k))},${Math.round(lerp(g1, g2, k))},${Math.round(lerp(b1, b2, k))})`;
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   GEOMETRÍA DEL MUNDO (1920×1080). La cámara se encarga del encuadre; las medidas de abajo
   están calculadas para que NADA se salga de la safe area de 60 px una vez magnificado por la
   perspectiva (los planos con translateZ alto se AGRANDAN: z total = gcam.z + plano + tarjeta).
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const RING_X = 690, RING_Y = 470, RING_R = 250;   // burlete (acto 1) = mordaza (acto 2) ← MATERIA DE A
const SCR_X = 1400, SCR_Y = 800;                  // la pantallita de la pinza ← BLANCO DEL ZOOM (B)

/* ── acto 3 · el instrumento ── */
const TR_X0 = 190, TR_X1 = 1760;                  // extremos del trazo
const TR_BASE = 792;                              // el suelo del gráfico = 0 W
const TR_TOP = 268;                               // 1000 W
const wattY = (w: number) => TR_BASE - clamp01(w / 1000) * (TR_BASE - TR_TOP);
const TR_SPIKE_X = 968;                           // dónde revienta la vertical
const Y900_A3 = wattY(900);                       // 320 — la línea del pico en el acto 3

/* ── acto 4 · los tres medidores de AIRE DE SOBRA ── */
const COL_X = [432, 964, 1496];
const COL_CAP = [300, 1000, 2000];
const TRK_TOP = 520, TRK_BASE = 880, TRK_W = 118;
const Y900_A4 = 640;                              // la MISMA línea, ya asentada en el eje del acto 4
const FILL_TOP = [800, 606, 545];                 // 300 se queda corto · 1000 pasa · 2000 sobra

/* ── EL ARO — la circunferencia que sobrevive a la FRONTERA A ───────────────────────────────
      morph 0 = burlete de goma cerrado (costillas del sello) · 1 = mordaza abierta de la pinza  */
const SealJaw: React.FC<{ f: number; op: number; morph: number; tint: string }> = ({ f, op, morph, tint }) => {
  if (op <= 0.01) return null;
  const m = clamp01(morph);
  const C = 2 * Math.PI * RING_R;
  const gap = C * (46 / 360) * m;                       // la boca de la mordaza: 0° → 46°
  const sw = lerp(15, 31, m);                           // el trazo engorda: goma → acero
  const col = mix(V.bone, tint, m);
  const br = 1 + Math.sin(f / 61) * 0.005;              // hold VIVO: el aro respira
  const hingeX = RING_X + RING_R * Math.cos(-0.8);
  const hingeY = RING_Y + RING_R * Math.sin(-0.8);
  const dash = `${(C - gap).toFixed(1)} ${gap.toFixed(1)}`;
  return (
    <g opacity={op} transform={`translate(${RING_X} ${RING_Y}) scale(${br.toFixed(4)}) translate(${-RING_X} ${-RING_Y})`}>
      {/* el cable que la mordaza abraza (aparece con la mordaza, por detrás del trazo) */}
      {m > 0.06 && (
        <g opacity={m}>
          <line x1={RING_X - 620} y1={RING_Y + 134} x2={RING_X + 620} y2={RING_Y - 134}
            stroke={rgba(V.ink0, 0.92)} strokeWidth={54} strokeLinecap="round" />
          <line x1={RING_X - 620} y1={RING_Y + 134} x2={RING_X + 620} y2={RING_Y - 134}
            stroke={rgba(V.ink2, 0.96)} strokeWidth={42} strokeLinecap="round" />
          <line x1={RING_X - 620} y1={RING_Y + 124} x2={RING_X + 620} y2={RING_Y - 144}
            stroke={rgba(V.white, 0.16)} strokeWidth={7} strokeLinecap="round" />
        </g>
      )}
      {/* halo: goma difusa → acero con luz */}
      <circle cx={RING_X} cy={RING_Y} r={RING_R + sw * 0.9} fill="none"
        stroke={rgba(tint, 0.06 + 0.13 * m)} strokeWidth={lerp(24, 40, m)} />
      {/* EL ARO: mismo centro, mismo radio, los dos oficios */}
      <g transform={`rotate(-46 ${RING_X} ${RING_Y})`}>
        <circle cx={RING_X} cy={RING_Y} r={RING_R} fill="none" stroke={rgba(V.ink0, 0.85)}
          strokeWidth={sw + 8} strokeDasharray={dash} strokeLinecap="round" />
        <circle cx={RING_X} cy={RING_Y} r={RING_R} fill="none" stroke={col}
          strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
        <circle cx={RING_X} cy={RING_Y} r={RING_R} fill="none" stroke={rgba(V.white, 0.26)}
          strokeWidth={2} strokeDasharray={dash} />
      </g>
      {/* costillas del burlete: sólo mientras es goma */}
      {m < 0.94 && (
        <g opacity={1 - m}>
          {Array.from({ length: 34 }, (_, i) => {
            const a = (i / 34) * Math.PI * 2;
            const r0 = RING_R - 11, r1 = RING_R + 11;
            return (
              <line key={i}
                x1={RING_X + r0 * Math.cos(a)} y1={RING_Y + r0 * Math.sin(a)}
                x2={RING_X + r1 * Math.cos(a)} y2={RING_Y + r1 * Math.sin(a)}
                stroke={rgba(V.ink0, 0.5)} strokeWidth={4} />
            );
          })}
        </g>
      )}
      {/* el gozne de la mordaza: sólo cuando ya es pinza */}
      {m > 0.2 && (
        <g opacity={(m - 0.2) / 0.8}>
          <circle cx={hingeX} cy={hingeY} r={20} fill={rgba(V.ink1, 0.95)} stroke={tint} strokeWidth={4} />
          <circle cx={hingeX} cy={hingeY} r={7} fill={rgba(tint, 0.85)} />
        </g>
      )}
    </g>
  );
};

/* ── ACTO 3 · EL TRAZO DEL OSCILOSCOPIO — la vertical de 900 y su rebote ────────────────────
      `reveal` corre el trazo de izquierda a derecha (dasharray puro, determinístico).           */
const SpikeTrace: React.FC<{ f: number; op: number; reveal: number; spike: number; tint: string }> = ({
  f, op, reveal, spike, tint,
}) => {
  if (op <= 0.01) return null;
  const y46 = wattY(46);
  const sp = clamp01(spike);
  const peak = lerp(y46, wattY(900), sp);
  const jit = Math.sin(f / 3.3) * 1.4 + Math.sin(f / 7.1) * 0.8;
  // plano en 46 → vertical → meseta cortísima → caída con rebote → plano otra vez
  const d =
    `M ${TR_X0},${y46} L ${TR_SPIKE_X - 12},${y46} ` +
    `L ${TR_SPIKE_X},${peak.toFixed(1)} L ${TR_SPIKE_X + 26},${peak.toFixed(1)} ` +
    `L ${TR_SPIKE_X + 46},${lerp(y46, wattY(420), sp).toFixed(1)} ` +
    `L ${TR_SPIKE_X + 64},${lerp(y46, wattY(620), sp).toFixed(1)} ` +
    `L ${TR_SPIKE_X + 86},${lerp(y46, wattY(170), sp).toFixed(1)} ` +
    `L ${TR_SPIKE_X + 114},${y46} L ${TR_X1},${y46}`;
  const dash = 2600;
  return (
    <g opacity={op}>
      {/* rejilla del instrumento — los rótulos van ADENTRO del plot (afuera se comen la safe area) */}
      {[0, 300, 600, 900].map((w) => (
        <g key={w}>
          <line x1={TR_X0} y1={wattY(w)} x2={TR_X1} y2={wattY(w)}
            stroke={rgba(V.white, w === 900 ? 0 : 0.09)} strokeWidth={1.5} strokeDasharray="6 14" />
          {w !== 900 && (
            <text x={TR_X0 + 14} y={wattY(w) - 12} fontFamily={F_DISPLAY} fontSize={26}
              letterSpacing={2} fill={rgba(V.white, 0.4)}>{w} W</text>
          )}
        </g>
      ))}
      {/* el trazo, con su fantasma de fósforo detrás */}
      <g transform={`translate(0 ${(jit * sp).toFixed(2)})`}>
        <path d={d} fill="none" stroke={rgba(tint, 0.22)} strokeWidth={18} strokeLinejoin="round"
          strokeDasharray={dash} strokeDashoffset={lerp(dash, 0, clamp01(reveal))} />
        <path d={d} fill="none" stroke={tint} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray={dash} strokeDashoffset={lerp(dash, 0, clamp01(reveal))} />
      </g>
      {/* la punta viva del trazo mientras revela */}
      {reveal > 0.02 && reveal < 0.99 && (
        <circle cx={lerp(TR_X0, TR_X1, clamp01(reveal))} cy={y46} r={7 + Math.sin(f / 5) * 2} fill={tint} />
      )}
    </g>
  );
};

/* ── LA LÍNEA DE 900 — LA MATERIA QUE CRUZA LA FRONTERA C ───────────────────────────────────
      Es UN SOLO objeto: nace en el pico del acto 3 y NO se apaga en el barrido. Lo único que
      hace es bajar a su nueva altura mientras debajo se acomoda el eje del acto 4.              */
const Line900: React.FC<{ f: number; op: number; y: number }> = ({ f, op, y }) => {
  if (op <= 0.01) return null;
  const crawl = ((f * 1.3) % 38);                        // la línea de un instrumento nunca es estática
  return (
    <g opacity={op}>
      <line x1={230} y1={y} x2={1740} y2={y} stroke={rgba(V.ink0, 0.7)} strokeWidth={11} />
      <line x1={230} y1={y} x2={1740} y2={y} stroke={rgba(V.danger, 0.92)} strokeWidth={5}
        strokeDasharray="26 12" strokeDashoffset={-crawl} />
      <text x={252} y={y - 20} fontFamily={F_DISPLAY} fontSize={31} letterSpacing={4}
        fill={rgba(V.danger, 0.96)}>EL PICO · 900 W</text>
    </g>
  );
};

/* ── ACTO 4 · LOS TRES MEDIDORES DE AIRE DE SOBRA — 300 · 1000 · 2000 ───────────────────────
      No es un gráfico de barras proporcional (2000 no entra en cuadro sin mentirle a la línea
      de 900): es el AIRE DE SOBRA de cada inversor contra el techo del pico. Cada medidor lleva
      su cifra escrita con la tipografía del kit, y el de 300 se queda por debajo de la línea.    */
const HeadroomTracks: React.FC<{ f: number; op: number; born: number; dead: number; tint: string }> = ({
  f, op, born, dead, tint,
}) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      {COL_X.map((cx, i) => {
        const grow = clamp01(born * 3.2 - i * 0.45);
        const top = lerp(TRK_BASE, FILL_TOP[i], grow);
        const h = TRK_BASE - top;
        const isDead = i === 0;
        const d = isDead ? clamp01(dead) : 0;
        const col = isDead ? mix(tint, V.danger, d) : tint;
        const puls = 0.5 + 0.5 * Math.sin(f / 19 + i * 1.4);
        return (
          <g key={i}>
            {/* la pista vacía: el aparato, apagado */}
            <rect x={cx - TRK_W / 2} y={TRK_TOP} width={TRK_W} height={TRK_BASE - TRK_TOP} rx={10}
              fill={rgba(V.ink0, 0.72)} stroke={rgba(V.white, 0.12)} strokeWidth={2} />
            {/* lo que el inversor puede dar */}
            <rect x={cx - TRK_W / 2 + 4} y={top} width={TRK_W - 8} height={Math.max(2, h - 4)} rx={8}
              fill={rgba(col, (0.24 + 0.22 * puls) * (isDead ? 1 - d * 0.7 : 1))}
              stroke={rgba(col, 0.92 * (isDead ? 1 - d * 0.55 : 1))} strokeWidth={3} />
            {/* la cifra del aparato, escrita por el kit, justo encima de su columna */}
            <text x={cx} y={TRK_TOP - 22} textAnchor="middle" fontFamily={F_DISPLAY} fontSize={54}
              letterSpacing={2} fontWeight={800}
              fill={isDead && d > 0.4 ? rgba(V.danger, 0.96) : rgba(V.white, 0.94)}>{COL_CAP[i]} W</text>
            {/* sombra de contacto en la losa del banco */}
            <ellipse cx={cx} cy={TRK_BASE + 10} rx={TRK_W * 0.7} ry={13} fill={rgba(V.ink0, 0.74)} />
            {/* el led del frente: voltio… o rojo y muerto */}
            <circle cx={cx} cy={TRK_BASE - 30} r={13}
              fill={isDead
                ? rgba(V.danger, 0.3 + 0.62 * d * (0.4 + 0.6 * Math.abs(Math.sin(f / 6))))
                : rgba(tint, 0.55 + 0.4 * puls)}
              stroke={rgba(V.ink0, 0.82)} strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

/* ── ACTO 5 · EL CABLE ROJO GRUESO — la MATERIA QUE SALE hacia MovCuenta ─────────────────────
      Nace en el borne del inversor, cuelga con panza y en los últimos frames se TENSA: queda
      casi horizontal, apuntando fuera de cuadro por la derecha, con dirección e inercia.        */
const RedCable: React.FC<{ f: number; op: number; tense: number }> = ({ f, op, tense }) => {
  if (op <= 0.01) return null;
  const t = clamp01(tense);
  const x0 = 596, y0 = 548;
  const cx = lerp(1180, 1290, t), cy = lerp(902, 636, t);   // la panza sube: el cable se estira
  const x1 = 2060, y1 = lerp(686, 618, t);
  const d = `M ${x0},${y0} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${x1},${y1.toFixed(1)}`;
  const glint = ((f * 2.4) % 300) / 300;                    // el brillo que corre por la funda
  return (
    <g opacity={op}>
      {/* el borne del inversor: de dónde sale */}
      <circle cx={x0} cy={y0} r={34} fill={rgba(V.ink1, 0.96)} stroke={rgba(V.blade, 0.7)} strokeWidth={5} />
      <circle cx={x0} cy={y0} r={17} fill={rgba(V.danger, 0.9)} />
      {/* el cable: alma oscura + cuerpo rojo + reflejo */}
      <path d={d} fill="none" stroke={rgba(V.ink0, 0.9)} strokeWidth={50} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#C4342A" strokeWidth={38} strokeLinecap="round" />
      <path d={d} fill="none" stroke={rgba(V.white, 0.15)} strokeWidth={9} strokeLinecap="round"
        transform="translate(0 -10)" />
      {/* el glint que corre: el cable está VIVO, no es un dibujo */}
      <path d={d} fill="none" stroke={rgba(V.white, 0.3)} strokeWidth={11} strokeLinecap="round"
        strokeDasharray="70 2200" strokeDashoffset={-glint * 2270} />
      {/* la funda del borne */}
      <rect x={x0 - 6} y={y0 - 30} width={64} height={60} rx={16} fill={rgba(V.ink2, 0.92)}
        stroke={rgba(V.blade, 0.35)} strokeWidth={3} transform={`rotate(14 ${x0} ${y0})`} />
    </g>
  );
};

/* ── polvo / chispas de primer plano (profundidad real, nunca quieto) ───────────────────────── */
const Grit: React.FC<{ f: number; n: number; seed: number; tint: string; op: number; drive: number }> = ({
  f, n, seed, tint, op, drive,
}) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
      const x = ((a * 128 - 14 + f * (0.05 + drive * 1.05) * (0.4 + b)) % 128 + 128) % 128 - 14;
      const y = a * 106 - 3 + Math.sin(f / (48 + b * 62) + i) * (1.3 + drive * 6);
      const dsz = 2 + b * 5;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: dsz * (1 + drive * 2.4), height: dsz, borderRadius: "50%",
          background: rgba(tint, 0.5), opacity: (0.14 + a * 0.5) * op,
        }} />
      );
    })}
  </div>
);

/* ── tarjeta de MATERIAL REAL: el clip corre `vid` frames y después pasa a la foto del MISMO
      plano (así nunca se congela ni se pasa de largo del mp4) ─────────────────────────────── */
type CardGeo = {
  w: number; h: number; x: number; y: number; z: number; ry?: number; rx?: number; rot?: number;
  radius?: number; label?: string; lit: number; litColor?: string; opacity: number;
};
// ⚠️ `clip`/`still` van como STRINGS LITERALES en cada uso (nunca por template literal): el
// escáner de assets del build lee los .tsx en crudo y un `${}` le queda invisible → 404 en el farm.
// ⚠️⚠️ TECHO DE LOS MP4: los clips de este pipeline salen de 4,04 s (=121 frames de comp a 30 fps)
// o 5,04 s (=151). Como el material de `cmebateria` todavía no está en disco al escribir esto, el
// techo se toma sobre el caso CORTO: `vid` ≤ 112, y SIEMPRE con `still` de relevo del mismo plano.
const VID = 112;
const RealCard: React.FC<{ f: number; clip: string; still: string; mount: number; out: number; vid?: number } & CardGeo> = ({
  f, clip, still, mount, out, vid = VID, ...geo
}) => {
  if (f < mount || f >= out) return null;
  const swap = mount + vid;
  if (f < swap) {
    return (
      <Sequence from={mount} durationInFrames={vid} layout="none">
        <MediaCard src={clip} kind="video" sheenAt={12} {...geo} />
      </Sequence>
    );
  }
  return (
    <Sequence from={swap} durationInFrames={Math.max(2, out - swap)} layout="none">
      <MediaCard src={still} kind="photo" sheenAt={0} {...geo} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovPico: React.FC<{ durationInFrames: number }> = ({ durationInFrames: D }) => {
  const f = useCurrentFrame();
  /** todos los anclajes son FRACCIONES de la duración: el movimiento sobrevive al re-anclaje */
  const A = (x: number) => Math.round(D * x);

  /* ── anclas del guion (s084 → s105) ──────────────────────────────────────────────────────── */
  const K = {
    a1: 0,               // s084 "presta atención al número"
    burl: A(0.055),      //      el macro del burlete entra
    fA: A(0.162),        // ── FRONTERA A · MATCH-SHAPE
    a2: A(0.165),        // s085 "consume alrededor de cuarenta y seis vatios"
    w46: A(0.215),       // s086 "Cuarenta y seis."
    lamp: A(0.285),      // s087 "menos de lo que gastaba una lámpara vieja"
    fB: A(0.352),        // ── FRONTERA B · ZOOM-THROUGH (entramos a la pantallita)
    a3: A(0.368),        // s089 "cuando el motor arranca… la pinza salta"
    pico: A(0.425),      // s090 "Y no salta un poquito."  ← EL GOLPE
    tres: A(0.470),      // s091 "Lo medí tres veces para estar seguro."
    veces: A(0.500),     // s093 "seis, siete, ocho veces"
    fC: A(0.552),        // ── FRONTERA C · WIPE POR MATERIA
    a4: A(0.565),        // s094 "el asesino silencioso de los inversores baratos"
    caja: A(0.615),      // s095 "ves mil vatios en la caja y piensas que estás sobradísimo"
    muere: A(0.660),     // s097/s098 "se corta, se pone en protección, hace bip, y se apaga"
    justo: A(0.728),     // s101 "Compraste algo justo."
    fD: A(0.788),        // ── FRONTERA D · OCLUSIÓN (el aluminio del inversor)
    a5: A(0.795),        // s102 "la regla que uso yo, y que no me falló nunca"
    triple: A(0.845),    // s103 "tres veces la potencia continua"
    veredicto: A(0.898), // s104/s105 "con mil estás bien · con trescientos, no"
    cable: A(0.915),     //      el cable rojo se TENSA (materia de salida)
    end: D,
  };

  /* ══ LA CÁMARA — UNA sola. El reloj se deforma por acto pero es MONÓTONO: z va de 0 a 140
        y no retrocede ni un frame. ════════════════════════════════════════════════════════ */
  const clk = keyed(f,
    [0, K.burl, K.fA, K.w46, K.lamp, K.fB, K.pico, K.veces, K.fC, K.caja, K.muere, K.fD, K.triple, K.cable, D],
    [0, A(0.048), A(0.158), A(0.212), A(0.29), A(0.356), A(0.432), A(0.502), A(0.556), A(0.62), A(0.664), A(0.79), A(0.85), A(0.918), D],
    [EZ.soft, EZ.glide, EZ.push, EZ.lin, EZ.glide, EZ.expo, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft]);
  const g = gcam(clk, { z0: 0, z1: 140, panX: -60, ry: -5, rx: 1.6, dur: D });
  const mag = 1500 / (1500 - g.z);

  /* encuadre: qué punto del MUNDO va al centro, y a qué aumento neto (general → macro → detalle) */
  const net = keyed(f,
    [0, A(0.05), K.burl, K.fA, K.a2, K.w46, K.lamp, K.fB, K.a3, K.pico, K.veces, K.fC, K.a4, K.muere, K.justo, K.fD, K.a5, K.triple, K.cable, D],
    [0.88, 1.02, 1.24, 1.34, 1.12, 1.18, 1.06, 1.30, 0.96, 1.12, 1.00, 0.92, 0.86, 0.95, 0.90, 1.08, 0.98, 1.06, 0.94, 0.90],
    [EZ.push, EZ.glide, EZ.soft, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.expo, EZ.snap, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.soft]);
  const fx = keyed(f,
    [0, K.burl, K.fA, K.a2, K.lamp, K.fB, K.a3, K.pico, K.fC, K.a4, K.muere, K.justo, K.a5, K.triple, K.cable, D],
    [960, RING_X, RING_X, 940, 940, SCR_X, TR_SPIKE_X - 40, TR_SPIKE_X, TR_SPIKE_X + 60, 964, 940, 964, 920, 940, 1080, 1160],
    [EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.push, EZ.expo, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft]);
  const fy = keyed(f,
    [0, K.burl, K.fA, K.a2, K.lamp, K.fB, K.a3, K.pico, K.fC, K.a4, K.muere, K.justo, K.a5, K.triple, K.cable, D],
    [540, RING_Y, RING_Y, 520, 520, SCR_Y, 560, 500, 560, 660, 690, 660, 560, 540, 610, 630],
    [EZ.push, EZ.soft, EZ.lin, EZ.glide, EZ.push, EZ.expo, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft]);

  /* ══ EL GOLPE — el cuadro entero se sacude en el arranque del compresor (pura función de f) ══ */
  const kick = f >= K.pico ? clamp01(1 - (f - K.pico) / 46) : 0;
  const shakeX = Math.sin((f - K.pico) / 1.9) * 17 * kick * kick;
  const shakeY = Math.cos((f - K.pico) / 2.6) * 11 * kick * kick;

  const ws = net / mag;                                   // escala del mundo para dar el encuadre pedido
  const panX = 960 - fx, panY = 540 - fy;
  /** mundo → pantalla (para clavar las cifras del kit al lado de su gráfico, en espacio de PANTALLA) */
  const sx = (X: number) => ((960 + net * (X - fx) + shakeX) / 1920) * 100;
  const sy = (Y: number) => ((540 + net * (Y - fy) + shakeY) / 1080) * 100;

  /* ══ LA LUZ — no cambia de color: SE AFILA. Sigue siendo voltio, con más contraste. ═══════ */
  const tint = light(0, "volt", "volt");                  // la key es VOLTIO de punta a punta
  const heat = keyed(f, [K.a3, K.pico, K.pico + 40, K.veces, K.fC], [0, 1, 0.55, 0.3, 0], [EZ.snap, EZ.soft, EZ.glide, EZ.soft]);
  const contra = mix(V.amber, V.danger, heat);            // el ÚNICO calor del movimiento: el pico
  const keyLift = keyed(f, [0, K.a2, K.a3, K.pico, K.a4, K.a5, D], [0.18, 0.19, 0.24, 0.26, 0.27, 0.32, 0.34], EZ.soft);
  const inten = keyed(f,
    [0, K.fA, K.a2, K.a3, K.pico, K.pico + 34, K.fC, K.a4, K.muere, K.fD, K.a5, D],
    [0.92, 0.98, 1.0, 1.06, 1.34, 1.08, 1.05, 1.0, 1.1, 1.02, 1.16, 1.12],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.soft, EZ.push, EZ.glide]);
  const floorK = keyed(f, [0, K.a3, K.a4, D], [0.55, 0.58, 0.61, 0.64], EZ.soft);

  /* ══ EL AIRE — literal: el golpe del compresor levanta el polvo de la losa ════════════════ */
  const wind = keyed(f,
    [0, K.burl, K.a2, K.lamp, K.fB, K.a3, K.pico - 6, K.pico + 8, K.pico + 44, K.veces, K.fC, K.a4, K.muere, K.justo, K.a5, D],
    [0.25, 0.20, 0.18, 0.18, 0.20, 0.30, 0.28, 0.72, 0.42, 0.34, 0.30, 0.24, 0.28, 0.22, 0.22, 0.20],
    [EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.glide, EZ.soft, EZ.snap, EZ.expo, EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.lin]);

  /* ══ EL ARO (materia de la frontera A) y sus dos oficios ═════════════════════════════════ */
  const ringOp = keyed(f, [A(0.028), A(0.062), K.fB - 26, K.fB - 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const morph = keyed(f, [K.fA - 26, K.fA + 16], [0, 1], EZ.snap);   // burlete → mordaza

  /* ══ ACTO 3 · el trazo y el pico ═════════════════════════════════════════════════════════ */
  const trOp = keyed(f, [K.a3 + 6, K.a3 + 26, K.fC - 4, K.fC + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const trReveal = keyed(f, [K.a3 + 14, K.pico - 8, K.pico + 26, K.veces], [0, 0.5, 0.72, 1], [EZ.glide, EZ.snap, EZ.soft]);
  const spike = keyed(f, [K.pico - 3, K.pico + 5, K.pico + 26, K.veces - 10, K.veces + 26], [0, 1, 1, 0.9, 0.86], [EZ.expo, EZ.lin, EZ.soft, EZ.lin]);
  const wattNow = keyed(f, [K.a3 + 20, K.pico - 4, K.pico + 6, K.pico + 30, K.veces], [46, 46, 900, 872, 900], [EZ.lin, EZ.expo, EZ.soft, EZ.lin]);

  /* ══ LA LÍNEA DE 900 — nace en el pico, CRUZA el barrido y se asienta en el eje del acto 4 ══ */
  const lineOp = keyed(f, [K.pico + 8, K.pico + 24, K.fD - 10, K.fD - 2], [0, 1, 1, 0], [EZ.snap, EZ.lin, EZ.soft]);
  const lineY = keyed(f, [K.fC - 6, K.a4 + 26], [Y900_A3, Y900_A4], EZ.soft);

  /* ══ ACTO 4 · los tres medidores y la muerte del de 300 ══════════════════════════════════ */
  const trkOp = keyed(f, [K.a4 - 12, K.a4 + 16, K.fD - 6, K.fD + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin]);
  const trkBorn = keyed(f, [K.a4 + 6, K.caja + 14], [0, 1], EZ.push);
  const dead = keyed(f, [K.muere - 6, K.muere + 22], [0, 1], EZ.snap);
  const bip = f > K.muere - 4 && f < K.muere + 46 ? clamp01(Math.sin((f - K.muere) / 3.6)) : 0;

  /* ══ ACTO 5 · la regla y EL CABLE ROJO (materia de salida) ═══════════════════════════════ */
  const cableOp = keyed(f, [K.fD + 2, K.a5 + 22], [0, 1], EZ.push);
  const tense = keyed(f, [K.cable - 10, D - 8], [0, 1], EZ.soft);

  /* ══ FRONTERA B · el zoom que entra en la pantallita (coordenadas de MUNDO en %) ═════════ */
  const zt = zoomThrough(f, K.fB, 22, (SCR_X / 1920) * 100, (SCR_Y / 1080) * 100);
  const ztStyle: React.CSSProperties = f < K.fB ? {} : { transform: zt.out, opacity: zt.opacity };

  /* ── parallax del texto (vive en espacio de pantalla, pero acompaña a la cámara) ─────────── */
  const paraX = -panX * 0.013, paraY = -panY * 0.010;
  const txt = (from: number, to: number, rise = 30) => {
    const inn = clamp01((f - from) / 14), out = clamp01((f - (to - 18)) / 18);
    return {
      on: f > from && f < to,
      style: {
        position: "absolute" as const, left: 96, bottom: 104,
        transform: `translate(${paraX.toFixed(1)}px, ${(paraY + shakeY * 0.5).toFixed(1)}px) translateY(${lerp(rise, 0, EZ.snap(inn)).toFixed(1)}px)`,
        opacity: inn * (1 - out),
      },
    };
  };
  const t1 = txt(A(0.022), K.fA - 6);
  const t2 = txt(K.a2 + 14, K.fB - 10);
  const t3 = txt(K.a3 + 16, K.fC - 8);
  const t4 = txt(K.a4 + 14, K.fD - 10);
  const t5 = txt(K.a5 + 16, D - 4);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los ~1200 frames. NUNCA se remonta. ═══════ */}
      <VoltAtmos tint={tint} tint2={contra} keyFrom={keyLift} intensity={inten} floor={floorK} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══════════════════════════════════════════════ */}
      <Layers cam={g.transform}>
        {/* ── PLANO 1 (z −560): LA CAMA DE FOTO. Cambia SÓLO debajo de una costura. ── */}
        {f < K.fB ? (
          /* actos 1-2 · la heladera blanca (la materia que entra del plano anterior) */
          <PhotoPlane src="img/cmebateria/cmeb_mv_pico_heladeraCerrada.jpg" z={-560}
            scale={keyed(f, [0, K.fA, K.fB], [1.48, 1.36, 1.28], EZ.soft)}
            dim={keyed(f, [0, K.a2, K.fB], [0.52, 0.48, 0.44], EZ.soft)} tint={V.volt} />
        ) : f < K.fC ? (
          /* acto 3 · la trasera de la heladera: el compresor que patea */
          <PhotoPlane src="img/cmebateria/cmeb_mv_pico_compresorAtras.jpg" z={-560}
            scale={keyed(f, [K.fB, K.pico, K.fC], [1.44, 1.30, 1.22], EZ.push)}
            dim={keyed(f, [K.fB, K.pico, K.veces, K.fC], [0.5, 0.34, 0.42, 0.46], EZ.soft)} tint={V.volt} />
        ) : f < K.fD ? (
          /* acto 4 · el banco de trabajo con los tres inversores, en penumbra */
          <PhotoPlane src="img/cmebateria/cmeb_mv_pico_tresInversores.jpg" z={-560}
            scale={keyed(f, [K.fC, K.muere, K.fD], [1.40, 1.30, 1.22], EZ.soft)}
            dim={keyed(f, [K.fC, K.muere, K.fD], [0.6, 0.56, 0.6], EZ.soft)} tint={V.volt} />
        ) : (
          /* acto 5 · la cara de Claudio a sangre y en penumbra: "la regla que uso yo" */
          <PhotoPlane src="img/cmebateria/cmeb_mv_pico_claudioMira.jpg" z={-560}
            scale={keyed(f, [K.fD, K.triple, D], [1.38, 1.28, 1.20], EZ.soft)}
            dim={keyed(f, [K.fD, K.triple, D], [0.62, 0.58, 0.62], EZ.soft)} tint={V.volt} />
        )}

        {/* ── PLANO 2 (z −360): el aire LEJANO (parallax propio, va más lento) ── */}
        <Plane z={-360}>
          <WindField speed={wind * 0.7} tint={V.white} count={16} opacity={0.55} />
          <div style={{
            position: "absolute", left: "2%", top: "-4%", width: "58%", height: "56%",
            background: `radial-gradient(56% 56% at 30% 20%, ${rgba(V.volt, 0.09 + 0.06 * heat)} 0%, rgba(0,0,0,0) 72%)`,
          }} />
        </Plane>

        {/* ── EL MUNDO ESCALADO (todo lo que la cámara encuadra) + EL GOLPE del compresor ── */}
        <AbsoluteFill style={{
          transform: `translate(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px) scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ── PLANO 3 (z −60): EL ESQUELETO GRÁFICO de los actos 3-5. Acá los vectores SÍ son
                 legítimos: un osciloscopio es un trazo, un medidor es un medidor. ── */}
          <Plane z={-60}>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <SpikeTrace f={f} op={trOp} reveal={trReveal} spike={spike}
                tint={heat > 0.02 ? mix(V.volt, V.danger, heat * 0.55) : V.volt} />
              <HeadroomTracks f={f} op={trkOp} born={trkBorn} dead={dead} tint={V.volt} />
              {/* LA LÍNEA DE 900 va última: es la que cruza la frontera C y manda sobre las tres */}
              <Line900 f={f} op={lineOp} y={lineY} />
            </svg>
          </Plane>

          {/* ── PLANO 4 (z +40): íconos PNG sin fondo como OBJETOS de la escena ── */}
          <Plane z={40}>
            {f > A(0.02) && f < K.fA + 10 && (
              <IconPng src="img/cmebateria/cmeb_ic_heladera.png" x={80} y={19} size={116} z={40} rot={-4}
                opacity={keyed(f, [A(0.02), A(0.05), K.fA - 16, K.fA + 10], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.a2 + 8 && f < K.fB - 6 && (
              <IconPng src="img/cmebateria/cmeb_ic_pinza.png" x={18} y={22} size={122} z={50} rot={7}
                opacity={keyed(f, [K.a2 + 8, K.a2 + 32, K.fB - 26, K.fB - 6], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.pico - 6 && f < K.fC - 4 && (
              <IconPng src="img/cmebateria/cmeb_ic_rayo.png"
                x={(TR_SPIKE_X / 1920) * 100} y={((TR_TOP - 96) / 1080) * 100}
                size={lerp(96, 168, clamp01((f - K.pico) / 22))} z={110} rot={-6}
                opacity={keyed(f, [K.pico - 6, K.pico + 8, K.fC - 26, K.fC - 4], [0, 1, 1, 0], [EZ.snap, EZ.lin, EZ.soft])}
                glow={V.danger} />
            )}
            {f > K.a4 + 6 && f < K.fD && (
              <IconPng src="img/cmebateria/cmeb_ic_inversor.png" x={13} y={19} size={116} z={40} rot={-5}
                opacity={keyed(f, [K.a4 + 6, K.a4 + 30, K.fD - 24, K.fD], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.a5 + 10 && (
              <IconPng src="img/cmebateria/cmeb_ic_enchufe.png" x={85} y={21} size={114} z={60} rot={6}
                opacity={keyed(f, [K.a5 + 10, K.a5 + 34, D - 40, D - 6], [0, 0.92, 0.92, 0.4], [EZ.push, EZ.lin, EZ.soft])} />
            )}
          </Plane>

          {/* ── PLANO 5 (z +120): LAS TARJETAS DE MATERIAL REAL — el caballo de batalla.
                 Los actos 1-2 viven adentro del grupo que ATRAVIESA el zoom-through. ── */}
          <Plane z={120}>
            <AbsoluteFill style={{ ...ztStyle, transformStyle: "preserve-3d" }}>
              {/* ▸ ACTO 1 · EL BURLETE EN MACRO. El aro crece por delante y lo EMPUJA fuera de
                     cuadro en la frontera A (escala + z): no se funde, lo desplaza la materia. */}
              <RealCard f={f}
                clip="broll/cmebateria/cmeb_mv_pico_burleteMacro.mp4"
                still="img/cmebateria/cmeb_mv_pico_burleteMacro.jpg"
                mount={K.burl - 22} out={K.fA + 14} vid={VID}
                w={lerp(600, 740, clamp01((f - K.burl) / 150))}
                h={lerp(372, 460, clamp01((f - K.burl) / 150))}
                x={lerp(47, 33, clamp01((f - (K.fA - 22)) / 36))}
                y={lerp(46, 40, clamp01((f - (K.fA - 22)) / 36))}
                z={lerp(60, 170, clamp01((f - (K.fA - 22)) / 36))}
                ry={9} radius={13} label="EL BURLETE · GOMA CONTRA GOMA"
                lit={0.92} litColor={V.volt}
                opacity={keyed(f, [K.burl - 22, K.burl + 6, K.fA - 4, K.fA + 12], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.push])} />

              {/* ▸ ACTO 2 · LA PINZA ABRAZANDO EL CABLE — ya montada DETRÁS del macro: cuando el
                     burlete se va empujado, ella no aparece, se DESTAPA. */}
              <RealCard f={f}
                clip="broll/cmebateria/cmeb_mv_pico_pinzaCable.mp4"
                still="img/cmebateria/cmeb_mv_pico_pinzaCable.jpg"
                mount={K.fA - 18} out={K.fB + 12} vid={VID}
                w={560} h={346} x={69.3} y={50} z={60} ry={-9} radius={13}
                label="LA PINZA · EN CALMA" lit={1} litColor={V.volt}
                opacity={keyed(f, [K.fA - 18, K.fA + 12, K.fB - 8, K.fB + 12], [0, 1, 1, 0.5], [EZ.push, EZ.lin, EZ.soft])} />

              {/* ▸ ACTO 2 · LA PANTALLITA — el blanco del zoom. Chica, por detrás y abajo.
                     En el acto 3 vuelve el MISMO plano en CLIP y a escala de héroe. */}
              {f > K.a2 + 18 && f < K.fB + 20 && (
              <MediaCard src="img/cmebateria/cmeb_mv_pico_pantallaPinza.jpg" kind="photo"
                w={290} h={180} x={(SCR_X / 1920) * 100} y={(SCR_Y / 1080) * 100} z={20}
                ry={-14} radius={11} label="LA PANTALLA DE LA PINZA"
                lit={0.94} litColor={V.volt} sheenAt={K.w46 - 12}
                opacity={keyed(f, [K.a2 + 20, K.a2 + 46, K.fB + 4, K.fB + 16], [0, 1, 1, 0.6], [EZ.push, EZ.lin, EZ.soft])} />
              )}
            </AbsoluteFill>

            {/* ▸ ACTO 3 · LA PANTALLITA A ESCALA DE HÉROE — sale del otro lado del zoom.
                   Mismo plano que la tarjeta chica del acto 2: la materia cruza la frontera B. */}
            <RealCard f={f}
              clip="broll/cmebateria/cmeb_mv_pico_pantallaPinza.mp4"
              still="img/cmebateria/cmeb_mv_pico_pantallaPinza.jpg"
              mount={K.fB + 8} out={K.tres + 12} vid={VID}
              w={lerp(760, 600, clamp01((f - (K.fB + 8)) / 70))}
              h={lerp(470, 372, clamp01((f - (K.fB + 8)) / 70))}
              x={lerp(50, 33, clamp01((f - (K.fB + 8)) / 70))}
              y={lerp(46, 34, clamp01((f - (K.fB + 8)) / 70))}
              z={60} ry={8} radius={13} label="LA MISMA PANTALLA, DE CERCA"
              lit={1} litColor={V.volt}
              opacity={keyed(f, [K.fB + 8, K.fB + 22, K.tres - 10, K.tres + 12], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 3 · "lo medí tres veces": la cara de Claudio, chica y con luz voltio.
                   En el acto 5 vuelve la MISMA cara pero como cama a sangre y en penumbra. */}
            <MediaCard src="img/cmebateria/cmeb_mv_pico_claudioMira.jpg" kind="photo"
              w={404} h={250} x={74} y={68} z={40} ry={-12} radius={12}
              label="LO MEDÍ TRES VECES" lit={0.92} litColor={V.volt} sheenAt={K.tres + 8}
              opacity={keyed(f, [K.tres - 14, K.tres + 12, K.fC - 22, K.fC - 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 4 · LOS TRES, cada uno con su material real, sobre su medidor.
                   300 = el chico apagado · 1000 = la pinza que marcó el pico y aguantó ·
                   2000 = la heladera andando sin enterarse. */}
            <MediaCard src="img/cmebateria/cmeb_mv_pico_inversorChicoApagado.jpg" kind="photo"
              w={352} h={218} x={(COL_X[0] / 1920) * 100} y={32.4} z={30} ry={12} radius={12}
              label="300 W · SE APAGA" lit={lerp(0.95, 0.32, dead)} litColor={dead > 0.4 ? V.danger : V.volt}
              sheenAt={K.a4 + 30}
              opacity={keyed(f, [K.a4 + 4, K.a4 + 28, K.fD - 8, K.fD + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            <RealCard f={f}
              clip="broll/cmebateria/cmeb_mv_pico_pinzaCable.mp4"
              still="img/cmebateria/cmeb_mv_pico_pinzaCable.jpg"
              mount={K.a4 + 16} out={K.fD + 4} vid={VID}
              w={352} h={218} x={(COL_X[1] / 1920) * 100} y={32.4} z={30} ry={0} radius={12}
              label="1000 W · AGUANTA" lit={1} litColor={V.volt}
              opacity={keyed(f, [K.a4 + 16, K.a4 + 40, K.fD - 8, K.fD + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
            <RealCard f={f}
              clip="broll/cmebateria/cmeb_mv_pico_heladeraCerrada.mp4"
              still="img/cmebateria/cmeb_mv_pico_heladeraCerrada.jpg"
              mount={K.a4 + 28} out={K.fD + 4} vid={VID}
              w={352} h={218} x={(COL_X[2] / 1920) * 100} y={32.4} z={30} ry={-12} radius={12}
              label="2000 W · NI SE ENTERA" lit={1} litColor={V.volt}
              opacity={keyed(f, [K.a4 + 28, K.a4 + 52, K.fD - 8, K.fD + 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

            {/* ▸ ACTO 5 · el veredicto con material real: el banco encendido (SÍ) y el chico (NO).
                   `tresInversores` vuelve acá como tarjeta chica y ENCENDIDA: en el acto 4 era la
                   cama a sangre y en penumbra. Par deliberado. */}
            {f > K.veredicto - 26 && (
              <MediaCard src="img/cmebateria/cmeb_mv_pico_tresInversores.jpg" kind="photo"
                w={330} h={206} x={26} y={58} z={110} ry={14} radius={11}
                label="1000 W · SÍ" lit={1} litColor={V.volt} sheenAt={K.veredicto + 6}
                opacity={keyed(f, [K.veredicto - 26, K.veredicto + 2, D - 34, D - 4], [0, 0.98, 0.98, 0.45], [EZ.push, EZ.lin, EZ.soft])} />
            )}
            {f > K.veredicto - 10 && (
              <MediaCard src="img/cmebateria/cmeb_mv_pico_inversorChicoApagado.jpg" kind="photo"
                w={330} h={206} x={78} y={60} z={110} ry={-14} radius={11}
                label="300 W · NO" lit={0.58} litColor={V.danger} sheenAt={K.veredicto + 20}
                opacity={keyed(f, [K.veredicto - 10, K.veredicto + 18, D - 34, D - 4], [0, 0.98, 0.98, 0.45], [EZ.push, EZ.lin, EZ.soft])} />
            )}
          </Plane>

          {/* ── PLANO 6 (z +180): EL ARO. Va POR DELANTE del macro del burlete (es el sello
                 calcado sobre él) y por delante del cable en el acto 2 (la mordaza lo abraza).
                 Viaja con el zoom-through de la frontera B, igual que las tarjetas. ── */}
          <Plane z={180}>
            <div style={{ position: "absolute", inset: 0, ...ztStyle }}>
              <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <SealJaw f={f} op={ringOp} morph={morph} tint={V.volt} />
              </svg>
            </div>
          </Plane>

          {/* ── PLANO 7 (z +260): EL CABLE ROJO. Va por DELANTE de todo el material: es lo
                 último que queda en cuadro y lo que agarra MovCuenta. ── */}
          <Plane z={260}>
            <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
              <RedCable f={f} op={cableOp} tense={tense} />
            </svg>
          </Plane>

          {/* ── PLANO 8 (z +300): el aire CERCANO (parallax propio, va más rápido) ── */}
          <Plane z={300}>
            <WindField speed={wind} tint={heat > 0.3 ? V.torch : V.white} count={13} opacity={0.9} />
          </Plane>
        </AbsoluteFill>

        {/* ── PLANO 9 (z +430): polvo de la losa en primerísimo plano ── */}
        <Plane z={430}>
          <Grit f={f} n={17} seed={7} tint={heat > 0.3 ? V.torch : V.concrete} op={0.5 + wind * 0.45} drive={wind} />
        </Plane>
      </Layers>

      {/* ══════════════ LAS CIFRAS — las escribe SIEMPRE el kit, nunca el motor de imagen ══════ */}
      {/* ACTO 2 · los 46 vatios, arriba de la pinza y lejos del aro */}
      {f > K.w46 - 2 && f < K.fB + 4 && (
        <Readout value="46" unit="W" label="ANDANDO · PROMEDIO REAL" at={K.w46}
          x={sx(1330)} y={sy(230)} size={132} color={V.volt} />
      )}
      {/* ACTO 3 · el contador que sale del zoom en 46 y trepa a 900 */}
      {f > K.fB + 14 && f < K.fC - 4 && (
        <Readout value={String(Math.round(wattNow))} unit="W"
          label={f < K.pico + 4 ? "EN EL ARRANQUE" : "MENOS DE UN SEGUNDO"}
          at={K.fB + 14} x={sx(TR_SPIKE_X + 260)} y={sy(TR_TOP + 130)}
          size={f < K.pico + 4 ? 128 : 176} color={f < K.pico + 4 ? V.white : V.danger} />
      )}
      {/* ACTO 3 · "seis, siete, ocho veces" */}
      {f > K.veces - 2 && f < K.fC - 6 && (
        <div style={{
          position: "absolute", left: `${sx(430).toFixed(2)}%`, top: `${sy(300).toFixed(2)}%`,
          transform: `translate(-50%,-50%) scale(${lerp(0.66, 1, EZ.snap(clamp01((f - K.veces) / 12))).toFixed(3)})`,
          opacity: clamp01((f - K.veces + 2) / 10) * (1 - clamp01((f - (K.fC - 26)) / 20)),
          display: "flex", alignItems: "flex-end", gap: 12,
        }}>
          <Num size={178} color={V.danger}>×8</Num>
          <div style={{ paddingBottom: 26 }}>
            <Kick color={V.white}>LO QUE GASTA ANDANDO</Kick>
          </div>
        </div>
      )}
      {/* ACTO 4 · la cifra de la caja (las tres capacidades las escribe el propio medidor) */}
      {f > K.caja - 4 && f < K.fD - 6 && (
        <Readout value="1000" unit="W" label="LO QUE DICE LA CAJA" at={K.caja}
          x={80} y={76} size={116} color={V.amber} />
      )}
      {/* ACTO 4 · el BIP del que se apaga */}
      {bip > 0.01 && (
        <div style={{
          position: "absolute", left: `${sx(COL_X[0]).toFixed(2)}%`, top: `${sy(900).toFixed(2)}%`,
          transform: "translate(-50%,-50%)", opacity: 0.25 + 0.75 * bip,
          padding: "10px 28px", borderRadius: 8,
          background: `linear-gradient(180deg, ${rgba(V.danger, 0.95)} 0%, ${rgba(V.danger, 0.76)} 100%)`,
          boxShadow: `0 16px 46px ${rgba(V.ink0, 0.82)}, inset 0 1px 0 ${rgba(V.white, 0.4)}`,
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, letterSpacing: 8,
          color: V.ink0, textTransform: "uppercase", whiteSpace: "nowrap",
        }}>BIP · PROTECCIÓN</div>
      )}
      {/* ACTO 5 · LA REGLA: el ×3 y la frase que lo define (nada de aritmética: la cuenta es el PICO) */}
      {f > K.triple - 4 && (
        <div style={{
          position: "absolute", left: "50%", top: "28%",
          transform: `translate(-50%,-50%) scale(${lerp(0.7, 1, EZ.snap(clamp01((f - K.triple) / 14))).toFixed(3)})`,
          opacity: clamp01((f - K.triple + 4) / 12),
          display: "flex", alignItems: "center", gap: 26,
        }}>
          <Num size={210} color={V.volt}>×3</Num>
          <div style={{ maxWidth: 600 }}>
            <Kick color={V.white}>COMO MÍNIMO</Kick>
            <div style={{ height: 10 }} />
            <div style={{
              fontFamily: F_BODY, fontWeight: 700, fontSize: 34, lineHeight: 1.24, color: V.bone,
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}>
              La potencia continua de lo que enchufes con motor.
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ LAS COSTURAS (una distinta por frontera · ⛔ NUNCA un fade) ══════════ */}
      {/* FRONTERA A @ .162 · MATCH-SHAPE — la hace el propio aro (`SealJaw morph`): sin overlay. */}
      {/* FRONTERA B @ .352 · ZOOM-THROUGH — la hace `zt` sobre los grupos de los actos 1-2. */}
      {/* FRONTERA C @ .552 · WIPE POR MATERIA — el polvo de la losa que levanta el salto… */}
      <SeamWipeMatter at={K.fC - 8} dur={24} tint={V.concrete} />
      {/* …y la ESTELA de la aguja, que es la que barre de verdad */}
      {f > K.fC - 12 && f < K.fC + 22 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-30%", height: "160%",
            left: `${lerp(-40, 128, clamp01((f - (K.fC - 12)) / 30)).toFixed(1)}%`,
            width: 220,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.5)} 40%, ${rgba(V.white, 0.72)} 52%, ${rgba(V.volt, 0.4)} 64%, rgba(0,0,0,0) 100%)`,
            transform: "rotate(6deg)", mixBlendMode: "screen",
          }} />
        </AbsoluteFill>
      )}
      {/* FRONTERA D @ .788 · OCLUSIÓN — el CUERPO DE ALUMINIO del inversor cruza y tapa.
          ⛔ el color es el del ALUMINIO (`V.blade`), NUNCA el del fondo. */}
      <SeamOcclude at={K.fD - 6} dur={15} color={V.blade} angle={-7} />
      {/* golpes secos de cifra (accesorios, NO fronteras) */}
      <SeamFlash at={K.pico} color={V.volt} dur={7} />
      <SeamFlash at={K.muere} color={V.danger} dur={5} />
      <SeamFlash at={K.triple} color={V.volt} dur={5} />

      {/* ══════════════ TIPOGRAFÍA — UNA idea por acto, ≤7 palabras, cama oscura ═════════════ */}
      {t1.on && (
        <div style={t1.style}>
          <Bed pad={28} w={880}>
            <Kick>RONDA 2 · LA HELADERA</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>QUIETA. DOMÉSTICA. <Em>INOCENTE</Em>.</Head>
          </Bed>
        </div>
      )}
      {t2.on && (
        <div style={t2.style}>
          <Bed pad={28} w={900}>
            <Kick>ANDANDO, TODO EL DÍA</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>CUARENTA Y SEIS <Em>VATIOS</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={31}>Menos que una lámpara vieja de filamento.</Body>
          </Bed>
        </div>
      )}
      {t3.on && (
        <div style={t3.style}>
          <Bed pad={28} w={920}>
            <Kick color={V.danger}>EL COMPRESOR ARRANCA</Kick>
            <div style={{ height: 12 }} />
            <Head size={82}>PICOS DE <Em color={V.danger}>NOVECIENTOS VATIOS</Em></Head>
          </Bed>
        </div>
      )}
      {t4.on && (
        <div style={t4.style}>
          <Bed pad={28} w={940}>
            <Kick color={V.danger}>EL ASESINO SILENCIOSO</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>NO ES DEFECTUOSO: ES <Em color={V.amber}>JUSTO</Em></Head>
          </Bed>
        </div>
      )}
      {t5.on && (
        <div style={t5.style}>
          <Bed pad={30} w={960}>
            <Kick>LA REGLA QUE NO ME FALLÓ NUNCA</Kick>
            <div style={{ height: 12 }} />
            <Head size={80}>EL <Em>TRIPLE</Em> DE LA POTENCIA</Head>
          </Bed>
        </div>
      )}

      {/* ── viñeta VIVA: el plano nunca se cierra, sigue respirando hasta el corte ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.2 + 0.05 * Math.sin(f / 89) + heat * 0.1).toFixed(3)}) 100%)`,
      }} />
      {/* ── aberración cromática sutil en el pico (nunca un blur full-screen) ── */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [K.pico - 8, K.pico + 10, K.veces, K.fC, K.muere - 6, K.muere + 20, K.fD],
          [0, 0.17, 0.1, 0, 0, 0.12, 0.04], [EZ.snap, EZ.soft, EZ.glide, EZ.lin, EZ.push, EZ.soft]),
        background: `linear-gradient(94deg, ${rgba(V.volt, 0.22)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(V.danger, 0.2)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
