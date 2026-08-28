// MovAdentro.tsx — S3 · Vienen cuatro cosas y faltan cuatro. Sin batería esto es un CARGADOR.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                  | sale (cám / luz / materia)
//  1   |    0 →  300 | z=-40 panX 0 · amber · PAPEL (hereda)         | z=+18 panX -79 · amber · el CARTÓN cenital
//  2   |  300 →  780 | z=+18 · amber · los 4 objetos en el carrusel  | z=+57 panX -132 · amber→volt · PLÁSTICO BLANCO
//  3   |  780 → 1160 | z=+57 · amber→volt · la espuma vacía          | z=+66 panX -145 · volt · el HUECO de la batería
//  4   | 1160 → 1470 | z=+66 · volt · el panel de noche, vidrio frío | z=+69 panX -149 · volt · luz
//  5   | 1470 → 1740 | z=+69 · volt · el rótulo reescrito            | z=+70 panX -150 · volt · la PANTALLITA AZUL
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=300   MATCH-SHAPE  · la MISMA tarjeta cenital (aden1) se achica y se inclina mientras
//                             el carrusel SALE de ella (radio 60 → 580, y 80 → 50)
//  2→3 f=780   OCLUSIÓN     · V.blade, angle 8 — el plástico blanco cruza
//  3→4 f=1160  ZOOM-THROUGH · la cámara entra por el hueco vacío de la BATERÍA (fx 34 / fy 46)
//  4→5 f=1470  CORTE EN EL BEAT · SeamFlash V.volt dur 8
//  5→⇥ f=1714  ZOOM-THROUGH · entra en la pantallita azul del regulador (fx 71 / fy 44) y entrega
//                             a MovAngulo en volt, z=+70, panX -150
// El corazón del movimiento son LOS CUATRO HUECOS VACÍOS: lo que NO viene en la caja. Es el único
// movimiento del video que usa `Carousel3D` (los cuatro objetos que sí vienen).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, Carousel3D, IconPng,
  SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1740;
const A1 = 300, A2 = 780, A3 = 1160, A4 = 1470;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

/** UN HUECO VACÍO de la espuma: contorno punteado + la silueta del objeto que NO vino.
 *  Es un DIAGRAMA de ausencia (por eso puede ser vector): no hay material que meterle adentro. */
const Hueco: React.FC<{ g: number; at: number; x: number; y: number; icon: string; label: string }> = ({ g, at, x, y, icon, label }) => {
  const p = ES(g, at, at + 26);
  if (p <= 0) return null;
  const w = 330, h = 200;
  return (
    <div style={{
      position: "absolute", left: x + "%", top: y + "%", width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: p,
      transform: "scale(" + (0.9 + 0.1 * p).toFixed(3) + ")",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
        border: "3px dashed " + rgba(V.white, 0.42),
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(6,7,4,0.62) 0%, rgba(6,7,4,0.34) 100%)",
        boxShadow: "inset 0 18px 40px rgba(0,0,0,0.7)",
      }} />
      <IconPng src={icon} x={50} y={22} size={104} opacity={0.34 * p} glow={V.ink0} />
      <div style={{ position: "absolute", left: 0, bottom: 16, width: "100%", textAlign: "center" }}>
        <Kick color={V.volt}>{label}</Kick>
      </div>
    </div>
  );
};

/** El rótulo de la caja REESCRITO por el kit: la palabra vieja tachada, la verdadera debajo. */
const Rotulo: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const p = ES(g, at, at + 20);
  const q = ES(g, at + 22, at + 46);
  return (
    <Bed pad={30} w={720}>
      <Kick color={V.bone}>LO QUE COMPRASTE NO ES</Kick>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Head size={104} color={rgba(V.bone, 0.72)}>UN EQUIPO</Head>
        <div style={{
          position: "absolute", left: 0, top: "52%", height: 8,
          width: (p * 100).toFixed(1) + "%",
          background: rgba(V.amber, 0.95), boxShadow: "0 4px 18px rgba(0,0,0,0.75)",
        }} />
      </div>
      <div style={{ opacity: q, transform: "translateY(" + ((1 - q) * 16).toFixed(1) + "px)" }}>
        <Head size={132} color={V.volt}>ES UN CARGADOR</Head>
        <Body size={30}>un panel solo <Em>no guarda nada</Em></Body>
      </div>
    </Bed>
  );
};

