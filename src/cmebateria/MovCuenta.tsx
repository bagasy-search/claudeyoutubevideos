// MovCuenta.tsx — MOVIMIENTO 2 de `cmebateria` · "LA ÚNICA CUENTA" · ~1500 frames @ 30 fps (50 s)
// Canal Claudio Mendoza Constructor (ES). Escenario compartido: `./VoltStage`.
//
// LO QUE TIENE QUE QUEDAR GRABADO: **la respuesta al open loop del minuto uno no es sí ni no, es un
// número.** La etiqueta dice 70 Ah; por los 12,6 V que maneja son 880 Wh guardados. Pero de esos 880
// no se puede usar ni la mitad, por dos motivos: una batería de plomo descargada más allá de la mitad
// se arruina, y —el importante— la batería del auto **no es de reserva, es de ARRANQUE**: está hecha
// para dar una patada de 300 A durante dos segundos, no para gotear ocho horas. Eso lo hacen las de
// ciclo profundo. Resultado: **440 Wh reales**.
//
// ⛔ NO son cinco componentes pegados: es UN PLANO SECUENCIA de 50 s.
//   · UNA sola atmósfera `<VoltAtmos/>`, montada una vez, que NUNCA se remonta.
//   · UNA sola cámara: `gcam(camClock(f), {z0:140 → z1:20, dur:D})` + el pan/ry heredados del
//     movimiento anterior, que se DESHACEN hacia el pan del siguiente. El reloj está deformado por
//     acto (el easing nunca es constante) pero la Z es MONÓTONA: 140 → 20, sin retroceder.
//   · LA LUZ evoluciona en un solo viaje: VOLTIO FILOSO (contraste alto, la key a la izquierda) →
//     VOLTIO SOBRE BLANCO NACIENTE (la key barre a la derecha, el piso se aclara, el papel rebota).
//   · EL AIRE se aquieta todo el movimiento: .20 → .05 (el banco de trabajo → la sala de papel),
//     con UN solo respingo a .26 en la patada de 300 A. El espectador lo VE.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF   (fracciones de `durationInFrames`; entre paréntesis, frames a D=1500)
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ⟵ ENTRA (de MovPico): cam {z 140, panX −60, ry −5} · luz {VOLT filoso, key .30, int 1.16}
//    aire {.20} · materia {EL CABLE ROJO GRUESO del inversor, estirándose fuera de cuadro}
//
// ACTO 1 · .000–.155 (0–232) · "SETENTA AMPERIOS HORA"   ▸ protagonista: LA ETIQUETA (macro)
//   enterFrom cam {z 140, panX −60, ry −5, net .92, foco (900,470)} luz {VOLT key .30} aire {.20}
//             materia {EL CABLE ROJO que llega enrollado desde fuera de cuadro}
//   material  {PhotoPlane `cmeb_mv_cuenta_etiquetaBateria` a sangre = plástico sucio y despellejado ·
//              MediaCard FOTO `cmeb_mv_cuenta_bateriaBanco` chica y lateral (mitad 1 del par) ·
//              `IconPng cmeb_ic_regla` = el dato que se lee, no se calcula}
//   El cable SE ENDEREZA (t 0→1 sobre 60 frames) y aterriza como el SUBRAYADO del 70, en el eje
//   exacto donde después nace la pila. El `70 Ah` lo escribe el kit (`Num`), no la foto.
//   exitTo    cam {z ≈ 122, net 1.02} luz {VOLT key .33} aire {.19} materia {EL 70 y su subrayado rojo}
//   ── FRONTERA A @ .155 ····· MATCH-SHAPE ·················································
//      El **70** NO se mueve ni un píxel: mismo eje, mismo cuerpo, misma tipografía. Lo que pasa es
//      que le CRECE una losa alrededor (el subrayado rojo del cable ES el canto inferior de la losa)
//      y la cifra deja de ser textura sobre plástico para ser un objeto con peso. Cero fade.
//
// ACTO 2 · .155–.375 (232–562) · "OCHOCIENTOS OCHENTA"   ▸ protagonista: LA PILA DE CIFRAS
//   enterFrom cam {z ≈ 122, net 1.02, foco (900,470)} luz {VOLT key .33} aire {.19}
//             materia {la losa del 70 recién formada, con su canto rojo}
//   material  {CLIP `cmeb_mv_cuenta_claudioCalcula.mp4` (héroe, luz voltio — mitad 1 del par) ·
//              `IconPng cmeb_ic_rayo` sobre la losa del resultado · FOTO `cmeb_mv_cuenta_borneMacro`
//              ENTRA acá y CRUZA la frontera B siendo la misma tarjeta}
//   .215 cae `× 12,6 V` ENCIMA del 70 y lo comprime 5 px. .285 la losa `= 880 Wh` sale de ABAJO,
//   más ancha y más gruesa, y el golpe SACUDE la cámara 6 frames. Son objetos, no renglones.
//   exitTo    cam {z ≈ 96, net .96, foco (1010,540)} luz {VOLT key .38} aire {.17}
//             materia {EL BORNE DE PLOMO, por donde entra y sale toda esa energía}
//   ── FRONTERA B @ .360 ····· OCLUSIÓN (color PLOMO `#9DA39B`, la materia del borne) ·········
//      El borne cruza el cuadro (at K.a3−22, dur 16) y lo tapa al 100% entre K.a3−16 y K.a3−11.
//      TODO el swap está clavado en K.a3−14, DENTRO de esa ventana: la cama de foto pasa de la
//      etiqueta al banco, la pila se corta en 2 frames y la batería ya está del otro lado. Nada
//      se funde. ⛔ el color es el del PLOMO (la materia que cruza), NUNCA el del fondo.
//
// ACTO 3 · .375–.615 (562–922) · "PASADA LA MITAD SE ARRUINA" ▸ protagonista: LA BATERÍA TRANSPARENTE
//   enterFrom cam {z ≈ 94, net .94, foco (960,560)} luz {VOLT key .40} aire {.15}
//             materia {el borne, que ahora está arriba de la batería que se abre}
//   material  {PhotoPlane `cmeb_mv_cuenta_bateriaBanco` A SANGRE = la cama real (mitad 2 del par) ·
//              la BATERÍA TRANSPARENTE la dibujo yo: carcasa de vidrio, 6 celdas, líquido de energía
//              con oleaje y burbujas, dos bornes (tapa roja / tapa negra) y el polvillo blanco seco
//              alrededor de uno — ningún motor de imagen hace esto · `IconPng cmeb_ic_bateria`}
//   El nivel baja de 880 a la MITAD y SE CLAVA ahí; debajo se enciende la zona rayada de ruina.
//   .470 aparece la LÍNEA DE LA MITAD (punteada, voltio) cruzando la carcasa: **es el objeto que va
//   a ser el eje del acto 4.**
//   exitTo    cam {z ≈ 72, net 1.00, foco (985,560)} luz {VOLT key .46} aire {.13}
//             materia {LA LÍNEA DE LA MITAD, clavada en y=560}
//   ── FRONTERA C @ .615 ····· MATCH-MOVE ··················································
//      La línea de la mitad NO se va: se estira hacia la derecha hasta ser el EJE DEL TIEMPO, la
//      cámara truckea sobre SU MISMO VECTOR y a su velocidad, y la carcasa sale del cuadro por la
//      izquierda arrastrada por ese mismo movimiento. Mismo Y, misma pantalla, sin corte.
//
// ACTO 4 · .615–.845 (922–1268) · "NO ES DE RESERVA, ES DE ARRANQUE" ▸ protagonista: LAS DOS CURVAS
//   enterFrom cam {z ≈ 72, net 1.00, foco (985,560)} luz {VOLT key .46} aire {.13 → .26 en la patada}
//   material  {CLIP `cmeb_mv_cuenta_arranqueMotor.mp4` colgado DEBAJO de su propia curva ·
//              CLIP `cmeb_mv_cuenta_cicloProfundo.mp4` colgado debajo de la suya ·
//              `IconPng cmeb_ic_auto` en la punta de la patada · `cmeb_ic_reloj` sobre el goteo}
//   Dos comportamientos, no dos etiquetas: la PATADA (sube casi vertical a 300 A, se sostiene DOS
//   SEGUNDOS y se desploma; área ámbar; sacudón de cámara) contra el GOTEO (una meseta baja y larga
//   que cruza todo el cuadro sin un solo sobresalto; área voltio).
//   exitTo    cam {z ≈ 40, net .90, foco (1100,520)} luz {VOLT key .56} aire {.09}
//             materia {el área del goteo, por donde entra la cámara}
//   ── FRONTERA D @ .838 ····· ZOOM-THROUGH (`zoomThrough`, 22 frames, foco en el arranque del goteo) ··
//      La cámara ENTRA por el área de la meseta (el sitio donde vive la energía que sí se puede usar)
//      y sale del otro lado con el 440 ya montado. El mundo de los actos 1-4 se escala a ×7,5 y se
//      pierde por los bordes: no hay corte ni fundido, hay travelling hacia adentro.
//
// ACTO 5 · .845–1.000 (1268–1500) · "440 VATIOS HORA REALES" ▸ protagonista: EL NÚMERO
//   enterFrom cam {z ≈ 40, net .90} luz {VOLT key .56} aire {.09}
//             materia {el 440 que sale del túnel del zoom}
//   material  {PhotoPlane `cmeb_mv_cuenta_claudioCalcula` A SANGRE y en penumbra (mitad 2 del par:
//              en el acto 2 el mismo plano era un CLIP de héroe con luz voltio)}
//   .930 el 440 SE ACUESTA (rotateX 0 → 74°) y debajo le crece una HOJA DE PAPEL que se lleva su
//   rebote de luz al aire: el piso de la atmósfera se aclara y la key termina de barrer a la derecha.
//   exitTo ⟶ cam {z 20, panY −90 (la cámara ya mira hacia abajo, al papel)} · luz {VOLT sobre BLANCO
//            NACIENTE} · aire {.05} · materia {LA HOJA DE PAPEL aterrizando}   ⇒ entra MovTabla
//
// MATERIAL: los 6 assets de la lista + los 5 íconos. Ningún asset se usa más de 2 veces, y las dos
// repeticiones son PARES DELIBERADOS con otra escala Y otro oficio:
//   · `cmeb_mv_cuenta_bateriaBanco`  tarjeta de producto chica (acto 1) ↔ cama a sangre (actos 3-4)
//   · `cmeb_mv_cuenta_claudioCalcula` clip de héroe/voltio (acto 2)   ↔ cama a sangre en penumbra (acto 5)
//   · `cmeb_mv_cuenta_borneMacro` es la MATERIA de la frontera B: la MISMA tarjeta entra en el acto 2
//     y sale en el acto 3, cruzando la oclusión sin interrumpirse.
//
// ⛔ cero Math.random / Date.now · cero backdrop-filter · cero blur grande full-screen · cero fade.
// ⛔ Easing.quint NO EXISTE → Easing.poly(5). ⛔ rgba() con undefined = NaN → helper `rgba(hex,a)`.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba,
  gcam, light, VoltAtmos, WindField, Layers, Plane,
  MediaCard, PhotoPlane, IconPng, Readout,
  SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

