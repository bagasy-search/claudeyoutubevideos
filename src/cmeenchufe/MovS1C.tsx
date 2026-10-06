// MovS1C.tsx — MOVIMIENTO S1C · "EL NÚMERO ESCONDIDO Y LA BIFURCACIÓN"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 3 actos · 84.620 → 125.100 ms · 1214 frames @30.
//
// LA IDEA: las dos cosas que pensaste al mismo tiempo ("qué bueno sería" / "esto tiene que ser
// mentira") no se resuelven con una promesa: se resuelven con las dos facturas de papel, una encima
// de la otra. Y de ahí sale la bifurcación honesta: a vos esto te va a ahorrar una fortuna, o cero.
//
// LA MATERIA QUE CRUZA LAS DOS FRONTERAS: **LA COSTURA VOLTIO VERTICAL**.
//   acto 1 → es la sombra de la silla vacía, que se estira y parte el cuadro en dos paneles;
//   acto 2 → esa misma línea GIRA 90° y se acuesta: es el canto de la factura de arriba entrando
//            sobre el banco. La cámara sale del display de la pinza y el número que quedaba ahí
//            aterriza convertido en el total impreso de la factura de abajo;
//   acto 3 → la línea del total se desprende hacia arriba, es el HAZ que atravesaba la hoja, baja
//            y se abre en dos vías. Las dos vías son los dos paneles del acto 1, acostados.
//
// UNA cámara: `camAt(gFrame)` — un `gcam` monótono (z −380 → +600) + una grúa que TREPA a mirar el
// banco de trabajo desde arriba en el acto 2 y BAJA a la altura de la caja en el acto 3, + un
// zoom-through que sale del display de la pinza justo al abrir el acto 2. Función pura de `gFrame`:
// entre el acto 1 y el 2 hay 16 s de clips reales y la cámara los atraviesa sin volver a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: arranca PARTIDA (ámbar de abajo a la izquierda, frío de arriba a la derecha) → en el
// garaje se recoge a una sola lámpara desnuda → y vuelve a partirse, más dura, en la bifurcación.
// El frío es monótono creciente: la compañía nunca afloja.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-156 · "QUÉ BUENO SERÍA / TIENE QUE SER MENTIRA"  material: FOTO factura + FOTO caja
//   entra  cam {z −380, la silla vacía al fondo, grúa 0}     luz {partida, key 0.70, int 0.96}
//   sale   cam {grúa +26, empezando a trepar}                luz {key 0.66, frío subiendo}
//   ── FRONTERA A ···· LA COSTURA GIRA 90°: la línea vertical se acuesta y es el canto del papel. ··
// ACTO 2 · g643-778 · "111 · 44"                            material: FOTO alisa_factura + FOTO factura_plana
//   entra  cam {saliendo del display de la pinza, push 3.2}  luz {una sola lámpara, key 0.44, int 0.86}
//   sale   cam {grúa +96, cenital sobre el banco}            luz {key 0.52, frío 0.45}
//   ── FRONTERA B ···· LA LÍNEA DEL TOTAL se desprende y es el haz que baja sobre la caja. ····
// ACTO 3 · g1049-1214 · "UNA FORTUNA · O CERO"              material: FOTO caja + FOTO billete + FOTO línea plana
//   entra  cam {grúa −30, a la altura de la caja}            luz {key 0.76, frío 0.60}
//   sale   cam {grúa −92, a ras del piso, deriva a la izq.}  luz {key 0.80, frío 0.68}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Head, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 643, A3 = 1049;
const G_END = 1214;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3 };
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  sillaF: "img/cmeenchufe/cmee_s1_silla_vacia.png",
  facturaF: "img/cmeenchufe/cmee_s1_factura_plana_mesa.png",
  facturaViejaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  cajaGarajeF: "img/cmeenchufe/cmee_s3_empuja_caja_al_garaje.png",
  pinzaF: "img/cmeenchufe/cmee_s1_pinza_cable.png",
  bancoF: "img/cmeenchufe/cmee_s1_golpea_banco.png",
  cajaF: "img/cmeenchufe/cmee_s1_palma_tapa_caja.png",
  billeteF: "img/cmeenchufe/cmee_s2_apuesta_billete.png",
  planaF: "img/cmeenchufe/cmee_s9_linea_plana.png",
  icFoco: "img/cmeenchufe/cmee_ic_foco.png",
};

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -380, z1: 600, panX: -130, panY: -34, ry: 6.2, rx: 2.6, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): trepa a mirar el banco desde arriba y baja a la caja.
  const crane = interpolate(
    g,
    [0, A1 + 120, A2 - 40, A2, A2 + 100, A3, A3 + 140, G_END],
    [0, 26, 120, 150, 96, -30, -70, -92],
    { ...CL, easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH: la cámara se mete en el display de la pinza durante el clip real anterior
  // y SALE del otro lado ya sobre el banco, al abrir el acto 2.
  const push = interpolate(g, [A1, A2 - 70, A2, A2 + 46], [1, 1, 3.2, 1], {
    ...CL, easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 44) * (push - 1);
  const ty = (50 - 44) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── el número que viaja (el Readout del Stage salta; acá el número tiene que ATERRIZAR) ──────
const Ticker: React.FC<{
  text: string; x: number; y: number; size: number; color: string; opacity?: number;
}> = ({ text, x, y, size, color, opacity = 1 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, color, opacity,
    whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.4)}px ${rgba(color, 0.38)}, 0 6px 26px rgba(0,0,0,0.92)`,
  }}>{text}</div>
);

export const MovS1C: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: el frío sólo crece, nunca afloja.
  const keyFrom = interpolate(gFrame, [0, A1 + 140, A2, A2 + 110, A3, G_END], [0.70, 0.66, 0.44, 0.52, 0.76, 0.80], CL);
  const cool = interpolate(gFrame, [0, A2, A3, G_END], [0.20, 0.40, 0.60, 0.68], CL);
  const inten = interpolate(gFrame, [0, A1 + 90, A2, A2 + 70, A3, G_END], [0.96, 1.06, 0.86, 0.92, 1.12, 1.06], CL);
  const floorDim = interpolate(gFrame, [0, A2, A3, G_END], [0.58, 0.72, 0.62, 0.6], CL);
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la sombra de la silla parte el cuadro en dos pensamientos ════════ */}
        {acto === 1 && (() => {
          const grow = eio(0, 1, clamp01(f / 24));
          const inL = clamp01((f - 14) / 26);
          const inR = clamp01((f - 22) / 26);
          const tL = clamp01((f - 46) / 14);
          const tR = clamp01((f - 92) / 14);
          const seamW = lerp(232, 9, grow);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.sillaF} kind="photo" z={0} scale={1.32} dim={0.74} tint={V.sky} /></Plane>

              {/* LOS DOS PANELES: la izquierda cálida desde ABAJO, la derecha fría desde ARRIBA */}
              <Plane z={-240}>
                <div style={{
                  position: "absolute", left: 0, top: 0, width: "50%", height: "100%",
                  background: `linear-gradient(0deg, ${rgba(V.amber, 0.2 * grow)} 0%, rgba(0,0,0,0) 62%)`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: 0, width: "50%", height: "100%",
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.22 * grow)} 0%, rgba(0,0,0,0) 62%)`,
                }} />
              </Plane>

              {/* LA SOMBRA DE LA SILLA se estira y SE CONVIERTE en la costura voltio */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: "50%", top: 1080 - 1080 * grow, width: seamW, height: 1080 * grow,
                  marginLeft: -seamW / 2, opacity: 1 - grow * 0.86, filter: "blur(11px)",
                  background: `linear-gradient(0deg, ${rgba(V.ink0, 0.94)} 0%, ${rgba(V.ink0, 0.24)} 100%)`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: 1080 - 1080 * grow, width: 9, height: 1080 * grow,
                  marginLeft: -4.5, opacity: grow,
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.95)} 0%, ${rgba(V.volt, 0.55)} 74%, ${rgba(V.volt, 0)} 100%)`,
                  boxShadow: `0 0 44px ${rgba(V.volt, 0.6)}`,
                }} />
              </Plane>

              {/* MATERIAL REAL: la factura de 44 (cálida) y la caja gris (fría) */}
              <Plane z={140}>
                <MediaCard src={M.facturaF} kind="photo" w={548} h={334} x={eio(20, 26, inL)} y={50} z={0}
                  ry={10} rx={1.4} lit={1} litColor={V.amber} label="LA FACTURA DE ESTE MES"
                  sheenAt={toCF(24)} radius={10} opacity={inL} />
                <MediaCard src={M.cajaGarajeF} kind="photo" w={548} h={334} x={eio(80, 74, inR)} y={50} z={0}
                  ry={-10} rx={1.4} lit={0.92} litColor={V.sky} label="UNA CAJA GRIS ENCHUFADA"
                  sheenAt={toCF(38)} radius={10} opacity={inR} />
              </Plane>

              {/* cada texto llega en SU ms y ninguno apaga al otro */}
              <Plane z={260}>
                <div style={{
                  position: "absolute", left: "26%", top: "79%", width: 640, marginLeft: -320, textAlign: "center",
                  opacity: tL, transform: `translateY(${lerp(20, 0, tL).toFixed(1)}px)`,
                }}>
                  <Head size={58} color={V.amber}>QUÉ BUENO SERÍA</Head>
                </div>
                <div style={{
                  position: "absolute", left: "74%", top: "19%", width: 700, marginLeft: -350, textAlign: "center",
                  opacity: tR, transform: `translateY(${lerp(-20, 0, tR).toFixed(1)}px)`,
                }}>
                  <Head size={58} color={V.sky}>ESTO TIENE QUE SER MENTIRA</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · las dos facturas de papel, una apoyada encima de la otra ═════════ */}
        {acto === 2 && (() => {
          const land = eio(0, 1, clamp01(f / 24));      // el número del display aterriza en el total
          const inA = clamp01((f - 4) / 30);
          const inB = clamp01((f - 30) / 34);
          const num111 = clamp01((f - 44) / 12);
          const head = clamp01((f - 92) / 16);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.pinzaF} kind="photo" z={0} scale={1.5} dim={0.78} tint={V.volt} /></Plane>

              {/* la lámpara desnuda: la única fuente del garaje */}
              <Plane z={-300}>
                <IconPng src={M.icFoco} x={21} y={6} size={112} z={0} opacity={0.82} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "21%", top: 82, width: 760, height: 620, marginLeft: -380,
                  background: `radial-gradient(52% 100% at 50% 0%, ${rgba(V.amber, 0.17)} 0%, rgba(0,0,0,0) 74%)`,
                }} />
              </Plane>

              {/* MATERIAL REAL 1 · LA DE ANTES: entra de la derecha, la mira la luz fría */}
              <Plane z={40}>
                <MediaCard src={M.facturaViejaF} kind="photo" w={706} h={424} x={eio(120, 52, inA)} y={36} z={0}
                  ry={-5} rx={2.2} rot={-3} lit={0.9} litColor={V.sky} label="LA DE ANTES"
                  sheenAt={toCF(18)} radius={9} />
              </Plane>
              <Plane z={110}>
                <Ticker text="$111" x={59} y={pc(392)} size={92} color={V.amber} opacity={num111} />
              </Plane>

              {/* LA COSTURA DEL ACTO 1, ahora acostada: el canto del papel que entra */}
              <Plane z={150}>
                <div style={{
                  position: "absolute", left: "47%", top: 438, width: 706 * inB, height: 4, marginLeft: -353,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.92)} 14%, ${rgba(V.volt, 0.92)} 86%, ${rgba(V.volt, 0)})`,
                  boxShadow: `0 0 30px ${rgba(V.volt, 0.62)}`,
                }} />
              </Plane>

              {/* MATERIAL REAL 2 · LA DE DESPUÉS: entra de la izquierda y se apoya ENCIMA,
                  tapándola justo hasta el total */}
              <Plane z={200}>
                <MediaCard src={M.facturaF} kind="photo" w={706} h={424} x={eio(-22, 47, inB)} y={60} z={0}
                  ry={5} rx={-1.6} rot={2} lit={1} litColor={V.volt} label="LA DE DESPUÉS"
                  sheenAt={toCF(48)} radius={9} />
              </Plane>

              {/* el número que estaba en el display de la pinza aterriza como TOTAL impreso */}
              <Plane z={280}>
                <Ticker text="$44" x={lerp(44, 40, land)} y={lerp(44, pc(690), land)}
                  size={lerp(268, 96, land)} color={V.volt} />
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "93%", textAlign: "center",
                  opacity: head, transform: `translateY(${lerp(16, 0, head).toFixed(1)}px)`,
                }}>
                  <Head size={54} color={V.white}>LA MISMA CASA · EL MISMO MES</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el haz baja sobre la caja y se abre en dos vías ══════════════════ */}
        {acto === 3 && (() => {
          const beam = eio(0, 1, clamp01(f / 26));       // el haz baja y se clava en la caja
          const fork = clamp01((f - 24) / 30);           // las dos vías se abren
          const fillL = eio(0, 1, clamp01((f - 48) / 56));
          const coldR = clamp01((f - 54) / 40);
          const zero = clamp01((f - 88) / 22);
          const cardsIn = clamp01((f - 66) / 28);
          const beamTop = lerp(-40, 300, beam);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.38} dim={0.82} tint={V.volt} /></Plane>

              {/* EL HAZ: la línea del total del acto 2, que bajó y se abrió sobre la caja */}
              <Plane z={-200}>
                <div style={{
                  position: "absolute", left: "50%", top: beamTop, width: lerp(28, 300, beam), height: 480 - beamTop * 0.4,
                  marginLeft: -lerp(28, 300, beam) / 2,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.34)} 0%, ${rgba(V.volt, 0.06)} 78%, rgba(0,0,0,0) 100%)`,
                  clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
                }} />
              </Plane>

              {/* LAS DOS VÍAS: esto es un esquema (dos caminos), va en vector */}
              <Plane z={-60}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <defs>
                      <clipPath id="s1c-via-izq">
                        <path d="M 884 566 L 1022 566 L 486 1016 L 236 944 Z" />
                      </clipPath>
                    </defs>
                    {/* la vía izquierda: se llena de voltio cálido DESDE ABAJO hasta desbordar */}
                    <path d="M 884 566 L 1022 566 L 486 1016 L 236 944 Z"
                      fill={rgba(V.ink1, 0.94)} stroke={rgba(V.amber, 0.7 * fork)} strokeWidth={3} />
                    <g clipPath="url(#s1c-via-izq)">
                      <rect x={200} y={1020 - 470 * fillL} width={880} height={470 * fillL} fill={rgba(V.amber, 0.62)} />
                      <rect x={200} y={1016 - 470 * fillL} width={880} height={6} fill={rgba(V.volt, 0.95)} />
                    </g>
                    {/* la vía derecha: se enfría DESDE ARRIBA */}
                    <path d="M 898 566 L 1036 566 L 1684 944 L 1434 1016 Z"
                      fill={rgba(V.ink1, 0.94)} stroke={rgba(V.sky, 0.65 * fork)} strokeWidth={3} />
                    <path d="M 898 566 L 1036 566 L 1684 944 L 1434 1016 Z"
                      fill={rgba(V.sky, 0.24 * coldR)} />
                  </svg>
                </AbsoluteFill>
                {/* el desborde de la vía izquierda: gotas de voltio que se caen del canto */}
                {fillL > 0.82 && Array.from({ length: 7 }, (_, i) => {
                  const o = rnd(i * 4.3);
                  const sp = clamp01((fillL - 0.82) / 0.18 - o * 0.5);
                  return (
                    <div key={i} style={{
                      position: "absolute", left: 300 + i * 46 + o * 22, top: 946 + sp * (70 + o * 90),
                      width: 8 + o * 7, height: 8 + o * 7, borderRadius: "50%",
                      background: rgba(V.volt, 0.8 * (1 - sp)),
                      boxShadow: `0 0 18px ${rgba(V.volt, 0.6 * (1 - sp))}`,
                    }} />
                  );
                })}
              </Plane>

              {/* MATERIAL REAL: la caja NO se mueve en todo el acto — el que cambia es el camino */}
              <Plane z={160}>
                <MediaCard src={M.cajaF} kind="photo" w={470} h={292} x={50} y={40} z={0}
                  ry={0} rx={1.2} lit={1} litColor={V.bone} label="LA MISMA CAJA" sheenAt={toCF(14)} radius={10} />
              </Plane>

              {/* los dos finales, cada uno con su material real */}
              <Plane z={240}>
                <MediaCard src={M.billeteF} kind="photo" w={344} h={214} x={eio(9, 15, cardsIn)} y={80} z={0}
                  ry={13} lit={1} litColor={V.amber} label="UNA FORTUNA" sheenAt={toCF(78)} radius={8} opacity={cardsIn} />
                <MediaCard src={M.planaF} kind="photo" w={344} h={214} x={eio(91, 85, cardsIn)} y={80} z={0}
                  ry={-13} lit={0.86} litColor={V.sky} label="O NADA" sheenAt={toCF(86)} radius={8} opacity={cardsIn} />
              </Plane>

              {/* el 0 se escribe solo y SE QUEDA QUIETO */}
              <Plane z={320}>
                <div style={{
                  position: "absolute", left: "85%", top: "52%", transform: "translate(-50%,-50%)",
                  clipPath: `inset(0 ${((1 - zero) * 100).toFixed(1)}% 0 0)`,
                }}>
                  <Num size={216} color={V.sky}>0</Num>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
