// MovS9A.tsx — MOVIMIENTO S9A · "EL APAGÓN"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 3 actos · 1.343.310 → 1.353.970 ms · 320 frames @30.
//
// LA IDEA: se corta la luz en todo el barrio con tormenta. Afuera, la calle mojada y negra. Adentro
// de su casa NO PASA NADA. El contraste vive en EL MISMO FRAME: el cuadro es el punto más bajo de luz
// de todo el video —casi negro azulado— y la ÚNICA fuente cálida es la tarjeta con el interior andando.
//
// LA MATERIA QUE CRUZA LAS DOS FRONTERAS: **LA BARRA DE CARGA**.
//   acto 1 → la tarjeta cálida se estira hacia abajo, se vuelve el haz que baja por la pared hasta el
//            piso del garaje, y ahí la caja gris respira con su led verde: la barra empieza a llenarse;
//   acto 2 → la barra llena se despega del costado de la caja y SE ACUESTA (misma curva Bézier, un solo
//            path que interpola de segmento vertical a arco): deja de ser barra y es el arco de un reloj;
//   acto 3 → ese arco es TRES HORAS, y encima PROBLEMA se cae letra por letra y se rearma como ANÉCDOTA.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono + una grúa que BAJA de punta a punta (de la
// ventana, por la pared, hasta el piso del garaje) y nunca se detiene ni vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: SKY (el azul profundo del apagón, intensidad 0,40 = el suelo del video) → en el acto 3 se
// enciende la lámpara desnuda del garaje y todo vuelve a TORCH/ÁMBAR. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-157 · "8 kWh CARGADOS EN EL GARAJE"     material: FOTO calle negra + CLIP refri/router/hija + CLIP led verde
//   entra  cam {grúa +240, pegada al vidrio de la ventana}  luz {SKY, key 0.80, int 0.40, piso 0.92}
//   sale   cam {grúa −40, bajando por la pared}             luz {SKY, key 0.62, int 0.52}
//   ── FRONTERA A ···· MORPH: la barra de carga llena se despega del costado de la caja. ······
// ACTO 2 · g157-229 · "UN CORTE DE TRES HORAS"        material: CLIP led verde (sigue en cuadro)
//   entra  cam {grúa −40, a la altura de la caja}           luz {SKY, key 0.62}
//   sale   cam {grúa −168, a ras del piso}                  luz {SKY→TORCH 20%, key 0.50}
//   ── FRONTERA B ···· MATCH-SHAPE: el MISMO path sigue curvándose y ya es el arco del reloj. ·
// ACTO 3 · g229-320 · "PROBLEMA → ANÉCDOTA"           material: CLIP pasillo todo prendido
//   entra  cam {grúa −168}                                  luz {TORCH 20%, lámpara desnuda encendiéndose}
//   sale   cam {grúa −262, sigue bajando}                   luz {TORCH pleno, key 0.34, int 1.06}
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
const A1 = 0, A2 = 157, A3 = 229;
const G_END = 320;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3 };

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  calleF: "img/cmeenchufe/cmee_s9_cortina_calle_negra.png",
  calleV: "broll/cmeenchufe/cmee_s9_cortina_calle_negra.mp4",
  refriV: "broll/cmeenchufe/cmee_s9_refri_andando.mp4",
  routerV: "broll/cmeenchufe/cmee_s9_router_verde.mp4",
  hijaV: "broll/cmeenchufe/cmee_s9_hija_telefono.mp4",
  ledV: "broll/cmeenchufe/cmee_s5_led_verde_penumbra.mp4",
  pasilloV: "broll/cmeenchufe/cmee_s9_pasillo_todo_prendido.mp4",
  icBombilla: "img/cmeenchufe/cmee_ic_bombillanoche.png",
};

// LA CADENA DEL INTERIOR: tres clips reales encadenados DENTRO DEL MISMO MARCO.
const CHAIN: { src: string; label: string }[] = [
  { src: M.refriV, label: "EL REFRIGERADOR" },
  { src: M.routerV, label: "EL INTERNET" },
  { src: M.hijaV, label: "Y ELLA NI LEVANTÓ LA CABEZA" },
];

