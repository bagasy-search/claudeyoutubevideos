// MovS5B.tsx — MOVIMIENTO S5B · "LA HOJA DE LOS 60 APARATOS, Y LO QUE LA CAJA ALIMENTA DE NOCHE"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 6 actos · 683.580 → 759.230 ms · 2270 frames @30.
//
// ⭐ ACÁ VIVE LA PRIMERA CTA, y son TRES ACTOS SOBRE LA MISMA HOJA. La hoja NO se remonta entre
// actos: es UNA sola página (`<Hoja/>`) cuyo contenido y cuya cámara evolucionan como función pura
// de `gFrame`. Los planos reales de él con el cuaderno y la pinza caen ENTRE acto y acto (los pone
// el Main), y cuando volvemos, la hoja está más adelante — nunca de vuelta al principio.
//   acto 1 → la página se endereza (rotateX 32° → 0) y se escriben los 6 primeros renglones, en el
//            desorden en que los midió, con tiempo de lectura real;
//   acto 2 → las 60 filas se completan en un barrido y después se REORDENAN solas: cada fila viaja
//            de su casillero medido a su casillero por consumo, las barras arman la escalera y el
//            calentador de agua sube al primer puesto y se queda encendido más fuerte;
//   acto 3 → la cámara se despega un paso, la página entra entera en cuadro y el rótulo de esquina
//            crece hasta ser legible.
// ⛔ REGLA DE LA LÁMINA, verificada a mano: NI UN PRECIO, NI UNA URL, NI UN BOTÓN, NI UN QR.
//    Lo único que se dice es que es material de la guía y que está abajo, en la descripción.
//    El texto de las 60 filas es texto REAL de React (no una imagen con letras): se lee nítido.
//
// DESPUÉS la hoja se va y volvemos al garaje, de noche, con la caja:
//   acto 4 → de la regleta salen tres hilos voltio hacia tres tarjetas con MATERIAL REAL adentro;
//   acto 5 → la lámpara desnuda se apaga, el reloj barre a la 1:00 y la caja se llena desde abajo;
//   acto 6 → la barra llega arriba, el hilo cálido se corta, el reloj barre a las 7:00, la luz se
//            INVIERTE por los MISMOS tres hilos, y todo se apaga menos un punto verde.
//
// UNA cámara: `camAt(gFrame)` — un `gcam` monótono (z −200 → +640) + una grúa continua. La hoja
// tiene ADEMÁS su propia deriva (`hojaAt`), que es la que la endereza y la aleja: dos movimientos
// encadenados, ninguno de los dos vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: la lámpara desnuda del banco (VOLT cálido) sostiene los tres actos de la hoja; en el acto
// 5 se apaga y sólo queda la franja fría de la calle bajo el portón; en el acto 6 esa franja pasa a
// gris de amanecer. La intensidad global baja de 1,05 a 0,22 sin un solo corte.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-243 · LÁMINA "LOS 60 APARATOS"          material: CLIP él con el cuaderno + FOTO la pinza
//   entra  cam {la hoja de canto, rotateX 32°, escala 0.94} luz {lámpara del banco, key 0.30}
//   sale   cam {hoja plana, escala 0.90, bajando}           luz {key 0.36}
//   ── FRONTERA A ···· LA MISMA HOJA: la cámara sigue bajando por la página, no hay remonte. ··
// ACTO 2 · g243-611 · LÁMINA "SE COMPLETAN Y SE ORDENAN"   material: CLIP señala la primera fila + FOTO última fila
//   entra  cam {bajando por la hoja, escala 0.90}           luz {key 0.36}
//   sale   cam {un paso atrás, escala 0.53, página casi entera} luz {key 0.42}
//   ── FRONTERA B ···· MATCH-CUT DE ESCALA sobre la misma página: se aleja, no se corta. ······
// ACTO 3 · g611-1746 · LÁMINA "MATERIAL DE LA GUÍA"        material: FOTO pila de hojas + CLIP levanta la vista
//   entra  cam {página casi entera, escala 0.53}            luz {key 0.42}
//   sale   cam {página entera, escala 0.42, rótulo grande}  luz {key 0.46}
//   ── FRONTERA C ···· BARRIDO DE MATERIAL: los clips reales del garaje tapan y sale la regleta. ·
// ACTO 4 · g1746-1968 · "LO QUE QUIERO QUE ALIMENTE"  material: CLIP regleta + CLIP congelador + FOTO refrigerador + FOTO router
//   entra  cam {saliendo del enchufe de la regleta, grúa +118} luz {lámpara aún encendida, key 0.50}
//   sale   cam {tres hilos abiertos sobre el piso}          luz {key 0.54}
//   ── FRONTERA D ···· LA LÁMPARA SE APAGA: la penumbra tapa, la cámara sigue derivando. ······
// ACTO 5 · g1968-2138 · "LA CAJA SE DESPIERTA A LA 1"  material: CLIP reloj + CLIP caja cargando + CLIP cable de carga
//   entra  cam {grúa +58, penumbra}                         luz {sólo la franja fría de la calle}
//   sale   cam {grúa −36, pegada a la caja llena}           luz {int 0.5}
//   ── FRONTERA E ···· LA MISMA BARRA: llega arriba y la luz se INVIERTE de sentido. ·········
// ACTO 6 · g2138-2270 · "Y A LAS 7 EMPIEZA A DEVOLVERLA"  material: CLIP reloj + FOTO amanecer bajo el portón + CLIP LED verde
//   entra  cam {grúa −36}                                   luz {franja de calle azul → amanecer}
//   sale   cam {grúa −104, cerrando sobre el punto verde}   luz {int 0.22, todo apagado menos el LED}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const B1 = 0, B2 = 243, B3 = 611, B4 = 1746, B5 = 1968, B6 = 2138;
const G_END = 2270;
const START: Record<number, number> = { 1: B1, 2: B2, 3: B3, 4: B4, 5: B5, 6: B6 };

