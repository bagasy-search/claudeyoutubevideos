// MovCaja.tsx — S1 · La caja promete una casa iluminada; la pinza dice cincuenta y tres.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                | sale (cám / luz / materia)
//  1   |    0 →  330 | z=-280 panX 0 · volt duro · CARTÓN          | z=-183 panX -36 · volt duro · la TAPA
//  2   |  330 →  640 | z=-183 · volt duro · la tapa A SANGRE       | z=-144 panX -51 · volt · PAPEL (el manual)
//  3   |  640 → 1010 | z=-144 · volt · CHAPA del techo             | z=-126 panX -58 · volt+amber · la MORDAZA
//  4   | 1010 → 1320 | z=-126 · volt+amber · pantalla de la PINZA  | z=-121 panX -60 · volt+amber · luz
//  5   | 1320 → 1560 | z=-121 · volt+amber · 100 amber vs 53 volt  | z=-120 panX -60 · volt+amber · CHAPA cruzando
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=330   MATCH-SHAPE  · la MISMA tarjeta de la tapa (caja2) crece de 360×230 a sangre
//  2→3 f=640   OCLUSIÓN     · V.paper, angle 9 — el manual cruza el lente
//  3→4 f=1010  ZOOM-THROUGH · la cámara entra en la mordaza de la pinza (fx 74 / fy 62)
//  4→5 f=1320  CORTE EN EL BEAT · SeamFlash V.volt dur 8
//  5→⇥ f=1550  OCLUSIÓN     · V.steel, angle 9 — la CHAPA cruza y entrega a MovTrato
// Los dos números del video: 100 SIEMPRE en V.amber con `Head` (la promesa impresa, sobre `Bed`),
// 53 SIEMPRE en V.volt con `Readout` (la medición viva, con unidad y jitter). Nunca se cruzan de color.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

const END = 1560;
const A1 = 330, A2 = 640, A3 = 1010, A4 = 1320;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const IV = (g: number, a: number, b: number, x: number, y: number) => lerp(x, y, ES(g, a, b));

