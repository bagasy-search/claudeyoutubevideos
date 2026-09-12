// MovLadronesA.tsx — S6 · UN MOVIMIENTO CONTINUO de 62 s (1860 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 660,0.
//
// LA ESPINA: arranca la medición de los treinta días y aparecen los dos primeros ladrones. El aire,
// que todos sospechan. Y el calentador de agua, que no sospecha nadie. El movimiento entero es UN
// DESCENSO: de la luz ámbar de la cocina al haz de una linterna dentro de un armario cerrado, donde
// a las tres de la mañana una resistencia se enciende sola sin que nadie haya abierto una llave.
//
// ⛔ ESTE MOVIMIENTO TAPA LA COSTURA DEL BUCLE DEL AVATAR (712,54 s = g1575). Desde g1108 (detrás del
//    occluder de la reja) y hasta el final se monta la CAPA ARMARIO: una imagen a sangre, opaca, con
//    escala ≥1,16 (jamás asoman los bordes) y sin un solo frame de opacidad menor a 1. Entre g1380 y
//    g1770 no hay ninguna transparencia, ningún margen y ningún hueco por donde se vea lo de abajo.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el exitTo del acto N                 ║
// ╠════╦═══════════════════════════════════════╦═══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto        ║ SALE: encuadre + luz + objeto                 ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: frontal y estable, z≈-120, ry 0, ║ CÁM: z≈-121 empujando adelante-izquierda, ya   ║
// ║ g0 ║ heredada de MovEscalonTarifa.         ║      bajando (drop -6). No frena: atraviesa.   ║
// ║    ║ LUZ: ÁMBAR BAJO de cocina (keyFrom    ║ LUZ: keyFrom 0.68→0.64, int 0.62→0.78; el volt ║
// ║    ║ 0.68, int 0.62), el volt apagado.     ║      del display ya empuja desde abajo.        ║
// ║    ║ MAT: EL MEDIDOR DE ENCHUFE blanco     ║ MAT: LA VENTANA DEL DISPLAY del medidor (318×  ║
// ║    ║ entrando en el tomacorriente.         ║      162) empieza a ABRIRSE, y su cápsula de   ║
// ║    ║                                       ║      cifra se encoge y viaja hacia arriba.     ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: misma inercia, deriva a la       ║ CÁM: z≈-160 saliendo hacia la izquierda con    ║
// ║g360║ izquierda ya empezada.                ║      vector constante (-76% cada 100 frames).  ║
// ║    ║ LUZ: ámbar de cocina pleno, keyFrom   ║ LUZ: keyFrom 0.64→0.44, tintA ámbar→sky: entra ║
// ║    ║ 0.64, tintA ámbar con sky subiendo.   ║      el día por la ventana de la cocina.       ║
// ║    ║ MAT: la Ventana del display, ABIERTA  ║ MAT: la hoja y su imán SALEN de cuadro con el   ║
// ║    ║ hasta ser LA HOJA DE LA HELADERA; la  ║      mismo vector con el que ENTRA la unidad    ║
// ║    ║ cápsula ya es el IMÁN que la sujeta.  ║      exterior del aire: nadie corta.           ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z≈-160 viajando a la izquierda,  ║ CÁM: z≈-230 frenando y empezando a BAJAR       ║
// ║g720║ misma velocidad, ya afuera.           ║      (drop -10→-26, tilt -1.4).                ║
// ║    ║ LUZ: DÍA (keyFrom 0.44→0.30, int 1.06)║ LUZ: keyFrom 0.30→0.34, int 1.06→0.98; el sky  ║
// ║    ║ el sol pega de frente sobre la chapa. ║      empieza a virar a torch.                  ║
// ║    ║ MAT: LA UNIDAD EXTERIOR DEL AIRE con  ║ MAT: EL ARO DE LA REJA del ventilador, que NO  ║
// ║    ║ el ventilador girando.                ║      se apaga: cruza la oclusión de chapa.     ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: z≈-230 bajando, misma curva.     ║ CÁM: z≈-280, cayendo por el tanque (drop -74,  ║
// ║g1110║ LUZ: LINTERNA (keyFrom 0.34→0.46,    ║      tilt -3.6). La caída no se reinicia.      ║
// ║    ║ int 0.98→0.72, floor 0.62→0.78):     ║ LUZ: linterna plena, negro alrededor.          ║
// ║    ║ negro alrededor, sólo el haz.        ║ MAT: la COSTURA DE CHAPA del tanque, una línea ║
// ║    ║ MAT: el aro de la reja ATERRIZA como ║      de luz horizontal que baja con la cámara   ║
// ║    ║ CHARCO DE LINTERNA sobre el tanque.  ║      y se está volviendo la resistencia.       ║
// ╠════╬═══════════════════════════════════════╬═══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: cayendo por el tanque, misma    ║ CÁM: z≈-300, panY -12, cerrada DENTRO del      ║
// ║g1500║ curva (no se reinicia).             ║      armario. Es el encuadre de MovLadronesB.  ║
// ║    ║ LUZ: linterna puntual, int 0.60.     ║ LUZ: LINTERNA EN EL ARMARIO: V.torch puntual,  ║
// ║    ║ MAT: la costura de chapa, ya casi    ║      negro alrededor (int 0.46, floor 0.86).   ║
// ║    ║ espiral, en la banda baja del tanque.║ MAT: LA CHAPA DEL TANQUE, con la resistencia   ║
// ║    ║                                      ║      encendida sola adentro. Nadie abrió nada. ║
// ╚════╩═══════════════════════════════════════╩═══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fade, ninguna baja opacidad a 0:
//   g360  1→2  MATCH-SHAPE      — LA VENTANA DEL DISPLAY del medidor (318×162, con un macro del
//                                 papel rayado ya corriendo adentro) se ABRE a 1180×690 sin
//                                 re-encuadrar el material: el display SE VUELVE la hoja. A la vez
//                                 su cápsula de cifra se encoge, sube y aterriza como EL IMÁN que
//                                 sujeta la hoja. Una sola forma entrega, otra recibe: cero negro.
//   g720  2→3  MATCH-MOVE       — la cámara sigue su vector a la izquierda y el mundo cambia
//                                 debajo. La hoja + el imán salen a -76% cada 100 frames y la
//                                 unidad exterior del aire entra con EXACTAMENTE ese vector. Nada
//                                 aparece ni desaparece: todo entra y sale por geometría.
//   g1110 3→4  OCLUSIÓN V.steel — <SeamOcclude color={V.steel} lit 0.30> + mi reja giratoria: la
//                                 chapa del ventilador barre el cuadro y detrás YA está el armario
//                                 a oscuras. El ARO de la reja cruza la oclusión y sale del otro
//                                 lado convertido en el charco de la linterna sobre el tanque.
//   g1500 4→5  MATCH-MOVE       — la cámara no corta: acelera su caída (camDrop -26→-74, camTilt
//                                 -1.4→-3.6) mientras el recorte del tanque baja (cy 55→74) y la
//                                 tarjeta sube. La costura de chapa cruza la frontera EN VIAJE y
//                                 del otro lado ya es el espiral de la resistencia.
//
// EL OBJETO QUE CRUZA CADA FRONTERA Y EN QUÉ SE TRANSFORMA:
//   1→2  la ventana del display  → la hoja de la heladera (y su cápsula → el imán)
//   2→3  el imán + la hoja       → salen con el vector con el que entra el aire (relevo de vector)
//   3→4  el aro de la reja       → el charco de la linterna sobre el tanque
//   4→5  la costura de chapa     → el espiral de la resistencia encendiéndose sola
//
// ⛔ CONTRATO: sin llamadas aleatorias ni de reloj (todo sale de rnd(k) y de gFrame) · sin
// ⛔ backdrop-filter · sin position fixed · una sola capa con blur · rutas SOLO literales de la
// ⛔ ficha · imports sólo remotion/react/VoltStage · NINGUNA <Sequence> envolviendo un acto.
// ⚠️ El build monta el movimiento con UNA sola Sequence: useCurrentFrame() es LOCAL. Todo componente
//    del Stage que recibe `at`/`sheenAt` razona en frames locales → se traduce con L().
// ⚠️ Los clips duran 5,1 s (153 frames). Cada Ventana lleva SIEMPRE la foto de base (viva por crop
//    animado) y el clip sólo encima, en su ventana de arranque: el relevo no se ve.

