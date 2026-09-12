// MovNumeros.tsx — S4 · UN MOVIMIENTO CONTINUO de 20,2 s (606 frames @ 30 fps)
// Canal "Claudio Mendoza Constructor" · video `cmesilencio` · arranca en el segundo 291,20.
//
// LA ESPINA: los TRES NÚMEROS del ruido — decibeles a siete metros, aire por minuto, grados dentro
// de la caja. No son rótulos: son TRES OBJETOS parados en el concreto del patio que se reparten el
// cuadro en tercios, y que en el último acto SE PELEAN ese cuadro — porque si tapas para bajar el
// primero, arruinas el segundo y disparas el tercero. Es corto y tiene que ser nítido: tres objetos,
// una idea de texto por acto, y el conflicto al final.
//
// LA CÁMARA hereda el umbral del garaje, sale al patio en media distancia, y BAJA y se ACERCA sin
// volver a cero: termina baja sobre el teléfono en el taco y entrega la pared de contrachapado en
// luz `sky` — que es exactamente donde abre MovAgujero.
//
// ⛔ CONTRATO: una sola <Sequence> (los actos se recortan por RANGO de `g` y se pisan 20-25 cuadros)
// ⛔ sin Math.random / Date.now · rutas de asset SOLO literales de la ficha · `light()` sólo con
// ⛔ claves de `V` · la atmósfera se monta UNA vez, arriba de todo, y no se remonta.
// ⚠️ Los componentes del Stage que reciben `at`/`sheenAt` razonan en frames LOCALES: se traducen
//    con L(). (Acá local == global, pero L() lo deja blindado si el montaje cambia.)

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 606;
const A2 = 165;
const A3 = 321;
const A4 = 456;