// ── EL MATERIAL REAL (todas las rutas verificadas en disco) ──────────────────────────────────
const M = {
  bancoF: "img/cmeenchufe/cmee_s5_pasa_en_limpio.png",
  cuadernoV: "broll/cmeenchufe/cmee_s5_sentado_cajon_cuaderno.mp4",
  pinzaF: "img/cmeenchufe/cmee_s5_pinza_cable_entrada.png",
  senalaV: "broll/cmeenchufe/cmee_s5_senala_primera_fila.mp4",
  ultimaF: "img/cmeenchufe/cmee_s5_ultima_fila_cargador.png",
  pilaF: "img/cmeenchufe/cmee_s6_senala_pared_hojas.png",
  levantaV: "broll/cmeenchufe/cmee_s5_levanta_vista_hoja.mp4",
  regletaV: "broll/cmeenchufe/cmee_s5_regleta_adelante.mp4",
  regletaF: "img/cmeenchufe/cmee_s5_regleta_adelante.png",
  congeladorV: "broll/cmeenchufe/cmee_s7_congelador_arranca.mp4",
  refriF: "img/cmeenchufe/cmee_s7_refri_noche.png",
  routerF: "img/cmeenchufe/cmee_s7_router_repisa.png",
  relojV: "broll/cmeenchufe/cmee_s4_reloj_pared_3am.mp4",
  cargaV: "broll/cmeenchufe/cmee_s7_caja_carga_madrugada.mp4",
  cableV: "broll/cmeenchufe/cmee_s5_cable_carga_enchufe.mp4",
  paredF: "img/cmeenchufe/cmee_s5_arrima_pared.png",
  amanecerF: "img/cmeenchufe/cmee_s7_buzon_manana_fria.png",
  ledV: "broll/cmeenchufe/cmee_s5_led_verde_penumbra.mp4",
  icCuaderno: "img/cmeenchufe/cmee_ic_cuaderno.png",
  icEnchufe: "img/cmeenchufe/cmee_ic_enchufe.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
};

// ══════════════════════════════════════════════════════════════════════════════════════════════
// LA HOJA — LOS 60 APARATOS DE UNA CASA NORMAL
// Texto REAL de React (nada de imágenes con letras): se lee nítido, sin erratas, a cualquier escala.
// Los vatios son consumo EN MARCHA medido con pinza en la entrada de cada circuito.
// ══════════════════════════════════════════════════════════════════════════════════════════════
type Ap = { n: string; w: number };
const APARATOS: Ap[] = [
  { n: "Calentador de agua", w: 4500 },
  { n: "Secadora de ropa", w: 3000 },
  { n: "Horno eléctrico", w: 2400 },
  { n: "Aire acondicionado central", w: 2200 },
  { n: "Estufa eléctrica del cuarto", w: 1800 },
  { n: "Parrilla eléctrica", w: 1600 },
  { n: "Hervidor eléctrico", w: 1500 },
  { n: "Plancha de ropa", w: 1400 },
  { n: "Secador de pelo", w: 1250 },
  { n: "Microondas", w: 1150 },
  { n: "Aspiradora", w: 1100 },
  { n: "Lavavajillas", w: 1050 },
  { n: "Freidora de aire", w: 950 },
  { n: "Tostadora", w: 900 },
  { n: "Cafetera de goteo", w: 850 },
  { n: "Aire de ventana", w: 820 },
  { n: "Calefactor del baño", w: 750 },
  { n: "Sandwichera", w: 700 },
  { n: "Bomba de agua", w: 650 },
  { n: "Licuadora", w: 600 },
  { n: "Lavadora", w: 550 },
  { n: "Deshumidificador", w: 500 },
  { n: "Compresor del garaje", w: 470 },
  { n: "Olla de cocción lenta", w: 320 },
  { n: "Congelador del garaje", w: 300 },
  { n: "Refrigerador de la cocina", w: 260 },
  { n: "Campana extractora", w: 240 },
  { n: "Televisor de 55 pulgadas", w: 180 },
  { n: "Consola de videojuegos", w: 160 },
  { n: "Computadora de escritorio", w: 150 },
  { n: "Congelador nuevo", w: 120 },
  { n: "Ventilador de techo", w: 95 },
  { n: "Ventilador de pie", w: 85 },
  { n: "Impresora imprimiendo", w: 80 },
  { n: "Máquina de coser", w: 75 },
  { n: "Televisor de 32 pulgadas", w: 70 },
  { n: "Focos del pasillo", w: 60 },
  { n: "Monitor de la computadora", w: 55 },
  { n: "Portátil cargando", w: 45 },
  { n: "Barra de sonido", w: 40 },
  { n: "Decodificador de cable", w: 35 },
  { n: "Purificador de aire", w: 32 },
  { n: "Bomba de la fuente", w: 30 },
  { n: "Router de internet", w: 22 },
  { n: "Módem", w: 18 },
  { n: "Focos LED de la cocina", w: 15 },
  { n: "Reloj del horno", w: 14 },
  { n: "Cámara de vigilancia", w: 12 },
  { n: "Timbre con cámara", w: 11 },
  { n: "Foco LED del porche", w: 10 },
  { n: "Bocina inteligente", w: 9 },
  { n: "Cargador del portátil vacío", w: 8 },
  { n: "Termostato", w: 7 },
  { n: "Cafetera en reposo", w: 6 },
  { n: "Teléfono cargando", w: 5 },
  { n: "Cepillo de dientes en la base", w: 4 },
  { n: "Microondas en reposo", w: 3 },
  { n: "Cargador del taladro", w: 2 },
  { n: "Televisor en reposo", w: 1 },
  { n: "Cargador de teléfono vacío", w: 1 },
];
// EL DESORDEN EN QUE LOS MIDIÓ: `MEDIDO[i]` es el casillero inicial del aparato `i`.
// Es una permutación fija (nada de Math.random): el calentador arranca en el casillero 21 y sube
// al primero recién cuando la hoja se ordena sola. Los seis primeros renglones que se escriben en
// el acto 1 salen de acá: secadora · foco del porche · consola · microondas · cargador · congelador.
const MEDIDO: number[] = [
  21, 0, 34, 13, 8, 33, 28, 38, 19, 3, 56, 58, 57, 41, 48, 32, 10, 14, 52, 50,
  15, 35, 54, 7, 39, 51, 26, 47, 2, 25, 5, 18, 40, 59, 36, 17, 27, 31, 46, 9,
  20, 6, 22, 44, 29, 24, 42, 12, 45, 1, 30, 4, 23, 55, 43, 16, 53, 37, 11, 49,
];