import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, SunField,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1860;
const A2 = 360;
const A3 = 720;
const A4 = 1110;
const A5 = 1500;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── VENTANA: el marco de vidrio que RECORTA el material. Es la primitiva de este movimiento: la
//    misma Ventana que era el display del medidor se abre y se vuelve la hoja de la heladera.
//    Adentro va SIEMPRE material real (foto de base + clip encima en su ventana viva).
const Ventana: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(8, w);
  const hh = Math.max(8, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.28 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.78)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.62)}, inset 0 1px 0 ${rgba(V.white, 0.24 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL dentro de la Ventana: la FOTO siempre (con crop animado = nunca queda quieta) y el
//    CLIP encima mientras dura de verdad. `k` es el zoom de recorte (≥1: la foto siempre cubre).
const Mat: React.FC<{
  photo: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(10, w * kk);
  const ih = Math.max(10, h * kk);
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

// ── ROTULO de ficha (va DENTRO de la Ventana, no es un titular).
const Rotulo: React.FC<{ n: string; texto: string; on: number; tint?: string }> = ({ n, texto, on, tint = V.volt }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      padding: "24px 14px 10px", opacity: clamp01(on),
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
      display: "flex", alignItems: "baseline", gap: 11,
    }}>
      <span style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 30, color: tint, lineHeight: 1 }}>{n}</span>
      <span style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.6, color: V.white, textTransform: "uppercase" }}>{texto}</span>
    </div>
  );
};

// ── LA CÁPSULA QUE SE VUELVE IMÁN — el objeto que cruza la frontera 1.
//    Nace como la cápsula de cifra del display del medidor (rectángulo volt, 300×70) y termina
//    como el disco de acero que sujeta la hoja contra la puerta del refrigerador.
const CapsulaIman: React.FC<{ g: number }> = ({ g }) => {
  if (g < 300 || g > 812) return null;
  const w = ip(g, [300, 330, 362, 400, 440, 470, 700, 800], [300, 300, 222, 152, 112, 104, 104, 100]);
  const h = ip(g, [300, 330, 362, 400, 440, 470, 700, 800], [70, 70, 70, 88, 104, 104, 104, 100]);
  const rad = ip(g, [300, 362, 400, 440, 470], [9, 14, 34, 50, 52]);
  const x = ip(g, [300, 330, 362, 400, 440, 470, 700, 740, 800], [40, 40, 42, 46, 49, 50, 50, 34, -26]);
  const y = ip(g, [300, 330, 362, 400, 440, 470, 700, 740, 800], [56.4, 56.4, 52, 38, 23, 17, 17, 16.4, 15.6]);
  const z = ip(g, [300, 400, 470, 700, 800], [50, 62, 70, 68, 40]);
  const metal = light(ip(g, [330, 400, 470], [0, 0.6, 1]), "volt", "steel");
  const brillo = ip(g, [300, 362, 470], [0.9, 0.7, 0.5]);
  const icono = ip(g, [452, 486, 720, 792], [0, 1, 1, 0.5]);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotate(${ip(g, [300, 470], [0, -6]).toFixed(2)}deg)`,
      borderRadius: rad, overflow: "hidden",
      background: `linear-gradient(158deg, ${rgba(metal, 0.34 + 0.3 * brillo)} 0%, ${rgba(metal, 0.16)} 52%, ${rgba(V.ink1, 0.82)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.38 * brillo)}, inset 0 -2px 10px ${rgba(V.ink0, 0.7)}, ` +
        `0 ${Math.round(h * 0.22)}px ${Math.round(h * 0.4)}px ${rgba(V.ink0, 0.8)}, 0 0 ${Math.round(22 * brillo)}px ${rgba(metal, 0.34 * brillo)}`,
      border: `1px solid ${rgba(metal, 0.42)}`,
    }}>
      {/* el reflejo curvo del metal: el disco se lee como acero, no como una pastilla de código */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(64% 50% at 32% 22%, ${rgba(V.white, 0.3 * brillo)} 0%, rgba(0,0,0,0) 62%)`,
      }} />
      {icono > 0.01 && (
        <Img src={staticFile("img/cmeurgente/cmeu_ic_imanherradura.png")} style={{
          position: "absolute", left: "50%", top: "50%", width: Math.round(w * 0.72), height: "auto",
          transform: `translate(-50%,-50%) rotate(${ip(g, [452, 720], [-16, -4]).toFixed(1)}deg)`,
          opacity: icono,
          filter: `drop-shadow(0 6px 14px ${rgba(V.ink0, 0.85)})`,
        }} />
      )}
    </div>
  );
};

// ── LAS FILAS DE LA HOJA — el bolígrafo azul escribiendo la primera fila. Es un GRÁFICO sobre
//    material real (la hoja), no un objeto de mentira: subrayado que barre y tilde que cierra.
const FilasHoja: React.FC<{ g: number }> = ({ g }) => {
  if (g < 430 || g > 760) return null;
  const filas = [
    { y: 34, at: 452, w: 62 },
    { y: 46, at: 520, w: 54 },
    { y: 58, at: 586, w: 47 },
  ];
  return (
    <>
      {filas.map((fi, i) => {
        const p = clamp01((g - fi.at) / 34);
        const sale = ip(g, [712, 756], [1, 0.35]);
        if (p <= 0) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: "17%", top: `${fi.y}%`,
            width: `${fi.w * p}%`, height: 4, borderRadius: 3,
            background: `linear-gradient(90deg, ${rgba(V.volt, 0.14)} 0%, ${rgba(V.volt, 0.86 * sale)} 68%, ${rgba(V.volt, 0.3 * sale)} 100%)`,
            boxShadow: `0 0 ${Math.round(12 + 10 * p)}px ${rgba(V.volt, 0.4 * p * sale)}`,
          }} />
        );
      })}
    </>
  );
};

