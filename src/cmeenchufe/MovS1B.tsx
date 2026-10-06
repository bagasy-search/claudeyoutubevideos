// MovS1B.tsx — MOVIMIENTO S1B · "LA MISMA ENERGÍA, LA HORA EQUIVOCADA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 2 actos · 64.480 → 76.125 ms · 349 frames @30.
//
// LA IDEA: dos bloques de energía IDÉNTICOS. El mismo refrigerador, el mismo alto, el mismo ancho,
// el mismo número en la regla. Lo único que los separa es la HORA. Y a las 19:00 uno de los dos
// vale tres veces más sin que nada de él haya cambiado.
//
// LA MATERIA QUE CRUZA LA FRONTERA: **LA SOMBRA DE LA AGUJA**.
//   acto 1 → el reloj de la cocina queda colgado arriba del cuadro, sin usar todavía;
//   acto 2 → su aguja barre hasta las 19:00 y SU SOMBRA cruza los dos bloques de izquierda a
//            derecha. Ese barrido ES la costura: no hay corte, hay una sombra que pasa por delante.
//            Detrás de la sombra el bloque derecho ya salió frío y con la cinta de precio corriendo.
//
// LOS DOS BLOQUES NO SE VUELVEN A MONTAR. Son los mismos objetos, en la misma x, con el MISMO clip
// real adentro y el MISMO `startFrom`: cuadro por cuadro, el refrigerador de la izquierda y el de la
// derecha son literalmente el mismo. Es la única forma de que "no cambió nada" se LEA.
//
// UNA cámara: `camAt(gFrame)` — sale del reloj de la cocina del clip anterior (push 2.9 → 1) y sigue
// derivando a la derecha mientras la grúa BAJA a la base de los bloques, que es donde corren las
// cintas de precio. Función pura de `gFrame`: el acto 2 hereda exactamente dónde la dejó el acto 1.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: la key arranca centrada y REPTA hacia la derecha (0.46 → 0.80): la compañía se le viene
// encima al bloque derecho desde arriba y en frío, mientras el izquierdo se queda con el ámbar de
// abajo. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-180 · "LA MISMA ENERGÍA"                     material: CLIP freezer_goma ×2 (mismo startFrom)
//   entra  cam {saliendo del reloj de la cocina, push 2.9}  luz {key 0.46, neutra, int 0.95}
//   sale   cam {plano general de los dos bloques, grúa +34} luz {key 0.58, empieza el frío arriba}
//   ── FRONTERA ···· BARRIDO DE MATERIA: la sombra de la aguja cruza y tapa. ·················
// ACTO 2 · g181-349 · "TRES VECES MÁS"                     material: los MISMOS 2 clips, sin remontar
//   entra  cam {grúa bajando, ya a la altura de las cintas} luz {key 0.62, frío sobre el derecho}
//   sale   cam {grúa −74, a ras del piso, deriva a la der.} luz {key 0.80, frío pleno arriba-derecha}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 181;
const G_END = 349;
const START: Record<number, number> = { 1: A1, 2: A2 };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  freezerV: "broll/cmeenchufe/cmee_s1_freezer_goma.mp4",
  refriF: "img/cmeenchufe/cmee_s7_refri_noche.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
};

// ── LOS DOS BLOQUES (idénticos por construcción: una sola tabla de medidas) ──────────────────
const BASE = 830;          // la base común, en px de la comp 1920×1080
const BLK_W = 452, BLK_H = 424;
const LX = 29, RX = 71;    // % — izquierda y derecha
const CARD_W = 372, CARD_H = 224;
const START_FROM = 20;     // ⭐ EL MISMO frame de entrada del clip en los dos: cuadro por cuadro iguales

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -180, z1: 430, panX: 150, panY: -16, ry: 5.4, rx: -1.8, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): sube a ver los dos bloques y BAJA a la altura de las cintas.
  const crane = interpolate(g, [0, A1 + 90, A2, A2 + 90, G_END], [8, 34, 16, -52, -74], {
    ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1),
  });
  // salimos del reloj de la cocina del clip anterior: el push se abre y no vuelve a cerrarse
  const push = interpolate(g, [A1, A1 + 40], [2.9, 1], { ...CL, easing: Easing.bezier(0.42, 0, 0.3, 1) });
  const tx = (50 - 50) * (push - 1);
  const ty = (50 - 26) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── EL BLOQUE DE ENERGÍA (hormigón con el canto lamido por su luz) ───────────────────────────
