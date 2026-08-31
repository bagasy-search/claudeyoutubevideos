// MovCuenta.tsx — S9 · UN MOVIMIENTO CONTINUO de 58 s (1740 frames @30fps)
// «Un dólar con veintiuno por mes. Ciento seis meses. La batería dura cinco años.»
//
// LA CUENTA QUE DUELE. No hay celebración acá: es un balde de agua fría dicho con respeto. El
// número chiquito (1,21) tiene que verse PATÉTICAMENTE chico al lado de los 129 que ya pagó, y los
// 106 meses tienen que SENTIRSE largos (por eso el contador tarda seis segundos en subir y por eso
// el calendario suelta hojas durante trece).
//
// Una sola atmósfera (`VoltAtmos`) montada arriba de todo y NUNCA remontada; UNA cámara `gcam(g)`
// que baja del poste de la calle hasta quedar cenital cerrada sobre la factura y nunca vuelve a 0;
// la luz entra en `danger` (la hereda de MovPeligro), se asienta en `torch` y el azul de la noche de
// afuera (`sky`) va cediendo a la lámpara de la cocina (`amber`). Materia que cruza CADA frontera.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER cám z≈-230, rx -6 (MUY ALTA, mirando hacia abajo), inercia heredada de
//                      MovPeligro · luz danger cayendo a torch, contra `sky` (la noche azul de
//                      afuera), intensity .46 · materia: EL POSTE DE LA CALLE AL ANOCHECER.
//                EXIT  cám z≈+10 ya bajada a la altura del patio, pan −104 (la cámara se acostó
//                      sobre el suelo) · luz torch plena, el farol del poste hecho lámpara · materia:
//                      LA CIFRA "7,14" Y LA HOJA DE LA FACTURA (miniatura sobre el hormigón).
//
// acto 2 · f348  ENTER cám z≈+160 empujando dentro de la hoja que acaba de comerse el cuadro · luz
//                      torch + contra ámbar (ya estamos bajo la lámpara de la cocina) · materia: EL
//                      PAPEL DE LA FACTURA, y encima la cifra 7,14 que viajó desde el panel.
//                EXIT  cám z≈+180 · luz torch/ámbar asentada · materia: EL MISMO PAPEL, con el
//                      barrido especular de la lámpara cruzándolo, y las cifras 1,21 y 129 impresas.
//
// acto 3 · f696  ENTER cám z≈+180 entrando en macro sobre el papel (misma hoja, misma luz, misma
//                      escala: la superficie no se corta) · materia: EL PAPEL DE LA FACTURA con la
//                      moneda y el billete encima.
//                EXIT  cám z≈+350 macro cerrado · luz torch, el verde del `PromiseGap` como único
//                      frío · materia: LA CIFRA "106" (queda clavada) + EL PAPEL, que es lo que
//                      cruza por delante en la oclusión.
//
// acto 4 · f1044 ENTER cám z≈+90 retrocediendo (plano de la cocina en penumbra) · luz torch bajando,
//                      contra ámbar bajo · materia: PAPEL → PAPEL (la hoja que tapó el cuadro es la
//                      hoja del calendario) + la cifra "106" en el mismo sitio y tamaño.
//                EXIT  cám z≈+90, pan −96 · luz torch baja · materia: LAS CINCO HOJAS SUELTAS DEL
//                      CALENDARIO, en el aire, ya alineándose.
//
// acto 5 · f1427 ENTER cám z≈+210 volviendo a entrar · luz torch + el volt de las celdas · materia:
//                      LAS CINCO HOJAS, que SON las cinco celdas (mismas tarjetas, mismo material
//                      adentro, geometría morfada) + el calendario hecho carcasa de la estación.
//                EXIT  cám z≈+420, rx +6 (CENITAL CERRADA), pan −38 · luz torch · materia: EL PAPEL
//                      DE LA FACTURA CENITAL, que entra por abajo y se come el cuadro
//                      → así arranca `MovApagon`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f348  frontera 1→2 : ESCALA — la hoja de la factura, que era una MINIATURA apoyada en el hormigón
//                       del patio (f240), crece hasta pasarse del cuadro (f406) y se vuelve EL
//                       DECORADO; al mismo tiempo la cifra grande se hace chica y aterriza impresa
//                       sobre el renglón del consumo. Lo que era miniatura ES el fondo.
// f690  frontera 2→3 : MATERIA — el papel NO se corta: la misma tarjeta, misma w/h/x/y/rotación y
//                       misma luz, con el barrido especular de la lámpara cruzándola (f668→714). La
//                       superficie sigue siendo la hoja; lo que cambia es lo que hay apoyado encima.
// f1044 frontera 3→4 : OCLUSIÓN con `V.paper` (at=1036, dur=16 → cobertura total EXACTA en f1044) —
//                       la hoja de la factura cruza el cuadro por delante. La cifra "106" queda en
//                       el mismo sitio a los dos lados.
// f1427 frontera 4→5 : MORFO — las cinco hojas del calendario (mismas MediaCards, mismo material
//                       adentro) rotan a vertical, se estiran y se alinean: SON las cinco celdas de
//                       litio. El calendario se achata y se vuelve la carcasa abierta de la estación.
// (ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 348;
const F_A3 = 696;
const F_A4 = 1044;
const F_A5 = 1427;
const ESCALA_0 = 300;      // la miniatura empieza a comerse el cuadro
const ESCALA_1 = 420;      // ya es el decorado
const MATERIA = 690;       // el papel sigue; cambia lo que hay encima
const OCC_AT = 1036;       // SeamOcclude dur 16 → cobertura total en f1044
const MORFO_0 = 1427;
const MORFO_1 = 1524;

