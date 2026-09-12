// MovCobre.tsx — S8 · UN MOVIMIENTO CONTINUO de 53 s (1590 frames @30fps)
// «El cobre es rojizo. Este era plateado por dentro: tres letras, CCA.»
//
// EL CORAZÓN VISUAL ES EL CONTRASTE DE MATERIA: el cobre de verdad es ROJIZO (`V.copper`) y el de
// esta caja es PLATEADO GRIS (`V.silver`). Esa diferencia de color tiene que leerse DE LEJOS —por eso
// la escena entera se parte en dos halos de luz, uno cobrizo y uno frío— y A ESCALA DE MACRO —por eso
// el acto 2 vive dentro de la punta pelada, con los dos cortes de sección enfrentados.
//
// UNA sola atmósfera montada arriba de todo, UNA cámara función de `gFrame` que nunca vuelve a cero
// (arranca RETROCEDIENDO, heredando la inercia con que `MovPico` deja la licuadora sobre la mesada),
// la luz evoluciona amber → volt (la pinza) → danger (el cable tibio) sin saltar, y hay materia que
// cruza CADA frontera. Entrega a `MovPeligro` un macro del alma plateada en luz `danger`.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+250 RETROCEDIENDO hacia -60 (la inercia con que termina `MovPico`),
//                       pan +40/-26, ry -5 · luz `amber` plena, contra naranja bajo · materia: LA
//                       MESADA que se aleja (PadPlane lit .92 → .22) y el banco entrando por detrás.
//                EXIT   cám z≈-60 +150 de empuje hacia el 58%/44% del cuadro (la boca del cable) ·
//                       luz amber tirando a volt · materia: LA VAINA NEGRA DEL CABLE — la cámara entra
//                       por su boca cortada y el negro del interior es el fondo del macro.
//
// acto 2 · f382  ENTER  cám z≈+90 saliendo del interior de la boca (la tarjeta escala 2.8 → 1) ·
//                       luz amber→volt, los DOS HALOS DE MATERIA encendidos (cobrizo izq / frío der) ·
//                       materia: LA VAINA NEGRA, ahora el borde del macro de la punta pelada.
//                EXIT   cám z≈+160 empezando a retroceder, pan +58 · luz volt entrando · materia: LAS
//                       HEBRAS PLATEADAS del corte CCA, que ya se están ordenando.
//
// acto 3 · f795  ENTER  cám retrocediendo de +160 a -50 (INERCIA: el decorado cambia detrás mientras
//                       la cámara sigue su vector) · luz `volt` · materia: LAS MISMAS HEBRAS, que
//                       terminan de ordenarse y SON los listones verdes del `PromiseGap`.
//                EXIT   cám z≈-10, pan -46 · luz volt cayendo hacia danger · materia: LA GOMA NEGRA
//                       DEL CABLE (`V.ink2`), que barre el cuadro.
//
// acto 4 · f1208 ENTER  cám z≈-10 → +110 empujando al punto caliente · luz volt→danger · materia: EL
//                       MISMO CABLE, ahora tibio bajo el termómetro infrarrojo.
//                EXIT   cám z≈+370 asentada dentro del macro · luz `danger` plena, key alta ·
//                       materia: EL ALMA PLATEADA del conductor a sangre  → así arranca `MovPeligro`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f366  frontera 1→2 : PORTAL / ZOOM-THROUGH por la BOCA DEL CABLE CORTADO (fx 58 / fy 44, dur 22).
//                       Cobertura total en f382: la vaina negra llena el cuadro y del otro lado ya es
//                       el borde del macro. La ficha lo pide y es la única forma de que "entrar en el
//                       cable" sea literal.
// f772  frontera 2→3 : MORFO — las 13 HEBRAS del corte CCA se enderezan, se alinean y SE VUELVEN los
//                       listones del `PromiseGap` (stagger por hebra: la última calza en f896). La
//                       tarjeta del macro no se funde: la tapa por detrás la tarjeta del multímetro,
//                       que crece desde z -520 (traveling de capa, no un fade).
// f1194 frontera 3→4 : OCLUSIÓN con `V.ink2` — LA GOMA DEL CABLE barre el cuadro y tapa el 100 % en
//                       f1202. Materia oscura llevada a luminancia media por el Stage: ni fundido a
//                       negro ni flash blanco.
// f1436 salida acto 4: ESCALA — la miniatura del alma plateada, posada sobre el cable dentro del
//                       cuadro, crece hasta comerse el decorado (300×169 → 2240×1260 en f1548).
// (ninguna se repite, dos fronteras seguidas nunca son la misma, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PromiseGap, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los de la ficha)
const F_A2 = 382;
const F_A4 = 1208;
const SEAM_PORTAL = 366;
const SEAM_MORFO = 772;
const SEAM_OCC = 1194;
const SEAM_ESCALA = 1436;

