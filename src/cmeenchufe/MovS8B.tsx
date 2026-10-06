// MovS8B.tsx — MOVIMIENTO S8B · "LA CONFESIÓN"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 3 actos · 1.169.730 → 1.189.370 ms · 589 frames @30.
//
// LA IDEA: el remate conceptual del video entero. Consumió 29 kilovatios hora MÁS que el año pasado
// —porque toda batería pierde al cargar y al descargar, y lo que pierde se va en calor— y aun así
// pagó menos de la mitad. No es una planilla: es una confesión, y el director la pidió AISLADA.
//
// EL OBJETO QUE ATRAVIESA LAS DOS FRONTERAS: **LA CINTA DE KILOVATIOS HORA**.
//   acto 1 → son dos cintas tendidas, una arriba (el año pasado) y otra abajo (este mes) que la pasa;
//   acto 2 → la cámara sale por las ranuras de la reja del disipador y la cinta ya es LA VENA de
//            corriente que cruza el cuadro y pierde un 12 % en calor por el camino;
//   acto 3 → la vena se apaga: la cinta sobrevive sólo como la cola que arrastra "CONSUMÍ MÁS".
//
// UNA cámara: `camAt(gFrame)` — hereda la posición con la que S8A terminó (z +470, grúa −232, o sea
// a ras del piso de concreto) y SUBE. En el acto 3 el viaje se frena al 7 %: es la única cámara casi
// quieta de toda la sección, y aun así respira (el `breath` es función de gFrame sin frenar).
// Le entrega a S8C la posición: z0 de S8C = +150 (el z1 de acá).
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ (tramo 2 de 5): entra en SKY frío desde ARRIBA —la compañía, lo que te cobran— y se
// templa apenas hacia el voltio en el remate, porque "CONSUMÍ MÁS" es lo único cálido del cuadro.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-177 · "29 kWh MÁS"                       material: FOTO carpeta facturas + FOTO factura cenital + CLIP disipador
//   entra  cam {grúa −232, subiendo del piso de concreto}  luz {SKY frío desde arriba, key 0.42}
//   sale   cam {METIDA en la reja del disipador, push ×2.9} luz {SKY, key 0.46}
//   ── FRONTERA A ···· ZOOM-THROUGH: sale por las ranuras de la reja y ya está adentro. ······
// ACTO 2 · g283-427 · "SE VA EN CALOR"                 material: CLIP disipador + CLIP rejillas de calor
//   entra  cam {saliendo del push 2.75 → 1, grúa −30}      luz {SKY + ámbar que sube al techo, key 0.5}
//   sale   cam {grúa +8, casi frenada}                     luz {el ámbar se deshace arriba}
//   ── FRONTERA B ···· APAGÓN SELECTIVO: la vena se apaga y no queda NADA en el cuadro. ······
// ACTO 3 · g427-589 · "CONSUMÍ MÁS / PAGUÉ MENOS DE LA MITAD"   material: FOTO factura de 44
//   entra  cuadro vacío: negro VOLT y polvo. LA CÁMARA CASI SE DETIENE (única vez de la sección).
//   sale   las dos cifras salieron por lados opuestos y el cuadro vuelve a quedar vacío.
//
// ⭐ CÓMO SE CRUZAN SIN TOCARSE (el pedido literal del director):
//   viven en DOS PLANOS DE PROFUNDIDAD distintos — "CONSUMÍ MÁS" en z +230 (adelante),
//   "PAGUÉ MENOS DE LA MITAD" en z −180 (atrás) — y en dos carriles laterales corridos (44 % / 56 %).
//   Suben y bajan por el mismo eje vertical y en el frame del cruce la de adelante PASA POR DELANTE:
//   su sombra proyectada (un plano oscuro que viaja pegado a ella, montado a la altura del plano de
//   atrás) le barre la cara a la otra durante ~14 frames. Hay contacto de LUZ, nunca de materia:
//   el paralaje entre los dos planos deja ver el hueco. Después siguen de largo y salen por el lado
//   contrario al que entraron. Nada más entra al cuadro en todo el acto.
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 283, A3 = 427;
const G_END = 589;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3 };

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  carpetaF: "img/cmeenchufe/cmee_s4_carpeta_facturas.png",
  cenitalF: "img/cmeenchufe/cmee_s4_factura_cenital_cierre.png",
  disipadorV: "broll/cmeenchufe/cmee_s8_ventilador_disipador.mp4",
  rejillasV: "broll/cmeenchufe/cmee_s6_rejillas_calor.mp4",
  facturaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  medidorF: "img/cmeenchufe/cmee_s1_medidor_disco.png",
  icTermometro: "img/cmeenchufe/cmee_ic_termometro.png",
  icRayo: "img/cmeenchufe/cmee_ic_rayo.png",
  icMedidor: "img/cmeenchufe/cmee_ic_medidor.png",
};