export const MOVCUENTA_FRAMES = 1500;

/* ── MATERIAS que no están en la paleta del canal (colores de OBJETO, no de marca) ─────────── */
const RED_CABLE = "#D93B22";   // el cable rojo grueso del inversor — la materia que ENTRA
const LEAD = "#9DA39B";        // el plomo del borne — la materia que cruza la FRONTERA B
const PAPER = "#F3F1E6";       // la hoja que se lleva MovTabla — la materia que SALE

/* ── EASINGS — nunca uno solo para todo ────────────────────────────────────────────────────── */
const EZ = {
  glide: Easing.bezier(0.33, 0.0, 0.18, 1),
  push: Easing.bezier(0.58, 0.0, 0.22, 1),
  snap: Easing.bezier(0.12, 0.88, 0.2, 1),
  soft: Easing.bezier(0.42, 0.06, 0.36, 1),
  expo: Easing.poly(5),
  lin: (t: number) => t,
};

/** rampa multi-key con easing POR SEGMENTO (la cámara nunca tiene velocidad constante) */
const keyed = (
  f: number, ks: number[], vs: number[],
  e: ((t: number) => number) | ((t: number) => number)[] = EZ.glide,
): number => {
  const last = ks.length - 1;
  if (f <= ks[0]) return vs[0];
  if (f >= ks[last]) return vs[last];
  let i = 0;
  while (i < last - 1 && f > ks[i + 1]) i++;
  const t = clamp01((f - ks[i]) / (ks[i + 1] - ks[i]));
  const ef = Array.isArray(e) ? (e[i] || EZ.glide) : e;
  return lerp(vs[i], vs[i + 1], ef(t));
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   GEOMETRÍA DEL MUNDO (1920×1080). La cámara se encarga del encuadre.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/* la pila de cifras · el 70 nace en el acto 1 y NO se mueve al cruzar la frontera A */
const STK_X = 900;
const S_W = 520, S_H = 150;                 // losa normal (70 · ×12,6)
const S0_Y = 452;                           // ← el 70: el eje que sobrevive a la FRONTERA A
const S1_Y = S0_Y - S_H - 14;               // ← ×12,6 cae encima
const R_W = 704, R_H = 200;                 // la losa del RESULTADO: más ancha y más gruesa
const R_Y = S0_Y + S_H / 2 + R_H / 2 + 16;  // sale de ABAJO de la pila
const UND_Y = S0_Y + S_H / 2;               // el subrayado del cable = canto inferior de la losa
const UND_X0 = STK_X - S_W / 2, UND_X1 = STK_X + S_W / 2;

/* la batería transparente (acto 3) */
const BAT_X = 960, BAT_Y = 560, BAT_W = 760, BAT_H = 440, BAT_PAD = 28;
const iL = BAT_X - BAT_W / 2 + BAT_PAD, iT = BAT_Y - BAT_H / 2 + BAT_PAD;
const iR = BAT_X + BAT_W / 2 - BAT_PAD, iB = BAT_Y + BAT_H / 2 - BAT_PAD;
const iW = iR - iL, iH = iB - iT;
/* ⚑ el nivel de la MITAD cae EXACTAMENTE en y = 560 = BAT_Y … que es el EJE del acto 4.
      Eso no es casualidad: es la FRONTERA C. */
const AXIS_Y = iT + iH * 0.5;               // === 560
const AX0 = 470, AX1 = 1500;                // el eje del tiempo, ya estirado

/* las dos curvas (acto 4) */
const SPK_X = 522, SPK_TOP = 210, SPK_W = 88;     // la patada: casi vertical, 2 s de meseta alta
const PLA_X0 = 800, PLA_X1 = 1470, PLA_Y = 470;   // el goteo: meseta baja y larga

/* utilidades mundo → % (MediaCard e IconPng piden porcentaje del cuadro) */
const wp = (X: number) => (X / 1920) * 100;
const hp = (Y: number) => (Y / 1080) * 100;

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 1 · EL CABLE ROJO — la materia que llega de MovPico y se endereza en el subrayado del 70
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const CableRojo: React.FC<{ f: number; t: number; op: number }> = ({ f, t, op }) => {
  if (op <= 0.01) return null;
  const k = clamp01(t);
  // el cable llega enrollado desde fuera de cuadro (izquierda) y se estira hasta ser una recta
  const x0 = lerp(-260, UND_X0, k), y0 = lerp(268, UND_Y, k);
  const c1x = lerp(120, UND_X0 + 120, k), c1y = lerp(760, UND_Y, k);
  const c2x = lerp(520, UND_X1 - 120, k), c2y = lerp(96, UND_Y, k);
  const x1 = lerp(1130, UND_X1, k), y1 = lerp(640, UND_Y, k);
  // sobra de cable que sigue saliendo del cuadro mientras se endereza (nunca "aparece" de la nada)
  const tail = 1 - k;
  const d = `M ${x0.toFixed(1)},${y0.toFixed(1)} C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  const wob = Math.sin(f / 23) * (1.4 * tail + 0.25);
  return (
    <g opacity={op} transform={`translate(0 ${wob.toFixed(2)})`}>
      {/* sombra de contacto del cable sobre el plástico de la etiqueta */}
      <path d={d} fill="none" stroke={rgba(V.ink0, 0.72)} strokeWidth={lerp(34, 20, k)} strokeLinecap="round" transform="translate(0 13)" />
      {/* goma */}
      <path d={d} fill="none" stroke={RED_CABLE} strokeWidth={lerp(30, 16, k)} strokeLinecap="round" />
      {/* brillo especular del caucho: sin esto es una línea, con esto es un cable */}
      <path d={d} fill="none" stroke={rgba(V.white, 0.34)} strokeWidth={lerp(8, 4, k)} strokeLinecap="round" transform="translate(0 -5)" />
      {/* el ojal de la punta, que se pierde fuera de cuadro mientras queda cable por estirar */}
      {tail > 0.04 && (
        <circle cx={x0} cy={y0} r={lerp(4, 17, tail)} fill="none" stroke={rgba(RED_CABLE, 0.9)} strokeWidth={lerp(4, 11, tail)} />
      )}
    </g>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTOS 1-2 · LA PILA DE CIFRAS — objetos con peso, no renglones de una tabla
   Cada losa tiene canto, bisel, sombra de contacto sobre la de abajo y micro-deriva propia.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
// ⚑ `body` y el CONTENIDO son independientes a propósito: en el acto 1 el **70** existe SIN losa
//    (flota sobre el plástico de la etiqueta, subrayado por el cable rojo) y en la FRONTERA A le
//    crece el cuerpo DESDE EL CANTO INFERIOR — que es exactamente donde quedó el cable. La cifra
//    no se mueve, no cambia de tamaño y no se re-monta: es el MISMO nodo. Eso es el match-shape.
const Slab: React.FC<{
  f: number; x: number; y: number; w: number; h: number; body: number; op: number;
  edge?: string; big?: boolean; children: React.ReactNode; sub?: string;
}> = ({ f, x, y, w, h, body, op, edge = V.volt, big = false, children, sub }) => {
  if (op <= 0.01) return null;
  const g = clamp01(body);
  const bob = Math.sin(f / 57 + x / 220) * 1.7;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: y - h / 2 + bob, width: w, height: h,
      opacity: op, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* EL CUERPO de la losa: crece desde el canto inferior (transform-origin abajo) */}
      {g > 0.005 && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden", opacity: clamp01(g * 2.2),
          transform: `scaleY(${lerp(0.04, 1, g).toFixed(4)})`, transformOrigin: "50% 100%",
          background: `linear-gradient(178deg, ${rgba(V.ink2, 0.94)} 0%, ${rgba(V.ink1, 0.97)} 62%, ${rgba(V.ink0, 0.99)} 100%)`,
          boxShadow: `0 ${Math.round(h * 0.2)}px ${Math.round(h * 0.3)}px ${rgba(V.ink0, 0.85)}, inset 0 1px 0 ${rgba(V.white, 0.16)}, inset 0 -3px 0 ${rgba(edge, 0.92)}`,
          border: `1px solid ${rgba(edge, 0.3)}`,
        }}>
          {/* la cara de la losa toma la key voltio por arriba */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(174deg, ${rgba(V.volt, 0.09)} 0%, rgba(0,0,0,0) 44%)` }} />
        </div>
      )}
      {/* LA CIFRA — siempre entera, con o sin cuerpo debajo */}
      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 14 }}>
        {children}
      </div>
      {sub && (
        <div style={{
          position: "absolute", right: 22, bottom: big ? 14 : 10,
          fontFamily: F_BODY, fontWeight: 700, fontSize: big ? 25 : 21, letterSpacing: 3.2,
          color: rgba(V.white, 0.44), textTransform: "uppercase", opacity: clamp01(g * 2 - 1),
        }}>{sub}</div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   ACTO 3 · LA BATERÍA TRANSPARENTE — el acto que tiene que quedar en la memoria.
   No existe la foto: se construye. Carcasa de vidrio, SEIS celdas (una batería de plomo tiene
   seis), líquido de energía con oleaje y burbujas, dos bornes con tapa roja y tapa negra, y el
   polvillo blanco seco alrededor de uno (el detalle del glosario que la vuelve LA batería y no
   una batería). Va apoyada sobre la foto real del banco: cama de material debajo de todo.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const BateriaClara: React.FC<{
  f: number; op: number; lvl: number; ruin: number; open: number; tint: string;
}> = ({ f, op, lvl, ruin, open, tint }) => {
  if (op <= 0.01) return null;
  const L = BAT_X - BAT_W / 2, T = BAT_Y - BAT_H / 2, R = BAT_X + BAT_W / 2, B = BAT_Y + BAT_H / 2;
  const yLvl = iB - iH * clamp01(lvl);
  const wave = (X: number) => Math.sin(X / 52 + f / 16) * 4.4 + Math.sin(X / 21 - f / 10) * 2.0;
  const surf = Array.from({ length: 17 }, (_, i) => {
    const X = iL + (iW * i) / 16;
    return `${i ? "L" : "M"} ${X.toFixed(1)},${(yLvl + wave(X)).toFixed(1)}`;
  }).join(" ");
  const cellW = iW / 6;
  return (
    <g opacity={op}>
      <defs>
        <linearGradient id="cta_glass" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={rgba(V.white, 0.16)} />
          <stop offset="38%" stopColor={rgba(V.white, 0.045)} />
          <stop offset="100%" stopColor={rgba(V.ink0, 0.5)} />
        </linearGradient>
        <linearGradient id="cta_juice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.volt, 0.62)} />
          <stop offset="52%" stopColor={rgba(V.volt, 0.34)} />
          <stop offset="100%" stopColor={rgba(V.voltSoft, 0.26)} />
        </linearGradient>
        <pattern id="cta_hatch" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1={0} y1={0} x2={0} y2={22} stroke={rgba(V.danger, 0.62)} strokeWidth={6} />
        </pattern>
        <clipPath id="cta_inner"><rect x={iL} y={iT} width={iW} height={iH} rx={8} /></clipPath>
      </defs>

      {/* sombra de contacto: la batería APOYA en el banco de la foto, no flota */}
      <ellipse cx={BAT_X} cy={B + 16} rx={BAT_W * 0.5} ry={20} fill={rgba(V.ink0, 0.78)} />

      {/* los dos bornes, arriba: tapa ROJA y tapa NEGRA (glosario del canal) */}
      {[[BAT_X - 232, RED_CABLE], [BAT_X + 232, "#26282A"]].map(([px, cap], i) => (
        <g key={i}>
          <rect x={(px as number) - 34} y={T - 40} width={68} height={46} rx={7} fill={LEAD} stroke={rgba(V.ink0, 0.6)} strokeWidth={3} />
          <rect x={(px as number) - 34} y={T - 40} width={68} height={16} rx={6} fill={rgba(V.white, 0.24)} />
          <rect x={(px as number) - 44} y={T - 56} width={88} height={22} rx={8} fill={cap as string} stroke={rgba(V.ink0, 0.55)} strokeWidth={3} />
        </g>
      ))}
      {/* el polvillo blanco seco alrededor del borne izquierdo: la batería tiene cuatro años */}
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i}
          cx={BAT_X - 232 + (rnd(i * 3.7) - 0.5) * 128} cy={T - 2 + (rnd(i * 8.1) - 0.5) * 22}
          r={3 + rnd(i * 5.5) * 7} fill={rgba("#E6E4DA", 0.42 + rnd(i * 2.3) * 0.3)} />
      ))}

      {/* CARCASA: el vidrio. `open` la vuelve transparente (antes es plástico opaco). */}
      <rect x={L} y={T} width={BAT_W} height={BAT_H} rx={16}
        fill={rgba("#23261F", lerp(0.97, 0.2, open))} stroke={rgba(V.white, 0.14)} strokeWidth={2} />
      <rect x={L} y={T} width={BAT_W} height={BAT_H} rx={16} fill="url(#cta_glass)" opacity={open} />

      <g clipPath="url(#cta_inner)" opacity={open}>
        {/* EL LÍQUIDO DE ENERGÍA */}
        <path d={`${surf} L ${iR},${iB} L ${iL},${iB} Z`} fill="url(#cta_juice)" />
        <path d={surf} fill="none" stroke={rgba(tint, 0.95)} strokeWidth={4} />
        {/* burbujas: sin esto es un rectángulo de color; con esto es un líquido */}
        {Array.from({ length: 22 }, (_, i) => {
          const bx = iL + rnd(i * 4.3) * iW;
          const span = iB - yLvl;
          if (span < 24) return null;
          const by = iB - ((rnd(i * 9.7) * span + f * (0.5 + rnd(i * 2.1) * 1.5)) % span);
          return <circle key={i} cx={bx} cy={by} r={2 + rnd(i * 6.1) * 4}
            fill={rgba(V.white, 0.1 + rnd(i * 7.3) * 0.24)} />;
        })}
        {/* LA ZONA DE RUINA: de la mitad para abajo, rayada. Se enciende cuando el nivel la toca. */}
        {ruin > 0.01 && (
          <g opacity={ruin}>
            <rect x={iL} y={AXIS_Y} width={iW} height={iB - AXIS_Y} fill="url(#cta_hatch)" opacity={0.36} />
            <rect x={iL} y={AXIS_Y} width={iW} height={iB - AXIS_Y} fill={rgba(V.danger, 0.1)} />
          </g>
        )}
        {/* LAS SEIS CELDAS: los tabiques de plomo que separan los vasos */}
        {[1, 2, 3, 4, 5].map((k) => (
          <g key={k}>
            <line x1={iL + cellW * k} y1={iT} x2={iL + cellW * k} y2={iB} stroke={rgba(V.ink0, 0.6)} strokeWidth={9} />
            <line x1={iL + cellW * k} y1={iT} x2={iL + cellW * k} y2={iB} stroke={rgba(V.white, 0.16)} strokeWidth={2} />
          </g>
        ))}
      </g>

      {/* bisel del vidrio y reflejo de la key: la carcasa es un objeto, no un contorno */}
      <rect x={L} y={T} width={BAT_W} height={BAT_H} rx={16} fill="none"
        stroke={rgba(V.white, 0.26 + 0.14 * open)} strokeWidth={3} />
      <path d={`M ${L + 26},${T + 12} L ${L + BAT_W * 0.42},${T + 12} L ${L + BAT_W * 0.3},${B - 18} L ${L + 14},${B - 18} Z`}
        fill={rgba(V.white, 0.05 * open)} />
    </g>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   FRONTERA C + ACTO 4 · LA LÍNEA DE LA MITAD → EL EJE DEL TIEMPO
   El MISMO objeto: nace punteado cruzando la carcasa y termina siendo el eje sobre el que se
   dibujan las dos curvas. Nunca desaparece, sólo se estira y se endurece.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
