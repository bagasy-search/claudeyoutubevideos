// MovS4B.tsx — MOVIMIENTO S4B · "EL ESCALÓN"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 6 actos · 524.680 → 575.540 ms · 1526 frames @30.
// Hermano directo de MovS4A: mismo escenario, misma cámara-función, mismo contrato de props.
//
// LA IDEA (la más contraintuitiva del video): pasarte de 100 kWh en punta no te encarece los
// kilovatios que te pasaste — te encarece TODOS, los 100 primeros también. El kilovatio que cruza
// la raya no cuesta 34 centavos: cuesta 7 dólares con 34.
//
// LA MATERIA QUE CRUZA LAS CINCO FRONTERAS: **EL ESCALÓN**.
//   acto 1 → es el canto de la hoja real, engordado hasta ser un peldaño de hormigón;
//   acto 2 → la cámara termina de rodearlo y el peldaño tiene DOS alturas: 27 abajo, 34 arriba;
//   acto 3 → la cámara sigue bajando y detrás del peldaño aparecen los cien bloques ya pagados;
//   acto 4 → la cámara entra en la fila y se pega al bloque que cruzó: el 101 se levanta solo;
//   acto 5 → el bloque sale del cuadro y queda su precio, con el precio normal debajo;
//   acto 6 → la deriva se vuelve desfile: doce escalones iguales, uno por mes.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` que HEREDA el z de S4A (z0 = +540, donde S4A congeló
// el reloj) y sigue saliendo, más una grúa continua que BAJA (de +286, la altura en que S4A se
// detuvo, hasta −196 a ras de la fila) y una ÓRBITA a la derecha que rodea el peldaño y no se
// detiene. Como es función pura de `gFrame`, la cámara sigue viajando durante los clips reales que
// van entre acto y acto. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: arranca en el negro enterrado de S4A y se ENFRÍA hacia SKY desde arriba (la compañía)
// mientras el ámbar de abajo sube al contagiar la fila (lo que te cobran de más). Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-102 · "2 · EL ESCALÓN"                    material: FOTO alisa_factura (la hoja de canto)
//   entra  cam {la que S4A congeló: z +540, grúa +286, mirando el negro}  luz {VOLT enterrado, int 0.42}
//   sale   cam {órbita +16°, grúa +104, contrapicado rx −9}               luz {VOLT, key 0.28}
//   ── FRONTERA A ···· LA CÁMARA SIGUE RODEANDO el peldaño por la derecha. ··················
// ACTO 2 · g331-475 · "27 → 34"                         material: FOTO dedo_letra_chica (en el canto)
//   entra  cam {órbita +24°, grúa +36, de frente al escalón}              luz {VOLT→SKY 22%, key 0.34}
//   sale   cam {grúa −6, ya bajando}                                      luz {SKY 40%, key 0.38}
//   ── FRONTERA B ···· GRÚA-REVELACIÓN: la cámara baja y descubre lo que había detrás. ······
// ACTO 3 · g589-739 · sin texto (pedido del director)   material: CLIP medidor_digitos (plano) + la tarjeta del canto
//   entra  cam {grúa −92, a la altura de la fila}                         luz {SKY 55%, key 0.42}
//   sale   cam {grúa −168, push 1.3 entrando en la fila}                  luz {SKY 66%, key 0.46}
//   ── FRONTERA C ···· LA CÁMARA ENTRA en la fila ámbar y se pega al bloque 101. ············
// ACTO 4 · g763-919 · "EL KILOVATIO 101"                material: CLIP medidor_digitos (dentro del bloque)
//   entra  cam {push 1.9, pegada al bloque}                               luz {SKY 74%, key 0.50}
//   sale   cam {push 2.15, el bloque sube y sale por arriba}              luz {SKY 80%, key 0.54}
//   ── FRONTERA D ···· EL BLOQUE SALE POR ARRIBA y deja su precio colgado. ··················
// ACTO 5 · g1048-1180 · "$7,34 / 34¢"                   material: CLIP pinza_lavadora ×2 (mismo startFrom)
//   entra  cam {push 1.3, grúa −96}                                       luz {SKY 88%, key 0.56}
//   sale   cam {deriva a la derecha, grúa −18}                            luz {SKY 94%, key 0.58}
//   ── FRONTERA E ···· LA DERIVA SE VUELVE DESFILE: un escalón se multiplica por doce. ······
// ACTO 6 · g1436-1526 · "AÑO TRAS AÑO"                  material: FOTO carpeta_facturas (en el primer escalón)
//   entra  cam {grúa +58, alejándose}                                     luz {SKY pleno, key 0.60}
//   sale   cam {grúa +108, la fila se pierde en el negro}                 → entrega a S4C
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 331, A3 = 589, A4 = 763, A5 = 1048, A6 = 1436;
const G_END = 1526;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6 };

