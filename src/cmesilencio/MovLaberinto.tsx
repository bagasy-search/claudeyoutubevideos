// MovLaberinto.tsx — S9 · 68,1 s (2042 frames @30) · arranca en el segundo 670,42 del video.
//
// ES EL CORAZÓN DEL VIDEO. Todo lo anterior compra materiales; acá se entiende POR QUÉ funcionan.
//
// ESPINA: la solución no es achicar el agujero — es que el aire TENGA QUE DOBLAR. El sonido viaja
// derecho como la luz; con dos curvas forradas de lana el aire dobla y el sonido choca y se queda.
// Entrada abajo, salida arriba y en diagonal, para que el aire cruce todo el motor. Y el tramo
// forrado tiene que medir TRES VECES el ancho del conducto.
//
// IDEA RECTORA: hay UNA RUTA —la del aire— y es la MISMA línea en los seis actos. Nace como camino
// de anillos sobre la caja cenital, se calca del generador de $900 al contrachapado de Claudio, se
// convierte en el túnel por el que VIAJA LA CÁMARA, se abre en el corte de perfil, se ilumina en
// verde-voltio de punta a punta y termina dibujada a tinta sobre el papel de la lámina. La cámara
// entra con el aire y sale con el aire: nunca vuelve a mirar la caja desde afuera.
//
// ENTREGA: entra en PLANO CENITAL de la caja abierta con luz de tarde gris azulada, y SALE sobre el
// PAPEL de la lámina con luz `paper` cálida llenando el encuadre — el aire que veníamos siguiendo
// sale del conducto y levanta la esquina de la hoja. La sección siguiente (la página de la guía a
// pantalla completa) lo recoge sin cortar: el último cuadro ya es su fondo.
//
// CONTRATO: una sola <Sequence> (actos por rango de `g`, pisados 20-30 cuadros) · cero
// Math.random/Date · rutas de asset literales · `light()` sólo con claves de `V` · el `off`
// reconstruye el ancla absoluta de los helpers del Stage que leen useCurrentFrame().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, WhiteRoom, SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

