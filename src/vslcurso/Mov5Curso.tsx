// Mov5Curso.tsx — MOVIMIENTO 5 del VSL de constructorlibre.com/curso.
// 522 frames (17,40 s) a 30 fps · arranca en el frame ABSOLUTO 5463 (seg 182,10).
// Es LA DEMOSTRACIÓN DE PRODUCTO: acá se ve lo que se compra.
//
// ══ TABLA DE HANDOFF (suites_premium.md §4) ═══════════════════════════════════════════════════
// VECINO ANTERIOR (f<0): plano a sangre de img/vslg01.png (hojas saliendo de la impresora),
//   cámara en deriva lenta, luz cálida de interior, materia = LA HOJA IMPRESA.
//
// ACTO 1 · f0-133 · "EL CURSO POR DENTRO" — la pantalla
//   enterFrom {cam: z 1.16 (saliendo de un zoom-through, escala 1,34→1,00 en 18 f), panX heredado
//                   del frame global 5463 — la cámara NUNCA arranca en 0),
//              luz: {temp cálida 40%/24% + contraluz FRÍO de la pantalla a la izquierda, int 0.26},
//              materia: "la hoja impresa del vecino — la atravesamos y su canto todavía se ve
//                        como un aro de papel que se abre (frames 0-14)"}
//   exitTo    {cam: z 1.035 (dolly in terminado, la mesa ya entra en cuadro),
//              luz: {cálida 64%/30%, int 0.34, el frío de la pantalla ya apagado},
//              materia: "UNA HOJA DE PAPEL cruza el cuadro entero (oclusión) — es la misma
//                        materia que la clase que se imprime"}
//
// ACTO 2 · f134-243 · "ADEMÁS DE LAS CLASES" — la mesa
//   enterFrom {cam: z 1.035 heredado, sin reencuadre: la hoja destapa la mesa ya montada,
//              luz: {cálida 64%/30%, int 0.34},
//              materia: "la hoja que ocluyó ATERRIZA: es el recorte de img/vslg01.png que entra
//                        volando, la hoja que salió de la impresora del vecino"}
//   exitTo    {cam: z 1.00 (la cámara sigue retrocediendo, ya en movimiento),
//              luz: {cálida 58%/38%, int 0.30 — la mesa se desenfoca: DOF de 0.60 a 0.74},
//              materia: "la pila de papel sobre la mesa; el polvo de papel cruza (wipe) y detrás
//                        ya está la primera hoja en el aire"}
//
// ACTO 3 · f244-410 · el CARRUSEL 3D de hojas — cinco documentos aterrizan nombrados
//   enterFrom {cam: z 1.00 en retroceso, panX global,
//              luz: {58%/38%, int 0.30}, materia: "la pila; el titular sube y libera la mesa"}
//   exitTo    {cam: z 0.965 (sigue abriendo para que entren seis),
//              luz: {50%/30%, int 0.22 — luz de lectura, más plana y más alta},
//              materia: "las cinco hojas EN ABANICO, de canto y superpuestas"}
//
// ACTO 4 · f411-521 · los SEIS, planos y legibles
//   enterFrom {cam: z 0.965 heredado, abriendo a 0.945,
//              luz: {50%/30%, int 0.22},
//              materia: "LAS MISMAS cinco hojas del abanico — giran a plano y se ordenan en
//                        rejilla 3×2 (match-shape); la sexta entra directo a su celda"}
//   exitTo    {cam: z 0.945, panX global (el presentador entra a pantalla completa sin reencuadre),
//              luz: {48%/28%, int 0.20}, materia: "la mesa limpia — las hojas se barren hacia
//                        abajo en f508-521 y el cuadro queda DESPEJADO para el corte"}
//
// VECINO POSTERIOR (f>521): presentador a PANTALLA COMPLETA, "No estás comprando tres horas de
//   videos". Corte en el beat sobre cuadro limpio.
//
// ══ COSTURAS (una distinta por frontera, ⛔ ningún fade de cuadro entero) ══════════════════════
//  F0  f0    ZOOM-THROUGH   — salimos de la hoja impresa del vecino y entramos en la pantalla de la
//                             laptop: plate 1,34→1,00 en 18 f + el canto de papel que se abre.
//                             (de plano general a macro: es el caso exacto de la tabla §3)
//  F1  f130  OCLUSIÓN       — una hoja REAL (img/vslh01.png) cruza y tapa el 100 % 7 frames; debajo
//                             se cambia el plate, el blur hermano y el primer plano desenfocado.
//                             Cambio de tema fuerte (clases → documentos) y la materia que cruza es
//                             PAPEL, nunca el color del fondo (mdbleach: eso hace fundido a negro).
//  F2  f240  WIPE POR MATERIA — polvo de papel cruza mientras la hoja de diagnóstico ya viene
//                             cayendo: no hay cambio de encuadre, sólo cambia lo que hay encima.
//  F3  f411  MATCH-SHAPE    — el abanico 3D se convierte en la rejilla plana: la MISMA forma
//                             (la hoja de canto) gira a plano. Es lo que deja los seis legibles.
//  F4  f508  CORTE EN EL BEAT — las hojas se barren hacia abajo, el cuadro queda limpio y el corte
//                             cae seco en "No estás comprando".
//
// ⛔ NOTA MEDIDA sobre `Occluder` del Escenario: su banda sólida mide 129,6 % del ancho y viaja
//    320 %, y el ángulo -12° se come ~26 % → la cobertura del 100 % dura ~0,5 FRAME (con dur=14).
//    Por eso acá la oclusión es una HOJA propia de 300 % de ancho con la foto del papel adentro:
//    cobertura total medida = 7 frames (f134-140), y el swap de plate ocurre en f137, en el medio.
//    (regla de suites_premium.md §9: verificar que la cobertura del 100 % caiga donde ocurre el swap)
//
// ⛔ PROHIBIDO EN ESTE TRAMO: el precio del curso. Ni "297", ni "US$", ni "$". El precio vive en el
//    botón de la landing. Es el tramo donde más tienta y es el que no se puede tocar.
//
// CONTRATO TÉCNICO: cero Math.random/Date.now (todo es función pura de useCurrentFrame) · cero
// backdrop-filter y cero filter:blur a pantalla completa (el desenfoque sale de los hermanos
// `_blur.jpg`) · sólo OffthreadVideo · ningún clip pasa su duración real (008: 120 f, usado 118 ·
// 049: 162 f, usado 100 · 031: 210 f, usado 152) · Easing.poly(5) en vez del inexistente quint.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  ACC, Atmos, Cifra, Contacto, Grade, INK, Kicker, PAPER, Plate, SAFE, SOFT, SOMBRA_TEXTO,
  Tarjeta, Titular, VSL, FF, rnd, useActo, useCam, useEntra,
} from "./Escenario";

