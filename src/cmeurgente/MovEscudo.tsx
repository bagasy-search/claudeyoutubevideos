// MovEscudo.tsx — S2 · UN MOVIMIENTO CONTINUO de 59 s (1777 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 185,8.
//
// LA ESPINA: los CUATRO ESCUDOS DE HONESTIDAD. Antes de pedirle a nadie que confie, Claudio dice en
// voz alta lo que su video NO es: yo tengo paneles, esto no es energia gratis, esto no te desconecta,
// y esto no es vivir peor. Es el tramo de la CONFIANZA: luz limpia, camara amplia y lenta, cero
// alarma, cero rojo. Cada acto se lee como una afirmacion tranquila. El unico momento con energia
// es el motor de imanes tachado.
//
// EL OBJETO QUE CRUZA Y SE TRANSFORMA — un solo aro de metal recorre tres actos:
//   el MARCO DE ALUMINIO del panel de 49 dolares (rectangulo)  →  el ARO del motor de imanes
//   (circulo)  →  el SELLO REDONDO de la factura. Nace como borde de un objeto real, pasa a ser
//   perimetro de otro, y termina siendo un cuño. Nunca se apaga ni reaparece: se deforma.
//   En la ultima frontera el testigo es otro: el RENGLON DEL CARGO FIJO (una barra horizontal) se
//   vuelve la BANDA DE VAPOR que cruza el bano.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦═══════════════════════════════════════╦═══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto        ║ SALE: encuadre + luz + objeto                 ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 1  ║ CAM: viene de MovTreintaDias. MEDIA   ║ CAM: z≈-100→-66 y avanzando despacio hacia    ║
// ║ g0 ║ Y QUIETA, frontal, aire alrededor     ║      adelante-derecha. NO frena: la frontera  ║
// ║    ║ (z -100), sin inclinacion.            ║      la atraviesa con el mismo vector.        ║
// ║    ║ LUZ: MEDIODIA SOBRIO, sin dramatismo  ║ LUZ: keyFrom 0.70→0.66, tintA bone casi puro, ║
// ║    ║ (keyFrom 0.70, int 0.78, tintA bone,  ║      int 0.78→0.88: se abre, sigue limpia.    ║
// ║    ║ tintB paper). Es la confianza.        ║ MAT: EL MARCO DE ALUMINIO del panel se        ║
// ║    ║ MAT: EL VIDRIO DEL PANEL SOLAR CHICO  ║      despega del vidrio, cruza el cuadro con  ║
// ║    ║ apoyado en el patio, con la pinza.    ║      la chapa (V.steel) y empieza a redon-    ║
// ║    ║                                       ║      dearse. El panel se va por geometria.    ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 2  ║ CAM: z≈-66 avanzando, misma inercia,  ║ CAM: z≈-126, ya bajando (camDrop -16) y con   ║
// ║g427║ empieza a bajar (camDrop -6).         ║      el giro a la derecha todavia en negativo.║
// ║    ║ LUZ: keyFrom 0.66, int subiendo a 1.0 ║ LUZ: keyFrom 0.66→0.60, int 1.0→0.92, tintA   ║
// ║    ║ (unico pico de energia del movimiento)║      empieza a enfriarse hacia sky.           ║
// ║    ║ MAT: el marco de aluminio, ya casi    ║ MAT: EL ARO, ahora circulo perfecto alrededor ║
// ║    ║ circulo, aterriza como ARO del motor  ║      del motor, se encoge y viaja: se esta    ║
// ║    ║ de imanes sobre la mesa del taller.   ║      volviendo el SELLO REDONDO de la factura.║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 3  ║ CAM: z≈-126 bajando, misma curva.     ║ CAM: z≈-134 y ENTRANDO en el renglon del      ║
// ║g847║ LUZ: keyFrom 0.60, tintA a mitad de   ║      cargo fijo (zoom-through al punto 34/64).║
// ║    ║ camino bone→sky, tintB paper todavia. ║ LUZ: keyFrom 0.60→0.54, tintB paper→ambar     ║
// ║    ║ MAT: EL ARO llegando a la esquina de  ║      asomando: la cocina empieza a entrar.    ║
// ║    ║ la factura, que SUBE al cuadro desde  ║ MAT: EL RENGLON DEL CARGO FIJO — una barra    ║
// ║    ║ abajo por geometria y se vuelve sello.║      horizontal encendida — se estira.        ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 4  ║ CAM: saliendo del renglon, misma      ║ CAM: MEDIA-BAJA, EMPEZANDO A ROTAR HACIA LA   ║
// ║g1327║ direccion, sigue bajando.            ║      DERECHA (z -160, ry +6, camDrop -44). Es ║
// ║    ║ LUZ: keyFrom 0.54, tintA casi sky.    ║      el encuadre con el que abre MovDesglose. ║
// ║    ║ MAT: la barra del renglon YA es la    ║ LUZ: BLANCO ENFRIADO (tintA sky) + PRIMERA    ║
// ║    ║ BANDA DE VAPOR horizontal que cruza   ║      INSINUACION DEL AMBAR DE COCINA (tintB   ║
// ║    ║ el bano de la ducha caliente.         ║      amber, keyFrom 0.46).                    ║
// ║    ║                                       ║ MAT: EL VAPOR de la ducha caliente, tapando   ║
// ║    ║                                       ║      el ultimo tercio del cuadro.             ║
// ╚════╩═══════════════════════════════════════╩═══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g427   1→2  OCLUSION (V.steel)  — el MARCO DE ALUMINIO del panel cruza el cuadro como chapa
//                                     (`SeamOcclude color={V.steel}`, lit por defecto 0.30, sin
//                                     flash ni negro). Detras ya esta la mesa del taller con el
//                                     motor. El panel sale por GEOMETRIA (se va de cuadro a la
//                                     izquierda, jamas por opacity).
//   g847   2→3  MATCH-SHAPE         — el ARO del motor no se corta: se encoge de 340×340 a 152×152
//                                     y viaja a la esquina superior derecha, donde el cuño de la
//                                     empresa aparece ADENTRO de el. La misma circunferencia entrega
//                                     un rol y recibe el otro. A la vez la factura SUBE al cuadro
//                                     desde abajo y el motor se va por la izquierda: geometria pura.
//   g1327  3→4  ZOOM-THROUGH        — `zoomThrough(g, 1292, 40, 34, 64)`: la camara entra en el
//                                     renglon del CARGO FIJO y sale en el bano. La barra encendida
//                                     del renglon ya esta esperando del otro lado convertida en la
//                                     BANDA DE VAPOR horizontal.
//   salida      BARRIDO DE MATERIA  — `SeamWipeMatter` en V.paper + mis penachos: el vapor tapa el
//                                     ultimo tercio mientras la camara rota a la derecha.
//
// ⛔ CONTRATO: sin Math.random/Date.now (todo de rnd(k) y de g) · sin position:fixed · una sola capa
// ⛔ con blur (la del SeamWipeMatter del kit) · rutas SOLO literales de la ficha · sin <Sequence>
// ⛔ envolviendo actos: UN reloj continuo `g` para los cuatro.
// ⚠️ El build puede montar con su propia <Sequence>: useCurrentFrame() es LOCAL. Todo componente del
//    Stage que recibe `at`/`sheenAt` razona en frames locales → se traduce con L().
// ⚠️ Los clips duran 5,1 s (153 frames): cada ventana de video vive dentro de un bloque de 153 y la
//    FOTO va siempre debajo (el frame 0 del clip i2v ES la foto: el relevo no se ve).

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, CLIP_FRAMES, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, RoofPlane, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamWipeMatter, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

