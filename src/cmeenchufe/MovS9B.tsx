// MovS9B.tsx — MOVIMIENTO S9B · "LOS TRES NÚMEROS"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 6 actos · 1.356.770 → 1.390.090 ms · 1000 frames @30.
//
// LA IDEA: el repaso. Los tres números ya se explicaron en S4 y S5, así que acá NO es una clase: es
// MEMORIA. Rápido, visual, y todo apoyado sobre EL GRANO DEL PAPEL DEL CUADERNO, que es el fondo de
// punta a punta del movimiento y no se remonta nunca.
//
// LA MATERIA QUE CRUZA LAS CINCO FRONTERAS: **LA LÍNEA**.
//   acto 1 → es la barra de veinticuatro horas, dibujada de una sola pasada de izquierda a derecha;
//   acto 2 → dos cifras escritas a mano se despegan del papel y el hueco entre ellas se llena de una
//            VETA de luz cálida, con la casa adentro: la línea se abrió;
//   acto 3 → la veta se acuesta y es la línea de precio; un 2 la estampa y la línea sube un peldaño;
//   acto 4 → el peldaño se para de canto y es LA RAYA vertical; el consumo la pisa y cambia de color;
//   acto 5 → la raya se engorda y es un CAÑO de canto; al lado entra otro caño el doble de grueso;
//   acto 6 → los dos caños se juntan y se aplanan hasta ser LA HOJA: la factura real sobre el banco.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (deriva a la derecha, heredada del plano del
// banco) + una grúa continua que acompaña la separación, trepa con el peldaño y baja con las tres
// piezas hasta la factura. Nunca vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: TORCH cálido (venimos del calor recuperado en S9A) con el frío entrando SÓLO donde hay
// escalón y potencia contratada — lo que te cobran entra de arriba y en frío. Evoluciona, no salta.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-74 · "1. EL PRECIO DE TUS FRANJAS"      material: CLIP anota punta/valle (cama de papel)
//   entra  cam {grúa 0, entrando en el cuaderno}       luz {TORCH, key 0.30, int 0.96}
//   sale   cam {grúa +18, derivando a la derecha}      luz {TORCH, key 0.34}
//   ── FRONTERA A ···· LA LÍNEA SE ABRE: las dos cifras se separan y dejan una veta. ·········
// ACTO 2 · g163-272 · "ORO ESCONDIDO EN TU CASA"      material: CLIP casa con ventanas encendidas
//   entra  cam {grúa +18}                              luz {TORCH, veta cálida desde ABAJO}
//   sale   cam {grúa +40}                              luz {TORCH, key 0.40}
//   ── FRONTERA B ···· MATCH-SHAPE: la veta se acuesta y ya es la línea de precio. ···········
// ACTO 3 · g271-346 · "2. EL ESCALÓN"                 material: CLIP la letra chica de la ficha
//   entra  cam {grúa +40}                              luz {frío 25% entrando desde arriba}
//   sale   cam {grúa +132, subiendo con el peldaño}    luz {frío 45%}
//   ── FRONTERA C ···· MATCH-MOVE: la cámara sigue subiendo y el peldaño se para de canto. ···
// ACTO 4 · g430-586 · "TE SALE UNA FORTUNA"           material: CLIP dígitos del medidor
//   entra  cam {grúa +150}                             luz {frío 50%}
//   sale   cam {grúa +186}                             luz {frío 62%}
//   ── FRONTERA D ···· LA RAYA ENGORDA: de canto ya no es raya, es un caño. ·················
// ACTO 5 · g586-666 · "3. LA POTENCIA CONTRATADA"     material: CLIP cable de cobre + CLIP acometida
//   entra  cam {grúa +186, girando alrededor de los caños}  luz {frío 62%}
//   sale   cam {grúa +150, empezando a bajar}          luz {frío 55%}
//   ── FRONTERA E ···· LOS CAÑOS SE APLANAN: dos cilindros que se juntan y son una hoja. ····
// ACTO 6 · g826-1000 · "ESTÁN LOS TRES EN LA FACTURA" material: FOTO factura cenital sobre el banco
//   entra  cam {grúa +120, bajando con las tres piezas} luz {TORCH de vuelta, frío 20%}
//   sale   cam {grúa −30, apoyada sobre la hoja}       luz {TORCH pleno, key 0.28}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Kick, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 163, A3 = 271, A4 = 430, A5 = 586, A6 = 826;
const G_END = 1000;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6 };

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  anotaV: "broll/cmeenchufe/cmee_s9_anota_punta_valle.mp4",
  anotaF: "img/cmeenchufe/cmee_s9_anota_punta_valle.png",
  casaV: "broll/cmeenchufe/cmee_s1_casa_ventanas_encendidas.mp4",
  letraV: "broll/cmeenchufe/cmee_s9_una_letra_chica.mp4",
  medidorV: "broll/cmeenchufe/cmee_s4_medidor_digitos.mp4",
  cobreV: "broll/cmeenchufe/cmee_s4_cable_cobre.mp4",
  acometidaV: "broll/cmeenchufe/cmee_s6_acometida_calle.mp4",
  facturaF: "img/cmeenchufe/cmee_s4_factura_cenital_cierre.png",
  icCuaderno: "img/cmeenchufe/cmee_ic_cuaderno.png",
  icCasa: "img/cmeenchufe/cmee_ic_casa.png",
  icMedidor: "img/cmeenchufe/cmee_ic_medidor.png",
};

