// MovS3B.tsx — MOVIMIENTO S3B · "¿ES BARATA? · ¿SE PAGA SOLA?"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 2 actos · 408.628 → 444.651 ms · 1081 frames @30.
//
// LA IDEA: el reencuadre del precio. El video no va sobre si la caja es barata — 1.680 dólares no lo
// es — va sobre si se paga sola. Y para contestar eso hace falta lo único que el vendedor no te da:
// medir. De los 27 equipos que Claudio compró con su dinero y midió, casi ninguno entrega lo que
// promete; ésa es la siembra del Volumen II.
//
// EL OBJETO QUE CRUZA LA FRONTERA: **EL CONTADOR DE MESES**.
//   acto 1 → nace colgado de la mitad derecha de la etiqueta partida, con los dígitos todavía tapados
//            (y lo que los tapa es MATERIAL REAL: el clip de Claudio tapando el número con la mano);
//   acto 2 → ese mismo contador se despega y sus dígitos se REORDENAN, sin corte y sin volver a negro,
//            hasta ser las 27 tarjetas apoyadas en la madera del banco. Cada tarjeta ARRANCA en la
//            posición exacta del contador y viaja a su casilla: no aparece una cuadrícula nueva.
//
// UNA cámara: `camAt(gFrame)` — un `gcam` monótono (z −200 → +470) que deriva a la derecha en el acto 1
// hasta quedar mirando el contador, y en el acto 2 sube sobre la cuadrícula y entra en la tarjeta del
// centro. Función pura de `gFrame`: entre los dos actos hay 20 s de clips reales y la cámara los cruza
// viajando. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: la lámpara de trabajo del banco (TORCH) es la única fuente de todo el movimiento; lo que
// cambia es de dónde entra — arriba y en frío lo que te prometen, abajo y en voltio lo que te entrega.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-210 · "NO VA SOBRE SI ES BARATA"      material: CLIP levanta la caja un palmo (la manija)
//                                                             + CLIP el pulgar que no baja + CLIP tapa el número
//   entra  cam {z −200, saliendo de la mano que soltó el panelito}   luz {TORCH, key 0.3, int 0.9}
//   sale   cam {grúa −70, derivada a la derecha, mirando el contador} luz {TORCH, frío arriba a la izquierda}
//   ── FRONTERA A ···· LOS DÍGITOS SE REORDENAN: cada tarjeta sale del contador y viaja a su casilla. ··
// ACTO 2 · g823-1081 · "27 EQUIPOS MEDIDOS"         material: 27 FOTOS reales de equipo, la caja en el centro
//   entra  cam {grúa +10, sobre la madera del banco}                 luz {TORCH, key 0.52}
//   sale   cam {push 1.22 sobre la tarjeta del centro}               luz {TORCH pleno, key 0.6}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 823;
const G_END = 1081;
const START: Record<number, number> = { 1: A1, 2: A2 };

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  panel49F: "img/cmeenchufe/cmee_s3_panel49_junto_a_caja.png",
  manijaV: "broll/cmeenchufe/cmee_s3_levanta_un_palmo.mp4",
  pulgarV: "broll/cmeenchufe/cmee_s3_tarjeta_pulgar_no_baja.mp4",
  tapaV: "broll/cmeenchufe/cmee_s3_tapa_el_numero.mp4",
  bancoF: "img/cmeenchufe/cmee_s3_cuaderno_columna_precios.png",
  armarioV: "broll/cmeenchufe/cmee_s3_armario_equipos.mp4",
  icBillete: "img/cmeenchufe/cmee_ic_billete.png",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
};

