// Mov3Cuenta.tsx — MOVIMIENTO 3 del VSL de constructorlibre.com/curso.
// 13,30 s (399 frames @30) que arrancan en el frame GLOBAL 2163 (seg 72,10).
//
// QUÉ ES: la PRUEBA MATEMÁTICA del VSL. Tres cuentas que el espectador tiene que poder leer y
// rehacer en su cabeza, escritas sobre la hoja REAL de un cuaderno de obra. No es una promesa:
// es una cuenta (el guion aclara justo después que "no significa que vas a ganar eso
// automáticamente"), así que acá NO hay ningún texto que prometa nada. Sólo la aritmética.
//
// ══ TABLA DE HANDOFF (suites_premium.md §4) ══════════════════════════════════════════════════
// El movimiento es UNA escena continua: UNA atmósfera montada arriba y nunca remontada, UNA
// cámara (useCam(desde), función del frame GLOBAL, así hereda la inercia del movimiento 2) y un
// dolly/tilt/pan ÚNICO y monótono keyframeado en [0,92,162,297,340,399]. Ningún acto vuelve a 0.
//
// VECINO ANTERIOR (f<0): presentador a pantalla completa, plano medio, taller, luz de día neutra.
//
// ACTO 1 · 0–92 · MACRO DE LA HOJA  (protagonista: la punta del lápiz sobre el papel)
//   enterFrom {cam: z1.58 + rush, tilt 16°, pan (+370,+150) | luz: key 202° rasante cálida a .26
//              | materia: la hoja del cuaderno REAL (clip 031) que ya venía debajo del presentador}
//   exitTo    {cam: z1.58×1.40 (empuje final), tilt 13° | luz: bloom de la key en el grafito
//              | materia: LA HOJA — se aleja y se convierte en la tabla}
//   → texto: kicker "HAZ LA CUENTA" (f8) + la fila 1 ESCRIBIÉNDOSE por clip-reveal (f19)
//
//   ╔ FRONTERA 1 @92 · ZOOM-THROUGH ╗ la cámara entra en la punta del lápiz (rush ×1.40 + bloom
//   del especular en el grafito, f74→97) y SALE en la tabla completa a z1.16. Es la costura que
//   pidió el creador textualmente, y es la única que sirve acá: mismo material, salto de escala
//   macro→general, sin cambiar de plate (el clip sigue corriendo: cero reset de fondo).
//
// ACTO 2 · 92–162 · LA TABLA / CAE EL 600
//   enterFrom {cam: z1.16, tilt 13°, pan (+150,+60) | luz: key ~196° a .18 | materia: la hoja}
//   exitTo    {cam: z1.10, tilt 9°, pan (+60,0) | luz: key 172° | materia: la PLACA $600 + la
//              cama difusa de la hoja (img/vslc03_blur.jpg), que ya no se van más}
//   → f96 titular "Cuántos trabajos hacen falta" · f98 CAE el 600 (placa de vidrio que se
//     despega de la hoja en Z: de translateZ 300 a 118, con overshoot y anillo de impacto)
//
//   ╔ FRONTERA 2 @162 · OCLUSIÓN ╗ una hoja de papel cruza el cuadro (Occluder con material
//   SOFT = el PAPEL; ⛔ nunca el color del fondo: con el fondo no ocluye, hace un fundido a
//   negro y se ve un flash). Cobertura 100% en f161,6–163 → el swap de plate (clip 031 → foto
//   vslc03) cae DENTRO de la cobertura. Cambio de tema fuerte: se abre la mesa con calculadora.
//
// ACTO 3 · 162–297 · LA MESA / CAE EL 800
//   enterFrom {cam: z1.10, tilt 9°, pan (+60,0) | luz: key 172° a .17 | materia: placa $600 + cama}
//   exitTo    {cam: z1.02, tilt 6°, pan (+10,−18) | luz: key 140° | materia: las DOS placas + cama}
//   → f166 fila 2 · f220 CAE el 800 · f240–294 tarjeta flotante con CLIP REAL (manos con
//     espátula, 008) OCUPANDO el hueco donde después cae la tercera fila: el "trabajo" del que
//     sale la cuenta. Con eso, en 135 frames no hay nada quieto más de 1,5 s.
//
//   ╔ FRONTERA 3 @297 · WIPE POR MATERIA ╗ dos capas de WipeMateria (polvo de cal / papel)
//   cruzan y DETRÁS ya está lo nuevo: la foto de la mesa sale deslizándose a la izquierda (−9%)
//   mientras el clip del balde con BILLETES entra deslizándose desde la derecha (+7% → 0) — un
//   wipe de verdad, ⛔ cero opacity sobre el cuadro entero. Semántica: con el 1.200 entra el dinero.
//
// ACTO 4 · 297–340 · CAE EL 1.200 (el más alto)
//   enterFrom {cam: z1.02, tilt 6° | luz: key 140° a .13 | materia: las dos placas + cama}
//   exitTo    {cam: z0.99, tilt 3,6° | luz: key ~132° | materia: las TRES placas ya alineadas}
//   → f291 fila 3 (nace DENTRO del polvo) · f297 CAE el 1.200
//
//   ╔ FRONTERA 4 @340 · MATCH-MOVE ╗ no hay corte ni objeto: la cámara SIGUE su vector (dolly-out
//   0,99→0,965 y el tilt bajando a 2,9°, o sea la cámara se levanta sobre la mesa) y la tabla se
//   termina de alinear DETRÁS del movimiento. Es lo contrario de la frontera 3 a propósito:
//   después de un wipe de partículas, lo que no se puede hacer es otro efecto.
//
// ACTO 5 · 340–399 · HOLD VIVO Y ATERRIZAJE
//   enterFrom {cam: z0.99, tilt 3,6° | luz: key 132° a .10 | materia: las tres placas}
//   exitTo    {cam: z0.965, tilt 2,9°, pan (−24,−34) | luz: se ASIENTA (velo cálido 0,26, el
//              especular cae a .08, las respiraciones se calman a 0,45) | materia: la mesa en
//              penumbra, cuadro DESPEJADO}
//   → las tres cuentas CONVIVEN y se leen juntas (f340) · f379–396 las piezas se retiran hacia
//     arriba y el cuadro queda limpio para el corte a la cara del presentador.
//
// VECINO POSTERIOR (f>399): presentador a pantalla completa, serio — "no significa que vas a
// ganar eso automáticamente". Por eso el final BAJA la energía en vez de rematar con un golpe.
//
// ══ CONTRATO TÉCNICO ═════════════════════════════════════════════════════════════════════════
//  · CERO Math.random/Date.now: el farm rinde en 50 chunks paralelos y cada uno tiene que dar
//    EXACTAMENTE lo mismo. Todo es función pura de useCurrentFrame(); los sorteos van con rnd().
//  · CERO backdrop-filter y cero filter: blur() grande a pantalla completa: el fondo desenfocado
//    es el hermano img/vslc03_blur.jpg que ya está en disco.
//  · <Video> JAMÁS: todo clip entra por Plate/Tarjeta, que usan OffthreadVideo.
//  · ⛔ Ningún clip dura más que su duración REAL, y cada uno va dentro de su <Sequence> para que
//    su tiempo arranque en 0 (si no, en el frame local 297 pediría el segundo 9,9 de un clip de
//    7 s y se congelaría el último cuadro). Al Plate de adentro se le pasa `desde + from` para
//    RECONSTRUIR el frame global: así la cámara no salta por el rebase del Sequence.
//      031 → f0..168 (168 ≤ 210) · 043 → f297..399 (102 ≤ 210) · 008 → f240..294 (54 ≤ 120)
//  · Easing.quint NO EXISTE → Easing.poly(5). Easing.out(undefined) compila y explota.
//  · Legibilidad: totales 78 px ámbar, trabajo 44 px, titular 54 px, safe area 96 px, todos los
//    números con tabular-nums. Alto del bloque final = kicker 30 + 14 + titular 60 + 36 +
//    3 filas (148×3 + 26×2) = 636 px sobre 1080 → CABE y las tres cuentas se leen juntas.
//  · ⛔ En pantalla NO aparece el precio del curso. Las cifras son ingresos del SERVICIO.
import React from "react";
import {
  AbsoluteFill, Easing, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import {
  useCam, Plate, Grade, Atmos, Tarjeta, Contacto, Occluder, WipeMateria, Titular, Kicker,
  VSL, FF, INK, PAPER, SOFT, MUTE, ACC, SAFE, rnd,
} from "./Escenario";

// ── los cortes del movimiento (frames LOCALES) ────────────────────────────────────────────────
const CORTES = [0, 92, 162, 297, 340, 399];
const F1 = 92, F2 = 162, F3 = 297, F4 = 340;

/** las tres cuentas. ⛔ las cifras son las que dice la voz: no se tocan. */
const CUENTAS = [
  { trabajo: "1 trabajo por semana · $150", total: 600, thumb: "img/vslc02.png", at: 19, atTotal: 98 },
  { trabajo: "4 trabajos al mes · $200", total: 800, thumb: "img/vsls03.png", at: 166, atTotal: 220 },
  { trabajo: "2 por semana · $150", total: 1200, thumb: "img/vsls04.png", at: 291, atTotal: 297 },
];

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** "1.200" con punto de miles (⛔ toLocaleString devuelve "1,200" según la locale del runner). */
const miles = (n: number) => {
  const s = String(Math.round(n));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ══ L1 · PLANO DE MATERIAL ════════════════════════════════════════════════════════════════════
/** Cada clip dentro de su <Sequence> (tiempo propio desde 0) y con `desde + from` para que la
 *  cámara siga siendo función del frame GLOBAL a pesar del rebase. `tx`/`sc` llegan ya calculados
 *  desde el padre: así el deslizamiento del wipe no depende del frame rebaseado. */
const Plano: React.FC<{
  src: string; from: number; dur: number; desde: number;
  prof?: number; tx?: number; sc?: number;
}> = ({ src, from, dur, desde, prof = 0, tx = 0, sc = 1 }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <AbsoluteFill style={{ transform: `translateX(${tx.toFixed(3)}%) scale(${sc.toFixed(4)})`, overflow: "hidden" }}>
      <Plate src={src} desde={desde + from} profundidad={prof} />
    </AbsoluteFill>
  </Sequence>
);

// ══ L5+L6+L7 · LA FILA: el renglón de papel + la PLACA del total despegada en Z ═══════════════
const Fila: React.FC<{
  at: number; atTotal: number; trabajo: string; total: number; thumb: string;
  top: number; idx: number; calma: number; despeje: number; escribe?: boolean;
}> = ({ at, atTotal, trabajo, total, thumb, top, idx, calma, despeje, escribe }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // el renglón ATERRIZA en la hoja (no "aparece"): baja, se asienta y deja su sombra de contacto
  const sp = spring({ frame: f - at, fps, config: { damping: 190, mass: 0.55 }, durationInFrames: 18 });
  // la placa del total SE DESPEGA de la hoja: entra en Z con overshoot (es el golpe de la cuenta)
  const sg = spring({ frame: f - atTotal, fps, config: { damping: 14, mass: 0.72, stiffness: 118 }, durationInFrames: 28 });

  const resp = Math.sin(f / (44 + idx * 9) + idx * 1.9) * 3.1 * calma;          // hold VIVO
  const flota = Math.sin(f / (37 + idx * 7) + idx * 2.6) * 4.4 * calma;
  const ty = (1 - sp) * 34 + resp;
  const aFila = sp * despeje;
  const aTot = interpolate(f, [atTotal, atTotal + 6], [0, 1], CLAMP) * despeje;
  const zTot = 300 - 182 * sg;
  const anillo = interpolate(f, [atTotal + 2, atTotal + 18], [0.85, 0], CLAMP);

  // clip-reveal: la primera fila SE ESCRIBE (es la mano del cuaderno, escribiendo)
  const esc = escribe ? interpolate(f, [at, at + 38], [0, 1], { ...CLAMP, easing: Easing.out(Easing.quad) }) : 1;
  const n = Math.round(total * interpolate(f, [atTotal + 2, atTotal + 21], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) }));

  if (f < at - 3) return null;

  return (
    <>
      {/* ── el RENGLÓN: tira de papel apoyada en la hoja, con material real adentro ── */}
      <div
        style={{
          position: "absolute", left: 120, top, width: 900, height: 148,
          transformStyle: "preserve-3d",
          transform: `translateZ(${26 + idx * 9}px) translateY(${ty.toFixed(2)}px)`,
          opacity: aFila,
        }}
      >
        <Contacto w={880} y={150} op={0.46 * sp} />
        <div
          style={{
            position: "relative", width: "100%", height: "100%", borderRadius: 12, overflow: "hidden",
            display: "flex", alignItems: "center",
            background: `linear-gradient(104deg, ${PAPER} 0%, ${PAPER} 58%, ${SOFT} 100%)`,
            boxShadow: "inset 0 2px 0 rgba(255,255,255,.9), inset 0 -2px 0 rgba(20,18,15,.10), 0 26px 46px rgba(0,0,0,.42), 0 6px 12px rgba(0,0,0,.26)",
          }}
        >
          {/* L5 · MATERIAL REAL adentro (recortado: el tilt de la tarjeta no abre huecos) */}
          <div style={{ position: "relative", width: 158, height: 148, overflow: "hidden", flex: "0 0 auto" }}>
            <div style={{ position: "absolute", left: -13, top: -15 }}>
              <Tarjeta src={thumb} w={184} h={178} texto={false} seed={idx * 11 + 5} z={14} at={at} estilo={{ borderRadius: 8 }} />
            </div>
          </div>
          {/* la línea ámbar del margen del cuaderno */}
          <div style={{ width: 4, height: 148, background: ACC, opacity: 0.85, flex: "0 0 auto" }} />
          {/* L7 · el texto del trabajo, escribiéndose */}
          <div style={{ position: "relative", flex: 1, height: "100%", display: "flex", alignItems: "center", paddingLeft: 30, overflow: "hidden" }}>
            <div style={{ position: "relative", width: `${(esc * 100).toFixed(2)}%`, overflow: "hidden" }}>
              <div style={{
                fontFamily: FF, fontSize: 44, fontWeight: 700, color: INK, whiteSpace: "nowrap",
                letterSpacing: "-0.018em", fontVariantNumeric: "tabular-nums",
              }}>{trabajo}</div>
              {esc < 1 && (
                <div style={{ position: "absolute", right: -3, top: 4, width: 4, height: 48, background: ACC, opacity: 0.9 }} />
              )}
            </div>
          </div>
          {/* L6 · specular de producto sobre el papel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(112deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 34%, rgba(255,255,255,0) 62%)",
            mixBlendMode: "screen", opacity: 0.5,
          }} />
        </div>
      </div>

      {/* ── la PLACA DEL TOTAL: se despega de la hoja como vidrio, en su propio plano Z ── */}
      <div
        style={{
          position: "absolute", left: 952, top: top - 2, width: 436, height: 152,
          transformStyle: "preserve-3d",
          transform: `translateZ(${zTot.toFixed(1)}px) translateY(${(flota - (1 - sg) * 10).toFixed(2)}px) scale(${(1.14 - 0.14 * sg).toFixed(4)})`,
          opacity: aTot,
        }}
      >
        <Contacto w={404} y={154} op={0.5} />
        <div
          style={{
            position: "relative", width: "100%", height: "100%", borderRadius: 16, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(140deg, rgba(255,255,255,.98) 0%, rgba(248,244,236,.95) 62%, rgba(233,226,212,.94) 100%)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,1), inset 0 0 0 2px rgba(224,146,44,.55), 0 34px 64px rgba(0,0,0,.52), 0 10px 18px rgba(0,0,0,.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{
              fontFamily: FF, fontSize: 78, fontWeight: 800, color: ACC, lineHeight: 1,
              letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
            }}>${miles(n)}</div>
            <div style={{ fontFamily: FF, fontSize: 32, fontWeight: 700, color: MUTE, letterSpacing: "-0.01em", marginLeft: 12 }}>/ mes</div>
          </div>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.7) 40%, rgba(255,255,255,0) 66%)",
            mixBlendMode: "screen", opacity: 0.55,
          }} />
        </div>
        {/* anillo de impacto: el golpe de la cifra al aterrizar */}
        {anillo > 0.01 && (
          <div style={{
            position: "absolute", inset: -6, borderRadius: 22, border: `3px solid ${ACC}`,
            opacity: anillo, transform: `scale(${(1 + (0.85 - anillo) * 0.2).toFixed(3)})`, pointerEvents: "none",
          }} />
        )}
      </div>
    </>
  );
};

