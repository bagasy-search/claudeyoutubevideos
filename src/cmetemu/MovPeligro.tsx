// MovPeligro.tsx — S8 · UN MOVIMIENTO CONTINUO de 58 s (1740 frames @30fps)
// «Tu casa le manda corriente a la calle, sube por el transformador y aparece en el cable que está
//  tocando el operario. Él cortó la llave y sabe que está muerto. Y no lo está, por tu culpa.»
//
// Es el ÚNICO tramo del video donde entra `V.danger`, y el más dramático. La tensión NO se dibuja con
// nadie electrocutado: se dibuja con LA TRAYECTORIA DE LA CORRIENTE — un hilo que nace como el ALMA
// PLATEADA del conductor (la materia que hereda de `MovCobre`), se vuelve naranja de alarma, y avanza
// acto a acto hasta tocar el cable que el operario tiene en la mano. La cámara SUBE por el poste
// (un solo vector de ascenso que cruza la frontera 3→4 sin frenar) y la luz CAE del naranja de alarma
// al azul del anochecer: `danger` → `torch`, con el ambiente virando de `amber` a `sky`.
//
// UNA sola atmósfera montada arriba de todo (nunca se remonta), UNA sola cámara función de `gFrame`
// (ningún acto la reinicia), la luz evoluciona, y hay MATERIA que cruza cada frontera: el HILO DE
// CORRIENTE sobrevive las cuatro, y además cada frontera tiene su propia materia local.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+240 (macro, heredada de `MovCobre`: el mismo encuadre cerrado sobre la
//                       punta cortada) · luz `danger` alta, key a la izquierda (keyFrom .26),
//                       intensity .88 desde el PRIMER cuadro (no hay rampa desde negro) ·
//                       materia: EL ALMA PLATEADA DEL CONDUCTOR, a foco, cruzando el cuadro.
//                EXIT   cám z≈+150 retrocediendo, ry abriendo · luz `danger` plena · materia: LA CARA
//                       DE LA FICHA MACHO (el alma plateada ya se retrajo y es el hilo de corriente
//                       que corre por dentro del cable).
//
// acto 2 · f383  ENTER  cám z≈+150 (hereda; la ficha ocupa el mismo punto de pantalla, 63,5%/41,5%) ·
//                       luz `danger` con el ámbar de la casa abajo a la derecha · materia: LA CARA DE
//                       LA FICHA, que CRECE y ES la placa del tomacorriente de la pared.
//                EXIT   cám z≈+270 empujando dentro de la ranura (52%/46%) · luz `danger`→`torch`
//                       empezando · materia: LA RANURA NEGRA del tomacorriente.
//
// acto 3 · f766  ENTER  cám z≈+60 saliendo del portal (escala 4,2 → 1 desde el mismo 52%/46%) ·
//                       luz virando a `torch`, el ambiente ya en `sky` (el anochecer) · materia:
//                       el hueco negro de la ranura = LA SOMBRA DEL CILINDRO DEL TRANSFORMADOR.
//                EXIT   cám z≈+60, SUBIENDO (pyAcc en plena velocidad) · luz `torch` · materia: EL
//                       CABLE DE ACOMETIDA que sale del transformador y sigue subiendo por el poste.
//
// acto 4 · f1114 ENTER  cám z≈+60 y el MISMO vector de ascenso, sin frenar un solo cuadro (INERCIA):
//                       el transformador se va por abajo, la punta del poste baja desde arriba ·
//                       luz `torch` sobre azul `sky` · materia: EL CABLE DE ACOMETIDA (los dos planos
//                       comparten cuadro 5 s mientras viajan al mismo vector).
//                EXIT   cám z≈+170 (acercada al operario) · luz `torch` baja · materia: LA CHAPA DEL
//                       BRAZO DE LA GRÚA que cruza el cuadro.
//
// acto 5 · f1496 ENTER  cám z≈+170 retrocediendo a ≈-90 y todavía subiendo · luz `torch` bajo sobre
//                       el azul del anochecer, floor .80 · materia: EL POSTE, ahora visto desde MUY
//                       ARRIBA, con la calle a oscuras abajo.
//                EXIT   cám z≈-90, muy alta, asentada · luz `torch` bajo · materia: EL POSTE AL
//                       ANOCHECER  → así arranca `MovCuenta`.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f383  frontera 1→2 : MORFO — la cara de la ficha macho (118×152 px, ry −16°, en el 63,5%/41,5% del
//                      cuadro) CRECE y se convierte en la placa del tomacorriente (1300×722, ry 0°,
//                      centrada). Es la misma forma: cambia de tamaño, de aspecto y de contenido.
//                      Ventana f372 → f470; el acto 1 queda detrás y se retira.
// f758  frontera 2→3 : PORTAL — `zoomThrough(g, 758, 24, 52, 46)`: la cámara entra en la RANURA del
//                      tomacorriente y, en f772 (con el zoom ya en 0,58 y el cuadro comido), la placa
//                      del acto 3 entra a escala 4,2 y baja a 1: salimos en el cableado del poste.
//                      La cama de foto se cambia DENTRO del portal (f772 → f800), tapada por la placa.
// f1114 frontera 3→4 : INERCIA — un único ramp de ascenso (`pyAcc`, f830 → f1400) cruza el frame 1114
//                      en su velocidad máxima; el transformador sale por abajo y la punta del poste
//                      entra por arriba al MISMO vector. Ningún flash, ningún corte.
// f1496 frontera 4→5 : OCLUSIÓN con `V.steel` (la chapa del brazo de la grúa), ángulo 66°, dur 15.
//                      La calle a oscuras YA está montada detrás desde f1486.
// (ninguna se repite, ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Bed,
} from "./VoltStage";