// ── LOS 27 EQUIPOS MEDIDOS. El del centro (índice 13) es LA CAJA. ────────────────────────────
const EQUIPOS: string[] = [
  "img/cmeenchufe/cmee_s3_dos_paneles_paragolpes.png",
  "img/cmeenchufe/cmee_s3_panel49_junto_a_caja.png",
  "img/cmeenchufe/cmee_s3_pinza_panel_vereda.png",
  "img/cmeenchufe/cmee_s3_armario_equipos.png",
  "img/cmeenchufe/cmee_s3_version_chica_al_lado.png",
  "img/cmeenchufe/cmee_s3_una_etiqueta.png",
  "img/cmeenchufe/cmee_s3_lampara_en_la_caja.png",
  "img/cmeenchufe/cmee_s3_gira_fila_tomas.png",
  "img/cmeenchufe/cmee_s3_cable_desenrolla.png",
  "img/cmeenchufe/cmee_s3_microondas_enchufa.png",
  "img/cmeenchufe/cmee_s5_regleta_adelante.png",
  "img/cmeenchufe/cmee_s5_cable_entero.png",
  "img/cmeenchufe/cmee_s5_pinza_cable_entrada.png",
  "img/cmeenchufe/cmee_s3_pinza_en_la_caja.png",          // ← 13 · LA CAJA, el centro
  "img/cmeenchufe/cmee_s5_calentador_pasillo.png",
  "img/cmeenchufe/cmee_s5_hervidor_vapor.png",
  "img/cmeenchufe/cmee_s5_horno_rojo.png",
  "img/cmeenchufe/cmee_s5_aire_sala.png",
  "img/cmeenchufe/cmee_s5_ultima_fila_cargador.png",
  "img/cmeenchufe/cmee_s8_cargadores_regleta.png",
  "img/cmeenchufe/cmee_s8_router_luces.png",
  "img/cmeenchufe/cmee_s8_refri_noche.png",
  "img/cmeenchufe/cmee_s8_aire_sala_led.png",
  "img/cmeenchufe/cmee_s8_cajachica_led.png",
  "img/cmeenchufe/cmee_s8_caja_chica_al_lado.png",
  "img/cmeenchufe/cmee_s7_router_repisa.png",
  "img/cmeenchufe/cmee_s4_calentador_led.png",
];
const CAJA_IDX = 13;
const SOBREVIVE = 20;                                     // la otra tarjeta que queda encendida
// lo que entrega cada uno, sobre lo que prometía: determinístico, nunca Math.random()
const entrega = (i: number) => (i === CAJA_IDX ? 0.97 : i === SOBREVIVE ? 0.88 : 0.3 + rnd(i * 3.7) * 0.31);
// el orden en que se van apagando: también determinístico
const apagaEn = (i: number) => 74 + Math.round(rnd(i * 8.3) * 96);

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const gg = Math.min(g, G_END);
  const base = gcam(gg, { z0: -200, z1: 470, panX: -175, panY: -14, ry: -6, rx: 2, dur: G_END });
  const crane = interpolate(
    gg,
    [0, 210, 600, 823, 900, 1000, 1081],
    [0, -30, -56, -70, 10, 44, 64],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // el remate: la cámara entra en la tarjeta del centro, la única cuya barra voltio llega arriba
  const sc = interpolate(gg, [0, A2 + 150, G_END], [1, 1, 1.22], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.4, 1),
  });
  const ty = (50 - 52) * (sc - 1);
  return `${base.transform} translateY(${crane.toFixed(1)}px) translate(0%, ${ty.toFixed(2)}%) scale(${sc.toFixed(3)})`;
};

// ── LA MITAD DE ETIQUETA: es un rótulo de precio, o sea un gráfico. Vector. ──────────────────
const TagHalf: React.FC<{
  x: number; y: number; w: number; h: number; title: string; color: string;
  lean: number; life: number; fillFromBelow: number; side: "L" | "R";
}> = ({ x, y, w, h, title, color, lean, life, fillFromBelow, side }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
    marginLeft: side === "L" ? -w : 0, marginTop: -h / 2,
    transform: `rotate(${(lean * (side === "L" ? -7 : 6)).toFixed(2)}deg) translateX(${(lean * (side === "L" ? -46 : 46)).toFixed(1)}px)`,
    transformOrigin: side === "L" ? "100% 0%" : "0% 0%",
    background: `linear-gradient(180deg, ${rgba(V.ink2, 0.97)}, ${rgba(V.ink1, 0.99)})`,
    borderRadius: side === "L" ? "10px 0 0 10px" : "0 10px 10px 0",
    boxShadow: `0 22px 54px ${rgba(V.ink0, 0.8)}`,
    overflow: "hidden",
    opacity: 0.24 + 0.76 * life,
  }}>
    {/* lo que se llena desde ABAJO (lo que te queda) o lo que se enfría desde ARRIBA (lo que te cobran) */}
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, height: `${(clamp01(fillFromBelow) * 100).toFixed(1)}%`,
      background: `linear-gradient(0deg, ${rgba(color, 0.34)}, rgba(0,0,0,0))`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, height: `${((1 - life) * 100).toFixed(1)}%`,
      background: `linear-gradient(180deg, ${rgba(V.sky, 0.2)}, rgba(0,0,0,0))`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", textAlign: "center",
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, letterSpacing: 1.6,
      color: life > 0.4 ? color : rgba(V.bone, 0.42), textShadow: "0 5px 24px rgba(0,0,0,0.94)",
    }}>{title}</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: rgba(color, 0.5 + 0.4 * life) }} />
  </div>
);

