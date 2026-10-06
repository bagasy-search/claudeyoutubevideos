// MovCta.tsx — MOVIMIENTO 6 · "CAROL, PHOENIX · LOS DOS INODOROS QUE TRES PLOMEROS CONDENARON"
// 780 frames @ 30 fps (26 s) · canal Mike Dalton (EN) · video `mdring`.
//
// ES EL CTA DEL VIDEO. Regla dura del canal: sin precio, sin link hablado, sin URL escrita.
// La UNICA puerta es el QR — y por eso la regla que manda aca es fisica, no estetica:
// **si el QR se mueve, el telefono no lo escanea.** Todo el movimiento esta construido para
// llegar a un cuadrado blanco, quieto y centrado, con la camara CONGELADA debajo.
//
// ===========================================================================================
// TABLA DE HANDOFF
// ===========================================================================================
// ENTRA (f0)   · z -200 · banco de trabajo · luz CALIDA de taller (RING.warm, key izq 0.30)
// SALE (f780)  · z +260 · QR QUIETO Y CENTRADO sobre blanco · luz NEUTRA (fondo #FFFFFF pleno)
//
// | acto | frames  | narracion anclada                    | protagonista           | material real           | luz      | cam z |
// |------|---------|--------------------------------------|------------------------|-------------------------|----------|-------|
// | 1    | 0-192   | f0 plumbers / f64 "Replace them." /  | LA PAGINA de canto     | h61_printedpages (clip) | CALIDA   | -200  |
// |      |         | f105 done / f138 surface like that   | sobre el banco         | + lam_routine (papel)   |          |       |
// | 2    | 198-350 | f209 not bad advice / f270 what I    | el TELEFONO con la     | h62_photoonphone (clip) | CALIDA   | -60   |
// |      |         | would have told her / f313 she didnt | foto del resultado     | + lam_routine (papel)   |          |       |
// | 3    | 356-614 | f365 the chapter / f481 saving /     | LAS PAGINAS DE LA GUIA | lam_routine/_ringtest/  | CALIDA   | +90   |
// |      |         | f508 a step nobody knows             | abiertas y apiladas    | _nevermix + h63 + h60   | a neutra |       |
// | 4    | 616-780 | f656 once dry you can seal the glaze | EL QR                  | mdring_qrcard.jpg       | NEUTRA   | +260  |
// |      |         |                                      | (nace de la pagina)    | (nada mas en cuadro)    | blanco   | FIJO  |
//
// COSTURAS (ningun fade, y dos fronteras seguidas nunca repiten tipo)
//   · f64  BEAT       — SeamFlash rojo de 7 frames sobre "Replace them." (corte en el beat, intra-acto)
//   · f192 FRONTERA A — OCLUSION: la propia pagina gira de canto y su lomo barre el 100% del cuadro.
//                       La materia que tapa ES el objeto protagonista, no un elemento prestado.
//   · f326 FRONTERA B — ZOOM-THROUGH: la tarjeta del telefono crece hasta atravesar el lente; detras
//                       ya esta la guia abierta. No hay corte visible: se ve pasar el objeto.
//   · f498 WIPE POR MATERIA — el brillo del coating ceramico cruza y trae la porcelana sellada.
//   · f552 MATCH-MOVE — el telefono sube y la pila de paginas sube con el MISMO vector.
//   · f616 FRONTERA C — MATCH-SHAPE: la pagina se gira sobre su eje y **su dorso ES el QR**.
//                       Es la costura natural del cierre: la materia que cruzo los 4 actos
//                       (la pagina) termina convertida en el cuadrado que se escanea.
//
// EL HOLD DEL QR — el numero que no se negocia
//   · f616-644 · la pagina se voltea (28 frames) y el QR llega a plano.
//   · **f644 -> f780 · QR QUIETO: 136 frames = 4,53 s.** Cero deriva, cero rotacion, cero parallax,
//     cero barrido especular, cero blur. La camara esta congelada desde f612 (`gcam` recibe
//     `Math.min(f, 612)`, asi que su deriva viva tambien queda clavada), el QR se dibuja FUERA
//     del arbol de la camara como un bloque plano sin transform, el grano se apaga antes de f616
//     y el fondo es blanco pleno. El rotulo "Point your phone camera at it" vive ABAJO, a 63 px
//     del borde del codigo — nunca encima.
//
// CONTRATO: sin Math.random/Date.now (todo `rnd(i)`), sin backdrop-filter, sin blur grande a
// pantalla completa, sin Easing.quint, rutas relativas a public/, safe area 60 px, rampas <=15
// frames, imports solo de `remotion`, `react` y `./RingStage`. Aguanta durationInFrames != 780.
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  RING, rgba, clamp01, lerp, eio, rnd, gcam, light, RingAtmos, Layers, Plane,
  MediaCard, PhotoPlane, SeamOcclude, SeamWipeMatter, SeamFlash, Kick, Head, Em, Bed,
} from "./RingStage";

