// MovDia.tsx — S5 (traducir) · 41,8 s = 1254 frames @30 · EL PUNTO MEDIO DEL VIDEO
// Espina: el vatio del mediodia no importa; lo que importa es el vatio-hora del dia entero.
//
// ⚠️ ACA LA CAMARA EMPIEZA A VOLVER. En el plan el panX pasa de -300 a -250: es el PRIMER delta
// POSITIVO de los siete movimientos anteriores (todos venian restando). Por eso `gcam` recibe
// panX = +118 y ry = +3.4 (los deltas, no los absolutos: si le pasara el -250 del JSON tal cual
// la camara SEGUIRIA yendose, que es justo lo contrario de lo que pide el plan). Ademas los
// primeros 96 frames arrastran una `inercia` de -140 px que se apaga: la camara FRENA y recien
// despues gira. Ese freno se ve, y es el gesto que parte el video en dos.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cam / luz / materia)                  | SALE (cam / luz / materia)
//  1   |    0 →  285 | z=-140 · la OCLUSION de GOMA NEGRA de        | z≈-112 · volt · la SOMBRA
//      |             | MovRegulador termina de cruzar (at=-8) ·     | del panel cruzando la chapa
//      |             | luz volt · la camara todavia frena           |
//  2   |  285 →  627 | z≈-112 tras el rail de 1400 px · volt tibio  | z≈-76 · volt→amber
//      |             | materia: la sombra = la linea de la curva    | materia: HORMIGON (concrete)
//  3   |  627 →  940 | z≈-76 tras la OCLUSION de hormigon · amber   | z≈-44 · amber
//      |             | materia: el area bajo la curva, hora por hora| el ultimo bloque de la hora
//  4   |  940 → 1254 | z≈-44 saliendo del ZOOM-THROUGH del bloque   | z=-20 · AMBER de atardecer
//      |             | materia: el area condensada sobre el cuaderno| CORTE EN EL BEAT
//
// HANDOFF DE SALIDA → MovHeladera: z=-20, panX -250 (ya volviendo), luz AMBER de atardecer,
// materia SOL/AMBAR, y un CORTE EN EL BEAT (SeamFlash volt, 6 cuadros). No es un fade.
//
// LA CUENTA ES REAL: 12 horas de 6 a 17 con [2,8,18,30,42,50,53,48,32,16,8,3] vatios.
// El pico es 53 — el mismo numero que midio la pinza al mediodia. La suma da 310 exactos.
//
// ── COSTURAS (4 fronteras, 4 mecanicas distintas · NINGUNA es un fade) ───────────────────────
//  1→2  f=285  MATCH-MOVE    rail de 1400 px hacia la derecha: la sombra arrastra la camara.
//  2→3  f=627  OCLUSION      V.concrete (la losa del patio) angle 7.
//  3→4  f=940  ZOOM-THROUGH  entramos por el ULTIMO bloque de la hora (fx 84 / fy 66).
//  fin  f=1254 CORTE EN EL BEAT  SeamFlash V.volt dur 6.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1254;
const S12 = 285;
const S23 = 627;
const S34 = 940;

const RAIL = 1400;
const PCT = (px: number) => (px / 1920) * 100;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const WIN = (g: number, a: number, b: number) => Math.min(ES(g, a, a + 15), 1 - ES(g, b - 15, b));

// ── LA CURVA DEL DIA — geometria real (viewBox 1920x1080) ────────────────────────────────────
const HORAS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const VATIOS = [2, 8, 18, 30, 42, 50, 53, 48, 32, 16, 8, 3];   // suma = 310 exactos, pico = 53
const AX_L = 300;
const AX_R = 1640;
const BASE_Y = 806;
const PEAK = 392;
const PICO = 53;
const N = VATIOS.length;
const PX = (i: number) => AX_L + (i / (N - 1)) * (AX_R - AX_L);
const PY = (w: number) => BASE_Y - (w / PICO) * PEAK;
const ANCHO = ((AX_R - AX_L) / (N - 1)) * 0.72;

