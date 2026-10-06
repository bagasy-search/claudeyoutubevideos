// MovS4C.tsx — MOVIMIENTO S4C · "LA POTENCIA CONTRATADA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 7 actos · 575.660 → 632.600 ms · 1708 frames @30.
// Tercer mecanismo de la misma sección: hermano de MovS4A y MovS4B, mismo escenario y misma cámara-función.
//
// LA IDEA: el cargo fijo no es un impuesto, es EL GROSOR DEL CAÑO. Pagas todo el año por poder usar
// mucho durante dos minutos. 5,75 kW = 20,70 al mes, enciendas o no enciendas nada.
//
// LA MATERIA QUE CRUZA LAS SEIS FRONTERAS: **EL CAÑO**.
//   acto 1 → todavía no existe: hay la hoja real y, sobre ella, el sello redondo del sobre;
//   acto 2 → el sello crece y deja de ser sello: es la BOCA del caño, y la regla mide su diámetro;
//   acto 3 → la cámara sale de la boca, un candado fija ese diámetro y el contador arranca;
//   acto 4 → la regla vuelve a caer y escribe 5,75; el contador se frena en 20,70 y la cinta lo repite;
//   acto 5 → la cinta se cierra sobre sí misma y ES el caño visto a lo largo, vacío;
//   acto 6 → el display de la pinza se estira y sale como la línea plana que cruza el caño;
//   acto 7 → el pico de esa línea toca la pared de arriba y deja la marca que ya no se va.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` que HEREDA el z con el que terminó S4B (z0 = −60) y
// vuelve a entrar, más una grúa que SUBE por delante de los doce escalones que se hunden (de +108,
// donde S4B la dejó, a +288) y después baja por la garganta del caño, y un push que ENTRA por la boca
// y sale por la boca. Función pura de `gFrame`: sigue viajando durante los clips reales entre actos.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: entra en SKY pleno (donde S4B la dejó), la lámpara de trabajo la devuelve un momento a VOLT
// sobre el papel, y desde el acto 2 vuelve a caer fría por la garganta del caño. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-90 · "3 · LA POTENCIA CONTRATADA"      material: FOTO alisa_factura + FOTO sobre_sellado (redonda)
//   entra  cam {la de S4B: z −60, grúa +108, los doce escalones hundiéndose}  luz {SKY pleno, key 0.60}
//   sale   cam {grúa +288, saliendo por el borde de arriba de la hoja}        luz {VOLT de trabajo, key 0.50}
//   ── FRONTERA A ···· MATCH-SHAPE DE ESCALA: el sello redondo crece y es la boca del caño. ··
// ACTO 2 · g388-508 · "GROSOR"                       material: FOTO sobre_sellado (creciendo a pantalla)
//   entra  cam {grúa +210, de frente al sello}                                luz {VOLT→SKY 30%}
//   sale   cam {push 3.1, DENTRO de la garganta del caño}                     luz {SKY 55%, key 0.44}
//   ── FRONTERA B ···· LA CÁMARA SALE por la boca (el push se deshace solo). ················
// ACTO 3 · g710-830 · "ENCIENDAS O NO ENCIENDAS NADA"  material: CLIP tablero_breakers en la tarjeta + su foto como cama al fondo
//   entra  cam {push 1, enfrente de la boca, grúa +96}                        luz {SKY 66%, key 0.40}
//   sale   cam {grúa +40, el contador ya corriendo}                           luz {SKY 74%, key 0.38}
//   ── FRONTERA C ···· LA REGLA VUELVE A CAER: el mismo objeto entra otra vez, sin negro. ···
// ACTO 4 · g847-979 · "5,75 kW · $20,70"             material: FOTO baja_porton_valija (el mes de vacaciones)
//   entra  cam {grúa +40}                                                     luz {SKY 76%, key 0.38}
//   sale   cam {grúa −20, deriva a la derecha siguiendo la cinta}             luz {SKY 82%, key 0.36}
//   ── FRONTERA D ···· MORPH: la cinta de calendario se cierra y ES el caño a lo largo. ·····
// ACTO 5 · g1166-1268 · "LO QUE CONSUMES DE VERDAD"  material: FOTO pinza_general (dentro del tapón)
//   entra  cam {grúa −60, recorriendo el caño vacío}                          luz {SKY 88%, key 0.34}
//   sale   cam {grúa −78, llegando al tapón}                                  luz {SKY 92%, key 0.33}
//   ── FRONTERA E ···· EL DISPLAY SE ESTIRA: la tarjeta de la pinza suelta la línea plana. ··
// ACTO 6 · g1393-1495 · "DOS MINUTOS"                material: CLIP pinza_lavadora (el display)
//   entra  cam {grúa −96}                                                     luz {SKY 94%}
//   sale   cam {grúa −130, el pico arriba}                                    luz {SKY 96%}
//   ── FRONTERA F ···· EL PICO SE QUEDA ARRIBA y a su alrededor se ordenan las cuatro cargas. ·
// ACTO 7 · g1600-1708 · "TODO EL AÑO POR DOS MINUTOS"  material: CLIP hervidor + CLIP microondas + FOTO plancha + FOTO calentador
//   entra  cam {grúa −130, push 1}                                            luz {SKY 96%}
//   sale   cam {push 0.84, el caño se hace larguísimo: todo el año}           → entrega a S5
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 388, A3 = 710, A4 = 847, A5 = 1166, A6 = 1393, A7 = 1600;
const G_END = 1708;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7 };