// ── utilidades locales (todo función pura de gFrame) ────────────────────────────────────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros (los de la ficha: 0 · 383 · 766 · 1114 · 1496 · 1740)
const F_A2 = 383;
const F_A3 = 766;
const F_A4 = 1114;
const F_A5 = 1496;
const SEAM_MORFO = F_A2;        // la cara de la ficha crece y ES el tomacorriente
const SEAM_PORTAL = F_A3 - 8;   // la cámara ya está entrando en la ranura cuando arranca el acto 3
const SEAM_OCC = F_A5;          // la chapa del brazo de la grúa

// ── LA TRAYECTORIA DE LA CORRIENTE ──────────────────────────────────────────────────────────
// Seis siluetas de 7 puntos en el espacio del cuadro (viewBox 1920×1080). El índice 0 es SIEMPRE
// el origen (tu casa) y el 6 la punta que avanza. Se interpolan punto a punto sobre cada frontera:
// por eso el hilo no aparece ni desaparece nunca — se TRANSFORMA.
type Pt = [number, number];
// f0 · el ALMA PLATEADA en macro, heredada de `MovCobre`: cruza el cuadro entero
const SH0: Pt[] = [[-80, 455], [280, 486], [660, 512], [1020, 530], [1380, 556], [1700, 582], [2000, 606]];
// acto 1 · el hilo corre por dentro del cable de dos machos, sobre el banco
const SH1: Pt[] = [[240, 676], [440, 706], [650, 670], [880, 712], [1110, 678], [1360, 714], [1600, 688]];
// acto 2 · baja a la ficha, entra por la ranura y sube al tablero
const SH2: Pt[] = [[240, 880], [480, 830], [760, 760], [960, 600], [905, 452], [1130, 372], [1440, 330]];
// acto 3 · sale a la calle y sube por el poste hasta el transformador
const SH3: Pt[] = [[120, 1180], [520, 1090], [860, 980], [955, 800], [930, 610], [985, 436], [1010, 296]];
// acto 4 · sigue subiendo y llega al cable que el operario tiene en la mano
const SH4: Pt[] = [[60, 1230], [420, 1140], [760, 1020], [900, 860], [905, 690], [1000, 540], [1160, 442]];
// acto 5 · el hilo solo, encendido, en la calle a oscuras
const SH5: Pt[] = [[40, 1250], [380, 1160], [700, 1040], [858, 880], [862, 690], [880, 470], [892, 250]];

const mixPts = (A: Pt[], B: Pt[], t: number): Pt[] =>
  A.map((p, i) => [lerp(p[0], B[i][0], t), lerp(p[1], B[i][1], t)] as Pt);

