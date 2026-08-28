// MovEtiqueta.tsx — S4 · UN MOVIMIENTO CONTINUO de 46 s (1380 frames @30fps)
// «La etiqueta dice el peor instante de su vida. Ochocientos cincuenta un segundo, ciento veinte el resto.»
//
// LA NOCHE DEL APAGÓN: la única luz es el haz de la linterna (`torch`) y, a partir del acto 3, el verde
// del display de la pinza (`volt`). Una sola atmósfera montada arriba de todo, UNA cámara función de
// `gFrame` que nunca vuelve a 0, la luz evoluciona (sky → torch → volt) y hay materia que cruza CADA
// frontera. El remate es LA CURVA: un pico de menos de un segundo y una meseta larga y baja.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0   ENTER  cám z≈-60 (heredada de MovDiezAnos, casi quieta) · luz FRÍA MUY BAJA (sky,
//                      intensity .50, haz abajo-izquierda sobre la losa) · materia: LA CIFRA 12.500
//                      GRABADA SOBRE LA LOSA.
//               EXIT   cám z≈+70 empujando hacia el 73%/26% de cuadro · luz torch plena, la losa ya
//                      apagada · materia: LA CIFRA "800" IMPRESA EN LA ETIQUETA (la cifra grabada le
//                      pasó la luz a la cifra impresa; entramos DENTRO del 800).
//
// acto 2 · f300 ENTER  cám z≈+70 saliendo del interior del dígito (escala 2.6 → 1) · luz torch plena
//                      desde arriba-izquierda · materia: el negro del interior del 800 = LA CARCASA
//                      NEGRA DEL COMPRESOR.
//               EXIT   cám z≈+200, pan +70 · luz torch bajando, entra el volt por la tira del ciclo ·
//                      materia: LA TIRA DEL DUTY FIELD ENCENDIDA (sobrevive el corte).
//
// acto 3 · f680 ENTER  cám z≈+200, pan +70 (la misma tarjeta, mismo encuadre y misma escala que la
//                      del acto 2) · luz torch bajando + volt entrando · materia: LA TIRA DEL DUTY
//                      FIELD, que sigue encendida a través del corte y baja a ser la línea de tiempo.
//               EXIT   cám z≈+200 empezando a retroceder · luz: EL VERDE DEL DISPLAY YA DOMINA ·
//                      materia: EL DISPLAY VERDE DEL MEDIDOR + la tarjeta del medidor.
//
// acto 4 · f1020 ENTER cám z≈+200 retrocediendo a ≈-40 (plano general) · luz volt dominante, haz bajo ·
//                      materia: EL DISPLAY VERDE SE ESTIRA Y SE VUELVE EL EJE DE LA CURVA; la tarjeta
//                      del medidor viaja y se posa arriba a la derecha.
//               EXIT   cám z≈-40 asentada · luz: EL VERDE DEL DISPLAY DOMINA, EL HAZ BAJO (power .44) ·
//                      materia: LA CURVA DEL CONSUMO DIBUJADA EN EL AIRE  → así arranca `MovSuma`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f292  frontera 1→2 : ZOOM-THROUGH sobre el dígito 800 (fx 73 / fy 26) — la ficha lo pide y es la
//                       única manera de que "entrar en la cifra" sea literal.
// f680  frontera 2→3 : CORTE EN EL BEAT exacto en «Lo medimos» — encuadre, escala (1180×620, x50 y47)
//                       y luz (litColor torch) calzan al pixel entre las dos tarjetas.
// f890  costura INTERNA del acto 3 : OCLUSIÓN con `V.steel` (la chapa) — cambio de ESCALA, del plano
//                       de la pinza al macro del display. Nunca con color de fondo.
// f1016 frontera 3→4 : MATCH-SHAPE — el rectángulo verde del display se estira y ES el eje de la curva.
// (ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 300;
const F_A3 = 680;
const F_A4 = 1020;
const SEAM_ZOOM = 292;
const SEAM_CUT = 680;
const SEAM_OCC = 890;
const SEAM_MATCH = 1016;

