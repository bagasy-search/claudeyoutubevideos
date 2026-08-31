// MovEstacion.tsx — S6 · UN MOVIMIENTO CONTINUO de 60 s (1800 frames @30fps)
// «Cuatrocientos treinta y uno de seiscientos, y nueve vatios que se van sin hacer nada.»
//
// LA TARDE YA ENTRÓ AL GARAJE. Heredamos de `MovTreintaDias` el filamento de la lámpara encendiéndose
// en el banco, a la altura del banco, en ÁMBAR — y salimos, sesenta segundos después, en el MACRO DEL
// DISPLAY de la estación marcando el consumo en vacío, también en ámbar, con la cámara ya cerrada,
// que es exactamente donde arranca `MovPico`.
//
// UNA sola atmósfera (`VoltAtmos`) montada arriba de todo y jamás remontada · UNA sola cámara
// `gcam(g, …)` acumulativa que ningún acto reinicia · la luz EVOLUCIONA ámbar → voltio (cuando entra
// la medición) → ámbar (cuando entramos en el calor de la máquina) · y hay MATERIA REAL cruzando cada
// una de las cuatro fronteras.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER cám z≈+18, altura del banco, deriva viva heredada · luz ÁMBAR plena (la tarde
//                      por el portón, key a la izquierda, contra NARANJA abajo-derecha) · materia:
//                      EL FILAMENTO ENCENDIDO de la lámpara, a un palmo del lente.
//                EXIT  cám z≈+100 y paneando a la DERECHA a velocidad alta, siguiendo la goma del
//                      cable · luz ámbar sin cambio (la costura es de cámara, no de luz) · materia:
//                      LA TARJETA DE LA LÁMPARA, que no se va: encoge y viaja al ángulo superior
//                      izquierdo y sigue encendida todo el acto 2 (la carga nunca se apaga).
//
// acto 2 · f360  ENTER cám z≈+100 con el MISMO vector de paneo (la inercia no se corta en la
//                      frontera: sigue hasta f430) · luz ámbar, key subiendo · materia: la lámpara
//                      chica arriba a la izquierda + EL CABLE que la une con la estación.
//                EXIT  cám z≈+100, empezando a retroceder · luz ámbar entrando en voltio · materia:
//                      LA ESFERA DEL CRONÓMETRO, que se acuesta y aterriza como la barra naranja.
//
// acto 3 · f756  ENTER cám z≈-80 retrocedida a plano general (la MISMA tarjeta del acto 2, que
//                      crece hasta ser el decorado: 1240×700 → 1860×1046) · luz VOLTIO (la cifra
//                      medida entra en verde y desde arriba) · materia: la esfera acostada = el
//                      canto superior de la barra NARANJA del `PromiseGap`.
//                EXIT  cám z≈+220 empujando al 63 %/60 % del cuadro · luz voltio volviendo a ámbar ·
//                      materia: LA BANDA DE VACÍO del `PromiseGap` (los 169 Wh que faltan), que se
//                      mete por la ranura y del otro lado ES el calor del inversor.
//
// acto 4 · f1116 ENTER cám z≈+520 saliendo del interior de la ranura (escala 3.4 → 1) · luz ÁMBAR
//                      otra vez, pero desde adentro de la máquina · materia: el negro de la ranura =
//                      el negro de la placa del inversor.
//                EXIT  cám z≈+520 asentada, micro-retroceso · luz ámbar cálida · materia: LA CHAPA
//                      DEL DISIPADOR, que cruza el cuadro y tapa el 100 %.
//
// acto 5 · f1476 ENTER cám z≈+700 cerrándose sobre el display (nace detrás de la chapa) · luz ámbar
//                      con el verde del display · materia: EL DISPLAY DE LA ESTACIÓN, en macro.
//                EXIT  cám z≈+700 cerrada y quieta-viva · luz ÁMBAR · materia: EL DISPLAY EN MACRO
//                      marcando el consumo en vacío  → así arranca `MovPico`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f360  frontera 1→2 : INERCIA — el paneo arranca en f326, la frontera cae en f360 con la cámara a
//                      máxima velocidad y termina de frenar en f430. El decorado cambia detrás
//                      mientras la lámpara y el cronómetro viajan sobre el MISMO vector.
// f756  frontera 2→3 : MORFO — la esfera del cronómetro se acuesta (rotateX 0→84°, 340×340 → 820×16)
//                      y aterriza exactamente sobre el canto de la barra naranja del `PromiseGap`.
// f1108 frontera 3→4 : PORTAL / ZOOM-THROUGH (`zoomThrough`, fx 63 / fy 60) — la cámara entra por la
//                      ranura de ventilación de la estación y sale adentro del inversor.
// f1470 frontera 4→5 : OCLUSIÓN con `V.steel` (la chapa del disipador), dur 14 → cobertura total en
//                      f1477. ⛔ nunca con el color del fondo.
// (ninguna se repite en fronteras seguidas · ninguna es un fade)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Easing } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 360;
const F_A3 = 756;
const F_A4 = 1116;
const F_A5 = 1476;
const ACT_IN = [0, F_A2, F_A3, F_A4, F_A5];   // arranque exacto de cada acto (red de seguridad)
const SEAM_INERCIA = 326;   // arranque del paneo que cruza la frontera 1→2
const SEAM_MORFO = 756;     // la esfera aterriza como barra
const SEAM_PORTAL = 1108;   // la cámara entra por la ranura
const SEAM_OCC = 1470;      // la chapa del disipador cruza

