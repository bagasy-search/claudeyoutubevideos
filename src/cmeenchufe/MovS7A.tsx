// MovS7A.tsx — MOVIMIENTO S7A · "EL MES"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 9 actos · 953.730 → 1.115.950 ms · 4867 frames @30.
//
// LA IDEA: la crónica de las CUATRO SEMANAS. Semana 1 sólo mirar (el pico baja de 4.500 a 2.300 W) ·
// semana 2 le enchufa el calentador de agua (el pico cae a 1.900) · semana 3 baja la potencia
// contratada de 5,75 a 3,45 kW y el breaker le salta UNA sola vez, un domingo · semana 4 encuentra al
// ladrón: el congelador arrancaba cada 8 minutos por una goma de tres dólares.
//
// ⭐ EL RECURSO CENTRAL ES LA LUZ CONTANDO EL PASO DEL TIEMPO.
// Los 9 actos están repartidos sobre 162 s de reloj: entre uno y otro hay hasta 25 s de clips reales.
// Lo único que los cose es que la CÁMARA y la LUZ son funciones puras de `gFrame` y siguen viajando
// POR DEBAJO de esos clips. Cuando el acto 5 aparece, la cámara está donde el acto 4 la dejó y el sol
// ya cruzó el portón. La luz recorre las cuatro semanas SIN SALTAR de acto en acto:
//   sem.1 → noche entera: blanco de trabajo frío → azul de madrugada → ámbar de sala → VOLT (la pinza)
//   sem.2 → abre de día, cae a la tarde y a la noche: VOLT → ÁMBAR del pico de las 20:00
//   sem.3 → sol pleno con sombra larga (TORCH por el portón) → tarde fría (SKY) → APAGÓN (la luz se va)
//   sem.4 → amanecer frío (SKY tenue) → mediodía (TORCH) → tarde (ÁMBAR) → LA NOCHE PASA DEBAJO DE
//           LOS CLIPS REALES (VOLT, g3980→g4400) → y el acto 9 abre en la mañana fría del buzón.
// La intensidad y el `floor` de `VoltAtmos` viajan con esa misma curva: el apagón es una caída dura de
// 3 frames y el resto es una rampa continua. Ningún acto reinicia la atmósfera.
//
// LA MATERIA QUE CRUZA LAS OCHO FRONTERAS: **LA BARRA**.
//   acto 1 → la pared de hojas se ordena en cuatro casillas; la casilla 1 enciende en voltio;
//   acto 2 → la cámara entra en la casilla 1 y la caja gris ES una barra vertical que se vacía a la mitad;
//   acto 3 → la cámara sale del display de la pinza y el número se estira en esa misma barra (4.500→2.300);
//   acto 4 → misma inercia, misma barra: 4.500 → 1.900, y el calentador se suelta de la línea fría;
//   acto 5 → la cámara entra en el sol del portón y el rectángulo es la cara de un DIAL (5,75 → 3,45 kW);
//   acto 6 → la cámara sale del arco de la soldadura y su luz es una barra que sube hasta el techo del dial;
//   acto 7 → la cámara sube por el cable del congelador y la barra se acuesta: es el día entero, peine de picos;
//   acto 8 → el peine se comprime en un BLOQUE macizo que cae al piso: 1 kWh por día;
//   acto 9 → los escalones de la casa son la base y la barra vuelve a pararse: 111 contra 44.
//
// ⛔ cero fundidos entre actos · cero Math.random/Date · cero backdrop-filter · cero texto de otro video.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-57 · "Vamos al mes."                    material: 1 CLIP + 3 FOTOS (las cuatro semanas)
//   entra  cam {z −220, plano frontal de la pared de hojas}  luz {SKY blanco de trabajo, key 0.10, int 0.95}
//   sale   cam {metida en la casilla 1, push ×2.5}           luz {SKY, key 0.15}
//   ── FRONTERA A ···· ZOOM-THROUGH: la cámara entra en la casilla 1 y sale dentro de la caja gris ····
// ACTO 2 · g280-352 · "…ya se había vaciado hasta la mitad"  material: CLIP caja madrugada + FOTO refri + CLIP sala
//   entra  cam {saliendo de la casilla, push 3.0 → 1, grúa +40}  luz {SKY azul de madrugada, int 0.86}
//   sale   cam {plano general de la barra}                       luz {ÁMBAR de sala encendida}
//   ── FRONTERA B ···· MATCH-SHAPE: la barra vertical se queda; la cámara se mete en el display ······
// ACTO 3 · g713-851 · "en vez de 4.500. La mitad."     material: CLIP pinza + FOTO pasillo prendido
//   entra  cam {SALIENDO del display, push ×3.3, grúa −30}   luz {VOLT pleno, key 0.24}
//   sale   cam {plano general de las dos columnas}           luz {VOLT}
//   ── FRONTERA C ···· MATCH-MOVE: la cámara sigue bajando y vuelve a entrar en el display ··········
// ACTO 4 · g1682-1826 · "pasó de 4.500 vatios a 1.900" material: CLIP calentador + CLIP tablero 20h
//   entra  cam {SALIENDO del display otra vez, push ×3.1, grúa −84}  luz {VOLT, key 0.42}
//   sale   cam {empujando hacia el sol del portón, push 2.3}         luz {ÁMBAR del pico de las 20:00}
//   ── FRONTERA D ···· ZOOM-THROUGH: la cámara entra en el sol del portón y sale en la cara del dial ·
// ACTO 5 · g2177-2324 · "de 5.75 kilovatios a 3.45"    material: CLIP portón sol + CLIP cuelga + FOTO pasillo
//   entra  cam {dentro del sol, push 2.6, grúa +150}         luz {TORCH sol pleno, int 1.42, floor 0.34}
//   sale   cam {el dial se aleja y vuelve a ser el rectángulo} luz {TORCH → se empieza a enfriar}
//   ── FRONTERA E ···· MORPH: el dial se aleja y el techo frío de 3,45 kW QUEDA en el cuadro ········
// ACTO 6 · g2987-3083 · "(las dos cosas a la vez)"     material: CLIP soldadora + CLIP horno
//   entra  cam {SALIENDO del arco, push ×3.0, grúa +40}      luz {SKY tarde fría, int 0.90}
//   sale   cam {grúa −110, a ras del piso}                   luz {APAGÓN: int 0.06, sólo la franja de calle}
//   ── FRONTERA F ···· APAGÓN EN UN FRAME: la línea se parte y todo se entierra ······················
// ACTO 7 · g3545-3605 · "Cada ocho."                   material: CLIP congelador + CLIP pinza congelador
//   entra  cam {SUBIENDO por el cable, grúa +130, push 2.0}  luz {SKY amanecer frío, int 0.55}
//   sale   cam {plano del día entero}                        luz {SKY, subiendo}
//   ── FRONTERA G ···· COMPRESIÓN: el peine se aplasta y cae convertido en bloque ····················
// ACTO 8 · g3806-3980 · "un kilovatio hora por día él solo"  material: FOTO goma nueva + FOTO pinza + FOTO goma partida
//   entra  cam {grúa +26 bajando con el bloque}              luz {TORCH mediodía, int 1.38, floor 0.30}
//   sale   cam {grúa −70, rodeando el bloque, orbit −20°}    luz {ÁMBAR de la tarde}
//   ── FRONTERA H ···· LA NOCHE ENTERA PASA DEBAJO DE LOS CLIPS REALES (g3980 → g4400 → VOLT) ·······
// ACTO 9 · g4729-4867 · "60 por ciento."               material: CLIP escalones + FOTO facturas + CLIP Ernesto + CLIP umbral
//   entra  cam {match-cut de escala sobre los escalones, push 2.2}  luz {SKY mañana fría, int 1.16}
//   sale   cam {sale del hueco hacia arriba, grúa +140}             luz {SKY mañana fría}
//   ── REMATE ···· el portal de la casa BAJA por delante y tapa el cuadro (oclusión por materia) ·····
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";
import type { Lum } from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 280, A3 = 713, A4 = 1682, A5 = 2177, A6 = 2987, A7 = 3545, A8 = 3806, A9 = 4729;
const G_END = 4867;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7, 8: A8, 9: A9 };