const shapeAt = (g: number): Pt[] => {
  if (g < 60) return SH0;
  if (g < 215) return mixPts(SH0, SH1, ez(g, 60, 215));
  if (g < 372) return SH1;
  if (g < 470) return mixPts(SH1, SH2, ez(g, 372, 470));
  if (g < 754) return SH2;
  if (g < 858) return mixPts(SH2, SH3, ez(g, 754, 858));
  if (g < 1096) return SH3;
  if (g < 1236) return mixPts(SH3, SH4, ez(g, 1096, 1236));
  if (g < 1486) return SH4;
  return mixPts(SH4, SH5, ez(g, 1486, 1600));
};

// curva suave por puntos medios (nada de segmentos rectos: es un conductor, no un esquema)
const dSmooth = (pts: Pt[]) => {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return d;
};

// ── EL RESPLANDOR DE LA ESCENA (la alarma abajo-derecha → el azul del anochecer arriba) ─────
const Resplandor: React.FC<{ alarma: number; noche: number; c1: string; c2: string }> = ({
  alarma, noche, c1, c2,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{
      opacity: alarma,
      background: `radial-gradient(76% 60% at 84% 104%, ${rgba(c1, 0.30)} 0%, ${rgba(c1, 0.08)} 42%, rgba(0,0,0,0) 74%)`,
      mixBlendMode: "screen",
    }} />
    <AbsoluteFill style={{
      opacity: noche,
      background: `linear-gradient(184deg, ${rgba(c2, 0.26)} 0%, ${rgba(c2, 0.08)} 46%, rgba(0,0,0,0) 82%)`,
      mixBlendMode: "screen",
    }} />
  </AbsoluteFill>
);