// el punto exacto de la ranura de ventilación dentro del cuadro (foco del portal)
const SLOT_X = 63;
const SLOT_Y = 60;

// ── EL HAZ DE LA TARDE — la luz que entra por el portón y NUNCA se va del cuadro ────────────
const HazTarde: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1860, height: 900, marginTop: -450, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, ${rgba(color, 0.12 * power)} 38%, rgba(0,0,0,0) 78%)`,
      clipPath: "polygon(0% 46%, 100% 0%, 100% 100%, 0% 54%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.48 * power)} 0%, ${rgba(color, 0.14 * power)} 34%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── TITULAR — UNA idea de texto por acto, sobre cama oscura, fuera de la perspectiva ────────
// `headFrom` deja que el bloque ya esté en pantalla y que el REMATE llegue en su beat exacto.
const Titular: React.FC<{
  g: number; inF: number; outF: number; headFrom?: number;
  kick: string; head: string; sub?: string; size?: number; kickColor?: string;
}> = ({ g, inF, outF, headFrom, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  const hf = headFrom ?? inF;
  const rev = ez(g, hf, hf + 24);
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1060,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <div style={{
          clipPath: `inset(0 ${((1 - rev) * 100).toFixed(1)}% 0 0)`,
          transform: `translateX(${((1 - rev) * -22).toFixed(1)}px)`,
        }}>
          <Head size={size}>{head}</Head>
        </div>
        {sub ? (
          <div style={{ marginTop: 12, opacity: ez(g, hf + 14, hf + 44) }}><Body size={31}>{sub}</Body></div>
        ) : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovEstacion: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : ACT_IN[Math.min(Math.max(acto, 1), 5) - 1];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`, `PromiseGap`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 18, z1: 190, panX: 60, panY: -34, ry: -6, rx: 1.4, dur: 1740 });
  const zAcc =
    eio(0, 84, seg(g, SEAM_INERCIA, 430)) +        // el empuje del paneo (inercia)
    eio(0, -186, seg(g, 762, 900)) +               // retroceso a plano general para el campo
    eio(0, 300, seg(g, SEAM_PORTAL, 1250)) +       // adentro de la máquina
    eio(0, 182, seg(g, SEAM_OCC, 1720));           // el cierre sobre el display
  const pxAcc =
    eio(0, -196, seg(g, SEAM_INERCIA, 430)) +      // el paneo a la derecha: el mundo corre a la izq.
    eio(0, 74, seg(g, F_A3, 900)) +
    eio(0, -58, seg(g, F_A4, 1300)) +
    eio(0, 30, seg(g, F_A5, 1740));
  const pyAcc =
    eio(0, 30, seg(g, SEAM_INERCIA, 442)) +
    eio(0, -48, seg(g, 762, 906)) +
    eio(0, 38, seg(g, F_A4, 1290)) +
    eio(0, -16, seg(g, F_A5, 1760));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. ámbar → voltio (la medición) → ámbar (el calor de adentro) ─
  const cWarm = light(seg(g, 700, 1020), "amber", "volt");
  const cBack = light(seg(g, 1150, 1470), "volt", "amber");
  const cKey = g < 1150 ? cWarm : cBack;                       // continua: en 1150 las dos dan volt
  const cContra = light(seg(g, 1090, 1520), "orange", "amber"); // el naranja de la promesa se enfría
  const keyFrom = 0.24 + eio(0, 0.34, seg(g, 40, 900)) + eio(0, -0.26, seg(g, 1130, 1560));
  // ⛔ rampa de entrada del ambiente ≤ 15 frames: el ámbar ya está puesto en el frame 0.
  const intensity = 0.74 + eio(0, 0.20, seg(g, 0, 13)) + eio(0, 0.10, seg(g, 900, 1060))
    + eio(0, -0.16, seg(g, 1500, 1780));

  // el haz de la tarde: entra por el portón a la derecha, baja cuando entramos en la máquina
  const flick = 0.96 + Math.sin(g / 41) * 0.03 + rnd(Math.floor(g / 9) * 1.9) * 0.02;
  const hazX = 92 + eio(0, -12, seg(g, SEAM_INERCIA, 470)) + eio(0, 8, seg(g, 780, 960))
    + eio(0, -22, seg(g, F_A4, 1330));
  const hazY = 22 + eio(0, 14, seg(g, 120, 470)) + eio(0, -8, seg(g, 800, 980))
    + eio(0, 36, seg(g, F_A4, 1340));
  const hazA = 168 + eio(0, 10, seg(g, 120, 470)) + eio(0, -16, seg(g, F_A4, 1340));
  const hazP = (0.80 + eio(0, -0.16, seg(g, 700, 1000)) + eio(0, -0.34, seg(g, F_A4, 1300))
    + eio(0, 0.16, seg(g, F_A5, 1700))) * flick;

  // ── ACTO 1 · la lámpara de filamento, a un palmo del lente ────────────────────────────────
  // La tarjeta NO desaparece en la frontera: encoge y viaja arriba a la izquierda (materia que cruza).
  const lampW = Math.round(lerp(1580, 1180, ez(g, 0, 300)) * (1 - 0.638 * ez(g, SEAM_INERCIA, 430)));
  const lampH = Math.round(lampW * 0.5625);
  const lampX = lerp(50, 15.5, ez(g, SEAM_INERCIA, 430)) + eio(0, -40, seg(g, 742, 806));
  const lampY = lerp(47, 20, ez(g, SEAM_INERCIA, 430));
  const lampOn = g < 812;

  // ── ACTO 2/3 · LA MISMA TARJETA: entra como macro del cronómetro y CRECE hasta ser el decorado ─
  // (materia que cruza la frontera 2→3 por ESCALA: lo que era tarjeta se vuelve el fondo)
  const stopIn = ez(g, 330, 436);                       // llega sobre el mismo vector del paneo
  const stopGrow = ez(g, 748, 892);                     // de tarjeta flotante a decorado
  const stopW = Math.round(lerp(1240, 1860, stopGrow));
  const stopH = Math.round(stopW * 0.5625);
  const stopX = lerp(148, 50, stopIn);
  const stopY = lerp(47, 50, stopGrow);
  const stopOn = g >= 322 && g < 1150;

  // ── EL MORFO: la esfera del cronómetro se acuesta y aterriza como la barra naranja ─────────
  const ringP = ez(g, 700, SEAM_MORFO + 6);
  const ringW = Math.round(lerp(342, 820, ringP));
  const ringH = Math.round(lerp(342, 16, ringP));
  const ringY = lerp(45, 31.2, ringP);
  const ringRX = lerp(0, 84, ringP);
  const ringOut = 1 - ez(g, 792, 836);
  const ringOn = g >= 686 && ringOut > 0.01;

  // ── ACTO 3 · el campo firma: 600 prometidos contra lo que salió del enchufe ────────────────
  // El número MEDIDO sigue la voz: 427 (la lámpara) → 435 (el ventilador) → 431 (el promedio).
  const meas427 = lerp(427, 435, ez(g, 975, 1002));
  const meas = lerp(meas427, 431, ez(g, 1046, 1092));
  const gapOn = g >= SEAM_MORFO && g < 1150;

  // ── EL PORTAL: la cámara entra por la ranura de ventilación ───────────────────────────────
  const zt = zoomThrough(g, SEAM_PORTAL, 20, SLOT_X, SLOT_Y);
  const ptFar = (() => {
    const p = clamp01((g - SEAM_PORTAL) / 20);
    if (p <= 0) return "none";
    const e = interpolate(p, [0, 1], [0, 1], { easing: Easing.bezier(0.6, 0, 0.9, 0.4) });
    const s = lerp(1, 2.7, e);
    return `translate(${((50 - SLOT_X) * (s - 1)).toFixed(2)}%, ${((50 - SLOT_Y) * (s - 1)).toFixed(2)}%) scale(${s.toFixed(3)})`;
  })();
  const escAOp = clamp01(zt.opacity);
  const escAOn = g < SEAM_PORTAL + 26;

  // ── ACTO 4 · el interior del inversor: sale del negro de la ranura y se abre ───────────────
  const invOn = g >= SEAM_PORTAL + 2 && g < SEAM_OCC + 12;
  const invScale = lerp(3.4, 1, ez(g, SEAM_PORTAL + 2, 1226));
  const invW = Math.round(lerp(1720, 1660, ez(g, 1240, 1460)));
  const invH = Math.round(invW * 0.5625);

  // ── ACTO 5 · el macro del display: nace detrás de la chapa y se cierra ─────────────────────
  const dispOn = g >= SEAM_OCC + 2;
  const dispW = Math.round(lerp(1180, 1780, ez(g, SEAM_OCC + 2, 1740)));
  const dispH = Math.round(dispW * 0.5625);
  const dispR = Math.round(lerp(16, 4, ez(g, SEAM_OCC + 2, 1700)));

  // la corriente que corre por la goma del cable (estructura gráfica, no un objeto falso)
  const cableOn = g >= 40 && g < 800;
  const cableRev = ez(g, 44, 210);
  const dash = -((g * 5.4) % 1000);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cContra} keyFrom={keyFrom} intensity={intensity} floor={0.58} />

      <Layers cam={cam}>
        {/* P1 · FONDO PROFUNDO — escena B (adentro de la máquina) debajo, escena A (el banco) encima */}
        <Plane z={-680}>
          {g >= SEAM_PORTAL - 8 && (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_est3.jpg" kind="photo" z={0} scale={1.3}
              dim={lerp(0.74, 0.84, ez(g, 1300, 1740))} tint={V.amber}
            />
          )}
          {escAOn && (
            <div style={{ transform: ptFar, transformOrigin: `${SLOT_X}% ${SLOT_Y}%`, opacity: escAOp }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_est1.jpg" kind="photo" z={0} scale={1.26}
                dim={lerp(0.5, 0.76, ez(g, 60, 900))} tint={V.amber}
              />
            </div>
          )}
        </Plane>

        {/* P2 · el haz volumétrico de la tarde entrando por el portón */}
        <Plane z={-430}>
          <HazTarde x={hazX} y={hazY} ang={hazA} power={clamp01(hazP)} color={cKey} />
        </Plane>

        {/* P3 · el banco / el hormigón + LA GOMA DEL CABLE que une la lámpara con la estación */}
        <Plane z={-250}>
          <PadPlane y={79} w={1500} h={330} rx={63} lit={1 - 0.62 * ez(g, 900, 1240)} z={-40} />
          {cableOn && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
              opacity: 0.9 * (1 - ez(g, 744, 800)),
            }}>
              <path
                d="M 560 512 C 880 690, 1140 566, 1418 704 S 1892 838, 2280 782"
                fill="none" stroke={rgba(V.ink2, 0.95)} strokeWidth={17} strokeLinecap="round"
                pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - cableRev)}
              />
              <path
                d="M 560 512 C 880 690, 1140 566, 1418 704 S 1892 838, 2280 782"
                fill="none" stroke={rgba(V.amber, 0.22)} strokeWidth={5} strokeLinecap="round"
                pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - cableRev)}
              />
              {/* la corriente corriendo por adentro: hold VIVO, nunca un cuadro quieto */}
              <path
                d="M 560 512 C 880 690, 1140 566, 1418 704 S 1892 838, 2280 782"
                fill="none" stroke={rgba(V.amber, 0.85)} strokeWidth={4} strokeLinecap="round"
                pathLength={1000} strokeDasharray="46 954" strokeDashoffset={dash}
                style={{ filter: `drop-shadow(0 0 10px ${rgba(V.amber, 0.7)})` }}
              />
            </svg>
          )}
        </Plane>

        {/* P4 · EL MATERIAL REAL — el protagonista de cada acto ── */}
        <Plane z={40}>
          {/* ACTO 1 · la lámpara encendida. NO se va en la frontera: encoge y viaja (materia que cruza) */}
          {lampOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_est1.mp4" kind="video"
              w={lampW} h={lampH} x={lampX} y={lampY} z={0}
              ry={lerp(6, -2, ez(g, 20, 300))} rx={lerp(-2.4, 0, ez(g, 20, 300))}
              radius={Math.round(lerp(18, 12, ez(g, SEAM_INERCIA, 430)))} startFrom={5}
              lit={0.94} litColor={cKey}
              label={g < 300 ? "LÁMPARA DE FILAMENTO · 60 W" : undefined}
              sheenAt={at(84)}
            />
          )}

          {/* ACTOS 2 y 3 · UNA tarjeta: entra como macro del cronómetro y CRECE hasta ser el decorado.
              Sale por el PORTAL: la cámara se mete en su ranura de ventilación. */}
          {stopOn && escAOn && (
            <div style={{ transform: zt.out, transformOrigin: `${SLOT_X}% ${SLOT_Y}%`, opacity: escAOp }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_est2.mp4" kind="video"
                w={stopW} h={stopH} x={stopX} y={stopY} z={0}
                ry={lerp(-7, 0, stopIn) + lerp(0, 2.4, stopGrow)}
                rx={lerp(2, 0, stopGrow)}
                radius={Math.round(lerp(16, 6, stopGrow))} startFrom={6}
                lit={0.92 + 0.08 * stopGrow} litColor={cKey}
                label={g < 760 ? "EL CRONÓMETRO EN MARCHA" : undefined}
                sheenAt={at(452)}
              />
            </div>
          )}

          {/* ACTO 4 · salimos DENTRO de la ranura: el negro de la ranura es la placa del inversor */}
          {invOn && (
            <div style={{
              transform: `scale(${invScale.toFixed(3)})`, transformOrigin: `${SLOT_X}% ${SLOT_Y}%`,
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_est3.mp4" kind="video"
                w={invW} h={invH} x={50} y={50} z={0}
                ry={lerp(4, -1.6, ez(g, 1130, 1400))} radius={8} startFrom={4}
                lit={0.96} litColor={cKey}
                label={g > 1210 && g < 1420 ? "DISIPADOR Y BOBINA · EL PRECIO DE TRANSFORMAR" : undefined}
                sheenAt={at(1196)}
              />
            </div>
          )}

          {/* ACTO 5 · el macro del display: nace DETRÁS de la chapa y se cierra hasta el handoff */}
          {dispOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_est4.mp4" kind="video"
              w={dispW} h={dispH} x={50} y={50} z={0}
              ry={lerp(-3.4, 0, ez(g, SEAM_OCC, 1660))} radius={dispR} startFrom={7}
              lit={0.98} litColor={cKey}
              label={g > 1540 && g < 1700 ? "SIN NADA ENCHUFADO" : undefined}
              sheenAt={at(1520)}
            />
          )}
        </Plane>

        {/* P5 · LOS GRÁFICOS Y LAS CIFRAS — siempre SOBRE material real, nunca sobre fondo plano ── */}
        <Plane z={120}>
          {/* ACTO 1 · el par que abre el video: 600 Wh en NARANJA (lo que promete la caja, entra
              desde abajo-derecha) y 60 W en VERDE (la carga conocida, entra desde arriba-izquierda) */}
          {g >= 44 && g < 336 && (
            <Readout value="600" unit="Wh" label="LO QUE DICE LA CAJA" at={at(44)}
              x={77} y={70} size={144} color={V.orange} />
          )}
          {g >= 150 && g < 336 && (
            <Readout value="60" unit="W" label="CARGA CONOCIDA Y CONSTANTE" at={at(150)}
              x={24} y={22} size={132} color={V.volt} />
          )}

          {/* ACTO 2 · la duración medida. Nace grande junto al cronómetro y VIAJA al ángulo
              superior izquierdo, donde sigue viva durante todo el acto 3. */}
          {g >= 700 && g < 1104 && (
            <Readout
              value="7 h 08" label="HASTA QUE SE APAGÓ SOLA" at={at(700)}
              x={lerp(31, 17, ez(g, 762, 872))}
              y={lerp(23, 15, ez(g, 762, 872))}
              size={Math.round(lerp(146, 82, ez(g, 762, 872)))}
              color={V.volt}
            />
          )}

          {/* EL MORFO · la esfera del cronómetro acostándose hasta ser el canto de la barra naranja */}
          {ringOn && (
            <div style={{
              position: "absolute", left: "50%", top: `${ringY.toFixed(2)}%`,
              width: ringW, height: ringH, marginLeft: -ringW / 2, marginTop: -ringH / 2,
              borderRadius: ringP > 0.85 ? 3 : "50%",
              border: `${Math.round(lerp(7, 3, ringP))}px solid ${rgba(ringP > 0.55 ? V.orange : V.amber, 0.9 * ringOut)}`,
              boxShadow: `0 0 ${Math.round(lerp(26, 44, ringP))}px ${rgba(ringP > 0.55 ? V.orange : V.amber, 0.42 * ringOut)}`,
              transform: `rotateX(${ringRX.toFixed(2)}deg)`,
              transformStyle: "preserve-3d",
            }} />
          )}

          {/* ACTO 3 · EL CAMPO FIRMA. La <Sequence> interna le devuelve su reloj propio para que la
              barra CREZCA acá y no aparezca ya hecha (el resto del movimiento sigue en UNA Sequence). */}
          {gapOn && (
            <Sequence from={Math.round(at(SEAM_MORFO))} layout="none">
              <div style={{ opacity: escAOp, transform: zt.out, transformOrigin: `${SLOT_X}% ${SLOT_Y}%` }}>
                <PromiseGap
                  promise={600} measured={meas} unit="Wh" slats={26}
                  x={50} y={46} w={820} h={320} on={1} nums
                  label="LA CAJA DICE · EL ENCHUFE DA"
                />
              </div>
            </Sequence>
          )}

          {/* la RANURA DE VENTILACIÓN marcada como llamada gráfica: por ahí entra la cámara */}
          {g >= 1040 && g < SEAM_PORTAL + 14 && (
            <div style={{
              position: "absolute", left: `${SLOT_X}%`, top: `${SLOT_Y}%`,
              width: 214, height: 78, marginLeft: -107, marginTop: -39,
              border: `2px solid ${rgba(V.volt, 0.72 * ez(g, 1040, 1068))}`, borderRadius: 6,
              boxShadow: `0 0 ${Math.round(18 + 16 * (0.5 + 0.5 * Math.sin(g / 9)))}px ${rgba(V.volt, 0.3)}`,
              transform: `scale(${lerp(1.16, 1, ez(g, 1040, 1080)).toFixed(3)})`,
              opacity: escAOp,
            }}>
              <div style={{
                position: "absolute", left: -1, top: -1, width: 26, height: 26,
                borderLeft: `4px solid ${V.volt}`, borderTop: `4px solid ${V.volt}`,
              }} />
              <div style={{
                position: "absolute", right: -1, bottom: -1, width: 26, height: 26,
                borderRight: `4px solid ${V.volt}`, borderBottom: `4px solid ${V.volt}`,
              }} />
            </div>
          )}

          {/* ACTO 4 · la BANDA DE VACÍO del campo, ya cruzada al otro lado: los 169 Wh son el calor */}
          {g >= 1332 && g < SEAM_OCC + 2 && (
            <>
              <div style={{
                position: "absolute", left: "74%", top: "60%", width: 330, height: 128,
                marginLeft: -165, marginTop: -64, borderRadius: 4,
                background: `repeating-linear-gradient(-58deg, ${rgba(V.orange, 0.14 + 0.10 * (0.5 + 0.5 * Math.sin(g / 21)))} 0 7px, transparent 7px 17px)`,
                borderTop: `2px solid ${rgba(V.orange, 0.6)}`,
                borderBottom: `1px solid ${rgba(V.volt, 0.42)}`,
                opacity: ez(g, 1332, 1366),
              }} />
              <Readout value="169" unit="Wh" label="LOS QUE NO LLEGAN AL ENCHUFE" at={at(1380)}
                x={74} y={49} size={128} color={V.orange} />
              <Readout value="72" unit="%" label="DE LO PROMETIDO" at={at(1340)}
                x={23} y={23} size={122} color={V.volt} />
            </>
          )}

          {/* ACTO 5 · la cifra del vacío, sobre el display real */}
          {g >= 1556 && (
            <Readout value="9" unit="W" label="LA ESTACIÓN, SIN NADA ENCHUFADO" at={at(1556)}
              x={50} y={22} size={168} color={V.volt} />
          )}

          {/* ÍCONOS PNG SIN FONDO — un solo objeto por acto, suman capa sin robar la atención */}
          {g >= 96 && g < 330 && (
            <div style={{ opacity: ez(g, 96, 132) * (1 - ez(g, 300, 330)) }}>
              <IconPng src="img/cmetemu/cmet_ic_lampara.png" x={24} y={36} size={82} z={0} glow={V.ink0} />
            </div>
          )}
          {g >= 470 && g < 744 && (
            <div style={{ opacity: ez(g, 470, 506) * (1 - ez(g, 716, 744)) }}>
              <IconPng src="img/cmetemu/cmet_ic_cronometro.png" x={84} y={22} size={90} z={0} glow={V.ink0} />
            </div>
          )}
          {g >= 880 && g < 1096 && (
            <div style={{ opacity: ez(g, 880, 916) * (1 - ez(g, 1068, 1096)) * escAOp }}>
              <IconPng src="img/cmetemu/cmet_ic_bateria.png" x={16} y={68} size={88} z={0} glow={V.ink0} />
            </div>
          )}
          {g >= 1200 && g < 1462 && (
            <div style={{ opacity: ez(g, 1200, 1236) * (1 - ez(g, 1434, 1462)) }}>
              <IconPng src="img/cmetemu/cmet_ic_termometro.png" x={16} y={44} size={86} z={0} glow={V.ink0} />
            </div>
          )}
          {g >= 1620 && (
            <div style={{ opacity: ez(g, 1620, 1656) }}>
              <IconPng src="img/cmetemu/cmet_ic_rayo.png" x={84} y={22} size={82} z={0} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* P6 · PRIMER PLANO — polvo del taller en el haz; adentro de la máquina sube como calor ── */}
        <Plane z={300}>
          {Array.from({ length: 18 }, (_, i) => {
            const calor = ez(g, F_A4, 1230);
            const sp = (0.35 + rnd(i * 4.7) * 1.0) * (1 + calor * 1.6);
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 21) % 132 + 132) % 132 - 14;
            const s = 2 + rnd(i * 2.9) * 3.2;
            const wob = Math.sin(g / (17 + i) + i) * (1.4 + calor * 3.2);
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${(7 + rnd(i * 6.1) * 86 + wob).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(calor > 0.4 ? V.amber : cKey, (0.09 + rnd(i * 3.7) * 0.2) * clamp01(hazP + calor * 0.5)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(calor > 0.4 ? V.amber : cKey, 0.2 * clamp01(hazP + calor * 0.4))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURA 4→5 · OCLUSIÓN con la CHAPA DEL DISIPADOR (⛔ nunca el color del fondo) ── */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.steel} angle={10} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={58} outF={302} headFrom={128}
          kick="LA PRUEBA DE DESCARGA" head="UNA LÁMPARA DE SESENTA"
          sub="Una carga conocida que no cambia nunca." kickColor={V.amber} />
        <Titular g={g} inF={402} outF={740} headFrom={664}
          kick="Y ME SENTÉ CON EL CRONÓMETRO" head="SIETE HORAS Y OCHO MINUTOS"
          sub="Hasta que la estación se apagó sola." kickColor={V.amber} />
        <Titular g={g} inF={806} outF={1092} headFrom={1030} size={56}
          kick="LO QUE PROMETE · LO QUE MIDE" head="CUATROCIENTOS TREINTA Y UNO DE SEISCIENTOS"
          sub="Con el ventilador dio 435. Promedio 431." />
        <Titular g={g} inF={1168} outF={1452} headFrom={1300}
          kick="ADENTRO DE LA ESTACIÓN" head="TRANSFORMAR CUESTA"
          sub="El calor que sientes son vatios que ya pagaste." kickColor={V.amber} />
        <Titular g={g} inF={1520} outF={1786} headFrom={1596} size={64}
          kick="NADA ENCHUFADO" head="NUEVE VATIOS SIN HACER NADA"
          sub="La estación se come a sí misma mientras espera." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
