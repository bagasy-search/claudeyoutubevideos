// MovTrato.tsx — S2 · Yo no te vendo nada, yo mido. Y te digo las tres cosas que esto NO es.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                 | sale (cám / luz / materia)
//  1   |    0 →  300 | z=-120 panX 0 · volt+amber · CHAPA (hereda)  | z=-69 panX -67 · volt+amber · el TABLÓN
//  2   |  300 →  620 | z=-69 · volt+amber · el imán (mundo +1800)   | z=-49 panX -94 · amber tibio · luz
//  3   |  620 →  940 | z=-49 · amber tibio · la puerta del freezer  | z=-42 panX -103 · amber · ACERO
//  4   |  940 → 1320 | z=-42 · amber · la boleta de luz            | z=-40 panX -105 · amber · PAPEL cruzando
// El mundo 2 (el MURO DE LAS TRES PROMESAS) vive montado a +1800 px; la cámara viaja hasta él
// con `rail` sumado al final de la cadena de gcam. Las tres tarjetas se montan UNA vez y se
// morfean por `g` (hero → thumb → fila): jamás se remontan.
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=300   MATCH-MOVE   · rail -1800 px al muro de las tres promesas (f 210 → 320)
//  2→3 f=620   CORTE EN EL BEAT · SeamFlash V.volt dur 8
//  3→4 f=940   OCLUSIÓN     · V.steel, angle -7 — la puerta de acero cruza
//  4→⇥ f=1308  WIPE POR MATERIA · V.paper — el papel del manual cruza y entrega a MovAdentro
// El 100 (amber/Head) y el 53 (volt/Readout) no aparecen acá: este movimiento es el escudo de
// honestidad, y las tres X que tachan las promesas son AMBER (matan promesas, no mediciones).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, IconPng,
  SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1320;
const A1 = 300, A2 = 620, A3 = 940;
const WX = 1800;                 // el muro de las tres promesas vive acá

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

/** LA TACHA — vector legítimo (es un signo, no una tarjeta): dos barras que se dibujan sobre la
 *  materia real de la promesa. Siempre AMBER: lo que se tacha es lo que la caja prometía. */
const Tacha: React.FC<{ g: number; at: number; cx: number; cy: number; w: number; h: number }> = ({ g, at, cx, cy, w, h }) => {
  const p1 = ES(g, at, at + 13);
  const p2 = ES(g, at + 9, at + 24);
  if (p1 <= 0) return null;
  const len = Math.sqrt(w * w + h * h) * 0.94;
  const ang = (Math.atan2(h, w) * 180) / Math.PI;
  const bar = (a: number, p: number): React.CSSProperties => ({
    position: "absolute", left: "50%", top: "50%",
    width: len, height: Math.max(6, h * 0.036),
    marginLeft: -len / 2, marginTop: -Math.max(3, h * 0.018),
    background: rgba(V.amber, 0.94),
    boxShadow: "0 6px 22px rgba(0,0,0,0.7)",
    transform: "rotate(" + a.toFixed(2) + "deg) scaleX(" + p.toFixed(3) + ")",
    transformOrigin: "0% 50%",
  });
  return (
    <div style={{ position: "absolute", left: cx + "%", top: cy + "%", width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2 }}>
      <div style={bar(ang, p1)} />
      <div style={bar(-ang, p2)} />
    </div>
  );
};

/** CAMA DE CLIP. ⛔ `PhotoPlane kind="video"` NO loopea: a los 153 cuadros el fondo se CONGELA
 *  y quedan 34 s de foto muerta. `MediaCard` sí loopea (monta una <Sequence> por vuelta), así que
 *  la cama es una MediaCard a sangre con radio 0 y su propio velo de sombra encima. */
