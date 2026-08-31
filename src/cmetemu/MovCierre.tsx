// MovCierre.tsx — S12 · UN MOVIMIENTO CONTINUO de 55 s (1650 frames @30fps) · arranca en 1389,0 s
// «El número grande está en la tapa. El verdadero está atrás. La diferencia la pagas tú.»
//
// EL CIERRE: todo en el verde de LO MEDIDO. Una sola atmósfera montada arriba de todo (nunca se
// remonta), UNA cámara función de `gFrame` que jamás vuelve a cero — retrocede del duelo de cifras al
// piso, se aleja a las cuatro barras, entra en la etiqueta, baja al banco y SIGUE bajando hasta
// encontrar el código —, la luz evoluciona `white`→`volt` pleno, y hay MATERIA que cruza cada frontera.
//
// ⛔ REGLA DURA DE ESTE ARCHIVO: el QR (`img/cmetemu/cmet_qr.png`) se dibuja FUERA de la perspectiva,
// plano, de frente, sin rotación 3D, sin blur, sin gradiente encima, sin recorte y SIN UN SOLO PÍXEL
// de movimiento desde el frame 1372 hasta el 1650 (9,3 s), a 460×460 px sobre placa blanca. Si el QR
// se deforma o se tapa, no se escanea y el embudo del canal se rompe. Todo lo demás de la escena se
// mueve; el QR no.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER cám z≈+120 (heredada de MovControlador, empujada, con deriva viva) · luz VOLT
//                      (blanco ya caído a volt, key arriba-izquierda) · materia: LAS DOS CIFRAS
//                      ENFRENTADAS 68,6 y 85,2 sobre el hormigón.
//                EXIT  cám z≈-70 retrocediendo y bajando al piso · luz volt plena · materia: LA
//                      TARJETA DE LAS CINCO PIEZAS (que se aleja) + LA CIFRA 68,6 (que se despega).
//
// acto 2 · f363  ENTER cám z≈-120, siguiendo el mismo retroceso (ningún reinicio) · luz volt, contra
//                      ámbar del garaje · materia: LAS CINCO PIEZAS ya en miniatura arriba-izquierda
//                      y LA CIFRA 68,6 aterrizando en la cuarta columna.
//                EXIT  cám z≈-60 empezando a empujar hacia la etiqueta · luz volt · materia: LAS
//                      CUATRO BARRAS VERDE/NARANJA (que se acuestan).
//
// acto 3 · f726  ENTER cám z≈+40 entrando en el macro de la etiqueta · luz volt, key centrada ·
//                      materia: LAS CUATRO BARRAS YA ACOSTADAS = LOS CUATRO RENGLONES IMPRESOS.
//                EXIT  cám z≈+135 (macro pleno) · luz volt · materia: LA ETIQUETA PLATEADA llenando
//                      el cuadro (es la que cruza como oclusión) + EL RENGLÓN 4.
//
// acto 4 · f1089 ENTER cám z≈+5 abriendo al banco, bajando · luz volt + contra cálido del banco ·
//                      materia: EL RENGLÓN 4 VERDE (sobrevive la oclusión y se vuelve el subrayado
//                      del 27) + la superficie (PadPlane) que nunca se fue.
//                EXIT  cám z≈+40, BAJANDO (vector vivo, sin frenar) · luz volt pleno · materia: EL
//                      BANCO DE TRABAJO y LA PLACA DEL QR, ya apoyada y quieta desde f1372.
//
// acto 5 · f1419 ENTER cám z≈+45 todavía bajando por INERCIA · luz volt pleno · materia: EL BANCO +
//                      EL QR (que ya estaba en cuadro antes de la frontera).
//                EXIT  cám asentada (sólo deriva viva) · luz volt pleno · materia: LA PLACA DEL QR
//                      SOBRE EL BANCO, junto a la pinza.  → fin del video.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f363  frontera 1→2 : ESCALA — la tarjeta de las cinco piezas (1180×664 a pantalla) se aleja y se
//                       vuelve miniatura de 300×169 arriba-izquierda (rampa f336→f452, cruce en f363),
//                       y el decorado que queda es el tablero de las cuatro barras.
// f726  frontera 2→3 : MORFO — las cuatro `PromiseGap` VERTICALES rotan 90° sobre su esquina inferior
//                       izquierda y se estiran (scale 0,073 × 2,95) hasta ser los cuatro RENGLONES
//                       impresos de la etiqueta (rampa f700→f768, cruce en f726). Es el MISMO nodo del
//                       DOM: a m=0 la transformada es la identidad, así que no hay ni un frame de pop
//                       ni un cross-fade.
// f1080 frontera 3→4 : OCLUSIÓN con `V.silver` (la etiqueta plateada gira y cruza el lente). Con
//                       dur 18 la cobertura del 100 % cae EXACTAMENTE en f1089, la frontera: ahí
//                       debajo se cambia el fondo (hormigón → banco) y entra la lámina de la guía.
// f1412 frontera 4→5 : INERCIA — la cámara NO frena: su vector de bajada sigue (pyAcc −74 de f1360 a
//                       f1524), la lámina sale por arriba y la pinza entra por abajo. Sin oclusión,
//                       sin flash y sin fade: sólo el decorado cambiando detrás del mismo movimiento.
// (cuatro costuras distintas, ninguna repetida, ninguna es un fundido)
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane,
  Readout, SeamOcclude, Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros: los actos de la ficha y las cuatro costuras
