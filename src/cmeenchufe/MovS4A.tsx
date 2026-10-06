// MovS4A.tsx — MOVIMIENTO S4A · "EL PRECIO DEL KILOVATIO POR FRANJA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 7 actos · 462.920 → 524.680 ms · 1853 frames @30.
//
// LA IDEA: el kilovatio hora no tiene UN precio, tiene TRES. Punta 34 ¢ · llano 19 ¢ · valle 6 ¢:
// casi SEIS VECES por la misma electricidad. Lo que se cobra no es la energía, es EL MOMENTO.
//
// LA MATERIA QUE CRUZA LAS SEIS FRONTERAS: **EL RENGLÓN DE LA FACTURA**.
//   acto 1 → es un renglón encendido sobre la hoja real que flota de canto;
//   acto 2 → la cámara ENTRA en ese renglón y sale del otro lado convertido en TRES franjas;
//   acto 3 → las tres franjas se paran de canto y son TRES COLUMNAS de precio;
//   acto 4 → dos de esas columnas quedan enfrentadas y una REGLA VOLTIO las mide de ancho;
//   acto 5 → esa misma regla se estira hasta el fondo y deja de ser regla: es LA CALLE;
//   acto 6 → todo se apaga menos un punto: la aguja del reloj clavada en un instante.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (z −300 → +540) + una grúa continua que
// TREPA la columna de punta, BAJA a ras del piso y vuelve a SUBIR siguiendo la curva de demanda.
// Como es función pura de `gFrame`, la cámara sigue viajando durante los clips reales que van
// entre acto y acto: el acto 3 empieza exactamente donde el acto 2 la dejó. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: VOLT (la medición) → se enfría a SKY desde ARRIBA cuando enciende el país (la compañía),
// mientras el ÁMBAR de abajo (lo que te queda) se apaga. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-96 · "NÚMERO UNO: EL PRECIO POR FRANJA"      material: CLIP alisa_factura
//   entra  cam {z −300, plano medio de la hoja sobre la madera} luz {VOLT, key 0.16, int 0.90}
//   sale   cam {METIDA DENTRO del renglón, push ×3.35}          luz {VOLT, key 0.19}
//   ── FRONTERA A ···· ZOOM-THROUGH: la cámara entra en el renglón y sale del otro lado. ····
// ACTO 2 · g353-485 · "PUNTA · LLANO · VALLE"              material: FOTO hoja (fuera de foco) + FOTO otra factura
//   entra  cam {saliendo del renglón, push 3.0 → 1}             luz {VOLT, key 0.28}
//   sale   cam {plano general de las tres franjas}              luz {VOLT + frío arriba, key 0.31}
//   ── FRONTERA B ···· MATCH-SHAPE: las tres franjas SE PARAN DE CANTO. ·····················
// ACTO 3 · g555-717 · "34 · 19 · 6"                        material: CLIP lavadora + FOTO foco + FOTO cocina
//   entra  cam {a la altura del piso, grúa +8}                  luz {key 0.34}
//   sale   cam {grúa +230, ARRIBA, pegada a la columna de punta} luz {key 0.42}
//   ── FRONTERA C ···· MATCH-MOVE: la cámara sigue bajando por el costado de la columna. ····
// ACTO 4 · g836-926 · "34 CONTRA 6, LA MISMA ELECTRICIDAD" material: CLIP lavadora ×2 (mismo startFrom)
//   entra  cam {grúa +180, mirando desde arriba}                luz {key 0.46, empieza el frío}
//   sale   cam {grúa −96, A RAS DEL PISO}                       luz {key 0.52, 35% frío}
//   ── FRONTERA D ···· MORPH: la regla voltio se estira hasta el fondo y es LA CALLE. ·······
// ACTO 5 · g1456-1606 · "A LAS 20:00, TODO JUNTO"          material: FOTO mi fachada + FOTO pasillo prendido
//   entra  cam {grúa −70, a ras del asfalto}                    luz {key 0.68, frío pleno desde arriba}
//   sale   cam {grúa +240, trepando la cresta de la curva}      luz {key 0.72, frío total}
//   ── FRONTERA E ···· APAGÓN SELECTIVO: todo se apaga menos un punto = la aguja. ···········
// ACTO 6 · g1775-1844 · "TÚ NO PAGAS LA ENERGÍA / PAGAS EL MOMENTO"   sin material (pedido del director)
//   entra  negro VOLT, un solo objeto: el reloj. LA CÁMARA SE DETIENE (única vez del movimiento).
//   ── FRONTERA F ···· CORTE SECO ···························································
// ACTO 7 · g1844-1853 · respiración: 0,3 s de negro absoluto, sin objeto y sin fundido.
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 353, A3 = 555, A4 = 836, A5 = 1456, A6 = 1775, A7 = 1844;
const G_END = 1853;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7 };