const FLOOR = 900;                              // el piso del cuadro, en px de la comp 1920×1080
const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla

// ── EL MATERIAL REAL (las 41 rutas verificadas en disco) ─────────────────────────────────────
const M = {
  paredHojas: "img/cmeenchufe/cmee_s6_senala_pared_hojas.png",
  miraCajaV: "broll/cmeenchufe/cmee_s7_cajon_mira_caja.mp4",
  cargaV: "broll/cmeenchufe/cmee_s7_caja_carga_madrugada.mp4",
  salaV: "broll/cmeenchufe/cmee_s7_sala_tele_noche.mp4",
  refriF: "img/cmeenchufe/cmee_s7_refri_noche.png",
  pinzaV: "broll/cmeenchufe/cmee_s7_pinza_cable_entrada.mp4",
  prendidoF: "img/cmeenchufe/cmee_s9_pasillo_todo_prendido.png",
  tableroV: "broll/cmeenchufe/cmee_s7_tablero_pinza_20h.mp4",
  calentadorV: "broll/cmeenchufe/cmee_s7_enchufa_calentador.mp4",
  calentadorF: "img/cmeenchufe/cmee_s7_enchufa_calentador.png",
  portonV: "broll/cmeenchufe/cmee_s7_telefono_porton_sol.mp4",
  portonF: "img/cmeenchufe/cmee_s7_telefono_porton_sol.png",
  cuelgaV: "broll/cmeenchufe/cmee_s7_cuelga_exhala.mp4",
  soldadoraV: "broll/cmeenchufe/cmee_s7_soldadora_arco.mp4",
  soldadoraF: "img/cmeenchufe/cmee_s7_soldadora_arco.png",
  hornoV: "broll/cmeenchufe/cmee_s7_esposa_horno.mp4",
  congeladorV: "broll/cmeenchufe/cmee_s7_congelador_arranca.mp4",
  enganchaV: "broll/cmeenchufe/cmee_s7_engancha_pinza_congelador.mp4",
  enganchaF: "img/cmeenchufe/cmee_s7_engancha_pinza_congelador.png",
  gomaNuevaF: "img/cmeenchufe/cmee_s7_goma_nueva_porton.png",
  gomaPartidaF: "img/cmeenchufe/cmee_s7_dedos_goma_partida.png",
  escalonesV: "broll/cmeenchufe/cmee_s7_ernesto_escalones.mp4",
  ernestoV: "broll/cmeenchufe/cmee_s7_ernesto_cara_numero.mp4",
  umbralV: "broll/cmeenchufe/cmee_s7_umbral_sobre_en_mano.mp4",
  facturasF: "img/cmeenchufe/cmee_s1_hombros_facturas.png",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icCalentador: "img/cmeenchufe/cmee_ic_calentador.png",
  icCaja: "img/cmeenchufe/cmee_ic_caja.png",
  icBreaker: "img/cmeenchufe/cmee_ic_breaker.png",
  icCongelador: "img/cmeenchufe/cmee_ic_congelador.png",
  icBombilla: "img/cmeenchufe/cmee_ic_bombillanoche.png",
  icBillete: "img/cmeenchufe/cmee_ic_billete.png",
  icSol: "img/cmeenchufe/cmee_ic_sol.png",
  icPinza: "img/cmeenchufe/cmee_ic_pinza.png",
  icMedidor: "img/cmeenchufe/cmee_ic_medidor.png",
};