// ── TITULAR (una idea de texto por acto, sobre cama oscura, safe area 60 px) ─────────────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.danger }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.001) return null;
  const dy = (1 - ez(g, inF, inF + 22)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 150, maxWidth: 1040,
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
export const MovPeligro: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si gFrame llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const g = gRaw > 0 ? gRaw : Math.max(0, (Math.min(Math.max(acto, 1), 5) - 1) * 348);
  // los helpers del Stage (`SeamOcclude`, `SeamFlash`, `sheenAt`) miden con useCurrentFrame;
  // `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, función de g, acumulativa. Ningún acto la reinicia ────────────────
  // Viaje base: del macro heredado (z +240) al plano muy alto del final (z −120), abriendo a la
  // derecha. Los acumuladores hacen el empuje al portal, el ascenso por el poste y el retroceso.
  const base = gcam(g, { z0: 240, z1: -120, panX: -70, panY: 0, ry: 7, rx: -2.5, dur: 1700 });
  const zAcc =
    eio(0, 128, seg(g, 700, 790)) +      // empuje DENTRO de la ranura (portal)
    eio(0, -214, seg(g, 796, 900)) +     // salida al aire libre, se abre
    eio(0, 116, seg(g, 1190, 1340)) +    // acercada al operario
    eio(0, -262, seg(g, 1500, 1700));    // retroceso final: la calle desde muy arriba
  const pxAcc =
    eio(0, 58, seg(g, 380, 520)) +
    eio(0, -92, seg(g, 1180, 1400)) +
    eio(0, 44, seg(g, 1520, 1720));
  // EL ASCENSO POR EL POSTE: un ÚNICO ramp que cruza la frontera 3→4 (f1114) en plena velocidad.
  // Ahí está la costura de INERCIA: la cámara no frena, cambia el decorado.
  const pyAcc =
    eio(0, 152, seg(g, 830, 1400)) +
    eio(0, 72, seg(g, 1500, 1740));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: evoluciona, no salta. danger (la alarma) → torch (la linterna del anochecer) ───
  const cKey = light(seg(g, 40, 1150), "danger", "torch");
  const cAmb = light(seg(g, 520, 1560), "amber", "sky");
  const keyFrom = 0.26 + eio(0, 0.34, seg(g, 60, 900)) + eio(0, -0.12, seg(g, 1400, 1700));
  // rampa de entrada de 14 frames y desde .88: el cuadro está iluminado en el PRIMER cuadro
  const intensity = 0.88 + eio(0, 0.10, seg(g, 0, 14)) + eio(0, -0.36, seg(g, 1180, 1700));
  const floorK = lerp(0.56, 0.80, ez(g, 1080, 1700));

  // ── EL HILO DE CORRIENTE ──────────────────────────────────────────────────────────────────
  const pts = shapeAt(g);
  const dCur = dSmooth(pts);
  // el alma plateada llega ENCENDIDA de punta a punta y se retrae al origen; después el hilo
  // avanza por etapas y toca el cable del operario exactamente en f1320.
  const reach = clamp01(Math.max(
    1 - ez(g, 110, 250),
    0.16 + 0.20 * ez(g, 150, 340) + 0.24 * ez(g, 420, 720)
    + 0.22 * ez(g, 840, 1090) + 0.18 * ez(g, 1160, 1320),
  ));
  const curColor = light(seg(g, 70, 230), "silver", "danger");
  const sw = lerp(26, 8, ez(g, 60, 215)) - 1.6 * ez(g, 1500, 1700);
  const pulseSp = lerp(112, 74, ez(g, 300, 1200));
  const llego = ez(g, 1296, 1352);            // la punta ya está en el cable del operario
  const ripple = clamp01(((g - 1320) % 46) / 46);
  const tip = pts[pts.length - 1];

  // ── ACTO 1 · el macro del alma → el cable de dos machos sobre el banco ─────────────────────
  const a1On = g < 478;
  const w1 = Math.round(lerp(2560, 1290, ez(g, 30, 250)));
  const h1 = Math.round(w1 * 0.5625);
  const x1 = lerp(64, 50, ez(g, 30, 250));
  const y1 = lerp(38, 47, ez(g, 30, 250));
  const op1 = 1 - ez(g, 430, 472);            // ya está TAPADO por la placa que creció

  // ── ACTO 2 · MORFO: la cara de la ficha macho CRECE y es el tomacorriente de la pared ──────
  const m1 = ez(g, SEAM_MORFO - 11, SEAM_MORFO + 87);
  const a2On = g >= SEAM_MORFO - 13 && g < 786;
  const w2 = Math.round(lerp(118, 1300, m1));
  const h2 = Math.round(lerp(152, 722, m1));
  const x2 = lerp(63.5, 50, m1);
  const y2 = lerp(41.5, 47, m1);
  const zt = zoomThrough(g, SEAM_PORTAL, 24, 52, 46);

  // ── ACTO 3 · salimos del portal en el poste; el transformador ─────────────────────────────
  // La placa entra a escala 4,2 cuando el zoom del acto 2 ya se comió el cuadro (f772): ahí NO hay
  // corte, hay una placa gigante que ocupa el 100 % y baja a 1. Es el otro lado del portal.
  const a3On = g >= F_A3 + 6 && g < 1268;
  const a3Scale = lerp(4.2, 1, ez(g, F_A3 + 6, 862));
  const w3 = Math.round(lerp(1360, 1250, ez(g, 862, 1040)));
  const h3 = Math.round(w3 * 0.5625);
  // el transformador SALE POR ABAJO mientras la cámara sigue subiendo (inercia)
  const y3 = lerp(47, 186, ez(g, F_A4 - 40, F_A4 + 138));

  // ── ACTO 4 · el operario en la altura del poste, al anochecer ──────────────────────────────
  // se va bajo la chapa: a f1504 el occluder cubre el 100 % del cuadro (p ≈ 0,53)
  const a4On = g >= F_A4 - 50 && g < SEAM_OCC + 8;
  const w4 = Math.round(lerp(1290, 1210, ez(g, 1240, 1420)));
  const h4 = Math.round(w4 * 0.5625);
  // entra POR ARRIBA al mismo vector con el que el transformador se va por abajo
  const y4 = lerp(-92, 44, ez(g, F_A4 - 40, F_A4 + 138));

  // ── ACTO 5 · la calle a oscuras vista desde arriba del poste ───────────────────────────────
  // nace DENTRO de la chapa (f1500), no después: la oclusión REVELA lo que ya estaba montado
  const a5On = g >= SEAM_OCC + 4;
  const w5 = Math.round(lerp(1580, 1430, ez(g, 1500, 1740)));   // Ken-Burns lento sobre la foto
  const h5 = Math.round(w5 * 0.5625);
  const y5 = lerp(50, 45, ez(g, 1500, 1740));

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cAmb} keyFrom={keyFrom} intensity={intensity} floor={floorK} />

      <Layers cam={cam}>
        {/* P1 · CAMA DE FOTO, plano profundo (cama de foto debajo de TODO componente). Se cambia
            DENTRO del portal (f776→f800), tapada al 100 % por la placa gigante del acto 3:
            del banco del garaje al poste al anochecer. */}
        <Plane z={-640}>
          {g < 806 && (
            <AbsoluteFill style={{ opacity: 1 - ez(g, 776, 800) }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_pel1.jpg"
                kind="photo" z={0} scale={lerp(1.62, 1.42, ez(g, 0, 700))}
                dim={lerp(0.52, 0.68, ez(g, 60, 700))} tint={V.danger}
              />
            </AbsoluteFill>
          )}
          {g >= 774 && (
            <AbsoluteFill style={{ opacity: ez(g, 776, 800) }}>
              <PhotoPlane
                src="img/cmetemu/cmet_mv_pel4.jpg"
                kind="photo" z={0} scale={lerp(1.58, 1.34, ez(g, 800, 1520))}
                dim={lerp(0.62, 0.80, ez(g, 900, 1700))} tint={V.sky}
              />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P2 · el resplandor: la alarma naranja abajo-derecha muere y entra el azul del anochecer */}
        <Plane z={-420}>
          <Resplandor
            alarma={0.9 - 0.75 * ez(g, 700, 1180)}
            noche={ez(g, 780, 1400)}
            c1={V.danger} c2={V.sky}
          />
        </Plane>

        {/* P3 · el hormigón del garaje: el suelo de los dos primeros actos (se apaga bajo el portal) */}
        {g < 812 && (
          <Plane z={-250}>
            <PadPlane y={78} w={1440} h={318} rx={62} lit={1 - ez(g, 690, 786)} z={-40} />
          </Plane>
        )}

        {/* P4 · EL MATERIAL REAL: un solo protagonista por acto ── */}
        <Plane z={40}>
          {/* ACTO 1 — macro del alma plateada → el cable con DOS FICHAS MACHO sobre el banco.
              De acá sale la cara de la ficha que se convierte en el tomacorriente. */}
          {a1On && (
            <div style={{ opacity: op1 }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_pel1.mp4" kind="video"
                w={w1} h={h1} x={x1} y={y1} z={0}
                ry={lerp(-9, 0.6, ez(g, 30, 270))} rx={lerp(3, 0, ez(g, 30, 270))}
                radius={16} startFrom={5} lit={0.96} litColor={cKey}
                label={g > 230 ? "DOS MACHOS EN LAS PUNTAS" : undefined}
                sheenAt={at(126)}
              />
            </div>
          )}

          {/* ACTO 2 — MORFO: la MISMA forma (la cara de la ficha) crece hasta ser la placa del
              tomacorriente de la pared, con el tablero al lado. Sale por el PORTAL de la ranura. */}
          {a2On && (
            <AbsoluteFill style={{
              transform: zt.out, opacity: clamp01(zt.opacity), transformOrigin: "52% 46%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_pel2.mp4" kind="video"
                w={w2} h={h2} x={x2} y={y2} z={0}
                ry={lerp(-16, 0, m1)} rx={lerp(4, 0, m1)}
                radius={Math.round(lerp(8, 16, m1))} startFrom={7}
                lit={0.94} litColor={cKey}
                label={m1 > 0.9 ? "EL TOMACORRIENTE DE TU CASA" : undefined}
                sheenAt={at(492)}
              />
              {/* la RANURA: el detalle por el que entra la cámara (estructura, no objeto) */}
              {m1 > 0.6 && (
                <div style={{
                  position: "absolute", left: "52%", top: "46%", width: 26, height: 76,
                  marginLeft: -13, marginTop: -38, borderRadius: 3,
                  background: `linear-gradient(180deg, ${rgba(V.ink0, 0.94)} 0%, ${rgba(V.ink0, 0.72)} 100%)`,
                  boxShadow: `0 0 ${Math.round(18 + 26 * ez(g, 660, 760))}px ${rgba(V.danger, 0.55 * ez(g, 600, 740))}, inset 0 2px 4px ${rgba(V.white, 0.16)}`,
                  opacity: (m1 - 0.6) / 0.4,
                }} />
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 3 — salimos del portal: el TRANSFORMADOR gris en lo alto del poste.
              Se va por ABAJO mientras la cámara sigue subiendo: eso es la INERCIA. */}
          {a3On && (
            <AbsoluteFill style={{
              transform: `scale(${a3Scale.toFixed(3)})`, transformOrigin: "52% 46%",
            }}>
              <MediaCard
                src="broll/cmetemu/cmet_mv_pel3.mp4" kind="video"
                w={w3} h={h3} x={50} y={y3} z={0}
                ry={lerp(6, 0, ez(g, F_A3, 900))} radius={16} startFrom={4}
                lit={0.92} litColor={cKey}
                label={g > 830 && g < 1060 ? "EL TRANSFORMADOR DE LA ESQUINA" : undefined}
                sheenAt={at(842)}
              />
            </AbsoluteFill>
          )}

          {/* ACTO 4 — EL OPERARIO en la altura del poste, al anochecer. Entra POR ARRIBA al mismo
              vector. Sale bajo la OCLUSIÓN de la chapa del brazo de la grúa. */}
          {a4On && (
            <MediaCard
              src="broll/cmetemu/cmet_mv_pel4.mp4" kind="video"
              w={w4} h={h4} x={50} y={y4} z={0}
              ry={lerp(-5, 2, ez(g, 1180, 1460))} radius={16} startFrom={9}
              lit={0.9} litColor={cKey}
              label={g > 1240 ? "FUE A REPARAR EL APAGÓN" : undefined}
              sheenAt={at(1264)}
            />
          )}

          {/* ACTO 5 — LA CALLE A OSCURAS desde arriba del poste. Ya está montada detrás de la
              chapa antes de que la chapa cruce: la oclusión REVELA, no funde. */}
          {a5On && (
            <MediaCard
              src="img/cmetemu/cmet_mv_pel3.jpg" kind="photo"
              w={w5} h={h5} x={50} y={y5} z={0}
              ry={lerp(3, -1.5, ez(g, 1500, 1740))} rx={lerp(-2, 0.5, ez(g, 1500, 1740))}
              radius={16} lit={0.6} litColor={V.torch}
              sheenAt={at(1560)}
            />
          )}
        </Plane>

        {/* P5 · LA TRAYECTORIA DE LA CORRIENTE — la materia que cruza LAS CUATRO fronteras.
            Va DELANTE del material real (z 90): es la corriente marcada sobre la escena, y si
            quedara detrás de las placas a pantalla completa no se vería un solo cuadro. */}
        <Plane z={90}>
          <svg viewBox="0 0 1920 1080" style={{
            position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible",
          }}>
            {/* lo que todavía NO alcanzó: la ruta que la corriente va a hacer */}
            <path d={dCur} pathLength={1000} fill="none"
              stroke={rgba(V.white, 0.13)} strokeWidth={2.4}
              strokeDasharray="7 15" strokeLinecap="round" />
            {/* el halo del conductor caliente */}
            <path d={dCur} pathLength={1000} fill="none"
              stroke={rgba(curColor, 0.20)} strokeWidth={sw * 3.1} strokeLinecap="round"
              strokeDasharray={`${(1000 * reach).toFixed(1)} 1000`} />
            {/* el alma: el núcleo encendido */}
            <path d={dCur} pathLength={1000} fill="none"
              stroke={curColor} strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={`${(1000 * reach).toFixed(1)} 1000`}
              style={{ filter: `drop-shadow(0 0 ${Math.round(10 + sw)}px ${rgba(curColor, 0.85)})` }} />
            {/* LOS PULSOS: la corriente viajando. Nunca pasan de donde llegó el hilo. */}
            {[0, 1, 2].map((i) => {
              const ph = ((g / pulseSp) + i / 3) % 1;
              return (
                <path key={i} d={dCur} pathLength={1000} fill="none"
                  stroke={V.torch} strokeWidth={sw * 1.15} strokeLinecap="round"
                  strokeDasharray="52 948"
                  strokeDashoffset={-(1000 * reach * ph)}
                  opacity={(0.30 + 0.55 * Math.sin(ph * Math.PI)) * (0.35 + 0.65 * ez(g, 200, 320))}
                  style={{ filter: `drop-shadow(0 0 16px ${rgba(V.danger, 0.9)})` }} />
              );
            })}
            {/* LA PUNTA: cuando el hilo toca el cable que el operario tiene en la mano */}
            {llego > 0.01 && (
              <g opacity={llego}>
                <circle cx={tip[0]} cy={tip[1]} r={16 + 5 * Math.sin(g / 9)} fill="none"
                  stroke={V.danger} strokeWidth={4} />
                <circle cx={tip[0]} cy={tip[1]} r={22 + 44 * ripple}
                  fill="none" stroke={rgba(V.danger, 0.44 * (1 - ripple))} strokeWidth={3} />
                <circle cx={tip[0]} cy={tip[1]} r={7} fill={V.torch} />
              </g>
            )}
          </svg>
        </Plane>

        {/* P6 · íconos PNG sin fondo como objetos de la escena (una capa más, nunca el protagonista) */}
        <Plane z={150}>
          {g > 160 && g < 372 && (
            <div style={{ opacity: Math.min(ez(g, 160, 196), 1 - ez(g, 340, 372)) }}>
              <IconPng src="img/cmetemu/cmet_ic_advertencia.png" x={81} y={22} size={96} z={0} glow={V.ink0} />
            </div>
          )}
          {g > 470 && g < 726 && (
            <div style={{ opacity: Math.min(ez(g, 470, 508), 1 - ez(g, 694, 726)) }}>
              <IconPng src="img/cmetemu/cmet_ic_casa.png" x={18} y={24} size={92} z={0} glow={V.ink0} />
            </div>
          )}
          {g > 880 && g < 1096 && (
            <div style={{ opacity: Math.min(ez(g, 880, 916), 1 - ez(g, 1064, 1096)) }}>
              <IconPng src="img/cmetemu/cmet_ic_poste.png" x={82} y={26} size={88} z={0} glow={V.ink0} />
            </div>
          )}
        </Plane>

        {/* P7 · primer plano: el polvo del garaje primero, la humedad de la noche después
            (HOLD VIVO: nunca hay un cuadro perfectamente quieto) */}
        <Plane z={230}>
          {Array.from({ length: 18 }, (_, i) => {
            const sp = 0.4 + rnd(i * 4.7) * 1.2;
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 13;
            const s = 2 + rnd(i * 2.9) * 3.6;
            const c = i % 3 === 0 ? V.torch : curColor;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(6 + rnd(i * 6.1) * 88).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(c, 0.10 + rnd(i * 3.7) * 0.22),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(c, 0.20)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURAS (encima de todo, nunca un fade) ── */}
      {/* f1496 · frontera 4→5: la CHAPA del brazo de la grúa cruza y detrás ya está la calle */}
      <SeamOcclude at={at(SEAM_OCC)} dur={15} color={V.steel} angle={66} lit={0.3} />
      {/* NO es costura: es la LUZ DEL EVENTO — el instante en que la corriente toca ese cable */}
      <SeamFlash at={at(1318)} color={V.danger} dur={7} />

      {/* ── TIPOGRAFÍA: plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={150} outF={348} kick="NUNCA HAGAS ESTO"
          head="EL CABLE DE DOS MACHOS" size={68}
          sub="Se vende justo para eso." />
        <Titular g={g} inF={404} outF={726} kick="SI LO ENCHUFAS"
          head="A LA RED DE TU CASA"
          sub="Tu casa empieza a mandarle corriente a la calle." />
        <Titular g={g} inF={840} outF={1076} kick="LA ESQUINA"
          head="SUBE POR EL TRANSFORMADOR"
          sub="Y sale a los cables de tu cuadra." kickColor={V.torch} />
        <Titular g={g} inF={1256} outF={1462} kick="EL OPERARIO"
          head="EL QUE FUE A REPARAR EL APAGÓN" size={62}
          sub="Cortó la llave, midió, y para él ese cable está muerto." kickColor={V.torch} />
        <Titular g={g} inF={1552} outF={1698} kick="LA VERDAD"
          head="Y NO LO ESTÁ, POR TU CULPA" size={66}
          sub="Por eso el inversor nunca va a la pared." />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