/** LA BRECHA — el único vector del movimiento: un gráfico de verdad (la distancia entre 100 y 53). */
const Brecha: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const p = ES(g, at, at + 34);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: "40%", top: "49%", width: "20%", height: 120 }}>
      <div style={{ position: "absolute", left: 0, top: 46, width: (p * 100).toFixed(1) + "%", height: 3, background: rgba(V.white, 0.62) }} />
      <div style={{ position: "absolute", left: 0, top: 26, width: 3, height: 44, background: rgba(V.amber, 0.9 * p) }} />
      <div style={{ position: "absolute", right: 0, top: 26, width: 3, height: 44, background: rgba(V.volt, 0.9 * p) }} />
      <div style={{ position: "absolute", left: 0, top: 60, width: "100%", textAlign: "center", opacity: clamp01(p * 1.6 - 0.6) }}>
        <Body size={30} color={V.white}>faltan 47</Body>
      </div>
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const t = ES(g, 0, END);
  const cam = gcam(g, { z0: -280, z1: -120, panX: -60, panY: -24, ry: 6, rx: -2.4, dur: END });
  // la luz EVOLUCIONA: volt duro → volt+amber (no llega a ámbar pleno: eso pasa en MovTrato)
  const key = light(t * 0.55, "volt", "amber");
  const keyF = lerp(0.62, 0.55, t);
  const flr = lerp(0.45, 0.47, t);

  // ZOOM-THROUGH 3→4: el acto que SALE se escala hacia la mordaza de la pinza
  const z34 = zoomThrough(g, A3 - 26, 26, 74, 62);

  // MATCH-SHAPE 1→2: UNA sola instancia de la tapa, morfeada por g. Nunca se remonta.
  const mm = ES(g, A1 - 46, A1 + 64);
  const tapaOp = LN(g, 150, 188) * (1 - LN(g, A2 + 5, A2 + 13));

  const opGondola = 1 - LN(g, A1 + 4, A1 + 62);
  const opA3 = LN(g, A2 + 4, A2 + 14);
  const opA4 = LN(g, A3 - 10, A3 + 8) * (1 - LN(g, A4 - 4, A4 + 4));
  const opA5 = LN(g, A4 - 4, A4 + 4);

  return (
    <AbsoluteFill>
      <VoltAtmos tint={V.volt} tint2={V.amber} keyFrom={keyF} intensity={1} floor={flr} />

      <Layers cam={cam.transform}>
        {/* ── CAMA (z-520) · dos fotos montadas de punta a punta, se relevan sin remontarse ── */}
        {/* ⛔ z={0} en PhotoPlane: su -400 propio se SUMA al del Plane y el fondo deja de cubrir.
            `scale` compensa el achique por perspectiva a z=-520 (factor 0,74). */}
        <Plane z={-520} style={{ transform: "translateZ(-520px)", opacity: 1 - LN(g, A2 - 70, A2 + 40) }}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_caja2.jpg" z={0} scale={1.44} dim={0.52} tint={V.volt} />
        </Plane>
        <Plane z={-520} style={{ transform: "translateZ(-520px)", opacity: LN(g, A2 - 70, A2 + 40) }}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_caja5.jpg" z={0} scale={1.48} dim={0.56} tint={key} />
        </Plane>

        {/* ── ACTO 1 · la góndola ────────────────────────────────────────────────────────── */}
        <Plane z={-40} style={{ transform: "translateZ(-40px)", opacity: opGondola }}>
          <MediaCard src="broll/cmesodimac/cmes_mv_caja1.mp4" kind="video"
            w={1180} h={640} x={50} y={49} z={0} ry={-6} rx={1.4}
            lit={0.92} litColor={key} sheenAt={26} label="LA PUNTA DEL PASILLO" />
        </Plane>

        {/* ── ACTO 1→2 · LA TAPA: la misma tarjeta, de 360×230 a sangre ──────────────────── */}
        <Plane z={0} style={{ transform: "translateZ(0px)", opacity: tapaOp }}>
          <MediaCard src="img/cmesodimac/cmes_mv_caja2.jpg" kind="photo"
            w={lerp(360, 2180, mm)} h={lerp(230, 1240, mm)}
            x={lerp(70, 50, mm)} y={lerp(66, 50, mm)}
            z={lerp(96, -8, mm)} ry={lerp(-14, 0, mm)} rx={lerp(3, 0, mm)}
            radius={lerp(16, 0, mm)} lit={0.9} litColor={key} sheenAt={A1 + 30} />
        </Plane>

        {/* ── ACTO 3 · el panel plano sobre la chapa (sale por ZOOM-THROUGH) ─────────────── */}
        <Plane z={-20} style={{
          transform: "translateZ(-20px)" + (z34.out === "none" ? "" : " " + z34.out),
          opacity: opA3 * z34.opacity,
        }}>
          <MediaCard src="broll/cmesodimac/cmes_mv_caja3.mp4" kind="video"
            w={1520} h={840} x={50} y={47} z={0} ry={-4}
            lit={0.95} litColor={key} sheenAt={A2 + 40} label="TECHO DEL GALPÓN · 12:30" />
          {/* la mordaza que la cámara va a atravesar: entra chica a la derecha */}
          <MediaCard src="broll/cmesodimac/cmes_mv_caja4.mp4" kind="video"
            w={IV(g, A3 - 200, A3 - 30, 380, 470)} h={IV(g, A3 - 200, A3 - 30, 230, 290)}
            x={74} y={62} z={IV(g, A3 - 200, A3 - 30, 140, 210)} ry={-12}
            opacity={LN(g, A3 - 210, A3 - 160)}
            lit={1} litColor={V.volt} label="LA PINZA" />
        </Plane>

        {/* ── ACTO 4 · adentro de la pinza ───────────────────────────────────────────────── */}
        <Plane z={-10} style={{ transform: "translateZ(-10px)", opacity: opA4 }}>
          <MediaCard src="broll/cmesodimac/cmes_mv_caja4.mp4" kind="video"
            w={IV(g, A3, A3 + 210, 1440, 1560)} h={IV(g, A3, A3 + 210, 800, 866)}
            x={50} y={46} z={0} ry={3}
            lit={1} litColor={V.volt} sheenAt={A3 + 22} />
        </Plane>

        {/* ── ACTO 5 · 100 contra 53, y el hueco entre los dos ───────────────────────────── */}
        <Plane z={-10} style={{ transform: "translateZ(-10px)", opacity: opA5 }}>
          <MediaCard src="img/cmesodimac/cmes_mv_caja2.jpg" kind="photo"
            w={520} h={330} x={26} y={70} z={40} ry={9} rot={-1.4}
            lit={0.8} litColor={V.amber} label="LO QUE PROMETE" />
          <MediaCard src="broll/cmesodimac/cmes_mv_caja4.mp4" kind="video"
            w={520} h={330} x={74} y={70} z={40} ry={-9} rot={1.4}
            lit={1} litColor={V.volt} sheenAt={A4 + 24} label="LO QUE DA" />
        </Plane>

        {/* ── LAS CIFRAS Y LAS PALABRAS (z +150) ─────────────────────────────────────────── */}
        <Plane z={150} style={{ transform: "translateZ(150px)" }}>
          {/* acto 1 */}
          <div style={{ position: "absolute", left: 132, top: 636, opacity: opGondola }}>
            <Bed pad={26} w={720}>
              <Kick>LO QUE ME COSTÓ</Kick>
              <Head size={104} color={V.bone}>CIENTO DIEZ</Head>
              <Body size={30}>dólares · el equipo solar más barato de la góndola</Body>
            </Bed>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_caja.png" x={84} y={22} size={132} z={30} opacity={opGondola * 0.92} rot={-6} />

          {/* acto 2 — el 100: promesa IMPRESA. Head + Bed + amber. */}
          <div style={{ position: "absolute", left: 140, top: 214, opacity: LN(g, A1 + 46, A1 + 92) * (1 - LN(g, A2 + 2, A2 + 10)) }}>
            <Bed pad={30} w={640}>
              <Kick color={V.amber}>DICE LA CAJA</Kick>
              <Head size={196} color={V.amber}>100</Head>
              <Body size={32}>vatios · en números enormes, arriba a la izquierda</Body>
            </Bed>
          </div>

          {/* acto 3 */}
          <div style={{ position: "absolute", left: 132, top: 690, opacity: opA3 * z34.opacity * (1 - LN(g, A3 - 40, A3 - 10)) }}>
            <Bed pad={26} w={780}>
              <Kick>PRIMERA MEDICIÓN</Kick>
              <Head size={82}>Plano sobre la chapa</Head>
              <Body size={30}>como lo deja el noventa por ciento de la gente el primer día</Body>
            </Bed>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_sol.png" x={83} y={19} size={140} z={40} opacity={opA3 * z34.opacity * 0.9} />

          {/* acto 4 — el 53: medición VIVA. Readout + volt + unidad. */}
          <div style={{ opacity: opA4 }}>
            <Readout value="53" unit="W" label="DICE LA PINZA" at={A3 + 62} x={28} y={29} size={210} color={V.volt} />
            <div style={{ position: "absolute", left: 132, top: 780 }}>
              <Bed pad={22} w={620}><Body size={30}>doce y media del día · sol de frente, ni una nube</Body></Bed>
            </div>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_pinza.png" x={83} y={24} size={150} z={40} opacity={opA4 * 0.9} rot={5} />

          {/* acto 5 — los dos números enfrentados, y la brecha */}
          <div style={{ opacity: opA5 }}>
            <div style={{ position: "absolute", left: 150, top: 236 }}>
              <Bed pad={28} w={470}>
                <Kick color={V.amber}>DICE LA CAJA</Kick>
                <Head size={168} color={V.amber}>100</Head>
              </Bed>
            </div>
            <Readout value="53" unit="W" label="DICE LA PINZA" at={A4 + 14} x={75} y={31} size={168} color={V.volt} />
            <Brecha g={g} at={A4 + 52} />
          </div>
        </Plane>
      </Layers>

      {/* ── COSTURAS ──────────────────────────────────────────────────────────────────────── */}
      <SeamOcclude at={A2} dur={16} color={V.paper} angle={9} />
      <SeamFlash at={A4} color={V.volt} dur={8} />
      <SeamOcclude at={END - 10} dur={20} color={V.steel} angle={9} />
    </AbsoluteFill>
  );
};

export const MovCaja: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;                                   // acto={0} = "dibujá el movimiento entero"
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);     // adentro, useCurrentFrame() === gFrame
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
      <Sequence from={A2 - 6} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={A3 - 24} durationInFrames={46} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.46} />
      </Sequence>
      <Sequence from={A3 + 58} durationInFrames={46} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={A4 - 3} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.4} />
      </Sequence>
    </Sequence>
  );
};
