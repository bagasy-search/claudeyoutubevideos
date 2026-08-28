// MovDesglose.tsx — S3 · 49 s (1470 frames @30) · arranca en el segundo 211.0 del video.
//
// ESPINA: la mitad del precio no es la máquina; son las piezas que la rodean, APILADAS SOBRE LA LOSA.
// IDEA RECTORA: hay UN patio, UNA losa y UNA pila. Cada acto trae una pieza (material real dentro de
// vidrio), le arranca una copia al héroe y la deja sobre la losa. La pila NUNCA se desmonta: es la
// materia que cruza las cuatro fronteras y la que se entrega al movimiento siguiente.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
// │ TABLA DE HANDOFF                                                                              │
// ├────┬──────────────────────────────┬───────────────────────────────────────────────────────────┤
// │act │ enterFrom (cámara/luz/materia)                │ exitTo (cámara/luz/materia)               │
// ├────┼───────────────────────────────────────────────┼───────────────────────────────────────────┤
// │ 1  │ CAM: mundo 0, z −110, ry 0, encuadre ancho     │ CAM: pan −1560 en curso, ry +8.5, z +70   │
// │ f0 │ LUZ: negro casi total, int .30, keyFrom .58,   │ LUZ: int .68, keyFrom .50, la key empieza │
// │    │      la ÚNICA fuente es la tira verde de la    │      a subir por arriba; sigue fría       │
// │    │      pinza que viene de MovTrescientos         │                                           │
// │    │ MAT: el display verde de la pinza → se ENSANCHA│ MAT: la máquina (desg1) + su copia en     │
// │    │      y se vuelve el medidor del presupuesto    │      vuelo hacia la ranura 0 de la pila   │
// ├────┼───────────────────────────────────────────────┼───────────────────────────────────────────┤
// │ 2  │ CAM: pan −1560 terminando, ry 8.5, z +70      │ CAM: ry 9.0, z +130 (empuja al borne)     │
// │f300│ LUZ: int .68, keyFrom .50                     │ LUZ: int .86, keyFrom .44, tinte + duro   │
// │    │ MAT: la pila con 1 pieza sobre la losa        │ MAT: el borne de la caja de transferencia │
// ├────┼───────────────────────────────────────────────┼───────────────────────────────────────────┤
// │ 3  │ CAM: ry 9.0, z +130, saliendo DENTRO del borne│ CAM: z bajando a +40, ry 5, rx +2.6       │
// │f660│ LUZ: int .86, keyFrom .44                     │ LUZ: int .95, keyFrom .40                 │
// │    │ MAT: el cobre del cable (misma materia que el │ MAT: la LOSA cruza el cuadro entera       │
// │    │      borne, ahora en macro)                   │      (V.concrete)                         │
// ├────┼───────────────────────────────────────────────┼───────────────────────────────────────────┤
// │ 4  │ CAM: z +40, ry 5, rx +2.6 (mirando hacia abajo)│ CAM: z +90, ry 2.6, rx +1.0              │
// │f960│ LUZ: int .95, keyFrom .40                      │ LUZ: int 1.02, keyFrom .36, contra ya frío│
// │    │ MAT: la losa recién colada, cenital            │ MAT: la MISMA placa gira 180° sobre su eje│
// ├────┼───────────────────────────────────────────────┼───────────────────────────────────────────┤
// │ 5  │ CAM: z +90, ry 2.6, rx +1.0                    │ CAM: retroceso a z −80, ry 0.4, rx 0.5    │
// │f1230│LUZ: int 1.02, keyFrom .36                     │ LUZ: int 1.20, keyFrom .30, HAZ DURO desde│
// │    │ MAT: el reverso de la placa ya es el caño de   │      arriba, sombra dura sobre la losa    │
// │    │      gas amarillo                              │ MAT: la PILA COMPLETA de 5 piezas en pie  │
// └────┴───────────────────────────────────────────────┴───────────────────────────────────────────┘
//
// COSTURAS (una distinta por frontera · ninguna es un fade):
//   1→2  f230-345  MATCH-MOVE   · la cámara orbita 1560 px a la derecha y ry +8.5°; la máquina sale
//                                 de cuadro por izquierda mientras su copia aterriza en la pila y la
//                                 caja de transferencia entra por derecha. Nada se corta.
//   2→3  f646      ZOOM-THROUGH · zoomThrough() entra por el borne (57%,41%) del interruptor y sale
//                                 en el macro del cobre: la misma materia a otra escala.
//   3→4  f955      OCLUSIÓN     · SeamOcclude color V.concrete (la LOSA, la materia que cruza).
//                                 Cobertura total f956-961; el contenido cambia en f959.
//   4→5  f1186-1274 MATCH-SHAPE · la placa gira 180° sobre el eje X con las dos caras en
//                                 backface-visibility: hidden. Canto exacto en f1230 (la frontera).
//
// CONTRATO: cero Math.random/Date (todo sale de rnd() y de gFrame) · cero backdrop-filter ·
// cero Easing.quint · rutas literales · imports sólo de remotion / react / ./VoltStage.
// El offset `off` reconstruye el frame local del Sequence para los helpers del Stage que usan
// useCurrentFrame() con anclas absolutas (SeamOcclude, Readout, sheenAt).

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