// -- el reloj del movimiento ----------------------------------------------------------------
const A2 = 198, A3 = 356, A4 = 616, END = 780;
const SEAM_A = 192;      // OCLUSION (frontera 1 -> 2)
const SEAM_B = 326;      // ZOOM-THROUGH (frontera 2 -> 3)
const SEAM_MATTER = 498; // WIPE POR MATERIA (sub-beat: el coating)
const CAM_FREEZE = 612;  // desde aca la camara NO se mueve mas (ni su deriva viva)
const QR_LOCK = 644;     // desde aca el QR esta absolutamente quieto — hasta END (136 frames)

const LAM_ROUTINE = "img/mdring_lam_routine.jpg";
const LAM_RINGTEST = "img/mdring_lam_ringtest.jpg";
const LAM_NEVERMIX = "img/mdring_lam_nevermix.jpg";

// motas de polvo del taller — deterministicas (el farm rinde en chunks paralelos)
const MOTES = Array.from({ length: 24 }, (_, i) => ({
  x: rnd(i * 3.1) * 100,
  y: 8 + rnd(i * 7.3 + 1) * 84,
  r: 2 + rnd(i * 5.9 + 2) * 5,
  sp: 0.25 + rnd(i * 2.7 + 3) * 0.7,
  ph: rnd(i * 11.3 + 4) * 220,
}));

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// -- EL PAPEL --------------------------------------------------------------------------------
// Una pagina de la guia tiene que leerse como PAPEL REAL flotando: canto vivo, ondulacion,
// la key calida entrando por arriba-izquierda y una sombra de contacto que aterriza en el suelo.
const PaperSheet: React.FC<{
  src: string; xPct: number; yPct: number; w: number; ry: number;
  rot?: number; z?: number; opacity?: number; lit?: number; ratio?: number;
}> = ({ src, xPct, yPct, w, ry, rot = 0, z = 0, opacity = 1, lit = 1, ratio = 1.5 }) => {
  const h = w * ratio;
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute", left: `${xPct}%`, top: `${yPct}%`,
        width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
        transform: `translateZ(${z}px) rotateY(${ry.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
        opacity,
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: RING.porcelain,
        boxShadow: `0 ${Math.round(h * 0.09)}px ${Math.round(h * 0.15)}px ${rgba(RING.ink0, 0.7)}, 0 2px 9px ${rgba(RING.ink0, 0.6)}`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {/* ondulacion: el papel no es un rectangulo plano */}
      <AbsoluteFill style={{
        background: `linear-gradient(101deg, ${rgba(RING.ink0, 0.3)} 0%, ${rgba(RING.white, 0.16)} 17%, ${rgba(RING.ink0, 0.1)} 46%, ${rgba(RING.white, 0.14)} 72%, ${rgba(RING.ink0, 0.26)} 100%)`,
        mixBlendMode: "soft-light",
      }} />
      {/* la key calida del taller */}
      <AbsoluteFill style={{ background: `linear-gradient(154deg, ${rgba(RING.warm, 0.22 * lit)} 0%, rgba(0,0,0,0) 54%)` }} />
      {/* el canto del papel: lo que brilla cuando la hoja esta de perfil */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: rgba(RING.white, 0.58 * lit) }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${Math.round(h * 0.13)}px ${rgba(RING.ink0, 0.46)}` }} />
    </div>
  );
};