const LineaMitad: React.FC<{ f: number; op: number; ext: number; tint: string }> = ({ f, op, ext, tint }) => {
  if (op <= 0.01) return null;
  const e = clamp01(ext);
  const x0 = lerp(iL - 26, AX0, e), x1 = lerp(iR + 26, AX1, e);
  const dash = lerp(16, 0, e);
  return (
    <g opacity={op}>
      <line x1={x0} y1={AXIS_Y} x2={x1} y2={AXIS_Y} stroke={rgba(V.ink0, 0.8)} strokeWidth={9} transform="translate(0 4)" />
      <line x1={x0} y1={AXIS_Y} x2={x1} y2={AXIS_Y} stroke={tint} strokeWidth={lerp(4, 5.5, e)}
        strokeDasharray={dash > 0.4 ? `${dash.toFixed(1)} ${(dash * 0.85).toFixed(1)}` : undefined} strokeLinecap="round" />
      {/* la punta viva que va estirando la línea hacia la derecha (el vector del MATCH-MOVE) */}
      {e > 0.02 && e < 0.99 && (
        <circle cx={x1} cy={AXIS_Y} r={9 + Math.sin(f / 8) * 2} fill={tint} stroke={rgba(V.ink0, 0.8)} strokeWidth={3} />
      )}
      {/* marcas del eje, sólo cuando ya es eje */}
      {e > 0.6 && (
        <g opacity={clamp01((e - 0.6) / 0.35)}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
            const X = AX0 + ((AX1 - AX0) * k) / 8;
            return <line key={k} x1={X} y1={AXIS_Y} x2={X} y2={AXIS_Y + (k % 2 ? 10 : 20)}
              stroke={rgba(V.white, k % 2 ? 0.24 : 0.52)} strokeWidth={k % 2 ? 2 : 3} />;
          })}
        </g>
      )}
    </g>
  );
};