// ── la coreografía, anclada al ms del guion ───────────────────────────────────────────────────
const CORTES = [0, 134, 244, 411];
const F_OCL = 130;          // arranca la hoja que ocluye (cobertura total f134-140)
const F_SWAP = 137;         // plate/blur/primer plano cambian TAPADOS
const F_WIPE = 240;         // polvo de papel, 4 f antes de que la hoja 1 se nombre
const F_GRID = 411;         // match-shape: el abanico se vuelve rejilla
const F_SAL = 508;          // barrido final: el cuadro queda despejado

/** Los seis documentos. Cada hoja lleva MATERIAL REAL adentro (regla dura de suites_premium.md:
 *  una tarjeta que es sólo una forma con texto es código en pantalla y se nota). */
const DOCS: { src: string; rotulo: string; at: number; fan?: { x: number; y: number; r: number; z: number } }[] = [
  { src: "img/vsls03.png", rotulo: "La hoja de diagnóstico", at: 244, fan: { x: -430, y: -64, r: -8, z: 20 } },
  { src: "img/vslc03.png", rotulo: "El presupuesto", at: 277, fan: { x: -108, y: 42, r: 5, z: 60 } },
  { src: "img/vslh02.png", rotulo: "La garantía por escrito", at: 304, fan: { x: 214, y: -58, r: -5, z: 100 } },
  { src: "img/vslc02.png", rotulo: "El recibo", at: 337, fan: { x: 474, y: 56, r: 9, z: 140 } },
  { src: "broll/vslcurso_031.mp4", rotulo: "La tabla de precios", at: 370, fan: { x: -252, y: 188, r: 3, z: 180 } },
  { src: "img/vslc01.png", rotulo: "La lista de errores que revisas antes de cada trabajo", at: 411 },
];