const BedClip: React.FC<{ src: string; w?: number; x?: number; y?: number; dim: number; tint: string; shift?: string }> = ({
  src, w = 2760, x = 50, y = 50, dim, tint, shift = "",
}) => (
  <Plane z={-520} style={{ transform: "translateZ(-520px)" + (shift ? " " + shift : "") }}>
    <MediaCard src={src} kind="video" w={w} h={Math.round(w * 0.565)} x={x} y={y} z={0} radius={0}
      lit={0.5} litColor={tint} />
    <div style={{ position: "absolute", left: "-40%", top: "-40%", width: "180%", height: "180%", background: rgba(V.ink0, dim) }} />
    <div style={{ position: "absolute", left: "-40%", top: "-40%", width: "180%", height: "180%", background: rgba(tint, 0.05), mixBlendMode: "soft-light" }} />
  </Plane>
);

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const t = ES(g, 0, END);
  const cam = gcam(g, { z0: -120, z1: -40, panX: -105, panY: -30, ry: 3, rx: -1.8, dur: END });
  const rail = -WX * ES(g, A1 - 90, A1 + 20);
  // volt+amber → amber pleno
  const key = light(lerp(0.35, 1, t), "volt", "amber");
  const keyF = lerp(0.55, 0.48, t);
  const flr = lerp(0.47, 0.5, t);

  // el ladder de las tres tarjetas: hero → thumb → fila. Deltas encadenados, nunca remontaje.
  const s2 = ES(g, A2 - 46, A2 + 34);
  const s3 = ES(g, A3 - 46, A3 + 34);
  const s4 = ES(g, 1110, 1210);

  const imanX = 50 + (22 - 50) * s2 + (18 - 22) * s4;
  const imanY = 46 + (76 - 46) * s2 + (66 - 76) * s4;
  const imanW = 900 + (330 - 900) * s2 + (430 - 330) * s4;
  const imanH = 500 + (180 - 500) * s2 + (250 - 180) * s4;

  const frioY = 46 + (76 - 46) * s3 + (66 - 76) * s4;
  const frioW = 900 + (330 - 900) * s3 + (430 - 330) * s4;
  const frioH = 500 + (180 - 500) * s3 + (250 - 180) * s4;

  const boleX = 50 + (82 - 50) * s4;
  const boleY = 46 + (66 - 46) * s4;
  const boleW = 900 + (430 - 900) * s4;
  const boleH = 500 + (250 - 500) * s4;

  const opMundo1 = 1 - LN(g, A1 + 30, A1 + 44);
  const opIman = LN(g, 292, 332);
  const opFrio = LN(g, A2 - 30, A2 + 6);
  const opBole = LN(g, A3 + 3, A3 + 11);

  const W2 = "translateX(" + WX + "px)";

  return (
    <AbsoluteFill>
      <VoltAtmos tint={V.volt} tint2={V.amber} keyFrom={keyF} intensity={1} floor={flr} />

      <Layers cam={cam.transform + " translate3d(" + rail.toFixed(1) + "px,0,0)"}>
        {/* ── CAMAS · el mismo tablón a los dos lados del riel: el patio es continuo ──────── */}
        <BedClip src="broll/cmesodimac/cmes_mv_trat1.mp4" dim={0.58} tint={V.volt} />
        <BedClip src="broll/cmesodimac/cmes_mv_trat1.mp4" w={3320} x={43} y={57} dim={0.64} tint={key} shift={W2} />

        {/* ══ MUNDO 1 · el tablón, la pinza y el medidor ═══════════════════════════════════ */}
        <Plane z={-30} style={{ transform: "translateZ(-30px)", opacity: opMundo1 }}>
          <MediaCard src="broll/cmesodimac/cmes_mv_trat1.mp4" kind="video"
            w={1240} h={690} x={50} y={48} z={0} ry={-5} rx={1.2}
            lit={0.95} litColor={key} sheenAt={34} label="LAS DOS HERRAMIENTAS" />
        </Plane>
        <Plane z={150} style={{ transform: "translateZ(150px)", opacity: opMundo1 }}>
          <div style={{ position: "absolute", left: 136, top: 646 }}>
            <Bed pad={28} w={860}>
              <Kick>EL TRATO DE SIEMPRE</Kick>
              <Head size={86}>Yo no te vendo nada.</Head>
              <Head size={86} color={V.volt}>Yo mido.</Head>
            </Bed>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_tester.png" x={83} y={21} size={144} z={40} opacity={0.9} rot={-7} />
        </Plane>

        {/* ══ MUNDO 2 (+1800) · EL MURO DE LAS TRES PROMESAS ══════════════════════════════ */}
        <Plane z={-20} style={{ transform: "translateZ(-20px) " + W2 }}>
          <div style={{ opacity: opIman }}>
            <MediaCard src="img/cmesodimac/cmes_mv_trat2.jpg" kind="photo"
              w={imanW} h={imanH} x={imanX} y={imanY} z={0} ry={-4}
              lit={0.9} litColor={key} sheenAt={A1 + 40} label="ENERGÍA GRATIS" />
            <Tacha g={g} at={A1 + 52} cx={imanX} cy={imanY} w={imanW} h={imanH} />
          </div>
          <div style={{ opacity: opFrio }}>
            <MediaCard src="img/cmesodimac/cmes_mv_trat3.jpg" kind="photo"
              w={frioW} h={frioH} x={50} y={frioY} z={0} ry={2}
              lit={0.92} litColor={key} sheenAt={A2 + 30} label="EL REFRIGERADOR" />
            <Tacha g={g} at={A2 + 48} cx={50} cy={frioY} w={frioW} h={frioH} />
          </div>
          <div style={{ opacity: opBole }}>
            <MediaCard src="img/cmesodimac/cmes_mv_trat4.jpg" kind="photo"
              w={boleW} h={boleH} x={boleX} y={boleY} z={0} ry={-3} rot={0.8}
              lit={0.95} litColor={V.amber} sheenAt={A3 + 34} label="LA FACTURA" />
            <Tacha g={g} at={A3 + 54} cx={boleX} cy={boleY} w={boleW} h={boleH} />
          </div>
        </Plane>

        {/* ── EL TITULAR: una sola ranura arriba a la izquierda, tres ideas que se relevan ── */}
        <Plane z={150} style={{ transform: "translateZ(150px) " + W2 }}>
          <div style={{ position: "absolute", left: 136, top: 92, opacity: opIman * (1 - LN(g, A2 - 8, A2 + 4)) }}>
            <Bed pad={26} w={880}>
              <Kick color={V.amber}>ESTO NO ES</Kick>
              <Head size={78}>Energía gratis</Head>
              <Body size={30}>yo no hago videos de <Em>motores que giran solos</Em></Body>
            </Bed>
          </div>
          <div style={{ position: "absolute", left: 136, top: 92, opacity: opFrio * (1 - LN(g, A3 + 2, A3 + 10)) }}>
            <Bed pad={26} w={880}>
              <Kick color={V.amber}>ESTO NO HACE</Kick>
              <Head size={78}>Mover el refrigerador</Head>
              <Body size={30}>y te lo voy a demostrar <Em>con números medidos</Em></Body>
            </Bed>
          </div>
          <div style={{ position: "absolute", left: 136, top: 92, opacity: opBole }}>
            <Bed pad={26} w={880}>
              <Kick color={V.amber}>ESTO NO TE</Kick>
              <Head size={78}>Baja la factura</Head>
              <Body size={30}>lo digo en el minuto tres, <Em>no escondido en el veinte</Em></Body>
            </Bed>
          </div>
          <IconPng src="img/cmesodimac/cmes_ic_billete.png" x={86} y={24} size={130} z={40} opacity={opBole * 0.88} rot={6} />
        </Plane>
      </Layers>

      {/* ── COSTURAS ──────────────────────────────────────────────────────────────────────── */}
      <SeamFlash at={A2} color={V.volt} dur={8} />
      <SeamOcclude at={A3} dur={16} color={V.steel} angle={-7} />
      <SeamWipeMatter at={END - 12} dur={24} tint={V.paper} />
    </AbsoluteFill>
  );
};

export const MovTrato: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
      <Sequence from={A1 - 96} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.44} />
      </Sequence>
      <Sequence from={A1 + 50} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/node_pop.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={A2 + 46} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/node_pop.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={A3 + 52} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/node_pop.mp3")} volume={0.44} />
      </Sequence>
    </Sequence>
  );
};
