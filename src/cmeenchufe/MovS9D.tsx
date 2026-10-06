// MovS9D.tsx — MOVIMIENTO S9D · "EL CIERRE"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 4 actos · 1.476.110 → 1.509.360 ms · 998 frames @30.
//
// LA IDEA: la cuenta de Óscar (52) — miró las tablas, hizo la cuenta CON SUS PROPIOS NÚMEROS y armó por
// partes algo que le costó la cuarta parte de la estación cara que estaba por comprar. De ahí sale la
// única moraleja del video: el dinero no se pierde comprando caro, se pierde COMPRANDO DOS VECES.
// Y de ahí, el último plano.
//
// ⛔ ÓSCAR SE RESUELVE SÓLO CON MATERIAL REAL: la pantalla del teléfono con el mensaje, la caja
// precintada de la estación cara, las piezas sueltas ordenadas en el banco al lado, y la mano a lápiz
// escribiendo cifras propias en el margen. NI UNA cara inventada de gente falsa.
//
// ⭐ LA RIMA DEL CIERRE — el último acto es el ÚLTIMO PLANO DEL VIDEO y rima con el primero:
//   el video ABRE con Claudio de noche en su cocina, UNA sola lámpara cálida, la factura en la mano;
//   CIERRA en el garaje, UNA sola lámpara desnuda cálida, LA PINZA en la mano. Misma calidez, misma
//   quietud, mismo hombre solo con un objeto. Cambia el objeto: abre con el PROBLEMA, cierra con la
//   HERRAMIENTA. Por eso el plano final es el CLIP REAL de la pinza a plena luz cálida, la lámina de
//   papel se apoya en el banco y se sale del medio, y lo único que sigue vivo es el cursor.
//
// LA MATERIA QUE CRUZA LAS TRES FRONTERAS: **EL FAJO DE BILLETES**.
//   acto 1 → las cifras a lápiz encienden las filas de la tabla (el dinero todavía es una cuenta);
//   acto 2 → esa cuenta se vuelve un fajo REAL que sube y entra UNA vez en la caja: la caja se enciende;
//   acto 3 → la caja se apaga, se cae, entra otra, y el MISMO fajo vuelve a subir: dos veces;
//   acto 4 → el segundo billete cae sobre el cuaderno y el papel se vuelve el fondo del último plano.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono + una grúa que baja del banco al negro, sigue
// al segundo billete y SE DETIENE en el acto 4 (única vez de toda la sección, `Math.min(g, A4)`).
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch.
// LA LUZ: cálida del banco → negro VOLT → se enfría desde arriba con la segunda compra → TORCH pleno
// en el último plano. El viaje de luz de la sección cierra donde empezó el video: en el calor.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-156   · LA CUENTA DE ÓSCAR    material: CLIP lápiz + CLIP mensaje + CLIP estación en caja
//   entra  cam {grúa +36, plano del banco}       luz {TORCH, key 0.24, int 0.98, cálido creciendo L→R}
//   sale   cam {grúa −10}                        luz {TORCH, key 0.34}
//   ── FRONTERA A ···· LA FILA DE PIEZAS SE APAGA: queda el negro VOLT con el polvo. ········
// ACTO 2 · g364-483 · COMPRAR UNA VEZ       material: CLIP estación en caja (la caja que se enciende)
//   entra  cam {grúa −10, bajando}               luz {negro VOLT, el fajo es la única fuente cálida}
//   sale   cam {grúa −78}                        luz {ámbar del fajo, key 0.4}
//   ── FRONTERA B ···· LA CAJA SE CAE Y ENTRA OTRA: el mismo fajo vuelve a subir. ···········
// ACTO 3 · g483-561 · COMPRAR DOS VECES     material: CLIP estación en caja ×2 (mismo startFrom)
//   entra  cam {grúa −78, siguiendo el billete}  luz {se enfría desde arriba, 55% SKY}
//   sale   cam {grúa −142}                       luz {SKY 70%, las dos marcas en frío}
//   ── FRONTERA C ···· ZOOM AL CUADERNO: la cámara entra en la página y el grano es el fondo. ·
// ACTO 4 · g845-998 · ⭐ EL ÚLTIMO PLANO    material: CLIP último plano con la pinza (a sangre)
//   entra  cam {DETENIDA por primera vez}        luz {TORCH, una sola lámpara desnuda, el resto negro}
//   sale   el cuadro: un hombre solo, una lámpara, la pinza. Y el cursor parpadeando.
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Kick,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 364, A3 = 483, A4 = 845;
const G_END = 998;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4 };

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  bancoF: "img/cmeenchufe/cmee_s8_banco_cuaderno_abre.png",
  lapizV: "broll/cmeenchufe/cmee_s5_lista_propia_lapiz.mp4",
  mensajeV: "broll/cmeenchufe/cmee_s9_mensaje_telefono.mp4",
  estacionV: "broll/cmeenchufe/cmee_s9_estacion_en_caja.mp4",
  piezasV: "broll/cmeenchufe/cmee_s9_piezas_vs_caja.mp4",
  pinzaV: "broll/cmeenchufe/cmee_s9_ultimo_plano_pinza.mp4",
  pinzaF: "img/cmeenchufe/cmee_s9_ultimo_plano_pinza.png",
  cuadernoV: "broll/cmeenchufe/cmee_s9_cuaderno_a_camara.mp4",
  icBillete: "img/cmeenchufe/cmee_ic_billete.png",
  icBombilla: "img/cmeenchufe/cmee_ic_bombillanoche.png",
  icPinza: "img/cmeenchufe/cmee_ic_pinza.png",
};