// ── LA REJA DEL VENTILADOR — la MATERIA de la costura 3. Barre el cuadro girando: es chapa gris
//    pegada al lente, así que llega en sombra (nunca un flash blanco).
const Reja: React.FC<{ g: number; at: number; dur: number }> = ({ g, at, dur }) => {
  const p = clamp01((g - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const cubre = 1 - Math.abs(p - 0.5) * 2;
  const env = cubre * cubre;
  const gir = lerp(-24, 138, p);
  const cx = lerp(-52, 152, p);
  const aros = [1, 0.82, 0.64, 0.46, 0.3, 0.16];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: `${cx.toFixed(1)}%`, top: "50%",
        width: 1500, height: 1500, marginLeft: -750, marginTop: -750,
        transform: `rotate(${gir.toFixed(1)}deg)`,
      }}>
        {/* los aros concéntricos de la reja */}
        {aros.map((r, i) => (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            width: 1500 * r, height: 1500 * r, marginLeft: -750 * r, marginTop: -750 * r,
            borderRadius: "50%",
            border: `${Math.round(9 + 7 * (1 - r))}px solid ${rgba(V.steel, (0.16 + 0.26 * env) * (0.5 + 0.5 * r))}`,
            boxShadow: `inset 0 0 40px ${rgba(V.ink0, 0.7 * env)}`,
          }} />
        ))}
        {/* las cuatro aspas */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            width: 700, height: 128, marginTop: -64,
            transformOrigin: "0% 50%",
            transform: `rotate(${i * 90 + gir * 2.2}deg)`,
            borderRadius: "0 90px 90px 0",
            background: `linear-gradient(90deg, ${rgba(V.steel, 0.34 * env)} 0%, ${rgba(V.steel, 0.14 * env)} 70%, rgba(0,0,0,0) 100%)`,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── EL ARO — el objeto que cruza la frontera 3 y se transforma. Nace como el aro de la reja del
//    ventilador (acero, borde duro, al sol) y sale del otro lado como EL CHARCO DE LA LINTERNA
//    sobre la chapa del tanque, bajando con la cámara hasta la resistencia.
const AroLuz: React.FC<{ g: number }> = ({ g }) => {
  if (g < 960) return null;
  const r = ip(g, [960, 1060, 1110, 1180, 1330, 1500, 1700, 1860], [186, 214, 250, 320, 342, 330, 300, 286]);
  const x = ip(g, [960, 1060, 1110, 1180, 1330, 1500, 1700, 1860], [48, 48, 47, 46, 45.5, 45, 44, 43.6]);
  const y = ip(g, [960, 1060, 1110, 1180, 1330, 1440, 1560, 1700, 1860], [44, 43, 41, 38, 40, 45, 52, 58, 60]);
  const tono = light(ip(g, [1060, 1120, 1190], [0, 0.6, 1]), "steel", "torch");
  const borde = ip(g, [960, 1060, 1120, 1200], [8, 7, 3, 0]);
  const relleno = ip(g, [1060, 1130, 1220, 1560, 1860], [0, 0.1, 0.22, 0.3, 0.34]);
  const vivo = 0.94 + Math.sin(g / 23) * 0.05 + Math.sin(g / 9.5) * 0.018;
  const on = ip(g, [960, 1000], [0, 1]);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r,
      borderRadius: "50%", opacity: on,
      border: borde > 0.4 ? `${borde.toFixed(1)}px solid ${rgba(tono, 0.4)}` : "none",
      background: `radial-gradient(circle, ${rgba(tono, relleno * vivo)} 0%, ${rgba(tono, relleno * 0.44 * vivo)} 44%, rgba(0,0,0,0) 72%)`,
      boxShadow: borde > 0.4 ? `inset 0 0 ${Math.round(38 * borde)}px ${rgba(V.ink0, 0.5)}` : "none",
    }} />
  );
};