// geometría de la página (coordenadas de la HOJA, no de la pantalla)
const PAGE_W = 1560, PAGE_H = 2020, PAD = 54;
const HEAD_H = 250, COL_W = 706, COL_GAP = 40, ROW_H = 56, PER_COL = 30;
const slotX = (s: number) => PAD + (s < PER_COL ? 0 : COL_W + COL_GAP);
const slotY = (s: number) => HEAD_H + (s % PER_COL) * ROW_H;
// tiempo de lectura real: los 6 primeros renglones a ~0,87 s cada uno; el resto en el barrido
const appearAt = (s: number) => (s < 6 ? 14 + s * 26 : B2 + 10 + (s - 6) * 2.2);
// la barra es proporcional al consumo, comprimida para que 1 W siga siendo visible al lado de 4.500
const barOf = (w: number) => 60 + (COL_W - 78) * Math.pow(w / 4500, 0.42);

const Hoja: React.FC<{ g: number }> = ({ g }) => {
  const cnt = Math.min(60, 6 + Math.round(clamp01((g - (B2 + 10)) / 126) * 54));
  const reo = clamp01((g - (B2 + 148)) / 76);        // el reordenamiento
  const hot = clamp01((g - (B2 + 232)) / 18);        // el calentador se queda encendido más fuerte
  const rank = clamp01((g - (B2 + 196)) / 30);       // los puestos aparecen cuando el orden se asienta
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%", width: PAGE_W, height: PAGE_H,
      marginLeft: -PAGE_W / 2, marginTop: -PAGE_H / 2,
      background: `linear-gradient(168deg, ${rgba(V.ink2, 0.99)} 0%, ${rgba(V.ink1, 1)} 46%, ${rgba(V.ink0, 1)} 100%)`,
      border: `1px solid ${rgba(V.bone, 0.16)}`,
      boxShadow: `0 46px 120px ${rgba(V.ink0, 0.9)}, inset 0 1px 0 ${rgba(V.white, 0.16)}, inset 0 0 160px ${rgba(V.ink0, 0.55)}`,
      overflow: "hidden",
    }}>
      {/* la fibra del papel: la hoja tiene materia, no es un rectángulo plano */}
      <AbsoluteFill style={{
        opacity: 0.05, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
        backgroundSize: "3px 3px", mixBlendMode: "overlay",
      }} />
      {/* la lámpara desnuda del banco cae sobre el borde de arriba */}
      <AbsoluteFill style={{ background: `radial-gradient(80% 42% at 34% -6%, ${rgba(V.volt, 0.11)} 0%, rgba(0,0,0,0) 62%)` }} />

      {/* ── ENCABEZADO ────────────────────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: PAD, top: 48, width: PAGE_W - PAD * 2 - 250 }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 58, lineHeight: 1.05, letterSpacing: 1.2,
          color: V.white, textTransform: "uppercase", textShadow: "0 5px 24px rgba(0,0,0,0.9)",
        }}>Los 60 aparatos de una casa normal</div>
        <div style={{
          marginTop: 14, fontFamily: F_BODY, fontWeight: 500, fontSize: 26, letterSpacing: 2.2,
          color: rgba(V.bone, 0.6), textTransform: "uppercase",
        }}>Consumo real medido con pinza, no lo que dice la etiqueta</div>
      </div>
      {/* el contador de arriba a la derecha: se cuenta solo hasta llegar a 60 */}
      <div style={{ position: "absolute", right: PAD, top: 44, textAlign: "right" }}>
        <Num size={90} color={V.volt}>{cnt}</Num>
        <div style={{
          marginTop: 4, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 3.4,
          color: rgba(V.bone, 0.5), textTransform: "uppercase",
        }}>Aparatos medidos</div>
      </div>
      {/* el filete voltio bajo el encabezado */}
      <div style={{
        position: "absolute", left: PAD, right: PAD, top: HEAD_H - 62, height: 2,
        background: `linear-gradient(90deg, ${rgba(V.volt, 0.85)}, ${rgba(V.volt, 0.16)})`,
      }} />
      {[0, 1].map((c) => (
        <div key={c} style={{
          position: "absolute", left: PAD + c * (COL_W + COL_GAP), top: HEAD_H - 48, width: COL_W,
          display: "flex", justifyContent: "space-between",
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 4.2,
          color: rgba(V.bone, 0.42), textTransform: "uppercase",
        }}>
          <span>Aparato</span><span>Vatios</span>
        </div>
      ))}

      {/* ── LAS 60 FILAS ──────────────────────────────────────────────────────────────── */}
      {APARATOS.map((ap, i) => {
        const s0 = MEDIDO[i];
        const app = clamp01((g - appearAt(s0)) / 10);
        if (app <= 0) return null;
        const e = interpolate(clamp01(reo * 1.34 - rnd(i * 3.7) * 0.34), [0, 1], [0, 1], {
          easing: Easing.bezier(0.62, 0, 0.18, 1),
        });
        const x = lerp(slotX(s0), slotX(i), e);
        const y = lerp(slotY(s0), slotY(i), e);
        const dist = Math.abs(slotY(i) - slotY(s0)) + Math.abs(slotX(i) - slotX(s0));
        const lift = Math.sin(e * Math.PI) * (24 + dist * 0.05);
        const first = i === 0;
        const acc = first ? lerp(0.24, 0.62, hot) : 0.2;
        return (
          <div key={ap.n} style={{
            position: "absolute", left: x.toFixed(1) + "px", top: y.toFixed(1) + "px",
            width: COL_W, height: ROW_H - 6,
            transform: `translateZ(${lift.toFixed(1)}px)`,
            clipPath: `inset(0 ${((1 - app) * 100).toFixed(1)}% 0 0)`,
            boxShadow: lift > 4 ? `0 ${Math.round(lift * 0.7)}px ${Math.round(lift * 1.4)}px ${rgba(V.ink0, 0.7)}` : "none",
          }}>
            {/* la barra voltio proporcional: esto SÍ es un gráfico, va en vector */}
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%", width: barOf(ap.w),
              background: `linear-gradient(90deg, ${rgba(V.volt, acc)} 0%, ${rgba(V.volt, acc * 0.22)} 78%, rgba(0,0,0,0) 100%)`,
              borderLeft: `3px solid ${rgba(V.volt, first ? lerp(0.7, 1, hot) : 0.55)}`,
            }} />
            <div style={{
              position: "absolute", left: 14, top: 0, width: 44, height: "100%",
              display: "flex", alignItems: "center",
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 1,
              color: rgba(V.bone, 0.4 * rank), opacity: rank,
            }}>{i + 1}</div>
            <div style={{
              position: "absolute", left: 68, top: 0, right: 176, height: "100%",
              display: "flex", alignItems: "center",
              fontFamily: F_BODY, fontWeight: first ? 700 : 500, fontSize: 30, letterSpacing: 0.3,
              color: first ? V.white : rgba(V.white, 0.92), whiteSpace: "nowrap", overflow: "hidden",
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}>{ap.n}</div>
            <div style={{
              position: "absolute", right: 14, top: 0, width: 152, height: "100%",
              display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6,
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: 0.6,
              color: first ? V.volt : rgba(V.volt, 0.88),
              textShadow: first ? `0 0 ${(20 * hot).toFixed(1)}px ${rgba(V.volt, 0.7 * hot)}` : "none",
            }}>
              {ap.w}
              <span style={{ fontSize: 20, color: rgba(V.bone, 0.5) }}>W</span>
            </div>
          </div>
        );
      })}

      {/* ── PIE DE PÁGINA (una página de manual tiene pie de página) ──────────────────── */}
      <div style={{
        position: "absolute", left: PAD, right: PAD, bottom: 38,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 3.4,
        color: rgba(V.bone, 0.34), textTransform: "uppercase",
      }}>
        <span>Medido en mi propia casa, circuito por circuito</span>
        <span>Hoja 1</span>
      </div>
      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 76, height: 1, background: rgba(V.bone, 0.14) }} />
    </div>
  );
};