/** CAMA DE CLIP. ⛔ `PhotoPlane kind="video"` NO loopea: a los 153 cuadros el fondo se CONGELA
 *  y quedan 50 s de foto muerta. `MediaCard` sí loopea (monta una <Sequence> por vuelta), así que
 *  la cama es una MediaCard a sangre con radio 0 y su propio velo de sombra encima. */
const BedClip: React.FC<{ src: string; w?: number; x?: number; y?: number; dim: number; tint: string; op: number }> = ({
  src, w = 2760, x = 50, y = 50, dim, tint, op,
}) => (
  <Plane z={-520} style={{ transform: "translateZ(-520px)", opacity: op }}>
    <MediaCard src={src} kind="video" w={w} h={Math.round(w * 0.565)} x={x} y={y} z={0} radius={0}
      lit={0.5} litColor={tint} />
    <div style={{ position: "absolute", left: "-40%", top: "-40%", width: "180%", height: "180%", background: rgba(V.ink0, dim) }} />
    <div style={{ position: "absolute", left: "-40%", top: "-40%", width: "180%", height: "180%", background: rgba(tint, 0.05), mixBlendMode: "soft-light" }} />
  </Plane>
);

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const t = ES(g, 0, END);
  const cam = gcam(g, { z0: -40, z1: 70, panX: -150, panY: -18, ry: -4, rx: -3.0, dur: END });
  // la luz gira: el ámbar de la promesa se apaga y queda la medición
  const key = light(t, "amber", "volt");
  const keyF = lerp(0.48, 0.58, t);
  const flr = lerp(0.48, 0.45, t);

  // MATCH-SHAPE 1→2: la caja cenital se achica y se inclina; el carrusel SALE de adentro.
  const mm = ES(g, A1 - 60, A1 + 90);
  const cajaOp = LN(g, 0, 24) * (1 - LN(g, A2 + 4, A2 + 12));
  const car = ES(g, A1 - 50, A1 + 110);
  const carOp = LN(g, A1 - 44, A1 + 26) * (1 - LN(g, A2 + 2, A2 + 10));
  const spin = ES(g, A1 - 10, A2 - 50) * 0.78;
  const focus = Math.min(3, Math.max(0, Math.floor(LN(g, A1 + 20, A2 - 40) * 4)));

  // ZOOM-THROUGH 3→4 (el hueco de la batería) y 5→⇥ (la pantallita del regulador)
  const z34 = zoomThrough(g, A3 - 26, 26, 34, 46);
  const zEnd = zoomThrough(g, END - 26, 26, 71, 44);
  const engulf = LN(g, END - 18, END - 2);

  const opA3 = LN(g, A2 + 4, A2 + 14);
  const opA4 = LN(g, A3 - 8, A3 + 10) * (1 - LN(g, A4 - 4, A4 + 4));
  const opA5 = LN(g, A4 - 4, A4 + 4);

  return (
    <AbsoluteFill>
      <VoltAtmos tint={key} tint2={V.amber} keyFrom={keyF} intensity={1} floor={flr} />

      <AbsoluteFill style={{
        transform: zEnd.out === "none" ? undefined : zEnd.out,
        opacity: zEnd.opacity,
      }}>
        <Layers cam={cam.transform}>
          {/* ── CAMAS · el tablón con la caja abierta, y la noche del acto 4 ─────────────── */}
          <BedClip src="broll/cmesodimac/cmes_mv_aden1.mp4" w={3200} x={46} y={54} dim={0.62} tint={key} op={1 - LN(g, A3 - 60, A3 + 30)} />
          <BedClip src="broll/cmesodimac/cmes_mv_aden6.mp4" dim={0.52} tint={V.volt} op={LN(g, A3 - 60, A3 + 30)} />

          {/* ── ACTO 1→2 · LA CAJA CENITAL: la misma tarjeta, de sangre a bandeja inclinada ── */}
          <Plane z={-40} style={{ transform: "translateZ(-40px)", opacity: cajaOp }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_aden1.mp4" kind="video"
              w={lerp(1560, 560, mm)} h={lerp(870, 320, mm)}
              x={50} y={lerp(48, 82, mm)} z={lerp(0, -90, mm)}
              rx={lerp(0, 17, mm)} ry={lerp(-3, 0, mm)} radius={lerp(2, 16, mm)}
              lit={0.94} litColor={key} sheenAt={34} />
          </Plane>

          {/* ── ACTO 2 · EL CARRUSEL: los cuatro objetos que SÍ vienen ───────────────────── */}
          <Plane z={40} style={{ transform: "translateZ(40px)", opacity: carOp }}>
            <Carousel3D
              items={[
                { src: "broll/cmesodimac/cmes_mv_aden6.mp4", kind: "video", label: "EL PANEL" },
                { src: "img/cmesodimac/cmes_mv_aden2.jpg", kind: "photo", label: "EL REGULADOR" },
                { src: "img/cmesodimac/cmes_mv_aden3.jpg", kind: "photo", label: "EL CABLE" },
                { src: "img/cmesodimac/cmes_mv_aden4.jpg", kind: "photo", label: "EL MANUAL" },
              ]}
              spin={spin}
              radius={lerp(60, 580, car)}
              cardW={lerp(180, 470, car)} cardH={lerp(110, 286, car)}
              y={lerp(80, 50, car)} focus={focus} litColor={key}
            />
          </Plane>

          {/* ── ACTO 3 · LOS CUATRO HUECOS VACÍOS (sale por ZOOM-THROUGH al de la batería) ── */}
          <Plane z={-10} style={{
            transform: "translateZ(-10px)" + (z34.out === "none" ? "" : " " + z34.out),
            opacity: opA3 * z34.opacity,
          }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_aden5.mp4" kind="video"
              w={1600} h={890} x={50} y={50} z={0} ry={-2}
              lit={0.9} litColor={V.volt} sheenAt={A2 + 40} />
            <Hueco g={g} at={A2 + 50} x={34} y={46} icon="img/cmesodimac/cmes_ic_bateria.png" label="LA BATERÍA" />
            <Hueco g={g} at={A2 + 110} x={66} y={46} icon="img/cmesodimac/cmes_ic_inversor.png" label="EL INVERSOR" />
            <Hueco g={g} at={A2 + 170} x={34} y={72} icon="img/cmesodimac/cmes_ic_regla.png" label="EL SOPORTE" />
            <Hueco g={g} at={A2 + 230} x={66} y={72} icon="img/cmesodimac/cmes_ic_breaker.png" label="EL FUSIBLE" />
          </Plane>

          {/* ── ACTO 4 · el panel de noche: vidrio frío ──────────────────────────────────── */}
          <Plane z={-20} style={{ transform: "translateZ(-20px)", opacity: opA4 }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_aden6.mp4" kind="video"
              w={1620} h={900} x={50} y={48} z={0} ry={3}
              lit={0.62} litColor={V.volt} sheenAt={A3 + 40} label="LAS NUEVE DE LA NOCHE" />
          </Plane>

          {/* ── ACTO 5 · el rótulo reescrito, y el regulador que va a tragarse la cámara ─── */}
          <Plane z={-10} style={{ transform: "translateZ(-10px)", opacity: opA5 }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_aden1.mp4" kind="video"
              w={720} h={430} x={28} y={70} z={-40} ry={7} rot={-1.2}
              lit={0.78} litColor={key} label="LA CAJA" />
            <MediaCard src="img/cmesodimac/cmes_mv_aden2.jpg" kind="photo"
              w={lerp(520, 620, ES(g, A4 + 60, END - 40))} h={lerp(320, 382, ES(g, A4 + 60, END - 40))}
              x={71} y={44} z={lerp(60, 190, ES(g, A4 + 60, END - 40))} ry={-8}
              lit={1} litColor={V.volt} sheenAt={A4 + 40} label="LA PANTALLITA AZUL" />
          </Plane>

          {/* ── LAS PALABRAS (z +150) ────────────────────────────────────────────────────── */}
          <Plane z={150} style={{ transform: "translateZ(150px)" }}>
            <div style={{ position: "absolute", left: 132, top: 640, opacity: LN(g, 26, 66) * (1 - LN(g, A1 - 20, A1 + 26)) }}>
              <Bed pad={28} w={900}>
                <Kick>EMPECEMOS POR ABRIRLA</Kick>
                <Head size={80}>La mitad de la historia está adentro</Head>
                <Body size={30}>y la otra mitad está en <Em color={V.amber}>lo que no viene</Em></Body>
              </Bed>
            </div>

            <div style={{ position: "absolute", left: 132, top: 96, opacity: carOp }}>
              <Bed pad={26} w={760}>
                <Kick>LO QUE SÍ VIENE</Kick>
                <Head size={92}>Cuatro cosas</Head>
                <Body size={30}>panel · regulador · cable · manual</Body>
              </Bed>
            </div>

            <div style={{ position: "absolute", left: 132, top: 92, opacity: opA3 * z34.opacity }}>
              <Bed pad={26} w={760}>
                <Kick color={V.amber}>LO QUE NO VIENE</Kick>
                <Head size={92}>Cuatro huecos</Head>
                <Body size={30}>y son <Em>los cuatro que importan</Em></Body>
              </Bed>
            </div>

            <div style={{ position: "absolute", left: 132, top: 660, opacity: opA4 }}>
              <Bed pad={28} w={940}>
                <Kick color={V.volt}>A LAS NUEVE DE LA NOCHE</Kick>
                <Head size={86}>Un panel solo no guarda nada</Head>
                <Body size={30}>a esa hora es <Em>un pedazo de vidrio frío</Em></Body>
              </Bed>
            </div>
            <IconPng src="img/cmesodimac/cmes_ic_bombillanoche.png" x={85} y={26} size={140} z={40} opacity={opA4 * 0.85} rot={-5} />

            <div style={{ position: "absolute", left: 132, top: 120, opacity: opA5 }}>
              <Rotulo g={g} at={A4 + 26} />
            </div>
          </Plane>
        </Layers>
      </AbsoluteFill>

      {/* la pantallita azul se come el cuadro y entrega a MovAngulo en materia BLADE */}
      {engulf > 0 ? (
        <AbsoluteFill style={{
          background: "radial-gradient(58% 58% at 71% 44%, " + rgba(V.sky, 0.92 * engulf) + " 0%, "
            + rgba(V.blade, 0.72 * engulf) + " 46%, rgba(0,0,0,0) 80%)",
          mixBlendMode: "screen", pointerEvents: "none",
        }} />
      ) : null}

      {/* ── COSTURAS ────────────────────────────────────────────────────────────────────── */}
      <SeamOcclude at={A2} dur={16} color={V.blade} angle={8} />
      <SeamFlash at={A4} color={V.volt} dur={8} />
    </AbsoluteFill>
  );
};

export const MovAdentro: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
      <Sequence from={A1 - 40} durationInFrames={46} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={A2 - 6} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={A3 - 24} durationInFrames={46} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.46} />
      </Sequence>
      <Sequence from={A4 - 3} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.42} />
      </Sequence>
    </Sequence>
  );
};