// ── LA CÁMARA · una sola función de gFrame, que nunca vuelve a cero ──────────────────────────
// Se compone de CUATRO viajes independientes que siguen corriendo durante los clips reales:
//   1) el dolly base (`gcam`), monótono: z −220 → +200 con paneo a la derecha que nunca retrocede;
//   2) LA GRÚA: baja al banco, trepa al portón, se hunde con el apagón, sube por el cable del
//      congelador, baja con el bloque que cae y sale por arriba en el remate;
//   3) EL ORBIT: un giro que sólo avanza en un sentido (nunca deshace el rodeo del bloque);
//   4) EL PUSH: los seis zoom-through, que ARRANCAN Y TERMINAN dentro de los huecos entre actos —
//      por eso el acto que sigue abre YA metido en el material y sale de él sin corte.
const camAt = (g: number) => {
  const base = gcam(g, { z0: -220, z1: 200, panX: 210, panY: -34, ry: 9, rx: -2.2, dur: G_END });
  const easeCam = Easing.bezier(0.4, 0, 0.24, 1);
  const crane = interpolate(
    g,
    [0, A2, A3, A4, A5, A6, 3057, A7, A8, 3946, A9, G_END],
    [0, 40, -30, -84, 150, 40, -110, 130, 26, -70, 60, 140],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeCam },
  );
  const orbit = interpolate(
    g,
    [0, A5, A7, A8, 3956, A9, G_END],
    [0, -3, -6, -9, -20, -26, -31],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeCam },
  );
  const push = interpolate(
    g,
    [0, 30, 57, 250, 312, 640, 713, 757, 1600, 1682, 1728, 1790, 1826, 2130, 2177, 2215,
      2900, 2987, 3027, 3480, 3545, 3578, 3806, 4660, 4729, 4772, 4867],
    [1, 1, 2.5, 3.0, 1, 1, 3.3, 1, 1, 3.1, 1, 1, 2.3, 2.9, 2.6, 1,
      1, 3.0, 1, 1, 2.0, 1, 1, 1, 2.2, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1) },
  );
  // el punto al que la cámara entra viaja con el movimiento: casilla 1 → display → sol → arco → bloque
  const fx = interpolate(g, [0, A2, A3, A4, 1826, A5, A6, A7, A8, A9, G_END],
    [30, 30, 46, 46, 66, 66, 52, 38, 50, 50, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fy = interpolate(g, [0, A2, A3, A4, 1826, A5, A6, A7, A8, A9, G_END],
    [36, 36, 44, 44, 42, 42, 46, 30, 50, 78, 78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = (50 - fx) * (push - 1);
  const ty = (50 - fy) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotateY(${orbit.toFixed(3)}deg) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA LUZ QUE CUENTA LAS CUATRO SEMANAS ────────────────────────────────────────────────────
// Una cadena de PARADAS de temperatura sobre gFrame. Entre dos paradas se interpola con `light()`,
// y como el `to` de un tramo es el `from` del siguiente, el color es CONTINUO de punta a punta:
// nunca hay un salto, ni siquiera en los huecos de 25 s donde corren los clips reales.
type Stop = { g: number; l: Lum };
const lumAt = (g: number, stops: Stop[]) => {
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (g <= b.g || i === stops.length - 2) return light((g - a.g) / Math.max(1, b.g - a.g), a.l, b.l);
  }
  return light(0, stops[0].l, stops[0].l);
};
// LA KEY (desde arriba: el tiempo y lo que te cobran)
const KEY_STOPS: Stop[] = [
  { g: 0, l: "sky" },      // sem.1 · la luz blanca de trabajo del garaje, fría
  { g: 300, l: "sky" },    //         la caja se carga a la una: azul de madrugada
  { g: 352, l: "amber" },  //         a las ocho la sala está encendida
  { g: 713, l: "volt" },   //         la pinza mide: manda la MEDICIÓN
  { g: 1500, l: "volt" },
  { g: 1826, l: "amber" }, // sem.2 · cae la tarde y llega el pico de las 20:00
  { g: 2177, l: "torch" }, // sem.3 · sol pleno entrando por el portón
  { g: 2400, l: "torch" },
  { g: 2987, l: "sky" },   //         la tarde se enfría
  { g: 3083, l: "sky" },   //         el APAGÓN no cambia el color: se va la INTENSIDAD
  { g: 3545, l: "sky" },   // sem.4 · amanecer frío
  { g: 3900, l: "torch" }, //         mediodía
  { g: 3980, l: "amber" }, //         tarde
  { g: 4400, l: "volt" },  //         LA NOCHE ENTERA pasa debajo de los clips reales
  { g: 4729, l: "sky" },   //         la mañana fría del buzón
  { g: G_END, l: "sky" },
];
// EL CONTRA (desde abajo: lo que te queda)
const WARM_STOPS: Stop[] = [
  { g: 0, l: "amber" }, { g: 2177, l: "torch" }, { g: 2400, l: "torch" }, { g: 2987, l: "amber" },
  { g: 3545, l: "sky" }, { g: 3806, l: "amber" }, { g: 3980, l: "torch" }, { g: 4400, l: "amber" },
  { g: G_END, l: "amber" },
];

// ── LA COLUMNA: la altura ES el vatio, a escala exacta. Tiene ESPESOR, no es un rectángulo ──
const Col: React.FC<{ x: number; w: number; h: number; top: number; tint: string; z?: number; opacity?: number }> = ({
  x, w, h, top, tint, z = 0, opacity = 1,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top, width: w, height: Math.max(0, h), marginLeft: -w / 2,
    transform: `translateZ(${z}px)`, opacity,
    background: `linear-gradient(180deg, ${rgba(tint, 0.3)} 0%, ${rgba(V.ink2, 0.97)} 18%, ${rgba(V.ink1, 1)} 100%)`,
    borderTop: `3px solid ${rgba(tint, 0.92)}`,
    boxShadow: `0 30px 70px ${rgba(V.ink0, 0.85)}, inset 0 0 70px ${rgba(V.ink0, 0.62)}, inset -18px 0 34px ${rgba(V.ink0, 0.7)}`,
  }}>
    <div style={{
      position: "absolute", right: -17, top: 6, width: 17, height: Math.max(0, h - 6),
      background: `linear-gradient(180deg, ${rgba(tint, 0.18)}, ${rgba(V.ink0, 0.98)})`,
      transform: "skewY(-9deg)", transformOrigin: "left top",
    }} />
  </div>
);

// ── EL NIVEL FANTASMA: la altura que la barra YA NO alcanza (esto es un gráfico, va en vector) ──
const GhostLevel: React.FC<{ y: number; label: string; color: string; p: number }> = ({ y, label, color, p }) => (
  <div style={{ position: "absolute", left: "8%", right: "8%", top: y, opacity: p }}>
    <div style={{
      height: 2, background: `repeating-linear-gradient(90deg, ${rgba(color, 0.85)} 0 22px, rgba(0,0,0,0) 22px 42px)`,
    }} />
    <div style={{
      position: "absolute", right: 0, top: -40, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30,
      letterSpacing: 3.2, color: rgba(color, 0.9), textShadow: "0 4px 18px rgba(0,0,0,0.94)",
    }}>{label}</div>
  </div>
);

export const MovS7A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // ── LA LUZ, función continua de gFrame: evoluciona con el mes, nunca salta entre actos ──
  const keyTint = lumAt(gFrame, KEY_STOPS);
  const warmTint = lumAt(gFrame, WARM_STOPS);
  const keyFrom = interpolate(gFrame, [0, G_END], [0.1, 0.92], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.35, 0, 0.4, 1),
  });
  const inten = interpolate(
    gFrame,
    [0, A2, A3, A4, A5, 2324, A6, 3054, 3057, 3300, A7, 3900, 3980, 4400, A9, G_END],
    [0.95, 0.86, 1.0, 1.02, 1.42, 1.34, 0.9, 0.86, 0.06, 0.18, 0.55, 1.38, 1.12, 0.44, 1.16, 1.24],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const floorDim = interpolate(
    gFrame,
    [0, A3, A5, A6, 3057, A7, 3900, 4400, A9, G_END],
    [0.6, 0.62, 0.34, 0.6, 0.92, 0.7, 0.3, 0.78, 0.42, 0.38],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA sola vez, fuera del switch. Sólo evoluciona la luz. ── */}
      <VoltAtmos tint={keyTint} tint2={warmTint} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la pared de hojas se ordena en CUATRO CASILLAS ════════════════════ */}
        {acto === 1 && (() => {
          const lit1 = clamp01((f - 26) / 16);
          const SEM = [
            { key: "SEMANA 1", src: M.miraCajaV, kind: "video" as const, x0: 21, y0: 27, x1: 30, y1: 34, r0: -22, rot0: -7 },
            { key: "SEMANA 2", src: M.calentadorF, kind: "photo" as const, x0: 63, y0: 20, x1: 70, y1: 34, r0: 19, rot0: 6 },
            { key: "SEMANA 3", src: M.portonF, kind: "photo" as const, x0: 33, y0: 76, x1: 30, y1: 70, r0: -14, rot0: 5 },
            { key: "SEMANA 4", src: M.enganchaF, kind: "photo" as const, x0: 78, y0: 68, x1: 70, y1: 70, r0: 16, rot0: -6 },
          ];
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.paredHojas} kind="photo" z={0} scale={1.8} dim={0.62} tint={V.sky} />
              </Plane>
              <Plane z={0}>
                {SEM.map((s, i) => {
                  const t = eio(0, 1, clamp01((f - i * 4) / 38));
                  return (
                    <MediaCard key={s.key} src={s.src} kind={s.kind} label={s.key}
                      w={560} h={330} x={lerp(s.x0, s.x1, t)} y={lerp(s.y0, s.y1, t)} z={lerp(-150, 0, t)}
                      ry={lerp(s.r0, 0, t)} rot={lerp(s.rot0, 0, t)}
                      lit={i === 0 ? 0.5 + 0.5 * lit1 : 0.52}
                      litColor={i === 0 ? V.volt : V.sky}
                      sheenAt={toCF(5 + i * 4)} radius={10} startFrom={14} />
                  );
                })}
              </Plane>
              {/* la casilla 1 se enciende en voltio: el marco es el que va a tragarse la cámara */}
              <Plane z={90}>
                <div style={{
                  position: "absolute", left: "30%", top: "34%", width: 596, height: 366,
                  marginLeft: -298, marginTop: -183, borderRadius: 13, opacity: lit1,
                  border: `3px solid ${rgba(V.volt, 0.92)}`,
                  boxShadow: `0 0 ${(44 * lit1).toFixed(1)}px ${rgba(V.volt, 0.6)}, inset 0 0 ${(38 * lit1).toFixed(1)}px ${rgba(V.volt, 0.28)}`,
                }} />
                <IconPng src={M.icCalendario} x={50} y={52} size={132} z={0}
                  opacity={0.9 * clamp01((f - 12) / 12)} glow={V.ink0} />
              </Plane>
              <Plane z={200}>
                <div style={{ position: "absolute", left: 0, right: 0, top: "5%", textAlign: "center", opacity: clamp01(f / 8) }}>
                  <Head size={62} color={V.white}>EL MES</Head>
                  <div style={{ marginTop: 6 }}><Kick color={V.volt}>CUATRO SEMANAS</Kick></div>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la caja gris ES una barra: a las 20:00 está por la mitad ═════════ */}
        {acto === 2 && (() => {
          const barTop = 200, barH = 680, barW = 164;
          const level = eio(1, 0.5, clamp01((f - 8) / 46));
          const fillH = barH * level;
          const hand = lerp(30, 240, eio(0, 1, clamp01((f - 6) / 50)));   // la una → las ocho
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.cargaV} kind="video" z={0} scale={1.78} dim={0.68} tint={V.sky} startFrom={20} />
              </Plane>
              {/* LA BARRA: el nivel de la caja. Es un gráfico, va en vector; el material está al lado. */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: "50%", top: barTop, width: barW, height: barH, marginLeft: -barW / 2,
                  border: `2px solid ${rgba(V.bone, 0.34)}`, borderRadius: 8, overflow: "hidden",
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.16)} 0%, ${rgba(V.ink1, 0.9)} 100%)`,
                  boxShadow: `0 26px 64px ${rgba(V.ink0, 0.82)}, inset 0 0 40px ${rgba(V.ink0, 0.6)}`,
                }}>
                  <div style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: fillH,
                    background: `linear-gradient(180deg, ${rgba(V.volt, 0.94)} 0%, ${rgba(V.voltSoft, 0.86)} 100%)`,
                    boxShadow: `0 0 34px ${rgba(V.volt, 0.55)}`,
                  }} />
                  {/* la marca de la mitad, clavada */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: barH / 2, height: 2, background: rgba(V.white, 0.7) }} />
                </div>
                <div style={{
                  position: "absolute", left: "50%", top: barTop + barH + 16, transform: "translateX(-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 3.6, color: rgba(V.bone, 0.86),
                  textShadow: "0 4px 18px rgba(0,0,0,0.94)",
                }}>LA CAJA</div>
              </Plane>
              {/* el reloj de pared: la una → las ocho */}
              <Plane z={160}>
                <IconPng src={M.icReloj} x={79} y={21} size={214} z={0} opacity={0.94} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "79%", top: "21%", width: 4, height: 66, marginLeft: -2,
                  transformOrigin: "50% 100%", transform: `translateY(-66px) rotate(${hand.toFixed(1)}deg)`,
                  background: rgba(V.volt, 0.95), boxShadow: `0 0 18px ${rgba(V.volt, 0.8)}`,
                }} />
                <div style={{
                  position: "absolute", left: "79%", top: "36%", transform: "translateX(-50%)",
                }}><Kick color={V.bone}>1:00 → 20:00</Kick></div>
              </Plane>
              {/* EL MATERIAL: lo que se la fue comiendo toda la noche */}
              <Plane z={130}>
                <MediaCard src={M.refriF} kind="photo" w={430} h={258} x={16} y={66} z={0} ry={11}
                  lit={0.88} litColor={V.volt} label="EL REFRIGERADOR" sheenAt={toCF(12)} radius={9} />
                <MediaCard src={M.salaV} kind="video" w={430} h={258} x={85} y={66} z={0} ry={-11}
                  lit={0.92} litColor={warmTint} label="LA SALA Y LA TELE" sheenAt={toCF(34)} radius={9} startFrom={18} />
              </Plane>
              <Plane z={230}>
                <Readout value="50" unit="%" label="A LAS 20:00" at={toCF(52)} x={26} y={24} size={116} color={V.volt} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el número se estira en barra: 4.500 → 2.300. LA MITAD. ══════════ */}
        {acto === 3 && (() => {
          const H45 = 620, H23 = 317;                 // la altura ES el vatio: 2300/4500 × 620
          const topGhost = FLOOR - H45;               // 280
          const topNow = FLOOR - H23;                 // 583
          const drop = eio(0, 1, clamp01((f - 12) / 34));           // la barra fría entra desde ARRIBA
          const rise = eio(0, 1, clamp01((f - 30) / 30));           // la voltio sube desde ABAJO
          const fall = eio(0, 1, clamp01((f - 52) / 42));           // y la fría se desploma
          const hA = lerp(H45, H23, fall);
          const topA = FLOOR - hA;
          const reglaP = clamp01((f - 76) / 22);
          const mitadP = clamp01((f - 96) / 16);
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.pinzaV} kind="video" z={0} scale={1.78} dim={0.72} tint={V.volt} startFrom={6} />
              </Plane>
              <Plane z={0}>
                <Col x={31} w={360} h={hA} top={lerp(topA - 1080, topA, drop)} tint={V.sky} />
                <Col x={69} w={360} h={H23 * rise} top={FLOOR - H23 * rise} tint={V.volt} />
              </Plane>
              {/* EL MATERIAL viaja pegado al canto de cada columna */}
              <Plane z={140}>
                <MediaCard src={M.prendidoF} kind="photo" w={356} h={214} x={31} y={pc(lerp(topA - 1080, topA, drop) - 126)}
                  z={0} ry={6} lit={0.9} litColor={V.sky} label="ANTES" sheenAt={toCF(24)} radius={8} />
                {rise > 0.02 && (
                  <MediaCard src={M.pinzaV} kind="video" w={356} h={214} x={69} y={pc(FLOOR - H23 * rise - 126)}
                    z={0} ry={-6} lit={0.6 + 0.4 * rise} litColor={V.volt} label="LA PRIMERA SEMANA"
                    sheenAt={toCF(44)} radius={8} startFrom={6} />
                )}
              </Plane>
              {/* LA REGLA parte el alto original en dos partes iguales: la marca cae justo en 2.300 */}
              <Plane z={220}>
                <GhostLevel y={topGhost} label="4.500 W" color={V.sky} p={clamp01((f - 20) / 14)} />
                <IconPng src={M.icRegla} x={50} y={pc((topGhost + FLOOR) / 2)} size={H45 * reglaP} z={0}
                  opacity={0.92 * reglaP} rot={90} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "44%", right: "48%", top: topNow, height: 3,
                  background: rgba(V.volt, 0.95), opacity: reglaP, boxShadow: `0 0 20px ${rgba(V.volt, 0.75)}`,
                }} />
                <Readout value="4.500" unit="W" at={toCF(22)} x={31} y={pc(topGhost - 96)} size={92} color={V.sky} />
                <Readout value="2.300" unit="W" at={toCF(58)} x={69} y={pc(topNow - 96)} size={108} color={V.volt} />
              </Plane>
              {/* y LA MITAD se escribe dentro del hueco que la barra dejó vacío */}
              <Plane z={300}>
                <div style={{
                  position: "absolute", left: "50%", top: pc(topGhost + 120) + "%", transform: "translate(-50%,0)",
                  opacity: mitadP,
                }}>
                  <Bed pad={22}><Head size={78} color={V.volt}>LA MITAD</Head></Bed>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · misma barra, misma inercia: 4.500 → 1.900 ═══════════════════════ */}
        {acto === 4 && (() => {
          const H45 = 620, H19 = 262;                 // 1900/4500 × 620
          const topGhost = FLOOR - H45;
          const topNow = FLOOR - H19;
          const drop = eio(0, 1, clamp01((f - 8) / 30));
          const fall = eio(0, 1, clamp01((f - 40) / 54));
          const hA = lerp(H45, H19, fall);
          const topA = FLOOR - hA;
          const caja = eio(0, 1, clamp01((f - 26) / 44));           // la caja gris entra desde ABAJO
          const suelta = eio(0, 1, clamp01((f - 56) / 46));         // el calentador se suelta y cuelga de ella
          const cx = lerp(30, 72, suelta);
          const cy = lerp(150, 566, suelta) + Math.sin(suelta * Math.PI) * -90;
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.tableroV} kind="video" z={0} scale={1.78} dim={0.72} tint={warmTint} />
              </Plane>
              {/* LA LÍNEA FRÍA DE LA CASA: de acá colgaba el calentador (viene desde ARRIBA) */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 150, height: 3,
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0)}, ${rgba(V.sky, 0.8)} 14%, ${rgba(V.sky, 0.8)} 86%, ${rgba(V.sky, 0)})`,
                  boxShadow: `0 0 24px ${rgba(V.sky, 0.4)}`, opacity: clamp01(f / 10),
                }} />
                <div style={{
                  position: "absolute", left: `${cx.toFixed(2)}%`, top: 150, width: 2, height: Math.max(0, cy - 150),
                  background: rgba(V.sky, 0.5 * (1 - suelta)),
                }} />
              </Plane>
              <Plane z={0}>
                <Col x={30} w={370} h={hA} top={lerp(topA - 1080, topA, drop)} tint={V.sky} />
                <IconPng src={M.icCaja} x={72} y={pc(lerp(1160, 742, caja))} size={310} z={0}
                  opacity={0.96} glow={V.ink0} />
              </Plane>
              <Plane z={150}>
                <MediaCard src={M.calentadorV} kind="video" w={356} h={214} x={30} y={pc(lerp(topA - 1080, topA, drop) - 126)}
                  z={0} ry={7} lit={0.92} litColor={V.sky} label="EL CALENTADOR" sheenAt={toCF(20)} radius={8} />
                <MediaCard src={M.tableroV} kind="video" w={412} h={248} x={72} y={28} z={0} ry={-9}
                  lit={0.95} litColor={warmTint} label="LAS 8 DE LA NOCHE" sheenAt={toCF(48)} radius={8} />
              </Plane>
              <Plane z={240}>
                <IconPng src={M.icCalentador} x={cx} y={pc(cy)} size={168} z={0} opacity={0.96}
                  rot={lerp(0, 8, suelta)} glow={V.ink0} />
                <GhostLevel y={topGhost} label="4.500 W" color={V.sky} p={clamp01((f - 16) / 14)} />
                <Readout value="1.900" unit="W" at={toCF(74)} x={30} y={pc(topNow - 100)} size={112} color={V.volt} />
              </Plane>
              <Plane z={310}>
                <div style={{
                  position: "absolute", left: "72%", top: "82%", transform: "translateX(-50%)",
                  opacity: clamp01((f - 92) / 14), textAlign: "center",
                }}>
                  <Kick color={V.volt}>AHORA CUELGA DE LA CAJA</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · el sol del portón es la cara de un DIAL: 5,75 → 3,45 kW ════════ */}
        {acto === 5 && (() => {
          const morph = eio(0, 1, clamp01((f - 4) / 34));           // el rectángulo de sol se vuelve dial
          const spin = eio(0, 1, clamp01((f - 36) / 56));           // y el dial gira
          const back = eio(0, 1, clamp01((f - 118) / 28));          // y se aleja: vuelve a ser el rectángulo
          const shape = clamp01(morph - back);
          const needle = lerp(84, -2, spin);                        // 5,75 kW → 3,45 kW
          const dial = lerp(300, 470, shape);
          const roof = lerp(90, 300, spin);                         // el techo que pone la compañía
          const dx = lerp(66, 62, shape), dy = lerp(38, 40, shape);
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.portonV} kind="video" z={0} scale={1.78} dim={0.44} tint={V.torch} />
              </Plane>
              {/* EL DIAL: es un instrumento, va en vector. Adentro corre MATERIAL REAL. */}
              <Plane z={60}>
                <div style={{
                  position: "absolute", left: `${dx}%`, top: `${dy}%`, width: dial, height: dial,
                  marginLeft: -dial / 2, marginTop: -dial / 2,
                  borderRadius: `${lerp(8, dial / 2, shape)}px`,
                  border: `${lerp(4, 9, shape)}px solid ${rgba(V.volt, 0.88)}`,
                  boxShadow: `0 0 ${(58 * shape + 18).toFixed(0)}px ${rgba(V.torch, 0.4)}, 0 30px 70px ${rgba(V.ink0, 0.8)}`,
                  background: `radial-gradient(circle at 40% 32%, ${rgba(V.torch, 0.22)}, ${rgba(V.ink1, 0.94)} 72%)`,
                }} />
                {/* las marcas del dial */}
                {Array.from({ length: 15 }, (_, i) => {
                  const a = -130 + (i / 14) * 260;
                  const big = i % 7 === 0;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${dx}%`, top: `${dy}%`, width: big ? 4 : 2, height: big ? 30 : 18,
                      marginLeft: big ? -2 : -1, transformOrigin: "50% 0%",
                      transform: `rotate(${a}deg) translateY(${dial / 2 - 34}px)`,
                      background: rgba(V.bone, (big ? 0.85 : 0.5) * shape),
                    }} />
                  );
                })}
                {/* la aguja */}
                <div style={{
                  position: "absolute", left: `${dx}%`, top: `${dy}%`, width: 6, height: dial / 2 - 46, marginLeft: -3,
                  transformOrigin: "50% 100%",
                  transform: `translateY(${-(dial / 2 - 46)}px) rotate(${needle.toFixed(1)}deg)`,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.98)}, ${rgba(V.voltSoft, 0.7)})`,
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.8 * shape)}`, opacity: shape,
                }} />
                {/* MATERIAL REAL adentro del dial: los diez minutos de teléfono */}
                <MediaCard src={M.cuelgaV} kind="video" w={dial - 96} h={dial - 96} x={dx} y={dy} z={30}
                  lit={0.85} litColor={V.torch} radius={(dial - 96) / 2} sheenAt={toCF(40)} opacity={shape} />
                <IconPng src={M.icSol} x={dx} y={dy - 21} size={lerp(150, 88, shape)} z={0}
                  opacity={0.5 * (1 - shape) + 0.22} glow={V.ink0} />
              </Plane>
              {/* EL TECHO que pone la compañía: baja desde ARRIBA y en frío, atado al dial */}
              <Plane z={130}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: roof, height: 4,
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0)}, ${rgba(V.sky, 0.92)} 10%, ${rgba(V.sky, 0.92)} 90%, ${rgba(V.sky, 0)})`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.55)}`,
                }} />
                <div style={{ position: "absolute", left: "9%", top: roof - 52 }}>
                  <Kick color={V.sky}>EL TECHO DE LA COMPAÑÍA</Kick>
                </div>
              </Plane>
              {/* LA CASA sigue encendida: ninguna ventana se apaga cuando el techo pasa al lado */}
              <Plane z={-120}>
                {Array.from({ length: 7 }, (_, i) => {
                  const hh = 130 + rnd(i * 3.7) * 44;
                  return (
                    <div key={i} style={{ position: "absolute", left: 96 + i * 190, top: FLOOR - hh, width: 156, height: hh }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                        background: `linear-gradient(180deg, ${rgba(V.ink2, 0.96)}, ${rgba(V.ink0, 1)})`,
                        clipPath: "polygon(50% 0%, 100% 24%, 100% 100%, 0% 100%, 0% 24%)",
                        boxShadow: `0 12px 28px ${rgba(V.ink0, 0.9)}`,
                      }} />
                      {[0, 1].map((w) => (
                        <div key={w} style={{
                          position: "absolute", left: 30 + w * 62, bottom: 26, width: 40, height: 38,
                          background: rgba(V.amber, 0.9),
                          boxShadow: `0 0 24px ${rgba(V.amber, 0.7)}`,
                        }} />
                      ))}
                    </div>
                  );
                })}
              </Plane>
              <Plane z={240}>
                <MediaCard src={M.prendidoF} kind="photo" w={370} h={222} x={16} y={73} z={0} ry={10}
                  lit={0.94} litColor={V.amber} label="NADA SE APAGA" sheenAt={toCF(62)} radius={8} />
                <Readout value="3,45" unit="kW" label="POTENCIA CONTRATADA" at={toCF(86)} x={62} y={80} size={116} color={V.volt} />
                <div style={{
                  position: "absolute", left: "62%", top: "12%", transform: "translateX(-50%)", textAlign: "center",
                  opacity: clamp01((f - 20) / 12) * (1 - back),
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: 3,
                    color: rgba(V.sky, 0.8), textDecoration: "line-through",
                    textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                  }}>5,75 kW</div>
                </div>
                <div style={{ position: "absolute", left: "16%", top: "88%", transform: "translate(-50%,0)", width: 470, opacity: clamp01((f - 70) / 16) }}>
                  <Body size={30} color={V.bone}>Diez minutos de teléfono. Sin costo, sin visita, sin obra.</Body>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · las dos cosas a la vez: la suma toca el techo y se parte ════════ */}
        {acto === 6 && (() => {
          const ROOF = 300;
          const h1 = eio(0, 330, clamp01((f - 4) / 30));            // la soldadura sube
          const h2 = eio(0, 270, clamp01((f - 26) / 32));           // el horno se apila encima
          const touch = clamp01((f - 58) / 6);
          const brk = clamp01((f - 64) / 6);
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.soldadoraF} kind="photo" z={0} scale={1.78} dim={0.66} tint={V.sky} />
              </Plane>
              <Plane z={0}>
                <Col x={44} w={330} h={h1} top={FLOOR - h1} tint={V.torch} />
                <Col x={44} w={330} h={h2} top={FLOOR - h1 - h2} tint={V.amber} />
              </Plane>
              {/* EL TECHO heredado del acto 5, en el mismo sitio, y el punto donde se parte */}
              <Plane z={120}>
                <div style={{
                  position: "absolute", left: 0, right: "50%", top: ROOF, height: 4,
                  transform: `translateX(${(-160 * brk).toFixed(1)}px) rotate(${(-2.4 * brk).toFixed(2)}deg)`,
                  transformOrigin: "0% 50%",
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0)}, ${rgba(V.sky, 0.92)} 12%, ${rgba(V.sky, 0.92)} 100%)`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.5)}`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", right: 0, top: ROOF, height: 4,
                  transform: `translateX(${(160 * brk).toFixed(1)}px) rotate(${(2.4 * brk).toFixed(2)}deg)`,
                  transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0.92)} 0%, ${rgba(V.sky, 0.92)} 88%, ${rgba(V.sky, 0)})`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.5)}`,
                }} />
                <div style={{ position: "absolute", left: "9%", top: ROOF - 52 }}>
                  <Kick color={V.sky}>3,45 kW</Kick>
                </div>
                {/* el fogonazo en el punto exacto del contacto (4 frames, no es un fundido) */}
                {touch > 0 && brk < 1 && (
                  <div style={{
                    position: "absolute", left: "44%", top: ROOF, width: 460, height: 460,
                    marginLeft: -230, marginTop: -230, borderRadius: "50%",
                    background: `radial-gradient(circle, ${rgba(V.white, 0.6 * (1 - brk))} 0%, rgba(0,0,0,0) 62%)`,
                    mixBlendMode: "screen",
                  }} />
                )}
              </Plane>
              <Plane z={180}>
                <MediaCard src={M.soldadoraV} kind="video" w={404} h={242} x={17} y={44} z={0} ry={11}
                  lit={0.95} litColor={V.torch} label="LA SOLDADORA" sheenAt={toCF(10)} radius={8} startFrom={24} />
                <MediaCard src={M.hornoV} kind="video" w={404} h={242} x={79} y={44} z={0} ry={-11}
                  lit={0.95} litColor={V.amber} label="EL HORNO" sheenAt={toCF(32)} radius={8} startFrom={24} />
                <IconPng src={M.icBreaker} x={44} y={pc(ROOF - 110)} size={128} z={0}
                  opacity={0.95 * clamp01((f - 60) / 8)} rot={lerp(0, 18, brk)} glow={V.ink0} />
              </Plane>
              <Plane z={260}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "83%", textAlign: "center",
                  opacity: clamp01((f - 40) / 12),
                }}>
                  <Head size={62} color={V.bone}>LAS DOS COSAS A LA VEZ</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 7 · la barra se acuesta: el día entero, un pico cada ocho minutos ═══ */}
        {acto === 7 && (() => {
          const LINE = 620, X0 = 130, X1 = 1810, N = 44;
          const step = (X1 - X0) / (N - 1);
          const solid = clamp01((f - 40) / 16);
          const swing = Math.sin(cf / 38) * 4;
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.congeladorV} kind="video" z={0} scale={1.78} dim={0.7} tint={V.sky} startFrom={24} />
              </Plane>
              {/* EL DÍA ENTERO: esto ES un gráfico de demanda, va en vector */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: X0, top: LINE, width: eio(0, X1 - X0, clamp01(f / 14)), height: 3,
                  background: rgba(V.bone, 0.55),
                }} />
                {Array.from({ length: N }, (_, i) => {
                  const on = clamp01((f - (5 + i * (0.62 + rnd(i * 2.3) * 0.16))) / 3);
                  if (on <= 0) return null;
                  const hh = (70 + rnd(i * 5.1) * 22) * on;
                  const w = lerp(7, step + 1, solid);
                  return (
                    <div key={i} style={{
                      position: "absolute", left: X0 + i * step - w / 2, top: LINE - hh, width: w, height: hh,
                      background: `linear-gradient(180deg, ${rgba(V.volt, 0.95)}, ${rgba(V.voltSoft, 0.8)})`,
                      boxShadow: `0 0 ${(16 * on).toFixed(1)}px ${rgba(V.volt, 0.6 * on)}`,
                    }} />
                  );
                })}
                <div style={{
                  position: "absolute", left: X0, top: LINE - 84, width: X1 - X0, height: 84,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.9)}, ${rgba(V.voltSoft, 0.78)})`,
                  boxShadow: `0 0 40px ${rgba(V.volt, 0.55)}`, opacity: solid,
                }} />
              </Plane>
              <Plane z={150}>
                <MediaCard src={M.enganchaV} kind="video" w={440} h={264} x={21} y={29} z={0} ry={10}
                  lit={0.95} litColor={V.volt} label="LA PINZA PUESTA TODO EL DÍA" sheenAt={toCF(8)} radius={8} startFrom={24} />
                <IconPng src={M.icCongelador} x={80} y={30} size={210} z={0} opacity={0.94} glow={V.ink0} />
                <IconPng src={M.icBombilla} x={50} y={6} size={130} z={0} opacity={0.9} rot={swing} glow={V.ink0} />
              </Plane>
              <Plane z={240}>
                <Readout value="8" unit="min" label="ARRANCA CADA" at={toCF(24)} x={80} y={62} size={128} color={V.volt} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "78%", textAlign: "center", opacity: solid }}>
                  <Head size={64} color={V.volt}>CADA OCHO.</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 8 · el peine se comprime en un BLOQUE: 1 kWh por día ═══════════════ */}
        {acto === 8 && (() => {
          const squash = eio(0, 1, clamp01(f / 30));                // el peine se aplasta
          const drop = clamp01((f - 30) / 22);
          const bounce = drop < 1 ? Math.sin(drop * Math.PI) * -40 : 0;
          const bw = lerp(1680, 470, squash), bh = lerp(84, 320, squash);
          const by = lerp(560, 596, drop) + bounce;
          const dust = clamp01((f - 50) / 30);
          const bill = eio(0, 1, clamp01((f - 74) / 34));
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.gomaNuevaF} kind="photo" z={0} scale={1.78} dim={0.7} tint={warmTint} />
              </Plane>
              {/* el polvo que levanta al caer */}
              <Plane z={-60}>
                {Array.from({ length: 16 }, (_, i) => {
                  const o = rnd(i * 3.1);
                  const sp = clamp01(dust * (0.7 + o * 0.6));
                  const s = 150 + o * 260;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: 960 + lerp(0, (o - 0.5) * 1400, sp) - s / 2,
                      top: by + bh / 2 - s / 2 + lerp(0, -60 * o, sp),
                      width: s, height: s, borderRadius: "50%",
                      background: `radial-gradient(circle, ${rgba(V.concrete, 0.24 * Math.sin(sp * Math.PI))}, rgba(0,0,0,0) 66%)`,
                      filter: "blur(16px)",
                    }} />
                  );
                })}
              </Plane>
              {/* EL BLOQUE: cara frontal de MATERIAL REAL + tapa y canto de hormigón (tiene peso) */}
              <Plane z={20}>
                <div style={{
                  position: "absolute", left: "50%", top: by - bh / 2 - 34, width: bw, height: 36, marginLeft: -bw / 2,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.5)}, ${rgba(V.ink2, 0.98)})`,
                  transform: "skewX(-32deg)", transformOrigin: "left bottom", opacity: squash,
                }} />
                <div style={{
                  position: "absolute", left: `calc(50% + ${bw / 2}px)`, top: by - bh / 2, width: 40, height: bh,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.3)}, ${rgba(V.ink0, 0.99)})`,
                  transform: "skewY(-30deg)", transformOrigin: "left top", opacity: squash,
                }} />
                <MediaCard src={M.enganchaF} kind="photo" w={bw} h={bh} x={50} y={pc(by)} z={0}
                  lit={0.9} litColor={V.volt} label={squash > 0.7 ? "1 kWh AL DÍA" : undefined}
                  sheenAt={toCF(34)} radius={6} />
              </Plane>
              {/* la junta mal cerrada: el hilo de niebla fría que nunca deja de salir */}
              <Plane z={90}>
                {Array.from({ length: 22 }, (_, i) => {
                  const life = ((cf * (0.9 + rnd(i * 4.4) * 0.7) + rnd(i * 7.1) * 120) % 120) / 120;
                  const s = 26 + rnd(i * 2.2) * 40;
                  return (
                    <div key={i} style={{
                      position: "absolute",
                      left: 960 - bw / 2 + 34 + rnd(i * 9.3) * 60 + Math.sin(life * 5 + i) * 22 - s / 2,
                      top: by - bh / 2 - life * 300 - s / 2,
                      width: s, height: s, borderRadius: "50%",
                      background: `radial-gradient(circle, ${rgba(V.sky, 0.3 * (1 - life) * squash)}, rgba(0,0,0,0) 70%)`,
                      filter: "blur(9px)",
                    }} />
                  );
                })}
              </Plane>
              <Plane z={200}>
                <MediaCard src={M.gomaPartidaF} kind="photo" w={368} h={222} x={17} y={76} z={0} ry={12}
                  lit={0.92} litColor={V.sky} label="LA GOMA PARTIDA" sheenAt={toCF(58)} radius={8} />
                <IconPng src={M.icBillete} x={lerp(84, 80, bill)} y={pc(lerp(1160, 706, bill))} size={116} z={0}
                  opacity={0.96 * bill} glow={V.ink0} />
                <IconPng src={M.icPinza} x={88} y={26} size={140} z={0} opacity={0.55} glow={V.ink0} />
              </Plane>
              <Plane z={280}>
                <Readout value="1" unit="kWh" label="TODOS LOS DÍAS, ÉL SOLO" at={toCF(48)} x={50} y={22} size={140} color={V.volt} />
                <Readout value="3" unit="$" label="LA GOMA" at={toCF(96)} x={80} y={57} size={82} color={V.amber} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "88%", textAlign: "center", opacity: clamp01((f - 108) / 16) }}>
                  <Kick color={V.bone}>NUNCA TERMINABA DE ENFRIAR</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 9 · los escalones son la base: 111 contra 44 ═══════════════════════ */}
        {acto === 9 && (() => {
          const BASE = 860, H111 = 600, H44 = 238;    // 44/111 × 600
          const top111 = BASE - H111, top44 = BASE - H44;
          const drop = eio(0, 1, clamp01((f - 6) / 34));
          const rise = eio(0, 1, clamp01((f - 26) / 36));
          const gap = clamp01((f - 62) / 22);
          const salida = eio(0, 1, clamp01((f - 96) / 40));         // el portal baja por delante y tapa
          const apart = eio(0, 1, clamp01((f - 92) / 34));
          const xA = lerp(30, 6, apart), xB = lerp(70, 94, apart);
          return (
            <>
              <Plane z={-520}>
                <PhotoPlane src={M.escalonesV} kind="video" z={0} scale={1.78} dim={0.62} tint={V.sky} />
              </Plane>
              {/* los escalones de la casa, ya convertidos en la base del gráfico */}
              <Plane z={-160}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    position: "absolute", left: 210 - i * 96, right: 210 - i * 96, top: BASE + i * 62, height: 64,
                    background: `linear-gradient(180deg, ${rgba(V.concrete, 0.32)}, ${rgba(V.ink1, 0.99)})`,
                    boxShadow: `0 14px 30px ${rgba(V.ink0, 0.86)}`,
                  }} />
                ))}
              </Plane>
              <Plane z={0}>
                <Col x={xA} w={352} h={H111} top={lerp(top111 - 1080, top111, drop)} tint={V.sky} />
                <Col x={xB} w={352} h={H44 * rise} top={BASE - H44 * rise} tint={V.volt} />
              </Plane>
              {/* el hueco entre las dos se llena de luz voltio DESDE ABAJO */}
              <Plane z={-60}>
                <div style={{
                  position: "absolute", left: `${xA}%`, right: `${100 - xB}%`, top: top111, height: top44 - top111,
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.4 * gap)} 0%, ${rgba(V.volt, 0.05 * gap)} 74%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>
              <Plane z={150}>
                <MediaCard src={M.facturasF} kind="photo" w={348} h={210} x={xA} y={pc(lerp(top111 - 1080, top111, drop) - 124)}
                  z={0} ry={8} lit={0.9} litColor={V.sky} label="EL AÑO PASADO" sheenAt={toCF(22)} radius={8} />
                {rise > 0.02 && (
                  <MediaCard src={M.ernestoV} kind="video" w={348} h={210} x={xB} y={pc(BASE - H44 * rise - 124)}
                    z={0} ry={-8} lit={0.6 + 0.4 * rise} litColor={V.volt} label="ESTE MES" sheenAt={toCF(46)} radius={8} />
                )}
              </Plane>
              <Plane z={250}>
                <Readout value="111" unit="$" at={toCF(30)} x={xA} y={pc(top111 - 100)} size={118} color={V.sky} />
                <Readout value="44" unit="$" at={toCF(56)} x={xB} y={pc(top44 - 100)} size={132} color={V.volt} />
                <IconPng src={M.icMedidor} x={50} y={12} size={124} z={0} opacity={0.5} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "50%", top: `${pc(top111 + (top44 - top111) * 0.42).toFixed(2)}%`,
                  transform: `translate(-50%,-50%) scale(${lerp(0.5, 1, gap).toFixed(3)})`, opacity: gap, textAlign: "center",
                }}>
                  <Num size={190} color={V.volt}>60 %</Num>
                  <div style={{ marginTop: 4 }}>
                    <span style={{
                      fontFamily: F_BODY, fontWeight: 700, fontSize: 34, letterSpacing: 5.4, color: V.bone,
                      textShadow: "0 4px 18px rgba(0,0,0,0.94)",
                    }}>MENOS</span>
                  </div>
                </div>
              </Plane>
              {/* REMATE · el portal de la casa BAJA por delante y tapa el cuadro: oclusión por materia */}
              {salida > 0 && (
                <Plane z={420}>
                  <MediaCard src={M.umbralV} kind="video" w={2300} h={1480} x={50} y={lerp(-62, 50, salida)} z={0}
                    lit={0.9} litColor={V.sky} radius={0} sheenAt={toCF(120)} />
                </Plane>
              )}
            </>
          );
        })()}
      </Layers>

      {/* ═══ EL APAGÓN DEL ACTO 6 · en UN frame se entierra todo menos la franja de calle ══ */}
      {acto === 6 && (() => {
        const k = clamp01(f - 69);
        if (k <= 0) return null;
        return (
          <>
            <AbsoluteFill style={{ background: rgba(V.ink0, 0.985) }} />
            <AbsoluteFill style={{
              background: `linear-gradient(0deg, ${rgba(V.sky, 0.52)} 0%, ${rgba(V.sky, 0.13)} 7%, rgba(0,0,0,0) 16%)`,
            }} />
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0, height: 5,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.8)} 20%, ${rgba(V.sky, 0.8)} 80%, rgba(0,0,0,0))`,
              boxShadow: `0 0 44px ${rgba(V.sky, 0.6)}`,
            }} />
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
