// MovInversor.tsx — S11 · Ocho vatios sin nada enchufado se comen el 60 % de todo el día de sol.
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                   | sale (cám / luz / materia)
//  1   |    0 →  320 | z=-40 panX+90 · volt bajo .34 · plomo/plástico | z≈-51 · torch→volt · el enchufe hembra VACÍO
//  2   |  320 →  700 | z≈-51 · volt bajo · cobre del cable de batería | z≈-63 · volt · plástico blanco de la pinza
//  3   |  700 → 1100 | z≈-63 · volt · vidrio del vaso de 310 Wh       | z≈-78 · volt · la silueta del vaso
//  4   | 1100 → 1440 | z≈-78 · volt · el interruptor rojo (silueta)   | z≈-89 · volt bajo · la caja gris del inversor
//  5   | 1440 → 1740 | z≈-89 · volt bajo .28 · etiqueta negra         | z=-100 panX+90 · volt bajo · plástico blanco → MovPeligro
// ── COSTURAS (ninguna es un fade) ───────────────────────────────────────────────────────────
//  1→2 f=320  ZOOM-THROUGH al enchufe vacío (at 302, dur 18, foco 62/56) · el acto 2 ya está debajo
//  2→3 f=700  OCLUSIÓN V.blade (el plástico blanco de la pinza cruza el cuadro)
//  3→4 f=1100 MATCH-SHAPE (la MISMA silueta: el vaso de 310 se achica y se vuelve el interruptor rojo)
//  4→5 f=1440 CORTE EN EL BEAT SeamFlash volt (y ahí cambia la cama de foto)
//  5→▸ f=1740 CORTE EN EL BEAT SeamFlash volt → MovPeligro (que entra con plástico blanco)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

const END = 1740;
const A2 = 320, A3 = 700, A4 = 1100, A5 = 1440;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
/** opacidad de un acto: entra y sale DENTRO de su costura, nunca como fade suelto */
const OP = (g: number, a: number, b: number, fi = 12, fo = 12) =>
  Math.min(LN(g, a, a + fi), 1 - LN(g, b - fo, b));

