// MovCeroDolares.tsx — S7 · UN MOVIMIENTO CONTINUO de 68 s (2040 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 857,0.
//
// LA ESPINA: el escalón uno. Cuatro gestos que no cuestan NADA y que entre los cuatro bajan ciento
// noventa kilovatios hora al mes. Nada de esto es una ilustración conceptual: es un dedo moviendo un
// termostato tres grados, un filtro gris que sale y uno limpio que entra, un dial de sesenta a
// cincuenta, y un temporizador de ocho horas a cuatro. Se hacen esta misma tarde.
//
// EL VIAJE DE LA LUZ ES EL MOVIMIENTO: entro de noche, con los pilotos rojos de standby respirando en
// la oscuridad, y salgo con la primera luz limpia del amanecer, la ropa tendida al sol y la secadora
// quieta. La luz hace ese viaje ENTERO a lo largo de los cinco actos, sin un solo salto.
//
// ⚠️ En este tramo el avatar va EN BUCLE Y MUTEADO: no hay fondo garantizado debajo. Por eso el
//    AbsoluteFill raíz + VoltAtmos + el plano fotográfico de fondo (la piscina, de noche a amanecer)
//    están montados en TODOS los cuadros, de g0 a g2040. Nunca hay un instante sin cobertura total.
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ HANDOFF                                                                                        ║
// ╠════╦══════════════════════════════════════════╦══════════════════════════════════════╦═════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto            ║ SALE: encuadre + luz + objeto        ║ COSTURA ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════╬═════════╣
// ║ 1  ║ CÁM: abierta sobre la casa de noche vista ║ CÁM: z 40→−6 empujando hacia adentro ║ MATCH-  ║
// ║ g0 ║  desde el patio (z 40, panY +14), la      ║  y bajando; no frena en la frontera. ║ SHAPE   ║
// ║    ║  inercia que deja MovLadronesB.           ║ LUZ: keyFrom 0.62→0.43, tintA torch  ║ el      ║
// ║    ║ LUZ: NOCHE. torch moribundo, contra cobre ║  →casi volt, floor 0.86→0.80.        ║ CÍRCULO ║
// ║    ║  (keyFrom 0.62, int 0.46, floor 0.86).    ║ MAT: el ARO del display circular del ║ del     ║
// ║    ║ MAT: el aire de la noche y los PILOTOS    ║  termostato, ya desprendido de la    ║ termos- ║
// ║    ║  ROJOS de standby respirando.             ║  pared, empezando a cuadrarse.       ║ tato    ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════╬═════════╣
// ║ 2  ║ CÁM: z≈−6 avanzando, misma inercia; las   ║ CÁM: z≈−96, dentro del armario,      ║ OCLU-   ║
// ║g390║  paredes del armario ya entrando.         ║  todavía empujando.                  ║ SIÓN    ║
// ║    ║ LUZ: keyFrom 0.43, int 0.80 — la linterna ║ LUZ: keyFrom 0.36, int 0.92, tintA   ║ V.steel ║
// ║    ║  del armario, negro alrededor.            ║  volt pleno: la medición.            ║ la TAPA ║
// ║    ║ MAT: el aro CUADRADO ya con el filtro     ║ MAT: la TAPA DE CHAPA cruzando el    ║ del     ║
// ║    ║  gris adentro (el círculo se volvió el    ║  cuadro mientras el filtro limpio    ║ equipo  ║
// ║    ║  filtro).                                 ║  entra en la ranura.                 ║ cierra  ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════╬═════════╣
// ║ 3  ║ CÁM: z≈−96 dentro del armario, la misma   ║ CÁM: z≈−110→−34, YA retrocediendo y  ║ MATCH-  ║
// ║g810║  curva; la tapa se abre hacia la izq.     ║  saliendo al patio, sin cortar.      ║ MOVE    ║
// ║    ║ LUZ: keyFrom 0.36, tintA volt, floor 0.76 ║ LUZ: keyFrom 0.36→0.44, floor 0.76→  ║ el      ║
// ║    ║  — el armario, luz dura de dato.          ║  0.66: el cielo empieza a entrar.    ║ DIAL    ║
// ║    ║ MAT: el DIAL redondo del calentador, con  ║ MAT: EL MISMO DIAL, encogido y ya    ║ redondo ║
// ║    ║  el sarro del tanque al costado.          ║  viajando arriba-derecha; la piscina ║ sale    ║
// ║    ║                                           ║  ya subió al cuadro por abajo.       ║ con la  ║
// ║    ║                                           ║                                      ║ cámara  ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════╬═════════╣
// ║ 4  ║ CÁM: z≈−34 retrocediendo, abriendo al     ║ CÁM: z≈+70 abierta sobre el patio,   ║ MATCH-  ║
// ║g1230║ patio con la misma velocidad.            ║  empezando a volver a acercarse.     ║ SHAPE   ║
// ║    ║ LUZ: keyFrom 0.44, int 0.86, floor 0.66.  ║ LUZ: keyFrom 0.48, int 1.00, floor   ║ el      ║
// ║    ║ MAT: el mismo dial, ahora TEMPORIZADOR    ║  0.50, tintB casi sky: ya amanece.   ║ REFLEJO ║
// ║    ║  (el rodillo pasó de °C a HORAS), y el    ║ MAT: la BANDA DE BRILLO del agua,    ║ del     ║
// ║    ║  agua de la piscina moviéndose.           ║  tendida y horizontal, y una sábana  ║ agua se ║
// ║    ║                                           ║  cruzando por delante del lente.     ║ vuelve  ║
// ║    ║                                           ║                                      ║ SÁBANA  ║
// ╠════╬══════════════════════════════════════════╬══════════════════════════════════════╬═════════╣
// ║ 5  ║ CÁM: z≈+70 abierta, volviendo a entrar    ║ CÁM: MEDIA siguiendo el contador que ║ salida  ║
// ║g1620║ despacio.                                ║  SUBE (z −140, panX −8). Es el       ║ del     ║
// ║    ║ LUZ: amanecer a medio abrir (keyFrom      ║  encuadre con el que abre            ║ movi-   ║
// ║    ║  0.48, floor 0.50, tintB sky).            ║  MovCientoVeintiseis.                ║ miento  ║
// ║    ║ MAT: la sábana ocupando el cuadro, con    ║ LUZ: PRIMERA LUZ LIMPIA: V.volt      ║         ║
// ║    ║  el brillo del agua convertido en el      ║  frontal (keyFrom 0.50), int 1.12,   ║         ║
// ║    ║  pliegue iluminado.                       ║  floor 0.38, cielo sky arriba.       ║         ║
// ║    ║                                           ║ MAT: LA SÁBANA TENDIDA al sol y el   ║         ║
// ║    ║                                           ║  contador de 190 kWh arriba de ella. ║         ║
// ╚════╩══════════════════════════════════════════╩══════════════════════════════════════╩═════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido:
//   g390  1→2  MATCH-SHAPE   — el aro del DISPLAY CIRCULAR del termostato (330×330, radio 165) no se
//                              corta ni se apaga: se cuadra a 1180×660 con radio 14 mientras el filtro
//                              gris se abre adentro desde el centro por recorte geométrico (inset), y
//                              el color del aro rueda de volt a steel. La tarjeta grande del
//                              termostato se va por GEOMETRÍA, cayendo fuera de cuadro por abajo.
//   g810  2→3  OCLUSIÓN      — <SeamOcclude color={V.steel} lit={0.30}>: la TAPA DE CHAPA del equipo
//                              cruza el cuadro. Diegéticamente la misma chapa entra desde la derecha
//                              antes de la frontera y del otro lado sigue su giro abriéndose hacia la
//                              izquierda: es una sola pieza de metal atravesando el corte.
//   g1230 3→4  MATCH-MOVE    — la cámara no corta: sigue su curva (camZ −110 → +26, camTilt bajando) y
//                              el mundo cambia debajo. El armario sale por los costados, la piscina
//                              sube al cuadro desde abajo, y el DIAL REDONDO sobrevive entero: encoge,
//                              viaja arriba-derecha y su lectura rueda de "50°" a "8 H" en un odómetro.
//   g1620 4→5  MATCH-SHAPE   — la BANDA DE BRILLO del agua (una franja horizontal luminosa sobre la
//                              tarjeta) conserva su ancho, se inclina y se ablanda hasta ser el
//                              pliegue iluminado de la sábana, mientras el clip del tendedero se
//                              revela adentro de la MISMA tarjeta con un barrido de izquierda a
//                              derecha (el viento), sin un solo frame de opacidad bajando.
//
// ⛔ CONTRATO: sin random ni reloj de sistema (todo sale de rnd(k) y de gFrame) · sin backdrop-filter ·
// ⛔ sin position fixed · sin capas con desenfoque · rutas SOLO literales de la ficha · ninguna
// ⛔ <Sequence> envolviendo un acto (el movimiento entero es UNA sola).

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 2040;
const A2 = 390;
const A3 = 810;
const A4 = 1230;
const A5 = 1620;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ── MARCO: el vidrio que RECORTA el material. Su radio es animable, y ésa es la clave del match-shape
//    de la frontera 1: el MISMO marco es primero un display circular y después el cuadro del filtro.
const Marco: React.FC<{
  x: number; y: number; w: number; h: number; z?: number;
  ry?: number; rx?: number; rot?: number; radius?: number;
  lit?: number; litColor?: string; opacity?: number; children: React.ReactNode;
}> = ({ x, y, w, h, z = 0, ry = 0, rx = 0, rot = 0, radius = 12, lit = 1, litColor = V.volt, opacity = 1, children }) => {
  const ww = Math.max(8, w);
  const hh = Math.max(8, h);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: ww, height: hh, marginLeft: -ww / 2, marginTop: -hh / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotate(${rot.toFixed(2)}deg)`,
      borderRadius: radius, overflow: "hidden", opacity: clamp01(opacity),
      border: `1px solid ${rgba(litColor, 0.32 * lit)}`,
      boxShadow: `0 ${Math.round(hh * 0.15)}px ${Math.round(hh * 0.24)}px ${rgba(V.ink0, 0.8)}, ` +
        `0 4px 18px ${rgba(V.ink0, 0.64)}, inset 0 1px 0 ${rgba(V.white, 0.26 * lit)}`,
    }}>{children}</div>
  );
};

// ── MATERIAL adentro del marco: la FOTO siempre (con recorte vivo) y el CLIP encima cuando toca.
//    `k` es el zoom de recorte (≥1: la foto siempre cubre el marco entero, nunca hay borde vacío).
const Mat: React.FC<{
  photo?: string; clip?: string; vid?: number;
  w: number; h: number; k: number; cx?: number; cy?: number;
  lit?: number; litColor?: string; sheenAt?: number;
}> = ({ photo, clip, vid = 0, w, h, k, cx = 50, cy = 50, lit = 1, litColor = V.volt, sheenAt = -999 }) => {
  const kk = Math.max(1.03, k);
  const iw = Math.max(10, w * kk);
  const ih = Math.max(10, h * kk);
  return (
    <>
      {photo && (
        <MediaCard src={photo} kind="photo" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} sheenAt={sheenAt} />
      )}
      {clip && vid > 0.004 && (
        <MediaCard src={clip} kind="video" w={iw} h={ih} x={cx} y={cy} z={0}
          radius={0} lit={lit} litColor={litColor} opacity={clamp01(vid)} />
      )}
    </>
  );
};

// ── REVELADO POR GEOMETRÍA: el material nuevo no entra con opacidad, entra porque se ABRE un recorte.
//    "centro" = el cuadrado creciendo desde el centro (frontera 1). "izq" = el viento barriendo de
//    izquierda a derecha (frontera 4).
const Reveal: React.FC<{ p: number; mode: "centro" | "izq"; children: React.ReactNode }> = ({ p, mode, children }) => {
  const q = clamp01(p);
  if (q <= 0) return null;
  const c = (50 - 50 * q).toFixed(2);
  const clip = mode === "centro"
    ? `inset(${c}% ${c}% ${c}% ${c}%)`
    : `inset(0% ${(100 - 100 * q).toFixed(2)}% 0% 0%)`;
  return <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>;
};

// ── ODÓMETRO: la lectura no se cambia con un corte ni con un fundido, RUEDA. Es lo que deja pasar el
//    dial del calentador ("50°") a ser el temporizador de la bomba ("8 H") sin desmontarse.
const Rodillo: React.FC<{
  a: string; b: string; p: number; size: number; color: string; weight?: number; ls?: number;
}> = ({ a, b, p, size, color, weight = 800, ls = 0 }) => {
  const q = clamp01(p);
  const hh = Math.round(size * 1.14);
  const est: React.CSSProperties = {
    height: hh, lineHeight: `${hh}px`, fontFamily: F_DISPLAY, fontWeight: weight,
    fontSize: size, color, letterSpacing: ls, whiteSpace: "nowrap",
    textShadow: `0 0 ${Math.round(size * 0.42)}px ${rgba(color, 0.36)}, 0 4px 18px rgba(0,0,0,0.92)`,
  };
  return (
    <div style={{ height: hh, overflow: "hidden", position: "relative" }}>
      <div style={{ transform: `translateY(${(-q * hh).toFixed(2)}px)` }}>
        <div style={est}>{a}</div>
        <div style={est}>{b}</div>
      </div>
    </div>
  );
};

// ── EL DIAL REDONDO — el instrumento que recorre TRES actos: el termostato de la pared (acto 1), el
//    del calentador (acto 3) y el temporizador de la bomba (acto 4). Es un gráfico de verdad (arco,
//    marcas, aguja), nunca un objeto real disfrazado de vector.
const Dial: React.FC<{
  x: number; y: number; size: number; z?: number; frac: number; spread?: number; tint?: string;
  a: string; b: string; p: number; la: string; lb: string;
}> = ({ x, y, size, z = 0, frac, spread = 1, tint = V.volt, a, b, p, la, lb }) => {
  if (size < 8) return null;
  const s = clamp01(spread);
  const ang = lerp(-134, 134, clamp01(frac));
  const marcas = 29;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size,
      marginLeft: -size / 2, marginTop: -size / 2,
      transform: `translateZ(${z.toFixed(1)}px)`, transformStyle: "preserve-3d",
    }}>
      {/* el disco: cama oscura para que la lectura no se pierda sobre el material */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 26%, ${rgba(V.ink2, 0.9)} 0%, ${rgba(V.ink0, 0.94)} 68%)`,
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.2)}, 0 ${Math.round(size * 0.1)}px ${Math.round(size * 0.18)}px ${rgba(V.ink0, 0.8)}`,
        border: `2px solid ${rgba(tint, 0.42)}`,
      }} />
      {/* el arco recorrido */}
      <div style={{
        position: "absolute", inset: size * 0.06, borderRadius: "50%",
        background: `conic-gradient(from ${(180 + (-134)).toFixed(0)}deg, ${rgba(tint, 0.62)} 0deg, ${rgba(tint, 0.62)} ${(ang + 134).toFixed(1)}deg, ${rgba(V.white, 0.07)} ${(ang + 134).toFixed(1)}deg, ${rgba(V.white, 0.07)} 268deg, rgba(0,0,0,0) 268deg)`,
        opacity: 0.5 + 0.5 * s,
        maskImage: `radial-gradient(circle, rgba(0,0,0,0) ${(size * 0.34).toFixed(0)}px, rgba(0,0,0,1) ${(size * 0.37).toFixed(0)}px)`,
        WebkitMaskImage: `radial-gradient(circle, rgba(0,0,0,0) ${(size * 0.34).toFixed(0)}px, rgba(0,0,0,1) ${(size * 0.37).toFixed(0)}px)`,
      }} />
      {/* las marcas: se retraen hacia el borde cuando el círculo se cuadra (geometría, no opacidad) */}
      {Array.from({ length: marcas }, (_, i) => {
        const t = i / (marcas - 1);
        const aa = lerp(-134, 134, t);
        const larga = i % 7 === 0;
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%", width: larga ? 3 : 2,
            height: (larga ? size * 0.088 : size * 0.052) * s,
            marginLeft: larga ? -1.5 : -1,
            transformOrigin: "50% 0%",
            transform: `rotate(${(aa + 180).toFixed(2)}deg) translateY(${(size * 0.4).toFixed(1)}px)`,
            background: rgba(t <= clamp01(frac) ? tint : V.white, t <= clamp01(frac) ? 0.85 : 0.24),
            borderRadius: 2,
          }} />
        );
      })}
      {/* la aguja */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 4, height: size * 0.33 * s,
        marginLeft: -2, transformOrigin: "50% 100%",
        transform: `translateY(${(-size * 0.33 * s).toFixed(1)}px) rotate(${(ang).toFixed(2)}deg)`,
        background: `linear-gradient(180deg, ${rgba(tint, 0.98)} 0%, ${rgba(tint, 0.4)} 100%)`,
        boxShadow: `0 0 ${Math.round(size * 0.1)}px ${rgba(tint, 0.6)}`, borderRadius: 3,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: size * 0.07, height: size * 0.07,
        marginLeft: -size * 0.035, marginTop: -size * 0.035, borderRadius: "50%",
        background: rgba(tint, 0.9), boxShadow: `0 0 ${Math.round(size * 0.12)}px ${rgba(tint, 0.5)}`,
      }} />
      {/* la lectura, en odómetro */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "50%", textAlign: "center",
        marginTop: -size * 0.05, opacity: s,
      }}>
        <Rodillo a={a} b={b} p={p} size={Math.round(size * 0.28)} color={tint} weight={800} />
        <div style={{ marginTop: size * 0.02 }}>
          <Rodillo a={la} b={lb} p={p} size={Math.round(size * 0.085)} color={rgba(V.white, 0.66)} weight={700} ls={2.6} />
        </div>
      </div>
    </div>
  );
};

// ── LOS PILOTOS ROJOS del standby: la materia con la que entro (me la deja MovLadronesB encendida).
//    No son un dato: son luces físicas de aparatos apagados, respirando en la oscuridad de la casa.
const Pilotos: React.FC<{ g: number; on: number }> = ({ g, on }) => {
  if (on <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 11 }, (_, i) => {
        const px = 9 + rnd(i * 3.7) * 82;
        const py = 34 + rnd(i * 8.1) * 52;
        const late = 0.5 + 0.5 * Math.sin(g / (22 + rnd(i * 5.5) * 40) + i * 1.7);
        const sz = 5 + rnd(i * 2.3) * 6;
        return (
          <div key={i} style={{
            position: "absolute", left: `${px.toFixed(2)}%`, top: `${py.toFixed(2)}%`,
            width: sz, height: sz, borderRadius: "50%",
            background: rgba(V.danger, (0.5 + 0.4 * late) * on),
            boxShadow: `0 0 ${Math.round(12 + 16 * late)}px ${rgba(V.danger, 0.44 * on)}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── LA TAPA DE CHAPA: la pieza que ATRAVIESA la frontera 2. Antes del corte entra desde la derecha y