/* las dos curvas: dos CARÁCTERES opuestos, no dos etiquetas ─────────────────────────────── */
const D_KICK =
  `M ${AX0},${AXIS_Y} L ${SPK_X - 18},${AXIS_Y} L ${SPK_X},${SPK_TOP} ` +
  `L ${SPK_X + SPK_W},${SPK_TOP} L ${SPK_X + SPK_W + 18},${AXIS_Y} L ${AX1},${AXIS_Y}`;
const D_DRIP =
  `M ${AX0},${AXIS_Y} L ${PLA_X0 - 34},${AXIS_Y} L ${PLA_X0},${PLA_Y} ` +
  `L ${PLA_X1},${PLA_Y} L ${PLA_X1 + 30},${AXIS_Y}`;

const Curvas: React.FC<{ f: number; kick: number; drip: number; op: number }> = ({ f, kick, drip, op }) => {
  if (op <= 0.01) return null;
  const k = clamp01(kick), d = clamp01(drip);
  // el nervio de la patada: mientras está arriba, tiembla (300 A no es un número tranquilo)
  const jit = k > 0.25 && k < 0.95 ? Math.sin(f / 2.6) * 2.6 + Math.sin(f / 5.1) * 1.4 : 0;
  return (
    <g opacity={op}>
      <defs>
        <clipPath id="cta_cutK"><rect x={AX0 - 10} y={0} width={lerp(0, AX1 - AX0 + 20, k)} height={1080} /></clipPath>
        <clipPath id="cta_cutD"><rect x={AX0 - 10} y={0} width={lerp(0, AX1 - AX0 + 20, d)} height={1080} /></clipPath>
      </defs>
      {/* ── EL GOTEO: área voltio, larga, plana, paciente ── */}
      <g clipPath="url(#cta_cutD)">
        <path d={`${D_DRIP} L ${AX1},${AXIS_Y} Z`} fill={rgba(V.volt, 0.2)} />
        <path d={D_DRIP} fill="none" stroke={rgba(V.ink0, 0.8)} strokeWidth={11} strokeLinejoin="round" transform="translate(0 5)" />
        <path d={D_DRIP} fill="none" stroke={V.volt} strokeWidth={6} strokeLinejoin="round" />
      </g>
      {/* ── LA PATADA: área ámbar, altísima, angosta, violenta ── */}
      <g clipPath="url(#cta_cutK)" transform={`translate(${jit.toFixed(2)} 0)`}>
        <path d={`${D_KICK} L ${AX1},${AXIS_Y} Z`} fill={rgba(V.amber, 0.24)} />
        <path d={D_KICK} fill="none" stroke={rgba(V.ink0, 0.8)} strokeWidth={12} strokeLinejoin="round" transform="translate(0 5)" />
        <path d={D_KICK} fill="none" stroke={V.amber} strokeWidth={7} strokeLinejoin="round" />
        {/* el destello en la cresta: la patada quema */}
        {k > 0.3 && (
          <rect x={SPK_X - 6} y={SPK_TOP - 8} width={SPK_W + 12} height={16} rx={8}
            fill={rgba(V.white, 0.4 + 0.3 * Math.sin(f / 5))} />
        )}
      </g>
      {/* los dos tramos de tiempo, medidos sobre el eje: 2 SEGUNDOS contra 8 HORAS */}
      {k > 0.6 && (
        <g opacity={clamp01((k - 0.6) / 0.3)}>
          <line x1={SPK_X} y1={AXIS_Y + 30} x2={SPK_X + SPK_W} y2={AXIS_Y + 30} stroke={V.amber} strokeWidth={5} />
          <line x1={SPK_X} y1={AXIS_Y + 20} x2={SPK_X} y2={AXIS_Y + 40} stroke={V.amber} strokeWidth={5} />
          <line x1={SPK_X + SPK_W} y1={AXIS_Y + 20} x2={SPK_X + SPK_W} y2={AXIS_Y + 40} stroke={V.amber} strokeWidth={5} />
        </g>
      )}
      {d > 0.7 && (
        <g opacity={clamp01((d - 0.7) / 0.25)}>
          <line x1={PLA_X0} y1={AXIS_Y + 30} x2={PLA_X1} y2={AXIS_Y + 30} stroke={V.volt} strokeWidth={5} />
          <line x1={PLA_X0} y1={AXIS_Y + 20} x2={PLA_X0} y2={AXIS_Y + 40} stroke={V.volt} strokeWidth={5} />
          <line x1={PLA_X1} y1={AXIS_Y + 20} x2={PLA_X1} y2={AXIS_Y + 40} stroke={V.volt} strokeWidth={5} />
        </g>
      )}
    </g>
  );
};

/* ── polvo de primer plano (profundidad real, nunca quieto) ─────────────────────────────────── */
const Grit: React.FC<{ f: number; n: number; seed: number; tint: string; op: number; drive: number }> = ({
  f, n, seed, tint, op, drive,
}) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i * 2.17), b = rnd(seed + i * 5.03);
      const x = ((a * 128 - 14 + f * (0.05 + drive * 0.7) * (0.4 + b)) % 128 + 128) % 128 - 14;
      const y = a * 106 - 3 + Math.sin(f / (54 + b * 62) + i) * (1.3 + drive * 4);
      const dd = 2 + b * 4.8;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: dd * (1 + drive * 1.8), height: dd, borderRadius: "50%",
          background: rgba(tint, 0.5), opacity: (0.14 + a * 0.5) * op,
        }} />
      );
    })}
  </div>
);

/* ── tarjeta de MATERIAL REAL: el clip corre `vid` frames y después pasa a la foto del mismo
      plano, así NUNCA se congela ni se pasa de largo del mp4 ─────────────────────────────── */