// ══ EL MOVIMIENTO ═════════════════════════════════════════════════════════════════════════════
export const Mov3Cuenta: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);   // ⛔ la cámara es función del frame GLOBAL: NUNCA arranca en 0

  // ── UN SOLO dolly/tilt/pan para los 5 actos (monótono, easing no constante) ──
  const K = (vals: number[]) => interpolate(f, CORTES, vals, { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const rush = f < F1 ? interpolate(f, [58, F1], [1, 1.4], { ...CLAMP, easing: Easing.in(Easing.poly(3)) }) : 1;
  const dolly = K([1.58, 1.16, 1.1, 1.02, 0.99, 0.965]) * rush;
  const tiltX = K([16, 13, 9, 6, 3.6, 2.9]);
  const fx = K([370, 150, 60, 10, -10, -24]);
  const fy = K([150, 60, 0, -18, -28, -34]);

  // ── la LUZ EVOLUCIONA (no salta): la key gira de rasante-cálida a frontal, y se asienta ──
  const keyAng = interpolate(f, [0, F2, F3, 399], [202, 172, 140, 130], CLAMP);
  const keyA = interpolate(f, [0, F1, F3, 399], [0.26, 0.18, 0.13, 0.08], CLAMP);
  const fuerzaGrade = interpolate(f, [0, F1, F2, F3, 399], [1.02, 0.88, 0.82, 0.9, 0.96], CLAMP);

  // ── aterrizaje: el cuadro se despeja y la energía baja para el corte al presentador ──
  const calma = interpolate(f, [F4, 399], [1, 0.45], CLAMP);
  const despeje = interpolate(f, [379, 396], [1, 0], { ...CLAMP, easing: Easing.in(Easing.cubic) });
  const asiento = interpolate(f, [362, 399], [0, 0.26], CLAMP);
  const salida = (1 - despeje) * -26;

  // ── ZOOM-THROUGH (F1): el bloom del especular en el grafito ──
  const bloom = interpolate(f, [74, 91, 97], [0, 0.7, 0], CLAMP);

  // ── WIPE POR MATERIA (F3): la foto sale deslizándose, el clip del dinero entra deslizándose ──
  const txSale = f >= 291 ? interpolate(f, [291, 308], [0, -9], { ...CLAMP, easing: Easing.inOut(Easing.cubic) }) : 0;
  const txEntra = interpolate(f, [F3, F3 + 16], [7, 0], { ...CLAMP, easing: Easing.out(Easing.poly(4)) });
  const scEntra = interpolate(f, [F3, F3 + 21], [1.1, 1], { ...CLAMP, easing: Easing.out(Easing.poly(4)) });

  const bed = interpolate(f, [86, 104], [0, 0.92], CLAMP) * despeje;

  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {/* ══ L1 · MATERIAL REAL A SANGRE — un plate por acto, el swap SIEMPRE bajo una costura ══ */}
      {f < 166 && (
        <Plano src="broll/vslcurso_031.mp4" from={0} dur={168} desde={desde}
          prof={0.18} sc={1 + (dolly - 1) * 0.52} />
      )}
      {f >= F2 && f < 308 && (
        <Plano src="img/vslc03.png" from={F2} dur={146} desde={desde} prof={0.3} tx={txSale} />
      )}
      {f >= F3 && (
        <Plano src="broll/vslcurso_043.mp4" from={F3} dur={102} desde={desde}
          prof={0.26} tx={txEntra} sc={scEntra} />
      )}

      {/* ══ L2 · GRADE — el velo que hunde el material para que la tipografía se lea ══ */}
      <Grade p={1} fuerza={fuerzaGrade} />

      {/* ══ L6 · LA KEY DE LA ESCENA (un solo gradiente que GIRA, no salta) ══ */}
      <AbsoluteFill style={{
        background: `linear-gradient(${keyAng.toFixed(1)}deg, rgba(255,238,208,${keyA.toFixed(3)}) 0%, rgba(255,238,208,0) 58%)`,
        mixBlendMode: "screen", pointerEvents: "none",
      }} />

      {/* ══ EL ESCENARIO 3D — una sola perspectiva, un solo suelo, una sola cámara ══ */}
      <AbsoluteFill style={{ transform: cam.css, transformStyle: "preserve-3d" }}>
        <div style={{
          position: "absolute", inset: 0, transformStyle: "preserve-3d",
          transform: `translate(${fx.toFixed(2)}px, ${(fy + salida).toFixed(2)}px) scale(${dolly.toFixed(4)}) rotateX(${tiltX.toFixed(2)}deg)`,
        }}>
          {/* ── L3 · PROFUNDIDAD: la cama DESENFOCADA sale del hermano _blur.jpg (⛔ no
                 backdrop-filter). Es la HOJA difusa, y es la materia que CRUZA F2, F3 y F4. ── */}
          {bed > 0.01 && (
            <div style={{
              position: "absolute", left: 72, top: 292, width: 1400, height: 606, borderRadius: 30,
              overflow: "hidden", opacity: bed, transform: "translateZ(14px)",
              boxShadow: "inset 0 0 130px rgba(12,11,9,.6), 0 46px 96px rgba(0,0,0,.5)",
            }}>
              <Img src={staticFile("img/vslc03_blur.jpg")} style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: `scale(${(1.09 + 0.022 * Math.sin(f / 118)).toFixed(4)})`,
              }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,11,9,.5) 0%, rgba(12,11,9,.74) 100%)" }} />
            </div>
          )}

          {/* ── L5 · LAS TRES CUENTAS ── */}
          {CUENTAS.map((c, i) => (
            <Fila key={i} at={c.at} atTotal={c.atTotal} trabajo={c.trabajo} total={c.total}
              thumb={c.thumb} top={340 + i * 174} idx={i} calma={calma} despeje={despeje} escribe={i === 0} />
          ))}

          {/* ── L5 · TARJETA FLOTANTE con CLIP REAL (el trabajo del que sale la cuenta).
                 ⛔ dentro de su Sequence: 62 frames de un clip de 120. ── */}
          {f >= 240 && f < 294 && (
            <Sequence from={240} durationInFrames={54} layout="none">
              <div style={{ position: "absolute", left: 1000, top: 664, transformStyle: "preserve-3d", transform: "translateZ(62px)" }}>
                <Contacto w={362} y={250} op={0.44} />
                <Tarjeta src="broll/vslcurso_008.mp4" w={392} h={244} texto={false} seed={31} z={62} at={0} />
              </div>
            </Sequence>
          )}
        </div>

        {/* ── L7 · TIPOGRAFÍA: su propio plano y su propio parallax (no la arrastra el macro) ── */}
        <div style={{
          position: "absolute", left: SAFE + 28, top: 148, transformStyle: "preserve-3d",
          transform: `translate(${(fx * 0.34).toFixed(2)}px, ${(fy * 0.42 + salida * 1.6).toFixed(2)}px) scale(${(1 + (dolly - 1) * 0.22).toFixed(4)})`,
          opacity: despeje,
        }}>
          <Kicker at={8}>HAZ LA CUENTA</Kicker>
          <div style={{ height: 14 }} />
          <Titular at={96} size={54} z={52}>Cuántos trabajos hacen falta</Titular>
        </div>
      </AbsoluteFill>

      {/* ══ COSTURAS ═════════════════════════════════════════════════════════════════════════ */}
      {/* F1 @92 · ZOOM-THROUGH: el bloom del grafito justo cuando la cámara entra en la punta */}
      {bloom > 0.01 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(58% 52% at 46% 54%, rgba(255,240,212,${bloom.toFixed(3)}) 0%, rgba(255,232,190,${(bloom * 0.35).toFixed(3)}) 42%, rgba(255,232,190,0) 74%)`,
            mixBlendMode: "screen",
          }} />
          {Array.from({ length: 9 }, (_, i) => {
            const r = rnd(i * 5.7 + 13);
            const len = (180 + rnd(i * 9.1 + 41) * 420) * bloom;
            return (
              <div key={i} style={{
                position: "absolute", left: "46%", top: "54%", width: len, height: 2,
                background: `linear-gradient(90deg, rgba(255,238,206,${(bloom * 0.5).toFixed(3)}) 0%, rgba(255,238,206,0) 100%)`,
                transform: `rotate(${(r * 360).toFixed(1)}deg)`, transformOrigin: "0 50%", mixBlendMode: "screen",
              }} />
            );
          })}
        </AbsoluteFill>
      )}

      {/* F2 @162 · OCLUSIÓN — ⛔ el material es el PAPEL (SOFT), nunca el color del fondo */}
      <Occluder at={156} dur={13} material={SOFT} angulo={-9} />

      {/* F3 @297 · WIPE POR MATERIA — polvo de cal/papel en dos capas, para que tape de verdad */}
      <WipeMateria at={290} dur={19} color="rgba(238,231,216,0.92)" />
      <WipeMateria at={294} dur={16} color="rgba(247,243,234,0.86)" />

      {/* ══ L4+L8+L9 · ATMÓSFERA Y LENTE — montadas UNA vez para los 5 actos ══ */}
      <Atmos desde={desde} polvo={1} bokeh={0.9} />

      {/* L8 · motas de polvo de papel que devuelven la key (y se calman al final) */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: calma }}>
        {Array.from({ length: 7 }, (_, i) => {
          const r = rnd(i * 3.3 + 77), r2 = rnd(i * 8.9 + 21);
          const x = 12 + r * 76 + Math.sin(f / (130 + i * 23) + i) * 1.8;
          const y = 16 + r2 * 70 + Math.cos(f / (152 + i * 19) + i * 2.2) * 2.4;
          const s = 3 + r2 * 6;
          return (
            <div key={i} style={{
              position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
              width: s, height: s, borderRadius: "50%", background: "rgba(255,240,214,.85)",
              opacity: (0.12 + 0.3 * r) * keyA * 4, filter: `blur(${(1 + r * 2).toFixed(1)}px)`,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* ATERRIZAJE: la luz se ASIENTA para que el corte a la cara del presentador se lea serio */}
      <AbsoluteFill style={{ background: `rgba(14,12,10,${asiento.toFixed(3)})`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