//    cierra el equipo; después del corte sigue su mismo giro y se abre hacia la izquierda dejando ver
//    el dial del calentador. Es una sola pieza de metal cruzando el corte.
const Tapa: React.FC<{ x: number; ry: number; on: number; w: number; h: number; y: number }> = ({ x, ry, on, w, h, y }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(on),
      transform: `rotateY(${ry.toFixed(2)}deg)`, transformOrigin: "0% 50%",
      background: `linear-gradient(102deg, ${rgba(V.steel, 0.5)} 0%, ${rgba(V.steel, 0.22)} 38%, ${rgba(V.ink1, 0.86)} 100%)`,
      boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.3)}, inset 0 0 60px ${rgba(V.ink0, 0.7)}, 0 20px 60px ${rgba(V.ink0, 0.86)}`,
      borderRadius: 6, overflow: "hidden",
    }}>
      <AbsoluteFill style={{
        opacity: 0.3, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(94deg, rgba(255,255,255,.4) 0 1px, rgba(0,0,0,0) 1px 16px)",
      }} />
      <div style={{
        position: "absolute", left: "8%", top: "50%", width: 46, height: 8, marginTop: -4,
        borderRadius: 5, background: rgba(V.steel, 0.72), boxShadow: `0 2px 8px ${rgba(V.ink0, 0.8)}`,
      }} />
    </div>
  );
};

// ── MEDIDOR DE FLUJO: gráfico puro bajo cada filtro (esto SÍ es un gráfico, no un objeto disfrazado).
const Flujo: React.FC<{ x: number; y: number; w: number; val: number; tint: string; on: number; texto: string }> = ({
  x, y, w, val, tint, on, texto,
}) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, marginLeft: -w / 2,
      opacity: clamp01(on),
    }}>
      <div style={{
        height: 12, borderRadius: 7, background: rgba(V.white, 0.1),
        boxShadow: `inset 0 1px 0 ${rgba(V.ink0, 0.8)}`, overflow: "hidden",
      }}>
        <div style={{
          width: `${(clamp01(val) * 100).toFixed(1)}%`, height: "100%", borderRadius: 7,
          background: `linear-gradient(90deg, ${rgba(tint, 0.5)}, ${rgba(tint, 0.95)})`,
          boxShadow: `0 0 18px ${rgba(tint, 0.5)}`,
        }} />
      </div>
      <div style={{
        marginTop: 8, fontFamily: F_BODY, fontWeight: 700, fontSize: 21, letterSpacing: 2.2,
        color: rgba(V.white, 0.7), textAlign: "center", textShadow: "0 3px 14px rgba(0,0,0,0.9)",
      }}>{texto}</div>
    </div>
  );
};

// ── CORTE DEL TANQUE: el sarro en el fondo del calentador. Esquema, no objeto: contorno + banda.
const Tanque: React.FC<{ x: number; y: number; w: number; h: number; sarro: number; on: number }> = ({
  x, y, w, h, sarro, on,
}) => {
  if (on <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(on),
      borderRadius: `${w / 2}px ${w / 2}px ${w / 2}px ${w / 2}px / 46px 46px 46px 46px`,
      border: `2px solid ${rgba(V.steel, 0.55)}`,
      background: `linear-gradient(180deg, ${rgba(V.ink1, 0.5)} 0%, ${rgba(V.ink0, 0.72)} 100%)`,
      overflow: "hidden",
      boxShadow: `0 18px 46px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.16)}`,
    }}>
      {/* el agua */}
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, ${rgba(V.sky, 0.16)} 0%, ${rgba(V.sky, 0.05)} 70%)`,
      }} />
      {/* la capa de sarro */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: `${(clamp01(sarro) * 38).toFixed(1)}%`,
        background: `linear-gradient(180deg, ${rgba(V.copper, 0.28)} 0%, ${rgba(V.copper, 0.72)} 100%)`,
        boxShadow: `inset 0 2px 0 ${rgba(V.copper, 0.9)}`,
      }}>
        <AbsoluteFill style={{
          opacity: 0.34, mixBlendMode: "overlay",
          backgroundImage: "repeating-radial-gradient(circle at 30% 80%, rgba(255,255,255,.6) 0 2px, rgba(0,0,0,0) 2px 9px)",
        }} />
      </div>
      {/* la resistencia sepultada */}
      <div style={{
        position: "absolute", left: "18%", right: "18%", bottom: `${(clamp01(sarro) * 38 - 4).toFixed(1)}%`,
        height: 6, borderRadius: 4, background: rgba(V.volt, 0.5),
      }} />
    </div>
  );
};