// ── EL GRANO DEL PAPEL: el fondo de TODO el movimiento, se monta una sola vez ────────────────
const PaperGrain: React.FC<{ warmth?: number }> = ({ warmth = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* fibras del papel: líneas finísimas que corren en las dos direcciones */}
    <AbsoluteFill style={{
      opacity: 0.12 * warmth,
      backgroundImage:
        `repeating-linear-gradient(96deg, ${rgba(V.bone, 0.4)} 0px, ${rgba(V.bone, 0.4)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 5px),` +
        `repeating-linear-gradient(6deg, ${rgba(V.bone, 0.22)} 0px, ${rgba(V.bone, 0.22)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 9px)`,
      mixBlendMode: "overlay",
    }} />
    {/* los renglones del cuaderno, apenas insinuados */}
    <AbsoluteFill style={{
      opacity: 0.16 * warmth,
      backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 55px, ${rgba(V.sky, 0.5)} 55px, ${rgba(V.sky, 0.5)} 56px)`,
    }} />
  </AbsoluteFill>
);

// ── LAS 24 HORAS DEL DÍA (el dato del acto 1) ────────────────────────────────────────────────
const HB = { x0: 190, x1: 1730, y: 604, h: 84 };
const hourTint = (h: number) => (h >= 18 && h <= 21 ? V.sky : h <= 6 ? V.volt : V.ink2);
const hourAlpha = (h: number) => (h >= 18 && h <= 21 ? 0.92 : h <= 6 ? 0.86 : 0.5);

// ── LA CÁMARA · una sola función de gFrame, que nunca vuelve a cero ──────────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -140, z1: 430, panX: -196, panY: 22, ry: -6.2, rx: 1.8, dur: G_END });
  // la grúa: acompaña la separación, TREPA con el peldaño y BAJA con las tres piezas a la factura
  const crane = interpolate(
    g,
    [0, A2, A3, A3 + 70, A4, A4 + 130, A5, A6, G_END],
    [0, 18, 40, 132, 150, 172, 186, 120, -30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  return `${base.transform} translateY(${crane.toFixed(1)}px)`;
};

export const MovS9B: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);     // frame LOCAL del acto
  const toCF = (t: number) => cf - f + t;    // mi frame → reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: cálido de base, frío SÓLO donde te cobran.
  const cool = interpolate(gFrame, [A3, A3 + 60, A5 + 40, A6 + 60], [0, 0.45, 0.62, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(gFrame, [0, A2, A4, A6, G_END], [0.3, 0.36, 0.48, 0.34, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A3, A5, G_END], [0.96, 1.04, 1.1, 0.98], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A4, G_END], [0.58, 0.66, 0.54], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA + EL GRANO DEL PAPEL: una sola vez, fuera del switch ─────────────── */}
      <VoltAtmos tint={light(cool, "torch", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · un 1 sobre el renglón + la barra de veinticuatro horas ══════════════ */}
        {acto === 1 && (() => {
          const stamp = clamp01(f / 12);
          const draw = clamp01((f - 8) / 40);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.anotaV} kind="video" z={0} scale={1.3} dim={0.66} tint={V.amber} startFrom={14} />
              </Plane>
              <Plane z={120}>
                <div style={{
                  position: "absolute", left: 232, top: 342,
                  transform: `translate(-50%,-50%) scale(${lerp(1.5, 1, stamp).toFixed(3)}) rotate(${lerp(-11, -3, stamp).toFixed(2)}deg)`,
                  opacity: stamp,
                }}>
                  <Num size={216} color={V.volt}>1</Num>
                </div>
                <div style={{ position: "absolute", left: 330, top: 318, opacity: clamp01((f - 12) / 12) }}>
                  <Kick color={V.bone}>EL PRECIO DE TUS FRANJAS</Kick>
                  <div style={{ marginTop: 8, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, color: rgba(V.bone, 0.62) }}>
                    tu punta y tu valle, anotados
                  </div>
                </div>
                <IconPng src={M.icCuaderno} x={92} y={16} size={92} z={0} opacity={0.45 * stamp} glow={V.ink0} />
              </Plane>

              {/* la barra de 24 horas: UNA sola pasada de izquierda a derecha */}
              <Plane z={200}>
                <div style={{ position: "absolute", left: HB.x0, top: HB.y, width: HB.x1 - HB.x0, height: HB.h, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(draw * 100).toFixed(2)}%`, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: HB.x1 - HB.x0, height: HB.h, display: "flex" }}>
                      {Array.from({ length: 24 }, (_, h) => (
                        <div key={h} style={{
                          flex: 1, height: "100%",
                          background: `linear-gradient(180deg, ${rgba(hourTint(h), hourAlpha(h) * 0.5)} 0%, ${rgba(hourTint(h), hourAlpha(h))} 100%)`,
                          borderRight: `1px solid ${rgba(V.ink0, 0.55)}`,
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* el filo que va dibujando */}
                <div style={{
                  position: "absolute", left: HB.x0 + (HB.x1 - HB.x0) * draw - 2, top: HB.y - 14, width: 4, height: HB.h + 28,
                  background: rgba(V.white, 0.85 * (draw < 1 ? 1 : 0)), boxShadow: `0 0 22px ${rgba(V.volt, 0.7)}`,
                }} />
                {[
                  { x: HB.x0 + (HB.x1 - HB.x0) * (19.5 / 24), t: "PUNTA", c: V.sky, at: 26 },
                  { x: HB.x0 + (HB.x1 - HB.x0) * (3 / 24), t: "VALLE", c: V.volt, at: 14 },
                ].map((o) => (
                  <div key={o.t} style={{
                    position: "absolute", left: o.x, top: HB.y + HB.h + 22, transform: "translateX(-50%)",
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: 4.4, color: o.c,
                    textShadow: "0 5px 22px rgba(0,0,0,0.94)", opacity: clamp01((f - o.at) / 10),
                  }}>{o.t}</div>
                ))}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · las dos cifras se separan y queda una VETA de oro ═══════════════════ */}
        {acto === 2 && (() => {
          const sep = clamp01(f / 34);
          const vein = clamp01((f - 22) / 34);
          const casa = clamp01((f - 44) / 26);
          const topY = eio(500, 268, sep);
          const botY = eio(560, 742, sep);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.anotaF} kind="photo" z={0} scale={1.26} dim={0.72} tint={V.amber} />
              </Plane>
              {/* la barra de franjas del acto 1 sigue corriendo al fondo, apagada */}
              <Plane z={-220}>
                <div style={{ position: "absolute", left: HB.x0, top: HB.y + 168, width: HB.x1 - HB.x0, height: HB.h, display: "flex", opacity: 0.2 }}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} style={{ flex: 1, height: "100%", background: rgba(hourTint(h), 0.4), borderRight: `1px solid ${rgba(V.ink0, 0.6)}` }} />
                  ))}
                </div>
              </Plane>

              {/* LA VETA: el hueco entre las dos cifras se llena de luz cálida desde abajo */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: topY + 96, height: Math.max(0, botY - topY - 96),
                  background: `linear-gradient(0deg, ${rgba(V.amber, 0.42 * vein)} 0%, ${rgba(V.amber, 0.14 * vein)} 58%, rgba(0,0,0,0) 100%)`,
                  clipPath: "polygon(0% 26%, 22% 6%, 48% 20%, 74% 2%, 100% 22%, 100% 84%, 72% 100%, 44% 82%, 20% 98%, 0% 78%)",
                }} />
                {casa > 0 && (
                  <div style={{
                    position: "absolute", left: "50%", top: (topY + botY) / 2, width: 560, height: 300,
                    marginLeft: -280, marginTop: -150, opacity: 0.9 * casa,
                    clipPath: "polygon(6% 30%, 26% 8%, 52% 24%, 78% 6%, 96% 28%, 96% 76%, 70% 96%, 42% 78%, 18% 94%, 6% 72%)",
                    overflow: "hidden",
                  }}>
                    <MediaCard src={M.casaV} kind="video" w={560} h={300} x={50} y={50} z={0} ry={0}
                      startFrom={18} lit={1} litColor={V.amber} radius={0} grade />
                  </div>
                )}
                {casa > 0.4 && <IconPng src={M.icCasa} x={50} y={eio(58, 52, casa)} size={116} z={0} opacity={0.5 * casa} glow={V.amber} />}
              </Plane>

              {/* las dos cifras escritas a mano se despegan del papel */}
              <Plane z={280}>
                {[
                  { t: "34", u: "¢", lbl: "TU PUNTA", y: topY, c: V.sky, rot: -3 },
                  { t: "6", u: "¢", lbl: "TU VALLE", y: botY, c: V.volt, rot: 2.4 },
                ].map((o) => (
                  <div key={o.lbl} style={{
                    position: "absolute", left: 320, top: o.y, transform: `translateY(-50%) rotate(${o.rot}deg)`,
                  }}>
                    <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: rgba(V.bone, 0.66) }}>{o.lbl}</div>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 148, lineHeight: 0.9, color: o.c,
                      textShadow: `0 0 52px ${rgba(o.c, 0.34)}, 0 6px 26px rgba(0,0,0,0.94)`,
                    }}>{o.t}<span style={{ fontSize: 62, marginLeft: 8 }}>{o.u}</span></div>
                  </div>
                ))}
                {vein > 0.5 && (
                  <div style={{ position: "absolute", left: 1140, top: (topY + botY) / 2 + 150, opacity: clamp01((vein - 0.5) / 0.5) }}>
                    <Kick color={V.amber}>ORO ESCONDIDO EN TU CASA</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · la veta se acuesta y es la línea de precio: EL ESCALÓN ══════════════ */}
        {acto === 3 && (() => {
          const layDown = clamp01(f / 20);
          const stamp = clamp01((f - 14) / 12);
          const step = clamp01((f - 26) / 20);
          const yFlat = 640, yUp = 452, xStep = 1096;
          const yRight = lerp(yFlat, yUp, step);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.anotaF} kind="photo" z={0} scale={1.24} dim={0.74} tint={light(0.45, "torch", "sky")} />
              </Plane>
              <Plane z={60}>
                {/* la veta cálida del acto anterior, acostándose hasta ser una línea */}
                <div style={{
                  position: "absolute", left: 0, right: 0, top: yFlat - eio(150, 4, layDown) / 2, height: eio(150, 4, layDown),
                  background: `linear-gradient(0deg, ${rgba(V.amber, 0.34 * (1 - layDown))} 0%, rgba(0,0,0,0) 100%)`,
                }} />
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  <path
                    d={`M 120 ${yFlat} L ${xStep} ${yFlat} L ${xStep} ${yRight.toFixed(1)} L 1830 ${yRight.toFixed(1)}`}
                    fill="none" stroke={light(step, "amber", "sky")} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 22px ${rgba(step > 0.5 ? V.sky : V.amber, 0.6)})` }}
                  />
                </svg>
                {/* la contrahuella del peldaño: el salto tiene ESPESOR */}
                {step > 0.02 && (
                  <div style={{
                    position: "absolute", left: xStep, top: yRight, width: 22, height: yFlat - yRight,
                    background: `linear-gradient(180deg, ${rgba(V.sky, 0.5)}, ${rgba(V.ink1, 0.9)})`,
                    transform: "skewY(-8deg)", transformOrigin: "left top",
                  }} />
                )}
              </Plane>
              <Plane z={200}>
                <div style={{
                  position: "absolute", left: 250, top: 300,
                  transform: `translate(-50%,-50%) scale(${lerp(1.5, 1, stamp).toFixed(3)}) rotate(${lerp(9, 2.6, stamp).toFixed(2)}deg)`,
                  opacity: stamp,
                }}>
                  <Num size={216} color={V.volt}>2</Num>
                </div>
                <div style={{ position: "absolute", left: 350, top: 276, opacity: clamp01((f - 20) / 12) }}>
                  <Kick color={V.bone}>EL ESCALÓN</Kick>
                  <div style={{ marginTop: 8, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, color: rgba(V.bone, 0.62) }}>
                    a partir de cuántos kWh sube el precio
                  </div>
                </div>
              </Plane>
              {/* el material real donde vive el escalón: la letra chica */}
              <Plane z={300}>
                <MediaCard src={M.letraV} kind="video" w={326} h={200} x={82} y={78} z={0} ry={-10}
                  startFrom={16} lit={0.9} litColor={V.sky} label="LA LETRA CHICA" sheenAt={toCF(30)} radius={9} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · el consumo PISA la raya y todo lo que la cruza se enciende frío ═════ */}
        {acto === 4 && (() => {
          const adv = clamp01(f / 96);
          const xRaya = 1150;
          const bw = 620;
          const xR = lerp(-460, 1520, eio(0, 1, adv));       // el borde derecho de la barra que avanza
          const crossed = clamp01((xR - xRaya) / 160);
          const meter = clamp01((xR - xRaya) / 40);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.anotaF} kind="photo" z={0} scale={1.22} dim={0.76} tint={V.sky} />
              </Plane>
              {/* LA RAYA: vertical, de arriba abajo, con su rótulo de letra chica */}
              <Plane z={40}>
                <div style={{
                  position: "absolute", left: xRaya, top: 130, width: 5, height: 800,
                  background: `linear-gradient(180deg, ${rgba(V.sky, 0.15)} 0%, ${rgba(V.sky, 0.95)} 26%, ${rgba(V.sky, 0.95)} 82%, ${rgba(V.sky, 0.15)} 100%)`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.6)}`,
                }} />
                <div style={{
                  position: "absolute", left: xRaya + 22, top: 150,
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 38, letterSpacing: 4, color: V.sky,
                  textShadow: "0 5px 22px rgba(0,0,0,0.94)",
                }}>ESA RAYA</div>
              </Plane>
              {/* LA BARRA: nunca cambia de tamaño. Avanza. Lo único que cambia es el color. */}
              <Plane z={140}>
                <div style={{ position: "absolute", left: xR - bw, top: 590, width: bw, height: 138, overflow: "hidden", borderRadius: 6 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", background: `linear-gradient(180deg, ${rgba(V.volt, 0.86)}, ${rgba(V.voltSoft, 0.94)})` }} />
                  {/* el tramo que ya cruzó la raya se enciende en frío */}
                  {crossed > 0 && (
                    <div style={{
                      position: "absolute", right: 0, top: 0, bottom: 0, width: Math.max(0, Math.min(bw, xR - xRaya)),
                      background: `linear-gradient(180deg, ${rgba(V.sky, 0.9)}, ${rgba(V.sky, 0.62)})`,
                      boxShadow: `inset 0 0 40px ${rgba(V.ink0, 0.5)}`,
                    }} />
                  )}
                </div>
                <div style={{
                  position: "absolute", left: xR - bw / 2, top: 762, transform: "translateX(-50%)",
                  fontFamily: F_BODY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: rgba(V.bone, 0.72),
                  whiteSpace: "nowrap",
                }}>LO QUE GASTA TU CASA</div>
              </Plane>
              {/* EL CONTADOR: los dígitos REALES del medidor, disparándose */}
              <Plane z={300}>
                <MediaCard src={M.medidorV} kind="video" w={366} h={224} x={86} y={eio(36, 26, meter)} z={0}
                  ry={-9} startFrom={12} lit={0.4 + 0.6 * meter} litColor={V.sky} label="Y NO PARA" sheenAt={toCF(60)} radius={9} />
                <div style={{
                  position: "absolute", left: 1520, top: eio(880, 480, meter), width: 26, height: eio(0, 300, meter),
                  background: `linear-gradient(0deg, ${rgba(V.sky, 0.2)}, ${rgba(V.sky, 0.95)})`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.55)}`,
                }} />
                <IconPng src={M.icMedidor} x={70} y={72} size={104} z={0} opacity={0.4 * meter} glow={V.sky} />
                {crossed > 0.5 && (
                  <div style={{ position: "absolute", left: 190, top: 300, opacity: clamp01((crossed - 0.5) / 0.5) }}>
                    <Kick color={V.sky}>PASADA LA RAYA, TODO SALE MÁS CARO</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · la raya engorda y es un CAÑO · al lado, otro el doble de grueso ═════ */}
        {acto === 5 && (() => {
          const fat = clamp01(f / 22);
          const second = clamp01((f - 20) / 26);
          const tags = clamp01((f - 40) / 20);
          const stamp = clamp01((f - 10) / 12);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.anotaF} kind="photo" z={0} scale={1.2} dim={0.78} tint={V.sky} />
              </Plane>
              <Plane z={120}>
                {/* el caño delgado: la raya del acto 4, engordada. Cobre REAL adentro. */}
                <MediaCard src={M.cobreV} kind="video" w={eio(24, 118, fat)} h={488} x={41} y={52} z={0}
                  ry={-6} startFrom={10} lit={1} litColor={V.volt} sheenAt={toCF(16)} radius={eio(6, 59, fat)} />
                {/* el caño grueso: el doble */}
                {second > 0 && (
                  <MediaCard src={M.acometidaV} kind="video" w={eio(0, 216, second)} h={488} x={eio(48, 55.5, second)} y={52} z={-40}
                    ry={-6} startFrom={14} lit={0.9} litColor={V.sky} sheenAt={toCF(38)} radius={eio(0, 108, second)} />
                )}
              </Plane>
              <Plane z={260}>
                <div style={{
                  position: "absolute", left: 232, top: 264,
                  transform: `translate(-50%,-50%) scale(${lerp(1.5, 1, stamp).toFixed(3)}) rotate(${lerp(-9, -2.2, stamp).toFixed(2)}deg)`,
                  opacity: stamp,
                }}>
                  <Num size={216} color={V.volt}>3</Num>
                </div>
                <div style={{ position: "absolute", left: 330, top: 240, opacity: clamp01((f - 16) / 12) }}>
                  <Kick color={V.bone}>LA POTENCIA CONTRATADA</Kick>
                  <div style={{ marginTop: 8, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, color: rgba(V.bone, 0.62), maxWidth: 620 }}>
                    mide tu pico real antes de pagar por un caño más grueso del que necesitas
                  </div>
                </div>
                {/* de cada caño cuelga su etiqueta: la del delgado corta, la del grueso el doble */}
                {[
                  { x: 787, w: eio(0, 168, tags), t: "LO QUE NECESITAS", c: V.volt },
                  { x: 1066, w: eio(0, 336, tags), t: "LO QUE PAGAS DE MÁS", c: V.sky },
                ].map((o) => (
                  <div key={o.t} style={{ position: "absolute", left: o.x, top: 838 }}>
                    <div style={{ width: 2, height: 34, background: rgba(o.c, 0.8) }} />
                    <div style={{
                      width: o.w, height: 46, borderRadius: 6, overflow: "hidden",
                      background: `linear-gradient(180deg, ${rgba(o.c, 0.9)}, ${rgba(o.c, 0.6)})`,
                      boxShadow: `0 12px 30px ${rgba(V.ink0, 0.7)}`,
                    }} />
                    <div style={{
                      marginTop: 10, fontFamily: F_BODY, fontWeight: 700, fontSize: 25, letterSpacing: 2.6,
                      color: o.c, opacity: tags, whiteSpace: "nowrap",
                    }}>{o.t}</div>
                  </div>
                ))}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · los caños se aplanan y son LA HOJA: los tres en tu factura ═════════ */}
        {acto === 6 && (() => {
          const flat = clamp01(f / 26);
          const ROWS = [
            { n: "1", t: "EL PRECIO POR FRANJA", c: V.volt, at: 22 },
            { n: "2", t: "EL ESCALÓN", c: V.sky, at: 48 },
            { n: "3", t: "LA POTENCIA CONTRATADA", c: V.amber, at: 74 },
          ];
          const gratis = clamp01((f - 106) / 22);
          return (
            <>
              <Plane z={-600}>
                <PhotoPlane src={M.facturaF} kind="photo" z={0} scale={1.3} dim={0.74} tint={V.torch} />
              </Plane>
              {/* LA HOJA: la factura REAL de papel apoyada en el banco del garaje */}
              <Plane z={60}>
                <MediaCard src={M.facturaF} kind="photo" w={eio(340, 716, flat)} h={eio(488, 452, flat)}
                  x={eio(46, 33, flat)} y={52} z={0} ry={eio(-24, -7, flat)} rx={eio(9, 2, flat)}
                  lit={1} litColor={V.torch} label="TU FACTURA" sheenAt={toCF(18)} radius={10} />
              </Plane>
              {/* los tres caen uno por uno y se posan cada uno en SU renglón */}
              <Plane z={240}>
                {ROWS.map((r, i) => {
                  const d = clamp01((f - r.at) / 20);
                  if (d <= 0) return null;
                  const y = 372 + i * 132;
                  return (
                    <div key={r.n} style={{
                      position: "absolute", left: 1030, top: y,
                      transform: `translateY(${((1 - d) * -220).toFixed(1)}px) rotate(${((1 - d) * -7).toFixed(2)}deg)`,
                      opacity: d, display: "flex", alignItems: "center",
                    }}>
                      <div style={{
                        width: 62, height: 62, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        background: rgba(r.c, 0.92), color: V.ink0,
                        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40,
                        boxShadow: `0 10px 26px ${rgba(V.ink0, 0.7)}`,
                      }}>{r.n}</div>
                      <div style={{
                        marginLeft: 20, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 42, letterSpacing: 2.4,
                        color: V.white, textShadow: "0 5px 22px rgba(0,0,0,0.94)", whiteSpace: "nowrap",
                      }}>{r.t}</div>
                      {/* el renglón donde encaja */}
                      <div style={{
                        position: "absolute", left: 0, top: 74, width: eio(0, 700, d), height: 2,
                        background: `linear-gradient(90deg, ${rgba(r.c, 0.8)}, rgba(0,0,0,0))`,
                      }} />
                    </div>
                  );
                })}
                {gratis > 0 && (
                  <div style={{ position: "absolute", left: 1030, top: 800, opacity: gratis, transform: `translateY(${((1 - gratis) * 18).toFixed(1)}px)` }}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 112, lineHeight: 0.92, color: V.volt,
                      textShadow: `0 0 48px ${rgba(V.volt, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
                    }}>GRATIS</div>
                    <div style={{ marginTop: 6, fontFamily: F_BODY, fontWeight: 500, fontSize: 30, color: rgba(V.bone, 0.72) }}>
                      leerlos no te cuesta nada
                    </div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* el grano del papel vive POR ENCIMA de todo: es el material del movimiento entero */}
      <PaperGrain warmth={1 - 0.35 * cool} />
      {/* el polvo del garaje sigue suspendido: la firma de la atmósfera compartida */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.4 }}>
        {Array.from({ length: 16 }, (_, i) => {
          const yy = (rnd(i * 3.9) * 118 - (gFrame * (0.3 + rnd(i * 6.1) * 0.7)) / 16) % 118;
          return (
            <div key={i} style={{
              position: "absolute", left: `${(rnd(i * 8.4) * 100).toFixed(2)}%`, top: `${((yy + 118) % 118 - 9).toFixed(2)}%`,
              width: 3, height: 3, borderRadius: "50%", background: rgba(V.torch, 0.2 + rnd(i * 2.2) * 0.2),
            }} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
