// MovAngulo.tsx — S4 (la prueba) · 30,8 s = 924 frames @30
// Espina: el rayo de plano es una bofetada; de costado la misma luz se reparte sobre mas
// superficie y cada centimetro recibe menos. Catorce vatios se los come la inclinacion.
//
// ⚠️ El anclaje COMPRIMIO este movimiento de 50 s a 30,8 s. Son 4 actos CORTOS (7-8 s cada uno),
// diseñados para esa duracion: un objeto y una idea por acto, sin aire de sobra.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames    | ENTRA (cam / luz / materia)                   | SALE (cam / luz / materia)
//  1   |   0 → 210 | z=+70 saliendo del ZOOM-THROUGH de MovAdentro | z≈+40 · volt aun duro
//      |           | (escala 1.62→1) · luz volt · PLASTICO BLANCO  | materia: EL HAZ de la linterna
//  2   | 210 → 444 | z≈+40 · volt tibio · el haz sobre el vidrio   | z≈-5 · volt→sky · VIDRIO
//      |           | materia: el mismo haz, mancha chica y densa   | el haz empieza a girar
//  3   | 444 → 690 | z≈-5 · mundo 2 montado a +1560 px (rail)      | z≈-38 · sky · VIDRIO/CIELO
//      |           | materia: EL MISMO HAZ, girado 40°, estirado   | la chapa entra a cruzar
//  4   | 690 → 924 | z≈-38 saliendo de la OCLUSION de chapa        | z=-60 · sky pleno · CIELO
//      |           | materia: acero → el panel de costado          | rail de SALIDA -1200 px
//
// HANDOFF DE SALIDA → MovCalor: z=-60, panX -190 acumulado, luz sky (cielo cubierto),
// materia VIDRIO/CIELO, y el mundo YA viajando a la izquierda: MovCalor entra con los
// 1000 px que faltan para completar el rail de 2200 del plan.
//
// ── COSTURAS (4 fronteras, 3 mecanicas distintas · NINGUNA es un fade) ───────────────────────
//  1→2  f=210  MATCH-SHAPE   el glow de la mordaza de la pinza ES el haz del sol: LA MISMA
//                            instancia (HazSolar) morfea x/y/w/h/rot. Nunca se remonta.
//  2→3  f=444  MATCH-MOVE    rail de 1560 px al mundo del angulo rasante. El haz suma +1560 a su
//                            x en la misma ventana, asi que el rail lo CANCELA: el haz queda
//                            quieto en pantalla girando 40° mientras el mundo cambia detras.
//  3→4  f=690  OCLUSION      V.steel (la chapa del techo) angle 9. Materia que cruza, no fade.
//  fin  f=924  MATCH-MOVE    rail de salida -1200 px (MovCalor completa los 2200).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 924;
const S12 = 210;
const S23 = 444;
const S34 = 690;

const RAIL_IN = 1560;   // el mundo de los actos 3-4 vive montado a +1560 px
const RAIL_OUT = 1200;  // rail de SALIDA hacia MovCalor
const PCT = (px: number) => (px / 1920) * 100;   // px de mundo → % de pantalla (MediaCard usa %)

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const WIN = (g: number, a: number, b: number) => Math.min(ES(g, a, a + 15), 1 - ES(g, b - 15, b));

// ── EL TITULAR (plano plano, fuera de la perspectiva · safe area 60 px) ──────────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string; side?: "left" | "right";
}> = ({ g, inF, outF, kick, head, sub, size = 66, kickColor = V.volt, side = "left" }) => {
  const a = WIN(g, inF, outF);
  if (a <= 0.004) return null;
  const dy = (1 - ES(g, inF, inF + 24)) * 26;
  const pos: React.CSSProperties = side === "right" ? { right: 78 } : { left: 78 };
  return (
    <div style={{
      position: "absolute", bottom: 108, width: 830, opacity: a, ...pos,
      transform: "translateY(" + dy.toFixed(1) + "px)",
      textAlign: side === "right" ? "right" : "left",
    }}>
      <Bed pad={24}>
        <Kick color={kickColor}>{kick}</Kick>
        <div style={{ marginTop: 8 }}><Head size={size}>{head}</Head></div>
        {sub && <div style={{ marginTop: 10 }}><Body size={30}>{sub}</Body></div>}
      </Bed>
    </div>
  );
};