// ── LA LLUVIA — cruza por delante TODO el movimiento ─────────────────────────────────────────
const RainVeil: React.FC<{ amount: number; tint?: string; count?: number }> = ({
  amount, tint = V.sky, count = 44,
}) => {
  const frame = useCurrentFrame();
  const a = clamp01(amount);
  if (a <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.26 + 0.62 * a }}>
      {Array.from({ length: count }, (_, i) => {
        const sp = 2.9 + rnd(i * 3.7) * 4.6;
        const len = 62 + rnd(i * 8.1) * 170;
        const yy = ((rnd(i * 2.3) * 150 + frame * sp) % 158) - 32;
        const xx = rnd(i * 5.9) * 108 - 4;
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
            width: 2, height: len, transform: "rotate(8deg)",
            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(tint, 0.1 + rnd(i * 4.4) * 0.24)} 55%, rgba(0,0,0,0) 100%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LA GEOMETRÍA COMPARTIDA (px de la comp 1920×1080) ────────────────────────────────────────
const BOX = { x: 38, y: 76, w: 430, h: 262 };            // la caja gris con su led verde
const BAR = { left: 972, bottom: 952, w: 78, maxH: 302 }; // la barra de carga pegada a su costado
const ARC = { cx: 934, cy: 706, r: 300 };                 // el arco de tres horas del reloj

// EL PATH ÚNICO: interpola de SEGMENTO VERTICAL (la barra) a ARCO DE TRES HORAS (el reloj).
// Es la misma curva de punta a punta: la costura A→B es una transformación, no un corte.
const barToArc = (lay: number, fill: number) => {
  const t = clamp01(lay);
  const topY = BAR.bottom - BAR.maxH * clamp01(fill);
  const cxBar = BAR.left + BAR.w / 2;
  // vertical: de abajo hacia arriba, control en el medio
  const v = { x0: cxBar, y0: BAR.bottom, cx: cxBar, cy: (BAR.bottom + topY) / 2, x1: cxBar, y1: topY };
  // arco: de las 12 a las 3 de un reloj (un cuarto de vuelta = tres horas)
  const a = { x0: ARC.cx, y0: ARC.cy - ARC.r, cx: ARC.cx + ARC.r, cy: ARC.cy - ARC.r, x1: ARC.cx + ARC.r, y1: ARC.cy };
  const L = (k: keyof typeof v) => lerp(v[k], a[k], t);
  return `M ${L("x0").toFixed(1)} ${L("y0").toFixed(1)} Q ${L("cx").toFixed(1)} ${L("cy").toFixed(1)} ${L("x1").toFixed(1)} ${L("y1").toFixed(1)}`;
};

// ── LA CÁMARA · una sola función de gFrame, que BAJA de punta a punta ────────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -250, z1: 300, panX: 108, panY: -30, ry: 5.4, rx: -1.5, dur: G_END });
  // la grúa DESCIENDE: de la ventana, por la pared, hasta el piso del garaje. Monótona.
  const crane = interpolate(g, [0, 96, A2, A3, G_END], [240, -40, -70, -168, -262], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.35, 0, 0.24, 1),
  });
  return `${base.transform} translateY(${crane.toFixed(1)}px)`;
};

