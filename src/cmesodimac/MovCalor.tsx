// MovCalor.tsx — S4 (la prueba) · 48 s = 1440 frames @30
// Espina: la etiqueta se mide a veinticinco grados y el vidrio esta a cincuenta y ocho.
// Treinta y tres grados de mas, cuatro decimas por grado: trece vatios que se fueron en calor.
//
// LA REGLA DE COLOR DEL TRAMO: lo que dice LA ETIQUETA va en `amber` (la promesa, como el 100).
// Lo que dice EL INSTRUMENTO va en `volt` (la medicion, como el 53). Nunca se cruzan de color.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cam / luz / materia)                 | SALE (cam / luz / materia)
//  1   |    0 →  320 | z=-60 con el rail de MovAngulo terminando   | z≈-30 · sky · la ETIQUETA
//      |             | (+1000 → 0 px) · luz sky · VIDRIO/CIELO     | plateada llenando el cuadro
//  2   |  320 →  700 | z≈-30 saliendo del ZOOM-THROUGH del 25      | z≈0 · sky→amber · ACERO
//      |             | materia: el metal de la etiqueta = el cuerpo| la chapa entra a cruzar
//      |             | del termometro                              |
//  3   |  700 → 1080 | z≈0 tras la OCLUSION de chapa · amber tibio | z≈+18 · amber caliente
//      |             | materia: el aire ondulando sobre la chapa   | materia: EL EJE del grafico
//  4   | 1080 → 1440 | z≈+18 tras el FLASH volt · amber caliente   | z=+30 · amber caliente pleno
//      |             | materia: el eje se engorda y se pone COBRE  | materia: EL CABLE DE COBRE
//
// HANDOFF DE SALIDA → MovRegulador: z=+30, panX -240 acumulado, luz amber caliente,
// materia COBRE. El eje del grafico ya es un cable estirado a lo ancho del cuadro: MovRegulador
// lo recibe y lo contrae hasta ser el eje de la cajita negra (MATCH-SHAPE que cruza el archivo).
//
// ── COSTURAS (4 fronteras, 4 mecanicas distintas · NINGUNA es un fade) ───────────────────────
//  1→2  f=320  ZOOM-THROUGH  entramos DENTRO del 25 grabado en la etiqueta (fx 57 / fy 43).
//  2→3  f=700  OCLUSION      V.steel — la chapa del techo cruza y detras ya esta el grafico.
//                            (tambien cambia LA CAMA de foto, tapada por la materia).
//  3→4  f=1080 CORTE EN EL BEAT  SeamFlash V.volt dur 6. Tres cuadros, no un fundido.
//  fin  f=1440 MATCH-SHAPE   el eje del grafico se estira y se vuelve el cable de cobre.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1440;
const S12 = 320;
const S23 = 700;
const S34 = 1080;

const RAIL_IN = 1000;   // completa los 2200 px del MATCH-MOVE que arranco MovAngulo

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const WIN = (g: number, a: number, b: number) => Math.min(ES(g, a, a + 15), 1 - ES(g, b - 15, b));

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
      position: "absolute", bottom: 104, width: 840, opacity: a, ...pos,
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

// ── EL GRAFICO DEL ACTO 3 — es un GRAFICO de verdad, por eso puede ser vectorial ─────────────
// Una barra de calor que SUBE y una de potencia que BAJA, y se cruzan. Cuatro decimas por grado.
const AX_L = 1080;   // el grafico vive a la derecha; el titular vive abajo a la izquierda
const AX_R = 1700;
const AX_Y = 742;
const AX_H = 372;

const Cruce: React.FC<{ g: number }> = ({ g }) => {
  const a = WIN(g, S23 + 10, S34 + 6);
  if (a <= 0.004) return null;
  const t = ES(g, S23 + 40, S23 + 250);
  const hCal = AX_H * lerp(0.18, 0.94, t);     // temperatura: 25 → 58
  const hPot = AX_H * lerp(0.94, 0.55, t);     // potencia: 100 % → 87 % (leido en escala corta)
  const w = 128;
  const xCal = AX_L + 62;
  const xPot = AX_R - 62 - w;
  const barra = (x: number, h: number, color: string, tag: string, val: string) => (
    <div style={{ position: "absolute", left: x, top: AX_Y - h, width: w, height: h }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 8,
        background: "linear-gradient(180deg, " + rgba(color, 0.92) + ", " + rgba(color, 0.34) + ")",
        boxShadow: "0 0 34px " + rgba(color, 0.34) + ", inset 0 0 0 1px " + rgba(color, 0.5),
      }} />
      <div style={{
        position: "absolute", left: 0, top: -46, width: w, textAlign: "center",
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color,
        textShadow: "0 4px 18px rgba(0,0,0,0.9)",
      }}>{val}</div>
      <div style={{
        position: "absolute", left: -18, top: h + 12, width: w + 36, textAlign: "center",
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 2.6,
        color: rgba(V.white, 0.66), textTransform: "uppercase",
      }}>{tag}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: a, pointerEvents: "none" }}>
      {barra(xCal, hCal, V.amber, "grados", "58")}
      {barra(xPot, hPot, V.volt, "potencia", "-13 %")}
    </div>
  );
};

