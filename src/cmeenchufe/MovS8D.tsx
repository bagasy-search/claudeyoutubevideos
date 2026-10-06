// MovS8D.tsx — MOVIMIENTO S8D · "LA ARITMÉTICA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 3 actos · 1.235.830 → 1.249.030 ms · 396 frames @30.
//
// LA IDEA: el 60 % no es tuyo. Tu número es la DIFERENCIA entre tus franjas y tu escalón. Si tu punta
// y tu valle se llevan 10 centavos, el ahorro es chico. Si se llevan 28 como los suyos, es grande.
// Por eso el movimiento entero se ve DESDE EL HUECO: la cámara se mete entre las dos columnas de
// precio y no se mueve más — todo lo que pasa, pasa alrededor de ella. Es tu cuenta, no la de él.
//
// EL OBJETO QUE ATRAVIESA LAS DOS FRONTERAS: **EL HUECO ENTRE LAS DOS COLUMNAS**.
//   acto 1 → las dos palmas abiertas se levantan y son las columnas; el hueco queda vacío, esperando;
//   acto 2 → las columnas se acercan y el hueco se cierra a diez centavos: el número sale enano;
//   acto 3 → las columnas se abren de golpe a veintiocho y el mismo número desborda el cuadro.
// El número no cambia de identidad entre actos: es el MISMO vaso, que se llena distinto. El voltio
// lo llena de abajo hacia arriba (`background-clip: text`), así que la cifra ES el recipiente.
//
// UNA cámara: `camAt(gFrame)` — hereda de S8C (z +560, grúa −40), se mete en el hueco durante el
// acto 1 y a partir del acto 2 SE CLAVA: el viaje se congela, pero nunca queda un frame muerto
// (el respiro sigue siendo función de gFrame sin frenar) y en el acto 3 la cámara BASCULA hacia
// arriba —rx— para mirar el número que se le escapó del cuadro. Nunca vuelve a cero.
// Le entrega a S8E la posición: z0 de S8E = +240 (el z1 de acá).
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ (tramo 4 de 5): acá ya es ÁMBAR y entra DE COSTADO, no de arriba (key 0.78). Baja un punto
// con el ahorro chico del acto 2 y vuelve a subir de golpe con el grande del acto 3.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-153 · "TUS FRANJAS Y TU ESCALÓN"        material: CLIP tabla de franjas + CLIP tres renglones + FOTO anota punta/valle
//   entra  cam {z +560, grúa −40, plano de las palmas}   luz {ÁMBAR de costado, key 0.72, int 1.0}
//   sale   cam {METIDA en el hueco, y ahí se clava}      luz {ÁMBAR, key 0.78}
//   ── FRONTERA A ···· LA CÁMARA SIGUE ADENTRO: no hay corte, sólo las columnas que se mueven. ·
// ACTO 2 · g154-289 · "SE LLEVAN 10 CENTAVOS"          material: los MISMOS dos clips, ahora casi tapándose
//   entra  cam {clavada en el hueco}                     luz {ÁMBAR un punto abajo, int 0.86}
//   sale   cam {clavada, el voltio se apagó a media raya} luz {ÁMBAR bajo}
//   ── FRONTERA B ···· MATCH-CUT DE ESCALA: el mismo número enano crece y desborda. ··········
// ACTO 3 · g291-396 · "SE LLEVAN 28"                   material: los MISMOS dos clips, ahora separados
//   entra  cam {clavada abajo, empieza a bascular rx}    luz {ÁMBAR de golpe arriba, int 1.16}
//   sale   cam {mirando hacia arriba el número fugado}   luz {ÁMBAR pleno — se la entrega a S8E}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 154, A3 = 291;
const G_END = 396;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3 };

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  palmasF: "img/cmeenchufe/cmee_s8_palmas_arriba.png",
  franjasV: "broll/cmeenchufe/cmee_s2_tabla_franjas.mp4",
  renglonesV: "broll/cmeenchufe/cmee_s4_tres_renglones_dedo.mp4",
  anotaF: "img/cmeenchufe/cmee_s9_anota_punta_valle.png",
  icMoneda: "img/cmeenchufe/cmee_ic_moneda.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
};