// geometría de la curva (viewBox 1920×1080) — proporciones REALES: 850 W = 430 px, 120 W = 60,7 px
const AX_L = 420;
const AX_R = 1800;
const AX_Y = 700;
const AMP = 430;
const Y_850 = AX_Y - AMP;                       // 270
const Y_120 = AX_Y - (AMP * 120) / 850;         // 639,3
const D_CURVA = "M 420 700 L 466 700 L 486 270 L 512 639.3 L 1800 639.3";
// inset del congelador (85 andando / 600 de arranque), mismo lenguaje a escala chica
const D_FREEZER = "M 1400 980 L 1430 980 L 1444 860 L 1462 963 L 1830 963";

// ── EL HAZ DE LA LINTERNA — la fuente clara que NUNCA se va del cuadro ──────────────────────
const Haz: React.FC<{ x: number; y: number; ang: number; power: number; color: string }> = ({
  x, y, ang, power, color,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 1780, height: 820, marginTop: -410, transformOrigin: "0% 50%",
      transform: `rotate(${ang.toFixed(2)}deg)`,
      background: `linear-gradient(90deg, ${rgba(color, 0.30 * power)} 0%, ${rgba(color, 0.14 * power)} 34%, rgba(0,0,0,0) 76%)`,
      clipPath: "polygon(0% 47.5%, 100% 0%, 100% 100%, 0% 52.5%)",
      mixBlendMode: "screen",
    }} />
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: 460, height: 460, marginLeft: -230, marginTop: -230, borderRadius: "50%",
      background: `radial-gradient(circle, ${rgba(color, 0.60 * power)} 0%, ${rgba(color, 0.17 * power)} 33%, rgba(0,0,0,0) 70%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── TITULAR (una idea de texto por acto, sobre cama oscura) ──────────────────────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1030,
      opacity: a, transform: `translateY(${dy.toFixed(1)}px)`,
    }}>
      <Bed pad={28}>
        <div style={{ marginBottom: 10 }}><Kick color={kickColor}>{kick}</Kick></div>
        <Head size={size}>{head}</Head>
        {sub ? <div style={{ marginTop: 12 }}><Body size={31}>{sub}</Body></div> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovEtiqueta: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 4) - 1) * 340);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamFlash`, `sheenAt`) miden con
  // useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: -60, z1: 300, panX: -90, panY: -70, ry: -8, rx: 2.5, dur: 1300 });
  const zAcc =
    eio(0, 80, seg(g, 288, 334)) +
    eio(0, 130, seg(g, 676, 736)) +
    eio(0, -250, seg(g, SEAM_MATCH, 1130));
  const pxAcc = eio(0, 74, seg(g, 676, 764)) + eio(0, -118, seg(g, SEAM_MATCH, 1150));
  const pyAcc = eio(0, -42, seg(g, 292, 344)) + eio(0, 58, seg(g, SEAM_MATCH, 1170));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. sky (frío muy bajo) → torch (el haz) → volt (el display) ─
  const cTorch = light(seg(g, 0, 210), "sky", "torch");
  const cAtmos2 = light(seg(g, 560, 1140), "amber", "volt");
  const keyFrom = 0.30 + eio(0, 0.32, seg(g, 0, 260)) + eio(0, -0.20, seg(g, 900, 1210));
  const intensity = 0.50 + eio(0, 0.24, seg(g, 0, 96)) + eio(0, -0.10, seg(g, 1180, 1360));

  // el haz: barre desde la losa hasta la etiqueta, baja en el acto 3 y se apaga sobre la curva
  const flick = 0.93 + 0.07 * rnd(Math.floor(g / 4) * 1.7) + Math.sin(g / 11) * 0.02;
  const hazX = 6 + eio(0, 22, seg(g, 10, 150)) + eio(0, -8, seg(g, 690, 790)) + eio(0, 5, seg(g, 1040, 1210));
  const hazY = 90 + eio(0, -46, seg(g, 10, 150)) + eio(0, -6, seg(g, 300, 430))
    + eio(0, 24, seg(g, 690, 830)) + eio(0, 16, seg(g, 1040, 1270));
  const hazA = -30 + eio(0, 26, seg(g, 10, 150)) + eio(0, -14, seg(g, 690, 830));
  const hazP = (0.50 + eio(0, 0.48, seg(g, 0, 80)) + eio(0, -0.12, seg(g, 640, 700))
    + eio(0, 0.14, seg(g, 700, 830)) + eio(0, -0.56, seg(g, 1120, 1340))) * flick;

  // ── ACTO 1 · la losa, la cifra grabada, la etiqueta ───────────────────────────────────────
  const losaLit = 1 - 0.74 * ez(g, 40, 210);
  const grabLit = 1 - ez(g, 40, 145);
  const grabOp = 1 - ez(g, 150, 300);
  const zt = zoomThrough(g, SEAM_ZOOM, 20, 73, 26);
  const a1On = g < SEAM_ZOOM + 21;
  const etiqW = Math.round(lerp(830, 1000, ez(g, 44, 280)));
  const etiqH = Math.round(etiqW * 0.575);
  const etiqOp = ez(g, 40, 58);

  // ── ACTO 2 · el compresor y su arranque ───────────────────────────────────────────────────
  const a2On = g >= F_A2 && g < SEAM_CUT + 2;
  const a2Scale = lerp(2.6, 1, ez(g, F_A2, 356));
  const burst = Math.sin(Math.PI * seg(g, 372, 418));
  const jx = (rnd(g * 2.7) - 0.5) * 13 * burst;
  const jy = (rnd(g * 5.1) - 0.5) * 9 * burst;
  const compW = Math.round(lerp(1180, 1060, ez(g, 540, 660)));
  const compH = Math.round(compW * 0.525);
  const compY = lerp(47, 41, ez(g, 540, 660));

  // ── la TIRA DEL CICLO: la materia que cruza el corte del beat ─────────────────────────────
  const dutyOn = ez(g, 556, 604) * (1 - ez(g, 1044, 1136));
  const dutyY = lerp(78, 84, ez(g, 690, 800));

  // ── ACTO 3 · la pinza, el display, el medidor ─────────────────────────────────────────────
  const a3On = g >= SEAM_CUT && g < SEAM_OCC + 10;
  const pinzaW = Math.round(lerp(1180, 1010, ez(g, 700, 800)));
  const pinzaH = Math.round(pinzaW * 0.525);
  const pinzaX = lerp(50, 41, ez(g, 700, 800));

  // el MEDIDOR: nace bajo la oclusión (f886) y SOBREVIVE la frontera 3→4 transformándose
  const medOn = g >= SEAM_OCC - 4;
  const mMorph = ez(g, SEAM_MATCH, 1104);
  const medW = Math.round(lerp(1120, 300, mMorph));
  const medH = Math.round(lerp(600, 176, mMorph));
  const medX = lerp(50, 86, mMorph);
  const medY = lerp(46, 44, mMorph);

  // ── ACTO 4 · el display se estira y se vuelve el EJE; después, LA CURVA ────────────────────
  const ejeOn = g >= SEAM_MATCH;
  const eW = Math.round(lerp(340, AX_R - AX_L, mMorph));
  const eH = Math.round(lerp(58, 7, mMorph));
  const eX = lerp(50, ((AX_L + AX_R) / 2 / 1920) * 100, mMorph);
  const eY = lerp(50, (AX_Y / 1080) * 100, mMorph);
  const revW = lerp(0, AX_R - AX_L + 40, ez(g, 1100, 1264));
  const frzW = lerp(0, 460, ez(g, 1306, 1362));

  // las cifras que VIAJAN a la curva (la lectura del instrumento se vuelve la etiqueta del gráfico)
  const r850X = lerp(30, 21, ez(g, SEAM_MATCH, 1150));
  const r850Y = lerp(24, 20, ez(g, SEAM_MATCH, 1150));
  const r850S = Math.round(lerp(168, 138, ez(g, SEAM_MATCH, 1150)));
  const r120X = lerp(74, 47, ez(g, SEAM_MATCH, 1150));
  const r120Y = lerp(34, 51, ez(g, SEAM_MATCH, 1150));
  const r120S = Math.round(lerp(176, 128, ez(g, SEAM_MATCH, 1150)));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cTorch} tint2={cAtmos2} keyFrom={keyFrom} intensity={intensity} floor={0.6} />

      <Layers cam={cam}>
        {/* P1 · el metal de la puerta del refrigerador, plano profundo (siempre hay imagen) */}
        <PhotoPlane
          src="img/cmegenerador/cmeg_mv_etiq1.png"
          kind="photo" z={-620} scale={1.34}
          dim={lerp(0.6, 0.82, ez(g, 120, 700))} tint={V.torch}
        />

        {/* P2 · el haz volumétrico */}
        <Plane z={-380}>
          <Haz x={hazX} y={hazY} ang={hazA} power={clamp01(hazP)} color={cTorch} />
        </Plane>

        {/* P3 · la losa del patio + LA CIFRA GRABADA que viene del movimiento anterior */}
        <Plane z={-250}>
          <PadPlane y={76} w={1420} h={320} rx={62} lit={losaLit} z={-40} />
          {grabOp > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: "78%", width: 940, marginLeft: -470,
              transform: "rotateX(62deg)", transformOrigin: "50% 0%", textAlign: "center",
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 152, letterSpacing: 8,
              color: rgba(V.concrete, 0.14 + 0.52 * grabLit),
              textShadow: `0 3px 0 ${rgba(V.ink0, 0.92)}, 0 -1px 0 ${rgba(V.white, 0.12 * grabLit)}`,
              opacity: grabOp,
            }}>12.500</div>
          )}
        </Plane>

        {/* P4 · GRÁFICO: la tira del ciclo, el eje que nace del display, la curva y las cifras */}
        <Plane z={-60}>
          {dutyOn > 0.01 && (
            <DutyField duty={8 / 30} cells={30} on={dutyOn} tint={V.volt} y={dutyY} w={1240} h={44} cycle={150} />
          )}

          {/* MATCH-SHAPE: este rectángulo ES el display verde del medidor y ES el eje de la curva */}
          {ejeOn && (
            <div style={{
              position: "absolute", left: `${eX.toFixed(2)}%`, top: `${eY.toFixed(2)}%`,
              width: eW, height: eH, marginLeft: -eW / 2, marginTop: -eH / 2,
              borderRadius: Math.round(lerp(9, 3, mMorph)),
              background: `linear-gradient(90deg, ${rgba(V.volt, 0.14)} 0%, ${rgba(V.volt, 0.95)} 22%, ${rgba(V.volt, 0.95)} 78%, ${rgba(V.volt, 0.14)} 100%)`,
              boxShadow: `0 0 ${Math.round(lerp(46, 22, mMorph))}px ${rgba(V.volt, 0.55)}`,
            }} />
          )}

          {/* la guía vertical del eje (estructura, aparece cuando el eje ya es eje) */}
          {g >= 1090 && (
            <div style={{
              position: "absolute", left: `${((AX_L / 1920) * 100).toFixed(2)}%`,
              top: `${((Y_850 - 40) / 1080 * 100).toFixed(2)}%`,
              width: 2, height: (AX_Y - Y_850 + 40) * ez(g, 1090, 1150),
              background: `linear-gradient(180deg, ${rgba(V.volt, 0.02)} 0%, ${rgba(V.volt, 0.34)} 100%)`,
            }} />
          )}

          {/* LA CURVA — se revela por el eje del TIEMPO: el pico dura 5 frames, la meseta 160 */}
          {g >= 1096 && (
            <svg viewBox="0 0 1920 1080" style={{
              position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
            }}>
              <defs>
                <clipPath id="cmeEtiqRevela">
                  <rect x={AX_L - 12} y={0} width={revW} height={1080} />
                </clipPath>
                <clipPath id="cmeEtiqRevelaFrz">
                  <rect x={1392} y={780} width={frzW} height={260} />
                </clipPath>
              </defs>
              <g clipPath="url(#cmeEtiqRevela)">
                <path d={D_CURVA} fill="none" stroke={rgba(V.volt, 0.20)} strokeWidth={20}
                  strokeLinejoin="round" strokeLinecap="round" />
                <path d={D_CURVA} fill="none" stroke={V.volt} strokeWidth={7}
                  strokeLinejoin="round" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 15px ${rgba(V.volt, 0.8)})` }} />
              </g>
              {frzW > 1 && (
                <g clipPath="url(#cmeEtiqRevelaFrz)">
                  <path d={D_FREEZER} fill="none" stroke={rgba(V.voltSoft, 0.9)} strokeWidth={4}
                    strokeLinejoin="round" strokeLinecap="round" />
                  <path d="M 1400 980 L 1830 980" fill="none" stroke={rgba(V.white, 0.18)} strokeWidth={2} />
                </g>
              )}
            </svg>
          )}

          {/* rótulos de estructura del gráfico: la FORMA se lee sin leer nada, esto sólo la ancla */}
          {g >= 1210 && (
            <>
              <div style={{
                position: "absolute", left: `${((486 / 1920) * 100).toFixed(2)}%`,
                top: `${((AX_Y + 22) / 1080 * 100).toFixed(2)}%`,
                transform: "translateX(-50%)", opacity: ez(g, 1210, 1240),
              }}><Kick color={V.torch}>1 SEG</Kick></div>
              <div style={{
                position: "absolute", left: `${((1160 / 1920) * 100).toFixed(2)}%`,
                top: `${((AX_Y + 22) / 1080 * 100).toFixed(2)}%`,
                transform: "translateX(-50%)", opacity: ez(g, 1224, 1256),
              }}><Kick color={rgba(V.white, 0.62)}>EL RESTO DEL TIEMPO</Kick></div>
            </>
          )}

          {/* ── LAS CIFRAS DEL INSTRUMENTO ── */}
          {/* 800: lo que DICE la etiqueta (frío = lo que te venden) */}
          {g >= 150 && g < SEAM_ZOOM + 4 && (
            <>
              <Readout value="800" unit="W" label="LO QUE DICE LA ETIQUETA" at={at(150)}
                x={73} y={24} size={186} color={V.torch} />
              <div style={{
                position: "absolute", left: "73%", top: "26.4%", width: 330, height: 7, marginLeft: -165,
                background: `linear-gradient(90deg, ${rgba(V.volt, 0.2)} 0%, ${V.volt} 18%, ${V.volt} 82%, ${rgba(V.volt, 0.2)} 100%)`,
                boxShadow: `0 0 22px ${rgba(V.volt, 0.7)}`,
                transform: `scaleX(${ez(g, 250, 274).toFixed(3)}) rotate(-3deg)`, transformOrigin: "0% 50%",
              }} />
            </>
          )}
          {/* 850 fugaz en el arranque del compresor: aparece y se va en menos de un segundo */}
          {g >= 388 && g < 418 && (
            <Readout value="850" unit="W" label="EN EL ARRANQUE" at={at(390)}
              x={50} y={22} size={162} color={V.torch} />
          )}
          {/* 120 andando: nace en el display verde y VIAJA hasta la meseta de la curva */}
          {g >= 817 && (
            <Readout value="120" unit="W" label="CON EL COMPRESOR ANDANDO" at={at(817)}
              x={r120X} y={r120Y} size={r120S} color={V.volt} />
          )}
          {/* 850 medido con la pinza en modo pico: viaja hasta la punta del pico */}
          {g >= 930 && (
            <Readout value="850" unit="W" label="PINZA · MODO PICO" at={at(930)}
              x={r850X} y={r850Y} size={r850S} color={V.torch} />
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: las tarjetas protagonistas ── */}
        <Plane z={40}>
          {/* ACTO 1 — la etiqueta plateada bajo el haz. Sale por ZOOM-THROUGH sobre el 800. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity) * etiqOp, transformOrigin: "73% 26%",
            }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_etiq1.mp4" kind="video"
                w={etiqW} h={etiqH} x={50} y={46} z={0}
                ry={lerp(9, 0.5, ez(g, 44, 200))} rx={lerp(-3, 0, ez(g, 44, 200))}
                radius={16} startFrom={4} lit={0.55 + 0.45 * ez(g, 40, 120)}
                litColor={cTorch} label="PLACA DE DATOS" sheenAt={at(96)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 2 — salimos DENTRO del dígito y el negro del 800 es la carcasa del compresor */}
          {a2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Scale.toFixed(3)}) translate(${jx.toFixed(2)}px, ${jy.toFixed(2)}px)`,
              transformOrigin: "62% 34%",
            }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_etiq2.mp4" kind="video"
                w={compW} h={compH} x={50} y={compY} z={0}
                ry={lerp(-5, 0, ez(g, F_A2, 400))} radius={16} startFrom={6}
                lit={0.9 + 0.1 * burst} litColor={cTorch} label="EL COMPRESOR ROMPE LA INERCIA"
                sheenAt={at(372)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 3 — CORTE EN EL BEAT: misma tarjeta, mismo encuadre, misma escala, misma luz */}
          {a3On && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_etiq3.mp4" kind="video"
              w={pinzaW} h={pinzaH} x={pinzaX} y={47} z={0}
              ry={lerp(0, 6, ez(g, 700, 830))} radius={16} startFrom={8}
              lit={0.94} litColor={light(seg(g, 700, 900), "torch", "volt")}
              label="REFRIGERADOR DE DOS PUERTAS · 8 AÑOS" sheenAt={at(712)}
            />
          )}

          {/* EL MEDIDOR — nace bajo la oclusión de chapa y CRUZA la frontera 3→4 transformándose */}
          {medOn && (
            <MediaCard
              src="broll/cmegenerador/cmeg_mv_etiq4.mp4" kind="video"
              w={medW} h={medH} x={medX} y={medY} z={0}
              ry={lerp(-4, 5, mMorph)} radius={14} startFrom={5}
              lit={0.96} litColor={V.volt}
              label={mMorph > 0.5 ? undefined : "MEDIDOR DE ENCHUFE"} sheenAt={at(902)}
            />
          )}

          {/* ACTO 4 — el arranque congelado, clavado junto al pico (material real, no una forma) */}
          {g >= 1128 && (
            <div style={{ opacity: ez(g, 1128, 1160) }}>
              <MediaCard
                src="img/cmegenerador/cmeg_mv_etiq2.png" kind="photo"
                w={300} h={176} x={39} y={18} z={0}
                ry={-6} radius={12} lit={0.9} litColor={V.torch} sheenAt={at(1140)}
              />
            </div>
          )}

          {/* el congelador del garaje: ícono PNG como objeto sobre su propio inset */}
          {g >= 1300 && (
            <div style={{ opacity: ez(g, 1300, 1332) }}>
              <IconPng src="img/cmegenerador/cmeg_ic_congelador.png" x={75} y={64} size={78} z={0} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* P6 · primer plano: chispas de polvo en el haz (hold VIVO, siempre algo se mueve) */}
        <Plane z={220}>
          {Array.from({ length: 16 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.1;
            const yy = ((rnd(i * 8.3) * 130 - (g * sp) / 22) % 130 + 130) % 130 - 12;
            const s = 2 + rnd(i * 2.9) * 3.4;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(8 + rnd(i * 6.1) * 84).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cTorch, (0.1 + rnd(i * 3.7) * 0.24) * clamp01(hazP)),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cTorch, 0.22 * clamp01(hazP))}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f680 · CORTE EN EL BEAT en «Lo medimos»: destello óptico de 5 frames, no un fundido */}
      <SeamFlash at={at(SEAM_CUT)} color={V.torch} dur={5} />
      {/* f890 · OCLUSIÓN interna: la CHAPA cruza y detrás ya está el macro del display */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.steel} angle={9} />
      {/* el fogonazo del arranque del compresor (no es costura: es la luz del evento) */}
      <SeamFlash at={at(392)} color={V.torch} dur={9} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={118} outF={272} kick="PLACA DE DATOS" head="NO MIDAS LA ETIQUETA"
          sub="Tu refrigerador no consume ochocientos vatios." kickColor={V.torch} />
        <Titular g={g} inF={350} outF={648} kick="EL ARRANQUE" head="EL PEOR INSTANTE"
          sub="La etiqueta dice el peor instante de su vida." kickColor={V.torch} />
        <Titular g={g} inF={700} outF={992} kick="MEDIDO CON PINZA" head="CIENTO VEINTE ANDANDO"
          sub="El resto del tiempo consume una fracción de eso." />
        <Titular g={g} inF={1185} outF={1372} kick="EL CICLO REAL" head="850 UN SEGUNDO. 120 EL RESTO."
          size={64} />

        {/* el congelador horizontal: la misma forma, a escala chica */}
        {g >= 1312 && (
          <div style={{
            position: "absolute", right: 66, top: 96, width: 420, textAlign: "right",
            opacity: ez(g, 1312, 1344),
          }}>
            <Bed pad={22}>
              <Kick color={V.voltSoft}>CONGELADOR DEL GARAJE</Kick>
              <div style={{ marginTop: 8 }}><Body size={31}>85 andando · 600 de arranque</Body></div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
