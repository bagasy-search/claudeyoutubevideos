// MovCierre.tsx — S13 · El veredicto: comprálo por el apagón y por la batería que se muere quieta. No por la factura.
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                     | sale (cám / luz / materia)
//  1   |    0 →  420 | z=+20 panX+180 · torch · cobre (viene del poste) | z≈+6 · torch · el canto de las tres tarjetas
//  2   |  420 →  840 | z≈ +6 · torch · el REVERSO de las mismas tarjetas| z≈-10 · torch+volt · papel de la boleta
//  3   |  840 → 1260 | z≈-10 · volt frío · sombra del balcón            | z≈-28 · volt · la baranda (la cámara baja)
//  4   | 1260 → 1740 | mundo 2 (+1500 px abajo) · AMANECE · volt limpio | z≈-46 · volt limpio · acero de la pinza
//  5   | 1740 → 2289 | z≈-46 · volt limpio .52 · madera del tablón      | z=-60 panX+180 · volt limpio · PAPEL → MovGuia
// ── COSTURAS (ninguna es un fade) ───────────────────────────────────────────────────────────
//  1→2 f=420  MATCH-SHAPE (las MISMAS tres tarjetas giran sobre su eje y muestran el reverso)
//  2→3 f=840  OCLUSIÓN V.paper (la hoja de la boleta cruza)
//  3→4 f=1260 MATCH-MOVE (rail vertical 1500 px: la cámara baja del balcón al patio, amaneciendo)
//  4→5 f=1740 CORTE EN EL BEAT SeamFlash volt
//  5→▸ f=2289 ZOOM-THROUGH al papel escrito a mano (at 2262, dur 18) → MovGuia entra en papel
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 2289;                      // 76,3 s × 30 — el acto 5 llega hasta acá
const A2 = 420, A3 = 840, A4 = 1260, A5 = 1740;
const WY = 1500;                       // el mundo 2 (el patio) vive 1500 px más abajo

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const OP = (g: number, a: number, b: number, fi = 12, fo = 12) =>
  Math.min(LN(g, a, a + fi), 1 - LN(g, b - fo, b));