// ── LA CÁMARA · hereda de S8C, se mete en el hueco y ahí se clava (sin frame muerto) ────────
const camAt = (g: number) => {
  const gg = Math.min(g, A2);                     // a partir del acto 2 el VIAJE se detiene
  const base = gcam(gg, { z0: 560, z1: 240, panX: -70, panY: 46, ry: 6.2, rx: 2.2, dur: G_END });
  // LA GRÚA: baja al nivel del hueco entre las columnas y se queda ahí.
  const crane = interpolate(gg, [0, A1 + 70, A2], [-40, 40, 86], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1),
  });
  // EL BASCULEO del acto 3: la cámara, clavada abajo, levanta la vista al número que se le escapó.
  const tilt = interpolate(g, [A3, A3 + 62], [0, -9.4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  // el respiro NO se frena aunque el viaje esté congelado: ningún frame queda perfectamente quieto
  const bx = Math.sin(g / 57) * 2.6, by = Math.cos(g / 83) * 2.1;
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotateX(${tilt.toFixed(2)}deg) ` +
    `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0)`
  );
};

// ── LA COLUMNA DE PRECIO · objeto con espesor. El material real va en su MediaCard. ─────────
const Columna: React.FC<{ x: number; h: number; tint: string; flip?: boolean; z?: number }> = ({
  x, h, tint, flip = false, z = 0,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: 940 - h, width: 420, height: h, marginLeft: -210,
    transform: `translateZ(${z}px)`,
    background: `linear-gradient(180deg, ${rgba(tint, 0.3)} 0%, ${rgba(V.ink2, 0.97)} 18%, ${rgba(V.ink1, 1)} 100%)`,
    borderTop: `4px solid ${rgba(tint, 0.92)}`,
    boxShadow: `0 34px 80px ${rgba(V.ink0, 0.88)}, inset ${flip ? "18px" : "-18px"} 0 40px ${rgba(V.ink0, 0.78)}`,
  }}>
    <div style={{
      position: "absolute", left: flip ? -22 : undefined, right: flip ? undefined : -22,
      top: 7, width: 22, height: Math.max(0, h - 7),
      background: `linear-gradient(180deg, ${rgba(tint, 0.16)}, ${rgba(V.ink0, 0.98)})`,
      transform: `skewY(${flip ? 9 : -9}deg)`, transformOrigin: flip ? "right top" : "left top",
    }} />
  </div>
);

// ── EL NÚMERO-VASO · la cifra ES el recipiente: el voltio la llena de abajo hacia arriba ────
const Vaso: React.FC<{
  text: string; size: number; fill: number; x: number; y: number; spill?: number;
}> = ({ text, size, fill, x, y, spill = 0 }) => {
  const p = (clamp01(fill) * 100).toFixed(1);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", whiteSpace: "nowrap" }}>
      {/* el chorreo por los costados cuando el voltio sobra */}
      {spill > 0.01 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: size * 3.2, height: size * 1.5,
          marginLeft: -size * 1.6, marginTop: -size * 0.75, borderRadius: size,
          background: `radial-gradient(circle, ${rgba(V.volt, 0.3 * spill)}, rgba(0,0,0,0) 68%)`,
          filter: `blur(${(14 * spill).toFixed(1)}px)`,
        }} />
      )}
      <div style={{
        position: "relative",
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: 0.6,
        color: "transparent",
        backgroundImage: `linear-gradient(0deg, ${V.volt} 0%, ${V.volt} ${p}%, ${rgba(V.bone, 0.17)} ${p}%, ${rgba(V.bone, 0.17)} 100%)`,
        WebkitBackgroundClip: "text", backgroundClip: "text",
        filter: `drop-shadow(0 0 ${Math.round(size * 0.3)}px ${rgba(V.volt, 0.34 * clamp01(fill))}) drop-shadow(0 8px 26px rgba(0,0,0,0.92))`,
      }}>{text}</div>
    </div>
  );
};

export const MovS8D: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: ÁMBAR de costado. Baja con el ahorro chico, sube con el grande.
  const keyFrom = interpolate(gFrame, [0, A2, A3, G_END], [0.72, 0.78, 0.8, 0.84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warm = interpolate(gFrame, [0, A2], [0.62, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A2 + 90, A3, A3 + 26, G_END], [1.0, 0.94, 0.86, 0.88, 1.16, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, A3], [0.56, 0.62, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ────────────────────────── */}
      <VoltAtmos tint={light(warm, "volt", "amber")} tint2={V.amber}
        keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · las palmas se levantan y son las dos columnas: TU CUENTA ═════════ */}
        {acto === 1 && (() => {
          const sube = clamp01((f - 10) / 62);          // las palmas se levantan y se vuelven columnas
          const hueco = clamp01((f - 66) / 52);         // la cámara se mete en el hueco
          const espera = clamp01((f - 96) / 26);        // el número vacío aparece SIN escribirse
          const hL = eio(120, 700, sube), hR = eio(120, 330, sube);
          const xL = eio(38, 25, hueco), xR = eio(62, 75, hueco);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.palmasF} kind="photo" z={0} scale={1.28} dim={0.7} tint={V.amber} /></Plane>
              <Plane z={-40}>
                <Columna x={xL} h={hL} tint={V.danger} />
                <Columna x={xR} h={hR} tint={V.volt} flip />
              </Plane>
              {/* CADA COLUMNA LLEVA LA FRANJA HORARIA REAL DE UNA FACTURA ADENTRO */}
              <Plane z={140}>
                <MediaCard src={M.franjasV} kind="video" w={330} h={206} x={xL} y={pc(940 - hL + 150)} z={0}
                  startFrom={14} ry={11} lit={0.94} litColor={V.danger} label="TU PUNTA" sheenAt={toCF(24)} radius={8}
                  opacity={sube} />
                <MediaCard src={M.renglonesV} kind="video" w={330} h={206} x={xR} y={pc(940 - hR + 150)} z={0}
                  startFrom={20} ry={-11} lit={0.94} litColor={V.volt} label="TU VALLE" sheenAt={toCF(40)} radius={8}
                  opacity={sube} />
                <MediaCard src={M.anotaF} kind="photo" w={288} h={180} x={50} y={91} z={110} ry={0}
                  lit={0.8} litColor={V.amber} label="TU CUENTA, NO LA MÍA" sheenAt={toCF(78)} radius={8}
                  opacity={clamp01((f - 70) / 22)} />
              </Plane>
              {/* EL NÚMERO QUE ESPERA SIN ESCRIBIRSE: el vaso vacío en el hueco */}
              <Plane z={240}>
                <Vaso text="— —" size={132} fill={0} x={50} y={44} />
                <div style={{ position: "absolute", left: "50%", top: "20%", transform: "translate(-50%,0)", textAlign: "center", opacity: espera }}>
                  <Kick color={rgba(V.bone, 0.86)}>LA DIFERENCIA ENTRE TUS FRANJAS</Kick>
                </div>
                <IconPng src={M.icRegla} x={12} y={pc(430)} size={94} z={0} opacity={0.5 * sube} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · se llevan 10 centavos: el número sale enano ══════════════════════ */}
        {acto === 2 && (() => {
          const junta = clamp01(f / 46);                // las columnas se acercan hasta casi pegarse
          const escribe = clamp01((f - 40) / 22);       // el número se escribe solo, y sale enano
          const llena = clamp01((f - 56) / 30);         // el voltio alcanza para media raya…
          const apaga = clamp01((f - 96) / 22);         // …y se apaga
          const hL = 700, hR = eio(330, 604, junta);    // 700 − 604 = diez centavos de nada
          const xL = eio(25, 43, junta), xR = eio(75, 57, junta);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.palmasF} kind="photo" z={0} scale={1.3} dim={0.78} tint={V.amber} /></Plane>
              <Plane z={-40}>
                <Columna x={xL} h={hL} tint={V.danger} />
                <Columna x={xR} h={hR} tint={V.volt} flip />
                {/* el corchete que mide el hueco: esto SÍ es un gráfico */}
                <div style={{
                  position: "absolute", left: `${((xL + xR) / 2).toFixed(2)}%`, top: 940 - hR - 46,
                  width: 150, marginLeft: -75, height: 2, background: rgba(V.amber, 0.85), opacity: junta,
                }}>
                  <div style={{ position: "absolute", left: 0, top: -12, width: 2, height: 26, background: rgba(V.amber, 0.85) }} />
                  <div style={{ position: "absolute", right: 0, top: -12, width: 2, height: 26, background: rgba(V.amber, 0.85) }} />
                </div>
              </Plane>
              {/* LAS MISMAS DOS TARJETAS, ahora tan juntas que casi se tapan entre sí */}
              <Plane z={140}>
                <MediaCard src={M.franjasV} kind="video" w={330} h={206} x={xL} y={pc(940 - hL + 150)} z={0}
                  startFrom={22} ry={11} lit={0.86} litColor={V.danger} label="TU PUNTA" sheenAt={toCF(14)} radius={8} />
                <MediaCard src={M.renglonesV} kind="video" w={330} h={206} x={xR} y={pc(940 - hR + 150)} z={-40}
                  startFrom={28} ry={-11} lit={0.8} litColor={V.volt} label="TU VALLE" sheenAt={toCF(30)} radius={8} />
              </Plane>
              {/* EL NÚMERO ENANO, del alto de una moneda, con el voltio que no le alcanza */}
              <Plane z={240}>
                <Vaso text="10 ¢" size={eio(20, 74, escribe)} fill={llena * 0.5 * (1 - apaga)} x={50} y={pc(940 - hR - 130)} />
                <IconPng src={M.icMoneda} x={44} y={pc(940 - hR - 168)} size={64} z={0} opacity={0.85 * escribe} glow={V.ink0} />
                <div style={{ position: "absolute", left: "50%", top: "16%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 62) / 16) }}>
                  <Head size={62} color={rgba(V.bone, 0.9)}>TU AHORRO VA A SER CHICO</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · se llevan 28: el mismo número desborda el cuadro ════════════════ */}
        {acto === 3 && (() => {
          const abre = clamp01(f / 22);                 // las columnas se abren DE GOLPE
          const crece = clamp01((f - 14) / 44);         // el número enano crece y desborda por arriba
          const llena = clamp01((f - 22) / 40);         // el voltio lo llena de abajo hacia arriba
          const sobra = clamp01((f - 56) / 26);         // …y le sobra: chorrea por los costados
          const hL = 700, hR = eio(604, 224, abre);     // 700 − 224 = veintiocho centavos
          const xL = eio(43, 20, abre), xR = eio(57, 80, abre);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.palmasF} kind="photo" z={0} scale={1.34} dim={0.66} tint={V.amber} /></Plane>
              <Plane z={-40}>
                <Columna x={xL} h={hL} tint={V.danger} />
                <Columna x={xR} h={hR} tint={V.volt} flip />
                <div style={{
                  position: "absolute", left: `${((xL + xR) / 2).toFixed(2)}%`, top: 940 - hR - 46,
                  width: eio(150, 700, abre), marginLeft: -eio(75, 350, abre), height: 2, background: rgba(V.amber, 0.85),
                }}>
                  <div style={{ position: "absolute", left: 0, top: -14, width: 2, height: 30, background: rgba(V.amber, 0.85) }} />
                  <div style={{ position: "absolute", right: 0, top: -14, width: 2, height: 30, background: rgba(V.amber, 0.85) }} />
                </div>
              </Plane>
              <Plane z={140}>
                <MediaCard src={M.franjasV} kind="video" w={330} h={206} x={xL} y={pc(940 - hL + 150)} z={0}
                  startFrom={30} ry={13} lit={1} litColor={V.danger} label="TU PUNTA" sheenAt={toCF(10)} radius={8} />
                <MediaCard src={M.renglonesV} kind="video" w={330} h={206} x={xR} y={pc(940 - hR + 150)} z={0}
                  startFrom={36} ry={-13} lit={1} litColor={V.volt} label="TU VALLE" sheenAt={toCF(26)} radius={8} />
              </Plane>
              {/* EL MISMO VASO, ahora desbordado: se sale por arriba del cuadro */}
              <Plane z={260}>
                <Vaso text="28 ¢" size={eio(74, 460, crece)} fill={llena} spill={sobra}
                  x={50} y={eio(pc(940 - 604 - 130), -4, crece)} />
                <div style={{ position: "absolute", left: "50%", top: "76%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 40) / 14) }}>
                  <Head size={72} color={V.volt}>VA A SER GRANDE</Head>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontFamily: F_BODY, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: rgba(V.bone, 0.62) }}>
                      ES ARITMÉTICA
                    </div>
                  </div>
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
