// MovS6A.tsx — MOVIMIENTO S6A · "EL CABLE SUICIDA Y LOS TRES ERRORES QUE TIRAN EL DINERO"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 11 actos · 785.870 → 953.730 ms · 5036 frames @30.
//
// LA IDEA: la corriente no se queda adentro de la casa. Sale. Y cuando sale, del otro lado hay un
// tipo con guantes trabajando sobre una línea que él mismo cortó. Después, los tres errores que no
// matan pero te hacen tirar el dinero: la química equivocada, la regleta vieja y taparla.
//
// LA MATERIA QUE CRUZA LAS DIEZ FRONTERAS: **EL HILO DE CORRIENTE**.
//   acto 1 → sube por dentro de las paredes y enciende la casa habitación por habitación;
//   acto 2 → ese mismo hilo baja del techo y ES el cable de dos machos colgando;
//   acto 3 → se apaga hasta quedar sólo su contorno y el led verde de la caja (la respiración);
//   acto 4 → vuelve la MISMA casa, pero el hilo corre al revés: sale a la calle;
//   acto 5 → llega al poste y entra en el transformador; arriba sale mucho más grueso;
//   acto 6 → se rompe en cuatro tachados que se cruzan en el centro en una sola X;
//   acto 7 → de la caja gris salen TRES hilos: dos llegan al mismo congelador, uno se enfría;
//   acto 8 → el hilo se pone de pie y es la barra de 6.000 ciclos que se sale del cuadro;
//   acto 9 → el hilo se mete DENTRO del cable y choca contra un cuello finito de cobre;
//   acto 10 → se abre en cuatro hilos que suben por los costados de la caja que sí respira;
//   acto 11 → se estira y se convierte en la línea de una fila de la tabla, pegada en la pared.
//
// UNA cámara: `camAt(gFrame)`. Un solo `gcam` monótono (z −260 → +620) + una grúa continua que
// TREPA la casa, se queda en el cable, sale a la calle, SUBE EL POSTE (+600), baja al banco,
// vuelve a subir persiguiendo la barra de 6.000 (+700) y baja al plano ancho final.
// Como es función pura de `gFrame`, la cámara sigue viajando durante los clips reales que van entre
// acto y acto — y entre el acto 7 y el 8 hay 22,7 s de material real: el acto 8 empieza exactamente
// donde la cámara quedó. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: VOLT (la casa medida) → se enfría a SKY a medida que la corriente SE VA hacia la compañía
// (pleno en el poste) → vuelve a templarse en el garaje → luz de trabajo blanca en el plano final.
//
// ⚠️ EL SALTO DEL BUCLE DEL AVATAR (820.150 → 825.350 ms) NO cae en ningún acto de este movimiento:
//    acto 4 termina en 815.950 y acto 5 empieza en 830.750. Esa ventana la tapa el CLIP
//    `cmee_s6_poste_operario_wide`. De todos modos los 11 actos son opacos a pantalla completa
//    (`VoltAtmos` pinta `V.ink0` a sangre): ninguno deja ver el fondo.
//
// ⛔ CERO fundidos entre actos · cero Math.random/Date · cero backdrop-filter · cero texto de otro video.
// ⛔ Toda tarjeta flotante lleva MATERIAL REAL adentro (40 `MediaCard` en total, rutas verificadas).
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-87 · "alimento toda la casa de una"          material: 4 CLIPS/FOTO (las 4 habitaciones)
//   entra  cam {DENTRO del tomacorriente, push 2.6 en 17%/81%} luz {VOLT, key 0.18, int 0.95}
//   sale   cam {push 1, grúa +70, casa entera en corte}        luz {VOLT, key 0.20}
//   ── FRONTERA A ···· MATCH-MOVE: el hilo que llegó al techo sigue bajando y ya es el cable. ····
// ACTO 2 · g223-295 · "y el nombre es CABLE SUICIDA"       material: CLIP cable_dos_machos + 2× patitas_macro
//   entra  cam {grúa +96, clavada en el cable}                 luz {VOLT apagándose, int 0.62}
//   sale   cam {grúa +112, misma deriva}                       luz {ámbar quemado del rótulo}
//   ── FRONTERA B ···· APAGÓN SELECTIVO: baja la luz, queda el contorno. Mismo polvo, misma deriva.
// ACTO 3 · g607-673 · respiración (silencio de 3 s)        material: CLIP led_verde + cable en contorno
//   entra  cam {grúa +122, quieta salvo deriva}                luz {int 0.42, floor 0.78}
//   sale   cam {grúa +126}                                     luz {sólo el led verde}
//   ── FRONTERA C ···· LA CÁMARA ATRAVIESA LA PARED: vuelve el MISMO corte de casa del acto 1. ···
// ACTO 4 · g797-902 · "esa corriente sale a la calle"      material: 4 habitaciones + medidor + acometida
//   entra  cam {grúa +140, casa en corte, idéntica al acto 1}  luz {frío 0.55 desde ARRIBA}
//   sale   cam {grúa +46, siguiendo el hilo hacia arriba-der}  luz {frío 0.7}
//   ── FRONTERA D ···· MATCH-MOVE: la cámara sigue al hilo por la acometida y trepa el poste. ····
// ACTO 5 · g1346-1406 · "se come miles de voltios"         material: CLIP guantes_linea + CLIP acometida
//   entra  cam {grúa +520, arriba del poste}                   luz {SKY pleno, key 0.80}
//   sale   cam {grúa +600, poste en silueta, naranja de sodio} luz {blanqueo y vuelta al sodio}
//   ── FRONTERA E ···· EL BLANQUEO deja cuatro trazos ardiendo en las esquinas. ·················
// ACTO 6 · g1521-1553 · cierre de las cuatro negaciones    material: 4 FOTOS no_nunca/una_vez/5min/cuidado
//   entra  cam {grúa +566}                                     luz {int 0.7}
//   sale   cam {grúa +552, X apagándose}                       luz {negro VOLT}
//   ── FRONTERA F ···· MATCH-CUT DE ESCALA: la X se cierra y la cámara ya está sobre la regleta. ·
// ACTO 7 · g2083-2161 · "no mata a nadie"                  material: caja + transferencia + regleta + 2× congelador + cable
//   entra  cam {grúa +180, altura del banco}                   luz {frío bajando a 0.35}
//   sale   cam {grúa +168, inclinada al ramal muerto}          luz {VOLT templado}
//   ── FRONTERA G ···· EL HILO SE PARA DE CANTO y es la barra del acto 8. ······················
// ACTO 8 · g2843-3101 · "6.000 ciclos = 16 años"           material: celdas_hinchadas + etiqueta_lifepo4 + caja + calendario
//   entra  cam {grúa +40, a ras del piso}                      luz {VOLT, key 0.36}
//   sale   cam {grúa +700, PERSIGUIENDO la barra fuera de cuadro} luz {int 1.0}
//   ── FRONTERA H ···· ZOOM-THROUGH: la cámara entra por el enchufe de la regleta vieja. ·······
// ACTO 9 · g3239-3333 · "chupan mucha corriente"           material: regleta_vieja + cable_cobre (túnel) + directo_pared
//   entra  cam {push 2.6 en 36%/52%, DENTRO del cable}         luz {ámbar → rojo en el cuello}
//   sale   cam {push 1, saliendo por el otro extremo}          luz {vuelve la luz del garaje}
//   ── FRONTERA I ···· BARRIDO DE MATERIAL: el caudal adelgazado se abre en dos cajas. ·········
// ACTO 10 · g4028-4148 · "11 años contra cuatro"           material: caja_en_mueble + palmo_de_aire + rejillas_calor
//   entra  cam {grúa +300}                                     luz {VOLT, ámbar encerrado a la izq}
//   sale   cam {grúa +240, INCLINADA a la derecha (roll 2,2°)} luz {los cuatro hilos se van del cuadro}
//   ── FRONTERA J ···· EL HILO SE ESTIRA y se convierte en la línea de una fila de la tabla. ···
// ACTO 11 · g4929-5036 · "mira esa tabla antes que este video"  material: dos_calibres + led_verde + pared real
//   entra  cam {pull-back 1.7 → 1, grúa +80}                   luz {luz de trabajo BLANCA de frente}
//   sale   cam {sigue derivando hacia atrás, nunca se detiene}  luz {pareja, plano ancho}
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 223, A3 = 607, A4 = 797, A5 = 1346, A6 = 1521;
const A7 = 2083, A8 = 2843, A9 = 3239, A10 = 4028, A11 = 4929;
const G_END = 5036;
const START: Record<number, number> = {
  1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7, 8: A8, 9: A9, 10: A10, 11: A11,
};