const PAPER = { hi: "#F7F3E5", mid: "#EDE7D4", lo: "#DDD5BE", ink: "#26281E" };

// ── LA TABLA QUE ÓSCAR RECALCULA CON SUS PROPIOS NÚMEROS ─────────────────────────────────────
// Las cifras tachadas son las de Claudio; las de al lado, las de Óscar. Nunca son las mismas.
const OSCAR: { t: string; mio: string; suyo: string }[] = [
  { t: "Su pico real", mio: "3.400 W", suyo: "1.900 W" },
  { t: "Lo que quiere sostener", mio: "8 kWh", suyo: "3 kWh" },
  { t: "Horas de respaldo", mio: "6 h", suyo: "4 h" },
  { t: "Salidas que necesita", mio: "6", suyo: "3" },
  { t: "Su franja de valle", mio: "6 h", suyo: "7 h" },
  { t: "Lo que termina armando", mio: "—", suyo: "por partes" },
];

// ── LA MARCA VOLTIO (el tilde de "compraste") — esto SÍ es un gráfico ────────────────────────
const Tilde: React.FC<{ x: number; y: number; p: number; color: string; size?: number }> = ({
  x, y, p, color, size = 92,
}) => {
  if (p <= 0) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, marginLeft: -size / 2, marginTop: -size / 2 }}>
      <path d="M 16 52 L 40 76 L 86 22" fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(p)}
        style={{ filter: `drop-shadow(0 0 16px ${rgba(color, 0.7)})` }} />
    </svg>
  );
};

// ── LA CÁMARA · baja del banco al negro, sigue al billete y SE DETIENE en el acto 4 ──────────
const camAt = (g: number) => {
  const gg = Math.min(g, A4);      // el último plano está QUIETO: la cámara se detiene por primera vez
  const base = gcam(gg, { z0: -180, z1: 340, panX: -128, panY: 30, ry: -5.6, rx: 1.9, dur: G_END });
  const crane = interpolate(gg, [0, 120, A2, A2 + 90, A3, A3 + 70, A4], [36, -10, -26, -78, -96, -142, -164], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1),
  });
  return `${base.transform} translateY(${crane.toFixed(1)}px)`;
};