const F_A2 = 363;
const F_A3 = 726;
const F_A4 = 1089;
const F_A5 = 1419;
const SEAM_ESCALA = F_A2;          // 363
const SEAM_MORFO = F_A3;           // 726
const SEAM_OCC = F_A4 - 9;         // 1080 · con dur 18 la cobertura total cae en f1089 (la frontera)
const SEAM_INERCIA = 1412;
// EL QR: entra f1326, QUEDA CLAVADO en f1372 y no se mueve hasta el 1650 (9,3 s sin un pixel de deriva)
const QR_IN = 1326;
const QR_LOCK = 1372;

// ── EL TABLERO DE LAS CUATRO CIFRAS (acto 2) y su MORFO a renglones (acto 3) ────────────────
const GAP_W = 300;
const GAP_H = 210;
const GAP_Y = 46;                                   // % de pantalla (centro del campo)
const GAP_X = [17, 38.3, 61.7, 83];                 // % de pantalla (centro de cada columna)
const GAP_ORIGIN_Y = (GAP_Y / 100) * 1080 + GAP_H / 2;   // esquina inferior de cada columna
// ⛔ `slats` alto A PROPÓSITO: con w/slats/2.4 los listones quedan de 3 px cada 4 (75 % de cobertura),
// así que después del morfo — que los aplasta a 0,073× en el eje del grosor — la barra sigue leyéndose
// como una línea LLENA y no como un peine sub-pixel medio transparente.
const GAP_SLATS = 75;
const ROW_X0 = 620;                                 // dónde empieza el renglón impreso
const ROW_LEN = 620;
const ROW_TH = 22;
const ROW_Y = [322, 390, 458, 526];
const MORFO_SX = ROW_TH / GAP_W;                    // el ancho de la columna → el grosor del renglón
const MORFO_SY = ROW_LEN / GAP_H;                   // el alto de la columna → el largo del renglón
const gapLeft = (i: number) => (GAP_X[i] / 100) * 1920 - GAP_W / 2;

const CIFRAS = [
  { name: "PANEL", promise: 100, measured: 89, unit: "W", pTxt: "100", mTxt: "89" },
  { name: "ESTACIÓN", promise: 600, measured: 431, unit: "Wh", pTxt: "600", mTxt: "431" },
  { name: "INVERSOR", promise: 3000, measured: 340, unit: "W", pTxt: "3.000", mTxt: "340" },
  { name: "CONTROLADOR", promise: 89, measured: 68.6, unit: "W", pTxt: "89", mTxt: "68,6" },
];