// ── LA TARJETA MEDIDA: MATERIAL REAL adentro + su tira de cinta de papel + las dos barras ────
const Medido: React.FC<{
  src: string; x: number; y: number; w: number; h: number; give: number;
  promised: number; delivered: number; lit: number; caja: boolean; sheenAt: number;
}> = ({ src, x, y, w, h, give, promised, delivered, lit, caja, sheenAt }) => {
  const trackH = h * 0.78;
  return (
    <>
      <MediaCard src={src} kind="photo" w={w} h={h} x={x} y={y} radius={7}
        lit={0.3 + 0.7 * lit} litColor={caja ? V.volt : V.torch} sheenAt={sheenAt} opacity={0.3 + 0.7 * lit} />
      {/* la tira de cinta de papel escrita a mano, pegada abajo */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w * 0.72, marginLeft: -w * 0.36,
        marginTop: h / 2 - 12, height: 30, opacity: 0.35 + 0.65 * lit,
        background: `linear-gradient(180deg, ${rgba(V.bone, 0.9)}, ${rgba(V.concrete, 0.62)})`,
        transform: `rotate(${((rnd(x + y) - 0.5) * 3.2).toFixed(2)}deg)`,
        boxShadow: `0 6px 14px ${rgba(V.ink0, 0.7)}`,
      }}>
        <div style={{
          textAlign: "center", lineHeight: "30px", fontFamily: F_BODY, fontWeight: 700, fontSize: 17,
          letterSpacing: 0.6, color: rgba(V.ink0, 0.86),
        }}>{`${promised} → ${delivered}`}</div>
      </div>
      {/* LO PROMETIDO baja en frío desde arriba · LO ENTREGADO sube en voltio y se queda corto */}
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, marginLeft: w / 2 - 6, marginTop: -trackH / 2,
        width: 13, height: trackH, background: rgba(V.ink0, 0.7), borderRadius: 3, opacity: 0.35 + 0.65 * lit,
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: "100%",
          background: `linear-gradient(180deg, ${rgba(V.sky, 0.85)}, ${rgba(V.sky, 0.28)})`,
        }} />
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: `${(clamp01(give) * 100).toFixed(1)}%`,
          background: `linear-gradient(0deg, ${rgba(V.volt, 0.98)}, ${rgba(V.volt, 0.55)})`,
          boxShadow: `0 0 ${(12 + 16 * lit).toFixed(0)}px ${rgba(V.volt, 0.6 * lit)}`,
        }} />
      </div>
    </>
  );
};