export const MovS9A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto
  const toCF = (t: number) => cf - f + t;    // mi frame → reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: el suelo de luz del video y la vuelta al calor.
  const warm = interpolate(gFrame, [A3 - 26, A3 + 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(gFrame, [0, A2, A3, G_END], [0.8, 0.62, 0.5, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, 96, A2, A3, G_END], [0.4, 0.52, 0.58, 0.72, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, G_END], [0.92, 0.86, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rain = interpolate(gFrame, [0, A2, A3, G_END], [1, 0.86, 0.5, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  // la barra: se llena en el acto 1 y remata en el 2; se acuesta entre el final del 2 y el arranque del 3
  const fill = interpolate(gFrame, [A1 + 104, A2 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const lay = interpolate(gFrame, [A2 + 26, A2 + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.2, 1) });
  const strokeW = lerp(BAR.w, 26, lay);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: una sola vez. El punto más bajo de luz de todo el video. ────────── */}
      <VoltAtmos tint={light(warm, "sky", "torch")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · afuera negro azulado · adentro no pasa nada ═════════════════════════ */}
        {acto === 1 && (() => {
          const grow = clamp01(f / 26);
          const cx = eio(112, 74, grow);
          const idx = f < 62 ? 0 : f < 106 ? 1 : 2;
          const beam = clamp01((f - 78) / 34);
          const boxIn = clamp01((f - 96) / 26);
          return (
            <>
              {/* la calle mojada: apenas insinuada por el reflejo del agua */}
              <Plane z={-660}>
                <PhotoPlane src={M.calleF} kind="photo" z={0} scale={1.34} dim={0.9} tint={V.sky} />
              </Plane>
              {/* el buzón y el poste apagados: siluetas, no objetos */}
              <Plane z={-420}>
                <div style={{
                  position: "absolute", left: 250, top: 470, width: 54, height: 340,
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.1)}, ${rgba(V.ink0, 1)})`,
                }} />
                <div style={{
                  position: "absolute", left: 1548, top: 120, width: 26, height: 760,
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.13)}, ${rgba(V.ink0, 1)})`,
                }} />
                <div style={{
                  position: "absolute", left: 1470, top: 128, width: 182, height: 14,
                  background: rgba(V.ink0, 0.98), boxShadow: `0 1px 0 ${rgba(V.sky, 0.12)}`,
                }} />
              </Plane>

              {/* ⭐ LA ÚNICA FUENTE CÁLIDA DEL CUADRO: el interior andando, tres clips en UN marco */}
              <Plane z={140}>
                <div style={{
                  position: "absolute", left: `${cx}%`, top: "38%", width: 900, height: 640,
                  marginLeft: -450, marginTop: -320, borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(V.amber, 0.24 * grow)} 0%, rgba(0,0,0,0) 66%)`,
                  filter: "blur(10px)",
                }} />
                <MediaCard src={CHAIN[idx].src} kind="video" w={604} h={352} x={cx} y={38} z={0}
                  ry={-13} rx={2} startFrom={10} lit={1} litColor={V.amber} label={CHAIN[idx].label}
                  sheenAt={toCF(20)} radius={12} />
              </Plane>

              {/* la tarjeta se estira hacia abajo: el haz que baja por la pared hasta el piso */}
              {beam > 0 && (
                <Plane z={60}>
                  <div style={{
                    position: "absolute", left: `${(cx - 12).toFixed(2)}%`, top: 590,
                    width: 300, height: eio(0, 430, beam),
                    background: `linear-gradient(180deg, ${rgba(V.amber, 0.3)} 0%, ${rgba(V.amber, 0.07)} 62%, rgba(0,0,0,0) 100%)`,
                    clipPath: "polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%)",
                    filter: "blur(5px)",
                  }} />
                </Plane>
              )}

              {/* el piso del garaje: la caja gris respira con su led verde */}
              {boxIn > 0 && (
                <>
                  <Plane z={220}>
                    <MediaCard src={M.ledV} kind="video" w={BOX.w} h={BOX.h} x={BOX.x} y={eio(BOX.y + 9, BOX.y, boxIn)}
                      z={0} ry={7} startFrom={14} lit={0.5 + 0.5 * boxIn} litColor={V.volt}
                      label="8 kWh EN EL GARAJE" sheenAt={toCF(112)} radius={10} opacity={boxIn} />
                  </Plane>
                  <Plane z={260}>
                    <ChargeBar fill={fill} lay={lay} strokeW={strokeW} opacity={boxIn} showKwh />
                  </Plane>
                </>
              )}
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la barra llena se despega y SE ACUESTA ══════════════════════════════ */}
        {acto === 2 && (() => {
          const peel = clamp01((f - 20) / 24);
          return (
            <>
              <Plane z={-660}>
                <PhotoPlane src={M.calleV} kind="video" z={0} scale={1.36} dim={0.92} tint={V.sky} startFrom={22} />
              </Plane>
              {/* el azul de la calle sigue entrando por debajo del portón */}
              <Plane z={-300}>
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: 210,
                  background: `linear-gradient(0deg, ${rgba(V.sky, 0.2)} 0%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>
              <Plane z={220}>
                <MediaCard src={M.ledV} kind="video" w={BOX.w} h={BOX.h} x={BOX.x} y={BOX.y} z={0}
                  ry={7} startFrom={14} lit={1 - 0.3 * peel} litColor={V.volt} radius={10} />
              </Plane>
              <Plane z={260}>
                <ChargeBar fill={fill} lay={lay} strokeW={strokeW} opacity={1} showKwh={peel < 0.7} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el arco es TRES HORAS · PROBLEMA se cae y se rearma ANÉCDOTA ════════ */}
        {acto === 3 && (() => {
          const lamp = clamp01((f - 4) / 30);
          const anec = clamp01((f - 30) / 30);
          const pasillo = clamp01((f - 46) / 22);
          const PROB = ["P", "R", "O", "B", "L", "E", "M", "A"];
          const ANEC = ["A", "N", "É", "C", "D", "O", "T", "A"];
          return (
            <>
              <Plane z={-660}>
                <PhotoPlane src={M.pasilloV} kind="video" z={0} scale={1.34} dim={0.87 - 0.14 * lamp} tint={V.torch} startFrom={20} />
              </Plane>
              {/* la lámpara desnuda del garaje se enciende arriba del cuadro */}
              <Plane z={-160}>
                <div style={{
                  position: "absolute", left: "50%", top: -260, width: 1240, height: 900, marginLeft: -620,
                  background: `radial-gradient(circle at 50% 34%, ${rgba(V.torch, 0.3 * lamp)} 0%, rgba(0,0,0,0) 62%)`,
                }} />
                {/* el azul se retira hacia el borde inferior */}
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, height: eio(210, 96, lamp),
                  background: `linear-gradient(0deg, ${rgba(V.sky, 0.2 * (1 - 0.6 * lamp))} 0%, rgba(0,0,0,0) 100%)`,
                }} />
              </Plane>
              <Plane z={40}>
                <IconPng src={M.icBombilla} x={50} y={4} size={104} z={0} opacity={0.5 + 0.5 * lamp} glow={V.torch} />
              </Plane>

              {/* el arco de tres horas: el MISMO path que venía siendo la barra */}
              <Plane z={200}>
                <ChargeBar fill={1} lay={1} strokeW={26} opacity={1} showKwh={false} />
                <div style={{
                  position: "absolute", left: ARC.cx + 176, top: ARC.cy - 300, transform: "translate(-50%,-50%) rotate(-14deg)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: 4,
                  color: V.volt, textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                }}>3 HORAS</div>
              </Plane>

              {/* PROBLEMA se cae letra por letra · ANÉCDOTA se rearma abajo */}
              <Plane z={320}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
                  {PROB.map((ch, i) => {
                    const d = clamp01((f - (8 + i * 4)) / 14);
                    return (
                      <span key={i} style={{
                        display: "inline-block",
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 104, letterSpacing: 6, color: V.sky,
                        textShadow: "0 6px 26px rgba(0,0,0,0.94)",
                        transform: `translateY(${(d * 210).toFixed(1)}px) rotate(${(d * (rnd(i * 4.2) * 46 - 23)).toFixed(2)}deg)`,
                        opacity: 1 - d,
                      }}>{ch}</span>
                    );
                  })}
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}>
                  {ANEC.map((ch, i) => {
                    const u = clamp01((f - (30 + i * 4)) / 14);
                    if (u <= 0) return null;
                    return (
                      <span key={i} style={{
                        display: "inline-block",
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 118, letterSpacing: 6, color: V.volt,
                        textShadow: `0 0 46px ${rgba(V.volt, 0.4 * u)}, 0 6px 26px rgba(0,0,0,0.94)`,
                        transform: `translateY(${((1 - u) * 90).toFixed(1)}px) scale(${lerp(0.72, 1, u).toFixed(3)})`,
                        opacity: u,
                      }}>{ch}</span>
                    );
                  })}
                </div>
                {anec > 0.6 && (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 630, textAlign: "center", opacity: clamp01((anec - 0.6) / 0.4) }}>
                    <Kick color={rgba(V.bone, 0.8)}>ADENTRO NO PASÓ NADA</Kick>
                  </div>
                )}
              </Plane>

              {/* el material real del remate: el pasillo entero encendido durante el apagón */}
              {pasillo > 0 && (
                <Plane z={380}>
                  <MediaCard src={M.pasilloV} kind="video" w={352} h={214} x={eio(-14, 15, pasillo)} y={83} z={0}
                    ry={11} startFrom={16} lit={1} litColor={V.amber} label="MI CASA, ESA NOCHE"
                    sheenAt={toCF(56)} radius={9} />
                </Plane>
              )}
            </>
          );
        })()}
      </Layers>

      {/* la lluvia cruza POR DELANTE de todo, de punta a punta del movimiento */}
      <RainVeil amount={rain} tint={light(warm, "sky", "torch")} />
    </AbsoluteFill>
  );
};