const pc = (v: number) => (v / 1080) * 100;     // px verticales → % de pantalla
const px = (v: number) => (v / 1920) * 100;     // px horizontales → % de pantalla

// EL CAÑO DE FRENTE (actos 2-4): la boca, en px de la comp
const MOUTH_X = 960, MOUTH_Y = 500, MOUTH_R = 300;
// EL CAÑO A LO LARGO (actos 5-7): el hueco y el espesor de pared
const BORE_TOP = 322, BORE_BOT = 782, WALL = 56;
const SPIKE_X = 1290;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  hojaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  selloF: "img/cmeenchufe/cmee_s4_sobre_sellado.png",
  renglonF: "img/cmeenchufe/cmee_s4_dedo_primer_renglon.png",
  tableroF: "img/cmeenchufe/cmee_s4_tablero_breakers.png",
  tableroV: "broll/cmeenchufe/cmee_s4_tablero_breakers.mp4",
  valijaF: "img/cmeenchufe/cmee_s4_baja_porton_valija.png",
  generalF: "img/cmeenchufe/cmee_s4_pinza_general.png",
  pinzaV: "broll/cmeenchufe/cmee_s4_pinza_lavadora.mp4",
  hervidorV: "broll/cmeenchufe/cmee_s4_hervidor_microondas.mp4",
  microondasV: "broll/cmeenchufe/cmee_s3_microondas_enchufa.mp4",
  planchaF: "img/cmeenchufe/cmee_s4_plancha_piloto.png",
  calentadorF: "img/cmeenchufe/cmee_s4_calentador_led.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icCandado: "img/cmeenchufe/cmee_ic_candado.png",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
};

