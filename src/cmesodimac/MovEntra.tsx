// MovEntra.tsx — S7 · El sí del tramo: este equipo mueve electrónica y luz. No calor ni motores.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                   | sale (cám / luz / materia)
//  1   |    0 →  330 | z=+90 panX-200 · amber denso · ACERO          | z≈+58 · amber · las luces del router
//  2   |  330 →  700 | z≈+58 · amber · las mismas luces, ya teléfonos| z≈+18 · amber/volt · plástico blanco
//  3   |  700 → 1030 | z≈+18 · volt entrando · vidrio del foco       | z≈-14 · volt · el filamento
//  4   | 1030 → 1420 | z≈-14 · volt · chapa del microondas           | z≈-52 · volt · el borde del vaso
//  5   | 1420 → 1740 | mundo 2 (+2000px) · volt · los dos grupos     | z=-80 panX-140 · volt · TORCH
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=330  MATCH-SHAPE (los cuatro leds del router se abren en las veinte cargas de teléfono)
//  2→3 f=700  OCLUSIÓN V.blade (el plástico blanco de la lámpara cruzando)
//  3→4 f=1030 CORTE EN EL BEAT — SeamFlash volt
//  4→5 f=1420 MATCH-MOVE (rail 2000 px: la cámara retrocede y muestra los dos grupos)
//  5→   f=1712 WIPE POR MATERIA V.torch (se enciende la linterna) → MovFactura
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1740;                                  // 58 s × 30
const A2 = 330, A3 = 700, A4 = 1030, A5 = 1420;
const WX = 2000;                                   // el mundo 2 (los dos grupos) vive a +2000 px

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const VIS = (g: number, a: number, b: number, ei = 10, eo = 10) =>
  clamp01((g - a) / Math.max(1, ei)) * clamp01((b - g) / Math.max(1, eo));

// ── EL VASO DE 310 · lo que entra cae adentro, lo que no REBOTA contra el borde ──────────────
const VASO_X = 690, VASO_Y = 300, VASO_W = 420, VASO_H = 520;

const Recipiente: React.FC<{ op: number; nivel: number }> = ({ op, nivel }) => (
  <div style={{ position: "absolute", left: VASO_X, top: VASO_Y, width: VASO_W, height: VASO_H, opacity: op }}>
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, height: VASO_H * nivel,
      background: `linear-gradient(180deg, ${rgba(V.volt, 0.34)} 0%, ${rgba(V.volt, 0.12)} 100%)`,
      borderTop: `3px solid ${rgba(V.volt, 0.9)}`,
    }} />
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 10,
      border: `4px solid ${rgba(V.volt, 0.66)}`,
      boxShadow: `inset 0 0 60px ${rgba(V.volt, 0.12)}, 0 22px 60px ${rgba(V.ink0, 0.7)}`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, top: -46, textAlign: "center",
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4,
      color: rgba(V.volt, 0.9), textTransform: "uppercase",
    }}>310 vatios hora</div>
  </div>
);

/** Lo que ENTRA: cae adentro del vaso y se queda. */
const Entra: React.FC<{ src: string; at: number; g: number; op: number; slot: number }> = ({ src, at, g, op, slot }) => {
  const p = ES(g, at, at + 26);
  const x = VASO_X + 96 + slot * 116;
  const y = lerp(-140, VASO_Y + VASO_H - 150, p);
  const rot = lerp(-14, 0, p);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: op * clamp01((g - at) / 6) }}>
      <IconPng src={src} x={(x / 1920) * 100} y={(y / 1080) * 100} size={86} rot={rot} z={20} glow={V.volt} />
    </div>
  );
};