// ── ⭐ EL EJE — UNA SOLA INSTANCIA: base del grafico → cable de cobre (MATCH-SHAPE de salida) ──
const EjeCobre: React.FC<{ g: number }> = ({ g }) => {
  const nace = ES(g, S23 + 6, S23 + 60);
  if (nace <= 0.002) return null;
  const t_b = ES(g, S34 - 10, S34 + 90);          // se engorda y se pone cobre
  const t_c = ES(g, END - 108, END);              // se estira a lo ancho: ya es el cable
  const w = lerp(lerp(AX_R - AX_L, AX_R - AX_L, t_b), 1780, t_c);
  const h = lerp(lerp(6, 26, t_b), 34, t_c);
  const cx = lerp(lerp((AX_L + AX_R) / 2, (AX_L + AX_R) / 2, t_b), 960, t_c);
  const y = lerp(lerp(AX_Y, 604, t_b), 548, t_c);
  const col = t_b < 0.5 ? V.voltSoft : V.copper;
  const mezcla = lerp(0.35, 1, t_b);
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: y - h / 2, width: w, height: h,
      borderRadius: h / 2, opacity: nace,
      background: "linear-gradient(180deg, " + rgba(V.white, 0.34 * mezcla) + " 0%, "
        + rgba(col, 0.98) + " 30%, " + rgba(col, 0.6) + " 100%)",
      boxShadow: "0 0 " + Math.round(18 + 34 * t_b) + "px " + rgba(col, 0.44 * mezcla)
        + ", 0 " + Math.round(6 + 10 * t_b) + "px 26px rgba(0,0,0,0.72)",
      pointerEvents: "none",
    }} />
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: -60, z1: 30, panX: -240, panY: -20, ry: -9, rx: -3.4, dur: END });
  // MATCH-MOVE de ENTRADA: el mundo llega desde +1000 px y frena. Es el final del rail de MovAngulo.
  const rail = RAIL_IN * (1 - ES(g, 0, 30));
  const world = cam.transform + " translate3d(" + rail.toFixed(1) + "px,0,0)";

  // ZOOM-THROUGH del acto 1: entramos DENTRO del 25 grabado en la etiqueta
  const zt = zoomThrough(g, S12 - 20, 20, 57, 43);

  const key = light(ES(g, 40, END - 60), "sky", "amber");
  const keyFrom = 0.4 - 0.04 * ES(g, 0, END);
  const floor = 0.52 + 0.05 * ES(g, S23, END);

  const A1 = g < S12 + 4;
  const A2 = g >= S12 - 4 && g < S23 + 8;
  const A3 = g >= S23 - 8 && g < S34 + 5;
  const A4 = g >= S34 + 5;

  const sube = ES(g, S34 + 30, S34 + 150);   // el 13 se EVAPORA hacia arriba

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.sky} tint2={V.amber} keyFrom={keyFrom} intensity={1} floor={floor} />

      {/* LA CAMA — cambia bajo la OCLUSION de chapa (f=700), nunca a la vista */}
      <Layers cam={cam.transform}>
        <Plane z={-520}>
          {g < S23 ? (
            <PhotoPlane src="img/cmesodimac/cmes_mv_calo1.jpg" dim={0.6} tint={V.sky} scale={1.24} />
          ) : (
            <PhotoPlane src="img/cmesodimac/cmes_mv_calo4.jpg" dim={0.58} tint={V.amber} scale={1.2} />
          )}
        </Plane>
      </Layers>

      <Layers cam={world}>
        {/* ── ACTO 1 · la etiqueta trasera: "medido a veinticinco grados" ── */}
        {A1 && (
          <Plane z={-40} style={{
            opacity: WIN(g, -20, S12 + 4) * zt.opacity,
            transform: "translateZ(-40px) " + zt.out,
          }}>
            <MediaCard src="img/cmesodimac/cmes_mv_calo1.jpg" kind="photo"
              w={1080} h={620} x={57} y={47} z={0} ry={-6} rx={2}
              lit={0.9} litColor={key} sheenAt={52} label="LA ETIQUETA, ATRAS DEL PANEL" />
            <IconPng src="img/cmesodimac/cmes_ic_sello.png" x={17} y={68} size={128} z={140} opacity={0.9} rot={-9} />
          </Plane>
        )}

        {/* ── ACTO 2 · el termometro infrarrojo contra el vidrio ── */}
        {A2 && (
          <Plane z={-30} style={{ opacity: WIN(g, S12 - 4, S23 + 8) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_calo2.mp4" kind="video"
              w={1080} h={610} x={52} y={48} z={0} ry={6} rx={-2}
              lit={0.98} litColor={key} sheenAt={S12 + 36} label="TERMOMETRO INFRARROJO · AL VIDRIO" />
            <IconPng src="img/cmesodimac/cmes_ic_termometro.png" x={17} y={64} size={140} z={150} opacity={0.94} rot={9} />
          </Plane>
        )}

        {/* ── ACTO 3 · el aire ondulando: cuatro decimas por cada grado ── */}
        {A3 && (
          <Plane z={-40} style={{ opacity: WIN(g, S23 - 8, S34 + 5) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_calo3.mp4" kind="video"
              w={860} h={500} x={30} y={38} z={0} ry={9} rx={-2.6}
              lit={0.86} litColor={key} sheenAt={S23 + 44} label="EL AIRE SOBRE LA CHAPA" />
          </Plane>
        )}

        {/* ── ACTO 4 · la mano que toca el vidrio y la retira ── */}
        {A4 && (
          <Plane z={-30} style={{ opacity: WIN(g, S34 + 5, END + 40) }}>
            <MediaCard src="img/cmesodimac/cmes_mv_calo4.jpg" kind="photo"
              w={950} h={560} x={64} y={44} z={0} ry={-7} rx={2.2}
              lit={0.92} litColor={key} sheenAt={S34 + 40} label="CINCUENTA Y OCHO GRADOS AL TACTO" />
            <IconPng src="img/cmesodimac/cmes_ic_humo.png" x={86} y={22} size={112} z={150} opacity={0.62} rot={5} glow={V.amber} />
          </Plane>
        )}
      </Layers>

      {/* ── COSTURAS ── */}
      <SeamOcclude at={S23 - 8} dur={16} color={V.steel} angle={9} />
      <SeamFlash at={S34} color={V.volt} dur={6} />

      {/* ── GRAFICO, CIFRAS Y TEXTO: plano plano, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* acto 1 — la promesa: 25 grados, en amber (lo que dice la etiqueta) */}
        <Titular g={g} inF={26} outF={S12 - 8} kick="LETRA CHICA" kickColor={V.amber}
          head="LOS CIEN SE MIDEN A 25 GRADOS" size={62}
          sub="Veinticinco. En un laboratorio, no arriba de una chapa." />
        {g >= 120 && g < S12 + 2 && (
          <div style={{ opacity: WIN(g, 120, S12 + 2) }}>
            <Readout value="25" unit="°C" label="dice la etiqueta" at={136} x={24} y={26} size={158} color={V.amber} />
          </div>
        )}

        {/* acto 2 — la medicion: 58 grados, en volt (lo que dice el instrumento) */}
        <Titular g={g} inF={S12 + 24} outF={S23 - 10} side="right" kick="ESE SABADO, AL VIDRIO"
          head="CINCUENTA Y OCHO" sub="Treinta y tres grados por encima de la etiqueta." />
        {g >= S12 + 70 && g < S23 + 2 && (
          <div style={{ opacity: WIN(g, S12 + 70, S23 + 2) }}>
            <Readout value="58" unit="°C" label="mide el termometro" at={S12 + 86} x={23} y={25} size={170} color={V.volt} />
          </div>
        )}

        {/* acto 3 — el grafico: el calor sube, la potencia baja */}
        <Cruce g={g} />
        <Titular g={g} inF={S23 + 26} outF={S34 - 10} kick="SILICIO"
          head="CUATRO DECIMAS POR CADA GRADO" size={60}
          sub="Por cada grado arriba de veinticinco, el panel entrega menos." />

        {/* ⭐ EL EJE — nace como base del grafico y termina siendo el cable de cobre */}
        <EjeCobre g={g} />

        {/* acto 4 — LA CIFRA: 13 vatios que se evaporan */}
        {g >= S34 + 22 && (
          <div style={{
            position: "absolute", left: 92, top: 200, opacity: WIN(g, S34 + 22, END + 60),
            transform: "translateY(" + lerp(30, -14, sube).toFixed(1) + "px)",
          }}>
            <Bed pad={26} w={580}>
              <Kick color={V.amber}>SE FUERON EN CALOR</Kick>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 16 }}>
                <Num size={200} color={V.amber}>13</Num>
                <Head size={44} color={V.amber}>vatios</Head>
              </div>
              <div style={{ marginTop: 8 }}><Body size={29}>Un trece por ciento largo, solo por temperatura.</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ── SFX (3) ── */}
      <Sequence from={S12 - 22} durationInFrames={46} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.38} />
      </Sequence>
      <Sequence from={S12 + 84} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={S23 + 38} durationInFrames={80} layout="none">
        <Audio src={staticFile("sfx/bar_grow.mp3")} volume={0.32} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovCalor: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
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