/** El vaso de 310 Wh — y la MISMA silueta que en el acto 4 es el interruptor rojo. */
const Silueta: React.FC<{ g: number }> = ({ g }) => {
  const m = ES(g, A4 - 70, A4 + 10);                    // morfeo vaso → interruptor
  const cx = lerp(560, 1120, m), cy = lerp(556, 500, m);
  const w = lerp(240, 300, m), h = lerp(520, 150, m);
  const r = lerp(20, 14, m);
  const nivel = lerp(1, 0.397, ES(g, 800, 1000));       // 310 → 123 Wh (se fue el 60 %)
  const vive = OP(g, A3 - 26, A4 + 190, 22, 40);
  if (vive <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
      borderRadius: r, border: `2px solid ${rgba(V.volt, 0.62)}`,
      background: rgba(V.ink0, 0.40), overflow: "hidden", opacity: vive,
      boxShadow: `0 22px 60px ${rgba(V.ink0, 0.8)}, inset 0 0 40px ${rgba(V.volt, 0.10)}`,
    }}>
      {/* lo que se comió el inversor: banda rayada arriba del nivel */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, height: `${((1 - nivel) * 100).toFixed(2)}%`,
        background: `repeating-linear-gradient(126deg, ${rgba(V.volt, 0.13)} 0px, ${rgba(V.volt, 0.13)} 3px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 13px)`,
        opacity: 1 - m,
      }} />
      {/* lo que queda de los 310 Wh */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: `${(nivel * 100).toFixed(2)}%`,
        background: `linear-gradient(180deg, ${rgba(V.volt, 0.80)} 0%, ${rgba(V.volt, 0.34)} 100%)`,
        borderTop: `3px solid ${V.volt}`, opacity: 1 - m,
      }} />
      {/* al final la silueta queda como el bisel del interruptor */}
      <div style={{
        position: "absolute", left: 6, top: 6, right: 6, bottom: 6, borderRadius: Math.max(4, r - 6),
        border: `2px solid ${rgba(V.volt, 0.85 * m)}`,
      }} />
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: -40, z1: -100, panX: 90, panY: -30, ry: -6, rx: -3.2, dur: END });
  const key = light(LN(g, 0, END), "torch", "volt");
  const zoom = zoomThrough(g, A2 - 18, 18, 62, 56);

  const o1 = OP(g, -20, A2 + 2, 1, 10);
  const o2 = OP(g, A2 - 12, A3 + 6, 14, 12);
  const o3 = OP(g, A3 - 6, A4 + 200, 14, 40);
  const o4 = OP(g, A4 - 60, A5 + 6, 40, 12);
  const o5 = OP(g, A5 - 6, END + 60, 14, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos
        tint={V.torch} tint2={V.volt}
        keyFrom={lerp(0.34, 0.28, LN(g, 0, END))}
        intensity={0.94} floor={lerp(0.72, 0.68, LN(g, 0, END))}
      />
      <Layers cam={cam.transform}>
        {/* ── LA CAMA (nunca falta) · el galpón de noche con la tira de doce volts ── */}
        <Plane z={-520}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_inve5.jpg"
            dim={lerp(0.60, 0.52, LN(g, 0, A5))} tint={V.volt} scale={1.16} />
          {g > A5 - 8 && (
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: LN(g, A5 - 6, A5 + 6) }}>
              <PhotoPlane src="img/cmesodimac/cmes_mv_inve4.jpg" dim={0.58} tint={V.volt} scale={1.22} />
            </div>
          )}
        </Plane>

        {/* ── ACTO 1 · el inversor prendido y NADA enchufado ─────────────────────── */}
        {o1 > 0 && (
          <AbsoluteFill style={{ opacity: o1, transform: zoom.out, transformStyle: "preserve-3d" }}>
            <Plane z={-60}>
              <MediaCard src="broll/cmesodimac/cmes_mv_inve1.mp4" kind="video"
                w={1020} h={580} x={49} y={51} ry={-5} rx={1.4} lit={0.96} litColor={key}
                sheenAt={38} label="EL INVERSOR, PRENDIDO" />
            </Plane>
            <Plane z={150}>
              <div style={{ position: "absolute", left: 122, top: 150 }}>
                <Bed pad={24} w={640}>
                  <Kick>NADA ENCHUFADO</Kick>
                  <Head size={78}>Cero aparatos.</Head>
                  <div style={{ height: 10 }} />
                  <Body size={30}>El enchufe hembra, vacío. Y la pinza igual marca.</Body>
                </Bed>
              </div>
              <IconPng src="img/cmesodimac/cmes_ic_enchufe.png" x={80} y={22} size={128} z={40} opacity={0.9} />
            </Plane>
          </AbsoluteFill>
        )}

        {/* ── ACTO 2 · la pinza en el cable de la batería ────────────────────────── */}
        {o2 > 0 && (
          <AbsoluteFill style={{ opacity: o2, transformStyle: "preserve-3d" }}>
            <Plane z={-40}>
              <MediaCard src="broll/cmesodimac/cmes_mv_inve2.mp4" kind="video"
                w={940} h={540} x={41} y={53} ry={7} lit={0.92} litColor={key}
                sheenAt={A2 + 30} label="LA PINZA EN EL CABLE" />
            </Plane>
            <Plane z={160}>
              <Readout value="0,65" unit="A" label="CON NADA ENCHUFADO"
                at={A2 + 52} x={78} y={31} size={140} color={V.volt} />
              <div style={{ position: "absolute", left: 1180, top: 620, opacity: LN(g, A2 + 236, A2 + 252) }}>
                <Bed pad={22} w={470}>
                  <Kick>A DOCE VOLTS</Kick>
                  <Num size={96}>7,8 W</Num>
                </Bed>
              </div>
            </Plane>
          </AbsoluteFill>
        )}

        {/* ── ACTO 3 · el vaso de 310 que se vacía solo ──────────────────────────── */}
        {o3 > 0 && (
          <AbsoluteFill style={{ opacity: o3, transformStyle: "preserve-3d" }}>
            <Plane z={-70}>
              <MediaCard src="broll/cmesodimac/cmes_mv_inve1.mp4" kind="video"
                w={440} h={264} x={79} y={72} ry={-9} lit={0.72} litColor={key}
                startFrom={22} opacity={OP(g, A3 - 6, A4 + 40, 20, 34)} label="PRENDIDO, SIN NADA" />
            </Plane>
            <Plane z={120}>
              <Silueta g={g} />
              <div style={{
                position: "absolute", left: 700, top: 274, opacity: OP(g, A3 + 40, A4 - 60, 16, 26),
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.2, color: rgba(V.voltSoft, 0.92),
              }}>310 Wh · TODO EL DÍA DE SOL</div>
              <div style={{ position: "absolute", left: 700, top: 340, opacity: OP(g, A3 + 190, A4 - 46, 16, 24) }}>
                <Bed pad={22} w={560}>
                  <Kick>SIN HACER NADA</Kick>
                  <Head size={62}>Ciento ochenta y siete <Em>por día</Em>.</Head>
                </Bed>
              </div>
              <div style={{ opacity: OP(g, A3 + 300, A4 - 34, 14, 22) }}>
                <Readout value="60 %" label="DE TODO LO QUE JUNTÓ EL PANEL"
                  at={A3 + 306} x={62} y={22} size={126} color={V.volt} />
              </div>
            </Plane>
          </AbsoluteFill>
        )}

        {/* ── ACTO 4 · el dedo bajando el interruptor rojo ───────────────────────── */}
        {o4 > 0 && (
          <AbsoluteFill style={{ opacity: o4, transformStyle: "preserve-3d" }}>
            <Plane z={-60}>
              <MediaCard src="broll/cmesodimac/cmes_mv_inve3.mp4" kind="video"
                w={960} h={556} x={50} y={50} ry={-4} lit={0.94} litColor={key}
                sheenAt={A4 + 60} label="EL INTERRUPTOR" />
            </Plane>
            <Plane z={150}>
              <div style={{ position: "absolute", left: 126, top: 168, opacity: LN(g, A4 + 26, A4 + 44) }}>
                <Bed pad={24} w={520}>
                  <Kick>ARREGLO UNO</Kick>
                  <Head size={92}>Apágalo.</Head>
                  <div style={{ height: 8 }} />
                  <Body size={29}>Tiene un interruptor. Úsalo.</Body>
                </Bed>
              </div>
              <Readout value="0" unit="W" label="APAGADO" at={A4 + 190} x={76} y={74} size={132} color={V.volt} />
            </Plane>
          </AbsoluteFill>
        )}

        {/* ── ACTO 5 · doce volts directos ───────────────────────────────────────── */}
        {o5 > 0 && (
          <AbsoluteFill style={{ opacity: o5, transformStyle: "preserve-3d" }}>
            <Plane z={-50}>
              <MediaCard src="img/cmesodimac/cmes_mv_inve4.jpg" kind="photo"
                w={620} h={420} x={31} y={54} ry={8} lit={0.9} litColor={key}
                sheenAt={A5 + 40} label="LA ETIQUETA DEL ROUTER" />
              <MediaCard src="img/cmesodimac/cmes_mv_inve5.jpg" kind="photo"
                w={520} h={330} x={71} y={62} ry={-8} rot={-1.4} lit={0.8} litColor={key}
                label="TIRA LED DE 12 V" />
            </Plane>
            <Plane z={155}>
              <Readout value="12" unit="V" label="DIRECTOS, SIN INVERSOR"
                at={A5 + 60} x={70} y={22} size={146} color={V.volt} />
              <div style={{ position: "absolute", left: 120, top: 700, opacity: LN(g, A5 + 130, A5 + 150) }}>
                <Bed pad={22} w={700}>
                  <Body size={30}>Ni el quince por ciento que se queda el inversor, ni los ocho vatios de tenerlo prendido.</Body>
                </Bed>
              </div>
              <IconPng src="img/cmesodimac/cmes_ic_router.png" x={20} y={20} size={112} z={30} opacity={0.92} />
              <IconPng src="img/cmesodimac/cmes_ic_bateria.png" x={34} y={20} size={112} z={30} opacity={0.92} />
            </Plane>
          </AbsoluteFill>
        )}
      </Layers>

      {/* ── LAS COSTURAS ── */}
      <SeamOcclude at={A3 - 8} dur={16} color={V.blade} angle={9} />
      <SeamFlash at={A5} color={V.volt} dur={7} />
      <SeamFlash at={END} color={V.volt} dur={8} />

      {/* ── SFX (4) ── */}
      <Sequence from={A2 - 18} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={A2 + 52} durationInFrames={26} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={800} durationInFrames={200} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={A4 + 188} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.46} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovInversor: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