// ── LA CÁMARA · una sola función de gFrame, que hereda la de S4B y nunca vuelve a cero ───────
const camAt = (g: number) => {
  // z arranca donde S4B lo dejó (−60) y vuelve a entrar: el mismo viaje, no otro.
  const base = gcam(g, { z0: -60, z1: 380, panX: -130, panY: 34, ry: 0, rx: 0, dur: G_END });
  // LA GRÚA: sube por delante de los doce escalones que se hunden y después baja por la garganta.
  const crane = interpolate(
    g,
    [0, 44, 90, A2, A2 + 120, A3, A3 + 120, A4 + 132, A5, A5 + 102, A6, A6 + 102, G_END],
    [108, 226, 288, 210, 148, 96, 62, -20, -60, -78, -96, -118, -152],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // LA ÓRBITA: mínima (el caño se lee de frente), pero nunca quieta.
  const orbit = interpolate(g, [0, 90, A2, A3, A4, A5, A6, A7, G_END], [-9, -4, 2, 6, 3, 0, -3, -6, -8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.35, 0, 0.3, 1),
  });
  const tilt = interpolate(g, [0, 90, A2, A3, A4, A5, A7], [-3, 5, 8, 4, 1, -2, -5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1),
  });
  // EL PUSH: entra por la boca del caño (frontera A→B) y sale por la boca (frontera B→C).
  const pushV = interpolate(g, [A2 + 18, A2 + 72, A2 + 120, A3 + 20, A7, G_END], [1, 2.3, 3.1, 1, 1, 0.84], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - px(MOUTH_X)) * (pushV - 1);
  const ty = (50 - pc(MOUTH_Y)) * (pushV - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotateY(${orbit.toFixed(2)}deg) rotateX(${tilt.toFixed(2)}deg) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${pushV.toFixed(3)})`
  );
};

// ── LA BOCA DEL CAÑO — anillos concéntricos que se hunden (mecanismo: va en vector) ──────────
const PipeMouth: React.FC<{ r: number; open: number; tint: string }> = ({ r, open, tint }) => (
  <>
    {Array.from({ length: 9 }, (_, i) => {
      const k = i / 8;
      const rr = r * lerp(1, 0.42, k) * lerp(1, 1, open);
      const dark = lerp(0.12, 0.99, k);
      return (
        <div key={i} style={{
          position: "absolute", left: MOUTH_X, top: MOUTH_Y - i * 5 * open,
          width: rr * 2, height: rr * 2, marginLeft: -rr, marginTop: -rr, borderRadius: "50%",
          background: i === 0
            ? `conic-gradient(from 200deg, ${rgba(V.concrete, 0.5)}, ${rgba(V.ink1, 0.98)} 26%, ${rgba(V.concrete, 0.36)} 52%, ${rgba(V.ink0, 0.99)} 78%, ${rgba(V.concrete, 0.5)})`
            : `radial-gradient(circle at 50% 22%, ${rgba(tint, 0.1 * (1 - k))}, ${rgba(V.ink0, dark)} 72%)`,
          boxShadow: i === 0
            ? `0 30px 80px ${rgba(V.ink0, 0.9)}, inset 0 3px 0 ${rgba(V.white, 0.16)}`
            : `inset 0 ${(8 * (1 - k)).toFixed(1)}px ${(22 * (1 - k)).toFixed(1)}px ${rgba(V.ink0, 0.9)}`,
        }} />
      );
    })}
    {/* la luz fría que baja por la garganta */}
    <div style={{
      position: "absolute", left: MOUTH_X, top: MOUTH_Y, width: r * 0.9, height: r * 0.9,
      marginLeft: -r * 0.45, marginTop: -r * 0.45, borderRadius: "50%",
      background: `linear-gradient(180deg, ${rgba(tint, 0.2 * open)}, rgba(0,0,0,0) 62%)`,
    }} />
  </>
);

// ── EL CORCHETE DE MEDIDA (esto SÍ es un gráfico: mide algo) ─────────────────────────────────
const Bracket: React.FC<{ cx: number; y: number; w: number; label: string; color: string; p: number }> = ({
  cx, y, w, label, color, p,
}) => (
  <div style={{ position: "absolute", left: cx, top: y, width: w, marginLeft: -w / 2, opacity: p }}>
    <div style={{ position: "relative", height: 3, background: rgba(color, 0.95), transform: `scaleX(${p.toFixed(3)})` }}>
      <div style={{ position: "absolute", left: 0, top: -15, width: 3, height: 32, background: rgba(color, 0.95) }} />
      <div style={{ position: "absolute", right: 0, top: -15, width: 3, height: 32, background: rgba(color, 0.95) }} />
    </div>
    <div style={{
      marginTop: 14, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40,
      letterSpacing: 5, color, textShadow: "0 4px 20px rgba(0,0,0,0.94)",
    }}>{label}</div>
  </div>
);

// ── EL CAÑO A LO LARGO, EN CORTE (actos 5-7) ─────────────────────────────────────────────────
const PipeSection: React.FC<{ tint: string; markAt: number; mark: number }> = ({ tint, markAt, mark }) => {
  const wallStyle = (top: number): React.CSSProperties => ({
    position: "absolute", left: -260, top, width: 2440, height: WALL,
    background: `linear-gradient(180deg, ${rgba(V.concrete, 0.44)} 0%, ${rgba(V.ink2, 0.98)} 38%, ${rgba(V.ink1, 1)} 100%)`,
    boxShadow: `0 14px 40px ${rgba(V.ink0, 0.86)}`,
  });
  return (
    <>
      <div style={wallStyle(BORE_TOP - WALL)}>
        {/* el corte de la pared: el caño está SERRUCHADO, se ve el espesor */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: rgba(tint, 0.62) }} />
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: 40 + i * 152 + rnd(i * 3.3) * 22, top: WALL * 0.34,
            width: 11, height: 11, borderRadius: "50%",
            background: rgba(V.concrete, 0.34), boxShadow: `inset 0 -2px 2px ${rgba(V.ink0, 0.9)}`,
          }} />
        ))}
      </div>
      <div style={wallStyle(BORE_BOT)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: rgba(tint, 0.5) }} />
      </div>
      {/* el aire de adentro: no hay nada, y se ve que no hay nada */}
      <div style={{
        position: "absolute", left: -260, top: BORE_TOP, width: 2440, height: BORE_BOT - BORE_TOP,
        background: `linear-gradient(180deg, ${rgba(tint, 0.09)} 0%, ${rgba(V.ink0, 0.72)} 46%, ${rgba(V.ink0, 0.9)} 100%)`,
      }} />
      {/* LA MARCA que el pico deja en la pared de arriba y que ya no se va */}
      {mark > 0 && (
        <div style={{
          position: "absolute", left: markAt - 62, top: BORE_TOP - 9, width: 124, height: 9,
          background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.amber, 0.95)} 30%, ${rgba(V.amber, 0.95)} 70%, rgba(0,0,0,0))`,
          boxShadow: `0 0 26px ${rgba(V.amber, 0.7)}`, opacity: mark,
        }} />
      )}
    </>
  );
};