// rejilla 3×2 medida sobre 1920×1080 con safe 96: hoja 500×380 (foto 230 + rótulo 150),
// columnas 500·3 + 54·2 = 1608 (margen lateral 156), filas 380·2 + 34 = 794 bajo el titular.
const HOJA_W = 500, HOJA_H = 380, HOJA_LAB = 150;
const gridX = (i: number) => -554 + 554 * (i % 3);
const gridY = (i: number) => -174 + 414 * Math.floor(i / 3);

// ══ LA HOJA — 8 capas: sombra de objeto · sombra de CONTACTO · papel · foto/clip real · specular
//    que sigue a la key · rim del canto · regla ámbar · rótulo anclado al borde ════════════════
const Hoja: React.FC<{
  f: number; src: string; rotulo?: string; luz: number;
  x: number; y: number; rot: number; rx: number; z: number; s: number;
  op: number; desenf: number; zi: number; seed: number; w?: number; h?: number; lab?: number;
}> = ({ f, src, rotulo, luz, x, y, rot, rx, z, s, op, desenf, zi, seed, w = HOJA_W, h = HOJA_H, lab = HOJA_LAB }) => {
  const es = src.endsWith(".mp4");
  const LH = rotulo ? lab : 0;
  // hold VIVO: ninguna hoja queda quieta (fase y período propios por semilla)
  const flota = Math.sin(f / (54 + rnd(seed) * 26) + rnd(seed + 3) * 6.28) * (2.4 + 2.2 * rnd(seed + 7));
  const lift = 1 + z / 260;
  const sx = (luz - 0.5) * 2;   // de qué lado cae la sombra: lo decide la key de la escena
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%", width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2, zIndex: zi,
        transform: `translate3d(${x.toFixed(1)}px, ${(y + flota).toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`,
        opacity: op,
        filter: desenf > 0.05 ? `blur(${desenf.toFixed(2)}px)` : undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {/* sombra de CONTACTO: la elipse que ATERRIZA en la mesa */}
      <div
        style={{
          position: "absolute", left: w * 0.05, top: h - 10, width: w * 0.9, height: 30,
          transform: `translateX(${(sx * 16).toFixed(1)}px)`, borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${(0.52 / lift).toFixed(3)}) 0%, rgba(0,0,0,0) 72%)`,
          filter: "blur(10px)",
        }}
      />
      {/* el papel */}
      <div
        style={{
          position: "absolute", inset: 0, background: PAPER, borderRadius: 5, overflow: "hidden",
          boxShadow: `0 2px 3px rgba(20,18,15,.34), ${(-sx * 8).toFixed(1)}px ${(16 * lift).toFixed(0)}px ${(34 * lift).toFixed(0)}px rgba(0,0,0,.46), 0 1px 0 rgba(255,255,255,.7) inset`,
        }}
      >
        {/* L5 · MATERIAL REAL adentro */}
        <div style={{ position: "relative", width: "100%", height: h - LH, overflow: "hidden", background: SOFT }}>
          {es
            ? <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          {/* L6 · specular que sigue a la key */}
          <div
            style={{
              position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.5,
              background: `linear-gradient(${(104 + sx * 26).toFixed(1)}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.34) ${(46 + luz * 10).toFixed(1)}%, rgba(255,255,255,0) 64%)`,
            }}
          />
          {/* rim del canto superior */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,.62)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: ACC, opacity: 0.92 }} />
        </div>
        {rotulo && (
          <div style={{ padding: "17px 22px 0" }}>
            <div style={{ fontFamily: FF, fontSize: 34, fontWeight: 700, color: INK, lineHeight: 1.18, letterSpacing: "-0.014em" }}>
              {rotulo}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ══ LA OCLUSIÓN — una hoja de papel REAL cruza el cuadro. 300 % de ancho para que la cobertura
//    del 100 % dure 7 frames y el swap de plate caiga en el medio (ver nota medida arriba). ════
const HojaQueCruza: React.FC<{ at: number; dur: number }> = ({ at, dur }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > at + dur + 1) return null;
  const x = interpolate(f, [at, at + dur], [-305, 105], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 90 }}>
      <div
        style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: "-100%", width: "300%", height: "300%",
          transform: "rotate(-7deg)", overflow: "hidden",
          boxShadow: "0 0 140px rgba(0,0,0,.62)", background: SOFT,
        }}
      >
        <Img src={staticFile("img/vslh01.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.96 }} />
        <AbsoluteFill style={{ background: `linear-gradient(96deg, rgba(255,255,255,.46) 0%, rgba(255,255,255,0) 34%, rgba(255,255,255,.30) 62%, rgba(255,255,255,0) 100%)`, mixBlendMode: "screen" }} />
      </div>
    </AbsoluteFill>
  );
};

// ══ EL MOVIMIENTO ═════════════════════════════════════════════════════════════════════════════
export const Mov5Curso: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const cam = useCam(desde);                 // ⛔ función del frame GLOBAL: hereda la inercia
  const acto = useActo(CORTES);

  // ── UNA sola cámara: un dolly continuo de 522 frames con keyframes en las fronteras, NUNCA
  //    reiniciado por un acto. Multiplica (no reemplaza) la deriva global de `useCam`.
  const dolly = interpolate(f, [0, 133, 243, 410, 521], [1.125, 1.035, 1.000, 0.965, 0.945], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  // F0 · ZOOM-THROUGH: venimos de atravesar la hoja impresa del vecino
  const through = interpolate(f, [0, 18], [1.34, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(3)) });
  const aro = interpolate(f, [0, 15], [0.82, 3.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const aroOp = interpolate(f, [0, 6, 14], [0.9, 0.52, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── la LUZ evoluciona (no salta): posición, altura e intensidad de la key, más el contraluz
  //    frío de la pantalla de la laptop que se apaga cuando dejamos el acto 1.
  const luzX = interpolate(f, [0, 134, 244, 411, 521], [40, 64, 58, 50, 48], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const luzY = interpolate(f, [0, 134, 244, 411, 521], [24, 30, 38, 30, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const luzI = interpolate(f, [0, 134, 244, 411, 521], [0.26, 0.34, 0.30, 0.22, 0.20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frio = interpolate(f, [0, 120, 210], [0.30, 0.20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── DOF que evoluciona: el hermano `_blur.jpg` sube de 0.43 a 0.72 a medida que las hojas se
  //    vienen al frente. El velo se mantiene en ~0.44 (a 0.80 el b-roll desaparece: medido).
  const gp = interpolate(f, [0, 134, 244, 411, 521], [0.52, 0.60, 0.74, 0.86, 0.88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gf = interpolate(f, [0, 134, 244, 411, 521], [1.45, 1.30, 1.10, 0.92, 0.90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── el plate y su hermano desenfocado: cambian TAPADOS por la hoja que cruza
  const plate = f < F_SWAP ? "img/vslg02.png" : "img/vslh01.png";
  const plateBlur = f < F_SWAP ? "img/vslg02_blur.jpg" : "img/vslh01_blur.jpg";

  // ── el bloque de texto viaja del centro-izquierda al borde superior (el titular es el MISMO
  //    objeto en los actos 2, 3 y 4: sube y se achica, no se vuelve a montar)
  const tp = interpolate(f, [236, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const scrim = interpolate(f, [236, 300], [0.60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kOut = interpolate(f, [252, 282], [0, -300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const kOpa = interpolate(f, [252, 278], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── F3 · MATCH-SHAPE y F4 · barrido final
  const m = interpolate(f, [F_GRID, 452], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const sal = interpolate(f, [F_SAL, 521], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });

  const apoyo = useEntra(69, { rise: 18 });
  // la key de cada acto: la posición continua + un sesgo por ACTO (0,012 = 0,4 px de sombra,
  // invisible en la frontera pero da a cada acto su propio ángulo de specular en las hojas)
  const luzN = luzX / 100 + (acto.i - 1.5) * 0.012;

  return (
    <AbsoluteFill style={{ backgroundColor: VSL.color.bg0, overflow: "hidden" }}>
      {/* ── L1 · PLATE a sangre, con el zoom-through y el dolly del movimiento ── */}
      <AbsoluteFill style={{ transform: `scale(${(dolly * through).toFixed(4)})`, overflow: "hidden" }}>
        <Plate src={plate} desde={desde} profundidad={0.8} />
      </AbsoluteFill>

      {/* ── L2+L3 · velo direccional + hermano desenfocado (⛔ jamás backdrop-filter) ── */}
      <Grade p={gp} blurSrc={plateBlur} fuerza={gf} lado="centro" />

      {/* ── L6 · LA LUZ: key cálida que se mueve + contraluz frío de la pantalla ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 52% at ${luzX.toFixed(1)}% ${luzY.toFixed(1)}%, rgba(240,185,104,${luzI.toFixed(3)}) 0%, rgba(224,146,44,${(luzI * 0.34).toFixed(3)}) 46%, rgba(0,0,0,0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
      {frio > 0.004 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(46% 58% at 16% 54%, rgba(176,206,232,${frio.toFixed(3)}) 0%, rgba(0,0,0,0) 100%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
      {/* cama del bloque de texto: se disuelve SOLA mientras el titular sube (no es un corte) */}
      {scrim > 0.004 && (
        <AbsoluteFill
          style={{ background: `linear-gradient(90deg, rgba(12,11,9,${scrim.toFixed(3)}) 0%, rgba(12,11,9,${(scrim * 0.78).toFixed(3)}) 40%, rgba(12,11,9,0) 72%)` }}
        />
      )}

      {/* ── el canto de la hoja que acabamos de atravesar (cierra el ZOOM-THROUGH) ── */}
      {aroOp > 0.01 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", left: "50%", top: "50%", width: 1720, height: 980,
              marginLeft: -860, marginTop: -490, borderRadius: 10,
              border: `26px solid ${SOFT}`, opacity: aroOp,
              transform: `scale(${aro.toFixed(3)}) rotate(-3deg)`,
              boxShadow: "0 0 120px rgba(0,0,0,.5), 0 0 60px rgba(255,255,255,.35) inset",
            }}
          />
        </AbsoluteFill>
      )}

      {/* ══ EL ESCENARIO 3D — un solo espacio para todos los actos ══ */}
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 46%" }}>
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${(dolly * cam.z).toFixed(4)}) translate3d(${(cam.panX * 0.45).toFixed(3)}%, ${(cam.panY * 0.4).toFixed(3)}%, 0) rotateY(${(cam.ry * 0.6).toFixed(3)}deg) rotateX(${(cam.rx * 0.6).toFixed(3)}deg)`,
          }}
        >
          {/* ── ACTO 1 · la clase corriendo en la pantalla: UNA tarjeta con CLIP real adentro.
              008 dura 120 f y se usa 118 (⛔ pasarlo congela el último cuadro). ── */}
          {f < F_SWAP && (
            <Sequence from={2} durationInFrames={118} layout="none">
              <div
                style={{
                  position: "absolute", left: 1118, top: 298, width: 646, height: 452,
                  transform: `translate3d(${(interpolate(f, [104, 126], [0, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }) + cam.panX * 9).toFixed(1)}px, ${(Math.sin(f / 71) * 6).toFixed(1)}px, 120px) rotateY(${(-6.5 + cam.ry * 0.8).toFixed(2)}deg) rotateX(${(2.4).toFixed(2)}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Tarjeta src="broll/vslcurso_008.mp4" w={646} h={452} texto={false} seed={11} z={120} at={0} />
                <Contacto w={646} y={462} op={0.5} />
              </div>
            </Sequence>
          )}

          {/* ── ACTO 2 · la hoja que salió de la impresora del vecino ATERRIZA (materia que cruza) ── */}
          {f >= F_SWAP && f < 214 && (
            <Hoja
              f={f} src="img/vslg01.png" luz={luzN} seed={91} zi={2}
              w={520} h={330} lab={0}
              x={-96 + cam.panX * 5}
              y={164 + interpolate(f, [F_SWAP, 158], [-210, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
                + interpolate(f, [190, 214], [0, 230], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) })}
              rot={interpolate(f, [F_SWAP, 158], [-17, -6.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
              rx={interpolate(f, [F_SWAP, 158], [34, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
              z={-140} s={0.8}
              op={interpolate(f, [190, 212], [0.92, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              desenf={interpolate(f, [F_SWAP, 150], [3.4, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          )}

          {/* ── ACTO 2 · el protagonista: el estante de documentos, CLIP real (049: 162 f, usa 100) ── */}
          {f >= F_SWAP && f < 248 && (
            <Sequence from={146} durationInFrames={100} layout="none">
              <div
                style={{
                  position: "absolute", left: 1150, top: 430, width: 584, height: 398,
                  transform: `translate3d(${(cam.panX * 11).toFixed(1)}px, ${(interpolate(f, [226, 246], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }) + Math.sin(f / 63 + 1.4) * 7).toFixed(1)}px, 160px) rotateY(${(-8 + cam.ry * 0.9).toFixed(2)}deg) rotateX(3deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Tarjeta src="broll/vslcurso_049.mp4" w={584} h={398} texto={false} seed={23} z={160} at={0} />
                <Contacto w={584} y={408} op={0.46} />
              </div>
            </Sequence>
          )}

          {/* ══ ACTOS 3+4 · el CARRUSEL 3D: seis hojas que aterrizan nombradas y terminan planas ══ */}
          {DOCS.map((d, i) => {
            if (f < d.at - 1) return null;
            const e = interpolate(f, [d.at, d.at + 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            const ea = interpolate(f, [d.at, d.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fan = d.fan ?? { x: gridX(i), y: gridY(i), r: 0, z: 0 };
            const fanS = d.fan ? 1.18 : 1;
            const gx = gridX(i), gy = gridY(i);
            const x = fan.x + (gx - fan.x) * m + cam.panX * (4 + i * 1.7);
            const y = fan.y + (gy - fan.y) * m - (1 - e) * 210 + sal * (430 + i * 26);
            const rot = fan.r * (1 - m) + (1 - e) * (i % 2 === 0 ? -13 : 11);
            const rx = (1 - e) * 44 + (1 - m) * (d.fan ? 5 : 0);
            const z = (fan.z * (1 - m)) - (1 - e) * 540;
            const s = fanS + (1 - fanS) * m;
            const op = ea * (1 - sal);
            if (op <= 0.004) return null;
            const hoja = (
              <Hoja
                f={f} src={d.src} rotulo={d.rotulo} luz={luzN} seed={i * 13 + 5} zi={10 + i}
                x={x} y={y} rot={rot} rx={rx} z={z} s={s} op={op}
                desenf={(1 - ea) * 3.6}
              />
            );
            // el clip 031 dura 210 f y acá se usa 152: va en su propia Sequence para que el
            // tiempo del video arranque en su frame de entrada (⛔ `loop` no es prop de OffthreadVideo)
            return d.src.endsWith(".mp4")
              ? <Sequence key={i} from={d.at} durationInFrames={152} layout="none">{hoja}</Sequence>
              : <React.Fragment key={i}>{hoja}</React.Fragment>;
          })}

          {/* ── L7 · TIPOGRAFÍA ── */}
          {/* ACTO 1: el 16 con odómetro, anclado al ms en que se dice */}
          {f < F_SWAP && (
            <div style={{ position: "absolute", left: SAFE + 24, top: 262, width: 820, transform: `translate3d(0,0,60px) rotateY(${(cam.ry * 0.3).toFixed(2)}deg)` }}>
              <Kicker at={2}>EL CURSO POR DENTRO</Kicker>
              <div style={{ marginTop: 16 }}>
                <Cifra hasta={16} at={3} sufijo=" clases" size={226} />
              </div>
              <div
                style={{
                  marginTop: 26, fontFamily: FF, fontSize: 38, fontWeight: 500, lineHeight: 1.28,
                  color: "rgba(255,255,255,.88)", textShadow: SOMBRA_TEXTO, maxWidth: 740,
                  opacity: apoyo.a, filter: apoyo.blur, transform: `translateY(${apoyo.y.toFixed(1)}px)`,
                }}
              >
                Unas tres horas, ordenadas de principio a fin.
              </div>
            </div>
          )}

          {/* ACTOS 2-4: el MISMO titular viaja del centro-izquierda al borde superior */}
          {f >= F_SWAP && (
            <div
              style={{
                position: "absolute", left: 120 + 36 * tp, top: 412 - 316 * tp - sal * 150,
                width: 1608, transform: `translate3d(0,0,${(46 - 26 * tp).toFixed(1)}px)`,
              }}
            >
              {f < 286 && (
                <div style={{ opacity: kOpa, transform: `translateX(${kOut.toFixed(1)}px)`, marginBottom: 14 }}>
                  <Kicker at={140}>ADEMÁS DE LAS CLASES</Kicker>
                </div>
              )}
              <div style={{ maxWidth: 880 + 728 * tp }}>
                <Titular at={146} size={64 - 14 * tp} z={30}>Los documentos que vas a usar de verdad</Titular>
              </div>
            </div>
          )}

          {/* ── primer plano DESENFOCADO (el hermano _blur.jpg, coste 0): el plano que se mueve MÁS ── */}
          <div
            style={{
              position: "absolute", left: -120, right: -120, bottom: -92, height: 268,
              overflow: "hidden", opacity: 0.44, transform: `translate3d(${(cam.panX * -16).toFixed(1)}px, 0, 240px)`,
              maskImage: "linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
            }}
          >
            <Img src={staticFile(plateBlur)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 92%" }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── F2 · WIPE POR MATERIA: polvo de papel mientras la primera hoja ya cae ── */}
      {f >= F_WIPE - 2 && f <= F_WIPE + 26 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 60 }}>
          {Array.from({ length: 24 }, (_, i) => {
            const r = rnd(i * 3.7 + F_WIPE), r2 = rnd(i * 9.1 + F_WIPE + 2);
            const p = interpolate(f, [F_WIPE, F_WIPE + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sz = 12 + r * 44;
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: `${(-18 + p * 148 + r2 * 36).toFixed(2)}%`, top: `${(r2 * 100).toFixed(1)}%`,
                  width: sz, height: sz, borderRadius: "50%", background: "rgba(245,242,236,.92)",
                  filter: `blur(${(7 + r * 13).toFixed(1)}px)`,
                  opacity: Math.sin(p * Math.PI) * (0.16 + r * 0.42),
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* ── L4+L8+L9 · UNA sola atmósfera para los cuatro actos: NUNCA se remonta ── */}
      <Atmos desde={desde} polvo={1} bokeh={1} />

      {/* ── F1 · OCLUSIÓN: la hoja real cruza y tapa el 100 % entre f134 y f140 (swap en f137) ── */}
      <HojaQueCruza at={F_OCL} dur={16} />

      {/* el barrido especular de la hoja que cruza deja una huella en la lente (no es un fade:
          vive sólo mientras la hoja está en cuadro) */}
      {f >= F_OCL && f <= F_OCL + 18 && (
        <AbsoluteFill
          style={{
            zIndex: 91, pointerEvents: "none", mixBlendMode: "screen",
            background: `radial-gradient(60% 70% at ${(12 + (f - F_OCL) * 5.2).toFixed(1)}% 46%, rgba(255,244,224,${(0.22 * Math.sin(((f - F_OCL) / 18) * Math.PI)).toFixed(3)}) 0%, rgba(0,0,0,0) 100%)`,
          }}
        />
      )}

    </AbsoluteFill>
  );
};
