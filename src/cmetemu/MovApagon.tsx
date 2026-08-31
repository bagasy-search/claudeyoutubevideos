// MovApagon.tsx — S9 · UN MOVIMIENTO CONTINUO de 55 s (1650 frames @30fps)
// «Este kit no es un ahorro. Es un seguro. Y encima te hace un poquito de luz gratis todos los días.»
//
// EL REFRAME DEL VIDEO ENTERO, y el único tramo cálido y humano: la noche del apagón. Empieza en la
// factura cenital que deja `MovCuenta` (torch), sale a la cuadra a oscuras, entra por la ventana con
// vela a la cocina, se mete adentro del refrigerador, vuelve a la casa con dos lámparas encendidas y
// termina en el patio al amanecer con el panel al sol (blanco), que es donde arranca `MovControlador`.
//
// ⚠️ TRAMO NOCTURNO: la noche NO se hace bajando el brillo general (eso dispara el detector de pantalla
// negra a luma <25/255). Se hace con FUENTES DE LUZ CONCRETAS dentro del cuadro — la llama de la vela,
// la luz interior del refrigerador, el display de la estación, el filamento de la lámpara, el reflejo
// en los azulejos — cada una con su charco (`Pool`, mixBlendMode screen) y su parpadeo. Además hay un
// `nightLift` permanente (lavado cálido radial en screen) que le pone PISO a la luminancia media, y las
// tarjetas de material real ocupan ~70 % del cuadro con `lit` ≥ 0,88 en todos los actos.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈-40, rotateX +24° (CENITAL CERRADA, heredada de `MovCuenta`), pan 0 ·
//                       luz TORCH baja, key abajo-izquierda (la linterna sobre la mesa) ·
//                       materia: EL PAPEL DE LA FACTURA cenital, que ocupa el cuadro entero.
//                EXIT   cám z≈+70, rotateX 0 (ya a la altura de la vereda), pan -0/-50 · luz torch,
//                       una sola fuente: LA VENTANA CON VELA al 63 %/41 % · materia: LA LLAMA DE LA
//                       VELA en esa ventana (entramos DENTRO de ella).
//
// acto 2 · f330  ENTER  cám z≈+70 saliendo del interior de la ventana (escala 3.1 → 1, origen 63/41) ·
//                       luz torch: la MISMA llama, ahora sobre la mesada al 18 %/26 % · materia: LA
//                       LLAMA DE LA VELA, que cruzó el portal y ahora ilumina la cocina.
//                EXIT   cám z≈+140, pan -60 · luz: la llama baja y sube el DISPLAY DE LA ESTACIÓN
//                       (rectángulo cálido-verde al 44 %/63 %) · materia: ESE RECTÁNGULO DE LUZ.
//
// acto 3 · f693  ENTER  cám z≈+140 empujando a +210 (la misma inercia del 2) · luz: el rectángulo de
//                       la estación YA ES la luz interior del refrigerador · materia: EL RECTÁNGULO
//                       DE LUZ, que crece de 130×50 a 1500×845 y se vuelve la puerta abierta.
//                EXIT   cám z≈+210, pan -60, py +30 · luz: refrigerador pleno (torch), ámbar del
//                       dinero abajo a la derecha · materia: LA GOMA NEGRA DE LA PUERTA (`V.ink2`).
//
// acto 4 · f1023 ENTER  cám z≈+170 (la oclusión de la goma tapó el 100 % en f1020) · luz: la rendija
//                       del refrigerador se cerró y REABRIÓ como el FILAMENTO de la lámpara del banco ·
//                       materia: EL FILAMENTO ENCENDIDO + el charco de luz en el piso.
//                EXIT   cám z≈+170 empezando a abrir, pan viajando a +240 (vector vivo, sin frenar) ·
//                       luz: dos lámparas cálidas adentro y, por LA VENTANA (360×202 al 88 %/38 %),
//                       la PRIMERA LUZ del día — el azul se levanta como una persiana entre f1238 y
//                       f1326, ANTES de la frontera: por eso la cámara se va para allá ·
//                       materia: EL RECTÁNGULO DE LA VENTANA, que NO se mueve con el paneo.
//
// acto 5 · f1353 ENTER  cám z≈+170 → -130 abriendo, pan +240 (heredado, la misma inercia) · luz: la
//                       mañana ya entra por la ventana y el resto de la casa se fue por la izquierda ·
//                       materia: EL RECTÁNGULO DE LA VENTANA, que crece de 360×202 a 1600×900 (16:9
//                       siempre) y ES el patio al amanecer.
//                EXIT   cám z≈-130 asentada, ENCUADRE AMPLIO, rotateX +3 · luz TORCH → BLANCO pleno,
//                       floor bajo, sol arriba a la derecha · materia: EL PATIO AL AMANECER con el
//                       panel al sol  → así arranca `MovControlador`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f312   frontera 1→2 : PORTAL / ZOOM-THROUGH (`zoomThrough`, dur 24, fx 63 / fy 41) — la cámara entra
//                        por la ventana con vela y sale adentro de la cocina. Lo pide la ficha.
// f675   frontera 2→3 : MORFO — el rectángulo de luz del display de la estación (130×50 al 44/63) se
//                        estira hasta 1500×845 al 50/47 y ES la luz interior del refrigerador; la
//                        `MediaCard` del refrigerador nace CON esa misma geometría, así que la luz se
//                        convierte en la imagen sin un solo cuadro de fundido. Completa en f752.
// f1011  frontera 3→4 : OCLUSIÓN con `V.ink2` (LA GOMA DE LA PUERTA del refrigerador cerrando),
//                        dur 18, cobertura total ≈ f1020. Materia oscura → el Stage la lleva a
//                        luminancia media, no hace fundido a negro.
// f1335  frontera 4→5 : INERCIA — la cámara NO frena: sigue su paneo a la derecha (+240 px) y todo el
//                        decorado de la casa se va por la izquierda (-2100 px), mientras EL MARCO DE
//                        LA VENTANA se queda clavado y crece hasta ser el cuadro entero (f1478).
//                        El amanecer YA pasó adentro del marco (f1238-1326), así que en la frontera
//                        no queda nada que fundir: es puro movimiento. Sin oclusión, sin flash.
// (PORTAL → MORFO → OCLUSIÓN → INERCIA: ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los de la ficha)
const F_A2 = 330;
const F_A3 = 693;
const F_A4 = 1023;
const F_A5 = 1353;
const SEAM_PORTAL = 312;   // 1→2 · zoom-through por la ventana
const SEAM_MORFO = 675;    // 2→3 · la luz de la estación se vuelve la del refrigerador
const SEAM_OCC = 1011;     // 3→4 · la goma de la puerta tapa el 100 %
const SEAM_INER = 1335;    // 4→5 · la cámara sigue su vector y amanece