// ── utilidades locales ───────────────────────────────────────────────────────────────────────
const EZ = Easing.bezier(0.32, 0.68, 0.28, 1);
const ip = (g: number, ks: number[], vs: number[], ez: (n: number) => number = EZ) =>
  interpolate(g, ks, vs, { easing: ez, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** El mundo tiene DOS estaciones: el encuadre de apertura (0) y el patio del desglose (+1560 px).
 *  La cámara viaja de una a la otra en la frontera 1→2 y ya no vuelve. */
const WX = 1560;
const WPCT = (WX / 1920) * 100; // 81.25 — cuánto corre en % de pantalla

type Geo = { x: number; y: number; w: number; h: number; z: number; ry: number; rx: number };

const RANURAS: Geo[] = [
  { x: 21.0, y: 79.0, w: 300, h: 172, z: -30, ry: -12, rx: 16 },
  { x: 21.8, y: 72.6, w: 300, h: 172, z: -6, ry: -12, rx: 16 },
  { x: 22.6, y: 66.2, w: 300, h: 172, z: 18, ry: -12, rx: 16 },
  { x: 23.4, y: 59.8, w: 300, h: 172, z: 42, ry: -12, rx: 16 },
  { x: 24.2, y: 53.4, w: 300, h: 172, z: 66, ry: -12, rx: 16 },
];

const mez = (a: Geo, b: Geo, t: number): Geo => ({
  x: eio(a.x, b.x, t), y: eio(a.y, b.y, t), w: eio(a.w, b.w, t), h: eio(a.h, b.h, t),
  z: eio(a.z, b.z, t), ry: eio(a.ry, b.ry, t), rx: eio(a.rx, b.rx, t),
});

/** Titular de acto: cama oscura obligatoria, ≤7 palabras, entra y sale deslizando. */
const Titu: React.FC<{
  g: number; a: number; b: number; kick: string; l1: string; l2?: string; x: number; y: number; w?: number;
}> = ({ g, a, b, kick, l1, l2, x, y, w = 620 }) => {
  const inP = clamp01((g - a) / 13);
  const outP = clamp01((b - g) / 11);
  const op = Math.min(inP, outP);
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, opacity: op,
      transform: `translateZ(60px) translateY(${((1 - inP) * 30 - (1 - outP) * 16).toFixed(1)}px)`,
    }}>
      <Bed pad={28} w={w}>
        <Kick>{kick}</Kick>
        <div style={{ height: 12 }} />
        <Head size={62}>{l1}</Head>
        {l2 ? <Head size={62}>{l2}</Head> : null}
      </Bed>
    </div>
  );
};