// ── EL RÓTULO DE ESQUINA — anclado a la PANTALLA, discreto, y en el acto 3 crece ────────────
// ⛔ Sin precio, sin URL, sin botón, sin QR. Sólo qué es y dónde está.
const Rotulo: React.FC<{ g: number }> = ({ g }) => {
  const grow = clamp01((g - (B3 + 22)) / 52);
  const s = lerp(1, 1.62, eio(0, 1, grow));
  const drift = Math.sin(g / 71) * 2;
  return (
    <div style={{
      position: "absolute", right: 54, bottom: 46, textAlign: "right",
      transform: `scale(${s.toFixed(3)}) translateY(${drift.toFixed(2)}px)`, transformOrigin: "100% 100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
        <div style={{ width: 26, height: 2, background: rgba(V.volt, 0.8) }} />
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 3.6,
          color: rgba(V.bone, 0.62), textTransform: "uppercase", textShadow: "0 3px 16px rgba(0,0,0,0.95)",
        }}>
          Página del manual de consumo{grow > 0.06 ? " · Material de la guía" : ""}
        </div>
      </div>
      <div style={{
        marginTop: 8, opacity: grow,
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 4.4,
        color: rgba(V.volt, 0.9), textTransform: "uppercase", textShadow: "0 3px 16px rgba(0,0,0,0.95)",
      }}>Está abajo, en la descripción</div>
    </div>
  );
};