// ── LA BARRA DE CARGA = EL ARCO DEL RELOJ (un solo path, tres actos) ─────────────────────────
const ChargeBar: React.FC<{ fill: number; lay: number; strokeW: number; opacity: number; showKwh: boolean }> = ({
  fill, lay, strokeW, opacity, showKwh,
}) => {
  const d = barToArc(lay, fill);
  const kwhY = BAR.bottom - BAR.maxH * clamp01(fill) * 0.5;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
        {/* el canal de la barra: sólo mientras es barra */}
        <rect x={BAR.left} y={BAR.bottom - BAR.maxH} width={BAR.w} height={BAR.maxH} rx={9}
          fill={rgba(V.ink1, 0.85 * (1 - lay))} stroke={rgba(V.volt, 0.22 * (1 - lay))} strokeWidth={2} />
        <path d={d} fill="none" stroke={V.volt} strokeWidth={strokeW} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 ${(18 + 16 * lay).toFixed(0)}px ${rgba(V.volt, 0.6)})` }} />
      </svg>
      {showKwh && fill > 0.12 && (
        <div style={{
          position: "absolute", left: BAR.left + BAR.w / 2, top: kwhY, transform: "translate(-50%,-50%) rotate(-90deg)",
          fontFamily: F_BODY, fontWeight: 700, fontSize: 30, letterSpacing: 3, whiteSpace: "nowrap",
          color: V.ink0,
        }}>8 kWh</div>
      )}
    </AbsoluteFill>
  );
};