// ── LA CÁMARA · hereda de S8A y en el remate casi se detiene, pero nunca vuelve a cero ──────
const camAt = (g: number) => {
  // a partir del remate el VIAJE se frena al 7 %: no se congela, se vuelve casi imperceptible
  const gg = g <= A3 ? g : A3 + (g - A3) * 0.07;
  const base = gcam(gg, { z0: 470, z1: 150, panX: 96, panY: -34, ry: 4.6, rx: -1.6, dur: G_END });
  // LA GRÚA: arranca en −232 (donde S8A dejó la cámara, a ras del piso) y SUBE hasta el remate.
  const crane = interpolate(
    gg,
    [0, A1 + 96, A2, A2 + 96, A3, G_END],
    [-232, -150, -96, -30, 8, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH del acto 1→2: la cámara entra en la reja del disipador (x 78% / y 62%).
  const push = interpolate(g, [A1 + 118, A1 + 177, A2, A2 + 34], [1, 2.9, 2.75, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 78) * (push - 1);
  const ty = (50 - 62) * (push - 1);
  // el respiro NO se frena: aunque el viaje esté casi detenido, ningún frame queda clavado
  const bx = Math.sin(g / 71) * 3.2, by = Math.cos(g / 97) * 2.4;
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA CINTA DE KILOVATIOS HORA · el objeto que cruza el movimiento ──────────────────────────
// Es un gráfico (mide energía), así que va en vector; el material real vive en las tarjetas.
const Cinta: React.FC<{
  x: number; y: number; w: number; h?: number; tint: string; p: number; ticks?: number; z?: number;
}> = ({ x, y, w, h = 34, tint, p, ticks = 12, z = 0 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, height: h, marginTop: -h / 2,
    width: w * clamp01(p), transform: `translateZ(${z}px)`, transformOrigin: "left center",
    background: `linear-gradient(180deg, ${rgba(tint, 0.62)} 0%, ${rgba(tint, 0.24)} 52%, ${rgba(V.ink1, 0.94)} 100%)`,
    borderTop: `2px solid ${rgba(tint, 0.95)}`,
    boxShadow: `0 14px 34px ${rgba(V.ink0, 0.82)}, 0 0 26px ${rgba(tint, 0.22)}`,
  }}>
    {Array.from({ length: ticks }, (_, i) => (
      <div key={i} style={{
        position: "absolute", left: `${((i + 1) / (ticks + 1)) * 100}%`, top: 4, bottom: 4, width: 1,
        background: rgba(V.ink0, 0.5),
      }} />
    ))}
  </div>
);

export const MovS8B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: hereda el sky con que terminó S8A y se templa en el remate.
  const keyFrom = interpolate(gFrame, [0, A2, A3, G_END], [0.42, 0.5, 0.54, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warm = interpolate(gFrame, [A2 + 60, A3 + 60], [0, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A3, A3 + 70, G_END], [0.72, 0.94, 0.7, 0.52, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, A3], [0.78, 0.66, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ────────────────────────── */}
      <VoltAtmos tint={light(warm, "sky", "volt")} tint2={light(clamp01(warm * 2), "sky", "amber")}
        keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · dos cintas: la de este mes pasa de largo a la del año pasado ═════ */}
        {acto === 1 && (() => {
          const arriba = clamp01((f - 8) / 46);         // la cinta del año pasado se tiende y para
          const abajo = clamp01((f - 22) / 84);         // la de este mes la pasa de largo y sigue
          const marca = clamp01((f - 96) / 22);         // el excedente queda solo al final, marcado
          const W_ANIO = 980, W_MES = 1310;             // 1310 − 980 = el excedente: 29 kWh
          const X0 = 12;                                // las dos arrancan del mismo borde
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.medidorF} kind="photo" z={0} scale={1.3} dim={0.82} tint={V.sky} /></Plane>
              {/* LAS DOS CINTAS, una encima de la otra, tendidas horizontales */}
              <Plane z={0}>
                <Cinta x={X0} y={38} w={W_ANIO} tint={V.sky} p={arriba} ticks={10} />
                <Cinta x={X0} y={62} w={W_MES} tint={V.volt} p={abajo} ticks={14} />
                {/* el tope de la del año pasado: la marca en la que SE DETIENE */}
                <div style={{
                  position: "absolute", left: `calc(${X0}% + ${W_ANIO}px)`, top: "31%", width: 3, height: "40%",
                  background: rgba(V.sky, 0.72 * arriba), boxShadow: `0 0 20px ${rgba(V.sky, 0.5 * arriba)}`,
                }} />
                {/* EL EXCEDENTE: el tramo que la de abajo saca de más, solo, sin que nada lo tape */}
                {abajo > 0.76 && (
                  <div style={{
                    position: "absolute", left: `calc(${X0}% + ${W_ANIO}px)`, top: "62%",
                    width: (W_MES - W_ANIO) * clamp01((abajo - 0.76) / 0.24), height: 34, marginTop: -17,
                    background: `linear-gradient(180deg, ${rgba(V.volt, 0.95)}, ${rgba(V.volt, 0.5)})`,
                    boxShadow: `0 0 40px ${rgba(V.volt, 0.7)}, 0 14px 30px ${rgba(V.ink0, 0.8)}`,
                  }} />
                )}
              </Plane>
              {/* LAS DOS TARJETAS: cada cinta lleva la FOTO REAL de la factura del año que le toca */}
              <Plane z={180}>
                <MediaCard src={M.carpetaF} kind="photo" w={352} h={218} x={82} y={30} z={0} ry={-11}
                  lit={0.72} litColor={V.sky} label="EL AÑO PASADO" sheenAt={toCF(18)} radius={8} />
                <MediaCard src={M.cenitalF} kind="photo" w={352} h={218} x={82} y={82} z={0} ry={-11}
                  lit={1} litColor={V.volt} label="ESTE MES" sheenAt={toCF(46)} radius={8} />
                {/* la reja del disipador: por acá se va la cámara en la frontera A */}
                <MediaCard src={M.disipadorV} kind="video" w={300} h={190} x={78} y={62} z={120}
                  startFrom={14} ry={-6} lit={0.9} litColor={V.volt} sheenAt={toCF(120)} radius={8}
                  opacity={clamp01((f - 104) / 20)} />
              </Plane>
              <Plane z={280}>
                <Readout value="+29" unit="kWh" label="MÁS QUE EL AÑO PASADO" at={toCF(100)} x={62} y={16} size={122} color={V.volt} />
                <div style={{ position: "absolute", left: "12%", top: "84%", opacity: clamp01((f - 12) / 14) }}>
                  <Kick color={rgba(V.bone, 0.8)}>CONSUMÍ MÁS ELECTRICIDAD</Kick>
                </div>
                <IconPng src={M.icMedidor} x={7} y={pc(560)} size={82} z={0} opacity={0.55 * marca + 0.25} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la vena pierde un 12 % por el camino, y se va en calor ═══════════ */}
        {acto === 2 && (() => {
          const flow = clamp01(f / 34);                 // la vena entra por la izquierda
          const split = clamp01((f - 30) / 34);         // se le desprende el 12 %
          const heat = clamp01((f - 52) / 62);          // sube, se vuelve ámbar y se deshace en el techo
          const rayas = clamp01((f - 62) / 30);         // el termómetro sube dos rayas y se queda arriba
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.disipadorV} kind="video" startFrom={22} z={0} scale={1.36} dim={0.8} tint={V.volt} /></Plane>
              {/* LA VENA DE CORRIENTE: entra gorda por la izquierda y sale FLACA por la derecha */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: 0, top: 560, width: 960 * flow, height: 74, marginTop: -37,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.85)}, ${rgba(V.volt, 0.6)})`,
                  boxShadow: `0 0 46px ${rgba(V.volt, 0.42)}, 0 20px 44px ${rgba(V.ink0, 0.8)}`,
                }} />
                <div style={{
                  position: "absolute", left: 960, top: 566, width: 960 * clamp01((flow - 0.5) * 2), height: 50, marginTop: -25,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.6)}, ${rgba(V.volt, 0.44)})`,
                  boxShadow: `0 0 30px ${rgba(V.volt, 0.28)}, 0 18px 40px ${rgba(V.ink0, 0.8)}`,
                }} />
                {/* el 12 % que se DESPRENDE de la vena, sube y se deshace como calor en el techo */}
                <div style={{
                  position: "absolute", left: 916, top: 542 - 400 * eio(0, 1, heat),
                  width: 96 + 260 * heat, height: 44 + 90 * heat, marginLeft: -48,
                  borderRadius: 40,
                  opacity: split * (1 - 0.92 * heat),
                  background: `radial-gradient(circle, ${light(heat, "volt", "amber")} 0%, rgba(0,0,0,0) 72%)`,
                  filter: `blur(${(4 + 26 * heat).toFixed(1)}px)`,
                }} />
                {/* el 12 % se escribe PEGADO a lo que se desprende, y se deshace con ello */}
                <div style={{
                  position: "absolute", left: 916, top: 500 - 400 * eio(0, 1, heat), transform: "translateX(-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: 1.4,
                  color: light(heat, "volt", "amber"), opacity: split * (1 - 0.9 * heat),
                  textShadow: `0 0 40px ${rgba(light(heat, "volt", "amber"), 0.6)}, 0 6px 26px rgba(0,0,0,0.94)`,
                }}>12 %</div>
              </Plane>
              {/* EL TERMÓMETRO DEL GARAJE, colgado al fondo dentro de su tarjeta con material real */}
              <Plane z={200}>
                <MediaCard src={M.rejillasV} kind="video" w={368} h={230} x={84} y={26} z={0} ry={-13}
                  startFrom={12} lit={0.62 + 0.38 * rayas} litColor={V.amber} label="Y ESO SE VA EN CALOR"
                  sheenAt={toCF(58)} radius={8} />
                <IconPng src={M.icTermometro} x={84} y={pc(500)} size={104} z={0} opacity={0.5 + 0.45 * rayas} glow={V.ink0} />
                {/* las dos rayas que sube y no baja (esto es un instrumento: vector) */}
                {[0, 1].map((i) => (
                  <div key={i} style={{
                    position: "absolute", left: "89.5%", top: 548 - i * 26, width: 62, height: 5,
                    background: rgba(V.amber, 0.9 * clamp01(rayas * 2 - i)),
                    boxShadow: `0 0 18px ${rgba(V.amber, 0.6 * clamp01(rayas * 2 - i))}`,
                  }} />
                ))}
              </Plane>
              <Plane z={300}>
                <div style={{ position: "absolute", left: "10%", top: "22%", opacity: clamp01((f - 8) / 14) }}>
                  <Kick color={rgba(V.bone, 0.82)}>TODA BATERÍA PIERDE</Kick>
                </div>
                <IconPng src={M.icRayo} x={6} y={pc(548)} size={78} z={0} opacity={0.7 * flow} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}
        {/* ═══ ACTO 3 · EL REMATE · las dos cifras se cruzan SIN TOCARSE ═══════════════ */}
        {/* sigue DENTRO de <Layers>: la cámara no se reinicia, sólo se frenó al 7 %. El motor
            del acto no es la cámara, es el PARALAJE entre los dos planos de profundidad. */}
        {acto === 3 && (() => {
          const p = clamp01((f - 8) / 138);
          const e = eio(0, 1, p);
          const yWarm = lerp(134, -36, e);          // sube desde abajo y sale por arriba
          const yCold = lerp(-36, 134, e);          // baja desde arriba y sale por abajo
          const cruce = 1 - clamp01(Math.abs(yWarm - 50) / 22);   // 1 exacto en el frame del cruce
          return (
            <>
              {/* silencio visual: el cuadro se vacía. Sólo negro VOLT y el polvo que ya estaba. */}
              <Plane z={-520}>
                <AbsoluteFill style={{ background: `radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.74)} 100%)` }} />
              </Plane>

              {/* ── LA QUE BAJA · atrás, en frío, arrastrando la FOTO REAL de la factura ─── */}
              <Plane z={-180}>
                <div style={{
                  position: "absolute", left: "56%", top: `${yCold.toFixed(2)}%`, width: 1360, marginLeft: -680,
                  transform: "translateY(-50%)",
                }}>
                  <div style={{
                    padding: "30px 44px", borderRadius: 12,
                    background: `linear-gradient(180deg, ${rgba(V.ink1, 0.94)}, ${rgba(V.ink0, 0.8)})`,
                    borderLeft: `5px solid ${rgba(V.sky, 0.9)}`,
                    boxShadow: `0 26px 70px ${rgba(V.ink0, 0.8)}`,
                  }}>
                    <Head size={92} color={V.sky}>PAGUÉ MENOS DE LA MITAD</Head>
                  </div>
                </div>
                <MediaCard src={M.facturaF} kind="photo" w={330} h={206} x={88} y={yCold - 9} z={0} ry={-14}
                  lit={0.86} litColor={V.sky} label="44 DÓLARES" sheenAt={toCF(40)} radius={8} />
              </Plane>

              {/* ── LA SOMBRA PROYECTADA de la que sube, montada a la altura del plano de
                     atrás: es lo que hace que una PASE POR DELANTE sin que se toquen ────── */}
              <Plane z={-172}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: `${yWarm.toFixed(2)}%`, height: 320, marginTop: -160,
                  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.9)} 40%, ${rgba(V.ink0, 0.9)} 60%, rgba(0,0,0,0) 100%)`,
                  opacity: 0.46 + 0.54 * cruce,
                }} />
              </Plane>

              {/* ── LA QUE SUBE · adelante, en voltio cálido, arrastrando su cinta de kWh ── */}
              <Plane z={230}>
                <div style={{
                  position: "absolute", left: "44%", top: `${yWarm.toFixed(2)}%`, width: 1180, marginLeft: -590,
                  transform: "translateY(-50%)",
                }}>
                  <div style={{
                    padding: "30px 44px", borderRadius: 12,
                    background: `linear-gradient(180deg, ${rgba(V.ink1, 0.96)}, ${rgba(V.ink0, 0.84)})`,
                    borderLeft: `5px solid ${rgba(V.volt, 0.95)}`,
                    boxShadow: `0 34px 90px ${rgba(V.ink0, 0.9)}, 0 0 60px ${rgba(V.volt, 0.12)}`,
                  }}>
                    <Head size={104} color={V.volt}>CONSUMÍ MÁS</Head>
                  </div>
                  {/* la cola de kilovatios que arrastra: la cinta del acto 1, ya sin escala */}
                  <div style={{
                    position: "absolute", left: 60, top: "100%", width: 620, height: 26, marginTop: 10,
                    background: `linear-gradient(180deg, ${rgba(V.volt, 0.7)}, ${rgba(V.volt, 0.1)})`,
                    boxShadow: `0 0 34px ${rgba(V.volt, 0.34)}`,
                  }} />
                  <div style={{
                    position: "absolute", left: 700, top: "100%", marginTop: 4,
                    fontFamily: F_BODY, fontWeight: 600, fontSize: 34, letterSpacing: 3.4, color: rgba(V.volt, 0.8),
                  }}>+29 kWh</div>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