export const MovS3B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ: siempre la lámpara del banco; lo que evoluciona es de dónde entra y cuánto pesa.
  const keyFrom = interpolate(gFrame, [0, A1 + 210, A2, G_END], [0.3, 0.42, 0.52, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A1 + 150, A2, G_END], [0.9, 1.08, 1.0, 1.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, G_END], [0.55, 0.62, 0.68], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez y nunca se remonta ── */}
      <VoltAtmos tint={V.torch} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la etiqueta se parte en dos preguntas; la caja no se mueve ═══════════ */}
        {acto === 1 && (() => {
          const hang = clamp01(f / 24);
          const blade = clamp01((f - 40) / 22);          // la costura voltio baja y parte la etiqueta
          const split = clamp01((f - 58) / 26);
          const cold = clamp01((f - 74) / 34);           // la mitad izquierda se enfría y se apaga
          const warm = clamp01((f - 82) / 38);           // la derecha se llena de voltio desde abajo
          const cont = clamp01((f - 118) / 22);
          const digit = Math.floor(clamp01((f - 118) / 3)) % 10;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.panel49F} kind="photo" z={0} scale={1.3} dim={0.74} tint={V.torch} /></Plane>
              {/* LA CAJA GRIS: no se mueve en todo el acto. El que cambia es la pregunta, no el objeto. */}
              <Plane z={0}>
                <MediaCard src={M.manijaV} kind="video" w={620} h={382} x={44} y={31} z={0} ry={-5}
                  startFrom={22} lit={1} litColor={V.torch} label="LA MANIJA" sheenAt={toCF(12)} radius={10} />
                {/* el cordel del que cuelga la etiqueta */}
                <div style={{
                  position: "absolute", left: "44%", top: `${(31 + 17.7).toFixed(2)}%`, width: 2, height: 74 * hang,
                  background: rgba(V.bone, 0.5),
                }} />
              </Plane>
              {/* LA ETIQUETA DE PRECIO, partiéndose en dos preguntas enfrentadas */}
              <Plane z={140}>
                {split < 0.02 && (
                  <div style={{
                    position: "absolute", left: "44%", top: "62%", width: 520, marginLeft: -260, marginTop: -70,
                    height: 140, borderRadius: 10, opacity: hang,
                    transform: `translateY(${lerp(-70, 0, eio(0, 1, hang)).toFixed(1)}px) rotate(${lerp(-5, 0.6, hang).toFixed(2)}deg)`,
                    background: `linear-gradient(180deg, ${rgba(V.ink2, 0.97)}, ${rgba(V.ink1, 0.99)})`,
                    boxShadow: `0 24px 58px ${rgba(V.ink0, 0.82)}`,
                  }}>
                    <div style={{
                      textAlign: "center", marginTop: 22, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 92,
                      color: V.amber, textShadow: `0 0 40px ${rgba(V.amber, 0.35)}, 0 5px 22px rgba(0,0,0,0.94)`,
                    }}>$1.680</div>
                  </div>
                )}
                {split >= 0.02 && (
                  <>
                    <TagHalf x={44} y={62} w={262} h={140} title="¿ES BARATA?" color={V.amber}
                      lean={split} life={1 - cold} fillFromBelow={0} side="L" />
                    <TagHalf x={44} y={62} w={262} h={140} title="¿SE PAGA SOLA?" color={V.volt}
                      lean={split} life={1} fillFromBelow={warm} side="R" />
                  </>
                )}
                {/* la costura voltio que parte la etiqueta: es un corte, no un fundido */}
                {blade > 0 && blade < 1 && (
                  <div style={{
                    position: "absolute", left: "44%", top: `${lerp(40, 78, blade).toFixed(1)}%`, width: 4, height: 220,
                    marginLeft: -2, marginTop: -110, background: rgba(V.volt, 0.95),
                    boxShadow: `0 0 34px ${rgba(V.volt, 0.85)}`,
                  }} />
                )}
              </Plane>
              {/* EL MATERIAL REAL de cada pregunta: el pulgar que no baja · la mano que tapa el número */}
              <Plane z={230}>
                <MediaCard src={M.pulgarV} kind="video" w={330} h={206} x={13} y={44} z={0} ry={11}
                  startFrom={26} lit={0.9 - 0.45 * cold} litColor={V.amber} label="LO QUE SALIÓ" sheenAt={toCF(70)}
                  radius={9} opacity={1 - 0.5 * cold} />
                <MediaCard src={M.tapaV} kind="video" w={330} h={206} x={84} y={44} z={0} ry={-11}
                  startFrom={30} lit={0.6 + 0.4 * warm} litColor={V.volt} label="LO QUE FALTA SABER" sheenAt={toCF(112)} radius={9} />
                <IconPng src={M.icBillete} x={13} y={64} size={92} z={0} opacity={0.5 * (1 - cold)} glow={V.ink0} />
                <IconPng src={M.icCalendario} x={84} y={64} size={92} z={0} opacity={0.5 * warm} glow={V.ink0} />
              </Plane>
              {/* EL CONTADOR DE MESES: nace acá con los dígitos todavía sin leerse */}
              <Plane z={330}>
                {cont > 0.01 && (
                  <div style={{
                    position: "absolute", left: "84%", top: "22%", transform: "translate(-50%,-50%)", textAlign: "center", opacity: cont,
                  }}>
                    <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 26, letterSpacing: 4.4, color: rgba(V.bone, 0.66) }}>MESES</div>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 0.92, color: V.volt,
                      textShadow: `0 0 46px ${rgba(V.volt, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
                      filter: "blur(3px)",
                    }}>{`${digit}${(digit * 7) % 10}`}</div>
                  </div>
                )}
                {f > 150 && (
                  <div style={{ position: "absolute", left: "6%", top: "86%", opacity: clamp01((f - 150) / 14) }}>
                    <Kick color={V.voltSoft}>EL VIDEO NO VA SOBRE EL PRECIO</Kick>
                    <div style={{ marginTop: 8 }}><Head size={80} color={V.white}>VA SOBRE SI SE PAGA SOLA</Head></div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · los dígitos del contador se reordenan en 27 tarjetas medidas ═══════ */}
        {acto === 2 && (() => {
          const bars = clamp01((f - 46) / 34);
          const titulo = clamp01((f - 18) / 16);
          const cierre = clamp01((f - 196) / 18);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.26} dim={0.7} tint={V.torch} /></Plane>
              {/* el armario donde viven los 27: material real al fondo, fuera de foco */}
              <Plane z={-300}>
                <div style={{ filter: "blur(7px)", opacity: 0.5 }}>
                  <MediaCard src={M.armarioV} kind="video" w={520} h={320} x={82} y={20} z={0} ry={-22}
                    startFrom={20} lit={0.42} litColor={V.torch} radius={10} />
                </div>
              </Plane>
              {/* LAS 27 TARJETAS: cada una SALE del contador del acto 1 y viaja a su casilla */}
              <Plane z={60}>
                {EQUIPOS.map((src, i) => {
                  const col = i % 9, row = Math.floor(i / 9);
                  const gx = 8 + col * 10.5, gy = 30 + row * 22;
                  const t = eio(0, 1, clamp01((f - 2 - i * 1.5) / 26));
                  const x = lerp(84, gx, t), y = lerp(22, gy, t);
                  const caja = i === CAJA_IDX;
                  const give = entrega(i) * clamp01((f - 46 - i * 0.8) / 26);
                  const off = clamp01((f - apagaEn(i)) / 12);
                  const lit = caja || i === SOBREVIVE ? 1 : 1 - 0.82 * off;
                  const prom = 100;
                  return (
                    <Medido key={src} src={src} x={x} y={y} w={lerp(120, 176, t)} h={lerp(76, 110, t)}
                      give={give} promised={prom} delivered={Math.round(prom * entrega(i))}
                      lit={lit * (0.25 + 0.75 * t)} caja={caja} sheenAt={toCF(52 + i * 2)} />
                  );
                })}
              </Plane>
              {/* la leyenda de las dos barras: esto SÍ es un gráfico */}
              <Plane z={240}>
                {bars > 0.01 && (
                  <div style={{ position: "absolute", left: "6%", top: "9%", opacity: bars }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 13, height: 34, background: `linear-gradient(180deg, ${rgba(V.sky, 0.9)}, ${rgba(V.sky, 0.3)})` }} />
                      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.2, color: V.sky }}>LO PROMETIDO</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <div style={{ width: 13, height: 34, background: `linear-gradient(0deg, ${rgba(V.volt, 0.98)}, ${rgba(V.volt, 0.5)})` }} />
                      <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 3.2, color: V.volt }}>LO ENTREGADO</div>
                    </div>
                  </div>
                )}
                {titulo > 0.01 && (
                  <div style={{ position: "absolute", left: "72%", top: "9%", opacity: titulo, width: 480, height: 190, marginLeft: -240 }}>
                    <Readout value="27" label="EQUIPOS MEDIDOS" at={toCF(20)} x={50} y={22} size={116} color={V.torch} />
                  </div>
                )}
              </Plane>
              {/* el remate: la única cuya barra voltio llega hasta arriba */}
              <Plane z={340}>
                {cierre > 0.01 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: "2%", textAlign: "center", opacity: cierre }}>
                    <Head size={64} color={V.white}>CASI NINGUNO ENTREGA LO QUE PROMETE</Head>
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