// ⚠️ `clip`/`still` van como STRINGS LITERALES en cada uso (nunca por template literal): el
// escáner de assets del build lee los .tsx en crudo y un `${}` le queda invisible → 404 en el farm.
// ⚠️ VID es un techo CONSERVADOR (2,8 s): cualquier clip de la tanda lo aguanta y después la
// tarjeta pasa a la foto del mismo plano sin que se note.
const VID = 84;
type CardGeo = {
  w: number; h: number; x: number; y: number; z: number; ry?: number; rx?: number; rot?: number;
  radius?: number; label?: string; lit: number; litColor?: string; opacity: number;
};
const RealCard: React.FC<{ f: number; clip: string; still: string; mount: number; out: number } & CardGeo> = ({
  f, clip, still, mount, out, ...geo
}) => {
  if (f < mount || f >= out) return null;
  const swap = mount + VID;
  if (f < swap) {
    return (
      <Sequence from={mount} durationInFrames={VID} layout="none">
        <MediaCard src={clip} kind="video" sheenAt={12} {...geo} />
      </Sequence>
    );
  }
  return (
    <Sequence from={swap} durationInFrames={Math.max(2, out - swap)} layout="none">
      <MediaCard src={still} kind="photo" sheenAt={0} {...geo} />
    </Sequence>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════════════════
   EL MOVIMIENTO
   ══════════════════════════════════════════════════════════════════════════════════════════ */
export const MovCuenta: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const D = durationInFrames;
  const f = useCurrentFrame();
  /** todos los anclajes son FRACCIONES de la duración: el movimiento sobrevive al re-anclaje */
  const A = (x: number) => Math.round(D * x);

  /* ── anclas del guion (S06 · P28–P39) ────────────────────────────────────────────────────── */
  const K = {
    a1: 0,                 // "mi batería dice setenta amperios hora en la etiqueta"
    cab: A(0.045),         // el cable termina de enderezarse: ya es el subrayado
    n70: A(0.072),         // salta el 70
    a2: A(0.155),          // "ese número, multiplicado por los doce voltios y algo…"
    v126: A(0.215),        // cae el 12,6
    r880: A(0.285),        // "…da alrededor de ochocientos ochenta vatios hora"
    a3: A(0.375),          // "de esos ochocientos ochenta no puedes usar ni la mitad"
    half: A(0.47),         // el nivel se clava en la mitad
    ruina: A(0.53),        // "una batería de plomo, si la descargas más allá de la mitad, se arruina"
    a4: A(0.615),          // "el segundo, y este es el importante"
    kick: A(0.665),        // "una patada bestial de trescientos amperios durante dos segundos"
    drip: A(0.742),        // "no está hecha para dar de a poquito durante ocho horas"
    zoom: A(0.838),        // FRONTERA D · la cámara entra por el área del goteo
    a5: A(0.845),          // "cuatrocientos cuarenta vatios hora reales"
    pap: A(0.93),          // el 440 se acuesta y se vuelve papel
  };

  /* ══ LA CÁMARA — UNA sola. El reloj se deforma por acto pero la Z es MONÓTONA: 140 → 20. ══ */
  const clk = keyed(f,
    [0, K.cab, K.a2, K.v126, K.r880, K.a3, K.half, K.ruina, K.a4, K.kick, K.drip, K.zoom, K.pap, D],
    [0, A(0.052), A(0.16), A(0.222), A(0.3), A(0.386), A(0.478), A(0.542), A(0.628), A(0.678), A(0.752), A(0.845), A(0.936), D],
    [EZ.soft, EZ.glide, EZ.push, EZ.snap, EZ.glide, EZ.soft, EZ.lin, EZ.push, EZ.snap, EZ.glide, EZ.push, EZ.soft, EZ.glide]);
  const g = gcam(clk, { z0: 140, z1: 20, dur: D });
  /* el pan y el ry NO los maneja gcam: vienen HEREDADOS de MovPico (−60 / −5°) y se deshacen
     hacia el pan que pide MovTabla (panY −90). Van DESPUÉS del perspective() de gcam. */
  const camX = keyed(f, [0, K.a2, K.a3, K.a4, K.a5, D], [-60, -44, -22, -6, 0, 0], EZ.soft);
  const camY = keyed(f, [0, K.a3, K.a4, K.a5, K.pap, D], [0, -6, -18, -44, -74, -90], [EZ.soft, EZ.glide, EZ.push, EZ.soft, EZ.glide]);
  const camRY = keyed(f, [0, K.a2, K.a3, K.a4, D], [-5, -3.6, -2, -0.7, 0], EZ.soft);
  /* sacudones: la losa del 880 que aterriza y la patada de 300 A. La cámara PESA. */
  const shake =
    (f > K.r880 && f < K.r880 + 12 ? Math.sin((f - K.r880) / 1.3) * (12 - (f - K.r880)) * 0.75 : 0) +
    (f > K.kick && f < K.kick + 14 ? Math.sin((f - K.kick) / 1.1) * (14 - (f - K.kick)) * 0.62 : 0);
  const cam =
    `${g.transform} translate3d(${(camX + shake).toFixed(2)}px, ${(camY + shake * 0.4).toFixed(2)}px, 0) ` +
    `rotateY(${camRY.toFixed(3)}deg)`;
  const mag = 1500 / (1500 - g.z);

  /* encuadre: qué punto del MUNDO va al centro y a qué aumento neto (macro → producto → general) */
  const net = keyed(f,
    [0, K.cab, K.n70, K.a2, K.v126, K.r880, K.a3, K.half, K.ruina, K.a4, K.kick, K.drip, K.zoom, K.a5, K.pap, D],
    [0.92, 1.06, 1.14, 1.02, 1.03, 0.96, 0.94, 1.06, 1.12, 1.0, 0.96, 0.92, 0.9, 0.9, 0.98, 0.9],
    [EZ.push, EZ.soft, EZ.glide, EZ.lin, EZ.snap, EZ.soft, EZ.push, EZ.soft, EZ.glide, EZ.snap, EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.glide]);
  const fx = keyed(f,
    [0, K.n70, K.a2, K.r880, K.a3, K.half, K.a4, K.kick, K.drip, K.zoom, K.a5, D],
    [900, STK_X, STK_X, STK_X + 60, 1010, BAT_X, 985, 700, 1040, 1090, 960, 960],
    [EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.snap, EZ.push, EZ.soft, EZ.glide, EZ.soft]);
  const fy = keyed(f,
    [0, K.n70, K.a2, K.r880, K.a3, K.half, K.a4, K.kick, K.drip, K.zoom, K.a5, K.pap, D],
    [470, S0_Y, S0_Y - 40, R_Y - 60, 520, BAT_Y, AXIS_Y, 560, 500, 520, 480, 540, 600],
    [EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.push, EZ.glide, EZ.snap, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.glide]);
  const ws = net / mag;                                   // escala del mundo para dar el encuadre pedido
  const panX = 960 - fx, panY = 540 - fy;
  /** mundo → pantalla (para clavar las cifras del kit al lado de su gráfico, en espacio de PANTALLA) */
  const sx = (X: number) => ((960 + net * (X - fx)) / 1920) * 100;
  const sy = (Y: number) => ((540 + net * (Y - fy)) / 1080) * 100;

  /* ══ LA LUZ — VOLTIO FILOSO (key izquierda, contraste alto) → VOLTIO SOBRE BLANCO NACIENTE ══
        La key BARRE de .30 a .74 (izquierda → derecha, hacia donde cae el papel), la intensidad
        baja de 1.16 a .90 (el filo se ablanda) y el PISO se aclara cuando la hoja rebota luz. */
  const warm = keyed(f, [0, K.a4, K.a5, K.pap, D], [0, 0.03, 0.07, 0.14, 0.2], EZ.soft);
  const tint = light(warm, "volt", "torch");
  const keyLift = keyed(f, [0, K.a2, K.a3, K.a4, K.a5, K.pap, D], [0.3, 0.33, 0.4, 0.46, 0.56, 0.68, 0.74], EZ.soft);
  const inten = keyed(f, [0, K.n70, K.a2, K.r880, K.a3, K.kick, K.a5, D],
    [1.16, 1.2, 1.06, 1.18, 1.0, 1.22, 0.98, 0.9], EZ.soft);
  const floor = keyed(f, [0, K.a3, K.a5, K.pap, D], [0.6, 0.55, 0.48, 0.38, 0.3], EZ.soft);

  /* ══ EL AIRE — se aquieta: .20 → .05, con UN respingo en la patada de 300 A ═══════════════ */
  const wind = keyed(f,
    [0, K.a2, K.a3, K.half, K.a4, K.kick, K.kick + 26, K.drip, K.a5, K.pap, D],
    [0.2, 0.19, 0.15, 0.14, 0.13, 0.26, 0.13, 0.1, 0.09, 0.06, 0.05],
    [EZ.soft, EZ.glide, EZ.lin, EZ.soft, EZ.expo, EZ.push, EZ.soft, EZ.glide, EZ.soft, EZ.glide]);

  /* ══ ACTO 1 · EL CABLE y el subrayado ════════════════════════════════════════════════════ */
  const cableT = keyed(f, [0, K.cab], [0, 1], EZ.push);
  const cableOp = keyed(f, [0, 6, K.a2 + 20, K.a2 + 52], [0.9, 1, 1, 0], [EZ.lin, EZ.lin, EZ.soft]);

  /* ══ ACTOS 1-2 · LA PILA ═════════════════════════════════════════════════════════════════ */
  // la losa del 70 nace en la FRONTERA A: la cifra ya estaba, el cuerpo crece desde el canto rojo
  const s0Grow = keyed(f, [K.n70, K.a2 - 6, K.a2 + 22], [0, 0, 1], [EZ.lin, EZ.snap]);
  // el salto de instrumento del 70 al aparecer (lo mismo que hace `Readout` con su `at`)
  const s0Pop = keyed(f, [K.n70, K.n70 + 5, K.n70 + 13], [1.2, 0.965, 1], [EZ.expo, EZ.snap]);
  const s0Op = keyed(f, [K.n70 - 8, K.n70 + 4, K.a3 - 16, K.a3 - 14], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin]);
  const s0Squash = f > K.v126 ? clamp01(1 - (f - K.v126) / 10) * 5 : 0;   // el 12,6 lo comprime al caer
  const s1Grow = keyed(f, [K.v126 - 10, K.v126 + 8], [0, 1], EZ.snap);
  const s1Drop = keyed(f, [K.v126 - 22, K.v126], [-260, 0], EZ.expo);
  const s1Op = keyed(f, [K.v126 - 22, K.v126 - 14, K.a3 - 16, K.a3 - 14], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin]);
  const rGrow = keyed(f, [K.r880 - 12, K.r880 + 10], [0, 1], EZ.snap);
  const rSlide = keyed(f, [K.r880 - 12, K.r880 + 6], [-70, 0], EZ.expo);
  const rOp = keyed(f, [K.r880 - 12, K.r880 - 2, K.a3 - 16, K.a3 - 14], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin]);

  /* ══ ACTO 3 · LA BATERÍA TRANSPARENTE ════════════════════════════════════════════════════ */
  const batOp = keyed(f, [K.a3 - 16, K.a3 - 14, K.a4 + 30, K.a4 + 46], [0, 1, 1, 0], [EZ.lin, EZ.lin, EZ.lin]);
  const batOpen = keyed(f, [K.a3 + 10, K.a3 + 54], [0, 1], EZ.glide);     // el plástico se vuelve vidrio
  const lvl = keyed(f, [K.a3 + 40, K.half - 6, K.half + 6, D], [1, 0.5, 0.5, 0.5], [EZ.glide, EZ.snap, EZ.lin]);
  const ruin = keyed(f, [K.ruina - 14, K.ruina + 14, K.a4, K.a4 + 30], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  // la carcasa SALE del cuadro por la izquierda en la FRONTERA C (no se funde: se va)
  const batOut = keyed(f, [K.a4 - 14, K.a4 + 34], [0, -1560], EZ.push);

  /* ══ FRONTERA C + ACTO 4 · LA LÍNEA → EL EJE → LAS CURVAS ════════════════════════════════ */
  const lineOp = keyed(f, [K.half - 6, K.half + 10, K.zoom - 6, K.zoom + 10], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);
  const lineExt = keyed(f, [K.a4 - 10, K.a4 + 42], [0, 1], EZ.push);
  const kickDraw = keyed(f, [K.kick - 16, K.kick + 4, K.kick + 22], [0, 0.62, 1], [EZ.expo, EZ.soft]);
  const dripDraw = keyed(f, [K.drip - 12, K.drip + 44], [0, 1], EZ.glide);
  const curvesOp = keyed(f, [K.kick - 18, K.kick - 4, K.zoom - 4, K.zoom + 12], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft]);

  /* ══ FRONTERA D · ZOOM-THROUGH — entra por el área del goteo (donde vive la energía usable) ═ */
  const zt = zoomThrough(f, K.zoom, 22, sx(PLA_X0 + 120), sy(PLA_Y + 46));

  /* ══ ACTO 5 · EL 440 y la hoja de papel ══════════════════════════════════════════════════ */
  const n440 = keyed(f, [K.a5 - 4, K.a5 + 12], [0, 1], EZ.snap);
  const pap = keyed(f, [K.pap, D - 10], [0, 1], EZ.glide);

  /* ── parallax del texto (vive en espacio de pantalla, pero acompaña a la cámara) ─────────── */
  const paraX = -panX * 0.013, paraY = -panY * 0.01;
  const txt = (from: number, to: number, top = false) => {
    const inn = clamp01((f - from) / 14), out = clamp01((f - (to - 18)) / 18);
    return {
      on: f > from && f < to,
      style: {
        position: "absolute" as const, left: 96,
        ...(top ? { top: 96 } : { bottom: 108 }),
        transform: `translate(${paraX.toFixed(1)}px, ${paraY.toFixed(1)}px) translateY(${lerp(30, 0, EZ.snap(inn)).toFixed(1)}px)`,
        opacity: inn * (1 - out),
      },
    };
  };
  const t1 = txt(A(0.024), K.a2 - 10);
  const t2 = txt(K.a2 + 20, K.a3 - 12);
  const t3 = txt(K.ruina - 34, K.a4 - 10);
  const t4 = txt(K.a4 + 16, K.zoom - 12);
  const t5 = txt(K.a5 + 20, D - 6, true);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ══ LA ATMÓSFERA — montada UNA vez para los ~1500 frames. NUNCA se remonta. ═══════ */}
      <VoltAtmos tint={tint} tint2={V.amber} keyFrom={keyLift} intensity={inten} floor={floor} />

      {/* ══ EL MUNDO, bajo UNA sola cámara ══════════════════════════════════════════════ */}
      <Layers cam={cam}>
        {/* ── PLANO 1 (z −560): LA CAMA DE MATERIAL REAL a sangre. Nunca el fondo plano en los
               márgenes. Los dos cambios de cama caen DEBAJO de una costura que tapa: el primero
               bajo la oclusión del borne, el segundo dentro del zoom-through. ── */}
        {f < K.a3 - 14 ? (
          <PhotoPlane src="img/cmebateria/cmeb_mv_cuenta_etiquetaBateria.jpg" z={-560}
            scale={keyed(f, [0, K.n70, K.a2, K.a3], [1.34, 1.2, 1.26, 1.34], EZ.soft)}
            dim={keyed(f, [0, K.n70, K.a2], [0.3, 0.24, 0.44], EZ.soft)} tint={tint} />
        ) : f < K.zoom + 6 ? (
          <PhotoPlane src="img/cmebateria/cmeb_mv_cuenta_bateriaBanco.jpg" z={-560}
            scale={keyed(f, [K.a3, K.a4, K.zoom], [1.42, 1.3, 1.22], EZ.soft)}
            dim={keyed(f, [K.a3, K.ruina, K.a4, K.zoom], [0.46, 0.52, 0.58, 0.62], EZ.soft)} tint={tint} />
        ) : (
          <PhotoPlane src="img/cmebateria/cmeb_mv_cuenta_claudioCalcula.jpg" z={-560}
            scale={keyed(f, [K.zoom, K.pap, D], [1.5, 1.34, 1.26], EZ.soft)}
            dim={keyed(f, [K.zoom, K.a5, K.pap, D], [0.6, 0.66, 0.7, 0.74], EZ.soft)} tint={tint} />
        )}

        {/* ── PLANO 2 (z −340): el aire LEJANO (parallax propio, va más lento) ── */}
        <Plane z={-340}>
          <WindField speed={wind * 0.7} tint={V.white} count={16} opacity={0.55} />
        </Plane>

        {/* ── EL MUNDO ESCALADO (todo lo que la cámara encuadra) ── */}
        <AbsoluteFill style={{
          transform: `scale(${ws.toFixed(4)}) translate(${panX.toFixed(1)}px, ${panY.toFixed(1)}px)`,
          transformStyle: "preserve-3d",
        }}>
          {/* ▓▓ ACTOS 1-4 · todo lo que la FRONTERA D se traga en el zoom-through ▓▓ */}
          <div style={{
            position: "absolute", inset: 0, transformStyle: "preserve-3d",
            transform: zt.out === "none" ? undefined : zt.out,
            opacity: zt.opacity,
          }}>
            {/* ── PLANO 3 (z −60): EL ESQUELETO. Acá los vectores SÍ son legítimos: un cable es
                   un trazo, un eje es un eje, una curva de energía es una curva. ── */}
            <Plane z={-60}>
              <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
                {/* ACTO 1 · la materia que entra de MovPico */}
                <CableRojo f={f} t={cableT} op={cableOp} />
                {/* ACTO 3 · la batería transparente — sale del cuadro por la izquierda en la FRONTERA C */}
                <g transform={`translate(${batOut.toFixed(1)} 0)`}>
                  <BateriaClara f={f} op={batOp} lvl={lvl} ruin={ruin} open={batOpen} tint={tint} />
                </g>
                {/* FRONTERA C · el MISMO objeto: línea de la mitad → eje del tiempo */}
                <LineaMitad f={f} op={lineOp} ext={lineExt} tint={tint} />
                {/* ACTO 4 · los dos caracteres */}
                <Curvas f={f} kick={kickDraw} drip={dripDraw} op={curvesOp} />
              </svg>
            </Plane>

            {/* ── PLANO 4 (z +40): íconos PNG sin fondo como OBJETOS de la escena ── */}
            <Plane z={40}>
              {f > A(0.03) && f < K.a2 + 30 && (
                <IconPng src="img/cmebateria/cmeb_ic_regla.png"
                  x={wp(STK_X + 430)} y={hp(S0_Y - 120)} size={lerp(104, 126, clamp01((f - K.n70) / 110))} z={60} rot={-7}
                  opacity={keyed(f, [A(0.03), A(0.06), K.a2, K.a2 + 30], [0, 0.95, 0.95, 0], [EZ.push, EZ.lin, EZ.soft])} />
              )}
              {f > K.r880 - 12 && f < K.a3 && (
                <IconPng src="img/cmebateria/cmeb_ic_rayo.png"
                  x={wp(STK_X - R_W / 2 - 76)} y={hp(R_Y - 96)} size={132} z={90} rot={6}
                  opacity={keyed(f, [K.r880 - 12, K.r880 + 8, K.a3 - 26, K.a3], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
              )}
              {f > K.a3 + 20 && f < K.a4 + 10 && (
                <IconPng src="img/cmebateria/cmeb_ic_bateria.png"
                  x={wp(BAT_X - 560)} y={hp(BAT_Y - 250)} size={118} z={110} rot={-5}
                  opacity={keyed(f, [K.a3 + 20, K.a3 + 46, K.a4 - 16, K.a4 + 10], [0, 0.92, 0.92, 0], [EZ.push, EZ.lin, EZ.soft])} />
              )}
              {f > K.kick - 8 && f < K.zoom && (
                <IconPng src="img/cmebateria/cmeb_ic_auto.png"
                  x={wp(SPK_X - 190)} y={hp(SPK_TOP + 40)} size={138} z={120} rot={4}
                  opacity={keyed(f, [K.kick - 8, K.kick + 14, K.zoom - 30, K.zoom], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
              )}
              {f > K.drip - 10 && f < K.zoom && (
                <IconPng src="img/cmebateria/cmeb_ic_reloj.png"
                  x={wp((PLA_X0 + PLA_X1) / 2)} y={hp(PLA_Y - 176)} size={124} z={120} rot={-4}
                  opacity={keyed(f, [K.drip - 10, K.drip + 16, K.zoom - 30, K.zoom], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />
              )}
            </Plane>

            {/* ── PLANO 5 (z +120): LAS TARJETAS DE MATERIAL REAL — el caballo de batalla ── */}
            <Plane z={120}>
              {/* ▸ ACTO 1 · LA BATERÍA EN EL BANCO — mitad 1 del PAR DELIBERADO: acá es una tarjeta
                     de producto chica y lateral con luz VOLTIO; en los actos 3-4 el MISMO plano es
                     la cama a sangre debajo de la batería transparente. */}
              <MediaCard src="img/cmebateria/cmeb_mv_cuenta_bateriaBanco.jpg" kind="photo"
                w={396} h={244} x={wp(1470)} y={hp(300)} z={70} ry={-13} radius={12}
                label="LA MISMA BATERÍA DE SIEMPRE" lit={0.92} litColor={V.volt} sheenAt={A(0.05)}
                opacity={keyed(f, [A(0.02), A(0.05), K.a2 - 16, K.a2 + 8], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

              {/* ▸ ACTO 2 · CLAUDIO HACIENDO LA CUENTA — clip de héroe. "Vamos a hacerla juntos,
                     despacio, porque es la única cuenta de todo el video." */}
              <RealCard f={f}
                clip="broll/cmebateria/cmeb_mv_cuenta_claudioCalcula.mp4"
                still="img/cmebateria/cmeb_mv_cuenta_claudioCalcula.jpg"
                mount={K.a2 + 10} out={K.a3 - 14}
                w={400} h={248} x={wp(1470)} y={hp(650)} z={180} ry={-12} radius={13}
                label="LA ÚNICA CUENTA DEL VIDEO" lit={0.96} litColor={V.volt}
                opacity={keyed(f, [K.a2 + 10, K.a2 + 34, K.a3 - 16, K.a3 - 14], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.lin])} />

              {/* ▸ FRONTERA B · EL BORNE. Es UNA sola tarjeta que ENTRA en el acto 2, cruza la
                     oclusión (el plomo que tapa el cuadro es este mismo borne) y SALE ya en el
                     acto 3, arriba de la batería que se abre. La materia no se interrumpe. */}
              <MediaCard src="img/cmebateria/cmeb_mv_cuenta_borneMacro.jpg" kind="photo"
                w={lerp(330, 402, clamp01((f - (K.a3 - 40)) / 110))}
                h={lerp(206, 250, clamp01((f - (K.a3 - 40)) / 110))}
                x={lerp(wp(470), wp(392), clamp01((f - (K.a3 - 40)) / 110))}
                y={lerp(hp(760), hp(232), clamp01((f - (K.a3 - 40)) / 110))}
                z={150} ry={lerp(12, 15, clamp01((f - K.a3) / 90))} radius={12}
                label="POR ACÁ ENTRA Y SALE TODO" lit={0.9} litColor={V.volt} sheenAt={K.a3 + 14}
                opacity={keyed(f, [K.a3 - 62, K.a3 - 40, K.ruina + 20, K.ruina + 52], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

              {/* ▸ ACTO 4 · EL ARRANQUE — el clip cuelga DEBAJO de su propia curva: la tarjeta y
                     la patada son el mismo hecho contado dos veces. */}
              <RealCard f={f}
                clip="broll/cmebateria/cmeb_mv_cuenta_arranqueMotor.mp4"
                still="img/cmebateria/cmeb_mv_cuenta_arranqueMotor.jpg"
                mount={K.kick - 10} out={K.zoom - 4}
                w={380} h={234} x={wp(520)} y={hp(830)} z={140} ry={14} radius={13}
                label="300 A · DOS SEGUNDOS" lit={1} litColor={V.amber}
                opacity={keyed(f, [K.kick - 10, K.kick + 14, K.zoom - 26, K.zoom - 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

              {/* ▸ ACTO 4 · EL CICLO PROFUNDO — la otra tarjeta, debajo de la meseta larga. */}
              <RealCard f={f}
                clip="broll/cmebateria/cmeb_mv_cuenta_cicloProfundo.mp4"
                still="img/cmebateria/cmeb_mv_cuenta_cicloProfundo.jpg"
                mount={K.drip - 8} out={K.zoom - 4}
                w={420} h={258} x={wp(1420)} y={hp(818)} z={140} ry={-14} radius={13}
                label="ESTO LO HACE LA DE CICLO PROFUNDO" lit={0.96} litColor={V.volt}
                opacity={keyed(f, [K.drip - 8, K.drip + 18, K.zoom - 26, K.zoom - 4], [0, 1, 1, 0], [EZ.push, EZ.lin, EZ.soft])} />

              {/* ── LA PILA DE CIFRAS: objetos con peso, en el espacio del mundo ── */}
              {/* losa 1 · × 12,6 V — cae ENCIMA del 70 */}
              <div style={{ transform: `translateY(${s1Drop.toFixed(1)}px)` }}>
                <Slab f={f} x={STK_X} y={S1_Y} w={S_W} h={S_H} body={s1Grow} op={s1Op} edge={V.volt} sub="VOLTIOS">
                  <Num size={92} color={V.white}>×</Num>
                  <Num size={116} color={V.volt}>12,6</Num>
                </Slab>
              </div>
              {/* losa 0 · 70 Ah — LA CIFRA YA ESTÁ DESDE EL ACTO 1, flotando sobre el plástico de la
                     etiqueta y subrayada por el cable. En la FRONTERA A le crece el cuerpo desde ese
                     mismo canto: ni un píxel de movimiento, ni un cambio de cuerpo. Match-shape. */}
              <div style={{ transform: `translateY(${s0Squash.toFixed(1)}px) scale(${s0Pop.toFixed(3)})`, transformOrigin: "50% 50%" }}>
                <Slab f={f} x={STK_X} y={S0_Y} w={S_W} h={S_H} body={s0Grow} op={s0Op} edge={RED_CABLE} sub="AMPERIOS HORA">
                  <Num size={124} color={V.white}>70</Num>
                  <Num size={62} color={rgba(V.white, 0.6)}>Ah</Num>
                </Slab>
              </div>
              {/* losa RESULTADO · 880 Wh — sale de ABAJO, más ancha y más gruesa, y el golpe pesa */}
              <div style={{ transform: `translateY(${rSlide.toFixed(1)}px)` }}>
                <Slab f={f} x={STK_X} y={R_Y} w={R_W} h={R_H} body={rGrow} op={rOp} edge={V.volt} big sub="VATIOS HORA GUARDADOS">
                  <Num size={92} color={V.white}>=</Num>
                  <Num size={168} color={V.volt}>880</Num>
                  <Num size={76} color={rgba(V.volt, 0.72)}>Wh</Num>
                </Slab>
              </div>
            </Plane>
          </div>

          {/* ▓▓ ACTO 5 · EL NÚMERO QUE DECIDE TODO EL VIDEO — vive FUERA del zoom-through ▓▓
                 El 440 se acuesta (rotateX) y debajo le crece LA HOJA: la materia que se lleva
                 MovTabla. La hoja no aparece: sale de la cifra al aplanarse. */}
          {f > K.a5 - 20 && (
            <Plane z={110}>
              <div style={{
                position: "absolute", left: 960 - 620, top: 480 - 210, width: 1240, height: 420,
                transformStyle: "preserve-3d",
                transform: `perspective(1400px) rotateX(${lerp(0, 74, pap).toFixed(2)}deg) translateY(${lerp(0, 190, pap).toFixed(1)}px)`,
                transformOrigin: "50% 100%",
              }}>
                {/* LA HOJA: nace del ancho de la cifra y se abre hasta ser una página */}
                {pap > 0.01 && (
                  <div style={{
                    position: "absolute", left: lerp(430, 90, pap), top: lerp(300, 44, pap),
                    width: lerp(380, 1060, pap), height: lerp(24, 352, pap), borderRadius: 5,
                    background: `linear-gradient(172deg, ${PAPER} 0%, #E7E4D6 62%, #D8D4C4 100%)`,
                    boxShadow: `0 26px 70px ${rgba(V.ink0, 0.82)}, inset 0 1px 0 ${rgba(V.white, 0.9)}`,
                    opacity: clamp01(pap * 2.4),
                  }}>
                    {/* los renglones de la página que ya empieza a ser la lámina de MovTabla */}
                    {pap > 0.45 && Array.from({ length: 7 }, (_, i) => (
                      <div key={i} style={{
                        position: "absolute", left: "8%", right: `${8 + rnd(i * 3.1) * 26}%`,
                        top: `${18 + i * 11}%`, height: 6, borderRadius: 3,
                        background: rgba("#8C8878", 0.42), opacity: clamp01((pap - 0.45) / 0.4),
                      }} />
                    ))}
                  </div>
                )}
                {/* EL 440 — lo escribe el kit, con su unidad y su rótulo */}
                <div style={{
                  position: "absolute", left: 0, right: 0, top: lerp(40, 96, pap), textAlign: "center",
                  transform: `scale(${lerp(0.86, 1, EZ.snap(n440)) * lerp(1, 0.62, pap)})`,
                  opacity: n440,
                }}>
                  <div style={{
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 7,
                    color: pap > 0.5 ? rgba("#6E6A5C", 0.9) : rgba(V.white, 0.6),
                    textTransform: "uppercase", marginBottom: 10,
                  }}>PARA USAR SIN ARRUINAR NADA</div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 18 }}>
                    <Num size={300} color={pap > 0.5 ? "#2B2A24" : V.volt}>440</Num>
                    <Num size={110} color={pap > 0.5 ? rgba("#2B2A24", 0.7) : rgba(V.volt, 0.78)}>Wh</Num>
                  </div>
                </div>
              </div>
            </Plane>
          )}

          {/* ── PLANO 6 (z +300): el aire CERCANO (parallax propio, va más rápido) ── */}
          <Plane z={300}>
            <WindField speed={wind} tint={V.white} count={12} opacity={0.9} />
          </Plane>
        </AbsoluteFill>

        {/* ── PLANO 7 (z +430): polvo del banco de trabajo en primerísimo plano ── */}
        <Plane z={430}>
          <Grit f={f} n={16} seed={7} tint={warm > 0.1 ? V.bone : V.white} op={0.5 + wind * 0.5} drive={wind} />
        </Plane>
      </Layers>

      {/* ══════════════ LAS CIFRAS — las escribe SIEMPRE el kit, nunca el motor de imagen ══════ */}
      {/* ⚠️ El 70 del acto 1 NO se escribe acá: vive en el mundo, dentro de la losa 0 (arriba),
             porque tiene que ser EL MISMO NODO antes y después de la FRONTERA A. Dos "70" —uno en
             pantalla y otro en el mundo— hacían que la costura se leyera como un relevo. */}
      {/* ACTO 3 · lo que hay guardado, y dónde se termina lo que se puede tocar */}
      {f > K.a3 + 24 && f < K.a4 - 8 && (
        <Readout value="880" unit="Wh" label="ENERGÍA GUARDADA" at={K.a3 + 24}
          x={sx(BAT_X)} y={sy(BAT_Y - BAT_H / 2 - 108)} size={104} color={tint} />
      )}
      {f > K.half - 2 && f < K.a4 - 8 && (
        <div style={{
          position: "absolute", left: `${sx(iR + 128).toFixed(2)}%`, top: `${sy(AXIS_Y).toFixed(2)}%`,
          transform: `translate(-50%,-50%) scale(${lerp(0.82, 1, EZ.snap(clamp01((f - K.half) / 11))).toFixed(3)})`,
          opacity: clamp01((f - K.half + 2) / 10) * (1 - clamp01((f - (K.a4 - 26)) / 18)),
          padding: "12px 28px", borderRadius: 9, whiteSpace: "nowrap",
          background: `linear-gradient(180deg, ${rgba(V.volt, 0.96)} 0%, ${rgba(V.voltSoft, 0.86)} 100%)`,
          boxShadow: `0 16px 44px ${rgba(V.ink0, 0.82)}, inset 0 1px 0 ${rgba(V.white, 0.44)}`,
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 5,
          color: V.ink0, textTransform: "uppercase",
        }}>NI LA MITAD</div>
      )}
      {/* ACTO 4 · las dos cifras que definen los dos caracteres */}
      {f > K.kick - 2 && f < K.drip + 30 && (
        <Readout value="300" unit="A" label="DOS SEGUNDOS" at={K.kick}
          x={sx(SPK_X + SPK_W + 320)} y={sy(SPK_TOP + 90)} size={132} color={V.amber} />
      )}
      {f > K.drip - 2 && f < K.zoom - 6 && (
        <Readout value="8" unit="h" label="DE A POQUITO" at={K.drip}
          x={sx((PLA_X0 + PLA_X1) / 2)} y={sy(PLA_Y - 96)} size={132} color={V.volt} />
      )}

      {/* ══════════════ LAS COSTURAS ══════════════════════════════════════════════════════════
            A · MATCH-SHAPE  ─ dibujada (el 70 no se mueve; le crece el cuerpo). Sin overlay.
            B · OCLUSIÓN     ─ acá abajo: el PLOMO del borne cruza y tapa el 100%.
            C · MATCH-MOVE   ─ dibujada (la línea se estira y la cámara truckea sobre ella).
            D · ZOOM-THROUGH ─ `zoomThrough` aplicado al bloque de los actos 1-4.
            ⛔ NUNCA un fade. ⛔ dos fronteras seguidas nunca comparten costura. */}
      <SeamOcclude at={K.a3 - 22} dur={16} color={LEAD} angle={-7} />
      {/* golpes de beat (no son fronteras): la losa del 880 que aterriza y la patada de 300 A */}
      <SeamFlash at={K.r880} color={V.volt} dur={6} />
      <SeamFlash at={K.kick} color={V.amber} dur={5} />

      {/* ══════════════ TIPOGRAFÍA — UNA idea por acto, ≤7 palabras, cama oscura ═════════════ */}
      {t1.on && (
        <div style={t1.style}>
          <Bed pad={28} w={860}>
            <Kick>EL DATO DE ORIGEN</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>SETENTA <Em>AMPERIOS HORA</Em></Head>
          </Bed>
        </div>
      )}
      {t2.on && (
        <div style={t2.style}>
          <Bed pad={28} w={880}>
            <Kick>LA ÚNICA CUENTA DEL VIDEO</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>OCHOCIENTOS OCHENTA <Em>VATIOS HORA</Em></Head>
            <div style={{ height: 10 }} />
            <Body size={31}>Anota ese número.</Body>
          </Bed>
        </div>
      )}
      {t3.on && (
        <div style={t3.style}>
          <Bed pad={28} w={900}>
            <Kick color={V.danger}>PRIMER MOTIVO</Kick>
            <div style={{ height: 12 }} />
            <Head size={78}>PASADA LA MITAD, <Em color={V.danger}>SE ARRUINA</Em></Head>
          </Bed>
        </div>
      )}
      {t4.on && (
        <div style={t4.style}>
          <Bed pad={28} w={960}>
            <Kick color={V.amber}>Y ESTE ES EL IMPORTANTE</Kick>
            <div style={{ height: 12 }} />
            <Head size={74}>NO ES DE RESERVA: <Em color={V.amber}>ES DE ARRANQUE</Em></Head>
          </Bed>
        </div>
      )}
      {t5.on && (
        <div style={t5.style}>
          <Bed pad={28} w={840}>
            <Kick>SIN ARRUINAR NADA</Kick>
            <div style={{ height: 12 }} />
            <Head size={76}>ESTO ES LO QUE <Em>TIENES</Em></Head>
          </Bed>
        </div>
      )}

      {/* ── el REBOTE de la hoja: la luz blanca nace del papel, no de un fundido a blanco ── */}
      {pap > 0.01 && (
        <AbsoluteFill style={{
          pointerEvents: "none", mixBlendMode: "screen",
          background: `radial-gradient(84% 54% at 50% 96%, ${rgba(PAPER, 0.3 * pap)} 0%, rgba(0,0,0,0) 66%)`,
        }} />
      )}

      {/* ── viñeta VIVA: el plano nunca se cierra, sigue respirando hasta el corte ── */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(92% 76% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${(0.22 + 0.05 * Math.sin(f / 89) - pap * 0.09).toFixed(3)}) 100%)`,
      }} />
      {/* ── aberración cromática sutil en los picos de energía (nunca un blur full-screen) ── */}
      <AbsoluteFill style={{
        pointerEvents: "none", mixBlendMode: "screen",
        opacity: keyed(f, [K.r880 - 10, K.r880 + 14, K.r880 + 44, K.kick - 10, K.kick + 16, K.kick + 52, K.zoom],
          [0, 0.12, 0, 0, 0.15, 0.04, 0], [EZ.push, EZ.soft, EZ.lin, EZ.push, EZ.soft, EZ.glide]),
        background: `linear-gradient(94deg, ${rgba(V.volt, 0.2)} 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, ${rgba(V.amber, 0.18)} 100%)`,
      }} />
    </AbsoluteFill>
  );
};