// LAS TRES COSTURAS INTERNAS (+ la de salida)
const S12 = 152;    // 1→2 metamorfosis: el anillo del SoundField se vuelve el aro del medidor
const S23 = 308;    // 2→3 la cámara sigue: el travelling pasa de largo el sonómetro
const S34 = 443;    // 3→4 wipe de materia: el canto del muro de bloques barre el cuadro
const SOUT = 582;   // 4→siguiente: occluder de contrachapado (entrega a MovAgujero)

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── UN OBJETO PARADO EN EL CONCRETO ─────────────────────────────────────────────────────────
// No es una tarjeta flotando en el vacío: tiene MATERIAL REAL adentro, su sombra de contacto en
// el piso, su ícono de identidad arriba y su número. Es una COSA del patio.
const Poste: React.FC<{
  src: string; kind: "video" | "photo";
  x: number; y: number; w: number; h: number; z?: number; ry?: number;
  on: number; lit: number; tint: string; nombre: string; icono: string; num: string; sheen: number;
}> = ({ src, kind, x, y, w, h, z = 0, ry = 0, on, lit, tint, nombre, icono, num, sheen }) => {
  if (on <= 0.01) return null;
  const medio = ((h / 1080) * 100) / 2;
  return (
    <>
      {/* la sombra de contacto: el objeto está PARADO, no flotando */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${(y + medio + 1.4).toFixed(2)}%`,
        width: w * 0.94, height: 30, marginLeft: -w * 0.47, marginTop: -15,
        borderRadius: "50%", filter: "blur(7px)",
        background: `radial-gradient(closest-side, ${rgba(V.ink0, 0.88 * clamp01(on))}, rgba(0,0,0,0))`,
      }} />
      <MediaCard src={src} kind={kind} w={w} h={h} x={x} y={y} z={z} ry={ry}
        radius={10} lit={lit} litColor={tint} opacity={on} label={nombre} sheenAt={sheen} />
      <IconPng src={icono} x={x} y={y - medio - 3.6} size={Math.max(36, w * 0.17)} z={z + 34}
        opacity={clamp01(on) * 0.95} rot={0} glow={V.ink0} />
      <div style={{
        position: "absolute", left: `${x}%`, top: `${(y - medio - 8.6).toFixed(2)}%`,
        transform: "translate(-50%,-50%)", opacity: clamp01(on),
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.max(22, w * 0.1),
        color: tint, textShadow: "0 4px 18px rgba(0,0,0,0.94)",
      }}>{num}</div>
    </>
  );
};

// ── LA TIZA DEL PISO: las marcas de cada metro que va dejando la medición. Esto SÍ es un
//    gráfico (una regla), no un objeto disfrazado.
const Tiza: React.FC<{ g: number; on: number; avance: number }> = ({ g, on, avance }) => {
  if (on <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: clamp01(on) }}>
      {Array.from({ length: 7 }, (_, i) => {
        const px = 12 + i * 12.6;
        const vivo = clamp01((avance - i / 7) * 5.5);
        if (vivo <= 0.02) return null;
        const jit = (rnd(i * 4.3) - 0.5) * 1.2;
        return (
          <div key={i} style={{ position: "absolute", left: `${(px + jit).toFixed(2)}%`, top: "80%" }}>
            <div style={{
              width: 3, height: 30 + vivo * 16, marginLeft: -1.5, borderRadius: 2,
              background: rgba(V.white, 0.16 + 0.5 * vivo),
              boxShadow: `0 0 ${Math.round(6 + 10 * vivo)}px ${rgba(V.white, 0.2 * vivo)}`,
              transform: `scaleY(${(0.5 + 0.5 * vivo).toFixed(3)})`, transformOrigin: "50% 100%",
            }} />
            <div style={{
              marginTop: 6, marginLeft: -12, width: 24, textAlign: "center",
              fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 1,
              color: rgba(V.white, 0.22 + 0.5 * vivo), textShadow: "0 3px 12px rgba(0,0,0,0.9)",
              opacity: vivo,
            }}>{i + 1}</div>
          </div>
        );
      })}
      {/* el polvo de tiza que levanta la cámara al ras del piso */}
      {Array.from({ length: 12 }, (_, i) => {
        const q = ((g / (70 + rnd(i * 6.1) * 40)) + rnd(i * 2.9)) % 1;
        return (
          <div key={`p${i}`} style={{
            position: "absolute", left: `${(4 + rnd(i * 8.7) * 92).toFixed(2)}%`,
            top: `${(88 - q * 12).toFixed(2)}%`,
            width: 5 + rnd(i * 3.3) * 7, height: 5 + rnd(i * 3.3) * 7, borderRadius: "50%",
            background: rgba(V.bone, 0.10 * Math.sin(q * Math.PI)),
            filter: "blur(3px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovNumeros: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(4, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola llamada, función de g, que NUNCA vuelve a 0 ═══════════════════════
  // media distancia sobre el concreto (hereda el umbral del garaje) → baja y se acerca hasta el
  // plano bajo sobre el teléfono en el taco, y ahí SE QUEDA (lo que hereda MovAgujero).
  const camB = gcam(g, { z0: -46, z1: 150, panX: -34, panY: 26, ry: -3.6, rx: 2.0, dur: END });
  const camZ = ip(g, [0, 80, S12, A2, 240, S23, A3, 380, S34, A4, 520, SOUT, END],
    [-34, -12, 6, 22, 58, 92, 74, 96, 78, 104, 134, 158, 172]);
  const camDrop = ip(g, [0, A2, S23, A3, S34, A4, END], [-26, -12, 2, 10, 30, 42, 62]);
  const camTilt = ip(g, [0, A2, A3, S34, A4, END], [2.2, 1.4, 0.4, -0.8, -1.4, -2.2]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — sky fría → volt (la medición) → amber (la ventana del vecino) → sky otra vez ══
  const tintA = g < A3
    ? light(ip(g, [0, 110, A2, A3], [0, 0.5, 0.88, 1]), "sky", "volt")
    : (g < 470
      ? light(ip(g, [A3, 384, S34, 470], [0, 0.48, 0.92, 1]), "volt", "amber")
      : light(ip(g, [470, 534, END], [0, 0.62, 1]), "amber", "sky"));
  const tintB = light(ip(g, [0, A3, S34, 520, END], [0, 0.26, 1, 0.66, 0.30]), "sky", "amber");
  const keyFrom = ip(g, [0, A2, A3, A4, END], [0.24, 0.34, 0.50, 0.62, 0.70]);
  const inten = ip(g, [0, 110, A3, S34, END], [0.86, 1.00, 1.04, 0.94, 0.90]);
  const floor = ip(g, [0, A3, END], [0.58, 0.54, 0.60]);

  // ══ EL EMPUJÓN — los tres son RIVALES desde el primer acto, y en el cuarto se pelean el cuadro
  const empuje1 = ip(g, [96, 126, 158, 190], [0, 1, 1, 0.22]) * Math.sin(g / 9) * 1.15;
  const empuje2 = ip(g, [470, 508, END], [0, 1, 1]) * Math.sin(g / 8) * 1.9;
  const empuje = empuje1 + empuje2;

  // ══ OBJETO 1 · EL SONÓMETRO AMARILLO — decibeles a siete metros ════════════════════════════
  const k1 = [0, 34, 108, A2, 236, S23, 386, A4, 500, 548];
  const o1x = ip(g, k1, [22, 22, 22.6, 24.5, 28.5, 31, 33, 32, 19, 3]) + empuje1 * 0.6;
  const o1y = ipe(g, [0, 96], [106, 52], Easing.out(Easing.cubic)) +
    ip(g, [A2, 236, S23, A4, 548], [0, 6, 10, 6, 12]);
  const o1w = ip(g, k1, [236, 268, 300, 336, 480, 552, 452, 336, 214, 132]);
  const o1h = ip(g, k1, [158, 180, 200, 224, 320, 368, 300, 224, 142, 88]);
  const o1on = ip(g, [0, 22, 498, 546], [0, 1, 1, 0]);
  const o1lit = ip(g, [0, 120, A2, S23, A4, 498, 540], [0.45, 0.8, 1, 1, 0.92, 0.7, 0.3]);

  // ══ OBJETO 2 · EL CODO DE LÁMINA QUE RESPIRA — el aire por minuto ══════════════════════════
  const respira = 1 + Math.sin(g / 17) * 0.035;
  const k2 = [0, 46, 120, A2, 250, S23, A3, S34, A4, 520, END];
  const o2x = ip(g, k2, [50, 50, 50, 52, 57, 60, 62, 60, 58, 52, 47]) - empuje * 0.5;
  const o2y = ipe(g, [12, 112], [108, 54], Easing.out(Easing.cubic)) +
    ip(g, [A2, S23, A3, A4, END], [0, 6, 12, 4, -2]);
  const o2w = ip(g, k2, [232, 258, 288, 306, 234, 196, 168, 176, 232, 380, 470]) * respira;
  const o2h = ip(g, k2, [156, 172, 192, 204, 156, 132, 112, 118, 156, 254, 314]) * respira;
  const o2on = ip(g, [10, 40, 560, 596], [0, 1, 1, 0.3]);
  const o2lit = ip(g, [10, 120, A2, S23, A3, A4, 540], [0.4, 0.78, 0.95, 0.62, 0.4, 0.72, 1]);

  // ══ OBJETO 3 · LA SONDA DE TERMÓMETRO — los grados dentro de la caja ═══════════════════════
  const k3 = [0, 60, 132, A2, 250, S23, A3, S34, A4, 520, END];
  const o3x = ip(g, k3, [78, 78, 78, 79, 82, 84, 86, 84, 82, 76, 71]) + empuje * 0.7;
  const o3y = ipe(g, [24, 128], [110, 53], Easing.out(Easing.cubic)) +
    ip(g, [A2, S23, A3, A4, END], [0, 5, 11, 3, -4]);
  const o3w = ip(g, k3, [228, 252, 282, 300, 226, 188, 160, 168, 224, 356, 442]);
  const o3h = ip(g, k3, [152, 168, 188, 200, 150, 126, 106, 112, 150, 238, 296]);
  const o3on = ip(g, [22, 52, 560, 596], [0, 1, 1, 0.3]);
  const o3lit = ip(g, [22, 130, A2, S23, A3, A4, 540], [0.4, 0.76, 0.95, 0.6, 0.38, 0.7, 1]);

  // ══ COSTURA 1→2 · METAMORFOSIS — el anillo más externo se cierra y ES el aro del medidor ═══
  const aroP = ip(g, [130, S12, 196], [0, 0.55, 1]);
  const aroR = ip(g, [130, S12, 196], [430, 214, 96]);
  const aroOn = ip(g, [126, 146, 200, 222], [0, 1, 1, 0]);

  // ══ ACTO 3 · LOS SIETE METROS, EL MURO Y LA VENTANA ════════════════════════════════════════
  const avance = ip(g, [A3, 420], [0, 1]);
  const tizaOn = ip(g, [A3 - 14, 340, 452, 486], [0, 1, 1, 0]);
  const muroOn = ip(g, [290, 330, 556, 590], [0, 1, 1, 0]);
  const muroX = ip(g, [290, A3, 400, S34, A4, END], [104, 84, 70, 66, 78, 96]);
  const ventOn = ip(g, [352, 400, 470, 508], [0, 1, 1, 0]);

  // ══ ACTO 4 · EL TELÉFONO QUE YA TIENES + LA PELEA DE LOS TRES ══════════════════════════════
  const telOn = ip(g, [486, 522, 592, 606], [0, 1, 1, 0.85]);
  const telY = ipe(g, [486, 546], [86, 62], Easing.out(Easing.cubic));
  const telW = ip(g, [486, 546, SOUT, END], [420, 640, 700, 740]);
  const telH = ip(g, [486, 546, SOUT, END], [270, 412, 452, 478]);
  // la TAPA de contrachapado: la causa del conflicto — y la materia que ocluye al final
  const tapaOn = ip(g, [500, 534, 576, 596], [0, 1, 1, 0]);
  const tapaX = ip(g, [500, 552, SOUT], [88, 74, 58]);
  const tapaW = ip(g, [500, 552, SOUT], [230, 320, 520]);
  const tapaH = ip(g, [500, 552, SOUT], [150, 208, 340]);
  const pleito = ip(g, [500, 540, 590, 606], [0, 1, 1, 0]);

  // ══ EL CAMPO DE SONIDO ═════════════════════════════════════════════════════════════════════
  // acto 2: nace del micrófono del sonómetro, anillos apretados como en el hook (db 78).
  const campo2On = ip(g, [176, 204, 300, 330], [0, 1, 1, 0.55]);
  // acto 3: el anillo recorre los siete metros, se DOBLA en el muro y entra por la ventana.
  const campo3On = ip(g, [300, 336, 452, 490], [0, 1, 1, 0]);
  // acto 4: el mismo campo, ahora naciendo del teléfono: el mismo trabajo, sin comprar nada.
  const campo4On = ip(g, [510, 548, 596, 606], [0, 0.92, 0.92, 0.7]);

  // ══ TEXTOS — UNA idea por acto ═════════════════════════════════════════════════════════════
  const t1 = ip(g, [40, 70, 128, 156], [0, 1, 1, 0]);
  const t2 = ip(g, [190, 218, 288, 314], [0, 1, 1, 0]);
  const t3 = ip(g, [340, 368, 426, 452], [0, 1, 1, 0]);
  const t4 = ip(g, [478, 506, 588, 604], [0, 1, 1, 0]);

  // el fondo SÓLO cambia tapado por el occluder de salida (g582)
  const fondoPatio = g < 590;
  const fondoPanel = g >= SOUT;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: UNA vez, arriba de todo, y sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      <Layers cam={camT}>
        {/* EL FONDO: la caja y el generador apagados al fondo del patio */}
        {fondoPatio && (
          <PhotoPlane src="broll/cmesilencio/cms_s4_caja_sellada_peligrosa.mp4" kind="video" z={-640}
            scale={ip(g, [0, A3, 590], [1.22, 1.16, 1.12])}
            dim={ip(g, [0, A2, A3, S34, 590], [0.52, 0.58, 0.66, 0.72, 0.70])} tint={V.sky} />
        )}
        {/* la ENTREGA: la pared de contrachapado en la que abre MovAgujero */}
        {fondoPanel && (
          <PhotoPlane src="broll/cmesilencio/cms_s4_tapa_boca_panel.mp4" kind="video" z={-560}
            scale={ip(g, [SOUT, END], [1.24, 1.16])}
            dim={ip(g, [SOUT, END], [0.58, 0.40])} tint={V.sky} />
        )}

        {/* EL CONCRETO GRIS MANCHADO DEL PATIO: el suelo en el que se paran los tres */}
        <PadPlane y={ip(g, [0, A3, A4, END], [76, 82, 88, 96])} w={1720} h={360} rx={62}
          lit={ip(g, [0, A3, A4, END], [0.95, 0.86, 0.7, 0.34])} z={-190} />

        {/* EL MURO BAJO DE BLOQUES + LA VENTANA AMARILLA DEL VECINO ───────────────────────── */}
        {muroOn > 0.01 && (
          <Plane z={-260}>
            {/* la ventana, detrás del muro: el ámbar del acto 3 */}
            {ventOn > 0.01 && (
              <div style={{
                position: "absolute", left: `${(muroX + 15).toFixed(1)}%`, top: "44%",
                width: 220, height: 156, marginLeft: -110, marginTop: -78, opacity: ventOn,
                background: `linear-gradient(172deg, ${rgba(V.amber, 0.66)} 0%, ${rgba(V.amber, 0.30)} 100%)`,
                boxShadow: `0 0 130px ${rgba(V.amber, 0.36)}, inset 0 0 30px ${rgba(V.torch, 0.42)}`,
                border: `2px solid ${rgba(V.ink0, 0.72)}`,
              }}>
                <div style={{
                  position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, marginLeft: -1.5,
                  background: rgba(V.ink0, 0.68),
                }} />
              </div>
            )}
            {/* el muro: bloques de concreto con su junta, no un rectángulo plano */}
            <div style={{
              position: "absolute", left: `${muroX}%`, top: "58%", right: "-20%", height: 300,
              marginTop: -150, opacity: muroOn,
              background: `linear-gradient(176deg, ${rgba(V.concrete, 0.46)} 0%, ${rgba(V.concrete, 0.24)} 52%, ${rgba(V.ink0, 0.88)} 100%)`,
              boxShadow: `inset 0 2px 0 ${rgba(V.white, 0.14)}, 0 -20px 60px ${rgba(V.ink0, 0.7)}`,
            }}>
              <AbsoluteFill style={{
                opacity: 0.3, mixBlendMode: "overlay",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,.55) 0 2px, rgba(0,0,0,0) 2px 74px)," +
                  "repeating-linear-gradient(90deg, rgba(0,0,0,.45) 0 2px, rgba(0,0,0,0) 2px 148px)",
              }} />
            </div>
          </Plane>
        )}

        {/* ════════ LOS TRES OBJETOS — se levantan del piso y se reparten el cuadro ═════════ */}
        <Plane z={0}>
          {/* 1 · EL SONÓMETRO: foto del medidor apoyado en el taco de madera */}
          <Poste src="img/cmesilencio/cms_s4_apoya_telefono_carga.jpg" kind="photo"
            x={o1x} y={o1y} w={o1w} h={o1h} z={ip(g, [0, A2, S23, A4, 548], [-40, 0, 70, 20, -80])}
            ry={ip(g, [0, S23, 548], [7, 1, -12])}
            on={o1on} lit={o1lit} tint={V.volt}
            nombre="DECIBELES A 7 M" icono="img/cmesilencio/cms_ic_medidor.png" num="1"
            sheen={L(96)} />

          {/* 2 · EL CODO QUE RESPIRA: clip del ventilador soplando */}
          <Poste src="broll/cmesilencio/cms_s4_rio_aire_aletas.mp4" kind="video"
            x={o2x} y={o2y} w={o2w} h={o2h} z={ip(g, [0, A2, A3, A4, END], [-60, -10, -120, -40, 40])}
            ry={ip(g, [0, A3, END], [0, -6, 4])}
            on={o2on} lit={o2lit} tint={V.sky}
            nombre="AIRE POR MINUTO" icono="img/cmesilencio/cms_ic_aire.png" num="2"
            sheen={L(120)} />

          {/* 3 · LA SONDA DE TERMÓMETRO: clip del interior de la caja con la lana */}
          <Poste src="broll/cmesilencio/cms_s4_interior_horno_lana.mp4" kind="video"
            x={o3x} y={o3y} w={o3w} h={o3h} z={ip(g, [0, A2, A3, A4, END], [-70, -20, -140, -50, 30])}
            ry={ip(g, [0, A3, END], [-8, -12, -3])}
            on={o3on} lit={o3lit} tint={V.amber}
            nombre="GRADOS EN LA CAJA" icono="img/cmesilencio/cms_ic_termometro.png" num="3"
            sheen={L(140)} />
        </Plane>

        {/* ════════ ACTO 4 · EL TELÉFONO QUE YA TIENES EN LA MANO ══════════════════════════ */}
        {telOn > 0.01 && (
          <Plane z={60}>
            <div style={{
              position: "absolute", left: "41%", top: `${(telY + ((telH / 1080) * 100) / 2 + 1.6).toFixed(2)}%`,
              width: telW * 0.9, height: 34, marginLeft: -telW * 0.45, marginTop: -17,
              borderRadius: "50%", filter: "blur(8px)",
              background: `radial-gradient(closest-side, ${rgba(V.ink0, 0.9 * telOn)}, rgba(0,0,0,0))`,
            }} />
            <MediaCard src="broll/cmesilencio/cms_s4_apoya_telefono_carga.mp4" kind="video"
              w={telW} h={telH} x={41} y={telY} z={40} ry={ip(g, [486, END], [6, -2])}
              radius={12} lit={ip(g, [486, 546, END], [0.5, 1, 1])} litColor={V.volt}
              opacity={telOn} label="EL QUE YA TIENES" sheenAt={L(552)} />
          </Plane>
        )}

        {/* LA TAPA DE CONTRACHAPADO: si tapas para bajar el uno, rompes el dos y disparas el tres.
            Es la causa del conflicto Y la materia que ocluye la salida del movimiento. */}
        {tapaOn > 0.01 && (
          <Plane z={110}>
            <MediaCard src="broll/cmesilencio/cms_s4_tapa_boca_panel.mp4" kind="video"
              w={tapaW} h={tapaH} x={tapaX} y={ip(g, [500, SOUT], [34, 44])} z={110}
              ry={ip(g, [500, SOUT], [-14, -4])} rot={ip(g, [500, SOUT], [4, 1])}
              radius={10} lit={ip(g, [500, 552], [0.55, 1])} litColor={V.paper}
              opacity={tapaOn} label={g < 566 ? "SI TAPAS" : undefined} sheenAt={L(540)} />
          </Plane>
        )}
      </Layers>

      {/* ══════ LA TIZA DEL PISO: los siete metros dejan de ser una unidad y son un TRAYECTO ═ */}
      <Tiza g={g} on={tizaOn} avance={avance} />

      {/* ══════ EL CAMPO DE SONIDO — db 78, la firma del video ════════════════════════════ */}
      {campo2On > 0.01 && (
        <SoundField db={78} x={ip(g, [176, S23, 330], [26, 31, 34])} y={ip(g, [176, 330], [52, 58])}
          on={campo2On} tint={V.volt} speed={1.1} spread={ip(g, [176, 330], [46, 74])} />
      )}
      {campo3On > 0.01 && (
        <SoundField db={78} x={ip(g, [300, A3, 452], [22, 18, 14])} y={ip(g, [300, 452], [70, 78])}
          wall={Math.min(98, muroX)} on={campo3On} tint={light(ip(g, [A3, S34], [0, 1]), "volt", "amber")}
          speed={0.85} spread={ip(g, [300, 380, 452], [90, 126, 140])} />
      )}
      {campo4On > 0.01 && (
        <SoundField db={78} x={41} y={ip(g, [510, END], [58, 54])} on={campo4On}
          tint={V.volt} speed={1.15} spread={ip(g, [510, END], [40, 62])} />
      )}

      {/* ══════ COSTURA 1→2 · METAMORFOSIS: el anillo se cierra y ES el aro del medidor ════ */}
      {aroOn > 0.01 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: `${o1x}%`, top: `${o1y}%`,
            width: aroR * 2, height: aroR * 2 * 0.82,
            marginLeft: -aroR, marginTop: -aroR * 0.82,
            borderRadius: "50%", opacity: aroOn,
            border: `${(1.4 + aroP * 6).toFixed(2)}px solid ${rgba(V.volt, 0.26 + 0.5 * aroP)}`,
            boxShadow: `0 0 ${Math.round(20 + 46 * aroP)}px ${rgba(V.volt, 0.20 + 0.16 * aroP)}, ` +
              `inset 0 0 ${Math.round(10 + 30 * aroP)}px ${rgba(V.volt, 0.10 * aroP)}`,
          }} />
        </AbsoluteFill>
      )}

      {/* ══════ COSTURA 3→4 · WIPE DE MATERIA: el canto del muro barre de derecha a izquierda ═ */}
      <SeamWipeMatter at={L(S34 - 16)} dur={32} tint={V.concrete} />
      {g >= S34 - 20 && g < S34 + 24 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-26%", height: "152%", width: "40%",
            left: `${lerp(110, -46, clamp01((g - (S34 - 20)) / 44)).toFixed(1)}%`,
            transform: "rotate(6deg)",
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.concrete, 0.34)} 16%, ${rgba(V.ink0, 0.70)} 50%, ${rgba(V.concrete, 0.26)} 86%, rgba(0,0,0,0) 100%)`,
            filter: "blur(2px)",
          }} />
        </AbsoluteFill>
      )}

      {/* ══════ COSTURA DE SALIDA · OCCLUDER DE CONTRACHAPADO (luminancia media ~76/255) ═══ */}
      <SeamOcclude at={L(SOUT - 10)} dur={24} color={V.paper} angle={6} lit={0.30} />

      {/* ══════ HUD — una idea de texto por acto ══════════════════════════════════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LA CIFRA DEL NÚMERO UNO: 78 dB a siete metros */}
        {g >= 206 && g < 330 && (
          <div style={{ opacity: ip(g, [206, 228, 300, 328], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "70%", top: "26%", width: 470, height: 300,
              marginLeft: -235, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value="78" unit="dB" label="A SIETE METROS"
              at={L(212)} x={70} y={26} size={106} color={V.volt} align="center" />
          </div>
        )}

        {/* ACTO 1 */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "12%", opacity: t1, transform: `translateY(${((1 - t1) * -20).toFixed(1)}px)` }}>
            <Bed w={620} pad={22}>
              <Kick color={V.volt}>Como siempre en este canal</Kick>
              <div style={{ height: 6 }} />
              <Head size={68}>TRES <Em>NÚMEROS</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={30}>Ruido, aire y calor</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "74%", opacity: t2, transform: `translateY(${((1 - t2) * 20).toFixed(1)}px)` }}>
            <Bed w={680} pad={22}>
              <Kick color={V.volt}>Número uno</Kick>
              <div style={{ height: 6 }} />
              <Head size={62}>DECIBELES A <Em>SIETE METROS</Em></Head>
            </Bed>
          </div>
        )}

        {/* ACTO 3 */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "13%", opacity: t3, transform: `translateY(${((1 - t3) * -20).toFixed(1)}px)` }}>
            <Bed w={720} pad={22}>
              <Head size={58}>LO QUE HAY ENTRE TU PATIO Y <Em color={V.amber}>SU VENTANA</Em></Head>
            </Bed>
          </div>
        )}

        {/* ACTO 4 */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "16%", opacity: t4, transform: `translateY(${((1 - t4) * -20).toFixed(1)}px)` }}>
            <Bed w={660} pad={22}>
              <Kick color={V.volt}>Número uno, resuelto</Kick>
              <div style={{ height: 6 }} />
              <Head size={64}>NO NECESITAS <Em>COMPRAR NADA</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={30}>El teléfono que ya tienes en la mano</Body>
            </Bed>
          </div>
        )}

        {/* EL PLEITO: tapas para bajar el uno → rompes el dos → disparas el tres.
            Es un DIAGRAMA (una cadena de causa), no un objeto disfrazado. */}
        {pleito > 0.01 && (
          <div style={{
            position: "absolute", left: "50%", top: "88%", transform: "translate(-50%,-50%)",
            opacity: pleito, display: "flex", alignItems: "center", gap: 16,
          }}>
            {[
              { ic: "img/cmesilencio/cms_ic_medidor.png", t: "MENOS RUIDO", f: "▼", c: V.volt },
              { ic: "img/cmesilencio/cms_ic_aire.png", t: "MENOS AIRE", f: "▼", c: V.sky },
              { ic: "img/cmesilencio/cms_ic_termometro.png", t: "MÁS CALOR", f: "▲", c: V.amber },
            ].map((it, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30,
                    color: rgba(V.white, 0.42 * clamp01((pleito - 0.2) / 0.8)),
                  }}>&rsaquo;</div>
                )}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 18px 10px 12px",
                  borderRadius: 12, border: `1px solid ${rgba(it.c, 0.3)}`,
                  background: "linear-gradient(180deg, rgba(8,9,6,0.92) 0%, rgba(8,9,6,0.74) 100%)",
                  boxShadow: `0 14px 40px rgba(0,0,0,0.6)`,
                }}>
                  {/* caja RELATIVA: si no, el ícono absoluto se va al origen del HUD */}
                  <div style={{ position: "relative", width: 44, height: 46, flex: "0 0 44px" }}>
                    <IconPng src={it.ic} x={50} y={8} size={40} z={0} opacity={0.95} rot={0} glow={V.ink0} />
                  </div>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 25, color: it.c,
                  }}>{it.f}</div>
                  <div style={{
                    fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 1.6,
                    color: rgba(V.white, 0.86),
                  }}>{it.t}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* el contador de los tres números, discreto arriba a la derecha */}
        {g >= 44 && g < 592 && (
          <div style={{
            position: "absolute", left: "92%", top: "8%", transform: "translate(-50%,-50%)",
            opacity: ip(g, [44, 82, 552, 590], [0, 1, 1, 0]), textAlign: "center",
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2,
              color: rgba(V.white, 0.78), textTransform: "uppercase",
              textShadow: "0 4px 18px rgba(0,0,0,0.92)",
            }}>Números</div>
            <div style={{ display: "flex", gap: 7, marginTop: 8, justifyContent: "center" }}>
              {[ip(g, [176, 220], [0.14, 1]), ip(g, [512, 552], [0.14, 0.6]), ip(g, [512, 552], [0.14, 0.6])].map((p, i) => (
                <div key={i} style={{
                  width: 44, height: 7, borderRadius: 4,
                  background: rgba(i === 0 ? V.volt : (i === 1 ? V.sky : V.amber), 0.14 + 0.78 * p),
                  boxShadow: p > 0.5 ? `0 0 13px ${rgba(V.volt, 0.42 * p)}` : "none",
                }} />
              ))}
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: el cuadro se cierra a medida que la cámara baja al taco */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 50%, rgba(0,0,0,0) 52%, rgba(6,7,5,${(0.26 + 0.2 * ip(g, [A4, END], [0, 1])).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};

/*
// ╔══════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ MovNumeros — TABLA DE ENTRADA Y SALIDA DE LOS ACTOS (606 frames · 20,2 s)                    ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
// ACTO | RANGO g       | ENTRA (encuadre + luz)                          | SALE (encuadre + luz)                          | COSTURA hacia el siguiente
// -----+---------------+-------------------------------------------------+------------------------------------------------+-------------------------------------------
// 1    | 0 → 186       | hereda el umbral del garaje: media distancia,    | la misma media distancia, los tres objetos      | METAMORFOSIS (g152, aro 430 → 96 px):
//      | (pisa 21 al 2)| tres cuartos sobre el concreto gris manchado;    | parados en sus tercios (22 / 50 / 78).          | el anillo más externo del SoundField que sale
//      |               | la caja y el generador apagados al fondo.        | LUZ: `sky` → `volt` mientras el de la izquierda | del sonómetro se cierra sobre sí mismo y se
//      |               | LUZ: `sky` fría de atardecer (keyFrom 0.24).    | se enciende (tintA volt en g165).               | vuelve el ARO de la carcasa del medidor.
//      |               | MAT: los tres se LEVANTAN del piso (y 106→52)   | MAT: ya se empujan entre ellos: son rivales.    |
//      |               | con su sombra de contacto y su material real.   |                                                 |
// -----+---------------+-------------------------------------------------+------------------------------------------------+-------------------------------------------
// 2    | 146 → 342     | sin corte: el aro termina de formarse a partir  | primer plano BAJO sobre el sonómetro con el     | LA CÁMARA SIGUE (g308, sin cobertura):
//      | (pisa 21 y 21)| del anillo. LUZ: `volt`.                        | campo apretado; el fondo del patio ya insinúa   | el travelling que empujaba hacia el medidor no
//      |               | MAT: el SONÓMETRO se adelanta a primer plano    | el muro (muroX 84 → 70).                        | se detiene: lo pasa de largo y sale del otro
//      |               | izquierdo (w 336 → 552) y el SoundField db 78   | LUZ: `volt` plena.                              | lado, ya recorriendo los siete metros.
//      |               | nace de su micrófono. Los otros dos, atrás.     |                                                 |
// -----+---------------+-------------------------------------------------+------------------------------------------------+-------------------------------------------
// 3    | 300 → 478     | la cámara pasó de largo y va A RAS del concreto | encuadre BAJO con el muro cruzando el cuadro y  | WIPE DE MATERIA (g427, dur 32, `V.concrete`):
//      | (pisa 21 y 22)| LUZ: `volt`.                                    | la ventana amarilla a la derecha.               | el canto del muro de bloques barre el cuadro
//      |               | MAT: un anillo se adelanta a la cámara, quedan  | LUZ: `amber` heredado de esa ventana (tintA     | de derecha a izquierda al bajar la cámara.
//      |               | marcas de tiza a cada metro, el anillo llega al | amber en g443).                                 |
//      |               | muro, SE DOBLA (`wall={muroX}`) y entra por la  |                                                 |
//      |               | ventana. Los otros dos, chicos y apagados.      |                                                 |
// -----+---------------+-------------------------------------------------+------------------------------------------------+-------------------------------------------
// 4    | 436 → 606     | el canto termina de barrer y descubre el suelo; | plano BAJO y CERCANO sobre el teléfono en el    | OCCLUDER DE MATERIA (g572, dur 24, `V.paper`,
//      | (pisa 22 al 3)| la cámara ya más baja y más cerca que en el     | taco, con el CODO y la SONDA creciendo          | lit 0.30): un panel de contrachapado pasa por
//      |               | acto 1. LUZ: `amber` bajando hacia `sky`.       | desenfocados detrás y empujándose.              | delante del lente y en la cobertura total va a
//      |               | MAT: el sonómetro se apaga, se encoge y se va;  | LUZ: `sky` fría con un resto de ámbar en el     | luminancia media (~76/255). Detrás ya está la
//      |               | queda el TELÉFONO en el taco con el mismo campo | borde (tintA sky en g606).                      | PARED DE CONTRACHAPADO en luz `sky` —
//      |               | naciendo de su micrófono; entra la TAPA de      | LA CÁMARA QUEDA BAJA Y NO SE REMONTA.           | el encuadre exacto con el que abre MovAgujero.
//      |               | contrachapado ("SI TAPAS") y se arma el pleito. |                                                 |
//
// HERENCIA: entra heredando el patio y la luz `sky` del final de S3; entrega plano medio-bajo sobre
// la pared de contrachapado en luz `sky` — el encuadre y el color con los que abre MovAgujero.
*/