// ── utilidades locales ───────────────────────────────────────────────────────────────────────
const EZ = Easing.bezier(0.32, 0.68, 0.28, 1);
const ip = (g: number, ks: number[], vs: number[], ez: (n: number) => number = EZ) =>
  interpolate(g, ks, vs, { easing: ez, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const TOTAL = 2042;

/** LA RUTA DEL AIRE — la misma línea en los seis actos.
 *  Entra horizontal abajo a la izquierda · DOBLA · cruza el motor en diagonal · DOBLA · sale
 *  horizontal arriba a la derecha. Dos curvas: ni una más. */
const RUTA = "M 200 906 L 420 906 Q 530 906 585 812 L 1215 452 Q 1280 414 1372 414 L 1700 414";
/** Los dos tramos FORRADOS DE LANA: exactamente las dos curvas. */
const LANA_A = "M 452 906 Q 545 906 592 826";
const LANA_B = "M 1238 438 Q 1288 414 1382 414";
/** El contraejemplo: entrada y salida por el MISMO rincón — el aire se apelotona. */
const RINCON = "M 200 906 L 404 906 Q 470 906 470 856 Q 470 812 410 812 L 214 812";

const OCRE = "#D6A63C";     // lana mineral amarillo-ocre (materia, no clave de light())

// ── EL DIAGRAMA DE LA RUTA ───────────────────────────────────────────────────────────────────
/** Una sola pieza dibuja la ruta en TODOS sus estados: lámina galvanizada, lana pegada en las
 *  curvas, tinta fina sobre papel, y el barrido verde-voltio que la recorre de punta a punta. */
const Diagrama: React.FC<{
  dib: number; lana: number; barrido: number; tinta?: number; op?: number; grosor?: number;
}> = ({ dib, lana, barrido, tinta = 0, op = 1, grosor = 1 }) => {
  if (op <= 0.01) return null;
  const metal = lerp(26, 9, tinta) * grosor;
  const colMetal = `rgb(${Math.round(lerp(154, 44, tinta))},${Math.round(lerp(160, 40, tinta))},${Math.round(lerp(166, 36, tinta))})`;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {/* la sombra de la lámina sobre la madera: el conducto tiene cuerpo, no es una línea */}
        <path d={RUTA} pathLength={1000} fill="none" stroke={rgba(V.ink0, 0.5 * (1 - tinta * 0.6))}
          strokeWidth={metal + 12} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="1000" strokeDashoffset={1000 * (1 - clamp01(dib))} />
        {/* LA LÁMINA GALVANIZADA */}
        <path d={RUTA} pathLength={1000} fill="none" stroke={colMetal}
          strokeWidth={metal} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="1000" strokeDashoffset={1000 * (1 - clamp01(dib))} />
        {/* el canto iluminado de la chapa */}
        <path d={RUTA} pathLength={1000} fill="none" stroke={rgba(V.white, 0.34 * (1 - tinta))}
          strokeWidth={Math.max(1, metal * 0.16)} strokeLinecap="round"
          strokeDasharray="1000" strokeDashoffset={1000 * (1 - clamp01(dib))} />
        {/* LA LANA pegada a la cara interna de las DOS curvas, fibra por fibra */}
        {[LANA_A, LANA_B].map((d, i) => (
          <g key={i}>
            <path d={d} pathLength={1000} fill="none" stroke={rgba(OCRE, 0.85 * clamp01(lana))}
              strokeWidth={metal * 0.62} strokeLinecap="round"
              strokeDasharray="1000" strokeDashoffset={1000 * (1 - clamp01(lana))} />
            <path d={d} pathLength={1000} fill="none" stroke={rgba(V.copper, 0.6 * clamp01(lana))}
              strokeWidth={metal * 0.62} strokeLinecap="round"
              strokeDasharray="7 9" strokeDashoffset={1000 * (1 - clamp01(lana))} />
          </g>
        ))}
        {/* EL BARRIDO VERDE-VOLTIO: la diagonal completa, de punta a punta */}
        {barrido > 0.001 && (
          <path d={RUTA} pathLength={1000} fill="none" stroke={rgba(V.volt, 0.95)}
            strokeWidth={metal * 0.34} strokeLinecap="round"
            strokeDasharray="150 1000" strokeDashoffset={1000 - 1150 * clamp01(barrido)}
            style={{ filter: `drop-shadow(0 0 18px ${rgba(V.volt, 0.7)})` }} />
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ── LA HEBRA DE AIRE — el hilo blanco que la cámara sigue todo el movimiento ─────────────────
const Hebra: React.FC<{ g: number; op: number; d?: string; ancho?: number; vel?: number }> = ({
  g, op, d = RUTA, ancho = 5, vel = 1,
}) => {
  if (op <= 0.01) return null;
  const corre = ((g * 1.4 * vel) % 240) / 240;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d={d} pathLength={1000} fill="none" stroke={rgba(V.torch, 0.5)}
          strokeWidth={ancho} strokeLinecap="round"
          strokeDasharray="44 116" strokeDashoffset={-corre * 160}
          style={{ filter: "drop-shadow(0 0 14px rgba(255,244,214,0.55))" }} />
        <path d={d} pathLength={1000} fill="none" stroke={rgba(V.white, 0.85)}
          strokeWidth={Math.max(1, ancho * 0.34)} strokeLinecap="round"
          strokeDasharray="18 142" strokeDashoffset={-corre * 160} />
      </svg>
    </AbsoluteFill>
  );
};

// ── EL SONIDO QUE SE QUEDA — los anillos entran a la curva y NO salen ───────────────────────
const Choque: React.FC<{ g: number; cx: number; cy: number; t0: number; op: number; per?: number }> = ({
  g, cx, cy, t0, op, per = 46,
}) => {
  if (op <= 0.01 || g < t0) return null;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {Array.from({ length: 4 }, (_, i) => {
          const t = (((g - t0) / per + i * 0.25) % 1);
          // el anillo llega, se aplasta contra la fibra y se apaga: nunca sale del otro lado
          const r = lerp(150, 16, t);
          const a = Math.sin(t * Math.PI) * (1 - t * 0.6);
          if (a <= 0.02) return null;
          return (
            <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * lerp(1, 0.34, t)}
              fill="none" stroke={rgba(V.volt, a * 0.62)} strokeWidth={1 + a * 3.4} />
          );
        })}
        {/* la mancha de sonido MUERTO acumulada en la fibra */}
        <ellipse cx={cx} cy={cy} rx={62} ry={44} fill={rgba(OCRE, 0.16)} />
      </svg>
    </AbsoluteFill>
  );
};

// ── EL TÚNEL — la cámara viaja ADENTRO del conducto, con la lana rozando a los dos costados ──
const Tunel: React.FC<{
  g: number; op: number; ancho: number; fx: number; fy: number;
  lana: number; giro: number; papel?: number;
}> = ({ g, op, ancho, fx, fy, lana, giro, papel = 0 }) => {
  if (op <= 0.01) return null;
  const VX = fx * 19.2, VY = fy * 10.8;
  const hw = ancho * 9.6;                 // media boca en px de viewBox
  // la chapa se vuelve PAPEL en el aterrizaje: mismo túnel, otra materia
  const met = (a: number) =>
    `rgb(${Math.round(lerp(120, 232, papel) * a)},${Math.round(lerp(126, 226, papel) * a)},${Math.round(lerp(132, 210, papel) * a)})`;
  const lanaCol = rgba(papel > 0.5 ? V.paper : OCRE, (0.2 + 0.6 * lana) * (1 - papel * 0.55));
  const ribs = 15;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `rotate(${giro.toFixed(2)}deg)`, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lb_izq" x1="0" x2="1">
            <stop offset="0%" stopColor={met(0.34)} />
            <stop offset="100%" stopColor={met(0.86)} />
          </linearGradient>
          <linearGradient id="lb_der" x1="1" x2="0">
            <stop offset="0%" stopColor={met(0.3)} />
            <stop offset="100%" stopColor={met(0.78)} />
          </linearGradient>
        </defs>
        {/* PARED IZQUIERDA */}
        <polygon points={`0,-160 ${VX - hw},${VY - hw * 0.62} ${VX - hw},${VY + hw * 0.62} 0,1240`}
          fill="url(#lb_izq)" />
        {/* PARED DERECHA */}
        <polygon points={`1920,-160 ${VX + hw},${VY - hw * 0.62} ${VX + hw},${VY + hw * 0.62} 1920,1240`}
          fill="url(#lb_der)" />
        {/* TECHO y PISO en sombra: el conducto es un tubo, no dos paneles */}
        <polygon points={`0,-160 1920,-160 ${VX + hw},${VY - hw * 0.62} ${VX - hw},${VY - hw * 0.62}`}
          fill={rgba(V.ink0, 0.72 - papel * 0.5)} />
        <polygon points={`0,1240 1920,1240 ${VX + hw},${VY + hw * 0.62} ${VX - hw},${VY + hw * 0.62}`}
          fill={rgba(V.ink0, 0.8 - papel * 0.56)} />
        {/* LA LANA a los dos costados: la fibra que roza al aire y come al sonido */}
        <polygon points={`0,120 ${VX - hw * 0.86},${VY - hw * 0.4} ${VX - hw * 0.86},${VY + hw * 0.4} 0,980`}
          fill={lanaCol} />
        <polygon points={`1920,120 ${VX + hw * 0.86},${VY - hw * 0.4} ${VX + hw * 0.86},${VY + hw * 0.4} 1920,980`}
          fill={lanaCol} />
        {/* los nervios de la lámina: pasan hacia la cámara y dan la sensación de AVANCE */}
        {Array.from({ length: ribs }, (_, i) => {
          const t = (((i / ribs) + ((g / 92) % 1)) % 1);
          const k = Math.pow(1 - t, 2.1);
          const x1 = lerp(VX - hw, 0, k), x2 = lerp(VX + hw, 1920, k);
          const yA = lerp(VY - hw * 0.62, -160, k), yB = lerp(VY + hw * 0.62, 1240, k);
          const a = 0.06 + 0.2 * (1 - k);
          return (
            <g key={i}>
              <line x1={x1} y1={yA} x2={x1} y2={yB} stroke={rgba(V.white, a)} strokeWidth={1 + k * 3} />
              <line x1={x2} y1={yA} x2={x2} y2={yB} stroke={rgba(V.white, a * 0.8)} strokeWidth={1 + k * 3} />
            </g>
          );
        })}
        {/* la boca del fondo: adonde vamos */}
        <rect x={VX - hw * 0.9} y={VY - hw * 0.56} width={hw * 1.8} height={hw * 1.12}
          fill={rgba(papel > 0.5 ? V.paper : V.ink0, papel > 0.5 ? 0.9 : 0.86)} />
      </svg>
    </AbsoluteFill>
  );
};

/** Titular de acto: cama oscura obligatoria, ≤6 palabras. */
const Titu: React.FC<{
  g: number; a: number; b: number; kick: string; l1: string; l2?: string;
  x?: number; y?: number; w?: number; color?: string;
}> = ({ g, a, b, kick, l1, l2, x = 6.5, y = 11, w = 620, color = V.volt }) => {
  const inP = clamp01((g - a) / 14);
  const outP = clamp01((b - g) / 12);
  const op = Math.min(inP, outP);
  if (op <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, opacity: op,
      transform: `translateZ(140px) translateY(${((1 - inP) * 32 - (1 - outP) * 18).toFixed(1)}px)`,
    }}>
      <Bed pad={26} w={w}>
        <Kick color={color}>{kick}</Kick>
        <div style={{ height: 10 }} />
        <Head size={58}>{l1}</Head>
        {l2 ? <Head size={58}>{l2}</Head> : null}
      </Bed>
    </div>
  );
};