const FLOOR = 900;                              // el piso del cuadro, en px de la comp 1920×1080
const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  hojaV: "broll/cmeenchufe/cmee_s4_alisa_factura.mp4",
  hojaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  vueltaF: "img/cmeenchufe/cmee_s4_da_vuelta_hoja.png",
  otraF: "img/cmeenchufe/cmee_s4_otra_factura_formato.png",
  lavadoraV: "broll/cmeenchufe/cmee_s4_pinza_lavadora.mp4",
  lavadoraF: "img/cmeenchufe/cmee_s4_pinza_lavadora.png",
  focoF: "img/cmeenchufe/cmee_s1_foco_viejo.png",
  cocinaF: "img/cmeenchufe/cmee_s7_refri_noche.png",
  miCasaF: "img/cmeenchufe/cmee_s1_fachada_noche.png",
  prendidoF: "img/cmeenchufe/cmee_s9_pasillo_todo_prendido.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
  icNube: "img/cmeenchufe/cmee_ic_nube.png",
};

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const gg = Math.min(g, A6);                     // en el remate la cámara SE DETIENE (única vez)
  const base = gcam(gg, { z0: -300, z1: 540, panX: -140, panY: 18, ry: -7, rx: 2.4, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): trepa la columna de punta, baja a ras, vuelve a subir.
  const crane = interpolate(
    gg,
    [0, A3, A3 + 130, A4 + 20, A4 + 88, A5, A5 + 120, A6],
    [0, 8, 230, 180, -96, -70, 240, 286],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH del acto 1: entramos DENTRO del renglón y salimos del otro lado en el acto 2.
  const push = interpolate(gg, [A1 + 52, A1 + 96, A2, A2 + 36], [1, 3.35, 3.0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 46) * (push - 1);              // el renglón vive en x 46% / y 45%
  const ty = (50 - 45) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LAS TRES FRANJAS (el dato duro del movimiento) ───────────────────────────────────────────
type Franja = {
  key: string; alt: string; price: string; h: number; x: number;
  src: string; kind: "video" | "photo"; tint: string; at: number; band: number;
};
const FR: Franja[] = [
  // la altura es el precio: 600 · 335 · 106 px = 34 · 19 · 6 centavos, a escala exacta
  { key: "PUNTA", alt: "PICO", price: "34", h: 600, x: 25, src: M.lavadoraV, kind: "video", tint: V.sky, at: 62, band: 324 },
  { key: "LLANO", alt: "RESTO", price: "19", h: 335, x: 50, src: M.focoF, kind: "photo", tint: V.bone, at: 100, band: 540 },
  { key: "VALLE", alt: "NOCTURNO", price: "6", h: 106, x: 75, src: M.cocinaF, kind: "photo", tint: V.amber, at: 128, band: 756 },
];
const cardY = (h: number) => Math.min(FLOOR - h + 118, FLOOR - 100);

// la columna: hormigón oscuro con la luz de su franja lamiéndole el canto de arriba
const Slab: React.FC<{ x: number; w: number; h: number; top: number; tint: string; z: number }> = ({
  x, w, h, top, tint, z,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top, width: w, height: h, marginLeft: -w / 2,
    transform: `translateZ(${z}px)`,
    background: `linear-gradient(180deg, ${rgba(tint, 0.26)} 0%, ${rgba(V.ink2, 0.97)} 20%, ${rgba(V.ink1, 1)} 100%)`,
    borderTop: `3px solid ${rgba(tint, 0.9)}`,
    boxShadow: `0 30px 70px ${rgba(V.ink0, 0.85)}, inset 0 0 70px ${rgba(V.ink0, 0.66)}, inset -18px 0 34px ${rgba(V.ink0, 0.7)}`,
  }}>
    {/* el canto lateral: la columna tiene ESPESOR, no es un rectángulo */}
    <div style={{
      position: "absolute", right: -17, top: 6, width: 17, height: Math.max(0, h - 6),
      background: `linear-gradient(180deg, ${rgba(tint, 0.16)}, ${rgba(V.ink0, 0.98)})`,
      transform: "skewY(-9deg)", transformOrigin: "left top",
    }} />
  </div>
);

// el corchete de medida: esto SÍ es un gráfico (mide algo), así que va en vector
const Bracket: React.FC<{ x: number; y: number; w: number; label: string; color: string; p: number }> = ({
  x, y, w, label, color, p,
}) => (
  <div style={{ position: "absolute", left: `${x}%`, top: y, width: w, marginLeft: -w / 2, opacity: p }}>
    <div style={{ position: "relative", height: 2, background: rgba(color, 0.92), transform: `scaleX(${p.toFixed(3)})` }}>
      <div style={{ position: "absolute", left: 0, top: -11, width: 2, height: 24, background: rgba(color, 0.92) }} />
      <div style={{ position: "absolute", right: 0, top: -11, width: 2, height: 24, background: rgba(color, 0.92) }} />
    </div>
    <div style={{
      marginTop: 10, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34,
      letterSpacing: 2.6, color, textShadow: "0 4px 18px rgba(0,0,0,0.92)",
    }}>{label}</div>
  </div>
);

export const MovS4A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A3, A5, A6], [0.16, 0.34, 0.68, 0.74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [A4, A5 + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A3, A5, A6, A6 + 40], [0.9, 1.05, 1.16, 0.52, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A5, A6], [0.55, 0.64, 0.88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la hoja real se despega de la madera ══════════════════════════════ */}
        {acto === 1 && (() => {
          const rise = clamp01(f / 46);
          const cy = eio(64, 45, rise);
          const ry = eio(-44, -19, rise);
          const glow = clamp01((f - 22) / 12);
          const numT = clamp01((f - 26) / 26);
          return (
            <>
              <Plane z={-560}><PhotoPlane src={M.hojaF} kind="photo" z={0} scale={1.32} dim={0.66} tint={V.volt} /></Plane>
              <Plane z={0}>
                <MediaCard src={M.hojaV} kind="video" w={780} h={470} x={46} y={cy} z={eio(-70, 120, rise)}
                  ry={ry} rx={eio(11, 2, rise)} startFrom={12} lit={1} litColor={V.volt} sheenAt={toCF(16)} radius={10} />
                {/* EL RENGLÓN: el objeto que va a cruzar las seis fronteras del movimiento */}
                <div style={{
                  position: "absolute", left: "46%", top: `${(cy - 6.4).toFixed(2)}%`, width: 560, height: 13, marginLeft: -280,
                  transform: `rotateY(${ry.toFixed(2)}deg)`, opacity: glow,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0)} 0%, ${rgba(V.volt, 0.92)} 16%, ${rgba(V.volt, 0.92)} 84%, ${rgba(V.volt, 0)} 100%)`,
                  boxShadow: `0 0 34px ${rgba(V.volt, 0.7 * glow)}`,
                }} />
              </Plane>
              <Plane z={200}>
                <div style={{
                  position: "absolute", left: `${lerp(44, 14.5, numT).toFixed(2)}%`, top: `${lerp(cy - 6, 44, numT).toFixed(2)}%`,
                  transform: `translate(-50%,-50%) scale(${lerp(0.34, 1, numT).toFixed(3)})`,
                }}>
                  <Num size={210} color={V.volt}>1</Num>
                </div>
                {f > 42 && (
                  <div style={{ position: "absolute", left: "14.5%", top: "58%", transform: "translate(-50%,0)", opacity: clamp01((f - 42) / 10) }}>
                    <Kick color={V.bone}>EL PRECIO POR FRANJA</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el renglón se abrió en TRES franjas ═══════════════════════════════ */}
        {acto === 2 && (() => {
          const open = clamp01(f / 30);
          const altP = clamp01((f - 76) / 18);
          const cardX = eio(110, 84, clamp01((f - 76) / 24));
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.vueltaF} kind="photo" z={0} scale={1.28} dim={0.72} tint={V.volt} /></Plane>
              {/* la hoja real sigue de canto al fondo, ahora fuera de foco */}
              <Plane z={-260}>
                <div style={{ filter: "blur(6px)", opacity: 0.6 }}>
                  <MediaCard src={M.hojaF} kind="photo" w={430} h={268} x={82} y={22} z={0} ry={-66} lit={0.4} litColor={V.volt} radius={10} />
                </div>
              </Plane>
              <Plane z={40}>
                {FR.map((fr, i) => {
                  const w = eio(300, 1180, open);
                  const y = eio(45 + i * 5, pc(fr.band), open);
                  const from = i === 0 ? V.sky : i === 2 ? V.amber : V.bone;
                  return (
                    <div key={fr.key}>
                      <div style={{
                        position: "absolute", left: `${eio(46, 42, open).toFixed(2)}%`, top: `${y.toFixed(2)}%`,
                        width: w, height: 116, marginLeft: -w / 2, marginTop: -58,
                        background: i === 0
                          ? `linear-gradient(180deg, ${rgba(from, 0.3)} 0%, ${rgba(V.ink1, 0.96)} 68%)`
                          : i === 2
                            ? `linear-gradient(0deg, ${rgba(from, 0.28)} 0%, ${rgba(V.ink1, 0.96)} 68%)`
                            : `linear-gradient(180deg, ${rgba(V.ink2, 0.97)} 0%, ${rgba(V.ink1, 0.97)} 100%)`,
                        borderLeft: `4px solid ${rgba(from, 0.92)}`,
                        boxShadow: `0 22px 52px ${rgba(V.ink0, 0.76)}`,
                      }} />
                      <div style={{ position: "absolute", left: "14%", top: `${y.toFixed(2)}%`, transform: "translateY(-50%)", opacity: clamp01((f - 14 - i * 7) / 10) }}>
                        <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: 5, color: i === 1 ? V.bone : from, textShadow: "0 5px 22px rgba(0,0,0,0.92)" }}>{fr.key}</div>
                        <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 27, letterSpacing: 3.4, color: rgba(V.bone, 0.5 * altP), marginTop: 2 }}>{fr.alt}</div>
                      </div>
                    </div>
                  );
                })}
              </Plane>
              {/* la otra factura: la que le pone otro nombre a lo mismo */}
              {f > 74 && (
                <Plane z={180}>
                  <MediaCard src={M.otraF} kind="photo" w={380} h={236} x={cardX} y={76} z={0} ry={-15} lit={0.8}
                    litColor={V.amber} label="OTRA FACTURA" sheenAt={toCF(92)} radius={10} />
                </Plane>
              )}
            </>
          );
        })()}

        {/* ═══ ACTO 3 · las franjas se paran de canto: TRES COLUMNAS DE PRECIO ═══════════ */}
        {acto === 3 && (() => {
          const m = clamp01(f / 18);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.lavadoraF} kind="photo" z={0} scale={1.3} dim={0.74} tint={V.volt} /></Plane>
              <Plane z={0}>
                {FR.map((fr) => (
                  <Slab key={fr.key} x={eio(42, fr.x, m)} w={eio(1180, 380, m)} h={eio(116, fr.h, m)}
                    top={eio(fr.band - 58, FLOOR - fr.h, m)} tint={fr.tint} z={0} />
                ))}
              </Plane>
              <Plane z={120}>
                {FR.map((fr, i) => {
                  const up = clamp01((f - 16 - i * 9) / 26);
                  if (up <= 0) return null;
                  const y = pc(lerp(FLOOR + 30, cardY(fr.h), eio(0, 1, up)));
                  return (
                    <MediaCard key={fr.key} src={fr.src} kind={fr.kind} w={322} h={192} x={fr.x} y={y} z={0}
                      ry={-4} startFrom={18} lit={0.55 + 0.45 * up} litColor={fr.tint} sheenAt={toCF(24 + i * 9)} radius={8} />
                  );
                })}
              </Plane>
              <Plane z={240}>
                {FR.map((fr) => (
                  <Readout key={fr.key} value={fr.price} unit="¢" at={toCF(fr.at)} x={fr.x} y={pc(FLOOR - fr.h - 70)} size={104} color={fr.tint} />
                ))}
                {FR.map((fr) => (
                  <div key={fr.key} style={{
                    position: "absolute", left: `${fr.x}%`, top: `${pc(FLOOR + 26).toFixed(2)}%`, transform: "translateX(-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 4.4,
                    color: fr.key === "LLANO" ? V.bone : fr.tint, textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                  }}>{fr.key}</div>
                ))}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · 34 contra 6: la MISMA electricidad, cuadro por cuadro ════════════ */}
        {acto === 4 && (() => {
          const s = clamp01(f / 24);
          const punta = FR[0], llano = FR[1], valle = FR[2];
          const px = eio(25, 32, s), vx = eio(75, 68, s), lx = eio(50, 124, s);
          const drop = clamp01((f - 8) / 22);
          const bp = clamp01((f - 26) / 16);
          const horas = [{ x: px, t: "21:00", c: V.sky }, { x: vx, t: "03:00", c: V.amber }];
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.lavadoraF} kind="photo" z={0} scale={1.34} dim={0.76} tint={V.sky} /></Plane>
              <Plane z={0}>
                <Slab x={lx} w={380} h={llano.h} top={FLOOR - llano.h} tint={llano.tint} z={-60} />
                <Slab x={px} w={380} h={punta.h} top={FLOOR - punta.h} tint={punta.tint} z={0} />
                <Slab x={vx} w={380} h={valle.h} top={FLOOR - valle.h} tint={valle.tint} z={0} />
              </Plane>
              {/* ⭐ LAS DOS TARJETAS CORREN EL MISMO CLIP CON EL MISMO startFrom: idénticas al cuadro */}
              <Plane z={120}>
                <MediaCard src={M.lavadoraV} kind="video" w={322} h={192} x={px} y={pc(cardY(punta.h))} z={0}
                  ry={-4} startFrom={18} lit={1} litColor={V.sky} sheenAt={toCF(30)} radius={8} />
                <MediaCard src={M.lavadoraV} kind="video" w={322} h={192} x={vx} y={pc(cardY(valle.h))} z={0}
                  ry={-4} startFrom={18} lit={1} litColor={V.amber} sheenAt={toCF(30)} radius={8} />
              </Plane>
              {/* la regla voltio cae entre las dos y las mide DE ANCHO: marcan exactamente lo mismo */}
              <Plane z={240}>
                <IconPng src={M.icRegla} x={50} y={eio(-16, 44, drop)} size={190} z={0} opacity={0.94} rot={eio(-24, -4, drop)} glow={V.volt} />
                <Bracket x={px} y={FLOOR - punta.h - 118} w={380} label="1 kWh" color={V.volt} p={bp} />
                <Bracket x={vx} y={FLOOR - valle.h - 118} w={380} label="1 kWh" color={V.volt} p={bp} />
                <Readout value={punta.price} unit="¢" at={toCF(0)} x={px} y={pc(FLOOR - punta.h - 196)} size={112} color={V.sky} />
                <Readout value={valle.price} unit="¢" at={toCF(0)} x={vx} y={pc(FLOOR - valle.h - 196)} size={112} color={V.amber} />
                {/* lo ÚNICO distinto entre las dos columnas: la hora */}
                {horas.map((o) => (
                  <div key={o.t} style={{
                    position: "absolute", left: `${o.x.toFixed(2)}%`, top: `${pc(FLOOR + 26).toFixed(2)}%`, transform: "translateX(-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 56, letterSpacing: 3.4, color: o.c,
                    textShadow: "0 5px 24px rgba(0,0,0,0.94)", opacity: clamp01((f - 34) / 12),
                  }}>{o.t}</div>
                ))}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · la regla se estira y es LA CALLE: todo enciende a la vez ═════════ */}
        {acto === 5 && (() => {
          const stretch = clamp01(f / 20);
          const curve = clamp01((f - 26) / 62);
          const chim = clamp01((f - 92) / 34);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.miCasaF} kind="photo" z={0} scale={1.36} dim={0.8} tint={V.sky} /></Plane>
              {/* la regla del acto 4, estirada hasta el fondo: ahora es el asfalto de la cuadra */}
              <Plane z={-120}>
                <div style={{
                  position: "absolute", left: "50%", top: 706, height: 3,
                  width: eio(380, 1860, stretch), marginLeft: eio(-190, -930, stretch),
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.75)} 12%, ${rgba(V.volt, 0.75)} 88%, ${rgba(V.volt, 0)})`,
                  boxShadow: `0 0 26px ${rgba(V.volt, 0.45)}`,
                }} />
                {/* la fila de casas oscuras vista desde arriba: esto ES un esquema, va en vector */}
                {Array.from({ length: 9 }, (_, i) => {
                  const hh = 108 + rnd(i * 3.7) * 46;
                  const on = clamp01((f - (30 + i * 2.2 + rnd(i * 5.1) * 3)) / 4);
                  return (
                    <div key={i} style={{ position: "absolute", left: 84 + i * 196, top: 706 - hh, width: 168, height: hh }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                        background: `linear-gradient(180deg, ${rgba(V.ink2, 0.98)}, ${rgba(V.ink0, 1)})`,
                        clipPath: "polygon(50% 0%, 100% 26%, 100% 100%, 0% 100%, 0% 26%)",
                        boxShadow: `0 10px 26px ${rgba(V.ink0, 0.9)}`,
                      }} />
                      {[0, 1].map((w) => (
                        <div key={w} style={{
                          position: "absolute", left: 34 + w * 66, bottom: 22, width: 42, height: 40,
                          background: rgba(V.amber, 0.1 + 0.85 * on),
                          boxShadow: on > 0 ? `0 0 ${(26 * on).toFixed(1)}px ${rgba(V.amber, 0.7 * on)}` : "none",
                        }} />
                      ))}
                    </div>
                  );
                })}
              </Plane>
              {/* la joroba de demanda: sube de los techos y NO vuelve a bajar (esto es un gráfico) */}
              <Plane z={60}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 90 700 C 470 706 660 660 860 520 S 1160 344 1830 320"
                      fill="none" stroke={V.sky} strokeWidth={7} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - curve}
                      style={{ filter: `drop-shadow(0 0 22px ${rgba(V.sky, 0.75)})` }} />
                  </svg>
                </AbsoluteFill>
                {/* en la cresta se abren dos chimeneas de hormigón */}
                {[1215, 1400].map((cxp, i) => {
                  const gr = eio(0, 1, clamp01(chim - i * 0.18));
                  return (
                    <div key={cxp} style={{
                      position: "absolute", left: cxp, top: 330 - 300 * gr, width: 74, height: 300 * gr,
                      background: `linear-gradient(180deg, ${rgba(V.concrete, 0.42)}, ${rgba(V.ink1, 0.99)})`,
                      boxShadow: `inset -14px 0 26px ${rgba(V.ink0, 0.8)}`,
                    }} />
                  );
                })}
                {chim > 0.5 && (
                  <>
                    <IconPng src={M.icNube} x={64.5} y={pc(300 - 120 * chim)} size={190} z={0} opacity={0.42 * chim} glow={V.ink0} />
                    <IconPng src={M.icNube} x={74.2} y={pc(320 - 96 * chim)} size={150} z={0} opacity={0.3 * chim} glow={V.ink0} />
                  </>
                )}
              </Plane>
              <Plane z={220}>
                <Readout value="20:00" label="HORA" at={toCF(18)} x={28} y={20} size={128} color={V.sky} />
                {/* el material REAL abajo: la casa que ya estaba encendida y la que acaba de encender */}
                <MediaCard src={M.miCasaF} kind="photo" w={310} h={192} x={13} y={85} z={0} ry={9} lit={1}
                  litColor={V.amber} label="MI CASA" sheenAt={toCF(10)} radius={8} />
                <MediaCard src={M.prendidoF} kind="photo" w={310} h={192} x={87} y={85} z={0} ry={-9} lit={0.9}
                  litColor={V.sky} label="Y LA DE AL LADO" sheenAt={toCF(46)} radius={8} />
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* ═══ ACTO 6 · el remate: la cámara se detiene y queda un solo punto ═══════════════ */}
      {acto === 6 && (() => {
        const a = clamp01(f / 8);
        const b = clamp01((f - 34) / 8);
        return (
          <>
            {/* el apagón: la atmósfera NO se remonta, se entierra */}
            <AbsoluteFill style={{ background: rgba(V.ink0, 0.86 + 0.1 * a) }} />
            <IconPng src={M.icReloj} x={50} y={26} size={148} z={0} opacity={0.9} glow={V.volt} />
            {/* la aguja, clavada en un instante */}
            <div style={{
              position: "absolute", left: "50%", top: `${(26 + pc(74)).toFixed(2)}%`, width: 3, height: 58, marginLeft: -1.5,
              transformOrigin: "50% 100%", transform: "rotate(212deg)",
              background: rgba(V.volt, 0.95), boxShadow: `0 0 20px ${rgba(V.volt, 0.8)}`,
            }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "52%", textAlign: "center", opacity: a, transform: `translateY(${lerp(20, 0, a).toFixed(1)}px)` }}>
              <Head size={80} color={V.bone}>TÚ NO PAGAS LA ENERGÍA</Head>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: "65%", textAlign: "center", opacity: b, transform: `translateY(${lerp(20, 0, b).toFixed(1)}px)` }}>
              <Head size={96} color={V.volt}>PAGAS EL MOMENTO</Head>
            </div>
          </>
        );
      })()}

      {/* ═══ ACTO 7 · respiración: 0,3 s de negro absoluto, sin objeto y sin fundido ══════ */}
      {acto === 7 && <AbsoluteFill style={{ background: "#000000" }} />}
    </AbsoluteFill>
  );
};