const FLOOR = 900;                              // el piso del cuadro, en px de la comp 1920×1080
const pc = (v: number) => (v / 1080) * 100;     // px verticales → % de pantalla
const px = (v: number) => (v / 1920) * 100;     // px horizontales → % de pantalla

// LA ESCALA ES HONESTA: 300 px = 27 ¢ · 378 px = 34 ¢ (300 × 34 / 27 = 378).
const H_LOW = 300, H_HIGH = 378;
const TOP_LOW = FLOOR - H_LOW, TOP_HIGH = FLOOR - H_HIGH;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  hojaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  letraF: "img/cmeenchufe/cmee_s4_dedo_letra_chica.png",
  medidorV: "broll/cmeenchufe/cmee_s4_medidor_digitos.mp4",
  carpetaF: "img/cmeenchufe/cmee_s4_carpeta_facturas.png",
  vueltaF: "img/cmeenchufe/cmee_s4_da_vuelta_hoja.png",
  pinzaV: "broll/cmeenchufe/cmee_s4_pinza_lavadora.mp4",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
};

// ── LA CÁMARA · una sola función de gFrame, que hereda la de S4A y nunca vuelve a cero ───────
const camAt = (g: number) => {
  // z arranca EXACTAMENTE donde S4A lo dejó (+540) y sigue saliendo: el mismo viaje, no otro.
  const base = gcam(g, { z0: 540, z1: -60, panX: 150, panY: -46, ry: 0, rx: 0, dur: G_END });
  // LA GRÚA: baja desde +286 (la altura en la que S4A se detuvo) hasta la fila, y vuelve a subir.
  const crane = interpolate(
    g,
    [0, 46, 102, A2, A2 + 144, A3, A3 + 150, A4 + 40, A4 + 156, A5, A5 + 132, A6, G_END],
    [286, 214, 104, 36, -6, -92, -168, -196, -150, -96, -18, 58, 108],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // LA ÓRBITA: rodea el peldaño por la derecha durante los actos 1-2 y afloja, sin detenerse nunca.
  const orbit = interpolate(g, [0, 102, A2, A3, A4, A5, A6, G_END], [-7, 16, 24, 14, 7, 1, -5, -9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.35, 0, 0.3, 1),
  });
  // EL CONTRAPICADO del acto 1 (vista desde abajo) que se endereza y termina mirando la fila.
  const tilt = interpolate(g, [0, 102, A2, A3, A4, A5, A6], [-15, -9, -1, 6, 4, 1, -3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  // EL PUSH: la cámara ENTRA en la fila (frontera C) y queda pegada al bloque 101.
  const pushV = interpolate(g, [A3 + 110, A4, A4 + 70, A5, A5 + 90], [1, 1.9, 2.15, 1.3, 1.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 41) * (pushV - 1);           // el bloque 101 vive en x 41% / y 52%
  const ty = (50 - 52) * (pushV - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotateY(${orbit.toFixed(2)}deg) rotateX(${tilt.toFixed(2)}deg) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${pushV.toFixed(3)})`
  );
};

// ── EL PELDAÑO — el objeto que cruza las cinco fronteras ─────────────────────────────────────
// Hormigón oscuro con el canto de arriba lamido por la luz de su nivel. Tiene ESPESOR: cara frontal
// + plano superior en fuga. La cara frontal es una superficie de la escena: ahí se INCRUSTAN cosas.
const Deck: React.FC<{
  left: number; right: number; top: number; tint: string; z?: number; children?: React.ReactNode;
}> = ({ left, right, top, tint, z = 0, children }) => (
  <div style={{
    position: "absolute", left, top, width: Math.max(1, right - left), height: Math.max(1, FLOOR + 240 - top),
    transform: `translateZ(${z}px)`, transformStyle: "preserve-3d",
    background: `linear-gradient(180deg, ${rgba(tint, 0.24)} 0%, ${rgba(V.ink2, 0.97)} 9%, ${rgba(V.ink1, 1)} 100%)`,
    borderTop: `3px solid ${rgba(tint, 0.92)}`,
    boxShadow: `0 34px 84px ${rgba(V.ink0, 0.88)}, inset 0 0 90px ${rgba(V.ink0, 0.62)}`,
  }}>
    {/* el plano superior en fuga: el peldaño no es un rectángulo, tiene profundidad */}
    <div style={{
      position: "absolute", left: 0, right: -46, top: -30, height: 30,
      background: `linear-gradient(180deg, ${rgba(tint, 0.1)}, ${rgba(tint, 0.3)})`,
      transform: "skewX(-56deg)", transformOrigin: "left bottom",
    }} />
    {/* grano de hormigón: la cara no es plana de color */}
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: 0.16,
      backgroundImage: "repeating-linear-gradient(114deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 7px)",
      mixBlendMode: "overlay",
    }} />
    {children}
  </div>
);

// ── LOS CIEN BLOQUES YA PAGADOS (esto ES un gráfico: va en vector) ───────────────────────────
const Row100: React.FC<{
  x0: number; x1: number; baseline: number; h: number; amber: (i: number) => number; opacity?: number;
}> = ({ x0, x1, baseline, h, amber, opacity = 1 }) => {
  const n = 100;
  const pitch = (x1 - x0) / n;
  const w = Math.max(3, pitch - 3.4);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = clamp01(amber(i));
        const c = a > 0.02 ? light(a, "volt", "amber") : V.volt;
        const hh = h * (0.86 + rnd(i * 4.3) * 0.14);
        return (
          <div key={i} style={{
            position: "absolute", left: x0 + i * pitch, top: baseline - hh, width: w, height: hh, opacity,
            background: `linear-gradient(180deg, ${rgba(c, 0.92)} 0%, ${rgba(c, 0.36)} 74%, ${rgba(c, 0.2)} 100%)`,
            boxShadow: `0 0 ${(7 + 15 * a).toFixed(1)}px ${rgba(c, 0.34 + 0.42 * a)}`,
          }} />
        );
      })}
    </>
  );
};

// ── EL CUENTAKILÓMETROS DE TAMBORES (el precio corriendo: es un mecanismo, va en vector) ─────
const DRUM_H = 104, DRUM_W = 72;
const wheelAt = (x: number) => {
  const fr = x - Math.floor(x);
  return Math.floor(x) + (fr > 0.88 ? (fr - 0.88) / 0.12 : 0);
};
const Drum: React.FC<{ pos: number; color: string }> = ({ pos, color }) => {
  const p = ((pos % 10) + 10) % 10;
  return (
    <div style={{
      position: "relative", width: DRUM_W, height: DRUM_H, overflow: "hidden", borderRadius: 7,
      background: `linear-gradient(180deg, ${rgba(V.ink0, 0.99)} 0%, ${rgba(V.ink2, 0.86)} 48%, ${rgba(V.ink0, 0.99)} 100%)`,
      boxShadow: `inset 0 0 22px ${rgba(V.ink0, 0.92)}, 0 8px 22px ${rgba(V.ink0, 0.72)}`,
      border: `1px solid ${rgba(color, 0.22)}`,
    }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -p * DRUM_H }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            height: DRUM_H, lineHeight: `${DRUM_H}px`, textAlign: "center",
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 80, color,
          }}>{i % 10}</div>
        ))}
      </div>
      {/* la sombra del cilindro: los dígitos entran y salen por el borde, no aparecen */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0, bottom: 0,
        background: `linear-gradient(180deg, ${rgba(V.ink0, 0.88)} 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 66%, ${rgba(V.ink0, 0.88)} 100%)`,
      }} />
    </div>
  );
};
const Odometer: React.FC<{ cents: number; color: string }> = ({ cents, color }) => {
  const glyph: React.CSSProperties = {
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 74, color, lineHeight: `${DRUM_H}px`,
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ ...glyph, marginRight: 8 }}>$</span>
      <Drum pos={wheelAt(cents / 100)} color={color} />
      <span style={{ ...glyph, margin: "0 5px" }}>,</span>
      <Drum pos={wheelAt(cents / 10)} color={color} />
      <Drum pos={cents} color={color} />
    </div>
  );
};

// ── EL WORDMARK PINTADO SOBRE EL HORMIGÓN (no flota: está EN la cara del peldaño) ────────────
const FaceMark: React.FC<{ text: string; size: number; color: string; opacity: number; top: number; left: number }> = ({
  text, size, color, opacity, top, left,
}) => (
  <div style={{
    position: "absolute", left, top, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size,
    letterSpacing: size * 0.14, color, opacity, mixBlendMode: "soft-light",
    textShadow: `0 2px 0 ${rgba(V.ink0, 0.5)}`,
  }}>{text}</div>
);

export const MovS4B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A2, A3, A5, A6], [0.24, 0.34, 0.42, 0.56, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [A2, A3, A4, A5 + 90], [0.22, 0.55, 0.74, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, 60, A2, A3, A4 + 90, A5, A6], [0.42, 0.86, 1.02, 1.1, 1.18, 0.86, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A3, A5, A6], [0.86, 0.6, 0.78, 0.66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const cold = light(cool, "volt", "sky");

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={cold} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · el canto de la hoja se engorda hasta ser un peldaño ═══════════════ */}
        {acto === 1 && (() => {
          const rise = clamp01(f / 34);                  // la hoja sube de canto desde abajo
          const fat = clamp01((f - 26) / 30);            // y el canto ENGORDA hasta ser hormigón
          const numT = clamp01((f - 46) / 24);
          const topA = eio(FLOOR - 22, TOP_HIGH, fat);
          return (
            <>
              <Plane z={-120}>
                {/* la hoja REAL, de canto, vista desde abajo: el borde blanco que sube */}
                <MediaCard src={M.hojaF} kind="photo" w={1460} h={300}
                  x={50} y={pc(eio(FLOOR + 210, TOP_HIGH + 116, rise))} z={0}
                  ry={0} rx={eio(-82, -71, rise)} lit={1} litColor={V.volt}
                  sheenAt={toCF(14)} radius={6} opacity={1 - 0.72 * fat} />
              </Plane>
              <Plane z={0}>
                {/* el canto engordado: ya es hormigón y ocupa el ancho del cuadro */}
                <Deck left={-180} right={2100} top={topA} tint={V.volt} z={0}>
                  <FaceMark text="ESCALÓN" size={eio(60, 156, fat)} color={V.white} opacity={0.5 * fat} top={104} left={330} />
                </Deck>
              </Plane>
              <Plane z={240}>
                {/* el 2 se APOYA sobre el peldaño (no flota encima del cuadro) */}
                <div style={{
                  position: "absolute", left: "20%", top: `${pc(lerp(TOP_HIGH + 130, TOP_HIGH - 96, numT)).toFixed(2)}%`,
                  transform: `translate(-50%,-100%) scale(${lerp(0.42, 1, numT).toFixed(3)})`, opacity: numT,
                }}>
                  <Num size={238} color={V.volt}>2</Num>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el peldaño tiene DOS alturas: la cinta trepa de 27 a 34 ═══════════ */}
        {acto === 2 && (() => {
          const xCut = 900;
          const p1 = clamp01(f / 32), p2 = clamp01((f - 34) / 18), p3 = clamp01((f - 52) / 32);
          const cond = clamp01((f - 96) / 14);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.letraF} kind="photo" z={0} scale={1.3} dim={0.78} tint={cold} /></Plane>
              {/* la sombra dura que el escalón tira HACIA el espectador */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: -180, top: FLOOR - 6, width: 2280, height: 210,
                  background: `linear-gradient(180deg, ${rgba(V.ink0, 0.94)}, rgba(0,0,0,0))`,
                  transform: "skewX(-24deg)", transformOrigin: "left top",
                }} />
              </Plane>
              <Plane z={0}>
                <Deck left={-180} right={xCut} top={TOP_LOW} tint={V.bone} z={-30} />
                <Deck left={xCut} right={2100} top={TOP_HIGH} tint={cold} z={0}>
                  <FaceMark text="ESCALÓN" size={132} color={V.white} opacity={0.34} top={214} left={92} />
                </Deck>
              </Plane>
              {/* ⭐ la letra chica REAL, incrustada en el canto vertical del escalón */}
              <Plane z={40}>
                <MediaCard src={M.letraF} kind="photo" w={470} h={286} x={px(xCut + 336)} y={pc(TOP_HIGH + 196)} z={0}
                  ry={-6} rx={2} lit={1} litColor={cold} label="LA LETRA CHICA" sheenAt={toCF(44)} radius={8} />
              </Plane>
              {/* LA CINTA DE PRECIO: corre por el suelo bajo, trepa el frente y se planta arriba */}
              <Plane z={150}>
                <div style={{
                  position: "absolute", left: 70, top: TOP_LOW - 13, height: 11, width: (xCut - 70) * p1,
                  background: `linear-gradient(90deg, ${rgba(V.bone, 0.2)}, ${rgba(V.bone, 0.95)})`,
                  boxShadow: `0 0 22px ${rgba(V.bone, 0.5)}`,
                }} />
                <div style={{
                  position: "absolute", left: xCut - 2, top: TOP_HIGH, width: 13,
                  height: (TOP_LOW - TOP_HIGH) * p2, marginTop: (TOP_LOW - TOP_HIGH) * (1 - p2),
                  background: `linear-gradient(0deg, ${rgba(V.bone, 0.6)}, ${rgba(cold, 0.98)})`,
                  boxShadow: `0 0 26px ${rgba(cold, 0.6)}`,
                }} />
                <div style={{
                  position: "absolute", left: xCut + 11, top: TOP_HIGH - 13, height: 11, width: (1860 - xCut) * p3,
                  background: `linear-gradient(90deg, ${rgba(cold, 0.98)}, ${rgba(cold, 0.28)})`,
                  boxShadow: `0 0 24px ${rgba(cold, 0.55)}`,
                }} />
              </Plane>
              <Plane z={260}>
                <Readout value="27" unit="¢" at={toCF(30)} x={px(430)} y={pc(TOP_LOW - 92)} size={112} color={V.bone} />
                <Readout value="34" unit="¢" at={toCF(82)} x={px(1440)} y={pc(TOP_HIGH - 92)} size={132} color={cold} />
                <div style={{ position: "absolute", left: "6%", top: "13%", opacity: cond }}>
                  <Kick color={rgba(V.white, 0.9)}>MÁS DE 100 kWh EN PUNTA</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · detrás del escalón estaban los cien ya pagados (sin texto) ════════ */}
        {acto === 3 && (() => {
          const xCut = 1560;
          const cross = clamp01((f - 16) / 16);          // un solo bloque cruza la raya
          const back = clamp01((f - 40) / 88);           // y el ámbar vuelve HACIA ATRÁS por la fila
          const crossC = light(cross, "volt", "amber");
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.medidorV} kind="video" z={0} scale={1.3} dim={0.8} startFrom={22} tint={cold} /></Plane>
              <Plane z={-90}>
                {/* la fila apretada de cien kilovatios YA PAGADOS, sobre el nivel bajo */}
                <Row100 x0={44} x1={xCut - 26} baseline={TOP_LOW} h={58}
                  amber={(i) => (back <= 0 ? 0 : clamp01((back * 118 - (99 - i)) / 6))} />
              </Plane>
              <Plane z={0}>
                <Deck left={-180} right={xCut} top={TOP_LOW} tint={V.bone} z={-30} />
                <Deck left={xCut} right={2260} top={TOP_HIGH} tint={cold} z={0}>
                  <FaceMark text="ESCALÓN" size={104} color={V.white} opacity={0.3} top={188} left={64} />
                </Deck>
                {/* LA RAYA: la frontera de los 100 kWh */}
                <div style={{
                  position: "absolute", left: xCut - 3, top: TOP_HIGH - 210, width: 5, height: 210 + H_HIGH,
                  background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.volt, 0.9)})`,
                  boxShadow: `0 0 26px ${rgba(V.volt, 0.66)}`,
                }} />
              </Plane>
              <Plane z={90}>
                {/* el bloque que cruza: se despega de la fila y aterriza del otro lado de la raya */}
                <div style={{
                  position: "absolute", left: lerp(xCut - 52, xCut + 62, eio(0, 1, cross)),
                  top: lerp(TOP_LOW - 58, TOP_HIGH - 62, eio(0, 1, cross)),
                  width: 22, height: 62, opacity: cross > 0 ? 1 : 0,
                  background: `linear-gradient(180deg, ${rgba(crossC, 0.98)}, ${rgba(crossC, 0.4)})`,
                  boxShadow: `0 0 ${(18 + 26 * cross).toFixed(1)}px ${rgba(V.amber, 0.7 * cross)}`,
                }} />
              </Plane>
              {/* ⭐ la tarjeta de la letra chica SIGUE incrustada en el canto: el objeto que cruza */}
              <Plane z={40}>
                <MediaCard src={M.letraF} kind="photo" w={330} h={202} x={px(xCut + 336)} y={pc(TOP_HIGH + 178)} z={0}
                  ry={-6} lit={0.86} litColor={cold} radius={8} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · el bloque 101 se levanta y el precio corre en tambores ════════════ */}
        {acto === 4 && (() => {
          const lift = clamp01((f - 10) / 96);
          const roll = clamp01((f - 18) / 104);
          const cents = lerp(34, 734, interpolate(roll, [0, 1], [0, 1], { easing: Easing.bezier(0.3, 0, 0.18, 1) }));
          const by = lerp(TOP_LOW - 150, TOP_LOW - 640, eio(0, 1, lift));
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.carpetaF} kind="photo" z={0} scale={1.32} dim={0.82} tint={cold} /></Plane>
              {/* los otros cien quedan abajo, chiquitos, sosteniéndolo en fila */}
              <Plane z={-140}>
                <Row100 x0={120} x1={1800} baseline={FLOOR - 20} h={30} amber={() => 1} opacity={0.72} />
              </Plane>
              {/* ⭐ EL BLOQUE 101, con el VIDEO REAL de los tambores del medidor en la cara */}
              <Plane z={60}>
                <div style={{
                  position: "absolute", left: "41%", top: by, width: 372, height: 250, marginLeft: -186,
                  borderRadius: 10,
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.34)}, ${rgba(V.ink1, 0.98)})`,
                  border: `2px solid ${rgba(V.amber, 0.82)}`,
                  boxShadow: `0 0 ${(40 + 60 * lift).toFixed(1)}px ${rgba(V.amber, 0.4)}, 0 40px 90px ${rgba(V.ink0, 0.9)}`,
                }} />
                <MediaCard src={M.medidorV} kind="video" w={318} h={196} x={41} y={pc(by + 125)} z={26}
                  ry={-3} startFrom={16} lit={1} litColor={V.amber} sheenAt={toCF(34)} radius={7} />
                <div style={{
                  position: "absolute", left: "41%", top: by - 54, transform: "translateX(-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 4,
                  color: V.amber, textShadow: "0 5px 22px rgba(0,0,0,0.94)", opacity: clamp01((f - 26) / 14),
                }}>EL KILOVATIO 101</div>
              </Plane>
              {/* el cuentakilómetros: arranca en 34 centavos y no para hasta 7,34 */}
              <Plane z={280}>
                <div style={{ position: "absolute", left: "41%", top: 704, transform: "translate(-50%,0)" }}>
                  <Odometer cents={cents} color={V.amber} />
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · queda el precio: el MISMO kilovatio hora, dos precios ═════════════ */}
        {acto === 5 && (() => {
          const off = clamp01((f - 6) / 66);             // los cien de abajo se apagan uno por uno
          const small = clamp01((f - 62) / 26);
          return (
            <>
              <Plane z={-80}>
                <Row100 x0={120} x1={1800} baseline={FLOOR + 70} h={30}
                  amber={() => 1} opacity={0.7 * (1 - off)} />
              </Plane>
              {/* ⭐ LAS DOS TARJETAS CORREN EL MISMO CLIP CON EL MISMO startFrom: es el mismo kWh */}
              <Plane z={80}>
                <MediaCard src={M.pinzaV} kind="video" w={342} h={214} x={39} y={30} z={0}
                  ry={5} startFrom={20} lit={1} litColor={V.amber} label="EL QUE CRUZA LA RAYA" sheenAt={toCF(12)} radius={8} />
                {small > 0 && (
                  <MediaCard src={M.pinzaV} kind="video" w={168} h={106} x={39} y={72} z={0}
                    ry={5} startFrom={20} lit={0.9} litColor={V.volt} sheenAt={toCF(70)} radius={6}
                    opacity={small} />
                )}
              </Plane>
              <Plane z={240}>
                <Readout value="$7,34" at={toCF(0)} x={68} y={30} size={186} color={V.amber} />
                {small > 0.4 && <Readout value="34" unit="¢" at={toCF(66)} x={58} y={72} size={92} color={V.volt} />}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · el desfile: doce escalones iguales, uno por mes ═══════════════════ */}
        {acto === 6 && (() => {
          const march = clamp01(f / 46);
          return (
            <>
              <Plane z={-680}><PhotoPlane src={M.vueltaF} kind="photo" z={0} scale={1.34} dim={0.85} tint={cold} /></Plane>
              <Plane z={-40}>
                {Array.from({ length: 12 }, (_, i) => {
                  const k = i / 11;
                  const s = lerp(1, 0.2, k);                             // se van a la profundidad
                  const appear = clamp01((march * 15 - i) / 2.2);
                  const cx = lerp(360, 1620, k);
                  const cy = lerp(FLOOR - 30, 372, k);
                  const wLow = 300 * s, wHigh = 250 * s;
                  const hl = H_LOW * s * 0.5, hh = H_HIGH * s * 0.5;
                  const dim = lerp(1, 0.2, k) * appear;
                  return (
                    <div key={i} style={{ position: "absolute", left: cx, top: cy, opacity: appear }}>
                      <div style={{
                        position: "absolute", left: -wLow, top: -hl, width: wLow, height: hl + 150 * s,
                        background: `linear-gradient(180deg, ${rgba(V.bone, 0.2 * dim)}, ${rgba(V.ink1, 0.99)})`,
                        borderTop: `${Math.max(1, 3 * s)}px solid ${rgba(V.bone, 0.7 * dim)}`,
                      }} />
                      <div style={{
                        position: "absolute", left: 0, top: -hh, width: wHigh, height: hh + 150 * s,
                        background: `linear-gradient(180deg, ${rgba(V.amber, 0.28 * dim)}, ${rgba(V.ink1, 0.99)})`,
                        borderTop: `${Math.max(1, 3 * s)}px solid ${rgba(V.amber, 0.85 * dim)}`,
                        boxShadow: `0 ${18 * s}px ${44 * s}px ${rgba(V.ink0, 0.86)}`,
                      }} />
                      {/* en cada mes, el mismo bloque cruzando la raya */}
                      <div style={{
                        position: "absolute", left: 12 * s, top: -hh - 34 * s, width: 20 * s, height: 34 * s,
                        background: rgba(V.amber, 0.95 * appear),
                        boxShadow: `0 0 ${16 * s}px ${rgba(V.amber, 0.7 * appear)}`,
                      }} />
                    </div>
                  );
                })}
              </Plane>
              {/* ⭐ sobre el primer escalón, la carpeta REAL de facturas */}
              <Plane z={150}>
                <MediaCard src={M.carpetaF} kind="photo" w={392} h={244} x={13.5} y={38} z={0}
                  ry={13} rx={3} lit={1} litColor={V.amber} label="AÑOS DE FACTURAS" sheenAt={toCF(18)} radius={9} />
                <IconPng src={M.icCalendario} x={31} y={20} size={104} z={0} opacity={0.6 * march} glow={V.ink0} />
              </Plane>
              <Plane z={260}>
                <div style={{ position: "absolute", left: "6%", top: "83%", opacity: clamp01((f - 30) / 14) }}>
                  <Kick color={rgba(V.white, 0.92)}>AÑO TRAS AÑO</Kick>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* ── LA COSTURA DE ENTRADA: el negro que S4A enterró NO se funde, lo EMPUJA la hoja ── */}
      {acto === 1 && (() => {
        const w = clamp01(f / 30);
        if (w >= 1) return null;
        return (
          <div style={{
            position: "absolute", left: 0, right: 0, top: 0, height: `${(100 * (1 - w)).toFixed(2)}%`,
            background: "#000000", pointerEvents: "none",
          }} />
        );
      })()}
    </AbsoluteFill>
  );
};
