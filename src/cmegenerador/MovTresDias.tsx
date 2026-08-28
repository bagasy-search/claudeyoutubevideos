// MovTresDias.tsx — S9 · UN MOVIMIENTO CONTINUO de 52 s (1560 frames @30fps)
// «Tres días de apagón apretando dos palancas, y dos horas de ruido en vez de setenta y dos.»
//
// ES EL MOVIMIENTO DEL ALIVIO. Acá la noche es SILENCIOSA (batería: ni ruido ni humo) y por primera
// vez en el video AMANECE DE VERDAD. Todo el movimiento es UN SOLO GIRO DE LUZ, continuo: de la luz
// de taller (`bone`) sobre la placa del tablero, al azul frío de la noche (`sky`), al ÁMBAR del
// amanecer — y nunca salta, se gira. El remate es la vuelta de tuerca: el generador chico DOS HORAS
// al ochenta por ciento en vez de SETENTA Y DOS al siete.
//
// UNA sola atmósfera montada arriba de todo (nunca se remonta) · UNA sola cámara función de `gFrame`
// que jamás vuelve a 0 (cada acto hereda z, pan e inercia del anterior) · la luz EVOLUCIONA en un
// arco de tres temperaturas · y hay MATERIA QUE CRUZA cada frontera.
//
// ══════════════════════════════════════ TABLA DE HANDOFF ══════════════════════════════════════
// acto 1 · f0    ENTER  cám z≈+210 (cerrada sobre el tablero, heredada de `MovLlave`) · luz DE TALLER
//                       (`bone`, keyFrom .45, intensity .62, cerrada arriba-izquierda) · materia:
//                       LA PLACA METÁLICA DEL TABLERO, que entra encuadrada y sale de cuadro.
//                EXIT   cám z≈+90 abriendo, pan −160 / −62 (ya viajando hacia el patio) · luz `bone`
//                       virando a frío, el contra ámbar apagándose a VOLT · materia: LAS DOS LUCES
//                       DE LAS PALANCAS (una que bajó en volt, otra que subió en ámbar), encendidas
//                       y viajando.
//
// acto 2 · f352  ENTER  cám z≈+90, pan −160 / −62 (la MISMA inercia, sin corte de cámara) · luz frío
//                       de noche (`sky`) arriba, VOLT abajo = la pantalla de la batería es la única
//                       fuente · materia: LAS DOS LUCES, que aterrizan como LAS DOS VENTANAS
//                       ENCENDIDAS de la casa.
//                EXIT   cám z≈+180, pan −160 / −18 (empujando al patio) · luz `sky` empezando a
//                       calentar, el volt volviéndose ámbar · materia: LA TARJETA DEL GENERADOR
//                       CHICO, nacida como inset a f508 y ya creciendo.
//
// acto 3 · f766  ENTER  cám z≈+180, pan −160 / −18 · luz: EL GIRO — `sky`→`amber` arriba, `volt`→
//                       `amber` abajo, keyFrom subiendo a .80 · materia: LA MISMA TARJETA DEL
//                       GENERADOR, que cruza la niebla creciendo de 320 px a 1180 px (no hay corte:
//                       es el mismo objeto).
//                EXIT   cám z≈+250 (empujada por el zoom-through), pan −64 / −18 · luz ÁMBAR DEL
//                       AMANECER plena · materia: EL CABLE DE COBRE, que nace a f1108 colgando del
//                       generador y se va de cuadro por delante.
//
// acto 4 · f1200 ENTER  cám z≈+250 retrocediendo a ≈−90 (plano general del patio) · luz ámbar del
//                       amanecer, floor bajando (el suelo se aclara) · materia: EL CABLE DE COBRE,
//                       que es lo que TAPA la frontera y lo que baja al sótano a buscar la bomba.
//                EXIT   cám z≈−90 asentada, casi quieta (deriva viva) · luz ÁMBAR BAJO EN EL PATIO,
//                       niebla del amanecer VIVA y espesándose · materia: LA LUZ DEL AMANECER SOBRE
//                       EL PANEL (la tarjeta del tablero vuelve abajo-izquierda con el barrido ámbar
//                       cruzándola)  → así arranca `MovPeligro`, que convierte esa niebla en humo.
//
// ═══════════════════════════════════════ LAS COSTURAS ═════════════════════════════════════════
// f352  frontera 1→2 : MATCH-MOVE — la cámara NO corta: sigue su vector (pan −160 / −62, z −120) y
//                       la tarjeta del tablero escala a 1.8× barriendo el cuadro hacia la izquierda;
//                       cuando despeja, detrás ya está el patio de noche. Las dos luces de las
//                       palancas no se apagan nunca: se reencuadran como las dos ventanas.
// f762  frontera 2→3 : WIPE POR MATERIA — LA NIEBLA DEL AMANECER (`SeamWipeMatter` tint `torch`)
//                       cruza y detrás ya está el patio amaneciendo. Esa niebla NO se va más: es la
//                       materia que le entrego a `MovPeligro`.
// f986  costura INTERNA del acto 3 : ZOOM-THROUGH sobre el tablero del generador (fx 58 / fy 44) —
//                       cambia la ESCALA (plano de producto → macro de la carga) sin cortar.
// f1200 frontera 3→4 : OCLUSIÓN con `V.copper` — el CABLE GRUESO de cobre cruza y tapa el 100% seis
//                       frames. ⛔ el color es el de la materia (cobre), NUNCA el del fondo.
// f1368 costura INTERNA del acto 4 : MATCH-SHAPE — el mismo cable colgado se ESTIRA y ES el eje
//                       sobre el que se dibuja el pico de arranque de la bomba.
// (ninguna se repite en fronteras consecutivas · ninguna es un fade)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, DutyField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── utilidades locales (TODO función pura de gFrame · ⛔ nada de Math.random/Date) ───────────
const seg = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ez = (g: number, a: number, b: number) => eio(0, 1, seg(g, a, b));