const Block: React.FC<{ x: number; h: number; tint: string; z: number; rise: number }> = ({ x, h, tint, z, rise }) => {
  const hh = h * eio(0.04, 1, rise);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: BASE - hh, width: BLK_W, height: hh, marginLeft: -BLK_W / 2,
      transform: `translateZ(${z}px)`,
      background: `linear-gradient(180deg, ${rgba(tint, 0.26)} 0%, ${rgba(V.ink2, 0.97)} 20%, ${rgba(V.ink1, 1)} 100%)`,
      borderTop: `3px solid ${rgba(tint, 0.9)}`,
      boxShadow: `0 30px 70px ${rgba(V.ink0, 0.85)}, inset 0 0 70px ${rgba(V.ink0, 0.66)}, inset -18px 0 34px ${rgba(V.ink0, 0.7)}`,
    }}>
      <div style={{
        position: "absolute", right: -18, top: 6, width: 18, height: Math.max(0, hh - 6),
        background: `linear-gradient(180deg, ${rgba(tint, 0.16)}, ${rgba(V.ink0, 0.98)})`,
        transform: "skewY(-9deg)", transformOrigin: "left top",
      }} />
    </div>
  );
};

// ── el corchete de medida: esto SÍ mide algo, así que va en vector ───────────────────────────
const Bracket: React.FC<{ x: number; y: number; w: number; label: string; color: string; p: number }> = ({
  x, y, w, label, color, p,
}) => (
  <div style={{ position: "absolute", left: `${x}%`, top: y, width: w, marginLeft: -w / 2, opacity: p }}>
    <div style={{ position: "relative", height: 2, background: rgba(color, 0.92), transform: `scaleX(${p.toFixed(3)})` }}>
      <div style={{ position: "absolute", left: 0, top: -11, width: 2, height: 24, background: rgba(color, 0.92) }} />
      <div style={{ position: "absolute", right: 0, top: -11, width: 2, height: 24, background: rgba(color, 0.92) }} />
    </div>
    <div style={{
      marginTop: 10, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32,
      letterSpacing: 2.6, color, textShadow: "0 4px 18px rgba(0,0,0,0.92)",
    }}>{label}</div>
  </div>
);