// LA CUENTA (números reales del guion)
const PAGADO = 129;        // dólares que puso Claudio
const POR_MES = 1.21;      // lo que el kit le saca a la factura
const MESES = 106;         // lo que tarda en pagarse solo
const VIDA_MESES = 60;     // cinco años de batería de litio
const MUERE = (POR_MES * VIDA_MESES) / PAGADO;   // 0,5628 de la barra: ahí se apaga

// geometría del campo firma (`PromiseGap`) — se calcula UNA vez y todo se cuelga de acá
const GAP_X = 74, GAP_Y = 46, GAP_W = 520, GAP_H = 340;

// las cinco hojas del calendario que después son las cinco celdas
const HOJAS = [
  { x0: 23, y0: 31, w0: 300, r0: -13, born: 1096 },
  { x0: 73, y0: 27, w0: 258, r0: 11, born: 1150 },
  { x0: 19, y0: 71, w0: 282, r0: 8, born: 1206 },
  { x0: 77, y0: 67, w0: 318, r0: -9, born: 1262 },
  { x0: 52, y0: 21, w0: 240, r0: 4, born: 1318 },
];
const CELDA_X = [26, 38, 50, 62, 74];

// ── EL FAROL — la fuente cálida que nunca se va del cuadro: primero es el poste de la calle,
//    después es la lámpara colgante de la cocina. Es la MISMA luz, corrida de sitio. ─────────
const Farol: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1680, height: 900, marginTop: -450, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.26 * power)} 0%, ${rgba(color, 0.12 * power)} 36%, rgba(0,0,0,0) 78%)`,
      clipPath: "polygon(0% 48%, 100% 0%, 100% 100%, 0% 52%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 420, height: 420, marginLeft: -210, marginTop: -210, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.58 * power)} 0%, ${rgba(color, 0.15 * power)} 34%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 62 px) ─────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 66, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 880,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={26}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovCuenta: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build; red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 348);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`) miden con useCurrentFrame;
  // `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -230, z1: 210, panX: 76, panY: -132, ry: -7, rx: -6, dur: 1560 });
  const zAcc =
    eio(0, 150, seg(g, ESCALA_0, ESCALA_1)) +          // entra en la hoja que se comió el cuadro
    eio(0, 190, seg(g, 692, 812)) +                     // macro sobre la moneda
    eio(0, -270, seg(g, OCC_AT, 1180)) +                // retrocede a la cocina en penumbra
    eio(0, 120, seg(g, MORFO_0, 1546)) +                // entra en la fila de celdas
    eio(0, 215, seg(g, 1640, 1738));                    // cenital cerrada sobre la factura
  const pxAcc =
    eio(0, -66, seg(g, ESCALA_0, 436)) +
    eio(0, 54, seg(g, 700, 840)) +
    eio(0, -96, seg(g, 1040, 1210)) +
    eio(0, 36, seg(g, 1432, 1570)) +
    eio(0, -38, seg(g, 1650, 1740));
  const pyAcc =
    eio(0, -104, seg(g, 20, 300)) +                     // la cámara BAJA del poste al patio
    eio(0, -38, seg(g, ESCALA_0, 436)) +
    eio(0, 34, seg(g, 1040, 1210)) +
    eio(0, -22, seg(g, 1640, 1740));
  const rxAcc =
    eio(0, 5.2, seg(g, 30, 340)) +                      // deja de mirar la calle, mira la mesa
    eio(0, 3.4, seg(g, 692, 870)) +
    eio(0, -4.2, seg(g, 1040, 1230)) +
    eio(0, 6.4, seg(g, 1626, 1740));                    // se acuesta en cenital cerrada
  const cam =
    `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px) ` +
    `rotateX(${rxAcc.toFixed(3)}deg)`;

  // ── LA LUZ: evoluciona, no salta. danger (heredado) → torch · el azul de afuera → la lámpara ─
  const cKey = light(seg(g, 0, 190), "danger", "torch");
  const cFill = light(seg(g, 130, 740), "sky", "amber");
  const keyFrom = 0.15 + eio(0, 0.44, seg(g, 30, 430)) + eio(0, -0.15, seg(g, 1040, 1320));
  const intensity =
    0.46 + eio(0, 0.34, seg(g, 0, 110)) + eio(0, -0.09, seg(g, 900, 1120))
    + eio(0, 0.11, seg(g, 1424, 1560)) + eio(0, -0.13, seg(g, 1662, 1740));

  // el farol: arranca arriba a la izquierda (el poste de la calle), baja y se corre al centro
  // (la lámpara colgante de la cocina) y al final cae a plomo sobre la mesa.
  const flick = 0.94 + 0.06 * rnd(Math.floor(g / 5) * 1.7) + Math.sin(g / 13) * 0.018;
  const farolX = 11 + eio(0, 27, seg(g, 40, 380)) + eio(0, 9, seg(g, 1040, 1240)) + eio(0, -6, seg(g, 1630, 1740));
  const farolY = 5 + eio(0, 12, seg(g, 40, 380)) + eio(0, -5, seg(g, 700, 880)) + eio(0, 9, seg(g, 1040, 1300));
  const farolA = 62 + eio(0, -34, seg(g, 40, 380)) + eio(0, 12, seg(g, 1040, 1260));
  const farolP =
    (0.44 + eio(0, 0.42, seg(g, 0, 90)) + eio(0, 0.12, seg(g, 400, 560))
      + eio(0, -0.26, seg(g, 1044, 1240)) + eio(0, 0.18, seg(g, 1620, 1730))) * flick;

  // ── ACTO 1 · el poste, el patio al anochecer, el panel medido ─────────────────────────────
  const posteY = 42 - eio(0, 82, seg(g, 40, 300));
  const posteSize = 540 - eio(0, 120, seg(g, 40, 300));
  const posteOn = g < 320;
  const panelY = lerp(122, 52, ez(g, 24, 196));
  const panelLit = 0.42 + 0.56 * ez(g, 30, 170);
  const a1On = g < ESCALA_0 + 40;

  // ── LA CIFRA QUE VIAJA #1: 238 Wh/día → 7,14 kWh/mes → aterriza impresa en el renglón ──────
  const rollX = lerp(70, 32, ez(g, ESCALA_0, 380));
  const rollY = lerp(28, 56, ez(g, ESCALA_0, 380));
  const rollS = Math.round(lerp(176, 76, ez(g, ESCALA_0, 380)));

  // ── LA HOJA QUE SE COME EL CUADRO (costura ESCALA) ────────────────────────────────────────
  const esc = ez(g, ESCALA_0, ESCALA_1);
  const set = ez(g, ESCALA_1, 540);                    // y después se asienta en la mesa
  const hojaW = Math.round(lerp(lerp(280, 2500, esc), 1660, set));
  const hojaH = Math.round(lerp(lerp(170, 1520, esc), 1000, set));
  const hojaX = lerp(lerp(30, 50, esc), 47, set);
  const hojaY = lerp(lerp(76, 50, esc), 49, set);
  const hojaR = lerp(lerp(-7, 0, esc), 0, set);
  const hojaOn = g >= 240;

  // ── ACTO 3 · el macro de la moneda sobre la misma hoja ────────────────────────────────────
  const macro = ez(g, 700, 866);
  const monW = Math.round(lerp(1660, 1520, macro));
  const monH = Math.round(lerp(1000, 916, macro));
  const monX = lerp(47, 42, macro);
  const monY = lerp(49, 52, macro);

  // ── LAS CIFRAS QUE VIAJAN #2 y #3: la aritmética impresa se vuelve las dos barras ──────────
  const viaje = ez(g, 700, 800);
  const pagX = lerp(74, GAP_X, viaje);
  const pagY = lerp(40, 26, viaje);
  const pagS = Math.round(lerp(128, 112, viaje));
  const devX = lerp(32, GAP_X, viaje);
  const devY = lerp(73, 67, viaje);
  const devS = Math.round(lerp(118, 100, viaje));

  // ── EL CONTADOR DE MESES: tarda seis segundos en subir. Ese es el punto. ───────────────────
  const mesT = ez(g, 772, 948);
  const mes = Math.max(1, Math.round(lerp(1, MESES, mesT)));
  const devuelto = POR_MES * mes;
  const gapOn = g >= 706 && g < F_A4;

  // ── LA CIFRA "106" que CRUZA la oclusión: nace en el contador y se queda clavada ───────────
  const clav = ez(g, 962, 1030);
  const c106X = lerp(GAP_X, 80, clav);
  const c106Y = lerp(73, 20, clav);
  const c106S = Math.round(lerp(58, 132, clav));
  const cierre5 = ez(g, 1470, 1580);
  const f106X = lerp(c106X, 72, cierre5);
  const f106Y = lerp(c106Y, 24, cierre5);
  const f106S = Math.round(lerp(c106S, 118, cierre5));
  const c106On = g >= 958 && g < 1700;

  // ── ACTO 4 · el calendario, y las hojas que se sueltan ────────────────────────────────────
  const morf = ez(g, MORFO_0, MORFO_1);
  const calW = Math.round(lerp(1180, 1080, morf));
  const calH = Math.round(lerp(664, 470, morf));
  const calY = lerp(48, 53, morf);
  const calX = lerp(44, 50, morf);
  const a4On = g >= F_A4;

  // ── ACTO 5 · la salida: la factura vuelve, entra por abajo y se come el cuadro ─────────────
  const exT = ez(g, 1644, 1732);
  const exW = Math.round(lerp(1180, 2700, exT));
  const exH = Math.round(lerp(700, 1620, exT));
  const exY = lerp(134, 50, ez(g, 1640, 1716));
  const exR = lerp(4, 0, exT);
  const exOn = g >= 1636;

  // el barrido de la lámpara sobre el papel: es lo que enmascara la costura de MATERIA
  const sweep = seg(g, 668, 714);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cFill} keyFrom={keyFrom} intensity={intensity} floor={0.62} />

      <Layers cam={cam}>
        {/* P1 · el plano profundo. Cambia SOLO detrás de una costura que lo tapa al 100 %. */}
        {g < 406 && (
          <PhotoPlane
            src="img/cmetemu/cmet_mv_cuen1.jpg" kind="photo" z={-680} scale={1.30}
            dim={lerp(0.80, 0.54, ez(g, 20, 230))} tint={V.sky}
          />
        )}
        {g >= 406 && g < F_A4 && (
          <PhotoPlane
            src="img/cmetemu/cmet_mv_cuen2.jpg" kind="photo" z={-680} scale={1.22}
            dim={0.60} tint={V.amber}
          />
        )}
        {g >= F_A4 && (
          <PhotoPlane
            src="img/cmetemu/cmet_mv_cuen4.jpg" kind="photo" z={-680} scale={1.26}
            dim={lerp(0.52, 0.70, ez(g, F_A4, 1560))} tint={V.torch}
          />
        )}

        {/* P2 · el farol: el poste de la calle que se vuelve la lámpara de la cocina */}
        <Plane z={-430}>
          <Farol x={farolX} y={farolY} ang={farolA} power={clamp01(farolP)} color={cKey} />
        </Plane>

        {/* P3 · el hormigón del patio + EL POSTE que viene de MovPeligro (sale por arriba) */}
        <Plane z={-250}>
          <PadPlane y={78} w={1460} h={330} rx={62}
            lit={0.58 - 0.42 * ez(g, 180, 470)} z={-40} />
          {posteOn && (
            <AbsoluteFill style={{ filter: "brightness(0.22) contrast(1.15)" }}>
              <IconPng src="img/cmetemu/cmet_ic_poste.png"
                x={13} y={posteY} size={posteSize} z={0} glow={V.ink0} />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P4 · GRÁFICO: las cifras, el campo firma y la línea donde se apaga la batería */}
        <Plane z={-60}>
          {/* 238 Wh/día — lo que el panel produjo de verdad, medido con la pinza */}
          {g >= 50 && g < 200 && (
            <Readout value="238" unit="Wh/DÍA" label="MEDIDO CON LA PINZA · 30 DÍAS"
              at={at(54)} x={70} y={28} size={176} color={V.volt} />
          )}
          {g >= 150 && g < 200 && (
            <div style={{
              position: "absolute", left: "70%", top: "36%", transform: "translateX(-50%)",
              opacity: ez(g, 150, 172),
            }}><Kick color={rgba(V.white, 0.7)}>× 30 DÍAS</Kick></div>
          )}
          {/* la misma cifra, en kilovatios hora: se hace chica y aterriza en el renglón */}
          {g >= 196 && g < MATERIA && (
            <Readout value="7,14" unit="kWh/MES" label={g < ESCALA_0 + 6 ? "EN UN MES ENTERO" : undefined}
              at={at(200)} x={rollX} y={rollY} size={rollS} color={V.volt} />
          )}

          {/* la aritmética impresa sobre el papel (tipografía sobre material real, nunca sobre plano) */}
          {g >= 430 && g < MATERIA && (
            <div style={{
              position: "absolute", left: "32%", top: "64.5%", transform: "translate(-50%,-50%)",
              opacity: ez(g, 430, 452), whiteSpace: "nowrap", textAlign: "center",
            }}>
              <Body size={34} color={V.amber}>× 0,17 US$ el kilovatio hora</Body>
            </div>
          )}
          {/* 1,21 — el número chiquito. Nace en la cuenta y termina siendo la barra verde. */}
          {g >= 466 && g < F_A4 && (
            <Readout value="1,21" unit="US$" label={g < 700 ? "LO QUE EL KIT LE SACA A TU FACTURA" : "POR MES"}
              at={at(470)} x={devX} y={devY} size={devS} color={V.volt} />
          )}
          {/* 129 — lo que ya pagó. Naranja: es el número de la caja. */}
          {g >= 612 && g < F_A4 && (
            <Readout value="129" unit="US$" label="LO QUE PAGUÉ POR EL KIT"
              at={at(616)} x={pagX} y={pagY} size={pagS} color={V.orange} />
          )}

          {/* ── EL CAMPO FIRMA: 129 prometidos arriba, 1,21 abajo. El vacío es el tema. ── */}
          {gapOn && (
            <>
              <PromiseGap
                promise={PAGADO} measured={devuelto} unit="US$"
                x={GAP_X} y={GAP_Y} w={GAP_W} h={GAP_H} slats={22} nums={false}
                on={ez(g, 706, 742)}
              />
              <div style={{
                position: "absolute", left: `${GAP_X}%`, top: `${GAP_Y}%`,
                width: GAP_W, height: GAP_H, marginLeft: -GAP_W / 2, marginTop: -GAP_H / 2,
                opacity: ez(g, 706, 742),
              }}>
                {/* la banda de lo que NUNCA vuelve: arriba de los cinco años no hay batería */}
                {g >= 884 && (
                  <>
                    <div style={{
                      position: "absolute", left: 0, right: 0, bottom: GAP_H * MUERE,
                      height: GAP_H * (1 - MUERE), opacity: ez(g, 884, 926),
                      background: `repeating-linear-gradient(-58deg, ${rgba(V.danger, 0.16 + 0.07 * (0.5 + 0.5 * Math.sin(g / 19)))} 0 6px, transparent 6px 15px)`,
                    }} />
                    <div style={{
                      position: "absolute", left: -22, right: -22, bottom: GAP_H * MUERE, height: 3,
                      background: `repeating-linear-gradient(90deg, ${V.danger} 0 12px, rgba(0,0,0,0) 12px 22px)`,
                      opacity: ez(g, 884, 916),
                    }} />
                    <div style={{
                      position: "absolute", right: "100%", marginRight: 20,
                      bottom: GAP_H * MUERE - 14, whiteSpace: "nowrap", textAlign: "right",
                      opacity: ez(g, 892, 930),
                    }}><Kick color={V.danger}>AQUÍ MUERE LA BATERÍA</Kick></div>
                  </>
                )}
                {/* el contador: seis segundos subiendo. Tiene que cansar un poco. */}
                {g >= 768 && g < 1000 && (
                  <div style={{
                    position: "absolute", left: "50%", top: GAP_H + 42, transform: "translateX(-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: 2,
                    color: rgba(V.bone, 0.92), whiteSpace: "nowrap",
                    textShadow: "0 4px 20px rgba(0,0,0,0.92)", opacity: ez(g, 768, 790),
                  }}>MES {mes} <span style={{ opacity: 0.55 }}>/ 106</span></div>
                )}
              </div>
            </>
          )}

          {/* la cifra 106: CRUZA la oclusión sin moverse y llega hasta el cierre */}
          {c106On && (
            <Readout value="106" unit="MESES" label="PARA PAGARSE SOLO"
              at={at(962)} x={f106X} y={f106Y} size={f106S} color={V.orange} />
          )}

          {/* acto 5 · los cinco años, enfrentados a los ciento seis meses */}
          {g >= 1536 && g < 1700 && (
            <Readout value="5" unit="AÑOS" label="LO QUE DURA LA BATERÍA"
              at={at(1540)} x={30} y={26} size={228} color={V.volt} />
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: las tarjetas protagonistas ── */}
        <Plane z={40}>
          {/* ACTO 1 — el panel en el patio al atardecer. Entra por abajo mientras la cámara baja. */}
          {a1On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cuen1.mp4" kind="video"
              w={1060} h={596} x={54} y={panelY} z={0}
              ry={lerp(9, 1, ez(g, 30, 210))} rx={lerp(-5, 0, ez(g, 30, 210))}
              radius={16} startFrom={5} lit={panelLit} litColor={cKey}
              label="EL PANEL · PROMEDIO DE 30 DÍAS" sheenAt={at(118)}
            />
          )}

          {/* LA HOJA: miniatura sobre el hormigón (f240) → se come el cuadro (f406) → la mesa.
              Es la costura de ESCALA y es el decorado de los actos 2 y 3. */}
          {hojaOn && g < MATERIA && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cuen2.mp4" kind="video"
              w={hojaW} h={hojaH} x={hojaX} y={hojaY} z={0} rot={hojaR}
              ry={lerp(6, 0, esc)} radius={14} startFrom={3}
              lit={lerp(0.62, 0.96, ez(g, 250, 430))} litColor={cFill}
              label={g > 470 && g < 640 ? "TU FACTURA DE LA LUZ" : undefined}
              sheenAt={at(668)}
            />
          )}

          {/* ACTO 3 — MATERIA: el mismo papel, misma geometría, misma luz. Cambia lo de encima. */}
          {g >= MATERIA && g < F_A4 && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cuen3.mp4" kind="video"
              w={monW} h={monH} x={monX} y={monY} z={0}
              ry={lerp(0, -4, macro)} radius={14} startFrom={7}
              lit={0.96} litColor={cFill}
              label={g < 800 ? "UNA MONEDA Y UN DÓLAR" : undefined}
              sheenAt={at(668)}
            />
          )}

          {/* ACTO 4/5 — el calendario, que al final se achata y ES la carcasa de la estación */}
          {a4On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cuen4.mp4" kind="video"
              w={calW} h={calH} x={calX} y={calY} z={morf > 0.5 ? -20 : 0}
              ry={lerp(5, 0, ez(g, F_A4, 1260))} radius={14} startFrom={4}
              lit={lerp(0.92, 0.4, morf)} litColor={morf > 0.4 ? V.volt : cKey}
              label={g > 1090 && g < 1330 ? "OCHO AÑOS Y DIEZ MESES" : undefined}
              sheenAt={at(1078)} opacity={1 - 0.55 * ez(g, 1650, 1724)}
            />
          )}

          {/* LAS CINCO HOJAS → LAS CINCO CELDAS (costura MORFO: mismas tarjetas, mismo material) */}
          {a4On && HOJAS.map((h, i) => {
            if (g < h.born) return null;
            const sale = ez(g, h.born, h.born + 46);          // se despega del calendario
            const w = Math.round(lerp(lerp(70, h.w0, sale), 168, morf));
            const hh = Math.round(lerp(lerp(44, h.w0 * 0.62, sale), 428, morf));
            const x = lerp(lerp(calX, h.x0, sale), CELDA_X[i], morf);
            const y = lerp(lerp(calY, h.y0, sale), 52, morf);
            const rot = lerp(lerp(0, h.r0, sale), 0, morf)
              + Math.sin((g + i * 37) / 61) * (1 - morf) * 2.2;
            return (
              <MediaCard
                key={i}
                src="img/cmetemu/cmet_mv_cuen4.jpg" kind="photo"
                w={w} h={hh} x={x} y={y} z={lerp(-30 + i * 16, 30, morf)}
                rot={rot} ry={lerp(h.r0 * 0.6, 0, morf)}
                radius={lerp(8, 6, morf)}
                lit={lerp(0.7, 0.98, morf)} litColor={morf > 0.4 ? V.volt : cKey}
                opacity={clamp01(ez(g, h.born, h.born + 9)) * (1 - 0.9 * ez(g, 1666, 1726))}
                sheenAt={at(MORFO_0 + 40 + i * 14)}
              />
            );
          })}

          {/* las celdas se cargan una a una: cinco años, uno por celda */}
          {g >= 1536 && g < 1690 && CELDA_X.map((cx, i) => {
            const fill = ez(g, 1540 + i * 24, 1596 + i * 24);
            const alive = 1 - 0.9 * ez(g, 1660, 1720);
            return (
              <div key={`c${i}`} style={{
                position: "absolute", left: `${cx}%`, top: "52%",
                width: 168, height: 428, marginLeft: -84, marginTop: -214,
                borderRadius: 6, overflow: "hidden", pointerEvents: "none",
                opacity: alive, transform: "translateZ(31px)",
              }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: `${(fill * 100).toFixed(1)}%`,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.42)} 0%, ${rgba(V.volt, 0.14)} 100%)`,
                  borderTop: `2px solid ${rgba(V.volt, 0.9)}`,
                  boxShadow: `0 0 26px ${rgba(V.volt, 0.5)}`,
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 6,
                  boxShadow: `inset 0 0 0 2px ${rgba(V.volt, 0.24 + 0.5 * fill)}`,
                }} />
              </div>
            );
          })}

          {/* el ícono de la caja, junto a los 129 que ya pagó (objeto de escena, suma capa) */}
          {g >= 640 && g < MATERIA && (
            <div style={{ opacity: ez(g, 640, 672) }}>
              <IconPng src="img/cmetemu/cmet_ic_caja.png" x={74} y={58} size={116} z={0} glow={V.ink0} />
            </div>
          )}
          {/* el ícono de la batería, bajo la fila de celdas */}
          {g >= 1560 && g < 1690 && (
            <div style={{ opacity: ez(g, 1560, 1594) * (1 - ez(g, 1660, 1690)) }}>
              <IconPng src="img/cmetemu/cmet_ic_bateria.png" x={58} y={80} size={84} z={0} glow={V.ink0} />
            </div>
          )}

          {/* el recordatorio del dólar veintiuno, mientras se ven los cinco años */}
          {g >= 1466 && g < 1700 && (
            <div style={{ opacity: ez(g, 1466, 1500) * (1 - ez(g, 1664, 1698)) }}>
              <MediaCard
                src="img/cmetemu/cmet_mv_cuen3.jpg" kind="photo"
                w={300} h={180} x={85} y={79} z={0} ry={-7} radius={12}
                lit={0.88} litColor={cFill} sheenAt={at(1486)}
              />
            </div>
          )}

          {/* SALIDA — la factura entra por abajo y se come el cuadro: así empieza `MovApagon` */}
          {exOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cuen2.mp4" kind="video"
              w={exW} h={exH} x={50} y={exY} z={60} rot={exR}
              ry={lerp(3, 0, exT)} radius={14} startFrom={2}
              lit={0.94} litColor={V.torch} sheenAt={at(1690)}
            />
          )}
        </Plane>

        {/* P6 · primer plano: el polvo en el haz de la lámpara (hold VIVO, nada queda quieto) */}
        <Plane z={220}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.35 + rnd(i * 4.7) * 1.05;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 24) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.09 + rnd(i * 3.7) * 0.22) * clamp01(farolP)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2 * clamp01(farolP))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f690 · MATERIA: el barrido de la lámpara sobre el papel. La superficie no se corta. */}
      {sweep > 0 && sweep < 1 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-30%", left: `${lerp(-120, 120, sweep).toFixed(1)}%`,
            width: "150%", height: "170%", transform: "rotate(9deg)",
            background: `linear-gradient(96deg, rgba(255,255,255,0) 26%, ${rgba(V.torch, 0.34 * Math.sin(sweep * Math.PI))} 50%, rgba(255,255,255,0) 74%)`,
            mixBlendMode: "screen",
          }} />
        </AbsoluteFill>
      )}
      {/* f1044 · OCLUSIÓN: la HOJA DE LA FACTURA cruza el cuadro (cobertura total exacta en 1044) */}
      <SeamOcclude at={at(OCC_AT)} dur={16} color={V.paper} angle={7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 62 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={64} outF={264} kick="EL PANEL, MEDIDO"
          head="DOSCIENTOS TREINTA Y OCHO POR DÍA" size={58}
          sub="Vatios hora. El promedio real de treinta días." kickColor={V.torch} />
        <Titular g={g} inF={386} outF={606} kick="TU FACTURA"
          head="SIETE KILOVATIOS HORA AL MES" size={62}
          sub="Eso es todo lo que este kit le quita." />
        <Titular g={g} inF={706} outF={968} kick="LO QUE TE DEVUELVE"
          head="UN DÓLAR CON VEINTIUNO" size={70}
          sub="Al lado de los ciento veintinueve que ya pusiste." />
        <Titular g={g} inF={1078} outF={1300} kick="PARA PAGARSE SOLO"
          head="CIENTO SEIS MESES" size={74}
          sub="Ocho años y diez meses de hojas de calendario." kickColor={V.orange} />
        <Titular g={g} inF={1452} outF={1662} kick="LOS AÑOS QUE DURA"
          head="LA BATERÍA TIENE CINCO" size={72}
          sub="Se muere a mitad de camino. No es un ahorro." kickColor={V.torch} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