export const MovS9D: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto
  const toCF = (t: number) => cf - f + t;    // mi frame → reloj interno de las primitivas

  // LA LUZ: cálida del banco → negro VOLT → frío de la segunda compra → TORCH pleno del cierre.
  const cool = interpolate(gFrame, [A3, A3 + 56, A4 - 40, A4 + 30], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(gFrame, [0, A2, A3, A4, G_END], [0.24, 0.4, 0.5, 0.3, 0.26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A2 + 80, A3 + 60, A4, G_END], [0.98, 0.5, 0.72, 0.82, 1.0, 1.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, A4, G_END], [0.6, 0.86, 0.7, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: una sola vez, fuera del switch ─────────────────────────────────── */}
      <VoltAtmos tint={light(cool, "torch", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la cuenta de Óscar, con SUS números ════════════════════════════════ */}
        {acto === 1 && (() => {
          const abre = clamp01(f / 30);
          const warmSweep = clamp01((f - 10) / 96);
          return (
            <>
              <Plane z={-620}>
                <PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.28} dim={0.74} tint={V.torch} />
              </Plane>

              {/* la luz cálida del banco crece de izquierda a derecha y no se remonta */}
              <Plane z={-380}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: `${(warmSweep * 118).toFixed(1)}%`,
                  background: `linear-gradient(90deg, ${rgba(V.torch, 0.2)} 0%, ${rgba(V.amber, 0.09)} 62%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>

              {/* LAS TRES HOJAS DE LA GUÍA, abiertas en abanico desde la izquierda */}
              <Plane z={40}>
                {[2, 1, 0].map((k) => {
                  const p = clamp01((f - k * 7) / 26);
                  const rot = eio(-2, -13 + k * 5.5, p);
                  return (
                    <div key={k} style={{
                      position: "absolute", left: 300 - k * 30, top: 176 - k * 12, width: 636, height: 716,
                      marginLeft: -318, opacity: p,
                      transform: `rotate(${rot.toFixed(2)}deg) translateY(${((1 - p) * 40).toFixed(1)}px)`,
                      borderRadius: 6, overflow: "hidden",
                      background: `linear-gradient(163deg, ${PAPER.hi} 0%, ${PAPER.mid} 60%, ${PAPER.lo} 100%)`,
                      boxShadow: `0 34px 76px ${rgba(V.ink0, 0.84)}`,
                      zIndex: 10 - k,
                    }}>
                      <div style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "multiply", backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px" }} />
                      {k === 0 && (
                        <>
                          <div style={{ position: "absolute", left: 38, top: 34, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 38, color: PAPER.ink }}>
                            HAZ LA CUENTA
                          </div>
                          <div style={{ position: "absolute", left: 38, top: 82, fontFamily: F_BODY, fontWeight: 500, fontSize: 23, color: "rgba(38,40,30,0.5)" }}>
                            con TUS números, no con los míos
                          </div>
                          <div style={{ position: "absolute", left: 38, right: 38, top: 122, height: 2, background: "rgba(38,40,30,0.26)" }} />
                          {OSCAR.map((o, i) => {
                            const on = clamp01((f - (34 + i * 15)) / 14);
                            return (
                              <div key={o.t} style={{ position: "absolute", left: 24, right: 24, top: 146 + i * 88, height: 78 }}>
                                <div style={{
                                  position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4,
                                  background: `linear-gradient(90deg, rgba(200,240,0,${(0.28 * on).toFixed(3)}) 0%, rgba(200,240,0,0) 92%)`,
                                  borderLeft: `5px solid rgba(110,140,0,${(0.9 * on).toFixed(3)})`,
                                }} />
                                <div style={{
                                  position: "absolute", left: 18, top: 8, fontFamily: F_BODY, fontWeight: 600, fontSize: 25,
                                  color: on > 0.3 ? PAPER.ink : "rgba(38,40,30,0.44)",
                                }}>{o.t}</div>
                                {/* la cifra de Claudio, tachada suavemente al costado */}
                                <div style={{
                                  position: "absolute", left: 18, top: 40, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26,
                                  color: "rgba(38,40,30,0.34)", textDecoration: "line-through",
                                }}>{o.mio}</div>
                                {/* la de Óscar, escrita a lápiz en el margen */}
                                <div style={{
                                  position: "absolute", right: 18, top: 30, opacity: on,
                                  transform: `translateY(${((1 - on) * 12).toFixed(1)}px) rotate(${(-2.4 + rnd(i * 3.1) * 4).toFixed(2)}deg)`,
                                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color: "#3F5200",
                                }}>{o.suyo}</div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  );
                })}
              </Plane>

              {/* EL MATERIAL REAL DE ÓSCAR: el lápiz, el mensaje del teléfono y la caja precintada */}
              <Plane z={260}>
                <MediaCard src={M.lapizV} kind="video" w={412} h={252} x={eio(80, 72, abre)} y={28} z={0}
                  ry={-13} startFrom={12} lit={1} litColor={V.volt} label="SUS PROPIOS NÚMEROS"
                  sheenAt={toCF(18)} radius={10} opacity={abre} />
                {f > 40 && (
                  <MediaCard src={M.mensajeV} kind="video" w={372} h={232} x={eio(94, 84, clamp01((f - 40) / 26))} y={62} z={0}
                    ry={-9} startFrom={14} lit={1} litColor={V.amber} label="ÓSCAR, 52 AÑOS"
                    sheenAt={toCF(52)} radius={10} opacity={clamp01((f - 40) / 26)} />
                )}
                {f > 78 && (
                  <MediaCard src={M.estacionV} kind="video" w={340} h={210} x={63} y={eio(96, 86, clamp01((f - 78) / 26))} z={0}
                    ry={7} startFrom={10} lit={0.42} litColor={V.sky} label="LA ESTACIÓN CARA"
                    sheenAt={toCF(92)} radius={9} opacity={clamp01((f - 78) / 26)} />
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el fajo sube y entra UNA vez: la caja se enciende ══════════════════ */}
        {acto === 2 && (() => {
          const sube = clamp01((f - 12) / 44);
          const entra = clamp01((f - 50) / 14);
          const tick = clamp01((f - 62) / 22);
          return (
            <>
              {/* el negro VOLT con el polvo del garaje todavía suspendido (la fila de piezas se apagó) */}
              <Plane z={-620}>
                <PhotoPlane src={M.piezasV} kind="video" z={0} scale={1.3} dim={0.93} tint={V.torch} startFrom={18} />
              </Plane>
              <Plane z={120}>
                <MediaCard src={M.estacionV} kind="video" w={548} h={330} x={50} y={44} z={0}
                  ry={-6} startFrom={10} lit={0.24 + 0.76 * entra} litColor={V.amber}
                  label="COMPRAR CARO" sheenAt={toCF(52)} radius={11} />
                {/* la caja encendida se QUEDA encendida */}
                <div style={{
                  position: "absolute", left: "50%", top: "44%", width: 720, height: 480, marginLeft: -360, marginTop: -240,
                  borderRadius: "50%", opacity: entra,
                  background: `radial-gradient(circle, ${rgba(V.amber, 0.3)} 0%, rgba(0,0,0,0) 66%)`, filter: "blur(12px)",
                }} />
              </Plane>
              {/* EL FAJO: entra desde abajo, en cálido, y entra UNA sola vez */}
              <Plane z={300}>
                <IconPng src={M.icBillete} x={50} y={lerp(112, 47, eio(0, 1, sube))} size={lerp(190, 96, entra)}
                  z={0} opacity={1 - entra * 0.96} rot={lerp(-14, -3, sube)} glow={V.amber} />
              </Plane>
              <Plane z={340}>
                <Tilde x={960} y={790} p={tick} color={V.volt} size={104} />
                {tick > 0.6 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 862, textAlign: "center", opacity: clamp01((tick - 0.6) / 0.4) }}>
                    <Kick color={V.volt}>UNA VEZ</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · la caja se cae, entra otra, y el fajo vuelve a subir: DOS VECES ════ */}
        {acto === 3 && (() => {
          const cae = clamp01(f / 22);
          const entra2 = clamp01((f - 14) / 24);
          const sube2 = clamp01((f - 22) / 30);
          const dentro = clamp01((f - 48) / 12);
          const dosTicks = clamp01((f - 54) / 20);
          return (
            <>
              <Plane z={-620}>
                <PhotoPlane src={M.piezasV} kind="video" z={0} scale={1.32} dim={0.94} tint={V.sky} startFrom={18} />
              </Plane>
              {/* la luz cálida del acto 2 se enfría DESDE ARRIBA */}
              <Plane z={-300}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 0, height: eio(0, 720, cae),
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.2)} 0%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>
              <Plane z={120}>
                {/* la caja del acto 2 se apaga y se cae hacia el borde inferior */}
                <MediaCard src={M.estacionV} kind="video" w={548} h={330} x={eio(50, 42, cae)} y={eio(44, 128, cae)} z={0}
                  ry={-6} rot={eio(0, 13, cae)} startFrom={10} lit={1 - cae} litColor={V.amber} radius={11} opacity={1 - cae * 0.9} />
                {/* EN SU LUGAR ENTRA OTRA: mismo clip, mismo startFrom — es literalmente la misma compra */}
                {entra2 > 0 && (
                  <MediaCard src={M.estacionV} kind="video" w={548} h={330} x={eio(122, 56, entra2)} y={41} z={0}
                    ry={-6} startFrom={10} lit={0.24 + 0.76 * dentro} litColor={V.sky}
                    label="Y COMPRAR OTRA VEZ" sheenAt={toCF(30)} radius={11} opacity={entra2} />
                )}
              </Plane>
              {/* el MISMO fajo vuelve a subir desde abajo y entra por segunda vez */}
              <Plane z={300}>
                <IconPng src={M.icBillete} x={56} y={lerp(114, 44, eio(0, 1, sube2))} size={lerp(190, 96, dentro)}
                  z={0} opacity={1 - dentro * 0.96} rot={lerp(-14, -3, sube2)} glow={V.amber} />
              </Plane>
              {/* la marca única se duplica: las dos quedan enfrentadas, en frío */}
              <Plane z={340}>
                <Tilde x={856} y={790} p={1} color={rgba(V.sky, 0.9)} size={104} />
                <Tilde x={1064} y={790} p={dosTicks} color={rgba(V.sky, 0.9)} size={104} />
                {dosTicks > 0.5 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 862, textAlign: "center", opacity: clamp01((dosTicks - 0.5) / 0.5) }}>
                    <Kick color={V.sky}>DOS VECES</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* ══════ ACTO 4 · ⭐ EL ÚLTIMO PLANO — la cámara SE DETIENE y el video rima ══════════ */}
      {acto === 4 && (() => {
        const paperIn = clamp01(f / 26);
        const resta = clamp01((f - 22) / 42);
        const campo = clamp01((f - 72) / 30);
        // la lámina se apoya en el banco y se sale del medio: el último plano es EL HOMBRE Y LA PINZA
        const asienta = clamp01((f - 100) / 44);
        const cursor = Math.floor(f / 15) % 2 === 0 ? 1 : 0;
        const BARS: { lbl: string; val: string; c: string; h: number }[] = [
          { lbl: "TU PUNTA", val: "34", c: V.sky, h: 152 },     // heredadas del Movimiento S9-B
          { lbl: "TU VALLE", val: "6", c: V.volt, h: 46 },
        ];
        return (
          <>
            {/* el clip REAL a sangre: el garaje, una sola lámpara desnuda, la pinza en la mano */}
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <PhotoPlane src={M.pinzaV} kind="video" z={0} scale={lerp(1.2, 1.1, asienta)}
                dim={lerp(0.66, 0.3, asienta)} tint={V.torch} startFrom={8} />
            </AbsoluteFill>
            {/* LA LÁMPARA DESNUDA: la misma calidez del primer plano del video */}
            <AbsoluteFill style={{
              background: `radial-gradient(56% 44% at 50% -6%, ${rgba(V.torch, 0.26)} 0%, rgba(0,0,0,0) 64%)`,
            }} />
            <AbsoluteFill style={{
              background: `radial-gradient(112% 92% at 50% 46%, rgba(0,0,0,0) 34%, ${rgba(V.ink0, 0.68)} 100%)`,
            }} />
            <IconPng src={M.icBombilla} x={50} y={2} size={92} z={0} opacity={0.44} glow={V.torch} />

            {/* la página del cuaderno: el grano del papel es el fondo de la resta */}
            <div style={{
              position: "absolute",
              left: lerp(430, 1330, asienta), top: lerp(150, 690, asienta),
              width: 1060, height: 640,
              transform: `scale(${lerp(1, 0.42, asienta).toFixed(3)}) rotate(${lerp(-1.4, 7.5, asienta).toFixed(2)}deg) translateY(${((1 - paperIn) * 40).toFixed(1)}px)`,
              transformOrigin: "50% 100%",
              opacity: paperIn,
              borderRadius: 6, overflow: "hidden",
              background: `linear-gradient(163deg, ${PAPER.hi} 0%, ${PAPER.mid} 58%, ${PAPER.lo} 100%)`,
              boxShadow: `0 40px 90px ${rgba(V.ink0, 0.88)}`,
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.06, mixBlendMode: "multiply", backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.5) 0% 25%, rgba(255,255,255,.5) 0% 50%)", backgroundSize: "3px 3px" }} />
              <div style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 51px, rgba(80,96,120,0.45) 51px, rgba(80,96,120,0.45) 52px)" }} />
              <div style={{ position: "absolute", left: 54, top: 34, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color: PAPER.ink }}>
                TU PUNTA MENOS TU VALLE
              </div>
              {/* LA RESTA se completa sola, con las dos barras heredadas de S9-B apoyadas en su cifra */}
              {BARS.map((b, i) => {
                const p = clamp01((resta - i * 0.22) / 0.5);
                return (
                  <div key={b.lbl} style={{ position: "absolute", left: 96 + i * 330, bottom: 250, opacity: p }}>
                    <div style={{ width: 118, height: b.h * p, background: `linear-gradient(180deg, ${rgba(b.c, 0.95)}, ${rgba(b.c, 0.6)})`, borderRadius: 4, boxShadow: `0 10px 26px ${rgba(V.ink0, 0.4)}` }} />
                    <div style={{ marginTop: 12, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 0.94, color: PAPER.ink }}>
                      {b.val}<span style={{ fontSize: 34 }}>¢</span>
                    </div>
                    <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.8, color: "rgba(38,40,30,0.5)" }}>{b.lbl}</div>
                  </div>
                );
              })}
              <div style={{
                position: "absolute", left: 254, bottom: 316, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 66,
                color: "rgba(38,40,30,0.55)", opacity: clamp01((resta - 0.36) / 0.3),
              }}>−</div>
              {/* el renglón vacío: no se completa solo, lo completa el que está mirando */}
              <div style={{
                position: "absolute", left: 96, right: 96, bottom: 178, height: 3,
                background: "rgba(38,40,30,0.42)", transform: `scaleX(${clamp01((resta - 0.6) / 0.4).toFixed(3)})`, transformOrigin: "left",
              }} />
            </div>

            {/* el renglón vacío se estira y ES el campo de comentario. El papel se sigue viendo detrás. */}
            {campo > 0 && (
              <div style={{
                position: "absolute", left: 430, bottom: 108, width: eio(360, 1060, campo), height: 96,
                marginLeft: 0, opacity: campo,
                borderRadius: 10,
                background: `linear-gradient(180deg, ${rgba(V.ink0, 0.62)}, ${rgba(V.ink0, 0.78)})`,
                border: `1.5px solid ${rgba(V.volt, 0.36)}`,
                boxShadow: `0 18px 46px ${rgba(V.ink0, 0.7)}`,
              }}>
                <div style={{
                  position: "absolute", left: 30, top: 26, width: 3, height: 44,
                  background: rgba(V.volt, 0.95 * cursor), boxShadow: `0 0 14px ${rgba(V.volt, 0.7 * cursor)}`,
                }} />
                <div style={{
                  position: "absolute", right: 26, top: 26, padding: "8px 22px", borderRadius: 7,
                  border: `1.5px solid ${rgba(V.volt, 0.6)}`,
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3, color: V.volt,
                }}>COMENTAR</div>
              </div>
            )}

            {/* la firma del canal: la pinza. Abre con el problema, cierra con la herramienta. */}
            {asienta > 0.35 && (
              <div style={{ position: "absolute", left: 96, bottom: 130, opacity: clamp01((asienta - 0.35) / 0.5) }}>
                <IconPng src={M.icPinza} x={7} y={-6} size={86} z={0} opacity={0.5} glow={V.torch} />
                <div style={{ marginTop: 74, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.6, color: rgba(V.bone, 0.66) }}>
                  SIGO AQUÍ, MIDIENDO
                </div>
              </div>
            )}

            {/* el polvo del garaje: lo último que se mueve, además del cursor */}
            <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.44 }}>
              {Array.from({ length: 20 }, (_, i) => {
                const yy = (rnd(i * 4.3) * 116 - (f * (0.28 + rnd(i * 6.7) * 0.7)) / 16) % 116;
                return (
                  <div key={i} style={{
                    position: "absolute", left: `${(rnd(i * 9.7) * 100).toFixed(2)}%`, top: `${((yy + 116) % 116 - 8).toFixed(2)}%`,
                    width: 3, height: 3, borderRadius: "50%", background: rgba(V.torch, 0.2 + rnd(i * 2.6) * 0.22),
                  }} />
                );
              })}
            </AbsoluteFill>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