/** La cifra del acto: flota AL LADO del material, nunca sola sobre fondo plano. */
const Cifra: React.FC<{
  g: number; off: number; at: number; hasta: number; value: string; unit?: string; label: string;
  x: number; y: number; size?: number; color?: string;
}> = ({ g, off, at, hasta, value, unit, label, x, y, size = 118, color = V.volt }) => {
  const op = clamp01((hasta - g) / 12);
  if (g < at - 1 || op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: op }}>
      <Readout value={value} unit={unit} label={label} at={at + off} x={x} y={y} size={size} color={color} align="left" />
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovDesglose: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const local = useCurrentFrame();
  const g = Math.max(0, Math.min(1470, gFrame));
  const off = local - gFrame;          // reconstruye el ancla absoluta de los helpers del Stage

  // ── LA CÁMARA: una sola, función de gFrame, sin reinicios ──────────────────────────────────
  const base = gcam(g, { z0: -110, z1: 55, panX: -40, panY: -14, ry: 2.4, rx: -0.8, dur: 1470 });
  const K = [0, 230, 345, 660, 960, 1230, 1470];
  const camX = ip(g, K, [0, 0, -WX, -WX - 18, -WX - 36, -WX - 54, -WX - 90]);
  const camY = ip(g, K, [0, 8, 16, 30, -14, 6, 34]);
  const camZ = ip(g, K, [-40, 20, 70, 130, 40, 90, -80]);
  const camRY = ip(g, K, [0, 1.2, 8.5, 9.0, 5.0, 2.6, 0.4]);
  const camRX = ip(g, K, [0, 0.3, -1.0, -1.8, 2.6, 1.0, 0.5]);
  const cam =
    `${base.transform} translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, ${camZ.toFixed(1)}px) ` +
    `rotateY(${camRY.toFixed(2)}deg) rotateX(${camRX.toFixed(2)}deg)`;
  const lock = (-camX).toFixed(1);     // planos de instrumento/luz: anclados a la pantalla

  // ── LA LUZ: evoluciona, no salta ───────────────────────────────────────────────────────────
  const KL = [0, 120, 300, 660, 960, 1230, 1470];
  const atInt = ip(g, KL, [0.30, 0.52, 0.68, 0.86, 0.95, 1.02, 1.20]);
  const atKey = ip(g, KL, [0.58, 0.56, 0.50, 0.44, 0.40, 0.36, 0.30]);
  const atFloor = ip(g, KL, [0.86, 0.80, 0.74, 0.70, 0.68, 0.66, 0.74]);
  const tint = light(ip(g, [0, 660, 1470], [0, 0.34, 0.56]), "volt", "blade");
  const tint2 = light(ip(g, [0, 960, 1470], [0, 0.5, 1]), "amber", "sky");
  const padLit = ip(g, [0, 300, 960, 1400, 1470], [0.35, 0.7, 1.0, 1.18, 1.3]);
  const duro = ip(g, [1300, 1400, 1470], [0, 0.7, 1]);   // el haz duro de arriba del cierre

  // ── EL MEDIDOR (la tira verde de la pinza que llega del movimiento anterior) ───────────────
  const duty = ip(
    g,
    [0, 158, 172, 396, 410, 926, 940, 1386, 1400],
    [0, 0, 0.5, 0.5, 0.691, 0.691, 0.777, 0.777, 0.872],
    Easing.bezier(0.2, 0.9, 0.3, 1),
  );
  const dutyW = ip(g, [0, 22, 130], [430, 486, 1240]);
  const dutyH = ip(g, [0, 130], [64, 46]);

  // ── LAS PIEZAS DE LA PILA ─────────────────────────────────────────────────────────────────
  // Cada una se desprende del héroe de su acto (misma geometría exacta: no hay pop) y aterriza.
  const piezas: { foto: string; label: string; nombre: string; fig: string; from: Geo; t0: number; t1: number; hi: number[] }[] = [
    { foto: "img/cmegenerador/cmeg_mv_desg1.jpg", label: "MÁQUINA · $4.700", nombre: "LA MÁQUINA", fig: "$4.700",
      from: { x: 56 - WPCT, y: 44, w: 880, h: 496, z: 70, ry: -6, rx: 0 }, t0: 262, t1: 336, hi: [150, 230] },
    { foto: "img/cmegenerador/cmeg_mv_desg2.jpg", label: "TRANSFERENCIA · $1.800", nombre: "TRANSFERENCIA", fig: "$1.800",
      from: { x: 57, y: 44, w: 860, h: 496, z: 80, ry: 5, rx: 0 }, t0: 556, t1: 620, hi: [862, 946] },
    { foto: "img/cmegenerador/cmeg_mv_desg3.jpg", label: "ELÉCTRICA · $800", nombre: "ELÉCTRICA", fig: "$800",
      from: { x: 57, y: 45, w: 880, h: 500, z: 110, ry: -4, rx: 0 }, t0: 876, t1: 934, hi: [1142, 1224] },
    { foto: "img/cmegenerador/cmeg_mv_desg4.jpg", label: "LA LOSA · 200 KG", nombre: "LA LOSA", fig: "200 KG",
      from: { x: 57, y: 44, w: 880, h: 505, z: 40, ry: 0, rx: 0 }, t0: 1140, t1: 1206, hi: [1206, 1250] },
    { foto: "img/cmegenerador/cmeg_mv_desg5.jpg", label: "EL GAS · $900", nombre: "EL GAS", fig: "$900",
      from: { x: 57, y: 44, w: 880, h: 505, z: 60, ry: 0, rx: 0 }, t0: 1330, t1: 1396, hi: [1396, 1470] },
  ];

  // ── COSTURA 2→3: la cámara entra por el borne del interruptor ─────────────────────────────
  const zt = zoomThrough(g, 646, 26, 57, 41);

  // ── COSTURA 4→5: la placa gira 180° (canto exacto en 1230) ────────────────────────────────
  const flip = ip(g, [1186, 1274], [0, 180], Easing.bezier(0.4, 0, 0.6, 1));

  // ── ventanas de montaje ───────────────────────────────────────────────────────────────────
  const verA1 = g < 400;
  const verA2 = g >= 200 && g < 674;
  const verA3 = g >= 656 && g < 959;
  const verPlaca = g >= 957 && g < 1280;
  const verA5 = g >= 1280;
  const escA3 = ip(g, [656, 724], [1.24, 1]);          // salimos DENTRO del cobre y asienta
  const legenda = clamp01((g - 1396) / 30);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca ── */}
      <VoltAtmos tint={tint} tint2={tint2} keyFrom={atKey} intensity={atInt} floor={atFloor} />

      <Layers cam={cam}>
        {/* PLANO 1 (z −620) · el patio de Ernesto al fondo, amortiguado para que el pan no lo desnude */}
        <Plane z={0} style={{ transform: `translateZ(-620px) translateX(${(-camX * 0.72).toFixed(1)}px)` }}>
          <PhotoPlane src="img/cmegenerador/cmeg_mv_desg1.jpg" kind="photo" z={0} scale={1.72}
            dim={ip(g, [0, 130, 900, 1470], [0.9, 0.66, 0.6, 0.7])} tint={V.volt} />
        </Plane>

        {/* PLANO 2 (z −500) · la cerca de madera y la línea del horizonte: parallax real del pan */}
        <Plane z={-500}>
          <div style={{
            position: "absolute", left: "-200%", right: "-200%", top: "46%", height: 210,
            background: `repeating-linear-gradient(90deg, ${rgba(V.ink2, 0.95)} 0 26px, ${rgba(V.ink1, 0.98)} 26px 34px)`,
            opacity: 0.66,
            boxShadow: `0 -2px 0 ${rgba(V.concrete, 0.16 + 0.1 * duro)}`,
          }} />
          <div style={{
            position: "absolute", left: "-200%", right: "-200%", top: "44.6%", height: 3,
            background: rgba(tint, 0.20 + 0.16 * duro),
          }} />
        </Plane>

        {/* ══ ESTACIÓN 0 · el encuadre de apertura (sale de cuadro con el MATCH-MOVE) ══ */}
        {verA1 && (
          <Plane z={0} style={{ transform: "translateZ(0px) translateX(0px)", transformStyle: "preserve-3d" }}>
            <MediaCard src="broll/cmegenerador/cmeg_mv_desg1.mp4" kind="video"
              w={880} h={496} x={56} y={44} z={70} ry={-6}
              lit={ip(g, [0, 90], [0.28, 1])} litColor={V.volt} radius={16}
              sheenAt={34 + off} opacity={ip(g, [4, 20], [0, 1])} />
            <Titu g={g} a={46} b={228} kick="PIEZA 01 · LA MÁQUINA" l1="LA MITAD ES" l2="LA MÁQUINA" x={10} y={13} />
            <Cifra g={g} off={off} at={34} hasta={236} value="9.400" unit="USD"
              label="EL PRESUPUESTO DE ERNESTO" x={10} y={44} size={92} color={V.bone} />
            <Cifra g={g} off={off} at={118} hasta={244} value="4.700" unit="USD"
              label="SÓLO LA MÁQUINA" x={10} y={64} size={124} color={V.volt} />
          </Plane>
        )}

        {/* ══ ESTACIÓN 1 · el patio del desglose: la losa, la pila y los actos 2-5 ══ */}
        <Plane z={0} style={{ transform: `translateZ(0px) translateX(${WX}px)`, transformStyle: "preserve-3d" }}>

          {/* PLANO 3 (z −240) · LA LOSA: el suelo del movimiento, montado una sola vez */}
          <PadPlane y={76} w={4600} h={340} rx={62} lit={padLit} z={-240} />

          {/* PLANO 4 (z −30…+66) · LA PILA — la materia que sobrevive a las cuatro fronteras */}
          {piezas.map((p, i) => {
            if (g < p.t0) return null;
            const t = clamp01((g - p.t0) / (p.t1 - p.t0));
            const geo = mez(p.from, RANURAS[i], t);
            const foco = g >= p.hi[0] && g <= p.hi[1] ? 1 : 0;
            const extra = acto - 1 === i ? 0.1 : 0;
            const pulso = foco ? 0.16 + 0.12 * Math.sin((g - p.hi[0]) / 6) : 0;
            return (
              <MediaCard key={i} src={p.foto} kind="photo"
                w={geo.w} h={geo.h} x={geo.x} y={geo.y} z={geo.z} ry={geo.ry} rx={geo.rx}
                radius={12} lit={clamp01(0.5 + 0.34 * t + extra + pulso)} litColor={V.volt}
                label={t > 0.72 ? p.label : undefined}
                sheenAt={p.t1 + 4 + off} />
            );
          })}

          {/* ── ACTO 2 · la caja que te salva la vida (sale por ZOOM-THROUGH) ── */}
          {verA2 && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transformStyle: "preserve-3d",
              transform: zt.out === "none" ? "none" : zt.out,
              transformOrigin: "50% 50%", opacity: zt.out === "none" ? 1 : zt.opacity,
            }}>
              <MediaCard src="broll/cmegenerador/cmeg_mv_desg2.mp4" kind="video"
                w={ip(g, [300, 640], [860, 902])} h={ip(g, [300, 640], [496, 520])}
                x={57} y={44} z={80} ry={5}
                lit={1} litColor={V.volt} radius={16} sheenAt={330 + off} />
              {/* el borne por el que va a entrar la cámara: aro de foco, estructura gráfica */}
              <div style={{
                position: "absolute", left: "57%", top: "41%", width: 132, height: 132,
                marginLeft: -66, marginTop: -66, borderRadius: "50%",
                border: `2px solid ${rgba(V.volt, ip(g, [560, 640], [0, 0.9]))}`,
                boxShadow: `0 0 34px ${rgba(V.volt, ip(g, [560, 640], [0, 0.5]))}`,
                transform: `translateZ(96px) scale(${ip(g, [560, 646], [1.5, 1]).toFixed(3)})`,
              }} />
              <IconPng src="img/cmegenerador/cmeg_ic_rayo.png" x={16.5} y={54} size={92} z={70}
                opacity={ip(g, [402, 430, 616, 636], [0, 0.92, 0.92, 0])} glow={V.ink0} />
            </div>
          )}

          {/* ── ACTO 3 · el cable y la tierra (sale por OCLUSIÓN de la losa) ── */}
          {verA3 && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transformStyle: "preserve-3d",
              transform: `scale(${escA3.toFixed(3)})`, transformOrigin: "57% 45%",
            }}>
              <MediaCard src="broll/cmegenerador/cmeg_mv_desg3.mp4" kind="video"
                w={ip(g, [660, 950], [880, 924])} h={ip(g, [660, 950], [500, 526])}
                x={57} y={45} z={110} ry={-4}
                lit={1} litColor={V.volt} radius={16} sheenAt={706 + off} />
            </div>
          )}

          {/* ── ACTO 4 → 5 · MATCH-SHAPE: la MISMA placa gira 180° y su reverso es el caño de gas ── */}
          {verPlaca && (
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transformStyle: "preserve-3d",
              transform: `rotateX(${flip.toFixed(2)}deg)`, transformOrigin: "57% 44%",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                transformStyle: "flat", backfaceVisibility: "hidden",
              }}>
                <MediaCard src="img/cmegenerador/cmeg_mv_desg4.jpg" kind="photo"
                  w={ip(g, [959, 1180], [880, 936])} h={ip(g, [959, 1180], [505, 537])}
                  x={57} y={44} z={0} rx={0}
                  lit={1} litColor={V.volt} radius={14} sheenAt={1002 + off} />
              </div>
              <div style={{
                position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                transformStyle: "flat", backfaceVisibility: "hidden",
                transform: "rotateX(180deg)", transformOrigin: "57% 44%",
              }}>
                <MediaCard src="broll/cmegenerador/cmeg_mv_desg5.mp4" kind="video"
                  w={880} h={505} x={57} y={44} z={0}
                  lit={1} litColor={V.volt} radius={14} />
              </div>
            </div>
          )}

          {/* ── ACTO 5 · el caño de gas ya suelto de la placa (misma geometría: el cambio no se ve) ── */}
          {verA5 && (
            <MediaCard src="broll/cmegenerador/cmeg_mv_desg5.mp4" kind="video"
              w={ip(g, [1280, 1330], [880, 908])} h={ip(g, [1280, 1330], [505, 521])}
              x={57} y={44} z={ip(g, [1280, 1330], [0, 60])}
              lit={1} litColor={V.volt} radius={14} sheenAt={1298 + off}
              opacity={ip(g, [1330, 1352], [1, 0])} />
          )}

          {/* ── TITULARES Y CIFRAS DE LOS ACTOS 2-5 ── */}
          <Titu g={g} a={352} b={628} kick="PIEZA 02 · TRANSFERENCIA" l1="LA CAJA QUE TE" l2="SALVA LA VIDA" x={10} y={13} />
          <Titu g={g} a={678} b={928} kick="PIEZA 03 · INSTALACIÓN" l1="EL CABLE" l2="Y LA TIERRA" x={10} y={13} />
          <Titu g={g} a={980} b={1178} kick="PIEZA 04 · LA LOSA" l1="DOSCIENTOS" l2="KILOS" x={10} y={13} />
          <Titu g={g} a={1292} b={1392} kick="PIEZA 05 · EL GAS" l1="NOVECIENTOS" l2="EN GAS" x={10} y={13} />

          <Cifra g={g} off={off} at={396} hasta={624} value="1.800" unit="USD"
            label="INTERRUPTOR AUTOMÁTICO" x={10} y={40} size={118} color={V.volt} />
          <Cifra g={g} off={off} at={700} hasta={926} value="800" unit="USD"
            label="CABLE, TIERRA Y MANO DE OBRA" x={10} y={40} size={118} color={V.volt} />
          <Cifra g={g} off={off} at={1002} hasta={1176} value="200" unit="KG"
            label="LA LOSA DE CONCRETO" x={10} y={40} size={118} color={V.bone} />
          <Cifra g={g} off={off} at={1300} hasta={1386} value="900" unit="USD"
            label="LÍNEA DE GAS Y LLAVE DE CORTE" x={10} y={40} size={118} color={V.volt} />

          {g >= 990 && g < 1180 && (
            <IconPng src="img/cmegenerador/cmeg_ic_regla.png" x={16.5} y={55} size={96} z={70}
              opacity={ip(g, [990, 1016, 1160, 1180], [0, 0.92, 0.92, 0])} glow={V.ink0} />
          )}

          {/* ── EL CIERRE: la pila completa, cada pieza con su cifra al lado ── */}
          {legenda > 0 && (
            <div style={{
              position: "absolute", left: "38%", top: 0, width: 520, opacity: legenda,
              transform: `translateZ(50px) translateY(${((1 - legenda) * 22).toFixed(1)}px)`,
            }}>
              {piezas.map((p, i) => (
                <div key={i} style={{
                  position: "absolute", left: 0, top: `${RANURAS[i].y - 3.4}%`,
                  display: "flex", alignItems: "baseline", gap: 18,
                  opacity: clamp01((g - 1396 - (4 - i) * 7) / 16),
                }}>
                  <Num size={52} color={i === 3 ? V.bone : V.volt}>{p.fig}</Num>
                  <Body size={31} color={V.bone}>{p.nombre}</Body>
                </div>
              ))}
            </div>
          )}
        </Plane>

        {/* PLANO 6 (z +150) · EL INSTRUMENTO: la tira verde de la pinza que llega de MovTrescientos
            y se ensancha hasta ser el medidor del presupuesto. Anclada a la pantalla. */}
        <Plane z={0} style={{ transform: `translateZ(150px) translateX(${lock}px)` }}>
          <DutyField duty={duty} cells={30} on={1} tint={tint} y={88} w={dutyW} h={dutyH} cycle={168} />
          <div style={{
            position: "absolute", left: "50%", top: "82.4%", width: dutyW, marginLeft: -dutyW / 2,
            opacity: ip(g, [96, 140], [0, 1]),
          }}>
            <Kick color={rgba(V.white, 0.72)}>EL PRESUPUESTO DE ERNESTO · 9.400 USD</Kick>
          </div>
        </Plane>

        {/* PLANO 7 (z +250) · LA LUZ: el haz duro de arriba que se entrega a MovDiezAnos */}
        <Plane z={0} style={{ transform: `translateZ(250px) translateX(${lock}px)`, pointerEvents: "none" }}>
          <AbsoluteFill style={{
            background: `linear-gradient(180deg, ${rgba(tint, 0.05 + 0.15 * duro)} 0%, rgba(0,0,0,0) 42%)`,
          }} />
          <div style={{
            position: "absolute", left: "10%", right: "10%", top: "62%", height: 300,
            background: `radial-gradient(60% 50% at 24% 42%, ${rgba(V.white, 0.10 * duro)} 0%, rgba(0,0,0,0) 70%)`,
          }} />
          {/* mota en primer plano: el aire del patio nunca está limpio (hold VIVO) */}
          {Array.from({ length: 9 }, (_, i) => {
            const s = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 2.1) * 130 - (g * s) / 22) % 130 + 130) % 130 - 12;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 8.3) * 104 - 2).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 4 + rnd(i * 6.1) * 5, height: 4 + rnd(i * 6.1) * 5, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 3.7) * 0.07),
              }} />
            );
          })}
          <AbsoluteFill style={{
            background: `radial-gradient(122% 96% at 50% 50%, rgba(0,0,0,0) 52%, ${rgba(V.ink0, lerp(0.5, 0.66, clamp01(g / 1470)))} 100%)`,
          }} />
        </Plane>
      </Layers>

      {/* ── COSTURA 3→4 · OCLUSIÓN con el color de la MATERIA que cruza (la losa) ── */}
      <SeamOcclude at={955 + off} dur={16} color={V.concrete} angle={7} />
    </AbsoluteFill>
  );
};