// ── GEOMETRÍA DEL `PromiseGap` (para que las hebras calcen al pixel con sus listones) ────────
// El campo va a x=42 % · w=1040 · slats=26 → left = 0,42·1920 − 520 = 286,4 px · step = 40 px ·
// slatW = max(3, round(1040/26/2,4)) = 17 px. El PISO de las barras queda CLAVADO en 705 px: para eso
// `gapH` y `gapY` se calculan juntos, así la barra VERDE no se mueve un pixel cuando la naranja crece
// de 16 a 41 centésimas.
const GAP_X0 = 286.4;
const GAP_STEP = 40;
const GAP_SLATW = 17;
const GAP_BOTTOM = 705;
const CV_COBRE = 16;      // centésimas de voltio que perdería un cobre de verdad
const CV_CCA = 41;        // las que perdió este cable
const H_VERDE = 330 * (CV_COBRE / CV_CCA);   // 128,78 px — la altura FIJA de la barra verde
const N_HEB = 13;

// ── EL CORTE DE SECCIÓN — el contraste de materia que se lee de lejos ────────────────────────
// Es un DIAGRAMA (un corte), no un objeto: el protagonista del acto sigue siendo el macro real. Su
// trabajo es que el rojizo y el gris queden uno al lado del otro, grandes y sin ambigüedad.
const Seccion: React.FC<{
  x: number; y: number; size: number; metal: "cobre" | "cca"; titulo: string; sub: string;
  g: number; inF: number;
}> = ({ x, y, size, metal, titulo, sub, g, inF }) => {
  const frame = useCurrentFrame();
  // se van ANTES de que entre el campo firma (f858): la sección "suelta" sus hebras y deja el cuadro
  const a = ez(g, inF, inF + 24) * (1 - ez(g, 800, 856));
  if (a <= 0.004) return null;
  const esCobre = metal === "cobre";
  const base = esCobre ? V.copper : V.silver;
  const alto = esCobre ? "#F2B77E" : "#F7F9FB";
  const bajo = esCobre ? "#6B3D16" : "#63676C";
  const pop = lerp(0.82, 1, clamp01(ez(g, inF, inF + 24)));
  const gira = Math.sin(frame / 96 + (esCobre ? 0 : 2.1)) * 2.2;
  const d = size * 0.158;
  const pts: [number, number][] = [[0, 0]];
  for (let i = 0; i < 6; i++) {
    pts.push([Math.cos((i * Math.PI) / 3) * 0.205, Math.sin((i * Math.PI) / 3) * 0.205]);
  }
  for (let i = 0; i < 12; i++) {
    pts.push([Math.cos((i * Math.PI) / 6 + 0.26) * 0.392, Math.sin((i * Math.PI) / 6 + 0.26) * 0.392]);
  }
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, marginLeft: -size / 2,
      opacity: a, transform: `translateY(${((1 - a) * 22).toFixed(1)}px)`,
    }}>
      {/* la vaina + el aislante + las hebras */}
      <div style={{
        position: "relative", width: size, height: size, borderRadius: "50%",
        transform: `scale(${pop.toFixed(3)}) rotate(${gira.toFixed(2)}deg)`,
        background: `radial-gradient(circle at 34% 26%, ${V.ink2} 0%, #0C0E09 78%)`,
        boxShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(base, 0.42)}, 0 ${Math.round(size * 0.13)}px ${Math.round(size * 0.2)}px ${rgba(V.ink0, 0.85)}, inset 0 2px 0 ${rgba(V.white, 0.14)}`,
        border: `${Math.max(2, Math.round(size * 0.018))}px solid ${rgba(V.ink0, 0.9)}`,
      }}>
        {/* el anillo del aislante: separa la vaina del alma */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: size * 0.94, height: size * 0.94,
          marginLeft: -size * 0.47, marginTop: -size * 0.47, borderRadius: "50%",
          border: `${Math.max(2, Math.round(size * 0.028))}px solid ${rgba(V.ink0, 0.95)}`,
          boxShadow: `inset 0 0 ${Math.round(size * 0.16)}px ${rgba(V.ink0, 0.9)}`,
        }} />
        {pts.map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: `${(50 + p[0] * 100).toFixed(2)}%`, top: `${(50 + p[1] * 100).toFixed(2)}%`,
            width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2, borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, ${alto} 0%, ${base} 46%, ${bajo} 100%)`,
            boxShadow: `0 1px 2px ${rgba(V.ink0, 0.9)}, inset 0 0 ${Math.round(d * 0.4)}px ${rgba(bajo, 0.6)}`,
          }} />
        ))}
        {/* especular que barre: el metal se lee como metal, no como color plano */}
        <AbsoluteFill style={{
          borderRadius: "50%", mixBlendMode: "screen",
          background: `linear-gradient(${(118 + Math.sin(frame / 71) * 26).toFixed(1)}deg, rgba(255,255,255,0) 34%, ${rgba(alto, 0.24)} 50%, rgba(255,255,255,0) 66%)`,
        }} />
      </div>
      {/* rótulo: la materia dicha con su nombre. Ancho FIJO de 360 (más que el círculo) para que el
          detalle no se apile en tres líneas y se meta abajo, donde después entra el campo firma. */}
      <div style={{ width: 360, marginLeft: (size - 360) / 2, marginTop: 16, textAlign: "center" }}>
        <div style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(size * 0.3),
          letterSpacing: "0.06em", color: base, lineHeight: 1,
          textShadow: `0 0 ${Math.round(size * 0.2)}px ${rgba(base, 0.45)}, 0 5px 22px rgba(0,0,0,0.92)`,
        }}>{titulo}</div>
        <div style={{ marginTop: 8 }}><Body size={30} color={V.bone}>{sub}</Body></div>
      </div>
    </div>
  );
};