// ── LA COSTURA DE CHAPA QUE SE VUELVE RESISTENCIA — el objeto que cruza la frontera 4.
//    Antes de g1500 es una línea de soldadura horizontal sobre el tanque, iluminada por la
//    linterna. Después es el espiral de la resistencia, que se calienta SOLA en la oscuridad.
const Resistencia: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1330) return null;
  const anillos = 13;
  const linea = ip(g, [1330, 1440, 1500, 1580], [1, 0.7, 0.28, 0]);      // cuánto queda de "soldadura"
  const espiral = ip(g, [1440, 1520, 1600], [0, 0.5, 1]);                 // cuánto ya es espiral
  const calor = ip(g, [1548, 1610, 1672, 1760, 1860], [0, 0.22, 0.66, 0.94, 1]);
  const flick = 0.9 + Math.sin(g / 6.3) * 0.06 + Math.sin(g / 17) * 0.045;
  const tono = light(clamp01(calor * 1.05), "copper", "torch");
  const x = ip(g, [1330, 1440, 1560, 1700, 1860], [45, 45, 44.4, 44, 43.6]);
  const y = ip(g, [1330, 1440, 1560, 1700, 1860], [40, 45, 52, 58, 60]);
  const wTotal = ip(g, [1330, 1440, 1560, 1860], [640, 560, 470, 448]);
  const paso = wTotal / (anillos + 2);
  const alto = ip(g, [1440, 1560, 1860], [26, 104, 116]) * espiral + 8;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: wTotal, height: Math.max(14, alto + 22),
      marginLeft: -wTotal / 2, marginTop: -(alto + 22) / 2,
      transform: `rotate(${ip(g, [1330, 1560, 1860], [0.6, -1.6, -2.2]).toFixed(2)}deg)`,
    }}>
      {/* el halo de calor que el metal tira alrededor */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: wTotal * 1.9, height: (alto + 40) * 3.2,
        marginLeft: -wTotal * 0.95, marginTop: -(alto + 40) * 1.6,
        background: `radial-gradient(closest-side, ${rgba(V.amber, 0.24 * calor * flick)} 0%, ${rgba(V.copper, 0.1 * calor)} 46%, rgba(0,0,0,0) 78%)`,
      }} />
      {/* lo que queda de la COSTURA de chapa: una soldadura recta que se va apagando */}
      {linea > 0.01 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "50%", height: 5, marginTop: -2.5,
          borderRadius: 4,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.steel, 0.72 * linea)} 22%, ${rgba(V.torch, 0.86 * linea)} 52%, ${rgba(V.steel, 0.6 * linea)} 78%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 0 ${Math.round(16 * linea)}px ${rgba(V.torch, 0.34 * linea)}`,
        }} />
      )}
      {/* el ESPIRAL: anillos de la resistencia, que nacen de la misma línea y se ponen al rojo */}
      {espiral > 0.01 && Array.from({ length: anillos }, (_, i) => {
        const fase = i / (anillos - 1);
        const cal = clamp01(calor * 1.25 - Math.abs(fase - 0.46) * 0.5);
        const aw = paso * 1.9;
        return (
          <div key={i} style={{
            position: "absolute",
            left: paso * (i + 1) - aw / 2, top: "50%",
            width: aw, height: alto, marginTop: -alto / 2,
            borderRadius: "50%",
            border: `${Math.round(3 + 2 * espiral)}px solid ${rgba(tono, (0.3 + 0.62 * cal) * espiral * flick)}`,
            boxShadow: cal > 0.04
              ? `0 0 ${Math.round(10 + 34 * cal)}px ${rgba(tono, 0.55 * cal * flick)}, inset 0 0 ${Math.round(8 + 20 * cal)}px ${rgba(V.amber, 0.4 * cal)}`
              : "none",
          }} />
        );
      })}
    </div>
  );
};

// ── EL MARCO DEL ARMARIO — dos jambas oscuras en primer plano. Cierran el cuadro (estamos DENTRO
//    de un armario estrecho) y de paso son materia opaca en el tramo de la costura del avatar.
const Jambas: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1098) return null;
  const ancho = ip(g, [1098, 1300, 1500, 1700, 1860], [120, 178, 236, 286, 306]);
  const on = ip(g, [1098, 1180], [0.6, 1]);
  return (
    <>
      {[0, 1].map((i) => (
        <div key={i} style={{
          position: "absolute", top: "-14%", height: "128%",
          left: i === 0 ? 0 : undefined, right: i === 1 ? 0 : undefined,
          width: ancho, opacity: on,
          background: i === 0
            ? `linear-gradient(90deg, ${rgba(V.ink0, 0.99)} 0%, ${rgba(V.ink1, 0.92)} 58%, rgba(10,11,8,0) 100%)`
            : `linear-gradient(270deg, ${rgba(V.ink0, 0.99)} 0%, ${rgba(V.ink1, 0.92)} 58%, rgba(10,11,8,0) 100%)`,
          boxShadow: `inset ${i === 0 ? "" : "-"}2px 0 0 ${rgba(V.steel, 0.1)}`,
        }} />
      ))}
    </>
  );
};

// ── EL CAÑO DE COBRE — lo que pasa POR DELANTE en el tramo del armario.
const CanoCobre: React.FC<{ g: number }> = ({ g }) => {
  if (g < 1150) return null;
  const x = ip(g, [1150, 1400, 1600, 1860], [-6, 14, 22, 26]);
  const rot = ip(g, [1150, 1860], [-72, -66]);
  const lum = ip(g, [1150, 1300, 1560, 1860], [0.2, 0.5, 0.42, 0.34]);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: "-24%", width: 92, height: "152%",
      transform: `rotate(${rot.toFixed(1)}deg)`, transformOrigin: "50% 40%",
      background: `linear-gradient(90deg, ${rgba(V.ink0, 0.96)} 0%, ${rgba(V.copper, 0.46 * lum)} 26%, ${rgba(V.torch, 0.5 * lum)} 42%, ${rgba(V.copper, 0.3 * lum)} 62%, ${rgba(V.ink0, 0.97)} 100%)`,
      borderRadius: 46,
      boxShadow: `0 26px 70px ${rgba(V.ink0, 0.9)}`,
    }} />
  );
};

// ── HOJAS SECAS que cruzan por delante en el patio (acto 3). Determinista: rnd(k), nunca azar.
const HojasSecas: React.FC<{ g: number }> = ({ g }) => {
  if (g < 740 || g > 1102) return null;
  const on = ip(g, [740, 790, 1046, 1098], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", opacity: on }}>
      {Array.from({ length: 16 }, (_, i) => {
        const o = rnd(i * 3.7);
        const vel = 0.5 + rnd(i * 8.1) * 1.1;
        const q = ((g - 740) * vel) / 380 + o;
        const xx = lerp(-14, 118, q - Math.floor(q));
        const yy = 8 + rnd(i * 5.3) * 84 + Math.sin((g / 26) + i) * 3.4;
        const sz = 16 + rnd(i * 2.2) * 26;
        return (
          <div key={i} style={{
            position: "absolute", left: `${xx.toFixed(2)}%`, top: `${yy.toFixed(2)}%`,
            width: sz * 1.7, height: sz, borderRadius: `${sz}px ${Math.round(sz * 0.3)}px`,
            background: `linear-gradient(120deg, ${rgba(V.roof, 0.6)} 0%, ${rgba(V.copper, 0.32)} 62%, rgba(0,0,0,0) 100%)`,
            transform: `rotate(${(rnd(i * 9.9) * 360 + g * (0.6 + o)).toFixed(1)}deg)`,
            boxShadow: `0 6px 16px ${rgba(V.ink0, 0.6)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovLadronesA: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta el movimiento con UNA Sequence: el frame LOCAL no es el global.
  const lFrame = useCurrentFrame();
  const off = (Number.isFinite(gFrame) ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame) ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Entra en z -120 (frontal y estable, lo que deja MovEscalonTarifa) y entrega z -300 con
  // panY -12 (cerrada dentro del armario, lo que necesita MovLadronesB).
  const camB = gcam(g, { z0: -120, z1: -300, panX: -30, panY: -12, ry: -3.4, rx: 1.2, dur: END });
  const camZ = ip(g,
    [0, 140, 360, 540, 720, 900, 1110, 1240, 1400, 1500, 1660, 1780, 1860],
    [0, 30, 74, 58, 96, 128, 78, 26, -18, -34, -20, -8, 0]);
  const camDrop = ip(g, [0, 360, 720, 1110, 1330, 1500, 1700, 1860],
    [0, -6, -18, -10, -26, -74, -104, -112]);
  const camTilt = ip(g, [0, 360, 720, 1110, 1330, 1500, 1700, 1860],
    [0, -0.15, -0.4, -1.4, -2.2, -3.6, -4.8, -5.2]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camDrop.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la deriva de la cámara, replicada (atenuada) para el HUD: el texto no queda pegado con cinta
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.42).toFixed(2)}px, ${(by * 0.42).toFixed(2)}px)`;

  // ══ LA LUZ — ámbar bajo de cocina → día en el patio → LINTERNA EN EL ARMARIO ══════════════
  const keyFrom = ip(g, [0, 360, 560, 720, 900, 1110, 1300, 1500, 1860],
    [0.68, 0.64, 0.54, 0.44, 0.30, 0.34, 0.46, 0.52, 0.54]);
  const inten = ip(g, [0, 200, 560, 700, 900, 1110, 1290, 1500, 1700, 1860],
    [0.62, 0.78, 0.86, 0.94, 1.06, 0.98, 0.72, 0.60, 0.52, 0.46]);
  const floor = ip(g, [0, 360, 720, 1110, 1330, 1500, 1860],
    [0.58, 0.54, 0.50, 0.62, 0.70, 0.78, 0.86]);
  // dos tramos que se tocan en el MISMO color (sky): la luz evoluciona, nunca salta.
  const tintA = g < 950
    ? light(ip(g, [0, 180, 560, 950], [0, 0.28, 0.66, 1]), "amber", "sky")
    : light(ip(g, [950, 1140, 1330, 1560], [0, 0.4, 0.78, 1]), "sky", "torch");
  const tintB = g < 1100
    ? light(ip(g, [0, 300, 700, 1100], [0.12, 0.5, 0.8, 1]), "volt", "amber")
    : light(ip(g, [1100, 1360, 1700], [0, 0.62, 1]), "amber", "torch");

  // ══ FICHA A — EL MEDIDOR DE ENCHUFE. Nace grande, se gana la medición y se va al riel. ════
  const kA = [0, 40, 150, 300, 360, 430, 560, 700, 780, 830];
  const wA = ip(g, kA, [1210, 1186, 1120, 980, 900, 430, 402, 392, 380, 372]);
  const hA = ip(g, kA, [690, 676, 640, 560, 514, 250, 234, 228, 220, 214]);
  const xA = ip(g, kA, [50, 50, 48, 42, 39, 17, 16, 6, -30, -62]);
  const yA = ip(g, kA, [46, 46, 46, 47, 48, 70, 71, 72, 74, 75]);
  const zA = ip(g, kA, [30, 26, 20, 6, -2, -120, -130, -140, -150, -156]);
  const ryA = ip(g, kA, [3, 2.2, 1.6, 4, 6, 15, 15, 17, 19, 20]);
  const rxA = ip(g, kA, [0, 0, 0, 0, 0, 4, 6, 8, 9, 9]);
  const litA = ip(g, kA, [0.5, 1, 1, 1, 0.95, 0.6, 0.55, 0.5, 0.44, 0.4]);
  const kbA = Math.max(1.05, ip(g, [0, 150, 300, 430, 830], [1320, 1240, 1080, 470, 400]) / Math.max(40, wA));
  const opA = ip(g, [0, 14], [0, 1]);

  // ══ FICHA B — LA PINZA EN EL TABLERO. Entra por geometría desde la derecha. ═══════════════
  const kB = [110, 170, 250, 330, 380, 440, 620, 760, 840];
  const wB = ip(g, kB, [360, 620, 646, 626, 566, 362, 346, 338, 332]);
  const hB = ip(g, kB, [214, 366, 382, 370, 334, 212, 202, 198, 194]);
  const xB = ip(g, kB, [118, 78, 76, 75, 72, 84, 85, 96, 134]);
  const yB = ip(g, kB, [40, 40, 40, 41, 42, 22, 22, 21, 20]);
  const zB = ip(g, kB, [-40, 10, 16, 12, -20, -110, -120, -130, -142]);
  const ryB = ip(g, kB, [-16, -8, -7, -7, -9, -13, -13, -15, -17]);
  const rxB = ip(g, kB, [0, 0, 0, 0, 0, 3, 5, 7, 8]);
  const litB = ip(g, kB, [0.4, 1, 1, 1, 0.9, 0.58, 0.54, 0.48, 0.42]);
  const kbB = Math.max(1.05, ip(g, [110, 250, 440, 840], [700, 720, 400, 366]) / Math.max(40, wB));

  // ══ FICHA C — LA VENTANA DEL DISPLAY → LA HOJA DE LA HELADERA (el MATCH-SHAPE de g360) ════
  // Nace como el rectángulo del display del medidor con un MACRO del papel rayado adentro (a esa
  // escala es una textura abstracta) y se ABRE sin re-encuadrar: el display SE VUELVE la hoja.
  const kC = [150, 230, 300, 340, 362, 400, 440, 520, 700, 745, 800, 860];
  const wC = ip(g, kC, [318, 318, 316, 314, 348, 900, 1150, 1184, 1184, 1160, 1116, 1080]);
  const hC = ip(g, kC, [162, 162, 161, 160, 178, 522, 672, 692, 692, 678, 654, 632]);
  const xC = ip(g, kC, [40, 40, 40, 40, 40.6, 45, 49, 50, 50, 34, -26, -74]);
  const yC = ip(g, kC, [56, 56, 56, 56, 55, 50, 47, 46, 46, 45.4, 44.6, 44]);
  const zC = ip(g, kC, [40, 40, 40, 42, 46, 40, 26, 20, 18, 10, -10, -26]);
  const ryC = ip(g, kC, [2, 2, 2, 2, 1.6, 0.8, 0, 0, 0, -4, -9, -12]);
  const litC = ip(g, kC, [0.72, 0.9, 0.95, 1, 1, 1, 1, 1, 1, 0.9, 0.72, 0.6]);
  // el recorte: la Ventana crece pero el material NO se re-encuadra (eso ES el match-shape)
  const kbC = Math.max(1.04, ip(g, [150, 300, 340, 362, 400, 440, 520, 860],
    [1420, 1400, 1390, 1420, 1260, 1230, 1230, 1160]) / Math.max(40, wC));
  const opC = ip(g, [150, 168], [0, 1]);

  // ══ FICHA D — LA UNIDAD EXTERIOR DEL AIRE. Entra con el vector con el que sale la hoja. ═══
  const kD = [690, 700, 800, 900, 1000, 1060, 1108, 1160];
  const wD = ip(g, kD, [1240, 1240, 1262, 1300, 1322, 1332, 1342, 1350]);
  const hD = ip(g, kD, [700, 700, 712, 734, 746, 752, 758, 762]);
  const xD = ip(g, kD, [130, 126, 50, 49, 48.5, 48, 47, 46]);
  const yD = ip(g, kD, [46, 46, 46, 46.5, 47, 47, 47, 47]);
  const zD = ip(g, kD, [-30, -28, -10, 6, 16, 20, 22, 24]);
  const ryD = ip(g, kD, [-10, -9, -1, 0, 0.6, 1, 1.2, 1.4]);
  const litD = ip(g, kD, [0.55, 0.62, 0.95, 1, 1, 1, 0.9, 0.7]);
  const kbD = Math.max(1.05, ip(g, [690, 800, 1000, 1160], [1480, 1420, 1400, 1380]) / Math.max(40, wD));
  const vidD = g < 760 ? 0 : ip(g, [768, 890, 906], [1, 1, 0]);
  const vidD2 = g < 940 ? 0 : ip(g, [946, 1068, 1084], [1, 1, 0]);

  // satélite: el mismo material en MACRO cerrado sobre la reja (otra escala = otro plano)
  const opSat = ip(g, [846, 886, 1064, 1100], [0, 1, 1, 0.4]);

  // ══ FICHA E — EL TANQUE DEL CALENTADOR. Casi a sangre: el armario es estrecho. ════════════
  // La cámara BAJA por el tanque: la tarjeta sube (y↓) y el recorte baja (cy↑). Ese es el
  // MATCH-MOVE de la frontera 4: nada corta, todo es la misma caída.
  const kE = [1050, 1108, 1200, 1330, 1440, 1500, 1600, 1720, 1860];
  const wE = ip(g, kE, [1560, 1542, 1502, 1462, 1424, 1402, 1382, 1362, 1344]);
  const hE = ip(g, kE, [880, 868, 846, 824, 802, 790, 778, 766, 756]);
  const xE = ip(g, kE, [50, 50, 50, 49.4, 48, 46.6, 44, 42.6, 42]);
  const yE = ip(g, kE, [48, 48, 47, 46, 42.5, 38, 30, 23, 20]);
  const zE = ip(g, kE, [-24, -18, -2, 12, 24, 32, 38, 42, 44]);
  const ryE = ip(g, kE, [3, 2.4, 1.4, 0.6, 0.2, 0, -0.6, -1.2, -1.6]);
  const rxE = ip(g, kE, [0, 0, 0.6, 1.4, 2.2, 2.8, 3.4, 3.8, 4]);
  const litE = ip(g, kE, [0.4, 0.72, 0.94, 1, 1, 0.96, 0.9, 0.86, 0.84]);
  const cyE = ip(g, kE, [22, 26, 34, 44, 55, 64, 76, 86, 92]);
  const kbE = Math.max(1.08, ip(g, [1050, 1200, 1440, 1600, 1860], [2480, 2320, 2060, 1900, 1820]) / Math.max(40, wE));
  const vidE = g < 1120 ? 0 : ip(g, [1126, 1250, 1266], [1, 1, 0]);
  const vidE2 = g < 1560 ? 0 : ip(g, [1566, 1688, 1704], [1, 1, 0]);

  // ══ FICHA F — EL RELOJ DE LA COCINA marcando las tres. Flota en la oscuridad del armario. ═
  const kF = [1494, 1560, 1660, 1780, 1860];
  const wF = ip(g, kF, [300, 470, 522, 502, 488]);
  const hF = ip(g, kF, [190, 300, 334, 322, 312]);
  const xF = ip(g, kF, [96, 78, 73, 71, 70]);
  const yF = ip(g, kF, [24, 27, 29, 30.4, 31]);
  const zF = ip(g, kF, [-170, -64, 10, 26, 30]);
  const ryF = ip(g, kF, [-19, -13, -8, -7, -6]);
  const rxF = ip(g, kF, [0, 2, 5, 6, 6.4]);
  const litF = ip(g, kF, [0.3, 0.6, 0.86, 0.92, 0.9]);
  const kbF = Math.max(1.05, ip(g, [1494, 1660, 1860], [640, 560, 536]) / Math.max(40, wF));

  // ══ LAS CIFRAS ════════════════════════════════════════════════════════════════════════════
  const nAire = Math.round(ip(g, [816, 852, 890, 934], [0, 214, 352, 320]));
  const aireOn = ip(g, [808, 830, 1062, 1094], [0, 1, 1, 0]);
  const nCal = Math.round(ip(g, [1196, 1232, 1272, 1318], [0, 188, 296, 270]));
  const calOn = ip(g, [1188, 1212, 1434, 1470], [0, 1, 1, 0]);

  // ══ TEXTOS — UNA idea por acto, todas por encima del mínimo de lectura ════════════════════
  const t1 = ip(g, [58, 82, 306, 332], [0, 1, 1, 0]);        // MEDIRLO TODO            (250 f · 8,3 s)
  const t2 = ip(g, [398, 424, 668, 696], [0, 1, 1, 0]);      // LA HOJA DE LA HELADERA  (244 f · 8,1 s)
  const t3 = ip(g, [776, 802, 1054, 1082], [0, 1, 1, 0]);    // EL AIRE                 (252 f · 8,4 s)
  const t4 = ip(g, [1156, 1182, 1428, 1462], [0, 1, 1, 0]);  // EL CALENTADOR           (246 f · 8,2 s)
  const t5 = ip(g, [1556, 1584, 1840, 1860], [0, 1, 1, 1]);  // LAS TRES DE LA MAÑANA   (256 f · 8,5 s)

  // ══ LA FIRMA — SunField: las horas de sol contra el consumo real de la casa ═══════════════
  const solOn = ip(g, [782, 824, 1040, 1090], [0, 0.9, 0.9, 0]);

  // ══ LA CAPA ARMARIO — opaca, a sangre, desde detrás del occluder hasta el final ══════════
  // Aparece en g1108, con la reja tapando el 100% del cuadro: su entrada NO se ve. Escala
  // siempre ≥1,16 → jamás asoma un borde. Es la garantía dura de la costura del avatar (g1575).
  const armarioOn = g >= 1098;
  const armEsc = ip(g, [1108, 1500, 1860], [1.30, 1.21, 1.16]);
  const armDim = ip(g, [1108, 1200, 1500, 1860], [0.62, 0.70, 0.78, 0.82]);
  const armX = ip(g, [1108, 1500, 1860], [0, -14, -24]);
  const armY = ip(g, [1108, 1500, 1860], [-18, 16, 40]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y no se remonta nunca; sólo EVOLUCIONA ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ CAPA ARMARIO — materia opaca a sangre. Tapa la costura del bucle del avatar. ══ */}
      {armarioOn && (
        <AbsoluteFill style={{ overflow: "hidden", backgroundColor: V.ink0 }}>
          <Img src={staticFile("img/cmeurgente/cmeu_calentador.jpg")} style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${armEsc.toFixed(3)}) translate(${armX.toFixed(1)}px, ${armY.toFixed(1)}px)`,
          }} />
          <AbsoluteFill style={{ background: `rgba(10,11,8,${armDim.toFixed(3)})` }} />
          <AbsoluteFill style={{
            background: `radial-gradient(72% 56% at 45% 42%, ${rgba(V.torch, 0.09)} 0%, rgba(0,0,0,0) 66%)`,
          }} />
        </AbsoluteFill>
      )}

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · el fondo lejano — la cocina, el patio, el armario -------------------- */}
        {g < 706 && (
          <PhotoPlane src="img/cmeurgente/cmeu_hoja_heladera.jpg" kind="photo" z={-660}
            scale={ip(g, [0, 700], [1.34, 1.22])}
            dim={ip(g, [0, 150, 360, 700], [0.66, 0.72, 0.74, 0.78])}
            tint={V.amber} />
        )}
        {g >= 706 && g < 1102 && (
          <PhotoPlane src="img/cmeurgente/cmeu_aire_exterior.jpg" kind="photo" z={-680}
            scale={ip(g, [706, 1100], [1.36, 1.24])}
            dim={ip(g, [706, 900, 1100], [0.58, 0.52, 0.62])}
            tint={V.sky} />
        )}

        {/* PLANO 2 · el aire del cuarto: rejilla de profundidad (sólo en el tramo de datos) - */}
        <Plane z={-440}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(bx * 2.6).toFixed(2)}px)` }}>
            <AbsoluteFill style={{
              opacity: ip(g, [120, 300, 690, 760], [0, 0.24, 0.24, 0]),
              backgroundImage:
                `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 106px),` +
                `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.055)} 0 1px, rgba(0,0,0,0) 1px 106px)`,
            }} />
          </div>
        </Plane>

        {/* PLANO 3 · FICHA A — el medidor de enchufe (material REAL adentro) --------------- */}
        {g < 850 && (
          <Plane z={0}>
            <Ventana x={xA} y={yA} w={wA} h={hA} z={zA} ry={ryA} rx={rxA}
              radius={g < 400 ? 14 : 10} lit={litA} litColor={V.volt} opacity={opA}>
              <Mat photo="img/cmeurgente/cmeu_medidor_enchufe.jpg"
                w={wA} h={hA} k={kbA}
                cx={50 + Math.sin(g / 250) * 3.2} cy={50 + Math.cos(g / 300) * 2.4}
                lit={litA} litColor={V.volt} sheenAt={L(30)} />
              <Rotulo n="A" texto="Aparato por aparato" on={ip(g, [196, 226, 400, 428], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 3 · FICHA B — la pinza abrazando el cable del tablero --------------------- */}
        {g >= 104 && g < 858 && (
          <Plane z={0}>
            <Ventana x={xB} y={yB} w={wB} h={hB} z={zB} ry={ryB} rx={rxB}
              radius={10} lit={litB} litColor={V.volt} opacity={ip(g, [104, 124], [0, 1])}>
              <Mat photo="img/cmeurgente/cmeu_pinza_tablero.jpg"
                w={wB} h={hB} k={kbB}
                cx={48 + Math.sin(g / 210) * 2.8} cy={52 + Math.cos(g / 268) * 2.2}
                lit={litB} litColor={V.volt} sheenAt={L(178)} />
              <Rotulo n="B" texto="El cable de entrada" on={ip(g, [246, 276, 372, 400], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 4 · FICHA C — el display que SE ABRE hasta ser la hoja de la heladera ----- */}
        {g >= 146 && g < 872 && (
          <Plane z={0}>
            <Ventana x={xC} y={yC} w={wC} h={hC} z={zC} ry={ryC} rx={0}
              radius={g < 380 ? 8 : 12} lit={litC} litColor={g < 400 ? V.volt : V.bone} opacity={opC}>
              <Mat photo="img/cmeurgente/cmeu_hoja_heladera.jpg"
                w={wC} h={hC} k={kbC}
                cx={g < 380 ? 44 + Math.sin(g / 190) * 1.6 : 50 + Math.sin(g / 240) * 2.2}
                cy={g < 380 ? 40 + Math.cos(g / 230) * 1.4 : 50 + Math.cos(g / 290) * 1.8}
                lit={litC} litColor={g < 400 ? V.volt : V.bone} sheenAt={L(392)} />
              {/* el bolígrafo azul escribiendo: subrayado que barre fila por fila */}
              <FilasHoja g={g} />
              <Rotulo n="" texto="Lo que mediste tú" on={ip(g, [560, 590, 690, 714], [0, 1, 1, 0])} tint={V.volt} />
              {/* la luz del display cuando la Ventana TODAVÍA es el display del medidor */}
              {g < 430 && (
                <AbsoluteFill style={{
                  background: `linear-gradient(168deg, ${rgba(V.volt, 0.2 * ip(g, [300, 362, 428], [1, 0.7, 0]))} 0%, rgba(0,0,0,0) 62%)`,
                  mixBlendMode: "screen",
                }} />
              )}
            </Ventana>
          </Plane>
        )}

        {/* PLANO 5 · LA CÁPSULA QUE SE VUELVE IMÁN (cruza la frontera 1) ------------------- */}
        <Plane z={40}>
          <CapsulaIman g={g} />
        </Plane>

        {/* PLANO 6 · FICHA D — la unidad exterior del aire, con el ventilador girando ------ */}
        {g >= 686 && g < 1102 && (
          <Plane z={0}>
            <Ventana x={xD} y={yD} w={wD} h={hD} z={zD} ry={ryD} rx={0}
              radius={12} lit={litD} litColor={V.sky}>
              <Mat photo="img/cmeurgente/cmeu_aire_exterior.jpg"
                clip="broll/cmeurgente/cmeu_aire_mov.mp4" vid={Math.max(vidD, vidD2)}
                w={wD} h={hD} k={kbD}
                cx={50 + Math.sin(g / 258) * 3.0} cy={50 + Math.cos(g / 310) * 2.2}
                lit={litD} litColor={V.sky} sheenAt={L(816)} />
              <Rotulo n="1" texto="Ladrón número uno" on={ip(g, [886, 916, 1044, 1072], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 6b · el satélite MACRO de la reja: mismo material, otra escala ------------ */}
        {g >= 840 && g < 1102 && (
          <Plane z={70} style={{ opacity: opSat }}>
            <Ventana x={ip(g, [840, 940, 1100], [104, 82, 78])} y={ip(g, [840, 1100], [72, 70])}
              w={358} h={252} z={ip(g, [840, 1100], [30, 60])}
              ry={ip(g, [840, 1100], [-16, -11])} rx={6} radius={10} lit={0.9} litColor={V.steel}>
              <Mat photo="img/cmeurgente/cmeu_aire_exterior.jpg" w={358} h={252} k={2.6}
                cx={46 + Math.sin(g / 176) * 2.4} cy={40} lit={0.9} litColor={V.steel} sheenAt={L(892)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 7 · FICHA E — el tanque del calentador, casi a sangre en el armario ------- */}
        {g >= 1098 && (
          <Plane z={0}>
            <Ventana x={xE} y={yE} w={wE} h={hE} z={zE} ry={ryE} rx={rxE}
              radius={10} lit={litE} litColor={V.torch}>
              <Mat photo="img/cmeurgente/cmeu_calentador.jpg"
                clip="broll/cmeurgente/cmeu_calentador_torch.mp4" vid={Math.max(vidE, vidE2)}
                w={wE} h={hE} k={kbE}
                cx={48 + Math.sin(g / 268) * 2.2} cy={cyE}
                lit={litE} litColor={V.torch} sheenAt={L(1180)} />
              <Rotulo n="2" texto="Ladrón número dos" on={ip(g, [1268, 1300, 1418, 1448], [0, 1, 1, 0])} tint={V.volt} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 8 · FICHA F — el reloj de la cocina marcando las tres -------------------- */}
        {g >= 1490 && (
          <Plane z={20}>
            <Ventana x={xF} y={yF} w={wF} h={hF} z={zF} ry={ryF} rx={rxF}
              radius={10} lit={litF} litColor={V.torch} opacity={ip(g, [1490, 1512], [0, 1])}>
              <Mat photo="img/cmeurgente/cmeu_reloj_tres.jpg" w={wF} h={hF} k={kbF}
                cx={50 + Math.sin(g / 232) * 2.0} cy={49 + Math.cos(g / 286) * 1.6}
                lit={litF} litColor={V.torch} sheenAt={L(1596)} />
            </Ventana>
          </Plane>
        )}

        {/* PLANO 9 · EL ARO — reja del ventilador → charco de la linterna ------------------ */}
        <Plane z={54}>
          <AroLuz g={g} />
        </Plane>

        {/* PLANO 10 · LA COSTURA DE CHAPA → LA RESISTENCIA (cruza la frontera 4) ---------- */}
        <Plane z={64}>
          <Resistencia g={g} />
        </Plane>

        {/* PLANO 11 · PRIMER PLANO — lo que pasa POR DELANTE en cada tramo ---------------- */}
        {/* acto 1: el enchufe, flotando cerca del lente */}
        {g >= 40 && g < 268 && (
          <Plane z={210}>
            <IconPng src="img/cmeurgente/cmeu_ic_enchufe.png"
              x={ip(g, [40, 268], [-8, 34])} y={ip(g, [40, 268], [84, 92])}
              size={ip(g, [40, 150, 268], [168, 196, 184])} z={0}
              opacity={ip(g, [40, 78, 226, 264], [0, 0.9, 0.9, 0])}
              rot={ip(g, [40, 268], [-16, 8])} glow={V.ink0} />
          </Plane>
        )}
        {/* acto 2: el canto de la puerta del refrigerador, pegado al lente */}
        {g >= 370 && g < 726 && (
          <Plane z={286}>
            <div style={{
              position: "absolute", top: "-20%", height: "142%",
              left: `${ip(g, [370, 560, 726], [-16, 6, 30])}%`,
              width: ip(g, [370, 726], [150, 210]),
              transform: `rotate(${ip(g, [370, 726], [-2.4, -1.2]).toFixed(2)}deg)`,
              background: `linear-gradient(90deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.ink2, 0.9)} 46%, ${rgba(V.steel, 0.24)} 92%, rgba(10,11,8,0) 100%)`,
              boxShadow: `12px 0 60px ${rgba(V.ink0, 0.9)}`,
            }} />
          </Plane>
        )}
        {/* acto 3: el sol, alto y de frente */}
        {g >= 760 && g < 1064 && (
          <Plane z={128}>
            <IconPng src="img/cmeurgente/cmeu_ic_sol.png"
              x={ip(g, [760, 1064], [18, 12])} y={ip(g, [760, 1064], [16, 22])}
              size={ip(g, [760, 900, 1064], [132, 168, 154])} z={0}
              opacity={ip(g, [760, 800, 1020, 1060], [0, 0.9, 0.9, 0])}
              rot={ip(g, [760, 1064], [-8, 10])} glow={V.ink0} />
          </Plane>
        )}
        {/* acto 4 y 5: el caño de cobre del armario y las dos jambas */}
        <Plane z={252}>
          <CanoCobre g={g} />
        </Plane>
        <Plane z={300}>
          <Jambas g={g} />
        </Plane>
        {/* acto 4: el ícono del calentador, como objeto en el aire del armario */}
        {g >= 1204 && g < 1416 && (
          <Plane z={96}>
            <IconPng src="img/cmeurgente/cmeu_ic_calentador.png"
              x={ip(g, [1204, 1416], [76, 72])} y={ip(g, [1204, 1416], [62, 68])}
              size={ip(g, [1204, 1290, 1416], [96, 134, 126])} z={0}
              opacity={ip(g, [1204, 1240, 1382, 1412], [0, 0.92, 0.92, 0])}
              rot={ip(g, [1204, 1416], [-10, 4])} glow={V.ink0} />
          </Plane>
        )}
        {/* acto 5: el reloj como objeto (el mismo que está en la tarjeta, otra escala) */}
        {g >= 1620 && (
          <Plane z={112}>
            <IconPng src="img/cmeurgente/cmeu_ic_reloj.png"
              x={ip(g, [1620, 1860], [22, 26])} y={ip(g, [1620, 1860], [22, 27])}
              size={ip(g, [1620, 1720, 1860], [88, 122, 116])} z={0}
              opacity={ip(g, [1620, 1656, 1860], [0, 0.9, 0.86])}
              rot={ip(g, [1620, 1860], [-12, 3])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ HOJAS SECAS del patio, cruzando por delante de todo (acto 3) ═══════════════ */}
      <HojasSecas g={g} />

      {/* ══════ COSTURA · FRONTERA 3 (g1110) — OCLUSIÓN CON LA CHAPA DE LA REJA ═══════════ */}
      {/* la reja gira y barre; el occluder del Stage lleva la materia a luminancia media (lit
          0.30) para que no dé ni flash blanco ni fundido a negro. Detrás YA está el armario. */}
      <Reja g={g} at={1092} dur={34} />
      <SeamOcclude at={L(1096)} dur={28} color={V.steel} angle={6} lit={0.3} />

      {/* ══════ LA FIRMA DEL VIDEO — las 24 horas, y cuánto del consumo cae con sol ═══════ */}
      {g >= 776 && g < 1096 && (
        <SunField sun={7 / 24} from={9} use={0.22} cells={24}
          on={solOn} tint={V.volt} night={V.sky} y={88} w={1180} h={32} cycle={210} />
      )}

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* LA CIFRA DEL AIRE — 320 kWh al mes */}
        {g >= 806 && g < 1096 && (
          <div style={{ opacity: aireOn }}>
            <div style={{
              position: "absolute", left: "75%", top: "26%",
              width: 620, height: 380, marginLeft: -310, marginTop: -190,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value={String(nAire)} unit="kWh" label="AL MES"
              at={L(812)} x={75} y={26} size={132} color={V.volt} align="center" />
          </div>
        )}

        {/* LA CIFRA DEL CALENTADOR — 270 kWh al mes */}
        {g >= 1186 && g < 1472 && (
          <div style={{ opacity: calOn }}>
            <div style={{
              position: "absolute", left: "76%", top: "31%",
              width: 620, height: 380, marginLeft: -310, marginTop: -190,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.86), rgba(8,9,6,0))",
            }} />
            <Readout value={String(nCal)} unit="kWh" label="AL MES"
              at={L(1192)} x={76} y={31} size={132} color={V.volt} align="center" />
          </div>
        )}

        {/* ACTO 1 · MEDIRLO TODO */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "72%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={680} pad={24}>
              <Kick color={V.volt}>Los treinta días</Kick>
              <div style={{ height: 6 }} />
              <Head size={72}>MEDIRLO TODO</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Aparato por aparato. <Em>Nada a ojo.</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · LA HOJA DE LA HELADERA */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t2, transform: `translateY(${((1 - t2) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Papel rayado y bolígrafo</Kick>
              <div style={{ height: 6 }} />
              <Head size={64}>LA HOJA DE LA <Em>HELADERA</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Ahí va el número que mediste tú</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · EL AIRE */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "9%", opacity: t3, transform: `translateY(${((1 - t3) * -22).toFixed(1)}px)` }}>
            <Bed w={660} pad={24}>
              <Kick color={V.volt}>Ladrón número uno</Kick>
              <div style={{ height: 6 }} />
              <Head size={76}>EL AIRE</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Ése lo sospechaba <Em>todo el mundo</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · EL CALENTADOR */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "66%", opacity: t4, transform: `translateY(${((1 - t4) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Ladrón número dos</Kick>
              <div style={{ height: 6 }} />
              <Head size={70}>EL CALENTADOR</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Ése no lo sospechaba <Em>nadie</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · LAS TRES DE LA MAÑANA */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "64%", opacity: t5, transform: `translateY(${((1 - t5) * 24).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.torch}>Nadie abrió una llave</Kick>
              <div style={{ height: 6 }} />
              <Head size={66}>LAS TRES DE LA <Em color={V.torch}>MAÑANA</Em></Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Y el tanque se calienta solo</Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta de cierre: el armario se cierra sobre el haz y los bordes se apagan */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at ${ip(g, [1108, 1860], [48, 44]).toFixed(1)}% ${ip(g, [1108, 1860], [44, 56]).toFixed(1)}%, ` +
          `rgba(0,0,0,0) ${ip(g, [0, 720, 1110, 1860], [56, 58, 46, 34]).toFixed(0)}%, ` +
          `rgba(6,7,5,${ip(g, [0, 720, 1110, 1500, 1860], [0.34, 0.3, 0.56, 0.72, 0.82]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
