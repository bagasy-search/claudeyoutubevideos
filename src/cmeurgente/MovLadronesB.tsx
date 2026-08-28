// MovLadronesB.tsx — S6 · UN MOVIMIENTO CONTINUO de 66 s (1980 frames @30fps)
// Canal "Claudio Mendoza Constructor" · video `cmeurgente` · arranca en el segundo 740,0.
//
// LA ESPINA: los otros tres ladrones. La bomba de la piscina programada hace siete años, los diez
// halógenos del garaje, y los cuarenta y un vatios de aparatos APAGADOS que nadie ve. El remate:
// todo lo demás junto —refrigerador, cocina, lavadora, tele— pesa sesenta y cinco vatios. Una
// plaquita al lado de las torres. La sección entera se mide con UN SOLO OBJETO: EL DISCO.
//
// ⭐ EL OBJETO QUE CRUZA TODAS LAS FRONTERAS ES **EL DISCO**. Nace como el disco amarillento del
//    temporizador mecánico de la bomba (con sus veinticuatro pestañas y ocho hundidas), se da vuelta
//    como una moneda y sale del otro lado convertido en el FOCO HALÓGENO, crece hasta tapar el
//    cuadro entero con materia real, se apaga y queda como el EJE del que salen orbitando los cinco
//    fantasmas, se encoge hasta ser UN PILOTO ROJO de standby, y termina siendo EL PUNTO que corona
//    la barra minúscula de los sesenta y cinco vatios. Una sola forma, cinco roles.
//
// ⚠️ A partir de este tramo el avatar va EN BUCLE Y MUTEADO: NO hay fondo garantizado debajo. Este
//    archivo cubre el cuadro entero, sin un solo frame transparente (raíz opaca en V.ink0).
//
// ╔════════════════════════════════════════════════════════════════════════════════════════════╗
// ║ TABLA DE HANDOFF — el acto N+1 arranca EXACTAMENTE en el "SALE" del acto N                 ║
// ╠════╦════════════════════════════════════════╦══════════════════════════════════════════════╣
// ║ AC ║ ENTRA: encuadre + luz + objeto         ║ SALE: encuadre + luz + objeto                ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 1  ║ CÁM: cerrada dentro del armario del    ║ CÁM: sigue empujando hacia adelante (z −300  ║
// ║ g0 ║   calentador, z −300, panY −12, todo   ║   → −250) y bajando apenas. NO frena en la   ║
// ║    ║   negro alrededor. Viene de LadronesA. ║   frontera: la atraviesa.                    ║
// ║    ║ LUZ: LINTERNA EN EL ARMARIO. V.torch   ║ LUZ: torch pleno, keyFrom 0,42→0,52, inten   ║
// ║    ║   puntual, floor 0,80, inten 0,62.     ║   0,62→0,96. Empieza a entrar el garaje.     ║
// ║    ║ MAT: LA CHAPA DEL TANQUE del           ║ MAT: EL DISCO del temporizador, ya grande y  ║
// ║    ║   calentador, pegada al lente, que se  ║   centrado, girando sobre su eje: el canto   ║
// ║    ║   corre y descubre la bomba.           ║   de la moneda ya se ve.                     ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 2  ║ CÁM: misma inercia hacia adelante; el  ║ CÁM: z ≈ −104, ya retrocediendo y girando a  ║
// ║g420║   disco tapa el cuadro (z +160).       ║   la izquierda hacia el negro.               ║
// ║    ║ LUZ: torch cálido del halógeno         ║ LUZ: keyFrom 0,58→0,34: la linterna cede y   ║
// ║    ║   encendido, inten 0,96 → 1,02.        ║   entra la luz volt de la medición.          ║
// ║    ║ MAT: EL DISCO, ya del otro lado de la  ║ MAT: EL DISCO encogido en la mano, apagado,  ║
// ║    ║   moneda: la foto del garaje, que se   ║   viajando al centro. La ESCALERA DE         ║
// ║    ║   encoge hasta ser UN foco de diez.    ║   ALUMINIO ya está entrando por la derecha.  ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 3  ║ CÁM: z ≈ −104 retrocediendo, negro     ║ CÁM: empieza el TRAVELLING lateral: paneo    ║
// ║g780║   puro alrededor.                      ║   −186 px hacia la izquierda, ry −3,4.       ║
// ║    ║ LUZ: laboratorio: volt duro, keyFrom   ║ LUZ: volt → copper (keyFrom 0,30→0,44): la   ║
// ║    ║   0,34→0,30, floor 0,78.               ║   brasa roja de los pilotos empieza a ganar. ║
// ║    ║ MAT: EL DISCO apagado como EJE; de él  ║ MAT: EL DISCO ya es un PILOTO ROJO y viaja   ║
// ║    ║   salen orbitando los cinco fantasmas. ║   con la cámara; las cinco tarjetas salen    ║
// ║    ║                                        ║   por izquierda con su mismo vector.         ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 4  ║ CÁM: en pleno travelling lateral, la   ║ CÁM: frena el paneo y RETROCEDE (z −92 →     ║
// ║g1260║  misma velocidad, sin corte.          ║   −44) abriendo hacia el patio.              ║
// ║    ║ LUZ: copper de los pilotos, keyFrom    ║ LUZ: keyFrom 0,44→0,70, inten 0,72→0,52: la  ║
// ║    ║   0,44, inten 0,72.                    ║   linterna SE APAGA, queda la brasa.         ║
// ║    ║ MAT: el living a oscuras (clip real)   ║ MAT: EL PILOTO ROJO baja a la derecha        ║
// ║    ║   entrando por derecha + los pilotos.  ║   conservando su círculo exacto.             ║
// ╠════╬════════════════════════════════════════╬══════════════════════════════════════════════╣
// ║ 5  ║ CÁM: retrocediendo y subiendo, se      ║ CÁM: ABIERTA sobre la casa entera de noche   ║
// ║g1620║  abre el patio bajo los pies.         ║   desde el patio. z +40, panY +14. (= el     ║
// ║    ║ LUZ: noche, sólo la brasa de los       ║   encuadre con el que abre MovCeroDolares.)  ║
// ║    ║   pilotos, floor 0,66.                 ║ LUZ: noche con pilotos rojos como única luz  ║
// ║    ║ MAT: EL PILOTO ROJO convertido en el   ║   viva. inten 0,46, tint copper.             ║
// ║    ║   punto que corona la barra de 65.     ║ MAT: EL AGUA DE LA PISCINA en primer plano,  ║
// ║    ║                                        ║   con la bomba en su rincón.                 ║
// ╚════╩════════════════════════════════════════╩══════════════════════════════════════════════╝
//
// COSTURAS — una distinta por frontera, ninguna es un fundido, ninguna baja un opacity a 0:
//   g420  1→2  MATCH-SHAPE   — EL DISCO se da vuelta como una moneda: scaleX(cos θ) de +1 a −1.
//                              En el instante θ=90° el disco está DE PERFIL (una línea de canto
//                              iluminado) y ahí, y sólo ahí, cambia la cara: adelante el disco
//                              amarillento del temporizador, atrás la foto del garaje. Acto
//                              seguido la MISMA forma crece a 3400 px y TAPA el cuadro con materia
//                              real (es su propio occluder), y detrás ya está el garaje. Sale
//                              encogiéndose hasta ser uno de los diez focos. Cero fundido: en el
//                              cambio de cara la forma mide 5 % de ancho.
//   g780  2→3  OCLUSIÓN      — <SeamOcclude color={V.steel}> (materia: aluminio, lit por defecto)
//                              + mi ESCALERA DE ALUMINIO real (largueros y peldaños) cruzando en
//                              primer plano a z +300. Detrás ya está el negro del laboratorio con
//                              el disco apagado en el centro. El disco CRUZA la escalera.
//   g1260 3→4  MATCH-MOVE    — la cámara no corta: arranca un travelling lateral (camPan 0 →
//                              −186 px, ry 0 → −3,4) y el mundo cambia debajo. Las cinco tarjetas
//                              salen por izquierda con ese mismo vector y el living entra por
//                              derecha con el vector opuesto. Ni un frame de negro pleno.
//   g1620 4→5  MATCH-SHAPE   — el PILOTO ROJO no se apaga ni se desmonta: conserva su círculo
//                              exacto y baja a la esquina de la barra de sesenta y cinco, donde
//                              se convierte en el PUNTO que la corona. La barra crece DESDE él.
//
// ⛔ CONTRATO: NINGUNA secuencia de Remotion envolviendo un acto (el reloj es UNO: `g`) · cero
// ⛔ azar y cero reloj de sistema: todo sale de rnd(k) y de g · rutas de asset LITERALES, sólo las de la ficha ·
// ⛔ sin position:fixed · como mucho dos capas con blur · todo texto sobre <Bed>, titular ≥48 px.
// ⚠️ Todo componente del Stage que razona en frames LOCALES (`at`, `sheenAt`) se traduce con L().

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, rnd, rgba, gcam, light,
  VoltAtmos, SunField, RoofPlane, PadPlane, Layers, Plane,
  MediaCard, Carousel3D, PhotoPlane, IconPng, Readout, SeamOcclude,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