// sombra de contacto que ATERRIZA en el suelo negro de la atmosfera (sin filter: blur)
const ContactShadow: React.FC<{ xPct: number; yPct: number; w: number; strength?: number }> = ({
  xPct, yPct, w, strength = 0.6,
}) => (
  <div style={{
    position: "absolute", left: `${xPct}%`, top: `${yPct}%`,
    width: w, height: w * 0.34, marginLeft: -w / 2, marginTop: -w * 0.17,
    background: `radial-gradient(ellipse at 50% 50%, ${rgba(RING.ink0, 0.78 * strength)} 0%, rgba(0,0,0,0) 70%)`,
  }} />
);

export const MovCta: React.FC<{
  durationInFrames: number;
  qr?: string;
  pages?: string[];
}> = ({ durationInFrames, qr = "img/mdring_qrcard.jpg", pages = [] }) => {
  const frame = useCurrentFrame();
  // aguanta durationInFrames != 780. Si el cue viene MAS LARGO, el reloj se clava en END y el QR
  // se queda quieto de mas (que es exactamente lo que queremos). Si viniera mas CORTO, el reloj se
  // comprime para que el QR igual llegue y sostenga su proporcion de hold en vez de quedar cortado.
  const D = Math.max(1, durationInFrames);
  const f = D >= END ? Math.min(frame, END) : Math.min((frame * END) / D, END);
  const LAMS = pages.length >= 3 ? pages.slice(0, 3) : [LAM_ROUTINE, LAM_RINGTEST, LAM_NEVERMIX];

  // -- LA CAMARA · una sola, nunca vuelve a 0, y se CONGELA para que el QR se pueda escanear --
  // panX/panY = 0 a proposito: asi el centro optico del encuadre ES el centro de pantalla y la
  // pagina puede entregarle su lugar al QR sin un solo pixel de salto (MATCH-SHAPE limpio).
  const C = gcam(Math.min(f, CAM_FREEZE), { z0: -200, z1: 260, panX: 0, panY: 0, ry: 4.5, rx: -2, dur: 596 });

  // -- LA LUZ · taller calido -> neutra al llegar al QR --
  const neutral = clamp01((f - 500) / 100);
  const tint = light(neutral, "warm", "cold");
  const keyPos = ip(f, [0, A2, A3, 520, A4], [0.3, 0.38, 0.5, 0.44, 0.36]);
  const inten = ip(f, [0, A2, A3, 520, A4], [1.06, 1.02, 0.98, 0.9, 0.78]);

  // -- LA MATERIA QUE CRUZA: LA PAGINA --
  // de canto sobre el banco -> se abre -> se apila con las otras -> se gira hasta ser el QR.
  const rock = Math.sin(f / 38) * 1.7 * (1 - ip(f, [586, 610], [0, 1]));
  const pgX = ip(f, [0, SEAM_A, A2, 330, 392, 470, 556, 610], [44, 44.6, 29, 29.5, 34, 33, 27, 50]);
  const pgY = ip(f, [0, SEAM_A, A2, 330, 392, 470, 556, 610], [58, 57.4, 56, 55.6, 50, 50, 52, 44]);
  const pgW = ip(f, [0, SEAM_A, A2, 330, 392, 470, 556, 610], [232, 236, 252, 254, 392, 392, 336, 416]);
  const pgRy = ip(f, [0, 120, SEAM_A, A2, 330, 392, 610], [84, 79, 88, 34, 30, 6, 4.5]) + rock;

  // las dos hermanas: entran a f424, se abren en abanico y se vuelven a juntar en la pila
  const spread = ip(f, [424, 476], [0, 1]) * (1 - ip(f, [556, 604], [0, 1]));
  const sibIn = ip(f, [424, 452], [0, 1]) * (1 - ip(f, [600, 614], [0, 1]));

  // -- FRONTERA B · ZOOM-THROUGH: la tarjeta del telefono atraviesa el lente --
  const zt = eio(0, 1, clamp01((f - SEAM_B) / 24));
  const phW = lerp(700, 3600, zt);
  const phH = lerp(400, 2060, zt);
  const phX = lerp(63, 50, zt);
  const phY = lerp(46, 50, zt);
  const phZ = lerp(-40, 320, zt);

  // -- FRONTERA C · MATCH-SHAPE: la pagina se voltea y su dorso es el QR --
  const flip = eio(0, 1, clamp01((f - A4) / (QR_LOCK - A4)));   // 616 -> 644
  const flipDeg = 180 * flip;
  const cardW = ip(f, [A4, 638], [520, 628]);                   // el retrato se vuelve CUADRADO
  const cardH = ip(f, [A4, 638], [780, 628]);
  const heldRy = ip(f, [A4, 634], [4.5, 0]);                    // hereda el angulo de la camara congelada
  const heldRx = ip(f, [A4, 634], [-2, 0]);

  // -- el blanco: nace del propio papel y se come el bano (no es un fade, es la luz que vira) --
  const bloom = ip(f, [614, 640], [0, 124]);
  const solidWhite = ip(f, [628, 642], [0, 1]);

  const sceneOn = f < 646;

  return (
    <AbsoluteFill style={{ backgroundColor: RING.ink0, overflow: "hidden" }}>
      {/* UNA atmosfera, montada una sola vez, para los cuatro actos */}
      {sceneOn && <RingAtmos tint={tint} keyFrom={keyPos} intensity={inten} />}

      {sceneOn && (
        <Layers cam={C.transform}>
          {/* -- PLANO 1 · z -620 · la cama de foto: el cuarto detras de todo -- */}
          <Plane z={-620}>
            {f < 352 && <PhotoPlane src="img/mdring_h61_printedpages_blur.jpg" z={0} scale={1.24} dim={0.5} />}
            {f >= 352 && f < SEAM_MATTER && <PhotoPlane src="img/mdring_lam_routine_blur.jpg" z={0} scale={1.3} dim={0.56} />}
            {f >= SEAM_MATTER && <PhotoPlane src="img/mdring_h63_ceramiccoat_blur.jpg" z={0} scale={1.22} dim={0.46} />}
          </Plane>

          {/* -- PLANO 2 · z -380 · aire: el haz de la ventanita y el polvo lejano -- */}
          <Plane z={-380}>
            <AbsoluteFill style={{
              background: `linear-gradient(118deg, ${rgba(tint, 0.16)} 0%, rgba(0,0,0,0) 38%)`,
              mixBlendMode: "screen",
            }} />
            {MOTES.slice(0, 14).map((m, i) => {
              const yy = (m.y - ((f * m.sp + m.ph) % 120) * 0.5 + 120) % 120;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${m.x}%`, top: `${yy - 10}%`,
                  width: m.r, height: m.r, borderRadius: "50%",
                  background: rgba(RING.warm, 0.5),
                  opacity: 0.22 + rnd(i * 9.1) * 0.2,
                }} />
              );
            })}
          </Plane>

          {/* -- PLANO 3 · z -120 · LAS TARJETAS CON MATERIAL REAL -- */}
          <Plane z={-120}>
            {/* ACTO 1 · el banco: Mike con las paginas impresas */}
            <Sequence from={40} durationInFrames={150} layout="none">
              <MediaCard
                src="broll/mdring_h61_printedpages.mp4" kind="video"
                w={624} h={356}
                x={ip(f, [40, 178, 190], [69, 68, 96])} y={43}
                z={-30} ry={-9} rx={2}
                lit={0.95} sheenAt={26} label="Carol · Phoenix, AZ"
                opacity={ip(f, [40, 54], [0, 1]) * (1 - ip(f, [178, 190], [0, 1]))}
              />
            </Sequence>

            {/* ACTO 2 · el telefono con la foto del resultado — y el objeto del ZOOM-THROUGH */}
            <Sequence from={206} durationInFrames={150} layout="none">
              <MediaCard
                src="broll/mdring_h62_photoonphone.mp4" kind="video"
                w={phW} h={phH}
                x={phX} y={phY}
                z={phZ} ry={lerp(-7, 0, zt)} rx={lerp(1.5, 0, zt)}
                lit={1} sheenAt={22}
                label={zt < 0.06 ? "She didn't replace them" : undefined}
                opacity={ip(f, [206, 220], [0, 1])}
                grade={zt < 0.5}
              />
            </Sequence>

            {/* ACTO 3b · el paso del detailer: el coating ceramico sobre la porcelana seca */}
            {f >= SEAM_MATTER && (
              <Sequence from={502} durationInFrames={140} layout="none">
                <MediaCard
                  src="broll/mdring_h63_ceramiccoat.mp4" kind="video"
                  w={742} h={422}
                  x={ip(f, [502, 560, 616], [64, 63, 68])} y={ip(f, [502, 616], [43, 39])}
                  z={-10} ry={-6} rx={1}
                  lit={1} sheenAt={514} label="Seal the glaze"
                  opacity={ip(f, [502, 516], [0, 1]) * (1 - ip(f, [612, 626], [0, 1]))}
                />
              </Sequence>
            )}

            {/* ACTO 3c · MATCH-MOVE: el telefono sube, y la pila sube con el mismo vector */}
            {f >= 550 && (
              <Sequence from={550} durationInFrames={88} layout="none">
                <MediaCard
                  src="broll/mdring_h60_phonescan.mp4" kind="video"
                  w={404} h={236}
                  x={22} y={ip(f, [550, 614], [76, 66])}
                  z={80} ry={9} rx={-2}
                  lit={0.9} sheenAt={566} label="Point the camera"
                  opacity={ip(f, [550, 564], [0, 1]) * (1 - ip(f, [608, 622], [0, 1]))}
                />
              </Sequence>
            )}
          </Plane>

          {/* -- PLANO 4 · z +40 · LA MATERIA QUE CRUZA: las paginas de la guia -- */}
          <Plane z={40}>
            {/* sombra de contacto: la hoja de canto apoya de verdad en el banco */}
            {f < 300 && <ContactShadow xPct={pgX} yPct={pgY + 22} w={pgW * 1.5} strength={ip(f, [0, 300], [0.85, 0.3])} />}

            {/* las dos hermanas del abanico */}
            {sibIn > 0.01 && [1, 2].map((i) => (
              <PaperSheet
                key={i}
                src={LAMS[i]}
                xPct={pgX + spread * (i === 1 ? 15.5 : 29) - (1 - spread) * i * 0.6}
                yPct={pgY + spread * (i === 1 ? 1.8 : 4.2) + Math.sin(f / (47 + i * 13)) * 0.35}
                w={pgW * (i === 1 ? 0.9 : 0.8)}
                ry={pgRy - spread * (5 + i * 4)}
                rot={-2.2 + i * 3.4 * spread}
                z={-26 * i}
                lit={0.9 - i * 0.16}
                opacity={sibIn}
              />
            ))}

            {/* LA PAGINA — de canto (acto 1) -> abierta (acto 3) -> cuadrado del QR (acto 4) */}
            {f < A4 && (
              <PaperSheet
                src={LAMS[0]}
                xPct={pgX}
                yPct={pgY + Math.sin(f / 53) * 0.4 * (1 - ip(f, [586, 610], [0, 1]))}
                w={pgW}
                ry={pgRy}
                rot={ip(f, [0, A2, 392, 610], [-1.6, -3.4, -1.2, 0])}
                z={0}
                lit={ip(f, [0, 120, 392, 610], [1.15, 0.95, 1, 1.1])}
              />
            )}
          </Plane>

          {/* -- PLANO 5 · z +230 · el canto del banco, fuera de foco, comiendose el borde bajo -- */}
          <Plane z={230}>
            <div style={{
              position: "absolute", left: "-10%", right: "-10%", bottom: "-6%", height: "26%",
              background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(RING.ink0, 0.86)} 62%, ${RING.ink0} 100%)`,
              opacity: ip(f, [0, A3, 560], [0.95, 0.7, 0.45]),
            }} />
          </Plane>

          {/* -- PLANO 6 · z +360 · polvo en primer plano, desenfocado -- */}
          <Plane z={360}>
            {MOTES.slice(14).map((m, i) => {
              const yy = (m.y - ((f * m.sp * 1.5 + m.ph) % 140) * 0.6 + 140) % 140;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${m.x}%`, top: `${yy - 20}%`,
                  width: m.r * 5, height: m.r * 5, borderRadius: "50%",
                  background: `radial-gradient(circle, ${rgba(RING.warm, 0.34)} 0%, rgba(0,0,0,0) 68%)`,
                  filter: "blur(5px)",
                  opacity: 0.4 * (1 - ip(f, [560, 612], [0, 1])),
                }} />
              );
            })}
          </Plane>
        </Layers>
      )}

      {/* -- COSTURAS ---------------------------------------------------------------------- */}
      {/* CORTE EN EL BEAT · "Replace them." */}
      <SeamFlash at={64} color={RING.redHot} dur={7} />
      {/* FRONTERA A · OCLUSION — el lomo de la pagina barre el cuadro */}
      <SeamOcclude at={SEAM_A} dur={14} color={RING.ink1} angle={7} />
      {/* WIPE POR MATERIA · el brillo del coating ceramico cruza y trae la porcelana sellada */}
      <SeamWipeMatter at={SEAM_MATTER} dur={22} tint={RING.bone} />

      {/* -- EL BLANCO · la luz neutra del cierre nace del propio papel -- */}
      {f >= 612 && f < 648 && (
        <AbsoluteFill style={{
          background: `radial-gradient(circle at 50% 44%, ${RING.white} 0%, ${RING.white} ${bloom.toFixed(1)}%, rgba(255,255,255,0) ${(bloom + 6).toFixed(1)}%)`,
        }} />
      )}
      <AbsoluteFill style={{ backgroundColor: RING.white, opacity: solidWhite }} />

      {/* -- FRONTERA C · MATCH-SHAPE · la pagina se voltea: su dorso ES el QR -- */}
      {f >= A4 && f < QR_LOCK && (
        <div style={{
          position: "absolute", left: "50%", top: "44%",
          width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2,
          transformStyle: "preserve-3d",
          transform: `perspective(1700px) rotateY(${(heldRy + flipDeg).toFixed(2)}deg) rotateX(${heldRx.toFixed(2)}deg)`,
        }}>
          {/* cara A · la pagina de la guia */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            borderRadius: 4, overflow: "hidden", backgroundColor: RING.porcelain,
            boxShadow: `0 42px 90px ${rgba(RING.ink0, 0.5)}`,
          }}>
            <Img src={staticFile(LAMS[0])} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <AbsoluteFill style={{
              background: `linear-gradient(101deg, ${rgba(RING.ink0, 0.26)} 0%, ${rgba(RING.white, 0.16)} 20%, ${rgba(RING.ink0, 0.08)} 52%, ${rgba(RING.white, 0.12)} 80%, ${rgba(RING.ink0, 0.22)} 100%)`,
              mixBlendMode: "soft-light",
            }} />
          </div>
          {/* cara B · el QR */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: RING.white, borderRadius: 10, padding: 44,
            boxShadow: `0 26px 64px ${rgba(RING.ink0, 0.16)}`,
          }}>
            <Img src={staticFile(qr)} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
        </div>
      )}

      {/* -- EL QR QUIETO · f644 -> f780 · 136 frames (4,53 s) ------------------------------
          Bloque plano, sin transform, sin rotacion, sin escala, sin deriva, sin sheen, sin blur.
          Fondo blanco pleno alrededor: la zona silenciosa que el lector de la camara necesita.
          Caja 628x628 centrada en x (646..1274) y optica en y (161..789). */}
      {f >= QR_LOCK && (
        <div style={{
          position: "absolute", left: 646, top: 161, width: 628, height: 628,
          background: RING.white, borderRadius: 10, padding: 44,
          boxShadow: `0 26px 64px ${rgba(RING.ink0, 0.14)}`,
        }}>
          <Img src={staticFile(qr)} style={{ width: 540, height: 540, display: "block" }} />
        </div>
      )}

      {/* -- TIPOGRAFIA · una idea por acto, <=7 palabras, <Head> dentro de <Bed> ------------ */}
      <AbsoluteFill style={{ padding: 92, display: "flex", flexDirection: "column", justifyContent: "flex-end", pointerEvents: "none" }}>
        {/* ACTO 1 */}
        {f < SEAM_A && (
          <div style={{
            maxWidth: 1180,
            opacity: ip(f, [34, 48], [0, 1]) * (1 - ip(f, [176, 190], [0, 1])),
            transform: `translateY(${ip(f, [34, 48], [22, 0]).toFixed(1)}px)`,
          }}>
            <Bed>
              <Kick>Phoenix · the hardest water in the country</Kick>
              <div style={{ marginTop: 14 }}>
                <Head size={66}>Three plumbers. One verdict.</Head>
                <Head size={66}><Em>Replace them.</Em></Head>
              </div>
            </Bed>
          </div>
        )}

        {/* ACTO 2 */}
        {f >= A2 && f < SEAM_B + 10 && (
          <div style={{
            maxWidth: 1120,
            opacity: ip(f, [214, 228], [0, 1]) * (1 - ip(f, [318, 332], [0, 1])),
            transform: `translateY(${ip(f, [214, 228], [20, 0]).toFixed(1)}px)`,
          }}>
            <Bed>
              <Kick>And they were not wrong</Kick>
              <div style={{ marginTop: 14 }}>
                <Head size={62}>I would have said it too.</Head>
              </div>
            </Bed>
          </div>
        )}

        {/* ACTO 3 — una sola idea; el eyebrow cambia en el beat de f508 */}
        {f >= A3 + 14 && f < A4 && (
          <div style={{
            maxWidth: 1240,
            opacity: ip(f, [376, 390], [0, 1]) * (1 - ip(f, [598, 612], [0, 1])),
            transform: `translateY(${(ip(f, [376, 390], [20, 0]) + Math.sin(f / 61) * 1.6).toFixed(1)}px)`,
          }}>
            <Bed>
              {f < 512 ? (
                <div style={{ opacity: 1 - ip(f, [500, 511], [0, 1]) }}>
                  <Kick>The chapter on bowls past saving</Kick>
                </div>
              ) : (
                <div style={{ opacity: ip(f, [512, 524], [0, 1]) }}>
                  <Kick>Nobody outside auto detailing knows it</Kick>
                </div>
              )}
              <div style={{ marginTop: 14 }}>
                <Head size={62}>She sealed the glaze instead.</Head>
              </div>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ACTO 4 · el rotulo va ABAJO del codigo, nunca encima · a 63 px del borde del QR */}
      {f >= 620 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 852,
          display: "flex", justifyContent: "center",
          opacity: ip(f, [624, 638], [0, 1]),
          pointerEvents: "none",
        }}>
          <Bed pad={28}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 46, height: 3, borderRadius: 2, background: RING.red,
                opacity: 0.55 + 0.45 * Math.abs(Math.sin(f / 34)),
              }} />
              <Kick>The chapter, the order, the dilution</Kick>
            </div>
            <div style={{ marginTop: 10 }}>
              <Head size={52}>Point your phone camera at it.</Head>
            </div>
          </Bed>
        </div>
      )}

      {/* grano: la misma piel de imagen de todo el video — se apaga ANTES del hold del QR */}
      <AbsoluteFill style={{
        opacity: 0.05 * (1 - ip(f, [600, 614], [0, 1])),
        backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
        backgroundSize: "3px 3px", mixBlendMode: "overlay", pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MOVCTA_FRAMES = END;