export const MovCeroDolares: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El movimiento entero va en UNA sola <Sequence>: el frame local puede no ser el global.
  const lFrame = useCurrentFrame();
  const off = (gFrame ?? lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = Number.isFinite(gFrame as number)
    ? (gFrame as number)
    : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UN solo viaje: entra desde el patio de noche (z 40), se mete en el armario
  //    (z ≈ −110), sale de golpe al patio con el mismo vector (z +70) y vuelve a acercarse al
  //    contador que sube (z −140). Nunca se teletransporta ni vuelve a cero.
  const camB = gcam(g, { z0: 40, z1: -140, panX: -8, panY: -16, ry: -3.2, rx: 1.2, dur: END });
  const camZ = ip(g,
    [0, 120, 390, 620, 810, 1030, 1170, 1230, 1330, 1470, 1620, 1830, 2040],
    [0, -18, -46, -74, -96, -110, -104, -34, 26, 62, 70, 36, 0]);
  const camY = ip(g, [0, 260, 700, 1230, 1620, 2040], [14, 6, 0, -6, -14, -20]);
  const camTilt = ip(g, [0, 390, 810, 1230, 1620, 2040], [0.9, 0.3, -0.5, -1.6, -2.6, -3.2]);
  const camT = `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translateY(${camY.toFixed(1)}px) rotateX(${camTilt.toFixed(2)}deg)`;
  // la misma deriva, atenuada, para el HUD: el texto no queda pegado con cinta al vidrio
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — EL VIAJE ENTERO: noche de pilotos rojos → linterna del armario → AMANECE ══════════
  const keyFrom = ip(g, [0, 200, 390, 690, 830, 1180, 1260, 1500, 1780, 2040],
    [0.62, 0.55, 0.43, 0.38, 0.36, 0.38, 0.44, 0.48, 0.50, 0.50]);
  const inten = ip(g, [0, 140, 390, 810, 1030, 1230, 1450, 1700, 2040],
    [0.46, 0.62, 0.80, 0.92, 0.94, 0.86, 1.00, 1.10, 1.12]);
  const floor = ip(g, [0, 390, 810, 1230, 1620, 2040], [0.86, 0.80, 0.76, 0.66, 0.50, 0.38]);
  // key: el haz cálido de la linterna se enfría hasta ser la medición, y ésa es la luz del amanecer
  const tintA = light(ip(g, [0, 200, 620, 900, 2040], [0, 0.26, 0.72, 1, 1]), "torch", "volt");
  // contra: el cobre rojizo de los pilotos de standby se abre al cielo del amanecer
  const tintB = light(ip(g, [0, 300, 900, 1300, 1560, 2040], [0, 0.10, 0.34, 0.62, 0.88, 1]), "copper", "sky");

  // ══ EL FONDO — la MISMA foto del patio de g0 a g2040. De noche cerrada a primera luz. Nunca se
  //    desmonta: es la garantía de cobertura a pantalla completa en todos los cuadros.
  const fondoDim = ip(g, [0, 390, 810, 1180, 1330, 1620, 1860, 2040],
    [0.91, 0.89, 0.88, 0.80, 0.60, 0.44, 0.32, 0.26]);
  const fondoScale = ip(g, [0, 810, 1330, 2040], [1.36, 1.30, 1.22, 1.14]);

  // ══ EL ARMARIO — se cierra alrededor de la cámara en la frontera 1 y se abre en la 3 (match-move)
  const closOn = ip(g, [356, 440, 1150, 1290], [0, 0.9, 0.9, 0]);
  const jambaIzq = ip(g, [356, 440, 1150, 1300], [-32, 4.5, 4.5, -46]);
  const jambaDer = ip(g, [356, 440, 1150, 1300], [132, 95.5, 95.5, 146]);
  const dintel = ip(g, [356, 440, 1150, 1300], [-44, -6, -6, -58]);

  // ══ ACTO 1 · el termostato de pared: la tarjeta grande (el gesto) ═════════════════════════════
  const kT = [40, 96, 176, 300, 356, 404, 470, 540];
  const terW = ip(g, kT, [420, 620, 1080, 1220, 1240, 1200, 1120, 1040]);
  const terH = ip(g, kT, [252, 372, 620, 700, 712, 690, 644, 598]);
  const terX = ip(g, kT, [52, 52, 50, 48, 47, 46, 44, 41]);
  const terY = ip(g, kT, [132, 96, 54, 47, 46, 56, 96, 148]);
  const terZ = ip(g, kT, [-210, -170, -80, -18, -8, -46, -120, -230]);
  const terLit = ip(g, [40, 130, 300, 404, 540], [0.24, 0.7, 1, 0.9, 0.5]);
  const terK = Math.max(1.05, ip(g, [40, 176, 300, 404, 540], [520, 1240, 1330, 1300, 1180]) / Math.max(40, terW));

  // ══ EL MARCO QUE CRUZA LA FRONTERA 1 — display circular → cuadro del filtro ═══════════════════
  const kM = [120, 200, 350, 440, 560, 700, 764, 800];
  const mW = ip(g, kM, [120, 330, 330, 1180, 1160, 1120, 1060, 980]);
  const mH = ip(g, kM, [120, 330, 330, 660, 648, 626, 592, 548]);
  const mR = ip(g, kM, [60, 165, 165, 14, 14, 12, 12, 12]);
  const mX = ip(g, kM, [51, 49.5, 47, 43.5, 42.5, 40.5, 38, 33]);
  const mY = ip(g, kM, [47, 45, 41.5, 43, 44, 45, 46.5, 49]);
  const mZ = ip(g, kM, [-90, -30, 24, 52, 44, 30, 8, -34]);
  const mRot = ip(g, kM, [0, 0, 0, -0.8, -1, -1.2, -1.6, -2.4]);
  const mLit = ip(g, [120, 220, 350, 440, 700, 800], [0.3, 0.9, 1, 0.94, 0.9, 0.66]);
  // el color del aro RUEDA de la medición (volt) a la chapa del equipo (steel): el objeto se transforma
  const mAro = light(ip(g, [350, 440], [0, 1]), "volt", "steel");
  // el revelado del filtro: el cuadrado se abre desde el centro, sin una sola opacidad bajando
  const revFiltro = ip(g, [372, 452], [0, 1]);
  // el recorte del material: el marco crece pero la foto NO se re-encuadra (eso ES el match-shape)
  const mK = Math.max(1.05, ip(g, [120, 200, 350, 440, 700, 800], [400, 400, 396, 1300, 1240, 1150]) / Math.max(40, mW));
  const mKfil = Math.max(1.05, ip(g, [372, 452, 700, 800], [1330, 1290, 1230, 1160]) / Math.max(40, mW));

  // ══ ACTO 2 · el filtro limpio que ENTRA en la ranura ══════════════════════════════════════════
  const limW = ip(g, [452, 560, 700, 754, 800], [560, 540, 520, 380, 300]);
  const limH = ip(g, [452, 560, 700, 754, 800], [336, 324, 312, 228, 180]);
  const limX = ip(g, [452, 560, 700, 754, 800], [126, 76, 76, 60, 47]);
  const limY = ip(g, [452, 560, 700, 754, 800], [50, 52, 52, 50, 48]);
  const limZ = ip(g, [452, 560, 700, 754, 800], [-40, 10, 4, -70, -180]);
  const limOn = ip(g, [448, 470], [0, 1]);
  const limK = Math.max(1.05, ip(g, [452, 700, 800], [640, 590, 340]) / Math.max(40, limW));
  const flujoOn = ip(g, [520, 566, 726, 756], [0, 1, 1, 0]);
  const flujoSucio = ip(g, [540, 600], [0.9, 0.41]);
  const flujoLimpio = ip(g, [590, 660], [0.41, 1]);

  // ══ LA TAPA — cruza la frontera 2 y del otro lado sigue girando ═══════════════════════════════
  const tapaX = ip(g, [720, 788, 802, 878, 960], [128, 50, 44, 16, -14]);
  const tapaRy = ip(g, [720, 788, 802, 878, 960], [-6, -2, 4, 46, 78]);
  const tapaOn = ip(g, [714, 744, 930, 968], [0, 1, 1, 0]);
  const tapaW = ip(g, [720, 802, 960], [1180, 1240, 1120]);

  // ══ ACTO 3 · el dial del calentador ═══════════════════════════════════════════════════════════
  const kC = [798, 900, 1030, 1150, 1230, 1310, 1400];
  const calW = ip(g, kC, [1300, 1180, 1120, 940, 640, 400, 280]);
  const calH = ip(g, kC, [740, 672, 638, 536, 366, 230, 162]);
  const calX = ip(g, kC, [54, 50, 47, 40, 26, 8, -18]);
  const calY = ip(g, kC, [46, 45, 45, 42, 34, 26, 20]);
  const calZ = ip(g, kC, [64, 40, 24, -20, -110, -210, -330]);
  const calRot = ip(g, kC, [1.6, 0.6, 0, -1.2, -3, -5, -7]);
  const calLit = ip(g, [798, 900, 1150, 1310, 1400], [0.5, 1, 1, 0.72, 0.4]);
  const calK = Math.max(1.05, ip(g, kC, [1420, 1300, 1240, 1080, 760, 500, 360]) / Math.max(40, calW));
  const tanqueOn = ip(g, [896, 944, 1148, 1188], [0, 1, 1, 0]);
  const tanqueSarro = ipe(g, [944, 1046], [0.08, 1], Easing.out(Easing.cubic));

  // ══ EL DIAL — vive de g852 a g1600 SIN desmontarse: es el objeto que cruza la frontera 3 ══════
  const dSize = ip(g, [852, 906, 1180, 1240, 1310, 1520, 1600], [0, 300, 300, 214, 252, 252, 0]);
  const dX = ip(g, [852, 1180, 1240, 1310, 1600], [66, 66, 72, 75, 78]);
  const dY = ip(g, [852, 1180, 1240, 1310, 1600], [40, 40, 27, 24, 21]);
  const dSpread = ip(g, [852, 900, 1560, 1596], [0, 1, 1, 0.2]);
  const dFrac = ip(g, [852, 906, 966, 1082, 1200, 1300, 1352, 1470, 1600],
    [0.08, 1, 1, 0.62, 0.62, 0.95, 0.95, 0.48, 0.48]);
  const dRoll = ip(g, [1238, 1296], [0, 1]);
  const dValA = g < 1238 ? `${Math.round(ip(g, [962, 1078], [60, 50]))}°` : "50°";
  const dValB = `${Math.round(ip(g, [1348, 1466], [8, 4]))} H`;

  // ══ ACTO 1 · el aro del termostato: el instrumento del gesto uno ══════════════════════════════
  const d1Size = ip(g, [96, 160, 330, 372, 410], [0, 236, 236, 180, 0]);
  const d1Frac = ip(g, [160, 214, 268], [0.34, 0.34, 0.62]);
  const d1Spread = ip(g, [96, 160, 330, 400], [0, 1, 1, 0.1]);

  // ══ ACTO 4 · la piscina: sube al cuadro POR ABAJO mientras la cámara sale del armario ═════════
  const kP = [1150, 1250, 1360, 1520, 1580, 1700, 1860, 2040];
  const pisW = ip(g, kP, [1180, 1220, 1250, 1250, 1256, 1300, 1330, 1340]);
  const pisH = ip(g, kP, [700, 700, 700, 700, 686, 604, 566, 552]);
  const pisX = ip(g, kP, [52, 51, 50.5, 50, 50, 49, 47.5, 46]);
  const pisY = ip(g, kP, [138, 78, 50, 48.5, 48.5, 50, 52, 53.5]);
  const pisZ = ip(g, kP, [-160, -60, 10, 26, 30, 46, 34, 18]);
  const pisRot = ip(g, kP, [0, 0, 0, 0, -0.4, -2.4, -2.8, -3]);
  const pisLit = ip(g, [1150, 1300, 1620, 2040], [0.4, 1, 1, 1]);
  const pisK = Math.max(1.05, ip(g, kP, [1420, 1400, 1370, 1340, 1330, 1420, 1440, 1430]) / Math.max(40, pisW));
  // el clip del agua corre todo el acto 4; MediaCard lo loopea sola (153 cuadros)
  const pisVid = ip(g, [1216, 1246, 1660, 1700], [0, 1, 1, 0]);
  // ⭐ FRONTERA 4 · el revelado del tendedero: el viento barre de izquierda a derecha
  const revSabana = ipe(g, [1580, 1700], [0, 1], Easing.bezier(0.3, 0.62, 0.24, 1));
  // la BANDA DE BRILLO: reflejo horizontal del agua → pliegue iluminado de la sábana
  const bandaY = ip(g, [1300, 1580, 1700, 2040], [58, 57, 49, 46]);
  const bandaH = ip(g, [1300, 1580, 1700, 2040], [26, 30, 88, 104]);
  const bandaRot = ip(g, [1300, 1580, 1700, 2040], [0, 0, -4.2, -5]);
  const bandaA = ip(g, [1250, 1310, 1580, 1700, 1960, 2040], [0, 0.7, 0.78, 0.5, 0.36, 0.3]);
  // la sábana que cruza POR DELANTE del lente (primer plano real, con material real adentro)
  const sabX = ip(g, [1500, 1690], [130, -32]);
  const sabOn = ip(g, [1496, 1520, 1650, 1692], [0, 1, 1, 0]);
  const sabVid = ip(g, [1496, 1522, 1660, 1690], [0, 1, 1, 0]);

  // ══ ACTO 5 · lo que queda quieto: la secadora desconectada ════════════════════════════════════
  const secOn = ip(g, [1780, 1826, 1980, 2020], [0, 1, 1, 0.5]);

  // ══ EL CONTADOR — 70 + 35 + 45 + 40 = 190 kWh. Es el objeto que me llevo al movimiento siguiente:
  //    sube de la esquina al centro y sigue subiendo cuando yo me voy.
  const gesto = [
    ip(g, [236, 268], [0, 1]),
    ip(g, [624, 656], [0, 1]),
    ip(g, [1040, 1072], [0, 1]),
    ip(g, [1440, 1472], [0, 1]),
  ];
  const total = Math.round(
    ipe(g, [240, 300], [0, 70], Easing.out(Easing.cubic)) +
    ipe(g, [628, 688], [0, 35], Easing.out(Easing.cubic)) +
    ipe(g, [1044, 1104], [0, 45], Easing.out(Easing.cubic)) +
    ipe(g, [1444, 1504], [0, 40], Easing.out(Easing.cubic)),
  );
  const cntX = ip(g, [1640, 1780, 1900, 2040], [87, 62, 60, 59]);
  const cntY = ip(g, [1640, 1780, 1900, 2040], [13.5, 40, 34, 28]);
  const cntS = ip(g, [1640, 1780, 1900, 2040], [58, 172, 190, 198]);
  const cntChico = ip(g, [232, 260, 1636, 1672], [0, 1, 1, 0]);
  const cntGrande = ip(g, [1650, 1690], [0, 1]);

  // ══ LA FIRMA DEL VIDEO: las 24 horas. La bomba se muda al SOL, y el amanecer la enciende ═══════
  const sunOn = ip(g, [1276, 1330, 1900, 2040], [0, 0.92, 0.92, 0.7]);
  const sunUse = ipe(g, [1340, 1500], [0.04, 0.55], Easing.out(Easing.cubic));
  const sunY = ip(g, [1276, 1620, 2040], [86, 85, 82]);

  // ══ TEXTOS — UNA idea por acto, cada una viva bastante más que su piso de legibilidad ═════════
  const t1 = ip(g, [112, 138, 336, 360], [0, 1, 1, 0]);
  const t2 = ip(g, [452, 480, 742, 768], [0, 1, 1, 0]);
  const t3 = ip(g, [862, 890, 1152, 1178], [0, 1, 1, 0]);
  const t4 = ip(g, [1284, 1312, 1566, 1592], [0, 1, 1, 0]);
  const t5 = ip(g, [1700, 1732], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y sólo EVOLUCIONA; nunca se remonta entre actos ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════════════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL PATIO: la misma foto de g0 a g2040, de noche cerrada a primera luz ----- */}
        <PhotoPlane src="img/cmeurgente/cmeu_piscina.jpg" kind="photo" z={-700}
          scale={fondoScale} dim={fondoDim} tint={g < 1300 ? V.sky : V.volt} />

        {/* PLANO 2 · el cielo del amanecer subiendo detrás de todo (luz, no objeto) ------------ */}
        <Plane z={-620}>
          <AbsoluteFill style={{
            background: `linear-gradient(184deg, ${rgba(V.sky, ip(g, [1180, 1620, 2040], [0, 0.16, 0.3]))} 0%, rgba(0,0,0,0) 46%)`,
          }} />
          <AbsoluteFill style={{
            background: `radial-gradient(84% 46% at 62% 4%, ${rgba(V.volt, ip(g, [1400, 1800, 2040], [0, 0.1, 0.17]))} 0%, rgba(0,0,0,0) 62%)`,
          }} />
        </Plane>

        {/* PLANO 3 · LOS PILOTOS ROJOS de standby: la materia con la que entro ----------------- */}
        <Plane z={-380}>
          <Pilotos g={g} on={ip(g, [0, 140, 306], [1, 0.92, 0])} />
        </Plane>

        {/* PLANO 4 · EL INTERIOR DEL ARMARIO: se cierra en la frontera 1 y se abre en la 3 ----- */}
        {closOn > 0.01 && (
          <Plane z={-360} style={{ opacity: closOn }}>
            <AbsoluteFill style={{
              background: `radial-gradient(96% 78% at 46% 40%, ${rgba(V.ink2, 0.5)} 0%, ${rgba(V.ink0, 0.94)} 68%)`,
            }} />
          </Plane>
        )}

        {/* PLANO 5 · LA LOSA: el suelo del patio bajo las tarjetas, cuando salimos afuera ------ */}
        {g >= 1180 && (
          <PadPlane y={ip(g, [1180, 1400, 2040], [122, 88, 84])} w={1720} h={400} rx={64}
            lit={ip(g, [1180, 1400, 1800, 2040], [0, 0.5, 0.8, 0.94])} z={-200} />
        )}

        {/* PLANO 6 · ACTO 1 — LA TARJETA DEL TERMOSTATO (el dedo, el gesto que cuesta cero) ---- */}
        {g < 556 && (
          <Plane z={0}>
            <Marco x={terX} y={terY} w={terW} h={terH} z={terZ} ry={ip(g, [40, 300, 540], [7, 1.4, -4])}
              radius={14} lit={terLit} litColor={V.torch}>
              <Mat photo="img/cmeurgente/cmeu_termostato_mano.jpg" w={terW} h={terH} k={terK}
                cx={50 + Math.sin(g / 250) * 3.2} cy={50 + Math.cos(g / 300) * 2.4}
                lit={terLit} litColor={V.torch} sheenAt={L(150)} />
              {/* la luz de la noche entrando por la ventana del pasillo, abajo a la derecha */}
              <AbsoluteFill style={{
                background: `radial-gradient(72% 58% at 78% 108%, ${rgba(V.copper, ip(g, [40, 300, 540], [0.3, 0.14, 0.06]))} 0%, rgba(0,0,0,0) 64%)`,
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 7 · ⭐ EL MARCO QUE CRUZA LA FRONTERA 1 ---------------------------------------
            De g120 a g350 es el DISPLAY CIRCULAR del termostato (macro del mismo material).
            De g350 a g440 se CUADRA y el filtro gris se abre adentro desde el centro.
            De g440 a g830 es la tarjeta del filtro sucio. Un solo elemento, sin cortes.        */}
        {g >= 118 && g < 800 && (
          <Plane z={0}>
            <Marco x={mX} y={mY} w={mW} h={mH} z={mZ} rot={mRot} ry={ip(g, [120, 440, 800], [0, -2, -6])}
              radius={mR} lit={mLit} litColor={mAro}>
              {/* material A: el termostato en macro cerrado (la esfera del display) */}
              <Mat photo="img/cmeurgente/cmeu_termostato_mano.jpg" w={mW} h={mH} k={mK}
                cx={52 + Math.sin(g / 190) * 1.8} cy={44 + Math.cos(g / 230) * 1.4}
                lit={mLit} litColor={V.volt} sheenAt={L(206)} />
              {/* material B: el filtro GRIS, revelado por geometría (el cuadrado abriéndose) */}
              <Reveal p={revFiltro} mode="centro">
                <Mat photo="img/cmeurgente/cmeu_filtro_sucio.jpg" w={mW} h={mH} k={mKfil}
                  cx={50 + Math.sin(g / 220) * 2.6} cy={51 + Math.cos(g / 260) * 2}
                  lit={mLit} litColor={V.steel} sheenAt={L(474)} />
                {/* el polvo asentado: el gris que se ve en la foto, subrayado por la luz rasante */}
                <AbsoluteFill style={{
                  background: `linear-gradient(168deg, ${rgba(V.concrete, 0.24)} 0%, rgba(0,0,0,0) 58%)`,
                  mixBlendMode: "soft-light",
                }} />
              </Reveal>
              {/* el rótulo del material, dentro del vidrio */}
              {g >= 470 && (
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0, padding: "30px 18px 12px",
                  opacity: ip(g, [470, 500, 740, 780], [0, 1, 1, 0]),
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 2.4,
                  color: V.white, textTransform: "uppercase",
                }}>El que estaba puesto</div>
              )}
            </Marco>
          </Plane>
        )}

        {/* PLANO 8 · ACTO 2 — EL FILTRO LIMPIO: entra por geometría y se mete en la ranura ----- */}
        {g >= 446 && g < 800 && (
          <Plane z={0}>
            <Marco x={limX} y={limY} w={limW} h={limH} z={limZ} ry={ip(g, [452, 700, 800], [-14, -9, -2])}
              rot={ip(g, [452, 800], [1.4, -0.4])} radius={12}
              lit={ip(g, [452, 520, 754, 800], [0.5, 1, 1, 0.72])} litColor={V.volt} opacity={limOn}>
              <Mat photo="img/cmeurgente/cmeu_filtro_limpio.jpg" w={limW} h={limH} k={limK}
                cx={50 + Math.sin(g / 210) * 2.2} cy={50 + Math.cos(g / 250) * 1.8}
                lit={1} litColor={V.volt} sheenAt={L(560)} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 14px 10px",
                opacity: ip(g, [500, 530, 720, 756], [0, 1, 1, 0]),
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(8,9,6,0.9) 60%)",
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2.2,
                color: V.white, textTransform: "uppercase",
              }}>El de quince dólares</div>
            </Marco>
          </Plane>
        )}

        {/* PLANO 9 · ACTO 3 — EL DIAL DEL CALENTADOR detrás de su tapa metálica ---------------- */}
        {g >= 798 && g < 1410 && (
          <Plane z={0}>
            <Marco x={calX} y={calY} w={calW} h={calH} z={calZ} rot={calRot}
              ry={ip(g, [798, 1150, 1400], [5, 0, -10])} radius={12} lit={calLit} litColor={V.volt}>
              <Mat photo="img/cmeurgente/cmeu_dial_calentador.jpg" w={calW} h={calH} k={calK}
                cx={50 + Math.sin(g / 240) * 3} cy={50 + Math.cos(g / 285) * 2.2}
                lit={calLit} litColor={V.volt} sheenAt={L(880)} />
              {/* el haz de la linterna cayendo sobre el dial: la luz del armario */}
              <AbsoluteFill style={{
                background: `radial-gradient(52% 42% at 62% 34%, ${rgba(V.torch, ip(g, [798, 950, 1230], [0.1, 0.22, 0.1]))} 0%, rgba(0,0,0,0) 68%)`,
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 10 · ACTO 4/5 — EL AGUA Y LA SÁBANA: una sola tarjeta, dos materiales --------- */}
        {g >= 1146 && (
          <Plane z={0}>
            <Marco x={pisX} y={pisY} w={pisW} h={pisH} z={pisZ} rot={pisRot}
              ry={ip(g, [1150, 1360, 1700, 2040], [4, 0, -2.6, -3.4])}
              radius={14} lit={pisLit} litColor={g < 1650 ? V.sky : V.volt}>
              <Mat photo="img/cmeurgente/cmeu_piscina.jpg" clip="broll/cmeurgente/cmeu_piscina_mov.mp4"
                vid={pisVid} w={pisW} h={pisH} k={pisK}
                cx={50 + Math.sin(g / 260) * 2.6} cy={50 + Math.cos(g / 320) * 2}
                lit={pisLit} litColor={V.sky} sheenAt={L(1300)} />
              {/* ⭐ FRONTERA 4 · la SÁBANA se revela con el viento, de izquierda a derecha */}
              <Reveal p={revSabana} mode="izq">
                <Mat clip="broll/cmeurgente/cmeu_tender_mov.mp4" vid={1}
                  w={pisW} h={pisH} k={Math.max(1.05, ip(g, [1580, 2040], [1420, 1470]) / Math.max(40, pisW))}
                  cx={50 + Math.sin(g / 290) * 2.2} cy={50 + Math.cos(g / 340) * 1.8}
                  lit={1} litColor={V.volt} sheenAt={L(1712)} />
              </Reveal>
              {/* ⭐ LA BANDA DE BRILLO: el reflejo del agua que se vuelve el pliegue de la sábana */}
              {bandaA > 0.01 && (
                <div style={{
                  position: "absolute", left: "-14%", right: "-14%", top: `${bandaY}%`,
                  height: bandaH, marginTop: -bandaH / 2,
                  transform: `rotate(${bandaRot.toFixed(2)}deg)`,
                  background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${rgba(V.white, 0.5 * bandaA)} 42%, ${rgba(V.torch, 0.36 * bandaA)} 58%, rgba(255,255,255,0) 100%)`,
                  mixBlendMode: "screen",
                }} />
              )}
              {/* el amanecer entrando por arriba a la derecha del cuadro, sobre la tela */}
              <AbsoluteFill style={{
                background: `radial-gradient(66% 54% at 74% -6%, ${rgba(V.volt, ip(g, [1620, 1860, 2040], [0.06, 0.16, 0.2]))} 0%, rgba(0,0,0,0) 66%)`,
              }} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 11 · ACTO 5 — EL PATIO EN LA PRIMERA LUZ, al fondo a la izquierda ------------- */}
        {g >= 1738 && (
          <Plane z={-90}>
            <Marco x={ip(g, [1738, 1900, 2040], [-8, 16, 19])} y={ip(g, [1738, 2040], [66, 63])}
              w={420} h={252} z={-70} ry={13} rot={2}
              radius={10} lit={ip(g, [1738, 1800, 2040], [0.3, 0.86, 0.96])} litColor={V.sky}>
              <Mat photo="img/cmeurgente/cmeu_piscina.jpg" w={420} h={252} k={1.5}
                cx={38} cy={54} lit={0.94} litColor={V.sky} sheenAt={L(1808)} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 12 · GRÁFICOS DE ESCENA (esto SÍ son gráficos: barras, corte, esquema) -------- */}
        {flujoOn > 0.01 && (
          <Plane z={70}>
            <Flujo x={38} y={71} w={430} val={flujoSucio} tint={V.copper} on={flujoOn} texto="AIRE QUE PASA" />
            <Flujo x={76} y={71} w={330} val={flujoLimpio} tint={V.volt} on={flujoOn} texto="AIRE QUE PASA" />
          </Plane>
        )}
        {tanqueOn > 0.01 && (
          <Plane z={60}>
            <Tanque x={17} y={54} w={210} h={430} sarro={tanqueSarro} on={tanqueOn} />
            <div style={{
              position: "absolute", left: "17%", top: "80%", width: 260, marginLeft: -130,
              textAlign: "center", opacity: tanqueOn,
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3,
              color: rgba(V.copper, 0.95), textTransform: "uppercase",
              textShadow: "0 4px 18px rgba(0,0,0,0.94)",
            }}>Sarro</div>
          </Plane>
        )}

        {/* PLANO 13 · EL DIAL — acto 1 (termostato) y acto 3→4 (calentador → temporizador) ----- */}
        <Plane z={90}>
          <Dial x={ip(g, [96, 300, 410], [51, 47.5, 46])} y={ip(g, [96, 300, 410], [46.5, 41.5, 40])}
            size={d1Size} z={20} frac={d1Frac} spread={d1Spread} tint={V.volt}
            a={`${Math.round(ip(g, [212, 268], [22, 25]))}°`} b="25°" p={0}
            la="GRADOS" lb="GRADOS" />
          <Dial x={dX} y={dY} size={dSize} z={30} frac={dFrac} spread={dSpread} tint={V.volt}
            a={dValA} b={dValB} p={dRoll}
            la="GRADOS" lb="HORAS AL DÍA" />
        </Plane>

        {/* PLANO 14 · LA TAPA DE CHAPA: el objeto que atraviesa la frontera 2 ------------------ */}
        <Plane z={150}>
          <Tapa x={tapaX} y={48} w={tapaW} h={780} ry={tapaRy} on={tapaOn} />
        </Plane>

        {/* PLANO 15 · PRIMER PLANO — la jamba del armario y la sábana pasan POR DELANTE -------- */}
        {closOn > 0.01 && (
          <Plane z={250} style={{ opacity: closOn }}>
            <div style={{
              position: "absolute", left: `${jambaIzq}%`, top: "-14%", width: 240, height: "128%",
              marginLeft: -120,
              background: `linear-gradient(92deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.ink2, 0.9)} 72%, ${rgba(V.steel, 0.24)} 100%)`,
              boxShadow: `18px 0 60px ${rgba(V.ink0, 0.9)}`,
            }} />
            <div style={{
              position: "absolute", left: `${jambaDer}%`, top: "-14%", width: 240, height: "128%",
              marginLeft: -120,
              background: `linear-gradient(268deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.ink2, 0.9)} 72%, ${rgba(V.steel, 0.24)} 100%)`,
              boxShadow: `-18px 0 60px ${rgba(V.ink0, 0.9)}`,
            }} />
            <div style={{
              position: "absolute", left: "-10%", right: "-10%", top: `${dintel}%`, height: 210,
              background: `linear-gradient(178deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.ink2, 0.86)} 68%, ${rgba(V.steel, 0.2)} 100%)`,
              boxShadow: `0 20px 64px ${rgba(V.ink0, 0.9)}`,
            }} />
          </Plane>
        )}
        {sabOn > 0.01 && (
          <Plane z={300}>
            <Marco x={sabX} y={ip(g, [1500, 1690], [46, 54])} w={460} h={1180}
              z={40} rot={ip(g, [1500, 1690], [5, -3])} ry={ip(g, [1500, 1690], [-16, 14])}
              radius={10} lit={1} litColor={V.torch} opacity={sabOn}>
              <Mat clip="broll/cmeurgente/cmeu_tender_mov.mp4" vid={sabVid}
                w={460} h={1180} k={1.32} cx={50} cy={50} lit={1} litColor={V.torch} />
            </Marco>
          </Plane>
        )}

        {/* PLANO 16 · ÍCONOS PNG como objetos de la escena, con su propio parallax ------------- */}
        {g >= 160 && g < 340 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_termometro.png" x={80} y={30}
              size={ip(g, [160, 200], [72, 128])} z={0}
              opacity={ip(g, [160, 196, 306, 338], [0, 0.95, 0.95, 0])}
              rot={ip(g, [160, 338], [-9, 5])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 520 && g < 720 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_nube.png" x={22} y={28}
              size={ip(g, [520, 570], [78, 136])} z={0}
              opacity={ip(g, [520, 566, 686, 718], [0, 0.9, 0.9, 0])}
              rot={ip(g, [520, 718], [7, -5])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 900 && g < 1120 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_calentador.png" x={84} y={68}
              size={ip(g, [900, 950], [80, 132])} z={0}
              opacity={ip(g, [900, 946, 1086, 1118], [0, 0.92, 0.92, 0])}
              rot={ip(g, [900, 1118], [-6, 4])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1330 && g < 1540 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_sol.png" x={17} y={24}
              size={ip(g, [1330, 1386], [76, 142])} z={0}
              opacity={ip(g, [1330, 1380, 1504, 1538], [0, 0.94, 0.94, 0])}
              rot={ip(g, [1330, 1538], [-8, 6])} glow={V.ink0} />
          </Plane>
        )}
        {secOn > 0.01 && (
          <Plane z={130}>
            <IconPng src="img/cmeurgente/cmeu_ic_enchufe.png" x={84} y={70}
              size={ip(g, [1780, 1850], [72, 118])} z={0} opacity={0.5 * secOn}
              rot={ip(g, [1780, 2040], [9, -4])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ COSTURA · FRONTERA 2 (g810) — OCLUSIÓN con la CHAPA del equipo ════════════════ */}
      <SeamOcclude at={L(788)} dur={30} color={V.steel} angle={6} lit={0.30} />

      {/* ══════ LA FIRMA: LAS 24 HORAS DEL DÍA — la bomba se muda adentro del sol ═════════════ */}
      {sunOn > 0.01 && (
        <SunField sun={7 / 24} from={9} cells={24} on={sunOn} use={sunUse}
          tint={V.volt} night={V.sky} y={sunY} w={1180} h={40} cycle={210} />
      )}

      {/* ══════ HUD — texto y cifras en espacio de pantalla, con la deriva de la cámara ═══════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* EL ESCALÓN UNO: cuatro gestos, cuatro pastillas, y el contador que las suma */}
        {cntChico > 0.01 && (
          <div style={{
            position: "absolute", left: "87%", top: "13.5%", transform: "translate(-50%,-50%)",
            textAlign: "center", opacity: cntChico,
          }}>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 25, letterSpacing: 3.4,
              color: rgba(V.white, 0.78), textTransform: "uppercase",
              textShadow: "0 4px 18px rgba(0,0,0,0.94)",
            }}>Escalón uno</div>
            <div style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 58, lineHeight: 1, marginTop: 4,
              color: V.volt, textShadow: `0 0 24px ${rgba(V.volt, 0.36)}, 0 5px 22px rgba(0,0,0,0.94)`,
            }}>{total}<span style={{ fontSize: 24, marginLeft: 7, color: rgba(V.volt, 0.8) }}>kWh</span></div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
              {gesto.map((p, i) => (
                <div key={i} style={{
                  width: 44, height: 7, borderRadius: 4,
                  background: rgba(V.volt, 0.14 + 0.78 * p),
                  boxShadow: p > 0.5 ? `0 0 14px ${rgba(V.volt, 0.5 * p)}` : "none",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* EL AHORRO DE CADA GESTO, en ámbar (el dinero que deja de irse) */}
        {g >= 240 && g < 348 && (
          <Readout value="-70" unit="kWh" label="AL MES" at={L(244)} x={22} y={22} size={92} color={V.amber} />
        )}
        {g >= 628 && g < 740 && (
          <Readout value="-35" unit="kWh" label="AL MES" at={L(632)} x={22} y={22} size={92} color={V.amber} />
        )}
        {g >= 1044 && g < 1150 && (
          <Readout value="-45" unit="kWh" label="AL MES" at={L(1048)} x={68} y={72} size={92} color={V.amber} />
        )}
        {g >= 1444 && g < 1566 && (
          <Readout value="-40" unit="kWh" label="AL MES" at={L(1448)} x={24} y={70} size={92} color={V.amber} />
        )}

        {/* ⭐ EL CONTADOR QUE SUBE — se va de la esquina, crece y sigue subiendo cuando yo me voy */}
        {cntGrande > 0.01 && (
          <div style={{ opacity: cntGrande }}>
            <div style={{
              position: "absolute", left: `${cntX}%`, top: `${cntY}%`,
              width: cntS * 4.4, height: cntS * 2.6, marginLeft: -cntS * 2.2, marginTop: -cntS * 1.3,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <div style={{
              position: "absolute", left: `${cntX}%`, top: `${cntY}%`, transform: "translate(-50%,-50%)",
              textAlign: "center", whiteSpace: "nowrap",
            }}>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 700, fontSize: Math.round(cntS * 0.2),
                letterSpacing: 3.6, color: rgba(V.white, 0.7), textTransform: "uppercase",
                marginBottom: 6, textShadow: "0 4px 18px rgba(0,0,0,0.94)",
              }}>Menos, cada mes</div>
              <div style={{
                fontFamily: F_DISPLAY, fontWeight: 800, fontSize: cntS, lineHeight: 0.92, color: V.volt,
                textShadow: `0 0 ${Math.round(cntS * 0.42)}px ${rgba(V.volt, 0.4)}, 0 6px 26px rgba(0,0,0,0.94)`,
              }}>
                {total}
                <span style={{ fontSize: Math.round(cntS * 0.32), marginLeft: 10, color: rgba(V.volt, 0.84) }}>kWh</span>
              </div>
            </div>
          </div>
        )}

        {/* ACTO 1 · TRES GRADOS ARRIBA */}
        {t1 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "72%", opacity: t1, transform: `translateY(${((1 - t1) * 22).toFixed(1)}px)` }}>
            <Bed w={700} pad={24}>
              <Kick color={V.volt}>Gesto uno · cero dólares</Kick>
              <div style={{ height: 6 }} />
              <Head size={70}>TRES GRADOS ARRIBA</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Nadie en la casa se quejó <Em>en toda la tarde</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · EL FILTRO ESTABA GRIS */}
        {t2 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "9%", opacity: t2, transform: `translateY(${((1 - t2) * -22).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.volt}>Gesto dos · quince dólares</Kick>
              <div style={{ height: 6 }} />
              <Head size={70}>EL FILTRO ESTABA GRIS</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>El equipo empujaba contra <Em>una pared de polvo</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · DE SESENTA A CINCUENTA */}
        {t3 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "70%", opacity: t3, transform: `translateY(${((1 - t3) * 22).toFixed(1)}px)` }}>
            <Bed w={720} pad={24}>
              <Kick color={V.volt}>Gesto tres · cero dólares</Kick>
              <div style={{ height: 6 }} />
              <Head size={70}>DE SESENTA A CINCUENTA</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>El agua sigue saliendo caliente. <Em>Nadie lo notó.</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · DE OCHO HORAS A CUATRO */}
        {t4 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "10%", opacity: t4, transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)` }}>
            <Bed w={740} pad={24}>
              <Kick color={V.volt}>Gesto cuatro · cero dólares</Kick>
              <div style={{ height: 6 }} />
              <Head size={68}>DE OCHO HORAS A CUATRO</Head>
              <div style={{ height: 8 }} />
              <Body size={31}>Y al <Em>mediodía</Em>, cuando hay sol de sobra</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · CIENTO NOVENTA. CERO DÓLARES. */}
        {t5 > 0.01 && (
          <div style={{ position: "absolute", left: "6%", top: "68%", opacity: t5, transform: `translateY(${((1 - t5) * 26).toFixed(1)}px)` }}>
            <Bed w={780} pad={26}>
              <Kick color={V.amber}>Los cuatro juntos</Kick>
              <div style={{ height: 8 }} />
              <Head size={76}>CIENTO NOVENTA. <Em color={V.amber}>CERO DÓLARES.</Em></Head>
              <div style={{ height: 10 }} />
              <Body size={31}>La secadora quieta y el sol haciendo el trabajo</Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* viñeta: cerrada de noche, abierta al amanecer (la luz respira con el movimiento) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(126% 106% at 50% 46%, rgba(0,0,0,0) ${ip(g, [0, 1230, 2040], [40, 50, 58]).toFixed(0)}%, rgba(6,7,5,${ip(g, [0, 810, 1620, 2040], [0.62, 0.54, 0.36, 0.26]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