// ── EL DINERO: sin padStart (lib es2015), la coma decimal española a mano ────────────────────
const money = (v: number) => {
  const c = Math.max(0, Math.round(v * 100));
  const d = Math.floor(c / 100);
  const r = c - d * 100;
  return `$${d},${r < 10 ? `0${r}` : `${r}`}`;
};
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export const MovS4C: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, 90, A2, A3, A5, A7], [0.6, 0.5, 0.44, 0.4, 0.34, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [0, 70, A2, A2 + 120, A4, A6], [0.96, 0.34, 0.3, 0.55, 0.78, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, 90, A2, A3, A5, A6, A7 + 108], [1.0, 1.14, 1.06, 0.98, 0.92, 1.06, 0.84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, A4, A7], [0.66, 0.58, 0.7, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const cold = light(cool, "volt", "sky");

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={cold} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · los doce escalones se hunden y vuelve la hoja, plana, desde arriba ═ */}
        {acto === 1 && (() => {
          const sink = clamp01(f / 30);
          const sheet = clamp01((f - 14) / 34);
          const numT = clamp01((f - 44) / 20);
          const seal = clamp01((f - 58) / 20);
          return (
            <>
              {/* la fila de doce escalones con la que terminó S4B: se hunde por el borde de abajo */}
              <Plane z={-260}>
                <div style={{ position: "absolute", left: 0, top: eio(0, 720, sink), right: 0, bottom: 0, opacity: 1 - 0.6 * sink }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const k = i / 11;
                    const s = lerp(1, 0.2, k);
                    const dim = lerp(1, 0.2, k);
                    return (
                      <div key={i} style={{ position: "absolute", left: lerp(360, 1620, k), top: lerp(870, 372, k) }}>
                        <div style={{
                          position: "absolute", left: -300 * s, top: -150 * s, width: 300 * s, height: 300 * s,
                          background: `linear-gradient(180deg, ${rgba(V.bone, 0.18 * dim)}, ${rgba(V.ink1, 0.99)})`,
                        }} />
                        <div style={{
                          position: "absolute", left: 0, top: -189 * s, width: 250 * s, height: 340 * s,
                          background: `linear-gradient(180deg, ${rgba(V.amber, 0.24 * dim)}, ${rgba(V.ink1, 0.99)})`,
                          borderTop: `${Math.max(1, 3 * s)}px solid ${rgba(V.amber, 0.7 * dim)}`,
                        }} />
                      </div>
                    );
                  })}
                </div>
              </Plane>
              {/* ⭐ la HOJA REAL vuelve a entrar plana desde arriba */}
              <Plane z={0}>
                <MediaCard src={M.hojaF} kind="photo" w={1280} h={760}
                  x={50} y={pc(lerp(-260, 560, eio(0, 1, sheet)))} z={0}
                  ry={0} rx={eio(64, 47, sheet)} lit={1} litColor={V.volt} sheenAt={toCF(26)} radius={8} />
                {/* EL PRIMER RENGLÓN DE ARRIBA DE TODO, el que nadie mira */}
                <div style={{
                  position: "absolute", left: "50%", top: `${pc(lerp(-260, 560, eio(0, 1, sheet)) - 214).toFixed(2)}%`,
                  width: 760, height: 12, marginLeft: -380, opacity: clamp01((f - 38) / 12),
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0)} 0%, ${rgba(V.volt, 0.94)} 14%, ${rgba(V.volt, 0.94)} 86%, ${rgba(V.volt, 0)} 100%)`,
                  boxShadow: `0 0 32px ${rgba(V.volt, 0.72)}`,
                }} />
              </Plane>
              {/* ⭐ EL SELLO REDONDO del sobre real, apoyado sobre la hoja: la boca que viene */}
              <Plane z={120}>
                {seal > 0 && (
                  <MediaCard src={M.selloF} kind="photo" w={222} h={222} x={px(MOUTH_X + 240)} y={pc(MOUTH_Y + 214)} z={0}
                    ry={-8} rx={9} lit={1} litColor={V.amber} radius={111} sheenAt={toCF(62)} opacity={seal} />
                )}
              </Plane>
              <Plane z={250}>
                {/* el 3 se apoya sobre el primer renglón */}
                <div style={{
                  position: "absolute", left: "17%", top: "31%",
                  transform: `translate(-50%,-50%) scale(${lerp(0.42, 1, numT).toFixed(3)})`, opacity: numT,
                }}>
                  <Num size={238} color={V.volt}>3</Num>
                </div>
                <div style={{ position: "absolute", left: "17%", top: "45%", transform: "translateX(-50%)", opacity: clamp01((f - 58) / 12) }}>
                  <Kick color={V.bone}>LA POTENCIA CONTRATADA</Kick>
                </div>
              </Plane>
              {/* la lámpara de trabajo se enciende sobre el papel y el negro se retira a los bordes */}
              <Plane z={400}>
                <AbsoluteFill style={{
                  background: `radial-gradient(56% 46% at 50% 48%, ${rgba(V.torch, 0.2 * sheet)} 0%, rgba(0,0,0,0) 70%)`,
                  mixBlendMode: "screen", pointerEvents: "none",
                }} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el sello crece y es la BOCA del caño; la regla mide el GROSOR ═════ */}
        {acto === 2 && (() => {
          const grow = clamp01(f / 40);
          const open = clamp01((f - 30) / 30);
          const drop = clamp01((f - 52) / 22);
          const bp = clamp01((f - 70) / 18);
          const size = lerp(222, 1180, eio(0, 1, grow));
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.selloF} kind="photo" z={0} scale={1.34} dim={0.84} tint={cold} /></Plane>
              {/* ⭐ el sello REAL creciendo: sigue siendo material hasta que la boca se lo traga */}
              <Plane z={-20}>
                <MediaCard src={M.selloF} kind="photo" w={size} h={size} x={px(MOUTH_X)} y={pc(MOUTH_Y)} z={0}
                  ry={-4} lit={1} litColor={V.amber} radius={size / 2} sheenAt={toCF(10)}
                  opacity={1 - 0.86 * open} />
              </Plane>
              <Plane z={0}>
                <PipeMouth r={MOUTH_R * lerp(0.6, 1, open)} open={open} tint={cold} />
              </Plane>
              {/* la regla cae sobre la boca y mide el DIÁMETRO, no el largo */}
              <Plane z={220}>
                <IconPng src={M.icRegla} x={px(MOUTH_X)} y={pc(lerp(-140, MOUTH_Y - 22, eio(0, 1, drop)))}
                  size={520} z={0} opacity={0.92 * drop} rot={lerp(-16, -1, drop)} glow={V.ink0} />
                <Bracket cx={MOUTH_X} y={MOUTH_Y + MOUTH_R * lerp(0.6, 1, open) + 54}
                  w={MOUTH_R * 2 * lerp(0.6, 1, open)} label="GROSOR" color={V.volt} p={bp} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el candado fija el diámetro y el contador arranca (el caño vacío) ══ */}
        {acto === 3 && (() => {
          const lock = clamp01((f - 18) / 22);
          const run = clamp01((f - 40) / 78);
          const cash = lerp(0, 6.42, run);
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.tableroF} kind="photo" z={0} scale={1.32} dim={0.86} tint={cold} /></Plane>
              {/* ⭐ el tablero REAL, encastrado en la pared del fondo, DETRÁS del caño */}
              <Plane z={-320}>
                <MediaCard src={M.tableroV} kind="video" w={520} h={330} x={80} y={30} z={0}
                  ry={-16} rx={3} lit={0.8} litColor={cold} label="EL TABLERO" sheenAt={toCF(14)} radius={9} />
              </Plane>
              <Plane z={0}>
                <PipeMouth r={MOUTH_R} open={1} tint={cold} />
              </Plane>
              {/* el candado se cierra sobre el diámetro medido y lo deja fijo */}
              <Plane z={220}>
                <Bracket cx={MOUTH_X} y={MOUTH_Y + MOUTH_R + 54} w={MOUTH_R * 2} label="GROSOR" color={V.volt} p={1} />
                <IconPng src={M.icCandado} x={px(MOUTH_X)} y={pc(lerp(MOUTH_Y - 250, MOUTH_Y + MOUTH_R + 34, eio(0, 1, lock)))}
                  size={lerp(190, 150, lock)} z={0} opacity={lock} glow={V.volt} />
              </Plane>
              {/* nada se mueve dentro del caño y sin embargo el contador corre */}
              <Plane z={300}>
                <div style={{
                  position: "absolute", left: "6%", bottom: 44,
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, color: V.amber, lineHeight: 1,
                  textShadow: `0 0 46px ${rgba(V.amber, 0.36)}, 0 6px 26px rgba(0,0,0,0.94)`, opacity: clamp01(run * 6),
                }}>{money(cash)}</div>
                <div style={{ position: "absolute", left: "6%", top: "16%", opacity: clamp01((f - 62) / 14) }}>
                  <Kick color={rgba(V.white, 0.92)}>ENCIENDAS O NO ENCIENDAS NADA</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · la regla escribe 5,75 y el contador se frena en 20,70 todos los meses ═ */}
        {acto === 4 && (() => {
          const drop = clamp01(f / 24);
          const ribbon = clamp01((f - 34) / 62);
          const vac = clamp01((f - 78) / 20);
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.renglonF} kind="photo" z={0} scale={1.3} dim={0.86} tint={cold} /></Plane>
              <Plane z={-40}>
                <div style={{ transform: "translateX(-420px) scale(0.68)", transformOrigin: "50% 50%" }}>
                  <PipeMouth r={MOUTH_R} open={1} tint={cold} />
                </div>
              </Plane>
              {/* la MISMA regla del acto 2 vuelve a caer, y esta vez escribe su número */}
              <Plane z={200}>
                <IconPng src={M.icRegla} x={px(MOUTH_X - 420)} y={pc(lerp(-120, MOUTH_Y - 30, eio(0, 1, drop)))}
                  size={380} z={0} opacity={0.9 * drop} rot={lerp(-14, -2, drop)} glow={V.ink0} />
                <Readout value="5,75" unit="kW" at={toCF(24)} x={px(MOUTH_X - 420)} y={pc(MOUTH_Y + 250)} size={116} color={V.volt} />
              </Plane>
              {/* LA CINTA DE CALENDARIO: el mismo 20,70 impreso en cada mes, sin cambiar nunca */}
              <Plane z={80}>
                <div style={{
                  position: "absolute", left: 640, top: 300, width: 1500 * ribbon, height: 300, overflow: "hidden",
                  background: `linear-gradient(180deg, ${rgba(V.ink2, 0.94)}, ${rgba(V.ink0, 0.98)})`,
                  borderTop: `2px solid ${rgba(V.bone, 0.3)}`, borderBottom: `2px solid ${rgba(V.bone, 0.18)}`,
                  boxShadow: `0 26px 64px ${rgba(V.ink0, 0.84)}`,
                }}>
                  {MESES.map((mes, i) => (
                    <div key={mes} style={{
                      position: "absolute", left: i * 125, top: 0, width: 124, height: 300,
                      borderRight: `1px solid ${rgba(V.bone, 0.14)}`, textAlign: "center",
                    }}>
                      <div style={{
                        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 2.6,
                        color: rgba(V.bone, 0.55), marginTop: 22,
                      }}>{mes}</div>
                      <div style={{
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, color: V.amber, marginTop: 96,
                        textShadow: "0 3px 14px rgba(0,0,0,0.9)",
                      }}>20,70</div>
                    </div>
                  ))}
                </div>
              </Plane>
              {/* ⭐ el mes que se fue de vacaciones y la casa quedó vacía: paga lo mismo */}
              <Plane z={210}>
                {vac > 0 && (
                  <MediaCard src={M.valijaF} kind="photo" w={330} h={206} x={72} y={78} z={0}
                    ry={-9} lit={1} litColor={V.amber} label="Y EL MES QUE NO ESTUVE" sheenAt={toCF(84)} radius={8}
                    opacity={vac} />
                )}
                <IconPng src={M.icCalendario} x={38} y={19} size={96} z={0} opacity={0.6 * ribbon} glow={V.ink0} />
                <div style={{
                  position: "absolute", left: "6%", bottom: 44,
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, color: V.amber, lineHeight: 1,
                  textShadow: `0 0 46px ${rgba(V.amber, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
                }}>$20,70</div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · la cinta se cierra y ES el caño a lo largo: vacío, un solo tapón ═══ */}
        {acto === 5 && (() => {
          const close = clamp01(f / 22);                 // la cinta se cierra sobre sí misma
          const travel = clamp01((f - 16) / 74);         // y la cámara recorre el caño vacío
          const plugX = lerp(2280, SPIKE_X - 190, eio(0, 1, travel));
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.generalF} kind="photo" z={0} scale={1.3} dim={0.87} tint={cold} /></Plane>
              <Plane z={0}>
                <div style={{ transform: `scaleY(${lerp(0.24, 1, eio(0, 1, close)).toFixed(3)})`, transformOrigin: "50% 55%" }}>
                  <PipeSection tint={cold} markAt={SPIKE_X} mark={0} />
                </div>
              </Plane>
              {/* EL ÚNICO TAPÓN DE AGUA: angosto, apretado, tarda en llegar */}
              <Plane z={60}>
                <div style={{
                  position: "absolute", left: plugX, top: BORE_TOP, width: 96, height: BORE_BOT - BORE_TOP,
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.5)}, ${rgba(V.sky, 0.24)} 60%, ${rgba(V.sky, 0.44)})`,
                  boxShadow: `0 0 40px ${rgba(V.sky, 0.42)}, inset 0 0 30px ${rgba(V.white, 0.12)}`,
                }} />
              </Plane>
              {/* ⭐ adentro del tapón, la pinza REAL sobre el general: lo que consumes de verdad */}
              <Plane z={180}>
                <MediaCard src={M.generalF} kind="photo" w={272} h={172} x={px(plugX + 48)} y={pc((BORE_TOP + BORE_BOT) / 2)} z={0}
                  ry={-5} lit={1} litColor={V.sky} sheenAt={toCF(62)} radius={7} />
                <div style={{ position: "absolute", left: "6%", top: "13%", opacity: clamp01((f - 40) / 14) }}>
                  <Kick color={rgba(V.white, 0.92)}>LO QUE CONSUMES DE VERDAD</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · el display se estira: línea plana todo el mes y un solo pico ══════ */}
        {acto === 6 && (() => {
          const line = clamp01((f - 10) / 46);
          const spike = clamp01((f - 58) / 20);
          const flatY = BORE_BOT - 96;
          const topY = lerp(flatY, BORE_TOP + 26, eio(0, 1, spike));
          const x1 = lerp(300, 2140, eio(0, 1, line));
          return (
            <>
              <Plane z={0}>
                <PipeSection tint={cold} markAt={SPIKE_X} mark={0} />
              </Plane>
              {/* ⭐ el display REAL de la pinza: de ahí SALE la línea, no aparece sola */}
              <Plane z={140}>
                <MediaCard src={M.pinzaV} kind="video" w={330} h={206} x={px(150)} y={pc(flatY - 10)} z={0}
                  ry={7} startFrom={18} lit={1} litColor={V.volt} label="TODO EL MES" sheenAt={toCF(8)} radius={8} />
              </Plane>
              <Plane z={90}>
                {/* la línea plana, aburrida, que cruza el caño a lo largo */}
                <div style={{
                  position: "absolute", left: 300, top: flatY - 3, height: 6, width: Math.max(0, x1 - 300),
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.95)}, ${rgba(V.volt, 0.7)})`,
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.5)}`,
                }} />
                {/* y de golpe, en un punto, el PICO vertical */}
                {spike > 0 && (
                  <>
                    <div style={{
                      position: "absolute", left: SPIKE_X - 4, top: topY, width: 8, height: flatY - topY,
                      background: `linear-gradient(180deg, ${rgba(V.amber, 0.98)}, ${rgba(V.amber, 0.5)})`,
                      boxShadow: `0 0 34px ${rgba(V.amber, 0.62)}`,
                    }} />
                    <div style={{
                      position: "absolute", left: SPIKE_X - 46, top: topY - 5, width: 92, height: 6,
                      background: rgba(V.amber, 0.9), boxShadow: `0 0 24px ${rgba(V.amber, 0.6)}`,
                    }} />
                  </>
                )}
              </Plane>
              <Plane z={240}>
                <div style={{
                  position: "absolute", left: px(SPIKE_X) + "%", top: pc(topY - 96) + "%", transform: "translateX(-50%)",
                  opacity: clamp01((f - 72) / 12),
                }}>
                  <Kick color={V.amber}>DOS MINUTOS</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 7 · las cuatro juntas: el pico toca la pared y deja la marca ══════════ */}
        {acto === 7 && (() => {
          const on = clamp01((f - 12) / 12);             // las cuatro encienden en el MISMO instante
          const grow = clamp01((f - 16) / 26);
          const off = clamp01((f - 62) / 18);            // después se apagan y el pico se derrumba
          const flatY = BORE_BOT - 96;
          const hitY = BORE_TOP + 4;
          const topY = lerp(flatY, hitY, eio(0, 1, grow) * (1 - off));
          const cards: { src: string; kind: "video" | "photo"; label: string; x: number; sf: number }[] = [
            { src: M.hervidorV, kind: "video", label: "HERVIDOR", x: 17, sf: 14 },
            { src: M.microondasV, kind: "video", label: "MICROONDAS", x: 39, sf: 20 },
            { src: M.planchaF, kind: "photo", label: "PLANCHA", x: 61, sf: 0 },
            { src: M.calentadorF, kind: "photo", label: "CALENTADOR", x: 83, sf: 0 },
          ];
          return (
            <>
              <Plane z={0}>
                <PipeSection tint={cold} markAt={SPIKE_X} mark={clamp01((grow - 0.86) / 0.14)} />
              </Plane>
              <Plane z={90}>
                <div style={{
                  position: "absolute", left: 300, top: flatY - 3, height: 6, width: 1840,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.95)}, ${rgba(V.volt, 0.7)})`,
                  boxShadow: `0 0 22px ${rgba(V.volt, 0.5)}`,
                }} />
                <div style={{
                  position: "absolute", left: SPIKE_X - 5, top: topY, width: 10, height: Math.max(0, flatY - topY),
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.99)}, ${rgba(V.amber, 0.45)})`,
                  boxShadow: `0 0 ${(30 + 40 * grow).toFixed(1)}px ${rgba(V.amber, 0.7)}`,
                }} />
              </Plane>
              {/* ⭐ LAS CUATRO CARGAS, cada una con su MATERIAL REAL, encendiendo a la vez */}
              <Plane z={200}>
                {cards.map((c, i) => (
                  <div key={c.label}>
                    <MediaCard src={c.src} kind={c.kind} w={296} h={182} x={c.x} y={13} z={0}
                      ry={(i - 1.5) * 5} lit={0.34 + 0.66 * on * (1 - off)} litColor={V.amber}
                      label={c.label} startFrom={c.sf} sheenAt={toCF(14)} radius={8} />
                    {/* el hilo que baja de cada carga hasta el pico: las cuatro LO hacen */}
                    <div style={{
                      position: "absolute", left: `${c.x}%`, top: pc(232) + "%", width: 2,
                      height: (BORE_TOP - 232) * on * (1 - off),
                      background: `linear-gradient(180deg, rgba(0,0,0,0), ${rgba(V.amber, 0.8)})`,
                    }} />
                  </div>
                ))}
              </Plane>
              <Plane z={300}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: "78%", textAlign: "center",
                  opacity: clamp01((f - 72) / 16),
                }}>
                  <Head size={84} color={V.white}>TODO EL AÑO POR DOS MINUTOS</Head>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
