// MovEscalones.tsx — S10 · LOS TRES ESCALONES: el primero es GRATIS y es el mejor negocio del video.
// Video `cmesodimac` (Claudio Mendoza Constructor). 5 actos · 1980 frames @30 (66 s). ms0 866.440.
//
// LA ESPINA: dos maderas y un trapo llevan el panel de 53 a 68 vatios sin gastar un peso. Después
// se paga: 34 dólares de regulador para llegar a 84. Y el tercer escalón, el que decide si el equipo
// dura, es la batería — y ahí la barata es la cara.
//
// ⭐ EL OBJETO PROTAGONISTA VUELVE: LA CAJA del principio, ya vacía y APLASTADA, es la CUÑA que
// inclina el panel. Se reconoce (misma silueta, mismo rótulo, mismo cartón) y aparece dos veces:
// entrando bajo el borde del panel en el acto 1, y aplanándose para ser la tapa de la batería en el 5.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cám / luz / materia)                 | SALE (cám / luz / materia)
//  1   |    0 →  360 | z −180, panX 0 · TORCH (noche), keyFrom .20 | z −136 · torch+volt · LA CUÑA
//      |             | materia: la chapa del bidón (de MovGiro)    | de cartón calzada bajo el panel
//  2   |  360 →  740 | z −136 · volt entrando, keyFrom .28         | z −86 · volt · EL TRAPO húmedo
//      |             | mundo 2 (montado a +700 px en Y)            | cruzando el vidrio
//  3   |  740 → 1160 | z −86 · volt, keyFrom .36 · papel del trapo | z −22 · volt · los DOS reguladores
//  4   | 1160 → 1560 | z −22 · volt duro (salimos del zoom)        | z +26 · volt · la ESCALERA 53/68/84
//  5   | 1560 → 1980 | z +26 · volt (beat) · madera del tablón     | z +60, panX +40 · volt keyFrom .46
//      |             |                                             | LA TAPA DE LA BATERÍA → MovBateria
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=360   MATCH-MOVE  · el panel se inclina y la cámara SUBE con él: rail de 700 px en Y. El
//              mundo 2 (la pinza y el trapo) vive montado a +700 px y entra sin cortar.
//  2→3 f=740   OCLUSIÓN V.paper · el trapo húmedo cruza el cuadro (materia clara: el Stage le baja
//              la luminancia al cubrir, por eso no hace flash blanco).
//  3→4 f=1160  ZOOM-THROUGH · la cámara entra POR EL HUECO ENTRE LOS DOS REGULADORES (fx 52, fy 49)
//              y sale en la escalera. El acto 3 se va con `z.out` aplicado, no con opacidad.
//  4→5 f=1560  CORTE EN EL BEAT · SeamFlash V.volt dur 5 sobre "la batería".
//  5→out       MATCH-SHAPE · la cuña se APLANA y la tarjeta de las dos baterías crece hasta la
//              geometría exacta con la que abre MovBateria (w 980 · h 560 · x 50 · y 52 · rot 0).
//
// ⛔ cero Math.random · cero Date.now · cero backdrop-filter · cero rgba() a mano · cero Easing.quint
// ⛔ V.danger NO se usa en este tramo. Dinero en V.amber, medición en V.volt.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamFlash, zoomThrough, Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ ─────────────────────────────────────────────────────────────────────────────────
const END = 1980;
const A2 = 360, A3 = 740, A4 = 1160, A5 = 1560;

const RY = 700;                          // el mundo 2 vive montado a +700 px en Y
const RAIL0 = A2 - 74, RAIL1 = A2 + 62;  // ventana del MATCH-MOVE
const F_OCL = A3 - 7;                    // OCLUSIÓN del trapo: cobertura total en g=740
const F_ZT = A4 - 20;                    // ZOOM-THROUGH: termina justo en la frontera
const F_BEAT = A5;                       // CORTE EN EL BEAT
const MS0 = END - 96, MS1 = END;         // MATCH-SHAPE de salida → MovBateria