const END = 1777;
const A2 = 427;
const A3 = 847;
const A4 = 1327;

// bloques de 153 cuadros: las ventanas de clip se alinean adentro de uno para no cortar el loop
const B = CLIP_FRAMES;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── VENTANA: el marco de vidrio que RECORTA el material. Es la primitiva de este movimiento: la
//    misma Ventana crece, baja y rota sin re-encuadrar lo que tiene adentro. Adentro va SIEMPRE
//    material real (la foto de base, viva por recorte animado, y el clip encima en su ventana).
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; radius?: number; lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.28 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.14)}px ${Math.round(hh * 0.22)}px ${rgba(V.ink0, 0.72)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.56)}, inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana: la FOTO siempre (con recorte animado = nunca queda quieta) y el
//    CLIP encima mientras dura de verdad. `k` es el zoom de recorte (≥1: la foto siempre cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.04, k);
  const iw = Math.max(12, w * kk);
  const ih = Math.max(12, h * kk);
  return (
    <>
      <MediaCard src={photo} kind="photo" w={iw} h={ih} x={cx} y={cy} z={0}
        radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
      {clip && vid > 0.004 && (
        <MediaCard src={clip} kind="video" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} opacity={clamp01(vid)} />
      )}
    </>
  );
};

// ── EL ARO — EL OBJETO QUE CRUZA DOS FRONTERAS Y SE TRANSFORMA.
//    Rectangulo (marco de aluminio del panel) → circulo (aro del motor) → cuño (sello de la
//    factura). Una sola circunferencia con `radius` en %, que se deforma a traves de las costuras.
const Aro: React.FC<{
  x: number; y: number; w: number; h: number; radius: number; z?: number;
  color: string; grosor: number; on: number; rot?: number; glow?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, radius, z = 0, color, grosor, on, rot = 0, glow = 0.3, children }) => {
  const ww = Math.max(10, w);
  const hh = Math.max(10, h);
  const a = clamp01(on);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: `${radius.toFixed(1)}%`,
      border: `${Math.max(1, grosor).toFixed(1)}px solid ${rgba(color, 0.82 * a)}`,
      boxShadow: `0 0 ${Math.round(16 + 30 * glow)}px ${rgba(color, 0.42 * glow * a)}, ` +
        `inset 0 0 ${Math.round(12 + 22 * glow)}px ${rgba(color, 0.20 * glow * a)}, ` +
        `0 10px 30px ${rgba(V.ink0, 0.6 * a)}`,
      opacity: a,
    }}>{children}</div>
  );
};