// ── ⭐ EL HAZ — UNA SOLA INSTANCIA que cruza los 4 actos (el MATCH-SHAPE y el MATCH-MOVE) ─────
// acto 1: es el glow de la mordaza de la pinza. acto 2: la mancha perpendicular, chica y densa.
// acto 3: la MISMA mancha girada 40° y estirada — se reparte y se apaga. acto 4: se hunde en el 14.
const HazSolar: React.FC<{ g: number }> = ({ g }) => {
  const t1 = ES(g, S12 - 84, S12 + 22);      // mordaza  → mancha densa
  const t2 = ES(g, S23 - 70, S23 + 34);      // gira 40° y se estira (viaja con el rail)
  const t3 = ES(g, S34 - 30, S34 + 74);      // se apaga adentro de la cifra
  const x = lerp(lerp(1206, 902, t1), 902 + RAIL_IN, t2);
  const y = lerp(lerp(452, 566, t1), 598, t2);
  const w = lerp(lerp(184, 322, t1), 908, t2);
  const h = lerp(lerp(184, 312, t1), 196, t2);
  const rot = lerp(0, 40, t2);
  const sc = 1 - 0.58 * t3;
  const op = lerp(lerp(0.52, 0.98, t1), 0.4, t2) * (1 - 0.88 * t3);
  const blur = lerp(lerp(24, 11, t1), 32, t2);
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h,
      transform: "rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")",
      borderRadius: "50%",
      background: "radial-gradient(closest-side, " + rgba(V.torch, 0.94 * op) + ", "
        + rgba(V.torch, 0.3 * op) + " 44%, rgba(0,0,0,0) 76%)",
      filter: "blur(" + blur.toFixed(1) + "px)", mixBlendMode: "screen", pointerEvents: "none",
    }} />
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CAMARA: una sola, funcion de g, nunca vuelve a 0 ───────────────────────────────────
  const cam = gcam(g, { z0: 70, z1: -60, panX: -190, panY: -34, ry: -7, rx: -2.2, dur: END });
  // salimos del ZOOM-THROUGH de MovAdentro: la escala se asienta en 26 frames
  const entra = lerp(1.62, 1, eio(0, 1, LN(g, 0, 26)));
  // MATCH-MOVE: el rail se SUMA al final de la cadena de gcam
  const rail = -RAIL_IN * ES(g, S23 - 70, S23 + 34) - RAIL_OUT * ES(g, END - 32, END);
  const world = cam.transform + " translate3d(" + rail.toFixed(1) + "px,0,0) scale(" + entra.toFixed(3) + ")";

  // ── LA LUZ: volt (la medicion) → sky (cielo cubierto). Evoluciona, no salta ────────────────
  const key = light(ES(g, 60, END - 40), "volt", "sky");
  const keyFrom = 0.62 - 0.22 * ES(g, 0, END);
  const floor = 0.45 + 0.07 * ES(g, S23, END);

  const A1 = g < S12 + 6;
  const A2 = g >= S12 - 6 && g < S23 + 8;
  const A3 = g >= S23 - 8 && g < S34 + 7;
  const A4 = g >= S34 + 7;

  const cae = ES(g, S34 + 26, S34 + 92);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* atmosfera: se monta UNA vez y no se remonta entre actos */}
      <VoltAtmos tint={V.volt} tint2={V.sky} keyFrom={keyFrom} intensity={0.98} floor={floor} />

      {/* LA CAMA: el patio no viaja con el rail — el mundo se va, el lugar se queda */}
      <Layers cam={cam.transform}>
        <Plane z={-520}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_angu4.jpg" dim={0.56} tint={V.sky} scale={1.22} />
        </Plane>
      </Layers>

      {/* LA MESA + EL HAZ: esto SI viaja con el rail */}
      <Layers cam={world}>
        {/* ── ACTO 1 · la pinza en el cable del panel ── */}
        {A1 && (
          <Plane z={-40} style={{ opacity: WIN(g, -20, S12 + 6) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_angu1.mp4" kind="video"
              w={980} h={560} x={57} y={49} z={0} ry={-8} rx={2}
              lit={0.96} litColor={key} sheenAt={44} label="LA PINZA · EN EL CABLE DEL PANEL" />
            <IconPng src="img/cmesodimac/cmes_ic_pinza.png" x={19} y={62} size={148} z={130} opacity={0.94} rot={-8} />
          </Plane>
        )}

        {/* ── ACTO 2 · el haz de frente: mancha chica y densa ── */}
        {A2 && (
          <Plane z={-30} style={{ opacity: WIN(g, S12 - 6, S23 + 8) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_angu2.mp4" kind="video"
              w={1060} h={600} x={47} y={51} z={0} ry={5} rx={-1.6}
              lit={0.98} litColor={key} sheenAt={S12 + 34} label="PERPENDICULAR · DE FRENTE" />
          </Plane>
        )}

        {/* ── ACTO 3 · MUNDO 2 (montado a +1560 px): el mismo haz, rasante ── */}
        {A3 && (
          <Plane z={-30} style={{ opacity: WIN(g, S23 - 8, S34 + 7) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_angu3.mp4" kind="video"
              w={1060} h={600} x={47 + PCT(RAIL_IN)} y={53} z={0} ry={-9} rx={-2.4}
              lit={0.66} litColor={key} sheenAt={S23 + 40} label="RASANTE · DE COSTADO" />
            <IconPng src="img/cmesodimac/cmes_ic_sol.png"
              x={20 + PCT(RAIL_IN)} y={16} size={124} z={150} opacity={0.8} rot={6} glow={V.amber} />
          </Plane>
        )}

        {/* ── ACTO 4 · el panel de costado, el cielo en el vidrio, y los 14 que faltan ── */}
        {A4 && (
          <Plane z={-20} style={{ opacity: WIN(g, S34 + 7, END + 40) }}>
            <MediaCard src="img/cmesodimac/cmes_mv_angu4.jpg" kind="photo"
              w={1010} h={580} x={40 + PCT(RAIL_IN)} y={49} z={0} ry={7} rx={-2}
              lit={0.9} litColor={key} sheenAt={S34 + 40} label="EL PANEL, PLANO SOBRE LA CHAPA" />
            <IconPng src="img/cmesodimac/cmes_ic_regla.png"
              x={72 + PCT(RAIL_IN)} y={74} size={116} z={140} opacity={0.85} rot={-14} />
          </Plane>
        )}

        {/* ⭐ EL HAZ — la misma instancia, siempre montada, encima de la mesa */}
        <Plane z={70}><HazSolar g={g} /></Plane>
      </Layers>

      {/* ── COSTURA 3→4: la CHAPA cruza (materia, nunca fade) ── */}
      <SeamOcclude at={S34 - 8} dur={16} color={V.steel} angle={9} />

      {/* ── LAS CIFRAS Y EL TEXTO: plano plano, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* acto 1 — la unica idea: 71 vatios saliendo del panel */}
        <Titular g={g} inF={22} outF={S12 - 4} kick="PRIMERA MEDICION"
          head="4,1 A x 17,4 V" sub="En el cable que sale del panel, antes del regulador." size={72} />
        {g >= 96 && g < S12 + 4 && (
          <div style={{ opacity: WIN(g, 96, S12 + 4) }}>
            <Readout value="71" unit="W" label="saliendo del panel" at={112} x={76} y={27} size={168} color={V.volt} />
          </div>
        )}

        {/* acto 2 — la bofetada de plano */}
        <Titular g={g} inF={S12 + 16} outF={S23 - 6} kick="EL ANGULO"
          head="DE FRENTE: UNA BOFETADA" sub="El panel entrega el maximo cuando el rayo le pega perpendicular." />

        {/* acto 3 — la misma luz, mas superficie */}
        <Titular g={g} inF={S23 + 22} outF={S34 - 6} side="right" kick="LA MISMA LUZ"
          head="MAS SUPERFICIE, MENOS POR CENTIMETRO" size={58}
          sub="Se reparte. Y el panel esta plano, mirando al cielo." />

        {/* acto 4 — LA CIFRA: 14 vatios en amber, cayendo del contador de 71 */}
        {g >= S34 + 18 && (
          <div style={{
            position: "absolute", left: 96, top: 168, opacity: WIN(g, S34 + 18, END + 60),
            transform: "translateY(" + lerp(-58, 0, cae).toFixed(1) + "px)",
          }}>
            <Bed pad={26} w={560}>
              <Kick color={V.amber}>SE LOS COME LA INCLINACION</Kick>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 16 }}>
                <Num size={200} color={V.amber}>14</Num>
                <Head size={44} color={V.amber}>vatios</Head>
              </div>
              <div style={{ marginTop: 8 }}><Body size={29}>De los 71 que salian del panel.</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ── SFX (3, con moderacion) ── */}
      <Sequence from={110} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={S23 - 64} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.36} />
      </Sequence>
      <Sequence from={S34 - 8} durationInFrames={44} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.34} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovAngulo: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;                                   // acto={0} = "dibuja el movimiento entero"
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);     // adentro, useCurrentFrame() === gFrame
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