/** Lo que NO entra: baja, golpea el borde y sale despedido. Ni un segundo adentro. */
const Rebota: React.FC<{ src: string; at: number; g: number; op: number; lado: number; alto: number }> = ({
  src, at, g, op, lado, alto,
}) => {
  const caida = ES(g, at, at + 22);
  const salto = ES(g, at + 22, at + 74);
  const x = lerp(VASO_X + VASO_W / 2 - 40, VASO_X + VASO_W / 2 - 40 + lado * 520, salto);
  const y = lerp(lerp(-160, VASO_Y - 60, caida), alto, salto);
  const rot = lerp(0, lado * 46, salto);
  const fade = 1 - clamp01((g - at - 58) / 34);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: op * clamp01((g - at) / 5) * fade }}>
      <IconPng src={src} x={(x / 1920) * 100} y={(y / 1080) * 100} size={104} rot={rot} z={40} glow={V.ink0} />
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: 90, z1: -80, panX: -140, panY: -28, ry: 5, rx: -2.2, dur: END });
  const rail = -WX * ES(g, A5 - 80, A5 + 20);              // MATCH-MOVE: la cámara retrocede a los dos grupos
  const key = light(ES(g, 0, END), "amber", "volt");       // ámbar denso → voltio
  const kf = lerp(0.26, 0.44, LN(g, 0, END));

  const o1 = VIS(g, -40, A2, 1, 26);
  const o2 = VIS(g, A2 - 4, A3, 26, 14);
  const o3 = VIS(g, A3 - 4, A4, 14, 12);
  const o4 = VIS(g, A4 - 4, A5 + 30, 12, 26);
  const o5 = VIS(g, A5 - 30, END + 40, 30, 1);

  // MATCH-SHAPE: los MISMOS veinte puntos son los leds del router y después las cargas
  const m = ES(g, A2 - 30, A2 + 26);
  const nivel = 0.18 + 0.5 * ES(g, A4 + 40, A4 + 260);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.amber} tint2={V.volt} keyFrom={kf} intensity={1} floor={0.58} />
      <Layers cam={`${cam.transform} translate3d(${rail.toFixed(1)}px,0,0)`}>

        {/* ══ MUNDO 1 · la casa por dentro ══════════════════════════════════════════════ */}
        <Plane z={-520}>
          <AbsoluteFill style={{ opacity: 1 - o5 * 0.85 }}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_entr5.jpg" dim={0.58} tint={V.amber} scale={1.2} />
          </AbsoluteFill>
        </Plane>

        {/* ── acto 1 · NUEVE VATIOS, LAS VEINTICUATRO HORAS ── */}
        <Plane z={-50}>
          <MediaCard src="broll/cmesodimac/cmes_mv_entr1.mp4" kind="video"
            w={1060} h={600} x={47} y={44} ry={-5} lit={0.95} litColor={key}
            sheenAt={40} opacity={o1} label="EL ROUTER, CON EL MEDIDOR DE ENCHUFE PUESTO" />
        </Plane>
        <Plane z={150}>
          <div style={{ position: "absolute", left: 112, top: 690, width: 900, opacity: o1 }}>
            <Bed pad={26} w={900}>
              <Kick>LO QUE SÍ ENTRA</Kick>
              <div style={{ height: 10 }} />
              <Head size={64}>Nueve vatios. Las veinticuatro horas.</Head>
            </Bed>
          </div>
          <div style={{ opacity: o1 }}>
            <Readout value="216" unit="Wh" label="EL ROUTER EN UN DÍA" at={130} x={78} y={22} size={126} color={V.volt} />
          </div>
        </Plane>

        {/* ── acto 2 · VEINTE CARGAS COMPLETAS (los mismos puntos del router) ── */}
        <Plane z={-30}>
          <MediaCard src="broll/cmesodimac/cmes_mv_entr2.mp4" kind="video"
            w={720} h={420} x={24} y={34} ry={8} lit={0.9} litColor={key}
            sheenAt={A2 + 40} opacity={o2} label="UNA CARGA: DOCE A QUINCE Wh" />
        </Plane>
        <Plane z={140}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => {
            // estado A: cuatro leds pegados al router · estado B: veinte cargas en dos filas
            const a = Math.min(i, 3);
            const ax = 878 + a * 26, ay = 470;
            const bx = 456 + (i % 10) * 112, by = 620 + Math.floor(i / 10) * 132;
            const x = lerp(ax, bx, m), y = lerp(ay, by, m);
            const size = lerp(14, 76, m);
            const nace = i < 4 ? 1 : m;
            const carga = clamp01((g - (A2 + 60) - i * 13) / 12);
            const op = Math.max(o1 * nace, o2 * nace);
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: op }}>
                <div style={{
                  position: "absolute", left: x, top: y, width: size, height: size, marginLeft: -size / 2,
                  borderRadius: "50%", background: rgba(V.volt, lerp(0.85, 0.1, m)),
                  boxShadow: `0 0 ${(10 + 16 * (1 - m)).toFixed(0)}px ${rgba(V.volt, 0.6 * (1 - m) + 0.2)}`,
                }} />
                <IconPng src="img/cmesodimac/cmes_ic_telefono.png"
                  x={(x / 1920) * 100} y={(y / 1080) * 100} size={72}
                  opacity={m * (0.22 + 0.78 * carga)} z={10} glow={V.volt} />
              </div>
            );
          })}
          <div style={{ opacity: o2 }}>
            <Readout value="20" label="CARGAS COMPLETAS" at={A2 + 300} x={74} y={22} size={168} color={V.volt} />
          </div>
          <div style={{ position: "absolute", left: 112, top: 118, width: 640, opacity: o2 }}>
            <Bed pad={24} w={640}>
              <Kick>CON TRESCIENTOS DIEZ JUNTÁS</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>Tu familia entera, una semana.</Head>
            </Bed>
          </div>
        </Plane>

        {/* ── acto 3 · CINCO LÁMPARAS, CINCO HORAS ── */}
        <Plane z={-20}>
          <MediaCard src="broll/cmesodimac/cmes_mv_entr3.mp4" kind="video"
            w={900} h={520} x={60} y={42} ry={-6} lit={1} litColor={key}
            sheenAt={A3 + 36} opacity={o3} label="UNA LED DE LAS BUENAS: SIETE VATIOS" />
        </Plane>
        <Plane z={160}>
          {[0, 1, 2, 3, 4].map((i) => {
            const on = clamp01((g - (A3 + 60) - i * 34) / 14);
            return (
              <IconPng key={i} src="img/cmesodimac/cmes_ic_foco.png"
                x={14 + i * 8.4} y={78} size={92}
                opacity={o3 * (0.2 + 0.8 * on)} z={30}
                glow={on > 0.5 ? V.volt : V.ink0} />
            );
          })}
          <div style={{ position: "absolute", left: 112, top: 122, width: 660, opacity: o3 }}>
            <Bed pad={24} w={660}>
              <Kick>CINCO LÁMPARAS, CINCO HORAS CADA NOCHE</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>Y todavía sobra para el router.</Head>
            </Bed>
          </div>
          <div style={{ opacity: o3 }}>
            <Readout value="200" unit="Wh" label="LAS LUCES DE UNA NOCHE" at={A3 + 210} x={26} y={26} size={126} color={V.volt} />
          </div>
        </Plane>

        {/* ── acto 4 · LO QUE NO ENTRA NI UN SEGUNDO ── */}
        <Plane z={-60}>
          <MediaCard src="img/cmesodimac/cmes_mv_entr4.jpg" kind="photo"
            w={560} h={340} x={17} y={26} ry={9} lit={0.85} litColor={key}
            sheenAt={A4 + 40} opacity={o4} label="MICROONDAS Y PAVA" />
          <MediaCard src="img/cmesodimac/cmes_mv_entr5.jpg" kind="photo"
            w={520} h={320} x={84} y={70} ry={-9} lit={0.8} litColor={key}
            opacity={o4} label="LA PLANCHA" />
        </Plane>
        <Plane z={120}>
          <Recipiente op={o4} nivel={nivel} />
        </Plane>
        <Plane z={190}>
          <Entra src="img/cmesodimac/cmes_ic_router.png" at={A4 + 40} g={g} op={o4} slot={0} />
          <Entra src="img/cmesodimac/cmes_ic_telefono.png" at={A4 + 70} g={g} op={o4} slot={1} />
          <Entra src="img/cmesodimac/cmes_ic_foco.png" at={A4 + 100} g={g} op={o4} slot={2} />
          <Rebota src="img/cmesodimac/cmes_ic_microondas.png" at={A4 + 150} g={g} op={o4} lado={-1} alto={880} />
          <Rebota src="img/cmesodimac/cmes_ic_pava.png" at={A4 + 214} g={g} op={o4} lado={1} alto={840} />
          <Rebota src="img/cmesodimac/cmes_ic_calentador.png" at={A4 + 278} g={g} op={o4} lado={-1} alto={940} />
          <Rebota src="img/cmesodimac/cmes_ic_aire.png" at={A4 + 336} g={g} op={o4} lado={1} alto={920} />
          <div style={{ opacity: o4 }}>
            <Readout value="1.200" unit="W" label="EL MICROONDAS PIDE, DE GOLPE" at={A4 + 170} x={22} y={62} size={124} color={V.volt} />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 128, width: 560, opacity: o4 }}>
            <Bed pad={24} w={560}>
              <Kick color={V.amber}>NO ES QUE NO ENTRE EN EL DÍA</Kick>
              <div style={{ height: 8 }} />
              <Head size={60}>No entra ni un segundo.</Head>
            </Bed>
          </div>
        </Plane>

        {/* ══ MUNDO 2 · los dos grupos, montado a +2000 px ══════════════════════════════ */}
        <Plane z={-520}>
          <AbsoluteFill style={{ transform: `translateX(${WX}px)`, opacity: o5 }}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_entr4.jpg" dim={0.62} tint={V.volt} scale={1.18} />
          </AbsoluteFill>
        </Plane>
        <Plane z={-40}>
          <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_entr1.mp4" kind="video"
              w={620} h={360} x={26} y={34} ry={7} lit={1} litColor={V.volt}
              sheenAt={A5 + 40} opacity={o5} label="ELECTRÓNICA Y LUZ" />
            <MediaCard src="img/cmesodimac/cmes_mv_entr4.jpg" kind="photo"
              w={620} h={360} x={74} y={34} ry={-7} lit={0.6} litColor={V.amber}
              opacity={o5} label="CALOR Y MOTORES" />
          </AbsoluteFill>
        </Plane>
        <Plane z={150}>
          <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
            {/* la línea que parte el mundo en dos */}
            <div style={{
              position: "absolute", left: 958, top: 150, width: 4,
              height: 620 * ES(g, A5 + 20, A5 + 110), opacity: o5,
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.volt, 0.9)} 18%, ${rgba(V.volt, 0.9)} 82%, rgba(0,0,0,0) 100%)`,
              boxShadow: `0 0 26px ${rgba(V.volt, 0.5)}`,
            }} />
            {[
              { s: "img/cmesodimac/cmes_ic_router.png", x: 20 },
              { s: "img/cmesodimac/cmes_ic_telefono.png", x: 31 },
              { s: "img/cmesodimac/cmes_ic_foco.png", x: 42 },
            ].map((it, i) => (
              <IconPng key={i} src={it.s} x={it.x} y={60} size={94} opacity={o5 * clamp01((g - A5 - 40 - i * 16) / 14)} z={20} glow={V.volt} />
            ))}
            {[
              { s: "img/cmesodimac/cmes_ic_microondas.png", x: 58 },
              { s: "img/cmesodimac/cmes_ic_pava.png", x: 69 },
              { s: "img/cmesodimac/cmes_ic_calentador.png", x: 80 },
              { s: "img/cmesodimac/cmes_ic_aire.png", x: 91 },
            ].map((it, i) => (
              <IconPng key={i} src={it.s} x={it.x} y={60} size={94} opacity={o5 * 0.5 * clamp01((g - A5 - 40 - i * 16) / 14)} z={20} glow={V.ink0} />
            ))}
            <div style={{ position: "absolute", left: 300, top: 800, width: 1320, opacity: o5 * ES(g, A5 + 120, A5 + 180) }}>
              <Bed pad={30} w={1320}>
                <Kick>LA REGLA, PARA QUE TE LA LLEVES PUESTA</Kick>
                <div style={{ height: 10 }} />
                <Head size={68}>Mueve electrónica y luz.</Head>
                <Head size={68} color={V.volt}>No mueve calor ni motores.</Head>
              </Bed>
            </div>
            <div style={{ position: "absolute", left: 300, top: 210, width: 420, opacity: o5 }}>
              <Num size={92} color={V.volt}>SÍ</Num>
              <Body size={26}>lo que consume poco y constante.</Body>
            </div>
            <div style={{ position: "absolute", left: 1180, top: 210, width: 420, textAlign: "right", opacity: o5 * 0.8 }}>
              <Num size={92} color={V.amber}>NO</Num>
              <Body size={26}>todo lo que calienta o tiene motor.</Body>
            </div>
          </AbsoluteFill>
        </Plane>

      </Layers>

      {/* ── LAS COSTURAS ── */}
      <SeamOcclude at={A3 - 8} dur={16} color={V.blade} angle={-8} />
      <SeamFlash at={A4} color={V.volt} dur={7} />
      <SeamWipeMatter at={END - 28} dur={26} tint={V.torch} />

      <Sequence from={A2 - 20} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.28} />
      </Sequence>
      <Sequence from={A2 + 296} durationInFrames={50} layout="none">
        <Audio src={staticFile("sfx/sfx_chime.mp3")} volume={0.26} />
      </Sequence>
      <Sequence from={A4 + 148} durationInFrames={26} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={A5 - 70} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovEntra: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
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