// las cinco piezas que enumera Claudio en el acto 1 (íconos PNG sin fondo como objetos del cuadro)
const PIEZAS = [
  { ic: "img/cmetemu/cmet_ic_panel.png", t: "PANEL", at: 96 },
  { ic: "img/cmetemu/cmet_ic_bateria.png", t: "BATERÍA", at: 140 },
  { ic: "img/cmetemu/cmet_ic_enchufe.png", t: "INVERSOR", at: 184 },
  { ic: "img/cmetemu/cmet_ic_cable.png", t: "CABLE", at: 228 },
  { ic: "img/cmetemu/cmet_ic_controlador.png", t: "CONTROLADOR", at: 272 },
];

// ── CIFRA: el número que VIAJA (sin pop de entrada: tiene que cruzar la frontera con el
//    movimiento anterior sin que se note un solo frame de nacimiento) ─────────────────────────
const Cifra: React.FC<{
  x: number; y: number; size: number; value: string; unit?: string; color?: string; opacity?: number;
}> = ({ x, y, size, value, unit, color = V.volt, opacity = 1 }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      transform: "translate(-50%,-50%)", textAlign: "center", whiteSpace: "nowrap", opacity,
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(size), lineHeight: 0.9, color,
        textShadow: `0 0 ${Math.round(size * 0.4)}px ${rgba(color, 0.34)}, 0 6px 26px rgba(0,0,0,0.92)`,
      }}>
        {value}
        {unit ? <span style={{ fontSize: Math.round(size * 0.34), marginLeft: 8, opacity: 0.82 }}>{unit}</span> : null}
      </div>
    </div>
  );
};