// frames maestros
const F_A2 = 352;
const F_A3 = 766;
const F_A4 = 1200;
const SEAM_MOVE = 352;   // MATCH-MOVE      · frontera 1→2
const SEAM_WIPE = 762;   // WIPE POR MATERIA· frontera 2→3 (la niebla del amanecer)
const SEAM_ZOOM = 986;   // ZOOM-THROUGH    · interna del acto 3
const SEAM_OCC = 1200;   // OCLUSIÓN cobre  · frontera 3→4
const SEAM_SHAPE = 1368; // MATCH-SHAPE     · interna del acto 4 (cable → eje)

// ── LA NIEBLA — nace en la costura 2→3 y NO se va más (se la entrego a MovPeligro) ──────────
const Niebla: React.FC<{
  g: number; on: number; color: string; count?: number; band?: number; span?: number;
  speed?: number; scale?: number;
}> = ({ g, on, color, count = 12, band = 70, span = 20, speed = 1, scale = 1 }) => {
  if (on <= 0.004) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const o = rnd(i * 3.7);
        const sp = (0.09 + rnd(i * 8.1) * 0.15) * speed;
        const xx = ((o * 170 + g * sp) % 180) - 40;
        const yy = band + (rnd(i * 5.9) - 0.5) * span + Math.sin(g / (61 + i * 7)) * 1.6;
        const s = (340 + o * 360) * scale;
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
            width: s, height: s * 0.46, marginLeft: -s / 2, marginTop: -s * 0.23,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${rgba(color, (0.085 + o * 0.085) * on)} 0%, rgba(0,0,0,0) 74%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LA LUZ QUE VIAJA — es LUZ, no un objeto: la palanca encendida que se vuelve ventana ─────
const Luz: React.FC<{
  x: number; y: number; w: number; h: number; color: string; power: number; radius?: number;
}> = ({ x, y, w, h, color, power, radius = 7 }) => {
  if (power <= 0.005) return null;
  const p = clamp01(power);
  return (
    <div style={{
      position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: w * 4.2, height: h * 4.2, marginLeft: -w * 2.1, marginTop: -h * 2.1,
        borderRadius: "50%",
        background: `radial-gradient(closest-side, ${rgba(color, 0.32 * p)} 0%, rgba(0,0,0,0) 72%)`,
      }} />
      <div style={{
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: radius,
        background: `linear-gradient(180deg, ${rgba(color, 0.95 * p)} 0%, ${rgba(color, 0.58 * p)} 100%)`,
        boxShadow: `0 0 ${Math.round(30 + 74 * p)}px ${rgba(color, 0.58 * p)}, inset 0 1px 0 ${rgba(V.white, 0.55 * p)}`,
      }} />
    </div>
  );
};

// ── EL CABLE DE COBRE → EL EJE → EL PICO (MATCH-SHAPE del acto 4) ───────────────────────────
// El mismo trazo: colgado del generador (morph 0) y estirado como eje del gráfico (morph 1).
const CableEje: React.FC<{
  on: number; morph: number; reveal: number; color: string; axisColor: string;
}> = ({ on, morph, reveal, color, axisColor }) => {
  if (on <= 0.005) return null;
  const P = (a: number, b: number) => lerp(a, b, morph);
  const d =
    `M ${P(-90, 300).toFixed(1)} ${P(236, 780).toFixed(1)} ` +
    `C ${P(330, 760).toFixed(1)} ${P(930, 780).toFixed(1)}, ` +
    `${P(1310, 1240).toFixed(1)} ${P(968, 780).toFixed(1)}, ` +
    `${P(2010, 1700).toFixed(1)} ${P(448, 780).toFixed(1)}`;
  const dash = 2600 * clamp01(reveal);
  const pico = "M 300 780 L 826 780 L 866 292 L 912 686 L 1700 686";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: clamp01(on) }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="cmeTdiaCobre" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rgba(color, 0.30)} />
            <stop offset="44%" stopColor={color} />
            <stop offset="100%" stopColor={rgba(color, 0.42)} />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#cmeTdiaCobre)" strokeLinecap="round"
          strokeWidth={lerp(30, 7, morph)} opacity={lerp(1, 0.9, morph)} />
        <path d={d} fill="none" stroke={rgba(V.white, lerp(0.22, 0.07, morph))} strokeLinecap="round"
          strokeWidth={lerp(6, 2, morph)} />
        {dash > 1 && (
          <g>
            <path d={pico} fill="none" stroke={rgba(axisColor, 0.26)} strokeWidth={24}
              strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${dash.toFixed(1)} 4000`} />
            <path d={pico} fill="none" stroke={axisColor} strokeWidth={7}
              strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${dash.toFixed(1)} 4000`} />
          </g>
        )}
        {dash > 1180 && <circle cx={866} cy={292} r={13} fill={axisColor} opacity={0.92} />}
      </svg>
    </AbsoluteFill>
  );
};