const pcX = (px: number) => (px / 1920) * 100;   // px horizontales → % de pantalla
const pcY = (px: number) => (px / 1080) * 100;   // px verticales   → % de pantalla

// ── EL MATERIAL REAL (todas las rutas verificadas en disco) ──────────────────────────────────
const M = {
  // la casa por dentro (actos 1 y 4)
  cocinaV: "broll/cmeenchufe/cmee_s7_congelador_arranca.mp4",
  salaV: "broll/cmeenchufe/cmee_s7_sala_tele_noche.mp4",
  banoV: "broll/cmeenchufe/cmee_s7_enchufa_calentador.mp4",
  cuartoF: "img/cmeenchufe/cmee_s7_router_repisa.png",
  fachadaF: "img/cmeenchufe/cmee_s1_fachada_noche.png",
  medidorV: "broll/cmeenchufe/cmee_s4_medidor_digitos.mp4",
  acometidaV: "broll/cmeenchufe/cmee_s6_acometida_calle.mp4",
  // el cable suicida (actos 2, 3, 7)
  cableV: "broll/cmeenchufe/cmee_s6_cable_dos_machos.mp4",
  patitasV: "broll/cmeenchufe/cmee_s6_patitas_macro.mp4",
  sostieneF: "img/cmeenchufe/cmee_s6_sostiene_cable.png",
  ledV: "broll/cmeenchufe/cmee_s5_led_verde_penumbra.mp4",
  // el poste (acto 5)
  guantesV: "broll/cmeenchufe/cmee_s6_guantes_linea.mp4",
  posteF: "img/cmeenchufe/cmee_s8_espalda_poste.png",
  // las cuatro negaciones (acto 6)
  noNuncaF: "img/cmeenchufe/cmee_s6_no_nunca.png",
  noUnaVezF: "img/cmeenchufe/cmee_s6_no_una_vez.png",
  noCincoF: "img/cmeenchufe/cmee_s6_no_cinco_min.png",
  noCuidadoF: "img/cmeenchufe/cmee_s6_no_con_cuidado.png",
  guanteF: "img/cmeenchufe/cmee_s6_guante_no_tocar.png",
  // los tres caminos (acto 7)
  cajaV: "broll/cmeenchufe/cmee_s2_palma_sobre_caja.mp4",
  transferV: "broll/cmeenchufe/cmee_s6_transferencia_manija.mp4",
  regletaV: "broll/cmeenchufe/cmee_s6_regleta_a_caja.mp4",
  // los ciclos (acto 8)
  celdasV: "broll/cmeenchufe/cmee_s6_celdas_hinchadas.mp4",
  etiquetaV: "broll/cmeenchufe/cmee_s6_etiqueta_lifepo4.mp4",
  calendarioF: "img/cmeenchufe/cmee_s8_calendario_hojas.png",
  // el cuello del cable (acto 9)
  regletaViejaV: "broll/cmeenchufe/cmee_s6_regleta_vieja.mp4",
  cobreV: "broll/cmeenchufe/cmee_s4_cable_cobre.mp4",
  directoV: "broll/cmeenchufe/cmee_s6_directo_pared.mp4",
  // el aire alrededor (acto 10)
  enMuebleV: "broll/cmeenchufe/cmee_s6_caja_en_mueble.mp4",
  palmoV: "broll/cmeenchufe/cmee_s6_palmo_de_aire.mp4",
  rejillasV: "broll/cmeenchufe/cmee_s6_rejillas_calor.mp4",
  // la pared de las hojas (acto 11)
  calibresV: "broll/cmeenchufe/cmee_s6_dos_calibres.mp4",
  paredF: "img/cmeenchufe/cmee_s6_senala_pared_hojas.png",
  // íconos
  icCaja: "img/cmeenchufe/cmee_ic_caja.png",
  icEnchufe: "img/cmeenchufe/cmee_ic_enchufe.png",
  icMedidor: "img/cmeenchufe/cmee_ic_medidor.png",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
};