// el punto exacto de la ventana con vela (destino del portal y origen del acto 2)
const WIN_X = 63;
const WIN_Y = 41;

// ── UNA FUENTE DE LUZ CONCRETA (así se lee la noche, no bajando el brillo) ──────────────────
const Pool: React.FC<{ x: number; y: number; r: number; color: string; power: number }> = ({
  x, y, r, color, power,
}) => {
  const p = clamp01(power);
  if (p <= 0.004) return null;
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.60 * p)} 0%, ${rgba(color, 0.26 * p)} 24%, ${rgba(color, 0.09 * p)} 50%, rgba(0,0,0,0) 74%)`,
      mixBlendMode: "screen", pointerEvents: "none",
    }} />
  );
};

// ── LA LLAMA DE LA VELA — la materia que cruza la frontera 1→2 ──────────────────────────────
// Vive en la ventana de la cuadra (acto 1) y sale del otro lado, sobre la mesada (acto 2). Es la
// MISMA llama: mismo tamaño relativo, mismo parpadeo, misma temperatura.
const Llama: React.FC<{ x: number; y: number; s: number; power: number; color: string; flick: number }> = ({
  x, y, s, power, color, flick,
}) => {
  const p = clamp01(power);
  if (p <= 0.004) return null;
  const h = s * (1.9 + flick * 0.22);
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: s, height: h, marginLeft: -s / 2, marginTop: -h * 0.72,
      transform: `rotate(${(flick * 5 - 2.5).toFixed(2)}deg)`, transformOrigin: "50% 100%",
      borderRadius: "50% 50% 46% 46% / 62% 62% 38% 38%",
      background: `radial-gradient(60% 72% at 50% 74%, ${rgba(V.white, 0.95 * p)} 0%, ${rgba(color, 0.92 * p)} 34%, ${rgba(V.amber, 0.5 * p)} 68%, rgba(0,0,0,0) 100%)`,
      boxShadow: `0 0 ${Math.round(38 + flick * 18)}px ${rgba(color, 0.7 * p)}`,
      mixBlendMode: "screen", pointerEvents: "none",
    }} />
  );
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 62/66) ────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.torch }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1040,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovApagon: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 330);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -40, z1: 210, panX: 70, panY: -60, ry: 7, rx: -1.4, dur: 1520 });
  // entra CENITAL CERRADA (hereda de MovCuenta) y se endereza a la altura de la vereda
  const rxIn = lerp(24, 0, ez(g, 6, 148)) + eio(0, 3, seg(g, 1420, 1620));
  const zAcc =
    eio(0, 92, seg(g, 304, 356)) +          // el empujón del portal
    eio(0, 74, seg(g, SEAM_MORFO - 4, 764)) + // sigue entrando al refrigerador
    eio(0, -44, seg(g, 1006, 1086)) +       // la puerta cierra: retrocede un poco
    eio(0, -318, seg(g, SEAM_INER, 1584));  // ABRE al patio: encuadre amplio de salida
  const pxAcc =
    eio(0, -62, seg(g, 596, 706)) +
    eio(0, 246, seg(g, SEAM_INER, 1476)) +  // el paneo que NO frena en la frontera
    eio(0, -34, seg(g, 1480, 1620));
  const pyAcc =
    eio(0, -54, seg(g, 18, 150)) +          // la cámara se levanta de la mesa a la calle
    eio(0, 32, seg(g, 748, 860)) +
    eio(0, -38, seg(g, 1400, 1600));
  const cam =
    `${base.transform} rotateX(${rxIn.toFixed(2)}deg) ` +
    `translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. torch (la vela / el refrigerador) → white (la mañana) ────
  const cKey = light(seg(g, 1240, 1620), "torch", "white");
  const cAmb = light(seg(g, 1180, 1600), "amber", "sky");
  const keyFrom =
    0.30 + eio(0, 0.16, seg(g, 20, 300)) + eio(0, -0.14, seg(g, 340, 700))
    + eio(0, 0.30, seg(g, 1020, 1240)) + eio(0, 0.12, seg(g, SEAM_INER, 1560));
  const intensity =
    0.62 + eio(0, 0.12, seg(g, 0, 90)) + eio(0, -0.06, seg(g, 980, 1060))
    + eio(0, 0.40, seg(g, 1320, 1596));
  const atmFloor = lerp(0.60, 0.28, ez(g, 1330, 1600));
  // parpadeo determinista compartido por TODAS las fuentes (una sola noche, un solo aire)
  const flick = 0.86 + 0.14 * rnd(Math.floor(g / 4) * 1.7) + Math.sin(g / 9) * 0.03;

  // ── ACTO 1 · la factura cenital, la cuadra a oscuras, la ventana con vela ──────────────────
  const papelP = ez(g, 10, 126);                       // la factura se va CAYENDO, no en fundido
  const zt = zoomThrough(g, SEAM_PORTAL, 24, WIN_X, WIN_Y);
  const a1On = g < SEAM_PORTAL + 26;
  const a1W = Math.round(lerp(1420, 1600, ez(g, 30, 300)));
  const a1H = Math.round(a1W * 0.5625);
  const winPow = (0.42 + 0.58 * ez(g, 40, 190)) * flick;
  // las barras de la noche: 4 h 30 sin luz · 7 h 30 de estación (la verde MÁS LARGA que la naranja)
  const barP = ez(g, 236, 300);
  const barOut = 1 - ez(g, 302, 322);

  // ── ACTO 2 · la cocina: la estación en el piso, el cable del refrigerador ─────────────────
  const a2On = g >= F_A2 - 10 && g < 812;
  const a2Scale = lerp(3.1, 1, ez(g, F_A2 - 8, 400));
  const a2W = Math.round(lerp(1500, 1180, ez(g, 600, 700)));
  const a2H = Math.round(a2W * 0.5625);
  const a2Y = lerp(48, 52, ez(g, 600, 700));
  const a2Op = 1 - ez(g, 744, 800);                    // queda TAPADA por el refrigerador que crece
  const llamaPow = (0.5 + 0.5 * ez(g, F_A2, 380)) * (1 - ez(g, 600, 690)) * flick;
  // LA LLAMA VIAJA: sale del portal donde estaba la ventana y se posa en la mesada. Misma llama.
  const llX = lerp(WIN_X, 18, ez(g, 336, 452));
  const llY = lerp(WIN_Y + 1.4, 27.5, ez(g, 336, 452));
  const llS = lerp(20, 27, ez(g, 336, 452));

  // ── MORFO 2→3 · el rectángulo de luz del display SE VUELVE la puerta del refrigerador ─────
  const luzOn = ez(g, 592, 632);                       // el display de la estación se enciende
  const mM = ez(g, SEAM_MORFO, 752);                   // el morfo propiamente dicho
  const luzW = Math.round(lerp(130, 1500, mM));
  const luzH = Math.round(lerp(50, 845, mM));
  const luzX = lerp(44, 50, mM);
  const luzY = lerp(63, 47, mM);
  const luzColor = light(mM, "volt", "torch");

  // ── ACTO 3 · el interior del refrigerador, la insulina en el estante de arriba ────────────
  const a3On = g >= SEAM_MORFO && g < SEAM_OCC + 14;
  const a3Lit = 0.72 + 0.28 * mM;
  const marcaP = ez(g, 806, 856);                      // el anillo sobre la caja de insulina
  const pulso = 0.5 + 0.5 * Math.sin(g / 13);

  // ── ACTO 4 · dos lámparas encendidas toda la noche, los teléfonos cargando ────────────────
  const a4On = g >= SEAM_OCC + 4 && g < 1492;
  const a4Slide = -2100 * ez(g, SEAM_INER, 1462);      // se va por la izquierda con el paneo
  const a4W = Math.round(lerp(1340, 1460, ez(g, 1030, 1300)));
  const a4H = Math.round(a4W * 0.5625);
  const lamp1 = (0.62 + 0.38 * ez(g, 1030, 1120)) * flick;
  const lamp2 = (0.0 + 1.0 * ez(g, 1090, 1170)) * flick;

  // ── LA VENTANA: la materia que NO se mueve con el paneo (frontera 4→5) ───────────────────
  const venP = ez(g, 1156, 1240);
  const vW = Math.round(lerp(360, 1600, ez(g, SEAM_INER, 1478)));
  const vH = Math.round(vW * 0.5625);                  // 16:9 SIEMPRE: el clip nunca se deforma
  const vX = lerp(88, 50, ez(g, SEAM_INER, 1478));
  const vY = lerp(38, 47, ez(g, SEAM_INER, 1478));
  // AMANECE ADENTRO DEL MARCO, y pasa ANTES de la frontera, con la ventana todavía chica: por eso
  // la cámara se va para allá. Cuando llega la costura de INERCIA ya no queda nada que fundir.
  const nocheEnVentana = 1 - ez(g, 1238, 1326);

  // ── ACTO 5 · el patio al amanecer con el panel al sol ─────────────────────────────────────
  const a5On = g >= 1214;
  const solPow = ez(g, 1392, 1520) * (0.92 + 0.08 * Math.sin(g / 31));
  const nightLift = 1 - ez(g, 1380, 1560);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cAmb} keyFrom={keyFrom} intensity={intensity} floor={atmFloor} />

      <Layers cam={cam}>
        {/* ── P0 · FONDO PROFUNDO: siempre hay imagen real detrás de todo ────────────────── */}
        <Plane z={-680}>
          {g < 360 && (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_apa1.jpg" kind="photo" z={0} scale={1.3}
              dim={lerp(0.58, 0.38, ez(g, 20, 170))} tint={V.torch}
            />
          )}
          {g >= 330 && g < 782 && (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_apa2.jpg" kind="photo" z={0} scale={1.24}
              dim={lerp(0.44, 0.56, ez(g, 560, 760))} tint={V.torch}
            />
          )}
          {g >= 760 && g < SEAM_OCC + 8 && (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_apa3.jpg" kind="photo" z={0} scale={1.2}
              dim={0.5} tint={V.torch}
            />
          )}
          {a4On && (
            <AbsoluteFill style={{ transform: `translateX(${a4Slide.toFixed(0)}px)` }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_apa2.jpg" kind="photo" z={0} scale={1.34}
                dim={0.6} tint={V.amber}
              />
            </AbsoluteFill>
          )}
          {a5On && (
            <AbsoluteFill style={{
              transform: `translateX(${lerp(1980, 0, ez(g, SEAM_INER, 1478)).toFixed(0)}px)`,
            }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_apa4.jpg" kind="photo" z={0} scale={1.22}
                dim={lerp(0.46, 0.26, ez(g, 1400, 1600))} tint={V.white}
              />
            </AbsoluteFill>
          )}
        </Plane>

        {/* ── P1 · LA LUZ DE AMBIENTE PROFUNDA (las fuentes duras viven pegadas a su material) ─ */}
        <Plane z={-470}>
          {/* acto 4 · los charcos de las dos lámparas sobre el piso de la casa */}
          {a4On && (
            <AbsoluteFill style={{ transform: `translateX(${(a4Slide * 0.72).toFixed(0)}px)` }}>
              <Pool x={44} y={86} r={420} color={V.torch} power={lamp1 * 0.3} />
              <Pool x={72} y={80} r={330} color={V.amber} power={lamp2 * 0.22} />
            </AbsoluteFill>
          )}

          {/* acto 5 · el sol de las siete de la mañana entrando por la derecha */}
          {a5On && (
            <>
              <Pool x={78} y={20} r={620} color={V.white} power={solPow * 0.5} />
              <Pool x={62} y={58} r={520} color={cKey} power={solPow * 0.24} />
            </>
          )}
        </Plane>

        {/* ── P2 · EL SUELO Y LA ESTRUCTURA DEL LUGAR ─────────────────────────────────────── */}
        <Plane z={-300}>
          {g >= 336 && g < 800 && (
            <PadPlane y={80} w={1460} h={300} rx={64} lit={0.34 + 0.2 * flick} z={-30} />
          )}
          {a4On && (
            <AbsoluteFill style={{ transform: `translateX(${a4Slide.toFixed(0)}px)` }}>
              <PadPlane y={82} w={1520} h={300} rx={64} lit={0.44} z={-30} />
            </AbsoluteFill>
          )}
        </Plane>

        {/* ── P3 · EL MATERIAL REAL: un protagonista por acto ─────────────────────────────── */}
        <Plane z={40}>
          {/* ACTO 1 — LA CUADRA A OSCURAS. Sale por PORTAL, entrando en la ventana con vela. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity), transformOrigin: `${WIN_X}% ${WIN_Y}%`,
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_apa1.mp4" kind="video"
                w={a1W} h={a1H} x={50} y={47} z={0}
                ry={lerp(7, 0.4, ez(g, 30, 240))} rx={lerp(-4, 0, ez(g, 30, 240))}
                radius={16} startFrom={5} lit={0.88 + 0.12 * ez(g, 40, 200)}
                litColor={V.torch} label="TODA LA CUADRA, SIN LUZ" sheenAt={at(120)}
              />
              {/* la foto de Claudio parado en su vereda: el testigo humano del apagón */}
              {g >= 168 && (
                <div style={{ opacity: ez(g, 168, 206) }}>
                  <MediaCard
                    src="img/cmetemu/cmet_h15.jpg" kind="photo"
                    w={396} h={223} x={19} y={72} z={130}
                    ry={9} rot={-1.4} radius={12} lit={0.82} litColor={V.torch}
                    label="21:40" sheenAt={at(190)}
                  />
                </div>
              )}
              {/* LA ÚNICA VENTANA ENCENDIDA DE LA CUADRA — va pegada a la tarjeta (mismo plano,
                  misma perspectiva), así el halo cae exactamente donde entra el portal. */}
              <Pool x={WIN_X} y={WIN_Y} r={300} color={V.torch} power={winPow * 0.6} />
              <Pool x={WIN_X - 1.5} y={68} r={260} color={V.torch} power={winPow * 0.22} />
            </AbsoluteFill>
          )}

          {/* ── LA LLAMA DE LA VELA: la MATERIA que cruza la frontera 1→2 ────────────────────
              En el acto 1 arde en la ventana (y el portal se la lleva por delante); del otro lado
              sigue ardiendo, viaja hasta la mesada de la cocina y ahí se queda. Es la misma llama. */}
          {g < SEAM_PORTAL + 4 && (
            <AbsoluteFill style={{ transform: zt.out, transformOrigin: `${WIN_X}% ${WIN_Y}%` }}>
              <Llama x={WIN_X} y={WIN_Y + 1.4} s={20} power={winPow} color={V.amber} flick={flick} />
            </AbsoluteFill>
          )}
          {g >= SEAM_PORTAL + 4 && g < 700 && (
            <>
              <Pool x={llX} y={llY - 1.5} r={330} color={V.torch} power={llamaPow * 0.62} />
              <Llama x={llX} y={llY} s={llS} power={llamaPow} color={V.amber} flick={flick} />
              {/* el reflejo en los azulejos: la segunda fuente que sostiene la luma de la cocina */}
              <Pool x={llX + 13} y={llY + 18} r={280} color={V.torch} power={llamaPow * 0.26} />
            </>
          )}

          {/* ACTO 2 — LA COCINA: salimos DENTRO de la ventana y ahí está la estación en el piso */}
          {a2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Scale.toFixed(3)})`, transformOrigin: `${WIN_X}% ${WIN_Y}%`,
              opacity: a2Op,
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_apa2.mp4" kind="video"
                w={a2W} h={a2H} x={50} y={a2Y} z={0}
                ry={lerp(-6, 0, ez(g, F_A2, 430))} radius={16} startFrom={7}
                lit={0.9} litColor={V.torch} label="LA ESTACIÓN, ENCHUFADA AL REFRIGERADOR"
                sheenAt={at(392)}
              />
              {/* la foto real de esa noche: Claudio conectando el cable, arriba a la derecha */}
              {g >= 466 && (
                <div style={{ opacity: ez(g, 466, 506) * (1 - ez(g, 648, 690)) }}>
                  <MediaCard
                    src="img/cmetemu/cmet_h16.jpg" kind="photo"
                    w={392} h={220} x={79} y={24} z={140}
                    ry={-9} rot={1.2} radius={12} lit={0.86} litColor={V.torch}
                    label="EL CABLE DEL REFRIGERADOR" sheenAt={at(492)}
                  />
                </div>
              )}
            </AbsoluteFill>
          )}

          {/* ── MORFO 2→3 · el rectángulo de luz. Primero es el display de la estación; después
              ES la luz interior del refrigerador; y la tarjeta NACE con esa misma geometría. ── */}
          {g >= 588 && g < SEAM_OCC + 14 && (
            <div style={{
              position: "absolute", left: `${luzX.toFixed(2)}%`, top: `${luzY.toFixed(2)}%`,
              width: luzW + 26, height: luzH + 26, marginLeft: -(luzW + 26) / 2, marginTop: -(luzH + 26) / 2,
              borderRadius: Math.round(lerp(8, 18, mM)),
              background: rgba(luzColor, 0.16 + 0.5 * luzOn * (1 - mM * 0.6)),
              boxShadow: `0 0 ${Math.round(lerp(70, 190, mM))}px ${rgba(luzColor, 0.5 * luzOn)}, ` +
                `0 0 ${Math.round(lerp(180, 420, mM))}px ${rgba(luzColor, 0.24 * luzOn)}`,
              opacity: luzOn,
            }} />
          )}

          {/* ACTO 3 — EL INTERIOR DEL REFRIGERADOR: la luz se volvió imagen, sin un fundido */}
          {a3On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_apa3.mp4" kind="video"
              w={luzW} h={luzH} x={luzX} y={luzY} z={0}
              ry={lerp(4, 0, mM)} radius={Math.round(lerp(8, 16, mM))} startFrom={6}
              lit={a3Lit} litColor={V.torch} label={mM > 0.85 ? "LO QUE HABÍA ADENTRO" : undefined}
              sheenAt={at(776)}
            />
          )}

          {/* ACTO 4 — DOS LUCES TODA LA NOCHE. Todo el decorado viaja con el paneo. */}
          {a4On && (
            <AbsoluteFill style={{ transform: `translateX(${a4Slide.toFixed(0)}px)` }}>
              <MediaCard
                src="img/cmetemu/cmet_h08.jpg" kind="photo"
                w={a4W} h={a4H} x={44} y={46} z={0}
                ry={lerp(6, -2, ez(g, 1026, 1300))} radius={16}
                lit={0.9} litColor={V.torch} label="LA LÁMPARA DEL BANCO, TODA LA NOCHE"
                sheenAt={at(1064)}
              />
              {/* la estación andando, a OTRA escala y OTRA luz que en el acto 2 */}
              {g >= 1128 && (
                <div style={{ opacity: ez(g, 1128, 1168) }}>
                  <MediaCard
                    src="broll/cmetemu/cmet_mv_apa2.mp4" kind="video"
                    w={356} h={200} x={20} y={74} z={150}
                    ry={11} rot={-1.6} radius={12} startFrom={40}
                    lit={0.84} litColor={V.amber} label="SIGUE ANDANDO" sheenAt={at(1156)}
                  />
                </div>
              )}
              {/* LAS DOS LUCES: los halos van pegados a la foto, en su mismo plano */}
              <Pool x={40} y={40} r={330} color={V.torch} power={lamp1 * 0.6} />
              <Pool x={70} y={47} r={260} color={V.amber} power={lamp2 * 0.46} />
              {/* íconos como objetos de la escena: la lámpara y el enchufe de los teléfonos */}
              {g >= 1054 && (
                <div style={{ opacity: ez(g, 1054, 1092) }}>
                  <IconPng src="img/cmetemu/cmet_ic_lampara.png" x={87} y={66} size={88} z={160} glow={V.ink0} />
                </div>
              )}
              {g >= 1096 && (
                <div style={{ opacity: ez(g, 1096, 1134) }}>
                  <IconPng src="img/cmetemu/cmet_ic_enchufe.png" x={13} y={28} size={80} z={160} glow={V.ink0} />
                </div>
              )}
            </AbsoluteFill>
          )}

          {/* ── LA VENTANA: se queda clavada mientras TODO lo demás se va con el paneo ─────── */}
          {venP > 0.01 && (
            <>
              {/* el marco (estructura) */}
              <div style={{
                position: "absolute", left: `${vX.toFixed(2)}%`, top: `${vY.toFixed(2)}%`,
                width: vW + 30, height: vH + 30, marginLeft: -(vW + 30) / 2, marginTop: -(vH + 30) / 2,
                borderRadius: 10, opacity: venP,
                border: `3px solid ${rgba(V.bone, 0.30)}`,
                boxShadow: `0 0 ${Math.round(60 + vW * 0.16)}px ${rgba(cKey, 0.34 * (1 - nocheEnVentana))}, ` +
                  `inset 0 0 60px ${rgba(V.ink0, 0.6)}`,
              }} />
              {/* ACTO 5 — EL PATIO AL AMANECER, adentro del marco, creciendo hasta el cuadro entero */}
              {a5On && (
                <MediaCard
                  src="broll/cmetemu/cmet_mv_apa4.mp4" kind="video"
                  w={vW} h={vH} x={vX} y={vY} z={0}
                  ry={lerp(-8, 0, ez(g, SEAM_INER, 1470))} radius={8} startFrom={4}
                  lit={0.86 + 0.14 * ez(g, 1380, 1540)} litColor={cKey}
                  label={ez(g, SEAM_INER, 1470) > 0.9 ? "SIETE DE LA MAÑANA, EL PANEL AL SOL" : undefined}
                  sheenAt={at(1466)}
                />
              )}
              {/* LA NOCHE ADENTRO DEL MARCO, que se levanta como una persiana: amanece. Va clipeada
                  al hueco de la ventana (`overflow: hidden`), así el azul nunca invade la escena. */}
              {nocheEnVentana > 0.01 && (
                <div style={{
                  position: "absolute", left: `${vX.toFixed(2)}%`, top: `${vY.toFixed(2)}%`,
                  width: vW, height: vH, marginLeft: -vW / 2, marginTop: -vH / 2, borderRadius: 8,
                  overflow: "hidden", pointerEvents: "none",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                    background: `linear-gradient(6deg, ${rgba("#12203A", 0.5)} 0%, ${rgba("#0E1826", 0.95)} 42%, ${rgba("#0A1220", 0.97)} 100%)`,
                    transform: `translateY(${(-102 * (1 - nocheEnVentana)).toFixed(2)}%)`,
                    boxShadow: `0 14px 40px ${rgba(V.torch, 0.42 * (1 - nocheEnVentana))}`,
                  }} />
                </div>
              )}
              {/* la primera luz que entra por la ventana: es la que motiva el paneo */}
              <Pool x={vX} y={vY} r={Math.round(vW * 0.62)} color={cKey}
                power={(1 - nocheEnVentana) * 0.5 * (0.94 + 0.06 * Math.sin(g / 29))} />
            </>
          )}

          {/* acto 5 · la foto real del patio con Claudio y el panel, ya con el sol afuera */}
          {g >= 1492 && (
            <div style={{ opacity: ez(g, 1492, 1530) }}>
              <MediaCard
                src="img/cmetemu/cmet_h17.jpg" kind="photo"
                w={392} h={220} x={80} y={75} z={150}
                ry={-10} rot={1.1} radius={12} lit={0.94} litColor={V.white}
                label="EL PANEL, AL SOL" sheenAt={at(1520)}
              />
            </div>
          )}
          {g >= 1424 && (
            <div style={{ opacity: ez(g, 1424, 1466) }}>
              <IconPng src="img/cmetemu/cmet_ic_sol.png" x={86} y={17} size={96} z={170} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* ── P4 · LA CAPA GRÁFICA: estructura y cifras, siempre sobre material real ──────── */}
        <Plane z={-60}>
          {/* acto 1 · LAS DOS BARRAS DE LA NOCHE — por una vez, la verde es MÁS LARGA */}
          {barP > 0.01 && barOut > 0.01 && (
            <div style={{
              position: "absolute", right: 76, top: 132, width: 560, opacity: barP * barOut,
            }}>
              <Bed pad={24} w={560}>
                <Kick color={V.orange}>SIN LUZ EN LA CUADRA</Kick>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
                  <div style={{
                    height: 20, width: 300 * barP, borderRadius: 3,
                    background: `linear-gradient(90deg, ${rgba(V.orange, 0.45)} 0%, ${V.orange} 100%)`,
                    boxShadow: `0 0 18px ${rgba(V.orange, 0.5)}`,
                  }} />
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, lineHeight: 0.9,
                    color: V.orange, textShadow: "0 6px 24px rgba(0,0,0,0.9)",
                  }}>4:30</div>
                </div>
                <div style={{ marginTop: 20 }}><Kick color={V.volt}>LA ESTACIÓN ANDUVO</Kick></div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
                  <div style={{
                    height: 26, width: 500 * ez(g, 252, 306), borderRadius: 3,
                    background: `linear-gradient(90deg, ${rgba(V.volt, 0.45)} 0%, ${V.volt} 100%)`,
                    boxShadow: `0 0 24px ${rgba(V.volt, 0.6)}`,
                  }} />
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 68, lineHeight: 0.9,
                    color: V.volt, textShadow: "0 6px 26px rgba(0,0,0,0.92)",
                    opacity: ez(g, 262, 292),
                  }}>7:30</div>
                </div>
              </Bed>
            </div>
          )}

          {/* acto 3 · la MARCA sobre la caja de insulina del estante de arriba */}
          {marcaP > 0.01 && g < SEAM_OCC + 2 && (
            <>
              <div style={{
                position: "absolute", left: "35%", top: "28%",
                width: 168 * (0.94 + 0.06 * pulso), height: 168 * (0.94 + 0.06 * pulso),
                marginLeft: -84, marginTop: -84, borderRadius: "50%",
                border: `3px solid ${rgba(V.volt, 0.42 + 0.42 * pulso)}`,
                boxShadow: `0 0 ${Math.round(22 + 22 * pulso)}px ${rgba(V.volt, 0.34)}, inset 0 0 40px ${rgba(V.volt, 0.12)}`,
                opacity: marcaP,
              }} />
              <div style={{
                position: "absolute", left: "35%", top: "28%", width: 210, height: 3, marginLeft: 78,
                background: `linear-gradient(90deg, ${V.volt} 0%, ${rgba(V.volt, 0.1)} 100%)`,
                transform: `scaleX(${ez(g, 846, 890).toFixed(3)})`, transformOrigin: "0% 50%",
                opacity: marcaP,
              }} />
              <div style={{
                position: "absolute", left: "35%", top: "26.4%", marginLeft: 296,
                opacity: ez(g, 872, 906),
              }}>
                <Kick color={V.volt}>LA INSULINA DE MI VECINA</Kick>
              </div>
            </>
          )}

          {/* las CIFRAS: siempre sobre el material real, nunca sobre fondo plano */}
          {g >= 118 && g < 236 && (
            <Readout value="4 h 30" label="A OSCURAS" at={at(118)}
              x={26} y={23} size={128} color={V.torch} />
          )}
          {g >= 826 && g < SEAM_OCC && (
            <Readout value="150" unit="USD" label="EN COMIDA, ADENTRO" at={at(826)}
              x={76} y={70} size={132} color={V.amber} align="center" />
          )}
          {g >= 1186 && g < 1330 && (
            <Readout value="2" unit="LUCES" label="TODA LA NOCHE" at={at(1186)}
              x={25} y={22} size={140} color={V.torch} />
          )}
          {g >= 1502 && (
            <Readout value="14:00" label="LLENA OTRA VEZ" at={at(1502)}
              x={27} y={23} size={132} color={V.volt} />
          )}
        </Plane>

        {/* ── P5 · PRIMER PLANO: el polvo y las chispas que atraviesan la luz (hold VIVO) ─── */}
        <Plane z={230}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.2;
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 14;
            const s = 2 + rnd(i * 2.9) * 3.6;
            const pw = clamp01(0.35 + 0.4 * flick) * (0.5 + 0.5 * nightLift) + 0.35 * solPow;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.09 + rnd(i * 3.7) * 0.2) * pw),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2 * pw)}`,
              }} />
            );
          })}
        </Plane>

        {/* ── P6 · LA FACTURA CENITAL que viene de `MovCuenta` y se CAE del cuadro ────────── */}
        {papelP < 0.999 && (
          <Plane z={320}>
            <div style={{
              position: "absolute", left: "-16%", top: "-12%", width: "132%", height: "128%",
              transformOrigin: "50% 100%",
              transform: `rotateX(${lerp(4, 78, papelP).toFixed(2)}deg) translateY(${lerp(0, 1010, papelP).toFixed(0)}px)`,
              background: `linear-gradient(172deg, ${rgba(V.paper, 0.97)} 0%, ${rgba(V.paper, 0.9)} 44%, ${rgba(V.concrete, 0.86)} 100%)`,
              boxShadow: `0 40px 130px ${rgba(V.ink0, 0.92)}`,
            }}>
              {/* los renglones de la factura: estructura, no un objeto dibujado */}
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} style={{
                  position: "absolute", left: "16%", top: `${28 + i * 6.4}%`,
                  width: `${(30 + rnd(i * 5.5) * 44).toFixed(1)}%`, height: 9,
                  background: rgba(V.ink0, 0.13 + rnd(i * 2.2) * 0.08), borderRadius: 2,
                }} />
              ))}
              <div style={{
                position: "absolute", right: "17%", top: "22%",
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, color: rgba(V.ink0, 0.5),
              }}>$ 1,21</div>
              <IconPng src="img/cmetemu/cmet_ic_factura.png" x={22} y={16} size={108} z={0} glow={V.concrete} />
            </div>
          </Plane>
        )}
      </Layers>

      {/* ── PISO DE LUMINANCIA: la noche se lee por las fuentes, NUNCA por un cuadro apagado ── */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        background: `radial-gradient(126% 96% at 52% 46%, ${rgba(cKey, 0.09 * (0.35 + 0.65 * nightLift))} 0%, ` +
          `${rgba(cKey, 0.04 * (0.35 + 0.65 * nightLift))} 48%, rgba(0,0,0,0) 82%)`,
      }} />

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f1011 · OCLUSIÓN: LA GOMA NEGRA de la puerta del refrigerador cierra y tapa el 100 % */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.ink2} angle={-7} lit={0.34} />
      {/* la segunda lámpara que se enciende (no es costura: es el evento de luz del acto 4) */}
      <SeamFlash at={at(1104)} color={V.torch} dur={6} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={44} outF={272} kick="LA NOCHE DEL APAGÓN"
          head="CUATRO HORAS Y MEDIA" sub="Toda la cuadra a oscuras. Una sola ventana con vela." />
        <Titular g={g} inF={356} outF={648} kick="LO QUE HICE ESA NOCHE"
          head="LA ENCHUFÉ AL REFRIGERADOR" sub="Y me fui a dormir. Anduvo siete horas y media." />
        <Titular g={g} inF={F_A3 + 23} outF={986} kick="NO PERDÍ NADA" size={58}
          head="NI LA INSULINA DEL ESTANTE DE ARRIBA"
          sub="Ni las cuatro bolsas de carne del congelador." />
        <Titular g={g} inF={F_A4 + 17} outF={1306} kick="MIENTRAS DORMÍA"
          head="DOS LUCES TODA LA NOCHE" sub="Y los teléfonos cargados a la mañana." kickColor={V.amber} />
        <Titular g={g} inF={F_A5 + 29} outF={1508} kick="CON EL PANEL AL SOL"
          head="LLENA OTRA VEZ A LAS DOS" sub="A las dos de la tarde del día siguiente." kickColor={V.volt} />

        {/* EL REFRAME — la espina del video entero, con el candado como objeto */}
        {g >= 1534 && (
          <div style={{
            position: "absolute", left: 62, bottom: 150, maxWidth: 1080,
            opacity: ez(g, 1534, 1566),
            transform: `translateY(${((1 - ez(g, 1534, 1572)) * 26).toFixed(1)}px)`,
          }}>
            <Bed pad={28}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
                <div style={{ position: "relative", width: 58, height: 58 }}>
                  <IconPng src="img/cmetemu/cmet_ic_candado.png" x={50} y={2} size={56} z={0} glow={V.ink0} />
                </div>
                <Kick color={V.volt}>EL REFRAME</Kick>
              </div>
              <Head size={62}>NO ES UN AHORRO. ES UN SEGURO.</Head>
              <div style={{ marginTop: 12 }}>
                <Body size={31}>Y encima te hace un poquito de luz gratis todos los días.</Body>
              </div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
