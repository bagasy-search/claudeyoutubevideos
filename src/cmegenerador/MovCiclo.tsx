// MovCiclo.tsx — S6 · EL CORAZÓN DEL VIDEO
// "El compresor trabaja OCHO MINUTOS DE CADA TREINTA. Por eso el promedio es diez veces más chico
//  que el pico: un kilovatio hora con tres, no veintiocho."
//
// UN SOLO MOVIMIENTO de 62 s (1860 frames). Una atmósfera montada una vez, UNA cámara función de
// `gFrame` que nunca vuelve a 0 (el rail del match-move se SUMA, no reinicia), la luz viajando de
// ámbar bajo (de donde venimos) a volt duro de laboratorio (a donde vamos), y materia cruzando
// TODAS las fronteras.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | enterFrom (cám / luz / materia)                          | exitTo (cám / luz / materia)
// -----|-------------|----------------------------------------------------------|--------------------------------------------------------
//  0   | (MovFaltan) | —                                                        | cám z≈-240 quieta · luz ámbar bajo · LA BOMBA sola en cuadro
//  1   | 0 → 330     | cám z=-240, rail 0 · luz ámbar (keyFrom .74, int .74)     | cám z≈-190, rail 0 · luz ámbar→verdosa ·
//      |             | materia: la tarjeta de LA BOMBA (cicl5) saliendo de cuadro| EL PANEL DEL REFRI aplanándose (match-shape)
//  2   | 330 → 800   | cám z≈-190, rail 0 · luz mezcla · la cama del refri con   | cám z≈-60, rail −2200 (viajando) · luz volt 60% ·
//      |             | LA TIRA naciendo encima                                  | materia: EL RIEL DEL DÍA extendido hasta el mundo 2
//  3   | 800 → 1230  | cám z≈-60, rail −2200 (aterrizado en el mundo 2) ·        | cám z≈+10, rail −2200 · luz volt 85% ·
//      |             | luz volt 60% · materia: el riel encogido = LA CINTA       | materia: LA HOJA DEL MEDIDOR (V.paper) barriendo el cuadro
//  4   | 1230 → 1560 | cám z≈+10, rail −2200 · luz volt + torch del foco ·       | cám z≈+45 + zoom-through · luz volt dura ·
//      |             | materia: el papel deja EL FOCO detrás                     | materia: EL FILAMENTO (punto caliente) atravesado
//  5   | 1560 → 1860 | cám z≈+45, rail −2200 · luz volt dura, negro puro ·       | cám z≈+60 · luz VOLT PURO, laboratorio negro ·
//      |             | materia: el filamento = 1ª celda del congelador           | materia: LAS TRES TIRAS latiendo (→ MovDosPreguntas)
//
// ── COSTURAS (una distinta por frontera · ninguna es un fade) ────────────────────────────────
//  1→2  f≈300-344  MATCH-SHAPE  · el panel del refri se aplana y se vuelve la cama de la tira; la
//                                 MISMA instancia de <DutyField> morfea w/h/y (jamás se remonta).
//  2→3  f≈668-772  MATCH-MOVE   · la cámara viaja −2200 px A LO LARGO del riel del día; el mundo 2
//                                 ya está montado a +2200 px. Cancelación EXACTA: el rail se suma al
//                                 final de la cadena de gcam, así que rail y mundo son traslaciones
//                                 puras en la misma base y conmutan con el translateZ de cada plano.
//  3→4  f=1218     OCLUSIÓN     · <SeamOcclude color={V.paper}> = la hoja del medidor cruzando
//                                 (color de la MATERIA, jamás del fondo).
//  4→5  f=1542     ZOOM-THROUGH · zoomThrough() entra en el filamento (50%,40%) y sale en el
//                                 congelador: el punto caliente aterriza como 1ª celda de la tira.
//
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── El reloj del movimiento ─────────────────────────────────────────────────────────────────
const END = 1860;
const S12A = 300, S12B = 344;      // match-shape
const S23A = 668, S23B = 772;      // match-move (el viaje de la cámara)
const S34 = 1218;                  // oclusión con V.paper
const S45 = 1542;                  // zoom-through al filamento
const WX = 2200;                   // el MUNDO 2 vive 2200 px a la derecha

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// el ciclo del compresor: 40 frames encendido de cada 150 = OCHO DE CADA TREINTA
const CYC = 150;
const duty = (g: number) => {
  const ph = ((g % CYC) + CYC) % CYC;
  return clamp01(Math.min(ph / 6, (40 - ph) / 6, 1));
};