// ── EL MOVIMIENTO ────────────────────────────────────────────────────────────────────────────
export const MovLaberinto: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  const local = useCurrentFrame();
  const g = Math.max(0, Math.min(TOTAL, gFrame ?? local));
  const off = local - (gFrame ?? local);   // ancla absoluta de SeamOcclude / Readout / WhiteRoom
  // el reel de costuras monta cada acto por separado (`acto` 1..6): ahi el foco sube un punto.
  const enfoque = (n: number) => (acto === n ? 1.08 : 1);

  // ── LA CÁMARA: un solo recorrido. Baja al codo, entra, sube por el motor, sale al papel. ───
  const base = gcam(g, { z0: -40, z1: 120, panX: -26, panY: 14, ry: -1.2, rx: 0.9, dur: TOTAL });
  const KC = [0, 334, 602, 800, 962, 1150, 1322, 1500, 1682, 1880, TOTAL];
  const camZ = ip(g, KC, [-40, 20, 74, 150, 206, 240, 268, 300, 330, 366, 400]);   // siempre hacia adelante
  const camY = ip(g, KC, [-40, 34, 110, 156, 96, 6, -54, -30, -6, 16, 38]);
  const camX = ip(g, KC, [0, -32, -84, -120, -70, 26, 92, 130, 156, 176, 190]);
  const camRX = ip(g, KC, [3.2, 2.2, 1.2, 0.4, -0.6, -1.2, -0.6, -0.2, 0.2, 0.6, 0.9]);
  const camRY = ip(g, KC, [-1.6, -0.8, 0.4, 1.6, 0.8, -0.4, -1.2, -0.8, -0.3, 0.2, 0.6]);
  const cam =
    `${base.transform} translate3d(${camX.toFixed(1)}px, ${camY.toFixed(1)}px, ${camZ.toFixed(1)}px) ` +
    `rotateY(${camRY.toFixed(2)}deg) rotateX(${camRX.toFixed(2)}deg)`;

  // ── LA LUZ: tarde gris azulada → verde-voltio en la diagonal → PAPEL cálido en el aterrizaje ─
  const calor = ip(g, [1820, 1930, TOTAL], [0, 0.7, 1]);          // la herencia de luz del cierre
  const tint = light(ip(g, [0, 602, 1322, 1682, 1900], [0, 0.3, 0.72, 0.9, 0.2]), "sky", "volt");
  const tint2 = light(ip(g, [0, 1322, 1900], [0, 0.35, 1]), "amber", "paper");
  const atInt = ip(g, [0, 602, 1322, 1780, TOTAL], [0.82, 0.94, 1.08, 1.2, 0.9]);
  const atKey = ip(g, [0, 602, 1322, TOTAL], [0.26, 0.4, 0.56, 0.7]);
  const atFloor = ip(g, [0, 602, 1500, TOTAL], [0.62, 0.72, 0.76, 0.6]);

  // ── ACTO 1 · la caja abierta, cenital, y las dos curvas que bajan ──────────────────────────
  const cenital = ip(g, [0, 334, 560], [52, 26, 8]);              // el plano se va enderezando
  const verA1 = g < 400;
  const dib1 = clamp01((g - 62) / 96);
  const lana1 = clamp01((g - 156) / 104);
  const db1 = ip(g, [0, 150, 300, 360], [78, 78, 71, 68]);

  // ── ACTO 2 · el calco del generador de $900 sobre el contrachapado de Claudio ──────────────
  const verA2 = g >= 314 && g < 660;
  const cardIn = clamp01((g - 330) / 34);
  const corte = clamp01((g - 392) / 46);                          // la carcasa se abre en corte
  const calco = clamp01((g - 452) / 96);                          // el dibujo cruza y se calca
  const filoCodo = clamp01((g - 556) / 44);                       // el primer filo volt en el canto

  // ── ACTO 3 · el hueco, el codo, la lana, y LA CÁMARA SE METE ADENTRO ───────────────────────
  const verA3 = g >= 594 && g < 1000;
  const sierra = clamp01((g - 616) / 70);
  const forra = clamp01((g - 742) / 78);
  const entra = clamp01((g - 812) / 132);                         // la boca se come el cuadro
  const dentro3 = clamp01((g - 866) / 60);
  const giro3 = ip(g, [880, 966], [0, -22]);                      // los noventa grados del codo
  const verMotor = g >= 926 && g < 1130;

  // ── ACTO 4 · sube por el motor, sale por arriba, y el cuadro se abre al CORTE DE PERFIL ────
  const verA4 = g >= 954 && g < 1400;
  const sube = clamp01((g - 986) / 120);
  const salida = clamp01((g - 1096) / 66);
  const abre = clamp01((g - 1150) / 130);                         // el corte de perfil, sin cortar
  const perfil = clamp01((g - 1174) / 110);

  // ── ACTO 5 · el rincón malo, el barrido, y el conducto que se estira a 3× su ancho ─────────
  const verA5 = g >= 1314 && g < 1720;
  const malo = clamp01((g - 1338) / 56) * clamp01((1520 - g) / 60);
  const mancha = Math.max(
    Math.sin(clamp01((g - 1368) / 44) * Math.PI),
    Math.sin(clamp01((g - 1424) / 44) * Math.PI),
  ) * malo;
  const barrido = clamp01((g - 1480) / 96);
  const estira = clamp01((g - 1552) / 118);                       // 1× → 3× el ancho
  const largo = 1 + 2 * estira;

  // ── COSTURA 5→6 · ZOOM-THROUGH por la boca del conducto estirado ───────────────────────────
  const zt = zoomThrough(g, 1666, 30, 62, 54);

  // ── ACTO 6 · adentro del conducto largo, los tres apagones, y EL ATERRIZAJE SOBRE EL PAPEL ─
  const verA6 = g >= 1674;
  const dentro6 = clamp01((g - 1690) / 54);
  const corto = clamp01((g - 1748) / 40) * clamp01((1912 - g) / 60);
  const salePapel = clamp01((g - 1874) / 84);                     // la chapa se vuelve papel
  const hoja = clamp01((g - 1962) / 74);                          // la página REAL de la guía
  const tinta6 = clamp01((g - 1918) / 62) * clamp01((2038 - g) / 60);
  const esquina = clamp01((g - 1994) / 40);                       // el aire levanta el borde

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez, arriba de todo, y no se remonta nunca ── */}
      <VoltAtmos tint={tint} tint2={tint2} keyFrom={atKey} intensity={atInt} floor={atFloor} />

      <Layers cam={cam}>
        {/* PLANO −540 · el concreto manchado del patio y la cama de foto bajo TODO */}
        <Plane z={0} style={{ transform: "translateZ(-540px)" }}>
          <PhotoPlane src="img/cmesilencio/cms_s9_cinta_hueco_libre.jpg" kind="photo" z={0}
            scale={1.5} dim={ip(g, [0, 602, 1150, 1800], [0.56, 0.7, 0.64, 0.86])} tint={V.sky} />
        </Plane>
        <PadPlane y={84} w={4200} h={300} rx={62} lit={ip(g, [0, 602, 1400, TOTAL], [1, 0.8, 0.5, 0.2])} z={-300} />

        {/* ══════════ ACTOS 1 y 2 · LA CAJA CENITAL Y EL CALCO ══════════ */}
        {(verA1 || verA2) && (
          <Plane z={0}>
            {/* el plano cenital de la caja abierta, que se va enderezando: la cámara BAJA */}
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transformStyle: "preserve-3d",
              transform: `perspective(1400px) rotateX(${cenital.toFixed(2)}deg) scale(${ip(g, [0, 602], [1.02, 1.16]).toFixed(3)})`,
              transformOrigin: "50% 62%",
            }}>
              <MediaCard src="broll/cmesilencio/cms_s9_caja_crece_aire.mp4" kind="video"
                w={1240} h={720} x={50} y={50} z={-40} radius={10}
                lit={ip(g, [0, 90, 620], [0.34, 1, 0.86])} litColor={V.sky}
                sheenAt={70 + off} opacity={ip(g, [0, 22, 620, 664], [0, 1, 1, 0])} />
              {/* LAS DOS CURVAS: bajan a cuadro, se forran de lana, y el sonido se queda ahí */}
              <Diagrama dib={dib1} lana={lana1} barrido={0}
                tinta={calco * 0.9} op={ip(g, [56, 84, 640, 668], [0, 1, 1, 0])} />
              <Choque g={g} cx={545} cy={880} t0={196} op={clamp01((g - 196) / 40) * clamp01((648 - g) / 46)} />
              <Choque g={g} cx={1288} cy={430} t0={228} op={clamp01((g - 228) / 40) * clamp01((648 - g) / 46)} per={53} />
              <Hebra g={g} op={ip(g, [230, 280, 640, 668], [0, 0.5, 0.5, 0])} ancho={4} />
            </div>
            {/* el polvo de la lana flotando cuando se pega a la fibra */}
            {lana1 > 0.05 && g < 460 && Array.from({ length: 12 }, (_, i) => {
              const s = 0.3 + rnd(i * 3.7) * 0.8;
              const yy = 74 - ((g - 156) * s) / 26 - rnd(i * 5.1) * 12;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${(24 + rnd(i * 8.3) * 46).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                  width: 3 + rnd(i * 2.9) * 4, height: 3 + rnd(i * 2.9) * 4, borderRadius: "50%",
                  background: rgba(OCRE, 0.28 * lana1 * clamp01((460 - g) / 60)),
                  transform: "translateZ(70px)",
                }} />
              );
            })}
            {g < 240 && (
              <IconPng src="img/cmesilencio/cms_ic_caja_cenital.png" x={88} y={22} size={92} z={80}
                opacity={ip(g, [18, 48, 200, 236], [0, 0.8, 0.8, 0])} glow={V.ink0} />
            )}
            {/* LO QUE NO ES: achicar el agujero. El aire se estrangula y el ruido igual sale. */}
            {g >= 96 && g < 330 && (
              <>
                <MediaCard src="broll/cmesilencio/cms_s9_agujero_estrangula_dobla.mp4" kind="video"
                  w={400} h={244} x={80} y={ip(g, [96, 160, 330], [64, 58, 70])} z={170} ry={-12}
                  radius={11} lit={0.86} litColor={V.danger}
                  label="ACHICAR EL AGUJERO · NO ALCANZA"
                  opacity={ip(g, [96, 134, 276, 322], [0, 0.96, 0.96, 0])} />
                <IconPng src="img/cmesilencio/cms_ic_alerta.png" x={69} y={54} size={78} z={190}
                  opacity={ip(g, [120, 152, 272, 316], [0, 0.9, 0.9, 0])} glow={V.ink0} />
              </>
            )}
          </Plane>
        )}

        {/* LOS ANILLOS DEL GENERADOR: su densidad ES el número de decibeles */}
        {g < 700 && (
          <Plane z={-20}>
            <SoundField db={db1} x={30} y={72} wall={null} tint={V.volt} speed={1.05} spread={70}
              on={ip(g, [0, 30, 560, 660], [0, 0.9, 0.7, 0])} />
          </Plane>
        )}

        {/* ══════════ ACTO 2 · LA TARJETA DEL GENERADOR DE $900 ══════════ */}
        {verA2 && (
          <Plane z={130}>
            <MediaCard src="broll/cmesilencio/cms_s9_mano_canto_tapa.mp4" kind="video"
              w={560} h={344} x={ip(g, [330, 392, 640], [92, 76, 74])} y={38}
              z={ip(g, [330, 452], [180, 140])} ry={-9} radius={12}
              lit={1} litColor={V.sky} label="INVERTER CERRADO · $900"
              sheenAt={372 + off} opacity={cardIn * ip(g, [600, 648], [1, 0])} />
            {/* la carcasa se ABRE EN CORTE y adentro tiene el MISMO dibujo */}
            <div style={{
              position: "absolute", left: `${ip(g, [330, 392, 640], [92, 76, 74])}%`, top: "38%",
              width: 560, height: 344, marginLeft: -280, marginTop: -172,
              transform: `translateZ(${ip(g, [330, 452], [182, 142])}px) rotateY(-9deg)`,
              overflow: "hidden", borderRadius: 12, opacity: cardIn * corte * ip(g, [600, 648], [1, 0]),
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                background: `linear-gradient(108deg, rgba(0,0,0,0) ${(52 - corte * 54).toFixed(1)}%, ${rgba(V.ink0, 0.9)} ${(56 - corte * 54).toFixed(1)}%)`,
              }} />
              <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
                style={{ position: "absolute", left: 0, top: 0, opacity: corte }}>
                <path d={RUTA} pathLength={1000} fill="none" stroke={rgba(V.bone, 0.9)} strokeWidth={30}
                  strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - corte)} />
                <path d={LANA_A} pathLength={1000} fill="none" stroke={rgba(OCRE, 0.9)} strokeWidth={20} strokeLinecap="round" />
                <path d={LANA_B} pathLength={1000} fill="none" stroke={rgba(OCRE, 0.9)} strokeWidth={20} strokeLinecap="round" />
              </svg>
            </div>
            <IconPng src="img/cmesilencio/cms_ic_etiqueta_precio.png"
              x={ip(g, [330, 392, 640], [92, 76, 74]) - 10} y={26} size={96} z={160}
              opacity={cardIn * ip(g, [560, 620], [0.92, 0])} glow={V.ink0} />
            {/* EL CALCO: el dibujo se despega de la tarjeta, cruza el patio y aterriza en la madera */}
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: calco * (1 - calco * 0.02),
              transform: `translateZ(${lerp(150, 20, calco).toFixed(1)}px) scale(${lerp(0.3, 1, eio(0, 1, calco)).toFixed(3)}) translateX(${lerp(24, 0, eio(0, 1, calco)).toFixed(2)}%)`,
              transformOrigin: "74% 38%", pointerEvents: "none",
            }}>
              <Diagrama dib={1} lana={1} barrido={filoCodo * 0.9} tinta={0.86} op={calco} grosor={0.9} />
            </div>
          </Plane>
        )}

        {/* ══════════ ACTO 3 · EL HUECO, EL CODO Y LA ENTRADA DE LA CÁMARA ══════════ */}
        {verA3 && (
          <Plane z={40}>
            {/* la sierra de calar recorta el hueco: material REAL, creciendo hacia la cámara */}
            <MediaCard src="broll/cmesilencio/cms_s9_regla_plegable_hueco.mp4" kind="video"
              w={ip(g, [600, 812], [560, 940])} h={ip(g, [600, 812], [344, 578])}
              x={ip(g, [600, 812], [30, 44])} y={ip(g, [600, 812], [70, 58])}
              z={ip(g, [600, 812], [60, 190])} ry={ip(g, [600, 812], [8, 2])} radius={12}
              lit={ip(g, [600, 660], [0.4, 1])} litColor={V.volt}
              label={g < 780 ? "SE ABRE EL HUECO · ABAJO" : undefined}
              sheenAt={650 + off}
              opacity={sierra * ip(g, [790, 862], [1, 0])} />
            {/* el aserrín cayendo hacia el lente */}
            {g >= 620 && g < 830 && Array.from({ length: 16 }, (_, i) => {
              const s = 0.7 + rnd(i * 4.3) * 1.5;
              const yy = 34 + ((g - 620) * s) / 9 + rnd(i * 6.7) * 26;
              if (yy > 118) return null;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${(20 + rnd(i * 7.1) * 52).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                  width: 4 + rnd(i * 3.3) * 6, height: 3 + rnd(i * 2.1) * 4, borderRadius: 2,
                  background: rgba(V.paper, 0.4 * clamp01((830 - g) / 60)),
                  transform: `translateZ(${(140 + rnd(i * 9.7) * 90).toFixed(0)}px) rotate(${(rnd(i * 5.5) * 90).toFixed(0)}deg)`,
                }} />
              );
            })}
            {/* la boca del codo forrada: se come el cuadro y quedamos ADENTRO */}
            <div style={{
              position: "absolute", left: `${lerp(24, 50, eio(0, 1, entra)).toFixed(2)}%`,
              top: `${lerp(76, 52, eio(0, 1, entra)).toFixed(2)}%`,
              width: 340, height: 240, marginLeft: -170, marginTop: -120,
              transform: `translateZ(${lerp(60, 220, entra).toFixed(1)}px) scale(${lerp(1, 13.5, eio(0, 1, entra)).toFixed(3)})`,
              borderRadius: 22, opacity: clamp01((g - 780) / 40) * clamp01((992 - g) / 40),
              border: `${Math.max(1, 10 * (1 - entra)).toFixed(1)}px solid ${rgba(V.steel, 0.7)}`,
              boxShadow: `0 0 90px ${rgba(V.ink0, 0.92)}, inset 0 0 120px ${rgba(V.ink0, 0.9)}`,
              background: `radial-gradient(70% 70% at 50% 50%, ${rgba(V.ink0, 0.94)} 0%, ${rgba(OCRE, 0.22 * forra)} 78%)`,
              pointerEvents: "none",
            }} />
            <Tunel g={g} op={dentro3 * clamp01((1136 - g) / 70)} ancho={ip(g, [866, 1120], [17, 13])}
              fx={ip(g, [880, 1000, 1120], [50, 60, 44])} fy={ip(g, [880, 1000, 1120], [54, 46, 30])}
              lana={forra} giro={giro3} />
            <Hebra g={g} op={clamp01((g - 796) / 44) * clamp01((1300 - g) / 80)} ancho={7} vel={1.5} />
          </Plane>
        )}

        {/* el marco ROJO del generador apareciendo enorme, ya del otro lado del codo */}
        {verMotor && (
          <Plane z={60}>
            <MediaCard src="img/cmesilencio/cms_s9_escape_al_rojo.jpg" kind="photo"
              w={ip(g, [926, 1130], [1320, 1520])} h={ip(g, [926, 1130], [760, 880])}
              x={50} y={ip(g, [926, 1090, 1130], [62, 108, 128])} z={-60} radius={8}
              lit={ip(g, [926, 980], [0.3, 0.92])} litColor={V.danger}
              opacity={clamp01((g - 926) / 44) * clamp01((1130 - g) / 50)} />
          </Plane>
        )}

        {/* ══════════ ACTO 4 · SUBE POR EL MOTOR Y SE ABRE AL CORTE DE PERFIL ══════════ */}
        {verA4 && (
          <Plane z={30}>
            {/* la pared de lana pasando desenfocada mientras subimos */}
            <div style={{ filter: `blur(${ip(g, [986, 1140], [7, 13]).toFixed(1)}px)`, opacity: sube * clamp01((1176 - g) / 60) }}>
              <MediaCard src="broll/cmesilencio/cms_s9_mano_recorre_pared.mp4" kind="video"
                w={620} h={1160} x={14} y={ip(g, [986, 1160], [96, -22])} z={140} ry={16} radius={6}
                lit={0.8} litColor={OCRE} grade={false} />
            </div>
            {/* la cara de SALIDA que se abre arriba y del lado contrario */}
            <div style={{
              position: "absolute", left: "76%", top: "22%", width: 300, height: 190,
              marginLeft: -150, marginTop: -95, borderRadius: 10,
              transform: `translateZ(120px) scale(${(0.7 + 0.3 * salida).toFixed(3)})`,
              background: `linear-gradient(160deg, ${rgba(V.sky, 0.42 * salida)} 0%, ${rgba(V.torch, 0.2 * salida)} 100%)`,
              boxShadow: `0 0 70px ${rgba(V.sky, 0.4 * salida)}`,
              border: `2px solid ${rgba(V.steel, 0.6 * salida)}`,
              opacity: salida * clamp01((1210 - g) / 60), pointerEvents: "none",
            }} />
            {g >= 1090 && g < 1230 && (
              <IconPng src="img/cmesilencio/cms_ic_flecha_arriba.png" x={76} y={ip(g, [1090, 1210], [34, 26])}
                size={88} z={150} opacity={ip(g, [1090, 1128, 1190, 1226], [0, 0.92, 0.92, 0])} glow={V.ink0} />
            )}
            {/* EL CORTE DE PERFIL: el cuadro se abre hacia atrás SIN CORTAR */}
            <div style={{
              position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
              transform: `translateZ(${lerp(220, 0, eio(0, 1, abre)).toFixed(1)}px) scale(${lerp(3.4, 1, eio(0, 1, abre)).toFixed(3)})`,
              transformOrigin: "50% 44%", opacity: perfil, pointerEvents: "none",
            }}>
              {/* la caja seccionada como una maqueta: el contrachapado de canto */}
              <div style={{
                position: "absolute", left: "12%", right: "12%", top: "22%", bottom: "14%",
                borderRadius: 6,
                background: `linear-gradient(168deg, ${rgba(V.paper, 0.14)} 0%, ${rgba(V.ink1, 0.9)} 100%)`,
                border: `10px solid ${rgba(V.paper, 0.42)}`,
                boxShadow: `inset 0 0 140px ${rgba(V.ink0, 0.88)}, 0 40px 90px ${rgba(V.ink0, 0.8)}`,
              }} />
              <Diagrama dib={perfil} lana={perfil} barrido={barrido} tinta={0.16} op={perfil}
                grosor={0.92 * enfoque(4)} />
              <Hebra g={g} op={perfil * 0.85} ancho={6} />
              <Choque g={g} cx={545} cy={880} t0={1188} op={perfil * clamp01((1700 - g) / 80)} />
              <Choque g={g} cx={1288} cy={430} t0={1206} op={perfil * clamp01((1700 - g) / 80)} per={53} />
            </div>
            {/* los TRES anillos lejanos que consiguen salir por la boca de arriba: 60 dB */}
            {g >= 1200 && (
              <SoundField db={60} x={86} y={22} wall={null} tint={V.volt} speed={0.8} spread={44}
                on={clamp01((g - 1200) / 60) * clamp01((1700 - g) / 90) * 0.9} />
            )}
          </Plane>
        )}

        {/* ══════════ ACTO 5 · EL RINCÓN MALO, EL BARRIDO Y EL 3× ══════════ */}
        {verA5 && (
          <div style={{
            position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transformStyle: "preserve-3d",
            transform: zt.out === "none" ? "none" : zt.out,
            transformOrigin: "50% 50%", opacity: zt.out === "none" ? 1 : zt.opacity,
          }}>
            <Plane z={80}>
              {/* el contraejemplo: entra y sale por el MISMO rincón y el aire se apelotona */}
              {malo > 0.01 && (
                <>
                  <AbsoluteFill style={{ opacity: malo, pointerEvents: "none" }}>
                    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                      <path d={RINCON} pathLength={1000} fill="none" stroke={rgba(V.danger, 0.8)}
                        strokeWidth={16} strokeLinecap="round" strokeDasharray="1000"
                        strokeDashoffset={1000 * (1 - clamp01((g - 1338) / 60))} />
                    </svg>
                  </AbsoluteFill>
                  <Hebra g={g} op={malo * 0.9} d={RINCON} ancho={6} vel={2.2} />
                  {/* la mancha de calor que se enciende y se apaga DOS veces, como una advertencia */}
                  <div style={{
                    position: "absolute", left: "18%", top: "80%", width: 460, height: 300,
                    marginLeft: -230, marginTop: -150, borderRadius: "50%",
                    background: `radial-gradient(circle, ${rgba(V.danger, 0.5 * mancha)} 0%, rgba(0,0,0,0) 68%)`,
                    filter: "blur(10px)", transform: "translateZ(40px)", pointerEvents: "none",
                  }} />
                  <MediaCard src="img/cmesilencio/cms_s9_escape_al_rojo.jpg" kind="photo"
                    w={360} h={224} x={30} y={30} z={150} ry={9} radius={10}
                    lit={0.9} litColor={V.danger} label="EL MISMO RINCÓN · SE CALIENTA"
                    opacity={malo * 0.96} />
                  <IconPng src="img/cmesilencio/cms_ic_alerta.png" x={19} y={18} size={86} z={170}
                    opacity={malo * (0.5 + 0.5 * mancha)} glow={V.ink0} />
                </>
              )}
              {/* EL CONDUCTO SE ESTIRA: la parte forrada crece hasta medir TRES VECES el ancho */}
              {estira > 0.005 && (
                <>
                  <AbsoluteFill style={{ pointerEvents: "none" }}>
                    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                      {/* el ANCHO, clavado entre dos marcas de luz verde */}
                      <line x1={470} y1={640} x2={470} y2={856} stroke={rgba(V.volt, 0.9)} strokeWidth={4} />
                      <line x1={686} y1={640} x2={686} y2={856} stroke={rgba(V.volt, 0.9)} strokeWidth={4} />
                      <line x1={470} y1={748} x2={686} y2={748} stroke={rgba(V.volt, 0.55)} strokeWidth={2}
                        strokeDasharray="10 8" />
                      {/* el acordeón de lámina galvanizada que crece hacia la cámara */}
                      {Array.from({ length: 22 }, (_, i) => {
                        const t = i / 21;
                        const x = 470 + t * 216 * largo;
                        if (x > 470 + 216 * largo + 1) return null;
                        return (
                          <line key={i} x1={x} y1={648} x2={x} y2={848}
                            stroke={rgba(V.steel, 0.28 + 0.3 * (1 - t))} strokeWidth={3} />
                        );
                      })}
                      <rect x={470} y={648} width={216 * largo} height={200} fill="none"
                        stroke={rgba(V.steel, 0.85)} strokeWidth={7} />
                      {/* la LANA rellenando el tramo estirado a medida que crece */}
                      <rect x={474} y={652} width={Math.max(0, 216 * largo - 8)} height={30}
                        fill={rgba(OCRE, 0.8)} />
                      <rect x={474} y={814} width={Math.max(0, 216 * largo - 8)} height={30}
                        fill={rgba(OCRE, 0.8)} />
                    </svg>
                  </AbsoluteFill>
                  <div style={{
                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                    opacity: clamp01((g - 1596) / 40), pointerEvents: "none",
                  }}>
                    <Readout value="3×" label="EL ANCHO DEL CONDUCTO" at={1596 + off}
                      x={ip(g, [1552, 1670], [34, 46])} y={50} size={120} color={V.volt} align="center" />
                  </div>
                </>
              )}
              <Diagrama dib={1} lana={1} barrido={barrido} grosor={enfoque(5)}
                tinta={0.16} op={clamp01((g - 1314) / 30) * clamp01((1700 - g) / 60) * (1 - estira * 0.55)} />
            </Plane>
          </div>
        )}

        {/* ══════════ ACTO 6 · ADENTRO DEL CONDUCTO LARGO Y EL ATERRIZAJE ══════════ */}
        {verA6 && (
          <Plane z={60}>
            <Tunel g={g} op={dentro6} ancho={ip(g, [1690, 1880, TOTAL], [16, 15, 26])}
              fx={ip(g, [1690, 1880, TOTAL], [46, 50, 50])} fy={ip(g, [1690, 1880, TOTAL], [52, 50, 50])}
              lana={ip(g, [1690, 1760], [0.2, 1])} giro={ip(g, [1690, 1900], [-4, 0])}
              papel={salePapel} />
            {/* la lana REAL rozando el costado: material, no un relleno */}
            <div style={{ filter: "blur(5px)", opacity: dentro6 * (1 - salePapel) * 0.9 }}>
              <MediaCard src="broll/cmesilencio/cms_s9_mano_recorre_pared.mp4" kind="video"
                w={560} h={980} x={9} y={50} z={180} ry={22} radius={4}
                lit={0.9} litColor={OCRE} grade={false} />
            </div>
            <Hebra g={g} op={dentro6 * 0.7 * (1 - salePapel * 0.4)}
              d="M 120 620 L 1800 520" ancho={6} vel={1.8} />
            {/* LOS TRES APAGONES: un anillo se come contra la fibra, tres veces en fila */}
            {[1742, 1794, 1846].map((t, i) => (
              <Choque key={i} g={g} cx={520 + i * 330} cy={540} t0={t}
                op={clamp01((g - t) / 26) * clamp01((1916 - g) / 60) * (1 - salePapel)} per={52} />
            ))}
            {/* las dos medidas: diez de ancho, treinta de recorrido */}
            {g >= 1712 && g < 1912 && (
              <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: clamp01((1912 - g) / 50) }}>
                <Readout value="10" unit="CM" label="EL ANCHO" at={1712 + off} x={22} y={80} size={86}
                  color={V.bone} align="center" />
                <Readout value="30" unit="CM" label="CON LANA A LOS COSTADOS" at={1770 + off}
                  x={50} y={86} size={110} color={V.volt} align="center" />
              </div>
            )}
            {/* el contador de anillos que se quedaron en la fibra: tres apagones en fila */}
            {g >= 1742 && g < 1912 && (
              <div style={{
                position: "absolute", left: "50%", top: "16%", transform: "translate(-50%,0)",
                display: "flex", alignItems: "baseline", gap: 18,
                opacity: clamp01(clamp01((g - 1742) / 26) * clamp01((1912 - g) / 50) * enfoque(6)),
              }}>
                <Num size={104} color={V.volt}>
                  {String([1742, 1794, 1846].filter((t) => g >= t + 14).length)}
                </Num>
                <Body size={30} color={rgba(V.white, 0.76)}>ANILLOS QUE NO SALIERON</Body>
              </div>
            )}
            {/* EL CONTRAEJEMPLO al lado: sin lana suficiente, el anillo pasa entero */}
            {corto > 0.01 && (
              <>
                <MediaCard src="broll/cmesilencio/cms_s9_haz_recto_sonido.mp4" kind="video"
                  w={430} h={264} x={83} y={30} z={190} ry={-11} radius={11}
                  lit={0.95} litColor={V.danger} label="CORTO · PASA DERECHO"
                  sheenAt={1780 + off} opacity={corto} />
                <div style={{
                  position: "absolute", left: "83%", top: "30%", width: 470, height: 300,
                  marginLeft: -235, marginTop: -150, borderRadius: 14,
                  border: `2px solid ${rgba(V.danger, 0.5 * corto)}`,
                  boxShadow: `0 0 60px ${rgba(V.danger, 0.3 * corto)}`,
                  transform: "translateZ(188px)", opacity: corto, pointerEvents: "none",
                }} />
              </>
            )}
          </Plane>
        )}

        {/* TITULARES · una idea por acto, con cama oscura */}
        <Plane z={0}>
          <Titu g={g} a={70} b={300} kick="EL LABERINTO" l1="EL AIRE DOBLA." l2="EL SONIDO NO." />
          <Titu g={g} a={392} b={600} kick="EL DE NOVECIENTOS" l1="TIENE ESTO MISMO" l2="ADENTRO" />
          <Titu g={g} a={630} b={800} kick="ENTRADA · ABAJO" l1="ENTRA, BAJA" l2="Y RECIÉN AHÍ DOBLA" />
          <Titu g={g} a={1206} b={1310} kick="SALIDA · ARRIBA" l1="Y EN DIAGONAL" x={6.5} y={64} />
          <Titu g={g} a={1560} b={1660} kick="LA REGLA" l1="TRES VECES" l2="EL ANCHO" x={70} y={16} w={480} />
          <Titu g={g} a={1834} b={1908} kick="MÁS CORTO" l1="NO DOBLA NADA" x={6.5} y={16} w={560}
            color={V.danger} />
        </Plane>

        {/* PLANO +260 · la mota en primer plano: el aire del patio nunca está limpio (hold VIVO) */}
        <Plane z={260} style={{ pointerEvents: "none" }}>
          {Array.from({ length: 11 }, (_, i) => {
            const s = 0.4 + rnd(i * 4.9) * 1.2;
            const yy = ((rnd(i * 2.7) * 132 - (g * s) / 21) % 132 + 132) % 132 - 14;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 8.7) * 104 - 2).toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
                width: 4 + rnd(i * 6.3) * 5, height: 4 + rnd(i * 6.3) * 5, borderRadius: "50%",
                background: rgba(V.white, (0.05 + rnd(i * 3.9) * 0.07) * (1 - calor)),
              }} />
            );
          })}
          <AbsoluteFill style={{
            background: `radial-gradient(124% 96% at 50% 50%, rgba(0,0,0,0) 52%, ${rgba(V.ink0, lerp(0.52, 0.68, clamp01(g / 1800)) * (1 - calor))} 100%)`,
          }} />
        </Plane>
      </Layers>

      {/* ── COSTURA 1→2 · OCLUSIÓN: una pared de LÁMINA GALVANIZADA baja y cruza el cuadro ── */}
      <SeamOcclude at={320 + off} dur={16} color={V.steel} angle={-6} lit={0.3} />
      {/* ── COSTURA 2→3 · WIPE DE MATERIA: el aserrín del contrachapado barre el cuadro ── */}
      <SeamWipeMatter at={588 + off} dur={26} tint={V.paper} />

      {/* ══════════ EL ATERRIZAJE SOBRE EL PAPEL DE LA LÁMINA ══════════
          HERENCIA DE LUZ: el gris azulado del conducto se vuelve `paper` cálido, y el último
          cuadro ya es el fondo de la sección siguiente. Nada corta: la hoja llega y se queda. */}
      {g >= 1890 && (
        <WhiteRoom at={1900 + off} dur={76} tint={V.amber}>
          {/* el mismo corte, ahora dibujado A TINTA sobre el papel */}
          <div style={{
            position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
            transform: `scale(${ip(g, [1918, 2042], [0.72, 0.62]).toFixed(3)}) translateY(${ip(g, [1918, 2042], [-2, -9]).toFixed(1)}%)`,
            opacity: tinta6 * (1 - hoja * 0.72), pointerEvents: "none",
          }}>
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
              <path d={RUTA} pathLength={1000} fill="none" stroke="rgba(46,44,38,0.7)" strokeWidth={7}
                strokeLinecap="round" strokeDasharray="1000"
                strokeDashoffset={1000 * (1 - clamp01((g - 1918) / 78))} />
              <path d={LANA_A} pathLength={1000} fill="none" stroke="rgba(140,104,40,0.62)" strokeWidth={11}
                strokeLinecap="round" strokeDasharray="5 7" />
              <path d={LANA_B} pathLength={1000} fill="none" stroke="rgba(140,104,40,0.62)" strokeWidth={11}
                strokeLinecap="round" strokeDasharray="5 7" />
            </svg>
          </div>

          {/* LA PÁGINA REAL DE LA GUÍA: llega desde abajo y se apoya. Aspecto 0,707. */}
          {hoja > 0.005 && (
            <MediaCard src="img/cms_lam_corte.jpg" kind="photo"
              w={664} h={940} x={50} y={ip(g, [1962, TOTAL], [128, 54])} z={0}
              rot={ip(g, [1962, TOTAL], [-5.4, -2.1])} radius={3}
              lit={1} litColor={V.paper} grade={false} opacity={clamp01(hoja * 1.4)} />
          )}

          {/* EL AIRE QUE VENÍAMOS SIGUIENDO sale del conducto y LEVANTA LA ESQUINA de la hoja */}
          {esquina > 0.01 && (
            <div style={{
              position: "absolute", left: "50%", top: `${ip(g, [1962, TOTAL], [128, 54]).toFixed(2)}%`,
              width: 664, height: 940, marginLeft: -332, marginTop: -470,
              transform: `rotate(${ip(g, [1962, TOTAL], [-5.4, -2.1]).toFixed(2)}deg)`,
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute", right: 0, top: 0, width: 150, height: 150,
                background: "linear-gradient(225deg, #FBFAF5 0%, #EAE5D8 62%, #D5CFC0 100%)",
                clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
                transform: `rotate(${(-16 * esquina).toFixed(2)}deg) translate(${(-6 * esquina).toFixed(1)}px, ${(4 * esquina).toFixed(1)}px)`,
                transformOrigin: "100% 0%",
                boxShadow: `-12px 12px 22px rgba(90,84,70,${(0.28 * esquina).toFixed(2)})`,
                opacity: esquina,
              }} />
            </div>
          )}

          {/* el aire, ya tibio, cruzando el papel por última vez */}
          <div style={{ opacity: 0.4 * calor * (1 - hoja * 0.5) }}>
            <Hebra g={g} op={1} d="M -40 700 Q 620 640 1180 470 T 1980 300" ancho={5} vel={0.7} />
          </div>

          {hoja > 0.4 && (
            <div style={{
              position: "absolute", left: "6.5%", bottom: "9%", maxWidth: 520,
              opacity: clamp01((hoja - 0.4) / 0.5),
            }}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.4,
                color: "rgba(96,90,74,0.9)", textTransform: "uppercase",
              }}>EL LABERINTO, EN UNA HOJA</div>
              <div style={{ height: 10 }} />
              <Body size={30} color="rgba(58,54,46,0.86)">
                Entrada abajo, salida arriba, y el tramo forrado tres veces el ancho.
              </Body>
            </div>
          )}
        </WhiteRoom>
      )}

    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────────────────────
   TABLA DE ENTRADA Y SALIDA DE LOS ACTOS  ·  MovLaberinto · 2042 frames · la cámara VIAJA CON EL AIRE
   (los rangos se PISAN 20-40 cuadros: cada acto sigue vivo mientras el siguiente ya entró)

   ACTO | RANGO g     | ENTRA (encuadre + luz)                       | SALE (encuadre + luz)                       | COSTURA hacia el siguiente
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    1   | 0 – 400     | PLANO CENITAL de la caja abierta (rotateX     | la caja ya enderezándose (rotateX 26°), las | OCLUSIÓN DE MATERIA · una pared de LÁMINA
        | (pisa 66)   | 52°) sobre el concreto del patio; camZ −40 · | dos curvas forradas y los anillos muriendo  | GALVANIZADA (`V.steel`, lit 0.30, ángulo
        |             | luz de tarde gris azulada (`sky`), 78 dB     | en la fibra; camZ +20 · sky, ya 68 dB       | −6°) baja y cruza el cuadro (g320)
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    2   | 314 – 660   | detrás de la chapa: la tarjeta del inverter  | el dibujo del caro YA CALCADO en tinta       | WIPE DE MATERIA · el ASERRÍN del
        | (pisa 66)   | de $900 entrando por la derecha; camZ +30 ·  | sobre el contrachapado, primer filo volt en | contrachapado barre el cuadro
        |             | luz sky, key 0.32                            | el canto de los codos; camZ +74 · volt 30 % | (SeamWipeMatter g588, `V.paper`, dur 26)
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    3   | 594 – 1000  | rasante al zócalo: la sierra recorta el      | ADENTRO DEL CODO: túnel con lana a los dos  | LA CÁMARA SIGUE · seguimos dentro de la
        | (pisa 46)   | hueco y el aserrín cae hacia el lente;       | costados, ya girado −22°, y el marco rojo   | caja; el acto 4 arranca sin cambiar de
        |             | camZ +74 · sky + volt                        | del motor enorme delante; camZ +206         | espacio: sólo cambia la dirección (sube)
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    4   | 954 – 1400  | subiendo por el costado del motor con la     | el CORTE DE PERFIL entero: entrada abajo    | METAMORFOSIS · la línea de la diagonal del
        | (pisa 46)   | lana pasando desenfocada; camZ +206 ·        | izquierda, salida arriba derecha, la        | aire ES el barrido verde-voltio que barre el
        |             | luz sky con volt en la diagonal              | diagonal cruzando; 60 dB, 3 anillos lejanos | motor de punta a punta (misma path, g1314+)
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    5   | 1314 – 1720 | el corte de perfil con el barrido corriendo; | el conducto estirado a 3× su ancho, mirando | ZOOM-THROUGH · la cámara entra POR LA BOCA
        | (pisa 46)   | camZ +268 · volt 72 %                        | de punta a la cámara, la lana rellenando el | del conducto estirado (zoomThrough g1666,
        |             |                                              | tramo; camZ +330                            | dur 30, foco 62/54)
   -----|-------------|----------------------------------------------|---------------------------------------------|--------------------------------------------
    6   | 1674 – 2042 | DENTRO del conducto largo, a ras de la lana; | EL PAPEL DE LA LÁMINA llenando el encuadre, | HERENCIA DE LUZ · `sky`+volt → `paper`
        |  (cierre)   | 10 cm de ancho, 30 de recorrido, tres        | luz `paper` cálida entrando de la izquierda,| cálido (g1820-1930). El último cuadro YA ES
        |             | apagones contra la fibra; camZ +330          | la página real de la guía apoyada y su      | el fondo de la sección siguiente: la página
        |             |                                              | esquina levantada por el aire; camZ +400    | a pantalla completa lo recoge SIN CORTAR
   ─────────────────────────────────────────────────────────────────────────────────────────────
   EL ATERRIZAJE, EN DETALLE (es el momento de conversión del video):
     g1874-1958  la chapa del túnel pierde el metal y se vuelve papel (`papel` del <Tunel/>): el
                 mismo túnel, otra materia. La boca del fondo pasa de negra a crema.
     g1890-1976  <WhiteRoom> entra por encima de todo: el suelo del cuadro ya es papel cálido.
     g1918-2000  el MISMO corte se redibuja a TINTA fina sobre el papel: la ruta que veníamos
                 siguiendo con el aire termina siendo un dibujo de la guía.
     g1962-2042  llega la PÁGINA REAL (`img/cms_lam_corte.jpg`) desde abajo y se apoya.
     g1994-2042  el aire que seguimos todo el movimiento sale del conducto y LEVANTA LA ESQUINA
                 de la hoja. Último cuadro: papel cálido a sangre + la página. Cero corte.
   ───────────────────────────────────────────────────────────────────────────────────────────── */