const END = 1980;
const A2 = 420;
const A3 = 780;
const A4 = 1260;
const A5 = 1620;

const ip = (x: number, ins: number[], outs: number[]) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ipe = (x: number, ins: number[], outs: number[], easing: (n: number) => number) =>
  interpolate(x, ins, outs, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const miles = (n: number) => {
  const s = String(Math.max(0, Math.round(n)));
  return s.length > 3 ? s.slice(0, s.length - 3) + "." + s.slice(s.length - 3) : s;
};

// ════════════════════════════════════════════════════════════════════════════════════════════
// ⭐ EL DISCO — el objeto protagonista del movimiento entero. Una sola forma, cinco roles.
//    Adentro va SIEMPRE material real (la foto del temporizador de un lado, la del garaje del
//    otro). El giro es un scaleX(cos θ): a 90° el disco mide 5 % de ancho — ahí, y sólo ahí,
//    cambia la cara. No hay un solo frame de opacidad bajando.
// ════════════════════════════════════════════════════════════════════════════════════════════
const Disco: React.FC<{
  x: number; y: number; size: number; z: number;
  flip: number;          // 0 → cara temporizador · 1 → cara garaje (media vuelta)
  ry: number;
  lit: number; litColor: string;
  tabs: number;          // 0..1 · el anillo de 24 pestañas del temporizador
  glow: number;          // 0..1 · el halo del halógeno encendido
  core: number;          // 0..1 · la brasa roja del piloto de standby en el centro
  dark: number;          // 0..1 · cuánto se apaga el material de adentro
  sheen: number;         // frame LOCAL del barrido especular
  g: number;
}> = ({ x, y, size, z, flip, ry, lit, litColor, tabs, glow, core, dark, sheen, g }) => {
  const s = Math.max(10, size);
  if (s < 12) return null;
  const c = Math.cos(clamp01(flip) * Math.PI);
  const cara = c >= 0 ? 0 : 1;
  const sx = Math.max(0.05, Math.abs(c));
  const canto = clamp01(1 - Math.abs(c) / 0.36);       // el canto de la moneda, de perfil
  const k = 1.36;                                       // el material desborda el círculo
  const mat = s * k;
  const respira = 1 + Math.sin(g / 71) * 0.006;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: s, height: s,
      marginLeft: -s / 2, marginTop: -s / 2,
      transform: `translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${respira.toFixed(4)})`,
      transformStyle: "preserve-3d",
    }}>
      {/* HALO: el halógeno encendido derrama luz sobre la escena (no es un flash: es una lámpara) */}
      {glow > 0.01 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: s * 2.6, height: s * 2.6,
          marginLeft: -s * 1.3, marginTop: -s * 1.3, borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, ${rgba(V.torch, 0.30 * glow)} 0%, ${rgba(V.amber, 0.15 * glow)} 34%, rgba(0,0,0,0) 68%)`,
        }} />
      )}
      {/* LA BRASA ROJA: el piloto de standby, cuando el disco ya es eso */}
      {core > 0.01 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: s * 2.1, height: s * 2.1,
          marginLeft: -s * 1.05, marginTop: -s * 1.05, borderRadius: "50%", pointerEvents: "none",
          background: `radial-gradient(circle, ${rgba(V.copper, 0.42 * core)} 0%, rgba(0,0,0,0) 62%)`,
        }} />
      )}

      {/* EL CUERPO QUE GIRA: acá vive el scaleX del volteo de moneda */}
      <div style={{
        position: "absolute", inset: 0, transform: `scaleX(${sx.toFixed(4)})`,
        transformStyle: "preserve-3d",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
          boxShadow:
            `inset 0 2px 0 ${rgba(V.white, 0.24 * lit)}, ` +
            `inset 0 0 ${Math.round(s * 0.34)}px ${rgba(V.ink0, 0.62)}, ` +
            `0 ${Math.round(s * 0.10)}px ${Math.round(s * 0.20)}px ${rgba(V.ink0, 0.78)}`,
          border: `${Math.max(1, Math.round(s * 0.012))}px solid ${rgba(litColor, 0.30 * lit)}`,
        }}>
          {cara === 0 ? (
            <MediaCard src="img/cmeurgente/cmeu_temporizador_viejo.jpg" kind="photo"
              w={mat} h={mat} x={50} y={50} z={0} radius={0}
              lit={lit} litColor={litColor} sheenAt={sheen} />
          ) : (
            <MediaCard src="img/cmeurgente/cmeu_halogenos.jpg" kind="photo"
              w={mat} h={mat} x={50} y={50} z={0} radius={0}
              lit={lit} litColor={litColor} sheenAt={sheen} />
          )}
          {/* el material se apaga sin desmontarse: el disco se vuelve un objeto negro con brasa */}
          {dark > 0.01 && (
            <div style={{ position: "absolute", inset: 0, background: rgba(V.ink0, 0.94 * dark) }} />
          )}
          {/* el filamento del halógeno, encendido DENTRO del vidrio */}
          {glow > 0.02 && (
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 50% 46%, ${rgba(V.torch, 0.72 * glow)} 0%, ${rgba(V.amber, 0.30 * glow)} 22%, rgba(0,0,0,0) 56%)`,
            }} />
          )}
          {/* la brasa en el centro del disco: el piloto rojo propiamente dicho */}
          {core > 0.02 && (
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              width: Math.max(4, s * 0.30), height: Math.max(4, s * 0.30),
              marginLeft: -Math.max(4, s * 0.30) / 2, marginTop: -Math.max(4, s * 0.30) / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rgba(V.torch, 0.92 * core)} 0%, ${rgba(V.copper, 0.95 * core)} 38%, ${rgba(V.copper, 0.1 * core)} 100%)`,
              boxShadow: `0 0 ${Math.round(Math.max(8, s * 0.5))}px ${rgba(V.copper, 0.66 * core)}`,
            }} />
          )}
        </div>

        {/* EL ANILLO DE LAS VEINTICUATRO PESTAÑAS — ocho hundidas: las ocho horas de la bomba */}
        {tabs > 0.01 && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: clamp01(tabs) }}>
            {Array.from({ length: 24 }, (_, i) => {
              const puesta = i >= 9 && i < 17;             // 9 a 17 = las ocho horas programadas
              const ang = (i / 24) * 360;
              const largo = puesta ? s * 0.13 : s * 0.075;
              const ancho = Math.max(2, s * 0.020);
              const nace = clamp01((tabs - i / 46) * 4);
              return (
                <div key={i} style={{
                  position: "absolute", left: "50%", top: "50%", width: ancho, height: largo,
                  marginLeft: -ancho / 2, marginTop: -largo / 2, borderRadius: ancho,
                  transformOrigin: "50% 50%",
                  transform: `rotate(${ang}deg) translateY(${(-s * 0.455).toFixed(1)}px) scaleY(${nace.toFixed(3)})`,
                  background: puesta ? rgba(V.volt, 0.88) : rgba(V.bone, 0.34),
                  boxShadow: puesta ? `0 0 ${Math.round(s * 0.06)}px ${rgba(V.volt, 0.6)}` : "none",
                }} />
              );
            })}
          </div>
        )}
      </div>

      {/* EL CANTO: cuando el disco pasa de perfil, lo único que queda es su borde tomando la luz */}
      {canto > 0.01 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: Math.max(5, s * 0.045), height: s * 0.98,
          marginLeft: -Math.max(5, s * 0.045) / 2, marginTop: -s * 0.49,
          borderRadius: s, opacity: canto, pointerEvents: "none",
          background: `linear-gradient(180deg, ${rgba(V.white, 0.10)} 0%, ${rgba(V.torch, 0.86)} 42%, ${rgba(V.white, 0.14)} 100%)`,
          boxShadow: `0 0 ${Math.round(s * 0.14)}px ${rgba(V.torch, 0.5)}`,
        }} />
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
// LOS DIEZ HALÓGENOS — esto SÍ es un gráfico (un conteo), no un objeto real disfrazado: diez
// filamentos que se encienden uno por uno sobre una línea de techo.
// ════════════════════════════════════════════════════════════════════════════════════════════
const Filamentos: React.FC<{ x: number; y: number; on: number; w: number; g: number; lit: number }> = ({
  x, y, on, w, g, lit,
}) => {
  if (lit <= 0.01) return null;
  const n = 10;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: 78,
      marginLeft: -w / 2, marginTop: -39, opacity: clamp01(lit), pointerEvents: "none",
    }}>
      {/* el riel del techo del garaje */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 8, height: 3, borderRadius: 2,
        background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.steel, 0.42)} 12%, ${rgba(V.steel, 0.42)} 88%, rgba(0,0,0,0))`,
      }} />
      {Array.from({ length: n }, (_, i) => {
        const enc = clamp01((on - i) * 1.4);
        const late = 0.86 + Math.sin(g / (13 + rnd(i * 4.4) * 9) + i) * 0.14 * enc;
        const d = 26;
        return (
          <div key={i} style={{ position: "absolute", left: `${(i + 0.5) * (100 / n)}%`, top: 8 }}>
            {/* el portalámparas */}
            <div style={{
              position: "absolute", left: -5, top: 0, width: 10, height: 14, marginLeft: 0,
              background: rgba(V.steel, 0.5), borderRadius: 2,
            }} />
            {/* la ampolla */}
            <div style={{
              position: "absolute", left: -d / 2, top: 12, width: d, height: d, borderRadius: "50%",
              background: `radial-gradient(circle at 50% 40%, ${rgba(V.torch, 0.28 + 0.68 * enc * late)} 0%, ${rgba(V.amber, 0.16 + 0.5 * enc * late)} 46%, ${rgba(V.ink2, 0.78)} 100%)`,
              boxShadow: enc > 0.05
                ? `0 0 ${Math.round(14 + 30 * enc * late)}px ${rgba(V.amber, 0.52 * enc * late)}, inset 0 1px 0 ${rgba(V.white, 0.4)}`
                : `inset 0 1px 0 ${rgba(V.white, 0.12)}`,
              border: `1px solid ${rgba(V.bone, 0.18 + 0.2 * enc)}`,
            }} />
            {/* el filamento */}
            <div style={{
              position: "absolute", left: -1, top: 12 + d * 0.34, width: 2, height: d * 0.32,
              background: rgba(V.torch, 0.2 + 0.8 * enc * late),
              boxShadow: `0 0 ${Math.round(6 + 12 * enc)}px ${rgba(V.torch, 0.7 * enc)}`,
            }} />
          </div>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
// LA ESCALERA DE ALUMINIO — la materia que cruza en la frontera 2. Va en PRIMER PLANO (z +300),
// por delante de todo, acompañando al <SeamOcclude color={V.steel}>.
// ════════════════════════════════════════════════════════════════════════════════════════════
const Escalera: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-128, 132, p);
  const env = Math.sin(clamp01(p) * Math.PI);
  const largRail = (top: string) => (
    <div style={{
      position: "absolute", left: 0, right: 0, top,
      height: 46, borderRadius: 6,
      background: `linear-gradient(180deg, ${rgba(V.steel, 0.24)} 0%, ${rgba(V.blade, 0.62)} 18%, ${rgba(V.steel, 0.30)} 52%, ${rgba(V.ink2, 0.86)} 100%)`,
      boxShadow: `0 10px 30px ${rgba(V.ink0, 0.8)}, inset 0 1px 0 ${rgba(V.white, 0.5)}`,
    }} />
  );
  return (
    <div style={{
      position: "absolute", top: "-34%", left: `${x.toFixed(1)}%`, width: "104%", height: "168%",
      transform: "rotate(-12deg)", pointerEvents: "none", opacity: 0.35 + 0.65 * env,
    }}>
      {largRail("22%")}
      {largRail("64%")}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${6 + i * 14}%`, top: "24%", width: 28, height: "42%",
          borderRadius: 4,
          background: `linear-gradient(90deg, ${rgba(V.blade, 0.5)} 0%, ${rgba(V.steel, 0.26)} 50%, ${rgba(V.ink2, 0.8)} 100%)`,
          boxShadow: `inset 0 0 0 1px ${rgba(V.white, 0.16)}`,
        }} />
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
// PILOTO DE STANDBY — la brasa roja. Gráfico puro (una luz es una luz), con respiración propia.
// ════════════════════════════════════════════════════════════════════════════════════════════
const Piloto: React.FC<{ x: number; y: number; size: number; on: number; seed: number; g: number }> = ({
  x, y, size, on, seed, g,
}) => {
  if (on <= 0.01) return null;
  const late = 0.7 + 0.3 * Math.sin(g / (17 + rnd(seed) * 14) + seed * 2.3);
  const a = clamp01(on) * (0.62 + 0.38 * late);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: size, height: size,
      marginLeft: -size / 2, marginTop: -size / 2, borderRadius: "50%", pointerEvents: "none",
      background: `radial-gradient(circle, ${rgba(V.torch, 0.85 * a)} 0%, ${rgba(V.copper, 0.95 * a)} 40%, ${rgba(V.copper, 0)} 100%)`,
      boxShadow: `0 0 ${Math.round(size * 2.4)}px ${rgba(V.copper, 0.5 * a)}`,
    }} />
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
// LA BARRA DE VATIOS — el remate. Gráfico legítimo (es un gráfico), con su cifra encima.
// ════════════════════════════════════════════════════════════════════════════════════════════
const BarraW: React.FC<{
  x: number; base: number; h: number; w: number; valor: number; nombre: string;
  tint: string; lit: number; on: number; cifra: number;
}> = ({ x, base, h, w, valor, nombre, tint, lit, on, cifra }) => {
  if (on <= 0.01) return null;
  const alto = Math.max(2, h);
  const topPx = (base / 100) * 1080 - alto;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: 0, opacity: clamp01(on) }}>
      {cifra > 0.01 && (
        <div style={{
          position: "absolute", left: 0, top: topPx - 70, width: w + 190, marginLeft: -(w + 190) / 2,
          textAlign: "center", opacity: clamp01(cifra),
        }}>
          <div style={{
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(28 + 12 * lit), color: tint,
            lineHeight: 1, textShadow: `0 0 20px ${rgba(tint, 0.4)}, 0 4px 16px rgba(0,0,0,0.94)`,
          }}>{miles(valor)}<span style={{ fontSize: 19, marginLeft: 5, opacity: 0.85 }}>W</span></div>
          <div style={{
            fontFamily: F_BODY, fontWeight: 700, fontSize: 18, letterSpacing: 2.1, marginTop: 5,
            color: rgba(V.white, 0.40 + 0.5 * lit), textShadow: "0 3px 14px rgba(0,0,0,0.92)",
          }}>{nombre}</div>
        </div>
      )}
      <div style={{
        position: "absolute", left: 0, top: topPx, width: w, height: alto, marginLeft: -w / 2,
        borderRadius: 3,
        background: `linear-gradient(180deg, ${rgba(tint, 0.28 + 0.5 * lit)} 0%, ${rgba(tint, 0.07 + 0.15 * lit)} 100%)`,
        boxShadow: `inset 0 1px 0 ${rgba(V.white, 0.28 * lit)}, 0 0 ${Math.round(16 + 22 * lit)}px ${rgba(tint, 0.2 * lit)}`,
        borderTop: `3px solid ${rgba(tint, 0.55 + 0.45 * lit)}`,
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.18 * lit, mixBlendMode: "overlay",
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0 1px, rgba(0,0,0,0) 1px 9px)",
        }} />
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════════════════
export const MovLadronesB: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  // El build monta UN movimiento en UNA sola secuencia; igual traduzco a frames locales todo lo que
  // razona con `at` / `sheenAt` (Readout, SeamOcclude, el barrido especular de MediaCard).
  const lFrame = useCurrentFrame();
  const hayG = typeof gFrame === "number" && Number.isFinite(gFrame);
  const off = (hayG ? (gFrame as number) : lFrame) - lFrame;
  const L = (gAt: number) => gAt - off;

  // red de seguridad: si el build no manda un gFrame usable, arranco en la cabecera del acto.
  const ACT_IN = [0, 0, A2, A3, A4, A5];
  const gRaw = hayG ? (gFrame as number) : ACT_IN[Math.max(0, Math.min(5, Math.round(acto)))];
  const g = Math.max(0, Math.min(END, gRaw));

  // ══ LA CÁMARA — UNA sola, función de g, que NUNCA vuelve a cero ═══════════════════════════
  // Viaje base: z −300 (cerrada en el armario) → +40 (abierta sobre el patio); panY −12 → +14.
  const camB = gcam(g, { z0: -300, z1: 40, panX: 22, panY: 26, ry: -5.2, rx: 1.2, dur: END });
  // desviaciones LOCALES que se SUMAN (nunca reemplazan): la clavada al disco, el retroceso al
  // negro del laboratorio, y la apertura final. Empiezan y terminan en 0: el viaje base manda.
  const camZ = ip(g,
    [0, 150, 300, 400, 440, 530, 620, 780, 900, 1080, 1260, 1360, 1500, 1700, 1980],
    [0, -18, -46, 18, 34, -46, -84, -104, -118, -104, -92, -70, -44, -12, 0]);
  const camDrop = -12 + ip(g,
    [0, 300, 420, 620, 900, 1260, 1420, 1620, 1800, 1980],
    [0, -6, -14, -4, 6, 10, -6, -18, -8, 0]);
  const camTilt = ip(g, [0, 420, 780, 1260, 1620, 1840, 1980], [0, -0.5, -1.2, -2.2, -0.6, 1.4, 2.4]);
  // EL TRAVELLING de la frontera 3: la cámara se va hacia la izquierda y el mundo cambia debajo.
  const camPan = ip(g, [0, 1150, 1200, 1340, 1420, 1620, 1980], [0, 0, -26, -186, -196, -150, -96]);
  const camRyL = ip(g, [0, 1150, 1340, 1620, 1980], [0, 0, -3.4, -2, -0.6]);
  const camT =
    `${camB.transform} translateZ(${camZ.toFixed(1)}px) ` +
    `translate3d(${camPan.toFixed(1)}px, ${camDrop.toFixed(1)}px, 0) ` +
    `rotateX(${camTilt.toFixed(2)}deg) rotateY(${camRyL.toFixed(2)}deg)`;
  // la deriva de la cámara replicada en el HUD: el texto no queda pegado con cinta al vidrio
  const bx = Math.sin(g / 49) * 2.1 + Math.sin(g / 113) * 1.3;
  const by = Math.cos(g / 63) * 1.7;
  const hud = `translate(${(bx * 0.4).toFixed(2)}px, ${(by * 0.4).toFixed(2)}px)`;

  // ══ LA LUZ — LINTERNA EN EL ARMARIO → halógeno cálido → laboratorio volt → BRASA DE NOCHE ══
  const keyFrom = ip(g, [0, 180, 420, 620, 780, 1000, 1260, 1500, 1620, 1980],
    [0.42, 0.40, 0.52, 0.58, 0.34, 0.30, 0.44, 0.62, 0.70, 0.80]);
  const inten = ip(g, [0, 120, 420, 560, 780, 900, 1260, 1500, 1700, 1980],
    [0.62, 0.70, 0.96, 1.02, 0.66, 0.78, 0.72, 0.60, 0.52, 0.46]);
  const floor = ip(g, [0, 420, 780, 1260, 1620, 1980], [0.80, 0.70, 0.78, 0.74, 0.66, 0.58]);
  // torch (armario + halógeno) → volt (la medición) → copper (la brasa de los pilotos).
  // Las dos ramas valen lo mismo en g=900: la luz EVOLUCIONA, no salta.
  const tintA = g < 900
    ? light(ip(g, [0, 300, 470, 620, 800, 860], [0.06, 0.06, 0.00, 0.04, 0.70, 1]), "torch", "volt")
    : light(ip(g, [900, 1240, 1620, 1980], [0, 0.30, 0.78, 1]), "volt", "copper");
  const tintB = light(ip(g, [0, 420, 900, 1400, 1980], [0, 0.18, 0.42, 0.80, 1]), "amber", "copper");

  // ══ EL DISCO — su pista completa: temporizador → foco → eje → piloto → punto de la barra ═══
  const dkf = [0, 92, 150, 300, 386, 404, 420, 436, 470, 540, 700, 760, 780, 830, 900,
    1180, 1260, 1330, 1470, 1560, 1620, 1700, 1980];
  const dSize = ip(g, dkf, [0, 0, 210, 268, 300, 1700, 3400, 1900, 470, 430, 420, 300, 190,
    130, 96, 90, 78, 62, 54, 46, 30, 26, 26]);
  const dX = ip(g, dkf, [64, 64, 64, 58, 52, 50, 50, 50, 50, 46, 41, 45, 50, 50, 50,
    50, 50, 58, 56, 60, 68, 80, 80]);
  const dY = ip(g, dkf, [58, 58, 58, 53, 50, 50, 50, 50, 45, 42, 39, 43, 47, 49, 50,
    50, 50, 45, 47, 46, 58, 82.3, 82.3]);
  const dZ = ip(g, dkf, [0, 0, 10, 24, 40, 110, 160, 120, 30, 20, 14, 40, 90, 40, 10,
    10, 8, 6, 4, 2, -6, -20, -20]);
  const dRy = ip(g, [0, 150, 300, 386, 470, 700, 900, 1260, 1620, 1980],
    [0, -14, -8, -2, 3, 7, 4, 2, 0, 0]);
  // ⭐ EL VOLTEO DE MONEDA — la costura 1→2. De perfil exactamente en g=400.
  const dFlip = ip(g, [386, 414], [0, 1]);
  const dLit = ip(g, [0, 150, 420, 470, 620, 780, 900, 1980], [0.4, 1, 1, 1, 1, 0.7, 0.28, 0.2]);
  const dTabs = ip(g, [120, 210, 372, 396], [0, 1, 1, 0]);
  const dGlow = ip(g, [396, 420, 470, 620, 740, 830], [0, 0.5, 1, 0.92, 0.4, 0]);
  const dCore = ip(g, [830, 900, 1180, 1980], [0, 0.35, 1, 1]);
  const dDark = ip(g, [780, 860, 960, 1980], [0, 0.5, 0.9, 0.94]);
  const dLitColor = g < 780 ? V.torch : g < 980 ? V.volt : V.copper;

  // ══ LOS FANTASMAS — el carrusel 3D del acto 3 (5 ítems, material real en cada tarjeta) ═════
  const carRad = ipe(g, [792, 906], [46, 660], Easing.out(Easing.cubic));
  const carW = ipe(g, [792, 906], [90, 430], Easing.out(Easing.cubic));
  const carH = ipe(g, [792, 906], [56, 258], Easing.out(Easing.cubic));
  const carSpin = ip(g, [792, 1180, 1260, 1340], [0, 0.58, 0.66, 0.80]);
  const carFocus = Math.max(0, Math.min(4, Math.floor(ip(g, [830, 1180], [0, 4.99]))));
  const carY = ip(g, [792, 1000, 1180, 1340], [50, 49, 49, 44]);
  // salen por izquierda CON EL MISMO VECTOR que la cámara (eso ES el match-move)
  const carGo = ip(g, [1180, 1260, 1352], [0, -180, -1180]);
  const carZ = ip(g, [1180, 1352], [-40, -280]);

  // ══ EL LIVING A OSCURAS — entra por derecha en la frontera 3, con el vector opuesto ════════
  const livX = ipe(g, [1196, 1330], [136, 50], Easing.out(Easing.cubic));
  const livY = ip(g, [1196, 1330, 1560, 1620, 1720, 1830, 1980], [52, 50, 50, 50, 52, 55.5, 55.5]);
  const livW = ip(g, [1196, 1330, 1560, 1620, 1700, 1830, 1980], [1180, 1420, 1420, 1300, 760, 300, 300]);
  const livH = ip(g, [1196, 1330, 1560, 1620, 1700, 1830, 1980], [660, 800, 800, 730, 430, 176, 176]);
  const livZ = ip(g, [1196, 1330, 1560, 1620, 1760, 1980], [40, 30, 26, 10, -140, -240]);
  const livLit = ip(g, [1196, 1330, 1560, 1740, 1980], [0.5, 0.95, 1, 0.7, 0.44]);
  const livRy = ip(g, [1196, 1330, 1620, 1980], [-13, -1.5, -1, 2]);

  // ══ EL REMATE — las cuatro barras de vatios (el gráfico del acto 5) ════════════════════════
  const BASE = 84;                       // el piso del gráfico, en % de pantalla
  const ESC = 470 / 5000;                // px por vatio
  const hSec = ipe(g, [1658, 1742], [0, 5000 * ESC], Easing.out(Easing.cubic));
  const hCal = ipe(g, [1694, 1778], [0, 4500 * ESC], Easing.out(Easing.cubic));
  const hBom = ipe(g, [1730, 1808], [0, 750 * ESC], Easing.out(Easing.cubic));
  const hTod = ipe(g, [1772, 1826], [0, 65 * ESC], Easing.out(Easing.cubic));
  const vSec = ipe(g, [1658, 1742], [0, 5000], Easing.out(Easing.cubic));
  const vCal = ipe(g, [1694, 1778], [0, 4500], Easing.out(Easing.cubic));
  const vBom = ipe(g, [1730, 1808], [0, 750], Easing.out(Easing.cubic));
  // se hunden en la losa (geometría, no opacidad): la casa de noche se queda con el cuadro
  const barSink = ip(g, [1898, 1962], [1, 0]);
  const barOn = ip(g, [1650, 1668], [0, 1]);
  const barCifra = ip(g, [1660, 1690, 1888, 1930], [0, 1, 1, 0]);

  // ══ LA CASA DE NOCHE — el encuadre de salida, levantado por geometría bajo las barras ══════
  const casa = ip(g, [1826, 1900, 1980], [0, 0.72, 1]);
  const patio = ip(g, [1700, 1830, 1980], [0, 0.6, 1]);

  // ══ FONDOS — sólo cambian TAPADOS (g420 bajo el disco, g780 bajo la escalera) ══════════════
  const fondo = g < A2 ? 0 : g < A3 ? 1 : 2;
  const dimC = ip(g, [780, 900, 1260, 1400, 1620, 1760, 1980], [0.86, 0.80, 0.72, 0.52, 0.60, 0.82, 0.92]);

  // ══ CIFRAS ════════════════════════════════════════════════════════════════════════════════
  const horas = Math.round(ip(g, [176, 190, 206, 222, 238], [0, 5, 9, 7, 8]));
  const vatios10 = Math.round(ip(g, [508, 540, 574, 606, 636], [0, 180, 340, 460, 500]));
  const fant = Math.round(ip(g, [886, 916, 946, 976, 1006], [0, 16, 29, 37, 41]));

  // ══ TEXTO — UNA idea por acto, sobre <Bed>, titular ≥48 px ═════════════════════════════════
  const t1 = ip(g, [150, 174, 366, 392], [0, 1, 1, 0]);        // 6 palabras → ≥ 2,84 s · vive 8,0 s
  const t2 = ip(g, [496, 520, 726, 750], [0, 1, 1, 0]);        // 2 palabras → ≥ 2,00 s · vive 7,7 s
  const t3 = ip(g, [856, 882, 1196, 1226], [0, 1, 1, 0]);      // 4 palabras → ≥ 2,28 s · vive 11,3 s
  const t4 = ip(g, [1306, 1332, 1566, 1596], [0, 1, 1, 0]);    // 3 palabras → ≥ 2,00 s · vive 8,7 s
  const t5 = ip(g, [1676, 1702, 1918, 1948], [0, 1, 1, 0]);    // 4 palabras → ≥ 2,28 s · vive 8,1 s

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── LA ATMÓSFERA: se monta UNA vez y sólo EVOLUCIONA; nunca se remonta entre actos ── */}
      <VoltAtmos tint={tintA} tint2={tintB} keyFrom={keyFrom} intensity={inten} floor={floor} />

      {/* ══════════ EL ESPACIO 3D — planos con parallax propio, bajo UNA sola cámara ═══════ */}
      <Layers cam={camT}>

        {/* PLANO 1 · EL FONDO. Cambia SÓLO tapado: en g420 lo tapa el disco a 3400 px, en g780
            lo tapa la escalera + el occluder de acero. Del 780 al final NO vuelve a cambiar:
            sólo se apaga (la linterna se apaga y queda la noche). ------------------------- */}
        {fondo === 0 && (
          <PhotoPlane src="img/cmeurgente/cmeu_bomba.jpg" kind="photo" z={-620}
            scale={ip(g, [0, 420], [1.34, 1.20])}
            dim={ip(g, [0, 90, 250, 420], [0.86, 0.70, 0.62, 0.58])} tint={V.torch} />
        )}
        {fondo === 1 && (
          <PhotoPlane src="img/cmeurgente/cmeu_halogenos.jpg" kind="photo" z={-600}
            scale={ip(g, [420, 780], [1.30, 1.18])}
            dim={ip(g, [420, 520, 700, 780], [0.66, 0.46, 0.50, 0.62])} tint={V.amber} />
        )}
        {fondo === 2 && (
          <PhotoPlane src="img/cmeurgente/cmeu_decodificador.jpg" kind="photo" z={-640}
            scale={ip(g, [780, 1260, 1620, 1980], [1.34, 1.24, 1.18, 1.30])}
            dim={dimC} tint={V.copper} />
        )}

        {/* PLANO 2 · LA REJILLA DEL LABORATORIO (acto 3): aire con profundidad ------------- */}
        <Plane z={-430}>
          <AbsoluteFill style={{
            opacity: ip(g, [800, 900, 1200, 1330], [0, 0.26, 0.24, 0.03]),
            transform: `translateX(${(bx * 2.6).toFixed(2)}px)`,
            backgroundImage:
              `repeating-linear-gradient(90deg, ${rgba(V.volt, 0.09)} 0 1px, rgba(0,0,0,0) 1px 108px),` +
              `repeating-linear-gradient(0deg, ${rgba(V.volt, 0.06)} 0 1px, rgba(0,0,0,0) 1px 108px)`,
          }} />
        </Plane>

        {/* PLANO 3 · EL TEJADO DE LA CASA DE NOCHE — se levanta al final, sin paneles ------ */}
        {casa > 0.005 && (
          <RoofPlane
            y={ip(g, [1826, 1900, 1980], [58, 45, 41])}
            w={1560} h={300} rx={ip(g, [1826, 1980], [64, 50])}
            lit={0.20 + 0.28 * casa} z={-300} panels={0} />
        )}

        {/* PLANO 4 · LA LOSA DEL PATIO — el suelo del que salen las barras y sobre el que se
            apoya el plano final. Sube al cuadro por geometría, no por opacidad. ----------- */}
        {patio > 0.005 && (
          <PadPlane
            y={ip(g, [1700, 1830, 1980], [122, 92, 86])}
            w={1720} h={400} rx={ip(g, [1700, 1980], [70, 60])}
            lit={0.30 + 0.62 * patio} z={-170} />
        )}

        {/* PLANO 5 · LAS VENTANAS DE LA CASA — tres cuartos a oscuras con material REAL
            adentro. La del medio ES la tarjeta grande del living que viene del acto 4. ---- */}
        {casa > 0.02 && (
          <Plane z={-120}>
            <MediaCard src="img/cmeurgente/cmeu_microondas.jpg" kind="photo"
              w={ip(g, [1826, 1980], [150, 214])} h={ip(g, [1826, 1980], [92, 130])}
              x={ip(g, [1826, 1980], [34, 31])} y={ip(g, [1826, 1980], [58, 56])}
              z={-40} ry={9} radius={4}
              lit={0.24 + 0.3 * casa} litColor={V.copper} sheenAt={L(1902)} />
            <MediaCard src="img/cmeurgente/cmeu_cargadores.jpg" kind="photo"
              w={ip(g, [1826, 1980], [130, 190])} h={ip(g, [1826, 1980], [82, 118])}
              x={ip(g, [1826, 1980], [66, 69])} y={ip(g, [1826, 1980], [58, 56.5])}
              z={-40} ry={-9} radius={4}
              lit={0.20 + 0.26 * casa} litColor={V.copper} sheenAt={L(1918)} />
            <Piloto x={34} y={61.5} size={9} on={casa} seed={3.1} g={g} />
            <Piloto x={66} y={61.5} size={8} on={casa} seed={7.7} g={g} />
          </Plane>
        )}

        {/* PLANO 6 · LA TARJETA GRANDE DEL LIVING (acto 4) — entra por derecha en el
            match-move y termina siendo LA VENTANA DEL MEDIO de la casa. Material real. --- */}
        {g >= 1190 && (
          <Plane z={0}>
            <MediaCard src="broll/cmeurgente/cmeu_standby_mov.mp4" kind="video"
              w={livW} h={livH} x={livX} y={livY} z={livZ} ry={livRy}
              radius={g < 1760 ? 12 : 4} lit={livLit} litColor={V.copper}
              sheenAt={L(1352)} />
            {/* los pilotos rojos que la cámara va encontrando adentro del living */}
            {g < 1740 && (
              <>
                <Piloto x={livX - 22} y={livY - 9} size={ip(g, [1260, 1620], [15, 9])}
                  on={ip(g, [1268, 1300, 1660, 1730], [0, 1, 1, 0])} seed={1.7} g={g} />
                <Piloto x={livX - 5} y={livY + 12} size={ip(g, [1260, 1620], [12, 8])}
                  on={ip(g, [1300, 1332, 1660, 1730], [0, 1, 1, 0])} seed={4.3} g={g} />
                <Piloto x={livX + 19} y={livY - 3} size={ip(g, [1260, 1620], [17, 10])}
                  on={ip(g, [1340, 1372, 1660, 1730], [0, 1, 1, 0])} seed={9.1} g={g} />
              </>
            )}
          </Plane>
        )}

        {/* PLANO 7 · LOS CINCO FANTASMAS — carrusel 3D REAL, una foto o un clip por tarjeta.
            Nacen del disco (radio 46 → 660) y salen por izquierda con el vector de la cámara. */}
        {g >= 790 && g < 1356 && (
          <Plane z={-40} style={{ transform: `translateZ(${carZ.toFixed(0)}px) translateX(${carGo.toFixed(0)}px)` }}>
            <Carousel3D
              items={[
                { src: "img/cmeurgente/cmeu_decodificador.jpg", kind: "photo", label: "Decodificador" },
                { src: "broll/cmeurgente/cmeu_standby_mov.mp4", kind: "video", label: "Barra de sonido" },
                { src: "img/cmeurgente/cmeu_cargadores.jpg", kind: "photo", label: "Cargadores" },
                { src: "img/cmeurgente/cmeu_microondas.jpg", kind: "photo", label: "Microondas" },
                { src: "broll/cmeurgente/cmeu_standby_mov.mp4", kind: "video", label: "Impresora" },
              ]}
              spin={carSpin} radius={carRad} cardW={carW} cardH={carH}
              y={carY} focus={carFocus} litColor={V.copper} />
          </Plane>
        )}

        {/* PLANO 8 · LA BOMBA DE LA PISCINA — el objeto del acto 1, en tarjeta grande con el
            clip corriendo, y de vuelta al final chiquita en su rincón del patio. ---------- */}
        {g < 470 && (
          <Plane z={0}>
            <MediaCard src="broll/cmeurgente/cmeu_bomba_mov.mp4" kind="video"
              w={ip(g, [0, 60, 150, 300, 386, 440], [1500, 1340, 1120, 1020, 940, 900])}
              h={ip(g, [0, 60, 150, 300, 386, 440], [860, 770, 650, 592, 546, 522])}
              x={ip(g, [0, 60, 150, 300, 386, 440], [42, 44, 46, 47, 48, 48])}
              y={ip(g, [0, 60, 150, 300, 386, 440], [52, 51, 50, 49, 48, 47])}
              z={ip(g, [0, 300, 440], [-30, -60, -120])}
              ry={ip(g, [0, 300, 440], [5, 2, 0])} radius={12}
              lit={ip(g, [0, 40, 150, 300, 440], [0.30, 0.72, 1, 1, 0.9])}
              litColor={V.torch} sheenAt={L(96)} />
          </Plane>
        )}
        {patio > 0.05 && (
          <Plane z={90}>
            <MediaCard src="img/cmeurgente/cmeu_bomba.jpg" kind="photo"
              w={ip(g, [1760, 1980], [180, 262])} h={ip(g, [1760, 1980], [110, 160])}
              x={ip(g, [1760, 1980], [16, 13])} y={ip(g, [1760, 1980], [80, 76])}
              z={40} ry={16} rx={6} radius={6}
              lit={0.18 + 0.30 * patio} litColor={V.copper} sheenAt={L(1912)} />
          </Plane>
        )}

        {/* PLANO 9 · ⭐ EL DISCO — el objeto que cruza LAS CUATRO FRONTERAS ---------------- */}
        <Plane z={0}>
          <Disco
            x={dX} y={dY} size={dSize} z={dZ} flip={dFlip} ry={dRy}
            lit={dLit} litColor={dLitColor} tabs={dTabs} glow={dGlow} core={dCore} dark={dDark}
            sheen={L(g < 470 ? 240 : 500)} g={g} />
        </Plane>

        {/* PLANO 10 · LOS DIEZ FILAMENTOS del garaje (conteo gráfico sobre el riel del techo) */}
        <Plane z={40}>
          <Filamentos x={52} y={ip(g, [470, 620, 760], [72, 68, 64])} w={860}
            on={ip(g, [486, 640], [0, 10])} g={g}
            lit={ip(g, [470, 496, 728, 762], [0, 1, 1, 0])} />
        </Plane>

        {/* PLANO 11 · EL REMATE — las cuatro barras de vatios sobre la losa ---------------- */}
        {g >= 1648 && barSink > 0.004 && (
          <Plane z={-20}>
            <BarraW x={30} base={BASE} h={hSec * barSink} w={96} valor={vSec} nombre="SECADORA"
              tint={V.amber} lit={0.9} on={barOn} cifra={barCifra} />
            <BarraW x={46} base={BASE} h={hCal * barSink} w={96} valor={vCal} nombre="CALENTADOR"
              tint={V.amber} lit={0.8} on={barOn} cifra={barCifra} />
            <BarraW x={62} base={BASE} h={hBom * barSink} w={96} valor={vBom} nombre="BOMBA"
              tint={V.volt} lit={0.8} on={barOn} cifra={barCifra} />
            {/* LA PLAQUITA: sesenta y cinco vatios. Todo lo demás JUNTO. */}
            <BarraW x={80} base={BASE} h={hTod * barSink} w={168} valor={65} nombre="TODO LO DEMÁS"
              tint={V.copper} lit={1} on={barOn} cifra={0} />
            {/* la línea de piso del gráfico */}
            <div style={{
              position: "absolute", left: "50%", top: `${BASE}%`, width: 1180, marginLeft: -590,
              height: 2, opacity: 0.7 * barSink,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.26)}, rgba(0,0,0,0))`,
            }} />
          </Plane>
        )}

        {/* PLANO 12 · LO QUE VIVE ADENTRO DE LA PLAQUITA: refrigerador, cocina, lavadora,
            tele. Tarjetas MINÚSCULAS con material real, apoyadas sobre la barra de 65. ---- */}
        {g >= 1810 && barSink > 0.05 && (
          <Plane z={30}>
            <MediaCard src="img/cmeurgente/cmeu_microondas.jpg" kind="photo"
              w={ipe(g, [1812, 1868], [30, 120], Easing.out(Easing.cubic))}
              h={ipe(g, [1812, 1868], [18, 74], Easing.out(Easing.cubic))}
              x={74.5} y={ip(g, [1812, 1868, 1930], [82.3, 74.5, 74.5])}
              z={10} ry={11} radius={4} lit={0.62 * barSink} litColor={V.copper}
              sheenAt={L(1874)} opacity={clamp01(barSink * 1.6)} />
            <MediaCard src="img/cmeurgente/cmeu_cargadores.jpg" kind="photo"
              w={ipe(g, [1824, 1880], [30, 120], Easing.out(Easing.cubic))}
              h={ipe(g, [1824, 1880], [18, 74], Easing.out(Easing.cubic))}
              x={85.5} y={ip(g, [1824, 1880, 1930], [82.3, 74.5, 74.5])}
              z={10} ry={-11} radius={4} lit={0.62 * barSink} litColor={V.copper}
              sheenAt={L(1888)} opacity={clamp01(barSink * 1.6)} />
            <IconPng src="img/cmeurgente/cmeu_ic_congelador.png" x={80} y={66.5}
              size={ipe(g, [1836, 1888], [24, 74], Easing.out(Easing.cubic))} z={20}
              opacity={0.9 * clamp01(barSink * 1.6)}
              rot={ip(g, [1836, 1930], [-8, 2])} glow={V.ink0} />
          </Plane>
        )}

        {/* PLANO 13 · EL AGUA DE LA PISCINA — la materia que le entrego a MovCeroDolares.
            Primer plano, con el reflejo de la brasa roja moviéndose encima. --------------- */}
        {patio > 0.1 && (
          <Plane z={200}>
            <div style={{
              position: "absolute", left: "50%", bottom: `${ip(g, [1760, 1980], [-16, -4])}%`,
              width: 2400, height: 420, marginLeft: -1200,
              transform: `translateY(${ip(g, [1760, 1980], [180, 40]).toFixed(0)}px) rotateX(64deg)`,
              transformOrigin: "50% 100%", opacity: clamp01(patio),
              background: `linear-gradient(180deg, ${rgba(V.ink1, 0.5)} 0%, ${rgba(V.ink0, 0.94)} 74%)`,
              boxShadow: `inset 0 2px 0 ${rgba(V.sky, 0.18)}`,
            }}>
              {Array.from({ length: 11 }, (_, i) => {
                const o = rnd(i * 5.9);
                const yy = 8 + o * 78;
                const w = 90 + rnd(i * 2.2) * 300;
                const dz = Math.sin(g / (36 + o * 40) + i * 1.7);
                return (
                  <div key={i} style={{
                    position: "absolute", top: `${yy}%`, left: `${(10 + rnd(i * 8.1) * 74 + dz * 1.6).toFixed(2)}%`,
                    width: w, height: 2 + o * 3, borderRadius: 4,
                    background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(i % 3 === 0 ? V.copper : V.sky, 0.20 + 0.24 * Math.abs(dz))}, rgba(0,0,0,0))`,
                  }} />
                );
              })}
            </div>
          </Plane>
        )}

        {/* PLANO 14 · PRIMER PLANO — LA CHAPA DEL TANQUE que hereda de MovLadronesA: pegada
            al lente, se corre a la derecha y descubre la bomba. Algo pasa por DELANTE. ---- */}
        {g < 128 && (
          <Plane z={300}>
            <div style={{
              position: "absolute", top: "-24%", height: "150%", width: "86%",
              left: `${ipe(g, [0, 112], [-12, 96], Easing.out(Easing.cubic)).toFixed(1)}%`,
              transform: "rotate(-4deg)",
              background: `linear-gradient(96deg, ${rgba(V.ink0, 0.98)} 0%, ${rgba(V.steel, 0.30)} 46%, ${rgba(V.steel, 0.52)} 62%, ${rgba(V.ink0, 0.96)} 100%)`,
              boxShadow: `0 0 90px ${rgba(V.ink0, 0.9)}`,
            }}>
              <AbsoluteFill style={{
                opacity: 0.30, mixBlendMode: "overlay",
                backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.45) 0 1px, rgba(0,0,0,0) 1px 22px)",
              }} />
            </div>
          </Plane>
        )}

        {/* PLANO 15 · ÍCONOS PNG como objetos de la escena, con su parallax --------------- */}
        {g >= 236 && g < 372 && (
          <Plane z={70}>
            <IconPng src="img/cmeurgente/cmeu_ic_reloj.png" x={82} y={62}
              size={ip(g, [236, 268], [76, 126])} z={0}
              opacity={ip(g, [236, 264, 344, 370], [0, 0.94, 0.94, 0])}
              rot={ip(g, [236, 370], [-9, 5])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 900 && g < 1180 && (
          <Plane z={80}>
            <IconPng src="img/cmeurgente/cmeu_ic_fantasma.png" x={ip(g, [900, 1180], [84, 78])}
              y={ip(g, [900, 1180], [26, 32])}
              size={ip(g, [900, 960, 1180], [70, 138, 126])} z={0}
              opacity={ip(g, [900, 946, 1140, 1178], [0, 0.92, 0.92, 0])}
              rot={ip(g, [900, 1178], [-12, 6])} glow={V.ink0} />
          </Plane>
        )}
        {g >= 1330 && g < 1560 && (
          <Plane z={80}>
            <IconPng src="img/cmeurgente/cmeu_ic_enchufe.png" x={18} y={64}
              size={ip(g, [1330, 1372], [72, 122])} z={0}
              opacity={ip(g, [1330, 1368, 1522, 1558], [0, 0.86, 0.86, 0])}
              rot={ip(g, [1330, 1558], [7, -5])} glow={V.ink0} />
          </Plane>
        )}
      </Layers>

      {/* ══════ COSTURA · FRONTERA 2 (g780) — OCLUSIÓN: la escalera de aluminio ═══════════ */}
      {/* la materia (aluminio) cruza en primer plano y detrás YA está el negro con el disco */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Escalera p={ip(g, [750, 816], [0, 1])} />
      </AbsoluteFill>
      <SeamOcclude at={L(766)} dur={28} color={V.steel} angle={-12} />

      {/* ══════ LA FIRMA DEL VIDEO — SunField en sus dos usos ═════════════════════════════ */}
      {/* acto 1: OCHO de veinticuatro celdas — las ocho horas que la bomba lleva programadas */}
      {g >= 150 && g < 386 && (
        <SunField sun={8 / 24} from={9} use={0}
          on={ip(g, [152, 182, 352, 384], [0, 0.9, 0.9, 0])}
          tint={V.volt} night={V.sky} y={90} w={900} h={26} cycle={240} />
      )}
      {/* acto 4: LAS VEINTICUATRO — todas encendidas, en la brasa de los pilotos */}
      {g >= 1300 && g < 1600 && (
        <SunField sun={1} from={0} use={0}
          on={ip(g, [1302, 1336, 1566, 1598], [0, 0.86, 0.86, 0])}
          tint={V.copper} night={V.sky} y={91} w={1020} h={24} cycle={300} />
      )}

      {/* ══════ HUD — texto y cifras en espacio de pantalla (safe area 60 px) ═════════════ */}
      <AbsoluteFill style={{ pointerEvents: "none", transform: hud }}>

        {/* CIFRA · ACTO 1 — OCHO HORAS */}
        {g >= 172 && g < 392 && (
          <div style={{ opacity: ip(g, [172, 188, 366, 390], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "79%", top: "26%", width: 470, height: 300,
              marginLeft: -235, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={String(horas)} unit="h" label="CADA DÍA" at={L(176)}
              x={79} y={26} size={124} color={V.volt} align="center" />
          </div>
        )}

        {/* CIFRA · ACTO 2 — LOS DIEZ JUNTOS */}
        {g >= 504 && g < 748 && (
          <div style={{ opacity: ip(g, [504, 522, 722, 746], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "80%", top: "27%", width: 470, height: 290,
              marginLeft: -235, marginTop: -145,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value={miles(vatios10)} unit="W" label="LOS DIEZ JUNTOS" at={L(508)}
              x={80} y={27} size={106} color={V.amber} align="center" />
          </div>
        )}

        {/* CIFRA · ACTO 3 — CUARENTA Y UN VATIOS, apagados */}
        {g >= 882 && g < 1224 && (
          <div style={{ opacity: ip(g, [882, 900, 1198, 1222], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "22%", top: "24%", width: 500, height: 300,
              marginLeft: -250, marginTop: -150,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.84), rgba(8,9,6,0))",
            }} />
            <Readout value={String(fant)} unit="W" label="APAGADOS" at={L(886)}
              x={22} y={24} size={128} color={V.copper} align="center" />
          </div>
        )}

        {/* CIFRA · ACTO 4 — LAS VEINTICUATRO HORAS */}
        {g >= 1336 && g < 1594 && (
          <div style={{ opacity: ip(g, [1336, 1356, 1568, 1592], [0, 1, 1, 0]) }}>
            <div style={{
              position: "absolute", left: "80%", top: "70%", width: 440, height: 280,
              marginLeft: -220, marginTop: -140,
              background: "radial-gradient(closest-side, rgba(8,9,6,0.82), rgba(8,9,6,0))",
            }} />
            <Readout value="24" unit="h" label="SIN PARAR" at={L(1340)}
              x={80} y={70} size={112} color={V.copper} align="center" />
          </div>
        )}

        {/* CIFRA · ACTO 5 — SESENTA Y CINCO, pegada a la plaquita */}
        {g >= 1826 && g < 1946 && (
          <div style={{
            position: "absolute", left: "78%", top: "70%", transform: "translate(-50%,-50%)",
            opacity: ip(g, [1826, 1848, 1918, 1944], [0, 1, 1, 0]), textAlign: "center",
          }}>
            <Bed pad={16} w={300}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <Num size={92} color={V.copper}>65</Num>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 34, color: rgba(V.copper, 0.82),
                }}>W</div>
              </div>
              <div style={{
                fontFamily: F_BODY, fontWeight: 700, fontSize: 20, letterSpacing: 2.4, marginTop: 4,
                color: rgba(V.white, 0.66), textTransform: "uppercase",
              }}>Los cuatro juntos</div>
            </Bed>
          </div>
        )}

        {/* ACTO 1 · OCHO HORAS DESDE HACE SIETE AÑOS */}
        {t1 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "66%", opacity: t1,
            transform: `translateY(${((1 - t1) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={690} pad={24}>
              <Kick color={V.volt}>El segundo ladrón</Kick>
              <div style={{ height: 8 }} />
              <Head size={62}>OCHO HORAS DESDE HACE SIETE AÑOS</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>La bomba de la piscina, con el temporizador que <Em>nadie volvió a tocar</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 2 · DIEZ HALÓGENOS */}
        {t2 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "11%", opacity: t2,
            transform: `translateY(${((1 - t2) * -24).toFixed(1)}px)`,
          }}>
            <Bed w={660} pad={24}>
              <Kick color={V.amber}>El tercer ladrón</Kick>
              <div style={{ height: 8 }} />
              <Head size={74}>DIEZ HALÓGENOS</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Cincuenta vatios cada uno, <Em color={V.amber}>en el techo del garaje</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 3 · CUARENTA Y UN VATIOS */}
        {t3 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "68%", opacity: t3,
            transform: `translateY(${((1 - t3) * 24).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.copper}>El cuarto ladrón</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>CUARENTA Y UN VATIOS</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>De aparatos <Em color={V.copper}>apagados</Em> que nadie ve</Body>
            </Bed>
          </div>
        )}

        {/* ACTO 4 · LAS VEINTICUATRO HORAS */}
        {t4 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "13%", opacity: t4,
            transform: `translateY(${((1 - t4) * -22).toFixed(1)}px)`,
          }}>
            <Bed w={660} pad={24}>
              <Kick color={V.copper}>Y no descansan</Kick>
              <div style={{ height: 8 }} />
              <Head size={66}>LAS VEINTICUATRO HORAS</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Todos los días del año, <Em color={V.copper}>sin que los enciendas</Em></Body>
            </Bed>
          </div>
        )}

        {/* ACTO 5 · TODO LO DEMÁS JUNTO */}
        {t5 > 0.01 && (
          <div style={{
            position: "absolute", left: "6%", top: "14%", opacity: t5,
            transform: `translateY(${((1 - t5) * -22).toFixed(1)}px)`,
          }}>
            <Bed w={700} pad={24}>
              <Kick color={V.copper}>El remate</Kick>
              <div style={{ height: 8 }} />
              <Head size={68}>TODO LO DEMÁS JUNTO</Head>
              <div style={{ height: 10 }} />
              <Body size={30}>Refrigerador, cocina, lavadora y tele. <Em color={V.copper}>Eso es todo.</Em></Body>
            </Bed>
          </div>
        )}
      </AbsoluteFill>

      {/* ══════ LA VIÑETA — el armario está cerrado y el patio se abre. Nunca llega a negro. */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: `radial-gradient(${ip(g, [0, 780, 1620, 1980], [104, 116, 126, 138]).toFixed(0)}% ` +
          `${ip(g, [0, 780, 1620, 1980], [88, 98, 106, 118]).toFixed(0)}% at ` +
          `${ip(g, [0, 420, 900, 1340, 1980], [48, 50, 50, 44, 50]).toFixed(0)}% ` +
          `${ip(g, [0, 900, 1980], [46, 48, 52]).toFixed(0)}%, rgba(0,0,0,0) ` +
          `${ip(g, [0, 780, 1620, 1980], [34, 40, 48, 56]).toFixed(0)}%, ` +
          `rgba(6,7,5,${ip(g, [0, 420, 780, 1260, 1620, 1980], [0.72, 0.58, 0.66, 0.60, 0.44, 0.30]).toFixed(3)}) 100%)`,
      }} />
    </AbsoluteFill>
  );
};