// ── LAS HEBRAS — la materia que cruza la frontera 2→3 (MORFO) ────────────────────────────────
// Nacen como el haz desordenado de hilos que sale de la punta pelada y terminan CALZANDO al pixel con
// los listones verdes del `PromiseGap`. No es un fade: cada hebra viaja a su listón.
const Hebras: React.FC<{ g: number }> = ({ g }) => {
  const frame = useCurrentFrame();
  const vis = ez(g, 596, 646) * (1 - ez(g, 888, 922));
  if (vis <= 0.004) return null;
  const respira = 1 + Math.sin(frame / 37) * 0.012;
  const hFin = H_VERDE * respira;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: N_HEB }, (_, j) => {
        const p = ez(g, SEAM_MORFO + j * 4, SEAM_MORFO + 76 + j * 4);
        const a0 = -54 + j * 8.4 + (rnd(j * 3.7) - 0.5) * 17;
        const rad = (a0 * Math.PI) / 180;
        const L0 = 168 + rnd(j * 5.1) * 132;
        const W0 = 9 + rnd(j * 2.3) * 5;
        const ox = 1148 + Math.cos(rad) * (44 + rnd(j * 1.9) * 48);
        const oy = 470 + Math.sin(rad) * 98;
        const vib = Math.sin(frame / 17 + j * 1.7) * (1 - p) * 2.1;
        const x = lerp(ox, GAP_X0 + j * GAP_STEP * 2 + (GAP_STEP - GAP_SLATW) / 2, p);
        const y = lerp(oy, GAP_BOTTOM - hFin, p);
        const w = lerp(W0, GAP_SLATW, p);
        const h = lerp(L0, hFin, p);
        const rot = lerp(a0 + 96, 0, p) + vib;
        const col = light(p, "silver", "volt");
        return (
          <div key={j} style={{
            position: "absolute", left: `${x.toFixed(2)}px`, top: `${y.toFixed(2)}px`,
            width: w, height: h,
            transform: `rotate(${rot.toFixed(2)}deg)`, transformOrigin: "50% 100%",
            borderRadius: Math.max(2, w / 2.2), opacity: vis,
            background: `linear-gradient(96deg, ${rgba(col, 0.45)} 0%, ${col} 34%, ${rgba(col, 0.72)} 72%, ${rgba(V.ink0, 0.55)} 100%)`,
            boxShadow: `0 0 ${Math.round(10 + 16 * p)}px ${rgba(col, 0.22 + 0.34 * p)}, 0 2px 6px ${rgba(V.ink0, 0.8)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

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
      position: "absolute", left: 62, bottom: 150, maxWidth: 1030,
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
export const MovCobre: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 4) - 1) * 397);
  // los helpers del Stage (`Readout`, `SeamOcclude`, `sheenAt`) miden con useCurrentFrame; `at()` los
  // ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  // Arranca RETROCEDIENDO (z 250 → −60): así hereda el vector con el que `MovPico` se va de la mesada.
  const base = gcam(g, { z0: 250, z1: -60, panX: 40, panY: -26, ry: -5, rx: 1.8, dur: 340 });
  const zAcc =
    eio(0, 150, seg(g, 356, 442)) +            // el PORTAL empuja hacia adentro de la boca del cable
    eio(0, 72, seg(g, 470, 706)) +             // el macro sigue acercándose, lento
    eio(0, -212, seg(g, SEAM_MORFO, 906)) +    // INERCIA: retrocede a ver las barras
    eio(0, 38, seg(g, 986, 1152)) +            // micro-empuje sobre el vacío que se abre
    eio(0, 118, seg(g, F_A4, 1332)) +          // entra al punto caliente del termómetro
    eio(0, 262, seg(g, SEAM_ESCALA, 1584));    // el macro del alma se come el decorado
  const pxAcc =
    eio(0, -72, seg(g, 380, 528)) + eio(0, 60, seg(g, SEAM_MORFO, 922)) +
    eio(0, -46, seg(g, F_A4, 1382)) + eio(0, 32, seg(g, 1446, 1590));
  const pyAcc =
    eio(0, 36, seg(g, 358, 502)) + eio(0, -42, seg(g, SEAM_MORFO, 904)) +
    eio(0, 27, seg(g, 1198, 1364)) + eio(0, -19, seg(g, 1452, 1590));
  const ryAcc =
    eio(0, 4.2, seg(g, F_A2, 626)) + eio(0, -6.4, seg(g, 806, 1004)) + eio(0, 3.6, seg(g, 1212, 1424));
  const cam =
    `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px) ` +
    `rotateY(${ryAcc.toFixed(3)}deg)`;

  // ── LA LUZ: evoluciona, no salta. amber (la tarde) → volt (la pinza) → danger (el cable tibio) ─
  // Las dos llamadas se tocan en g=800 con el MISMO color (volt), así que la unión es invisible.
  const cKey = g < 800
    ? light(seg(g, 40, 790), "amber", "volt")
    : light(seg(g, 800, 1500), "volt", "danger");
  const cWarm = light(seg(g, 200, 1520), "orange", "danger");
  const keyFrom = 0.24 + eio(0, 0.3, seg(g, 0, 420)) + eio(0, -0.17, seg(g, 820, 1210))
    + eio(0, 0.23, seg(g, 1246, 1566));
  const intensity = 0.62 + eio(0, 0.3, seg(g, 0, 14)) + eio(0, 0.12, seg(g, 900, 1160))
    + eio(0, -0.08, seg(g, 1500, 1590));

  // ── LOS DOS HALOS DE MATERIA: el contraste rojizo/gris legible DE LEJOS ────────────────────
  const halo = ez(g, 396, 486) * (1 - ez(g, 900, 1010)) + ez(g, 1440, 1520) * 0.7;
  const haloCobre = 0.3 + Math.sin(g / 53) * 0.05;
  const haloGris = 0.34 + Math.sin(g / 41 + 1.6) * 0.06;

  // ── ACTO 1 · el rollo sobre el banco, la vaina impresa a foco ──────────────────────────────
  const zt = zoomThrough(g, SEAM_PORTAL, 22, 58, 44);
  const a1On = g < SEAM_PORTAL + 24;
  const rolloW = Math.round(lerp(1090, 1230, ez(g, 20, 330)));
  const rolloH = Math.round(rolloW * 0.5625);
  const mesadaLit = 0.92 - 0.7 * ez(g, 24, 336);
  const mesadaY = lerp(70, 87, ez(g, 10, 340));
  const heroOp = ez(g, 118, 152) * (1 - ez(g, 312, 348));

  // ── ACTO 2 · el macro de la punta pelada: hebras plateadas, no rojizas ─────────────────────
  const a2On = g >= 370 && g < 884;
  const a2Scale = lerp(2.8, 1, ez(g, 372, 452));
  const macroW = Math.round(lerp(1340, 1250, ez(g, 470, 760)));
  const macroH = Math.round(macroW * 0.5625);
  const macroY = lerp(46, 43, ez(g, 640, 860));

  // ── ACTO 3 · la caída de tensión: 0,16 esperado contra 0,41 medido ─────────────────────────
  // La tarjeta del multímetro CRECE desde el fondo y TAPA a la del macro (traveling, no un fade).
  const a3On = g >= 782 && g < SEAM_OCC + 12;
  const mult = ez(g, 790, 892);
  const multW = Math.round(lerp(700, 1560, mult));
  const multH = Math.round(multW * 0.5625);
  const multZ = lerp(-520, -30, mult);
  // el campo firma: la naranja crece de 16 a 41 y abre el vacío JUSTO cuando Claudio lo dice (f1091);
  // `gapH`/`gapY` se mueven juntos para que el PISO quede clavado en 705 px y la verde no se corra.
  const gapOn = ez(g, 858, 902) * (1 - ez(g, 1186, 1206));
  const promesa = lerp(CV_COBRE, CV_CCA, ez(g, 1064, 1142));
  const gapH = 330 * (promesa / CV_CCA);
  const gapY = ((GAP_BOTTOM - gapH / 2) / 1080) * 100;

  // ── ACTO 4 · el termómetro infrarrojo sobre el cable tibio ─────────────────────────────────
  const a4On = g >= SEAM_OCC + 2;
  const termW = Math.round(lerp(1150, 1260, ez(g, 1206, 1360)));
  const termH = Math.round(termW * 0.5625);
  const termDim = 1 - 0.72 * ez(g, SEAM_ESCALA + 40, 1546);
  // ESCALA: la miniatura del alma plateada se vuelve el decorado
  const esc = ez(g, SEAM_ESCALA, 1548);
  const almaW = Math.round(lerp(300, 2240, esc));
  const almaH = Math.round(almaW * 0.5625);
  const almaX = lerp(57, 50, esc);
  const almaY = lerp(63, 50, esc);
  const almaOn = g >= SEAM_ESCALA - 34;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={0.58} />

      <Layers cam={cam}>
        {/* P1 · EL LUGAR: el banco del garaje con el rollo de cable. Nunca se va: sólo cambia cuánto
            lo dejamos ver (la cama de foto de todo el movimiento). */}
        <PhotoPlane
          src="img/cmetemu/cmet_mv_cobre1.jpg"
          kind="photo" z={-640} scale={1.32}
          dim={0.3 + 0.44 * ez(g, 300, 900)} tint={cWarm}
        />

        {/* P2 · LOS DOS HALOS DE MATERIA: rojizo a la izquierda, gris frío a la derecha. Es lo que
            hace que el contraste de materia se lea aunque mires el video de lejos. */}
        <Plane z={-470}>
          <AbsoluteFill style={{ opacity: clamp01(halo), mixBlendMode: "screen" }}>
            <AbsoluteFill style={{
              background: `radial-gradient(58% 62% at 24% 40%, ${rgba(V.copper, haloCobre)} 0%, rgba(0,0,0,0) 68%)`,
            }} />
            <AbsoluteFill style={{
              background: `radial-gradient(56% 60% at 78% 36%, ${rgba(V.silver, haloGris)} 0%, rgba(0,0,0,0) 66%)`,
            }} />
          </AbsoluteFill>
        </Plane>

        {/* P3 · LA MESADA que se aleja (la materia con la que ENTRA el movimiento) */}
        <Plane z={-300}>
          <PadPlane y={mesadaY} w={1460} h={330} rx={63} lit={clamp01(mesadaLit)} z={-40} />
        </Plane>

        {/* P4 · LA ESTRUCTURA GRÁFICA: los cortes de sección, las hebras y el campo firma */}
        <Plane z={-60}>
          {/* los dos cortes enfrentados: EL CONTRASTE DE MATERIA, grande y sin ambigüedad */}
          <Seccion x={32} y={19} size={212} metal="cobre" g={g} inF={472}
            titulo="COBRE" sub="Rojizo, como una moneda." />
          <Seccion x={63} y={19} size={236} metal="cca" g={g} inF={548}
            titulo="CCA" sub="Aluminio con baño de cobre." />

          {/* MORFO: las hebras plateadas se ordenan y SON los listones verdes */}
          <Hebras g={g} />

          {/* EL CAMPO FIRMA — nunca sobre fondo plano: se apoya sobre el clip del multímetro */}
          {gapOn > 0.004 && (
            <PromiseGap
              promise={promesa} measured={CV_COBRE} unit="cV" slats={26}
              x={42} y={gapY} w={1040} h={gapH} on={gapOn} nums={false}
              label="CAÍDA EN CINCO METROS · CINCO AMPERIOS"
            />
          )}

          {/* ── LAS CIFRAS: entran desde el instrumento, nunca sobre fondo plano ── */}
          {/* el 60 % que conduce el aluminio (Claudio lo dice en f706) */}
          {g >= 714 && g < 900 && (
            <Readout value="60" unit="%" label="LO QUE CONDUCE EL ALUMINIO" at={at(716)}
              x={79} y={71} size={118} color={V.silver} />
          )}
          {/* lo que perdería un cobre de verdad */}
          {g >= 1000 && g < 1196 && (
            <Readout value="0,16" unit="V" label="EL COBRE PERDERÍA" at={at(1002)}
              x={80} y={58} size={104} color={V.volt} />
          )}
          {/* lo que perdió ÉSTE (f1091: «y este perdió 41») */}
          {g >= 1100 && g < 1196 && (
            <Readout value="0,41" unit="V" label="ESTE CABLE PERDIÓ" at={at(1102)}
              x={80} y={26} size={116} color={V.orange} />
          )}
          {/* el termómetro: 44 sobre el cable, 28 en el aire */}
          {g >= 1272 && g < 1470 && (
            <Readout value="44" unit="°C" label="SOBRE EL CABLE" at={at(1274)}
              x={79} y={29} size={162} color={V.danger} />
          )}
          {g >= 1320 && g < 1470 && (
            <Readout value="28" unit="°C" label="AMBIENTE" at={at(1322)}
              x={79} y={57} size={86} color={rgba(V.bone, 0.9)} />
          )}
        </Plane>

        {/* P5 · EL MATERIAL REAL: las tarjetas protagonistas ──
            ⛔ EL ORDEN DE ESTE BLOQUE ES DELIBERADO. Dentro de un `preserve-3d`, dos tarjetas con el
            MISMO translateZ se pintan por orden de DOM, y cada costura necesita que gane la de
            adelante: el acto 2 va PRIMERO para que el acto 1, que se está yendo por el PORTAL, le
            pase por delante creciendo (si fuera al revés el macro taparía al portal y la costura se
            leería como un fundido). Después el acto 3 tapa al 2 (traveling), el 4 al 3 (bajo la
            oclusión) y el macro del alma se los come a todos por ESCALA. */}
        <Plane z={40}>
          {/* ACTO 2 — salimos DENTRO de la boca del cable: el macro de las dos puntas peladas */}
          {a2On && (
            <AbsoluteFill style={{
              transform: `scale(${a2Scale.toFixed(3)})`, transformOrigin: "58% 44%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cobre2.mp4" kind="video"
                w={macroW} h={macroH} x={46} y={macroY} z={0}
                ry={lerp(-6, 1.5, ez(g, 396, 700))} radius={16} startFrom={7}
                lit={0.96} litColor={V.silver}
                label="LAS DOS PUNTAS, UNA AL LADO DE LA OTRA" sheenAt={at(438)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 1 — el rollo sobre el banco. Se va por PORTAL, entrando por la boca del cable. */}
          {a1On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity), transformOrigin: "58% 44%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cobre1.mp4" kind="video"
                w={rolloW} h={rolloH} x={50} y={47} z={0}
                ry={lerp(8, 0.6, ez(g, 16, 300))} rx={lerp(-3, 0, ez(g, 16, 300))}
                radius={16} startFrom={5} lit={0.62 + 0.38 * ez(g, 8, 96)}
                litColor={cKey} label="DIEZ AWG · IMPRESO EN LA VAINA" sheenAt={at(74)}
              />
              {/* Claudio pelando la punta (f111: «lo pelé para hacer la conexión») */}
              {heroOp > 0.01 && (
                <div style={{ opacity: heroOp }}>
                  <MediaCard
                    src="img/cmetemu/cmet_h11.jpg" kind="photo"
                    w={320} h={180} x={79} y={74} z={90}
                    ry={-7} radius={12} lit={0.92} litColor={cKey} sheenAt={at(140)}
                  />
                </div>
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 3 — el multímetro CRECE desde el fondo y tapa al macro: traveling, no fundido */}
          {a3On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cobre3.mp4" kind="video"
              w={multW} h={multH} x={50} y={48} z={multZ}
              ry={lerp(7, -1, mult)} rx={lerp(3, 0, mult)} radius={16} startFrom={4}
              lit={lerp(0.44, 0.82, mult)} litColor={V.volt}
              label={mult > 0.9 ? "PUNTAS EN LOS DOS EXTREMOS · CINCO METROS" : undefined}
              sheenAt={at(898)}
            />
          )}

          {/* ACTO 4 — el termómetro infrarrojo sobre el cable tibio */}
          {a4On && (
            <div style={{ opacity: termDim }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_cobre4.mp4" kind="video"
                w={termW} h={termH} x={44} y={48} z={0}
                ry={lerp(-8, 0.5, ez(g, 1204, 1348))} radius={16} startFrom={6}
                lit={0.95} litColor={cKey} label="TERMÓMETRO INFRARROJO · CINCO AMPERIOS"
                sheenAt={at(1240)}
              />
            </div>
          )}

          {/* SALIDA POR ESCALA — la miniatura del alma plateada se vuelve el decorado y ENTREGA
              el encuadre a `MovPeligro`: macro del alma, luz `danger`. */}
          {almaOn && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_cobre2.mp4" kind="video"
              w={almaW} h={almaH} x={almaX} y={almaY} z={lerp(60, 300, esc)}
              ry={lerp(-9, 0, esc)} radius={Math.round(lerp(12, 0, esc))} startFrom={11}
              lit={lerp(0.86, 1, esc)} litColor={esc > 0.5 ? V.danger : V.silver}
              label={esc < 0.28 ? "EL ALMA" : undefined} sheenAt={at(1470)}
            />
          )}
        </Plane>

        {/* P6 · PRIMER PLANO: viruta y polvo del taller (hold VIVO: nunca un cuadro quieto) */}
        <Plane z={230}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.42 + rnd(i * 4.7) * 1.15;
            const yy = (((rnd(i * 8.3) * 132 - (g * sp) / 21) % 132) + 132) % 132 - 13;
            const s = 2 + rnd(i * 2.9) * 3.6;
            const c = i % 3 === 0 ? V.copper : V.silver;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(c, 0.12 + rnd(i * 3.7) * 0.26),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(c, 0.22)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── ÍCONOS PNG como objetos de la escena (suman capa, no reemplazan material real) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {g >= 48 && g < 352 && (
          <div style={{ opacity: ez(g, 48, 84) * (1 - ez(g, 318, 350)) }}>
            <IconPng src="img/cmetemu/cmet_ic_cable.png" x={14} y={19} size={98} glow={V.ink0} />
          </div>
        )}
        {g >= 1226 && g < 1452 && (
          <div style={{ opacity: ez(g, 1226, 1262) * (1 - ez(g, 1418, 1452)) }}>
            <IconPng src="img/cmetemu/cmet_ic_termometro.png" x={16} y={22} size={104} glow={V.ink0} />
          </div>
        )}
      </AbsoluteFill>

      {/* ── LA COSTURA POR OCLUSIÓN (encima de todo, nunca un fade) ── */}
      {/* f1194 · LA GOMA DEL CABLE barre el cuadro: `V.ink2`, la materia que cruza la frontera 3→4 */}
      <SeamOcclude at={at(SEAM_OCC)} dur={16} color={V.ink2} angle={-7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={26} outF={322} kick="LO QUE DICE LA VAINA" head="DIEZ AWG, COBRE PURO"
          sub="Eso venía impreso a lo largo de todo el rollo." kickColor={V.amber} />
        <Titular g={g} inF={402} outF={742} kick="LA PUNTA PELADA" head="PLATEADO POR DENTRO"
          sub="El cobre es rojizo. Este era gris." kickColor={V.silver} />
        <Titular g={g} inF={1096} outF={1188} kick="CAÍDA EN CINCO METROS"
          head="CUARENTA Y UNA CENTÉSIMAS" size={70} />
        <Titular g={g} inF={1242} outF={1424} kick="CON EL AMBIENTE A VEINTIOCHO"
          head="CUARENTA Y CUATRO GRADOS" size={70} kickColor={V.danger} />
        <Titular g={g} inF={1480} outF={1980} kick="EL VEREDICTO"
          head="NO ES UN PELIGRO. ES UNA PÉRDIDA." size={62} kickColor={V.danger} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