// ── Titular del acto: entra por barrido (clip-path), nunca por fade ─────────────────────────
const Titular: React.FC<{ g: number; at: number; out?: number; kick: string; text: string; top?: number }> = ({
  g, at, out = 99999, kick, text, top = 150,
}) => {
  const inP = ES(g, at, at + 16);
  const outP = ES(g, out, out + 14);
  if (inP <= 0) return null;
  const p = clamp01(inP - outP);
  return (
    <div style={{
      position: "absolute", left: 200, top,
      transform: `translateY(${((1 - inP) * 26 - outP * 18).toFixed(1)}px)`,
      clipPath: `inset(0 ${(100 - p * 100).toFixed(1)}% -30% 0)`,
    }}>
      <Bed pad={22}>
        <Kick>{kick}</Kick>
        <div style={{ height: 8 }} />
        <Head size={78}>{text}</Head>
      </Bed>
    </div>
  );
};

// ── EL RIEL DEL DÍA: 48 medias horas, cada una con su 8-de-30 ───────────────────────────────
// Es estructura GRÁFICA (un eje, no un objeto): la materia real vive en las MediaCards.
const RielDia: React.FC<{ g: number; w: number; h: number; y: number; on: number }> = ({ g, w, h, y, on }) => {
  const head = (((g / 9) % 48) + 48) % 48;
  return (
    <div style={{
      position: "absolute", left: "50%", top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, display: "flex",
      gap: Math.max(2, Math.round(w / 48 / 6)), opacity: clamp01(on), alignItems: "flex-end",
    }}>
      {Array.from({ length: 48 }, (_, i) => {
        const paso = clamp01(1 - Math.abs((head - i + 48) % 48) / 2.6);
        return (
          <div key={i} style={{
            flex: 1, height: "100%", position: "relative", borderRadius: 2, overflow: "hidden",
            background: rgba(V.white, 0.07 + 0.05 * paso),
          }}>
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: `${(8 / 30) * 100}%`,
              background: rgba(V.volt, 0.6 + 0.4 * paso),
              boxShadow: `0 0 ${Math.round(6 + 14 * paso)}px ${rgba(V.volt, 0.5 * (0.4 + paso))}`,
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Ciclo: React.FC<{ g: number }> = ({ g }) => {
  // LA CÁMARA: una sola, continua. El rail del match-move se SUMA al final de la cadena.
  const cam = gcam(g, { z0: -240, z1: 60, panX: -70, panY: -30, ry: 8, rx: -2.6, dur: END });
  const railX = -WX * ES(g, S23A, S23B);
  const camT = `${cam.transform} translateX(${railX.toFixed(2)}px)`;

  // LA LUZ: ámbar bajo (de MovFaltan) → volt puro y duro (a MovDosPreguntas)
  const tintA = light(ES(g, 60, 1460), "amber", "volt");
  const tint2A = light(ES(g, 220, 1320), "amber", "voltSoft");
  const keyFrom = lerp(0.74, 0.30, ES(g, 60, 1400));
  const inten = lerp(0.74, 1.0, ES(g, 0, 1240));
  const piso = lerp(0.50, 0.80, ES(g, 320, 1720));

  const on = duty(g);                                   // el compresor: enciende, enfría, espera
  const luzComp = light(on, "amber", "volt");

  // VENTANAS (cortes duros, cada uno tapado por su costura)
  const vA1 = g < 330;
  const vShare = g > 4 && g < 800;                      // el panel del refri (mundo 1)
  const vA2 = g > 296 && g < 800;
  const vA3 = g > 630 && g < 1229;                      // ya montado a la derecha ANTES del viaje
  const vA4 = g > 1224 && g < 1592;
  const vA5 = g > 1548;

  // MATCH-SHAPE: el panel se aplana y la tira nace con su geometría
  const mS = ES(g, S12A, S12B);
  const cardW = lerp(1020, 1300, mS);
  const cardH = lerp(590, 150, mS);
  const cardY = lerp(47, 52, mS);
  const tiraW = lerp(880, 1300, mS);
  const tiraH = lerp(20, 66, mS);
  const tiraY = lerp(84, 52, mS);
  const tiraOn = lerp(0.42, 1, ES(g, 240, S12B));

  // El riel del día: nace en el mundo 1, la cámara viaja a lo largo y se encoge en LA CINTA
  const rielMove = WX * ES(g, 776, 848);
  const rielW = lerp(4400, 1180, ES(g, 776, 848));
  const rielH = lerp(74, 26, ES(g, 776, 848));
  const rielY = lerp(68, 88, ES(g, 776, 848));

  // ZOOM-THROUGH al filamento
  const zt = zoomThrough(g, S45, 20, 50, 40);
  const a4T = `translateX(${WX}px)${zt.out === "none" ? "" : ` ${zt.out}`}`;

  // El punto caliente del filamento que aterriza como 1ª celda del congelador
  const fp = LN(g, S45 + 6, S45 + 40);
  const fx = lerp(50, 34.2, fp), fy = lerp(40, 36, fp);

  const dimBack = lerp(0.58, 0.80, ES(g, 120, 1100));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez y no se remonta nunca ─────────────────────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      {/* PLANO 1 — el telón de fondo, con parallax propio (distancia infinita: fuera de la cámara).
          Sólo cambia bajo la OCLUSIÓN y bajo el ZOOM-THROUGH: nunca a la vista. */}
      {g < 1227 && (
        <PhotoPlane src="img/cmegenerador/cmeg_mv_cicl4.png" kind="photo" z={0} scale={1.2} dim={dimBack} tint={V.amber} />
      )}
      {g >= 1224 && g < 1556 && (
        <PhotoPlane src="img/cmegenerador/cmeg_mv_cicl3.png" kind="photo" z={0} scale={1.26} dim={0.74} tint={V.torch} />
      )}

      <Layers cam={camT}>
        {/* PLANO 2 — LA LOSA (el suelo compartido del video) + la bruma baja */}
        <Plane z={-560}>
          <PadPlane y={82} w={1420} h={310} rx={64} lit={lerp(0.34, 0.62, ES(g, 300, 1300))} z={0} />
          <div style={{
            position: "absolute", left: 0, right: 0, top: "56%", height: 320,
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(tintA, 0.055)} 55%, rgba(0,0,0,0) 100%)`,
          }} />
        </Plane>

        {/* PLANO 3 — EL RIEL DEL DÍA: la materia que cruza la frontera 2→3 */}
        <Plane z={-320}>
          {g > 640 && g < 1229 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${rielMove.toFixed(1)}px)` }}>
              <RielDia g={g} w={rielW} h={rielH} y={rielY} on={LN(g, 640, 672)} />
              {g > 860 && (
                <div style={{
                  position: "absolute", left: "50%", top: `${rielY + 5}%`, marginLeft: -560, width: 1120,
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 5.2,
                  color: rgba(V.white, 0.5), textAlign: "center", textTransform: "uppercase",
                  opacity: LN(g, 860, 890),
                }}>24 horas · 48 medias horas · siempre 8 de 30</div>
              )}
            </div>
          )}
        </Plane>

        {/* PLANO 4 — LAS TIRAS: la firma visual de este video */}
        <Plane z={-110}>
          {/* el halo del compresor: late con el ciclo, no con un reloj cualquiera */}
          {vShare && (
            <div style={{
              position: "absolute", left: "50%", top: `${cardY}%`, width: cardW + 420, height: cardH + 300,
              marginLeft: -(cardW + 420) / 2, marginTop: -(cardH + 300) / 2, borderRadius: "50%",
              background: `radial-gradient(closest-side, ${rgba(luzComp, 0.16 * (0.25 + 0.75 * on))}, rgba(0,0,0,0) 72%)`,
            }} />
          )}
          {/* LA TIRA MADRE — UNA sola instancia: nace chica en el acto 1 y morfea a la grande */}
          {g > 118 && g < 800 && (
            <DutyField duty={8 / 30} cells={30} on={tiraOn} tint={V.volt} y={tiraY} w={tiraW} h={tiraH} cycle={CYC} />
          )}

          {/* ACTO 5 — TRES TIRAS con ritmos distintos (mundo 2) */}
          {vA5 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${WX}px)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, transform: "translateX(170px)" }}>
                {[
                  { y: 36, d: 8 / 30, c: 150, at: 1554 },
                  { y: 55, d: 12 / 60, c: 196, at: 1622 },
                  { y: 74, d: 2 / 60, c: 252, at: 1730 },
                ].map((r, i) => {
                  const rv = LN(g, r.at, r.at + 22);
                  if (rv <= 0) return null;
                  return (
                    <div key={i} style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(100 - rv * 100).toFixed(1)}% 0 0)` }}>
                      <DutyField duty={r.d} cells={30} on={1} tint={V.volt} y={r.y} w={980} h={38} cycle={r.c} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Plane>

        {/* PLANO 5 — EL MATERIAL REAL: las tarjetas protagonistas */}
        <Plane z={40}>
          {/* ACTO 1 · la BOMBA que viene de MovFaltan sale de cuadro y deja el REFRIGERADOR */}
          {vA1 && g < 76 && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_cicl5.mp4" kind="video"
              w={lerp(760, 360, ES(g, 0, 62))} h={lerp(430, 210, ES(g, 0, 62))}
              x={lerp(50, 116, ES(g, 4, 70))} y={lerp(48, 78, ES(g, 4, 70))}
              z={110} ry={lerp(0, -16, ES(g, 0, 62))} lit={0.9} litColor={V.amber}
              label="LA BOMBA" grade
            />
          )}
          {/* EL REFRIGERADOR — UNA sola tarjeta desde el frame 6 hasta el final del mundo 1:
              hero en el acto 1 y CAMA DE LA TIRA en el acto 2 (esto ES el match-shape). */}
          {vShare && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_cicl1.mp4" kind="video"
              w={cardW * lerp(0.42, 1, ES(g, 6, 44))} h={cardH * lerp(0.42, 1, ES(g, 6, 44))}
              x={50} y={cardY} z={0}
              lit={lerp(0.44, 1, on)} litColor={luzComp}
              sheenAt={S12A + 12} grade
              label={mS < 0.35 ? "EL REFRIGERADOR · TRES DE LA MAÑANA" : undefined}
            />
          )}
          {/* el medidor de enchufe: entra en "lo dejé medido 24 horas" y acompaña todo el mundo 1 */}
          {g > 244 && g < 800 && (
            <MediaCard
              src="img/cmegenerador/cmeg_mv_cicl2.png" kind="photo"
              w={310} h={196} x={lerp(88, 84, ES(g, 246, 330))} y={lerp(70, 26, ES(g, 300, 380))}
              z={140} ry={-9} lit={0.95} litColor={V.volt} sheenAt={252}
              label="MEDIDOR · 24 H" grade
              opacity={LN(g, 246, 262)}
            />
          )}

          {/* ACTO 3 (MUNDO 2) · las dos cifras enfrentadas con el medidor REAL detrás */}
          {vA3 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${WX}px)`, transformStyle: "preserve-3d" }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cicl2.mp4" kind="video"
                w={860} h={400}
                x={lerp(50, 168, ES(g, 1200, 1234))} y={58}
                z={0} rot={lerp(0, 9, ES(g, 1200, 1234))}
                lit={0.9} litColor={V.volt} sheenAt={820} grade
                label="LO QUE MARCÓ EL MEDIDOR"
              />
              {/* la hoja de papel: la MATERIA que barre la frontera 3→4 */}
              <div style={{
                position: "absolute", left: "50%", top: "58%", width: 300, height: 190,
                marginLeft: lerp(-150, 620, ES(g, 1196, 1230)), marginTop: -95,
                transform: `translateZ(120px) rotate(${lerp(-5, 26, ES(g, 1196, 1230)).toFixed(1)}deg)`,
                background: `linear-gradient(168deg, ${V.paper} 0%, #D9D2C4 100%)`,
                boxShadow: `0 26px 60px ${rgba(V.ink0, 0.8)}`, borderRadius: 4,
                opacity: LN(g, 992, 1016), padding: 18,
              }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: "#4A4A42" }}>ETIQUETA</div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 88, lineHeight: 1, color: "#2A2A26" }}>800 W</div>
                <div style={{ fontFamily: F_BODY, fontSize: 22, color: "#5A5A50", marginTop: 6 }}>lo que dice el papel</div>
              </div>
            </div>
          )}

          {/* ACTO 4 (MUNDO 2) · el foco de 60 vatios, solo en el cuadro */}
          {vA4 && (
            <div style={{ position: "absolute", inset: 0, transform: a4T, transformStyle: "preserve-3d", opacity: zt.opacity }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cicl3.mp4" kind="video"
                w={700} h={620} x={50} y={48} z={0}
                lit={lerp(0.86, 1, ES(g, 1480, S45))} litColor={V.torch}
                sheenAt={1246} grade label="60 VATIOS · 21 HORAS"
              />
              {/* el filamento al rojo antes de que la cámara lo atraviese */}
              <div style={{
                position: "absolute", left: "50%", top: "40%", width: 260, height: 260,
                marginLeft: -130, marginTop: -130, borderRadius: "50%", transform: "translateZ(90px)",
                background: `radial-gradient(closest-side, ${rgba(V.torch, 0.1 + 0.72 * ES(g, 1470, S45 + 12))}, rgba(0,0,0,0) 70%)`,
                mixBlendMode: "screen",
              }} />
              {/* el papel que cruzó la frontera vuelve como etiqueta colgada del cable */}
              <div style={{
                position: "absolute", left: "50%", top: "22%", marginLeft: 150, width: 172, height: 104,
                transform: `translateZ(140px) rotate(${(-7 + Math.sin(g / 47) * 2).toFixed(2)}deg)`,
                background: `linear-gradient(168deg, ${V.paper} 0%, #D9D2C4 100%)`,
                boxShadow: `0 16px 40px ${rgba(V.ink0, 0.78)}`, borderRadius: 3, padding: 12,
                opacity: LN(g, 1268, 1288),
              }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1, color: "#2A2A26" }}>60 W</div>
                <div style={{ fontFamily: F_BODY, fontSize: 18, color: "#5A5A50" }}>encendido, sin parar</div>
              </div>
            </div>
          )}

          {/* ACTO 5 (MUNDO 2) · el material de cada aparato al lado de su tira */}
          {vA5 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${WX}px)`, transformStyle: "preserve-3d" }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cicl1.mp4" kind="video"
                w={300} h={174} x={lerp(9, 19, ES(g, 1554, 1580))} y={36} z={60}
                lit={0.92} litColor={V.volt} label="CONGELADOR" grade
                opacity={lerp(1, 0.14, ES(g, 1792, 1856)) * LN(g, 1552, 1566)}
              />
              <IconPng
                src="img/cmegenerador/cmeg_ic_calentador.png"
                x={lerp(9, 19, ES(g, 1622, 1648))} y={47} size={158} z={60}
                opacity={lerp(1, 0.14, ES(g, 1792, 1856)) * LN(g, 1620, 1638)} glow={V.ink0}
              />
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_cicl5.mp4" kind="video"
                w={300} h={174} x={lerp(9, 19, ES(g, 1730, 1756))} y={74} z={60}
                lit={0.92} litColor={V.volt} label="BOMBA DE POZO" grade
                opacity={lerp(1, 0.14, ES(g, 1792, 1856)) * LN(g, 1728, 1742)}
              />
            </div>
          )}
        </Plane>

        {/* PLANO 6 — TIPOGRAFÍA Y CIFRAS (z moderado: la perspectiva agranda y se come el margen) */}
        <Plane z={130}>
          {/* ACTO 1 */}
          {vA1 && (
            <>
              <Titular g={g} at={56} out={S12A} kick="EL CICLO" text="NO ANDA TODO EL TIEMPO" />
              {/* la píldora que respira con el compresor: ENFRÍA / ESPERA */}
              {g > 84 && g < 306 && (
                <div style={{
                  position: "absolute", left: "84%", top: "24%", transform: "translate(-50%,-50%)",
                  padding: "14px 26px", borderRadius: 999,
                  background: rgba(V.ink0, 0.86),
                  border: `2px solid ${rgba(luzComp, 0.35 + 0.5 * on)}`,
                  boxShadow: `0 0 ${Math.round(10 + 36 * on)}px ${rgba(luzComp, 0.34 * on)}`,
                  opacity: LN(g, 84, 100) * (1 - LN(g, 292, 306)),
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: 3,
                    color: on > 0.5 ? V.volt : rgba(V.white, 0.6), textTransform: "uppercase",
                  }}>{on > 0.5 ? "ENFRÍA" : "ESPERA"}</div>
                </div>
              )}
            </>
          )}

          {/* ACTO 2 */}
          {vA2 && (
            <>
              <Titular g={g} at={S12B} kick="LO QUE MIDIÓ EL MEDIDOR" text="OCHO DE CADA TREINTA" />
              <Readout value="8" unit="DE 30" label="MINUTOS TRABAJANDO" at={378} x={76} y={30} size={140} color={V.volt} />
              <Readout value="120" unit="W" label="MIENTRAS ANDA" at={512} x={76} y={64} size={124} color={V.amber} />
              {g > 560 && (
                <div style={{ position: "absolute", left: 200, top: 372, width: 660, opacity: LN(g, 560, 586) }}>
                  <Bed pad={20} w={660}>
                    <Body size={31}>
                      El pico es de <Em color={V.amber}>ciento veinte vatios</Em>. El promedio no:
                      anda <Em>ocho de cada treinta minutos</Em>, todo el día.
                    </Body>
                  </Bed>
                </div>
              )}
            </>
          )}

          {/* ACTO 3 (MUNDO 2) */}
          {vA3 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${WX}px)`, transformStyle: "preserve-3d" }}>
              <Readout value="1,3" unit="kWh" label="LO QUE GASTA DE VERDAD" at={742} x={68} y={33} size={196} color={V.volt} />
              <Readout value="28" unit="kWh" label="SI ANDUVIERA SIEMPRE" at={834} x={29} y={33} size={132} color={V.danger} />
              {/* el tachón sobre el 28 */}
              {g > 856 && (
                <div style={{
                  position: "absolute", left: "29%", top: "33%", marginLeft: -125, marginTop: 22,
                  width: 250 * ES(g, 856, 878), height: 7, borderRadius: 4,
                  background: V.danger, boxShadow: `0 0 22px ${rgba(V.danger, 0.7)}`,
                  transform: "rotate(-6deg)",
                }} />
              )}
              <Titular g={g} at={793} kick="EN UN DÍA ENTERO" text="UNO CON TRES" />
              {g > 1058 && (
                <IconPng src="img/cmegenerador/cmeg_ic_foco.png" x={70} y={82} size={116} z={40}
                  opacity={LN(g, 1058, 1082)} glow={V.ink0} />
              )}
            </div>
          )}

          {/* ACTO 4 (MUNDO 2) */}
          {vA4 && (
            <div style={{ position: "absolute", inset: 0, transform: a4T, transformStyle: "preserve-3d", opacity: zt.opacity }}>
              <Titular g={g} at={1310} kick="TODO EL DÍA, EL REFRIGERADOR" text="COMO UN FOCO ENCENDIDO" />
              <Readout value="60" unit="W" label="UN FOCO" at={1316} x={80} y={34} size={126} color={V.torch} />
              <Readout value="21" unit="H" label="PRENDIDO" at={1410} x={80} y={64} size={126} color={V.volt} />
              {g > 1416 && (
                <IconPng src="img/cmegenerador/cmeg_ic_reloj.png" x={80} y={82} size={104} z={40}
                  opacity={LN(g, 1416, 1440)} glow={V.ink0} />
              )}
            </div>
          )}

          {/* ACTO 5 (MUNDO 2) */}
          {vA5 && (
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${WX}px)`, transformStyle: "preserve-3d" }}>
              <Titular g={g} at={1562} kick="NO ES MI REFRIGERADOR" text="TODO LO QUE ENFRÍA O BOMBEA" top={130} />
              {[
                { y: 36, t: "8 / 30", s: "CONGELADOR", at: 1560 },
                { y: 55, t: "12 / 60", s: "CALDERA", at: 1628 },
                { y: 74, t: "2 MIN", s: "BOMBA DE POZO", at: 1736 },
              ].map((r, i) => (
                <div key={i} style={{
                  position: "absolute", left: 660, top: `${r.y + 6.5}%`,
                  opacity: LN(g, r.at, r.at + 20),
                  display: "flex", alignItems: "baseline", gap: 20,
                }}>
                  <Num size={54}>{r.t}</Num>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 4.4,
                    color: rgba(V.white, 0.62), textTransform: "uppercase",
                  }}>{r.s}</div>
                </div>
              ))}
              {/* el filamento aterrizando como primera celda del congelador */}
              {fp < 1 && (
                <div style={{
                  position: "absolute", left: `${fx}%`, top: `${fy}%`, width: 140, height: 140,
                  marginLeft: -70, marginTop: -70, borderRadius: "50%",
                  background: `radial-gradient(closest-side, ${rgba(V.torch, 0.85 * (1 - fp))}, rgba(0,0,0,0) 68%)`,
                  mixBlendMode: "screen",
                }} />
              )}
            </div>
          )}
        </Plane>

        {/* PLANO 7 — POLVO EN PRIMER PLANO (parallax fuerte, hold vivo) */}
        <Plane z={300} style={{ pointerEvents: "none" }}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.5 + rnd(i * 11.3) * 1.5;
            const yy = (((rnd(i * 4.4) * 132 - (g * sp) / 9) % 132) + 132) % 132;
            const s = 3 + rnd(i * 7.9) * 5;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 2.2) * 110 - 5).toFixed(2)}%`, top: `${yy - 12}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, 0.06 + rnd(i * 5.1) * 0.1),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURA 3→4: LA HOJA DEL MEDIDOR CRUZA (color de la MATERIA, nunca del fondo) ───── */}
      <SeamOcclude at={S34} dur={16} color={V.paper} angle={9} />

      {/* viñeta de cierre: el laboratorio se pone negro puro para entregar a MovDosPreguntas */}
      <AbsoluteFill style={{
        background: `radial-gradient(128% 96% at 50% 50%, rgba(0,0,0,0) 44%, ${rgba(V.ink0, lerp(0.5, 0.86, ES(g, 1600, 1856)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovCiclo: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto; // el build lo usa para saber qué acto monta; acá TODO el dibujo sale de gFrame
  const localF = useCurrentFrame();
  // Los componentes del Stage leen useCurrentFrame(). Con este Sequence, adentro
  // useCurrentFrame() === gFrame, así que las costuras, los Readout y la fase de las tiras
  // quedan CONTINUOS aunque el build monte cada acto en su propia Sequence.
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Ciclo g={g} />
    </Sequence>
  );
};