/** UNA tarjeta que gira sobre su propio eje: la misma instancia muestra cara y reverso. */
const Tarjeta: React.FC<{
  g: number; x: number; y: number; rot: number;
  frente: string; frenteKind: "video" | "photo"; frenteLabel: string;
  dorso: string; dorsoKind: "video" | "photo"; dorsoLabel: string;
  litColor: string; delay: number;
}> = ({ g, x, y, rot, frente, frenteKind, frenteLabel, dorso, dorsoKind, dorsoLabel, litColor, delay }) => {
  const flip = ES(g, A2 - 70 + delay, A2 + 70 + delay);
  const deg = flip * 180;
  const vive = OP(g, 10 + delay, A3 + 6, 22, 12);
  if (vive <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: vive, transformStyle: "preserve-3d" }}>
      {flip < 0.5 ? (
        <MediaCard src={frente} kind={frenteKind} w={430} h={560} x={x} y={y} ry={deg} rot={rot}
          lit={0.92} litColor={litColor} sheenAt={40 + delay} label={frenteLabel} />
      ) : (
        <MediaCard src={dorso} kind={dorsoKind} w={430} h={560} x={x} y={y} ry={deg - 180} rot={rot}
          lit={0.86} litColor={litColor} label={dorsoLabel} />
      )}
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: 20, z1: -60, panX: 180, panY: -16, ry: 2, rx: -2.6, dur: END });
  const railY = -WY * ES(g, A4 - 95, A4 + 25);
  const key = light(LN(g, 0, END), "torch", "volt");
  const zoom = zoomThrough(g, END - 27, 18, 48, 54);
  const dia = LN(g, A3 + 220, A5);                     // amanece

  const oCards = OP(g, -20, A3 + 6, 1, 12);
  const o3 = OP(g, A3 - 6, A4 + 10, 14, 14);
  const o4 = OP(g, A4 - 120, A5 + 6, 34, 10);
  const o5 = OP(g, A5 - 6, END + 60, 14, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos
        tint={V.torch} tint2={V.volt}
        keyFrom={lerp(0.34, 0.52, LN(g, 0, END))}
        intensity={lerp(0.92, 1, dia)} floor={lerp(0.62, 0.48, LN(g, 0, END))}
      />
      {/* el papel que RECIBE el zoom-through: nunca se cae a negro al entrar en MovGuia */}
      {g > END - 40 && (
        <AbsoluteFill style={{ opacity: LN(g, END - 34, END - 12) }}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_cier2.jpg" dim={0.16} tint={V.volt} scale={1.9} z={0} />
        </AbsoluteFill>
      )}
      <Layers cam={`${cam.transform} translate3d(0px,${railY.toFixed(1)}px,0)`}>
        {/* ═══ MUNDO 1 · el veredicto y el balcón ═══════════════════════════════ */}
        <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
          <Plane z={-520}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_cier3.jpg"
              dim={lerp(0.68, 0.40, LN(g, A3 - 40, A3 + 120))} tint={V.volt} scale={1.2} />
          </Plane>

          {/* ── ACTOS 1 y 2 · las MISMAS tres tarjetas, y su reverso ───────────── */}
          {oCards > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: oCards }}>
              <Plane z={-40}>
                <Tarjeta g={g} x={24} y={54} rot={-1.6} delay={0}
                  frente="broll/cmesodimac/cmes_mv_cier1.mp4" frenteKind="video" frenteLabel="SOBREVIVIR AL APAGÓN"
                  dorso="img/cmesodimac/cmes_mv_cier2.jpg" dorsoKind="photo" dorsoLabel="LA FACTURA NO BAJA"
                  litColor={key} />
                <Tarjeta g={g} x={50} y={51} rot={0.8} delay={16}
                  frente="broll/cmesodimac/cmes_mv_cier4.mp4" frenteKind="video" frenteLabel="APRENDER MIDIENDO"
                  dorso="broll/cmesodimac/cmes_mv_cier1.mp4" dorsoKind="video" dorsoLabel="EL REFRIGERADOR, NO"
                  litColor={key} />
                <Tarjeta g={g} x={76} y={55} rot={1.9} delay={32}
                  frente="img/cmesodimac/cmes_mv_cier5.jpg" frenteKind="photo" frenteLabel="LA BATERÍA QUE SE MUERE QUIETA"
                  dorso="img/cmesodimac/cmes_mv_cier3.jpg" dorsoKind="photo" dorsoLabel="EL BALCÓN EQUIVOCADO"
                  litColor={key} />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 120, top: 116, opacity: OP(g, 20, A2 - 40, 16, 26) }}>
                  <Bed pad={24} w={560}>
                    <Kick>EL VEREDICTO</Kick>
                    <Head size={82}>Cómpralo si...</Head>
                  </Bed>
                </div>
                <div style={{ opacity: OP(g, 210, A2 - 34, 14, 20) }}>
                  <Readout value="110" unit="USD" label="PLATA BIEN GASTADA, PARA ESAS TRES COSAS"
                    at={216} x={72} y={16} size={112} color={V.amber} />
                </div>
                <div style={{ position: "absolute", left: 120, top: 116, opacity: OP(g, A2 + 40, A3 - 30, 16, 24) }}>
                  <Bed pad={24} w={560}>
                    <Kick color={V.amber}>EL OTRO LADO DE LA TARJETA</Kick>
                    <Head size={82}>No lo compres si...</Head>
                  </Bed>
                </div>
                <div style={{ opacity: OP(g, A2 + 200, A3 - 26, 14, 20) }}>
                  <Readout value="0" unit="USD/mes" label="LO QUE BAJA LA FACTURA"
                    at={A2 + 206} x={72} y={16} size={116} color={V.amber} />
                </div>
                <IconPng src="img/cmesodimac/cmes_ic_billete.png" x={88} y={80} size={104} z={30}
                  opacity={OP(g, A2 + 150, A3 - 20, 16, 20)} />
                <IconPng src="img/cmesodimac/cmes_ic_congelador.png" x={12} y={80} size={104} z={30}
                  opacity={OP(g, A2 + 190, A3 - 20, 16, 20)} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 3 · un adorno caro en la baranda ──────────────────────────── */}
          {o3 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o3 }}>
              <Plane z={-50}>
                <MediaCard src="img/cmesodimac/cmes_mv_cier3.jpg" kind="photo"
                  w={1000} h={600} x={46} y={50} ry={5} lit={0.9} litColor={key}
                  sheenAt={A3 + 44} label="EL BALCÓN A LA SOMBRA" />
              </Plane>
              <Plane z={148}>
                <div style={{ position: "absolute", left: 120, top: 148 }}>
                  <Bed pad={24} w={620}>
                    <Kick>EL LADO EQUIVOCADO</Kick>
                    <Head size={70}>Un adorno caro colgado de la baranda.</Head>
                  </Bed>
                </div>
                <Readout value="26" unit="W" label="NI LA MITAD DE LOS CINCUENTA Y TRES"
                  at={A3 + 150} x={76} y={26} size={132} color={V.volt} />
                <IconPng src="img/cmesodimac/cmes_ic_casa.png" x={80} y={76} size={110} z={30}
                  opacity={OP(g, A3 + 90, A4 - 30, 16, 20)} />
              </Plane>
            </AbsoluteFill>
          )}
        </AbsoluteFill>

        {/* ═══ MUNDO 2 (+1500 px abajo) · el patio al amanecer ══════════════════ */}
        <AbsoluteFill style={{ transform: `translate3d(0px,${WY}px,0)`, transformStyle: "preserve-3d" }}>
          <Plane z={-520}>
            <PhotoPlane src="broll/cmesodimac/cmes_mv_cier1.mp4" kind="video"
              dim={lerp(0.56, 0.40, dia)} tint={V.volt} scale={1.16} />
          </Plane>

          {/* ── ACTO 4 · mide. es lo único que te pido ─────────────────────────── */}
          {o4 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o4 }}>
              <Plane z={-40}>
                <MediaCard src="broll/cmesodimac/cmes_mv_cier4.mp4" kind="video"
                  w={940} h={540} x={44} y={53} ry={6} lit={0.96} litColor={key}
                  sheenAt={A4 + 60} label="LA PINZA Y EL MEDIDOR DE ENCHUFE" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 120, top: 140 }}>
                  <Bed pad={24} w={560}>
                    <Kick>LO ÚNICO QUE TE PIDO</Kick>
                    <Head size={86}>Mide.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>Una tarde, y tienes escrito cuánto consume de verdad cada cosa.</Body>
                  </Bed>
                </div>
                <div style={{ opacity: OP(g, A4 + 90, A4 + 330, 14, 26) }}>
                  <Readout value="30" unit="USD" label="LA PINZA" at={A4 + 96} x={74} y={22} size={104} color={V.amber} />
                  <Readout value="20" unit="USD" label="EL MEDIDOR" at={A4 + 132} x={74} y={44} size={104} color={V.amber} />
                </div>
                {/* los dos números que persiguen al espectador se cruzan SIN tocarse */}
                <div style={{ opacity: OP(g, A5 - 150, A5 + 2, 18, 12) }}>
                  <div style={{ position: "absolute", left: lerp(-360, 1180, ES(g, A5 - 150, A5)), top: 236 }}>
                    <Num size={168} color={V.amber}>100</Num>
                  </div>
                  <div style={{ position: "absolute", left: lerp(1740, 220, ES(g, A5 - 150, A5)), top: 664 }}>
                    <Num size={168} color={V.volt}>53</Num>
                  </div>
                </div>
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 5 · con ese papel en la mano ──────────────────────────────── */}
          {o5 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o5, transform: zoom.out }}>
              <Plane z={-40}>
                <MediaCard src="img/cmesodimac/cmes_mv_cier2.jpg" kind="photo"
                  w={1000} h={600} x={48} y={54} ry={-4} rx={2} lit={0.94} litColor={key}
                  sheenAt={A5 + 60} label="LO QUE MEDISTE, ESCRITO A MANO" />
                <MediaCard src="img/cmesodimac/cmes_mv_cier5.jpg" kind="photo"
                  w={420} h={520} x={82} y={58} ry={-12} rot={1.4} lit={0.82} litColor={key}
                  opacity={OP(g, A5 + 230, END - 40, 20, 24)} label="EL QUE MIDIÓ" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 118, top: 142 }}>
                  <Bed pad={24} w={620}>
                    <Kick>CON ESE PAPEL EN LA MANO</Kick>
                    <Head size={70}>No hay vendedor que te pueda mover.</Head>
                  </Bed>
                </div>
                <div style={{ position: "absolute", left: 118, top: 700, opacity: OP(g, A5 + 190, END - 30, 18, 26) }}>
                  <Bed pad={22} w={640}>
                    <Body size={30}>Mide antes de comprar. Es todo el video en tres palabras.</Body>
                  </Bed>
                </div>
                <IconPng src="img/cmesodimac/cmes_ic_cuaderno.png" x={20} y={80} size={104} z={30}
                  opacity={OP(g, A5 + 120, END - 30, 16, 22)} />
                <IconPng src="img/cmesodimac/cmes_ic_lupa.png" x={31} y={80} size={98} z={30}
                  opacity={OP(g, A5 + 150, END - 30, 16, 22)} />
              </Plane>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Layers>

      {/* ── LAS COSTURAS ── */}
      <SeamOcclude at={A3 - 8} dur={16} color={V.paper} angle={-9} />
      <SeamFlash at={A5} color={V.volt} dur={8} />

      {/* ── SFX (4) ── */}
      <Sequence from={A2 - 70} durationInFrames={90} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.36} />
      </Sequence>
      <Sequence from={A3 + 148} durationInFrames={30} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.46} />
      </Sequence>
      <Sequence from={A5 - 6} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_chime.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={END - 27} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovCierre: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
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