const EI = Easing.bezier(0.4, 0, 0.24, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── EL MATERIAL REAL (⛔ rutas LITERALES, jamás por template literal) ─────────────────────────
const M = {
  camaRegF: "img/cmesodimac/cmes_mv_esca3.jpg",   // los dos reguladores sobre el tablón
  camaBatF: "img/cmesodimac/cmes_mv_esca4.jpg",   // plomo y litio, uno al lado del otro
  cunaV: "broll/cmesodimac/cmes_mv_esca1.mp4",    // las dos maderas haciendo cuña bajo el panel
  trapoV: "broll/cmesodimac/cmes_mv_esca2.mp4",   // el trapo húmedo sobre el vidrio polvoriento
  manosV: "broll/cmesodimac/cmes_mv_esca5.mp4",   // Claudio levantando el panel y calzando la cuña
  caja: "img/cmesodimac/cmes_ic_caja.png",        // ⭐ LA CAJA del principio — ahora la cuña
  icRegla: "img/cmesodimac/cmes_ic_regla.png",
  icSol: "img/cmesodimac/cmes_ic_sol.png",
  icPinza: "img/cmesodimac/cmes_ic_pinza.png",
  icBateria: "img/cmesodimac/cmes_ic_bateria.png",
  icMoneda: "img/cmesodimac/cmes_ic_moneda.png",
};

// ── LA CÁMARA · una sola función de g, monótona, que nunca vuelve a cero ──────────────────────
const travelXAt = (g: number) => interpolate(
  g, [0, A2, A3, A3 + 220, A4, A4 + 260, A5, END],
  [-40, 18, 62, 30, -34, -8, 46, 96], { ...cl, easing: EI },
);
const travelYAt = (g: number) => interpolate(
  g, [0, RAIL0, A2, A3, A4, A5, END],
  [22, 10, -18, -34, 12, -6, -26], { ...cl, easing: EI },
);
const pushAt = (g: number) => interpolate(
  g, [0, 120, A2 - 60, A2 + 120, A3, A3 + 200, A4, A4 + 160, A5, A5 + 160, MS0, END],
  [1.1, 1.02, 1.07, 1.0, 1.04, 1.0, 1.16, 1.0, 1.08, 1.0, 1.02, 1.07], { ...cl, easing: EI },
);
const railYAt = (g: number) => -RY * ES(g, RAIL0, RAIL1);
const camAt = (g: number) => {
  const base = gcam(g, { z0: -180, z1: 60, panX: 40, panY: -24, ry: -3, rx: -2.4, dur: END });
  return base.transform + " translate(" + travelXAt(g).toFixed(1) + "px, " + travelYAt(g).toFixed(1) + "px) scale(" + pushAt(g).toFixed(3) + ")";
};

// ── LA LUZ · sigue siendo de noche (tramo D) pero el VOLTIO toma la key: la medición manda ────
const tintAt = (g: number) => light(LN(g, 0, A4), "torch", "volt");
const tint2At = (g: number) => (g < A3 ? V.torch : light(LN(g, A3, END), "torch", "amber"));

// ── ⭐ LA CAJA APLASTADA · el objeto protagonista convertido en cuña ───────────────────────────
// No es un vector: es el mismo cartón del principio (su PNG), aplastado y calzado. `squash` es lo
// que la convierte en cuña; `rot` es el ángulo que le da al panel.
const CajaCuna: React.FC<{ x: number; y: number; w: number; rot: number; squash: number; opacity: number; g: number }> = ({
  x, y, w, rot, squash, opacity, g,
}) => (
  <div style={{
    position: "absolute", left: x + "%", top: y + "%", width: w, marginLeft: -w / 2,
    transform: "rotate(" + rot.toFixed(2) + "deg) scaleY(" + squash.toFixed(3) + ") translateY(" + (Math.sin(g / 47) * 2).toFixed(2) + "px)",
    transformOrigin: "50% 100%", opacity,
    filter: "drop-shadow(0 14px 26px " + rgba(V.ink0, 0.85) + ")",
  }}>
    <Img src={staticFile(M.caja)} style={{ width: "100%", height: "auto", display: "block" }} />
  </div>
);

// ── LA ESCALERA · esto SÍ es un gráfico (mide vatios), por eso va en vector + material adentro ─
const PASOS = [
  { w: 53, kick: "COMO VINO", src: "broll/cmesodimac/cmes_mv_esca1.mp4", tag: "PLANO SOBRE EL TECHO" },
  { w: 68, kick: "CUÑA + TRAPO", src: "broll/cmesodimac/cmes_mv_esca2.mp4", tag: "CERO DOLARES" },
  { w: 84, kick: "REGULADOR", src: "img/cmesodimac/cmes_mv_esca3.jpg", tag: "34 DOLARES" },
];

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = camAt(g);
  const railY = railYAt(g);
  const zt = zoomThrough(g, F_ZT, 20, 52, 49);
  const ms = ES(g, MS0, MS1);                      // MATCH-SHAPE de salida

  const keyFrom = interpolate(g, [0, A2, A3, A4, A5, END], [0.20, 0.28, 0.36, 0.42, 0.44, 0.46], { ...cl, easing: EI });
  const inten = interpolate(g, [0, A2, A3, A4, A5, END], [0.82, 0.9, 0.96, 1.04, 1.0, 1.0], { ...cl, easing: EI });
  const piso = interpolate(g, [0, A2, A3, A4, A5, END], [0.72, 0.70, 0.66, 0.62, 0.60, 0.58], { ...cl, easing: EI });

  const leerShift = "translate(" + (travelXAt(g) * 0.08).toFixed(1) + "px, " + (travelYAt(g) * 0.08).toFixed(1) + "px)";

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ═══ LA ATMÓSFERA — montada UNA vez, jamás se remonta entre actos ═══════════════════ */}
      <VoltAtmos tint={tintAt(g)} tint2={tint2At(g)} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* ═══ EL MUNDO 3D ═══════════════════════════════════════════════════════════════════ */}
      <Layers cam={cam}>
        {/* LA CAMA · el tablón. Cambia UNA vez, tapada por el ZOOM-THROUGH (nunca a la vista) */}
        <Plane z={-520} style={{ transform: "translateZ(-520px) translate3d(0," + (railY * 0.16).toFixed(1) + "px,0)" }}>
          {g < A4 - 12
            ? <PhotoPlane src={M.camaRegF} kind="photo" z={0} scale={1.3} dim={0.62} tint={V.torch} />
            : <PhotoPlane src={M.camaBatF} kind="photo" z={0} scale={1.24} dim={0.56} tint={V.volt} />}
        </Plane>

        {/* EL MUNDO DE LOS OBJETOS · el rail en Y del MATCH-MOVE 1→2 */}
        <Plane z={0} style={{ transform: "translateZ(0px) translate3d(0," + railY.toFixed(1) + "px,0)" }}>

          {/* ── MUNDO 1 (y 0) · ACTO 1: la cuña gratis ─────────────────────────────────────── */}
          {g < A2 + 140 && (() => {
            const p = ES(g, 10, 70);
            const calza = ES(g, 96, 210);              // la caja entra bajo el borde y lo levanta
            return (
              <>
                <MediaCard
                  src={M.manosV} kind="video"
                  w={lerp(1180, 980, calza)} h={lerp(664, 552, calza)}
                  x={lerp(50, 44, calza)} y={lerp(50, 46, calza)} z={-30}
                  ry={lerp(0, -5, calza)} rx={lerp(0, 1.6, calza)} radius={12}
                  lit={0.6 + 0.35 * p} litColor={V.torch} sheenAt={54}
                  opacity={p} label="LEVANTA EL BORDE Y CALZA" />
                <MediaCard
                  src={M.cunaV} kind="video"
                  w={470} h={294} x={80} y={68} z={140}
                  ry={-12} rot={2} radius={10} startFrom={38}
                  lit={0.55 + 0.4 * calza} litColor={V.volt} sheenAt={200}
                  opacity={calza} label="DOS PEDAZOS DE MADERA" />
                {/* ⭐ LA CAJA del principio, vacía y aplastada, entrando como cuña */}
                <CajaCuna
                  g={g}
                  x={lerp(20, 31.5, calza)} y={lerp(84, 71, calza)}
                  w={lerp(300, 260, calza)} rot={lerp(-2, -13, calza)}
                  squash={lerp(0.5, 0.3, calza)} opacity={clamp01(calza * 1.4)} />
                <IconPng src={M.icRegla} x={62} y={78} size={78} z={190} opacity={0.8 * calza} glow={V.ink0} />
                <IconPng src={M.icSol} x={16} y={20} size={92} z={190} opacity={0.75 * p} glow={V.ink0} />
              </>
            );
          })()}

          {/* ── MUNDO 2 (y +700) · ACTOS 2 y 3: la pinza sube y el trapo cruza ─────────────── */}
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "translate3d(0," + RY + "px,0)", transformStyle: "preserve-3d" }}>

            {/* ACTO 2 · el trapo y los vatios gratis */}
            {g > A2 - 130 && g < A3 + 24 && (() => {
              const p = ES(g, A2 - 110, A2 + 40);
              const trapo = ES(g, A2 + 150, A2 + 250);
              const sale = ES(g, A3 - 60, A3);
              return (
                <>
                  <MediaCard
                    src={M.trapoV} kind="video"
                    w={lerp(1060, 900, trapo)} h={lerp(596, 506, trapo)}
                    x={lerp(50, 57, trapo)} y={lerp(50, 47, trapo)} z={-10}
                    ry={lerp(0, 5, trapo)} radius={12}
                    lit={0.62 + 0.3 * p} litColor={V.volt} sheenAt={A2 + 40}
                    opacity={p * (1 - sale * 0.35)} label="TRES SEMANAS DE POLVO" />
                  <MediaCard
                    src={M.manosV} kind="video"
                    w={420} h={262} x={20} y={70} z={150}
                    ry={13} rot={-2} radius={10} startFrom={96}
                    lit={0.6} litColor={V.volt} sheenAt={A2 + 210}
                    opacity={p * (1 - sale)} label="MISMO PANEL, MISMO DIA" />
                  <IconPng src={M.icPinza} x={80} y={76} size={104} z={190} opacity={0.85 * p * (1 - sale)} glow={V.ink0} />
                </>
              );
            })()}

            {/* ACTO 3 · los dos reguladores (el acto SALE por el hueco entre ellos) */}
            {g > A3 - 30 && g < A4 + 10 && (() => {
              const p = ES(g, A3 - 10, A3 + 70);
              return (
                <div style={{
                  position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                  transform: zt.out === "none" ? undefined : zt.out,
                  opacity: zt.opacity, transformStyle: "preserve-3d",
                }}>
                  <MediaCard
                    src={M.camaRegF} kind="photo"
                    w={1180} h={664} x={52} y={49} z={0}
                    ry={-2} radius={12} lit={0.9} litColor={V.volt} sheenAt={A3 + 46}
                    opacity={p} label="EL CHICO Y EL DE ALETAS" />
                  <IconPng src={M.icMoneda} x={19} y={26} size={96} z={180} opacity={0.85 * p} glow={V.ink0} />
                </div>
              );
            })()}
          </div>

          {/* ── ACTO 4 · LA ESCALERA 53 / 68 / 84 (vive en el mundo 2, sin rail extra) ─────── */}
          {g > A4 - 30 && g < A5 + 60 && (() => {
            const sale = ES(g, A5 - 40, A5 + 40);
            return (
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "translate3d(0," + RY + "px,0)", transformStyle: "preserve-3d", opacity: 1 - sale }}>
                {PASOS.map((s, i) => {
                  const at = A4 + 40 + i * 116;
                  const p = ES(g, at, at + 58);
                  if (p <= 0) return null;
                  const alto = lerp(0, 120 + i * 116, p);
                  return (
                    <div key={i}>
                      {/* el peldaño: gráfico, mide vatios */}
                      <div style={{
                        position: "absolute", left: 20 + i * 21 + "%", bottom: "17%",
                        width: 250, height: alto, marginLeft: -125,
                        background: "linear-gradient(180deg, " + rgba(V.volt, 0.30) + " 0%, " + rgba(V.volt, 0.06) + " 100%)",
                        borderTop: "3px solid " + rgba(V.volt, 0.95),
                        boxShadow: "0 0 30px " + rgba(V.volt, 0.22),
                      }} />
                      {/* con MATERIAL REAL adentro: lo que produjo ese vatio */}
                      <MediaCard
                        src={s.src} kind={i === 2 ? "photo" : "video"}
                        w={224} h={132} x={20 + i * 21} y={lerp(88, 84 - i * 10.6, p)} z={90 + i * 30}
                        ry={-4 + i * 4} radius={8} startFrom={20 + i * 30}
                        lit={0.55 + 0.2 * i} litColor={V.volt} sheenAt={at + 30}
                        opacity={p} label={s.tag} />
                      {/* la cifra vive EN el peldaño (mismo sistema de coordenadas que la barra) */}
                      <div style={{
                        position: "absolute", left: 20 + i * 21 + "%", bottom: 17 + (alto + 22) / 10.8 + "%",
                        transform: "translateX(-50%) translateY(" + ((1 - p) * 16).toFixed(1) + "px)",
                        opacity: p, textAlign: "center", zIndex: 3,
                      }}>
                        <Num size={lerp(90, 112 + i * 10, p)} color={i === 2 ? V.volt : V.voltSoft}>{String(s.w)}</Num>
                        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: rgba(V.white, 0.72), marginTop: 2 }}>{s.kick}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* ── ACTO 5 · las dos baterías · MATCH-SHAPE de salida hacia MovBateria ─────────── */}
          {g > A5 - 40 && (() => {
            const p = ES(g, A5, A5 + 80);
            return (
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "translate3d(0," + RY + "px,0)", transformStyle: "preserve-3d" }}>
                <MediaCard
                  src={M.camaBatF} kind="photo"
                  w={lerp(860, 980, ms)} h={lerp(520, 560, ms)}
                  x={lerp(44, 50, ms)} y={lerp(50, 52, ms)} z={lerp(20, 0, ms)}
                  ry={lerp(-4, 0, ms)} rot={lerp(-1.4, 0, ms)} radius={lerp(14, 12, ms)}
                  lit={0.7 + 0.3 * p} litColor={V.volt} sheenAt={A5 + 40}
                  opacity={p} label={ms < 0.4 ? "PLOMO Y LITIO, MISMO TAMAÑO" : undefined} />
                {/* ⭐ la caja-cuña vuelve y se APLANA: la tapa de la batería */}
                <CajaCuna
                  g={g}
                  x={lerp(78, 50, ms)} y={lerp(74, 62, ms)}
                  w={lerp(240, 470, ms)} rot={lerp(-9, 0, ms)}
                  squash={lerp(0.34, 0.1, ms)} opacity={clamp01(ES(g, A5 + 120, A5 + 200)) * (1 - ms * 0.35)} />
                <IconPng src={M.icBateria} x={16} y={24} size={92} z={180} opacity={0.8 * p * (1 - ms)} glow={V.ink0} />
              </div>
            );
          })()}
        </Plane>
      </Layers>

      {/* ═══ LA CAPA DE LECTURA · fuera del mundo 3D ════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: leerShift }}>

        {/* ACTO 1 · escalón uno: gratis */}
        {g < A2 + 30 && (() => {
          const p = ES(g, 40, 110);
          const out = ES(g, A2 - 50, A2 + 20);
          if (p <= 0) return null;
          return (
            <div style={{ position: "absolute", left: "6.5%", bottom: "13%", opacity: p * (1 - out), transform: "translateY(" + ((1 - p) * 24).toFixed(1) + "px)" }}>
              <Bed pad={30} w={800}>
                <Kick color={V.volt}>ESCALÓN UNO</Kick>
                <div style={{ marginTop: 6 }}>
                  <Head size={92} color={V.volt}>GRATIS</Head>
                  <Body size={32}>Dos pedazos de madera, una cuña, y el panel mirando al ecuador.</Body>
                </div>
                <div style={{ marginTop: 12, opacity: clamp01(ES(g, 210, 280)) }}>
                  <Kick color={V.amber}>LA CAJA DEL PRINCIPIO — AHORA VACÍA</Kick>
                </div>
              </Bed>
            </div>
          );
        })()}

        {/* ACTO 2 · de 53 a 68, sin gastar un peso. LA MEDICIÓN EN VOLTIO. */}
        {g > A2 + 40 && g < A3 + 10 && (() => {
          const out = ES(g, A3 - 50, A3);
          const dos = clamp01(ES(g, A2 + 250, A2 + 300));
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", left: "6.5%", top: "12%" }}>
                <Bed pad={26} w={560}>
                  <Kick color={V.volt}>MISMO PANEL, MISMO SOL</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={50}>Once vatios por la cuña. Cuatro más por el trapo.</Head>
                  </div>
                </Bed>
              </div>
              <div style={{ opacity: 1 - dos * 0.55, transform: "scale(" + (1 - dos * 0.16).toFixed(3) + ")", transformOrigin: "78% 34%" }}>
                <Readout value="64" unit="W" label="solo con inclinarlo" at={A2 + 130} x={78} y={34} size={126} color={V.volt} />
              </div>
              <Readout value="68" unit="W" label="y con el vidrio limpio" at={A2 + 296} x={76} y={62} size={150} color={V.volt} />
            </div>
          );
        })()}

        {/* ACTO 3 · escalón dos: 34 dólares. EL DINERO EN ÁMBAR. */}
        {g > A3 + 20 && g < A4 + 20 && (() => {
          const out = ES(g, F_ZT, A4);
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", left: "6.5%", bottom: "14%" }}>
                <Bed pad={28} w={720}>
                  <Kick color={V.amber}>ESCALÓN DOS</Kick>
                  <div style={{ marginTop: 6 }}>
                    <Head size={52}>El regulador bueno no tira el sobrante: <Em color={V.volt}>lo transforma</Em>.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="34" unit="US$" label="lo que cuesta el escalon dos" at={A3 + 70} x={78} y={26} size={132} color={V.amber} />
              <Readout value="+16" unit="W" label="lo que devuelve" at={A3 + 230} x={78} y={52} size={112} color={V.volt} />
            </div>
          );
        })()}

        {/* ACTO 4 · la escalera: las tres cifras las escribe el kit, nunca la imagen */}
        {g > A4 + 20 && g < A5 + 30 && (() => {
          const out = ES(g, A5 - 40, A5 + 10);
          return (
            <div style={{ opacity: 1 - out }}>
              <div style={{ position: "absolute", right: "6.5%", top: "13%", opacity: clamp01(ES(g, A4 + 300, A4 + 360)), textAlign: "right" }}>
                <Bed pad={26} w={480}>
                  <Kick color={V.volt}>DEL PANEL PLANO AL PANEL BIEN PUESTO</Kick>
                  <div style={{ marginTop: 6 }}>
                    <Head size={44}>Un <Em color={V.volt}>58 %</Em> más de vatios.</Head>
                  </div>
                </Bed>
              </div>
            </div>
          );
        })()}

        {/* ACTO 5 · la batería barata es la cara (el precio, en ámbar) */}
        {g > A5 + 20 && (() => {
          const p = ES(g, A5 + 30, A5 + 100);
          return (
            <div style={{ opacity: p * (1 - ms * 0.6) }}>
              <div style={{ position: "absolute", left: "6.5%", top: "12%" }}>
                <Bed pad={28} w={700}>
                  <Kick color={V.amber}>ESCALÓN TRES — Y NO ES OPCIONAL</Kick>
                  <div style={{ marginTop: 8 }}>
                    <Head size={58}>La batería barata es la batería <Em color={V.amber}>cara</Em>.</Head>
                  </div>
                </Bed>
              </div>
              <Readout value="85" unit="US$" label="la de plomo" at={A5 + 140} x={30} y={78} size={104} color={V.amber} />
              <Readout value="180" unit="US$" label="la de litio" at={A5 + 230} x={72} y={78} size={104} color={V.amber} />
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* ═══ LAS COSTURAS ══════════════════════════════════════════════════════════════════ */}

      {/* 2→3 · OCLUSIÓN con EL TRAPO (V.paper) — el Stage le baja la luminancia al cubrir */}
      <SeamOcclude at={F_OCL} dur={14} color={V.paper} angle={10} />

      {/* 4→5 · CORTE EN EL BEAT (3-6 cuadros en screen · NO es un fade) */}
      <SeamFlash at={F_BEAT} color={V.volt} dur={5} />

      {/* el grano: la misma piel de imagen en los cinco actos */}
      <AbsoluteFill style={{
        opacity: 0.05, pointerEvents: "none", mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(102deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 5px)",
      }} />

      {/* SFX (3) · la cuña que apoya, el trapo que cruza, el remate de la escalera */}
      <Sequence from={150} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={F_OCL - 4} durationInFrames={36} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={A4 + 40} durationInFrames={90} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovEscalones: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;                                   // acto={0} = "dibujá el movimiento entero"
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);     // adentro, useCurrentFrame() === gFrame
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