// ── LOS TRES HILOS que salen de la regleta (actos 4 y 6: los MISMOS, en el mismo orden) ─────
const HILOS = [
  "M 300 838 C 420 762 560 560 730 420",
  "M 300 838 C 620 836 900 560 1190 366",
  "M 300 838 C 760 906 1300 838 1613 590",
];

// ── LA CAJA GRIS: el objeto protagonista del video, apoyada contra la pared ──────────────────
const Caja: React.FC<{ fill: number; front: number; glow: string }> = ({ fill, front, glow }) => (
  <div style={{ position: "absolute", left: 786, top: 548, width: 330, height: 352 }}>
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 8,
      background: `linear-gradient(158deg, ${rgba(V.concrete, 0.3)} 0%, ${rgba(V.ink2, 0.99)} 34%, ${rgba(V.ink0, 1)} 100%)`,
      boxShadow: `0 34px 74px ${rgba(V.ink0, 0.92)}, inset -22px 0 40px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.12)}`,
    }} />
    {/* la barra de carga se llena desde ABAJO (lo que ganas entra siempre desde abajo) */}
    <div style={{ position: "absolute", left: 26, top: 26, width: 46, bottom: 26, background: rgba(V.ink0, 0.86), border: `1px solid ${rgba(V.bone, 0.16)}` }}>
      <div style={{
        position: "absolute", left: 2, right: 2, bottom: 2, height: `${(clamp01(fill) * 100).toFixed(1)}%`,
        background: `linear-gradient(0deg, ${rgba(V.amber, 0.75)}, ${rgba(glow, 0.95)})`,
        boxShadow: `0 0 22px ${rgba(glow, 0.6)}`,
      }} />
    </div>
    {/* el punto del frente */}
    <div style={{
      position: "absolute", right: 40, top: 40, width: 22, height: 22, borderRadius: "50%",
      background: rgba(glow, 0.35 + 0.65 * clamp01(front)),
      boxShadow: `0 0 ${(30 * clamp01(front)).toFixed(1)}px ${rgba(glow, 0.85 * clamp01(front))}`,
    }} />
    {/* las rueditas: la caja está apoyada en el piso del garaje, no flotando */}
    {[42, 246].map((rx) => (
      <div key={rx} style={{
        position: "absolute", left: rx, bottom: -16, width: 42, height: 18, borderRadius: 9,
        background: `linear-gradient(180deg, ${rgba(V.ink2, 1)}, ${rgba(V.ink0, 1)})`,
      }} />
    ))}
  </div>
);

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -200, z1: 640, panX: 170, panY: -40, ry: -6.5, rx: 2.2, dur: G_END });
  const crane = interpolate(
    g, [0, B2, B3, B4, B5, B6, G_END],
    [0, -64, -24, 118, 58, -36, -104],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  return `${base.transform} translateY(${crane.toFixed(1)}px)`;
};

// ── LA DERIVA PROPIA DE LA HOJA: se endereza y se aleja. Encadenada, nunca vuelve a cero. ───
const hojaAt = (g: number) => {
  const K = [0, 150, B2, B2 + 140, B2 + 205, B2 + 255, B3, B3 + 112];
  const sc = interpolate(g, K, [0.94, 0.92, 0.9, 0.82, 0.55, 0.53, 0.53, 0.42], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.36, 0, 0.22, 1),
  });
  const fy = interpolate(g, K, [480, 640, 700, 1420, 1060, 1030, 1020, 1010], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.36, 0, 0.22, 1),
  });
  const tilt = interpolate(g, [0, 52], [32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.28, 0.7, 0.3, 1) });
  const roll = interpolate(g, [0, 74], [-5.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.28, 0.7, 0.3, 1) });
  return `translateY(${(((PAGE_H / 2) - fy) * sc).toFixed(1)}px) scale(${sc.toFixed(3)}) rotateX(${tilt.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg)`;
};