// ── RÓTULO: texto chico de estructura (≥30 px, siempre con cama de sombra) ──────────────────
const Rotulo: React.FC<{
  x: number; y: number; text: string; color?: string; size?: number; opacity?: number;
}> = ({ x, y, text, color = V.bone, size = 30, opacity = 1 }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      transform: "translate(-50%,-50%)", whiteSpace: "nowrap", opacity,
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: 2.6,
      textTransform: "uppercase", color, textShadow: "0 4px 20px rgba(0,0,0,0.92)",
    }}>{text}</div>
  );
};

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 60 px) ─────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 70, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1020,
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
export const MovCierre: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 330);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`) miden con useCurrentFrame;
  // `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 120, z1: 208, panX: -34, panY: -26, ry: -4.5, rx: 1.6, dur: 1520 });
  const zAcc =
    eio(0, -196, seg(g, 40, 330)) +                             // acto 1: del duelo de cifras al piso
    eio(0, -118, seg(g, SEAM_ESCALA - 27, SEAM_ESCALA + 89)) +  // ESCALA: sigue alejándose
    eio(0, 268, seg(g, SEAM_MORFO - 26, SEAM_MORFO + 146)) +    // MORFO: entra al macro de la etiqueta
    eio(0, -158, seg(g, SEAM_OCC - 10, SEAM_OCC + 166)) +       // OCLUSIÓN: abre al banco
    eio(0, 44, seg(g, SEAM_INERCIA - 16, SEAM_INERCIA + 184));  // INERCIA: último empuje y se asienta
  const pxAcc =
    eio(0, 44, seg(g, SEAM_ESCALA - 27, SEAM_ESCALA + 123)) +
    eio(0, -58, seg(g, SEAM_MORFO - 26, SEAM_MORFO + 164)) +
    eio(0, 86, seg(g, SEAM_OCC + 6, SEAM_OCC + 188)) +
    eio(0, -26, seg(g, SEAM_INERCIA - 12, SEAM_INERCIA + 168));
  // la cámara BAJA: el mundo sube (translateY negativo). El vector NO se corta nunca en f1412.
  const pyAcc =
    eio(0, -58, seg(g, 60, 330)) +                              // baja del duelo de cifras al hormigón
    eio(0, -34, seg(g, SEAM_MORFO - 26, SEAM_MORFO + 164)) +    // sube a la etiqueta (único tramo que invierte)
    eio(0, -66, seg(g, SEAM_OCC - 20, SEAM_OCC + 210)) +        // baja al banco
    eio(0, -74, seg(g, SEAM_INERCIA - 52, SEAM_INERCIA + 112)); // INERCIA: SIGUE bajando y encuentra el código
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. Entra con el blanco YA caído a volt y termina en volt pleno ─
  const cKey = light(clamp01(0.62 + 0.38 * seg(g, 0, 430)), "white", "volt");
  const cContra = light(seg(g, 320, 1500), "amber", "voltSoft");
  const keyFrom = 0.24 + eio(0, 0.30, seg(g, 0, 700)) + eio(0, -0.17, seg(g, 1050, 1500));
  const intensity = 0.86 + eio(0, 0.14, seg(g, 0, 120)) + eio(0, 0.14, seg(g, 1180, 1580));

  // ── ACTO 1 · las dos cifras heredadas + las cinco piezas usadas sobre el hormigón ──────────
  const esc = ez(g, SEAM_ESCALA - 27, SEAM_ESCALA + 89);   // COSTURA 1→2 · ESCALA
  const cardOp = ez(g, 36, 62);
  const cardW = Math.round(lerp(1180, 300, esc));
  const cardH = Math.round(lerp(664, 169, esc));
  const cardX = lerp(50, 14.6, esc);
  const cardY = lerp(48, 18.5, esc) + (1 - ez(g, 36, 96)) * 5;   // sube a su sitio, no aparece de la nada
  const cardZ = lerp(0, -300, esc);
  // la cifra 68,6 SE DESPEGA del duelo y aterriza en la cuarta columna del tablero
  const viaja = ez(g, 470, 560);
  // ⛔ x=32 y 152 px dejaban el "6" de 68,6 CORTADO contra el borde de la tarjeta: se leia "8,6".
  const c686X = lerp(39, GAP_X[3], viaja);
  const c686Y = lerp(41, 60.6, viaja);
  const c686S = lerp(128, 66, viaja);
  // la cifra 85,2 (lo que podrías haber tenido) se va POR ARRIBA del cuadro: sale, no se funde
  const sube = ez(g, 300, 430);
  const c852Y = lerp(41, -9, sube);
  const c852S = lerp(128, 58, sube);
  const duo = 1 - ez(g, 176, 262);                   // la barra que las enfrentaba
  const duoRot = 1 - ez(g, 150, 200);                // sus dos rótulos

  // ── ACTO 2 · las cuatro comparaciones prometido/medido, juntas por primera vez ─────────────
  const boardOn = g >= F_A2 - 7 && g < F_A4;
  const numsOut = 1 - ez(g, 676, 700);
  const morfo = ez(g, SEAM_MORFO - 26, SEAM_MORFO + 42);   // COSTURA 2→3 · MORFO
  const boardOp = 1 - 0.48 * ez(g, 800, 906);

  // ── ACTO 3 · la etiqueta plateada llenando el cuadro + la frase-ancla ──────────────────────
  const labelOn = g >= F_A3 - 58 && g < F_A4;
  const labelY = lerp(128, 47, ez(g, 676, 762));     // ENTRA subiendo por el cuadro (no es un fade)
  const scrim = ez(g, 706, 790) * (1 - ez(g, SEAM_OCC - 6, SEAM_OCC + 8));

  // ── ACTO 4 · la lámina de la guía sobre el banco ───────────────────────────────────────────
  const lamOn = g >= F_A4 && g < 1478;
  const lamY = 43 - 78 * ez(g, SEAM_INERCIA - 22, SEAM_INERCIA + 50);  // INERCIA: sale por arriba
  const datoOut = 1 - ez(g, 1300, QR_IN);            // libera el flanco derecho antes del QR
  const r4 = ez(g, SEAM_OCC, SEAM_OCC + 96);         // el RENGLÓN 4 cruza la oclusión
  const r4X = lerp(ROW_X0, 1120, r4);
  const r4W = lerp(478, 440, r4);
  const r4Y = lerp(ROW_Y[3], 462, r4);
  const r4H = lerp(ROW_TH, 6, r4);

  // ── ACTO 5 · la pinza y el código sobre el banco ───────────────────────────────────────────
  const pinzaY = lerp(140, 54, ez(g, SEAM_INERCIA - 12, SEAM_INERCIA + 74));  // entra por abajo
  // EL QR: entra una vez, se clava en f1372 y NO SE MUEVE MÁS (regla dura del embudo)
  const qrOp = ez(g, QR_IN, QR_IN + 32);
  const qrRise = (1 - ez(g, QR_IN, QR_LOCK)) * 34;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cContra} keyFrom={keyFrom} intensity={intensity} floor={0.56} />

      <Layers cam={cam}>
        {/* P1 · el fondo real. Cambia UNA sola vez, y lo hace en f1089: el frame EXACTO en que la
            etiqueta plateada tapa el 100 % del cuadro. El hormigón del garaje pasa a ser el banco. */}
        <Plane z={0}>
          {g < F_A4 ? (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_cie1.jpg"
              kind="photo" z={-640} scale={1.3}
              dim={lerp(0.52, 0.78, ez(g, 120, 700))} tint={V.volt}
            />
          ) : (
            <PhotoPlane
              src="img/cmetemu/cmet_mv_cie2.jpg"
              kind="photo" z={-640} scale={1.24}
              dim={lerp(0.62, 0.44, ez(g, 1100, 1520))} tint={V.volt}
            />
          )}
        </Plane>

        {/* P2 · la superficie: el hormigón del garaje y después la tapa del banco. NUNCA se va:
            es lo único que sobrevive las cuatro fronteras enteras. */}
        <Plane z={-430}>
          <PadPlane
            y={lerp(76, 71, ez(g, SEAM_OCC - 20, SEAM_OCC + 220))}
            w={1440} h={330} rx={62}
            lit={0.9 - 0.5 * ez(g, 640, 800) + 0.55 * ez(g, SEAM_OCC, SEAM_OCC + 160)}
            z={-40}
          />
        </Plane>

        {/* P3 · EL MATERIAL REAL: las tarjetas protagonistas (una por acto) */}
        <Plane z={60}>
          {/* ACTO 1 — las cinco piezas otra vez sobre el hormigón, usadas y sucias.
              COSTURA 1→2 (ESCALA): la misma tarjeta se aleja hasta ser miniatura arriba-izquierda. */}
          {g < 806 && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cie1.mp4" kind="video"
              w={cardW} h={cardH} x={cardX} y={cardY} z={cardZ}
              ry={lerp(6, 11, esc)} rx={lerp(-2.2, 0, ez(g, 40, 260))}
              radius={16} startFrom={5}
              lit={(0.62 + 0.38 * ez(g, 40, 190)) * (1 - 0.42 * esc)}
              litColor={cKey} opacity={cardOp}
              sheenAt={at(124)}
            />
          )}

          {/* ACTO 3 — la etiqueta plateada llenando el cuadro. ENTRA SUBIENDO desde abajo mientras
              las cuatro barras se le acuestan encima: la costura es el movimiento, no un fundido. */}
          {labelOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cie3.mp4" kind="video"
              w={1620} h={912} x={50} y={labelY} z={0}
              ry={lerp(4, 0, ez(g, 676, 800))} rx={lerp(2.4, 0, ez(g, 676, 800))}
              radius={12} startFrom={3} lit={0.96} litColor={cKey}
              sheenAt={at(802)}
            />
          )}

          {/* ACTO 4 — la lámina de la guía apoyada en el banco: MATERIAL REAL (una página del PDF),
              con su marco, su sombra de contacto y la tabla legible (nada la tapa). */}
          {lamOn && (
            <MediaCard
              src="img/cmetemu/cmet_lam_01.jpg" kind="photo"
              w={440} h={622} x={34} y={lamY} z={0}
              ry={7} rx={2} rot={-1.6} radius={8}
              lit={0.99} litColor={V.bone} sheenAt={at(1146)}
            />
          )}

          {/* ACTO 5 — la pinza sobre el banco junto al cuaderno: entra por abajo con la inercia */}
          {g >= F_A5 - 25 && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cie4.mp4" kind="video"
              w={620} h={349} x={30} y={pinzaY} z={0}
              ry={-6} rx={1.4} radius={14} startFrom={7}
              lit={0.98} litColor={V.volt}
              label="LA PINZA · LO QUE DE VERDAD ENTRA"
              sheenAt={at(1488)}
            />
          )}
        </Plane>

        {/* P4 · GRÁFICO: las cifras que viajan, el tablero de las cuatro comparaciones y su MORFO */}
        <Plane z={110}>
          {/* ── las DOS CIFRAS ENFRENTADAS que vienen de MovControlador (materia de entrada) ── */}
          {g < 596 && (
            <Cifra x={c686X} y={c686Y} size={c686S} value="68,6" unit="W" opacity={numsOut} />
          )}
          {g < 440 && <Cifra x={64} y={c852Y} size={c852S} value="85,2" unit="W" />}
          {duo > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: "34%", width: 3, height: 168, marginLeft: -1.5,
              background: `linear-gradient(180deg, ${rgba(V.volt, 0.02)} 0%, ${rgba(V.volt, 0.46)} 50%, ${rgba(V.volt, 0.02)} 100%)`,
              opacity: duo, transform: `scaleY(${(0.4 + 0.6 * duo).toFixed(3)})`,
            }} />
          )}
          <Rotulo x={32} y={51} text="PWM · DE REGALO" color={rgba(V.white, 0.7)} opacity={duoRot} />
          <Rotulo x={68} y={51} text="MPPT · 26 DÓLARES" color={rgba(V.white, 0.7)} opacity={duoRot} />

          {/* ── EL TABLERO DE LAS CUATRO CIFRAS ── */}
          {boardOn && (
            <div style={{ opacity: boardOp }}>
              {/* leyenda de color: naranja = la tapa de la caja · verde = la pinza */}
              <div style={{
                position: "absolute", left: "50%", top: "25.5%", transform: "translate(-50%,-50%)",
                display: "flex", alignItems: "center", gap: 26, whiteSpace: "nowrap",
                opacity: ez(g, 372, 406) * numsOut,
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 26, height: 26, background: V.orange, borderRadius: 3, boxShadow: `0 0 16px ${rgba(V.orange, 0.5)}` }} />
                  <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2.4, color: V.bone, textShadow: "0 4px 20px rgba(0,0,0,0.92)" }}>LO QUE PROMETE LA CAJA</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 26, height: 26, background: V.volt, borderRadius: 3, boxShadow: `0 0 16px ${rgba(V.volt, 0.6)}` }} />
                  <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2.4, color: V.bone, textShadow: "0 4px 20px rgba(0,0,0,0.92)" }}>LO QUE MARCÓ LA PINZA</span>
                </span>
              </div>

              {/* COSTURA 2→3 · MORFO: cada columna rota 90° sobre su esquina inferior izquierda y se
                  estira hasta ser un renglón impreso de la etiqueta. A morfo=0 la transformada es la
                  IDENTIDAD → cero pop, cero cross-fade: es literalmente el mismo nodo. */}
              {CIFRAS.map((c, i) => {
                const a0 = 372 + i * 40;
                const ramp = ez(g, a0, a0 + 66);
                const tx = lerp(0, ROW_X0 - gapLeft(i), morfo);
                const ty = lerp(0, ROW_Y[i] - GAP_ORIGIN_Y, morfo);
                const sx = lerp(1, MORFO_SX, morfo);
                const sy = lerp(1, MORFO_SY, morfo);
                return (
                  <div key={i} style={{
                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                    transformOrigin: `${gapLeft(i).toFixed(1)}px ${GAP_ORIGIN_Y.toFixed(1)}px`,
                    transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${(90 * morfo).toFixed(3)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
                  }}>
                    <PromiseGap
                      promise={c.promise}
                      measured={c.measured * ramp}
                      unit={c.unit}
                      slats={GAP_SLATS}
                      x={GAP_X[i]} y={GAP_Y} w={GAP_W} h={GAP_H}
                      on={ez(g, a0 - 6, a0 + 28)}
                      nums={false}
                    />
                  </div>
                );
              })}

              {/* las cifras y los nombres de cada columna (se van ANTES del morfo: rotarlas sería
                  un borrón ilegible; el renglón que queda ya dice la proporción con la forma) */}
              {CIFRAS.map((c, i) => {
                const a0 = 372 + i * 40;
                const op = ez(g, a0 + 20, a0 + 54) * numsOut;
                return (
                  <React.Fragment key={i}>
                    <Cifra x={GAP_X[i]} y={32.6} size={54} value={c.pTxt} unit={c.unit}
                      color={V.orange} opacity={op} />
                    {/* la 4ª medida NO se dibuja acá: es la cifra 68,6 que viene viajando del acto 1 */}
                    {i < 3 && (
                      <Cifra x={GAP_X[i]} y={60.6} size={66} value={c.mTxt} unit={c.unit}
                        color={V.volt} opacity={op} />
                    )}
                    <Rotulo x={GAP_X[i]} y={66.5} text={c.name}
                      color={i === 2 ? V.orange : rgba(V.white, 0.74)} opacity={op} />
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ── ACTO 3 · la cama de sombra sobre la mitad baja de la etiqueta y LA FRASE-ANCLA ── */}
          {scrim > 0.01 && (
            <AbsoluteFill style={{
              background: `linear-gradient(180deg, rgba(0,0,0,0) 44%, ${rgba(V.ink0, 0.5 * scrim)} 66%, ${rgba(V.ink0, 0.82 * scrim)} 100%)`,
            }} />
          )}
          {g >= 736 && g < F_A4 && (
            <div style={{
              position: "absolute", left: "50%", top: 596, width: 1180, marginLeft: -590,
              textAlign: "center",
            }}>
              <div style={{ opacity: ez(g, 742, 776), transform: `translateY(${((1 - ez(g, 742, 786)) * 22).toFixed(1)}px)` }}>
                <Head size={58}>EL NÚMERO GRANDE ESTÁ EN LA TAPA.</Head>
              </div>
              <div style={{ marginTop: 22, opacity: ez(g, 812, 846), transform: `translateY(${((1 - ez(g, 812, 856)) * 22).toFixed(1)}px)` }}>
                <Head size={70}>EL NÚMERO <Em>VERDADERO</Em> ESTÁ ATRÁS.</Head>
                <div style={{
                  margin: "16px auto 0", height: 5, width: Math.round(620 * ez(g, 856, 916)),
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.1)} 0%, ${V.volt} 22%, ${V.volt} 78%, ${rgba(V.volt, 0.1)} 100%)`,
                  boxShadow: `0 0 20px ${rgba(V.volt, 0.65)}`,
                }} />
              </div>
              <div style={{ marginTop: 26, opacity: ez(g, 894, 928), transform: `translateY(${((1 - ez(g, 894, 938)) * 22).toFixed(1)}px)` }}>
                <Head size={58}>LA DIFERENCIA <Em color={V.orange}>LA PAGAS TÚ</Em>.</Head>
              </div>
            </div>
          )}

          {/* ── EL RENGLÓN 4: la única materia que CRUZA la oclusión de f1082. Nace encima del
              renglón verde del tablero y sale del otro lado siendo el subrayado del 27. ── */}
          {g >= 1040 && g < 1330 && (
            <div style={{
              position: "absolute", left: r4X, top: r4Y, width: r4W, height: r4H,
              borderRadius: 3, opacity: (g < SEAM_OCC ? 1 : datoOut),
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.18)} 0%, ${V.volt} 16%, ${V.volt} 84%, ${rgba(V.volt, 0.18)} 100%)`,
              boxShadow: `0 0 ${Math.round(lerp(24, 16, r4))}px ${rgba(V.volt, 0.55)}`,
            }} />
          )}

          {/* ── ACTO 4 · el dato de la guía, entrando en verde (siempre desde la medición) ── */}
          {g >= 1196 && g < 1330 && (
            <div style={{ opacity: datoOut }}>
              <Readout value="27" label="EQUIPOS MEDIDOS UNO POR UNO" at={at(1200)}
                x={69.7} y={33} size={148} color={V.volt} />
              <Rotulo x={69.7} y={47.5} text="CON SU % REAL DE CUMPLIMIENTO"
                color={rgba(V.white, 0.76)} opacity={ez(g, 1236, 1270)} />
            </div>
          )}
        </Plane>

        {/* P5 · primer plano: el polvo del taller cruzando el haz (hold VIVO permanente) */}
        <Plane z={230}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 24) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, 0.1 + rnd(i * 3.7) * 0.2),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURA 3→4 · OCLUSIÓN con la MATERIA que cruza: la ETIQUETA PLATEADA (V.silver).
          Tapa el 100 % en f1091 y debajo cambia el fondo y entra la lámina. Nunca un fundido. ── */}
      <SeamOcclude at={at(SEAM_OCC)} dur={18} color={V.silver} angle={-7} lit={0.3} />

      {/* ── CAPA PLANA (fuera de la perspectiva): titulares, la lista de las cinco piezas y EL QR ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* las cinco piezas que enumera Claudio, encendiéndose una por una (acto 1) */}
        {g < 350 && (
          <div style={{
            position: "absolute", right: 64, top: 96,
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16,
          }}>
            {PIEZAS.map((p, i) => {
              const op = ez(g, p.at, p.at + 22) * (1 - ez(g, 316, 348));
              if (op <= 0.01) return null;
              const villano = i === 4;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 16, opacity: op,
                  transform: `translateX(${((1 - ez(g, p.at, p.at + 26)) * 26).toFixed(1)}px)`,
                }}>
                  <span style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 2.8,
                    color: villano ? V.orange : V.bone, textShadow: "0 4px 20px rgba(0,0,0,0.92)",
                  }}>{p.t}</span>
                  <Img src={staticFile(p.ic)} style={{
                    width: 56, height: 56, objectFit: "contain",
                    transform: `translateY(${(Math.sin(g / 53 + i * 1.7) * 2.6).toFixed(2)}px)`,
                    filter: `drop-shadow(0 10px 22px ${rgba(V.ink0, 0.85)})`,
                  }} />
                </div>
              );
            })}
          </div>
        )}

        <Titular g={g} inF={84} outF={318} kick="EL RESUMEN"
          head="CIENTO VEINTINUEVE. TREINTA DÍAS." size={66}
          sub="Cinco piezas, medidas una por una." />
        <Titular g={g} inF={392} outF={664} kick="PROMETIDO CONTRA MEDIDO"
          head="LAS CUATRO CIFRAS"
          sub="Ninguna de las cuatro llegó a lo que decía la tapa." />
        {/* acto 3 NO lleva titular: la única idea de texto es la frase-ancla escrita sobre la etiqueta */}
        <Titular g={g} inF={1108} outF={1372} kick="EL ATAJO"
          head="LA PRUEBA DE DIEZ MINUTOS" size={66}
          sub="Antes de que se te venza la devolución." />
        <Titular g={g} inF={1452} outF={1636} kick="LA GUÍA DEL CANAL"
          head="MIDE ANTES DE COMPRAR" size={68} />

        {/* ══════════════════════════════════════════════════════════════════════════════════
            EL CÓDIGO QR — ⛔ ZONA INTOCABLE.
            Plano, de frente, sin rotación 3D, sin perspectiva, sin blur, sin gradiente encima,
            sin recorte y sin nada por delante: es la última capa del árbol. 460×460 px reales
            sobre placa blanca con zona de silencio. Desde f1372 el contenedor no lleva NI UNA
            transformada (`transform: undefined`) y la opacidad ya es 1: queda absolutamente
            quieto durante los últimos 278 frames (9,3 s) del movimiento.
            ══════════════════════════════════════════════════════════════════════════════════ */}
        {g >= QR_IN && (
          <div style={{
            position: "absolute", left: 1150, top: 240, width: 560,
            opacity: qrOp,
            transform: qrRise > 0.01 ? `translateY(${qrRise.toFixed(2)}px)` : undefined,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4EE 100%)",
            borderRadius: 10,
            boxShadow: `0 26px 60px ${rgba(V.ink0, 0.8)}, 0 6px 18px ${rgba(V.ink0, 0.7)}`,
            padding: 20,
          }}>
            <div style={{
              width: 520, height: 520, background: "#FFFFFF", borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Img src={staticFile("img/cmetemu/cmet_qr.png")}
                style={{ width: 460, height: 460, display: "block" }} />
            </div>
            <div style={{
              width: 520, textAlign: "center", marginTop: 18,
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 3,
              textTransform: "uppercase", color: "#15170F",
            }}>
              Apunta la cámara
              <div style={{
                fontSize: 27, letterSpacing: 2.2, marginTop: 6, color: "#4A4E3C",
              }}>La guía del canal · Vol II</div>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