// ── EL RENGLON DEL CARGO FIJO: esto SI es un grafico (un subrayado sobre material real), no un
//    objeto disfrazado de vector. En la frontera 3 la camara entra justo acá.
const Renglon: React.FC<{
  x: number; y: number; w: number; alto: number; on: number; brillo: number; tint: string;
}> = ({ x, y, w, alto, on, brillo, tint }) => {
  const a = clamp01(on);
  if (a <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`,
      height: Math.max(3, alto), marginTop: -Math.max(3, alto) / 2, opacity: a,
      background: `linear-gradient(90deg, ${rgba(tint, 0.10 + 0.30 * brillo)} 0%, ` +
        `${rgba(tint, 0.24 + 0.50 * brillo)} 46%, ${rgba(tint, 0.05 + 0.16 * brillo)} 100%)`,
      borderTop: `2px solid ${rgba(tint, 0.42 + 0.5 * brillo)}`,
      borderBottom: `1px solid ${rgba(tint, 0.20 + 0.4 * brillo)}`,
      boxShadow: `0 0 ${Math.round(10 + 46 * brillo)}px ${rgba(tint, 0.30 * brillo)}`,
    }} />
  );
};

// ── ROTULO de objeto de escena (el nombre de una cosa real, sobre su cama oscura).
const Rotulo: React.FC<{ x: number; y: number; on: number; tint?: string; children: React.ReactNode }> = ({
  x, y, on, tint = V.white, children,
}) => {
  const a = clamp01(on);
  if (a <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
      opacity: a, padding: "8px 14px", borderRadius: 8, whiteSpace: "nowrap",
      background: "linear-gradient(180deg, rgba(8,9,6,0.88) 0%, rgba(8,9,6,0.66) 100%)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 2.6,
      color: tint, textTransform: "uppercase",
    }}>{children}</div>
  );
};

// ── EL VAPOR — la materia del acto 4. Penachos de agua caliente que suben y se abren. Sin blur
//    (la unica capa borrosa del movimiento es la del SeamWipeMatter del kit): son gradientes
//    radiales con su propia deriva, deterministas por rnd(k).
const Vapor: React.FC<{ g: number; desde: number; fuerza: number; sesgo: number; z?: number }> = ({
  g, desde, fuerza, sesgo, z = 0,
}) => {
  const F = clamp01(fuerza);
  if (F <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translateZ(${z}px)` }}>
      {Array.from({ length: 20 }, (_, i) => {
        const o = rnd(i * 5.9);
        const vel = 0.34 + rnd(i * 2.3) * 0.7;
        const ciclo = 260 + rnd(i * 7.1) * 220;
        const t = (((g - desde) * vel) / ciclo + o) % 1;
        const sz = 240 + rnd(i * 3.7) * 380;
        const xx = lerp(sesgo - 26, sesgo + 30, rnd(i * 9.3)) + Math.sin((g + i * 40) / 96) * 3.4;
        const yy = lerp(112, 8, t);
        const env = Math.sin(clamp01(t) * Math.PI);
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
            width: sz, height: sz * 0.82, marginLeft: -sz / 2, marginTop: -sz * 0.41,
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 58%, ${rgba(V.paper, 0.16 * env * F)} 0%, ` +
              `${rgba(V.bone, 0.08 * env * F)} 42%, rgba(0,0,0,0) 72%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovEscudo: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build puede montar con su propia <Sequence>: el frame LOCAL no es el global.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4];
  const gRaw = Number.isFinite(gFrame as number) ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(4, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CAMARA — UNA sola, funcion de g, que NUNCA vuelve a 0 ══════════════════════════════
  // Un solo viaje de 59 s: entra media y QUIETA a z -100, avanza despacio, baja, y recien en el
  // ultimo tercio empieza a rotar a la derecha hasta ry +6 (el encuadre que recibe MovDesglose).
  const camB = gcam(g, { z0: -100, z1: -132, panX: 13, panY: -16, rx: 1.1, dur: END });
  const camZ = ip(g,
    [0, 130, 300, 427, 560, 700, 847, 1010, 1170, 1327, 1470, 1640, 1777],
    [0, 12, 28, 34, 16, 26, 6, 22, 34, 4, -10, -22, -28]);
  const camDrop = ip(g, [0, 240, 427, 700, 847, 1120, 1327, 1560, 1777],
    [0, -2, -6, -12, -16, -24, -30, -38, -44]);
  const camTilt = ip(g, [0, 427, 847, 1327, 1777], [0, -0.3, -0.7, -1.4, -2.2]);
  const camYaw = ip(g, [0, 427, 847, 1180, 1327, 1520, 1777],
    [0, -0.8, -1.6, -0.6, 1.0, 3.6, 6.0]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg) rotateY(${camYaw.toFixed(2)}deg)`;
  // la deriva de la camara, replicada (atenuada) para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — MEDIODIA SOBRIO (la confianza) que se enfria y deja asomar el ambar de cocina ══
  const keyFrom = ip(g, [0, 427, 847, 1327, 1777], [0.70, 0.66, 0.60, 0.54, 0.46]);
  const inten = ip(g, [0, 200, 427, 560, 660, 760, 847, 1120, 1327, 1560, 1777],
    [0.78, 0.86, 0.88, 0.94, 1.00, 0.96, 0.92, 0.86, 0.90, 0.94, 0.88]);
  const floor = ip(g, [0, 427, 847, 1327, 1777], [0.42, 0.46, 0.50, 0.48, 0.44]);
  const tintA = light(ip(g, [0, 427, 847, 1327, 1777], [0, 0.18, 0.42, 0.72, 1]), "bone", "sky");
  const tintB = light(ip(g, [0, 847, 1180, 1500, 1777], [0, 0.12, 0.34, 0.72, 1]), "paper", "amber");

  // ══ FRONTERA 3 — ZOOM-THROUGH sobre el renglon del cargo fijo (punto 34/64 de pantalla) ════
  const zt = zoomThrough(g, 1292, 40, 34, 64);
  const zoomEnvuelve: React.CSSProperties = {
    transformStyle: "preserve-3d",
    transform: zt.out,
    opacity: zt.opacity,
  };

  // ══ ACTO 1 · EL PANEL DE 49 DOLARES ════════════════════════════════════════════════════════
  const kP = [0, 90, 220, 340, 400, 427, 468, 512];
  const wP = ip(g, kP, [1180, 1146, 1052, 986, 946, 906, 700, 520]);
  const hP = ip(g, kP, [664, 646, 596, 560, 540, 520, 414, 316]);
  const xP = ip(g, kP, [50, 50, 49.4, 48.6, 47.6, 44, 12, -26]);
  const yP = ip(g, kP, [46, 46, 46.4, 47, 47.4, 47.6, 46, 44]);
  const zP = ip(g, kP, [10, 14, 22, 28, 30, 22, -70, -180]);
  const ryP = ip(g, kP, [2.6, 2.0, 1.2, 0.4, -0.4, -2.6, -13, -22]);
  const litP = ip(g, kP, [0.92, 1, 1, 1, 1, 0.94, 0.66, 0.44]);
  const kbP = Math.max(1.05, ip(g, [0, 220, 427, 512], [1340, 1190, 1080, 900]) / Math.max(40, wP));
  // dos ventanas de clip, cada una adentro de un bloque de 153 (el loop no corta a la vista)
  const vidP = Math.max(
    ip(g, [4, 16, 138, 150], [0, 1, 1, 0]),
    ip(g, [2 * B + 4, 2 * B + 18, 414, 424], [0, 1, 1, 0]),
  );

  // ══ ACTO 2 · EL MOTOR DE IMANES ════════════════════════════════════════════════════════════
  const kM = [420, 470, 560, 700, 800, 840, 872, 906];
  const wM = ip(g, kM, [980, 1020, 1000, 980, 960, 940, 700, 480]);
  const hM = ip(g, kM, [560, 584, 572, 560, 548, 536, 400, 274]);
  const xM = ip(g, kM, [86, 52, 50.6, 50, 49, 44, 6, -34]);
  const yM = ip(g, kM, [44, 44.4, 45, 45.4, 45.8, 46, 44, 41]);
  const zM = ip(g, kM, [-40, 10, 18, 24, 26, 20, -110, -230]);
  const ryM = ip(g, kM, [-14, -3.2, -2.0, -1.0, 0.2, 2.0, 16, 28]);
  const litM = ip(g, kM, [0.7, 1, 1, 1, 1, 0.94, 0.62, 0.40]);
  const kbM = Math.max(1.05, ip(g, [420, 700, 906], [1250, 1120, 980]) / Math.max(40, wM));
  // la tachadura volt: EL UNICO momento con energia de todo el movimiento
  const tach = ipe(g, [640, 682], [0, 1], Easing.out(Easing.cubic));
  const tachOn = ip(g, [636, 648, 826, 852], [0, 1, 1, 0]);

  // ══ ACTO 3 · LA FACTURA Y EL CARGO FIJO ════════════════════════════════════════════════════
  // LA HOJA SUBE Y PASA POR DEBAJO DEL LENTE: entre g862 y g910 el papel cubre el cuadro entero
  // (es el gesto real de levantar una factura hacia la cara). Ahi adentro cambia el mundo de fondo:
  // el cambio ocurre TAPADO POR MATERIAL REAL, no por un corte a la vista ni por un fundido.
  const kF = [796, 830, 866, 896, 936, 1010, 1150, 1290, 1327];
  const wF = ip(g, kF, [1180, 1560, 2400, 2300, 1520, 1200, 1160, 1128, 1116]);
  const hF = ip(g, kF, [712, 940, 1460, 1400, 920, 728, 700, 682, 672]);
  const xF = ip(g, kF, [46, 46, 46, 45.8, 45.4, 45, 44.6, 44.1, 44]);
  const yF = ipe(g, kF, [150, 106, 56, 50, 49, 50, 50.6, 51.4, 52], Easing.out(Easing.cubic));
  const zF = ip(g, kF, [-40, -10, 40, 46, 30, 26, 26, 22, 20]);
  const rxF = ip(g, kF, [18, 12, 4, 1.2, 0.6, 0.2, -0.4, -0.9, -1.1]);
  const ryF = ip(g, kF, [-5, -4, -2.6, -1.8, -1.2, -0.9, -0.6, -0.2, 0]);
  const litF = ip(g, kF, [0.42, 0.70, 0.95, 1, 1, 1, 1, 1, 1]);
  const kbF = Math.max(1.05, ip(g, [796, 866, 936, 1150, 1327], [1420, 2560, 1660, 1280, 1230]) / Math.max(40, wF));
  const renOn = ip(g, [996, 1036], [0, 1]);
  const renW = ipe(g, [996, 1048, 1268, 1330], [0, 30, 30, 46], Easing.out(Easing.cubic));
  const renBrillo = ip(g, [1036, 1090, 1250, 1300, 1330], [0.24, 0.42, 0.5, 1, 1]);
  const renAlto = ip(g, [996, 1048, 1268, 1330], [4, 22, 24, 40]);

  // ══ ACTO 4 · LA DUCHA CALIENTE ═════════════════════════════════════════════════════════════
  const kD = [1250, 1330, 1420, 1560, 1700, 1777];
  const wD = ip(g, kD, [1080, 1140, 1180, 1160, 1120, 1080]);
  const hD = ip(g, kD, [640, 676, 700, 688, 664, 640]);
  const xD = ip(g, kD, [50, 49, 47.5, 45.5, 42.5, 40]);
  const yD = ip(g, kD, [50, 50, 50.4, 51, 51.6, 52]);
  const zD = ip(g, kD, [0, 14, 24, 26, 22, 16]);
  const ryD = ip(g, kD, [3, 2, 0.6, -1.4, -4.6, -7]);
  const litD = ip(g, kD, [0.5, 0.9, 1, 1, 0.98, 0.94]);
  const kbD = Math.max(1.05, ip(g, [1250, 1420, 1777], [1330, 1270, 1210]) / Math.max(40, wD));
  const vidD = Math.max(
    ip(g, [8 * B + 4, 8 * B + 18, 9 * B - 10, 9 * B - 2], [0, 1, 1, 0]),
    Math.max(
      ip(g, [9 * B + 4, 9 * B + 18, 10 * B - 10, 10 * B - 2], [0, 1, 1, 0]),
      ip(g, [10 * B + 4, 10 * B + 18, 11 * B - 10, 11 * B - 2], [0, 1, 1, 0]),
    ),
  );
  // la BANDA DE VAPOR: lo que era el renglon del cargo fijo, del otro lado del zoom
  const bandaOn = ip(g, [1300, 1338, 1520, 1620], [0, 1, 0.7, 0.22]);
  const bandaAlto = ipe(g, [1300, 1420, 1620], [26, 190, 420], Easing.out(Easing.cubic));
  const vaporF = ip(g, [1330, 1450, 1580, 1777], [0.16, 0.42, 0.72, 1]);

  // ══ EL ARO — el objeto que cruza dos fronteras y se transforma ═════════════════════════════
  const kA = [176, 240, 400, 427, 466, 540, 800, 847, 900, 972, 1327];
  const aroX = ip(g, kA, [50, 50, 49.2, 54, 60, 51, 50.4, 49.6, 63, 71.5, 71.5]);
  const aroY = ip(g, kA, [46.5, 46.5, 47, 46, 44.6, 45.2, 45.6, 45.8, 33, 26.5, 26.5]);
  const aroW = ip(g, kA, [690, 686, 640, 540, 396, 372, 366, 344, 226, 152, 152]);
  const aroH = ip(g, kA, [392, 390, 366, 372, 388, 372, 366, 344, 226, 152, 152]);
  const aroRad = ip(g, kA, [2.4, 2.4, 3, 16, 40, 50, 50, 50, 50, 50, 50]);
  const aroRot = ip(g, kA, [1.2, 1.0, 0.4, -3, -8, -3, -1, 0, 7, 13, 13]);
  const aroGro = ip(g, kA, [3, 3, 3, 3.6, 4.4, 4.6, 4.6, 4.4, 3.6, 3, 3]);
  const aroOn = ip(g, [168, 206], [0, 1]);
  const aroGlow = ip(g, [176, 427, 620, 700, 847, 972, 1327], [0.18, 0.3, 0.34, 0.7, 0.5, 0.42, 0.42]);
  const aroCol = g < 470 ? V.steel : g < 900 ? V.volt : V.amber;
  const selloOn = ip(g, [944, 1000], [0, 0.92]);

  // ══ FONDOS PROFUNDOS — cambian DURO adentro de cada costura, nunca con un fundido ══════════
  // fase 0→1 tapado por la OCLUSION de chapa (g427) · fase 1→2 tapado por la hoja que pasa bajo el
  // lente (g880) · fase 2→3 tapado por el ZOOM-THROUGH ya a escala 5× (g1316). Ningun corte a la vista.
  const faseFondo = g < A2 ? 0 : g < 880 ? 1 : g < 1316 ? 2 : 3;

  // ══ TEXTOS — UNA idea por acto, cada una viva bastante mas de 2,0 s + 0,28 s/palabra ═══════
  const t1 = ip(g, [44, 74, 300, 330], [0, 1, 1, 0]);
  const t2 = ip(g, [470, 502, 790, 822], [0, 1, 1, 0]);
  const t3 = ip(g, [914, 946, 1250, 1284], [0, 1, 1, 0]);
  const t4 = ip(g, [1396, 1430, 1730, 1760], [0, 1, 1, 0]);
  // el contador de los CUATRO ESCUDOS: vive el movimiento entero, una pastilla por acto
  const pill = [
    ip(g, [150, 200], [0.14, 1]),
    ip(g, [648, 694], [0.14, 1]),
    ip(g, [1036, 1082], [0.14, 1]),
    ip(g, [1440, 1486], [0.14, 1]),
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMOSFERA: se monta UNA vez y no se remonta nunca; solo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio bajo UNA sola camara ══════════════ */}
      <Layers cam={camT}>

        {/* ── ACTO 4 · EL BANO: se monta ANTES de la frontera para que el zoom SALGA en el ─── */}
        {g >= 1244 && (
          <>
            <PhotoPlane src="img/cmeurgente/cmeu_ducha_vapor.jpg" kind="photo" z={-620}
              scale={ip(g, [1244, 1777], [1.30, 1.18])}
              dim={ip(g, [1244, 1400, 1777], [0.64, 0.44, 0.36])} tint={V.sky} />

            {/* LA BANDA DE VAPOR — lo que era el renglon del cargo fijo, ya del otro lado */}
            <Plane z={-40}>
              <div style={{
                position: "absolute", left: "-14%", right: "-14%", top: "64%",
                height: bandaAlto, marginTop: -bandaAlto / 2, opacity: clamp01(bandaOn),
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${rgba(V.paper, 0.13)} 34%, ` +
                  `${rgba(V.bone, 0.16)} 52%, ${rgba(V.paper, 0.09)} 72%, rgba(0,0,0,0) 100%)`,
                transform: `rotate(${ip(g, [1300, 1620], [0, -2.6]).toFixed(2)}deg)`,
              }} />
            </Plane>

            {/* la ducha, en su Ventana, con el clip corriendo adentro */}
            <Plane z={0}>
              <Ventana x={xD} y={yD} w={wD} h={hD} z={zD} ry={ryD} rx={ip(g, [1250, 1777], [1, -1.4])}
                radius={14} lit={litD} litColor={V.bone}>
                <Mat photo="img/cmeurgente/cmeu_ducha_vapor.jpg" clip="broll/cmeurgente/cmeu_ducha_vapor_mov.mp4"
                  vid={vidD} w={wD} h={hD} k={kbD}
                  cx={50 + Math.sin(g / 250) * 3.0} cy={50 + Math.cos(g / 290) * 2.2}
                  lit={litD} litColor={V.bone} sheenAt={L(1392)} />
              </Ventana>
            </Plane>

            {/* la segunda lectura del mismo material: MACRO del vapor, otra escala y otra luz */}
            {g >= 1462 && g < 1748 && (
              <Plane z={40}>
                <MediaCard src="img/cmeurgente/cmeu_ducha_vapor.jpg" kind="photo"
                  w={ip(g, [1462, 1520, 1748], [300, 384, 372])}
                  h={ip(g, [1462, 1520, 1748], [200, 256, 248])}
                  x={ip(g, [1462, 1748], [82, 76])} y={ip(g, [1462, 1748], [70, 66])}
                  z={ip(g, [1462, 1748], [60, 96])} ry={ip(g, [1462, 1748], [-13, -19])} rx={7}
                  lit={0.9} litColor={V.amber} label="TODO IGUAL" sheenAt={L(1520)}
                  opacity={ip(g, [1462, 1494, 1720, 1746], [0, 1, 1, 0])} />
              </Plane>
            )}

            {/* objetos de escena: el aire prendido y la luz prendida (cero velas) */}
            {g >= 1444 && g < 1690 && (
              <Plane z={90}>
                <IconPng src="img/cmeurgente/cmeu_ic_termometro.png" x={18} y={31}
                  size={ip(g, [1444, 1490], [76, 122])} z={0}
                  opacity={ip(g, [1444, 1486, 1650, 1688], [0, 0.95, 0.95, 0])}
                  rot={ip(g, [1444, 1688], [-8, 3])} glow={V.ink0} />
                <IconPng src="img/cmeurgente/cmeu_ic_bombillanoche.png" x={26} y={78}
                  size={ip(g, [1490, 1534], [70, 108])} z={0}
                  opacity={ip(g, [1490, 1530, 1650, 1688], [0, 0.9, 0.9, 0])}
                  rot={ip(g, [1490, 1688], [7, -4])} glow={V.ink0} />
              </Plane>
            )}

            {/* EL VAPOR que tapa el ultimo tercio mientras la camara rota a la derecha */}
            <Plane z={230}>
              <Vapor g={g} desde={1300} fuerza={vaporF * 0.9} sesgo={74} />
            </Plane>
            <Plane z={120}>
              <Vapor g={g} desde={1340} fuerza={vaporF * 0.62} sesgo={40} />
            </Plane>
          </>
        )}

        {/* ══════ ACTOS 1-3 — TODO adentro del contenedor que ATRAVIESA el zoom-through ══════ */}
        {g < 1338 && (
          <AbsoluteFill style={zoomEnvuelve}>

            {/* PLANO FONDO · el mundo lejano; cambia DURO adentro de cada costura -------- */}
            {faseFondo === 0 && (
              <PhotoPlane src="img/cmeurgente/cmeu_panel49.jpg" kind="photo" z={-660}
                scale={ip(g, [0, 427], [1.32, 1.22])}
                dim={ip(g, [0, 200, 427], [0.60, 0.66, 0.70])} tint={V.sky} />
            )}
            {faseFondo === 1 && (
              <PhotoPlane src="img/cmeurgente/cmeu_motor_imanes.jpg" kind="photo" z={-670}
                scale={ip(g, [427, 880], [1.34, 1.22])}
                dim={ip(g, [427, 660, 880], [0.72, 0.66, 0.74])} tint={V.volt} />
            )}
            {faseFondo === 2 && (
              <PhotoPlane src="img/cmeurgente/cmeu_factura.jpg" kind="photo" z={-680}
                scale={ip(g, [880, 1327], [1.36, 1.24])}
                dim={ip(g, [880, 1120, 1327], [0.74, 0.70, 0.68])} tint={V.paper} />
            )}

            {/* PLANO -430 · el aire: rejilla de profundidad, muy tenue (esto es SOBRIO) --- */}
            <Plane z={-430}>
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.4).toFixed(2)}px)` }}>
                <AbsoluteFill style={{
                  opacity: ip(g, [120, 300, 900, 1200], [0, 0.19, 0.19, 0.05]),
                  backgroundImage:
                    `repeating-linear-gradient(90deg, ${rgba(V.white, 0.07)} 0 1px, rgba(0,0,0,0) 1px 118px),` +
                    `repeating-linear-gradient(0deg, ${rgba(V.white, 0.05)} 0 1px, rgba(0,0,0,0) 1px 118px)`,
                }} />
              </div>
            </Plane>

            {/* PLANO -330 · EL TEJADO del folleto: lo que TODAVIA no hay que comprar ------ */}
            {g < 470 && (
              <RoofPlane y={ip(g, [0, 427], [88, 84])} w={1520} h={330} rx={60}
                lit={ip(g, [0, 90, 427], [0.30, 0.54, 0.48])} z={-330}
                panels={ip(g, [0, 427], [0.92, 0.78])} />
            )}

            {/* PLANO -150 · LA MESA DEL TALLER (acto 2): sube por geometria con la camara -- */}
            {g >= 418 && g < 912 && (
              <PadPlane y={ip(g, [418, 560, 906], [96, 86, 83])} w={1580} h={352} rx={62}
                lit={ip(g, [418, 500, 906], [0, 0.82, 0.9])} z={-150} />
            )}

            {/* ── ACTO 1 · EL PANEL DE 49 DOLARES (foto + clip real adentro del vidrio) ─── */}
            {g < 520 && (
              <Plane z={0}>
                <Ventana x={xP} y={yP} w={wP} h={hP} z={zP} ry={ryP} rx={ip(g, [0, 427], [0.4, -1.2])}
                  radius={14} lit={litP} litColor={V.bone}>
                  <Mat photo="img/cmeurgente/cmeu_panel49.jpg" clip="broll/cmeurgente/cmeu_panel49_mov.mp4"
                    vid={vidP} w={wP} h={hP} k={kbP}
                    cx={50 + Math.sin(g / 268) * 3.2} cy={50 + Math.cos(g / 314) * 2.4}
                    lit={litP} litColor={V.bone} sheenAt={L(46)} />
                </Ventana>
              </Plane>
            )}

            {/* la pinza midiendo el panel: objeto de escena, con su parallax propio */}
            {g >= 140 && g < 412 && (
              <Plane z={70}>
                <IconPng src="img/cmeurgente/cmeu_ic_pinza.png" x={20} y={70}
                  size={ip(g, [140, 192], [86, 138])} z={0}
                  opacity={ip(g, [140, 188, 376, 410], [0, 0.95, 0.95, 0])}
                  rot={ip(g, [140, 410], [-9, 4])} glow={V.ink0} />
              </Plane>
            )}
            {g >= 176 && g < 400 && (
              <Rotulo x={20} y={80} on={ip(g, [176, 214, 366, 398], [0, 1, 1, 0])} tint={V.volt}>
                Medido por mí
              </Rotulo>
            )}

            {/* ── ACTO 2 · EL MOTOR DE IMANES ───────────────────────────────────────────── */}
            {g >= 418 && g < 912 && (
              <Plane z={0}>
                <Ventana x={xM} y={yM} w={wM} h={hM} z={zM} ry={ryM} rx={ip(g, [418, 906], [1.6, -1])}
                  radius={12} lit={litM} litColor={V.volt}>
                  <Mat photo="img/cmeurgente/cmeu_motor_imanes.jpg" w={wM} h={hM} k={kbM}
                    cx={50 + Math.sin(g / 236) * 3.4} cy={50 + Math.cos(g / 282) * 2.6}
                    lit={litM} litColor={V.volt} sheenAt={L(474)} />

                  {/* LA TACHADURA: el unico golpe de energia del movimiento */}
                  {tachOn > 0.01 && (
                    <div style={{
                      position: "absolute", left: "6%", right: "6%", top: "50%", height: 9,
                      marginTop: -4.5, opacity: tachOn,
                      transform: `rotate(-13deg) scaleX(${tach.toFixed(3)})`, transformOrigin: "0% 50%",
                      background: `linear-gradient(90deg, ${rgba(V.volt, 0.35)}, ${rgba(V.volt, 0.95)} 40%, ${rgba(V.volt, 0.75)})`,
                      boxShadow: `0 0 26px ${rgba(V.volt, 0.55)}`,
                      borderRadius: 5,
                    }} />
                  )}
                </Ventana>
              </Plane>
            )}

            {/* MACRO de los imanes: el mismo material, otra escala y otra luz (variedad real) */}
            {g >= 496 && g < 812 && (
              <Plane z={50}>
                <MediaCard src="img/cmeurgente/cmeu_motor_imanes.jpg" kind="photo"
                  w={ip(g, [496, 552, 812], [286, 356, 344])}
                  h={ip(g, [496, 552, 812], [196, 244, 236])}
                  x={ip(g, [496, 812], [16, 20])} y={ip(g, [496, 812], [72, 68])}
                  z={ip(g, [496, 812], [50, 86])} ry={ip(g, [496, 812], [13, 18])} rx={6}
                  lit={0.88} litColor={V.volt} label="IMANES" sheenAt={L(556)}
                  opacity={ip(g, [496, 528, 784, 810], [0, 1, 1, 0])} />
              </Plane>
            )}

            {/* el simbolo de prohibido, como objeto de la escena (no como sticker de borde) */}
            {g >= 644 && g < 840 && (
              <Plane z={110}>
                <IconPng src="img/cmeurgente/cmeu_ic_prohibido.png" x={49} y={45}
                  size={ipe(g, [644, 690], [110, 214], Easing.out(Easing.cubic))} z={0}
                  opacity={ip(g, [644, 686, 800, 838], [0, 0.88, 0.88, 0])}
                  rot={ip(g, [644, 838], [-6, 5])} glow={V.ink0} />
              </Plane>
            )}
            {g >= 466 && g < 640 && (
              <Plane z={80}>
                <IconPng src="img/cmeurgente/cmeu_ic_imanherradura.png" x={82} y={30}
                  size={ip(g, [466, 512], [78, 124])} z={0}
                  opacity={ip(g, [466, 508, 604, 638], [0, 0.92, 0.92, 0])}
                  rot={ip(g, [466, 638], [9, -5])} glow={V.ink0} />
              </Plane>
            )}

            {/* ── ACTO 3 · LA FACTURA: SUBE al cuadro desde abajo, por geometria pura ───── */}
            {g >= 790 && (
              <Plane z={0}>
                <Ventana x={xF} y={yF} w={wF} h={hF} z={zF} ry={ryF} rx={rxF}
                  radius={12} lit={litF} litColor={V.paper}>
                  <Mat photo="img/cmeurgente/cmeu_factura.jpg" w={wF} h={hF} k={kbF}
                    cx={50 + Math.sin(g / 254) * 2.6} cy={50 + Math.cos(g / 300) * 2.0}
                    lit={litF} litColor={V.paper} sheenAt={L(912)} />
                </Ventana>
              </Plane>
            )}

            {/* EL RENGLON DEL CARGO FIJO — el punto por el que entra la camara en g1292 */}
            {g >= 992 && (
              <Plane z={44}>
                <Renglon x={20} y={64} w={renW} alto={renAlto} on={renOn}
                  brillo={renBrillo} tint={V.amber} />
                {g < 1300 && (
                  <Rotulo x={34} y={57.4} on={ip(g, [1030, 1070, 1258, 1288], [0, 1, 1, 0])} tint={V.amber}>
                    Cargo fijo
                  </Rotulo>
                )}
              </Plane>
            )}

            {/* la segunda lectura de la factura: MACRO de las columnas, al otro lado y al fondo */}
            {g >= 1046 && g < 1290 && (
              <Plane z={96}>
                <MediaCard src="img/cmeurgente/cmeu_factura.jpg" kind="photo"
                  w={ip(g, [1046, 1100, 1290], [292, 364, 352])}
                  h={ip(g, [1046, 1100, 1290], [200, 250, 242])}
                  x={ip(g, [1046, 1290], [84, 80])} y={ip(g, [1046, 1290], [72, 68])}
                  z={ip(g, [1046, 1290], [0, 34])} ry={ip(g, [1046, 1290], [-15, -21])} rx={8}
                  lit={0.78} litColor={V.amber} label="LLEGA IGUAL" sheenAt={L(1104)}
                  opacity={ip(g, [1046, 1080, 1262, 1288], [0, 1, 1, 0])} />
              </Plane>
            )}

            {/* ══ EL ARO — rectangulo del panel → circulo del motor → sello de la factura ══ */}
            {g >= 166 && (
              <Plane z={ip(g, [166, 427, 847, 900, 1010, 1327], [46, 40, 92, 124, 84, 78])}>
                <Aro x={aroX} y={aroY} w={aroW} h={aroH} radius={aroRad} z={0}
                  color={aroCol} grosor={aroGro} on={aroOn} rot={aroRot} glow={aroGlow}>
                  {/* el cuño de la empresa, que nace ADENTRO del aro en la frontera 2 */}
                  {selloOn > 0.01 && (
                    <AbsoluteFill style={{ opacity: selloOn }}>
                      <IconPng src="img/cmeurgente/cmeu_ic_sello.png" x={50} y={26}
                        size={ip(g, [944, 1010], [64, 92])} z={0} opacity={1}
                        rot={ip(g, [944, 1290], [-10, 4])} glow={V.ink0} />
                    </AbsoluteFill>
                  )}
                </Aro>
              </Plane>
            )}

            {/* ALGO QUE PASA POR DELANTE — el canto cercano del material, desenfocado por escala */}
            <Plane z={252}>
              <div style={{
                position: "absolute", top: "-24%", height: "150%", width: "34%",
                left: `${ip(g, [58, 214], [-42, 122]).toFixed(1)}%`,
                opacity: ip(g, [58, 90, 180, 214], [0, 0.5, 0.5, 0]),
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.72)} 30%, ` +
                  `${rgba(V.steel, 0.12)} 52%, ${rgba(V.ink0, 0.62)} 74%, rgba(0,0,0,0) 100%)`,
                transform: "rotate(9deg)",
              }} />
              <div style={{
                position: "absolute", top: "-24%", height: "150%", width: "28%",
                left: `${ip(g, [908, 1010], [126, -38]).toFixed(1)}%`,
                opacity: ip(g, [908, 936, 984, 1010], [0, 0.46, 0.46, 0]),
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.ink0, 0.66)} 28%, ` +
                  `${rgba(V.paper, 0.13)} 50%, ${rgba(V.ink0, 0.58)} 76%, rgba(0,0,0,0) 100%)`,
                transform: "rotate(-7deg)",
              }} />
            </Plane>

            {/* LA FIRMA DEL VIDEO: las 24 horas, como textura de ambiente del primer escudo */}
            {g >= 56 && g < 420 && (
              <Plane z={-210}>
                <SunField sun={7 / 24} from={9} use={0.22} cells={24}
                  on={ip(g, [56, 118, 356, 414], [0, 0.5, 0.5, 0.1])} tint={V.volt} night={V.sky}
                  y={80} w={1180} h={32} cycle={230} />
              </Plane>
            )}
          </AbsoluteFill>
        )}
      </Layers>

      {/* ══════ COSTURA · FRONTERA 1 (g427) — OCLUSION con la CHAPA del marco de aluminio ═══ */}
      <SeamOcclude at={L(414)} dur={26} color={V.steel} angle={10} />

      {/* el unico golpe de energia: el volt de la tachadura (no es una frontera, es un acento) */}
      <SeamFlash at={L(652)} color={V.volt} dur={7} />

      {/* ══════ SALIDA · BARRIDO DE MATERIA — el vapor tapa el ultimo tercio ════════════════ */}
      <SeamWipeMatter at={L(1548)} dur={310} tint={V.paper} />

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═══════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* EL CONTADOR: los CUATRO ESCUDOS, una pastilla por acto. Vive el movimiento entero. */}
        <div style={{ position: "absolute", left: "88%", top: "9%", transform: "translate(-50%,-50%)" }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: 3.4,
            color: rgba(V.white, 0.82), textTransform: "uppercase", textAlign: "center",
            textShadow: "0 4px 18px rgba(0,0,0,0.92)",
          }}>Cuatro escudos</div>
          <div style={{ display: "flex", gap: 8, marginTop: 9, justifyContent: "center" }}>
            {pill.map((p, i) => (
              <div key={i} style={{
                width: 46, height: 7, borderRadius: 4,
                background: rgba(i === 3 ? V.amber : V.volt, 0.14 + 0.78 * p),
                boxShadow: p > 0.5 ? `0 0 14px ${rgba(i === 3 ? V.amber : V.volt, 0.5 * p)}` : "none",
              }} />
            ))}
          </div>
        </div>

        {/* el tilde del ultimo escudo, como objeto y no como decoracion pegada */}
        {g >= 1470 && g < 1740 && (
          <IconPng src="img/cmeurgente/cmeu_ic_check.png" x={88}
            y={ip(g, [1470, 1520], [17.5, 16.2])}
            size={ip(g, [1470, 1520], [42, 68])} z={0}
            opacity={ip(g, [1470, 1512, 1700, 1738], [0, 0.95, 0.95, 0])}
            rot={ip(g, [1470, 1738], [-8, 4])} glow={V.ink0} />
        )}

        {/* LA CIFRA DEL PANEL BARATO: 49 dolares (con cama radial sobre el material) */}
        {g >= 186 && g < 412 && (
          <div style={{ opacity: ip(g, [186, 200, 384, 410], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "76%", top: "26%",
              width: 470, height: 300, marginLeft: -235, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value="$49" label={g < 380 ? "ME COSTÓ ESTE" : undefined}
              at={L(190)} x={76} y={26} size={112} color={V.amber} align="center" />
          </div>
        )}

        {/* EL CERO DEL MOTOR DE IMANES: lo que de verdad produce, tachado */}
        {g >= 684 && g < 842 && (
          <div style={{
            position: "absolute", left: "74%", top: "72%", transform: "translate(-50%,-50%)",
            opacity: ip(g, [684, 712, 812, 840], [0, 1, 1, 0]), textAlign: "center",
          }}>
            <div style={{ position: "relative", display: "inline-block", padding: "0 12px" }}>
              <Num size={58} color={rgba(V.white, 0.52)}>0 W</Num>
              <div style={{
                position: "absolute", left: 0, right: 0, top: "52%", height: 5,
                background: rgba(V.volt, 0.88), transformOrigin: "0% 50%",
                transform: `scaleX(${ip(g, [706, 742], [0, 1]).toFixed(3)})`,
                boxShadow: `0 0 16px ${rgba(V.volt, 0.5)}`,
              }} />
            </div>
            <div style={{
              fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2,
              color: rgba(V.white, 0.58), marginTop: 5, textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>ES LO QUE PRODUCE</div>
          </div>
        )}

        {/* LA CIFRA DEL CARGO FIJO: 14 dolares que llegan igual */}
        {g >= 1032 && g < 1298 && (
          <div style={{ opacity: ip(g, [1032, 1050, 1270, 1296], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "73%", top: "33%",
              width: 500, height: 320, marginLeft: -250, marginTop: -160,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value="$14" label={g < 1262 ? "TODOS LOS MESES" : undefined}
              at={L(1036)} x={73} y={33} size={122} color={V.amber} align="center" />
          </div>
        )}

        {/* ACTO 1 · PRIMER ESCUDO — YO TENGO PANELES */}
        {t1 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "72%", opacity: t1,
            transform: `translateY(${((1 - t1) * 20).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Primer escudo</Kick>
              <div style={{ height: 7 }} />
              <Head size={68}>YO TENGO PANELES</Head>
              <div style={{ height: 9 }} />
              <Body size={31}>No estoy en contra. Estoy en contra de <Em>comprarlos mal</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · SEGUNDO ESCUDO — ESTO NO ES ENERGIA GRATIS */}
        {t2 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "8%", opacity: t2,
            transform: `translateY(${((1 - t2) * -20).toFixed(1)}px)`,
          }}>
            <Bed w={730} pad={24}>
              <Kick color={V.volt}>Segundo escudo</Kick>
              <div style={{ height: 7 }} />
              <Head size={64}>ESTO NO ES <Em>ENERGÍA GRATIS</Em></Head>
              <div style={{ height: 9 }} />
              <Body size={31}>El sol es gratis. El equipo que lo baja, no.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · TERCER ESCUDO — CATORCE DOLARES IGUAL */}
        {t3 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "73%", opacity: t3,
            transform: `translateY(${((1 - t3) * 20).toFixed(1)}px)`,
          }}>
            <Bed w={740} pad={24}>
              <Kick color={V.amber}>Tercer escudo</Kick>
              <div style={{ height: 7 }} />
              <Head size={66}>CATORCE DÓLARES <Em color={V.amber}>IGUAL</Em></Head>
              <div style={{ height: 9 }} />
              <Body size={31}>Esto no te desconecta de la red. El cargo fijo llega.</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · CUARTO ESCUDO — NO ES VIVIR PEOR */}
        {t4 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "23%", opacity: t4,
            transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)`,
          }}>
            <Bed w={720} pad={26}>
              <Kick color={V.amber}>Cuarto escudo</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>NO ES <Em color={V.amber}>VIVIR PEOR</Em></Head>
              <div style={{ height: 9 }} />
              <Body size={31}>Ducha caliente, aire prendido, cero velas.</Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: se abre en el tramo de la confianza y se cierra un poco al entrar la cocina */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(130% 110% at 50% 46%, rgba(0,0,0,0) 54%, rgba(6,7,5,${ip(g, [0, 847, 1777], [0.24, 0.28, 0.36]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