export const MovS5B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, B2, B3, B4, B5, B6], [0.3, 0.36, 0.42, 0.5, 0.56, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [B4, B5 + 30, B6 + 90], [0.15, 0.9, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, B3, B4, B5, B5 + 80, B6 + 70, G_END], [0.95, 1.05, 1.0, 0.62, 0.5, 0.42, 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, B4, B5, B6 + 80], [0.5, 0.6, 0.78, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const esLamina = acto <= 3;

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTOS 1-3 · LA MISMA HOJA. Cama de foto real + la página + el material del banco ═══ */}
        {esLamina && (
          <>
            {/* la cama: la hoja apoyada en el banco de madera, con el cuaderno y la pinza al lado */}
            <Plane z={-620}><PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.3} dim={0.74} tint={V.volt} /></Plane>
            {/* ⭐ LA PÁGINA. Nunca se remonta: sólo cambia su deriva, que es función de gFrame. */}
            <Plane z={0} style={{ perspective: 2400 }}>
              <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: hojaAt(gFrame), transformStyle: "preserve-3d" }}>
                <Hoja g={gFrame} />
              </div>
            </Plane>
          </>
        )}

        {/* ═══ ACTO 1 · la hoja se endereza y se escriben los seis primeros renglones ════ */}
        {acto === 1 && (() => {
          const cuad = clamp01((f - 26) / 18);
          const pin = clamp01((f - 96) / 18);
          return (
            <Plane z={300}>
              <MediaCard src={M.cuadernoV} kind="video" w={276} h={172} x={9.5} y={87} z={0}
                ry={17} rx={-4} rot={-2} startFrom={18} lit={0.95} litColor={V.volt} sheenAt={toCF(34)} radius={8}
                label="EL CUADERNO" opacity={cuad} />
              <MediaCard src={M.pinzaF} kind="photo" w={266} h={166} x={90.5} y={88} z={0}
                ry={-17} rx={-4} rot={2} lit={0.9} litColor={V.volt} sheenAt={toCF(104)} radius={8}
                label="LA PINZA" opacity={pin} />
              <IconPng src={M.icCuaderno} x={5} y={70} size={74} z={0} opacity={0.34 * cuad} rot={-10} glow={V.ink0} />
            </Plane>
          );
        })()}

        {/* ═══ ACTO 2 · se completan hasta 60 y se REORDENAN solas ══════════════════════ */}
        {acto === 2 && (() => {
          const sen = clamp01((f - 214) / 18);      // él señala la primera fila cuando el orden se asienta
          const ult = clamp01((f - 236) / 18);
          return (
            <Plane z={300}>
              <MediaCard src={M.senalaV} kind="video" w={286} h={178} x={9} y={17} z={0}
                ry={16} rx={4} startFrom={14} lit={1} litColor={V.volt} sheenAt={toCF(226)} radius={8}
                label="LA PRIMERA FILA" opacity={sen} />
              <MediaCard src={M.ultimaF} kind="photo" w={268} h={166} x={91} y={83} z={0}
                ry={-16} rx={-4} lit={0.85} litColor={V.amber} sheenAt={toCF(248)} radius={8}
                label="Y LA ÚLTIMA" opacity={ult} />
            </Plane>
          );
        })()}

        {/* ═══ ACTO 3 · la página entera en cuadro: es una hoja de un manual ════════════ */}
        {acto === 3 && (() => {
          const pila = clamp01((f - 16) / 20);
          const lev = clamp01((f - 44) / 20);
          return (
            <Plane z={300}>
              {/* el lomo de la pila de hojas iguales sobre el banco: material REAL */}
              <MediaCard src={M.pilaF} kind="photo" w={300} h={188} x={12.5} y={78} z={0}
                ry={18} rx={-4} rot={-2} lit={0.9} litColor={V.volt} sheenAt={toCF(26)} radius={8}
                label="LA MISMA PILA DE HOJAS" opacity={pila} />
              <MediaCard src={M.levantaV} kind="video" w={288} h={180} x={87.5} y={24} z={0}
                ry={-18} rx={4} startFrom={16} lit={0.92} litColor={V.volt} sheenAt={toCF(54)} radius={8}
                label="LO ARMÉ EN ESOS DÍAS" opacity={lev} />
            </Plane>
          );
        })()}

        {/* ═══ ACTO 4 · de la regleta salen tres hilos hacia lo que quiero que alimente ══ */}
        {acto === 4 && (() => {
          const cards: { src: string; kind: "video" | "photo"; x: number; y: number; lab: string; at: number }[] = [
            { src: M.congeladorV, kind: "video", x: 38, y: 30, lab: "EL CONGELADOR VIEJO", at: 14 },
            { src: M.refriF, kind: "photo", x: 62, y: 25, lab: "EL REFRIGERADOR", at: 32 },
            { src: M.routerF, kind: "photo", x: 84, y: 46, lab: "EL ROUTER", at: 50 },
          ];
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.regletaF} kind="photo" z={0} scale={1.3} dim={0.76} tint={V.volt} /></Plane>
              {/* la caja gris, a oscuras contra la pared: sigue estando siempre */}
              <Plane z={-180}><Caja fill={0.08} front={0.12} glow={V.volt} /></Plane>
              {/* LOS TRES HILOS: se encienden desde la regleta hacia afuera, uno detrás del otro */}
              <Plane z={40}>
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  {HILOS.map((d, i) => {
                    const p = clamp01((f - (8 + i * 18)) / 20);
                    return (
                      <g key={i}>
                        <path d={d} fill="none" stroke={rgba(V.bone, 0.1)} strokeWidth={7} strokeLinecap="round" />
                        <path d={d} fill="none" stroke={V.volt} strokeWidth={5} strokeLinecap="round"
                          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
                          style={{ filter: `drop-shadow(0 0 16px ${rgba(V.volt, 0.75)})` }} />
                      </g>
                    );
                  })}
                </svg>
              </Plane>
              {/* ⭐ LA REGLETA con material REAL: de acá sale todo */}
              <Plane z={200}>
                <MediaCard src={M.regletaV} kind="video" w={330} h={204} x={15} y={74} z={0}
                  ry={15} rx={-3} startFrom={20} lit={1} litColor={V.volt} sheenAt={toCF(8)} radius={9} label="LA REGLETA GRUESA" />
                <IconPng src={M.icEnchufe} x={26} y={88} size={78} z={0} opacity={0.4} rot={8} glow={V.ink0} />
              </Plane>
              {/* ⭐ LAS TRES COSAS, cada una con su material REAL adentro */}
              <Plane z={300}>
                {cards.map((c) => {
                  const ap = clamp01((f - c.at) / 16);
                  if (ap <= 0) return null;
                  return (
                    <MediaCard key={c.lab} src={c.src} kind={c.kind} w={306} h={190}
                      x={c.x} y={eio(c.y + 5, c.y, ap)} z={lerp(-80, 0, ap)}
                      ry={lerp(14, 0, ap)} startFrom={16} lit={0.5 + 0.5 * ap} litColor={V.volt}
                      label={c.lab} sheenAt={toCF(c.at + 14)} radius={9} opacity={ap} />
                  );
                })}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · la lámpara se apaga, el reloj barre a la 1:00 y la caja se llena ══ */}
        {acto === 5 && (() => {
          const off = clamp01(f / 28);                       // la lámpara desnuda se apaga
          const sweep = clamp01((f - 18) / 40);              // el reloj barre hasta la 1:00
          const fill = clamp01((f - 62) / 96);               // la barra sube desde abajo
          const hilo = clamp01((f - 54) / 26);               // el hilo cálido sube por el cable
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.paredF} kind="photo" z={0} scale={1.32} dim={lerp(0.62, 0.88, off)} tint={V.sky} /></Plane>
              {/* la lámpara desnuda muriendo */}
              <Plane z={-400}>
                <div style={{
                  position: "absolute", left: "38%", top: "-16%", width: 900, height: 700, marginLeft: -450,
                  background: `radial-gradient(circle at 50% 0%, ${rgba(V.torch, 0.2 * (1 - off))}, rgba(0,0,0,0) 66%)`,
                }} />
              </Plane>
              {/* la única fuente que queda: la franja fría de la calle bajo el portón */}
              <Plane z={-300}>
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: 128,
                  background: `linear-gradient(0deg, ${rgba(V.sky, 0.22 * off)}, rgba(0,0,0,0))`,
                }} />
              </Plane>
              <Plane z={-120}><Caja fill={fill} front={clamp01((f - 58) / 14)} glow={V.volt} /></Plane>
              {/* el hilo cálido que entra del tomacorriente y sube por el cable de carga */}
              <Plane z={-60}>
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d="M 1742 908 C 1600 908 1440 880 1292 812" fill="none" stroke={rgba(V.bone, 0.09)} strokeWidth={8} strokeLinecap="round" />
                  <path d="M 1742 908 C 1600 908 1440 880 1292 812" fill="none" stroke={V.amber} strokeWidth={5} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - hilo}
                    style={{ filter: `drop-shadow(0 0 18px ${rgba(V.amber, 0.8)})` }} />
                </svg>
              </Plane>
              {/* la cinta de precio, quieta, bajo la barra de la caja */}
              <Plane z={60}>
                <div style={{
                  position: "absolute", left: 758, top: 930, width: 386, padding: "10px 0", textAlign: "center",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink1, 0.92)} 14%, ${rgba(V.ink1, 0.92)} 86%, rgba(0,0,0,0))`,
                  borderTop: `1px solid ${rgba(V.amber, 0.42)}`, opacity: clamp01((f - 72) / 18),
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3.6,
                  color: rgba(V.amber, 0.88), textTransform: "uppercase",
                }}>6 ¢ el kilovatio · tarifa de valle</div>
              </Plane>
              {/* ⭐ EL RELOJ, material REAL, con el arco que barre hasta la 1:00 */}
              <Plane z={260}>
                <MediaCard src={M.relojV} kind="video" w={298} h={192} x={22} y={27} z={0}
                  ry={14} rx={3} startFrom={12} lit={0.7} litColor={V.sky} sheenAt={toCF(12)} radius={9} label="EL RELOJ DE PARED" />
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
                  <circle cx={422} cy={292} r={126} fill="none" stroke={rgba(V.volt, 0.75)} strokeWidth={4} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sweep}
                    transform="rotate(-90 422 292)" style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.7)})` }} />
                </svg>
                <Readout value="1:00" label="SE DESPIERTA SOLA" at={toCF(58)} x={22} y={46} size={92} color={V.volt} />
                <IconPng src={M.icReloj} x={9} y={13} size={68} z={0} opacity={0.3} rot={-8} glow={V.ink0} />
              </Plane>
              {/* ⭐ MATERIAL REAL de la caja cargando y del cable enchufado */}
              <Plane z={340}>
                <MediaCard src={M.cargaV} kind="video" w={306} h={190} x={80} y={62} z={0}
                  ry={-14} rx={2} startFrom={18} lit={0.85} litColor={V.volt} sheenAt={toCF(76)} radius={9}
                  label="CHUPANDO DE MADRUGADA" opacity={clamp01((f - 70) / 18)} />
                <MediaCard src={M.cableV} kind="video" w={280} h={174} x={13} y={80} z={0}
                  ry={15} rx={-3} startFrom={22} lit={0.78} litColor={V.amber} sheenAt={toCF(50)} radius={9}
                  label="EL CABLE DE CARGA" opacity={clamp01((f - 44) / 18)} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · la barra llega arriba y la luz se INVIERTE ══════════════════════ */}
        {acto === 6 && (() => {
          const corte = clamp01((f - 6) / 22);              // el hilo cálido se corta solo
          const sweep = clamp01((f - 8) / 30);              // el reloj barre hasta las 7
          const dev = clamp01((f - 34) / 20);               // la luz sale de la caja hacia la regleta
          const dawn = clamp01((f - 40) / 60);              // la calle pasa de azul frío a amanecer
          const apaga = clamp01((f - 74) / 44);             // todo se apaga menos un punto
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.paredF} kind="photo" z={0} scale={1.34} dim={0.88} tint={V.sky} /></Plane>
              {/* ⭐ LA CALLE BAJO EL PORTÓN: material REAL del amanecer, en una franja ancha y baja */}
              <Plane z={-380}>
                <MediaCard src={M.amanecerF} kind="photo" w={1520} h={124} x={50} y={93} z={0}
                  lit={0.4 + 0.5 * dawn} litColor={light(dawn, "sky", "torch")} radius={4} sheenAt={toCF(46)} opacity={0.9} />
              </Plane>
              <Plane z={-120}><Caja fill={1} front={1} glow={V.volt} /></Plane>
              {/* el hilo cálido que entraba se corta solo: se retira por donde vino */}
              <Plane z={-60}>
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d="M 1742 908 C 1600 908 1440 880 1292 812" fill="none" stroke={V.amber} strokeWidth={5} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={corte}
                    style={{ filter: `drop-shadow(0 0 16px ${rgba(V.amber, 0.7 * (1 - corte))})` }} />
                </svg>
              </Plane>
              {/* LA DEVOLUCIÓN: baja de la caja a la regleta y vuelve a encender los MISMOS tres hilos */}
              <Plane z={40}>
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d="M 806 880 C 700 906 480 900 300 838" fill="none" stroke={V.volt} strokeWidth={6} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((f - 26) / 16)}
                    style={{ filter: `drop-shadow(0 0 18px ${rgba(V.volt, 0.8)})` }} />
                  {HILOS.map((d, i) => {
                    const p = clamp01((dev * 1.5) - i * 0.3);
                    return (
                      <path key={i} d={d} fill="none" stroke={V.volt} strokeWidth={5} strokeLinecap="round"
                        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
                        style={{ filter: `drop-shadow(0 0 16px ${rgba(V.volt, 0.7)})`, opacity: 1 - apaga * 0.92 }} />
                    );
                  })}
                </svg>
              </Plane>
              <Plane z={220}>
                <MediaCard src={M.relojV} kind="video" w={298} h={192} x={22} y={27} z={0}
                  ry={14} rx={3} startFrom={26} lit={0.6 * (1 - apaga)} litColor={V.sky} sheenAt={toCF(10)} radius={9}
                  label="EL RELOJ DE PARED" opacity={1 - apaga * 0.96} />
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
                  <circle cx={422} cy={292} r={126} fill="none" stroke={rgba(V.volt, 0.75 * (1 - apaga))} strokeWidth={4} strokeLinecap="round"
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sweep}
                    transform="rotate(-90 422 292)" style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.6)})` }} />
                </svg>
                {f < 74 && <Readout value="7:00" label="EMPIEZA A DEVOLVERLA" at={toCF(26)} x={22} y={46} size={92} color={V.volt} />}
                {f > 44 && f < 80 && (
                  <div style={{ position: "absolute", left: "72%", top: "20%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 44) / 14) * (1 - apaga) }}>
                    <Kick color={V.volt}>AHORA SALE DE LA CAJA</Kick>
                  </div>
                )}
              </Plane>
              {/* EL APAGÓN SELECTIVO: la atmósfera no se remonta, se entierra bajo un velo */}
              <Plane z={380}>
                <AbsoluteFill style={{ background: rgba(V.ink0, 0.9 * apaga), pointerEvents: "none" }} />
              </Plane>
              {/* ⭐ Y QUEDA UN SOLO PUNTO: el LED verde, material REAL, al que la cámara se acerca */}
              {f > 68 && (
                <Plane z={460}>
                  <MediaCard src={M.ledV} kind="video"
                    w={Math.round(lerp(168, 540, eio(0, 1, clamp01((f - 68) / 60))))}
                    h={Math.round(lerp(104, 336, eio(0, 1, clamp01((f - 68) / 60))))}
                    x={62} y={72} z={0} ry={-6} startFrom={14} lit={1} litColor={V.volt}
                    sheenAt={toCF(84)} radius={9} opacity={clamp01((f - 68) / 12)} />
                </Plane>
              )}
            </>
          );
        })()}
      </Layers>

      {/* ── EL RÓTULO DE ESQUINA: anclado a la pantalla, sólo mientras la hoja está en cuadro ── */}
      {esLamina && <Rotulo g={gFrame} />}
    </AbsoluteFill>
  );
};