// ── TITULAR: UNA idea de texto por acto, sobre cama oscura, fuera de la perspectiva ─────────
const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: React.ReactNode;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 72, kickColor = V.volt }) => {
  const a = Math.min(ez(g, inF, inF + 16), 1 - ez(g, outF, outF + 18));
  if (a <= 0.002) return null;
  const dy = (1 - ez(g, inF, inF + 24)) * 26;
  return (
    <div style={{
      position: "absolute", left: 62, bottom: 66, maxWidth: 1040,
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
export const MovTresDias: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const frame = useCurrentFrame();
  // `acto` lo manda el build: red de seguridad si `gFrame` llegara sin arrancar.
  const gRaw = Math.max(0, gFrame);
  const INI = [0, 0, F_A2, F_A3, F_A4];
  const g = gRaw > 0 ? gRaw : INI[Math.min(Math.max(Math.round(acto), 1), 4)];
  // los helpers del Stage (`Readout`, `SeamOcclude`, `SeamWipeMatter`, `SeamFlash`, `sheenAt`) miden
  // con useCurrentFrame; `at()` los ancla EXACTAMENTE a MI frame global.
  const off = frame - g;
  const at = (f: number) => f + off;

  // ── LA CÁMARA: UNA sola, acumulativa, función de g. Ningún acto la reinicia ────────────────
  const base = gcam(g, { z0: 210, z1: -140, panX: 150, panY: -70, ry: 9, rx: -2.6, dur: 1500 });
  const zAcc =
    eio(0, -120, seg(g, 330, 440)) +            // 1→2 · la cámara se abre del tablero al patio
    eio(0, 90, seg(g, 700, 820)) +              // 2→3 · empuja al generador en el patio
    eio(0, 260, seg(g, SEAM_ZOOM, 1052)) +      // el zoom-through entra en el tablero del generador
    eio(0, -230, seg(g, 1196, 1344)) +          // sale del macro tras la oclusión de cobre
    eio(0, -110, seg(g, 1396, 1548));           // asienta el plano general del patio al amanecer
  const pxAcc =
    eio(0, -160, seg(g, 336, 452)) +
    eio(0, 96, seg(g, SEAM_ZOOM, 1064)) +
    eio(0, -84, seg(g, 1200, 1356));
  const pyAcc =
    eio(0, -62, seg(g, 336, 452)) +
    eio(0, 44, seg(g, 756, 884)) +
    eio(0, -34, seg(g, 1396, 1544));
  const cam = `${base.transform} translate3d(${pxAcc.toFixed(2)}px, ${pyAcc.toFixed(2)}px, ${zAcc.toFixed(2)}px)`;

  // ── LA LUZ: UN SOLO GIRO CONTINUO. taller(bone) → noche(sky) → AMANECER(amber) ─────────────
  // Los dos tramos empalman EXACTO (en g=560 y g=700 ambos devuelven el mismo color): se gira, no salta.
  const cKey = g < 560
    ? light(seg(g, 40, 430), "bone", "sky")
    : light(seg(g, 600, 940), "sky", "amber");
  const cWarm = g < 700
    ? light(seg(g, 120, 430), "amber", "volt")   // de noche la única fuente es la pantalla de la batería
    : light(seg(g, 700, 1010), "volt", "amber"); // y al amanecer vuelve a ser el sol
  const keyFrom = 0.45 + eio(0, -0.16, seg(g, 60, 360)) + eio(0, 0.51, seg(g, 760, 1200));
  const intensity = 0.62 + eio(0, -0.15, seg(g, 80, 420)) + eio(0, 0.46, seg(g, 780, 1240))
    + eio(0, -0.05, seg(g, 1470, 1560));
  const floorV = 0.62 + eio(0, -0.20, seg(g, 800, 1320));

  // ── LA NIEBLA DEL AMANECER: nace en la costura 2→3 y se espesa hasta el final ──────────────
  const nieblaOn = ez(g, 752, 838) * (0.85 + 0.38 * ez(g, 1390, 1556));

  // ── ACTO 1 · el tablero, la placa, las dos palancas ───────────────────────────────────────
  const a1On = g < 460;
  const a1Op = 1 - ez(g, 428, 458);
  const a1Push = ez(g, SEAM_MOVE - 22, SEAM_MOVE + 90);   // el barrido del MATCH-MOVE
  const a1TX = lerp(0, -46, a1Push);
  const a1S = lerp(1, 1.82, a1Push);
  const heroW1 = Math.round(lerp(1330, 1150, ez(g, 24, 320)));
  const heroH1 = Math.round(heroW1 * 0.5625);
  const heroOp1 = 0.58 + 0.42 * ez(g, 0, 12);
  // la PLACA METÁLICA que viene de `MovLlave`: entra encuadrada y sale de cuadro en 70 frames
  const placaOp = 1 - ez(g, 18, 88);
  const placaX = lerp(50, 14, ez(g, 10, 92));

  // las DOS PALANCAS: una BAJA (y se pone volt = la batería entra), la otra SUBE (ámbar = la casa)
  const lvT = ez(g, 336, 476);                            // el viaje palanca → ventana
  const lxA = lerp(43.4, 39.6, lvT), lyA = lerp(45.6, 40.4, lvT);
  const lxB = lerp(56.6, 54.4, lvT), lyB = lerp(45.6, 40.4, lvT);
  const lwA = lerp(80, 116, lvT), lhA = lerp(146, 92, lvT);
  const dipA = 1 - 0.86 * Math.sin(Math.PI * seg(g, 104, 134));
  const dipB = 1 - 0.86 * Math.sin(Math.PI * seg(g, 144, 176));
  const dyA = eio(0, 27, seg(g, 104, 136));               // la que BAJA
  const dyB = eio(0, -27, seg(g, 144, 178));              // la que SUBE
  const cLuzA = light(clamp01(seg(g, 112, 152) - seg(g, 380, 476)), "amber", "volt");
  const luzVive = ez(g, 8, 34) * (1 - 0.52 * ez(g, 476, 640)) * (1 - ez(g, 646, 726));
  const powA = (0.88 + 0.10 * Math.sin(g / 21)) * dipA * luzVive;
  const powB = (0.10 + eio(0, 0.86, seg(g, 146, 182))) * dipB * luzVive;

  // ── ACTO 2 · el patio de noche, la casa en silencio, la batería ───────────────────────────
  const a2On = g >= F_A2 - 30 && g < 816;
  const a2Op = ez(g, 336, 392) * (1 - ez(g, 780, 816));
  const heroW2 = Math.round(lerp(1210, 1040, ez(g, 392, 640)));
  const heroH2 = Math.round(heroW2 * 0.5625);
  const heroX2 = lerp(57, 50, ez(g, 336, 486));
  const batOp = ez(g, 434, 486) * (1 - ez(g, 736, 782));

  // ── LA TARJETA DEL GENERADOR: nace de inset en el acto 2 y CRUZA la niebla creciendo ──────
  const genOn = g >= 500 && g < SEAM_ZOOM + 24;
  const genOp = ez(g, 504, 552) * (1 - ez(g, SEAM_ZOOM + 4, SEAM_ZOOM + 22));
  const gmT = ez(g, 744, 892);                            // el crecimiento a través del wipe
  const genW = Math.round(lerp(320, 1170, gmT));
  const genH = Math.round(genW * 0.5625);
  const genX = lerp(22.5, 50, gmT);
  const genY = lerp(70, 45, gmT);
  const zt = zoomThrough(g, SEAM_ZOOM, 20, 58, 44);

  // ── ACTO 3 (segunda mitad) · el MACRO de la carga + la comparación de ciclos ──────────────
  const a3bOn = g >= SEAM_ZOOM + 10 && g < SEAM_OCC + 10;
  const a3bOp = ez(g, 998, 1022) * (1 - ez(g, SEAM_OCC + 2, SEAM_OCC + 9));
  const a3bS = lerp(2.35, 1, ez(g, 998, 1078));
  const sT = ez(g, 1062, 1140);
  const macW = Math.round(lerp(1170, 620, sT));
  const macH = Math.round(macW * 0.5625);
  const macX = lerp(50, 70, sT);
  const macY = lerp(42, 29, sT);
  const tirasOn = ez(g, 1078, 1128) * (1 - ez(g, 1186, 1204));

  // ── ACTO 4 · el cable de cobre baja al sótano y la bomba arranca ──────────────────────────
  const a4On = g >= SEAM_OCC - 6;
  const a4Op = ez(g, SEAM_OCC - 2, SEAM_OCC + 26);
  const shape = ez(g, SEAM_SHAPE, 1474);                  // MATCH-SHAPE: cable → eje
  const bombW = Math.round(lerp(1080, 560, shape));
  const bombH = Math.round(bombW * 0.5625);
  const bombX = lerp(50, 74, shape);
  const bombY = lerp(44, 24, shape);
  const cableOn = ez(g, 1108, 1174) * (1 - 0.45 * ez(g, 1504, 1560));
  const picoRev = ez(g, 1496, 1556);
  const arranque = Math.sin(Math.PI * seg(g, 1498, 1536)); // el temblor del arranque
  const panelOp = ez(g, 1484, 1522);                       // LA LUZ DEL AMANECER SOBRE EL PANEL

  // ── planos de fondo: se cambian EXACTAMENTE bajo las costuras (nunca a la vista) ───────────
  const d1 = (0.42 + 0.58 * ez(g, 0, 12)) * (1 - ez(g, 344, 388));
  const d2 = ez(g, 342, 386) * (1 - ez(g, SEAM_WIPE + 2, SEAM_WIPE + 18));
  const d3 = ez(g, SEAM_WIPE + 4, SEAM_WIPE + 17);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA sola vez y NUNCA se remonta entre actos ── */}
      <VoltAtmos tint={cKey} tint2={cWarm} keyFrom={keyFrom} intensity={intensity} floor={floorV} />

      <Layers cam={cam}>
        {/* P1 · FONDO PROFUNDO — siempre hay imagen, desde el frame 0 */}
        <AbsoluteFill style={{ opacity: clamp01(d1) }}>
          <PhotoPlane src="img/cmegenerador/cmeg_mv_tdia1.png" kind="photo"
            z={-700} scale={1.34} dim={lerp(0.60, 0.80, ez(g, 20, 340))} tint={cKey} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: clamp01(d2) }}>
          <PhotoPlane src="img/cmegenerador/cmeg_mv_tdia2.png" kind="photo"
            z={-700} scale={1.28} dim={lerp(0.72, 0.84, ez(g, 386, 748))} tint={cWarm} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: clamp01(d3) }}>
          <PhotoPlane src="img/cmegenerador/cmeg_mv_tdia3.png" kind="photo"
            z={-700} scale={1.22} dim={lerp(0.80, 0.50, ez(g, 790, 1430))} tint={cKey} />
        </AbsoluteFill>

        {/* P2 · LA NIEBLA LEJANA — nace en la costura 2→3 y sobrevive hasta el final */}
        <Plane z={-520}>
          <Niebla g={g} on={nieblaOn} color={V.torch} count={11} band={64} span={26} speed={1} scale={1.15} />
        </Plane>

        {/* P3 · EL SUELO DEL PATIO + LAS DOS LUCES que cruzan la frontera 1→2 */}
        <Plane z={-360}>
          <PadPlane y={80} w={1520} h={340} rx={63}
            lit={0.34 + 0.66 * ez(g, 780, 1330)} z={-60} />
        </Plane>

        {/* P4 · MATERIAL SECUNDARIO — la batería, el macro, las tiras del ciclo */}
        <Plane z={-180}>
          {/* la batería: el mismo material a otra ESCALA (macro dentro de vidrio) */}
          {batOp > 0.01 && (
            <div style={{ opacity: batOp }}>
              <MediaCard
                src="img/cmegenerador/cmeg_mv_tdia2.png" kind="photo"
                w={430} h={250} x={79} y={69} z={0} ry={-9} rx={2} radius={13}
                lit={0.96} litColor={V.volt} label="BATERÍA · TODA LA NOCHE"
                sheenAt={at(462)}
              />
            </div>
          )}

          {/* EL MACRO DE LA CARGA — salimos acá del zoom-through, misma materia a otra escala */}
          {a3bOn && (
            <AbsoluteFill style={{
              opacity: a3bOp,
              transform: `scale(${a3bS.toFixed(3)})`, transformOrigin: "58% 44%",
            }}>
              <MediaCard
                src="img/cmegenerador/cmeg_mv_tdia3.png" kind="photo"
                w={macW} h={macH} x={macX} y={macY} z={0}
                ry={lerp(0, 7, sT)} rx={lerp(0, 2, sT)} radius={15}
                lit={0.98} litColor={cKey}
                label={sT > 0.55 ? "OCHENTA POR CIENTO" : "EL GENERADOR CHICO, CARGANDO"}
                sheenAt={at(1014)}
              />
            </AbsoluteFill>
          )}

          {/* LA COMPARACIÓN DE CICLOS — la firma del video: 24 de 24 contra 2 de 24 */}
          {tirasOn > 0.01 && (
            <AbsoluteFill style={{ opacity: tirasOn }}>
              <div style={{
                position: "absolute", left: 462, top: 570,
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.2,
                color: rgba(V.steel, 0.92), textTransform: "uppercase",
                textShadow: "0 4px 18px rgba(0,0,0,0.92)",
              }}>SETENTA Y DOS HORAS AL 7%</div>
              <DutyField duty={1} cells={24} on={1} tint={V.steel} y={58} w={1000} h={26} cycle={260} />
              <div style={{
                position: "absolute", left: 462, top: 656,
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 3.2,
                color: rgba(V.volt, 0.95), textTransform: "uppercase",
                textShadow: "0 4px 18px rgba(0,0,0,0.92)",
              }}>DOS HORAS AL 80%</div>
              <DutyField duty={2 / 24} cells={24} on={1} tint={V.volt} y={66} w={1000} h={26} cycle={260} />
            </AbsoluteFill>
          )}
        </Plane>

        {/* P5 · LAS TARJETAS HÉROE — una por acto, siempre MATERIAL REAL dentro de vidrio */}
        <Plane z={-20}>
          {/* ACTO 1 · el tablero. Al final ESCALA y barre el cuadro: es su propio ocluyente */}
          {a1On && (
            <AbsoluteFill style={{
              opacity: a1Op,
              transform: `translateX(${a1TX.toFixed(2)}%) scale(${a1S.toFixed(3)})`,
              transformOrigin: "22% 46%",
            }}>
              <div style={{ opacity: heroOp1 }}>
                <MediaCard
                  src="broll/cmegenerador/cmeg_mv_tdia1.mp4" kind="video"
                  w={heroW1} h={heroH1} x={50} y={46} z={0}
                  ry={lerp(-6, 0, ez(g, 10, 190))} rx={1.4} radius={16} startFrom={4}
                  lit={0.92} litColor={cKey} label="EL TABLERO · LAS DOS PALANCAS"
                  sheenAt={at(64)}
                />
              </div>
              {/* la PLACA METÁLICA que viene de `MovLlave`: sale de cuadro y le pasa la escena */}
              {placaOp > 0.01 && (
                <div style={{
                  position: "absolute", left: `${placaX.toFixed(2)}%`, top: "46%",
                  width: 300, height: 430, marginLeft: -150, marginTop: -215,
                  opacity: placaOp, borderRadius: 6,
                  background: `linear-gradient(126deg, ${rgba(V.steel, 0.62)} 0%, ${rgba(V.steel, 0.24)} 46%, ${rgba(V.ink1, 0.88)} 100%)`,
                  boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.42)}, 0 26px 60px ${rgba(V.ink0, 0.8)}`,
                  transform: "rotateY(16deg)",
                }} />
              )}
            </AbsoluteFill>
          )}

          {/* ACTO 2 · el patio de noche. La cámara lo revela: no aparece, se despeja */}
          {a2On && (
            <div style={{ opacity: a2Op }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_tdia2.mp4" kind="video"
                w={heroW2} h={heroH2} x={heroX2} y={45} z={0}
                ry={lerp(7, 0, ez(g, 336, 520))} rx={1.2} radius={16} startFrom={6}
                lit={0.95} litColor={cWarm} label="LA CASA DE NOCHE · SIN RUIDO"
                sheenAt={at(408)}
              />
            </div>
          )}

          {/* LA TARJETA DEL GENERADOR — nace inset a f508 y CRUZA la niebla creciendo */}
          {genOn && (
            <AbsoluteFill style={{
              opacity: genOp,
              transform: zt.out === "none" ? undefined : zt.out,
              transformOrigin: "58% 44%",
            }}>
              <div style={{ opacity: clamp01(zt.opacity) }}>
                <MediaCard
                  src="broll/cmegenerador/cmeg_mv_tdia3.mp4" kind="video"
                  w={genW} h={genH} x={genX} y={genY} z={0}
                  ry={lerp(-11, 0, gmT)} rx={lerp(3, 1, gmT)} radius={14} startFrom={5}
                  lit={0.6 + 0.4 * gmT} litColor={cWarm}
                  label={gmT > 0.5 ? "DOS HORAS Y LO APAGÁS" : "EL GENERADOR CHICO"}
                  sheenAt={at(788)}
                />
              </div>
            </AbsoluteFill>
          )}

          {/* ACTO 4 · la bomba de pozo. Nace bajo la oclusión de cobre */}
          {a4On && (
            <div style={{ opacity: a4Op }}>
              <MediaCard
                src="broll/cmegenerador/cmeg_mv_tdia4.mp4" kind="video"
                w={bombW} h={bombH}
                x={bombX + (rnd(Math.floor(g / 2) * 3.1) - 0.5) * 0.5 * arranque}
                y={bombY} z={0}
                ry={lerp(-4, 8, shape)} rx={lerp(1, 2.4, shape)} radius={15} startFrom={4}
                lit={0.94 + 0.06 * arranque} litColor={cKey}
                label={shape > 0.55 ? "2.300 W DE ARRANQUE" : "LA BOMBA DE POZO"}
                sheenAt={at(1226)}
              />
            </div>
          )}

          {/* EL CIERRE · LA LUZ DEL AMANECER SOBRE EL PANEL (materia que le paso a MovPeligro) */}
          {panelOp > 0.01 && (
            <div style={{ opacity: panelOp }}>
              <MediaCard
                src="img/cmegenerador/cmeg_mv_tdia1.png" kind="photo"
                w={380} h={214} x={21} y={84} z={0} ry={11} rx={-2} radius={13}
                lit={0.99} litColor={V.amber} label="EL TABLERO, AL AMANECER"
                sheenAt={at(1516)}
              />
            </div>
          )}
        </Plane>

        {/* P5b · LAS DOS LUCES — la MATERIA que cruza la frontera 1→2. Van DELANTE de las
            tarjetas: son luz, no objeto, y tienen que verse encima del vidrio */}
        <Plane z={40}>
          <Luz x={lxA} y={lyA + dyA / 12} w={lwA} h={lhA} color={cLuzA} power={powA} radius={lerp(6, 10, lvT)} />
          <Luz x={lxB} y={lyB + dyB / 12} w={lwA} h={lhA} color={V.amber} power={powB} radius={lerp(6, 10, lvT)} />
        </Plane>

        {/* P6 · PRIMER PLANO — el cable de cobre, la niebla cercana */}
        <Plane z={150}>
          <CableEje on={cableOn} morph={shape} reveal={picoRev} color={V.copper} axisColor={V.volt} />
          <Niebla g={g} on={nieblaOn * 0.85} color={V.torch} count={7} band={88} span={14} speed={1.7} scale={1.8} />
        </Plane>

        {/* P7 · POLVO EN SUSPENSIÓN (hold VIVO: nunca hay un frame quieto) */}
        <Plane z={280}>
          {Array.from({ length: 16 }, (_, i) => {
            const sp = 0.35 + rnd(i * 4.7) * 1.05;
            const yy = ((rnd(i * 8.3) * 132 - (g * sp) / 24) % 132 + 132) % 132 - 14;
            const s = 2 + rnd(i * 2.9) * 3.2;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(7 + rnd(i * 6.1) * 86).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(cKey, (0.09 + rnd(i * 3.7) * 0.2) * intensity),
                boxShadow: `0 0 ${Math.round(6 + s * 3)}px ${rgba(cKey, 0.2 * intensity)}`,
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── LAS COSTURAS · encima de todo · ⛔ ninguna es un fade ── */}
      {/* f762 · frontera 2→3 · WIPE POR MATERIA: LA NIEBLA DEL AMANECER cruza */}
      <SeamWipeMatter at={at(SEAM_WIPE)} dur={28} tint={V.torch} />
      {/* f1200 · frontera 3→4 · OCLUSIÓN: el CABLE DE COBRE tapa el 100%. Color = la MATERIA */}
      <SeamOcclude at={at(SEAM_OCC)} dur={14} color={V.copper} angle={-9} />
      {/* el fogonazo del arranque de la bomba: NO es costura, es la luz del evento */}
      <SeamFlash at={at(1502)} color={V.amber} dur={7} />

      {/* ── TIPOGRAFÍA Y CIFRAS · plano plano, fuera de la perspectiva, safe area 60 px ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Titular g={g} inF={44} outF={292} kick="EL TABLERO" head="TRES DÍAS, DOS PALANCAS"
          sub="Bajás una, subís la otra, y la casa sigue viva." kickColor={V.bone} />
        <Titular g={g} inF={386} outF={700} kick="LA NOCHE" head="SIN RUIDO Y SIN HUMO"
          sub="La batería sostiene la casa en silencio." kickColor={V.volt} />
        <Titular g={g} inF={806} outF={1046} kick="LA VUELTA DE TUERCA"
          head="DOS HORAS EN VEZ DE SETENTA Y DOS" size={58}
          sub={<>No toda la noche al <Em color={V.steel}>siete por ciento</Em>.</>} kickColor={V.amber} />
        <Titular g={g} inF={1246} outF={1470} kick="LO QUE QUEDÓ PENDIENTE"
          head="LA BOMBA TAMBIÉN ENTRA"
          sub={<>Dos mil trescientos vatios de <Em color={V.amber}>arranque</Em>.</>} kickColor={V.amber} />

        {/* las cifras: aparecen con el dato hablado y se van con él */}
        <AbsoluteFill style={{ opacity: ez(g, 112, 130) * (1 - ez(g, 300, 336)) }}>
          <Readout value="3" unit="DÍAS" label="SIN LUZ" at={at(118)} x={79} y={24} size={132} color={V.volt} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ez(g, 408, 428) * (1 - ez(g, 640, 680)) }}>
          <Readout value="1,5" unit="kW" label="EL SOL, AL OTRO DÍA" at={at(414)} x={25} y={25} size={128} color={V.amber} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ez(g, 842, 866) * (1 - ez(g, 962, 992)) }}>
          <Readout value="7" unit="%" label="TODA LA NOCHE ASÍ" at={at(848)} x={24} y={25} size={130} color={V.steel} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ez(g, 1014, 1036) * (1 - ez(g, 1176, 1198)) }}>
          <Readout value="80" unit="%" label="DOS HORAS ASÍ" at={at(1020)} x={26} y={26} size={150} color={V.volt} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ez(g, 1510, 1530) }}>
          <Readout value="2.300" unit="W" label="ARRANQUE DE LA BOMBA" at={at(1516)} x={27} y={30} size={126} color={V.amber} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── ÍCONOS PNG SIN FONDO como objetos de la escena (uno o dos por acto) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ opacity: ez(g, 64, 104) * (1 - ez(g, 288, 330)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_breaker.png" x={79} y={54} size={104} z={0} rot={-5} glow={V.ink0} />
        </div>
        <div style={{ opacity: ez(g, 452, 496) * (1 - ez(g, 712, 754)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_bateria.png" x={16} y={62} size={112} z={0} rot={4} glow={V.ink0} />
        </div>
        <div style={{ opacity: ez(g, 800, 852) * (1 - ez(g, 960, 996)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_sol.png" x={84} y={22} size={116} z={0} rot={0} glow={V.ink0} />
        </div>
        <div style={{ opacity: ez(g, 866, 910) * (1 - ez(g, 968, 1000)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_reloj.png" x={17} y={58} size={100} z={0} rot={-6} glow={V.ink0} />
        </div>
        <div style={{ opacity: ez(g, 1404, 1442) * (1 - ez(g, 1490, 1522)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_moneda.png" x={17} y={50} size={98} z={0} rot={-7} glow={V.ink0} />
        </div>
        <div style={{ opacity: ez(g, 1428, 1466) * (1 - ez(g, 1490, 1522)) }}>
          <IconPng src="img/cmegenerador/cmeg_ic_casa.png" x={31} y={54} size={106} z={0} rot={5} glow={V.ink0} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