// ── LA CÁMARA · una sola función de gFrame, que nunca vuelve a cero ──────────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -260, z1: 620, panX: -170, panY: -34, ry: -9, rx: 3, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): casa → cable → calle → POSTE → banco → barra → plano ancho.
  const crane = interpolate(
    g,
    [0, 87, 223, 295, 607, 673, 797, 902, 1346, 1406, 1521, 1553, 2083, 2161,
      2843, 2953, 3023, 3101, 3239, 3333, 4028, 4148, 4929, 5036],
    [0, 70, 96, 112, 122, 126, 140, 46, 520, 600, 566, 552, 180, 168,
      40, 110, 430, 700, 660, 600, 300, 240, 80, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ROLL: la cámara se va inclinando y en el acto 10 queda caída a la derecha. No vuelve a cero.
  const roll = interpolate(g, [0, 1346, 2843, 4028, 4148, G_END], [0, -1.2, -0.4, 0.2, 2.2, 1.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  // TRES EMPUJES que no se pisan en el tiempo: salida del tomacorriente · entrada al cable · retroceso final.
  const pA = interpolate(g, [0, 44], [2.6, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.32, 0, 0.3, 1),
  });
  const pB = interpolate(g, [A8 + 258, A9 - 16, A9 + 20, A9 + 62, A9 + 94], [1, 1, 2.6, 2.4, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const pC = interpolate(g, [A10 + 120, A11 - 8, A11 + 18, A11 + 74], [1, 1.7, 1.62, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.28, 0, 0.28, 1),
  });
  const wA = pA - 1, wB = pB - 1, wC = pC - 1;
  const ws = wA + wB + wC;
  const fx = ws > 0.001 ? (17 * wA + 36 * wB + 50 * wC) / ws : 50;
  const fy = ws > 0.001 ? (81 * wA + 52 * wB + 48 * wC) / ws : 50;
  const push = pA * pB * pC;
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotate(${roll.toFixed(3)}deg) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── EL HILO DE CORRIENTE — esto SÍ es un gráfico (un camino), va en vector ───────────────────
const Wire: React.FC<{
  d: string; p: number; color?: string; w?: number; flow?: boolean; speed?: number; op?: number;
}> = ({ d, p, color = V.volt, w = 6, flow = true, speed = 1, op = 1 }) => {
  const frame = useCurrentFrame();
  if (p <= 0.002) return null;
  return (
    <>
      <path
        d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={op}
        style={{ filter: `drop-shadow(0 0 ${(w * 2.4).toFixed(1)}px ${rgba(color, 0.72)})` }}
      />
      {flow && p > 0.97 && (
        <path
          d={d} fill="none" stroke={rgba(V.white, 0.92)} strokeWidth={Math.max(1.6, w * 0.34)}
          strokeLinecap="round" pathLength={1} strokeDasharray="0.028 0.11"
          strokeDashoffset={-((frame * speed) / 90)} opacity={0.5 * op}
        />
      )}
    </>
  );
};

// tablero SVG a escala de la comp: para los hilos y los tachados
const Board: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {children}
    </svg>
  </AbsoluteFill>
);

// ── LA CASA EN CORTE — la MISMA geometría en el acto 1 y en el acto 4 (match-cut exacto) ─────
const HOUSE = { l: 300, r: 1620, top: 320, bot: 880, apexX: 960, apexY: 118 };
type Room = { cx: number; cy: number; w: number; h: number; src: string; kind: "video" | "photo"; label: string };
const ROOMS: Room[] = [
  { cx: 630, cy: 730, w: 520, h: 190, src: M.cocinaV, kind: "video", label: "COCINA" },
  { cx: 1292, cy: 730, w: 520, h: 190, src: M.salaV, kind: "video", label: "SALA" },
  { cx: 632, cy: 470, w: 520, h: 180, src: M.banoV, kind: "video", label: "BAÑO" },
  { cx: 1292, cy: 470, w: 520, h: 180, src: M.cuartoF, kind: "photo", label: "CUARTO" },
];
// el casco de la casa: hormigón oscuro, no un rectángulo plano
const HouseShell: React.FC<{ tint: string }> = ({ tint }) => (
  <>
    <div style={{
      position: "absolute", left: HOUSE.l, top: HOUSE.top, width: HOUSE.r - HOUSE.l, height: HOUSE.bot - HOUSE.top,
      background: `linear-gradient(180deg, ${rgba(V.ink2, 0.98)} 0%, ${rgba(V.ink1, 1)} 100%)`,
      border: `2px solid ${rgba(tint, 0.34)}`,
      boxShadow: `0 40px 90px ${rgba(V.ink0, 0.9)}, inset 0 0 120px ${rgba(V.ink0, 0.8)}`,
    }} />
    <div style={{
      position: "absolute", left: HOUSE.l - 40, top: HOUSE.apexY, width: HOUSE.r - HOUSE.l + 80, height: HOUSE.top - HOUSE.apexY,
      background: `linear-gradient(180deg, ${rgba(tint, 0.14)} 0%, ${rgba(V.ink1, 1)} 70%)`,
      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
      boxShadow: `0 20px 60px ${rgba(V.ink0, 0.9)}`,
    }} />
    {/* el piso entre plantas y el muro central: la casa tiene ESPESOR */}
    <div style={{ position: "absolute", left: HOUSE.l, top: 596, width: HOUSE.r - HOUSE.l, height: 20, background: rgba(V.ink0, 0.92), boxShadow: `0 2px 0 ${rgba(tint, 0.16)}` }} />
    <div style={{ position: "absolute", left: 950, top: HOUSE.top, width: 20, height: HOUSE.bot - HOUSE.top, background: rgba(V.ink0, 0.92) }} />
  </>
);

export const MovS6A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;    // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A2, A4, A5, A7, A8, A10, G_END], [0.18, 0.26, 0.55, 0.8, 0.5, 0.36, 0.3, 0.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [0, A2, A4, A5, A7, A8, G_END], [0, 0.1, 0.55, 1, 0.35, 0.12, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A3, A3 + 66, A4, A5, A5 + 60, A6, A7, A8, A9, A10, A11, G_END], [0.95, 0.62, 0.42, 0.4, 0.92, 1.15, 1.2, 0.7, 0.95, 1, 0.9, 1, 1.1, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A3, A4, A5, A8, A11, G_END], [0.55, 0.78, 0.62, 0.5, 0.58, 0.44, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const tint = light(cool, "volt", "sky");

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA sola vez, fuera del switch. Opaca a sangre (V.ink0). ── */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la casa en corte: el hilo sube y enciende habitación por habitación ═══ */}
        {acto === 1 && (() => {
          const P = [
            clamp01((f - 0) / 14),   // tronco por la pared exterior
            clamp01((f - 12) / 14),  // → cocina
            clamp01((f - 24) / 14),  // → sala
            clamp01((f - 36) / 10),  // → muro central hacia arriba
            clamp01((f - 44) / 14),  // → baño
            clamp01((f - 54) / 14),  // → cuarto
          ];
          const on = [P[1], P[2], P[4], P[5]];
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.fachadaF} kind="photo" z={0} scale={1.34} dim={0.8} tint={V.volt} /></Plane>
              <Plane z={-120}><HouseShell tint={V.volt} /></Plane>
              {/* la sombra de la caja gris proyectada en la pared del garaje, abajo a la izquierda */}
              <Plane z={-180}>
                <div style={{
                  position: "absolute", left: 40, top: 780, width: 420, height: 300,
                  background: `radial-gradient(60% 60% at 40% 50%, ${rgba(V.ink0, 0.9)}, rgba(0,0,0,0) 72%)`,
                }} />
                <IconPng src={M.icCaja} x={pcX(215)} y={pcY(860)} size={230} z={0} opacity={0.22} rot={-4} glow={V.ink0} />
              </Plane>
              {/* ⭐ LAS CUATRO HABITACIONES SON MATERIAL REAL, no rectángulos con texto */}
              <Plane z={60}>
                {ROOMS.map((r, i) => {
                  const k = clamp01(on[i]);
                  if (k <= 0.02) return null;
                  return (
                    <MediaCard key={r.label} src={r.src} kind={r.kind} w={r.w} h={r.h}
                      x={pcX(r.cx)} y={pcY(r.cy)} z={0} ry={r.cx < 960 ? 3 : -3} startFrom={14}
                      lit={0.3 + 0.7 * k} litColor={V.amber} label={r.label}
                      sheenAt={toCF(12 + i * 12)} radius={6} opacity={0.18 + 0.82 * k} />
                  );
                })}
              </Plane>
              {/* EL HILO: sube por dentro de las paredes. Es el objeto que cruza todo el movimiento. */}
              <Plane z={140}>
                <Board>
                  <Wire d="M 322 916 L 322 606" p={P[0]} color={V.volt} w={7} />
                  <Wire d="M 322 606 L 630 606 L 630 726" p={P[1]} color={V.volt} w={6} />
                  <Wire d="M 630 606 L 1292 606 L 1292 726" p={P[2]} color={V.volt} w={6} />
                  <Wire d="M 960 606 L 960 348" p={P[3]} color={V.volt} w={6} />
                  <Wire d="M 960 348 L 632 348 L 632 468" p={P[4]} color={V.volt} w={6} />
                  <Wire d="M 960 348 L 1292 348 L 1292 468" p={P[5]} color={V.volt} w={6} />
                </Board>
              </Plane>
              <Plane z={240}>
                <IconPng src={M.icEnchufe} x={pcX(322)} y={pcY(946)} size={104} z={0} opacity={0.95} glow={V.volt} />
                {f > 34 && (
                  <div style={{ position: "absolute", left: pcX(322) + "%", top: pcY(1024) + "%", transform: "translateX(-50%)", opacity: clamp01((f - 34) / 10), whiteSpace: "nowrap" }}>
                    <Kick color={V.volt}>UN SOLO ENCHUFE</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el hilo baja del techo y ya es el cable de dos machos ═════════════════ */}
        {acto === 2 && (() => {
          const drop = clamp01(f / 16);
          const WORD = "CABLE SUICIDA";
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.sostieneF} kind="photo" z={0} scale={1.3} dim={0.82} tint={V.volt} /></Plane>
              {/* el hilo del acto 1 sigue bajando y se mete en el cable: la costura es un match-move */}
              <Plane z={-40}>
                <Board><Wire d="M 300 -40 L 300 210 L 690 300" p={drop} color={V.volt} w={5} op={0.8} /></Board>
              </Plane>
              <Plane z={80}>
                <MediaCard src={M.cableV} kind="video" w={780} h={440} x={50} y={40} z={0} ry={-6} rx={2}
                  startFrom={16} lit={1} litColor={V.volt} sheenAt={toCF(14)} radius={10} />
              </Plane>
              <Plane z={200}>
                <MediaCard src={M.patitasV} kind="video" w={300} h={186} x={14} y={70} z={0} ry={12}
                  startFrom={10} lit={0.85} litColor={V.danger} label="CON CORRIENTE" sheenAt={toCF(30)} radius={8} />
                <MediaCard src={M.patitasV} kind="video" w={300} h={186} x={86} y={70} z={0} ry={-12}
                  startFrom={44} lit={0.85} litColor={V.danger} label="EN LA MANO" sheenAt={toCF(38)} radius={8} />
              </Plane>
              {/* EL NOMBRE, quemado letra por letra en la madera de la pared del taller */}
              <Plane z={300}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "83%", display: "flex",
                  justifyContent: "center", alignItems: "center",
                }}>
                  {WORD.split("").map((ch, i) => {
                    const p = clamp01((f - (12 + i * 3.1)) / 9);
                    const flare = clamp01(1 - Math.abs(f - (12 + i * 3.1) - 5) / 9);
                    if (p <= 0) return null;
                    return (
                      <span key={i} style={{
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 86, letterSpacing: 6,
                        color: `rgb(${Math.round(lerp(90, 255, p))},${Math.round(lerp(46, 200, p))},${Math.round(lerp(20, 61, p))})`,
                        textShadow: `0 0 ${(10 + 46 * flare).toFixed(0)}px ${rgba(V.amber, 0.35 + 0.6 * flare)}, 0 6px 26px rgba(0,0,0,0.95)`,
                        transform: `translateY(${(2 * (1 - p)).toFixed(2)}px)`,
                      }}>{ch === " " ? "  " : ch}</span>
                    );
                  })}
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · la respiración: sólo el contorno del cable y el led verde ═════════════ */}
        {acto === 3 && (() => {
          const hum = 0.5 + Math.sin(f / 11) * 0.5;         // el zumbido grave que llena el vacío
          const dim = interpolate(f, [0, 34, 66], [0.55, 0.86, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.sostieneF} kind="photo" z={0} scale={1.26} dim={dim} tint={V.volt} /></Plane>
              {/* el cable: ya no se ve, se INTUYE — un contorno y nada más */}
              <Plane z={60}>
                <div style={{ filter: "contrast(1.5) brightness(0.42)" }}>
                  <MediaCard src={M.cableV} kind="video" w={780} h={440} x={50} y={40} z={0} ry={-6}
                    startFrom={16} lit={0.22} litColor={V.volt} radius={10} opacity={0.34} />
                </div>
                <div style={{
                  position: "absolute", left: "50%", top: "40%", width: 782, height: 442, marginLeft: -391, marginTop: -221,
                  borderRadius: 10, boxShadow: `inset 0 0 0 1px ${rgba(V.volt, 0.3)}, 0 0 90px ${rgba(V.volt, 0.1 + 0.05 * hum)}`,
                }} />
              </Plane>
              {/* el led verde de la caja al fondo: material real, es lo único encendido */}
              <Plane z={180}>
                <MediaCard src={M.ledV} kind="video" w={300} h={188} x={80} y={72} z={0} ry={-14}
                  startFrom={22} lit={0.5 + 0.14 * hum} litColor={V.volt} radius={8} opacity={0.82} />
                <div style={{
                  position: "absolute", left: "80%", top: "72%", width: 460, height: 320, marginLeft: -230, marginTop: -160,
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba(V.volt, 0.13 + 0.05 * hum)}, rgba(0,0,0,0) 70%)`,
                }} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · la MISMA casa, el hilo al revés: la corriente sale a la calle ═════════ */}
        {acto === 4 && (() => {
          const back = clamp01(f / 26);                     // el hilo sale del toma y baja por la pared
          const meter = clamp01((f - 22) / 16);             // cruza el medidor
          const out = clamp01((f - 38) / 42);               // se va por la acometida
          const spin = -(clamp01((f - 24) / 60) * 300);     // el disco gira HACIA ATRÁS
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.fachadaF} kind="photo" z={0} scale={1.36} dim={0.84} tint={V.sky} /></Plane>
              <Plane z={-120}><HouseShell tint={V.sky} /></Plane>
              {/* las mismas cuatro habitaciones, ahora apagadas: el match-cut con el acto 1 */}
              <Plane z={60}>
                {ROOMS.map((r) => (
                  <MediaCard key={r.label} src={r.src} kind={r.kind} w={r.w} h={r.h}
                    x={pcX(r.cx)} y={pcY(r.cy)} z={0} ry={r.cx < 960 ? 3 : -3} startFrom={14}
                    lit={0.32} litColor={V.sky} radius={6} opacity={0.42} />
                ))}
              </Plane>
              {/* EL MEDIDOR: material real + el disco que se va para atrás (eso SÍ es un mecanismo) */}
              <Plane z={150}>
                <MediaCard src={M.medidorV} kind="video" w={330} h={200} x={pcX(250)} y={pcY(944)} z={0} ry={7}
                  startFrom={20} lit={0.5 + 0.5 * meter} litColor={V.sky} label="EL MEDIDOR" sheenAt={toCF(26)} radius={8} />
                <IconPng src={M.icMedidor} x={pcX(516)} y={pcY(892)} size={92} z={0} opacity={0.5 + 0.4 * meter} rot={spin} glow={V.sky} />
                {meter > 0.4 && (
                  <div style={{ position: "absolute", left: pcX(516) + "%", top: pcY(1012) + "%", transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: clamp01((meter - 0.4) / 0.4) }}>
                    <Kick color={V.sky}>AL REVÉS</Kick>
                  </div>
                )}
                <MediaCard src={M.acometidaV} kind="video" w={430} h={258} x={pcX(1540)} y={pcY(206)} z={0} ry={-10}
                  startFrom={12} lit={0.4 + 0.6 * out} litColor={V.sky} label="LA ACOMETIDA" sheenAt={toCF(50)} radius={8} />
              </Plane>
              <Plane z={240}>
                <Board>
                  <Wire d="M 632 724 L 632 606 L 322 606 L 322 862" p={back} color={V.sky} w={7} speed={-1} />
                  <Wire d="M 322 862 L 250 900" p={meter} color={V.sky} w={6} speed={-1} />
                  <Wire d="M 120 930 L 120 130 L 1880 34" p={out} color={V.sky} w={8} speed={-1.4} />
                </Board>
              </Plane>
              <Plane z={320}>
                {f > 46 && (
                  <div style={{ position: "absolute", left: "4%", top: "6%", opacity: clamp01((f - 46) / 12) }}>
                    <Bed pad={22}>
                      <Kick color={V.sky}>HACIA LA COMPAÑÍA</Kick>
                      <div style={{ height: 8 }} />
                      <Head size={58} color={V.white}>SALE A LA CALLE</Head>
                    </Bed>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · el poste: entra fino, sale grueso. El blanqueo, sin nadie en cuadro. ══ */}
        {acto === 5 && (() => {
          const WF = 44;                                    // el ms exacto en que la voz dice "voltios"
          const inP = clamp01(f / 18);
          const outP = clamp01((f - 18) / 20);
          const blanco = clamp01(1 - Math.abs(f - WF) / 7);
          const after = f > WF + 2;
          const sodio = clamp01((f - WF - 2) / 8);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.posteF} kind="photo" z={0} scale={1.4} dim={0.62} tint={V.amber} /></Plane>
              {/* el naranja de sodio: la luz de la calle, siempre desde arriba */}
              <Plane z={-320}>
                <AbsoluteFill style={{ background: `radial-gradient(70% 46% at 40% 4%, ${rgba(V.amber, 0.16 + 0.16 * sodio)}, rgba(0,0,0,0) 62%)` }} />
              </Plane>
              {/* EL POSTE en silueta + la lata gris del transformador + la canasta vacía */}
              <Plane z={0}>
                <div style={{ position: "absolute", left: 742, top: -240, width: 76, height: 1400, background: `linear-gradient(90deg, ${rgba(V.ink0, 1)} 0%, ${rgba(V.concrete, 0.2)} 45%, ${rgba(V.ink0, 1)} 100%)`, boxShadow: `0 0 60px ${rgba(V.ink0, 0.9)}` }} />
                <div style={{ position: "absolute", left: 430, top: 226, width: 700, height: 16, background: rgba(V.ink0, 0.98), boxShadow: `0 2px 0 ${rgba(V.amber, 0.2)}` }} />
                {/* la lata del transformador */}
                <div style={{
                  position: "absolute", left: 826, top: 430, width: 190, height: 290, borderRadius: 16,
                  background: `linear-gradient(96deg, ${rgba(V.ink0, 1)} 0%, ${rgba(V.concrete, 0.34)} 42%, ${rgba(V.ink0, 1)} 100%)`,
                  boxShadow: `0 26px 60px ${rgba(V.ink0, 0.92)}, inset 0 0 40px ${rgba(V.ink0, 0.8)}`,
                }} />
                {/* la canasta vacía: nadie adentro */}
                {after && (
                  <div style={{
                    position: "absolute", left: 1180, top: 250, width: 210, height: 150, opacity: sodio,
                    border: `4px solid ${rgba(V.amber, 0.5)}`, borderTop: "none", borderRadius: "0 0 18px 18px",
                    boxShadow: `0 0 32px ${rgba(V.amber, 0.28)}`,
                  }} />
                )}
              </Plane>
              <Plane z={120}>
                <Board>
                  {/* lo que llega desde la casa: fino y frío */}
                  <Wire d="M 240 1080 L 500 900 L 880 760" p={inP} color={V.sky} w={6} />
                  {/* lo que sale arriba: mucho más grueso, abriéndose a la línea */}
                  <Wire d="M 900 428 L 900 250 L 1740 190" p={outP} color={V.sky} w={17} speed={1.6} />
                </Board>
              </Plane>
              {/* MATERIAL REAL — desaparece antes del blanqueo: nadie en cuadro cuando revienta la luz */}
              {!after && (
                <Plane z={220}>
                  <MediaCard src={M.guantesV} kind="video" w={340} h={208} x={19} y={70} z={0} ry={12}
                    startFrom={18} lit={0.9} litColor={V.amber} label="LA LÍNEA QUE ÉL CORTÓ" sheenAt={toCF(10)} radius={8} />
                  <MediaCard src={M.acometidaV} kind="video" w={340} h={208} x={83} y={26} z={0} ry={-12}
                    startFrom={30} lit={0.85} litColor={V.sky} label="LA LÍNEA DEL BARRIO" sheenAt={toCF(22)} radius={8} />
                </Plane>
              )}
              <Plane z={300}>
                <div style={{ position: "absolute", left: pcX(430) + "%", top: pcY(1000) + "%", transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: inP }}>
                  <Kick color={V.sky}>LO QUE ENTRA</Kick>
                </div>
                {after && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: "72%", textAlign: "center", opacity: sodio }}>
                    <Head size={92} color={V.sky}>MILES DE VOLTIOS</Head>
                  </div>
                )}
              </Plane>
              {/* EL BLANQUEO: 14 frames, no es un fundido — es el instante de la palabra */}
              {blanco > 0 && (
                <AbsoluteFill style={{ background: rgba(V.white, 0.94 * blanco * blanco), pointerEvents: "none" }} />
              )}
            </>
          );
        })()}

        {/* ═══ ACTO 6 · las cuatro negaciones vuelven y se cruzan en una sola X ═══════════════ */}
        {acto === 6 && (() => {
          const NEG = [
            { src: M.noNuncaF, x: 15, y: 22, label: "NUNCA", d: "M 288 238 L 960 540", off: 28 },
            { src: M.noUnaVezF, x: 85, y: 22, label: "NI UNA VEZ", d: "M 1632 238 L 960 540", off: 25 },
            { src: M.noCincoF, x: 15, y: 78, label: "NI 5 MINUTOS", d: "M 288 842 L 960 540", off: 22 },
            { src: M.noCuidadoF, x: 85, y: 78, label: "NI CON CUIDADO", d: "M 1632 842 L 960 540", off: 18 },
          ];
          const draw = clamp01(f / 9);
          return (
            <>
              {/* cama de foto bajo el componente: el negro VOLT nunca es negro plano */}
              <Plane z={-620}><PhotoPlane src={M.guanteF} kind="photo" z={0} scale={1.3} dim={0.9} tint={V.danger} /></Plane>
              <Plane z={0}>
                {NEG.map((n, i) => {
                  const alive = f < n.off ? 1 : clamp01(1 - (f - n.off) / 3);
                  if (alive <= 0) return null;
                  return (
                    <MediaCard key={n.label} src={n.src} kind="photo" w={330} h={200} x={n.x} y={n.y} z={0}
                      ry={n.x < 50 ? 9 : -9} lit={0.9} litColor={V.danger} label={n.label}
                      sheenAt={toCF(i * 2)} radius={8} opacity={alive} />
                  );
                })}
              </Plane>
              <Plane z={140}>
                <Board>
                  {NEG.map((n) => {
                    const alive = f < n.off ? 1 : clamp01(1 - (f - n.off) / 3);
                    if (alive <= 0) return null;
                    return (
                      <path key={n.label} d={n.d} fill="none" stroke={V.danger} strokeWidth={16} strokeLinecap="round"
                        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={alive}
                        style={{ filter: `drop-shadow(0 0 26px ${rgba(V.danger, 0.7)})` }} />
                    );
                  })}
                </Board>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 7 · tres caminos salen de la caja; dos llegan al MISMO congelador ════════ */}
        {acto === 7 && (() => {
          const w1 = clamp01(f / 16), w2 = clamp01((f - 8) / 16), w3 = clamp01((f - 4) / 22);
          const arrive = clamp01((f - 26) / 16);
          const muere = clamp01((f - 30) / 14);              // el ramal del cable de dos machos se enfría
          const gris = `rgb(${Math.round(lerp(200, 120, muere))},${Math.round(lerp(240, 124, muere))},${Math.round(lerp(0, 116, muere))})`;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.cajaV} kind="video" z={0} scale={1.4} dim={0.82} startFrom={20} tint={V.volt} /></Plane>
              {/* el poste de la calle, insinuado arriba a la derecha y a oscuras */}
              <Plane z={-200}>
                <div style={{ position: "absolute", left: 1810, top: -60, width: 44, height: 520, background: `linear-gradient(90deg, ${rgba(V.ink0, 1)}, ${rgba(V.concrete, 0.14)}, ${rgba(V.ink0, 1)})`, opacity: 0.55 }} />
                <div style={{ position: "absolute", left: 1690, top: 132, width: 230, height: 10, background: rgba(V.ink0, 0.98), opacity: 0.55 }} />
              </Plane>
              <Plane z={120}>
                <Board>
                  <Wire d="M 340 560 L 560 560 L 560 250 L 800 250" p={w1} color={V.volt} w={7} />
                  <Wire d="M 800 250 L 1120 250 L 1420 250" p={arrive} color={V.volt} w={7} />
                  <Wire d="M 340 570 L 800 566" p={w2} color={V.volt} w={7} />
                  <Wire d="M 800 566 L 1420 566" p={arrive} color={V.volt} w={7} />
                  <Wire d="M 340 600 L 560 600 L 560 880 L 820 884" p={w3} color={gris} w={7} flow={muere < 0.4} op={1 - 0.35 * muere} />
                </Board>
              </Plane>
              <Plane z={200}>
                <MediaCard src={M.cajaV} kind="video" w={360} h={222} x={pcX(180)} y={pcY(580)} z={0} ry={10}
                  startFrom={20} lit={1} litColor={V.volt} label="LA CAJA" sheenAt={toCF(6)} radius={8} />
                <MediaCard src={M.transferV} kind="video" w={330} h={200} x={pcX(960)} y={pcY(250)} z={0} ry={0}
                  startFrom={26} lit={0.5 + 0.5 * w1} litColor={V.volt} label="TRANSFERENCIA" sheenAt={toCF(18)} radius={8} />
                <MediaCard src={M.regletaV} kind="video" w={330} h={200} x={pcX(960)} y={pcY(566)} z={0} ry={0}
                  startFrom={24} lit={0.5 + 0.5 * w2} litColor={V.volt} label="REGLETA" sheenAt={toCF(24)} radius={8} />
                {/* ⭐ EL MISMO CLIP, EL MISMO startFrom: es el MISMO congelador al final de los dos caminos */}
                <MediaCard src={M.cocinaV} kind="video" w={330} h={200} x={pcX(1600)} y={pcY(250)} z={0} ry={-8}
                  startFrom={22} lit={0.4 + 0.6 * arrive} litColor={V.amber} label="EL CONGELADOR" sheenAt={toCF(34)} radius={8} />
                <MediaCard src={M.cocinaV} kind="video" w={330} h={200} x={pcX(1600)} y={pcY(566)} z={0} ry={-8}
                  startFrom={22} lit={0.4 + 0.6 * arrive} litColor={V.amber} label="EL MISMO" sheenAt={toCF(40)} radius={8} />
                <MediaCard src={M.cableV} kind="video" w={300} h={186} x={pcX(970)} y={pcY(884)} z={0} ry={6}
                  startFrom={30} lit={0.7 - 0.5 * muere} litColor={V.danger} label="CABLE SUICIDA" radius={8}
                  opacity={1 - 0.45 * muere} />
              </Plane>
              <Plane z={300}>
                {f > 40 && (
                  <div style={{ position: "absolute", left: "3.5%", top: "88%", opacity: clamp01((f - 40) / 10) }}>
                    <Bed pad={20}><Kick color={V.volt}>FUNCIONA IGUAL DE BIEN</Kick></Bed>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 8 · 200-500 contra 6.000: la barra se sale del cuadro y la cámara la sigue ═ */}
        {acto === 8 && (() => {
          const FLOORY = 980;
          const hGris = eio(0, 152, clamp01(f / 20));
          const hVolt = eio(0, 1330, clamp01((f - 30) / 160));
          const topVolt = FLOORY - hVolt;
          const anios = Math.round(lerp(0, 16, eio(0, 1, clamp01((f - 150) / 62))));
          const hojas = clamp01((f - 100) / 20);
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.etiquetaV} kind="video" z={0} scale={1.42} dim={0.84} startFrom={20} tint={V.volt} /></Plane>
              {/* LAS DOS BARRAS: esto SÍ es un gráfico, va en materia (hormigón + canto con espesor) */}
              <Plane z={0}>
                <div style={{
                  position: "absolute", left: 250, top: FLOORY - hGris, width: 220, height: hGris,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.4)} 0%, ${rgba(V.ink2, 0.98)} 26%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `3px solid ${rgba(V.concrete, 0.9)}`,
                  boxShadow: `0 26px 60px ${rgba(V.ink0, 0.85)}, inset -16px 0 30px ${rgba(V.ink0, 0.72)}`,
                }} />
                <div style={{
                  position: "absolute", left: 730, top: topVolt, width: 260, height: hVolt,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.42)} 0%, ${rgba(V.ink2, 0.97)} 16%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `4px solid ${rgba(V.volt, 0.95)}`,
                  boxShadow: `0 30px 70px ${rgba(V.ink0, 0.86)}, inset -18px 0 34px ${rgba(V.ink0, 0.72)}, 0 0 90px ${rgba(V.volt, 0.16)}`,
                }} />
              </Plane>
              {/* MATERIAL REAL a la altura de cada dato */}
              <Plane z={140}>
                <MediaCard src={M.celdasV} kind="video" w={300} h={186} x={pcX(360)} y={pcY(660)} z={0} ry={8}
                  startFrom={20} lit={0.7} litColor={V.concrete} label="OTRAS QUÍMICAS" sheenAt={toCF(16)} radius={8} />
                <MediaCard src={M.etiquetaV} kind="video" w={330} h={200} x={pcX(1330)} y={pcY(820)} z={0} ry={-8}
                  startFrom={26} lit={0.95} litColor={V.volt} label="FERROFOSFATO" sheenAt={toCF(44)} radius={8} />
                <MediaCard src={M.ledV} kind="video" w={340} h={206} x={pcX(600)} y={pcY(930)} z={0} ry={4}
                  startFrom={18} lit={1} litColor={V.volt} label="LA CAJA" sheenAt={toCF(60)} radius={8} />
                <MediaCard src={M.calendarioF} kind="photo" w={340} h={220} x={pcX(1560)} y={pcY(-160)} z={0} ry={-10}
                  lit={0.9} litColor={V.amber} label="UNA VEZ POR DÍA" sheenAt={toCF(120)} radius={8} />
                <IconPng src={M.icCalendario} x={pcX(1330)} y={pcY(-250)} size={96} z={0} opacity={0.75 * hojas} glow={V.amber} />
                {/* las hojas corriendo a toda velocidad */}
                {hojas > 0.05 && Array.from({ length: 9 }, (_, i) => {
                  const t = ((f - 100) * (0.05 + rnd(i * 3.7) * 0.03) + rnd(i * 8.1)) % 1;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: pcX(1560 - 130 + rnd(i * 2.3) * 250) + "%",
                      top: pcY(-250 - t * 190) + "%", width: 74, height: 96,
                      background: `linear-gradient(170deg, ${rgba(V.bone, 0.5)} 0%, ${rgba(V.bone, 0.12)} 100%)`,
                      transform: `rotate(${(rnd(i * 5.9) * 60 - 30).toFixed(1)}deg)`,
                      opacity: hojas * (1 - t) * 0.8,
                    }} />
                  );
                })}
              </Plane>
              <Plane z={260}>
                <Readout value="200 – 500" label="CICLOS" at={toCF(22)} x={pcX(360)} y={pcY(470)} size={78} color={V.concrete} />
                <Readout value="6.000" label="CICLOS" at={toCF(118)} x={pcX(860)} y={pcY(topVolt - 120)} size={128} color={V.volt} />
                {f > 150 && (
                  <div style={{ position: "absolute", left: pcX(1300) + "%", top: pcY(80) + "%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <Num size={168} color={V.amber}>{anios}</Num>
                    <div style={{ marginTop: 6, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 5.2, color: rgba(V.bone, 0.8) }}>AÑOS</div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 9 · adentro del cable: el caudal choca contra un cuello finito ═══════════ */}
        {acto === 9 && (() => {
          const flujo = clamp01(f / 22);
          const calor = clamp01((f - 26) / 40);
          const salida = clamp01((f - 62) / 24);
          const metal = `rgb(${Math.round(lerp(255, 255, calor))},${Math.round(lerp(200, 74, calor))},${Math.round(lerp(61, 44, calor))})`;
          return (
            <>
              {/* el túnel: cobre real corriendo detrás, no una textura inventada */}
              <Plane z={-560}><PhotoPlane src={M.cobreV} kind="video" z={0} scale={1.6} dim={0.6} startFrom={14} tint={V.amber} /></Plane>
              {/* la vaina de plástico: gris y fría en todo el largo… */}
              <Plane z={-60}>
                <div style={{ position: "absolute", left: -60, top: 250, width: 2040, height: 130, background: `linear-gradient(180deg, ${rgba(V.ink1, 0.98)}, ${rgba(V.concrete, 0.22)})`, borderRadius: 40 }} />
                <div style={{ position: "absolute", left: -60, top: 700, width: 2040, height: 130, background: `linear-gradient(0deg, ${rgba(V.ink1, 0.98)}, ${rgba(V.concrete, 0.22)})`, borderRadius: 40 }} />
                {/* …y ablandada ÚNICAMENTE en el cuello */}
                <div style={{
                  position: "absolute", left: 760, top: 250 - 26 * calor, width: 300, height: 130 + 52 * calor, borderRadius: 60,
                  background: `linear-gradient(180deg, ${rgba(V.ink1, 0.9)}, ${rgba(metal, 0.42 * calor)})`,
                  filter: `blur(${(2 + 5 * calor).toFixed(1)}px)`,
                }} />
                <div style={{
                  position: "absolute", left: 760, top: 700 - 26 * calor, width: 300, height: 130 + 52 * calor, borderRadius: 60,
                  background: `linear-gradient(0deg, ${rgba(V.ink1, 0.9)}, ${rgba(metal, 0.42 * calor)})`,
                  filter: `blur(${(2 + 5 * calor).toFixed(1)}px)`,
                }} />
              </Plane>
              {/* EL CAUDAL: ancho a la izquierda, cuello finito al medio, adelgazado a la derecha */}
              <Plane z={60}>
                <Board>
                  <defs>
                    <linearGradient id="s6a_flow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={rgba(V.volt, 0.9)} />
                      <stop offset="42%" stopColor={rgba(V.volt, 0.75)} />
                      <stop offset="52%" stopColor={rgba(metal, 0.9)} />
                      <stop offset="100%" stopColor={rgba(V.volt, 0.55)} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M -40 388 L 770 500 L 1050 500 L 1960 452 L 1960 628 L 1050 580 L 770 580 L -40 692 Z"
                    fill="url(#s6a_flow)" opacity={0.34 + 0.5 * flujo}
                    style={{ filter: `drop-shadow(0 0 40px ${rgba(V.volt, 0.4)})` }}
                  />
                  <Wire d="M -40 540 L 780 540 L 1040 540 L 1960 540" p={flujo} color={V.white} w={3} speed={2.6} op={0.5} />
                </Board>
                {/* lo que NO pasa se acumula en el cuello y ahí el metal se pone ámbar y después rojo */}
                <div style={{
                  position: "absolute", left: 700, top: 380, width: 420, height: 320,
                  background: `radial-gradient(50% 50% at 50% 50%, ${rgba(metal, 0.2 + 0.6 * calor)}, rgba(0,0,0,0) 68%)`,
                  mixBlendMode: "screen",
                }} />
              </Plane>
              <Plane z={220}>
                <MediaCard src={M.regletaViejaV} kind="video" w={340} h={210} x={16} y={20} z={0} ry={12}
                  startFrom={16} lit={0.85} litColor={V.volt} label="REGLETA VIEJA" sheenAt={toCF(4)} radius={8} />
                <MediaCard src={M.cobreV} kind="video" w={300} h={186} x={17} y={82} z={0} ry={10}
                  startFrom={30} lit={0.7} litColor={V.amber} label="EL COBRE" sheenAt={toCF(20)} radius={8} />
                {salida > 0.02 && (
                  <MediaCard src={M.directoV} kind="video" w={340} h={210} x={84} y={80} z={0} ry={-12}
                    startFrom={22} lit={0.4 + 0.6 * salida} litColor={V.volt} label="DIRECTO A LA PARED"
                    sheenAt={toCF(66)} radius={8} opacity={0.25 + 0.75 * salida} />
                )}
              </Plane>
              <Plane z={320}>
                <div style={{ position: "absolute", left: "47%", top: "20%", transform: "translateX(-50%)", whiteSpace: "nowrap", opacity: clamp01((f - 24) / 10) }}>
                  <Kick color={metal}>EL CUELLO</Kick>
                </div>
                {f > 44 && (
                  <div style={{ position: "absolute", left: "50%", top: "86%", transform: "translateX(-50%)", opacity: clamp01((f - 44) / 12) }}>
                    <Bed pad={22}><Head size={56} color={V.white}>SE CALIENTA DONDE NO PASA</Head></Bed>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 10 · la que no respira dura 4; la que respira, 11 ═══════════════════════ */}
        {acto === 10 && (() => {
          const cierra = eio(0, 1, clamp01(f / 30));         // la madera aprieta por los cuatro lados
          const ahoga = clamp01((f - 26) / 40);              // y el ámbar sube desde adentro
          const aire = clamp01((f - 18) / 34);               // los cuatro hilos que suben y se van
          const cL = Math.min(4, Math.round(lerp(0, 4, clamp01((f - 40) / 44))));
          const cR = Math.min(11, Math.round(lerp(0, 11, clamp01((f - 40) / 66))));
          const offL = f > 88;                               // el contador de la izquierda se para y se apaga
          const madera = `linear-gradient(180deg, rgba(96,72,44,0.96), rgba(46,33,20,1))`;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.enMuebleV} kind="video" z={0} scale={1.44} dim={0.86} startFrom={24} tint={V.amber} /></Plane>
              {/* IZQUIERDA · el cubo de madera que la aprieta por los cuatro lados */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: 250 - 60 * (1 - cierra), top: 250 - 60 * (1 - cierra),
                  width: 20, height: 500 + 120 * (1 - cierra), background: madera, boxShadow: `0 0 40px ${rgba(V.ink0, 0.9)}`,
                }} />
                <div style={{
                  position: "absolute", left: 770 + 60 * (1 - cierra), top: 250 - 60 * (1 - cierra),
                  width: 20, height: 500 + 120 * (1 - cierra), background: madera, boxShadow: `0 0 40px ${rgba(V.ink0, 0.9)}`,
                }} />
                <div style={{
                  position: "absolute", left: 250 - 60 * (1 - cierra), top: 250 - 60 * (1 - cierra),
                  width: 560 + 120 * (1 - cierra), height: 20, background: madera,
                }} />
                <div style={{
                  position: "absolute", left: 250 - 60 * (1 - cierra), top: 750 + 60 * (1 - cierra),
                  width: 560 + 120 * (1 - cierra), height: 20, background: madera,
                }} />
                <div style={{
                  position: "absolute", left: 260, top: 260, width: 540, height: 500,
                  background: `radial-gradient(58% 58% at 50% 56%, ${rgba(V.amber, 0.1 + 0.44 * ahoga)}, rgba(0,0,0,0) 72%)`,
                  mixBlendMode: "screen",
                }} />
              </Plane>
              {/* DERECHA · el palmo de aire, dibujado como cuatro hilos que se van del cuadro */}
              <Plane z={40}>
                <Board>
                  {[1150, 1260, 1660, 1770].map((x, i) => (
                    <Wire key={x} d={`M ${x} 790 L ${x} ${790 - 700 * aire}`} p={clamp01(aire * 1.2 - i * 0.06)}
                      color={V.volt} w={5} speed={1.6} op={0.85} />
                  ))}
                </Board>
              </Plane>
              <Plane z={180}>
                <MediaCard src={M.enMuebleV} kind="video" w={470} h={290} x={pcX(530)} y={pcY(506)} z={0} ry={7}
                  startFrom={24} lit={0.55 + 0.35 * ahoga} litColor={V.amber} label="SIN AIRE" sheenAt={toCF(8)} radius={8} />
                <MediaCard src={M.palmoV} kind="video" w={470} h={290} x={pcX(1460)} y={pcY(506)} z={0} ry={-7}
                  startFrom={20} lit={1} litColor={V.volt} label="UN PALMO DE AIRE" sheenAt={toCF(16)} radius={8} />
                <MediaCard src={M.rejillasV} kind="video" w={260} h={162} x={pcX(210)} y={pcY(150)} z={0} ry={12}
                  startFrom={18} lit={0.8} litColor={V.amber} label="LAS REJILLAS" sheenAt={toCF(30)} radius={8} />
              </Plane>
              <Plane z={300}>
                <div style={{ position: "absolute", left: pcX(530) + "%", top: pcY(880) + "%", transform: "translate(-50%,-50%)", textAlign: "center", opacity: offL ? 0.28 : 1 }}>
                  <Num size={150} color={offL ? rgba(V.concrete, 0.8) : V.amber}>{cL}</Num>
                  <div style={{ marginTop: 4, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 4.6, color: rgba(V.bone, 0.68) }}>AÑOS</div>
                </div>
                <div style={{ position: "absolute", left: pcX(1460) + "%", top: pcY(880) + "%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                  <Num size={150} color={V.volt}>{cR}</Num>
                  <div style={{ marginTop: 4, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 4.6, color: rgba(V.bone, 0.68) }}>AÑOS</div>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 11 · el cable se estira y es la fila de la tabla, pegada en la pared ═════ */}
        {acto === 11 && (() => {
          const estira = clamp01(f / 24);
          const fila = clamp01((f - 22) / 16);
          const pared = clamp01((f - 46) / 30);
          const luz = clamp01((f - 40) / 34);                // la luz de trabajo blanca entra de frente
          const FILA = [
            { t: "CONGELADOR VIEJO", w: 470 },
            { t: "6 A", w: 150 },
            { t: "14 AWG", w: 220 },
            { t: "FUSIBLE 15 A", w: 300 },
          ];
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.paredF} kind="photo" z={0} scale={1.3} dim={0.68 - 0.22 * pared} tint={V.torch} /></Plane>
              {/* la luz de trabajo: blanca, de frente y pareja. La atmósfera NO se remonta: se suma. */}
              <Plane z={-300}>
                <AbsoluteFill style={{ background: `radial-gradient(86% 72% at 50% 34%, ${rgba(V.torch, 0.14 * luz)}, rgba(0,0,0,0) 70%)` }} />
              </Plane>
              {/* LAS DOS HOJAS pegadas con cinta: las mismas dos que se leyeron en la CTA */}
              <Plane z={-40}>
                {[{ x: 620, tt: "LAS 7 CONEXIONES QUE NO SE HACEN NUNCA" }, { x: 1300, tt: "CALIBRE DE CABLE Y FUSIBLE POR CONSUMO" }].map((h, hi) => (
                  <div key={h.x} style={{
                    position: "absolute", left: h.x - 235, top: 210, width: 470, height: 620,
                    background: "linear-gradient(168deg, #F4F1E7 0%, #E6E2D4 62%, #D5D0BE 100%)",
                    boxShadow: `0 26px 60px ${rgba(V.ink0, 0.7)}`,
                    transform: `rotate(${hi === 0 ? -0.9 : 0.7}deg)`,
                    opacity: 0.24 + 0.76 * pared,
                    padding: "34px 28px",
                  }}>
                    <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 26, letterSpacing: 1.1, lineHeight: 1.14, color: "#20221A", textTransform: "uppercase" }}>{h.tt}</div>
                    <div style={{ marginTop: 14, height: 3, background: "#20221A", opacity: 0.7 }} />
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} style={{ marginTop: 30, height: 2, background: "#2A2C22", opacity: 0.24 + rnd(i * 4.7 + hi) * 0.12 }} />
                    ))}
                    {/* la cinta de enmascarar en las esquinas */}
                    {[[-14, -12, -22], [420, -12, 18]].map((c, k) => (
                      <div key={k} style={{ position: "absolute", left: c[0], top: c[1], width: 78, height: 30, background: "rgba(226,208,160,0.85)", transform: `rotate(${c[2]}deg)`, boxShadow: "0 4px 10px rgba(0,0,0,0.35)" }} />
                    ))}
                  </div>
                ))}
              </Plane>
              {/* EL CABLE que se estira y se convierte en la línea de la fila */}
              <Plane z={140}>
                <Board>
                  <Wire d={`M 700 640 L ${(700 + 900 * estira).toFixed(0)} 640`} p={1} color={V.volt} w={10} speed={1.8} op={1 - 0.55 * pared} />
                </Board>
                {fila > 0.02 && (
                  <div style={{
                    position: "absolute", left: "50%", top: pcY(596) + "%", width: 1180, marginLeft: -590,
                    display: "flex", alignItems: "center", gap: 0, opacity: fila * (1 - 0.7 * pared),
                    background: `linear-gradient(90deg, ${rgba(V.volt, 0.16)}, ${rgba(V.volt, 0.05)})`,
                    borderLeft: `5px solid ${V.volt}`, padding: "16px 20px",
                    boxShadow: `0 18px 44px ${rgba(V.ink0, 0.7)}`,
                    transform: `scaleX(${(0.4 + 0.6 * fila).toFixed(3)})`, transformOrigin: "left center",
                  }}>
                    {FILA.map((c, i) => (
                      <div key={c.t} style={{
                        width: c.w, fontFamily: i === 0 ? F_DISPLAY : F_BODY, fontWeight: i === 0 ? 700 : 600,
                        fontSize: i === 0 ? 40 : 36, letterSpacing: i === 0 ? 2 : 1.2,
                        color: i === 0 ? V.white : V.volt, whiteSpace: "nowrap",
                        textShadow: "0 4px 18px rgba(0,0,0,0.9)",
                      }}>{c.t}</div>
                    ))}
                  </div>
                )}
              </Plane>
              {/* MATERIAL REAL del plano ancho: el cable en la mano, el banco y la caja con su led */}
              <Plane z={240}>
                <MediaCard src={M.calibresV} kind="video" w={lerp(620, 320, pared)} h={lerp(380, 196, pared)}
                  x={lerp(50, 84, pared)} y={lerp(48, 86, pared)} z={0} ry={lerp(0, -12, pared)}
                  startFrom={18} lit={1} litColor={V.volt} label={pared > 0.6 ? "LOS DOS CABLES" : undefined}
                  sheenAt={toCF(6)} radius={8} />
                {pared > 0.15 && (
                  <MediaCard src={M.ledV} kind="video" w={300} h={186} x={13} y={87} z={0} ry={12}
                    startFrom={26} lit={0.9} litColor={V.volt} label="LA CAJA" sheenAt={toCF(58)} radius={8}
                    opacity={clamp01((pared - 0.15) / 0.3)} />
                )}
              </Plane>
              <Plane z={330}>
                {f > 70 && (
                  <div style={{ position: "absolute", left: "50%", top: "8%", transform: "translateX(-50%)", opacity: clamp01((f - 70) / 12) }}>
                    <Bed pad={22}><Kick color={V.volt}>MIRA ESA TABLA PRIMERO</Kick></Bed>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