export const MovS1B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: la key REPTA a la derecha, el frío baja sobre ese lado.
  const keyFrom = interpolate(gFrame, [0, A1 + 90, A2, A2 + 100, G_END], [0.46, 0.58, 0.62, 0.76, 0.80], CL);
  const cool = interpolate(gFrame, [A1 + 60, A2 + 80], [0, 0.5], CL);
  const inten = interpolate(gFrame, [0, A1 + 70, A2, G_END], [0.95, 1.06, 1.02, 1.14], CL);
  const floorDim = interpolate(gFrame, [0, A2, G_END], [0.58, 0.62, 0.68], CL);
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · dos bloques idénticos, la misma medida en los dos ═════════════════ */}
        {acto === 1 && (() => {
          const rise = clamp01((f - 4) / 34);             // los DOS con la misma p: nada los distingue
          const rule = clamp01((f - 40) / 24);
          const br = clamp01((f - 62) / 18);
          const kick = clamp01((f - 86) / 14);
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.refriF} kind="photo" z={0} scale={1.3} dim={0.72} tint={V.volt} /></Plane>

              <Plane z={0}>
                <Block x={LX} h={BLK_H} tint={V.volt} z={0} rise={rise} />
                <Block x={RX} h={BLK_H} tint={V.volt} z={0} rise={rise} />
              </Plane>

              {/* ⭐ EL MISMO CLIP REAL, EL MISMO startFrom, EL MISMO TAMAÑO: idénticos al cuadro */}
              <Plane z={120}>
                <MediaCard src={M.freezerV} kind="video" w={CARD_W} h={CARD_H}
                  x={LX} y={pc(BASE - BLK_H + 148)} z={0} ry={-4} startFrom={START_FROM}
                  lit={0.55 + 0.45 * rise} litColor={V.volt} label="EL MISMO REFRIGERADOR"
                  sheenAt={toCF(30)} radius={8} opacity={rise} />
                <MediaCard src={M.freezerV} kind="video" w={CARD_W} h={CARD_H}
                  x={RX} y={pc(BASE - BLK_H + 148)} z={0} ry={-4} startFrom={START_FROM}
                  lit={0.55 + 0.45 * rise} litColor={V.volt} label="EL MISMO REFRIGERADOR"
                  sheenAt={toCF(30)} radius={8} opacity={rise} />
              </Plane>

              {/* la regla voltio cae del techo y mide los dos: marca EL MISMO número */}
              <Plane z={230}>
                <IconPng src={M.icRegla} x={50} y={eio(-14, 30, rule)} size={210} z={0}
                  opacity={0.94 * rule} rot={eio(-26, -3, rule)} glow={V.volt} />
                <Bracket x={LX} y={BASE - BLK_H - 112} w={BLK_W} label="1 kWh" color={V.volt} p={br} />
                <Bracket x={RX} y={BASE - BLK_H - 112} w={BLK_W} label="1 kWh" color={V.volt} p={br} />
                <Readout value="1" unit="kWh" at={toCF(70)} x={LX} y={pc(BASE - BLK_H - 208)} size={96} color={V.volt} />
                <Readout value="1" unit="kWh" at={toCF(70)} x={RX} y={pc(BASE - BLK_H - 208)} size={96} color={V.volt} />
              </Plane>

              <Plane z={300}>
                <div style={{
                  position: "absolute", left: "50%", top: "89%", transform: "translate(-50%,-50%)", opacity: kick,
                }}>
                  <Kick color={V.bone}>LA MISMA ENERGÍA · LA MISMA CANTIDAD</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la aguja barre hasta las 19:00 y uno de los dos vale el triple ════ */}
        {acto === 2 && (() => {
          const hand = clamp01(f / 46);                            // la aguja: 13:00 → 19:00
          const handE = interpolate(hand, [0, 1], [0, 1], { easing: Easing.bezier(0.36, 0, 0.2, 1) });
          const ang = lerp(30, 210, handE);                        // grados de la aguja
          const cold = clamp01((f - 26) / 34);                     // el frío baja sobre el derecho
          const belt = clamp01((f - 44) / 52);                     // la cinta derecha se estira
          const beltE = interpolate(belt, [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0, 0.24, 1) });
          const head = clamp01((f - 100) / 16);
          const mult = 1 + 2 * beltE;
          const BELT_Y = BASE + 34, BELT_H = 34, BELT_W0 = 220;
          const rbw = BELT_W0 * mult;
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.refriF} kind="photo" z={0} scale={1.34} dim={0.74} tint={V.sky} /></Plane>

              {/* LOS MISMOS DOS BLOQUES, sin remontar: siguen exactamente donde quedaron */}
              <Plane z={0}>
                <Block x={LX} h={BLK_H} tint={light(cold, "volt", "amber")} z={0} rise={1} />
                <Block x={RX} h={BLK_H} tint={light(cold, "volt", "sky")} z={0} rise={1} />
                {/* el frío de la compañía baja SOBRE el bloque derecho (desde arriba, siempre) */}
                <div style={{
                  position: "absolute", left: `${RX}%`, top: BASE - BLK_H - 260, width: BLK_W + 120, height: 320,
                  marginLeft: -(BLK_W + 120) / 2,
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.34 * cold)} 0%, rgba(0,0,0,0) 100%)`,
                }} />
                {/* el ámbar del izquierdo sigue viniendo DE ABAJO (lo que te queda) */}
                <div style={{
                  position: "absolute", left: `${LX}%`, top: BASE - 190, width: BLK_W + 120, height: 260,
                  marginLeft: -(BLK_W + 120) / 2,
                  background: `linear-gradient(0deg, ${rgba(V.amber, 0.26)} 0%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>

              {/* ⭐ LOS MISMOS DOS CLIPS, EL MISMO startFrom: el material no cambió, cambió la hora */}
              <Plane z={120}>
                <MediaCard src={M.freezerV} kind="video" w={CARD_W} h={CARD_H}
                  x={LX} y={pc(BASE - BLK_H + 148)} z={0} ry={-4} startFrom={START_FROM}
                  lit={1} litColor={V.amber} label="03:00" sheenAt={toCF(58)} radius={8} />
                <MediaCard src={M.freezerV} kind="video" w={CARD_W} h={CARD_H}
                  x={RX} y={pc(BASE - BLK_H + 148)} z={0} ry={-4} startFrom={START_FROM}
                  lit={1} litColor={V.sky} label="19:00" sheenAt={toCF(58)} radius={8} />
              </Plane>

              {/* LAS CINTAS DE PRECIO: la izquierda no se mueve, la derecha se estira al triple */}
              <Plane z={180}>
                <div style={{
                  position: "absolute", left: `${LX}%`, top: BELT_Y, width: BELT_W0, height: BELT_H, marginLeft: -BELT_W0 / 2,
                  background: `linear-gradient(90deg, ${rgba(V.amber, 0.9)}, ${rgba(V.amber, 0.55)})`,
                  boxShadow: `0 10px 30px ${rgba(V.ink0, 0.8)}`, borderRadius: 3,
                }} />
                <div style={{
                  position: "absolute", left: `${RX}%`, top: BELT_Y, width: rbw, height: BELT_H, marginLeft: -BELT_W0 / 2,
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0.92)}, ${rgba(V.sky, 0.4)})`,
                  boxShadow: `0 10px 30px ${rgba(V.ink0, 0.8)}, 0 0 40px ${rgba(V.sky, 0.3 * beltE)}`, borderRadius: 3,
                }} />
                <div style={{
                  position: "absolute", left: `${LX}%`, top: BELT_Y + BELT_H + 16, transform: "translateX(-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, color: V.amber,
                  textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                }}>×1</div>
                <div style={{
                  position: "absolute", left: `${RX}%`, top: BELT_Y + BELT_H + 16,
                  marginLeft: rbw / 2 - BELT_W0 / 2, transform: "translateX(-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, color: V.sky,
                  textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                }}>{`×${mult.toFixed(1).replace(".", ",")}`}</div>
              </Plane>

              {/* EL RELOJ colgado arriba del cuadro y SU SOMBRA barriendo los dos bloques */}
              <Plane z={340}>
                <IconPng src={M.icReloj} x={50} y={7} size={186} z={0} opacity={0.92} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "50%", top: `${pc(0.07 * 1080 + 92).toFixed(2)}%`,
                  width: 4, height: 74, marginLeft: -2, transformOrigin: "50% 100%",
                  transform: `rotate(${ang.toFixed(1)}deg)`,
                  background: rgba(V.volt, 0.96), boxShadow: `0 0 22px ${rgba(V.volt, 0.85)}`,
                }} />
                {/* LA SOMBRA de la aguja: la materia que cruza y hace la costura */}
                <div style={{
                  position: "absolute", left: "50%", top: 168, width: 108, height: 1120, marginLeft: -54,
                  transformOrigin: "50% 0%", transform: `rotate(${(ang - 180).toFixed(1)}deg)`,
                  background: `linear-gradient(180deg, ${rgba(V.ink0, 0.82)} 0%, ${rgba(V.ink0, 0.32)} 62%, rgba(0,0,0,0) 100%)`,
                  filter: "blur(9px)",
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: "17%", transform: "translate(-50%,-50%)",
                  fontFamily: F_BODY, fontWeight: 700, fontSize: 46, letterSpacing: 4, color: V.sky,
                  textShadow: "0 4px 20px rgba(0,0,0,0.94)", opacity: clamp01((f - 40) / 12),
                }}>19:00</div>
              </Plane>

              <Plane z={400}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "93%", textAlign: "center",
                  opacity: head, transform: `translateY(${lerp(18, 0, head).toFixed(1)}px)`,
                }}>
                  <Head size={64} color={V.white}>LO MISMO. A OTRA HORA. TRES VECES MÁS.</Head>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