const PUNTOS = VATIOS.map((w, i) => ({ x: PX(i), y: PY(w), w }));
const LARGO = PUNTOS.reduce((acc, p, i) => {
  if (i === 0) return acc;
  const q = PUNTOS[i - 1];
  return acc + Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}, 0);
const PATH = PUNTOS.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
const ACUM: number[] = [];
VATIOS.reduce((s, w) => { const t = s + w; ACUM.push(t); return t; }, 0);

const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 64, kickColor = V.volt }) => {
  const a = WIN(g, inF, outF);
  if (a <= 0.004) return null;
  const dy = (1 - ES(g, inF, inF + 24)) * 26;
  return (
    <div style={{
      position: "absolute", left: 78, bottom: 96, width: 800, opacity: a,
      transform: "translateY(" + dy.toFixed(1) + "px)",
    }}>
      <Bed pad={24}>
        <Kick color={kickColor}>{kick}</Kick>
        <div style={{ marginTop: 8 }}><Head size={size}>{head}</Head></div>
        {sub && <div style={{ marginTop: 10 }}><Body size={30}>{sub}</Body></div>}
      </Bed>
    </div>
  );
};

// ── ⭐ LA CURVA — UNA SOLA INSTANCIA, viva del acto 2 al 4 ────────────────────────────────────
// acto 2: se dibuja (stroke que avanza). acto 3: se llena hora por hora. acto 4: se condensa
// en la cifra. Es un GRAFICO de verdad, por eso puede ser vectorial (regla 1 del brief).
const Curva: React.FC<{ g: number; llenado: number }> = ({ g, llenado }) => {
  const a = WIN(g, S12 - 10, END + 40);
  if (a <= 0.004) return null;
  const traza = ES(g, S12 + 30, S12 + 230);
  const cond = ES(g, S34, S34 + 78);                 // se condensa hacia el cuaderno
  const sc = lerp(1, 0.06, cond);
  return (
    <div style={{
      position: "absolute", inset: 0, opacity: a * (1 - 0.96 * cond), pointerEvents: "none",
      transform: "scale(" + sc.toFixed(3) + ")", transformOrigin: "84% 66%",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {/* el eje del dia */}
        <line x1={AX_L - 40} y1={BASE_Y} x2={AX_R + 40} y2={BASE_Y}
          stroke={rgba(V.white, 0.28)} strokeWidth={3} />
        {/* el area bajo la curva: hora por hora, en volt */}
        {PUNTOS.map((p, i) => {
          const l = clamp01(llenado * N - i);
          if (l <= 0) return null;
          const h = (BASE_Y - p.y) * eio(0, 1, l);
          return (
            <rect key={p.x} x={p.x - ANCHO / 2} y={BASE_Y - h} width={ANCHO} height={h}
              fill={rgba(V.volt, 0.3 + 0.34 * l)} stroke={rgba(V.volt, 0.6)} strokeWidth={1.5} rx={3} />
          );
        })}
        {/* la curva del dia */}
        <path d={PATH} fill="none" stroke={rgba(V.volt, 0.95)} strokeWidth={6}
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={LARGO} strokeDashoffset={LARGO * (1 - traza)} />
        {/* el pico: 53 al mediodia, el mismo numero de la pinza */}
        {traza > 0.96 && (
          <g>
            <circle cx={PUNTOS[6].x} cy={PUNTOS[6].y} r={11} fill={V.volt} />
            <text x={PUNTOS[6].x} y={PUNTOS[6].y - 28} textAnchor="middle"
              fontFamily={F_DISPLAY} fontWeight={800} fontSize={54} fill={V.volt}>53 W</text>
          </g>
        )}
        {/* las horas */}
        {PUNTOS.map((p, i) => (
          i % 3 === 0 ? (
            <text key={"h" + p.x} x={p.x} y={BASE_Y + 46} textAnchor="middle"
              fontFamily={F_DISPLAY} fontWeight={700} fontSize={30}
              fill={rgba(V.white, 0.55)}>{HORAS[i]}h</text>
          ) : null
        ))}
      </svg>
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CAMARA QUE VUELVE: panX POSITIVO por primera vez en el video, mas el freno inicial ──
  const cam = gcam(g, { z0: -140, z1: -20, panX: 118, panY: -30, ry: 3.4, rx: -2.6, dur: END });
  const inercia = -140 * (1 - ES(g, 0, 96));       // los ultimos 140 px de la ida, apagandose
  // MATCH-MOVE: el acto 1 vive montado a +1400 px; el rail lo trae y el mundo viaja a la DERECHA
  const rail = -RAIL * (1 - ES(g, S12 - 70, S12 + 30));
  const camBase = cam.transform + " translate3d(" + inercia.toFixed(1) + "px,0,0)";
  const world = camBase + " translate3d(" + rail.toFixed(1) + "px,0,0)";

  // ZOOM-THROUGH por el ULTIMO bloque de la hora (el rail ya vale 0 aca)
  const zt = zoomThrough(g, S34 - 20, 20, 84, 66);

  const key = light(ES(g, 40, END - 60), "volt", "amber");
  const keyFrom = 0.5 - 0.16 * ES(g, 0, END);
  const floor = 0.55 + 0.05 * ES(g, S23, END);

  const A1 = g < S12 + 4;
  const A2 = g >= S12 - 4 && g < S23 + 6;
  const A3 = g >= S23 - 6 && g < S34 + 6;
  const A4 = g >= S34 + 6;

  const llenado = LN(g, S23 + 40, S23 + 268);
  const idx = Math.max(0, Math.min(N - 1, Math.floor(llenado * N + 0.0001) - 1));
  const acum = llenado <= 0 ? 0 : ACUM[idx];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.volt} tint2={V.amber} keyFrom={keyFrom} intensity={1} floor={floor} />

      {/* LA CAMA: el cielo del atardecer sobre la chapa — el arco de luz del tramo C */}
      <Layers cam={camBase}>
        <Plane z={-520}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_diaa2.jpg" dim={0.58} tint={V.amber} scale={1.24} />
        </Plane>
      </Layers>

      <Layers cam={world}>
        {/* ── ACTO 1 · el timelapse de la sombra (vive a +1400 px) ── */}
        {A1 && (
          <Plane z={-40} style={{ opacity: WIN(g, -20, S12 + 4) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_diaa1.mp4" kind="video"
              w={1180} h={640} x={50 + PCT(RAIL)} y={47} z={0} ry={-4} rx={2}
              lit={0.94} litColor={key} sheenAt={54} label="LA SOMBRA DEL PANEL, TODO EL DIA" />
            <IconPng src="img/cmesodimac/cmes_ic_reloj.png"
              x={17 + PCT(RAIL)} y={70} size={126} z={140} opacity={0.9} rot={-6} />
          </Plane>
        )}

        {/* ── ACTO 2 · el mismo timelapse, ahora arriba: la curva se dibuja encima ── */}
        {A2 && (
          <Plane z={-60} style={{ opacity: WIN(g, S12 - 4, S23 + 6) * 0.9 }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_diaa1.mp4" kind="video"
              w={1460} h={470} x={50} y={24} z={0} ry={3} rx={-2}
              lit={0.7} litColor={key} sheenAt={S12 + 44} startFrom={40} />
          </Plane>
        )}

        {/* ── ACTO 3 · el sol bajando mientras el area se llena hora por hora ── */}
        {A3 && (
          <Plane z={-60} style={{
            opacity: WIN(g, S23 - 6, S34 + 6) * zt.opacity,
            transform: "translateZ(-60px) " + zt.out,
          }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_diaa4.mp4" kind="video"
              w={720} h={410} x={22} y={22} z={0} ry={7} rx={-2.4}
              lit={0.82} litColor={key} sheenAt={S23 + 46} label="EL SOL BAJANDO" />
            <IconPng src="img/cmesodimac/cmes_ic_sol.png" x={86} y={17} size={110} z={150} opacity={0.72} glow={V.amber} />
          </Plane>
        )}

        {/* ── ACTO 4 · el cuaderno: el area condensada en una sola cifra ── */}
        {A4 && (
          <Plane z={-30} style={{ opacity: WIN(g, S34 + 6, END + 40) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_diaa3.mp4" kind="video"
              w={1020} h={580} x={66} y={50} z={0} ry={-7} rx={2.2}
              lit={0.94} litColor={key} sheenAt={S34 + 42} label="LA SUMA DEL DIA, EN EL CUADERNO" />
            <IconPng src="img/cmesodimac/cmes_ic_cuaderno.png" x={16} y={72} size={124} z={150} opacity={0.86} rot={8} />
          </Plane>
        )}
      </Layers>

      {/* ── COSTURAS ── */}
      {/* la GOMA NEGRA que arranco al final de MovRegulador termina de cruzar aca */}
      <SeamOcclude at={-8} dur={16} color={V.ink2} angle={11} />
      <SeamOcclude at={S23 - 8} dur={16} color={V.concrete} angle={7} />
      <SeamFlash at={END - 4} color={V.volt} dur={6} />

      {/* ── EL GRAFICO, LAS CIFRAS Y EL TEXTO: plano plano, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* ⭐ la curva: nace en el acto 2, se llena en el 3, se condensa en el 4 */}
        <Curva g={g} llenado={llenado} />

        {/* acto 1 — la unica idea: un dia entero, del amanecer al anochecer */}
        <Titular g={g} inF={26} outF={S12 - 8} kick="UN DIA ENTERO, DESPEJADO"
          head="DEL AMANECER AL ANOCHECER" size={62}
          sub="Cincuenta y tres vatios al mediodia no es lo que te interesa." />

        {/* acto 2 — la curva del dia */}
        <Titular g={g} inF={S12 + 26} outF={S23 - 12} kick="LO QUE JUNTA DE VERDAD"
          head="LA CURVA DEL DIA" sub="Arranca en nada, sube al mediodia y se apaga." />

        {/* acto 3 — lo que hay DEBAJO de la curva, sumandose hora por hora */}
        <Titular g={g} inF={S23 + 24} outF={S34 - 12} kick="HORA POR HORA"
          head="LO QUE HAY DEBAJO DE LA CURVA" size={58}
          sub="No es el pico: es el area. Eso es lo que vas a usar de noche." />
        {g >= S23 + 40 && g < S34 + 4 && (
          <div style={{ opacity: WIN(g, S23 + 40, S34 + 4) }}>
            <Readout value={String(acum)} unit="Wh" label="acumulado" at={S23 + 44}
              x={78} y={22} size={150} color={V.volt} />
          </div>
        )}

        {/* acto 4 — LA CIFRA REAL DEL EQUIPO */}
        {g >= S34 + 22 && (
          <div style={{
            position: "absolute", left: 88, top: 210, width: 620, opacity: WIN(g, S34 + 22, END + 60),
            transform: "translateY(" + lerp(34, 0, ES(g, S34 + 26, S34 + 110)).toFixed(1) + "px)",
          }}>
            <Bed pad={28} w={620}>
              <Kick>EL NUMERO REAL DE ESTE EQUIPO</Kick>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 16 }}>
                <Num size={188} color={V.volt}>310</Num>
                <Head size={48} color={V.volt}>Wh</Head>
              </div>
              <div style={{ marginTop: 10 }}>
                <Body size={29}>Plano, con el regulador que viene en la caja, en un dia bueno.</Body>
              </div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ── SFX (3) ── */}
      <Sequence from={S12 - 66} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={S23 + 40} durationInFrames={240} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.28} />
      </Sequence>
      <Sequence from={S34 + 20} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/sfx_chime.mp3")} volume={0.34} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovDia: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
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
